class MeshRenderer
{
    constructor(mesh, shader)
    {
        this.position = vec3.create()
        this.position[0] = 0
        this.position[1] = 0
        this.position[2]= 0

        this.rotation = vec3.create()
        this.rotation[0] = 0
        this.rotation[1] = 0
        this.rotation[2] = 0

        this.scale = vec3.create()
        this.scale[0] = 1
        this.scale[1] = 1
        this.scale[2] = 1

        this.shaderProgram = shader;
        this.mesh = mesh
    }

    render(camera, time)
    {
        gl.useProgram(this.shaderProgram);

        //Update shader
          //Get the attribute location
          var modMatrixUniform = gl.getUniformLocation(this.shaderProgram, "model")
          var perspMatrixUniform = gl.getUniformLocation(this.shaderProgram, "perspective")
          var camPositionUniform = gl.getUniformLocation(this.shaderProgram, "camPos")

          var model = mat4.create();
          mat4.translate(model,model,[this.position[0], this.position[1], this.position[2]])
          mat4.rotate(model,model,this.rotation[0],[1,0,0])
          mat4.rotate(model,model,this.rotation[1] + time / 3000.0,[0,1,0])
          mat4.rotate(model,model,this.rotation[2],[0,0,1])
          mat4.scale(model,model,[this.scale[0], this.scale[1], this.scale[2]])
  
          gl.uniformMatrix4fv(modMatrixUniform, false, model);
          gl.uniformMatrix4fv(perspMatrixUniform, false, camera.projection);

          gl.uniform3fv(camPositionUniform, camera.position);


          var position = gl.getAttribLocation(this.shaderProgram, "position");
          var color = gl.getAttribLocation(this.shaderProgram, "color");
          var uv = gl.getAttribLocation(this.shaderProgram, "uv");
          var normals = gl.getAttribLocation(this.shaderProgram, "normal");

          //This below needs to be called during rendering
          this.mesh.bind()

          gl.enableVertexAttribArray(position);
          gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 44, 0);
  
          gl.enableVertexAttribArray(color);
          gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 44, 12);
  
          gl.enableVertexAttribArray(uv);
          gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 44, 24);

          gl.enableVertexAttribArray(normals);
          gl.vertexAttribPointer(normals, 3, gl.FLOAT, false, 44, 32);

         this.mesh.render()
    }
}