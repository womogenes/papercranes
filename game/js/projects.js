// Yoy!
let activeProjects = [];

function projectBaseEffect(project) {
  project.flag = true;
  project.element.parentNode.removeChild(project.element);
  let index = activeProjects.indexOf(project);
  activeProjects.splice(index, 1);

  if (project.costs.money) {
    money -= project.costs.money;
  }
  if (project.costs.wishes) {
    wishes -= project.costs.wishes;
  }
  if (project.costs.highSchoolers) {
    highSchoolers -= project.costs.highSchoolers;
  }
}

function projectPriceTag(project) {
  let costs = [];
  if (project.costs.money) {
    costs.push(`\$${project.costs.money.toLocaleString()}`);
  }
  if (project.costs.wishes) {
    costs.push(`${project.costs.wishes} wish${project.costs.wishes != 0 ? 'es' : ''}`);
  }
  if (project.costs.highSchoolers) {
    costs.push(`${project.costs.highSchoolers} high schooler${project.costs.highSchoolers != 0 ? 's' : ''}`);
  }
  return `(${costs.join(', ')})`;
}

function canAffordProject(project) {
  return (
    (project.costs.money ? money >= project.costs.money : true) &&
    (project.costs.wishes ? wishes >= project.costs.wishes : true) &&
    (project.costs.highSchoolers ? highSchoolers >= project.costs.highSchoolers : true)
  );
}
const projects = {
  // Worker projects
  unlockWorkers: {
    description: 'Hire workers to fold for you.',
    costs: {
      money: 10,
    },
    trigger: function() {
      return money >= 5 && cranes >= 20;
    },
    uses: 1,
    flag: false,
    effect: function() {
      this.loadEffect();
    },
    loadEffect: function() {
      unhide('workerDiv');
    },
  },
  fasterHighSchoolers: {
    fasterPercent: 25,
    description: function() {
      return `High Schoolers work ${this.fasterPercent}% faster.`;
    },
    costs: {
      money: 10,
    },
    trigger: function() {
      return money >= 5 && highSchoolers > 0;
    },
    uses: 1,
    flag: false,
    effect: function() {
      this.loadEffect();
      displayMessage(`High schoolers now work ${this.fasterPercent}% as fast.`);
    },
    loadEffect: function() {
      highSchoolerBoost *= percentToMultiplier(this.fasterPercent);
    },
  },
  evenFasterHighSchoolers: {
    fasterPercent: 50,
    costs: {
      money: 20,
    },
    description: function() {
      return `Double interest rate, and high schoolers are ${this.fasterPercent}% faster.`;
    },
    purchaseMessage: 'Speedy high schoolers!',
    trigger: function() {
      return money >= 10 && projects.fasterHighSchoolers.flag;
    },
    uses: 1,
    flag: false,
    effect: function() {
      this.loadEffect();
      interestRate *= 2;
    },
    loadEffect: function() {
      highSchoolerBoost *= percentToMultiplier(this.fasterPercent);
    },
  },
  highlySkilledStudents: {
    fasterAmount: 2,
    costs: {
      money: 40,
    },
    description: function() {
      return `Double hire price, high schoolers work ${this.fasterAmount} times as fast.`;
    },
    trigger: function() {
      return money >= 20 && projects.evenFasterHighSchoolers.flag;
    },
    uses: 1,
    flag: false,
    effect: function() {
      this.loadEffect();
      highSchoolerWage *= 2;
      displayMessage('When they work harder, you gotta pay them more.');
    },
    loadEffect: function() {
      highSchoolerBoost *= this.fasterAmount;
    },
  },
  professionals: {
    costs: {
      wishes: 10,
    },
    description: function() {
      return `Use ${this.costs.wishes} wishes to start hiring Professionals, the best folders.`;
    },
    trigger: function() {
      return highSchoolers >= 100;
    },
    uses: 1,
    flag: false,
    effect: function() {
      displayMessage('100x more powerful than a high schooler.');
      this.loadEffect();
    },
    loadEffect: function() {
      unhide('professionalDiv');
    },
  },

  // Buisness projects
  bankAccount: {
    costs: {
      money: 10,
    },
    description: 'Be able to borrow money!',
    trigger: function() {
      return money >= 5 && cranes >= 20;
    },
    uses: 1,
    flag: false,
    effect: function() {
      displayMessage('Bank account opened. You can now borrow money $20 at a time.');
      this.loadEffect();
    },
    loadEffect: function() {
      unhide('bankDiv');
    },
  },
  increaseMaxDebt: {
    costs: {
      money: 2000,
    },
    description: 'Increase maximum debt by 500',
    trigger: function() {
      return debt >= 200;
    },
    uses: 1,
    flag: false,
    effect: function() {
      maxDebt += 500;
    },
  },
  buisnessManagement: {
    costs: {
      money: 10,
    },
    description: 'Sell your cranes',
    trigger: function() {
      return money >= 5 && events.buyingPaperUnlocked.flag;
    },
    uses: 1,
    flag: false,
    effect: function() {
      this.loadEffect();
    },
    loadEffect: function() {
      unhide('buisnessColumn');
    },
  },
  unlockAdvertising: {
    costs: {
      money: 100,
    },
    description: 'Buy advertising to increase demand for cranes',
    trigger: function() {
      return money >= 20 && cranes >= 50;
    },
    uses: 1,
    flag: false,
    effect: function() {
      this.loadEffect();
    },
    loadEffect: function() {
      unhide('advertisingDiv');
    },
  },

  // Paper projects
  paperBuyer: {
    costs: {
      highSchoolers: 100,
    },
    description: 'Auto-purchase paper when it runs out.',
    trigger: function() {
      return cranes >= 10000;
    },
    uses: 1,
    flag: false,
    effect: function() {
      this.loadEffect();
    },
    loadEffect: function() {
      unhide('paperBuyerDiv');
    },
  },
  paperEfficiency: {
    increasePercent: 50,
    costs: {
      money: 200,
    },
    description: function() {
      return `Gain ${this.increasePercent}% more paper from each purchase.`;
    },
    trigger: function() {
      return cranes >= 5000;
    },
    uses: 1,
    flag: false,
    effect: function() {
      paperPurchaseAmount = Math.round(paperPurchaseAmount * percentToMultiplier(this.increasePercent));
      basePaperPrice = Math.round(basePaperPrice * percentToMultiplier(this.increasePercent));
    },
  },
  thinnerSheets: {
    increasePercent: 75,
    costs: {
      money: 400,
    },
    description: function() {
      return `Gain ${this.increasePercent}% more paper from each purchase.`;
    },
    trigger: function() {
      return projects.paperEfficiency.flag;
    },
    uses: 1,
    flag: false,
    effect: function() {
      paperPurchaseAmount = Math.round(paperPurchaseAmount * percentToMultiplier(this.increasePercent));
      basePaperPrice = Math.round(basePaperPrice * 1.5);
    },
  },
  bigPaper: {
    increasePercent: 1000,
    costs: {
      money: 800,
    },
    description: function() {
      return `${this.increasePercent}% more paper from each purchase.`;
    },
    trigger: function() {
      return projects.thinnerSheets.flag;
    },
    uses: 1,
    flag: false,
    effect: function() {
      paperPurchaseAmount = Math.round(paperPurchaseAmount * percentToMultiplier(this.increasePercent));
      basePaperPrice = Math.round(basePaperPrice * 1.5);
    },
  },

  // Energy projects
  unlockEnergy: {
    costs: {
      money: 1000,
      wishes: 2,
    },
    description: 'Unlock energy to power factories',
    trigger: function() {
      return money >= 500 && wishes >= 1 && cranes > 1000;
    },
    uses: 1,
    flag: false,
    effect: function() {
      this.loadEffect();
    },
    loadEffect: function() {
      unhide('energyColumn');
    },
  },
};

generateInformation(projects);
