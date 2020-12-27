class MeshRenderer
{
    constructor(mesh, material)
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

        this.material = material;
        this.mesh = mesh

    }

    getModel() {
        var model = mat4.create();
          mat4.translate(model,model,[this.position[0], this.position[1], this.position[2]])
          mat4.rotate(model,model,this.rotation[0] * 0.0174532925,[1,0,0])
          mat4.rotate(model,model,this.rotation[1] * 0.0174532925,[0,1,0])
          mat4.rotate(model,model,this.rotation[2] * 0.0174532925,[0,0,1])
          mat4.scale(model,model,[this.scale[0], this.scale[1], this.scale[2]])
          return model

    }

    updateShaderWithMaterialInfo(camera) {

        var model = this.getModel()
  
                //Get the attribute location
        var modMatrixUniform = gl.getUniformLocation(this.material.shader, "model")
        var viewMatrixUniform = gl.getUniformLocation(this.material.shader, "view")
        var perspMatrixUniform = gl.getUniformLocation(this.material.shader, "perspective")
        gl.uniformMatrix4fv(modMatrixUniform, false, model);
        gl.uniformMatrix4fv(viewMatrixUniform, false, camera.view);
        gl.uniformMatrix4fv(perspMatrixUniform, false, camera.projection);

        if(this.material.lightSpace != undefined)
        {
            var lightSpace = gl.getUniformLocation(this.material.shader, "lightSpace")
            gl.uniformMatrix4fv(lightSpace, false, this.material.lightSpace);


        }
    }

    updateShaderWithMaterialInfoForceMaterial(cam, material) {

        var model = this.getModel()
  
                //Get the attribute location
        var modMatrixUniform = gl.getUniformLocation(material.shader, "model")
        var viewMatrixUniform = gl.getUniformLocation(material.shader, "view")
        gl.uniformMatrix4fv(modMatrixUniform, false, model);
        gl.uniformMatrix4fv(viewMatrixUniform, false, cam.view);
        var perspMatrixUniform = gl.getUniformLocation(material.shader, "perspective")
        gl.uniformMatrix4fv(perspMatrixUniform, false, cam.projection);
    }

    renderForceMaterial(camera, time, material)
    {
        material.onPreRender()
        
        //This below needs to be called during rendering
        this.mesh.bind()
        var position = gl.getAttribLocation(material.shader, "position");
        var color = gl.getAttribLocation(material.shader, "color");
        var uv = gl.getAttribLocation(material.shader, "uv");
        var normals = gl.getAttribLocation(material.shader, "normal");
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
   

    render(camera, time)
    {
        this.material.onPreRender()
        
        //This below needs to be called during rendering
        this.mesh.bind()
        var position = gl.getAttribLocation(this.material.shader, "position");
        var color = gl.getAttribLocation(this.material.shader, "color");
        var uv = gl.getAttribLocation(this.material.shader, "uv");
        var normals = gl.getAttribLocation(this.material.shader, "normal");
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