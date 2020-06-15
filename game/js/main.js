// Yoy!
var cranes = 0;
var wishes = 0;
var unsoldCranes = 0;
var cranePriceSliderLoc = 0.1;
var learnedToFoldCranes = false;

var money = 40;
var debt = 0;
var maxDebt = 1e3;
var interestRate = 0.01;

var advertisingPrice = 40.0;
var advertisingLevel = 1;

var basePaperPrice = 15;
var paperPrice = 15;
var paperPurchaseAmount = 1000;
var paper = 10;
var paperBuyerOn = false;

var highSchoolerWage = 5;
var highSchoolers = 0;
var highSchoolerBoost = 1;
var professionals = 0;
var professionalWage = 100;

var prevCranes = cranes;
var tick = 0;
var prevTimer = Date.now();

var consoleHistory = [];
var pendingEvents = [];

var theme;

function save() {
  var savedGame = {
    cranes: cranes,
    unsoldCranes: unsoldCranes,
    money: money,
    cranePrice: cranePrice,
    advertisingPrice: advertisingPrice,
    cranePriceSliderLoc: getEl("priceSlider").value,
    paperPrice: paperPrice,
    paperPurchaseAmount: paperPurchaseAmount,
    paper: paper,
    advertisingLevel: advertisingLevel,
    highSchoolers: highSchoolers,
    highSchoolerWage: highSchoolerWage,
    debt: debt,
    maxDebt: maxDebt,
    interestRate: interestRate,

    professionals: professionals,
    professionalWage: professionalWage,
    basePaperPrice: basePaperPrice,
    wishes: wishes,

    paperBuyerOn: paperBuyerOn,
    learnedToFoldCranes: learnedToFoldCranes,
  };

  localStorage.setItem("savedGame", JSON.stringify(savedGame));

  // Deal with project stuff.
  var savedActiveProjects = [];
  var savedProjectData = {};

  for (let projectName in projects) {
    let project = projects[projectName];
    savedProjectData[projectName] = {
      flag: project.flag,
      uses: project.uses
    }
  }

  for (let i = 0; i < activeProjects.length; i++) {
    savedActiveProjects[i] = activeProjects[i].title.camelize();
  }
  localStorage.setItem("savedProjectData", JSON.stringify(savedProjectData));
  localStorage.setItem("savedActiveProjects", JSON.stringify(savedActiveProjects));

  // Deal with events.
  let savedEventData = {};
  for (let eventName in events) {
    let event = events[eventName];
    savedEventData[eventName] = {
      flag: event.flag,
      uses: event.uses
    }
  }
  localStorage.setItem("savedEventData", JSON.stringify(savedEventData));

  localStorage.setItem("consoleHistory", JSON.stringify(consoleHistory));
  localStorage.setItem("theme", JSON.stringify(theme));
}

function load() {
  loadTheme();
  if (localStorage.getItem("savedGame") == null) {
    save();
    return;
  }
  var savedGame = JSON.parse(localStorage.getItem("savedGame"));
  cranes = savedGame.cranes;
  wishes = savedGame.wishes;
  unsoldCranes = savedGame.unsoldCranes;
  cranePriceSliderLoc = savedGame.cranePriceSliderLoc;
  if (savedGame.learnedToFoldCranes) {
    learnToFoldCranes();
  }

  money = savedGame.money;
  debt = savedGame.debt;
  maxDebt = savedGame.maxDebt;
  interestRate = savedGame.interestRate;

  advertisingPrice = savedGame.advertisingPrice;
  advertisingLevel = savedGame.advertisingLevel;

  paperPrice = savedGame.paperPrice;
  paperPurchaseAmount = savedGame.paperPurchaseAmount;
  paper = savedGame.paper;
  basePaperPrice = savedGame.basePaperPrice;
  paperBuyerOn = savedGame.paperBuyerOn;

  highSchoolers = savedGame.highSchoolers;
  highSchoolerWage = savedGame.highSchoolerWage;
  professionals = savedGame.professionals;
  professionalWage = savedGame.professionalWage;

  // Load projects and events
  var savedProjectData = JSON.parse(localStorage.getItem("savedProjectData"));
  for (let savedProjectName in savedProjectData) {
    let savedProject = savedProjectData[savedProjectName];
    let project = projects[savedProjectName];
    project.uses = savedProject.uses;
    project.flag = savedProject.flag;
  }
  for (let projectName in projects) {
    let savedActiveProjects = JSON.parse(localStorage.getItem("savedActiveProjects"));
    let project = projects[projectName];
    if (savedActiveProjects.indexOf(project.title.camelize()) >= 0) {
      displayProjects(project);
      activeProjects.push(project);
    }
  }

  var savedEventData = JSON.parse(localStorage.getItem("savedEventData"));
  for (let eventName in savedEventData) {
    let savedEvent = savedEventData[eventName];
    let event = events[eventName];
    event.uses = savedEvent.uses;
    event.flag = savedEvent.flag;
  }

  [projects, events].forEach(object => {
    for (let name in object) {
      let thing = object[name];
      if (thing.flag && thing.hasOwnProperty("loadEffect")) {
        thing.loadEffect();
      }
    }
  });


  consoleHistory = JSON.parse(localStorage.getItem("consoleHistory"));
  consoleHistory.forEach(message => {
    displayMessage(message, true);
  });
}

document.addEventListener("DOMContentLoaded", function (event) {
  load();

  getEl("paperPrice").innerHTML = monify(paperPrice);
  getEl("advertisingLevel").innerHTML = commify(advertisingLevel);
  getEl("paperBuyer").innerHTML = paperBuyerOn ? "ON" : "OFF";
  getEl("priceSlider").value = cranePriceSliderLoc;

  // Initial message.
  if (consoleHistory.length == 0) {
    displayMessage("Hi");
  }

  // Only have button ripple on mobile.
  if (window.mobileAndTabletCheck()) {
    Array.from(document.getElementsByTagName("button")).forEach(button => {
      if (getComputedStyle(button).getPropertyValue("--ripple").trim() === "true") {
        button.addEventListener("click", createRipple);
      }
    });
  }

  document.onkeydown = function (e) {
    if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      if (e.keyCode == 83) { // ctrl + s
        save();
        e.preventDefault();
      } else if (e.keyCode == 82) { // ctrl + r
        save();
      } else if (e.keyCode == 81) { // ctrl + q
        changeTheme();
      }
    }
  };
});

// Game loop!
setInterval(function () {
  // Make cranes before selling them.
  makeCrane((highSchoolers * highSchoolerBoost) / 500);
  makeCrane(professionals);
  if (projects.buisnessManagement.flag) {
    sellCranes();
  }


  cranePrice = (Math.pow(101, getEl("priceSlider").value) - 1) / 10 + 0.01;

  manageProjects();
  manageEvents();

  updateDom();
  tick++;
}, 10);

// Slower one, every second.
setInterval(function () {
  getEl("cranemakerRate").innerHTML = commify(Math.round(cranes - prevCranes));
  prevCranes = cranes;
}, 1000);

// A slower on, every 5 seconds.
setInterval(function () {
  save();

  // Fluctuate price.
  paperPrice = Math.floor(Math.sin(tick / 10) * 4) + basePaperPrice;
  getEl("paperPrice").innerHTML = monify(paperPrice);
}, 5000);

setInterval(function () {
  debt = Math.ceil(debt * (1 + interestRate) * 100) / 100;
}, 10000);

function sellCranes() {
  var demand = (0.08 / cranePrice) * Math.pow(1.3, advertisingLevel - 1);
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
    money += cranePrice * amount;
  }
}

function updateDom() {
  // Update elements to have correct values
  getEl("cranes").innerHTML = commify(Math.round(cranes));
  getEl("wishes").innerHTML = commify(Math.floor(wishes));

  getEl("unsoldCranes").innerHTML = commify(Math.floor(unsoldCranes));
  getEl("craneCountCrunched").innerHTML = spellf(Math.round(cranes));
  getEl("cranePrice").innerHTML = monify(parseFloat(cranePrice));

  getEl("money").innerHTML = monify(money);
  getEl("advertisingPrice").innerHTML = monify(advertisingPrice);
  getEl("debt").innerHTML = monify(debt);
  getEl("interestRate").innerHTML = interestRate * 100;
  getEl("paper").innerHTML = commify(Math.floor(paper));

  getEl("highSchoolers").innerHTML = commify(highSchoolers);
  getEl("highSchoolerWage").innerHTML = monify(highSchoolerWage);
  getEl("professionals").innerHTML = commify(professionals);
  getEl("professionalWage").innerHTML = monify(professionalWage);

  var happiness = money - debt > 0 ? Math.log(money + wishes - debt) : 0
  getEl("happinessMeter").style.width = happiness + "%"
  getEl("happinessAmount").innerHTML = happiness.toFixed(2);

  // Disable buttons which player cannot use
  getEl("btnMakeCrane").disabled = paper < 1;
  getEl("btnBuyPaper").disabled = paperPrice > money;
  getEl("btnAdvertising").disabled = advertisingPrice > money;
  getEl("btnHireHighSchooler").disabled = money < highSchoolerWage;
  getEl("btnpayBackLoan").disabled = money <= 0 || debt <= 0;
  getEl("btnBorrowMoney").disabled = debt >= maxDebt;
  getEl("btnHireProfessional").disabled = professionalWage > money;

  // Change favicon and title to show notifications
  var notificationCount = pendingEvents.length + (getEl("eventDiv").hidden ? 0 : 1);
  document.title = `${notificationCount ? `(${notificationCount}) ` : ""}Paper Cranes`;
  getEl("icon").setAttribute("href", notificationCount ? "../favicon_notification.svg" : "../favicon_crane.svg");
}

// Project management functions.
function displayProjects(project) {
  project.element = document.createElement("button");
  project.element.style.opacity = 0;
  project.element.setAttribute("id", project.title.camelize());

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
  project.element.appendChild(document.createTextNode(` ${projectPriceTag(project)}`));
  project.element.appendChild(document.createElement("div"));
  project.element.appendChild(document.createTextNode(project.description));

  fade(project.element, canAffordProject(project) ? 1.0 : 0.6);
}

function manageProjects() {
  for (let projectName in projects) {
    let project = projects[projectName];
    if (trigger(project) && project.uses > 0) {
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
  for (let eventName in events) {
    let event = events[eventName];
    if (trigger(event) && event.uses != 0) {
      if (event.notifyPlayer) {
        pendingEvents.push(event.title.camelize());
      }
      eventBaseEffect(event)
      event.effect();
    }
  }

  if (pendingEvents.length > 0 && getEl("eventDiv").hidden) {
    displayEvent();
  }
}

function displayEvent(event) {
  // If event is not passed, displayed next event
  // If event is passed, moves the currently displayed event back to pendingEvents
  // and replaces it with event
  if (event) {
    if (!getEl("eventDiv").hidden) {
      pendingEvents.push(getEl("eventTitle").innerHTML.camelize());
    }
  } else {
    let eventName = pendingEvents.pop();
    event = events.hasOwnProperty(eventName) ? events[eventName] : otherThings[eventName];
  }
  resetEventDiv();
  getEl("eventTitle").innerHTML = event.title.toTitleCase();
  getEl("eventDescription").innerHTML = event.description;
  if (event.noCloseButton) {
    getEl("eventCloseButton").hidden = true;
  }
  if (event.buttons) {
    event.buttonEls = {};
    for (let buttonText in event.buttons) {
      let newButton = document.createElement("button");
      newButton.className = "button";
      newButton.innerHTML = buttonText.toTitleCase();
      newButton.onclick = event.buttons[buttonText];
      getEl("eventButtons").appendChild(newButton);
      event.buttonEls[buttonText] = newButton;
    }
  }
  if (getEl("eventDiv").hidden) {
    unhide("eventDiv");
  }

}