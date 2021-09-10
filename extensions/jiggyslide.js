// Modification build on JiggyJinjo's slider
class JiggySlide {
  constructor(monkey, options){
    // Reference the mother class enables the use of shared data
    self.monkey = monkey;
    self.options = options;
    self.classname = "JiggySlide"
  }
  connect(){
    let self = this
    let creationInterval = setInterval( ()=>{
      if( self.createSlider() )clearInterval(creationInterval);
    }, 1000);
    self.setupSliderObserver();
  }

  createSlider(){
    let self = this;
    // Change the css of a few elements and append to the document
    // so that react doesn't try changing it back later on redraw.
    if( document.readyState !== 'complete' ) return false;
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

      let slider = document.createElement("div")
      slider.id = "handler"
      slider.style.minWidth = "5px"
      slider.style.cursor = "ew-resize"
      block.after(slider)

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
      var sliderstyle = document.createElement("style")
      sliderstyle.id = "sliderStyles"
      sliderstyle.innerHTML =
        `
          .play-area-chat {
            flex: none;
            min-width: 15%;
            max-width: 78%;
            width: 50%;
          }
          .game-right-panel {
            flex: auto;
          }
          .play-area-container {
            flex: none;
            min-height: 5%;
            max-height: 95%;
            height: 60%;
          }
          .nav-tab, .nav-tab-flex, .nav-tab-right {
            overflow-wrap: anywhere;
          }
        `
      document.body.appendChild(sliderstyle);
    }
    return success;
  }
  setupSliderObserver(promise) {

    promise = promise || new Promise(() => {});
    let self = this;
    const targetNodeHolder = document.getElementsByClassName("combine-main-area");
    if(targetNodeHolder.length > 0) {
      promise.then();
    }
    else {
      setTimeout(function(){self.setupSliderObserver(promise);
                 }, 1000 );
      return false;
    }
    const targetNode = targetNodeHolder[0];
    const config = {attributes: true, childList: false, subtree: true, characterData: true};
    let inGroupCombat = false;
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Change if we go into group combat, and back if not
        let chat = document.getElementsByClassName("play-area-chat")[0]
        if( typeof chat == 'undefined' ){
          return
        }
        if( document.getElementsByClassName("game-right-panel").length > 0 ){
            if( inGroupCombat ){
                chat.style.width="50%"
                inGroupCombat=false;
            }
            chat.style.maxWidth="78%"
            chat.style.flex="none";
        } else {
            chat.style.maxWidth="100%"
            //chat.style.width="100%"
            chat.style.flex="auto";
            inGroupCombat = true;
        }
    };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    window.addEventListener("resize", callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }
}
