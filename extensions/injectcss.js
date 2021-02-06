class InjectCSS {
  constructor(monkey, options){
    // Reference the mother class enables the use of shared data
    this.monkey = monkey;
    this.options = options;
    this.classname = "InjectCSS";
    this.injectCSS();
  }
  injectCSS(promise){
    let self = this;
    promise = promise || new Promise( ()=>{} );
    if(document.readyState !== 'complete'){
      setTimeout(function(){self.injectCSS(promise)}, 1000);
      return false;
    }
    else {
      promise.then();
    }

    var enchant_color = "#42aaff";

    var mystyle = document.createElement("style")
    mystyle.innerHTML=
    `
    .item-animating-gain {
      animation: none;
    }
    .item-animating-lose {
      animation: none;
    }
    .christmas-tier3 {
      background: #dddddd2e
      box-shadow: none;
      border: none;
    }
    .christmas-tier2 {
      background: #dddddd2e
      box-shadow: none;
      border: none;
    }
    .christmas-tier1 {
      background: #dddddd2e
      box-shadow: none;
      border: none;
    }
    .enchanted-text {
      color: ${enchant_color};
      font-weight: bold;
    }
    .item-enchant {
      width: 24px;
      height: 24px;
    }
    .core-container-combat {
      height: auto; /*increases usable space inside the combat zone area */
    }
    .Moss.base-monster-style, .Fire.base-monster-style, .Ice.base-monster-style {
      height: 450px;
    }
  
    .combat-monster-area .Fire, .combat-monster-area .Ice, .combat-monster-area .Moss {
      margin-top: 0px;
    }
    .combat-health, .attack-speed-animation, .combat-player-area progress {
      position: relative;
      top: 0px;
    }
    .combat-gear-container {
      z-index: 8;
    }
    div.item-enchant>img {
      background-color: rgba(0,0,0,0.8);
      border-radius: 15px;
    }
    div.item-enchant>img[src*="/crafting_icon"] {
      filter: hue-rotate(280deg) saturate(63%);
    }
    div.item-enchant>img[src*="shrimlord"] {
      filter: hue-rotate(83deg) saturate(122%);
    }
    div.item-enchant>img[src*="scholar_icon"] {
      filter: sepia(100%);
    }
    div.item-enchant>img[src*="pyromancy"] {
      filter: hue-rotate(102deg) saturate(200%) contrast(160%);
    }
    div.item-enchant>img[src*="wealth_icon"] {
      filter: hue-rotate(120deg) saturate(190%) contrast(122%);
    }
    div.item-enchant>img[src*="runecrafting_icon"] {
      filter: grayscale(100%) contrast(200%);
    }
    div.item-enchant>img[src*="healing_icon"] {
      filter: hue-rotate(45deg) saturate(144%);
    }
    div.item-enchant>img[src*="inferno_icon"] {
      filter: hue-rotate(102deg) saturate(160%) contrast(130%);
    }
    div.item-enchant>img[src*="chances_icon"] {
      filter: saturate(160%) contrast(130%);
    }
    div.item-enchant>img[src*="cooking_icon"] {
      filter: saturate(330%) contrast(150%) hue-rotate(260deg) grayscale(93%);
    }
    div.item-enchant>img[src*="treasurehunter_icon"] {
      filter: saturate(130%) contrast(120%) hue-rotate(131deg);
    }
    div.item-enchant>img[src*="fishing"] {
      filter: saturate(120%) contrast(150%) hue-rotate(280deg);
    }
    div.item-enchant>img[src*="efficiency_icon"] {
      filter: saturate(190%) contrast(100%) hue-rotate(88deg);
    }
    div.item-enchant>img[src*="recklessness_icon"] {
      filter: saturate(190%) contrast(100%) hue-rotate(300deg) grayscale(41%);
    }
    div.item-enchant>img[src*="superheated_icon"] {
      filter: saturate(240%) contrast(200%) hue-rotate(115deg) grayscale(50%) sepia(50%);
    }
    div.item-enchant>img[src*="demon_skin"] {
      filter: saturate(110%) contrast(160%) hue-rotate(76deg);
    }
    div.item-enchant>img[src*="demon_skin"] {
      filter: saturate(110%) contrast(160%) hue-rotate(76deg);
    }
    div.item-enchant>img[src*="gathering_icon"] {
      filter: saturate(210%) contrast(130%) hue-rotate(200deg);
    }
    div.item-enchant>img[src*="naturalist_icon"] {
      filter: saturate(210%) contrast(182%) hue-rotate(90deg) grayscale(55%);
    }
    div.item-enchant>img[src*="haste_icon"] {
      filter: saturate(200%) contrast(150%) hue-rotate(260deg);
    }
    div.item-enchant>img[src*="xp_increased"] {
      filter: contrast(140%) saturate(200%) hue-rotate(260deg);
    }
    .item-augment {
      font-size: 18px;
    }
    /*
    .message-success-augment {
      display: none;
    }
    .message-failed-augment {
      display: none;
    }
    */
    .lightgreen-text {
      color: #ffc107!important;
    }
    .combat-run-away {
      z-index: 100;
    }
    `
    document.body.appendChild(mystyle);
  }
}
