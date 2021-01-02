class Framebuffer {
    constructor(width, height) {
      this.attachments = new Map();  

        this.frameBuffer = gl.createFramebuffer()
        this.width = width
        this.height = height
    }


    addTextureColorAttachment(count, internalFormat, format, type, minFilter, magFilter, wrapMode)
    {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      for(var i=0; i< count; i++) {

        var id = "color" + i
        var t = Texture.Create(this.width, this.height, internalFormat, format, type, minFilter, magFilter, wrapMode)
        t.bind()
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, t.textID, 0);
    
        this.attachments[id] = t
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }

    addTextureDepthAttachment(type = "float")
    {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      var id = "depth"
      if(type === "float")
        this.attachments[id] = Texture.Create(this.width,this.height, gl.DEPTH_COMPONENT32F, gl.DEPTH_COMPONENT, gl.FLOAT)
        else
        this.attachments[id] = Texture.Create(this.width,this.height, gl.DEPTH_COMPONENT24, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT)

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.attachments[id].textID, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }

    addCubeDepthAttachmentFloat() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      var id = "depth"
      this.attachments[id] = Cubemap.CreateDepthFloat(this.width,this.height)
      this.attachments[id].bind()
      for(var i=0; i< 6; i++)
      {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.attachments[id].textID, 0);

      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }

    addCubeColorAttachment( ) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

        var id = "color0" 
        this.attachments[id] = Cubemap.CreateEmpty(this.width, this.height)
        this.attachments[id].bind()
        for(var i=0; i< 6; i++)
        {
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.attachments[id].textID, 0);
        }
    
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }

    addCubeColorAttachmentFloat(mipMap = false ) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

        var id = "color0" 
        this.attachments[id] = Cubemap.CreateEmptyFloat(this.width, this.height, mipMap)
        this.attachments[id].bind()
        for(var i=0; i< 6; i++)
        {
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.attachments[id].textID, 0);
        }
    
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }



    bind() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)
      gl.viewport(0, 0, this.width, this.height);


    }

    static unbind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }
  }