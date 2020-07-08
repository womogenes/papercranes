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
      unhide('prestigeColumn');
    },
  },
  buyingPaperUnlocked: {
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
      unhide('paperDiv');
    },
  },
  autoBuyPaper: {
    trigger: function () {
      return paper <= 0 && paperBuyerOn;
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
      return debt >= maxDebt;
    },
    uses: 1,
    flag: false,
    notifyPlayer: true,
    effect: function () {
      events.maxedDebt.update = setInterval(function () {
        if (debt <= maxDebt * .5) {
          this.uses = 1;
          this.flag = false;
          clearInterval(events.maxedDebt.update);
          closeEvent();
          return;
        }
        const buttonEls = events.maxedDebt.buttonEls;
        buttonEls[0].disabled = !money;
        buttonEls[0].innerHTML = `Pay ${monify(money/2)}`;
        buttonEls[1].disabled = !(highSchoolers || professionals);
        buttonEls[2].disabled = (money || highSchoolers || professionals);
      }, 10);
    },
    loadEffect: function () {
      this.effect();
      displayEvent(this);
    },
    buttons: [{
        text: 'pay money',
        onClick: function () {
          payBackLoan(money / 2);
        },
      },
      {
        text: 'sell a worker',
        onClick: function () {
          if (professionals) {
            professionals -= 1;
            debt -= professionalWage;
          } else if (highSchoolers) {
            highSchoolers -= 1;
            debt -= highSchoolerWage;
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

// for things that use the eventDiv but are not events
const otherThings = {
  restart: {
    description: 'Are you sure you want to restart? \nThis will clear all your progress.',
    notifyPlayer: true,
    uses: 1,
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
          this.uses += 1;
          closeEvent();
        },
      },
    ],
    noCloseButton: true,
  },
};

generateInformation(events);
generateInformation(otherThings);