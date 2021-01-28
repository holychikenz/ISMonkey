// Modification build on JiggyJinjo's slider
class JiggySlide {
  constructor(monkey, options){
    // Reference the mother class enables the use of shared data
    this.monkey = monkey;
    this.options = options;
    this.createSlider();
  }
  createSlider(promise){
    self = this;
    promise = promise || new Promise(() => {});

    let success = false;
    let block = document.querySelector(".play-area-chat")
    let rightside = document.querySelector(".game-right-panel")
    let chatbuttons = document.querySelector(".chat-buttons");
    let playbox = document.querySelector(".play-area-container");
    let chatbox = document.querySelector(".play-area-chat-container");
    if( block && rightside && chatbuttons && playbox ) {

      // Glass pane; DM me for a better way to do this.
      let glass = document.createElement("div")
      glass.style.position = "fixed"
      glass.id = "glass"
      glass.style.display = "none"
      glass.style.width = "100%"
      glass.style.height = "100%"
      glass.style.top = "0"
      glass.style.left = "0"
      glass.style.right = "0"
      glass.style.bottom = "0"
      glass.style.zIndex = 10000
      glass.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
      document.body.appendChild(glass)

      block.style.flex = "none"
      block.style.minWidth = "15%"
      block.style.maxWidth = "78%"
      block.style.width = "50%"
      let slider = document.createElement("div")
      slider.id = "handler"
      slider.style.minWidth = "5px"
      slider.style.cursor = "ew-resize"
      block.after(slider)
      rightside.style.flex = "auto"

      slider.onmousedown = function dragMouseDown(e) {
        let dragX = e.clientX;
        glass.style.display = "block"
        document.onmousemove = function onMouseMove(e) {
          block.style.width = block.offsetWidth + e.clientX - dragX + "px";
          dragX = e.clientX;
        }
        // remove mouse-move listener on mouse-up
        document.onmouseup = () => {document.onmousemove = document.onmouseup = null; glass.style.display = "none";}
      }
      // Lets do the same for chat and remove those up/down buttons
      chatbuttons.style.display = "none"
      playbox.style.flex = "none"
      playbox.style.minHeight = "5%"
      playbox.style.maxHeight = "100%"
      playbox.style.height = "60%"

      let chatslider = document.createElement("div");
      chatslider.id = "chat-handler"
      chatslider.style.height = "5px"
      chatslider.style.cursor = "ns-resize"
      playbox.after(chatslider)
      chatbox.style.flex = "auto"

      chatslider.onmousedown = function dragMouseDown(e) {
        let dragY = e.clientY;
        glass.style.display = "block"
        document.onmousemove = function onMouseMove(e) {
          playbox.style.height = playbox.offsetHeight + e.clientY - dragY + "px";
          dragY = e.clientY;
        }
        document.onmouseup = () => {document.onmousemove = document.onmouseup = null; glass.style.display = "none";}
      }
      success = true;
    }
    if(success) {
      promise.then();
    }
    else {
      setTimeout(function(){self.createSlider(promise);
                 }, 1000 );
    }
  }
}
