class Texture
{

    constructor() {
        
        this.textID = gl.createTexture();          

    }

    static FromURL(url) {
        let t = new Texture()

        const image = new Image();
        image.crossOrigin = "anonymous"
        image.src = url;

        image.onload = function() {

          gl.bindTexture(gl.TEXTURE_2D, t.textID);

          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      
          // WebGL1 has different requirements for power of 2 images
          // vs non power of 2 images so check if the image is a
          // power of 2 in both dimensions.
          if ( (image.width & (image.width - 1)) == 0 && (image.height & (image.height - 1)) == 0) {
             // Yes, it's a power of 2. Generate mips.
             gl.generateMipmap(gl.TEXTURE_2D);
          } else {
             // No, it's not a power of 2. Turn off mips and set
             // wrapping to clamp to edge
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          }

        gl.bindTexture(gl.TEXTURE_2D, null);

        };

        return t
    }

    static CreateDepth(widh, height) {
        let t = new Texture()

        gl.bindTexture(gl.TEXTURE_2D, t.textID);
        
        // define size and format of level 0
        const level = 0;
        const internalFormat = gl.DEPTH_COMPONENT16;
        const border = 0;
        const format = gl.DEPTH_COMPONENT16;
        const type = gl.UNSIGNED_INT
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, widh, height, border, gl.DEPTH_COMPONENT, type, data);
        
        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return t
    }

    static CreateEmpty(widh, height) {
        let t = new Texture()

        gl.bindTexture(gl.TEXTURE_2D, t.textID);
        
        // define size and format of level 0
        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, widh, height, border, format, type, data);
        
        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return t
    }

    static CreateEmptyFloatFormat(widh, height) {
        let t = new Texture()

        gl.bindTexture(gl.TEXTURE_2D, t.textID);
        
        // define size and format of level 0
        const level = 0;
        const internalFormat = gl.RGBA16F;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.FLOAT
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, widh, height, border, format, type, data);
        
        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return t
    }

    bind() {

        gl.bindTexture(gl.TEXTURE_2D, this.textID);

    }
}