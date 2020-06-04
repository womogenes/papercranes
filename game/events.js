
// Custom event stuff!
var events = [];

var prestigeUnlockedEvent = {
  id: "prestigeUnlockedEvent",
  title: "Unhide prestige column",
  description: "Prestige column gets unhidden.",
  trigger: function() {
    return cranes >= 1000;
  },
  uses: 1,
  flag: 0,
  notifyPlayer: true,
  effect: function() {
    column0DivEl.hidden = false;
    fade(column0DivEl, 1.0);
  }
}

events.push(prestigeUnlockedEvent);

var autobuyPaperEvent = {
  id: "autobuyPaperEvent",
  title: "Buy paper",
  description: "Automatically buy paper when it runs out.",
  trigger: function() {
    return paper <= 0 && paperBuyerOn;
  },
  uses: -1,
  flag: 0,
  notifyPlayer: false,
  effect: function() {
    buyPaper(1);
  }
}

events.push(autobuyPaperEvent);

var capDebtEvent = {
  id: "capDebtEvent",
  title: "Cap debt",
  description: "Automatically cap debt at maxDebt.",
  trigger: function() {
    return debt >= maxDebt;
  },
  uses: -1,
  flag: 0,
  notifyPlayer: false,
  effect: function() {
    debt = maxDebt;
  }
}

events.push(capDebtEvent);