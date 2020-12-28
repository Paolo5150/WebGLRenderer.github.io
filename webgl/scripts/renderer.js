class Renderer
{
    constructor(width, height)
    {
        gl.clearColor(1.0,0.0,0.0,1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);

        gl.depthFunc(gl.LEQUAL);
        gl.viewport(0.0, 0.0, width, height);
        this.allRenderers = []
    }

    clearAll(r,g,b,a) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(r,g,b,a);
        gl.clearDepth(1.0);
    }

    addMeshRenderer(meshRenderer)
    {
        this.allRenderers.push(meshRenderer)
    }

    renderMeshRenderer(camera, time, mr) {       

        mr.material.bind()
        mr.updateShaderWithMaterialInfo(camera)
        mr.render(camera, time)
        
    }

    renderMeshRendererForceMaterial(camera, time, mr, material) {       

        material.bind()
        mr.updateShaderWithMaterialInfoForceMaterial(camera, material)
        mr.render(camera, time)
        
    }

    renderForceMaterial(camera, time, material) {        

        material.bind()
        if(this.allRenderers != null || this.allRenderers != undefined)
        {
            for(var i=0; i< this.allRenderers.length; i++)
            { 
                this.allRenderers[i].updateShaderWithMaterialInfoForceMaterial(camera, material)
                this.allRenderers[i].renderForceMaterial(camera, time, material)
            }
        }
        
    }

    render(cam, time) {        

        if(this.allRenderers != null || this.allRenderers != undefined)
        {
            for(var i=0; i< this.allRenderers.length; i++)
            { 
                this.allRenderers[i].material.bind()
                this.allRenderers[i].updateShaderWithMaterialInfo(cam)
                this.allRenderers[i].render(cam, time)
            }
        }
        
    }

}