

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

var shadowCameraSize = 4
let shadowCamera = Camera.ortho(-shadowCameraSize,shadowCameraSize,-shadowCameraSize,shadowCameraSize,0.1,60)

shadowCamera.position = [0,0,10]
shadowCamera.updateView()


//Shadow frame buffera
var shadowFrameBuf = new Framebuffer(2048,2048)
shadowFrameBuf.addDepthAttachmentFloat()
shadowFrameBuf.setNoColor()

//Post process framebuffer
var regularSceneFrameBuffer = new Framebuffer(canvas.width, canvas.height)
regularSceneFrameBuffer.addColorAttachmentFloatFormat( 1)
regularSceneFrameBuffer.addDepthAttachment()

var brightnessFrameBuf = new Framebuffer(canvas.width, canvas.height)
brightnessFrameBuf.addColorAttachmentFloatFormat( 1)
brightnessFrameBuf.addDepthAttachment()


$( document ).ready(function() {

var textureOnlyShader = createShaderProgram(getTextureOnlyShaderVertex(), getTextureOnlyShaderFragment())
let textureOnlyMaterial = new Material(textureOnlyShader)
textureOnlyMaterial.addTexture("uSampler_1",brightnessFrameBuf.attachments['color0'])

let woodMat = getWoodMaterial(camera)
let pbrMat = getPBRMaterial(camera)
pbrMat.addTexture("shadowMap", shadowFrameBuf.attachments['depth'])

let depthRender = getDepthRenderMaterial()
let floorMat = geFloorMaterial(camera)
floorMat.addTexture("shadowMap", shadowFrameBuf.attachments['depth'])
woodMat.addTexture("shadowMap", shadowFrameBuf.attachments['depth'])

pbrMat.addMat4Uniform("lightSpace", ()=>{
    var ls = mat4.create()
    ls = mat4.mul(ls, shadowCamera.projection, shadowCamera.view)
    return ls
})

floorMat.addMat4Uniform("lightSpace", ()=>{
        var ls = mat4.create()
        ls = mat4.mul(ls, shadowCamera.projection, shadowCamera.view)
        return ls
    })
woodMat.addMat4Uniform("lightSpace", ()=>{
        var ls = mat4.create()
        ls = mat4.mul(ls, shadowCamera.projection, shadowCamera.view)
        return ls

    })

let textureViewer = new MeshRenderer(getQuadMesh(), textureOnlyMaterial)
textureViewer.scale = [0.3,0.7,1.0]
textureViewer.position = [-0.8,0.0,0.0]

Framebuffer.unbind()

let basicPostProcessMaterial = getPostProcessBasicMaterial()
basicPostProcessMaterial.addTexture("uSampler_1",regularSceneFrameBuffer.attachments['color0'])

let hdrPostProcessMaterial = getPostProcessHDRMaterial()
hdrPostProcessMaterial.addTexture("uSampler_1",regularSceneFrameBuffer.attachments['color0'])

let brightnessExtractProcessMaterial = getPostProcessBrightnessExtractMaterial()
brightnessExtractProcessMaterial.addTexture("uSampler_1",regularSceneFrameBuffer.attachments['color0'])


let screenQuad = new MeshRenderer(getQuadMesh(), basicPostProcessMaterial)
let floor = new MeshRenderer(getQuadMesh(), floorMat)

floor.rotation[0] = -90
floor.position = [0,0,-1]
floor.scale = [15,15,15]
renderer.addMeshRenderer(floor)

loadOBJ("webgl/models/cubic.obj").then((value) => {
    if(value != undefined)
    {
        let meshR = new MeshRenderer(value,pbrMat)
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



    //Create shadow depth 
    shadowFrameBuf.bind();

    var lightNorm = vec3.create()
    lightNorm = vec3.normalize(lightNorm, uiManager.lightDir)

    lightNorm[0] *=-1 * shadowCamera.farPlane *0.5
    lightNorm[1] *=-1* shadowCamera.farPlane *0.5
    lightNorm[2] *=-1* shadowCamera.farPlane *0.5

    var toLight = vec3.create()
    toLight = vec3.add(toLight, [0,1.5,0], lightNorm);

    //randomQuad.position = toLightd
    shadowCamera.position = toLight
    shadowCamera.target = [0,1.5,0]

    shadowCamera.updateView()

    renderer.clearAll(0,0,0,1)
    gl.frontFace(gl.CW)

    renderer.renderForceMaterial(shadowCamera,time, depthRender)
    Framebuffer.unbind()
    gl.frontFace(gl.CCW)
   
    //Render scene to frame buffer
    regularSceneFrameBuffer.bind()
    renderer.clearAll(0,0,0,1)        
    // Render scene to post process frame buffer
    renderer.render(camera,time)
    Framebuffer.unbind()

    //Create texture with extracted brightness
    brightnessFrameBuf.bind()
    renderer.clearAll(0,0,0,1)        
    screenQuad.material = brightnessExtractProcessMaterial
    renderer.renderMeshRenderer(camera,time,screenQuad)
    
    //Quad to screen
    Framebuffer.unbind()
    renderer.clearAll(0,0,0,1)    
    gl.viewport(0, 0, canvas.width, canvas.height);
    screenQuad.material = hdrPostProcessMaterial
    renderer.renderMeshRenderer(camera,time,screenQuad)

    //Texture viewer
    renderer.renderMeshRenderer(camera,time,textureViewer)

    window.requestAnimationFrame(render)
}

render(0)
});
