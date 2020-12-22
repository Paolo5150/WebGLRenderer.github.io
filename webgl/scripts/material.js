class Material {

    constructor(shader) {

        this.shader = shader
        this.textures = []

    }

    addTexture(uniformName, textureID) {

        var textureLocation = gl.getUniformLocation(this.shader, uniformName);
        gl.uniform1i(textureLocation, Object.keys(this.textures).length);
        this.textures[uniformName] = textureID


    }

    bind() {


        for(var i=0; i< Object.keys(this.textures).length; i++) {

            gl.activeTexture(gl.TEXTURE0 + i);
            var key = Object.keys(this.textures)[i]
            this.textures[key].bind()



        }
        

    }
}