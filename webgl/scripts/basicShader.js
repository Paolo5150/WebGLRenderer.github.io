function getBasicVertex() {

    return `

    attribute vec3 position;
    attribute vec3 color;
    attribute vec2 uv;
    attribute vec3 normal;

    varying lowp vec3 fColor;
    varying highp vec3 fNormal;
    varying highp  vec2 fUv;

    varying highp vec3 fDirLight;
    varying highp vec3 fCamPos;
    varying highp vec3 fFragPos;

    uniform vec3 dirLight;
    uniform vec3 camPos;

    uniform mat4 model;
    uniform mat4 perspective;

    void main(void) 
    { 
        highp vec4 fragPos = model * vec4(position, 1.0);
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

    return `
    varying lowp vec3 fColor;
    varying highp  vec2 fUv;
    varying highp vec3 fNormal;

    varying highp vec3 fDirLight;
    varying highp vec3 fCamPos;
    varying highp vec3 fFragPos;


    uniform sampler2D uSampler_1;

    void main(void) 
    {
        highp float dirLightFactor = max(0.0,dot(normalize(fNormal), -fDirLight));
        highp vec3 dLight = vec3(1,1,1) * dirLightFactor;


        highp vec3 viewDir = normalize(fCamPos - fFragPos);
        highp vec3 reflectDir = reflect(fDirLight, fNormal);
        highp float spec = pow(max(dot(viewDir, reflectDir), 0.0), 6.0);
        highp vec3 specular = spec * vec3(1,1,1);

        highp vec3 text = texture2D(uSampler_1, fUv).rgb;

        highp vec3 finalColor = text * (dLight + specular);
        gl_FragColor = vec4(finalColor,1);
    }
    
    `
}