// Yoy!
var cranes = 0;
var unsoldCranes = 0;
var funds = 20;
var cranePrice = 0.25;
var marketingPrice = 40.0;
var paperPrice = 20;
var paperAmount = 1000;
var paper = 0;
var marketingLevel = 1;
var highSchoolers = 0;
var minWage = 5;
var highSchoolerBoost = 1;
var debt = 0;
var maxDebt = 1e3;
var interestRate = 0.01;

var professionals = 0;
var professionalCost = 100;
var basePaperPrice = 15;
var wishes = 0;

var paperBuyerOn = false;

var paperBuyerUnlocked = false;

var prevCranes = cranes;
var tick = 0;
var prevTimer = Date.now();

var consoleHistory = [];
var pendingEvents = [];

var theme = (
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ?
  "Dark" : "Light";

var domElements = {};

function save() {
  var savedGame = {
    cranes: cranes,
    unsoldCranes: unsoldCranes,
    funds: funds,
    cranePrice: cranePrice,
    marketingPrice: marketingPrice,
    paperPrice: paperPrice,
    paperAmount: paperAmount,
    paper: paper,
    marketingLevel: marketingLevel,
    highSchoolers: highSchoolers,
    minWage: minWage,
    highSchoolerBoost: highSchoolerBoost,
    debt: debt,
    maxDebt: maxDebt,
    interestRate: interestRate,

    professionals: professionals,
    professionalCost: professionalCost,
    basePaperPrice: basePaperPrice,
    wishes: wishes,

    paperBuyerOn: paperBuyerOn,
  };

  localStorage.setItem(
    "savedGame",
    JSON.stringify(savedGame)
  );

  // Deal with project stuff.
  var savedProjectUses = [];
  var savedProjectFlags = [];
  var savedActiveProjects = [];

  for (var i = 0; i < projects.length; i++) {
    savedProjectUses[i] = projects[i].uses;
    savedProjectFlags[i] = projects[i].flag;
  }
  for (var i = 0; i < activeProjects.length; i++) {
    savedActiveProjects[i] = activeProjects[i].id;
  }
  localStorage.setItem(
    "savedProjectUses",
    JSON.stringify(savedProjectUses)
  );
  localStorage.setItem(
    "savedProjectFlags",
    JSON.stringify(savedProjectFlags)
  );
  localStorage.setItem(
    "savedActiveProjects",
    JSON.stringify(savedActiveProjects)
  );

  // Deal with events.
  var savedEventUses = [];
  var savedEventFlags = [];
  for (var i = 0; i < events.length; i++) {
    savedEventUses[i] = events[i].uses;
    savedEventFlags[i] = events[i].flag;
  }
  localStorage.setItem(
    "savedEventUses",
    JSON.stringify(savedEventUses)
  );
  localStorage.setItem(
    "savedEventFlags",
    JSON.stringify(savedEventFlags)
  );

  localStorage.setItem("consoleHistory", JSON.stringify(consoleHistory));
  localStorage.setItem("theme", JSON.stringify(theme));
}

function load() {
  if (localStorage.getItem("savedGame") == null) {
    save();
    return;
  }
  var savedGame = JSON.parse(localStorage.getItem("savedGame"));
  cranes = savedGame.cranes;
  unsoldCranes = savedGame.unsoldCranes;
  funds = savedGame.funds;
  cranePrice = savedGame.cranePrice;
  marketingPrice = savedGame.marketingPrice;
  paperPrice = savedGame.paperPrice;
  paperAmount = savedGame.paperAmount;
  paper = savedGame.paper;
  marketingLevel = savedGame.marketingLevel;
  highSchoolers = savedGame.highSchoolers;
  minWage = savedGame.minWage;
  highSchoolerBoost = savedGame.highSchoolerBoost;
  debt = savedGame.debt;
  maxDebt = savedGame.maxDebt;
  interestRate = savedGame.interestRate;

  professionals = savedGame.professionals;
  professionalCost = savedGame.professionalCost;
  basePaperPrice = savedGame.basePaperPrice;
  wishes = savedGame.wishes;
  basePaperPrice = savedGame.basePaperPrice;

  paperBuyerOn = savedGame.paperBuyerOn;

  // Load project information.
  var loadProjectUses = JSON.parse(localStorage.getItem("savedProjectUses"));
  var loadProjectFlags = JSON.parse(
    localStorage.getItem("savedProjectFlags")
  );
  var loadActiveProjects = JSON.parse(
    localStorage.getItem("savedActiveProjects")
  );

  for (var i = 0; i < loadProjectUses.length; i++) {
    projects[i].uses = loadProjectUses[i];
    projects[i].flag = loadProjectFlags[i];
  }

  projects.forEach(project => {
    if (loadActiveProjects.indexOf(project.id) >= 0) {
      displayProjects(project);
      activeProjects.push(project);
    }
  });

  // Load event information.
  var loadEventUses = JSON.parse(
    localStorage.getItem("savedEventUses")
  );
  var loadEventFlags = JSON.parse(
    localStorage.getItem("savedEventFlags")
  );

  for (var i = 0; i < loadEventUses.length; i++) {
    events[i].uses = loadEventUses[i];
    events[i].flag = loadEventFlags[i];
  }

  consoleHistory = JSON.parse(localStorage.getItem("consoleHistory"));

  consoleHistory.forEach(message => {
    displayMessage(message, true);
  });

  theme = JSON.parse(localStorage.getItem("theme"));
}

document.addEventListener("DOMContentLoaded", function (event) {
  cacheDomElements();
  domElements["btnMakeCrane"].disabled = false;
  domElements["btnBuyPaper"].disabled = true;
  domElements["btnHireHighSchooler"].disabled = true;
  domElements["btnMarketing"].disabled = true;

  // Unhide unlocked divs
  [
    ["bankDiv", bankAccountProject],
    ["professionalDiv", hireProfessionalsProject],
    ["prestigeColumn", prestigeUnlockedEvent],
    ["foldingColumn", learnToFoldCranesProject],
    ["buisnessColumn", learnToFoldCranesProject]
  ].forEach(i => {
    domElements[i[0]].hidden = !i[1].flag;
  });
  domElements["paperBuyerDiv"].hidden = !paperBuyerUnlocked;

  domElements["paperPrice"].innerHTML = monify(paperPrice);
  domElements["marketingLevel"].innerHTML = commify(marketingLevel);
  domElements["paperBuyer"].innerHTML = paperBuyerOn ? "ON" : "OFF";

  Array.from(document.getElementsByTagName("button")).forEach(button => {
    if (button.id != "closeButton") {
      button.addEventListener("click", createRipple);
    }
  });
});

// Game loop!
window.setInterval(function () {
  // Make cranes before selling them.
  makeCrane((highSchoolers * highSchoolerBoost) / 500);
  makeCrane(professionals);
  sellCranes();

  cranePrice = (Math.pow(101, domElements["priceSlider"].value) - 1) / 10 + 0.01;

  manageProjects();
  manageEvents();

  updateDom();
  tick++;
}, 10);

// Slower one, every second.
window.setInterval(function () {
  domElements["cranemakerRate"].innerHTML = commify(Math.round(cranes - prevCranes));
  prevCranes = cranes;
}, 1000);

// A slower on, every 5 seconds.
window.setInterval(function () {
  save();

  // Fluctuate price.
  paperPrice = Math.floor(Math.sin(tick / 10) * 4) + basePaperPrice;
  domElements["paperPrice"].innerHTML = monify(paperPrice);

  debt = Math.ceil(debt * (1 + interestRate) * 100) / 100;
}, 5000);

function sellCranes() {
  var demand = (0.08 / cranePrice) * Math.pow(1.3, marketingLevel - 1);
  domElements["demand"].innerHTML = commify(Math.floor(demand * 100));

  if (Math.random() * 50 < demand || (cranePrice <= 0.01 && Math.random() > 0.7)) {
    var amount = Math.ceil(demand);
    if (cranePrice <= 0.01) {
      amount = Math.ceil(unsoldCranes / 10);
    }
    amount = Math.min(amount, unsoldCranes);
    if (unsoldCranes < 1) {
      amount = 0;
    }
    unsoldCranes -= amount;
    funds += cranePrice * amount;
  }
}

function updateDom() {
  // Update elements to have correct values
  domElements["cranes"].innerHTML = commify(Math.round(cranes));
  domElements["unsoldCranes"].innerHTML = commify(Math.floor(unsoldCranes));
  domElements["funds"].innerHTML = monify(funds);
  domElements["marketingPrice"].innerHTML = monify(marketingPrice);
  domElements["highSchoolers"].innerHTML = commify(highSchoolers);
  domElements["debt"].innerHTML = monify(debt);
  domElements["paper"].innerHTML = commify(Math.floor(paper));
  domElements["interestRate"].innerHTML = interestRate * 100;
  domElements["highSchoolerCost"].innerHTML = monify(minWage);
  domElements["professionals"].innerHTML = commify(professionals);
  domElements["professionalCost"].innerHTML = monify(professionalCost);
  domElements["wishes"].innerHTML = commify(Math.floor(wishes));
  domElements["craneCountCrunched"].innerHTML = spellf(Math.round(cranes));
  domElements["cranePrice"].innerHTML = monify(parseFloat(cranePrice));

  var happiness = funds >= 0.1 ? Math.log(funds + wishes) : 0
  domElements["happinessMeter"].style.width = happiness + "%"
  domElements["happinessAmount"].innerHTML = happiness.toFixed(2);

  // Disable buttons which player cannot use
  domElements["btnMakeCrane"].disabled = paper < 1 || !learnToFoldCranesProject.flag;
  domElements["btnBuyPaper"].disabled = paperPrice > funds;
  domElements["btnMarketing"].disabled = marketingPrice > funds;
  domElements["btnHireHighSchooler"].disabled = funds < minWage;
  domElements["btnPayBack"].disabled = funds <= 0 || debt <= 0;
  domElements["btnBorrowMoney"].disabled = debt >= maxDebt;
  domElements["btnHireProfessional"].disabled = professionalCost > funds;

  // Change favicon and title to show notifications
  var notificationCount = pendingEvents.length + (domElements["eventDiv"].hidden ? 0 : 1);
  document.title = (notificationCount ? "(" + notificationCount + ") " : "") + "Paper Cranes";
  domElements["icon"].setAttribute("href", notificationCount ? "../favicon_notification.svg" : "../favicon_crane.svg");
}

// Project management functions.
function displayProjects(project) {
  project.element = document.createElement("button");
  project.element.style.opacity = 0;
  project.element.setAttribute("id", project.id);

  project.element.onclick = function () {
    projectBaseEffect(project);
    project.effect();
  };

  project.element.setAttribute("class", "projectButton");

  domElements["projectsDiv"].appendChild(project.element, domElements["projectsDiv"].firstChild);

  var span = document.createElement("span");
  span.style.fontWeight = "bold";
  project.element.appendChild(span);

  span.appendChild(document.createTextNode(project.title));
  project.element.appendChild(document.createTextNode(" " + projectPriceTag(project)));
  project.element.appendChild(document.createElement("div"));
  project.element.appendChild(document.createTextNode(project.description));

  fade(project.element, canAffordProject(project) ? 1.0 : 0.6);
}

function manageProjects() {
  projects.forEach(project => {
    if (project.trigger() && project.uses > 0) {
      displayProjects(project);
      project.uses--;
      activeProjects.push(project);
    }
  });

  activeProjects.forEach(project => {
    project.element.disabled = !canAffordProject(project);
  });
}

function manageEvents() {
  events.forEach(event => {
    if (event.trigger() && event.uses != 0) {
      if (event.notifyPlayer) {
        pendingEvents.push(event);
      }
      event.effect();
      event.uses--;
    }
  });

  if (pendingEvents.length > 0 && domElements["eventDiv"].hidden) {
    displayNextEvent();
  }
}

function displayNextEvent() {
  event = pendingEvents.pop();
  domElements["eventTitle"].innerHTML = event.title;
  domElements["eventDescription"].innerHTML = event.description;
  unhide("eventDiv");
}