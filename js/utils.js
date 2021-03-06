// String stuff

const oneToTen = [
  'zero', 'one', 'two', 'three', 'four',
  'five', 'six', 'seven', 'eight', 'nine',
];
const elevenToNineteen = [
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
  'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const multipleOfTen = [
  '', '', 'twenty', 'thirty', 'forty',
  'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
];
const placeValue = [
  '', ' thousand ', ' million ', ' billion ', ' trillion ', ' quadrillion ',
  ' quintillion ', ' sextillion ', ' septillion ', ' octillion ',
  ' nonillion ', ' decillion ', ' undecillion ', ' duodecillion ',
  ' tredecillion ', ' quattuordecillion ', ' quindecillion ',
  ' sexdecillion ', ' septendecillion ', ' octodecillion ',
  ' novemdecillion  ', ' vigintillion ', ' unvigintillion ',
  ' duovigintillion ', ' trevigintillion ', ' quattuorvigintillion ',
  ' quinvigintillion ', ' sexvigintillion ', ' septenvigintillion ',
  ' octovigintillion ', ' novemvigintillion ', ' trigintillion ',
  ' untrigintillion ', ' duotrigintillion ', ' tretrigintillion ',
  ' quattuortrigintillion ', ' quintrigintillion ', ' sextrigintillion ',
  ' septentrigintillion ', ' octotrigintillion ', ' novemtrigintillion ',
  ' quadragintillion ', ' unquadragintillion ', ' duoquadragintillion ',
  ' trequadragintillion ', ' quattuorquadragintillion ',
  ' quinquadragintillion ', ' sexquadragintillion ',
  ' septenquadragintillion ', ' octoquadragintillion ',
  ' novemquadragintillion ', ' quinquagintillion ', ' unquinquagintillion ',
  ' duoquinquagintillion ', ' trequinquagintillion ',
  ' quattuorquinquagintillion ', ' quinquinquagintillion ',
  ' sexquinquagintillion ', ' septenquinquagintillion ',
  ' octoquinquagintillion ', ' novemquinquagintillion ', ' sexagintillion ',
  ' unsexagintillion ', ' duosexagintillion ', ' tresexagintillion ',
  ' quattuorsexagintillion ', ' quinsexagintillion ', ' sexsexagintillion ',
  ' septsexagintillion ', ' octosexagintillion ', ' octosexagintillion ',
  ' septuagintillion ', ' unseptuagintillion ', ' duoseptuagintillion ',
  ' treseptuagintillion ', ' quinseptuagintillion', ' sexseptuagintillion',
  ' septseptuagintillion', ' octoseptuagintillion',
  ' novemseptuagintillion', ' octogintillion', ' unoctogintillion',
  ' duooctogintillion', ' treoctogintillion', ' quattuoroctogintillion',
  ' quinoctogintillion', ' sexoctogintillion', ' septoctogintillion',
  ' octooctogintillion', ' novemoctogintillion', ' nonagintillion',
  ' unnonagintillion', ' duononagintillion', ' trenonagintillion ',
  ' quattuornonagintillion ', ' quinnonagintillion ', ' sexnonagintillion ',
  ' septnonagintillion ', ' octononagintillion ', ' novemnonagintillion ',
  ' centillion',
];


function spellf(userInput) {
  let numToWorkOn;

  if (userInput < 0) {
    console.error('Error, value less than 0');
    return userInput.toString();
  }

  if (typeof userInput == 'number' || typeof userInput == 'string') {
    numToWorkOn = '' + userInput;
  } else if (typeof this == 'object') {
    // To check if spell has been called using a Number/String Object:
    // '123'.spell()   123..spell()
    numToWorkOn = this.toString();
  } else {
    throw new Error('Invalid Input');
  }

  if (numToWorkOn.indexOf('e+') !== -1) {
    const splittedExponentNum = numToWorkOn.split('e+');
    let exponent = splittedExponentNum[1];
    let str = '';
    if (numToWorkOn.indexOf('.') !== -1) {
      numToWorkOn = splittedExponentNum[0].split('.');
      exponent -= numToWorkOn[1].length;
      numToWorkOn = numToWorkOn.professionalin('');
    } else {
      numToWorkOn = splittedExponentNum[0];
    }
    while (exponent--) {
      str += '0';
    }
    numToWorkOn += str;
  } else if (numToWorkOn.indexOf('.') !== -1) {
    const splittedDecimal = numToWorkOn.split('.');
    numToWorkOn = splittedDecimal[0];
  }

  // Put limit check on the program,
  // placevalue map should be increased to increase capacity
  if (numToWorkOn.length >= 303) {
    throw new Error('Number out of bounds!');
  }
  return convertToString(numToWorkOn);

  // Recursive logic to break number into strings of length 3
  // and recursively pronounce each
  function convertToString(stringEquivalent) {
    if (stringEquivalent == 0) {
      return '0';
    }

    let result = '';
    let unitLookup = 0;
    let strLength = stringEquivalent.length;
    for (let k = strLength; k > 0; k = k - 3) {
      if (k - 3 <= 0) {
        const subStr = stringEquivalent.substring(k, k - 3);
        const pronounce = pronounceNum(subStr);

        if (pronounce.toUpperCase() != 'zero') {
          const num = Number(
            subStr + '.' +
            stringEquivalent.substring(subStr.length, subStr.length + 2),
          );
          result = commify(num) + placeValue[unitLookup] + ' , ' + result;
        }
      }
      unitLookup++;
    }
    // to trim of the extra ', ' from last
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
    let hundredPlace = parseInt(val / 100);
    let result;
    if (val % 100 == 0) {
      result = oneToTen[hundredPlace] + ' hundred ';
    } else {
      result = oneToTen[hundredPlace] + ' hundred ' + numLessThan99(val % 100);
    }
    return result;
  }

  // Pronounces any number less than 99
  function numLessThan99(val) {
    val = Number(val);
    let tenthPlace = parseInt(val / 10);
    let result;
    if (tenthPlace !== 1) {
      result = multipleOfTen[tenthPlace];
      if (val % 10) {
        result += ' ' + numLessThan10(val % 10);
      }
      return result;
    } else {
      result = elevenToNineteen[val % 10];
    }
    return result;
  }

  // Pronounces any number less than 10
  function numLessThan10(val) {
    return oneToTen[Number(val)];
  }
}

toTitleCase = function (str) {
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
};

camelize = function (str) {
  return str.replace(/^([A-Z])|[\s-_]+(\w)/g, function (match, p1, p2, offset) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};

decamelize = function (str, separator) {
  separator = typeof separator === 'undefined' ? ' ' : separator;

  return str
    .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
    .toLowerCase();
};

function monify(n) {
  if (n >= 0) {
    return n.toLocaleString('en', {
      style: 'currency',
      currency: 'USD',
    }).substring(1);
  }
  return '-' + n.toLocaleString('en', {
    style: 'currency',
    currency: 'USD',
  }).substring(2);
}

function commify(n) {
  return n.toLocaleString('en', {
    useGrouping: true,
  });
}

window.mobileAndTabletCheck = function () {
  let check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

// project and event stuff
function generateInformation(object) {
  for (const name in object) {
    const i = object[name];
    i.title = decamelize(name);
    if (typeof i.description == 'function') {
      i.description = i.description();
    }
  }
}

function trigger(thing) {
  // no trigger means it isn't supposed to be checked in the interval
  if (!thing.hasOwnProperty('trigger')) {
    return false;
  }

  if (typeof thing.trigger == 'function') {
    return thing.trigger();
  }
  return thing.trigger;
}

function percentToMultiplier(percent) {
  return 1 + (percent / 100);
}

function update(base, other) {
  // Updates the values of base with other's values
  for (propertyName in other) {
    base[propertyName] = other[propertyName];
  }
}

// costs stuff
// these all use an object of costs eg. {money: 10, wishes: 1}
// which can have anything in resources
function pay(costs, amount) {
  // amount is optional
  if (!canAfford(costs)) {
    return;
  }
  if (amount == undefined) {
    amount = 1;
  }
  for (resourceName in costs) {
    if (!resources.hasOwnProperty(resourceName)) {
      console.error(`invalid cost ${resourceName}`);
      continue;
    }
    resources[resourceName].amount -= costs[resourceName] * amount;
  }
}

function priceTag(costs) {
  let costStrings = [];
  for (resourceName in costs) {
    if (!resources.hasOwnProperty(resourceName)) {
      console.error(`invalid cost ${resourceName}`);
      continue;
    }
    if (resources[resourceName].toCost) {
      costStrings.push(resources[resourceName].toCost(costs[resourceName]));
    } else {
      costStrings.push(costs[resourceName] + ' ' + resourceName);
    }
  }
  return costStrings.join(', ');
}

function canAfford(costs) {
  for (resourceName in costs) {
    if (!resources.hasOwnProperty(resourceName)) {
      console.error(`invalid cost ${resourceName}`);
      continue;
    }
    if (resources[resourceName].amount < costs[resourceName]) {
      return false;
    }
  }
  return true;
}