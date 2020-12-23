


var canvas = document.getElementById('mycanvas');
var gl = canvas.getContext('webgl2');
var extensions = gl.getExtension("WEBGL_depth_texture");
var textureExtensions = gl.getExtension("WEBGL_draw_buffers");
var colorBufferFloatExtension = this.gl.getExtension('EXT_color_buffer_float');
let renderer =  new Renderer(canvas.width, canvas.height)
let camera = new Camera()

let text = Texture.FromURL('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/385064a4-77d4-4bb1-927b-2dcf9f0fb658/d1hnki3-3070ff4b-08e2-4ce6-bd29-59dfb277fb0d.jpg/v1/fill/w_600,h_600,q_75,strp/tileable_wood_texture_by_ftourini_stock_d1hnki3-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD02MDAiLCJwYXRoIjoiXC9mXC8zODUwNjRhNC03N2Q0LTRiYjEtOTI3Yi0yZGNmOWYwZmI2NThcL2QxaG5raTMtMzA3MGZmNGItMDhlMi00Y2U2LWJkMjktNTlkZmIyNzdmYjBkLmpwZyIsIndpZHRoIjoiPD02MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.MGgFuUmkYOmpjtHxXXOs19TAXjOpDrUAlCsYteKUwBE')
let text2 = Texture.FromURL('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIn0bCp877UmRpBKEwjWUqwFBIOzGyq8t8qQ&usqp=CAU')

var basicShader = createShaderProgram(getBasicVertex(), getBasicFragment())
var tonemapShader = createShaderProgram(getTonemapVertex(), getTonemapFragment())

var deer = null

var frameBuf = new Framebuffer()
frameBuf.addColorAttachmentFloatFormat(canvas.width, canvas.height, 1)
frameBuf.addDepthAttachment(canvas.width, canvas.height)

$( document ).ready(function() {

let testMaterial = new Material(basicShader)
testMaterial.addTexture("uSampler_1",text)
testMaterial.onPreRender = ()=>{
    var dirLightUniform = gl.getUniformLocation(testMaterial.shader, "dirLight")
    gl.uniform3fv(dirLightUniform, [uiManager.lightDir[0], uiManager.lightDir[1], uiManager.lightDir[2]]);
}


let quadMaterial = new Material(tonemapShader)
quadMaterial.addTexture("uSampler_1",frameBuf.attachments['color0'])
quadMaterial.onPreRender = ()=>{

    var gamma = gl.getUniformLocation(quadMaterial.shader, "gamma")
    gl.uniform1f(gamma, 0.8);

    var exp = gl.getUniformLocation(quadMaterial.shader, "exposure")
    gl.uniform1f(exp, 2.0);
}

let quad = new MeshRenderer(getQuadMesh(), quadMaterial)

loadOBJ("webgl/models/Deer.obj").then((value) => {
    if(value != undefined)
    {

        let meshR = new MeshRenderer(value, testMaterial)
        meshR.scale[0] = 0.01
        meshR.scale[1] = 0.01
        meshR.scale[2] = 0.01

        meshR.position[2] = -7
        meshR.position[1] = -2.6
        meshR.position[0] = 0

        meshR.rotation[2] = 0
        meshR.rotation[1] = 0
        meshR.rotation[0] = 0
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
