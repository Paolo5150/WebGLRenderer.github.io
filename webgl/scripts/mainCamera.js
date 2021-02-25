class MainCamera
{
    constructor() {
        this.camObj = Camera.perspective(60,16.0/9.0,0.1,50)
        this.camObj.position = [0 , 4 , 5]
        this.camObj.updateView()
        this.cameraAngle = Math.PI / 2.0
        this.cameraDistance = 15
        this.camObj.target = [0,3,0]

    }

    update(delta) {

        this.camObj.position[1] -= mousePositionDelta[1] / 2.0 * delta * 10
    
        this.cameraAngle += mousePositionDelta[0] / 4.0 * delta 
    
        this.camObj.position[0] = Math.cos(this.cameraAngle) * this.cameraDistance
        this.camObj.position[2] = Math.sin(this.cameraAngle) * this.cameraDistance   
    
        this.camObj.updateView()
    }
}