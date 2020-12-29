class TextureViewer{

    //Position and scale in normalized screen space
    // texture parameter is of type Texture
    constructor(position, scale, texture) {
        this.textureOnlyShader = createShaderProgram(getTextureOnlyShaderVertex(), getTextureOnlyShaderFragment())
        this.textureOnlyMaterial = new Material(this.textureOnlyShader)
        this.textureOnlyMaterial.addTexture("uSampler_1",texture)

        this.quad = new MeshRenderer(getQuadMesh(), this.textureOnlyMaterial)
        this.quad.scale = scale
        this.quad.position = position
    }
}