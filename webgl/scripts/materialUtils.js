
function getWoodMaterial(cam) {

    var basicShader = createShaderProgram(getBasicVertex(), getBasicFragment())
    let text = Texture.FromURL('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/385064a4-77d4-4bb1-927b-2dcf9f0fb658/d1hnki3-3070ff4b-08e2-4ce6-bd29-59dfb277fb0d.jpg/v1/fill/w_600,h_600,q_75,strp/tileable_wood_texture_by_ftourini_stock_d1hnki3-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD02MDAiLCJwYXRoIjoiXC9mXC8zODUwNjRhNC03N2Q0LTRiYjEtOTI3Yi0yZGNmOWYwZmI2NThcL2QxaG5raTMtMzA3MGZmNGItMDhlMi00Y2U2LWJkMjktNTlkZmIyNzdmYjBkLmpwZyIsIndpZHRoIjoiPD02MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.MGgFuUmkYOmpjtHxXXOs19TAXjOpDrUAlCsYteKUwBE')


    let mat = new Material(basicShader)
    mat.addTexture("uSampler_1",text)
    mat.addVec3Uniform("lightDirection", ()=>{return uiManager.lightDir})
    mat.addVec3Uniform("lightDiffuseColor", ()=>{return uiManager.lightDiffuseColor})
    mat.addVec3Uniform("lightSpecularColor", ()=>{return uiManager.lightSpecularColor})
    mat.addVec3Uniform("camPos", ()=>{return cam.position})

    return mat
}

function geFloorMaterial(cam) {

    var basicShader = createShaderProgram(getNormalMappedShaderVertex(), getNormalMappedShaderFragment())
    let text = Texture.FromURL('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Y_hN950Q2m64fWpD6vyx09vHA9sgD2gbUQ&usqp=CAU')
    let textNormalMap = Texture.FromURL('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/14354e63-49e5-4ff6-a0aa-88619b1ca5e3/d90plz3-5fa8674f-73b4-47b9-8a02-26a87d3d0c26.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMTQzNTRlNjMtNDllNS00ZmY2LWEwYWEtODg2MTliMWNhNWUzXC9kOTBwbHozLTVmYTg2NzRmLTczYjQtNDdiOS04YTAyLTI2YTg3ZDNkMGMyNi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.ydTIGrQHFicUICxKLys73hXlxYF0Y8y2BNCXWbddW2s')

    let mat = new Material(basicShader)
    mat.addTexture("uSampler_1",text)
    mat.addTexture("normalMap", textNormalMap)

    mat.addVec3Uniform("lightDirection", ()=>{return uiManager.lightDir})
    mat.addVec3Uniform("lightDiffuseColor", ()=>{return uiManager.lightDiffuseColor})
    mat.addVec3Uniform("lightSpecularColor", ()=>{return uiManager.lightSpecularColor})
    mat.addVec3Uniform("camPos", ()=>{return cam.position})

    return mat
}

function getDepthRenderMaterial() {

    var shad = createShaderProgram(getBasicDepthShaderVertex(), getBasicDepthShaderFragment())

    let mat = new Material(shad)
    mat.onPreRender = ()=>{}

    return mat
}

function getPostProcessBrightnessExtractMaterial() {
    var tonemapShader = createShaderProgram(getTonemapVertex(), getExtractBrightnessFragment())


    let quadMaterial = new Material(tonemapShader)
    quadMaterial.onPreRender = ()=>{}
    return quadMaterial
}

function getPostProcessBasicMaterial() {
    var tonemapShader = createShaderProgram(getTonemapVertex(), getPostProcessBasicFragment())


    let quadMaterial = new Material(tonemapShader)
    quadMaterial.onPreRender = ()=>{}
    return quadMaterial
}

function getPostProcessHDRMaterial() {
    var tonemapShader = createShaderProgram(getTonemapVertex(), getTonemapFragment())


    let quadMaterial = new Material(tonemapShader)

    quadMaterial.addFloatUniform("gamma", ()=>{return uiManager.gamma})
    quadMaterial.addFloatUniform("exposure", ()=>{return uiManager.exposure})

    return quadMaterial
}

function getPBRMaterial(cam) {

    var basicShader = createShaderProgram(getPBRShaderVertex(), getPBRShaderFragment())

    let albedo = Texture.FromURL('webgl/pbr/Bamboo/albedo.png')
    let metallic = Texture.FromURL('webgl/pbr/Bamboo/metallic.png')
    let normal = Texture.FromURL('webgl/pbr/Bamboo/normal.png')
    let  roughness = Texture.FromURL('webgl/pbr/Bamboo/roughness.png')
    let ao = Texture.FromURL('webgl/pbr/Bamboo/ao.png')

    let mat = new Material(basicShader)
    mat.addTexture("albedoMap",albedo)
    mat.addTexture("metallicMap",metallic)
    mat.addTexture("normalMap",normal)
    mat.addTexture("aoMap",ao)
    mat.addTexture("roughnessMap",roughness)


    mat.addVec3Uniform("lightDirection", ()=>{return uiManager.lightDir})
    mat.addVec3Uniform("lightDiffuseColor", ()=>{return uiManager.lightDiffuseColor})
    mat.addVec3Uniform("lightSpecularColor", ()=>{return uiManager.lightSpecularColor})
    mat.addVec3Uniform("camPos", ()=>{return cam.position})


return mat
}