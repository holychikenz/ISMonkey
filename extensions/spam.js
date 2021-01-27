class SpamExtension {
  constructor(options){
    this.options = options;
    this.webpage = "<html><body></body></html>";
    this.owin = window.open("");
    this.webdom = this.owin.document.getElementsByTagName("BODY")[0];
  }
  run(obj, msg) {
    this.webdom.innerHTML += `${JSON.stringify(msg)}<br/>`;
  }
}
