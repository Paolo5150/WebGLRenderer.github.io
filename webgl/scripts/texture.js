class Texture
{
    constructor(url) {
        
        this.textID = gl.createTexture();
        const image = new Image();
        image.crossOrigin = "anonymous"

        var temp = this.textID
        image.onload = function() {

          gl.bindTexture(gl.TEXTURE_2D, temp);

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
        image.src = url;

    }

    bind() {

        gl.bindTexture(gl.TEXTURE_2D, this.textID);

    }
}