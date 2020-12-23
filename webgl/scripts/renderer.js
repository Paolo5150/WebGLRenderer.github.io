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

    clearAll(r,g,b,a) {
        gl.clearColor(r,g,b,a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearDepth(1.0);
    }

    addMeshRenderer(meshRenderer)
    {
        this.allRenderers.push(meshRenderer)
    }

    renderMeshRenderer(camera, time, mr) {
        

        

        mr.material.bind()
        mr.render(camera, time)
        
    }

    clearBackground(r = 0,g = 0,b = 0, a = 1) {
        renderer.clear(r,g,b,a)

    }

    render(camera, time) {
        

        if(this.allRenderers != null || this.allRenderers != undefined)
        {
            for(var i=0; i< this.allRenderers.length; i++)
            {
      

                this.allRenderers[i].material.bind()
                this.allRenderers[i].render(camera, time)
            }
        }
        
    }

}