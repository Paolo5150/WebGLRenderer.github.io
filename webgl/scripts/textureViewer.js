class TextureViewer{

    //Position and scale in normalized screen space
    // texture parameter is of type Texture
    //isDepth is actually a float, but a bool can be passed in
    constructor(position, scale, texture, isDepth = 0.0) {
        this.textureOnlyShader = createShaderProgram(getTextureOnlyShaderVertex(), getTextureOnlyShaderFragment())
        this.textureOnlyMaterial = new Material(this.textureOnlyShader)
        this.textureOnlyMaterial.addTexture("image",texture)
        this.textureOnlyMaterial.addFloatUniform("isDepth", ()=>{return isDepth})

        this.quad = new MeshRenderer(getQuadMesh(), this.textureOnlyMaterial)
        this.quad.scale = scale
        this.quad.position = position
    }

    setTexture(texture) {
        this.textureOnlyMaterial.addTexture("image",texture)

    }
    
}

class CubemapTextureViewer{

    //Position and scale in normalized screen space
    // texture parameter is of type Texture
    //isDepth is actually a float, but a bool can be passed in
    constructor(position, scale, cubemap, target, isDepth = 0.0) {
        this.textureOnlyShader = createShaderProgram(getTextureOnlyShaderVertex(), getTextureOnlyShaderFragment())
        this.textureOnlyMaterial = new Material(this.textureOnlyShader)
        this.textureOnlyMaterial.addCubeMap("image",cubemap)
        this.textureOnlyMaterial.addFloatUniform("isDepth", ()=>{return isDepth})

        this.quad = new MeshRenderer(getQuadMesh(), this.textureOnlyMaterial)
        this.quad.scale = scale
        this.quad.position = position

        if(target == 'back')
        {
            this.quad.mesh.vertices[0].normal = [1,1,-1]
            this.quad.mesh.vertices[1].normal = [-1,1,-1]
            this.quad.mesh.vertices[2].normal = [-1,-1,-1]
            this.quad.mesh.vertices[3].normal = [1,-1,-1]
        }
        if(target == 'front')
        {
            this.quad.mesh.vertices[3].normal = [-1,-1,1]
            this.quad.mesh.vertices[2].normal = [1,-1,1]
            this.quad.mesh.vertices[1].normal = [1,1,1]
            this.quad.mesh.vertices[0].normal = [-1,1,1]
        }
        if(target == 'left')
        {
            this.quad.mesh.vertices[0].normal = [-1,1,-1]
            this.quad.mesh.vertices[1].normal = [-1,1,1]
            this.quad.mesh.vertices[2].normal = [-1,-1,1]
            this.quad.mesh.vertices[3].normal = [-1,-1,-1]
        }
        if(target == 'right')
        {
            this.quad.mesh.vertices[0].normal = [1,1,1]
            this.quad.mesh.vertices[1].normal = [1,1,-1]
            this.quad.mesh.vertices[2].normal = [1,-1,-1]
            this.quad.mesh.vertices[3].normal = [1,-1,1]
        }
        if(target == 'top')
        {
            this.quad.mesh.vertices[3].normal = [-1,1,1]
            this.quad.mesh.vertices[2].normal = [1,1,1]
            this.quad.mesh.vertices[1].normal = [1,1,-1]
            this.quad.mesh.vertices[0].normal = [-1,1,-1]
        }
        if(target == 'bottom')
        {
            this.quad.mesh.vertices[0].normal = [-1,-1,1]
            this.quad.mesh.vertices[1].normal = [1,-1,1]
            this.quad.mesh.vertices[2].normal = [1,-1,-1]
            this.quad.mesh.vertices[3].normal = [-1,-1,-1]
        }
        

        this.quad.mesh.updateVerticesBuffer()
    }
    
}