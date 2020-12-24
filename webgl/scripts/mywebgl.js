function loadAll() {

    $.getScript('webgl/scripts/mesh.js');
    $.getScript('webgl/scripts/OBJLoader.js');
    $.getScript('webgl/scripts/modelUtils.js');
    $.getScript('webgl/scripts/meshRenderer.js');
    $.getScript('webgl/scripts/camera.js');
    $.getScript('webgl/scripts/texture.js');
    $.getScript('webgl/scripts/frambuffer.js');
    $.getScript('webgl/scripts/shadeUtils.js');
    $.getScript('webgl/scripts/material.js');
    $.getScript('webgl/scripts/materialUtils.js');
    $.getScript('webgl/scripts/renderer.js');
    $.getScript('webgl/scripts/basicShader.js');
    $.getScript('webgl/scripts/tonemapShader.js');
    $.getScript('webgl/scripts/canvas.js');


}

loadAll()