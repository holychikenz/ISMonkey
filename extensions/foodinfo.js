class FoodInfo {
  constructor(monkey, options){
    this.options = options
    this.monkey = monkey
    this.classname = "FoodInfo"
    this.cookingDomName = "FoodInfoDom"
    this.foods = {}
    this.recipes = {}
    getJSON("https://raw.githubusercontent.com/holychikenz/ISMonkey/main/data/ingredients.json").then(
      data => {this.foods = data});
    getJSON("https://raw.githubusercontent.com/holychikenz/ISMonkey/main/data/recipes.json").then(
      data => {this.recipes = data});
  }
  connect(){
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
                let foodEntry = self.foods[name];
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
        // Kill useless info
        for( let cookingInfoDom of document.getElementsByClassName("cooking-info") ){
          if( cookingInfoDom.id != self.cookingDomName ){
            for( let paragraph of cookingInfoDom.getElementsByTagName("p") ){
              if( paragraph.className != "cooking-stats" ){
                paragraph.remove()
              }
            }
            for( let header5 of cookingInfoDom.getElementsByTagName("h5") ){
              header5.remove()
            }
            for( let border of cookingInfoDom.getElementsByClassName("cooking-title-border") ){
              border.remove()
            }
            targetNode.getElementsByClassName("cooking-controls")[0].prepend(cookingInfoDom)
          }
        }
        targetNode.getElementsByClassName("cooking-main")[0].style.gridTemplateColumns="4fr 4fr"
        let use_ingredients = [];
        // Gather the ingredients
        for( let imgdom of targetNode.getElementsByClassName("cooking-item-image") ){
          let src = (imgdom.src).split("/").pop().split(".")[0].split("_").join(" ");
          // Hacky hack hack; Should read socket and not UI, UI is a lie
          if( src == 'sage berry' ) src = 'sageberry'; // damnit
          if( src == 'raw minnow' ) src = 'raw magnetic minnow';
          if( src == 'raw eel' ) src = 'raw slippery eel';
          if( src == 'raw greatwhite' ) src = 'raw great white shark';
          if( src == 'raw hammerhead' ) src = 'raw hammerhead shark';
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
        scale[k] += this.foods[ingred][k] * this.foods[ingred].size
      }
      if( this.foods[ingred].buff != "" ){
        buffs.push(this.foods[ingred].buff)
        if( unique(buffs).length > 1 ){
          for(let k of allTags){
            scale[k] -= this.foods[ingred][k] * this.foods[ingred].size
          }
        }
      }
      weight += this.foods[ingred].size
    }
    var uniqueBuffs = unique(buffs);
    var totalWeight = 0;
    for( let k in scale ){ totalWeight += scale[k] }
    var recipe = 'Questionable Food'
    var tags = [this.foods[ingredients[0]].size]
    //for( let k in scale ){ if( scale[k] > 0 ){ tags.push(scale[k]); } }
    var hp = 1
    var rUID = 0
    // Search through the menu for valid recipes
    for( let uid in this.recipes ) {
      var rec = this.recipes[uid]
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
    var tagBonus = (recipe == 'Questionable Food') ? 1 : Math.min(...tags);
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
      var chosen_recipe = this.recipes[rUID];
      idomtxt += `<b>Recipe Tags</b><br/>`
      for(let ig of chosen_recipe.Ingredients){
        idomtxt += `${ig.charAt(0).toUpperCase()+ig.slice(1)}: ${scale[ig]}<br/>`
      }
    }
    idomtxt += `</div></div>`
    targetdom.innerHTML = idomtxt;
  }
}

const allTags = ['fruit', 'vegetable', 'grain', 'dairy', 'egg', 'meat', 'beast',
         'poultry', 'fish', 'monster', 'spice', 'sweetener', 'preservative'];
// foods, recipes
