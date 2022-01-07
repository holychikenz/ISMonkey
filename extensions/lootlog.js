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
  "total": "/images/total_level.png",
}

class Lootlog{
  constructor(monkey, options){
    this.monkey = monkey;
    this.options = options;
    this.classname = "Lootlog";
    this.xpstat = document.createElement("span")
    this.experience = {}
    this.initExperience = {}
    this.masteryExperience = {}
    this.masteryInitExperience = {}
    this.initExperienceTimer = Date.now();
    this.xpstat.addEventListener("dblclick", ()=>this.resetStats(this))
    this.gold = 0
    this.cook = 0
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
    })
  }
  run(obj, msg){
    let call = msg[0];
    let message = msg[1];
    if( call === "update player" ){
      let portion = message.portion;
      let value = message.value;
      if( portion == "all" ){
        // Set buffs
        for(let ec in value.skills){this.experience[ec] = value.skills[ec].experience;}
        for(let ec in value.skills){this.masteryExperience[ec] = value.skills[ec].masteryExperience;}
        this.initExperience = {...this.experience};
        this.initMasteryExperience = {...this.masteryExperience};
        this.initExperienceTimer = Date.now();
      } else {
        // Skills and tools
        if( portion.includes("skills") ){
          let aSkill = portion[1];
          this.experience[aSkill] = value.experience;
          this.masteryExperience[aSkill] = value.masteryExperience;
        }
        if( portion.includes("actionQue") ) {
          //this.initExperience = {...this.experience};
          //this.initMasteryExperience = {...this.masteryExperience};
          //this.initExperienceTimer = Date.now();
        }
      }
      this.updateXPSTAT();
    }
    if( call === "lootlog loot" ){
      let loot = message.loot
      let name = loot[0]
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
    }
  }
  buildUI(self, promise){
    promise = promise || new Promise(() => {});
    const targetNodeHolder = document.getElementsByClassName("nav-drawer");
    if(targetNodeHolder.length > 0) {
      promise.then();
    }
    else {
      setTimeout(function(){self.buildUI(self, promise);
                 }, 1000 );
      return false;
    }
    const targetNode = targetNodeHolder[0];
    const config = {attributes: true, childList: true, subtree: true };
    // Callback function to execute when mutations are observed
    self.constructMenu(self);
  }
  constructMenu(self){
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
    self.completeButton = resetButton.cloneNode();
    self.completeButton.innerText = "Reset"
    self.completeButton.onclick = ()=>resetButton.click();
    resetButton.style.display="none";
    let timedReset = document.createElement("div");
    self.completeButton.style.float="left";
    self.completeButton.style.marginLeft="20px";
    self.completeButton.style.width="100px";
    timedReset.style.display="inline-grid";
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

    let drawerCat = document.createElement("div");
    drawerCat.className="drawer-category";
    drawerCat.innerHTML="<b>Looty McLootface</b>";
    // LuteNameThing
    // + Loot
    // .. + Nodes
    // + Experience
    // .. - Skill
    // + Essence?
    // + Cooking
    // + Crafting?
    // Reset
    for( let i=0; i < container.children.length; i++ ){
      if( container.children[i].innerText.indexOf("Loot Log")>-1 ){
        // Append in reverse order -.-
        container.insertBefore(timedReset, container.children[i+1]);
        container.insertBefore(essence, container.children[i+1]);
        container.insertBefore(xpMenu, container.children[i+1]);
        container.insertBefore(lootMenu, container.children[i+1]);
        container.insertBefore(drawerCat, container.children[i+1]);
        // remove Loot Log
        container.children[i].remove();
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
        padding-right: 25px;
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
      }
      .nav-drawer:hover {
        overflow: overlay;
      }
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
        padding: 5px;
      }
    `
    appendCSS(css);
    self.experienceTable = document.createElement("table");
    self.experienceTable.className="McLoot";
    self.experienceTable.style.display = "none";
    self.rowNameDict = {}
    function updateTable(){
      self.experienceTable.style.display=(self.experienceTable.style.display=="none")?"block":"none";
    }
    outerDiv.append(self.experienceTable)
    //   let itemLogMenu = document.getElementsByClassName("item-log-window")[0];
    //   //let itemLogMenu = document.createElement("DIV");
    //   //itemLogMenu.className="item-log-window";
    //   itemLogMenu.style.display="none";
    //   outerDiv.append(itemLogMenu);
    //   // itemLogMenu can be modified, so should be exposed to the class
    //   self.LootItemLog = itemLogMenu;
    //   //outerDiv.addEventListener("click", ()=>{self.LootItemLog.display= (self.LootItemLog.display == "none") ? "block" : "none";})
    //   function toggleDisplay(){
    //     console.log(itemLogMenu.style.display);
    //     itemLogMenu.style.display=(itemLogMenu.style.display=="none")?"block":"none";
    //   }
    innerDiv.addEventListener("click", updateTable)
    return outerDiv
  }
  updateExperienceTable(self){
    let d = self.getExperienceDiffDict();
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
    //innerDiv.className="monkey";
    innerDiv.innerHTML+="Essence";
    outerDiv.append(innerDiv);
    return outerDiv
  }
  resetStats(self){
    self.initExperience = {...self.experience};
    self.initMasteryExperience = {...self.masteryExperience};
    self.initExperienceTimer = Date.now();
    self.gold=0
    self.cook=0
    console.log("reset")
  }
  updateXPSTAT(){
    let tabset = document.getElementsByClassName("nav-tab-left")
    if( tabset.length > 0 ){
      let tab = tabset[0]
      let spacer = document.getElementsByClassName("nav-tab-spacer")[0]
      if( typeof(tab) !== undefined ){
        let name = (tab.innerText.split(":")[0]).toLowerCase()
        if( name === "combat" ){
          name = "constitution"
        }
        let xph = this.getExperienceDiff(name)
        let gph = numberWithCommas((this.gold / (Date.now() - this.initExperienceTimer)*3.6e6).toFixed(0))
        let cph = numberWithCommas((this.cook / (Date.now() - this.initExperienceTimer)*3.6e6).toFixed(0))
        spacer.append(this.xpstat)
        //tab.append(this.xpstat)
        this.xpstat.innerText = `${xph} xp/hr >> ${gph} gp/hr >> ${cph} cook/hr`
      }
    }
    this.updateExperienceTable(this)
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
}
