let domUpdate;

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

  cranePrice = (Math.pow(101, getEl('cranePriceSlider').value) - 1) / 10 + 0.01;

  manageProjects();
  manageEvents();
  tick++;
}, 10);

// Slower because its starting to lag things
domUpdate = setInterval(function () {
  updateDom();
}, 100);

// Don't update if the tab is hidden
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    clearInterval(domUpdate);
  } else {
    domUpdate = setInterval(function () {
      updateDom();
    }, 100);
  }
});

// Slower one, every second.
setInterval(function () {
  getEl('cranemakerRate').innerHTML = commify(Math.round(lifetimeCranes - prevCranes));
  prevCranes = lifetimeCranes;
}, 1000);

// A slower on, every 5 seconds.
setInterval(function () {
  save();

  // Fluctuate cost.
  paper.cost = Math.floor(Math.sin(tick / 10) * 4) + paper.baseCost;
  getEl('paperCost').innerHTML = monify(paper.cost);
}, 5000);

setInterval(function () {
  debt = Math.ceil(debt * (1 + interestRate) * 100) / 100;
}, 15000);