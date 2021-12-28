// Loadout viewer and selector. This will require modification of the
// IdlescapeSocketListener, and special permissions to run in order to
// send information over the socket.
class Loadouts{
  constructor(monkey, options){
    this.options = options
    this.monkey = monkey
  }
  connect(){
  }
  config(){
  }
  run(obj, msg) {
    let index = msg[0]
    let value = msg[1]
  }
}
