// This extension creates a combat statistics summary in the chat window area
// designed to give you information about yourself and your party.
// A few known "bugs" and todo items
// - [ ] Tracking food usage is difficult b/c of corruption ring and double heal bug
// - [ ] Selecting the Fite chat box does not truly inactivate the previous window
//       It appears inactive, but does not show new messages
// - [ ] The "group chat" window is buggy (it must have a different class)
// - [ ] More columns to come
// - [ ] Mouseover for greater detail
class Dungeoneering {
  constructor(monkey, options){
    this.options = options
    this.monkey = monkey
    this.config();
    this.resetRun();
    this.prepareTables();
    this.prepareSummaryBlock();
    this.setupStatsWindow();
  }
  addCSS(){
    var rcstyle = document.createElement("style");
    rcstyle.innerHTML=
      `
      .dungeoneering-flex {
        display: flex;
        flex-wrap: wrap;
        margin-left: -5px;
        margin-right: -5px;
      }
      .dungeoneering-flex-column {
        flex: 50%;
        padding: 5px;
      }
      .dungeoneering-table {
        border-collapse: collapse;
        border-spacing: 0;
        table-layout: fixed;
      }
      .dungeoneering-table td {
        padding: 5px;
        width: ${this.cellLength}px;
      }
      .dungeoneering-table th {
        padding: 5px;
        width: ${this.cellLength}px;
        word-wrap:break-word;
      }
      .dungeoneering-icon {
        position: relative;
        width: 25px;
        height: 25px;
        object-fit: contain;
        background-color: rgba(255, 255, 255, 0.8);
        object-position: 50% 50%;
        border-radius: 5px;
      }
      .dungeoneering-row {
        animation: blinker 1s linear;
      }
      @keyframes blinker {
        0% { opacity: 0.25; }
      }
      `
    document.body.appendChild(rcstyle)
  }
  config(){
    this.nameLength = 200
    this.cellLength = 150
    // Healing above this counts as food; otherwise it's natural or overheal
    this.foodThreshold = 10
    // This may be different for player / monster, so lets make that Map (we want this ordered)
    this.playerElementMap = new Map([ ["Food",this.getFood], ["Damage (dph)", this.getDPH], ["Accuracy", this.getAccuracy], ["Max Hit", this.getMaxHit] ])
    this.monsterElementMap = new Map([ ["Kills (kph)",this.getCount], ["Damage (dph)", this.getDPH], ["Accuracy", this.getAccuracy], ["Max Hit", this.getMaxHit] ])
    this.playerTable = document.createElement("table")
    this.monsterTable = document.createElement("table")
  }
  resetRun(){
    this.startTime = Date.now()
    this.data = {}
    this.playerTableRowMap = {}
    this.monsterTableRowMap = {}
    delete this.bestiary
    this.bestiary = new Set()
    this.bestiaryAlbum = {}
    const rows = document.getElementsByClassName("dungeoneering-row");
    while( rows.length > 0 ){
      rows[0].parentNode.removeChild(rows[0]);
    }
  }
  run(obj, msg) {
    if( msg[0] == "combat hit" ){
      let info = msg[1];
      let target = info.source
      if( !(target in this.data) ){
        this.data[target] = {"type":"placeholder", "dps":0, "hits":0, "misses": 0, "food":28, "count":0, "maxhit":0}
      }
      this.data[target].dps += info.hit
      if( this.data[target].maxhit < info.hit && info.damageType != "heal"){
        this.data[target].maxhit = info.hit
      }
      if( info.damageType == "miss" ){
        this.data[target].misses += 1
      } else {
        this.data[target].hits += 1
      }
      if( info.damageType == "heal" ){
        if( info.hit > this.foodThreshold ){
          this.data[target].food -= 1
        }
      }
      this.updateStatsWindow(target);
    }
    if( msg[0] == "update player" ){
      let portion = msg[1].portion
      let value = msg[1].value
      if( portion.includes("actionQue") && (value.length > 0) ) {
        let info = value[0]
        if( "action" in info ){
          if( info.action == "combat" ){
            this.resetRun()
          }
        }
      }
    }
    if( msg[0] == "new monster" ){
      this.bestiary.add(msg[1].name)
      this.bestiaryAlbum[msg[1].name]=msg[1].image
    }
    if( msg[0] == "lootlog kill" ){
      let target = msg[1]
      if( !(target in this.data) ){
        this.data[target] = {"type":"placeholder", "dps":0, "hits":0, "misses": 0, "food":28, "count":0, "maxhit":0}
      }
      if( target in this.data ){
        this.data[target].count += 1
        this.updateStatsWindow(target)
      }
    }
  }
  updateStatsWindow(target){
    // Each monster/player is stored in a lookup TableRowMap (Dictionary)
    // The individual cells are updated from the ElementMap (Map)
    let tablerowmap = this.playerTableRowMap
    let elementmap = this.playerElementMap
    let table = this.playerTable
    if( this.bestiary.has(target) ){
      // If the bestiary has been updated after a monster was drawn in the player
      // area, go ahead and remove that row.
      if( target in tablerowmap ){
        tablerowmap[target].remove()
        delete tablerowmap[target]
      }
      tablerowmap = this.monsterTableRowMap
      elementmap = this.monsterElementMap
      table = this.monsterTable
    }
    // Check if tablerow already exists for target else create it
    if( !(target in tablerowmap) ){
      tablerowmap[target] = {} // new row
      let newrow = document.createElement("tr")
      newrow.className="dungeoneering-row"
      // Name and icon if available
      let namecell = document.createElement("td")
      namecell.innerText = `  ${target}`
      if( target in this.bestiaryAlbum ){
        let cellimg = document.createElement("img")
        cellimg.className="dungeoneering-icon"
        cellimg.src=this.bestiaryAlbum[target]
        namecell.prepend(cellimg)
      }
      newrow.append(namecell)
      for( let [key, value] of elementmap ){
        let newcell = document.createElement("td")
        //newcell.innerText = value(this, target)
        tablerowmap[target][key] = newcell
        newrow.append(newcell)
      }
      table.append(newrow)
    }
    // Update the cell values
    for( let [key, value] of elementmap ){
      tablerowmap[target][key].innerText = value(this, target)
    }
  }
  prepareTables(){
    // There will be two side-by-side tables, one for monsters and one for players in a flexbox
    // Instead of repainting, lets try appending and updating the tables for better performance
    this.mainFlexBox = document.createElement("div")
    this.mainFlexBox.className="dungeoneering-flex"
    // Table in a column for player
    let flexPlayerColumn = document.createElement("div")
    flexPlayerColumn.className="dungeoneering-flex-column"
    this.playerTable.className="dungeoneering-table"
    this.playerTable.id="dungeoneering-playertable"
    flexPlayerColumn.append(this.playerTable)
    // Table in a column for monster
    let flexMonsterColumn = document.createElement("div")
    flexMonsterColumn.className="dungeoneering-flex-column"
    this.monsterTable.className="dungeoneering-table"
    this.monsterTable.id="dungeoneering-monstertable"
    flexMonsterColumn.append(this.monsterTable)
    this.mainFlexBox.append(flexPlayerColumn)
    this.mainFlexBox.append(flexMonsterColumn)
    // Finally, we can have an arbitrary number of functions to map to a table element
    // Now lets specify the table widths based on element map size
    this.playerTable.style.width=`${this.nameLength + this.cellLength*this.playerElementMap.size}px`
    this.monsterTable.style.width=`${this.nameLength + this.cellLength*this.monsterElementMap.size}px`
    // Place headers on tables
    let playerHeader = document.createElement("tr")
    playerHeader.className="dungeoneering-header"
    let emptyPlayerHeader = document.createElement("th")
    emptyPlayerHeader.style.width=`${this.nameLength}px`
    playerHeader.append(emptyPlayerHeader)
    for( let [key, value] of this.playerElementMap ){
      let th = document.createElement("th")
      th.innerText = key
      playerHeader.append(th)
    }
    this.playerTable.append(playerHeader)
    let monsterHeader = document.createElement("tr")
    monsterHeader.className="dungeoneering-header"
    let emptyMonsterHeader = document.createElement("th")
    emptyMonsterHeader.style.width=`${this.nameLength}px`
    monsterHeader.append(emptyMonsterHeader)
    for( let [key, value] of this.monsterElementMap ){
      let th = document.createElement("th")
      th.innerText = key
      monsterHeader.append(th)
    }
    this.monsterTable.append(monsterHeader)
  }
  prepareSummaryBlock(){
    // Need to decide what's worth recording
    this.summaryMap = new Map()
    this.summaryDict = {}
    this.summaryDiv = document.createElement("div")
    this.summaryDiv.className="dungeoneering-summary"
    let header = document.createElement("h5")
    header.innerText = "Dungeoneering Log"
    this.summaryDiv.append(header)
    // Elapsed time
    let name = "Elapsed Time"
    this.summaryMap.set(name, this.getElapsedTime)
    let etime = document.createElement("p")
    this.summaryDict[name] = etime
    this.summaryDiv.append(etime)
    // Project time
    name = "Project Max AFK"
    this.summaryMap.set(name, this.getProjectedAFK)
    etime = document.createElement("p")
    this.summaryDict[name] = etime
    this.summaryDiv.append(etime)
  }
  updateSummaryBlock(self){
    for( let [key, value] of self.summaryMap ){
      self.summaryDict[key].innerText = `${key}: ${value(self)}`
    }
  }
  getElapsedTime(self){
    return timeFormat((Date.now() - self.startTime)/1000)
  }
  getProjectedAFK(self){
    let target = "none"
    for( const [key, value] of Object.entries(self.data) ){
      if( !(self.bestiary.has(key)) ){
        target = key
      }
    }
    if( target == "none" ){
      return "NaN"
    }
    let time = (Date.now() - self.startTime)/1000
    let foodUsed = 28 - self.data[target].food
    if( foodUsed < 1 ){
      return `> ${timeFormat( 28/(1 / time) )}`
    }
    return timeFormat( 28/( foodUsed / time ) )
  }
  // Each of the functions designed to fill a specific table cell
  getDPH(self, target){
    let totalDamage = self.data[target].dps
    let dpm = totalDamage/(Date.now() - self.startTime)*3600*1e3
    return `${dnum(totalDamage,1)} (${dnum(dpm,1)})`
  }
  getAccuracy(self, target){
    let acc = (self.data[target].hits)/(self.data[target].hits+self.data[target].misses)*100
    return `${dnum(acc,2)}%`;
  }
  getFood(self, target){
    return dnum( self.data[target].food, 0 )
  }
  getCount(self, target){
    let totalKills = self.data[target].count
    let kph = totalKills/(Date.now() - self.startTime)*3600*1e3
    return `${dnum(totalKills, 0)} (${dnum(kph,1)})`
  }
  getMaxHit(self, target){
    return `${dnum(self.data[target].maxhit,0)}`
  }
  // Build the initial chat window area from the stored tables and draw them
  // to the page.
  setupStatsWindow(promise) {
    promise = promise || new Promise(() => {});
    let self = this;
    const targetNodeHolder = document.getElementsByClassName("play-area-container");
    if(targetNodeHolder.length > 0) {
      promise.then();
    }
    else {
      setTimeout(function(){self.setupStatsWindow(promise);
                 }, 1000 );
      return false;
    }
    let chatSection = document.getElementsByClassName("chat-interface-container")[0]
    let chatTabs = chatSection.getElementsByClassName("chat-tabs")[0]
    let chatBoxes = chatSection.getElementsByClassName("chat-message-container-box")[0]
    // Create a new tab and prepend
    let dungeonChannel = document.createElement("div")
    let dimg = document.createElement("img")
    dimg.className="chat-tab-icon"
    dimg.src="/images/combat/attack_icon.png"
    dungeonChannel.className="chat-tab-channel"
    dungeonChannel.append(dimg)
    dungeonChannel.innerHTML+="Fite"
    dungeonChannel.id="ismonkey-dungeontab"
    chatTabs.prepend(dungeonChannel)
    self.addCSS();
    // Here we will have a hidden chat-overlay box to write in the stats
    let dungeonBox = document.createElement("div")
    dungeonBox.className="chat-message-container"
    dungeonBox.style.visibility="hidden"
    dungeonBox.style.zIndex=100
    dungeonBox.id = "ismonkey-dungeonbox"
    let dbList = document.createElement("div")
    dbList.className="chat-message-list css-13azwyo"
    dungeonBox.append(dbList)
    let dbHolder = document.createElement("div")
    dbHolder.className="css-y1c0xs"
    dbList.append(dbHolder)
    // Add the summary header
    dbHolder.append(this.summaryDiv)
    // Now insert the main flexbox
    let testMessage = document.createElement("div")
    testMessage.className="chat-message"
    testMessage.id="dungeoneering-statsmessage"
    testMessage.append(this.mainFlexBox)
    dbHolder.append(testMessage)
    chatBoxes.prepend(dungeonBox)
    // Lets make the tab do a thing
    function openChatBox(e){
      let chatTabs = chatSection.getElementsByClassName("chat-tabs")[0]
      dungeonBox.style.visibility="visible"
      for(let dom of chatTabs.getElementsByClassName("selected-channel")){
        dom.className="chat-tab-channel"
      };
      dungeonChannel.className="chat-tab-channel selected-channel";
      for( let tab of chatTabs.getElementsByClassName("chat-tab-channel") ){
        if( tab.id !== dungeonChannel.id ){
          tab.addEventListener("click", closeChatBox);
        }
      }
    }
    dungeonChannel.addEventListener("click", openChatBox);
    // We can make it so that any other tab hides it again
    function closeChatBox(e){
      dungeonBox.style.visibility="hidden"
      dungeonChannel.className="chat-tab-channel";
    }
    for( let tab of chatTabs.getElementsByClassName("chat-tab-channel") ){
      if( tab.id !== dungeonChannel.id ){
        tab.addEventListener("click", closeChatBox);
      }
    }
    self.summaryInterval = setInterval(()=>self.updateSummaryBlock(self), 1000)
  }
}
function dnum(num, p) {
    let snum = ""
    if( num > 1000000 ){
        snum = `${(num/1e6).toFixed(p)} M`
    }
    else if( num > 1000 ){
        snum = `${(num/1e3).toFixed(p)} k`
    }
    else{
        snum = `${(num).toFixed(p)}`
    }
    return snum
}

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
