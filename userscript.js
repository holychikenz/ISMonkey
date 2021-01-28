// ==UserScript==
// @name         ISMonkeyLoader
// @version      0.1.7
// @description  ISMonkey Extension Loader
// @author       Holychikenz
// @namespace    ISMonkey
// @updateURL    https://raw.githubusercontent.com/holychikenz/ISMonkey/main/userscript.js
// @downloadURL  https://raw.githubusercontent.com/holychikenz/ISMonkey/main/userscript.js
// @match        https://www.idlescape.com/*
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/src/ISMonkey.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/spam.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/foodinfo.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function(){
  // ISMonkeyLoader Extensions
  var ismonkey = new ISMonkey();
  var options = {};
  // Socket Listeners
  ismonkey.addSocketExtension(new SpamExtension(ismonkey, options));
  // Mutation Observers / Async Extensions
  ismonkey.addAsyncExtension( new FoodInfo(ismonkey, options) );
  // Callback Queue
})();
