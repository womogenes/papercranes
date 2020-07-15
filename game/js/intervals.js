// Game loop!
setInterval(function () {
  highSchoolersFold();
  makeCrane(professionals);
  if (projects.buisnessManagement.flag) {
    sellCranes();
  }

  cranePrice = (Math.pow(101, getEl('priceSlider').value) - 1) / 10 + 0.01;

  manageProjects();
  manageEvents();
  tick++;
}, 10);

// Slower because its starting to lag things
setInterval(function () {
  updateDom();
}, 100);

// Slower one, every second.
setInterval(function () {
  getEl('cranemakerRate').innerHTML = commify(Math.round(cranes - prevCranes));
  prevCranes = cranes;
}, 1000);

// A slower on, every 5 seconds.
setInterval(function () {
  save();

  // Fluctuate price.
  paperPrice = Math.floor(Math.sin(tick / 10) * 4) + basePaperPrice;
  getEl('paperPrice').innerHTML = monify(paperPrice);
}, 5000);

setInterval(function () {
  debt = Math.ceil(debt * (1 + interestRate) * 100) / 100;
}, 15000);