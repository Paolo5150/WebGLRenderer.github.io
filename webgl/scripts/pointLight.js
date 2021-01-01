class PointLight
{
    constructor() {
        this.position = vec3.create()
        this.color = vec3.create()
        this.intensity = 1.0

        this.shadowFrameBuffer = new Framebuffer(1024,1024)
        this.shadowFrameBuffer.addCubeDepthAttachmentFloat()

        this.materialForShadowmap = getLinearDepthRenderMaterial()
        this.materialForShadowmap.addVec3Uniform("lightPos", ()=>{return this.position})
        this.materialForShadowmap.addFloatUniform("farPlane", ()=>{return 50.0})
        this.shadowCasters = []


        this.cameras = []

        //Order matters, follows the cubemap face macros
        this.cameras[0] = Camera.perspective(90.0, 1.0, 0.1,50.0)
        this.cameras[1] = Camera.perspective(90.0, 1.0, 0.1,50.0)        
        this.cameras[2] = Camera.perspective(90.0, 1.0, 0.1,50.0)
        this.cameras[3] = Camera.perspective(90.0, 1.0, 0.1,50.0)  
        this.cameras[4] = Camera.perspective(90.0, 1.0, 0.1,50.0)
        this.cameras[5] = Camera.perspective(90.0, 1.0, 0.1,50.0)


               
    }

    updateLightFromUI(uiManag) {
        this.position = uiManag.lightPos
        this.color = [1,1,1] //TODO
        this.intensity = uiManag.pLightIntensity
        this.updateCameras()

    }

    updateCameras() {
        //Order matters, follows the cubemap face macros
        //Right

        this.cameras[0].view = mat4.lookAt(this.cameras[0].view, this.position, [this.position[0] + 1, this.position[1],this.position[2]], [0,-1,0])
        //Left
        this.cameras[1].view = mat4.lookAt(this.cameras[1].view, this.position, [this.position[0] - 1, this.position[1],this.position[2]], [0,-1,0])   
        //Top

        this.cameras[2].view = mat4.lookAt(this.cameras[2].view, this.position, [this.position[0] , this.position[1] + 1,this.position[2]], [0,0,1])
        //Bottom


        this.cameras[3].view = mat4.lookAt(this.cameras[3].view, this.position, [this.position[0] , this.position[1] - 1,this.position[2]], [0,0,-1])   

        //Front
    
        this.cameras[4].view = mat4.lookAt(this.cameras[4].view, this.position, [this.position[0] , this.position[1],this.position[2] + 1], [0,-1,0])

        //Back
  
        this.cameras[5].view = mat4.lookAt(this.cameras[5].view, this.position, [this.position[0] , this.position[1],this.position[2] - 1], [0,-1,0])
    }

    updateShadowMap(rendererObj, time) {

        this.shadowFrameBuffer.bind();
        gl.drawBuffers( [gl.NONE]);
        gl.readBuffer([gl.NONE]);
        gl.frontFace(gl.CW)

        for(var i=0; i < 6; i++)
        {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i , this.shadowFrameBuffer.attachments['depth'].textID, 0);
            gl.enable(gl.DEPTH_TEST)
            renderer.clearAll(0,0,0,1)
            for(var m=0; m < this.shadowCasters.length; m++)
            {

                rendererObj.renderMeshRendererForceMaterial(this.cameras[i],time, this.shadowCasters[m], this.materialForShadowmap)
            }
        }
        gl.frontFace(gl.CCW)

    }
}