// Yoy!
var projects = [];
var activeProjects = [];

function baseEffect(project) {
	project.flag = 1;
	project.element.parentNode.removeChild(project.element);
	var index = activeProjects.indexOf(project);
	activeProjects.splice(index, 1);
}

var project1 = {
	id: "projectButton1",
	title: "Faster High Schoolers",
	description: "High Schoolers work 25% faster.",
	dollarCost: 10,
	priceTag: function () {
		return "$" + this.dollarCost;
	},
	trigger: function () {
		return funds >= 5 && highSchoolers > 0;
	},
	uses: 1,
	canAfford: function () {
		return funds >= this.dollarCost;
	},
	flag: 0,
	element: null,
	effect: function () {
    funds -= this.dollarCost;
		highSchoolerBoost *= 1.25;
    displayMessage("High schoolers now work 25% as fast.");
	}
}

projects.push(project1);

var project2 = {
	id: "projectButton2",
	title: "Bank Account",
	dollarCost: 10,
	priceTag: function () {
		return "$" + this.dollarCost;
	},
	description: "Be able to borrow money!",
	trigger: function () {
		return funds >= 5;
	},
	uses: 1,
	canAfford: function () {
		return funds >= this.dollarCost;
	},
	flag: 0,
	element: null,
	effect: function () {
    funds -= this.dollarCost;
		bankDivEl.style.opacity = 0.0;
		bankDivEl.hidden = false;
		fade(bankDivEl, 1.0);
    displayMessage("Bank account opened. You can now borrow money $20 at a time.");
	}
}

projects.push(project2);

var project3 = {
	id: "projectButton3",
	title: "Even Faster High Schoolers",
	dollarCost: 20,
	priceTag: function () {
		return "$" + this.dollarCost;
	},
	description: "Double interest rate, and high schoolers are 50% faster.",
	purchaseMessage: "Speedy high schoolers!",
	trigger: function () {
		return funds >= 10 && project1.flag;
	},
	uses: 1,
	canAfford: function () {
		return funds >= this.dollarCost;
	},
	flag: 0,
	element: null,
	effect: function () {
    funds -= this.dollarCost;
		highSchoolerBoost *= 2;
		interestRate *= 2;
	}
}

projects.push(project3);

var project4 = {
	id: "projectButton4",
	title: "Highly Skilled Students",
	dollarCost: 40,
	priceTag: function () {
		return "$" + this.dollarCost;
	},
	description: "Double hire price, high schoolers work twice as fast.",
	trigger: function () {
		return funds >= 20 && project3.flag;
	},
	uses: 1,
	canAfford: function () {
		return funds >= this.dollarCost;
	},
	flag: 0,
	element: null,
	effect: function () {
    funds -= this.dollarCost;
		highSchoolerBoost *= 2;
		minWage *= 2;
    displayMessage("When they work harder, you gotta pay them more.");
	}
}

projects.push(project4);

var project5 = {
	id: "projectButton5",
	title: "Professionals",
	wishCost: 10,
	priceTag: function () {
		return this.wishCost + " wishes";
	},
	description: "Use 10 wishes to start hiring Professionals, the best folders.",
	trigger: function () {
		return highSchoolers >= 100;
	},
	uses: 1,
	canAfford: function () {
		return wishes >= this.wishCost;
	},
	flag: 0,
	element: null,
	effect: function () {
		wishes -= this.wishCost;
		professionalUnlocked = true;
		professionalDivEl.hidden = false;
    displayMessage("100x more powerful than a high schooler.");
	}
}

projects.push(project5);

var project6 = {
	id: "projectButton6",
	title: "Paper Efficiency",
	dollarCost: 200,
	priceTag: function () {
		return "$" + this.dollarCost;
	},
	description: "Gain 50% more paper from each purchase.",
	trigger: function () {
		return cranes >= 5000;
	},
	uses: 1,
	canAfford: function () {
		return funds >= this.dollarCost;
	},
	flag: 0,
	element: null,
	effect: function () {
    funds -= this.dollarCost;
		paperAmount = Math.round(paperAmount * 1.5);
		basePaperPrice = Math.round(basePaperPrice * 1.5);
	}
}

projects.push(project6);

var project7 = {
	id: "projectButton7",
	title: "Paper Buyer",
	highSchoolerCost: 100,
	priceTag: function () {
		return this.highSchoolerCost + " high schoolers";
	},
	description: "Auto-purchase paper when it runs out.",
	trigger: function () {
		return cranes >= 10000;
	},
	uses: 1,
	canAfford: function () {
		return highSchoolers >= this.highSchoolerCost;
	},
	flag: 0,
	element: null,
	effect: function () {
		highSchoolers -= this.highSchoolerCost;
		paperBuyerDivEl.hidden = false;
	}
}

projects.push(project7);

var project8 = {
	id: "projectButton8",
	title: "Thinner Sheets",
	dollarCost: 400,
	priceTag: function () {
		return "$" + this.dollarCost;
	},
	description: "Gain 75% more paper from each purchase.",
	trigger: function () {
		return project6.flag == 1;
	},
	uses: 1,
	canAfford: function () {
		return funds >= this.dollarCost;
	},
	flag: 0,
	element: null,
	effect: function () {
    funds -= this.dollarCost;
		paperAmount = Math.round(paperAmount * 1.75);
		basePaperPrice = Math.round(basePaperPrice * 1.5);
	}
}

projects.push(project8);

var project9 = {
	id: "projectButton9",
	title: "Big Paper",
	dollarCost: 800,
	priceTag: function () {
		return "$" + this.dollarCost;
	},
	description: "1000% more paper from each purchase.",
	trigger: function () {
		return project8.flag == 1;
	},
	uses: 1,
	canAfford: function () {
		return funds >= this.dollarCost;
	},
	flag: 0,
	element: null,
	effect: function () {
    funds -= this.dollarCost;
		paperAmount = Math.round(paperAmount * 10);
		basePaperPrice = Math.round(basePaperPrice * 1.5);
	}
}

projects.push(project9);

var project10 = {
	id: "projectButton10",
	title: "Lower Wages",
	dollarCost: 100000000,
	priceTag: function () {
		return "$" + this.dollarCost.toLocaleString();
	},
	description: "Lobby the lawmakers to reduce minimum wage.",
	trigger: function () {
		return highSchoolers > 250;
	},
	uses: 1,
	canAfford: function () {
		return funds >= this.dollarCost;
	},
	flag: 0,
	element: null,
	effect: function () {
    funds -= this.dollarCost;
		minWage = 0;
	}
}

projects.push(project10);