
function getWoodMaterial() {

    var basicShader = createShaderProgram(getBasicVertex(), getBasicFragment())
    let text = Texture.FromURL('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/385064a4-77d4-4bb1-927b-2dcf9f0fb658/d1hnki3-3070ff4b-08e2-4ce6-bd29-59dfb277fb0d.jpg/v1/fill/w_600,h_600,q_75,strp/tileable_wood_texture_by_ftourini_stock_d1hnki3-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD02MDAiLCJwYXRoIjoiXC9mXC8zODUwNjRhNC03N2Q0LTRiYjEtOTI3Yi0yZGNmOWYwZmI2NThcL2QxaG5raTMtMzA3MGZmNGItMDhlMi00Y2U2LWJkMjktNTlkZmIyNzdmYjBkLmpwZyIsIndpZHRoIjoiPD02MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.MGgFuUmkYOmpjtHxXXOs19TAXjOpDrUAlCsYteKUwBE')


    let mat = new Material(basicShader)
    mat.name = "Wood material"
    mat.addTexture("uSampler_1",text)
    mat.addVec3Uniform("lightDirection", ()=>{return uiManager.lightDir})
    mat.addVec3Uniform("lightDiffuseColor", ()=>{return uiManager.lightDiffuseColor})
    mat.addVec3Uniform("lightSpecularColor", ()=>{return uiManager.lightSpecularColor})
    mat.addFloatUniform("dirLightIntensity", ()=>{return uiManager.dirLightIntensity})

    mat.addVec3Uniform("pointLightPos", ()=>{return uiManager.lightPos})
    mat.addVec3Uniform("pointLightDiffuseColor", ()=>{return [1,1,1]})
    mat.addVec3Uniform("pointLightSpecularColor", ()=>{return [1,1,1]})
    mat.addFloatUniform("pointLightIntensity", ()=>{return uiManager.pLightIntensity})
    

    return mat
}

function getUntexturedMaterial(tint) {

    var basicShader = createShaderProgram(getBasicVertex(), getBasicUntexturedFragment())


    let mat = new Material(basicShader)
    mat.name = "Untextured material"

    mat.addVec3Uniform("tint", ()=>{return tint})

    return mat
}

function geFloorMaterial() {

    var basicShader = createShaderProgram(getNormalMappedShaderVertex(), getNormalMappedShaderFragment())
    let text = Texture.FromURL('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Y_hN950Q2m64fWpD6vyx09vHA9sgD2gbUQ&usqp=CAU')
    let textNormalMap = Texture.FromURL('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/14354e63-49e5-4ff6-a0aa-88619b1ca5e3/d90plz3-5fa8674f-73b4-47b9-8a02-26a87d3d0c26.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMTQzNTRlNjMtNDllNS00ZmY2LWEwYWEtODg2MTliMWNhNWUzXC9kOTBwbHozLTVmYTg2NzRmLTczYjQtNDdiOS04YTAyLTI2YTg3ZDNkMGMyNi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.ydTIGrQHFicUICxKLys73hXlxYF0Y8y2BNCXWbddW2s')

    let mat = new Material(basicShader)
    mat.name = "Floor material"

    mat.addTexture("uSampler_1",text)
    mat.addTexture("normalMap", textNormalMap)

    mat.addVec3Uniform("lightDirection", ()=>{return uiManager.lightDir})
    mat.addVec3Uniform("lightDiffuseColor", ()=>{return uiManager.lightDiffuseColor})
    mat.addVec3Uniform("lightSpecularColor", ()=>{return uiManager.lightSpecularColor})
    mat.addFloatUniform("dirLightIntensity", ()=>{return uiManager.dirLightIntensity})

    mat.addVec3Uniform("pointLightPos", ()=>{return uiManager.lightPos})
    mat.addVec3Uniform("pointLightDiffuseColor", ()=>{return [1,1,1]})
    mat.addVec3Uniform("pointLightSpecularColor", ()=>{return [1,1,1]})
    mat.addFloatUniform("pointLightIntensity", ()=>{return uiManager.pLightIntensity})

    return mat
}

function getDepthRenderMaterial() {

    var shad = createShaderProgram(getBasicDepthShaderVertex(), getBasicDepthShaderFragment())

    let mat = new Material(shad)
    mat.name = "Depth render material"

    mat.onPreRender = ()=>{}

    return mat
}



function getPBRMaterial() {

    var basicShader = createShaderProgram(getPBRShaderVertex(), getPBRShaderFragment())

    let albedo = Texture.FromURL('webgl/pbr/MahogFloor/albedo.png')
    let metallic = Texture.FromURL('webgl/pbr/MahogFloor/metallic.psd')
    let normal = Texture.FromURL('webgl/pbr/MahogFloor/normal.png')
   // let  roughness = Texture.FromURL('webgl/pbr/Floor/roughness.png')
    let ao = Texture.FromURL('webgl/pbr/MahogFloor/ao.png')
   // let hMap = Texture.FromURL('webgl/pbr/MahogFloor/height.png')

    let mat = new Material(basicShader)
    mat.name = "PBR material"

    mat.addTexture("albedoMap",albedo)
    mat.addTexture("metallicMap",metallic)
    mat.addTexture("normalMap",normal)
    mat.addTexture("aoMap",ao)
    //mat.addTexture("roughnessMap",roughness)
   // mat.addTexture("heightMap",hMap)


    mat.addVec3Uniform("lightDirection", ()=>{return uiManager.lightDir})
    mat.addVec3Uniform("lightDiffuseColor", ()=>{return uiManager.lightDiffuseColor})
    mat.addVec3Uniform("lightSpecularColor", ()=>{return uiManager.lightSpecularColor})
    mat.addFloatUniform("dirLightIntensity", ()=>{return uiManager.dirLightIntensity})

    mat.addVec3Uniform("pointLightPos", ()=>{return uiManager.lightPos})
    mat.addVec3Uniform("pointLightDiffuseColor", ()=>{return [1,1,1]})
    mat.addVec3Uniform("pointLightSpecularColor", ()=>{return [1,1,1]})
    mat.addFloatUniform("pointLightIntensity", ()=>{return uiManager.pLightIntensity})

return mat
}

function getPostProcessBrightnessExtractMaterial() {
    var tonemapShader = createShaderProgram(getTonemapVertex(), getExtractBrightnessFragment())


    let quadMaterial = new Material(tonemapShader)
    quadMaterial.name = "Brightness extract material"

    return quadMaterial
}

function getPostProcessBasicMaterial() {
    var tonemapShader = createShaderProgram(getTonemapVertex(), getPostProcessBasicFragment())


    let quadMaterial = new Material(tonemapShader)
    quadMaterial.name = "Post process basic material"

    return quadMaterial
}

function getPostProcessBlurMaterial() {
    var tonemapShader = createShaderProgram(getTonemapVertex(), getBlurShaderFragment())


    let quadMaterial = new Material(tonemapShader)
    quadMaterial.name = "Post process blur material"

    return quadMaterial
}

function getPostProcessHDRMaterial() {
    var tonemapShader = createShaderProgram(getTonemapVertex(), getTonemapFragment())


    let quadMaterial = new Material(tonemapShader)
    quadMaterial.name = "Tonemap HDR material"
    quadMaterial.addFloatUniform("gamma", ()=>{return uiManager.gamma})
    quadMaterial.addFloatUniform("exposure", ()=>{return uiManager.exposure})

    return quadMaterial
}