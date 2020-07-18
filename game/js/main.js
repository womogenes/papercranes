// Yoy!
let lifetimeCranes = 0;
let unsoldCranes = 0;
let debt = 0;
let maxDebt = 1000;
let interestRate = 0.01;

// resources
let money = {
  amount: 35,
  amountEl: 'money',
  formattedAmount: function () {
    return monify(this.amount);
  },
};
let wishes = {
  amount: 0,
  amountEl: 'wishes',
  formattedAmount: function() {
    return Math.floor(this.amount);
  },
};
let advertising = {
  amount: 1, // level
  amountEl: 'advertisingLevel',
  price: 20,
  priceEl: 'advertisingPrice',
  purchaseEl: 'btnAdvertising',
};
let highSchoolers = {
  amount: 0,
  amountEl: 'highSchoolers',
  wage: 5,
  wageEl: 'highSchoolerWage',
  purchaseEl: 'btnHireHighSchooler',
  boost: 1,
};
let professionals = {
  amount: 0,
  amountEl: 'professionals',
  wage: 100,
  wageEl: 'professionalWage',
  purchaseEl: 'btnHireProfessional',
  boost: 1,
};
let paper = {
  amount: 10,
  amountEl: 'paper',
  price: 15,
  priceEl: 'paperPrice',
  purchaseEl: 'btnBuyPaper',
  basePrice: 15,
  purchaseAmount: 1000,
};
let wood = {
  amount: 0,
  amountEl: 'wood',
  price: 50,
  priceEl: 'woodPrice',
  purchaseEl: 'btnBuyWood',
  purchaseAmount: 500,
};
let paperMills = {
  amount: 0,
  amountEl: 'paperMills',
  price: 500,
  priceEl: 'paperMillPrice',
  purchaseEl: 'btnBuyPaperMill',
  boost: 1,
  woodUse: 0.5,
  energyUse: 0.1,
  emissions: 0.001,
};
let energy = {
  amount: 0,
  amountEl: 'energy',
  price: 150,
  priceEl: 'energyPrice',
  purchaseEl: 'btnBuyEnergy',
  purchaseAmount: 100,
};
let coal = {
  amount: 0,
  amountEl: 'coal',
  price: 200,
  priceEl: 'coalPrice',
  purchaseEl: 'btnBuyCoal',
  purchaseAmount: 50,
};
let powerPlants = {
  amount: 0,
  amountEl: 'powerPlants',
  price: 1000,
  priceEl: 'powerPlantPrice',
  purchaseEl: 'btnBuyPowerPlant',
  boost: 1,
  coalUse: 0.1,
  emissions: 0.001,
};
let factories = {
  amount: 0,
  amountEl: 'factories',
  price: 1000,
  priceEl: 'factoryPrice',
  purchaseEl: 'btnBuyFactory',
  boost: 1,
  energyUse: 0.1,
  emissions: 0.001,
};
let carbonDioxide = {
  amount: 300,
  amountEl: 'carbonDioxide',
};
let resources = {
  highSchoolers: highSchoolers,
  professionals: professionals,
  paper: paper,
  wood: wood,
  paperMills: paperMills,
  energy: energy,
  factories: factories,
  coal: coal,
  powerPlants: powerPlants,
  carbonDioxide: carbonDioxide,
  advertising: advertising,
  money: money,
  wishes: wishes,
};

// things that aren't resources
let prevCranes = lifetimeCranes;
let cranePriceSliderLoc = 0.1;
let tick = 0;
let consoleHistory = [];
let pendingEvents = [];
let theme;

function save() {
  const savedGame = {
    lifetimeCranes: lifetimeCranes,
    unsoldCranes: unsoldCranes,
    cranePrice: cranePrice,
    cranePriceSliderLoc: getEl('priceSlider').value,
    debt: debt,
    maxDebt: maxDebt,
    interestRate: interestRate,
  };
  for (resourceName in resources) {
    resource = resources[resourceName];
    savedGame[resourceName] = {};
    for (propertyName in resource) {
      property = resource[propertyName];
      if (!propertyName.endsWith('El') && typeof property != 'function') {
        // properties ending with el are used for updating the dom and so shouldn't be saved
        // functions are for game logic and also should not be saved
        savedGame[resourceName][propertyName] = resource[propertyName];
      }
    }
  }

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
    if (event.save != undefined) {
      savedEventData[eventName] = {};
      event.save.forEach((propertyName) => {
        savedEventData[eventName][propertyName] = event[propertyName];
      });
    }
  }
  localStorage.setItem('savedEventData', JSON.stringify(savedEventData));


  localStorage.setItem('consoleHistory', JSON.stringify(consoleHistory));
  localStorage.setItem('pendingEvents', JSON.stringify(pendingEvents.concat([getEl('eventTitle').innerHTML.camelize()])));
  localStorage.setItem('theme', JSON.stringify(theme));
}

function load() {
  loadTheme();
  if (localStorage.getItem('savedGame') == null) {
    save();
    return;
  }
  let savedGame = JSON.parse(localStorage.getItem('savedGame'));
  lifetimeCranes = savedGame.lifetimeCranes;
  unsoldCranes = savedGame.unsoldCranes;
  cranePriceSliderLoc = savedGame.cranePriceSliderLoc;

  debt = savedGame.debt;
  maxDebt = savedGame.maxDebt;
  interestRate = savedGame.interestRate;

  // load resources
  for (property in savedGame) {
    if (resources.hasOwnProperty(property)) {
      update(resources[property], savedGame[property]);
    }
  }


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
  for (const eventName in savedEventData) {
    const savedEvent = savedEventData[eventName];
    const event = events[eventName];
    for (const propertyName in savedEvent) {
      event[propertyName] = savedEvent[propertyName];
    }
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
  pendingEvents = JSON.parse(localStorage.getItem('pendingEvents'));
  consoleHistory.forEach((message) => {
    displayMessage(message, true);
  });
}

document.addEventListener('DOMContentLoaded', function (event) {
  load();
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

// Project/event management functions.
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
      if (event.effect) {
        event.effect();
      }
    }
  }

  if (pendingEvents.length > 0 && getEl('eventDiv').hidden) {
    displayEvent();
  }
}