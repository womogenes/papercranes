// Game stuff
function updateDom() {
  // Update elements to have correct values
  getEl('lifetimeCranes').innerHTML = commify(Math.floor(lifetimeCranes));
  getEl('unsoldCranes').innerHTML = commify(Math.floor(unsoldCranes));

  getEl('cranePrice').innerHTML = monify(cranePrice);
  getEl('debt').innerHTML = monify(debt);
  getEl('interestRate').innerHTML = interestRate * 100;

  // updates resources
  for (resourceName in resources) {
    resource = resources[resourceName];
    if (resource.amountEl) {
      let amount = resource.formattedAmount ? resource.formattedAmount(resource.amount) : commify(resource.amount);
      getEl(resource.amountEl).innerHTML = amount;
    }
    if (resource.costEl) {
      getEl(resource.costEl).innerHTML = priceTag(resource.costs);
    }
    if (resource.wageEl) {
      getEl(resource.wageEl).innerHTML = monify(resource.wage);
    }
    if (resource.purchaseEl && resource.costs != undefined) {
      getEl(resource.purchaseEl).disabled = !canAfford(resource.costs);
    } else if (resource.purchaseEl && resource.wage != undefined) {
      getEl(resource.purchaseEl).disabled = money.amount < resource.wage;
    }
  }

  // update happiness
  let happiness = money.amount - debt > 0 ? Math.min(Math.log(money.amount + wishes.amount - debt), 100) : 0;
  getEl('happinessMeter').style.width = happiness + '%';
  getEl('happinessAmount').innerHTML = happiness.toFixed(2) + '%';
  if (happiness >= 100) {
    displayMessage('You maxed out happiness');
  }

  // Disable buttons which the player cannot use
  getEl('btnpayBackLoan').disabled = money.amount <= 0 || debt <= 0;
  getEl('btnBorrowMoney').disabled = debt >= maxDebt;
  getEl('btnMakeCrane').disabled = paper.amount < 1;
  getEl('btnHireHighSchooler').disabled = money.amount < highSchoolers.wage;
  getEl('btnFireHighSchooler').disabled = highSchoolers.amount <= 0;
}

function updateTitle() {
  // Change favicon and title to show notifications
  let notificationCount = pendingEvents.length + (getEl('eventDiv').hidden ? 0 : 1);
  document.title = `${notificationCount ? `(${notificationCount}) ` : ''}Paper Cranes`;
  getEl('icon').setAttribute('href', notificationCount ? '../images/favicon_notification.svg' : '../images/favicon_crane.svg');
}

// Events and projects
function displayEvent(event) {
  // If event is not passed, displays next event
  // If event is passed, moves the currently displayed event back to pendingEvents
  // and replaces it with event

  // Get the event to display
  if (event) {
    if (!getEl('eventDiv').hidden) {
      // save the currently displayed event for later
      let currentEventName = camelize(getEl('eventTitle').innerHTML);
      pendingEvents.push(currentEventName);
      events[currentEventName].onClose?.();
    }
  } else {
    event = events[pendingEvents.pop()];
  }

  // update eventdiv with event information
  resetEventDiv();
  getEl('eventTitle').innerHTML = toTitleCase(event.title);
  getEl('eventDescription').innerHTML = event.description;
  if (event.noCloseButton) {
    getEl('eventCloseButton').hidden = true;
  }

  // add event buttons
  if (event.buttons) {
    event.buttons.forEach((button) => {
      const newButton = document.createElement('button');
      newButton.innerHTML = toTitleCase(button.text);
      newButton.onclick = button.onClick;
      getEl('eventButtons').appendChild(newButton);
    });
  }

  event.onDisplay?.();
  
  if (getEl('eventDiv').hidden) {
    unhide('eventDiv');
  }
}

function displayProject(project) {
  project.element = document.createElement('button');
  project.element.style.opacity = 0;
  project.element.setAttribute('id', camelize(project.title));

  project.element.onclick = function () {
    projectBaseEffect(project);
    project.effect();
  };

  getEl('projectsDiv').appendChild(project.element, getEl('projectsDiv').firstChild);

  let titleDiv = document.createElement('div');
  titleDiv.setAttribute('class', 'titleDiv');

  let title = document.createElement('b');
  titleDiv.appendChild(title);

  title.appendChild(document.createTextNode(toTitleCase(project.title)));
  titleDiv.appendChild(document.createTextNode(` (${priceTag(project.costs)})`));
  project.element.appendChild(titleDiv);

  project.element.appendChild(document.createElement('div'));
  project.element.appendChild(document.createTextNode(project.description));

  fade(project.element, canAfford(project.costs) ? 1.0 : 0.6);
}

function resetEventDiv() {
  getEl('eventTitle').innerHTML = '';
  getEl('eventDescription').innerHTML = '';
  getEl('eventButtons').innerHTML = '';
  getEl('eventCloseButton').hidden = false;
}

function displayMessage(msg, dontSave) {
  if (!dontSave) {
    consoleHistory.push(msg);
  }
  const newMsgEl = document.createElement('div');
  newMsgEl.setAttribute('class', 'consoleMsg');
  newMsgEl.setAttribute('id', 'consoleMsg');
  newMsgEl.innerHTML = msg;
  newMsgEl.style.opacity = 0;
  fade(newMsgEl, 1.0);

  getEl('readoutDiv').prepend(newMsgEl, getEl('readoutDiv').firstChild);
}