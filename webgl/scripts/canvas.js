


var canvas = document.getElementById('mycanvas');
var gl = canvas.getContext('webgl2');
var extensions = gl.getExtension("WEBGL_depth_texture");
var textureExtensions = gl.getExtension("WEBGL_draw_buffers");
var colorBufferFloatExtension = this.gl.getExtension('EXT_color_buffer_float');
let renderer =  new Renderer(canvas.width, canvas.height)
let camera = new Camera()
camera.position = [0 , 3 , 10]
camera.updateView()
var deer = null

//Post process framebuffer
var frameBuf = new Framebuffer()
frameBuf.addColorAttachmentFloatFormat(canvas.width, canvas.height, 1)
frameBuf.addDepthAttachment(canvas.width, canvas.height)

$( document ).ready(function() {

let quad = new MeshRenderer(getQuadMesh(), getPostProcessHDRMaterial())
let floor = new MeshRenderer(getQuadMesh(), geFloorMaterial())
floor.rotation[0] = -90
floor.position = [0,0,0]
floor.scale = [10,10,10]
renderer.addMeshRenderer(floor)


loadOBJ("webgl/models/Deer.obj").then((value) => {
    if(value != undefined)
    {
        let meshR = new MeshRenderer(value, getWoodMaterial())
        meshR.scale = [0.01,0.01,0.01]
        meshR.position = [0,0,0]
        meshR.rotation = [0,0,0]
        renderer.addMeshRenderer(meshR)
        deer = meshR

 
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

    frameBuf.bind()
    renderer.clearAll(0,0,0,1)
    gl.enable(gl.DEPTH_TEST);
    renderer.render(camera,time)
    Framebuffer.unbind()

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    renderer.renderMeshRenderer(camera,time,quad)

    window.requestAnimationFrame(render)
}

render(0)
});
