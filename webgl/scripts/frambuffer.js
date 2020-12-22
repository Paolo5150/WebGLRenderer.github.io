class Framebuffer {
    constructor() {
      this.attachments = new Map();  

        this.frameBuffer = gl.createFramebuffer()


    }

    addColorAttachment(width, height) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

      var id = "color" + Object.keys(this.attachments).length
      this.attachments[id] = new Texture(width, height)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.attachments[id].textID, 0);
    }

    bind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)
    }

    static unbind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    }
  }