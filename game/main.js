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
var notificationCount;

// Style variables.
var theme = (
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ?
  "Dark" : "Light";

var themes = {
  "Light": {
    "--bg-color": "#ffffff",
    "--outline-color": "#000000",
    "--text-color": "#000000",
    "--fill-color": "#cccccc",

    "--btn-bg-on": "#eeeeee",
    "--btn-bg-hover": "#f9f9f9",
    "--btn-bg-active": "#cccccc",
    "--btn-outline-hover": "#222222",
    "--btn-outline-active": "#222222",
  },
  "Dark": {
    "--bg-color": "#181818",
    "--outline-color": "#dddddd",
    "--text-color": "#eeeeee",
    "--fill-color": "#555555",

    "--btn-bg-on": "#111111",
    "--btn-bg-hover": "#222222",
    "--btn-bg-active": "#1e1e1e",
    "--btn-outline-hover": "#cccccc",
    "--btn-outline-active": "#aaaaaa",
  }
}

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

  theme = JSON.parse(localStorage.getItem("theme")); // Theme.
}

function applyTheme() {
  // Sets theme colors.
  for (var i in themes[theme]) {
    document.documentElement.style.setProperty(i, themes[theme][i]);
  }
}

function changeTheme() {
  theme = theme == "Light" ? "Dark" : "Light"
  applyTheme();
}

function cacheDomElements() {
  Array.from(document.getElementsByTagName("*")).forEach(element => {
    domElements[element.id] = element;
  });


  load();
  applyTheme();
}

document.addEventListener("DOMContentLoaded", function (event) {
  cacheDomElements();
  domElements["btnMakeCrane"].disabled = false;
  domElements["btnBuyPaper"].disabled = true;
  domElements["btnHireHighSchooler"].disabled = true;
  domElements["btnMarketing"].disabled = true;
  domElements["bankDiv"].hidden = !bankAccountProject.flag;
  domElements["professionalDiv"].hidden = !hireProfessionalsProject.flag;
  domElements["column0"].hidden = !prestigeUnlockedEvent.flag;
  domElements["paperBuyerDiv"].hidden = !paperBuyerUnlocked;

  domElements["paperPrice"].innerHTML = paperPrice;
  domElements["marketingLevel"].innerHTML = commify(marketingLevel);
  domElements["paperBuyer"].innerHTML = paperBuyerOn ? "ON" : "OFF";

  domElements["priceSlider"].addEventListener('input', (event) => {
    cranePrice = domElements["priceSlider"].value;
    domElements["cranePrice"].innerHTML = monify(cranePrice);
  });

  // Initial messages.
  if (consoleHistory.length == 0) {
    displayMessage('Buy some paper using the "Paper" button, then click "Fold Crane" to start making cranes.');
  }

});

// Game loop!
window.setInterval(function () {
  var demand = (0.08 / cranePrice) * Math.pow(1.3, marketingLevel - 1);

  // Make cranes before selling them.
  makeCrane((highSchoolers * highSchoolerBoost) / 500);
  makeCrane(professionals);

  // Sell cranes.
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

  debt = Math.min(maxDebt, debt);

  // Disable buttons which player cannot use
  domElements["btnMakeCrane"].disabled = paper < 1;
  domElements["btnBuyPaper"].disabled = paperPrice > funds;
  domElements["btnMarketing"].disabled = marketingPrice > funds;
  domElements["btnHireHighSchooler"].disabled = funds < minWage;
  domElements["btnPayBack"].disabled = funds <= 0 || debt <= 0;
  domElements["btnBorrowMoney"].disabled = debt >= maxDebt;
  domElements["btnHireProfessional"].disabled = professionalCost > funds;

  var happiness = funds >= 0.1 ? Math.log(funds + wishes) : 0
  domElements["happinessMeter"].style.width = happiness + "%"
  domElements["happinessAmount"].innerHTML = happiness.toFixed(2);

  domElements["cranes"].innerHTML = commify(Math.round(cranes));
  domElements["unsoldCranes"].innerHTML = commify(Math.floor(unsoldCranes));
  domElements["funds"].innerHTML = monify(funds);
  domElements["marketingPrice"].innerHTML = monify(marketingPrice);
  domElements["demand"].innerHTML = commify(Math.floor(demand * 100));
  domElements["highSchoolers"].innerHTML = commify(highSchoolers);
  domElements["debt"].innerHTML = monify(debt);
  domElements["paper"].innerHTML = commify(Math.floor(paper));
  domElements["interestRate"].innerHTML = interestRate * 100;
  domElements["highSchoolerCost"].innerHTML = monify(minWage);
  domElements["professionals"].innerHTML = commify(professionals);
  domElements["professionalCost"].innerHTML = monify(professionalCost);
  domElements["wishes"].innerHTML = commify(Math.floor(wishes));
  domElements["craneCountCrunched"].innerHTML = spellf(Math.round(cranes));
  domElements["cranePrice"].innerHTML = monify(cranePrice);

  manageProjects();
  manageEvents();
  notificationCount = pendingEvents.length + (eventDiv.style.display == "block" ? 1 : 0);
  document.title = (notificationCount ? "(" + notificationCount + ") " : "") + "Paper Cranes";
  domElements["icon"].setAttribute("href", notificationCount ? "../favicon_notification.svg" : "../favicon_crane.svg");
  tick++;

}, 10);

// A slower one.
window.setInterval(function () {
  save();

  // Fluctuate price.
  paperPrice = Math.floor(Math.sin(tick / 10) * 4) + basePaperPrice;
  domElements["paperPrice"].innerHTML = paperPrice;

  debt = Math.ceil(debt * (1 + interestRate) * 100) / 100;
  debt = Math.min(maxDebt, debt);
}, 5000);

// Slower one, every second.
window.setInterval(function () {
  domElements["cranemakerRate"].innerHTML = commify(Math.round(cranes - prevCranes));
  prevCranes = cranes;
}, 1000);


function restart() {
  if (confirm(
      "Are you sure you want to restart? \nThis will clear all your progress. "
    )) {
    localStorage.clear();
    location.reload();
  }
}

// Handles.
function makeCrane(n) {
  n = Math.min(n, paper)

  wishes += n / 1000;

  cranes += n;
  unsoldCranes += n;
  paper -= n;

  domElements["cranes"].innerHTML = commify(Math.floor(cranes));
}

function buyPaper(n) {
  if (funds < paperPrice * n) {
    return;
  }
  // Buys paper! May be upgraded.
  paper += Math.round(paperAmount * n);
  funds -= Math.round(paperPrice * n);
}

function hireHighSchooler() {
  // Hires a highSchooler!
  highSchoolers++;
  funds -= minWage;
  minWage = Math.ceil(minWage * 1.01 * 100) / 100;
}

function hireProfessional() {
  // Hires one Professional
  if (funds < professionalCost) {
    return;
  }
  professionals++;
  funds -= professionalCost;
  professionalCost = Math.ceil(professionalCost * 1.1 * 100) / 100;
}



function increaseMarketing() {
  if (funds < marketingPrice) {
    return;
  }
  marketingLevel += 1;
  funds -= marketingPrice;

  marketingPrice = Math.round(marketingPrice * 2);
  domElements["marketingLevel"].innerHTML = commify(marketingLevel);
}

function borrowMoney(x) {
  x = Math.min(x, maxDebt - debt);
  funds += x;
  debt += x;
}

function payBack(x) {
  var max = Math.min(debt, funds);
  debt -= max;
  funds -= max;
}

function togglePaperBuyer() {
  paperBuyerOn = !paperBuyerOn
  domElements["paperBuyer"].innerHTML = paperBuyerOn ? "ON" : "OFF";
}

// Console stuff.
function displayMessage(msg, dontSave) {
  console.log(msg);
  if (!dontSave) {
    consoleHistory.push(msg);
  }
  var newMsgEl = document.createElement("div");
  newMsgEl.setAttribute("class", "consoleMsg");
  newMsgEl.setAttribute("id", "consoleMsg");
  newMsgEl.innerHTML = msg;
  newMsgEl.style.opacity = 0;
  fade(newMsgEl, 1.0);

  domElements["readoutDiv"].prepend(newMsgEl, domElements["readoutDiv"].firstChild);
}

// Project management functions.
function displayProjects(project) {
  project.element = document.createElement("button");
  project.element.style.opacity = 0;
  project.element.setAttribute("id", project.id);

  project.element.onclick = function () {
    baseEffect(project);
    project.effect();
  };

  project.element.setAttribute("class", "projectButton");

  domElements["projectsDiv"].appendChild(project.element, domElements["projectsDiv"].firstChild);

  var span = document.createElement("span");
  span.style.fontWeight = "bold";
  project.element.appendChild(span);

  span.appendChild(document.createTextNode(project.title));
  project.element.appendChild(document.createTextNode(" " + priceTag(project)));
  project.element.appendChild(document.createElement("div"));
  project.element.appendChild(document.createTextNode(project.description));

  fade(project.element, project.canAfford() ? 1.0 : 0.6);

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
    project.element.disabled = !project.canAfford();
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

  if (pendingEvents.length > 0 && domElements["eventDiv"].style.display == "") {
    displayNextEvent();
  }
}

function displayNextEvent() {
  event = pendingEvents.pop();
  domElements["eventTitle"].innerHTML = event.title;
  domElements["eventDescription"].innerHTML = event.description;
  domElements["eventDiv"].style.opacity = 0;
  domElements["eventDiv"].style.display = "block";
  fade(domElements["eventDiv"], 1.0);
}

function closeEvent() {
  if (pendingEvents.length == 0) {
    domElements["eventDescription"].innerHTML = "";
    domElements["eventDiv"].style.display = "none";
  } else {
    displayNextEvent()
  }
}

function fade(element, targetOpacity) {
  var fadeCounter = -1;

  var handle = window.setInterval(function () {
    toggleVisibility(element);
  }, 30);

  function toggleVisibility(element) {
    if (fadeCounter > targetOpacity * 10) {
      element.style.opacity = null;
      clearInterval(handle);
      return;
    }
    element.style.opacity = fadeCounter / 10;
    fadeCounter++;
  }
}