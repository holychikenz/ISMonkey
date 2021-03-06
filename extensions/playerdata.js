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
    this.tools = {};
    this.stockpile = {};
    this.combatInventory = {};
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
        // Set Items
        for(let ec of value.stockpile){
          this.stockpile[itemids[ec.itemID]] = ec.stackSize;
        }
        for(let ec of value.combatInventory){
          this.combatInventory[ec.id] = ec;
        }
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
    if( msg[0] === "update inventory" ){
      let itemdelta = msg[1].item
      if( msg[1].inventory === "stockpile" ){
        this.stockpile[ itemids[itemdelta.itemID] ] = itemdelta.stackSize;
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
  getBuffStrength(buff){
    var totalBuff = get(this.enchantments, buff, 0) + get(this.buffs, buff, 0) + get(this.combatBuffs, buff, 0) + get(this.globals, buff, 0);
    return totalBuff;
  }
  getEffectiveLevel(skill){
    var totalLevel = get(this.skills, skill, 1) + get(this.tools, skill, 0) + get(this.mastery, skill, 0);
    return totalLevel;
  }
  getItemStackSize(itm){
    return get(this.stockpile, itm, 0);
  }
  getCombatInventoryCount(){
    return Object.keys(this.combatInventory).length;
  }
}

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

const itemids = {
  1:"Gold",
  2:"Heat",
  3:"Air Essence",
  4:"Earth Essence",
  5:"Fire Essence",
  6:"Water Essence",
  7:"Blood Essence",
  8:"Death Essence",
  9:"Chaos Essence",
  10:"Nature Essence",
  11:"Mind Essence",
  12:"Cosmic Essence",
  50:"Book",
  60:"Raw Shrimp",
  61:"Raw Anchovy",
  62:"Raw Trout",
  63:"Raw Salmon",
  64:"Raw Lobster",
  65:"Raw Tuna",
  66:"Raw Shark",
  95:"Burnt Fish",
  96:"Burnt Food",
  101:"Copper Ore",
  102:"Tin Ore",
  103:"Iron Ore",
  104:"Gold Ore",
  105:"Mithril Ore",
  106:"Adamantite Ore",
  107:"Runite Ore",
  108:"Clay",
  109:"Stone",
  110:"Sand",
  111:"Silver",
  112:"Coal",
  113:"Rune Slate",
  114:"Stygian Ore",
  150:"Fertilizer",
  151:"Carrot Seed",
  152:"Peppercorn Seed",
  153:"Sugarcane Seed",
  154:"Wheat Seed",
  155:"Potato Seed",
  156:"Rice Seed",
  157:"Tomato Seed",
  158:"Wildberry Bush Seed",
  159:"Chili Pepper Seed",
  160:"Pumpkin Seed",
  161:"Mushroom Spore",
  170:"Tree Seed",
  171:"Oak Tree Seed",
  172:"Willow Tree Seed",
  173:"Maple Tree Seed",
  174:"Yew Tree Seed",
  175:"Banana Tree Seed",
  176:"Apple Tree Seed",
  177:"Elder Tree Seed",
  180:"Sageberry Bush Seed",
  185:"Mysterious Seed",
  201:"Bronze Bar",
  202:"Iron Bar",
  203:"Gold Bar",
  204:"Mithril Bar",
  205:"Adamantite Bar",
  206:"Runite Bar",
  207:"Stygian Bar",
  301:"Branch",
  302:"Log",
  303:"Oak Log",
  304:"Willow Log",
  305:"Maple Log",
  306:"Yew Log",
  400:"Sapphire",
  401:"Emerald",
  402:"Ruby",
  403:"Diamond",
  404:"Black Opal",
  500:"Air Talisman",
  501:"Earth Talisman",
  502:"Fire Talisman",
  503:"Water Talisman",
  504:"Blood Talisman",
  505:"Death Talisman",
  506:"Chaos Talisman",
  507:"Nature Talisman",
  508:"Mind Talisman",
  509:"Cosmic Talisman",
  510:"Air Rune",
  511:"Earth Rune",
  512:"Fire Rune",
  513:"Water Rune",
  514:"Blood Rune",
  515:"Death Rune",
  516:"Chaos Rune",
  517:"Nature Rune",
  518:"Mind Rune",
  519:"Cosmic Rune",
  600:"Bronze Pickaxe",
  601:"Iron Pickaxe",
  602:"Mithril Pickaxe",
  603:"Adamantite Pickaxe",
  604:"Runite Pickaxe",
  605:"Stygian Pickaxe",
  610:"Bronze Hatchet",
  611:"Iron Hatchet",
  612:"Mithril Hatchet",
  613:"Adamantite Hatchet",
  614:"Runite Hatchet",
  615:"Stygian Hatchet",
  620:"Sapphire Ring",
  621:"Sapphire Necklace",
  622:"Emerald Ring",
  623:"Emerald Necklace",
  624:"Ruby Ring",
  625:"Ruby Necklace",
  626:"Diamond Ring",
  627:"Diamond Necklace",
  628:"Prismatic Necklace",
  629:"Prismatic Ring",
  630:"Black Opal Ring",
  631:"Black Opal Necklace",
  640:"Gold Ring",
  641:"Gold Necklace",
  660:"Bronze Hoe",
  661:"Iron Hoe",
  662:"Mithril Hoe",
  663:"Adamantite Hoe",
  664:"Runite Hoe",
  665:"Stygian Hoe",
  690:"Fishing Net",
  691:"Fly Fishing Rod",
  692:"Cage",
  693:"Harpoon",
  700:"Feather",
  701:"Fish Oil",
  702:"Pyre Log",
  703:"Pyre Oak Log",
  704:"Pyre Willow Log",
  705:"Pyre Maple Log",
  706:"Pyre Yew Log",
  800:"Ichor",
  900:"Geode",
  901:"Bird's Nest",
  902:"Sunken Treasure",
  903:"Satchel",
  1000:"Bronze Scimitar",
  1001:"Bronze Battleaxe",
  1002:"Bronze Daggers",
  1003:"Bronze Greatsword",
  1004:"Iron Scimitar",
  1005:"Iron Battleaxe",
  1006:"Iron Daggers",
  1007:"Iron Greatsword",
  1008:"Obsidian Scimitar",
  1009:"Obsidian Battleaxe",
  1010:"Obsidian Daggers",
  1011:"Obsidian Greatsword",
  1012:"Mithril Scimitar",
  1013:"Mithril Battleaxe",
  1014:"Mithril Daggers",
  1015:"Mithril Greatsword",
  1016:"Adamantite Scimitar",
  1017:"Adamantite Battleaxe",
  1018:"Adamantite Daggers",
  1019:"Adamantite Greatsword",
  1020:"Runite Scimitar",
  1021:"Runite Battleaxe",
  1022:"Runite Daggers",
  1023:"Runite Greatsword",
  1024:"Stygian Scimitar",
  1025:"Stygian Battleaxe",
  1026:"Stygian Daggers",
  1027:"Stygian Greatsword",
  1050:"Bronze Helm",
  1051:"Iron Helm",
  1052:"Obsidian Helm",
  1053:"Mithril Helm",
  1054:"Adamantite Helm",
  1055:"Runite Helm",
  1056:"Stygian Helm",
  1060:"Bronze Full Helm",
  1061:"Iron Full Helm",
  1062:"Obsidian Full Helm",
  1063:"Mithril Full Helm",
  1064:"Adamantite Full Helm",
  1065:"Runite Full Helm",
  1066:"Stygian Full Helm",
  1070:"Bronze Shield",
  1071:"Iron Shield",
  1072:"Obsidian Shield",
  1073:"Mithril Shield",
  1074:"Adamantite Shield",
  1075:"Runite Shield",
  1076:"Stygian Shield",
  1090:"Bronze Breastplate",
  1091:"Bronze Chainmail",
  1092:"Iron Breastplate",
  1093:"Iron Chainmail",
  1094:"Obsidian Breastplate",
  1095:"Obsidian Chainmail",
  1096:"Mithril Breastplate",
  1097:"Mithril Chainmail",
  1098:"Adamantite Breastplate",
  1099:"Adamantite Chainmail",
  1100:"Runite Breastplate",
  1101:"Runite Chainmail",
  1102:"Stygian Breastplate",
  1103:"Stygian Chainmail",
  1110:"Bronze Plate Leggings",
  1111:"Iron Plate Leggings",
  1112:"Obsidian Plate Leggings",
  1113:"Mithril Plate Leggings",
  1114:"Adamantite Plate Leggings",
  1115:"Runite Plate Leggings",
  1116:"Stygian Plate Leggings",
  1130:"Bronze Boots",
  1131:"Iron Boots",
  1132:"Obsidian Boots",
  1133:"Mithril Boots",
  1134:"Adamantite Boots",
  1135:"Runite Boots",
  1136:"Stygian Boots",
  1150:"Bronze Gloves",
  1151:"Iron Gloves",
  1152:"Obsidian Gloves",
  1153:"Mithril Gloves",
  1154:"Adamantite Gloves",
  1155:"Runite Gloves",
  1156:"Stygian Gloves",
  1500:"Santa Hat",
  1501:"Snowman Head",
  1502:"Tophat",
  1503:"Lesser Ladle",
  1504:"Ladle",
  1505:"Greater Ladle",
  1506:"Moss Maul",
  1507:"Modified Diving Gloves",
  1508:"King's Crown",
  1509:"Fire Orb",
  1510:"Kalanahmatti",
  1511:"Shard of Kalanahmatti",
  1512:"Zero Edge",
  1513:"Crest of Chaos",
  1514:"Forgotten Soul",
  1515:"Forgotten Soul",
  1516:"Forgotten Soul",
  1517:"Gargoyle Chainmail",
  1518:"Gargoyle Legs",
  1519:"Gargoyle Boots",
  1520:"Gargoyle Helm",
  1521:"Gargoyle Shield",
  1522:"Gargoyle Falchion",
  1523:"Gargoyle Daggers",
  1524:"Gargoyle Glaive",
  1525:"Infernal Lance",
  1526:"Black Knight Great Helm",
  1527:"Chorus of Souls",
  1530:"Mysterious Man",
  1531:"Corny Joke",
  1532:"Death Metal Wig",
  1540:"Shrimp Carapace",
  1541:"Shrimp Greaves",
  1542:"Shrimp Helm",
  1543:"Shrimp Shell",
  1600:"Scroll",
  1601:"Scroll of Embers",
  1602:"Scroll of the Prospector",
  1603:"Scroll of the Scholar",
  1604:"Scroll of Gathering",
  1605:"Scroll of Superheating",
  1606:"Scroll of Pyromancy",
  1607:"Scroll of Wealth",
  1608:"Scroll of Haste",
  1609:"Scroll of Naturalist",
  1610:"Scroll of Acrobatics",
  1611:"Scroll of Critical Strike",
  1612:"Scroll of Poisoning",
  1613:"Scroll of Accuracy",
  1614:"Scroll of Deflect",
  1615:"Scroll of Force",
  1616:"Scroll of Healing",
  1617:"Scroll of Weakening",
  1618:"Scroll of Reinforcement",
  1619:"Scroll of Protection",
  1620:"Scroll of Counterattack",
  1621:"Scroll of Recklessness",
  1622:"Scroll of Efficiency",
  1623:"Scroll of Fishing",
  1624:"Scroll of Cooking",
  1625:"Scroll of Crafting",
  1626:"Scroll of Refining",
  1627:"Scroll of Runecrafting",
  1628:"Scroll of Chances",
  1629:"Scroll of the Shrimp Lord",
  1630:"Scroll of Enlightenment",
  1631:"Scroll of Prolonging",
  1632:"Scroll of the Treasure Hunter",
  1633:"Scroll of Inferno",
  1634:"Scroll of Destructive Testing",
  1635:"Scroll of Nature",
  1636:"Scroll of Root Digging",
  1637:"Scroll of Patience",
  1638:"Scroll of Overhealing",
  1639:"Scroll of Farming",
  1640:"Scroll of the Gold Digger",
  1641:"Scroll of Fertilizing",
  1642:"Scroll of Cultivation",
  2000:"Raw Chicken",
  2001:"Raw Beef",
  2009:"Spider Legs",
  2010:"Goblin Brain",
  2012:"Pepper",
  2013:"Salt",
  2014:"Ashes",
  2015:"Sugar",
  2016:"Honey",
  2017:"Milk",
  2018:"Butter",
  2019:"Egg",
  2020:"Mushroom",
  2021:"Carrot",
  2022:"Chili Pepper",
  2023:"Potato",
  2024:"Pumpkin",
  2025:"Tomato",
  2026:"Apple",
  2027:"Wildberry",
  2028:"Banana",
  2029:"Wheat",
  2030:"Rice",
  2031:"Sageberry",
  2100:"Questionable Food",
  2101:"Monster Surprise",
  2102:"Seared Steak",
  2103:"Seared Fish",
  2104:"Seared Poultry",
  2105:"Birdie Pasta",
  2106:"Spaghetti & Meat",
  2107:"Sushi",
  2108:"Birdie Pie",
  2109:"Cottage Pie",
  2110:"Fisherman's Pie",
  2111:"Fruit Pie",
  2112:"Demon Cake",
  2113:"Cake",
  2114:"Fruit Cake",
  2115:"Grain Cake",
  2116:"Omelette",
  2117:"Monster Omelette",
  2118:"Meaty Omelette",
  2119:"Veggie Crepe",
  2120:"Fruity Crepe",
  2121:"Eggnog",
  2122:"Meat Roast",
  2123:"Fried Fruit",
  2124:"Grilled Veggies",
  2125:"Kebabs",
  2126:"Candied Fruit",
  2127:"Milkshake",
  2128:"Vegetable Stew",
  2129:"Meaty Stew",
  2130:"Monster Stew",
  2131:"Jerky",
  2132:"Pudding",
  2133:"Ice Cream",
  2134:"Monster Curry",
  2135:"Birdie Curry",
  2136:"Beast Curry",
  2137:"Seafood Curry",
  2138:"Monster Gelato",
  5000:"Shrimp Bauble",
  5001:"Shrimp",
  5002:"Shrimp Ascendant",
  6000:"Gold Medal",
  6001:"Silver Medal",
  6002:"Bronze Medal",
  7000:"Snow",
  7001:"Snowball",
  7002:"Wrapping Paper",
  7003:"Present",
  7004:"Cookie Dough",
  7005:"Cookie",
  7006:"Gummy Fish",
  7007:"Gummy Shark Fin",
  7008:"Krampus' Horn",
  7009:"Candy Buttons",
  7010:"Scarf",
  7011:"Evergreen Log",
  7012:"Corrupted Evergreen Log",
  7013:"Magic Ice",
  7014:"Inferior Bearded Wanderer",
  7015:"Inferior Reindeer Hunters' Armor",
  7016:"Inferior Reindeer Hunters' Leggings",
  7017:"Inferior Christmas Lights",
  7018:"SuperSled 1337",
  7019:"Bearded Wanderer",
  7020:"Reindeer Hunters' Armor",
  7021:"Reindeer Hunters' Leggings",
  7022:"Christmas Lights",
  7023:"SuperSled 9000",
  7024:"Superior Bearded Wanderer",
  7025:"Superior Reindeer Hunters' Armor",
  7026:"Superior Reindeer Hunters' Leggings",
  7027:"Superior Christmas Lights",
  7028:"SuperSled 9001",
  7029:"Magical Snowball",
  7030:"Candy Cane Daggers",
  7031:"Festive Shroud",
  7050:"Snowglobe"
};
