function loadAll() {
    $.ajaxSetup({async:false});
    console.log("Loading")
    $.getScript('webgl/scripts/mesh.js');
    $.getScript('webgl/scripts/shadeUtils.js');
    $.getScript('webgl/scripts/OBJLoader.js');
    $.getScript('webgl/scripts/modelUtils.js');
    $.getScript('webgl/scripts/meshRenderer.js');
    $.getScript('webgl/scripts/camera.js');
    $.getScript('webgl/scripts/texture.js');
    $.getScript('webgl/scripts/cubemap.js');
    $.getScript('webgl/scripts/hdrTools.js');

    $.getScript('webgl/scripts/frambuffer.js');
    $.getScript('webgl/scripts/material.js');
    $.getScript('webgl/scripts/renderer.js');
    $.getScript('webgl/scripts/basicShader.js');
    $.getScript('webgl/scripts/normalMappedShader.js');
    $.getScript('webgl/scripts/pbrShader.js');
    $.getScript('webgl/scripts/equirectangularShader.js');
    $.getScript('webgl/scripts/skyboxShader.js');
    $.getScript('webgl/scripts/textureOnlyShader.js');
    $.getScript('webgl/scripts/tonemapShader.js');
    $.getScript('webgl/scripts/directionalLight.js');
    $.getScript('webgl/scripts/pointLight.js');
    $.getScript('webgl/scripts/bloomEffect.js');
    $.getScript('webgl/scripts/pbrTools.js');

    $.getScript('webgl/scripts/mainCamera.js');
    $.getScript('webgl/scripts/skybox.js');
    $.getScript('webgl/scripts/materialUtils.js');
    $.getScript('webgl/scripts/textureViewer.js');

    $.getScript('webgl/scripts/canvas.js');
    $.ajaxSetup({async:true});

}

loadAll()