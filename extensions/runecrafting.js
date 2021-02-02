class Runecrafting {
  constructor(monkey, options){
    this.options = options
    this.monkey = monkey
    this.classname = "Runecrafting"
    this.setupObserver();
  }
  addCSS(){
    var rcstyle = document.createElement("style");
    rcstyle.innerHTML=
      `
      .runecrafting-essence-counter {
        padding-top: 2px;
        font-size: 14px;
      }
      `
    document.body.appendChild(rcstyle)
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
      var action = targetNode.getElementsByClassName("nav-tab-container")[0].innerText
      if( action === "Runecrafting" ){
        // Lets write over the runecrafting-info, its crap anyways
        self.level = self.monkey.extensions.PlayerData.getEffectiveLevel("runecrafting");
        let nRunes = Math.floor(self.level/20)+1;
        let box = document.getElementsByClassName("runecrafting-info")[0];
        let haste = self.monkey.extensions.PlayerData.getBuffStrength("haste");
        let rcbuff = self.monkey.extensions.PlayerData.getBuffStrength("runecrafting");
        let information = `Runes per craft: ${nRunes}<br/>`
        information += `Runecrafting: ${rcbuff}<br/>`
        information += `Haste: ${haste}<br/>`
        box.innerHTML = information;
        let tick = 5*(1 - haste*0.04)
        // Loop through each essence and augments remaining, xp, time
        for(let k of targetNode.getElementsByClassName("resource-as-row-container"))
        {
          let rune = k.getElementsByClassName("resource-as-row-image")[0].alt;
          let mDom = k.getElementsByClassName("resource-as-row-required-resources")[0];
          // Get essence from playerdata
          let essence = 100000
          let operations = Math.floor(essence/(400*(1-rcbuff*0.05)));
          let totaltime = operations*tick;
          mDom.innerHTML = `Actions: ${operations}<br/>Time: ${timeFormat(totaltime)}`
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    self.addCSS();
  }
}
