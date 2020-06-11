// Custom event stuff!

function eventBaseEffect(event) {
  event.flag = true;
  event.uses -= 1;
}

var events = {
  prestigeUnlockedEvent: {
    title: "prestige unlocked",
    description: "Prestige column gets unhidden.",
    trigger: function () {
      // return true;
      return cranes >= 1000;
    },
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide("prestigeColumn");
    }
  },
  autoBuyPaperEvent: {
    title: "auto buy paper",
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
    title: "cap debt",
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

// for things that use the eventDiv but are not events
var otherThings = {
  restartEvent: {
    title: "restart",
    description: "Are you sure you want to restart? \nThis will clear all your progress.",
    notifyPlayer: true,
    effect: function () {},
    buttons: {
      "restart": function () {
        localStorage.clear();
        location.reload();
      },
      "cancel": function () {
        closeEvent();
      }
    },
    noCloseButton: true
  }
}

generateIds("event", events);
generateIds("event", otherThings);