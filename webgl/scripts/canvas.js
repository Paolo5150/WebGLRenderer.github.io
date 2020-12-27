

var canvas = document.getElementById('mycanvas');
var gl = canvas.getContext('webgl2');
var textureExtensions = gl.getExtension("WEBGL_draw_buffers");
var colorBufferFloatExtension = this.gl.getExtension('EXT_color_buffer_float');
let renderer =  new Renderer(canvas.width, canvas.height)
let camera = Camera.perspective(60,16.0/9.0,0.1,50)
camera.position = [0 , 0 , 5]
camera.updateView()

var deer = null

var shadowCameraSize = 5
let shadowCamera = Camera.ortho(-shadowCameraSize,shadowCameraSize,-shadowCameraSize,shadowCameraSize,0.1,50)
shadowCamera.position = [0,0,10]
shadowCamera.updateView()

//Shadow frame buffera
var shadowFrameBuf = new Framebuffer(2048,2048)
shadowFrameBuf.addDepthAttachmentFloat()
shadowFrameBuf.setNoColor()

//Post process framebuffer
var frameBuf = new Framebuffer(canvas.width, canvas.height)
frameBuf.addColorAttachmentFloatFormat( 1)
frameBuf.addDepthAttachment()



var textureOnlyShader = createShaderProgram(getTextureOnlyShaderVertex(), getTextureOnlyShaderFragment())
let textureOnlyMaterial = new Material(textureOnlyShader)
textureOnlyMaterial.addTexture("uSampler_1",shadowFrameBuf.attachments['depth'])

let woodMat = getWoodMaterial(camera)
let unlitMat = getUnlitMaterial()
let floorMat = geFloorMaterial(camera)
floorMat.addTexture("shadowMap", shadowFrameBuf.attachments['depth'])


let quadViewer = new MeshRenderer(getQuadMesh(), textureOnlyMaterial)
quadViewer.scale = [0.3,0.7,1.0]
quadViewer.position = [-0.8,0.0,0.0]

Framebuffer.unbind()

$( document ).ready(function() {

let quad = new MeshRenderer(getQuadMesh(), getPostProcessHDRMaterial())
let floor = new MeshRenderer(getQuadMesh(), floorMat)

let randomQuad = new MeshRenderer(getQuadMesh(), woodMat)

//renderer.addMeshRenderer(randomQuad)

floor.rotation[0] = -90
floor.position = [0,0,0]
floor.scale = [10,10,10]
renderer.addMeshRenderer(floor)



loadOBJ("webgl/models/deer.obj").then((value) => {
    if(value != undefined)
    {
        let meshR = new MeshRenderer(value,woodMat)
        meshR.scale = [0.01,0.01,0.01]
        meshR.position = [0,0,0]
        meshR.rotation = [0,0,0]

        renderer.addMeshRenderer(meshR)
        deer = meshR
        camera.target = meshR.position

 
    }
})

var prev = 0;
var now = 0
var delta = 0
var render = function(time) {


    moving = false     
    
    now = time
    delta = (now - prev) * 0.001;
    prev = now

    camera.position[1] += mousePositionDelta[1] * delta * 10
    camera.position[0] += mousePositionDelta[0] * delta * 10
    camera.updateView()


    //Create shadow depth 
    shadowFrameBuf.bind();
    var mid = camera.getFrustumMidPoint()

    var lightNorm = vec3.create()
    lightNorm = vec3.normalize(lightNorm, uiManager.lightDir)

    lightNorm[0] *=-1 * shadowCamera.farPlane *0.8
    lightNorm[1] *=-1* shadowCamera.farPlane *0.8
    lightNorm[2] *=-1* shadowCamera.farPlane *0.8

    var toLight = vec3.create()
    toLight = vec3.add(toLight, [0,0,0], lightNorm);

    //randomQuad.position = toLightd
    shadowCamera.position = toLight
    shadowCamera.target = [0,0,0]

    shadowCamera.updateView()

    //Tricky javascript stuff
    floorMat.lightSpace = mat4.create()
    floorMat.lightSpace = mat4.mul(floorMat.lightSpace, shadowCamera.projection, shadowCamera.view)



    renderer.clearAll(0,0,0,1)
    gl.disable(gl.CULL_FACE);

    renderer.renderForceMaterial(shadowCamera,time, unlitMat)
    Framebuffer.unbind()
    gl.enable(gl.CULL_FACE);


    //Render scene to frame buffer
    frameBuf.bind()
    renderer.clearAll(0,0,0,1)
    renderer.render(camera,time)
    Framebuffer.unbind()

    renderer.clearAll(0,0,0,1)

    
    gl.viewport(0, 0, canvas.width, canvas.height);

    //Full screen quad with frame buffer image of scene
    renderer.renderMeshRenderer(camera,time,quad)
    
    //Texture viewer
    renderer.renderMeshRenderer(camera,time,quadViewer)

    window.requestAnimationFrame(render)
}

render(0)
});
