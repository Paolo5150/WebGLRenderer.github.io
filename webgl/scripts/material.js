class Material {

    constructor(shader) {

        this.shader = shader
        this.textures = []
        this.onPreRender = ()=>{}

    }

    addTexture(uniformName, textureID) {

        
        this.textures[uniformName] = textureID


    }

    bind() {

        gl.useProgram(this.shader);
        
        for(var i=0; i< Object.keys(this.textures).length; i++) {

            var textureLocation = gl.getUniformLocation(this.shader, Object.keys(this.textures)[i]);
            gl.uniform1i(textureLocation, i);

            gl.activeTexture(gl.TEXTURE0 + i);
            var key = Object.keys(this.textures)[i]
            this.textures[key].bind()

        }

        this.onPreRender()
        

    }
}