const enchants = {
  0: "",
  1: "Embers",
  2: "Prospector",
  3: "Scholar",
  4: "Gathering",
  5: "Superheating",
  6: "Pyromancy",
  7: "Wealth",
  8: "Haste",
  9: "Naturalist",
  10: "Acrobatics",
  11: "Critical Strike",
  12: "Poisoning",
  13: "Accuracy",
  14: "Deflect",
  15: "Force",
  16: "Healing",
  17: "Weakening",
  18: "Reinforcement",
  19: "Protection",
  20: "Counterattack",
  21: "Recklessness",
  22: "Efficiency",
  23: "Fishing",
  24: "Cooking",
  25: "Crafting",
  26: "Refining",
  27: "Runecrafting",
  28: "Chances",
  29: "Shrimp Lord",
  30: "Enlightenment",
  31: "Prolonging",
  32: "Treasure Hunter",
  33: "Inferno",
  34: "Destructive Testing",
  35: "Nature",
  36: "Root Digging",
  37: "Patience",
  38: "Overhealing",
  39: "Farming",
  40: "Gold Digger",
  41: "Fertilizing",
  42: "Cultivation",
  1000: "Impenetrable Defense",
  2000: "Nimble",
  2001: "Demon Skin",
  2002: "Intuition",
  5000: "schfftph fzzz",
  7000: "Christmas Spirit"
}


class PlayerData {
  constructor(monkey, options){
    this.monkey = monkey;
    this.options = options;
    this.enchantments = {};
    this.buffs = {};
    this.combatBuffs = {};
    this.globals = {};
    this.combatStats = {};
    this.skills = {};
    this.mastery = {};
    this.tools = {};
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
        for(let ec in value.buffs){ this.buffs[enchants[value.buffs[ec].enchantmentID]] = value.buffs[ec].enchantmentStrength; }
        for(let ec in value.combatBuffs){ this.combatBuffs[enchants[value.combatBuffs[ec].enchantmentID]] = value.combatBuffs[ec].enchantmentStrength; }
        for(let ec in value.activeEnchantments){ this.enchantments[enchants[value.activeEnchantments[ec].enchantmentID]] = value.activeEnchantments[ec].enchantmentStrength; }
        this.combatStats = value.combatStats;
        for(let ec in value.skills){this.skills[ec] = value.skills[ec].level;}
        for(let ec in value.skills){this.mastery[ec] = value.skills[ec].masteryLevel;}
        this.tools = value.toolBoosts;
      } else {
        // Update State -- Enchants/buffs
        if( portion.includes("activeEnchantments") ){
          this.enchantments = {};
          for(let ec in value){
            this.enchantments[enchants[value[ec].enchantmentID]] = value[ec].enchantmentStrength;
          }
        }
        if( portion.includes("buffs") ){
          this.buffs = {};
          for(let ec in value){
            this.buffs[enchants[value[ec].enchantmentID]] = value[ec].enchantmentStrength;
          }
        }
        if( portion.includes("combatBuffs") ){
          this.combatBuffs = {};
          for(let ec in value){
            this.combatBuffs[enchants[value[ec].enchantmentID]] = value[ec].enchantmentStrength;
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
          this.mastery[aSkill] = value.masteryLevel;
        }
        if( portion.includes("toolBoosts") ){
          this.tools = value;
        }
      }
    }
    if( msg[0] === "set globals" ){
      let globalBuffs = msg[1].buffs;
      this.globals = {};
      for(let ec in globalBuffs){
        this.globals[enchants[globalBuffs[ec].enchantmentID]] = globalBuffs[ec].enchantmentStrength;
      }
    }
  }
  getBuffStrength(buff){
    var totalBuff = get(this.enchantments, buff, 0) + get(this.buffs, buff, 0) + get(this.combatBuffs, buff, 0) + get(this.globals, buff, 0);
    return totalBuff;
  }
  getEffectiveLevel(skill){
    var totalLevel = get(this.skills, skill, 1) + get(this.tools, skill, 0) + get(this.mastery, skill, 0);
    return totalLevel;
  }
}
