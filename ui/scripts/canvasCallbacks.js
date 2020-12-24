var mousePosition = [0,0]
var mousePositionDelta = [0,0]
var moving = false
$( document ).ready(function() {


    var clicking = false

    $("#mycanvas").mouseup(function(){
        clicking = false
    });
      
    $("#mycanvas").mousedown(function(e){
        e.preventDefault()
        switch (e.which) {
            case 1:
                clicking = true
                mousePositionDelta = [0,0]
                mousePosition = [e.pageX,e.pageY]

                break;
            case 2:
               // alert('Middle Mouse button pressed.');
                break;
            case 3:
                break;
            default:
                alert('You have a strange Mouse!');
        }


    });

    
    $( document ).on( "keydown", function( e ){

        if(e.key === 'a')
            mousePositionDelta[0] = -1
        if(e.key === 'd')
            mousePositionDelta[0] = 1
        if(e.key === 'w')
            mousePositionDelta[1] = -1
        if(e.key === 's')
            mousePositionDelta[1] = 1
    })

    $( document ).on( "keyup", function( e ){

        mousePositionDelta = [0,0]
    })

})

