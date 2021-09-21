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

// Todo
// 1. Update eliteChallenges after a player completes a new scroll
// 2. Get the scroll level (for drops) when doing a scroll
// 3. ...

// Other things that could be added
// 1. Chests and Myst Seeds
// 2. Some player feedback / incentive

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
      if( value.portion == "actionQue" ){
        if( value.value.action == "combat" ){
          // Something weird with zone "0" -- exit dungeon i guess
          // Need to be careful though, if players dodge certain monsters
          // we would spam the server, so maybe we need a cooldown.
          if( value.value.location == 0 ){
            this.deliverPayload(this)
          } else {
            this.currentZone = value.value.location
          }
        } else {
          this.deliverPayload(this)
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
    let killMap = this.data.selectMap(this.currentZone).selectMap(this.getTotalTH()).selectMap(this.scrollModifier).selectMap(this.groupSize).selectMap(this.isGroupLeader).selectMap(name);
    let lootMap = killMap.selectMap("loot")
    lootMap.set( loot[0], lootMap.select(loot[0],0) + loot[1] )
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
      // console.log(suburl)
      //console.log(suburl)
      //fetch(suburl, {mode:'no-cors',credentials:'omit',method:'GET'})
      let xml = new XMLHttpRequest()
      xml.open("GET", suburl)
      xml.send()
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