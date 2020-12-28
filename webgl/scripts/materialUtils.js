
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

    var basicShader = createShaderProgram(getBasicVertex(), getBasicFragment())
    let text = Texture.FromURL('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Y_hN950Q2m64fWpD6vyx09vHA9sgD2gbUQ&usqp=CAU')

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