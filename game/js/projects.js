// Yoy!
var activeProjects = [];

function projectBaseEffect(project) {
	project.flag = true;
	project.element.parentNode.removeChild(project.element);
	var index = activeProjects.indexOf(project);
	activeProjects.splice(index, 1);

	funds -= project.dollarCost ? project.dollarCost : 0;
	wishes -= project.wishCost ? project.wishCost : 0;
	highSchoolers -= project.highSchoolerCost ? project.highSchoolerCost : 0;
}

function projectPriceTag(project) {
	var costs = [];
	if (project.dollarCost) {
		costs.push("$" + project.dollarCost.toLocaleString());
	}
	if (project.wishCost) {
		costs.push(project.wishCost + " wish" + (project.wishCost > 1 ? "es" : ""));
	}
	if (project.highSchoolerCost) {
		costs.push(project.highSchoolerCost + " high schooler" + (project.highSchoolerCost > 1 ? "s" : ""));
	}
	return "(" + costs.join(", ") + ")";
}

function canAffordProject(project) {
	return (
		(project.dollarCost ? funds >= project.dollarCost : true) &&
		(project.wishCost ? wishes >= project.wishCost : true) &&
		(project.highSchoolerCost ? highSchoolers >= project.highSchoolerCost : true)
	)
}
var projects = {
	fasterHighSchoolers: {
		title: "Faster High Schoolers",
		description: "High Schoolers work 25% faster.",
		dollarCost: 10,
		trigger: function () {
			return funds >= 5 && highSchoolers > 0;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			highSchoolerBoost *= 1.25;
			displayMessage("High schoolers now work 25% as fast.");
		}
	},
	bankAccount: {
		title: "Bank Account",
		dollarCost: 10,
		description: "Be able to borrow money!",
		trigger: function () {
			return funds >= 5 && projects.learnToFoldCranes.flag;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			unhide("bankDiv");
			displayMessage("Bank account opened. You can now borrow money $20 at a time.");
		}
	},
	evenFasterHighSchoolers: {
		title: "Even Faster High Schoolers",
		dollarCost: 20,
		description: "Double interest rate, and high schoolers are 50% faster.",
		purchaseMessage: "Speedy high schoolers!",
		trigger: function () {
			return funds >= 10 && projects.fasterHighSchoolers.flag;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			highSchoolerBoost *= 2;
			interestRate *= 2;
		}
	},
	highlySkilledStudents: {
		title: "Highly Skilled Students",
		dollarCost: 40,
		description: "Double hire price, high schoolers work twice as fast.",
		trigger: function () {
			return funds >= 20 && projects.evenFasterHighSchoolers.flag;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			highSchoolerBoost *= 2;
			minWage *= 2;
			displayMessage("When they work harder, you gotta pay them more.");
		}
	},
	professionals: {
		title: "Professionals",
		wishCost: 10,
		description: "Use 10 wishes to start hiring Professionals, the best folders.",
		trigger: function () {
			return highSchoolers >= 100;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			professionalUnlocked = true;
			domElements["professionalDiv"].hidden = false;
			displayMessage("100x more powerful than a high schooler.");
		}
	},
	paperEffciency: {
		title: "Paper Efficiency",
		dollarCost: 200,
		description: "Gain 50% more paper from each purchase.",
		trigger: function () {
			return cranes >= 5000;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			paperAmount = Math.round(paperAmount * 1.5);
			basePaperPrice = Math.round(basePaperPrice * 1.5);
		}
	},
	paperBuyer: {
		title: "Paper Buyer",
		highSchoolerCost: 100,
		description: "Auto-purchase paper when it runs out.",
		trigger: function () {
			return cranes >= 10000;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			domElements["paperBuyerDiv"].hidden = false;
		}
	},
	thinnerSheets: {
		title: "Thinner Sheets",
		dollarCost: 400,
		description: "Gain 75% more paper from each purchase.",
		trigger: function () {
			return projects.paperEffciency.flag;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			paperAmount = Math.round(paperAmount * 1.75);
			basePaperPrice = Math.round(basePaperPrice * 1.5);
		}
	},
	bigPaper: {
		title: "Big Paper",
		dollarCost: 800,
		description: "1000% more paper from each purchase.",
		trigger: function () {
			return projects.thinnerSheets.flag;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			paperAmount = Math.round(paperAmount * 10);
			basePaperPrice = Math.round(basePaperPrice * 1.5);
		}
	},
	lowerWages: {
		title: "Lower Wages",
		dollarCost: 10000000,
		description: "Lobby the lawmakers to reduce minimum wage.",
		trigger: function () {
			return highSchoolers > 250;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			minWage = 0;
		}
	},
	learnToFoldCranes: {
		title: "Learn to Fold Cranes",
		dollarCost: 1,
		description: "Learn how to fold origami cranes",
		trigger: function () {
			return true;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			displayMessage('Buy some paper using the "Paper" button, then click "Fold Crane" to start making cranes.');
			unhide("buisnessColumn");
			unhide("foldingColumn");
		}
	}
}

for (var projectName in projects) {
	var project = projects[projectName];
	project.id = camelCase(project.title + " project");
	projects[project.id] = project;
}