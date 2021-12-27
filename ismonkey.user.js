// ==UserScript==
// @name         ISMonkeyLoader
// @version      0.5.19
// @description  ISMonkey Extension Loader
// @author       Holychikenz
// @namespace    ISMonkey
// @updateURL    https://raw.githubusercontent.com/holychikenz/ISMonkey/main/ismonkey.user.js
// @downloadURL  https://raw.githubusercontent.com/holychikenz/ISMonkey/main/ismonkey.user.js
// @match        *://*.idlescape.com/*
// @require      https://raw.githubusercontent.com/HighOnMikey/idlescape-socketio-listener/main/src/idlescape-listener.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/src/ISMonkey.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/playerdata.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/dungeoneering.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/loottracking.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/foodinfo.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/injectcss.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/jiggyslide.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/animationcancel.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/runecrafting.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/main/extensions/smithing.js
// @require      https://raw.githubusercontent.com/platinumscott/ISMonkey/main/extensions/statistics.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function(){
  IdlescapeSocketListener.attach();
  // ISMonkeyLoader Extensions
  var ismonkey = new ISMonkey();
  var options = {};
  // Preload
  ismonkey.addSocketExtension( PlayerData, options );
  // Socket Listeners
  ismonkey.addSocketExtension( Dungeoneering, options );
  ismonkey.addSocketExtension( LootTracking, options );
  ismonkey.addSocketExtension( Statistics, options );
  ismonkey.addSocketExtension( FoodInfo, options );
  // Mutation Observers / Async Extensions
  ismonkey.addAsyncExtension( InjectCSS, options );
  ismonkey.addAsyncExtension( JiggySlide, options );
  ismonkey.addAsyncExtension( AnimationCancel, options );
  ismonkey.addAsyncExtension( Runecrafting, options );
  ismonkey.addAsyncExtension( Smithing, options );
  // Callback Queue
})();
