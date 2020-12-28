function getTextureOnlyShaderVertex() {

    return `#version 300 es

    in vec3 position;
    in vec3 color;
    in vec2 uv;
    in vec3 normal;
    in vec3 tangent;
    in vec3 bitangent;

    out vec2 fUv;
    out vec3 fColor;
    out vec3 fNormal;
    out vec3 fTangent;
    out vec3 fBitangent;

    uniform mat4 model;
    uniform mat4 view;
    uniform mat4 perspective;

    void main() 
    { 
        vec4 fragPos = model * vec4(position, 1.0);
        gl_Position = fragPos;

        fUv = uv;

        fColor = color;
        fNormal = normal;
        fTangent = tangent;
        fBitangent = bitangent;


    }
    `
}

function getTextureOnlyShaderFragment() {

    return `#version 300 es
    precision highp float;

    in vec2 fUv;

    uniform sampler2D uSampler_1;
    out vec4 myOutputColor;

    void main() 
    {
        float depthValue = texture(uSampler_1, fUv).r;

        float n = 0.1;
        float f = 10.0;
        float z = depthValue;
        float grey = (2.0 * n) / (f + n - z*(f-n));
        myOutputColor= vec4(depthValue, depthValue, depthValue, 1.0);

    }
    
    `
}