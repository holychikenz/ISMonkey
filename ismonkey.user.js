// ==UserScript==
// @name         ISMonkeyLoader
// @version      0.3.2
// @description  ISMonkey Extension Loader
// @author       Holychikenz
// @namespace    ISMonkey
// @updateURL    https://raw.githubusercontent.com/holychikenz/ISMonkey/main/ismonkey.user.js
// @downloadURL  https://raw.githubusercontent.com/holychikenz/ISMonkey/main/ismonkey.user.js
// @match        *://*.idlescape.com/*
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/src/ISMonkey.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/playerdata.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/spam.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/foodinfo.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/injectcss.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/jiggyslide.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/animationcancel.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/runecrafting.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/smithing.js
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
