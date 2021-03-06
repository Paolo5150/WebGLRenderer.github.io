function getSkyboxVertex()
{
    return `#version 300 es

    in vec3 position;
    in vec3 color;
    in vec2 uv;
    in vec3 normal;
    in vec3 tangent;
    in vec3 bitangent;

    out vec3 fLocalPos;
    out vec3 fColor;
    out vec2 fUv;
    out vec3 fNormal;
    out vec3 fTangent;
    out vec3 fBitangent;

    uniform mat4 perspective;
    uniform mat4 view;

    void main()
    {
        fLocalPos = position;  

        mat4 noTrans = mat4(mat3(view));

        vec4 pos =  perspective * noTrans * vec4(position, 1.0);
        gl_Position = pos.xyww;
        fColor = color;
        fUv = uv;
        fNormal = normal;
        fTangent = tangent;
        fBitangent = bitangent;
        
    }
    `
}

function getSkyboxFragment()
{
    return `#version 300 es

    precision highp float;

    in vec3 fLocalPos;
    
    uniform samplerCube cubeMap;    

    out vec4 FragColor;  

    void main()
    {		
        vec3 color = textureLod(cubeMap, normalize(fLocalPos),0.0).rgb;
        color = color / (color + vec3(1.0));
        color = pow(color, vec3(1.0/2.0));
        FragColor = vec4(color, 1.0);
    }
    `
}