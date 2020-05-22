// Yoy!
var projects = [];
var activeProjects = [];

function baseEffect(project) {
	project.flag = 1;
	if (project.purchaseMessage.length > 0) {
		displayMessage(project.purchaseMessage);
	}
	project.element.parentNode.removeChild(project.element);
	var index = activeProjects.indexOf(project);
	activeProjects.splice(index, 1);
}

var project1 = {
	id: "projectButton1",
	title: "Faster High Schoolers",
	priceTag: "$10",
	description: "High Schoolers work 25% faster.",
	purchaseMessage: "High schoolers now work 25% as fast.",
	trigger: function () {
		return funds >= 5 && highSchoolers > 0;
	},
	uses: 1,
	cost: function () {
		return funds >= 10;
	},
	flag: 0,
	element: null,
	effect: function () {
		highSchoolerBoost *= 1.25;
		funds -= 10;
	}
}

projects.push(project1);

var project2 = {
	id: "projectButton2",
	title: "Bank Account",
	priceTag: "$10",
	description: "Be able to borrow money!",
	purchaseMessage: "Bank account opened. You can now borrow money $20 at a time.",
	trigger: function () {
		return funds >= 5;
	},
	uses: 1,
	cost: function () {
		return funds >= 10;
	},
	flag: 0,
	element: null,
	effect: function () {
		funds -= 10;
		bankUnlocked = true;
		bankDivEl.style.opacity = 0.0;
		bankDivEl.hidden = false;
		fade(bankDivEl, 1.0);
	}
}

projects.push(project2);

var project3 = {
	id: "projectButton3",
	title: "Even Faster High Schoolers",
	priceTag: "$20",
	description: "Double interest rate, and high schoolers are 50% faster.",
	purchaseMessage: "Speedy high schoolers!",
	trigger: function () {
		return funds >= 10 && project1.flag;
	},
	uses: 1,
	cost: function () {
		return funds >= 20;
	},
	flag: 0,
	element: null,
	effect: function () {
		highSchoolerBoost *= 2;
		interestRate *= 2;
		funds -= 20;
	}
}

projects.push(project3);

var project4 = {
	id: "projectButton4",
	title: "Highly Skilled Students",
	priceTag: "$40",
	description: "Double hire price, high schoolers work twice as fast.",
	purchaseMessage: "When they work harder, you gotta pay them more.",
	trigger: function () {
		return funds >= 20 && project3.flag;
	},
	uses: 1,
	cost: function () {
		return funds >= 40;
	},
	flag: 0,
	element: null,
	effect: function () {
		highSchoolerBoost *= 2;
		minWage *= 2;
		funds -= 40;
	}
}

projects.push(project4);

var project5 = {
	id: "projectButton5",
	title: "Professionals",
	priceTag: "10 wishes",
	description: "Use 10 wishes to start hiring Professionals, the best folders.",
	purchaseMessage: "100x more powerful than a high schooler.",
	trigger: function () {
		return highSchoolers >= 100;
	},
	uses: 1,
	cost: function () {
		return wishes >= 10;
	},
	flag: 0,
	element: null,
	effect: function () {
		wishes -= 10;
		professionalUnlocked = true;
		professionalDivEl.hidden = false;
	}
}

projects.push(project5);

var project6 = {
	id: "projectButton6",
	title: "Paper Efficiency",
	priceTag: "$200",
	description: "Gain 50% more paper from each purchase.",
	purchaseMessage: "",
	trigger: function () {
		return cranes >= 5000;
	},
	uses: 1,
	cost: function () {
		return funds >= 200;
	},
	flag: 0,
	element: null,
	effect: function () {
		funds -= 200;
		paperAmount = Math.round(paperAmount * 1.5);
		basePaperPrice = Math.round(basePaperPrice * 1.5);
	}
}

projects.push(project6);

var project7 = {
	id: "projectButton7",
	title: "Paper Buyer",
	priceTag: "100 high schoolers",
	description: "Auto-purchase paper when it runs out.",
	purchaseMessage: "",
	trigger: function () {
		return cranes >= 10000;
	},
	uses: 1,
	cost: function () {
		return highSchoolers >= 100;
	},
	flag: 0,
	element: null,
	effect: function () {
		highSchoolers -= 100;
		paperBuyerUnlocked = true;
		paperBuyerDivEl.hidden = false;
	}
}

projects.push(project7);

var project8 = {
	id: "projectButton8",
	title: "Thinner Sheets",
	priceTag: "$400",
	description: "Gain 75% more paper from each purchase.",
	purchaseMessage: "",
	trigger: function () {
		return project6.flag == 1;
	},
	uses: 1,
	cost: function () {
		return funds >= 400;
	},
	flag: 0,
	element: null,
	effect: function () {
		funds -= 400;
		paperAmount = Math.round(paperAmount * 1.75);
		basePaperPrice = Math.round(basePaperPrice * 1.5);
	}
}

projects.push(project8);

var project9 = {
	id: "projectButton9",
	title: "Big Paper",
	priceTag: "$800",
	description: "1000% more paper from each purchase.",
	purchaseMessage: "",
	trigger: function () {
		return project8.flag == 1;
	},
	uses: 1,
	cost: function () {
		return funds >= 800;
	},
	flag: 0,
	element: null,
	effect: function () {
		funds -= 800;
		paperAmount = Math.round(paperAmount * 10);
		basePaperPrice = Math.round(basePaperPrice * 1.5);
	}
}

projects.push(project9);

var project10 = {
	id: "projectButton10",
	title: "Lower Wages",
	priceTag: "$10,000,000",
	description: "Lobby the lawmakers to reduce minimum wage.",
	purchaseMessage: "",
	trigger: function () {
		return highSchoolers > 250;
	},
	uses: 1,
	cost: function () {
		return funds >= 10000000;
	},
	flag: 0,
	element: null,
	effect: function () {
		minWage = 0;
	}
}

projects.push(project10);