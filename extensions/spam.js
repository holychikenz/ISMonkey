class spam {
  constructor(){
    this.webpage = "<html><body></body></html>";
    this.opened = window.open("");
    this.webdom = opened.document.getElementsByTagName("BODY")[0];
  }
  run(obj, msg) {
    this.webdom.innerHTML += `${JSON.stringify(msg)}<br/>`;
  }
}
