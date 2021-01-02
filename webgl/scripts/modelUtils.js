function getQuadMesh() {

    let v1 = new Vertex(-0.5,-0.5,0.0)
    v1.normal[0] = 0
    v1.normal[1] = 0
    v1.normal[2] = 1

    v1.tangent[0] = 1
    v1.tangent[1] = 0
    v1.tangent[2] = 0

    v1.bitangent[0] = 0
    v1.bitangent[1] = 1
    v1.bitangent[2] = 0

    v1.uv[0] = 0
    v1.uv[1] = 0

    let v2 = new Vertex(0.5,-0.5,0.0)
    v2.normal[0] = 0
    v2.normal[1] = 0
    v2.normal[2] = 1
    v2.tangent[0] = 1
    v2.tangent[1] = 0
    v2.tangent[2] = 0

    v2.bitangent[0] = 0
    v2.bitangent[1] = 1
    v2.bitangent[2] = 0
    v2.uv[0] = 1
    v2.uv[1] = 0

    let v3 = new Vertex(0.5,0.5,0.0)
    v3.normal[0] = 0
    v3.normal[1] = 0
    v3.normal[2] = 1
    v3.tangent[0] = 1
    v3.tangent[1] = 0
    v3.tangent[2] = 0

    v3.bitangent[0] = 0
    v3.bitangent[1] = 1
    v3.bitangent[2] = 0
    v3.uv[0] = 1
    v3.uv[1] = 1

    let v4 = new Vertex(-0.5,0.5,0.0)
    v4.normal[0] = 0
    v4.normal[1] = 0
    v4.normal[2] = 1
    v4.uv[0] = 0
    v4.uv[1] = 1
    v4.tangent[0] = 1
    v4.tangent[1] = 0
    v4.tangent[2] = 0

    v4.bitangent[0] = 0
    v4.bitangent[1] = 1
    v4.bitangent[2] = 0

    var vs = [v1,v2,v3,v4]

    var is = [0,1,2,2,3,0]

    let mesh = new Mesh(vs,is)
    return mesh
}



async function loadOBJ(pathToFile)
{

    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh(null, './', pathToFile, scene, (meshes) => {
            
            var allMeshes = []
            for(var meshCounter = 0; meshCounter < meshes.length; meshCounter++)
            {
                var positions = meshes[meshCounter].getVerticesData(BABYLON.VertexBuffer.PositionKind);
                var normals = meshes[meshCounter].getVerticesData(BABYLON.VertexBuffer.NormalKind);
                var uvs = meshes[meshCounter].getVerticesData(BABYLON.VertexBuffer.UVKind);
                var indices = meshes[meshCounter].getIndices();
              
                var verts = []
                for(var v = 0; v < positions.length; v+=3)
                {
                    let vert = new Vertex(positions[v], positions[v+1], positions[v+2])
                    vert.normal = [normals[v], normals[v+1], normals[v+2]]
                    verts.push(vert)
                }
              
                var counter = 0;
                for(u = 0; u <  uvs.length; u+=2)
                {
                  verts[counter].uv = [uvs[u], uvs[u+1]] 
                  counter++
                }


                for(var v = 0; v < indices.length; v+=3)
                {
                    //Calculate tangent and bitangent
                    var edge1  = vec3.create()
                    edge1 [0] = verts[indices[v+1]].position[0] - verts[indices[v]].position[0]
                    edge1 [1] = verts[indices[v+1]].position[1] - verts[indices[v]].position[1]
                    edge1 [2] = verts[indices[v+1]].position[2] - verts[indices[v]].position[2]

                    var edge2  = vec3.create()
                    edge2 [0] = verts[indices[v+2]].position[0] - verts[indices[v]].position[0]
                    edge2 [1] = verts[indices[v+2]].position[1] - verts[indices[v]].position[1]
                    edge2 [2] = verts[indices[v+2]].position[2] - verts[indices[v]].position[2]

                    var deltaUV1  = vec2.create()
                    deltaUV1[0] = verts[indices[v+1]].uv[0] - verts[indices[v]].uv[0]
                    deltaUV1[1] = verts[indices[v+1]].uv[1] - verts[indices[v]].uv[1]

                    var deltaUV2  = vec2.create()
                    deltaUV2[0] = verts[indices[v+2]].uv[0] - verts[indices[v]].uv[0]
                    deltaUV2[1] = verts[indices[v+2]].uv[1] - verts[indices[v]].uv[1]

                    var f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

                    for(var counter = 0; counter < 3; counter++)
                        {
                            verts[indices[v + counter]].tangent[0] = f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
                            verts[indices[v + counter]].tangent[1] = f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
                            verts[indices[v + counter]].tangent[2] = f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);

                            verts[indices[v + counter]].bitangent[0] = f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]);
                            verts[indices[v + counter]].bitangent[1] = f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]);
                            verts[indices[v + counter]].bitangent[2] = f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2]);
                        }

            
                }


                 
              
                if(verts.length > 0)
                {
                    let mesh = new Mesh(verts,indices)
                    allMeshes.push(mesh)
                }
                
            }
  
            
          
            resolve(allMeshes)          
          });
      });
    
}













