class BloomEffect
{
    constructor(width, height) {

        this.width = width
        this.height = height

        this.bloomSceneFrameBuffer = new Framebuffer(width, height)
        this.bloomSceneFrameBuffer.addColorAttachmentFloatFormat( 1)
        this.bloomSceneFrameBuffer.addDepthAttachment()

        this.brightnessFrameBuf = new Framebuffer(width, height)
        this.brightnessFrameBuf.addColorAttachmentFloatFormat( 1)

        this.blurFrameBuffer = []
        this.blurFrameBuffer[0] = new Framebuffer(width, height)
        this.blurFrameBuffer[0].addColorAttachmentFloatFormat( 1)
        this.blurFrameBuffer[1] = new Framebuffer(width, height)
        this.blurFrameBuffer[1].addColorAttachmentFloatFormat( 1)

        this.brightnessExtractProcessMaterial = getPostProcessBrightnessExtractMaterial()
        this.brightnessExtractProcessMaterial.addTexture("uSampler_1",this.bloomSceneFrameBuffer.attachments['color0'])

        this.blurProcessMaterial = getPostProcessBlurMaterial()
        this.blurProcessMaterial.addTexture("uSampler_1",this.brightnessFrameBuf.attachments['color0'])
        this.blurProcessMaterial.addFloatUniform("textureSizeX",  ()=>{return this.width})
        this.blurProcessMaterial.addFloatUniform("textureSizeY",  ()=>{return this.height})
        this.blurProcessMaterial.addFloatUniform("horizontal",  ()=>{return 1.0})

        this.screenQuad = new MeshRenderer(getQuadMesh(), this.brightnessExtractProcessMaterial)

    }

    update(rendererObj, camera, time, cube) {
        this.bloomSceneFrameBuffer.bind()

        rendererObj.clearAll(0,0,0,1)        
        if(cube != null)
            rendererObj.renderMeshRenderer(camera,time, cube)

        bloomEffect.brightnessFrameBuf.bind()
        renderer.clearAll(0,0,0,1)        
        renderer.renderMeshRendererForceMaterial(camera,time,this.screenQuad, this.brightnessExtractProcessMaterial)

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
            rendererObj.renderMeshRendererForceMaterial(camera,time,this.screenQuad, this.blurProcessMaterial)
        
            hor = hor === 1.0 ? 0.0 : 1.0  
        }
    }
}