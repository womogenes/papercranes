// Yoy!
var activeProjects = [];

function projectBaseEffect(project) {
	project.flag = true;
	project.element.parentNode.removeChild(project.element);
	var index = activeProjects.indexOf(project);
	activeProjects.splice(index, 1);

	if (project.costs.money) {
		money -= project.costs.money;
	}
	if (project.costs.wishes) {
		wishes -= project.costs.wishes;
	}
	if (project.costs.highSchoolers) {
		highSchoolers -= project.costs.highSchoolers;
	}
}

function projectPriceTag(project) {
	var costs = [];
	if (project.costs.money) {
		costs.push(`\$${project.costs.money.toLocaleString()}`);
	}
	if (project.costs.wishes) {
		costs.push(`${project.costs.wishes} wish${project.costs.wishes != 0 ? "es" : ""}`);
	}
	if (project.highSchoolerCost) {
		costs.push(`${project.costs.highSchoolers} high schooler${project.costs.highSchoolers != 0 ? "s" : ""}`);
	}
	return `(${costs.join(", ")})`;
}

function canAffordProject(project) {
	return (
		(project.costs.money ? money >= project.costs.money : true) &&
		(project.costs.wishes ? wishes >= project.costs.wishes : true) &&
		(project.costs.highSchoolers ? highSchoolers >= project.costs.highSchoolers : true)
	)
}
var projects = {
	learnToFoldCranesProject: {
		title: "learn to fold cranes",
		costs: {
			money: 1
		},
		description: "Learn how to fold origami cranes",
		trigger: function () {
			return true;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			displayMessage('Buy some paper using the "Paper" button, then click "Fold Crane" to start making cranes.');
			this.loadEffect();
		},
		loadEffect: function () {
			unhide("buisnessColumn");
			unhide("foldingColumn");
		}
	},
	bankAccountProject: {
		title: "bank account",
		costs: {
			money: 10
		},
		description: "Be able to borrow money!",
		trigger: function () {
			return money >= 5 && projects.learnToFoldCranesProject.flag;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			displayMessage("Bank account opened. You can now borrow money $20 at a time.");
			this.loadEffect();
		},
		loadEffect: function () {
			unhide("bankDiv");
		}
	},

	// Manufacturing projects
	fasterHighSchoolersProject: {
		fasterPercent: 25,
		title: "faster high schoolers",
		description: function () {
			return `High Schoolers work ${this.fasterPercent}% faster.`;
		},
		costs: {
			money: 10
		},
		trigger: function () {
			return money >= 5 && highSchoolers > 0;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			highSchoolerBoost *= percentToMultiplier(this.fasterPercent);
			displayMessage(`High schoolers now work ${this.fasterPercent}% as fast.`);
		}
	},
	evenFasterHighSchoolersProject: {
		fasterPercent: 50,
		title: "even faster high schoolers",
		costs: {
			money: 20
		},
		description: function () {
			return `Double interest rate, and high schoolers are ${this.fasterPercent}% faster.`;
		},
		purchaseMessage: "Speedy high schoolers!",
		trigger: function () {
			return money >= 10 && projects.fasterHighSchoolersProject.flag;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			highSchoolerBoost *= percentToMultiplier(this.fasterPercent);
			interestRate *= 2;
		}
	},
	highlySkilledStudentsProject: {
		fasterAmount: 2,
		title: "highly skilled students",
		costs: {
			money: 40
		},
		description: function () {
			return `Double hire price, high schoolers work ${this.fasterAmount} times as fast.`;
		},
		trigger: function () {
			return money >= 20 && projects.evenFasterHighSchoolersProject.flag;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			highSchoolerBoost *= fasterAmount;
			highSchoolerWage *= 2;
			displayMessage("When they work harder, you gotta pay them more.");
		}
	},
	professionalsProject: {
		title: "professionals",
		costs: {
			wishes: 10
		},
		description: function () {
			return `Use ${this.costs.wishes} wishes to start hiring Professionals, the best folders.`;
		},
		trigger: function () {
			return highSchoolers >= 100;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			displayMessage("100x more powerful than a high schooler.");
			this.loadEffect();
		},
		loadEffect: function () {
			unhide("professionalDiv");
		}
	},
	lowerWagesProject: {
		title: "lower wages",
		costs: {
			money: 10000000
		},
		description: "Lobby the lawmakers to reduce minimum wage.",
		trigger: function () {
			return highSchoolers > 250;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			highSchoolerWage = 0;
		}
	},

	// Paper projects
	paperBuyerProject: {
		title: "paper buyer",
		costs: {
			highSchoolers: 100
		},
		description: "Auto-purchase paper when it runs out.",
		trigger: function () {
			return cranes >= 10000;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			this.loadEffect();
		},
		loadEffect: function () {
			unhide("paperBuyerDiv");
		}
	},
	paperEfficiencyProject: {
		increasePercent: 50,
		title: "paper efficiency",
		costs: {
			money: 200
		},
		description: function () {
			return `Gain ${this.increasePercent}% more paper from each purchase.`;
		},
		trigger: function () {
			return cranes >= 5000;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			paperAmount = Math.round(paperAmount * percentToMultiplier(this.increasePercent));
			basePaperPrice = Math.round(basePaperPrice * percentToMultiplier(this.increasePercent));
		}
	},
	thinnerSheetsProject: {
		increasePercent: 75,
		title: "thinner sheets",
		costs: {
			money: 400
		},
		description: function () {
			return `Gain ${this.increasePercent}% more paper from each purchase.`;
		},
		trigger: function () {
			return projects.paperEfficiencyProject.flag;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			paperAmount = Math.round(paperAmount * percentToMultiplier(this.increasePercent));
			basePaperPrice = Math.round(basePaperPrice * 1.5);
		}
	},
	bigPaperProject: {
		increasePercent: 1000,
		title: "big paper",
		costs: {
			money: 800
		},
		description: function () {
			return `${this.increasePercent}% more paper from each purchase.`;
		},
		trigger: function () {
			return projects.thinnerSheetsProject.flag;
		},
		uses: 1,
		flag: false,
		element: null,
		effect: function () {
			paperAmount = Math.round(paperAmount * percentToMultiplier(this.increasePercent));
			basePaperPrice = Math.round(basePaperPrice * 1.5);
		}
	},
}

generateIds("project", projects);