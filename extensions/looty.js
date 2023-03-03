const skillIcons = {
  "mining": "/images/mining/iron_pickaxe.png",
  "foraging": "/images/foraging/foraging_icon.png",
  "fishing": "/images/fishing/fishing_logo.png",
  "farming": "/images/farming/farming_icon.png",
  "enchanting": "/images/enchanting/enchanting_logo.png",
  "runecrafting": "/images/runecrafting/RuneCraftingIcon.png",
  "smithing": "/images/smithing/smithing_icon.png",
  "crafting": "/images/ui/crafting_icon.png",
  "cooking": "/images/cooking/cooking_icon.png",
  "constitution": "/images/combat/constitution_icon.png",
  "attack": "/images/combat/attack_icon.png",
  "strength": "/images/combat/strength_icon.png",
  "defense": "/images/combat/defense_icon.png",
  "magic": "/images/magic/magic_logo.png",
  "range": "/images/combat/range_icon.png",
  "total": "/images/total_level.png",
  "gold": "/images/money_icon.png",
  "Air Essence": "/images/runecrafting/air_essence.png",
  "Earth Essence": "/images/runecrafting/earth_essence.png",
  "Fire Essence": "/images/runecrafting/fire_essence.png",
  "Water Essence": "/images/runecrafting/water_essence.png",
  "Blood Essence": "/images/runecrafting/blood_essence.png",
  "Death Essence": "/images/runecrafting/death_essence.png",
  "Chaos Essence": "/images/runecrafting/chaos_essence.png",
  "Nature Essence": "/images/runecrafting/nature_essence.png",
  "Mind Essence": "/images/runecrafting/mind_essence.png",
  "Cosmic Essence": "/images/runecrafting/cosmic_essence.png",
  "Winter Essence": "/images/runecrafting/snow_essence.png",
}

class Looty{
  constructor(monkey, options){
    this.monkey = monkey;
    this.options = options;
    this.classname = "Looty";
    this.experience = {}
    this.initExperience = {}
    this.masteryExperience = {}
    this.masteryInitExperience = {}
    this.essence = {}
    this.initEssence = {}
    this.initExperienceTimer = Date.now();
    this.gold = 0
    this.cook = 0
    this.logging = false;
  }
  connect(){
    let self = this
    Promise.all([
      getJSON("api/market/manifest"),
      getJSON("https://raw.githubusercontent.com/holychikenz/ISMonkey/main/data/ingredients.json")
    ]).then( data=> {
      let manifest = data[0].manifest
      self.market = {}
      self.marketByID = {}
      for( let item of manifest){
        self.market[item.name] = item.minPrice
        self.marketByID[item.itemID] = item.minPrice
      }

      let cooking = data[1];
      self.cookbook = {}
      for( const [key, value] of Object.entries(cooking) ){
        self.cookbook[key] = value.exp
      }
      self.buildUI(self);
      self.resetStats(self);
    })
  }
  disconnect(){
  }
  send(obj, msg){
  }
  message(obj, msg){
    let call = msg[0];
    let message = msg[1];
    if( call === "update:player" ){
      let portion = message.portion;
      let value = message.value;
      // Essence in stockpile
      if( portion == "all" ){
        // Set buffs
        for(let ec in value.skills){this.experience[ec] = value.skills[ec].experience;}
        for(let ec in value.skills){this.masteryExperience[ec] = value.skills[ec].masteryExperience;}
        for(let stock of value.stockpile){
          let iname = stock.name;
          if( iname.includes("Essence") ){
            let isize = stock.stackSize;
            this.essence[iname] = isize;
          }
        }
        this.initExperience = {...this.experience};
        this.initMasteryExperience = {...this.masteryExperience};
        this.initEssence = {...this.essence};
        this.initExperienceTimer = Date.now();
      } else {
        // Skills and tools
        if( portion.includes("skills") ){
          for( const [key, val] of Object.entries(value) ){
            if( this.logging == true && key != "total" ){
              let previous_tick = this.experience[key];
              let delta = val.experience - previous_tick;
              if( delta > 0 ){
                console.log("XP Gain:",key,delta);
              }
            }
            this.experience[key] = val.experience;
            this.masteryExperience[key] = val.masteryExperience;
          }
        }
        if( portion.includes("actionQue") ) {
          //this.initExperience = {...this.experience};
          //this.initMasteryExperience = {...this.masteryExperience};
          //this.initExperienceTimer = Date.now();
        }
      }
      this.updateXPSTAT();
    }
    if( call === "update inventory" ){
      let item = message.item;
      let iname = item.name;
      if( iname.includes("Essence") ){
        let isize = item.stackSize;
        this.essence[iname] = isize;
      }
      this.updateXPSTAT();
    }
    if( call === "lootlog:loot" ){
      /*
      let loot = message
      let name = loot.itemID
      let count = loot[1]
      let newgold = count
      let newcook = 0
      if( name in this.market ){
        newgold = this.market[name] * count
      }
      this.gold += newgold
      name = name.toLowerCase();
      if( name in this.cookbook ){
        newcook = this.cookbook[name] * count
      }
      this.cook += newcook
      */
    }
  }
  buildUI(self, promise){
    promise = promise || new Promise(() => {});
    const targetNodeHolder = document.getElementsByClassName("item-log-timer");
    if(targetNodeHolder.length > 0) {
      promise.then();
    }
    else {
      setTimeout(function(){self.buildUI(self, promise);
                 }, 1000 );
      return false;
    }
    const config = {attributes: true, childList: true, subtree: true };
    // Callback function to execute when mutations are observed
    self.constructMenu(self);
  }
  constructMenu(self){
    let menuID = "LootyMcLootface"
    if( document.getElementById(menuID) ){
      return;
    }
    let drawerCat = document.createElement("div");
    drawerCat.className="drawer-category";
    drawerCat.innerHTML="<b>Looty McLootface</b>";
    drawerCat.id=menuID;
    // Maybe we also rip out the reset button and timer and move those
    let container = document.getElementsByClassName("nav-drawer-container")[0];
    let itemLogTimer = document.getElementsByClassName("item-log-timer")[0];
    let resetButton = null;
    let bigButtons = document.getElementsByClassName("drawer-setting-large")
    for( let bb of bigButtons ){
      if( bb.innerText.includes("Reset") ){
        resetButton = bb;
      }
    }
    // Clone timer and set real time to invis
    self.completeButton = resetButton.cloneNode();
    self.completeButton.innerText = "Reset"
    self.completeButton.onclick = ()=>resetButton.click();
    self.completeButton.addEventListener('click', ()=>self.resetStats(self))
    resetButton.style.display="none";
    let timedReset = document.createElement("div");
    self.completeButton.style.float="left";
    self.completeButton.style.marginLeft="20px";
    timedReset.style.display="inline-grid";
    timedReset.style.width="100%";
    // Hold timer with icon in sub div
    let timerSubDiv = document.createElement("div");
    timerSubDiv.style.paddingLeft="25px";
    timerSubDiv.style.display="flex";
    timerSubDiv.style.height="30px";
    let timerIcon = document.createElement("IMG");
    timerIcon.className="drawer-item-icon";
    timerIcon.src="/images/clock.png";
    timerIcon.style.marginTop="auto";
    timerIcon.style.marginBottom="auto";
    itemLogTimer.style.marginTop="auto";
    itemLogTimer.style.marginBottom="auto";
    timerSubDiv.append(timerIcon);
    timerSubDiv.append(itemLogTimer);
    // Add to menu
    timedReset.append(timerSubDiv);
    timedReset.append(self.completeButton)
    // Now build new menus
    let lootMenu = self.createLootMenu(self);
    let xpMenu = self.createExperienceMenu(self);
    let essence = self.createEssenceMenu(self);
    let market = self.createMarketMenu(self);


    function appendToContainer(item, con, loc ){
      con.insertBefore(item, con.children[loc]);
    }
    for( let i=0; i < container.children.length; i++ ){
      if( container.children[i].innerText.indexOf("Loot Log")>-1 ){
        // Append in reverse order -.-
        appendToContainer(timedReset, container, i+1);
        appendToContainer(essence, container, i+1);
        appendToContainer(xpMenu, container, i+1);
        appendToContainer(lootMenu, container, i+1);
        appendToContainer(market, container, i+1);
        appendToContainer(drawerCat, container, i+1);
        // remove Loot Log (invisible to make react happy)
        container.children[i].style.display = "none";
        break;
      }
    }
  }
  createLootMenu(self){
    let lootMenuCss = `
      .item-log-window {
        padding-left: 0px;
        display: flex;
        flex-direction: column;
        white-space: normal;
        min-width: unset;
        margin-right: 0px;
      }
      .item-log-cateogry {
        padding-top: 3px;
        padding-bottom: 3px;
      }
      .item-log-category-open {
        margin-right: 0px;
      }
      .item-log-category-closed {
        margin-right: 0px;
      }
      .item-log-list {
        margin-right: 0px;
        line-height: normal;
      }
      .drawer-item-left {
        width: 100%;
      }
      .drawer-item.active:hover {
        background: linear-gradient(90deg,hsla(0,0%,100%,.25),hsla(0,0%,100%,0));
        background-size: auto 30px;
        background-repeat: no-repeat;
      }
      .nav-drawer {
        overflow-y: hidden;
        scrollbar-gutter: stable;
      }
      .nav-drawer:hover {
        overflow: auto;
      }
      /* Noped by firefox
      .nav-drawer {
        overflow-y: hidden;
      }
      .nav-drawer:hover {
        overflow: overlay;
      }
      */
    `
    appendCSS(lootMenuCss)
    let outerDiv = document.createElement("DIV");
    outerDiv.className="drawer-item active noselect";
    outerDiv.style.height="auto";
    outerDiv.style.display="block";
    let icon = document.createElement("IMG");
    icon.className="drawer-item-icon";
    icon.src="/images/ui/inventory_icon.png";
    let innerDiv = document.createElement("DIV");
    innerDiv.className="drawer-item-left";
    innerDiv.append(icon);
    //innerDiv.className="monkey";
    innerDiv.innerHTML+="Loot";
    outerDiv.append(innerDiv);
    // Add an item log menu
    // This is just to setup the structure, we can use this to create a new
    // lootlog menu later if that is desired. For now we can just rip out
    // the current one.
    let itemLogMenu = document.getElementsByClassName("item-log-window")[0];
    //let itemLogMenu = document.createElement("DIV");
    //itemLogMenu.className="item-log-window";
    itemLogMenu.style.display="none";
    outerDiv.append(itemLogMenu);
    // itemLogMenu can be modified, so should be exposed to the class
    self.LootItemLog = itemLogMenu;
    //outerDiv.addEventListener("click", ()=>{self.LootItemLog.display= (self.LootItemLog.display == "none") ? "block" : "none";})
    let fullGradient = "linear-gradient(90deg,hsla(0,0%,100%,.25),hsla(0,0%,100%,0))"
    let subGradient = "linear-gradient(90deg,hsla(0,0%,100%,.25),hsla(0,0%,100%,0),hsla(0,0%,100%,0),hsla(0,0%,100%,0))"
    function toggleDisplay(){
      //innerDiv.style.background = (itemLogMenu.style.display=="none")?fullGradient:subGradient;
      innerDiv.style.borderBottom=(itemLogMenu.style.display=="none")?"2px solid #dee2e6d6":"none";
      itemLogMenu.style.display=(itemLogMenu.style.display=="none")?"block":"none";
    }
    innerDiv.addEventListener("click", toggleDisplay)
    return outerDiv
  }
  createExperienceMenu(self){
    let outerDiv = document.createElement("DIV");
    outerDiv.className="drawer-item active noselect";
    outerDiv.style.height="auto";
    outerDiv.style.display="block";
    let icon = document.createElement("IMG");
    icon.className="drawer-item-icon";
    icon.src="/images/total_level_mastery_icon.png";
    let innerDiv = document.createElement("DIV");
    innerDiv.className="drawer-item-left";
    innerDiv.append(icon);
    //innerDiv.className="monkey";
    innerDiv.innerHTML+="Experience";
    outerDiv.append(innerDiv);
    let css = `
      .McLoot tr {
        padding: 2px;
      }
      .McLoot td {
        padding: 0px;
      }
      .McLoot img {
        margin-left: 10px;
        margin-right: 10px;
      }
    `
    appendCSS(css);
    self.experienceTable = document.createElement("table");
    self.experienceTable.className="McLoot";
    self.experienceTable.style.display = "none";
    self.rowNameDict = {}
    function updateTable(){
      innerDiv.style.borderBottom=(self.experienceTable.style.display=="none")?"2px solid #dee2e6d6":"none";
      self.experienceTable.style.display=(self.experienceTable.style.display=="none")?"block":"none";
    }
    outerDiv.append(self.experienceTable)
    innerDiv.addEventListener("click", updateTable)
    return outerDiv
  }
  updateExperienceTable(self){
    let d = self.getExperienceDiffDict();
    if( !self.rowNameDict ) return;
    for( const [key, value] of Object.entries(d) ){
      if( value > 0 ){
        if( key in self.rowNameDict ){
          let row = self.rowNameDict[key];
          let elements = row.getElementsByTagName("td");
          elements[1].innerText = `${numberWithCommas((value).toFixed(0))} xp/hr`
        } else {
          let row = document.createElement("tr");
          self.experienceTable.append(row)
          self.rowNameDict[key] = row;
          let nameElement = document.createElement("td");
          let sIcon = document.createElement("img");
          sIcon.className="drawer-item-icon";
          sIcon.src = skillIcons[key] || "/images/cooking/butter.png";
          nameElement.append(sIcon);

          let numberElement = document.createElement("td");
          numberElement.innerText = `${numberWithCommas((value).toFixed(0))} xp/hr`
          row.append(nameElement)
          row.append(numberElement)
        }
      } else {
        if( key in self.rowNameDict ){
          self.rowNameDict[key].remove();
          delete self.rowNameDict[key];
        }
      }
    }
  }
  createMarketMenu(self){
    let outerDiv = document.createElement("DIV");
    outerDiv.className="drawer-item active noselect";
    outerDiv.style.height="auto";
    outerDiv.style.display="block";
    let icon = document.createElement("IMG");
    icon.className="drawer-item-icon";
    icon.src="/images/ui/marketplace_icon.png";
    icon.style.filter="drop-shadow(0 0 5px #e39700)drop-shadow(0 0 5px rgba(94,191,255,.5))"
    let innerDiv = document.createElement("DIV");
    innerDiv.className="drawer-item-left";
    innerDiv.append(icon);
    innerDiv.innerHTML+="Economy";
    outerDiv.append(innerDiv);

    // Submenu: Gold, Cooking, Crafting (others?)
    self.marketTable = document.createElement("table");
    self.marketTable.className="McLoot";
    self.marketTable.style.display = "none";
    self.marketDict = {}
    function updateTable(){
      innerDiv.style.borderBottom=(self.marketTable.style.display=="none")?"2px solid #dee2e6d6":"none";
      self.marketTable.style.display=(self.marketTable.style.display=="none")?"block":"none";
    }
    innerDiv.addEventListener("click", updateTable)
    outerDiv.append(self.marketTable)
    return outerDiv
  }
  updateMarketTable(self){
    let d = self.getMarketDict();
    if( !self.marketDict ) return;
    for( const [key, value] of Object.entries(d) ){
      if( value > 0 ){
        if( key in self.marketDict ){
          let row = self.marketDict[key];
          let elements = row.getElementsByTagName("td");
          elements[1].innerText = `${numberWithCommas((value).toFixed(0))} / hr`
        } else {
          let row = document.createElement("tr");
          self.marketTable.append(row);
          self.marketDict[key] = row;
          let nameElement = document.createElement("td");
          let sIcon = document.createElement("img");
          sIcon.className = "drawer-item-icon";
          sIcon.src = skillIcons[key] || "/images/cooking/butter.png";
          nameElement.append(sIcon);

          let numberElement = document.createElement("td");
          numberElement.innerText = `${numberWithCommas((value).toFixed(0))} / hr`
          row.append(nameElement);
          row.append(numberElement);
        }
      } else {
        if( key in self.marketDict ){
          self.marketDict[key].remove();
          delete self.marketDict[key];
        }
      }
    }
  }
  createEssenceMenu(self){
    let outerDiv = document.createElement("DIV");
    outerDiv.className="drawer-item active noselect";
    outerDiv.style.height="auto";
    outerDiv.style.display="block";
    let icon = document.createElement("IMG");
    icon.className="drawer-item-icon";
    icon.src="/images/runecrafting/rune_slate.png";
    icon.style.filter="drop-shadow(0 0 5px #5EBEFF)drop-shadow(0 0 5px rgba(94,191,255,.5))"
    let innerDiv = document.createElement("DIV");
    innerDiv.className="drawer-item-left";
    innerDiv.append(icon);
    innerDiv.innerHTML+="Essence";
    outerDiv.append(innerDiv);
    // Essence Table
    self.essenceTable = document.createElement("table");
    self.essenceTable.className="McLoot";
    self.essenceTable.style.display = "none";
    self.essenceDict = {}
    function updateTable(){
      innerDiv.style.borderBottom=(self.essenceTable.style.display=="none")?"2px solid #dee2e6d6":"none";
      self.essenceTable.style.display=(self.essenceTable.style.display=="none")?"block":"none";
    }
    innerDiv.addEventListener("click", updateTable)
    outerDiv.append(self.essenceTable);
    return outerDiv
  }
  updateEssenceTable(self){
    let d = self.getEssenceDiffDict();
    if( !self.essenceDict ) return;
    for( const [key, value] of Object.entries(d) ){
      if( value > 0 ){
        if( key in self.essenceDict ){
          let row = self.essenceDict[key];
          let elements = row.getElementsByTagName("td");
          elements[1].innerText = `${numberWithCommas((value).toFixed(0))} / hr`
        } else {
          let row = document.createElement("tr");
          self.essenceTable.append(row)
          self.essenceDict[key] = row;
          let nameElement = document.createElement("td");
          let sIcon = document.createElement("img");
          sIcon.className="drawer-item-icon";
          sIcon.src = skillIcons[key] || "/images/cooking/butter.png";
          nameElement.append(sIcon);

          let numberElement = document.createElement("td");
          numberElement.innerText = `${numberWithCommas((value).toFixed(0))} / hr`
          row.append(nameElement)
          row.append(numberElement)
        }
      } else {
        if( key in self.essenceDict ){
          self.essenceDict[key].remove();
          delete self.essenceDict[key];
        }
      }
    }
  }
  resetStats(self){
    self.initExperience = {...self.experience};
    self.initMasteryExperience = {...self.masteryExperience};
    self.initEssence = {...self.essence};
    self.initExperienceTimer = Date.now();
    self.gold=0
    self.cook=0
    self.updateXPSTAT()
  }
  updateXPSTAT(){
    this.updateExperienceTable(this)
    this.updateMarketTable(this)
    this.updateEssenceTable(this)
  }
  getMarketDict(){
    let now = Date.now() - this.initExperienceTimer;
    return {gold: this.gold / now * 3.6e6, cooking: this.cook/now*3.6e6, crafting: 0};
  }
  getExperienceDiff(stat){
    let now = Date.now() - this.initExperienceTimer;
    try {
      let delta = this.experience[stat] - this.initExperience[stat]
      delta += this.masteryExperience[stat] - this.initMasteryExperience[stat]
      let xph = numberWithCommas((delta/now * 3600 * 1000).toFixed(0))
      return xph
    } catch {}
    return ''
  }
  getExperienceDiffDict(){
    let now = Date.now() - this.initExperienceTimer;
    let xpdict = {};
    for( const [stat, value] of Object.entries(this.experience) ){
      let delta = value - this.initExperience[stat]
      delta += this.masteryExperience[stat] - this.initMasteryExperience[stat]
      let xph = delta/now * 3600 * 1000
      xpdict[stat] = xph
    }
    return xpdict
  }
  getEssenceDiffDict(){
    let now = Date.now() - this.initExperienceTimer;
    let edict = {};
    for( const [stat, value] of Object.entries(this.essence) ){
      let delta = value - this.initEssence[stat]
      let xph = delta/now * 3600 * 1000
      edict[stat] = xph
    }
    return edict
  }
}