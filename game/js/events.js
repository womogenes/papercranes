// Custom event stuff!

function eventBaseEffect(event) {
  event.flag = true;
  event.uses -= 1;
}

var events = {
  projectsUnlocked: {
    trigger: function() {
      return cranes >= 15 && events.buyingPaperUnlocked.flag;
    },
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function() {
      this.loadEffect();
    },
    loadEffect: function() {
      unhide('projectsColumn');
    },
  },
  prestigeUnlocked: {
    trigger: function() {
      return cranes >= 1000;
    },
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function() {
      this.loadEffect();
    },
    loadEffect: function() {
      unhide('prestigeColumn');
    },
  },
  buyingPaperUnlocked: {
    trigger: function() {
      return paper <= 0;
    },
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function() {
      this.loadEffect();
    },
    loadEffect: function() {
      unhide('paperDiv');
    },
  },
  autoBuyPaper: {
    trigger: function() {
      return paper <= 0 && paperBuyerOn;
    },
    uses: -1,
    flag: false,
    notifyPlayer: false,
    effect: function() {
      buyPaper(1);
    },
  },
  maxedDebt: {
    description: 'You have reached max debt. The bank wants 50% of it paid now.',
    trigger: function() {
      return debt >= maxDebt;
    },
    uses: 1,
    flag: false,
    notifyPlayer: true,
    effect: function() {
      events.maxedDebt.update = setInterval(function() {
        if (debt <= maxDebt * .5) {
          this.uses = 1;
          this.flag = false;
          clearInterval(events.maxedDebt.update);
          closeEvent();
          return;
        }
        const buttonEls = events.maxedDebt.buttonEls;
        buttonEls['pay $100'].disabled = !money;
        buttonEls['sell a worker'].disabled = !(highSchoolers || professionals);
        buttonEls['default on loan'].disabled = (money || highSchoolers || professionals);
      }, 10);
    },
    loadEffect: function() {
      this.effect();
      displayEvent(this);
    },
    buttons: {
      'pay $100': function() {
        payBackLoan(100);
      },
      'sell a worker': function() {
        if (professionals) {
          professionals -= 1;
          debt -= professionalWage;
        } else if (highSchoolers) {
          highSchoolers -= 1;
          debt -= highSchoolerWage;
        }
      },
      'default on loan': function() {
        debt = 0;
        maxDebt -= 500;
      },
    },
    noCloseButton: true,
  },
};

// for things that use the eventDiv but are not events
var otherThings = {
  restart: {
    description: 'Are you sure you want to restart? \nThis will clear all your progress.',
    notifyPlayer: true,
    uses: 1,
    buttons: {
      'restart': function() {
        localStorage.clear();
        location.reload();
      },
      'cancel': function() {
        this.uses += 1;
        closeEvent();
      },
    },
    noCloseButton: true,
  },
};

generateInformation(events);
generateInformation(otherThings);
