// ==UserScript==
// @name         Dev_ISMonkeyLoader
// @version      0.3.4
// @description  ISMonkey Extension Loader Dev Branch
// @author       Holychikenz
// @namespace    ISMonkey
// @updateURL    https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/devismonkey.user.js
// @downloadURL  https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/devismonkey.user.js
// @match        *://*.idlescape.com/*
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/src/ISMonkey.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/playerdata.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/spam.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/foodinfo.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/injectcss.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/jiggyslide.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/animationcancel.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/runecrafting.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/smithing.js
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
  // ismonkey.addSocketExtension(new SpamExtension(ismonkey, options));
  // Mutation Observers / Async Extensions
  ismonkey.addAsyncExtension( new FoodInfo(ismonkey, options) );
  ismonkey.addAsyncExtension( new InjectCSS(ismonkey, options) );
  ismonkey.addAsyncExtension( new JiggySlide(ismonkey, options) );
  ismonkey.addAsyncExtension( new AnimationCancel(ismonkey, options) );
  ismonkey.addAsyncExtension( new Runecrafting(ismonkey, options) );
  ismonkey.addAsyncExtension( new Smithing(ismonkey, options) );
  // Callback Queue
})();
