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

function closeEvent() {
  if (pendingEvents.length == 0) {
    domElements["eventDescription"].innerHTML = "";
    domElements["eventDiv"].style.display = "none";
  } else {
    displayNextEvent()
  }
}

function changeTheme() {
  theme = theme == "Light" ? "Dark" : "Light"
  applyTheme();
}

function restart() {
  if (confirm(
      "Are you sure you want to restart? \nThis will clear all your progress. "
    )) {
    localStorage.clear();
    location.reload();
  }
}