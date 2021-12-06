class PlayerData {
  constructor(monkey, options){
    this.monkey = monkey;
    this.options = options;
    this.classname = "PlayerData"
    this.enchantments = {};
    this.buffs = {};
    this.combatBuffs = {};
    this.globals = {};
    this.combatStats = {};
    this.skills = {};
    this.mastery = {};
    this.experience = {};
    this.masteryExperience = {};
    this.initExperience = {};
    this.initMasteryExperience = {};
    this.initExperienceTimer = Date.now();
    this.tools = {};
    this.stockpile = {};
    this.combatInventory = {};
    this.itemids = {};
    getJSON("https://raw.githubusercontent.com/holychikenz/ISMonkey/main/data/items.json").then(
      data => this.itemids = data);
    this.enchants = {};
    getJSON("https://raw.githubusercontent.com/holychikenz/ISMonkey/main/data/enchantments.json").then(
      data => this.enchants = data);
    this.initPlayer();
  }
  initPlayer(){
  }
  run(obj, msg){
    // TODO: Find combatStats and toolBoosts
    if( msg[0] === "update player" ){
      let portion = msg[1].portion;
      let value = msg[1].value;
      if( portion == "all" ){
        // Set buffs
        for(let ec in value.buffs){ this.buffs[this.enchants[value.buffs[ec].enchantmentID]] = value.buffs[ec].enchantmentStrength; }
        for(let ec in value.combatBuffs){ this.combatBuffs[this.enchants[value.combatBuffs[ec].enchantmentID]] = value.combatBuffs[ec].enchantmentStrength; }
        for(let ec in value.activeEnchantments){ this.enchantments[this.enchants[value.activeEnchantments[ec].enchantmentID]] = value.activeEnchantments[ec].enchantmentStrength; }
        this.combatStats = value.combatStats;
        for(let ec in value.skills){this.skills[ec] = value.skills[ec].level;}
        for(let ec in value.skills){this.experience[ec] = value.skills[ec].experience;}
        for(let ec in value.skills){this.masteryExperience[ec] = value.skills[ec].masteryExperience;}
        this.initExperience = {...this.experience};
        this.initMasteryExperience = {...this.masteryExperience};
        this.initExperienceTimer = Date.now();
        for(let ec in value.skills){this.mastery[ec] = value.skills[ec].masteryLevel;}
        this.tools = value.toolBoosts;
        // Set Items
        for(let ec of value.stockpile){
          this.stockpile[this.itemids[ec.itemID]] = ec.stackSize;
        }
        for(let ec of value.combatInventory){
          this.combatInventory[ec.id] = ec;
        }
        // Who Am I
        this.username = value.username;
      } else {
        // Update State -- Enchants/buffs
        if( portion.includes("activeEnchantments") ){
          this.enchantments = {};
          for(let ec in value){
            this.enchantments[this.enchants[value[ec].enchantmentID]] = value[ec].enchantmentStrength;
          }
        }
        if( portion.includes("buffs") ){
          this.buffs = {};
          for(let ec in value){
            this.buffs[this.enchants[value[ec].enchantmentID]] = value[ec].enchantmentStrength;
          }
        }
        if( portion.includes("combatBuffs") ){
          this.combatBuffs = {};
          for(let ec in value){
            this.combatBuffs[this.enchants[value[ec].enchantmentID]] = value[ec].enchantmentStrength;
          }
        }
        // Fite
        if( portion.includes("combatStats") ){
          if( portion.length == 1 )
          {
            for(let ec in value){
              this.combatStats[ec] = value[ec];
            }
          }
        }
        // Skills and tools
        if( portion.includes("skills") ){
          let aSkill = portion[1];
          this.skills[aSkill] = value.level;
          this.experience[aSkill] = value.experience;
          this.masteryExperience[aSkill] = value.masteryExperience;
          this.mastery[aSkill] = value.masteryLevel;
        }
        if( portion.includes("toolBoosts") ){
          this.tools = value;
        }
        if( portion.includes("actionQue") ) {
          this.currentAction = value[0];
          this.initExperience = {...this.experience};
          this.initMasteryExperience = {...this.masteryExperience};
          this.initExperienceTimer = Date.now();
          //console.log("Reset Init")
        }
      }
    }
    if( msg[0] === "set globals" ){
      let globalBuffs = msg[1].buffs;
      this.globals = {};
      for(let ec in globalBuffs){
        this.globals[this.enchants[globalBuffs[ec].enchantmentID]] = globalBuffs[ec].enchantmentStrength;
      }
    }
    if( msg[0] === "update inventory" ){
      let itemdelta = msg[1].item
      if( msg[1].inventory === "stockpile" ){
        this.stockpile[ this.itemids[itemdelta.itemID] ] = itemdelta.stackSize;
      }
      if( msg[1].inventory === "combatInventory" ){
        if( msg[1].action === "delete" ){
          delete this.combatInventory[ itemdelta.id ];
        }
        else {
          this.combatInventory[itemdelta.id] = itemdelta;
        }
      }
    }
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
  getBuffStrength(buff){
    var totalBuff = parseInt(get(this.enchantments, buff, 0)) + parseInt(get(this.buffs, buff, 0)) + parseInt(get(this.combatBuffs, buff, 0)) + parseInt(get(this.globals, buff, 0));
    return totalBuff;
  }
  getEffectiveLevel(skill){
    var totalLevel = parseInt(get(this.skills, skill, 1)) + parseInt(get(this.tools, skill, 0)) + parseInt(get(this.mastery, skill, 0));
    return totalLevel;
  }
  getItemStackSize(itm){
    return parseInt(get(this.stockpile, itm, 0));
  }
  getCombatInventoryCount(){
    return Object.keys(this.combatInventory).length;
  }
}
