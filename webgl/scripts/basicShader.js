function getBasicVertex() {

    return `#version 300 es

    in vec3 position;
    in vec3 color;
    in vec2 uv;
    in vec3 normal;

    out vec3 fColor;
    out vec3 fNormal;
    out vec2 fUv;

    out vec3 fDirLight;
    out vec3 fCamPos;
    out vec3 fFragPos;

    uniform vec3 dirLight;
    uniform vec3 camPos;

    uniform mat4 model;
    uniform mat4 perspective;

    void main() 
    { 
        vec4 fragPos = model * vec4(position, 1.0);
        gl_Position = perspective * fragPos;

        fColor = color;
        fUv = vec2(uv.x, 1.0 - uv.y);
        fNormal = normalize((model * vec4(normal, 0.0)).xyz);

        fDirLight = normalize(dirLight);
        fCamPos = camPos;
        fFragPos = fragPos.xyz;
    }
    `
}

function getBasicFragment() {

    return `#version 300 es
    precision highp float;

    in vec3 fColor;
    in vec3 fNormal;
    in vec2 fUv;

    in vec3 fDirLight;
    in vec3 fCamPos;
    in vec3 fFragPos;

    uniform sampler2D uSampler_1;
    out vec4 myOutputColor;

    void main() 
    {
        float dirLightFactor = max(0.0,dot(normalize(fNormal), -fDirLight));
        vec3 dLight = vec3(1,1,1) * dirLightFactor;


        vec3 viewDir = normalize(fCamPos - fFragPos);
        vec3 reflectDir = reflect(fDirLight, fNormal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 6.0);
        vec3 specular = spec * vec3(1,1,1);

        vec3 text = texture(uSampler_1, fUv).rgb;

        vec3 finalColor = text * (dLight + specular);
        myOutputColor = vec4(finalColor,1);
    }
    
    `
}