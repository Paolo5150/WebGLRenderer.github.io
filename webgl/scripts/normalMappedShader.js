function getNormalMappedShaderVertex() {

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

    out vec3 fFragPosTBN;
    out vec3 fCamPosTBN;
    out vec3 fLightDirTBN;

    out vec3 fDirLight;
    out vec3 fCamPos;
    out vec3 fFragPos;
    out vec4 fFragPosLightSpace;

    uniform vec3 lightDirection;
    uniform vec3 camPos;

    uniform mat4 model;
    uniform mat4 view;
    uniform mat4 perspective;
    uniform mat4 lightSpace;

    void main() 
    { 

        vec3 T = normalize(vec3(model * vec4(tangent,   0.0)));
        vec3 N = normalize(vec3(model * vec4(normal,    0.0)));
        T = normalize(T - dot(T, N) * N);
        vec3 B = bitangent;
        B = cross(N, T);
        mat3 TBN = transpose(mat3(T, B, N));

        vec4 fragPos = model * vec4(position, 1.0);

        fColor = color;
        fUv = vec2(uv.x, 1.0 - uv.y);
        fNormal = normalize((model * vec4(normal, 0.0)).xyz);
        fFragPosLightSpace = lightSpace * fragPos;
        gl_Position = perspective * view * fragPos;

        fDirLight = normalize(lightDirection);
        fCamPos = camPos;
        fFragPos = fragPos.xyz;

        fFragPosTBN = TBN * fragPos.xyz;
        fCamPosTBN = TBN * camPos;
        fLightDirTBN = TBN * fDirLight;

    }
    `
}

function getNormalMappedShaderFragment() {

    return `#version 300 es
    precision highp float;

    in vec3 fColor;
    in vec3 fNormal;
    in vec2 fUv;

    in vec3 fDirLight;
    in vec3 fCamPos;
    in vec3 fFragPos;
    in vec4 fFragPosLightSpace;

    in vec3 fFragPosTBN;
    in vec3 fCamPosTBN;
    in vec3 fLightDirTBN;

    uniform vec3 lightDiffuseColor;
    uniform vec3 lightSpecularColor;
    uniform sampler2D uSampler_1;
    uniform sampler2D shadowMap;
    uniform sampler2D normalMap;
    out vec4 myOutputColor;

    float CalculateShadow()
    {
        vec3 projectedCoordinates = fFragPosLightSpace.xyz / fFragPosLightSpace.w;
        projectedCoordinates = projectedCoordinates * 0.5 + 0.5;
        float pixelFromLight = texture(shadowMap, projectedCoordinates.xy).r;
        float currentDepth = projectedCoordinates.z;
    
        float bias = 0.001;   
        float shadow = 0.0;
        float texelSize = 1.0 / 2048.0;
        for(int x = -1; x <= 1; ++x)
        {
            for(int y = -1; y <= 1; ++y)
            {
                float pcfDepth = texture(shadowMap, projectedCoordinates.xy + vec2(x, y) * texelSize).r; 
                shadow += currentDepth - bias > pcfDepth ? 0.7 : 0.0;        
            }    
        }
        shadow /= 9.0;

        return shadow;        
    }

    void main() 
    {

        vec3 nMap = normalize(texture(normalMap, fUv).rgb * 2.0 - 1.0);


        float dirLightFactor = max(0.1,dot(nMap, -normalize(fLightDirTBN)));
        vec3 dLight = lightDiffuseColor * dirLightFactor;


        vec3 viewDir = normalize(fCamPosTBN - fFragPosTBN);
        vec3 reflectDir = reflect(normalize(fLightDirTBN), nMap);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 128.0);
        vec3 specular = spec * lightSpecularColor;

        vec3 text = texture(uSampler_1, fUv).rgb;

        float shadow = 1.0 - CalculateShadow();

        vec3 finalColor = shadow * text * (dLight + specular);

        myOutputColor = vec4(finalColor,1);
    }
    
    `
}