class BloomEffect
{
    constructor(width, height) {

        this.width = width
        this.height = height

        this.bloomSceneFrameBuffer = new Framebuffer(width, height)
        this.bloomSceneFrameBuffer.addTextureColorAttachment( 1, gl.RGBA16F, gl.RGBA, gl.FLOAT, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE)
        this.bloomSceneFrameBuffer.addTextureDepthAttachment()

        this.brightnessFrameBuf = new Framebuffer(width, height)
        this.brightnessFrameBuf.addTextureColorAttachment( 1, gl.RGBA16F, gl.RGBA, gl.FLOAT, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE)

        this.blurFrameBuffer = []
        this.blurFrameBuffer[0] = new Framebuffer(width, height)
        this.blurFrameBuffer[0].addTextureColorAttachment( 1, gl.RGBA16F, gl.RGBA, gl.FLOAT, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE)
        this.blurFrameBuffer[1] = new Framebuffer(width, height)
        this.blurFrameBuffer[1].addTextureColorAttachment( 1, gl.RGBA16F, gl.RGBA, gl.FLOAT, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE)

        this.brightnessExtractProcessMaterial = getPostProcessBrightnessExtractMaterial()
        this.brightnessExtractProcessMaterial.addTexture("uSampler_1",this.bloomSceneFrameBuffer.attachments['color0'])

        this.blurProcessMaterial = getPostProcessBlurMaterial()
        this.blurProcessMaterial.addTexture("uSampler_1",this.brightnessFrameBuf.attachments['color0'])
        this.blurProcessMaterial.addFloatUniform("textureSizeX",  ()=>{return this.width})
        this.blurProcessMaterial.addFloatUniform("textureSizeY",  ()=>{return this.height})
        this.blurProcessMaterial.addFloatUniform("horizontal",  ()=>{return 1.0})

        this.screenQuad = new MeshRenderer(getQuadMesh(), this.brightnessExtractProcessMaterial)

        this.untexturedMat = getUntexturedMaterial([0,0,0])

    }


    update(rendererObj, camera, time, cube) {
        gl.disable(gl.CULL_FACE)         
        gl.enable(gl.DEPTH_TEST)

        this.bloomSceneFrameBuffer.bind()

        //This is a bit of a hack
        // I want to apply bloom only to the point light cube,
        // so i render the entire scene first with a black tint, then render the cube with the light color
        rendererObj.clearAll(0,0,0,1)


        rendererObj.render(camera.camObj,time) 


        this.brightnessFrameBuf.bind()
        renderer.clearAll(0,0,0,1)      
        renderer.renderMeshRendererForceMaterial(camera.camObj,time,this.screenQuad, this.brightnessExtractProcessMaterial)

        //Blur
        var hor = 1.0
        for(var i=0; i< 4; i++) {
            this.blurFrameBuffer[i % 2].bind()
            rendererObj.clearAll(0,0,0,1)

            if(i==0)
                this.blurProcessMaterial.addTexture("uSampler_1",this.brightnessFrameBuf.attachments['color0'])
            else
                this.blurProcessMaterial.addTexture("uSampler_1",this.blurFrameBuffer[1 - (i % 2)].attachments['color0'])
            
            this.blurProcessMaterial.addFloatUniform("horizontal",  ()=>{return hor})
            rendererObj.renderMeshRendererForceMaterial(camera.camObj,time,this.screenQuad, this.blurProcessMaterial)
        
            hor = hor === 1.0 ? 0.0 : 1.0  
        }
    }
}