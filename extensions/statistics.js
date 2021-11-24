class Statistics {
  
  constructor (monkey, options) {
    this.monkey = monkey;
    this.options = options;
    this.data = {};

    this.insertStatisticsTab();
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

  insertStatisticsTab (promise) {
    let self = this;
    promise = promise || new Promise( ()=>{} );
    if (document.getElementsByClassName('nav-tab-container').length == 0) {
      setTimeout(function() { self.insertStatisticsTab(promise) }, 1000);
      return false;
    } else {
      promise.then();
    }

    let tab = document.createElement('div');
    tab.className = 'nav-tab noselect'

    let icon = document.createElement('img');
    icon.className = 'nav-tab-icon icon-border';
    icon.src = '/images/ui/hiscore_icon.png';

    tab.append(icon);
    tab.innerHTML += 'Statistics';

    let container = document.getElementsByClassName('nav-drawer-container')[0];
    container.append(tab);

    outerDiv.addEventListener('click', () => self.drawStatisticsPanel(self) );
  }

  drawStatisticsPanel (self) {
    let container = document.getElementsByClassName('right-panel-content')[0];
    container.clear();

    let panel = document.createElement('div');
    panel.className = 'statistics-panel';
    container.append(panel);

    panel.innerHTML = 'test123';

    function resetMenu(e) {
      if (!e.target.classList.contains('monkey')){
        panel.remove();
        document.removeEventListener('click', resetMenu);
      }
    }
    let listener = document.addEventListener('click', resetMenu);
  }

  fillSettingsDom(self, dom){
    dom.innerHTML="test";
  }
}