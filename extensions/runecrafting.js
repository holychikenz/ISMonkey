class Runecrafting {
  constructor(monkey, options){
    this.options = options
    this.monkey = monkey
    this.classname = "Runecrafting"
    this.setupObserver();
  }
  setupObserver(promise) {

    promise = promise || new Promise(() => {});
    let self = this;
    const targetNodeHolder = document.getElementsByClassName("play-area-container");
    if(targetNodeHolder.length > 0) {
      promise.then();
    }
    else {
      setTimeout(function(){self.setupObserver(promise);
                 }, 1000 );
      return false;
    }
    const targetNode = targetNodeHolder[0];
    const config = {attributes: true, childList: false, subtree: true, characterData: true};
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      // Are we cooking?
      var action = targetNode.getElementsByClassName("nav-tab-container")[0].innerText
      if( action === "Runecrafting" ){
        // Lets write over the runecrafting-info, its crap anyways
        self.level = self.monkey.extensions.PlayerData.getEffectiveLevel("runecrafting");
        let nRunes = Math.floor(this.level/20)+1;
        let box = document.getElementsByClassName("runecrafting-info")[0];
        let haste = self.monkey.extensions.PlayerData.getBuffStrength("haste");
        let rcbuff = self.monkey.extensions.PlayerData.getBuffStrength("runecrafting");
        let information = `Runes per craft: ${nRunes}<br/>`
        information += `Runecrafting: ${rcbuff}<br/>`
        information += `Haste: ${haste}<br/>`
        box.innerHTML = information;
        let tick = 5*(1 - haste*0.04)
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

  }
}
