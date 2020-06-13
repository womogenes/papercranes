function increaseAdvertising() {
  if (money < advertisingPrice) {
    return;
  }
  advertisingLevel += 1;
  money -= advertisingPrice;

  advertisingPrice = Math.round(advertisingPrice * 2);
  getEl("advertisingLevel").innerHTML = commify(advertisingLevel);
}


function borrowMoney(x) {
  x = Math.min(x, maxDebt - debt);
  money += x;
  debt += x;
}

function payBack(x) {
  var max = Math.min(debt, money);
  debt -= max;
  money -= max;
}

function togglePaperBuyer() {
  paperBuyerOn = !paperBuyerOn
  getEl("paperBuyer").innerHTML = paperBuyerOn ? "ON" : "OFF";
}

function hireHighSchooler() {
  // Hires a highSchooler!
  highSchoolers++;
  money -= highSchoolerWage;
  highSchoolerWage = Math.ceil(highSchoolerWage * 1.01 * 100) / 100;
}

function hireProfessional() {
  // Hires one Professional
  if (money < professionalWage) {
    return;
  }
  professionals++;
  money -= professionalWage;
  professionalWage = Math.ceil(professionalWage * 1.1 * 100) / 100;
}

function makeCrane(n) {
  n = Math.min(n, paper)

  wishes += n / 1000;

  cranes += n;
  unsoldCranes += n;
  paper -= n;

  getEl("cranes").innerHTML = commify(Math.floor(cranes));
}

function buyPaper(n) {
  if (money < paperPrice * n) {
    return;
  }
  // Buys paper! May be upgraded.
  paper += Math.round(paperAmount * n);
  money -= Math.round(paperPrice * n);
}

function closeEvent() {
  if (pendingEvents.length) {
    displayEvent();
  } else {
    resetEventDiv();
    getEl("eventDiv").hidden = true;
  }
}

function changeTheme() {
  theme = theme == "Light" ? "Dark" : "Light"
  applyTheme(theme);
}

function restart() {
  if (otherThings.restartEvent.uses) {
    otherThings.restartEvent.uses -= 1;
    displayEvent(otherThings.restartEvent);
  }
}

function learnToFoldCranes() {
  learnedToFoldCranes = true;
  unhide("projectsColumn");
  unhide("foldingColumn");
  getEl("learnColumn").hidden = true;
}