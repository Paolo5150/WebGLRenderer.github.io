class PBRTools
{
    constructor()
    {
        this.cameras = []

        //Order matters, follows the cubemap face macros
        this.cameras[0] = Camera.perspective(90.0, 1.0, 0.1,10.0)
        this.cameras[0].view = mat4.lookAt(this.cameras[0].view, [0,0,0], [1,0,0], [0,-1,0])

        this.cameras[1] = Camera.perspective(90.0, 1.0, 0.1,10.0)     
        this.cameras[1].view = mat4.lookAt(this.cameras[1].view, [0,0,0], [-1,0,0], [0,-1,0])

        this.cameras[2] = Camera.perspective(90.0, 1.0, 0.1,10.0)
        this.cameras[2].view = mat4.lookAt(this.cameras[2].view, [0,0,0], [0,1,0], [0,0,1])

        this.cameras[3] = Camera.perspective(90.0, 1.0, 0.1,10.0)  
        this.cameras[3].view = mat4.lookAt(this.cameras[3].view, [0,0,0], [0,-1,0], [0,0,-1])

        this.cameras[4] = Camera.perspective(90.0, 1.0, 0.1,10.0)
        this.cameras[4].view = mat4.lookAt(this.cameras[4].view, [0,0,0], [0,0,1], [0,-1,0])

        this.cameras[5] = Camera.perspective(90.0, 1.0, 0.1,10.0)
        this.cameras[5].view = mat4.lookAt(this.cameras[5].view, [0,0,0], [0,0,-1], [0,-1,0])

        this.frameBuffer = new Framebuffer(512,512)
        this.frameBuffer.addCubeColorAttachmentFloat()
        this.frameBuffer.addCubeDepthAttachmentFloat()

    }

    renderToCubemap(rendererObj, time, equirectCube) {

        this.frameBuffer.bind();
        gl.drawBuffers([gl.COLOR_ATTACHMENT0])
        gl.disable(gl.CULL_FACE)

        for(var i=0; i < 6; i++)
        {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i , this.frameBuffer.attachments['color0'].textID, 0);
            gl.enable(gl.DEPTH_TEST)
            rendererObj.clearAll(0,0,0,1)
            rendererObj.renderMeshRenderer(this.cameras[i],time, equirectCube)

        }
        gl.enable(gl.CULL_FACE)

    }


}