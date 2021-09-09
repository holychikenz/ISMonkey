// Modification build on JiggyJinjo's slider
class AnimationCancel {
  constructor(monkey, options){
    // Reference the mother class enables the use of shared data
    this.monkey = monkey;
    this.options = options;
    this.classname = "AnimationCancel";
  }
  connect(){
    this.killAnimations();
  }
  killAnimations(promise){
    promise = promise || new Promise(() => {});
    let self = this;
    const targetNodeHolder = document.getElementsByClassName("play-area-container");
    if(targetNodeHolder.length > 0) {
      promise.then();
    }
    else {
      setTimeout(function(){self.killAnimations(promise);
                 }, 1000 );
      return false;
    }
    const targetNode = targetNodeHolder[0];
    const config = {attributes: true, childList: true, subtree: true };
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      document.querySelectorAll(".combat-fight-attack-speed").forEach(e=>e.parentNode.removeChild(e));
      document.querySelectorAll(".MuiLinearProgress-root").forEach(e=>e.parentNode.removeChild(e));
      document.querySelectorAll(".scrolling-text").forEach(e=>e.parentNode.removeChild(e));
      document.querySelectorAll(".cookingProgressBar").forEach(e=>e.parentNode.removeChild(e));
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }
}
