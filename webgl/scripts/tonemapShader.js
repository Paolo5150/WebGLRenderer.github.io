function getTonemapVertex() {

    return `#version 300 es

    in vec3 position;
    in vec3 color;
    in vec2 uv;
    in vec3 normal;
    in vec3 tangent;
    in vec3 bitangent;

    out vec3 fColor;
    out vec3 fNormal;
    out vec2 fUv;    
    out vec3 fTangent;
    out vec3 fBitangent;

    void main() 
    { 
        gl_Position = vec4(position.xy * 2.0, 0.0,  1.0);
        fColor = color;
        fUv = uv;
        fNormal = normal;
        fTangent = tangent;
        fBitangent = bitangent;
    }
    `
}

function getTonemapFragment() {

    return `#version 300 es
    precision highp float;

    in vec3 fColor;
    in vec3 fNormal;
    in vec2 fUv;

    uniform float gamma;
    uniform float exposure;
    uniform sampler2D uSampler_1;

    out vec4 FragColor;

    void main() 
    {
        vec3 hdrColor = texture(uSampler_1, fUv).rgb;
  
        // exposure tone mapping
        vec3 mapped = vec3(1.0) - exp(-hdrColor * exposure);
        
        // gamma correction 
        mapped = pow(mapped, vec3(1.0 / gamma));

        FragColor = vec4(mapped, 1.0);
    }
    
    `
}