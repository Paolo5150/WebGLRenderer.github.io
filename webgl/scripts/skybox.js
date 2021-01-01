class Skybox
{
    constructor(cubemap, cubeMesh)
    {
        this.skyboxShader = createShaderProgram(getSkyboxVertex(), getSkyboxFragment())
        this.skyboxMat = new Material(this.skyboxShader)
        this.skyboxMat.addCubeMap("cubeMap", cubemap)

        this.mesh = cubeMesh
    }

    render(camera, time)
    {
        gl.disable(gl.CULL_FACE)
        renderer.renderMeshRendererForceMaterial(camera,time,this.mesh, this.skyboxMat)
        gl.enable(gl.CULL_FACE)


    }

    setCubemap(cm)
    {
        this.skyboxMat.addCubeMap("cubeMap", cm)

    }
}