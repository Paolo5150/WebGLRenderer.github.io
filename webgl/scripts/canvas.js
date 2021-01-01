

var canvas = document.getElementById('mycanvas');
var gl = canvas.getContext('webgl2');
var textureExtensions = gl.getExtension("WEBGL_draw_buffers");
var colorBufferFloatExtension = this.gl.getExtension('EXT_color_buffer_float');
let renderer =  new Renderer(canvas.width, canvas.height)
let camera = new MainCamera()
let pbrTools = new PBRTools()

var deer = null
var cube = null
var skybox = null
var equirectCube = null

let testText = null


let cubeMapTest = Cubemap.FromURLs(
  [
      {
          target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
          url: 'webgl/skyboxes/ClearSky/right.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
          url: 'webgl/skyboxes/ClearSky/left.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
          url: 'webgl/skyboxes/ClearSky/top.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
          url: 'webgl/skyboxes/ClearSky/bottom.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
          url: 'webgl/skyboxes/ClearSky/back.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
          url: 'webgl/skyboxes/ClearSky/front.jpg',
        },
  ]
)

let directionalLight = new DirectionalLight()
let pointlLight = new PointLight()

var shad = createShaderProgram(getEquirectVertex(), getEquirectFragment())
let equirectMat = new Material(shad)

//Post process framebuffers
var regularSceneFrameBuffer = new Framebuffer(canvas.width, canvas.height)
regularSceneFrameBuffer.addColorAttachmentFloatFormat( 1)
regularSceneFrameBuffer.addDepthAttachment()

var bloomEffect = new BloomEffect(canvas.width, canvas.height)

//Post processing materials and textures
let hdrPostProcessMaterial = getPostProcessHDRMaterial()
hdrPostProcessMaterial.addTexture("sceneTexture",regularSceneFrameBuffer.attachments['color0'])
//hdrPostProcessMaterial.addTexture("bloomBlur", bloomEffect.blurFrameBuffer[1].attachments['color0'])

Framebuffer.unbind()

$( document ).ready(function() {




//let textureViewer = new TextureViewer([-0.8,-0.3,0.0],[0.3,0.7,1.0], regularSceneFrameBuffer.attachments['color0'], false)
let cubemapTextureViewer = new CubemapTextureViewer([-0.8,-0.3,0.0],[0.3,0.7,1.0], pbrTools.frameBuffer.attachments['color0'], "left", false)

Texture.FromURLhdr('webgl/skyboxes/HDR/Alexs_Apt_2k.hdr', (loadedTexture)=>{
//  textureViewer.setTexture(loadedTexture)

  equirectMat.addTexture("equirectangularMap", loadedTexture)
  pbrTools.renderToCubemap(renderer, 0, equirectCube)
  skybox = new Skybox(pbrTools.frameBuffer.attachments['color0'], cube) //Pass the cube mesh renderer, the amterial will be overriden


})

let woodMat = getWoodMaterial()
woodMat.addVec3Uniform("camPos", ()=>{return camera.camObj.position})
woodMat.addTexture("shadowMap", directionalLight.shadowFrameBuffer.attachments['depth'])
woodMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix  })
woodMat.addCubeMap("pShadowMap", pointlLight.shadowFrameBuffer.attachments['depth'])

let untexturedMat = getUntexturedMaterial([1,1,1])
untexturedMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix })

let pbrMat = getPBRMaterial()
pbrMat.addTexture("shadowMap", directionalLight.shadowFrameBuffer.attachments['depth'])
pbrMat.addVec3Uniform("camPos", ()=>{return camera.camObj.position})
pbrMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix})
pbrMat.addCubeMap("pShadowMap", pointlLight.shadowFrameBuffer.attachments['depth'])

let floorMat = geFloorMaterial()
floorMat.addVec3Uniform("camPos", ()=>{return camera.camObj.position})
floorMat.addTexture("shadowMap", directionalLight.shadowFrameBuffer.attachments['depth'])
floorMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix })


let screenQuad = new MeshRenderer(getQuadMesh(), hdrPostProcessMaterial)
let floor = new MeshRenderer(getQuadMesh(), pbrMat)
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
        meshR.scale = [0.4,0.4,0.4]

        let m2 = new MeshRenderer(value,woodMat)
        m2.position = [2,2,-2]
        m2.rotation = [0,0,0]

        renderer.addMeshRenderer(meshR)

        renderer.addMeshRenderer(m2)
        directionalLight.shadowCasters.push(m2)
        pointlLight.shadowCasters.push(m2)
        cube = meshR

        equirectCube = new MeshRenderer(value,equirectMat)

        let s = new MeshRenderer(value,woodMat)
    }
})


loadOBJ("webgl/models/Deer.obj").then((value) => {
    if(value != undefined)
    {
        let meshR = new MeshRenderer(value,woodMat)
        meshR.position = [0,0,0]
        meshR.scale = [0.01,0.01,0.01]
        meshR.rotation = [0,0,0]

        renderer.addMeshRenderer(meshR)
        directionalLight.shadowCasters.push(meshR)
        pointlLight.shadowCasters.push(meshR)

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

    camera.update(delta)

    if(deer != null)
        deer.rotation[1] += delta * 20

    if(cube != null)
        cube.position = uiManager.lightPos

    directionalLight.updateLightFromUI(uiManager)
    directionalLight.updateShadowMap(renderer, time) 

    pointlLight.updateLightFromUI(uiManager)
    pointlLight.updateShadowMap(renderer, time)


    //Render scene to frame buffer
    regularSceneFrameBuffer.bind()

    renderer.clearAll(0,0,0,1)      
    renderer.render(camera.camObj,time)
    if(skybox != null)
        skybox.render(camera.camObj, time)
  
    //bloomEffect.update(renderer, camera.camObj, time,cube)
   
    //Quad to screen
    Framebuffer.unbind()
    renderer.clearAll(0,0,0,1)      

    gl.viewport(0, 0, canvas.width, canvas.height);
    renderer.renderMeshRendererForceMaterial(camera.camObj,time,screenQuad, hdrPostProcessMaterial)

    //Texture viewer
    renderer.renderMeshRenderer(camera.camObj,time,cubemapTextureViewer.quad)

    window.requestAnimationFrame(render)
}

render(0)
});
