


var canvas = document.getElementById('mycanvas');
var gl = canvas.getContext('experimental-webgl');
let renderer =  new Renderer(canvas.width, canvas.height)
let camera = new Camera()

let text = new Texture('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/385064a4-77d4-4bb1-927b-2dcf9f0fb658/d1hnki3-3070ff4b-08e2-4ce6-bd29-59dfb277fb0d.jpg/v1/fill/w_600,h_600,q_75,strp/tileable_wood_texture_by_ftourini_stock_d1hnki3-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD02MDAiLCJwYXRoIjoiXC9mXC8zODUwNjRhNC03N2Q0LTRiYjEtOTI3Yi0yZGNmOWYwZmI2NThcL2QxaG5raTMtMzA3MGZmNGItMDhlMi00Y2U2LWJkMjktNTlkZmIyNzdmYjBkLmpwZyIsIndpZHRoIjoiPD02MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.MGgFuUmkYOmpjtHxXXOs19TAXjOpDrUAlCsYteKUwBE')

let text2 = new Texture('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIn0bCp877UmRpBKEwjWUqwFBIOzGyq8t8qQ&usqp=CAU')


var shaderProgram = createShaderProgram(getBasicVertex(), getBasicFragment())

var deer = null
var cube = null

var frameBuf = new Framebuffer()
frameBuf.addColorAttachment(canvas.width, canvas.height)


$( document ).ready(function() {

let testMaterial = new Material(shaderProgram)
testMaterial.addTexture("uSampler_1",text)


let cubeMaterial = new Material(shaderProgram)
cubeMaterial.addTexture("uSampler_1",frameBuf.attachments['color0'])

loadOBJ("webgl/models/cube.obj").then((value) => {
    if(value != undefined)
    {

        let meshR = new MeshRenderer(value, cubeMaterial)


        meshR.position[2] = -50
        meshR.position[1] = -2.6
        meshR.position[0] = 0

        meshR.rotation[2] = 0
        meshR.rotation[1] = 0
        meshR.rotation[0] = 0
        renderer.addMeshRenderer(meshR)
        cube = meshR
    }
})


loadOBJ("webgl/models/Deer.obj").then((value) => {
    if(value != undefined)
    {

        let meshR = new MeshRenderer(value, testMaterial)
        meshR.scale[0] = 0.01
        meshR.scale[1] = 0.01
        meshR.scale[2] = 0.01

        meshR.position[2] = -7
        meshR.position[1] = -2.6
        meshR.position[0] = -1

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

    frameBuf.bind()
    renderer.clearBackground(1.0,0,0, 1)
    if(deer != null)
    {
        renderer.renderMeshRenderer(camera, time,deer)
    }

    Framebuffer.unbind()
    renderer.clearBackground()

    if(cube != null)
    {
        renderer.renderMeshRenderer(camera, time,cube)

    }
   // renderer.render(camera,time)


    window.requestAnimationFrame(render)
}

render(0)
});
