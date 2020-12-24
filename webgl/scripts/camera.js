class Camera
{
    constructor() {

        this.position = vec3.create()

        this.target = vec3.create()

        this.projection = mat4.create()
        mat4.perspective(this.projection, 45, 16/9, 1, 100)

        this.view = mat4.create()
        mat4.lookAt(this.view, this.position, this.target, [0,1,0])
        
        
    }

    updateView() {
        this.view = mat4.create()
        mat4.lookAt(this.view, this.position, this.target, [0,1,0])
    }



}