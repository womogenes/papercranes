
// Custom event stuff!
var events = [];

var event1 = {
  id: "event1",
  title: "Unhide prestige column",
  description: "Prestige column gets unhidden.",
  trigger: function() {
    return cranes >= 1000;
  },
  uses: 1,
  flag: 0,
  effect: function() {
    wishUnlocked = true;
    column0DivEl.hidden = false;
    fade(column0DivEl, 1.0);
  }
}

events.push(event1);

var event2 = {
  id: "event2",
  title: "Buy paper",
  description: "Automatically buy paper when it runs out.",
  trigger: function() {
    return paper <= 0 && paperBuyerOn;
  },
  uses: -1,
  flag: 0,
  effect: function() {
    buyPaper(1);
  }
}

events.push(event2);

var event3 = {
  id: "event3",
  title: "Cap debt",
  description: "Automatically cap debt at maxDebt.",
  trigger: function() {
    return debt >= maxDebt;
  },
  uses: -1,
  flag: 0,
  effect: function() {
    debt = maxDebt;
  }
}

events.push(event3);