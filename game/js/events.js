// Custom event stuff!
var events = {
  prestigeUnlockedEvent: {
    title: "Prestige unlocked",
    description: "Prestige column gets unhidden.",
    trigger: function () {
      // return true;
      return cranes >= 1000;
    },
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      unhide("prestigeColumn");
    }
  },
  autoBuyPaperEvent: {
    title: "Auto buy paper",
    description: "Automatically buy paper when it runs out.",
    trigger: function () {
      return paper <= 0 && paperBuyerOn;
    },
    uses: -1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      buyPaper(1);
    }
  },
  capDebtEvent: {
    title: "Cap debt",
    description: "Automatically cap debt at maxDebt.",
    trigger: function () {
      return debt > maxDebt;
    },
    uses: -1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      debt = maxDebt;
    }
  }
}

for (var eventName in events) {
	var event = events[eventName];
	event.id = camelCase(`${event.title} event`);
}