class Cubemap
{
    constructor() {
        this.textID = gl.createTexture();          
        this.faces = []

        
    }

    static FromURLs(urlArray)
    {
        let t = new Cubemap()

        for(var i=0; i< urlArray.length; i++)
        {

            const image = new Image();
            image.crossOrigin = "anonymous"
            
            const {target, url} = urlArray[i]
            image.src = url;

            image.onload = function() {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, t.textID);
                gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


            };
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        return t

    }

   
    

    static CreateDepthFloat(widh, height) {
        let t = new Cubemap()

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, t.textID);

        for(var i=0; i< 6; i++)
        {
            const level = 0;
            const internalFormat = gl.DEPTH_COMPONENT32F;
            const border = 0;
            const type = gl.FLOAT
            const data = null;
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, level, internalFormat, widh, height, border, gl.DEPTH_COMPONENT, type, data);
            
            // set the filtering so we don't need mips
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        
        return t
    }

    static CreateEmpty(widh, height) {
        let t = new Cubemap()

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, t.textID);

        for(var i=0; i< 6; i++)
        {
            const level = 0;
            const internalFormat = gl.RGBA;
            const border = 0;
            const type = gl.UNSIGNED_BYTE
            const data = null;
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, level, internalFormat, widh, height, border, gl.RGBA, type, data);
            
            // set the filtering so we don't need mips
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        
        return t
    }

    static CreateEmptyFloat(widh, height, mipMaps = false) {
        let t = new Cubemap()

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, t.textID);

        for(var i=0; i< 6; i++)
        {
            const level = 0;
            const internalFormat = gl.RGBA16F;
            const border = 0;
            const type = gl.FLOAT
            const data = null;
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, level, internalFormat, widh, height, border, gl.RGBA, type, data);
            
      
        }
              // set the filtering so we don't need mips
              if(mipMaps)
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                else
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

              gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
              gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

              if(mipMaps)
              gl.generateMipmap(gl.TEXTURE_CUBE_MAP)
              
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        
        return t
    }

    bind() {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textID);
    }
}