// Yoy!
var projects = [];
var activeProjects = [];

function baseEffect(project) {
	project.flag = 1;
	project.element.parentNode.removeChild(project.element);
	var index = activeProjects.indexOf(project);
	activeProjects.splice(index, 1);
}

function priceTag(project) {
	var costs = []
	if (project.dollarCost) {
		costs.push("$" + project.dollarCost.toLocaleString());
	}
	if (project.wishCost) {
		costs.push(project.wishCost + " wishes");
	}
	if (project.highSchoolerCost) {
		costs.push(project.highSchoolerCost + " high schoolers");
	}
	return "(" + costs.join(", ") + ")";
}

var fasterHighSchoolersProject = {
	id: "fasterHighSchoolersProjectButton",
	title: "Faster High Schoolers",
	description: "High Schoolers work 25% faster.",
	dollarCost: 10,
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

projects.push(fasterHighSchoolersProject);

var bankAccountProject = {
	id: "bankAccountProjectButton",
	title: "Bank Account",
	dollarCost: 10,
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

projects.push(bankAccountProject);

var evenFasterHighSchoolersProject = {
	id: "evenFasterHighSchoolersProjectButton",
	title: "Even Faster High Schoolers",
	dollarCost: 20,
	description: "Double interest rate, and high schoolers are 50% faster.",
	purchaseMessage: "Speedy high schoolers!",
	trigger: function () {
		return funds >= 10 && fasterHighSchoolersProject.flag;
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

projects.push(evenFasterHighSchoolersProject);

var highlySkilledStudentsProject = {
	id: "highlySkilledStudentsProjectButton",
	title: "Highly Skilled Students",
	dollarCost: 40,
	description: "Double hire price, high schoolers work twice as fast.",
	trigger: function () {
		return funds >= 20 && evenFasterHighSchoolersProject.flag;
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

projects.push(highlySkilledStudentsProject);

var hireProfessionalsProject = {
	id: "hireProfessionalsProjectButton",
	title: "Professionals",
	wishCost: 10,
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

projects.push(hireProfessionalsProject);

var paperEffciencyProject = {
	id: "paperEffciencyProjectButton",
	title: "Paper Efficiency",
	dollarCost: 200,
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

projects.push(paperEffciencyProject);

var paperBuyerProject = {
	id: "paperBuyerProjectButton",
	title: "Paper Buyer",
	highSchoolerCost: 100,
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

projects.push(paperBuyerProject);

var thinnerSheetsProject = {
	id: "paperBuyerProjectButton",
	title: "Thinner Sheets",
	dollarCost: 400,
	description: "Gain 75% more paper from each purchase.",
	trigger: function () {
		return paperEffciencyProject.flag == 1;
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

projects.push(paperBuyerProject);

var bigPaperProject = {
	id: "bigPaperProjectButton",
	title: "Big Paper",
	dollarCost: 800,
	description: "1000% more paper from each purchase.",
	trigger: function () {
		return thinnerSheetsProject.flag == 1;
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

projects.push(bigPaperProject);

var lowerWagesProject = {
	id: "lowerWagesProjectButton",
	title: "Lower Wages",
	dollarCost: 10000000,
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

projects.push(lowerWagesProject);