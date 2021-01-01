class Framebuffer {
    constructor(width, height) {
      this.attachments = new Map();  

        this.frameBuffer = gl.createFramebuffer()
        this.width = width
        this.height = height
    }

    addColorAttachment( count) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      for(var i=0; i< count; i++) {

        var id = "color" + i
        var t = Texture.CreateEmpty(this.width, this.height)
        t.bind()
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, t.textID, 0);
    
        this.attachments[id] = t
    }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }


    addColorAttachmentFloatFormat( count) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      for(var i=0; i< count; i++) {

        var id = "color" + i
        var t = Texture.CreateEmptyFloatFormat(this.width, this.height)
        t.bind()
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, t.textID, 0);
    
        this.attachments[id] = t
    }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }

    addDepthAttachmentFloat() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      var id = "depth"
      this.attachments[id] = Texture.CreateDepthFloat(this.width,this.height)
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

    addCubeColorAttachmentFloat( ) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

        var id = "color0" 
        this.attachments[id] = Cubemap.CreateEmptyFloat(this.width, this.height)
        this.attachments[id].bind()
        for(var i=0; i< 6; i++)
        {
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.attachments[id].textID, 0);
        }
    
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }

    addDepthAttachment() {

      var id = "depth"
      this.attachments[id] = Texture.CreateDepth(this.width, this.height)
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.attachments[id].textID, 0);
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