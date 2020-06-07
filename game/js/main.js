// Yoy!
var cranes = 0;
var wishes = 0;
var unsoldCranes = 0;
var cranePrice = 0.25;

var funds = 20;
var debt = 0;
var maxDebt = 1e3;
var interestRate = 0.01;

var marketingPrice = 40.0;
var marketingLevel = 1;

var basePaperPrice = 15;
var paperPrice = 20;
var paperAmount = 1000;
var paper = 0;
var paperBuyerOn = false;
var paperBuyerUnlocked = false;

var minWage = 5;
var highSchoolers = 0;
var highSchoolerBoost = 1;
var professionals = 0;
var professionalCost = 100;

var prevCranes = cranes;
var tick = 0;
var prevTimer = Date.now();

var consoleHistory = [];
var pendingEvents = [];

var theme = (
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ?
  "Dark" : "Light";

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
  var savedActiveProjects = [];
  var savedProjectData = {};

  for (var projectId in projects) {
    var project = projects[projectId];
    savedProjectData[project.id] = {
      flag: project.flag,
      uses: project.uses
    }
  }

  for (var i = 0; i < activeProjects.length; i++) {
    savedActiveProjects[i] = activeProjects[i].id;
  }
  localStorage.setItem("savedProjectData", JSON.stringify(savedProjectData));
  localStorage.setItem("savedActiveProjects", JSON.stringify(savedActiveProjects));

  // Deal with events.
  var savedEventData = {};
  for (var eventId in events) {
    var event = events[eventId];
    savedEventData[event.id] = {
      flag: event.flag,
      uses: event.uses
    }
  }
  localStorage.setItem("savedEventData", JSON.stringify(savedEventData));

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
  var savedProjectData = JSON.parse(localStorage.getItem("savedProjectData"));
  var savedActiveProjects = JSON.parse(localStorage.getItem("savedActiveProjects"));

  for (var projectId in savedProjectData) {
    var savedProject = savedProjectData[projectId];
    var project = projects[projectId];
    project.uses = savedProject.uses;
    project.flag = savedProject.flag;
  }

  for (var projectId in projects) {
    var project = projects[projectId];
    if (savedActiveProjects.indexOf(project.id) >= 0) {
      displayProjects(project);
      activeProjects.push(project);
    }
  }

  // Load event information.
  var savedEventData = JSON.parse(localStorage.getItem("savedEventData"));

  for (var eventId in savedEventData) {
    var savedEvent = savedEventData[eventId];
    var event = events[eventId];
    event.uses = savedEvent.uses;
    event.flag = savedEvent.flag;
  }


  consoleHistory = JSON.parse(localStorage.getItem("consoleHistory"));

  consoleHistory.forEach(message => {
    displayMessage(message, true);
  });

  theme = JSON.parse(localStorage.getItem("theme"));
}

document.addEventListener("DOMContentLoaded", function (event) {
  load();
  applyTheme();
  getEl("btnMakeCrane").disabled = false;
  getEl("btnBuyPaper").disabled = true;
  getEl("btnHireHighSchooler").disabled = true;
  getEl("btnMarketing").disabled = true;

  // Unhide unlocked divs
  [
    ["bankDiv", projects.bankAccountProject],
    ["professionalDiv", projects.professionalsProject],
    ["prestigeColumn", events.prestigeUnlockedEvent],
    ["foldingColumn", projects.learnToFoldCranesProject],
    ["buisnessColumn", projects.learnToFoldCranesProject]
  ].forEach(i => {
    getEl(i[0]).hidden = !i[1].flag;
  });
  getEl("paperBuyerDiv").hidden = !paperBuyerUnlocked;

  getEl("paperPrice").innerHTML = monify(paperPrice);
  getEl("marketingLevel").innerHTML = commify(marketingLevel);
  getEl("paperBuyer").innerHTML = paperBuyerOn ? "ON" : "OFF";

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

  cranePrice = (Math.pow(101, getEl("priceSlider").value) - 1) / 10 + 0.01;

  manageProjects();
  manageEvents();

  updateDom();
  tick++;
}, 10);

// Slower one, every second.
window.setInterval(function () {
  getEl("cranemakerRate").innerHTML = commify(Math.round(cranes - prevCranes));
  prevCranes = cranes;
}, 1000);

// A slower on, every 5 seconds.
window.setInterval(function () {
  save();

  // Fluctuate price.
  paperPrice = Math.floor(Math.sin(tick / 10) * 4) + basePaperPrice;
  getEl("paperPrice").innerHTML = monify(paperPrice);

  debt = Math.ceil(debt * (1 + interestRate) * 100) / 100;
}, 5000);

function sellCranes() {
  var demand = (0.08 / cranePrice) * Math.pow(1.3, marketingLevel - 1);
  getEl("demand").innerHTML = commify(Math.floor(demand * 100));

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
  getEl("cranes").innerHTML = commify(Math.round(cranes));
  getEl("unsoldCranes").innerHTML = commify(Math.floor(unsoldCranes));
  getEl("funds").innerHTML = monify(funds);
  getEl("marketingPrice").innerHTML = monify(marketingPrice);
  getEl("highSchoolers").innerHTML = commify(highSchoolers);
  getEl("debt").innerHTML = monify(debt);
  getEl("paper").innerHTML = commify(Math.floor(paper));
  getEl("interestRate").innerHTML = interestRate * 100;
  getEl("highSchoolerCost").innerHTML = monify(minWage);
  getEl("professionals").innerHTML = commify(professionals);
  getEl("professionalCost").innerHTML = monify(professionalCost);
  getEl("wishes").innerHTML = commify(Math.floor(wishes));
  getEl("craneCountCrunched").innerHTML = spellf(Math.round(cranes));
  getEl("cranePrice").innerHTML = monify(parseFloat(cranePrice));

  var happiness = funds >= 0.1 ? Math.log(funds + wishes) : 0
  getEl("happinessMeter").style.width = happiness + "%"
  getEl("happinessAmount").innerHTML = happiness.toFixed(2);

  // Disable buttons which player cannot use
  getEl("btnMakeCrane").disabled = paper < 1 || !projects.learnToFoldCranesProject.flag;
  getEl("btnBuyPaper").disabled = paperPrice > funds;
  getEl("btnMarketing").disabled = marketingPrice > funds;
  getEl("btnHireHighSchooler").disabled = funds < minWage;
  getEl("btnPayBack").disabled = funds <= 0 || debt <= 0;
  getEl("btnBorrowMoney").disabled = debt >= maxDebt;
  getEl("btnHireProfessional").disabled = professionalCost > funds;

  // Change favicon and title to show notifications
  var notificationCount = pendingEvents.length + (getEl("eventDiv").hidden ? 0 : 1);
  document.title = (notificationCount ? "(" + notificationCount + ") " : "") + "Paper Cranes";
  getEl("icon").setAttribute("href", notificationCount ? "../favicon_notification.svg" : "../favicon_crane.svg");
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

  getEl("projectsDiv").appendChild(project.element, getEl("projectsDiv").firstChild);

  var span = document.createElement("span");
  span.style.fontWeight = "bold";
  project.element.appendChild(span);

  span.appendChild(document.createTextNode(project.title.toTitleCase()));
  project.element.appendChild(document.createTextNode(" " + projectPriceTag(project)));
  project.element.appendChild(document.createElement("div"));
  project.element.appendChild(document.createTextNode(project.description));

  fade(project.element, canAffordProject(project) ? 1.0 : 0.6);
}

function manageProjects() {
  for (var projectId in projects) {
    var project = projects[projectId];
    if (project.trigger() && project.uses > 0) {
      displayProjects(project);
      project.uses--;
      activeProjects.push(project);
    }
  }

  activeProjects.forEach(project => {
    project.element.disabled = !canAffordProject(project);
  });
}

function manageEvents() {
  for (var eventId in events) {
    var event = events[eventId];
    if (event.trigger() && event.uses != 0) {
      if (event.notifyPlayer) {
        pendingEvents.push(event);
      }
      event.effect();
      event.uses--;
    }
  }

  if (pendingEvents.length > 0 && getEl("eventDiv").hidden) {
    displayNextEvent();
  }
}

function displayNextEvent() {
  event = pendingEvents.pop();
  getEl("eventTitle").innerHTML = event.title.toTitleCase();
  getEl("eventDescription").innerHTML = event.description;
  unhide("eventDiv");
}