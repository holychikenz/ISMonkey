class Statistics {
  
  constructor (monkey, options) {
    this.monkey = monkey;
    this.options = options;
    this.data = {};

    this.insertStatisticsMenu();
  }

  run (obj, msg) {
    if (msg[0] == "update player") {
      let portion = msg[1].portion;
      let value = msg[1].value;
      if (portion == "all") {
        console.log(value);
        this.data = value;
      }
    }
  }

  insertStatisticsMenu (promise) {
    let self = this;
    promise = promise || new Promise( ()=>{} );
    if (document.getElementsByClassName("nav-drawer-container").length == 0) {
      setTimeout(function() { self.insertStatisticsMenu(promise) }, 1000);
      return false;
    } else {
      promise.then();
    }

    let outerDiv = document.createElement("DIV");
    outerDiv.className="drawer-item active noselect monkey";
    let icon = document.createElement("IMG");
    icon.className="drawer-item-icon monkey";
    icon.src="/images/ui/hiscore_icon.png";
    let innerDiv = document.createElement("DIV");
    innerDiv.append(icon);
    innerDiv.className="monkey";
    innerDiv.innerHTML+="Statistics";
    outerDiv.append(innerDiv);
  }

  //   let container = document.getElementsByClassName("nav-drawer-container")[0];
  //   for( let i=0; i < container.children.length; i++ ){
  //     if( container.children[i].innerText.indexOf("Settings")>-1 ){
  //       container.insertBefore(outerDiv, container.children[i+1]);
  //       break;
  //     }
  //   }
  //   outerDiv.addEventListener('click', () => self.drawStatisticsMenu(self) );
  // }

  // drawStatisticsMenu (self) {
  //   let container = document.getElementsByClassName("play-area-container")[0];
  //   //container.innerHTML=""
  //   let icon = document.createElement("IMG");
  //   icon.className="nav-tab-icon icon-border monkey";
  //   icon.src="/images/ui/hiscore_icon.png";
  //   let innerDiv = document.createElement("DIV");
  //   innerDiv.append(icon);
  //   innerDiv.innerHTML+="Statistics";
  //   let tabName = container.getElementsByClassName("nav-tab-left")[0];
  //   let tabClone = tabName.cloneNode(true);
  //   document.getElementsByClassName("nav-tab-container")[0].prepend(tabClone);
  //   tabClone.innerHTML="";
  //   tabClone.append(innerDiv);
  //   tabClone.id="monkeySettings";
  //   tabName.style.display="none";
  //   // Setup Menu
  //   let playArea = container.getElementsByClassName("play-area")[0];
  //   let playClone = playArea.cloneNode(true);
  //   playClone.className="play-area monkey theme-default";
  //   playClone.innerHTML=""
  //   container.append(playClone)
  //   playArea.style.display="none";
  //   self.fillSettingsDom(self, playClone);

  //   function resetMenu(e) {
  //     if( !e.target.classList.contains("monkey") ){
  //       tabName.style.display="block";
  //       playArea.style.display="block";
  //       tabClone.remove();
  //       playClone.remove();
  //       document.removeEventListener("click", resetMenu);
  //     }
  //   }
  //   let listener = document.addEventListener("click", resetMenu);
  //   // Hide hamburger
  //   try{
  //     if( document.querySelectorAll(".nav-drawer-spacer.no-levels").length == 0 ){
  //       document.querySelector(".nav-drawer").className="nav-drawer drawer-closed";
  //     }
  //   } catch {}
  // }

  // fillSettingsDom(self, dom){
  //   dom.innerHTML=self.data.toString();
  // }
}