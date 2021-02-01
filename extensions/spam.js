class SpamExtension {
  constructor(monkey, options){
    // Reference the mother class enables the use of shared data
    this.monkey = monkey;
    this.options = options;
    this.setup();
  }
  setup(){
    this.filter = get(this.options, "filter", []);
    this.webpage = "<html><body></body></html>";
    this.owin = window.open("");
    this.webdom = this.owin.document.getElementsByTagName("BODY")[0];
  }
  run(obj, msg) {
    if( this.filter.includes(msg[0]) || this.filter.length == 0 ){
      this.webdom.innerHTML += `${JSON.stringify(msg)}<br/>`;
    }
  }
}
