class Camera
{
    constructor() {



        
        
    }

    static perspective(FOV, ratio, near, far) {
        
        var cam = new Camera()
        cam.position = vec3.create()

        cam.target = vec3.create()
        cam.projection = mat4.create()
        mat4.perspective(cam.projection, FOV * 0.0174532925, ratio, near, far)

        cam.nearPlane = near
        cam.farPlane = far
        return cam
    }

    static ortho(left, right, bottom, top, near, far) {
        var cam = new Camera()
        
        cam.position = vec3.create()
        cam.target = vec3.create()

        cam.projection = mat4.create()
        cam.projection = mat4.ortho(cam.projection, left, right, bottom, top, near, far)

        cam.nearPlane = near
        cam.farPlane = far

        return cam
    }
    
    getFrustumMidPoint() {
        var mat = mat4.create();
        mat = mat4.mul(mat, this.projection, this.view)
        
        mat = mat4.invert(mat, mat)

        var points = []

        points[0] = [0,0,-1,1] //near
        points[1] = [0,0,1,1]  //far
 
        var pointsV3 = []
        for(var i=0; i<2; i++)
        {
            points[i] = mat4.mul(points[i], mat, points[i])
            pointsV3[i] = vec3.create()
            pointsV3[i][0] = points[i][0] / points[i][3]
            pointsV3[i][1] = points[i][1]/ points[i][3]
            pointsV3[i][2] = points[i][2] / points[i][3]

        }

        var nearToFar = vec3.create()
        nearToFar = vec3.sub(nearToFar, pointsV3[1], pointsV3[0])
        nearToFar = vec3.normalize(nearToFar, nearToFar)

        var distance = this.farPlane - this.nearPlane
        nearToFar[0] *= distance * 0.5
        nearToFar[1] *= distance * 0.5
        nearToFar[2] *= distance * 0.5

        var mid = vec3.create()        
        mid = vec3.add(mid, this.position, nearToFar)

        return mid
  
    }

    extractFrustumPoints() {
        var mat = mat4.create();

        mat = mat4.mul(mat, this.projection, this.view)
        
     //   mat = mat4.mul(mat, mat, this.projection)
        mat = mat4.invert(mat, mat)

        var points = []
        for(var i=0; i<8; i++)
        {
            points[i] = vec4.create()
        }

        points[0] = [-1,-1,-1,1]
        points[1] = [-1,1,-1,1]
        points[2] = [1,1,-1,1]
        points[3] = [1,-1,-1,1]

        points[4] = [-1,-1,1,1]
        points[5] = [-1,1,1,1]
        points[6] = [1,1,1,1]
        points[7] = [1,-1,1,1]

        var pointsV3 = []
        for(var i=0; i<8; i++)
        {
         //   points[i] = mat4.transpose(points[i], points[i])
            points[i] = mat4.mul(points[i], mat, points[i])
            pointsV3[i] = vec3.create()
            pointsV3[i][0] = points[i][0]
            pointsV3[i][1] = points[i][1]
            pointsV3[i][2] = points[i][2] 

        }

        return pointsV3
    }

    updateView() {
        this.view = mat4.create()
        var fwd = vec3.create()
        fwd = vec3.add(fwd, this.position, [0,0,-1])
        this.view = mat4.lookAt(this.view, this.position, this.target, [0,1,0])
    }



}