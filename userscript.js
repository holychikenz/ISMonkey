// ==UserScript==
// @name         ISMonkey_Loader
// @version      0.1.3
// @description  ISMonkey Extension Loader 
// @author       Holychikenz
// @namespace    ISMonkey 
// @updateURL    https://raw.githubusercontent.com/Holychikenz/ISMonkey/userscript.js
// @downloadURL  https://raw.githubusercontent.com/Holychikenz/ISMonkey/userscript.js
// @match        https://www.idlescape.com/*
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/src/ISMonkey.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/spam.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function(){
  var ismonkey = new ISMonkey();

  ismonkey.addSocketExtension("spam", spam);
})();
