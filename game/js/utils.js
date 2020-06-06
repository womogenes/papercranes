//String stuff
{
  var oneToTen = [
      "zero", "one", "two", "three", "four",
      "five", "six", "seven", "eight", "nine",
    ],
    elevenToNineteen = [
      "ten", "eleven", "twelve", "thirteen", "fourteen",
      "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
    ],
    multipleOfTen = [
      "", "", "twenty", "thirty", "forty",
      "fifty", "sixty", "seventy", "eighty", "ninety",
    ],
    placeValue = [
      "", " thousand ", " million ", " billion ", " trillion ", " quadrillion ",
      " quintillion ", " sextillion ", " septillion ", " octillion ",
      " nonillion ", " decillion ", " undecillion ", " duodecillion ",
      " tredecillion ", " quattuordecillion ", " quindecillion ",
      " sexdecillion ", " septendecillion ", " octodecillion ",
      " novemdecillion  ", " vigintillion ", " unvigintillion ",
      " duovigintillion ", " trevigintillion ", " quattuorvigintillion ",
      " quinvigintillion ", " sexvigintillion ", " septenvigintillion ",
      " octovigintillion ", " novemvigintillion ", " trigintillion ",
      " untrigintillion ", " duotrigintillion ", " tretrigintillion ",
      " quattuortrigintillion ", " quintrigintillion ", " sextrigintillion ",
      " septentrigintillion ", " octotrigintillion ", " novemtrigintillion ",
      " quadragintillion ", " unquadragintillion ", " duoquadragintillion ",
      " trequadragintillion ", " quattuorquadragintillion ",
      " quinquadragintillion ", " sexquadragintillion ",
      " septenquadragintillion ", " octoquadragintillion ",
      " novemquadragintillion ", " quinquagintillion ", " unquinquagintillion ",
      " duoquinquagintillion ", " trequinquagintillion ",
      " quattuorquinquagintillion ", " quinquinquagintillion ",
      " sexquinquagintillion ", " septenquinquagintillion ",
      " octoquinquagintillion ", " novemquinquagintillion ", " sexagintillion ",
      " unsexagintillion ", " duosexagintillion ", " tresexagintillion ",
      " quattuorsexagintillion ", " quinsexagintillion ", " sexsexagintillion ",
      " septsexagintillion ", " octosexagintillion ", " octosexagintillion ",
      " septuagintillion ", " unseptuagintillion ", " duoseptuagintillion ",
      " treseptuagintillion ", " quinseptuagintillion", " sexseptuagintillion",
      " septseptuagintillion", " octoseptuagintillion",
      " novemseptuagintillion", " octogintillion", " unoctogintillion",
      " duooctogintillion", " treoctogintillion", " quattuoroctogintillion",
      " quinoctogintillion", " sexoctogintillion", " septoctogintillion",
      " octooctogintillion", " novemoctogintillion", " nonagintillion",
      " unnonagintillion", " duononagintillion", " trenonagintillion ",
      " quattuornonagintillion ", " quinnonagintillion ", " sexnonagintillion ",
      " septnonagintillion ", " octononagintillion ", " novemnonagintillion ",
      " centillion",
    ];
}

function spellf(userInput) {
  var numToWorkOn;

  if (userInput < 0) {
    console.log("Error, value less than 0");
    return userInput.toString();
  }

  if (typeof userInput == "number" || typeof userInput == "string") {
    numToWorkOn = "" + userInput;
  }

  // To check if spell has been called using a Number/String Object:
  // "123".spell()   123..spell()
  else if (typeof this == "object") {
    numToWorkOn = this.toString();
  } else {
    throw new Error("Invalid Input");
  }

  if (numToWorkOn.indexOf("e+") !== -1) {
    var splittedExponentNum = numToWorkOn.split("e+"),
      exponent = splittedExponentNum[1],
      str = "";
    if (numToWorkOn.indexOf(".") !== -1) {
      numToWorkOn = splittedExponentNum[0].split(".");
      exponent -= numToWorkOn[1].length;
      numToWorkOn = numToWorkOn.professionalin("");
    } else {
      numToWorkOn = splittedExponentNum[0];
    }
    while (exponent--) {
      str += "0";
    }
    numToWorkOn += str;
  } else if (numToWorkOn.indexOf(".") !== -1) {
    var splittedDecimal = numToWorkOn.split(".");
    numToWorkOn = splittedDecimal[0];
  }

  // Put limit check on the program, placevalue map should be increased to increase capacity
  if (numToWorkOn.length >= 303) {
    throw new Error("Number out of bonds!");
  }
  return convertToString(numToWorkOn);

  // Recursive logic to break number into strings of length 3
  // and recursively pronounce each
  function convertToString(stringEquivalent) {
    if (stringEquivalent == 0) {
      return "0";
    }

    var result = "",
      unitLookup = 0,
      strLength = stringEquivalent.length;
    for (var k = strLength; k > 0; k = k - 3) {
      if (k - 3 <= 0) {
        var subStr = stringEquivalent.substring(k, k - 3);
        var pronounce = pronounceNum(subStr);

        if (pronounce.toUpperCase() != "zero") {
          var num = Number(
            subStr + "." +
            stringEquivalent.substring(subStr.length, subStr.length + 2)
          );
          result = commify(num, 1) + placeValue[unitLookup] + " , " + result;
        }
      }
      unitLookup++;
    }
    // to trim of the extra ", " from last
    return result.substring(0, result.length - 3);
  }

  // Determines the range of input and calls respective function
  function pronounceNum(val) {
    val = parseInt(val);
    if (parseInt(val / 10) == 0) {
      return numLessThan10(val);
    } else if (parseInt(val / 100) == 0) {
      return numLessThan99(val);
    } else {
      return numLessThan1000(val);
    }
  }

  // Pronounces any number less than 1000
  function numLessThan1000(val) {
    val = Number(val);
    var hundredPlace = parseInt(val / 100),
      result;
    if (val % 100 == 0) {
      result = oneToTen[hundredPlace] + " hundred ";
    } else {
      result = oneToTen[hundredPlace] + " hundred " + numLessThan99(val % 100);
    }
    return result;
  }

  // Pronounces any number less than 99
  function numLessThan99(val) {
    val = Number(val);
    var tenthPlace = parseInt(val / 10),
      result;
    if (tenthPlace !== 1) {
      result = multipleOfTen[tenthPlace]
      if (val % 10) {
        result += " " + numLessThan10(val % 10)
      }
      return result;
    } else {
      result = elevenToNineteen[val % 10];
    }
    return result
  }

  // Pronounces any number less than 10
  function numLessThan10(val) {
    return oneToTen[Number(val)];
  }
}

function monify(n) {
  if (n >= 0) {
    return n.toLocaleString("en", {
      style: "currency",
      currency: "USD"
    }).substring(1);
  }
  return "-" + n.toLocaleString("en", {
    style: "currency",
    currency: "USD"
  }).substring(2);
}

function commify(n) {
  return n.toLocaleString("en", {
    useGrouping: true
  });
}

function camelCase(str) { 
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) 
  { 
      return index == 0 ? word.toLowerCase() : word.toUpperCase(); 
  }).replace(/\s+/g, ''); 
}

// Display stuff
function cacheDomElements() {
  Array.from(document.getElementsByTagName("*")).forEach(element => {
    domElements[element.id] = element;
  });

  load();
  applyTheme();
}

function fade(element, targetOpacity) {
  var fadeCounter = -1;

  var handle = window.setInterval(function () {
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
  var el = domElements[id];
  el.style.opacity = 0;
  el.hidden = false;
  fade(el, 1.0);
}

function createRipple(e) {
  var circle = document.createElement("div");
  this.appendChild(circle);

  var d = Math.max(this.clientWidth, this.clientHeight);

  circle.style.width = circle.style.height = d + "px";

  var rect = this.getBoundingClientRect();
  circle.style.left = e.clientX - rect.left - d / 2 + "px";
  circle.style.top = e.clientY - rect.top - d / 2 + "px";

  circle.classList.add("ripple");
  circle.addEventListener("animationend", function (e) {
    this.parentNode.removeChild(this);
  });
}

function displayMessage(msg, dontSave) {
  console.log(msg);
  if (!dontSave) {
    consoleHistory.push(msg);
  }
  var newMsgEl = document.createElement("div");
  newMsgEl.setAttribute("class", "consoleMsg");
  newMsgEl.setAttribute("id", "consoleMsg");
  newMsgEl.innerHTML = msg;
  newMsgEl.style.opacity = 0;
  fade(newMsgEl, 1.0);

  domElements["readoutDiv"].prepend(newMsgEl, domElements["readoutDiv"].firstChild);
}

var themes = {
  "Light": {
    "--bg-color": "#ffffff",
    "--outline-color": "#000000",
    "--text-color": "#000000",
    "--fill-color": "#cccccc",
    "--slider-focus-bg-color": "#e0e0e0",
    "--slider-thumb-color": "#909090",

    "--btn-bg-on": "#eeeeee",
    "--btn-bg-hover": "#f9f9f9",
    "--btn-bg-active": "#cccccc",
    "--btn-outline-hover": "#222222",
    "--btn-outline-active": "#222222",
  },
  "Dark": {
    "--bg-color": "#181818",
    "--outline-color": "#dddddd",
    "--text-color": "#eeeeee",
    "--fill-color": "#555555",
    "--slider-focus-bg-color": "#707070",
    "--slider-thumb-color": "#909090",

    "--btn-bg-on": "#111111",
    "--btn-bg-hover": "#222222",
    "--btn-bg-active": "#1e1e1e",
    "--btn-outline-hover": "#cccccc",
    "--btn-outline-active": "#aaaaaa",
  }
}

function applyTheme() {
  // Sets theme colors.
  for (var i in themes[theme]) {
    document.documentElement.style.setProperty(i, themes[theme][i]);
  }
}