// ==UserScript==
// @name         ISMonkeyLoader
// @version      1.0.0
// @description  ISMonkey Extension Loader
// @author       Holychikenz
// @namespace    ISMonkey
// @updateURL    https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/ismonkey.user.js
// @downloadURL  https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/ismonkey.user.js
// @match        https://dev.idlescape.com/game
// @match        *://*dev.idlescape.com/*
// @require      https://raw.githubusercontent.com/HighOnMikey/idlescape-socketio-listener/main/src/idlescape-listener.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/src/ISMonkey.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/extensions/playerdata.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/extensions/dungeoneering.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/extensions/desktopnotifications.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/extensions/loottracking.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/extensions/looty.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/extensions/foodinfo.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/extensions/injectcss.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/extensions/jiggyslide.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/extensions/animationcancel.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/extensions/runecrafting.js
// @require      https://raw.githubusercontent.com/holychikenz/ISMonkey/refactor/extensions/smithing.js
// @require      https://raw.githubusercontent.com/platinumscott/ISMonkey/refactor/extensions/statistics.js
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
