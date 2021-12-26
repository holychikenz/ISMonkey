// This extension creates a combat statistics summary in the chat window area
// designed to give you information about yourself and your party.
// A few known "bugs" and todo items
// - [ ] Overlay in combat window
//   - [ ] Auto-eat thresholds --> group not visible
//   - [ ] Food Remaining --> group not visible
// - [ ] Selecting the Fite chat box does not truly inactivate the previous window
//       It appears inactive, but does not show new messages
// - [ ] Mouseover for greater detail
class Dungeoneering {
  constructor(monkey, options){
    this.options = options
    this.monkey = monkey
  }
  connect(){
    this.config();
    if( typeof this.summaryInterval !== 'undefined' ){
      clearInterval(this.summaryInterval)
    }
    this.resetRun();
    this.prepareTables();
    this.prepareSummaryBlock();
    this.setupStatsWindow();
  }
  disconnect(){
    clearInterval(this.summaryInterval)
    //this.config();
    //this.resetRun();
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
    this.foodThreshold = 15
    this.currentAutoeat = 0
    // This may be different for player / monster, so lets make that Map (we want this ordered)
    this.playerElementMap = new Map([ ["Food",this.getFood], ["Damage (dph)", this.getDPH], ["Accuracy", this.getAccuracy], ["Dodge", this.getDodge], ["Max Hit", this.getMaxHit] ])
    this.monsterElementMap = new Map([ ["Kills (kph)",this.getCount], ["Damage (dph)", this.getDPH], ["Accuracy", this.getAccuracy], ["Dodge", this.getDodge], ["Max Hit", this.getMaxHit] ])
    this.playerTable = document.createElement("table")
    this.monsterTable = document.createElement("table")
  }
  resetRun(){
    this.startTime = Date.now()
    this.data = {}
    this.groupInfo = {}
    this.hitArray = []
    // DEBUG
    // setInterval( ()=>console.log("Length Hit Array", JSON.stringify(this.hitArray).replace(/[\[\]\,\"]/g,'').length, this.hitArray.length), 5000 )
    this.playerTableRowMap = {}
    this.monsterTableRowMap = {}
    delete this.bestiary
    this.bestiary = new Set()
    this.bestiaryAlbum = {}
    const rows = document.getElementsByClassName("dungeoneering-row");
    while( rows.length > 0 ){
      rows[0].parentNode.removeChild(rows[0]);
    }
    this.lastKillCount = 0
    this.lastTimeCounter = 1
    let tracker = this.monkey.extensions.LootTracking
    if( typeof(tracker) !== 'undefined' ){
      tracker.lootValue = 0
    }
  }
  run(obj, msg) {
    // Store and use all of the hit information
    if( msg[0] == "combat hit" ){
      let info = msg[1];
      this.hitArray.push(info);
      // Hit array size safety, tests show ~70 KB / element, so this will float up to 35MB or so
      if( this.hitArray.length > 550000 ){
        this.hitArray = this.hitArray.slice(50000)
      }
      let source = info.source
      let target = info.target
      if( !(source in this.data) ){
        this.data[source] = {"type":"placeholder", "dps":0, "hits":0, "misses": 0, "food":28, "count":0, "maxhit":0, "dodged":0, "notdodged":0}
      }
      if( !(target in this.data) ){
        this.data[target] = {"type":"placeholder", "dps":0, "hits":0, "misses": 0, "food":28, "count":0, "maxhit":0, "dodged":0, "notdodged":0}
      }
      if( this.data[source].maxhit < info.hit && info.damageType != "heal"){
        this.data[source].maxhit = info.hit
      }
      if( info.damageType == "miss" ){
        this.data[source].misses += 1
        this.data[target].dodged += 1
      } else if( info.damageType == "heal" ) {
        // Placeholder since we cannot tell the source of healing
        if( info.hit > this.foodThreshold ){
          this.data[source].food -= 1
        }
      } else {
        this.data[source].dps += info.hit
        this.data[source].hits += 1
        this.data[target].notdodged += 1
      }
      this.updateStatsWindow(source);
    }
    // Store player state
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
      this.updateEQInfoBoxCallback(this)
      // Initial loading for combat stats and inventory
      // Still cannot access group food though
      // if( portion.includes("all") ){
      //   let remainingFood = value.combatInventory.length;
      //   console.log("remaining food", remainingFood);
      // }
      if( portion.includes("group") ){
        this.groupInfo = value;
      }
      if( portion.includes("all") ){
        this.currentAutoeat = value.settings.combat.autoEatThreshold;
      }
      if( portion.includes("settings") ){
        this.currentAutoeat = value.combat.autoEatThreshold;
      }
    }
    // Increment monster
    if( msg[0] == "new monster" ){
      this.bestiary.add(msg[1].name)
      this.bestiaryAlbum[msg[1].name]=msg[1].image
    }
    // Get kills
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
    // Check to make sure we aren't in a bugged state
    if( !(elementmap instanceof Map) ){
      console.log("Attempting to reset Dungeoneering log -- out of sync");
      this.disconnect();
      this.connect();
      return;
    }
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
    // We need a download button for data
    let downloadButton = document.createElement("img")
    downloadButton.src = "https://www.svgrepo.com/show/17115/down-arrow-download-button.svg"
    downloadButton.id = "dungeonDownloadButton"
    downloadButton.className = "dungeonDownloadButton"
    let buttonCSS = `
    .dungeonDownloadButton {
      transition: all .2s ease-in-out;
      height: 15px;
      filter: invert(0.80);
      padding-left: 5px;
    }
    .dungeonDownloadButton:hover {
      transform: scale(1.2);
      filter: invert(1.0);
    }
    .dungeonDownloadButton:active {
      transform: scale(0.9);
      transition: all 0.02s ease-in-out;
    }`
    appendCSS(buttonCSS)
    // Need to decide what's worth recording
    this.summaryMap = new Map()
    this.summaryDict = {}
    this.summaryDiv = document.createElement("div")
    this.summaryDiv.className="dungeoneering-summary"
    let header = document.createElement("h5")
    header.innerText = "Dungeoneering Log"
    header.append(downloadButton)
    header.style.userSelect = "off"
    header.style.cursor = "pointer"
    header.addEventListener('click', function(){
      let sdiv = document.getElementsByClassName("dungeoneering-summary");
      if( sdiv.length > 0 ){
        for( let i of sdiv[0].getElementsByTagName("p") ){
          if( i.style.display == "none" ){
            i.style.display = "block";
          } else {
            i.style.display = "none";
          }
        }
      }
    })
    this.summaryDiv.append(header)
    // Elapsed time
    let name = "Elapsed Time"
    this.summaryMap.set(name, this.getElapsedTime)
    let etime = document.createElement("p")
    this.summaryDict[name] = etime
    this.summaryDiv.append(etime)
    // Project time
    name = "Estimated Max AFK"
    this.summaryMap.set(name, this.getProjectedAFK)
    etime = document.createElement("p")
    this.summaryDict[name] = etime
    this.summaryDiv.append(etime)
    // Kills (rate)
    name = "Kills (per hour)"
    this.summaryMap.set(name, this.getTotalKPH)
    etime = document.createElement("p")
    this.summaryDict[name] = etime
    this.summaryDiv.append(etime)
    // Gold
    name = "Gold (per hour)"
    this.summaryMap.set(name, this.getTotalGPH)
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
  getTotalKPH(self){
    if( (typeof self.lastKillCount == 'undefined') || (typeof self.lastTimeCounter == 'undefined') ){
      self.lastKillCount = 0
      self.lastTimeCounter = 1
    }
    let killcount = 0
    for( const [key, value] of Object.entries(self.data) ){
      if( self.bestiary.has(key) ){
        killcount += value.count
      }
    }
    if( killcount > self.lastKillCount ){
      self.lastKillCount = killcount
      self.lastTimeCounter = (Date.now() - self.startTime)/1000/3600
    }
    return `${self.lastKillCount} (${dnum(self.lastKillCount/self.lastTimeCounter,1)})`
  }
  getTotalGPH(self){
    if( (typeof self.lastKillCount == 'undefined') || (typeof self.lastTimeCounter == 'undefined') ){
      self.lastKillCount = 0
      self.lastTimeCounter = 1
    }
    // See if loottracker is enabled
    let tracker = self.monkey.extensions.LootTracking
    if( typeof(tracker) === 'undefined' ){
      return `Enable LootTracking in settings for GPH`
    }
    let gp = tracker.lootValue
    return `${dnum(gp,0)} (${dnum(gp/self.lastTimeCounter,1)})`
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
  getDodge(self, target){
    let dodge = (self.data[target].dodged)/(self.data[target].dodged+self.data[target].notdodged)*100
    return `${dnum(dodge,2)}%`;
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
  download(self){
    if( typeof(self.groupInfo) === 'undefined') {
      console.log("Download not ready, waiting for group info ...")
      return;
    }
    let combatData = {
      "groups": self.groupInfo,
      "attacks": self.hitArray
    };
    let filename = `combat_${Date.now()}.json`
    let a = document.createElement("a")
    let file = new Blob([JSON.stringify(combatData)], {type:'text/plain'})
    a.href = URL.createObjectURL(file)
    a.download = filename
    a.click()
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
    // Delete old lingering tab
    try {
      document.getElementById("ismonkey-dungeontab").remove();
    } catch {}
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
    chatBoxes.append(dungeonBox)
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
      for( let tab of chatTabs.getElementsByClassName("chat-tab-group") ){
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
      e.target.className="chat-tab-channel selected-channel";
    }
    for( let tab of chatTabs.getElementsByClassName("chat-tab-channel") ){
      if( tab.id !== dungeonChannel.id ){
        tab.addEventListener("click", closeChatBox);
      }
    }
    for( let tab of chatTabs.getElementsByClassName("chat-tab-group") ){
      if( tab.id !== dungeonChannel.id ){
        tab.addEventListener("click", closeChatBox);
      }
    }
    self.summaryInterval = setInterval(()=>self.updateSummaryBlock(self), 1000)
    // Download button
    let btn = document.getElementById("dungeonDownloadButton")
    btn.addEventListener('click', ()=>self.download(self))

    /// Observer for fight area
    const targetNode = targetNodeHolder[0];
    const config = {attributes: true, childList: false, subtree: true, characterData: true};
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      // Are we fighting
      let action = targetNode.getElementsByClassName("nav-tab-left")[0].innerText
      if( action === "Combat" ){
        // Add an element to write to if it does not exist
        let autoEatDom = document.getElementById("DungeonAutoEat");
        if( autoEatDom == null ){
          let container = document.createElement("div")
          container.style.opacity = "0.75";
          container.style.borderRadius = "3px";
          container.style.position = "absolute";
          container.style.top = "0";
          container.style.zIndex = "1000";
          container.style.backgroundColor = "#000";
          autoEatDom = document.createElement("span");
          autoEatDom.id = "DungeonAutoEat";
          container.append(autoEatDom)
          // See if combat fight container exists
          let fightContainer = targetNode.getElementsByClassName("combat-fight-container");
          if( fightContainer.length > 0 ){
            fightContainer[0].append(container);
          }
        }
        autoEatDom.innerText = `Auto-eat: ${self.currentAutoeat}%`;
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    /// Very simple observer for equipment area
    self.createEQInfoBox(self);
    const eqcallback = function(mutationsList, observer) {
      self.updateEQInfoBoxCallback(self)
    }
    const eqtab = document.querySelector(".nav-tab-container.right")
    const eqobserver = new MutationObserver(eqcallback);
    eqobserver.observe(eqtab, config);
    eqobserver.observe(targetNode, config);
  }
  updateEQInfoBoxCallback(self){
    let combat = document.querySelector(".combat-gear-container")
    let combatStats = document.querySelector(".combat-stats")
    if( combat !== null ){
      // Collect each stat
      // let statnums = (combat.innerText).match(/\d+/g).map(Number)
      // ... or we could just use player data?
      let pd = self.monkey.extensions.PlayerData
      let atkBonus = pd.combatStats.attackBonus
      let atkSpeed = pd.combatStats.attackSpeed
      let strBonus = pd.combatStats.strengthBonus.melee
      let strLevel = pd.skills.strength
      // Enchants too
      let patience = pd.getBuffStrength("Patience")
      let recklessness = pd.getBuffStrength("Recklessness")
      let accuracy = pd.getBuffStrength("Accuracy")
      let critical = pd.getBuffStrength("Critical Strike")
      // Next max hit
      let currentMax = Math.floor(1.3 + strLevel/10 + strBonus/80 + strLevel*strBonus/640)
      let reqBonus = ((1+currentMax) - (1.3 + strLevel/10))/(1/80+strLevel/640)
      // What do we want to know?
      self.EQinfo_minhit = Math.floor(1.0 + recklessness + patience*0.3*(atkSpeed-1)**2)
      self.EQinfo_maxhit = Math.floor(1.3 + strLevel/10 + strBonus/80 + strLevel*strBonus/640) + self.EQinfo_minhit
      self.EQinfo_averagehit = ( self.EQinfo_maxhit * (1 + 0.05*critical*0.3) + self.EQinfo_minhit )/2.0
      self.EQinfo_critmax = critical > 0 ? Math.floor( (self.EQinfo_maxhit - self.EQinfo_minhit + 1) * 1.3 + self.EQinfo_minhit - 1 ) : 0
      self.EQinfo_dps = self.EQinfo_averagehit / atkSpeed
      self.EQinfo_nextStrLevel = ( 1/(strBonus/640+0.1) ).toFixed(2) // Not even close, just the derivative
      self.EQinfo_nextStrBonus = reqBonus - strBonus
      if( combat.getElementsByClassName("EQInfoBox").length == 0 ){
        combat.insertBefore(self.EQInfoBox, combatStats)
        //combat.append(self.EQInfoBox)
      }
      self.updateEQInfoBox(self);
    }
  }
  createEQInfoBox(self){
    self.EQInfoBox = document.createElement("div")
    self.EQInfoBox.className = "EQInfoBox dungeoneering-table"
    self.EQInfoBox.style.backgroundColor = "rgba(0,0,0,0.7)";
    self.EQInfoBox.style.border = "2px solid hsla(0,0%,75.3%,.2)";
    // Table of stats
    let table = document.createElement("table")
    // HIT RANGE
    let damageRow = document.createElement("tr")
    let damageTitle = document.createElement("td")
    damageTitle.innerText = "Damage"
    let damageText = document.createElement("td")
    //damageText.innerText = `${self.EQinfo_minhit} &mdash; ${self.EQinfo_maxhit} (Crit here)`
    damageText.id = "EQInfo_damageText"
    damageRow.append(damageTitle)
    damageRow.append(damageText)
    table.append(damageRow)
    // DPS
    let dpsRow = document.createElement("tr")
    let dpsTitle = document.createElement("td")
    dpsTitle.innerText = "Max DPS"
    let dpsText = document.createElement("td")
    //dpsText.innerText = `${self.EQinfo_dps.toFixed(2)}`
    dpsText.id = "EQInfo_dpsText"
    dpsRow.append(dpsTitle)
    dpsRow.append(dpsText)
    table.append(dpsRow)
    // Strength Breakpoint
    let bpRow = document.createElement("tr")
    let bpTitle = document.createElement("td")
    bpTitle.innerText = "Next Strength"
    let bpText = document.createElement("td")
    //bpText.innerText = `${self.EQinfo_nextStrBonus.toFixed(2)}`
    bpText.id = "EQInfo_bpText"
    bpRow.append(bpTitle)
    bpRow.append(bpText)
    table.append(bpRow)
    // Finish up
    self.EQInfoBox.append(table)
  }
  updateEQInfoBox(self){
    let damageText = document.getElementById("EQInfo_damageText")
    let dpsText = document.getElementById("EQInfo_dpsText")
    let bpText = document.getElementById("EQInfo_bpText")
    damageText.innerText = `${self.EQinfo_minhit} – ${self.EQinfo_maxhit} (${self.EQinfo_critmax})`
    dpsText.innerText = `${self.EQinfo_dps.toFixed(2)}`
    bpText.innerText = `${self.EQinfo_nextStrBonus.toFixed(2)}`
  }
}
function appendCSS(css){
  let style = document.createElement('style');
  if(style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  document.head.append(style);
}
//function dnum(num, p) {
//    let snum = ""
//    if( num > 1000000 ){
//        snum = `${(num/1e6).toFixed(p)} M`
//    }
//    else if( num > 1000 ){
//        snum = `${(num/1e3).toFixed(p)} k`
//    }
//    else{
//        snum = `${(num).toFixed(p)}`
//    }
//    return snum
//}
//
//function numberWithCommas(x) {
//  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//}
//
//function timeFormat(time){
//  time = Math.floor(time);
//  let hours = Math.floor(time/3600);
//  let minutes = Math.floor((time-(hours*3600))/60);
//  let seconds = time - (hours*3600) - (minutes*60);
//  if( hours < 10 ){hours = `0${hours}`;}
//  if( minutes < 10 ){minutes = `0${minutes}`;}
//  if( seconds < 10 ){seconds = `0${seconds}`;}
//  return `${hours}:${minutes}:${seconds}`;
//}
//