class Camera
{
    constructor() {

        this.position = vec3.create()

        this.direction = vec3.create()

        this.projection = mat4.create()
        mat4.perspective(this.projection, 45, 16/9, 1, 100)

        this.view = mat4.create()
        mat4.lookAt(this.view, this.position, this.direction, [0,1,0])
        
        
    }

    getViewMatrix() {

    }


}