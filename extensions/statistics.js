class Statistics {

  constructor (monkey, options) {
    this.monkey = monkey;
    this.options = options;
    this.data = {};
    this.otherTabs = [];
    this.tab = null;
    this.panel = null;
    this.fmt = new Intl.NumberFormat();

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
      2: { name: 'Cow', image: 'cow.png' },
      3: { name: 'Goblin', image: 'goblin.png' },
      4: { name: 'Rat', image: 'rat.png' },
      7: { name: 'Imp/Greater Imp', image: 'imp.png' },
      5: { name: 'Guard', image: 'guard.svg' },
      10: { name: 'Black Knight', image: 'black_knight.png' },
      9: { name: 'Lesser Demon', image: 'lesser_demon_no_highlight.png' },
      8: { name: 'Deadly Red Spider', image: 'deadly_red_spider.png' },
      20: { name: 'Bone Giant', image: 'bone_giant.png' },
      21: { name: 'Infected Naga', image: 'infected_naga.png' },
      22: { name: 'Corrupted Tree', image: 'corrupted_tree.png' },
      13: { name: 'Fire Giant', image: 'fire_giant.png' },
      14: { name: 'Moss Giant', image: 'moss_giant.png' },
      15: { name: 'Ice Giant', image: 'ice_giant.png' },
      23: { name: 'Chaos Giant', image: 'chaos_giant.png' },
      34: { name: 'Chaotic Abomination', image: 'chaotic_abomination.png' },
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
        padding: 5px;
      }

      .statistics-grid-item {
        padding: 35px 35px 15px;
        width: 100%;
        border-image-source: url(/images/ui/stone-9slice.png);
        border-image-slice: 100 fill;
        border-image-width: 100px;
        border-image-outset: 0;
        border-image-repeat: repeat;
        text-align: center;
      }

      .statistics-monsters {
        display: grid;
        grid-template-columns: 25% 25% 25% 25%;
      }

      .statistics-monsters > div {
        width: 75px;
        text-align: center;
      }

      .statistics-grid-item .img-wrapper {
        padding: 5px 8px;
        height: 75px;
      }

      .statistics-grid-item img {
        max-width: 50px;
        max-height: 50px;
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
        self.getOtherPanels().forEach(self.show);
        self.selectTab(el);
      })
    });
  }

  getOtherPanels() {
      return document.querySelectorAll('.inventory-panel, .combat-gear-container, .game-right-panel-social');
  }

  drawStatisticsPanel (self) {
    self.otherTabs.forEach(self.deselectTab);
    self.selectTab(self.tab);
    self.getOtherPanels().forEach(self.hide);

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
          gridItem.innerHTML = '<h5> ' + zoneName + '</h5>';
          let monstersHTML = '<div class="statistics-monsters">';
          for (let monsterID in kills) {
              let name = self.getMonsterName(monsterID);
              let image = self.getMonsterImage(monsterID);
             monstersHTML += '<div>' + self.fmt.format(kills[monsterID]) + '<div class="img-wrapper"><img src="https://idlescape.com/images/combat/monsters/' + image + '" alt="' + name + '"></div></div>';
          }
          monstersHTML += '</div>';
          gridItem.innerHTML += monstersHTML;
          inner.append(gridItem);
        }
      }
    }

    self.show(self.panel);
  }
}
