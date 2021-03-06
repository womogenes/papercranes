// things that aren't resources
let lifetimeCranes = 0;
let unsoldCranes = 0;
let debt = 0;
let maxDebt = 1000;
let interestRate = 0.01;

let prevCranes = lifetimeCranes;
let cranePriceSliderLoc = 0.1;
let tick = 0;
let consoleHistory = [];
let pendingEvents = [];
let theme;

function save() {
  const savedGame = {
    // things that arent resources
    lifetimeCranes: lifetimeCranes,
    unsoldCranes: unsoldCranes,
    cranePrice: cranePrice,
    cranePriceSliderLoc: getEl('cranePriceSlider').value,
    debt: debt,
    maxDebt: maxDebt,
    interestRate: interestRate,
  };

  // saving resources
  for (resourceName in resources) {
    resource = resources[resourceName];
    savedGame[resourceName] = {};

    for (propertyName in resource) {
      property = resource[propertyName];
      if (!propertyName.endsWith('El') && typeof property != 'function') {
        // properties ending with el are used for updating the dom and so shouldn't be saved
        // functions are for game logic and also should not be saved since they may be changed
        savedGame[resourceName][propertyName] = resource[propertyName];
      }
    }
  }

  localStorage.setItem('savedGame', JSON.stringify(savedGame));

  // Deal with project stuff.
  let savedProjectData = {};
  for (const projectName in projects) {
    const project = projects[projectName];
    savedProjectData[projectName] = {
      flag: project.flag,
      uses: project.uses,
    };
  }

  localStorage.setItem('savedProjectData', JSON.stringify(savedProjectData));
  localStorage.setItem('savedActiveProjects', JSON.stringify(activeProjects));

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


  // saving other stuff
  localStorage.setItem('consoleHistory', JSON.stringify(consoleHistory));

  localStorage.setItem('pendingEvents', JSON.stringify((
    getEl('eventDiv').hidden ?
      // saves the currently displayed event if there is one
      pendingEvents : pendingEvents.concat([camelize(getEl('eventTitle').innerHTML)])
  )));
  localStorage.setItem('theme', JSON.stringify(theme));
}

function load() {
  loadTheme();
  // dont load if nothing to load
  if (localStorage.getItem('savedGame') == null) {
    save();
    return;
  }

  // things that arent resources
  let savedGame = JSON.parse(localStorage.getItem('savedGame'));
  lifetimeCranes = savedGame.lifetimeCranes;
  unsoldCranes = savedGame.unsoldCranes;
  cranePriceSliderLoc = savedGame.cranePriceSliderLoc;
  debt = savedGame.debt;
  maxDebt = savedGame.maxDebt;
  interestRate = savedGame.interestRate;

  // load resources
  for (resource in savedGame) {
    if (resources.hasOwnProperty(resource)) {
      update(resources[resource], savedGame[resource]);
    }
  }


  // Load projects and events
  const savedProjectData = JSON.parse(localStorage.getItem('savedProjectData'));
  for (let savedProjectName in savedProjectData) {
    if (projects[savedProjectName]) {
      update(projects[savedProjectName], savedProjectData[savedProjectName]);
    }
  }
  activeProjects = JSON.parse(localStorage.getItem('savedActiveProjects'));
  activeProjects.forEach((projectName) => {
    displayProject(projects[projectName]);
  });

  const savedEventData = JSON.parse(localStorage.getItem('savedEventData'));
  for (const eventName in savedEventData) {
    update(events[eventName], savedEventData[eventName]);
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
  getEl('cranePriceSlider').value = cranePriceSliderLoc;

  // Initial message.
  if (consoleHistory.length == 0) {
    displayMessage('Welcome.');
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
  // check if projects have been triggered
  for (let projectName in projects) {
    let project = projects[projectName];
    if (trigger(project) && project.uses > 0) {
      displayProject(project);
      project.uses--;
      activeProjects.push(camelize(project.title));
    }
  }

  // check currently displayed projects
  activeProjects.forEach((projectName) => {
    project = projects[projectName];
    project.element.disabled = !canAfford(project.costs);
  });
}

function manageEvents() {
  for (let eventName in events) {
    let event = events[eventName];
    if (trigger(event) && event.uses != 0) {
      if (event.notifyPlayer) {
        pendingEvents.push(camelize(event.title));
      }
      event.effect?.();
    }
  }

  if (pendingEvents.length > 0 && getEl('eventDiv').hidden) {
    displayEvent();
  }
}