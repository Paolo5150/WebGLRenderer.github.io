


var canvas = document.getElementById('mycanvas');
var gl = canvas.getContext('experimental-webgl');
let renderer =  new Renderer(canvas.width, canvas.height)
let camera = new Camera()

let text = new Texture('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/385064a4-77d4-4bb1-927b-2dcf9f0fb658/d1hnki3-3070ff4b-08e2-4ce6-bd29-59dfb277fb0d.jpg/v1/fill/w_600,h_600,q_75,strp/tileable_wood_texture_by_ftourini_stock_d1hnki3-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD02MDAiLCJwYXRoIjoiXC9mXC8zODUwNjRhNC03N2Q0LTRiYjEtOTI3Yi0yZGNmOWYwZmI2NThcL2QxaG5raTMtMzA3MGZmNGItMDhlMi00Y2U2LWJkMjktNTlkZmIyNzdmYjBkLmpwZyIsIndpZHRoIjoiPD02MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.MGgFuUmkYOmpjtHxXXOs19TAXjOpDrUAlCsYteKUwBE')

let text2 = new Texture('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIn0bCp877UmRpBKEwjWUqwFBIOzGyq8t8qQ&usqp=CAU')
var shaderProgram = createShaderProgram(getBasicVertex(), getBasicFragment())
loadOBJ("webgl/models/Deer.obj").then((value) => {
    if(value != undefined)
    {
        value.scale[0] = 0.01
        value.scale[1] = 0.01
        value.scale[2] = 0.01

        value.position[2] = -5
        value.position[1] = -2
        value.position[0] = -1
        renderer.addMeshRenderer(value)
    }
})


$( document ).ready(function() {

let testMaterial = new Material(shaderProgram)
testMaterial.addTexture("uSampler_1",text)
testMaterial.addTexture("uSampler_2",text2)

var render = function(time) {
    
    testMaterial.bind()

    renderer.render(camera, time)

    window.requestAnimationFrame(render)
}

render(0)
});
