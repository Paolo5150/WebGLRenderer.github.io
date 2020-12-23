function getTonemapVertex() {

    return `#version 300 es

    in vec3 position;
    in vec3 color;
    in vec2 uv;
    in vec3 normal;

    out vec3 fColor;
    out vec3 fNormal;
    out vec2 fUv;    

    void main() 
    { 
        gl_Position = vec4(position.xy * 2.0, 0.0,  1.0);
        fColor = color;
        fUv = uv;
        fNormal = normal;
    }
    `
}

function getTonemapFragment() {

    return `#version 300 es
    precision highp float;

    in vec3 fColor;
    in vec3 fNormal;
    in vec2 fUv;

    uniform sampler2D uSampler_1;

    out vec4 FragColor;

    void main() 
    {
        FragColor = texture(uSampler_1, fUv);
    }
    
    `
}