


var canvas = document.getElementById('mycanvas');
var gl = canvas.getContext('webgl2');
var extensions = gl.getExtension("WEBGL_depth_texture");
var textureExtensions = gl.getExtension("WEBGL_draw_buffers");
var colorBufferFloatExtension = this.gl.getExtension('EXT_color_buffer_float');
let renderer =  new Renderer(canvas.width, canvas.height)
let camera = new Camera()

var deer = null

//Post process framebuffer
var frameBuf = new Framebuffer()
frameBuf.addColorAttachmentFloatFormat(canvas.width, canvas.height, 1)
frameBuf.addDepthAttachment(canvas.width, canvas.height)

$( document ).ready(function() {

let woodMaterial = getWoodMaterial()
let quadMaterial = getPostProcessHDRMaterial()

let quad = new MeshRenderer(getQuadMesh(), quadMaterial)

loadOBJ("webgl/models/Deer.obj").then((value) => {
    if(value != undefined)
    {

        let meshR = new MeshRenderer(value, woodMaterial)
        meshR.scale = [0.01,0.01,0.01]
        meshR.position = [0,-2.6,-7]
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

    if(deer != null)
    {
        deer.rotation[1] += delta / 5.0
    }

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
