// Resources
// if you make a new resource, remember to add it to resources
// resources will automatically save and load

// materials
const paper = {
  amount: 10,
  amountEl: 'paper',
  formattedAmount: function (amount) {
    return commify(Math.floor(amount));
  },
  costs: {
    money: 15,
  },
  costEl: 'paperCost',
  purchaseEl: 'btnBuyPaper',
  baseCost: 15,
  purchaseAmount: 1000,
};

const wood = {
  amount: 0,
  amountEl: 'wood',
  costs: {
    money: 50,
  },
  costEl: 'woodCost',
  purchaseEl: 'btnBuyWood',
  purchaseAmount: 500,
};

const energy = {
  amount: 0,
  amountEl: 'energy',
  costs: {
    money: 150,
  },
  costEl: 'energyCost', // These should have 'El' at the end.
  purchaseEl: 'btnBuyEnergy',
  purchaseAmount: 100,
};

const coal = {
  amount: 0,
  amountEl: 'coal',
  costs: {
    money: 200,
  },
  costEl: 'coalCost',
  purchaseEl: 'btnBuyCoal',
  purchaseAmount: 50,
};

// manufacturing
const highSchoolers = {
  amount: 0,
  amountEl: 'highSchoolers',
  wage: 0.01,
  wageEl: 'highSchoolerWage',
  purchaseEl: 'btnHireHighSchooler',
  boost: 1,
  toCost: function (amount) {
    return `${amount} high schooler${amount > 1 ? 's' : ''}`;
  },
};

const professionals = {
  amount: 0,
  amountEl: 'professionals',
  wage: 100,
  wageEl: 'professionalWage',
  purchaseEl: 'btnHireProfessional',
  boost: 1,
};

const powerPlants = {
  amount: 0,
  amountEl: 'powerPlants',
  costs: {
    money: 1000,
  },
  costEl: 'powerPlantCost',
  purchaseEl: 'btnBuyPowerPlant',
  boost: 1,
  coalUse: 0.1,
  emissions: 0.001,
};

const factories = {
  amount: 0,
  amountEl: 'factories',
  costs: {
    money: 1000,
  },
  costEl: 'factoryCost',
  purchaseEl: 'btnBuyFactory',
  boost: 1,
  energyUse: 0.1,
  emissions: 0.001,
};

const paperMills = {
  amount: 0,
  amountEl: 'paperMills',
  costs: {
    money: 500,
  },
  costEl: 'paperMillCost',
  purchaseEl: 'btnBuyPaperMill',
  boost: 1,
  woodUse: 0.5,
  energyUse: 0.1,
  emissions: 0.001,
};

// misc.
const carbonDioxide = {
  amount: 300,
  amountEl: 'carbonDioxide',
};

const money = {
  amount: 35,
  amountEl: 'money',
  formattedAmount: function (amount) {
    return monify(amount);
  },
  toCost: function (amount) {
    return '$' + this.formattedAmount(amount);
  },
};

const wishes = {
  amount: 0,
  amountEl: 'wishes',
  formattedAmount: function (amount) {
    return Math.floor(amount);
  },
  toCost: function (amount) {
    return `${this.formattedAmount(amount)} wish${Math.floor(amount) > 1 ? 'es' : ''}`;
  },
};

const advertising = {
  amount: 1, // level
  amountEl: 'advertisingLevel',
  costs: {
    money: 20,
  },
  costEl: 'advertisingCost',
  purchaseEl: 'btnAdvertising',
};

const userAdData = {
  amount: 0,
  amountEl: 'userAdDataEl',
  costs: {
    money: 10,
  },
  costEl: 'userAdDataCostEl',
  purchaseEl: 'btnUserAdData',
};

const resources = {
  highSchoolers: highSchoolers,
  professionals: professionals,
  paper: paper,
  wood: wood,
  paperMills: paperMills,
  energy: energy,
  factories: factories,
  coal: coal,
  powerPlants: powerPlants,
  carbonDioxide: carbonDioxide,
  advertising: advertising,
  money: money,
  wishes: wishes,
};