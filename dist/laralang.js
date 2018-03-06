(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.laralang = {})));
}(this, (function (exports) { 'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var data = {
	dictionnaries: {},
	locale: "en",
	fallback: "en",
	returnKeyIfNotFound: false,
	useDictionnary: true,
	cache: {}
};

function addDictionnaries() {
	var dictionnaries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	Object.keys(dictionnaries).forEach(function (locale) {
		addDictionnary(locale, dictionnaries[locale]);
	});
}

function addDictionnary(locale) {
	var dictionnary = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	data.cache[locale] = {};
	data.dictionnaries[locale] = _extends({}, data.dictionnaries[locale], dictionnary);

	return data.dictionnaries[locale];
}

function getDictionnaries() {
	return data.dictionnaries;
}

function useDictionnary() {
	var use = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	return data.useDictionnary = use;
}

function setLocale() {
	var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : data.locale;

	data.locale = locale;
}

function getLocale() {
	return data.locale;
}

function isLocale(locale) {
	return locale === data.locale;
}

function setFallback() {
	var fallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : data.fallback;

	data.fallback = fallback;
}

function getFallback() {
	return data.fallback;
}

function isFallback(fallback) {
	return fallback === data.fallback;
}

function __(key) {
	var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var locale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : data.locale;

	var text = getText(key, locale);
	if (null !== text) {
		text = replaceParameters(text, params);
	}

	return text;
}

function trans_choice(key, count) {
	var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var locale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : data.locale;

	var text = getText(key, locale);
	if (null !== text) {
		text = selectChoice(text, count, locale);
		text = replaceParameters(text, params);
	}
	return text;
}

function setReturnKeyIfNotFound() {
	var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	data.returnKeyIfNotFound = bool;
	return data.returnKeyIfNotFound;
}

function getText(key) {
	var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : data.locale;

	if (data.useDictionnary === false) {
		return key;
	}

	if (data.cache[locale] && data.cache[locale][key]) {
		return data.cache[locale][key];
	}

	var locales = [locale];
	if (!isFallback(locale)) {
		locales.push(getFallback());
	}

	while (locales.length) {
		var dictionnary = data.dictionnaries[locales.shift()];
		if (undefined !== dictionnary) {
			var keys = key.split(".");
			while (keys.length && dictionnary) {
				dictionnary = dictionnary[keys.shift()];
			}

			if (typeof dictionnary === "string") {
				data.cache[locale][key] = dictionnary;
				return dictionnary;
			}
		}
	}

	var result = data.returnKeyIfNotFound ? key : null;
	data.cache[locale][key] = result;
	return result;
}

function replaceParameters(text) {
	var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var keys = Object.keys(params).sort(function (a, b) {
		return b.length - a.length;
	});
	keys.forEach(function (key) {
		text = text.replace(":" + key, params[key]);
	});

	return text;
}

function selectChoice(text, count) {
	var locale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : data.locale;

	var texts = text.split("|");
	if (texts.length === 1) {
		return texts[0];
	}

	for (var i = 0; i < texts.length; i++) {
		texts[i] = texts[i].trim();
		if (anyIntervalRegexp.test(texts[i])) {
			var temp = texts[i].split(" ");
			var interval = temp.shift();
			texts[i] = temp.join(" ");
			if (testInterval(count, interval)) {
				return texts[i];
			}
		}
	}

	var index = getPluralForm(count, locale);
	return texts[index] || texts[0];
}

/*******************************
 * Interval part
 *
 * Taken and modified from https://github.com/rmariuzzo/Lang.js
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-present Rubens Mariuzzo
 ******************************/
function convertNumber(str) {
	if (str === "-Inf") {
		return -Infinity;
	} else if (str === "+Inf" || str === "Inf" || str === "*") {
		return Infinity;
	}
	return parseInt(str, 10);
}

// Derived from: https://github.com/symfony/translation/blob/460390765eb7bb9338a4a323b8a4e815a47541ba/Interval.php
var intervalRegexp = /^({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])$/;
var anyIntervalRegexp = /({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])/;

/**
 * From the Symfony\Component\Translation\Interval Docs
 *
 * Tests if a given number belongs to a given math interval.
 *
 * An interval can represent a finite set of numbers:
 *
 *  {1,2,3,4}
 *
 * An interval can represent numbers between two numbers:
 *
 *  [1, +Inf]
 *  ]-1,2[
 *
 * The left delimiter can be [ (inclusive) or ] (exclusive).
 * The right delimiter can be [ (exclusive) or ] (inclusive).
 * Beside numbers, you can use -Inf and +Inf for the infinite.
 */
function testInterval(count, interval) {
	if (typeof interval !== "string") {
		throw "Invalid interval: should be a string.";
	}

	interval = interval.trim();

	var matches = interval.match(intervalRegexp);
	if (!matches) {
		throw "Invalid interval: " + interval;
	}

	if (matches[2]) {
		var items = matches[2].split(",");
		for (var i = 0; i < items.length; i++) {
			if (parseInt(items[i], 10) === count) {
				return true;
			}
		}
	} else {
		// Remove falsy values.
		matches = matches.filter(function (match) {
			return !!match;
		});

		var leftDelimiter = matches[1];
		var leftNumber = convertNumber(matches[2]);
		if (leftNumber === Infinity) {
			leftNumber = -Infinity;
		}
		var rightNumber = convertNumber(matches[3]);
		var rightDelimiter = matches[4];

		return (leftDelimiter === "[" ? count >= leftNumber : count > leftNumber) && (rightDelimiter === "]" ? count <= rightNumber : count < rightNumber);
	}

	return false;
}

/*******************************
 * End Interval
 *******************************/

/**
 * Returns the plural position to use for the given locale and number.
 *
 * Taken and modified from https://github.com/rmariuzzo/Lang.js
 *
 * The plural rules are derived from code of the Zend Framework (2010-09-25),
 * which is subject to the new BSD license (http://framework.zend.com/license/new-bsd).
 * Copyright (c) 2005-2010 Zend Technologies USA Inc. (http://www.zend.com)
 *
 * @param {Number} count
 * @param {String} locale
 * @return {Number}
 */
function getPluralForm(count, locale) {
	switch (locale) {
		case "az":
		case "bo":
		case "dz":
		case "id":
		case "ja":
		case "jv":
		case "ka":
		case "km":
		case "kn":
		case "ko":
		case "ms":
		case "th":
		case "tr":
		case "vi":
		case "zh":
			return 0;

		case "af":
		case "bn":
		case "bg":
		case "ca":
		case "da":
		case "de":
		case "el":
		case "en":
		case "eo":
		case "es":
		case "et":
		case "eu":
		case "fa":
		case "fi":
		case "fo":
		case "fur":
		case "fy":
		case "gl":
		case "gu":
		case "ha":
		case "he":
		case "hu":
		case "is":
		case "it":
		case "ku":
		case "lb":
		case "ml":
		case "mn":
		case "mr":
		case "nah":
		case "nb":
		case "ne":
		case "nl":
		case "nn":
		case "no":
		case "om":
		case "or":
		case "pa":
		case "pap":
		case "ps":
		case "pt":
		case "so":
		case "sq":
		case "sv":
		case "sw":
		case "ta":
		case "te":
		case "tk":
		case "ur":
		case "zu":
			return count == 1 ? 0 : 1;

		case "am":
		case "bh":
		case "fil":
		case "fr":
		case "gun":
		case "hi":
		case "hy":
		case "ln":
		case "mg":
		case "nso":
		case "xbr":
		case "ti":
		case "wa":
			return count === 0 || count === 1 ? 0 : 1;

		case "be":
		case "bs":
		case "hr":
		case "ru":
		case "sr":
		case "uk":
			return count % 10 == 1 && count % 100 != 11 ? 0 : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? 1 : 2;

		case "cs":
		case "sk":
			return count == 1 ? 0 : count >= 2 && count <= 4 ? 1 : 2;

		case "ga":
			return count == 1 ? 0 : count == 2 ? 1 : 2;

		case "lt":
			return count % 10 == 1 && count % 100 != 11 ? 0 : count % 10 >= 2 && (count % 100 < 10 || count % 100 >= 20) ? 1 : 2;

		case "sl":
			return count % 100 == 1 ? 0 : count % 100 == 2 ? 1 : count % 100 == 3 || count % 100 == 4 ? 2 : 3;

		case "mk":
			return count % 10 == 1 ? 0 : 1;

		case "mt":
			return count == 1 ? 0 : count === 0 || count % 100 > 1 && count % 100 < 11 ? 1 : count % 100 > 10 && count % 100 < 20 ? 2 : 3;

		case "lv":
			return count === 0 ? 0 : count % 10 == 1 && count % 100 != 11 ? 1 : 2;

		case "pl":
			return count == 1 ? 0 : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 1 : 2;

		case "cy":
			return count == 1 ? 0 : count == 2 ? 1 : count == 8 || count == 11 ? 2 : 3;

		case "ro":
			return count == 1 ? 0 : count === 0 || count % 100 > 0 && count % 100 < 20 ? 1 : 2;

		case "ar":
			return count === 0 ? 0 : count == 1 ? 1 : count == 2 ? 2 : count % 100 >= 3 && count % 100 <= 10 ? 3 : count % 100 >= 11 && count % 100 <= 99 ? 4 : 5;

		default:
			return count === 1 ? 0 : 1;
	}
}

var index = {
	addDictionnaries: addDictionnaries,
	getDictionnaries: getDictionnaries,
	addDictionnary: addDictionnary,
	useDictionnary: useDictionnary,
	setLocale: setLocale,
	getLocale: getLocale,
	isLocale: isLocale,
	setFallback: setFallback,
	getFallback: getFallback,
	isFallback: isFallback,
	setReturnKeyIfNotFound: setReturnKeyIfNotFound,
	__: __,
	trans_choice: trans_choice,
	t: __,
	tc: trans_choice
};

exports.addDictionnaries = addDictionnaries;
exports.addDictionnary = addDictionnary;
exports.getDictionnaries = getDictionnaries;
exports.useDictionnary = useDictionnary;
exports.setLocale = setLocale;
exports.getLocale = getLocale;
exports.isLocale = isLocale;
exports.setFallback = setFallback;
exports.getFallback = getFallback;
exports.isFallback = isFallback;
exports.__ = __;
exports.trans_choice = trans_choice;
exports.setReturnKeyIfNotFound = setReturnKeyIfNotFound;
exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
