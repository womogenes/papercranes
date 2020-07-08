function updateDom() {
  // Update elements to have correct values
  getEl('wishes').innerHTML = commify(Math.floor(wishes));

  getEl('unsoldCranes').innerHTML = commify(Math.floor(unsoldCranes));
  getEl('cranePrice').innerHTML = monify(parseFloat(cranePrice));

  getEl('money').innerHTML = monify(money);
  getEl('advertisingPrice').innerHTML = monify(advertisingPrice);
  getEl('debt').innerHTML = monify(debt);
  getEl('interestRate').innerHTML = interestRate * 100;
  getEl('paper').innerHTML = commify(Math.floor(paper));

  getEl('highSchoolers').innerHTML = commify(highSchoolers);
  getEl('highSchoolerWage').innerHTML = monify(highSchoolerWage);
  getEl('professionals').innerHTML = commify(professionals);
  getEl('professionalWage').innerHTML = monify(professionalWage);

  let happiness = money - debt > 0 ? Math.min(Math.log(money + wishes - debt), 100) : 0;
  getEl('happinessMeter').style.width = happiness + '%';
  getEl('happinessAmount').innerHTML = happiness.toFixed(2) + '%';

  // Disable buttons which player cannot use
  getEl('btnMakeCrane').disabled = paper < 1;
  getEl('btnBuyPaper').disabled = paperPrice > money;
  getEl('btnAdvertising').disabled = advertisingPrice > money;
  getEl('btnHireHighSchooler').disabled = money < highSchoolerWage;
  getEl('btnpayBackLoan').disabled = money <= 0 || debt <= 0;
  getEl('btnBorrowMoney').disabled = debt >= maxDebt;
  getEl('btnHireProfessional').disabled = professionalWage > money;

  // Change favicon and title to show notifications
  let notificationCount = pendingEvents.length + (getEl('eventDiv').hidden ? 0 : 1);
  document.title = `${notificationCount ? `(${notificationCount}) ` : ''}Paper Cranes`;
  getEl('icon').setAttribute('href', notificationCount ? '../favicon_notification.svg' : '../favicon_crane.svg');
}

const domElements = {};

function getEl(id) {
  if (!domElements[id]) {
    domElements[id] = document.getElementById(id);
  }
  return domElements[id];
}

function fade(element, targetOpacity) {
  let fadeCounter = -1;

  const handle = window.setInterval(function () {
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

function unhide(id) {
  const el = getEl(id);
  el.style.opacity = 0;
  el.hidden = false;
  fade(el, 1.0);
}

function createRipple(e) {
  const circle = document.createElement('div');
  this.appendChild(circle);
  const d = Math.max(this.clientWidth, this.clientHeight);
  circle.style.width = circle.style.height = d + 'px';

  const rect = this.getBoundingClientRect();
  circle.style.left = e.clientX - rect.left - d / 2 + 'px';
  circle.style.top = e.clientY - rect.top - d / 2 + 'px';

  circle.classList.add('ripple');
  circle.addEventListener('animationend', function (e) {
    this.parentNode.removeChild(this);
  });
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

const themes = {
  'Light': {
    '--bg-color': '#ffffff',
    '--outline-color': '#000000',
    '--text-color': '#000000',
    '--fill-color': '#cccccc',
    '--slider-focus-bg-color': '#e0e0e0',
    '--slider-thumb-color': '#909090',

    '--btn-bg-on': '#eeeeee',
    '--btn-bg-hover': '#f9f9f9',
    '--btn-bg-active': '#cccccc',
    '--btn-outline-hover': '#222222',
    '--btn-outline-active': '#222222',
    '--btn-outline-disabled': '#555555',
  },
  'Dark': {
    '--bg-color': '#181818',
    '--outline-color': '#dddddd',
    '--text-color': '#eeeeee',
    '--fill-color': '#555555',
    '--slider-focus-bg-color': '#707070',
    '--slider-thumb-color': '#909090',

    '--btn-bg-on': '#111111',
    '--btn-bg-hover': '#222222',
    '--btn-bg-active': '#1e1e1e',
    '--btn-outline-hover': '#cccccc',
    '--btn-outline-active': '#aaaaaa',
    '--btn-outline-disabled': '#555555',
  },
};

function loadTheme() {
  theme = JSON.parse(localStorage.getItem('theme'));
  if (!theme) {
    theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'Dark' : 'Light';
    localStorage.setItem('theme', JSON.stringify(theme));
  }
  applyTheme(theme);
}

function applyTheme(theme) {
  // Sets theme colors.
  for (const i in themes[theme]) {
    document.documentElement.style.setProperty(i, themes[theme][i]);
  }
}

function resetEventDiv() {
  getEl('eventTitle').innerHTML = '';
  getEl('eventDescription').innerHTML = '';
  getEl('eventButtons').innerHTML = '';
  getEl('eventCloseButton').hidden = false;
}