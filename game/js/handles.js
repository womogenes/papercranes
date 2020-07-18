// Bank
function borrowMoney(x) {
  x = Math.min(x, maxDebt - debt);
  money += x;
  debt += x;
}

function payBackLoan(x) {
  const max = Math.min(debt, money);
  const payAmount = x ? Math.min(x, max) : max;
  debt -= payAmount;
  money -= payAmount;
}

// Buying things
//  Production
function increaseAdvertising() {
  if (money < advertisingPrice) {
    return;
  }
  advertisingLevel += 1;
  money -= advertisingPrice;

  advertisingPrice = Math.round(advertisingPrice * 1.01);
  getEl('advertisingLevel').innerHTML = commify(advertisingLevel);
}

function hireHighSchooler() {
  // Hires a highSchooler!
  highSchoolers.amount++;
  money -= highSchoolers.wage;
  highSchoolers.wage = Math.ceil(highSchoolers.wage * 1.001 * 100) / 100;
}

function hireProfessional() {
  // Hires one Professional
  if (money < professionals.wage) {
    return;
  }
  professionals.amount++;
  highSchoolers.amount--;
  money -= professionals.wage;
  professionals.wage = Math.ceil(professionals.wage * 1.1 * 100) / 100;
}

function buyFactory() {
  factories.amount++;
  money -= factories.price;
}

function buyPowerPlant() {
  powerPlants.amount++;
  money -= powerPlants.price;
}

//  Resources
function buyPaper(n) {
  if (money < paper.price * n) {
    return;
  }
  // Buys paper! May be upgraded.
  paper.amount += Math.round(paper.purchaseAmount * n);
  money -= Math.round(paper.price * n);
}

function buyEnergy(n) {
  if (money > energy.price * n) {
    energy.amount += Math.round(energy.purchaseAmount * n);
    money -= Math.round(energy.price * n);
  }
}

function buyCoal(amount) {
  if (money > coal.price * amount) {
    coal.amount += Math.round(coal.purchaseAmount * amount);
    money -= Math.round(coal.price * amount);
  }
}

// Buttons
function makeCrane(n) {
  n = Math.min(n, paper.amount);
  wishes += n / 1000;

  cranes += n;
  unsoldCranes += n;
  paper.amount -= n;
}

function closeEvent() {
  let event = events[getEl('eventTitle').innerHTML.camelize()];
  if (event.onClose) {
    event.onClose();
  }
  if (pendingEvents.length) {
    displayEvent();
  } else {
    resetEventDiv();
    getEl('eventDiv').hidden = true;
  }
}

function togglePaperBuyer() {
  paperBuyerOn = !paperBuyerOn;
  getEl('paperBuyer').innerHTML = paperBuyerOn ? 'ON' : 'OFF';
}

function changeTheme() {
  theme = theme == 'Light' ? 'Dark' : 'Light';
  applyTheme(theme);
}

// Interval functions
function highSchoolersFold() {
  if (money > 0) {
    if (tick % 100 == 0 && paper.amount > 0) {
      money -= highSchoolers.wage * highSchoolers.amount;
    }
    makeCrane((highSchoolers.amount * highSchoolers.boost) / 200);
  }
}

function factoryFold() {
  if (factories.amount > 0 && energy.amount > 1) {
    let factoriesCanPower = Math.min(energy.amount / factories.energyUse, factories.amount);
    energy.amount -= factoriesCanPower * factories.energyUse;
    carbonDioxide += factories.emissions * factoriesCanPower;
    makeCrane(factoriesCanPower * 5 * factories.boost);
  }
}

function generatePower() {
  if (powerPlants.amount > 0 && coal.amount > 0.1) {
    let plantsCanPower = Math.min(coal.amount / powerPlants.coalUse, powerPlants.amount);
    coal.amount -= plantsCanPower * powerPlants.coalUse;
    carbonDioxide += powerPlants.emissions * plantsCanPower;
    energy.amount += plantsCanPower * 5;
  }
}

function sellCranes() {
  const demand = (0.1 / cranePrice) * Math.pow(1.2, advertisingLevel - 1);
  getEl('demand').innerHTML = commify(Math.floor(demand * 100));

  if (Math.random() * 50 < demand || (cranePrice <= 0.01 && Math.random() > 0.7)) {
    let amount = Math.ceil(demand);
    if (cranePrice <= 0.01) {
      amount = Math.ceil(unsoldCranes / 10);
    }
    amount = Math.min(amount, unsoldCranes);
    if (unsoldCranes < 1) {
      amount = 0;
    }
    unsoldCranes -= amount;
    money += cranePrice * amount;
  }
}