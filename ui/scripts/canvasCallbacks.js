var mousePosition = [0,0]
var mousePositionDelta = [0,0]
var upDown = 0
var leftButtonDown = false
var rightButtonDown = false
var midButtonDown = false
var moving = false
$( document ).ready(function() {


    var clicking = false

    $("#mycanvas").mouseup(function(){
        leftButtonDown = false
        rightButtonDown = false
        midButtonDown = false
    });
      
    $("#mycanvas").mousedown(function(e){
        switch (e.which) {
            case 1:
                clicking = true
                mousePositionDelta = [0,0]
                mousePosition = [e.pageX,e.pageY]
                leftButtonDown = true

                break;
            case 2:
               midButtonDown = true

                break;
            case 3:
                rightButtonDown = true
                break;
            default:
                alert('You have a strange Mouse!');
        }


    });

    
    $( document ).on( "keydown", function( e ){
        e.preventDefault()
  
        if(e.key === 'a')
            mousePositionDelta[0] = 1
        else if(e.key === 'd')
            mousePositionDelta[0] = -1
        if(e.key === 'w')
            mousePositionDelta[1] = 1
        else if(e.key === 's')
            mousePositionDelta[1] = -1

        if(e.key === 'q')
            upDown = 1
        else if(e.key === 'z')
            upDown = -1
    })

    $( document ).on( "keyup", function( e ){

        mousePositionDelta = [0,0]
        upDown = 0
    })

})


