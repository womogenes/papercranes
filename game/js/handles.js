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

  advertisingPrice = Math.round(advertisingPrice * 2);
  getEl('advertisingLevel').innerHTML = commify(advertisingLevel);
}

function hireHighSchooler() {
  // Hires a highSchooler!
  highSchoolers++;
  money -= highSchoolerWage;
  highSchoolerWage = Math.ceil(highSchoolerWage * 1.001 * 100) / 100;
}

function hireProfessional() {
  // Hires one Professional
  if (money < professionalWage) {
    return;
  }
  professionals++;
  highSchoolers--;
  money -= professionalWage;
  professionalWage = Math.ceil(professionalWage * 1.1 * 100) / 100;
}

function buyFactory() {
  factories++;
  money -= factoryPrice;
}

function buyPowerPlant() {
  powerPlants++;
  money -= powerPlantPrice;
}

//  Resources
function buyPaper(n) {
  if (money < paperPrice * n) {
    return;
  }
  // Buys paper! May be upgraded.
  paper += Math.round(paperPurchaseAmount * n);
  money -= Math.round(paperPrice * n);
}

function buyEnergy(n) {
  if (money > energyPrice * n) {
    energy += Math.round(energyPurchaseAmount * n);
    money -= Math.round(energyPrice * n);
  }
}

function buyCoal(amount) {
  if (money > coalPrice * amount) {
    coal += Math.round(coalPurchaseAmount * amount);
    money -= Math.round(coalPrice * amount);
  }
}

// Buttons
function makeCrane(n) {
  n = Math.min(n, paper);
  wishes += n / 1000;

  cranes += n;
  unsoldCranes += n;
  paper -= n;
}

function closeEvent() {
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
  if (paper > 0) {
    money -= highSchoolerWage * highSchoolers / 1000000;
    makeCrane((highSchoolers * highSchoolerBoost) / 500);
  }
}

function factoryFold() {
  if (factories > 0 && energy > 1) {
    let factoryEnergyUse = 0.1;
    let factoriesCanPower = Math.min(energy / factoryEnergyUse, factories);
    energy -= factoriesCanPower * factoryEnergyUse;
    makeCrane(factoriesCanPower * 5 * factoryBoost);
  }
}

function generatePower() {
  if (powerPlants > 0 && coal > 1) {
    let plantCoalUse = 0.1;
    let plantsCanPower = Math.min(coal / plantCoalUse, powerPlants);
    coal -= plantsCanPower * plantCoalUse;
    energy += plantsCanPower * 5;
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