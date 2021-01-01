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

    out vec3 fTangent;
    out vec3 fBitangent;

    out mat3 mModel;

    uniform vec3 pointLightPos;
    uniform vec3 lightDirection;
    uniform vec3 camPos;

    uniform mat4 model;
    uniform mat4 view;
    uniform mat4 perspective;
    uniform mat4 lightSpace;

    void main() 
    { 

        mat3 normalMatrix = transpose(inverse(mat3(model)));
        mModel = mat3(model);

        vec3 T = normalize(normalMatrix * tangent);
        vec3 B = normalize(normalMatrix * bitangent);
        vec3 N = normalize(normalMatrix * normal);
        T = normalize(T - dot(T, N) * N);
        B = cross(N, T);
        
        mat3 TBN = transpose(mat3(T, B, N));

        vec4 fragPos = model * vec4(position, 1.0);

        fColor = color;
        fUv = vec2(uv.x, 1.0 - uv.y);
        fNormal =normalMatrix * normal;
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

        fTangent = tangent;
        fBitangent = bitangent;

        vec3 pLightDir = (fragPos - vec4(pointLightPos,1.0)).xyz;
        fPointLightDirTBN = normalize(TBN * pLightDir);

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

    in vec3 fTangent;
    in vec3 fBitangent;

    in mat3 mModel;


    uniform vec3 lightDiffuseColor;
    uniform vec3 lightSpecularColor;
    uniform float dirLightIntensity;

    uniform vec3 pointLightDiffuseColor;
    uniform vec3 pointLightSpecularColor;
    uniform float pointLightIntensity;

    uniform float metallicModifier;
    uniform float roughnessModifier;


    uniform sampler2D  albedoMap;
    uniform sampler2D metallicMap;
    uniform sampler2D normalMap;
    uniform sampler2D roughnessMap;
    uniform sampler2D aoMap;
    uniform sampler2D shadowMap;
    uniform sampler2D heightMap;
    uniform samplerCube pShadowMap;
    
    uniform samplerCube irradianceMap;
    uniform samplerCube prefilteredMap;
    uniform sampler2D  bdrf;


    out vec4 myOutputColor;

    //Functions definitions
    const float MAX_REFLECTION_LOD = 4.0;
    const float Epsilon = 0.00001;
    float PI = 3.14159265359;
    float DistributionGGX(vec3 N, vec3 H, float roughness);
    float ndfGGX(float cosLh, float roughness);

    float GeometrySchlickGGX(float NdotV, float roughness);
    float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness);
    vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness);
    float gaSchlickG1(float cosTheta, float k);

    float gaSchlickGGX(float cosLi, float cosLo, float roughness);

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

    float PLCalculateShadow()
    {
       
        vec3 fragToLight = fFragPos - fLightPosition;
        float currentDepth = length(fragToLight);
        float bias = 0.001; 

        float shadow = 0.0;
        float texelSize = 1.0 / 1024.0;
        for(int x = -1; x <= 1; ++x)
        {
            for(int y = -1; y <= 1; ++y)
            {
                float pcfDepth = texture(pShadowMap, normalize(fragToLight)).r;
                pcfDepth *= 50.0;

                shadow += currentDepth -  bias > pcfDepth ? pointLightIntensity / 2.5 : 0.0;        
            }    
        }
        shadow /= 9.0;    
        return shadow;       
    }


    void main() 
    {
        vec2 texCoords = fUv;

        vec3 albedo     = pow(texture(albedoMap, texCoords).rgb, vec3(2.2));
        float metallic  =  texture(metallicMap, texCoords).r + metallicModifier;
        float roughness     =  texture(roughnessMap, texCoords).r;
        float ao        =  texture(aoMap, texCoords).r;

        roughness += roughnessModifier;
        vec3 V = normalize(fCamPosTBN - fFragPosTBN);
        vec3 L = normalize(-fLightDirTBN);
        vec3 N = normalize(texture(normalMap, texCoords).rgb * 2.0 - 1.0);
        
        vec3 F0 = vec3(0.04); 
        F0 = mix(F0, albedo, metallic);
        vec3 Lo = vec3(0.0);

        Lo += DoPBRStuff(V, L, lightDiffuseColor, dirLightIntensity, N, F0, metallic, albedo, roughness);

        vec3 lightToFrag = fFragPosTBN - fLightPositionTBN;
        float distance = length(lightToFrag);
        float attenuation = pointLightIntensity / (1.0+ 0.09 * distance + 0.032 * (distance * distance));

        Lo += DoPBRStuff(V, -normalize(lightToFrag), pointLightDiffuseColor, attenuation, N, F0, metallic, albedo, roughness);


        //Ambient

        vec3 irradiance = texture(irradianceMap, N).rgb;
        vec3 diffuse    = irradiance * albedo;

        vec3 camToFrag = normalize(fFragPos - fCamPos);
        
        vec3 R = reflect(camToFrag, normalize(fNormal));   

        vec3 prefilteredColor = textureLod(prefilteredMap, normalize(R),  roughness * MAX_REFLECTION_LOD).rgb;
        vec3 F        = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness);
        vec3 kS = F;
        vec3 kD = 1.0 - kS;
        kD *= 1.0 - metallic;
        vec2 brdfC  = texture(bdrf, vec2(max(dot(N, V), 0.0), roughness)).rg;
        vec3 specular = prefilteredColor * (F * brdfC.x + brdfC.y);

        vec3 ambient    = (kD * diffuse + specular) * ao;

        vec3 col = ambient + Lo;
        col = col / (col + vec3(1.0));
        col = pow(col, vec3(1.0/2.2));


        float shadow = 1.0 - CalculateShadow();
        float shadowPL = 1.0 - PLCalculateShadow();

        vec3 finalColor =  shadow * shadowPL * col;

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

    vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness)
    {
        return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
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

    float ndfGGX(float cosLh, float roughness)
    {
        float alpha   = roughness * roughness;
        float alphaSq = alpha * alpha;

        float denom = (cosLh * cosLh) * (alphaSq - 1.0) + 1.0;
        return alphaSq / (PI * denom * denom);
    }

    // Single term for separable Schlick-GGX below.
    float gaSchlickG1(float cosTheta, float k)
    {
        return cosTheta / (cosTheta * (1.0 - k) + k);
    }

    // Schlick-GGX approximation of geometric attenuation function using Smith's method.
    float gaSchlickGGX(float cosLi, float cosLo, float roughness)
    {
        float r = roughness + 1.0;
        float k = (r * r) / 8.0; // Epic suggests using this roughness remapping for analytic lights.
        return gaSchlickG1(cosLi, k) * gaSchlickG1(cosLo, k);
    }

    vec3 DoPBRStuff(vec3 V, vec3 L, vec3 diffuse, float intensity, vec3 N, vec3 F0, float metallic, vec3 albedo, float roughness)
    {
        vec3 res = vec3(0.0);
        float cosLo = max(0.0, dot(N, V));

        vec3 Lradiance = diffuse * intensity;
        vec3 Lh = normalize(V + L);

        float cosLi = max(0.0, dot(N, V));
        float cosLh = max(0.0, dot(N, Lh));
        
        vec3 F  = fresnelSchlick( max(0.0, dot(Lh, V)), F0);
        float D = ndfGGX(cosLh, roughness);
        float G = gaSchlickGGX(cosLi, cosLo, roughness);
        vec3 kd = mix(vec3(1.0) - F, vec3(0.0), metallic);
        vec3 diffuseBRDF = kd * albedo;
        vec3 specularBRDF = (F * D * G) / max(Epsilon, 4.0 * cosLi * cosLo);
        res += (diffuseBRDF + specularBRDF) * Lradiance * cosLi;
        return res;
    }


    
    `
}