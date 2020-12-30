function getPBRShaderVertex() {

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
    out vec3 fPointLightDirTBN;

    out vec3 fDirLight;
    out vec3 fCamPos;
    out vec3 fFragPos;
    out vec4 fFragPosLightSpace;
    out vec3 fLightPositionTBN;
    out vec3 fLightPosition;

    uniform vec3 pointLightPos;
    uniform vec3 lightDirection;
    uniform vec3 camPos;

    uniform mat4 model;
    uniform mat4 view;
    uniform mat4 perspective;
    uniform mat4 lightSpace;

    void main() 
    { 

        vec3 T = normalize(vec3(model * vec4(tangent,   0.0)));
        vec3 B = normalize(vec3(model * vec4(bitangent, 0.0)));
        vec3 N = normalize(vec3(model * vec4(normal,    0.0)));
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
        fLightPositionTBN = TBN * pointLightPos;
        fLightPosition = pointLightPos;
        fPointLightDirTBN = normalize(TBN * (fragPos.xyz - pointLightPos));

    }
    `
}

function getPBRShaderFragment() {

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

    in vec3 fLightPositionTBN;
    in vec3 fLightPosition;
    in vec3 fPointLightDirTBN;

    uniform vec3 lightDiffuseColor;
    uniform vec3 lightSpecularColor;
    uniform float dirLightIntensity;

    uniform vec3 pointLightDiffuseColor;
    uniform vec3 pointLightSpecularColor;
    uniform float pointLightIntensity;

    uniform sampler2D  albedoMap;
    uniform sampler2D metallicMap;
    uniform sampler2D normalMap;
    uniform sampler2D roughnessMap;
    uniform sampler2D aoMap;
    uniform sampler2D shadowMap;
    uniform sampler2D heightMap;


    out vec4 myOutputColor;

    //Functions definitions
    float PI = 3.14159265359;
    float DistributionGGX(vec3 N, vec3 H, float roughness);
    float GeometrySchlickGGX(float NdotV, float roughness);
    float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness);
    vec3 fresnelSchlick(float cosTheta, vec3 F0);
    vec3 DoPBRStuff(vec3 V, vec3 L, vec3 diffuse, float intensity, vec3 N, vec3 F0, float metallic, vec3 albedo, float roughness);
    vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir);

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
                shadow += currentDepth - bias > pcfDepth ? dirLightIntensity / 1.2 : 0.0;         
            }    
        }
        shadow /= 9.0;

        return shadow;        
    }


    void main() 
    {

        vec3 V = normalize(fCamPosTBN - fFragPosTBN);
        vec2 texCoords = ParallaxMapping(fUv, V);

        vec3 albedo     = pow(texture(albedoMap, texCoords).rgb, vec3(2.2));
        float metallic  =  texture(metallicMap, texCoords).r;
        float roughness     =  texture(roughnessMap, texCoords).r;
        float ao        =  texture(aoMap, texCoords).r;

        vec3 N = normalize(texture(normalMap, texCoords).rgb * 2.0 - 1.0);

        vec3 F0 = vec3(0.04); 
        F0 = mix(F0, albedo, metallic);
        vec3 L = normalize(-fLightDirTBN);
        vec3 Lo = vec3(0.0);

        Lo += DoPBRStuff(V, L, lightDiffuseColor, dirLightIntensity, N, F0, metallic, albedo, roughness);

        vec3 lightToFrag = fFragPos - fLightPosition;
        float distance = length(lightToFrag);
        float attenuation = pointLightIntensity / (1.0+ 0.09 * distance + 0.032 * (distance * distance));
        attenuation = pointLightIntensity / (distance * distance);

        Lo += DoPBRStuff(V, -fPointLightDirTBN, pointLightDiffuseColor, attenuation, N, F0, metallic, albedo, roughness);


        vec3 ambient = vec3(0.03) * albedo * ao;
        vec3 col = ambient + Lo;

        col = col / (col + vec3(1.0));
        col = pow(col, vec3(1.0/2.2));

        float shadow = 1.0 - CalculateShadow();

        vec3 finalColor = shadow * col;

        myOutputColor = vec4(finalColor,1);
    }

    vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir)
    { 
        float height =  texture(heightMap, texCoords).r;    
        vec2 p = viewDir.xy / viewDir.z * (height * 0.0);
        return texCoords - p;    
    }

    float DistributionGGX(vec3 N, vec3 H, float roughness)
    {
        float a      = roughness*roughness;
        float a2     = a*a;
        float NdotH  = max(dot(N, H), 0.0);
        float NdotH2 = NdotH*NdotH;
        
        float num   = a2;
        float denom = (NdotH2 * (a2 - 1.0) + 1.0);
        denom = PI * denom * denom;
        
        return num / denom;
    }

    vec3 fresnelSchlick(float cosTheta, vec3 F0)
    {
        return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
    }

    float GeometrySchlickGGX(float NdotV, float roughness)
    {
        float r = (roughness + 1.0);
        float k = (r*r) / 8.0;

        float num   = NdotV;
        float denom = NdotV * (1.0 - k) + k;
        
        return num / denom;
    }
    float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
    {
        float NdotV = max(dot(N, V), 0.0);
        float NdotL = max(dot(N, L), 0.0);
        float ggx2  = GeometrySchlickGGX(NdotV, roughness);
        float ggx1  = GeometrySchlickGGX(NdotL, roughness);
        
        return ggx1 * ggx2;
    }

    vec3 DoPBRStuff(vec3 V, vec3 L, vec3 diffuse, float intensity, vec3 N, vec3 F0, float metallic, vec3 albedo, float roughness)
    {
        vec3 res = vec3(0.0);

        vec3 H = normalize(V + L);
        vec3 radiance = diffuse * intensity;
        
        float NDF = DistributionGGX(N, H, roughness);
		float G   = GeometrySmith(N, V, L, roughness);      
        vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);

        vec3 kS = F;
        vec3 kD = vec3(1.0) - kS;
        kD *= 1.0 - metallic;
		
		vec3 numerator    = NDF * G * F;
        float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);
        vec3 specular     = numerator / max(denominator, 0.001);
		
		float NdotL = max(dot(N, L), 0.0);                
        res = (kD * albedo / PI + specular) * radiance * NdotL;

        return res;
    }


    
    `
}