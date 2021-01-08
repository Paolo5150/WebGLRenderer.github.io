class Texture
{

    constructor() {
        
        this.textID = gl.createTexture();          

    }

    static FromURL(url, internalFormat = gl.RGBA, format = gl.RGBA, type = gl.UNSIGNED_BYTE, generateMipMaps = false) {
        let t = new Texture()

        const image = new Image();
        image.crossOrigin = "anonymous"
        image.src = url;

        image.onload = function() {

            gl.bindTexture(gl.TEXTURE_2D, t.textID);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, image);      
      
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            if(generateMipMaps)
            {
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

            }


        gl.bindTexture(gl.TEXTURE_2D, null);

        };

        return t
    }

  
    static Unbind() {
        gl.activeTexture(gl.TEXTURE0 );

        gl.bindTexture(gl.TEXTURE_2D, null);

    }
    static Create(widh, height,internalFormat = gl.RGBA, format = gl.RGBA, type = gl.UNSIGNED_BYTE, 
        minFilter = gl.NEAREST, magFilter = gl.NEAREST, wrapMode = gl.CLAMP_TO_EDGE, generateMipMaps = false) {

        let t = new Texture()

        gl.bindTexture(gl.TEXTURE_2D, t.textID);        

        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, widh, height, 0, format, type, null);
        
        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);

        if(generateMipMaps)
            {
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            }

            gl.bindTexture(gl.TEXTURE_2D, null);
        return t
    }    
    


    //HDR format needs some extra work to load an image
     //onLoad, callback with the texture obj
    static FromURL_HDR(url, onLoad) {

        var d = {
            imageSrc: url
        }
        $.ajax({
            url: "https://dashboard.heroku.com/apps/pf-portfolio-backend/loadImage",
            type: 'post',
            dataType: '',
            data: JSON.stringify(d),
            cors: true ,
            contentType:'application/json',
            secure: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            success: function (body){
                
                console.log("RECEIVED HDR, starting to parse")
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