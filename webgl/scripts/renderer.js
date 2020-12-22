class Renderer
{
    constructor(width, height)
    {
        gl.clearColor(1.0,0.0,0.0,1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.viewport(0.0, 0.0, width, height);
        this.allRenderers = []
    }

    clear(r,g,b,a) {
        gl.clearColor(r,g,b,a);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    addMeshRenderer(meshRenderer)
    {
        this.allRenderers.push(meshRenderer)
    }

    render(camera, time) {
        
        renderer.clear(0,0,0,1)



        if(this.allRenderers != null || this.allRenderers != undefined)
        {
            for(var i=0; i< this.allRenderers.length; i++)
            {
                var dirLightUniform = gl.getUniformLocation(this.allRenderers[i].shaderProgram, "dirLight")
                gl.uniform3fv(dirLightUniform, [uiManager.lightDir[0], uiManager.lightDir[1], uiManager.lightDir[2]]);

                this.allRenderers[i].render(camera, time)
            }
        }
        
    }

}