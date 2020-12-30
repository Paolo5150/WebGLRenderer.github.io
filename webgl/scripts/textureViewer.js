class TextureViewer{

    //Position and scale in normalized screen space
    // texture parameter is of type Texture
    //isDepth is actually a float, but a bool can be passed in
    constructor(position, scale, texture, isDepth = 0.0) {
        this.textureOnlyShader = createShaderProgram(getTextureOnlyShaderVertex(), getTextureOnlyShaderFragment())
        this.textureOnlyMaterial = new Material(this.textureOnlyShader)
        this.textureOnlyMaterial.addTexture("uSampler_1",texture)
        this.textureOnlyMaterial.addFloatUniform("isDepth", ()=>{return isDepth})

        this.quad = new MeshRenderer(getQuadMesh(), this.textureOnlyMaterial)
        this.quad.scale = scale
        this.quad.position = position
    }
}