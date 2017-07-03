(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";

var _rot = require("../lib/rot");

var ROT = _interopRequireWildcard(_rot);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

if (ROT.isSupported()) {
	console.log("ROT is loaded.");
}

},{"../lib/rot":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWJcXHJvdC5qcyIsInNjcmlwdHNcXGdhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUE7Ozs7QUFJQyxXQUFVLElBQVYsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDdEIsS0FBSSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsT0FBTyxHQUEzQyxFQUFnRDtBQUM1QztBQUNBLFNBQU8sRUFBUCxFQUFXLE9BQVg7QUFDSCxFQUhELE1BR08sSUFBSSxRQUFPLE9BQVAseUNBQU8sT0FBUCxPQUFtQixRQUF2QixFQUFpQztBQUNwQztBQUNBO0FBQ0E7QUFDQSxTQUFPLE9BQVAsR0FBaUIsU0FBakI7QUFDSCxFQUxNLE1BS0E7QUFDSDtBQUNBLE9BQUssR0FBTCxHQUFXLFNBQVg7QUFDSDtBQUNKLENBYkEsYUFhTyxZQUFXO0FBQ25COzs7QUFHQSxLQUFJLE1BQU07QUFDVDs7O0FBR0EsZUFBYSx1QkFBVztBQUN2QixVQUFPLENBQUMsRUFBRSxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsRUFBaUMsVUFBakMsSUFBK0MsU0FBUyxTQUFULENBQW1CLElBQXBFLENBQVI7QUFDQSxHQU5ROztBQVFUO0FBQ0EsaUJBQWUsRUFUTjtBQVVUO0FBQ0Esa0JBQWdCLEVBWFA7O0FBYVQ7QUFDQSxRQUFNO0FBQ0wsUUFBSyxDQUNKLENBQUUsQ0FBRixFQUFLLENBQUMsQ0FBTixDQURJLEVBRUosQ0FBRSxDQUFGLEVBQU0sQ0FBTixDQUZJLEVBR0osQ0FBRSxDQUFGLEVBQU0sQ0FBTixDQUhJLEVBSUosQ0FBQyxDQUFDLENBQUYsRUFBTSxDQUFOLENBSkksQ0FEQTtBQU9MLFFBQUssQ0FDSixDQUFFLENBQUYsRUFBSyxDQUFDLENBQU4sQ0FESSxFQUVKLENBQUUsQ0FBRixFQUFLLENBQUMsQ0FBTixDQUZJLEVBR0osQ0FBRSxDQUFGLEVBQU0sQ0FBTixDQUhJLEVBSUosQ0FBRSxD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cUMsVUFBUyxDQUFULEVBQVksQ0FBWixFQUFlO0FBQ25ELFVBQVEsS0FBSyxRQUFMLENBQWMsUUFBdEI7QUFDQyxRQUFLLENBQUw7QUFDQyxXQUFRLEtBQUssR0FBTCxDQUFTLElBQUUsS0FBSyxNQUFoQixJQUEwQixLQUFLLEdBQUwsQ0FBUyxJQUFFLEtBQUssTUFBaEIsQ0FBbEM7QUFDRDs7QUFFQSxRQUFLLENBQUw7QUFDQyxRQUFJLEtBQUssS0FBSyxHQUFMLENBQVMsSUFBSSxLQUFLLE1BQWxCLENBQVQ7QUFDQSxRQUFJLEtBQUssS0FBSyxHQUFMLENBQVMsSUFBSSxLQUFLLE1BQWxCLENBQVQ7QUFDQSxXQUFPLEtBQUssS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUMsS0FBRyxFQUFKLElBQVEsQ0FBcEIsQ0FBWjtBQUNEOztBQUVBLFFBQUssQ0FBTDtBQUNDLFdBQU8sS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFMLENBQVMsSUFBRSxLQUFLLE1BQWhCLENBQVQsRUFBa0MsS0FBSyxHQUFMLENBQVMsSUFBRSxLQUFLLE1BQWhCLENBQWxDLENBQVA7QUFDRDtBQWJEOztBQWdCTyxRQUFNLElBQUksS0FBSixDQUFVLGtCQUFWLENBQU47QUFDUCxFQWxCRDtBQW1CRSxRQUFPLEdBQVA7QUFDRCxDQTN0S0EsQ0FBRDs7Ozs7QUNKQTs7SUFBWSxHOzs7O0FBRVosSUFBRyxJQUFJLFdBQUosRUFBSCxFQUFxQjtBQUNwQixTQUFRLEdBQVIsQ0FBWSxnQkFBWjtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG5cdFRoaXMgaXMgcm90LmpzLCB0aGUgUk9ndWVsaWtlIFRvb2xraXQgaW4gSmF2YVNjcmlwdC5cblx0VmVyc2lvbiAwLjd+ZGV2LCBnZW5lcmF0ZWQgb24gVGh1IDI0IE5vdiAyMDE2IDA4OjA3OjM5IE1TVC5cbiovXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAgICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgICAgIC8vIGxpa2UgTm9kZS5cbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgICAgcm9vdC5ST1QgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbi8qKlxuICogQG5hbWVzcGFjZSBUb3AtbGV2ZWwgUk9UIG5hbWVzcGFjZVxuICovXG52YXIgUk9UID0ge1xuXHQvKipcblx0ICogQHJldHVybnMge2Jvb2x9IElzIHJvdC5qcyBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyP1xuXHQgKi9cblx0aXNTdXBwb3J0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhIShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLmdldENvbnRleHQgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpO1xuXHR9LFxuXG5cdC8qKiBEZWZhdWx0IHdpdGggZm9yIGRpc3BsYXkgYW5kIG1hcCBnZW5lcmF0b3JzICovXG5cdERFRkFVTFRfV0lEVEg6IDgwLFxuXHQvKiogRGVmYXVsdCBoZWlnaHQgZm9yIGRpc3BsYXkgYW5kIG1hcCBnZW5lcmF0b3JzICovXG5cdERFRkFVTFRfSEVJR0hUOiAyNSxcblxuXHQvKiogRGlyZWN0aW9uYWwgY29uc3RhbnRzLiBPcmRlcmluZyBpcyBpbXBvcnRhbnQhICovXG5cdERJUlM6IHtcblx0XHRcIjRcIjogW1xuXHRcdFx0WyAwLCAtMV0sXG5cdFx0XHRbIDEsICAwXSxcblx0XHRcdFsgMCwgIDFdLFxuXHRcdFx0Wy0xLCAgMF1cblx0XHRdLFxuXHRcdFwiOFwiOiBbXG5cdFx0XHRbIDAsIC0xXSxcblx0XHRcdFsgMSwgLTFdLFxuXHRcdFx0WyAxLCAgMF0sXG5cdFx0XHRbIDEsICAxXSxcblx0XHRcdFsgMCwgIDFdLFxuXHRcdFx0Wy0xLCAgMV0sXG5cdFx0XHRbLTEsICAwXSxcblx0XHRcdFstMSwgLTFdXG5cdFx0XSxcblx0XHRcIjZcIjogW1xuXHRcdFx0Wy0xLCAtMV0sXG5cdFx0XHRbIDEsIC0xXSxcblx0XHRcdFsgMiwgIDBdLFxuXHRcdFx0WyAxLCAgMV0sXG5cdFx0XHRbLTEsICAxXSxcblx0XHRcdFstMiwgIDBdXG5cdFx0XVxuXHR9LFxuXG5cdC8qKiBDYW5jZWwga2V5LiAqL1xuXHRWS19DQU5DRUw6IDMsIFxuXHQvKiogSGVscCBrZXkuICovXG5cdFZLX0hFTFA6IDYsIFxuXHQvKiogQmFja3NwYWNlIGtleS4gKi9cblx0VktfQkFDS19TUEFDRTogOCwgXG5cdC8qKiBUYWIga2V5LiAqL1xuXHRWS19UQUI6IDksIFxuXHQvKiogNSBrZXkgb24gTnVtcGFkIHdoZW4gTnVtTG9jayBpcyB1bmxvY2tlZC4gT3Igb24gTWFjLCBjbGVhciBrZXkgd2hpY2ggaXMgcG9zaXRpb25lZCBhdCBOdW1Mb2NrIGtleS4gKi9cblx0VktfQ0xFQVI6IDEyLCBcblx0LyoqIFJldHVybi9lbnRlciBrZXkgb24gdGhlIG1haW4ga2V5Ym9hcmQuICovXG5cdFZLX1JFVFVSTjogMTMsIFxuXHQvKiogUmVzZXJ2ZWQsIGJ1dCBub3QgdXNlZC4gKi9cblx0VktfRU5URVI6IDE0LCBcblx0LyoqIFNoaWZ0IGtleS4gKi9cblx0VktfU0hJRlQ6IDE2LCBcblx0LyoqIENvbnRyb2wga2V5LiAqL1xuXHRWS19DT05UUk9MOiAxNywgXG5cdC8qKiBBbHQgKE9wdGlvbiBvbiBNYWMpIGtleS4gKi9cblx0VktfQUxUOiAxOCwgXG5cdC8qKiBQYXVzZSBrZXkuICovXG5cdFZLX1BBVVNFOiAxOSwgXG5cdC8qKiBDYXBzIGxvY2suICovXG5cdFZLX0NBUFNfTE9DSzogMjAsIFxuXHQvKiogRXNjYXBlIGtleS4gKi9cblx0VktfRVNDQVBFOiAyNywgXG5cdC8qKiBTcGFjZSBiYXIuICovXG5cdFZLX1NQQUNFOiAzMiwgXG5cdC8qKiBQYWdlIFVwIGtleS4gKi9cblx0VktfUEFHRV9VUDogMzMsIFxuXHQvKiogUGFnZSBEb3duIGtleS4gKi9cblx0VktfUEFHRV9ET1dOOiAzNCwgXG5cdC8qKiBFbmQga2V5LiAqL1xuXHRWS19FTkQ6IDM1LCBcblx0LyoqIEhvbWUga2V5LiAqL1xuXHRWS19IT01FOiAzNiwgXG5cdC8qKiBMZWZ0IGFycm93LiAqL1xuXHRWS19MRUZUOiAzNywgXG5cdC8qKiBVcCBhcnJvdy4gKi9cblx0VktfVVA6IDM4LCBcblx0LyoqIFJpZ2h0IGFycm93LiAqL1xuXHRWS19SSUdIVDogMzksIFxuXHQvKiogRG93biBhcnJvdy4gKi9cblx0VktfRE9XTjogNDAsIFxuXHQvKiogUHJpbnQgU2NyZWVuIGtleS4gKi9cblx0VktfUFJJTlRTQ1JFRU46IDQ0LCBcblx0LyoqIElucyhlcnQpIGtleS4gKi9cblx0VktfSU5TRVJUOiA0NSwgXG5cdC8qKiBEZWwoZXRlKSBrZXkuICovXG5cdFZLX0RFTEVURTogNDYsIFxuXHQvKioqL1xuXHRWS18wOiA0OCxcblx0LyoqKi9cblx0VktfMTogNDksXG5cdC8qKiovXG5cdFZLXzI6IDUwLFxuXHQvKioqL1xuXHRWS18zOiA1MSxcblx0LyoqKi9cblx0VktfNDogNTIsXG5cdC8qKiovXG5cdFZLXzU6IDUzLFxuXHQvKioqL1xuXHRWS182OiA1NCxcblx0LyoqKi9cblx0VktfNzogNTUsXG5cdC8qKiovXG5cdFZLXzg6IDU2LFxuXHQvKioqL1xuXHRWS185OiA1Nyxcblx0LyoqIENvbG9uICg6KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQ09MT046IDU4LCBcblx0LyoqIFNlbWljb2xvbiAoOykga2V5LiAqL1xuXHRWS19TRU1JQ09MT046IDU5LCBcblx0LyoqIExlc3MtdGhhbiAoPCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX0xFU1NfVEhBTjogNjAsIFxuXHQvKiogRXF1YWxzICg9KSBrZXkuICovXG5cdFZLX0VRVUFMUzogNjEsIFxuXHQvKiogR3JlYXRlci10aGFuICg+KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfR1JFQVRFUl9USEFOOiA2MiwgXG5cdC8qKiBRdWVzdGlvbiBtYXJrICg/KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfUVVFU1RJT05fTUFSSzogNjMsIFxuXHQvKiogQXRtYXJrIChAKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQVQ6IDY0LCBcblx0LyoqKi9cblx0VktfQTogNjUsXG5cdC8qKiovXG5cdFZLX0I6IDY2LFxuXHQvKioqL1xuXHRWS19DOiA2Nyxcblx0LyoqKi9cblx0VktfRDogNjgsXG5cdC8qKiovXG5cdFZLX0U6IDY5LFxuXHQvKioqL1xuXHRWS19GOiA3MCxcblx0LyoqKi9cblx0VktfRzogNzEsXG5cdC8qKiovXG5cdFZLX0g6IDcyLFxuXHQvKioqL1xuXHRWS19JOiA3Myxcblx0LyoqKi9cblx0VktfSjogNzQsXG5cdC8qKiovXG5cdFZLX0s6IDc1LFxuXHQvKioqL1xuXHRWS19MOiA3Nixcblx0LyoqKi9cblx0VktfTTogNzcsXG5cdC8qKiovXG5cdFZLX046IDc4LFxuXHQvKioqL1xuXHRWS19POiA3OSxcblx0LyoqKi9cblx0VktfUDogODAsXG5cdC8qKiovXG5cdFZLX1E6IDgxLFxuXHQvKioqL1xuXHRWS19SOiA4Mixcblx0LyoqKi9cblx0VktfUzogODMsXG5cdC8qKiovXG5cdFZLX1Q6IDg0LFxuXHQvKioqL1xuXHRWS19VOiA4NSxcblx0LyoqKi9cblx0VktfVjogODYsXG5cdC8qKiovXG5cdFZLX1c6IDg3LFxuXHQvKioqL1xuXHRWS19YOiA4OCxcblx0LyoqKi9cblx0VktfWTogODksXG5cdC8qKiovXG5cdFZLX1o6IDkwLFxuXHQvKioqL1xuXHRWS19DT05URVhUX01FTlU6IDkzLFxuXHQvKiogMCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG5cdFZLX05VTVBBRDA6IDk2LCBcblx0LyoqIDEgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuXHRWS19OVU1QQUQxOiA5NywgXG5cdC8qKiAyIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cblx0VktfTlVNUEFEMjogOTgsIFxuXHQvKiogMyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG5cdFZLX05VTVBBRDM6IDk5LCBcblx0LyoqIDQgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuXHRWS19OVU1QQUQ0OiAxMDAsIFxuXHQvKiogNSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG5cdFZLX05VTVBBRDU6IDEwMSwgXG5cdC8qKiA2IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cblx0VktfTlVNUEFENjogMTAyLCBcblx0LyoqIDcgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuXHRWS19OVU1QQUQ3OiAxMDMsIFxuXHQvKiogOCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG5cdFZLX05VTVBBRDg6IDEwNCwgXG5cdC8qKiA5IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cblx0VktfTlVNUEFEOTogMTA1LCBcblx0LyoqICogb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuXHRWS19NVUxUSVBMWTogMTA2LFxuXHQvKiogKyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG5cdFZLX0FERDogMTA3LCBcblx0LyoqKi9cblx0VktfU0VQQVJBVE9SOiAxMDgsXG5cdC8qKiAtIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cblx0VktfU1VCVFJBQ1Q6IDEwOSwgXG5cdC8qKiBEZWNpbWFsIHBvaW50IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cblx0VktfREVDSU1BTDogMTEwLCBcblx0LyoqIC8gb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuXHRWS19ESVZJREU6IDExMSwgXG5cdC8qKiBGMSBrZXkuICovXG5cdFZLX0YxOiAxMTIsIFxuXHQvKiogRjIga2V5LiAqL1xuXHRWS19GMjogMTEzLCBcblx0LyoqIEYzIGtleS4gKi9cblx0VktfRjM6IDExNCwgXG5cdC8qKiBGNCBrZXkuICovXG5cdFZLX0Y0OiAxMTUsIFxuXHQvKiogRjUga2V5LiAqL1xuXHRWS19GNTogMTE2LCBcblx0LyoqIEY2IGtleS4gKi9cblx0VktfRjY6IDExNywgXG5cdC8qKiBGNyBrZXkuICovXG5cdFZLX0Y3OiAxMTgsIFxuXHQvKiogRjgga2V5LiAqL1xuXHRWS19GODogMTE5LCBcblx0LyoqIEY5IGtleS4gKi9cblx0VktfRjk6IDEyMCwgXG5cdC8qKiBGMTAga2V5LiAqL1xuXHRWS19GMTA6IDEyMSwgXG5cdC8qKiBGMTEga2V5LiAqL1xuXHRWS19GMTE6IDEyMiwgXG5cdC8qKiBGMTIga2V5LiAqL1xuXHRWS19GMTI6IDEyMywgXG5cdC8qKiBGMTMga2V5LiAqL1xuXHRWS19GMTM6IDEyNCwgXG5cdC8qKiBGMTQga2V5LiAqL1xuXHRWS19GMTQ6IDEyNSwgXG5cdC8qKiBGMTUga2V5LiAqL1xuXHRWS19GMTU6IDEyNiwgXG5cdC8qKiBGMTYga2V5LiAqL1xuXHRWS19GMTY6IDEyNywgXG5cdC8qKiBGMTcga2V5LiAqL1xuXHRWS19GMTc6IDEyOCwgXG5cdC8qKiBGMTgga2V5LiAqL1xuXHRWS19GMTg6IDEyOSwgXG5cdC8qKiBGMTkga2V5LiAqL1xuXHRWS19GMTk6IDEzMCwgXG5cdC8qKiBGMjAga2V5LiAqL1xuXHRWS19GMjA6IDEzMSwgXG5cdC8qKiBGMjEga2V5LiAqL1xuXHRWS19GMjE6IDEzMiwgXG5cdC8qKiBGMjIga2V5LiAqL1xuXHRWS19GMjI6IDEzMywgXG5cdC8qKiBGMjMga2V5LiAqL1xuXHRWS19GMjM6IDEzNCwgXG5cdC8qKiBGMjQga2V5LiAqL1xuXHRWS19GMjQ6IDEzNSwgXG5cdC8qKiBOdW0gTG9jayBrZXkuICovXG5cdFZLX05VTV9MT0NLOiAxNDQsIFxuXHQvKiogU2Nyb2xsIExvY2sga2V5LiAqL1xuXHRWS19TQ1JPTExfTE9DSzogMTQ1LCBcblx0LyoqIENpcmN1bWZsZXggKF4pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19DSVJDVU1GTEVYOiAxNjAsIFxuXHQvKiogRXhjbGFtYXRpb24gKCEpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19FWENMQU1BVElPTjogMTYxLCBcblx0LyoqIERvdWJsZSBxdW90ZSAoKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfRE9VQkxFX1FVT1RFOiAxNjIsIFxuXHQvKiogSGFzaCAoIykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX0hBU0g6IDE2MywgXG5cdC8qKiBEb2xsYXIgc2lnbiAoJCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX0RPTExBUjogMTY0LCBcblx0LyoqIFBlcmNlbnQgKCUpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19QRVJDRU5UOiAxNjUsIFxuXHQvKiogQW1wZXJzYW5kICgmKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQU1QRVJTQU5EOiAxNjYsIFxuXHQvKiogVW5kZXJzY29yZSAoXykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX1VOREVSU0NPUkU6IDE2NywgXG5cdC8qKiBPcGVuIHBhcmVudGhlc2lzICgoKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfT1BFTl9QQVJFTjogMTY4LCBcblx0LyoqIENsb3NlIHBhcmVudGhlc2lzICgpKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQ0xPU0VfUEFSRU46IDE2OSwgXG5cdC8qIEFzdGVyaXNrICgqKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQVNURVJJU0s6IDE3MCxcblx0LyoqIFBsdXMgKCspIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19QTFVTOiAxNzEsIFxuXHQvKiogUGlwZSAofCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX1BJUEU6IDE3MiwgXG5cdC8qKiBIeXBoZW4tVVMvZG9jcy9NaW51cyAoLSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX0hZUEhFTl9NSU5VUzogMTczLCBcblx0LyoqIE9wZW4gY3VybHkgYnJhY2tldCAoeykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX09QRU5fQ1VSTFlfQlJBQ0tFVDogMTc0LCBcblx0LyoqIENsb3NlIGN1cmx5IGJyYWNrZXQgKH0pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19DTE9TRV9DVVJMWV9CUkFDS0VUOiAxNzUsIFxuXHQvKiogVGlsZGUgKH4pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19USUxERTogMTc2LCBcblx0LyoqIENvbW1hICgsKSBrZXkuICovXG5cdFZLX0NPTU1BOiAxODgsIFxuXHQvKiogUGVyaW9kICguKSBrZXkuICovXG5cdFZLX1BFUklPRDogMTkwLCBcblx0LyoqIFNsYXNoICgvKSBrZXkuICovXG5cdFZLX1NMQVNIOiAxOTEsIFxuXHQvKiogQmFjayB0aWNrIChgKSBrZXkuICovXG5cdFZLX0JBQ0tfUVVPVEU6IDE5MiwgXG5cdC8qKiBPcGVuIHNxdWFyZSBicmFja2V0IChbKSBrZXkuICovXG5cdFZLX09QRU5fQlJBQ0tFVDogMjE5LCBcblx0LyoqIEJhY2sgc2xhc2ggKFxcKSBrZXkuICovXG5cdFZLX0JBQ0tfU0xBU0g6IDIyMCwgXG5cdC8qKiBDbG9zZSBzcXVhcmUgYnJhY2tldCAoXSkga2V5LiAqL1xuXHRWS19DTE9TRV9CUkFDS0VUOiAyMjEsIFxuXHQvKiogUXVvdGUgKCcnJykga2V5LiAqL1xuXHRWS19RVU9URTogMjIyLCBcblx0LyoqIE1ldGEga2V5IG9uIExpbnV4LCBDb21tYW5kIGtleSBvbiBNYWMuICovXG5cdFZLX01FVEE6IDIyNCwgXG5cdC8qKiBBbHRHciBrZXkgb24gTGludXguIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQUxUR1I6IDIyNSwgXG5cdC8qKiBXaW5kb3dzIGxvZ28ga2V5IG9uIFdpbmRvd3MuIE9yIFN1cGVyIG9yIEh5cGVyIGtleSBvbiBMaW51eC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19XSU46IDkxLCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuXHRWS19LQU5BOiAyMSwgXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cblx0VktfSEFOR1VMOiAyMSwgXG5cdC8qKiDoi7HmlbAga2V5IG9uIEphcGFuZXNlIE1hYyBrZXlib2FyZC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19FSVNVOiAyMiwgXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cblx0VktfSlVOSkE6IDIzLCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuXHRWS19GSU5BTDogMjQsIFxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG5cdFZLX0hBTkpBOiAyNSwgXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cblx0VktfS0FOSkk6IDI1LCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuXHRWS19DT05WRVJUOiAyOCwgXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cblx0VktfTk9OQ09OVkVSVDogMjksIFxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG5cdFZLX0FDQ0VQVDogMzAsIFxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG5cdFZLX01PREVDSEFOR0U6IDMxLCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuXHRWS19TRUxFQ1Q6IDQxLCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuXHRWS19QUklOVDogNDIsIFxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG5cdFZLX0VYRUNVVEU6IDQzLCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLlx0ICovXG5cdFZLX1NMRUVQOiA5NSBcbn07XG4vKipcbiAqIEBuYW1lc3BhY2VcbiAqIENvbnRhaW5zIHRleHQgdG9rZW5pemF0aW9uIGFuZCBicmVha2luZyByb3V0aW5lc1xuICovXG5ST1QuVGV4dCA9IHtcblx0UkVfQ09MT1JTOiAvJShbYmNdKXsoW159XSopfS9nLFxuXG5cdC8qIHRva2VuIHR5cGVzICovXG5cdFRZUEVfVEVYVDpcdFx0MCxcblx0VFlQRV9ORVdMSU5FOlx0MSxcblx0VFlQRV9GRzpcdFx0Mixcblx0VFlQRV9CRzpcdFx0MyxcblxuXHQvKipcblx0ICogTWVhc3VyZSBzaXplIG9mIGEgcmVzdWx0aW5nIHRleHQgYmxvY2tcblx0ICovXG5cdG1lYXN1cmU6IGZ1bmN0aW9uKHN0ciwgbWF4V2lkdGgpIHtcblx0XHR2YXIgcmVzdWx0ID0ge3dpZHRoOjAsIGhlaWdodDoxfTtcblx0XHR2YXIgdG9rZW5zID0gdGhpcy50b2tlbml6ZShzdHIsIG1heFdpZHRoKTtcblx0XHR2YXIgbGluZVdpZHRoID0gMDtcblxuXHRcdGZvciAodmFyIGk9MDtpPHRva2Vucy5sZW5ndGg7aSsrKSB7XG5cdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbaV07XG5cdFx0XHRzd2l0Y2ggKHRva2VuLnR5cGUpIHtcblx0XHRcdFx0Y2FzZSB0aGlzLlRZUEVfVEVYVDpcblx0XHRcdFx0XHRsaW5lV2lkdGggKz0gdG9rZW4udmFsdWUubGVuZ3RoO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIHRoaXMuVFlQRV9ORVdMSU5FOlxuXHRcdFx0XHRcdHJlc3VsdC5oZWlnaHQrKztcblx0XHRcdFx0XHRyZXN1bHQud2lkdGggPSBNYXRoLm1heChyZXN1bHQud2lkdGgsIGxpbmVXaWR0aCk7XG5cdFx0XHRcdFx0bGluZVdpZHRoID0gMDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJlc3VsdC53aWR0aCA9IE1hdGgubWF4KHJlc3VsdC53aWR0aCwgbGluZVdpZHRoKTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENvbnZlcnQgc3RyaW5nIHRvIGEgc2VyaWVzIG9mIGEgZm9ybWF0dGluZyBjb21tYW5kc1xuXHQgKi9cblx0dG9rZW5pemU6IGZ1bmN0aW9uKHN0ciwgbWF4V2lkdGgpIHtcblx0XHR2YXIgcmVzdWx0ID0gW107XG5cblx0XHQvKiBmaXJzdCB0b2tlbml6YXRpb24gcGFzcyAtIHNwbGl0IHRleHRzIGFuZCBjb2xvciBmb3JtYXR0aW5nIGNvbW1hbmRzICovXG5cdFx0dmFyIG9mZnNldCA9IDA7XG5cdFx0c3RyLnJlcGxhY2UodGhpcy5SRV9DT0xPUlMsIGZ1bmN0aW9uKG1hdGNoLCB0eXBlLCBuYW1lLCBpbmRleCkge1xuXHRcdFx0Lyogc3RyaW5nIGJlZm9yZSAqL1xuXHRcdFx0dmFyIHBhcnQgPSBzdHIuc3Vic3RyaW5nKG9mZnNldCwgaW5kZXgpO1xuXHRcdFx0aWYgKHBhcnQubGVuZ3RoKSB7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKHtcblx0XHRcdFx0XHR0eXBlOiBST1QuVGV4dC5UWVBFX1RFWFQsXG5cdFx0XHRcdFx0dmFsdWU6IHBhcnRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qIGNvbG9yIGNvbW1hbmQgKi9cblx0XHRcdHJlc3VsdC5wdXNoKHtcblx0XHRcdFx0dHlwZTogKHR5cGUgPT0gXCJjXCIgPyBST1QuVGV4dC5UWVBFX0ZHIDogUk9ULlRleHQuVFlQRV9CRyksXG5cdFx0XHRcdHZhbHVlOiBuYW1lLnRyaW0oKVxuXHRcdFx0fSk7XG5cblx0XHRcdG9mZnNldCA9IGluZGV4ICsgbWF0Y2gubGVuZ3RoO1xuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fSk7XG5cblx0XHQvKiBsYXN0IHJlbWFpbmluZyBwYXJ0ICovXG5cdFx0dmFyIHBhcnQgPSBzdHIuc3Vic3RyaW5nKG9mZnNldCk7XG5cdFx0aWYgKHBhcnQubGVuZ3RoKSB7XG5cdFx0XHRyZXN1bHQucHVzaCh7XG5cdFx0XHRcdHR5cGU6IFJPVC5UZXh0LlRZUEVfVEVYVCxcblx0XHRcdFx0dmFsdWU6IHBhcnRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9icmVha0xpbmVzKHJlc3VsdCwgbWF4V2lkdGgpO1xuXHR9LFxuXG5cdC8qIGluc2VydCBsaW5lIGJyZWFrcyBpbnRvIGZpcnN0LXBhc3MgdG9rZW5pemVkIGRhdGEgKi9cblx0X2JyZWFrTGluZXM6IGZ1bmN0aW9uKHRva2VucywgbWF4V2lkdGgpIHtcblx0XHRpZiAoIW1heFdpZHRoKSB7IG1heFdpZHRoID0gSW5maW5pdHk7IH1cblxuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgbGluZUxlbmd0aCA9IDA7XG5cdFx0dmFyIGxhc3RUb2tlbldpdGhTcGFjZSA9IC0xO1xuXG5cdFx0d2hpbGUgKGkgPCB0b2tlbnMubGVuZ3RoKSB7IC8qIHRha2UgYWxsIHRleHQgdG9rZW5zLCByZW1vdmUgc3BhY2UsIGFwcGx5IGxpbmVicmVha3MgKi9cblx0XHRcdHZhciB0b2tlbiA9IHRva2Vuc1tpXTtcblx0XHRcdGlmICh0b2tlbi50eXBlID09IFJPVC5UZXh0LlRZUEVfTkVXTElORSkgeyAvKiByZXNldCAqL1xuXHRcdFx0XHRsaW5lTGVuZ3RoID0gMDsgXG5cdFx0XHRcdGxhc3RUb2tlbldpdGhTcGFjZSA9IC0xO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRva2VuLnR5cGUgIT0gUk9ULlRleHQuVFlQRV9URVhUKSB7IC8qIHNraXAgbm9uLXRleHQgdG9rZW5zICovXG5cdFx0XHRcdGkrKztcblx0XHRcdFx0Y29udGludWU7IFxuXHRcdFx0fVxuXG5cdFx0XHQvKiByZW1vdmUgc3BhY2VzIGF0IHRoZSBiZWdpbm5pbmcgb2YgbGluZSAqL1xuXHRcdFx0d2hpbGUgKGxpbmVMZW5ndGggPT0gMCAmJiB0b2tlbi52YWx1ZS5jaGFyQXQoMCkgPT0gXCIgXCIpIHsgdG9rZW4udmFsdWUgPSB0b2tlbi52YWx1ZS5zdWJzdHJpbmcoMSk7IH1cblxuXHRcdFx0LyogZm9yY2VkIG5ld2xpbmU/IGluc2VydCB0d28gbmV3IHRva2VucyBhZnRlciB0aGlzIG9uZSAqL1xuXHRcdFx0dmFyIGluZGV4ID0gdG9rZW4udmFsdWUuaW5kZXhPZihcIlxcblwiKTtcblx0XHRcdGlmIChpbmRleCAhPSAtMSkgeyBcblx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgaSwgaW5kZXgsIHRydWUpOyBcblxuXHRcdFx0XHQvKiBpZiB0aGVyZSBhcmUgc3BhY2VzIGF0IHRoZSBlbmQsIHdlIG11c3QgcmVtb3ZlIHRoZW0gKHdlIGRvIG5vdCB3YW50IHRoZSBsaW5lIHRvbyBsb25nKSAqL1xuXHRcdFx0XHR2YXIgYXJyID0gdG9rZW4udmFsdWUuc3BsaXQoXCJcIik7XG5cdFx0XHRcdHdoaWxlIChhcnIubGVuZ3RoICYmIGFyclthcnIubGVuZ3RoLTFdID09IFwiIFwiKSB7IGFyci5wb3AoKTsgfVxuXHRcdFx0XHR0b2tlbi52YWx1ZSA9IGFyci5qb2luKFwiXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHQvKiB0b2tlbiBkZWdlbmVyYXRlZD8gKi9cblx0XHRcdGlmICghdG9rZW4udmFsdWUubGVuZ3RoKSB7XG5cdFx0XHRcdHRva2Vucy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobGluZUxlbmd0aCArIHRva2VuLnZhbHVlLmxlbmd0aCA+IG1heFdpZHRoKSB7IC8qIGxpbmUgdG9vIGxvbmcsIGZpbmQgYSBzdWl0YWJsZSBicmVha2luZyBzcG90ICovXG5cblx0XHRcdFx0LyogaXMgaXQgcG9zc2libGUgdG8gYnJlYWsgd2l0aGluIHRoaXMgdG9rZW4/ICovXG5cdFx0XHRcdHZhciBpbmRleCA9IC0xO1xuXHRcdFx0XHR3aGlsZSAoMSkge1xuXHRcdFx0XHRcdHZhciBuZXh0SW5kZXggPSB0b2tlbi52YWx1ZS5pbmRleE9mKFwiIFwiLCBpbmRleCsxKTtcblx0XHRcdFx0XHRpZiAobmV4dEluZGV4ID09IC0xKSB7IGJyZWFrOyB9XG5cdFx0XHRcdFx0aWYgKGxpbmVMZW5ndGggKyBuZXh0SW5kZXggPiBtYXhXaWR0aCkgeyBicmVhazsgfVxuXHRcdFx0XHRcdGluZGV4ID0gbmV4dEluZGV4O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGluZGV4ICE9IC0xKSB7IC8qIGJyZWFrIGF0IHNwYWNlIHdpdGhpbiB0aGlzIG9uZSAqL1xuXHRcdFx0XHRcdHRva2VuLnZhbHVlID0gdGhpcy5fYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGksIGluZGV4LCB0cnVlKTtcblx0XHRcdFx0fSBlbHNlIGlmIChsYXN0VG9rZW5XaXRoU3BhY2UgIT0gLTEpIHsgLyogaXMgdGhlcmUgYSBwcmV2aW91cyB0b2tlbiB3aGVyZSBhIGJyZWFrIGNhbiBvY2N1cj8gKi9cblx0XHRcdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbbGFzdFRva2VuV2l0aFNwYWNlXTtcblx0XHRcdFx0XHR2YXIgYnJlYWtJbmRleCA9IHRva2VuLnZhbHVlLmxhc3RJbmRleE9mKFwiIFwiKTtcblx0XHRcdFx0XHR0b2tlbi52YWx1ZSA9IHRoaXMuX2JyZWFrSW5zaWRlVG9rZW4odG9rZW5zLCBsYXN0VG9rZW5XaXRoU3BhY2UsIGJyZWFrSW5kZXgsIHRydWUpO1xuXHRcdFx0XHRcdGkgPSBsYXN0VG9rZW5XaXRoU3BhY2U7XG5cdFx0XHRcdH0gZWxzZSB7IC8qIGZvcmNlIGJyZWFrIGluIHRoaXMgdG9rZW4gKi9cblx0XHRcdFx0XHR0b2tlbi52YWx1ZSA9IHRoaXMuX2JyZWFrSW5zaWRlVG9rZW4odG9rZW5zLCBpLCBtYXhXaWR0aC1saW5lTGVuZ3RoLCBmYWxzZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHsgLyogbGluZSBub3QgbG9uZywgY29udGludWUgKi9cblx0XHRcdFx0bGluZUxlbmd0aCArPSB0b2tlbi52YWx1ZS5sZW5ndGg7XG5cdFx0XHRcdGlmICh0b2tlbi52YWx1ZS5pbmRleE9mKFwiIFwiKSAhPSAtMSkgeyBsYXN0VG9rZW5XaXRoU3BhY2UgPSBpOyB9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGkrKzsgLyogYWR2YW5jZSB0byBuZXh0IHRva2VuICovXG5cdFx0fVxuXG5cblx0XHR0b2tlbnMucHVzaCh7dHlwZTogUk9ULlRleHQuVFlQRV9ORVdMSU5FfSk7IC8qIGluc2VydCBmYWtlIG5ld2xpbmUgdG8gZml4IHRoZSBsYXN0IHRleHQgbGluZSAqL1xuXG5cdFx0LyogcmVtb3ZlIHRyYWlsaW5nIHNwYWNlIGZyb20gdGV4dCB0b2tlbnMgYmVmb3JlIG5ld2xpbmVzICovXG5cdFx0dmFyIGxhc3RUZXh0VG9rZW4gPSBudWxsO1xuXHRcdGZvciAodmFyIGk9MDtpPHRva2Vucy5sZW5ndGg7aSsrKSB7XG5cdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbaV07XG5cdFx0XHRzd2l0Y2ggKHRva2VuLnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX1RFWFQ6IGxhc3RUZXh0VG9rZW4gPSB0b2tlbjsgYnJlYWs7XG5cdFx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9ORVdMSU5FOiBcblx0XHRcdFx0XHRpZiAobGFzdFRleHRUb2tlbikgeyAvKiByZW1vdmUgdHJhaWxpbmcgc3BhY2UgKi9cblx0XHRcdFx0XHRcdHZhciBhcnIgPSBsYXN0VGV4dFRva2VuLnZhbHVlLnNwbGl0KFwiXCIpO1xuXHRcdFx0XHRcdFx0d2hpbGUgKGFyci5sZW5ndGggJiYgYXJyW2Fyci5sZW5ndGgtMV0gPT0gXCIgXCIpIHsgYXJyLnBvcCgpOyB9XG5cdFx0XHRcdFx0XHRsYXN0VGV4dFRva2VuLnZhbHVlID0gYXJyLmpvaW4oXCJcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGxhc3RUZXh0VG9rZW4gPSBudWxsO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0b2tlbnMucG9wKCk7IC8qIHJlbW92ZSBmYWtlIHRva2VuICovXG5cblx0XHRyZXR1cm4gdG9rZW5zO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgbmV3IHRva2VucyBhbmQgaW5zZXJ0IHRoZW0gaW50byB0aGUgc3RyZWFtXG5cdCAqIEBwYXJhbSB7b2JqZWN0W119IHRva2Vuc1xuXHQgKiBAcGFyYW0ge2ludH0gdG9rZW5JbmRleCBUb2tlbiBiZWluZyBwcm9jZXNzZWRcblx0ICogQHBhcmFtIHtpbnR9IGJyZWFrSW5kZXggSW5kZXggd2l0aGluIGN1cnJlbnQgdG9rZW4ncyB2YWx1ZVxuXHQgKiBAcGFyYW0ge2Jvb2x9IHJlbW92ZUJyZWFrQ2hhciBEbyB3ZSB3YW50IHRvIHJlbW92ZSB0aGUgYnJlYWtpbmcgY2hhcmFjdGVyP1xuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSByZW1haW5pbmcgdW5icm9rZW4gdG9rZW4gdmFsdWVcblx0ICovXG5cdF9icmVha0luc2lkZVRva2VuOiBmdW5jdGlvbih0b2tlbnMsIHRva2VuSW5kZXgsIGJyZWFrSW5kZXgsIHJlbW92ZUJyZWFrQ2hhcikge1xuXHRcdHZhciBuZXdCcmVha1Rva2VuID0ge1xuXHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9ORVdMSU5FXG5cdFx0fTtcblx0XHR2YXIgbmV3VGV4dFRva2VuID0ge1xuXHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9URVhULFxuXHRcdFx0dmFsdWU6IHRva2Vuc1t0b2tlbkluZGV4XS52YWx1ZS5zdWJzdHJpbmcoYnJlYWtJbmRleCArIChyZW1vdmVCcmVha0NoYXIgPyAxIDogMCkpXG5cdFx0fTtcblx0XHR0b2tlbnMuc3BsaWNlKHRva2VuSW5kZXgrMSwgMCwgbmV3QnJlYWtUb2tlbiwgbmV3VGV4dFRva2VuKTtcblx0XHRyZXR1cm4gdG9rZW5zW3Rva2VuSW5kZXhdLnZhbHVlLnN1YnN0cmluZygwLCBicmVha0luZGV4KTtcblx0fVxufTtcbi8qKlxuICogQHJldHVybnMge2FueX0gUmFuZG9tbHkgcGlja2VkIGl0ZW0sIG51bGwgd2hlbiBsZW5ndGg9MFxuICovXG5BcnJheS5wcm90b3R5cGUucmFuZG9tID0gQXJyYXkucHJvdG90eXBlLnJhbmRvbSB8fCBmdW5jdGlvbigpIHtcblx0aWYgKCF0aGlzLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfVxuXHRyZXR1cm4gdGhpc1tNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogdGhpcy5sZW5ndGgpXTtcbn07XG5cbi8qKlxuICogQHJldHVybnMge2FycmF5fSBOZXcgYXJyYXkgd2l0aCByYW5kb21pemVkIGl0ZW1zXG4gKi9cbkFycmF5LnByb3RvdHlwZS5yYW5kb21pemUgPSBBcnJheS5wcm90b3R5cGUucmFuZG9taXplIHx8IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBjbG9uZSA9IHRoaXMuc2xpY2UoKTtcbiAgd2hpbGUgKGNsb25lLmxlbmd0aCkge1xuICAgIHZhciBpbmRleCA9IGNsb25lLmluZGV4T2YoY2xvbmUucmFuZG9tKCkpO1xuICAgIHJlc3VsdC5wdXNoKGNsb25lLnNwbGljZShpbmRleCwgMSlbMF0pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuLyoqXG4gKiBBbHdheXMgcG9zaXRpdmUgbW9kdWx1c1xuICogQHBhcmFtIHtpbnR9IG4gTW9kdWx1c1xuICogQHJldHVybnMge2ludH0gdGhpcyBtb2R1bG8gblxuICovXG5OdW1iZXIucHJvdG90eXBlLm1vZCA9IE51bWJlci5wcm90b3R5cGUubW9kIHx8IGZ1bmN0aW9uKG4pIHtcblx0cmV0dXJuICgodGhpcyVuKStuKSVuO1xufTtcbi8qKlxuICogQHJldHVybnMge3N0cmluZ30gRmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkXG4gKi9cblN0cmluZy5wcm90b3R5cGUuY2FwaXRhbGl6ZSA9IFN0cmluZy5wcm90b3R5cGUuY2FwaXRhbGl6ZSB8fCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnN1YnN0cmluZygxKTtcbn07XG5cbi8qKiBcbiAqIExlZnQgcGFkXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NoYXJhY3Rlcj1cIjBcIl1cbiAqIEBwYXJhbSB7aW50fSBbY291bnQ9Ml1cbiAqL1xuU3RyaW5nLnByb3RvdHlwZS5scGFkID0gU3RyaW5nLnByb3RvdHlwZS5scGFkIHx8IGZ1bmN0aW9uKGNoYXJhY3RlciwgY291bnQpIHtcblx0dmFyIGNoID0gY2hhcmFjdGVyIHx8IFwiMFwiO1xuXHR2YXIgY250ID0gY291bnQgfHwgMjtcblxuXHR2YXIgcyA9IFwiXCI7XG5cdHdoaWxlIChzLmxlbmd0aCA8IChjbnQgLSB0aGlzLmxlbmd0aCkpIHsgcyArPSBjaDsgfVxuXHRzID0gcy5zdWJzdHJpbmcoMCwgY250LXRoaXMubGVuZ3RoKTtcblx0cmV0dXJuIHMrdGhpcztcbn07XG5cbi8qKiBcbiAqIFJpZ2h0IHBhZFxuICogQHBhcmFtIHtzdHJpbmd9IFtjaGFyYWN0ZXI9XCIwXCJdXG4gKiBAcGFyYW0ge2ludH0gW2NvdW50PTJdXG4gKi9cblN0cmluZy5wcm90b3R5cGUucnBhZCA9IFN0cmluZy5wcm90b3R5cGUucnBhZCB8fCBmdW5jdGlvbihjaGFyYWN0ZXIsIGNvdW50KSB7XG5cdHZhciBjaCA9IGNoYXJhY3RlciB8fCBcIjBcIjtcblx0dmFyIGNudCA9IGNvdW50IHx8IDI7XG5cblx0dmFyIHMgPSBcIlwiO1xuXHR3aGlsZSAocy5sZW5ndGggPCAoY250IC0gdGhpcy5sZW5ndGgpKSB7IHMgKz0gY2g7IH1cblx0cyA9IHMuc3Vic3RyaW5nKDAsIGNudC10aGlzLmxlbmd0aCk7XG5cdHJldHVybiB0aGlzK3M7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBhIHN0cmluZyBpbiBhIGZsZXhpYmxlIHdheS4gU2NhbnMgZm9yICVzIHN0cmluZ3MgYW5kIHJlcGxhY2VzIHRoZW0gd2l0aCBhcmd1bWVudHMuIExpc3Qgb2YgcGF0dGVybnMgaXMgbW9kaWZpYWJsZSB2aWEgU3RyaW5nLmZvcm1hdC5tYXAuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVcbiAqIEBwYXJhbSB7YW55fSBbYXJndl1cbiAqL1xuU3RyaW5nLmZvcm1hdCA9IFN0cmluZy5mb3JtYXQgfHwgZnVuY3Rpb24odGVtcGxhdGUpIHtcblx0dmFyIG1hcCA9IFN0cmluZy5mb3JtYXQubWFwO1xuXHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cblx0dmFyIHJlcGxhY2VyID0gZnVuY3Rpb24obWF0Y2gsIGdyb3VwMSwgZ3JvdXAyLCBpbmRleCkge1xuXHRcdGlmICh0ZW1wbGF0ZS5jaGFyQXQoaW5kZXgtMSkgPT0gXCIlXCIpIHsgcmV0dXJuIG1hdGNoLnN1YnN0cmluZygxKTsgfVxuXHRcdGlmICghYXJncy5sZW5ndGgpIHsgcmV0dXJuIG1hdGNoOyB9XG5cdFx0dmFyIG9iaiA9IGFyZ3NbMF07XG5cblx0XHR2YXIgZ3JvdXAgPSBncm91cDEgfHwgZ3JvdXAyO1xuXHRcdHZhciBwYXJ0cyA9IGdyb3VwLnNwbGl0KFwiLFwiKTtcblx0XHR2YXIgbmFtZSA9IHBhcnRzLnNoaWZ0KCk7XG5cdFx0dmFyIG1ldGhvZCA9IG1hcFtuYW1lLnRvTG93ZXJDYXNlKCldO1xuXHRcdGlmICghbWV0aG9kKSB7IHJldHVybiBtYXRjaDsgfVxuXG5cdFx0dmFyIG9iaiA9IGFyZ3Muc2hpZnQoKTtcblx0XHR2YXIgcmVwbGFjZWQgPSBvYmpbbWV0aG9kXS5hcHBseShvYmosIHBhcnRzKTtcblxuXHRcdHZhciBmaXJzdCA9IG5hbWUuY2hhckF0KDApO1xuXHRcdGlmIChmaXJzdCAhPSBmaXJzdC50b0xvd2VyQ2FzZSgpKSB7IHJlcGxhY2VkID0gcmVwbGFjZWQuY2FwaXRhbGl6ZSgpOyB9XG5cblx0XHRyZXR1cm4gcmVwbGFjZWQ7XG5cdH07XG5cdHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKC8lKD86KFthLXpdKyl8KD86eyhbXn1dKyl9KSkvZ2ksIHJlcGxhY2VyKTtcbn07XG5cblN0cmluZy5mb3JtYXQubWFwID0gU3RyaW5nLmZvcm1hdC5tYXAgfHwge1xuXHRcInNcIjogXCJ0b1N0cmluZ1wiXG59O1xuXG4vKipcbiAqIENvbnZlbmllbmNlIHNob3J0Y3V0IHRvIFN0cmluZy5mb3JtYXQodGhpcylcbiAqL1xuU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgPSBTdHJpbmcucHJvdG90eXBlLmZvcm1hdCB8fCBmdW5jdGlvbigpIHtcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXHRhcmdzLnVuc2hpZnQodGhpcyk7XG5cdHJldHVybiBTdHJpbmcuZm9ybWF0LmFwcGx5KFN0cmluZywgYXJncyk7XG59O1xuXG5pZiAoIU9iamVjdC5jcmVhdGUpIHsgIFxuXHQvKipcblx0ICogRVM1IE9iamVjdC5jcmVhdGVcblx0ICovXG5cdE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbihvKSB7ICBcblx0XHR2YXIgdG1wID0gZnVuY3Rpb24oKSB7fTtcblx0XHR0bXAucHJvdG90eXBlID0gbztcblx0XHRyZXR1cm4gbmV3IHRtcCgpO1xuXHR9OyAgXG59ICBcbi8qKlxuICogU2V0cyBwcm90b3R5cGUgb2YgdGhpcyBmdW5jdGlvbiB0byBhbiBpbnN0YW5jZSBvZiBwYXJlbnQgZnVuY3Rpb25cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHBhcmVudFxuICovXG5GdW5jdGlvbi5wcm90b3R5cGUuZXh0ZW5kID0gRnVuY3Rpb24ucHJvdG90eXBlLmV4dGVuZCB8fCBmdW5jdGlvbihwYXJlbnQpIHtcblx0dGhpcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBhcmVudC5wcm90b3R5cGUpO1xuXHR0aGlzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHRoaXM7XG5cdHJldHVybiB0aGlzO1xufTtcbmlmICh0eXBlb2Ygd2luZG93ICE9IFwidW5kZWZpbmVkXCIpIHtcblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9XG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZVxuXHRcdHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcblx0XHR8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG5cdFx0fHwgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcblx0XHR8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcblx0XHR8fCBmdW5jdGlvbihjYikgeyByZXR1cm4gc2V0VGltZW91dChjYiwgMTAwMC82MCk7IH07XG5cblx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID1cblx0XHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWVcblx0XHR8fCB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWVcblx0XHR8fCB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWVcblx0XHR8fCB3aW5kb3cub0NhbmNlbEFuaW1hdGlvbkZyYW1lXG5cdFx0fHwgd2luZG93Lm1zQ2FuY2VsQW5pbWF0aW9uRnJhbWVcblx0XHR8fCBmdW5jdGlvbihpZCkgeyByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTsgfTtcbn1cbi8qKlxuICogQGNsYXNzIFZpc3VhbCBtYXAgZGlzcGxheVxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLndpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLmhlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMuZm9udFNpemU9MTVdXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZm9udEZhbWlseT1cIm1vbm9zcGFjZVwiXVxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmZvbnRTdHlsZT1cIlwiXSBib2xkL2l0YWxpYy9ub25lL2JvdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5mZz1cIiNjY2NcIl1cbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5iZz1cIiMwMDBcIl1cbiAqIEBwYXJhbSB7ZmxvYXR9IFtvcHRpb25zLnNwYWNpbmc9MV1cbiAqIEBwYXJhbSB7ZmxvYXR9IFtvcHRpb25zLmJvcmRlcj0wXVxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmxheW91dD1cInJlY3RcIl1cbiAqIEBwYXJhbSB7Ym9vbH0gW29wdGlvbnMuZm9yY2VTcXVhcmVSYXRpbz1mYWxzZV1cbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50aWxlV2lkdGg9MzJdXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudGlsZUhlaWdodD0zMl1cbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy50aWxlTWFwPXt9XVxuICogQHBhcmFtIHtpbWFnZX0gW29wdGlvbnMudGlsZVNldD1udWxsXVxuICogQHBhcmFtIHtpbWFnZX0gW29wdGlvbnMudGlsZUNvbG9yaXplPWZhbHNlXVxuICovXG5ST1QuRGlzcGxheSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cdHRoaXMuX2NvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHR0aGlzLl9kYXRhID0ge307XG5cdHRoaXMuX2RpcnR5ID0gZmFsc2U7IC8qIGZhbHNlID0gbm90aGluZywgdHJ1ZSA9IGFsbCwgb2JqZWN0ID0gZGlydHkgY2VsbHMgKi9cblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xuXHR0aGlzLl9iYWNrZW5kID0gbnVsbDtcblx0XG5cdHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcblx0XHR3aWR0aDogUk9ULkRFRkFVTFRfV0lEVEgsXG5cdFx0aGVpZ2h0OiBST1QuREVGQVVMVF9IRUlHSFQsXG5cdFx0dHJhbnNwb3NlOiBmYWxzZSxcblx0XHRsYXlvdXQ6IFwicmVjdFwiLFxuXHRcdGZvbnRTaXplOiAxNSxcblx0XHRzcGFjaW5nOiAxLFxuXHRcdGJvcmRlcjogMCxcblx0XHRmb3JjZVNxdWFyZVJhdGlvOiBmYWxzZSxcblx0XHRmb250RmFtaWx5OiBcIm1vbm9zcGFjZVwiLFxuXHRcdGZvbnRTdHlsZTogXCJcIixcblx0XHRmZzogXCIjY2NjXCIsXG5cdFx0Ymc6IFwiIzAwMFwiLFxuXHRcdHRpbGVXaWR0aDogMzIsXG5cdFx0dGlsZUhlaWdodDogMzIsXG5cdFx0dGlsZU1hcDoge30sXG5cdFx0dGlsZVNldDogbnVsbCxcblx0XHR0aWxlQ29sb3JpemU6IGZhbHNlLFxuXHRcdHRlcm1Db2xvcjogXCJ4dGVybVwiXG5cdH07XG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyBkZWZhdWx0T3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cblx0dGhpcy5zZXRPcHRpb25zKGRlZmF1bHRPcHRpb25zKTtcblx0dGhpcy5ERUJVRyA9IHRoaXMuREVCVUcuYmluZCh0aGlzKTtcblxuXHR0aGlzLl90aWNrID0gdGhpcy5fdGljay5iaW5kKHRoaXMpO1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fdGljayk7XG59O1xuXG4vKipcbiAqIERlYnVnIGhlbHBlciwgaWRlYWwgYXMgYSBtYXAgZ2VuZXJhdG9yIGNhbGxiYWNrLiBBbHdheXMgYm91bmQgdG8gdGhpcy5cbiAqIEBwYXJhbSB7aW50fSB4XG4gKiBAcGFyYW0ge2ludH0geVxuICogQHBhcmFtIHtpbnR9IHdoYXRcbiAqL1xuUk9ULkRpc3BsYXkucHJvdG90eXBlLkRFQlVHID0gZnVuY3Rpb24oeCwgeSwgd2hhdCkge1xuXHR2YXIgY29sb3JzID0gW3RoaXMuX29wdGlvbnMuYmcsIHRoaXMuX29wdGlvbnMuZmddO1xuXHR0aGlzLmRyYXcoeCwgeSwgbnVsbCwgbnVsbCwgY29sb3JzW3doYXQgJSBjb2xvcnMubGVuZ3RoXSk7XG59O1xuXG4vKipcbiAqIENsZWFyIHRoZSB3aG9sZSBkaXNwbGF5IChjb3ZlciBpdCB3aXRoIGJhY2tncm91bmQgY29sb3IpXG4gKi9cblJPVC5EaXNwbGF5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9kYXRhID0ge307XG5cdHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbn07XG5cbi8qKlxuICogQHNlZSBST1QuRGlzcGxheVxuICovXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XG5cdGlmIChvcHRpb25zLndpZHRoIHx8IG9wdGlvbnMuaGVpZ2h0IHx8IG9wdGlvbnMuZm9udFNpemUgfHwgb3B0aW9ucy5mb250RmFtaWx5IHx8IG9wdGlvbnMuc3BhY2luZyB8fCBvcHRpb25zLmxheW91dCkge1xuXHRcdGlmIChvcHRpb25zLmxheW91dCkgeyBcblx0XHRcdHRoaXMuX2JhY2tlbmQgPSBuZXcgUk9ULkRpc3BsYXlbb3B0aW9ucy5sYXlvdXQuY2FwaXRhbGl6ZSgpXSh0aGlzLl9jb250ZXh0KTtcblx0XHR9XG5cblx0XHR2YXIgZm9udCA9ICh0aGlzLl9vcHRpb25zLmZvbnRTdHlsZSA/IHRoaXMuX29wdGlvbnMuZm9udFN0eWxlICsgXCIgXCIgOiBcIlwiKSArIHRoaXMuX29wdGlvbnMuZm9udFNpemUgKyBcInB4IFwiICsgdGhpcy5fb3B0aW9ucy5mb250RmFtaWx5O1xuXHRcdHRoaXMuX2NvbnRleHQuZm9udCA9IGZvbnQ7XG5cdFx0dGhpcy5fYmFja2VuZC5jb21wdXRlKHRoaXMuX29wdGlvbnMpO1xuXHRcdHRoaXMuX2NvbnRleHQuZm9udCA9IGZvbnQ7XG5cdFx0dGhpcy5fY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuXHRcdHRoaXMuX2NvbnRleHQudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcblx0XHR0aGlzLl9kaXJ0eSA9IHRydWU7XG5cdH1cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybnMgY3VycmVudGx5IHNldCBvcHRpb25zXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBDdXJyZW50IG9wdGlvbnMgb2JqZWN0IFxuICovXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fb3B0aW9ucztcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgRE9NIG5vZGUgb2YgdGhpcyBkaXNwbGF5XG4gKiBAcmV0dXJucyB7bm9kZX0gRE9NIG5vZGVcbiAqL1xuUk9ULkRpc3BsYXkucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fY29udGV4dC5jYW52YXM7XG59O1xuXG4vKipcbiAqIENvbXB1dGUgdGhlIG1heGltdW0gd2lkdGgvaGVpZ2h0IHRvIGZpdCBpbnRvIGEgc2V0IG9mIGdpdmVuIGNvbnN0cmFpbnRzXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxXaWR0aCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgd2lkdGhcbiAqIEBwYXJhbSB7aW50fSBhdmFpbEhlaWdodCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgaGVpZ2h0XG4gKiBAcmV0dXJucyB7aW50WzJdfSBjZWxsV2lkdGgsY2VsbEhlaWdodFxuICovXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuXHRyZXR1cm4gdGhpcy5fYmFja2VuZC5jb21wdXRlU2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCwgdGhpcy5fb3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIENvbXB1dGUgdGhlIG1heGltdW0gZm9udCBzaXplIHRvIGZpdCBpbnRvIGEgc2V0IG9mIGdpdmVuIGNvbnN0cmFpbnRzXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxXaWR0aCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgd2lkdGhcbiAqIEBwYXJhbSB7aW50fSBhdmFpbEhlaWdodCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgaGVpZ2h0XG4gKiBAcmV0dXJucyB7aW50fSBmb250U2l6ZVxuICovXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcblx0cmV0dXJuIHRoaXMuX2JhY2tlbmQuY29tcHV0ZUZvbnRTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0LCB0aGlzLl9vcHRpb25zKTtcbn07XG5cbi8qKlxuICogQ29udmVydCBhIERPTSBldmVudCAobW91c2Ugb3IgdG91Y2gpIHRvIG1hcCBjb29yZGluYXRlcy4gVXNlcyBmaXJzdCB0b3VjaCBmb3IgbXVsdGktdG91Y2guXG4gKiBAcGFyYW0ge0V2ZW50fSBlIGV2ZW50XG4gKiBAcmV0dXJucyB7aW50WzJdfSAtMSBmb3IgdmFsdWVzIG91dHNpZGUgb2YgdGhlIGNhbnZhc1xuICovXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZXZlbnRUb1Bvc2l0aW9uID0gZnVuY3Rpb24oZSkge1xuXHRpZiAoZS50b3VjaGVzKSB7XG5cdFx0dmFyIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcblx0XHR2YXIgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZO1xuXHR9IGVsc2Uge1xuXHRcdHZhciB4ID0gZS5jbGllbnRYO1xuXHRcdHZhciB5ID0gZS5jbGllbnRZO1xuXHR9XG5cblx0dmFyIHJlY3QgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0eCAtPSByZWN0LmxlZnQ7XG5cdHkgLT0gcmVjdC50b3A7XG5cdFxuXHR4ICo9IHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoIC8gdGhpcy5fY29udGV4dC5jYW52YXMuY2xpZW50V2lkdGg7XG5cdHkgKj0gdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0IC8gdGhpcy5fY29udGV4dC5jYW52YXMuY2xpZW50SGVpZ2h0O1xuXG5cdGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoIHx8IHkgPj0gdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0KSB7IHJldHVybiBbLTEsIC0xXTsgfVxuXG5cdHJldHVybiB0aGlzLl9iYWNrZW5kLmV2ZW50VG9Qb3NpdGlvbih4LCB5KTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtpbnR9IHhcbiAqIEBwYXJhbSB7aW50fSB5XG4gKiBAcGFyYW0ge3N0cmluZyB8fCBzdHJpbmdbXX0gY2ggT25lIG9yIG1vcmUgY2hhcnMgKHdpbGwgYmUgb3ZlcmxhcHBpbmcgdGhlbXNlbHZlcylcbiAqIEBwYXJhbSB7c3RyaW5nfSBbZmddIGZvcmVncm91bmQgY29sb3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYmddIGJhY2tncm91bmQgY29sb3JcbiAqL1xuUk9ULkRpc3BsYXkucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbih4LCB5LCBjaCwgZmcsIGJnKSB7XG5cdGlmICghZmcpIHsgZmcgPSB0aGlzLl9vcHRpb25zLmZnOyB9XG5cdGlmICghYmcpIHsgYmcgPSB0aGlzLl9vcHRpb25zLmJnOyB9XG5cdHRoaXMuX2RhdGFbeCtcIixcIit5XSA9IFt4LCB5LCBjaCwgZmcsIGJnXTtcblx0XG5cdGlmICh0aGlzLl9kaXJ0eSA9PT0gdHJ1ZSkgeyByZXR1cm47IH0gLyogd2lsbCBhbHJlYWR5IHJlZHJhdyBldmVyeXRoaW5nICovXG5cdGlmICghdGhpcy5fZGlydHkpIHsgdGhpcy5fZGlydHkgPSB7fTsgfSAvKiBmaXJzdCEgKi9cblx0dGhpcy5fZGlydHlbeCtcIixcIit5XSA9IHRydWU7XG59O1xuXG4vKipcbiAqIERyYXdzIGEgdGV4dCBhdCBnaXZlbiBwb3NpdGlvbi4gT3B0aW9uYWxseSB3cmFwcyBhdCBhIG1heGltdW0gbGVuZ3RoLiBDdXJyZW50bHkgZG9lcyBub3Qgd29yayB3aXRoIGhleCBsYXlvdXQuXG4gKiBAcGFyYW0ge2ludH0geFxuICogQHBhcmFtIHtpbnR9IHlcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IE1heSBjb250YWluIGNvbG9yL2JhY2tncm91bmQgZm9ybWF0IHNwZWNpZmllcnMsICVje25hbWV9LyVie25hbWV9LCBib3RoIG9wdGlvbmFsLiAlY3t9LyVie30gcmVzZXRzIHRvIGRlZmF1bHQuXG4gKiBAcGFyYW0ge2ludH0gW21heFdpZHRoXSB3cmFwIGF0IHdoYXQgd2lkdGg/XG4gKiBAcmV0dXJucyB7aW50fSBsaW5lcyBkcmF3blxuICovXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZHJhd1RleHQgPSBmdW5jdGlvbih4LCB5LCB0ZXh0LCBtYXhXaWR0aCkge1xuXHR2YXIgZmcgPSBudWxsO1xuXHR2YXIgYmcgPSBudWxsO1xuXHR2YXIgY3ggPSB4O1xuXHR2YXIgY3kgPSB5O1xuXHR2YXIgbGluZXMgPSAxO1xuXHRpZiAoIW1heFdpZHRoKSB7IG1heFdpZHRoID0gdGhpcy5fb3B0aW9ucy53aWR0aC14OyB9XG5cblx0dmFyIHRva2VucyA9IFJPVC5UZXh0LnRva2VuaXplKHRleHQsIG1heFdpZHRoKTtcblxuXHR3aGlsZSAodG9rZW5zLmxlbmd0aCkgeyAvKiBpbnRlcnByZXQgdG9rZW5pemVkIG9wY29kZSBzdHJlYW0gKi9cblx0XHR2YXIgdG9rZW4gPSB0b2tlbnMuc2hpZnQoKTtcblx0XHRzd2l0Y2ggKHRva2VuLnR5cGUpIHtcblx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9URVhUOlxuXHRcdFx0XHR2YXIgaXNTcGFjZSA9IGZhbHNlLCBpc1ByZXZTcGFjZSA9IGZhbHNlLCBpc0Z1bGxXaWR0aCA9IGZhbHNlLCBpc1ByZXZGdWxsV2lkdGggPSBmYWxzZTtcblx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8dG9rZW4udmFsdWUubGVuZ3RoO2krKykge1xuXHRcdFx0XHRcdHZhciBjYyA9IHRva2VuLnZhbHVlLmNoYXJDb2RlQXQoaSk7XG5cdFx0XHRcdFx0dmFyIGMgPSB0b2tlbi52YWx1ZS5jaGFyQXQoaSk7XG5cdFx0XHRcdFx0Ly8gQXNzaWduIHRvIGB0cnVlYCB3aGVuIHRoZSBjdXJyZW50IGNoYXIgaXMgZnVsbC13aWR0aC5cblx0XHRcdFx0XHRpc0Z1bGxXaWR0aCA9IChjYyA+IDB4ZmYwMCAmJiBjYyA8IDB4ZmY2MSkgfHwgKGNjID4gMHhmZmRjICYmIGNjIDwgMHhmZmU4KSB8fCBjYyA+IDB4ZmZlZTtcblx0XHRcdFx0XHQvLyBDdXJyZW50IGNoYXIgaXMgc3BhY2UsIHdoYXRldmVyIGZ1bGwtd2lkdGggb3IgaGFsZi13aWR0aCBib3RoIGFyZSBPSy5cblx0XHRcdFx0XHRpc1NwYWNlID0gKGMuY2hhckNvZGVBdCgwKSA9PSAweDIwIHx8IGMuY2hhckNvZGVBdCgwKSA9PSAweDMwMDApO1xuXHRcdFx0XHRcdC8vIFRoZSBwcmV2aW91cyBjaGFyIGlzIGZ1bGwtd2lkdGggYW5kXG5cdFx0XHRcdFx0Ly8gY3VycmVudCBjaGFyIGlzIG5ldGhlciBoYWxmLXdpZHRoIG5vciBhIHNwYWNlLlxuXHRcdFx0XHRcdGlmIChpc1ByZXZGdWxsV2lkdGggJiYgIWlzRnVsbFdpZHRoICYmICFpc1NwYWNlKSB7IGN4Kys7IH0gLy8gYWRkIGFuIGV4dHJhIHBvc2l0aW9uXG5cdFx0XHRcdFx0Ly8gVGhlIGN1cnJlbnQgY2hhciBpcyBmdWxsLXdpZHRoIGFuZFxuXHRcdFx0XHRcdC8vIHRoZSBwcmV2aW91cyBjaGFyIGlzIG5vdCBhIHNwYWNlLlxuXHRcdFx0XHRcdGlmKGlzRnVsbFdpZHRoICYmICFpc1ByZXZTcGFjZSkgeyBjeCsrOyB9IC8vIGFkZCBhbiBleHRyYSBwb3NpdGlvblxuXHRcdFx0XHRcdHRoaXMuZHJhdyhjeCsrLCBjeSwgYywgZmcsIGJnKTtcblx0XHRcdFx0XHRpc1ByZXZTcGFjZSA9IGlzU3BhY2U7XG5cdFx0XHRcdFx0aXNQcmV2RnVsbFdpZHRoID0gaXNGdWxsV2lkdGg7XG5cdFx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfRkc6XG5cdFx0XHRcdGZnID0gdG9rZW4udmFsdWUgfHwgbnVsbDtcblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfQkc6XG5cdFx0XHRcdGJnID0gdG9rZW4udmFsdWUgfHwgbnVsbDtcblx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfTkVXTElORTpcblx0XHRcdFx0Y3ggPSB4O1xuXHRcdFx0XHRjeSsrO1xuXHRcdFx0XHRsaW5lcysrO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGxpbmVzO1xufTtcblxuLyoqXG4gKiBUaW1lciB0aWNrOiB1cGRhdGUgZGlydHkgcGFydHNcbiAqL1xuUk9ULkRpc3BsYXkucHJvdG90eXBlLl90aWNrID0gZnVuY3Rpb24oKSB7XG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl90aWNrKTtcblxuXHRpZiAoIXRoaXMuX2RpcnR5KSB7IHJldHVybjsgfVxuXG5cdGlmICh0aGlzLl9kaXJ0eSA9PT0gdHJ1ZSkgeyAvKiBkcmF3IGFsbCAqL1xuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5fb3B0aW9ucy5iZztcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoLCB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuXG5cdFx0Zm9yICh2YXIgaWQgaW4gdGhpcy5fZGF0YSkgeyAvKiByZWRyYXcgY2FjaGVkIGRhdGEgKi9cblx0XHRcdHRoaXMuX2RyYXcoaWQsIGZhbHNlKTtcblx0XHR9XG5cblx0fSBlbHNlIHsgLyogZHJhdyBvbmx5IGRpcnR5ICovXG5cdFx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2RpcnR5KSB7XG5cdFx0XHR0aGlzLl9kcmF3KGtleSwgdHJ1ZSk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5fZGlydHkgPSBmYWxzZTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBXaGF0IHRvIGRyYXdcbiAqIEBwYXJhbSB7Ym9vbH0gY2xlYXJCZWZvcmUgSXMgaXQgbmVjZXNzYXJ5IHRvIGNsZWFuIGJlZm9yZT9cbiAqL1xuUk9ULkRpc3BsYXkucHJvdG90eXBlLl9kcmF3ID0gZnVuY3Rpb24oa2V5LCBjbGVhckJlZm9yZSkge1xuXHR2YXIgZGF0YSA9IHRoaXMuX2RhdGFba2V5XTtcblx0aWYgKGRhdGFbNF0gIT0gdGhpcy5fb3B0aW9ucy5iZykgeyBjbGVhckJlZm9yZSA9IHRydWU7IH1cblxuXHR0aGlzLl9iYWNrZW5kLmRyYXcoZGF0YSwgY2xlYXJCZWZvcmUpO1xufTtcbi8qKlxuICogQGNsYXNzIEFic3RyYWN0IGRpc3BsYXkgYmFja2VuZCBtb2R1bGVcbiAqIEBwcml2YXRlXG4gKi9cblJPVC5EaXNwbGF5LkJhY2tlbmQgPSBmdW5jdGlvbihjb250ZXh0KSB7XG5cdHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xufTtcblxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbn07XG5cblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xufTtcblxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xufTtcblxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcbn07XG5cblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHkpIHtcbn07XG4vKipcbiAqIEBjbGFzcyBSZWN0YW5ndWxhciBiYWNrZW5kXG4gKiBAcHJpdmF0ZVxuICovXG5ST1QuRGlzcGxheS5SZWN0ID0gZnVuY3Rpb24oY29udGV4dCkge1xuXHRST1QuRGlzcGxheS5CYWNrZW5kLmNhbGwodGhpcywgY29udGV4dCk7XG5cdFxuXHR0aGlzLl9zcGFjaW5nWCA9IDA7XG5cdHRoaXMuX3NwYWNpbmdZID0gMDtcblx0dGhpcy5fY2FudmFzQ2FjaGUgPSB7fTtcblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xufTtcblJPVC5EaXNwbGF5LlJlY3QuZXh0ZW5kKFJPVC5EaXNwbGF5LkJhY2tlbmQpO1xuXG5ST1QuRGlzcGxheS5SZWN0LmNhY2hlID0gZmFsc2U7XG5cblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHRoaXMuX2NhbnZhc0NhY2hlID0ge307XG5cdHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuXG5cdHZhciBjaGFyV2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xuXHR0aGlzLl9zcGFjaW5nWCA9IE1hdGguY2VpbChvcHRpb25zLnNwYWNpbmcgKiBjaGFyV2lkdGgpO1xuXHR0aGlzLl9zcGFjaW5nWSA9IE1hdGguY2VpbChvcHRpb25zLnNwYWNpbmcgKiBvcHRpb25zLmZvbnRTaXplKTtcblxuXHRpZiAodGhpcy5fb3B0aW9ucy5mb3JjZVNxdWFyZVJhdGlvKSB7XG5cdFx0dGhpcy5fc3BhY2luZ1ggPSB0aGlzLl9zcGFjaW5nWSA9IE1hdGgubWF4KHRoaXMuX3NwYWNpbmdYLCB0aGlzLl9zcGFjaW5nWSk7XG5cdH1cblxuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCA9IG9wdGlvbnMud2lkdGggKiB0aGlzLl9zcGFjaW5nWDtcblx0dGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgKiB0aGlzLl9zcGFjaW5nWTtcbn07XG5cblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xuXHRpZiAodGhpcy5jb25zdHJ1Y3Rvci5jYWNoZSkge1xuXHRcdHRoaXMuX2RyYXdXaXRoQ2FjaGUoZGF0YSwgY2xlYXJCZWZvcmUpO1xuXHR9IGVsc2Uge1xuXHRcdHRoaXMuX2RyYXdOb0NhY2hlKGRhdGEsIGNsZWFyQmVmb3JlKTtcblx0fVxufTtcblxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuX2RyYXdXaXRoQ2FjaGUgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xuXHR2YXIgeCA9IGRhdGFbMF07XG5cdHZhciB5ID0gZGF0YVsxXTtcblx0dmFyIGNoID0gZGF0YVsyXTtcblx0dmFyIGZnID0gZGF0YVszXTtcblx0dmFyIGJnID0gZGF0YVs0XTtcblxuXHR2YXIgaGFzaCA9IFwiXCIrY2grZmcrYmc7XG5cdGlmIChoYXNoIGluIHRoaXMuX2NhbnZhc0NhY2hlKSB7XG5cdFx0dmFyIGNhbnZhcyA9IHRoaXMuX2NhbnZhc0NhY2hlW2hhc2hdO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBiID0gdGhpcy5fb3B0aW9ucy5ib3JkZXI7XG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cdFx0Y2FudmFzLndpZHRoID0gdGhpcy5fc3BhY2luZ1g7XG5cdFx0Y2FudmFzLmhlaWdodCA9IHRoaXMuX3NwYWNpbmdZO1xuXHRcdGN0eC5maWxsU3R5bGUgPSBiZztcblx0XHRjdHguZmlsbFJlY3QoYiwgYiwgY2FudmFzLndpZHRoLWIsIGNhbnZhcy5oZWlnaHQtYik7XG5cdFx0XG5cdFx0aWYgKGNoKSB7XG5cdFx0XHRjdHguZmlsbFN0eWxlID0gZmc7XG5cdFx0XHRjdHguZm9udCA9IHRoaXMuX2NvbnRleHQuZm9udDtcblx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuXHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG5cblx0XHRcdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XG5cdFx0XHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XG5cdFx0XHRcdGN0eC5maWxsVGV4dChjaGFyc1tpXSwgdGhpcy5fc3BhY2luZ1gvMiwgTWF0aC5jZWlsKHRoaXMuX3NwYWNpbmdZLzIpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5fY2FudmFzQ2FjaGVbaGFzaF0gPSBjYW52YXM7XG5cdH1cblx0XG5cdHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKGNhbnZhcywgeCp0aGlzLl9zcGFjaW5nWCwgeSp0aGlzLl9zcGFjaW5nWSk7XG59O1xuXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5fZHJhd05vQ2FjaGUgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xuXHR2YXIgeCA9IGRhdGFbMF07XG5cdHZhciB5ID0gZGF0YVsxXTtcblx0dmFyIGNoID0gZGF0YVsyXTtcblx0dmFyIGZnID0gZGF0YVszXTtcblx0dmFyIGJnID0gZGF0YVs0XTtcblxuXHRpZiAoY2xlYXJCZWZvcmUpIHsgXG5cdFx0dmFyIGIgPSB0aGlzLl9vcHRpb25zLmJvcmRlcjtcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoeCp0aGlzLl9zcGFjaW5nWCArIGIsIHkqdGhpcy5fc3BhY2luZ1kgKyBiLCB0aGlzLl9zcGFjaW5nWCAtIGIsIHRoaXMuX3NwYWNpbmdZIC0gYik7XG5cdH1cblx0XG5cdGlmICghY2gpIHsgcmV0dXJuOyB9XG5cblx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBmZztcblxuXHR2YXIgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xuXHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XG5cdFx0dGhpcy5fY29udGV4dC5maWxsVGV4dChjaGFyc1tpXSwgKHgrMC41KSAqIHRoaXMuX3NwYWNpbmdYLCBNYXRoLmNlaWwoKHkrMC41KSAqIHRoaXMuX3NwYWNpbmdZKSk7XG5cdH1cbn07XG5cblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcblx0dmFyIHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fc3BhY2luZ1gpO1xuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX3NwYWNpbmdZKTtcblx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcbn07XG5cblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG5cdHZhciBib3hXaWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX29wdGlvbnMud2lkdGgpO1xuXHR2YXIgYm94SGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0KTtcblxuXHQvKiBjb21wdXRlIGNoYXIgcmF0aW8gKi9cblx0dmFyIG9sZEZvbnQgPSB0aGlzLl9jb250ZXh0LmZvbnQ7XG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IFwiMTAwcHggXCIgKyB0aGlzLl9vcHRpb25zLmZvbnRGYW1pbHk7XG5cdHZhciB3aWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jb250ZXh0Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IG9sZEZvbnQ7XG5cdHZhciByYXRpbyA9IHdpZHRoIC8gMTAwO1xuXHRcdFxuXHR2YXIgd2lkdGhGcmFjdGlvbiA9IHJhdGlvICogYm94SGVpZ2h0IC8gYm94V2lkdGg7XG5cdGlmICh3aWR0aEZyYWN0aW9uID4gMSkgeyAvKiB0b28gd2lkZSB3aXRoIGN1cnJlbnQgYXNwZWN0IHJhdGlvICovXG5cdFx0Ym94SGVpZ2h0ID0gTWF0aC5mbG9vcihib3hIZWlnaHQgLyB3aWR0aEZyYWN0aW9uKTtcblx0fVxuXHRyZXR1cm4gTWF0aC5mbG9vcihib3hIZWlnaHQgLyB0aGlzLl9vcHRpb25zLnNwYWNpbmcpO1xufTtcblxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuZXZlbnRUb1Bvc2l0aW9uID0gZnVuY3Rpb24oeCwgeSkge1xuXHRyZXR1cm4gW01hdGguZmxvb3IoeC90aGlzLl9zcGFjaW5nWCksIE1hdGguZmxvb3IoeS90aGlzLl9zcGFjaW5nWSldO1xufTtcbi8qKlxuICogQGNsYXNzIEhleGFnb25hbCBiYWNrZW5kXG4gKiBAcHJpdmF0ZVxuICovXG5ST1QuRGlzcGxheS5IZXggPSBmdW5jdGlvbihjb250ZXh0KSB7XG5cdFJPVC5EaXNwbGF5LkJhY2tlbmQuY2FsbCh0aGlzLCBjb250ZXh0KTtcblxuXHR0aGlzLl9zcGFjaW5nWCA9IDA7XG5cdHRoaXMuX3NwYWNpbmdZID0gMDtcblx0dGhpcy5faGV4U2l6ZSA9IDA7XG5cdHRoaXMuX29wdGlvbnMgPSB7fTtcbn07XG5ST1QuRGlzcGxheS5IZXguZXh0ZW5kKFJPVC5EaXNwbGF5LkJhY2tlbmQpO1xuXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuXG5cdC8qIEZJWE1FIGNoYXIgc2l6ZSBjb21wdXRhdGlvbiBkb2VzIG5vdCByZXNwZWN0IHRyYW5zcG9zZWQgaGV4ZXMgKi9cblx0dmFyIGNoYXJXaWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jb250ZXh0Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XG5cdHRoaXMuX2hleFNpemUgPSBNYXRoLmZsb29yKG9wdGlvbnMuc3BhY2luZyAqIChvcHRpb25zLmZvbnRTaXplICsgY2hhcldpZHRoL01hdGguc3FydCgzKSkgLyAyKTtcblx0dGhpcy5fc3BhY2luZ1ggPSB0aGlzLl9oZXhTaXplICogTWF0aC5zcXJ0KDMpIC8gMjtcblx0dGhpcy5fc3BhY2luZ1kgPSB0aGlzLl9oZXhTaXplICogMS41O1xuXG5cdGlmIChvcHRpb25zLnRyYW5zcG9zZSkge1xuXHRcdHZhciB4cHJvcCA9IFwiaGVpZ2h0XCI7XG5cdFx0dmFyIHlwcm9wID0gXCJ3aWR0aFwiO1xuXHR9IGVsc2Uge1xuXHRcdHZhciB4cHJvcCA9IFwid2lkdGhcIjtcblx0XHR2YXIgeXByb3AgPSBcImhlaWdodFwiO1xuXHR9XG5cdHRoaXMuX2NvbnRleHQuY2FudmFzW3hwcm9wXSA9IE1hdGguY2VpbCggKG9wdGlvbnMud2lkdGggKyAxKSAqIHRoaXMuX3NwYWNpbmdYICk7XG5cdHRoaXMuX2NvbnRleHQuY2FudmFzW3lwcm9wXSA9IE1hdGguY2VpbCggKG9wdGlvbnMuaGVpZ2h0IC0gMSkgKiB0aGlzLl9zcGFjaW5nWSArIDIqdGhpcy5faGV4U2l6ZSApO1xufTtcblxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcblx0dmFyIHggPSBkYXRhWzBdO1xuXHR2YXIgeSA9IGRhdGFbMV07XG5cdHZhciBjaCA9IGRhdGFbMl07XG5cdHZhciBmZyA9IGRhdGFbM107XG5cdHZhciBiZyA9IGRhdGFbNF07XG5cblx0dmFyIHB4ID0gW1xuXHRcdCh4KzEpICogdGhpcy5fc3BhY2luZ1gsXG5cdFx0eSAqIHRoaXMuX3NwYWNpbmdZICsgdGhpcy5faGV4U2l6ZVxuXHRdO1xuXHRpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHsgcHgucmV2ZXJzZSgpOyB9XG5cblx0aWYgKGNsZWFyQmVmb3JlKSB7XG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBiZztcblx0XHR0aGlzLl9maWxsKHB4WzBdLCBweFsxXSk7XG5cdH1cblxuXHRpZiAoIWNoKSB7IHJldHVybjsgfVxuXG5cdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gZmc7XG5cblx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcblx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFRleHQoY2hhcnNbaV0sIHB4WzBdLCBNYXRoLmNlaWwocHhbMV0pKTtcblx0fVxufTtcblxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkge1xuXHRcdGF2YWlsV2lkdGggKz0gYXZhaWxIZWlnaHQ7XG5cdFx0YXZhaWxIZWlnaHQgPSBhdmFpbFdpZHRoIC0gYXZhaWxIZWlnaHQ7XG5cdFx0YXZhaWxXaWR0aCAtPSBhdmFpbEhlaWdodDtcblx0fVxuXG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX3NwYWNpbmdYKSAtIDE7XG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKChhdmFpbEhlaWdodCAtIDIqdGhpcy5faGV4U2l6ZSkgLyB0aGlzLl9zcGFjaW5nWSArIDEpO1xuXHRyZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xufTtcblxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuXHRpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcblx0XHRhdmFpbFdpZHRoICs9IGF2YWlsSGVpZ2h0O1xuXHRcdGF2YWlsSGVpZ2h0ID0gYXZhaWxXaWR0aCAtIGF2YWlsSGVpZ2h0O1xuXHRcdGF2YWlsV2lkdGggLT0gYXZhaWxIZWlnaHQ7XG5cdH1cblxuXHR2YXIgaGV4U2l6ZVdpZHRoID0gMiphdmFpbFdpZHRoIC8gKCh0aGlzLl9vcHRpb25zLndpZHRoKzEpICogTWF0aC5zcXJ0KDMpKSAtIDE7XG5cdHZhciBoZXhTaXplSGVpZ2h0ID0gYXZhaWxIZWlnaHQgLyAoMiArIDEuNSoodGhpcy5fb3B0aW9ucy5oZWlnaHQtMSkpO1xuXHR2YXIgaGV4U2l6ZSA9IE1hdGgubWluKGhleFNpemVXaWR0aCwgaGV4U2l6ZUhlaWdodCk7XG5cblx0LyogY29tcHV0ZSBjaGFyIHJhdGlvICovXG5cdHZhciBvbGRGb250ID0gdGhpcy5fY29udGV4dC5mb250O1xuXHR0aGlzLl9jb250ZXh0LmZvbnQgPSBcIjEwMHB4IFwiICsgdGhpcy5fb3B0aW9ucy5mb250RmFtaWx5O1xuXHR2YXIgd2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xuXHR0aGlzLl9jb250ZXh0LmZvbnQgPSBvbGRGb250O1xuXHR2YXIgcmF0aW8gPSB3aWR0aCAvIDEwMDtcblxuXHRoZXhTaXplID0gTWF0aC5mbG9vcihoZXhTaXplKSsxOyAvKiBjbG9zZXN0IGxhcmdlciBoZXhTaXplICovXG5cblx0LyogRklYTUUgY2hhciBzaXplIGNvbXB1dGF0aW9uIGRvZXMgbm90IHJlc3BlY3QgdHJhbnNwb3NlZCBoZXhlcyAqL1xuXHR2YXIgZm9udFNpemUgPSAyKmhleFNpemUgLyAodGhpcy5fb3B0aW9ucy5zcGFjaW5nICogKDEgKyByYXRpbyAvIE1hdGguc3FydCgzKSkpO1xuXG5cdC8qIGNsb3Nlc3Qgc21hbGxlciBmb250U2l6ZSAqL1xuXHRyZXR1cm4gTWF0aC5jZWlsKGZvbnRTaXplKS0xO1xufTtcblxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkge1xuXHRcdHggKz0geTtcblx0XHR5ID0geC15O1xuXHRcdHggLT0geTtcblx0XHR2YXIgbm9kZVNpemUgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aDtcblx0fSBlbHNlIHtcblx0XHR2YXIgbm9kZVNpemUgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQ7XG5cdH1cblx0dmFyIHNpemUgPSBub2RlU2l6ZSAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0O1xuXHR5ID0gTWF0aC5mbG9vcih5L3NpemUpO1xuXG5cdGlmICh5Lm1vZCgyKSkgeyAvKiBvZGQgcm93ICovXG5cdFx0eCAtPSB0aGlzLl9zcGFjaW5nWDtcblx0XHR4ID0gMSArIDIqTWF0aC5mbG9vcih4LygyKnRoaXMuX3NwYWNpbmdYKSk7XG5cdH0gZWxzZSB7XG5cdFx0eCA9IDIqTWF0aC5mbG9vcih4LygyKnRoaXMuX3NwYWNpbmdYKSk7XG5cdH1cblxuXHRyZXR1cm4gW3gsIHldO1xufTtcblxuLyoqXG4gKiBBcmd1bWVudHMgYXJlIHBpeGVsIHZhbHVlcy4gSWYgXCJ0cmFuc3Bvc2VkXCIgbW9kZSBpcyBlbmFibGVkLCB0aGVuIHRoZXNlIHR3byBhcmUgYWxyZWFkeSBzd2FwcGVkLlxuICovXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLl9maWxsID0gZnVuY3Rpb24oY3gsIGN5KSB7XG5cdHZhciBhID0gdGhpcy5faGV4U2l6ZTtcblx0dmFyIGIgPSB0aGlzLl9vcHRpb25zLmJvcmRlcjtcblxuXHR0aGlzLl9jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkge1xuXHRcdHRoaXMuX2NvbnRleHQubW92ZVRvKGN4LWErYixcdGN5KTtcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC1hLzIrYixcdGN5K3RoaXMuX3NwYWNpbmdYLWIpO1xuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K2EvMi1iLFx0Y3krdGhpcy5fc3BhY2luZ1gtYik7XG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grYS1iLFx0Y3kpO1xuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K2EvMi1iLFx0Y3ktdGhpcy5fc3BhY2luZ1grYik7XG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gtYS8yK2IsXHRjeS10aGlzLl9zcGFjaW5nWCtiKTtcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC1hK2IsXHRjeSk7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5fY29udGV4dC5tb3ZlVG8oY3gsXHRcdFx0XHRcdGN5LWErYik7XG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grdGhpcy5fc3BhY2luZ1gtYixcdGN5LWEvMitiKTtcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCt0aGlzLl9zcGFjaW5nWC1iLFx0Y3krYS8yLWIpO1xuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LFx0XHRcdFx0XHRjeSthLWIpO1xuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LXRoaXMuX3NwYWNpbmdYK2IsXHRjeSthLzItYik7XG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gtdGhpcy5fc3BhY2luZ1grYixcdGN5LWEvMitiKTtcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCxcdFx0XHRcdFx0Y3ktYStiKTtcblx0fVxuXHR0aGlzLl9jb250ZXh0LmZpbGwoKTtcbn07XG4vKipcbiAqIEBjbGFzcyBUaWxlIGJhY2tlbmRcbiAqIEBwcml2YXRlXG4gKi9cblJPVC5EaXNwbGF5LlRpbGUgPSBmdW5jdGlvbihjb250ZXh0KSB7XG5cdFJPVC5EaXNwbGF5LlJlY3QuY2FsbCh0aGlzLCBjb250ZXh0KTtcblx0XG5cdHRoaXMuX29wdGlvbnMgPSB7fTtcblx0dGhpcy5fY29sb3JDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xufTtcblJPVC5EaXNwbGF5LlRpbGUuZXh0ZW5kKFJPVC5EaXNwbGF5LlJlY3QpO1xuXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHR0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcblx0dGhpcy5fY29udGV4dC5jYW52YXMud2lkdGggPSBvcHRpb25zLndpZHRoICogb3B0aW9ucy50aWxlV2lkdGg7XG5cdHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0ICogb3B0aW9ucy50aWxlSGVpZ2h0O1xuXHR0aGlzLl9jb2xvckNhbnZhcy53aWR0aCA9IG9wdGlvbnMudGlsZVdpZHRoO1xuXHR0aGlzLl9jb2xvckNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLnRpbGVIZWlnaHQ7XG59O1xuXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcblx0dmFyIHggPSBkYXRhWzBdO1xuXHR2YXIgeSA9IGRhdGFbMV07XG5cdHZhciBjaCA9IGRhdGFbMl07XG5cdHZhciBmZyA9IGRhdGFbM107XG5cdHZhciBiZyA9IGRhdGFbNF07XG5cblx0dmFyIHRpbGVXaWR0aCA9IHRoaXMuX29wdGlvbnMudGlsZVdpZHRoO1xuXHR2YXIgdGlsZUhlaWdodCA9IHRoaXMuX29wdGlvbnMudGlsZUhlaWdodDtcblxuXHRpZiAoY2xlYXJCZWZvcmUpIHtcblx0XHRpZiAodGhpcy5fb3B0aW9ucy50aWxlQ29sb3JpemUpIHtcblx0XHRcdHRoaXMuX2NvbnRleHQuY2xlYXJSZWN0KHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gYmc7XG5cdFx0XHR0aGlzLl9jb250ZXh0LmZpbGxSZWN0KHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCFjaCkgeyByZXR1cm47IH1cblxuXHR2YXIgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xuXHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIHRpbGUgPSB0aGlzLl9vcHRpb25zLnRpbGVNYXBbY2hhcnNbaV1dO1xuXHRcdGlmICghdGlsZSkgeyB0aHJvdyBuZXcgRXJyb3IoXCJDaGFyICdcIiArIGNoYXJzW2ldICsgXCInIG5vdCBmb3VuZCBpbiB0aWxlTWFwXCIpOyB9XG5cdFx0XG5cdFx0aWYgKHRoaXMuX29wdGlvbnMudGlsZUNvbG9yaXplKSB7IC8qIGFwcGx5IGNvbG9yaXphdGlvbiAqL1xuXHRcdFx0dmFyIGNhbnZhcyA9IHRoaXMuX2NvbG9yQ2FudmFzO1xuXHRcdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRcdFx0Y29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcblxuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UoXG5cdFx0XHRcdHRoaXMuX29wdGlvbnMudGlsZVNldCxcblx0XHRcdFx0dGlsZVswXSwgdGlsZVsxXSwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LFxuXHRcdFx0XHQwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHRcblx0XHRcdCk7XG5cblx0XHRcdGlmIChmZyAhPSBcInRyYW5zcGFyZW50XCIpIHtcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBmZztcblx0XHRcdFx0Y29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcInNvdXJjZS1hdG9wXCI7XG5cdFx0XHRcdGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGJnICE9IFwidHJhbnNwYXJlbnRcIikge1xuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xuXHRcdFx0XHRjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGVzdGluYXRpb24tb3ZlclwiO1xuXHRcdFx0XHRjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKGNhbnZhcywgeCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcblxuXHRcdH0gZWxzZSB7IC8qIG5vIGNvbG9yaXppbmcsIGVhc3kgKi9cblx0XHRcdHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKFxuXHRcdFx0XHR0aGlzLl9vcHRpb25zLnRpbGVTZXQsXG5cdFx0XHRcdHRpbGVbMF0sIHRpbGVbMV0sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCxcblx0XHRcdFx0eCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0XG5cdFx0XHQpO1xuXHRcdH1cblx0fVxufTtcblxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuXHR2YXIgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLnRpbGVXaWR0aCk7XG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0KTtcblx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcbn07XG5cblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX29wdGlvbnMud2lkdGgpO1xuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0KTtcblx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcbn07XG5cblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0cmV0dXJuIFtNYXRoLmZsb29yKHgvdGhpcy5fb3B0aW9ucy50aWxlV2lkdGgpLCBNYXRoLmZsb29yKHkvdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0KV07XG59O1xuLyoqXG4gKiBAbmFtZXNwYWNlXG4gKiBUaGlzIGNvZGUgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgQWxlYSBhbGdvcml0aG07IChDKSAyMDEwIEpvaGFubmVzIEJhYWfDuGUuXG4gKiBBbGVhIGlzIGxpY2Vuc2VkIGFjY29yZGluZyB0byB0aGUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZS5cbiAqL1xuUk9ULlJORyA9IHtcblx0LyoqXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFxuXHQgKi9cblx0Z2V0U2VlZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3NlZWQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZWVkIFNlZWQgdGhlIG51bWJlciBnZW5lcmF0b3Jcblx0ICovXG5cdHNldFNlZWQ6IGZ1bmN0aW9uKHNlZWQpIHtcblx0XHRzZWVkID0gKHNlZWQgPCAxID8gMS9zZWVkIDogc2VlZCk7XG5cblx0XHR0aGlzLl9zZWVkID0gc2VlZDtcblx0XHR0aGlzLl9zMCA9IChzZWVkID4+PiAwKSAqIHRoaXMuX2ZyYWM7XG5cblx0XHRzZWVkID0gKHNlZWQqNjkwNjkgKyAxKSA+Pj4gMDtcblx0XHR0aGlzLl9zMSA9IHNlZWQgKiB0aGlzLl9mcmFjO1xuXG5cdFx0c2VlZCA9IChzZWVkKjY5MDY5ICsgMSkgPj4+IDA7XG5cdFx0dGhpcy5fczIgPSBzZWVkICogdGhpcy5fZnJhYztcblxuXHRcdHRoaXMuX2MgPSAxO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBAcmV0dXJucyB7ZmxvYXR9IFBzZXVkb3JhbmRvbSB2YWx1ZSBbMCwxKSwgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkXG5cdCAqL1xuXHRnZXRVbmlmb3JtOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdCA9IDIwOTE2MzkgKiB0aGlzLl9zMCArIHRoaXMuX2MgKiB0aGlzLl9mcmFjO1xuXHRcdHRoaXMuX3MwID0gdGhpcy5fczE7XG5cdFx0dGhpcy5fczEgPSB0aGlzLl9zMjtcblx0XHR0aGlzLl9jID0gdCB8IDA7XG5cdFx0dGhpcy5fczIgPSB0IC0gdGhpcy5fYztcblx0XHRyZXR1cm4gdGhpcy5fczI7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7aW50fSBsb3dlckJvdW5kIFRoZSBsb3dlciBlbmQgb2YgdGhlIHJhbmdlIHRvIHJldHVybiBhIHZhbHVlIGZyb20sIGluY2x1c2l2ZVxuXHQgKiBAcGFyYW0ge2ludH0gdXBwZXJCb3VuZCBUaGUgdXBwZXIgZW5kIG9mIHRoZSByYW5nZSB0byByZXR1cm4gYSB2YWx1ZSBmcm9tLCBpbmNsdXNpdmVcblx0ICogQHJldHVybnMge2ludH0gUHNldWRvcmFuZG9tIHZhbHVlIFtsb3dlckJvdW5kLCB1cHBlckJvdW5kXSwgdXNpbmcgUk9ULlJORy5nZXRVbmlmb3JtKCkgdG8gZGlzdHJpYnV0ZSB0aGUgdmFsdWVcblx0ICovXG5cdGdldFVuaWZvcm1JbnQ6IGZ1bmN0aW9uKGxvd2VyQm91bmQsIHVwcGVyQm91bmQpIHtcblx0XHR2YXIgbWF4ID0gTWF0aC5tYXgobG93ZXJCb3VuZCwgdXBwZXJCb3VuZCk7XG5cdFx0dmFyIG1pbiA9IE1hdGgubWluKGxvd2VyQm91bmQsIHVwcGVyQm91bmQpO1xuXHRcdHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2V0VW5pZm9ybSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcblx0fSxcblxuXHQvKipcblx0ICogQHBhcmFtIHtmbG9hdH0gW21lYW49MF0gTWVhbiB2YWx1ZVxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbc3RkZGV2PTFdIFN0YW5kYXJkIGRldmlhdGlvbi4gfjk1JSBvZiB0aGUgYWJzb2x1dGUgdmFsdWVzIHdpbGwgYmUgbG93ZXIgdGhhbiAyKnN0ZGRldi5cblx0ICogQHJldHVybnMge2Zsb2F0fSBBIG5vcm1hbGx5IGRpc3RyaWJ1dGVkIHBzZXVkb3JhbmRvbSB2YWx1ZVxuXHQgKi9cblx0Z2V0Tm9ybWFsOiBmdW5jdGlvbihtZWFuLCBzdGRkZXYpIHtcblx0XHRkbyB7XG5cdFx0XHR2YXIgdSA9IDIqdGhpcy5nZXRVbmlmb3JtKCktMTtcblx0XHRcdHZhciB2ID0gMip0aGlzLmdldFVuaWZvcm0oKS0xO1xuXHRcdFx0dmFyIHIgPSB1KnUgKyB2KnY7XG5cdFx0fSB3aGlsZSAociA+IDEgfHwgciA9PSAwKTtcblxuXHRcdHZhciBnYXVzcyA9IHUgKiBNYXRoLnNxcnQoLTIqTWF0aC5sb2cocikvcik7XG5cdFx0cmV0dXJuIChtZWFuIHx8IDApICsgZ2F1c3MqKHN0ZGRldiB8fCAxKTtcblx0fSxcblxuXHQvKipcblx0ICogQHJldHVybnMge2ludH0gUHNldWRvcmFuZG9tIHZhbHVlIFsxLDEwMF0gaW5jbHVzaXZlLCB1bmlmb3JtbHkgZGlzdHJpYnV0ZWRcblx0ICovXG5cdGdldFBlcmNlbnRhZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAxICsgTWF0aC5mbG9vcih0aGlzLmdldFVuaWZvcm0oKSoxMDApO1xuXHR9LFxuXHRcblx0LyoqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIGtleT13aGF0ZXZlciwgdmFsdWU9d2VpZ2h0IChyZWxhdGl2ZSBwcm9iYWJpbGl0eSlcblx0ICogQHJldHVybnMge3N0cmluZ30gd2hhdGV2ZXJcblx0ICovXG5cdGdldFdlaWdodGVkVmFsdWU6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR2YXIgdG90YWwgPSAwO1xuXHRcdFxuXHRcdGZvciAodmFyIGlkIGluIGRhdGEpIHtcblx0XHRcdHRvdGFsICs9IGRhdGFbaWRdO1xuXHRcdH1cblx0XHR2YXIgcmFuZG9tID0gdGhpcy5nZXRVbmlmb3JtKCkqdG90YWw7XG5cdFx0XG5cdFx0dmFyIHBhcnQgPSAwO1xuXHRcdGZvciAodmFyIGlkIGluIGRhdGEpIHtcblx0XHRcdHBhcnQgKz0gZGF0YVtpZF07XG5cdFx0XHRpZiAocmFuZG9tIDwgcGFydCkgeyByZXR1cm4gaWQ7IH1cblx0XHR9XG5cblx0XHQvLyBJZiBieSBzb21lIGZsb2F0aW5nLXBvaW50IGFubm95YW5jZSB3ZSBoYXZlXG5cdFx0Ly8gcmFuZG9tID49IHRvdGFsLCBqdXN0IHJldHVybiB0aGUgbGFzdCBpZC5cblx0XHRyZXR1cm4gaWQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCBSTkcgc3RhdGUuIFVzZWZ1bCBmb3Igc3RvcmluZyB0aGUgc3RhdGUgYW5kIHJlLXNldHRpbmcgaXQgdmlhIHNldFN0YXRlLlxuXHQgKiBAcmV0dXJucyB7P30gSW50ZXJuYWwgc3RhdGVcblx0ICovXG5cdGdldFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gW3RoaXMuX3MwLCB0aGlzLl9zMSwgdGhpcy5fczIsIHRoaXMuX2NdO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBTZXQgYSBwcmV2aW91c2x5IHJldHJpZXZlZCBzdGF0ZS5cblx0ICogQHBhcmFtIHs/fSBzdGF0ZVxuXHQgKi9cblx0c2V0U3RhdGU6IGZ1bmN0aW9uKHN0YXRlKSB7XG5cdFx0dGhpcy5fczAgPSBzdGF0ZVswXTtcblx0XHR0aGlzLl9zMSA9IHN0YXRlWzFdO1xuXHRcdHRoaXMuX3MyID0gc3RhdGVbMl07XG5cdFx0dGhpcy5fYyAgPSBzdGF0ZVszXTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvKipcblx0ICogUmV0dXJucyBhIGNsb25lZCBSTkdcblx0ICovXG5cdGNsb25lOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgY2xvbmUgPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xuXHRcdGNsb25lLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGUoKSk7XG5cdFx0cmV0dXJuIGNsb25lO1xuXHR9LFxuXG5cdF9zMDogMCxcblx0X3MxOiAwLFxuXHRfczI6IDAsXG5cdF9jOiAwLFxuXHRfZnJhYzogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMCAvKiAyXi0zMiAqL1xufTtcblxuUk9ULlJORy5zZXRTZWVkKERhdGUubm93KCkpO1xuLyoqXG4gKiBAY2xhc3MgKE1hcmtvdiBwcm9jZXNzKS1iYXNlZCBzdHJpbmcgZ2VuZXJhdG9yLiBcbiAqIENvcGllZCBmcm9tIGEgPGEgaHJlZj1cImh0dHA6Ly93d3cucm9ndWViYXNpbi5yb2d1ZWxpa2VkZXZlbG9wbWVudC5vcmcvaW5kZXgucGhwP3RpdGxlPU5hbWVzX2Zyb21fYV9oaWdoX29yZGVyX01hcmtvdl9Qcm9jZXNzX2FuZF9hX3NpbXBsaWZpZWRfS2F0el9iYWNrLW9mZl9zY2hlbWVcIj5Sb2d1ZUJhc2luIGFydGljbGU8L2E+LiBcbiAqIE9mZmVycyBjb25maWd1cmFibGUgb3JkZXIgYW5kIHByaW9yLlxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtib29sfSBbb3B0aW9ucy53b3Jkcz1mYWxzZV0gVXNlIHdvcmQgbW9kZT9cbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5vcmRlcj0zXVxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMucHJpb3I9MC4wMDFdXG4gKi9cblJPVC5TdHJpbmdHZW5lcmF0b3IgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHRoaXMuX29wdGlvbnMgPSB7XG5cdFx0d29yZHM6IGZhbHNlLFxuXHRcdG9yZGVyOiAzLFxuXHRcdHByaW9yOiAwLjAwMVxuXHR9O1xuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cblxuXHR0aGlzLl9ib3VuZGFyeSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMCk7XG5cdHRoaXMuX3N1ZmZpeCA9IHRoaXMuX2JvdW5kYXJ5O1xuXHR0aGlzLl9wcmVmaXggPSBbXTtcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fb3B0aW9ucy5vcmRlcjtpKyspIHsgdGhpcy5fcHJlZml4LnB1c2godGhpcy5fYm91bmRhcnkpOyB9XG5cblx0dGhpcy5fcHJpb3JWYWx1ZXMgPSB7fTtcblx0dGhpcy5fcHJpb3JWYWx1ZXNbdGhpcy5fYm91bmRhcnldID0gdGhpcy5fb3B0aW9ucy5wcmlvcjtcblxuXHR0aGlzLl9kYXRhID0ge307XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgbGVhcm5pbmcgZGF0YVxuICovXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9kYXRhID0ge307XG5cdHRoaXMuX3ByaW9yVmFsdWVzID0ge307XG59O1xuXG4vKipcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEdlbmVyYXRlZCBzdHJpbmdcbiAqL1xuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlc3VsdCA9IFt0aGlzLl9zYW1wbGUodGhpcy5fcHJlZml4KV07XG5cdHdoaWxlIChyZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXSAhPSB0aGlzLl9ib3VuZGFyeSkge1xuXHRcdHJlc3VsdC5wdXNoKHRoaXMuX3NhbXBsZShyZXN1bHQpKTtcblx0fVxuXHRyZXR1cm4gdGhpcy5fam9pbihyZXN1bHQuc2xpY2UoMCwgLTEpKTtcbn07XG5cbi8qKlxuICogT2JzZXJ2ZSAobGVhcm4pIGEgc3RyaW5nIGZyb20gYSB0cmFpbmluZyBzZXRcbiAqL1xuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUub2JzZXJ2ZSA9IGZ1bmN0aW9uKHN0cmluZykge1xuXHR2YXIgdG9rZW5zID0gdGhpcy5fc3BsaXQoc3RyaW5nKTtcblxuXHRmb3IgKHZhciBpPTA7IGk8dG9rZW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0dGhpcy5fcHJpb3JWYWx1ZXNbdG9rZW5zW2ldXSA9IHRoaXMuX29wdGlvbnMucHJpb3I7XG5cdH1cblxuXHR0b2tlbnMgPSB0aGlzLl9wcmVmaXguY29uY2F0KHRva2VucykuY29uY2F0KHRoaXMuX3N1ZmZpeCk7IC8qIGFkZCBib3VuZGFyeSBzeW1ib2xzICovXG5cblx0Zm9yICh2YXIgaT10aGlzLl9vcHRpb25zLm9yZGVyOyBpPHRva2Vucy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBjb250ZXh0ID0gdG9rZW5zLnNsaWNlKGktdGhpcy5fb3B0aW9ucy5vcmRlciwgaSk7XG5cdFx0dmFyIGV2ZW50ID0gdG9rZW5zW2ldO1xuXHRcdGZvciAodmFyIGo9MDsgajxjb250ZXh0Lmxlbmd0aDsgaisrKSB7XG5cdFx0XHR2YXIgc3ViY29udGV4dCA9IGNvbnRleHQuc2xpY2Uoaik7XG5cdFx0XHR0aGlzLl9vYnNlcnZlRXZlbnQoc3ViY29udGV4dCwgZXZlbnQpO1xuXHRcdH1cblx0fVxufTtcblxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuZ2V0U3RhdHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHBhcnRzID0gW107XG5cblx0dmFyIHByaW9yQ291bnQgPSAwO1xuXHRmb3IgKHZhciBwIGluIHRoaXMuX3ByaW9yVmFsdWVzKSB7IHByaW9yQ291bnQrKzsgfVxuXHRwcmlvckNvdW50LS07IC8qIGJvdW5kYXJ5ICovXG5cdHBhcnRzLnB1c2goXCJkaXN0aW5jdCBzYW1wbGVzOiBcIiArIHByaW9yQ291bnQpO1xuXG5cdHZhciBkYXRhQ291bnQgPSAwO1xuXHR2YXIgZXZlbnRDb3VudCA9IDA7XG5cdGZvciAodmFyIHAgaW4gdGhpcy5fZGF0YSkgeyBcblx0XHRkYXRhQ291bnQrKzsgXG5cdFx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2RhdGFbcF0pIHtcblx0XHRcdGV2ZW50Q291bnQrKztcblx0XHR9XG5cdH1cblx0cGFydHMucHVzaChcImRpY3Rpb25hcnkgc2l6ZSAoY29udGV4dHMpOiBcIiArIGRhdGFDb3VudCk7XG5cdHBhcnRzLnB1c2goXCJkaWN0aW9uYXJ5IHNpemUgKGV2ZW50cyk6IFwiICsgZXZlbnRDb3VudCk7XG5cblx0cmV0dXJuIHBhcnRzLmpvaW4oXCIsIFwiKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9XG4gKiBAcmV0dXJucyB7c3RyaW5nW119XG4gKi9cblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9zcGxpdCA9IGZ1bmN0aW9uKHN0cikge1xuXHRyZXR1cm4gc3RyLnNwbGl0KHRoaXMuX29wdGlvbnMud29yZHMgPyAvXFxzKy8gOiBcIlwiKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmdbXX1cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFxuICovXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fam9pbiA9IGZ1bmN0aW9uKGFycikge1xuXHRyZXR1cm4gYXJyLmpvaW4odGhpcy5fb3B0aW9ucy53b3JkcyA/IFwiIFwiIDogXCJcIik7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nW119IGNvbnRleHRcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICovXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fb2JzZXJ2ZUV2ZW50ID0gZnVuY3Rpb24oY29udGV4dCwgZXZlbnQpIHtcblx0dmFyIGtleSA9IHRoaXMuX2pvaW4oY29udGV4dCk7XG5cdGlmICghKGtleSBpbiB0aGlzLl9kYXRhKSkgeyB0aGlzLl9kYXRhW2tleV0gPSB7fTsgfVxuXHR2YXIgZGF0YSA9IHRoaXMuX2RhdGFba2V5XTtcblxuXHRpZiAoIShldmVudCBpbiBkYXRhKSkgeyBkYXRhW2V2ZW50XSA9IDA7IH1cblx0ZGF0YVtldmVudF0rKztcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmdbXX1cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9zYW1wbGUgPSBmdW5jdGlvbihjb250ZXh0KSB7XG5cdGNvbnRleHQgPSB0aGlzLl9iYWNrb2ZmKGNvbnRleHQpO1xuXHR2YXIga2V5ID0gdGhpcy5fam9pbihjb250ZXh0KTtcblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XG5cblx0dmFyIGF2YWlsYWJsZSA9IHt9O1xuXG5cdGlmICh0aGlzLl9vcHRpb25zLnByaW9yKSB7XG5cdFx0Zm9yICh2YXIgZXZlbnQgaW4gdGhpcy5fcHJpb3JWYWx1ZXMpIHsgYXZhaWxhYmxlW2V2ZW50XSA9IHRoaXMuX3ByaW9yVmFsdWVzW2V2ZW50XTsgfVxuXHRcdGZvciAodmFyIGV2ZW50IGluIGRhdGEpIHsgYXZhaWxhYmxlW2V2ZW50XSArPSBkYXRhW2V2ZW50XTsgfVxuXHR9IGVsc2UgeyBcblx0XHRhdmFpbGFibGUgPSBkYXRhO1xuXHR9XG5cblx0cmV0dXJuIFJPVC5STkcuZ2V0V2VpZ2h0ZWRWYWx1ZShhdmFpbGFibGUpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfVxuICogQHJldHVybnMge3N0cmluZ1tdfVxuICovXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fYmFja29mZiA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0aWYgKGNvbnRleHQubGVuZ3RoID4gdGhpcy5fb3B0aW9ucy5vcmRlcikge1xuXHRcdGNvbnRleHQgPSBjb250ZXh0LnNsaWNlKC10aGlzLl9vcHRpb25zLm9yZGVyKTtcblx0fSBlbHNlIGlmIChjb250ZXh0Lmxlbmd0aCA8IHRoaXMuX29wdGlvbnMub3JkZXIpIHtcblx0XHRjb250ZXh0ID0gdGhpcy5fcHJlZml4LnNsaWNlKDAsIHRoaXMuX29wdGlvbnMub3JkZXIgLSBjb250ZXh0Lmxlbmd0aCkuY29uY2F0KGNvbnRleHQpO1xuXHR9XG5cblx0d2hpbGUgKCEodGhpcy5fam9pbihjb250ZXh0KSBpbiB0aGlzLl9kYXRhKSAmJiBjb250ZXh0Lmxlbmd0aCA+IDApIHsgY29udGV4dCA9IGNvbnRleHQuc2xpY2UoMSk7IH1cblxuXHRyZXR1cm4gY29udGV4dDtcbn07XG4vKipcbiAqIEBjbGFzcyBHZW5lcmljIGV2ZW50IHF1ZXVlOiBzdG9yZXMgZXZlbnRzIGFuZCByZXRyaWV2ZXMgdGhlbSBiYXNlZCBvbiB0aGVpciB0aW1lXG4gKi9cblJPVC5FdmVudFF1ZXVlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuX3RpbWUgPSAwO1xuXHR0aGlzLl9ldmVudHMgPSBbXTtcblx0dGhpcy5fZXZlbnRUaW1lcyA9IFtdO1xufTtcblxuLyoqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBFbGFwc2VkIHRpbWVcbiAqL1xuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3RpbWU7XG59O1xuXG4vKipcbiAqIENsZWFyIGFsbCBzY2hlZHVsZWQgZXZlbnRzXG4gKi9cblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9ldmVudHMgPSBbXTtcblx0dGhpcy5fZXZlbnRUaW1lcyA9IFtdO1xuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQHBhcmFtIHs/fSBldmVudFxuICogQHBhcmFtIHtudW1iZXJ9IHRpbWVcbiAqL1xuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGV2ZW50LCB0aW1lKSB7XG5cdHZhciBpbmRleCA9IHRoaXMuX2V2ZW50cy5sZW5ndGg7XG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX2V2ZW50VGltZXMubGVuZ3RoO2krKykge1xuXHRcdGlmICh0aGlzLl9ldmVudFRpbWVzW2ldID4gdGltZSkge1xuXHRcdFx0aW5kZXggPSBpO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5fZXZlbnRzLnNwbGljZShpbmRleCwgMCwgZXZlbnQpO1xuXHR0aGlzLl9ldmVudFRpbWVzLnNwbGljZShpbmRleCwgMCwgdGltZSk7XG59O1xuXG4vKipcbiAqIExvY2F0ZXMgdGhlIG5lYXJlc3QgZXZlbnQsIGFkdmFuY2VzIHRpbWUgaWYgbmVjZXNzYXJ5LiBSZXR1cm5zIHRoYXQgZXZlbnQgYW5kIHJlbW92ZXMgaXQgZnJvbSB0aGUgcXVldWUuXG4gKiBAcmV0dXJucyB7PyB8fCBudWxsfSBUaGUgZXZlbnQgcHJldmlvdXNseSBhZGRlZCBieSBhZGRFdmVudCwgbnVsbCBpZiBubyBldmVudCBhdmFpbGFibGVcbiAqL1xuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIXRoaXMuX2V2ZW50cy5sZW5ndGgpIHsgcmV0dXJuIG51bGw7IH1cblxuXHR2YXIgdGltZSA9IHRoaXMuX2V2ZW50VGltZXMuc3BsaWNlKDAsIDEpWzBdO1xuXHRpZiAodGltZSA+IDApIHsgLyogYWR2YW5jZSAqL1xuXHRcdHRoaXMuX3RpbWUgKz0gdGltZTtcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl9ldmVudFRpbWVzLmxlbmd0aDtpKyspIHsgdGhpcy5fZXZlbnRUaW1lc1tpXSAtPSB0aW1lOyB9XG5cdH1cblxuXHRyZXR1cm4gdGhpcy5fZXZlbnRzLnNwbGljZSgwLCAxKVswXTtcbn07XG5cbi8qKlxuICogR2V0IHRoZSB0aW1lIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gZXZlbnRcbiAqIEBwYXJhbSB7P30gZXZlbnRcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHRpbWVcbiAqL1xuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmdldEV2ZW50VGltZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdHZhciBpbmRleCA9IHRoaXMuX2V2ZW50cy5pbmRleE9mKGV2ZW50KTtcblx0aWYgKGluZGV4ID09IC0xKSB7IHJldHVybiB1bmRlZmluZWQgfVxuXHRyZXR1cm4gdGhpcy5fZXZlbnRUaW1lc1tpbmRleF07XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBldmVudCBmcm9tIHRoZSBxdWV1ZVxuICogQHBhcmFtIHs/fSBldmVudFxuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3M/XG4gKi9cblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihldmVudCkge1xuXHR2YXIgaW5kZXggPSB0aGlzLl9ldmVudHMuaW5kZXhPZihldmVudCk7XG5cdGlmIChpbmRleCA9PSAtMSkgeyByZXR1cm4gZmFsc2UgfVxuXHR0aGlzLl9yZW1vdmUoaW5kZXgpO1xuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGV2ZW50IGZyb20gdGhlIHF1ZXVlXG4gKiBAcGFyYW0ge2ludH0gaW5kZXhcbiAqL1xuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLl9yZW1vdmUgPSBmdW5jdGlvbihpbmRleCkge1xuXHR0aGlzLl9ldmVudHMuc3BsaWNlKGluZGV4LCAxKTtcblx0dGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoaW5kZXgsIDEpO1xufTtcbi8qKlxuICogQGNsYXNzIEFic3RyYWN0IHNjaGVkdWxlclxuICovXG5ST1QuU2NoZWR1bGVyID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuX3F1ZXVlID0gbmV3IFJPVC5FdmVudFF1ZXVlKCk7XG5cdHRoaXMuX3JlcGVhdCA9IFtdO1xuXHR0aGlzLl9jdXJyZW50ID0gbnVsbDtcbn07XG5cbi8qKlxuICogQHNlZSBST1QuRXZlbnRRdWV1ZSNnZXRUaW1lXG4gKi9cblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3F1ZXVlLmdldFRpbWUoKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHs/fSBpdGVtXG4gKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxuICovXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQpIHtcblx0aWYgKHJlcGVhdCkgeyB0aGlzLl9yZXBlYXQucHVzaChpdGVtKTsgfVxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogR2V0IHRoZSB0aW1lIHRoZSBnaXZlbiBpdGVtIGlzIHNjaGVkdWxlZCBmb3JcbiAqIEBwYXJhbSB7P30gaXRlbVxuICogQHJldHVybnMge251bWJlcn0gdGltZVxuICovXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5nZXRUaW1lT2YgPSBmdW5jdGlvbihpdGVtKSB7XG5cdHJldHVybiB0aGlzLl9xdWV1ZS5nZXRFdmVudFRpbWUoaXRlbSk7XG59O1xuXG4vKipcbiAqIENsZWFyIGFsbCBpdGVtc1xuICovXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9xdWV1ZS5jbGVhcigpO1xuXHR0aGlzLl9yZXBlYXQgPSBbXTtcblx0dGhpcy5fY3VycmVudCA9IG51bGw7XG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYSBwcmV2aW91c2x5IGFkZGVkIGl0ZW1cbiAqIEBwYXJhbSB7P30gaXRlbVxuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3NmdWw/XG4gKi9cblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0dmFyIHJlc3VsdCA9IHRoaXMuX3F1ZXVlLnJlbW92ZShpdGVtKTtcblxuXHR2YXIgaW5kZXggPSB0aGlzLl9yZXBlYXQuaW5kZXhPZihpdGVtKTtcblx0aWYgKGluZGV4ICE9IC0xKSB7IHRoaXMuX3JlcGVhdC5zcGxpY2UoaW5kZXgsIDEpOyB9XG5cblx0aWYgKHRoaXMuX2N1cnJlbnQgPT0gaXRlbSkgeyB0aGlzLl9jdXJyZW50ID0gbnVsbDsgfVxuXG5cdHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFNjaGVkdWxlIG5leHQgaXRlbVxuICogQHJldHVybnMgez99XG4gKi9cblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5fY3VycmVudCA9IHRoaXMuX3F1ZXVlLmdldCgpO1xuXHRyZXR1cm4gdGhpcy5fY3VycmVudDtcbn07XG4vKipcbiAqIEBjbGFzcyBTaW1wbGUgZmFpciBzY2hlZHVsZXIgKHJvdW5kLXJvYmluIHN0eWxlKVxuICogQGF1Z21lbnRzIFJPVC5TY2hlZHVsZXJcbiAqL1xuUk9ULlNjaGVkdWxlci5TaW1wbGUgPSBmdW5jdGlvbigpIHtcblx0Uk9ULlNjaGVkdWxlci5jYWxsKHRoaXMpO1xufTtcblJPVC5TY2hlZHVsZXIuU2ltcGxlLmV4dGVuZChST1QuU2NoZWR1bGVyKTtcblxuLyoqXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjYWRkXG4gKi9cblJPVC5TY2hlZHVsZXIuU2ltcGxlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQpIHtcblx0dGhpcy5fcXVldWUuYWRkKGl0ZW0sIDApO1xuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuYWRkLmNhbGwodGhpcywgaXRlbSwgcmVwZWF0KTtcbn07XG5cbi8qKlxuICogQHNlZSBST1QuU2NoZWR1bGVyI25leHRcbiAqL1xuUk9ULlNjaGVkdWxlci5TaW1wbGUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuX2N1cnJlbnQgJiYgdGhpcy5fcmVwZWF0LmluZGV4T2YodGhpcy5fY3VycmVudCkgIT0gLTEpIHtcblx0XHR0aGlzLl9xdWV1ZS5hZGQodGhpcy5fY3VycmVudCwgMCk7XG5cdH1cblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcbn07XG4vKipcbiAqIEBjbGFzcyBTcGVlZC1iYXNlZCBzY2hlZHVsZXJcbiAqIEBhdWdtZW50cyBST1QuU2NoZWR1bGVyXG4gKi9cblJPVC5TY2hlZHVsZXIuU3BlZWQgPSBmdW5jdGlvbigpIHtcblx0Uk9ULlNjaGVkdWxlci5jYWxsKHRoaXMpO1xufTtcblJPVC5TY2hlZHVsZXIuU3BlZWQuZXh0ZW5kKFJPVC5TY2hlZHVsZXIpO1xuXG4vKipcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtIGFueXRoaW5nIHdpdGggXCJnZXRTcGVlZFwiIG1ldGhvZFxuICogQHBhcmFtIHtib29sfSByZXBlYXRcbiAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZT0xL2l0ZW0uZ2V0U3BlZWQoKV1cbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNhZGRcbiAqL1xuUk9ULlNjaGVkdWxlci5TcGVlZC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oaXRlbSwgcmVwZWF0LCB0aW1lKSB7XG5cdHRoaXMuX3F1ZXVlLmFkZChpdGVtLCB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogMS9pdGVtLmdldFNwZWVkKCkpO1xuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuYWRkLmNhbGwodGhpcywgaXRlbSwgcmVwZWF0KTtcbn07XG5cbi8qKlxuICogQHNlZSBST1QuU2NoZWR1bGVyI25leHRcbiAqL1xuUk9ULlNjaGVkdWxlci5TcGVlZC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5fY3VycmVudCAmJiB0aGlzLl9yZXBlYXQuaW5kZXhPZih0aGlzLl9jdXJyZW50KSAhPSAtMSkge1xuXHRcdHRoaXMuX3F1ZXVlLmFkZCh0aGlzLl9jdXJyZW50LCAxL3RoaXMuX2N1cnJlbnQuZ2V0U3BlZWQoKSk7XG5cdH1cblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcbn07XG4vKipcbiAqIEBjbGFzcyBBY3Rpb24tYmFzZWQgc2NoZWR1bGVyXG4gKiBAYXVnbWVudHMgUk9ULlNjaGVkdWxlclxuICovXG5ST1QuU2NoZWR1bGVyLkFjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRST1QuU2NoZWR1bGVyLmNhbGwodGhpcyk7XG5cdHRoaXMuX2RlZmF1bHREdXJhdGlvbiA9IDE7IC8qIGZvciBuZXdseSBhZGRlZCAqL1xuXHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjsgLyogZm9yIHRoaXMuX2N1cnJlbnQgKi9cbn07XG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5leHRlbmQoUk9ULlNjaGVkdWxlcik7XG5cbi8qKlxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW1cbiAqIEBwYXJhbSB7Ym9vbH0gcmVwZWF0XG4gKiBAcGFyYW0ge251bWJlcn0gW3RpbWU9MV1cbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNhZGRcbiAqL1xuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCwgdGltZSkge1xuXHR0aGlzLl9xdWV1ZS5hZGQoaXRlbSwgdGltZSB8fCB0aGlzLl9kZWZhdWx0RHVyYXRpb24pO1xuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuYWRkLmNhbGwodGhpcywgaXRlbSwgcmVwZWF0KTtcbn07XG5cblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjtcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmNsZWFyLmNhbGwodGhpcyk7XG59O1xuXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaXRlbSkge1xuXHRpZiAoaXRlbSA9PSB0aGlzLl9jdXJyZW50KSB7IHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uOyB9XG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5yZW1vdmUuY2FsbCh0aGlzLCBpdGVtKTtcbn07XG5cbi8qKlxuICogQHNlZSBST1QuU2NoZWR1bGVyI25leHRcbiAqL1xuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMuX2N1cnJlbnQgJiYgdGhpcy5fcmVwZWF0LmluZGV4T2YodGhpcy5fY3VycmVudCkgIT0gLTEpIHtcblx0XHR0aGlzLl9xdWV1ZS5hZGQodGhpcy5fY3VycmVudCwgdGhpcy5fZHVyYXRpb24gfHwgdGhpcy5fZGVmYXVsdER1cmF0aW9uKTtcblx0XHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjtcblx0fVxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xufTtcblxuLyoqXG4gKiBTZXQgZHVyYXRpb24gZm9yIHRoZSBhY3RpdmUgaXRlbVxuICovXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUuc2V0RHVyYXRpb24gPSBmdW5jdGlvbih0aW1lKSB7XG5cdGlmICh0aGlzLl9jdXJyZW50KSB7IHRoaXMuX2R1cmF0aW9uID0gdGltZTsgfVxuXHRyZXR1cm4gdGhpcztcbn07XG4vKipcbiAqIEBjbGFzcyBBc3luY2hyb25vdXMgbWFpbiBsb29wXG4gKiBAcGFyYW0ge1JPVC5TY2hlZHVsZXJ9IHNjaGVkdWxlclxuICovXG5ST1QuRW5naW5lID0gZnVuY3Rpb24oc2NoZWR1bGVyKSB7XG5cdHRoaXMuX3NjaGVkdWxlciA9IHNjaGVkdWxlcjtcblx0dGhpcy5fbG9jayA9IDE7XG59O1xuXG4vKipcbiAqIFN0YXJ0IHRoZSBtYWluIGxvb3AuIFdoZW4gdGhpcyBjYWxsIHJldHVybnMsIHRoZSBsb29wIGlzIGxvY2tlZC5cbiAqL1xuUk9ULkVuZ2luZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMudW5sb2NrKCk7XG59O1xuXG4vKipcbiAqIEludGVycnVwdCB0aGUgZW5naW5lIGJ5IGFuIGFzeW5jaHJvbm91cyBhY3Rpb25cbiAqL1xuUk9ULkVuZ2luZS5wcm90b3R5cGUubG9jayA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9sb2NrKys7XG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXN1bWUgZXhlY3V0aW9uIChwYXVzZWQgYnkgYSBwcmV2aW91cyBsb2NrKVxuICovXG5ST1QuRW5naW5lLnByb3RvdHlwZS51bmxvY2sgPSBmdW5jdGlvbigpIHtcblx0aWYgKCF0aGlzLl9sb2NrKSB7IHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCB1bmxvY2sgdW5sb2NrZWQgZW5naW5lXCIpOyB9XG5cdHRoaXMuX2xvY2stLTtcblxuXHR3aGlsZSAoIXRoaXMuX2xvY2spIHtcblx0XHR2YXIgYWN0b3IgPSB0aGlzLl9zY2hlZHVsZXIubmV4dCgpO1xuXHRcdGlmICghYWN0b3IpIHsgcmV0dXJuIHRoaXMubG9jaygpOyB9IC8qIG5vIGFjdG9ycyAqL1xuXHRcdHZhciByZXN1bHQgPSBhY3Rvci5hY3QoKTtcblx0XHRpZiAocmVzdWx0ICYmIHJlc3VsdC50aGVuKSB7IC8qIGFjdG9yIHJldHVybmVkIGEgXCJ0aGVuYWJsZVwiLCBsb29rcyBsaWtlIGEgUHJvbWlzZSAqL1xuXHRcdFx0dGhpcy5sb2NrKCk7XG5cdFx0XHRyZXN1bHQudGhlbih0aGlzLnVubG9jay5iaW5kKHRoaXMpKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG4vKipcbiAqIEBjbGFzcyBCYXNlIG1hcCBnZW5lcmF0b3JcbiAqIEBwYXJhbSB7aW50fSBbd2lkdGg9Uk9ULkRFRkFVTFRfV0lEVEhdXG4gKiBAcGFyYW0ge2ludH0gW2hlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXG4gKi9cblJPVC5NYXAgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG5cdHRoaXMuX3dpZHRoID0gd2lkdGggfHwgUk9ULkRFRkFVTFRfV0lEVEg7XG5cdHRoaXMuX2hlaWdodCA9IGhlaWdodCB8fCBST1QuREVGQVVMVF9IRUlHSFQ7XG59O1xuXG5ST1QuTWFwLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge307XG5cblJPVC5NYXAucHJvdG90eXBlLl9maWxsTWFwID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dmFyIG1hcCA9IFtdO1xuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcblx0XHRtYXAucHVzaChbXSk7XG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykgeyBtYXBbaV0ucHVzaCh2YWx1ZSk7IH1cblx0fVxuXHRyZXR1cm4gbWFwO1xufTtcbi8qKlxuICogQGNsYXNzIFNpbXBsZSBlbXB0eSByZWN0YW5ndWxhciByb29tXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxuICovXG5ST1QuTWFwLkFyZW5hID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XG59O1xuUk9ULk1hcC5BcmVuYS5leHRlbmQoUk9ULk1hcCk7XG5cblJPVC5NYXAuQXJlbmEucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdHZhciB3ID0gdGhpcy5fd2lkdGgtMTtcblx0dmFyIGggPSB0aGlzLl9oZWlnaHQtMTtcblx0Zm9yICh2YXIgaT0wO2k8PXc7aSsrKSB7XG5cdFx0Zm9yICh2YXIgaj0wO2o8PWg7aisrKSB7XG5cdFx0XHR2YXIgZW1wdHkgPSAoaSAmJiBqICYmIGk8dyAmJiBqPGgpO1xuXHRcdFx0Y2FsbGJhY2soaSwgaiwgZW1wdHkgPyAwIDogMSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0aGlzO1xufTtcbi8qKlxuICogQGNsYXNzIFJlY3Vyc2l2ZWx5IGRpdmlkZWQgbWF6ZSwgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NYXplX2dlbmVyYXRpb25fYWxnb3JpdGhtI1JlY3Vyc2l2ZV9kaXZpc2lvbl9tZXRob2RcbiAqIEBhdWdtZW50cyBST1QuTWFwXG4gKi9cblJPVC5NYXAuRGl2aWRlZE1hemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcblx0dGhpcy5fc3RhY2sgPSBbXTtcbn07XG5ST1QuTWFwLkRpdmlkZWRNYXplLmV4dGVuZChST1QuTWFwKTtcblxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0dmFyIHcgPSB0aGlzLl93aWR0aDtcblx0dmFyIGggPSB0aGlzLl9oZWlnaHQ7XG5cdFxuXHR0aGlzLl9tYXAgPSBbXTtcblx0XG5cdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XG5cdFx0dGhpcy5fbWFwLnB1c2goW10pO1xuXHRcdGZvciAodmFyIGo9MDtqPGg7aisrKSB7XG5cdFx0XHR2YXIgYm9yZGVyID0gKGkgPT0gMCB8fCBqID09IDAgfHwgaSsxID09IHcgfHwgaisxID09IGgpO1xuXHRcdFx0dGhpcy5fbWFwW2ldLnB1c2goYm9yZGVyID8gMSA6IDApO1xuXHRcdH1cblx0fVxuXHRcblx0dGhpcy5fc3RhY2sgPSBbXG5cdFx0WzEsIDEsIHctMiwgaC0yXVxuXHRdO1xuXHR0aGlzLl9wcm9jZXNzKCk7XG5cdFxuXHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xuXHRcdGZvciAodmFyIGo9MDtqPGg7aisrKSB7XG5cdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xuXHRcdH1cblx0fVxuXHR0aGlzLl9tYXAgPSBudWxsO1xuXHRyZXR1cm4gdGhpcztcbn07XG5cblJPVC5NYXAuRGl2aWRlZE1hemUucHJvdG90eXBlLl9wcm9jZXNzID0gZnVuY3Rpb24oKSB7XG5cdHdoaWxlICh0aGlzLl9zdGFjay5sZW5ndGgpIHtcblx0XHR2YXIgcm9vbSA9IHRoaXMuX3N0YWNrLnNoaWZ0KCk7IC8qIFtsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b21dICovXG5cdFx0dGhpcy5fcGFydGl0aW9uUm9vbShyb29tKTtcblx0fVxufTtcblxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5wcm90b3R5cGUuX3BhcnRpdGlvblJvb20gPSBmdW5jdGlvbihyb29tKSB7XG5cdHZhciBhdmFpbFggPSBbXTtcblx0dmFyIGF2YWlsWSA9IFtdO1xuXHRcblx0Zm9yICh2YXIgaT1yb29tWzBdKzE7aTxyb29tWzJdO2krKykge1xuXHRcdHZhciB0b3AgPSB0aGlzLl9tYXBbaV1bcm9vbVsxXS0xXTtcblx0XHR2YXIgYm90dG9tID0gdGhpcy5fbWFwW2ldW3Jvb21bM10rMV07XG5cdFx0aWYgKHRvcCAmJiBib3R0b20gJiYgIShpICUgMikpIHsgYXZhaWxYLnB1c2goaSk7IH1cblx0fVxuXHRcblx0Zm9yICh2YXIgaj1yb29tWzFdKzE7ajxyb29tWzNdO2orKykge1xuXHRcdHZhciBsZWZ0ID0gdGhpcy5fbWFwW3Jvb21bMF0tMV1bal07XG5cdFx0dmFyIHJpZ2h0ID0gdGhpcy5fbWFwW3Jvb21bMl0rMV1bal07XG5cdFx0aWYgKGxlZnQgJiYgcmlnaHQgJiYgIShqICUgMikpIHsgYXZhaWxZLnB1c2goaik7IH1cblx0fVxuXG5cdGlmICghYXZhaWxYLmxlbmd0aCB8fCAhYXZhaWxZLmxlbmd0aCkgeyByZXR1cm47IH1cblxuXHR2YXIgeCA9IGF2YWlsWC5yYW5kb20oKTtcblx0dmFyIHkgPSBhdmFpbFkucmFuZG9tKCk7XG5cdFxuXHR0aGlzLl9tYXBbeF1beV0gPSAxO1xuXHRcblx0dmFyIHdhbGxzID0gW107XG5cdFxuXHR2YXIgdyA9IFtdOyB3YWxscy5wdXNoKHcpOyAvKiBsZWZ0IHBhcnQgKi9cblx0Zm9yICh2YXIgaT1yb29tWzBdOyBpPHg7IGkrKykgeyBcblx0XHR0aGlzLl9tYXBbaV1beV0gPSAxO1xuXHRcdHcucHVzaChbaSwgeV0pOyBcblx0fVxuXHRcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogcmlnaHQgcGFydCAqL1xuXHRmb3IgKHZhciBpPXgrMTsgaTw9cm9vbVsyXTsgaSsrKSB7IFxuXHRcdHRoaXMuX21hcFtpXVt5XSA9IDE7XG5cdFx0dy5wdXNoKFtpLCB5XSk7IFxuXHR9XG5cblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogdG9wIHBhcnQgKi9cblx0Zm9yICh2YXIgaj1yb29tWzFdOyBqPHk7IGorKykgeyBcblx0XHR0aGlzLl9tYXBbeF1bal0gPSAxO1xuXHRcdHcucHVzaChbeCwgal0pOyBcblx0fVxuXHRcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogYm90dG9tIHBhcnQgKi9cblx0Zm9yICh2YXIgaj15KzE7IGo8PXJvb21bM107IGorKykgeyBcblx0XHR0aGlzLl9tYXBbeF1bal0gPSAxO1xuXHRcdHcucHVzaChbeCwgal0pOyBcblx0fVxuXHRcdFxuXHR2YXIgc29saWQgPSB3YWxscy5yYW5kb20oKTtcblx0Zm9yICh2YXIgaT0wO2k8d2FsbHMubGVuZ3RoO2krKykge1xuXHRcdHZhciB3ID0gd2FsbHNbaV07XG5cdFx0aWYgKHcgPT0gc29saWQpIHsgY29udGludWU7IH1cblx0XHRcblx0XHR2YXIgaG9sZSA9IHcucmFuZG9tKCk7XG5cdFx0dGhpcy5fbWFwW2hvbGVbMF1dW2hvbGVbMV1dID0gMDtcblx0fVxuXG5cdHRoaXMuX3N0YWNrLnB1c2goW3Jvb21bMF0sIHJvb21bMV0sIHgtMSwgeS0xXSk7IC8qIGxlZnQgdG9wICovXG5cdHRoaXMuX3N0YWNrLnB1c2goW3grMSwgcm9vbVsxXSwgcm9vbVsyXSwgeS0xXSk7IC8qIHJpZ2h0IHRvcCAqL1xuXHR0aGlzLl9zdGFjay5wdXNoKFtyb29tWzBdLCB5KzEsIHgtMSwgcm9vbVszXV0pOyAvKiBsZWZ0IGJvdHRvbSAqL1xuXHR0aGlzLl9zdGFjay5wdXNoKFt4KzEsIHkrMSwgcm9vbVsyXSwgcm9vbVszXV0pOyAvKiByaWdodCBib3R0b20gKi9cbn07XG4vKipcbiAqIEBjbGFzcyBJY2V5J3MgTWF6ZSBnZW5lcmF0b3JcbiAqIFNlZSBodHRwOi8vd3d3LnJvZ3VlYmFzaW4ucm9ndWVsaWtlZGV2ZWxvcG1lbnQub3JnL2luZGV4LnBocD90aXRsZT1TaW1wbGVfbWF6ZSBmb3IgZXhwbGFuYXRpb25cbiAqIEBhdWdtZW50cyBST1QuTWFwXG4gKi9cblJPVC5NYXAuSWNleU1hemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCByZWd1bGFyaXR5KSB7XG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcblx0dGhpcy5fcmVndWxhcml0eSA9IHJlZ3VsYXJpdHkgfHwgMDtcbn07XG5ST1QuTWFwLkljZXlNYXplLmV4dGVuZChST1QuTWFwKTtcblxuUk9ULk1hcC5JY2V5TWF6ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0dmFyIHdpZHRoID0gdGhpcy5fd2lkdGg7XG5cdHZhciBoZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XG5cdFxuXHR2YXIgbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcblx0XG5cdHdpZHRoIC09ICh3aWR0aCAlIDIgPyAxIDogMik7XG5cdGhlaWdodCAtPSAoaGVpZ2h0ICUgMiA/IDEgOiAyKTtcblxuXHR2YXIgY3ggPSAwO1xuXHR2YXIgY3kgPSAwO1xuXHR2YXIgbnggPSAwO1xuXHR2YXIgbnkgPSAwO1xuXG5cdHZhciBkb25lID0gMDtcblx0dmFyIGJsb2NrZWQgPSBmYWxzZTtcblx0dmFyIGRpcnMgPSBbXG5cdFx0WzAsIDBdLFxuXHRcdFswLCAwXSxcblx0XHRbMCwgMF0sXG5cdFx0WzAsIDBdXG5cdF07XG5cdGRvIHtcblx0XHRjeCA9IDEgKyAyKk1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqKHdpZHRoLTEpIC8gMik7XG5cdFx0Y3kgPSAxICsgMipNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKihoZWlnaHQtMSkgLyAyKTtcblxuXHRcdGlmICghZG9uZSkgeyBtYXBbY3hdW2N5XSA9IDA7IH1cblx0XHRcblx0XHRpZiAoIW1hcFtjeF1bY3ldKSB7XG5cdFx0XHR0aGlzLl9yYW5kb21pemUoZGlycyk7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdGlmIChNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKih0aGlzLl9yZWd1bGFyaXR5KzEpKSA9PSAwKSB7IHRoaXMuX3JhbmRvbWl6ZShkaXJzKTsgfVxuXHRcdFx0XHRibG9ja2VkID0gdHJ1ZTtcblx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8NDtpKyspIHtcblx0XHRcdFx0XHRueCA9IGN4ICsgZGlyc1tpXVswXSoyO1xuXHRcdFx0XHRcdG55ID0gY3kgKyBkaXJzW2ldWzFdKjI7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2lzRnJlZShtYXAsIG54LCBueSwgd2lkdGgsIGhlaWdodCkpIHtcblx0XHRcdFx0XHRcdG1hcFtueF1bbnldID0gMDtcblx0XHRcdFx0XHRcdG1hcFtjeCArIGRpcnNbaV1bMF1dW2N5ICsgZGlyc1tpXVsxXV0gPSAwO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRjeCA9IG54O1xuXHRcdFx0XHRcdFx0Y3kgPSBueTtcblx0XHRcdFx0XHRcdGJsb2NrZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGRvbmUrKztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSB3aGlsZSAoIWJsb2NrZWQpO1xuXHRcdH1cblx0fSB3aGlsZSAoZG9uZSsxIDwgd2lkdGgqaGVpZ2h0LzQpO1xuXHRcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xuXHRcdFx0Y2FsbGJhY2soaSwgaiwgbWFwW2ldW2pdKTtcblx0XHR9XG5cdH1cblx0dGhpcy5fbWFwID0gbnVsbDtcblx0cmV0dXJuIHRoaXM7XG59O1xuXG5ST1QuTWFwLkljZXlNYXplLnByb3RvdHlwZS5fcmFuZG9taXplID0gZnVuY3Rpb24oZGlycykge1xuXHRmb3IgKHZhciBpPTA7aTw0O2krKykge1xuXHRcdGRpcnNbaV1bMF0gPSAwO1xuXHRcdGRpcnNbaV1bMV0gPSAwO1xuXHR9XG5cdFxuXHRzd2l0Y2ggKE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqNCkpIHtcblx0XHRjYXNlIDA6XG5cdFx0XHRkaXJzWzBdWzBdID0gLTE7IGRpcnNbMV1bMF0gPSAxO1xuXHRcdFx0ZGlyc1syXVsxXSA9IC0xOyBkaXJzWzNdWzFdID0gMTtcblx0XHRicmVhaztcblx0XHRjYXNlIDE6XG5cdFx0XHRkaXJzWzNdWzBdID0gLTE7IGRpcnNbMl1bMF0gPSAxO1xuXHRcdFx0ZGlyc1sxXVsxXSA9IC0xOyBkaXJzWzBdWzFdID0gMTtcblx0XHRicmVhaztcblx0XHRjYXNlIDI6XG5cdFx0XHRkaXJzWzJdWzBdID0gLTE7IGRpcnNbM11bMF0gPSAxO1xuXHRcdFx0ZGlyc1swXVsxXSA9IC0xOyBkaXJzWzFdWzFdID0gMTtcblx0XHRicmVhaztcblx0XHRjYXNlIDM6XG5cdFx0XHRkaXJzWzFdWzBdID0gLTE7IGRpcnNbMF1bMF0gPSAxO1xuXHRcdFx0ZGlyc1szXVsxXSA9IC0xOyBkaXJzWzJdWzFdID0gMTtcblx0XHRicmVhaztcblx0fVxufTtcblxuUk9ULk1hcC5JY2V5TWF6ZS5wcm90b3R5cGUuX2lzRnJlZSA9IGZ1bmN0aW9uKG1hcCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuXHRpZiAoeCA8IDEgfHwgeSA8IDEgfHwgeCA+PSB3aWR0aCB8fCB5ID49IGhlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cblx0cmV0dXJuIG1hcFt4XVt5XTtcbn07XG4vKipcbiAqIEBjbGFzcyBNYXplIGdlbmVyYXRvciAtIEVsbGVyJ3MgYWxnb3JpdGhtXG4gKiBTZWUgaHR0cDovL2hvbWVwYWdlcy5jd2kubmwvfnRyb21wL21hemUuaHRtbCBmb3IgZXhwbGFuYXRpb25cbiAqIEBhdWdtZW50cyBST1QuTWFwXG4gKi9cblJPVC5NYXAuRWxsZXJNYXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XG59O1xuUk9ULk1hcC5FbGxlck1hemUuZXh0ZW5kKFJPVC5NYXApO1xuXG5ST1QuTWFwLkVsbGVyTWF6ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0dmFyIG1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG5cdHZhciB3ID0gTWF0aC5jZWlsKCh0aGlzLl93aWR0aC0yKS8yKTtcblx0XG5cdHZhciByYW5kID0gOS8yNDtcblx0XG5cdHZhciBMID0gW107XG5cdHZhciBSID0gW107XG5cdFxuXHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xuXHRcdEwucHVzaChpKTtcblx0XHRSLnB1c2goaSk7XG5cdH1cblx0TC5wdXNoKHctMSk7IC8qIGZha2Ugc3RvcC1ibG9jayBhdCB0aGUgcmlnaHQgc2lkZSAqL1xuXG5cdGZvciAodmFyIGo9MTtqKzM8dGhpcy5faGVpZ2h0O2orPTIpIHtcblx0XHQvKiBvbmUgcm93ICovXG5cdFx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcblx0XHRcdC8qIGNlbGwgY29vcmRzICh3aWxsIGJlIGFsd2F5cyBlbXB0eSkgKi9cblx0XHRcdHZhciB4ID0gMippKzE7XG5cdFx0XHR2YXIgeSA9IGo7XG5cdFx0XHRtYXBbeF1beV0gPSAwO1xuXHRcdFx0XG5cdFx0XHQvKiByaWdodCBjb25uZWN0aW9uICovXG5cdFx0XHRpZiAoaSAhPSBMW2krMV0gJiYgUk9ULlJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSB7XG5cdFx0XHRcdHRoaXMuX2FkZFRvTGlzdChpLCBMLCBSKTtcblx0XHRcdFx0bWFwW3grMV1beV0gPSAwO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvKiBib3R0b20gY29ubmVjdGlvbiAqL1xuXHRcdFx0aWYgKGkgIT0gTFtpXSAmJiBST1QuUk5HLmdldFVuaWZvcm0oKSA+IHJhbmQpIHtcblx0XHRcdFx0LyogcmVtb3ZlIGNvbm5lY3Rpb24gKi9cblx0XHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUxpc3QoaSwgTCwgUik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvKiBjcmVhdGUgY29ubmVjdGlvbiAqL1xuXHRcdFx0XHRtYXBbeF1beSsxXSA9IDA7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyogbGFzdCByb3cgKi9cblx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcblx0XHQvKiBjZWxsIGNvb3JkcyAod2lsbCBiZSBhbHdheXMgZW1wdHkpICovXG5cdFx0dmFyIHggPSAyKmkrMTtcblx0XHR2YXIgeSA9IGo7XG5cdFx0bWFwW3hdW3ldID0gMDtcblx0XHRcblx0XHQvKiByaWdodCBjb25uZWN0aW9uICovXG5cdFx0aWYgKGkgIT0gTFtpKzFdICYmIChpID09IExbaV0gfHwgUk9ULlJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSkge1xuXHRcdFx0LyogZGlnIHJpZ2h0IGFsc28gaWYgdGhlIGNlbGwgaXMgc2VwYXJhdGVkLCBzbyBpdCBnZXRzIGNvbm5lY3RlZCB0byB0aGUgcmVzdCBvZiBtYXplICovXG5cdFx0XHR0aGlzLl9hZGRUb0xpc3QoaSwgTCwgUik7XG5cdFx0XHRtYXBbeCsxXVt5XSA9IDA7XG5cdFx0fVxuXHRcdFxuXHRcdHRoaXMuX3JlbW92ZUZyb21MaXN0KGksIEwsIFIpO1xuXHR9XG5cdFxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcblx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XG5cdFx0XHRjYWxsYmFjayhpLCBqLCBtYXBbaV1bal0pO1xuXHRcdH1cblx0fVxuXHRcblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBcImlcIiBmcm9tIGl0cyBsaXN0XG4gKi9cblJPVC5NYXAuRWxsZXJNYXplLnByb3RvdHlwZS5fcmVtb3ZlRnJvbUxpc3QgPSBmdW5jdGlvbihpLCBMLCBSKSB7XG5cdFJbTFtpXV0gPSBSW2ldO1xuXHRMW1JbaV1dID0gTFtpXTtcblx0UltpXSA9IGk7XG5cdExbaV0gPSBpO1xufTtcblxuLyoqXG4gKiBKb2luIGxpc3RzIHdpdGggXCJpXCIgYW5kIFwiaSsxXCJcbiAqL1xuUk9ULk1hcC5FbGxlck1hemUucHJvdG90eXBlLl9hZGRUb0xpc3QgPSBmdW5jdGlvbihpLCBMLCBSKSB7XG5cdFJbTFtpKzFdXSA9IFJbaV07XG5cdExbUltpXV0gPSBMW2krMV07XG5cdFJbaV0gPSBpKzE7XG5cdExbaSsxXSA9IGk7XG59O1xuLyoqXG4gKiBAY2xhc3MgQ2VsbHVsYXIgYXV0b21hdG9uIG1hcCBnZW5lcmF0b3JcbiAqIEBhdWdtZW50cyBST1QuTWFwXG4gKiBAcGFyYW0ge2ludH0gW3dpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxuICogQHBhcmFtIHtpbnR9IFtoZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBPcHRpb25zXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5ib3JuXSBMaXN0IG9mIG5laWdoYm9yIGNvdW50cyBmb3IgYSBuZXcgY2VsbCB0byBiZSBib3JuIGluIGVtcHR5IHNwYWNlXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5zdXJ2aXZlXSBMaXN0IG9mIG5laWdoYm9yIGNvdW50cyBmb3IgYW4gZXhpc3RpbmcgIGNlbGwgdG8gc3Vydml2ZVxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5XSBUb3BvbG9neSA0IG9yIDYgb3IgOFxuICovXG5ST1QuTWFwLkNlbGx1bGFyID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XG5cdHRoaXMuX29wdGlvbnMgPSB7XG5cdFx0Ym9ybjogWzUsIDYsIDcsIDhdLFxuXHRcdHN1cnZpdmU6IFs0LCA1LCA2LCA3LCA4XSxcblx0XHR0b3BvbG9neTogOFxuXHR9O1xuXHR0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG5cblx0dGhpcy5fZGlycyA9IFJPVC5ESVJTW3RoaXMuX29wdGlvbnMudG9wb2xvZ3ldO1xuXHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDApO1xufTtcblJPVC5NYXAuQ2VsbHVsYXIuZXh0ZW5kKFJPVC5NYXApO1xuXG4vKipcbiAqIEZpbGwgdGhlIG1hcCB3aXRoIHJhbmRvbSB2YWx1ZXNcbiAqIEBwYXJhbSB7ZmxvYXR9IHByb2JhYmlsaXR5IFByb2JhYmlsaXR5IGZvciBhIGNlbGwgdG8gYmVjb21lIGFsaXZlOyAwID0gYWxsIGVtcHR5LCAxID0gYWxsIGZ1bGxcbiAqL1xuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUucmFuZG9taXplID0gZnVuY3Rpb24ocHJvYmFiaWxpdHkpIHtcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xuXHRcdFx0dGhpcy5fbWFwW2ldW2pdID0gKFJPVC5STkcuZ2V0VW5pZm9ybSgpIDwgcHJvYmFiaWxpdHkgPyAxIDogMCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDaGFuZ2Ugb3B0aW9ucy5cbiAqIEBzZWUgUk9ULk1hcC5DZWxsdWxhclxuICovXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cbn07XG5cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHksIHZhbHVlKSB7XG5cdHRoaXMuX21hcFt4XVt5XSA9IHZhbHVlO1xufTtcblxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0dmFyIG5ld01hcCA9IHRoaXMuX2ZpbGxNYXAoMCk7XG5cdHZhciBib3JuID0gdGhpcy5fb3B0aW9ucy5ib3JuO1xuXHR2YXIgc3Vydml2ZSA9IHRoaXMuX29wdGlvbnMuc3Vydml2ZTtcblxuXG5cdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcblx0XHR2YXIgd2lkdGhTdGVwID0gMTtcblx0XHR2YXIgd2lkdGhTdGFydCA9IDA7XG5cdFx0aWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gNikge1xuXHRcdFx0d2lkdGhTdGVwID0gMjtcblx0XHRcdHdpZHRoU3RhcnQgPSBqJTI7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaT13aWR0aFN0YXJ0OyBpPHRoaXMuX3dpZHRoOyBpKz13aWR0aFN0ZXApIHtcblxuXHRcdFx0dmFyIGN1ciA9IHRoaXMuX21hcFtpXVtqXTtcblx0XHRcdHZhciBuY291bnQgPSB0aGlzLl9nZXROZWlnaGJvcnMoaSwgaik7XG5cblx0XHRcdGlmIChjdXIgJiYgc3Vydml2ZS5pbmRleE9mKG5jb3VudCkgIT0gLTEpIHsgLyogc3Vydml2ZSAqL1xuXHRcdFx0XHRuZXdNYXBbaV1bal0gPSAxO1xuXHRcdFx0fSBlbHNlIGlmICghY3VyICYmIGJvcm4uaW5kZXhPZihuY291bnQpICE9IC0xKSB7IC8qIGJvcm4gKi9cblx0XHRcdFx0bmV3TWFwW2ldW2pdID0gMTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHR0aGlzLl9tYXAgPSBuZXdNYXA7XG5cblx0dGhpcy5zZXJ2aWNlQ2FsbGJhY2soY2FsbGJhY2spO1xufTtcblxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuc2VydmljZUNhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0aWYgKCFjYWxsYmFjaykgeyByZXR1cm47IH1cblxuXHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XG5cdFx0dmFyIHdpZHRoU3RlcCA9IDE7XG5cdFx0dmFyIHdpZHRoU3RhcnQgPSAwO1xuXHRcdGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDYpIHtcblx0XHRcdHdpZHRoU3RlcCA9IDI7XG5cdFx0XHR3aWR0aFN0YXJ0ID0gaiUyO1xuXHRcdH1cblx0XHRmb3IgKHZhciBpPXdpZHRoU3RhcnQ7IGk8dGhpcy5fd2lkdGg7IGkrPXdpZHRoU3RlcCkge1xuXHRcdFx0Y2FsbGJhY2soaSwgaiwgdGhpcy5fbWFwW2ldW2pdKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qKlxuICogR2V0IG5laWdoYm9yIGNvdW50IGF0IFtpLGpdIGluIHRoaXMuX21hcFxuICovXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZ2V0TmVpZ2hib3JzID0gZnVuY3Rpb24oY3gsIGN5KSB7XG5cdHZhciByZXN1bHQgPSAwO1xuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9kaXJzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgZGlyID0gdGhpcy5fZGlyc1tpXTtcblx0XHR2YXIgeCA9IGN4ICsgZGlyWzBdO1xuXHRcdHZhciB5ID0gY3kgKyBkaXJbMV07XG5cblx0XHRpZiAoeCA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5IDwgMCB8fCB5ID49IHRoaXMuX3dpZHRoKSB7IGNvbnRpbnVlOyB9XG5cdFx0cmVzdWx0ICs9ICh0aGlzLl9tYXBbeF1beV0gPT0gMSA/IDEgOiAwKTtcblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIE1ha2Ugc3VyZSBldmVyeSBub24td2FsbCBzcGFjZSBpcyBhY2Nlc3NpYmxlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdG8gY2FsbCB0byBkaXNwbGF5IG1hcCB3aGVuIGRvXG4gKiBAcGFyYW0ge2ludH0gdmFsdWUgdG8gY29uc2lkZXIgZW1wdHkgc3BhY2UgLSBkZWZhdWx0cyB0byAwXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayB0byBjYWxsIHdoZW4gYSBuZXcgY29ubmVjdGlvbiBpcyBtYWRlXG4gKi9cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbihjYWxsYmFjaywgdmFsdWUsIGNvbm5lY3Rpb25DYWxsYmFjaykge1xuXHRpZiAoIXZhbHVlKSB2YWx1ZSA9IDA7XG5cblx0dmFyIGFsbEZyZWVTcGFjZSA9IFtdO1xuXHR2YXIgbm90Q29ubmVjdGVkID0ge307XG5cdC8vIGZpbmQgYWxsIGZyZWUgc3BhY2Vcblx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLl93aWR0aDsgeCsrKSB7XG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLl9oZWlnaHQ7IHkrKykge1xuXHRcdFx0aWYgKHRoaXMuX2ZyZWVTcGFjZSh4LCB5LCB2YWx1ZSkpIHtcblx0XHRcdFx0dmFyIHAgPSBbeCwgeV07XG5cdFx0XHRcdG5vdENvbm5lY3RlZFt0aGlzLl9wb2ludEtleShwKV0gPSBwO1xuXHRcdFx0XHRhbGxGcmVlU3BhY2UucHVzaChbeCwgeV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHR2YXIgc3RhcnQgPSBhbGxGcmVlU3BhY2VbUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGFsbEZyZWVTcGFjZS5sZW5ndGggLSAxKV07XG5cblx0dmFyIGtleSA9IHRoaXMuX3BvaW50S2V5KHN0YXJ0KTtcblx0dmFyIGNvbm5lY3RlZCA9IHt9O1xuXHRjb25uZWN0ZWRba2V5XSA9IHN0YXJ0O1xuXHRkZWxldGUgbm90Q29ubmVjdGVkW2tleV07XG5cblx0Ly8gZmluZCB3aGF0J3MgY29ubmVjdGVkIHRvIHRoZSBzdGFydGluZyBwb2ludFxuXHR0aGlzLl9maW5kQ29ubmVjdGVkKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCBbc3RhcnRdLCBmYWxzZSwgdmFsdWUpO1xuXG5cdHdoaWxlIChPYmplY3Qua2V5cyhub3RDb25uZWN0ZWQpLmxlbmd0aCA+IDApIHtcblxuXHRcdC8vIGZpbmQgdHdvIHBvaW50cyBmcm9tIG5vdENvbm5lY3RlZCB0byBjb25uZWN0ZWRcblx0XHR2YXIgcCA9IHRoaXMuX2dldEZyb21Ubyhjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCk7XG5cdFx0dmFyIGZyb20gPSBwWzBdOyAvLyBub3RDb25uZWN0ZWRcblx0XHR2YXIgdG8gPSBwWzFdOyAvLyBjb25uZWN0ZWRcblxuXHRcdC8vIGZpbmQgZXZlcnl0aGluZyBjb25uZWN0ZWQgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XG5cdFx0dmFyIGxvY2FsID0ge307XG5cdFx0bG9jYWxbdGhpcy5fcG9pbnRLZXkoZnJvbSldID0gZnJvbTtcblx0XHR0aGlzLl9maW5kQ29ubmVjdGVkKGxvY2FsLCBub3RDb25uZWN0ZWQsIFtmcm9tXSwgdHJ1ZSwgdmFsdWUpO1xuXG5cdFx0Ly8gY29ubmVjdCB0byBhIGNvbm5lY3RlZCBzcXVhcmVcblx0XHR0aGlzLl90dW5uZWxUb0Nvbm5lY3RlZCh0bywgZnJvbSwgY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHZhbHVlLCBjb25uZWN0aW9uQ2FsbGJhY2spO1xuXG5cdFx0Ly8gbm93IGFsbCBvZiBsb2NhbCBpcyBjb25uZWN0ZWRcblx0XHRmb3IgKHZhciBrIGluIGxvY2FsKSB7XG5cdFx0XHR2YXIgcHAgPSBsb2NhbFtrXTtcblx0XHRcdHRoaXMuX21hcFtwcFswXV1bcHBbMV1dID0gdmFsdWU7XG5cdFx0XHRjb25uZWN0ZWRba10gPSBwcDtcblx0XHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRba107XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5zZXJ2aWNlQ2FsbGJhY2soY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBGaW5kIHJhbmRvbSBwb2ludHMgdG8gY29ubmVjdC4gU2VhcmNoIGZvciB0aGUgY2xvc2VzdCBwb2ludCBpbiB0aGUgbGFyZ2VyIHNwYWNlLlxuICogVGhpcyBpcyB0byBtaW5pbWl6ZSB0aGUgbGVuZ3RoIG9mIHRoZSBwYXNzYWdlIHdoaWxlIG1haW50YWluaW5nIGdvb2QgcGVyZm9ybWFuY2UuXG4gKi9cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9nZXRGcm9tVG8gPSBmdW5jdGlvbihjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCkge1xuXHR2YXIgZnJvbSwgdG8sIGQ7XG5cdHZhciBjb25uZWN0ZWRLZXlzID0gT2JqZWN0LmtleXMoY29ubmVjdGVkKTtcblx0dmFyIG5vdENvbm5lY3RlZEtleXMgPSBPYmplY3Qua2V5cyhub3RDb25uZWN0ZWQpO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xuXHRcdGlmIChjb25uZWN0ZWRLZXlzLmxlbmd0aCA8IG5vdENvbm5lY3RlZEtleXMubGVuZ3RoKSB7XG5cdFx0XHR2YXIga2V5cyA9IGNvbm5lY3RlZEtleXM7XG5cdFx0XHR0byA9IGNvbm5lY3RlZFtrZXlzW1JPVC5STkcuZ2V0VW5pZm9ybUludCgwLCBrZXlzLmxlbmd0aCAtIDEpXV07XG5cdFx0XHRmcm9tID0gdGhpcy5fZ2V0Q2xvc2VzdCh0bywgbm90Q29ubmVjdGVkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGtleXMgPSBub3RDb25uZWN0ZWRLZXlzO1xuXHRcdFx0ZnJvbSA9IG5vdENvbm5lY3RlZFtrZXlzW1JPVC5STkcuZ2V0VW5pZm9ybUludCgwLCBrZXlzLmxlbmd0aCAtIDEpXV07XG5cdFx0XHR0byA9IHRoaXMuX2dldENsb3Nlc3QoZnJvbSwgY29ubmVjdGVkKTtcblx0XHR9XG5cdFx0ZCA9IChmcm9tWzBdIC0gdG9bMF0pICogKGZyb21bMF0gLSB0b1swXSkgKyAoZnJvbVsxXSAtIHRvWzFdKSAqIChmcm9tWzFdIC0gdG9bMV0pO1xuXHRcdGlmIChkIDwgNjQpIHtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHQvLyBjb25zb2xlLmxvZyhcIj4+PiBjb25uZWN0ZWQ9XCIgKyB0byArIFwiIG5vdENvbm5lY3RlZD1cIiArIGZyb20gKyBcIiBkaXN0PVwiICsgZCk7XG5cdHJldHVybiBbZnJvbSwgdG9dO1xufTtcblxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX2dldENsb3Nlc3QgPSBmdW5jdGlvbihwb2ludCwgc3BhY2UpIHtcblx0dmFyIG1pblBvaW50ID0gbnVsbDtcblx0dmFyIG1pbkRpc3QgPSBudWxsO1xuXHRmb3IgKGsgaW4gc3BhY2UpIHtcblx0XHR2YXIgcCA9IHNwYWNlW2tdO1xuXHRcdHZhciBkID0gKHBbMF0gLSBwb2ludFswXSkgKiAocFswXSAtIHBvaW50WzBdKSArIChwWzFdIC0gcG9pbnRbMV0pICogKHBbMV0gLSBwb2ludFsxXSk7XG5cdFx0aWYgKG1pbkRpc3QgPT0gbnVsbCB8fCBkIDwgbWluRGlzdCkge1xuXHRcdFx0bWluRGlzdCA9IGQ7XG5cdFx0XHRtaW5Qb2ludCA9IHA7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBtaW5Qb2ludDtcbn07XG5cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9maW5kQ29ubmVjdGVkID0gZnVuY3Rpb24oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHN0YWNrLCBrZWVwTm90Q29ubmVjdGVkLCB2YWx1ZSkge1xuXHR3aGlsZShzdGFjay5sZW5ndGggPiAwKSB7XG5cdFx0dmFyIHAgPSBzdGFjay5zcGxpY2UoMCwgMSlbMF07XG5cdFx0dmFyIHRlc3RzID0gW1xuXHRcdFx0W3BbMF0gKyAxLCBwWzFdXSxcblx0XHRcdFtwWzBdIC0gMSwgcFsxXV0sXG5cdFx0XHRbcFswXSwgICAgIHBbMV0gKyAxXSxcblx0XHRcdFtwWzBdLCAgICAgcFsxXSAtIDFdXG5cdFx0XTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRlc3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIga2V5ID0gdGhpcy5fcG9pbnRLZXkodGVzdHNbaV0pO1xuXHRcdFx0aWYgKGNvbm5lY3RlZFtrZXldID09IG51bGwgJiYgdGhpcy5fZnJlZVNwYWNlKHRlc3RzW2ldWzBdLCB0ZXN0c1tpXVsxXSwgdmFsdWUpKSB7XG5cdFx0XHRcdGNvbm5lY3RlZFtrZXldID0gdGVzdHNbaV07XG5cdFx0XHRcdGlmICgha2VlcE5vdENvbm5lY3RlZCkge1xuXHRcdFx0XHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRba2V5XTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzdGFjay5wdXNoKHRlc3RzW2ldKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG5cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl90dW5uZWxUb0Nvbm5lY3RlZCA9IGZ1bmN0aW9uKHRvLCBmcm9tLCBjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCwgdmFsdWUsIGNvbm5lY3Rpb25DYWxsYmFjaykge1xuXHR2YXIga2V5ID0gdGhpcy5fcG9pbnRLZXkoZnJvbSk7XG5cdHZhciBhLCBiO1xuXHRpZiAoZnJvbVswXSA8IHRvWzBdKSB7XG5cdFx0YSA9IGZyb207XG5cdFx0YiA9IHRvO1xuXHR9IGVsc2Uge1xuXHRcdGEgPSB0bztcblx0XHRiID0gZnJvbTtcblx0fVxuXHRmb3IgKHZhciB4eCA9IGFbMF07IHh4IDw9IGJbMF07IHh4KyspIHtcblx0XHR0aGlzLl9tYXBbeHhdW2FbMV1dID0gdmFsdWU7XG5cdFx0dmFyIHAgPSBbeHgsIGFbMV1dO1xuXHRcdHZhciBwa2V5ID0gdGhpcy5fcG9pbnRLZXkocCk7XG5cdFx0Y29ubmVjdGVkW3BrZXldID0gcDtcblx0XHRkZWxldGUgbm90Q29ubmVjdGVkW3BrZXldO1xuXHR9XG5cdGlmIChjb25uZWN0aW9uQ2FsbGJhY2sgJiYgYVswXSA8IGJbMF0pIHtcblx0XHRjb25uZWN0aW9uQ2FsbGJhY2soYSwgW2JbMF0sIGFbMV1dKTtcblx0fVxuXG5cdC8vIHggaXMgbm93IGZpeGVkXG5cdHZhciB4ID0gYlswXTtcblxuXHRpZiAoZnJvbVsxXSA8IHRvWzFdKSB7XG5cdFx0YSA9IGZyb207XG5cdFx0YiA9IHRvO1xuXHR9IGVsc2Uge1xuXHRcdGEgPSB0bztcblx0XHRiID0gZnJvbTtcblx0fVxuXHRmb3IgKHZhciB5eSA9IGFbMV07IHl5IDwgYlsxXTsgeXkrKykge1xuXHRcdHRoaXMuX21hcFt4XVt5eV0gPSB2YWx1ZTtcblx0XHR2YXIgcCA9IFt4LCB5eV07XG5cdFx0dmFyIHBrZXkgPSB0aGlzLl9wb2ludEtleShwKTtcblx0XHRjb25uZWN0ZWRbcGtleV0gPSBwO1xuXHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRbcGtleV07XG5cdH1cblx0aWYgKGNvbm5lY3Rpb25DYWxsYmFjayAmJiBhWzFdIDwgYlsxXSkge1xuXHRcdGNvbm5lY3Rpb25DYWxsYmFjayhbYlswXSwgYVsxXV0sIFtiWzBdLCBiWzFdXSk7XG5cdH1cbn07XG5cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9mcmVlU3BhY2UgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xuXHRyZXR1cm4geCA+PSAwICYmIHggPCB0aGlzLl93aWR0aCAmJiB5ID49IDAgJiYgeSA8IHRoaXMuX2hlaWdodCAmJiB0aGlzLl9tYXBbeF1beV0gPT0gdmFsdWU7XG59O1xuXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fcG9pbnRLZXkgPSBmdW5jdGlvbihwKSB7XG5cdHJldHVybiBwWzBdICsgXCIuXCIgKyBwWzFdO1xufTtcbi8qKlxuICogQGNsYXNzIER1bmdlb24gbWFwOiBoYXMgcm9vbXMgYW5kIGNvcnJpZG9yc1xuICogQGF1Z21lbnRzIFJPVC5NYXBcbiAqL1xuUk9ULk1hcC5EdW5nZW9uID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XG5cdHRoaXMuX3Jvb21zID0gW107IC8qIGxpc3Qgb2YgYWxsIHJvb21zICovXG5cdHRoaXMuX2NvcnJpZG9ycyA9IFtdO1xufTtcblJPVC5NYXAuRHVuZ2Vvbi5leHRlbmQoUk9ULk1hcCk7XG5cbi8qKlxuICogR2V0IGFsbCBnZW5lcmF0ZWQgcm9vbXNcbiAqIEByZXR1cm5zIHtST1QuTWFwLkZlYXR1cmUuUm9vbVtdfVxuICovXG5ST1QuTWFwLkR1bmdlb24ucHJvdG90eXBlLmdldFJvb21zID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl9yb29tcztcbn07XG5cbi8qKlxuICogR2V0IGFsbCBnZW5lcmF0ZWQgY29ycmlkb3JzXG4gKiBAcmV0dXJucyB7Uk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yW119XG4gKi9cblJPVC5NYXAuRHVuZ2Vvbi5wcm90b3R5cGUuZ2V0Q29ycmlkb3JzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl9jb3JyaWRvcnM7XG59O1xuLyoqXG4gKiBAY2xhc3MgUmFuZG9tIGR1bmdlb24gZ2VuZXJhdG9yIHVzaW5nIGh1bWFuLWxpa2UgZGlnZ2luZyBwYXR0ZXJucy5cbiAqIEhlYXZpbHkgYmFzZWQgb24gTWlrZSBBbmRlcnNvbidzIGlkZWFzIGZyb20gdGhlIFwiVHlyYW50XCIgYWxnbywgbWVudGlvbmVkIGF0IFxuICogaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9RHVuZ2Vvbi1CdWlsZGluZ19BbGdvcml0aG0uXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5EdW5nZW9uXG4gKi9cblJPVC5NYXAuRGlnZ2VyID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuXHRST1QuTWFwLkR1bmdlb24uY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcblx0XG5cdHRoaXMuX29wdGlvbnMgPSB7XG5cdFx0cm9vbVdpZHRoOiBbMywgOV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSB3aWR0aCAqL1xuXHRcdHJvb21IZWlnaHQ6IFszLCA1XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIGhlaWdodCAqL1xuXHRcdGNvcnJpZG9yTGVuZ3RoOiBbMywgMTBdLCAvKiBjb3JyaWRvciBtaW5pbXVtIGFuZCBtYXhpbXVtIGxlbmd0aCAqL1xuXHRcdGR1Z1BlcmNlbnRhZ2U6IDAuMiwgLyogd2Ugc3RvcCBhZnRlciB0aGlzIHBlcmNlbnRhZ2Ugb2YgbGV2ZWwgYXJlYSBoYXMgYmVlbiBkdWcgb3V0ICovXG5cdFx0dGltZUxpbWl0OiAxMDAwIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBtdWNoIHRpbWUgaGFzIHBhc3NlZCAobXNlYykgKi9cblx0fTtcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XG5cdFxuXHR0aGlzLl9mZWF0dXJlcyA9IHtcblx0XHRcIlJvb21cIjogNCxcblx0XHRcIkNvcnJpZG9yXCI6IDRcblx0fTtcblx0dGhpcy5fZmVhdHVyZUF0dGVtcHRzID0gMjA7IC8qIGhvdyBtYW55IHRpbWVzIGRvIHdlIHRyeSB0byBjcmVhdGUgYSBmZWF0dXJlIG9uIGEgc3VpdGFibGUgd2FsbCAqL1xuXHR0aGlzLl93YWxscyA9IHt9OyAvKiB0aGVzZSBhcmUgYXZhaWxhYmxlIGZvciBkaWdnaW5nICovXG5cdFxuXHR0aGlzLl9kaWdDYWxsYmFjayA9IHRoaXMuX2RpZ0NhbGxiYWNrLmJpbmQodGhpcyk7XG5cdHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2sgPSB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrLmJpbmQodGhpcyk7XG5cdHRoaXMuX2lzV2FsbENhbGxiYWNrID0gdGhpcy5faXNXYWxsQ2FsbGJhY2suYmluZCh0aGlzKTtcblx0dGhpcy5fcHJpb3JpdHlXYWxsQ2FsbGJhY2sgPSB0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xufTtcblJPVC5NYXAuRGlnZ2VyLmV4dGVuZChST1QuTWFwLkR1bmdlb24pO1xuXG4vKipcbiAqIENyZWF0ZSBhIG1hcFxuICogQHNlZSBST1QuTWFwI2NyZWF0ZVxuICovXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0dGhpcy5fcm9vbXMgPSBbXTtcblx0dGhpcy5fY29ycmlkb3JzID0gW107XG5cdHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG5cdHRoaXMuX3dhbGxzID0ge307XG5cdHRoaXMuX2R1ZyA9IDA7XG5cdHZhciBhcmVhID0gKHRoaXMuX3dpZHRoLTIpICogKHRoaXMuX2hlaWdodC0yKTtcblxuXHR0aGlzLl9maXJzdFJvb20oKTtcblx0XG5cdHZhciB0MSA9IERhdGUubm93KCk7XG5cblx0ZG8ge1xuXHRcdHZhciB0MiA9IERhdGUubm93KCk7XG5cdFx0aWYgKHQyIC0gdDEgPiB0aGlzLl9vcHRpb25zLnRpbWVMaW1pdCkgeyBicmVhazsgfVxuXG5cdFx0LyogZmluZCBhIGdvb2Qgd2FsbCAqL1xuXHRcdHZhciB3YWxsID0gdGhpcy5fZmluZFdhbGwoKTtcblx0XHRpZiAoIXdhbGwpIHsgYnJlYWs7IH0gLyogbm8gbW9yZSB3YWxscyAqL1xuXHRcdFxuXHRcdHZhciBwYXJ0cyA9IHdhbGwuc3BsaXQoXCIsXCIpO1xuXHRcdHZhciB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xuXHRcdHZhciBkaXIgPSB0aGlzLl9nZXREaWdnaW5nRGlyZWN0aW9uKHgsIHkpO1xuXHRcdGlmICghZGlyKSB7IGNvbnRpbnVlOyB9IC8qIHRoaXMgd2FsbCBpcyBub3Qgc3VpdGFibGUgKi9cblx0XHRcbi8vXHRcdGNvbnNvbGUubG9nKFwid2FsbFwiLCB4LCB5KTtcblxuXHRcdC8qIHRyeSBhZGRpbmcgYSBmZWF0dXJlICovXG5cdFx0dmFyIGZlYXR1cmVBdHRlbXB0cyA9IDA7XG5cdFx0ZG8ge1xuXHRcdFx0ZmVhdHVyZUF0dGVtcHRzKys7XG5cdFx0XHRpZiAodGhpcy5fdHJ5RmVhdHVyZSh4LCB5LCBkaXJbMF0sIGRpclsxXSkpIHsgLyogZmVhdHVyZSBhZGRlZCAqL1xuXHRcdFx0XHQvL2lmICh0aGlzLl9yb29tcy5sZW5ndGggKyB0aGlzLl9jb3JyaWRvcnMubGVuZ3RoID09IDIpIHsgdGhpcy5fcm9vbXNbMF0uYWRkRG9vcih4LCB5KTsgfSAvKiBmaXJzdCByb29tIG9maWNpYWxseSBoYXMgZG9vcnMgKi9cblx0XHRcdFx0dGhpcy5fcmVtb3ZlU3Vycm91bmRpbmdXYWxscyh4LCB5KTtcblx0XHRcdFx0dGhpcy5fcmVtb3ZlU3Vycm91bmRpbmdXYWxscyh4LWRpclswXSwgeS1kaXJbMV0pO1xuXHRcdFx0XHRicmVhazsgXG5cdFx0XHR9XG5cdFx0fSB3aGlsZSAoZmVhdHVyZUF0dGVtcHRzIDwgdGhpcy5fZmVhdHVyZUF0dGVtcHRzKTtcblx0XHRcblx0XHR2YXIgcHJpb3JpdHlXYWxscyA9IDA7XG5cdFx0Zm9yICh2YXIgaWQgaW4gdGhpcy5fd2FsbHMpIHsgXG5cdFx0XHRpZiAodGhpcy5fd2FsbHNbaWRdID4gMSkgeyBwcmlvcml0eVdhbGxzKys7IH1cblx0XHR9XG5cblx0fSB3aGlsZSAodGhpcy5fZHVnL2FyZWEgPCB0aGlzLl9vcHRpb25zLmR1Z1BlcmNlbnRhZ2UgfHwgcHJpb3JpdHlXYWxscyk7IC8qIGZpeG1lIG51bWJlciBvZiBwcmlvcml0eSB3YWxscyAqL1xuXG5cdHRoaXMuX2FkZERvb3JzKCk7XG5cblx0aWYgKGNhbGxiYWNrKSB7XG5cdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XG5cdFx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdFxuXHR0aGlzLl93YWxscyA9IHt9O1xuXHR0aGlzLl9tYXAgPSBudWxsO1xuXG5cdHJldHVybiB0aGlzO1xufTtcblxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9kaWdDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHksIHZhbHVlKSB7XG5cdGlmICh2YWx1ZSA9PSAwIHx8IHZhbHVlID09IDIpIHsgLyogZW1wdHkgKi9cblx0XHR0aGlzLl9tYXBbeF1beV0gPSAwO1xuXHRcdHRoaXMuX2R1ZysrO1xuXHR9IGVsc2UgeyAvKiB3YWxsICovXG5cdFx0dGhpcy5fd2FsbHNbeCtcIixcIit5XSA9IDE7XG5cdH1cbn07XG5cblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5faXNXYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XG5cdGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX3dpZHRoIHx8IHkgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxuXHRyZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcbn07XG5cblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fY2FuQmVEdWdDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0aWYgKHggPCAxIHx8IHkgPCAxIHx8IHgrMSA+PSB0aGlzLl93aWR0aCB8fCB5KzEgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxuXHRyZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcbn07XG5cblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fcHJpb3JpdHlXYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XG5cdHRoaXMuX3dhbGxzW3grXCIsXCIreV0gPSAyO1xufTtcblxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9maXJzdFJvb20gPSBmdW5jdGlvbigpIHtcblx0dmFyIGN4ID0gTWF0aC5mbG9vcih0aGlzLl93aWR0aC8yKTtcblx0dmFyIGN5ID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQvMik7XG5cdHZhciByb29tID0gUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tQ2VudGVyKGN4LCBjeSwgdGhpcy5fb3B0aW9ucyk7XG5cdHRoaXMuX3Jvb21zLnB1c2gocm9vbSk7XG5cdHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogR2V0IGEgc3VpdGFibGUgd2FsbFxuICovXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2ZpbmRXYWxsID0gZnVuY3Rpb24oKSB7XG5cdHZhciBwcmlvMSA9IFtdO1xuXHR2YXIgcHJpbzIgPSBbXTtcblx0Zm9yICh2YXIgaWQgaW4gdGhpcy5fd2FsbHMpIHtcblx0XHR2YXIgcHJpbyA9IHRoaXMuX3dhbGxzW2lkXTtcblx0XHRpZiAocHJpbyA9PSAyKSB7IFxuXHRcdFx0cHJpbzIucHVzaChpZCk7IFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRwcmlvMS5wdXNoKGlkKTtcblx0XHR9XG5cdH1cblx0XG5cdHZhciBhcnIgPSAocHJpbzIubGVuZ3RoID8gcHJpbzIgOiBwcmlvMSk7XG5cdGlmICghYXJyLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfSAvKiBubyB3YWxscyA6LyAqL1xuXHRcblx0dmFyIGlkID0gYXJyLnJhbmRvbSgpO1xuXHRkZWxldGUgdGhpcy5fd2FsbHNbaWRdO1xuXG5cdHJldHVybiBpZDtcbn07XG5cbi8qKlxuICogVHJpZXMgYWRkaW5nIGEgZmVhdHVyZVxuICogQHJldHVybnMge2Jvb2x9IHdhcyB0aGlzIGEgc3VjY2Vzc2Z1bCB0cnk/XG4gKi9cblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fdHJ5RmVhdHVyZSA9IGZ1bmN0aW9uKHgsIHksIGR4LCBkeSkge1xuXHR2YXIgZmVhdHVyZSA9IFJPVC5STkcuZ2V0V2VpZ2h0ZWRWYWx1ZSh0aGlzLl9mZWF0dXJlcyk7XG5cdGZlYXR1cmUgPSBST1QuTWFwLkZlYXR1cmVbZmVhdHVyZV0uY3JlYXRlUmFuZG9tQXQoeCwgeSwgZHgsIGR5LCB0aGlzLl9vcHRpb25zKTtcblx0XG5cdGlmICghZmVhdHVyZS5pc1ZhbGlkKHRoaXMuX2lzV2FsbENhbGxiYWNrLCB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrKSkge1xuLy9cdFx0Y29uc29sZS5sb2coXCJub3QgdmFsaWRcIik7XG4vL1x0XHRmZWF0dXJlLmRlYnVnKCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdFxuXHRmZWF0dXJlLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XG4vL1x0ZmVhdHVyZS5kZWJ1ZygpO1xuXG5cdGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUk9ULk1hcC5GZWF0dXJlLlJvb20pIHsgdGhpcy5fcm9vbXMucHVzaChmZWF0dXJlKTsgfVxuXHRpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcikgeyBcblx0XHRmZWF0dXJlLmNyZWF0ZVByaW9yaXR5V2FsbHModGhpcy5fcHJpb3JpdHlXYWxsQ2FsbGJhY2spO1xuXHRcdHRoaXMuX2NvcnJpZG9ycy5wdXNoKGZlYXR1cmUpOyBcblx0fVxuXHRcblx0cmV0dXJuIHRydWU7XG59O1xuXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX3JlbW92ZVN1cnJvdW5kaW5nV2FsbHMgPSBmdW5jdGlvbihjeCwgY3kpIHtcblx0dmFyIGRlbHRhcyA9IFJPVC5ESVJTWzRdO1xuXG5cdGZvciAodmFyIGk9MDtpPGRlbHRhcy5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIGRlbHRhID0gZGVsdGFzW2ldO1xuXHRcdHZhciB4ID0gY3ggKyBkZWx0YVswXTtcblx0XHR2YXIgeSA9IGN5ICsgZGVsdGFbMV07XG5cdFx0ZGVsZXRlIHRoaXMuX3dhbGxzW3grXCIsXCIreV07XG5cdFx0dmFyIHggPSBjeCArIDIqZGVsdGFbMF07XG5cdFx0dmFyIHkgPSBjeSArIDIqZGVsdGFbMV07XG5cdFx0ZGVsZXRlIHRoaXMuX3dhbGxzW3grXCIsXCIreV07XG5cdH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB2ZWN0b3IgaW4gXCJkaWdnaW5nXCIgZGlyZWN0aW9uLCBvciBmYWxzZSwgaWYgdGhpcyBkb2VzIG5vdCBleGlzdCAob3IgaXMgbm90IHVuaXF1ZSlcbiAqL1xuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9nZXREaWdnaW5nRGlyZWN0aW9uID0gZnVuY3Rpb24oY3gsIGN5KSB7XG5cdGlmIChjeCA8PSAwIHx8IGN5IDw9IDAgfHwgY3ggPj0gdGhpcy5fd2lkdGggLSAxIHx8IGN5ID49IHRoaXMuX2hlaWdodCAtIDEpIHsgcmV0dXJuIG51bGw7IH1cblxuXHR2YXIgcmVzdWx0ID0gbnVsbDtcblx0dmFyIGRlbHRhcyA9IFJPVC5ESVJTWzRdO1xuXHRcblx0Zm9yICh2YXIgaT0wO2k8ZGVsdGFzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgZGVsdGEgPSBkZWx0YXNbaV07XG5cdFx0dmFyIHggPSBjeCArIGRlbHRhWzBdO1xuXHRcdHZhciB5ID0gY3kgKyBkZWx0YVsxXTtcblx0XHRcblx0XHRpZiAoIXRoaXMuX21hcFt4XVt5XSkgeyAvKiB0aGVyZSBhbHJlYWR5IGlzIGFub3RoZXIgZW1wdHkgbmVpZ2hib3IhICovXG5cdFx0XHRpZiAocmVzdWx0KSB7IHJldHVybiBudWxsOyB9XG5cdFx0XHRyZXN1bHQgPSBkZWx0YTtcblx0XHR9XG5cdH1cblx0XG5cdC8qIG5vIGVtcHR5IG5laWdoYm9yICovXG5cdGlmICghcmVzdWx0KSB7IHJldHVybiBudWxsOyB9XG5cdFxuXHRyZXR1cm4gWy1yZXN1bHRbMF0sIC1yZXN1bHRbMV1dO1xufTtcblxuLyoqXG4gKiBGaW5kIGVtcHR5IHNwYWNlcyBzdXJyb3VuZGluZyByb29tcywgYW5kIGFwcGx5IGRvb3JzLlxuICovXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2FkZERvb3JzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBkYXRhID0gdGhpcy5fbWFwO1xuXHR2YXIgaXNXYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XG5cdFx0cmV0dXJuIChkYXRhW3hdW3ldID09IDEpO1xuXHR9O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3Jvb21zLmxlbmd0aDsgaSsrICkge1xuXHRcdHZhciByb29tID0gdGhpcy5fcm9vbXNbaV07XG5cdFx0cm9vbS5jbGVhckRvb3JzKCk7XG5cdFx0cm9vbS5hZGREb29ycyhpc1dhbGxDYWxsYmFjayk7XG5cdH1cbn07XG4vKipcbiAqIEBjbGFzcyBEdW5nZW9uIGdlbmVyYXRvciB3aGljaCB0cmllcyB0byBmaWxsIHRoZSBzcGFjZSBldmVubHkuIEdlbmVyYXRlcyBpbmRlcGVuZGVudCByb29tcyBhbmQgdHJpZXMgdG8gY29ubmVjdCB0aGVtLlxuICogQGF1Z21lbnRzIFJPVC5NYXAuRHVuZ2VvblxuICovXG5ST1QuTWFwLlVuaWZvcm0gPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XG5cdFJPVC5NYXAuRHVuZ2Vvbi5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuXG5cdHRoaXMuX29wdGlvbnMgPSB7XG5cdFx0cm9vbVdpZHRoOiBbMywgOV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSB3aWR0aCAqL1xuXHRcdHJvb21IZWlnaHQ6IFszLCA1XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIGhlaWdodCAqL1xuXHRcdHJvb21EdWdQZXJjZW50YWdlOiAwLjEsIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBwZXJjZW50YWdlIG9mIGxldmVsIGFyZWEgaGFzIGJlZW4gZHVnIG91dCBieSByb29tcyAqL1xuXHRcdHRpbWVMaW1pdDogMTAwMCAvKiB3ZSBzdG9wIGFmdGVyIHRoaXMgbXVjaCB0aW1lIGhhcyBwYXNzZWQgKG1zZWMpICovXG5cdH07XG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxuXG5cdHRoaXMuX3Jvb21BdHRlbXB0cyA9IDIwOyAvKiBuZXcgcm9vbSBpcyBjcmVhdGVkIE4tdGltZXMgdW50aWwgaXMgY29uc2lkZXJlZCBhcyBpbXBvc3NpYmxlIHRvIGdlbmVyYXRlICovXG5cdHRoaXMuX2NvcnJpZG9yQXR0ZW1wdHMgPSAyMDsgLyogY29ycmlkb3JzIGFyZSB0cmllZCBOLXRpbWVzIHVudGlsIHRoZSBsZXZlbCBpcyBjb25zaWRlcmVkIGFzIGltcG9zc2libGUgdG8gY29ubmVjdCAqL1xuXG5cdHRoaXMuX2Nvbm5lY3RlZCA9IFtdOyAvKiBsaXN0IG9mIGFscmVhZHkgY29ubmVjdGVkIHJvb21zICovXG5cdHRoaXMuX3VuY29ubmVjdGVkID0gW107IC8qIGxpc3Qgb2YgcmVtYWluaW5nIHVuY29ubmVjdGVkIHJvb21zICovXG5cdFxuXHR0aGlzLl9kaWdDYWxsYmFjayA9IHRoaXMuX2RpZ0NhbGxiYWNrLmJpbmQodGhpcyk7XG5cdHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2sgPSB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrLmJpbmQodGhpcyk7XG5cdHRoaXMuX2lzV2FsbENhbGxiYWNrID0gdGhpcy5faXNXYWxsQ2FsbGJhY2suYmluZCh0aGlzKTtcbn07XG5ST1QuTWFwLlVuaWZvcm0uZXh0ZW5kKFJPVC5NYXAuRHVuZ2Vvbik7XG5cbi8qKlxuICogQ3JlYXRlIGEgbWFwLiBJZiB0aGUgdGltZSBsaW1pdCBoYXMgYmVlbiBoaXQsIHJldHVybnMgbnVsbC5cbiAqIEBzZWUgUk9ULk1hcCNjcmVhdGVcbiAqL1xuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuXHR2YXIgdDEgPSBEYXRlLm5vdygpO1xuXHR3aGlsZSAoMSkge1xuXHRcdHZhciB0MiA9IERhdGUubm93KCk7XG5cdFx0aWYgKHQyIC0gdDEgPiB0aGlzLl9vcHRpb25zLnRpbWVMaW1pdCkgeyByZXR1cm4gbnVsbDsgfSAvKiB0aW1lIGxpbWl0ISAqL1xuXHRcblx0XHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xuXHRcdHRoaXMuX2R1ZyA9IDA7XG5cdFx0dGhpcy5fcm9vbXMgPSBbXTtcblx0XHR0aGlzLl91bmNvbm5lY3RlZCA9IFtdO1xuXHRcdHRoaXMuX2dlbmVyYXRlUm9vbXMoKTtcblx0XHRpZiAodGhpcy5fcm9vbXMubGVuZ3RoIDwgMikgeyBjb250aW51ZTsgfVxuXHRcdGlmICh0aGlzLl9nZW5lcmF0ZUNvcnJpZG9ycygpKSB7IGJyZWFrOyB9XG5cdH1cblx0XG5cdGlmIChjYWxsYmFjaykge1xuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xuXHRcdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xuXHRcdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRcblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHN1aXRhYmxlIGFtb3VudCBvZiByb29tc1xuICovXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9nZW5lcmF0ZVJvb21zID0gZnVuY3Rpb24oKSB7XG5cdHZhciB3ID0gdGhpcy5fd2lkdGgtMjtcblx0dmFyIGggPSB0aGlzLl9oZWlnaHQtMjtcblxuXHRkbyB7XG5cdFx0dmFyIHJvb20gPSB0aGlzLl9nZW5lcmF0ZVJvb20oKTtcblx0XHRpZiAodGhpcy5fZHVnLyh3KmgpID4gdGhpcy5fb3B0aW9ucy5yb29tRHVnUGVyY2VudGFnZSkgeyBicmVhazsgfSAvKiBhY2hpZXZlZCByZXF1ZXN0ZWQgYW1vdW50IG9mIGZyZWUgc3BhY2UgKi9cblx0fSB3aGlsZSAocm9vbSk7XG5cblx0LyogZWl0aGVyIGVub3VnaCByb29tcywgb3Igbm90IGFibGUgdG8gZ2VuZXJhdGUgbW9yZSBvZiB0aGVtIDopICovXG59O1xuXG4vKipcbiAqIFRyeSB0byBnZW5lcmF0ZSBvbmUgcm9vbVxuICovXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9nZW5lcmF0ZVJvb20gPSBmdW5jdGlvbigpIHtcblx0dmFyIGNvdW50ID0gMDtcblx0d2hpbGUgKGNvdW50IDwgdGhpcy5fcm9vbUF0dGVtcHRzKSB7XG5cdFx0Y291bnQrKztcblx0XHRcblx0XHR2YXIgcm9vbSA9IFJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCB0aGlzLl9vcHRpb25zKTtcblx0XHRpZiAoIXJvb20uaXNWYWxpZCh0aGlzLl9pc1dhbGxDYWxsYmFjaywgdGhpcy5fY2FuQmVEdWdDYWxsYmFjaykpIHsgY29udGludWU7IH1cblx0XHRcblx0XHRyb29tLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XG5cdFx0dGhpcy5fcm9vbXMucHVzaChyb29tKTtcblx0XHRyZXR1cm4gcm9vbTtcblx0fSBcblxuXHQvKiBubyByb29tIHdhcyBnZW5lcmF0ZWQgaW4gYSBnaXZlbiBudW1iZXIgb2YgYXR0ZW1wdHMgKi9cblx0cmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBjb25uZWN0b3JzIGJld2VlbiByb29tc1xuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3MgV2FzIHRoaXMgYXR0ZW1wdCBzdWNjZXNzZnVsbD9cbiAqL1xuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZ2VuZXJhdGVDb3JyaWRvcnMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGNudCA9IDA7XG5cdHdoaWxlIChjbnQgPCB0aGlzLl9jb3JyaWRvckF0dGVtcHRzKSB7XG5cdFx0Y250Kys7XG5cdFx0dGhpcy5fY29ycmlkb3JzID0gW107XG5cblx0XHQvKiBkaWcgcm9vbXMgaW50byBhIGNsZWFyIG1hcCAqL1xuXHRcdHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG5cdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fcm9vbXMubGVuZ3RoO2krKykgeyBcblx0XHRcdHZhciByb29tID0gdGhpcy5fcm9vbXNbaV07XG5cdFx0XHRyb29tLmNsZWFyRG9vcnMoKTtcblx0XHRcdHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTsgXG5cdFx0fVxuXG5cdFx0dGhpcy5fdW5jb25uZWN0ZWQgPSB0aGlzLl9yb29tcy5zbGljZSgpLnJhbmRvbWl6ZSgpO1xuXHRcdHRoaXMuX2Nvbm5lY3RlZCA9IFtdO1xuXHRcdGlmICh0aGlzLl91bmNvbm5lY3RlZC5sZW5ndGgpIHsgdGhpcy5fY29ubmVjdGVkLnB1c2godGhpcy5fdW5jb25uZWN0ZWQucG9wKCkpOyB9IC8qIGZpcnN0IG9uZSBpcyBhbHdheXMgY29ubmVjdGVkICovXG5cdFx0XG5cdFx0d2hpbGUgKDEpIHtcblx0XHRcdC8qIDEuIHBpY2sgcmFuZG9tIGNvbm5lY3RlZCByb29tICovXG5cdFx0XHR2YXIgY29ubmVjdGVkID0gdGhpcy5fY29ubmVjdGVkLnJhbmRvbSgpO1xuXHRcdFx0XG5cdFx0XHQvKiAyLiBmaW5kIGNsb3Nlc3QgdW5jb25uZWN0ZWQgKi9cblx0XHRcdHZhciByb29tMSA9IHRoaXMuX2Nsb3Nlc3RSb29tKHRoaXMuX3VuY29ubmVjdGVkLCBjb25uZWN0ZWQpO1xuXHRcdFx0XG5cdFx0XHQvKiAzLiBjb25uZWN0IGl0IHRvIGNsb3Nlc3QgY29ubmVjdGVkICovXG5cdFx0XHR2YXIgcm9vbTIgPSB0aGlzLl9jbG9zZXN0Um9vbSh0aGlzLl9jb25uZWN0ZWQsIHJvb20xKTtcblx0XHRcdFxuXHRcdFx0dmFyIG9rID0gdGhpcy5fY29ubmVjdFJvb21zKHJvb20xLCByb29tMik7XG5cdFx0XHRpZiAoIW9rKSB7IGJyZWFrOyB9IC8qIHN0b3AgY29ubmVjdGluZywgcmUtc2h1ZmZsZSAqL1xuXHRcdFx0XG5cdFx0XHRpZiAoIXRoaXMuX3VuY29ubmVjdGVkLmxlbmd0aCkgeyByZXR1cm4gdHJ1ZTsgfSAvKiBkb25lOyBubyByb29tcyByZW1haW4gKi9cblx0XHR9XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBGb3IgYSBnaXZlbiByb29tLCBmaW5kIHRoZSBjbG9zZXN0IG9uZSBmcm9tIHRoZSBsaXN0XG4gKi9cblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2Nsb3Nlc3RSb29tID0gZnVuY3Rpb24ocm9vbXMsIHJvb20pIHtcblx0dmFyIGRpc3QgPSBJbmZpbml0eTtcblx0dmFyIGNlbnRlciA9IHJvb20uZ2V0Q2VudGVyKCk7XG5cdHZhciByZXN1bHQgPSBudWxsO1xuXHRcblx0Zm9yICh2YXIgaT0wO2k8cm9vbXMubGVuZ3RoO2krKykge1xuXHRcdHZhciByID0gcm9vbXNbaV07XG5cdFx0dmFyIGMgPSByLmdldENlbnRlcigpO1xuXHRcdHZhciBkeCA9IGNbMF0tY2VudGVyWzBdO1xuXHRcdHZhciBkeSA9IGNbMV0tY2VudGVyWzFdO1xuXHRcdHZhciBkID0gZHgqZHgrZHkqZHk7XG5cdFx0XG5cdFx0aWYgKGQgPCBkaXN0KSB7XG5cdFx0XHRkaXN0ID0gZDtcblx0XHRcdHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4gcmVzdWx0O1xufTtcblxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fY29ubmVjdFJvb21zID0gZnVuY3Rpb24ocm9vbTEsIHJvb20yKSB7XG5cdC8qXG5cdFx0cm9vbTEuZGVidWcoKTtcblx0XHRyb29tMi5kZWJ1ZygpO1xuXHQqL1xuXG5cdHZhciBjZW50ZXIxID0gcm9vbTEuZ2V0Q2VudGVyKCk7XG5cdHZhciBjZW50ZXIyID0gcm9vbTIuZ2V0Q2VudGVyKCk7XG5cblx0dmFyIGRpZmZYID0gY2VudGVyMlswXSAtIGNlbnRlcjFbMF07XG5cdHZhciBkaWZmWSA9IGNlbnRlcjJbMV0gLSBjZW50ZXIxWzFdO1xuXG5cdGlmIChNYXRoLmFicyhkaWZmWCkgPCBNYXRoLmFicyhkaWZmWSkpIHsgLyogZmlyc3QgdHJ5IGNvbm5lY3Rpbmcgbm9ydGgtc291dGggd2FsbHMgKi9cblx0XHR2YXIgZGlySW5kZXgxID0gKGRpZmZZID4gMCA/IDIgOiAwKTtcblx0XHR2YXIgZGlySW5kZXgyID0gKGRpckluZGV4MSArIDIpICUgNDtcblx0XHR2YXIgbWluID0gcm9vbTIuZ2V0TGVmdCgpO1xuXHRcdHZhciBtYXggPSByb29tMi5nZXRSaWdodCgpO1xuXHRcdHZhciBpbmRleCA9IDA7XG5cdH0gZWxzZSB7IC8qIGZpcnN0IHRyeSBjb25uZWN0aW5nIGVhc3Qtd2VzdCB3YWxscyAqL1xuXHRcdHZhciBkaXJJbmRleDEgPSAoZGlmZlggPiAwID8gMSA6IDMpO1xuXHRcdHZhciBkaXJJbmRleDIgPSAoZGlySW5kZXgxICsgMikgJSA0O1xuXHRcdHZhciBtaW4gPSByb29tMi5nZXRUb3AoKTtcblx0XHR2YXIgbWF4ID0gcm9vbTIuZ2V0Qm90dG9tKCk7XG5cdFx0dmFyIGluZGV4ID0gMTtcblx0fVxuXG5cdHZhciBzdGFydCA9IHRoaXMuX3BsYWNlSW5XYWxsKHJvb20xLCBkaXJJbmRleDEpOyAvKiBjb3JyaWRvciB3aWxsIHN0YXJ0IGhlcmUgKi9cblx0aWYgKCFzdGFydCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRpZiAoc3RhcnRbaW5kZXhdID49IG1pbiAmJiBzdGFydFtpbmRleF0gPD0gbWF4KSB7IC8qIHBvc3NpYmxlIHRvIGNvbm5lY3Qgd2l0aCBzdHJhaWdodCBsaW5lIChJLWxpa2UpICovXG5cdFx0dmFyIGVuZCA9IHN0YXJ0LnNsaWNlKCk7XG5cdFx0dmFyIHZhbHVlID0gbnVsbDtcblx0XHRzd2l0Y2ggKGRpckluZGV4Mikge1xuXHRcdFx0Y2FzZSAwOiB2YWx1ZSA9IHJvb20yLmdldFRvcCgpLTE7IGJyZWFrO1xuXHRcdFx0Y2FzZSAxOiB2YWx1ZSA9IHJvb20yLmdldFJpZ2h0KCkrMTsgYnJlYWs7XG5cdFx0XHRjYXNlIDI6IHZhbHVlID0gcm9vbTIuZ2V0Qm90dG9tKCkrMTsgYnJlYWs7XG5cdFx0XHRjYXNlIDM6IHZhbHVlID0gcm9vbTIuZ2V0TGVmdCgpLTE7IGJyZWFrO1xuXHRcdH1cblx0XHRlbmRbKGluZGV4KzEpJTJdID0gdmFsdWU7XG5cdFx0dGhpcy5fZGlnTGluZShbc3RhcnQsIGVuZF0pO1xuXHRcdFxuXHR9IGVsc2UgaWYgKHN0YXJ0W2luZGV4XSA8IG1pbi0xIHx8IHN0YXJ0W2luZGV4XSA+IG1heCsxKSB7IC8qIG5lZWQgdG8gc3dpdGNoIHRhcmdldCB3YWxsIChMLWxpa2UpICovXG5cblx0XHR2YXIgZGlmZiA9IHN0YXJ0W2luZGV4XSAtIGNlbnRlcjJbaW5kZXhdO1xuXHRcdHN3aXRjaCAoZGlySW5kZXgyKSB7XG5cdFx0XHRjYXNlIDA6XG5cdFx0XHRjYXNlIDE6XHR2YXIgcm90YXRpb24gPSAoZGlmZiA8IDAgPyAzIDogMSk7IGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0Y2FzZSAzOlx0dmFyIHJvdGF0aW9uID0gKGRpZmYgPCAwID8gMSA6IDMpOyBicmVhaztcblx0XHR9XG5cdFx0ZGlySW5kZXgyID0gKGRpckluZGV4MiArIHJvdGF0aW9uKSAlIDQ7XG5cdFx0XG5cdFx0dmFyIGVuZCA9IHRoaXMuX3BsYWNlSW5XYWxsKHJvb20yLCBkaXJJbmRleDIpO1xuXHRcdGlmICghZW5kKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdFx0dmFyIG1pZCA9IFswLCAwXTtcblx0XHRtaWRbaW5kZXhdID0gc3RhcnRbaW5kZXhdO1xuXHRcdHZhciBpbmRleDIgPSAoaW5kZXgrMSklMjtcblx0XHRtaWRbaW5kZXgyXSA9IGVuZFtpbmRleDJdO1xuXHRcdHRoaXMuX2RpZ0xpbmUoW3N0YXJ0LCBtaWQsIGVuZF0pO1xuXHRcdFxuXHR9IGVsc2UgeyAvKiB1c2UgY3VycmVudCB3YWxsIHBhaXIsIGJ1dCBhZGp1c3QgdGhlIGxpbmUgaW4gdGhlIG1pZGRsZSAoUy1saWtlKSAqL1xuXHRcblx0XHR2YXIgaW5kZXgyID0gKGluZGV4KzEpJTI7XG5cdFx0dmFyIGVuZCA9IHRoaXMuX3BsYWNlSW5XYWxsKHJvb20yLCBkaXJJbmRleDIpO1xuXHRcdGlmICghZW5kKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdHZhciBtaWQgPSBNYXRoLnJvdW5kKChlbmRbaW5kZXgyXSArIHN0YXJ0W2luZGV4Ml0pLzIpO1xuXG5cdFx0dmFyIG1pZDEgPSBbMCwgMF07XG5cdFx0dmFyIG1pZDIgPSBbMCwgMF07XG5cdFx0bWlkMVtpbmRleF0gPSBzdGFydFtpbmRleF07XG5cdFx0bWlkMVtpbmRleDJdID0gbWlkO1xuXHRcdG1pZDJbaW5kZXhdID0gZW5kW2luZGV4XTtcblx0XHRtaWQyW2luZGV4Ml0gPSBtaWQ7XG5cdFx0dGhpcy5fZGlnTGluZShbc3RhcnQsIG1pZDEsIG1pZDIsIGVuZF0pO1xuXHR9XG5cblx0cm9vbTEuYWRkRG9vcihzdGFydFswXSwgc3RhcnRbMV0pO1xuXHRyb29tMi5hZGREb29yKGVuZFswXSwgZW5kWzFdKTtcblx0XG5cdHZhciBpbmRleCA9IHRoaXMuX3VuY29ubmVjdGVkLmluZGV4T2Yocm9vbTEpO1xuXHRpZiAoaW5kZXggIT0gLTEpIHtcblx0XHR0aGlzLl91bmNvbm5lY3RlZC5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdHRoaXMuX2Nvbm5lY3RlZC5wdXNoKHJvb20xKTtcblx0fVxuXG5cdHZhciBpbmRleCA9IHRoaXMuX3VuY29ubmVjdGVkLmluZGV4T2Yocm9vbTIpO1xuXHRpZiAoaW5kZXggIT0gLTEpIHtcblx0XHR0aGlzLl91bmNvbm5lY3RlZC5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdHRoaXMuX2Nvbm5lY3RlZC5wdXNoKHJvb20yKTtcblx0fVxuXHRcblx0cmV0dXJuIHRydWU7XG59O1xuXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9wbGFjZUluV2FsbCA9IGZ1bmN0aW9uKHJvb20sIGRpckluZGV4KSB7XG5cdHZhciBzdGFydCA9IFswLCAwXTtcblx0dmFyIGRpciA9IFswLCAwXTtcblx0dmFyIGxlbmd0aCA9IDA7XG5cdFxuXHRzd2l0Y2ggKGRpckluZGV4KSB7XG5cdFx0Y2FzZSAwOlxuXHRcdFx0ZGlyID0gWzEsIDBdO1xuXHRcdFx0c3RhcnQgPSBbcm9vbS5nZXRMZWZ0KCksIHJvb20uZ2V0VG9wKCktMV07XG5cdFx0XHRsZW5ndGggPSByb29tLmdldFJpZ2h0KCktcm9vbS5nZXRMZWZ0KCkrMTtcblx0XHRicmVhaztcblx0XHRjYXNlIDE6XG5cdFx0XHRkaXIgPSBbMCwgMV07XG5cdFx0XHRzdGFydCA9IFtyb29tLmdldFJpZ2h0KCkrMSwgcm9vbS5nZXRUb3AoKV07XG5cdFx0XHRsZW5ndGggPSByb29tLmdldEJvdHRvbSgpLXJvb20uZ2V0VG9wKCkrMTtcblx0XHRicmVhaztcblx0XHRjYXNlIDI6XG5cdFx0XHRkaXIgPSBbMSwgMF07XG5cdFx0XHRzdGFydCA9IFtyb29tLmdldExlZnQoKSwgcm9vbS5nZXRCb3R0b20oKSsxXTtcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0UmlnaHQoKS1yb29tLmdldExlZnQoKSsxO1xuXHRcdGJyZWFrO1xuXHRcdGNhc2UgMzpcblx0XHRcdGRpciA9IFswLCAxXTtcblx0XHRcdHN0YXJ0ID0gW3Jvb20uZ2V0TGVmdCgpLTEsIHJvb20uZ2V0VG9wKCldO1xuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRCb3R0b20oKS1yb29tLmdldFRvcCgpKzE7XG5cdFx0YnJlYWs7XG5cdH1cblx0XG5cdHZhciBhdmFpbCA9IFtdO1xuXHR2YXIgbGFzdEJhZEluZGV4ID0gLTI7XG5cblx0Zm9yICh2YXIgaT0wO2k8bGVuZ3RoO2krKykge1xuXHRcdHZhciB4ID0gc3RhcnRbMF0gKyBpKmRpclswXTtcblx0XHR2YXIgeSA9IHN0YXJ0WzFdICsgaSpkaXJbMV07XG5cdFx0YXZhaWwucHVzaChudWxsKTtcblx0XHRcblx0XHR2YXIgaXNXYWxsID0gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcblx0XHRpZiAoaXNXYWxsKSB7XG5cdFx0XHRpZiAobGFzdEJhZEluZGV4ICE9IGktMSkgeyBhdmFpbFtpXSA9IFt4LCB5XTsgfVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRsYXN0QmFkSW5kZXggPSBpO1xuXHRcdFx0aWYgKGkpIHsgYXZhaWxbaS0xXSA9IG51bGw7IH1cblx0XHR9XG5cdH1cblx0XG5cdGZvciAodmFyIGk9YXZhaWwubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xuXHRcdGlmICghYXZhaWxbaV0pIHsgYXZhaWwuc3BsaWNlKGksIDEpOyB9XG5cdH1cblx0cmV0dXJuIChhdmFpbC5sZW5ndGggPyBhdmFpbC5yYW5kb20oKSA6IG51bGwpO1xufTtcblxuLyoqXG4gKiBEaWcgYSBwb2x5bGluZS5cbiAqL1xuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZGlnTGluZSA9IGZ1bmN0aW9uKHBvaW50cykge1xuXHRmb3IgKHZhciBpPTE7aTxwb2ludHMubGVuZ3RoO2krKykge1xuXHRcdHZhciBzdGFydCA9IHBvaW50c1tpLTFdO1xuXHRcdHZhciBlbmQgPSBwb2ludHNbaV07XG5cdFx0dmFyIGNvcnJpZG9yID0gbmV3IFJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcihzdGFydFswXSwgc3RhcnRbMV0sIGVuZFswXSwgZW5kWzFdKTtcblx0XHRjb3JyaWRvci5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spO1xuXHRcdHRoaXMuX2NvcnJpZG9ycy5wdXNoKGNvcnJpZG9yKTtcblx0fVxufTtcblxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZGlnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xuXHR0aGlzLl9tYXBbeF1beV0gPSB2YWx1ZTtcblx0aWYgKHZhbHVlID09IDApIHsgdGhpcy5fZHVnKys7IH1cbn07XG5cblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2lzV2FsbENhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xuXHRpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5ID49IHRoaXMuX2hlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cblx0cmV0dXJuICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XG59O1xuXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9jYW5CZUR1Z0NhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xuXHRpZiAoeCA8IDEgfHwgeSA8IDEgfHwgeCsxID49IHRoaXMuX3dpZHRoIHx8IHkrMSA+PSB0aGlzLl9oZWlnaHQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xufTtcblxuLyoqXG4gKiBAYXV0aG9yIGh5YWt1Z2VpXG4gKiBAY2xhc3MgRHVuZ2VvbiBnZW5lcmF0b3Igd2hpY2ggdXNlcyB0aGUgXCJvcmdpbmFsXCIgUm9ndWUgZHVuZ2VvbiBnZW5lcmF0aW9uIGFsZ29yaXRobS4gU2VlIGh0dHA6Ly9rdW9pLmNvbS9+a2FtaWthemUvR2FtZURlc2lnbi9hcnQwN19yb2d1ZV9kdW5nZW9uLnBocFxuICogQGF1Z21lbnRzIFJPVC5NYXBcbiAqIEBwYXJhbSB7aW50fSBbd2lkdGg9Uk9ULkRFRkFVTFRfV0lEVEhdXG4gKiBAcGFyYW0ge2ludH0gW2hlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIE9wdGlvbnNcbiAqIEBwYXJhbSB7aW50W119IFtvcHRpb25zLmNlbGxXaWR0aD0zXSBOdW1iZXIgb2YgY2VsbHMgdG8gY3JlYXRlIG9uIHRoZSBob3Jpem9udGFsIChudW1iZXIgb2Ygcm9vbXMgaG9yaXpvbnRhbGx5KVxuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuY2VsbEhlaWdodD0zXSBOdW1iZXIgb2YgY2VsbHMgdG8gY3JlYXRlIG9uIHRoZSB2ZXJ0aWNhbCAobnVtYmVyIG9mIHJvb21zIHZlcnRpY2FsbHkpXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucm9vbVdpZHRoXSBSb29tIG1pbiBhbmQgbWF4IHdpZHRoIC0gbm9ybWFsbHkgc2V0IGF1dG8tbWFnaWNhbGx5IHZpYSB0aGUgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucm9vbUhlaWdodF0gUm9vbSBtaW4gYW5kIG1heCBoZWlnaHQgLSBub3JtYWxseSBzZXQgYXV0by1tYWdpY2FsbHkgdmlhIHRoZSBjb25zdHJ1Y3Rvci5cbiAqL1xuUk9ULk1hcC5Sb2d1ZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcblxuXHR0aGlzLl9vcHRpb25zID0ge1xuXHRcdGNlbGxXaWR0aDogMywgIC8vIE5PVEUgdG8gc2VsZiwgdGhlc2UgY291bGQgcHJvYmFibHkgd29yayB0aGUgc2FtZSBhcyB0aGUgcm9vbVdpZHRoL3Jvb20gSGVpZ2h0IHZhbHVlc1xuXHRcdGNlbGxIZWlnaHQ6IDMgIC8vICAgICBpZS4gYXMgYW4gYXJyYXkgd2l0aCBtaW4tbWF4IHZhbHVlcyBmb3IgZWFjaCBkaXJlY3Rpb24uLi4uXG5cdH07XG5cblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XG5cblx0Lypcblx0U2V0IHRoZSByb29tIHNpemVzIGFjY29yZGluZyB0byB0aGUgb3Zlci1hbGwgd2lkdGggb2YgdGhlIG1hcCxcblx0YW5kIHRoZSBjZWxsIHNpemVzLlxuXHQqL1xuXHRpZiAoIXRoaXMuX29wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJyb29tV2lkdGhcIikpIHtcblx0XHR0aGlzLl9vcHRpb25zW1wicm9vbVdpZHRoXCJdID0gdGhpcy5fY2FsY3VsYXRlUm9vbVNpemUodGhpcy5fd2lkdGgsIHRoaXMuX29wdGlvbnNbXCJjZWxsV2lkdGhcIl0pO1xuXHR9XG5cdGlmICghdGhpcy5fb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcInJvb21IZWlnaHRcIikpIHtcblx0XHR0aGlzLl9vcHRpb25zW1wicm9vbUhlaWdodFwiXSA9IHRoaXMuX2NhbGN1bGF0ZVJvb21TaXplKHRoaXMuX2hlaWdodCwgdGhpcy5fb3B0aW9uc1tcImNlbGxIZWlnaHRcIl0pO1xuXHR9XG5cbn07XG5cblJPVC5NYXAuUm9ndWUuZXh0ZW5kKFJPVC5NYXApO1xuXG4vKipcbiAqIEBzZWUgUk9ULk1hcCNjcmVhdGVcbiAqL1xuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdHRoaXMubWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcblx0dGhpcy5yb29tcyA9IFtdO1xuXHR0aGlzLmNvbm5lY3RlZENlbGxzID0gW107XG5cblx0dGhpcy5faW5pdFJvb21zKCk7XG5cdHRoaXMuX2Nvbm5lY3RSb29tcygpO1xuXHR0aGlzLl9jb25uZWN0VW5jb25uZWN0ZWRSb29tcygpO1xuXHR0aGlzLl9jcmVhdGVSYW5kb21Sb29tQ29ubmVjdGlvbnMoKTtcblx0dGhpcy5fY3JlYXRlUm9vbXMoKTtcblx0dGhpcy5fY3JlYXRlQ29ycmlkb3JzKCk7XG5cblx0aWYgKGNhbGxiYWNrKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl93aWR0aDsgaSsrKSB7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMubWFwW2ldW2pdKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jYWxjdWxhdGVSb29tU2l6ZSA9IGZ1bmN0aW9uIChzaXplLCBjZWxsKSB7XG5cdHZhciBtYXggPSBNYXRoLmZsb29yKChzaXplL2NlbGwpICogMC44KTtcblx0dmFyIG1pbiA9IE1hdGguZmxvb3IoKHNpemUvY2VsbCkgKiAwLjI1KTtcblx0aWYgKG1pbiA8IDIpIHsgbWluID0gMjsgfVxuXHRpZiAobWF4IDwgMikgeyBtYXggPSAyOyB9XG5cdHJldHVybiBbbWluLCBtYXhdO1xufTtcblxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2luaXRSb29tcyA9IGZ1bmN0aW9uICgpIHtcblx0Ly8gY3JlYXRlIHJvb21zIGFycmF5LiBUaGlzIGlzIHRoZSBcImdyaWRcIiBsaXN0IGZyb20gdGhlIGFsZ28uXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7IGkrKykge1xuXHRcdHRoaXMucm9vbXMucHVzaChbXSk7XG5cdFx0Zm9yKHZhciBqID0gMDsgaiA8IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDsgaisrKSB7XG5cdFx0XHR0aGlzLnJvb21zW2ldLnB1c2goe1wieFwiOjAsIFwieVwiOjAsIFwid2lkdGhcIjowLCBcImhlaWdodFwiOjAsIFwiY29ubmVjdGlvbnNcIjpbXSwgXCJjZWxseFwiOmksIFwiY2VsbHlcIjpqfSk7XG5cdFx0fVxuXHR9XG59O1xuXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY29ubmVjdFJvb21zID0gZnVuY3Rpb24gKCkge1xuXHQvL3BpY2sgcmFuZG9tIHN0YXJ0aW5nIGdyaWRcblx0dmFyIGNneCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludCgwLCB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aC0xKTtcblx0dmFyIGNneSA9IFJPVC5STkcuZ2V0VW5pZm9ybUludCgwLCB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQtMSk7XG5cblx0dmFyIGlkeDtcblx0dmFyIG5jZ3g7XG5cdHZhciBuY2d5O1xuXG5cdHZhciBmb3VuZCA9IGZhbHNlO1xuXHR2YXIgcm9vbTtcblx0dmFyIG90aGVyUm9vbTtcblxuXHQvLyBmaW5kICB1bmNvbm5lY3RlZCBuZWlnaGJvdXIgY2VsbHNcblx0ZG8ge1xuXG5cdFx0Ly92YXIgZGlyVG9DaGVjayA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3XTtcblx0XHR2YXIgZGlyVG9DaGVjayA9IFswLCAyLCA0LCA2XTtcblx0XHRkaXJUb0NoZWNrID0gZGlyVG9DaGVjay5yYW5kb21pemUoKTtcblxuXHRcdGRvIHtcblx0XHRcdGZvdW5kID0gZmFsc2U7XG5cdFx0XHRpZHggPSBkaXJUb0NoZWNrLnBvcCgpO1xuXG5cdFx0XHRuY2d4ID0gY2d4ICsgUk9ULkRJUlNbOF1baWR4XVswXTtcblx0XHRcdG5jZ3kgPSBjZ3kgKyBST1QuRElSU1s4XVtpZHhdWzFdO1xuXG5cdFx0XHRpZiAobmNneCA8IDAgfHwgbmNneCA+PSB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aCkgeyBjb250aW51ZTsgfVxuXHRcdFx0aWYgKG5jZ3kgPCAwIHx8IG5jZ3kgPj0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0KSB7IGNvbnRpbnVlOyB9XG5cblx0XHRcdHJvb20gPSB0aGlzLnJvb21zW2NneF1bY2d5XTtcblxuXHRcdFx0aWYgKHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdC8vIGFzIGxvbmcgYXMgdGhpcyByb29tIGRvZXNuJ3QgYWxyZWFkeSBjb29uZWN0IHRvIG1lLCB3ZSBhcmUgb2sgd2l0aCBpdC5cblx0XHRcdFx0aWYgKHJvb21bXCJjb25uZWN0aW9uc1wiXVswXVswXSA9PSBuY2d4ICYmIHJvb21bXCJjb25uZWN0aW9uc1wiXVswXVsxXSA9PSBuY2d5KSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tuY2d4XVtuY2d5XTtcblxuXHRcdFx0aWYgKG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLnB1c2goW2NneCwgY2d5XSk7XG5cblx0XHRcdFx0dGhpcy5jb25uZWN0ZWRDZWxscy5wdXNoKFtuY2d4LCBuY2d5XSk7XG5cdFx0XHRcdGNneCA9IG5jZ3g7XG5cdFx0XHRcdGNneSA9IG5jZ3k7XG5cdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdH0gd2hpbGUgKGRpclRvQ2hlY2subGVuZ3RoID4gMCAmJiBmb3VuZCA9PSBmYWxzZSk7XG5cblx0fSB3aGlsZSAoZGlyVG9DaGVjay5sZW5ndGggPiAwKTtcblxufTtcblxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2Nvbm5lY3RVbmNvbm5lY3RlZFJvb21zID0gZnVuY3Rpb24gKCkge1xuXHQvL1doaWxlIHRoZXJlIGFyZSB1bmNvbm5lY3RlZCByb29tcywgdHJ5IHRvIGNvbm5lY3QgdGhlbSB0byBhIHJhbmRvbSBjb25uZWN0ZWQgbmVpZ2hib3Jcblx0Ly8oaWYgYSByb29tIGhhcyBubyBjb25uZWN0ZWQgbmVpZ2hib3JzIHlldCwganVzdCBrZWVwIGN5Y2xpbmcsIHlvdSdsbCBmaWxsIG91dCB0byBpdCBldmVudHVhbGx5KS5cblx0dmFyIGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XG5cdHZhciBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcblxuXHR0aGlzLmNvbm5lY3RlZENlbGxzID0gdGhpcy5jb25uZWN0ZWRDZWxscy5yYW5kb21pemUoKTtcblx0dmFyIHJvb207XG5cdHZhciBvdGhlclJvb207XG5cdHZhciB2YWxpZFJvb207XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDsgaSsrKSB7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7IGorKykgIHtcblxuXHRcdFx0cm9vbSA9IHRoaXMucm9vbXNbaV1bal07XG5cblx0XHRcdGlmIChyb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID09IDApIHtcblx0XHRcdFx0dmFyIGRpcmVjdGlvbnMgPSBbMCwgMiwgNCwgNl07XG5cdFx0XHRcdGRpcmVjdGlvbnMgPSBkaXJlY3Rpb25zLnJhbmRvbWl6ZSgpO1xuXG5cdFx0XHRcdHZhbGlkUm9vbSA9IGZhbHNlO1xuXG5cdFx0XHRcdGRvIHtcblxuXHRcdFx0XHRcdHZhciBkaXJJZHggPSBkaXJlY3Rpb25zLnBvcCgpO1xuXHRcdFx0XHRcdHZhciBuZXdJID0gaSArIFJPVC5ESVJTWzhdW2RpcklkeF1bMF07XG5cdFx0XHRcdFx0dmFyIG5ld0ogPSBqICsgUk9ULkRJUlNbOF1bZGlySWR4XVsxXTtcblxuXHRcdFx0XHRcdGlmIChuZXdJIDwgMCB8fCBuZXdJID49IGN3IHx8IG5ld0ogPCAwIHx8IG5ld0ogPj0gY2gpIHsgY29udGludWU7IH1cblxuXHRcdFx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbbmV3SV1bbmV3Sl07XG5cblx0XHRcdFx0XHR2YWxpZFJvb20gPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYgKG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aCA9PSAwKSB7IGJyZWFrOyB9XG5cblx0XHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aDsgaysrKSB7XG5cdFx0XHRcdFx0XHRpZiAob3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl1ba11bMF0gPT0gaSAmJiBvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXVtrXVsxXSA9PSBqKSB7XG5cdFx0XHRcdFx0XHRcdHZhbGlkUm9vbSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodmFsaWRSb29tKSB7IGJyZWFrOyB9XG5cblx0XHRcdFx0fSB3aGlsZSAoZGlyZWN0aW9ucy5sZW5ndGgpO1xuXG5cdFx0XHRcdGlmICh2YWxpZFJvb20pIHtcblx0XHRcdFx0XHRyb29tW1wiY29ubmVjdGlvbnNcIl0ucHVzaChbb3RoZXJSb29tW1wiY2VsbHhcIl0sIG90aGVyUm9vbVtcImNlbGx5XCJdXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCItLSBVbmFibGUgdG8gY29ubmVjdCByb29tLlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2NyZWF0ZVJhbmRvbVJvb21Db25uZWN0aW9ucyA9IGZ1bmN0aW9uIChjb25uZWN0aW9ucykge1xuXHQvLyBFbXB0eSBmb3Igbm93LlxufTtcblxuXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY3JlYXRlUm9vbXMgPSBmdW5jdGlvbiAoKSB7XG5cdC8vIENyZWF0ZSBSb29tc1xuXG5cdHZhciB3ID0gdGhpcy5fd2lkdGg7XG5cdHZhciBoID0gdGhpcy5faGVpZ2h0O1xuXG5cdHZhciBjdyA9IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoO1xuXHR2YXIgY2ggPSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7XG5cblx0dmFyIGN3cCA9IE1hdGguZmxvb3IodGhpcy5fd2lkdGggLyBjdyk7XG5cdHZhciBjaHAgPSBNYXRoLmZsb29yKHRoaXMuX2hlaWdodCAvIGNoKTtcblxuXHR2YXIgcm9vbXc7XG5cdHZhciByb29taDtcblx0dmFyIHJvb21XaWR0aCA9IHRoaXMuX29wdGlvbnNbXCJyb29tV2lkdGhcIl07XG5cdHZhciByb29tSGVpZ2h0ID0gdGhpcy5fb3B0aW9uc1tcInJvb21IZWlnaHRcIl07XG5cdHZhciBzeDtcblx0dmFyIHN5O1xuXHR2YXIgb3RoZXJSb29tO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY3c7IGkrKykge1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2g7IGorKykge1xuXHRcdFx0c3ggPSBjd3AgKiBpO1xuXHRcdFx0c3kgPSBjaHAgKiBqO1xuXG5cdFx0XHRpZiAoc3ggPT0gMCkgeyBzeCA9IDE7IH1cblx0XHRcdGlmIChzeSA9PSAwKSB7IHN5ID0gMTsgfVxuXG5cdFx0XHRyb29tdyA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChyb29tV2lkdGhbMF0sIHJvb21XaWR0aFsxXSk7XG5cdFx0XHRyb29taCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChyb29tSGVpZ2h0WzBdLCByb29tSGVpZ2h0WzFdKTtcblxuXHRcdFx0aWYgKGogPiAwKSB7XG5cdFx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbaV1bai0xXTtcblx0XHRcdFx0d2hpbGUgKHN5IC0gKG90aGVyUm9vbVtcInlcIl0gKyBvdGhlclJvb21bXCJoZWlnaHRcIl0gKSA8IDMpIHtcblx0XHRcdFx0XHRzeSsrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpID4gMCkge1xuXHRcdFx0XHRvdGhlclJvb20gPSB0aGlzLnJvb21zW2ktMV1bal07XG5cdFx0XHRcdHdoaWxlKHN4IC0gKG90aGVyUm9vbVtcInhcIl0gKyBvdGhlclJvb21bXCJ3aWR0aFwiXSkgPCAzKSB7XG5cdFx0XHRcdFx0c3grKztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc3hPZmZzZXQgPSBNYXRoLnJvdW5kKFJPVC5STkcuZ2V0VW5pZm9ybUludCgwLCBjd3Atcm9vbXcpLzIpO1xuXHRcdFx0dmFyIHN5T2Zmc2V0ID0gTWF0aC5yb3VuZChST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgY2hwLXJvb21oKS8yKTtcblxuXHRcdFx0d2hpbGUgKHN4ICsgc3hPZmZzZXQgKyByb29tdyA+PSB3KSB7XG5cdFx0XHRcdGlmKHN4T2Zmc2V0KSB7XG5cdFx0XHRcdFx0c3hPZmZzZXQtLTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyb29tdy0tO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHdoaWxlIChzeSArIHN5T2Zmc2V0ICsgcm9vbWggPj0gaCkge1xuXHRcdFx0XHRpZihzeU9mZnNldCkge1xuXHRcdFx0XHRcdHN5T2Zmc2V0LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cm9vbWgtLTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzeCA9IHN4ICsgc3hPZmZzZXQ7XG5cdFx0XHRzeSA9IHN5ICsgc3lPZmZzZXQ7XG5cblx0XHRcdHRoaXMucm9vbXNbaV1bal1bXCJ4XCJdID0gc3g7XG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wieVwiXSA9IHN5O1xuXHRcdFx0dGhpcy5yb29tc1tpXVtqXVtcIndpZHRoXCJdID0gcm9vbXc7XG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wiaGVpZ2h0XCJdID0gcm9vbWg7XG5cblx0XHRcdGZvciAodmFyIGlpID0gc3g7IGlpIDwgc3ggKyByb29tdzsgaWkrKykge1xuXHRcdFx0XHRmb3IgKHZhciBqaiA9IHN5OyBqaiA8IHN5ICsgcm9vbWg7IGpqKyspIHtcblx0XHRcdFx0XHR0aGlzLm1hcFtpaV1bampdID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2dldFdhbGxQb3NpdGlvbiA9IGZ1bmN0aW9uIChhUm9vbSwgYURpcmVjdGlvbikge1xuXHR2YXIgcng7XG5cdHZhciByeTtcblx0dmFyIGRvb3I7XG5cblx0aWYgKGFEaXJlY3Rpb24gPT0gMSB8fCBhRGlyZWN0aW9uID09IDMpIHtcblx0XHRyeCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChhUm9vbVtcInhcIl0gKyAxLCBhUm9vbVtcInhcIl0gKyBhUm9vbVtcIndpZHRoXCJdIC0gMik7XG5cdFx0aWYgKGFEaXJlY3Rpb24gPT0gMSkge1xuXHRcdFx0cnkgPSBhUm9vbVtcInlcIl0gLSAyO1xuXHRcdFx0ZG9vciA9IHJ5ICsgMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cnkgPSBhUm9vbVtcInlcIl0gKyBhUm9vbVtcImhlaWdodFwiXSArIDE7XG5cdFx0XHRkb29yID0gcnkgLTE7XG5cdFx0fVxuXG5cdFx0dGhpcy5tYXBbcnhdW2Rvb3JdID0gMDsgLy8gaSdtIG5vdCBzZXR0aW5nIGEgc3BlY2lmaWMgJ2Rvb3InIHRpbGUgdmFsdWUgcmlnaHQgbm93LCBqdXN0IGVtcHR5IHNwYWNlLlxuXG5cdH0gZWxzZSBpZiAoYURpcmVjdGlvbiA9PSAyIHx8IGFEaXJlY3Rpb24gPT0gNCkge1xuXHRcdHJ5ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KGFSb29tW1wieVwiXSArIDEsIGFSb29tW1wieVwiXSArIGFSb29tW1wiaGVpZ2h0XCJdIC0gMik7XG5cdFx0aWYoYURpcmVjdGlvbiA9PSAyKSB7XG5cdFx0XHRyeCA9IGFSb29tW1wieFwiXSArIGFSb29tW1wid2lkdGhcIl0gKyAxO1xuXHRcdFx0ZG9vciA9IHJ4IC0gMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cnggPSBhUm9vbVtcInhcIl0gLSAyO1xuXHRcdFx0ZG9vciA9IHJ4ICsgMTtcblx0XHR9XG5cblx0XHR0aGlzLm1hcFtkb29yXVtyeV0gPSAwOyAvLyBpJ20gbm90IHNldHRpbmcgYSBzcGVjaWZpYyAnZG9vcicgdGlsZSB2YWx1ZSByaWdodCBub3csIGp1c3QgZW1wdHkgc3BhY2UuXG5cblx0fVxuXHRyZXR1cm4gW3J4LCByeV07XG59O1xuXG4vKioqXG4qIEBwYXJhbSBzdGFydFBvc2l0aW9uIGEgMiBlbGVtZW50IGFycmF5XG4qIEBwYXJhbSBlbmRQb3NpdGlvbiBhIDIgZWxlbWVudCBhcnJheVxuKi9cblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9kcmF3Q29ycmlkb3IgPSBmdW5jdGlvbiAoc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24pIHtcblx0dmFyIHhPZmZzZXQgPSBlbmRQb3NpdGlvblswXSAtIHN0YXJ0UG9zaXRpb25bMF07XG5cdHZhciB5T2Zmc2V0ID0gZW5kUG9zaXRpb25bMV0gLSBzdGFydFBvc2l0aW9uWzFdO1xuXG5cdHZhciB4cG9zID0gc3RhcnRQb3NpdGlvblswXTtcblx0dmFyIHlwb3MgPSBzdGFydFBvc2l0aW9uWzFdO1xuXG5cdHZhciB0ZW1wRGlzdDtcblx0dmFyIHhEaXI7XG5cdHZhciB5RGlyO1xuXG5cdHZhciBtb3ZlOyAvLyAyIGVsZW1lbnQgYXJyYXksIGVsZW1lbnQgMCBpcyB0aGUgZGlyZWN0aW9uLCBlbGVtZW50IDEgaXMgdGhlIHRvdGFsIHZhbHVlIHRvIG1vdmUuXG5cdHZhciBtb3ZlcyA9IFtdOyAvLyBhIGxpc3Qgb2YgMiBlbGVtZW50IGFycmF5c1xuXG5cdHZhciB4QWJzID0gTWF0aC5hYnMoeE9mZnNldCk7XG5cdHZhciB5QWJzID0gTWF0aC5hYnMoeU9mZnNldCk7XG5cblx0dmFyIHBlcmNlbnQgPSBST1QuUk5HLmdldFVuaWZvcm0oKTsgLy8gdXNlZCB0byBzcGxpdCB0aGUgbW92ZSBhdCBkaWZmZXJlbnQgcGxhY2VzIGFsb25nIHRoZSBsb25nIGF4aXNcblx0dmFyIGZpcnN0SGFsZiA9IHBlcmNlbnQ7XG5cdHZhciBzZWNvbmRIYWxmID0gMSAtIHBlcmNlbnQ7XG5cblx0eERpciA9IHhPZmZzZXQgPiAwID8gMiA6IDY7XG5cdHlEaXIgPSB5T2Zmc2V0ID4gMCA/IDQgOiAwO1xuXG5cdGlmICh4QWJzIDwgeUFicykge1xuXHRcdC8vIG1vdmUgZmlyc3RIYWxmIG9mIHRoZSB5IG9mZnNldFxuXHRcdHRlbXBEaXN0ID0gTWF0aC5jZWlsKHlBYnMgKiBmaXJzdEhhbGYpO1xuXHRcdG1vdmVzLnB1c2goW3lEaXIsIHRlbXBEaXN0XSk7XG5cdFx0Ly8gbW92ZSBhbGwgdGhlIHggb2Zmc2V0XG5cdFx0bW92ZXMucHVzaChbeERpciwgeEFic10pO1xuXHRcdC8vIG1vdmUgc2VuZEhhbGYgb2YgdGhlICB5IG9mZnNldFxuXHRcdHRlbXBEaXN0ID0gTWF0aC5mbG9vcih5QWJzICogc2Vjb25kSGFsZik7XG5cdFx0bW92ZXMucHVzaChbeURpciwgdGVtcERpc3RdKTtcblx0fSBlbHNlIHtcblx0XHQvLyAgbW92ZSBmaXJzdEhhbGYgb2YgdGhlIHggb2Zmc2V0XG5cdFx0dGVtcERpc3QgPSBNYXRoLmNlaWwoeEFicyAqIGZpcnN0SGFsZik7XG5cdFx0bW92ZXMucHVzaChbeERpciwgdGVtcERpc3RdKTtcblx0XHQvLyBtb3ZlIGFsbCB0aGUgeSBvZmZzZXRcblx0XHRtb3Zlcy5wdXNoKFt5RGlyLCB5QWJzXSk7XG5cdFx0Ly8gbW92ZSBzZWNvbmRIYWxmIG9mIHRoZSB4IG9mZnNldC5cblx0XHR0ZW1wRGlzdCA9IE1hdGguZmxvb3IoeEFicyAqIHNlY29uZEhhbGYpO1xuXHRcdG1vdmVzLnB1c2goW3hEaXIsIHRlbXBEaXN0XSk7XG5cdH1cblxuXHR0aGlzLm1hcFt4cG9zXVt5cG9zXSA9IDA7XG5cblx0d2hpbGUgKG1vdmVzLmxlbmd0aCA+IDApIHtcblx0XHRtb3ZlID0gbW92ZXMucG9wKCk7XG5cdFx0d2hpbGUgKG1vdmVbMV0gPiAwKSB7XG5cdFx0XHR4cG9zICs9IFJPVC5ESVJTWzhdW21vdmVbMF1dWzBdO1xuXHRcdFx0eXBvcyArPSBST1QuRElSU1s4XVttb3ZlWzBdXVsxXTtcblx0XHRcdHRoaXMubWFwW3hwb3NdW3lwb3NdID0gMDtcblx0XHRcdG1vdmVbMV0gPSBtb3ZlWzFdIC0gMTtcblx0XHR9XG5cdH1cbn07XG5cblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jcmVhdGVDb3JyaWRvcnMgPSBmdW5jdGlvbiAoKSB7XG5cdC8vIERyYXcgQ29ycmlkb3JzIGJldHdlZW4gY29ubmVjdGVkIHJvb21zXG5cblx0dmFyIGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XG5cdHZhciBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcblx0dmFyIHJvb207XG5cdHZhciBjb25uZWN0aW9uO1xuXHR2YXIgb3RoZXJSb29tO1xuXHR2YXIgd2FsbDtcblx0dmFyIG90aGVyV2FsbDtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGN3OyBpKyspIHtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNoOyBqKyspIHtcblx0XHRcdHJvb20gPSB0aGlzLnJvb21zW2ldW2pdO1xuXG5cdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGg7IGsrKykge1xuXG5cdFx0XHRcdGNvbm5lY3Rpb24gPSByb29tW1wiY29ubmVjdGlvbnNcIl1ba107XG5cblx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tjb25uZWN0aW9uWzBdXVtjb25uZWN0aW9uWzFdXTtcblxuXHRcdFx0XHQvLyBmaWd1cmUgb3V0IHdoYXQgd2FsbCBvdXIgY29ycmlkb3Igd2lsbCBzdGFydCBvbmUuXG5cdFx0XHRcdC8vIGZpZ3VyZSBvdXQgd2hhdCB3YWxsIG91ciBjb3JyaWRvciB3aWxsIGVuZCBvbi5cblx0XHRcdFx0aWYgKG90aGVyUm9vbVtcImNlbGx4XCJdID4gcm9vbVtcImNlbGx4XCJdKSB7XG5cdFx0XHRcdFx0d2FsbCA9IDI7XG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gNDtcblx0XHRcdFx0fSBlbHNlIGlmIChvdGhlclJvb21bXCJjZWxseFwiXSA8IHJvb21bXCJjZWxseFwiXSkge1xuXHRcdFx0XHRcdHdhbGwgPSA0O1xuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDI7XG5cdFx0XHRcdH0gZWxzZSBpZihvdGhlclJvb21bXCJjZWxseVwiXSA+IHJvb21bXCJjZWxseVwiXSkge1xuXHRcdFx0XHRcdHdhbGwgPSAzO1xuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDE7XG5cdFx0XHRcdH0gZWxzZSBpZihvdGhlclJvb21bXCJjZWxseVwiXSA8IHJvb21bXCJjZWxseVwiXSkge1xuXHRcdFx0XHRcdHdhbGwgPSAxO1xuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLl9kcmF3Q29ycmlkb3IodGhpcy5fZ2V0V2FsbFBvc2l0aW9uKHJvb20sIHdhbGwpLCB0aGlzLl9nZXRXYWxsUG9zaXRpb24ob3RoZXJSb29tLCBvdGhlcldhbGwpKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG4vKipcbiAqIEBjbGFzcyBEdW5nZW9uIGZlYXR1cmU7IGhhcyBvd24gLmNyZWF0ZSgpIG1ldGhvZFxuICovXG5ST1QuTWFwLkZlYXR1cmUgPSBmdW5jdGlvbigpIHt9O1xuUk9ULk1hcC5GZWF0dXJlLnByb3RvdHlwZS5pc1ZhbGlkID0gZnVuY3Rpb24oY2FuQmVEdWdDYWxsYmFjaykge307XG5ST1QuTWFwLkZlYXR1cmUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGRpZ0NhbGxiYWNrKSB7fTtcblJPVC5NYXAuRmVhdHVyZS5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuUk9ULk1hcC5GZWF0dXJlLmNyZWF0ZVJhbmRvbUF0ID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5LCBvcHRpb25zKSB7fTtcblxuLyoqXG4gKiBAY2xhc3MgUm9vbVxuICogQGF1Z21lbnRzIFJPVC5NYXAuRmVhdHVyZVxuICogQHBhcmFtIHtpbnR9IHgxXG4gKiBAcGFyYW0ge2ludH0geTFcbiAqIEBwYXJhbSB7aW50fSB4MlxuICogQHBhcmFtIHtpbnR9IHkyXG4gKiBAcGFyYW0ge2ludH0gW2Rvb3JYXVxuICogQHBhcmFtIHtpbnR9IFtkb29yWV1cbiAqL1xuUk9ULk1hcC5GZWF0dXJlLlJvb20gPSBmdW5jdGlvbih4MSwgeTEsIHgyLCB5MiwgZG9vclgsIGRvb3JZKSB7XG5cdHRoaXMuX3gxID0geDE7XG5cdHRoaXMuX3kxID0geTE7XG5cdHRoaXMuX3gyID0geDI7XG5cdHRoaXMuX3kyID0geTI7XG5cdHRoaXMuX2Rvb3JzID0ge307XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID4gNCkgeyB0aGlzLmFkZERvb3IoZG9vclgsIGRvb3JZKTsgfVxufTtcblJPVC5NYXAuRmVhdHVyZS5Sb29tLmV4dGVuZChST1QuTWFwLkZlYXR1cmUpO1xuXG4vKipcbiAqIFJvb20gb2YgcmFuZG9tIHNpemUsIHdpdGggYSBnaXZlbiBkb29ycyBhbmQgZGlyZWN0aW9uXG4gKi9cblJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbUF0ID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5LCBvcHRpb25zKSB7XG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21XaWR0aFswXTtcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbVdpZHRoWzFdO1xuXHR2YXIgd2lkdGggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xuXHRcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbUhlaWdodFswXTtcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbUhlaWdodFsxXTtcblx0dmFyIGhlaWdodCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XG5cdFxuXHRpZiAoZHggPT0gMSkgeyAvKiB0byB0aGUgcmlnaHQgKi9cblx0XHR2YXIgeTIgPSB5IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIGhlaWdodCk7XG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgrMSwgeTIsIHgrd2lkdGgsIHkyK2hlaWdodC0xLCB4LCB5KTtcblx0fVxuXHRcblx0aWYgKGR4ID09IC0xKSB7IC8qIHRvIHRoZSBsZWZ0ICovXG5cdFx0dmFyIHkyID0geSAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiBoZWlnaHQpO1xuXHRcdHJldHVybiBuZXcgdGhpcyh4LXdpZHRoLCB5MiwgeC0xLCB5MitoZWlnaHQtMSwgeCwgeSk7XG5cdH1cblxuXHRpZiAoZHkgPT0gMSkgeyAvKiB0byB0aGUgYm90dG9tICovXG5cdFx0dmFyIHgyID0geCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgyLCB5KzEsIHgyK3dpZHRoLTEsIHkraGVpZ2h0LCB4LCB5KTtcblx0fVxuXG5cdGlmIChkeSA9PSAtMSkgeyAvKiB0byB0aGUgdG9wICovXG5cdFx0dmFyIHgyID0geCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgyLCB5LWhlaWdodCwgeDIrd2lkdGgtMSwgeS0xLCB4LCB5KTtcblx0fVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImR4IG9yIGR5IG11c3QgYmUgMSBvciAtMVwiKTtcbn07XG5cbi8qKlxuICogUm9vbSBvZiByYW5kb20gc2l6ZSwgcG9zaXRpb25lZCBhcm91bmQgY2VudGVyIGNvb3Jkc1xuICovXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb21DZW50ZXIgPSBmdW5jdGlvbihjeCwgY3ksIG9wdGlvbnMpIHtcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbVdpZHRoWzBdO1xuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tV2lkdGhbMV07XG5cdHZhciB3aWR0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XG5cdFxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tSGVpZ2h0WzBdO1xuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xuXHR2YXIgaGVpZ2h0ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcblxuXHR2YXIgeDEgPSBjeCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqd2lkdGgpO1xuXHR2YXIgeTEgPSBjeSAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqaGVpZ2h0KTtcblx0dmFyIHgyID0geDEgKyB3aWR0aCAtIDE7XG5cdHZhciB5MiA9IHkxICsgaGVpZ2h0IC0gMTtcblxuXHRyZXR1cm4gbmV3IHRoaXMoeDEsIHkxLCB4MiwgeTIpO1xufTtcblxuLyoqXG4gKiBSb29tIG9mIHJhbmRvbSBzaXplIHdpdGhpbiBhIGdpdmVuIGRpbWVuc2lvbnNcbiAqL1xuUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQsIG9wdGlvbnMpIHtcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbVdpZHRoWzBdO1xuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tV2lkdGhbMV07XG5cdHZhciB3aWR0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XG5cdFxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tSGVpZ2h0WzBdO1xuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xuXHR2YXIgaGVpZ2h0ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcblx0XG5cdHZhciBsZWZ0ID0gYXZhaWxXaWR0aCAtIHdpZHRoIC0gMTtcblx0dmFyIHRvcCA9IGF2YWlsSGVpZ2h0IC0gaGVpZ2h0IC0gMTtcblxuXHR2YXIgeDEgPSAxICsgTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSpsZWZ0KTtcblx0dmFyIHkxID0gMSArIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqdG9wKTtcblx0dmFyIHgyID0geDEgKyB3aWR0aCAtIDE7XG5cdHZhciB5MiA9IHkxICsgaGVpZ2h0IC0gMTtcblxuXHRyZXR1cm4gbmV3IHRoaXMoeDEsIHkxLCB4MiwgeTIpO1xufTtcblxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmFkZERvb3IgPSBmdW5jdGlvbih4LCB5KSB7XG5cdHRoaXMuX2Rvb3JzW3grXCIsXCIreV0gPSAxO1xuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQHBhcmFtIHtmdW5jdGlvbn1cbiAqL1xuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldERvb3JzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2Rvb3JzKSB7XG5cdFx0dmFyIHBhcnRzID0ga2V5LnNwbGl0KFwiLFwiKTtcblx0XHRjYWxsYmFjayhwYXJzZUludChwYXJ0c1swXSksIHBhcnNlSW50KHBhcnRzWzFdKSk7XG5cdH1cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuY2xlYXJEb29ycyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9kb29ycyA9IHt9O1xuXHRyZXR1cm4gdGhpcztcbn07XG5cblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5hZGREb29ycyA9IGZ1bmN0aW9uKGlzV2FsbENhbGxiYWNrKSB7XG5cdHZhciBsZWZ0ID0gdGhpcy5feDEtMTtcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcblx0dmFyIHRvcCA9IHRoaXMuX3kxLTE7XG5cdHZhciBib3R0b20gPSB0aGlzLl95MisxO1xuXG5cdGZvciAodmFyIHg9bGVmdDsgeDw9cmlnaHQ7IHgrKykge1xuXHRcdGZvciAodmFyIHk9dG9wOyB5PD1ib3R0b207IHkrKykge1xuXHRcdFx0aWYgKHggIT0gbGVmdCAmJiB4ICE9IHJpZ2h0ICYmIHkgIT0gdG9wICYmIHkgIT0gYm90dG9tKSB7IGNvbnRpbnVlOyB9XG5cdFx0XHRpZiAoaXNXYWxsQ2FsbGJhY2soeCwgeSkpIHsgY29udGludWU7IH1cblxuXHRcdFx0dGhpcy5hZGREb29yKHgsIHkpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcblxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKFwicm9vbVwiLCB0aGlzLl94MSwgdGhpcy5feTEsIHRoaXMuX3gyLCB0aGlzLl95Mik7XG59O1xuXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuaXNWYWxpZCA9IGZ1bmN0aW9uKGlzV2FsbENhbGxiYWNrLCBjYW5CZUR1Z0NhbGxiYWNrKSB7IFxuXHR2YXIgbGVmdCA9IHRoaXMuX3gxLTE7XG5cdHZhciByaWdodCA9IHRoaXMuX3gyKzE7XG5cdHZhciB0b3AgPSB0aGlzLl95MS0xO1xuXHR2YXIgYm90dG9tID0gdGhpcy5feTIrMTtcblx0XG5cdGZvciAodmFyIHg9bGVmdDsgeDw9cmlnaHQ7IHgrKykge1xuXHRcdGZvciAodmFyIHk9dG9wOyB5PD1ib3R0b207IHkrKykge1xuXHRcdFx0aWYgKHggPT0gbGVmdCB8fCB4ID09IHJpZ2h0IHx8IHkgPT0gdG9wIHx8IHkgPT0gYm90dG9tKSB7XG5cdFx0XHRcdGlmICghaXNXYWxsQ2FsbGJhY2soeCwgeSkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIWNhbkJlRHVnQ2FsbGJhY2soeCwgeSkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpZ0NhbGxiYWNrIERpZyBjYWxsYmFjayB3aXRoIGEgc2lnbmF0dXJlICh4LCB5LCB2YWx1ZSkuIFZhbHVlczogMCA9IGVtcHR5LCAxID0gd2FsbCwgMiA9IGRvb3IuIE11bHRpcGxlIGRvb3JzIGFyZSBhbGxvd2VkLlxuICovXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHsgXG5cdHZhciBsZWZ0ID0gdGhpcy5feDEtMTtcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcblx0dmFyIHRvcCA9IHRoaXMuX3kxLTE7XG5cdHZhciBib3R0b20gPSB0aGlzLl95MisxO1xuXHRcblx0dmFyIHZhbHVlID0gMDtcblx0Zm9yICh2YXIgeD1sZWZ0OyB4PD1yaWdodDsgeCsrKSB7XG5cdFx0Zm9yICh2YXIgeT10b3A7IHk8PWJvdHRvbTsgeSsrKSB7XG5cdFx0XHRpZiAoeCtcIixcIit5IGluIHRoaXMuX2Rvb3JzKSB7XG5cdFx0XHRcdHZhbHVlID0gMjtcblx0XHRcdH0gZWxzZSBpZiAoeCA9PSBsZWZ0IHx8IHggPT0gcmlnaHQgfHwgeSA9PSB0b3AgfHwgeSA9PSBib3R0b20pIHtcblx0XHRcdFx0dmFsdWUgPSAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFsdWUgPSAwO1xuXHRcdFx0fVxuXHRcdFx0ZGlnQ2FsbGJhY2soeCwgeSwgdmFsdWUpO1xuXHRcdH1cblx0fVxufTtcblxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldENlbnRlciA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gW01hdGgucm91bmQoKHRoaXMuX3gxICsgdGhpcy5feDIpLzIpLCBNYXRoLnJvdW5kKCh0aGlzLl95MSArIHRoaXMuX3kyKS8yKV07XG59O1xuXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0TGVmdCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5feDE7XG59O1xuXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0UmlnaHQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3gyO1xufTtcblxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldFRvcCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5feTE7XG59O1xuXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0Qm90dG9tID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl95Mjtcbn07XG5cbi8qKlxuICogQGNsYXNzIENvcnJpZG9yXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5GZWF0dXJlXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRYXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRZXG4gKiBAcGFyYW0ge2ludH0gZW5kWFxuICogQHBhcmFtIHtpbnR9IGVuZFlcbiAqL1xuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yID0gZnVuY3Rpb24oc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFkpIHtcblx0dGhpcy5fc3RhcnRYID0gc3RhcnRYO1xuXHR0aGlzLl9zdGFydFkgPSBzdGFydFk7XG5cdHRoaXMuX2VuZFggPSBlbmRYOyBcblx0dGhpcy5fZW5kWSA9IGVuZFk7XG5cdHRoaXMuX2VuZHNXaXRoQVdhbGwgPSB0cnVlO1xufTtcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5leHRlbmQoUk9ULk1hcC5GZWF0dXJlKTtcblxuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yLmNyZWF0ZVJhbmRvbUF0ID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5LCBvcHRpb25zKSB7XG5cdHZhciBtaW4gPSBvcHRpb25zLmNvcnJpZG9yTGVuZ3RoWzBdO1xuXHR2YXIgbWF4ID0gb3B0aW9ucy5jb3JyaWRvckxlbmd0aFsxXTtcblx0dmFyIGxlbmd0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XG5cdFxuXHRyZXR1cm4gbmV3IHRoaXMoeCwgeSwgeCArIGR4Kmxlbmd0aCwgeSArIGR5Kmxlbmd0aCk7XG59O1xuXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKFwiY29ycmlkb3JcIiwgdGhpcy5fc3RhcnRYLCB0aGlzLl9zdGFydFksIHRoaXMuX2VuZFgsIHRoaXMuX2VuZFkpO1xufTtcblxuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yLnByb3RvdHlwZS5pc1ZhbGlkID0gZnVuY3Rpb24oaXNXYWxsQ2FsbGJhY2ssIGNhbkJlRHVnQ2FsbGJhY2speyBcblx0dmFyIHN4ID0gdGhpcy5fc3RhcnRYO1xuXHR2YXIgc3kgPSB0aGlzLl9zdGFydFk7XG5cdHZhciBkeCA9IHRoaXMuX2VuZFgtc3g7XG5cdHZhciBkeSA9IHRoaXMuX2VuZFktc3k7XG5cdHZhciBsZW5ndGggPSAxICsgTWF0aC5tYXgoTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpO1xuXHRcblx0aWYgKGR4KSB7IGR4ID0gZHgvTWF0aC5hYnMoZHgpOyB9XG5cdGlmIChkeSkgeyBkeSA9IGR5L01hdGguYWJzKGR5KTsgfVxuXHR2YXIgbnggPSBkeTtcblx0dmFyIG55ID0gLWR4O1xuXHRcblx0dmFyIG9rID0gdHJ1ZTtcblx0Zm9yICh2YXIgaT0wOyBpPGxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIHggPSBzeCArIGkqZHg7XG5cdFx0dmFyIHkgPSBzeSArIGkqZHk7XG5cblx0XHRpZiAoIWNhbkJlRHVnQ2FsbGJhY2soICAgICB4LCAgICAgIHkpKSB7IG9rID0gZmFsc2U7IH1cblx0XHRpZiAoIWlzV2FsbENhbGxiYWNrICAoeCArIG54LCB5ICsgbnkpKSB7IG9rID0gZmFsc2U7IH1cblx0XHRpZiAoIWlzV2FsbENhbGxiYWNrICAoeCAtIG54LCB5IC0gbnkpKSB7IG9rID0gZmFsc2U7IH1cblx0XHRcblx0XHRpZiAoIW9rKSB7XG5cdFx0XHRsZW5ndGggPSBpO1xuXHRcdFx0dGhpcy5fZW5kWCA9IHgtZHg7XG5cdFx0XHR0aGlzLl9lbmRZID0geS1keTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHRcblx0LyoqXG5cdCAqIElmIHRoZSBsZW5ndGggZGVnZW5lcmF0ZWQsIHRoaXMgY29ycmlkb3IgbWlnaHQgYmUgaW52YWxpZFxuXHQgKi9cblx0IFxuXHQvKiBub3Qgc3VwcG9ydGVkICovXG5cdGlmIChsZW5ndGggPT0gMCkgeyByZXR1cm4gZmFsc2U7IH0gXG5cdFxuXHQgLyogbGVuZ3RoIDEgYWxsb3dlZCBvbmx5IGlmIHRoZSBuZXh0IHNwYWNlIGlzIGVtcHR5ICovXG5cdGlmIChsZW5ndGggPT0gMSAmJiBpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHgsIHRoaXMuX2VuZFkgKyBkeSkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFxuXHQvKipcblx0ICogV2UgZG8gbm90IHdhbnQgdGhlIGNvcnJpZG9yIHRvIGNyYXNoIGludG8gYSBjb3JuZXIgb2YgYSByb29tO1xuXHQgKiBpZiBhbnkgb2YgdGhlIGVuZGluZyBjb3JuZXJzIGlzIGVtcHR5LCB0aGUgTisxdGggY2VsbCBvZiB0aGlzIGNvcnJpZG9yIG11c3QgYmUgZW1wdHkgdG9vLlxuXHQgKiBcblx0ICogU2l0dWF0aW9uOlxuXHQgKiAjIyMjIyMjMVxuXHQgKiAuLi4uLi4uP1xuXHQgKiAjIyMjIyMjMlxuXHQgKiBcblx0ICogVGhlIGNvcnJpZG9yIHdhcyBkdWcgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuXHQgKiAxLCAyIC0gcHJvYmxlbWF0aWMgY29ybmVycywgPyA9IE4rMXRoIGNlbGwgKG5vdCBkdWcpXG5cdCAqL1xuXHR2YXIgZmlyc3RDb3JuZXJCYWQgPSAhaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4ICsgbngsIHRoaXMuX2VuZFkgKyBkeSArIG55KTtcblx0dmFyIHNlY29uZENvcm5lckJhZCA9ICFpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHggLSBueCwgdGhpcy5fZW5kWSArIGR5IC0gbnkpO1xuXHR0aGlzLl9lbmRzV2l0aEFXYWxsID0gaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpO1xuXHRpZiAoKGZpcnN0Q29ybmVyQmFkIHx8IHNlY29uZENvcm5lckJhZCkgJiYgdGhpcy5fZW5kc1dpdGhBV2FsbCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZGlnQ2FsbGJhY2sgRGlnIGNhbGxiYWNrIHdpdGggYSBzaWduYXR1cmUgKHgsIHksIHZhbHVlKS4gVmFsdWVzOiAwID0gZW1wdHkuXG4gKi9cblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHsgXG5cdHZhciBzeCA9IHRoaXMuX3N0YXJ0WDtcblx0dmFyIHN5ID0gdGhpcy5fc3RhcnRZO1xuXHR2YXIgZHggPSB0aGlzLl9lbmRYLXN4O1xuXHR2YXIgZHkgPSB0aGlzLl9lbmRZLXN5O1xuXHR2YXIgbGVuZ3RoID0gMStNYXRoLm1heChNYXRoLmFicyhkeCksIE1hdGguYWJzKGR5KSk7XG5cdFxuXHRpZiAoZHgpIHsgZHggPSBkeC9NYXRoLmFicyhkeCk7IH1cblx0aWYgKGR5KSB7IGR5ID0gZHkvTWF0aC5hYnMoZHkpOyB9XG5cdHZhciBueCA9IGR5O1xuXHR2YXIgbnkgPSAtZHg7XG5cdFxuXHRmb3IgKHZhciBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgeCA9IHN4ICsgaSpkeDtcblx0XHR2YXIgeSA9IHN5ICsgaSpkeTtcblx0XHRkaWdDYWxsYmFjayh4LCB5LCAwKTtcblx0fVxuXHRcblx0cmV0dXJuIHRydWU7XG59O1xuXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmNyZWF0ZVByaW9yaXR5V2FsbHMgPSBmdW5jdGlvbihwcmlvcml0eVdhbGxDYWxsYmFjaykge1xuXHRpZiAoIXRoaXMuX2VuZHNXaXRoQVdhbGwpIHsgcmV0dXJuOyB9XG5cblx0dmFyIHN4ID0gdGhpcy5fc3RhcnRYO1xuXHR2YXIgc3kgPSB0aGlzLl9zdGFydFk7XG5cblx0dmFyIGR4ID0gdGhpcy5fZW5kWC1zeDtcblx0dmFyIGR5ID0gdGhpcy5fZW5kWS1zeTtcblx0aWYgKGR4KSB7IGR4ID0gZHgvTWF0aC5hYnMoZHgpOyB9XG5cdGlmIChkeSkgeyBkeSA9IGR5L01hdGguYWJzKGR5KTsgfVxuXHR2YXIgbnggPSBkeTtcblx0dmFyIG55ID0gLWR4O1xuXG5cdHByaW9yaXR5V2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCwgdGhpcy5fZW5kWSArIGR5KTtcblx0cHJpb3JpdHlXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIG54LCB0aGlzLl9lbmRZICsgbnkpO1xuXHRwcmlvcml0eVdhbGxDYWxsYmFjayh0aGlzLl9lbmRYIC0gbngsIHRoaXMuX2VuZFkgLSBueSk7XG59O1xuLyoqXG4gKiBAY2xhc3MgQmFzZSBub2lzZSBnZW5lcmF0b3JcbiAqL1xuUk9ULk5vaXNlID0gZnVuY3Rpb24oKSB7XG59O1xuXG5ST1QuTm9pc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHgsIHkpIHt9O1xuLyoqXG4gKiBBIHNpbXBsZSAyZCBpbXBsZW1lbnRhdGlvbiBvZiBzaW1wbGV4IG5vaXNlIGJ5IE9uZHJlaiBaYXJhXG4gKlxuICogQmFzZWQgb24gYSBzcGVlZC1pbXByb3ZlZCBzaW1wbGV4IG5vaXNlIGFsZ29yaXRobSBmb3IgMkQsIDNEIGFuZCA0RCBpbiBKYXZhLlxuICogV2hpY2ggaXMgYmFzZWQgb24gZXhhbXBsZSBjb2RlIGJ5IFN0ZWZhbiBHdXN0YXZzb24gKHN0ZWd1QGl0bi5saXUuc2UpLlxuICogV2l0aCBPcHRpbWlzYXRpb25zIGJ5IFBldGVyIEVhc3RtYW4gKHBlYXN0bWFuQGRyaXp6bGUuc3RhbmZvcmQuZWR1KS5cbiAqIEJldHRlciByYW5rIG9yZGVyaW5nIG1ldGhvZCBieSBTdGVmYW4gR3VzdGF2c29uIGluIDIwMTIuXG4gKi9cblxuLyoqXG4gKiBAY2xhc3MgMkQgc2ltcGxleCBub2lzZSBnZW5lcmF0b3JcbiAqIEBwYXJhbSB7aW50fSBbZ3JhZGllbnRzPTI1Nl0gUmFuZG9tIGdyYWRpZW50c1xuICovXG5ST1QuTm9pc2UuU2ltcGxleCA9IGZ1bmN0aW9uKGdyYWRpZW50cykge1xuXHRST1QuTm9pc2UuY2FsbCh0aGlzKTtcblxuXHR0aGlzLl9GMiA9IDAuNSAqIChNYXRoLnNxcnQoMykgLSAxKTtcblx0dGhpcy5fRzIgPSAoMyAtIE1hdGguc3FydCgzKSkgLyA2O1xuXG5cdHRoaXMuX2dyYWRpZW50cyA9IFtcblx0XHRbIDAsIC0xXSxcblx0XHRbIDEsIC0xXSxcblx0XHRbIDEsICAwXSxcblx0XHRbIDEsICAxXSxcblx0XHRbIDAsICAxXSxcblx0XHRbLTEsICAxXSxcblx0XHRbLTEsICAwXSxcblx0XHRbLTEsIC0xXVxuXHRdO1xuXG5cdHZhciBwZXJtdXRhdGlvbnMgPSBbXTtcblx0dmFyIGNvdW50ID0gZ3JhZGllbnRzIHx8IDI1Njtcblx0Zm9yICh2YXIgaT0wO2k8Y291bnQ7aSsrKSB7IHBlcm11dGF0aW9ucy5wdXNoKGkpOyB9XG5cdHBlcm11dGF0aW9ucyA9IHBlcm11dGF0aW9ucy5yYW5kb21pemUoKTtcblxuXHR0aGlzLl9wZXJtcyA9IFtdO1xuXHR0aGlzLl9pbmRleGVzID0gW107XG5cblx0Zm9yICh2YXIgaT0wO2k8Mipjb3VudDtpKyspIHtcblx0XHR0aGlzLl9wZXJtcy5wdXNoKHBlcm11dGF0aW9uc1tpICUgY291bnRdKTtcblx0XHR0aGlzLl9pbmRleGVzLnB1c2godGhpcy5fcGVybXNbaV0gJSB0aGlzLl9ncmFkaWVudHMubGVuZ3RoKTtcblx0fVxuXG59O1xuUk9ULk5vaXNlLlNpbXBsZXguZXh0ZW5kKFJPVC5Ob2lzZSk7XG5cblJPVC5Ob2lzZS5TaW1wbGV4LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbih4aW4sIHlpbikge1xuXHR2YXIgcGVybXMgPSB0aGlzLl9wZXJtcztcblx0dmFyIGluZGV4ZXMgPSB0aGlzLl9pbmRleGVzO1xuXHR2YXIgY291bnQgPSBwZXJtcy5sZW5ndGgvMjtcblx0dmFyIEcyID0gdGhpcy5fRzI7XG5cblx0dmFyIG4wID0wLCBuMSA9IDAsIG4yID0gMCwgZ2k7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuXG5cdC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cblx0dmFyIHMgPSAoeGluICsgeWluKSAqIHRoaXMuX0YyOyAvLyBIYWlyeSBmYWN0b3IgZm9yIDJEXG5cdHZhciBpID0gTWF0aC5mbG9vcih4aW4gKyBzKTtcblx0dmFyIGogPSBNYXRoLmZsb29yKHlpbiArIHMpO1xuXHR2YXIgdCA9IChpICsgaikgKiBHMjtcblx0dmFyIFgwID0gaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5KSBzcGFjZVxuXHR2YXIgWTAgPSBqIC0gdDtcblx0dmFyIHgwID0geGluIC0gWDA7IC8vIFRoZSB4LHkgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXG5cdHZhciB5MCA9IHlpbiAtIFkwO1xuXG5cdC8vIEZvciB0aGUgMkQgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYW4gZXF1aWxhdGVyYWwgdHJpYW5nbGUuXG5cdC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cblx0dmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xuXHRpZiAoeDAgPiB5MCkge1xuXHRcdGkxID0gMTtcblx0XHRqMSA9IDA7XG5cdH0gZWxzZSB7IC8vIGxvd2VyIHRyaWFuZ2xlLCBYWSBvcmRlcjogKDAsMCktPigxLDApLT4oMSwxKVxuXHRcdGkxID0gMDtcblx0XHRqMSA9IDE7XG5cdH0gLy8gdXBwZXIgdHJpYW5nbGUsIFlYIG9yZGVyOiAoMCwwKS0+KDAsMSktPigxLDEpXG5cblx0Ly8gQSBzdGVwIG9mICgxLDApIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jKSBpbiAoeCx5KSwgYW5kXG5cdC8vIGEgc3RlcCBvZiAoMCwxKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKC1jLDEtYykgaW4gKHgseSksIHdoZXJlXG5cdC8vIGMgPSAoMy1zcXJ0KDMpKS82XG5cdHZhciB4MSA9IHgwIC0gaTEgKyBHMjsgLy8gT2Zmc2V0cyBmb3IgbWlkZGxlIGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcblx0dmFyIHkxID0geTAgLSBqMSArIEcyO1xuXHR2YXIgeDIgPSB4MCAtIDEgKyAyKkcyOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcblx0dmFyIHkyID0geTAgLSAxICsgMipHMjtcblxuXHQvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIHRocmVlIHNpbXBsZXggY29ybmVyc1xuXHR2YXIgaWkgPSBpLm1vZChjb3VudCk7XG5cdHZhciBqaiA9IGoubW9kKGNvdW50KTtcblxuXHQvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXG5cdHZhciB0MCA9IDAuNSAtIHgwKngwIC0geTAqeTA7XG5cdGlmICh0MCA+PSAwKSB7XG5cdFx0dDAgKj0gdDA7XG5cdFx0Z2kgPSBpbmRleGVzW2lpK3Blcm1zW2pqXV07XG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xuXHRcdG4wID0gdDAgKiB0MCAqIChncmFkWzBdICogeDAgKyBncmFkWzFdICogeTApO1xuXHR9XG5cdFxuXHR2YXIgdDEgPSAwLjUgLSB4MSp4MSAtIHkxKnkxO1xuXHRpZiAodDEgPj0gMCkge1xuXHRcdHQxICo9IHQxO1xuXHRcdGdpID0gaW5kZXhlc1tpaStpMStwZXJtc1tqaitqMV1dO1xuXHRcdHZhciBncmFkID0gdGhpcy5fZ3JhZGllbnRzW2dpXTtcblx0XHRuMSA9IHQxICogdDEgKiAoZ3JhZFswXSAqIHgxICsgZ3JhZFsxXSAqIHkxKTtcblx0fVxuXHRcblx0dmFyIHQyID0gMC41IC0geDIqeDIgLSB5Mip5Mjtcblx0aWYgKHQyID49IDApIHtcblx0XHR0MiAqPSB0Mjtcblx0XHRnaSA9IGluZGV4ZXNbaWkrMStwZXJtc1tqaisxXV07XG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xuXHRcdG4yID0gdDIgKiB0MiAqIChncmFkWzBdICogeDIgKyBncmFkWzFdICogeTIpO1xuXHR9XG5cblx0Ly8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxuXHQvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXG5cdHJldHVybiA3MCAqIChuMCArIG4xICsgbjIpO1xufVxuLyoqXG4gKiBAY2xhc3MgQWJzdHJhY3QgRk9WIGFsZ29yaXRobVxuICogQHBhcmFtIHtmdW5jdGlvbn0gbGlnaHRQYXNzZXNDYWxsYmFjayBEb2VzIHRoZSBsaWdodCBwYXNzIHRocm91Z2ggeCx5P1xuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5PThdIDQvNi84XG4gKi9cblJPVC5GT1YgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XG5cdHRoaXMuX2xpZ2h0UGFzc2VzID0gbGlnaHRQYXNzZXNDYWxsYmFjaztcblx0dGhpcy5fb3B0aW9ucyA9IHtcblx0XHR0b3BvbG9neTogOFxuXHR9O1xuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cbn07XG5cbi8qKlxuICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDM2MC1kZWdyZWUgY2lyY2xlXG4gKiBAcGFyYW0ge2ludH0geFxuICogQHBhcmFtIHtpbnR9IHlcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cblJPVC5GT1YucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge307XG5cbi8qKlxuICogUmV0dXJuIGFsbCBuZWlnaGJvcnMgaW4gYSBjb25jZW50cmljIHJpbmdcbiAqIEBwYXJhbSB7aW50fSBjeCBjZW50ZXIteFxuICogQHBhcmFtIHtpbnR9IGN5IGNlbnRlci15XG4gKiBAcGFyYW0ge2ludH0gciByYW5nZVxuICovXG5ST1QuRk9WLnByb3RvdHlwZS5fZ2V0Q2lyY2xlID0gZnVuY3Rpb24oY3gsIGN5LCByKSB7XG5cdHZhciByZXN1bHQgPSBbXTtcblx0dmFyIGRpcnMsIGNvdW50RmFjdG9yLCBzdGFydE9mZnNldDtcblxuXHRzd2l0Y2ggKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kpIHtcblx0XHRjYXNlIDQ6XG5cdFx0XHRjb3VudEZhY3RvciA9IDE7XG5cdFx0XHRzdGFydE9mZnNldCA9IFswLCAxXTtcblx0XHRcdGRpcnMgPSBbXG5cdFx0XHRcdFJPVC5ESVJTWzhdWzddLFxuXHRcdFx0XHRST1QuRElSU1s4XVsxXSxcblx0XHRcdFx0Uk9ULkRJUlNbOF1bM10sXG5cdFx0XHRcdFJPVC5ESVJTWzhdWzVdXG5cdFx0XHRdO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSA2OlxuXHRcdFx0ZGlycyA9IFJPVC5ESVJTWzZdO1xuXHRcdFx0Y291bnRGYWN0b3IgPSAxO1xuXHRcdFx0c3RhcnRPZmZzZXQgPSBbLTEsIDFdO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSA4OlxuXHRcdFx0ZGlycyA9IFJPVC5ESVJTWzRdO1xuXHRcdFx0Y291bnRGYWN0b3IgPSAyO1xuXHRcdFx0c3RhcnRPZmZzZXQgPSBbLTEsIDFdO1xuXHRcdGJyZWFrO1xuXHR9XG5cblx0Lyogc3RhcnRpbmcgbmVpZ2hib3IgKi9cblx0dmFyIHggPSBjeCArIHN0YXJ0T2Zmc2V0WzBdKnI7XG5cdHZhciB5ID0gY3kgKyBzdGFydE9mZnNldFsxXSpyO1xuXG5cdC8qIGNpcmNsZSAqL1xuXHRmb3IgKHZhciBpPTA7aTxkaXJzLmxlbmd0aDtpKyspIHtcblx0XHRmb3IgKHZhciBqPTA7ajxyKmNvdW50RmFjdG9yO2orKykge1xuXHRcdFx0cmVzdWx0LnB1c2goW3gsIHldKTtcblx0XHRcdHggKz0gZGlyc1tpXVswXTtcblx0XHRcdHkgKz0gZGlyc1tpXVsxXTtcblxuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59O1xuLyoqXG4gKiBAY2xhc3MgRGlzY3JldGUgc2hhZG93Y2FzdGluZyBhbGdvcml0aG0uIE9ic29sZXRlZCBieSBQcmVjaXNlIHNoYWRvd2Nhc3RpbmcuXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxuICovXG5ST1QuRk9WLkRpc2NyZXRlU2hhZG93Y2FzdGluZyA9IGZ1bmN0aW9uKGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0Uk9ULkZPVi5jYWxsKHRoaXMsIGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpO1xufTtcblJPVC5GT1YuRGlzY3JldGVTaGFkb3djYXN0aW5nLmV4dGVuZChST1QuRk9WKTtcblxuLyoqXG4gKiBAc2VlIFJPVC5GT1YjY29tcHV0ZVxuICovXG5ST1QuRk9WLkRpc2NyZXRlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKHgsIHksIFIsIGNhbGxiYWNrKSB7XG5cdHZhciBjZW50ZXIgPSB0aGlzLl9jb29yZHM7XG5cdHZhciBtYXAgPSB0aGlzLl9tYXA7XG5cblx0LyogdGhpcyBwbGFjZSBpcyBhbHdheXMgdmlzaWJsZSAqL1xuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcblxuXHQvKiBzdGFuZGluZyBpbiBhIGRhcmsgcGxhY2UuIEZJWE1FIGlzIHRoaXMgYSBnb29kIGlkZWE/ICAqL1xuXHRpZiAoIXRoaXMuX2xpZ2h0UGFzc2VzKHgsIHkpKSB7IHJldHVybjsgfVxuXHRcblx0Lyogc3RhcnQgYW5kIGVuZCBhbmdsZXMgKi9cblx0dmFyIERBVEEgPSBbXTtcblx0XG5cdHZhciBBLCBCLCBjeCwgY3ksIGJsb2NrcztcblxuXHQvKiBhbmFseXplIHN1cnJvdW5kaW5nIGNlbGxzIGluIGNvbmNlbnRyaWMgcmluZ3MsIHN0YXJ0aW5nIGZyb20gdGhlIGNlbnRlciAqL1xuXHRmb3IgKHZhciByPTE7IHI8PVI7IHIrKykge1xuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXRDaXJjbGUoeCwgeSwgcik7XG5cdFx0dmFyIGFuZ2xlID0gMzYwIC8gbmVpZ2hib3JzLmxlbmd0aDtcblxuXHRcdGZvciAodmFyIGk9MDtpPG5laWdoYm9ycy5sZW5ndGg7aSsrKSB7XG5cdFx0XHRjeCA9IG5laWdoYm9yc1tpXVswXTtcblx0XHRcdGN5ID0gbmVpZ2hib3JzW2ldWzFdO1xuXHRcdFx0QSA9IGFuZ2xlICogKGkgLSAwLjUpO1xuXHRcdFx0QiA9IEEgKyBhbmdsZTtcblx0XHRcdFxuXHRcdFx0YmxvY2tzID0gIXRoaXMuX2xpZ2h0UGFzc2VzKGN4LCBjeSk7XG5cdFx0XHRpZiAodGhpcy5fdmlzaWJsZUNvb3JkcyhNYXRoLmZsb29yKEEpLCBNYXRoLmNlaWwoQiksIGJsb2NrcywgREFUQSkpIHsgY2FsbGJhY2soY3gsIGN5LCByLCAxKTsgfVxuXHRcdFx0XG5cdFx0XHRpZiAoREFUQS5sZW5ndGggPT0gMiAmJiBEQVRBWzBdID09IDAgJiYgREFUQVsxXSA9PSAzNjApIHsgcmV0dXJuOyB9IC8qIGN1dG9mZj8gKi9cblxuXHRcdH0gLyogZm9yIGFsbCBjZWxscyBpbiB0aGlzIHJpbmcgKi9cblx0fSAvKiBmb3IgYWxsIHJpbmdzICovXG59O1xuXG4vKipcbiAqIEBwYXJhbSB7aW50fSBBIHN0YXJ0IGFuZ2xlXG4gKiBAcGFyYW0ge2ludH0gQiBlbmQgYW5nbGVcbiAqIEBwYXJhbSB7Ym9vbH0gYmxvY2tzIERvZXMgY3VycmVudCBjZWxsIGJsb2NrIHZpc2liaWxpdHk/XG4gKiBAcGFyYW0ge2ludFtdW119IERBVEEgc2hhZG93ZWQgYW5nbGUgcGFpcnNcbiAqL1xuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl92aXNpYmxlQ29vcmRzID0gZnVuY3Rpb24oQSwgQiwgYmxvY2tzLCBEQVRBKSB7XG5cdGlmIChBIDwgMCkgeyBcblx0XHR2YXIgdjEgPSBhcmd1bWVudHMuY2FsbGVlKDAsIEIsIGJsb2NrcywgREFUQSk7XG5cdFx0dmFyIHYyID0gYXJndW1lbnRzLmNhbGxlZSgzNjArQSwgMzYwLCBibG9ja3MsIERBVEEpO1xuXHRcdHJldHVybiB2MSB8fCB2Mjtcblx0fVxuXHRcblx0dmFyIGluZGV4ID0gMDtcblx0d2hpbGUgKGluZGV4IDwgREFUQS5sZW5ndGggJiYgREFUQVtpbmRleF0gPCBBKSB7IGluZGV4Kys7IH1cblx0XG5cdGlmIChpbmRleCA9PSBEQVRBLmxlbmd0aCkgeyAvKiBjb21wbGV0ZWx5IG5ldyBzaGFkb3cgKi9cblx0XHRpZiAoYmxvY2tzKSB7IERBVEEucHVzaChBLCBCKTsgfSBcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRcblx0dmFyIGNvdW50ID0gMDtcblx0XG5cdGlmIChpbmRleCAlIDIpIHsgLyogdGhpcyBzaGFkb3cgc3RhcnRzIGluIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2l0aGluIGl0cyBlbmRpbmcgYm91bmRhcnkgKi9cblx0XHR3aGlsZSAoaW5kZXggPCBEQVRBLmxlbmd0aCAmJiBEQVRBW2luZGV4XSA8IEIpIHtcblx0XHRcdGluZGV4Kys7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblx0XHRcblx0XHRpZiAoY291bnQgPT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcblx0XHRpZiAoYmxvY2tzKSB7IFxuXHRcdFx0aWYgKGNvdW50ICUgMikge1xuXHRcdFx0XHREQVRBLnNwbGljZShpbmRleC1jb3VudCwgY291bnQsIEIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0REFUQS5zcGxpY2UoaW5kZXgtY291bnQsIGNvdW50KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHRydWU7XG5cblx0fSBlbHNlIHsgLyogdGhpcyBzaGFkb3cgc3RhcnRzIG91dHNpZGUgYW4gZXhpc3Rpbmcgc2hhZG93LCBvciB3aXRoaW4gYSBzdGFydGluZyBib3VuZGFyeSAqL1xuXHRcdHdoaWxlIChpbmRleCA8IERBVEEubGVuZ3RoICYmIERBVEFbaW5kZXhdIDwgQikge1xuXHRcdFx0aW5kZXgrKztcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXHRcdFxuXHRcdC8qIHZpc2libGUgd2hlbiBvdXRzaWRlIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2hlbiBvdmVybGFwcGluZyAqL1xuXHRcdGlmIChBID09IERBVEFbaW5kZXgtY291bnRdICYmIGNvdW50ID09IDEpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XG5cdFx0aWYgKGJsb2NrcykgeyBcblx0XHRcdGlmIChjb3VudCAlIDIpIHtcblx0XHRcdFx0REFUQS5zcGxpY2UoaW5kZXgtY291bnQsIGNvdW50LCBBKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCwgQSwgQik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFx0XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn07XG4vKipcbiAqIEBjbGFzcyBQcmVjaXNlIHNoYWRvd2Nhc3RpbmcgYWxnb3JpdGhtXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxuICovXG5ST1QuRk9WLlByZWNpc2VTaGFkb3djYXN0aW5nID0gZnVuY3Rpb24obGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucykge1xuXHRST1QuRk9WLmNhbGwodGhpcywgbGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucyk7XG59O1xuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZy5leHRlbmQoUk9ULkZPVik7XG5cbi8qKlxuICogQHNlZSBST1QuRk9WI2NvbXB1dGVcbiAqL1xuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKHgsIHksIFIsIGNhbGxiYWNrKSB7XG5cdC8qIHRoaXMgcGxhY2UgaXMgYWx3YXlzIHZpc2libGUgKi9cblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XG5cblx0Lyogc3RhbmRpbmcgaW4gYSBkYXJrIHBsYWNlLiBGSVhNRSBpcyB0aGlzIGEgZ29vZCBpZGVhPyAgKi9cblx0aWYgKCF0aGlzLl9saWdodFBhc3Nlcyh4LCB5KSkgeyByZXR1cm47IH1cblx0XG5cdC8qIGxpc3Qgb2YgYWxsIHNoYWRvd3MgKi9cblx0dmFyIFNIQURPV1MgPSBbXTtcblx0XG5cdHZhciBjeCwgY3ksIGJsb2NrcywgQTEsIEEyLCB2aXNpYmlsaXR5O1xuXG5cdC8qIGFuYWx5emUgc3Vycm91bmRpbmcgY2VsbHMgaW4gY29uY2VudHJpYyByaW5ncywgc3RhcnRpbmcgZnJvbSB0aGUgY2VudGVyICovXG5cdGZvciAodmFyIHI9MTsgcjw9UjsgcisrKSB7XG5cdFx0dmFyIG5laWdoYm9ycyA9IHRoaXMuX2dldENpcmNsZSh4LCB5LCByKTtcblx0XHR2YXIgbmVpZ2hib3JDb3VudCA9IG5laWdoYm9ycy5sZW5ndGg7XG5cblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvckNvdW50O2krKykge1xuXHRcdFx0Y3ggPSBuZWlnaGJvcnNbaV1bMF07XG5cdFx0XHRjeSA9IG5laWdoYm9yc1tpXVsxXTtcblx0XHRcdC8qIHNoaWZ0IGhhbGYtYW4tYW5nbGUgYmFja3dhcmRzIHRvIG1haW50YWluIGNvbnNpc3RlbmN5IG9mIDAtdGggY2VsbHMgKi9cblx0XHRcdEExID0gW2kgPyAyKmktMSA6IDIqbmVpZ2hib3JDb3VudC0xLCAyKm5laWdoYm9yQ291bnRdO1xuXHRcdFx0QTIgPSBbMippKzEsIDIqbmVpZ2hib3JDb3VudF07IFxuXHRcdFx0XG5cdFx0XHRibG9ja3MgPSAhdGhpcy5fbGlnaHRQYXNzZXMoY3gsIGN5KTtcblx0XHRcdHZpc2liaWxpdHkgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoQTEsIEEyLCBibG9ja3MsIFNIQURPV1MpO1xuXHRcdFx0aWYgKHZpc2liaWxpdHkpIHsgY2FsbGJhY2soY3gsIGN5LCByLCB2aXNpYmlsaXR5KTsgfVxuXG5cdFx0XHRpZiAoU0hBRE9XUy5sZW5ndGggPT0gMiAmJiBTSEFET1dTWzBdWzBdID09IDAgJiYgU0hBRE9XU1sxXVswXSA9PSBTSEFET1dTWzFdWzFdKSB7IHJldHVybjsgfSAvKiBjdXRvZmY/ICovXG5cblx0XHR9IC8qIGZvciBhbGwgY2VsbHMgaW4gdGhpcyByaW5nICovXG5cdH0gLyogZm9yIGFsbCByaW5ncyAqL1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge2ludFsyXX0gQTEgYXJjIHN0YXJ0XG4gKiBAcGFyYW0ge2ludFsyXX0gQTIgYXJjIGVuZFxuICogQHBhcmFtIHtib29sfSBibG9ja3MgRG9lcyBjdXJyZW50IGFyYyBibG9jayB2aXNpYmlsaXR5P1xuICogQHBhcmFtIHtpbnRbXVtdfSBTSEFET1dTIGxpc3Qgb2YgYWN0aXZlIHNoYWRvd3NcbiAqL1xuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuX2NoZWNrVmlzaWJpbGl0eSA9IGZ1bmN0aW9uKEExLCBBMiwgYmxvY2tzLCBTSEFET1dTKSB7XG5cdGlmIChBMVswXSA+IEEyWzBdKSB7IC8qIHNwbGl0IGludG8gdHdvIHN1Yi1hcmNzICovXG5cdFx0dmFyIHYxID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KEExLCBbQTFbMV0sIEExWzFdXSwgYmxvY2tzLCBTSEFET1dTKTtcblx0XHR2YXIgdjIgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoWzAsIDFdLCBBMiwgYmxvY2tzLCBTSEFET1dTKTtcblx0XHRyZXR1cm4gKHYxK3YyKS8yO1xuXHR9XG5cblx0LyogaW5kZXgxOiBmaXJzdCBzaGFkb3cgPj0gQTEgKi9cblx0dmFyIGluZGV4MSA9IDAsIGVkZ2UxID0gZmFsc2U7XG5cdHdoaWxlIChpbmRleDEgPCBTSEFET1dTLmxlbmd0aCkge1xuXHRcdHZhciBvbGQgPSBTSEFET1dTW2luZGV4MV07XG5cdFx0dmFyIGRpZmYgPSBvbGRbMF0qQTFbMV0gLSBBMVswXSpvbGRbMV07XG5cdFx0aWYgKGRpZmYgPj0gMCkgeyAvKiBvbGQgPj0gQTEgKi9cblx0XHRcdGlmIChkaWZmID09IDAgJiYgIShpbmRleDEgJSAyKSkgeyBlZGdlMSA9IHRydWU7IH1cblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XHRpbmRleDErKztcblx0fVxuXG5cdC8qIGluZGV4MjogbGFzdCBzaGFkb3cgPD0gQTIgKi9cblx0dmFyIGluZGV4MiA9IFNIQURPV1MubGVuZ3RoLCBlZGdlMiA9IGZhbHNlO1xuXHR3aGlsZSAoaW5kZXgyLS0pIHtcblx0XHR2YXIgb2xkID0gU0hBRE9XU1tpbmRleDJdO1xuXHRcdHZhciBkaWZmID0gQTJbMF0qb2xkWzFdIC0gb2xkWzBdKkEyWzFdO1xuXHRcdGlmIChkaWZmID49IDApIHsgLyogb2xkIDw9IEEyICovXG5cdFx0XHRpZiAoZGlmZiA9PSAwICYmIChpbmRleDIgJSAyKSkgeyBlZGdlMiA9IHRydWU7IH1cblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdHZhciB2aXNpYmxlID0gdHJ1ZTtcblx0aWYgKGluZGV4MSA9PSBpbmRleDIgJiYgKGVkZ2UxIHx8IGVkZ2UyKSkgeyAgLyogc3Vic2V0IG9mIGV4aXN0aW5nIHNoYWRvdywgb25lIG9mIHRoZSBlZGdlcyBtYXRjaCAqL1xuXHRcdHZpc2libGUgPSBmYWxzZTsgXG5cdH0gZWxzZSBpZiAoZWRnZTEgJiYgZWRnZTIgJiYgaW5kZXgxKzE9PWluZGV4MiAmJiAoaW5kZXgyICUgMikpIHsgLyogY29tcGxldGVseSBlcXVpdmFsZW50IHdpdGggZXhpc3Rpbmcgc2hhZG93ICovXG5cdFx0dmlzaWJsZSA9IGZhbHNlO1xuXHR9IGVsc2UgaWYgKGluZGV4MSA+IGluZGV4MiAmJiAoaW5kZXgxICUgMikpIHsgLyogc3Vic2V0IG9mIGV4aXN0aW5nIHNoYWRvdywgbm90IHRvdWNoaW5nICovXG5cdFx0dmlzaWJsZSA9IGZhbHNlO1xuXHR9XG5cdFxuXHRpZiAoIXZpc2libGUpIHsgcmV0dXJuIDA7IH0gLyogZmFzdCBjYXNlOiBub3QgdmlzaWJsZSAqL1xuXHRcblx0dmFyIHZpc2libGVMZW5ndGgsIFA7XG5cblx0LyogY29tcHV0ZSB0aGUgbGVuZ3RoIG9mIHZpc2libGUgYXJjLCBhZGp1c3QgbGlzdCBvZiBzaGFkb3dzIChpZiBibG9ja2luZykgKi9cblx0dmFyIHJlbW92ZSA9IGluZGV4Mi1pbmRleDErMTtcblx0aWYgKHJlbW92ZSAlIDIpIHtcblx0XHRpZiAoaW5kZXgxICUgMikgeyAvKiBmaXJzdCBlZGdlIHdpdGhpbiBleGlzdGluZyBzaGFkb3csIHNlY29uZCBvdXRzaWRlICovXG5cdFx0XHR2YXIgUCA9IFNIQURPV1NbaW5kZXgxXTtcblx0XHRcdHZpc2libGVMZW5ndGggPSAoQTJbMF0qUFsxXSAtIFBbMF0qQTJbMV0pIC8gKFBbMV0gKiBBMlsxXSk7XG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMik7IH1cblx0XHR9IGVsc2UgeyAvKiBzZWNvbmQgZWRnZSB3aXRoaW4gZXhpc3Rpbmcgc2hhZG93LCBmaXJzdCBvdXRzaWRlICovXG5cdFx0XHR2YXIgUCA9IFNIQURPV1NbaW5kZXgyXTtcblx0XHRcdHZpc2libGVMZW5ndGggPSAoUFswXSpBMVsxXSAtIEExWzBdKlBbMV0pIC8gKEExWzFdICogUFsxXSk7XG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMSk7IH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aWYgKGluZGV4MSAlIDIpIHsgLyogYm90aCBlZGdlcyB3aXRoaW4gZXhpc3Rpbmcgc2hhZG93cyAqL1xuXHRcdFx0dmFyIFAxID0gU0hBRE9XU1tpbmRleDFdO1xuXHRcdFx0dmFyIFAyID0gU0hBRE9XU1tpbmRleDJdO1xuXHRcdFx0dmlzaWJsZUxlbmd0aCA9IChQMlswXSpQMVsxXSAtIFAxWzBdKlAyWzFdKSAvIChQMVsxXSAqIFAyWzFdKTtcblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUpOyB9XG5cdFx0fSBlbHNlIHsgLyogYm90aCBlZGdlcyBvdXRzaWRlIGV4aXN0aW5nIHNoYWRvd3MgKi9cblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUsIEExLCBBMik7IH1cblx0XHRcdHJldHVybiAxOyAvKiB3aG9sZSBhcmMgdmlzaWJsZSEgKi9cblx0XHR9XG5cdH1cblxuXHR2YXIgYXJjTGVuZ3RoID0gKEEyWzBdKkExWzFdIC0gQTFbMF0qQTJbMV0pIC8gKEExWzFdICogQTJbMV0pO1xuXG5cdHJldHVybiB2aXNpYmxlTGVuZ3RoL2FyY0xlbmd0aDtcbn07XG4vKipcbiAqIEBjbGFzcyBSZWN1cnNpdmUgc2hhZG93Y2FzdGluZyBhbGdvcml0aG1cbiAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIDQvOCB0b3BvbG9naWVzLCBub3QgaGV4YWdvbmFsLlxuICogQmFzZWQgb24gUGV0ZXIgSGFya2lucycgaW1wbGVtZW50YXRpb24gb2YgQmrDtnJuIEJlcmdzdHLDtm0ncyBhbGdvcml0aG0gZGVzY3JpYmVkIGhlcmU6IGh0dHA6Ly93d3cucm9ndWViYXNpbi5jb20vaW5kZXgucGhwP3RpdGxlPUZPVl91c2luZ19yZWN1cnNpdmVfc2hhZG93Y2FzdGluZ1xuICogQGF1Z21lbnRzIFJPVC5GT1ZcbiAqL1xuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nID0gZnVuY3Rpb24obGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucykge1xuXHRST1QuRk9WLmNhbGwodGhpcywgbGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucyk7XG59O1xuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLmV4dGVuZChST1QuRk9WKTtcblxuLyoqIE9jdGFudHMgdXNlZCBmb3IgdHJhbnNsYXRpbmcgcmVjdXJzaXZlIHNoYWRvd2Nhc3Rpbmcgb2Zmc2V0cyAqL1xuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFMgPSBbXG5cdFstMSwgIDAsICAwLCAgMV0sXG5cdFsgMCwgLTEsICAxLCAgMF0sXG5cdFsgMCwgLTEsIC0xLCAgMF0sXG5cdFstMSwgIDAsICAwLCAtMV0sXG5cdFsgMSwgIDAsICAwLCAtMV0sXG5cdFsgMCwgIDEsIC0xLCAgMF0sXG5cdFsgMCwgIDEsICAxLCAgMF0sXG5cdFsgMSwgIDAsICAwLCAgMV1cbl07XG5cbi8qKlxuICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDM2MC1kZWdyZWUgY2lyY2xlXG4gKiBAcGFyYW0ge2ludH0geFxuICogQHBhcmFtIHtpbnR9IHlcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKHgsIHksIFIsIGNhbGxiYWNrKSB7XG5cdC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UUy5sZW5ndGg7IGkrKykge1xuXHRcdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1tpXSwgUiwgY2FsbGJhY2spO1xuXHR9XG59O1xuXG4vKipcbiAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSAxODAtZGVncmVlIGFyY1xuICogQHBhcmFtIHtpbnR9IHhcbiAqIEBwYXJhbSB7aW50fSB5XG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXG4gKiBAcGFyYW0ge2ludH0gZGlyIERpcmVjdGlvbiB0byBsb29rIGluIChleHByZXNzZWQgaW4gYSBST1QuRElSUyB2YWx1ZSk7XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUxODAgPSBmdW5jdGlvbih4LCB5LCBSLCBkaXIsIGNhbGxiYWNrKSB7XG5cdC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XG5cdHZhciBwcmV2aW91c09jdGFudCA9IChkaXIgLSAxICsgOCkgJSA4OyAvL05lZWQgdG8gcmV0cmlldmUgdGhlIHByZXZpb3VzIG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXG5cdHZhciBuZXh0UHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMiArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyB0d28gb2N0YW50cyB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXG5cdHZhciBuZXh0T2N0YW50ID0gKGRpcisgMSArIDgpICUgODsgLy9OZWVkIHRvIGdyYWIgdG8gbmV4dCBvY3RhbnQgdG8gcmVuZGVyIGEgZnVsbCAxODAgZGVncmVlc1xuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbbmV4dFByZXZpb3VzT2N0YW50XSwgUiwgY2FsbGJhY2spO1xuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbcHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1tkaXJdLCBSLCBjYWxsYmFjayk7XG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1tuZXh0T2N0YW50XSwgUiwgY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgOTAtZGVncmVlIGFyY1xuICogQHBhcmFtIHtpbnR9IHhcbiAqIEBwYXJhbSB7aW50fSB5XG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXG4gKiBAcGFyYW0ge2ludH0gZGlyIERpcmVjdGlvbiB0byBsb29rIGluIChleHByZXNzZWQgaW4gYSBST1QuRElSUyB2YWx1ZSk7XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGU5MCA9IGZ1bmN0aW9uKHgsIHksIFIsIGRpciwgY2FsbGJhY2spIHtcblx0Ly9Zb3UgY2FuIGFsd2F5cyBzZWUgeW91ciBvd24gdGlsZVxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcblx0dmFyIHByZXZpb3VzT2N0YW50ID0gKGRpciAtIDEgKyA4KSAlIDg7IC8vTmVlZCB0byByZXRyaWV2ZSB0aGUgcHJldmlvdXMgb2N0YW50IHRvIHJlbmRlciBhIGZ1bGwgOTAgZGVncmVlc1xuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbZGlyXSwgUiwgY2FsbGJhY2spO1xuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbcHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIFJlbmRlciBvbmUgb2N0YW50ICg0NS1kZWdyZWUgYXJjKSBvZiB0aGUgdmlld3NoZWRcbiAqIEBwYXJhbSB7aW50fSB4XG4gKiBAcGFyYW0ge2ludH0geVxuICogQHBhcmFtIHtpbnR9IG9jdGFudCBPY3RhbnQgdG8gYmUgcmVuZGVyZWRcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuX3JlbmRlck9jdGFudCA9IGZ1bmN0aW9uKHgsIHksIG9jdGFudCwgUiwgY2FsbGJhY2spIHtcblx0Ly9SYWRpdXMgaW5jcmVtZW50ZWQgYnkgMSB0byBwcm92aWRlIHNhbWUgY292ZXJhZ2UgYXJlYSBhcyBvdGhlciBzaGFkb3djYXN0aW5nIHJhZGl1c2VzXG5cdHRoaXMuX2Nhc3RWaXNpYmlsaXR5KHgsIHksIDEsIDEuMCwgMC4wLCBSICsgMSwgb2N0YW50WzBdLCBvY3RhbnRbMV0sIG9jdGFudFsyXSwgb2N0YW50WzNdLCBjYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIEFjdHVhbGx5IGNhbGN1bGF0ZXMgdGhlIHZpc2liaWxpdHlcbiAqIEBwYXJhbSB7aW50fSBzdGFydFggVGhlIHN0YXJ0aW5nIFggY29vcmRpbmF0ZVxuICogQHBhcmFtIHtpbnR9IHN0YXJ0WSBUaGUgc3RhcnRpbmcgWSBjb29yZGluYXRlXG4gKiBAcGFyYW0ge2ludH0gcm93IFRoZSByb3cgdG8gcmVuZGVyXG4gKiBAcGFyYW0ge2Zsb2F0fSB2aXNTbG9wZVN0YXJ0IFRoZSBzbG9wZSB0byBzdGFydCBhdFxuICogQHBhcmFtIHtmbG9hdH0gdmlzU2xvcGVFbmQgVGhlIHNsb3BlIHRvIGVuZCBhdFxuICogQHBhcmFtIHtpbnR9IHJhZGl1cyBUaGUgcmFkaXVzIHRvIHJlYWNoIG91dCB0b1xuICogQHBhcmFtIHtpbnR9IHh4IFxuICogQHBhcmFtIHtpbnR9IHh5IFxuICogQHBhcmFtIHtpbnR9IHl4IFxuICogQHBhcmFtIHtpbnR9IHl5IFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIHVzZSB3aGVuIHdlIGhpdCBhIGJsb2NrIHRoYXQgaXMgdmlzaWJsZVxuICovXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl9jYXN0VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKHN0YXJ0WCwgc3RhcnRZLCByb3csIHZpc1Nsb3BlU3RhcnQsIHZpc1Nsb3BlRW5kLCByYWRpdXMsIHh4LCB4eSwgeXgsIHl5LCBjYWxsYmFjaykge1xuXHRpZih2aXNTbG9wZVN0YXJ0IDwgdmlzU2xvcGVFbmQpIHsgcmV0dXJuOyB9XG5cdGZvcih2YXIgaSA9IHJvdzsgaSA8PSByYWRpdXM7IGkrKykge1xuXHRcdHZhciBkeCA9IC1pIC0gMTtcblx0XHR2YXIgZHkgPSAtaTtcblx0XHR2YXIgYmxvY2tlZCA9IGZhbHNlO1xuXHRcdHZhciBuZXdTdGFydCA9IDA7XG5cblx0XHQvLydSb3cnIGNvdWxkIGJlIGNvbHVtbiwgbmFtZXMgaGVyZSBhc3N1bWUgb2N0YW50IDAgYW5kIHdvdWxkIGJlIGZsaXBwZWQgZm9yIGhhbGYgdGhlIG9jdGFudHNcblx0XHR3aGlsZShkeCA8PSAwKSB7XG5cdFx0XHRkeCArPSAxO1xuXG5cdFx0XHQvL1RyYW5zbGF0ZSBmcm9tIHJlbGF0aXZlIGNvb3JkaW5hdGVzIHRvIG1hcCBjb29yZGluYXRlc1xuXHRcdFx0dmFyIG1hcFggPSBzdGFydFggKyBkeCAqIHh4ICsgZHkgKiB4eTtcblx0XHRcdHZhciBtYXBZID0gc3RhcnRZICsgZHggKiB5eCArIGR5ICogeXk7XG5cblx0XHRcdC8vUmFuZ2Ugb2YgdGhlIHJvd1xuXHRcdFx0dmFyIHNsb3BlU3RhcnQgPSAoZHggLSAwLjUpIC8gKGR5ICsgMC41KTtcblx0XHRcdHZhciBzbG9wZUVuZCA9IChkeCArIDAuNSkgLyAoZHkgLSAwLjUpO1xuXHRcdFxuXHRcdFx0Ly9JZ25vcmUgaWYgbm90IHlldCBhdCBsZWZ0IGVkZ2Ugb2YgT2N0YW50XG5cdFx0XHRpZihzbG9wZUVuZCA+IHZpc1Nsb3BlU3RhcnQpIHsgY29udGludWU7IH1cblx0XHRcdFxuXHRcdFx0Ly9Eb25lIGlmIHBhc3QgcmlnaHQgZWRnZVxuXHRcdFx0aWYoc2xvcGVTdGFydCA8IHZpc1Nsb3BlRW5kKSB7IGJyZWFrOyB9XG5cdFx0XHRcdFxuXHRcdFx0Ly9JZiBpdCdzIGluIHJhbmdlLCBpdCdzIHZpc2libGVcblx0XHRcdGlmKChkeCAqIGR4ICsgZHkgKiBkeSkgPCAocmFkaXVzICogcmFkaXVzKSkge1xuXHRcdFx0XHRjYWxsYmFjayhtYXBYLCBtYXBZLCBpLCAxKTtcblx0XHRcdH1cblx0XG5cdFx0XHRpZighYmxvY2tlZCkge1xuXHRcdFx0XHQvL0lmIHRpbGUgaXMgYSBibG9ja2luZyB0aWxlLCBjYXN0IGFyb3VuZCBpdFxuXHRcdFx0XHRpZighdGhpcy5fbGlnaHRQYXNzZXMobWFwWCwgbWFwWSkgJiYgaSA8IHJhZGl1cykge1xuXHRcdFx0XHRcdGJsb2NrZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHRoaXMuX2Nhc3RWaXNpYmlsaXR5KHN0YXJ0WCwgc3RhcnRZLCBpICsgMSwgdmlzU2xvcGVTdGFydCwgc2xvcGVTdGFydCwgcmFkaXVzLCB4eCwgeHksIHl4LCB5eSwgY2FsbGJhY2spO1xuXHRcdFx0XHRcdG5ld1N0YXJ0ID0gc2xvcGVFbmQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vS2VlcCBuYXJyb3dpbmcgaWYgc2Nhbm5pbmcgYWNyb3NzIGEgYmxvY2tcblx0XHRcdFx0aWYoIXRoaXMuX2xpZ2h0UGFzc2VzKG1hcFgsIG1hcFkpKSB7XG5cdFx0XHRcdFx0bmV3U3RhcnQgPSBzbG9wZUVuZDtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRcdC8vQmxvY2sgaGFzIGVuZGVkXG5cdFx0XHRcdGJsb2NrZWQgPSBmYWxzZTtcblx0XHRcdFx0dmlzU2xvcGVTdGFydCA9IG5ld1N0YXJ0O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihibG9ja2VkKSB7IGJyZWFrOyB9XG5cdH1cbn07XG4vKipcbiAqIEBuYW1lc3BhY2UgQ29sb3Igb3BlcmF0aW9uc1xuICovXG5ST1QuQ29sb3IgPSB7XG5cdGZyb21TdHJpbmc6IGZ1bmN0aW9uKHN0cikge1xuXHRcdHZhciBjYWNoZWQsIHI7XG5cdFx0aWYgKHN0ciBpbiB0aGlzLl9jYWNoZSkge1xuXHRcdFx0Y2FjaGVkID0gdGhpcy5fY2FjaGVbc3RyXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHN0ci5jaGFyQXQoMCkgPT0gXCIjXCIpIHsgLyogaGV4IHJnYiAqL1xuXG5cdFx0XHRcdHZhciB2YWx1ZXMgPSBzdHIubWF0Y2goL1swLTlhLWZdL2dpKS5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4gcGFyc2VJbnQoeCwgMTYpOyB9KTtcblx0XHRcdFx0aWYgKHZhbHVlcy5sZW5ndGggPT0gMykge1xuXHRcdFx0XHRcdGNhY2hlZCA9IHZhbHVlcy5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4geCoxNzsgfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcblx0XHRcdFx0XHRcdHZhbHVlc1tpKzFdICs9IDE2KnZhbHVlc1tpXTtcblx0XHRcdFx0XHRcdHZhbHVlcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhY2hlZCA9IHZhbHVlcztcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2UgaWYgKChyID0gc3RyLm1hdGNoKC9yZ2JcXCgoWzAtOSwgXSspXFwpL2kpKSkgeyAvKiBkZWNpbWFsIHJnYiAqL1xuXHRcdFx0XHRjYWNoZWQgPSByWzFdLnNwbGl0KC9cXHMqLFxccyovKS5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4gcGFyc2VJbnQoeCk7IH0pO1xuXHRcdFx0fSBlbHNlIHsgLyogaHRtbCBuYW1lICovXG5cdFx0XHRcdGNhY2hlZCA9IFswLCAwLCAwXTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fY2FjaGVbc3RyXSA9IGNhY2hlZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2FjaGVkLnNsaWNlKCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEFkZCB0d28gb3IgbW9yZSBjb2xvcnNcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XG5cdCAqL1xuXHRhZGQ6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XG5cdFx0dmFyIHJlc3VsdCA9IGNvbG9yMS5zbGljZSgpO1xuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XG5cdFx0XHRmb3IgKHZhciBqPTE7ajxhcmd1bWVudHMubGVuZ3RoO2orKykge1xuXHRcdFx0XHRyZXN1bHRbaV0gKz0gYXJndW1lbnRzW2pdW2ldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBBZGQgdHdvIG9yIG1vcmUgY29sb3JzLCBNT0RJRklFUyBGSVJTVCBBUkdVTUVOVFxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cblx0ICovXG5cdGFkZF86IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XG5cdFx0XHRcdGNvbG9yMVtpXSArPSBhcmd1bWVudHNbal1baV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBjb2xvcjE7XG5cdH0sXG5cblx0LyoqXG5cdCAqIE11bHRpcGx5IChtaXgpIHR3byBvciBtb3JlIGNvbG9yc1xuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cblx0ICovXG5cdG11bHRpcGx5OiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMikge1xuXHRcdHZhciByZXN1bHQgPSBjb2xvcjEuc2xpY2UoKTtcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xuXHRcdFx0Zm9yICh2YXIgaj0xO2o8YXJndW1lbnRzLmxlbmd0aDtqKyspIHtcblx0XHRcdFx0cmVzdWx0W2ldICo9IGFyZ3VtZW50c1tqXVtpXSAvIDI1NTtcblx0XHRcdH1cblx0XHRcdHJlc3VsdFtpXSA9IE1hdGgucm91bmQocmVzdWx0W2ldKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblxuXHQvKipcblx0ICogTXVsdGlwbHkgKG1peCkgdHdvIG9yIG1vcmUgY29sb3JzLCBNT0RJRklFUyBGSVJTVCBBUkdVTUVOVFxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cblx0ICovXG5cdG11bHRpcGx5XzogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xuXHRcdFx0Zm9yICh2YXIgaj0xO2o8YXJndW1lbnRzLmxlbmd0aDtqKyspIHtcblx0XHRcdFx0Y29sb3IxW2ldICo9IGFyZ3VtZW50c1tqXVtpXSAvIDI1NTtcblx0XHRcdH1cblx0XHRcdGNvbG9yMVtpXSA9IE1hdGgucm91bmQoY29sb3IxW2ldKTtcblx0XHR9XG5cdFx0cmV0dXJuIGNvbG9yMTtcblx0fSxcblxuXHQvKipcblx0ICogSW50ZXJwb2xhdGUgKGJsZW5kKSB0d28gY29sb3JzIHdpdGggYSBnaXZlbiBmYWN0b3Jcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbZmFjdG9yPTAuNV0gMC4uMVxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XG5cdCAqL1xuXHRpbnRlcnBvbGF0ZTogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIsIGZhY3Rvcikge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgeyBmYWN0b3IgPSAwLjU7IH1cblx0XHR2YXIgcmVzdWx0ID0gY29sb3IxLnNsaWNlKCk7XG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcblx0XHRcdHJlc3VsdFtpXSA9IE1hdGgucm91bmQocmVzdWx0W2ldICsgZmFjdG9yKihjb2xvcjJbaV0tY29sb3IxW2ldKSk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEludGVycG9sYXRlIChibGVuZCkgdHdvIGNvbG9ycyB3aXRoIGEgZ2l2ZW4gZmFjdG9yIGluIEhTTCBtb2RlXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcblx0ICogQHBhcmFtIHtmbG9hdH0gW2ZhY3Rvcj0wLjVdIDAuLjFcblx0ICogQHJldHVybnMge251bWJlcltdfVxuXHQgKi9cblx0aW50ZXJwb2xhdGVIU0w6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCBmYWN0b3IpIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHsgZmFjdG9yID0gMC41OyB9XG5cdFx0dmFyIGhzbDEgPSB0aGlzLnJnYjJoc2woY29sb3IxKTtcblx0XHR2YXIgaHNsMiA9IHRoaXMucmdiMmhzbChjb2xvcjIpO1xuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XG5cdFx0XHRoc2wxW2ldICs9IGZhY3RvciooaHNsMltpXS1oc2wxW2ldKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuaHNsMnJnYihoc2wxKTtcblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgbmV3IHJhbmRvbSBjb2xvciBiYXNlZCBvbiB0aGlzIG9uZVxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBkaWZmIFNldCBvZiBzdGFuZGFyZCBkZXZpYXRpb25zXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cblx0ICovXG5cdHJhbmRvbWl6ZTogZnVuY3Rpb24oY29sb3IsIGRpZmYpIHtcblx0XHRpZiAoIShkaWZmIGluc3RhbmNlb2YgQXJyYXkpKSB7IGRpZmYgPSBNYXRoLnJvdW5kKFJPVC5STkcuZ2V0Tm9ybWFsKDAsIGRpZmYpKTsgfVxuXHRcdHZhciByZXN1bHQgPSBjb2xvci5zbGljZSgpO1xuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XG5cdFx0XHRyZXN1bHRbaV0gKz0gKGRpZmYgaW5zdGFuY2VvZiBBcnJheSA/IE1hdGgucm91bmQoUk9ULlJORy5nZXROb3JtYWwoMCwgZGlmZltpXSkpIDogZGlmZik7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGFuIFJHQiBjb2xvciB2YWx1ZSB0byBIU0wuIEV4cGVjdHMgMC4uMjU1IGlucHV0cywgcHJvZHVjZXMgMC4uMSBvdXRwdXRzLlxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XG5cdCAqL1xuXHRyZ2IyaHNsOiBmdW5jdGlvbihjb2xvcikge1xuXHRcdHZhciByID0gY29sb3JbMF0vMjU1O1xuXHRcdHZhciBnID0gY29sb3JbMV0vMjU1O1xuXHRcdHZhciBiID0gY29sb3JbMl0vMjU1O1xuXG5cdFx0dmFyIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLCBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcblx0XHR2YXIgaCwgcywgbCA9IChtYXggKyBtaW4pIC8gMjtcblxuXHRcdGlmIChtYXggPT0gbWluKSB7XG5cdFx0XHRoID0gcyA9IDA7IC8vIGFjaHJvbWF0aWNcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGQgPSBtYXggLSBtaW47XG5cdFx0XHRzID0gKGwgPiAwLjUgPyBkIC8gKDIgLSBtYXggLSBtaW4pIDogZCAvIChtYXggKyBtaW4pKTtcblx0XHRcdHN3aXRjaChtYXgpIHtcblx0XHRcdFx0Y2FzZSByOiBoID0gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCk7IGJyZWFrO1xuXHRcdFx0XHRjYXNlIGc6IGggPSAoYiAtIHIpIC8gZCArIDI7IGJyZWFrO1xuXHRcdFx0XHRjYXNlIGI6IGggPSAociAtIGcpIC8gZCArIDQ7IGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aCAvPSA2O1xuXHRcdH1cblxuXHRcdHJldHVybiBbaCwgcywgbF07XG5cdH0sXG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGFuIEhTTCBjb2xvciB2YWx1ZSB0byBSR0IuIEV4cGVjdHMgMC4uMSBpbnB1dHMsIHByb2R1Y2VzIDAuLjI1NSBvdXRwdXRzLlxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XG5cdCAqL1xuXHRoc2wycmdiOiBmdW5jdGlvbihjb2xvcikge1xuXHRcdHZhciBsID0gY29sb3JbMl07XG5cblx0XHRpZiAoY29sb3JbMV0gPT0gMCkge1xuXHRcdFx0bCA9IE1hdGgucm91bmQobCoyNTUpO1xuXHRcdFx0cmV0dXJuIFtsLCBsLCBsXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGh1ZTJyZ2IgPSBmdW5jdGlvbihwLCBxLCB0KSB7XG5cdFx0XHRcdGlmICh0IDwgMCkgdCArPSAxO1xuXHRcdFx0XHRpZiAodCA+IDEpIHQgLT0gMTtcblx0XHRcdFx0aWYgKHQgPCAxLzYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xuXHRcdFx0XHRpZiAodCA8IDEvMikgcmV0dXJuIHE7XG5cdFx0XHRcdGlmICh0IDwgMi8zKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMi8zIC0gdCkgKiA2O1xuXHRcdFx0XHRyZXR1cm4gcDtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHMgPSBjb2xvclsxXTtcblx0XHRcdHZhciBxID0gKGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHMpO1xuXHRcdFx0dmFyIHAgPSAyICogbCAtIHE7XG5cdFx0XHR2YXIgciA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0gKyAxLzMpO1xuXHRcdFx0dmFyIGcgPSBodWUycmdiKHAsIHEsIGNvbG9yWzBdKTtcblx0XHRcdHZhciBiID0gaHVlMnJnYihwLCBxLCBjb2xvclswXSAtIDEvMyk7XG5cdFx0XHRyZXR1cm4gW01hdGgucm91bmQocioyNTUpLCBNYXRoLnJvdW5kKGcqMjU1KSwgTWF0aC5yb3VuZChiKjI1NSldO1xuXHRcdH1cblx0fSxcblxuXHR0b1JHQjogZnVuY3Rpb24oY29sb3IpIHtcblx0XHRyZXR1cm4gXCJyZ2IoXCIgKyB0aGlzLl9jbGFtcChjb2xvclswXSkgKyBcIixcIiArIHRoaXMuX2NsYW1wKGNvbG9yWzFdKSArIFwiLFwiICsgdGhpcy5fY2xhbXAoY29sb3JbMl0pICsgXCIpXCI7XG5cdH0sXG5cblx0dG9IZXg6IGZ1bmN0aW9uKGNvbG9yKSB7XG5cdFx0dmFyIHBhcnRzID0gW107XG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcblx0XHRcdHBhcnRzLnB1c2godGhpcy5fY2xhbXAoY29sb3JbaV0pLnRvU3RyaW5nKDE2KS5scGFkKFwiMFwiLCAyKSk7XG5cdFx0fVxuXHRcdHJldHVybiBcIiNcIiArIHBhcnRzLmpvaW4oXCJcIik7XG5cdH0sXG5cblx0X2NsYW1wOiBmdW5jdGlvbihudW0pIHtcblx0XHRpZiAobnVtIDwgMCkge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fSBlbHNlIGlmIChudW0gPiAyNTUpIHtcblx0XHRcdHJldHVybiAyNTU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudW07XG5cdFx0fVxuXHR9LFxuXG5cdF9jYWNoZToge1xuXHRcdFwiYmxhY2tcIjogWzAsMCwwXSxcblx0XHRcIm5hdnlcIjogWzAsMCwxMjhdLFxuXHRcdFwiZGFya2JsdWVcIjogWzAsMCwxMzldLFxuXHRcdFwibWVkaXVtYmx1ZVwiOiBbMCwwLDIwNV0sXG5cdFx0XCJibHVlXCI6IFswLDAsMjU1XSxcblx0XHRcImRhcmtncmVlblwiOiBbMCwxMDAsMF0sXG5cdFx0XCJncmVlblwiOiBbMCwxMjgsMF0sXG5cdFx0XCJ0ZWFsXCI6IFswLDEyOCwxMjhdLFxuXHRcdFwiZGFya2N5YW5cIjogWzAsMTM5LDEzOV0sXG5cdFx0XCJkZWVwc2t5Ymx1ZVwiOiBbMCwxOTEsMjU1XSxcblx0XHRcImRhcmt0dXJxdW9pc2VcIjogWzAsMjA2LDIwOV0sXG5cdFx0XCJtZWRpdW1zcHJpbmdncmVlblwiOiBbMCwyNTAsMTU0XSxcblx0XHRcImxpbWVcIjogWzAsMjU1LDBdLFxuXHRcdFwic3ByaW5nZ3JlZW5cIjogWzAsMjU1LDEyN10sXG5cdFx0XCJhcXVhXCI6IFswLDI1NSwyNTVdLFxuXHRcdFwiY3lhblwiOiBbMCwyNTUsMjU1XSxcblx0XHRcIm1pZG5pZ2h0Ymx1ZVwiOiBbMjUsMjUsMTEyXSxcblx0XHRcImRvZGdlcmJsdWVcIjogWzMwLDE0NCwyNTVdLFxuXHRcdFwiZm9yZXN0Z3JlZW5cIjogWzM0LDEzOSwzNF0sXG5cdFx0XCJzZWFncmVlblwiOiBbNDYsMTM5LDg3XSxcblx0XHRcImRhcmtzbGF0ZWdyYXlcIjogWzQ3LDc5LDc5XSxcblx0XHRcImRhcmtzbGF0ZWdyZXlcIjogWzQ3LDc5LDc5XSxcblx0XHRcImxpbWVncmVlblwiOiBbNTAsMjA1LDUwXSxcblx0XHRcIm1lZGl1bXNlYWdyZWVuXCI6IFs2MCwxNzksMTEzXSxcblx0XHRcInR1cnF1b2lzZVwiOiBbNjQsMjI0LDIwOF0sXG5cdFx0XCJyb3lhbGJsdWVcIjogWzY1LDEwNSwyMjVdLFxuXHRcdFwic3RlZWxibHVlXCI6IFs3MCwxMzAsMTgwXSxcblx0XHRcImRhcmtzbGF0ZWJsdWVcIjogWzcyLDYxLDEzOV0sXG5cdFx0XCJtZWRpdW10dXJxdW9pc2VcIjogWzcyLDIwOSwyMDRdLFxuXHRcdFwiaW5kaWdvXCI6IFs3NSwwLDEzMF0sXG5cdFx0XCJkYXJrb2xpdmVncmVlblwiOiBbODUsMTA3LDQ3XSxcblx0XHRcImNhZGV0Ymx1ZVwiOiBbOTUsMTU4LDE2MF0sXG5cdFx0XCJjb3JuZmxvd2VyYmx1ZVwiOiBbMTAwLDE0OSwyMzddLFxuXHRcdFwibWVkaXVtYXF1YW1hcmluZVwiOiBbMTAyLDIwNSwxNzBdLFxuXHRcdFwiZGltZ3JheVwiOiBbMTA1LDEwNSwxMDVdLFxuXHRcdFwiZGltZ3JleVwiOiBbMTA1LDEwNSwxMDVdLFxuXHRcdFwic2xhdGVibHVlXCI6IFsxMDYsOTAsMjA1XSxcblx0XHRcIm9saXZlZHJhYlwiOiBbMTA3LDE0MiwzNV0sXG5cdFx0XCJzbGF0ZWdyYXlcIjogWzExMiwxMjgsMTQ0XSxcblx0XHRcInNsYXRlZ3JleVwiOiBbMTEyLDEyOCwxNDRdLFxuXHRcdFwibGlnaHRzbGF0ZWdyYXlcIjogWzExOSwxMzYsMTUzXSxcblx0XHRcImxpZ2h0c2xhdGVncmV5XCI6IFsxMTksMTM2LDE1M10sXG5cdFx0XCJtZWRpdW1zbGF0ZWJsdWVcIjogWzEyMywxMDQsMjM4XSxcblx0XHRcImxhd25ncmVlblwiOiBbMTI0LDI1MiwwXSxcblx0XHRcImNoYXJ0cmV1c2VcIjogWzEyNywyNTUsMF0sXG5cdFx0XCJhcXVhbWFyaW5lXCI6IFsxMjcsMjU1LDIxMl0sXG5cdFx0XCJtYXJvb25cIjogWzEyOCwwLDBdLFxuXHRcdFwicHVycGxlXCI6IFsxMjgsMCwxMjhdLFxuXHRcdFwib2xpdmVcIjogWzEyOCwxMjgsMF0sXG5cdFx0XCJncmF5XCI6IFsxMjgsMTI4LDEyOF0sXG5cdFx0XCJncmV5XCI6IFsxMjgsMTI4LDEyOF0sXG5cdFx0XCJza3libHVlXCI6IFsxMzUsMjA2LDIzNV0sXG5cdFx0XCJsaWdodHNreWJsdWVcIjogWzEzNSwyMDYsMjUwXSxcblx0XHRcImJsdWV2aW9sZXRcIjogWzEzOCw0MywyMjZdLFxuXHRcdFwiZGFya3JlZFwiOiBbMTM5LDAsMF0sXG5cdFx0XCJkYXJrbWFnZW50YVwiOiBbMTM5LDAsMTM5XSxcblx0XHRcInNhZGRsZWJyb3duXCI6IFsxMzksNjksMTldLFxuXHRcdFwiZGFya3NlYWdyZWVuXCI6IFsxNDMsMTg4LDE0M10sXG5cdFx0XCJsaWdodGdyZWVuXCI6IFsxNDQsMjM4LDE0NF0sXG5cdFx0XCJtZWRpdW1wdXJwbGVcIjogWzE0NywxMTIsMjE2XSxcblx0XHRcImRhcmt2aW9sZXRcIjogWzE0OCwwLDIxMV0sXG5cdFx0XCJwYWxlZ3JlZW5cIjogWzE1MiwyNTEsMTUyXSxcblx0XHRcImRhcmtvcmNoaWRcIjogWzE1Myw1MCwyMDRdLFxuXHRcdFwieWVsbG93Z3JlZW5cIjogWzE1NCwyMDUsNTBdLFxuXHRcdFwic2llbm5hXCI6IFsxNjAsODIsNDVdLFxuXHRcdFwiYnJvd25cIjogWzE2NSw0Miw0Ml0sXG5cdFx0XCJkYXJrZ3JheVwiOiBbMTY5LDE2OSwxNjldLFxuXHRcdFwiZGFya2dyZXlcIjogWzE2OSwxNjksMTY5XSxcblx0XHRcImxpZ2h0Ymx1ZVwiOiBbMTczLDIxNiwyMzBdLFxuXHRcdFwiZ3JlZW55ZWxsb3dcIjogWzE3MywyNTUsNDddLFxuXHRcdFwicGFsZXR1cnF1b2lzZVwiOiBbMTc1LDIzOCwyMzhdLFxuXHRcdFwibGlnaHRzdGVlbGJsdWVcIjogWzE3NiwxOTYsMjIyXSxcblx0XHRcInBvd2RlcmJsdWVcIjogWzE3NiwyMjQsMjMwXSxcblx0XHRcImZpcmVicmlja1wiOiBbMTc4LDM0LDM0XSxcblx0XHRcImRhcmtnb2xkZW5yb2RcIjogWzE4NCwxMzQsMTFdLFxuXHRcdFwibWVkaXVtb3JjaGlkXCI6IFsxODYsODUsMjExXSxcblx0XHRcInJvc3licm93blwiOiBbMTg4LDE0MywxNDNdLFxuXHRcdFwiZGFya2toYWtpXCI6IFsxODksMTgzLDEwN10sXG5cdFx0XCJzaWx2ZXJcIjogWzE5MiwxOTIsMTkyXSxcblx0XHRcIm1lZGl1bXZpb2xldHJlZFwiOiBbMTk5LDIxLDEzM10sXG5cdFx0XCJpbmRpYW5yZWRcIjogWzIwNSw5Miw5Ml0sXG5cdFx0XCJwZXJ1XCI6IFsyMDUsMTMzLDYzXSxcblx0XHRcImNob2NvbGF0ZVwiOiBbMjEwLDEwNSwzMF0sXG5cdFx0XCJ0YW5cIjogWzIxMCwxODAsMTQwXSxcblx0XHRcImxpZ2h0Z3JheVwiOiBbMjExLDIxMSwyMTFdLFxuXHRcdFwibGlnaHRncmV5XCI6IFsyMTEsMjExLDIxMV0sXG5cdFx0XCJwYWxldmlvbGV0cmVkXCI6IFsyMTYsMTEyLDE0N10sXG5cdFx0XCJ0aGlzdGxlXCI6IFsyMTYsMTkxLDIxNl0sXG5cdFx0XCJvcmNoaWRcIjogWzIxOCwxMTIsMjE0XSxcblx0XHRcImdvbGRlbnJvZFwiOiBbMjE4LDE2NSwzMl0sXG5cdFx0XCJjcmltc29uXCI6IFsyMjAsMjAsNjBdLFxuXHRcdFwiZ2FpbnNib3JvXCI6IFsyMjAsMjIwLDIyMF0sXG5cdFx0XCJwbHVtXCI6IFsyMjEsMTYwLDIyMV0sXG5cdFx0XCJidXJseXdvb2RcIjogWzIyMiwxODQsMTM1XSxcblx0XHRcImxpZ2h0Y3lhblwiOiBbMjI0LDI1NSwyNTVdLFxuXHRcdFwibGF2ZW5kZXJcIjogWzIzMCwyMzAsMjUwXSxcblx0XHRcImRhcmtzYWxtb25cIjogWzIzMywxNTAsMTIyXSxcblx0XHRcInZpb2xldFwiOiBbMjM4LDEzMCwyMzhdLFxuXHRcdFwicGFsZWdvbGRlbnJvZFwiOiBbMjM4LDIzMiwxNzBdLFxuXHRcdFwibGlnaHRjb3JhbFwiOiBbMjQwLDEyOCwxMjhdLFxuXHRcdFwia2hha2lcIjogWzI0MCwyMzAsMTQwXSxcblx0XHRcImFsaWNlYmx1ZVwiOiBbMjQwLDI0OCwyNTVdLFxuXHRcdFwiaG9uZXlkZXdcIjogWzI0MCwyNTUsMjQwXSxcblx0XHRcImF6dXJlXCI6IFsyNDAsMjU1LDI1NV0sXG5cdFx0XCJzYW5keWJyb3duXCI6IFsyNDQsMTY0LDk2XSxcblx0XHRcIndoZWF0XCI6IFsyNDUsMjIyLDE3OV0sXG5cdFx0XCJiZWlnZVwiOiBbMjQ1LDI0NSwyMjBdLFxuXHRcdFwid2hpdGVzbW9rZVwiOiBbMjQ1LDI0NSwyNDVdLFxuXHRcdFwibWludGNyZWFtXCI6IFsyNDUsMjU1LDI1MF0sXG5cdFx0XCJnaG9zdHdoaXRlXCI6IFsyNDgsMjQ4LDI1NV0sXG5cdFx0XCJzYWxtb25cIjogWzI1MCwxMjgsMTE0XSxcblx0XHRcImFudGlxdWV3aGl0ZVwiOiBbMjUwLDIzNSwyMTVdLFxuXHRcdFwibGluZW5cIjogWzI1MCwyNDAsMjMwXSxcblx0XHRcImxpZ2h0Z29sZGVucm9keWVsbG93XCI6IFsyNTAsMjUwLDIxMF0sXG5cdFx0XCJvbGRsYWNlXCI6IFsyNTMsMjQ1LDIzMF0sXG5cdFx0XCJyZWRcIjogWzI1NSwwLDBdLFxuXHRcdFwiZnVjaHNpYVwiOiBbMjU1LDAsMjU1XSxcblx0XHRcIm1hZ2VudGFcIjogWzI1NSwwLDI1NV0sXG5cdFx0XCJkZWVwcGlua1wiOiBbMjU1LDIwLDE0N10sXG5cdFx0XCJvcmFuZ2VyZWRcIjogWzI1NSw2OSwwXSxcblx0XHRcInRvbWF0b1wiOiBbMjU1LDk5LDcxXSxcblx0XHRcImhvdHBpbmtcIjogWzI1NSwxMDUsMTgwXSxcblx0XHRcImNvcmFsXCI6IFsyNTUsMTI3LDgwXSxcblx0XHRcImRhcmtvcmFuZ2VcIjogWzI1NSwxNDAsMF0sXG5cdFx0XCJsaWdodHNhbG1vblwiOiBbMjU1LDE2MCwxMjJdLFxuXHRcdFwib3JhbmdlXCI6IFsyNTUsMTY1LDBdLFxuXHRcdFwibGlnaHRwaW5rXCI6IFsyNTUsMTgyLDE5M10sXG5cdFx0XCJwaW5rXCI6IFsyNTUsMTkyLDIwM10sXG5cdFx0XCJnb2xkXCI6IFsyNTUsMjE1LDBdLFxuXHRcdFwicGVhY2hwdWZmXCI6IFsyNTUsMjE4LDE4NV0sXG5cdFx0XCJuYXZham93aGl0ZVwiOiBbMjU1LDIyMiwxNzNdLFxuXHRcdFwibW9jY2FzaW5cIjogWzI1NSwyMjgsMTgxXSxcblx0XHRcImJpc3F1ZVwiOiBbMjU1LDIyOCwxOTZdLFxuXHRcdFwibWlzdHlyb3NlXCI6IFsyNTUsMjI4LDIyNV0sXG5cdFx0XCJibGFuY2hlZGFsbW9uZFwiOiBbMjU1LDIzNSwyMDVdLFxuXHRcdFwicGFwYXlhd2hpcFwiOiBbMjU1LDIzOSwyMTNdLFxuXHRcdFwibGF2ZW5kZXJibHVzaFwiOiBbMjU1LDI0MCwyNDVdLFxuXHRcdFwic2Vhc2hlbGxcIjogWzI1NSwyNDUsMjM4XSxcblx0XHRcImNvcm5zaWxrXCI6IFsyNTUsMjQ4LDIyMF0sXG5cdFx0XCJsZW1vbmNoaWZmb25cIjogWzI1NSwyNTAsMjA1XSxcblx0XHRcImZsb3JhbHdoaXRlXCI6IFsyNTUsMjUwLDI0MF0sXG5cdFx0XCJzbm93XCI6IFsyNTUsMjUwLDI1MF0sXG5cdFx0XCJ5ZWxsb3dcIjogWzI1NSwyNTUsMF0sXG5cdFx0XCJsaWdodHllbGxvd1wiOiBbMjU1LDI1NSwyMjRdLFxuXHRcdFwiaXZvcnlcIjogWzI1NSwyNTUsMjQwXSxcblx0XHRcIndoaXRlXCI6IFsyNTUsMjU1LDI1NV1cblx0fVxufTtcbi8qKlxuICogQGNsYXNzIExpZ2h0aW5nIGNvbXB1dGF0aW9uLCBiYXNlZCBvbiBhIHRyYWRpdGlvbmFsIEZPViBmb3IgbXVsdGlwbGUgbGlnaHQgc291cmNlcyBhbmQgbXVsdGlwbGUgcGFzc2VzLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gcmVmbGVjdGl2aXR5Q2FsbGJhY2sgQ2FsbGJhY2sgdG8gcmV0cmlldmUgY2VsbCByZWZsZWN0aXZpdHkgKDAuLjEpXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucGFzc2VzPTFdIE51bWJlciBvZiBwYXNzZXMuIDEgZXF1YWxzIHRvIHNpbXBsZSBGT1Ygb2YgYWxsIGxpZ2h0IHNvdXJjZXMsID4xIG1lYW5zIGEgKmhpZ2hseSBzaW1wbGlmaWVkKiByYWRpb3NpdHktbGlrZSBhbGdvcml0aG0uXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMuZW1pc3Npb25UaHJlc2hvbGQ9MTAwXSBDZWxscyB3aXRoIGVtaXNzaXZpdHkgPiB0aHJlc2hvbGQgd2lsbCBiZSB0cmVhdGVkIGFzIGxpZ2h0IHNvdXJjZSBpbiB0aGUgbmV4dCBwYXNzLlxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnJhbmdlPTEwXSBNYXggbGlnaHQgcmFuZ2VcbiAqL1xuUk9ULkxpZ2h0aW5nID0gZnVuY3Rpb24ocmVmbGVjdGl2aXR5Q2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FsbGJhY2sgPSByZWZsZWN0aXZpdHlDYWxsYmFjaztcblx0dGhpcy5fb3B0aW9ucyA9IHtcblx0XHRwYXNzZXM6IDEsXG5cdFx0ZW1pc3Npb25UaHJlc2hvbGQ6IDEwMCxcblx0XHRyYW5nZTogMTBcblx0fTtcblx0dGhpcy5fZm92ID0gbnVsbDtcblxuXHR0aGlzLl9saWdodHMgPSB7fTtcblx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGUgPSB7fTtcblx0dGhpcy5fZm92Q2FjaGUgPSB7fTtcblxuXHR0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIEFkanVzdCBvcHRpb25zIGF0IHJ1bnRpbWVcbiAqIEBzZWUgUk9ULkxpZ2h0aW5nXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gKi9cblJPVC5MaWdodGluZy5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XG5cdGlmIChvcHRpb25zICYmIG9wdGlvbnMucmFuZ2UpIHsgdGhpcy5yZXNldCgpOyB9XG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIHVzZWQgRmllbGQtT2YtVmlldyBhbGdvXG4gKiBAcGFyYW0ge1JPVC5GT1Z9IGZvdlxuICovXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLnNldEZPViA9IGZ1bmN0aW9uKGZvdikge1xuXHR0aGlzLl9mb3YgPSBmb3Y7XG5cdHRoaXMuX2ZvdkNhY2hlID0ge307XG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgKG9yIHJlbW92ZSkgYSBsaWdodCBzb3VyY2VcbiAqIEBwYXJhbSB7aW50fSB4XG4gKiBAcGFyYW0ge2ludH0geVxuICogQHBhcmFtIHtudWxsIHx8IHN0cmluZyB8fCBudW1iZXJbM119IGNvbG9yXG4gKi9cblJPVC5MaWdodGluZy5wcm90b3R5cGUuc2V0TGlnaHQgPSBmdW5jdGlvbih4LCB5LCBjb2xvcikge1xuICB2YXIga2V5ID0geCArIFwiLFwiICsgeTtcblxuICBpZiAoY29sb3IpIHtcbiAgICB0aGlzLl9saWdodHNba2V5XSA9ICh0eXBlb2YoY29sb3IpID09IFwic3RyaW5nXCIgPyBST1QuQ29sb3IuZnJvbVN0cmluZyhjb2xvcikgOiBjb2xvcik7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIHRoaXMuX2xpZ2h0c1trZXldO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYWxsIGxpZ2h0IHNvdXJjZXNcbiAqL1xuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5jbGVhckxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2xpZ2h0cyA9IHt9O1xufTtcblxuLyoqXG4gKiBSZXNldCB0aGUgcHJlLWNvbXB1dGVkIHRvcG9sb2d5IHZhbHVlcy4gQ2FsbCB3aGVuZXZlciB0aGUgdW5kZXJseWluZyBtYXAgY2hhbmdlcyBpdHMgbGlnaHQtcGFzc2FiaWxpdHkuXG4gKi9cblJPVC5MaWdodGluZy5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGUgPSB7fTtcblx0dGhpcy5fZm92Q2FjaGUgPSB7fTtcblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgbGlnaHRpbmdcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpZ2h0aW5nQ2FsbGJhY2sgV2lsbCBiZSBjYWxsZWQgd2l0aCAoeCwgeSwgY29sb3IpIGZvciBldmVyeSBsaXQgY2VsbFxuICovXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihsaWdodGluZ0NhbGxiYWNrKSB7XG5cdHZhciBkb25lQ2VsbHMgPSB7fTtcblx0dmFyIGVtaXR0aW5nQ2VsbHMgPSB7fTtcblx0dmFyIGxpdENlbGxzID0ge307XG5cblx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2xpZ2h0cykgeyAvKiBwcmVwYXJlIGVtaXR0ZXJzIGZvciBmaXJzdCBwYXNzICovXG5cdFx0dmFyIGxpZ2h0ID0gdGhpcy5fbGlnaHRzW2tleV07XG5cdFx0ZW1pdHRpbmdDZWxsc1trZXldID0gWzAsIDAsIDBdO1xuXHRcdFJPVC5Db2xvci5hZGRfKGVtaXR0aW5nQ2VsbHNba2V5XSwgbGlnaHQpO1xuXHR9XG5cblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fb3B0aW9ucy5wYXNzZXM7aSsrKSB7IC8qIG1haW4gbG9vcCAqL1xuXHRcdHRoaXMuX2VtaXRMaWdodChlbWl0dGluZ0NlbGxzLCBsaXRDZWxscywgZG9uZUNlbGxzKTtcblx0XHRpZiAoaSsxID09IHRoaXMuX29wdGlvbnMucGFzc2VzKSB7IGNvbnRpbnVlOyB9IC8qIG5vdCBmb3IgdGhlIGxhc3QgcGFzcyAqL1xuXHRcdGVtaXR0aW5nQ2VsbHMgPSB0aGlzLl9jb21wdXRlRW1pdHRlcnMobGl0Q2VsbHMsIGRvbmVDZWxscyk7XG5cdH1cblxuXHRmb3IgKHZhciBsaXRLZXkgaW4gbGl0Q2VsbHMpIHsgLyogbGV0IHRoZSB1c2VyIGtub3cgd2hhdCBhbmQgaG93IGlzIGxpdCAqL1xuXHRcdHZhciBwYXJ0cyA9IGxpdEtleS5zcGxpdChcIixcIik7XG5cdFx0dmFyIHggPSBwYXJzZUludChwYXJ0c1swXSk7XG5cdFx0dmFyIHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XG5cdFx0bGlnaHRpbmdDYWxsYmFjayh4LCB5LCBsaXRDZWxsc1tsaXRLZXldKTtcblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDb21wdXRlIG9uZSBpdGVyYXRpb24gZnJvbSBhbGwgZW1pdHRpbmcgY2VsbHNcbiAqIEBwYXJhbSB7b2JqZWN0fSBlbWl0dGluZ0NlbGxzIFRoZXNlIGVtaXQgbGlnaHRcbiAqIEBwYXJhbSB7b2JqZWN0fSBsaXRDZWxscyBBZGQgcHJvamVjdGVkIGxpZ2h0IHRvIHRoZXNlXG4gKiBAcGFyYW0ge29iamVjdH0gZG9uZUNlbGxzIFRoZXNlIGFscmVhZHkgZW1pdHRlZCwgZm9yYmlkIHRoZW0gZnJvbSBmdXJ0aGVyIGNhbGN1bGF0aW9uc1xuICovXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLl9lbWl0TGlnaHQgPSBmdW5jdGlvbihlbWl0dGluZ0NlbGxzLCBsaXRDZWxscywgZG9uZUNlbGxzKSB7XG5cdGZvciAodmFyIGtleSBpbiBlbWl0dGluZ0NlbGxzKSB7XG5cdFx0dmFyIHBhcnRzID0ga2V5LnNwbGl0KFwiLFwiKTtcblx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcblx0XHR2YXIgeSA9IHBhcnNlSW50KHBhcnRzWzFdKTtcblx0XHR0aGlzLl9lbWl0TGlnaHRGcm9tQ2VsbCh4LCB5LCBlbWl0dGluZ0NlbGxzW2tleV0sIGxpdENlbGxzKTtcblx0XHRkb25lQ2VsbHNba2V5XSA9IDE7XG5cdH1cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFByZXBhcmUgYSBsaXN0IG9mIGVtaXR0ZXJzIGZvciBuZXh0IHBhc3NcbiAqIEBwYXJhbSB7b2JqZWN0fSBsaXRDZWxsc1xuICogQHBhcmFtIHtvYmplY3R9IGRvbmVDZWxsc1xuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5fY29tcHV0ZUVtaXR0ZXJzID0gZnVuY3Rpb24obGl0Q2VsbHMsIGRvbmVDZWxscykge1xuXHR2YXIgcmVzdWx0ID0ge307XG5cblx0Zm9yICh2YXIga2V5IGluIGxpdENlbGxzKSB7XG5cdFx0aWYgKGtleSBpbiBkb25lQ2VsbHMpIHsgY29udGludWU7IH0gLyogYWxyZWFkeSBlbWl0dGVkICovXG5cblx0XHR2YXIgY29sb3IgPSBsaXRDZWxsc1trZXldO1xuXG5cdFx0aWYgKGtleSBpbiB0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZSkge1xuXHRcdFx0dmFyIHJlZmxlY3Rpdml0eSA9IHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlW2tleV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XG5cdFx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcblx0XHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xuXHRcdFx0dmFyIHJlZmxlY3Rpdml0eSA9IHRoaXMuX3JlZmxlY3Rpdml0eUNhbGxiYWNrKHgsIHkpO1xuXHRcdFx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGVba2V5XSA9IHJlZmxlY3Rpdml0eTtcblx0XHR9XG5cblx0XHRpZiAocmVmbGVjdGl2aXR5ID09IDApIHsgY29udGludWU7IH0gLyogd2lsbCBub3QgcmVmbGVjdCBhdCBhbGwgKi9cblxuXHRcdC8qIGNvbXB1dGUgZW1pc3Npb24gY29sb3IgKi9cblx0XHR2YXIgZW1pc3Npb24gPSBbXTtcblx0XHR2YXIgaW50ZW5zaXR5ID0gMDtcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xuXHRcdFx0dmFyIHBhcnQgPSBNYXRoLnJvdW5kKGNvbG9yW2ldKnJlZmxlY3Rpdml0eSk7XG5cdFx0XHRlbWlzc2lvbltpXSA9IHBhcnQ7XG5cdFx0XHRpbnRlbnNpdHkgKz0gcGFydDtcblx0XHR9XG5cdFx0aWYgKGludGVuc2l0eSA+IHRoaXMuX29wdGlvbnMuZW1pc3Npb25UaHJlc2hvbGQpIHsgcmVzdWx0W2tleV0gPSBlbWlzc2lvbjsgfVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQ29tcHV0ZSBvbmUgaXRlcmF0aW9uIGZyb20gb25lIGNlbGxcbiAqIEBwYXJhbSB7aW50fSB4XG4gKiBAcGFyYW0ge2ludH0geVxuICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3JcbiAqIEBwYXJhbSB7b2JqZWN0fSBsaXRDZWxscyBDZWxsIGRhdGEgdG8gYnkgdXBkYXRlZFxuICovXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLl9lbWl0TGlnaHRGcm9tQ2VsbCA9IGZ1bmN0aW9uKHgsIHksIGNvbG9yLCBsaXRDZWxscykge1xuXHR2YXIga2V5ID0geCtcIixcIit5O1xuXHRpZiAoa2V5IGluIHRoaXMuX2ZvdkNhY2hlKSB7XG5cdFx0dmFyIGZvdiA9IHRoaXMuX2ZvdkNhY2hlW2tleV07XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGZvdiA9IHRoaXMuX3VwZGF0ZUZPVih4LCB5KTtcblx0fVxuXG5cdGZvciAodmFyIGZvdktleSBpbiBmb3YpIHtcblx0XHR2YXIgZm9ybUZhY3RvciA9IGZvdltmb3ZLZXldO1xuXG5cdFx0aWYgKGZvdktleSBpbiBsaXRDZWxscykgeyAvKiBhbHJlYWR5IGxpdCAqL1xuXHRcdFx0dmFyIHJlc3VsdCA9IGxpdENlbGxzW2ZvdktleV07XG5cdFx0fSBlbHNlIHsgLyogbmV3bHkgbGl0ICovXG5cdFx0XHR2YXIgcmVzdWx0ID0gWzAsIDAsIDBdO1xuXHRcdFx0bGl0Q2VsbHNbZm92S2V5XSA9IHJlc3VsdDtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykgeyByZXN1bHRbaV0gKz0gTWF0aC5yb3VuZChjb2xvcltpXSpmb3JtRmFjdG9yKTsgfSAvKiBhZGQgbGlnaHQgY29sb3IgKi9cblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDb21wdXRlIEZPViAoXCJmb3JtIGZhY3RvclwiKSBmb3IgYSBwb3RlbnRpYWwgbGlnaHQgc291cmNlIGF0IFt4LHldXG4gKiBAcGFyYW0ge2ludH0geFxuICogQHBhcmFtIHtpbnR9IHlcbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKi9cblJPVC5MaWdodGluZy5wcm90b3R5cGUuX3VwZGF0ZUZPViA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0dmFyIGtleTEgPSB4K1wiLFwiK3k7XG5cdHZhciBjYWNoZSA9IHt9O1xuXHR0aGlzLl9mb3ZDYWNoZVtrZXkxXSA9IGNhY2hlO1xuXHR2YXIgcmFuZ2UgPSB0aGlzLl9vcHRpb25zLnJhbmdlO1xuXHR2YXIgY2IgPSBmdW5jdGlvbih4LCB5LCByLCB2aXMpIHtcblx0XHR2YXIga2V5MiA9IHgrXCIsXCIreTtcblx0XHR2YXIgZm9ybUZhY3RvciA9IHZpcyAqICgxLXIvcmFuZ2UpO1xuXHRcdGlmIChmb3JtRmFjdG9yID09IDApIHsgcmV0dXJuOyB9XG5cdFx0Y2FjaGVba2V5Ml0gPSBmb3JtRmFjdG9yO1xuXHR9O1xuXHR0aGlzLl9mb3YuY29tcHV0ZSh4LCB5LCByYW5nZSwgY2IuYmluZCh0aGlzKSk7XG5cblx0cmV0dXJuIGNhY2hlO1xufTtcbi8qKlxuICogQGNsYXNzIEFic3RyYWN0IHBhdGhmaW5kZXJcbiAqIEBwYXJhbSB7aW50fSB0b1ggVGFyZ2V0IFggY29vcmRcbiAqIEBwYXJhbSB7aW50fSB0b1kgVGFyZ2V0IFkgY29vcmRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHBhc3NhYmxlQ2FsbGJhY2sgQ2FsbGJhY2sgdG8gZGV0ZXJtaW5lIG1hcCBwYXNzYWJpbGl0eVxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5PThdXG4gKi9cblJPVC5QYXRoID0gZnVuY3Rpb24odG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0dGhpcy5fdG9YID0gdG9YO1xuXHR0aGlzLl90b1kgPSB0b1k7XG5cdHRoaXMuX2Zyb21YID0gbnVsbDtcblx0dGhpcy5fZnJvbVkgPSBudWxsO1xuXHR0aGlzLl9wYXNzYWJsZUNhbGxiYWNrID0gcGFzc2FibGVDYWxsYmFjaztcblx0dGhpcy5fb3B0aW9ucyA9IHtcblx0XHR0b3BvbG9neTogOFxuXHR9O1xuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cblxuXHR0aGlzLl9kaXJzID0gUk9ULkRJUlNbdGhpcy5fb3B0aW9ucy50b3BvbG9neV07XG5cdGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDgpIHsgLyogcmVvcmRlciBkaXJzIGZvciBtb3JlIGFlc3RoZXRpYyByZXN1bHQgKHZlcnRpY2FsL2hvcml6b250YWwgZmlyc3QpICovXG5cdFx0dGhpcy5fZGlycyA9IFtcblx0XHRcdHRoaXMuX2RpcnNbMF0sXG5cdFx0XHR0aGlzLl9kaXJzWzJdLFxuXHRcdFx0dGhpcy5fZGlyc1s0XSxcblx0XHRcdHRoaXMuX2RpcnNbNl0sXG5cdFx0XHR0aGlzLl9kaXJzWzFdLFxuXHRcdFx0dGhpcy5fZGlyc1szXSxcblx0XHRcdHRoaXMuX2RpcnNbNV0sXG5cdFx0XHR0aGlzLl9kaXJzWzddXG5cdFx0XVxuXHR9XG59O1xuXG4vKipcbiAqIENvbXB1dGUgYSBwYXRoIGZyb20gYSBnaXZlbiBwb2ludFxuICogQHBhcmFtIHtpbnR9IGZyb21YXG4gKiBAcGFyYW0ge2ludH0gZnJvbVlcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFdpbGwgYmUgY2FsbGVkIGZvciBldmVyeSBwYXRoIGl0ZW0gd2l0aCBhcmd1bWVudHMgXCJ4XCIgYW5kIFwieVwiXG4gKi9cblJPVC5QYXRoLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZLCBjYWxsYmFjaykge1xufTtcblxuUk9ULlBhdGgucHJvdG90eXBlLl9nZXROZWlnaGJvcnMgPSBmdW5jdGlvbihjeCwgY3kpIHtcblx0dmFyIHJlc3VsdCA9IFtdO1xuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9kaXJzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgZGlyID0gdGhpcy5fZGlyc1tpXTtcblx0XHR2YXIgeCA9IGN4ICsgZGlyWzBdO1xuXHRcdHZhciB5ID0gY3kgKyBkaXJbMV07XG5cdFx0XG5cdFx0aWYgKCF0aGlzLl9wYXNzYWJsZUNhbGxiYWNrKHgsIHkpKSB7IGNvbnRpbnVlOyB9XG5cdFx0cmVzdWx0LnB1c2goW3gsIHldKTtcblx0fVxuXHRcblx0cmV0dXJuIHJlc3VsdDtcbn07XG4vKipcbiAqIEBjbGFzcyBTaW1wbGlmaWVkIERpamtzdHJhJ3MgYWxnb3JpdGhtOiBhbGwgZWRnZXMgaGF2ZSBhIHZhbHVlIG9mIDFcbiAqIEBhdWdtZW50cyBST1QuUGF0aFxuICogQHNlZSBST1QuUGF0aFxuICovXG5ST1QuUGF0aC5EaWprc3RyYSA9IGZ1bmN0aW9uKHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zKSB7XG5cdFJPVC5QYXRoLmNhbGwodGhpcywgdG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpO1xuXG5cdHRoaXMuX2NvbXB1dGVkID0ge307XG5cdHRoaXMuX3RvZG8gPSBbXTtcblx0dGhpcy5fYWRkKHRvWCwgdG9ZLCBudWxsKTtcbn07XG5ST1QuUGF0aC5EaWprc3RyYS5leHRlbmQoUk9ULlBhdGgpO1xuXG4vKipcbiAqIENvbXB1dGUgYSBwYXRoIGZyb20gYSBnaXZlbiBwb2ludFxuICogQHNlZSBST1QuUGF0aCNjb21wdXRlXG4gKi9cblJPVC5QYXRoLkRpamtzdHJhLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZLCBjYWxsYmFjaykge1xuXHR2YXIga2V5ID0gZnJvbVgrXCIsXCIrZnJvbVk7XG5cdGlmICghKGtleSBpbiB0aGlzLl9jb21wdXRlZCkpIHsgdGhpcy5fY29tcHV0ZShmcm9tWCwgZnJvbVkpOyB9XG5cdGlmICghKGtleSBpbiB0aGlzLl9jb21wdXRlZCkpIHsgcmV0dXJuOyB9XG5cdFxuXHR2YXIgaXRlbSA9IHRoaXMuX2NvbXB1dGVkW2tleV07XG5cdHdoaWxlIChpdGVtKSB7XG5cdFx0Y2FsbGJhY2soaXRlbS54LCBpdGVtLnkpO1xuXHRcdGl0ZW0gPSBpdGVtLnByZXY7XG5cdH1cbn07XG5cbi8qKlxuICogQ29tcHV0ZSBhIG5vbi1jYWNoZWQgdmFsdWVcbiAqL1xuUk9ULlBhdGguRGlqa3N0cmEucHJvdG90eXBlLl9jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZKSB7XG5cdHdoaWxlICh0aGlzLl90b2RvLmxlbmd0aCkge1xuXHRcdHZhciBpdGVtID0gdGhpcy5fdG9kby5zaGlmdCgpO1xuXHRcdGlmIChpdGVtLnggPT0gZnJvbVggJiYgaXRlbS55ID09IGZyb21ZKSB7IHJldHVybjsgfVxuXHRcdFxuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXROZWlnaGJvcnMoaXRlbS54LCBpdGVtLnkpO1xuXHRcdFxuXHRcdGZvciAodmFyIGk9MDtpPG5laWdoYm9ycy5sZW5ndGg7aSsrKSB7XG5cdFx0XHR2YXIgbmVpZ2hib3IgPSBuZWlnaGJvcnNbaV07XG5cdFx0XHR2YXIgeCA9IG5laWdoYm9yWzBdO1xuXHRcdFx0dmFyIHkgPSBuZWlnaGJvclsxXTtcblx0XHRcdHZhciBpZCA9IHgrXCIsXCIreTtcblx0XHRcdGlmIChpZCBpbiB0aGlzLl9jb21wdXRlZCkgeyBjb250aW51ZTsgfSAvKiBhbHJlYWR5IGRvbmUgKi9cdFxuXHRcdFx0dGhpcy5fYWRkKHgsIHksIGl0ZW0pOyBcblx0XHR9XG5cdH1cbn07XG5cblJPVC5QYXRoLkRpamtzdHJhLnByb3RvdHlwZS5fYWRkID0gZnVuY3Rpb24oeCwgeSwgcHJldikge1xuXHR2YXIgb2JqID0ge1xuXHRcdHg6IHgsXG5cdFx0eTogeSxcblx0XHRwcmV2OiBwcmV2XG5cdH07XG5cdHRoaXMuX2NvbXB1dGVkW3grXCIsXCIreV0gPSBvYmo7XG5cdHRoaXMuX3RvZG8ucHVzaChvYmopO1xufTtcbi8qKlxuICogQGNsYXNzIFNpbXBsaWZpZWQgQSogYWxnb3JpdGhtOiBhbGwgZWRnZXMgaGF2ZSBhIHZhbHVlIG9mIDFcbiAqIEBhdWdtZW50cyBST1QuUGF0aFxuICogQHNlZSBST1QuUGF0aFxuICovXG5ST1QuUGF0aC5BU3RhciA9IGZ1bmN0aW9uKHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zKSB7XG5cdFJPVC5QYXRoLmNhbGwodGhpcywgdG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpO1xuXG5cdHRoaXMuX3RvZG8gPSBbXTtcblx0dGhpcy5fZG9uZSA9IHt9O1xuXHR0aGlzLl9mcm9tWCA9IG51bGw7XG5cdHRoaXMuX2Zyb21ZID0gbnVsbDtcbn07XG5ST1QuUGF0aC5BU3Rhci5leHRlbmQoUk9ULlBhdGgpO1xuXG4vKipcbiAqIENvbXB1dGUgYSBwYXRoIGZyb20gYSBnaXZlbiBwb2ludFxuICogQHNlZSBST1QuUGF0aCNjb21wdXRlXG4gKi9cblJPVC5QYXRoLkFTdGFyLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZLCBjYWxsYmFjaykge1xuXHR0aGlzLl90b2RvID0gW107XG5cdHRoaXMuX2RvbmUgPSB7fTtcblx0dGhpcy5fZnJvbVggPSBmcm9tWDtcblx0dGhpcy5fZnJvbVkgPSBmcm9tWTtcblx0dGhpcy5fYWRkKHRoaXMuX3RvWCwgdGhpcy5fdG9ZLCBudWxsKTtcblxuXHR3aGlsZSAodGhpcy5fdG9kby5sZW5ndGgpIHtcblx0XHR2YXIgaXRlbSA9IHRoaXMuX3RvZG8uc2hpZnQoKTtcblx0XHRpZiAoaXRlbS54ID09IGZyb21YICYmIGl0ZW0ueSA9PSBmcm9tWSkgeyBicmVhazsgfVxuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXROZWlnaGJvcnMoaXRlbS54LCBpdGVtLnkpO1xuXG5cdFx0Zm9yICh2YXIgaT0wO2k8bmVpZ2hib3JzLmxlbmd0aDtpKyspIHtcblx0XHRcdHZhciBuZWlnaGJvciA9IG5laWdoYm9yc1tpXTtcblx0XHRcdHZhciB4ID0gbmVpZ2hib3JbMF07XG5cdFx0XHR2YXIgeSA9IG5laWdoYm9yWzFdO1xuXHRcdFx0dmFyIGlkID0geCtcIixcIit5O1xuXHRcdFx0aWYgKGlkIGluIHRoaXMuX2RvbmUpIHsgY29udGludWU7IH1cblx0XHRcdHRoaXMuX2FkZCh4LCB5LCBpdGVtKTsgXG5cdFx0fVxuXHR9XG5cdFxuXHR2YXIgaXRlbSA9IHRoaXMuX2RvbmVbZnJvbVgrXCIsXCIrZnJvbVldO1xuXHRpZiAoIWl0ZW0pIHsgcmV0dXJuOyB9XG5cdFxuXHR3aGlsZSAoaXRlbSkge1xuXHRcdGNhbGxiYWNrKGl0ZW0ueCwgaXRlbS55KTtcblx0XHRpdGVtID0gaXRlbS5wcmV2O1xuXHR9XG59O1xuXG5ST1QuUGF0aC5BU3Rhci5wcm90b3R5cGUuX2FkZCA9IGZ1bmN0aW9uKHgsIHksIHByZXYpIHtcblx0dmFyIGggPSB0aGlzLl9kaXN0YW5jZSh4LCB5KTtcblx0dmFyIG9iaiA9IHtcblx0XHR4OiB4LFxuXHRcdHk6IHksXG5cdFx0cHJldjogcHJldixcblx0XHRnOiAocHJldiA/IHByZXYuZysxIDogMCksXG5cdFx0aDogaFxuXHR9O1xuXHR0aGlzLl9kb25lW3grXCIsXCIreV0gPSBvYmo7XG5cdFxuXHQvKiBpbnNlcnQgaW50byBwcmlvcml0eSBxdWV1ZSAqL1xuXHRcblx0dmFyIGYgPSBvYmouZyArIG9iai5oO1xuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl90b2RvLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgaXRlbSA9IHRoaXMuX3RvZG9baV07XG5cdFx0dmFyIGl0ZW1GID0gaXRlbS5nICsgaXRlbS5oO1xuXHRcdGlmIChmIDwgaXRlbUYgfHwgKGYgPT0gaXRlbUYgJiYgaCA8IGl0ZW0uaCkpIHtcblx0XHRcdHRoaXMuX3RvZG8uc3BsaWNlKGksIDAsIG9iaik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cdFxuXHR0aGlzLl90b2RvLnB1c2gob2JqKTtcbn07XG5cblJPVC5QYXRoLkFTdGFyLnByb3RvdHlwZS5fZGlzdGFuY2UgPSBmdW5jdGlvbih4LCB5KSB7XG5cdHN3aXRjaCAodGhpcy5fb3B0aW9ucy50b3BvbG9neSkge1xuXHRcdGNhc2UgNDpcblx0XHRcdHJldHVybiAoTWF0aC5hYnMoeC10aGlzLl9mcm9tWCkgKyBNYXRoLmFicyh5LXRoaXMuX2Zyb21ZKSk7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIDY6XG5cdFx0XHR2YXIgZHggPSBNYXRoLmFicyh4IC0gdGhpcy5fZnJvbVgpO1xuXHRcdFx0dmFyIGR5ID0gTWF0aC5hYnMoeSAtIHRoaXMuX2Zyb21ZKTtcblx0XHRcdHJldHVybiBkeSArIE1hdGgubWF4KDAsIChkeC1keSkvMik7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIDg6IFxuXHRcdFx0cmV0dXJuIE1hdGgubWF4KE1hdGguYWJzKHgtdGhpcy5fZnJvbVgpLCBNYXRoLmFicyh5LXRoaXMuX2Zyb21ZKSk7XG5cdFx0YnJlYWs7XG5cdH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHRvcG9sb2d5XCIpO1xufTtcbiAgcmV0dXJuIFJPVDtcbn0pKTtcbiIsImltcG9ydCAqIGFzIFJPVCBmcm9tIFwiLi4vbGliL3JvdFwiXHJcblxyXG5pZihST1QuaXNTdXBwb3J0ZWQoKSl7XHJcblx0Y29uc29sZS5sb2coXCJST1QgaXMgbG9hZGVkLlwiKTtcclxufSJdfQ==
