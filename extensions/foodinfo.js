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
    this.setupPlayer();
    this.setupHintObserver();
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
    let css = `
      .cooking-empty-button, .cooking-start-button {
        margin-top: 10px;
      }
      /*
      .cooking-controls {
        top: -80px;
        position: relative;
      }
      */
    `
    appendCSS(css);
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      for(let mutation of mutationsList) {
        if(mutation.type === 'attributes'){
          //document.querySelectorAll(".item-tooltip").forEach(
          document.querySelectorAll(".daelis-wow-tooltip").forEach(
            e=>{
              try {
                let nameElement = e.getElementsByClassName("dwt-name")[0] || "None";
                let name = nameElement.innerText.toLowerCase();
                let dwtitemtype = e.getElementsByClassName("dwt-item-type")[0] || undefined;
                if( dwtitemtype && dwtitemtype.innerHTML.includes("Ingredient") && !(e.innerHTML.includes("Size")) ){
                  let foodInfoDiv = document.createElement("div");
                  let foodEntry = self.foods[name];
                  foodInfoDiv.innerHTML += "Size: " + foodEntry.size + "<br>Difficulty: " + foodEntry.difficulty + "<br>Tags:";
                  for(let key in foodEntry){
                    if( key != "size" && foodEntry[key]==1 && key != "difficulty" ){
                      foodInfoDiv.innerHTML += " " + key.charAt(0).toUpperCase() +key.slice(1) + ","
                    }
                  }
                  // Drop the last comma
                  foodInfoDiv.innerHTML = foodInfoDiv.innerHTML.slice(0, -1);
                  if( foodEntry.buff != "" ){
                    let buffwords = foodEntry.buff.split(" ");
                    for( let bi=0; bi<buffwords.length; bi++ )
                    {
                      buffwords[bi] = buffwords[bi].charAt(0).toUpperCase() + buffwords[bi].slice(1);
                    }
                    foodInfoDiv.innerHTML += "<br/>Buff: <b class='enchanted-text'>" + buffwords.join(" ") + "</b><br>"
                  }
                  dwtitemtype.after(foodInfoDiv);
                }
              } catch {};
            });
          document.querySelectorAll(".item-tooltip").forEach(
            e=>{
              try {
                let name = e.getElementsByTagName("span")[1].innerHTML.toLowerCase();
                let statblock = e.getElementsByClassName("item-stat-block")[0];
                if( statblock.innerHTML.includes("Ingredient") && !(statblock.innerHTML.includes("Size")) ){
                  let foodEntry = self.foods[name];
                  statblock.innerHTML += "<br/>Size: " + foodEntry.size + "<br/>Difficulty: " + foodEntry.difficulty + "<br/>Tags:";
                  for(let key in foodEntry){
                    if( key != "size" && foodEntry[key]==1 && key != "difficulty" ){
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
              } catch {};
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
  selfcallback(self) {
    // Are we cooking?
    const targetNodeHolder = document.getElementsByClassName("play-area-container");
    if( targetNodeHolder.length < 1 ){ return; }
    const targetNode = targetNodeHolder[0];
    let action = targetNode.getElementsByClassName("nav-tab-left")[0].innerText
    if( action === "Cooking" ){
      // Add an element to write to if it does not exist
      let recipeDom = document.getElementById(self.cookingDomName);
      if( recipeDom == null ){
        recipeDom = document.createElement("div");
        recipeDom.id = self.cookingDomName;
        recipeDom.className = "cooking-info";
        recipeDom.style.border = "2px solid rgba(255, 255, 255, 0.2)"
        recipeDom.style.position = "relative";
        recipeDom.style.zIndex = 2;
        //recipeDom.style.display = "inline-block";
        recipeDom.style.width = "fit-content";
        recipeDom.style.margin = "0 auto";
        targetNode.getElementsByClassName("cooking-controls")[0].prepend(recipeDom);
      }
      // Kill useless info
      for( let cookingInfoDom of document.getElementsByClassName("cooking-info") ){
        if( cookingInfoDom.id != self.cookingDomName ){
          for( let paragraph of cookingInfoDom.getElementsByTagName("p") ){
            if( paragraph.className != "cooking-stats" ){
              paragraph.remove()
            } else {
              // Useful info
              let newtext = ""
              newtext += "poo"
              //paragraph.remove()
            }
          }
          for( let header5 of cookingInfoDom.getElementsByTagName("h5") ){
            header5.remove()
          }
          for( let border of cookingInfoDom.getElementsByClassName("cooking-title-border") ){
            border.remove()
          }
          targetNode.getElementsByClassName("cooking-controls")[0].prepend(cookingInfoDom)
          cookingInfoDom.remove()
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
        if( src == 'raw tentacle chunk' ) src = 'raw tentacle meat';
        if( src == 'water dust' ) src = 'water imbued dust';
        use_ingredients.push(src)
      }
      // Write recipe to dom
      //self.level = effectiveLevel("cooking");
      self.level = self.monkey.extensions.PlayerData.getEffectiveLevel("cooking");
      self.cook(self, recipeDom, use_ingredients);
    }
  };
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
    const callback = function(mutationsList, observer) {
      self.selfcallback(self)
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

  }
  setupPlayer(){
    this.burnChance = 1
    this.experiencePerAction = 1
    this.heatPerAction = 1
    this.numberOfAvailableActions = 1
    this.timePerAction = 1
    this.totalTimeToCompleteActions = 1
  }
  run(obj, msg){
    if( msg[0] == "cooking information" ){
      let info = msg[1];
      this.burnChance = info.burnChance
      this.experiencePerAction = info.experiencePerAction
      this.heatPerAction = info.heatPerAction
      this.numberOfAvailableActions = info.numberOfAvailableActions
      this.timePerAction = info.timePerAction
      this.totalTimeToCompleteActions = info.totalTimeToCompleteActions
      this.selfcallback(this)
    }
  }
  cook(self, targetdom, ingredients) {
    let nIngredients = ingredients.length
    if( nIngredients == 0 ){
      targetdom.innerHTML = "";
      return;
    }
    let scale = {}
    allTags.forEach(e=>(scale[e]=0));
    let weight = 0;
    let difficulty = 0;
    let buffs = []
    let buffBonus = []
    for( let ingred of ingredients ){
      for( let k of allTags ){
        scale[k] += self.foods[ingred][k] * self.foods[ingred].size
      }
      if( self.foods[ingred].buff != "" ){
        buffs.push(self.foods[ingred].buff)
        buffBonus.push( get(self.foods[ingred], "buffBonus", 2) );
        if( unique(buffs).length > 1 ){
          for(let k of allTags){
            scale[k] -= self.foods[ingred][k] * self.foods[ingred].size
          }
        }
      }
      weight += self.foods[ingred].size
      difficulty += self.foods[ingred].difficulty
    }
    let uniqueBuffs = unique(buffs);
    let totalWeight = 0;
    for( let k in scale ){ totalWeight += scale[k] }
    let recipe = 'Questionable Food'
    let tags = [self.foods[ingredients[0]].size]
    //for( let k in scale ){ if( scale[k] > 0 ){ tags.push(scale[k]); } }
    let hp = 1
    let rUID = 0
    // Search through the menu for valid recipes
    for( let uid in self.recipes ) {
      let rec = self.recipes[uid]
      if( uniqueBuffs.length > 1 ) break;
      // Check enough ingredients exist
      let validRecipe = true;
      let validWeight = 0;
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

    let lvlBonus = Math.floor(self.level/30 - 1);
    let tagBonus = (recipe == 'Questionable Food') ? 1 : Math.min(...tags);
    let bonus = lvlBonus + tagBonus;
    let bonusHP = (bonus+2)*hp;
    hp = (bonus+1)*hp;
    let buff = buffs.length > 0 ? buffs[0] : "";
    let buffModifier = buffBonus.length > 0 ? buffBonus[0] : 2;
    let stacks = (bonus*buffModifier + 1);
    let bonusStacks = ((bonus+1)*buffModifier+1);
    let cooktime = 4^(0.95 + 0.05*weight)
    function btext(n){return `<b style="color:#42bd54 !important;">${n}</b>`}
    // Left column
    let idomtxt
    idomtxt =
      `<div style="display:flex; margin:5px;"><div style="flex:50%">
       <b>${recipe}</b> <b class="augmented-text">+${bonus}</b> (${btext("+"+(bonus+1))})<br />
       [Effective Level: ${self.level}]<br />
       Heals: ${hp} (${btext(bonusHP)}) hp
       `
    if( buff !== "" ){
      idomtxt += `<br/>Grants ${stacks} (${btext(bonusStacks)}) stacks of <b class="enchanted-text">${buff} 2</b>`
    }
    idomtxt += `</div><div style="flex:50%">`
    if( recipe !== 'Questionable Food' ){
      let chosen_recipe = self.recipes[rUID];
      idomtxt += `<b>Recipe Tags</b><br/>`
      for(let ig of chosen_recipe.Ingredients){
        idomtxt += `${ig.charAt(0).toUpperCase()+ig.slice(1)}: ${scale[ig]}<br/>`
      }
    }
    idomtxt += `</div></div>`
    let inferno = self.monkey.extensions.PlayerData.getBuffStrength("Inferno")
    let intuition = self.monkey.extensions.PlayerData.getBuffStrength("Intuition")
    let scholar = self.monkey.extensions.PlayerData.getBuffStrength("Scholar")
    // Cook chance, time (inferno), attempts, total time
    let infernoCookTime = self.timePerAction * (1 - inferno*0.05)
    let totalCookTime = self.numberOfAvailableActions * infernoCookTime
    let totalXP = self.experiencePerAction * self.numberOfAvailableActions * ( 1 + 0.05*intuition + 0.2*scholar )
    let totalHeat = self.heatPerAction*self.numberOfAvailableActions
    function ttl(n){return `<span style="display:inline-block; width:115px">${n}</span>`}
    function tta(n){return `<span style="display:inline-block; width:95px">${n}</span>`}
    function trow(name, each, total, hourly){
      return `${ttl(name)}${tta(each)}${tta(hourly)}${tta(total)}<br>`
    }
    idomtxt += `<div style="text-align: left; margin:5px;"><hr>`
    idomtxt += `${ttl("Cook chance")}${dnum(self.burnChance*100,2)}%<br>`
    idomtxt += `${ttl("Difficulty | Size")}${dnum(difficulty, 0)} | ${dnum(weight, 0)}<br>`
    idomtxt += `${ttl("Chance for "+btext("+1"))}${dnum(100*(self.level % 30)/30, 2)}%<br></div>`
    idomtxt += `</div>`

    idomtxt += `<div style="text-align: left; margin:5px;">`
    idomtxt += trow("","<b>Each</b>","<b>Total</b>","<b>Hourly</b>");
    idomtxt += trow("Time",`${dnum(infernoCookTime,2)}s`,timeFormatFull(totalCookTime),"&mdash;")
    idomtxt += trow("Actions",1,numberWithCommas(self.numberOfAvailableActions),numberWithCommas(self.numberOfAvailableActions/totalCookTime*3600));
    idomtxt += trow("Heat",dnum(self.heatPerAction,0),numberWithCommas(totalHeat),numberWithCommas(totalHeat/totalCookTime*3600))
    idomtxt += trow("Experience",dnum(self.experiencePerAction,0),numberWithCommas(totalXP),numberWithCommas((totalXP/totalCookTime*3600)))
    idomtxt += `</div>`
    //idomtxt += `${ttl("Experience / Hour:")} ${numberWithCommas((totalXP / totalCookTime * 3600).toFixed(0))}<br>`
    //idomtxt += `<div style="text-align: left; margin:5px;"><hr> ${ttl("Cook chance:")} ${dnum(self.burnChance*100,2)}%<br>`
    //idomtxt += `${ttl("Difficulty | Size:")} ${dnum(difficulty, 0)} | ${dnum(weight, 0)}<br>`
    //idomtxt += `${ttl("Chance for +1:")} ${dnum(100*(self.level % 30)/30, 2)}%<br>`
    //idomtxt += `${ttl("Heat used:")} ${dnum(self.heatPerAction, 0)} (${numberWithCommas((self.heatPerAction * self.numberOfAvailableActions))})<br>`
    //idomtxt += `${ttl("Time per action:")} ${dnum(infernoCookTime,2)}s (${timeFormatFull(totalCookTime)})<br>`
    //idomtxt += `${ttl("Experience:")} ${dnum(self.experiencePerAction, 0)} (${numberWithCommas(totalXP)})<br>`
    //idomtxt += `${ttl("Experience / Hour:")} ${numberWithCommas((totalXP / totalCookTime * 3600).toFixed(0))}<br>`
    //idomtxt += `${ttl("Available attempts:")} ${numberWithCommas(self.numberOfAvailableActions)}</div>`
    targetdom.innerHTML = idomtxt;
  }
}

const allTags = ['fruit', 'vegetable', 'grain', 'dairy', 'egg', 'meat', 'beast',
         'poultry', 'fish', 'monster', 'spice', 'sweetener', 'preservative', 'christmas'];
// foods, recipes
