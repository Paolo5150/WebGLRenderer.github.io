class UIManager {
    constructor() {

        this.lightDir = vec3.create()
        this.lightDir = [1,-1,-1]

        this.lightDiffuseColor = vec3.create()
        this.lightDiffuseColor = [1,1,1]

        this.dirLightIntensity = 0.2

        //Point light
        this.lightPos = vec3.create()
        this.lightPos = [-3.7,5.1,-1.8]
        this.pLightIntensity = 0.8

        this.gamma = 0.6
        this.exposure = 1.4
        this.useBloom = false
    }

    initialize() {

         $("#dirLightX").val(this.lightDir[0])
         $("#dirLightY").val(this.lightDir[1])
         $("#dirLightZ").val(this.lightDir[2])
         
         $("#lightPosX").val(this.lightPos[0])
         $("#lightPosY").val(this.lightPos[1])
         $("#lightPosZ").val(this.lightPos[2])

         $("#gamma").val(this.gamma )
         $("#exposure").val(this.exposure )

         $("#lightIntensity").val(this.dirLightIntensity)

    }
}


let uiManager = new UIManager()
uiManager.initialize()

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : null;
  }

  function onBloomChange(e)
  {
    uiManager.useBloom = !uiManager.useBloom

  }

function onLightDirectionChange(e){
    
    if(e === 'x')
        uiManager.lightDir[0] = parseFloat($("#dirLightX").val())

    if(e === 'y')
        uiManager.lightDir[1] = parseFloat($("#dirLightY").val())

    if(e === 'z')
        uiManager.lightDir[2] =parseFloat($("#dirLightZ").val())

}

function onLightPositionChange(e) {
    if(e === 'x')
        uiManager.lightPos[0] = parseFloat($("#lightPosX").val())

    if(e === 'y')
        uiManager.lightPos[1] = parseFloat($("#lightPosY").val())

    if(e === 'z')
        uiManager.lightPos[2] = parseFloat($("#lightPosZ").val())

}

function onLightDiffuseColorChange() {

    var col = $("#lightDifColor").val()
    var rgb = hexToRgb(col)
    uiManager.lightDiffuseColor = [rgb.r, rgb.g, rgb.b]
}


function onLightIntensityChange() {
    var i = parseFloat($("#lightIntensity").val())

    uiManager.dirLightIntensity = i
}

function onPointLightIntensityChange() {
    var i = parseFloat($("#pointLightIntensity").val())

    uiManager.pLightIntensity = i
}

function onGammaChange(e){
    uiManager.gamma = parseFloat($("#gamma").val())
}

function onExposureChange(e){
    uiManager.exposure = parseFloat($("#exposure").val())
}
