// helper functions
function unique(obj) {
  return obj.filter((v,i,a)=>a.indexOf(v) === i)
};

const allTags = ['fruit', 'vegetable', 'grain', 'dairy', 'egg', 'meat', 'beast',
         'poultry', 'fish', 'monster', 'spice', 'sweetener', 'preservative'];
const foods = {
  "milk": {
    "exp": 5,
    "size": 1,
    "heat": 5,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 1,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "egg": {
    "exp": 5,
    "size": 1,
    "heat": 5,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 1,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "raw anchovy": {
    "exp": 5,
    "size": 1,
    "heat": 5,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 1,
    "beast": 0,
    "poultry": 0,
    "fish": 1,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "raw shrimp": {
    "exp": 5,
    "size": 1,
    "heat": 5,
    "buff": "shrimp lord",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 1,
    "beast": 0,
    "poultry": 0,
    "fish": 1,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "banana": {
    "exp": 5,
    "size": 1,
    "heat": 5,
    "buff": "gathering",
    "fruit": 1,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 1,
    "preservative": 0
  },
  "wildberry": {
    "exp": 10,
    "size": 1,
    "heat": 5,
    "buff": "",
    "fruit": 1,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 1,
    "preservative": 0
  },
  "sageberry": {
    "exp": 25,
    "size": 1,
    "heat": 25,
    "buff": "intuition",
    "fruit": 1,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 1,
    "preservative": 0
  },
  "wheat": {
    "exp": 10,
    "size": 1,
    "heat": 5,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 1,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "ichor": {
    "exp": 20,
    "size": 1,
    "heat": 5,
    "buff": "demon skin",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 1,
    "spice": 1,
    "sweetener": 0,
    "preservative": 0
  },
  "pepper": {
    "exp": 5,
    "size": 1,
    "heat": 5,
    "buff": "inferno",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 1,
    "sweetener": 0,
    "preservative": 0
  },
  "salt": {
    "exp": 5,
    "size": 1,
    "heat": 5,
    "buff": "cooking",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 1,
    "sweetener": 0,
    "preservative": 1
  },
  "sugar": {
    "exp": 5,
    "size": 1,
    "heat": 5,
    "buff": "efficiency",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 1,
    "sweetener": 1,
    "preservative": 0
  },
  "carrot": {
    "exp": 5,
    "size": 1,
    "heat": 5,
    "buff": "",
    "fruit": 0,
    "vegetable": 1,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "mushroom": {
    "exp": 15,
    "size": 1,
    "heat": 5,
    "buff": "nature",
    "fruit": 0,
    "vegetable": 1,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "raw salmon": {
    "exp": 10,
    "size": 2,
    "heat": 10,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 1,
    "beast": 0,
    "poultry": 0,
    "fish": 1,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "raw trout": {
    "exp": 10,
    "size": 2,
    "heat": 10,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 1,
    "beast": 0,
    "poultry": 0,
    "fish": 1,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "apple": {
    "exp": 5,
    "size": 2,
    "heat": 10,
    "buff": "",
    "fruit": 1,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 1,
    "preservative": 0
  },
  "tomato": {
    "exp": 10,
    "size": 2,
    "heat": 10,
    "buff": "",
    "fruit": 1,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "rice": {
    "exp": 10,
    "size": 2,
    "heat": 10,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 1,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "raw beef": {
    "exp": 5,
    "size": 2,
    "heat": 10,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 1,
    "beast": 1,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "raw chicken": {
    "exp": 5,
    "size": 2,
    "heat": 10,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 1,
    "beast": 0,
    "poultry": 1,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "goblin brain": {
    "exp": 10,
    "size": 2,
    "heat": 10,
    "buff": "runecrafting",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 1,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "chili pepper": {
    "exp": 10,
    "size": 2,
    "heat": 10,
    "buff": "superheated",
    "fruit": 0,
    "vegetable": 1,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "potato": {
    "exp": 10,
    "size": 2,
    "heat": 10,
    "buff": "",
    "fruit": 0,
    "vegetable": 1,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "butter": {
    "exp": 15,
    "size": 3,
    "heat": 15,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 1,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "raw lobster": {
    "exp": 15,
    "size": 3,
    "heat": 15,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 1,
    "beast": 0,
    "poultry": 0,
    "fish": 1,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "raw tuna": {
    "exp": 15,
    "size": 3,
    "heat": 20,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 1,
    "beast": 0,
    "poultry": 0,
    "fish": 1,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "ashes": {
    "exp": 15,
    "size": 3,
    "heat": 15,
    "buff": "pyromancy",
    "fruit": 0,
    "vegetable": 0,
    "grain": 1,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 1,
    "sweetener": 0,
    "preservative": 0
  },
  "honey": {
    "exp": 15,
    "size": 3,
    "heat": 15,
    "buff": "fishing",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 1,
    "sweetener": 1,
    "preservative": 0
  },
  "pumpkin": {
    "exp": 15,
    "size": 3,
    "heat": 15,
    "buff": "",
    "fruit": 0,
    "vegetable": 1,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 0,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "raw shark": {
    "exp": 20,
    "size": 4,
    "heat": 20,
    "buff": "",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 1,
    "beast": 0,
    "poultry": 0,
    "fish": 1,
    "monster": 0,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  },
  "spider legs": {
    "exp": 20,
    "size": 4,
    "heat": 20,
    "buff": "nimble",
    "fruit": 0,
    "vegetable": 0,
    "grain": 0,
    "dairy": 0,
    "egg": 0,
    "meat": 1,
    "beast": 0,
    "poultry": 0,
    "fish": 0,
    "monster": 1,
    "spice": 0,
    "sweetener": 0,
    "preservative": 0
  }
}
const recipes = {
  "2100": {
    "Ingredients": [
    ],
    "HP": 1,
    "Name": "Questionable Food"
  },
  "2101": {
    "Ingredients": [
      "monster"
    ],
    "HP": 1,
    "Name": "Monster Surprise"
  },
  "2102": {
    "Ingredients": [
      "beast"
    ],
    "HP": 1,
    "Name": "Seared Steak"
  },
  "2103": {
    "Ingredients": [
      "fish"
    ],
    "HP": 1,
    "Name": "Seared fish"
  },
  "2104": {
    "Ingredients": [
      "poultry"
    ],
    "HP": 1,
    "Name": "Seared poultry"
  },
  "2123": {
    "Ingredients": [
      "fruit"
    ],
    "HP": 1,
    "Name": "Fried fruit"
  },
  "2124": {
    "Ingredients": [
      "vegetable"
    ],
    "HP": 1,
    "Name": "Grilled Veggies"
  },
  "2116": {
    "Ingredients": [
      "egg"
    ],
    "HP": 2,
    "Name": "Omelette"
  },
  "2126": {
    "Ingredients": [
      "fruit",
      "sweetener"
    ],
    "HP": 2,
    "Name": "Candied fruit"
  },
  "2105": {
    "Ingredients": [
      "poultry",
      "grain"
    ],
    "HP": 3,
    "Name": "Birdie Pasta"
  },
  "2106": {
    "Ingredients": [
      "beast",
      "grain"
    ],
    "HP": 3,
    "Name": "Spaghetti & Meat"
  },
  "2107": {
    "Ingredients": [
      "fish",
      "grain"
    ],
    "HP": 3,
    "Name": "Sushi"
  },
  "2112": {
    "Ingredients": [
      "monster",
      "grain",
      "sweetener"
    ],
    "HP": 3,
    "Name": "Demon Cake"
  },
  "2115": {
    "Ingredients": [
      "grain",
      "sweetener"
    ],
    "HP": 3,
    "Name": "Grain Cake"
  },
  "2117": {
    "Ingredients": [
      "egg",
      "monster"
    ],
    "HP": 3,
    "Name": "Monster Omelette"
  },
  "2118": {
    "Ingredients": [
      "egg",
      "beast"
    ],
    "HP": 3,
    "Name": "Meaty Omelette"
  },
  "2119": {
    "Ingredients": [
      "egg",
      "vegetable"
    ],
    "HP": 3,
    "Name": "Veggie Crepe"
  },
  "2120": {
    "Ingredients": [
      "egg",
      "fruit"
    ],
    "HP": 3,
    "Name": "Fruity Crepe"
  },
  "2121": {
    "Ingredients": [
      "egg",
      "dairy"
    ],
    "HP": 3,
    "Name": "Eggnog"
  },
  "2125": {
    "Ingredients": [
      "meat",
      "vegetable"
    ],
    "HP": 3,
    "Name": "Kebabs"
  },
  "2128": {
    "Ingredients": [
      "dairy",
      "vegetable"
    ],
    "HP": 3,
    "Name": "Vegetable Stew"
  },
  "2129": {
    "Ingredients": [
      "dairy",
      "meat"
    ],
    "HP": 3,
    "Name": "Meaty Stew"
  },
  "2130": {
    "Ingredients": [
      "dairy",
      "monster"
    ],
    "HP": 3,
    "Name": "Monster Stew"
  },
  "2131": {
    "Ingredients": [
      "meat",
      "preservative"
    ],
    "HP": 3,
    "Name": "Jerky"
  },
  "2133": {
    "Ingredients": [
      "dairy",
      "sweetener"
    ],
    "HP": 3,
    "Name": "Ice Cream"
  },
  "2108": {
    "Ingredients": [
      "poultry",
      "grain",
      "dairy"
    ],
    "HP": 4,
    "Name": "Birdie Pie"
  },
  "2109": {
    "Ingredients": [
      "beast",
      "grain",
      "dairy"
    ],
    "HP": 4,
    "Name": "Cottage Pie"
  },
  "2110": {
    "Ingredients": [
      "fish",
      "grain",
      "dairy"
    ],
    "HP": 4,
    "Name": "Fisherman's Pie"
  },
  "2111": {
    "Ingredients": [
      "fruit",
      "grain",
      "dairy"
    ],
    "HP": 4,
    "Name": "Fruit Pie"
  },
  "2113": {
    "Ingredients": [
      "dairy",
      "grain",
      "sweetener"
    ],
    "HP": 4,
    "Name": "Cake"
  },
  "2114": {
    "Ingredients": [
      "fruit",
      "grain",
      "sweetener"
    ],
    "HP": 4,
    "Name": "Fruit Cake"
  },
  "2122": {
    "Ingredients": [
      "beast",
      "fish",
      "poultry"
    ],
    "HP": 4,
    "Name": "Meat Roast"
  },
  "2127": {
    "Ingredients": [
      "fruit",
      "sweetener",
      "dairy"
    ],
    "HP": 4,
    "Name": "Milkshake"
  },
  "2132": {
    "Ingredients": [
      "egg",
      "dairy",
      "sweetener"
    ],
    "HP": 4,
    "Name": "Pudding"
  },
  "2134": {
    "Ingredients": [
      "monster",
      "grain",
      "spice"
    ],
    "HP": 4,
    "Name": "Monster Curry"
  },
  "2135": {
    "Ingredients": [
      "poultry",
      "grain",
      "spice"
    ],
    "HP": 4,
    "Name": "Birdie Curry"
  },
  "2136": {
    "Ingredients": [
      "beast",
      "grain",
      "spice"
    ],
    "HP": 4,
    "Name": "Beast Curry"
  },
  "2137": {
    "Ingredients": [
      "fish",
      "grain",
      "spice"
    ],
    "HP": 4,
    "Name": "Seafood Curry"
  },
  "2138": {
    "Ingredients": [
      "monster",
      "dairy",
      "egg"
    ],
    "HP": 4,
    "Name": "Monster Gelato"
  }
}

class FoodInfo {
  constructor(monkey, options){
    this.options = options
    this.monkey = monkey
    this.classname = "FoodInfo"
    this.cookingDomName = "FoodInfoDom"
    this.setupHintObserver();
    this.setupPlayer();
    this.setupCookObserver();
  }

  setupHintObserver(promise) {

    promise = promise || new Promise(() => {});
    let self = this;
    // Hmm, looks like tooltips are outside the game container, otherwise I would use:
    // const targetNodeHolder = document.getElementsByClassName("game-container");
    // We want to wait for the game-container to come alive though so:
    const gameContainer = document.getElementsByClassName("game-container");
    //const targetNodeHolder = document.getElementsByTagName("body")[0];
    if(gameContainer.length > 0) {
      promise.then();
    }
    else {
      setTimeout(function(){self.setupHintObserver(promise);
                 }, 1000 );
      return false;
    }
    const targetNode = document.body;
    const config = {attributes: true, childList: true, subtree: true };
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      for(let mutation of mutationsList) {
        if(mutation.type === 'attributes'){
          document.querySelectorAll(".item-tooltip").forEach(
            e=>{
              let name = e.getElementsByTagName("span")[1].innerHTML.toLowerCase();
              let statblock = e.getElementsByClassName("item-stat-block")[0];
              if( statblock.innerHTML.includes("Ingredient") && !(statblock.innerHTML.includes("Size")) ){
                let foodEntry = foods[name];
                statblock.innerHTML += "<br/>Size: " + foodEntry.size +"<br/>Tags:";
                for(let key in foodEntry){
                  if( key != "size" && foodEntry[key]==1 ){
                    statblock.innerHTML += " " + key.charAt(0).toUpperCase() +key.slice(1) + ","
                  }
                }
                // Drop the last comma
                statblock.innerHTML = statblock.innerHTML.slice(0, -1);
                if( foodEntry.buff != "" ){
                  let buffwords = foodEntry.buff.split(" ");
                  for( let bi=0; bi<buffwords.length; bi++ )
                  {
                    buffwords[bi] = buffwords[bi].charAt(0).toUpperCase() + buffwords[bi].slice(1);
                  }
                  statblock.innerHTML += "<br/>Buff: <b class='enchanted-text'>" + buffwords.join(" ") + "</b>"
                }
              }
            });
          break;
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

  }
  setupCookObserver(promise) {

    promise = promise || new Promise(() => {});
    let self = this;
    const targetNodeHolder = document.getElementsByClassName("play-area-container");
    if(targetNodeHolder.length > 0) {
      promise.then();
    }
    else {
      setTimeout(function(){self.setupCookObserver(promise);
                 }, 1000 );
      return false;
    }
    const targetNode = targetNodeHolder[0];
    const config = {attributes: true, childList: false, subtree: true, characterData: true};
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      // Are we cooking?
      var action = targetNode.getElementsByClassName("nav-tab-container")[0].innerText
      if( action === "Cooking" ){
        // Add an element to write to if it does not exist
        var recipeDom = document.getElementById(self.cookingDomName);
        if( recipeDom == null ){
          recipeDom = document.createElement("div");
          recipeDom.id = self.cookingDomName;
          recipeDom.className = "cooking-info";
          recipeDom.style.border = "2px solid rgba(255, 255, 255, 0.2)"
          recipeDom.style.position = "relative";
          recipeDom.style.zIndex = 2;
          targetNode.getElementsByClassName("cooking-controls")[0].prepend(recipeDom);
        }
        let use_ingredients = [];
        // Gather the ingredients
        for( let imgdom of targetNode.getElementsByClassName("cooking-item-image") ){
          let src = (imgdom.src).split("/").pop().split(".")[0].split("_").join(" ");
          use_ingredients.push(src)
        }
        // Write recipe to dom
        //self.level = effectiveLevel("cooking");
        self.level = self.monkey.extensions.PlayerData.getEffectiveLevel("cooking");
        self.cook(recipeDom, use_ingredients);
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

  }
  setupPlayer(){
    this.level = 90;
  }
  cook(targetdom, ingredients) {
    var nIngredients = ingredients.length
    if( nIngredients == 0 ){
      targetdom.innerHTML = "";
      return;
    }
    var scale = {}
    allTags.forEach(e=>(scale[e]=0));
    var weight = 0
    var buffs = []
    for( let ingred of ingredients ){
      for( let k of allTags ){
        scale[k] += foods[ingred][k] * foods[ingred].size
      }
      if( foods[ingred].buff != "" ){
        buffs.push(foods[ingred].buff)
        if( unique(buffs).length > 1 ){
          for(let k of allTags){
            scale[k] -= foods[ingred][k] * foods[ingred].size
          }
        }
      }
      weight += foods[ingred].size
    }
    var uniqueBuffs = unique(buffs);
    var totalWeight = 0;
    for( let k in scale ){ totalWeight += scale[k] }
    var recipe = 'Questionable Food'
    var tags = [foods[ingredients[0]].size]
    //for( let k in scale ){ if( scale[k] > 0 ){ tags.push(scale[k]); } }
    var hp = 1
    var rUID = 0
    // Search through the menu for valid recipes
    for( let uid in recipes ) {
      var rec = recipes[uid]
      if( uniqueBuffs.length > 1 ) break;
      // Check enough ingredients exist
      var validRecipe = true;
      var validWeight = 0;
      for( let ingred of rec.Ingredients ) {
        validWeight += scale[ingred];
        if( scale[ingred] < 1 ) validRecipe = false;
      }
      if( !validRecipe ) continue;
      if( 2*validWeight >= totalWeight ){
        recipe = rec["Name"];
        rUID = uid;
        tags = [];
        for( let k of rec.Ingredients ){ tags.push( scale[k] ); }
        hp = rec.HP;
        break;
      }
    }

    var lvlBonus = Math.floor(this.level/30 - 1);
    var tagBonus = Math.min(...tags);
    var bonus = lvlBonus + tagBonus;
    hp = (bonus+1)*hp;
    var stacks = (bonus*2 + 1);
    var buff = buffs.length > 0 ? buffs[0] : "";
    var cooktime = 4^(0.95 + 0.05*weight)
    // Left column
    var idomtxt
    idomtxt =
      `<div style="display:flex;"><div style="flex:50%">
       <b>${recipe}</b> <b class="augmented-text">+${bonus}</b><br />
       [Effective Level: ${this.level}]<br />
       Heals: ${hp} hp
       `
    if( buff !== "" ){
      idomtxt += `<br/>Grants ${stacks} stacks of <b class="enchanted-text">${buff} 2</b>`
    }
    idomtxt += `</div><div style="flex:50%">`
    if( recipe !== 'Questionable Food' ){
      var chosen_recipe = recipes[rUID];
      idomtxt += `<b>Recipe Tags</b><br/>`
      for(let ig of chosen_recipe.Ingredients){
        idomtxt += `${ig.charAt(0).toUpperCase()+ig.slice(1)}: ${scale[ig]}<br/>`
      }
    }
    idomtxt += `</div></div>`
    targetdom.innerHTML = idomtxt;
  }
}
