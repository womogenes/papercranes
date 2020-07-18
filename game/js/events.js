const events = {
  projectsUnlocked: {
    trigger: function () {
      return lifetimeCranes >= 15 && events.buyingPaperUnlocked.flag;
    },
    save: ['flag', 'uses'],
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      this.flag = true;
      this.uses -= 1;
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('projectsColumn');
    },
  },
  prestigeUnlocked: {
    trigger: function () {
      return lifetimeCranes >= 1000;
    },
    save: ['flag', 'uses'],
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      this.flag = true;
      this.uses -= 1;
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('wishDiv');
    },
  },
  outOfMoney: {
    trigger: function () {
      // cannot make money so the player has to restart
      return !projects.buisnessManagement.flag && !canAffordProject(projects.businessManagement.costs) && !projects.bankAccount.flag;
    },
    save: ['flag', 'uses'],
    description: 'Without business management you can\'t make money. Buy it before other things next time.',
    uses: 1,
    flag: false,
    notifyPlayer: true,
    effect: function () {
      this.flag = true;
      this.uses -= 1;
    },
    buttons: [{
      text: 'restart',
      onClick: function () {
        events.restart.buttons[0].onClick();
      },
    }],
    noCloseButton: true,
  },
  buyingPaperUnlocked: {
    trigger: function () {
      return paper.amount <= 0;
    },
    save: ['flag', 'uses'],
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      this.uses -= 1;
      this.flag = true;
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('paperDiv');
    },
  },
  pollution: {
    trigger: function () {
      return carbonDioxide >= 310;
    },
    save: ['flag', 'uses'],
    uses: 1,
    flag: false,
    notifyPlayer: false,
    effect: function () {
      this.flag = true;
      this.uses -= 1;
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('carbonDioxideDiv');
    },
  },
  autoBuyPaper: {
    trigger: function () {
      return paper.amount <= 0 && this.flag;
    },
    notifyPlayer: false,
    uses: -1,
    flag: false, // indicates if paperbuyer is on
    save: ['flag'],
    effect: function () {
      buyPaper(1);
    },
    loadEffect: function () {
      getEl('paperBuyer').innerHTML = 'ON';
    },
  },
  maxedDebt: {
    description: 'You have reached max debt. The bank wants 50% of it paid.',
    trigger: function () {
      return debt >= maxDebt && !this.flag;
    },
    save: ['flag'],
    uses: -1,
    flag: false,
    notifyPlayer: true,
    effect: function () {
      this.flag = true;
    },
    onDisplay: function () {
      events.maxedDebt.update = setInterval(function () {
        if (debt <= maxDebt * .5) {
          events.maxedDebt.flag = false;
          closeEvent();
          return;
        }
        const buttonEls = getEl('eventButtons').children;
        buttonEls[0].disabled = money.amount < 0.01;
        buttonEls[0].innerHTML = `Pay $${monify(Math.min(money.amount / 2, debt - maxDebt / 2))}`;
        buttonEls[1].disabled = !(highSchoolers.amount || professionals.amount);
        buttonEls[2].disabled = (money.amount > 0.01 || highSchoolers.amount || professionals.amount);
      }, 10);
    },
    onClose: function () {
      clearInterval(events.maxedDebt.update);
    },
    buttons: [{
        text: 'pay money',
        onClick: function () {
          payBackLoan(Math.min(money.amount / 2, debt - maxDebt / 2));
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
          maxDebt *= .5;
        },
      },
    ],
    noCloseButton: true,
  },

  // events that don't need to be checked each interval
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
          events.restart.flag = false;
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