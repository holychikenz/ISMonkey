class Statistics {

  constructor (monkey, options) {
    this.monkey = monkey;
    this.options = options;
    this.data = {};
    this.otherTabs = [];
    this.tab = null;
    this.panel = null;

    this.zoneIDs = [
      [12, 'Farm'],
      [23, 'Caves'],
      [11, 'City'],
      [13, 'Lava Maze'],
      [28, 'Corrupted Lands'],
      [27, 'Valley of Giants'],
      [29, 'Chaos Wastes'],
    ];

    this.monsters = {
      1: { name: 'Chicken', image: 'chicken.png' },
    };

    this.insertStatisticsTab();
  }

  getMonsterName(monsterID) {
    if (monsterID in this.monsters) {
      return this.monsters[monsterID].name;
    }
    return monsterID;
  }

  getMonsterImage(monsterID) {
    if (monsterID in this.monsters) {
      return this.monsters[monsterID].image;
    }
    return monsterID + '.png';
  }

  addCSS () {
    var style = document.createElement('style');
    style.innerHTML=
      `
      .statistics-panel-inner {
        display: grid;
        grid-template-columns: 50% 50%;
      }

      .statistics-grid-item {
        padding: 25px;
      }

      .statistics-grid-item strong {
        font-size: 125%;
      }

      .statistics-monsters {
        display: grid;
      }

      .statistics-grid-item .img-wrapper {
        padding-bottom: 10px;
      }

      .statistics-grid-item img {
        width: 50px;
      }
      `
    document.body.appendChild(style)
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

  // TODO: Move these to some utility fn file.
  selectTab(el) {
    el.classList.add('selected-tab');
  }

  deselectTab(el) {
    el.classList.remove('selected-tab');
  }

  hide(el) {
    if (el) el.style.display = 'none';
  }

  show(el) {
    if (el) el.style.display = '';
  }

  insertStatisticsTab (promise) {
    let self = this;
    promise = promise || new Promise( ()=>{} );
    if (document.getElementsByClassName('game-right-panel').length == 0) {
      setTimeout(function() { self.insertStatisticsTab(promise) }, 1000);
      return false;
    } else {
      promise.then();
    }

    self.addCSS();
    self.otherTabs = document.querySelectorAll('.game-right-panel .nav-tab-container div');

    self.tab = document.createElement('div');
    self.tab.className = 'nav-tab noselect'

    let icon = document.createElement('img');
    icon.className = 'nav-tab-icon icon-border';
    icon.src = '/images/ui/hiscore_icon.png';

    self.tab.append(icon);
    self.tab.innerHTML += 'Statistics';

    let container = document.getElementsByClassName('game-right-panel')[0].children[0];
    container.append(self.tab);

    self.tab.addEventListener('click', () => self.drawStatisticsPanel(self) );
    self.otherTabs.forEach((el) => {
      el.addEventListener('click', () => {
        self.deselectTab(self.tab);
        self.hide(self.panel);
      })
    });
  }

  drawStatisticsPanel (self) {
    self.otherTabs.forEach(self.deselectTab);
    self.selectTab(self.tab);

    let otherPanels = document.querySelectorAll('.inventory-panel, .combat-gear-container, .game-right-panel-social');
    otherPanels.forEach(self.hide);

    if (!self.panel) {
      self.panel = document.createElement('div');
      self.panel.className = 'statistics-panel';

      let inner = document.createElement('div');
      inner.className = 'statistics-panel-inner';
      self.panel.append(inner);

      let container = document.getElementsByClassName('right-panel-content')[0];
      container.append(self.panel);

      for (let i in self.zoneIDs) {
        let zoneID = self.zoneIDs[i][0];
        let zoneName = self.zoneIDs[i][1];
        if (zoneID in self.data.data.monsterKills) {
          var kills = self.data.data.monsterKills[zoneID];
          var gridItem = document.createElement('div');
          gridItem.className = 'statistics-grid-item';
          gridItem.innerHTML = '<strong> ' + zoneName + '</strong><div class="statistics-monsters">';
          for (let monsterID in kills) {
              let name = self.getMonsterName(monsterID);
              let image = self.getMonsterImage(monsterID);
              gridItem.innerHTML += '<div class="img-wrapper"><img src="https://idlescape.com/images/combat/monsters/' + image + '" alt="' + name + '"></div>' + kills[monsterID];
          }
          gridItem.innerHTML += '</div>'
          inner.append(gridItem);
        }
      }
    }

    self.show(self.panel);
  }
}
