class DesktopNotifications {
  constructor(monkey, options){
    this.monkey = monkey;
    this.options = options;
    this.classname = "DesktopNotifications";
  }
  connect(){
    this.begin();
  }
  begn(promise){
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
      let nx = new Notification(JSON.stringify(value));
      nx.onclick = function(){window.focus(); this.close()}
    }
    if( msg[0] == "update player" ){
      if( "portion" in msg[1] ){
        if( msg[1].portion.includes("actionQue") ){
          if( msg[1].value.length == 0 ){
            let nx = new Notification("IDLE");
            nx.onclick = function(){window.focus(); this.close()}
          }
        }
      }
    }
  }
}
