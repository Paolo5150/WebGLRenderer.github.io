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
    out vec3 fFragPos;

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
        fFragPos = fragPos.xyz;


    }
    `
}

function getTextureOnlyShaderFragment() {

    return `#version 300 es
    precision highp float;

    in vec2 fUv;
    in vec3 fNormal;

    uniform sampler2D image;
    uniform float isDepth;
    out vec4 myOutputColor;

    void main() 
    {

        vec3 c;
        if(isDepth == 1.0)
        {
            c = texture(image, fUv).rrr;
        }
        else
        {
            c = texture(image, vec2(fUv.x, 1.0 - fUv.y)).rgb;
        }

        myOutputColor= vec4(c, 1.0);
    }
    
    `
}

function getTextureOnlyCubicShaderFragment() {

    return `#version 300 es
    precision highp float;

    in vec2 fUv;

    uniform samplerCube image;
    uniform float isDepth;
    uniform vec3 a;
    out vec4 myOutputColor;

    void main() 
    {

        vec3 c;
        if(isDepth == 1.0)
        {

            c = texture(image, fUv).rrr;
        }
        else
        {
            c = texture(image, fUv).rgb;
        }

        myOutputColor= vec4(c, 1.0);
    }
    
    `
}