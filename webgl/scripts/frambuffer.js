class Framebuffer {
    constructor() {
      this.attachments = new Map();  

        this.frameBuffer = gl.createFramebuffer()


    }


    addColorAttachment(width, height) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      var id = "color" + Object.keys(this.attachments).length
      var t = Texture.CreateEmpty(width, height)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, textureExtensions.COLOR_ATTACHMENT0_WEBGL + Object.keys(this.attachments).length, gl.TEXTURE_2D, t.textID, 0);
      this.attachments[id] = t
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
    }

    static unbind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }
  }