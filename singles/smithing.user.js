// ==UserScript==
// @name         ISMonkeyLoader: Smithing 
// @version      0.3.1
// @description  ISMonkey Extension Loader
// @author       Holychikenz
// @namespace    ISMonkey
// @updateURL    https://raw.githubusercontent.com/holychikenz/ISMonkey/main/singles/smithing.user.js
// @downloadURL  https://raw.githubusercontent.com/holychikenz/ISMonkey/main/singles/smithing.user.js
// @match        *://*.idlescape.com/*
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/src/ISMonkey.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/smithing.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/playerdata.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function(){
  // ISMonkeyLoader Extensions
  var ismonkey = new ISMonkey();
  var options = {};
  // Preload
  ismonkey.addSocketExtension(new PlayerData(ismonkey, options));
  // Socket Listeners
  // Mutation Observers / Async Extensions
  ismonkey.addAsyncExtension( new Smithin(ismonkey, options) );
})();
