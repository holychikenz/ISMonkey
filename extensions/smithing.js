class Smithing {
  constructor(monkey, options){
    this.options = options
    this.monkey = monkey
    this.classname = "Smithing"
    this.smithingDomName = "SmithingInfoDom"
    this.smithstyle = document.createElement("style");
    this.setupObserver();
  }
  setupCSS(){
    this.smithstyle.innerHTML =
      `
      .resource-list {
        display: inline;
        width: 100%;
      }
      .resource-container-title {
        font-size: 16px;
        width: 100px;
      }
      .resource-container {
        display: flex;
        height: 100px;
        width: 100%;
        display: 100%;
        background-size: auto 100%;
        background-position: 0;
      }
      .resource-wrapper {
        height: 100px;
        width: 100%;
        padding: 5px;
      }
      .resource-container-button {
        width: 100px;
        padding: 10px;
      }
      .resource-container-image {
        height: 100%;
        padding: 10px;
        margin-left: 0px;
        margin-right: 0px;
      }
      .resource-required-resources {
        position: unset;
        width: auto;
        padding-top: 5px;
      }
      `
    this.cssEnabled = false;
  }
  removeCSS(){
    this.smithstyle.remove();
    this.cssEnabled = false;
  }
  addCSS(){
    if( !this.cssEnabled ){
      document.body.appendChild(this.smithstyle);
    }
    this.cssEnabled = true;
  }
  setupObserver(promise){
    promise = promise || new Promise(()=>{});
    let self = this;
    const targetNodeHolder = document.getElementsByClassName("play-area-container");
    if(targetNodeHolder.length > 0){
      promise.then();
    }
    else {
      setTimeout(function(){self.setupObserver(promise);}, 1000);
      return false;
    }
    const targetNode = targetNodeHolder[0];
    const config = {attributes:true, childList: false, subtree: true, characterData: true};
    var orePerBar = {
      "Bronze bar": 1,
      "Iron bar": 3,
      "Gold bar": 10,
      "Mithril bar": 5,
      "Adamantite bar": 10,
      "Runite bar": 15,
      "Stygian bar": 25
    }
    var timePerBar = {
      "Bronze bar": 6,
      "Iron bar": 12,
      "Gold bar": 20,
      "Mithril bar": 30,
      "Adamantite bar": 44,
      "Runite bar": 90,
      "Stygian bar": 106
    }
    var expPerBar = {
      "Bronze bar": 10,
      "Iron bar": 100,
      "Gold bar": 100,
      "Mithril bar": 200,
      "Adamantite bar": 300,
      "Runite bar": 1000,
      "Stygian bar": 1500
    }
    var heatPerBar = {
      "Bronze bar": 1,
      "Iron bar": 5,
      "Gold bar": 20,
      "Mithril bar": 50,
      "Adamantite bar": 100,
      "Runite bar": 200,
      "Stygian bar": 500
    }
    var goldPerBar = {
      "Bronze bar": 25,
      "Iron bar": 100,
      "Gold bar": 1500,
      "Mithril bar": 500,
      "Adamantite bar": 3000,
      "Runite bar": 9000,
      "Stygian bar": 12000
    }
    const callback = function(mutationsList, observer) {
      var action = targetNode.getElementsByClassName("nav-tab-container")[0].innerText;
      if( action == "Smithing" ){
        self.addCSS();
        self.level = self.monkey.extensions.PlayerData.getEffectiveLevel("smithing");
        let haste = self.monkey.extensions.PlayerData.getBuffStrength("Haste");
        let scholar = self.monkey.extensions.PlayerData.getBuffStrength("Scholar");
        let pyro = self.monkey.extensions.PlayerData.getBuffStrength("Pyromancy");
        let inferno = self.monkey.extensions.PlayerData.getBuffStrength("Inferno");
        let wealth = self.monkey.extensions.PlayerData.getBuffStrength("Wealth");
        // Todo: Add intuition
        let information = `Haste ${haste}<br/>`;
        information += `Scholar: ${scholar}<br/>`;
        information += `Pyro: ${pyro}<br/>`;
        information += `Inferno: ${inferno}<br/>`;
        information += `Wealth: ${wealth}<br/>`;
        var smithingDom = document.getElementById(self.smithingDomName);
        if( smithingDom == null ){
          smithingDom = document.createElement("div");
          smithingDom.id = self.smithingDomName;
          smithingDom.className = "resource-wrapper";
          targetNode.getElementsByClassName("resource-list")[0].prepend(smithingDom);
        }
        smithingDom.innerHTML = information;
        let ores = {
          "tin": self.monkey.extensions.PlayerData.getItemStackSize("Tin Ore"),
          "copper": self.monkey.extensions.PlayerData.getItemStackSize("Copper Ore"),
          "Iron bar": self.monkey.extensions.PlayerData.getItemStackSize("Iron Ore"),
          "Gold bar": self.monkey.extensions.PlayerData.getItemStackSize("Gold Ore"),
          "Mithril bar": self.monkey.extensions.PlayerData.getItemStackSize("Mithril Ore"),
          "Adamantite bar": self.monkey.extensions.PlayerData.getItemStackSize("Adamantite Ore"),
          "Runite bar": self.monkey.extensions.PlayerData.getItemStackSize("Runite Ore"),
          "Stygian bar": self.monkey.extensions.PlayerData.getItemStackSize("Stygian Ore"),
          "ichor": self.monkey.extensions.PlayerData.getItemStackSize("Ichor")
        }
        for(let k of targetNode.getElementsByClassName("resource-container")){
          let bar = k.getElementsByClassName("resource-container-title")[0].innerHTML;
          let operations = 0;
          if( bar == "Bronze bar" ){
            operations = Math.floor( Math.min(ores.tin, ores.copper) / orePerBar[bar] );
          } else {
            operations = Math.floor( ores[bar]/orePerBar[bar] );
          }
          let tick = timePerBar[bar]*100/(self.level+99)*(1-0.04*haste)*(1-0.05*inferno);
          let totaltime = tick*operations;
          let totalheat = Math.ceil(heatPerBar[bar]*(1-0.1*pyro))*operations;
          let experience = Math.ceil(expPerBar[bar]*(1+0.2*scholar))*operations;
          let mdom = k.getElementsByClassName("resource-required-resources")[0];
          mdom.innerHTML = `A: ${numberWithCommas(operations)}<br>T:
          ${timeFormat(totaltime)}<br>H: ${numberWithCommas(totalheat)}<br>X:
          ${numberWithCommas(experience)}` }
      }
      else {
        self.removeCSS();
      }
    }
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    self.setupCSS();
  }
}
