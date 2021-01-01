function getEquirectVertex()
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
        gl_Position =  perspective * view * vec4(position, 1.0);

        fColor = color;
        fUv = uv;
        fNormal = normal;
        fTangent = tangent;
        fBitangent = bitangent;
        
    }
    `
}

function getEquirectFragment()
{
    return `#version 300 es

    precision highp float;

    in vec3 fLocalPos;
    
    uniform sampler2D equirectangularMap;    
    const vec2 invAtan = vec2(0.1591, 0.3183);

    out vec4 FragColor;

    vec2 SampleSphericalMap(vec3 v)
    {
        vec2 uv = vec2(atan(v.z, v.x), asin(v.y));
        uv *= invAtan;
        uv += 0.5;
        return uv;
    }

    void main()
    {		
        vec2 uv = SampleSphericalMap(normalize(fLocalPos )); 
        vec3 color = texture(equirectangularMap, vec2(uv.x, 1.0 - uv.y)).rgb;
        
        FragColor = vec4(color, 1.0);
    }
    `
}