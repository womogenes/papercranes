// Bank
function borrowMoney(x) {
  x = Math.min(x, maxDebt - debt);
  money.amount += x;
  debt += x;
}

function payBackLoan(x) {
  const max = Math.min(debt, money.amount);
  const payAmount = x ? Math.min(x, max) : max;
  debt -= payAmount;
  money.amount -= payAmount;
}

// Buying things
//  Production
function increaseAdvertising() {
  pay(advertising.costs);
  advertising.amount += 1;

  advertising.costs.money *= 1.5;
  getEl('advertisingLevel').innerHTML = commify(advertising.amount);
}

function buyUserAdData() {
  let newTracked = Math.ceil((Math.random() + 1) * Math.pow(1.1, advertising.amount));
  if (money.amount < userAdData.costs.money) {
    newTracked = Math.round(newTracked * money.amount / userAdData.costs.money);
  }
  userAdData.amount += newTracked;
  userAdData.costs.money += newTracked * 2;

  getEl(userAdData.amountEl).innerText = spellf(userAdData.amount);
  getEl(userAdData.costEl).innerText = monify(userAdData.costs.money);
}

function hireHighSchooler() {
  // Hires a highSchooler!
  highSchoolers.amount++;
}

function fireHighSchooler() {
  // Fires a highSchooler
  highSchoolers.amount--;
}

function hireProfessional() {
  // Hires one Professional
  professionals.amount++;
  highSchoolers.amount--;
  money.amount -= professionals.wage;
  professionals.wage = Math.ceil(professionals.wage * 1.1 * 100) / 100;
}

function buyFactory() {
  // buys a factory
  pay(factories.costs);
  factories.amount++;
}

function buyPowerPlant() {
  pay(powerPlants.costs);
  powerPlants.amount++;
}

//  Resources
function buyPaper(amount) {
  // buys paper.amount paper
  pay(paper.costs, amount);
  paper.amount += Math.round(paper.purchaseAmount * amount);
}

function buyEnergy(amount) {
  // buys energy
  pay(energy.costs, amount);
  energy.amount += Math.round(energy.purchaseAmount * amount);
}

function buyCoal(amount) {
  pay(coal.costs, amount);
  coal.amount += Math.round(coal.purchaseAmount * amount);
}

function buyWood(amount) {
  pay(wood.costs, amount);
  wood.amount += Math.round(wood.purchaseAmount * amount);
}

function buyPaperMill() {
  pay(paperMills.costs);
  paperMills.amount++;
}

// Buttons
function makeCrane(n) {
  // makes cranes
  n = Math.min(n, paper.amount);
  wishes.amount += n / 1000;

  lifetimeCranes += n;
  unsoldCranes += n;
  paper.amount -= n;
}

function closeEvent() {
  // closes the currently displayed event and displays the next if there is one
  let event = events[camelize(getEl('eventTitle').innerHTML)];
  event.onClose?.();

  if (pendingEvents.length) {
    displayEvent();
  } else {
    resetEventDiv();
    getEl('eventDiv').hidden = true;
  }
}

function togglePaperBuyer() {
  events.autoBuyPaper.flag = !events.autoBuyPaper.flag;
  getEl('paperBuyer').innerHTML = events.autoBuyPaper.flag ? 'ON' : 'OFF';
}

function changeTheme() {
  // switches the theme
  theme = theme == 'Light' ? 'Dark' : 'Light';
  applyTheme(theme);
}

// Interval functions
function highSchoolersFold() {
  // highschoolers fold cranes
  if (money.amount > 0) {
    if (tick % 1000 == 0 && paper.amount > 0) {
      money.amount -= highSchoolers.wage * highSchoolers.amount;
    }
    makeCrane((highSchoolers.amount * highSchoolers.boost) / 200);
  }
}

function factoryFold() {
  // factories fold cranes
  if (factories.amount > 0 && energy.amount > 1) {
    let factoriesCanPower = Math.min(energy.amount / factories.energyUse, factories.amount);
    energy.amount -= factoriesCanPower * factories.energyUse;
    carbonDioxide.amount += factories.emissions * factoriesCanPower;
    makeCrane(factoriesCanPower * 5 * factories.boost);
  }
}

function makePaper() {
  // papermills make paper from wood
  if (paperMills.amount > 0 && energy.amount > 1 && wood.amount > 1) {
    let millsCanPower = Math.min(energy.amount / paperMills.energyUse, paperMills.amount);
    energy.amount -= millsCanPower * paperMills.energyUse;
    wood.amount -= millsCanPower * paperMills.woodUse;
    carbonDioxide.amount += paperMills.emissions * millsCanPower;
    paper.amount += millsCanPower * 2000 * paperMills.boost;
  }
}

function generatePower() {
  // power plants make power from coal
  if (powerPlants.amount > 0 && coal.amount > 0.1) {
    let plantsCanPower = Math.min(coal.amount / powerPlants.coalUse, powerPlants.amount);
    coal.amount -= plantsCanPower * powerPlants.coalUse;
    carbonDioxide.amount += powerPlants.emissions * plantsCanPower;
    energy.amount += plantsCanPower * 5;
  }
}

function sellCranes() {
  // sells cranes
  const demand = (0.1 / cranePrice) * Math.pow(1.2, advertising.amount - 1);
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
    money.amount += cranePrice * amount;
  }
}