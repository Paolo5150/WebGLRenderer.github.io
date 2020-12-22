function getTonemapVertex() {

    return `

    attribute vec3 position;
    attribute vec3 color;
    attribute vec2 uv;
    attribute vec3 normal;

    varying lowp vec3 fColor;
    varying highp vec3 fNormal;
    varying highp  vec2 fUv;
    

    void main(void) 
    { 
        gl_Position = vec4(position.xy * 2.0, 0.0,  1.0);
        fColor = color;
        fUv = uv;
        fNormal = normal;
    }
    `
}

function getTonemapFragment() {

    return `
    #extension GL_EXT_draw_buffers : require

    precision highp float;

    varying lowp vec3 fColor;
    varying highp vec3 fNormal;
    varying highp  vec2 fUv;

    uniform sampler2D uSampler_1;


    void main(void) 
    {
        gl_FragData[0] = texture2D(uSampler_1, fUv);
    }
    
    `
}