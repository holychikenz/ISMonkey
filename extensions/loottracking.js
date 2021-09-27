Map.prototype.select = function(a , b){
  if( this.has(a) ){
    return this.get(a);
  } else {
    this.set(a, b);
    return this.get(a);
  }
}
Map.prototype.selectMap = function(a){
  return this.select(a, new Map());
}

class LootTracking{
  constructor(monkey, options){
    this.options = options
    this.monkey = monkey
  }
  connect(){
    let self = this
    self.config();
    if( self.interval !== 'undefined' ){
      clearInterval(self.interval)
    }
    self.interval = setInterval(()=>self.deliverPayload(self), 30*60*1000);
  }
  config(){
    this.data = new Map();
    // Need to store certain data which is important to the logs that does not
    // come with the lootlog message.
    this.eliteChallenges = {}
    this.currentTreasureHunter = 0
    this.currentZone = 0
    this.isGroupLeader = 0
    this.groupSize = 0
    this.scrollModifier = 0
    this.cooldown = 5*60*1000 // 5 minutes
    this.lastSubmission = 0 // First submission is free
  }
  resetRun(){
  }
  run(obj, msg) {
    let index = msg[0]
    let value = msg[1]
    // Meta data
    if( index == "update player" ){
      if( value.portion == "combatArea" ){
        this.currentZone = value.value
      }
      // Todo, complete a new elite challenge and get update message
      if( value.portion == "all" ){
        this.eliteChallenges = value.value.eliteChallenges
      }
      if( value.portion.includes("eliteChallenges") ){
        this.eliteChallenges = value.value
      }
      if( value.portion == "actionQue" ){
        if( value.value.length > 0 ){
          let inner = value.value[0]
          if( typeof inner.action !== 'undefined' ){
            if( inner.action == "combat" ){
              // Something weird with zone "0" -- exit dungeon i guess
              // Need to be careful though, if players dodge certain monsters
              // we would spam the server, so maybe we need a cooldown.
              if( inner.location == 0 ){
                this.deliverPayload(this)
              } else {
                this.currentZone = inner.location
              }
              // Check for scroll stuff -- use increasedTreasureHunter
              if( typeof inner.actionData !== 'undefined' ){
                let actiondata = inner.actionData
                if( typeof actiondata.server !== 'undefined' ){
                  let increasedTreasureHunter = actiondata.server.increasedTreasureHunter
                  if( typeof increasedTreasureHunter !== 'undefined' ){
                    this.scrollModifier = increasedTreasureHunter
                  }
                }
              } else {
                this.scrollModifier = 0
              }
            } else {
              this.deliverPayload(this)
            }
          }
        }
      }
      // Groups
      if( value.portion == "group" ){
        this.groupSize = value.value.length
      }
      if( value.portion == "groupLeader" ){
        if( value.value == this.monkey.extensions.PlayerData.username ){
          this.isGroupLeader = 1
        } else {
          this.isGroupLeader = 0
        }
      }
    }
    // Record lootlog information
    if( index == "lootlog kill" ){
      let person = value
      this.increaseKill(person)
    }
    if( index == "lootlog loot" ){
      let person = value.name
      let loot = value.loot
      this.addLoot(person, loot)
    }
    // We can send the payload off early when a zone is left (or dungeon is complete)
  }
  getTotalTH(){
    let enchant = this.monkey.extensions.PlayerData.getBuffStrength("Treasure Hunter")
    let zoneTH = get(this.eliteChallenges, this.currentZone, 0)
    return enchant + zoneTH
  }

  // ["zoneid"]["TH"]["ScrollMod"]["grouplead"]["groupsize"]["MonsterID"] = {"kills"=Int, "drops"=[drop]}
  increaseKill(name){
    // Dropping through the data structure
    let killMap = this.data.selectMap(this.currentZone).selectMap(this.getTotalTH()).selectMap(this.scrollModifier).selectMap(this.groupSize).selectMap(this.isGroupLeader).selectMap(name);
    killMap.set("kills", killMap.select("kills", 0)+1);
  }
  addLoot(name, loot){
    // This will bias our selection a little, but should ensure we don't spam too much data
    // If an item rolls more than 10 on any given roll, then we will assume it is uniform with
    // some predetermined min-max; otherwise it is using the loot multiplier. Loot will be organized
    // as "name":{ "multiplicity": {}, "total": int, "minimum": int, "maximum": int }
    let killMap = this.data.selectMap(this.currentZone).selectMap(this.getTotalTH()).selectMap(this.scrollModifier).selectMap(this.groupSize).selectMap(this.isGroupLeader).selectMap(name);
    let lootMap = killMap.selectMap("loot").selectMap(loot[0]);
    let unique = lootMap.selectMap("multiplicity");
    if( loot[1] < 10 ){ //arbitrary
      unique.set( loot[1], unique.select( loot[1], 0 ) + 1 );
    }
    lootMap.set( "total", lootMap.select("total",0) + loot[1] );
    lootMap.set( "minimum", Math.min( lootMap.select("minimum", 1e9), loot[1] ) );
    lootMap.set( "maximum", Math.max( lootMap.select("maximum", 0), loot[1] ) );
    //lootMap.set( loot[0], lootMap.select(loot[0],0) + loot[1] )
    if( lootMap.get("maximum") >= 10 ){
      unique.clear()
    }
    //console.log(JSON.stringify(toJSobject(this.data)))
  }
  deliverPayload(self){
    if( Date.now() - self.lastSubmission < self.cooldown ){
      return
    }
    if( self.data.size > 0 ){
      let payload = JSON.stringify(toJSobject(self.data));
      // let suburl = `http://127.0.0.1:5000/?data=${payload}`
      let suburl = `https://ismonkey.xyz/?data=${payload}`
      //console.log(suburl)
      // console.log(suburl)
      fetch(suburl, {mode:'no-cors',credentials:'omit',method:'GET'})
      //let xml = new XMLHttpRequest()
      //xml.open("GET", suburl)
      //xml.send()
      delete self.data;
      self.data = new Map();
      self.lastSubmission = Date.now()
    }
  }
}
const toJSobject = (map = new Map) =>
  Object.fromEntries
    ( Array.from
       (map.entries(), ([k, v]) => v instanceof Map ? [k, toJSobject(v)] : [k, v] )
     );