class Vertex
{
    constructor(x,y,z) {
        this.position = vec3.create()
        this.position[0] = x
        this.position[1] = y
        this.position[2] = z

        this.color = vec3.create()
        this.color[0] = 1.0
        this.color[1] = 1.0
        this.color[2] = 1.0

        this.uv = vec2.create()
        this.uv[0] = 0.0
        this.uv[1] = 0.0

        this.normal = vec3.create()
        this.normal[0] = 1.0
        this.normal[1] = 1.0
        this.normal[2] = 1.0

        this.tangent = vec3.create()
        this.tangent[0] = 1.0
        this.tangent[1] = 1.0
        this.tangent[2] = 1.0

        this.bitangent = vec3.create()
        this.bitangent[0] = 1.0
        this.bitangent[1] = 1.0
        this.bitangent[2] = 1.0
    }

    unpack() {
        return [this.position[0], this.position[1], this.position[2], 
                this.color[0], this.color[1], this.color[2], 
                this.uv[0], this.uv[1],
                this.normal[0], this.normal[1], this.normal[2],
                this.tangent[0], this.tangent[1], this.tangent[2],
                this.bitangent[0], this.bitangent[1], this.bitangent[2],
            ];
    }
}

class Mesh
{
    //Array of Vertex, arrays of ints
    constructor(vertices, indices) {
        this.vertices = vertices
        this.indices = indices

        this.verticesArray = vertices[0].unpack()
        for(var i=1; i< vertices.length; i++)
        {
            this.verticesArray = this.verticesArray.concat(vertices[i].unpack())
        }

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        this.vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesArray), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    }

    bind()
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);

    }


    render() {

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

    }
}