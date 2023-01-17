class DesktopNotifications {
  constructor(monkey, options){
    this.monkey = monkey;
    this.options = options;
    this.classname = "DesktopNotifications";
  }
  connect(){
    this.begin();
  }
  begin(promise){
    let self = this;
    promise = promise || new Promise( ()=>{} );
    if( document.readyState == 'complete' ){
      promise.then();
    } else {
      setTimeout(function(){self.begin(promise)}, 1000);
      return false;
    }
    Notification.requestPermission();
  }
  run(obj, msg){
    if( msg[0] == "play sound" ){
      let value = msg[1];
      this.displayMessage(value);
    }
    if( msg[0] == "update:player" ){
      if( "portion" in msg[1] ){
        if( msg[1].portion.includes("actionQueue") ){
          if( msg[1].value == null ){
            this.displayMessage({type: "Idle"});
          }
        }
      }
    }
  }
  displayMessage(message) {
    let msgType = message.type
    let fullMessage = JSON.stringify(message)
    let note = new Notification( fullMessage, {
      icon: "favicon.ico",
      tag: msgType,
    });
    note.onclick = function(){window.focus(); this.close()};
    setTimeout(()=>{ note.close() }, 10*1000);
  }
}
