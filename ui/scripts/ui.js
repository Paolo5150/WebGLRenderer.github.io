class UIManager {
    constructor() {

        this.lightDir = vec3.create()
        this.lightDir[0] = 0
        this.lightDir[1] = -1
        this.lightDir[2] = -1
    }
}


let uiManager = new UIManager()





function onLightDirectionChange(e){
    
    if(e === 'x')
        uiManager.lightDir[0] = $("#dirLightX").val()

    if(e === 'y')
        uiManager.lightDir[1] = $("#dirLightY").val()

    if(e === 'z')
        uiManager.lightDir[2] = $("#dirLightZ").val()
}