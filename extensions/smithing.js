class Smithing {
  constructor(monkey, options){
    this.options = options
    this.monkey = monkey
    this.classname = "Smithing"
    this.smithingDomName = "SmithingInfoDom"
    this.smithingTableName = "SmithingInfoTable"
    this.smithstyle = document.createElement("style");
  }
  connect(){
    this.setupObserver()
  }
  addTooltip(){
    let ttstyle = document.createElement("style");
    ttstyle.innerHTML = 
      `
      .tooltipSM {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black;
      }
      .tooltipSM .tooltipSMtext {
        visibility: hidden;
        width: 120px;
        background-color: black;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        z-index: 1;
      }
      .tooltipSM:hover .tooltipSMtext {
        visibility: visible;
      }
      `
    document.body.appendChild(ttstyle)
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
        height: auto;
        width: 100%;
        padding: 2px;
      }
      .resource-wrapper table{
        height: auto;
        table-layout: fixed;
        width: auto;
        padding: 10px;
      }
      .resource-wrapper td, tr {
        padding: 2px;
        padding-right: 10px;
      }
      .resource-wrapper input[type=number] {
        color: white;
        font-size: 14px;
        border-bottom: none;
        margin: 0px;
        height: auto;
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
    self.addTooltip();
    self.override = false;
    const targetNode = targetNodeHolder[0];
    const config = {attributes:true, childList: false, subtree: true, characterData: true};
    var orePerBar = {
      "Bronze bar": 1,
      "Iron bar": 3,
      "Gold bar": 10,
      "Mithril bar": 5,
      "Adamantite bar": 10,
      "Runite bar": 15,
      "Stygian bar": 25,
      "Magic Ice Bar": 2
    }
    var timePerBar = {
      "Bronze bar": 6,
      "Iron bar": 12,
      "Gold bar": 20,
      "Mithril bar": 30,
      "Adamantite bar": 44,
      "Runite bar": 90,
      "Stygian bar": 106,
      "Magic Ice Bar": 106
    }
    var expPerBar = {
      "Bronze bar": 10,
      "Iron bar": 100,
      "Gold bar": 100,
      "Mithril bar": 200,
      "Adamantite bar": 300,
      "Runite bar": 1000,
      "Stygian bar": 1500,
      "Magic Ice Bar": 100
    }
    var heatPerBar = {
      "Bronze bar": 1,
      "Iron bar": 5,
      "Gold bar": 20,
      "Mithril bar": 50,
      "Adamantite bar": 100,
      "Runite bar": 200,
      "Stygian bar": 500,
      "Magic Ice Bar": 100
    }
    var goldPerBar = {
      "Bronze bar": 25,
      "Iron bar": 100,
      "Gold bar": 1500,
      "Mithril bar": 500,
      "Adamantite bar": 3000,
      "Runite bar": 9000,
      "Stygian bar": 12000,
      "Magic Ice Bar": 0
    }
    let tableValues = {
      "Haste": 0,
      "Scholar": 0,
      "Pyromancy": 0,
      "Inferno": 0,
      "Wealth": 0,
    }
    const callback = function(mutationsList, observer) {
      let actionNode = targetNode.getElementsByClassName("nav-tab-left");
      let action = (actionNode.length>0)?actionNode[0].innerText:"Unknown";
      if( action == "Smithing" ){
        self.addCSS();
        self.level = self.monkey.extensions.PlayerData.getEffectiveLevel("smithing");
        let haste = self.monkey.extensions.PlayerData.getBuffStrength("Haste");
        let scholar = self.monkey.extensions.PlayerData.getBuffStrength("Scholar");
        let pyro = self.monkey.extensions.PlayerData.getBuffStrength("Pyromancy");
        let inferno = self.monkey.extensions.PlayerData.getBuffStrength("Inferno");
        let wealth = self.monkey.extensions.PlayerData.getBuffStrength("Wealth");
        // Allow for user override
        // Todo: Add intuition

        //let information = `Haste ${haste}<br/>`;
        //information += `Scholar: ${scholar}<br/>`;
        //information += `Pyro: ${pyro}<br/>`;
        //information += `Inferno: ${inferno}<br/>`;
        //information += `Wealth: ${wealth}<br/>`;
        var smithingDom = document.getElementById(self.smithingDomName);
        if( smithingDom == null ){
          smithingDom = document.createElement("div");
          smithingDom.id = self.smithingDomName;
          smithingDom.className = "resource-wrapper";
          targetNode.getElementsByClassName("resource-list")[0].prepend(smithingDom);
        }
        smithingDom.innerHTML = '';
        // Smithing table
        let smithingTable = document.createElement("table");
        function smithingRow(key, value){
          let newRow = document.createElement("tr");
          let keyTD = document.createElement("td");
          let valTD = document.createElement("td");
          keyTD.innerText = key;
          valTD.innerText = value;
          newRow.append(keyTD);
          newRow.append(valTD);
          smithingTable.append(newRow);
          // Override input
          let inputTD = document.createElement("td");
          let input = document.createElement("input");
          input.type="number";
          input.min = 0;
          input.max = 20;
          input.value = tableValues[key]
          inputTD.append(input);
          //newRow.append(inputTD);
          input.addEventListener('change', e=>{tableValues[key]=e.target.value;});
        }
        smithingRow("Haste", haste);
        smithingRow("Scholar", scholar);
        smithingRow("Pyromancy", pyro);
        smithingRow("Inferno", inferno);
        smithingRow("Wealth", wealth);
        if( self.override ){
          haste = tableValues.Haste;
          scholar = tableValues.Scholar;
          pyro = tableValues.Pyromancy;
          inferno = tableValues.Inferno;
          wealth = tableValues.Wealth;
        }
        smithingDom.append(smithingTable);
        //smithingDom.innerHTML = information;
        let ores = {
          "tin": self.monkey.extensions.PlayerData.getItemStackSize("Tin Ore"),
          "copper": self.monkey.extensions.PlayerData.getItemStackSize("Copper Ore"),
          "Iron bar": self.monkey.extensions.PlayerData.getItemStackSize("Iron Ore"),
          "Gold bar": self.monkey.extensions.PlayerData.getItemStackSize("Gold Ore"),
          "Mithril bar": self.monkey.extensions.PlayerData.getItemStackSize("Mithril Ore"),
          "Adamantite bar": self.monkey.extensions.PlayerData.getItemStackSize("Adamantite Ore"),
          "Runite bar": self.monkey.extensions.PlayerData.getItemStackSize("Runite Ore"),
          "Stygian bar": self.monkey.extensions.PlayerData.getItemStackSize("Stygian Ore"),
          "Magic Ice Bar": self.monkey.extensions.PlayerData.getItemStackSize("Magic Ice"),
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
          let ss = `<span style="display: inline-block; width: 80px;">`
          mdom.innerHTML = `
          ${ss}Actions:</span>${numberWithCommas(operations)}<br>
          ${ss}Time:</span>${timeFormatFull(totaltime)}<br>
          ${ss}Heat:</span>${numberWithCommas(totalheat)}<br>
          ${ss}Experience:</span>${numberWithCommas(experience)}`
        }
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
