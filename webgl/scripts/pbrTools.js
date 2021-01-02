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

        this.convFBO = new Framebuffer(32,32)
        this.convFBO.addCubeColorAttachmentFloat()
        this.convFBO.addCubeDepthAttachmentFloat()

        this.preFilteredFBO = new Framebuffer(128,128)
        this.preFilteredFBO.addCubeColorAttachmentFloat(true)

        this.bdrfFBO = new Framebuffer(512,512)
        this.bdrfFBO.addTextureColorAttachment(1, gl.RGBA16F, gl.RGBA, gl.FLOAT, gl.LINEAR, gl.LINEAR, gl.REPEAT)

        var cubemapShad = createShaderProgram(getEquirectVertex(), getEquirectFragment())
        this.equirectMat = new Material(cubemapShad)

        var cubeconvollutionShad = createShaderProgram(getEquirectVertex(), getCubemapConvollutionFragment())
        this.convollutionDiffuseMaterial = new Material(cubeconvollutionShad)
        this.convollutionDiffuseMaterial.addCubeMap("environmentMap", this.frameBuffer.attachments['color0'])

        var prefilteredShad = createShaderProgram(getEquirectVertex(), getPrefilteredMapFragment())
        this.prefilteredMapMat = new Material(prefilteredShad)
        this.prefilteredMapMat.addCubeMap("environmentMap", this.frameBuffer.attachments['color0'])
        this.prefilteredMapMat.addFloatUniform("roughness", ()=>{return 0.0 })

        var bdrfShad = createShaderProgram(getBDRFVertex(), getBDRFFragment())
        this.bdrfMat = new Material(bdrfShad)




    }

    createBDRFTexture(rendererObj, camera, time)
    {
        let screenQuad = new MeshRenderer(getQuadMesh(), this.bdrfMat)
        this.bdrfFBO.bind()
        gl.drawBuffers([gl.COLOR_ATTACHMENT0])
        rendererObj.clearAll(0,0,0,1)
        rendererObj.renderMeshRenderer(camera.camObj,time, screenQuad)

    }

    renderToCubemap(rendererObj, time, equirectCube, hdrTexture) {

        //CreateCubemap
        this.equirectMat.addTexture("equirectangularMap", hdrTexture)
        this.frameBuffer.bind();
        gl.drawBuffers([gl.COLOR_ATTACHMENT0])
        gl.disable(gl.CULL_FACE)

        for(var i=0; i < 6; i++)
        {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i , this.frameBuffer.attachments['color0'].textID, 0);
            gl.enable(gl.DEPTH_TEST)
            rendererObj.clearAll(0,0,0,1)
            rendererObj.renderMeshRendererForceMaterial(this.cameras[i],time, equirectCube, this.equirectMat)

        }
        Framebuffer.unbind()
        this.frameBuffer.attachments['color0'].bind();
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP)

        //Create convolluted diffuse
        this.convFBO.bind();
        gl.drawBuffers([gl.COLOR_ATTACHMENT0])

        for(var i=0; i < 6; i++)
        {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i , this.convFBO.attachments['color0'].textID, 0);
            rendererObj.clearAll(0,0,0,1)
            rendererObj.renderMeshRendererForceMaterial(this.cameras[i],time, equirectCube, this.convollutionDiffuseMaterial)

        }

        //Create prefiltered map
        this.preFilteredFBO.bind();
        gl.drawBuffers([gl.COLOR_ATTACHMENT0])

        var mipCounter = 0
        for(var mip=0.0; mip < 5.0; mip++)
        {
            var mipW = 128 * Math.pow(0.5, mip)
            var mipH = 128 * Math.pow(0.5, mip)
            gl.viewport(0, 0, mipW, mipH);

            this.prefilteredMapMat.addFloatUniform("roughness", ()=>{return mip / 4.0 })

            for(var i=0; i < 6; i++)
            {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i , this.preFilteredFBO.attachments['color0'].textID, mipCounter);
                rendererObj.clearAll(0,0,0,1)
                rendererObj.renderMeshRendererForceMaterial(this.cameras[i],time, equirectCube, this.prefilteredMapMat)
    
            }  
            mipCounter++;
        }
        
        gl.enable(gl.CULL_FACE)

    }


}