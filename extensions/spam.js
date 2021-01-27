// Test of the above
(function(){
  var ismonkey = new ISMonkey()

  var webpage = "<html><body></body></html>";
  var opened = window.open("");
  let webdom = opened.document.getElementsByTagName("BODY")[0];

  function spam(obj, msg) {
    webdom.innerHTML += `${JSON.stringify(msg)}<br/>`;
  }

  ismonkey.addSocketExtension("span", spam);
})();

