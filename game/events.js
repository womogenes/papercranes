
// Custom event stuff!
var events = [];

var event1 = {
  id: "event1",
  title: "Unhide Prestige Column",
  description: "Prestige column gets unhidden.",
  trigger: function() {
    return cranes >= 1000;
  },
  uses: 1,
  flag: 0,
  effect: function() {
    wishUnlocked = true;
    column0DivEl.hidden = false;
    blink(column0DivEl, 1.0);
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
  uses: Infinity,
  flag: 0,
  effect: function() {
    buyPaper(1);
  }
}

events.push(event2);