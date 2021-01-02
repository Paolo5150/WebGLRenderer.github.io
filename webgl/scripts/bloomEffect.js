class BloomEffect
{
    constructor(width, height) {

        this.width = width
        this.height = height

        this.bloomSceneFrameBuffer = new Framebuffer(width, height)
        this.bloomSceneFrameBuffer.addTextureColorAttachment( 1, Texture.Create(gl.RGBA16F, gl.RGBA, gl.FLOAT, gl.LINEAR, gl.LINEAR, gl.REPEAT))
        this.bloomSceneFrameBuffer.addDepthAttachment()

        this.brightnessFrameBuf = new Framebuffer(width, height)
        this.brightnessFrameBuf.addTextureColorAttachment( 1, Texture.Create(gl.RGBA16F, gl.RGBA, gl.FLOAT, gl.LINEAR, gl.LINEAR, gl.REPEAT))

        this.blurFrameBuffer = []
        this.blurFrameBuffer[0] = new Framebuffer(width, height)
        this.blurFrameBuffer[0].addTextureColorAttachment( 1, Texture.Create(gl.RGBA16F, gl.RGBA, gl.FLOAT, gl.LINEAR, gl.LINEAR, gl.REPEAT))
        this.blurFrameBuffer[1] = new Framebuffer(width, height)
        this.blurFrameBuffer[1].addTextureColorAttachment( 1, Texture.Create(gl.RGBA16F, gl.RGBA, gl.FLOAT, gl.LINEAR, gl.LINEAR, gl.REPEAT))

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
        this.bloomSceneFrameBuffer.bind()
        gl.enable(gl.DEPTH_TEST)

        //This is a bit of a hack
        // I want to apply bloom only to the point light cube,
        // so i render the entire scene first with a black tint, then render the cube with the light color
        rendererObj.clearAll(0,0,0,1)
        this.untexturedMat.addVec3Uniform("tint", ()=>{return [0,0,0]})
        rendererObj.renderForceMaterial(camera,time, this.untexturedMat)
        this.untexturedMat.addVec3Uniform("tint", ()=>{return [1,1,1]})
        if(cube != null)
        renderer.renderMeshRendererForceMaterial(camera,time,cube, this.untexturedMat)
    


        bloomEffect.brightnessFrameBuf.bind()
        gl.disable(gl.DEPTH_TEST)
        renderer.clearAll(0,0,0,1)        
        renderer.renderMeshRendererForceMaterial(camera,time,this.screenQuad, this.brightnessExtractProcessMaterial)

        //Blur
        var hor = 1.0
        for(var i=0; i< 2; i++) {
            this.blurFrameBuffer[i % 2].bind()
            rendererObj.clearAll(0,0,0,1)

            if(i==0)
                this.blurProcessMaterial.addTexture("uSampler_1",this.brightnessFrameBuf.attachments['color0'])
            else
                this.blurProcessMaterial.addTexture("uSampler_1",this.blurFrameBuffer[1 - (i % 2)].attachments['color0'])
            
            this.blurProcessMaterial.addFloatUniform("horizontal",  ()=>{return hor})
            rendererObj.renderMeshRendererForceMaterial(camera,time,this.screenQuad, this.blurProcessMaterial)
        
            hor = hor === 1.0 ? 0.0 : 1.0  
        }
    }
}