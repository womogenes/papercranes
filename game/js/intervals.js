// Game loop!
setInterval(function () {
  generatePower();
  makePaper();
  highSchoolersFold();
  makeCrane(professionals.amount);
  factoryFold();
  if (projects.businessManagement.flag) {
    sellCranes();
  }

  cranePrice = Math.round(getEl('cranePriceSlider').value * 100) / 100;

  manageProjects();
  manageEvents();
  tick++;
}, 10);

// Slower because its starting to lag things
setInterval(function () {
  if (!document.hidden) {
    updateDom();
  }
  updateTitle();
}, 100);

setInterval(function () {
}, 100);

// Slower one, every second.
setInterval(function () {
  getEl('cranemakerRate').innerHTML = commify(Math.round(lifetimeCranes - prevCranes));
  prevCranes = lifetimeCranes;
}, 1000);

// A slower on, every 5 seconds.
setInterval(function () {
  save();

  // Fluctuate cost.
  paper.costs.money = Math.floor(Math.sin(tick / 10) * 4) + paper.baseCost;
}, 5000);

setInterval(function () {
  debt = Math.ceil(debt * (1 + interestRate) * 100) / 100;
}, 15000);