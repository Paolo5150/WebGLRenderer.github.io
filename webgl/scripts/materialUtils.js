
function getWoodMaterial(cam) {

    var basicShader = createShaderProgram(getBasicVertex(), getBasicFragment())
    let text = Texture.FromURL('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/385064a4-77d4-4bb1-927b-2dcf9f0fb658/d1hnki3-3070ff4b-08e2-4ce6-bd29-59dfb277fb0d.jpg/v1/fill/w_600,h_600,q_75,strp/tileable_wood_texture_by_ftourini_stock_d1hnki3-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3siaGVpZ2h0IjoiPD02MDAiLCJwYXRoIjoiXC9mXC8zODUwNjRhNC03N2Q0LTRiYjEtOTI3Yi0yZGNmOWYwZmI2NThcL2QxaG5raTMtMzA3MGZmNGItMDhlMi00Y2U2LWJkMjktNTlkZmIyNzdmYjBkLmpwZyIsIndpZHRoIjoiPD02MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.MGgFuUmkYOmpjtHxXXOs19TAXjOpDrUAlCsYteKUwBE')


    let woodMaterial = new Material(basicShader)
    woodMaterial.addTexture("uSampler_1",text)
    woodMaterial.onPreRender = ()=>{

    var dirLightUniform = gl.getUniformLocation(woodMaterial.shader, "lightDirection")
    gl.uniform3fv(dirLightUniform, [uiManager.lightDir[0], uiManager.lightDir[1], uiManager.lightDir[2]]);

    var lightDifUniform = gl.getUniformLocation(woodMaterial.shader, "lightDiffuseColor")
    gl.uniform3fv(lightDifUniform, uiManager.lightDiffuseColor);

    var lightSpecUniform = gl.getUniformLocation(woodMaterial.shader, "lightSpecularColor")
    gl.uniform3fv(lightSpecUniform, uiManager.lightSpecularColor);

    var camPositionUniform = gl.getUniformLocation(woodMaterial.shader, "camPos")
    gl.uniform3fv(camPositionUniform, cam.position);
}

return woodMaterial
}

function geFloorMaterial(cam) {

    var basicShader = createShaderProgram(getNormalMappedShaderVertex(), getNormalMappedShaderFragment())
    let text = Texture.FromURL('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Y_hN950Q2m64fWpD6vyx09vHA9sgD2gbUQ&usqp=CAU')
    let textNormalMap = Texture.FromURL('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/14354e63-49e5-4ff6-a0aa-88619b1ca5e3/d90plz3-5fa8674f-73b4-47b9-8a02-26a87d3d0c26.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMTQzNTRlNjMtNDllNS00ZmY2LWEwYWEtODg2MTliMWNhNWUzXC9kOTBwbHozLTVmYTg2NzRmLTczYjQtNDdiOS04YTAyLTI2YTg3ZDNkMGMyNi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.ydTIGrQHFicUICxKLys73hXlxYF0Y8y2BNCXWbddW2s')

    let mat = new Material(basicShader)
    mat.addTexture("uSampler_1",text)
    mat.addTexture("normalMap", textNormalMap)

    mat.onPreRender = ()=>{

    var dirLightUniform = gl.getUniformLocation(mat.shader, "lightDirection")
    gl.uniform3fv(dirLightUniform, [uiManager.lightDir[0], uiManager.lightDir[1], uiManager.lightDir[2]]);

    var lightDifUniform = gl.getUniformLocation(mat.shader, "lightDiffuseColor")
    gl.uniform3fv(lightDifUniform, uiManager.lightDiffuseColor);

    var lightSpecUniform = gl.getUniformLocation(mat.shader, "lightSpecularColor")
    gl.uniform3fv(lightSpecUniform, uiManager.lightSpecularColor);

    var camPositionUniform = gl.getUniformLocation(mat.shader, "camPos")
    gl.uniform3fv(camPositionUniform, cam.position);
}

return mat
}

function getDepthRenderMaterial() {

    var shad = createShaderProgram(getBasicDepthShaderVertex(), getBasicDepthShaderFragment())

    let mat = new Material(shad)
    mat.onPreRender = ()=>{}

    return mat
}

function getPostProcessHDRMaterial() {
    var tonemapShader = createShaderProgram(getTonemapVertex(), getTonemapFragment())


    let quadMaterial = new Material(tonemapShader)
quadMaterial.addTexture("uSampler_1",frameBuf.attachments['color0'])
quadMaterial.onPreRender = ()=>{

    var gamma = gl.getUniformLocation(quadMaterial.shader, "gamma")
    gl.uniform1f(gamma, uiManager.gamma);

    var exp = gl.getUniformLocation(quadMaterial.shader, "exposure")
    gl.uniform1f(exp, uiManager.exposure);
}
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


    mat.onPreRender = ()=>{

    var dirLightUniform = gl.getUniformLocation(mat.shader, "lightDirection")
    gl.uniform3fv(dirLightUniform, [uiManager.lightDir[0], uiManager.lightDir[1], uiManager.lightDir[2]]);

    var lightDifUniform = gl.getUniformLocation(mat.shader, "lightDiffuseColor")
    gl.uniform3fv(lightDifUniform, uiManager.lightDiffuseColor);

    var lightSpecUniform = gl.getUniformLocation(mat.shader, "lightSpecularColor")
    gl.uniform3fv(lightSpecUniform, uiManager.lightSpecularColor);

    var camPositionUniform = gl.getUniformLocation(mat.shader, "camPos")
    gl.uniform3fv(camPositionUniform, cam.position);
}

return mat
}