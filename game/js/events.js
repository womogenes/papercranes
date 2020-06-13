// Custom event stuff!

function eventBaseEffect(event) {
  event.flag = true;
  event.uses -= 1;
}

var events = {
  prestigeUnlockedEvent: {
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
  buyingPaperUnlockedEvent: {
    trigger: function () {
      return paper <= 0;
    },
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide("paperDiv");
    }
  },
  autoBuyPaperEvent: {
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
    description: "Are you sure you want to restart? \nThis will clear all your progress.",
    notifyPlayer: true,
    uses: 1,
    buttons: {
      "restart": function () {
        localStorage.clear();
        location.reload();
      },
      "cancel": function () {
        this.uses += 1;
        closeEvent();
      }
    },
    noCloseButton: true
  }
}

generateInformation("event", events);
generateInformation("event", otherThings);