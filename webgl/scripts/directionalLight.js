class DirectionalLight
{
    constructor() {
        this.direction = vec3.create()
        this.diffuseColor = vec3.create()
        this.specularColor = vec3.create()

        this.shadowCameraSize = 4
        this.shadowCam = Camera.ortho(-this.shadowCameraSize,this.shadowCameraSize,-this.shadowCameraSize,this.shadowCameraSize,0.1,60)
        this.shadowCam.position = [0,0,10]
        this.shadowCam.updateView()

        this.shadowFrameBuffer = new Framebuffer(2048,2048)
        this.shadowFrameBuffer.addDepthAttachmentFloat()
        this.shadowFrameBuffer.setNoColor()

        this.materialForShadowmap = getDepthRenderMaterial()

        this.ligthtSpaceMatrix = mat4.create()
        this.ligthtSpaceMatrix = mat4.mul(this.ligthtSpaceMatrix, this.shadowCam.projection, this.shadowCam.view)
 
    }

    updateLightFromUI(uiManag) {
        this.direction = uiManag.lightDir
        this.diffuseColor = uiManag.lightDiffuseColor
        this.specularColor = uiManag.lightSpecularColor
    }

    getLightSpaceMatrix() {

    }

    updateShadowMap(rendererObj, time) {
        //Create shadow depth 
        this.shadowFrameBuffer.bind();

        var lightNorm = vec3.create()
        lightNorm = vec3.normalize(lightNorm, this.direction)

        lightNorm[0] *=-1 * this.shadowCam.farPlane *0.5
        lightNorm[1] *=-1* this.shadowCam.farPlane *0.5
        lightNorm[2] *=-1* this.shadowCam.farPlane *0.5

        var toLight = vec3.create()
        toLight = vec3.add(toLight, [0,1.5,0], lightNorm);

        //randomQuad.position = toLightd
        this.shadowCam.position = toLight
        this.shadowCam.target = [0,1.5,0] //Use fixed target

        this.shadowCam.updateView()
        this.ligthtSpaceMatrix = mat4.mul(this.ligthtSpaceMatrix, this.shadowCam.projection, this.shadowCam.view)
        gl.frontFace(gl.CW)
        rendererObj.clearAll(0.0,0.0,0.0,1.0)
        rendererObj.renderForceMaterial(this.shadowCam,time, this.materialForShadowmap)
        Framebuffer.unbind()
        gl.frontFace(gl.CCW)
    }
}