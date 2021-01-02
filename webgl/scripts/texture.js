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
      
      
          if ( (image.width & (image.width - 1)) == 0 && (image.height & (image.height - 1)) == 0) {
             gl.generateMipmap(gl.TEXTURE_2D);
          } else {
    
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          }

        gl.bindTexture(gl.TEXTURE_2D, null);

        };

        return t
    }

    static FromURLfloat(url) {
        let t = new Texture()

        const image = new Image();
        image.crossOrigin = "anonymous"
        image.src = url;

        image.onload = function() {

          gl.bindTexture(gl.TEXTURE_2D, t.textID);

          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB16F, gl.RGB, gl.FLOAT, image);
      
      
          if ( (image.width & (image.width - 1)) == 0 && (image.height & (image.height - 1)) == 0) {
             gl.generateMipmap(gl.TEXTURE_2D);
          } else {
    
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          }

        gl.bindTexture(gl.TEXTURE_2D, null);

        };

        return t
    }


    static FromURLhdr(url) {
        let t = new Texture()

        const image = new Image();
        image.crossOrigin = "anonymous"
        image.src = url;

        image.onload = function() {

          gl.bindTexture(gl.TEXTURE_2D, t.textID);

          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB16F, gl.RGB16F, gl.FLOAT, image);
      
      
          if ( (image.width & (image.width - 1)) == 0 && (image.height & (image.height - 1)) == 0) {
             gl.generateMipmap(gl.TEXTURE_2D);
          } else {
    
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          }

        gl.bindTexture(gl.TEXTURE_2D, null);

        };

        return t
    }

    static Unbind() {
        gl.activeTexture(gl.TEXTURE0 );

        gl.bindTexture(gl.TEXTURE_2D, null);

    }
    static CreateDepthFloat(widh, height) {
        let t = new Texture()

        gl.bindTexture(gl.TEXTURE_2D, t.textID);
        
        // define size and format of level 0
        const level = 0;
        const internalFormat = gl.DEPTH_COMPONENT32F;
        const border = 0;
        const type = gl.FLOAT
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, widh, height, border, gl.DEPTH_COMPONENT, type, data);
        
        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return t
    }

    static CreateDepth(widh, height) {
        let t = new Texture()

        gl.bindTexture(gl.TEXTURE_2D, t.textID);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, widh, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        
        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return t
    }

    static CreateEmptyFloatRGFormat(widh, height) {
        let t = new Texture()

        gl.bindTexture(gl.TEXTURE_2D, t.textID);
        
        // define size and format of level 0
        const level = 0;
        const internalFormat = gl.RG16F;
        const border = 0;
        const format = gl.RG;
        const type = gl.FLOAT
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, widh, height, border, format, type, data);
        
        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return t
    }

    //onLoad, callback with the texture obj
    static FromURLhdr(url, onLoad) {

        $.ajax({
            url: "https://pf-portfolio-backend.herokuapp.com/loadImage",
            type: 'post',
            dataType: '',
            cors: true ,
            contentType:'application/json',
            secure: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            success: function (body){
                let result = []
                for (var i = 0; i < body.length; i+=2)
                  result.push('0x'+body[i]+''+body[i+1])

            var hdrInfo = HDRTools.RGBE_ReadHeader(result)
            var fArray = HDRTools.RGBE_ReadPixels(result, hdrInfo)
            console.log(hdrInfo)
            let t = new Texture()

            gl.bindTexture(gl.TEXTURE_2D, t.textID);
            
            // define size and format of level 0
            const level = 0;
            const internalFormat = gl.RGB16F;
            const border = 0;
            const format = gl.RGB;
            const type = gl.FLOAT
            const data = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, hdrInfo.width, hdrInfo.height, border, format, type, fArray);
            
            // set the filtering so we don't need mips
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            onLoad(t)
            }
        })

         }

    bind() {

        gl.bindTexture(gl.TEXTURE_2D, this.textID);

    }
}