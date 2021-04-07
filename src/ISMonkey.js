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

class ISMonkey {
  // ISMonkey is an extension manager that sets up the required
  // MutationObservers and serv socket to be used throughout.
  constructor() {
    this.socketEventList = [];
    this.asyncExtensionList = [];
    this.extensions = {};
    this.setupSocket();
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
  addSocketExtension(ext){
    this.socketEventList.push(ext);
    this.extensions[ext.classname] = ext;
  }
  // Mutation Agent
  addAsyncExtension(ext){
    this.asyncExtensionList.push(ext);
    this.extensions[ext.classname] = ext;
  }

  // Debug Features
  getListOfExtensions(){
    var xlist = [];
    for(let ext of this.socketEventList){
      xlist.push( ext.constructor.name );
    }
    for(let ext of this.asyncExtensionList){
      xlist.push( ext.constructor.name );
    }
    return xlist;
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
