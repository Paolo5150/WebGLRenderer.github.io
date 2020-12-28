
async function loadOBJ(pathToFile)
{

    return new Promise((resolve, reject) => {
        OBJLoader.load(pathToFile, function (wolf){

            var group = wolf.groups[Object.keys(wolf.groups)[0]];
            var faces = group.faces
            
            var gVertices = group.vertices
            var gUvs = group.texCoords
            var gNormals = group.normals
            console.log(wolf.normals)

            gVertices = wolf.vertices
            gUvs = wolf.texCoords
            gNormals = wolf.normals
        
            var index = 0;
            var allIndex = []
            var allVertex = []
        
            if(faces != undefined)
            {
                for(var i = 0;i<faces.length;i++){   //for each face
                    var face = faces[i];

                    var tempVertices = []
            
                    for(var n = 0;n < face.length;n++) { //for each vertex
                        
                        var indices = face[n];
                        var vertex = gVertices[indices[0]] //get the vertex (indices[0] is position index)
            
                        var uv = gUvs[indices[1]] //get the vertex (indices[0] is position index)
                        var normal = gNormals[indices[2]] //get the vertex (indices[0] is position index)
            
                        let v = new Vertex(vertex[0], vertex[1], vertex[2])
                        v.uv[0] = uv[0]
                        v.uv[1] = uv[1]
                        if(normal != undefined)
                        {
                            v.normal[0] = normal[0]
                            v.normal[1] = normal[1]
                            v.normal[2] = normal[2]
                        }
                                         
                        tempVertices.push(v)
                        
                        allVertex.push(v)
                        allIndex.push(index)
                        index++  
                    }    
                    
                    if(normal == undefined)
                    {

                        var v1v2 = vec3.create()
                        v1v2[0] = tempVertices[1].position[0] - tempVertices[0].position[0]
                        v1v2[1] = tempVertices[1].position[1] - tempVertices[0].position[1]
                        v1v2[2] = tempVertices[1].position[2] - tempVertices[0].position[2]

                        var v1v3 = vec3.create()
                        v1v3[0] = tempVertices[2].position[0] - tempVertices[0].position[0]
                        v1v3[1] = tempVertices[2].position[1] - tempVertices[0].position[1]
                        v1v3[2] = tempVertices[2].position[2] - tempVertices[0].position[2]

                        var cross = vec3.create()      
                        vec3.cross(cross, v1v2, v1v3)

                        vec3.normalize(cross, cross)

                        for(var counter = 0; counter < 3; counter++)
                        {
                            allVertex[(allVertex.length - 1) - counter].normal = cross
                        }

                    }

                    //Calculate tangent and bitangent
                    var edge1  = vec3.create()
                    edge1 [0] = tempVertices[1].position[0] - tempVertices[0].position[0]
                    edge1 [1] = tempVertices[1].position[1] - tempVertices[0].position[1]
                    edge1 [2] = tempVertices[1].position[2] - tempVertices[0].position[2]

                    var edge2  = vec3.create()
                    edge2 [0] = tempVertices[2].position[0] - tempVertices[0].position[0]
                    edge2 [1] = tempVertices[2].position[1] - tempVertices[0].position[1]
                    edge2 [2] = tempVertices[2].position[2] - tempVertices[0].position[2]

                    var deltaUV1  = vec2.create()
                    deltaUV1[0] = tempVertices[1].uv[0] - tempVertices[0].uv[0]
                    deltaUV1[1] = tempVertices[1].uv[1] - tempVertices[0].uv[1]

                    var deltaUV2  = vec2.create()
                    deltaUV2[0] = tempVertices[2].uv[0] - tempVertices[0].uv[0]
                    deltaUV2[1] = tempVertices[2].uv[1] - tempVertices[0].uv[1]

                    var f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

                    for(var counter = 0; counter < 3; counter++)
                        {
                            allVertex[(allVertex.length - 1) - counter].tangent[0] = f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
                            allVertex[(allVertex.length - 1) - counter].tangent[1] = f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
                            allVertex[(allVertex.length - 1) - counter].tangent[2] = f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);

                            allVertex[(allVertex.length - 1) - counter].bitangent[0] = f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]);
                            allVertex[(allVertex.length - 1) - counter].bitangent[1] = f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]);
                            allVertex[(allVertex.length - 1) - counter].bitangent[2] = f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2]);
                        } 
                }

            let mm = new Mesh(allVertex, allIndex)

            resolve(mm)
            }

            
        
            
          })
      });
    
}



function getQuadMesh() {

    let v1 = new Vertex(-0.5,-0.5,0.0)
    v1.normal[0] = 0
    v1.normal[1] = 0
    v1.normal[2] = 1
    v1.uv[0] = 0
    v1.uv[1] = 0

    let v2 = new Vertex(0.5,-0.5,0.0)
    v2.normal[0] = 0
    v2.normal[1] = 0
    v2.normal[2] = 1
    v2.uv[0] = 1
    v2.uv[1] = 0

    let v3 = new Vertex(0.5,0.5,0.0)
    v3.normal[0] = 0
    v3.normal[1] = 0
    v3.normal[2] = 1
    v3.uv[0] = 1
    v3.uv[1] = 1

    let v4 = new Vertex(-0.5,0.5,0.0)
    v4.normal[0] = 0
    v4.normal[1] = 0
    v4.normal[2] = 1
    v4.uv[0] = 0
    v4.uv[1] = 1

    var vs = [v1,v2,v3,v4]

    var is = [0,1,2,2,3,0]

    let mesh = new Mesh(vs,is)
    return mesh
}



