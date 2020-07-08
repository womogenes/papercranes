// Yoy!
let cranes = 0;
let wishes = 0;
let unsoldCranes = 0;
let cranePriceSliderLoc = 0.1;
let learnedToFoldCranes = false;

let money = 40;
let debt = 0;
let maxDebt = 1e3;
let interestRate = 0.01;

let advertisingPrice = 40.0;
let advertisingLevel = 1;

let basePaperPrice = 15;
let paperPrice = 15;
let paperPurchaseAmount = 1000;
let paper = 10;
let paperBuyerOn = false;

let highSchoolerWage = 5;
let highSchoolers = 0;
let highSchoolerBoost = 1;
let professionals = 0;
let professionalWage = 100;

let prevCranes = cranes;
let tick = 0;

let consoleHistory = [];
let pendingEvents = [];

let theme;

function save() {
  const savedGame = {
    cranes: cranes,
    unsoldCranes: unsoldCranes,
    money: money,
    cranePrice: cranePrice,
    advertisingPrice: advertisingPrice,
    cranePriceSliderLoc: getEl('priceSlider').value,
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

  localStorage.setItem('savedGame', JSON.stringify(savedGame));

  // Deal with project stuff.
  let savedActiveProjects = [];
  let savedProjectData = {};

  for (const projectName in projects) {
    const project = projects[projectName];
    savedProjectData[projectName] = {
      flag: project.flag,
      uses: project.uses,
    };
  }

  for (let i = 0; i < activeProjects.length; i++) {
    savedActiveProjects[i] = activeProjects[i].title.camelize();
  }
  localStorage.setItem('savedProjectData', JSON.stringify(savedProjectData));
  localStorage.setItem('savedActiveProjects', JSON.stringify(savedActiveProjects));

  // Deal with events.
  const savedEventData = {};
  for (const eventName in events) {
    const event = events[eventName];
    savedEventData[eventName] = {
      flag: event.flag,
      uses: event.uses,
    };
  }
  localStorage.setItem('savedEventData', JSON.stringify(savedEventData));

  localStorage.setItem('consoleHistory', JSON.stringify(consoleHistory));
  localStorage.setItem('theme', JSON.stringify(theme));
}

function load() {
  loadTheme();
  if (localStorage.getItem('savedGame') == null) {
    save();
    return;
  }
  let savedGame = JSON.parse(localStorage.getItem('savedGame'));
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
  const savedProjectData = JSON.parse(localStorage.getItem('savedProjectData'));
  for (let savedProjectName in savedProjectData) {
    let savedProject = savedProjectData[savedProjectName];
    let project = projects[savedProjectName];
    project.uses = savedProject.uses;
    project.flag = savedProject.flag;
  }
  const savedActiveProjects = JSON.parse(localStorage.getItem('savedActiveProjects'));
  for (const projectName in projects) {
    const project = projects[projectName];
    if (savedActiveProjects.indexOf(project.title.camelize()) >= 0) {
      displayProjects(project);
      activeProjects.push(project);
    }
  }

  const savedEventData = JSON.parse(localStorage.getItem('savedEventData'));
  for (let eventName in savedEventData) {
    const savedEvent = savedEventData[eventName];
    const event = events[eventName];
    event.uses = savedEvent.uses;
    event.flag = savedEvent.flag;
  }

  [projects, events].forEach((object) => {
    for (const name in object) {
      const thing = object[name];
      if (thing.flag && thing.hasOwnProperty('loadEffect')) {
        thing.loadEffect();
      }
    }
  });


  consoleHistory = JSON.parse(localStorage.getItem('consoleHistory'));
  consoleHistory.forEach((message) => {
    displayMessage(message, true);
  });
}

document.addEventListener('DOMContentLoaded', function (event) {
  load();

  getEl('paperPrice').innerHTML = monify(paperPrice);
  getEl('advertisingLevel').innerHTML = commify(advertisingLevel);
  getEl('paperBuyer').innerHTML = paperBuyerOn ? 'ON' : 'OFF';
  getEl('priceSlider').value = cranePriceSliderLoc;

  // Initial message.
  if (consoleHistory.length == 0) {
    displayMessage('Hi');
  }

  // Only have button ripple on mobile.
  if (window.mobileAndTabletCheck()) {
    Array.from(document.getElementsByTagName('button')).forEach((button) => {
      if (getComputedStyle(button).getPropertyValue('--ripple').trim() === 'true') {
        button.addEventListener('click', createRipple);
      }
    });
  }

  document.onkeydown = function (e) {
    if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
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

// Project management functions.
function manageProjects() {
  for (let projectName in projects) {
    let project = projects[projectName];
    if (trigger(project) && project.uses > 0) {
      displayProjects(project);
      project.uses--;
      activeProjects.push(project);
    }
  }

  activeProjects.forEach((project) => {
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
      eventBaseEffect(event);
      event.effect();
    }
  }

  if (pendingEvents.length > 0 && getEl('eventDiv').hidden) {
    displayEvent();
  }
}
