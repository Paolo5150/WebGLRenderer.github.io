

var canvas = document.getElementById('mycanvas');
var gl = canvas.getContext('webgl2');
var textureExtensions = gl.getExtension("WEBGL_draw_buffers");
var colorBufferFloatExtension = this.gl.getExtension('EXT_color_buffer_float');
let renderer =  new Renderer(canvas.width, canvas.height)
let camera = Camera.perspective(60,16.0/9.0,0.1,50)
camera.position = [0 , 8 , 5]
camera.updateView()
var cameraAngle = Math.PI / 2.0

var cameraDistance = 10

var deer = null
var cube = null

let directionalLight = new DirectionalLight()

//Post process framebuffers
var regularSceneFrameBuffer = new Framebuffer(canvas.width, canvas.height)
regularSceneFrameBuffer.addColorAttachmentFloatFormat( 1)
regularSceneFrameBuffer.addDepthAttachment()

var bloomEffect = new BloomEffect(canvas.width, canvas.height)

//Post processing materials and textures
let hdrPostProcessMaterial = getPostProcessHDRMaterial()
hdrPostProcessMaterial.addTexture("uSampler_1",regularSceneFrameBuffer.attachments['color0'])
hdrPostProcessMaterial.addTexture("bloomBlur", bloomEffect.blurFrameBuffer[1].attachments['color0'])


$( document ).ready(function() {

var textureOnlyShader = createShaderProgram(getTextureOnlyShaderVertex(), getTextureOnlyShaderFragment())
let textureOnlyMaterial = new Material(textureOnlyShader)
textureOnlyMaterial.addTexture("uSampler_1",directionalLight.shadowFrameBuffer.attachments['depth'])

let woodMat = getWoodMaterial(camera)
let untexturedMat = getUntexturedMaterial(camera, [1,1,1])
let pbrMat = getPBRMaterial(camera)
pbrMat.addTexture("shadowMap", directionalLight.shadowFrameBuffer.attachments['depth'])

let floorMat = geFloorMaterial(camera)
floorMat.addTexture("shadowMap", directionalLight.shadowFrameBuffer.attachments['depth'])
woodMat.addTexture("shadowMap", directionalLight.shadowFrameBuffer.attachments['depth'])

//Add lightSpace to materials so they receive shadows
untexturedMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix })
pbrMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix})
floorMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix })
woodMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix  })

let textureViewer = new MeshRenderer(getQuadMesh(), textureOnlyMaterial)
textureViewer.scale = [0.3,0.7,1.0]
textureViewer.position = [-0.8,0.0,0.0]

Framebuffer.unbind()

let screenQuad = new MeshRenderer(getQuadMesh(), hdrPostProcessMaterial)
let floor = new MeshRenderer(getQuadMesh(), floorMat)

floor.rotation[0] = -90
floor.position = [0,0,-1]
floor.scale = [15,15,15]
renderer.addMeshRenderer(floor)

loadOBJ("webgl/models/cubic.obj").then((value) => {
    if(value != undefined)
    {
        let meshR = new MeshRenderer(value,untexturedMat)
        meshR.position = [-2,4,2]
        meshR.rotation = [0,0,0]

        renderer.addMeshRenderer(meshR)
        cube = meshR
    }
})

loadOBJ("webgl/models/deer.obj").then((value) => {
    if(value != undefined)
    {
        let meshR = new MeshRenderer(value,pbrMat)
        meshR.position = [0,0,0]
        meshR.scale = [0.01,0.01,0.01]
        meshR.rotation = [0,0,0]

        renderer.addMeshRenderer(meshR)
        deer = meshR
    }
})




var prev = 0;
var now = 0
var delta = 0
var render = function(time) {

    now = time
    delta = (now - prev) * 0.001;
    prev = now


    if(leftButtonDown)
    {
        cameraDistance -= mousePositionDelta[1] * delta * 10
    }
    else
    {
        camera.position[1] += mousePositionDelta[1] * delta * 10
    }

    cameraAngle += mousePositionDelta[0] * delta 

    camera.position[0] = Math.cos(cameraAngle) * cameraDistance
    camera.position[2] = Math.sin(cameraAngle) * cameraDistance



    camera.updateView()

    if(deer != null)
        deer.rotation[1] += delta * 20

    directionalLight.updateLightFromUI(uiManager)
    directionalLight.updateShadowMap(renderer, time) 
   
    //Render scene to frame buffer
    regularSceneFrameBuffer.bind()
    renderer.clearAll(0,0,0,1)        
    renderer.render(camera,time)

    bloomEffect.update(renderer, camera, time,cube)
   
    //Quad to screen
    Framebuffer.unbind()
    renderer.clearAll(0,0,0,1)       

    gl.viewport(0, 0, canvas.width, canvas.height);
    renderer.renderMeshRendererForceMaterial(camera,time,screenQuad, hdrPostProcessMaterial)


    //Texture viewer
    renderer.renderMeshRenderer(camera,time,textureViewer)

    window.requestAnimationFrame(render)
}

render(0)
});
