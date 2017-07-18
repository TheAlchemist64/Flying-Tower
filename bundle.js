(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _rot = require('../../vendor/rot');

var _rot2 = _interopRequireDefault(_rot);

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

var _tile = require('./tile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!_rot2.default.isSupported()) {
	alert("The rot.js library isn't supported by your browser.");
} else {
	_game2.default.init();
}

},{"../../vendor/rot":5,"./game":3,"./tile":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Enum = function Enum() {
	var _this = this;

	_classCallCheck(this, Enum);

	var args = Array.prototype.slice.call(arguments);
	var i = 0;
	args.forEach(function (val) {
		_this[val] = i++;
	});
	Object.freeze(this);
};

exports.default = Enum;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _rot = require('../../vendor/rot');

var _rot2 = _interopRequireDefault(_rot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var w = 50;
var h = 25;

exports.default = {
	display: null,
	map: null,

	init: function init() {
		var _this = this;

		this.display = new _rot2.default.Display({ width: w, height: h });
		document.body.appendChild(this.display.getContainer());

		this.map = new _rot2.default.Map.Arena(w, h);
		this.map.create(function (x, y, wall) {
			_this.display.draw(x, y, wall ? '#' : '.');
		});
	}
};

},{"../../vendor/rot":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Tile = exports.TileTypes = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _enum = require('./enum');

var _enum2 = _interopRequireDefault(_enum);

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TileTypes = exports.TileTypes = new _enum2.default('EMPTY', 'FLOOR', 'WALL');

var Tile = exports.Tile = function () {
	function Tile(x, y, chr, fg) {
		_classCallCheck(this, Tile);

		this.x = x;
		this.y = y;
		this.chr = chr;
		this.fg = fg;
	}

	_createClass(Tile, [{
		key: 'draw',
		value: function draw() {
			_game2.default.display.draw(this.x, this.y, this.chr, this.fg || '#fff');
		}
	}]);

	return Tile;
}();

},{"./enum":2,"./game":3}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
	This is rot.js, the ROguelike Toolkit in JavaScript.
	Version 0.7~dev, generated on Thu 24 Nov 2016 08:07:39 MST.
*/
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.ROT = factory();
	}
})(undefined, function () {
	/**
  * @namespace Top-level ROT namespace
  */
	var ROT = {
		/**
   * @returns {bool} Is rot.js supported by this browser?
   */
		isSupported: function isSupported() {
			return !!(document.createElement("canvas").getContext && Function.prototype.bind);
		},

		/** Default with for display and map generators */
		DEFAULT_WIDTH: 80,
		/** Default height for display and map generators */
		DEFAULT_HEIGHT: 25,

		/** Directional constants. Ordering is important! */
		DIRS: {
			"4": [[0, -1], [1, 0], [0, 1], [-1, 0]],
			"8": [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
			"6": [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
		},

		/** Cancel key. */
		VK_CANCEL: 3,
		/** Help key. */
		VK_HELP: 6,
		/** Backspace key. */
		VK_BACK_SPACE: 8,
		/** Tab key. */
		VK_TAB: 9,
		/** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
		VK_CLEAR: 12,
		/** Return/enter key on the main keyboard. */
		VK_RETURN: 13,
		/** Reserved, but not used. */
		VK_ENTER: 14,
		/** Shift key. */
		VK_SHIFT: 16,
		/** Control key. */
		VK_CONTROL: 17,
		/** Alt (Option on Mac) key. */
		VK_ALT: 18,
		/** Pause key. */
		VK_PAUSE: 19,
		/** Caps lock. */
		VK_CAPS_LOCK: 20,
		/** Escape key. */
		VK_ESCAPE: 27,
		/** Space bar. */
		VK_SPACE: 32,
		/** Page Up key. */
		VK_PAGE_UP: 33,
		/** Page Down key. */
		VK_PAGE_DOWN: 34,
		/** End key. */
		VK_END: 35,
		/** Home key. */
		VK_HOME: 36,
		/** Left arrow. */
		VK_LEFT: 37,
		/** Up arrow. */
		VK_UP: 38,
		/** Right arrow. */
		VK_RIGHT: 39,
		/** Down arrow. */
		VK_DOWN: 40,
		/** Print Screen key. */
		VK_PRINTSCREEN: 44,
		/** Ins(ert) key. */
		VK_INSERT: 45,
		/** Del(ete) key. */
		VK_DELETE: 46,
		/***/
		VK_0: 48,
		/***/
		VK_1: 49,
		/***/
		VK_2: 50,
		/***/
		VK_3: 51,
		/***/
		VK_4: 52,
		/***/
		VK_5: 53,
		/***/
		VK_6: 54,
		/***/
		VK_7: 55,
		/***/
		VK_8: 56,
		/***/
		VK_9: 57,
		/** Colon (:) key. Requires Gecko 15.0 */
		VK_COLON: 58,
		/** Semicolon (;) key. */
		VK_SEMICOLON: 59,
		/** Less-than (<) key. Requires Gecko 15.0 */
		VK_LESS_THAN: 60,
		/** Equals (=) key. */
		VK_EQUALS: 61,
		/** Greater-than (>) key. Requires Gecko 15.0 */
		VK_GREATER_THAN: 62,
		/** Question mark (?) key. Requires Gecko 15.0 */
		VK_QUESTION_MARK: 63,
		/** Atmark (@) key. Requires Gecko 15.0 */
		VK_AT: 64,
		/***/
		VK_A: 65,
		/***/
		VK_B: 66,
		/***/
		VK_C: 67,
		/***/
		VK_D: 68,
		/***/
		VK_E: 69,
		/***/
		VK_F: 70,
		/***/
		VK_G: 71,
		/***/
		VK_H: 72,
		/***/
		VK_I: 73,
		/***/
		VK_J: 74,
		/***/
		VK_K: 75,
		/***/
		VK_L: 76,
		/***/
		VK_M: 77,
		/***/
		VK_N: 78,
		/***/
		VK_O: 79,
		/***/
		VK_P: 80,
		/***/
		VK_Q: 81,
		/***/
		VK_R: 82,
		/***/
		VK_S: 83,
		/***/
		VK_T: 84,
		/***/
		VK_U: 85,
		/***/
		VK_V: 86,
		/***/
		VK_W: 87,
		/***/
		VK_X: 88,
		/***/
		VK_Y: 89,
		/***/
		VK_Z: 90,
		/***/
		VK_CONTEXT_MENU: 93,
		/** 0 on the numeric keypad. */
		VK_NUMPAD0: 96,
		/** 1 on the numeric keypad. */
		VK_NUMPAD1: 97,
		/** 2 on the numeric keypad. */
		VK_NUMPAD2: 98,
		/** 3 on the numeric keypad. */
		VK_NUMPAD3: 99,
		/** 4 on the numeric keypad. */
		VK_NUMPAD4: 100,
		/** 5 on the numeric keypad. */
		VK_NUMPAD5: 101,
		/** 6 on the numeric keypad. */
		VK_NUMPAD6: 102,
		/** 7 on the numeric keypad. */
		VK_NUMPAD7: 103,
		/** 8 on the numeric keypad. */
		VK_NUMPAD8: 104,
		/** 9 on the numeric keypad. */
		VK_NUMPAD9: 105,
		/** * on the numeric keypad. */
		VK_MULTIPLY: 106,
		/** + on the numeric keypad. */
		VK_ADD: 107,
		/***/
		VK_SEPARATOR: 108,
		/** - on the numeric keypad. */
		VK_SUBTRACT: 109,
		/** Decimal point on the numeric keypad. */
		VK_DECIMAL: 110,
		/** / on the numeric keypad. */
		VK_DIVIDE: 111,
		/** F1 key. */
		VK_F1: 112,
		/** F2 key. */
		VK_F2: 113,
		/** F3 key. */
		VK_F3: 114,
		/** F4 key. */
		VK_F4: 115,
		/** F5 key. */
		VK_F5: 116,
		/** F6 key. */
		VK_F6: 117,
		/** F7 key. */
		VK_F7: 118,
		/** F8 key. */
		VK_F8: 119,
		/** F9 key. */
		VK_F9: 120,
		/** F10 key. */
		VK_F10: 121,
		/** F11 key. */
		VK_F11: 122,
		/** F12 key. */
		VK_F12: 123,
		/** F13 key. */
		VK_F13: 124,
		/** F14 key. */
		VK_F14: 125,
		/** F15 key. */
		VK_F15: 126,
		/** F16 key. */
		VK_F16: 127,
		/** F17 key. */
		VK_F17: 128,
		/** F18 key. */
		VK_F18: 129,
		/** F19 key. */
		VK_F19: 130,
		/** F20 key. */
		VK_F20: 131,
		/** F21 key. */
		VK_F21: 132,
		/** F22 key. */
		VK_F22: 133,
		/** F23 key. */
		VK_F23: 134,
		/** F24 key. */
		VK_F24: 135,
		/** Num Lock key. */
		VK_NUM_LOCK: 144,
		/** Scroll Lock key. */
		VK_SCROLL_LOCK: 145,
		/** Circumflex (^) key. Requires Gecko 15.0 */
		VK_CIRCUMFLEX: 160,
		/** Exclamation (!) key. Requires Gecko 15.0 */
		VK_EXCLAMATION: 161,
		/** Double quote () key. Requires Gecko 15.0 */
		VK_DOUBLE_QUOTE: 162,
		/** Hash (#) key. Requires Gecko 15.0 */
		VK_HASH: 163,
		/** Dollar sign ($) key. Requires Gecko 15.0 */
		VK_DOLLAR: 164,
		/** Percent (%) key. Requires Gecko 15.0 */
		VK_PERCENT: 165,
		/** Ampersand (&) key. Requires Gecko 15.0 */
		VK_AMPERSAND: 166,
		/** Underscore (_) key. Requires Gecko 15.0 */
		VK_UNDERSCORE: 167,
		/** Open parenthesis (() key. Requires Gecko 15.0 */
		VK_OPEN_PAREN: 168,
		/** Close parenthesis ()) key. Requires Gecko 15.0 */
		VK_CLOSE_PAREN: 169,
		/* Asterisk (*) key. Requires Gecko 15.0 */
		VK_ASTERISK: 170,
		/** Plus (+) key. Requires Gecko 15.0 */
		VK_PLUS: 171,
		/** Pipe (|) key. Requires Gecko 15.0 */
		VK_PIPE: 172,
		/** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
		VK_HYPHEN_MINUS: 173,
		/** Open curly bracket ({) key. Requires Gecko 15.0 */
		VK_OPEN_CURLY_BRACKET: 174,
		/** Close curly bracket (}) key. Requires Gecko 15.0 */
		VK_CLOSE_CURLY_BRACKET: 175,
		/** Tilde (~) key. Requires Gecko 15.0 */
		VK_TILDE: 176,
		/** Comma (,) key. */
		VK_COMMA: 188,
		/** Period (.) key. */
		VK_PERIOD: 190,
		/** Slash (/) key. */
		VK_SLASH: 191,
		/** Back tick (`) key. */
		VK_BACK_QUOTE: 192,
		/** Open square bracket ([) key. */
		VK_OPEN_BRACKET: 219,
		/** Back slash (\) key. */
		VK_BACK_SLASH: 220,
		/** Close square bracket (]) key. */
		VK_CLOSE_BRACKET: 221,
		/** Quote (''') key. */
		VK_QUOTE: 222,
		/** Meta key on Linux, Command key on Mac. */
		VK_META: 224,
		/** AltGr key on Linux. Requires Gecko 15.0 */
		VK_ALTGR: 225,
		/** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
		VK_WIN: 91,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_KANA: 21,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_HANGUL: 21,
		/** 英数 key on Japanese Mac keyboard. Requires Gecko 15.0 */
		VK_EISU: 22,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_JUNJA: 23,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_FINAL: 24,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_HANJA: 25,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_KANJI: 25,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_CONVERT: 28,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_NONCONVERT: 29,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_ACCEPT: 30,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_MODECHANGE: 31,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_SELECT: 41,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_PRINT: 42,
		/** Linux support for this keycode was added in Gecko 4.0. */
		VK_EXECUTE: 43,
		/** Linux support for this keycode was added in Gecko 4.0.	 */
		VK_SLEEP: 95
	};
	/**
  * @namespace
  * Contains text tokenization and breaking routines
  */
	ROT.Text = {
		RE_COLORS: /%([bc]){([^}]*)}/g,

		/* token types */
		TYPE_TEXT: 0,
		TYPE_NEWLINE: 1,
		TYPE_FG: 2,
		TYPE_BG: 3,

		/**
   * Measure size of a resulting text block
   */
		measure: function measure(str, maxWidth) {
			var result = { width: 0, height: 1 };
			var tokens = this.tokenize(str, maxWidth);
			var lineWidth = 0;

			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				switch (token.type) {
					case this.TYPE_TEXT:
						lineWidth += token.value.length;
						break;

					case this.TYPE_NEWLINE:
						result.height++;
						result.width = Math.max(result.width, lineWidth);
						lineWidth = 0;
						break;
				}
			}
			result.width = Math.max(result.width, lineWidth);

			return result;
		},

		/**
   * Convert string to a series of a formatting commands
   */
		tokenize: function tokenize(str, maxWidth) {
			var result = [];

			/* first tokenization pass - split texts and color formatting commands */
			var offset = 0;
			str.replace(this.RE_COLORS, function (match, type, name, index) {
				/* string before */
				var part = str.substring(offset, index);
				if (part.length) {
					result.push({
						type: ROT.Text.TYPE_TEXT,
						value: part
					});
				}

				/* color command */
				result.push({
					type: type == "c" ? ROT.Text.TYPE_FG : ROT.Text.TYPE_BG,
					value: name.trim()
				});

				offset = index + match.length;
				return "";
			});

			/* last remaining part */
			var part = str.substring(offset);
			if (part.length) {
				result.push({
					type: ROT.Text.TYPE_TEXT,
					value: part
				});
			}

			return this._breakLines(result, maxWidth);
		},

		/* insert line breaks into first-pass tokenized data */
		_breakLines: function _breakLines(tokens, maxWidth) {
			if (!maxWidth) {
				maxWidth = Infinity;
			}

			var i = 0;
			var lineLength = 0;
			var lastTokenWithSpace = -1;

			while (i < tokens.length) {
				/* take all text tokens, remove space, apply linebreaks */
				var token = tokens[i];
				if (token.type == ROT.Text.TYPE_NEWLINE) {
					/* reset */
					lineLength = 0;
					lastTokenWithSpace = -1;
				}
				if (token.type != ROT.Text.TYPE_TEXT) {
					/* skip non-text tokens */
					i++;
					continue;
				}

				/* remove spaces at the beginning of line */
				while (lineLength == 0 && token.value.charAt(0) == " ") {
					token.value = token.value.substring(1);
				}

				/* forced newline? insert two new tokens after this one */
				var index = token.value.indexOf("\n");
				if (index != -1) {
					token.value = this._breakInsideToken(tokens, i, index, true);

					/* if there are spaces at the end, we must remove them (we do not want the line too long) */
					var arr = token.value.split("");
					while (arr.length && arr[arr.length - 1] == " ") {
						arr.pop();
					}
					token.value = arr.join("");
				}

				/* token degenerated? */
				if (!token.value.length) {
					tokens.splice(i, 1);
					continue;
				}

				if (lineLength + token.value.length > maxWidth) {
					/* line too long, find a suitable breaking spot */

					/* is it possible to break within this token? */
					var index = -1;
					while (1) {
						var nextIndex = token.value.indexOf(" ", index + 1);
						if (nextIndex == -1) {
							break;
						}
						if (lineLength + nextIndex > maxWidth) {
							break;
						}
						index = nextIndex;
					}

					if (index != -1) {
						/* break at space within this one */
						token.value = this._breakInsideToken(tokens, i, index, true);
					} else if (lastTokenWithSpace != -1) {
						/* is there a previous token where a break can occur? */
						var token = tokens[lastTokenWithSpace];
						var breakIndex = token.value.lastIndexOf(" ");
						token.value = this._breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
						i = lastTokenWithSpace;
					} else {
						/* force break in this token */
						token.value = this._breakInsideToken(tokens, i, maxWidth - lineLength, false);
					}
				} else {
					/* line not long, continue */
					lineLength += token.value.length;
					if (token.value.indexOf(" ") != -1) {
						lastTokenWithSpace = i;
					}
				}

				i++; /* advance to next token */
			}

			tokens.push({ type: ROT.Text.TYPE_NEWLINE }); /* insert fake newline to fix the last text line */

			/* remove trailing space from text tokens before newlines */
			var lastTextToken = null;
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				switch (token.type) {
					case ROT.Text.TYPE_TEXT:
						lastTextToken = token;break;
					case ROT.Text.TYPE_NEWLINE:
						if (lastTextToken) {
							/* remove trailing space */
							var arr = lastTextToken.value.split("");
							while (arr.length && arr[arr.length - 1] == " ") {
								arr.pop();
							}
							lastTextToken.value = arr.join("");
						}
						lastTextToken = null;
						break;
				}
			}

			tokens.pop(); /* remove fake token */

			return tokens;
		},

		/**
   * Create new tokens and insert them into the stream
   * @param {object[]} tokens
   * @param {int} tokenIndex Token being processed
   * @param {int} breakIndex Index within current token's value
   * @param {bool} removeBreakChar Do we want to remove the breaking character?
   * @returns {string} remaining unbroken token value
   */
		_breakInsideToken: function _breakInsideToken(tokens, tokenIndex, breakIndex, removeBreakChar) {
			var newBreakToken = {
				type: ROT.Text.TYPE_NEWLINE
			};
			var newTextToken = {
				type: ROT.Text.TYPE_TEXT,
				value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
			};
			tokens.splice(tokenIndex + 1, 0, newBreakToken, newTextToken);
			return tokens[tokenIndex].value.substring(0, breakIndex);
		}
	};
	/**
  * @returns {any} Randomly picked item, null when length=0
  */
	Array.prototype.random = Array.prototype.random || function () {
		if (!this.length) {
			return null;
		}
		return this[Math.floor(ROT.RNG.getUniform() * this.length)];
	};

	/**
  * @returns {array} New array with randomized items
  */
	Array.prototype.randomize = Array.prototype.randomize || function () {
		var result = [];
		var clone = this.slice();
		while (clone.length) {
			var index = clone.indexOf(clone.random());
			result.push(clone.splice(index, 1)[0]);
		}
		return result;
	};
	/**
  * Always positive modulus
  * @param {int} n Modulus
  * @returns {int} this modulo n
  */
	Number.prototype.mod = Number.prototype.mod || function (n) {
		return (this % n + n) % n;
	};
	/**
  * @returns {string} First letter capitalized
  */
	String.prototype.capitalize = String.prototype.capitalize || function () {
		return this.charAt(0).toUpperCase() + this.substring(1);
	};

	/** 
  * Left pad
  * @param {string} [character="0"]
  * @param {int} [count=2]
  */
	String.prototype.lpad = String.prototype.lpad || function (character, count) {
		var ch = character || "0";
		var cnt = count || 2;

		var s = "";
		while (s.length < cnt - this.length) {
			s += ch;
		}
		s = s.substring(0, cnt - this.length);
		return s + this;
	};

	/** 
  * Right pad
  * @param {string} [character="0"]
  * @param {int} [count=2]
  */
	String.prototype.rpad = String.prototype.rpad || function (character, count) {
		var ch = character || "0";
		var cnt = count || 2;

		var s = "";
		while (s.length < cnt - this.length) {
			s += ch;
		}
		s = s.substring(0, cnt - this.length);
		return this + s;
	};

	/**
  * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
  * @param {string} template
  * @param {any} [argv]
  */
	String.format = String.format || function (template) {
		var map = String.format.map;
		var args = Array.prototype.slice.call(arguments, 1);

		var replacer = function replacer(match, group1, group2, index) {
			if (template.charAt(index - 1) == "%") {
				return match.substring(1);
			}
			if (!args.length) {
				return match;
			}
			var obj = args[0];

			var group = group1 || group2;
			var parts = group.split(",");
			var name = parts.shift();
			var method = map[name.toLowerCase()];
			if (!method) {
				return match;
			}

			var obj = args.shift();
			var replaced = obj[method].apply(obj, parts);

			var first = name.charAt(0);
			if (first != first.toLowerCase()) {
				replaced = replaced.capitalize();
			}

			return replaced;
		};
		return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
	};

	String.format.map = String.format.map || {
		"s": "toString"
	};

	/**
  * Convenience shortcut to String.format(this)
  */
	String.prototype.format = String.prototype.format || function () {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(this);
		return String.format.apply(String, args);
	};

	if (!Object.create) {
		/**
   * ES5 Object.create
   */
		Object.create = function (o) {
			var tmp = function tmp() {};
			tmp.prototype = o;
			return new tmp();
		};
	}
	/**
  * Sets prototype of this function to an instance of parent function
  * @param {function} parent
  */
	Function.prototype.extend = Function.prototype.extend || function (parent) {
		this.prototype = Object.create(parent.prototype);
		this.prototype.constructor = this;
		return this;
	};
	if (typeof window != "undefined") {
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (cb) {
			return setTimeout(cb, 1000 / 60);
		};

		window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function (id) {
			return clearTimeout(id);
		};
	}
	/**
  * @class Visual map display
  * @param {object} [options]
  * @param {int} [options.width=ROT.DEFAULT_WIDTH]
  * @param {int} [options.height=ROT.DEFAULT_HEIGHT]
  * @param {int} [options.fontSize=15]
  * @param {string} [options.fontFamily="monospace"]
  * @param {string} [options.fontStyle=""] bold/italic/none/both
  * @param {string} [options.fg="#ccc"]
  * @param {string} [options.bg="#000"]
  * @param {float} [options.spacing=1]
  * @param {float} [options.border=0]
  * @param {string} [options.layout="rect"]
  * @param {bool} [options.forceSquareRatio=false]
  * @param {int} [options.tileWidth=32]
  * @param {int} [options.tileHeight=32]
  * @param {object} [options.tileMap={}]
  * @param {image} [options.tileSet=null]
  * @param {image} [options.tileColorize=false]
  */
	ROT.Display = function (options) {
		var canvas = document.createElement("canvas");
		this._context = canvas.getContext("2d");
		this._data = {};
		this._dirty = false; /* false = nothing, true = all, object = dirty cells */
		this._options = {};
		this._backend = null;

		var defaultOptions = {
			width: ROT.DEFAULT_WIDTH,
			height: ROT.DEFAULT_HEIGHT,
			transpose: false,
			layout: "rect",
			fontSize: 15,
			spacing: 1,
			border: 0,
			forceSquareRatio: false,
			fontFamily: "monospace",
			fontStyle: "",
			fg: "#ccc",
			bg: "#000",
			tileWidth: 32,
			tileHeight: 32,
			tileMap: {},
			tileSet: null,
			tileColorize: false,
			termColor: "xterm"
		};
		for (var p in options) {
			defaultOptions[p] = options[p];
		}
		this.setOptions(defaultOptions);
		this.DEBUG = this.DEBUG.bind(this);

		this._tick = this._tick.bind(this);
		requestAnimationFrame(this._tick);
	};

	/**
  * Debug helper, ideal as a map generator callback. Always bound to this.
  * @param {int} x
  * @param {int} y
  * @param {int} what
  */
	ROT.Display.prototype.DEBUG = function (x, y, what) {
		var colors = [this._options.bg, this._options.fg];
		this.draw(x, y, null, null, colors[what % colors.length]);
	};

	/**
  * Clear the whole display (cover it with background color)
  */
	ROT.Display.prototype.clear = function () {
		this._data = {};
		this._dirty = true;
	};

	/**
  * @see ROT.Display
  */
	ROT.Display.prototype.setOptions = function (options) {
		for (var p in options) {
			this._options[p] = options[p];
		}
		if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
			if (options.layout) {
				this._backend = new ROT.Display[options.layout.capitalize()](this._context);
			}

			var font = (this._options.fontStyle ? this._options.fontStyle + " " : "") + this._options.fontSize + "px " + this._options.fontFamily;
			this._context.font = font;
			this._backend.compute(this._options);
			this._context.font = font;
			this._context.textAlign = "center";
			this._context.textBaseline = "middle";
			this._dirty = true;
		}
		return this;
	};

	/**
  * Returns currently set options
  * @returns {object} Current options object 
  */
	ROT.Display.prototype.getOptions = function () {
		return this._options;
	};

	/**
  * Returns the DOM node of this display
  * @returns {node} DOM node
  */
	ROT.Display.prototype.getContainer = function () {
		return this._context.canvas;
	};

	/**
  * Compute the maximum width/height to fit into a set of given constraints
  * @param {int} availWidth Maximum allowed pixel width
  * @param {int} availHeight Maximum allowed pixel height
  * @returns {int[2]} cellWidth,cellHeight
  */
	ROT.Display.prototype.computeSize = function (availWidth, availHeight) {
		return this._backend.computeSize(availWidth, availHeight, this._options);
	};

	/**
  * Compute the maximum font size to fit into a set of given constraints
  * @param {int} availWidth Maximum allowed pixel width
  * @param {int} availHeight Maximum allowed pixel height
  * @returns {int} fontSize
  */
	ROT.Display.prototype.computeFontSize = function (availWidth, availHeight) {
		return this._backend.computeFontSize(availWidth, availHeight, this._options);
	};

	/**
  * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
  * @param {Event} e event
  * @returns {int[2]} -1 for values outside of the canvas
  */
	ROT.Display.prototype.eventToPosition = function (e) {
		if (e.touches) {
			var x = e.touches[0].clientX;
			var y = e.touches[0].clientY;
		} else {
			var x = e.clientX;
			var y = e.clientY;
		}

		var rect = this._context.canvas.getBoundingClientRect();
		x -= rect.left;
		y -= rect.top;

		x *= this._context.canvas.width / this._context.canvas.clientWidth;
		y *= this._context.canvas.height / this._context.canvas.clientHeight;

		if (x < 0 || y < 0 || x >= this._context.canvas.width || y >= this._context.canvas.height) {
			return [-1, -1];
		}

		return this._backend.eventToPosition(x, y);
	};

	/**
  * @param {int} x
  * @param {int} y
  * @param {string || string[]} ch One or more chars (will be overlapping themselves)
  * @param {string} [fg] foreground color
  * @param {string} [bg] background color
  */
	ROT.Display.prototype.draw = function (x, y, ch, fg, bg) {
		if (!fg) {
			fg = this._options.fg;
		}
		if (!bg) {
			bg = this._options.bg;
		}
		this._data[x + "," + y] = [x, y, ch, fg, bg];

		if (this._dirty === true) {
			return;
		} /* will already redraw everything */
		if (!this._dirty) {
			this._dirty = {};
		} /* first! */
		this._dirty[x + "," + y] = true;
	};

	/**
  * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
  * @param {int} x
  * @param {int} y
  * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
  * @param {int} [maxWidth] wrap at what width?
  * @returns {int} lines drawn
  */
	ROT.Display.prototype.drawText = function (x, y, text, maxWidth) {
		var fg = null;
		var bg = null;
		var cx = x;
		var cy = y;
		var lines = 1;
		if (!maxWidth) {
			maxWidth = this._options.width - x;
		}

		var tokens = ROT.Text.tokenize(text, maxWidth);

		while (tokens.length) {
			/* interpret tokenized opcode stream */
			var token = tokens.shift();
			switch (token.type) {
				case ROT.Text.TYPE_TEXT:
					var isSpace = false,
					    isPrevSpace = false,
					    isFullWidth = false,
					    isPrevFullWidth = false;
					for (var i = 0; i < token.value.length; i++) {
						var cc = token.value.charCodeAt(i);
						var c = token.value.charAt(i);
						// Assign to `true` when the current char is full-width.
						isFullWidth = cc > 0xff00 && cc < 0xff61 || cc > 0xffdc && cc < 0xffe8 || cc > 0xffee;
						// Current char is space, whatever full-width or half-width both are OK.
						isSpace = c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000;
						// The previous char is full-width and
						// current char is nether half-width nor a space.
						if (isPrevFullWidth && !isFullWidth && !isSpace) {
							cx++;
						} // add an extra position
						// The current char is full-width and
						// the previous char is not a space.
						if (isFullWidth && !isPrevSpace) {
							cx++;
						} // add an extra position
						this.draw(cx++, cy, c, fg, bg);
						isPrevSpace = isSpace;
						isPrevFullWidth = isFullWidth;
					}
					break;

				case ROT.Text.TYPE_FG:
					fg = token.value || null;
					break;

				case ROT.Text.TYPE_BG:
					bg = token.value || null;
					break;

				case ROT.Text.TYPE_NEWLINE:
					cx = x;
					cy++;
					lines++;
					break;
			}
		}

		return lines;
	};

	/**
  * Timer tick: update dirty parts
  */
	ROT.Display.prototype._tick = function () {
		requestAnimationFrame(this._tick);

		if (!this._dirty) {
			return;
		}

		if (this._dirty === true) {
			/* draw all */
			this._context.fillStyle = this._options.bg;
			this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);

			for (var id in this._data) {
				/* redraw cached data */
				this._draw(id, false);
			}
		} else {
			/* draw only dirty */
			for (var key in this._dirty) {
				this._draw(key, true);
			}
		}

		this._dirty = false;
	};

	/**
  * @param {string} key What to draw
  * @param {bool} clearBefore Is it necessary to clean before?
  */
	ROT.Display.prototype._draw = function (key, clearBefore) {
		var data = this._data[key];
		if (data[4] != this._options.bg) {
			clearBefore = true;
		}

		this._backend.draw(data, clearBefore);
	};
	/**
  * @class Abstract display backend module
  * @private
  */
	ROT.Display.Backend = function (context) {
		this._context = context;
	};

	ROT.Display.Backend.prototype.compute = function (options) {};

	ROT.Display.Backend.prototype.draw = function (data, clearBefore) {};

	ROT.Display.Backend.prototype.computeSize = function (availWidth, availHeight) {};

	ROT.Display.Backend.prototype.computeFontSize = function (availWidth, availHeight) {};

	ROT.Display.Backend.prototype.eventToPosition = function (x, y) {};
	/**
  * @class Rectangular backend
  * @private
  */
	ROT.Display.Rect = function (context) {
		ROT.Display.Backend.call(this, context);

		this._spacingX = 0;
		this._spacingY = 0;
		this._canvasCache = {};
		this._options = {};
	};
	ROT.Display.Rect.extend(ROT.Display.Backend);

	ROT.Display.Rect.cache = false;

	ROT.Display.Rect.prototype.compute = function (options) {
		this._canvasCache = {};
		this._options = options;

		var charWidth = Math.ceil(this._context.measureText("W").width);
		this._spacingX = Math.ceil(options.spacing * charWidth);
		this._spacingY = Math.ceil(options.spacing * options.fontSize);

		if (this._options.forceSquareRatio) {
			this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
		}

		this._context.canvas.width = options.width * this._spacingX;
		this._context.canvas.height = options.height * this._spacingY;
	};

	ROT.Display.Rect.prototype.draw = function (data, clearBefore) {
		if (this.constructor.cache) {
			this._drawWithCache(data, clearBefore);
		} else {
			this._drawNoCache(data, clearBefore);
		}
	};

	ROT.Display.Rect.prototype._drawWithCache = function (data, clearBefore) {
		var x = data[0];
		var y = data[1];
		var ch = data[2];
		var fg = data[3];
		var bg = data[4];

		var hash = "" + ch + fg + bg;
		if (hash in this._canvasCache) {
			var canvas = this._canvasCache[hash];
		} else {
			var b = this._options.border;
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			canvas.width = this._spacingX;
			canvas.height = this._spacingY;
			ctx.fillStyle = bg;
			ctx.fillRect(b, b, canvas.width - b, canvas.height - b);

			if (ch) {
				ctx.fillStyle = fg;
				ctx.font = this._context.font;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";

				var chars = [].concat(ch);
				for (var i = 0; i < chars.length; i++) {
					ctx.fillText(chars[i], this._spacingX / 2, Math.ceil(this._spacingY / 2));
				}
			}
			this._canvasCache[hash] = canvas;
		}

		this._context.drawImage(canvas, x * this._spacingX, y * this._spacingY);
	};

	ROT.Display.Rect.prototype._drawNoCache = function (data, clearBefore) {
		var x = data[0];
		var y = data[1];
		var ch = data[2];
		var fg = data[3];
		var bg = data[4];

		if (clearBefore) {
			var b = this._options.border;
			this._context.fillStyle = bg;
			this._context.fillRect(x * this._spacingX + b, y * this._spacingY + b, this._spacingX - b, this._spacingY - b);
		}

		if (!ch) {
			return;
		}

		this._context.fillStyle = fg;

		var chars = [].concat(ch);
		for (var i = 0; i < chars.length; i++) {
			this._context.fillText(chars[i], (x + 0.5) * this._spacingX, Math.ceil((y + 0.5) * this._spacingY));
		}
	};

	ROT.Display.Rect.prototype.computeSize = function (availWidth, availHeight) {
		var width = Math.floor(availWidth / this._spacingX);
		var height = Math.floor(availHeight / this._spacingY);
		return [width, height];
	};

	ROT.Display.Rect.prototype.computeFontSize = function (availWidth, availHeight) {
		var boxWidth = Math.floor(availWidth / this._options.width);
		var boxHeight = Math.floor(availHeight / this._options.height);

		/* compute char ratio */
		var oldFont = this._context.font;
		this._context.font = "100px " + this._options.fontFamily;
		var width = Math.ceil(this._context.measureText("W").width);
		this._context.font = oldFont;
		var ratio = width / 100;

		var widthFraction = ratio * boxHeight / boxWidth;
		if (widthFraction > 1) {
			/* too wide with current aspect ratio */
			boxHeight = Math.floor(boxHeight / widthFraction);
		}
		return Math.floor(boxHeight / this._options.spacing);
	};

	ROT.Display.Rect.prototype.eventToPosition = function (x, y) {
		return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
	};
	/**
  * @class Hexagonal backend
  * @private
  */
	ROT.Display.Hex = function (context) {
		ROT.Display.Backend.call(this, context);

		this._spacingX = 0;
		this._spacingY = 0;
		this._hexSize = 0;
		this._options = {};
	};
	ROT.Display.Hex.extend(ROT.Display.Backend);

	ROT.Display.Hex.prototype.compute = function (options) {
		this._options = options;

		/* FIXME char size computation does not respect transposed hexes */
		var charWidth = Math.ceil(this._context.measureText("W").width);
		this._hexSize = Math.floor(options.spacing * (options.fontSize + charWidth / Math.sqrt(3)) / 2);
		this._spacingX = this._hexSize * Math.sqrt(3) / 2;
		this._spacingY = this._hexSize * 1.5;

		if (options.transpose) {
			var xprop = "height";
			var yprop = "width";
		} else {
			var xprop = "width";
			var yprop = "height";
		}
		this._context.canvas[xprop] = Math.ceil((options.width + 1) * this._spacingX);
		this._context.canvas[yprop] = Math.ceil((options.height - 1) * this._spacingY + 2 * this._hexSize);
	};

	ROT.Display.Hex.prototype.draw = function (data, clearBefore) {
		var x = data[0];
		var y = data[1];
		var ch = data[2];
		var fg = data[3];
		var bg = data[4];

		var px = [(x + 1) * this._spacingX, y * this._spacingY + this._hexSize];
		if (this._options.transpose) {
			px.reverse();
		}

		if (clearBefore) {
			this._context.fillStyle = bg;
			this._fill(px[0], px[1]);
		}

		if (!ch) {
			return;
		}

		this._context.fillStyle = fg;

		var chars = [].concat(ch);
		for (var i = 0; i < chars.length; i++) {
			this._context.fillText(chars[i], px[0], Math.ceil(px[1]));
		}
	};

	ROT.Display.Hex.prototype.computeSize = function (availWidth, availHeight) {
		if (this._options.transpose) {
			availWidth += availHeight;
			availHeight = availWidth - availHeight;
			availWidth -= availHeight;
		}

		var width = Math.floor(availWidth / this._spacingX) - 1;
		var height = Math.floor((availHeight - 2 * this._hexSize) / this._spacingY + 1);
		return [width, height];
	};

	ROT.Display.Hex.prototype.computeFontSize = function (availWidth, availHeight) {
		if (this._options.transpose) {
			availWidth += availHeight;
			availHeight = availWidth - availHeight;
			availWidth -= availHeight;
		}

		var hexSizeWidth = 2 * availWidth / ((this._options.width + 1) * Math.sqrt(3)) - 1;
		var hexSizeHeight = availHeight / (2 + 1.5 * (this._options.height - 1));
		var hexSize = Math.min(hexSizeWidth, hexSizeHeight);

		/* compute char ratio */
		var oldFont = this._context.font;
		this._context.font = "100px " + this._options.fontFamily;
		var width = Math.ceil(this._context.measureText("W").width);
		this._context.font = oldFont;
		var ratio = width / 100;

		hexSize = Math.floor(hexSize) + 1; /* closest larger hexSize */

		/* FIXME char size computation does not respect transposed hexes */
		var fontSize = 2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));

		/* closest smaller fontSize */
		return Math.ceil(fontSize) - 1;
	};

	ROT.Display.Hex.prototype.eventToPosition = function (x, y) {
		if (this._options.transpose) {
			x += y;
			y = x - y;
			x -= y;
			var nodeSize = this._context.canvas.width;
		} else {
			var nodeSize = this._context.canvas.height;
		}
		var size = nodeSize / this._options.height;
		y = Math.floor(y / size);

		if (y.mod(2)) {
			/* odd row */
			x -= this._spacingX;
			x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
		} else {
			x = 2 * Math.floor(x / (2 * this._spacingX));
		}

		return [x, y];
	};

	/**
  * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
  */
	ROT.Display.Hex.prototype._fill = function (cx, cy) {
		var a = this._hexSize;
		var b = this._options.border;

		this._context.beginPath();

		if (this._options.transpose) {
			this._context.moveTo(cx - a + b, cy);
			this._context.lineTo(cx - a / 2 + b, cy + this._spacingX - b);
			this._context.lineTo(cx + a / 2 - b, cy + this._spacingX - b);
			this._context.lineTo(cx + a - b, cy);
			this._context.lineTo(cx + a / 2 - b, cy - this._spacingX + b);
			this._context.lineTo(cx - a / 2 + b, cy - this._spacingX + b);
			this._context.lineTo(cx - a + b, cy);
		} else {
			this._context.moveTo(cx, cy - a + b);
			this._context.lineTo(cx + this._spacingX - b, cy - a / 2 + b);
			this._context.lineTo(cx + this._spacingX - b, cy + a / 2 - b);
			this._context.lineTo(cx, cy + a - b);
			this._context.lineTo(cx - this._spacingX + b, cy + a / 2 - b);
			this._context.lineTo(cx - this._spacingX + b, cy - a / 2 + b);
			this._context.lineTo(cx, cy - a + b);
		}
		this._context.fill();
	};
	/**
  * @class Tile backend
  * @private
  */
	ROT.Display.Tile = function (context) {
		ROT.Display.Rect.call(this, context);

		this._options = {};
		this._colorCanvas = document.createElement("canvas");
	};
	ROT.Display.Tile.extend(ROT.Display.Rect);

	ROT.Display.Tile.prototype.compute = function (options) {
		this._options = options;
		this._context.canvas.width = options.width * options.tileWidth;
		this._context.canvas.height = options.height * options.tileHeight;
		this._colorCanvas.width = options.tileWidth;
		this._colorCanvas.height = options.tileHeight;
	};

	ROT.Display.Tile.prototype.draw = function (data, clearBefore) {
		var x = data[0];
		var y = data[1];
		var ch = data[2];
		var fg = data[3];
		var bg = data[4];

		var tileWidth = this._options.tileWidth;
		var tileHeight = this._options.tileHeight;

		if (clearBefore) {
			if (this._options.tileColorize) {
				this._context.clearRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
			} else {
				this._context.fillStyle = bg;
				this._context.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
			}
		}

		if (!ch) {
			return;
		}

		var chars = [].concat(ch);
		for (var i = 0; i < chars.length; i++) {
			var tile = this._options.tileMap[chars[i]];
			if (!tile) {
				throw new Error("Char '" + chars[i] + "' not found in tileMap");
			}

			if (this._options.tileColorize) {
				/* apply colorization */
				var canvas = this._colorCanvas;
				var context = canvas.getContext("2d");
				context.clearRect(0, 0, tileWidth, tileHeight);

				context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);

				if (fg != "transparent") {
					context.fillStyle = fg;
					context.globalCompositeOperation = "source-atop";
					context.fillRect(0, 0, tileWidth, tileHeight);
				}

				if (bg != "transparent") {
					context.fillStyle = bg;
					context.globalCompositeOperation = "destination-over";
					context.fillRect(0, 0, tileWidth, tileHeight);
				}

				this._context.drawImage(canvas, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
			} else {
				/* no colorizing, easy */
				this._context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
			}
		}
	};

	ROT.Display.Tile.prototype.computeSize = function (availWidth, availHeight) {
		var width = Math.floor(availWidth / this._options.tileWidth);
		var height = Math.floor(availHeight / this._options.tileHeight);
		return [width, height];
	};

	ROT.Display.Tile.prototype.computeFontSize = function (availWidth, availHeight) {
		var width = Math.floor(availWidth / this._options.width);
		var height = Math.floor(availHeight / this._options.height);
		return [width, height];
	};

	ROT.Display.Tile.prototype.eventToPosition = function (x, y) {
		return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
	};
	/**
  * @namespace
  * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
  * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
  */
	ROT.RNG = {
		/**
   * @returns {number} 
   */
		getSeed: function getSeed() {
			return this._seed;
		},

		/**
   * @param {number} seed Seed the number generator
   */
		setSeed: function setSeed(seed) {
			seed = seed < 1 ? 1 / seed : seed;

			this._seed = seed;
			this._s0 = (seed >>> 0) * this._frac;

			seed = seed * 69069 + 1 >>> 0;
			this._s1 = seed * this._frac;

			seed = seed * 69069 + 1 >>> 0;
			this._s2 = seed * this._frac;

			this._c = 1;
			return this;
		},

		/**
   * @returns {float} Pseudorandom value [0,1), uniformly distributed
   */
		getUniform: function getUniform() {
			var t = 2091639 * this._s0 + this._c * this._frac;
			this._s0 = this._s1;
			this._s1 = this._s2;
			this._c = t | 0;
			this._s2 = t - this._c;
			return this._s2;
		},

		/**
   * @param {int} lowerBound The lower end of the range to return a value from, inclusive
   * @param {int} upperBound The upper end of the range to return a value from, inclusive
   * @returns {int} Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
   */
		getUniformInt: function getUniformInt(lowerBound, upperBound) {
			var max = Math.max(lowerBound, upperBound);
			var min = Math.min(lowerBound, upperBound);
			return Math.floor(this.getUniform() * (max - min + 1)) + min;
		},

		/**
   * @param {float} [mean=0] Mean value
   * @param {float} [stddev=1] Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
   * @returns {float} A normally distributed pseudorandom value
   */
		getNormal: function getNormal(mean, stddev) {
			do {
				var u = 2 * this.getUniform() - 1;
				var v = 2 * this.getUniform() - 1;
				var r = u * u + v * v;
			} while (r > 1 || r == 0);

			var gauss = u * Math.sqrt(-2 * Math.log(r) / r);
			return (mean || 0) + gauss * (stddev || 1);
		},

		/**
   * @returns {int} Pseudorandom value [1,100] inclusive, uniformly distributed
   */
		getPercentage: function getPercentage() {
			return 1 + Math.floor(this.getUniform() * 100);
		},

		/**
   * @param {object} data key=whatever, value=weight (relative probability)
   * @returns {string} whatever
   */
		getWeightedValue: function getWeightedValue(data) {
			var total = 0;

			for (var id in data) {
				total += data[id];
			}
			var random = this.getUniform() * total;

			var part = 0;
			for (var id in data) {
				part += data[id];
				if (random < part) {
					return id;
				}
			}

			// If by some floating-point annoyance we have
			// random >= total, just return the last id.
			return id;
		},

		/**
   * Get RNG state. Useful for storing the state and re-setting it via setState.
   * @returns {?} Internal state
   */
		getState: function getState() {
			return [this._s0, this._s1, this._s2, this._c];
		},

		/**
   * Set a previously retrieved state.
   * @param {?} state
   */
		setState: function setState(state) {
			this._s0 = state[0];
			this._s1 = state[1];
			this._s2 = state[2];
			this._c = state[3];
			return this;
		},

		/**
   * Returns a cloned RNG
   */
		clone: function clone() {
			var clone = Object.create(this);
			clone.setState(this.getState());
			return clone;
		},

		_s0: 0,
		_s1: 0,
		_s2: 0,
		_c: 0,
		_frac: 2.3283064365386963e-10 /* 2^-32 */
	};

	ROT.RNG.setSeed(Date.now());
	/**
  * @class (Markov process)-based string generator. 
  * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>. 
  * Offers configurable order and prior.
  * @param {object} [options]
  * @param {bool} [options.words=false] Use word mode?
  * @param {int} [options.order=3]
  * @param {float} [options.prior=0.001]
  */
	ROT.StringGenerator = function (options) {
		this._options = {
			words: false,
			order: 3,
			prior: 0.001
		};
		for (var p in options) {
			this._options[p] = options[p];
		}

		this._boundary = String.fromCharCode(0);
		this._suffix = this._boundary;
		this._prefix = [];
		for (var i = 0; i < this._options.order; i++) {
			this._prefix.push(this._boundary);
		}

		this._priorValues = {};
		this._priorValues[this._boundary] = this._options.prior;

		this._data = {};
	};

	/**
  * Remove all learning data
  */
	ROT.StringGenerator.prototype.clear = function () {
		this._data = {};
		this._priorValues = {};
	};

	/**
  * @returns {string} Generated string
  */
	ROT.StringGenerator.prototype.generate = function () {
		var result = [this._sample(this._prefix)];
		while (result[result.length - 1] != this._boundary) {
			result.push(this._sample(result));
		}
		return this._join(result.slice(0, -1));
	};

	/**
  * Observe (learn) a string from a training set
  */
	ROT.StringGenerator.prototype.observe = function (string) {
		var tokens = this._split(string);

		for (var i = 0; i < tokens.length; i++) {
			this._priorValues[tokens[i]] = this._options.prior;
		}

		tokens = this._prefix.concat(tokens).concat(this._suffix); /* add boundary symbols */

		for (var i = this._options.order; i < tokens.length; i++) {
			var context = tokens.slice(i - this._options.order, i);
			var event = tokens[i];
			for (var j = 0; j < context.length; j++) {
				var subcontext = context.slice(j);
				this._observeEvent(subcontext, event);
			}
		}
	};

	ROT.StringGenerator.prototype.getStats = function () {
		var parts = [];

		var priorCount = 0;
		for (var p in this._priorValues) {
			priorCount++;
		}
		priorCount--; /* boundary */
		parts.push("distinct samples: " + priorCount);

		var dataCount = 0;
		var eventCount = 0;
		for (var p in this._data) {
			dataCount++;
			for (var key in this._data[p]) {
				eventCount++;
			}
		}
		parts.push("dictionary size (contexts): " + dataCount);
		parts.push("dictionary size (events): " + eventCount);

		return parts.join(", ");
	};

	/**
  * @param {string}
  * @returns {string[]}
  */
	ROT.StringGenerator.prototype._split = function (str) {
		return str.split(this._options.words ? /\s+/ : "");
	};

	/**
  * @param {string[]}
  * @returns {string} 
  */
	ROT.StringGenerator.prototype._join = function (arr) {
		return arr.join(this._options.words ? " " : "");
	};

	/**
  * @param {string[]} context
  * @param {string} event
  */
	ROT.StringGenerator.prototype._observeEvent = function (context, event) {
		var key = this._join(context);
		if (!(key in this._data)) {
			this._data[key] = {};
		}
		var data = this._data[key];

		if (!(event in data)) {
			data[event] = 0;
		}
		data[event]++;
	};

	/**
  * @param {string[]}
  * @returns {string}
  */
	ROT.StringGenerator.prototype._sample = function (context) {
		context = this._backoff(context);
		var key = this._join(context);
		var data = this._data[key];

		var available = {};

		if (this._options.prior) {
			for (var event in this._priorValues) {
				available[event] = this._priorValues[event];
			}
			for (var event in data) {
				available[event] += data[event];
			}
		} else {
			available = data;
		}

		return ROT.RNG.getWeightedValue(available);
	};

	/**
  * @param {string[]}
  * @returns {string[]}
  */
	ROT.StringGenerator.prototype._backoff = function (context) {
		if (context.length > this._options.order) {
			context = context.slice(-this._options.order);
		} else if (context.length < this._options.order) {
			context = this._prefix.slice(0, this._options.order - context.length).concat(context);
		}

		while (!(this._join(context) in this._data) && context.length > 0) {
			context = context.slice(1);
		}

		return context;
	};
	/**
  * @class Generic event queue: stores events and retrieves them based on their time
  */
	ROT.EventQueue = function () {
		this._time = 0;
		this._events = [];
		this._eventTimes = [];
	};

	/**
  * @returns {number} Elapsed time
  */
	ROT.EventQueue.prototype.getTime = function () {
		return this._time;
	};

	/**
  * Clear all scheduled events
  */
	ROT.EventQueue.prototype.clear = function () {
		this._events = [];
		this._eventTimes = [];
		return this;
	};

	/**
  * @param {?} event
  * @param {number} time
  */
	ROT.EventQueue.prototype.add = function (event, time) {
		var index = this._events.length;
		for (var i = 0; i < this._eventTimes.length; i++) {
			if (this._eventTimes[i] > time) {
				index = i;
				break;
			}
		}

		this._events.splice(index, 0, event);
		this._eventTimes.splice(index, 0, time);
	};

	/**
  * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
  * @returns {? || null} The event previously added by addEvent, null if no event available
  */
	ROT.EventQueue.prototype.get = function () {
		if (!this._events.length) {
			return null;
		}

		var time = this._eventTimes.splice(0, 1)[0];
		if (time > 0) {
			/* advance */
			this._time += time;
			for (var i = 0; i < this._eventTimes.length; i++) {
				this._eventTimes[i] -= time;
			}
		}

		return this._events.splice(0, 1)[0];
	};

	/**
  * Get the time associated with the given event
  * @param {?} event
  * @returns {number} time
  */
	ROT.EventQueue.prototype.getEventTime = function (event) {
		var index = this._events.indexOf(event);
		if (index == -1) {
			return undefined;
		}
		return this._eventTimes[index];
	};

	/**
  * Remove an event from the queue
  * @param {?} event
  * @returns {bool} success?
  */
	ROT.EventQueue.prototype.remove = function (event) {
		var index = this._events.indexOf(event);
		if (index == -1) {
			return false;
		}
		this._remove(index);
		return true;
	};

	/**
  * Remove an event from the queue
  * @param {int} index
  */
	ROT.EventQueue.prototype._remove = function (index) {
		this._events.splice(index, 1);
		this._eventTimes.splice(index, 1);
	};
	/**
  * @class Abstract scheduler
  */
	ROT.Scheduler = function () {
		this._queue = new ROT.EventQueue();
		this._repeat = [];
		this._current = null;
	};

	/**
  * @see ROT.EventQueue#getTime
  */
	ROT.Scheduler.prototype.getTime = function () {
		return this._queue.getTime();
	};

	/**
  * @param {?} item
  * @param {bool} repeat
  */
	ROT.Scheduler.prototype.add = function (item, repeat) {
		if (repeat) {
			this._repeat.push(item);
		}
		return this;
	};

	/**
  * Get the time the given item is scheduled for
  * @param {?} item
  * @returns {number} time
  */
	ROT.Scheduler.prototype.getTimeOf = function (item) {
		return this._queue.getEventTime(item);
	};

	/**
  * Clear all items
  */
	ROT.Scheduler.prototype.clear = function () {
		this._queue.clear();
		this._repeat = [];
		this._current = null;
		return this;
	};

	/**
  * Remove a previously added item
  * @param {?} item
  * @returns {bool} successful?
  */
	ROT.Scheduler.prototype.remove = function (item) {
		var result = this._queue.remove(item);

		var index = this._repeat.indexOf(item);
		if (index != -1) {
			this._repeat.splice(index, 1);
		}

		if (this._current == item) {
			this._current = null;
		}

		return result;
	};

	/**
  * Schedule next item
  * @returns {?}
  */
	ROT.Scheduler.prototype.next = function () {
		this._current = this._queue.get();
		return this._current;
	};
	/**
  * @class Simple fair scheduler (round-robin style)
  * @augments ROT.Scheduler
  */
	ROT.Scheduler.Simple = function () {
		ROT.Scheduler.call(this);
	};
	ROT.Scheduler.Simple.extend(ROT.Scheduler);

	/**
  * @see ROT.Scheduler#add
  */
	ROT.Scheduler.Simple.prototype.add = function (item, repeat) {
		this._queue.add(item, 0);
		return ROT.Scheduler.prototype.add.call(this, item, repeat);
	};

	/**
  * @see ROT.Scheduler#next
  */
	ROT.Scheduler.Simple.prototype.next = function () {
		if (this._current && this._repeat.indexOf(this._current) != -1) {
			this._queue.add(this._current, 0);
		}
		return ROT.Scheduler.prototype.next.call(this);
	};
	/**
  * @class Speed-based scheduler
  * @augments ROT.Scheduler
  */
	ROT.Scheduler.Speed = function () {
		ROT.Scheduler.call(this);
	};
	ROT.Scheduler.Speed.extend(ROT.Scheduler);

	/**
  * @param {object} item anything with "getSpeed" method
  * @param {bool} repeat
  * @param {number} [time=1/item.getSpeed()]
  * @see ROT.Scheduler#add
  */
	ROT.Scheduler.Speed.prototype.add = function (item, repeat, time) {
		this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed());
		return ROT.Scheduler.prototype.add.call(this, item, repeat);
	};

	/**
  * @see ROT.Scheduler#next
  */
	ROT.Scheduler.Speed.prototype.next = function () {
		if (this._current && this._repeat.indexOf(this._current) != -1) {
			this._queue.add(this._current, 1 / this._current.getSpeed());
		}
		return ROT.Scheduler.prototype.next.call(this);
	};
	/**
  * @class Action-based scheduler
  * @augments ROT.Scheduler
  */
	ROT.Scheduler.Action = function () {
		ROT.Scheduler.call(this);
		this._defaultDuration = 1; /* for newly added */
		this._duration = this._defaultDuration; /* for this._current */
	};
	ROT.Scheduler.Action.extend(ROT.Scheduler);

	/**
  * @param {object} item
  * @param {bool} repeat
  * @param {number} [time=1]
  * @see ROT.Scheduler#add
  */
	ROT.Scheduler.Action.prototype.add = function (item, repeat, time) {
		this._queue.add(item, time || this._defaultDuration);
		return ROT.Scheduler.prototype.add.call(this, item, repeat);
	};

	ROT.Scheduler.Action.prototype.clear = function () {
		this._duration = this._defaultDuration;
		return ROT.Scheduler.prototype.clear.call(this);
	};

	ROT.Scheduler.Action.prototype.remove = function (item) {
		if (item == this._current) {
			this._duration = this._defaultDuration;
		}
		return ROT.Scheduler.prototype.remove.call(this, item);
	};

	/**
  * @see ROT.Scheduler#next
  */
	ROT.Scheduler.Action.prototype.next = function () {
		if (this._current && this._repeat.indexOf(this._current) != -1) {
			this._queue.add(this._current, this._duration || this._defaultDuration);
			this._duration = this._defaultDuration;
		}
		return ROT.Scheduler.prototype.next.call(this);
	};

	/**
  * Set duration for the active item
  */
	ROT.Scheduler.Action.prototype.setDuration = function (time) {
		if (this._current) {
			this._duration = time;
		}
		return this;
	};
	/**
  * @class Asynchronous main loop
  * @param {ROT.Scheduler} scheduler
  */
	ROT.Engine = function (scheduler) {
		this._scheduler = scheduler;
		this._lock = 1;
	};

	/**
  * Start the main loop. When this call returns, the loop is locked.
  */
	ROT.Engine.prototype.start = function () {
		return this.unlock();
	};

	/**
  * Interrupt the engine by an asynchronous action
  */
	ROT.Engine.prototype.lock = function () {
		this._lock++;
		return this;
	};

	/**
  * Resume execution (paused by a previous lock)
  */
	ROT.Engine.prototype.unlock = function () {
		if (!this._lock) {
			throw new Error("Cannot unlock unlocked engine");
		}
		this._lock--;

		while (!this._lock) {
			var actor = this._scheduler.next();
			if (!actor) {
				return this.lock();
			} /* no actors */
			var result = actor.act();
			if (result && result.then) {
				/* actor returned a "thenable", looks like a Promise */
				this.lock();
				result.then(this.unlock.bind(this));
			}
		}

		return this;
	};
	/**
  * @class Base map generator
  * @param {int} [width=ROT.DEFAULT_WIDTH]
  * @param {int} [height=ROT.DEFAULT_HEIGHT]
  */
	ROT.Map = function (width, height) {
		this._width = width || ROT.DEFAULT_WIDTH;
		this._height = height || ROT.DEFAULT_HEIGHT;
	};

	ROT.Map.prototype.create = function (callback) {};

	ROT.Map.prototype._fillMap = function (value) {
		var map = [];
		for (var i = 0; i < this._width; i++) {
			map.push([]);
			for (var j = 0; j < this._height; j++) {
				map[i].push(value);
			}
		}
		return map;
	};
	/**
  * @class Simple empty rectangular room
  * @augments ROT.Map
  */
	ROT.Map.Arena = function (width, height) {
		ROT.Map.call(this, width, height);
	};
	ROT.Map.Arena.extend(ROT.Map);

	ROT.Map.Arena.prototype.create = function (callback) {
		var w = this._width - 1;
		var h = this._height - 1;
		for (var i = 0; i <= w; i++) {
			for (var j = 0; j <= h; j++) {
				var empty = i && j && i < w && j < h;
				callback(i, j, empty ? 0 : 1);
			}
		}
		return this;
	};
	/**
  * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
  * @augments ROT.Map
  */
	ROT.Map.DividedMaze = function (width, height) {
		ROT.Map.call(this, width, height);
		this._stack = [];
	};
	ROT.Map.DividedMaze.extend(ROT.Map);

	ROT.Map.DividedMaze.prototype.create = function (callback) {
		var w = this._width;
		var h = this._height;

		this._map = [];

		for (var i = 0; i < w; i++) {
			this._map.push([]);
			for (var j = 0; j < h; j++) {
				var border = i == 0 || j == 0 || i + 1 == w || j + 1 == h;
				this._map[i].push(border ? 1 : 0);
			}
		}

		this._stack = [[1, 1, w - 2, h - 2]];
		this._process();

		for (var i = 0; i < w; i++) {
			for (var j = 0; j < h; j++) {
				callback(i, j, this._map[i][j]);
			}
		}
		this._map = null;
		return this;
	};

	ROT.Map.DividedMaze.prototype._process = function () {
		while (this._stack.length) {
			var room = this._stack.shift(); /* [left, top, right, bottom] */
			this._partitionRoom(room);
		}
	};

	ROT.Map.DividedMaze.prototype._partitionRoom = function (room) {
		var availX = [];
		var availY = [];

		for (var i = room[0] + 1; i < room[2]; i++) {
			var top = this._map[i][room[1] - 1];
			var bottom = this._map[i][room[3] + 1];
			if (top && bottom && !(i % 2)) {
				availX.push(i);
			}
		}

		for (var j = room[1] + 1; j < room[3]; j++) {
			var left = this._map[room[0] - 1][j];
			var right = this._map[room[2] + 1][j];
			if (left && right && !(j % 2)) {
				availY.push(j);
			}
		}

		if (!availX.length || !availY.length) {
			return;
		}

		var x = availX.random();
		var y = availY.random();

		this._map[x][y] = 1;

		var walls = [];

		var w = [];walls.push(w); /* left part */
		for (var i = room[0]; i < x; i++) {
			this._map[i][y] = 1;
			w.push([i, y]);
		}

		var w = [];walls.push(w); /* right part */
		for (var i = x + 1; i <= room[2]; i++) {
			this._map[i][y] = 1;
			w.push([i, y]);
		}

		var w = [];walls.push(w); /* top part */
		for (var j = room[1]; j < y; j++) {
			this._map[x][j] = 1;
			w.push([x, j]);
		}

		var w = [];walls.push(w); /* bottom part */
		for (var j = y + 1; j <= room[3]; j++) {
			this._map[x][j] = 1;
			w.push([x, j]);
		}

		var solid = walls.random();
		for (var i = 0; i < walls.length; i++) {
			var w = walls[i];
			if (w == solid) {
				continue;
			}

			var hole = w.random();
			this._map[hole[0]][hole[1]] = 0;
		}

		this._stack.push([room[0], room[1], x - 1, y - 1]); /* left top */
		this._stack.push([x + 1, room[1], room[2], y - 1]); /* right top */
		this._stack.push([room[0], y + 1, x - 1, room[3]]); /* left bottom */
		this._stack.push([x + 1, y + 1, room[2], room[3]]); /* right bottom */
	};
	/**
  * @class Icey's Maze generator
  * See http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze for explanation
  * @augments ROT.Map
  */
	ROT.Map.IceyMaze = function (width, height, regularity) {
		ROT.Map.call(this, width, height);
		this._regularity = regularity || 0;
	};
	ROT.Map.IceyMaze.extend(ROT.Map);

	ROT.Map.IceyMaze.prototype.create = function (callback) {
		var width = this._width;
		var height = this._height;

		var map = this._fillMap(1);

		width -= width % 2 ? 1 : 2;
		height -= height % 2 ? 1 : 2;

		var cx = 0;
		var cy = 0;
		var nx = 0;
		var ny = 0;

		var done = 0;
		var blocked = false;
		var dirs = [[0, 0], [0, 0], [0, 0], [0, 0]];
		do {
			cx = 1 + 2 * Math.floor(ROT.RNG.getUniform() * (width - 1) / 2);
			cy = 1 + 2 * Math.floor(ROT.RNG.getUniform() * (height - 1) / 2);

			if (!done) {
				map[cx][cy] = 0;
			}

			if (!map[cx][cy]) {
				this._randomize(dirs);
				do {
					if (Math.floor(ROT.RNG.getUniform() * (this._regularity + 1)) == 0) {
						this._randomize(dirs);
					}
					blocked = true;
					for (var i = 0; i < 4; i++) {
						nx = cx + dirs[i][0] * 2;
						ny = cy + dirs[i][1] * 2;
						if (this._isFree(map, nx, ny, width, height)) {
							map[nx][ny] = 0;
							map[cx + dirs[i][0]][cy + dirs[i][1]] = 0;

							cx = nx;
							cy = ny;
							blocked = false;
							done++;
							break;
						}
					}
				} while (!blocked);
			}
		} while (done + 1 < width * height / 4);

		for (var i = 0; i < this._width; i++) {
			for (var j = 0; j < this._height; j++) {
				callback(i, j, map[i][j]);
			}
		}
		this._map = null;
		return this;
	};

	ROT.Map.IceyMaze.prototype._randomize = function (dirs) {
		for (var i = 0; i < 4; i++) {
			dirs[i][0] = 0;
			dirs[i][1] = 0;
		}

		switch (Math.floor(ROT.RNG.getUniform() * 4)) {
			case 0:
				dirs[0][0] = -1;dirs[1][0] = 1;
				dirs[2][1] = -1;dirs[3][1] = 1;
				break;
			case 1:
				dirs[3][0] = -1;dirs[2][0] = 1;
				dirs[1][1] = -1;dirs[0][1] = 1;
				break;
			case 2:
				dirs[2][0] = -1;dirs[3][0] = 1;
				dirs[0][1] = -1;dirs[1][1] = 1;
				break;
			case 3:
				dirs[1][0] = -1;dirs[0][0] = 1;
				dirs[3][1] = -1;dirs[2][1] = 1;
				break;
		}
	};

	ROT.Map.IceyMaze.prototype._isFree = function (map, x, y, width, height) {
		if (x < 1 || y < 1 || x >= width || y >= height) {
			return false;
		}
		return map[x][y];
	};
	/**
  * @class Maze generator - Eller's algorithm
  * See http://homepages.cwi.nl/~tromp/maze.html for explanation
  * @augments ROT.Map
  */
	ROT.Map.EllerMaze = function (width, height) {
		ROT.Map.call(this, width, height);
	};
	ROT.Map.EllerMaze.extend(ROT.Map);

	ROT.Map.EllerMaze.prototype.create = function (callback) {
		var map = this._fillMap(1);
		var w = Math.ceil((this._width - 2) / 2);

		var rand = 9 / 24;

		var L = [];
		var R = [];

		for (var i = 0; i < w; i++) {
			L.push(i);
			R.push(i);
		}
		L.push(w - 1); /* fake stop-block at the right side */

		for (var j = 1; j + 3 < this._height; j += 2) {
			/* one row */
			for (var i = 0; i < w; i++) {
				/* cell coords (will be always empty) */
				var x = 2 * i + 1;
				var y = j;
				map[x][y] = 0;

				/* right connection */
				if (i != L[i + 1] && ROT.RNG.getUniform() > rand) {
					this._addToList(i, L, R);
					map[x + 1][y] = 0;
				}

				/* bottom connection */
				if (i != L[i] && ROT.RNG.getUniform() > rand) {
					/* remove connection */
					this._removeFromList(i, L, R);
				} else {
					/* create connection */
					map[x][y + 1] = 0;
				}
			}
		}

		/* last row */
		for (var i = 0; i < w; i++) {
			/* cell coords (will be always empty) */
			var x = 2 * i + 1;
			var y = j;
			map[x][y] = 0;

			/* right connection */
			if (i != L[i + 1] && (i == L[i] || ROT.RNG.getUniform() > rand)) {
				/* dig right also if the cell is separated, so it gets connected to the rest of maze */
				this._addToList(i, L, R);
				map[x + 1][y] = 0;
			}

			this._removeFromList(i, L, R);
		}

		for (var i = 0; i < this._width; i++) {
			for (var j = 0; j < this._height; j++) {
				callback(i, j, map[i][j]);
			}
		}

		return this;
	};

	/**
  * Remove "i" from its list
  */
	ROT.Map.EllerMaze.prototype._removeFromList = function (i, L, R) {
		R[L[i]] = R[i];
		L[R[i]] = L[i];
		R[i] = i;
		L[i] = i;
	};

	/**
  * Join lists with "i" and "i+1"
  */
	ROT.Map.EllerMaze.prototype._addToList = function (i, L, R) {
		R[L[i + 1]] = R[i];
		L[R[i]] = L[i + 1];
		R[i] = i + 1;
		L[i + 1] = i;
	};
	/**
  * @class Cellular automaton map generator
  * @augments ROT.Map
  * @param {int} [width=ROT.DEFAULT_WIDTH]
  * @param {int} [height=ROT.DEFAULT_HEIGHT]
  * @param {object} [options] Options
  * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
  * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
  * @param {int} [options.topology] Topology 4 or 6 or 8
  */
	ROT.Map.Cellular = function (width, height, options) {
		ROT.Map.call(this, width, height);
		this._options = {
			born: [5, 6, 7, 8],
			survive: [4, 5, 6, 7, 8],
			topology: 8
		};
		this.setOptions(options);

		this._dirs = ROT.DIRS[this._options.topology];
		this._map = this._fillMap(0);
	};
	ROT.Map.Cellular.extend(ROT.Map);

	/**
  * Fill the map with random values
  * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
  */
	ROT.Map.Cellular.prototype.randomize = function (probability) {
		for (var i = 0; i < this._width; i++) {
			for (var j = 0; j < this._height; j++) {
				this._map[i][j] = ROT.RNG.getUniform() < probability ? 1 : 0;
			}
		}
		return this;
	};

	/**
  * Change options.
  * @see ROT.Map.Cellular
  */
	ROT.Map.Cellular.prototype.setOptions = function (options) {
		for (var p in options) {
			this._options[p] = options[p];
		}
	};

	ROT.Map.Cellular.prototype.set = function (x, y, value) {
		this._map[x][y] = value;
	};

	ROT.Map.Cellular.prototype.create = function (callback) {
		var newMap = this._fillMap(0);
		var born = this._options.born;
		var survive = this._options.survive;

		for (var j = 0; j < this._height; j++) {
			var widthStep = 1;
			var widthStart = 0;
			if (this._options.topology == 6) {
				widthStep = 2;
				widthStart = j % 2;
			}

			for (var i = widthStart; i < this._width; i += widthStep) {

				var cur = this._map[i][j];
				var ncount = this._getNeighbors(i, j);

				if (cur && survive.indexOf(ncount) != -1) {
					/* survive */
					newMap[i][j] = 1;
				} else if (!cur && born.indexOf(ncount) != -1) {
					/* born */
					newMap[i][j] = 1;
				}
			}
		}

		this._map = newMap;

		this.serviceCallback(callback);
	};

	ROT.Map.Cellular.prototype.serviceCallback = function (callback) {
		if (!callback) {
			return;
		}

		for (var j = 0; j < this._height; j++) {
			var widthStep = 1;
			var widthStart = 0;
			if (this._options.topology == 6) {
				widthStep = 2;
				widthStart = j % 2;
			}
			for (var i = widthStart; i < this._width; i += widthStep) {
				callback(i, j, this._map[i][j]);
			}
		}
	};

	/**
  * Get neighbor count at [i,j] in this._map
  */
	ROT.Map.Cellular.prototype._getNeighbors = function (cx, cy) {
		var result = 0;
		for (var i = 0; i < this._dirs.length; i++) {
			var dir = this._dirs[i];
			var x = cx + dir[0];
			var y = cy + dir[1];

			if (x < 0 || x >= this._width || y < 0 || y >= this._width) {
				continue;
			}
			result += this._map[x][y] == 1 ? 1 : 0;
		}

		return result;
	};

	/**
  * Make sure every non-wall space is accessible.
  * @param {function} callback to call to display map when do
  * @param {int} value to consider empty space - defaults to 0
  * @param {function} callback to call when a new connection is made
  */
	ROT.Map.Cellular.prototype.connect = function (callback, value, connectionCallback) {
		if (!value) value = 0;

		var allFreeSpace = [];
		var notConnected = {};
		// find all free space
		for (var x = 0; x < this._width; x++) {
			for (var y = 0; y < this._height; y++) {
				if (this._freeSpace(x, y, value)) {
					var p = [x, y];
					notConnected[this._pointKey(p)] = p;
					allFreeSpace.push([x, y]);
				}
			}
		}
		var start = allFreeSpace[ROT.RNG.getUniformInt(0, allFreeSpace.length - 1)];

		var key = this._pointKey(start);
		var connected = {};
		connected[key] = start;
		delete notConnected[key];

		// find what's connected to the starting point
		this._findConnected(connected, notConnected, [start], false, value);

		while (Object.keys(notConnected).length > 0) {

			// find two points from notConnected to connected
			var p = this._getFromTo(connected, notConnected);
			var from = p[0]; // notConnected
			var to = p[1]; // connected

			// find everything connected to the starting point
			var local = {};
			local[this._pointKey(from)] = from;
			this._findConnected(local, notConnected, [from], true, value);

			// connect to a connected square
			this._tunnelToConnected(to, from, connected, notConnected, value, connectionCallback);

			// now all of local is connected
			for (var k in local) {
				var pp = local[k];
				this._map[pp[0]][pp[1]] = value;
				connected[k] = pp;
				delete notConnected[k];
			}
		}

		this.serviceCallback(callback);
	};

	/**
  * Find random points to connect. Search for the closest point in the larger space.
  * This is to minimize the length of the passage while maintaining good performance.
  */
	ROT.Map.Cellular.prototype._getFromTo = function (connected, notConnected) {
		var from, to, d;
		var connectedKeys = Object.keys(connected);
		var notConnectedKeys = Object.keys(notConnected);
		for (var i = 0; i < 5; i++) {
			if (connectedKeys.length < notConnectedKeys.length) {
				var keys = connectedKeys;
				to = connected[keys[ROT.RNG.getUniformInt(0, keys.length - 1)]];
				from = this._getClosest(to, notConnected);
			} else {
				var keys = notConnectedKeys;
				from = notConnected[keys[ROT.RNG.getUniformInt(0, keys.length - 1)]];
				to = this._getClosest(from, connected);
			}
			d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);
			if (d < 64) {
				break;
			}
		}
		// console.log(">>> connected=" + to + " notConnected=" + from + " dist=" + d);
		return [from, to];
	};

	ROT.Map.Cellular.prototype._getClosest = function (point, space) {
		var minPoint = null;
		var minDist = null;
		for (k in space) {
			var p = space[k];
			var d = (p[0] - point[0]) * (p[0] - point[0]) + (p[1] - point[1]) * (p[1] - point[1]);
			if (minDist == null || d < minDist) {
				minDist = d;
				minPoint = p;
			}
		}
		return minPoint;
	};

	ROT.Map.Cellular.prototype._findConnected = function (connected, notConnected, stack, keepNotConnected, value) {
		while (stack.length > 0) {
			var p = stack.splice(0, 1)[0];
			var tests = [[p[0] + 1, p[1]], [p[0] - 1, p[1]], [p[0], p[1] + 1], [p[0], p[1] - 1]];
			for (var i = 0; i < tests.length; i++) {
				var key = this._pointKey(tests[i]);
				if (connected[key] == null && this._freeSpace(tests[i][0], tests[i][1], value)) {
					connected[key] = tests[i];
					if (!keepNotConnected) {
						delete notConnected[key];
					}
					stack.push(tests[i]);
				}
			}
		}
	};

	ROT.Map.Cellular.prototype._tunnelToConnected = function (to, from, connected, notConnected, value, connectionCallback) {
		var key = this._pointKey(from);
		var a, b;
		if (from[0] < to[0]) {
			a = from;
			b = to;
		} else {
			a = to;
			b = from;
		}
		for (var xx = a[0]; xx <= b[0]; xx++) {
			this._map[xx][a[1]] = value;
			var p = [xx, a[1]];
			var pkey = this._pointKey(p);
			connected[pkey] = p;
			delete notConnected[pkey];
		}
		if (connectionCallback && a[0] < b[0]) {
			connectionCallback(a, [b[0], a[1]]);
		}

		// x is now fixed
		var x = b[0];

		if (from[1] < to[1]) {
			a = from;
			b = to;
		} else {
			a = to;
			b = from;
		}
		for (var yy = a[1]; yy < b[1]; yy++) {
			this._map[x][yy] = value;
			var p = [x, yy];
			var pkey = this._pointKey(p);
			connected[pkey] = p;
			delete notConnected[pkey];
		}
		if (connectionCallback && a[1] < b[1]) {
			connectionCallback([b[0], a[1]], [b[0], b[1]]);
		}
	};

	ROT.Map.Cellular.prototype._freeSpace = function (x, y, value) {
		return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] == value;
	};

	ROT.Map.Cellular.prototype._pointKey = function (p) {
		return p[0] + "." + p[1];
	};
	/**
  * @class Dungeon map: has rooms and corridors
  * @augments ROT.Map
  */
	ROT.Map.Dungeon = function (width, height) {
		ROT.Map.call(this, width, height);
		this._rooms = []; /* list of all rooms */
		this._corridors = [];
	};
	ROT.Map.Dungeon.extend(ROT.Map);

	/**
  * Get all generated rooms
  * @returns {ROT.Map.Feature.Room[]}
  */
	ROT.Map.Dungeon.prototype.getRooms = function () {
		return this._rooms;
	};

	/**
  * Get all generated corridors
  * @returns {ROT.Map.Feature.Corridor[]}
  */
	ROT.Map.Dungeon.prototype.getCorridors = function () {
		return this._corridors;
	};
	/**
  * @class Random dungeon generator using human-like digging patterns.
  * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at 
  * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
  * @augments ROT.Map.Dungeon
  */
	ROT.Map.Digger = function (width, height, options) {
		ROT.Map.Dungeon.call(this, width, height);

		this._options = {
			roomWidth: [3, 9], /* room minimum and maximum width */
			roomHeight: [3, 5], /* room minimum and maximum height */
			corridorLength: [3, 10], /* corridor minimum and maximum length */
			dugPercentage: 0.2, /* we stop after this percentage of level area has been dug out */
			timeLimit: 1000 /* we stop after this much time has passed (msec) */
		};
		for (var p in options) {
			this._options[p] = options[p];
		}

		this._features = {
			"Room": 4,
			"Corridor": 4
		};
		this._featureAttempts = 20; /* how many times do we try to create a feature on a suitable wall */
		this._walls = {}; /* these are available for digging */

		this._digCallback = this._digCallback.bind(this);
		this._canBeDugCallback = this._canBeDugCallback.bind(this);
		this._isWallCallback = this._isWallCallback.bind(this);
		this._priorityWallCallback = this._priorityWallCallback.bind(this);
	};
	ROT.Map.Digger.extend(ROT.Map.Dungeon);

	/**
  * Create a map
  * @see ROT.Map#create
  */
	ROT.Map.Digger.prototype.create = function (callback) {
		this._rooms = [];
		this._corridors = [];
		this._map = this._fillMap(1);
		this._walls = {};
		this._dug = 0;
		var area = (this._width - 2) * (this._height - 2);

		this._firstRoom();

		var t1 = Date.now();

		do {
			var t2 = Date.now();
			if (t2 - t1 > this._options.timeLimit) {
				break;
			}

			/* find a good wall */
			var wall = this._findWall();
			if (!wall) {
				break;
			} /* no more walls */

			var parts = wall.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			var dir = this._getDiggingDirection(x, y);
			if (!dir) {
				continue;
			} /* this wall is not suitable */

			//		console.log("wall", x, y);

			/* try adding a feature */
			var featureAttempts = 0;
			do {
				featureAttempts++;
				if (this._tryFeature(x, y, dir[0], dir[1])) {
					/* feature added */
					//if (this._rooms.length + this._corridors.length == 2) { this._rooms[0].addDoor(x, y); } /* first room oficially has doors */
					this._removeSurroundingWalls(x, y);
					this._removeSurroundingWalls(x - dir[0], y - dir[1]);
					break;
				}
			} while (featureAttempts < this._featureAttempts);

			var priorityWalls = 0;
			for (var id in this._walls) {
				if (this._walls[id] > 1) {
					priorityWalls++;
				}
			}
		} while (this._dug / area < this._options.dugPercentage || priorityWalls); /* fixme number of priority walls */

		this._addDoors();

		if (callback) {
			for (var i = 0; i < this._width; i++) {
				for (var j = 0; j < this._height; j++) {
					callback(i, j, this._map[i][j]);
				}
			}
		}

		this._walls = {};
		this._map = null;

		return this;
	};

	ROT.Map.Digger.prototype._digCallback = function (x, y, value) {
		if (value == 0 || value == 2) {
			/* empty */
			this._map[x][y] = 0;
			this._dug++;
		} else {
			/* wall */
			this._walls[x + "," + y] = 1;
		}
	};

	ROT.Map.Digger.prototype._isWallCallback = function (x, y) {
		if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
			return false;
		}
		return this._map[x][y] == 1;
	};

	ROT.Map.Digger.prototype._canBeDugCallback = function (x, y) {
		if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
			return false;
		}
		return this._map[x][y] == 1;
	};

	ROT.Map.Digger.prototype._priorityWallCallback = function (x, y) {
		this._walls[x + "," + y] = 2;
	};

	ROT.Map.Digger.prototype._firstRoom = function () {
		var cx = Math.floor(this._width / 2);
		var cy = Math.floor(this._height / 2);
		var room = ROT.Map.Feature.Room.createRandomCenter(cx, cy, this._options);
		this._rooms.push(room);
		room.create(this._digCallback);
	};

	/**
  * Get a suitable wall
  */
	ROT.Map.Digger.prototype._findWall = function () {
		var prio1 = [];
		var prio2 = [];
		for (var id in this._walls) {
			var prio = this._walls[id];
			if (prio == 2) {
				prio2.push(id);
			} else {
				prio1.push(id);
			}
		}

		var arr = prio2.length ? prio2 : prio1;
		if (!arr.length) {
			return null;
		} /* no walls :/ */

		var id = arr.random();
		delete this._walls[id];

		return id;
	};

	/**
  * Tries adding a feature
  * @returns {bool} was this a successful try?
  */
	ROT.Map.Digger.prototype._tryFeature = function (x, y, dx, dy) {
		var feature = ROT.RNG.getWeightedValue(this._features);
		feature = ROT.Map.Feature[feature].createRandomAt(x, y, dx, dy, this._options);

		if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
			//		console.log("not valid");
			//		feature.debug();
			return false;
		}

		feature.create(this._digCallback);
		//	feature.debug();

		if (feature instanceof ROT.Map.Feature.Room) {
			this._rooms.push(feature);
		}
		if (feature instanceof ROT.Map.Feature.Corridor) {
			feature.createPriorityWalls(this._priorityWallCallback);
			this._corridors.push(feature);
		}

		return true;
	};

	ROT.Map.Digger.prototype._removeSurroundingWalls = function (cx, cy) {
		var deltas = ROT.DIRS[4];

		for (var i = 0; i < deltas.length; i++) {
			var delta = deltas[i];
			var x = cx + delta[0];
			var y = cy + delta[1];
			delete this._walls[x + "," + y];
			var x = cx + 2 * delta[0];
			var y = cy + 2 * delta[1];
			delete this._walls[x + "," + y];
		}
	};

	/**
  * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
  */
	ROT.Map.Digger.prototype._getDiggingDirection = function (cx, cy) {
		if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) {
			return null;
		}

		var result = null;
		var deltas = ROT.DIRS[4];

		for (var i = 0; i < deltas.length; i++) {
			var delta = deltas[i];
			var x = cx + delta[0];
			var y = cy + delta[1];

			if (!this._map[x][y]) {
				/* there already is another empty neighbor! */
				if (result) {
					return null;
				}
				result = delta;
			}
		}

		/* no empty neighbor */
		if (!result) {
			return null;
		}

		return [-result[0], -result[1]];
	};

	/**
  * Find empty spaces surrounding rooms, and apply doors.
  */
	ROT.Map.Digger.prototype._addDoors = function () {
		var data = this._map;
		var isWallCallback = function isWallCallback(x, y) {
			return data[x][y] == 1;
		};
		for (var i = 0; i < this._rooms.length; i++) {
			var room = this._rooms[i];
			room.clearDoors();
			room.addDoors(isWallCallback);
		}
	};
	/**
  * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
  * @augments ROT.Map.Dungeon
  */
	ROT.Map.Uniform = function (width, height, options) {
		ROT.Map.Dungeon.call(this, width, height);

		this._options = {
			roomWidth: [3, 9], /* room minimum and maximum width */
			roomHeight: [3, 5], /* room minimum and maximum height */
			roomDugPercentage: 0.1, /* we stop after this percentage of level area has been dug out by rooms */
			timeLimit: 1000 /* we stop after this much time has passed (msec) */
		};
		for (var p in options) {
			this._options[p] = options[p];
		}

		this._roomAttempts = 20; /* new room is created N-times until is considered as impossible to generate */
		this._corridorAttempts = 20; /* corridors are tried N-times until the level is considered as impossible to connect */

		this._connected = []; /* list of already connected rooms */
		this._unconnected = []; /* list of remaining unconnected rooms */

		this._digCallback = this._digCallback.bind(this);
		this._canBeDugCallback = this._canBeDugCallback.bind(this);
		this._isWallCallback = this._isWallCallback.bind(this);
	};
	ROT.Map.Uniform.extend(ROT.Map.Dungeon);

	/**
  * Create a map. If the time limit has been hit, returns null.
  * @see ROT.Map#create
  */
	ROT.Map.Uniform.prototype.create = function (callback) {
		var t1 = Date.now();
		while (1) {
			var t2 = Date.now();
			if (t2 - t1 > this._options.timeLimit) {
				return null;
			} /* time limit! */

			this._map = this._fillMap(1);
			this._dug = 0;
			this._rooms = [];
			this._unconnected = [];
			this._generateRooms();
			if (this._rooms.length < 2) {
				continue;
			}
			if (this._generateCorridors()) {
				break;
			}
		}

		if (callback) {
			for (var i = 0; i < this._width; i++) {
				for (var j = 0; j < this._height; j++) {
					callback(i, j, this._map[i][j]);
				}
			}
		}

		return this;
	};

	/**
  * Generates a suitable amount of rooms
  */
	ROT.Map.Uniform.prototype._generateRooms = function () {
		var w = this._width - 2;
		var h = this._height - 2;

		do {
			var room = this._generateRoom();
			if (this._dug / (w * h) > this._options.roomDugPercentage) {
				break;
			} /* achieved requested amount of free space */
		} while (room);

		/* either enough rooms, or not able to generate more of them :) */
	};

	/**
  * Try to generate one room
  */
	ROT.Map.Uniform.prototype._generateRoom = function () {
		var count = 0;
		while (count < this._roomAttempts) {
			count++;

			var room = ROT.Map.Feature.Room.createRandom(this._width, this._height, this._options);
			if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
				continue;
			}

			room.create(this._digCallback);
			this._rooms.push(room);
			return room;
		}

		/* no room was generated in a given number of attempts */
		return null;
	};

	/**
  * Generates connectors beween rooms
  * @returns {bool} success Was this attempt successfull?
  */
	ROT.Map.Uniform.prototype._generateCorridors = function () {
		var cnt = 0;
		while (cnt < this._corridorAttempts) {
			cnt++;
			this._corridors = [];

			/* dig rooms into a clear map */
			this._map = this._fillMap(1);
			for (var i = 0; i < this._rooms.length; i++) {
				var room = this._rooms[i];
				room.clearDoors();
				room.create(this._digCallback);
			}

			this._unconnected = this._rooms.slice().randomize();
			this._connected = [];
			if (this._unconnected.length) {
				this._connected.push(this._unconnected.pop());
			} /* first one is always connected */

			while (1) {
				/* 1. pick random connected room */
				var connected = this._connected.random();

				/* 2. find closest unconnected */
				var room1 = this._closestRoom(this._unconnected, connected);

				/* 3. connect it to closest connected */
				var room2 = this._closestRoom(this._connected, room1);

				var ok = this._connectRooms(room1, room2);
				if (!ok) {
					break;
				} /* stop connecting, re-shuffle */

				if (!this._unconnected.length) {
					return true;
				} /* done; no rooms remain */
			}
		}
		return false;
	};

	/**
  * For a given room, find the closest one from the list
  */
	ROT.Map.Uniform.prototype._closestRoom = function (rooms, room) {
		var dist = Infinity;
		var center = room.getCenter();
		var result = null;

		for (var i = 0; i < rooms.length; i++) {
			var r = rooms[i];
			var c = r.getCenter();
			var dx = c[0] - center[0];
			var dy = c[1] - center[1];
			var d = dx * dx + dy * dy;

			if (d < dist) {
				dist = d;
				result = r;
			}
		}

		return result;
	};

	ROT.Map.Uniform.prototype._connectRooms = function (room1, room2) {
		/*
  	room1.debug();
  	room2.debug();
  */

		var center1 = room1.getCenter();
		var center2 = room2.getCenter();

		var diffX = center2[0] - center1[0];
		var diffY = center2[1] - center1[1];

		if (Math.abs(diffX) < Math.abs(diffY)) {
			/* first try connecting north-south walls */
			var dirIndex1 = diffY > 0 ? 2 : 0;
			var dirIndex2 = (dirIndex1 + 2) % 4;
			var min = room2.getLeft();
			var max = room2.getRight();
			var index = 0;
		} else {
			/* first try connecting east-west walls */
			var dirIndex1 = diffX > 0 ? 1 : 3;
			var dirIndex2 = (dirIndex1 + 2) % 4;
			var min = room2.getTop();
			var max = room2.getBottom();
			var index = 1;
		}

		var start = this._placeInWall(room1, dirIndex1); /* corridor will start here */
		if (!start) {
			return false;
		}

		if (start[index] >= min && start[index] <= max) {
			/* possible to connect with straight line (I-like) */
			var end = start.slice();
			var value = null;
			switch (dirIndex2) {
				case 0:
					value = room2.getTop() - 1;break;
				case 1:
					value = room2.getRight() + 1;break;
				case 2:
					value = room2.getBottom() + 1;break;
				case 3:
					value = room2.getLeft() - 1;break;
			}
			end[(index + 1) % 2] = value;
			this._digLine([start, end]);
		} else if (start[index] < min - 1 || start[index] > max + 1) {
			/* need to switch target wall (L-like) */

			var diff = start[index] - center2[index];
			switch (dirIndex2) {
				case 0:
				case 1:
					var rotation = diff < 0 ? 3 : 1;break;
				case 2:
				case 3:
					var rotation = diff < 0 ? 1 : 3;break;
			}
			dirIndex2 = (dirIndex2 + rotation) % 4;

			var end = this._placeInWall(room2, dirIndex2);
			if (!end) {
				return false;
			}

			var mid = [0, 0];
			mid[index] = start[index];
			var index2 = (index + 1) % 2;
			mid[index2] = end[index2];
			this._digLine([start, mid, end]);
		} else {
			/* use current wall pair, but adjust the line in the middle (S-like) */

			var index2 = (index + 1) % 2;
			var end = this._placeInWall(room2, dirIndex2);
			if (!end) {
				return false;
			}
			var mid = Math.round((end[index2] + start[index2]) / 2);

			var mid1 = [0, 0];
			var mid2 = [0, 0];
			mid1[index] = start[index];
			mid1[index2] = mid;
			mid2[index] = end[index];
			mid2[index2] = mid;
			this._digLine([start, mid1, mid2, end]);
		}

		room1.addDoor(start[0], start[1]);
		room2.addDoor(end[0], end[1]);

		var index = this._unconnected.indexOf(room1);
		if (index != -1) {
			this._unconnected.splice(index, 1);
			this._connected.push(room1);
		}

		var index = this._unconnected.indexOf(room2);
		if (index != -1) {
			this._unconnected.splice(index, 1);
			this._connected.push(room2);
		}

		return true;
	};

	ROT.Map.Uniform.prototype._placeInWall = function (room, dirIndex) {
		var start = [0, 0];
		var dir = [0, 0];
		var length = 0;

		switch (dirIndex) {
			case 0:
				dir = [1, 0];
				start = [room.getLeft(), room.getTop() - 1];
				length = room.getRight() - room.getLeft() + 1;
				break;
			case 1:
				dir = [0, 1];
				start = [room.getRight() + 1, room.getTop()];
				length = room.getBottom() - room.getTop() + 1;
				break;
			case 2:
				dir = [1, 0];
				start = [room.getLeft(), room.getBottom() + 1];
				length = room.getRight() - room.getLeft() + 1;
				break;
			case 3:
				dir = [0, 1];
				start = [room.getLeft() - 1, room.getTop()];
				length = room.getBottom() - room.getTop() + 1;
				break;
		}

		var avail = [];
		var lastBadIndex = -2;

		for (var i = 0; i < length; i++) {
			var x = start[0] + i * dir[0];
			var y = start[1] + i * dir[1];
			avail.push(null);

			var isWall = this._map[x][y] == 1;
			if (isWall) {
				if (lastBadIndex != i - 1) {
					avail[i] = [x, y];
				}
			} else {
				lastBadIndex = i;
				if (i) {
					avail[i - 1] = null;
				}
			}
		}

		for (var i = avail.length - 1; i >= 0; i--) {
			if (!avail[i]) {
				avail.splice(i, 1);
			}
		}
		return avail.length ? avail.random() : null;
	};

	/**
  * Dig a polyline.
  */
	ROT.Map.Uniform.prototype._digLine = function (points) {
		for (var i = 1; i < points.length; i++) {
			var start = points[i - 1];
			var end = points[i];
			var corridor = new ROT.Map.Feature.Corridor(start[0], start[1], end[0], end[1]);
			corridor.create(this._digCallback);
			this._corridors.push(corridor);
		}
	};

	ROT.Map.Uniform.prototype._digCallback = function (x, y, value) {
		this._map[x][y] = value;
		if (value == 0) {
			this._dug++;
		}
	};

	ROT.Map.Uniform.prototype._isWallCallback = function (x, y) {
		if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
			return false;
		}
		return this._map[x][y] == 1;
	};

	ROT.Map.Uniform.prototype._canBeDugCallback = function (x, y) {
		if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
			return false;
		}
		return this._map[x][y] == 1;
	};

	/**
  * @author hyakugei
  * @class Dungeon generator which uses the "orginal" Rogue dungeon generation algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
  * @augments ROT.Map
  * @param {int} [width=ROT.DEFAULT_WIDTH]
  * @param {int} [height=ROT.DEFAULT_HEIGHT]
  * @param {object} [options] Options
  * @param {int[]} [options.cellWidth=3] Number of cells to create on the horizontal (number of rooms horizontally)
  * @param {int[]} [options.cellHeight=3] Number of cells to create on the vertical (number of rooms vertically)
  * @param {int} [options.roomWidth] Room min and max width - normally set auto-magically via the constructor.
  * @param {int} [options.roomHeight] Room min and max height - normally set auto-magically via the constructor.
  */
	ROT.Map.Rogue = function (width, height, options) {
		ROT.Map.call(this, width, height);

		this._options = {
			cellWidth: 3, // NOTE to self, these could probably work the same as the roomWidth/room Height values
			cellHeight: 3 //     ie. as an array with min-max values for each direction....
		};

		for (var p in options) {
			this._options[p] = options[p];
		}

		/*
  Set the room sizes according to the over-all width of the map,
  and the cell sizes.
  */
		if (!this._options.hasOwnProperty("roomWidth")) {
			this._options["roomWidth"] = this._calculateRoomSize(this._width, this._options["cellWidth"]);
		}
		if (!this._options.hasOwnProperty("roomHeight")) {
			this._options["roomHeight"] = this._calculateRoomSize(this._height, this._options["cellHeight"]);
		}
	};

	ROT.Map.Rogue.extend(ROT.Map);

	/**
  * @see ROT.Map#create
  */
	ROT.Map.Rogue.prototype.create = function (callback) {
		this.map = this._fillMap(1);
		this.rooms = [];
		this.connectedCells = [];

		this._initRooms();
		this._connectRooms();
		this._connectUnconnectedRooms();
		this._createRandomRoomConnections();
		this._createRooms();
		this._createCorridors();

		if (callback) {
			for (var i = 0; i < this._width; i++) {
				for (var j = 0; j < this._height; j++) {
					callback(i, j, this.map[i][j]);
				}
			}
		}

		return this;
	};

	ROT.Map.Rogue.prototype._calculateRoomSize = function (size, cell) {
		var max = Math.floor(size / cell * 0.8);
		var min = Math.floor(size / cell * 0.25);
		if (min < 2) {
			min = 2;
		}
		if (max < 2) {
			max = 2;
		}
		return [min, max];
	};

	ROT.Map.Rogue.prototype._initRooms = function () {
		// create rooms array. This is the "grid" list from the algo.
		for (var i = 0; i < this._options.cellWidth; i++) {
			this.rooms.push([]);
			for (var j = 0; j < this._options.cellHeight; j++) {
				this.rooms[i].push({ "x": 0, "y": 0, "width": 0, "height": 0, "connections": [], "cellx": i, "celly": j });
			}
		}
	};

	ROT.Map.Rogue.prototype._connectRooms = function () {
		//pick random starting grid
		var cgx = ROT.RNG.getUniformInt(0, this._options.cellWidth - 1);
		var cgy = ROT.RNG.getUniformInt(0, this._options.cellHeight - 1);

		var idx;
		var ncgx;
		var ncgy;

		var found = false;
		var room;
		var otherRoom;

		// find  unconnected neighbour cells
		do {

			//var dirToCheck = [0, 1, 2, 3, 4, 5, 6, 7];
			var dirToCheck = [0, 2, 4, 6];
			dirToCheck = dirToCheck.randomize();

			do {
				found = false;
				idx = dirToCheck.pop();

				ncgx = cgx + ROT.DIRS[8][idx][0];
				ncgy = cgy + ROT.DIRS[8][idx][1];

				if (ncgx < 0 || ncgx >= this._options.cellWidth) {
					continue;
				}
				if (ncgy < 0 || ncgy >= this._options.cellHeight) {
					continue;
				}

				room = this.rooms[cgx][cgy];

				if (room["connections"].length > 0) {
					// as long as this room doesn't already coonect to me, we are ok with it.
					if (room["connections"][0][0] == ncgx && room["connections"][0][1] == ncgy) {
						break;
					}
				}

				otherRoom = this.rooms[ncgx][ncgy];

				if (otherRoom["connections"].length == 0) {
					otherRoom["connections"].push([cgx, cgy]);

					this.connectedCells.push([ncgx, ncgy]);
					cgx = ncgx;
					cgy = ncgy;
					found = true;
				}
			} while (dirToCheck.length > 0 && found == false);
		} while (dirToCheck.length > 0);
	};

	ROT.Map.Rogue.prototype._connectUnconnectedRooms = function () {
		//While there are unconnected rooms, try to connect them to a random connected neighbor
		//(if a room has no connected neighbors yet, just keep cycling, you'll fill out to it eventually).
		var cw = this._options.cellWidth;
		var ch = this._options.cellHeight;

		this.connectedCells = this.connectedCells.randomize();
		var room;
		var otherRoom;
		var validRoom;

		for (var i = 0; i < this._options.cellWidth; i++) {
			for (var j = 0; j < this._options.cellHeight; j++) {

				room = this.rooms[i][j];

				if (room["connections"].length == 0) {
					var directions = [0, 2, 4, 6];
					directions = directions.randomize();

					validRoom = false;

					do {

						var dirIdx = directions.pop();
						var newI = i + ROT.DIRS[8][dirIdx][0];
						var newJ = j + ROT.DIRS[8][dirIdx][1];

						if (newI < 0 || newI >= cw || newJ < 0 || newJ >= ch) {
							continue;
						}

						otherRoom = this.rooms[newI][newJ];

						validRoom = true;

						if (otherRoom["connections"].length == 0) {
							break;
						}

						for (var k = 0; k < otherRoom["connections"].length; k++) {
							if (otherRoom["connections"][k][0] == i && otherRoom["connections"][k][1] == j) {
								validRoom = false;
								break;
							}
						}

						if (validRoom) {
							break;
						}
					} while (directions.length);

					if (validRoom) {
						room["connections"].push([otherRoom["cellx"], otherRoom["celly"]]);
					} else {
						console.log("-- Unable to connect room.");
					}
				}
			}
		}
	};

	ROT.Map.Rogue.prototype._createRandomRoomConnections = function (connections) {
		// Empty for now.
	};

	ROT.Map.Rogue.prototype._createRooms = function () {
		// Create Rooms

		var w = this._width;
		var h = this._height;

		var cw = this._options.cellWidth;
		var ch = this._options.cellHeight;

		var cwp = Math.floor(this._width / cw);
		var chp = Math.floor(this._height / ch);

		var roomw;
		var roomh;
		var roomWidth = this._options["roomWidth"];
		var roomHeight = this._options["roomHeight"];
		var sx;
		var sy;
		var otherRoom;

		for (var i = 0; i < cw; i++) {
			for (var j = 0; j < ch; j++) {
				sx = cwp * i;
				sy = chp * j;

				if (sx == 0) {
					sx = 1;
				}
				if (sy == 0) {
					sy = 1;
				}

				roomw = ROT.RNG.getUniformInt(roomWidth[0], roomWidth[1]);
				roomh = ROT.RNG.getUniformInt(roomHeight[0], roomHeight[1]);

				if (j > 0) {
					otherRoom = this.rooms[i][j - 1];
					while (sy - (otherRoom["y"] + otherRoom["height"]) < 3) {
						sy++;
					}
				}

				if (i > 0) {
					otherRoom = this.rooms[i - 1][j];
					while (sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
						sx++;
					}
				}

				var sxOffset = Math.round(ROT.RNG.getUniformInt(0, cwp - roomw) / 2);
				var syOffset = Math.round(ROT.RNG.getUniformInt(0, chp - roomh) / 2);

				while (sx + sxOffset + roomw >= w) {
					if (sxOffset) {
						sxOffset--;
					} else {
						roomw--;
					}
				}

				while (sy + syOffset + roomh >= h) {
					if (syOffset) {
						syOffset--;
					} else {
						roomh--;
					}
				}

				sx = sx + sxOffset;
				sy = sy + syOffset;

				this.rooms[i][j]["x"] = sx;
				this.rooms[i][j]["y"] = sy;
				this.rooms[i][j]["width"] = roomw;
				this.rooms[i][j]["height"] = roomh;

				for (var ii = sx; ii < sx + roomw; ii++) {
					for (var jj = sy; jj < sy + roomh; jj++) {
						this.map[ii][jj] = 0;
					}
				}
			}
		}
	};

	ROT.Map.Rogue.prototype._getWallPosition = function (aRoom, aDirection) {
		var rx;
		var ry;
		var door;

		if (aDirection == 1 || aDirection == 3) {
			rx = ROT.RNG.getUniformInt(aRoom["x"] + 1, aRoom["x"] + aRoom["width"] - 2);
			if (aDirection == 1) {
				ry = aRoom["y"] - 2;
				door = ry + 1;
			} else {
				ry = aRoom["y"] + aRoom["height"] + 1;
				door = ry - 1;
			}

			this.map[rx][door] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
		} else if (aDirection == 2 || aDirection == 4) {
			ry = ROT.RNG.getUniformInt(aRoom["y"] + 1, aRoom["y"] + aRoom["height"] - 2);
			if (aDirection == 2) {
				rx = aRoom["x"] + aRoom["width"] + 1;
				door = rx - 1;
			} else {
				rx = aRoom["x"] - 2;
				door = rx + 1;
			}

			this.map[door][ry] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
		}
		return [rx, ry];
	};

	/***
 * @param startPosition a 2 element array
 * @param endPosition a 2 element array
 */
	ROT.Map.Rogue.prototype._drawCorridor = function (startPosition, endPosition) {
		var xOffset = endPosition[0] - startPosition[0];
		var yOffset = endPosition[1] - startPosition[1];

		var xpos = startPosition[0];
		var ypos = startPosition[1];

		var tempDist;
		var xDir;
		var yDir;

		var move; // 2 element array, element 0 is the direction, element 1 is the total value to move.
		var moves = []; // a list of 2 element arrays

		var xAbs = Math.abs(xOffset);
		var yAbs = Math.abs(yOffset);

		var percent = ROT.RNG.getUniform(); // used to split the move at different places along the long axis
		var firstHalf = percent;
		var secondHalf = 1 - percent;

		xDir = xOffset > 0 ? 2 : 6;
		yDir = yOffset > 0 ? 4 : 0;

		if (xAbs < yAbs) {
			// move firstHalf of the y offset
			tempDist = Math.ceil(yAbs * firstHalf);
			moves.push([yDir, tempDist]);
			// move all the x offset
			moves.push([xDir, xAbs]);
			// move sendHalf of the  y offset
			tempDist = Math.floor(yAbs * secondHalf);
			moves.push([yDir, tempDist]);
		} else {
			//  move firstHalf of the x offset
			tempDist = Math.ceil(xAbs * firstHalf);
			moves.push([xDir, tempDist]);
			// move all the y offset
			moves.push([yDir, yAbs]);
			// move secondHalf of the x offset.
			tempDist = Math.floor(xAbs * secondHalf);
			moves.push([xDir, tempDist]);
		}

		this.map[xpos][ypos] = 0;

		while (moves.length > 0) {
			move = moves.pop();
			while (move[1] > 0) {
				xpos += ROT.DIRS[8][move[0]][0];
				ypos += ROT.DIRS[8][move[0]][1];
				this.map[xpos][ypos] = 0;
				move[1] = move[1] - 1;
			}
		}
	};

	ROT.Map.Rogue.prototype._createCorridors = function () {
		// Draw Corridors between connected rooms

		var cw = this._options.cellWidth;
		var ch = this._options.cellHeight;
		var room;
		var connection;
		var otherRoom;
		var wall;
		var otherWall;

		for (var i = 0; i < cw; i++) {
			for (var j = 0; j < ch; j++) {
				room = this.rooms[i][j];

				for (var k = 0; k < room["connections"].length; k++) {

					connection = room["connections"][k];

					otherRoom = this.rooms[connection[0]][connection[1]];

					// figure out what wall our corridor will start one.
					// figure out what wall our corridor will end on.
					if (otherRoom["cellx"] > room["cellx"]) {
						wall = 2;
						otherWall = 4;
					} else if (otherRoom["cellx"] < room["cellx"]) {
						wall = 4;
						otherWall = 2;
					} else if (otherRoom["celly"] > room["celly"]) {
						wall = 3;
						otherWall = 1;
					} else if (otherRoom["celly"] < room["celly"]) {
						wall = 1;
						otherWall = 3;
					}

					this._drawCorridor(this._getWallPosition(room, wall), this._getWallPosition(otherRoom, otherWall));
				}
			}
		}
	};
	/**
  * @class Dungeon feature; has own .create() method
  */
	ROT.Map.Feature = function () {};
	ROT.Map.Feature.prototype.isValid = function (canBeDugCallback) {};
	ROT.Map.Feature.prototype.create = function (digCallback) {};
	ROT.Map.Feature.prototype.debug = function () {};
	ROT.Map.Feature.createRandomAt = function (x, y, dx, dy, options) {};

	/**
  * @class Room
  * @augments ROT.Map.Feature
  * @param {int} x1
  * @param {int} y1
  * @param {int} x2
  * @param {int} y2
  * @param {int} [doorX]
  * @param {int} [doorY]
  */
	ROT.Map.Feature.Room = function (x1, y1, x2, y2, doorX, doorY) {
		this._x1 = x1;
		this._y1 = y1;
		this._x2 = x2;
		this._y2 = y2;
		this._doors = {};
		if (arguments.length > 4) {
			this.addDoor(doorX, doorY);
		}
	};
	ROT.Map.Feature.Room.extend(ROT.Map.Feature);

	/**
  * Room of random size, with a given doors and direction
  */
	ROT.Map.Feature.Room.createRandomAt = function (x, y, dx, dy, options) {
		var min = options.roomWidth[0];
		var max = options.roomWidth[1];
		var width = ROT.RNG.getUniformInt(min, max);

		var min = options.roomHeight[0];
		var max = options.roomHeight[1];
		var height = ROT.RNG.getUniformInt(min, max);

		if (dx == 1) {
			/* to the right */
			var y2 = y - Math.floor(ROT.RNG.getUniform() * height);
			return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
		}

		if (dx == -1) {
			/* to the left */
			var y2 = y - Math.floor(ROT.RNG.getUniform() * height);
			return new this(x - width, y2, x - 1, y2 + height - 1, x, y);
		}

		if (dy == 1) {
			/* to the bottom */
			var x2 = x - Math.floor(ROT.RNG.getUniform() * width);
			return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
		}

		if (dy == -1) {
			/* to the top */
			var x2 = x - Math.floor(ROT.RNG.getUniform() * width);
			return new this(x2, y - height, x2 + width - 1, y - 1, x, y);
		}

		throw new Error("dx or dy must be 1 or -1");
	};

	/**
  * Room of random size, positioned around center coords
  */
	ROT.Map.Feature.Room.createRandomCenter = function (cx, cy, options) {
		var min = options.roomWidth[0];
		var max = options.roomWidth[1];
		var width = ROT.RNG.getUniformInt(min, max);

		var min = options.roomHeight[0];
		var max = options.roomHeight[1];
		var height = ROT.RNG.getUniformInt(min, max);

		var x1 = cx - Math.floor(ROT.RNG.getUniform() * width);
		var y1 = cy - Math.floor(ROT.RNG.getUniform() * height);
		var x2 = x1 + width - 1;
		var y2 = y1 + height - 1;

		return new this(x1, y1, x2, y2);
	};

	/**
  * Room of random size within a given dimensions
  */
	ROT.Map.Feature.Room.createRandom = function (availWidth, availHeight, options) {
		var min = options.roomWidth[0];
		var max = options.roomWidth[1];
		var width = ROT.RNG.getUniformInt(min, max);

		var min = options.roomHeight[0];
		var max = options.roomHeight[1];
		var height = ROT.RNG.getUniformInt(min, max);

		var left = availWidth - width - 1;
		var top = availHeight - height - 1;

		var x1 = 1 + Math.floor(ROT.RNG.getUniform() * left);
		var y1 = 1 + Math.floor(ROT.RNG.getUniform() * top);
		var x2 = x1 + width - 1;
		var y2 = y1 + height - 1;

		return new this(x1, y1, x2, y2);
	};

	ROT.Map.Feature.Room.prototype.addDoor = function (x, y) {
		this._doors[x + "," + y] = 1;
		return this;
	};

	/**
  * @param {function}
  */
	ROT.Map.Feature.Room.prototype.getDoors = function (callback) {
		for (var key in this._doors) {
			var parts = key.split(",");
			callback(parseInt(parts[0]), parseInt(parts[1]));
		}
		return this;
	};

	ROT.Map.Feature.Room.prototype.clearDoors = function () {
		this._doors = {};
		return this;
	};

	ROT.Map.Feature.Room.prototype.addDoors = function (isWallCallback) {
		var left = this._x1 - 1;
		var right = this._x2 + 1;
		var top = this._y1 - 1;
		var bottom = this._y2 + 1;

		for (var x = left; x <= right; x++) {
			for (var y = top; y <= bottom; y++) {
				if (x != left && x != right && y != top && y != bottom) {
					continue;
				}
				if (isWallCallback(x, y)) {
					continue;
				}

				this.addDoor(x, y);
			}
		}

		return this;
	};

	ROT.Map.Feature.Room.prototype.debug = function () {
		console.log("room", this._x1, this._y1, this._x2, this._y2);
	};

	ROT.Map.Feature.Room.prototype.isValid = function (isWallCallback, canBeDugCallback) {
		var left = this._x1 - 1;
		var right = this._x2 + 1;
		var top = this._y1 - 1;
		var bottom = this._y2 + 1;

		for (var x = left; x <= right; x++) {
			for (var y = top; y <= bottom; y++) {
				if (x == left || x == right || y == top || y == bottom) {
					if (!isWallCallback(x, y)) {
						return false;
					}
				} else {
					if (!canBeDugCallback(x, y)) {
						return false;
					}
				}
			}
		}

		return true;
	};

	/**
  * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
  */
	ROT.Map.Feature.Room.prototype.create = function (digCallback) {
		var left = this._x1 - 1;
		var right = this._x2 + 1;
		var top = this._y1 - 1;
		var bottom = this._y2 + 1;

		var value = 0;
		for (var x = left; x <= right; x++) {
			for (var y = top; y <= bottom; y++) {
				if (x + "," + y in this._doors) {
					value = 2;
				} else if (x == left || x == right || y == top || y == bottom) {
					value = 1;
				} else {
					value = 0;
				}
				digCallback(x, y, value);
			}
		}
	};

	ROT.Map.Feature.Room.prototype.getCenter = function () {
		return [Math.round((this._x1 + this._x2) / 2), Math.round((this._y1 + this._y2) / 2)];
	};

	ROT.Map.Feature.Room.prototype.getLeft = function () {
		return this._x1;
	};

	ROT.Map.Feature.Room.prototype.getRight = function () {
		return this._x2;
	};

	ROT.Map.Feature.Room.prototype.getTop = function () {
		return this._y1;
	};

	ROT.Map.Feature.Room.prototype.getBottom = function () {
		return this._y2;
	};

	/**
  * @class Corridor
  * @augments ROT.Map.Feature
  * @param {int} startX
  * @param {int} startY
  * @param {int} endX
  * @param {int} endY
  */
	ROT.Map.Feature.Corridor = function (startX, startY, endX, endY) {
		this._startX = startX;
		this._startY = startY;
		this._endX = endX;
		this._endY = endY;
		this._endsWithAWall = true;
	};
	ROT.Map.Feature.Corridor.extend(ROT.Map.Feature);

	ROT.Map.Feature.Corridor.createRandomAt = function (x, y, dx, dy, options) {
		var min = options.corridorLength[0];
		var max = options.corridorLength[1];
		var length = ROT.RNG.getUniformInt(min, max);

		return new this(x, y, x + dx * length, y + dy * length);
	};

	ROT.Map.Feature.Corridor.prototype.debug = function () {
		console.log("corridor", this._startX, this._startY, this._endX, this._endY);
	};

	ROT.Map.Feature.Corridor.prototype.isValid = function (isWallCallback, canBeDugCallback) {
		var sx = this._startX;
		var sy = this._startY;
		var dx = this._endX - sx;
		var dy = this._endY - sy;
		var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

		if (dx) {
			dx = dx / Math.abs(dx);
		}
		if (dy) {
			dy = dy / Math.abs(dy);
		}
		var nx = dy;
		var ny = -dx;

		var ok = true;
		for (var i = 0; i < length; i++) {
			var x = sx + i * dx;
			var y = sy + i * dy;

			if (!canBeDugCallback(x, y)) {
				ok = false;
			}
			if (!isWallCallback(x + nx, y + ny)) {
				ok = false;
			}
			if (!isWallCallback(x - nx, y - ny)) {
				ok = false;
			}

			if (!ok) {
				length = i;
				this._endX = x - dx;
				this._endY = y - dy;
				break;
			}
		}

		/**
   * If the length degenerated, this corridor might be invalid
   */

		/* not supported */
		if (length == 0) {
			return false;
		}

		/* length 1 allowed only if the next space is empty */
		if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
			return false;
		}

		/**
   * We do not want the corridor to crash into a corner of a room;
   * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
   * 
   * Situation:
   * #######1
   * .......?
   * #######2
   * 
   * The corridor was dug from left to right.
   * 1, 2 - problematic corners, ? = N+1th cell (not dug)
   */
		var firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
		var secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
		this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);
		if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) {
			return false;
		}

		return true;
	};

	/**
  * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
  */
	ROT.Map.Feature.Corridor.prototype.create = function (digCallback) {
		var sx = this._startX;
		var sy = this._startY;
		var dx = this._endX - sx;
		var dy = this._endY - sy;
		var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

		if (dx) {
			dx = dx / Math.abs(dx);
		}
		if (dy) {
			dy = dy / Math.abs(dy);
		}
		var nx = dy;
		var ny = -dx;

		for (var i = 0; i < length; i++) {
			var x = sx + i * dx;
			var y = sy + i * dy;
			digCallback(x, y, 0);
		}

		return true;
	};

	ROT.Map.Feature.Corridor.prototype.createPriorityWalls = function (priorityWallCallback) {
		if (!this._endsWithAWall) {
			return;
		}

		var sx = this._startX;
		var sy = this._startY;

		var dx = this._endX - sx;
		var dy = this._endY - sy;
		if (dx) {
			dx = dx / Math.abs(dx);
		}
		if (dy) {
			dy = dy / Math.abs(dy);
		}
		var nx = dy;
		var ny = -dx;

		priorityWallCallback(this._endX + dx, this._endY + dy);
		priorityWallCallback(this._endX + nx, this._endY + ny);
		priorityWallCallback(this._endX - nx, this._endY - ny);
	};
	/**
  * @class Base noise generator
  */
	ROT.Noise = function () {};

	ROT.Noise.prototype.get = function (x, y) {};
	/**
  * A simple 2d implementation of simplex noise by Ondrej Zara
  *
  * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
  * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
  * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
  * Better rank ordering method by Stefan Gustavson in 2012.
  */

	/**
  * @class 2D simplex noise generator
  * @param {int} [gradients=256] Random gradients
  */
	ROT.Noise.Simplex = function (gradients) {
		ROT.Noise.call(this);

		this._F2 = 0.5 * (Math.sqrt(3) - 1);
		this._G2 = (3 - Math.sqrt(3)) / 6;

		this._gradients = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

		var permutations = [];
		var count = gradients || 256;
		for (var i = 0; i < count; i++) {
			permutations.push(i);
		}
		permutations = permutations.randomize();

		this._perms = [];
		this._indexes = [];

		for (var i = 0; i < 2 * count; i++) {
			this._perms.push(permutations[i % count]);
			this._indexes.push(this._perms[i] % this._gradients.length);
		}
	};
	ROT.Noise.Simplex.extend(ROT.Noise);

	ROT.Noise.Simplex.prototype.get = function (xin, yin) {
		var perms = this._perms;
		var indexes = this._indexes;
		var count = perms.length / 2;
		var G2 = this._G2;

		var n0 = 0,
		    n1 = 0,
		    n2 = 0,
		    gi; // Noise contributions from the three corners

		// Skew the input space to determine which simplex cell we're in
		var s = (xin + yin) * this._F2; // Hairy factor for 2D
		var i = Math.floor(xin + s);
		var j = Math.floor(yin + s);
		var t = (i + j) * G2;
		var X0 = i - t; // Unskew the cell origin back to (x,y) space
		var Y0 = j - t;
		var x0 = xin - X0; // The x,y distances from the cell origin
		var y0 = yin - Y0;

		// For the 2D case, the simplex shape is an equilateral triangle.
		// Determine which simplex we are in.
		var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
		if (x0 > y0) {
			i1 = 1;
			j1 = 0;
		} else {
			// lower triangle, XY order: (0,0)->(1,0)->(1,1)
			i1 = 0;
			j1 = 1;
		} // upper triangle, YX order: (0,0)->(0,1)->(1,1)

		// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
		// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
		// c = (3-sqrt(3))/6
		var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
		var y1 = y0 - j1 + G2;
		var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
		var y2 = y0 - 1 + 2 * G2;

		// Work out the hashed gradient indices of the three simplex corners
		var ii = i.mod(count);
		var jj = j.mod(count);

		// Calculate the contribution from the three corners
		var t0 = 0.5 - x0 * x0 - y0 * y0;
		if (t0 >= 0) {
			t0 *= t0;
			gi = indexes[ii + perms[jj]];
			var grad = this._gradients[gi];
			n0 = t0 * t0 * (grad[0] * x0 + grad[1] * y0);
		}

		var t1 = 0.5 - x1 * x1 - y1 * y1;
		if (t1 >= 0) {
			t1 *= t1;
			gi = indexes[ii + i1 + perms[jj + j1]];
			var grad = this._gradients[gi];
			n1 = t1 * t1 * (grad[0] * x1 + grad[1] * y1);
		}

		var t2 = 0.5 - x2 * x2 - y2 * y2;
		if (t2 >= 0) {
			t2 *= t2;
			gi = indexes[ii + 1 + perms[jj + 1]];
			var grad = this._gradients[gi];
			n2 = t2 * t2 * (grad[0] * x2 + grad[1] * y2);
		}

		// Add contributions from each corner to get the final noise value.
		// The result is scaled to return values in the interval [-1,1].
		return 70 * (n0 + n1 + n2);
	};
	/**
  * @class Abstract FOV algorithm
  * @param {function} lightPassesCallback Does the light pass through x,y?
  * @param {object} [options]
  * @param {int} [options.topology=8] 4/6/8
  */
	ROT.FOV = function (lightPassesCallback, options) {
		this._lightPasses = lightPassesCallback;
		this._options = {
			topology: 8
		};
		for (var p in options) {
			this._options[p] = options[p];
		}
	};

	/**
  * Compute visibility for a 360-degree circle
  * @param {int} x
  * @param {int} y
  * @param {int} R Maximum visibility radius
  * @param {function} callback
  */
	ROT.FOV.prototype.compute = function (x, y, R, callback) {};

	/**
  * Return all neighbors in a concentric ring
  * @param {int} cx center-x
  * @param {int} cy center-y
  * @param {int} r range
  */
	ROT.FOV.prototype._getCircle = function (cx, cy, r) {
		var result = [];
		var dirs, countFactor, startOffset;

		switch (this._options.topology) {
			case 4:
				countFactor = 1;
				startOffset = [0, 1];
				dirs = [ROT.DIRS[8][7], ROT.DIRS[8][1], ROT.DIRS[8][3], ROT.DIRS[8][5]];
				break;

			case 6:
				dirs = ROT.DIRS[6];
				countFactor = 1;
				startOffset = [-1, 1];
				break;

			case 8:
				dirs = ROT.DIRS[4];
				countFactor = 2;
				startOffset = [-1, 1];
				break;
		}

		/* starting neighbor */
		var x = cx + startOffset[0] * r;
		var y = cy + startOffset[1] * r;

		/* circle */
		for (var i = 0; i < dirs.length; i++) {
			for (var j = 0; j < r * countFactor; j++) {
				result.push([x, y]);
				x += dirs[i][0];
				y += dirs[i][1];
			}
		}

		return result;
	};
	/**
  * @class Discrete shadowcasting algorithm. Obsoleted by Precise shadowcasting.
  * @augments ROT.FOV
  */
	ROT.FOV.DiscreteShadowcasting = function (lightPassesCallback, options) {
		ROT.FOV.call(this, lightPassesCallback, options);
	};
	ROT.FOV.DiscreteShadowcasting.extend(ROT.FOV);

	/**
  * @see ROT.FOV#compute
  */
	ROT.FOV.DiscreteShadowcasting.prototype.compute = function (x, y, R, callback) {
		var center = this._coords;
		var map = this._map;

		/* this place is always visible */
		callback(x, y, 0, 1);

		/* standing in a dark place. FIXME is this a good idea?  */
		if (!this._lightPasses(x, y)) {
			return;
		}

		/* start and end angles */
		var DATA = [];

		var A, B, cx, cy, blocks;

		/* analyze surrounding cells in concentric rings, starting from the center */
		for (var r = 1; r <= R; r++) {
			var neighbors = this._getCircle(x, y, r);
			var angle = 360 / neighbors.length;

			for (var i = 0; i < neighbors.length; i++) {
				cx = neighbors[i][0];
				cy = neighbors[i][1];
				A = angle * (i - 0.5);
				B = A + angle;

				blocks = !this._lightPasses(cx, cy);
				if (this._visibleCoords(Math.floor(A), Math.ceil(B), blocks, DATA)) {
					callback(cx, cy, r, 1);
				}

				if (DATA.length == 2 && DATA[0] == 0 && DATA[1] == 360) {
					return;
				} /* cutoff? */
			} /* for all cells in this ring */
		} /* for all rings */
	};

	/**
  * @param {int} A start angle
  * @param {int} B end angle
  * @param {bool} blocks Does current cell block visibility?
  * @param {int[][]} DATA shadowed angle pairs
  */
	ROT.FOV.DiscreteShadowcasting.prototype._visibleCoords = function (A, B, blocks, DATA) {
		if (A < 0) {
			var v1 = arguments.callee(0, B, blocks, DATA);
			var v2 = arguments.callee(360 + A, 360, blocks, DATA);
			return v1 || v2;
		}

		var index = 0;
		while (index < DATA.length && DATA[index] < A) {
			index++;
		}

		if (index == DATA.length) {
			/* completely new shadow */
			if (blocks) {
				DATA.push(A, B);
			}
			return true;
		}

		var count = 0;

		if (index % 2) {
			/* this shadow starts in an existing shadow, or within its ending boundary */
			while (index < DATA.length && DATA[index] < B) {
				index++;
				count++;
			}

			if (count == 0) {
				return false;
			}

			if (blocks) {
				if (count % 2) {
					DATA.splice(index - count, count, B);
				} else {
					DATA.splice(index - count, count);
				}
			}

			return true;
		} else {
			/* this shadow starts outside an existing shadow, or within a starting boundary */
			while (index < DATA.length && DATA[index] < B) {
				index++;
				count++;
			}

			/* visible when outside an existing shadow, or when overlapping */
			if (A == DATA[index - count] && count == 1) {
				return false;
			}

			if (blocks) {
				if (count % 2) {
					DATA.splice(index - count, count, A);
				} else {
					DATA.splice(index - count, count, A, B);
				}
			}

			return true;
		}
	};
	/**
  * @class Precise shadowcasting algorithm
  * @augments ROT.FOV
  */
	ROT.FOV.PreciseShadowcasting = function (lightPassesCallback, options) {
		ROT.FOV.call(this, lightPassesCallback, options);
	};
	ROT.FOV.PreciseShadowcasting.extend(ROT.FOV);

	/**
  * @see ROT.FOV#compute
  */
	ROT.FOV.PreciseShadowcasting.prototype.compute = function (x, y, R, callback) {
		/* this place is always visible */
		callback(x, y, 0, 1);

		/* standing in a dark place. FIXME is this a good idea?  */
		if (!this._lightPasses(x, y)) {
			return;
		}

		/* list of all shadows */
		var SHADOWS = [];

		var cx, cy, blocks, A1, A2, visibility;

		/* analyze surrounding cells in concentric rings, starting from the center */
		for (var r = 1; r <= R; r++) {
			var neighbors = this._getCircle(x, y, r);
			var neighborCount = neighbors.length;

			for (var i = 0; i < neighborCount; i++) {
				cx = neighbors[i][0];
				cy = neighbors[i][1];
				/* shift half-an-angle backwards to maintain consistency of 0-th cells */
				A1 = [i ? 2 * i - 1 : 2 * neighborCount - 1, 2 * neighborCount];
				A2 = [2 * i + 1, 2 * neighborCount];

				blocks = !this._lightPasses(cx, cy);
				visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);
				if (visibility) {
					callback(cx, cy, r, visibility);
				}

				if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) {
					return;
				} /* cutoff? */
			} /* for all cells in this ring */
		} /* for all rings */
	};

	/**
  * @param {int[2]} A1 arc start
  * @param {int[2]} A2 arc end
  * @param {bool} blocks Does current arc block visibility?
  * @param {int[][]} SHADOWS list of active shadows
  */
	ROT.FOV.PreciseShadowcasting.prototype._checkVisibility = function (A1, A2, blocks, SHADOWS) {
		if (A1[0] > A2[0]) {
			/* split into two sub-arcs */
			var v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);
			var v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);
			return (v1 + v2) / 2;
		}

		/* index1: first shadow >= A1 */
		var index1 = 0,
		    edge1 = false;
		while (index1 < SHADOWS.length) {
			var old = SHADOWS[index1];
			var diff = old[0] * A1[1] - A1[0] * old[1];
			if (diff >= 0) {
				/* old >= A1 */
				if (diff == 0 && !(index1 % 2)) {
					edge1 = true;
				}
				break;
			}
			index1++;
		}

		/* index2: last shadow <= A2 */
		var index2 = SHADOWS.length,
		    edge2 = false;
		while (index2--) {
			var old = SHADOWS[index2];
			var diff = A2[0] * old[1] - old[0] * A2[1];
			if (diff >= 0) {
				/* old <= A2 */
				if (diff == 0 && index2 % 2) {
					edge2 = true;
				}
				break;
			}
		}

		var visible = true;
		if (index1 == index2 && (edge1 || edge2)) {
			/* subset of existing shadow, one of the edges match */
			visible = false;
		} else if (edge1 && edge2 && index1 + 1 == index2 && index2 % 2) {
			/* completely equivalent with existing shadow */
			visible = false;
		} else if (index1 > index2 && index1 % 2) {
			/* subset of existing shadow, not touching */
			visible = false;
		}

		if (!visible) {
			return 0;
		} /* fast case: not visible */

		var visibleLength, P;

		/* compute the length of visible arc, adjust list of shadows (if blocking) */
		var remove = index2 - index1 + 1;
		if (remove % 2) {
			if (index1 % 2) {
				/* first edge within existing shadow, second outside */
				var P = SHADOWS[index1];
				visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);
				if (blocks) {
					SHADOWS.splice(index1, remove, A2);
				}
			} else {
				/* second edge within existing shadow, first outside */
				var P = SHADOWS[index2];
				visibleLength = (P[0] * A1[1] - A1[0] * P[1]) / (A1[1] * P[1]);
				if (blocks) {
					SHADOWS.splice(index1, remove, A1);
				}
			}
		} else {
			if (index1 % 2) {
				/* both edges within existing shadows */
				var P1 = SHADOWS[index1];
				var P2 = SHADOWS[index2];
				visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);
				if (blocks) {
					SHADOWS.splice(index1, remove);
				}
			} else {
				/* both edges outside existing shadows */
				if (blocks) {
					SHADOWS.splice(index1, remove, A1, A2);
				}
				return 1; /* whole arc visible! */
			}
		}

		var arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);

		return visibleLength / arcLength;
	};
	/**
  * @class Recursive shadowcasting algorithm
  * Currently only supports 4/8 topologies, not hexagonal.
  * Based on Peter Harkins' implementation of Björn Bergström's algorithm described here: http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
  * @augments ROT.FOV
  */
	ROT.FOV.RecursiveShadowcasting = function (lightPassesCallback, options) {
		ROT.FOV.call(this, lightPassesCallback, options);
	};
	ROT.FOV.RecursiveShadowcasting.extend(ROT.FOV);

	/** Octants used for translating recursive shadowcasting offsets */
	ROT.FOV.RecursiveShadowcasting.OCTANTS = [[-1, 0, 0, 1], [0, -1, 1, 0], [0, -1, -1, 0], [-1, 0, 0, -1], [1, 0, 0, -1], [0, 1, -1, 0], [0, 1, 1, 0], [1, 0, 0, 1]];

	/**
  * Compute visibility for a 360-degree circle
  * @param {int} x
  * @param {int} y
  * @param {int} R Maximum visibility radius
  * @param {function} callback
  */
	ROT.FOV.RecursiveShadowcasting.prototype.compute = function (x, y, R, callback) {
		//You can always see your own tile
		callback(x, y, 0, 1);
		for (var i = 0; i < ROT.FOV.RecursiveShadowcasting.OCTANTS.length; i++) {
			this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[i], R, callback);
		}
	};

	/**
  * Compute visibility for a 180-degree arc
  * @param {int} x
  * @param {int} y
  * @param {int} R Maximum visibility radius
  * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
  * @param {function} callback
  */
	ROT.FOV.RecursiveShadowcasting.prototype.compute180 = function (x, y, R, dir, callback) {
		//You can always see your own tile
		callback(x, y, 0, 1);
		var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 180 degrees
		var nextPreviousOctant = (dir - 2 + 8) % 8; //Need to retrieve the previous two octants to render a full 180 degrees
		var nextOctant = (dir + 1 + 8) % 8; //Need to grab to next octant to render a full 180 degrees
		this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[nextPreviousOctant], R, callback);
		this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[previousOctant], R, callback);
		this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[dir], R, callback);
		this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[nextOctant], R, callback);
	};

	/**
  * Compute visibility for a 90-degree arc
  * @param {int} x
  * @param {int} y
  * @param {int} R Maximum visibility radius
  * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
  * @param {function} callback
  */
	ROT.FOV.RecursiveShadowcasting.prototype.compute90 = function (x, y, R, dir, callback) {
		//You can always see your own tile
		callback(x, y, 0, 1);
		var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 90 degrees
		this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[dir], R, callback);
		this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[previousOctant], R, callback);
	};

	/**
  * Render one octant (45-degree arc) of the viewshed
  * @param {int} x
  * @param {int} y
  * @param {int} octant Octant to be rendered
  * @param {int} R Maximum visibility radius
  * @param {function} callback
  */
	ROT.FOV.RecursiveShadowcasting.prototype._renderOctant = function (x, y, octant, R, callback) {
		//Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
		this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback);
	};

	/**
  * Actually calculates the visibility
  * @param {int} startX The starting X coordinate
  * @param {int} startY The starting Y coordinate
  * @param {int} row The row to render
  * @param {float} visSlopeStart The slope to start at
  * @param {float} visSlopeEnd The slope to end at
  * @param {int} radius The radius to reach out to
  * @param {int} xx 
  * @param {int} xy 
  * @param {int} yx 
  * @param {int} yy 
  * @param {function} callback The callback to use when we hit a block that is visible
  */
	ROT.FOV.RecursiveShadowcasting.prototype._castVisibility = function (startX, startY, row, visSlopeStart, visSlopeEnd, radius, xx, xy, yx, yy, callback) {
		if (visSlopeStart < visSlopeEnd) {
			return;
		}
		for (var i = row; i <= radius; i++) {
			var dx = -i - 1;
			var dy = -i;
			var blocked = false;
			var newStart = 0;

			//'Row' could be column, names here assume octant 0 and would be flipped for half the octants
			while (dx <= 0) {
				dx += 1;

				//Translate from relative coordinates to map coordinates
				var mapX = startX + dx * xx + dy * xy;
				var mapY = startY + dx * yx + dy * yy;

				//Range of the row
				var slopeStart = (dx - 0.5) / (dy + 0.5);
				var slopeEnd = (dx + 0.5) / (dy - 0.5);

				//Ignore if not yet at left edge of Octant
				if (slopeEnd > visSlopeStart) {
					continue;
				}

				//Done if past right edge
				if (slopeStart < visSlopeEnd) {
					break;
				}

				//If it's in range, it's visible
				if (dx * dx + dy * dy < radius * radius) {
					callback(mapX, mapY, i, 1);
				}

				if (!blocked) {
					//If tile is a blocking tile, cast around it
					if (!this._lightPasses(mapX, mapY) && i < radius) {
						blocked = true;
						this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback);
						newStart = slopeEnd;
					}
				} else {
					//Keep narrowing if scanning across a block
					if (!this._lightPasses(mapX, mapY)) {
						newStart = slopeEnd;
						continue;
					}

					//Block has ended
					blocked = false;
					visSlopeStart = newStart;
				}
			}
			if (blocked) {
				break;
			}
		}
	};
	/**
  * @namespace Color operations
  */
	ROT.Color = {
		fromString: function fromString(str) {
			var cached, r;
			if (str in this._cache) {
				cached = this._cache[str];
			} else {
				if (str.charAt(0) == "#") {
					/* hex rgb */

					var values = str.match(/[0-9a-f]/gi).map(function (x) {
						return parseInt(x, 16);
					});
					if (values.length == 3) {
						cached = values.map(function (x) {
							return x * 17;
						});
					} else {
						for (var i = 0; i < 3; i++) {
							values[i + 1] += 16 * values[i];
							values.splice(i, 1);
						}
						cached = values;
					}
				} else if (r = str.match(/rgb\(([0-9, ]+)\)/i)) {
					/* decimal rgb */
					cached = r[1].split(/\s*,\s*/).map(function (x) {
						return parseInt(x);
					});
				} else {
					/* html name */
					cached = [0, 0, 0];
				}

				this._cache[str] = cached;
			}

			return cached.slice();
		},

		/**
   * Add two or more colors
   * @param {number[]} color1
   * @param {number[]} color2
   * @returns {number[]}
   */
		add: function add(color1, color2) {
			var result = color1.slice();
			for (var i = 0; i < 3; i++) {
				for (var j = 1; j < arguments.length; j++) {
					result[i] += arguments[j][i];
				}
			}
			return result;
		},

		/**
   * Add two or more colors, MODIFIES FIRST ARGUMENT
   * @param {number[]} color1
   * @param {number[]} color2
   * @returns {number[]}
   */
		add_: function add_(color1, color2) {
			for (var i = 0; i < 3; i++) {
				for (var j = 1; j < arguments.length; j++) {
					color1[i] += arguments[j][i];
				}
			}
			return color1;
		},

		/**
   * Multiply (mix) two or more colors
   * @param {number[]} color1
   * @param {number[]} color2
   * @returns {number[]}
   */
		multiply: function multiply(color1, color2) {
			var result = color1.slice();
			for (var i = 0; i < 3; i++) {
				for (var j = 1; j < arguments.length; j++) {
					result[i] *= arguments[j][i] / 255;
				}
				result[i] = Math.round(result[i]);
			}
			return result;
		},

		/**
   * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
   * @param {number[]} color1
   * @param {number[]} color2
   * @returns {number[]}
   */
		multiply_: function multiply_(color1, color2) {
			for (var i = 0; i < 3; i++) {
				for (var j = 1; j < arguments.length; j++) {
					color1[i] *= arguments[j][i] / 255;
				}
				color1[i] = Math.round(color1[i]);
			}
			return color1;
		},

		/**
   * Interpolate (blend) two colors with a given factor
   * @param {number[]} color1
   * @param {number[]} color2
   * @param {float} [factor=0.5] 0..1
   * @returns {number[]}
   */
		interpolate: function interpolate(color1, color2, factor) {
			if (arguments.length < 3) {
				factor = 0.5;
			}
			var result = color1.slice();
			for (var i = 0; i < 3; i++) {
				result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
			}
			return result;
		},

		/**
   * Interpolate (blend) two colors with a given factor in HSL mode
   * @param {number[]} color1
   * @param {number[]} color2
   * @param {float} [factor=0.5] 0..1
   * @returns {number[]}
   */
		interpolateHSL: function interpolateHSL(color1, color2, factor) {
			if (arguments.length < 3) {
				factor = 0.5;
			}
			var hsl1 = this.rgb2hsl(color1);
			var hsl2 = this.rgb2hsl(color2);
			for (var i = 0; i < 3; i++) {
				hsl1[i] += factor * (hsl2[i] - hsl1[i]);
			}
			return this.hsl2rgb(hsl1);
		},

		/**
   * Create a new random color based on this one
   * @param {number[]} color
   * @param {number[]} diff Set of standard deviations
   * @returns {number[]}
   */
		randomize: function randomize(color, diff) {
			if (!(diff instanceof Array)) {
				diff = Math.round(ROT.RNG.getNormal(0, diff));
			}
			var result = color.slice();
			for (var i = 0; i < 3; i++) {
				result[i] += diff instanceof Array ? Math.round(ROT.RNG.getNormal(0, diff[i])) : diff;
			}
			return result;
		},

		/**
   * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
   * @param {number[]} color
   * @returns {number[]}
   */
		rgb2hsl: function rgb2hsl(color) {
			var r = color[0] / 255;
			var g = color[1] / 255;
			var b = color[2] / 255;

			var max = Math.max(r, g, b),
			    min = Math.min(r, g, b);
			var h,
			    s,
			    l = (max + min) / 2;

			if (max == min) {
				h = s = 0; // achromatic
			} else {
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch (max) {
					case r:
						h = (g - b) / d + (g < b ? 6 : 0);break;
					case g:
						h = (b - r) / d + 2;break;
					case b:
						h = (r - g) / d + 4;break;
				}
				h /= 6;
			}

			return [h, s, l];
		},

		/**
   * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
   * @param {number[]} color
   * @returns {number[]}
   */
		hsl2rgb: function hsl2rgb(color) {
			var l = color[2];

			if (color[1] == 0) {
				l = Math.round(l * 255);
				return [l, l, l];
			} else {
				var hue2rgb = function hue2rgb(p, q, t) {
					if (t < 0) t += 1;
					if (t > 1) t -= 1;
					if (t < 1 / 6) return p + (q - p) * 6 * t;
					if (t < 1 / 2) return q;
					if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
					return p;
				};

				var s = color[1];
				var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				var p = 2 * l - q;
				var r = hue2rgb(p, q, color[0] + 1 / 3);
				var g = hue2rgb(p, q, color[0]);
				var b = hue2rgb(p, q, color[0] - 1 / 3);
				return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
			}
		},

		toRGB: function toRGB(color) {
			return "rgb(" + this._clamp(color[0]) + "," + this._clamp(color[1]) + "," + this._clamp(color[2]) + ")";
		},

		toHex: function toHex(color) {
			var parts = [];
			for (var i = 0; i < 3; i++) {
				parts.push(this._clamp(color[i]).toString(16).lpad("0", 2));
			}
			return "#" + parts.join("");
		},

		_clamp: function _clamp(num) {
			if (num < 0) {
				return 0;
			} else if (num > 255) {
				return 255;
			} else {
				return num;
			}
		},

		_cache: {
			"black": [0, 0, 0],
			"navy": [0, 0, 128],
			"darkblue": [0, 0, 139],
			"mediumblue": [0, 0, 205],
			"blue": [0, 0, 255],
			"darkgreen": [0, 100, 0],
			"green": [0, 128, 0],
			"teal": [0, 128, 128],
			"darkcyan": [0, 139, 139],
			"deepskyblue": [0, 191, 255],
			"darkturquoise": [0, 206, 209],
			"mediumspringgreen": [0, 250, 154],
			"lime": [0, 255, 0],
			"springgreen": [0, 255, 127],
			"aqua": [0, 255, 255],
			"cyan": [0, 255, 255],
			"midnightblue": [25, 25, 112],
			"dodgerblue": [30, 144, 255],
			"forestgreen": [34, 139, 34],
			"seagreen": [46, 139, 87],
			"darkslategray": [47, 79, 79],
			"darkslategrey": [47, 79, 79],
			"limegreen": [50, 205, 50],
			"mediumseagreen": [60, 179, 113],
			"turquoise": [64, 224, 208],
			"royalblue": [65, 105, 225],
			"steelblue": [70, 130, 180],
			"darkslateblue": [72, 61, 139],
			"mediumturquoise": [72, 209, 204],
			"indigo": [75, 0, 130],
			"darkolivegreen": [85, 107, 47],
			"cadetblue": [95, 158, 160],
			"cornflowerblue": [100, 149, 237],
			"mediumaquamarine": [102, 205, 170],
			"dimgray": [105, 105, 105],
			"dimgrey": [105, 105, 105],
			"slateblue": [106, 90, 205],
			"olivedrab": [107, 142, 35],
			"slategray": [112, 128, 144],
			"slategrey": [112, 128, 144],
			"lightslategray": [119, 136, 153],
			"lightslategrey": [119, 136, 153],
			"mediumslateblue": [123, 104, 238],
			"lawngreen": [124, 252, 0],
			"chartreuse": [127, 255, 0],
			"aquamarine": [127, 255, 212],
			"maroon": [128, 0, 0],
			"purple": [128, 0, 128],
			"olive": [128, 128, 0],
			"gray": [128, 128, 128],
			"grey": [128, 128, 128],
			"skyblue": [135, 206, 235],
			"lightskyblue": [135, 206, 250],
			"blueviolet": [138, 43, 226],
			"darkred": [139, 0, 0],
			"darkmagenta": [139, 0, 139],
			"saddlebrown": [139, 69, 19],
			"darkseagreen": [143, 188, 143],
			"lightgreen": [144, 238, 144],
			"mediumpurple": [147, 112, 216],
			"darkviolet": [148, 0, 211],
			"palegreen": [152, 251, 152],
			"darkorchid": [153, 50, 204],
			"yellowgreen": [154, 205, 50],
			"sienna": [160, 82, 45],
			"brown": [165, 42, 42],
			"darkgray": [169, 169, 169],
			"darkgrey": [169, 169, 169],
			"lightblue": [173, 216, 230],
			"greenyellow": [173, 255, 47],
			"paleturquoise": [175, 238, 238],
			"lightsteelblue": [176, 196, 222],
			"powderblue": [176, 224, 230],
			"firebrick": [178, 34, 34],
			"darkgoldenrod": [184, 134, 11],
			"mediumorchid": [186, 85, 211],
			"rosybrown": [188, 143, 143],
			"darkkhaki": [189, 183, 107],
			"silver": [192, 192, 192],
			"mediumvioletred": [199, 21, 133],
			"indianred": [205, 92, 92],
			"peru": [205, 133, 63],
			"chocolate": [210, 105, 30],
			"tan": [210, 180, 140],
			"lightgray": [211, 211, 211],
			"lightgrey": [211, 211, 211],
			"palevioletred": [216, 112, 147],
			"thistle": [216, 191, 216],
			"orchid": [218, 112, 214],
			"goldenrod": [218, 165, 32],
			"crimson": [220, 20, 60],
			"gainsboro": [220, 220, 220],
			"plum": [221, 160, 221],
			"burlywood": [222, 184, 135],
			"lightcyan": [224, 255, 255],
			"lavender": [230, 230, 250],
			"darksalmon": [233, 150, 122],
			"violet": [238, 130, 238],
			"palegoldenrod": [238, 232, 170],
			"lightcoral": [240, 128, 128],
			"khaki": [240, 230, 140],
			"aliceblue": [240, 248, 255],
			"honeydew": [240, 255, 240],
			"azure": [240, 255, 255],
			"sandybrown": [244, 164, 96],
			"wheat": [245, 222, 179],
			"beige": [245, 245, 220],
			"whitesmoke": [245, 245, 245],
			"mintcream": [245, 255, 250],
			"ghostwhite": [248, 248, 255],
			"salmon": [250, 128, 114],
			"antiquewhite": [250, 235, 215],
			"linen": [250, 240, 230],
			"lightgoldenrodyellow": [250, 250, 210],
			"oldlace": [253, 245, 230],
			"red": [255, 0, 0],
			"fuchsia": [255, 0, 255],
			"magenta": [255, 0, 255],
			"deeppink": [255, 20, 147],
			"orangered": [255, 69, 0],
			"tomato": [255, 99, 71],
			"hotpink": [255, 105, 180],
			"coral": [255, 127, 80],
			"darkorange": [255, 140, 0],
			"lightsalmon": [255, 160, 122],
			"orange": [255, 165, 0],
			"lightpink": [255, 182, 193],
			"pink": [255, 192, 203],
			"gold": [255, 215, 0],
			"peachpuff": [255, 218, 185],
			"navajowhite": [255, 222, 173],
			"moccasin": [255, 228, 181],
			"bisque": [255, 228, 196],
			"mistyrose": [255, 228, 225],
			"blanchedalmond": [255, 235, 205],
			"papayawhip": [255, 239, 213],
			"lavenderblush": [255, 240, 245],
			"seashell": [255, 245, 238],
			"cornsilk": [255, 248, 220],
			"lemonchiffon": [255, 250, 205],
			"floralwhite": [255, 250, 240],
			"snow": [255, 250, 250],
			"yellow": [255, 255, 0],
			"lightyellow": [255, 255, 224],
			"ivory": [255, 255, 240],
			"white": [255, 255, 255]
		}
	};
	/**
  * @class Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
  * @param {function} reflectivityCallback Callback to retrieve cell reflectivity (0..1)
  * @param {object} [options]
  * @param {int} [options.passes=1] Number of passes. 1 equals to simple FOV of all light sources, >1 means a *highly simplified* radiosity-like algorithm.
  * @param {int} [options.emissionThreshold=100] Cells with emissivity > threshold will be treated as light source in the next pass.
  * @param {int} [options.range=10] Max light range
  */
	ROT.Lighting = function (reflectivityCallback, options) {
		this._reflectivityCallback = reflectivityCallback;
		this._options = {
			passes: 1,
			emissionThreshold: 100,
			range: 10
		};
		this._fov = null;

		this._lights = {};
		this._reflectivityCache = {};
		this._fovCache = {};

		this.setOptions(options);
	};

	/**
  * Adjust options at runtime
  * @see ROT.Lighting
  * @param {object} [options]
  */
	ROT.Lighting.prototype.setOptions = function (options) {
		for (var p in options) {
			this._options[p] = options[p];
		}
		if (options && options.range) {
			this.reset();
		}
		return this;
	};

	/**
  * Set the used Field-Of-View algo
  * @param {ROT.FOV} fov
  */
	ROT.Lighting.prototype.setFOV = function (fov) {
		this._fov = fov;
		this._fovCache = {};
		return this;
	};

	/**
  * Set (or remove) a light source
  * @param {int} x
  * @param {int} y
  * @param {null || string || number[3]} color
  */
	ROT.Lighting.prototype.setLight = function (x, y, color) {
		var key = x + "," + y;

		if (color) {
			this._lights[key] = typeof color == "string" ? ROT.Color.fromString(color) : color;
		} else {
			delete this._lights[key];
		}
		return this;
	};

	/**
  * Remove all light sources
  */
	ROT.Lighting.prototype.clearLights = function () {
		this._lights = {};
	};

	/**
  * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
  */
	ROT.Lighting.prototype.reset = function () {
		this._reflectivityCache = {};
		this._fovCache = {};

		return this;
	};

	/**
  * Compute the lighting
  * @param {function} lightingCallback Will be called with (x, y, color) for every lit cell
  */
	ROT.Lighting.prototype.compute = function (lightingCallback) {
		var doneCells = {};
		var emittingCells = {};
		var litCells = {};

		for (var key in this._lights) {
			/* prepare emitters for first pass */
			var light = this._lights[key];
			emittingCells[key] = [0, 0, 0];
			ROT.Color.add_(emittingCells[key], light);
		}

		for (var i = 0; i < this._options.passes; i++) {
			/* main loop */
			this._emitLight(emittingCells, litCells, doneCells);
			if (i + 1 == this._options.passes) {
				continue;
			} /* not for the last pass */
			emittingCells = this._computeEmitters(litCells, doneCells);
		}

		for (var litKey in litCells) {
			/* let the user know what and how is lit */
			var parts = litKey.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			lightingCallback(x, y, litCells[litKey]);
		}

		return this;
	};

	/**
  * Compute one iteration from all emitting cells
  * @param {object} emittingCells These emit light
  * @param {object} litCells Add projected light to these
  * @param {object} doneCells These already emitted, forbid them from further calculations
  */
	ROT.Lighting.prototype._emitLight = function (emittingCells, litCells, doneCells) {
		for (var key in emittingCells) {
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			this._emitLightFromCell(x, y, emittingCells[key], litCells);
			doneCells[key] = 1;
		}
		return this;
	};

	/**
  * Prepare a list of emitters for next pass
  * @param {object} litCells
  * @param {object} doneCells
  * @returns {object}
  */
	ROT.Lighting.prototype._computeEmitters = function (litCells, doneCells) {
		var result = {};

		for (var key in litCells) {
			if (key in doneCells) {
				continue;
			} /* already emitted */

			var color = litCells[key];

			if (key in this._reflectivityCache) {
				var reflectivity = this._reflectivityCache[key];
			} else {
				var parts = key.split(",");
				var x = parseInt(parts[0]);
				var y = parseInt(parts[1]);
				var reflectivity = this._reflectivityCallback(x, y);
				this._reflectivityCache[key] = reflectivity;
			}

			if (reflectivity == 0) {
				continue;
			} /* will not reflect at all */

			/* compute emission color */
			var emission = [];
			var intensity = 0;
			for (var i = 0; i < 3; i++) {
				var part = Math.round(color[i] * reflectivity);
				emission[i] = part;
				intensity += part;
			}
			if (intensity > this._options.emissionThreshold) {
				result[key] = emission;
			}
		}

		return result;
	};

	/**
  * Compute one iteration from one cell
  * @param {int} x
  * @param {int} y
  * @param {number[]} color
  * @param {object} litCells Cell data to by updated
  */
	ROT.Lighting.prototype._emitLightFromCell = function (x, y, color, litCells) {
		var key = x + "," + y;
		if (key in this._fovCache) {
			var fov = this._fovCache[key];
		} else {
			var fov = this._updateFOV(x, y);
		}

		for (var fovKey in fov) {
			var formFactor = fov[fovKey];

			if (fovKey in litCells) {
				/* already lit */
				var result = litCells[fovKey];
			} else {
				/* newly lit */
				var result = [0, 0, 0];
				litCells[fovKey] = result;
			}

			for (var i = 0; i < 3; i++) {
				result[i] += Math.round(color[i] * formFactor);
			} /* add light color */
		}

		return this;
	};

	/**
  * Compute FOV ("form factor") for a potential light source at [x,y]
  * @param {int} x
  * @param {int} y
  * @returns {object}
  */
	ROT.Lighting.prototype._updateFOV = function (x, y) {
		var key1 = x + "," + y;
		var cache = {};
		this._fovCache[key1] = cache;
		var range = this._options.range;
		var cb = function cb(x, y, r, vis) {
			var key2 = x + "," + y;
			var formFactor = vis * (1 - r / range);
			if (formFactor == 0) {
				return;
			}
			cache[key2] = formFactor;
		};
		this._fov.compute(x, y, range, cb.bind(this));

		return cache;
	};
	/**
  * @class Abstract pathfinder
  * @param {int} toX Target X coord
  * @param {int} toY Target Y coord
  * @param {function} passableCallback Callback to determine map passability
  * @param {object} [options]
  * @param {int} [options.topology=8]
  */
	ROT.Path = function (toX, toY, passableCallback, options) {
		this._toX = toX;
		this._toY = toY;
		this._fromX = null;
		this._fromY = null;
		this._passableCallback = passableCallback;
		this._options = {
			topology: 8
		};
		for (var p in options) {
			this._options[p] = options[p];
		}

		this._dirs = ROT.DIRS[this._options.topology];
		if (this._options.topology == 8) {
			/* reorder dirs for more aesthetic result (vertical/horizontal first) */
			this._dirs = [this._dirs[0], this._dirs[2], this._dirs[4], this._dirs[6], this._dirs[1], this._dirs[3], this._dirs[5], this._dirs[7]];
		}
	};

	/**
  * Compute a path from a given point
  * @param {int} fromX
  * @param {int} fromY
  * @param {function} callback Will be called for every path item with arguments "x" and "y"
  */
	ROT.Path.prototype.compute = function (fromX, fromY, callback) {};

	ROT.Path.prototype._getNeighbors = function (cx, cy) {
		var result = [];
		for (var i = 0; i < this._dirs.length; i++) {
			var dir = this._dirs[i];
			var x = cx + dir[0];
			var y = cy + dir[1];

			if (!this._passableCallback(x, y)) {
				continue;
			}
			result.push([x, y]);
		}

		return result;
	};
	/**
  * @class Simplified Dijkstra's algorithm: all edges have a value of 1
  * @augments ROT.Path
  * @see ROT.Path
  */
	ROT.Path.Dijkstra = function (toX, toY, passableCallback, options) {
		ROT.Path.call(this, toX, toY, passableCallback, options);

		this._computed = {};
		this._todo = [];
		this._add(toX, toY, null);
	};
	ROT.Path.Dijkstra.extend(ROT.Path);

	/**
  * Compute a path from a given point
  * @see ROT.Path#compute
  */
	ROT.Path.Dijkstra.prototype.compute = function (fromX, fromY, callback) {
		var key = fromX + "," + fromY;
		if (!(key in this._computed)) {
			this._compute(fromX, fromY);
		}
		if (!(key in this._computed)) {
			return;
		}

		var item = this._computed[key];
		while (item) {
			callback(item.x, item.y);
			item = item.prev;
		}
	};

	/**
  * Compute a non-cached value
  */
	ROT.Path.Dijkstra.prototype._compute = function (fromX, fromY) {
		while (this._todo.length) {
			var item = this._todo.shift();
			if (item.x == fromX && item.y == fromY) {
				return;
			}

			var neighbors = this._getNeighbors(item.x, item.y);

			for (var i = 0; i < neighbors.length; i++) {
				var neighbor = neighbors[i];
				var x = neighbor[0];
				var y = neighbor[1];
				var id = x + "," + y;
				if (id in this._computed) {
					continue;
				} /* already done */
				this._add(x, y, item);
			}
		}
	};

	ROT.Path.Dijkstra.prototype._add = function (x, y, prev) {
		var obj = {
			x: x,
			y: y,
			prev: prev
		};
		this._computed[x + "," + y] = obj;
		this._todo.push(obj);
	};
	/**
  * @class Simplified A* algorithm: all edges have a value of 1
  * @augments ROT.Path
  * @see ROT.Path
  */
	ROT.Path.AStar = function (toX, toY, passableCallback, options) {
		ROT.Path.call(this, toX, toY, passableCallback, options);

		this._todo = [];
		this._done = {};
		this._fromX = null;
		this._fromY = null;
	};
	ROT.Path.AStar.extend(ROT.Path);

	/**
  * Compute a path from a given point
  * @see ROT.Path#compute
  */
	ROT.Path.AStar.prototype.compute = function (fromX, fromY, callback) {
		this._todo = [];
		this._done = {};
		this._fromX = fromX;
		this._fromY = fromY;
		this._add(this._toX, this._toY, null);

		while (this._todo.length) {
			var item = this._todo.shift();
			if (item.x == fromX && item.y == fromY) {
				break;
			}
			var neighbors = this._getNeighbors(item.x, item.y);

			for (var i = 0; i < neighbors.length; i++) {
				var neighbor = neighbors[i];
				var x = neighbor[0];
				var y = neighbor[1];
				var id = x + "," + y;
				if (id in this._done) {
					continue;
				}
				this._add(x, y, item);
			}
		}

		var item = this._done[fromX + "," + fromY];
		if (!item) {
			return;
		}

		while (item) {
			callback(item.x, item.y);
			item = item.prev;
		}
	};

	ROT.Path.AStar.prototype._add = function (x, y, prev) {
		var h = this._distance(x, y);
		var obj = {
			x: x,
			y: y,
			prev: prev,
			g: prev ? prev.g + 1 : 0,
			h: h
		};
		this._done[x + "," + y] = obj;

		/* insert into priority queue */

		var f = obj.g + obj.h;
		for (var i = 0; i < this._todo.length; i++) {
			var item = this._todo[i];
			var itemF = item.g + item.h;
			if (f < itemF || f == itemF && h < item.h) {
				this._todo.splice(i, 0, obj);
				return;
			}
		}

		this._todo.push(obj);
	};

	ROT.Path.AStar.prototype._distance = function (x, y) {
		switch (this._options.topology) {
			case 4:
				return Math.abs(x - this._fromX) + Math.abs(y - this._fromY);
				break;

			case 6:
				var dx = Math.abs(x - this._fromX);
				var dy = Math.abs(y - this._fromY);
				return dy + Math.max(0, (dx - dy) / 2);
				break;

			case 8:
				return Math.max(Math.abs(x - this._fromX), Math.abs(y - this._fromY));
				break;
		}

		throw new Error("Illegal topology");
	};
	return ROT;
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxhcHAuanMiLCJhc3NldHNcXGpzXFxlbnVtLmpzIiwiYXNzZXRzXFxqc1xcZ2FtZS5qcyIsImFzc2V0c1xcanNcXHRpbGUuanMiLCJ2ZW5kb3JcXHJvdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBRyxDQUFDLGNBQUksV0FBSixFQUFKLEVBQXNCO0FBQ3JCLE9BQU0scURBQU47QUFDQSxDQUZELE1BR0k7QUFDSCxnQkFBSyxJQUFMO0FBQ0E7Ozs7Ozs7Ozs7O0lDVG9CLEksR0FDcEIsZ0JBQWE7QUFBQTs7QUFBQTs7QUFDWixLQUFJLE9BQU8sTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLFNBQTNCLENBQVg7QUFDQSxLQUFJLElBQUksQ0FBUjtBQUNBLE1BQUssT0FBTCxDQUFhLFVBQUMsR0FBRCxFQUFPO0FBQ25CLFFBQUssR0FBTCxJQUFZLEdBQVo7QUFDQSxFQUZEO0FBR0EsUUFBTyxNQUFQLENBQWMsSUFBZDtBQUNBLEM7O2tCQVJtQixJOzs7Ozs7Ozs7QUNBckI7Ozs7OztBQUVBLElBQU0sSUFBSSxFQUFWO0FBQ0EsSUFBTSxJQUFJLEVBQVY7O2tCQUVlO0FBQ2QsVUFBUyxJQURLO0FBRWQsTUFBSyxJQUZTOztBQUlkLE9BQU0sZ0JBQVU7QUFBQTs7QUFDZixPQUFLLE9BQUwsR0FBZSxJQUFJLGNBQUksT0FBUixDQUFnQixFQUFDLE9BQU8sQ0FBUixFQUFXLFFBQVEsQ0FBbkIsRUFBaEIsQ0FBZjtBQUNBLFdBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsS0FBSyxPQUFMLENBQWEsWUFBYixFQUExQjs7QUFFQSxPQUFLLEdBQUwsR0FBVyxJQUFJLGNBQUksR0FBSixDQUFRLEtBQVosQ0FBa0IsQ0FBbEIsRUFBb0IsQ0FBcEIsQ0FBWDtBQUNBLE9BQUssR0FB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QVA7QUFDRDtBQWJEOztBQWdCTyxRQUFNLElBQUksS0FBSixDQUFVLGtCQUFWLENBQU47QUFDUCxFQWxCRDtBQW1CRSxRQUFPLEdBQVA7QUFDRCxDQTN0S0EsQ0FBRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUk9UIGZyb20gXCIuLi8uLi92ZW5kb3Ivcm90XCJcclxuaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJ1xyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSAnLi90aWxlJztcclxuXHJcbmlmKCFST1QuaXNTdXBwb3J0ZWQoKSl7XHJcblx0YWxlcnQoXCJUaGUgcm90LmpzIGxpYnJhcnkgaXNuJ3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3Nlci5cIik7XHJcbn1cclxuZWxzZXtcclxuXHRHYW1lLmluaXQoKTtcclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudW17XHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHRcdGxldCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcclxuXHRcdGxldCBpID0gMDtcclxuXHRcdGFyZ3MuZm9yRWFjaCgodmFsKT0+e1xyXG5cdFx0XHR0aGlzW3ZhbF0gPSBpKys7XHJcblx0XHR9KTtcclxuXHRcdE9iamVjdC5mcmVlemUodGhpcyk7XHJcblx0fVxyXG59IiwiaW1wb3J0IFJPVCBmcm9tICcuLi8uLi92ZW5kb3Ivcm90J1xyXG5cclxuY29uc3QgdyA9IDUwO1xyXG5jb25zdCBoID0gMjU7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0ZGlzcGxheTogbnVsbCxcclxuXHRtYXA6IG51bGwsXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuZGlzcGxheSA9IG5ldyBST1QuRGlzcGxheSh7d2lkdGg6IHcsIGhlaWdodDogaH0pO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRpc3BsYXkuZ2V0Q29udGFpbmVyKCkpO1xyXG5cdFx0XHJcblx0XHR0aGlzLm1hcCA9IG5ldyBST1QuTWFwLkFyZW5hKHcsaCk7XHJcblx0XHR0aGlzLm1hcC5jcmVhdGUoKHgsIHksIHdhbGwpPT57XHJcblx0XHRcdHRoaXMuZGlzcGxheS5kcmF3KHgsIHksIHdhbGwgPyAnIyc6ICcuJyk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgRW51bSBmcm9tICcuL2VudW0nO1xyXG5pbXBvcnQgR2FtZSBmcm9tICcuL2dhbWUnO1xyXG5cclxuZXhwb3J0IGxldCBUaWxlVHlwZXMgPSBuZXcgRW51bSgnRU1QVFknLCdGTE9PUicsJ1dBTEwnKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUaWxlIHtcclxuXHRjb25zdHJ1Y3Rvcih4LCB5LCBjaHIsIGZnKXtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy5jaHIgPSBjaHI7XHJcblx0XHR0aGlzLmZnID0gZmc7XHJcblx0fVxyXG5cdGRyYXcoKXtcclxuXHRcdEdhbWUuZGlzcGxheS5kcmF3KHRoaXMueCwgdGhpcy55LCB0aGlzLmNociwgdGhpcy5mZyB8fCAnI2ZmZicpO1xyXG5cdH1cclxufSIsIi8qXHJcblx0VGhpcyBpcyByb3QuanMsIHRoZSBST2d1ZWxpa2UgVG9vbGtpdCBpbiBKYXZhU2NyaXB0LlxyXG5cdFZlcnNpb24gMC43fmRldiwgZ2VuZXJhdGVkIG9uIFRodSAyNCBOb3YgMjAxNiAwODowNzozOSBNU1QuXHJcbiovXHJcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgICAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcclxuICAgICAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcclxuICAgICAgICAvLyBsaWtlIE5vZGUuXHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXHJcbiAgICAgICAgcm9vdC5ST1QgPSBmYWN0b3J5KCk7XHJcbiAgICB9XHJcbn0odGhpcywgZnVuY3Rpb24oKSB7XHJcbi8qKlxyXG4gKiBAbmFtZXNwYWNlIFRvcC1sZXZlbCBST1QgbmFtZXNwYWNlXHJcbiAqL1xyXG52YXIgUk9UID0ge1xyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm5zIHtib29sfSBJcyByb3QuanMgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3Nlcj9cclxuXHQgKi9cclxuXHRpc1N1cHBvcnRlZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gISEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKS5nZXRDb250ZXh0ICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKTtcclxuXHR9LFxyXG5cclxuXHQvKiogRGVmYXVsdCB3aXRoIGZvciBkaXNwbGF5IGFuZCBtYXAgZ2VuZXJhdG9ycyAqL1xyXG5cdERFRkFVTFRfV0lEVEg6IDgwLFxyXG5cdC8qKiBEZWZhdWx0IGhlaWdodCBmb3IgZGlzcGxheSBhbmQgbWFwIGdlbmVyYXRvcnMgKi9cclxuXHRERUZBVUxUX0hFSUdIVDogMjUsXHJcblxyXG5cdC8qKiBEaXJlY3Rpb25hbCBjb25zdGFudHMuIE9yZGVyaW5nIGlzIGltcG9ydGFudCEgKi9cclxuXHRESVJTOiB7XHJcblx0XHRcIjRcIjogW1xyXG5cdFx0XHRbIDAsIC0xXSxcclxuXHRcdFx0WyAxLCAgMF0sXHJcblx0XHRcdFsgMCwgIDFdLFxyXG5cdFx0XHRbLTEsICAwXVxyXG5cdFx0XSxcclxuXHRcdFwiOFwiOiBbXHJcblx0XHRcdFsgMCwgLTFdLFxyXG5cdFx0XHRbIDEsIC0xXSxcclxuXHRcdFx0WyAxLCAgMF0sXHJcblx0XHRcdFsgMSwgIDFdLFxyXG5cdFx0XHRbIDAsICAxXSxcclxuXHRcdFx0Wy0xLCAgMV0sXHJcblx0XHRcdFstMSwgIDBdLFxyXG5cdFx0XHRbLTEsIC0xXVxyXG5cdFx0XSxcclxuXHRcdFwiNlwiOiBbXHJcblx0XHRcdFstMSwgLTFdLFxyXG5cdFx0XHRbIDEsIC0xXSxcclxuXHRcdFx0WyAyLCAgMF0sXHJcblx0XHRcdFsgMSwgIDFdLFxyXG5cdFx0XHRbLTEsICAxXSxcclxuXHRcdFx0Wy0yLCAgMF1cclxuXHRcdF1cclxuXHR9LFxyXG5cclxuXHQvKiogQ2FuY2VsIGtleS4gKi9cclxuXHRWS19DQU5DRUw6IDMsIFxyXG5cdC8qKiBIZWxwIGtleS4gKi9cclxuXHRWS19IRUxQOiA2LCBcclxuXHQvKiogQmFja3NwYWNlIGtleS4gKi9cclxuXHRWS19CQUNLX1NQQUNFOiA4LCBcclxuXHQvKiogVGFiIGtleS4gKi9cclxuXHRWS19UQUI6IDksIFxyXG5cdC8qKiA1IGtleSBvbiBOdW1wYWQgd2hlbiBOdW1Mb2NrIGlzIHVubG9ja2VkLiBPciBvbiBNYWMsIGNsZWFyIGtleSB3aGljaCBpcyBwb3NpdGlvbmVkIGF0IE51bUxvY2sga2V5LiAqL1xyXG5cdFZLX0NMRUFSOiAxMiwgXHJcblx0LyoqIFJldHVybi9lbnRlciBrZXkgb24gdGhlIG1haW4ga2V5Ym9hcmQuICovXHJcblx0VktfUkVUVVJOOiAxMywgXHJcblx0LyoqIFJlc2VydmVkLCBidXQgbm90IHVzZWQuICovXHJcblx0VktfRU5URVI6IDE0LCBcclxuXHQvKiogU2hpZnQga2V5LiAqL1xyXG5cdFZLX1NISUZUOiAxNiwgXHJcblx0LyoqIENvbnRyb2wga2V5LiAqL1xyXG5cdFZLX0NPTlRST0w6IDE3LCBcclxuXHQvKiogQWx0IChPcHRpb24gb24gTWFjKSBrZXkuICovXHJcblx0VktfQUxUOiAxOCwgXHJcblx0LyoqIFBhdXNlIGtleS4gKi9cclxuXHRWS19QQVVTRTogMTksIFxyXG5cdC8qKiBDYXBzIGxvY2suICovXHJcblx0VktfQ0FQU19MT0NLOiAyMCwgXHJcblx0LyoqIEVzY2FwZSBrZXkuICovXHJcblx0VktfRVNDQVBFOiAyNywgXHJcblx0LyoqIFNwYWNlIGJhci4gKi9cclxuXHRWS19TUEFDRTogMzIsIFxyXG5cdC8qKiBQYWdlIFVwIGtleS4gKi9cclxuXHRWS19QQUdFX1VQOiAzMywgXHJcblx0LyoqIFBhZ2UgRG93biBrZXkuICovXHJcblx0VktfUEFHRV9ET1dOOiAzNCwgXHJcblx0LyoqIEVuZCBrZXkuICovXHJcblx0VktfRU5EOiAzNSwgXHJcblx0LyoqIEhvbWUga2V5LiAqL1xyXG5cdFZLX0hPTUU6IDM2LCBcclxuXHQvKiogTGVmdCBhcnJvdy4gKi9cclxuXHRWS19MRUZUOiAzNywgXHJcblx0LyoqIFVwIGFycm93LiAqL1xyXG5cdFZLX1VQOiAzOCwgXHJcblx0LyoqIFJpZ2h0IGFycm93LiAqL1xyXG5cdFZLX1JJR0hUOiAzOSwgXHJcblx0LyoqIERvd24gYXJyb3cuICovXHJcblx0VktfRE9XTjogNDAsIFxyXG5cdC8qKiBQcmludCBTY3JlZW4ga2V5LiAqL1xyXG5cdFZLX1BSSU5UU0NSRUVOOiA0NCwgXHJcblx0LyoqIElucyhlcnQpIGtleS4gKi9cclxuXHRWS19JTlNFUlQ6IDQ1LCBcclxuXHQvKiogRGVsKGV0ZSkga2V5LiAqL1xyXG5cdFZLX0RFTEVURTogNDYsIFxyXG5cdC8qKiovXHJcblx0VktfMDogNDgsXHJcblx0LyoqKi9cclxuXHRWS18xOiA0OSxcclxuXHQvKioqL1xyXG5cdFZLXzI6IDUwLFxyXG5cdC8qKiovXHJcblx0VktfMzogNTEsXHJcblx0LyoqKi9cclxuXHRWS180OiA1MixcclxuXHQvKioqL1xyXG5cdFZLXzU6IDUzLFxyXG5cdC8qKiovXHJcblx0VktfNjogNTQsXHJcblx0LyoqKi9cclxuXHRWS183OiA1NSxcclxuXHQvKioqL1xyXG5cdFZLXzg6IDU2LFxyXG5cdC8qKiovXHJcblx0VktfOTogNTcsXHJcblx0LyoqIENvbG9uICg6KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19DT0xPTjogNTgsIFxyXG5cdC8qKiBTZW1pY29sb24gKDspIGtleS4gKi9cclxuXHRWS19TRU1JQ09MT046IDU5LCBcclxuXHQvKiogTGVzcy10aGFuICg8KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19MRVNTX1RIQU46IDYwLCBcclxuXHQvKiogRXF1YWxzICg9KSBrZXkuICovXHJcblx0VktfRVFVQUxTOiA2MSwgXHJcblx0LyoqIEdyZWF0ZXItdGhhbiAoPikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfR1JFQVRFUl9USEFOOiA2MiwgXHJcblx0LyoqIFF1ZXN0aW9uIG1hcmsgKD8pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1FVRVNUSU9OX01BUks6IDYzLCBcclxuXHQvKiogQXRtYXJrIChAKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19BVDogNjQsIFxyXG5cdC8qKiovXHJcblx0VktfQTogNjUsXHJcblx0LyoqKi9cclxuXHRWS19COiA2NixcclxuXHQvKioqL1xyXG5cdFZLX0M6IDY3LFxyXG5cdC8qKiovXHJcblx0VktfRDogNjgsXHJcblx0LyoqKi9cclxuXHRWS19FOiA2OSxcclxuXHQvKioqL1xyXG5cdFZLX0Y6IDcwLFxyXG5cdC8qKiovXHJcblx0VktfRzogNzEsXHJcblx0LyoqKi9cclxuXHRWS19IOiA3MixcclxuXHQvKioqL1xyXG5cdFZLX0k6IDczLFxyXG5cdC8qKiovXHJcblx0VktfSjogNzQsXHJcblx0LyoqKi9cclxuXHRWS19LOiA3NSxcclxuXHQvKioqL1xyXG5cdFZLX0w6IDc2LFxyXG5cdC8qKiovXHJcblx0VktfTTogNzcsXHJcblx0LyoqKi9cclxuXHRWS19OOiA3OCxcclxuXHQvKioqL1xyXG5cdFZLX086IDc5LFxyXG5cdC8qKiovXHJcblx0VktfUDogODAsXHJcblx0LyoqKi9cclxuXHRWS19ROiA4MSxcclxuXHQvKioqL1xyXG5cdFZLX1I6IDgyLFxyXG5cdC8qKiovXHJcblx0VktfUzogODMsXHJcblx0LyoqKi9cclxuXHRWS19UOiA4NCxcclxuXHQvKioqL1xyXG5cdFZLX1U6IDg1LFxyXG5cdC8qKiovXHJcblx0VktfVjogODYsXHJcblx0LyoqKi9cclxuXHRWS19XOiA4NyxcclxuXHQvKioqL1xyXG5cdFZLX1g6IDg4LFxyXG5cdC8qKiovXHJcblx0VktfWTogODksXHJcblx0LyoqKi9cclxuXHRWS19aOiA5MCxcclxuXHQvKioqL1xyXG5cdFZLX0NPTlRFWFRfTUVOVTogOTMsXHJcblx0LyoqIDAgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDA6IDk2LCBcclxuXHQvKiogMSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEMTogOTcsIFxyXG5cdC8qKiAyIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQyOiA5OCwgXHJcblx0LyoqIDMgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDM6IDk5LCBcclxuXHQvKiogNCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENDogMTAwLCBcclxuXHQvKiogNSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENTogMTAxLCBcclxuXHQvKiogNiBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENjogMTAyLCBcclxuXHQvKiogNyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENzogMTAzLCBcclxuXHQvKiogOCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEODogMTA0LCBcclxuXHQvKiogOSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEOTogMTA1LCBcclxuXHQvKiogKiBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTVVMVElQTFk6IDEwNixcclxuXHQvKiogKyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfQUREOiAxMDcsIFxyXG5cdC8qKiovXHJcblx0VktfU0VQQVJBVE9SOiAxMDgsXHJcblx0LyoqIC0gb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX1NVQlRSQUNUOiAxMDksIFxyXG5cdC8qKiBEZWNpbWFsIHBvaW50IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19ERUNJTUFMOiAxMTAsIFxyXG5cdC8qKiAvIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19ESVZJREU6IDExMSwgXHJcblx0LyoqIEYxIGtleS4gKi9cclxuXHRWS19GMTogMTEyLCBcclxuXHQvKiogRjIga2V5LiAqL1xyXG5cdFZLX0YyOiAxMTMsIFxyXG5cdC8qKiBGMyBrZXkuICovXHJcblx0VktfRjM6IDExNCwgXHJcblx0LyoqIEY0IGtleS4gKi9cclxuXHRWS19GNDogMTE1LCBcclxuXHQvKiogRjUga2V5LiAqL1xyXG5cdFZLX0Y1OiAxMTYsIFxyXG5cdC8qKiBGNiBrZXkuICovXHJcblx0VktfRjY6IDExNywgXHJcblx0LyoqIEY3IGtleS4gKi9cclxuXHRWS19GNzogMTE4LCBcclxuXHQvKiogRjgga2V5LiAqL1xyXG5cdFZLX0Y4OiAxMTksIFxyXG5cdC8qKiBGOSBrZXkuICovXHJcblx0VktfRjk6IDEyMCwgXHJcblx0LyoqIEYxMCBrZXkuICovXHJcblx0VktfRjEwOiAxMjEsIFxyXG5cdC8qKiBGMTEga2V5LiAqL1xyXG5cdFZLX0YxMTogMTIyLCBcclxuXHQvKiogRjEyIGtleS4gKi9cclxuXHRWS19GMTI6IDEyMywgXHJcblx0LyoqIEYxMyBrZXkuICovXHJcblx0VktfRjEzOiAxMjQsIFxyXG5cdC8qKiBGMTQga2V5LiAqL1xyXG5cdFZLX0YxNDogMTI1LCBcclxuXHQvKiogRjE1IGtleS4gKi9cclxuXHRWS19GMTU6IDEyNiwgXHJcblx0LyoqIEYxNiBrZXkuICovXHJcblx0VktfRjE2OiAxMjcsIFxyXG5cdC8qKiBGMTcga2V5LiAqL1xyXG5cdFZLX0YxNzogMTI4LCBcclxuXHQvKiogRjE4IGtleS4gKi9cclxuXHRWS19GMTg6IDEyOSwgXHJcblx0LyoqIEYxOSBrZXkuICovXHJcblx0VktfRjE5OiAxMzAsIFxyXG5cdC8qKiBGMjAga2V5LiAqL1xyXG5cdFZLX0YyMDogMTMxLCBcclxuXHQvKiogRjIxIGtleS4gKi9cclxuXHRWS19GMjE6IDEzMiwgXHJcblx0LyoqIEYyMiBrZXkuICovXHJcblx0VktfRjIyOiAxMzMsIFxyXG5cdC8qKiBGMjMga2V5LiAqL1xyXG5cdFZLX0YyMzogMTM0LCBcclxuXHQvKiogRjI0IGtleS4gKi9cclxuXHRWS19GMjQ6IDEzNSwgXHJcblx0LyoqIE51bSBMb2NrIGtleS4gKi9cclxuXHRWS19OVU1fTE9DSzogMTQ0LCBcclxuXHQvKiogU2Nyb2xsIExvY2sga2V5LiAqL1xyXG5cdFZLX1NDUk9MTF9MT0NLOiAxNDUsIFxyXG5cdC8qKiBDaXJjdW1mbGV4ICheKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19DSVJDVU1GTEVYOiAxNjAsIFxyXG5cdC8qKiBFeGNsYW1hdGlvbiAoISkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfRVhDTEFNQVRJT046IDE2MSwgXHJcblx0LyoqIERvdWJsZSBxdW90ZSAoKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19ET1VCTEVfUVVPVEU6IDE2MiwgXHJcblx0LyoqIEhhc2ggKCMpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0hBU0g6IDE2MywgXHJcblx0LyoqIERvbGxhciBzaWduICgkKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19ET0xMQVI6IDE2NCwgXHJcblx0LyoqIFBlcmNlbnQgKCUpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1BFUkNFTlQ6IDE2NSwgXHJcblx0LyoqIEFtcGVyc2FuZCAoJikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQU1QRVJTQU5EOiAxNjYsIFxyXG5cdC8qKiBVbmRlcnNjb3JlIChfKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19VTkRFUlNDT1JFOiAxNjcsIFxyXG5cdC8qKiBPcGVuIHBhcmVudGhlc2lzICgoKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19PUEVOX1BBUkVOOiAxNjgsIFxyXG5cdC8qKiBDbG9zZSBwYXJlbnRoZXNpcyAoKSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQ0xPU0VfUEFSRU46IDE2OSwgXHJcblx0LyogQXN0ZXJpc2sgKCopIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0FTVEVSSVNLOiAxNzAsXHJcblx0LyoqIFBsdXMgKCspIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1BMVVM6IDE3MSwgXHJcblx0LyoqIFBpcGUgKHwpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1BJUEU6IDE3MiwgXHJcblx0LyoqIEh5cGhlbi1VUy9kb2NzL01pbnVzICgtKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19IWVBIRU5fTUlOVVM6IDE3MywgXHJcblx0LyoqIE9wZW4gY3VybHkgYnJhY2tldCAoeykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfT1BFTl9DVVJMWV9CUkFDS0VUOiAxNzQsIFxyXG5cdC8qKiBDbG9zZSBjdXJseSBicmFja2V0ICh9KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19DTE9TRV9DVVJMWV9CUkFDS0VUOiAxNzUsIFxyXG5cdC8qKiBUaWxkZSAofikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfVElMREU6IDE3NiwgXHJcblx0LyoqIENvbW1hICgsKSBrZXkuICovXHJcblx0VktfQ09NTUE6IDE4OCwgXHJcblx0LyoqIFBlcmlvZCAoLikga2V5LiAqL1xyXG5cdFZLX1BFUklPRDogMTkwLCBcclxuXHQvKiogU2xhc2ggKC8pIGtleS4gKi9cclxuXHRWS19TTEFTSDogMTkxLCBcclxuXHQvKiogQmFjayB0aWNrIChgKSBrZXkuICovXHJcblx0VktfQkFDS19RVU9URTogMTkyLCBcclxuXHQvKiogT3BlbiBzcXVhcmUgYnJhY2tldCAoWykga2V5LiAqL1xyXG5cdFZLX09QRU5fQlJBQ0tFVDogMjE5LCBcclxuXHQvKiogQmFjayBzbGFzaCAoXFwpIGtleS4gKi9cclxuXHRWS19CQUNLX1NMQVNIOiAyMjAsIFxyXG5cdC8qKiBDbG9zZSBzcXVhcmUgYnJhY2tldCAoXSkga2V5LiAqL1xyXG5cdFZLX0NMT1NFX0JSQUNLRVQ6IDIyMSwgXHJcblx0LyoqIFF1b3RlICgnJycpIGtleS4gKi9cclxuXHRWS19RVU9URTogMjIyLCBcclxuXHQvKiogTWV0YSBrZXkgb24gTGludXgsIENvbW1hbmQga2V5IG9uIE1hYy4gKi9cclxuXHRWS19NRVRBOiAyMjQsIFxyXG5cdC8qKiBBbHRHciBrZXkgb24gTGludXguIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19BTFRHUjogMjI1LCBcclxuXHQvKiogV2luZG93cyBsb2dvIGtleSBvbiBXaW5kb3dzLiBPciBTdXBlciBvciBIeXBlciBrZXkgb24gTGludXguIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19XSU46IDkxLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfS0FOQTogMjEsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19IQU5HVUw6IDIxLCBcclxuXHQvKiog6Iux5pWwIGtleSBvbiBKYXBhbmVzZSBNYWMga2V5Ym9hcmQuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19FSVNVOiAyMiwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0pVTkpBOiAyMywgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0ZJTkFMOiAyNCwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0hBTkpBOiAyNSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0tBTkpJOiAyNSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0NPTlZFUlQ6IDI4LCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfTk9OQ09OVkVSVDogMjksIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19BQ0NFUFQ6IDMwLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfTU9ERUNIQU5HRTogMzEsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19TRUxFQ1Q6IDQxLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfUFJJTlQ6IDQyLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfRVhFQ1VURTogNDMsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC5cdCAqL1xyXG5cdFZLX1NMRUVQOiA5NSBcclxufTtcclxuLyoqXHJcbiAqIEBuYW1lc3BhY2VcclxuICogQ29udGFpbnMgdGV4dCB0b2tlbml6YXRpb24gYW5kIGJyZWFraW5nIHJvdXRpbmVzXHJcbiAqL1xyXG5ST1QuVGV4dCA9IHtcclxuXHRSRV9DT0xPUlM6IC8lKFtiY10peyhbXn1dKil9L2csXHJcblxyXG5cdC8qIHRva2VuIHR5cGVzICovXHJcblx0VFlQRV9URVhUOlx0XHQwLFxyXG5cdFRZUEVfTkVXTElORTpcdDEsXHJcblx0VFlQRV9GRzpcdFx0MixcclxuXHRUWVBFX0JHOlx0XHQzLFxyXG5cclxuXHQvKipcclxuXHQgKiBNZWFzdXJlIHNpemUgb2YgYSByZXN1bHRpbmcgdGV4dCBibG9ja1xyXG5cdCAqL1xyXG5cdG1lYXN1cmU6IGZ1bmN0aW9uKHN0ciwgbWF4V2lkdGgpIHtcclxuXHRcdHZhciByZXN1bHQgPSB7d2lkdGg6MCwgaGVpZ2h0OjF9O1xyXG5cdFx0dmFyIHRva2VucyA9IHRoaXMudG9rZW5pemUoc3RyLCBtYXhXaWR0aCk7XHJcblx0XHR2YXIgbGluZVdpZHRoID0gMDtcclxuXHJcblx0XHRmb3IgKHZhciBpPTA7aTx0b2tlbnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbaV07XHJcblx0XHRcdHN3aXRjaCAodG9rZW4udHlwZSkge1xyXG5cdFx0XHRcdGNhc2UgdGhpcy5UWVBFX1RFWFQ6XHJcblx0XHRcdFx0XHRsaW5lV2lkdGggKz0gdG9rZW4udmFsdWUubGVuZ3RoO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlIHRoaXMuVFlQRV9ORVdMSU5FOlxyXG5cdFx0XHRcdFx0cmVzdWx0LmhlaWdodCsrO1xyXG5cdFx0XHRcdFx0cmVzdWx0LndpZHRoID0gTWF0aC5tYXgocmVzdWx0LndpZHRoLCBsaW5lV2lkdGgpO1xyXG5cdFx0XHRcdFx0bGluZVdpZHRoID0gMDtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmVzdWx0LndpZHRoID0gTWF0aC5tYXgocmVzdWx0LndpZHRoLCBsaW5lV2lkdGgpO1xyXG5cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydCBzdHJpbmcgdG8gYSBzZXJpZXMgb2YgYSBmb3JtYXR0aW5nIGNvbW1hbmRzXHJcblx0ICovXHJcblx0dG9rZW5pemU6IGZ1bmN0aW9uKHN0ciwgbWF4V2lkdGgpIHtcclxuXHRcdHZhciByZXN1bHQgPSBbXTtcclxuXHJcblx0XHQvKiBmaXJzdCB0b2tlbml6YXRpb24gcGFzcyAtIHNwbGl0IHRleHRzIGFuZCBjb2xvciBmb3JtYXR0aW5nIGNvbW1hbmRzICovXHJcblx0XHR2YXIgb2Zmc2V0ID0gMDtcclxuXHRcdHN0ci5yZXBsYWNlKHRoaXMuUkVfQ09MT1JTLCBmdW5jdGlvbihtYXRjaCwgdHlwZSwgbmFtZSwgaW5kZXgpIHtcclxuXHRcdFx0Lyogc3RyaW5nIGJlZm9yZSAqL1xyXG5cdFx0XHR2YXIgcGFydCA9IHN0ci5zdWJzdHJpbmcob2Zmc2V0LCBpbmRleCk7XHJcblx0XHRcdGlmIChwYXJ0Lmxlbmd0aCkge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKHtcclxuXHRcdFx0XHRcdHR5cGU6IFJPVC5UZXh0LlRZUEVfVEVYVCxcclxuXHRcdFx0XHRcdHZhbHVlOiBwYXJ0XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qIGNvbG9yIGNvbW1hbmQgKi9cclxuXHRcdFx0cmVzdWx0LnB1c2goe1xyXG5cdFx0XHRcdHR5cGU6ICh0eXBlID09IFwiY1wiID8gUk9ULlRleHQuVFlQRV9GRyA6IFJPVC5UZXh0LlRZUEVfQkcpLFxyXG5cdFx0XHRcdHZhbHVlOiBuYW1lLnRyaW0oKVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdG9mZnNldCA9IGluZGV4ICsgbWF0Y2gubGVuZ3RoO1xyXG5cdFx0XHRyZXR1cm4gXCJcIjtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8qIGxhc3QgcmVtYWluaW5nIHBhcnQgKi9cclxuXHRcdHZhciBwYXJ0ID0gc3RyLnN1YnN0cmluZyhvZmZzZXQpO1xyXG5cdFx0aWYgKHBhcnQubGVuZ3RoKSB7XHJcblx0XHRcdHJlc3VsdC5wdXNoKHtcclxuXHRcdFx0XHR0eXBlOiBST1QuVGV4dC5UWVBFX1RFWFQsXHJcblx0XHRcdFx0dmFsdWU6IHBhcnRcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX2JyZWFrTGluZXMocmVzdWx0LCBtYXhXaWR0aCk7XHJcblx0fSxcclxuXHJcblx0LyogaW5zZXJ0IGxpbmUgYnJlYWtzIGludG8gZmlyc3QtcGFzcyB0b2tlbml6ZWQgZGF0YSAqL1xyXG5cdF9icmVha0xpbmVzOiBmdW5jdGlvbih0b2tlbnMsIG1heFdpZHRoKSB7XHJcblx0XHRpZiAoIW1heFdpZHRoKSB7IG1heFdpZHRoID0gSW5maW5pdHk7IH1cclxuXHJcblx0XHR2YXIgaSA9IDA7XHJcblx0XHR2YXIgbGluZUxlbmd0aCA9IDA7XHJcblx0XHR2YXIgbGFzdFRva2VuV2l0aFNwYWNlID0gLTE7XHJcblxyXG5cdFx0d2hpbGUgKGkgPCB0b2tlbnMubGVuZ3RoKSB7IC8qIHRha2UgYWxsIHRleHQgdG9rZW5zLCByZW1vdmUgc3BhY2UsIGFwcGx5IGxpbmVicmVha3MgKi9cclxuXHRcdFx0dmFyIHRva2VuID0gdG9rZW5zW2ldO1xyXG5cdFx0XHRpZiAodG9rZW4udHlwZSA9PSBST1QuVGV4dC5UWVBFX05FV0xJTkUpIHsgLyogcmVzZXQgKi9cclxuXHRcdFx0XHRsaW5lTGVuZ3RoID0gMDsgXHJcblx0XHRcdFx0bGFzdFRva2VuV2l0aFNwYWNlID0gLTE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRva2VuLnR5cGUgIT0gUk9ULlRleHQuVFlQRV9URVhUKSB7IC8qIHNraXAgbm9uLXRleHQgdG9rZW5zICovXHJcblx0XHRcdFx0aSsrO1xyXG5cdFx0XHRcdGNvbnRpbnVlOyBcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyogcmVtb3ZlIHNwYWNlcyBhdCB0aGUgYmVnaW5uaW5nIG9mIGxpbmUgKi9cclxuXHRcdFx0d2hpbGUgKGxpbmVMZW5ndGggPT0gMCAmJiB0b2tlbi52YWx1ZS5jaGFyQXQoMCkgPT0gXCIgXCIpIHsgdG9rZW4udmFsdWUgPSB0b2tlbi52YWx1ZS5zdWJzdHJpbmcoMSk7IH1cclxuXHJcblx0XHRcdC8qIGZvcmNlZCBuZXdsaW5lPyBpbnNlcnQgdHdvIG5ldyB0b2tlbnMgYWZ0ZXIgdGhpcyBvbmUgKi9cclxuXHRcdFx0dmFyIGluZGV4ID0gdG9rZW4udmFsdWUuaW5kZXhPZihcIlxcblwiKTtcclxuXHRcdFx0aWYgKGluZGV4ICE9IC0xKSB7IFxyXG5cdFx0XHRcdHRva2VuLnZhbHVlID0gdGhpcy5fYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGksIGluZGV4LCB0cnVlKTsgXHJcblxyXG5cdFx0XHRcdC8qIGlmIHRoZXJlIGFyZSBzcGFjZXMgYXQgdGhlIGVuZCwgd2UgbXVzdCByZW1vdmUgdGhlbSAod2UgZG8gbm90IHdhbnQgdGhlIGxpbmUgdG9vIGxvbmcpICovXHJcblx0XHRcdFx0dmFyIGFyciA9IHRva2VuLnZhbHVlLnNwbGl0KFwiXCIpO1xyXG5cdFx0XHRcdHdoaWxlIChhcnIubGVuZ3RoICYmIGFyclthcnIubGVuZ3RoLTFdID09IFwiIFwiKSB7IGFyci5wb3AoKTsgfVxyXG5cdFx0XHRcdHRva2VuLnZhbHVlID0gYXJyLmpvaW4oXCJcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qIHRva2VuIGRlZ2VuZXJhdGVkPyAqL1xyXG5cdFx0XHRpZiAoIXRva2VuLnZhbHVlLmxlbmd0aCkge1xyXG5cdFx0XHRcdHRva2Vucy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChsaW5lTGVuZ3RoICsgdG9rZW4udmFsdWUubGVuZ3RoID4gbWF4V2lkdGgpIHsgLyogbGluZSB0b28gbG9uZywgZmluZCBhIHN1aXRhYmxlIGJyZWFraW5nIHNwb3QgKi9cclxuXHJcblx0XHRcdFx0LyogaXMgaXQgcG9zc2libGUgdG8gYnJlYWsgd2l0aGluIHRoaXMgdG9rZW4/ICovXHJcblx0XHRcdFx0dmFyIGluZGV4ID0gLTE7XHJcblx0XHRcdFx0d2hpbGUgKDEpIHtcclxuXHRcdFx0XHRcdHZhciBuZXh0SW5kZXggPSB0b2tlbi52YWx1ZS5pbmRleE9mKFwiIFwiLCBpbmRleCsxKTtcclxuXHRcdFx0XHRcdGlmIChuZXh0SW5kZXggPT0gLTEpIHsgYnJlYWs7IH1cclxuXHRcdFx0XHRcdGlmIChsaW5lTGVuZ3RoICsgbmV4dEluZGV4ID4gbWF4V2lkdGgpIHsgYnJlYWs7IH1cclxuXHRcdFx0XHRcdGluZGV4ID0gbmV4dEluZGV4O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ICE9IC0xKSB7IC8qIGJyZWFrIGF0IHNwYWNlIHdpdGhpbiB0aGlzIG9uZSAqL1xyXG5cdFx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgaSwgaW5kZXgsIHRydWUpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobGFzdFRva2VuV2l0aFNwYWNlICE9IC0xKSB7IC8qIGlzIHRoZXJlIGEgcHJldmlvdXMgdG9rZW4gd2hlcmUgYSBicmVhayBjYW4gb2NjdXI/ICovXHJcblx0XHRcdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbbGFzdFRva2VuV2l0aFNwYWNlXTtcclxuXHRcdFx0XHRcdHZhciBicmVha0luZGV4ID0gdG9rZW4udmFsdWUubGFzdEluZGV4T2YoXCIgXCIpO1xyXG5cdFx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgbGFzdFRva2VuV2l0aFNwYWNlLCBicmVha0luZGV4LCB0cnVlKTtcclxuXHRcdFx0XHRcdGkgPSBsYXN0VG9rZW5XaXRoU3BhY2U7XHJcblx0XHRcdFx0fSBlbHNlIHsgLyogZm9yY2UgYnJlYWsgaW4gdGhpcyB0b2tlbiAqL1xyXG5cdFx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgaSwgbWF4V2lkdGgtbGluZUxlbmd0aCwgZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gZWxzZSB7IC8qIGxpbmUgbm90IGxvbmcsIGNvbnRpbnVlICovXHJcblx0XHRcdFx0bGluZUxlbmd0aCArPSB0b2tlbi52YWx1ZS5sZW5ndGg7XHJcblx0XHRcdFx0aWYgKHRva2VuLnZhbHVlLmluZGV4T2YoXCIgXCIpICE9IC0xKSB7IGxhc3RUb2tlbldpdGhTcGFjZSA9IGk7IH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aSsrOyAvKiBhZHZhbmNlIHRvIG5leHQgdG9rZW4gKi9cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0dG9rZW5zLnB1c2goe3R5cGU6IFJPVC5UZXh0LlRZUEVfTkVXTElORX0pOyAvKiBpbnNlcnQgZmFrZSBuZXdsaW5lIHRvIGZpeCB0aGUgbGFzdCB0ZXh0IGxpbmUgKi9cclxuXHJcblx0XHQvKiByZW1vdmUgdHJhaWxpbmcgc3BhY2UgZnJvbSB0ZXh0IHRva2VucyBiZWZvcmUgbmV3bGluZXMgKi9cclxuXHRcdHZhciBsYXN0VGV4dFRva2VuID0gbnVsbDtcclxuXHRcdGZvciAodmFyIGk9MDtpPHRva2Vucy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHZhciB0b2tlbiA9IHRva2Vuc1tpXTtcclxuXHRcdFx0c3dpdGNoICh0b2tlbi50eXBlKSB7XHJcblx0XHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX1RFWFQ6IGxhc3RUZXh0VG9rZW4gPSB0b2tlbjsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX05FV0xJTkU6IFxyXG5cdFx0XHRcdFx0aWYgKGxhc3RUZXh0VG9rZW4pIHsgLyogcmVtb3ZlIHRyYWlsaW5nIHNwYWNlICovXHJcblx0XHRcdFx0XHRcdHZhciBhcnIgPSBsYXN0VGV4dFRva2VuLnZhbHVlLnNwbGl0KFwiXCIpO1xyXG5cdFx0XHRcdFx0XHR3aGlsZSAoYXJyLmxlbmd0aCAmJiBhcnJbYXJyLmxlbmd0aC0xXSA9PSBcIiBcIikgeyBhcnIucG9wKCk7IH1cclxuXHRcdFx0XHRcdFx0bGFzdFRleHRUb2tlbi52YWx1ZSA9IGFyci5qb2luKFwiXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGFzdFRleHRUb2tlbiA9IG51bGw7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0b2tlbnMucG9wKCk7IC8qIHJlbW92ZSBmYWtlIHRva2VuICovXHJcblxyXG5cdFx0cmV0dXJuIHRva2VucztcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGUgbmV3IHRva2VucyBhbmQgaW5zZXJ0IHRoZW0gaW50byB0aGUgc3RyZWFtXHJcblx0ICogQHBhcmFtIHtvYmplY3RbXX0gdG9rZW5zXHJcblx0ICogQHBhcmFtIHtpbnR9IHRva2VuSW5kZXggVG9rZW4gYmVpbmcgcHJvY2Vzc2VkXHJcblx0ICogQHBhcmFtIHtpbnR9IGJyZWFrSW5kZXggSW5kZXggd2l0aGluIGN1cnJlbnQgdG9rZW4ncyB2YWx1ZVxyXG5cdCAqIEBwYXJhbSB7Ym9vbH0gcmVtb3ZlQnJlYWtDaGFyIERvIHdlIHdhbnQgdG8gcmVtb3ZlIHRoZSBicmVha2luZyBjaGFyYWN0ZXI/XHJcblx0ICogQHJldHVybnMge3N0cmluZ30gcmVtYWluaW5nIHVuYnJva2VuIHRva2VuIHZhbHVlXHJcblx0ICovXHJcblx0X2JyZWFrSW5zaWRlVG9rZW46IGZ1bmN0aW9uKHRva2VucywgdG9rZW5JbmRleCwgYnJlYWtJbmRleCwgcmVtb3ZlQnJlYWtDaGFyKSB7XHJcblx0XHR2YXIgbmV3QnJlYWtUb2tlbiA9IHtcclxuXHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9ORVdMSU5FXHJcblx0XHR9O1xyXG5cdFx0dmFyIG5ld1RleHRUb2tlbiA9IHtcclxuXHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9URVhULFxyXG5cdFx0XHR2YWx1ZTogdG9rZW5zW3Rva2VuSW5kZXhdLnZhbHVlLnN1YnN0cmluZyhicmVha0luZGV4ICsgKHJlbW92ZUJyZWFrQ2hhciA/IDEgOiAwKSlcclxuXHRcdH07XHJcblx0XHR0b2tlbnMuc3BsaWNlKHRva2VuSW5kZXgrMSwgMCwgbmV3QnJlYWtUb2tlbiwgbmV3VGV4dFRva2VuKTtcclxuXHRcdHJldHVybiB0b2tlbnNbdG9rZW5JbmRleF0udmFsdWUuc3Vic3RyaW5nKDAsIGJyZWFrSW5kZXgpO1xyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEByZXR1cm5zIHthbnl9IFJhbmRvbWx5IHBpY2tlZCBpdGVtLCBudWxsIHdoZW4gbGVuZ3RoPTBcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5yYW5kb20gPSBBcnJheS5wcm90b3R5cGUucmFuZG9tIHx8IGZ1bmN0aW9uKCkge1xyXG5cdGlmICghdGhpcy5sZW5ndGgpIHsgcmV0dXJuIG51bGw7IH1cclxuXHRyZXR1cm4gdGhpc1tNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogdGhpcy5sZW5ndGgpXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcmV0dXJucyB7YXJyYXl9IE5ldyBhcnJheSB3aXRoIHJhbmRvbWl6ZWQgaXRlbXNcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5yYW5kb21pemUgPSBBcnJheS5wcm90b3R5cGUucmFuZG9taXplIHx8IGZ1bmN0aW9uKCkge1xyXG4gIHZhciByZXN1bHQgPSBbXTtcclxuICB2YXIgY2xvbmUgPSB0aGlzLnNsaWNlKCk7XHJcbiAgd2hpbGUgKGNsb25lLmxlbmd0aCkge1xyXG4gICAgdmFyIGluZGV4ID0gY2xvbmUuaW5kZXhPZihjbG9uZS5yYW5kb20oKSk7XHJcbiAgICByZXN1bHQucHVzaChjbG9uZS5zcGxpY2UoaW5kZXgsIDEpWzBdKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuLyoqXHJcbiAqIEFsd2F5cyBwb3NpdGl2ZSBtb2R1bHVzXHJcbiAqIEBwYXJhbSB7aW50fSBuIE1vZHVsdXNcclxuICogQHJldHVybnMge2ludH0gdGhpcyBtb2R1bG8gblxyXG4gKi9cclxuTnVtYmVyLnByb3RvdHlwZS5tb2QgPSBOdW1iZXIucHJvdG90eXBlLm1vZCB8fCBmdW5jdGlvbihuKSB7XHJcblx0cmV0dXJuICgodGhpcyVuKStuKSVuO1xyXG59O1xyXG4vKipcclxuICogQHJldHVybnMge3N0cmluZ30gRmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkXHJcbiAqL1xyXG5TdHJpbmcucHJvdG90eXBlLmNhcGl0YWxpemUgPSBTdHJpbmcucHJvdG90eXBlLmNhcGl0YWxpemUgfHwgZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnN1YnN0cmluZygxKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogTGVmdCBwYWRcclxuICogQHBhcmFtIHtzdHJpbmd9IFtjaGFyYWN0ZXI9XCIwXCJdXHJcbiAqIEBwYXJhbSB7aW50fSBbY291bnQ9Ml1cclxuICovXHJcblN0cmluZy5wcm90b3R5cGUubHBhZCA9IFN0cmluZy5wcm90b3R5cGUubHBhZCB8fCBmdW5jdGlvbihjaGFyYWN0ZXIsIGNvdW50KSB7XHJcblx0dmFyIGNoID0gY2hhcmFjdGVyIHx8IFwiMFwiO1xyXG5cdHZhciBjbnQgPSBjb3VudCB8fCAyO1xyXG5cclxuXHR2YXIgcyA9IFwiXCI7XHJcblx0d2hpbGUgKHMubGVuZ3RoIDwgKGNudCAtIHRoaXMubGVuZ3RoKSkgeyBzICs9IGNoOyB9XHJcblx0cyA9IHMuc3Vic3RyaW5nKDAsIGNudC10aGlzLmxlbmd0aCk7XHJcblx0cmV0dXJuIHMrdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogUmlnaHQgcGFkXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbY2hhcmFjdGVyPVwiMFwiXVxyXG4gKiBAcGFyYW0ge2ludH0gW2NvdW50PTJdXHJcbiAqL1xyXG5TdHJpbmcucHJvdG90eXBlLnJwYWQgPSBTdHJpbmcucHJvdG90eXBlLnJwYWQgfHwgZnVuY3Rpb24oY2hhcmFjdGVyLCBjb3VudCkge1xyXG5cdHZhciBjaCA9IGNoYXJhY3RlciB8fCBcIjBcIjtcclxuXHR2YXIgY250ID0gY291bnQgfHwgMjtcclxuXHJcblx0dmFyIHMgPSBcIlwiO1xyXG5cdHdoaWxlIChzLmxlbmd0aCA8IChjbnQgLSB0aGlzLmxlbmd0aCkpIHsgcyArPSBjaDsgfVxyXG5cdHMgPSBzLnN1YnN0cmluZygwLCBjbnQtdGhpcy5sZW5ndGgpO1xyXG5cdHJldHVybiB0aGlzK3M7XHJcbn07XHJcblxyXG4vKipcclxuICogRm9ybWF0IGEgc3RyaW5nIGluIGEgZmxleGlibGUgd2F5LiBTY2FucyBmb3IgJXMgc3RyaW5ncyBhbmQgcmVwbGFjZXMgdGhlbSB3aXRoIGFyZ3VtZW50cy4gTGlzdCBvZiBwYXR0ZXJucyBpcyBtb2RpZmlhYmxlIHZpYSBTdHJpbmcuZm9ybWF0Lm1hcC5cclxuICogQHBhcmFtIHtzdHJpbmd9IHRlbXBsYXRlXHJcbiAqIEBwYXJhbSB7YW55fSBbYXJndl1cclxuICovXHJcblN0cmluZy5mb3JtYXQgPSBTdHJpbmcuZm9ybWF0IHx8IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XHJcblx0dmFyIG1hcCA9IFN0cmluZy5mb3JtYXQubWFwO1xyXG5cdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuXHJcblx0dmFyIHJlcGxhY2VyID0gZnVuY3Rpb24obWF0Y2gsIGdyb3VwMSwgZ3JvdXAyLCBpbmRleCkge1xyXG5cdFx0aWYgKHRlbXBsYXRlLmNoYXJBdChpbmRleC0xKSA9PSBcIiVcIikgeyByZXR1cm4gbWF0Y2guc3Vic3RyaW5nKDEpOyB9XHJcblx0XHRpZiAoIWFyZ3MubGVuZ3RoKSB7IHJldHVybiBtYXRjaDsgfVxyXG5cdFx0dmFyIG9iaiA9IGFyZ3NbMF07XHJcblxyXG5cdFx0dmFyIGdyb3VwID0gZ3JvdXAxIHx8IGdyb3VwMjtcclxuXHRcdHZhciBwYXJ0cyA9IGdyb3VwLnNwbGl0KFwiLFwiKTtcclxuXHRcdHZhciBuYW1lID0gcGFydHMuc2hpZnQoKTtcclxuXHRcdHZhciBtZXRob2QgPSBtYXBbbmFtZS50b0xvd2VyQ2FzZSgpXTtcclxuXHRcdGlmICghbWV0aG9kKSB7IHJldHVybiBtYXRjaDsgfVxyXG5cclxuXHRcdHZhciBvYmogPSBhcmdzLnNoaWZ0KCk7XHJcblx0XHR2YXIgcmVwbGFjZWQgPSBvYmpbbWV0aG9kXS5hcHBseShvYmosIHBhcnRzKTtcclxuXHJcblx0XHR2YXIgZmlyc3QgPSBuYW1lLmNoYXJBdCgwKTtcclxuXHRcdGlmIChmaXJzdCAhPSBmaXJzdC50b0xvd2VyQ2FzZSgpKSB7IHJlcGxhY2VkID0gcmVwbGFjZWQuY2FwaXRhbGl6ZSgpOyB9XHJcblxyXG5cdFx0cmV0dXJuIHJlcGxhY2VkO1xyXG5cdH07XHJcblx0cmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoLyUoPzooW2Etel0rKXwoPzp7KFtefV0rKX0pKS9naSwgcmVwbGFjZXIpO1xyXG59O1xyXG5cclxuU3RyaW5nLmZvcm1hdC5tYXAgPSBTdHJpbmcuZm9ybWF0Lm1hcCB8fCB7XHJcblx0XCJzXCI6IFwidG9TdHJpbmdcIlxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlbmllbmNlIHNob3J0Y3V0IHRvIFN0cmluZy5mb3JtYXQodGhpcylcclxuICovXHJcblN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgfHwgZnVuY3Rpb24oKSB7XHJcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG5cdGFyZ3MudW5zaGlmdCh0aGlzKTtcclxuXHRyZXR1cm4gU3RyaW5nLmZvcm1hdC5hcHBseShTdHJpbmcsIGFyZ3MpO1xyXG59O1xyXG5cclxuaWYgKCFPYmplY3QuY3JlYXRlKSB7ICBcclxuXHQvKipcclxuXHQgKiBFUzUgT2JqZWN0LmNyZWF0ZVxyXG5cdCAqL1xyXG5cdE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbihvKSB7ICBcclxuXHRcdHZhciB0bXAgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0dG1wLnByb3RvdHlwZSA9IG87XHJcblx0XHRyZXR1cm4gbmV3IHRtcCgpO1xyXG5cdH07ICBcclxufSAgXHJcbi8qKlxyXG4gKiBTZXRzIHByb3RvdHlwZSBvZiB0aGlzIGZ1bmN0aW9uIHRvIGFuIGluc3RhbmNlIG9mIHBhcmVudCBmdW5jdGlvblxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBwYXJlbnRcclxuICovXHJcbkZ1bmN0aW9uLnByb3RvdHlwZS5leHRlbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuZXh0ZW5kIHx8IGZ1bmN0aW9uKHBhcmVudCkge1xyXG5cdHRoaXMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcclxuXHR0aGlzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHRoaXM7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbmlmICh0eXBlb2Ygd2luZG93ICE9IFwidW5kZWZpbmVkXCIpIHtcclxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID1cclxuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IGZ1bmN0aW9uKGNiKSB7IHJldHVybiBzZXRUaW1lb3V0KGNiLCAxMDAwLzYwKTsgfTtcclxuXHJcblx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID1cclxuXHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5vQ2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5tc0NhbmNlbEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCBmdW5jdGlvbihpZCkgeyByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTsgfTtcclxufVxyXG4vKipcclxuICogQGNsYXNzIFZpc3VhbCBtYXAgZGlzcGxheVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy53aWR0aD1ST1QuREVGQVVMVF9XSURUSF1cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLmhlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5mb250U2l6ZT0xNV1cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmZvbnRGYW1pbHk9XCJtb25vc3BhY2VcIl1cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmZvbnRTdHlsZT1cIlwiXSBib2xkL2l0YWxpYy9ub25lL2JvdGhcclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmZnPVwiI2NjY1wiXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuYmc9XCIjMDAwXCJdXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IFtvcHRpb25zLnNwYWNpbmc9MV1cclxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMuYm9yZGVyPTBdXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5sYXlvdXQ9XCJyZWN0XCJdXHJcbiAqIEBwYXJhbSB7Ym9vbH0gW29wdGlvbnMuZm9yY2VTcXVhcmVSYXRpbz1mYWxzZV1cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRpbGVXaWR0aD0zMl1cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRpbGVIZWlnaHQ9MzJdXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy50aWxlTWFwPXt9XVxyXG4gKiBAcGFyYW0ge2ltYWdlfSBbb3B0aW9ucy50aWxlU2V0PW51bGxdXHJcbiAqIEBwYXJhbSB7aW1hZ2V9IFtvcHRpb25zLnRpbGVDb2xvcml6ZT1mYWxzZV1cclxuICovXHJcblJPVC5EaXNwbGF5ID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG5cdHRoaXMuX2NvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cdHRoaXMuX2RhdGEgPSB7fTtcclxuXHR0aGlzLl9kaXJ0eSA9IGZhbHNlOyAvKiBmYWxzZSA9IG5vdGhpbmcsIHRydWUgPSBhbGwsIG9iamVjdCA9IGRpcnR5IGNlbGxzICovXHJcblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xyXG5cdHRoaXMuX2JhY2tlbmQgPSBudWxsO1xyXG5cdFxyXG5cdHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcclxuXHRcdHdpZHRoOiBST1QuREVGQVVMVF9XSURUSCxcclxuXHRcdGhlaWdodDogUk9ULkRFRkFVTFRfSEVJR0hULFxyXG5cdFx0dHJhbnNwb3NlOiBmYWxzZSxcclxuXHRcdGxheW91dDogXCJyZWN0XCIsXHJcblx0XHRmb250U2l6ZTogMTUsXHJcblx0XHRzcGFjaW5nOiAxLFxyXG5cdFx0Ym9yZGVyOiAwLFxyXG5cdFx0Zm9yY2VTcXVhcmVSYXRpbzogZmFsc2UsXHJcblx0XHRmb250RmFtaWx5OiBcIm1vbm9zcGFjZVwiLFxyXG5cdFx0Zm9udFN0eWxlOiBcIlwiLFxyXG5cdFx0Zmc6IFwiI2NjY1wiLFxyXG5cdFx0Ymc6IFwiIzAwMFwiLFxyXG5cdFx0dGlsZVdpZHRoOiAzMixcclxuXHRcdHRpbGVIZWlnaHQ6IDMyLFxyXG5cdFx0dGlsZU1hcDoge30sXHJcblx0XHR0aWxlU2V0OiBudWxsLFxyXG5cdFx0dGlsZUNvbG9yaXplOiBmYWxzZSxcclxuXHRcdHRlcm1Db2xvcjogXCJ4dGVybVwiXHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgZGVmYXVsdE9wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblx0dGhpcy5zZXRPcHRpb25zKGRlZmF1bHRPcHRpb25zKTtcclxuXHR0aGlzLkRFQlVHID0gdGhpcy5ERUJVRy5iaW5kKHRoaXMpO1xyXG5cclxuXHR0aGlzLl90aWNrID0gdGhpcy5fdGljay5iaW5kKHRoaXMpO1xyXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl90aWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZWJ1ZyBoZWxwZXIsIGlkZWFsIGFzIGEgbWFwIGdlbmVyYXRvciBjYWxsYmFjay4gQWx3YXlzIGJvdW5kIHRvIHRoaXMuXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSB3aGF0XHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuREVCVUcgPSBmdW5jdGlvbih4LCB5LCB3aGF0KSB7XHJcblx0dmFyIGNvbG9ycyA9IFt0aGlzLl9vcHRpb25zLmJnLCB0aGlzLl9vcHRpb25zLmZnXTtcclxuXHR0aGlzLmRyYXcoeCwgeSwgbnVsbCwgbnVsbCwgY29sb3JzW3doYXQgJSBjb2xvcnMubGVuZ3RoXSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xlYXIgdGhlIHdob2xlIGRpc3BsYXkgKGNvdmVyIGl0IHdpdGggYmFja2dyb3VuZCBjb2xvcilcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2RhdGEgPSB7fTtcclxuXHR0aGlzLl9kaXJ0eSA9IHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuRGlzcGxheVxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblx0aWYgKG9wdGlvbnMud2lkdGggfHwgb3B0aW9ucy5oZWlnaHQgfHwgb3B0aW9ucy5mb250U2l6ZSB8fCBvcHRpb25zLmZvbnRGYW1pbHkgfHwgb3B0aW9ucy5zcGFjaW5nIHx8IG9wdGlvbnMubGF5b3V0KSB7XHJcblx0XHRpZiAob3B0aW9ucy5sYXlvdXQpIHsgXHJcblx0XHRcdHRoaXMuX2JhY2tlbmQgPSBuZXcgUk9ULkRpc3BsYXlbb3B0aW9ucy5sYXlvdXQuY2FwaXRhbGl6ZSgpXSh0aGlzLl9jb250ZXh0KTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZm9udCA9ICh0aGlzLl9vcHRpb25zLmZvbnRTdHlsZSA/IHRoaXMuX29wdGlvbnMuZm9udFN0eWxlICsgXCIgXCIgOiBcIlwiKSArIHRoaXMuX29wdGlvbnMuZm9udFNpemUgKyBcInB4IFwiICsgdGhpcy5fb3B0aW9ucy5mb250RmFtaWx5O1xyXG5cdFx0dGhpcy5fY29udGV4dC5mb250ID0gZm9udDtcclxuXHRcdHRoaXMuX2JhY2tlbmQuY29tcHV0ZSh0aGlzLl9vcHRpb25zKTtcclxuXHRcdHRoaXMuX2NvbnRleHQuZm9udCA9IGZvbnQ7XHJcblx0XHR0aGlzLl9jb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcblx0XHR0aGlzLl9jb250ZXh0LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcblx0XHR0aGlzLl9kaXJ0eSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgY3VycmVudGx5IHNldCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9IEN1cnJlbnQgb3B0aW9ucyBvYmplY3QgXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIERPTSBub2RlIG9mIHRoaXMgZGlzcGxheVxyXG4gKiBAcmV0dXJucyB7bm9kZX0gRE9NIG5vZGVcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fY29udGV4dC5jYW52YXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB0aGUgbWF4aW11bSB3aWR0aC9oZWlnaHQgdG8gZml0IGludG8gYSBzZXQgb2YgZ2l2ZW4gY29uc3RyYWludHNcclxuICogQHBhcmFtIHtpbnR9IGF2YWlsV2lkdGggTWF4aW11bSBhbGxvd2VkIHBpeGVsIHdpZHRoXHJcbiAqIEBwYXJhbSB7aW50fSBhdmFpbEhlaWdodCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgaGVpZ2h0XHJcbiAqIEByZXR1cm5zIHtpbnRbMl19IGNlbGxXaWR0aCxjZWxsSGVpZ2h0XHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHJldHVybiB0aGlzLl9iYWNrZW5kLmNvbXB1dGVTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0LCB0aGlzLl9vcHRpb25zKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHRoZSBtYXhpbXVtIGZvbnQgc2l6ZSB0byBmaXQgaW50byBhIHNldCBvZiBnaXZlbiBjb25zdHJhaW50c1xyXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxXaWR0aCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgd2lkdGhcclxuICogQHBhcmFtIHtpbnR9IGF2YWlsSGVpZ2h0IE1heGltdW0gYWxsb3dlZCBwaXhlbCBoZWlnaHRcclxuICogQHJldHVybnMge2ludH0gZm9udFNpemVcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHJldHVybiB0aGlzLl9iYWNrZW5kLmNvbXB1dGVGb250U2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCwgdGhpcy5fb3B0aW9ucyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVydCBhIERPTSBldmVudCAobW91c2Ugb3IgdG91Y2gpIHRvIG1hcCBjb29yZGluYXRlcy4gVXNlcyBmaXJzdCB0b3VjaCBmb3IgbXVsdGktdG91Y2guXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgZXZlbnRcclxuICogQHJldHVybnMge2ludFsyXX0gLTEgZm9yIHZhbHVlcyBvdXRzaWRlIG9mIHRoZSBjYW52YXNcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbihlKSB7XHJcblx0aWYgKGUudG91Y2hlcykge1xyXG5cdFx0dmFyIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuXHRcdHZhciB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciB4ID0gZS5jbGllbnRYO1xyXG5cdFx0dmFyIHkgPSBlLmNsaWVudFk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVjdCA9IHRoaXMuX2NvbnRleHQuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdHggLT0gcmVjdC5sZWZ0O1xyXG5cdHkgLT0gcmVjdC50b3A7XHJcblx0XHJcblx0eCAqPSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCAvIHRoaXMuX2NvbnRleHQuY2FudmFzLmNsaWVudFdpZHRoO1xyXG5cdHkgKj0gdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0IC8gdGhpcy5fY29udGV4dC5jYW52YXMuY2xpZW50SGVpZ2h0O1xyXG5cclxuXHRpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCB8fCB5ID49IHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCkgeyByZXR1cm4gWy0xLCAtMV07IH1cclxuXHJcblx0cmV0dXJuIHRoaXMuX2JhY2tlbmQuZXZlbnRUb1Bvc2l0aW9uKHgsIHkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7c3RyaW5nIHx8IHN0cmluZ1tdfSBjaCBPbmUgb3IgbW9yZSBjaGFycyAod2lsbCBiZSBvdmVybGFwcGluZyB0aGVtc2VsdmVzKVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW2ZnXSBmb3JlZ3JvdW5kIGNvbG9yXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYmddIGJhY2tncm91bmQgY29sb3JcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oeCwgeSwgY2gsIGZnLCBiZykge1xyXG5cdGlmICghZmcpIHsgZmcgPSB0aGlzLl9vcHRpb25zLmZnOyB9XHJcblx0aWYgKCFiZykgeyBiZyA9IHRoaXMuX29wdGlvbnMuYmc7IH1cclxuXHR0aGlzLl9kYXRhW3grXCIsXCIreV0gPSBbeCwgeSwgY2gsIGZnLCBiZ107XHJcblx0XHJcblx0aWYgKHRoaXMuX2RpcnR5ID09PSB0cnVlKSB7IHJldHVybjsgfSAvKiB3aWxsIGFscmVhZHkgcmVkcmF3IGV2ZXJ5dGhpbmcgKi9cclxuXHRpZiAoIXRoaXMuX2RpcnR5KSB7IHRoaXMuX2RpcnR5ID0ge307IH0gLyogZmlyc3QhICovXHJcblx0dGhpcy5fZGlydHlbeCtcIixcIit5XSA9IHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogRHJhd3MgYSB0ZXh0IGF0IGdpdmVuIHBvc2l0aW9uLiBPcHRpb25hbGx5IHdyYXBzIGF0IGEgbWF4aW11bSBsZW5ndGguIEN1cnJlbnRseSBkb2VzIG5vdCB3b3JrIHdpdGggaGV4IGxheW91dC5cclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgTWF5IGNvbnRhaW4gY29sb3IvYmFja2dyb3VuZCBmb3JtYXQgc3BlY2lmaWVycywgJWN7bmFtZX0vJWJ7bmFtZX0sIGJvdGggb3B0aW9uYWwuICVje30vJWJ7fSByZXNldHMgdG8gZGVmYXVsdC5cclxuICogQHBhcmFtIHtpbnR9IFttYXhXaWR0aF0gd3JhcCBhdCB3aGF0IHdpZHRoP1xyXG4gKiBAcmV0dXJucyB7aW50fSBsaW5lcyBkcmF3blxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmRyYXdUZXh0ID0gZnVuY3Rpb24oeCwgeSwgdGV4dCwgbWF4V2lkdGgpIHtcclxuXHR2YXIgZmcgPSBudWxsO1xyXG5cdHZhciBiZyA9IG51bGw7XHJcblx0dmFyIGN4ID0geDtcclxuXHR2YXIgY3kgPSB5O1xyXG5cdHZhciBsaW5lcyA9IDE7XHJcblx0aWYgKCFtYXhXaWR0aCkgeyBtYXhXaWR0aCA9IHRoaXMuX29wdGlvbnMud2lkdGgteDsgfVxyXG5cclxuXHR2YXIgdG9rZW5zID0gUk9ULlRleHQudG9rZW5pemUodGV4dCwgbWF4V2lkdGgpO1xyXG5cclxuXHR3aGlsZSAodG9rZW5zLmxlbmd0aCkgeyAvKiBpbnRlcnByZXQgdG9rZW5pemVkIG9wY29kZSBzdHJlYW0gKi9cclxuXHRcdHZhciB0b2tlbiA9IHRva2Vucy5zaGlmdCgpO1xyXG5cdFx0c3dpdGNoICh0b2tlbi50eXBlKSB7XHJcblx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9URVhUOlxyXG5cdFx0XHRcdHZhciBpc1NwYWNlID0gZmFsc2UsIGlzUHJldlNwYWNlID0gZmFsc2UsIGlzRnVsbFdpZHRoID0gZmFsc2UsIGlzUHJldkZ1bGxXaWR0aCA9IGZhbHNlO1xyXG5cdFx0XHRcdGZvciAodmFyIGk9MDtpPHRva2VuLnZhbHVlLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0XHRcdHZhciBjYyA9IHRva2VuLnZhbHVlLmNoYXJDb2RlQXQoaSk7XHJcblx0XHRcdFx0XHR2YXIgYyA9IHRva2VuLnZhbHVlLmNoYXJBdChpKTtcclxuXHRcdFx0XHRcdC8vIEFzc2lnbiB0byBgdHJ1ZWAgd2hlbiB0aGUgY3VycmVudCBjaGFyIGlzIGZ1bGwtd2lkdGguXHJcblx0XHRcdFx0XHRpc0Z1bGxXaWR0aCA9IChjYyA+IDB4ZmYwMCAmJiBjYyA8IDB4ZmY2MSkgfHwgKGNjID4gMHhmZmRjICYmIGNjIDwgMHhmZmU4KSB8fCBjYyA+IDB4ZmZlZTtcclxuXHRcdFx0XHRcdC8vIEN1cnJlbnQgY2hhciBpcyBzcGFjZSwgd2hhdGV2ZXIgZnVsbC13aWR0aCBvciBoYWxmLXdpZHRoIGJvdGggYXJlIE9LLlxyXG5cdFx0XHRcdFx0aXNTcGFjZSA9IChjLmNoYXJDb2RlQXQoMCkgPT0gMHgyMCB8fCBjLmNoYXJDb2RlQXQoMCkgPT0gMHgzMDAwKTtcclxuXHRcdFx0XHRcdC8vIFRoZSBwcmV2aW91cyBjaGFyIGlzIGZ1bGwtd2lkdGggYW5kXHJcblx0XHRcdFx0XHQvLyBjdXJyZW50IGNoYXIgaXMgbmV0aGVyIGhhbGYtd2lkdGggbm9yIGEgc3BhY2UuXHJcblx0XHRcdFx0XHRpZiAoaXNQcmV2RnVsbFdpZHRoICYmICFpc0Z1bGxXaWR0aCAmJiAhaXNTcGFjZSkgeyBjeCsrOyB9IC8vIGFkZCBhbiBleHRyYSBwb3NpdGlvblxyXG5cdFx0XHRcdFx0Ly8gVGhlIGN1cnJlbnQgY2hhciBpcyBmdWxsLXdpZHRoIGFuZFxyXG5cdFx0XHRcdFx0Ly8gdGhlIHByZXZpb3VzIGNoYXIgaXMgbm90IGEgc3BhY2UuXHJcblx0XHRcdFx0XHRpZihpc0Z1bGxXaWR0aCAmJiAhaXNQcmV2U3BhY2UpIHsgY3grKzsgfSAvLyBhZGQgYW4gZXh0cmEgcG9zaXRpb25cclxuXHRcdFx0XHRcdHRoaXMuZHJhdyhjeCsrLCBjeSwgYywgZmcsIGJnKTtcclxuXHRcdFx0XHRcdGlzUHJldlNwYWNlID0gaXNTcGFjZTtcclxuXHRcdFx0XHRcdGlzUHJldkZ1bGxXaWR0aCA9IGlzRnVsbFdpZHRoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfRkc6XHJcblx0XHRcdFx0ZmcgPSB0b2tlbi52YWx1ZSB8fCBudWxsO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9CRzpcclxuXHRcdFx0XHRiZyA9IHRva2VuLnZhbHVlIHx8IG51bGw7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX05FV0xJTkU6XHJcblx0XHRcdFx0Y3ggPSB4O1xyXG5cdFx0XHRcdGN5Kys7XHJcblx0XHRcdFx0bGluZXMrKztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbGluZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogVGltZXIgdGljazogdXBkYXRlIGRpcnR5IHBhcnRzXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuX3RpY2sgPSBmdW5jdGlvbigpIHtcclxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fdGljayk7XHJcblxyXG5cdGlmICghdGhpcy5fZGlydHkpIHsgcmV0dXJuOyB9XHJcblxyXG5cdGlmICh0aGlzLl9kaXJ0eSA9PT0gdHJ1ZSkgeyAvKiBkcmF3IGFsbCAqL1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLl9vcHRpb25zLmJnO1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcclxuXHJcblx0XHRmb3IgKHZhciBpZCBpbiB0aGlzLl9kYXRhKSB7IC8qIHJlZHJhdyBjYWNoZWQgZGF0YSAqL1xyXG5cdFx0XHR0aGlzLl9kcmF3KGlkLCBmYWxzZSk7XHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSB7IC8qIGRyYXcgb25seSBkaXJ0eSAqL1xyXG5cdFx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2RpcnR5KSB7XHJcblx0XHRcdHRoaXMuX2RyYXcoa2V5LCB0cnVlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuX2RpcnR5ID0gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBXaGF0IHRvIGRyYXdcclxuICogQHBhcmFtIHtib29sfSBjbGVhckJlZm9yZSBJcyBpdCBuZWNlc3NhcnkgdG8gY2xlYW4gYmVmb3JlP1xyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLl9kcmF3ID0gZnVuY3Rpb24oa2V5LCBjbGVhckJlZm9yZSkge1xyXG5cdHZhciBkYXRhID0gdGhpcy5fZGF0YVtrZXldO1xyXG5cdGlmIChkYXRhWzRdICE9IHRoaXMuX29wdGlvbnMuYmcpIHsgY2xlYXJCZWZvcmUgPSB0cnVlOyB9XHJcblxyXG5cdHRoaXMuX2JhY2tlbmQuZHJhdyhkYXRhLCBjbGVhckJlZm9yZSk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQWJzdHJhY3QgZGlzcGxheSBiYWNrZW5kIG1vZHVsZVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkuQmFja2VuZCA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHR0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUmVjdGFuZ3VsYXIgYmFja2VuZFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkuUmVjdCA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRST1QuRGlzcGxheS5CYWNrZW5kLmNhbGwodGhpcywgY29udGV4dCk7XHJcblx0XHJcblx0dGhpcy5fc3BhY2luZ1ggPSAwO1xyXG5cdHRoaXMuX3NwYWNpbmdZID0gMDtcclxuXHR0aGlzLl9jYW52YXNDYWNoZSA9IHt9O1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7fTtcclxufTtcclxuUk9ULkRpc3BsYXkuUmVjdC5leHRlbmQoUk9ULkRpc3BsYXkuQmFja2VuZCk7XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LmNhY2hlID0gZmFsc2U7XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHRoaXMuX2NhbnZhc0NhY2hlID0ge307XHJcblx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG5cdHZhciBjaGFyV2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xyXG5cdHRoaXMuX3NwYWNpbmdYID0gTWF0aC5jZWlsKG9wdGlvbnMuc3BhY2luZyAqIGNoYXJXaWR0aCk7XHJcblx0dGhpcy5fc3BhY2luZ1kgPSBNYXRoLmNlaWwob3B0aW9ucy5zcGFjaW5nICogb3B0aW9ucy5mb250U2l6ZSk7XHJcblxyXG5cdGlmICh0aGlzLl9vcHRpb25zLmZvcmNlU3F1YXJlUmF0aW8pIHtcclxuXHRcdHRoaXMuX3NwYWNpbmdYID0gdGhpcy5fc3BhY2luZ1kgPSBNYXRoLm1heCh0aGlzLl9zcGFjaW5nWCwgdGhpcy5fc3BhY2luZ1kpO1xyXG5cdH1cclxuXHJcblx0dGhpcy5fY29udGV4dC5jYW52YXMud2lkdGggPSBvcHRpb25zLndpZHRoICogdGhpcy5fc3BhY2luZ1g7XHJcblx0dGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgKiB0aGlzLl9zcGFjaW5nWTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG5cdGlmICh0aGlzLmNvbnN0cnVjdG9yLmNhY2hlKSB7XHJcblx0XHR0aGlzLl9kcmF3V2l0aENhY2hlKGRhdGEsIGNsZWFyQmVmb3JlKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhpcy5fZHJhd05vQ2FjaGUoZGF0YSwgY2xlYXJCZWZvcmUpO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLl9kcmF3V2l0aENhY2hlID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxuXHR2YXIgeCA9IGRhdGFbMF07XHJcblx0dmFyIHkgPSBkYXRhWzFdO1xyXG5cdHZhciBjaCA9IGRhdGFbMl07XHJcblx0dmFyIGZnID0gZGF0YVszXTtcclxuXHR2YXIgYmcgPSBkYXRhWzRdO1xyXG5cclxuXHR2YXIgaGFzaCA9IFwiXCIrY2grZmcrYmc7XHJcblx0aWYgKGhhc2ggaW4gdGhpcy5fY2FudmFzQ2FjaGUpIHtcclxuXHRcdHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXNDYWNoZVtoYXNoXTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGIgPSB0aGlzLl9vcHRpb25zLmJvcmRlcjtcclxuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG5cdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblx0XHRjYW52YXMud2lkdGggPSB0aGlzLl9zcGFjaW5nWDtcclxuXHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLl9zcGFjaW5nWTtcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBiZztcclxuXHRcdGN0eC5maWxsUmVjdChiLCBiLCBjYW52YXMud2lkdGgtYiwgY2FudmFzLmhlaWdodC1iKTtcclxuXHRcdFxyXG5cdFx0aWYgKGNoKSB7XHJcblx0XHRcdGN0eC5maWxsU3R5bGUgPSBmZztcclxuXHRcdFx0Y3R4LmZvbnQgPSB0aGlzLl9jb250ZXh0LmZvbnQ7XHJcblx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG5cdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuXHJcblx0XHRcdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XHJcblx0XHRcdGZvciAodmFyIGk9MDtpPGNoYXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0XHRjdHguZmlsbFRleHQoY2hhcnNbaV0sIHRoaXMuX3NwYWNpbmdYLzIsIE1hdGguY2VpbCh0aGlzLl9zcGFjaW5nWS8yKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMuX2NhbnZhc0NhY2hlW2hhc2hdID0gY2FudmFzO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLl9jb250ZXh0LmRyYXdJbWFnZShjYW52YXMsIHgqdGhpcy5fc3BhY2luZ1gsIHkqdGhpcy5fc3BhY2luZ1kpO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuX2RyYXdOb0NhY2hlID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxuXHR2YXIgeCA9IGRhdGFbMF07XHJcblx0dmFyIHkgPSBkYXRhWzFdO1xyXG5cdHZhciBjaCA9IGRhdGFbMl07XHJcblx0dmFyIGZnID0gZGF0YVszXTtcclxuXHR2YXIgYmcgPSBkYXRhWzRdO1xyXG5cclxuXHRpZiAoY2xlYXJCZWZvcmUpIHsgXHJcblx0XHR2YXIgYiA9IHRoaXMuX29wdGlvbnMuYm9yZGVyO1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBiZztcclxuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoeCp0aGlzLl9zcGFjaW5nWCArIGIsIHkqdGhpcy5fc3BhY2luZ1kgKyBiLCB0aGlzLl9zcGFjaW5nWCAtIGIsIHRoaXMuX3NwYWNpbmdZIC0gYik7XHJcblx0fVxyXG5cdFxyXG5cdGlmICghY2gpIHsgcmV0dXJuOyB9XHJcblxyXG5cdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gZmc7XHJcblxyXG5cdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XHJcblx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsVGV4dChjaGFyc1tpXSwgKHgrMC41KSAqIHRoaXMuX3NwYWNpbmdYLCBNYXRoLmNlaWwoKHkrMC41KSAqIHRoaXMuX3NwYWNpbmdZKSk7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX3NwYWNpbmdYKTtcclxuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX3NwYWNpbmdZKTtcclxuXHRyZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHR2YXIgYm94V2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLndpZHRoKTtcclxuXHR2YXIgYm94SGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0KTtcclxuXHJcblx0LyogY29tcHV0ZSBjaGFyIHJhdGlvICovXHJcblx0dmFyIG9sZEZvbnQgPSB0aGlzLl9jb250ZXh0LmZvbnQ7XHJcblx0dGhpcy5fY29udGV4dC5mb250ID0gXCIxMDBweCBcIiArIHRoaXMuX29wdGlvbnMuZm9udEZhbWlseTtcclxuXHR2YXIgd2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xyXG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IG9sZEZvbnQ7XHJcblx0dmFyIHJhdGlvID0gd2lkdGggLyAxMDA7XHJcblx0XHRcclxuXHR2YXIgd2lkdGhGcmFjdGlvbiA9IHJhdGlvICogYm94SGVpZ2h0IC8gYm94V2lkdGg7XHJcblx0aWYgKHdpZHRoRnJhY3Rpb24gPiAxKSB7IC8qIHRvbyB3aWRlIHdpdGggY3VycmVudCBhc3BlY3QgcmF0aW8gKi9cclxuXHRcdGJveEhlaWdodCA9IE1hdGguZmxvb3IoYm94SGVpZ2h0IC8gd2lkdGhGcmFjdGlvbik7XHJcblx0fVxyXG5cdHJldHVybiBNYXRoLmZsb29yKGJveEhlaWdodCAvIHRoaXMuX29wdGlvbnMuc3BhY2luZyk7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0cmV0dXJuIFtNYXRoLmZsb29yKHgvdGhpcy5fc3BhY2luZ1gpLCBNYXRoLmZsb29yKHkvdGhpcy5fc3BhY2luZ1kpXTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBIZXhhZ29uYWwgYmFja2VuZFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkuSGV4ID0gZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFJPVC5EaXNwbGF5LkJhY2tlbmQuY2FsbCh0aGlzLCBjb250ZXh0KTtcclxuXHJcblx0dGhpcy5fc3BhY2luZ1ggPSAwO1xyXG5cdHRoaXMuX3NwYWNpbmdZID0gMDtcclxuXHR0aGlzLl9oZXhTaXplID0gMDtcclxuXHR0aGlzLl9vcHRpb25zID0ge307XHJcbn07XHJcblJPVC5EaXNwbGF5LkhleC5leHRlbmQoUk9ULkRpc3BsYXkuQmFja2VuZCk7XHJcblxyXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG5cdC8qIEZJWE1FIGNoYXIgc2l6ZSBjb21wdXRhdGlvbiBkb2VzIG5vdCByZXNwZWN0IHRyYW5zcG9zZWQgaGV4ZXMgKi9cclxuXHR2YXIgY2hhcldpZHRoID0gTWF0aC5jZWlsKHRoaXMuX2NvbnRleHQubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcclxuXHR0aGlzLl9oZXhTaXplID0gTWF0aC5mbG9vcihvcHRpb25zLnNwYWNpbmcgKiAob3B0aW9ucy5mb250U2l6ZSArIGNoYXJXaWR0aC9NYXRoLnNxcnQoMykpIC8gMik7XHJcblx0dGhpcy5fc3BhY2luZ1ggPSB0aGlzLl9oZXhTaXplICogTWF0aC5zcXJ0KDMpIC8gMjtcclxuXHR0aGlzLl9zcGFjaW5nWSA9IHRoaXMuX2hleFNpemUgKiAxLjU7XHJcblxyXG5cdGlmIChvcHRpb25zLnRyYW5zcG9zZSkge1xyXG5cdFx0dmFyIHhwcm9wID0gXCJoZWlnaHRcIjtcclxuXHRcdHZhciB5cHJvcCA9IFwid2lkdGhcIjtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIHhwcm9wID0gXCJ3aWR0aFwiO1xyXG5cdFx0dmFyIHlwcm9wID0gXCJoZWlnaHRcIjtcclxuXHR9XHJcblx0dGhpcy5fY29udGV4dC5jYW52YXNbeHByb3BdID0gTWF0aC5jZWlsKCAob3B0aW9ucy53aWR0aCArIDEpICogdGhpcy5fc3BhY2luZ1ggKTtcclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhc1t5cHJvcF0gPSBNYXRoLmNlaWwoIChvcHRpb25zLmhlaWdodCAtIDEpICogdGhpcy5fc3BhY2luZ1kgKyAyKnRoaXMuX2hleFNpemUgKTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XHJcblx0dmFyIHggPSBkYXRhWzBdO1xyXG5cdHZhciB5ID0gZGF0YVsxXTtcclxuXHR2YXIgY2ggPSBkYXRhWzJdO1xyXG5cdHZhciBmZyA9IGRhdGFbM107XHJcblx0dmFyIGJnID0gZGF0YVs0XTtcclxuXHJcblx0dmFyIHB4ID0gW1xyXG5cdFx0KHgrMSkgKiB0aGlzLl9zcGFjaW5nWCxcclxuXHRcdHkgKiB0aGlzLl9zcGFjaW5nWSArIHRoaXMuX2hleFNpemVcclxuXHRdO1xyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkgeyBweC5yZXZlcnNlKCk7IH1cclxuXHJcblx0aWYgKGNsZWFyQmVmb3JlKSB7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xyXG5cdFx0dGhpcy5fZmlsbChweFswXSwgcHhbMV0pO1xyXG5cdH1cclxuXHJcblx0aWYgKCFjaCkgeyByZXR1cm47IH1cclxuXHJcblx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBmZztcclxuXHJcblx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcclxuXHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxUZXh0KGNoYXJzW2ldLCBweFswXSwgTWF0aC5jZWlsKHB4WzFdKSk7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHRhdmFpbFdpZHRoICs9IGF2YWlsSGVpZ2h0O1xyXG5cdFx0YXZhaWxIZWlnaHQgPSBhdmFpbFdpZHRoIC0gYXZhaWxIZWlnaHQ7XHJcblx0XHRhdmFpbFdpZHRoIC09IGF2YWlsSGVpZ2h0O1xyXG5cdH1cclxuXHJcblx0dmFyIHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fc3BhY2luZ1gpIC0gMTtcclxuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcigoYXZhaWxIZWlnaHQgLSAyKnRoaXMuX2hleFNpemUpIC8gdGhpcy5fc3BhY2luZ1kgKyAxKTtcclxuXHRyZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkge1xyXG5cdFx0YXZhaWxXaWR0aCArPSBhdmFpbEhlaWdodDtcclxuXHRcdGF2YWlsSGVpZ2h0ID0gYXZhaWxXaWR0aCAtIGF2YWlsSGVpZ2h0O1xyXG5cdFx0YXZhaWxXaWR0aCAtPSBhdmFpbEhlaWdodDtcclxuXHR9XHJcblxyXG5cdHZhciBoZXhTaXplV2lkdGggPSAyKmF2YWlsV2lkdGggLyAoKHRoaXMuX29wdGlvbnMud2lkdGgrMSkgKiBNYXRoLnNxcnQoMykpIC0gMTtcclxuXHR2YXIgaGV4U2l6ZUhlaWdodCA9IGF2YWlsSGVpZ2h0IC8gKDIgKyAxLjUqKHRoaXMuX29wdGlvbnMuaGVpZ2h0LTEpKTtcclxuXHR2YXIgaGV4U2l6ZSA9IE1hdGgubWluKGhleFNpemVXaWR0aCwgaGV4U2l6ZUhlaWdodCk7XHJcblxyXG5cdC8qIGNvbXB1dGUgY2hhciByYXRpbyAqL1xyXG5cdHZhciBvbGRGb250ID0gdGhpcy5fY29udGV4dC5mb250O1xyXG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IFwiMTAwcHggXCIgKyB0aGlzLl9vcHRpb25zLmZvbnRGYW1pbHk7XHJcblx0dmFyIHdpZHRoID0gTWF0aC5jZWlsKHRoaXMuX2NvbnRleHQubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcclxuXHR0aGlzLl9jb250ZXh0LmZvbnQgPSBvbGRGb250O1xyXG5cdHZhciByYXRpbyA9IHdpZHRoIC8gMTAwO1xyXG5cclxuXHRoZXhTaXplID0gTWF0aC5mbG9vcihoZXhTaXplKSsxOyAvKiBjbG9zZXN0IGxhcmdlciBoZXhTaXplICovXHJcblxyXG5cdC8qIEZJWE1FIGNoYXIgc2l6ZSBjb21wdXRhdGlvbiBkb2VzIG5vdCByZXNwZWN0IHRyYW5zcG9zZWQgaGV4ZXMgKi9cclxuXHR2YXIgZm9udFNpemUgPSAyKmhleFNpemUgLyAodGhpcy5fb3B0aW9ucy5zcGFjaW5nICogKDEgKyByYXRpbyAvIE1hdGguc3FydCgzKSkpO1xyXG5cclxuXHQvKiBjbG9zZXN0IHNtYWxsZXIgZm9udFNpemUgKi9cclxuXHRyZXR1cm4gTWF0aC5jZWlsKGZvbnRTaXplKS0xO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHR4ICs9IHk7XHJcblx0XHR5ID0geC15O1xyXG5cdFx0eCAtPSB5O1xyXG5cdFx0dmFyIG5vZGVTaXplID0gdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGg7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBub2RlU2l6ZSA9IHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodDtcclxuXHR9XHJcblx0dmFyIHNpemUgPSBub2RlU2l6ZSAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0O1xyXG5cdHkgPSBNYXRoLmZsb29yKHkvc2l6ZSk7XHJcblxyXG5cdGlmICh5Lm1vZCgyKSkgeyAvKiBvZGQgcm93ICovXHJcblx0XHR4IC09IHRoaXMuX3NwYWNpbmdYO1xyXG5cdFx0eCA9IDEgKyAyKk1hdGguZmxvb3IoeC8oMip0aGlzLl9zcGFjaW5nWCkpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR4ID0gMipNYXRoLmZsb29yKHgvKDIqdGhpcy5fc3BhY2luZ1gpKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBbeCwgeV07XHJcbn07XHJcblxyXG4vKipcclxuICogQXJndW1lbnRzIGFyZSBwaXhlbCB2YWx1ZXMuIElmIFwidHJhbnNwb3NlZFwiIG1vZGUgaXMgZW5hYmxlZCwgdGhlbiB0aGVzZSB0d28gYXJlIGFscmVhZHkgc3dhcHBlZC5cclxuICovXHJcblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuX2ZpbGwgPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHR2YXIgYSA9IHRoaXMuX2hleFNpemU7XHJcblx0dmFyIGIgPSB0aGlzLl9vcHRpb25zLmJvcmRlcjtcclxuXHJcblx0dGhpcy5fY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHR0aGlzLl9jb250ZXh0Lm1vdmVUbyhjeC1hK2IsXHRjeSk7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC1hLzIrYixcdGN5K3RoaXMuX3NwYWNpbmdYLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grYS8yLWIsXHRjeSt0aGlzLl9zcGFjaW5nWC1iKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K2EtYixcdGN5KTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K2EvMi1iLFx0Y3ktdGhpcy5fc3BhY2luZ1grYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC1hLzIrYixcdGN5LXRoaXMuX3NwYWNpbmdYK2IpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gtYStiLFx0Y3kpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aGlzLl9jb250ZXh0Lm1vdmVUbyhjeCxcdFx0XHRcdFx0Y3ktYStiKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K3RoaXMuX3NwYWNpbmdYLWIsXHRjeS1hLzIrYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCt0aGlzLl9zcGFjaW5nWC1iLFx0Y3krYS8yLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gsXHRcdFx0XHRcdGN5K2EtYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC10aGlzLl9zcGFjaW5nWCtiLFx0Y3krYS8yLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gtdGhpcy5fc3BhY2luZ1grYixcdGN5LWEvMitiKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LFx0XHRcdFx0XHRjeS1hK2IpO1xyXG5cdH1cclxuXHR0aGlzLl9jb250ZXh0LmZpbGwoKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBUaWxlIGJhY2tlbmRcclxuICogQHByaXZhdGVcclxuICovXHJcblJPVC5EaXNwbGF5LlRpbGUgPSBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0Uk9ULkRpc3BsYXkuUmVjdC5jYWxsKHRoaXMsIGNvbnRleHQpO1xyXG5cdFxyXG5cdHRoaXMuX29wdGlvbnMgPSB7fTtcclxuXHR0aGlzLl9jb2xvckNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbn07XHJcblJPVC5EaXNwbGF5LlRpbGUuZXh0ZW5kKFJPVC5EaXNwbGF5LlJlY3QpO1xyXG5cclxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCA9IG9wdGlvbnMud2lkdGggKiBvcHRpb25zLnRpbGVXaWR0aDtcclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCAqIG9wdGlvbnMudGlsZUhlaWdodDtcclxuXHR0aGlzLl9jb2xvckNhbnZhcy53aWR0aCA9IG9wdGlvbnMudGlsZVdpZHRoO1xyXG5cdHRoaXMuX2NvbG9yQ2FudmFzLmhlaWdodCA9IG9wdGlvbnMudGlsZUhlaWdodDtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG5cdHZhciB4ID0gZGF0YVswXTtcclxuXHR2YXIgeSA9IGRhdGFbMV07XHJcblx0dmFyIGNoID0gZGF0YVsyXTtcclxuXHR2YXIgZmcgPSBkYXRhWzNdO1xyXG5cdHZhciBiZyA9IGRhdGFbNF07XHJcblxyXG5cdHZhciB0aWxlV2lkdGggPSB0aGlzLl9vcHRpb25zLnRpbGVXaWR0aDtcclxuXHR2YXIgdGlsZUhlaWdodCA9IHRoaXMuX29wdGlvbnMudGlsZUhlaWdodDtcclxuXHJcblx0aWYgKGNsZWFyQmVmb3JlKSB7XHJcblx0XHRpZiAodGhpcy5fb3B0aW9ucy50aWxlQ29sb3JpemUpIHtcclxuXHRcdFx0dGhpcy5fY29udGV4dC5jbGVhclJlY3QoeCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gYmc7XHJcblx0XHRcdHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoeCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmICghY2gpIHsgcmV0dXJuOyB9XHJcblxyXG5cdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XHJcblx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHRpbGUgPSB0aGlzLl9vcHRpb25zLnRpbGVNYXBbY2hhcnNbaV1dO1xyXG5cdFx0aWYgKCF0aWxlKSB7IHRocm93IG5ldyBFcnJvcihcIkNoYXIgJ1wiICsgY2hhcnNbaV0gKyBcIicgbm90IGZvdW5kIGluIHRpbGVNYXBcIik7IH1cclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuX29wdGlvbnMudGlsZUNvbG9yaXplKSB7IC8qIGFwcGx5IGNvbG9yaXphdGlvbiAqL1xyXG5cdFx0XHR2YXIgY2FudmFzID0gdGhpcy5fY29sb3JDYW52YXM7XHJcblx0XHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHRcdFx0Y29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHJcblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKFxyXG5cdFx0XHRcdHRoaXMuX29wdGlvbnMudGlsZVNldCxcclxuXHRcdFx0XHR0aWxlWzBdLCB0aWxlWzFdLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsXHJcblx0XHRcdFx0MCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRpZiAoZmcgIT0gXCJ0cmFuc3BhcmVudFwiKSB7XHJcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBmZztcclxuXHRcdFx0XHRjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwic291cmNlLWF0b3BcIjtcclxuXHRcdFx0XHRjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChiZyAhPSBcInRyYW5zcGFyZW50XCIpIHtcclxuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xyXG5cdFx0XHRcdGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJkZXN0aW5hdGlvbi1vdmVyXCI7XHJcblx0XHRcdFx0Y29udGV4dC5maWxsUmVjdCgwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9jb250ZXh0LmRyYXdJbWFnZShjYW52YXMsIHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XHJcblxyXG5cdFx0fSBlbHNlIHsgLyogbm8gY29sb3JpemluZywgZWFzeSAqL1xyXG5cdFx0XHR0aGlzLl9jb250ZXh0LmRyYXdJbWFnZShcclxuXHRcdFx0XHR0aGlzLl9vcHRpb25zLnRpbGVTZXQsXHJcblx0XHRcdFx0dGlsZVswXSwgdGlsZVsxXSwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LFxyXG5cdFx0XHRcdHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHR2YXIgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLnRpbGVXaWR0aCk7XHJcblx0dmFyIGhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9vcHRpb25zLnRpbGVIZWlnaHQpO1xyXG5cdHJldHVybiBbd2lkdGgsIGhlaWdodF07XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX29wdGlvbnMud2lkdGgpO1xyXG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy5oZWlnaHQpO1xyXG5cdHJldHVybiBbd2lkdGgsIGhlaWdodF07XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0cmV0dXJuIFtNYXRoLmZsb29yKHgvdGhpcy5fb3B0aW9ucy50aWxlV2lkdGgpLCBNYXRoLmZsb29yKHkvdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0KV07XHJcbn07XHJcbi8qKlxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqIFRoaXMgY29kZSBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiBBbGVhIGFsZ29yaXRobTsgKEMpIDIwMTAgSm9oYW5uZXMgQmFhZ8O4ZS5cclxuICogQWxlYSBpcyBsaWNlbnNlZCBhY2NvcmRpbmcgdG8gdGhlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UuXHJcbiAqL1xyXG5ST1QuUk5HID0ge1xyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFxyXG5cdCAqL1xyXG5cdGdldFNlZWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NlZWQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNlZWQgU2VlZCB0aGUgbnVtYmVyIGdlbmVyYXRvclxyXG5cdCAqL1xyXG5cdHNldFNlZWQ6IGZ1bmN0aW9uKHNlZWQpIHtcclxuXHRcdHNlZWQgPSAoc2VlZCA8IDEgPyAxL3NlZWQgOiBzZWVkKTtcclxuXHJcblx0XHR0aGlzLl9zZWVkID0gc2VlZDtcclxuXHRcdHRoaXMuX3MwID0gKHNlZWQgPj4+IDApICogdGhpcy5fZnJhYztcclxuXHJcblx0XHRzZWVkID0gKHNlZWQqNjkwNjkgKyAxKSA+Pj4gMDtcclxuXHRcdHRoaXMuX3MxID0gc2VlZCAqIHRoaXMuX2ZyYWM7XHJcblxyXG5cdFx0c2VlZCA9IChzZWVkKjY5MDY5ICsgMSkgPj4+IDA7XHJcblx0XHR0aGlzLl9zMiA9IHNlZWQgKiB0aGlzLl9mcmFjO1xyXG5cclxuXHRcdHRoaXMuX2MgPSAxO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQHJldHVybnMge2Zsb2F0fSBQc2V1ZG9yYW5kb20gdmFsdWUgWzAsMSksIHVuaWZvcm1seSBkaXN0cmlidXRlZFxyXG5cdCAqL1xyXG5cdGdldFVuaWZvcm06IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHQgPSAyMDkxNjM5ICogdGhpcy5fczAgKyB0aGlzLl9jICogdGhpcy5fZnJhYztcclxuXHRcdHRoaXMuX3MwID0gdGhpcy5fczE7XHJcblx0XHR0aGlzLl9zMSA9IHRoaXMuX3MyO1xyXG5cdFx0dGhpcy5fYyA9IHQgfCAwO1xyXG5cdFx0dGhpcy5fczIgPSB0IC0gdGhpcy5fYztcclxuXHRcdHJldHVybiB0aGlzLl9zMjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBAcGFyYW0ge2ludH0gbG93ZXJCb3VuZCBUaGUgbG93ZXIgZW5kIG9mIHRoZSByYW5nZSB0byByZXR1cm4gYSB2YWx1ZSBmcm9tLCBpbmNsdXNpdmVcclxuXHQgKiBAcGFyYW0ge2ludH0gdXBwZXJCb3VuZCBUaGUgdXBwZXIgZW5kIG9mIHRoZSByYW5nZSB0byByZXR1cm4gYSB2YWx1ZSBmcm9tLCBpbmNsdXNpdmVcclxuXHQgKiBAcmV0dXJucyB7aW50fSBQc2V1ZG9yYW5kb20gdmFsdWUgW2xvd2VyQm91bmQsIHVwcGVyQm91bmRdLCB1c2luZyBST1QuUk5HLmdldFVuaWZvcm0oKSB0byBkaXN0cmlidXRlIHRoZSB2YWx1ZVxyXG5cdCAqL1xyXG5cdGdldFVuaWZvcm1JbnQ6IGZ1bmN0aW9uKGxvd2VyQm91bmQsIHVwcGVyQm91bmQpIHtcclxuXHRcdHZhciBtYXggPSBNYXRoLm1heChsb3dlckJvdW5kLCB1cHBlckJvdW5kKTtcclxuXHRcdHZhciBtaW4gPSBNYXRoLm1pbihsb3dlckJvdW5kLCB1cHBlckJvdW5kKTtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2V0VW5pZm9ybSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbbWVhbj0wXSBNZWFuIHZhbHVlXHJcblx0ICogQHBhcmFtIHtmbG9hdH0gW3N0ZGRldj0xXSBTdGFuZGFyZCBkZXZpYXRpb24uIH45NSUgb2YgdGhlIGFic29sdXRlIHZhbHVlcyB3aWxsIGJlIGxvd2VyIHRoYW4gMipzdGRkZXYuXHJcblx0ICogQHJldHVybnMge2Zsb2F0fSBBIG5vcm1hbGx5IGRpc3RyaWJ1dGVkIHBzZXVkb3JhbmRvbSB2YWx1ZVxyXG5cdCAqL1xyXG5cdGdldE5vcm1hbDogZnVuY3Rpb24obWVhbiwgc3RkZGV2KSB7XHJcblx0XHRkbyB7XHJcblx0XHRcdHZhciB1ID0gMip0aGlzLmdldFVuaWZvcm0oKS0xO1xyXG5cdFx0XHR2YXIgdiA9IDIqdGhpcy5nZXRVbmlmb3JtKCktMTtcclxuXHRcdFx0dmFyIHIgPSB1KnUgKyB2KnY7XHJcblx0XHR9IHdoaWxlIChyID4gMSB8fCByID09IDApO1xyXG5cclxuXHRcdHZhciBnYXVzcyA9IHUgKiBNYXRoLnNxcnQoLTIqTWF0aC5sb2cocikvcik7XHJcblx0XHRyZXR1cm4gKG1lYW4gfHwgMCkgKyBnYXVzcyooc3RkZGV2IHx8IDEpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm5zIHtpbnR9IFBzZXVkb3JhbmRvbSB2YWx1ZSBbMSwxMDBdIGluY2x1c2l2ZSwgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkXHJcblx0ICovXHJcblx0Z2V0UGVyY2VudGFnZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gMSArIE1hdGguZmxvb3IodGhpcy5nZXRVbmlmb3JtKCkqMTAwKTtcclxuXHR9LFxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIGtleT13aGF0ZXZlciwgdmFsdWU9d2VpZ2h0IChyZWxhdGl2ZSBwcm9iYWJpbGl0eSlcclxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSB3aGF0ZXZlclxyXG5cdCAqL1xyXG5cdGdldFdlaWdodGVkVmFsdWU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdHZhciB0b3RhbCA9IDA7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGlkIGluIGRhdGEpIHtcclxuXHRcdFx0dG90YWwgKz0gZGF0YVtpZF07XHJcblx0XHR9XHJcblx0XHR2YXIgcmFuZG9tID0gdGhpcy5nZXRVbmlmb3JtKCkqdG90YWw7XHJcblx0XHRcclxuXHRcdHZhciBwYXJ0ID0gMDtcclxuXHRcdGZvciAodmFyIGlkIGluIGRhdGEpIHtcclxuXHRcdFx0cGFydCArPSBkYXRhW2lkXTtcclxuXHRcdFx0aWYgKHJhbmRvbSA8IHBhcnQpIHsgcmV0dXJuIGlkOyB9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWYgYnkgc29tZSBmbG9hdGluZy1wb2ludCBhbm5veWFuY2Ugd2UgaGF2ZVxyXG5cdFx0Ly8gcmFuZG9tID49IHRvdGFsLCBqdXN0IHJldHVybiB0aGUgbGFzdCBpZC5cclxuXHRcdHJldHVybiBpZDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBHZXQgUk5HIHN0YXRlLiBVc2VmdWwgZm9yIHN0b3JpbmcgdGhlIHN0YXRlIGFuZCByZS1zZXR0aW5nIGl0IHZpYSBzZXRTdGF0ZS5cclxuXHQgKiBAcmV0dXJucyB7P30gSW50ZXJuYWwgc3RhdGVcclxuXHQgKi9cclxuXHRnZXRTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gW3RoaXMuX3MwLCB0aGlzLl9zMSwgdGhpcy5fczIsIHRoaXMuX2NdO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIFNldCBhIHByZXZpb3VzbHkgcmV0cmlldmVkIHN0YXRlLlxyXG5cdCAqIEBwYXJhbSB7P30gc3RhdGVcclxuXHQgKi9cclxuXHRzZXRTdGF0ZTogZnVuY3Rpb24oc3RhdGUpIHtcclxuXHRcdHRoaXMuX3MwID0gc3RhdGVbMF07XHJcblx0XHR0aGlzLl9zMSA9IHN0YXRlWzFdO1xyXG5cdFx0dGhpcy5fczIgPSBzdGF0ZVsyXTtcclxuXHRcdHRoaXMuX2MgID0gc3RhdGVbM107XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIGEgY2xvbmVkIFJOR1xyXG5cdCAqL1xyXG5cdGNsb25lOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBjbG9uZSA9IE9iamVjdC5jcmVhdGUodGhpcyk7XHJcblx0XHRjbG9uZS5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlKCkpO1xyXG5cdFx0cmV0dXJuIGNsb25lO1xyXG5cdH0sXHJcblxyXG5cdF9zMDogMCxcclxuXHRfczE6IDAsXHJcblx0X3MyOiAwLFxyXG5cdF9jOiAwLFxyXG5cdF9mcmFjOiAyLjMyODMwNjQzNjUzODY5NjNlLTEwIC8qIDJeLTMyICovXHJcbn07XHJcblxyXG5ST1QuUk5HLnNldFNlZWQoRGF0ZS5ub3coKSk7XHJcbi8qKlxyXG4gKiBAY2xhc3MgKE1hcmtvdiBwcm9jZXNzKS1iYXNlZCBzdHJpbmcgZ2VuZXJhdG9yLiBcclxuICogQ29waWVkIGZyb20gYSA8YSBocmVmPVwiaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9TmFtZXNfZnJvbV9hX2hpZ2hfb3JkZXJfTWFya292X1Byb2Nlc3NfYW5kX2Ffc2ltcGxpZmllZF9LYXR6X2JhY2stb2ZmX3NjaGVtZVwiPlJvZ3VlQmFzaW4gYXJ0aWNsZTwvYT4uIFxyXG4gKiBPZmZlcnMgY29uZmlndXJhYmxlIG9yZGVyIGFuZCBwcmlvci5cclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2Jvb2x9IFtvcHRpb25zLndvcmRzPWZhbHNlXSBVc2Ugd29yZCBtb2RlP1xyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMub3JkZXI9M11cclxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMucHJpb3I9MC4wMDFdXHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHR3b3JkczogZmFsc2UsXHJcblx0XHRvcmRlcjogMyxcclxuXHRcdHByaW9yOiAwLjAwMVxyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblxyXG5cdHRoaXMuX2JvdW5kYXJ5ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgwKTtcclxuXHR0aGlzLl9zdWZmaXggPSB0aGlzLl9ib3VuZGFyeTtcclxuXHR0aGlzLl9wcmVmaXggPSBbXTtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9vcHRpb25zLm9yZGVyO2krKykgeyB0aGlzLl9wcmVmaXgucHVzaCh0aGlzLl9ib3VuZGFyeSk7IH1cclxuXHJcblx0dGhpcy5fcHJpb3JWYWx1ZXMgPSB7fTtcclxuXHR0aGlzLl9wcmlvclZhbHVlc1t0aGlzLl9ib3VuZGFyeV0gPSB0aGlzLl9vcHRpb25zLnByaW9yO1xyXG5cclxuXHR0aGlzLl9kYXRhID0ge307XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGFsbCBsZWFybmluZyBkYXRhXHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2RhdGEgPSB7fTtcclxuXHR0aGlzLl9wcmlvclZhbHVlcyA9IHt9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEdlbmVyYXRlZCBzdHJpbmdcclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHJlc3VsdCA9IFt0aGlzLl9zYW1wbGUodGhpcy5fcHJlZml4KV07XHJcblx0d2hpbGUgKHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdICE9IHRoaXMuX2JvdW5kYXJ5KSB7XHJcblx0XHRyZXN1bHQucHVzaCh0aGlzLl9zYW1wbGUocmVzdWx0KSk7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzLl9qb2luKHJlc3VsdC5zbGljZSgwLCAtMSkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE9ic2VydmUgKGxlYXJuKSBhIHN0cmluZyBmcm9tIGEgdHJhaW5pbmcgc2V0XHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24oc3RyaW5nKSB7XHJcblx0dmFyIHRva2VucyA9IHRoaXMuX3NwbGl0KHN0cmluZyk7XHJcblxyXG5cdGZvciAodmFyIGk9MDsgaTx0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHRoaXMuX3ByaW9yVmFsdWVzW3Rva2Vuc1tpXV0gPSB0aGlzLl9vcHRpb25zLnByaW9yO1xyXG5cdH1cclxuXHJcblx0dG9rZW5zID0gdGhpcy5fcHJlZml4LmNvbmNhdCh0b2tlbnMpLmNvbmNhdCh0aGlzLl9zdWZmaXgpOyAvKiBhZGQgYm91bmRhcnkgc3ltYm9scyAqL1xyXG5cclxuXHRmb3IgKHZhciBpPXRoaXMuX29wdGlvbnMub3JkZXI7IGk8dG9rZW5zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgY29udGV4dCA9IHRva2Vucy5zbGljZShpLXRoaXMuX29wdGlvbnMub3JkZXIsIGkpO1xyXG5cdFx0dmFyIGV2ZW50ID0gdG9rZW5zW2ldO1xyXG5cdFx0Zm9yICh2YXIgaj0wOyBqPGNvbnRleHQubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0dmFyIHN1YmNvbnRleHQgPSBjb250ZXh0LnNsaWNlKGopO1xyXG5cdFx0XHR0aGlzLl9vYnNlcnZlRXZlbnQoc3ViY29udGV4dCwgZXZlbnQpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLmdldFN0YXRzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHBhcnRzID0gW107XHJcblxyXG5cdHZhciBwcmlvckNvdW50ID0gMDtcclxuXHRmb3IgKHZhciBwIGluIHRoaXMuX3ByaW9yVmFsdWVzKSB7IHByaW9yQ291bnQrKzsgfVxyXG5cdHByaW9yQ291bnQtLTsgLyogYm91bmRhcnkgKi9cclxuXHRwYXJ0cy5wdXNoKFwiZGlzdGluY3Qgc2FtcGxlczogXCIgKyBwcmlvckNvdW50KTtcclxuXHJcblx0dmFyIGRhdGFDb3VudCA9IDA7XHJcblx0dmFyIGV2ZW50Q291bnQgPSAwO1xyXG5cdGZvciAodmFyIHAgaW4gdGhpcy5fZGF0YSkgeyBcclxuXHRcdGRhdGFDb3VudCsrOyBcclxuXHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl9kYXRhW3BdKSB7XHJcblx0XHRcdGV2ZW50Q291bnQrKztcclxuXHRcdH1cclxuXHR9XHJcblx0cGFydHMucHVzaChcImRpY3Rpb25hcnkgc2l6ZSAoY29udGV4dHMpOiBcIiArIGRhdGFDb3VudCk7XHJcblx0cGFydHMucHVzaChcImRpY3Rpb25hcnkgc2l6ZSAoZXZlbnRzKTogXCIgKyBldmVudENvdW50KTtcclxuXHJcblx0cmV0dXJuIHBhcnRzLmpvaW4oXCIsIFwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ31cclxuICogQHJldHVybnMge3N0cmluZ1tdfVxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuX3NwbGl0ID0gZnVuY3Rpb24oc3RyKSB7XHJcblx0cmV0dXJuIHN0ci5zcGxpdCh0aGlzLl9vcHRpb25zLndvcmRzID8gL1xccysvIDogXCJcIik7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmdbXX1cclxuICogQHJldHVybnMge3N0cmluZ30gXHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fam9pbiA9IGZ1bmN0aW9uKGFycikge1xyXG5cdHJldHVybiBhcnIuam9pbih0aGlzLl9vcHRpb25zLndvcmRzID8gXCIgXCIgOiBcIlwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBjb250ZXh0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuX29ic2VydmVFdmVudCA9IGZ1bmN0aW9uKGNvbnRleHQsIGV2ZW50KSB7XHJcblx0dmFyIGtleSA9IHRoaXMuX2pvaW4oY29udGV4dCk7XHJcblx0aWYgKCEoa2V5IGluIHRoaXMuX2RhdGEpKSB7IHRoaXMuX2RhdGFba2V5XSA9IHt9OyB9XHJcblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XHJcblxyXG5cdGlmICghKGV2ZW50IGluIGRhdGEpKSB7IGRhdGFbZXZlbnRdID0gMDsgfVxyXG5cdGRhdGFbZXZlbnRdKys7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmdbXX1cclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9zYW1wbGUgPSBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0Y29udGV4dCA9IHRoaXMuX2JhY2tvZmYoY29udGV4dCk7XHJcblx0dmFyIGtleSA9IHRoaXMuX2pvaW4oY29udGV4dCk7XHJcblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XHJcblxyXG5cdHZhciBhdmFpbGFibGUgPSB7fTtcclxuXHJcblx0aWYgKHRoaXMuX29wdGlvbnMucHJpb3IpIHtcclxuXHRcdGZvciAodmFyIGV2ZW50IGluIHRoaXMuX3ByaW9yVmFsdWVzKSB7IGF2YWlsYWJsZVtldmVudF0gPSB0aGlzLl9wcmlvclZhbHVlc1tldmVudF07IH1cclxuXHRcdGZvciAodmFyIGV2ZW50IGluIGRhdGEpIHsgYXZhaWxhYmxlW2V2ZW50XSArPSBkYXRhW2V2ZW50XTsgfVxyXG5cdH0gZWxzZSB7IFxyXG5cdFx0YXZhaWxhYmxlID0gZGF0YTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBST1QuUk5HLmdldFdlaWdodGVkVmFsdWUoYXZhaWxhYmxlKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nW119XHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fYmFja29mZiA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRpZiAoY29udGV4dC5sZW5ndGggPiB0aGlzLl9vcHRpb25zLm9yZGVyKSB7XHJcblx0XHRjb250ZXh0ID0gY29udGV4dC5zbGljZSgtdGhpcy5fb3B0aW9ucy5vcmRlcik7XHJcblx0fSBlbHNlIGlmIChjb250ZXh0Lmxlbmd0aCA8IHRoaXMuX29wdGlvbnMub3JkZXIpIHtcclxuXHRcdGNvbnRleHQgPSB0aGlzLl9wcmVmaXguc2xpY2UoMCwgdGhpcy5fb3B0aW9ucy5vcmRlciAtIGNvbnRleHQubGVuZ3RoKS5jb25jYXQoY29udGV4dCk7XHJcblx0fVxyXG5cclxuXHR3aGlsZSAoISh0aGlzLl9qb2luKGNvbnRleHQpIGluIHRoaXMuX2RhdGEpICYmIGNvbnRleHQubGVuZ3RoID4gMCkgeyBjb250ZXh0ID0gY29udGV4dC5zbGljZSgxKTsgfVxyXG5cclxuXHRyZXR1cm4gY29udGV4dDtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBHZW5lcmljIGV2ZW50IHF1ZXVlOiBzdG9yZXMgZXZlbnRzIGFuZCByZXRyaWV2ZXMgdGhlbSBiYXNlZCBvbiB0aGVpciB0aW1lXHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX3RpbWUgPSAwO1xyXG5cdHRoaXMuX2V2ZW50cyA9IFtdO1xyXG5cdHRoaXMuX2V2ZW50VGltZXMgPSBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBFbGFwc2VkIHRpbWVcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5nZXRUaW1lID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3RpbWU7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xlYXIgYWxsIHNjaGVkdWxlZCBldmVudHNcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2V2ZW50cyA9IFtdO1xyXG5cdHRoaXMuX2V2ZW50VGltZXMgPSBbXTtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gez99IGV2ZW50XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lXHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oZXZlbnQsIHRpbWUpIHtcclxuXHR2YXIgaW5kZXggPSB0aGlzLl9ldmVudHMubGVuZ3RoO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX2V2ZW50VGltZXMubGVuZ3RoO2krKykge1xyXG5cdFx0aWYgKHRoaXMuX2V2ZW50VGltZXNbaV0gPiB0aW1lKSB7XHJcblx0XHRcdGluZGV4ID0gaTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aGlzLl9ldmVudHMuc3BsaWNlKGluZGV4LCAwLCBldmVudCk7XHJcblx0dGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoaW5kZXgsIDAsIHRpbWUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIExvY2F0ZXMgdGhlIG5lYXJlc3QgZXZlbnQsIGFkdmFuY2VzIHRpbWUgaWYgbmVjZXNzYXJ5LiBSZXR1cm5zIHRoYXQgZXZlbnQgYW5kIHJlbW92ZXMgaXQgZnJvbSB0aGUgcXVldWUuXHJcbiAqIEByZXR1cm5zIHs/IHx8IG51bGx9IFRoZSBldmVudCBwcmV2aW91c2x5IGFkZGVkIGJ5IGFkZEV2ZW50LCBudWxsIGlmIG5vIGV2ZW50IGF2YWlsYWJsZVxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCkge1xyXG5cdGlmICghdGhpcy5fZXZlbnRzLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfVxyXG5cclxuXHR2YXIgdGltZSA9IHRoaXMuX2V2ZW50VGltZXMuc3BsaWNlKDAsIDEpWzBdO1xyXG5cdGlmICh0aW1lID4gMCkgeyAvKiBhZHZhbmNlICovXHJcblx0XHR0aGlzLl90aW1lICs9IHRpbWU7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl9ldmVudFRpbWVzLmxlbmd0aDtpKyspIHsgdGhpcy5fZXZlbnRUaW1lc1tpXSAtPSB0aW1lOyB9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcy5fZXZlbnRzLnNwbGljZSgwLCAxKVswXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHRpbWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBldmVudFxyXG4gKiBAcGFyYW0gez99IGV2ZW50XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHRpbWVcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5nZXRFdmVudFRpbWUgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdHZhciBpbmRleCA9IHRoaXMuX2V2ZW50cy5pbmRleE9mKGV2ZW50KTtcclxuXHRpZiAoaW5kZXggPT0gLTEpIHsgcmV0dXJuIHVuZGVmaW5lZCB9XHJcblx0cmV0dXJuIHRoaXMuX2V2ZW50VGltZXNbaW5kZXhdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhbiBldmVudCBmcm9tIHRoZSBxdWV1ZVxyXG4gKiBAcGFyYW0gez99IGV2ZW50XHJcbiAqIEByZXR1cm5zIHtib29sfSBzdWNjZXNzP1xyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0dmFyIGluZGV4ID0gdGhpcy5fZXZlbnRzLmluZGV4T2YoZXZlbnQpO1xyXG5cdGlmIChpbmRleCA9PSAtMSkgeyByZXR1cm4gZmFsc2UgfVxyXG5cdHRoaXMuX3JlbW92ZShpbmRleCk7XHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGFuIGV2ZW50IGZyb20gdGhlIHF1ZXVlXHJcbiAqIEBwYXJhbSB7aW50fSBpbmRleFxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLl9yZW1vdmUgPSBmdW5jdGlvbihpbmRleCkge1xyXG5cdHRoaXMuX2V2ZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdHRoaXMuX2V2ZW50VGltZXMuc3BsaWNlKGluZGV4LCAxKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBBYnN0cmFjdCBzY2hlZHVsZXJcclxuICovXHJcblJPVC5TY2hlZHVsZXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9xdWV1ZSA9IG5ldyBST1QuRXZlbnRRdWV1ZSgpO1xyXG5cdHRoaXMuX3JlcGVhdCA9IFtdO1xyXG5cdHRoaXMuX2N1cnJlbnQgPSBudWxsO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULkV2ZW50UXVldWUjZ2V0VGltZVxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuZ2V0VGltZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9xdWV1ZS5nZXRUaW1lKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHs/fSBpdGVtXHJcbiAqIEBwYXJhbSB7Ym9vbH0gcmVwZWF0XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQpIHtcclxuXHRpZiAocmVwZWF0KSB7IHRoaXMuX3JlcGVhdC5wdXNoKGl0ZW0pOyB9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHRoZSB0aW1lIHRoZSBnaXZlbiBpdGVtIGlzIHNjaGVkdWxlZCBmb3JcclxuICogQHBhcmFtIHs/fSBpdGVtXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHRpbWVcclxuICovXHJcblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmdldFRpbWVPZiA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRyZXR1cm4gdGhpcy5fcXVldWUuZ2V0RXZlbnRUaW1lKGl0ZW0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsZWFyIGFsbCBpdGVtc1xyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9xdWV1ZS5jbGVhcigpO1xyXG5cdHRoaXMuX3JlcGVhdCA9IFtdO1xyXG5cdHRoaXMuX2N1cnJlbnQgPSBudWxsO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhIHByZXZpb3VzbHkgYWRkZWQgaXRlbVxyXG4gKiBAcGFyYW0gez99IGl0ZW1cclxuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3NmdWw/XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0dmFyIHJlc3VsdCA9IHRoaXMuX3F1ZXVlLnJlbW92ZShpdGVtKTtcclxuXHJcblx0dmFyIGluZGV4ID0gdGhpcy5fcmVwZWF0LmluZGV4T2YoaXRlbSk7XHJcblx0aWYgKGluZGV4ICE9IC0xKSB7IHRoaXMuX3JlcGVhdC5zcGxpY2UoaW5kZXgsIDEpOyB9XHJcblxyXG5cdGlmICh0aGlzLl9jdXJyZW50ID09IGl0ZW0pIHsgdGhpcy5fY3VycmVudCA9IG51bGw7IH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTY2hlZHVsZSBuZXh0IGl0ZW1cclxuICogQHJldHVybnMgez99XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fY3VycmVudCA9IHRoaXMuX3F1ZXVlLmdldCgpO1xyXG5cdHJldHVybiB0aGlzLl9jdXJyZW50O1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFNpbXBsZSBmYWlyIHNjaGVkdWxlciAocm91bmQtcm9iaW4gc3R5bGUpXHJcbiAqIEBhdWdtZW50cyBST1QuU2NoZWR1bGVyXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLlNpbXBsZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFJPVC5TY2hlZHVsZXIuY2FsbCh0aGlzKTtcclxufTtcclxuUk9ULlNjaGVkdWxlci5TaW1wbGUuZXh0ZW5kKFJPVC5TY2hlZHVsZXIpO1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNhZGRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU2ltcGxlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQpIHtcclxuXHR0aGlzLl9xdWV1ZS5hZGQoaXRlbSwgMCk7XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGl0ZW0sIHJlcGVhdCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuU2NoZWR1bGVyI25leHRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU2ltcGxlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKHRoaXMuX2N1cnJlbnQgJiYgdGhpcy5fcmVwZWF0LmluZGV4T2YodGhpcy5fY3VycmVudCkgIT0gLTEpIHtcclxuXHRcdHRoaXMuX3F1ZXVlLmFkZCh0aGlzLl9jdXJyZW50LCAwKTtcclxuXHR9XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBTcGVlZC1iYXNlZCBzY2hlZHVsZXJcclxuICogQGF1Z21lbnRzIFJPVC5TY2hlZHVsZXJcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU3BlZWQgPSBmdW5jdGlvbigpIHtcclxuXHRST1QuU2NoZWR1bGVyLmNhbGwodGhpcyk7XHJcbn07XHJcblJPVC5TY2hlZHVsZXIuU3BlZWQuZXh0ZW5kKFJPVC5TY2hlZHVsZXIpO1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtIGFueXRoaW5nIHdpdGggXCJnZXRTcGVlZFwiIG1ldGhvZFxyXG4gKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3RpbWU9MS9pdGVtLmdldFNwZWVkKCldXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNhZGRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU3BlZWQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCwgdGltZSkge1xyXG5cdHRoaXMuX3F1ZXVlLmFkZChpdGVtLCB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogMS9pdGVtLmdldFNwZWVkKCkpO1xyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5hZGQuY2FsbCh0aGlzLCBpdGVtLCByZXBlYXQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNuZXh0XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLlNwZWVkLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKHRoaXMuX2N1cnJlbnQgJiYgdGhpcy5fcmVwZWF0LmluZGV4T2YodGhpcy5fY3VycmVudCkgIT0gLTEpIHtcclxuXHRcdHRoaXMuX3F1ZXVlLmFkZCh0aGlzLl9jdXJyZW50LCAxL3RoaXMuX2N1cnJlbnQuZ2V0U3BlZWQoKSk7XHJcblx0fVxyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQWN0aW9uLWJhc2VkIHNjaGVkdWxlclxyXG4gKiBAYXVnbWVudHMgUk9ULlNjaGVkdWxlclxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuXHRST1QuU2NoZWR1bGVyLmNhbGwodGhpcyk7XHJcblx0dGhpcy5fZGVmYXVsdER1cmF0aW9uID0gMTsgLyogZm9yIG5ld2x5IGFkZGVkICovXHJcblx0dGhpcy5fZHVyYXRpb24gPSB0aGlzLl9kZWZhdWx0RHVyYXRpb247IC8qIGZvciB0aGlzLl9jdXJyZW50ICovXHJcbn07XHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uLmV4dGVuZChST1QuU2NoZWR1bGVyKTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge29iamVjdH0gaXRlbVxyXG4gKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3RpbWU9MV1cclxuICogQHNlZSBST1QuU2NoZWR1bGVyI2FkZFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCwgdGltZSkge1xyXG5cdHRoaXMuX3F1ZXVlLmFkZChpdGVtLCB0aW1lIHx8IHRoaXMuX2RlZmF1bHREdXJhdGlvbik7XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGl0ZW0sIHJlcGVhdCk7XHJcbn07XHJcblxyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjtcclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuY2xlYXIuY2FsbCh0aGlzKTtcclxufTtcclxuXHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0aWYgKGl0ZW0gPT0gdGhpcy5fY3VycmVudCkgeyB0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjsgfVxyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5yZW1vdmUuY2FsbCh0aGlzLCBpdGVtKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjbmV4dFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcclxuXHRpZiAodGhpcy5fY3VycmVudCAmJiB0aGlzLl9yZXBlYXQuaW5kZXhPZih0aGlzLl9jdXJyZW50KSAhPSAtMSkge1xyXG5cdFx0dGhpcy5fcXVldWUuYWRkKHRoaXMuX2N1cnJlbnQsIHRoaXMuX2R1cmF0aW9uIHx8IHRoaXMuX2RlZmF1bHREdXJhdGlvbik7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjtcclxuXHR9XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZHVyYXRpb24gZm9yIHRoZSBhY3RpdmUgaXRlbVxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLnNldER1cmF0aW9uID0gZnVuY3Rpb24odGltZSkge1xyXG5cdGlmICh0aGlzLl9jdXJyZW50KSB7IHRoaXMuX2R1cmF0aW9uID0gdGltZTsgfVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEFzeW5jaHJvbm91cyBtYWluIGxvb3BcclxuICogQHBhcmFtIHtST1QuU2NoZWR1bGVyfSBzY2hlZHVsZXJcclxuICovXHJcblJPVC5FbmdpbmUgPSBmdW5jdGlvbihzY2hlZHVsZXIpIHtcclxuXHR0aGlzLl9zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XHJcblx0dGhpcy5fbG9jayA9IDE7XHJcbn07XHJcblxyXG4vKipcclxuICogU3RhcnQgdGhlIG1haW4gbG9vcC4gV2hlbiB0aGlzIGNhbGwgcmV0dXJucywgdGhlIGxvb3AgaXMgbG9ja2VkLlxyXG4gKi9cclxuUk9ULkVuZ2luZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy51bmxvY2soKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbnRlcnJ1cHQgdGhlIGVuZ2luZSBieSBhbiBhc3luY2hyb25vdXMgYWN0aW9uXHJcbiAqL1xyXG5ST1QuRW5naW5lLnByb3RvdHlwZS5sb2NrID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fbG9jaysrO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlc3VtZSBleGVjdXRpb24gKHBhdXNlZCBieSBhIHByZXZpb3VzIGxvY2spXHJcbiAqL1xyXG5ST1QuRW5naW5lLnByb3RvdHlwZS51bmxvY2sgPSBmdW5jdGlvbigpIHtcclxuXHRpZiAoIXRoaXMuX2xvY2spIHsgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHVubG9jayB1bmxvY2tlZCBlbmdpbmVcIik7IH1cclxuXHR0aGlzLl9sb2NrLS07XHJcblxyXG5cdHdoaWxlICghdGhpcy5fbG9jaykge1xyXG5cdFx0dmFyIGFjdG9yID0gdGhpcy5fc2NoZWR1bGVyLm5leHQoKTtcclxuXHRcdGlmICghYWN0b3IpIHsgcmV0dXJuIHRoaXMubG9jaygpOyB9IC8qIG5vIGFjdG9ycyAqL1xyXG5cdFx0dmFyIHJlc3VsdCA9IGFjdG9yLmFjdCgpO1xyXG5cdFx0aWYgKHJlc3VsdCAmJiByZXN1bHQudGhlbikgeyAvKiBhY3RvciByZXR1cm5lZCBhIFwidGhlbmFibGVcIiwgbG9va3MgbGlrZSBhIFByb21pc2UgKi9cclxuXHRcdFx0dGhpcy5sb2NrKCk7XHJcblx0XHRcdHJlc3VsdC50aGVuKHRoaXMudW5sb2NrLmJpbmQodGhpcykpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQmFzZSBtYXAgZ2VuZXJhdG9yXHJcbiAqIEBwYXJhbSB7aW50fSBbd2lkdGg9Uk9ULkRFRkFVTFRfV0lEVEhdXHJcbiAqIEBwYXJhbSB7aW50fSBbaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cclxuICovXHJcblJPVC5NYXAgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0dGhpcy5fd2lkdGggPSB3aWR0aCB8fCBST1QuREVGQVVMVF9XSURUSDtcclxuXHR0aGlzLl9oZWlnaHQgPSBoZWlnaHQgfHwgUk9ULkRFRkFVTFRfSEVJR0hUO1xyXG59O1xyXG5cclxuUk9ULk1hcC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHt9O1xyXG5cclxuUk9ULk1hcC5wcm90b3R5cGUuX2ZpbGxNYXAgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdHZhciBtYXAgPSBbXTtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdG1hcC5wdXNoKFtdKTtcclxuXHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHsgbWFwW2ldLnB1c2godmFsdWUpOyB9XHJcblx0fVxyXG5cdHJldHVybiBtYXA7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgU2ltcGxlIGVtcHR5IHJlY3Rhbmd1bGFyIHJvb21cclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuQXJlbmEgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG59O1xyXG5ST1QuTWFwLkFyZW5hLmV4dGVuZChST1QuTWFwKTtcclxuXHJcblJPVC5NYXAuQXJlbmEucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIHcgPSB0aGlzLl93aWR0aC0xO1xyXG5cdHZhciBoID0gdGhpcy5faGVpZ2h0LTE7XHJcblx0Zm9yICh2YXIgaT0wO2k8PXc7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajw9aDtqKyspIHtcclxuXHRcdFx0dmFyIGVtcHR5ID0gKGkgJiYgaiAmJiBpPHcgJiYgajxoKTtcclxuXHRcdFx0Y2FsbGJhY2soaSwgaiwgZW1wdHkgPyAwIDogMSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFJlY3Vyc2l2ZWx5IGRpdmlkZWQgbWF6ZSwgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NYXplX2dlbmVyYXRpb25fYWxnb3JpdGhtI1JlY3Vyc2l2ZV9kaXZpc2lvbl9tZXRob2RcclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuRGl2aWRlZE1hemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdHRoaXMuX3N0YWNrID0gW107XHJcbn07XHJcblJPVC5NYXAuRGl2aWRlZE1hemUuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR2YXIgdyA9IHRoaXMuX3dpZHRoO1xyXG5cdHZhciBoID0gdGhpcy5faGVpZ2h0O1xyXG5cdFxyXG5cdHRoaXMuX21hcCA9IFtdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XHJcblx0XHR0aGlzLl9tYXAucHVzaChbXSk7XHJcblx0XHRmb3IgKHZhciBqPTA7ajxoO2orKykge1xyXG5cdFx0XHR2YXIgYm9yZGVyID0gKGkgPT0gMCB8fCBqID09IDAgfHwgaSsxID09IHcgfHwgaisxID09IGgpO1xyXG5cdFx0XHR0aGlzLl9tYXBbaV0ucHVzaChib3JkZXIgPyAxIDogMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX3N0YWNrID0gW1xyXG5cdFx0WzEsIDEsIHctMiwgaC0yXVxyXG5cdF07XHJcblx0dGhpcy5fcHJvY2VzcygpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajxoO2orKykge1xyXG5cdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR0aGlzLl9tYXAgPSBudWxsO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5wcm90b3R5cGUuX3Byb2Nlc3MgPSBmdW5jdGlvbigpIHtcclxuXHR3aGlsZSAodGhpcy5fc3RhY2subGVuZ3RoKSB7XHJcblx0XHR2YXIgcm9vbSA9IHRoaXMuX3N0YWNrLnNoaWZ0KCk7IC8qIFtsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b21dICovXHJcblx0XHR0aGlzLl9wYXJ0aXRpb25Sb29tKHJvb20pO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuRGl2aWRlZE1hemUucHJvdG90eXBlLl9wYXJ0aXRpb25Sb29tID0gZnVuY3Rpb24ocm9vbSkge1xyXG5cdHZhciBhdmFpbFggPSBbXTtcclxuXHR2YXIgYXZhaWxZID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT1yb29tWzBdKzE7aTxyb29tWzJdO2krKykge1xyXG5cdFx0dmFyIHRvcCA9IHRoaXMuX21hcFtpXVtyb29tWzFdLTFdO1xyXG5cdFx0dmFyIGJvdHRvbSA9IHRoaXMuX21hcFtpXVtyb29tWzNdKzFdO1xyXG5cdFx0aWYgKHRvcCAmJiBib3R0b20gJiYgIShpICUgMikpIHsgYXZhaWxYLnB1c2goaSk7IH1cclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaj1yb29tWzFdKzE7ajxyb29tWzNdO2orKykge1xyXG5cdFx0dmFyIGxlZnQgPSB0aGlzLl9tYXBbcm9vbVswXS0xXVtqXTtcclxuXHRcdHZhciByaWdodCA9IHRoaXMuX21hcFtyb29tWzJdKzFdW2pdO1xyXG5cdFx0aWYgKGxlZnQgJiYgcmlnaHQgJiYgIShqICUgMikpIHsgYXZhaWxZLnB1c2goaik7IH1cclxuXHR9XHJcblxyXG5cdGlmICghYXZhaWxYLmxlbmd0aCB8fCAhYXZhaWxZLmxlbmd0aCkgeyByZXR1cm47IH1cclxuXHJcblx0dmFyIHggPSBhdmFpbFgucmFuZG9tKCk7XHJcblx0dmFyIHkgPSBhdmFpbFkucmFuZG9tKCk7XHJcblx0XHJcblx0dGhpcy5fbWFwW3hdW3ldID0gMTtcclxuXHRcclxuXHR2YXIgd2FsbHMgPSBbXTtcclxuXHRcclxuXHR2YXIgdyA9IFtdOyB3YWxscy5wdXNoKHcpOyAvKiBsZWZ0IHBhcnQgKi9cclxuXHRmb3IgKHZhciBpPXJvb21bMF07IGk8eDsgaSsrKSB7IFxyXG5cdFx0dGhpcy5fbWFwW2ldW3ldID0gMTtcclxuXHRcdHcucHVzaChbaSwgeV0pOyBcclxuXHR9XHJcblx0XHJcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogcmlnaHQgcGFydCAqL1xyXG5cdGZvciAodmFyIGk9eCsxOyBpPD1yb29tWzJdOyBpKyspIHsgXHJcblx0XHR0aGlzLl9tYXBbaV1beV0gPSAxO1xyXG5cdFx0dy5wdXNoKFtpLCB5XSk7IFxyXG5cdH1cclxuXHJcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogdG9wIHBhcnQgKi9cclxuXHRmb3IgKHZhciBqPXJvb21bMV07IGo8eTsgaisrKSB7IFxyXG5cdFx0dGhpcy5fbWFwW3hdW2pdID0gMTtcclxuXHRcdHcucHVzaChbeCwgal0pOyBcclxuXHR9XHJcblx0XHJcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogYm90dG9tIHBhcnQgKi9cclxuXHRmb3IgKHZhciBqPXkrMTsgajw9cm9vbVszXTsgaisrKSB7IFxyXG5cdFx0dGhpcy5fbWFwW3hdW2pdID0gMTtcclxuXHRcdHcucHVzaChbeCwgal0pOyBcclxuXHR9XHJcblx0XHRcclxuXHR2YXIgc29saWQgPSB3YWxscy5yYW5kb20oKTtcclxuXHRmb3IgKHZhciBpPTA7aTx3YWxscy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgdyA9IHdhbGxzW2ldO1xyXG5cdFx0aWYgKHcgPT0gc29saWQpIHsgY29udGludWU7IH1cclxuXHRcdFxyXG5cdFx0dmFyIGhvbGUgPSB3LnJhbmRvbSgpO1xyXG5cdFx0dGhpcy5fbWFwW2hvbGVbMF1dW2hvbGVbMV1dID0gMDtcclxuXHR9XHJcblxyXG5cdHRoaXMuX3N0YWNrLnB1c2goW3Jvb21bMF0sIHJvb21bMV0sIHgtMSwgeS0xXSk7IC8qIGxlZnQgdG9wICovXHJcblx0dGhpcy5fc3RhY2sucHVzaChbeCsxLCByb29tWzFdLCByb29tWzJdLCB5LTFdKTsgLyogcmlnaHQgdG9wICovXHJcblx0dGhpcy5fc3RhY2sucHVzaChbcm9vbVswXSwgeSsxLCB4LTEsIHJvb21bM11dKTsgLyogbGVmdCBib3R0b20gKi9cclxuXHR0aGlzLl9zdGFjay5wdXNoKFt4KzEsIHkrMSwgcm9vbVsyXSwgcm9vbVszXV0pOyAvKiByaWdodCBib3R0b20gKi9cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBJY2V5J3MgTWF6ZSBnZW5lcmF0b3JcclxuICogU2VlIGh0dHA6Ly93d3cucm9ndWViYXNpbi5yb2d1ZWxpa2VkZXZlbG9wbWVudC5vcmcvaW5kZXgucGhwP3RpdGxlPVNpbXBsZV9tYXplIGZvciBleHBsYW5hdGlvblxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKi9cclxuUk9ULk1hcC5JY2V5TWF6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIHJlZ3VsYXJpdHkpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblx0dGhpcy5fcmVndWxhcml0eSA9IHJlZ3VsYXJpdHkgfHwgMDtcclxufTtcclxuUk9ULk1hcC5JY2V5TWF6ZS5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG5ST1QuTWFwLkljZXlNYXplLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciB3aWR0aCA9IHRoaXMuX3dpZHRoO1xyXG5cdHZhciBoZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XHJcblx0XHJcblx0dmFyIG1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0XHJcblx0d2lkdGggLT0gKHdpZHRoICUgMiA/IDEgOiAyKTtcclxuXHRoZWlnaHQgLT0gKGhlaWdodCAlIDIgPyAxIDogMik7XHJcblxyXG5cdHZhciBjeCA9IDA7XHJcblx0dmFyIGN5ID0gMDtcclxuXHR2YXIgbnggPSAwO1xyXG5cdHZhciBueSA9IDA7XHJcblxyXG5cdHZhciBkb25lID0gMDtcclxuXHR2YXIgYmxvY2tlZCA9IGZhbHNlO1xyXG5cdHZhciBkaXJzID0gW1xyXG5cdFx0WzAsIDBdLFxyXG5cdFx0WzAsIDBdLFxyXG5cdFx0WzAsIDBdLFxyXG5cdFx0WzAsIDBdXHJcblx0XTtcclxuXHRkbyB7XHJcblx0XHRjeCA9IDEgKyAyKk1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqKHdpZHRoLTEpIC8gMik7XHJcblx0XHRjeSA9IDEgKyAyKk1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqKGhlaWdodC0xKSAvIDIpO1xyXG5cclxuXHRcdGlmICghZG9uZSkgeyBtYXBbY3hdW2N5XSA9IDA7IH1cclxuXHRcdFxyXG5cdFx0aWYgKCFtYXBbY3hdW2N5XSkge1xyXG5cdFx0XHR0aGlzLl9yYW5kb21pemUoZGlycyk7XHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHRpZiAoTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSoodGhpcy5fcmVndWxhcml0eSsxKSkgPT0gMCkgeyB0aGlzLl9yYW5kb21pemUoZGlycyk7IH1cclxuXHRcdFx0XHRibG9ja2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRmb3IgKHZhciBpPTA7aTw0O2krKykge1xyXG5cdFx0XHRcdFx0bnggPSBjeCArIGRpcnNbaV1bMF0qMjtcclxuXHRcdFx0XHRcdG55ID0gY3kgKyBkaXJzW2ldWzFdKjI7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5faXNGcmVlKG1hcCwgbngsIG55LCB3aWR0aCwgaGVpZ2h0KSkge1xyXG5cdFx0XHRcdFx0XHRtYXBbbnhdW255XSA9IDA7XHJcblx0XHRcdFx0XHRcdG1hcFtjeCArIGRpcnNbaV1bMF1dW2N5ICsgZGlyc1tpXVsxXV0gPSAwO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Y3ggPSBueDtcclxuXHRcdFx0XHRcdFx0Y3kgPSBueTtcclxuXHRcdFx0XHRcdFx0YmxvY2tlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRkb25lKys7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSB3aGlsZSAoIWJsb2NrZWQpO1xyXG5cdFx0fVxyXG5cdH0gd2hpbGUgKGRvbmUrMSA8IHdpZHRoKmhlaWdodC80KTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdFx0Y2FsbGJhY2soaSwgaiwgbWFwW2ldW2pdKTtcclxuXHRcdH1cclxuXHR9XHJcblx0dGhpcy5fbWFwID0gbnVsbDtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuSWNleU1hemUucHJvdG90eXBlLl9yYW5kb21pemUgPSBmdW5jdGlvbihkaXJzKSB7XHJcblx0Zm9yICh2YXIgaT0wO2k8NDtpKyspIHtcclxuXHRcdGRpcnNbaV1bMF0gPSAwO1xyXG5cdFx0ZGlyc1tpXVsxXSA9IDA7XHJcblx0fVxyXG5cdFxyXG5cdHN3aXRjaCAoTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSo0KSkge1xyXG5cdFx0Y2FzZSAwOlxyXG5cdFx0XHRkaXJzWzBdWzBdID0gLTE7IGRpcnNbMV1bMF0gPSAxO1xyXG5cdFx0XHRkaXJzWzJdWzFdID0gLTE7IGRpcnNbM11bMV0gPSAxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDE6XHJcblx0XHRcdGRpcnNbM11bMF0gPSAtMTsgZGlyc1syXVswXSA9IDE7XHJcblx0XHRcdGRpcnNbMV1bMV0gPSAtMTsgZGlyc1swXVsxXSA9IDE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMjpcclxuXHRcdFx0ZGlyc1syXVswXSA9IC0xOyBkaXJzWzNdWzBdID0gMTtcclxuXHRcdFx0ZGlyc1swXVsxXSA9IC0xOyBkaXJzWzFdWzFdID0gMTtcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAzOlxyXG5cdFx0XHRkaXJzWzFdWzBdID0gLTE7IGRpcnNbMF1bMF0gPSAxO1xyXG5cdFx0XHRkaXJzWzNdWzFdID0gLTE7IGRpcnNbMl1bMV0gPSAxO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5JY2V5TWF6ZS5wcm90b3R5cGUuX2lzRnJlZSA9IGZ1bmN0aW9uKG1hcCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG5cdGlmICh4IDwgMSB8fCB5IDwgMSB8fCB4ID49IHdpZHRoIHx8IHkgPj0gaGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiBtYXBbeF1beV07XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgTWF6ZSBnZW5lcmF0b3IgLSBFbGxlcidzIGFsZ29yaXRobVxyXG4gKiBTZWUgaHR0cDovL2hvbWVwYWdlcy5jd2kubmwvfnRyb21wL21hemUuaHRtbCBmb3IgZXhwbGFuYXRpb25cclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuRWxsZXJNYXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxufTtcclxuUk9ULk1hcC5FbGxlck1hemUuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuUk9ULk1hcC5FbGxlck1hemUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIG1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0dmFyIHcgPSBNYXRoLmNlaWwoKHRoaXMuX3dpZHRoLTIpLzIpO1xyXG5cdFxyXG5cdHZhciByYW5kID0gOS8yNDtcclxuXHRcclxuXHR2YXIgTCA9IFtdO1xyXG5cdHZhciBSID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcclxuXHRcdEwucHVzaChpKTtcclxuXHRcdFIucHVzaChpKTtcclxuXHR9XHJcblx0TC5wdXNoKHctMSk7IC8qIGZha2Ugc3RvcC1ibG9jayBhdCB0aGUgcmlnaHQgc2lkZSAqL1xyXG5cclxuXHRmb3IgKHZhciBqPTE7aiszPHRoaXMuX2hlaWdodDtqKz0yKSB7XHJcblx0XHQvKiBvbmUgcm93ICovXHJcblx0XHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xyXG5cdFx0XHQvKiBjZWxsIGNvb3JkcyAod2lsbCBiZSBhbHdheXMgZW1wdHkpICovXHJcblx0XHRcdHZhciB4ID0gMippKzE7XHJcblx0XHRcdHZhciB5ID0gajtcclxuXHRcdFx0bWFwW3hdW3ldID0gMDtcclxuXHRcdFx0XHJcblx0XHRcdC8qIHJpZ2h0IGNvbm5lY3Rpb24gKi9cclxuXHRcdFx0aWYgKGkgIT0gTFtpKzFdICYmIFJPVC5STkcuZ2V0VW5pZm9ybSgpID4gcmFuZCkge1xyXG5cdFx0XHRcdHRoaXMuX2FkZFRvTGlzdChpLCBMLCBSKTtcclxuXHRcdFx0XHRtYXBbeCsxXVt5XSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdC8qIGJvdHRvbSBjb25uZWN0aW9uICovXHJcblx0XHRcdGlmIChpICE9IExbaV0gJiYgUk9ULlJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSB7XHJcblx0XHRcdFx0LyogcmVtb3ZlIGNvbm5lY3Rpb24gKi9cclxuXHRcdFx0XHR0aGlzLl9yZW1vdmVGcm9tTGlzdChpLCBMLCBSKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvKiBjcmVhdGUgY29ubmVjdGlvbiAqL1xyXG5cdFx0XHRcdG1hcFt4XVt5KzFdID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyogbGFzdCByb3cgKi9cclxuXHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xyXG5cdFx0LyogY2VsbCBjb29yZHMgKHdpbGwgYmUgYWx3YXlzIGVtcHR5KSAqL1xyXG5cdFx0dmFyIHggPSAyKmkrMTtcclxuXHRcdHZhciB5ID0gajtcclxuXHRcdG1hcFt4XVt5XSA9IDA7XHJcblx0XHRcclxuXHRcdC8qIHJpZ2h0IGNvbm5lY3Rpb24gKi9cclxuXHRcdGlmIChpICE9IExbaSsxXSAmJiAoaSA9PSBMW2ldIHx8IFJPVC5STkcuZ2V0VW5pZm9ybSgpID4gcmFuZCkpIHtcclxuXHRcdFx0LyogZGlnIHJpZ2h0IGFsc28gaWYgdGhlIGNlbGwgaXMgc2VwYXJhdGVkLCBzbyBpdCBnZXRzIGNvbm5lY3RlZCB0byB0aGUgcmVzdCBvZiBtYXplICovXHJcblx0XHRcdHRoaXMuX2FkZFRvTGlzdChpLCBMLCBSKTtcclxuXHRcdFx0bWFwW3grMV1beV0gPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLl9yZW1vdmVGcm9tTGlzdChpLCBMLCBSKTtcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHRcdGNhbGxiYWNrKGksIGosIG1hcFtpXVtqXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBcImlcIiBmcm9tIGl0cyBsaXN0XHJcbiAqL1xyXG5ST1QuTWFwLkVsbGVyTWF6ZS5wcm90b3R5cGUuX3JlbW92ZUZyb21MaXN0ID0gZnVuY3Rpb24oaSwgTCwgUikge1xyXG5cdFJbTFtpXV0gPSBSW2ldO1xyXG5cdExbUltpXV0gPSBMW2ldO1xyXG5cdFJbaV0gPSBpO1xyXG5cdExbaV0gPSBpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEpvaW4gbGlzdHMgd2l0aCBcImlcIiBhbmQgXCJpKzFcIlxyXG4gKi9cclxuUk9ULk1hcC5FbGxlck1hemUucHJvdG90eXBlLl9hZGRUb0xpc3QgPSBmdW5jdGlvbihpLCBMLCBSKSB7XHJcblx0UltMW2krMV1dID0gUltpXTtcclxuXHRMW1JbaV1dID0gTFtpKzFdO1xyXG5cdFJbaV0gPSBpKzE7XHJcblx0TFtpKzFdID0gaTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBDZWxsdWxhciBhdXRvbWF0b24gbWFwIGdlbmVyYXRvclxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKiBAcGFyYW0ge2ludH0gW3dpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxyXG4gKiBAcGFyYW0ge2ludH0gW2hlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gT3B0aW9uc1xyXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5ib3JuXSBMaXN0IG9mIG5laWdoYm9yIGNvdW50cyBmb3IgYSBuZXcgY2VsbCB0byBiZSBib3JuIGluIGVtcHR5IHNwYWNlXHJcbiAqIEBwYXJhbSB7aW50W119IFtvcHRpb25zLnN1cnZpdmVdIExpc3Qgb2YgbmVpZ2hib3IgY291bnRzIGZvciBhbiBleGlzdGluZyAgY2VsbCB0byBzdXJ2aXZlXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50b3BvbG9neV0gVG9wb2xvZ3kgNCBvciA2IG9yIDhcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRib3JuOiBbNSwgNiwgNywgOF0sXHJcblx0XHRzdXJ2aXZlOiBbNCwgNSwgNiwgNywgOF0sXHJcblx0XHR0b3BvbG9neTogOFxyXG5cdH07XHJcblx0dGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuXHR0aGlzLl9kaXJzID0gUk9ULkRJUlNbdGhpcy5fb3B0aW9ucy50b3BvbG9neV07XHJcblx0dGhpcy5fbWFwID0gdGhpcy5fZmlsbE1hcCgwKTtcclxufTtcclxuUk9ULk1hcC5DZWxsdWxhci5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG4vKipcclxuICogRmlsbCB0aGUgbWFwIHdpdGggcmFuZG9tIHZhbHVlc1xyXG4gKiBAcGFyYW0ge2Zsb2F0fSBwcm9iYWJpbGl0eSBQcm9iYWJpbGl0eSBmb3IgYSBjZWxsIHRvIGJlY29tZSBhbGl2ZTsgMCA9IGFsbCBlbXB0eSwgMSA9IGFsbCBmdWxsXHJcbiAqL1xyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5yYW5kb21pemUgPSBmdW5jdGlvbihwcm9iYWJpbGl0eSkge1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0XHR0aGlzLl9tYXBbaV1bal0gPSAoUk9ULlJORy5nZXRVbmlmb3JtKCkgPCBwcm9iYWJpbGl0eSA/IDEgOiAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hhbmdlIG9wdGlvbnMuXHJcbiAqIEBzZWUgUk9ULk1hcC5DZWxsdWxhclxyXG4gKi9cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHksIHZhbHVlKSB7XHJcblx0dGhpcy5fbWFwW3hdW3ldID0gdmFsdWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciBuZXdNYXAgPSB0aGlzLl9maWxsTWFwKDApO1xyXG5cdHZhciBib3JuID0gdGhpcy5fb3B0aW9ucy5ib3JuO1xyXG5cdHZhciBzdXJ2aXZlID0gdGhpcy5fb3B0aW9ucy5zdXJ2aXZlO1xyXG5cclxuXHJcblx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0dmFyIHdpZHRoU3RlcCA9IDE7XHJcblx0XHR2YXIgd2lkdGhTdGFydCA9IDA7XHJcblx0XHRpZiAodGhpcy5fb3B0aW9ucy50b3BvbG9neSA9PSA2KSB7XHJcblx0XHRcdHdpZHRoU3RlcCA9IDI7XHJcblx0XHRcdHdpZHRoU3RhcnQgPSBqJTI7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgaT13aWR0aFN0YXJ0OyBpPHRoaXMuX3dpZHRoOyBpKz13aWR0aFN0ZXApIHtcclxuXHJcblx0XHRcdHZhciBjdXIgPSB0aGlzLl9tYXBbaV1bal07XHJcblx0XHRcdHZhciBuY291bnQgPSB0aGlzLl9nZXROZWlnaGJvcnMoaSwgaik7XHJcblxyXG5cdFx0XHRpZiAoY3VyICYmIHN1cnZpdmUuaW5kZXhPZihuY291bnQpICE9IC0xKSB7IC8qIHN1cnZpdmUgKi9cclxuXHRcdFx0XHRuZXdNYXBbaV1bal0gPSAxO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCFjdXIgJiYgYm9ybi5pbmRleE9mKG5jb3VudCkgIT0gLTEpIHsgLyogYm9ybiAqL1xyXG5cdFx0XHRcdG5ld01hcFtpXVtqXSA9IDE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuX21hcCA9IG5ld01hcDtcclxuXHJcblx0dGhpcy5zZXJ2aWNlQ2FsbGJhY2soY2FsbGJhY2spO1xyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuc2VydmljZUNhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRpZiAoIWNhbGxiYWNrKSB7IHJldHVybjsgfVxyXG5cclxuXHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHR2YXIgd2lkdGhTdGVwID0gMTtcclxuXHRcdHZhciB3aWR0aFN0YXJ0ID0gMDtcclxuXHRcdGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDYpIHtcclxuXHRcdFx0d2lkdGhTdGVwID0gMjtcclxuXHRcdFx0d2lkdGhTdGFydCA9IGolMjtcclxuXHRcdH1cclxuXHRcdGZvciAodmFyIGk9d2lkdGhTdGFydDsgaTx0aGlzLl93aWR0aDsgaSs9d2lkdGhTdGVwKSB7XHJcblx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBuZWlnaGJvciBjb3VudCBhdCBbaSxqXSBpbiB0aGlzLl9tYXBcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9nZXROZWlnaGJvcnMgPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHR2YXIgcmVzdWx0ID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9kaXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBkaXIgPSB0aGlzLl9kaXJzW2ldO1xyXG5cdFx0dmFyIHggPSBjeCArIGRpclswXTtcclxuXHRcdHZhciB5ID0gY3kgKyBkaXJbMV07XHJcblxyXG5cdFx0aWYgKHggPCAwIHx8IHggPj0gdGhpcy5fd2lkdGggfHwgeSA8IDAgfHwgeSA+PSB0aGlzLl93aWR0aCkgeyBjb250aW51ZTsgfVxyXG5cdFx0cmVzdWx0ICs9ICh0aGlzLl9tYXBbeF1beV0gPT0gMSA/IDEgOiAwKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vKipcclxuICogTWFrZSBzdXJlIGV2ZXJ5IG5vbi13YWxsIHNwYWNlIGlzIGFjY2Vzc2libGUuXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgdG8gZGlzcGxheSBtYXAgd2hlbiBkb1xyXG4gKiBAcGFyYW0ge2ludH0gdmFsdWUgdG8gY29uc2lkZXIgZW1wdHkgc3BhY2UgLSBkZWZhdWx0cyB0byAwXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgd2hlbiBhIG5ldyBjb25uZWN0aW9uIGlzIG1hZGVcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbihjYWxsYmFjaywgdmFsdWUsIGNvbm5lY3Rpb25DYWxsYmFjaykge1xyXG5cdGlmICghdmFsdWUpIHZhbHVlID0gMDtcclxuXHJcblx0dmFyIGFsbEZyZWVTcGFjZSA9IFtdO1xyXG5cdHZhciBub3RDb25uZWN0ZWQgPSB7fTtcclxuXHQvLyBmaW5kIGFsbCBmcmVlIHNwYWNlXHJcblx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLl93aWR0aDsgeCsrKSB7XHJcblx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuX2hlaWdodDsgeSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLl9mcmVlU3BhY2UoeCwgeSwgdmFsdWUpKSB7XHJcblx0XHRcdFx0dmFyIHAgPSBbeCwgeV07XHJcblx0XHRcdFx0bm90Q29ubmVjdGVkW3RoaXMuX3BvaW50S2V5KHApXSA9IHA7XHJcblx0XHRcdFx0YWxsRnJlZVNwYWNlLnB1c2goW3gsIHldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHR2YXIgc3RhcnQgPSBhbGxGcmVlU3BhY2VbUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGFsbEZyZWVTcGFjZS5sZW5ndGggLSAxKV07XHJcblxyXG5cdHZhciBrZXkgPSB0aGlzLl9wb2ludEtleShzdGFydCk7XHJcblx0dmFyIGNvbm5lY3RlZCA9IHt9O1xyXG5cdGNvbm5lY3RlZFtrZXldID0gc3RhcnQ7XHJcblx0ZGVsZXRlIG5vdENvbm5lY3RlZFtrZXldO1xyXG5cclxuXHQvLyBmaW5kIHdoYXQncyBjb25uZWN0ZWQgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XHJcblx0dGhpcy5fZmluZENvbm5lY3RlZChjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCwgW3N0YXJ0XSwgZmFsc2UsIHZhbHVlKTtcclxuXHJcblx0d2hpbGUgKE9iamVjdC5rZXlzKG5vdENvbm5lY3RlZCkubGVuZ3RoID4gMCkge1xyXG5cclxuXHRcdC8vIGZpbmQgdHdvIHBvaW50cyBmcm9tIG5vdENvbm5lY3RlZCB0byBjb25uZWN0ZWRcclxuXHRcdHZhciBwID0gdGhpcy5fZ2V0RnJvbVRvKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkKTtcclxuXHRcdHZhciBmcm9tID0gcFswXTsgLy8gbm90Q29ubmVjdGVkXHJcblx0XHR2YXIgdG8gPSBwWzFdOyAvLyBjb25uZWN0ZWRcclxuXHJcblx0XHQvLyBmaW5kIGV2ZXJ5dGhpbmcgY29ubmVjdGVkIHRvIHRoZSBzdGFydGluZyBwb2ludFxyXG5cdFx0dmFyIGxvY2FsID0ge307XHJcblx0XHRsb2NhbFt0aGlzLl9wb2ludEtleShmcm9tKV0gPSBmcm9tO1xyXG5cdFx0dGhpcy5fZmluZENvbm5lY3RlZChsb2NhbCwgbm90Q29ubmVjdGVkLCBbZnJvbV0sIHRydWUsIHZhbHVlKTtcclxuXHJcblx0XHQvLyBjb25uZWN0IHRvIGEgY29ubmVjdGVkIHNxdWFyZVxyXG5cdFx0dGhpcy5fdHVubmVsVG9Db25uZWN0ZWQodG8sIGZyb20sIGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCB2YWx1ZSwgY29ubmVjdGlvbkNhbGxiYWNrKTtcclxuXHJcblx0XHQvLyBub3cgYWxsIG9mIGxvY2FsIGlzIGNvbm5lY3RlZFxyXG5cdFx0Zm9yICh2YXIgayBpbiBsb2NhbCkge1xyXG5cdFx0XHR2YXIgcHAgPSBsb2NhbFtrXTtcclxuXHRcdFx0dGhpcy5fbWFwW3BwWzBdXVtwcFsxXV0gPSB2YWx1ZTtcclxuXHRcdFx0Y29ubmVjdGVkW2tdID0gcHA7XHJcblx0XHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRba107XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aGlzLnNlcnZpY2VDYWxsYmFjayhjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogRmluZCByYW5kb20gcG9pbnRzIHRvIGNvbm5lY3QuIFNlYXJjaCBmb3IgdGhlIGNsb3Nlc3QgcG9pbnQgaW4gdGhlIGxhcmdlciBzcGFjZS5cclxuICogVGhpcyBpcyB0byBtaW5pbWl6ZSB0aGUgbGVuZ3RoIG9mIHRoZSBwYXNzYWdlIHdoaWxlIG1haW50YWluaW5nIGdvb2QgcGVyZm9ybWFuY2UuXHJcbiAqL1xyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZ2V0RnJvbVRvID0gZnVuY3Rpb24oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQpIHtcclxuXHR2YXIgZnJvbSwgdG8sIGQ7XHJcblx0dmFyIGNvbm5lY3RlZEtleXMgPSBPYmplY3Qua2V5cyhjb25uZWN0ZWQpO1xyXG5cdHZhciBub3RDb25uZWN0ZWRLZXlzID0gT2JqZWN0LmtleXMobm90Q29ubmVjdGVkKTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xyXG5cdFx0aWYgKGNvbm5lY3RlZEtleXMubGVuZ3RoIDwgbm90Q29ubmVjdGVkS2V5cy5sZW5ndGgpIHtcclxuXHRcdFx0dmFyIGtleXMgPSBjb25uZWN0ZWRLZXlzO1xyXG5cdFx0XHR0byA9IGNvbm5lY3RlZFtrZXlzW1JPVC5STkcuZ2V0VW5pZm9ybUludCgwLCBrZXlzLmxlbmd0aCAtIDEpXV07XHJcblx0XHRcdGZyb20gPSB0aGlzLl9nZXRDbG9zZXN0KHRvLCBub3RDb25uZWN0ZWQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGtleXMgPSBub3RDb25uZWN0ZWRLZXlzO1xyXG5cdFx0XHRmcm9tID0gbm90Q29ubmVjdGVkW2tleXNbUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGtleXMubGVuZ3RoIC0gMSldXTtcclxuXHRcdFx0dG8gPSB0aGlzLl9nZXRDbG9zZXN0KGZyb20sIGNvbm5lY3RlZCk7XHJcblx0XHR9XHJcblx0XHRkID0gKGZyb21bMF0gLSB0b1swXSkgKiAoZnJvbVswXSAtIHRvWzBdKSArIChmcm9tWzFdIC0gdG9bMV0pICogKGZyb21bMV0gLSB0b1sxXSk7XHJcblx0XHRpZiAoZCA8IDY0KSB7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvLyBjb25zb2xlLmxvZyhcIj4+PiBjb25uZWN0ZWQ9XCIgKyB0byArIFwiIG5vdENvbm5lY3RlZD1cIiArIGZyb20gKyBcIiBkaXN0PVwiICsgZCk7XHJcblx0cmV0dXJuIFtmcm9tLCB0b107XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZ2V0Q2xvc2VzdCA9IGZ1bmN0aW9uKHBvaW50LCBzcGFjZSkge1xyXG5cdHZhciBtaW5Qb2ludCA9IG51bGw7XHJcblx0dmFyIG1pbkRpc3QgPSBudWxsO1xyXG5cdGZvciAoayBpbiBzcGFjZSkge1xyXG5cdFx0dmFyIHAgPSBzcGFjZVtrXTtcclxuXHRcdHZhciBkID0gKHBbMF0gLSBwb2ludFswXSkgKiAocFswXSAtIHBvaW50WzBdKSArIChwWzFdIC0gcG9pbnRbMV0pICogKHBbMV0gLSBwb2ludFsxXSk7XHJcblx0XHRpZiAobWluRGlzdCA9PSBudWxsIHx8IGQgPCBtaW5EaXN0KSB7XHJcblx0XHRcdG1pbkRpc3QgPSBkO1xyXG5cdFx0XHRtaW5Qb2ludCA9IHA7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBtaW5Qb2ludDtcclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9maW5kQ29ubmVjdGVkID0gZnVuY3Rpb24oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHN0YWNrLCBrZWVwTm90Q29ubmVjdGVkLCB2YWx1ZSkge1xyXG5cdHdoaWxlKHN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHRcdHZhciBwID0gc3RhY2suc3BsaWNlKDAsIDEpWzBdO1xyXG5cdFx0dmFyIHRlc3RzID0gW1xyXG5cdFx0XHRbcFswXSArIDEsIHBbMV1dLFxyXG5cdFx0XHRbcFswXSAtIDEsIHBbMV1dLFxyXG5cdFx0XHRbcFswXSwgICAgIHBbMV0gKyAxXSxcclxuXHRcdFx0W3BbMF0sICAgICBwWzFdIC0gMV1cclxuXHRcdF07XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRlc3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBrZXkgPSB0aGlzLl9wb2ludEtleSh0ZXN0c1tpXSk7XHJcblx0XHRcdGlmIChjb25uZWN0ZWRba2V5XSA9PSBudWxsICYmIHRoaXMuX2ZyZWVTcGFjZSh0ZXN0c1tpXVswXSwgdGVzdHNbaV1bMV0sIHZhbHVlKSkge1xyXG5cdFx0XHRcdGNvbm5lY3RlZFtrZXldID0gdGVzdHNbaV07XHJcblx0XHRcdFx0aWYgKCFrZWVwTm90Q29ubmVjdGVkKSB7XHJcblx0XHRcdFx0XHRkZWxldGUgbm90Q29ubmVjdGVkW2tleV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHN0YWNrLnB1c2godGVzdHNbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX3R1bm5lbFRvQ29ubmVjdGVkID0gZnVuY3Rpb24odG8sIGZyb20sIGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCB2YWx1ZSwgY29ubmVjdGlvbkNhbGxiYWNrKSB7XHJcblx0dmFyIGtleSA9IHRoaXMuX3BvaW50S2V5KGZyb20pO1xyXG5cdHZhciBhLCBiO1xyXG5cdGlmIChmcm9tWzBdIDwgdG9bMF0pIHtcclxuXHRcdGEgPSBmcm9tO1xyXG5cdFx0YiA9IHRvO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRhID0gdG87XHJcblx0XHRiID0gZnJvbTtcclxuXHR9XHJcblx0Zm9yICh2YXIgeHggPSBhWzBdOyB4eCA8PSBiWzBdOyB4eCsrKSB7XHJcblx0XHR0aGlzLl9tYXBbeHhdW2FbMV1dID0gdmFsdWU7XHJcblx0XHR2YXIgcCA9IFt4eCwgYVsxXV07XHJcblx0XHR2YXIgcGtleSA9IHRoaXMuX3BvaW50S2V5KHApO1xyXG5cdFx0Y29ubmVjdGVkW3BrZXldID0gcDtcclxuXHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRbcGtleV07XHJcblx0fVxyXG5cdGlmIChjb25uZWN0aW9uQ2FsbGJhY2sgJiYgYVswXSA8IGJbMF0pIHtcclxuXHRcdGNvbm5lY3Rpb25DYWxsYmFjayhhLCBbYlswXSwgYVsxXV0pO1xyXG5cdH1cclxuXHJcblx0Ly8geCBpcyBub3cgZml4ZWRcclxuXHR2YXIgeCA9IGJbMF07XHJcblxyXG5cdGlmIChmcm9tWzFdIDwgdG9bMV0pIHtcclxuXHRcdGEgPSBmcm9tO1xyXG5cdFx0YiA9IHRvO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRhID0gdG87XHJcblx0XHRiID0gZnJvbTtcclxuXHR9XHJcblx0Zm9yICh2YXIgeXkgPSBhWzFdOyB5eSA8IGJbMV07IHl5KyspIHtcclxuXHRcdHRoaXMuX21hcFt4XVt5eV0gPSB2YWx1ZTtcclxuXHRcdHZhciBwID0gW3gsIHl5XTtcclxuXHRcdHZhciBwa2V5ID0gdGhpcy5fcG9pbnRLZXkocCk7XHJcblx0XHRjb25uZWN0ZWRbcGtleV0gPSBwO1xyXG5cdFx0ZGVsZXRlIG5vdENvbm5lY3RlZFtwa2V5XTtcclxuXHR9XHJcblx0aWYgKGNvbm5lY3Rpb25DYWxsYmFjayAmJiBhWzFdIDwgYlsxXSkge1xyXG5cdFx0Y29ubmVjdGlvbkNhbGxiYWNrKFtiWzBdLCBhWzFdXSwgW2JbMF0sIGJbMV1dKTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZnJlZVNwYWNlID0gZnVuY3Rpb24oeCwgeSwgdmFsdWUpIHtcclxuXHRyZXR1cm4geCA+PSAwICYmIHggPCB0aGlzLl93aWR0aCAmJiB5ID49IDAgJiYgeSA8IHRoaXMuX2hlaWdodCAmJiB0aGlzLl9tYXBbeF1beV0gPT0gdmFsdWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fcG9pbnRLZXkgPSBmdW5jdGlvbihwKSB7XHJcblx0cmV0dXJuIHBbMF0gKyBcIi5cIiArIHBbMV07XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgRHVuZ2VvbiBtYXA6IGhhcyByb29tcyBhbmQgY29ycmlkb3JzXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwXHJcbiAqL1xyXG5ST1QuTWFwLkR1bmdlb24gPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdHRoaXMuX3Jvb21zID0gW107IC8qIGxpc3Qgb2YgYWxsIHJvb21zICovXHJcblx0dGhpcy5fY29ycmlkb3JzID0gW107XHJcbn07XHJcblJPVC5NYXAuRHVuZ2Vvbi5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG4vKipcclxuICogR2V0IGFsbCBnZW5lcmF0ZWQgcm9vbXNcclxuICogQHJldHVybnMge1JPVC5NYXAuRmVhdHVyZS5Sb29tW119XHJcbiAqL1xyXG5ST1QuTWFwLkR1bmdlb24ucHJvdG90eXBlLmdldFJvb21zID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3Jvb21zO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbGwgZ2VuZXJhdGVkIGNvcnJpZG9yc1xyXG4gKiBAcmV0dXJucyB7Uk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yW119XHJcbiAqL1xyXG5ST1QuTWFwLkR1bmdlb24ucHJvdG90eXBlLmdldENvcnJpZG9ycyA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9jb3JyaWRvcnM7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUmFuZG9tIGR1bmdlb24gZ2VuZXJhdG9yIHVzaW5nIGh1bWFuLWxpa2UgZGlnZ2luZyBwYXR0ZXJucy5cclxuICogSGVhdmlseSBiYXNlZCBvbiBNaWtlIEFuZGVyc29uJ3MgaWRlYXMgZnJvbSB0aGUgXCJUeXJhbnRcIiBhbGdvLCBtZW50aW9uZWQgYXQgXHJcbiAqIGh0dHA6Ly93d3cucm9ndWViYXNpbi5yb2d1ZWxpa2VkZXZlbG9wbWVudC5vcmcvaW5kZXgucGhwP3RpdGxlPUR1bmdlb24tQnVpbGRpbmdfQWxnb3JpdGhtLlxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5EdW5nZW9uXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlciA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcclxuXHRST1QuTWFwLkR1bmdlb24uY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0cm9vbVdpZHRoOiBbMywgOV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSB3aWR0aCAqL1xyXG5cdFx0cm9vbUhlaWdodDogWzMsIDVdLCAvKiByb29tIG1pbmltdW0gYW5kIG1heGltdW0gaGVpZ2h0ICovXHJcblx0XHRjb3JyaWRvckxlbmd0aDogWzMsIDEwXSwgLyogY29ycmlkb3IgbWluaW11bSBhbmQgbWF4aW11bSBsZW5ndGggKi9cclxuXHRcdGR1Z1BlcmNlbnRhZ2U6IDAuMiwgLyogd2Ugc3RvcCBhZnRlciB0aGlzIHBlcmNlbnRhZ2Ugb2YgbGV2ZWwgYXJlYSBoYXMgYmVlbiBkdWcgb3V0ICovXHJcblx0XHR0aW1lTGltaXQ6IDEwMDAgLyogd2Ugc3RvcCBhZnRlciB0aGlzIG11Y2ggdGltZSBoYXMgcGFzc2VkIChtc2VjKSAqL1xyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblx0XHJcblx0dGhpcy5fZmVhdHVyZXMgPSB7XHJcblx0XHRcIlJvb21cIjogNCxcclxuXHRcdFwiQ29ycmlkb3JcIjogNFxyXG5cdH07XHJcblx0dGhpcy5fZmVhdHVyZUF0dGVtcHRzID0gMjA7IC8qIGhvdyBtYW55IHRpbWVzIGRvIHdlIHRyeSB0byBjcmVhdGUgYSBmZWF0dXJlIG9uIGEgc3VpdGFibGUgd2FsbCAqL1xyXG5cdHRoaXMuX3dhbGxzID0ge307IC8qIHRoZXNlIGFyZSBhdmFpbGFibGUgZm9yIGRpZ2dpbmcgKi9cclxuXHRcclxuXHR0aGlzLl9kaWdDYWxsYmFjayA9IHRoaXMuX2RpZ0NhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5fY2FuQmVEdWdDYWxsYmFjayA9IHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHR0aGlzLl9pc1dhbGxDYWxsYmFjayA9IHRoaXMuX2lzV2FsbENhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5fcHJpb3JpdHlXYWxsQ2FsbGJhY2sgPSB0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG59O1xyXG5ST1QuTWFwLkRpZ2dlci5leHRlbmQoUk9ULk1hcC5EdW5nZW9uKTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBtYXBcclxuICogQHNlZSBST1QuTWFwI2NyZWF0ZVxyXG4gKi9cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dGhpcy5fcm9vbXMgPSBbXTtcclxuXHR0aGlzLl9jb3JyaWRvcnMgPSBbXTtcclxuXHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xyXG5cdHRoaXMuX3dhbGxzID0ge307XHJcblx0dGhpcy5fZHVnID0gMDtcclxuXHR2YXIgYXJlYSA9ICh0aGlzLl93aWR0aC0yKSAqICh0aGlzLl9oZWlnaHQtMik7XHJcblxyXG5cdHRoaXMuX2ZpcnN0Um9vbSgpO1xyXG5cdFxyXG5cdHZhciB0MSA9IERhdGUubm93KCk7XHJcblxyXG5cdGRvIHtcclxuXHRcdHZhciB0MiA9IERhdGUubm93KCk7XHJcblx0XHRpZiAodDIgLSB0MSA+IHRoaXMuX29wdGlvbnMudGltZUxpbWl0KSB7IGJyZWFrOyB9XHJcblxyXG5cdFx0LyogZmluZCBhIGdvb2Qgd2FsbCAqL1xyXG5cdFx0dmFyIHdhbGwgPSB0aGlzLl9maW5kV2FsbCgpO1xyXG5cdFx0aWYgKCF3YWxsKSB7IGJyZWFrOyB9IC8qIG5vIG1vcmUgd2FsbHMgKi9cclxuXHRcdFxyXG5cdFx0dmFyIHBhcnRzID0gd2FsbC5zcGxpdChcIixcIik7XHJcblx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcclxuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0dmFyIGRpciA9IHRoaXMuX2dldERpZ2dpbmdEaXJlY3Rpb24oeCwgeSk7XHJcblx0XHRpZiAoIWRpcikgeyBjb250aW51ZTsgfSAvKiB0aGlzIHdhbGwgaXMgbm90IHN1aXRhYmxlICovXHJcblx0XHRcclxuLy9cdFx0Y29uc29sZS5sb2coXCJ3YWxsXCIsIHgsIHkpO1xyXG5cclxuXHRcdC8qIHRyeSBhZGRpbmcgYSBmZWF0dXJlICovXHJcblx0XHR2YXIgZmVhdHVyZUF0dGVtcHRzID0gMDtcclxuXHRcdGRvIHtcclxuXHRcdFx0ZmVhdHVyZUF0dGVtcHRzKys7XHJcblx0XHRcdGlmICh0aGlzLl90cnlGZWF0dXJlKHgsIHksIGRpclswXSwgZGlyWzFdKSkgeyAvKiBmZWF0dXJlIGFkZGVkICovXHJcblx0XHRcdFx0Ly9pZiAodGhpcy5fcm9vbXMubGVuZ3RoICsgdGhpcy5fY29ycmlkb3JzLmxlbmd0aCA9PSAyKSB7IHRoaXMuX3Jvb21zWzBdLmFkZERvb3IoeCwgeSk7IH0gLyogZmlyc3Qgcm9vbSBvZmljaWFsbHkgaGFzIGRvb3JzICovXHJcblx0XHRcdFx0dGhpcy5fcmVtb3ZlU3Vycm91bmRpbmdXYWxscyh4LCB5KTtcclxuXHRcdFx0XHR0aGlzLl9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzKHgtZGlyWzBdLCB5LWRpclsxXSk7XHJcblx0XHRcdFx0YnJlYWs7IFxyXG5cdFx0XHR9XHJcblx0XHR9IHdoaWxlIChmZWF0dXJlQXR0ZW1wdHMgPCB0aGlzLl9mZWF0dXJlQXR0ZW1wdHMpO1xyXG5cdFx0XHJcblx0XHR2YXIgcHJpb3JpdHlXYWxscyA9IDA7XHJcblx0XHRmb3IgKHZhciBpZCBpbiB0aGlzLl93YWxscykgeyBcclxuXHRcdFx0aWYgKHRoaXMuX3dhbGxzW2lkXSA+IDEpIHsgcHJpb3JpdHlXYWxscysrOyB9XHJcblx0XHR9XHJcblxyXG5cdH0gd2hpbGUgKHRoaXMuX2R1Zy9hcmVhIDwgdGhpcy5fb3B0aW9ucy5kdWdQZXJjZW50YWdlIHx8IHByaW9yaXR5V2FsbHMpOyAvKiBmaXhtZSBudW1iZXIgb2YgcHJpb3JpdHkgd2FsbHMgKi9cclxuXHJcblx0dGhpcy5fYWRkRG9vcnMoKTtcclxuXHJcblx0aWYgKGNhbGxiYWNrKSB7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGhpcy5fd2FsbHMgPSB7fTtcclxuXHR0aGlzLl9tYXAgPSBudWxsO1xyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fZGlnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xyXG5cdGlmICh2YWx1ZSA9PSAwIHx8IHZhbHVlID09IDIpIHsgLyogZW1wdHkgKi9cclxuXHRcdHRoaXMuX21hcFt4XVt5XSA9IDA7XHJcblx0XHR0aGlzLl9kdWcrKztcclxuXHR9IGVsc2UgeyAvKiB3YWxsICovXHJcblx0XHR0aGlzLl93YWxsc1t4K1wiLFwiK3ldID0gMTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2lzV2FsbENhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX3dpZHRoIHx8IHkgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9jYW5CZUR1Z0NhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdGlmICh4IDwgMSB8fCB5IDwgMSB8fCB4KzEgPj0gdGhpcy5fd2lkdGggfHwgeSsxID49IHRoaXMuX2hlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRyZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fcHJpb3JpdHlXYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0dGhpcy5fd2FsbHNbeCtcIixcIit5XSA9IDI7XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2ZpcnN0Um9vbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBjeCA9IE1hdGguZmxvb3IodGhpcy5fd2lkdGgvMik7XHJcblx0dmFyIGN5ID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQvMik7XHJcblx0dmFyIHJvb20gPSBST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb21DZW50ZXIoY3gsIGN5LCB0aGlzLl9vcHRpb25zKTtcclxuXHR0aGlzLl9yb29tcy5wdXNoKHJvb20pO1xyXG5cdHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgYSBzdWl0YWJsZSB3YWxsXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2ZpbmRXYWxsID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHByaW8xID0gW107XHJcblx0dmFyIHByaW8yID0gW107XHJcblx0Zm9yICh2YXIgaWQgaW4gdGhpcy5fd2FsbHMpIHtcclxuXHRcdHZhciBwcmlvID0gdGhpcy5fd2FsbHNbaWRdO1xyXG5cdFx0aWYgKHByaW8gPT0gMikgeyBcclxuXHRcdFx0cHJpbzIucHVzaChpZCk7IFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cHJpbzEucHVzaChpZCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHZhciBhcnIgPSAocHJpbzIubGVuZ3RoID8gcHJpbzIgOiBwcmlvMSk7XHJcblx0aWYgKCFhcnIubGVuZ3RoKSB7IHJldHVybiBudWxsOyB9IC8qIG5vIHdhbGxzIDovICovXHJcblx0XHJcblx0dmFyIGlkID0gYXJyLnJhbmRvbSgpO1xyXG5cdGRlbGV0ZSB0aGlzLl93YWxsc1tpZF07XHJcblxyXG5cdHJldHVybiBpZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUcmllcyBhZGRpbmcgYSBmZWF0dXJlXHJcbiAqIEByZXR1cm5zIHtib29sfSB3YXMgdGhpcyBhIHN1Y2Nlc3NmdWwgdHJ5P1xyXG4gKi9cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl90cnlGZWF0dXJlID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5KSB7XHJcblx0dmFyIGZlYXR1cmUgPSBST1QuUk5HLmdldFdlaWdodGVkVmFsdWUodGhpcy5fZmVhdHVyZXMpO1xyXG5cdGZlYXR1cmUgPSBST1QuTWFwLkZlYXR1cmVbZmVhdHVyZV0uY3JlYXRlUmFuZG9tQXQoeCwgeSwgZHgsIGR5LCB0aGlzLl9vcHRpb25zKTtcclxuXHRcclxuXHRpZiAoIWZlYXR1cmUuaXNWYWxpZCh0aGlzLl9pc1dhbGxDYWxsYmFjaywgdGhpcy5fY2FuQmVEdWdDYWxsYmFjaykpIHtcclxuLy9cdFx0Y29uc29sZS5sb2coXCJub3QgdmFsaWRcIik7XHJcbi8vXHRcdGZlYXR1cmUuZGVidWcoKTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0ZmVhdHVyZS5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spO1xyXG4vL1x0ZmVhdHVyZS5kZWJ1ZygpO1xyXG5cclxuXHRpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJPVC5NYXAuRmVhdHVyZS5Sb29tKSB7IHRoaXMuX3Jvb21zLnB1c2goZmVhdHVyZSk7IH1cclxuXHRpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcikgeyBcclxuXHRcdGZlYXR1cmUuY3JlYXRlUHJpb3JpdHlXYWxscyh0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjayk7XHJcblx0XHR0aGlzLl9jb3JyaWRvcnMucHVzaChmZWF0dXJlKTsgXHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzID0gZnVuY3Rpb24oY3gsIGN5KSB7XHJcblx0dmFyIGRlbHRhcyA9IFJPVC5ESVJTWzRdO1xyXG5cclxuXHRmb3IgKHZhciBpPTA7aTxkZWx0YXMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGRlbHRhID0gZGVsdGFzW2ldO1xyXG5cdFx0dmFyIHggPSBjeCArIGRlbHRhWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIGRlbHRhWzFdO1xyXG5cdFx0ZGVsZXRlIHRoaXMuX3dhbGxzW3grXCIsXCIreV07XHJcblx0XHR2YXIgeCA9IGN4ICsgMipkZWx0YVswXTtcclxuXHRcdHZhciB5ID0gY3kgKyAyKmRlbHRhWzFdO1xyXG5cdFx0ZGVsZXRlIHRoaXMuX3dhbGxzW3grXCIsXCIreV07XHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdmVjdG9yIGluIFwiZGlnZ2luZ1wiIGRpcmVjdGlvbiwgb3IgZmFsc2UsIGlmIHRoaXMgZG9lcyBub3QgZXhpc3QgKG9yIGlzIG5vdCB1bmlxdWUpXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2dldERpZ2dpbmdEaXJlY3Rpb24gPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHRpZiAoY3ggPD0gMCB8fCBjeSA8PSAwIHx8IGN4ID49IHRoaXMuX3dpZHRoIC0gMSB8fCBjeSA+PSB0aGlzLl9oZWlnaHQgLSAxKSB7IHJldHVybiBudWxsOyB9XHJcblxyXG5cdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdHZhciBkZWx0YXMgPSBST1QuRElSU1s0XTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTxkZWx0YXMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGRlbHRhID0gZGVsdGFzW2ldO1xyXG5cdFx0dmFyIHggPSBjeCArIGRlbHRhWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIGRlbHRhWzFdO1xyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuX21hcFt4XVt5XSkgeyAvKiB0aGVyZSBhbHJlYWR5IGlzIGFub3RoZXIgZW1wdHkgbmVpZ2hib3IhICovXHJcblx0XHRcdGlmIChyZXN1bHQpIHsgcmV0dXJuIG51bGw7IH1cclxuXHRcdFx0cmVzdWx0ID0gZGVsdGE7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8qIG5vIGVtcHR5IG5laWdoYm9yICovXHJcblx0aWYgKCFyZXN1bHQpIHsgcmV0dXJuIG51bGw7IH1cclxuXHRcclxuXHRyZXR1cm4gWy1yZXN1bHRbMF0sIC1yZXN1bHRbMV1dO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZpbmQgZW1wdHkgc3BhY2VzIHN1cnJvdW5kaW5nIHJvb21zLCBhbmQgYXBwbHkgZG9vcnMuXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2FkZERvb3JzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGRhdGEgPSB0aGlzLl9tYXA7XHJcblx0dmFyIGlzV2FsbENhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdFx0cmV0dXJuIChkYXRhW3hdW3ldID09IDEpO1xyXG5cdH07XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9yb29tcy5sZW5ndGg7IGkrKyApIHtcclxuXHRcdHZhciByb29tID0gdGhpcy5fcm9vbXNbaV07XHJcblx0XHRyb29tLmNsZWFyRG9vcnMoKTtcclxuXHRcdHJvb20uYWRkRG9vcnMoaXNXYWxsQ2FsbGJhY2spO1xyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBEdW5nZW9uIGdlbmVyYXRvciB3aGljaCB0cmllcyB0byBmaWxsIHRoZSBzcGFjZSBldmVubHkuIEdlbmVyYXRlcyBpbmRlcGVuZGVudCByb29tcyBhbmQgdHJpZXMgdG8gY29ubmVjdCB0aGVtLlxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5EdW5nZW9uXHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0gPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0Uk9ULk1hcC5EdW5nZW9uLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblxyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRyb29tV2lkdGg6IFszLCA5XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIHdpZHRoICovXHJcblx0XHRyb29tSGVpZ2h0OiBbMywgNV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSBoZWlnaHQgKi9cclxuXHRcdHJvb21EdWdQZXJjZW50YWdlOiAwLjEsIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBwZXJjZW50YWdlIG9mIGxldmVsIGFyZWEgaGFzIGJlZW4gZHVnIG91dCBieSByb29tcyAqL1xyXG5cdFx0dGltZUxpbWl0OiAxMDAwIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBtdWNoIHRpbWUgaGFzIHBhc3NlZCAobXNlYykgKi9cclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cclxuXHR0aGlzLl9yb29tQXR0ZW1wdHMgPSAyMDsgLyogbmV3IHJvb20gaXMgY3JlYXRlZCBOLXRpbWVzIHVudGlsIGlzIGNvbnNpZGVyZWQgYXMgaW1wb3NzaWJsZSB0byBnZW5lcmF0ZSAqL1xyXG5cdHRoaXMuX2NvcnJpZG9yQXR0ZW1wdHMgPSAyMDsgLyogY29ycmlkb3JzIGFyZSB0cmllZCBOLXRpbWVzIHVudGlsIHRoZSBsZXZlbCBpcyBjb25zaWRlcmVkIGFzIGltcG9zc2libGUgdG8gY29ubmVjdCAqL1xyXG5cclxuXHR0aGlzLl9jb25uZWN0ZWQgPSBbXTsgLyogbGlzdCBvZiBhbHJlYWR5IGNvbm5lY3RlZCByb29tcyAqL1xyXG5cdHRoaXMuX3VuY29ubmVjdGVkID0gW107IC8qIGxpc3Qgb2YgcmVtYWluaW5nIHVuY29ubmVjdGVkIHJvb21zICovXHJcblx0XHJcblx0dGhpcy5fZGlnQ2FsbGJhY2sgPSB0aGlzLl9kaWdDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG5cdHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2sgPSB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5faXNXYWxsQ2FsbGJhY2sgPSB0aGlzLl9pc1dhbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG59O1xyXG5ST1QuTWFwLlVuaWZvcm0uZXh0ZW5kKFJPVC5NYXAuRHVuZ2Vvbik7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbWFwLiBJZiB0aGUgdGltZSBsaW1pdCBoYXMgYmVlbiBoaXQsIHJldHVybnMgbnVsbC5cclxuICogQHNlZSBST1QuTWFwI2NyZWF0ZVxyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciB0MSA9IERhdGUubm93KCk7XHJcblx0d2hpbGUgKDEpIHtcclxuXHRcdHZhciB0MiA9IERhdGUubm93KCk7XHJcblx0XHRpZiAodDIgLSB0MSA+IHRoaXMuX29wdGlvbnMudGltZUxpbWl0KSB7IHJldHVybiBudWxsOyB9IC8qIHRpbWUgbGltaXQhICovXHJcblx0XHJcblx0XHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xyXG5cdFx0dGhpcy5fZHVnID0gMDtcclxuXHRcdHRoaXMuX3Jvb21zID0gW107XHJcblx0XHR0aGlzLl91bmNvbm5lY3RlZCA9IFtdO1xyXG5cdFx0dGhpcy5fZ2VuZXJhdGVSb29tcygpO1xyXG5cdFx0aWYgKHRoaXMuX3Jvb21zLmxlbmd0aCA8IDIpIHsgY29udGludWU7IH1cclxuXHRcdGlmICh0aGlzLl9nZW5lcmF0ZUNvcnJpZG9ycygpKSB7IGJyZWFrOyB9XHJcblx0fVxyXG5cdFxyXG5cdGlmIChjYWxsYmFjaykge1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBhIHN1aXRhYmxlIGFtb3VudCBvZiByb29tc1xyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZ2VuZXJhdGVSb29tcyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciB3ID0gdGhpcy5fd2lkdGgtMjtcclxuXHR2YXIgaCA9IHRoaXMuX2hlaWdodC0yO1xyXG5cclxuXHRkbyB7XHJcblx0XHR2YXIgcm9vbSA9IHRoaXMuX2dlbmVyYXRlUm9vbSgpO1xyXG5cdFx0aWYgKHRoaXMuX2R1Zy8odypoKSA+IHRoaXMuX29wdGlvbnMucm9vbUR1Z1BlcmNlbnRhZ2UpIHsgYnJlYWs7IH0gLyogYWNoaWV2ZWQgcmVxdWVzdGVkIGFtb3VudCBvZiBmcmVlIHNwYWNlICovXHJcblx0fSB3aGlsZSAocm9vbSk7XHJcblxyXG5cdC8qIGVpdGhlciBlbm91Z2ggcm9vbXMsIG9yIG5vdCBhYmxlIHRvIGdlbmVyYXRlIG1vcmUgb2YgdGhlbSA6KSAqL1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRyeSB0byBnZW5lcmF0ZSBvbmUgcm9vbVxyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZ2VuZXJhdGVSb29tID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGNvdW50ID0gMDtcclxuXHR3aGlsZSAoY291bnQgPCB0aGlzLl9yb29tQXR0ZW1wdHMpIHtcclxuXHRcdGNvdW50Kys7XHJcblx0XHRcclxuXHRcdHZhciByb29tID0gUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIHRoaXMuX29wdGlvbnMpO1xyXG5cdFx0aWYgKCFyb29tLmlzVmFsaWQodGhpcy5faXNXYWxsQ2FsbGJhY2ssIHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2spKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRcclxuXHRcdHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcclxuXHRcdHRoaXMuX3Jvb21zLnB1c2gocm9vbSk7XHJcblx0XHRyZXR1cm4gcm9vbTtcclxuXHR9IFxyXG5cclxuXHQvKiBubyByb29tIHdhcyBnZW5lcmF0ZWQgaW4gYSBnaXZlbiBudW1iZXIgb2YgYXR0ZW1wdHMgKi9cclxuXHRyZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgY29ubmVjdG9ycyBiZXdlZW4gcm9vbXNcclxuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3MgV2FzIHRoaXMgYXR0ZW1wdCBzdWNjZXNzZnVsbD9cclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2dlbmVyYXRlQ29ycmlkb3JzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGNudCA9IDA7XHJcblx0d2hpbGUgKGNudCA8IHRoaXMuX2NvcnJpZG9yQXR0ZW1wdHMpIHtcclxuXHRcdGNudCsrO1xyXG5cdFx0dGhpcy5fY29ycmlkb3JzID0gW107XHJcblxyXG5cdFx0LyogZGlnIHJvb21zIGludG8gYSBjbGVhciBtYXAgKi9cclxuXHRcdHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl9yb29tcy5sZW5ndGg7aSsrKSB7IFxyXG5cdFx0XHR2YXIgcm9vbSA9IHRoaXMuX3Jvb21zW2ldO1xyXG5cdFx0XHRyb29tLmNsZWFyRG9vcnMoKTtcclxuXHRcdFx0cm9vbS5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spOyBcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl91bmNvbm5lY3RlZCA9IHRoaXMuX3Jvb21zLnNsaWNlKCkucmFuZG9taXplKCk7XHJcblx0XHR0aGlzLl9jb25uZWN0ZWQgPSBbXTtcclxuXHRcdGlmICh0aGlzLl91bmNvbm5lY3RlZC5sZW5ndGgpIHsgdGhpcy5fY29ubmVjdGVkLnB1c2godGhpcy5fdW5jb25uZWN0ZWQucG9wKCkpOyB9IC8qIGZpcnN0IG9uZSBpcyBhbHdheXMgY29ubmVjdGVkICovXHJcblx0XHRcclxuXHRcdHdoaWxlICgxKSB7XHJcblx0XHRcdC8qIDEuIHBpY2sgcmFuZG9tIGNvbm5lY3RlZCByb29tICovXHJcblx0XHRcdHZhciBjb25uZWN0ZWQgPSB0aGlzLl9jb25uZWN0ZWQucmFuZG9tKCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvKiAyLiBmaW5kIGNsb3Nlc3QgdW5jb25uZWN0ZWQgKi9cclxuXHRcdFx0dmFyIHJvb20xID0gdGhpcy5fY2xvc2VzdFJvb20odGhpcy5fdW5jb25uZWN0ZWQsIGNvbm5lY3RlZCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvKiAzLiBjb25uZWN0IGl0IHRvIGNsb3Nlc3QgY29ubmVjdGVkICovXHJcblx0XHRcdHZhciByb29tMiA9IHRoaXMuX2Nsb3Nlc3RSb29tKHRoaXMuX2Nvbm5lY3RlZCwgcm9vbTEpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIG9rID0gdGhpcy5fY29ubmVjdFJvb21zKHJvb20xLCByb29tMik7XHJcblx0XHRcdGlmICghb2spIHsgYnJlYWs7IH0gLyogc3RvcCBjb25uZWN0aW5nLCByZS1zaHVmZmxlICovXHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIXRoaXMuX3VuY29ubmVjdGVkLmxlbmd0aCkgeyByZXR1cm4gdHJ1ZTsgfSAvKiBkb25lOyBubyByb29tcyByZW1haW4gKi9cclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZvciBhIGdpdmVuIHJvb20sIGZpbmQgdGhlIGNsb3Nlc3Qgb25lIGZyb20gdGhlIGxpc3RcclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2Nsb3Nlc3RSb29tID0gZnVuY3Rpb24ocm9vbXMsIHJvb20pIHtcclxuXHR2YXIgZGlzdCA9IEluZmluaXR5O1xyXG5cdHZhciBjZW50ZXIgPSByb29tLmdldENlbnRlcigpO1xyXG5cdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHJvb21zLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciByID0gcm9vbXNbaV07XHJcblx0XHR2YXIgYyA9IHIuZ2V0Q2VudGVyKCk7XHJcblx0XHR2YXIgZHggPSBjWzBdLWNlbnRlclswXTtcclxuXHRcdHZhciBkeSA9IGNbMV0tY2VudGVyWzFdO1xyXG5cdFx0dmFyIGQgPSBkeCpkeCtkeSpkeTtcclxuXHRcdFxyXG5cdFx0aWYgKGQgPCBkaXN0KSB7XHJcblx0XHRcdGRpc3QgPSBkO1xyXG5cdFx0XHRyZXN1bHQgPSByO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fY29ubmVjdFJvb21zID0gZnVuY3Rpb24ocm9vbTEsIHJvb20yKSB7XHJcblx0LypcclxuXHRcdHJvb20xLmRlYnVnKCk7XHJcblx0XHRyb29tMi5kZWJ1ZygpO1xyXG5cdCovXHJcblxyXG5cdHZhciBjZW50ZXIxID0gcm9vbTEuZ2V0Q2VudGVyKCk7XHJcblx0dmFyIGNlbnRlcjIgPSByb29tMi5nZXRDZW50ZXIoKTtcclxuXHJcblx0dmFyIGRpZmZYID0gY2VudGVyMlswXSAtIGNlbnRlcjFbMF07XHJcblx0dmFyIGRpZmZZID0gY2VudGVyMlsxXSAtIGNlbnRlcjFbMV07XHJcblxyXG5cdGlmIChNYXRoLmFicyhkaWZmWCkgPCBNYXRoLmFicyhkaWZmWSkpIHsgLyogZmlyc3QgdHJ5IGNvbm5lY3Rpbmcgbm9ydGgtc291dGggd2FsbHMgKi9cclxuXHRcdHZhciBkaXJJbmRleDEgPSAoZGlmZlkgPiAwID8gMiA6IDApO1xyXG5cdFx0dmFyIGRpckluZGV4MiA9IChkaXJJbmRleDEgKyAyKSAlIDQ7XHJcblx0XHR2YXIgbWluID0gcm9vbTIuZ2V0TGVmdCgpO1xyXG5cdFx0dmFyIG1heCA9IHJvb20yLmdldFJpZ2h0KCk7XHJcblx0XHR2YXIgaW5kZXggPSAwO1xyXG5cdH0gZWxzZSB7IC8qIGZpcnN0IHRyeSBjb25uZWN0aW5nIGVhc3Qtd2VzdCB3YWxscyAqL1xyXG5cdFx0dmFyIGRpckluZGV4MSA9IChkaWZmWCA+IDAgPyAxIDogMyk7XHJcblx0XHR2YXIgZGlySW5kZXgyID0gKGRpckluZGV4MSArIDIpICUgNDtcclxuXHRcdHZhciBtaW4gPSByb29tMi5nZXRUb3AoKTtcclxuXHRcdHZhciBtYXggPSByb29tMi5nZXRCb3R0b20oKTtcclxuXHRcdHZhciBpbmRleCA9IDE7XHJcblx0fVxyXG5cclxuXHR2YXIgc3RhcnQgPSB0aGlzLl9wbGFjZUluV2FsbChyb29tMSwgZGlySW5kZXgxKTsgLyogY29ycmlkb3Igd2lsbCBzdGFydCBoZXJlICovXHJcblx0aWYgKCFzdGFydCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0aWYgKHN0YXJ0W2luZGV4XSA+PSBtaW4gJiYgc3RhcnRbaW5kZXhdIDw9IG1heCkgeyAvKiBwb3NzaWJsZSB0byBjb25uZWN0IHdpdGggc3RyYWlnaHQgbGluZSAoSS1saWtlKSAqL1xyXG5cdFx0dmFyIGVuZCA9IHN0YXJ0LnNsaWNlKCk7XHJcblx0XHR2YXIgdmFsdWUgPSBudWxsO1xyXG5cdFx0c3dpdGNoIChkaXJJbmRleDIpIHtcclxuXHRcdFx0Y2FzZSAwOiB2YWx1ZSA9IHJvb20yLmdldFRvcCgpLTE7IGJyZWFrO1xyXG5cdFx0XHRjYXNlIDE6IHZhbHVlID0gcm9vbTIuZ2V0UmlnaHQoKSsxOyBicmVhaztcclxuXHRcdFx0Y2FzZSAyOiB2YWx1ZSA9IHJvb20yLmdldEJvdHRvbSgpKzE7IGJyZWFrO1xyXG5cdFx0XHRjYXNlIDM6IHZhbHVlID0gcm9vbTIuZ2V0TGVmdCgpLTE7IGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0ZW5kWyhpbmRleCsxKSUyXSA9IHZhbHVlO1xyXG5cdFx0dGhpcy5fZGlnTGluZShbc3RhcnQsIGVuZF0pO1xyXG5cdFx0XHJcblx0fSBlbHNlIGlmIChzdGFydFtpbmRleF0gPCBtaW4tMSB8fCBzdGFydFtpbmRleF0gPiBtYXgrMSkgeyAvKiBuZWVkIHRvIHN3aXRjaCB0YXJnZXQgd2FsbCAoTC1saWtlKSAqL1xyXG5cclxuXHRcdHZhciBkaWZmID0gc3RhcnRbaW5kZXhdIC0gY2VudGVyMltpbmRleF07XHJcblx0XHRzd2l0Y2ggKGRpckluZGV4Mikge1xyXG5cdFx0XHRjYXNlIDA6XHJcblx0XHRcdGNhc2UgMTpcdHZhciByb3RhdGlvbiA9IChkaWZmIDwgMCA/IDMgOiAxKTsgYnJlYWs7XHJcblx0XHRcdGNhc2UgMjpcclxuXHRcdFx0Y2FzZSAzOlx0dmFyIHJvdGF0aW9uID0gKGRpZmYgPCAwID8gMSA6IDMpOyBicmVhaztcclxuXHRcdH1cclxuXHRcdGRpckluZGV4MiA9IChkaXJJbmRleDIgKyByb3RhdGlvbikgJSA0O1xyXG5cdFx0XHJcblx0XHR2YXIgZW5kID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTIsIGRpckluZGV4Mik7XHJcblx0XHRpZiAoIWVuZCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0XHR2YXIgbWlkID0gWzAsIDBdO1xyXG5cdFx0bWlkW2luZGV4XSA9IHN0YXJ0W2luZGV4XTtcclxuXHRcdHZhciBpbmRleDIgPSAoaW5kZXgrMSklMjtcclxuXHRcdG1pZFtpbmRleDJdID0gZW5kW2luZGV4Ml07XHJcblx0XHR0aGlzLl9kaWdMaW5lKFtzdGFydCwgbWlkLCBlbmRdKTtcclxuXHRcdFxyXG5cdH0gZWxzZSB7IC8qIHVzZSBjdXJyZW50IHdhbGwgcGFpciwgYnV0IGFkanVzdCB0aGUgbGluZSBpbiB0aGUgbWlkZGxlIChTLWxpa2UpICovXHJcblx0XHJcblx0XHR2YXIgaW5kZXgyID0gKGluZGV4KzEpJTI7XHJcblx0XHR2YXIgZW5kID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTIsIGRpckluZGV4Mik7XHJcblx0XHRpZiAoIWVuZCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdHZhciBtaWQgPSBNYXRoLnJvdW5kKChlbmRbaW5kZXgyXSArIHN0YXJ0W2luZGV4Ml0pLzIpO1xyXG5cclxuXHRcdHZhciBtaWQxID0gWzAsIDBdO1xyXG5cdFx0dmFyIG1pZDIgPSBbMCwgMF07XHJcblx0XHRtaWQxW2luZGV4XSA9IHN0YXJ0W2luZGV4XTtcclxuXHRcdG1pZDFbaW5kZXgyXSA9IG1pZDtcclxuXHRcdG1pZDJbaW5kZXhdID0gZW5kW2luZGV4XTtcclxuXHRcdG1pZDJbaW5kZXgyXSA9IG1pZDtcclxuXHRcdHRoaXMuX2RpZ0xpbmUoW3N0YXJ0LCBtaWQxLCBtaWQyLCBlbmRdKTtcclxuXHR9XHJcblxyXG5cdHJvb20xLmFkZERvb3Ioc3RhcnRbMF0sIHN0YXJ0WzFdKTtcclxuXHRyb29tMi5hZGREb29yKGVuZFswXSwgZW5kWzFdKTtcclxuXHRcclxuXHR2YXIgaW5kZXggPSB0aGlzLl91bmNvbm5lY3RlZC5pbmRleE9mKHJvb20xKTtcclxuXHRpZiAoaW5kZXggIT0gLTEpIHtcclxuXHRcdHRoaXMuX3VuY29ubmVjdGVkLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHR0aGlzLl9jb25uZWN0ZWQucHVzaChyb29tMSk7XHJcblx0fVxyXG5cclxuXHR2YXIgaW5kZXggPSB0aGlzLl91bmNvbm5lY3RlZC5pbmRleE9mKHJvb20yKTtcclxuXHRpZiAoaW5kZXggIT0gLTEpIHtcclxuXHRcdHRoaXMuX3VuY29ubmVjdGVkLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHR0aGlzLl9jb25uZWN0ZWQucHVzaChyb29tMik7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fcGxhY2VJbldhbGwgPSBmdW5jdGlvbihyb29tLCBkaXJJbmRleCkge1xyXG5cdHZhciBzdGFydCA9IFswLCAwXTtcclxuXHR2YXIgZGlyID0gWzAsIDBdO1xyXG5cdHZhciBsZW5ndGggPSAwO1xyXG5cdFxyXG5cdHN3aXRjaCAoZGlySW5kZXgpIHtcclxuXHRcdGNhc2UgMDpcclxuXHRcdFx0ZGlyID0gWzEsIDBdO1xyXG5cdFx0XHRzdGFydCA9IFtyb29tLmdldExlZnQoKSwgcm9vbS5nZXRUb3AoKS0xXTtcclxuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRSaWdodCgpLXJvb20uZ2V0TGVmdCgpKzE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMTpcclxuXHRcdFx0ZGlyID0gWzAsIDFdO1xyXG5cdFx0XHRzdGFydCA9IFtyb29tLmdldFJpZ2h0KCkrMSwgcm9vbS5nZXRUb3AoKV07XHJcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0Qm90dG9tKCktcm9vbS5nZXRUb3AoKSsxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDI6XHJcblx0XHRcdGRpciA9IFsxLCAwXTtcclxuXHRcdFx0c3RhcnQgPSBbcm9vbS5nZXRMZWZ0KCksIHJvb20uZ2V0Qm90dG9tKCkrMV07XHJcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0UmlnaHQoKS1yb29tLmdldExlZnQoKSsxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDM6XHJcblx0XHRcdGRpciA9IFswLCAxXTtcclxuXHRcdFx0c3RhcnQgPSBbcm9vbS5nZXRMZWZ0KCktMSwgcm9vbS5nZXRUb3AoKV07XHJcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0Qm90dG9tKCktcm9vbS5nZXRUb3AoKSsxO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG5cdFxyXG5cdHZhciBhdmFpbCA9IFtdO1xyXG5cdHZhciBsYXN0QmFkSW5kZXggPSAtMjtcclxuXHJcblx0Zm9yICh2YXIgaT0wO2k8bGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHggPSBzdGFydFswXSArIGkqZGlyWzBdO1xyXG5cdFx0dmFyIHkgPSBzdGFydFsxXSArIGkqZGlyWzFdO1xyXG5cdFx0YXZhaWwucHVzaChudWxsKTtcclxuXHRcdFxyXG5cdFx0dmFyIGlzV2FsbCA9ICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XHJcblx0XHRpZiAoaXNXYWxsKSB7XHJcblx0XHRcdGlmIChsYXN0QmFkSW5kZXggIT0gaS0xKSB7IGF2YWlsW2ldID0gW3gsIHldOyB9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsYXN0QmFkSW5kZXggPSBpO1xyXG5cdFx0XHRpZiAoaSkgeyBhdmFpbFtpLTFdID0gbnVsbDsgfVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPWF2YWlsLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcclxuXHRcdGlmICghYXZhaWxbaV0pIHsgYXZhaWwuc3BsaWNlKGksIDEpOyB9XHJcblx0fVxyXG5cdHJldHVybiAoYXZhaWwubGVuZ3RoID8gYXZhaWwucmFuZG9tKCkgOiBudWxsKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEaWcgYSBwb2x5bGluZS5cclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2RpZ0xpbmUgPSBmdW5jdGlvbihwb2ludHMpIHtcclxuXHRmb3IgKHZhciBpPTE7aTxwb2ludHMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHN0YXJ0ID0gcG9pbnRzW2ktMV07XHJcblx0XHR2YXIgZW5kID0gcG9pbnRzW2ldO1xyXG5cdFx0dmFyIGNvcnJpZG9yID0gbmV3IFJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcihzdGFydFswXSwgc3RhcnRbMV0sIGVuZFswXSwgZW5kWzFdKTtcclxuXHRcdGNvcnJpZG9yLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XHJcblx0XHR0aGlzLl9jb3JyaWRvcnMucHVzaChjb3JyaWRvcik7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZGlnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xyXG5cdHRoaXMuX21hcFt4XVt5XSA9IHZhbHVlO1xyXG5cdGlmICh2YWx1ZSA9PSAwKSB7IHRoaXMuX2R1ZysrOyB9XHJcbn07XHJcblxyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9pc1dhbGxDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5ID49IHRoaXMuX2hlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRyZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcclxufTtcclxuXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2NhbkJlRHVnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0aWYgKHggPCAxIHx8IHkgPCAxIHx8IHgrMSA+PSB0aGlzLl93aWR0aCB8fCB5KzEgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBhdXRob3IgaHlha3VnZWlcclxuICogQGNsYXNzIER1bmdlb24gZ2VuZXJhdG9yIHdoaWNoIHVzZXMgdGhlIFwib3JnaW5hbFwiIFJvZ3VlIGR1bmdlb24gZ2VuZXJhdGlvbiBhbGdvcml0aG0uIFNlZSBodHRwOi8va3VvaS5jb20vfmthbWlrYXplL0dhbWVEZXNpZ24vYXJ0MDdfcm9ndWVfZHVuZ2Vvbi5waHBcclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICogQHBhcmFtIHtpbnR9IFt3aWR0aD1ST1QuREVGQVVMVF9XSURUSF1cclxuICogQHBhcmFtIHtpbnR9IFtoZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIE9wdGlvbnNcclxuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuY2VsbFdpZHRoPTNdIE51bWJlciBvZiBjZWxscyB0byBjcmVhdGUgb24gdGhlIGhvcml6b250YWwgKG51bWJlciBvZiByb29tcyBob3Jpem9udGFsbHkpXHJcbiAqIEBwYXJhbSB7aW50W119IFtvcHRpb25zLmNlbGxIZWlnaHQ9M10gTnVtYmVyIG9mIGNlbGxzIHRvIGNyZWF0ZSBvbiB0aGUgdmVydGljYWwgKG51bWJlciBvZiByb29tcyB2ZXJ0aWNhbGx5KVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucm9vbVdpZHRoXSBSb29tIG1pbiBhbmQgbWF4IHdpZHRoIC0gbm9ybWFsbHkgc2V0IGF1dG8tbWFnaWNhbGx5IHZpYSB0aGUgY29uc3RydWN0b3IuXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5yb29tSGVpZ2h0XSBSb29tIG1pbiBhbmQgbWF4IGhlaWdodCAtIG5vcm1hbGx5IHNldCBhdXRvLW1hZ2ljYWxseSB2aWEgdGhlIGNvbnN0cnVjdG9yLlxyXG4gKi9cclxuUk9ULk1hcC5Sb2d1ZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0Y2VsbFdpZHRoOiAzLCAgLy8gTk9URSB0byBzZWxmLCB0aGVzZSBjb3VsZCBwcm9iYWJseSB3b3JrIHRoZSBzYW1lIGFzIHRoZSByb29tV2lkdGgvcm9vbSBIZWlnaHQgdmFsdWVzXHJcblx0XHRjZWxsSGVpZ2h0OiAzICAvLyAgICAgaWUuIGFzIGFuIGFycmF5IHdpdGggbWluLW1heCB2YWx1ZXMgZm9yIGVhY2ggZGlyZWN0aW9uLi4uLlxyXG5cdH07XHJcblxyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cclxuXHQvKlxyXG5cdFNldCB0aGUgcm9vbSBzaXplcyBhY2NvcmRpbmcgdG8gdGhlIG92ZXItYWxsIHdpZHRoIG9mIHRoZSBtYXAsXHJcblx0YW5kIHRoZSBjZWxsIHNpemVzLlxyXG5cdCovXHJcblx0aWYgKCF0aGlzLl9vcHRpb25zLmhhc093blByb3BlcnR5KFwicm9vbVdpZHRoXCIpKSB7XHJcblx0XHR0aGlzLl9vcHRpb25zW1wicm9vbVdpZHRoXCJdID0gdGhpcy5fY2FsY3VsYXRlUm9vbVNpemUodGhpcy5fd2lkdGgsIHRoaXMuX29wdGlvbnNbXCJjZWxsV2lkdGhcIl0pO1xyXG5cdH1cclxuXHRpZiAoIXRoaXMuX29wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJyb29tSGVpZ2h0XCIpKSB7XHJcblx0XHR0aGlzLl9vcHRpb25zW1wicm9vbUhlaWdodFwiXSA9IHRoaXMuX2NhbGN1bGF0ZVJvb21TaXplKHRoaXMuX2hlaWdodCwgdGhpcy5fb3B0aW9uc1tcImNlbGxIZWlnaHRcIl0pO1xyXG5cdH1cclxuXHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLmV4dGVuZChST1QuTWFwKTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5NYXAjY3JlYXRlXHJcbiAqL1xyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuXHR0aGlzLm1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0dGhpcy5yb29tcyA9IFtdO1xyXG5cdHRoaXMuY29ubmVjdGVkQ2VsbHMgPSBbXTtcclxuXHJcblx0dGhpcy5faW5pdFJvb21zKCk7XHJcblx0dGhpcy5fY29ubmVjdFJvb21zKCk7XHJcblx0dGhpcy5fY29ubmVjdFVuY29ubmVjdGVkUm9vbXMoKTtcclxuXHR0aGlzLl9jcmVhdGVSYW5kb21Sb29tQ29ubmVjdGlvbnMoKTtcclxuXHR0aGlzLl9jcmVhdGVSb29tcygpO1xyXG5cdHRoaXMuX2NyZWF0ZUNvcnJpZG9ycygpO1xyXG5cclxuXHRpZiAoY2FsbGJhY2spIHtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fd2lkdGg7IGkrKykge1xyXG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soaSwgaiwgdGhpcy5tYXBbaV1bal0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jYWxjdWxhdGVSb29tU2l6ZSA9IGZ1bmN0aW9uIChzaXplLCBjZWxsKSB7XHJcblx0dmFyIG1heCA9IE1hdGguZmxvb3IoKHNpemUvY2VsbCkgKiAwLjgpO1xyXG5cdHZhciBtaW4gPSBNYXRoLmZsb29yKChzaXplL2NlbGwpICogMC4yNSk7XHJcblx0aWYgKG1pbiA8IDIpIHsgbWluID0gMjsgfVxyXG5cdGlmIChtYXggPCAyKSB7IG1heCA9IDI7IH1cclxuXHRyZXR1cm4gW21pbiwgbWF4XTtcclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9pbml0Um9vbXMgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly8gY3JlYXRlIHJvb21zIGFycmF5LiBUaGlzIGlzIHRoZSBcImdyaWRcIiBsaXN0IGZyb20gdGhlIGFsZ28uXHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDsgaSsrKSB7XHJcblx0XHR0aGlzLnJvb21zLnB1c2goW10pO1xyXG5cdFx0Zm9yKHZhciBqID0gMDsgaiA8IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDsgaisrKSB7XHJcblx0XHRcdHRoaXMucm9vbXNbaV0ucHVzaCh7XCJ4XCI6MCwgXCJ5XCI6MCwgXCJ3aWR0aFwiOjAsIFwiaGVpZ2h0XCI6MCwgXCJjb25uZWN0aW9uc1wiOltdLCBcImNlbGx4XCI6aSwgXCJjZWxseVwiOmp9KTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY29ubmVjdFJvb21zID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vcGljayByYW5kb20gc3RhcnRpbmcgZ3JpZFxyXG5cdHZhciBjZ3ggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGgtMSk7XHJcblx0dmFyIGNneSA9IFJPVC5STkcuZ2V0VW5pZm9ybUludCgwLCB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQtMSk7XHJcblxyXG5cdHZhciBpZHg7XHJcblx0dmFyIG5jZ3g7XHJcblx0dmFyIG5jZ3k7XHJcblxyXG5cdHZhciBmb3VuZCA9IGZhbHNlO1xyXG5cdHZhciByb29tO1xyXG5cdHZhciBvdGhlclJvb207XHJcblxyXG5cdC8vIGZpbmQgIHVuY29ubmVjdGVkIG5laWdoYm91ciBjZWxsc1xyXG5cdGRvIHtcclxuXHJcblx0XHQvL3ZhciBkaXJUb0NoZWNrID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddO1xyXG5cdFx0dmFyIGRpclRvQ2hlY2sgPSBbMCwgMiwgNCwgNl07XHJcblx0XHRkaXJUb0NoZWNrID0gZGlyVG9DaGVjay5yYW5kb21pemUoKTtcclxuXHJcblx0XHRkbyB7XHJcblx0XHRcdGZvdW5kID0gZmFsc2U7XHJcblx0XHRcdGlkeCA9IGRpclRvQ2hlY2sucG9wKCk7XHJcblxyXG5cdFx0XHRuY2d4ID0gY2d4ICsgUk9ULkRJUlNbOF1baWR4XVswXTtcclxuXHRcdFx0bmNneSA9IGNneSArIFJPVC5ESVJTWzhdW2lkeF1bMV07XHJcblxyXG5cdFx0XHRpZiAobmNneCA8IDAgfHwgbmNneCA+PSB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aCkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHRpZiAobmNneSA8IDAgfHwgbmNneSA+PSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQpIHsgY29udGludWU7IH1cclxuXHJcblx0XHRcdHJvb20gPSB0aGlzLnJvb21zW2NneF1bY2d5XTtcclxuXHJcblx0XHRcdGlmIChyb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdC8vIGFzIGxvbmcgYXMgdGhpcyByb29tIGRvZXNuJ3QgYWxyZWFkeSBjb29uZWN0IHRvIG1lLCB3ZSBhcmUgb2sgd2l0aCBpdC5cclxuXHRcdFx0XHRpZiAocm9vbVtcImNvbm5lY3Rpb25zXCJdWzBdWzBdID09IG5jZ3ggJiYgcm9vbVtcImNvbm5lY3Rpb25zXCJdWzBdWzFdID09IG5jZ3kpIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tuY2d4XVtuY2d5XTtcclxuXHJcblx0XHRcdGlmIChvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLnB1c2goW2NneCwgY2d5XSk7XHJcblxyXG5cdFx0XHRcdHRoaXMuY29ubmVjdGVkQ2VsbHMucHVzaChbbmNneCwgbmNneV0pO1xyXG5cdFx0XHRcdGNneCA9IG5jZ3g7XHJcblx0XHRcdFx0Y2d5ID0gbmNneTtcclxuXHRcdFx0XHRmb3VuZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9IHdoaWxlIChkaXJUb0NoZWNrLmxlbmd0aCA+IDAgJiYgZm91bmQgPT0gZmFsc2UpO1xyXG5cclxuXHR9IHdoaWxlIChkaXJUb0NoZWNrLmxlbmd0aCA+IDApO1xyXG5cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jb25uZWN0VW5jb25uZWN0ZWRSb29tcyA9IGZ1bmN0aW9uICgpIHtcclxuXHQvL1doaWxlIHRoZXJlIGFyZSB1bmNvbm5lY3RlZCByb29tcywgdHJ5IHRvIGNvbm5lY3QgdGhlbSB0byBhIHJhbmRvbSBjb25uZWN0ZWQgbmVpZ2hib3JcclxuXHQvLyhpZiBhIHJvb20gaGFzIG5vIGNvbm5lY3RlZCBuZWlnaGJvcnMgeWV0LCBqdXN0IGtlZXAgY3ljbGluZywgeW91J2xsIGZpbGwgb3V0IHRvIGl0IGV2ZW50dWFsbHkpLlxyXG5cdHZhciBjdyA9IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoO1xyXG5cdHZhciBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcclxuXHJcblx0dGhpcy5jb25uZWN0ZWRDZWxscyA9IHRoaXMuY29ubmVjdGVkQ2VsbHMucmFuZG9taXplKCk7XHJcblx0dmFyIHJvb207XHJcblx0dmFyIG90aGVyUm9vbTtcclxuXHR2YXIgdmFsaWRSb29tO1xyXG5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoOyBpKyspIHtcclxuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0OyBqKyspICB7XHJcblxyXG5cdFx0XHRyb29tID0gdGhpcy5yb29tc1tpXVtqXTtcclxuXHJcblx0XHRcdGlmIChyb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHR2YXIgZGlyZWN0aW9ucyA9IFswLCAyLCA0LCA2XTtcclxuXHRcdFx0XHRkaXJlY3Rpb25zID0gZGlyZWN0aW9ucy5yYW5kb21pemUoKTtcclxuXHJcblx0XHRcdFx0dmFsaWRSb29tID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdGRvIHtcclxuXHJcblx0XHRcdFx0XHR2YXIgZGlySWR4ID0gZGlyZWN0aW9ucy5wb3AoKTtcclxuXHRcdFx0XHRcdHZhciBuZXdJID0gaSArIFJPVC5ESVJTWzhdW2RpcklkeF1bMF07XHJcblx0XHRcdFx0XHR2YXIgbmV3SiA9IGogKyBST1QuRElSU1s4XVtkaXJJZHhdWzFdO1xyXG5cclxuXHRcdFx0XHRcdGlmIChuZXdJIDwgMCB8fCBuZXdJID49IGN3IHx8IG5ld0ogPCAwIHx8IG5ld0ogPj0gY2gpIHsgY29udGludWU7IH1cclxuXHJcblx0XHRcdFx0XHRvdGhlclJvb20gPSB0aGlzLnJvb21zW25ld0ldW25ld0pdO1xyXG5cclxuXHRcdFx0XHRcdHZhbGlkUm9vbSA9IHRydWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aCA9PSAwKSB7IGJyZWFrOyB9XHJcblxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGg7IGsrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAob3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl1ba11bMF0gPT0gaSAmJiBvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXVtrXVsxXSA9PSBqKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFsaWRSb29tID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAodmFsaWRSb29tKSB7IGJyZWFrOyB9XHJcblxyXG5cdFx0XHRcdH0gd2hpbGUgKGRpcmVjdGlvbnMubGVuZ3RoKTtcclxuXHJcblx0XHRcdFx0aWYgKHZhbGlkUm9vbSkge1xyXG5cdFx0XHRcdFx0cm9vbVtcImNvbm5lY3Rpb25zXCJdLnB1c2goW290aGVyUm9vbVtcImNlbGx4XCJdLCBvdGhlclJvb21bXCJjZWxseVwiXV0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIi0tIFVuYWJsZSB0byBjb25uZWN0IHJvb20uXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jcmVhdGVSYW5kb21Sb29tQ29ubmVjdGlvbnMgPSBmdW5jdGlvbiAoY29ubmVjdGlvbnMpIHtcclxuXHQvLyBFbXB0eSBmb3Igbm93LlxyXG59O1xyXG5cclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jcmVhdGVSb29tcyA9IGZ1bmN0aW9uICgpIHtcclxuXHQvLyBDcmVhdGUgUm9vbXNcclxuXHJcblx0dmFyIHcgPSB0aGlzLl93aWR0aDtcclxuXHR2YXIgaCA9IHRoaXMuX2hlaWdodDtcclxuXHJcblx0dmFyIGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XHJcblx0dmFyIGNoID0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0O1xyXG5cclxuXHR2YXIgY3dwID0gTWF0aC5mbG9vcih0aGlzLl93aWR0aCAvIGN3KTtcclxuXHR2YXIgY2hwID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQgLyBjaCk7XHJcblxyXG5cdHZhciByb29tdztcclxuXHR2YXIgcm9vbWg7XHJcblx0dmFyIHJvb21XaWR0aCA9IHRoaXMuX29wdGlvbnNbXCJyb29tV2lkdGhcIl07XHJcblx0dmFyIHJvb21IZWlnaHQgPSB0aGlzLl9vcHRpb25zW1wicm9vbUhlaWdodFwiXTtcclxuXHR2YXIgc3g7XHJcblx0dmFyIHN5O1xyXG5cdHZhciBvdGhlclJvb207XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY3c7IGkrKykge1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaDsgaisrKSB7XHJcblx0XHRcdHN4ID0gY3dwICogaTtcclxuXHRcdFx0c3kgPSBjaHAgKiBqO1xyXG5cclxuXHRcdFx0aWYgKHN4ID09IDApIHsgc3ggPSAxOyB9XHJcblx0XHRcdGlmIChzeSA9PSAwKSB7IHN5ID0gMTsgfVxyXG5cclxuXHRcdFx0cm9vbXcgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQocm9vbVdpZHRoWzBdLCByb29tV2lkdGhbMV0pO1xyXG5cdFx0XHRyb29taCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChyb29tSGVpZ2h0WzBdLCByb29tSGVpZ2h0WzFdKTtcclxuXHJcblx0XHRcdGlmIChqID4gMCkge1xyXG5cdFx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbaV1bai0xXTtcclxuXHRcdFx0XHR3aGlsZSAoc3kgLSAob3RoZXJSb29tW1wieVwiXSArIG90aGVyUm9vbVtcImhlaWdodFwiXSApIDwgMykge1xyXG5cdFx0XHRcdFx0c3krKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpID4gMCkge1xyXG5cdFx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbaS0xXVtqXTtcclxuXHRcdFx0XHR3aGlsZShzeCAtIChvdGhlclJvb21bXCJ4XCJdICsgb3RoZXJSb29tW1wid2lkdGhcIl0pIDwgMykge1xyXG5cdFx0XHRcdFx0c3grKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBzeE9mZnNldCA9IE1hdGgucm91bmQoUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGN3cC1yb29tdykvMik7XHJcblx0XHRcdHZhciBzeU9mZnNldCA9IE1hdGgucm91bmQoUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGNocC1yb29taCkvMik7XHJcblxyXG5cdFx0XHR3aGlsZSAoc3ggKyBzeE9mZnNldCArIHJvb213ID49IHcpIHtcclxuXHRcdFx0XHRpZihzeE9mZnNldCkge1xyXG5cdFx0XHRcdFx0c3hPZmZzZXQtLTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cm9vbXctLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHdoaWxlIChzeSArIHN5T2Zmc2V0ICsgcm9vbWggPj0gaCkge1xyXG5cdFx0XHRcdGlmKHN5T2Zmc2V0KSB7XHJcblx0XHRcdFx0XHRzeU9mZnNldC0tO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyb29taC0tO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3ggPSBzeCArIHN4T2Zmc2V0O1xyXG5cdFx0XHRzeSA9IHN5ICsgc3lPZmZzZXQ7XHJcblxyXG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wieFwiXSA9IHN4O1xyXG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wieVwiXSA9IHN5O1xyXG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wid2lkdGhcIl0gPSByb29tdztcclxuXHRcdFx0dGhpcy5yb29tc1tpXVtqXVtcImhlaWdodFwiXSA9IHJvb21oO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaWkgPSBzeDsgaWkgPCBzeCArIHJvb213OyBpaSsrKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgamogPSBzeTsgamogPCBzeSArIHJvb21oOyBqaisrKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1hcFtpaV1bampdID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fZ2V0V2FsbFBvc2l0aW9uID0gZnVuY3Rpb24gKGFSb29tLCBhRGlyZWN0aW9uKSB7XHJcblx0dmFyIHJ4O1xyXG5cdHZhciByeTtcclxuXHR2YXIgZG9vcjtcclxuXHJcblx0aWYgKGFEaXJlY3Rpb24gPT0gMSB8fCBhRGlyZWN0aW9uID09IDMpIHtcclxuXHRcdHJ4ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KGFSb29tW1wieFwiXSArIDEsIGFSb29tW1wieFwiXSArIGFSb29tW1wid2lkdGhcIl0gLSAyKTtcclxuXHRcdGlmIChhRGlyZWN0aW9uID09IDEpIHtcclxuXHRcdFx0cnkgPSBhUm9vbVtcInlcIl0gLSAyO1xyXG5cdFx0XHRkb29yID0gcnkgKyAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cnkgPSBhUm9vbVtcInlcIl0gKyBhUm9vbVtcImhlaWdodFwiXSArIDE7XHJcblx0XHRcdGRvb3IgPSByeSAtMTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLm1hcFtyeF1bZG9vcl0gPSAwOyAvLyBpJ20gbm90IHNldHRpbmcgYSBzcGVjaWZpYyAnZG9vcicgdGlsZSB2YWx1ZSByaWdodCBub3csIGp1c3QgZW1wdHkgc3BhY2UuXHJcblxyXG5cdH0gZWxzZSBpZiAoYURpcmVjdGlvbiA9PSAyIHx8IGFEaXJlY3Rpb24gPT0gNCkge1xyXG5cdFx0cnkgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQoYVJvb21bXCJ5XCJdICsgMSwgYVJvb21bXCJ5XCJdICsgYVJvb21bXCJoZWlnaHRcIl0gLSAyKTtcclxuXHRcdGlmKGFEaXJlY3Rpb24gPT0gMikge1xyXG5cdFx0XHRyeCA9IGFSb29tW1wieFwiXSArIGFSb29tW1wid2lkdGhcIl0gKyAxO1xyXG5cdFx0XHRkb29yID0gcnggLSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cnggPSBhUm9vbVtcInhcIl0gLSAyO1xyXG5cdFx0XHRkb29yID0gcnggKyAxO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubWFwW2Rvb3JdW3J5XSA9IDA7IC8vIGknbSBub3Qgc2V0dGluZyBhIHNwZWNpZmljICdkb29yJyB0aWxlIHZhbHVlIHJpZ2h0IG5vdywganVzdCBlbXB0eSBzcGFjZS5cclxuXHJcblx0fVxyXG5cdHJldHVybiBbcngsIHJ5XTtcclxufTtcclxuXHJcbi8qKipcclxuKiBAcGFyYW0gc3RhcnRQb3NpdGlvbiBhIDIgZWxlbWVudCBhcnJheVxyXG4qIEBwYXJhbSBlbmRQb3NpdGlvbiBhIDIgZWxlbWVudCBhcnJheVxyXG4qL1xyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fZHJhd0NvcnJpZG9yID0gZnVuY3Rpb24gKHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uKSB7XHJcblx0dmFyIHhPZmZzZXQgPSBlbmRQb3NpdGlvblswXSAtIHN0YXJ0UG9zaXRpb25bMF07XHJcblx0dmFyIHlPZmZzZXQgPSBlbmRQb3NpdGlvblsxXSAtIHN0YXJ0UG9zaXRpb25bMV07XHJcblxyXG5cdHZhciB4cG9zID0gc3RhcnRQb3NpdGlvblswXTtcclxuXHR2YXIgeXBvcyA9IHN0YXJ0UG9zaXRpb25bMV07XHJcblxyXG5cdHZhciB0ZW1wRGlzdDtcclxuXHR2YXIgeERpcjtcclxuXHR2YXIgeURpcjtcclxuXHJcblx0dmFyIG1vdmU7IC8vIDIgZWxlbWVudCBhcnJheSwgZWxlbWVudCAwIGlzIHRoZSBkaXJlY3Rpb24sIGVsZW1lbnQgMSBpcyB0aGUgdG90YWwgdmFsdWUgdG8gbW92ZS5cclxuXHR2YXIgbW92ZXMgPSBbXTsgLy8gYSBsaXN0IG9mIDIgZWxlbWVudCBhcnJheXNcclxuXHJcblx0dmFyIHhBYnMgPSBNYXRoLmFicyh4T2Zmc2V0KTtcclxuXHR2YXIgeUFicyA9IE1hdGguYWJzKHlPZmZzZXQpO1xyXG5cclxuXHR2YXIgcGVyY2VudCA9IFJPVC5STkcuZ2V0VW5pZm9ybSgpOyAvLyB1c2VkIHRvIHNwbGl0IHRoZSBtb3ZlIGF0IGRpZmZlcmVudCBwbGFjZXMgYWxvbmcgdGhlIGxvbmcgYXhpc1xyXG5cdHZhciBmaXJzdEhhbGYgPSBwZXJjZW50O1xyXG5cdHZhciBzZWNvbmRIYWxmID0gMSAtIHBlcmNlbnQ7XHJcblxyXG5cdHhEaXIgPSB4T2Zmc2V0ID4gMCA/IDIgOiA2O1xyXG5cdHlEaXIgPSB5T2Zmc2V0ID4gMCA/IDQgOiAwO1xyXG5cclxuXHRpZiAoeEFicyA8IHlBYnMpIHtcclxuXHRcdC8vIG1vdmUgZmlyc3RIYWxmIG9mIHRoZSB5IG9mZnNldFxyXG5cdFx0dGVtcERpc3QgPSBNYXRoLmNlaWwoeUFicyAqIGZpcnN0SGFsZik7XHJcblx0XHRtb3Zlcy5wdXNoKFt5RGlyLCB0ZW1wRGlzdF0pO1xyXG5cdFx0Ly8gbW92ZSBhbGwgdGhlIHggb2Zmc2V0XHJcblx0XHRtb3Zlcy5wdXNoKFt4RGlyLCB4QWJzXSk7XHJcblx0XHQvLyBtb3ZlIHNlbmRIYWxmIG9mIHRoZSAgeSBvZmZzZXRcclxuXHRcdHRlbXBEaXN0ID0gTWF0aC5mbG9vcih5QWJzICogc2Vjb25kSGFsZik7XHJcblx0XHRtb3Zlcy5wdXNoKFt5RGlyLCB0ZW1wRGlzdF0pO1xyXG5cdH0gZWxzZSB7XHJcblx0XHQvLyAgbW92ZSBmaXJzdEhhbGYgb2YgdGhlIHggb2Zmc2V0XHJcblx0XHR0ZW1wRGlzdCA9IE1hdGguY2VpbCh4QWJzICogZmlyc3RIYWxmKTtcclxuXHRcdG1vdmVzLnB1c2goW3hEaXIsIHRlbXBEaXN0XSk7XHJcblx0XHQvLyBtb3ZlIGFsbCB0aGUgeSBvZmZzZXRcclxuXHRcdG1vdmVzLnB1c2goW3lEaXIsIHlBYnNdKTtcclxuXHRcdC8vIG1vdmUgc2Vjb25kSGFsZiBvZiB0aGUgeCBvZmZzZXQuXHJcblx0XHR0ZW1wRGlzdCA9IE1hdGguZmxvb3IoeEFicyAqIHNlY29uZEhhbGYpO1xyXG5cdFx0bW92ZXMucHVzaChbeERpciwgdGVtcERpc3RdKTtcclxuXHR9XHJcblxyXG5cdHRoaXMubWFwW3hwb3NdW3lwb3NdID0gMDtcclxuXHJcblx0d2hpbGUgKG1vdmVzLmxlbmd0aCA+IDApIHtcclxuXHRcdG1vdmUgPSBtb3Zlcy5wb3AoKTtcclxuXHRcdHdoaWxlIChtb3ZlWzFdID4gMCkge1xyXG5cdFx0XHR4cG9zICs9IFJPVC5ESVJTWzhdW21vdmVbMF1dWzBdO1xyXG5cdFx0XHR5cG9zICs9IFJPVC5ESVJTWzhdW21vdmVbMF1dWzFdO1xyXG5cdFx0XHR0aGlzLm1hcFt4cG9zXVt5cG9zXSA9IDA7XHJcblx0XHRcdG1vdmVbMV0gPSBtb3ZlWzFdIC0gMTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY3JlYXRlQ29ycmlkb3JzID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vIERyYXcgQ29ycmlkb3JzIGJldHdlZW4gY29ubmVjdGVkIHJvb21zXHJcblxyXG5cdHZhciBjdyA9IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoO1xyXG5cdHZhciBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcclxuXHR2YXIgcm9vbTtcclxuXHR2YXIgY29ubmVjdGlvbjtcclxuXHR2YXIgb3RoZXJSb29tO1xyXG5cdHZhciB3YWxsO1xyXG5cdHZhciBvdGhlcldhbGw7XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY3c7IGkrKykge1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaDsgaisrKSB7XHJcblx0XHRcdHJvb20gPSB0aGlzLnJvb21zW2ldW2pdO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCByb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoOyBrKyspIHtcclxuXHJcblx0XHRcdFx0Y29ubmVjdGlvbiA9IHJvb21bXCJjb25uZWN0aW9uc1wiXVtrXTtcclxuXHJcblx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tjb25uZWN0aW9uWzBdXVtjb25uZWN0aW9uWzFdXTtcclxuXHJcblx0XHRcdFx0Ly8gZmlndXJlIG91dCB3aGF0IHdhbGwgb3VyIGNvcnJpZG9yIHdpbGwgc3RhcnQgb25lLlxyXG5cdFx0XHRcdC8vIGZpZ3VyZSBvdXQgd2hhdCB3YWxsIG91ciBjb3JyaWRvciB3aWxsIGVuZCBvbi5cclxuXHRcdFx0XHRpZiAob3RoZXJSb29tW1wiY2VsbHhcIl0gPiByb29tW1wiY2VsbHhcIl0pIHtcclxuXHRcdFx0XHRcdHdhbGwgPSAyO1xyXG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gNDtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG90aGVyUm9vbVtcImNlbGx4XCJdIDwgcm9vbVtcImNlbGx4XCJdKSB7XHJcblx0XHRcdFx0XHR3YWxsID0gNDtcclxuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDI7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG90aGVyUm9vbVtcImNlbGx5XCJdID4gcm9vbVtcImNlbGx5XCJdKSB7XHJcblx0XHRcdFx0XHR3YWxsID0gMztcclxuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDE7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG90aGVyUm9vbVtcImNlbGx5XCJdIDwgcm9vbVtcImNlbGx5XCJdKSB7XHJcblx0XHRcdFx0XHR3YWxsID0gMTtcclxuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDM7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLl9kcmF3Q29ycmlkb3IodGhpcy5fZ2V0V2FsbFBvc2l0aW9uKHJvb20sIHdhbGwpLCB0aGlzLl9nZXRXYWxsUG9zaXRpb24ob3RoZXJSb29tLCBvdGhlcldhbGwpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBEdW5nZW9uIGZlYXR1cmU7IGhhcyBvd24gLmNyZWF0ZSgpIG1ldGhvZFxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlID0gZnVuY3Rpb24oKSB7fTtcclxuUk9ULk1hcC5GZWF0dXJlLnByb3RvdHlwZS5pc1ZhbGlkID0gZnVuY3Rpb24oY2FuQmVEdWdDYWxsYmFjaykge307XHJcblJPVC5NYXAuRmVhdHVyZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHt9O1xyXG5ST1QuTWFwLkZlYXR1cmUucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24oKSB7fTtcclxuUk9ULk1hcC5GZWF0dXJlLmNyZWF0ZVJhbmRvbUF0ID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5LCBvcHRpb25zKSB7fTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUm9vbVxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5GZWF0dXJlXHJcbiAqIEBwYXJhbSB7aW50fSB4MVxyXG4gKiBAcGFyYW0ge2ludH0geTFcclxuICogQHBhcmFtIHtpbnR9IHgyXHJcbiAqIEBwYXJhbSB7aW50fSB5MlxyXG4gKiBAcGFyYW0ge2ludH0gW2Rvb3JYXVxyXG4gKiBAcGFyYW0ge2ludH0gW2Rvb3JZXVxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20gPSBmdW5jdGlvbih4MSwgeTEsIHgyLCB5MiwgZG9vclgsIGRvb3JZKSB7XHJcblx0dGhpcy5feDEgPSB4MTtcclxuXHR0aGlzLl95MSA9IHkxO1xyXG5cdHRoaXMuX3gyID0geDI7XHJcblx0dGhpcy5feTIgPSB5MjtcclxuXHR0aGlzLl9kb29ycyA9IHt9O1xyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID4gNCkgeyB0aGlzLmFkZERvb3IoZG9vclgsIGRvb3JZKTsgfVxyXG59O1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5leHRlbmQoUk9ULk1hcC5GZWF0dXJlKTtcclxuXHJcbi8qKlxyXG4gKiBSb29tIG9mIHJhbmRvbSBzaXplLCB3aXRoIGEgZ2l2ZW4gZG9vcnMgYW5kIGRpcmVjdGlvblxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tQXQgPSBmdW5jdGlvbih4LCB5LCBkeCwgZHksIG9wdGlvbnMpIHtcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbVdpZHRoWzFdO1xyXG5cdHZhciB3aWR0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbUhlaWdodFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xyXG5cdHZhciBoZWlnaHQgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdGlmIChkeCA9PSAxKSB7IC8qIHRvIHRoZSByaWdodCAqL1xyXG5cdFx0dmFyIHkyID0geSAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiBoZWlnaHQpO1xyXG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgrMSwgeTIsIHgrd2lkdGgsIHkyK2hlaWdodC0xLCB4LCB5KTtcclxuXHR9XHJcblx0XHJcblx0aWYgKGR4ID09IC0xKSB7IC8qIHRvIHRoZSBsZWZ0ICovXHJcblx0XHR2YXIgeTIgPSB5IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIGhlaWdodCk7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoeC13aWR0aCwgeTIsIHgtMSwgeTIraGVpZ2h0LTEsIHgsIHkpO1xyXG5cdH1cclxuXHJcblx0aWYgKGR5ID09IDEpIHsgLyogdG8gdGhlIGJvdHRvbSAqL1xyXG5cdFx0dmFyIHgyID0geCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoeDIsIHkrMSwgeDIrd2lkdGgtMSwgeStoZWlnaHQsIHgsIHkpO1xyXG5cdH1cclxuXHJcblx0aWYgKGR5ID09IC0xKSB7IC8qIHRvIHRoZSB0b3AgKi9cclxuXHRcdHZhciB4MiA9IHggLSBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogd2lkdGgpO1xyXG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgyLCB5LWhlaWdodCwgeDIrd2lkdGgtMSwgeS0xLCB4LCB5KTtcclxuXHR9XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImR4IG9yIGR5IG11c3QgYmUgMSBvciAtMVwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSb29tIG9mIHJhbmRvbSBzaXplLCBwb3NpdGlvbmVkIGFyb3VuZCBjZW50ZXIgY29vcmRzXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb21DZW50ZXIgPSBmdW5jdGlvbihjeCwgY3ksIG9wdGlvbnMpIHtcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbVdpZHRoWzFdO1xyXG5cdHZhciB3aWR0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbUhlaWdodFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xyXG5cdHZhciBoZWlnaHQgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cclxuXHR2YXIgeDEgPSBjeCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqd2lkdGgpO1xyXG5cdHZhciB5MSA9IGN5IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSpoZWlnaHQpO1xyXG5cdHZhciB4MiA9IHgxICsgd2lkdGggLSAxO1xyXG5cdHZhciB5MiA9IHkxICsgaGVpZ2h0IC0gMTtcclxuXHJcblx0cmV0dXJuIG5ldyB0aGlzKHgxLCB5MSwgeDIsIHkyKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSb29tIG9mIHJhbmRvbSBzaXplIHdpdGhpbiBhIGdpdmVuIGRpbWVuc2lvbnNcclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbVdpZHRoWzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21XaWR0aFsxXTtcclxuXHR2YXIgd2lkdGggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21IZWlnaHRbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbUhlaWdodFsxXTtcclxuXHR2YXIgaGVpZ2h0ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHR2YXIgbGVmdCA9IGF2YWlsV2lkdGggLSB3aWR0aCAtIDE7XHJcblx0dmFyIHRvcCA9IGF2YWlsSGVpZ2h0IC0gaGVpZ2h0IC0gMTtcclxuXHJcblx0dmFyIHgxID0gMSArIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqbGVmdCk7XHJcblx0dmFyIHkxID0gMSArIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqdG9wKTtcclxuXHR2YXIgeDIgPSB4MSArIHdpZHRoIC0gMTtcclxuXHR2YXIgeTIgPSB5MSArIGhlaWdodCAtIDE7XHJcblxyXG5cdHJldHVybiBuZXcgdGhpcyh4MSwgeTEsIHgyLCB5Mik7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuYWRkRG9vciA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHR0aGlzLl9kb29yc1t4K1wiLFwiK3ldID0gMTtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufVxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldERvb3JzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fZG9vcnMpIHtcclxuXHRcdHZhciBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XHJcblx0XHRjYWxsYmFjayhwYXJzZUludChwYXJ0c1swXSksIHBhcnNlSW50KHBhcnRzWzFdKSk7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmNsZWFyRG9vcnMgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9kb29ycyA9IHt9O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmFkZERvb3JzID0gZnVuY3Rpb24oaXNXYWxsQ2FsbGJhY2spIHtcclxuXHR2YXIgbGVmdCA9IHRoaXMuX3gxLTE7XHJcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcclxuXHR2YXIgdG9wID0gdGhpcy5feTEtMTtcclxuXHR2YXIgYm90dG9tID0gdGhpcy5feTIrMTtcclxuXHJcblx0Zm9yICh2YXIgeD1sZWZ0OyB4PD1yaWdodDsgeCsrKSB7XHJcblx0XHRmb3IgKHZhciB5PXRvcDsgeTw9Ym90dG9tOyB5KyspIHtcclxuXHRcdFx0aWYgKHggIT0gbGVmdCAmJiB4ICE9IHJpZ2h0ICYmIHkgIT0gdG9wICYmIHkgIT0gYm90dG9tKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRcdGlmIChpc1dhbGxDYWxsYmFjayh4LCB5KSkgeyBjb250aW51ZTsgfVxyXG5cclxuXHRcdFx0dGhpcy5hZGREb29yKHgsIHkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbigpIHtcclxuXHRjb25zb2xlLmxvZyhcInJvb21cIiwgdGhpcy5feDEsIHRoaXMuX3kxLCB0aGlzLl94MiwgdGhpcy5feTIpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmlzVmFsaWQgPSBmdW5jdGlvbihpc1dhbGxDYWxsYmFjaywgY2FuQmVEdWdDYWxsYmFjaykgeyBcclxuXHR2YXIgbGVmdCA9IHRoaXMuX3gxLTE7XHJcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcclxuXHR2YXIgdG9wID0gdGhpcy5feTEtMTtcclxuXHR2YXIgYm90dG9tID0gdGhpcy5feTIrMTtcclxuXHRcclxuXHRmb3IgKHZhciB4PWxlZnQ7IHg8PXJpZ2h0OyB4KyspIHtcclxuXHRcdGZvciAodmFyIHk9dG9wOyB5PD1ib3R0b207IHkrKykge1xyXG5cdFx0XHRpZiAoeCA9PSBsZWZ0IHx8IHggPT0gcmlnaHQgfHwgeSA9PSB0b3AgfHwgeSA9PSBib3R0b20pIHtcclxuXHRcdFx0XHRpZiAoIWlzV2FsbENhbGxiYWNrKHgsIHkpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmICghY2FuQmVEdWdDYWxsYmFjayh4LCB5KSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZGlnQ2FsbGJhY2sgRGlnIGNhbGxiYWNrIHdpdGggYSBzaWduYXR1cmUgKHgsIHksIHZhbHVlKS4gVmFsdWVzOiAwID0gZW1wdHksIDEgPSB3YWxsLCAyID0gZG9vci4gTXVsdGlwbGUgZG9vcnMgYXJlIGFsbG93ZWQuXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHsgXHJcblx0dmFyIGxlZnQgPSB0aGlzLl94MS0xO1xyXG5cdHZhciByaWdodCA9IHRoaXMuX3gyKzE7XHJcblx0dmFyIHRvcCA9IHRoaXMuX3kxLTE7XHJcblx0dmFyIGJvdHRvbSA9IHRoaXMuX3kyKzE7XHJcblx0XHJcblx0dmFyIHZhbHVlID0gMDtcclxuXHRmb3IgKHZhciB4PWxlZnQ7IHg8PXJpZ2h0OyB4KyspIHtcclxuXHRcdGZvciAodmFyIHk9dG9wOyB5PD1ib3R0b207IHkrKykge1xyXG5cdFx0XHRpZiAoeCtcIixcIit5IGluIHRoaXMuX2Rvb3JzKSB7XHJcblx0XHRcdFx0dmFsdWUgPSAyO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHggPT0gbGVmdCB8fCB4ID09IHJpZ2h0IHx8IHkgPT0gdG9wIHx8IHkgPT0gYm90dG9tKSB7XHJcblx0XHRcdFx0dmFsdWUgPSAxO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhbHVlID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkaWdDYWxsYmFjayh4LCB5LCB2YWx1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldENlbnRlciA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiBbTWF0aC5yb3VuZCgodGhpcy5feDEgKyB0aGlzLl94MikvMiksIE1hdGgucm91bmQoKHRoaXMuX3kxICsgdGhpcy5feTIpLzIpXTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5nZXRMZWZ0ID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3gxO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldFJpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3gyO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldFRvcCA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl95MTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5nZXRCb3R0b20gPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5feTI7XHJcbn07XHJcblxyXG4vKipcclxuICogQGNsYXNzIENvcnJpZG9yXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwLkZlYXR1cmVcclxuICogQHBhcmFtIHtpbnR9IHN0YXJ0WFxyXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRZXHJcbiAqIEBwYXJhbSB7aW50fSBlbmRYXHJcbiAqIEBwYXJhbSB7aW50fSBlbmRZXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IgPSBmdW5jdGlvbihzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSkge1xyXG5cdHRoaXMuX3N0YXJ0WCA9IHN0YXJ0WDtcclxuXHR0aGlzLl9zdGFydFkgPSBzdGFydFk7XHJcblx0dGhpcy5fZW5kWCA9IGVuZFg7IFxyXG5cdHRoaXMuX2VuZFkgPSBlbmRZO1xyXG5cdHRoaXMuX2VuZHNXaXRoQVdhbGwgPSB0cnVlO1xyXG59O1xyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IuZXh0ZW5kKFJPVC5NYXAuRmVhdHVyZSk7XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IuY3JlYXRlUmFuZG9tQXQgPSBmdW5jdGlvbih4LCB5LCBkeCwgZHksIG9wdGlvbnMpIHtcclxuXHR2YXIgbWluID0gb3B0aW9ucy5jb3JyaWRvckxlbmd0aFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5jb3JyaWRvckxlbmd0aFsxXTtcclxuXHR2YXIgbGVuZ3RoID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IHRoaXMoeCwgeSwgeCArIGR4Kmxlbmd0aCwgeSArIGR5Kmxlbmd0aCk7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24oKSB7XHJcblx0Y29uc29sZS5sb2coXCJjb3JyaWRvclwiLCB0aGlzLl9zdGFydFgsIHRoaXMuX3N0YXJ0WSwgdGhpcy5fZW5kWCwgdGhpcy5fZW5kWSk7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmlzVmFsaWQgPSBmdW5jdGlvbihpc1dhbGxDYWxsYmFjaywgY2FuQmVEdWdDYWxsYmFjayl7IFxyXG5cdHZhciBzeCA9IHRoaXMuX3N0YXJ0WDtcclxuXHR2YXIgc3kgPSB0aGlzLl9zdGFydFk7XHJcblx0dmFyIGR4ID0gdGhpcy5fZW5kWC1zeDtcclxuXHR2YXIgZHkgPSB0aGlzLl9lbmRZLXN5O1xyXG5cdHZhciBsZW5ndGggPSAxICsgTWF0aC5tYXgoTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpO1xyXG5cdFxyXG5cdGlmIChkeCkgeyBkeCA9IGR4L01hdGguYWJzKGR4KTsgfVxyXG5cdGlmIChkeSkgeyBkeSA9IGR5L01hdGguYWJzKGR5KTsgfVxyXG5cdHZhciBueCA9IGR5O1xyXG5cdHZhciBueSA9IC1keDtcclxuXHRcclxuXHR2YXIgb2sgPSB0cnVlO1xyXG5cdGZvciAodmFyIGk9MDsgaTxsZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHggPSBzeCArIGkqZHg7XHJcblx0XHR2YXIgeSA9IHN5ICsgaSpkeTtcclxuXHJcblx0XHRpZiAoIWNhbkJlRHVnQ2FsbGJhY2soICAgICB4LCAgICAgIHkpKSB7IG9rID0gZmFsc2U7IH1cclxuXHRcdGlmICghaXNXYWxsQ2FsbGJhY2sgICh4ICsgbngsIHkgKyBueSkpIHsgb2sgPSBmYWxzZTsgfVxyXG5cdFx0aWYgKCFpc1dhbGxDYWxsYmFjayAgKHggLSBueCwgeSAtIG55KSkgeyBvayA9IGZhbHNlOyB9XHJcblx0XHRcclxuXHRcdGlmICghb2spIHtcclxuXHRcdFx0bGVuZ3RoID0gaTtcclxuXHRcdFx0dGhpcy5fZW5kWCA9IHgtZHg7XHJcblx0XHRcdHRoaXMuX2VuZFkgPSB5LWR5O1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0LyoqXHJcblx0ICogSWYgdGhlIGxlbmd0aCBkZWdlbmVyYXRlZCwgdGhpcyBjb3JyaWRvciBtaWdodCBiZSBpbnZhbGlkXHJcblx0ICovXHJcblx0IFxyXG5cdC8qIG5vdCBzdXBwb3J0ZWQgKi9cclxuXHRpZiAobGVuZ3RoID09IDApIHsgcmV0dXJuIGZhbHNlOyB9IFxyXG5cdFxyXG5cdCAvKiBsZW5ndGggMSBhbGxvd2VkIG9ubHkgaWYgdGhlIG5leHQgc3BhY2UgaXMgZW1wdHkgKi9cclxuXHRpZiAobGVuZ3RoID09IDEgJiYgaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIFdlIGRvIG5vdCB3YW50IHRoZSBjb3JyaWRvciB0byBjcmFzaCBpbnRvIGEgY29ybmVyIG9mIGEgcm9vbTtcclxuXHQgKiBpZiBhbnkgb2YgdGhlIGVuZGluZyBjb3JuZXJzIGlzIGVtcHR5LCB0aGUgTisxdGggY2VsbCBvZiB0aGlzIGNvcnJpZG9yIG11c3QgYmUgZW1wdHkgdG9vLlxyXG5cdCAqIFxyXG5cdCAqIFNpdHVhdGlvbjpcclxuXHQgKiAjIyMjIyMjMVxyXG5cdCAqIC4uLi4uLi4/XHJcblx0ICogIyMjIyMjIzJcclxuXHQgKiBcclxuXHQgKiBUaGUgY29ycmlkb3Igd2FzIGR1ZyBmcm9tIGxlZnQgdG8gcmlnaHQuXHJcblx0ICogMSwgMiAtIHByb2JsZW1hdGljIGNvcm5lcnMsID8gPSBOKzF0aCBjZWxsIChub3QgZHVnKVxyXG5cdCAqL1xyXG5cdHZhciBmaXJzdENvcm5lckJhZCA9ICFpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHggKyBueCwgdGhpcy5fZW5kWSArIGR5ICsgbnkpO1xyXG5cdHZhciBzZWNvbmRDb3JuZXJCYWQgPSAhaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4IC0gbngsIHRoaXMuX2VuZFkgKyBkeSAtIG55KTtcclxuXHR0aGlzLl9lbmRzV2l0aEFXYWxsID0gaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpO1xyXG5cdGlmICgoZmlyc3RDb3JuZXJCYWQgfHwgc2Vjb25kQ29ybmVyQmFkKSAmJiB0aGlzLl9lbmRzV2l0aEFXYWxsKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaWdDYWxsYmFjayBEaWcgY2FsbGJhY2sgd2l0aCBhIHNpZ25hdHVyZSAoeCwgeSwgdmFsdWUpLiBWYWx1ZXM6IDAgPSBlbXB0eS5cclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHsgXHJcblx0dmFyIHN4ID0gdGhpcy5fc3RhcnRYO1xyXG5cdHZhciBzeSA9IHRoaXMuX3N0YXJ0WTtcclxuXHR2YXIgZHggPSB0aGlzLl9lbmRYLXN4O1xyXG5cdHZhciBkeSA9IHRoaXMuX2VuZFktc3k7XHJcblx0dmFyIGxlbmd0aCA9IDErTWF0aC5tYXgoTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpO1xyXG5cdFxyXG5cdGlmIChkeCkgeyBkeCA9IGR4L01hdGguYWJzKGR4KTsgfVxyXG5cdGlmIChkeSkgeyBkeSA9IGR5L01hdGguYWJzKGR5KTsgfVxyXG5cdHZhciBueCA9IGR5O1xyXG5cdHZhciBueSA9IC1keDtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciB4ID0gc3ggKyBpKmR4O1xyXG5cdFx0dmFyIHkgPSBzeSArIGkqZHk7XHJcblx0XHRkaWdDYWxsYmFjayh4LCB5LCAwKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmNyZWF0ZVByaW9yaXR5V2FsbHMgPSBmdW5jdGlvbihwcmlvcml0eVdhbGxDYWxsYmFjaykge1xyXG5cdGlmICghdGhpcy5fZW5kc1dpdGhBV2FsbCkgeyByZXR1cm47IH1cclxuXHJcblx0dmFyIHN4ID0gdGhpcy5fc3RhcnRYO1xyXG5cdHZhciBzeSA9IHRoaXMuX3N0YXJ0WTtcclxuXHJcblx0dmFyIGR4ID0gdGhpcy5fZW5kWC1zeDtcclxuXHR2YXIgZHkgPSB0aGlzLl9lbmRZLXN5O1xyXG5cdGlmIChkeCkgeyBkeCA9IGR4L01hdGguYWJzKGR4KTsgfVxyXG5cdGlmIChkeSkgeyBkeSA9IGR5L01hdGguYWJzKGR5KTsgfVxyXG5cdHZhciBueCA9IGR5O1xyXG5cdHZhciBueSA9IC1keDtcclxuXHJcblx0cHJpb3JpdHlXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpO1xyXG5cdHByaW9yaXR5V2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBueCwgdGhpcy5fZW5kWSArIG55KTtcclxuXHRwcmlvcml0eVdhbGxDYWxsYmFjayh0aGlzLl9lbmRYIC0gbngsIHRoaXMuX2VuZFkgLSBueSk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQmFzZSBub2lzZSBnZW5lcmF0b3JcclxuICovXHJcblJPVC5Ob2lzZSA9IGZ1bmN0aW9uKCkge1xyXG59O1xyXG5cclxuUk9ULk5vaXNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbih4LCB5KSB7fTtcclxuLyoqXHJcbiAqIEEgc2ltcGxlIDJkIGltcGxlbWVudGF0aW9uIG9mIHNpbXBsZXggbm9pc2UgYnkgT25kcmVqIFphcmFcclxuICpcclxuICogQmFzZWQgb24gYSBzcGVlZC1pbXByb3ZlZCBzaW1wbGV4IG5vaXNlIGFsZ29yaXRobSBmb3IgMkQsIDNEIGFuZCA0RCBpbiBKYXZhLlxyXG4gKiBXaGljaCBpcyBiYXNlZCBvbiBleGFtcGxlIGNvZGUgYnkgU3RlZmFuIEd1c3RhdnNvbiAoc3RlZ3VAaXRuLmxpdS5zZSkuXHJcbiAqIFdpdGggT3B0aW1pc2F0aW9ucyBieSBQZXRlciBFYXN0bWFuIChwZWFzdG1hbkBkcml6emxlLnN0YW5mb3JkLmVkdSkuXHJcbiAqIEJldHRlciByYW5rIG9yZGVyaW5nIG1ldGhvZCBieSBTdGVmYW4gR3VzdGF2c29uIGluIDIwMTIuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyAyRCBzaW1wbGV4IG5vaXNlIGdlbmVyYXRvclxyXG4gKiBAcGFyYW0ge2ludH0gW2dyYWRpZW50cz0yNTZdIFJhbmRvbSBncmFkaWVudHNcclxuICovXHJcblJPVC5Ob2lzZS5TaW1wbGV4ID0gZnVuY3Rpb24oZ3JhZGllbnRzKSB7XHJcblx0Uk9ULk5vaXNlLmNhbGwodGhpcyk7XHJcblxyXG5cdHRoaXMuX0YyID0gMC41ICogKE1hdGguc3FydCgzKSAtIDEpO1xyXG5cdHRoaXMuX0cyID0gKDMgLSBNYXRoLnNxcnQoMykpIC8gNjtcclxuXHJcblx0dGhpcy5fZ3JhZGllbnRzID0gW1xyXG5cdFx0WyAwLCAtMV0sXHJcblx0XHRbIDEsIC0xXSxcclxuXHRcdFsgMSwgIDBdLFxyXG5cdFx0WyAxLCAgMV0sXHJcblx0XHRbIDAsICAxXSxcclxuXHRcdFstMSwgIDFdLFxyXG5cdFx0Wy0xLCAgMF0sXHJcblx0XHRbLTEsIC0xXVxyXG5cdF07XHJcblxyXG5cdHZhciBwZXJtdXRhdGlvbnMgPSBbXTtcclxuXHR2YXIgY291bnQgPSBncmFkaWVudHMgfHwgMjU2O1xyXG5cdGZvciAodmFyIGk9MDtpPGNvdW50O2krKykgeyBwZXJtdXRhdGlvbnMucHVzaChpKTsgfVxyXG5cdHBlcm11dGF0aW9ucyA9IHBlcm11dGF0aW9ucy5yYW5kb21pemUoKTtcclxuXHJcblx0dGhpcy5fcGVybXMgPSBbXTtcclxuXHR0aGlzLl9pbmRleGVzID0gW107XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPDIqY291bnQ7aSsrKSB7XHJcblx0XHR0aGlzLl9wZXJtcy5wdXNoKHBlcm11dGF0aW9uc1tpICUgY291bnRdKTtcclxuXHRcdHRoaXMuX2luZGV4ZXMucHVzaCh0aGlzLl9wZXJtc1tpXSAlIHRoaXMuX2dyYWRpZW50cy5sZW5ndGgpO1xyXG5cdH1cclxuXHJcbn07XHJcblJPVC5Ob2lzZS5TaW1wbGV4LmV4dGVuZChST1QuTm9pc2UpO1xyXG5cclxuUk9ULk5vaXNlLlNpbXBsZXgucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHhpbiwgeWluKSB7XHJcblx0dmFyIHBlcm1zID0gdGhpcy5fcGVybXM7XHJcblx0dmFyIGluZGV4ZXMgPSB0aGlzLl9pbmRleGVzO1xyXG5cdHZhciBjb3VudCA9IHBlcm1zLmxlbmd0aC8yO1xyXG5cdHZhciBHMiA9IHRoaXMuX0cyO1xyXG5cclxuXHR2YXIgbjAgPTAsIG4xID0gMCwgbjIgPSAwLCBnaTsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXHJcblxyXG5cdC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cclxuXHR2YXIgcyA9ICh4aW4gKyB5aW4pICogdGhpcy5fRjI7IC8vIEhhaXJ5IGZhY3RvciBmb3IgMkRcclxuXHR2YXIgaSA9IE1hdGguZmxvb3IoeGluICsgcyk7XHJcblx0dmFyIGogPSBNYXRoLmZsb29yKHlpbiArIHMpO1xyXG5cdHZhciB0ID0gKGkgKyBqKSAqIEcyO1xyXG5cdHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSkgc3BhY2VcclxuXHR2YXIgWTAgPSBqIC0gdDtcclxuXHR2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cclxuXHR2YXIgeTAgPSB5aW4gLSBZMDtcclxuXHJcblx0Ly8gRm9yIHRoZSAyRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhbiBlcXVpbGF0ZXJhbCB0cmlhbmdsZS5cclxuXHQvLyBEZXRlcm1pbmUgd2hpY2ggc2ltcGxleCB3ZSBhcmUgaW4uXHJcblx0dmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xyXG5cdGlmICh4MCA+IHkwKSB7XHJcblx0XHRpMSA9IDE7XHJcblx0XHRqMSA9IDA7XHJcblx0fSBlbHNlIHsgLy8gbG93ZXIgdHJpYW5nbGUsIFhZIG9yZGVyOiAoMCwwKS0+KDEsMCktPigxLDEpXHJcblx0XHRpMSA9IDA7XHJcblx0XHRqMSA9IDE7XHJcblx0fSAvLyB1cHBlciB0cmlhbmdsZSwgWVggb3JkZXI6ICgwLDApLT4oMCwxKS0+KDEsMSlcclxuXHJcblx0Ly8gQSBzdGVwIG9mICgxLDApIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jKSBpbiAoeCx5KSwgYW5kXHJcblx0Ly8gYSBzdGVwIG9mICgwLDEpIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jKSBpbiAoeCx5KSwgd2hlcmVcclxuXHQvLyBjID0gKDMtc3FydCgzKSkvNlxyXG5cdHZhciB4MSA9IHgwIC0gaTEgKyBHMjsgLy8gT2Zmc2V0cyBmb3IgbWlkZGxlIGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcclxuXHR2YXIgeTEgPSB5MCAtIGoxICsgRzI7XHJcblx0dmFyIHgyID0geDAgLSAxICsgMipHMjsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXHJcblx0dmFyIHkyID0geTAgLSAxICsgMipHMjtcclxuXHJcblx0Ly8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSB0aHJlZSBzaW1wbGV4IGNvcm5lcnNcclxuXHR2YXIgaWkgPSBpLm1vZChjb3VudCk7XHJcblx0dmFyIGpqID0gai5tb2QoY291bnQpO1xyXG5cclxuXHQvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXHJcblx0dmFyIHQwID0gMC41IC0geDAqeDAgLSB5MCp5MDtcclxuXHRpZiAodDAgPj0gMCkge1xyXG5cdFx0dDAgKj0gdDA7XHJcblx0XHRnaSA9IGluZGV4ZXNbaWkrcGVybXNbampdXTtcclxuXHRcdHZhciBncmFkID0gdGhpcy5fZ3JhZGllbnRzW2dpXTtcclxuXHRcdG4wID0gdDAgKiB0MCAqIChncmFkWzBdICogeDAgKyBncmFkWzFdICogeTApO1xyXG5cdH1cclxuXHRcclxuXHR2YXIgdDEgPSAwLjUgLSB4MSp4MSAtIHkxKnkxO1xyXG5cdGlmICh0MSA+PSAwKSB7XHJcblx0XHR0MSAqPSB0MTtcclxuXHRcdGdpID0gaW5kZXhlc1tpaStpMStwZXJtc1tqaitqMV1dO1xyXG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xyXG5cdFx0bjEgPSB0MSAqIHQxICogKGdyYWRbMF0gKiB4MSArIGdyYWRbMV0gKiB5MSk7XHJcblx0fVxyXG5cdFxyXG5cdHZhciB0MiA9IDAuNSAtIHgyKngyIC0geTIqeTI7XHJcblx0aWYgKHQyID49IDApIHtcclxuXHRcdHQyICo9IHQyO1xyXG5cdFx0Z2kgPSBpbmRleGVzW2lpKzErcGVybXNbamorMV1dO1xyXG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xyXG5cdFx0bjIgPSB0MiAqIHQyICogKGdyYWRbMF0gKiB4MiArIGdyYWRbMV0gKiB5Mik7XHJcblx0fVxyXG5cclxuXHQvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXHJcblx0Ly8gVGhlIHJlc3VsdCBpcyBzY2FsZWQgdG8gcmV0dXJuIHZhbHVlcyBpbiB0aGUgaW50ZXJ2YWwgWy0xLDFdLlxyXG5cdHJldHVybiA3MCAqIChuMCArIG4xICsgbjIpO1xyXG59XHJcbi8qKlxyXG4gKiBAY2xhc3MgQWJzdHJhY3QgRk9WIGFsZ29yaXRobVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaWdodFBhc3Nlc0NhbGxiYWNrIERvZXMgdGhlIGxpZ2h0IHBhc3MgdGhyb3VnaCB4LHk/XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5PThdIDQvNi84XHJcbiAqL1xyXG5ST1QuRk9WID0gZnVuY3Rpb24obGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdHRoaXMuX2xpZ2h0UGFzc2VzID0gbGlnaHRQYXNzZXNDYWxsYmFjaztcclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0dG9wb2xvZ3k6IDhcclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSAzNjAtZGVncmVlIGNpcmNsZVxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5ST1QuRk9WLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHt9O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhbGwgbmVpZ2hib3JzIGluIGEgY29uY2VudHJpYyByaW5nXHJcbiAqIEBwYXJhbSB7aW50fSBjeCBjZW50ZXIteFxyXG4gKiBAcGFyYW0ge2ludH0gY3kgY2VudGVyLXlcclxuICogQHBhcmFtIHtpbnR9IHIgcmFuZ2VcclxuICovXHJcblJPVC5GT1YucHJvdG90eXBlLl9nZXRDaXJjbGUgPSBmdW5jdGlvbihjeCwgY3ksIHIpIHtcclxuXHR2YXIgcmVzdWx0ID0gW107XHJcblx0dmFyIGRpcnMsIGNvdW50RmFjdG9yLCBzdGFydE9mZnNldDtcclxuXHJcblx0c3dpdGNoICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5KSB7XHJcblx0XHRjYXNlIDQ6XHJcblx0XHRcdGNvdW50RmFjdG9yID0gMTtcclxuXHRcdFx0c3RhcnRPZmZzZXQgPSBbMCwgMV07XHJcblx0XHRcdGRpcnMgPSBbXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bN10sXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bMV0sXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bM10sXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bNV1cclxuXHRcdFx0XTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgNjpcclxuXHRcdFx0ZGlycyA9IFJPVC5ESVJTWzZdO1xyXG5cdFx0XHRjb3VudEZhY3RvciA9IDE7XHJcblx0XHRcdHN0YXJ0T2Zmc2V0ID0gWy0xLCAxXTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgODpcclxuXHRcdFx0ZGlycyA9IFJPVC5ESVJTWzRdO1xyXG5cdFx0XHRjb3VudEZhY3RvciA9IDI7XHJcblx0XHRcdHN0YXJ0T2Zmc2V0ID0gWy0xLCAxXTtcclxuXHRcdGJyZWFrO1xyXG5cdH1cclxuXHJcblx0Lyogc3RhcnRpbmcgbmVpZ2hib3IgKi9cclxuXHR2YXIgeCA9IGN4ICsgc3RhcnRPZmZzZXRbMF0qcjtcclxuXHR2YXIgeSA9IGN5ICsgc3RhcnRPZmZzZXRbMV0qcjtcclxuXHJcblx0LyogY2lyY2xlICovXHJcblx0Zm9yICh2YXIgaT0wO2k8ZGlycy5sZW5ndGg7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajxyKmNvdW50RmFjdG9yO2orKykge1xyXG5cdFx0XHRyZXN1bHQucHVzaChbeCwgeV0pO1xyXG5cdFx0XHR4ICs9IGRpcnNbaV1bMF07XHJcblx0XHRcdHkgKz0gZGlyc1tpXVsxXTtcclxuXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIERpc2NyZXRlIHNoYWRvd2Nhc3RpbmcgYWxnb3JpdGhtLiBPYnNvbGV0ZWQgYnkgUHJlY2lzZSBzaGFkb3djYXN0aW5nLlxyXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxyXG4gKi9cclxuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0Uk9ULkZPVi5jYWxsKHRoaXMsIGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG59O1xyXG5ST1QuRk9WLkRpc2NyZXRlU2hhZG93Y2FzdGluZy5leHRlbmQoUk9ULkZPVik7XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuRk9WI2NvbXB1dGVcclxuICovXHJcblJPVC5GT1YuRGlzY3JldGVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHtcclxuXHR2YXIgY2VudGVyID0gdGhpcy5fY29vcmRzO1xyXG5cdHZhciBtYXAgPSB0aGlzLl9tYXA7XHJcblxyXG5cdC8qIHRoaXMgcGxhY2UgaXMgYWx3YXlzIHZpc2libGUgKi9cclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHJcblx0Lyogc3RhbmRpbmcgaW4gYSBkYXJrIHBsYWNlLiBGSVhNRSBpcyB0aGlzIGEgZ29vZCBpZGVhPyAgKi9cclxuXHRpZiAoIXRoaXMuX2xpZ2h0UGFzc2VzKHgsIHkpKSB7IHJldHVybjsgfVxyXG5cdFxyXG5cdC8qIHN0YXJ0IGFuZCBlbmQgYW5nbGVzICovXHJcblx0dmFyIERBVEEgPSBbXTtcclxuXHRcclxuXHR2YXIgQSwgQiwgY3gsIGN5LCBibG9ja3M7XHJcblxyXG5cdC8qIGFuYWx5emUgc3Vycm91bmRpbmcgY2VsbHMgaW4gY29uY2VudHJpYyByaW5ncywgc3RhcnRpbmcgZnJvbSB0aGUgY2VudGVyICovXHJcblx0Zm9yICh2YXIgcj0xOyByPD1SOyByKyspIHtcclxuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXRDaXJjbGUoeCwgeSwgcik7XHJcblx0XHR2YXIgYW5nbGUgPSAzNjAgLyBuZWlnaGJvcnMubGVuZ3RoO1xyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPG5laWdoYm9ycy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdGN4ID0gbmVpZ2hib3JzW2ldWzBdO1xyXG5cdFx0XHRjeSA9IG5laWdoYm9yc1tpXVsxXTtcclxuXHRcdFx0QSA9IGFuZ2xlICogKGkgLSAwLjUpO1xyXG5cdFx0XHRCID0gQSArIGFuZ2xlO1xyXG5cdFx0XHRcclxuXHRcdFx0YmxvY2tzID0gIXRoaXMuX2xpZ2h0UGFzc2VzKGN4LCBjeSk7XHJcblx0XHRcdGlmICh0aGlzLl92aXNpYmxlQ29vcmRzKE1hdGguZmxvb3IoQSksIE1hdGguY2VpbChCKSwgYmxvY2tzLCBEQVRBKSkgeyBjYWxsYmFjayhjeCwgY3ksIHIsIDEpOyB9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoREFUQS5sZW5ndGggPT0gMiAmJiBEQVRBWzBdID09IDAgJiYgREFUQVsxXSA9PSAzNjApIHsgcmV0dXJuOyB9IC8qIGN1dG9mZj8gKi9cclxuXHJcblx0XHR9IC8qIGZvciBhbGwgY2VsbHMgaW4gdGhpcyByaW5nICovXHJcblx0fSAvKiBmb3IgYWxsIHJpbmdzICovXHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtpbnR9IEEgc3RhcnQgYW5nbGVcclxuICogQHBhcmFtIHtpbnR9IEIgZW5kIGFuZ2xlXHJcbiAqIEBwYXJhbSB7Ym9vbH0gYmxvY2tzIERvZXMgY3VycmVudCBjZWxsIGJsb2NrIHZpc2liaWxpdHk/XHJcbiAqIEBwYXJhbSB7aW50W11bXX0gREFUQSBzaGFkb3dlZCBhbmdsZSBwYWlyc1xyXG4gKi9cclxuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl92aXNpYmxlQ29vcmRzID0gZnVuY3Rpb24oQSwgQiwgYmxvY2tzLCBEQVRBKSB7XHJcblx0aWYgKEEgPCAwKSB7IFxyXG5cdFx0dmFyIHYxID0gYXJndW1lbnRzLmNhbGxlZSgwLCBCLCBibG9ja3MsIERBVEEpO1xyXG5cdFx0dmFyIHYyID0gYXJndW1lbnRzLmNhbGxlZSgzNjArQSwgMzYwLCBibG9ja3MsIERBVEEpO1xyXG5cdFx0cmV0dXJuIHYxIHx8IHYyO1xyXG5cdH1cclxuXHRcclxuXHR2YXIgaW5kZXggPSAwO1xyXG5cdHdoaWxlIChpbmRleCA8IERBVEEubGVuZ3RoICYmIERBVEFbaW5kZXhdIDwgQSkgeyBpbmRleCsrOyB9XHJcblx0XHJcblx0aWYgKGluZGV4ID09IERBVEEubGVuZ3RoKSB7IC8qIGNvbXBsZXRlbHkgbmV3IHNoYWRvdyAqL1xyXG5cdFx0aWYgKGJsb2NrcykgeyBEQVRBLnB1c2goQSwgQik7IH0gXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0dmFyIGNvdW50ID0gMDtcclxuXHRcclxuXHRpZiAoaW5kZXggJSAyKSB7IC8qIHRoaXMgc2hhZG93IHN0YXJ0cyBpbiBhbiBleGlzdGluZyBzaGFkb3csIG9yIHdpdGhpbiBpdHMgZW5kaW5nIGJvdW5kYXJ5ICovXHJcblx0XHR3aGlsZSAoaW5kZXggPCBEQVRBLmxlbmd0aCAmJiBEQVRBW2luZGV4XSA8IEIpIHtcclxuXHRcdFx0aW5kZXgrKztcclxuXHRcdFx0Y291bnQrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKGNvdW50ID09IDApIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcclxuXHRcdGlmIChibG9ja3MpIHsgXHJcblx0XHRcdGlmIChjb3VudCAlIDIpIHtcclxuXHRcdFx0XHREQVRBLnNwbGljZShpbmRleC1jb3VudCwgY291bnQsIEIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblxyXG5cdH0gZWxzZSB7IC8qIHRoaXMgc2hhZG93IHN0YXJ0cyBvdXRzaWRlIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2l0aGluIGEgc3RhcnRpbmcgYm91bmRhcnkgKi9cclxuXHRcdHdoaWxlIChpbmRleCA8IERBVEEubGVuZ3RoICYmIERBVEFbaW5kZXhdIDwgQikge1xyXG5cdFx0XHRpbmRleCsrO1xyXG5cdFx0XHRjb3VudCsrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKiB2aXNpYmxlIHdoZW4gb3V0c2lkZSBhbiBleGlzdGluZyBzaGFkb3csIG9yIHdoZW4gb3ZlcmxhcHBpbmcgKi9cclxuXHRcdGlmIChBID09IERBVEFbaW5kZXgtY291bnRdICYmIGNvdW50ID09IDEpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcclxuXHRcdGlmIChibG9ja3MpIHsgXHJcblx0XHRcdGlmIChjb3VudCAlIDIpIHtcclxuXHRcdFx0XHREQVRBLnNwbGljZShpbmRleC1jb3VudCwgY291bnQsIEEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCwgQSwgQik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFx0XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJlY2lzZSBzaGFkb3djYXN0aW5nIGFsZ29yaXRobVxyXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxyXG4gKi9cclxuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZyA9IGZ1bmN0aW9uKGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHRST1QuRk9WLmNhbGwodGhpcywgbGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucyk7XHJcbn07XHJcblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcuZXh0ZW5kKFJPVC5GT1YpO1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULkZPViNjb21wdXRlXHJcbiAqL1xyXG5ST1QuRk9WLlByZWNpc2VTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHtcclxuXHQvKiB0aGlzIHBsYWNlIGlzIGFsd2F5cyB2aXNpYmxlICovXHJcblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XHJcblxyXG5cdC8qIHN0YW5kaW5nIGluIGEgZGFyayBwbGFjZS4gRklYTUUgaXMgdGhpcyBhIGdvb2QgaWRlYT8gICovXHJcblx0aWYgKCF0aGlzLl9saWdodFBhc3Nlcyh4LCB5KSkgeyByZXR1cm47IH1cclxuXHRcclxuXHQvKiBsaXN0IG9mIGFsbCBzaGFkb3dzICovXHJcblx0dmFyIFNIQURPV1MgPSBbXTtcclxuXHRcclxuXHR2YXIgY3gsIGN5LCBibG9ja3MsIEExLCBBMiwgdmlzaWJpbGl0eTtcclxuXHJcblx0LyogYW5hbHl6ZSBzdXJyb3VuZGluZyBjZWxscyBpbiBjb25jZW50cmljIHJpbmdzLCBzdGFydGluZyBmcm9tIHRoZSBjZW50ZXIgKi9cclxuXHRmb3IgKHZhciByPTE7IHI8PVI7IHIrKykge1xyXG5cdFx0dmFyIG5laWdoYm9ycyA9IHRoaXMuX2dldENpcmNsZSh4LCB5LCByKTtcclxuXHRcdHZhciBuZWlnaGJvckNvdW50ID0gbmVpZ2hib3JzLmxlbmd0aDtcclxuXHJcblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvckNvdW50O2krKykge1xyXG5cdFx0XHRjeCA9IG5laWdoYm9yc1tpXVswXTtcclxuXHRcdFx0Y3kgPSBuZWlnaGJvcnNbaV1bMV07XHJcblx0XHRcdC8qIHNoaWZ0IGhhbGYtYW4tYW5nbGUgYmFja3dhcmRzIHRvIG1haW50YWluIGNvbnNpc3RlbmN5IG9mIDAtdGggY2VsbHMgKi9cclxuXHRcdFx0QTEgPSBbaSA/IDIqaS0xIDogMipuZWlnaGJvckNvdW50LTEsIDIqbmVpZ2hib3JDb3VudF07XHJcblx0XHRcdEEyID0gWzIqaSsxLCAyKm5laWdoYm9yQ291bnRdOyBcclxuXHRcdFx0XHJcblx0XHRcdGJsb2NrcyA9ICF0aGlzLl9saWdodFBhc3NlcyhjeCwgY3kpO1xyXG5cdFx0XHR2aXNpYmlsaXR5ID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KEExLCBBMiwgYmxvY2tzLCBTSEFET1dTKTtcclxuXHRcdFx0aWYgKHZpc2liaWxpdHkpIHsgY2FsbGJhY2soY3gsIGN5LCByLCB2aXNpYmlsaXR5KTsgfVxyXG5cclxuXHRcdFx0aWYgKFNIQURPV1MubGVuZ3RoID09IDIgJiYgU0hBRE9XU1swXVswXSA9PSAwICYmIFNIQURPV1NbMV1bMF0gPT0gU0hBRE9XU1sxXVsxXSkgeyByZXR1cm47IH0gLyogY3V0b2ZmPyAqL1xyXG5cclxuXHRcdH0gLyogZm9yIGFsbCBjZWxscyBpbiB0aGlzIHJpbmcgKi9cclxuXHR9IC8qIGZvciBhbGwgcmluZ3MgKi9cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2ludFsyXX0gQTEgYXJjIHN0YXJ0XHJcbiAqIEBwYXJhbSB7aW50WzJdfSBBMiBhcmMgZW5kXHJcbiAqIEBwYXJhbSB7Ym9vbH0gYmxvY2tzIERvZXMgY3VycmVudCBhcmMgYmxvY2sgdmlzaWJpbGl0eT9cclxuICogQHBhcmFtIHtpbnRbXVtdfSBTSEFET1dTIGxpc3Qgb2YgYWN0aXZlIHNoYWRvd3NcclxuICovXHJcblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl9jaGVja1Zpc2liaWxpdHkgPSBmdW5jdGlvbihBMSwgQTIsIGJsb2NrcywgU0hBRE9XUykge1xyXG5cdGlmIChBMVswXSA+IEEyWzBdKSB7IC8qIHNwbGl0IGludG8gdHdvIHN1Yi1hcmNzICovXHJcblx0XHR2YXIgdjEgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoQTEsIFtBMVsxXSwgQTFbMV1dLCBibG9ja3MsIFNIQURPV1MpO1xyXG5cdFx0dmFyIHYyID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KFswLCAxXSwgQTIsIGJsb2NrcywgU0hBRE9XUyk7XHJcblx0XHRyZXR1cm4gKHYxK3YyKS8yO1xyXG5cdH1cclxuXHJcblx0LyogaW5kZXgxOiBmaXJzdCBzaGFkb3cgPj0gQTEgKi9cclxuXHR2YXIgaW5kZXgxID0gMCwgZWRnZTEgPSBmYWxzZTtcclxuXHR3aGlsZSAoaW5kZXgxIDwgU0hBRE9XUy5sZW5ndGgpIHtcclxuXHRcdHZhciBvbGQgPSBTSEFET1dTW2luZGV4MV07XHJcblx0XHR2YXIgZGlmZiA9IG9sZFswXSpBMVsxXSAtIEExWzBdKm9sZFsxXTtcclxuXHRcdGlmIChkaWZmID49IDApIHsgLyogb2xkID49IEExICovXHJcblx0XHRcdGlmIChkaWZmID09IDAgJiYgIShpbmRleDEgJSAyKSkgeyBlZGdlMSA9IHRydWU7IH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHRpbmRleDErKztcclxuXHR9XHJcblxyXG5cdC8qIGluZGV4MjogbGFzdCBzaGFkb3cgPD0gQTIgKi9cclxuXHR2YXIgaW5kZXgyID0gU0hBRE9XUy5sZW5ndGgsIGVkZ2UyID0gZmFsc2U7XHJcblx0d2hpbGUgKGluZGV4Mi0tKSB7XHJcblx0XHR2YXIgb2xkID0gU0hBRE9XU1tpbmRleDJdO1xyXG5cdFx0dmFyIGRpZmYgPSBBMlswXSpvbGRbMV0gLSBvbGRbMF0qQTJbMV07XHJcblx0XHRpZiAoZGlmZiA+PSAwKSB7IC8qIG9sZCA8PSBBMiAqL1xyXG5cdFx0XHRpZiAoZGlmZiA9PSAwICYmIChpbmRleDIgJSAyKSkgeyBlZGdlMiA9IHRydWU7IH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgdmlzaWJsZSA9IHRydWU7XHJcblx0aWYgKGluZGV4MSA9PSBpbmRleDIgJiYgKGVkZ2UxIHx8IGVkZ2UyKSkgeyAgLyogc3Vic2V0IG9mIGV4aXN0aW5nIHNoYWRvdywgb25lIG9mIHRoZSBlZGdlcyBtYXRjaCAqL1xyXG5cdFx0dmlzaWJsZSA9IGZhbHNlOyBcclxuXHR9IGVsc2UgaWYgKGVkZ2UxICYmIGVkZ2UyICYmIGluZGV4MSsxPT1pbmRleDIgJiYgKGluZGV4MiAlIDIpKSB7IC8qIGNvbXBsZXRlbHkgZXF1aXZhbGVudCB3aXRoIGV4aXN0aW5nIHNoYWRvdyAqL1xyXG5cdFx0dmlzaWJsZSA9IGZhbHNlO1xyXG5cdH0gZWxzZSBpZiAoaW5kZXgxID4gaW5kZXgyICYmIChpbmRleDEgJSAyKSkgeyAvKiBzdWJzZXQgb2YgZXhpc3Rpbmcgc2hhZG93LCBub3QgdG91Y2hpbmcgKi9cclxuXHRcdHZpc2libGUgPSBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0aWYgKCF2aXNpYmxlKSB7IHJldHVybiAwOyB9IC8qIGZhc3QgY2FzZTogbm90IHZpc2libGUgKi9cclxuXHRcclxuXHR2YXIgdmlzaWJsZUxlbmd0aCwgUDtcclxuXHJcblx0LyogY29tcHV0ZSB0aGUgbGVuZ3RoIG9mIHZpc2libGUgYXJjLCBhZGp1c3QgbGlzdCBvZiBzaGFkb3dzIChpZiBibG9ja2luZykgKi9cclxuXHR2YXIgcmVtb3ZlID0gaW5kZXgyLWluZGV4MSsxO1xyXG5cdGlmIChyZW1vdmUgJSAyKSB7XHJcblx0XHRpZiAoaW5kZXgxICUgMikgeyAvKiBmaXJzdCBlZGdlIHdpdGhpbiBleGlzdGluZyBzaGFkb3csIHNlY29uZCBvdXRzaWRlICovXHJcblx0XHRcdHZhciBQID0gU0hBRE9XU1tpbmRleDFdO1xyXG5cdFx0XHR2aXNpYmxlTGVuZ3RoID0gKEEyWzBdKlBbMV0gLSBQWzBdKkEyWzFdKSAvIChQWzFdICogQTJbMV0pO1xyXG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMik7IH1cclxuXHRcdH0gZWxzZSB7IC8qIHNlY29uZCBlZGdlIHdpdGhpbiBleGlzdGluZyBzaGFkb3csIGZpcnN0IG91dHNpZGUgKi9cclxuXHRcdFx0dmFyIFAgPSBTSEFET1dTW2luZGV4Ml07XHJcblx0XHRcdHZpc2libGVMZW5ndGggPSAoUFswXSpBMVsxXSAtIEExWzBdKlBbMV0pIC8gKEExWzFdICogUFsxXSk7XHJcblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUsIEExKTsgfVxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHRpZiAoaW5kZXgxICUgMikgeyAvKiBib3RoIGVkZ2VzIHdpdGhpbiBleGlzdGluZyBzaGFkb3dzICovXHJcblx0XHRcdHZhciBQMSA9IFNIQURPV1NbaW5kZXgxXTtcclxuXHRcdFx0dmFyIFAyID0gU0hBRE9XU1tpbmRleDJdO1xyXG5cdFx0XHR2aXNpYmxlTGVuZ3RoID0gKFAyWzBdKlAxWzFdIC0gUDFbMF0qUDJbMV0pIC8gKFAxWzFdICogUDJbMV0pO1xyXG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlKTsgfVxyXG5cdFx0fSBlbHNlIHsgLyogYm90aCBlZGdlcyBvdXRzaWRlIGV4aXN0aW5nIHNoYWRvd3MgKi9cclxuXHRcdFx0aWYgKGJsb2NrcykgeyBTSEFET1dTLnNwbGljZShpbmRleDEsIHJlbW92ZSwgQTEsIEEyKTsgfVxyXG5cdFx0XHRyZXR1cm4gMTsgLyogd2hvbGUgYXJjIHZpc2libGUhICovXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgYXJjTGVuZ3RoID0gKEEyWzBdKkExWzFdIC0gQTFbMF0qQTJbMV0pIC8gKEExWzFdICogQTJbMV0pO1xyXG5cclxuXHRyZXR1cm4gdmlzaWJsZUxlbmd0aC9hcmNMZW5ndGg7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUmVjdXJzaXZlIHNoYWRvd2Nhc3RpbmcgYWxnb3JpdGhtXHJcbiAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIDQvOCB0b3BvbG9naWVzLCBub3QgaGV4YWdvbmFsLlxyXG4gKiBCYXNlZCBvbiBQZXRlciBIYXJraW5zJyBpbXBsZW1lbnRhdGlvbiBvZiBCasO2cm4gQmVyZ3N0csO2bSdzIGFsZ29yaXRobSBkZXNjcmliZWQgaGVyZTogaHR0cDovL3d3dy5yb2d1ZWJhc2luLmNvbS9pbmRleC5waHA/dGl0bGU9Rk9WX3VzaW5nX3JlY3Vyc2l2ZV9zaGFkb3djYXN0aW5nXHJcbiAqIEBhdWdtZW50cyBST1QuRk9WXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0Uk9ULkZPVi5jYWxsKHRoaXMsIGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG59O1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuZXh0ZW5kKFJPVC5GT1YpO1xyXG5cclxuLyoqIE9jdGFudHMgdXNlZCBmb3IgdHJhbnNsYXRpbmcgcmVjdXJzaXZlIHNoYWRvd2Nhc3Rpbmcgb2Zmc2V0cyAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UUyA9IFtcclxuXHRbLTEsICAwLCAgMCwgIDFdLFxyXG5cdFsgMCwgLTEsICAxLCAgMF0sXHJcblx0WyAwLCAtMSwgLTEsICAwXSxcclxuXHRbLTEsICAwLCAgMCwgLTFdLFxyXG5cdFsgMSwgIDAsICAwLCAtMV0sXHJcblx0WyAwLCAgMSwgLTEsICAwXSxcclxuXHRbIDAsICAxLCAgMSwgIDBdLFxyXG5cdFsgMSwgIDAsICAwLCAgMV1cclxuXTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgMzYwLWRlZ3JlZSBjaXJjbGVcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHtcclxuXHQvL1lvdSBjYW4gYWx3YXlzIHNlZSB5b3VyIG93biB0aWxlXHJcblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbaV0sIFIsIGNhbGxiYWNrKTtcclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDE4MC1kZWdyZWUgYXJjXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcclxuICogQHBhcmFtIHtpbnR9IGRpciBEaXJlY3Rpb24gdG8gbG9vayBpbiAoZXhwcmVzc2VkIGluIGEgUk9ULkRJUlMgdmFsdWUpO1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlMTgwID0gZnVuY3Rpb24oeCwgeSwgUiwgZGlyLCBjYWxsYmFjaykge1xyXG5cdC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHR2YXIgcHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMSArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyBvY3RhbnQgdG8gcmVuZGVyIGEgZnVsbCAxODAgZGVncmVlc1xyXG5cdHZhciBuZXh0UHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMiArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyB0d28gb2N0YW50cyB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXHJcblx0dmFyIG5leHRPY3RhbnQgPSAoZGlyKyAxICsgOCkgJSA4OyAvL05lZWQgdG8gZ3JhYiB0byBuZXh0IG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW25leHRQcmV2aW91c09jdGFudF0sIFIsIGNhbGxiYWNrKTtcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbcHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW2Rpcl0sIFIsIGNhbGxiYWNrKTtcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbbmV4dE9jdGFudF0sIFIsIGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgOTAtZGVncmVlIGFyY1xyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7aW50fSBkaXIgRGlyZWN0aW9uIHRvIGxvb2sgaW4gKGV4cHJlc3NlZCBpbiBhIFJPVC5ESVJTIHZhbHVlKTtcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuY29tcHV0ZTkwID0gZnVuY3Rpb24oeCwgeSwgUiwgZGlyLCBjYWxsYmFjaykge1xyXG5cdC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHR2YXIgcHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMSArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyBvY3RhbnQgdG8gcmVuZGVyIGEgZnVsbCA5MCBkZWdyZWVzXHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW2Rpcl0sIFIsIGNhbGxiYWNrKTtcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbcHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVuZGVyIG9uZSBvY3RhbnQgKDQ1LWRlZ3JlZSBhcmMpIG9mIHRoZSB2aWV3c2hlZFxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gb2N0YW50IE9jdGFudCB0byBiZSByZW5kZXJlZFxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl9yZW5kZXJPY3RhbnQgPSBmdW5jdGlvbih4LCB5LCBvY3RhbnQsIFIsIGNhbGxiYWNrKSB7XHJcblx0Ly9SYWRpdXMgaW5jcmVtZW50ZWQgYnkgMSB0byBwcm92aWRlIHNhbWUgY292ZXJhZ2UgYXJlYSBhcyBvdGhlciBzaGFkb3djYXN0aW5nIHJhZGl1c2VzXHJcblx0dGhpcy5fY2FzdFZpc2liaWxpdHkoeCwgeSwgMSwgMS4wLCAwLjAsIFIgKyAxLCBvY3RhbnRbMF0sIG9jdGFudFsxXSwgb2N0YW50WzJdLCBvY3RhbnRbM10sIGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBY3R1YWxseSBjYWxjdWxhdGVzIHRoZSB2aXNpYmlsaXR5XHJcbiAqIEBwYXJhbSB7aW50fSBzdGFydFggVGhlIHN0YXJ0aW5nIFggY29vcmRpbmF0ZVxyXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRZIFRoZSBzdGFydGluZyBZIGNvb3JkaW5hdGVcclxuICogQHBhcmFtIHtpbnR9IHJvdyBUaGUgcm93IHRvIHJlbmRlclxyXG4gKiBAcGFyYW0ge2Zsb2F0fSB2aXNTbG9wZVN0YXJ0IFRoZSBzbG9wZSB0byBzdGFydCBhdFxyXG4gKiBAcGFyYW0ge2Zsb2F0fSB2aXNTbG9wZUVuZCBUaGUgc2xvcGUgdG8gZW5kIGF0XHJcbiAqIEBwYXJhbSB7aW50fSByYWRpdXMgVGhlIHJhZGl1cyB0byByZWFjaCBvdXQgdG9cclxuICogQHBhcmFtIHtpbnR9IHh4IFxyXG4gKiBAcGFyYW0ge2ludH0geHkgXHJcbiAqIEBwYXJhbSB7aW50fSB5eCBcclxuICogQHBhcmFtIHtpbnR9IHl5IFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gdXNlIHdoZW4gd2UgaGl0IGEgYmxvY2sgdGhhdCBpcyB2aXNpYmxlXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl9jYXN0VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKHN0YXJ0WCwgc3RhcnRZLCByb3csIHZpc1Nsb3BlU3RhcnQsIHZpc1Nsb3BlRW5kLCByYWRpdXMsIHh4LCB4eSwgeXgsIHl5LCBjYWxsYmFjaykge1xyXG5cdGlmKHZpc1Nsb3BlU3RhcnQgPCB2aXNTbG9wZUVuZCkgeyByZXR1cm47IH1cclxuXHRmb3IodmFyIGkgPSByb3c7IGkgPD0gcmFkaXVzOyBpKyspIHtcclxuXHRcdHZhciBkeCA9IC1pIC0gMTtcclxuXHRcdHZhciBkeSA9IC1pO1xyXG5cdFx0dmFyIGJsb2NrZWQgPSBmYWxzZTtcclxuXHRcdHZhciBuZXdTdGFydCA9IDA7XHJcblxyXG5cdFx0Ly8nUm93JyBjb3VsZCBiZSBjb2x1bW4sIG5hbWVzIGhlcmUgYXNzdW1lIG9jdGFudCAwIGFuZCB3b3VsZCBiZSBmbGlwcGVkIGZvciBoYWxmIHRoZSBvY3RhbnRzXHJcblx0XHR3aGlsZShkeCA8PSAwKSB7XHJcblx0XHRcdGR4ICs9IDE7XHJcblxyXG5cdFx0XHQvL1RyYW5zbGF0ZSBmcm9tIHJlbGF0aXZlIGNvb3JkaW5hdGVzIHRvIG1hcCBjb29yZGluYXRlc1xyXG5cdFx0XHR2YXIgbWFwWCA9IHN0YXJ0WCArIGR4ICogeHggKyBkeSAqIHh5O1xyXG5cdFx0XHR2YXIgbWFwWSA9IHN0YXJ0WSArIGR4ICogeXggKyBkeSAqIHl5O1xyXG5cclxuXHRcdFx0Ly9SYW5nZSBvZiB0aGUgcm93XHJcblx0XHRcdHZhciBzbG9wZVN0YXJ0ID0gKGR4IC0gMC41KSAvIChkeSArIDAuNSk7XHJcblx0XHRcdHZhciBzbG9wZUVuZCA9IChkeCArIDAuNSkgLyAoZHkgLSAwLjUpO1xyXG5cdFx0XHJcblx0XHRcdC8vSWdub3JlIGlmIG5vdCB5ZXQgYXQgbGVmdCBlZGdlIG9mIE9jdGFudFxyXG5cdFx0XHRpZihzbG9wZUVuZCA+IHZpc1Nsb3BlU3RhcnQpIHsgY29udGludWU7IH1cclxuXHRcdFx0XHJcblx0XHRcdC8vRG9uZSBpZiBwYXN0IHJpZ2h0IGVkZ2VcclxuXHRcdFx0aWYoc2xvcGVTdGFydCA8IHZpc1Nsb3BlRW5kKSB7IGJyZWFrOyB9XHJcblx0XHRcdFx0XHJcblx0XHRcdC8vSWYgaXQncyBpbiByYW5nZSwgaXQncyB2aXNpYmxlXHJcblx0XHRcdGlmKChkeCAqIGR4ICsgZHkgKiBkeSkgPCAocmFkaXVzICogcmFkaXVzKSkge1xyXG5cdFx0XHRcdGNhbGxiYWNrKG1hcFgsIG1hcFksIGksIDEpO1xyXG5cdFx0XHR9XHJcblx0XHJcblx0XHRcdGlmKCFibG9ja2VkKSB7XHJcblx0XHRcdFx0Ly9JZiB0aWxlIGlzIGEgYmxvY2tpbmcgdGlsZSwgY2FzdCBhcm91bmQgaXRcclxuXHRcdFx0XHRpZighdGhpcy5fbGlnaHRQYXNzZXMobWFwWCwgbWFwWSkgJiYgaSA8IHJhZGl1cykge1xyXG5cdFx0XHRcdFx0YmxvY2tlZCA9IHRydWU7XHJcblx0XHRcdFx0XHR0aGlzLl9jYXN0VmlzaWJpbGl0eShzdGFydFgsIHN0YXJ0WSwgaSArIDEsIHZpc1Nsb3BlU3RhcnQsIHNsb3BlU3RhcnQsIHJhZGl1cywgeHgsIHh5LCB5eCwgeXksIGNhbGxiYWNrKTtcclxuXHRcdFx0XHRcdG5ld1N0YXJ0ID0gc2xvcGVFbmQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vS2VlcCBuYXJyb3dpbmcgaWYgc2Nhbm5pbmcgYWNyb3NzIGEgYmxvY2tcclxuXHRcdFx0XHRpZighdGhpcy5fbGlnaHRQYXNzZXMobWFwWCwgbWFwWSkpIHtcclxuXHRcdFx0XHRcdG5ld1N0YXJ0ID0gc2xvcGVFbmQ7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRcdC8vQmxvY2sgaGFzIGVuZGVkXHJcblx0XHRcdFx0YmxvY2tlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHZpc1Nsb3BlU3RhcnQgPSBuZXdTdGFydDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYoYmxvY2tlZCkgeyBicmVhazsgfVxyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBuYW1lc3BhY2UgQ29sb3Igb3BlcmF0aW9uc1xyXG4gKi9cclxuUk9ULkNvbG9yID0ge1xyXG5cdGZyb21TdHJpbmc6IGZ1bmN0aW9uKHN0cikge1xyXG5cdFx0dmFyIGNhY2hlZCwgcjtcclxuXHRcdGlmIChzdHIgaW4gdGhpcy5fY2FjaGUpIHtcclxuXHRcdFx0Y2FjaGVkID0gdGhpcy5fY2FjaGVbc3RyXTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmIChzdHIuY2hhckF0KDApID09IFwiI1wiKSB7IC8qIGhleCByZ2IgKi9cclxuXHJcblx0XHRcdFx0dmFyIHZhbHVlcyA9IHN0ci5tYXRjaCgvWzAtOWEtZl0vZ2kpLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiBwYXJzZUludCh4LCAxNik7IH0pO1xyXG5cdFx0XHRcdGlmICh2YWx1ZXMubGVuZ3RoID09IDMpIHtcclxuXHRcdFx0XHRcdGNhY2hlZCA9IHZhbHVlcy5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4geCoxNzsgfSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhbHVlc1tpKzFdICs9IDE2KnZhbHVlc1tpXTtcclxuXHRcdFx0XHRcdFx0dmFsdWVzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNhY2hlZCA9IHZhbHVlcztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKChyID0gc3RyLm1hdGNoKC9yZ2JcXCgoWzAtOSwgXSspXFwpL2kpKSkgeyAvKiBkZWNpbWFsIHJnYiAqL1xyXG5cdFx0XHRcdGNhY2hlZCA9IHJbMV0uc3BsaXQoL1xccyosXFxzKi8pLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiBwYXJzZUludCh4KTsgfSk7XHJcblx0XHRcdH0gZWxzZSB7IC8qIGh0bWwgbmFtZSAqL1xyXG5cdFx0XHRcdGNhY2hlZCA9IFswLCAwLCAwXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5fY2FjaGVbc3RyXSA9IGNhY2hlZDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY2FjaGVkLnNsaWNlKCk7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQWRkIHR3byBvciBtb3JlIGNvbG9yc1xyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRhZGQ6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gY29sb3IxLnNsaWNlKCk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRmb3IgKHZhciBqPTE7ajxhcmd1bWVudHMubGVuZ3RoO2orKykge1xyXG5cdFx0XHRcdHJlc3VsdFtpXSArPSBhcmd1bWVudHNbal1baV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQWRkIHR3byBvciBtb3JlIGNvbG9ycywgTU9ESUZJRVMgRklSU1QgQVJHVU1FTlRcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0YWRkXzogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0Y29sb3IxW2ldICs9IGFyZ3VtZW50c1tqXVtpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvbG9yMTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBNdWx0aXBseSAobWl4KSB0d28gb3IgbW9yZSBjb2xvcnNcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0bXVsdGlwbHk6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gY29sb3IxLnNsaWNlKCk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRmb3IgKHZhciBqPTE7ajxhcmd1bWVudHMubGVuZ3RoO2orKykge1xyXG5cdFx0XHRcdHJlc3VsdFtpXSAqPSBhcmd1bWVudHNbal1baV0gLyAyNTU7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVzdWx0W2ldID0gTWF0aC5yb3VuZChyZXN1bHRbaV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBNdWx0aXBseSAobWl4KSB0d28gb3IgbW9yZSBjb2xvcnMsIE1PRElGSUVTIEZJUlNUIEFSR1VNRU5UXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdG11bHRpcGx5XzogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0Y29sb3IxW2ldICo9IGFyZ3VtZW50c1tqXVtpXSAvIDI1NTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb2xvcjFbaV0gPSBNYXRoLnJvdW5kKGNvbG9yMVtpXSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29sb3IxO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEludGVycG9sYXRlIChibGVuZCkgdHdvIGNvbG9ycyB3aXRoIGEgZ2l2ZW4gZmFjdG9yXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHBhcmFtIHtmbG9hdH0gW2ZhY3Rvcj0wLjVdIDAuLjFcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0aW50ZXJwb2xhdGU6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCBmYWN0b3IpIHtcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgeyBmYWN0b3IgPSAwLjU7IH1cclxuXHRcdHZhciByZXN1bHQgPSBjb2xvcjEuc2xpY2UoKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdHJlc3VsdFtpXSA9IE1hdGgucm91bmQocmVzdWx0W2ldICsgZmFjdG9yKihjb2xvcjJbaV0tY29sb3IxW2ldKSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEludGVycG9sYXRlIChibGVuZCkgdHdvIGNvbG9ycyB3aXRoIGEgZ2l2ZW4gZmFjdG9yIGluIEhTTCBtb2RlXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHBhcmFtIHtmbG9hdH0gW2ZhY3Rvcj0wLjVdIDAuLjFcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0aW50ZXJwb2xhdGVIU0w6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCBmYWN0b3IpIHtcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgeyBmYWN0b3IgPSAwLjU7IH1cclxuXHRcdHZhciBoc2wxID0gdGhpcy5yZ2IyaHNsKGNvbG9yMSk7XHJcblx0XHR2YXIgaHNsMiA9IHRoaXMucmdiMmhzbChjb2xvcjIpO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0aHNsMVtpXSArPSBmYWN0b3IqKGhzbDJbaV0taHNsMVtpXSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcy5oc2wycmdiKGhzbDEpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZSBhIG5ldyByYW5kb20gY29sb3IgYmFzZWQgb24gdGhpcyBvbmVcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGRpZmYgU2V0IG9mIHN0YW5kYXJkIGRldmlhdGlvbnNcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0cmFuZG9taXplOiBmdW5jdGlvbihjb2xvciwgZGlmZikge1xyXG5cdFx0aWYgKCEoZGlmZiBpbnN0YW5jZW9mIEFycmF5KSkgeyBkaWZmID0gTWF0aC5yb3VuZChST1QuUk5HLmdldE5vcm1hbCgwLCBkaWZmKSk7IH1cclxuXHRcdHZhciByZXN1bHQgPSBjb2xvci5zbGljZSgpO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0cmVzdWx0W2ldICs9IChkaWZmIGluc3RhbmNlb2YgQXJyYXkgPyBNYXRoLnJvdW5kKFJPVC5STkcuZ2V0Tm9ybWFsKDAsIGRpZmZbaV0pKSA6IGRpZmYpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0cyBhbiBSR0IgY29sb3IgdmFsdWUgdG8gSFNMLiBFeHBlY3RzIDAuLjI1NSBpbnB1dHMsIHByb2R1Y2VzIDAuLjEgb3V0cHV0cy5cclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRyZ2IyaHNsOiBmdW5jdGlvbihjb2xvcikge1xyXG5cdFx0dmFyIHIgPSBjb2xvclswXS8yNTU7XHJcblx0XHR2YXIgZyA9IGNvbG9yWzFdLzI1NTtcclxuXHRcdHZhciBiID0gY29sb3JbMl0vMjU1O1xyXG5cclxuXHRcdHZhciBtYXggPSBNYXRoLm1heChyLCBnLCBiKSwgbWluID0gTWF0aC5taW4ociwgZywgYik7XHJcblx0XHR2YXIgaCwgcywgbCA9IChtYXggKyBtaW4pIC8gMjtcclxuXHJcblx0XHRpZiAobWF4ID09IG1pbikge1xyXG5cdFx0XHRoID0gcyA9IDA7IC8vIGFjaHJvbWF0aWNcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBkID0gbWF4IC0gbWluO1xyXG5cdFx0XHRzID0gKGwgPiAwLjUgPyBkIC8gKDIgLSBtYXggLSBtaW4pIDogZCAvIChtYXggKyBtaW4pKTtcclxuXHRcdFx0c3dpdGNoKG1heCkge1xyXG5cdFx0XHRcdGNhc2UgcjogaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApOyBicmVhaztcclxuXHRcdFx0XHRjYXNlIGc6IGggPSAoYiAtIHIpIC8gZCArIDI7IGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgYjogaCA9IChyIC0gZykgLyBkICsgNDsgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0aCAvPSA2O1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBbaCwgcywgbF07XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydHMgYW4gSFNMIGNvbG9yIHZhbHVlIHRvIFJHQi4gRXhwZWN0cyAwLi4xIGlucHV0cywgcHJvZHVjZXMgMC4uMjU1IG91dHB1dHMuXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3JcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0aHNsMnJnYjogZnVuY3Rpb24oY29sb3IpIHtcclxuXHRcdHZhciBsID0gY29sb3JbMl07XHJcblxyXG5cdFx0aWYgKGNvbG9yWzFdID09IDApIHtcclxuXHRcdFx0bCA9IE1hdGgucm91bmQobCoyNTUpO1xyXG5cdFx0XHRyZXR1cm4gW2wsIGwsIGxdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGh1ZTJyZ2IgPSBmdW5jdGlvbihwLCBxLCB0KSB7XHJcblx0XHRcdFx0aWYgKHQgPCAwKSB0ICs9IDE7XHJcblx0XHRcdFx0aWYgKHQgPiAxKSB0IC09IDE7XHJcblx0XHRcdFx0aWYgKHQgPCAxLzYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xyXG5cdFx0XHRcdGlmICh0IDwgMS8yKSByZXR1cm4gcTtcclxuXHRcdFx0XHRpZiAodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcclxuXHRcdFx0XHRyZXR1cm4gcDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHMgPSBjb2xvclsxXTtcclxuXHRcdFx0dmFyIHEgPSAobCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcyk7XHJcblx0XHRcdHZhciBwID0gMiAqIGwgLSBxO1xyXG5cdFx0XHR2YXIgciA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0gKyAxLzMpO1xyXG5cdFx0XHR2YXIgZyA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0pO1xyXG5cdFx0XHR2YXIgYiA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0gLSAxLzMpO1xyXG5cdFx0XHRyZXR1cm4gW01hdGgucm91bmQocioyNTUpLCBNYXRoLnJvdW5kKGcqMjU1KSwgTWF0aC5yb3VuZChiKjI1NSldO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHRvUkdCOiBmdW5jdGlvbihjb2xvcikge1xyXG5cdFx0cmV0dXJuIFwicmdiKFwiICsgdGhpcy5fY2xhbXAoY29sb3JbMF0pICsgXCIsXCIgKyB0aGlzLl9jbGFtcChjb2xvclsxXSkgKyBcIixcIiArIHRoaXMuX2NsYW1wKGNvbG9yWzJdKSArIFwiKVwiO1xyXG5cdH0sXHJcblxyXG5cdHRvSGV4OiBmdW5jdGlvbihjb2xvcikge1xyXG5cdFx0dmFyIHBhcnRzID0gW107XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRwYXJ0cy5wdXNoKHRoaXMuX2NsYW1wKGNvbG9yW2ldKS50b1N0cmluZygxNikubHBhZChcIjBcIiwgMikpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIFwiI1wiICsgcGFydHMuam9pbihcIlwiKTtcclxuXHR9LFxyXG5cclxuXHRfY2xhbXA6IGZ1bmN0aW9uKG51bSkge1xyXG5cdFx0aWYgKG51bSA8IDApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9IGVsc2UgaWYgKG51bSA+IDI1NSkge1xyXG5cdFx0XHRyZXR1cm4gMjU1O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIG51bTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfY2FjaGU6IHtcclxuXHRcdFwiYmxhY2tcIjogWzAsMCwwXSxcclxuXHRcdFwibmF2eVwiOiBbMCwwLDEyOF0sXHJcblx0XHRcImRhcmtibHVlXCI6IFswLDAsMTM5XSxcclxuXHRcdFwibWVkaXVtYmx1ZVwiOiBbMCwwLDIwNV0sXHJcblx0XHRcImJsdWVcIjogWzAsMCwyNTVdLFxyXG5cdFx0XCJkYXJrZ3JlZW5cIjogWzAsMTAwLDBdLFxyXG5cdFx0XCJncmVlblwiOiBbMCwxMjgsMF0sXHJcblx0XHRcInRlYWxcIjogWzAsMTI4LDEyOF0sXHJcblx0XHRcImRhcmtjeWFuXCI6IFswLDEzOSwxMzldLFxyXG5cdFx0XCJkZWVwc2t5Ymx1ZVwiOiBbMCwxOTEsMjU1XSxcclxuXHRcdFwiZGFya3R1cnF1b2lzZVwiOiBbMCwyMDYsMjA5XSxcclxuXHRcdFwibWVkaXVtc3ByaW5nZ3JlZW5cIjogWzAsMjUwLDE1NF0sXHJcblx0XHRcImxpbWVcIjogWzAsMjU1LDBdLFxyXG5cdFx0XCJzcHJpbmdncmVlblwiOiBbMCwyNTUsMTI3XSxcclxuXHRcdFwiYXF1YVwiOiBbMCwyNTUsMjU1XSxcclxuXHRcdFwiY3lhblwiOiBbMCwyNTUsMjU1XSxcclxuXHRcdFwibWlkbmlnaHRibHVlXCI6IFsyNSwyNSwxMTJdLFxyXG5cdFx0XCJkb2RnZXJibHVlXCI6IFszMCwxNDQsMjU1XSxcclxuXHRcdFwiZm9yZXN0Z3JlZW5cIjogWzM0LDEzOSwzNF0sXHJcblx0XHRcInNlYWdyZWVuXCI6IFs0NiwxMzksODddLFxyXG5cdFx0XCJkYXJrc2xhdGVncmF5XCI6IFs0Nyw3OSw3OV0sXHJcblx0XHRcImRhcmtzbGF0ZWdyZXlcIjogWzQ3LDc5LDc5XSxcclxuXHRcdFwibGltZWdyZWVuXCI6IFs1MCwyMDUsNTBdLFxyXG5cdFx0XCJtZWRpdW1zZWFncmVlblwiOiBbNjAsMTc5LDExM10sXHJcblx0XHRcInR1cnF1b2lzZVwiOiBbNjQsMjI0LDIwOF0sXHJcblx0XHRcInJveWFsYmx1ZVwiOiBbNjUsMTA1LDIyNV0sXHJcblx0XHRcInN0ZWVsYmx1ZVwiOiBbNzAsMTMwLDE4MF0sXHJcblx0XHRcImRhcmtzbGF0ZWJsdWVcIjogWzcyLDYxLDEzOV0sXHJcblx0XHRcIm1lZGl1bXR1cnF1b2lzZVwiOiBbNzIsMjA5LDIwNF0sXHJcblx0XHRcImluZGlnb1wiOiBbNzUsMCwxMzBdLFxyXG5cdFx0XCJkYXJrb2xpdmVncmVlblwiOiBbODUsMTA3LDQ3XSxcclxuXHRcdFwiY2FkZXRibHVlXCI6IFs5NSwxNTgsMTYwXSxcclxuXHRcdFwiY29ybmZsb3dlcmJsdWVcIjogWzEwMCwxNDksMjM3XSxcclxuXHRcdFwibWVkaXVtYXF1YW1hcmluZVwiOiBbMTAyLDIwNSwxNzBdLFxyXG5cdFx0XCJkaW1ncmF5XCI6IFsxMDUsMTA1LDEwNV0sXHJcblx0XHRcImRpbWdyZXlcIjogWzEwNSwxMDUsMTA1XSxcclxuXHRcdFwic2xhdGVibHVlXCI6IFsxMDYsOTAsMjA1XSxcclxuXHRcdFwib2xpdmVkcmFiXCI6IFsxMDcsMTQyLDM1XSxcclxuXHRcdFwic2xhdGVncmF5XCI6IFsxMTIsMTI4LDE0NF0sXHJcblx0XHRcInNsYXRlZ3JleVwiOiBbMTEyLDEyOCwxNDRdLFxyXG5cdFx0XCJsaWdodHNsYXRlZ3JheVwiOiBbMTE5LDEzNiwxNTNdLFxyXG5cdFx0XCJsaWdodHNsYXRlZ3JleVwiOiBbMTE5LDEzNiwxNTNdLFxyXG5cdFx0XCJtZWRpdW1zbGF0ZWJsdWVcIjogWzEyMywxMDQsMjM4XSxcclxuXHRcdFwibGF3bmdyZWVuXCI6IFsxMjQsMjUyLDBdLFxyXG5cdFx0XCJjaGFydHJldXNlXCI6IFsxMjcsMjU1LDBdLFxyXG5cdFx0XCJhcXVhbWFyaW5lXCI6IFsxMjcsMjU1LDIxMl0sXHJcblx0XHRcIm1hcm9vblwiOiBbMTI4LDAsMF0sXHJcblx0XHRcInB1cnBsZVwiOiBbMTI4LDAsMTI4XSxcclxuXHRcdFwib2xpdmVcIjogWzEyOCwxMjgsMF0sXHJcblx0XHRcImdyYXlcIjogWzEyOCwxMjgsMTI4XSxcclxuXHRcdFwiZ3JleVwiOiBbMTI4LDEyOCwxMjhdLFxyXG5cdFx0XCJza3libHVlXCI6IFsxMzUsMjA2LDIzNV0sXHJcblx0XHRcImxpZ2h0c2t5Ymx1ZVwiOiBbMTM1LDIwNiwyNTBdLFxyXG5cdFx0XCJibHVldmlvbGV0XCI6IFsxMzgsNDMsMjI2XSxcclxuXHRcdFwiZGFya3JlZFwiOiBbMTM5LDAsMF0sXHJcblx0XHRcImRhcmttYWdlbnRhXCI6IFsxMzksMCwxMzldLFxyXG5cdFx0XCJzYWRkbGVicm93blwiOiBbMTM5LDY5LDE5XSxcclxuXHRcdFwiZGFya3NlYWdyZWVuXCI6IFsxNDMsMTg4LDE0M10sXHJcblx0XHRcImxpZ2h0Z3JlZW5cIjogWzE0NCwyMzgsMTQ0XSxcclxuXHRcdFwibWVkaXVtcHVycGxlXCI6IFsxNDcsMTEyLDIxNl0sXHJcblx0XHRcImRhcmt2aW9sZXRcIjogWzE0OCwwLDIxMV0sXHJcblx0XHRcInBhbGVncmVlblwiOiBbMTUyLDI1MSwxNTJdLFxyXG5cdFx0XCJkYXJrb3JjaGlkXCI6IFsxNTMsNTAsMjA0XSxcclxuXHRcdFwieWVsbG93Z3JlZW5cIjogWzE1NCwyMDUsNTBdLFxyXG5cdFx0XCJzaWVubmFcIjogWzE2MCw4Miw0NV0sXHJcblx0XHRcImJyb3duXCI6IFsxNjUsNDIsNDJdLFxyXG5cdFx0XCJkYXJrZ3JheVwiOiBbMTY5LDE2OSwxNjldLFxyXG5cdFx0XCJkYXJrZ3JleVwiOiBbMTY5LDE2OSwxNjldLFxyXG5cdFx0XCJsaWdodGJsdWVcIjogWzE3MywyMTYsMjMwXSxcclxuXHRcdFwiZ3JlZW55ZWxsb3dcIjogWzE3MywyNTUsNDddLFxyXG5cdFx0XCJwYWxldHVycXVvaXNlXCI6IFsxNzUsMjM4LDIzOF0sXHJcblx0XHRcImxpZ2h0c3RlZWxibHVlXCI6IFsxNzYsMTk2LDIyMl0sXHJcblx0XHRcInBvd2RlcmJsdWVcIjogWzE3NiwyMjQsMjMwXSxcclxuXHRcdFwiZmlyZWJyaWNrXCI6IFsxNzgsMzQsMzRdLFxyXG5cdFx0XCJkYXJrZ29sZGVucm9kXCI6IFsxODQsMTM0LDExXSxcclxuXHRcdFwibWVkaXVtb3JjaGlkXCI6IFsxODYsODUsMjExXSxcclxuXHRcdFwicm9zeWJyb3duXCI6IFsxODgsMTQzLDE0M10sXHJcblx0XHRcImRhcmtraGFraVwiOiBbMTg5LDE4MywxMDddLFxyXG5cdFx0XCJzaWx2ZXJcIjogWzE5MiwxOTIsMTkyXSxcclxuXHRcdFwibWVkaXVtdmlvbGV0cmVkXCI6IFsxOTksMjEsMTMzXSxcclxuXHRcdFwiaW5kaWFucmVkXCI6IFsyMDUsOTIsOTJdLFxyXG5cdFx0XCJwZXJ1XCI6IFsyMDUsMTMzLDYzXSxcclxuXHRcdFwiY2hvY29sYXRlXCI6IFsyMTAsMTA1LDMwXSxcclxuXHRcdFwidGFuXCI6IFsyMTAsMTgwLDE0MF0sXHJcblx0XHRcImxpZ2h0Z3JheVwiOiBbMjExLDIxMSwyMTFdLFxyXG5cdFx0XCJsaWdodGdyZXlcIjogWzIxMSwyMTEsMjExXSxcclxuXHRcdFwicGFsZXZpb2xldHJlZFwiOiBbMjE2LDExMiwxNDddLFxyXG5cdFx0XCJ0aGlzdGxlXCI6IFsyMTYsMTkxLDIxNl0sXHJcblx0XHRcIm9yY2hpZFwiOiBbMjE4LDExMiwyMTRdLFxyXG5cdFx0XCJnb2xkZW5yb2RcIjogWzIxOCwxNjUsMzJdLFxyXG5cdFx0XCJjcmltc29uXCI6IFsyMjAsMjAsNjBdLFxyXG5cdFx0XCJnYWluc2Jvcm9cIjogWzIyMCwyMjAsMjIwXSxcclxuXHRcdFwicGx1bVwiOiBbMjIxLDE2MCwyMjFdLFxyXG5cdFx0XCJidXJseXdvb2RcIjogWzIyMiwxODQsMTM1XSxcclxuXHRcdFwibGlnaHRjeWFuXCI6IFsyMjQsMjU1LDI1NV0sXHJcblx0XHRcImxhdmVuZGVyXCI6IFsyMzAsMjMwLDI1MF0sXHJcblx0XHRcImRhcmtzYWxtb25cIjogWzIzMywxNTAsMTIyXSxcclxuXHRcdFwidmlvbGV0XCI6IFsyMzgsMTMwLDIzOF0sXHJcblx0XHRcInBhbGVnb2xkZW5yb2RcIjogWzIzOCwyMzIsMTcwXSxcclxuXHRcdFwibGlnaHRjb3JhbFwiOiBbMjQwLDEyOCwxMjhdLFxyXG5cdFx0XCJraGFraVwiOiBbMjQwLDIzMCwxNDBdLFxyXG5cdFx0XCJhbGljZWJsdWVcIjogWzI0MCwyNDgsMjU1XSxcclxuXHRcdFwiaG9uZXlkZXdcIjogWzI0MCwyNTUsMjQwXSxcclxuXHRcdFwiYXp1cmVcIjogWzI0MCwyNTUsMjU1XSxcclxuXHRcdFwic2FuZHlicm93blwiOiBbMjQ0LDE2NCw5Nl0sXHJcblx0XHRcIndoZWF0XCI6IFsyNDUsMjIyLDE3OV0sXHJcblx0XHRcImJlaWdlXCI6IFsyNDUsMjQ1LDIyMF0sXHJcblx0XHRcIndoaXRlc21va2VcIjogWzI0NSwyNDUsMjQ1XSxcclxuXHRcdFwibWludGNyZWFtXCI6IFsyNDUsMjU1LDI1MF0sXHJcblx0XHRcImdob3N0d2hpdGVcIjogWzI0OCwyNDgsMjU1XSxcclxuXHRcdFwic2FsbW9uXCI6IFsyNTAsMTI4LDExNF0sXHJcblx0XHRcImFudGlxdWV3aGl0ZVwiOiBbMjUwLDIzNSwyMTVdLFxyXG5cdFx0XCJsaW5lblwiOiBbMjUwLDI0MCwyMzBdLFxyXG5cdFx0XCJsaWdodGdvbGRlbnJvZHllbGxvd1wiOiBbMjUwLDI1MCwyMTBdLFxyXG5cdFx0XCJvbGRsYWNlXCI6IFsyNTMsMjQ1LDIzMF0sXHJcblx0XHRcInJlZFwiOiBbMjU1LDAsMF0sXHJcblx0XHRcImZ1Y2hzaWFcIjogWzI1NSwwLDI1NV0sXHJcblx0XHRcIm1hZ2VudGFcIjogWzI1NSwwLDI1NV0sXHJcblx0XHRcImRlZXBwaW5rXCI6IFsyNTUsMjAsMTQ3XSxcclxuXHRcdFwib3JhbmdlcmVkXCI6IFsyNTUsNjksMF0sXHJcblx0XHRcInRvbWF0b1wiOiBbMjU1LDk5LDcxXSxcclxuXHRcdFwiaG90cGlua1wiOiBbMjU1LDEwNSwxODBdLFxyXG5cdFx0XCJjb3JhbFwiOiBbMjU1LDEyNyw4MF0sXHJcblx0XHRcImRhcmtvcmFuZ2VcIjogWzI1NSwxNDAsMF0sXHJcblx0XHRcImxpZ2h0c2FsbW9uXCI6IFsyNTUsMTYwLDEyMl0sXHJcblx0XHRcIm9yYW5nZVwiOiBbMjU1LDE2NSwwXSxcclxuXHRcdFwibGlnaHRwaW5rXCI6IFsyNTUsMTgyLDE5M10sXHJcblx0XHRcInBpbmtcIjogWzI1NSwxOTIsMjAzXSxcclxuXHRcdFwiZ29sZFwiOiBbMjU1LDIxNSwwXSxcclxuXHRcdFwicGVhY2hwdWZmXCI6IFsyNTUsMjE4LDE4NV0sXHJcblx0XHRcIm5hdmFqb3doaXRlXCI6IFsyNTUsMjIyLDE3M10sXHJcblx0XHRcIm1vY2Nhc2luXCI6IFsyNTUsMjI4LDE4MV0sXHJcblx0XHRcImJpc3F1ZVwiOiBbMjU1LDIyOCwxOTZdLFxyXG5cdFx0XCJtaXN0eXJvc2VcIjogWzI1NSwyMjgsMjI1XSxcclxuXHRcdFwiYmxhbmNoZWRhbG1vbmRcIjogWzI1NSwyMzUsMjA1XSxcclxuXHRcdFwicGFwYXlhd2hpcFwiOiBbMjU1LDIzOSwyMTNdLFxyXG5cdFx0XCJsYXZlbmRlcmJsdXNoXCI6IFsyNTUsMjQwLDI0NV0sXHJcblx0XHRcInNlYXNoZWxsXCI6IFsyNTUsMjQ1LDIzOF0sXHJcblx0XHRcImNvcm5zaWxrXCI6IFsyNTUsMjQ4LDIyMF0sXHJcblx0XHRcImxlbW9uY2hpZmZvblwiOiBbMjU1LDI1MCwyMDVdLFxyXG5cdFx0XCJmbG9yYWx3aGl0ZVwiOiBbMjU1LDI1MCwyNDBdLFxyXG5cdFx0XCJzbm93XCI6IFsyNTUsMjUwLDI1MF0sXHJcblx0XHRcInllbGxvd1wiOiBbMjU1LDI1NSwwXSxcclxuXHRcdFwibGlnaHR5ZWxsb3dcIjogWzI1NSwyNTUsMjI0XSxcclxuXHRcdFwiaXZvcnlcIjogWzI1NSwyNTUsMjQwXSxcclxuXHRcdFwid2hpdGVcIjogWzI1NSwyNTUsMjU1XVxyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBMaWdodGluZyBjb21wdXRhdGlvbiwgYmFzZWQgb24gYSB0cmFkaXRpb25hbCBGT1YgZm9yIG11bHRpcGxlIGxpZ2h0IHNvdXJjZXMgYW5kIG11bHRpcGxlIHBhc3Nlcy5cclxuICogQHBhcmFtIHtmdW5jdGlvbn0gcmVmbGVjdGl2aXR5Q2FsbGJhY2sgQ2FsbGJhY2sgdG8gcmV0cmlldmUgY2VsbCByZWZsZWN0aXZpdHkgKDAuLjEpXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnBhc3Nlcz0xXSBOdW1iZXIgb2YgcGFzc2VzLiAxIGVxdWFscyB0byBzaW1wbGUgRk9WIG9mIGFsbCBsaWdodCBzb3VyY2VzLCA+MSBtZWFucyBhICpoaWdobHkgc2ltcGxpZmllZCogcmFkaW9zaXR5LWxpa2UgYWxnb3JpdGhtLlxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMuZW1pc3Npb25UaHJlc2hvbGQ9MTAwXSBDZWxscyB3aXRoIGVtaXNzaXZpdHkgPiB0aHJlc2hvbGQgd2lsbCBiZSB0cmVhdGVkIGFzIGxpZ2h0IHNvdXJjZSBpbiB0aGUgbmV4dCBwYXNzLlxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucmFuZ2U9MTBdIE1heCBsaWdodCByYW5nZVxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nID0gZnVuY3Rpb24ocmVmbGVjdGl2aXR5Q2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHR0aGlzLl9yZWZsZWN0aXZpdHlDYWxsYmFjayA9IHJlZmxlY3Rpdml0eUNhbGxiYWNrO1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRwYXNzZXM6IDEsXHJcblx0XHRlbWlzc2lvblRocmVzaG9sZDogMTAwLFxyXG5cdFx0cmFuZ2U6IDEwXHJcblx0fTtcclxuXHR0aGlzLl9mb3YgPSBudWxsO1xyXG5cclxuXHR0aGlzLl9saWdodHMgPSB7fTtcclxuXHR0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZSA9IHt9O1xyXG5cdHRoaXMuX2ZvdkNhY2hlID0ge307XHJcblxyXG5cdHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGp1c3Qgb3B0aW9ucyBhdCBydW50aW1lXHJcbiAqIEBzZWUgUk9ULkxpZ2h0aW5nXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHRpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJhbmdlKSB7IHRoaXMucmVzZXQoKTsgfVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCB0aGUgdXNlZCBGaWVsZC1PZi1WaWV3IGFsZ29cclxuICogQHBhcmFtIHtST1QuRk9WfSBmb3ZcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuc2V0Rk9WID0gZnVuY3Rpb24oZm92KSB7XHJcblx0dGhpcy5fZm92ID0gZm92O1xyXG5cdHRoaXMuX2ZvdkNhY2hlID0ge307XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IChvciByZW1vdmUpIGEgbGlnaHQgc291cmNlXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7bnVsbCB8fCBzdHJpbmcgfHwgbnVtYmVyWzNdfSBjb2xvclxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5zZXRMaWdodCA9IGZ1bmN0aW9uKHgsIHksIGNvbG9yKSB7XHJcbiAgdmFyIGtleSA9IHggKyBcIixcIiArIHk7XHJcblxyXG4gIGlmIChjb2xvcikge1xyXG4gICAgdGhpcy5fbGlnaHRzW2tleV0gPSAodHlwZW9mKGNvbG9yKSA9PSBcInN0cmluZ1wiID8gUk9ULkNvbG9yLmZyb21TdHJpbmcoY29sb3IpIDogY29sb3IpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkZWxldGUgdGhpcy5fbGlnaHRzW2tleV07XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhbGwgbGlnaHQgc291cmNlc1xyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5jbGVhckxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fbGlnaHRzID0ge307XHJcbn07XHJcblxyXG4vKipcclxuICogUmVzZXQgdGhlIHByZS1jb21wdXRlZCB0b3BvbG9neSB2YWx1ZXMuIENhbGwgd2hlbmV2ZXIgdGhlIHVuZGVybHlpbmcgbWFwIGNoYW5nZXMgaXRzIGxpZ2h0LXBhc3NhYmlsaXR5LlxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlID0ge307XHJcblx0dGhpcy5fZm92Q2FjaGUgPSB7fTtcclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB0aGUgbGlnaHRpbmdcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gbGlnaHRpbmdDYWxsYmFjayBXaWxsIGJlIGNhbGxlZCB3aXRoICh4LCB5LCBjb2xvcikgZm9yIGV2ZXJ5IGxpdCBjZWxsXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihsaWdodGluZ0NhbGxiYWNrKSB7XHJcblx0dmFyIGRvbmVDZWxscyA9IHt9O1xyXG5cdHZhciBlbWl0dGluZ0NlbGxzID0ge307XHJcblx0dmFyIGxpdENlbGxzID0ge307XHJcblxyXG5cdGZvciAodmFyIGtleSBpbiB0aGlzLl9saWdodHMpIHsgLyogcHJlcGFyZSBlbWl0dGVycyBmb3IgZmlyc3QgcGFzcyAqL1xyXG5cdFx0dmFyIGxpZ2h0ID0gdGhpcy5fbGlnaHRzW2tleV07XHJcblx0XHRlbWl0dGluZ0NlbGxzW2tleV0gPSBbMCwgMCwgMF07XHJcblx0XHRST1QuQ29sb3IuYWRkXyhlbWl0dGluZ0NlbGxzW2tleV0sIGxpZ2h0KTtcclxuXHR9XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX29wdGlvbnMucGFzc2VzO2krKykgeyAvKiBtYWluIGxvb3AgKi9cclxuXHRcdHRoaXMuX2VtaXRMaWdodChlbWl0dGluZ0NlbGxzLCBsaXRDZWxscywgZG9uZUNlbGxzKTtcclxuXHRcdGlmIChpKzEgPT0gdGhpcy5fb3B0aW9ucy5wYXNzZXMpIHsgY29udGludWU7IH0gLyogbm90IGZvciB0aGUgbGFzdCBwYXNzICovXHJcblx0XHRlbWl0dGluZ0NlbGxzID0gdGhpcy5fY29tcHV0ZUVtaXR0ZXJzKGxpdENlbGxzLCBkb25lQ2VsbHMpO1xyXG5cdH1cclxuXHJcblx0Zm9yICh2YXIgbGl0S2V5IGluIGxpdENlbGxzKSB7IC8qIGxldCB0aGUgdXNlciBrbm93IHdoYXQgYW5kIGhvdyBpcyBsaXQgKi9cclxuXHRcdHZhciBwYXJ0cyA9IGxpdEtleS5zcGxpdChcIixcIik7XHJcblx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcclxuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0bGlnaHRpbmdDYWxsYmFjayh4LCB5LCBsaXRDZWxsc1tsaXRLZXldKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgb25lIGl0ZXJhdGlvbiBmcm9tIGFsbCBlbWl0dGluZyBjZWxsc1xyXG4gKiBAcGFyYW0ge29iamVjdH0gZW1pdHRpbmdDZWxscyBUaGVzZSBlbWl0IGxpZ2h0XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBsaXRDZWxscyBBZGQgcHJvamVjdGVkIGxpZ2h0IHRvIHRoZXNlXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBkb25lQ2VsbHMgVGhlc2UgYWxyZWFkeSBlbWl0dGVkLCBmb3JiaWQgdGhlbSBmcm9tIGZ1cnRoZXIgY2FsY3VsYXRpb25zXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLl9lbWl0TGlnaHQgPSBmdW5jdGlvbihlbWl0dGluZ0NlbGxzLCBsaXRDZWxscywgZG9uZUNlbGxzKSB7XHJcblx0Zm9yICh2YXIga2V5IGluIGVtaXR0aW5nQ2VsbHMpIHtcclxuXHRcdHZhciBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XHJcblx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcclxuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0dGhpcy5fZW1pdExpZ2h0RnJvbUNlbGwoeCwgeSwgZW1pdHRpbmdDZWxsc1trZXldLCBsaXRDZWxscyk7XHJcblx0XHRkb25lQ2VsbHNba2V5XSA9IDE7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFByZXBhcmUgYSBsaXN0IG9mIGVtaXR0ZXJzIGZvciBuZXh0IHBhc3NcclxuICogQHBhcmFtIHtvYmplY3R9IGxpdENlbGxzXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBkb25lQ2VsbHNcclxuICogQHJldHVybnMge29iamVjdH1cclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuX2NvbXB1dGVFbWl0dGVycyA9IGZ1bmN0aW9uKGxpdENlbGxzLCBkb25lQ2VsbHMpIHtcclxuXHR2YXIgcmVzdWx0ID0ge307XHJcblxyXG5cdGZvciAodmFyIGtleSBpbiBsaXRDZWxscykge1xyXG5cdFx0aWYgKGtleSBpbiBkb25lQ2VsbHMpIHsgY29udGludWU7IH0gLyogYWxyZWFkeSBlbWl0dGVkICovXHJcblxyXG5cdFx0dmFyIGNvbG9yID0gbGl0Q2VsbHNba2V5XTtcclxuXHJcblx0XHRpZiAoa2V5IGluIHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlKSB7XHJcblx0XHRcdHZhciByZWZsZWN0aXZpdHkgPSB0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZVtrZXldO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHBhcnRzID0ga2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdFx0dmFyIHggPSBwYXJzZUludChwYXJ0c1swXSk7XHJcblx0XHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0XHR2YXIgcmVmbGVjdGl2aXR5ID0gdGhpcy5fcmVmbGVjdGl2aXR5Q2FsbGJhY2soeCwgeSk7XHJcblx0XHRcdHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlW2tleV0gPSByZWZsZWN0aXZpdHk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHJlZmxlY3Rpdml0eSA9PSAwKSB7IGNvbnRpbnVlOyB9IC8qIHdpbGwgbm90IHJlZmxlY3QgYXQgYWxsICovXHJcblxyXG5cdFx0LyogY29tcHV0ZSBlbWlzc2lvbiBjb2xvciAqL1xyXG5cdFx0dmFyIGVtaXNzaW9uID0gW107XHJcblx0XHR2YXIgaW50ZW5zaXR5ID0gMDtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdHZhciBwYXJ0ID0gTWF0aC5yb3VuZChjb2xvcltpXSpyZWZsZWN0aXZpdHkpO1xyXG5cdFx0XHRlbWlzc2lvbltpXSA9IHBhcnQ7XHJcblx0XHRcdGludGVuc2l0eSArPSBwYXJ0O1xyXG5cdFx0fVxyXG5cdFx0aWYgKGludGVuc2l0eSA+IHRoaXMuX29wdGlvbnMuZW1pc3Npb25UaHJlc2hvbGQpIHsgcmVzdWx0W2tleV0gPSBlbWlzc2lvbjsgfVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIG9uZSBpdGVyYXRpb24gZnJvbSBvbmUgY2VsbFxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxyXG4gKiBAcGFyYW0ge29iamVjdH0gbGl0Q2VsbHMgQ2VsbCBkYXRhIHRvIGJ5IHVwZGF0ZWRcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuX2VtaXRMaWdodEZyb21DZWxsID0gZnVuY3Rpb24oeCwgeSwgY29sb3IsIGxpdENlbGxzKSB7XHJcblx0dmFyIGtleSA9IHgrXCIsXCIreTtcclxuXHRpZiAoa2V5IGluIHRoaXMuX2ZvdkNhY2hlKSB7XHJcblx0XHR2YXIgZm92ID0gdGhpcy5fZm92Q2FjaGVba2V5XTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGZvdiA9IHRoaXMuX3VwZGF0ZUZPVih4LCB5KTtcclxuXHR9XHJcblxyXG5cdGZvciAodmFyIGZvdktleSBpbiBmb3YpIHtcclxuXHRcdHZhciBmb3JtRmFjdG9yID0gZm92W2ZvdktleV07XHJcblxyXG5cdFx0aWYgKGZvdktleSBpbiBsaXRDZWxscykgeyAvKiBhbHJlYWR5IGxpdCAqL1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gbGl0Q2VsbHNbZm92S2V5XTtcclxuXHRcdH0gZWxzZSB7IC8qIG5ld2x5IGxpdCAqL1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gWzAsIDAsIDBdO1xyXG5cdFx0XHRsaXRDZWxsc1tmb3ZLZXldID0gcmVzdWx0O1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7IHJlc3VsdFtpXSArPSBNYXRoLnJvdW5kKGNvbG9yW2ldKmZvcm1GYWN0b3IpOyB9IC8qIGFkZCBsaWdodCBjb2xvciAqL1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBGT1YgKFwiZm9ybSBmYWN0b3JcIikgZm9yIGEgcG90ZW50aWFsIGxpZ2h0IHNvdXJjZSBhdCBbeCx5XVxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5fdXBkYXRlRk9WID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdHZhciBrZXkxID0geCtcIixcIit5O1xyXG5cdHZhciBjYWNoZSA9IHt9O1xyXG5cdHRoaXMuX2ZvdkNhY2hlW2tleTFdID0gY2FjaGU7XHJcblx0dmFyIHJhbmdlID0gdGhpcy5fb3B0aW9ucy5yYW5nZTtcclxuXHR2YXIgY2IgPSBmdW5jdGlvbih4LCB5LCByLCB2aXMpIHtcclxuXHRcdHZhciBrZXkyID0geCtcIixcIit5O1xyXG5cdFx0dmFyIGZvcm1GYWN0b3IgPSB2aXMgKiAoMS1yL3JhbmdlKTtcclxuXHRcdGlmIChmb3JtRmFjdG9yID09IDApIHsgcmV0dXJuOyB9XHJcblx0XHRjYWNoZVtrZXkyXSA9IGZvcm1GYWN0b3I7XHJcblx0fTtcclxuXHR0aGlzLl9mb3YuY29tcHV0ZSh4LCB5LCByYW5nZSwgY2IuYmluZCh0aGlzKSk7XHJcblxyXG5cdHJldHVybiBjYWNoZTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBBYnN0cmFjdCBwYXRoZmluZGVyXHJcbiAqIEBwYXJhbSB7aW50fSB0b1ggVGFyZ2V0IFggY29vcmRcclxuICogQHBhcmFtIHtpbnR9IHRvWSBUYXJnZXQgWSBjb29yZFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBwYXNzYWJsZUNhbGxiYWNrIENhbGxiYWNrIHRvIGRldGVybWluZSBtYXAgcGFzc2FiaWxpdHlcclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudG9wb2xvZ3k9OF1cclxuICovXHJcblJPVC5QYXRoID0gZnVuY3Rpb24odG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHR0aGlzLl90b1ggPSB0b1g7XHJcblx0dGhpcy5fdG9ZID0gdG9ZO1xyXG5cdHRoaXMuX2Zyb21YID0gbnVsbDtcclxuXHR0aGlzLl9mcm9tWSA9IG51bGw7XHJcblx0dGhpcy5fcGFzc2FibGVDYWxsYmFjayA9IHBhc3NhYmxlQ2FsbGJhY2s7XHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdHRvcG9sb2d5OiA4XHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHJcblx0dGhpcy5fZGlycyA9IFJPVC5ESVJTW3RoaXMuX29wdGlvbnMudG9wb2xvZ3ldO1xyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDgpIHsgLyogcmVvcmRlciBkaXJzIGZvciBtb3JlIGFlc3RoZXRpYyByZXN1bHQgKHZlcnRpY2FsL2hvcml6b250YWwgZmlyc3QpICovXHJcblx0XHR0aGlzLl9kaXJzID0gW1xyXG5cdFx0XHR0aGlzLl9kaXJzWzBdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzJdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzRdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzZdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzFdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzNdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzVdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzddXHJcblx0XHRdXHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgYSBwYXRoIGZyb20gYSBnaXZlbiBwb2ludFxyXG4gKiBAcGFyYW0ge2ludH0gZnJvbVhcclxuICogQHBhcmFtIHtpbnR9IGZyb21ZXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFdpbGwgYmUgY2FsbGVkIGZvciBldmVyeSBwYXRoIGl0ZW0gd2l0aCBhcmd1bWVudHMgXCJ4XCIgYW5kIFwieVwiXHJcbiAqL1xyXG5ST1QuUGF0aC5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKGZyb21YLCBmcm9tWSwgY2FsbGJhY2spIHtcclxufTtcclxuXHJcblJPVC5QYXRoLnByb3RvdHlwZS5fZ2V0TmVpZ2hib3JzID0gZnVuY3Rpb24oY3gsIGN5KSB7XHJcblx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX2RpcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGRpciA9IHRoaXMuX2RpcnNbaV07XHJcblx0XHR2YXIgeCA9IGN4ICsgZGlyWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIGRpclsxXTtcclxuXHRcdFxyXG5cdFx0aWYgKCF0aGlzLl9wYXNzYWJsZUNhbGxiYWNrKHgsIHkpKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRyZXN1bHQucHVzaChbeCwgeV0pO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFNpbXBsaWZpZWQgRGlqa3N0cmEncyBhbGdvcml0aG06IGFsbCBlZGdlcyBoYXZlIGEgdmFsdWUgb2YgMVxyXG4gKiBAYXVnbWVudHMgUk9ULlBhdGhcclxuICogQHNlZSBST1QuUGF0aFxyXG4gKi9cclxuUk9ULlBhdGguRGlqa3N0cmEgPSBmdW5jdGlvbih0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdFJPVC5QYXRoLmNhbGwodGhpcywgdG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG5cclxuXHR0aGlzLl9jb21wdXRlZCA9IHt9O1xyXG5cdHRoaXMuX3RvZG8gPSBbXTtcclxuXHR0aGlzLl9hZGQodG9YLCB0b1ksIG51bGwpO1xyXG59O1xyXG5ST1QuUGF0aC5EaWprc3RyYS5leHRlbmQoUk9ULlBhdGgpO1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgYSBwYXRoIGZyb20gYSBnaXZlbiBwb2ludFxyXG4gKiBAc2VlIFJPVC5QYXRoI2NvbXB1dGVcclxuICovXHJcblJPVC5QYXRoLkRpamtzdHJhLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZLCBjYWxsYmFjaykge1xyXG5cdHZhciBrZXkgPSBmcm9tWCtcIixcIitmcm9tWTtcclxuXHRpZiAoIShrZXkgaW4gdGhpcy5fY29tcHV0ZWQpKSB7IHRoaXMuX2NvbXB1dGUoZnJvbVgsIGZyb21ZKTsgfVxyXG5cdGlmICghKGtleSBpbiB0aGlzLl9jb21wdXRlZCkpIHsgcmV0dXJuOyB9XHJcblx0XHJcblx0dmFyIGl0ZW0gPSB0aGlzLl9jb21wdXRlZFtrZXldO1xyXG5cdHdoaWxlIChpdGVtKSB7XHJcblx0XHRjYWxsYmFjayhpdGVtLngsIGl0ZW0ueSk7XHJcblx0XHRpdGVtID0gaXRlbS5wcmV2O1xyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIGEgbm9uLWNhY2hlZCB2YWx1ZVxyXG4gKi9cclxuUk9ULlBhdGguRGlqa3N0cmEucHJvdG90eXBlLl9jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZKSB7XHJcblx0d2hpbGUgKHRoaXMuX3RvZG8ubGVuZ3RoKSB7XHJcblx0XHR2YXIgaXRlbSA9IHRoaXMuX3RvZG8uc2hpZnQoKTtcclxuXHRcdGlmIChpdGVtLnggPT0gZnJvbVggJiYgaXRlbS55ID09IGZyb21ZKSB7IHJldHVybjsgfVxyXG5cdFx0XHJcblx0XHR2YXIgbmVpZ2hib3JzID0gdGhpcy5fZ2V0TmVpZ2hib3JzKGl0ZW0ueCwgaXRlbS55KTtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8bmVpZ2hib3JzLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0dmFyIG5laWdoYm9yID0gbmVpZ2hib3JzW2ldO1xyXG5cdFx0XHR2YXIgeCA9IG5laWdoYm9yWzBdO1xyXG5cdFx0XHR2YXIgeSA9IG5laWdoYm9yWzFdO1xyXG5cdFx0XHR2YXIgaWQgPSB4K1wiLFwiK3k7XHJcblx0XHRcdGlmIChpZCBpbiB0aGlzLl9jb21wdXRlZCkgeyBjb250aW51ZTsgfSAvKiBhbHJlYWR5IGRvbmUgKi9cdFxyXG5cdFx0XHR0aGlzLl9hZGQoeCwgeSwgaXRlbSk7IFxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5QYXRoLkRpamtzdHJhLnByb3RvdHlwZS5fYWRkID0gZnVuY3Rpb24oeCwgeSwgcHJldikge1xyXG5cdHZhciBvYmogPSB7XHJcblx0XHR4OiB4LFxyXG5cdFx0eTogeSxcclxuXHRcdHByZXY6IHByZXZcclxuXHR9O1xyXG5cdHRoaXMuX2NvbXB1dGVkW3grXCIsXCIreV0gPSBvYmo7XHJcblx0dGhpcy5fdG9kby5wdXNoKG9iaik7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgU2ltcGxpZmllZCBBKiBhbGdvcml0aG06IGFsbCBlZGdlcyBoYXZlIGEgdmFsdWUgb2YgMVxyXG4gKiBAYXVnbWVudHMgUk9ULlBhdGhcclxuICogQHNlZSBST1QuUGF0aFxyXG4gKi9cclxuUk9ULlBhdGguQVN0YXIgPSBmdW5jdGlvbih0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdFJPVC5QYXRoLmNhbGwodGhpcywgdG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG5cclxuXHR0aGlzLl90b2RvID0gW107XHJcblx0dGhpcy5fZG9uZSA9IHt9O1xyXG5cdHRoaXMuX2Zyb21YID0gbnVsbDtcclxuXHR0aGlzLl9mcm9tWSA9IG51bGw7XHJcbn07XHJcblJPVC5QYXRoLkFTdGFyLmV4dGVuZChST1QuUGF0aCk7XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBhIHBhdGggZnJvbSBhIGdpdmVuIHBvaW50XHJcbiAqIEBzZWUgUk9ULlBhdGgjY29tcHV0ZVxyXG4gKi9cclxuUk9ULlBhdGguQVN0YXIucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihmcm9tWCwgZnJvbVksIGNhbGxiYWNrKSB7XHJcblx0dGhpcy5fdG9kbyA9IFtdO1xyXG5cdHRoaXMuX2RvbmUgPSB7fTtcclxuXHR0aGlzLl9mcm9tWCA9IGZyb21YO1xyXG5cdHRoaXMuX2Zyb21ZID0gZnJvbVk7XHJcblx0dGhpcy5fYWRkKHRoaXMuX3RvWCwgdGhpcy5fdG9ZLCBudWxsKTtcclxuXHJcblx0d2hpbGUgKHRoaXMuX3RvZG8ubGVuZ3RoKSB7XHJcblx0XHR2YXIgaXRlbSA9IHRoaXMuX3RvZG8uc2hpZnQoKTtcclxuXHRcdGlmIChpdGVtLnggPT0gZnJvbVggJiYgaXRlbS55ID09IGZyb21ZKSB7IGJyZWFrOyB9XHJcblx0XHR2YXIgbmVpZ2hib3JzID0gdGhpcy5fZ2V0TmVpZ2hib3JzKGl0ZW0ueCwgaXRlbS55KTtcclxuXHJcblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvcnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHR2YXIgbmVpZ2hib3IgPSBuZWlnaGJvcnNbaV07XHJcblx0XHRcdHZhciB4ID0gbmVpZ2hib3JbMF07XHJcblx0XHRcdHZhciB5ID0gbmVpZ2hib3JbMV07XHJcblx0XHRcdHZhciBpZCA9IHgrXCIsXCIreTtcclxuXHRcdFx0aWYgKGlkIGluIHRoaXMuX2RvbmUpIHsgY29udGludWU7IH1cclxuXHRcdFx0dGhpcy5fYWRkKHgsIHksIGl0ZW0pOyBcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dmFyIGl0ZW0gPSB0aGlzLl9kb25lW2Zyb21YK1wiLFwiK2Zyb21ZXTtcclxuXHRpZiAoIWl0ZW0pIHsgcmV0dXJuOyB9XHJcblx0XHJcblx0d2hpbGUgKGl0ZW0pIHtcclxuXHRcdGNhbGxiYWNrKGl0ZW0ueCwgaXRlbS55KTtcclxuXHRcdGl0ZW0gPSBpdGVtLnByZXY7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULlBhdGguQVN0YXIucHJvdG90eXBlLl9hZGQgPSBmdW5jdGlvbih4LCB5LCBwcmV2KSB7XHJcblx0dmFyIGggPSB0aGlzLl9kaXN0YW5jZSh4LCB5KTtcclxuXHR2YXIgb2JqID0ge1xyXG5cdFx0eDogeCxcclxuXHRcdHk6IHksXHJcblx0XHRwcmV2OiBwcmV2LFxyXG5cdFx0ZzogKHByZXYgPyBwcmV2LmcrMSA6IDApLFxyXG5cdFx0aDogaFxyXG5cdH07XHJcblx0dGhpcy5fZG9uZVt4K1wiLFwiK3ldID0gb2JqO1xyXG5cdFxyXG5cdC8qIGluc2VydCBpbnRvIHByaW9yaXR5IHF1ZXVlICovXHJcblx0XHJcblx0dmFyIGYgPSBvYmouZyArIG9iai5oO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3RvZG8ubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGl0ZW0gPSB0aGlzLl90b2RvW2ldO1xyXG5cdFx0dmFyIGl0ZW1GID0gaXRlbS5nICsgaXRlbS5oO1xyXG5cdFx0aWYgKGYgPCBpdGVtRiB8fCAoZiA9PSBpdGVtRiAmJiBoIDwgaXRlbS5oKSkge1xyXG5cdFx0XHR0aGlzLl90b2RvLnNwbGljZShpLCAwLCBvYmopO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX3RvZG8ucHVzaChvYmopO1xyXG59O1xyXG5cclxuUk9ULlBhdGguQVN0YXIucHJvdG90eXBlLl9kaXN0YW5jZSA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRzd2l0Y2ggKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kpIHtcclxuXHRcdGNhc2UgNDpcclxuXHRcdFx0cmV0dXJuIChNYXRoLmFicyh4LXRoaXMuX2Zyb21YKSArIE1hdGguYWJzKHktdGhpcy5fZnJvbVkpKTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgNjpcclxuXHRcdFx0dmFyIGR4ID0gTWF0aC5hYnMoeCAtIHRoaXMuX2Zyb21YKTtcclxuXHRcdFx0dmFyIGR5ID0gTWF0aC5hYnMoeSAtIHRoaXMuX2Zyb21ZKTtcclxuXHRcdFx0cmV0dXJuIGR5ICsgTWF0aC5tYXgoMCwgKGR4LWR5KS8yKTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgODogXHJcblx0XHRcdHJldHVybiBNYXRoLm1heChNYXRoLmFicyh4LXRoaXMuX2Zyb21YKSwgTWF0aC5hYnMoeS10aGlzLl9mcm9tWSkpO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHRvcG9sb2d5XCIpO1xyXG59O1xyXG4gIHJldHVybiBST1Q7XHJcbn0pKTtcclxuIl19
