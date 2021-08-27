class ISMonkey {
  // ISMonkey is an extension manager that sets up the required
  // MutationObservers and serv socket to be used throughout.
  constructor() {
    // Load the local settings, a few defaults to start
    if(localStorage.getItem("monkeySettings") === null){
      this.settings = {
        "InjectCSS": 1,
        "JiggySlide": 1,
        "AnimationCancel": 1,
        "FoodInfo": 1
      };
    } else {
      this.settings = JSON.parse(localStorage.monkeySettings);
    }
    this.protectedExtensions = ["PlayerData"];
    this.socketEventList = [];
    this.asyncExtensionList = [];
    this.extensions = {};
    this.interceptXHR();
    this.interceptSocket();
    this.setupSocket();
    this.insertSettingsMenu();
  }

  interceptXHR() {
    let self = this;
    window.XMLHttpRequest.prototype._open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      // Only care about socket.io fallback XHR messages
      if (url.match("socket.io")) {
        this.addEventListener("load", function () {
          let messages = this.responseText.split("");
          messages.forEach((m) => {
            // conform to ISMonkey.messageHandler() object evaluation expectations
            let e = {
              data: m,
            };
            self.messageHandler(self, e);
          });
        });
      }
      return window.XMLHttpRequest.prototype._open.apply(this, arguments);
    };
    console.info("ISMonkey listening for socket.io XHR fallback messages");
  }

  interceptSocket() {
    if( typeof WebSocket.prototype._send == "undefined" ){
      WebSocket.prototype._send = WebSocket.prototype.send;
    }
    WebSocket.prototype.send = function(data){
      this._send(data);
      if( typeof window.IdlescapeSocket == "undefined" ){
        window.IdlescapeSocket = this;
        this.send = this._send;
      }
    }
  }

  // Wait for socket to initialize and attach to this class
  setupSocket() {
    var self = this;
    let setupThisSocket = setInterval( ()=> {
      if( typeof window.IdlescapeSocket !== "undefined" ){
        clearInterval(setupThisSocket);
        window.IdlescapeSocket.addEventListener('message', (e)=>self.messageHandler(self, e));
        console.log("ISMonkey attached to socket!");
      }
    }, 100);
  }

  // Message handler for sockets
  messageHandler(self, e) {
    let msg = ( (e.data).match(/^[0-9]+(\[.+)$/) || [] )[1];
    if( msg != null ) {
      let msg_parsed = JSON.parse(msg);
      let [r, data] = msg_parsed;
      self.socketEventList.forEach(e=>e.run(self, msg_parsed))
    }
  }
  addSocketExtension(ext, options){
    this.socketEventList.push( ext.name );
    if( this.settings[ext.name] === 1 || this.protectedExtensions.includes(ext.name)){
      let newobject = new ext(this, options);
      this.extensions[ext.name] = newobject;
    }
  }
  // Mutation Agent
  addAsyncExtension(ext, options){
    this.asyncExtensionList.push( ext.name );
    if( this.settings[ext.name] === 1 || this.protectedExtensions.includes(ext.name)){
      let newobject = new ext(this, options);
      this.extensions[ext.name] = newobject;
    }
  }

  // Draw Settings Menu
  insertSettingsMenu(promise){
    let self=this;
    promise = promise || new Promise( ()=>{} );
    if( document.getElementsByClassName("nav-drawer-container").length == 0 ){
      setTimeout(function(){self.insertSettingsMenu(promise)}, 1000);
      return false;
    } else {
      promise.then();
    }

    let outerDiv = document.createElement("DIV");
    outerDiv.className="drawer-item active noselect monkey";
    let icon = document.createElement("IMG");
    icon.className="drawer-item-icon monkey";
    icon.src="/images/cooking/banana.png";
    let innerDiv = document.createElement("DIV");
    innerDiv.append(icon);
    innerDiv.className="monkey";
    innerDiv.innerHTML+="ISMonkey";
    outerDiv.append(innerDiv);

    let container = document.getElementsByClassName("nav-drawer-container")[0];
    for( let i=0; i < container.children.length; i++ ){
      if( container.children[i].innerText.indexOf("Settings")>-1 ){
        container.insertBefore(outerDiv, container.children[i+1]);
        break;
      }
    }
    outerDiv.addEventListener('click', () => self.drawSettingsMenu(self) );
  }

  fillSettingsDom(self, dom){
    dom.innerHTML=""
    let headertext = document.createElement("i")
    headertext.className="monkey"
    headertext.innerText="Refresh page for changes to take effect"
    dom.append(headertext)
    let cbox = document.createElement("div")
    cbox.className="monkey"
    let UL = document.createElement("ul")
    UL.className="monkey"

    let extlist = Object.assign({}, self.asyncExtensionList, self.socketEventList);
    for(let i=0; i<extlist.length; i++){
      let name = extlist[i]
      if( self.protectedExtensions.includes(name) ){
        continue;
      }
      let LI = document.createElement("li")
      LI.className="monkey"
      let input = document.createElement("input")
      input.type="checkbox"
      input.style.position="relative"
      input.style.opacity=1
      input.style.margin="0.2em"
      let localInputID = `${name}_monkeySettings`
      LI.append(input)
      input.id=localInputID
      if( self.settings[name] === 1 ){
          input.defaultChecked = true
      }
      LI.addEventListener('click',function(e){
          let idom = document.getElementById(localInputID)
          if( idom.checked ){
              idom.checked = false;
              self.settings[name] = 0;
          } else {
              idom.checked = true;
              self.settings[name] = 1
          }
          localStorage.monkeySettings = JSON.stringify(self.settings)
      });
      LI.innerHTML+=name
      UL.append(LI)
    }
    cbox.append(UL)
    dom.append(cbox)
  }

  drawSettingsMenu(self){
    let container = document.getElementsByClassName("play-area-container")[0];
    //container.innerHTML=""
    let icon = document.createElement("IMG");
    icon.className="nav-tab-icon icon-border monkey";
    icon.src="/images/cooking/banana.png";
    let innerDiv = document.createElement("DIV");
    innerDiv.append(icon);
    innerDiv.innerHTML+="ISMonkey";
    let tabName = container.getElementsByClassName("nav-tab-left")[0];
    let tabClone = tabName.cloneNode(true);
    document.getElementsByClassName("nav-tab-container")[0].prepend(tabClone);
    tabClone.innerHTML="";
    tabClone.append(innerDiv);
    tabClone.id="monkeySettings";
    tabName.style.display="none";
    // Setup Menu
    let playArea = container.getElementsByClassName("play-area")[0];
    let playClone = playArea.cloneNode(true);
    playClone.className="play-area monkey theme-default";
    playClone.innerHTML=""
    container.append(playClone)
    playArea.style.display="none";
    self.fillSettingsDom(self, playClone);

    function resetMenu(e) {
      if( !e.target.classList.contains("monkey") ){
        tabName.style.display="block";
        playArea.style.display="block";
        tabClone.remove();
        playClone.remove();
        document.removeEventListener("click", resetMenu);
      }
    }
    let listener = document.addEventListener("click", resetMenu);
  }
}

// Tools
function unique(obj) {
  return obj.filter((v,i,a)=>a.indexOf(v) === i)
};
function getReact(dom) {
  for(let key in dom) {
    if( key.startsWith("__reactInternalInstance$") ){
      return dom[key];
    }
  }
}

function get(obj, key, default_value){
  var result = obj[key];
  return (typeof result !== "undefined") ? result : default_value;
}

function getInventory() {
  let inventory_set = document.getElementsByClassName("inventory-container-all-items")[0];
  let dict = {};
  try{
    let inventory = inventory_set.getElementsByClassName("item");

    for(let i=0; i<inventory.length; i++) {
      let itemdiv = inventory[i];
      try {
        let k = getReact(itemdiv);
        let item = k.return.pendingProps.item;
        let quant = k.return.pendingProps.quantity;
        dict[item.name] = quant;
      }
      catch(err){}
    }
    dict = sortObjectByKeys(dict);
    // Add heat and gold
    dict.Gold = getGold();
    dict.Heat = getHeat();
    let xp = getSkills();
    for(let k in xp) {
      dict[k] = xp[k];
    }
    dict.time = Date.now();
  }
  catch(err){}
  return dict;
}

function printCraftingXP() {
  var inventory = getInventory();
  var totalXP = 0;
  for( let k in inventory ) {
    totalXP += get( craftingXP, k, 0 ) * inventory[k];
  }
  console.log(`Crafting XP: ${totalXP.toFixed(0)}`);
}

function getGold(){
  try {
    return parseInt(document.getElementById("gold-tooltip").getElementsByTagName("span")[0].innerHTML.replace(/,/g, ""));
  }
  catch(err){
    return 0;
  }
}

function getHeat(){
  try{
    return parseInt(document.getElementById("heat-tooltip").getElementsByTagName("span")[0].innerHTML.replace(/,/g, ""));
  }
  catch(err){
    return 0;
  }
}

function getSkills(){
  let skills = ["miningHeader", "foragingHeader", "fishingHeader", "farmingHeader", "enchantingHeader",
                "runecraftingHeader", "smithingHeader", "craftingHeader", "cookingHeader", "constitutionHeader",
                "attackHeader", "strengthHeader", "defenseHeader"];
  let skdict = {};

  try {
    for(let sk=0; sk<skills.length; sk++){
      let skill = document.getElementById(skills[sk]);
      let spans = skill.getElementsByTagName("span");
      let name = spans[0].getElementsByTagName("b")[0].innerHTML;
      let xp = spans[2].innerHTML.replace(/\D/g,'');
      skdict[name] = xp;
    }
  } catch(err) {}
  return skdict;
}

function effectiveLevel(skill){
  let header = skill + "Header"
  let level = getReact(document.getElementById(header)).pendingProps.children[2].props.children[1]
  return level
}

function sortObjectByKeys(o){
  return Object.keys(o).sort().reduce((r,k)=>(r[k] = o[k], r), {});
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function timeFormat(time){
  time = Math.floor(time);
  let hours = Math.floor(time/3600);
  let minutes = Math.floor((time-(hours*3600))/60);
  let seconds = time - (hours*3600) - (minutes*60);
  if( hours < 10 ){hours = `0${hours}`;}
  if( minutes < 10 ){minutes = `0${minutes}`;}
  if( seconds < 10 ){seconds = `0${seconds}`;}
  return `${hours}:${minutes}:${seconds}`;
}

// Retrieve json objects: https://stackoverflow.com/questions/2499567/how-to-make-a-json-call-to-an-url/2499647#2499647
const getJSON = async url => {
  try {
    const response = await fetch(url);
    if(!response.ok)
      throw new Error(response.statusText);
    const data = await response.json();
    return data;
  } catch(error) {
    return error;
  }
}
