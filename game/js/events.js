// Custom event stuff!

function eventBaseEffect(event) {
  event.flag = true;
  event.uses -= 1;
}

const events = {
  projectsUnlocked: {
    trigger: function () {
      return cranes >= 15 && events.buyingPaperUnlocked.flag;
    },
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('projectsColumn');
    },
  },
  prestigeUnlocked: {
    trigger: function () {
      return cranes >= 1000;
    },
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('wishDiv');
    },
  },
  buyingPaperUnlocked: {
    trigger: function () {
      return paper.amount <= 0;
    },
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('paperDiv');
    },
  },
  autoBuyPaper: {
    trigger: function () {
      return paper.amount <= 0 && paperBuyerOn;
    },
    uses: -1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      buyPaper(1);
    },
  },
  maxedDebt: {
    description: 'You have reached max debt. The bank wants 50% of it paid.',
    trigger: function () {
      return debt >= maxDebt && !this.flag;
    },
    uses: -1,
    flag: false,
    notifyPlayer: true,
    effect: function () {
      events.maxedDebt.update = setInterval(function () {
        if (debt <= maxDebt * .5) {
          events.maxedDebt.flag = false;
          clearInterval(events.maxedDebt.update);
          closeEvent();
          return;
        }
        const buttonEls = events.maxedDebt.buttonEls;
        buttonEls[0].disabled = money < 0.01;
        buttonEls[0].innerHTML = `Pay $${monify(Math.min(money / 2, debt - maxDebt / 2))}`;
        buttonEls[1].disabled = !(highSchoolers.amount || professionals.amount);
        buttonEls[2].disabled = (money > 0.01 || highSchoolers.amount || professionals.amount);
      }, 10);
    },
    loadEffect: function () {
      this.effect();
      displayEvent(this);
    },
    buttons: [{
        text: 'pay money',
        onClick: function () {
          payBackLoan(Math.min(money / 2, debt - maxDebt / 2));
        },
      },
      {
        text: 'sell a worker',
        onClick: function () {
          if (professionals.amount) {
            professionals.amount -= 1;
            debt -= professionals.wage;
          } else if (highSchoolers.amount) {
            highSchoolers.amount -= 1;
            debt -= highSchoolers.wage;
          }
        },
      },
      {
        text: 'default on loan',
        onClick: function () {
          debt = 0;
          maxDebt -= 500;
        },
      },
    ],
    noCloseButton: true,
  },
};

// events that don't need to be checked each interval
const otherEvents = {
  restart: {
    description: 'Are you sure you want to restart? \nThis will clear all your progress.',
    notifyPlayer: true,
    flag: false,
    effect: function () {
      if (!this.flag) {
        this.flag = true;
        displayEvent(this);
      }
    },
    buttons: [{
        text: 'restart',
        onClick: function () {
          localStorage.clear();
          location.reload();
        },
      },
      {
        text: 'cancel',
        onClick: function () {
          otherEvents.restart.flag = false;
          closeEvent();
        },
      },
    ],
    noCloseButton: true,
  },
  learnedToFoldCranes: {
    flag: false,
    save: ['flag'],
    notifyPlayer: false,
    effect: function () {
      this.flag = true;
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('foldingColumn');
      unhide('prestigeColumn');
      getEl('learnColumn').hidden = true;
    },
  },
};

generateInformation(events);
generateInformation(otherEvents);