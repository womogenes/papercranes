// Yoy!
let activeProjects = [];

function projectBaseEffect(project) {
  project.flag = true;
  project.element.parentNode.removeChild(project.element);
  let index = activeProjects.indexOf(project);
  activeProjects.splice(index, 1);
  pay(project.costs);
}

function priceTag(costs) {
  let costStrings = [];
  for (resourceName in costs) {
    if (!resources.hasOwnProperty(resourceName)) {
      console.error(`invalid cost ${resourceName}`);
      return;
    }
    if (resources[resourceName].toPrice) {
      costStrings.push(resources[resourceName].toPrice(costs[resourceName]));
    } else {
      costStrings.push(costs[resourceName] + ' ' + resourceName);
    }
  }
  return costStrings.join(', ');
}

function canAffordProject(costs) {
  for (resourceName in costs) {
    if (!resources.hasOwnProperty(resourceName)) {
      console.error(`invalid cost ${resourceName}`);
      return;
    }
    if (resources[resourceName].amount < costs[resourceName]) {
      return false;
    }
  }
  return true;
}

const projects = {
  // Worker projects
  unlockWorkers: {
    description: 'Hire workers to fold for you for an hourly wage.',
    costs: {
      money: 10,
    },
    trigger: function () {
      return money.amount >= 5 && lifetimeCranes >= 20;
    },
    uses: 1,
    flag: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('workerDiv');
    },
  },
  fasterHighSchoolers: {
    fasterPercent: 25,
    description: function () {
      return `High Schoolers work ${this.fasterPercent}% faster.`;
    },
    costs: {
      money: 10,
    },
    trigger: function () {
      return money.amount >= 5 && highSchoolers.amount > 0;
    },
    uses: 1,
    flag: false,
    effect: function () {
      highSchoolers.boost *= percentToMultiplier(this.fasterPercent);
      displayMessage(`High schoolers now work ${this.fasterPercent}% as fast.`);
    },
  },
  evenFasterHighSchoolers: {
    fasterPercent: 50,
    costs: {
      money: 20,
    },
    description: function () {
      return `Double interest rate, and high schoolers are ${this.fasterPercent}% faster.`;
    },
    purchaseMessage: 'Speedy high schoolers!',
    trigger: function () {
      return money.amount >= 10 && projects.fasterHighSchoolers.flag;
    },
    uses: 1,
    flag: false,
    effect: function () {
      highSchoolers.boost *= percentToMultiplier(this.fasterPercent);
      interestRate *= 2;
    },
    loadEffect: function () {},
  },
  professionals: {
    costs: {
      wishes: 10,
    },
    description: function () {
      return `Use ${this.costs.wishes} wishes to start turning your high schoolers into Professionals, the best folders.`;
    },
    trigger: function () {
      return highSchoolers.amount >= 100;
    },
    uses: 1,
    flag: false,
    effect: function () {
      displayMessage('100x more powerful than a high schooler.');
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('professionalDiv');
    },
  },

  // Buisness projects
  bankAccount: {
    costs: {
      money: 10,
    },
    description: 'Be able to borrow money!',
    trigger: function () {
      return money.amount >= 5 && lifetimeCranes >= 20;
    },
    uses: 1,
    flag: false,
    effect: function () {
      displayMessage('Bank account opened. You can now borrow money $20 at a time.');
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('bankDiv');
    },
  },
  increaseMaxDebt: {
    costs: {
      money: 2000,
    },
    description: 'Increase maximum debt by 500',
    trigger: function () {
      return debt >= 200;
    },
    uses: 1,
    flag: false,
    effect: function () {
      maxDebt += 500;
    },
  },
  buisnessManagement: {
    costs: {
      money: 10,
    },
    description: 'Sell your cranes to make money',
    trigger: function () {
      return money.amount >= 5 && events.buyingPaperUnlocked.flag;
    },
    uses: 1,
    flag: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('buisnessColumn');
    },
  },
  unlockAdvertising: {
    costs: {
      money: 100,
    },
    description: 'Buy advertising to increase demand for cranes',
    trigger: function () {
      return money.amount >= 20 && lifetimeCranes >= 50;
    },
    uses: 1,
    flag: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('advertisingDiv');
    },
  },

  // Paper projects
  paperBuyer: {
    costs: {
      highSchoolers: 100,
    },
    description: 'Auto-purchase paper when it runs out.',
    trigger: function () {
      return lifetimeCranes >= 10000;
    },
    uses: 1,
    flag: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('paperBuyerDiv');
    },
  },
  paperEfficiency: {
    increasePercent: 50,
    costs: {
      money: 200,
    },
    description: function () {
      return `Gain ${this.increasePercent}% more paper from each purchase.`;
    },
    trigger: function () {
      return lifetimeCranes >= 5000;
    },
    uses: 1,
    flag: false,
    effect: function () {
      paper.purchaseAmount = Math.round(paper.purchaseAmount * percentToMultiplier(this.increasePercent));
      paper.basePrice = Math.round(paper.basePrice * percentToMultiplier(this.increasePercent));
    },
  },
  thinnerSheets: {
    increasePercent: 75,
    costs: {
      money: 400,
    },
    description: function () {
      return `Gain ${this.increasePercent}% more paper from each purchase.`;
    },
    trigger: function () {
      return projects.paperEfficiency.flag;
    },
    uses: 1,
    flag: false,
    effect: function () {
      paper.purchaseAmount = Math.round(paper.purchaseAmount * percentToMultiplier(this.increasePercent));
      paper.basePrice = Math.round(paper.basePrice * 1.5);
    },
  },
  bigPaper: {
    increasePercent: 1000,
    costs: {
      money: 800,
    },
    description: function () {
      return `${this.increasePercent}% more paper from each purchase.`;
    },
    trigger: function () {
      return projects.thinnerSheets.flag;
    },
    uses: 1,
    flag: false,
    effect: function () {
      paper.purchaseAmount = Math.round(paper.purchaseAmount * percentToMultiplier(this.increasePercent));
      paper.basePrice = Math.round(paper.basePrice * 1.5);
    },
  },
  unlockWood: {
    costs: {
      money: 500,
      wishes: 1,
    },
    description: 'Use wood to manufacture your own paper',
    trigger: function () {
      return projects.bigPaper.flag && projects.unlockEnergy.flag;
    },
    uses: 1,
    flag: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('woodDiv');
    },
  },
  unlockPaperMills: {
    costs: {
      money: 2000,
      wishes: 1,
    },
    description: 'Turn wood into origami paper',
    trigger: function () {
      return projects.unlockWood.flag;
    },
    uses: 1,
    flag: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('paperMillDiv');
    },
  },

  // Energy projects
  unlockEnergy: {
    costs: {
      money: 500,
      wishes: 1,
    },
    description: 'Unlock energy to power factories',
    trigger: function () {
      return money.amount >= 500 && wishes.amount >= 1 && lifetimeCranes > 1000;
    },
    uses: 1,
    flag: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('energyColumn');
    },
  },
  unlockCoal: {
    costs: {
      money: 500,
      wishes: 1,
    },
    description: 'Use coal to generate energy using a power plant',
    trigger: function () {
      return projects.unlockEnergy.flag && factories.amount > 3;
    },
    uses: 1,
    flag: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('coalDiv');
    },
  },
  unlockPowerPlants: {
    costs: {
      money: 2000,
      wishes: 1,
    },
    description: 'Use power plants to generate energy',
    trigger: function () {
      return projects.unlockCoal.flag;
    },
    uses: 1,
    flag: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('powerPlantDiv');
    },
  },
  unlockFactories: {
    costs: {
      money: 1000,
      wishes: 2,
    },
    description: 'Start building factories to fold',
    trigger: function () {
      return projects.unlockEnergy.flag;
    },
    uses: 1,
    flag: false,
    effect: function () {
      this.loadEffect();
    },
    loadEffect: function () {
      unhide('factoryDiv');
    },
  },
};

generateInformation(projects);