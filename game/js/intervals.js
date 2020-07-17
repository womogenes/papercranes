let domUpdate;

// Game loop!
setInterval(function () {
  highSchoolersFold();
  makeCrane(professionals.amount);
  generatePower();
  factoryFold();
  if (projects.buisnessManagement.flag) {
    sellCranes();
  }

  cranePrice = (Math.pow(101, getEl('priceSlider').value) - 1) / 10 + 0.01;

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
  getEl('cranemakerRate').innerHTML = commify(Math.round(cranes - prevCranes));
  prevCranes = cranes;
}, 1000);

// A slower on, every 5 seconds.
setInterval(function () {
  save();

  // Fluctuate price.
  paper.price = Math.floor(Math.sin(tick / 10) * 4) + paper.basePrice;
  getEl('paperPrice').innerHTML = monify(paper.price);
}, 5000);

setInterval(function () {
  debt = Math.ceil(debt * (1 + interestRate) * 100) / 100;
}, 15000);