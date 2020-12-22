
var canvas = document.getElementById('mycanvas');
var gl = canvas.getContext('experimental-webgl');

let renderer =  new Renderer(canvas.width, canvas.height)
let camera = new Camera()

var shaderProgram = createShaderProgram(getBasicVertex(), getBasicFragment())

let text = new Texture('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/385064a4-77d4-4bb1-927b-2dcf9f0fb658/d1hnki3-3070ff4b-08e2-4ce6-bd29-59dfb277fb0d.jpg/v1/fill/w_600,h_600,q_75,strp/tileable_wood_texture_by_ftourini_stock_d1hnki3-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD02MDAiLCJwYXRoIjoiXC9mXC8zODUwNjRhNC03N2Q0LTRiYjEtOTI3Yi0yZGNmOWYwZmI2NThcL2QxaG5raTMtMzA3MGZmNGItMDhlMi00Y2U2LWJkMjktNTlkZmIyNzdmYjBkLmpwZyIsIndpZHRoIjoiPD02MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.MGgFuUmkYOmpjtHxXXOs19TAXjOpDrUAlCsYteKUwBE')

let text2 = new Texture('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIn0bCp877UmRpBKEwjWUqwFBIOzGyq8t8qQ&usqp=CAU')

var u_image0Location = gl.getUniformLocation(shaderProgram, "uSampler_1");
var u_image1Location = gl.getUniformLocation(shaderProgram, "uSampler_2");

gl.uniform1i(u_image0Location, 0);  // texture unit 0
gl.uniform1i(u_image1Location, 1);  // texture unit 1


loadOBJ("webgl/models/Deer.obj").then((value) => {
    console.log("Promise then")
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

var render = function(time) {
    gl.activeTexture(gl.TEXTURE0);
    text.bind()
    
    gl.activeTexture(gl.TEXTURE1);
    text2.bind()

    renderer.render(camera, time)

    window.requestAnimationFrame(render)
}

render(0)