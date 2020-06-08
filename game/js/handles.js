function increaseAdvertising() {
  if (funds < advertisingPrice) {
    return;
  }
  advertisingLevel += 1;
  funds -= advertisingPrice;

  advertisingPrice = Math.round(advertisingPrice * 2);
  getEl("advertisingLevel").innerHTML = commify(advertisingLevel);
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
  getEl("paperBuyer").innerHTML = paperBuyerOn ? "ON" : "OFF";
}

function hireHighSchooler() {
  // Hires a highSchooler!
  highSchoolers++;
  funds -= highSchoolerWage;
  highSchoolerWage = Math.ceil(highSchoolerWage * 1.01 * 100) / 100;
}

function hireProfessional() {
  // Hires one Professional
  if (funds < professionalWage) {
    return;
  }
  professionals++;
  funds -= professionalWage;
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
  if (funds < paperPrice * n) {
    return;
  }
  // Buys paper! May be upgraded.
  paper += Math.round(paperAmount * n);
  funds -= Math.round(paperPrice * n);
}

function closeEvent() {
  if (pendingEvents.length) {
    displayNextEvent()
  } else {
    getEl("eventDescription").innerHTML = "";
    getEl("eventDiv").hidden = true;
  }
}

function changeTheme() {
  theme = theme == "Light" ? "Dark" : "Light"
  applyTheme(theme);
}

function restart() {
  if (confirm(
      "Are you sure you want to restart? \nThis will clear all your progress. "
    )) {
    localStorage.clear();
    location.reload();
  }
}