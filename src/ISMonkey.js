class ISMonkey {
  // ISMonkey is an extension manager that sets up the required
  // MutationObservers and serv socket to be used throughout.
  constructor() {
    this.eventList = [];
    this.setupSocket();
  }
  // Wait for socket to initialize and attach to this class
  setupSocket() {
    var self = this;
    self.sockets = [];
    const nativeWebSocket = window.WebSocket;
    window.WebSocket = function(...args){
      const socket = new nativeWebSocket(...args);
      self.sockets.push(socket);
      return socket;
    };
    let setupThisSocket = setInterval( ()=> {
      if( self.sockets.length != 0 ){
        clearInterval(setupThisSocket);
        self.sockets[0].addEventListener('message', (e) => self.messageHandler(self, e));
        console.log("Attached to socket");
      }
      console.log("waiting for socket ...");
    }, 1000);
  }

  // Message handler for sockets
  messageHandler(self, e) {
    let msg = ( (e.data).match(/^[0-9]+(\[.+)$/) || [] )[1];
    if( msg != null ) {
      let msg_parsed = JSON.parse(msg);
      let [r, data] = msg_parsed;
      self.eventList.forEach(e=>e.run(self, msg_parsed))
    }
  }

  addSocketExtension(name, call){
    this.eventList.push(call)
  }
}
