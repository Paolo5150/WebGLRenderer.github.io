var canvas = document.getElementById('mycanvas');
var gl = canvas.getContext('webgl2');
var textureExtensions = gl.getExtension("WEBGL_draw_buffers");
var colorBufferFloatExtension = this.gl.getExtension('EXT_color_buffer_float');
let renderer =  new Renderer(canvas.width, canvas.height)
let camera = new MainCamera()
let pbrTools = new PBRTools()

var sphere = null
var cube = null
var skybox = null
var equirectCube = null
var pLightCube = null

var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
var scene = new BABYLON.Scene(engine);
BABYLON.OBJFileLoader.COMPUTE_NORMALS  = true;
BABYLON.OBJFileLoader.OPTIMIZE_NORMALS = true;
BABYLON.OBJFileLoader.SKIP_MATERIALS = true;
BABYLON.OBJFileLoader.INVERT_TEXTURE_Y = false;


//Post process framebuffers
var regularSceneFrameBuffer = new Framebuffer(canvas.width, canvas.height)
regularSceneFrameBuffer.addTextureColorAttachment( 1, gl.RGBA16F, gl.RGBA, gl.FLOAT, gl.LINEAR, gl.LINEAR, gl.REPEAT)
regularSceneFrameBuffer.addTextureDepthAttachment()

let directionalLight = new DirectionalLight()
let pointlLight = new PointLight()

var bloomEffect = new BloomEffect(canvas.width, canvas.height)

//Post processing materials and textures
let hdrPostProcessMaterial = getPostProcessHDRMaterial()
hdrPostProcessMaterial.addTexture("sceneTexture",regularSceneFrameBuffer.attachments['color0'])
hdrPostProcessMaterial.addTexture("bloomTexture", bloomEffect.blurFrameBuffer[1].attachments['color0'])
let blackTexture = Texture.FromURL('webgl/pbr/black.png')

Framebuffer.unbind()

$( document ).ready(function() {

pbrTools.createBDRFTexture(renderer,camera, 0)

let textureViewer = new TextureViewer([-0.8,-0.3,0.0],[0.3,0.7,1.0], bloomEffect.brightnessFrameBuf.attachments['color0'], false)
//let cubemapTextureViewer = new CubemapTextureViewer([-0.8,-0.3,0.0],[0.3,0.7,1.0], pbrTools.frameBuffer.attachments['color0'], "left", false)

let floorMat = getPBRMaterial()
floorMat.addTexture("shadowMap", directionalLight.shadowFrameBuffer.attachments['depth'])
floorMat.addVec3Uniform("camPos", ()=>{return camera.camObj.position})
floorMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix})
floorMat.addCubeMap("pShadowMap", pointlLight.shadowFrameBuffer.attachments['depth'])
floorMat.addCubeMap("irradianceMap", pbrTools.convFBO.attachments['color0'])
floorMat.addCubeMap("prefilteredMap", pbrTools.preFilteredFBO.attachments['color0'])
floorMat.addTexture("bdrf", pbrTools.bdrfFBO.attachments['color0'])
floorMat.addTexture("albedoMap",Texture.FromURL('webgl/pbr/MahogFloor/albedo.png'))
floorMat.addTexture("metallicMap",Texture.FromURL('webgl/pbr/MahogFloor/metallic.psd'))
floorMat.addTexture("normalMap",Texture.FromURL('webgl/pbr/MahogFloor/normal.png'))
floorMat.addTexture("aoMap",Texture.FromURL('webgl/pbr/MahogFloor/ao.png'))
floorMat.addTexture("roughnessMap",Texture.FromURL('webgl/pbr/black.png'))
floorMat.addFloatUniform("metallicModifier", ()=>{return 0.0})
floorMat.addFloatUniform("roughnessModifier", ()=>{return 0.3})
floorMat.addFloatUniform("doShadow", ()=>{return 1.0})


let sphereMat = getPBRMaterial()
sphereMat.addTexture("shadowMap", directionalLight.shadowFrameBuffer.attachments['depth'])
sphereMat.addVec3Uniform("camPos", ()=>{return camera.camObj.position})
sphereMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix})
sphereMat.addCubeMap("pShadowMap", pointlLight.shadowFrameBuffer.attachments['depth'])
sphereMat.addCubeMap("irradianceMap", pbrTools.convFBO.attachments['color0'])
sphereMat.addCubeMap("prefilteredMap", pbrTools.preFilteredFBO.attachments['color0'])
sphereMat.addTexture("bdrf", pbrTools.bdrfFBO.attachments['color0'])
sphereMat.addTexture("albedoMap",Texture.FromURL('webgl/pbr/Iron/albedo.png', gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE))
sphereMat.addTexture("metallicMap",Texture.FromURL('webgl/pbr/Iron/metallic.png'))
sphereMat.addTexture("normalMap",Texture.FromURL('webgl/pbr/Iron/normal.png'))
sphereMat.addTexture("aoMap",Texture.FromURL('webgl/pbr/Iron/ao.png'))
sphereMat.addTexture("roughnessMap",Texture.FromURL('webgl/pbr/Iron/roughness.png'))
sphereMat.addFloatUniform("metallicModifier", ()=>{return 0.0})
sphereMat.addFloatUniform("roughnessModifier", ()=>{return 0.0})
sphereMat.addFloatUniform("doShadow", ()=>{return 0.0})

let deerMat = getPBRMaterial()
deerMat.addTexture("shadowMap", directionalLight.shadowFrameBuffer.attachments['depth'])
deerMat.addVec3Uniform("camPos", ()=>{return camera.camObj.position})
deerMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix})
deerMat.addCubeMap("pShadowMap", pointlLight.shadowFrameBuffer.attachments['depth'])
deerMat.addCubeMap("irradianceMap", pbrTools.convFBO.attachments['color0'])
deerMat.addCubeMap("prefilteredMap", pbrTools.preFilteredFBO.attachments['color0'])
deerMat.addTexture("bdrf", pbrTools.bdrfFBO.attachments['color0'])
deerMat.addTexture("albedoMap",Texture.FromURL('webgl/pbr/gold/albedo.png', gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE))
deerMat.addTexture("metallicMap",Texture.FromURL('webgl/pbr/gold/metallic.png'))
deerMat.addTexture("normalMap",Texture.FromURL('webgl/pbr/gold/normal.png'))
deerMat.addTexture("aoMap",Texture.FromURL('webgl/pbr/gold/ao.png'))
deerMat.addTexture("roughnessMap",Texture.FromURL('webgl/pbr/gold/roughness.png'))
deerMat.addFloatUniform("metallicModifier", ()=>{return 0.0})
deerMat.addFloatUniform("roughnessModifier", ()=>{return 0.0})
deerMat.addFloatUniform("doShadow", ()=>{return 1.0})

let woodMat = getWoodMaterial()
woodMat.addVec3Uniform("camPos", ()=>{return camera.camObj.position})
woodMat.addTexture("shadowMap", directionalLight.shadowFrameBuffer.attachments['depth'])
woodMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix  })
woodMat.addCubeMap("pShadowMap", pointlLight.shadowFrameBuffer.attachments['depth'])

Texture.FromURL_HDR('https://github.com/Paolo5150/WebGLRenderer.github.io/blob/master/Alexs_Apt_2k.hdr', (loadedTexture)=>{
  

  pbrTools.renderToCubemap(renderer, 0, equirectCube, loadedTexture)
  skybox = new Skybox(pbrTools.frameBuffer.attachments['color0'], cube) //Pass the cube mesh renderer, the amterial will be overriden
  
})

let untexturedMat = getUntexturedMaterial([1,1,1])
untexturedMat.addMat4Uniform("lightSpace", ()=>{return directionalLight.ligthtSpaceMatrix })

let screenQuad = new MeshRenderer(getQuadMesh(), hdrPostProcessMaterial)
let floor = new MeshRenderer(getQuadMesh(), floorMat)
floor.rotation[0] = -90
floor.position = [0,0,-1]
floor.scale = [25,25,1]
renderer.addMeshRenderer(floor)

var l1 = false
var l2 = false
var l3 = false
 
loadOBJ("webgl/models/cubic.obj").then((value) => {
    if(value != undefined)
    {
        let meshR = new MeshRenderer(value[0],untexturedMat)
        meshR.position = [-2,4,2]
        meshR.rotation = [0,0,0]
        meshR.scale = [0.4,0.4,0.4]

        cube = meshR

        equirectCube = new MeshRenderer(value[0],null) // Material set in PBRTools
        l1 = true
    }
})


loadOBJ("webgl/models/geosphere.obj").then((value) => {
    if(value != undefined)
    {
      for(var m = 0; m < value.length; m++)
      {
        let meshR = new MeshRenderer(value[m],sphereMat)
        meshR.position = [-2,2,0]
        meshR.scale = [0.1,0.1,0.1]
        renderer.addMeshRenderer(meshR)
        directionalLight.shadowCasters.push(meshR)
        pointlLight.shadowCasters.push(meshR)
        sphere = meshR;
        l2 = true
      }        
    }
})

loadOBJ("webgl/models/Deer.obj").then((value) => {
  if(value != undefined)
  {
    for(var m = 0; m < value.length; m++)
    {
      let meshR = new MeshRenderer(value[m],deerMat)
      meshR.position = [2,0,0]
      meshR.scale = [0.02,0.02,0.02]
      renderer.addMeshRenderer(meshR)
      directionalLight.shadowCasters.push(meshR)
      pointlLight.shadowCasters.push(meshR)
      l3 = true
    }
      
  }
})


var prev = 0;
var now = 0
var delta = 0
var render = function(time) {

  // Super hack: Babylon takes over all input callbacks
  // So, after I loaded all models (with Babylone) the scene is deleted so my custom input callbacks can work
  if(l1 && l2 && l3)
  {
    scene.dispose()
  }

    now = time
    delta = (now - prev) * 0.001;
    prev = now

    camera.update(delta)

    if(sphere != null)
    {
        sphere.rotation[1] += 20 * delta;
    }

    if(cube != null && uiManager.pLightIntensity > 0)
    {
        cube.position = uiManager.lightPos
    }

    directionalLight.updateLightFromUI(uiManager)
    directionalLight.updateShadowMap(renderer, time) 

    pointlLight.updateLightFromUI(uiManager)
    pointlLight.updateShadowMap(renderer, time)

    //Render scene to frame buffer
    regularSceneFrameBuffer.bind()

    renderer.clearAll(0,0,0,1)   
    gl.disable(gl.CULL_FACE)
    renderer.render(camera.camObj,time)
    if(cube != null && uiManager.pLightIntensity > 0)
    {
        renderer.renderMeshRenderer(camera.camObj, time,cube)
    }
    if(skybox != null)
        skybox.render(camera.camObj, time)
  

    if(uiManager.useBloom)
    {
      hdrPostProcessMaterial.addTexture("bloomTexture", bloomEffect.blurFrameBuffer[1].attachments['color0'])
      bloomEffect.update(renderer, camera, time,cube)
    }
    else
    {
      hdrPostProcessMaterial.addTexture("bloomTexture", blackTexture)

    }
   
    //Quad to screen
    Framebuffer.unbind()
    renderer.clearAll(0,0,0,1)      

    gl.viewport(0, 0, canvas.width, canvas.height);
    renderer.renderMeshRendererForceMaterial(camera.camObj,time,screenQuad, hdrPostProcessMaterial)

    //Texture viewer
    //renderer.renderMeshRenderer(camera.camObj,time,textureViewer.quad)

    window.requestAnimationFrame(render)
}

render(0)
});
