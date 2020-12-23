class UIManager {
    constructor() {

        this.lightDir = vec3.create()
        this.lightDir[0] = 0
        this.lightDir[1] = -1
        this.lightDir[2] = -1

        this.gamma = 0.8
        this.exposure = 2.0
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

function onGammaChange(e){
    uiManager.gamma = $("#gamma").val()
}

function onExposureChange(e){
    uiManager.exposure = $("#exposure").val()
}
