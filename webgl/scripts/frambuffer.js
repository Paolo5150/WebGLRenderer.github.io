class Framebuffer {
    constructor() {
      this.attachments = new Map();  

        this.frameBuffer = gl.createFramebuffer()


    }

    addColorAttachment(width, height, count) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      for(var i=0; i< count; i++) {

        var id = "color" + i
        var t = Texture.CreateEmpty(width, height)
        t.bind()
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, t.textID, 0);
    
        this.attachments[id] = t
    }
      gl.drawBuffers( [gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }


    addColorAttachmentFloatFormat(width, height, count) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      for(var i=0; i< count; i++) {

        var id = "color" + i
        var t = Texture.CreateEmptyFloatFormat(width, height)
        t.bind()
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, t.textID, 0);
    
        this.attachments[id] = t
    }
      gl.drawBuffers( [gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }

    addDepthAttachment(width, height) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      var id = "depth" + Object.keys(this.attachments).length
      this.attachments[id] = Texture.CreateDepth(width, height)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.attachments[id].textID, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }

    bind() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)
     gl.drawBuffers( [gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

    }

    static unbind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }
  }