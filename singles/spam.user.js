// ==UserScript==
// @name         ISMonkeyLoader: Spam
// @version      0.3.3
// @description  ISMonkey Extension Loader
// @author       Holychikenz
// @namespace    ISMonkey
// @updateURL    https://raw.githubusercontent.com/holychikenz/ISMonkey/main/singles/spam.user.js
// @downloadURL  https://raw.githubusercontent.com/holychikenz/ISMonkey/main/singles/spam.user.js
// @match        *://*.idlescape.com/*
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/src/ISMonkey.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/spam.js
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
})();
