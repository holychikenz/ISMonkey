// ==UserScript==
// @name         ISMonkeyLoader: Animation Cancel
// @version      0.4.1
// @description  ISMonkey Extension Loader
// @author       Holychikenz
// @namespace    ISMonkey
// @updateURL    https://raw.githubusercontent.com/holychikenz/ISMonkey/main/singles/animationcancel.user.js
// @downloadURL  https://raw.githubusercontent.com/holychikenz/ISMonkey/main/singles/animationcancel.user.js
// @match        *://*.idlescape.com/*
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/src/ISMonkey.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/animationcancel.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function(){
  // ISMonkeyLoader Extensions
  var ismonkey = new ISMonkey();
  var options = {};
  // Socket Listeners
  // Mutation Observers / Async Extensions
  ismonkey.addAsyncExtension( AnimationCancel, options );
  // Callback Queue
})();
