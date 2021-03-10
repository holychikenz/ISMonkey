// ==UserScript==
// @name         ISMonkeyLoader: JiggySlide
// @version      0.3.2
// @description  ISMonkey Extension Loader
// @author       Holychikenz
// @namespace    ISMonkey
// @updateURL    https://raw.githubusercontent.com/holychikenz/ISMonkey/main/singles/jiggyslide.user.js
// @downloadURL  https://raw.githubusercontent.com/holychikenz/ISMonkey/main/singles/jiggyslide.user.js
// @match        *://*.idlescape.com/*
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/src/ISMonkey.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/jiggyslide.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function(){
  // ISMonkeyLoader Extensions
  var ismonkey = new ISMonkey();
  var options = {};
  // Socket Listeners
  // Mutation Observers / Async Extensions
  ismonkey.addAsyncExtension( new JiggySlide(ismonkey, options) );
})();
