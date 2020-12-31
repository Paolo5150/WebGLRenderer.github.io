class Material {

    constructor(shader) {

        this.name = "Unamed material"
        this.shader = shader
        this.textures = []
        this.cubemaps = []
        this.mat4Uniforms = []
        this.vec3Uniforms = []
        this.floatUniforms = []
        this.onPreRender = ()=>{}

    }

    addTexture(uniformName, textureID) {
        
        this.textures[uniformName] = textureID

    }

    addCubeMap(uniformName, textureID) {
        
        this.cubemaps[uniformName] = textureID

    }
    
    updateShader() {
    }

    //Pass in a lambda that returns a mat4
    addMat4Uniform (unifomName, matrixLambda) {
        this.mat4Uniforms[unifomName] = matrixLambda

    }

    addVec3Uniform (unifomName, vec3Uniform) {
        this.vec3Uniforms[unifomName] = vec3Uniform
    }

    addFloatUniform(uniformName,floatU) {
        this.floatUniforms[uniformName] = floatU

    }

    static unbind() {
        gl.useProgram(null)
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null)
    }

    bind() {

        gl.useProgram(this.shader);
        var t = 0;
        //console.log("Binding MATERIAL " + this.name)
        if(Object.keys(this.textures).length > 0)
        {

            for(var i=0; i< Object.keys(this.textures).length; i++) {

                var textureLocation = gl.getUniformLocation(this.shader, Object.keys(this.textures)[i]);
                gl.uniform1i(textureLocation, t);
                gl.activeTexture(gl.TEXTURE0 + t);
                var key = Object.keys(this.textures)[i]
                this.textures[key].bind()   
               // console.log("Binding texture " + Object.keys(this.textures)[i] + " loc " + JSON.stringify(textureLocation) + ", ID " + i )
                t++


            }
        }

        if(Object.keys(this.cubemaps).length > 0)
        {
            for(var i=0; i< Object.keys(this.cubemaps).length; i++) {

                var textureLocation = gl.getUniformLocation(this.shader, Object.keys(this.cubemaps)[i]);
                gl.uniform1i(textureLocation, t);    
                gl.activeTexture(gl.TEXTURE0 + t);
                var key = Object.keys(this.cubemaps)[i]

                this.cubemaps[key].bind()
    
                t++;
            }
        }   

        var mat4uniformKeys = Object.keys(this.mat4Uniforms)
        for(var i=0; i< mat4uniformKeys.length; i++) {
        
            var mat4Uniform = gl.getUniformLocation(this.shader, mat4uniformKeys[i])
            gl.uniformMatrix4fv(mat4Uniform, false, this.mat4Uniforms[mat4uniformKeys[i]]());
        
        }     
        
        var vec3UniformKeys = Object.keys(this.vec3Uniforms)
        for(var i=0; i< vec3UniformKeys.length; i++) {
        
            var vec3U = gl.getUniformLocation(this.shader, vec3UniformKeys[i])
            gl.uniform3fv(vec3U, this.vec3Uniforms[vec3UniformKeys[i]]());
        
        }

        var floatUniformKeys = Object.keys(this.floatUniforms)
        for(var i=0; i< floatUniformKeys.length; i++) {
        
            var fu = gl.getUniformLocation(this.shader, floatUniformKeys[i])
            gl.uniform1f(fu, this.floatUniforms[floatUniformKeys[i]]());

        }

    }
}