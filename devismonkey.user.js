// ==UserScript==
// @name         Dev_ISMonkeyLoader
// @version      0.7.4
// @description  ISMonkey Extension Loader Dev Branch
// @author       Holychikenz
// @namespace    ISMonkey
// @updateURL    https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/devismonkey.user.js
// @downloadURL  https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/devismonkey.user.js
// @match        *://*.idlescape.com/*
// @require      https://raw.githubusercontent.com/HighOnMikey/idlescape-socketio-listener/main/src/idlescape-listener.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/src/ISMonkey.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/playerdata.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/foodinfo.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/dungeoneering.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/desktopnotifications.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/loottracking.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/looty.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/injectcss.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/jiggyslide.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/animationcancel.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/runecrafting.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/dev/extensions/smithing.js
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
  ismonkey.addSocketExtension( DesktopNotifications, options );
  ismonkey.addSocketExtension( LootTracking, options );
  ismonkey.addSocketExtension( Statistics, options );
  ismonkey.addSocketExtension( FoodInfo, options );
  ismonkey.addSocketExtension( Looty, options );
  // Mutation Observers / Async Extensions
  ismonkey.addAsyncExtension( InjectCSS, options );
  ismonkey.addAsyncExtension( JiggySlide, options );
  ismonkey.addAsyncExtension( AnimationCancel, options );
  ismonkey.addAsyncExtension( Runecrafting, options );
  ismonkey.addAsyncExtension( Smithing, options );
  // Callback Queue
})();
