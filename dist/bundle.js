(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Actor = function () {
	function Actor(name, x, y, glyph) {
		_classCallCheck(this, Actor);

		this.name = name;
		this.x = x;
		this.y = y;
		this.glyph = glyph;
		_game2.default.actors.push(this);
		_game2.default.scheduler.add(this, true);
	}

	_createClass(Actor, [{
		key: 'act',
		value: function act() {}
	}, {
		key: 'draw',
		value: function draw() {
			_game2.default.display.draw(this.x, this.y, this.glyph.chr, this.glyph.fg, this.glyph.bg);
		}
	}, {
		key: 'move',
		value: function move(x, y) {
			if (!_game2.default.map.inBounds(x, y)) {
				return 0;
			}
			var tileType = _game2.default.map.get(x, y).type;
			switch (tileType) {
				case 'wall':
					return 0;
					break;
				case 'sky':
					_game2.default.bus.dispatch('fall', this);
					return 1;
			}
			var collides = false;
			var other = null;
			_game2.default.actors.forEach(function (actor) {
				if (x == actor.x && y == actor.y) {
					collides = true;
					other = actor;
				}
			});
			if (collides) {
				//Push actor
				var dx = x - this.x;
				var dy = y - this.y;
				var mv = other.move(other.x + dx, other.y + dy);
				if (!mv) {
					return 0;
				}
			}
			//Capture current position
			var cx = this.x;
			var cy = this.y;
			//Set new position
			this.x = x;
			this.y = y;
			//Dispatch event for graphical change
			_game2.default.bus.dispatch('move', this, cx, cy);
			return 1;
		}
	}]);

	return Actor;
}();

exports.default = Actor;

},{"./game":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _actor = require('../actor');

var _actor2 = _interopRequireDefault(_actor);

var _rot = require('../../../vendor/rot');

var _rot2 = _interopRequireDefault(_rot);

var _game = require('./../game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = function (_Actor) {
	_inherits(Player, _Actor);

	function Player() {
		_classCallCheck(this, Player);

		return _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).apply(this, arguments));
	}

	_createClass(Player, [{
		key: 'act',
		value: function act() {
			_game2.default.engine.lock();
			window.addEventListener('keydown', this);
		}
	}, {
		key: 'handleEvent',
		value: function handleEvent(e) {
			var code = e.keyCode;
			var x = this.x;
			var y = this.y;
			switch (code) {
				case _rot2.default.VK_UP:
					_get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'move', this).call(this, x, y - 1);
					break;
				case _rot2.default.VK_RIGHT:
					_get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'move', this).call(this, x + 1, y);
					break;
				case _rot2.default.VK_DOWN:
					_get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'move', this).call(this, x, y + 1);
					break;
				case _rot2.default.VK_LEFT:
					_get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'move', this).call(this, x - 1, y);
					break;
			}
			window.removeEventListener('keydown', this);
			_game2.default.engine.unlock();
		}
	}]);

	return Player;
}(_actor2.default);

exports.default = Player;

},{"../../../vendor/rot":9,"../actor":1,"./../game":4}],3:[function(require,module,exports){
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

},{"../../vendor/rot":9,"./game":4,"./tile":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _rot = require('../../vendor/rot');

var _rot2 = _interopRequireDefault(_rot);

var _eventbus = require('../../vendor/eventbus.min');

var _eventbus2 = _interopRequireDefault(_eventbus);

var _map = require('./map.js');

var _map2 = _interopRequireDefault(_map);

var _tile = require('./tile.js');

var _actor = require('./actor');

var _actor2 = _interopRequireDefault(_actor);

var _player = require('./actors/player');

var _player2 = _interopRequireDefault(_player);

var _glyph = require('./glyph');

var _glyph2 = _interopRequireDefault(_glyph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var w = 50;
var h = 25;

var randInt = function randInt(a, b) {
	return a + Math.floor((b - a) * _rot2.default.RNG.getUniform());
};

exports.default = {
	display: null,
	map: null,
	bus: null,
	actors: [],
	player: null,
	scheduler: null,
	engine: null,

	init: function init() {
		var _this = this;

		this.display = new _rot2.default.Display({ width: w, height: h });
		document.body.appendChild(this.display.getContainer());

		this.map = new _map2.default(w, h);

		var generator = new _rot2.default.Map.Arena(w - 4, h - 4);
		generator.create(function (x, y, wall) {
			var WALL = _tile.TileTypes.WALL;
			var FLOOR = _tile.TileTypes.FLOOR;
			_this.map.set(x + 2, y + 2, new _tile.Tile(x + 2, y + 2, wall ? WALL : FLOOR));
		});
		//Generate holes in the floor
		var holes = 5;
		while (holes > 0) {
			var x = randInt(2, w - 2);
			var y = randInt(2, h - 2);
			this.map.set(x, y, new _tile.Tile(x, y, _tile.TileTypes.SKY));
			holes--;
		}
		this.map.draw();

		this.bus = _eventbus2.default;

		this.bus.addEventListener('move', function (e, x, y) {
			_this.map.reset(e, x, y);
			e.target.draw();
		}, this.map);

		this.bus.addEventListener('fall', function (e) {
			_this.map.reset(e, e.target.x, e.target.y);
			_this.scheduler.remove(e.target);
			_this.actors.splice(_this.actors.indexOf(e.target), 1);
		}, this.map);

		this.scheduler = new _rot2.default.Scheduler.Simple();
		this.engine = new _rot2.default.Engine(this.scheduler);

		this.player = new _player2.default('Player', 4, 4, new _glyph2.default('@', '#fff'));
		this.player.draw();

		var m = new _actor2.default('Monster', 8, 8, new _glyph2.default('m', '#f00'));
		m.draw();

		this.engine.start();
	}
};

},{"../../vendor/eventbus.min":8,"../../vendor/rot":9,"./actor":1,"./actors/player":2,"./glyph":5,"./map.js":6,"./tile.js":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Glyph = function Glyph(chr, fg, bg) {
	_classCallCheck(this, Glyph);

	this.chr = chr || ' ';
	this.fg = fg || null;
	this.bg = bg || null;
};

exports.default = Glyph;

},{"./game":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

var _tile = require('./tile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TileMap = function () {
	function TileMap(width, height) {
		_classCallCheck(this, TileMap);

		this.width = width;
		this.height = height;
		this.tiles = new Map();
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				this.tiles.set(x + ',' + y, new _tile.Tile(x, y, _tile.TileTypes.SKY));
			}
		}
	}

	_createClass(TileMap, [{
		key: 'set',
		value: function set(x, y, tile) {
			this.tiles.set(x + ',' + y, tile);
		}
	}, {
		key: 'get',
		value: function get(x, y) {
			return this.tiles.get(x + ',' + y);
		}
	}, {
		key: 'inBounds',
		value: function inBounds(x, y) {
			return x > 0 && x < this.width && y > 0 && y < this.height;
		}
	}, {
		key: 'draw',
		value: function draw() {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.tiles.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var tile = _step.value;

					tile.draw();
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: 'reset',
		value: function reset(e, x, y) {
			//Redraw Tile
			this.get(x, y).draw();
		}
	}]);

	return TileMap;
}();

exports.default = TileMap;

},{"./game":4,"./tile":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Tile = exports.TileTypes = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glyph = require('./glyph');

var _glyph2 = _interopRequireDefault(_glyph);

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TileTypes = exports.TileTypes = {
	WALL: {
		name: 'wall',
		glyph: new _glyph2.default('#')
	},
	FLOOR: {
		name: 'floor',
		glyph: new _glyph2.default('.')
	},
	SKY: {
		name: 'sky',
		glyph: new _glyph2.default(' ', '#fff', 'skyblue')
	}
};

var Tile = exports.Tile = function () {
	function Tile(x, y, type) {
		_classCallCheck(this, Tile);

		this.x = x;
		this.y = y;
		this.type = type.name;
		this._glyph = type.glyph;
	}

	_createClass(Tile, [{
		key: 'draw',
		value: function draw() {
			_game2.default.display.draw(this.x, this.y, this.glyph.chr, this.glyph.fg, this.glyph.bg);
		}
	}, {
		key: 'glyph',
		get: function get() {
			return this._glyph;
		},
		set: function set(glyph) {
			this._glyph = glyph;this.draw();
		}
	}]);

	return Tile;
}();

},{"./game":4,"./glyph":5}],8:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object") module.exports = factory();else if (typeof define === "function" && define.amd) define("EventBus", [], factory);else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") exports["EventBus"] = factory();else root["EventBus"] = factory();
})(undefined, function () {
  var EventBusClass = {};EventBusClass = function EventBusClass() {
    this.listeners = {};
  };EventBusClass.prototype = { addEventListener: function addEventListener(type, callback, scope) {
      var args = [];var numOfArgs = arguments.length;for (var i = 0; i < numOfArgs; i++) {
        args.push(arguments[i]);
      }args = args.length > 3 ? args.splice(3, args.length - 1) : [];if (typeof this.listeners[type] != "undefined") {
        this.listeners[type].push({ scope: scope, callback: callback, args: args });
      } else {
        this.listeners[type] = [{ scope: scope, callback: callback, args: args }];
      }
    }, removeEventListener: function removeEventListener(type, callback, scope) {
      if (typeof this.listeners[type] != "undefined") {
        var numOfCallbacks = this.listeners[type].length;var newArray = [];for (var i = 0; i < numOfCallbacks; i++) {
          var listener = this.listeners[type][i];if (listener.scope == scope && listener.callback == callback) {} else {
            newArray.push(listener);
          }
        }this.listeners[type] = newArray;
      }
    }, hasEventListener: function hasEventListener(type, callback, scope) {
      if (typeof this.listeners[type] != "undefined") {
        var numOfCallbacks = this.listeners[type].length;if (callback === undefined && scope === undefined) {
          return numOfCallbacks > 0;
        }for (var i = 0; i < numOfCallbacks; i++) {
          var listener = this.listeners[type][i];if ((scope ? listener.scope == scope : true) && listener.callback == callback) {
            return true;
          }
        }
      }return false;
    }, dispatch: function dispatch(type, target) {
      var event = { type: type, target: target };var args = [];var numOfArgs = arguments.length;for (var i = 0; i < numOfArgs; i++) {
        args.push(arguments[i]);
      }args = args.length > 2 ? args.splice(2, args.length - 1) : [];args = [event].concat(args);if (typeof this.listeners[type] != "undefined") {
        var listeners = this.listeners[type].slice();var numOfCallbacks = listeners.length;for (var i = 0; i < numOfCallbacks; i++) {
          var listener = listeners[i];if (listener && listener.callback) {
            var concatArgs = args.concat(listener.args);listener.callback.apply(listener.scope, concatArgs);
          }
        }
      }
    }, getEvents: function getEvents() {
      var str = "";for (var type in this.listeners) {
        var numOfCallbacks = this.listeners[type].length;for (var i = 0; i < numOfCallbacks; i++) {
          var listener = this.listeners[type][i];str += listener.scope && listener.scope.className ? listener.scope.className : "anonymous";str += " listen for '" + type + "'\n";
        }
      }return str;
    } };var EventBus = new EventBusClass();return EventBus;
});

},{}],9:[function(require,module,exports){
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

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxhY3Rvci5qcyIsImFzc2V0c1xcanNcXGFjdG9yc1xccGxheWVyLmpzIiwiYXNzZXRzXFxqc1xcYXBwLmpzIiwiYXNzZXRzXFxqc1xcZ2FtZS5qcyIsImFzc2V0c1xcanNcXGdseXBoLmpzIiwiYXNzZXRzXFxqc1xcbWFwLmpzIiwiYXNzZXRzXFxqc1xcdGlsZS5qcyIsInZlbmRvclxcZXZlbnRidXMubWluLmpzIiwidmVuZG9yXFxyb3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztJQUVxQixLO0FBQ3BCLGdCQUFZLElBQVosRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsS0FBeEIsRUFBOEI7QUFBQTs7QUFDN0IsT0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLE9BQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxPQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLElBQWpCO0FBQ0EsaUJBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsSUFBbkIsRUFBd0IsSUFBeEI7QUFDQTs7Ozt3QkFDSSxDQUFFOzs7eUJBQ0Q7QUFDTCxrQkFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFLLENBQXZCLEVBQTBCLEtBQUssQ0FBL0IsRUFBa0MsS0FBSyxLQUFMLENBQVcsR0FBN0MsRUFBa0QsS0FBSyxLQUFMLENBQVcsRUFBN0QsRUFBaUUsS0FBSyxLQUFMLENBQVcsRUFBNUU7QUFDQTs7O3VCQUNJLEMsRUFBRyxDLEVBQUU7QUFDVCxPQUFHLENBQUMsZUFBSyxHQUFMLENBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQixDQUFyQixDQUFKLEVBQTRCO0FBQzNCLFdBQU8sQ0FBUDtBQUNBO0FBQ0QsT0FBSSxXQUFXLGVBQUssR0FBTCxDQUFTLEdB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SUFBSSxLQUFKLENBQVUsa0JBQVYsQ0FBTjtBQUNQLEVBbEJEO0FBbUJFLFFBQU8sR0FBUDtBQUNELENBM3RLQSxDQUFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3RvciB7XHJcblx0Y29uc3RydWN0b3IobmFtZSwgeCwgeSwgZ2x5cGgpe1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy5nbHlwaCA9IGdseXBoO1xyXG5cdFx0R2FtZS5hY3RvcnMucHVzaCh0aGlzKTtcclxuXHRcdEdhbWUuc2NoZWR1bGVyLmFkZCh0aGlzLHRydWUpO1xyXG5cdH1cclxuXHRhY3QoKXt9XHJcblx0ZHJhdygpe1xyXG5cdFx0R2FtZS5kaXNwbGF5LmRyYXcodGhpcy54LCB0aGlzLnksIHRoaXMuZ2x5cGguY2hyLCB0aGlzLmdseXBoLmZnLCB0aGlzLmdseXBoLmJnKTtcclxuXHR9XHJcblx0bW92ZSh4LCB5KXtcclxuXHRcdGlmKCFHYW1lLm1hcC5pbkJvdW5kcyh4LCB5KSl7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHRpbGVUeXBlID0gR2FtZS5tYXAuZ2V0KHgsIHkpLnR5cGU7XHJcblx0XHRzd2l0Y2godGlsZVR5cGUpe1xyXG5cdFx0XHRjYXNlICd3YWxsJzpcclxuXHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnc2t5JzpcclxuXHRcdFx0XHRHYW1lLmJ1cy5kaXNwYXRjaCgnZmFsbCcsdGhpcyk7XHJcblx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRsZXQgY29sbGlkZXMgPSBmYWxzZTtcclxuXHRcdGxldCBvdGhlciA9IG51bGw7XHJcblx0XHRHYW1lLmFjdG9ycy5mb3JFYWNoKChhY3Rvcik9PntcclxuXHRcdFx0aWYoeD09YWN0b3IueCAmJiB5PT1hY3Rvci55KXtcclxuXHRcdFx0XHRjb2xsaWRlcyA9IHRydWU7XHJcblx0XHRcdFx0b3RoZXIgPSBhY3RvcjtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRpZihjb2xsaWRlcyl7XHJcblx0XHRcdC8vUHVzaCBhY3RvclxyXG5cdFx0XHRsZXQgZHggPSB4IC0gdGhpcy54O1xyXG5cdFx0XHRsZXQgZHkgPSB5IC0gdGhpcy55O1xyXG5cdFx0XHRsZXQgbXYgPSBvdGhlci5tb3ZlKG90aGVyLngrZHgsb3RoZXIueStkeSk7XHJcblx0XHRcdGlmKCFtdil7XHJcblx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vQ2FwdHVyZSBjdXJyZW50IHBvc2l0aW9uXHJcblx0XHRsZXQgY3ggPSB0aGlzLng7XHJcblx0XHRsZXQgY3kgPSB0aGlzLnk7XHJcblx0XHQvL1NldCBuZXcgcG9zaXRpb25cclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0Ly9EaXNwYXRjaCBldmVudCBmb3IgZ3JhcGhpY2FsIGNoYW5nZVxyXG5cdFx0R2FtZS5idXMuZGlzcGF0Y2goJ21vdmUnLCB0aGlzLCBjeCwgY3kpO1xyXG5cdFx0cmV0dXJuIDE7XHJcblx0fVxyXG59IiwiaW1wb3J0IEFjdG9yIGZyb20gJy4uL2FjdG9yJztcclxuaW1wb3J0IFJPVCBmcm9tICcuLi8uLi8uLi92ZW5kb3Ivcm90JztcclxuaW1wb3J0IEdhbWUgZnJvbSAnLi8uLi9nYW1lJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciBleHRlbmRzIEFjdG9ye1xyXG5cdGFjdCgpe1xyXG5cdFx0R2FtZS5lbmdpbmUubG9jaygpO1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLHRoaXMpO1xyXG5cdH1cclxuXHRoYW5kbGVFdmVudChlKXtcclxuXHRcdGxldCBjb2RlID0gZS5rZXlDb2RlO1xyXG5cdFx0bGV0IHggPSB0aGlzLng7XHJcblx0XHRsZXQgeSA9IHRoaXMueTtcclxuXHRcdHN3aXRjaChjb2RlKXtcclxuXHRcdFx0Y2FzZSBST1QuVktfVVA6XHJcblx0XHRcdFx0c3VwZXIubW92ZSh4LHktMSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgUk9ULlZLX1JJR0hUOlxyXG5cdFx0XHRcdHN1cGVyLm1vdmUoeCsxLHkpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFJPVC5WS19ET1dOOlxyXG5cdFx0XHRcdHN1cGVyLm1vdmUoeCx5KzEpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFJPVC5WS19MRUZUOlxyXG5cdFx0XHRcdHN1cGVyLm1vdmUoeC0xLHkpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLHRoaXMpO1xyXG5cdFx0R2FtZS5lbmdpbmUudW5sb2NrKCk7XHJcblx0fVxyXG59IiwiaW1wb3J0IFJPVCBmcm9tIFwiLi4vLi4vdmVuZG9yL3JvdFwiXHJcbmltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSdcclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gJy4vdGlsZSc7XHJcblxyXG5pZighUk9ULmlzU3VwcG9ydGVkKCkpe1xyXG5cdGFsZXJ0KFwiVGhlIHJvdC5qcyBsaWJyYXJ5IGlzbid0IHN1cHBvcnRlZCBieSB5b3VyIGJyb3dzZXIuXCIpO1xyXG59XHJcbmVsc2V7XHJcblx0R2FtZS5pbml0KCk7XHJcbn0iLCJpbXBvcnQgUk9UIGZyb20gJy4uLy4uL3ZlbmRvci9yb3QnO1xyXG5pbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi4vLi4vdmVuZG9yL2V2ZW50YnVzLm1pbic7XHJcblxyXG5pbXBvcnQgVGlsZU1hcCBmcm9tICcuL21hcC5qcyc7XHJcbmltcG9ydCB7IFRpbGUsIFRpbGVUeXBlcyB9IGZyb20gJy4vdGlsZS5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL2FjdG9ycy9wbGF5ZXInO1xyXG5pbXBvcnQgR2x5cGggZnJvbSAnLi9nbHlwaCc7XHJcblxyXG5jb25zdCB3ID0gNTA7XHJcbmNvbnN0IGggPSAyNTtcclxuXHJcbnZhciByYW5kSW50ID0gZnVuY3Rpb24oYSwgYil7XHJcblx0cmV0dXJuIGEgKyBNYXRoLmZsb29yKChiLWEpICogUk9ULlJORy5nZXRVbmlmb3JtKCkpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0ZGlzcGxheTogbnVsbCxcclxuXHRtYXA6IG51bGwsXHJcblx0YnVzOiBudWxsLFxyXG5cdGFjdG9yczogW10sXHJcblx0cGxheWVyOiBudWxsLFxyXG5cdHNjaGVkdWxlcjogbnVsbCxcclxuXHRlbmdpbmU6IG51bGwsXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuZGlzcGxheSA9IG5ldyBST1QuRGlzcGxheSh7d2lkdGg6IHcsIGhlaWdodDogaH0pO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRpc3BsYXkuZ2V0Q29udGFpbmVyKCkpO1xyXG5cdFx0XHJcblx0XHR0aGlzLm1hcCA9IG5ldyBUaWxlTWFwKHcsIGgpO1xyXG5cdFx0XHJcblx0XHRsZXQgZ2VuZXJhdG9yID0gbmV3IFJPVC5NYXAuQXJlbmEody00LGgtNCk7XHJcblx0XHRnZW5lcmF0b3IuY3JlYXRlKCh4LCB5LCB3YWxsKT0+e1xyXG5cdFx0XHRsZXQgV0FMTCA9IFRpbGVUeXBlcy5XQUxMO1xyXG5cdFx0XHRsZXQgRkxPT1IgPSBUaWxlVHlwZXMuRkxPT1I7XHJcblx0XHRcdHRoaXMubWFwLnNldCh4KzIsIHkrMiwgbmV3IFRpbGUoeCsyLCB5KzIsIHdhbGwgPyBXQUxMOiBGTE9PUikpO1xyXG5cdFx0fSk7XHJcblx0XHQvL0dlbmVyYXRlIGhvbGVzIGluIHRoZSBmbG9vclxyXG5cdFx0bGV0IGhvbGVzID0gNTtcclxuXHRcdHdoaWxlKGhvbGVzID4gMCl7XHJcblx0XHRcdGxldCB4ID0gcmFuZEludCgyLCB3LTIpO1xyXG5cdFx0XHRsZXQgeSA9IHJhbmRJbnQoMiwgaC0yKTtcclxuXHRcdFx0dGhpcy5tYXAuc2V0KHgsIHksIG5ldyBUaWxlKHgsIHksIFRpbGVUeXBlcy5TS1kpKTtcclxuXHRcdFx0aG9sZXMtLTtcclxuXHRcdH1cclxuXHRcdHRoaXMubWFwLmRyYXcoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5idXMgPSBFdmVudEJ1cztcclxuXHRcdFxyXG5cdFx0dGhpcy5idXMuYWRkRXZlbnRMaXN0ZW5lcignbW92ZScsKGUsIHgsIHkpPT57XHJcblx0XHRcdHRoaXMubWFwLnJlc2V0KGUsIHgsIHkpO1xyXG5cdFx0XHRlLnRhcmdldC5kcmF3KCk7XHJcblx0XHR9LHRoaXMubWFwKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5idXMuYWRkRXZlbnRMaXN0ZW5lcignZmFsbCcsKGUpPT57XHJcblx0XHRcdHRoaXMubWFwLnJlc2V0KGUsZS50YXJnZXQueCxlLnRhcmdldC55KTtcclxuXHRcdFx0dGhpcy5zY2hlZHVsZXIucmVtb3ZlKGUudGFyZ2V0KTtcclxuXHRcdFx0dGhpcy5hY3RvcnMuc3BsaWNlKHRoaXMuYWN0b3JzLmluZGV4T2YoZS50YXJnZXQpLDEpO1xyXG5cdFx0fSx0aGlzLm1hcCk7XHJcblx0XHRcclxuXHRcdHRoaXMuc2NoZWR1bGVyID0gbmV3IFJPVC5TY2hlZHVsZXIuU2ltcGxlKCk7XHJcblx0XHR0aGlzLmVuZ2luZSA9IG5ldyBST1QuRW5naW5lKHRoaXMuc2NoZWR1bGVyKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKCdQbGF5ZXInLDQsNCxuZXcgR2x5cGgoJ0AnLCcjZmZmJykpO1xyXG5cdFx0dGhpcy5wbGF5ZXIuZHJhdygpO1xyXG5cdFx0XHJcblx0XHRsZXQgbSA9IG5ldyBBY3RvcignTW9uc3RlcicsOCw4LG5ldyBHbHlwaCgnbScsJyNmMDAnKSk7XHJcblx0XHRtLmRyYXcoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5lbmdpbmUuc3RhcnQoKTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgR2FtZSBmcm9tICcuL2dhbWUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2x5cGgge1xyXG5cdGNvbnN0cnVjdG9yKGNociwgZmcsIGJnKXtcclxuXHRcdHRoaXMuY2hyID0gY2hyIHx8ICcgJztcclxuXHRcdHRoaXMuZmcgPSBmZyB8fCBudWxsO1xyXG5cdFx0dGhpcy5iZyA9IGJnIHx8IG51bGw7XHJcblx0fVxyXG59IiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJztcclxuaW1wb3J0IHsgVGlsZSwgVGlsZVR5cGVzIH0gZnJvbSAnLi90aWxlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbGVNYXAge1xyXG5cdGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpe1xyXG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xyXG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblx0XHR0aGlzLnRpbGVzID0gbmV3IE1hcCgpO1xyXG5cdFx0Zm9yKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4Kyspe1xyXG5cdFx0XHRmb3IobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5Kyspe1xyXG5cdFx0XHRcdHRoaXMudGlsZXMuc2V0KHgrJywnK3ksbmV3IFRpbGUoeCwgeSwgVGlsZVR5cGVzLlNLWSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdHNldCh4LCB5LCB0aWxlKXtcclxuXHRcdHRoaXMudGlsZXMuc2V0KHgrJywnK3ksdGlsZSk7XHJcblx0fVxyXG5cdGdldCh4LCB5KXtcclxuXHRcdHJldHVybiB0aGlzLnRpbGVzLmdldCh4KycsJyt5KTtcclxuXHR9XHJcblx0aW5Cb3VuZHMoeCwgeSl7XHJcblx0XHRyZXR1cm4geCA+IDAgJiYgeCA8IHRoaXMud2lkdGggJiYgeT4gMCAmJiB5IDwgdGhpcy5oZWlnaHQ7XHJcblx0fVxyXG5cdGRyYXcoKXtcclxuXHRcdGZvcih2YXIgdGlsZSBvZiB0aGlzLnRpbGVzLnZhbHVlcygpKXtcclxuXHRcdFx0dGlsZS5kcmF3KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJlc2V0KGUsIHgsIHkpe1xyXG5cdFx0Ly9SZWRyYXcgVGlsZVxyXG5cdFx0dGhpcy5nZXQoeCwgeSkuZHJhdygpO1xyXG5cdH1cclxufSIsImltcG9ydCBHbHlwaCBmcm9tICcuL2dseXBoJztcclxuaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJztcclxuXHJcbmV4cG9ydCBsZXQgVGlsZVR5cGVzID0ge1xyXG5cdFdBTEw6IHtcclxuXHRcdG5hbWU6ICd3YWxsJyxcclxuXHRcdGdseXBoOiBuZXcgR2x5cGgoJyMnKVxyXG5cdH0sXHJcblx0RkxPT1I6IHtcclxuXHRcdG5hbWU6ICdmbG9vcicsXHJcblx0XHRnbHlwaDogbmV3IEdseXBoKCcuJylcclxuXHR9LFxyXG5cdFNLWToge1xyXG5cdFx0bmFtZTogJ3NreScsXHJcblx0XHRnbHlwaDogbmV3IEdseXBoKCcgJywnI2ZmZicsJ3NreWJsdWUnKVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRpbGUge1xyXG5cdGNvbnN0cnVjdG9yKHgsIHksIHR5cGUpe1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnR5cGUgPSB0eXBlLm5hbWU7XHJcblx0XHR0aGlzLl9nbHlwaCA9IHR5cGUuZ2x5cGg7XHJcblx0fVxyXG5cdGdldCBnbHlwaCgpeyByZXR1cm4gdGhpcy5fZ2x5cGg7IH1cclxuXHRzZXQgZ2x5cGgoZ2x5cGgpIHsgdGhpcy5fZ2x5cGggPSBnbHlwaDsgdGhpcy5kcmF3KCk7IH1cclxuXHRkcmF3KCl7XHJcblx0XHRHYW1lLmRpc3BsYXkuZHJhdyh0aGlzLngsIHRoaXMueSwgdGhpcy5nbHlwaC5jaHIsIHRoaXMuZ2x5cGguZmcsIHRoaXMuZ2x5cGguYmcpO1xyXG5cdH1cclxufSIsIihmdW5jdGlvbihyb290LGZhY3Rvcnkpe2lmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZT09PVwib2JqZWN0XCIpbW9kdWxlLmV4cG9ydHM9ZmFjdG9yeSgpO2Vsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZClkZWZpbmUoXCJFdmVudEJ1c1wiLFtdLGZhY3RvcnkpO2Vsc2UgaWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiKWV4cG9ydHNbXCJFdmVudEJ1c1wiXT1mYWN0b3J5KCk7ZWxzZSByb290W1wiRXZlbnRCdXNcIl09ZmFjdG9yeSgpfSkodGhpcyxmdW5jdGlvbigpe3ZhciBFdmVudEJ1c0NsYXNzPXt9O0V2ZW50QnVzQ2xhc3M9ZnVuY3Rpb24oKXt0aGlzLmxpc3RlbmVycz17fX07RXZlbnRCdXNDbGFzcy5wcm90b3R5cGU9e2FkZEV2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSxjYWxsYmFjayxzY29wZSl7dmFyIGFyZ3M9W107dmFyIG51bU9mQXJncz1hcmd1bWVudHMubGVuZ3RoO2Zvcih2YXIgaT0wO2k8bnVtT2ZBcmdzO2krKyl7YXJncy5wdXNoKGFyZ3VtZW50c1tpXSl9YXJncz1hcmdzLmxlbmd0aD4zP2FyZ3Muc3BsaWNlKDMsYXJncy5sZW5ndGgtMSk6W107aWYodHlwZW9mIHRoaXMubGlzdGVuZXJzW3R5cGVdIT1cInVuZGVmaW5lZFwiKXt0aGlzLmxpc3RlbmVyc1t0eXBlXS5wdXNoKHtzY29wZTpzY29wZSxjYWxsYmFjazpjYWxsYmFjayxhcmdzOmFyZ3N9KX1lbHNle3RoaXMubGlzdGVuZXJzW3R5cGVdPVt7c2NvcGU6c2NvcGUsY2FsbGJhY2s6Y2FsbGJhY2ssYXJnczphcmdzfV19fSxyZW1vdmVFdmVudExpc3RlbmVyOmZ1bmN0aW9uKHR5cGUsY2FsbGJhY2ssc2NvcGUpe2lmKHR5cGVvZiB0aGlzLmxpc3RlbmVyc1t0eXBlXSE9XCJ1bmRlZmluZWRcIil7dmFyIG51bU9mQ2FsbGJhY2tzPXRoaXMubGlzdGVuZXJzW3R5cGVdLmxlbmd0aDt2YXIgbmV3QXJyYXk9W107Zm9yKHZhciBpPTA7aTxudW1PZkNhbGxiYWNrcztpKyspe3ZhciBsaXN0ZW5lcj10aGlzLmxpc3RlbmVyc1t0eXBlXVtpXTtpZihsaXN0ZW5lci5zY29wZT09c2NvcGUmJmxpc3RlbmVyLmNhbGxiYWNrPT1jYWxsYmFjayl7fWVsc2V7bmV3QXJyYXkucHVzaChsaXN0ZW5lcil9fXRoaXMubGlzdGVuZXJzW3R5cGVdPW5ld0FycmF5fX0saGFzRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlLGNhbGxiYWNrLHNjb3BlKXtpZih0eXBlb2YgdGhpcy5saXN0ZW5lcnNbdHlwZV0hPVwidW5kZWZpbmVkXCIpe3ZhciBudW1PZkNhbGxiYWNrcz10aGlzLmxpc3RlbmVyc1t0eXBlXS5sZW5ndGg7aWYoY2FsbGJhY2s9PT11bmRlZmluZWQmJnNjb3BlPT09dW5kZWZpbmVkKXtyZXR1cm4gbnVtT2ZDYWxsYmFja3M+MH1mb3IodmFyIGk9MDtpPG51bU9mQ2FsbGJhY2tzO2krKyl7dmFyIGxpc3RlbmVyPXRoaXMubGlzdGVuZXJzW3R5cGVdW2ldO2lmKChzY29wZT9saXN0ZW5lci5zY29wZT09c2NvcGU6dHJ1ZSkmJmxpc3RlbmVyLmNhbGxiYWNrPT1jYWxsYmFjayl7cmV0dXJuIHRydWV9fX1yZXR1cm4gZmFsc2V9LGRpc3BhdGNoOmZ1bmN0aW9uKHR5cGUsdGFyZ2V0KXt2YXIgZXZlbnQ9e3R5cGU6dHlwZSx0YXJnZXQ6dGFyZ2V0fTt2YXIgYXJncz1bXTt2YXIgbnVtT2ZBcmdzPWFyZ3VtZW50cy5sZW5ndGg7Zm9yKHZhciBpPTA7aTxudW1PZkFyZ3M7aSsrKXthcmdzLnB1c2goYXJndW1lbnRzW2ldKX1hcmdzPWFyZ3MubGVuZ3RoPjI/YXJncy5zcGxpY2UoMixhcmdzLmxlbmd0aC0xKTpbXTthcmdzPVtldmVudF0uY29uY2F0KGFyZ3MpO2lmKHR5cGVvZiB0aGlzLmxpc3RlbmVyc1t0eXBlXSE9XCJ1bmRlZmluZWRcIil7dmFyIGxpc3RlbmVycz10aGlzLmxpc3RlbmVyc1t0eXBlXS5zbGljZSgpO3ZhciBudW1PZkNhbGxiYWNrcz1saXN0ZW5lcnMubGVuZ3RoO2Zvcih2YXIgaT0wO2k8bnVtT2ZDYWxsYmFja3M7aSsrKXt2YXIgbGlzdGVuZXI9bGlzdGVuZXJzW2ldO2lmKGxpc3RlbmVyJiZsaXN0ZW5lci5jYWxsYmFjayl7dmFyIGNvbmNhdEFyZ3M9YXJncy5jb25jYXQobGlzdGVuZXIuYXJncyk7bGlzdGVuZXIuY2FsbGJhY2suYXBwbHkobGlzdGVuZXIuc2NvcGUsY29uY2F0QXJncyl9fX19LGdldEV2ZW50czpmdW5jdGlvbigpe3ZhciBzdHI9XCJcIjtmb3IodmFyIHR5cGUgaW4gdGhpcy5saXN0ZW5lcnMpe3ZhciBudW1PZkNhbGxiYWNrcz10aGlzLmxpc3RlbmVyc1t0eXBlXS5sZW5ndGg7Zm9yKHZhciBpPTA7aTxudW1PZkNhbGxiYWNrcztpKyspe3ZhciBsaXN0ZW5lcj10aGlzLmxpc3RlbmVyc1t0eXBlXVtpXTtzdHIrPWxpc3RlbmVyLnNjb3BlJiZsaXN0ZW5lci5zY29wZS5jbGFzc05hbWU/bGlzdGVuZXIuc2NvcGUuY2xhc3NOYW1lOlwiYW5vbnltb3VzXCI7c3RyKz1cIiBsaXN0ZW4gZm9yICdcIit0eXBlK1wiJ1xcblwifX1yZXR1cm4gc3RyfX07dmFyIEV2ZW50QnVzPW5ldyBFdmVudEJ1c0NsYXNzO3JldHVybiBFdmVudEJ1c30pOyIsIi8qXHJcblx0VGhpcyBpcyByb3QuanMsIHRoZSBST2d1ZWxpa2UgVG9vbGtpdCBpbiBKYXZhU2NyaXB0LlxyXG5cdFZlcnNpb24gMC43fmRldiwgZ2VuZXJhdGVkIG9uIFRodSAyNCBOb3YgMjAxNiAwODowNzozOSBNU1QuXHJcbiovXHJcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgICAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcclxuICAgICAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcclxuICAgICAgICAvLyBsaWtlIE5vZGUuXHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXHJcbiAgICAgICAgcm9vdC5ST1QgPSBmYWN0b3J5KCk7XHJcbiAgICB9XHJcbn0odGhpcywgZnVuY3Rpb24oKSB7XHJcbi8qKlxyXG4gKiBAbmFtZXNwYWNlIFRvcC1sZXZlbCBST1QgbmFtZXNwYWNlXHJcbiAqL1xyXG52YXIgUk9UID0ge1xyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm5zIHtib29sfSBJcyByb3QuanMgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3Nlcj9cclxuXHQgKi9cclxuXHRpc1N1cHBvcnRlZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gISEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKS5nZXRDb250ZXh0ICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKTtcclxuXHR9LFxyXG5cclxuXHQvKiogRGVmYXVsdCB3aXRoIGZvciBkaXNwbGF5IGFuZCBtYXAgZ2VuZXJhdG9ycyAqL1xyXG5cdERFRkFVTFRfV0lEVEg6IDgwLFxyXG5cdC8qKiBEZWZhdWx0IGhlaWdodCBmb3IgZGlzcGxheSBhbmQgbWFwIGdlbmVyYXRvcnMgKi9cclxuXHRERUZBVUxUX0hFSUdIVDogMjUsXHJcblxyXG5cdC8qKiBEaXJlY3Rpb25hbCBjb25zdGFudHMuIE9yZGVyaW5nIGlzIGltcG9ydGFudCEgKi9cclxuXHRESVJTOiB7XHJcblx0XHRcIjRcIjogW1xyXG5cdFx0XHRbIDAsIC0xXSxcclxuXHRcdFx0WyAxLCAgMF0sXHJcblx0XHRcdFsgMCwgIDFdLFxyXG5cdFx0XHRbLTEsICAwXVxyXG5cdFx0XSxcclxuXHRcdFwiOFwiOiBbXHJcblx0XHRcdFsgMCwgLTFdLFxyXG5cdFx0XHRbIDEsIC0xXSxcclxuXHRcdFx0WyAxLCAgMF0sXHJcblx0XHRcdFsgMSwgIDFdLFxyXG5cdFx0XHRbIDAsICAxXSxcclxuXHRcdFx0Wy0xLCAgMV0sXHJcblx0XHRcdFstMSwgIDBdLFxyXG5cdFx0XHRbLTEsIC0xXVxyXG5cdFx0XSxcclxuXHRcdFwiNlwiOiBbXHJcblx0XHRcdFstMSwgLTFdLFxyXG5cdFx0XHRbIDEsIC0xXSxcclxuXHRcdFx0WyAyLCAgMF0sXHJcblx0XHRcdFsgMSwgIDFdLFxyXG5cdFx0XHRbLTEsICAxXSxcclxuXHRcdFx0Wy0yLCAgMF1cclxuXHRcdF1cclxuXHR9LFxyXG5cclxuXHQvKiogQ2FuY2VsIGtleS4gKi9cclxuXHRWS19DQU5DRUw6IDMsIFxyXG5cdC8qKiBIZWxwIGtleS4gKi9cclxuXHRWS19IRUxQOiA2LCBcclxuXHQvKiogQmFja3NwYWNlIGtleS4gKi9cclxuXHRWS19CQUNLX1NQQUNFOiA4LCBcclxuXHQvKiogVGFiIGtleS4gKi9cclxuXHRWS19UQUI6IDksIFxyXG5cdC8qKiA1IGtleSBvbiBOdW1wYWQgd2hlbiBOdW1Mb2NrIGlzIHVubG9ja2VkLiBPciBvbiBNYWMsIGNsZWFyIGtleSB3aGljaCBpcyBwb3NpdGlvbmVkIGF0IE51bUxvY2sga2V5LiAqL1xyXG5cdFZLX0NMRUFSOiAxMiwgXHJcblx0LyoqIFJldHVybi9lbnRlciBrZXkgb24gdGhlIG1haW4ga2V5Ym9hcmQuICovXHJcblx0VktfUkVUVVJOOiAxMywgXHJcblx0LyoqIFJlc2VydmVkLCBidXQgbm90IHVzZWQuICovXHJcblx0VktfRU5URVI6IDE0LCBcclxuXHQvKiogU2hpZnQga2V5LiAqL1xyXG5cdFZLX1NISUZUOiAxNiwgXHJcblx0LyoqIENvbnRyb2wga2V5LiAqL1xyXG5cdFZLX0NPTlRST0w6IDE3LCBcclxuXHQvKiogQWx0IChPcHRpb24gb24gTWFjKSBrZXkuICovXHJcblx0VktfQUxUOiAxOCwgXHJcblx0LyoqIFBhdXNlIGtleS4gKi9cclxuXHRWS19QQVVTRTogMTksIFxyXG5cdC8qKiBDYXBzIGxvY2suICovXHJcblx0VktfQ0FQU19MT0NLOiAyMCwgXHJcblx0LyoqIEVzY2FwZSBrZXkuICovXHJcblx0VktfRVNDQVBFOiAyNywgXHJcblx0LyoqIFNwYWNlIGJhci4gKi9cclxuXHRWS19TUEFDRTogMzIsIFxyXG5cdC8qKiBQYWdlIFVwIGtleS4gKi9cclxuXHRWS19QQUdFX1VQOiAzMywgXHJcblx0LyoqIFBhZ2UgRG93biBrZXkuICovXHJcblx0VktfUEFHRV9ET1dOOiAzNCwgXHJcblx0LyoqIEVuZCBrZXkuICovXHJcblx0VktfRU5EOiAzNSwgXHJcblx0LyoqIEhvbWUga2V5LiAqL1xyXG5cdFZLX0hPTUU6IDM2LCBcclxuXHQvKiogTGVmdCBhcnJvdy4gKi9cclxuXHRWS19MRUZUOiAzNywgXHJcblx0LyoqIFVwIGFycm93LiAqL1xyXG5cdFZLX1VQOiAzOCwgXHJcblx0LyoqIFJpZ2h0IGFycm93LiAqL1xyXG5cdFZLX1JJR0hUOiAzOSwgXHJcblx0LyoqIERvd24gYXJyb3cuICovXHJcblx0VktfRE9XTjogNDAsIFxyXG5cdC8qKiBQcmludCBTY3JlZW4ga2V5LiAqL1xyXG5cdFZLX1BSSU5UU0NSRUVOOiA0NCwgXHJcblx0LyoqIElucyhlcnQpIGtleS4gKi9cclxuXHRWS19JTlNFUlQ6IDQ1LCBcclxuXHQvKiogRGVsKGV0ZSkga2V5LiAqL1xyXG5cdFZLX0RFTEVURTogNDYsIFxyXG5cdC8qKiovXHJcblx0VktfMDogNDgsXHJcblx0LyoqKi9cclxuXHRWS18xOiA0OSxcclxuXHQvKioqL1xyXG5cdFZLXzI6IDUwLFxyXG5cdC8qKiovXHJcblx0VktfMzogNTEsXHJcblx0LyoqKi9cclxuXHRWS180OiA1MixcclxuXHQvKioqL1xyXG5cdFZLXzU6IDUzLFxyXG5cdC8qKiovXHJcblx0VktfNjogNTQsXHJcblx0LyoqKi9cclxuXHRWS183OiA1NSxcclxuXHQvKioqL1xyXG5cdFZLXzg6IDU2LFxyXG5cdC8qKiovXHJcblx0VktfOTogNTcsXHJcblx0LyoqIENvbG9uICg6KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19DT0xPTjogNTgsIFxyXG5cdC8qKiBTZW1pY29sb24gKDspIGtleS4gKi9cclxuXHRWS19TRU1JQ09MT046IDU5LCBcclxuXHQvKiogTGVzcy10aGFuICg8KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19MRVNTX1RIQU46IDYwLCBcclxuXHQvKiogRXF1YWxzICg9KSBrZXkuICovXHJcblx0VktfRVFVQUxTOiA2MSwgXHJcblx0LyoqIEdyZWF0ZXItdGhhbiAoPikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfR1JFQVRFUl9USEFOOiA2MiwgXHJcblx0LyoqIFF1ZXN0aW9uIG1hcmsgKD8pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1FVRVNUSU9OX01BUks6IDYzLCBcclxuXHQvKiogQXRtYXJrIChAKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19BVDogNjQsIFxyXG5cdC8qKiovXHJcblx0VktfQTogNjUsXHJcblx0LyoqKi9cclxuXHRWS19COiA2NixcclxuXHQvKioqL1xyXG5cdFZLX0M6IDY3LFxyXG5cdC8qKiovXHJcblx0VktfRDogNjgsXHJcblx0LyoqKi9cclxuXHRWS19FOiA2OSxcclxuXHQvKioqL1xyXG5cdFZLX0Y6IDcwLFxyXG5cdC8qKiovXHJcblx0VktfRzogNzEsXHJcblx0LyoqKi9cclxuXHRWS19IOiA3MixcclxuXHQvKioqL1xyXG5cdFZLX0k6IDczLFxyXG5cdC8qKiovXHJcblx0VktfSjogNzQsXHJcblx0LyoqKi9cclxuXHRWS19LOiA3NSxcclxuXHQvKioqL1xyXG5cdFZLX0w6IDc2LFxyXG5cdC8qKiovXHJcblx0VktfTTogNzcsXHJcblx0LyoqKi9cclxuXHRWS19OOiA3OCxcclxuXHQvKioqL1xyXG5cdFZLX086IDc5LFxyXG5cdC8qKiovXHJcblx0VktfUDogODAsXHJcblx0LyoqKi9cclxuXHRWS19ROiA4MSxcclxuXHQvKioqL1xyXG5cdFZLX1I6IDgyLFxyXG5cdC8qKiovXHJcblx0VktfUzogODMsXHJcblx0LyoqKi9cclxuXHRWS19UOiA4NCxcclxuXHQvKioqL1xyXG5cdFZLX1U6IDg1LFxyXG5cdC8qKiovXHJcblx0VktfVjogODYsXHJcblx0LyoqKi9cclxuXHRWS19XOiA4NyxcclxuXHQvKioqL1xyXG5cdFZLX1g6IDg4LFxyXG5cdC8qKiovXHJcblx0VktfWTogODksXHJcblx0LyoqKi9cclxuXHRWS19aOiA5MCxcclxuXHQvKioqL1xyXG5cdFZLX0NPTlRFWFRfTUVOVTogOTMsXHJcblx0LyoqIDAgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDA6IDk2LCBcclxuXHQvKiogMSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEMTogOTcsIFxyXG5cdC8qKiAyIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQyOiA5OCwgXHJcblx0LyoqIDMgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDM6IDk5LCBcclxuXHQvKiogNCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENDogMTAwLCBcclxuXHQvKiogNSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENTogMTAxLCBcclxuXHQvKiogNiBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENjogMTAyLCBcclxuXHQvKiogNyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENzogMTAzLCBcclxuXHQvKiogOCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEODogMTA0LCBcclxuXHQvKiogOSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEOTogMTA1LCBcclxuXHQvKiogKiBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTVVMVElQTFk6IDEwNixcclxuXHQvKiogKyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfQUREOiAxMDcsIFxyXG5cdC8qKiovXHJcblx0VktfU0VQQVJBVE9SOiAxMDgsXHJcblx0LyoqIC0gb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX1NVQlRSQUNUOiAxMDksIFxyXG5cdC8qKiBEZWNpbWFsIHBvaW50IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19ERUNJTUFMOiAxMTAsIFxyXG5cdC8qKiAvIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19ESVZJREU6IDExMSwgXHJcblx0LyoqIEYxIGtleS4gKi9cclxuXHRWS19GMTogMTEyLCBcclxuXHQvKiogRjIga2V5LiAqL1xyXG5cdFZLX0YyOiAxMTMsIFxyXG5cdC8qKiBGMyBrZXkuICovXHJcblx0VktfRjM6IDExNCwgXHJcblx0LyoqIEY0IGtleS4gKi9cclxuXHRWS19GNDogMTE1LCBcclxuXHQvKiogRjUga2V5LiAqL1xyXG5cdFZLX0Y1OiAxMTYsIFxyXG5cdC8qKiBGNiBrZXkuICovXHJcblx0VktfRjY6IDExNywgXHJcblx0LyoqIEY3IGtleS4gKi9cclxuXHRWS19GNzogMTE4LCBcclxuXHQvKiogRjgga2V5LiAqL1xyXG5cdFZLX0Y4OiAxMTksIFxyXG5cdC8qKiBGOSBrZXkuICovXHJcblx0VktfRjk6IDEyMCwgXHJcblx0LyoqIEYxMCBrZXkuICovXHJcblx0VktfRjEwOiAxMjEsIFxyXG5cdC8qKiBGMTEga2V5LiAqL1xyXG5cdFZLX0YxMTogMTIyLCBcclxuXHQvKiogRjEyIGtleS4gKi9cclxuXHRWS19GMTI6IDEyMywgXHJcblx0LyoqIEYxMyBrZXkuICovXHJcblx0VktfRjEzOiAxMjQsIFxyXG5cdC8qKiBGMTQga2V5LiAqL1xyXG5cdFZLX0YxNDogMTI1LCBcclxuXHQvKiogRjE1IGtleS4gKi9cclxuXHRWS19GMTU6IDEyNiwgXHJcblx0LyoqIEYxNiBrZXkuICovXHJcblx0VktfRjE2OiAxMjcsIFxyXG5cdC8qKiBGMTcga2V5LiAqL1xyXG5cdFZLX0YxNzogMTI4LCBcclxuXHQvKiogRjE4IGtleS4gKi9cclxuXHRWS19GMTg6IDEyOSwgXHJcblx0LyoqIEYxOSBrZXkuICovXHJcblx0VktfRjE5OiAxMzAsIFxyXG5cdC8qKiBGMjAga2V5LiAqL1xyXG5cdFZLX0YyMDogMTMxLCBcclxuXHQvKiogRjIxIGtleS4gKi9cclxuXHRWS19GMjE6IDEzMiwgXHJcblx0LyoqIEYyMiBrZXkuICovXHJcblx0VktfRjIyOiAxMzMsIFxyXG5cdC8qKiBGMjMga2V5LiAqL1xyXG5cdFZLX0YyMzogMTM0LCBcclxuXHQvKiogRjI0IGtleS4gKi9cclxuXHRWS19GMjQ6IDEzNSwgXHJcblx0LyoqIE51bSBMb2NrIGtleS4gKi9cclxuXHRWS19OVU1fTE9DSzogMTQ0LCBcclxuXHQvKiogU2Nyb2xsIExvY2sga2V5LiAqL1xyXG5cdFZLX1NDUk9MTF9MT0NLOiAxNDUsIFxyXG5cdC8qKiBDaXJjdW1mbGV4ICheKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19DSVJDVU1GTEVYOiAxNjAsIFxyXG5cdC8qKiBFeGNsYW1hdGlvbiAoISkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfRVhDTEFNQVRJT046IDE2MSwgXHJcblx0LyoqIERvdWJsZSBxdW90ZSAoKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19ET1VCTEVfUVVPVEU6IDE2MiwgXHJcblx0LyoqIEhhc2ggKCMpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0hBU0g6IDE2MywgXHJcblx0LyoqIERvbGxhciBzaWduICgkKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19ET0xMQVI6IDE2NCwgXHJcblx0LyoqIFBlcmNlbnQgKCUpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1BFUkNFTlQ6IDE2NSwgXHJcblx0LyoqIEFtcGVyc2FuZCAoJikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQU1QRVJTQU5EOiAxNjYsIFxyXG5cdC8qKiBVbmRlcnNjb3JlIChfKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19VTkRFUlNDT1JFOiAxNjcsIFxyXG5cdC8qKiBPcGVuIHBhcmVudGhlc2lzICgoKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19PUEVOX1BBUkVOOiAxNjgsIFxyXG5cdC8qKiBDbG9zZSBwYXJlbnRoZXNpcyAoKSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQ0xPU0VfUEFSRU46IDE2OSwgXHJcblx0LyogQXN0ZXJpc2sgKCopIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0FTVEVSSVNLOiAxNzAsXHJcblx0LyoqIFBsdXMgKCspIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1BMVVM6IDE3MSwgXHJcblx0LyoqIFBpcGUgKHwpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1BJUEU6IDE3MiwgXHJcblx0LyoqIEh5cGhlbi1VUy9kb2NzL01pbnVzICgtKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19IWVBIRU5fTUlOVVM6IDE3MywgXHJcblx0LyoqIE9wZW4gY3VybHkgYnJhY2tldCAoeykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfT1BFTl9DVVJMWV9CUkFDS0VUOiAxNzQsIFxyXG5cdC8qKiBDbG9zZSBjdXJseSBicmFja2V0ICh9KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19DTE9TRV9DVVJMWV9CUkFDS0VUOiAxNzUsIFxyXG5cdC8qKiBUaWxkZSAofikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfVElMREU6IDE3NiwgXHJcblx0LyoqIENvbW1hICgsKSBrZXkuICovXHJcblx0VktfQ09NTUE6IDE4OCwgXHJcblx0LyoqIFBlcmlvZCAoLikga2V5LiAqL1xyXG5cdFZLX1BFUklPRDogMTkwLCBcclxuXHQvKiogU2xhc2ggKC8pIGtleS4gKi9cclxuXHRWS19TTEFTSDogMTkxLCBcclxuXHQvKiogQmFjayB0aWNrIChgKSBrZXkuICovXHJcblx0VktfQkFDS19RVU9URTogMTkyLCBcclxuXHQvKiogT3BlbiBzcXVhcmUgYnJhY2tldCAoWykga2V5LiAqL1xyXG5cdFZLX09QRU5fQlJBQ0tFVDogMjE5LCBcclxuXHQvKiogQmFjayBzbGFzaCAoXFwpIGtleS4gKi9cclxuXHRWS19CQUNLX1NMQVNIOiAyMjAsIFxyXG5cdC8qKiBDbG9zZSBzcXVhcmUgYnJhY2tldCAoXSkga2V5LiAqL1xyXG5cdFZLX0NMT1NFX0JSQUNLRVQ6IDIyMSwgXHJcblx0LyoqIFF1b3RlICgnJycpIGtleS4gKi9cclxuXHRWS19RVU9URTogMjIyLCBcclxuXHQvKiogTWV0YSBrZXkgb24gTGludXgsIENvbW1hbmQga2V5IG9uIE1hYy4gKi9cclxuXHRWS19NRVRBOiAyMjQsIFxyXG5cdC8qKiBBbHRHciBrZXkgb24gTGludXguIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19BTFRHUjogMjI1LCBcclxuXHQvKiogV2luZG93cyBsb2dvIGtleSBvbiBXaW5kb3dzLiBPciBTdXBlciBvciBIeXBlciBrZXkgb24gTGludXguIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19XSU46IDkxLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfS0FOQTogMjEsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19IQU5HVUw6IDIxLCBcclxuXHQvKiog6Iux5pWwIGtleSBvbiBKYXBhbmVzZSBNYWMga2V5Ym9hcmQuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19FSVNVOiAyMiwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0pVTkpBOiAyMywgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0ZJTkFMOiAyNCwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0hBTkpBOiAyNSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0tBTkpJOiAyNSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0NPTlZFUlQ6IDI4LCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfTk9OQ09OVkVSVDogMjksIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19BQ0NFUFQ6IDMwLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfTU9ERUNIQU5HRTogMzEsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19TRUxFQ1Q6IDQxLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfUFJJTlQ6IDQyLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfRVhFQ1VURTogNDMsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC5cdCAqL1xyXG5cdFZLX1NMRUVQOiA5NSBcclxufTtcclxuLyoqXHJcbiAqIEBuYW1lc3BhY2VcclxuICogQ29udGFpbnMgdGV4dCB0b2tlbml6YXRpb24gYW5kIGJyZWFraW5nIHJvdXRpbmVzXHJcbiAqL1xyXG5ST1QuVGV4dCA9IHtcclxuXHRSRV9DT0xPUlM6IC8lKFtiY10peyhbXn1dKil9L2csXHJcblxyXG5cdC8qIHRva2VuIHR5cGVzICovXHJcblx0VFlQRV9URVhUOlx0XHQwLFxyXG5cdFRZUEVfTkVXTElORTpcdDEsXHJcblx0VFlQRV9GRzpcdFx0MixcclxuXHRUWVBFX0JHOlx0XHQzLFxyXG5cclxuXHQvKipcclxuXHQgKiBNZWFzdXJlIHNpemUgb2YgYSByZXN1bHRpbmcgdGV4dCBibG9ja1xyXG5cdCAqL1xyXG5cdG1lYXN1cmU6IGZ1bmN0aW9uKHN0ciwgbWF4V2lkdGgpIHtcclxuXHRcdHZhciByZXN1bHQgPSB7d2lkdGg6MCwgaGVpZ2h0OjF9O1xyXG5cdFx0dmFyIHRva2VucyA9IHRoaXMudG9rZW5pemUoc3RyLCBtYXhXaWR0aCk7XHJcblx0XHR2YXIgbGluZVdpZHRoID0gMDtcclxuXHJcblx0XHRmb3IgKHZhciBpPTA7aTx0b2tlbnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbaV07XHJcblx0XHRcdHN3aXRjaCAodG9rZW4udHlwZSkge1xyXG5cdFx0XHRcdGNhc2UgdGhpcy5UWVBFX1RFWFQ6XHJcblx0XHRcdFx0XHRsaW5lV2lkdGggKz0gdG9rZW4udmFsdWUubGVuZ3RoO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlIHRoaXMuVFlQRV9ORVdMSU5FOlxyXG5cdFx0XHRcdFx0cmVzdWx0LmhlaWdodCsrO1xyXG5cdFx0XHRcdFx0cmVzdWx0LndpZHRoID0gTWF0aC5tYXgocmVzdWx0LndpZHRoLCBsaW5lV2lkdGgpO1xyXG5cdFx0XHRcdFx0bGluZVdpZHRoID0gMDtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmVzdWx0LndpZHRoID0gTWF0aC5tYXgocmVzdWx0LndpZHRoLCBsaW5lV2lkdGgpO1xyXG5cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydCBzdHJpbmcgdG8gYSBzZXJpZXMgb2YgYSBmb3JtYXR0aW5nIGNvbW1hbmRzXHJcblx0ICovXHJcblx0dG9rZW5pemU6IGZ1bmN0aW9uKHN0ciwgbWF4V2lkdGgpIHtcclxuXHRcdHZhciByZXN1bHQgPSBbXTtcclxuXHJcblx0XHQvKiBmaXJzdCB0b2tlbml6YXRpb24gcGFzcyAtIHNwbGl0IHRleHRzIGFuZCBjb2xvciBmb3JtYXR0aW5nIGNvbW1hbmRzICovXHJcblx0XHR2YXIgb2Zmc2V0ID0gMDtcclxuXHRcdHN0ci5yZXBsYWNlKHRoaXMuUkVfQ09MT1JTLCBmdW5jdGlvbihtYXRjaCwgdHlwZSwgbmFtZSwgaW5kZXgpIHtcclxuXHRcdFx0Lyogc3RyaW5nIGJlZm9yZSAqL1xyXG5cdFx0XHR2YXIgcGFydCA9IHN0ci5zdWJzdHJpbmcob2Zmc2V0LCBpbmRleCk7XHJcblx0XHRcdGlmIChwYXJ0Lmxlbmd0aCkge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKHtcclxuXHRcdFx0XHRcdHR5cGU6IFJPVC5UZXh0LlRZUEVfVEVYVCxcclxuXHRcdFx0XHRcdHZhbHVlOiBwYXJ0XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qIGNvbG9yIGNvbW1hbmQgKi9cclxuXHRcdFx0cmVzdWx0LnB1c2goe1xyXG5cdFx0XHRcdHR5cGU6ICh0eXBlID09IFwiY1wiID8gUk9ULlRleHQuVFlQRV9GRyA6IFJPVC5UZXh0LlRZUEVfQkcpLFxyXG5cdFx0XHRcdHZhbHVlOiBuYW1lLnRyaW0oKVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdG9mZnNldCA9IGluZGV4ICsgbWF0Y2gubGVuZ3RoO1xyXG5cdFx0XHRyZXR1cm4gXCJcIjtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8qIGxhc3QgcmVtYWluaW5nIHBhcnQgKi9cclxuXHRcdHZhciBwYXJ0ID0gc3RyLnN1YnN0cmluZyhvZmZzZXQpO1xyXG5cdFx0aWYgKHBhcnQubGVuZ3RoKSB7XHJcblx0XHRcdHJlc3VsdC5wdXNoKHtcclxuXHRcdFx0XHR0eXBlOiBST1QuVGV4dC5UWVBFX1RFWFQsXHJcblx0XHRcdFx0dmFsdWU6IHBhcnRcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX2JyZWFrTGluZXMocmVzdWx0LCBtYXhXaWR0aCk7XHJcblx0fSxcclxuXHJcblx0LyogaW5zZXJ0IGxpbmUgYnJlYWtzIGludG8gZmlyc3QtcGFzcyB0b2tlbml6ZWQgZGF0YSAqL1xyXG5cdF9icmVha0xpbmVzOiBmdW5jdGlvbih0b2tlbnMsIG1heFdpZHRoKSB7XHJcblx0XHRpZiAoIW1heFdpZHRoKSB7IG1heFdpZHRoID0gSW5maW5pdHk7IH1cclxuXHJcblx0XHR2YXIgaSA9IDA7XHJcblx0XHR2YXIgbGluZUxlbmd0aCA9IDA7XHJcblx0XHR2YXIgbGFzdFRva2VuV2l0aFNwYWNlID0gLTE7XHJcblxyXG5cdFx0d2hpbGUgKGkgPCB0b2tlbnMubGVuZ3RoKSB7IC8qIHRha2UgYWxsIHRleHQgdG9rZW5zLCByZW1vdmUgc3BhY2UsIGFwcGx5IGxpbmVicmVha3MgKi9cclxuXHRcdFx0dmFyIHRva2VuID0gdG9rZW5zW2ldO1xyXG5cdFx0XHRpZiAodG9rZW4udHlwZSA9PSBST1QuVGV4dC5UWVBFX05FV0xJTkUpIHsgLyogcmVzZXQgKi9cclxuXHRcdFx0XHRsaW5lTGVuZ3RoID0gMDsgXHJcblx0XHRcdFx0bGFzdFRva2VuV2l0aFNwYWNlID0gLTE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRva2VuLnR5cGUgIT0gUk9ULlRleHQuVFlQRV9URVhUKSB7IC8qIHNraXAgbm9uLXRleHQgdG9rZW5zICovXHJcblx0XHRcdFx0aSsrO1xyXG5cdFx0XHRcdGNvbnRpbnVlOyBcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyogcmVtb3ZlIHNwYWNlcyBhdCB0aGUgYmVnaW5uaW5nIG9mIGxpbmUgKi9cclxuXHRcdFx0d2hpbGUgKGxpbmVMZW5ndGggPT0gMCAmJiB0b2tlbi52YWx1ZS5jaGFyQXQoMCkgPT0gXCIgXCIpIHsgdG9rZW4udmFsdWUgPSB0b2tlbi52YWx1ZS5zdWJzdHJpbmcoMSk7IH1cclxuXHJcblx0XHRcdC8qIGZvcmNlZCBuZXdsaW5lPyBpbnNlcnQgdHdvIG5ldyB0b2tlbnMgYWZ0ZXIgdGhpcyBvbmUgKi9cclxuXHRcdFx0dmFyIGluZGV4ID0gdG9rZW4udmFsdWUuaW5kZXhPZihcIlxcblwiKTtcclxuXHRcdFx0aWYgKGluZGV4ICE9IC0xKSB7IFxyXG5cdFx0XHRcdHRva2VuLnZhbHVlID0gdGhpcy5fYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGksIGluZGV4LCB0cnVlKTsgXHJcblxyXG5cdFx0XHRcdC8qIGlmIHRoZXJlIGFyZSBzcGFjZXMgYXQgdGhlIGVuZCwgd2UgbXVzdCByZW1vdmUgdGhlbSAod2UgZG8gbm90IHdhbnQgdGhlIGxpbmUgdG9vIGxvbmcpICovXHJcblx0XHRcdFx0dmFyIGFyciA9IHRva2VuLnZhbHVlLnNwbGl0KFwiXCIpO1xyXG5cdFx0XHRcdHdoaWxlIChhcnIubGVuZ3RoICYmIGFyclthcnIubGVuZ3RoLTFdID09IFwiIFwiKSB7IGFyci5wb3AoKTsgfVxyXG5cdFx0XHRcdHRva2VuLnZhbHVlID0gYXJyLmpvaW4oXCJcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qIHRva2VuIGRlZ2VuZXJhdGVkPyAqL1xyXG5cdFx0XHRpZiAoIXRva2VuLnZhbHVlLmxlbmd0aCkge1xyXG5cdFx0XHRcdHRva2Vucy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChsaW5lTGVuZ3RoICsgdG9rZW4udmFsdWUubGVuZ3RoID4gbWF4V2lkdGgpIHsgLyogbGluZSB0b28gbG9uZywgZmluZCBhIHN1aXRhYmxlIGJyZWFraW5nIHNwb3QgKi9cclxuXHJcblx0XHRcdFx0LyogaXMgaXQgcG9zc2libGUgdG8gYnJlYWsgd2l0aGluIHRoaXMgdG9rZW4/ICovXHJcblx0XHRcdFx0dmFyIGluZGV4ID0gLTE7XHJcblx0XHRcdFx0d2hpbGUgKDEpIHtcclxuXHRcdFx0XHRcdHZhciBuZXh0SW5kZXggPSB0b2tlbi52YWx1ZS5pbmRleE9mKFwiIFwiLCBpbmRleCsxKTtcclxuXHRcdFx0XHRcdGlmIChuZXh0SW5kZXggPT0gLTEpIHsgYnJlYWs7IH1cclxuXHRcdFx0XHRcdGlmIChsaW5lTGVuZ3RoICsgbmV4dEluZGV4ID4gbWF4V2lkdGgpIHsgYnJlYWs7IH1cclxuXHRcdFx0XHRcdGluZGV4ID0gbmV4dEluZGV4O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ICE9IC0xKSB7IC8qIGJyZWFrIGF0IHNwYWNlIHdpdGhpbiB0aGlzIG9uZSAqL1xyXG5cdFx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgaSwgaW5kZXgsIHRydWUpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobGFzdFRva2VuV2l0aFNwYWNlICE9IC0xKSB7IC8qIGlzIHRoZXJlIGEgcHJldmlvdXMgdG9rZW4gd2hlcmUgYSBicmVhayBjYW4gb2NjdXI/ICovXHJcblx0XHRcdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbbGFzdFRva2VuV2l0aFNwYWNlXTtcclxuXHRcdFx0XHRcdHZhciBicmVha0luZGV4ID0gdG9rZW4udmFsdWUubGFzdEluZGV4T2YoXCIgXCIpO1xyXG5cdFx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgbGFzdFRva2VuV2l0aFNwYWNlLCBicmVha0luZGV4LCB0cnVlKTtcclxuXHRcdFx0XHRcdGkgPSBsYXN0VG9rZW5XaXRoU3BhY2U7XHJcblx0XHRcdFx0fSBlbHNlIHsgLyogZm9yY2UgYnJlYWsgaW4gdGhpcyB0b2tlbiAqL1xyXG5cdFx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgaSwgbWF4V2lkdGgtbGluZUxlbmd0aCwgZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gZWxzZSB7IC8qIGxpbmUgbm90IGxvbmcsIGNvbnRpbnVlICovXHJcblx0XHRcdFx0bGluZUxlbmd0aCArPSB0b2tlbi52YWx1ZS5sZW5ndGg7XHJcblx0XHRcdFx0aWYgKHRva2VuLnZhbHVlLmluZGV4T2YoXCIgXCIpICE9IC0xKSB7IGxhc3RUb2tlbldpdGhTcGFjZSA9IGk7IH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aSsrOyAvKiBhZHZhbmNlIHRvIG5leHQgdG9rZW4gKi9cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0dG9rZW5zLnB1c2goe3R5cGU6IFJPVC5UZXh0LlRZUEVfTkVXTElORX0pOyAvKiBpbnNlcnQgZmFrZSBuZXdsaW5lIHRvIGZpeCB0aGUgbGFzdCB0ZXh0IGxpbmUgKi9cclxuXHJcblx0XHQvKiByZW1vdmUgdHJhaWxpbmcgc3BhY2UgZnJvbSB0ZXh0IHRva2VucyBiZWZvcmUgbmV3bGluZXMgKi9cclxuXHRcdHZhciBsYXN0VGV4dFRva2VuID0gbnVsbDtcclxuXHRcdGZvciAodmFyIGk9MDtpPHRva2Vucy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHZhciB0b2tlbiA9IHRva2Vuc1tpXTtcclxuXHRcdFx0c3dpdGNoICh0b2tlbi50eXBlKSB7XHJcblx0XHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX1RFWFQ6IGxhc3RUZXh0VG9rZW4gPSB0b2tlbjsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX05FV0xJTkU6IFxyXG5cdFx0XHRcdFx0aWYgKGxhc3RUZXh0VG9rZW4pIHsgLyogcmVtb3ZlIHRyYWlsaW5nIHNwYWNlICovXHJcblx0XHRcdFx0XHRcdHZhciBhcnIgPSBsYXN0VGV4dFRva2VuLnZhbHVlLnNwbGl0KFwiXCIpO1xyXG5cdFx0XHRcdFx0XHR3aGlsZSAoYXJyLmxlbmd0aCAmJiBhcnJbYXJyLmxlbmd0aC0xXSA9PSBcIiBcIikgeyBhcnIucG9wKCk7IH1cclxuXHRcdFx0XHRcdFx0bGFzdFRleHRUb2tlbi52YWx1ZSA9IGFyci5qb2luKFwiXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGFzdFRleHRUb2tlbiA9IG51bGw7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0b2tlbnMucG9wKCk7IC8qIHJlbW92ZSBmYWtlIHRva2VuICovXHJcblxyXG5cdFx0cmV0dXJuIHRva2VucztcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGUgbmV3IHRva2VucyBhbmQgaW5zZXJ0IHRoZW0gaW50byB0aGUgc3RyZWFtXHJcblx0ICogQHBhcmFtIHtvYmplY3RbXX0gdG9rZW5zXHJcblx0ICogQHBhcmFtIHtpbnR9IHRva2VuSW5kZXggVG9rZW4gYmVpbmcgcHJvY2Vzc2VkXHJcblx0ICogQHBhcmFtIHtpbnR9IGJyZWFrSW5kZXggSW5kZXggd2l0aGluIGN1cnJlbnQgdG9rZW4ncyB2YWx1ZVxyXG5cdCAqIEBwYXJhbSB7Ym9vbH0gcmVtb3ZlQnJlYWtDaGFyIERvIHdlIHdhbnQgdG8gcmVtb3ZlIHRoZSBicmVha2luZyBjaGFyYWN0ZXI/XHJcblx0ICogQHJldHVybnMge3N0cmluZ30gcmVtYWluaW5nIHVuYnJva2VuIHRva2VuIHZhbHVlXHJcblx0ICovXHJcblx0X2JyZWFrSW5zaWRlVG9rZW46IGZ1bmN0aW9uKHRva2VucywgdG9rZW5JbmRleCwgYnJlYWtJbmRleCwgcmVtb3ZlQnJlYWtDaGFyKSB7XHJcblx0XHR2YXIgbmV3QnJlYWtUb2tlbiA9IHtcclxuXHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9ORVdMSU5FXHJcblx0XHR9O1xyXG5cdFx0dmFyIG5ld1RleHRUb2tlbiA9IHtcclxuXHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9URVhULFxyXG5cdFx0XHR2YWx1ZTogdG9rZW5zW3Rva2VuSW5kZXhdLnZhbHVlLnN1YnN0cmluZyhicmVha0luZGV4ICsgKHJlbW92ZUJyZWFrQ2hhciA/IDEgOiAwKSlcclxuXHRcdH07XHJcblx0XHR0b2tlbnMuc3BsaWNlKHRva2VuSW5kZXgrMSwgMCwgbmV3QnJlYWtUb2tlbiwgbmV3VGV4dFRva2VuKTtcclxuXHRcdHJldHVybiB0b2tlbnNbdG9rZW5JbmRleF0udmFsdWUuc3Vic3RyaW5nKDAsIGJyZWFrSW5kZXgpO1xyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEByZXR1cm5zIHthbnl9IFJhbmRvbWx5IHBpY2tlZCBpdGVtLCBudWxsIHdoZW4gbGVuZ3RoPTBcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5yYW5kb20gPSBBcnJheS5wcm90b3R5cGUucmFuZG9tIHx8IGZ1bmN0aW9uKCkge1xyXG5cdGlmICghdGhpcy5sZW5ndGgpIHsgcmV0dXJuIG51bGw7IH1cclxuXHRyZXR1cm4gdGhpc1tNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogdGhpcy5sZW5ndGgpXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcmV0dXJucyB7YXJyYXl9IE5ldyBhcnJheSB3aXRoIHJhbmRvbWl6ZWQgaXRlbXNcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5yYW5kb21pemUgPSBBcnJheS5wcm90b3R5cGUucmFuZG9taXplIHx8IGZ1bmN0aW9uKCkge1xyXG4gIHZhciByZXN1bHQgPSBbXTtcclxuICB2YXIgY2xvbmUgPSB0aGlzLnNsaWNlKCk7XHJcbiAgd2hpbGUgKGNsb25lLmxlbmd0aCkge1xyXG4gICAgdmFyIGluZGV4ID0gY2xvbmUuaW5kZXhPZihjbG9uZS5yYW5kb20oKSk7XHJcbiAgICByZXN1bHQucHVzaChjbG9uZS5zcGxpY2UoaW5kZXgsIDEpWzBdKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuLyoqXHJcbiAqIEFsd2F5cyBwb3NpdGl2ZSBtb2R1bHVzXHJcbiAqIEBwYXJhbSB7aW50fSBuIE1vZHVsdXNcclxuICogQHJldHVybnMge2ludH0gdGhpcyBtb2R1bG8gblxyXG4gKi9cclxuTnVtYmVyLnByb3RvdHlwZS5tb2QgPSBOdW1iZXIucHJvdG90eXBlLm1vZCB8fCBmdW5jdGlvbihuKSB7XHJcblx0cmV0dXJuICgodGhpcyVuKStuKSVuO1xyXG59O1xyXG4vKipcclxuICogQHJldHVybnMge3N0cmluZ30gRmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkXHJcbiAqL1xyXG5TdHJpbmcucHJvdG90eXBlLmNhcGl0YWxpemUgPSBTdHJpbmcucHJvdG90eXBlLmNhcGl0YWxpemUgfHwgZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnN1YnN0cmluZygxKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogTGVmdCBwYWRcclxuICogQHBhcmFtIHtzdHJpbmd9IFtjaGFyYWN0ZXI9XCIwXCJdXHJcbiAqIEBwYXJhbSB7aW50fSBbY291bnQ9Ml1cclxuICovXHJcblN0cmluZy5wcm90b3R5cGUubHBhZCA9IFN0cmluZy5wcm90b3R5cGUubHBhZCB8fCBmdW5jdGlvbihjaGFyYWN0ZXIsIGNvdW50KSB7XHJcblx0dmFyIGNoID0gY2hhcmFjdGVyIHx8IFwiMFwiO1xyXG5cdHZhciBjbnQgPSBjb3VudCB8fCAyO1xyXG5cclxuXHR2YXIgcyA9IFwiXCI7XHJcblx0d2hpbGUgKHMubGVuZ3RoIDwgKGNudCAtIHRoaXMubGVuZ3RoKSkgeyBzICs9IGNoOyB9XHJcblx0cyA9IHMuc3Vic3RyaW5nKDAsIGNudC10aGlzLmxlbmd0aCk7XHJcblx0cmV0dXJuIHMrdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogUmlnaHQgcGFkXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbY2hhcmFjdGVyPVwiMFwiXVxyXG4gKiBAcGFyYW0ge2ludH0gW2NvdW50PTJdXHJcbiAqL1xyXG5TdHJpbmcucHJvdG90eXBlLnJwYWQgPSBTdHJpbmcucHJvdG90eXBlLnJwYWQgfHwgZnVuY3Rpb24oY2hhcmFjdGVyLCBjb3VudCkge1xyXG5cdHZhciBjaCA9IGNoYXJhY3RlciB8fCBcIjBcIjtcclxuXHR2YXIgY250ID0gY291bnQgfHwgMjtcclxuXHJcblx0dmFyIHMgPSBcIlwiO1xyXG5cdHdoaWxlIChzLmxlbmd0aCA8IChjbnQgLSB0aGlzLmxlbmd0aCkpIHsgcyArPSBjaDsgfVxyXG5cdHMgPSBzLnN1YnN0cmluZygwLCBjbnQtdGhpcy5sZW5ndGgpO1xyXG5cdHJldHVybiB0aGlzK3M7XHJcbn07XHJcblxyXG4vKipcclxuICogRm9ybWF0IGEgc3RyaW5nIGluIGEgZmxleGlibGUgd2F5LiBTY2FucyBmb3IgJXMgc3RyaW5ncyBhbmQgcmVwbGFjZXMgdGhlbSB3aXRoIGFyZ3VtZW50cy4gTGlzdCBvZiBwYXR0ZXJucyBpcyBtb2RpZmlhYmxlIHZpYSBTdHJpbmcuZm9ybWF0Lm1hcC5cclxuICogQHBhcmFtIHtzdHJpbmd9IHRlbXBsYXRlXHJcbiAqIEBwYXJhbSB7YW55fSBbYXJndl1cclxuICovXHJcblN0cmluZy5mb3JtYXQgPSBTdHJpbmcuZm9ybWF0IHx8IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XHJcblx0dmFyIG1hcCA9IFN0cmluZy5mb3JtYXQubWFwO1xyXG5cdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuXHJcblx0dmFyIHJlcGxhY2VyID0gZnVuY3Rpb24obWF0Y2gsIGdyb3VwMSwgZ3JvdXAyLCBpbmRleCkge1xyXG5cdFx0aWYgKHRlbXBsYXRlLmNoYXJBdChpbmRleC0xKSA9PSBcIiVcIikgeyByZXR1cm4gbWF0Y2guc3Vic3RyaW5nKDEpOyB9XHJcblx0XHRpZiAoIWFyZ3MubGVuZ3RoKSB7IHJldHVybiBtYXRjaDsgfVxyXG5cdFx0dmFyIG9iaiA9IGFyZ3NbMF07XHJcblxyXG5cdFx0dmFyIGdyb3VwID0gZ3JvdXAxIHx8IGdyb3VwMjtcclxuXHRcdHZhciBwYXJ0cyA9IGdyb3VwLnNwbGl0KFwiLFwiKTtcclxuXHRcdHZhciBuYW1lID0gcGFydHMuc2hpZnQoKTtcclxuXHRcdHZhciBtZXRob2QgPSBtYXBbbmFtZS50b0xvd2VyQ2FzZSgpXTtcclxuXHRcdGlmICghbWV0aG9kKSB7IHJldHVybiBtYXRjaDsgfVxyXG5cclxuXHRcdHZhciBvYmogPSBhcmdzLnNoaWZ0KCk7XHJcblx0XHR2YXIgcmVwbGFjZWQgPSBvYmpbbWV0aG9kXS5hcHBseShvYmosIHBhcnRzKTtcclxuXHJcblx0XHR2YXIgZmlyc3QgPSBuYW1lLmNoYXJBdCgwKTtcclxuXHRcdGlmIChmaXJzdCAhPSBmaXJzdC50b0xvd2VyQ2FzZSgpKSB7IHJlcGxhY2VkID0gcmVwbGFjZWQuY2FwaXRhbGl6ZSgpOyB9XHJcblxyXG5cdFx0cmV0dXJuIHJlcGxhY2VkO1xyXG5cdH07XHJcblx0cmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoLyUoPzooW2Etel0rKXwoPzp7KFtefV0rKX0pKS9naSwgcmVwbGFjZXIpO1xyXG59O1xyXG5cclxuU3RyaW5nLmZvcm1hdC5tYXAgPSBTdHJpbmcuZm9ybWF0Lm1hcCB8fCB7XHJcblx0XCJzXCI6IFwidG9TdHJpbmdcIlxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlbmllbmNlIHNob3J0Y3V0IHRvIFN0cmluZy5mb3JtYXQodGhpcylcclxuICovXHJcblN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgfHwgZnVuY3Rpb24oKSB7XHJcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG5cdGFyZ3MudW5zaGlmdCh0aGlzKTtcclxuXHRyZXR1cm4gU3RyaW5nLmZvcm1hdC5hcHBseShTdHJpbmcsIGFyZ3MpO1xyXG59O1xyXG5cclxuaWYgKCFPYmplY3QuY3JlYXRlKSB7ICBcclxuXHQvKipcclxuXHQgKiBFUzUgT2JqZWN0LmNyZWF0ZVxyXG5cdCAqL1xyXG5cdE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbihvKSB7ICBcclxuXHRcdHZhciB0bXAgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0dG1wLnByb3RvdHlwZSA9IG87XHJcblx0XHRyZXR1cm4gbmV3IHRtcCgpO1xyXG5cdH07ICBcclxufSAgXHJcbi8qKlxyXG4gKiBTZXRzIHByb3RvdHlwZSBvZiB0aGlzIGZ1bmN0aW9uIHRvIGFuIGluc3RhbmNlIG9mIHBhcmVudCBmdW5jdGlvblxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBwYXJlbnRcclxuICovXHJcbkZ1bmN0aW9uLnByb3RvdHlwZS5leHRlbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuZXh0ZW5kIHx8IGZ1bmN0aW9uKHBhcmVudCkge1xyXG5cdHRoaXMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcclxuXHR0aGlzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHRoaXM7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbmlmICh0eXBlb2Ygd2luZG93ICE9IFwidW5kZWZpbmVkXCIpIHtcclxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID1cclxuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IGZ1bmN0aW9uKGNiKSB7IHJldHVybiBzZXRUaW1lb3V0KGNiLCAxMDAwLzYwKTsgfTtcclxuXHJcblx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID1cclxuXHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5vQ2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5tc0NhbmNlbEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCBmdW5jdGlvbihpZCkgeyByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTsgfTtcclxufVxyXG4vKipcclxuICogQGNsYXNzIFZpc3VhbCBtYXAgZGlzcGxheVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy53aWR0aD1ST1QuREVGQVVMVF9XSURUSF1cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLmhlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5mb250U2l6ZT0xNV1cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmZvbnRGYW1pbHk9XCJtb25vc3BhY2VcIl1cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmZvbnRTdHlsZT1cIlwiXSBib2xkL2l0YWxpYy9ub25lL2JvdGhcclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmZnPVwiI2NjY1wiXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuYmc9XCIjMDAwXCJdXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IFtvcHRpb25zLnNwYWNpbmc9MV1cclxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMuYm9yZGVyPTBdXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5sYXlvdXQ9XCJyZWN0XCJdXHJcbiAqIEBwYXJhbSB7Ym9vbH0gW29wdGlvbnMuZm9yY2VTcXVhcmVSYXRpbz1mYWxzZV1cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRpbGVXaWR0aD0zMl1cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRpbGVIZWlnaHQ9MzJdXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy50aWxlTWFwPXt9XVxyXG4gKiBAcGFyYW0ge2ltYWdlfSBbb3B0aW9ucy50aWxlU2V0PW51bGxdXHJcbiAqIEBwYXJhbSB7aW1hZ2V9IFtvcHRpb25zLnRpbGVDb2xvcml6ZT1mYWxzZV1cclxuICovXHJcblJPVC5EaXNwbGF5ID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG5cdHRoaXMuX2NvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cdHRoaXMuX2RhdGEgPSB7fTtcclxuXHR0aGlzLl9kaXJ0eSA9IGZhbHNlOyAvKiBmYWxzZSA9IG5vdGhpbmcsIHRydWUgPSBhbGwsIG9iamVjdCA9IGRpcnR5IGNlbGxzICovXHJcblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xyXG5cdHRoaXMuX2JhY2tlbmQgPSBudWxsO1xyXG5cdFxyXG5cdHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcclxuXHRcdHdpZHRoOiBST1QuREVGQVVMVF9XSURUSCxcclxuXHRcdGhlaWdodDogUk9ULkRFRkFVTFRfSEVJR0hULFxyXG5cdFx0dHJhbnNwb3NlOiBmYWxzZSxcclxuXHRcdGxheW91dDogXCJyZWN0XCIsXHJcblx0XHRmb250U2l6ZTogMTUsXHJcblx0XHRzcGFjaW5nOiAxLFxyXG5cdFx0Ym9yZGVyOiAwLFxyXG5cdFx0Zm9yY2VTcXVhcmVSYXRpbzogZmFsc2UsXHJcblx0XHRmb250RmFtaWx5OiBcIm1vbm9zcGFjZVwiLFxyXG5cdFx0Zm9udFN0eWxlOiBcIlwiLFxyXG5cdFx0Zmc6IFwiI2NjY1wiLFxyXG5cdFx0Ymc6IFwiIzAwMFwiLFxyXG5cdFx0dGlsZVdpZHRoOiAzMixcclxuXHRcdHRpbGVIZWlnaHQ6IDMyLFxyXG5cdFx0dGlsZU1hcDoge30sXHJcblx0XHR0aWxlU2V0OiBudWxsLFxyXG5cdFx0dGlsZUNvbG9yaXplOiBmYWxzZSxcclxuXHRcdHRlcm1Db2xvcjogXCJ4dGVybVwiXHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgZGVmYXVsdE9wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblx0dGhpcy5zZXRPcHRpb25zKGRlZmF1bHRPcHRpb25zKTtcclxuXHR0aGlzLkRFQlVHID0gdGhpcy5ERUJVRy5iaW5kKHRoaXMpO1xyXG5cclxuXHR0aGlzLl90aWNrID0gdGhpcy5fdGljay5iaW5kKHRoaXMpO1xyXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl90aWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZWJ1ZyBoZWxwZXIsIGlkZWFsIGFzIGEgbWFwIGdlbmVyYXRvciBjYWxsYmFjay4gQWx3YXlzIGJvdW5kIHRvIHRoaXMuXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSB3aGF0XHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuREVCVUcgPSBmdW5jdGlvbih4LCB5LCB3aGF0KSB7XHJcblx0dmFyIGNvbG9ycyA9IFt0aGlzLl9vcHRpb25zLmJnLCB0aGlzLl9vcHRpb25zLmZnXTtcclxuXHR0aGlzLmRyYXcoeCwgeSwgbnVsbCwgbnVsbCwgY29sb3JzW3doYXQgJSBjb2xvcnMubGVuZ3RoXSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xlYXIgdGhlIHdob2xlIGRpc3BsYXkgKGNvdmVyIGl0IHdpdGggYmFja2dyb3VuZCBjb2xvcilcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2RhdGEgPSB7fTtcclxuXHR0aGlzLl9kaXJ0eSA9IHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuRGlzcGxheVxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblx0aWYgKG9wdGlvbnMud2lkdGggfHwgb3B0aW9ucy5oZWlnaHQgfHwgb3B0aW9ucy5mb250U2l6ZSB8fCBvcHRpb25zLmZvbnRGYW1pbHkgfHwgb3B0aW9ucy5zcGFjaW5nIHx8IG9wdGlvbnMubGF5b3V0KSB7XHJcblx0XHRpZiAob3B0aW9ucy5sYXlvdXQpIHsgXHJcblx0XHRcdHRoaXMuX2JhY2tlbmQgPSBuZXcgUk9ULkRpc3BsYXlbb3B0aW9ucy5sYXlvdXQuY2FwaXRhbGl6ZSgpXSh0aGlzLl9jb250ZXh0KTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZm9udCA9ICh0aGlzLl9vcHRpb25zLmZvbnRTdHlsZSA/IHRoaXMuX29wdGlvbnMuZm9udFN0eWxlICsgXCIgXCIgOiBcIlwiKSArIHRoaXMuX29wdGlvbnMuZm9udFNpemUgKyBcInB4IFwiICsgdGhpcy5fb3B0aW9ucy5mb250RmFtaWx5O1xyXG5cdFx0dGhpcy5fY29udGV4dC5mb250ID0gZm9udDtcclxuXHRcdHRoaXMuX2JhY2tlbmQuY29tcHV0ZSh0aGlzLl9vcHRpb25zKTtcclxuXHRcdHRoaXMuX2NvbnRleHQuZm9udCA9IGZvbnQ7XHJcblx0XHR0aGlzLl9jb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcblx0XHR0aGlzLl9jb250ZXh0LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcblx0XHR0aGlzLl9kaXJ0eSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgY3VycmVudGx5IHNldCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9IEN1cnJlbnQgb3B0aW9ucyBvYmplY3QgXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIERPTSBub2RlIG9mIHRoaXMgZGlzcGxheVxyXG4gKiBAcmV0dXJucyB7bm9kZX0gRE9NIG5vZGVcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fY29udGV4dC5jYW52YXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB0aGUgbWF4aW11bSB3aWR0aC9oZWlnaHQgdG8gZml0IGludG8gYSBzZXQgb2YgZ2l2ZW4gY29uc3RyYWludHNcclxuICogQHBhcmFtIHtpbnR9IGF2YWlsV2lkdGggTWF4aW11bSBhbGxvd2VkIHBpeGVsIHdpZHRoXHJcbiAqIEBwYXJhbSB7aW50fSBhdmFpbEhlaWdodCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgaGVpZ2h0XHJcbiAqIEByZXR1cm5zIHtpbnRbMl19IGNlbGxXaWR0aCxjZWxsSGVpZ2h0XHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHJldHVybiB0aGlzLl9iYWNrZW5kLmNvbXB1dGVTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0LCB0aGlzLl9vcHRpb25zKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHRoZSBtYXhpbXVtIGZvbnQgc2l6ZSB0byBmaXQgaW50byBhIHNldCBvZiBnaXZlbiBjb25zdHJhaW50c1xyXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxXaWR0aCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgd2lkdGhcclxuICogQHBhcmFtIHtpbnR9IGF2YWlsSGVpZ2h0IE1heGltdW0gYWxsb3dlZCBwaXhlbCBoZWlnaHRcclxuICogQHJldHVybnMge2ludH0gZm9udFNpemVcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHJldHVybiB0aGlzLl9iYWNrZW5kLmNvbXB1dGVGb250U2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCwgdGhpcy5fb3B0aW9ucyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVydCBhIERPTSBldmVudCAobW91c2Ugb3IgdG91Y2gpIHRvIG1hcCBjb29yZGluYXRlcy4gVXNlcyBmaXJzdCB0b3VjaCBmb3IgbXVsdGktdG91Y2guXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgZXZlbnRcclxuICogQHJldHVybnMge2ludFsyXX0gLTEgZm9yIHZhbHVlcyBvdXRzaWRlIG9mIHRoZSBjYW52YXNcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbihlKSB7XHJcblx0aWYgKGUudG91Y2hlcykge1xyXG5cdFx0dmFyIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuXHRcdHZhciB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciB4ID0gZS5jbGllbnRYO1xyXG5cdFx0dmFyIHkgPSBlLmNsaWVudFk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVjdCA9IHRoaXMuX2NvbnRleHQuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdHggLT0gcmVjdC5sZWZ0O1xyXG5cdHkgLT0gcmVjdC50b3A7XHJcblx0XHJcblx0eCAqPSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCAvIHRoaXMuX2NvbnRleHQuY2FudmFzLmNsaWVudFdpZHRoO1xyXG5cdHkgKj0gdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0IC8gdGhpcy5fY29udGV4dC5jYW52YXMuY2xpZW50SGVpZ2h0O1xyXG5cclxuXHRpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCB8fCB5ID49IHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCkgeyByZXR1cm4gWy0xLCAtMV07IH1cclxuXHJcblx0cmV0dXJuIHRoaXMuX2JhY2tlbmQuZXZlbnRUb1Bvc2l0aW9uKHgsIHkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7c3RyaW5nIHx8IHN0cmluZ1tdfSBjaCBPbmUgb3IgbW9yZSBjaGFycyAod2lsbCBiZSBvdmVybGFwcGluZyB0aGVtc2VsdmVzKVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW2ZnXSBmb3JlZ3JvdW5kIGNvbG9yXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYmddIGJhY2tncm91bmQgY29sb3JcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oeCwgeSwgY2gsIGZnLCBiZykge1xyXG5cdGlmICghZmcpIHsgZmcgPSB0aGlzLl9vcHRpb25zLmZnOyB9XHJcblx0aWYgKCFiZykgeyBiZyA9IHRoaXMuX29wdGlvbnMuYmc7IH1cclxuXHR0aGlzLl9kYXRhW3grXCIsXCIreV0gPSBbeCwgeSwgY2gsIGZnLCBiZ107XHJcblx0XHJcblx0aWYgKHRoaXMuX2RpcnR5ID09PSB0cnVlKSB7IHJldHVybjsgfSAvKiB3aWxsIGFscmVhZHkgcmVkcmF3IGV2ZXJ5dGhpbmcgKi9cclxuXHRpZiAoIXRoaXMuX2RpcnR5KSB7IHRoaXMuX2RpcnR5ID0ge307IH0gLyogZmlyc3QhICovXHJcblx0dGhpcy5fZGlydHlbeCtcIixcIit5XSA9IHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogRHJhd3MgYSB0ZXh0IGF0IGdpdmVuIHBvc2l0aW9uLiBPcHRpb25hbGx5IHdyYXBzIGF0IGEgbWF4aW11bSBsZW5ndGguIEN1cnJlbnRseSBkb2VzIG5vdCB3b3JrIHdpdGggaGV4IGxheW91dC5cclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgTWF5IGNvbnRhaW4gY29sb3IvYmFja2dyb3VuZCBmb3JtYXQgc3BlY2lmaWVycywgJWN7bmFtZX0vJWJ7bmFtZX0sIGJvdGggb3B0aW9uYWwuICVje30vJWJ7fSByZXNldHMgdG8gZGVmYXVsdC5cclxuICogQHBhcmFtIHtpbnR9IFttYXhXaWR0aF0gd3JhcCBhdCB3aGF0IHdpZHRoP1xyXG4gKiBAcmV0dXJucyB7aW50fSBsaW5lcyBkcmF3blxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmRyYXdUZXh0ID0gZnVuY3Rpb24oeCwgeSwgdGV4dCwgbWF4V2lkdGgpIHtcclxuXHR2YXIgZmcgPSBudWxsO1xyXG5cdHZhciBiZyA9IG51bGw7XHJcblx0dmFyIGN4ID0geDtcclxuXHR2YXIgY3kgPSB5O1xyXG5cdHZhciBsaW5lcyA9IDE7XHJcblx0aWYgKCFtYXhXaWR0aCkgeyBtYXhXaWR0aCA9IHRoaXMuX29wdGlvbnMud2lkdGgteDsgfVxyXG5cclxuXHR2YXIgdG9rZW5zID0gUk9ULlRleHQudG9rZW5pemUodGV4dCwgbWF4V2lkdGgpO1xyXG5cclxuXHR3aGlsZSAodG9rZW5zLmxlbmd0aCkgeyAvKiBpbnRlcnByZXQgdG9rZW5pemVkIG9wY29kZSBzdHJlYW0gKi9cclxuXHRcdHZhciB0b2tlbiA9IHRva2Vucy5zaGlmdCgpO1xyXG5cdFx0c3dpdGNoICh0b2tlbi50eXBlKSB7XHJcblx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9URVhUOlxyXG5cdFx0XHRcdHZhciBpc1NwYWNlID0gZmFsc2UsIGlzUHJldlNwYWNlID0gZmFsc2UsIGlzRnVsbFdpZHRoID0gZmFsc2UsIGlzUHJldkZ1bGxXaWR0aCA9IGZhbHNlO1xyXG5cdFx0XHRcdGZvciAodmFyIGk9MDtpPHRva2VuLnZhbHVlLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0XHRcdHZhciBjYyA9IHRva2VuLnZhbHVlLmNoYXJDb2RlQXQoaSk7XHJcblx0XHRcdFx0XHR2YXIgYyA9IHRva2VuLnZhbHVlLmNoYXJBdChpKTtcclxuXHRcdFx0XHRcdC8vIEFzc2lnbiB0byBgdHJ1ZWAgd2hlbiB0aGUgY3VycmVudCBjaGFyIGlzIGZ1bGwtd2lkdGguXHJcblx0XHRcdFx0XHRpc0Z1bGxXaWR0aCA9IChjYyA+IDB4ZmYwMCAmJiBjYyA8IDB4ZmY2MSkgfHwgKGNjID4gMHhmZmRjICYmIGNjIDwgMHhmZmU4KSB8fCBjYyA+IDB4ZmZlZTtcclxuXHRcdFx0XHRcdC8vIEN1cnJlbnQgY2hhciBpcyBzcGFjZSwgd2hhdGV2ZXIgZnVsbC13aWR0aCBvciBoYWxmLXdpZHRoIGJvdGggYXJlIE9LLlxyXG5cdFx0XHRcdFx0aXNTcGFjZSA9IChjLmNoYXJDb2RlQXQoMCkgPT0gMHgyMCB8fCBjLmNoYXJDb2RlQXQoMCkgPT0gMHgzMDAwKTtcclxuXHRcdFx0XHRcdC8vIFRoZSBwcmV2aW91cyBjaGFyIGlzIGZ1bGwtd2lkdGggYW5kXHJcblx0XHRcdFx0XHQvLyBjdXJyZW50IGNoYXIgaXMgbmV0aGVyIGhhbGYtd2lkdGggbm9yIGEgc3BhY2UuXHJcblx0XHRcdFx0XHRpZiAoaXNQcmV2RnVsbFdpZHRoICYmICFpc0Z1bGxXaWR0aCAmJiAhaXNTcGFjZSkgeyBjeCsrOyB9IC8vIGFkZCBhbiBleHRyYSBwb3NpdGlvblxyXG5cdFx0XHRcdFx0Ly8gVGhlIGN1cnJlbnQgY2hhciBpcyBmdWxsLXdpZHRoIGFuZFxyXG5cdFx0XHRcdFx0Ly8gdGhlIHByZXZpb3VzIGNoYXIgaXMgbm90IGEgc3BhY2UuXHJcblx0XHRcdFx0XHRpZihpc0Z1bGxXaWR0aCAmJiAhaXNQcmV2U3BhY2UpIHsgY3grKzsgfSAvLyBhZGQgYW4gZXh0cmEgcG9zaXRpb25cclxuXHRcdFx0XHRcdHRoaXMuZHJhdyhjeCsrLCBjeSwgYywgZmcsIGJnKTtcclxuXHRcdFx0XHRcdGlzUHJldlNwYWNlID0gaXNTcGFjZTtcclxuXHRcdFx0XHRcdGlzUHJldkZ1bGxXaWR0aCA9IGlzRnVsbFdpZHRoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfRkc6XHJcblx0XHRcdFx0ZmcgPSB0b2tlbi52YWx1ZSB8fCBudWxsO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9CRzpcclxuXHRcdFx0XHRiZyA9IHRva2VuLnZhbHVlIHx8IG51bGw7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX05FV0xJTkU6XHJcblx0XHRcdFx0Y3ggPSB4O1xyXG5cdFx0XHRcdGN5Kys7XHJcblx0XHRcdFx0bGluZXMrKztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbGluZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogVGltZXIgdGljazogdXBkYXRlIGRpcnR5IHBhcnRzXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuX3RpY2sgPSBmdW5jdGlvbigpIHtcclxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fdGljayk7XHJcblxyXG5cdGlmICghdGhpcy5fZGlydHkpIHsgcmV0dXJuOyB9XHJcblxyXG5cdGlmICh0aGlzLl9kaXJ0eSA9PT0gdHJ1ZSkgeyAvKiBkcmF3IGFsbCAqL1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLl9vcHRpb25zLmJnO1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcclxuXHJcblx0XHRmb3IgKHZhciBpZCBpbiB0aGlzLl9kYXRhKSB7IC8qIHJlZHJhdyBjYWNoZWQgZGF0YSAqL1xyXG5cdFx0XHR0aGlzLl9kcmF3KGlkLCBmYWxzZSk7XHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSB7IC8qIGRyYXcgb25seSBkaXJ0eSAqL1xyXG5cdFx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2RpcnR5KSB7XHJcblx0XHRcdHRoaXMuX2RyYXcoa2V5LCB0cnVlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuX2RpcnR5ID0gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBXaGF0IHRvIGRyYXdcclxuICogQHBhcmFtIHtib29sfSBjbGVhckJlZm9yZSBJcyBpdCBuZWNlc3NhcnkgdG8gY2xlYW4gYmVmb3JlP1xyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLl9kcmF3ID0gZnVuY3Rpb24oa2V5LCBjbGVhckJlZm9yZSkge1xyXG5cdHZhciBkYXRhID0gdGhpcy5fZGF0YVtrZXldO1xyXG5cdGlmIChkYXRhWzRdICE9IHRoaXMuX29wdGlvbnMuYmcpIHsgY2xlYXJCZWZvcmUgPSB0cnVlOyB9XHJcblxyXG5cdHRoaXMuX2JhY2tlbmQuZHJhdyhkYXRhLCBjbGVhckJlZm9yZSk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQWJzdHJhY3QgZGlzcGxheSBiYWNrZW5kIG1vZHVsZVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkuQmFja2VuZCA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHR0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUmVjdGFuZ3VsYXIgYmFja2VuZFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkuUmVjdCA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRST1QuRGlzcGxheS5CYWNrZW5kLmNhbGwodGhpcywgY29udGV4dCk7XHJcblx0XHJcblx0dGhpcy5fc3BhY2luZ1ggPSAwO1xyXG5cdHRoaXMuX3NwYWNpbmdZID0gMDtcclxuXHR0aGlzLl9jYW52YXNDYWNoZSA9IHt9O1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7fTtcclxufTtcclxuUk9ULkRpc3BsYXkuUmVjdC5leHRlbmQoUk9ULkRpc3BsYXkuQmFja2VuZCk7XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LmNhY2hlID0gZmFsc2U7XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHRoaXMuX2NhbnZhc0NhY2hlID0ge307XHJcblx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG5cdHZhciBjaGFyV2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xyXG5cdHRoaXMuX3NwYWNpbmdYID0gTWF0aC5jZWlsKG9wdGlvbnMuc3BhY2luZyAqIGNoYXJXaWR0aCk7XHJcblx0dGhpcy5fc3BhY2luZ1kgPSBNYXRoLmNlaWwob3B0aW9ucy5zcGFjaW5nICogb3B0aW9ucy5mb250U2l6ZSk7XHJcblxyXG5cdGlmICh0aGlzLl9vcHRpb25zLmZvcmNlU3F1YXJlUmF0aW8pIHtcclxuXHRcdHRoaXMuX3NwYWNpbmdYID0gdGhpcy5fc3BhY2luZ1kgPSBNYXRoLm1heCh0aGlzLl9zcGFjaW5nWCwgdGhpcy5fc3BhY2luZ1kpO1xyXG5cdH1cclxuXHJcblx0dGhpcy5fY29udGV4dC5jYW52YXMud2lkdGggPSBvcHRpb25zLndpZHRoICogdGhpcy5fc3BhY2luZ1g7XHJcblx0dGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgKiB0aGlzLl9zcGFjaW5nWTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG5cdGlmICh0aGlzLmNvbnN0cnVjdG9yLmNhY2hlKSB7XHJcblx0XHR0aGlzLl9kcmF3V2l0aENhY2hlKGRhdGEsIGNsZWFyQmVmb3JlKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhpcy5fZHJhd05vQ2FjaGUoZGF0YSwgY2xlYXJCZWZvcmUpO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLl9kcmF3V2l0aENhY2hlID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxuXHR2YXIgeCA9IGRhdGFbMF07XHJcblx0dmFyIHkgPSBkYXRhWzFdO1xyXG5cdHZhciBjaCA9IGRhdGFbMl07XHJcblx0dmFyIGZnID0gZGF0YVszXTtcclxuXHR2YXIgYmcgPSBkYXRhWzRdO1xyXG5cclxuXHR2YXIgaGFzaCA9IFwiXCIrY2grZmcrYmc7XHJcblx0aWYgKGhhc2ggaW4gdGhpcy5fY2FudmFzQ2FjaGUpIHtcclxuXHRcdHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXNDYWNoZVtoYXNoXTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGIgPSB0aGlzLl9vcHRpb25zLmJvcmRlcjtcclxuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG5cdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblx0XHRjYW52YXMud2lkdGggPSB0aGlzLl9zcGFjaW5nWDtcclxuXHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLl9zcGFjaW5nWTtcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBiZztcclxuXHRcdGN0eC5maWxsUmVjdChiLCBiLCBjYW52YXMud2lkdGgtYiwgY2FudmFzLmhlaWdodC1iKTtcclxuXHRcdFxyXG5cdFx0aWYgKGNoKSB7XHJcblx0XHRcdGN0eC5maWxsU3R5bGUgPSBmZztcclxuXHRcdFx0Y3R4LmZvbnQgPSB0aGlzLl9jb250ZXh0LmZvbnQ7XHJcblx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG5cdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuXHJcblx0XHRcdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XHJcblx0XHRcdGZvciAodmFyIGk9MDtpPGNoYXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0XHRjdHguZmlsbFRleHQoY2hhcnNbaV0sIHRoaXMuX3NwYWNpbmdYLzIsIE1hdGguY2VpbCh0aGlzLl9zcGFjaW5nWS8yKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMuX2NhbnZhc0NhY2hlW2hhc2hdID0gY2FudmFzO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLl9jb250ZXh0LmRyYXdJbWFnZShjYW52YXMsIHgqdGhpcy5fc3BhY2luZ1gsIHkqdGhpcy5fc3BhY2luZ1kpO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuX2RyYXdOb0NhY2hlID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxuXHR2YXIgeCA9IGRhdGFbMF07XHJcblx0dmFyIHkgPSBkYXRhWzFdO1xyXG5cdHZhciBjaCA9IGRhdGFbMl07XHJcblx0dmFyIGZnID0gZGF0YVszXTtcclxuXHR2YXIgYmcgPSBkYXRhWzRdO1xyXG5cclxuXHRpZiAoY2xlYXJCZWZvcmUpIHsgXHJcblx0XHR2YXIgYiA9IHRoaXMuX29wdGlvbnMuYm9yZGVyO1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBiZztcclxuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoeCp0aGlzLl9zcGFjaW5nWCArIGIsIHkqdGhpcy5fc3BhY2luZ1kgKyBiLCB0aGlzLl9zcGFjaW5nWCAtIGIsIHRoaXMuX3NwYWNpbmdZIC0gYik7XHJcblx0fVxyXG5cdFxyXG5cdGlmICghY2gpIHsgcmV0dXJuOyB9XHJcblxyXG5cdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gZmc7XHJcblxyXG5cdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XHJcblx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsVGV4dChjaGFyc1tpXSwgKHgrMC41KSAqIHRoaXMuX3NwYWNpbmdYLCBNYXRoLmNlaWwoKHkrMC41KSAqIHRoaXMuX3NwYWNpbmdZKSk7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX3NwYWNpbmdYKTtcclxuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX3NwYWNpbmdZKTtcclxuXHRyZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHR2YXIgYm94V2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLndpZHRoKTtcclxuXHR2YXIgYm94SGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0KTtcclxuXHJcblx0LyogY29tcHV0ZSBjaGFyIHJhdGlvICovXHJcblx0dmFyIG9sZEZvbnQgPSB0aGlzLl9jb250ZXh0LmZvbnQ7XHJcblx0dGhpcy5fY29udGV4dC5mb250ID0gXCIxMDBweCBcIiArIHRoaXMuX29wdGlvbnMuZm9udEZhbWlseTtcclxuXHR2YXIgd2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xyXG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IG9sZEZvbnQ7XHJcblx0dmFyIHJhdGlvID0gd2lkdGggLyAxMDA7XHJcblx0XHRcclxuXHR2YXIgd2lkdGhGcmFjdGlvbiA9IHJhdGlvICogYm94SGVpZ2h0IC8gYm94V2lkdGg7XHJcblx0aWYgKHdpZHRoRnJhY3Rpb24gPiAxKSB7IC8qIHRvbyB3aWRlIHdpdGggY3VycmVudCBhc3BlY3QgcmF0aW8gKi9cclxuXHRcdGJveEhlaWdodCA9IE1hdGguZmxvb3IoYm94SGVpZ2h0IC8gd2lkdGhGcmFjdGlvbik7XHJcblx0fVxyXG5cdHJldHVybiBNYXRoLmZsb29yKGJveEhlaWdodCAvIHRoaXMuX29wdGlvbnMuc3BhY2luZyk7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0cmV0dXJuIFtNYXRoLmZsb29yKHgvdGhpcy5fc3BhY2luZ1gpLCBNYXRoLmZsb29yKHkvdGhpcy5fc3BhY2luZ1kpXTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBIZXhhZ29uYWwgYmFja2VuZFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkuSGV4ID0gZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFJPVC5EaXNwbGF5LkJhY2tlbmQuY2FsbCh0aGlzLCBjb250ZXh0KTtcclxuXHJcblx0dGhpcy5fc3BhY2luZ1ggPSAwO1xyXG5cdHRoaXMuX3NwYWNpbmdZID0gMDtcclxuXHR0aGlzLl9oZXhTaXplID0gMDtcclxuXHR0aGlzLl9vcHRpb25zID0ge307XHJcbn07XHJcblJPVC5EaXNwbGF5LkhleC5leHRlbmQoUk9ULkRpc3BsYXkuQmFja2VuZCk7XHJcblxyXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG5cdC8qIEZJWE1FIGNoYXIgc2l6ZSBjb21wdXRhdGlvbiBkb2VzIG5vdCByZXNwZWN0IHRyYW5zcG9zZWQgaGV4ZXMgKi9cclxuXHR2YXIgY2hhcldpZHRoID0gTWF0aC5jZWlsKHRoaXMuX2NvbnRleHQubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcclxuXHR0aGlzLl9oZXhTaXplID0gTWF0aC5mbG9vcihvcHRpb25zLnNwYWNpbmcgKiAob3B0aW9ucy5mb250U2l6ZSArIGNoYXJXaWR0aC9NYXRoLnNxcnQoMykpIC8gMik7XHJcblx0dGhpcy5fc3BhY2luZ1ggPSB0aGlzLl9oZXhTaXplICogTWF0aC5zcXJ0KDMpIC8gMjtcclxuXHR0aGlzLl9zcGFjaW5nWSA9IHRoaXMuX2hleFNpemUgKiAxLjU7XHJcblxyXG5cdGlmIChvcHRpb25zLnRyYW5zcG9zZSkge1xyXG5cdFx0dmFyIHhwcm9wID0gXCJoZWlnaHRcIjtcclxuXHRcdHZhciB5cHJvcCA9IFwid2lkdGhcIjtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIHhwcm9wID0gXCJ3aWR0aFwiO1xyXG5cdFx0dmFyIHlwcm9wID0gXCJoZWlnaHRcIjtcclxuXHR9XHJcblx0dGhpcy5fY29udGV4dC5jYW52YXNbeHByb3BdID0gTWF0aC5jZWlsKCAob3B0aW9ucy53aWR0aCArIDEpICogdGhpcy5fc3BhY2luZ1ggKTtcclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhc1t5cHJvcF0gPSBNYXRoLmNlaWwoIChvcHRpb25zLmhlaWdodCAtIDEpICogdGhpcy5fc3BhY2luZ1kgKyAyKnRoaXMuX2hleFNpemUgKTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XHJcblx0dmFyIHggPSBkYXRhWzBdO1xyXG5cdHZhciB5ID0gZGF0YVsxXTtcclxuXHR2YXIgY2ggPSBkYXRhWzJdO1xyXG5cdHZhciBmZyA9IGRhdGFbM107XHJcblx0dmFyIGJnID0gZGF0YVs0XTtcclxuXHJcblx0dmFyIHB4ID0gW1xyXG5cdFx0KHgrMSkgKiB0aGlzLl9zcGFjaW5nWCxcclxuXHRcdHkgKiB0aGlzLl9zcGFjaW5nWSArIHRoaXMuX2hleFNpemVcclxuXHRdO1xyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkgeyBweC5yZXZlcnNlKCk7IH1cclxuXHJcblx0aWYgKGNsZWFyQmVmb3JlKSB7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xyXG5cdFx0dGhpcy5fZmlsbChweFswXSwgcHhbMV0pO1xyXG5cdH1cclxuXHJcblx0aWYgKCFjaCkgeyByZXR1cm47IH1cclxuXHJcblx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBmZztcclxuXHJcblx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcclxuXHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxUZXh0KGNoYXJzW2ldLCBweFswXSwgTWF0aC5jZWlsKHB4WzFdKSk7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHRhdmFpbFdpZHRoICs9IGF2YWlsSGVpZ2h0O1xyXG5cdFx0YXZhaWxIZWlnaHQgPSBhdmFpbFdpZHRoIC0gYXZhaWxIZWlnaHQ7XHJcblx0XHRhdmFpbFdpZHRoIC09IGF2YWlsSGVpZ2h0O1xyXG5cdH1cclxuXHJcblx0dmFyIHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fc3BhY2luZ1gpIC0gMTtcclxuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcigoYXZhaWxIZWlnaHQgLSAyKnRoaXMuX2hleFNpemUpIC8gdGhpcy5fc3BhY2luZ1kgKyAxKTtcclxuXHRyZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkge1xyXG5cdFx0YXZhaWxXaWR0aCArPSBhdmFpbEhlaWdodDtcclxuXHRcdGF2YWlsSGVpZ2h0ID0gYXZhaWxXaWR0aCAtIGF2YWlsSGVpZ2h0O1xyXG5cdFx0YXZhaWxXaWR0aCAtPSBhdmFpbEhlaWdodDtcclxuXHR9XHJcblxyXG5cdHZhciBoZXhTaXplV2lkdGggPSAyKmF2YWlsV2lkdGggLyAoKHRoaXMuX29wdGlvbnMud2lkdGgrMSkgKiBNYXRoLnNxcnQoMykpIC0gMTtcclxuXHR2YXIgaGV4U2l6ZUhlaWdodCA9IGF2YWlsSGVpZ2h0IC8gKDIgKyAxLjUqKHRoaXMuX29wdGlvbnMuaGVpZ2h0LTEpKTtcclxuXHR2YXIgaGV4U2l6ZSA9IE1hdGgubWluKGhleFNpemVXaWR0aCwgaGV4U2l6ZUhlaWdodCk7XHJcblxyXG5cdC8qIGNvbXB1dGUgY2hhciByYXRpbyAqL1xyXG5cdHZhciBvbGRGb250ID0gdGhpcy5fY29udGV4dC5mb250O1xyXG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IFwiMTAwcHggXCIgKyB0aGlzLl9vcHRpb25zLmZvbnRGYW1pbHk7XHJcblx0dmFyIHdpZHRoID0gTWF0aC5jZWlsKHRoaXMuX2NvbnRleHQubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcclxuXHR0aGlzLl9jb250ZXh0LmZvbnQgPSBvbGRGb250O1xyXG5cdHZhciByYXRpbyA9IHdpZHRoIC8gMTAwO1xyXG5cclxuXHRoZXhTaXplID0gTWF0aC5mbG9vcihoZXhTaXplKSsxOyAvKiBjbG9zZXN0IGxhcmdlciBoZXhTaXplICovXHJcblxyXG5cdC8qIEZJWE1FIGNoYXIgc2l6ZSBjb21wdXRhdGlvbiBkb2VzIG5vdCByZXNwZWN0IHRyYW5zcG9zZWQgaGV4ZXMgKi9cclxuXHR2YXIgZm9udFNpemUgPSAyKmhleFNpemUgLyAodGhpcy5fb3B0aW9ucy5zcGFjaW5nICogKDEgKyByYXRpbyAvIE1hdGguc3FydCgzKSkpO1xyXG5cclxuXHQvKiBjbG9zZXN0IHNtYWxsZXIgZm9udFNpemUgKi9cclxuXHRyZXR1cm4gTWF0aC5jZWlsKGZvbnRTaXplKS0xO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHR4ICs9IHk7XHJcblx0XHR5ID0geC15O1xyXG5cdFx0eCAtPSB5O1xyXG5cdFx0dmFyIG5vZGVTaXplID0gdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGg7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBub2RlU2l6ZSA9IHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodDtcclxuXHR9XHJcblx0dmFyIHNpemUgPSBub2RlU2l6ZSAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0O1xyXG5cdHkgPSBNYXRoLmZsb29yKHkvc2l6ZSk7XHJcblxyXG5cdGlmICh5Lm1vZCgyKSkgeyAvKiBvZGQgcm93ICovXHJcblx0XHR4IC09IHRoaXMuX3NwYWNpbmdYO1xyXG5cdFx0eCA9IDEgKyAyKk1hdGguZmxvb3IoeC8oMip0aGlzLl9zcGFjaW5nWCkpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR4ID0gMipNYXRoLmZsb29yKHgvKDIqdGhpcy5fc3BhY2luZ1gpKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBbeCwgeV07XHJcbn07XHJcblxyXG4vKipcclxuICogQXJndW1lbnRzIGFyZSBwaXhlbCB2YWx1ZXMuIElmIFwidHJhbnNwb3NlZFwiIG1vZGUgaXMgZW5hYmxlZCwgdGhlbiB0aGVzZSB0d28gYXJlIGFscmVhZHkgc3dhcHBlZC5cclxuICovXHJcblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuX2ZpbGwgPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHR2YXIgYSA9IHRoaXMuX2hleFNpemU7XHJcblx0dmFyIGIgPSB0aGlzLl9vcHRpb25zLmJvcmRlcjtcclxuXHJcblx0dGhpcy5fY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHR0aGlzLl9jb250ZXh0Lm1vdmVUbyhjeC1hK2IsXHRjeSk7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC1hLzIrYixcdGN5K3RoaXMuX3NwYWNpbmdYLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grYS8yLWIsXHRjeSt0aGlzLl9zcGFjaW5nWC1iKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K2EtYixcdGN5KTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K2EvMi1iLFx0Y3ktdGhpcy5fc3BhY2luZ1grYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC1hLzIrYixcdGN5LXRoaXMuX3NwYWNpbmdYK2IpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gtYStiLFx0Y3kpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aGlzLl9jb250ZXh0Lm1vdmVUbyhjeCxcdFx0XHRcdFx0Y3ktYStiKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K3RoaXMuX3NwYWNpbmdYLWIsXHRjeS1hLzIrYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCt0aGlzLl9zcGFjaW5nWC1iLFx0Y3krYS8yLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gsXHRcdFx0XHRcdGN5K2EtYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC10aGlzLl9zcGFjaW5nWCtiLFx0Y3krYS8yLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gtdGhpcy5fc3BhY2luZ1grYixcdGN5LWEvMitiKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LFx0XHRcdFx0XHRjeS1hK2IpO1xyXG5cdH1cclxuXHR0aGlzLl9jb250ZXh0LmZpbGwoKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBUaWxlIGJhY2tlbmRcclxuICogQHByaXZhdGVcclxuICovXHJcblJPVC5EaXNwbGF5LlRpbGUgPSBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0Uk9ULkRpc3BsYXkuUmVjdC5jYWxsKHRoaXMsIGNvbnRleHQpO1xyXG5cdFxyXG5cdHRoaXMuX29wdGlvbnMgPSB7fTtcclxuXHR0aGlzLl9jb2xvckNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbn07XHJcblJPVC5EaXNwbGF5LlRpbGUuZXh0ZW5kKFJPVC5EaXNwbGF5LlJlY3QpO1xyXG5cclxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCA9IG9wdGlvbnMud2lkdGggKiBvcHRpb25zLnRpbGVXaWR0aDtcclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCAqIG9wdGlvbnMudGlsZUhlaWdodDtcclxuXHR0aGlzLl9jb2xvckNhbnZhcy53aWR0aCA9IG9wdGlvbnMudGlsZVdpZHRoO1xyXG5cdHRoaXMuX2NvbG9yQ2FudmFzLmhlaWdodCA9IG9wdGlvbnMudGlsZUhlaWdodDtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG5cdHZhciB4ID0gZGF0YVswXTtcclxuXHR2YXIgeSA9IGRhdGFbMV07XHJcblx0dmFyIGNoID0gZGF0YVsyXTtcclxuXHR2YXIgZmcgPSBkYXRhWzNdO1xyXG5cdHZhciBiZyA9IGRhdGFbNF07XHJcblxyXG5cdHZhciB0aWxlV2lkdGggPSB0aGlzLl9vcHRpb25zLnRpbGVXaWR0aDtcclxuXHR2YXIgdGlsZUhlaWdodCA9IHRoaXMuX29wdGlvbnMudGlsZUhlaWdodDtcclxuXHJcblx0aWYgKGNsZWFyQmVmb3JlKSB7XHJcblx0XHRpZiAodGhpcy5fb3B0aW9ucy50aWxlQ29sb3JpemUpIHtcclxuXHRcdFx0dGhpcy5fY29udGV4dC5jbGVhclJlY3QoeCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gYmc7XHJcblx0XHRcdHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoeCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmICghY2gpIHsgcmV0dXJuOyB9XHJcblxyXG5cdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XHJcblx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHRpbGUgPSB0aGlzLl9vcHRpb25zLnRpbGVNYXBbY2hhcnNbaV1dO1xyXG5cdFx0aWYgKCF0aWxlKSB7IHRocm93IG5ldyBFcnJvcihcIkNoYXIgJ1wiICsgY2hhcnNbaV0gKyBcIicgbm90IGZvdW5kIGluIHRpbGVNYXBcIik7IH1cclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuX29wdGlvbnMudGlsZUNvbG9yaXplKSB7IC8qIGFwcGx5IGNvbG9yaXphdGlvbiAqL1xyXG5cdFx0XHR2YXIgY2FudmFzID0gdGhpcy5fY29sb3JDYW52YXM7XHJcblx0XHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHRcdFx0Y29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHJcblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKFxyXG5cdFx0XHRcdHRoaXMuX29wdGlvbnMudGlsZVNldCxcclxuXHRcdFx0XHR0aWxlWzBdLCB0aWxlWzFdLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsXHJcblx0XHRcdFx0MCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRpZiAoZmcgIT0gXCJ0cmFuc3BhcmVudFwiKSB7XHJcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBmZztcclxuXHRcdFx0XHRjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwic291cmNlLWF0b3BcIjtcclxuXHRcdFx0XHRjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChiZyAhPSBcInRyYW5zcGFyZW50XCIpIHtcclxuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xyXG5cdFx0XHRcdGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJkZXN0aW5hdGlvbi1vdmVyXCI7XHJcblx0XHRcdFx0Y29udGV4dC5maWxsUmVjdCgwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9jb250ZXh0LmRyYXdJbWFnZShjYW52YXMsIHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XHJcblxyXG5cdFx0fSBlbHNlIHsgLyogbm8gY29sb3JpemluZywgZWFzeSAqL1xyXG5cdFx0XHR0aGlzLl9jb250ZXh0LmRyYXdJbWFnZShcclxuXHRcdFx0XHR0aGlzLl9vcHRpb25zLnRpbGVTZXQsXHJcblx0XHRcdFx0dGlsZVswXSwgdGlsZVsxXSwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LFxyXG5cdFx0XHRcdHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHR2YXIgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLnRpbGVXaWR0aCk7XHJcblx0dmFyIGhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9vcHRpb25zLnRpbGVIZWlnaHQpO1xyXG5cdHJldHVybiBbd2lkdGgsIGhlaWdodF07XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX29wdGlvbnMud2lkdGgpO1xyXG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy5oZWlnaHQpO1xyXG5cdHJldHVybiBbd2lkdGgsIGhlaWdodF07XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0cmV0dXJuIFtNYXRoLmZsb29yKHgvdGhpcy5fb3B0aW9ucy50aWxlV2lkdGgpLCBNYXRoLmZsb29yKHkvdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0KV07XHJcbn07XHJcbi8qKlxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqIFRoaXMgY29kZSBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiBBbGVhIGFsZ29yaXRobTsgKEMpIDIwMTAgSm9oYW5uZXMgQmFhZ8O4ZS5cclxuICogQWxlYSBpcyBsaWNlbnNlZCBhY2NvcmRpbmcgdG8gdGhlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UuXHJcbiAqL1xyXG5ST1QuUk5HID0ge1xyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFxyXG5cdCAqL1xyXG5cdGdldFNlZWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NlZWQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNlZWQgU2VlZCB0aGUgbnVtYmVyIGdlbmVyYXRvclxyXG5cdCAqL1xyXG5cdHNldFNlZWQ6IGZ1bmN0aW9uKHNlZWQpIHtcclxuXHRcdHNlZWQgPSAoc2VlZCA8IDEgPyAxL3NlZWQgOiBzZWVkKTtcclxuXHJcblx0XHR0aGlzLl9zZWVkID0gc2VlZDtcclxuXHRcdHRoaXMuX3MwID0gKHNlZWQgPj4+IDApICogdGhpcy5fZnJhYztcclxuXHJcblx0XHRzZWVkID0gKHNlZWQqNjkwNjkgKyAxKSA+Pj4gMDtcclxuXHRcdHRoaXMuX3MxID0gc2VlZCAqIHRoaXMuX2ZyYWM7XHJcblxyXG5cdFx0c2VlZCA9IChzZWVkKjY5MDY5ICsgMSkgPj4+IDA7XHJcblx0XHR0aGlzLl9zMiA9IHNlZWQgKiB0aGlzLl9mcmFjO1xyXG5cclxuXHRcdHRoaXMuX2MgPSAxO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQHJldHVybnMge2Zsb2F0fSBQc2V1ZG9yYW5kb20gdmFsdWUgWzAsMSksIHVuaWZvcm1seSBkaXN0cmlidXRlZFxyXG5cdCAqL1xyXG5cdGdldFVuaWZvcm06IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHQgPSAyMDkxNjM5ICogdGhpcy5fczAgKyB0aGlzLl9jICogdGhpcy5fZnJhYztcclxuXHRcdHRoaXMuX3MwID0gdGhpcy5fczE7XHJcblx0XHR0aGlzLl9zMSA9IHRoaXMuX3MyO1xyXG5cdFx0dGhpcy5fYyA9IHQgfCAwO1xyXG5cdFx0dGhpcy5fczIgPSB0IC0gdGhpcy5fYztcclxuXHRcdHJldHVybiB0aGlzLl9zMjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBAcGFyYW0ge2ludH0gbG93ZXJCb3VuZCBUaGUgbG93ZXIgZW5kIG9mIHRoZSByYW5nZSB0byByZXR1cm4gYSB2YWx1ZSBmcm9tLCBpbmNsdXNpdmVcclxuXHQgKiBAcGFyYW0ge2ludH0gdXBwZXJCb3VuZCBUaGUgdXBwZXIgZW5kIG9mIHRoZSByYW5nZSB0byByZXR1cm4gYSB2YWx1ZSBmcm9tLCBpbmNsdXNpdmVcclxuXHQgKiBAcmV0dXJucyB7aW50fSBQc2V1ZG9yYW5kb20gdmFsdWUgW2xvd2VyQm91bmQsIHVwcGVyQm91bmRdLCB1c2luZyBST1QuUk5HLmdldFVuaWZvcm0oKSB0byBkaXN0cmlidXRlIHRoZSB2YWx1ZVxyXG5cdCAqL1xyXG5cdGdldFVuaWZvcm1JbnQ6IGZ1bmN0aW9uKGxvd2VyQm91bmQsIHVwcGVyQm91bmQpIHtcclxuXHRcdHZhciBtYXggPSBNYXRoLm1heChsb3dlckJvdW5kLCB1cHBlckJvdW5kKTtcclxuXHRcdHZhciBtaW4gPSBNYXRoLm1pbihsb3dlckJvdW5kLCB1cHBlckJvdW5kKTtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2V0VW5pZm9ybSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbbWVhbj0wXSBNZWFuIHZhbHVlXHJcblx0ICogQHBhcmFtIHtmbG9hdH0gW3N0ZGRldj0xXSBTdGFuZGFyZCBkZXZpYXRpb24uIH45NSUgb2YgdGhlIGFic29sdXRlIHZhbHVlcyB3aWxsIGJlIGxvd2VyIHRoYW4gMipzdGRkZXYuXHJcblx0ICogQHJldHVybnMge2Zsb2F0fSBBIG5vcm1hbGx5IGRpc3RyaWJ1dGVkIHBzZXVkb3JhbmRvbSB2YWx1ZVxyXG5cdCAqL1xyXG5cdGdldE5vcm1hbDogZnVuY3Rpb24obWVhbiwgc3RkZGV2KSB7XHJcblx0XHRkbyB7XHJcblx0XHRcdHZhciB1ID0gMip0aGlzLmdldFVuaWZvcm0oKS0xO1xyXG5cdFx0XHR2YXIgdiA9IDIqdGhpcy5nZXRVbmlmb3JtKCktMTtcclxuXHRcdFx0dmFyIHIgPSB1KnUgKyB2KnY7XHJcblx0XHR9IHdoaWxlIChyID4gMSB8fCByID09IDApO1xyXG5cclxuXHRcdHZhciBnYXVzcyA9IHUgKiBNYXRoLnNxcnQoLTIqTWF0aC5sb2cocikvcik7XHJcblx0XHRyZXR1cm4gKG1lYW4gfHwgMCkgKyBnYXVzcyooc3RkZGV2IHx8IDEpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm5zIHtpbnR9IFBzZXVkb3JhbmRvbSB2YWx1ZSBbMSwxMDBdIGluY2x1c2l2ZSwgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkXHJcblx0ICovXHJcblx0Z2V0UGVyY2VudGFnZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gMSArIE1hdGguZmxvb3IodGhpcy5nZXRVbmlmb3JtKCkqMTAwKTtcclxuXHR9LFxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIGtleT13aGF0ZXZlciwgdmFsdWU9d2VpZ2h0IChyZWxhdGl2ZSBwcm9iYWJpbGl0eSlcclxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSB3aGF0ZXZlclxyXG5cdCAqL1xyXG5cdGdldFdlaWdodGVkVmFsdWU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdHZhciB0b3RhbCA9IDA7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGlkIGluIGRhdGEpIHtcclxuXHRcdFx0dG90YWwgKz0gZGF0YVtpZF07XHJcblx0XHR9XHJcblx0XHR2YXIgcmFuZG9tID0gdGhpcy5nZXRVbmlmb3JtKCkqdG90YWw7XHJcblx0XHRcclxuXHRcdHZhciBwYXJ0ID0gMDtcclxuXHRcdGZvciAodmFyIGlkIGluIGRhdGEpIHtcclxuXHRcdFx0cGFydCArPSBkYXRhW2lkXTtcclxuXHRcdFx0aWYgKHJhbmRvbSA8IHBhcnQpIHsgcmV0dXJuIGlkOyB9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWYgYnkgc29tZSBmbG9hdGluZy1wb2ludCBhbm5veWFuY2Ugd2UgaGF2ZVxyXG5cdFx0Ly8gcmFuZG9tID49IHRvdGFsLCBqdXN0IHJldHVybiB0aGUgbGFzdCBpZC5cclxuXHRcdHJldHVybiBpZDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBHZXQgUk5HIHN0YXRlLiBVc2VmdWwgZm9yIHN0b3JpbmcgdGhlIHN0YXRlIGFuZCByZS1zZXR0aW5nIGl0IHZpYSBzZXRTdGF0ZS5cclxuXHQgKiBAcmV0dXJucyB7P30gSW50ZXJuYWwgc3RhdGVcclxuXHQgKi9cclxuXHRnZXRTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gW3RoaXMuX3MwLCB0aGlzLl9zMSwgdGhpcy5fczIsIHRoaXMuX2NdO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIFNldCBhIHByZXZpb3VzbHkgcmV0cmlldmVkIHN0YXRlLlxyXG5cdCAqIEBwYXJhbSB7P30gc3RhdGVcclxuXHQgKi9cclxuXHRzZXRTdGF0ZTogZnVuY3Rpb24oc3RhdGUpIHtcclxuXHRcdHRoaXMuX3MwID0gc3RhdGVbMF07XHJcblx0XHR0aGlzLl9zMSA9IHN0YXRlWzFdO1xyXG5cdFx0dGhpcy5fczIgPSBzdGF0ZVsyXTtcclxuXHRcdHRoaXMuX2MgID0gc3RhdGVbM107XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIGEgY2xvbmVkIFJOR1xyXG5cdCAqL1xyXG5cdGNsb25lOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBjbG9uZSA9IE9iamVjdC5jcmVhdGUodGhpcyk7XHJcblx0XHRjbG9uZS5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlKCkpO1xyXG5cdFx0cmV0dXJuIGNsb25lO1xyXG5cdH0sXHJcblxyXG5cdF9zMDogMCxcclxuXHRfczE6IDAsXHJcblx0X3MyOiAwLFxyXG5cdF9jOiAwLFxyXG5cdF9mcmFjOiAyLjMyODMwNjQzNjUzODY5NjNlLTEwIC8qIDJeLTMyICovXHJcbn07XHJcblxyXG5ST1QuUk5HLnNldFNlZWQoRGF0ZS5ub3coKSk7XHJcbi8qKlxyXG4gKiBAY2xhc3MgKE1hcmtvdiBwcm9jZXNzKS1iYXNlZCBzdHJpbmcgZ2VuZXJhdG9yLiBcclxuICogQ29waWVkIGZyb20gYSA8YSBocmVmPVwiaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9TmFtZXNfZnJvbV9hX2hpZ2hfb3JkZXJfTWFya292X1Byb2Nlc3NfYW5kX2Ffc2ltcGxpZmllZF9LYXR6X2JhY2stb2ZmX3NjaGVtZVwiPlJvZ3VlQmFzaW4gYXJ0aWNsZTwvYT4uIFxyXG4gKiBPZmZlcnMgY29uZmlndXJhYmxlIG9yZGVyIGFuZCBwcmlvci5cclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2Jvb2x9IFtvcHRpb25zLndvcmRzPWZhbHNlXSBVc2Ugd29yZCBtb2RlP1xyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMub3JkZXI9M11cclxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMucHJpb3I9MC4wMDFdXHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHR3b3JkczogZmFsc2UsXHJcblx0XHRvcmRlcjogMyxcclxuXHRcdHByaW9yOiAwLjAwMVxyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblxyXG5cdHRoaXMuX2JvdW5kYXJ5ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgwKTtcclxuXHR0aGlzLl9zdWZmaXggPSB0aGlzLl9ib3VuZGFyeTtcclxuXHR0aGlzLl9wcmVmaXggPSBbXTtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9vcHRpb25zLm9yZGVyO2krKykgeyB0aGlzLl9wcmVmaXgucHVzaCh0aGlzLl9ib3VuZGFyeSk7IH1cclxuXHJcblx0dGhpcy5fcHJpb3JWYWx1ZXMgPSB7fTtcclxuXHR0aGlzLl9wcmlvclZhbHVlc1t0aGlzLl9ib3VuZGFyeV0gPSB0aGlzLl9vcHRpb25zLnByaW9yO1xyXG5cclxuXHR0aGlzLl9kYXRhID0ge307XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGFsbCBsZWFybmluZyBkYXRhXHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2RhdGEgPSB7fTtcclxuXHR0aGlzLl9wcmlvclZhbHVlcyA9IHt9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEdlbmVyYXRlZCBzdHJpbmdcclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHJlc3VsdCA9IFt0aGlzLl9zYW1wbGUodGhpcy5fcHJlZml4KV07XHJcblx0d2hpbGUgKHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdICE9IHRoaXMuX2JvdW5kYXJ5KSB7XHJcblx0XHRyZXN1bHQucHVzaCh0aGlzLl9zYW1wbGUocmVzdWx0KSk7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzLl9qb2luKHJlc3VsdC5zbGljZSgwLCAtMSkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE9ic2VydmUgKGxlYXJuKSBhIHN0cmluZyBmcm9tIGEgdHJhaW5pbmcgc2V0XHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24oc3RyaW5nKSB7XHJcblx0dmFyIHRva2VucyA9IHRoaXMuX3NwbGl0KHN0cmluZyk7XHJcblxyXG5cdGZvciAodmFyIGk9MDsgaTx0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHRoaXMuX3ByaW9yVmFsdWVzW3Rva2Vuc1tpXV0gPSB0aGlzLl9vcHRpb25zLnByaW9yO1xyXG5cdH1cclxuXHJcblx0dG9rZW5zID0gdGhpcy5fcHJlZml4LmNvbmNhdCh0b2tlbnMpLmNvbmNhdCh0aGlzLl9zdWZmaXgpOyAvKiBhZGQgYm91bmRhcnkgc3ltYm9scyAqL1xyXG5cclxuXHRmb3IgKHZhciBpPXRoaXMuX29wdGlvbnMub3JkZXI7IGk8dG9rZW5zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgY29udGV4dCA9IHRva2Vucy5zbGljZShpLXRoaXMuX29wdGlvbnMub3JkZXIsIGkpO1xyXG5cdFx0dmFyIGV2ZW50ID0gdG9rZW5zW2ldO1xyXG5cdFx0Zm9yICh2YXIgaj0wOyBqPGNvbnRleHQubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0dmFyIHN1YmNvbnRleHQgPSBjb250ZXh0LnNsaWNlKGopO1xyXG5cdFx0XHR0aGlzLl9vYnNlcnZlRXZlbnQoc3ViY29udGV4dCwgZXZlbnQpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLmdldFN0YXRzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHBhcnRzID0gW107XHJcblxyXG5cdHZhciBwcmlvckNvdW50ID0gMDtcclxuXHRmb3IgKHZhciBwIGluIHRoaXMuX3ByaW9yVmFsdWVzKSB7IHByaW9yQ291bnQrKzsgfVxyXG5cdHByaW9yQ291bnQtLTsgLyogYm91bmRhcnkgKi9cclxuXHRwYXJ0cy5wdXNoKFwiZGlzdGluY3Qgc2FtcGxlczogXCIgKyBwcmlvckNvdW50KTtcclxuXHJcblx0dmFyIGRhdGFDb3VudCA9IDA7XHJcblx0dmFyIGV2ZW50Q291bnQgPSAwO1xyXG5cdGZvciAodmFyIHAgaW4gdGhpcy5fZGF0YSkgeyBcclxuXHRcdGRhdGFDb3VudCsrOyBcclxuXHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl9kYXRhW3BdKSB7XHJcblx0XHRcdGV2ZW50Q291bnQrKztcclxuXHRcdH1cclxuXHR9XHJcblx0cGFydHMucHVzaChcImRpY3Rpb25hcnkgc2l6ZSAoY29udGV4dHMpOiBcIiArIGRhdGFDb3VudCk7XHJcblx0cGFydHMucHVzaChcImRpY3Rpb25hcnkgc2l6ZSAoZXZlbnRzKTogXCIgKyBldmVudENvdW50KTtcclxuXHJcblx0cmV0dXJuIHBhcnRzLmpvaW4oXCIsIFwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ31cclxuICogQHJldHVybnMge3N0cmluZ1tdfVxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuX3NwbGl0ID0gZnVuY3Rpb24oc3RyKSB7XHJcblx0cmV0dXJuIHN0ci5zcGxpdCh0aGlzLl9vcHRpb25zLndvcmRzID8gL1xccysvIDogXCJcIik7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmdbXX1cclxuICogQHJldHVybnMge3N0cmluZ30gXHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fam9pbiA9IGZ1bmN0aW9uKGFycikge1xyXG5cdHJldHVybiBhcnIuam9pbih0aGlzLl9vcHRpb25zLndvcmRzID8gXCIgXCIgOiBcIlwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBjb250ZXh0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuX29ic2VydmVFdmVudCA9IGZ1bmN0aW9uKGNvbnRleHQsIGV2ZW50KSB7XHJcblx0dmFyIGtleSA9IHRoaXMuX2pvaW4oY29udGV4dCk7XHJcblx0aWYgKCEoa2V5IGluIHRoaXMuX2RhdGEpKSB7IHRoaXMuX2RhdGFba2V5XSA9IHt9OyB9XHJcblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XHJcblxyXG5cdGlmICghKGV2ZW50IGluIGRhdGEpKSB7IGRhdGFbZXZlbnRdID0gMDsgfVxyXG5cdGRhdGFbZXZlbnRdKys7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmdbXX1cclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9zYW1wbGUgPSBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0Y29udGV4dCA9IHRoaXMuX2JhY2tvZmYoY29udGV4dCk7XHJcblx0dmFyIGtleSA9IHRoaXMuX2pvaW4oY29udGV4dCk7XHJcblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XHJcblxyXG5cdHZhciBhdmFpbGFibGUgPSB7fTtcclxuXHJcblx0aWYgKHRoaXMuX29wdGlvbnMucHJpb3IpIHtcclxuXHRcdGZvciAodmFyIGV2ZW50IGluIHRoaXMuX3ByaW9yVmFsdWVzKSB7IGF2YWlsYWJsZVtldmVudF0gPSB0aGlzLl9wcmlvclZhbHVlc1tldmVudF07IH1cclxuXHRcdGZvciAodmFyIGV2ZW50IGluIGRhdGEpIHsgYXZhaWxhYmxlW2V2ZW50XSArPSBkYXRhW2V2ZW50XTsgfVxyXG5cdH0gZWxzZSB7IFxyXG5cdFx0YXZhaWxhYmxlID0gZGF0YTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBST1QuUk5HLmdldFdlaWdodGVkVmFsdWUoYXZhaWxhYmxlKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nW119XHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fYmFja29mZiA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRpZiAoY29udGV4dC5sZW5ndGggPiB0aGlzLl9vcHRpb25zLm9yZGVyKSB7XHJcblx0XHRjb250ZXh0ID0gY29udGV4dC5zbGljZSgtdGhpcy5fb3B0aW9ucy5vcmRlcik7XHJcblx0fSBlbHNlIGlmIChjb250ZXh0Lmxlbmd0aCA8IHRoaXMuX29wdGlvbnMub3JkZXIpIHtcclxuXHRcdGNvbnRleHQgPSB0aGlzLl9wcmVmaXguc2xpY2UoMCwgdGhpcy5fb3B0aW9ucy5vcmRlciAtIGNvbnRleHQubGVuZ3RoKS5jb25jYXQoY29udGV4dCk7XHJcblx0fVxyXG5cclxuXHR3aGlsZSAoISh0aGlzLl9qb2luKGNvbnRleHQpIGluIHRoaXMuX2RhdGEpICYmIGNvbnRleHQubGVuZ3RoID4gMCkgeyBjb250ZXh0ID0gY29udGV4dC5zbGljZSgxKTsgfVxyXG5cclxuXHRyZXR1cm4gY29udGV4dDtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBHZW5lcmljIGV2ZW50IHF1ZXVlOiBzdG9yZXMgZXZlbnRzIGFuZCByZXRyaWV2ZXMgdGhlbSBiYXNlZCBvbiB0aGVpciB0aW1lXHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX3RpbWUgPSAwO1xyXG5cdHRoaXMuX2V2ZW50cyA9IFtdO1xyXG5cdHRoaXMuX2V2ZW50VGltZXMgPSBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBFbGFwc2VkIHRpbWVcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5nZXRUaW1lID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3RpbWU7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xlYXIgYWxsIHNjaGVkdWxlZCBldmVudHNcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2V2ZW50cyA9IFtdO1xyXG5cdHRoaXMuX2V2ZW50VGltZXMgPSBbXTtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gez99IGV2ZW50XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lXHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oZXZlbnQsIHRpbWUpIHtcclxuXHR2YXIgaW5kZXggPSB0aGlzLl9ldmVudHMubGVuZ3RoO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX2V2ZW50VGltZXMubGVuZ3RoO2krKykge1xyXG5cdFx0aWYgKHRoaXMuX2V2ZW50VGltZXNbaV0gPiB0aW1lKSB7XHJcblx0XHRcdGluZGV4ID0gaTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aGlzLl9ldmVudHMuc3BsaWNlKGluZGV4LCAwLCBldmVudCk7XHJcblx0dGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoaW5kZXgsIDAsIHRpbWUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIExvY2F0ZXMgdGhlIG5lYXJlc3QgZXZlbnQsIGFkdmFuY2VzIHRpbWUgaWYgbmVjZXNzYXJ5LiBSZXR1cm5zIHRoYXQgZXZlbnQgYW5kIHJlbW92ZXMgaXQgZnJvbSB0aGUgcXVldWUuXHJcbiAqIEByZXR1cm5zIHs/IHx8IG51bGx9IFRoZSBldmVudCBwcmV2aW91c2x5IGFkZGVkIGJ5IGFkZEV2ZW50LCBudWxsIGlmIG5vIGV2ZW50IGF2YWlsYWJsZVxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCkge1xyXG5cdGlmICghdGhpcy5fZXZlbnRzLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfVxyXG5cclxuXHR2YXIgdGltZSA9IHRoaXMuX2V2ZW50VGltZXMuc3BsaWNlKDAsIDEpWzBdO1xyXG5cdGlmICh0aW1lID4gMCkgeyAvKiBhZHZhbmNlICovXHJcblx0XHR0aGlzLl90aW1lICs9IHRpbWU7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl9ldmVudFRpbWVzLmxlbmd0aDtpKyspIHsgdGhpcy5fZXZlbnRUaW1lc1tpXSAtPSB0aW1lOyB9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcy5fZXZlbnRzLnNwbGljZSgwLCAxKVswXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHRpbWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBldmVudFxyXG4gKiBAcGFyYW0gez99IGV2ZW50XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHRpbWVcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5nZXRFdmVudFRpbWUgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdHZhciBpbmRleCA9IHRoaXMuX2V2ZW50cy5pbmRleE9mKGV2ZW50KTtcclxuXHRpZiAoaW5kZXggPT0gLTEpIHsgcmV0dXJuIHVuZGVmaW5lZCB9XHJcblx0cmV0dXJuIHRoaXMuX2V2ZW50VGltZXNbaW5kZXhdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhbiBldmVudCBmcm9tIHRoZSBxdWV1ZVxyXG4gKiBAcGFyYW0gez99IGV2ZW50XHJcbiAqIEByZXR1cm5zIHtib29sfSBzdWNjZXNzP1xyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0dmFyIGluZGV4ID0gdGhpcy5fZXZlbnRzLmluZGV4T2YoZXZlbnQpO1xyXG5cdGlmIChpbmRleCA9PSAtMSkgeyByZXR1cm4gZmFsc2UgfVxyXG5cdHRoaXMuX3JlbW92ZShpbmRleCk7XHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGFuIGV2ZW50IGZyb20gdGhlIHF1ZXVlXHJcbiAqIEBwYXJhbSB7aW50fSBpbmRleFxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLl9yZW1vdmUgPSBmdW5jdGlvbihpbmRleCkge1xyXG5cdHRoaXMuX2V2ZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdHRoaXMuX2V2ZW50VGltZXMuc3BsaWNlKGluZGV4LCAxKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBBYnN0cmFjdCBzY2hlZHVsZXJcclxuICovXHJcblJPVC5TY2hlZHVsZXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9xdWV1ZSA9IG5ldyBST1QuRXZlbnRRdWV1ZSgpO1xyXG5cdHRoaXMuX3JlcGVhdCA9IFtdO1xyXG5cdHRoaXMuX2N1cnJlbnQgPSBudWxsO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULkV2ZW50UXVldWUjZ2V0VGltZVxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuZ2V0VGltZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9xdWV1ZS5nZXRUaW1lKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHs/fSBpdGVtXHJcbiAqIEBwYXJhbSB7Ym9vbH0gcmVwZWF0XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQpIHtcclxuXHRpZiAocmVwZWF0KSB7IHRoaXMuX3JlcGVhdC5wdXNoKGl0ZW0pOyB9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHRoZSB0aW1lIHRoZSBnaXZlbiBpdGVtIGlzIHNjaGVkdWxlZCBmb3JcclxuICogQHBhcmFtIHs/fSBpdGVtXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHRpbWVcclxuICovXHJcblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmdldFRpbWVPZiA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRyZXR1cm4gdGhpcy5fcXVldWUuZ2V0RXZlbnRUaW1lKGl0ZW0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsZWFyIGFsbCBpdGVtc1xyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9xdWV1ZS5jbGVhcigpO1xyXG5cdHRoaXMuX3JlcGVhdCA9IFtdO1xyXG5cdHRoaXMuX2N1cnJlbnQgPSBudWxsO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhIHByZXZpb3VzbHkgYWRkZWQgaXRlbVxyXG4gKiBAcGFyYW0gez99IGl0ZW1cclxuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3NmdWw/XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0dmFyIHJlc3VsdCA9IHRoaXMuX3F1ZXVlLnJlbW92ZShpdGVtKTtcclxuXHJcblx0dmFyIGluZGV4ID0gdGhpcy5fcmVwZWF0LmluZGV4T2YoaXRlbSk7XHJcblx0aWYgKGluZGV4ICE9IC0xKSB7IHRoaXMuX3JlcGVhdC5zcGxpY2UoaW5kZXgsIDEpOyB9XHJcblxyXG5cdGlmICh0aGlzLl9jdXJyZW50ID09IGl0ZW0pIHsgdGhpcy5fY3VycmVudCA9IG51bGw7IH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTY2hlZHVsZSBuZXh0IGl0ZW1cclxuICogQHJldHVybnMgez99XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fY3VycmVudCA9IHRoaXMuX3F1ZXVlLmdldCgpO1xyXG5cdHJldHVybiB0aGlzLl9jdXJyZW50O1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFNpbXBsZSBmYWlyIHNjaGVkdWxlciAocm91bmQtcm9iaW4gc3R5bGUpXHJcbiAqIEBhdWdtZW50cyBST1QuU2NoZWR1bGVyXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLlNpbXBsZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFJPVC5TY2hlZHVsZXIuY2FsbCh0aGlzKTtcclxufTtcclxuUk9ULlNjaGVkdWxlci5TaW1wbGUuZXh0ZW5kKFJPVC5TY2hlZHVsZXIpO1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNhZGRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU2ltcGxlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQpIHtcclxuXHR0aGlzLl9xdWV1ZS5hZGQoaXRlbSwgMCk7XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGl0ZW0sIHJlcGVhdCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuU2NoZWR1bGVyI25leHRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU2ltcGxlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKHRoaXMuX2N1cnJlbnQgJiYgdGhpcy5fcmVwZWF0LmluZGV4T2YodGhpcy5fY3VycmVudCkgIT0gLTEpIHtcclxuXHRcdHRoaXMuX3F1ZXVlLmFkZCh0aGlzLl9jdXJyZW50LCAwKTtcclxuXHR9XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBTcGVlZC1iYXNlZCBzY2hlZHVsZXJcclxuICogQGF1Z21lbnRzIFJPVC5TY2hlZHVsZXJcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU3BlZWQgPSBmdW5jdGlvbigpIHtcclxuXHRST1QuU2NoZWR1bGVyLmNhbGwodGhpcyk7XHJcbn07XHJcblJPVC5TY2hlZHVsZXIuU3BlZWQuZXh0ZW5kKFJPVC5TY2hlZHVsZXIpO1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtIGFueXRoaW5nIHdpdGggXCJnZXRTcGVlZFwiIG1ldGhvZFxyXG4gKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3RpbWU9MS9pdGVtLmdldFNwZWVkKCldXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNhZGRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU3BlZWQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCwgdGltZSkge1xyXG5cdHRoaXMuX3F1ZXVlLmFkZChpdGVtLCB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogMS9pdGVtLmdldFNwZWVkKCkpO1xyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5hZGQuY2FsbCh0aGlzLCBpdGVtLCByZXBlYXQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNuZXh0XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLlNwZWVkLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKHRoaXMuX2N1cnJlbnQgJiYgdGhpcy5fcmVwZWF0LmluZGV4T2YodGhpcy5fY3VycmVudCkgIT0gLTEpIHtcclxuXHRcdHRoaXMuX3F1ZXVlLmFkZCh0aGlzLl9jdXJyZW50LCAxL3RoaXMuX2N1cnJlbnQuZ2V0U3BlZWQoKSk7XHJcblx0fVxyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQWN0aW9uLWJhc2VkIHNjaGVkdWxlclxyXG4gKiBAYXVnbWVudHMgUk9ULlNjaGVkdWxlclxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuXHRST1QuU2NoZWR1bGVyLmNhbGwodGhpcyk7XHJcblx0dGhpcy5fZGVmYXVsdER1cmF0aW9uID0gMTsgLyogZm9yIG5ld2x5IGFkZGVkICovXHJcblx0dGhpcy5fZHVyYXRpb24gPSB0aGlzLl9kZWZhdWx0RHVyYXRpb247IC8qIGZvciB0aGlzLl9jdXJyZW50ICovXHJcbn07XHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uLmV4dGVuZChST1QuU2NoZWR1bGVyKTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge29iamVjdH0gaXRlbVxyXG4gKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3RpbWU9MV1cclxuICogQHNlZSBST1QuU2NoZWR1bGVyI2FkZFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCwgdGltZSkge1xyXG5cdHRoaXMuX3F1ZXVlLmFkZChpdGVtLCB0aW1lIHx8IHRoaXMuX2RlZmF1bHREdXJhdGlvbik7XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGl0ZW0sIHJlcGVhdCk7XHJcbn07XHJcblxyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjtcclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuY2xlYXIuY2FsbCh0aGlzKTtcclxufTtcclxuXHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0aWYgKGl0ZW0gPT0gdGhpcy5fY3VycmVudCkgeyB0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjsgfVxyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5yZW1vdmUuY2FsbCh0aGlzLCBpdGVtKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjbmV4dFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcclxuXHRpZiAodGhpcy5fY3VycmVudCAmJiB0aGlzLl9yZXBlYXQuaW5kZXhPZih0aGlzLl9jdXJyZW50KSAhPSAtMSkge1xyXG5cdFx0dGhpcy5fcXVldWUuYWRkKHRoaXMuX2N1cnJlbnQsIHRoaXMuX2R1cmF0aW9uIHx8IHRoaXMuX2RlZmF1bHREdXJhdGlvbik7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjtcclxuXHR9XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZHVyYXRpb24gZm9yIHRoZSBhY3RpdmUgaXRlbVxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLnNldER1cmF0aW9uID0gZnVuY3Rpb24odGltZSkge1xyXG5cdGlmICh0aGlzLl9jdXJyZW50KSB7IHRoaXMuX2R1cmF0aW9uID0gdGltZTsgfVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEFzeW5jaHJvbm91cyBtYWluIGxvb3BcclxuICogQHBhcmFtIHtST1QuU2NoZWR1bGVyfSBzY2hlZHVsZXJcclxuICovXHJcblJPVC5FbmdpbmUgPSBmdW5jdGlvbihzY2hlZHVsZXIpIHtcclxuXHR0aGlzLl9zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XHJcblx0dGhpcy5fbG9jayA9IDE7XHJcbn07XHJcblxyXG4vKipcclxuICogU3RhcnQgdGhlIG1haW4gbG9vcC4gV2hlbiB0aGlzIGNhbGwgcmV0dXJucywgdGhlIGxvb3AgaXMgbG9ja2VkLlxyXG4gKi9cclxuUk9ULkVuZ2luZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy51bmxvY2soKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbnRlcnJ1cHQgdGhlIGVuZ2luZSBieSBhbiBhc3luY2hyb25vdXMgYWN0aW9uXHJcbiAqL1xyXG5ST1QuRW5naW5lLnByb3RvdHlwZS5sb2NrID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fbG9jaysrO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlc3VtZSBleGVjdXRpb24gKHBhdXNlZCBieSBhIHByZXZpb3VzIGxvY2spXHJcbiAqL1xyXG5ST1QuRW5naW5lLnByb3RvdHlwZS51bmxvY2sgPSBmdW5jdGlvbigpIHtcclxuXHRpZiAoIXRoaXMuX2xvY2spIHsgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHVubG9jayB1bmxvY2tlZCBlbmdpbmVcIik7IH1cclxuXHR0aGlzLl9sb2NrLS07XHJcblxyXG5cdHdoaWxlICghdGhpcy5fbG9jaykge1xyXG5cdFx0dmFyIGFjdG9yID0gdGhpcy5fc2NoZWR1bGVyLm5leHQoKTtcclxuXHRcdGlmICghYWN0b3IpIHsgcmV0dXJuIHRoaXMubG9jaygpOyB9IC8qIG5vIGFjdG9ycyAqL1xyXG5cdFx0dmFyIHJlc3VsdCA9IGFjdG9yLmFjdCgpO1xyXG5cdFx0aWYgKHJlc3VsdCAmJiByZXN1bHQudGhlbikgeyAvKiBhY3RvciByZXR1cm5lZCBhIFwidGhlbmFibGVcIiwgbG9va3MgbGlrZSBhIFByb21pc2UgKi9cclxuXHRcdFx0dGhpcy5sb2NrKCk7XHJcblx0XHRcdHJlc3VsdC50aGVuKHRoaXMudW5sb2NrLmJpbmQodGhpcykpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQmFzZSBtYXAgZ2VuZXJhdG9yXHJcbiAqIEBwYXJhbSB7aW50fSBbd2lkdGg9Uk9ULkRFRkFVTFRfV0lEVEhdXHJcbiAqIEBwYXJhbSB7aW50fSBbaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cclxuICovXHJcblJPVC5NYXAgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0dGhpcy5fd2lkdGggPSB3aWR0aCB8fCBST1QuREVGQVVMVF9XSURUSDtcclxuXHR0aGlzLl9oZWlnaHQgPSBoZWlnaHQgfHwgUk9ULkRFRkFVTFRfSEVJR0hUO1xyXG59O1xyXG5cclxuUk9ULk1hcC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHt9O1xyXG5cclxuUk9ULk1hcC5wcm90b3R5cGUuX2ZpbGxNYXAgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdHZhciBtYXAgPSBbXTtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdG1hcC5wdXNoKFtdKTtcclxuXHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHsgbWFwW2ldLnB1c2godmFsdWUpOyB9XHJcblx0fVxyXG5cdHJldHVybiBtYXA7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgU2ltcGxlIGVtcHR5IHJlY3Rhbmd1bGFyIHJvb21cclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuQXJlbmEgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG59O1xyXG5ST1QuTWFwLkFyZW5hLmV4dGVuZChST1QuTWFwKTtcclxuXHJcblJPVC5NYXAuQXJlbmEucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIHcgPSB0aGlzLl93aWR0aC0xO1xyXG5cdHZhciBoID0gdGhpcy5faGVpZ2h0LTE7XHJcblx0Zm9yICh2YXIgaT0wO2k8PXc7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajw9aDtqKyspIHtcclxuXHRcdFx0dmFyIGVtcHR5ID0gKGkgJiYgaiAmJiBpPHcgJiYgajxoKTtcclxuXHRcdFx0Y2FsbGJhY2soaSwgaiwgZW1wdHkgPyAwIDogMSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFJlY3Vyc2l2ZWx5IGRpdmlkZWQgbWF6ZSwgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NYXplX2dlbmVyYXRpb25fYWxnb3JpdGhtI1JlY3Vyc2l2ZV9kaXZpc2lvbl9tZXRob2RcclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuRGl2aWRlZE1hemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdHRoaXMuX3N0YWNrID0gW107XHJcbn07XHJcblJPVC5NYXAuRGl2aWRlZE1hemUuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR2YXIgdyA9IHRoaXMuX3dpZHRoO1xyXG5cdHZhciBoID0gdGhpcy5faGVpZ2h0O1xyXG5cdFxyXG5cdHRoaXMuX21hcCA9IFtdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XHJcblx0XHR0aGlzLl9tYXAucHVzaChbXSk7XHJcblx0XHRmb3IgKHZhciBqPTA7ajxoO2orKykge1xyXG5cdFx0XHR2YXIgYm9yZGVyID0gKGkgPT0gMCB8fCBqID09IDAgfHwgaSsxID09IHcgfHwgaisxID09IGgpO1xyXG5cdFx0XHR0aGlzLl9tYXBbaV0ucHVzaChib3JkZXIgPyAxIDogMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX3N0YWNrID0gW1xyXG5cdFx0WzEsIDEsIHctMiwgaC0yXVxyXG5cdF07XHJcblx0dGhpcy5fcHJvY2VzcygpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajxoO2orKykge1xyXG5cdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR0aGlzLl9tYXAgPSBudWxsO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5wcm90b3R5cGUuX3Byb2Nlc3MgPSBmdW5jdGlvbigpIHtcclxuXHR3aGlsZSAodGhpcy5fc3RhY2subGVuZ3RoKSB7XHJcblx0XHR2YXIgcm9vbSA9IHRoaXMuX3N0YWNrLnNoaWZ0KCk7IC8qIFtsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b21dICovXHJcblx0XHR0aGlzLl9wYXJ0aXRpb25Sb29tKHJvb20pO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuRGl2aWRlZE1hemUucHJvdG90eXBlLl9wYXJ0aXRpb25Sb29tID0gZnVuY3Rpb24ocm9vbSkge1xyXG5cdHZhciBhdmFpbFggPSBbXTtcclxuXHR2YXIgYXZhaWxZID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT1yb29tWzBdKzE7aTxyb29tWzJdO2krKykge1xyXG5cdFx0dmFyIHRvcCA9IHRoaXMuX21hcFtpXVtyb29tWzFdLTFdO1xyXG5cdFx0dmFyIGJvdHRvbSA9IHRoaXMuX21hcFtpXVtyb29tWzNdKzFdO1xyXG5cdFx0aWYgKHRvcCAmJiBib3R0b20gJiYgIShpICUgMikpIHsgYXZhaWxYLnB1c2goaSk7IH1cclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaj1yb29tWzFdKzE7ajxyb29tWzNdO2orKykge1xyXG5cdFx0dmFyIGxlZnQgPSB0aGlzLl9tYXBbcm9vbVswXS0xXVtqXTtcclxuXHRcdHZhciByaWdodCA9IHRoaXMuX21hcFtyb29tWzJdKzFdW2pdO1xyXG5cdFx0aWYgKGxlZnQgJiYgcmlnaHQgJiYgIShqICUgMikpIHsgYXZhaWxZLnB1c2goaik7IH1cclxuXHR9XHJcblxyXG5cdGlmICghYXZhaWxYLmxlbmd0aCB8fCAhYXZhaWxZLmxlbmd0aCkgeyByZXR1cm47IH1cclxuXHJcblx0dmFyIHggPSBhdmFpbFgucmFuZG9tKCk7XHJcblx0dmFyIHkgPSBhdmFpbFkucmFuZG9tKCk7XHJcblx0XHJcblx0dGhpcy5fbWFwW3hdW3ldID0gMTtcclxuXHRcclxuXHR2YXIgd2FsbHMgPSBbXTtcclxuXHRcclxuXHR2YXIgdyA9IFtdOyB3YWxscy5wdXNoKHcpOyAvKiBsZWZ0IHBhcnQgKi9cclxuXHRmb3IgKHZhciBpPXJvb21bMF07IGk8eDsgaSsrKSB7IFxyXG5cdFx0dGhpcy5fbWFwW2ldW3ldID0gMTtcclxuXHRcdHcucHVzaChbaSwgeV0pOyBcclxuXHR9XHJcblx0XHJcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogcmlnaHQgcGFydCAqL1xyXG5cdGZvciAodmFyIGk9eCsxOyBpPD1yb29tWzJdOyBpKyspIHsgXHJcblx0XHR0aGlzLl9tYXBbaV1beV0gPSAxO1xyXG5cdFx0dy5wdXNoKFtpLCB5XSk7IFxyXG5cdH1cclxuXHJcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogdG9wIHBhcnQgKi9cclxuXHRmb3IgKHZhciBqPXJvb21bMV07IGo8eTsgaisrKSB7IFxyXG5cdFx0dGhpcy5fbWFwW3hdW2pdID0gMTtcclxuXHRcdHcucHVzaChbeCwgal0pOyBcclxuXHR9XHJcblx0XHJcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogYm90dG9tIHBhcnQgKi9cclxuXHRmb3IgKHZhciBqPXkrMTsgajw9cm9vbVszXTsgaisrKSB7IFxyXG5cdFx0dGhpcy5fbWFwW3hdW2pdID0gMTtcclxuXHRcdHcucHVzaChbeCwgal0pOyBcclxuXHR9XHJcblx0XHRcclxuXHR2YXIgc29saWQgPSB3YWxscy5yYW5kb20oKTtcclxuXHRmb3IgKHZhciBpPTA7aTx3YWxscy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgdyA9IHdhbGxzW2ldO1xyXG5cdFx0aWYgKHcgPT0gc29saWQpIHsgY29udGludWU7IH1cclxuXHRcdFxyXG5cdFx0dmFyIGhvbGUgPSB3LnJhbmRvbSgpO1xyXG5cdFx0dGhpcy5fbWFwW2hvbGVbMF1dW2hvbGVbMV1dID0gMDtcclxuXHR9XHJcblxyXG5cdHRoaXMuX3N0YWNrLnB1c2goW3Jvb21bMF0sIHJvb21bMV0sIHgtMSwgeS0xXSk7IC8qIGxlZnQgdG9wICovXHJcblx0dGhpcy5fc3RhY2sucHVzaChbeCsxLCByb29tWzFdLCByb29tWzJdLCB5LTFdKTsgLyogcmlnaHQgdG9wICovXHJcblx0dGhpcy5fc3RhY2sucHVzaChbcm9vbVswXSwgeSsxLCB4LTEsIHJvb21bM11dKTsgLyogbGVmdCBib3R0b20gKi9cclxuXHR0aGlzLl9zdGFjay5wdXNoKFt4KzEsIHkrMSwgcm9vbVsyXSwgcm9vbVszXV0pOyAvKiByaWdodCBib3R0b20gKi9cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBJY2V5J3MgTWF6ZSBnZW5lcmF0b3JcclxuICogU2VlIGh0dHA6Ly93d3cucm9ndWViYXNpbi5yb2d1ZWxpa2VkZXZlbG9wbWVudC5vcmcvaW5kZXgucGhwP3RpdGxlPVNpbXBsZV9tYXplIGZvciBleHBsYW5hdGlvblxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKi9cclxuUk9ULk1hcC5JY2V5TWF6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIHJlZ3VsYXJpdHkpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblx0dGhpcy5fcmVndWxhcml0eSA9IHJlZ3VsYXJpdHkgfHwgMDtcclxufTtcclxuUk9ULk1hcC5JY2V5TWF6ZS5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG5ST1QuTWFwLkljZXlNYXplLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciB3aWR0aCA9IHRoaXMuX3dpZHRoO1xyXG5cdHZhciBoZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XHJcblx0XHJcblx0dmFyIG1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0XHJcblx0d2lkdGggLT0gKHdpZHRoICUgMiA/IDEgOiAyKTtcclxuXHRoZWlnaHQgLT0gKGhlaWdodCAlIDIgPyAxIDogMik7XHJcblxyXG5cdHZhciBjeCA9IDA7XHJcblx0dmFyIGN5ID0gMDtcclxuXHR2YXIgbnggPSAwO1xyXG5cdHZhciBueSA9IDA7XHJcblxyXG5cdHZhciBkb25lID0gMDtcclxuXHR2YXIgYmxvY2tlZCA9IGZhbHNlO1xyXG5cdHZhciBkaXJzID0gW1xyXG5cdFx0WzAsIDBdLFxyXG5cdFx0WzAsIDBdLFxyXG5cdFx0WzAsIDBdLFxyXG5cdFx0WzAsIDBdXHJcblx0XTtcclxuXHRkbyB7XHJcblx0XHRjeCA9IDEgKyAyKk1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqKHdpZHRoLTEpIC8gMik7XHJcblx0XHRjeSA9IDEgKyAyKk1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqKGhlaWdodC0xKSAvIDIpO1xyXG5cclxuXHRcdGlmICghZG9uZSkgeyBtYXBbY3hdW2N5XSA9IDA7IH1cclxuXHRcdFxyXG5cdFx0aWYgKCFtYXBbY3hdW2N5XSkge1xyXG5cdFx0XHR0aGlzLl9yYW5kb21pemUoZGlycyk7XHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHRpZiAoTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSoodGhpcy5fcmVndWxhcml0eSsxKSkgPT0gMCkgeyB0aGlzLl9yYW5kb21pemUoZGlycyk7IH1cclxuXHRcdFx0XHRibG9ja2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRmb3IgKHZhciBpPTA7aTw0O2krKykge1xyXG5cdFx0XHRcdFx0bnggPSBjeCArIGRpcnNbaV1bMF0qMjtcclxuXHRcdFx0XHRcdG55ID0gY3kgKyBkaXJzW2ldWzFdKjI7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5faXNGcmVlKG1hcCwgbngsIG55LCB3aWR0aCwgaGVpZ2h0KSkge1xyXG5cdFx0XHRcdFx0XHRtYXBbbnhdW255XSA9IDA7XHJcblx0XHRcdFx0XHRcdG1hcFtjeCArIGRpcnNbaV1bMF1dW2N5ICsgZGlyc1tpXVsxXV0gPSAwO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Y3ggPSBueDtcclxuXHRcdFx0XHRcdFx0Y3kgPSBueTtcclxuXHRcdFx0XHRcdFx0YmxvY2tlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRkb25lKys7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSB3aGlsZSAoIWJsb2NrZWQpO1xyXG5cdFx0fVxyXG5cdH0gd2hpbGUgKGRvbmUrMSA8IHdpZHRoKmhlaWdodC80KTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdFx0Y2FsbGJhY2soaSwgaiwgbWFwW2ldW2pdKTtcclxuXHRcdH1cclxuXHR9XHJcblx0dGhpcy5fbWFwID0gbnVsbDtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuSWNleU1hemUucHJvdG90eXBlLl9yYW5kb21pemUgPSBmdW5jdGlvbihkaXJzKSB7XHJcblx0Zm9yICh2YXIgaT0wO2k8NDtpKyspIHtcclxuXHRcdGRpcnNbaV1bMF0gPSAwO1xyXG5cdFx0ZGlyc1tpXVsxXSA9IDA7XHJcblx0fVxyXG5cdFxyXG5cdHN3aXRjaCAoTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSo0KSkge1xyXG5cdFx0Y2FzZSAwOlxyXG5cdFx0XHRkaXJzWzBdWzBdID0gLTE7IGRpcnNbMV1bMF0gPSAxO1xyXG5cdFx0XHRkaXJzWzJdWzFdID0gLTE7IGRpcnNbM11bMV0gPSAxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDE6XHJcblx0XHRcdGRpcnNbM11bMF0gPSAtMTsgZGlyc1syXVswXSA9IDE7XHJcblx0XHRcdGRpcnNbMV1bMV0gPSAtMTsgZGlyc1swXVsxXSA9IDE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMjpcclxuXHRcdFx0ZGlyc1syXVswXSA9IC0xOyBkaXJzWzNdWzBdID0gMTtcclxuXHRcdFx0ZGlyc1swXVsxXSA9IC0xOyBkaXJzWzFdWzFdID0gMTtcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAzOlxyXG5cdFx0XHRkaXJzWzFdWzBdID0gLTE7IGRpcnNbMF1bMF0gPSAxO1xyXG5cdFx0XHRkaXJzWzNdWzFdID0gLTE7IGRpcnNbMl1bMV0gPSAxO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5JY2V5TWF6ZS5wcm90b3R5cGUuX2lzRnJlZSA9IGZ1bmN0aW9uKG1hcCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG5cdGlmICh4IDwgMSB8fCB5IDwgMSB8fCB4ID49IHdpZHRoIHx8IHkgPj0gaGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiBtYXBbeF1beV07XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgTWF6ZSBnZW5lcmF0b3IgLSBFbGxlcidzIGFsZ29yaXRobVxyXG4gKiBTZWUgaHR0cDovL2hvbWVwYWdlcy5jd2kubmwvfnRyb21wL21hemUuaHRtbCBmb3IgZXhwbGFuYXRpb25cclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuRWxsZXJNYXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxufTtcclxuUk9ULk1hcC5FbGxlck1hemUuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuUk9ULk1hcC5FbGxlck1hemUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIG1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0dmFyIHcgPSBNYXRoLmNlaWwoKHRoaXMuX3dpZHRoLTIpLzIpO1xyXG5cdFxyXG5cdHZhciByYW5kID0gOS8yNDtcclxuXHRcclxuXHR2YXIgTCA9IFtdO1xyXG5cdHZhciBSID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcclxuXHRcdEwucHVzaChpKTtcclxuXHRcdFIucHVzaChpKTtcclxuXHR9XHJcblx0TC5wdXNoKHctMSk7IC8qIGZha2Ugc3RvcC1ibG9jayBhdCB0aGUgcmlnaHQgc2lkZSAqL1xyXG5cclxuXHRmb3IgKHZhciBqPTE7aiszPHRoaXMuX2hlaWdodDtqKz0yKSB7XHJcblx0XHQvKiBvbmUgcm93ICovXHJcblx0XHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xyXG5cdFx0XHQvKiBjZWxsIGNvb3JkcyAod2lsbCBiZSBhbHdheXMgZW1wdHkpICovXHJcblx0XHRcdHZhciB4ID0gMippKzE7XHJcblx0XHRcdHZhciB5ID0gajtcclxuXHRcdFx0bWFwW3hdW3ldID0gMDtcclxuXHRcdFx0XHJcblx0XHRcdC8qIHJpZ2h0IGNvbm5lY3Rpb24gKi9cclxuXHRcdFx0aWYgKGkgIT0gTFtpKzFdICYmIFJPVC5STkcuZ2V0VW5pZm9ybSgpID4gcmFuZCkge1xyXG5cdFx0XHRcdHRoaXMuX2FkZFRvTGlzdChpLCBMLCBSKTtcclxuXHRcdFx0XHRtYXBbeCsxXVt5XSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdC8qIGJvdHRvbSBjb25uZWN0aW9uICovXHJcblx0XHRcdGlmIChpICE9IExbaV0gJiYgUk9ULlJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSB7XHJcblx0XHRcdFx0LyogcmVtb3ZlIGNvbm5lY3Rpb24gKi9cclxuXHRcdFx0XHR0aGlzLl9yZW1vdmVGcm9tTGlzdChpLCBMLCBSKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvKiBjcmVhdGUgY29ubmVjdGlvbiAqL1xyXG5cdFx0XHRcdG1hcFt4XVt5KzFdID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyogbGFzdCByb3cgKi9cclxuXHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xyXG5cdFx0LyogY2VsbCBjb29yZHMgKHdpbGwgYmUgYWx3YXlzIGVtcHR5KSAqL1xyXG5cdFx0dmFyIHggPSAyKmkrMTtcclxuXHRcdHZhciB5ID0gajtcclxuXHRcdG1hcFt4XVt5XSA9IDA7XHJcblx0XHRcclxuXHRcdC8qIHJpZ2h0IGNvbm5lY3Rpb24gKi9cclxuXHRcdGlmIChpICE9IExbaSsxXSAmJiAoaSA9PSBMW2ldIHx8IFJPVC5STkcuZ2V0VW5pZm9ybSgpID4gcmFuZCkpIHtcclxuXHRcdFx0LyogZGlnIHJpZ2h0IGFsc28gaWYgdGhlIGNlbGwgaXMgc2VwYXJhdGVkLCBzbyBpdCBnZXRzIGNvbm5lY3RlZCB0byB0aGUgcmVzdCBvZiBtYXplICovXHJcblx0XHRcdHRoaXMuX2FkZFRvTGlzdChpLCBMLCBSKTtcclxuXHRcdFx0bWFwW3grMV1beV0gPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLl9yZW1vdmVGcm9tTGlzdChpLCBMLCBSKTtcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHRcdGNhbGxiYWNrKGksIGosIG1hcFtpXVtqXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBcImlcIiBmcm9tIGl0cyBsaXN0XHJcbiAqL1xyXG5ST1QuTWFwLkVsbGVyTWF6ZS5wcm90b3R5cGUuX3JlbW92ZUZyb21MaXN0ID0gZnVuY3Rpb24oaSwgTCwgUikge1xyXG5cdFJbTFtpXV0gPSBSW2ldO1xyXG5cdExbUltpXV0gPSBMW2ldO1xyXG5cdFJbaV0gPSBpO1xyXG5cdExbaV0gPSBpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEpvaW4gbGlzdHMgd2l0aCBcImlcIiBhbmQgXCJpKzFcIlxyXG4gKi9cclxuUk9ULk1hcC5FbGxlck1hemUucHJvdG90eXBlLl9hZGRUb0xpc3QgPSBmdW5jdGlvbihpLCBMLCBSKSB7XHJcblx0UltMW2krMV1dID0gUltpXTtcclxuXHRMW1JbaV1dID0gTFtpKzFdO1xyXG5cdFJbaV0gPSBpKzE7XHJcblx0TFtpKzFdID0gaTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBDZWxsdWxhciBhdXRvbWF0b24gbWFwIGdlbmVyYXRvclxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKiBAcGFyYW0ge2ludH0gW3dpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxyXG4gKiBAcGFyYW0ge2ludH0gW2hlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gT3B0aW9uc1xyXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5ib3JuXSBMaXN0IG9mIG5laWdoYm9yIGNvdW50cyBmb3IgYSBuZXcgY2VsbCB0byBiZSBib3JuIGluIGVtcHR5IHNwYWNlXHJcbiAqIEBwYXJhbSB7aW50W119IFtvcHRpb25zLnN1cnZpdmVdIExpc3Qgb2YgbmVpZ2hib3IgY291bnRzIGZvciBhbiBleGlzdGluZyAgY2VsbCB0byBzdXJ2aXZlXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50b3BvbG9neV0gVG9wb2xvZ3kgNCBvciA2IG9yIDhcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRib3JuOiBbNSwgNiwgNywgOF0sXHJcblx0XHRzdXJ2aXZlOiBbNCwgNSwgNiwgNywgOF0sXHJcblx0XHR0b3BvbG9neTogOFxyXG5cdH07XHJcblx0dGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuXHR0aGlzLl9kaXJzID0gUk9ULkRJUlNbdGhpcy5fb3B0aW9ucy50b3BvbG9neV07XHJcblx0dGhpcy5fbWFwID0gdGhpcy5fZmlsbE1hcCgwKTtcclxufTtcclxuUk9ULk1hcC5DZWxsdWxhci5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG4vKipcclxuICogRmlsbCB0aGUgbWFwIHdpdGggcmFuZG9tIHZhbHVlc1xyXG4gKiBAcGFyYW0ge2Zsb2F0fSBwcm9iYWJpbGl0eSBQcm9iYWJpbGl0eSBmb3IgYSBjZWxsIHRvIGJlY29tZSBhbGl2ZTsgMCA9IGFsbCBlbXB0eSwgMSA9IGFsbCBmdWxsXHJcbiAqL1xyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5yYW5kb21pemUgPSBmdW5jdGlvbihwcm9iYWJpbGl0eSkge1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0XHR0aGlzLl9tYXBbaV1bal0gPSAoUk9ULlJORy5nZXRVbmlmb3JtKCkgPCBwcm9iYWJpbGl0eSA/IDEgOiAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hhbmdlIG9wdGlvbnMuXHJcbiAqIEBzZWUgUk9ULk1hcC5DZWxsdWxhclxyXG4gKi9cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHksIHZhbHVlKSB7XHJcblx0dGhpcy5fbWFwW3hdW3ldID0gdmFsdWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciBuZXdNYXAgPSB0aGlzLl9maWxsTWFwKDApO1xyXG5cdHZhciBib3JuID0gdGhpcy5fb3B0aW9ucy5ib3JuO1xyXG5cdHZhciBzdXJ2aXZlID0gdGhpcy5fb3B0aW9ucy5zdXJ2aXZlO1xyXG5cclxuXHJcblx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0dmFyIHdpZHRoU3RlcCA9IDE7XHJcblx0XHR2YXIgd2lkdGhTdGFydCA9IDA7XHJcblx0XHRpZiAodGhpcy5fb3B0aW9ucy50b3BvbG9neSA9PSA2KSB7XHJcblx0XHRcdHdpZHRoU3RlcCA9IDI7XHJcblx0XHRcdHdpZHRoU3RhcnQgPSBqJTI7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgaT13aWR0aFN0YXJ0OyBpPHRoaXMuX3dpZHRoOyBpKz13aWR0aFN0ZXApIHtcclxuXHJcblx0XHRcdHZhciBjdXIgPSB0aGlzLl9tYXBbaV1bal07XHJcblx0XHRcdHZhciBuY291bnQgPSB0aGlzLl9nZXROZWlnaGJvcnMoaSwgaik7XHJcblxyXG5cdFx0XHRpZiAoY3VyICYmIHN1cnZpdmUuaW5kZXhPZihuY291bnQpICE9IC0xKSB7IC8qIHN1cnZpdmUgKi9cclxuXHRcdFx0XHRuZXdNYXBbaV1bal0gPSAxO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCFjdXIgJiYgYm9ybi5pbmRleE9mKG5jb3VudCkgIT0gLTEpIHsgLyogYm9ybiAqL1xyXG5cdFx0XHRcdG5ld01hcFtpXVtqXSA9IDE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuX21hcCA9IG5ld01hcDtcclxuXHJcblx0dGhpcy5zZXJ2aWNlQ2FsbGJhY2soY2FsbGJhY2spO1xyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuc2VydmljZUNhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRpZiAoIWNhbGxiYWNrKSB7IHJldHVybjsgfVxyXG5cclxuXHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHR2YXIgd2lkdGhTdGVwID0gMTtcclxuXHRcdHZhciB3aWR0aFN0YXJ0ID0gMDtcclxuXHRcdGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDYpIHtcclxuXHRcdFx0d2lkdGhTdGVwID0gMjtcclxuXHRcdFx0d2lkdGhTdGFydCA9IGolMjtcclxuXHRcdH1cclxuXHRcdGZvciAodmFyIGk9d2lkdGhTdGFydDsgaTx0aGlzLl93aWR0aDsgaSs9d2lkdGhTdGVwKSB7XHJcblx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBuZWlnaGJvciBjb3VudCBhdCBbaSxqXSBpbiB0aGlzLl9tYXBcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9nZXROZWlnaGJvcnMgPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHR2YXIgcmVzdWx0ID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9kaXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBkaXIgPSB0aGlzLl9kaXJzW2ldO1xyXG5cdFx0dmFyIHggPSBjeCArIGRpclswXTtcclxuXHRcdHZhciB5ID0gY3kgKyBkaXJbMV07XHJcblxyXG5cdFx0aWYgKHggPCAwIHx8IHggPj0gdGhpcy5fd2lkdGggfHwgeSA8IDAgfHwgeSA+PSB0aGlzLl93aWR0aCkgeyBjb250aW51ZTsgfVxyXG5cdFx0cmVzdWx0ICs9ICh0aGlzLl9tYXBbeF1beV0gPT0gMSA/IDEgOiAwKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vKipcclxuICogTWFrZSBzdXJlIGV2ZXJ5IG5vbi13YWxsIHNwYWNlIGlzIGFjY2Vzc2libGUuXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgdG8gZGlzcGxheSBtYXAgd2hlbiBkb1xyXG4gKiBAcGFyYW0ge2ludH0gdmFsdWUgdG8gY29uc2lkZXIgZW1wdHkgc3BhY2UgLSBkZWZhdWx0cyB0byAwXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgd2hlbiBhIG5ldyBjb25uZWN0aW9uIGlzIG1hZGVcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbihjYWxsYmFjaywgdmFsdWUsIGNvbm5lY3Rpb25DYWxsYmFjaykge1xyXG5cdGlmICghdmFsdWUpIHZhbHVlID0gMDtcclxuXHJcblx0dmFyIGFsbEZyZWVTcGFjZSA9IFtdO1xyXG5cdHZhciBub3RDb25uZWN0ZWQgPSB7fTtcclxuXHQvLyBmaW5kIGFsbCBmcmVlIHNwYWNlXHJcblx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLl93aWR0aDsgeCsrKSB7XHJcblx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuX2hlaWdodDsgeSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLl9mcmVlU3BhY2UoeCwgeSwgdmFsdWUpKSB7XHJcblx0XHRcdFx0dmFyIHAgPSBbeCwgeV07XHJcblx0XHRcdFx0bm90Q29ubmVjdGVkW3RoaXMuX3BvaW50S2V5KHApXSA9IHA7XHJcblx0XHRcdFx0YWxsRnJlZVNwYWNlLnB1c2goW3gsIHldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHR2YXIgc3RhcnQgPSBhbGxGcmVlU3BhY2VbUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGFsbEZyZWVTcGFjZS5sZW5ndGggLSAxKV07XHJcblxyXG5cdHZhciBrZXkgPSB0aGlzLl9wb2ludEtleShzdGFydCk7XHJcblx0dmFyIGNvbm5lY3RlZCA9IHt9O1xyXG5cdGNvbm5lY3RlZFtrZXldID0gc3RhcnQ7XHJcblx0ZGVsZXRlIG5vdENvbm5lY3RlZFtrZXldO1xyXG5cclxuXHQvLyBmaW5kIHdoYXQncyBjb25uZWN0ZWQgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XHJcblx0dGhpcy5fZmluZENvbm5lY3RlZChjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCwgW3N0YXJ0XSwgZmFsc2UsIHZhbHVlKTtcclxuXHJcblx0d2hpbGUgKE9iamVjdC5rZXlzKG5vdENvbm5lY3RlZCkubGVuZ3RoID4gMCkge1xyXG5cclxuXHRcdC8vIGZpbmQgdHdvIHBvaW50cyBmcm9tIG5vdENvbm5lY3RlZCB0byBjb25uZWN0ZWRcclxuXHRcdHZhciBwID0gdGhpcy5fZ2V0RnJvbVRvKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkKTtcclxuXHRcdHZhciBmcm9tID0gcFswXTsgLy8gbm90Q29ubmVjdGVkXHJcblx0XHR2YXIgdG8gPSBwWzFdOyAvLyBjb25uZWN0ZWRcclxuXHJcblx0XHQvLyBmaW5kIGV2ZXJ5dGhpbmcgY29ubmVjdGVkIHRvIHRoZSBzdGFydGluZyBwb2ludFxyXG5cdFx0dmFyIGxvY2FsID0ge307XHJcblx0XHRsb2NhbFt0aGlzLl9wb2ludEtleShmcm9tKV0gPSBmcm9tO1xyXG5cdFx0dGhpcy5fZmluZENvbm5lY3RlZChsb2NhbCwgbm90Q29ubmVjdGVkLCBbZnJvbV0sIHRydWUsIHZhbHVlKTtcclxuXHJcblx0XHQvLyBjb25uZWN0IHRvIGEgY29ubmVjdGVkIHNxdWFyZVxyXG5cdFx0dGhpcy5fdHVubmVsVG9Db25uZWN0ZWQodG8sIGZyb20sIGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCB2YWx1ZSwgY29ubmVjdGlvbkNhbGxiYWNrKTtcclxuXHJcblx0XHQvLyBub3cgYWxsIG9mIGxvY2FsIGlzIGNvbm5lY3RlZFxyXG5cdFx0Zm9yICh2YXIgayBpbiBsb2NhbCkge1xyXG5cdFx0XHR2YXIgcHAgPSBsb2NhbFtrXTtcclxuXHRcdFx0dGhpcy5fbWFwW3BwWzBdXVtwcFsxXV0gPSB2YWx1ZTtcclxuXHRcdFx0Y29ubmVjdGVkW2tdID0gcHA7XHJcblx0XHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRba107XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aGlzLnNlcnZpY2VDYWxsYmFjayhjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogRmluZCByYW5kb20gcG9pbnRzIHRvIGNvbm5lY3QuIFNlYXJjaCBmb3IgdGhlIGNsb3Nlc3QgcG9pbnQgaW4gdGhlIGxhcmdlciBzcGFjZS5cclxuICogVGhpcyBpcyB0byBtaW5pbWl6ZSB0aGUgbGVuZ3RoIG9mIHRoZSBwYXNzYWdlIHdoaWxlIG1haW50YWluaW5nIGdvb2QgcGVyZm9ybWFuY2UuXHJcbiAqL1xyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZ2V0RnJvbVRvID0gZnVuY3Rpb24oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQpIHtcclxuXHR2YXIgZnJvbSwgdG8sIGQ7XHJcblx0dmFyIGNvbm5lY3RlZEtleXMgPSBPYmplY3Qua2V5cyhjb25uZWN0ZWQpO1xyXG5cdHZhciBub3RDb25uZWN0ZWRLZXlzID0gT2JqZWN0LmtleXMobm90Q29ubmVjdGVkKTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xyXG5cdFx0aWYgKGNvbm5lY3RlZEtleXMubGVuZ3RoIDwgbm90Q29ubmVjdGVkS2V5cy5sZW5ndGgpIHtcclxuXHRcdFx0dmFyIGtleXMgPSBjb25uZWN0ZWRLZXlzO1xyXG5cdFx0XHR0byA9IGNvbm5lY3RlZFtrZXlzW1JPVC5STkcuZ2V0VW5pZm9ybUludCgwLCBrZXlzLmxlbmd0aCAtIDEpXV07XHJcblx0XHRcdGZyb20gPSB0aGlzLl9nZXRDbG9zZXN0KHRvLCBub3RDb25uZWN0ZWQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGtleXMgPSBub3RDb25uZWN0ZWRLZXlzO1xyXG5cdFx0XHRmcm9tID0gbm90Q29ubmVjdGVkW2tleXNbUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGtleXMubGVuZ3RoIC0gMSldXTtcclxuXHRcdFx0dG8gPSB0aGlzLl9nZXRDbG9zZXN0KGZyb20sIGNvbm5lY3RlZCk7XHJcblx0XHR9XHJcblx0XHRkID0gKGZyb21bMF0gLSB0b1swXSkgKiAoZnJvbVswXSAtIHRvWzBdKSArIChmcm9tWzFdIC0gdG9bMV0pICogKGZyb21bMV0gLSB0b1sxXSk7XHJcblx0XHRpZiAoZCA8IDY0KSB7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvLyBjb25zb2xlLmxvZyhcIj4+PiBjb25uZWN0ZWQ9XCIgKyB0byArIFwiIG5vdENvbm5lY3RlZD1cIiArIGZyb20gKyBcIiBkaXN0PVwiICsgZCk7XHJcblx0cmV0dXJuIFtmcm9tLCB0b107XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZ2V0Q2xvc2VzdCA9IGZ1bmN0aW9uKHBvaW50LCBzcGFjZSkge1xyXG5cdHZhciBtaW5Qb2ludCA9IG51bGw7XHJcblx0dmFyIG1pbkRpc3QgPSBudWxsO1xyXG5cdGZvciAoayBpbiBzcGFjZSkge1xyXG5cdFx0dmFyIHAgPSBzcGFjZVtrXTtcclxuXHRcdHZhciBkID0gKHBbMF0gLSBwb2ludFswXSkgKiAocFswXSAtIHBvaW50WzBdKSArIChwWzFdIC0gcG9pbnRbMV0pICogKHBbMV0gLSBwb2ludFsxXSk7XHJcblx0XHRpZiAobWluRGlzdCA9PSBudWxsIHx8IGQgPCBtaW5EaXN0KSB7XHJcblx0XHRcdG1pbkRpc3QgPSBkO1xyXG5cdFx0XHRtaW5Qb2ludCA9IHA7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBtaW5Qb2ludDtcclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9maW5kQ29ubmVjdGVkID0gZnVuY3Rpb24oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHN0YWNrLCBrZWVwTm90Q29ubmVjdGVkLCB2YWx1ZSkge1xyXG5cdHdoaWxlKHN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHRcdHZhciBwID0gc3RhY2suc3BsaWNlKDAsIDEpWzBdO1xyXG5cdFx0dmFyIHRlc3RzID0gW1xyXG5cdFx0XHRbcFswXSArIDEsIHBbMV1dLFxyXG5cdFx0XHRbcFswXSAtIDEsIHBbMV1dLFxyXG5cdFx0XHRbcFswXSwgICAgIHBbMV0gKyAxXSxcclxuXHRcdFx0W3BbMF0sICAgICBwWzFdIC0gMV1cclxuXHRcdF07XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRlc3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBrZXkgPSB0aGlzLl9wb2ludEtleSh0ZXN0c1tpXSk7XHJcblx0XHRcdGlmIChjb25uZWN0ZWRba2V5XSA9PSBudWxsICYmIHRoaXMuX2ZyZWVTcGFjZSh0ZXN0c1tpXVswXSwgdGVzdHNbaV1bMV0sIHZhbHVlKSkge1xyXG5cdFx0XHRcdGNvbm5lY3RlZFtrZXldID0gdGVzdHNbaV07XHJcblx0XHRcdFx0aWYgKCFrZWVwTm90Q29ubmVjdGVkKSB7XHJcblx0XHRcdFx0XHRkZWxldGUgbm90Q29ubmVjdGVkW2tleV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHN0YWNrLnB1c2godGVzdHNbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX3R1bm5lbFRvQ29ubmVjdGVkID0gZnVuY3Rpb24odG8sIGZyb20sIGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCB2YWx1ZSwgY29ubmVjdGlvbkNhbGxiYWNrKSB7XHJcblx0dmFyIGtleSA9IHRoaXMuX3BvaW50S2V5KGZyb20pO1xyXG5cdHZhciBhLCBiO1xyXG5cdGlmIChmcm9tWzBdIDwgdG9bMF0pIHtcclxuXHRcdGEgPSBmcm9tO1xyXG5cdFx0YiA9IHRvO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRhID0gdG87XHJcblx0XHRiID0gZnJvbTtcclxuXHR9XHJcblx0Zm9yICh2YXIgeHggPSBhWzBdOyB4eCA8PSBiWzBdOyB4eCsrKSB7XHJcblx0XHR0aGlzLl9tYXBbeHhdW2FbMV1dID0gdmFsdWU7XHJcblx0XHR2YXIgcCA9IFt4eCwgYVsxXV07XHJcblx0XHR2YXIgcGtleSA9IHRoaXMuX3BvaW50S2V5KHApO1xyXG5cdFx0Y29ubmVjdGVkW3BrZXldID0gcDtcclxuXHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRbcGtleV07XHJcblx0fVxyXG5cdGlmIChjb25uZWN0aW9uQ2FsbGJhY2sgJiYgYVswXSA8IGJbMF0pIHtcclxuXHRcdGNvbm5lY3Rpb25DYWxsYmFjayhhLCBbYlswXSwgYVsxXV0pO1xyXG5cdH1cclxuXHJcblx0Ly8geCBpcyBub3cgZml4ZWRcclxuXHR2YXIgeCA9IGJbMF07XHJcblxyXG5cdGlmIChmcm9tWzFdIDwgdG9bMV0pIHtcclxuXHRcdGEgPSBmcm9tO1xyXG5cdFx0YiA9IHRvO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRhID0gdG87XHJcblx0XHRiID0gZnJvbTtcclxuXHR9XHJcblx0Zm9yICh2YXIgeXkgPSBhWzFdOyB5eSA8IGJbMV07IHl5KyspIHtcclxuXHRcdHRoaXMuX21hcFt4XVt5eV0gPSB2YWx1ZTtcclxuXHRcdHZhciBwID0gW3gsIHl5XTtcclxuXHRcdHZhciBwa2V5ID0gdGhpcy5fcG9pbnRLZXkocCk7XHJcblx0XHRjb25uZWN0ZWRbcGtleV0gPSBwO1xyXG5cdFx0ZGVsZXRlIG5vdENvbm5lY3RlZFtwa2V5XTtcclxuXHR9XHJcblx0aWYgKGNvbm5lY3Rpb25DYWxsYmFjayAmJiBhWzFdIDwgYlsxXSkge1xyXG5cdFx0Y29ubmVjdGlvbkNhbGxiYWNrKFtiWzBdLCBhWzFdXSwgW2JbMF0sIGJbMV1dKTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZnJlZVNwYWNlID0gZnVuY3Rpb24oeCwgeSwgdmFsdWUpIHtcclxuXHRyZXR1cm4geCA+PSAwICYmIHggPCB0aGlzLl93aWR0aCAmJiB5ID49IDAgJiYgeSA8IHRoaXMuX2hlaWdodCAmJiB0aGlzLl9tYXBbeF1beV0gPT0gdmFsdWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fcG9pbnRLZXkgPSBmdW5jdGlvbihwKSB7XHJcblx0cmV0dXJuIHBbMF0gKyBcIi5cIiArIHBbMV07XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgRHVuZ2VvbiBtYXA6IGhhcyByb29tcyBhbmQgY29ycmlkb3JzXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwXHJcbiAqL1xyXG5ST1QuTWFwLkR1bmdlb24gPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdHRoaXMuX3Jvb21zID0gW107IC8qIGxpc3Qgb2YgYWxsIHJvb21zICovXHJcblx0dGhpcy5fY29ycmlkb3JzID0gW107XHJcbn07XHJcblJPVC5NYXAuRHVuZ2Vvbi5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG4vKipcclxuICogR2V0IGFsbCBnZW5lcmF0ZWQgcm9vbXNcclxuICogQHJldHVybnMge1JPVC5NYXAuRmVhdHVyZS5Sb29tW119XHJcbiAqL1xyXG5ST1QuTWFwLkR1bmdlb24ucHJvdG90eXBlLmdldFJvb21zID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3Jvb21zO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbGwgZ2VuZXJhdGVkIGNvcnJpZG9yc1xyXG4gKiBAcmV0dXJucyB7Uk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yW119XHJcbiAqL1xyXG5ST1QuTWFwLkR1bmdlb24ucHJvdG90eXBlLmdldENvcnJpZG9ycyA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9jb3JyaWRvcnM7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUmFuZG9tIGR1bmdlb24gZ2VuZXJhdG9yIHVzaW5nIGh1bWFuLWxpa2UgZGlnZ2luZyBwYXR0ZXJucy5cclxuICogSGVhdmlseSBiYXNlZCBvbiBNaWtlIEFuZGVyc29uJ3MgaWRlYXMgZnJvbSB0aGUgXCJUeXJhbnRcIiBhbGdvLCBtZW50aW9uZWQgYXQgXHJcbiAqIGh0dHA6Ly93d3cucm9ndWViYXNpbi5yb2d1ZWxpa2VkZXZlbG9wbWVudC5vcmcvaW5kZXgucGhwP3RpdGxlPUR1bmdlb24tQnVpbGRpbmdfQWxnb3JpdGhtLlxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5EdW5nZW9uXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlciA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcclxuXHRST1QuTWFwLkR1bmdlb24uY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0cm9vbVdpZHRoOiBbMywgOV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSB3aWR0aCAqL1xyXG5cdFx0cm9vbUhlaWdodDogWzMsIDVdLCAvKiByb29tIG1pbmltdW0gYW5kIG1heGltdW0gaGVpZ2h0ICovXHJcblx0XHRjb3JyaWRvckxlbmd0aDogWzMsIDEwXSwgLyogY29ycmlkb3IgbWluaW11bSBhbmQgbWF4aW11bSBsZW5ndGggKi9cclxuXHRcdGR1Z1BlcmNlbnRhZ2U6IDAuMiwgLyogd2Ugc3RvcCBhZnRlciB0aGlzIHBlcmNlbnRhZ2Ugb2YgbGV2ZWwgYXJlYSBoYXMgYmVlbiBkdWcgb3V0ICovXHJcblx0XHR0aW1lTGltaXQ6IDEwMDAgLyogd2Ugc3RvcCBhZnRlciB0aGlzIG11Y2ggdGltZSBoYXMgcGFzc2VkIChtc2VjKSAqL1xyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblx0XHJcblx0dGhpcy5fZmVhdHVyZXMgPSB7XHJcblx0XHRcIlJvb21cIjogNCxcclxuXHRcdFwiQ29ycmlkb3JcIjogNFxyXG5cdH07XHJcblx0dGhpcy5fZmVhdHVyZUF0dGVtcHRzID0gMjA7IC8qIGhvdyBtYW55IHRpbWVzIGRvIHdlIHRyeSB0byBjcmVhdGUgYSBmZWF0dXJlIG9uIGEgc3VpdGFibGUgd2FsbCAqL1xyXG5cdHRoaXMuX3dhbGxzID0ge307IC8qIHRoZXNlIGFyZSBhdmFpbGFibGUgZm9yIGRpZ2dpbmcgKi9cclxuXHRcclxuXHR0aGlzLl9kaWdDYWxsYmFjayA9IHRoaXMuX2RpZ0NhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5fY2FuQmVEdWdDYWxsYmFjayA9IHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHR0aGlzLl9pc1dhbGxDYWxsYmFjayA9IHRoaXMuX2lzV2FsbENhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5fcHJpb3JpdHlXYWxsQ2FsbGJhY2sgPSB0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG59O1xyXG5ST1QuTWFwLkRpZ2dlci5leHRlbmQoUk9ULk1hcC5EdW5nZW9uKTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBtYXBcclxuICogQHNlZSBST1QuTWFwI2NyZWF0ZVxyXG4gKi9cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dGhpcy5fcm9vbXMgPSBbXTtcclxuXHR0aGlzLl9jb3JyaWRvcnMgPSBbXTtcclxuXHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xyXG5cdHRoaXMuX3dhbGxzID0ge307XHJcblx0dGhpcy5fZHVnID0gMDtcclxuXHR2YXIgYXJlYSA9ICh0aGlzLl93aWR0aC0yKSAqICh0aGlzLl9oZWlnaHQtMik7XHJcblxyXG5cdHRoaXMuX2ZpcnN0Um9vbSgpO1xyXG5cdFxyXG5cdHZhciB0MSA9IERhdGUubm93KCk7XHJcblxyXG5cdGRvIHtcclxuXHRcdHZhciB0MiA9IERhdGUubm93KCk7XHJcblx0XHRpZiAodDIgLSB0MSA+IHRoaXMuX29wdGlvbnMudGltZUxpbWl0KSB7IGJyZWFrOyB9XHJcblxyXG5cdFx0LyogZmluZCBhIGdvb2Qgd2FsbCAqL1xyXG5cdFx0dmFyIHdhbGwgPSB0aGlzLl9maW5kV2FsbCgpO1xyXG5cdFx0aWYgKCF3YWxsKSB7IGJyZWFrOyB9IC8qIG5vIG1vcmUgd2FsbHMgKi9cclxuXHRcdFxyXG5cdFx0dmFyIHBhcnRzID0gd2FsbC5zcGxpdChcIixcIik7XHJcblx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcclxuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0dmFyIGRpciA9IHRoaXMuX2dldERpZ2dpbmdEaXJlY3Rpb24oeCwgeSk7XHJcblx0XHRpZiAoIWRpcikgeyBjb250aW51ZTsgfSAvKiB0aGlzIHdhbGwgaXMgbm90IHN1aXRhYmxlICovXHJcblx0XHRcclxuLy9cdFx0Y29uc29sZS5sb2coXCJ3YWxsXCIsIHgsIHkpO1xyXG5cclxuXHRcdC8qIHRyeSBhZGRpbmcgYSBmZWF0dXJlICovXHJcblx0XHR2YXIgZmVhdHVyZUF0dGVtcHRzID0gMDtcclxuXHRcdGRvIHtcclxuXHRcdFx0ZmVhdHVyZUF0dGVtcHRzKys7XHJcblx0XHRcdGlmICh0aGlzLl90cnlGZWF0dXJlKHgsIHksIGRpclswXSwgZGlyWzFdKSkgeyAvKiBmZWF0dXJlIGFkZGVkICovXHJcblx0XHRcdFx0Ly9pZiAodGhpcy5fcm9vbXMubGVuZ3RoICsgdGhpcy5fY29ycmlkb3JzLmxlbmd0aCA9PSAyKSB7IHRoaXMuX3Jvb21zWzBdLmFkZERvb3IoeCwgeSk7IH0gLyogZmlyc3Qgcm9vbSBvZmljaWFsbHkgaGFzIGRvb3JzICovXHJcblx0XHRcdFx0dGhpcy5fcmVtb3ZlU3Vycm91bmRpbmdXYWxscyh4LCB5KTtcclxuXHRcdFx0XHR0aGlzLl9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzKHgtZGlyWzBdLCB5LWRpclsxXSk7XHJcblx0XHRcdFx0YnJlYWs7IFxyXG5cdFx0XHR9XHJcblx0XHR9IHdoaWxlIChmZWF0dXJlQXR0ZW1wdHMgPCB0aGlzLl9mZWF0dXJlQXR0ZW1wdHMpO1xyXG5cdFx0XHJcblx0XHR2YXIgcHJpb3JpdHlXYWxscyA9IDA7XHJcblx0XHRmb3IgKHZhciBpZCBpbiB0aGlzLl93YWxscykgeyBcclxuXHRcdFx0aWYgKHRoaXMuX3dhbGxzW2lkXSA+IDEpIHsgcHJpb3JpdHlXYWxscysrOyB9XHJcblx0XHR9XHJcblxyXG5cdH0gd2hpbGUgKHRoaXMuX2R1Zy9hcmVhIDwgdGhpcy5fb3B0aW9ucy5kdWdQZXJjZW50YWdlIHx8IHByaW9yaXR5V2FsbHMpOyAvKiBmaXhtZSBudW1iZXIgb2YgcHJpb3JpdHkgd2FsbHMgKi9cclxuXHJcblx0dGhpcy5fYWRkRG9vcnMoKTtcclxuXHJcblx0aWYgKGNhbGxiYWNrKSB7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGhpcy5fd2FsbHMgPSB7fTtcclxuXHR0aGlzLl9tYXAgPSBudWxsO1xyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fZGlnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xyXG5cdGlmICh2YWx1ZSA9PSAwIHx8IHZhbHVlID09IDIpIHsgLyogZW1wdHkgKi9cclxuXHRcdHRoaXMuX21hcFt4XVt5XSA9IDA7XHJcblx0XHR0aGlzLl9kdWcrKztcclxuXHR9IGVsc2UgeyAvKiB3YWxsICovXHJcblx0XHR0aGlzLl93YWxsc1t4K1wiLFwiK3ldID0gMTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2lzV2FsbENhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX3dpZHRoIHx8IHkgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9jYW5CZUR1Z0NhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdGlmICh4IDwgMSB8fCB5IDwgMSB8fCB4KzEgPj0gdGhpcy5fd2lkdGggfHwgeSsxID49IHRoaXMuX2hlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRyZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fcHJpb3JpdHlXYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0dGhpcy5fd2FsbHNbeCtcIixcIit5XSA9IDI7XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2ZpcnN0Um9vbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBjeCA9IE1hdGguZmxvb3IodGhpcy5fd2lkdGgvMik7XHJcblx0dmFyIGN5ID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQvMik7XHJcblx0dmFyIHJvb20gPSBST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb21DZW50ZXIoY3gsIGN5LCB0aGlzLl9vcHRpb25zKTtcclxuXHR0aGlzLl9yb29tcy5wdXNoKHJvb20pO1xyXG5cdHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgYSBzdWl0YWJsZSB3YWxsXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2ZpbmRXYWxsID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHByaW8xID0gW107XHJcblx0dmFyIHByaW8yID0gW107XHJcblx0Zm9yICh2YXIgaWQgaW4gdGhpcy5fd2FsbHMpIHtcclxuXHRcdHZhciBwcmlvID0gdGhpcy5fd2FsbHNbaWRdO1xyXG5cdFx0aWYgKHByaW8gPT0gMikgeyBcclxuXHRcdFx0cHJpbzIucHVzaChpZCk7IFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cHJpbzEucHVzaChpZCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHZhciBhcnIgPSAocHJpbzIubGVuZ3RoID8gcHJpbzIgOiBwcmlvMSk7XHJcblx0aWYgKCFhcnIubGVuZ3RoKSB7IHJldHVybiBudWxsOyB9IC8qIG5vIHdhbGxzIDovICovXHJcblx0XHJcblx0dmFyIGlkID0gYXJyLnJhbmRvbSgpO1xyXG5cdGRlbGV0ZSB0aGlzLl93YWxsc1tpZF07XHJcblxyXG5cdHJldHVybiBpZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUcmllcyBhZGRpbmcgYSBmZWF0dXJlXHJcbiAqIEByZXR1cm5zIHtib29sfSB3YXMgdGhpcyBhIHN1Y2Nlc3NmdWwgdHJ5P1xyXG4gKi9cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl90cnlGZWF0dXJlID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5KSB7XHJcblx0dmFyIGZlYXR1cmUgPSBST1QuUk5HLmdldFdlaWdodGVkVmFsdWUodGhpcy5fZmVhdHVyZXMpO1xyXG5cdGZlYXR1cmUgPSBST1QuTWFwLkZlYXR1cmVbZmVhdHVyZV0uY3JlYXRlUmFuZG9tQXQoeCwgeSwgZHgsIGR5LCB0aGlzLl9vcHRpb25zKTtcclxuXHRcclxuXHRpZiAoIWZlYXR1cmUuaXNWYWxpZCh0aGlzLl9pc1dhbGxDYWxsYmFjaywgdGhpcy5fY2FuQmVEdWdDYWxsYmFjaykpIHtcclxuLy9cdFx0Y29uc29sZS5sb2coXCJub3QgdmFsaWRcIik7XHJcbi8vXHRcdGZlYXR1cmUuZGVidWcoKTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0ZmVhdHVyZS5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spO1xyXG4vL1x0ZmVhdHVyZS5kZWJ1ZygpO1xyXG5cclxuXHRpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJPVC5NYXAuRmVhdHVyZS5Sb29tKSB7IHRoaXMuX3Jvb21zLnB1c2goZmVhdHVyZSk7IH1cclxuXHRpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcikgeyBcclxuXHRcdGZlYXR1cmUuY3JlYXRlUHJpb3JpdHlXYWxscyh0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjayk7XHJcblx0XHR0aGlzLl9jb3JyaWRvcnMucHVzaChmZWF0dXJlKTsgXHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzID0gZnVuY3Rpb24oY3gsIGN5KSB7XHJcblx0dmFyIGRlbHRhcyA9IFJPVC5ESVJTWzRdO1xyXG5cclxuXHRmb3IgKHZhciBpPTA7aTxkZWx0YXMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGRlbHRhID0gZGVsdGFzW2ldO1xyXG5cdFx0dmFyIHggPSBjeCArIGRlbHRhWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIGRlbHRhWzFdO1xyXG5cdFx0ZGVsZXRlIHRoaXMuX3dhbGxzW3grXCIsXCIreV07XHJcblx0XHR2YXIgeCA9IGN4ICsgMipkZWx0YVswXTtcclxuXHRcdHZhciB5ID0gY3kgKyAyKmRlbHRhWzFdO1xyXG5cdFx0ZGVsZXRlIHRoaXMuX3dhbGxzW3grXCIsXCIreV07XHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdmVjdG9yIGluIFwiZGlnZ2luZ1wiIGRpcmVjdGlvbiwgb3IgZmFsc2UsIGlmIHRoaXMgZG9lcyBub3QgZXhpc3QgKG9yIGlzIG5vdCB1bmlxdWUpXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2dldERpZ2dpbmdEaXJlY3Rpb24gPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHRpZiAoY3ggPD0gMCB8fCBjeSA8PSAwIHx8IGN4ID49IHRoaXMuX3dpZHRoIC0gMSB8fCBjeSA+PSB0aGlzLl9oZWlnaHQgLSAxKSB7IHJldHVybiBudWxsOyB9XHJcblxyXG5cdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdHZhciBkZWx0YXMgPSBST1QuRElSU1s0XTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTxkZWx0YXMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGRlbHRhID0gZGVsdGFzW2ldO1xyXG5cdFx0dmFyIHggPSBjeCArIGRlbHRhWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIGRlbHRhWzFdO1xyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuX21hcFt4XVt5XSkgeyAvKiB0aGVyZSBhbHJlYWR5IGlzIGFub3RoZXIgZW1wdHkgbmVpZ2hib3IhICovXHJcblx0XHRcdGlmIChyZXN1bHQpIHsgcmV0dXJuIG51bGw7IH1cclxuXHRcdFx0cmVzdWx0ID0gZGVsdGE7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8qIG5vIGVtcHR5IG5laWdoYm9yICovXHJcblx0aWYgKCFyZXN1bHQpIHsgcmV0dXJuIG51bGw7IH1cclxuXHRcclxuXHRyZXR1cm4gWy1yZXN1bHRbMF0sIC1yZXN1bHRbMV1dO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZpbmQgZW1wdHkgc3BhY2VzIHN1cnJvdW5kaW5nIHJvb21zLCBhbmQgYXBwbHkgZG9vcnMuXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2FkZERvb3JzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGRhdGEgPSB0aGlzLl9tYXA7XHJcblx0dmFyIGlzV2FsbENhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdFx0cmV0dXJuIChkYXRhW3hdW3ldID09IDEpO1xyXG5cdH07XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9yb29tcy5sZW5ndGg7IGkrKyApIHtcclxuXHRcdHZhciByb29tID0gdGhpcy5fcm9vbXNbaV07XHJcblx0XHRyb29tLmNsZWFyRG9vcnMoKTtcclxuXHRcdHJvb20uYWRkRG9vcnMoaXNXYWxsQ2FsbGJhY2spO1xyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBEdW5nZW9uIGdlbmVyYXRvciB3aGljaCB0cmllcyB0byBmaWxsIHRoZSBzcGFjZSBldmVubHkuIEdlbmVyYXRlcyBpbmRlcGVuZGVudCByb29tcyBhbmQgdHJpZXMgdG8gY29ubmVjdCB0aGVtLlxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5EdW5nZW9uXHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0gPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0Uk9ULk1hcC5EdW5nZW9uLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblxyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRyb29tV2lkdGg6IFszLCA5XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIHdpZHRoICovXHJcblx0XHRyb29tSGVpZ2h0OiBbMywgNV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSBoZWlnaHQgKi9cclxuXHRcdHJvb21EdWdQZXJjZW50YWdlOiAwLjEsIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBwZXJjZW50YWdlIG9mIGxldmVsIGFyZWEgaGFzIGJlZW4gZHVnIG91dCBieSByb29tcyAqL1xyXG5cdFx0dGltZUxpbWl0OiAxMDAwIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBtdWNoIHRpbWUgaGFzIHBhc3NlZCAobXNlYykgKi9cclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cclxuXHR0aGlzLl9yb29tQXR0ZW1wdHMgPSAyMDsgLyogbmV3IHJvb20gaXMgY3JlYXRlZCBOLXRpbWVzIHVudGlsIGlzIGNvbnNpZGVyZWQgYXMgaW1wb3NzaWJsZSB0byBnZW5lcmF0ZSAqL1xyXG5cdHRoaXMuX2NvcnJpZG9yQXR0ZW1wdHMgPSAyMDsgLyogY29ycmlkb3JzIGFyZSB0cmllZCBOLXRpbWVzIHVudGlsIHRoZSBsZXZlbCBpcyBjb25zaWRlcmVkIGFzIGltcG9zc2libGUgdG8gY29ubmVjdCAqL1xyXG5cclxuXHR0aGlzLl9jb25uZWN0ZWQgPSBbXTsgLyogbGlzdCBvZiBhbHJlYWR5IGNvbm5lY3RlZCByb29tcyAqL1xyXG5cdHRoaXMuX3VuY29ubmVjdGVkID0gW107IC8qIGxpc3Qgb2YgcmVtYWluaW5nIHVuY29ubmVjdGVkIHJvb21zICovXHJcblx0XHJcblx0dGhpcy5fZGlnQ2FsbGJhY2sgPSB0aGlzLl9kaWdDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG5cdHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2sgPSB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5faXNXYWxsQ2FsbGJhY2sgPSB0aGlzLl9pc1dhbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG59O1xyXG5ST1QuTWFwLlVuaWZvcm0uZXh0ZW5kKFJPVC5NYXAuRHVuZ2Vvbik7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbWFwLiBJZiB0aGUgdGltZSBsaW1pdCBoYXMgYmVlbiBoaXQsIHJldHVybnMgbnVsbC5cclxuICogQHNlZSBST1QuTWFwI2NyZWF0ZVxyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciB0MSA9IERhdGUubm93KCk7XHJcblx0d2hpbGUgKDEpIHtcclxuXHRcdHZhciB0MiA9IERhdGUubm93KCk7XHJcblx0XHRpZiAodDIgLSB0MSA+IHRoaXMuX29wdGlvbnMudGltZUxpbWl0KSB7IHJldHVybiBudWxsOyB9IC8qIHRpbWUgbGltaXQhICovXHJcblx0XHJcblx0XHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xyXG5cdFx0dGhpcy5fZHVnID0gMDtcclxuXHRcdHRoaXMuX3Jvb21zID0gW107XHJcblx0XHR0aGlzLl91bmNvbm5lY3RlZCA9IFtdO1xyXG5cdFx0dGhpcy5fZ2VuZXJhdGVSb29tcygpO1xyXG5cdFx0aWYgKHRoaXMuX3Jvb21zLmxlbmd0aCA8IDIpIHsgY29udGludWU7IH1cclxuXHRcdGlmICh0aGlzLl9nZW5lcmF0ZUNvcnJpZG9ycygpKSB7IGJyZWFrOyB9XHJcblx0fVxyXG5cdFxyXG5cdGlmIChjYWxsYmFjaykge1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBhIHN1aXRhYmxlIGFtb3VudCBvZiByb29tc1xyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZ2VuZXJhdGVSb29tcyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciB3ID0gdGhpcy5fd2lkdGgtMjtcclxuXHR2YXIgaCA9IHRoaXMuX2hlaWdodC0yO1xyXG5cclxuXHRkbyB7XHJcblx0XHR2YXIgcm9vbSA9IHRoaXMuX2dlbmVyYXRlUm9vbSgpO1xyXG5cdFx0aWYgKHRoaXMuX2R1Zy8odypoKSA+IHRoaXMuX29wdGlvbnMucm9vbUR1Z1BlcmNlbnRhZ2UpIHsgYnJlYWs7IH0gLyogYWNoaWV2ZWQgcmVxdWVzdGVkIGFtb3VudCBvZiBmcmVlIHNwYWNlICovXHJcblx0fSB3aGlsZSAocm9vbSk7XHJcblxyXG5cdC8qIGVpdGhlciBlbm91Z2ggcm9vbXMsIG9yIG5vdCBhYmxlIHRvIGdlbmVyYXRlIG1vcmUgb2YgdGhlbSA6KSAqL1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRyeSB0byBnZW5lcmF0ZSBvbmUgcm9vbVxyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZ2VuZXJhdGVSb29tID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGNvdW50ID0gMDtcclxuXHR3aGlsZSAoY291bnQgPCB0aGlzLl9yb29tQXR0ZW1wdHMpIHtcclxuXHRcdGNvdW50Kys7XHJcblx0XHRcclxuXHRcdHZhciByb29tID0gUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIHRoaXMuX29wdGlvbnMpO1xyXG5cdFx0aWYgKCFyb29tLmlzVmFsaWQodGhpcy5faXNXYWxsQ2FsbGJhY2ssIHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2spKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRcclxuXHRcdHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcclxuXHRcdHRoaXMuX3Jvb21zLnB1c2gocm9vbSk7XHJcblx0XHRyZXR1cm4gcm9vbTtcclxuXHR9IFxyXG5cclxuXHQvKiBubyByb29tIHdhcyBnZW5lcmF0ZWQgaW4gYSBnaXZlbiBudW1iZXIgb2YgYXR0ZW1wdHMgKi9cclxuXHRyZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgY29ubmVjdG9ycyBiZXdlZW4gcm9vbXNcclxuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3MgV2FzIHRoaXMgYXR0ZW1wdCBzdWNjZXNzZnVsbD9cclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2dlbmVyYXRlQ29ycmlkb3JzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGNudCA9IDA7XHJcblx0d2hpbGUgKGNudCA8IHRoaXMuX2NvcnJpZG9yQXR0ZW1wdHMpIHtcclxuXHRcdGNudCsrO1xyXG5cdFx0dGhpcy5fY29ycmlkb3JzID0gW107XHJcblxyXG5cdFx0LyogZGlnIHJvb21zIGludG8gYSBjbGVhciBtYXAgKi9cclxuXHRcdHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl9yb29tcy5sZW5ndGg7aSsrKSB7IFxyXG5cdFx0XHR2YXIgcm9vbSA9IHRoaXMuX3Jvb21zW2ldO1xyXG5cdFx0XHRyb29tLmNsZWFyRG9vcnMoKTtcclxuXHRcdFx0cm9vbS5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spOyBcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl91bmNvbm5lY3RlZCA9IHRoaXMuX3Jvb21zLnNsaWNlKCkucmFuZG9taXplKCk7XHJcblx0XHR0aGlzLl9jb25uZWN0ZWQgPSBbXTtcclxuXHRcdGlmICh0aGlzLl91bmNvbm5lY3RlZC5sZW5ndGgpIHsgdGhpcy5fY29ubmVjdGVkLnB1c2godGhpcy5fdW5jb25uZWN0ZWQucG9wKCkpOyB9IC8qIGZpcnN0IG9uZSBpcyBhbHdheXMgY29ubmVjdGVkICovXHJcblx0XHRcclxuXHRcdHdoaWxlICgxKSB7XHJcblx0XHRcdC8qIDEuIHBpY2sgcmFuZG9tIGNvbm5lY3RlZCByb29tICovXHJcblx0XHRcdHZhciBjb25uZWN0ZWQgPSB0aGlzLl9jb25uZWN0ZWQucmFuZG9tKCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvKiAyLiBmaW5kIGNsb3Nlc3QgdW5jb25uZWN0ZWQgKi9cclxuXHRcdFx0dmFyIHJvb20xID0gdGhpcy5fY2xvc2VzdFJvb20odGhpcy5fdW5jb25uZWN0ZWQsIGNvbm5lY3RlZCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvKiAzLiBjb25uZWN0IGl0IHRvIGNsb3Nlc3QgY29ubmVjdGVkICovXHJcblx0XHRcdHZhciByb29tMiA9IHRoaXMuX2Nsb3Nlc3RSb29tKHRoaXMuX2Nvbm5lY3RlZCwgcm9vbTEpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIG9rID0gdGhpcy5fY29ubmVjdFJvb21zKHJvb20xLCByb29tMik7XHJcblx0XHRcdGlmICghb2spIHsgYnJlYWs7IH0gLyogc3RvcCBjb25uZWN0aW5nLCByZS1zaHVmZmxlICovXHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIXRoaXMuX3VuY29ubmVjdGVkLmxlbmd0aCkgeyByZXR1cm4gdHJ1ZTsgfSAvKiBkb25lOyBubyByb29tcyByZW1haW4gKi9cclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZvciBhIGdpdmVuIHJvb20sIGZpbmQgdGhlIGNsb3Nlc3Qgb25lIGZyb20gdGhlIGxpc3RcclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2Nsb3Nlc3RSb29tID0gZnVuY3Rpb24ocm9vbXMsIHJvb20pIHtcclxuXHR2YXIgZGlzdCA9IEluZmluaXR5O1xyXG5cdHZhciBjZW50ZXIgPSByb29tLmdldENlbnRlcigpO1xyXG5cdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHJvb21zLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciByID0gcm9vbXNbaV07XHJcblx0XHR2YXIgYyA9IHIuZ2V0Q2VudGVyKCk7XHJcblx0XHR2YXIgZHggPSBjWzBdLWNlbnRlclswXTtcclxuXHRcdHZhciBkeSA9IGNbMV0tY2VudGVyWzFdO1xyXG5cdFx0dmFyIGQgPSBkeCpkeCtkeSpkeTtcclxuXHRcdFxyXG5cdFx0aWYgKGQgPCBkaXN0KSB7XHJcblx0XHRcdGRpc3QgPSBkO1xyXG5cdFx0XHRyZXN1bHQgPSByO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fY29ubmVjdFJvb21zID0gZnVuY3Rpb24ocm9vbTEsIHJvb20yKSB7XHJcblx0LypcclxuXHRcdHJvb20xLmRlYnVnKCk7XHJcblx0XHRyb29tMi5kZWJ1ZygpO1xyXG5cdCovXHJcblxyXG5cdHZhciBjZW50ZXIxID0gcm9vbTEuZ2V0Q2VudGVyKCk7XHJcblx0dmFyIGNlbnRlcjIgPSByb29tMi5nZXRDZW50ZXIoKTtcclxuXHJcblx0dmFyIGRpZmZYID0gY2VudGVyMlswXSAtIGNlbnRlcjFbMF07XHJcblx0dmFyIGRpZmZZID0gY2VudGVyMlsxXSAtIGNlbnRlcjFbMV07XHJcblxyXG5cdGlmIChNYXRoLmFicyhkaWZmWCkgPCBNYXRoLmFicyhkaWZmWSkpIHsgLyogZmlyc3QgdHJ5IGNvbm5lY3Rpbmcgbm9ydGgtc291dGggd2FsbHMgKi9cclxuXHRcdHZhciBkaXJJbmRleDEgPSAoZGlmZlkgPiAwID8gMiA6IDApO1xyXG5cdFx0dmFyIGRpckluZGV4MiA9IChkaXJJbmRleDEgKyAyKSAlIDQ7XHJcblx0XHR2YXIgbWluID0gcm9vbTIuZ2V0TGVmdCgpO1xyXG5cdFx0dmFyIG1heCA9IHJvb20yLmdldFJpZ2h0KCk7XHJcblx0XHR2YXIgaW5kZXggPSAwO1xyXG5cdH0gZWxzZSB7IC8qIGZpcnN0IHRyeSBjb25uZWN0aW5nIGVhc3Qtd2VzdCB3YWxscyAqL1xyXG5cdFx0dmFyIGRpckluZGV4MSA9IChkaWZmWCA+IDAgPyAxIDogMyk7XHJcblx0XHR2YXIgZGlySW5kZXgyID0gKGRpckluZGV4MSArIDIpICUgNDtcclxuXHRcdHZhciBtaW4gPSByb29tMi5nZXRUb3AoKTtcclxuXHRcdHZhciBtYXggPSByb29tMi5nZXRCb3R0b20oKTtcclxuXHRcdHZhciBpbmRleCA9IDE7XHJcblx0fVxyXG5cclxuXHR2YXIgc3RhcnQgPSB0aGlzLl9wbGFjZUluV2FsbChyb29tMSwgZGlySW5kZXgxKTsgLyogY29ycmlkb3Igd2lsbCBzdGFydCBoZXJlICovXHJcblx0aWYgKCFzdGFydCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0aWYgKHN0YXJ0W2luZGV4XSA+PSBtaW4gJiYgc3RhcnRbaW5kZXhdIDw9IG1heCkgeyAvKiBwb3NzaWJsZSB0byBjb25uZWN0IHdpdGggc3RyYWlnaHQgbGluZSAoSS1saWtlKSAqL1xyXG5cdFx0dmFyIGVuZCA9IHN0YXJ0LnNsaWNlKCk7XHJcblx0XHR2YXIgdmFsdWUgPSBudWxsO1xyXG5cdFx0c3dpdGNoIChkaXJJbmRleDIpIHtcclxuXHRcdFx0Y2FzZSAwOiB2YWx1ZSA9IHJvb20yLmdldFRvcCgpLTE7IGJyZWFrO1xyXG5cdFx0XHRjYXNlIDE6IHZhbHVlID0gcm9vbTIuZ2V0UmlnaHQoKSsxOyBicmVhaztcclxuXHRcdFx0Y2FzZSAyOiB2YWx1ZSA9IHJvb20yLmdldEJvdHRvbSgpKzE7IGJyZWFrO1xyXG5cdFx0XHRjYXNlIDM6IHZhbHVlID0gcm9vbTIuZ2V0TGVmdCgpLTE7IGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0ZW5kWyhpbmRleCsxKSUyXSA9IHZhbHVlO1xyXG5cdFx0dGhpcy5fZGlnTGluZShbc3RhcnQsIGVuZF0pO1xyXG5cdFx0XHJcblx0fSBlbHNlIGlmIChzdGFydFtpbmRleF0gPCBtaW4tMSB8fCBzdGFydFtpbmRleF0gPiBtYXgrMSkgeyAvKiBuZWVkIHRvIHN3aXRjaCB0YXJnZXQgd2FsbCAoTC1saWtlKSAqL1xyXG5cclxuXHRcdHZhciBkaWZmID0gc3RhcnRbaW5kZXhdIC0gY2VudGVyMltpbmRleF07XHJcblx0XHRzd2l0Y2ggKGRpckluZGV4Mikge1xyXG5cdFx0XHRjYXNlIDA6XHJcblx0XHRcdGNhc2UgMTpcdHZhciByb3RhdGlvbiA9IChkaWZmIDwgMCA/IDMgOiAxKTsgYnJlYWs7XHJcblx0XHRcdGNhc2UgMjpcclxuXHRcdFx0Y2FzZSAzOlx0dmFyIHJvdGF0aW9uID0gKGRpZmYgPCAwID8gMSA6IDMpOyBicmVhaztcclxuXHRcdH1cclxuXHRcdGRpckluZGV4MiA9IChkaXJJbmRleDIgKyByb3RhdGlvbikgJSA0O1xyXG5cdFx0XHJcblx0XHR2YXIgZW5kID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTIsIGRpckluZGV4Mik7XHJcblx0XHRpZiAoIWVuZCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0XHR2YXIgbWlkID0gWzAsIDBdO1xyXG5cdFx0bWlkW2luZGV4XSA9IHN0YXJ0W2luZGV4XTtcclxuXHRcdHZhciBpbmRleDIgPSAoaW5kZXgrMSklMjtcclxuXHRcdG1pZFtpbmRleDJdID0gZW5kW2luZGV4Ml07XHJcblx0XHR0aGlzLl9kaWdMaW5lKFtzdGFydCwgbWlkLCBlbmRdKTtcclxuXHRcdFxyXG5cdH0gZWxzZSB7IC8qIHVzZSBjdXJyZW50IHdhbGwgcGFpciwgYnV0IGFkanVzdCB0aGUgbGluZSBpbiB0aGUgbWlkZGxlIChTLWxpa2UpICovXHJcblx0XHJcblx0XHR2YXIgaW5kZXgyID0gKGluZGV4KzEpJTI7XHJcblx0XHR2YXIgZW5kID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTIsIGRpckluZGV4Mik7XHJcblx0XHRpZiAoIWVuZCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdHZhciBtaWQgPSBNYXRoLnJvdW5kKChlbmRbaW5kZXgyXSArIHN0YXJ0W2luZGV4Ml0pLzIpO1xyXG5cclxuXHRcdHZhciBtaWQxID0gWzAsIDBdO1xyXG5cdFx0dmFyIG1pZDIgPSBbMCwgMF07XHJcblx0XHRtaWQxW2luZGV4XSA9IHN0YXJ0W2luZGV4XTtcclxuXHRcdG1pZDFbaW5kZXgyXSA9IG1pZDtcclxuXHRcdG1pZDJbaW5kZXhdID0gZW5kW2luZGV4XTtcclxuXHRcdG1pZDJbaW5kZXgyXSA9IG1pZDtcclxuXHRcdHRoaXMuX2RpZ0xpbmUoW3N0YXJ0LCBtaWQxLCBtaWQyLCBlbmRdKTtcclxuXHR9XHJcblxyXG5cdHJvb20xLmFkZERvb3Ioc3RhcnRbMF0sIHN0YXJ0WzFdKTtcclxuXHRyb29tMi5hZGREb29yKGVuZFswXSwgZW5kWzFdKTtcclxuXHRcclxuXHR2YXIgaW5kZXggPSB0aGlzLl91bmNvbm5lY3RlZC5pbmRleE9mKHJvb20xKTtcclxuXHRpZiAoaW5kZXggIT0gLTEpIHtcclxuXHRcdHRoaXMuX3VuY29ubmVjdGVkLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHR0aGlzLl9jb25uZWN0ZWQucHVzaChyb29tMSk7XHJcblx0fVxyXG5cclxuXHR2YXIgaW5kZXggPSB0aGlzLl91bmNvbm5lY3RlZC5pbmRleE9mKHJvb20yKTtcclxuXHRpZiAoaW5kZXggIT0gLTEpIHtcclxuXHRcdHRoaXMuX3VuY29ubmVjdGVkLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHR0aGlzLl9jb25uZWN0ZWQucHVzaChyb29tMik7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fcGxhY2VJbldhbGwgPSBmdW5jdGlvbihyb29tLCBkaXJJbmRleCkge1xyXG5cdHZhciBzdGFydCA9IFswLCAwXTtcclxuXHR2YXIgZGlyID0gWzAsIDBdO1xyXG5cdHZhciBsZW5ndGggPSAwO1xyXG5cdFxyXG5cdHN3aXRjaCAoZGlySW5kZXgpIHtcclxuXHRcdGNhc2UgMDpcclxuXHRcdFx0ZGlyID0gWzEsIDBdO1xyXG5cdFx0XHRzdGFydCA9IFtyb29tLmdldExlZnQoKSwgcm9vbS5nZXRUb3AoKS0xXTtcclxuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRSaWdodCgpLXJvb20uZ2V0TGVmdCgpKzE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMTpcclxuXHRcdFx0ZGlyID0gWzAsIDFdO1xyXG5cdFx0XHRzdGFydCA9IFtyb29tLmdldFJpZ2h0KCkrMSwgcm9vbS5nZXRUb3AoKV07XHJcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0Qm90dG9tKCktcm9vbS5nZXRUb3AoKSsxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDI6XHJcblx0XHRcdGRpciA9IFsxLCAwXTtcclxuXHRcdFx0c3RhcnQgPSBbcm9vbS5nZXRMZWZ0KCksIHJvb20uZ2V0Qm90dG9tKCkrMV07XHJcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0UmlnaHQoKS1yb29tLmdldExlZnQoKSsxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDM6XHJcblx0XHRcdGRpciA9IFswLCAxXTtcclxuXHRcdFx0c3RhcnQgPSBbcm9vbS5nZXRMZWZ0KCktMSwgcm9vbS5nZXRUb3AoKV07XHJcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0Qm90dG9tKCktcm9vbS5nZXRUb3AoKSsxO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG5cdFxyXG5cdHZhciBhdmFpbCA9IFtdO1xyXG5cdHZhciBsYXN0QmFkSW5kZXggPSAtMjtcclxuXHJcblx0Zm9yICh2YXIgaT0wO2k8bGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHggPSBzdGFydFswXSArIGkqZGlyWzBdO1xyXG5cdFx0dmFyIHkgPSBzdGFydFsxXSArIGkqZGlyWzFdO1xyXG5cdFx0YXZhaWwucHVzaChudWxsKTtcclxuXHRcdFxyXG5cdFx0dmFyIGlzV2FsbCA9ICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XHJcblx0XHRpZiAoaXNXYWxsKSB7XHJcblx0XHRcdGlmIChsYXN0QmFkSW5kZXggIT0gaS0xKSB7IGF2YWlsW2ldID0gW3gsIHldOyB9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsYXN0QmFkSW5kZXggPSBpO1xyXG5cdFx0XHRpZiAoaSkgeyBhdmFpbFtpLTFdID0gbnVsbDsgfVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPWF2YWlsLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcclxuXHRcdGlmICghYXZhaWxbaV0pIHsgYXZhaWwuc3BsaWNlKGksIDEpOyB9XHJcblx0fVxyXG5cdHJldHVybiAoYXZhaWwubGVuZ3RoID8gYXZhaWwucmFuZG9tKCkgOiBudWxsKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEaWcgYSBwb2x5bGluZS5cclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2RpZ0xpbmUgPSBmdW5jdGlvbihwb2ludHMpIHtcclxuXHRmb3IgKHZhciBpPTE7aTxwb2ludHMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHN0YXJ0ID0gcG9pbnRzW2ktMV07XHJcblx0XHR2YXIgZW5kID0gcG9pbnRzW2ldO1xyXG5cdFx0dmFyIGNvcnJpZG9yID0gbmV3IFJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcihzdGFydFswXSwgc3RhcnRbMV0sIGVuZFswXSwgZW5kWzFdKTtcclxuXHRcdGNvcnJpZG9yLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XHJcblx0XHR0aGlzLl9jb3JyaWRvcnMucHVzaChjb3JyaWRvcik7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZGlnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xyXG5cdHRoaXMuX21hcFt4XVt5XSA9IHZhbHVlO1xyXG5cdGlmICh2YWx1ZSA9PSAwKSB7IHRoaXMuX2R1ZysrOyB9XHJcbn07XHJcblxyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9pc1dhbGxDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5ID49IHRoaXMuX2hlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRyZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcclxufTtcclxuXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2NhbkJlRHVnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0aWYgKHggPCAxIHx8IHkgPCAxIHx8IHgrMSA+PSB0aGlzLl93aWR0aCB8fCB5KzEgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBhdXRob3IgaHlha3VnZWlcclxuICogQGNsYXNzIER1bmdlb24gZ2VuZXJhdG9yIHdoaWNoIHVzZXMgdGhlIFwib3JnaW5hbFwiIFJvZ3VlIGR1bmdlb24gZ2VuZXJhdGlvbiBhbGdvcml0aG0uIFNlZSBodHRwOi8va3VvaS5jb20vfmthbWlrYXplL0dhbWVEZXNpZ24vYXJ0MDdfcm9ndWVfZHVuZ2Vvbi5waHBcclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICogQHBhcmFtIHtpbnR9IFt3aWR0aD1ST1QuREVGQVVMVF9XSURUSF1cclxuICogQHBhcmFtIHtpbnR9IFtoZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIE9wdGlvbnNcclxuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuY2VsbFdpZHRoPTNdIE51bWJlciBvZiBjZWxscyB0byBjcmVhdGUgb24gdGhlIGhvcml6b250YWwgKG51bWJlciBvZiByb29tcyBob3Jpem9udGFsbHkpXHJcbiAqIEBwYXJhbSB7aW50W119IFtvcHRpb25zLmNlbGxIZWlnaHQ9M10gTnVtYmVyIG9mIGNlbGxzIHRvIGNyZWF0ZSBvbiB0aGUgdmVydGljYWwgKG51bWJlciBvZiByb29tcyB2ZXJ0aWNhbGx5KVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucm9vbVdpZHRoXSBSb29tIG1pbiBhbmQgbWF4IHdpZHRoIC0gbm9ybWFsbHkgc2V0IGF1dG8tbWFnaWNhbGx5IHZpYSB0aGUgY29uc3RydWN0b3IuXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5yb29tSGVpZ2h0XSBSb29tIG1pbiBhbmQgbWF4IGhlaWdodCAtIG5vcm1hbGx5IHNldCBhdXRvLW1hZ2ljYWxseSB2aWEgdGhlIGNvbnN0cnVjdG9yLlxyXG4gKi9cclxuUk9ULk1hcC5Sb2d1ZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0Y2VsbFdpZHRoOiAzLCAgLy8gTk9URSB0byBzZWxmLCB0aGVzZSBjb3VsZCBwcm9iYWJseSB3b3JrIHRoZSBzYW1lIGFzIHRoZSByb29tV2lkdGgvcm9vbSBIZWlnaHQgdmFsdWVzXHJcblx0XHRjZWxsSGVpZ2h0OiAzICAvLyAgICAgaWUuIGFzIGFuIGFycmF5IHdpdGggbWluLW1heCB2YWx1ZXMgZm9yIGVhY2ggZGlyZWN0aW9uLi4uLlxyXG5cdH07XHJcblxyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cclxuXHQvKlxyXG5cdFNldCB0aGUgcm9vbSBzaXplcyBhY2NvcmRpbmcgdG8gdGhlIG92ZXItYWxsIHdpZHRoIG9mIHRoZSBtYXAsXHJcblx0YW5kIHRoZSBjZWxsIHNpemVzLlxyXG5cdCovXHJcblx0aWYgKCF0aGlzLl9vcHRpb25zLmhhc093blByb3BlcnR5KFwicm9vbVdpZHRoXCIpKSB7XHJcblx0XHR0aGlzLl9vcHRpb25zW1wicm9vbVdpZHRoXCJdID0gdGhpcy5fY2FsY3VsYXRlUm9vbVNpemUodGhpcy5fd2lkdGgsIHRoaXMuX29wdGlvbnNbXCJjZWxsV2lkdGhcIl0pO1xyXG5cdH1cclxuXHRpZiAoIXRoaXMuX29wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJyb29tSGVpZ2h0XCIpKSB7XHJcblx0XHR0aGlzLl9vcHRpb25zW1wicm9vbUhlaWdodFwiXSA9IHRoaXMuX2NhbGN1bGF0ZVJvb21TaXplKHRoaXMuX2hlaWdodCwgdGhpcy5fb3B0aW9uc1tcImNlbGxIZWlnaHRcIl0pO1xyXG5cdH1cclxuXHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLmV4dGVuZChST1QuTWFwKTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5NYXAjY3JlYXRlXHJcbiAqL1xyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuXHR0aGlzLm1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0dGhpcy5yb29tcyA9IFtdO1xyXG5cdHRoaXMuY29ubmVjdGVkQ2VsbHMgPSBbXTtcclxuXHJcblx0dGhpcy5faW5pdFJvb21zKCk7XHJcblx0dGhpcy5fY29ubmVjdFJvb21zKCk7XHJcblx0dGhpcy5fY29ubmVjdFVuY29ubmVjdGVkUm9vbXMoKTtcclxuXHR0aGlzLl9jcmVhdGVSYW5kb21Sb29tQ29ubmVjdGlvbnMoKTtcclxuXHR0aGlzLl9jcmVhdGVSb29tcygpO1xyXG5cdHRoaXMuX2NyZWF0ZUNvcnJpZG9ycygpO1xyXG5cclxuXHRpZiAoY2FsbGJhY2spIHtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fd2lkdGg7IGkrKykge1xyXG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soaSwgaiwgdGhpcy5tYXBbaV1bal0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jYWxjdWxhdGVSb29tU2l6ZSA9IGZ1bmN0aW9uIChzaXplLCBjZWxsKSB7XHJcblx0dmFyIG1heCA9IE1hdGguZmxvb3IoKHNpemUvY2VsbCkgKiAwLjgpO1xyXG5cdHZhciBtaW4gPSBNYXRoLmZsb29yKChzaXplL2NlbGwpICogMC4yNSk7XHJcblx0aWYgKG1pbiA8IDIpIHsgbWluID0gMjsgfVxyXG5cdGlmIChtYXggPCAyKSB7IG1heCA9IDI7IH1cclxuXHRyZXR1cm4gW21pbiwgbWF4XTtcclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9pbml0Um9vbXMgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly8gY3JlYXRlIHJvb21zIGFycmF5LiBUaGlzIGlzIHRoZSBcImdyaWRcIiBsaXN0IGZyb20gdGhlIGFsZ28uXHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDsgaSsrKSB7XHJcblx0XHR0aGlzLnJvb21zLnB1c2goW10pO1xyXG5cdFx0Zm9yKHZhciBqID0gMDsgaiA8IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDsgaisrKSB7XHJcblx0XHRcdHRoaXMucm9vbXNbaV0ucHVzaCh7XCJ4XCI6MCwgXCJ5XCI6MCwgXCJ3aWR0aFwiOjAsIFwiaGVpZ2h0XCI6MCwgXCJjb25uZWN0aW9uc1wiOltdLCBcImNlbGx4XCI6aSwgXCJjZWxseVwiOmp9KTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY29ubmVjdFJvb21zID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vcGljayByYW5kb20gc3RhcnRpbmcgZ3JpZFxyXG5cdHZhciBjZ3ggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGgtMSk7XHJcblx0dmFyIGNneSA9IFJPVC5STkcuZ2V0VW5pZm9ybUludCgwLCB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQtMSk7XHJcblxyXG5cdHZhciBpZHg7XHJcblx0dmFyIG5jZ3g7XHJcblx0dmFyIG5jZ3k7XHJcblxyXG5cdHZhciBmb3VuZCA9IGZhbHNlO1xyXG5cdHZhciByb29tO1xyXG5cdHZhciBvdGhlclJvb207XHJcblxyXG5cdC8vIGZpbmQgIHVuY29ubmVjdGVkIG5laWdoYm91ciBjZWxsc1xyXG5cdGRvIHtcclxuXHJcblx0XHQvL3ZhciBkaXJUb0NoZWNrID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddO1xyXG5cdFx0dmFyIGRpclRvQ2hlY2sgPSBbMCwgMiwgNCwgNl07XHJcblx0XHRkaXJUb0NoZWNrID0gZGlyVG9DaGVjay5yYW5kb21pemUoKTtcclxuXHJcblx0XHRkbyB7XHJcblx0XHRcdGZvdW5kID0gZmFsc2U7XHJcblx0XHRcdGlkeCA9IGRpclRvQ2hlY2sucG9wKCk7XHJcblxyXG5cdFx0XHRuY2d4ID0gY2d4ICsgUk9ULkRJUlNbOF1baWR4XVswXTtcclxuXHRcdFx0bmNneSA9IGNneSArIFJPVC5ESVJTWzhdW2lkeF1bMV07XHJcblxyXG5cdFx0XHRpZiAobmNneCA8IDAgfHwgbmNneCA+PSB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aCkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHRpZiAobmNneSA8IDAgfHwgbmNneSA+PSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQpIHsgY29udGludWU7IH1cclxuXHJcblx0XHRcdHJvb20gPSB0aGlzLnJvb21zW2NneF1bY2d5XTtcclxuXHJcblx0XHRcdGlmIChyb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdC8vIGFzIGxvbmcgYXMgdGhpcyByb29tIGRvZXNuJ3QgYWxyZWFkeSBjb29uZWN0IHRvIG1lLCB3ZSBhcmUgb2sgd2l0aCBpdC5cclxuXHRcdFx0XHRpZiAocm9vbVtcImNvbm5lY3Rpb25zXCJdWzBdWzBdID09IG5jZ3ggJiYgcm9vbVtcImNvbm5lY3Rpb25zXCJdWzBdWzFdID09IG5jZ3kpIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tuY2d4XVtuY2d5XTtcclxuXHJcblx0XHRcdGlmIChvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLnB1c2goW2NneCwgY2d5XSk7XHJcblxyXG5cdFx0XHRcdHRoaXMuY29ubmVjdGVkQ2VsbHMucHVzaChbbmNneCwgbmNneV0pO1xyXG5cdFx0XHRcdGNneCA9IG5jZ3g7XHJcblx0XHRcdFx0Y2d5ID0gbmNneTtcclxuXHRcdFx0XHRmb3VuZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9IHdoaWxlIChkaXJUb0NoZWNrLmxlbmd0aCA+IDAgJiYgZm91bmQgPT0gZmFsc2UpO1xyXG5cclxuXHR9IHdoaWxlIChkaXJUb0NoZWNrLmxlbmd0aCA+IDApO1xyXG5cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jb25uZWN0VW5jb25uZWN0ZWRSb29tcyA9IGZ1bmN0aW9uICgpIHtcclxuXHQvL1doaWxlIHRoZXJlIGFyZSB1bmNvbm5lY3RlZCByb29tcywgdHJ5IHRvIGNvbm5lY3QgdGhlbSB0byBhIHJhbmRvbSBjb25uZWN0ZWQgbmVpZ2hib3JcclxuXHQvLyhpZiBhIHJvb20gaGFzIG5vIGNvbm5lY3RlZCBuZWlnaGJvcnMgeWV0LCBqdXN0IGtlZXAgY3ljbGluZywgeW91J2xsIGZpbGwgb3V0IHRvIGl0IGV2ZW50dWFsbHkpLlxyXG5cdHZhciBjdyA9IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoO1xyXG5cdHZhciBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcclxuXHJcblx0dGhpcy5jb25uZWN0ZWRDZWxscyA9IHRoaXMuY29ubmVjdGVkQ2VsbHMucmFuZG9taXplKCk7XHJcblx0dmFyIHJvb207XHJcblx0dmFyIG90aGVyUm9vbTtcclxuXHR2YXIgdmFsaWRSb29tO1xyXG5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoOyBpKyspIHtcclxuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0OyBqKyspICB7XHJcblxyXG5cdFx0XHRyb29tID0gdGhpcy5yb29tc1tpXVtqXTtcclxuXHJcblx0XHRcdGlmIChyb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHR2YXIgZGlyZWN0aW9ucyA9IFswLCAyLCA0LCA2XTtcclxuXHRcdFx0XHRkaXJlY3Rpb25zID0gZGlyZWN0aW9ucy5yYW5kb21pemUoKTtcclxuXHJcblx0XHRcdFx0dmFsaWRSb29tID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdGRvIHtcclxuXHJcblx0XHRcdFx0XHR2YXIgZGlySWR4ID0gZGlyZWN0aW9ucy5wb3AoKTtcclxuXHRcdFx0XHRcdHZhciBuZXdJID0gaSArIFJPVC5ESVJTWzhdW2RpcklkeF1bMF07XHJcblx0XHRcdFx0XHR2YXIgbmV3SiA9IGogKyBST1QuRElSU1s4XVtkaXJJZHhdWzFdO1xyXG5cclxuXHRcdFx0XHRcdGlmIChuZXdJIDwgMCB8fCBuZXdJID49IGN3IHx8IG5ld0ogPCAwIHx8IG5ld0ogPj0gY2gpIHsgY29udGludWU7IH1cclxuXHJcblx0XHRcdFx0XHRvdGhlclJvb20gPSB0aGlzLnJvb21zW25ld0ldW25ld0pdO1xyXG5cclxuXHRcdFx0XHRcdHZhbGlkUm9vbSA9IHRydWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aCA9PSAwKSB7IGJyZWFrOyB9XHJcblxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGg7IGsrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAob3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl1ba11bMF0gPT0gaSAmJiBvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXVtrXVsxXSA9PSBqKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFsaWRSb29tID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAodmFsaWRSb29tKSB7IGJyZWFrOyB9XHJcblxyXG5cdFx0XHRcdH0gd2hpbGUgKGRpcmVjdGlvbnMubGVuZ3RoKTtcclxuXHJcblx0XHRcdFx0aWYgKHZhbGlkUm9vbSkge1xyXG5cdFx0XHRcdFx0cm9vbVtcImNvbm5lY3Rpb25zXCJdLnB1c2goW290aGVyUm9vbVtcImNlbGx4XCJdLCBvdGhlclJvb21bXCJjZWxseVwiXV0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIi0tIFVuYWJsZSB0byBjb25uZWN0IHJvb20uXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jcmVhdGVSYW5kb21Sb29tQ29ubmVjdGlvbnMgPSBmdW5jdGlvbiAoY29ubmVjdGlvbnMpIHtcclxuXHQvLyBFbXB0eSBmb3Igbm93LlxyXG59O1xyXG5cclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jcmVhdGVSb29tcyA9IGZ1bmN0aW9uICgpIHtcclxuXHQvLyBDcmVhdGUgUm9vbXNcclxuXHJcblx0dmFyIHcgPSB0aGlzLl93aWR0aDtcclxuXHR2YXIgaCA9IHRoaXMuX2hlaWdodDtcclxuXHJcblx0dmFyIGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XHJcblx0dmFyIGNoID0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0O1xyXG5cclxuXHR2YXIgY3dwID0gTWF0aC5mbG9vcih0aGlzLl93aWR0aCAvIGN3KTtcclxuXHR2YXIgY2hwID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQgLyBjaCk7XHJcblxyXG5cdHZhciByb29tdztcclxuXHR2YXIgcm9vbWg7XHJcblx0dmFyIHJvb21XaWR0aCA9IHRoaXMuX29wdGlvbnNbXCJyb29tV2lkdGhcIl07XHJcblx0dmFyIHJvb21IZWlnaHQgPSB0aGlzLl9vcHRpb25zW1wicm9vbUhlaWdodFwiXTtcclxuXHR2YXIgc3g7XHJcblx0dmFyIHN5O1xyXG5cdHZhciBvdGhlclJvb207XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY3c7IGkrKykge1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaDsgaisrKSB7XHJcblx0XHRcdHN4ID0gY3dwICogaTtcclxuXHRcdFx0c3kgPSBjaHAgKiBqO1xyXG5cclxuXHRcdFx0aWYgKHN4ID09IDApIHsgc3ggPSAxOyB9XHJcblx0XHRcdGlmIChzeSA9PSAwKSB7IHN5ID0gMTsgfVxyXG5cclxuXHRcdFx0cm9vbXcgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQocm9vbVdpZHRoWzBdLCByb29tV2lkdGhbMV0pO1xyXG5cdFx0XHRyb29taCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChyb29tSGVpZ2h0WzBdLCByb29tSGVpZ2h0WzFdKTtcclxuXHJcblx0XHRcdGlmIChqID4gMCkge1xyXG5cdFx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbaV1bai0xXTtcclxuXHRcdFx0XHR3aGlsZSAoc3kgLSAob3RoZXJSb29tW1wieVwiXSArIG90aGVyUm9vbVtcImhlaWdodFwiXSApIDwgMykge1xyXG5cdFx0XHRcdFx0c3krKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpID4gMCkge1xyXG5cdFx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbaS0xXVtqXTtcclxuXHRcdFx0XHR3aGlsZShzeCAtIChvdGhlclJvb21bXCJ4XCJdICsgb3RoZXJSb29tW1wid2lkdGhcIl0pIDwgMykge1xyXG5cdFx0XHRcdFx0c3grKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBzeE9mZnNldCA9IE1hdGgucm91bmQoUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGN3cC1yb29tdykvMik7XHJcblx0XHRcdHZhciBzeU9mZnNldCA9IE1hdGgucm91bmQoUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGNocC1yb29taCkvMik7XHJcblxyXG5cdFx0XHR3aGlsZSAoc3ggKyBzeE9mZnNldCArIHJvb213ID49IHcpIHtcclxuXHRcdFx0XHRpZihzeE9mZnNldCkge1xyXG5cdFx0XHRcdFx0c3hPZmZzZXQtLTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cm9vbXctLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHdoaWxlIChzeSArIHN5T2Zmc2V0ICsgcm9vbWggPj0gaCkge1xyXG5cdFx0XHRcdGlmKHN5T2Zmc2V0KSB7XHJcblx0XHRcdFx0XHRzeU9mZnNldC0tO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyb29taC0tO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3ggPSBzeCArIHN4T2Zmc2V0O1xyXG5cdFx0XHRzeSA9IHN5ICsgc3lPZmZzZXQ7XHJcblxyXG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wieFwiXSA9IHN4O1xyXG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wieVwiXSA9IHN5O1xyXG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wid2lkdGhcIl0gPSByb29tdztcclxuXHRcdFx0dGhpcy5yb29tc1tpXVtqXVtcImhlaWdodFwiXSA9IHJvb21oO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaWkgPSBzeDsgaWkgPCBzeCArIHJvb213OyBpaSsrKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgamogPSBzeTsgamogPCBzeSArIHJvb21oOyBqaisrKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1hcFtpaV1bampdID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fZ2V0V2FsbFBvc2l0aW9uID0gZnVuY3Rpb24gKGFSb29tLCBhRGlyZWN0aW9uKSB7XHJcblx0dmFyIHJ4O1xyXG5cdHZhciByeTtcclxuXHR2YXIgZG9vcjtcclxuXHJcblx0aWYgKGFEaXJlY3Rpb24gPT0gMSB8fCBhRGlyZWN0aW9uID09IDMpIHtcclxuXHRcdHJ4ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KGFSb29tW1wieFwiXSArIDEsIGFSb29tW1wieFwiXSArIGFSb29tW1wid2lkdGhcIl0gLSAyKTtcclxuXHRcdGlmIChhRGlyZWN0aW9uID09IDEpIHtcclxuXHRcdFx0cnkgPSBhUm9vbVtcInlcIl0gLSAyO1xyXG5cdFx0XHRkb29yID0gcnkgKyAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cnkgPSBhUm9vbVtcInlcIl0gKyBhUm9vbVtcImhlaWdodFwiXSArIDE7XHJcblx0XHRcdGRvb3IgPSByeSAtMTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLm1hcFtyeF1bZG9vcl0gPSAwOyAvLyBpJ20gbm90IHNldHRpbmcgYSBzcGVjaWZpYyAnZG9vcicgdGlsZSB2YWx1ZSByaWdodCBub3csIGp1c3QgZW1wdHkgc3BhY2UuXHJcblxyXG5cdH0gZWxzZSBpZiAoYURpcmVjdGlvbiA9PSAyIHx8IGFEaXJlY3Rpb24gPT0gNCkge1xyXG5cdFx0cnkgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQoYVJvb21bXCJ5XCJdICsgMSwgYVJvb21bXCJ5XCJdICsgYVJvb21bXCJoZWlnaHRcIl0gLSAyKTtcclxuXHRcdGlmKGFEaXJlY3Rpb24gPT0gMikge1xyXG5cdFx0XHRyeCA9IGFSb29tW1wieFwiXSArIGFSb29tW1wid2lkdGhcIl0gKyAxO1xyXG5cdFx0XHRkb29yID0gcnggLSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cnggPSBhUm9vbVtcInhcIl0gLSAyO1xyXG5cdFx0XHRkb29yID0gcnggKyAxO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubWFwW2Rvb3JdW3J5XSA9IDA7IC8vIGknbSBub3Qgc2V0dGluZyBhIHNwZWNpZmljICdkb29yJyB0aWxlIHZhbHVlIHJpZ2h0IG5vdywganVzdCBlbXB0eSBzcGFjZS5cclxuXHJcblx0fVxyXG5cdHJldHVybiBbcngsIHJ5XTtcclxufTtcclxuXHJcbi8qKipcclxuKiBAcGFyYW0gc3RhcnRQb3NpdGlvbiBhIDIgZWxlbWVudCBhcnJheVxyXG4qIEBwYXJhbSBlbmRQb3NpdGlvbiBhIDIgZWxlbWVudCBhcnJheVxyXG4qL1xyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fZHJhd0NvcnJpZG9yID0gZnVuY3Rpb24gKHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uKSB7XHJcblx0dmFyIHhPZmZzZXQgPSBlbmRQb3NpdGlvblswXSAtIHN0YXJ0UG9zaXRpb25bMF07XHJcblx0dmFyIHlPZmZzZXQgPSBlbmRQb3NpdGlvblsxXSAtIHN0YXJ0UG9zaXRpb25bMV07XHJcblxyXG5cdHZhciB4cG9zID0gc3RhcnRQb3NpdGlvblswXTtcclxuXHR2YXIgeXBvcyA9IHN0YXJ0UG9zaXRpb25bMV07XHJcblxyXG5cdHZhciB0ZW1wRGlzdDtcclxuXHR2YXIgeERpcjtcclxuXHR2YXIgeURpcjtcclxuXHJcblx0dmFyIG1vdmU7IC8vIDIgZWxlbWVudCBhcnJheSwgZWxlbWVudCAwIGlzIHRoZSBkaXJlY3Rpb24sIGVsZW1lbnQgMSBpcyB0aGUgdG90YWwgdmFsdWUgdG8gbW92ZS5cclxuXHR2YXIgbW92ZXMgPSBbXTsgLy8gYSBsaXN0IG9mIDIgZWxlbWVudCBhcnJheXNcclxuXHJcblx0dmFyIHhBYnMgPSBNYXRoLmFicyh4T2Zmc2V0KTtcclxuXHR2YXIgeUFicyA9IE1hdGguYWJzKHlPZmZzZXQpO1xyXG5cclxuXHR2YXIgcGVyY2VudCA9IFJPVC5STkcuZ2V0VW5pZm9ybSgpOyAvLyB1c2VkIHRvIHNwbGl0IHRoZSBtb3ZlIGF0IGRpZmZlcmVudCBwbGFjZXMgYWxvbmcgdGhlIGxvbmcgYXhpc1xyXG5cdHZhciBmaXJzdEhhbGYgPSBwZXJjZW50O1xyXG5cdHZhciBzZWNvbmRIYWxmID0gMSAtIHBlcmNlbnQ7XHJcblxyXG5cdHhEaXIgPSB4T2Zmc2V0ID4gMCA/IDIgOiA2O1xyXG5cdHlEaXIgPSB5T2Zmc2V0ID4gMCA/IDQgOiAwO1xyXG5cclxuXHRpZiAoeEFicyA8IHlBYnMpIHtcclxuXHRcdC8vIG1vdmUgZmlyc3RIYWxmIG9mIHRoZSB5IG9mZnNldFxyXG5cdFx0dGVtcERpc3QgPSBNYXRoLmNlaWwoeUFicyAqIGZpcnN0SGFsZik7XHJcblx0XHRtb3Zlcy5wdXNoKFt5RGlyLCB0ZW1wRGlzdF0pO1xyXG5cdFx0Ly8gbW92ZSBhbGwgdGhlIHggb2Zmc2V0XHJcblx0XHRtb3Zlcy5wdXNoKFt4RGlyLCB4QWJzXSk7XHJcblx0XHQvLyBtb3ZlIHNlbmRIYWxmIG9mIHRoZSAgeSBvZmZzZXRcclxuXHRcdHRlbXBEaXN0ID0gTWF0aC5mbG9vcih5QWJzICogc2Vjb25kSGFsZik7XHJcblx0XHRtb3Zlcy5wdXNoKFt5RGlyLCB0ZW1wRGlzdF0pO1xyXG5cdH0gZWxzZSB7XHJcblx0XHQvLyAgbW92ZSBmaXJzdEhhbGYgb2YgdGhlIHggb2Zmc2V0XHJcblx0XHR0ZW1wRGlzdCA9IE1hdGguY2VpbCh4QWJzICogZmlyc3RIYWxmKTtcclxuXHRcdG1vdmVzLnB1c2goW3hEaXIsIHRlbXBEaXN0XSk7XHJcblx0XHQvLyBtb3ZlIGFsbCB0aGUgeSBvZmZzZXRcclxuXHRcdG1vdmVzLnB1c2goW3lEaXIsIHlBYnNdKTtcclxuXHRcdC8vIG1vdmUgc2Vjb25kSGFsZiBvZiB0aGUgeCBvZmZzZXQuXHJcblx0XHR0ZW1wRGlzdCA9IE1hdGguZmxvb3IoeEFicyAqIHNlY29uZEhhbGYpO1xyXG5cdFx0bW92ZXMucHVzaChbeERpciwgdGVtcERpc3RdKTtcclxuXHR9XHJcblxyXG5cdHRoaXMubWFwW3hwb3NdW3lwb3NdID0gMDtcclxuXHJcblx0d2hpbGUgKG1vdmVzLmxlbmd0aCA+IDApIHtcclxuXHRcdG1vdmUgPSBtb3Zlcy5wb3AoKTtcclxuXHRcdHdoaWxlIChtb3ZlWzFdID4gMCkge1xyXG5cdFx0XHR4cG9zICs9IFJPVC5ESVJTWzhdW21vdmVbMF1dWzBdO1xyXG5cdFx0XHR5cG9zICs9IFJPVC5ESVJTWzhdW21vdmVbMF1dWzFdO1xyXG5cdFx0XHR0aGlzLm1hcFt4cG9zXVt5cG9zXSA9IDA7XHJcblx0XHRcdG1vdmVbMV0gPSBtb3ZlWzFdIC0gMTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY3JlYXRlQ29ycmlkb3JzID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vIERyYXcgQ29ycmlkb3JzIGJldHdlZW4gY29ubmVjdGVkIHJvb21zXHJcblxyXG5cdHZhciBjdyA9IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoO1xyXG5cdHZhciBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcclxuXHR2YXIgcm9vbTtcclxuXHR2YXIgY29ubmVjdGlvbjtcclxuXHR2YXIgb3RoZXJSb29tO1xyXG5cdHZhciB3YWxsO1xyXG5cdHZhciBvdGhlcldhbGw7XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY3c7IGkrKykge1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaDsgaisrKSB7XHJcblx0XHRcdHJvb20gPSB0aGlzLnJvb21zW2ldW2pdO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCByb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoOyBrKyspIHtcclxuXHJcblx0XHRcdFx0Y29ubmVjdGlvbiA9IHJvb21bXCJjb25uZWN0aW9uc1wiXVtrXTtcclxuXHJcblx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tjb25uZWN0aW9uWzBdXVtjb25uZWN0aW9uWzFdXTtcclxuXHJcblx0XHRcdFx0Ly8gZmlndXJlIG91dCB3aGF0IHdhbGwgb3VyIGNvcnJpZG9yIHdpbGwgc3RhcnQgb25lLlxyXG5cdFx0XHRcdC8vIGZpZ3VyZSBvdXQgd2hhdCB3YWxsIG91ciBjb3JyaWRvciB3aWxsIGVuZCBvbi5cclxuXHRcdFx0XHRpZiAob3RoZXJSb29tW1wiY2VsbHhcIl0gPiByb29tW1wiY2VsbHhcIl0pIHtcclxuXHRcdFx0XHRcdHdhbGwgPSAyO1xyXG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gNDtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG90aGVyUm9vbVtcImNlbGx4XCJdIDwgcm9vbVtcImNlbGx4XCJdKSB7XHJcblx0XHRcdFx0XHR3YWxsID0gNDtcclxuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDI7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG90aGVyUm9vbVtcImNlbGx5XCJdID4gcm9vbVtcImNlbGx5XCJdKSB7XHJcblx0XHRcdFx0XHR3YWxsID0gMztcclxuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDE7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG90aGVyUm9vbVtcImNlbGx5XCJdIDwgcm9vbVtcImNlbGx5XCJdKSB7XHJcblx0XHRcdFx0XHR3YWxsID0gMTtcclxuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDM7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLl9kcmF3Q29ycmlkb3IodGhpcy5fZ2V0V2FsbFBvc2l0aW9uKHJvb20sIHdhbGwpLCB0aGlzLl9nZXRXYWxsUG9zaXRpb24ob3RoZXJSb29tLCBvdGhlcldhbGwpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBEdW5nZW9uIGZlYXR1cmU7IGhhcyBvd24gLmNyZWF0ZSgpIG1ldGhvZFxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlID0gZnVuY3Rpb24oKSB7fTtcclxuUk9ULk1hcC5GZWF0dXJlLnByb3RvdHlwZS5pc1ZhbGlkID0gZnVuY3Rpb24oY2FuQmVEdWdDYWxsYmFjaykge307XHJcblJPVC5NYXAuRmVhdHVyZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHt9O1xyXG5ST1QuTWFwLkZlYXR1cmUucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24oKSB7fTtcclxuUk9ULk1hcC5GZWF0dXJlLmNyZWF0ZVJhbmRvbUF0ID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5LCBvcHRpb25zKSB7fTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUm9vbVxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5GZWF0dXJlXHJcbiAqIEBwYXJhbSB7aW50fSB4MVxyXG4gKiBAcGFyYW0ge2ludH0geTFcclxuICogQHBhcmFtIHtpbnR9IHgyXHJcbiAqIEBwYXJhbSB7aW50fSB5MlxyXG4gKiBAcGFyYW0ge2ludH0gW2Rvb3JYXVxyXG4gKiBAcGFyYW0ge2ludH0gW2Rvb3JZXVxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20gPSBmdW5jdGlvbih4MSwgeTEsIHgyLCB5MiwgZG9vclgsIGRvb3JZKSB7XHJcblx0dGhpcy5feDEgPSB4MTtcclxuXHR0aGlzLl95MSA9IHkxO1xyXG5cdHRoaXMuX3gyID0geDI7XHJcblx0dGhpcy5feTIgPSB5MjtcclxuXHR0aGlzLl9kb29ycyA9IHt9O1xyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID4gNCkgeyB0aGlzLmFkZERvb3IoZG9vclgsIGRvb3JZKTsgfVxyXG59O1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5leHRlbmQoUk9ULk1hcC5GZWF0dXJlKTtcclxuXHJcbi8qKlxyXG4gKiBSb29tIG9mIHJhbmRvbSBzaXplLCB3aXRoIGEgZ2l2ZW4gZG9vcnMgYW5kIGRpcmVjdGlvblxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tQXQgPSBmdW5jdGlvbih4LCB5LCBkeCwgZHksIG9wdGlvbnMpIHtcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbVdpZHRoWzFdO1xyXG5cdHZhciB3aWR0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbUhlaWdodFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xyXG5cdHZhciBoZWlnaHQgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdGlmIChkeCA9PSAxKSB7IC8qIHRvIHRoZSByaWdodCAqL1xyXG5cdFx0dmFyIHkyID0geSAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiBoZWlnaHQpO1xyXG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgrMSwgeTIsIHgrd2lkdGgsIHkyK2hlaWdodC0xLCB4LCB5KTtcclxuXHR9XHJcblx0XHJcblx0aWYgKGR4ID09IC0xKSB7IC8qIHRvIHRoZSBsZWZ0ICovXHJcblx0XHR2YXIgeTIgPSB5IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIGhlaWdodCk7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoeC13aWR0aCwgeTIsIHgtMSwgeTIraGVpZ2h0LTEsIHgsIHkpO1xyXG5cdH1cclxuXHJcblx0aWYgKGR5ID09IDEpIHsgLyogdG8gdGhlIGJvdHRvbSAqL1xyXG5cdFx0dmFyIHgyID0geCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoeDIsIHkrMSwgeDIrd2lkdGgtMSwgeStoZWlnaHQsIHgsIHkpO1xyXG5cdH1cclxuXHJcblx0aWYgKGR5ID09IC0xKSB7IC8qIHRvIHRoZSB0b3AgKi9cclxuXHRcdHZhciB4MiA9IHggLSBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogd2lkdGgpO1xyXG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgyLCB5LWhlaWdodCwgeDIrd2lkdGgtMSwgeS0xLCB4LCB5KTtcclxuXHR9XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImR4IG9yIGR5IG11c3QgYmUgMSBvciAtMVwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSb29tIG9mIHJhbmRvbSBzaXplLCBwb3NpdGlvbmVkIGFyb3VuZCBjZW50ZXIgY29vcmRzXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb21DZW50ZXIgPSBmdW5jdGlvbihjeCwgY3ksIG9wdGlvbnMpIHtcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbVdpZHRoWzFdO1xyXG5cdHZhciB3aWR0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbUhlaWdodFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xyXG5cdHZhciBoZWlnaHQgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cclxuXHR2YXIgeDEgPSBjeCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqd2lkdGgpO1xyXG5cdHZhciB5MSA9IGN5IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSpoZWlnaHQpO1xyXG5cdHZhciB4MiA9IHgxICsgd2lkdGggLSAxO1xyXG5cdHZhciB5MiA9IHkxICsgaGVpZ2h0IC0gMTtcclxuXHJcblx0cmV0dXJuIG5ldyB0aGlzKHgxLCB5MSwgeDIsIHkyKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSb29tIG9mIHJhbmRvbSBzaXplIHdpdGhpbiBhIGdpdmVuIGRpbWVuc2lvbnNcclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbVdpZHRoWzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21XaWR0aFsxXTtcclxuXHR2YXIgd2lkdGggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21IZWlnaHRbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbUhlaWdodFsxXTtcclxuXHR2YXIgaGVpZ2h0ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHR2YXIgbGVmdCA9IGF2YWlsV2lkdGggLSB3aWR0aCAtIDE7XHJcblx0dmFyIHRvcCA9IGF2YWlsSGVpZ2h0IC0gaGVpZ2h0IC0gMTtcclxuXHJcblx0dmFyIHgxID0gMSArIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqbGVmdCk7XHJcblx0dmFyIHkxID0gMSArIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqdG9wKTtcclxuXHR2YXIgeDIgPSB4MSArIHdpZHRoIC0gMTtcclxuXHR2YXIgeTIgPSB5MSArIGhlaWdodCAtIDE7XHJcblxyXG5cdHJldHVybiBuZXcgdGhpcyh4MSwgeTEsIHgyLCB5Mik7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuYWRkRG9vciA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHR0aGlzLl9kb29yc1t4K1wiLFwiK3ldID0gMTtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufVxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldERvb3JzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fZG9vcnMpIHtcclxuXHRcdHZhciBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XHJcblx0XHRjYWxsYmFjayhwYXJzZUludChwYXJ0c1swXSksIHBhcnNlSW50KHBhcnRzWzFdKSk7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmNsZWFyRG9vcnMgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9kb29ycyA9IHt9O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmFkZERvb3JzID0gZnVuY3Rpb24oaXNXYWxsQ2FsbGJhY2spIHtcclxuXHR2YXIgbGVmdCA9IHRoaXMuX3gxLTE7XHJcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcclxuXHR2YXIgdG9wID0gdGhpcy5feTEtMTtcclxuXHR2YXIgYm90dG9tID0gdGhpcy5feTIrMTtcclxuXHJcblx0Zm9yICh2YXIgeD1sZWZ0OyB4PD1yaWdodDsgeCsrKSB7XHJcblx0XHRmb3IgKHZhciB5PXRvcDsgeTw9Ym90dG9tOyB5KyspIHtcclxuXHRcdFx0aWYgKHggIT0gbGVmdCAmJiB4ICE9IHJpZ2h0ICYmIHkgIT0gdG9wICYmIHkgIT0gYm90dG9tKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRcdGlmIChpc1dhbGxDYWxsYmFjayh4LCB5KSkgeyBjb250aW51ZTsgfVxyXG5cclxuXHRcdFx0dGhpcy5hZGREb29yKHgsIHkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbigpIHtcclxuXHRjb25zb2xlLmxvZyhcInJvb21cIiwgdGhpcy5feDEsIHRoaXMuX3kxLCB0aGlzLl94MiwgdGhpcy5feTIpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmlzVmFsaWQgPSBmdW5jdGlvbihpc1dhbGxDYWxsYmFjaywgY2FuQmVEdWdDYWxsYmFjaykgeyBcclxuXHR2YXIgbGVmdCA9IHRoaXMuX3gxLTE7XHJcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcclxuXHR2YXIgdG9wID0gdGhpcy5feTEtMTtcclxuXHR2YXIgYm90dG9tID0gdGhpcy5feTIrMTtcclxuXHRcclxuXHRmb3IgKHZhciB4PWxlZnQ7IHg8PXJpZ2h0OyB4KyspIHtcclxuXHRcdGZvciAodmFyIHk9dG9wOyB5PD1ib3R0b207IHkrKykge1xyXG5cdFx0XHRpZiAoeCA9PSBsZWZ0IHx8IHggPT0gcmlnaHQgfHwgeSA9PSB0b3AgfHwgeSA9PSBib3R0b20pIHtcclxuXHRcdFx0XHRpZiAoIWlzV2FsbENhbGxiYWNrKHgsIHkpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmICghY2FuQmVEdWdDYWxsYmFjayh4LCB5KSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZGlnQ2FsbGJhY2sgRGlnIGNhbGxiYWNrIHdpdGggYSBzaWduYXR1cmUgKHgsIHksIHZhbHVlKS4gVmFsdWVzOiAwID0gZW1wdHksIDEgPSB3YWxsLCAyID0gZG9vci4gTXVsdGlwbGUgZG9vcnMgYXJlIGFsbG93ZWQuXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHsgXHJcblx0dmFyIGxlZnQgPSB0aGlzLl94MS0xO1xyXG5cdHZhciByaWdodCA9IHRoaXMuX3gyKzE7XHJcblx0dmFyIHRvcCA9IHRoaXMuX3kxLTE7XHJcblx0dmFyIGJvdHRvbSA9IHRoaXMuX3kyKzE7XHJcblx0XHJcblx0dmFyIHZhbHVlID0gMDtcclxuXHRmb3IgKHZhciB4PWxlZnQ7IHg8PXJpZ2h0OyB4KyspIHtcclxuXHRcdGZvciAodmFyIHk9dG9wOyB5PD1ib3R0b207IHkrKykge1xyXG5cdFx0XHRpZiAoeCtcIixcIit5IGluIHRoaXMuX2Rvb3JzKSB7XHJcblx0XHRcdFx0dmFsdWUgPSAyO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHggPT0gbGVmdCB8fCB4ID09IHJpZ2h0IHx8IHkgPT0gdG9wIHx8IHkgPT0gYm90dG9tKSB7XHJcblx0XHRcdFx0dmFsdWUgPSAxO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhbHVlID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkaWdDYWxsYmFjayh4LCB5LCB2YWx1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldENlbnRlciA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiBbTWF0aC5yb3VuZCgodGhpcy5feDEgKyB0aGlzLl94MikvMiksIE1hdGgucm91bmQoKHRoaXMuX3kxICsgdGhpcy5feTIpLzIpXTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5nZXRMZWZ0ID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3gxO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldFJpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3gyO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldFRvcCA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl95MTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5nZXRCb3R0b20gPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5feTI7XHJcbn07XHJcblxyXG4vKipcclxuICogQGNsYXNzIENvcnJpZG9yXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwLkZlYXR1cmVcclxuICogQHBhcmFtIHtpbnR9IHN0YXJ0WFxyXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRZXHJcbiAqIEBwYXJhbSB7aW50fSBlbmRYXHJcbiAqIEBwYXJhbSB7aW50fSBlbmRZXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IgPSBmdW5jdGlvbihzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSkge1xyXG5cdHRoaXMuX3N0YXJ0WCA9IHN0YXJ0WDtcclxuXHR0aGlzLl9zdGFydFkgPSBzdGFydFk7XHJcblx0dGhpcy5fZW5kWCA9IGVuZFg7IFxyXG5cdHRoaXMuX2VuZFkgPSBlbmRZO1xyXG5cdHRoaXMuX2VuZHNXaXRoQVdhbGwgPSB0cnVlO1xyXG59O1xyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IuZXh0ZW5kKFJPVC5NYXAuRmVhdHVyZSk7XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IuY3JlYXRlUmFuZG9tQXQgPSBmdW5jdGlvbih4LCB5LCBkeCwgZHksIG9wdGlvbnMpIHtcclxuXHR2YXIgbWluID0gb3B0aW9ucy5jb3JyaWRvckxlbmd0aFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5jb3JyaWRvckxlbmd0aFsxXTtcclxuXHR2YXIgbGVuZ3RoID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IHRoaXMoeCwgeSwgeCArIGR4Kmxlbmd0aCwgeSArIGR5Kmxlbmd0aCk7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24oKSB7XHJcblx0Y29uc29sZS5sb2coXCJjb3JyaWRvclwiLCB0aGlzLl9zdGFydFgsIHRoaXMuX3N0YXJ0WSwgdGhpcy5fZW5kWCwgdGhpcy5fZW5kWSk7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmlzVmFsaWQgPSBmdW5jdGlvbihpc1dhbGxDYWxsYmFjaywgY2FuQmVEdWdDYWxsYmFjayl7IFxyXG5cdHZhciBzeCA9IHRoaXMuX3N0YXJ0WDtcclxuXHR2YXIgc3kgPSB0aGlzLl9zdGFydFk7XHJcblx0dmFyIGR4ID0gdGhpcy5fZW5kWC1zeDtcclxuXHR2YXIgZHkgPSB0aGlzLl9lbmRZLXN5O1xyXG5cdHZhciBsZW5ndGggPSAxICsgTWF0aC5tYXgoTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpO1xyXG5cdFxyXG5cdGlmIChkeCkgeyBkeCA9IGR4L01hdGguYWJzKGR4KTsgfVxyXG5cdGlmIChkeSkgeyBkeSA9IGR5L01hdGguYWJzKGR5KTsgfVxyXG5cdHZhciBueCA9IGR5O1xyXG5cdHZhciBueSA9IC1keDtcclxuXHRcclxuXHR2YXIgb2sgPSB0cnVlO1xyXG5cdGZvciAodmFyIGk9MDsgaTxsZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHggPSBzeCArIGkqZHg7XHJcblx0XHR2YXIgeSA9IHN5ICsgaSpkeTtcclxuXHJcblx0XHRpZiAoIWNhbkJlRHVnQ2FsbGJhY2soICAgICB4LCAgICAgIHkpKSB7IG9rID0gZmFsc2U7IH1cclxuXHRcdGlmICghaXNXYWxsQ2FsbGJhY2sgICh4ICsgbngsIHkgKyBueSkpIHsgb2sgPSBmYWxzZTsgfVxyXG5cdFx0aWYgKCFpc1dhbGxDYWxsYmFjayAgKHggLSBueCwgeSAtIG55KSkgeyBvayA9IGZhbHNlOyB9XHJcblx0XHRcclxuXHRcdGlmICghb2spIHtcclxuXHRcdFx0bGVuZ3RoID0gaTtcclxuXHRcdFx0dGhpcy5fZW5kWCA9IHgtZHg7XHJcblx0XHRcdHRoaXMuX2VuZFkgPSB5LWR5O1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0LyoqXHJcblx0ICogSWYgdGhlIGxlbmd0aCBkZWdlbmVyYXRlZCwgdGhpcyBjb3JyaWRvciBtaWdodCBiZSBpbnZhbGlkXHJcblx0ICovXHJcblx0IFxyXG5cdC8qIG5vdCBzdXBwb3J0ZWQgKi9cclxuXHRpZiAobGVuZ3RoID09IDApIHsgcmV0dXJuIGZhbHNlOyB9IFxyXG5cdFxyXG5cdCAvKiBsZW5ndGggMSBhbGxvd2VkIG9ubHkgaWYgdGhlIG5leHQgc3BhY2UgaXMgZW1wdHkgKi9cclxuXHRpZiAobGVuZ3RoID09IDEgJiYgaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIFdlIGRvIG5vdCB3YW50IHRoZSBjb3JyaWRvciB0byBjcmFzaCBpbnRvIGEgY29ybmVyIG9mIGEgcm9vbTtcclxuXHQgKiBpZiBhbnkgb2YgdGhlIGVuZGluZyBjb3JuZXJzIGlzIGVtcHR5LCB0aGUgTisxdGggY2VsbCBvZiB0aGlzIGNvcnJpZG9yIG11c3QgYmUgZW1wdHkgdG9vLlxyXG5cdCAqIFxyXG5cdCAqIFNpdHVhdGlvbjpcclxuXHQgKiAjIyMjIyMjMVxyXG5cdCAqIC4uLi4uLi4/XHJcblx0ICogIyMjIyMjIzJcclxuXHQgKiBcclxuXHQgKiBUaGUgY29ycmlkb3Igd2FzIGR1ZyBmcm9tIGxlZnQgdG8gcmlnaHQuXHJcblx0ICogMSwgMiAtIHByb2JsZW1hdGljIGNvcm5lcnMsID8gPSBOKzF0aCBjZWxsIChub3QgZHVnKVxyXG5cdCAqL1xyXG5cdHZhciBmaXJzdENvcm5lckJhZCA9ICFpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHggKyBueCwgdGhpcy5fZW5kWSArIGR5ICsgbnkpO1xyXG5cdHZhciBzZWNvbmRDb3JuZXJCYWQgPSAhaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4IC0gbngsIHRoaXMuX2VuZFkgKyBkeSAtIG55KTtcclxuXHR0aGlzLl9lbmRzV2l0aEFXYWxsID0gaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpO1xyXG5cdGlmICgoZmlyc3RDb3JuZXJCYWQgfHwgc2Vjb25kQ29ybmVyQmFkKSAmJiB0aGlzLl9lbmRzV2l0aEFXYWxsKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaWdDYWxsYmFjayBEaWcgY2FsbGJhY2sgd2l0aCBhIHNpZ25hdHVyZSAoeCwgeSwgdmFsdWUpLiBWYWx1ZXM6IDAgPSBlbXB0eS5cclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHsgXHJcblx0dmFyIHN4ID0gdGhpcy5fc3RhcnRYO1xyXG5cdHZhciBzeSA9IHRoaXMuX3N0YXJ0WTtcclxuXHR2YXIgZHggPSB0aGlzLl9lbmRYLXN4O1xyXG5cdHZhciBkeSA9IHRoaXMuX2VuZFktc3k7XHJcblx0dmFyIGxlbmd0aCA9IDErTWF0aC5tYXgoTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpO1xyXG5cdFxyXG5cdGlmIChkeCkgeyBkeCA9IGR4L01hdGguYWJzKGR4KTsgfVxyXG5cdGlmIChkeSkgeyBkeSA9IGR5L01hdGguYWJzKGR5KTsgfVxyXG5cdHZhciBueCA9IGR5O1xyXG5cdHZhciBueSA9IC1keDtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciB4ID0gc3ggKyBpKmR4O1xyXG5cdFx0dmFyIHkgPSBzeSArIGkqZHk7XHJcblx0XHRkaWdDYWxsYmFjayh4LCB5LCAwKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmNyZWF0ZVByaW9yaXR5V2FsbHMgPSBmdW5jdGlvbihwcmlvcml0eVdhbGxDYWxsYmFjaykge1xyXG5cdGlmICghdGhpcy5fZW5kc1dpdGhBV2FsbCkgeyByZXR1cm47IH1cclxuXHJcblx0dmFyIHN4ID0gdGhpcy5fc3RhcnRYO1xyXG5cdHZhciBzeSA9IHRoaXMuX3N0YXJ0WTtcclxuXHJcblx0dmFyIGR4ID0gdGhpcy5fZW5kWC1zeDtcclxuXHR2YXIgZHkgPSB0aGlzLl9lbmRZLXN5O1xyXG5cdGlmIChkeCkgeyBkeCA9IGR4L01hdGguYWJzKGR4KTsgfVxyXG5cdGlmIChkeSkgeyBkeSA9IGR5L01hdGguYWJzKGR5KTsgfVxyXG5cdHZhciBueCA9IGR5O1xyXG5cdHZhciBueSA9IC1keDtcclxuXHJcblx0cHJpb3JpdHlXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpO1xyXG5cdHByaW9yaXR5V2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBueCwgdGhpcy5fZW5kWSArIG55KTtcclxuXHRwcmlvcml0eVdhbGxDYWxsYmFjayh0aGlzLl9lbmRYIC0gbngsIHRoaXMuX2VuZFkgLSBueSk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQmFzZSBub2lzZSBnZW5lcmF0b3JcclxuICovXHJcblJPVC5Ob2lzZSA9IGZ1bmN0aW9uKCkge1xyXG59O1xyXG5cclxuUk9ULk5vaXNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbih4LCB5KSB7fTtcclxuLyoqXHJcbiAqIEEgc2ltcGxlIDJkIGltcGxlbWVudGF0aW9uIG9mIHNpbXBsZXggbm9pc2UgYnkgT25kcmVqIFphcmFcclxuICpcclxuICogQmFzZWQgb24gYSBzcGVlZC1pbXByb3ZlZCBzaW1wbGV4IG5vaXNlIGFsZ29yaXRobSBmb3IgMkQsIDNEIGFuZCA0RCBpbiBKYXZhLlxyXG4gKiBXaGljaCBpcyBiYXNlZCBvbiBleGFtcGxlIGNvZGUgYnkgU3RlZmFuIEd1c3RhdnNvbiAoc3RlZ3VAaXRuLmxpdS5zZSkuXHJcbiAqIFdpdGggT3B0aW1pc2F0aW9ucyBieSBQZXRlciBFYXN0bWFuIChwZWFzdG1hbkBkcml6emxlLnN0YW5mb3JkLmVkdSkuXHJcbiAqIEJldHRlciByYW5rIG9yZGVyaW5nIG1ldGhvZCBieSBTdGVmYW4gR3VzdGF2c29uIGluIDIwMTIuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyAyRCBzaW1wbGV4IG5vaXNlIGdlbmVyYXRvclxyXG4gKiBAcGFyYW0ge2ludH0gW2dyYWRpZW50cz0yNTZdIFJhbmRvbSBncmFkaWVudHNcclxuICovXHJcblJPVC5Ob2lzZS5TaW1wbGV4ID0gZnVuY3Rpb24oZ3JhZGllbnRzKSB7XHJcblx0Uk9ULk5vaXNlLmNhbGwodGhpcyk7XHJcblxyXG5cdHRoaXMuX0YyID0gMC41ICogKE1hdGguc3FydCgzKSAtIDEpO1xyXG5cdHRoaXMuX0cyID0gKDMgLSBNYXRoLnNxcnQoMykpIC8gNjtcclxuXHJcblx0dGhpcy5fZ3JhZGllbnRzID0gW1xyXG5cdFx0WyAwLCAtMV0sXHJcblx0XHRbIDEsIC0xXSxcclxuXHRcdFsgMSwgIDBdLFxyXG5cdFx0WyAxLCAgMV0sXHJcblx0XHRbIDAsICAxXSxcclxuXHRcdFstMSwgIDFdLFxyXG5cdFx0Wy0xLCAgMF0sXHJcblx0XHRbLTEsIC0xXVxyXG5cdF07XHJcblxyXG5cdHZhciBwZXJtdXRhdGlvbnMgPSBbXTtcclxuXHR2YXIgY291bnQgPSBncmFkaWVudHMgfHwgMjU2O1xyXG5cdGZvciAodmFyIGk9MDtpPGNvdW50O2krKykgeyBwZXJtdXRhdGlvbnMucHVzaChpKTsgfVxyXG5cdHBlcm11dGF0aW9ucyA9IHBlcm11dGF0aW9ucy5yYW5kb21pemUoKTtcclxuXHJcblx0dGhpcy5fcGVybXMgPSBbXTtcclxuXHR0aGlzLl9pbmRleGVzID0gW107XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPDIqY291bnQ7aSsrKSB7XHJcblx0XHR0aGlzLl9wZXJtcy5wdXNoKHBlcm11dGF0aW9uc1tpICUgY291bnRdKTtcclxuXHRcdHRoaXMuX2luZGV4ZXMucHVzaCh0aGlzLl9wZXJtc1tpXSAlIHRoaXMuX2dyYWRpZW50cy5sZW5ndGgpO1xyXG5cdH1cclxuXHJcbn07XHJcblJPVC5Ob2lzZS5TaW1wbGV4LmV4dGVuZChST1QuTm9pc2UpO1xyXG5cclxuUk9ULk5vaXNlLlNpbXBsZXgucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHhpbiwgeWluKSB7XHJcblx0dmFyIHBlcm1zID0gdGhpcy5fcGVybXM7XHJcblx0dmFyIGluZGV4ZXMgPSB0aGlzLl9pbmRleGVzO1xyXG5cdHZhciBjb3VudCA9IHBlcm1zLmxlbmd0aC8yO1xyXG5cdHZhciBHMiA9IHRoaXMuX0cyO1xyXG5cclxuXHR2YXIgbjAgPTAsIG4xID0gMCwgbjIgPSAwLCBnaTsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXHJcblxyXG5cdC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cclxuXHR2YXIgcyA9ICh4aW4gKyB5aW4pICogdGhpcy5fRjI7IC8vIEhhaXJ5IGZhY3RvciBmb3IgMkRcclxuXHR2YXIgaSA9IE1hdGguZmxvb3IoeGluICsgcyk7XHJcblx0dmFyIGogPSBNYXRoLmZsb29yKHlpbiArIHMpO1xyXG5cdHZhciB0ID0gKGkgKyBqKSAqIEcyO1xyXG5cdHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSkgc3BhY2VcclxuXHR2YXIgWTAgPSBqIC0gdDtcclxuXHR2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cclxuXHR2YXIgeTAgPSB5aW4gLSBZMDtcclxuXHJcblx0Ly8gRm9yIHRoZSAyRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhbiBlcXVpbGF0ZXJhbCB0cmlhbmdsZS5cclxuXHQvLyBEZXRlcm1pbmUgd2hpY2ggc2ltcGxleCB3ZSBhcmUgaW4uXHJcblx0dmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xyXG5cdGlmICh4MCA+IHkwKSB7XHJcblx0XHRpMSA9IDE7XHJcblx0XHRqMSA9IDA7XHJcblx0fSBlbHNlIHsgLy8gbG93ZXIgdHJpYW5nbGUsIFhZIG9yZGVyOiAoMCwwKS0+KDEsMCktPigxLDEpXHJcblx0XHRpMSA9IDA7XHJcblx0XHRqMSA9IDE7XHJcblx0fSAvLyB1cHBlciB0cmlhbmdsZSwgWVggb3JkZXI6ICgwLDApLT4oMCwxKS0+KDEsMSlcclxuXHJcblx0Ly8gQSBzdGVwIG9mICgxLDApIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jKSBpbiAoeCx5KSwgYW5kXHJcblx0Ly8gYSBzdGVwIG9mICgwLDEpIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jKSBpbiAoeCx5KSwgd2hlcmVcclxuXHQvLyBjID0gKDMtc3FydCgzKSkvNlxyXG5cdHZhciB4MSA9IHgwIC0gaTEgKyBHMjsgLy8gT2Zmc2V0cyBmb3IgbWlkZGxlIGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcclxuXHR2YXIgeTEgPSB5MCAtIGoxICsgRzI7XHJcblx0dmFyIHgyID0geDAgLSAxICsgMipHMjsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXHJcblx0dmFyIHkyID0geTAgLSAxICsgMipHMjtcclxuXHJcblx0Ly8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSB0aHJlZSBzaW1wbGV4IGNvcm5lcnNcclxuXHR2YXIgaWkgPSBpLm1vZChjb3VudCk7XHJcblx0dmFyIGpqID0gai5tb2QoY291bnQpO1xyXG5cclxuXHQvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXHJcblx0dmFyIHQwID0gMC41IC0geDAqeDAgLSB5MCp5MDtcclxuXHRpZiAodDAgPj0gMCkge1xyXG5cdFx0dDAgKj0gdDA7XHJcblx0XHRnaSA9IGluZGV4ZXNbaWkrcGVybXNbampdXTtcclxuXHRcdHZhciBncmFkID0gdGhpcy5fZ3JhZGllbnRzW2dpXTtcclxuXHRcdG4wID0gdDAgKiB0MCAqIChncmFkWzBdICogeDAgKyBncmFkWzFdICogeTApO1xyXG5cdH1cclxuXHRcclxuXHR2YXIgdDEgPSAwLjUgLSB4MSp4MSAtIHkxKnkxO1xyXG5cdGlmICh0MSA+PSAwKSB7XHJcblx0XHR0MSAqPSB0MTtcclxuXHRcdGdpID0gaW5kZXhlc1tpaStpMStwZXJtc1tqaitqMV1dO1xyXG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xyXG5cdFx0bjEgPSB0MSAqIHQxICogKGdyYWRbMF0gKiB4MSArIGdyYWRbMV0gKiB5MSk7XHJcblx0fVxyXG5cdFxyXG5cdHZhciB0MiA9IDAuNSAtIHgyKngyIC0geTIqeTI7XHJcblx0aWYgKHQyID49IDApIHtcclxuXHRcdHQyICo9IHQyO1xyXG5cdFx0Z2kgPSBpbmRleGVzW2lpKzErcGVybXNbamorMV1dO1xyXG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xyXG5cdFx0bjIgPSB0MiAqIHQyICogKGdyYWRbMF0gKiB4MiArIGdyYWRbMV0gKiB5Mik7XHJcblx0fVxyXG5cclxuXHQvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXHJcblx0Ly8gVGhlIHJlc3VsdCBpcyBzY2FsZWQgdG8gcmV0dXJuIHZhbHVlcyBpbiB0aGUgaW50ZXJ2YWwgWy0xLDFdLlxyXG5cdHJldHVybiA3MCAqIChuMCArIG4xICsgbjIpO1xyXG59XHJcbi8qKlxyXG4gKiBAY2xhc3MgQWJzdHJhY3QgRk9WIGFsZ29yaXRobVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaWdodFBhc3Nlc0NhbGxiYWNrIERvZXMgdGhlIGxpZ2h0IHBhc3MgdGhyb3VnaCB4LHk/XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5PThdIDQvNi84XHJcbiAqL1xyXG5ST1QuRk9WID0gZnVuY3Rpb24obGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdHRoaXMuX2xpZ2h0UGFzc2VzID0gbGlnaHRQYXNzZXNDYWxsYmFjaztcclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0dG9wb2xvZ3k6IDhcclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSAzNjAtZGVncmVlIGNpcmNsZVxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5ST1QuRk9WLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHt9O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhbGwgbmVpZ2hib3JzIGluIGEgY29uY2VudHJpYyByaW5nXHJcbiAqIEBwYXJhbSB7aW50fSBjeCBjZW50ZXIteFxyXG4gKiBAcGFyYW0ge2ludH0gY3kgY2VudGVyLXlcclxuICogQHBhcmFtIHtpbnR9IHIgcmFuZ2VcclxuICovXHJcblJPVC5GT1YucHJvdG90eXBlLl9nZXRDaXJjbGUgPSBmdW5jdGlvbihjeCwgY3ksIHIpIHtcclxuXHR2YXIgcmVzdWx0ID0gW107XHJcblx0dmFyIGRpcnMsIGNvdW50RmFjdG9yLCBzdGFydE9mZnNldDtcclxuXHJcblx0c3dpdGNoICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5KSB7XHJcblx0XHRjYXNlIDQ6XHJcblx0XHRcdGNvdW50RmFjdG9yID0gMTtcclxuXHRcdFx0c3RhcnRPZmZzZXQgPSBbMCwgMV07XHJcblx0XHRcdGRpcnMgPSBbXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bN10sXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bMV0sXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bM10sXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bNV1cclxuXHRcdFx0XTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgNjpcclxuXHRcdFx0ZGlycyA9IFJPVC5ESVJTWzZdO1xyXG5cdFx0XHRjb3VudEZhY3RvciA9IDE7XHJcblx0XHRcdHN0YXJ0T2Zmc2V0ID0gWy0xLCAxXTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgODpcclxuXHRcdFx0ZGlycyA9IFJPVC5ESVJTWzRdO1xyXG5cdFx0XHRjb3VudEZhY3RvciA9IDI7XHJcblx0XHRcdHN0YXJ0T2Zmc2V0ID0gWy0xLCAxXTtcclxuXHRcdGJyZWFrO1xyXG5cdH1cclxuXHJcblx0Lyogc3RhcnRpbmcgbmVpZ2hib3IgKi9cclxuXHR2YXIgeCA9IGN4ICsgc3RhcnRPZmZzZXRbMF0qcjtcclxuXHR2YXIgeSA9IGN5ICsgc3RhcnRPZmZzZXRbMV0qcjtcclxuXHJcblx0LyogY2lyY2xlICovXHJcblx0Zm9yICh2YXIgaT0wO2k8ZGlycy5sZW5ndGg7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajxyKmNvdW50RmFjdG9yO2orKykge1xyXG5cdFx0XHRyZXN1bHQucHVzaChbeCwgeV0pO1xyXG5cdFx0XHR4ICs9IGRpcnNbaV1bMF07XHJcblx0XHRcdHkgKz0gZGlyc1tpXVsxXTtcclxuXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIERpc2NyZXRlIHNoYWRvd2Nhc3RpbmcgYWxnb3JpdGhtLiBPYnNvbGV0ZWQgYnkgUHJlY2lzZSBzaGFkb3djYXN0aW5nLlxyXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxyXG4gKi9cclxuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0Uk9ULkZPVi5jYWxsKHRoaXMsIGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG59O1xyXG5ST1QuRk9WLkRpc2NyZXRlU2hhZG93Y2FzdGluZy5leHRlbmQoUk9ULkZPVik7XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuRk9WI2NvbXB1dGVcclxuICovXHJcblJPVC5GT1YuRGlzY3JldGVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHtcclxuXHR2YXIgY2VudGVyID0gdGhpcy5fY29vcmRzO1xyXG5cdHZhciBtYXAgPSB0aGlzLl9tYXA7XHJcblxyXG5cdC8qIHRoaXMgcGxhY2UgaXMgYWx3YXlzIHZpc2libGUgKi9cclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHJcblx0Lyogc3RhbmRpbmcgaW4gYSBkYXJrIHBsYWNlLiBGSVhNRSBpcyB0aGlzIGEgZ29vZCBpZGVhPyAgKi9cclxuXHRpZiAoIXRoaXMuX2xpZ2h0UGFzc2VzKHgsIHkpKSB7IHJldHVybjsgfVxyXG5cdFxyXG5cdC8qIHN0YXJ0IGFuZCBlbmQgYW5nbGVzICovXHJcblx0dmFyIERBVEEgPSBbXTtcclxuXHRcclxuXHR2YXIgQSwgQiwgY3gsIGN5LCBibG9ja3M7XHJcblxyXG5cdC8qIGFuYWx5emUgc3Vycm91bmRpbmcgY2VsbHMgaW4gY29uY2VudHJpYyByaW5ncywgc3RhcnRpbmcgZnJvbSB0aGUgY2VudGVyICovXHJcblx0Zm9yICh2YXIgcj0xOyByPD1SOyByKyspIHtcclxuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXRDaXJjbGUoeCwgeSwgcik7XHJcblx0XHR2YXIgYW5nbGUgPSAzNjAgLyBuZWlnaGJvcnMubGVuZ3RoO1xyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPG5laWdoYm9ycy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdGN4ID0gbmVpZ2hib3JzW2ldWzBdO1xyXG5cdFx0XHRjeSA9IG5laWdoYm9yc1tpXVsxXTtcclxuXHRcdFx0QSA9IGFuZ2xlICogKGkgLSAwLjUpO1xyXG5cdFx0XHRCID0gQSArIGFuZ2xlO1xyXG5cdFx0XHRcclxuXHRcdFx0YmxvY2tzID0gIXRoaXMuX2xpZ2h0UGFzc2VzKGN4LCBjeSk7XHJcblx0XHRcdGlmICh0aGlzLl92aXNpYmxlQ29vcmRzKE1hdGguZmxvb3IoQSksIE1hdGguY2VpbChCKSwgYmxvY2tzLCBEQVRBKSkgeyBjYWxsYmFjayhjeCwgY3ksIHIsIDEpOyB9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoREFUQS5sZW5ndGggPT0gMiAmJiBEQVRBWzBdID09IDAgJiYgREFUQVsxXSA9PSAzNjApIHsgcmV0dXJuOyB9IC8qIGN1dG9mZj8gKi9cclxuXHJcblx0XHR9IC8qIGZvciBhbGwgY2VsbHMgaW4gdGhpcyByaW5nICovXHJcblx0fSAvKiBmb3IgYWxsIHJpbmdzICovXHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtpbnR9IEEgc3RhcnQgYW5nbGVcclxuICogQHBhcmFtIHtpbnR9IEIgZW5kIGFuZ2xlXHJcbiAqIEBwYXJhbSB7Ym9vbH0gYmxvY2tzIERvZXMgY3VycmVudCBjZWxsIGJsb2NrIHZpc2liaWxpdHk/XHJcbiAqIEBwYXJhbSB7aW50W11bXX0gREFUQSBzaGFkb3dlZCBhbmdsZSBwYWlyc1xyXG4gKi9cclxuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl92aXNpYmxlQ29vcmRzID0gZnVuY3Rpb24oQSwgQiwgYmxvY2tzLCBEQVRBKSB7XHJcblx0aWYgKEEgPCAwKSB7IFxyXG5cdFx0dmFyIHYxID0gYXJndW1lbnRzLmNhbGxlZSgwLCBCLCBibG9ja3MsIERBVEEpO1xyXG5cdFx0dmFyIHYyID0gYXJndW1lbnRzLmNhbGxlZSgzNjArQSwgMzYwLCBibG9ja3MsIERBVEEpO1xyXG5cdFx0cmV0dXJuIHYxIHx8IHYyO1xyXG5cdH1cclxuXHRcclxuXHR2YXIgaW5kZXggPSAwO1xyXG5cdHdoaWxlIChpbmRleCA8IERBVEEubGVuZ3RoICYmIERBVEFbaW5kZXhdIDwgQSkgeyBpbmRleCsrOyB9XHJcblx0XHJcblx0aWYgKGluZGV4ID09IERBVEEubGVuZ3RoKSB7IC8qIGNvbXBsZXRlbHkgbmV3IHNoYWRvdyAqL1xyXG5cdFx0aWYgKGJsb2NrcykgeyBEQVRBLnB1c2goQSwgQik7IH0gXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0dmFyIGNvdW50ID0gMDtcclxuXHRcclxuXHRpZiAoaW5kZXggJSAyKSB7IC8qIHRoaXMgc2hhZG93IHN0YXJ0cyBpbiBhbiBleGlzdGluZyBzaGFkb3csIG9yIHdpdGhpbiBpdHMgZW5kaW5nIGJvdW5kYXJ5ICovXHJcblx0XHR3aGlsZSAoaW5kZXggPCBEQVRBLmxlbmd0aCAmJiBEQVRBW2luZGV4XSA8IEIpIHtcclxuXHRcdFx0aW5kZXgrKztcclxuXHRcdFx0Y291bnQrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKGNvdW50ID09IDApIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcclxuXHRcdGlmIChibG9ja3MpIHsgXHJcblx0XHRcdGlmIChjb3VudCAlIDIpIHtcclxuXHRcdFx0XHREQVRBLnNwbGljZShpbmRleC1jb3VudCwgY291bnQsIEIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblxyXG5cdH0gZWxzZSB7IC8qIHRoaXMgc2hhZG93IHN0YXJ0cyBvdXRzaWRlIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2l0aGluIGEgc3RhcnRpbmcgYm91bmRhcnkgKi9cclxuXHRcdHdoaWxlIChpbmRleCA8IERBVEEubGVuZ3RoICYmIERBVEFbaW5kZXhdIDwgQikge1xyXG5cdFx0XHRpbmRleCsrO1xyXG5cdFx0XHRjb3VudCsrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKiB2aXNpYmxlIHdoZW4gb3V0c2lkZSBhbiBleGlzdGluZyBzaGFkb3csIG9yIHdoZW4gb3ZlcmxhcHBpbmcgKi9cclxuXHRcdGlmIChBID09IERBVEFbaW5kZXgtY291bnRdICYmIGNvdW50ID09IDEpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcclxuXHRcdGlmIChibG9ja3MpIHsgXHJcblx0XHRcdGlmIChjb3VudCAlIDIpIHtcclxuXHRcdFx0XHREQVRBLnNwbGljZShpbmRleC1jb3VudCwgY291bnQsIEEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCwgQSwgQik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFx0XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJlY2lzZSBzaGFkb3djYXN0aW5nIGFsZ29yaXRobVxyXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxyXG4gKi9cclxuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZyA9IGZ1bmN0aW9uKGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHRST1QuRk9WLmNhbGwodGhpcywgbGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucyk7XHJcbn07XHJcblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcuZXh0ZW5kKFJPVC5GT1YpO1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULkZPViNjb21wdXRlXHJcbiAqL1xyXG5ST1QuRk9WLlByZWNpc2VTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHtcclxuXHQvKiB0aGlzIHBsYWNlIGlzIGFsd2F5cyB2aXNpYmxlICovXHJcblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XHJcblxyXG5cdC8qIHN0YW5kaW5nIGluIGEgZGFyayBwbGFjZS4gRklYTUUgaXMgdGhpcyBhIGdvb2QgaWRlYT8gICovXHJcblx0aWYgKCF0aGlzLl9saWdodFBhc3Nlcyh4LCB5KSkgeyByZXR1cm47IH1cclxuXHRcclxuXHQvKiBsaXN0IG9mIGFsbCBzaGFkb3dzICovXHJcblx0dmFyIFNIQURPV1MgPSBbXTtcclxuXHRcclxuXHR2YXIgY3gsIGN5LCBibG9ja3MsIEExLCBBMiwgdmlzaWJpbGl0eTtcclxuXHJcblx0LyogYW5hbHl6ZSBzdXJyb3VuZGluZyBjZWxscyBpbiBjb25jZW50cmljIHJpbmdzLCBzdGFydGluZyBmcm9tIHRoZSBjZW50ZXIgKi9cclxuXHRmb3IgKHZhciByPTE7IHI8PVI7IHIrKykge1xyXG5cdFx0dmFyIG5laWdoYm9ycyA9IHRoaXMuX2dldENpcmNsZSh4LCB5LCByKTtcclxuXHRcdHZhciBuZWlnaGJvckNvdW50ID0gbmVpZ2hib3JzLmxlbmd0aDtcclxuXHJcblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvckNvdW50O2krKykge1xyXG5cdFx0XHRjeCA9IG5laWdoYm9yc1tpXVswXTtcclxuXHRcdFx0Y3kgPSBuZWlnaGJvcnNbaV1bMV07XHJcblx0XHRcdC8qIHNoaWZ0IGhhbGYtYW4tYW5nbGUgYmFja3dhcmRzIHRvIG1haW50YWluIGNvbnNpc3RlbmN5IG9mIDAtdGggY2VsbHMgKi9cclxuXHRcdFx0QTEgPSBbaSA/IDIqaS0xIDogMipuZWlnaGJvckNvdW50LTEsIDIqbmVpZ2hib3JDb3VudF07XHJcblx0XHRcdEEyID0gWzIqaSsxLCAyKm5laWdoYm9yQ291bnRdOyBcclxuXHRcdFx0XHJcblx0XHRcdGJsb2NrcyA9ICF0aGlzLl9saWdodFBhc3NlcyhjeCwgY3kpO1xyXG5cdFx0XHR2aXNpYmlsaXR5ID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KEExLCBBMiwgYmxvY2tzLCBTSEFET1dTKTtcclxuXHRcdFx0aWYgKHZpc2liaWxpdHkpIHsgY2FsbGJhY2soY3gsIGN5LCByLCB2aXNpYmlsaXR5KTsgfVxyXG5cclxuXHRcdFx0aWYgKFNIQURPV1MubGVuZ3RoID09IDIgJiYgU0hBRE9XU1swXVswXSA9PSAwICYmIFNIQURPV1NbMV1bMF0gPT0gU0hBRE9XU1sxXVsxXSkgeyByZXR1cm47IH0gLyogY3V0b2ZmPyAqL1xyXG5cclxuXHRcdH0gLyogZm9yIGFsbCBjZWxscyBpbiB0aGlzIHJpbmcgKi9cclxuXHR9IC8qIGZvciBhbGwgcmluZ3MgKi9cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2ludFsyXX0gQTEgYXJjIHN0YXJ0XHJcbiAqIEBwYXJhbSB7aW50WzJdfSBBMiBhcmMgZW5kXHJcbiAqIEBwYXJhbSB7Ym9vbH0gYmxvY2tzIERvZXMgY3VycmVudCBhcmMgYmxvY2sgdmlzaWJpbGl0eT9cclxuICogQHBhcmFtIHtpbnRbXVtdfSBTSEFET1dTIGxpc3Qgb2YgYWN0aXZlIHNoYWRvd3NcclxuICovXHJcblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl9jaGVja1Zpc2liaWxpdHkgPSBmdW5jdGlvbihBMSwgQTIsIGJsb2NrcywgU0hBRE9XUykge1xyXG5cdGlmIChBMVswXSA+IEEyWzBdKSB7IC8qIHNwbGl0IGludG8gdHdvIHN1Yi1hcmNzICovXHJcblx0XHR2YXIgdjEgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoQTEsIFtBMVsxXSwgQTFbMV1dLCBibG9ja3MsIFNIQURPV1MpO1xyXG5cdFx0dmFyIHYyID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KFswLCAxXSwgQTIsIGJsb2NrcywgU0hBRE9XUyk7XHJcblx0XHRyZXR1cm4gKHYxK3YyKS8yO1xyXG5cdH1cclxuXHJcblx0LyogaW5kZXgxOiBmaXJzdCBzaGFkb3cgPj0gQTEgKi9cclxuXHR2YXIgaW5kZXgxID0gMCwgZWRnZTEgPSBmYWxzZTtcclxuXHR3aGlsZSAoaW5kZXgxIDwgU0hBRE9XUy5sZW5ndGgpIHtcclxuXHRcdHZhciBvbGQgPSBTSEFET1dTW2luZGV4MV07XHJcblx0XHR2YXIgZGlmZiA9IG9sZFswXSpBMVsxXSAtIEExWzBdKm9sZFsxXTtcclxuXHRcdGlmIChkaWZmID49IDApIHsgLyogb2xkID49IEExICovXHJcblx0XHRcdGlmIChkaWZmID09IDAgJiYgIShpbmRleDEgJSAyKSkgeyBlZGdlMSA9IHRydWU7IH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHRpbmRleDErKztcclxuXHR9XHJcblxyXG5cdC8qIGluZGV4MjogbGFzdCBzaGFkb3cgPD0gQTIgKi9cclxuXHR2YXIgaW5kZXgyID0gU0hBRE9XUy5sZW5ndGgsIGVkZ2UyID0gZmFsc2U7XHJcblx0d2hpbGUgKGluZGV4Mi0tKSB7XHJcblx0XHR2YXIgb2xkID0gU0hBRE9XU1tpbmRleDJdO1xyXG5cdFx0dmFyIGRpZmYgPSBBMlswXSpvbGRbMV0gLSBvbGRbMF0qQTJbMV07XHJcblx0XHRpZiAoZGlmZiA+PSAwKSB7IC8qIG9sZCA8PSBBMiAqL1xyXG5cdFx0XHRpZiAoZGlmZiA9PSAwICYmIChpbmRleDIgJSAyKSkgeyBlZGdlMiA9IHRydWU7IH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgdmlzaWJsZSA9IHRydWU7XHJcblx0aWYgKGluZGV4MSA9PSBpbmRleDIgJiYgKGVkZ2UxIHx8IGVkZ2UyKSkgeyAgLyogc3Vic2V0IG9mIGV4aXN0aW5nIHNoYWRvdywgb25lIG9mIHRoZSBlZGdlcyBtYXRjaCAqL1xyXG5cdFx0dmlzaWJsZSA9IGZhbHNlOyBcclxuXHR9IGVsc2UgaWYgKGVkZ2UxICYmIGVkZ2UyICYmIGluZGV4MSsxPT1pbmRleDIgJiYgKGluZGV4MiAlIDIpKSB7IC8qIGNvbXBsZXRlbHkgZXF1aXZhbGVudCB3aXRoIGV4aXN0aW5nIHNoYWRvdyAqL1xyXG5cdFx0dmlzaWJsZSA9IGZhbHNlO1xyXG5cdH0gZWxzZSBpZiAoaW5kZXgxID4gaW5kZXgyICYmIChpbmRleDEgJSAyKSkgeyAvKiBzdWJzZXQgb2YgZXhpc3Rpbmcgc2hhZG93LCBub3QgdG91Y2hpbmcgKi9cclxuXHRcdHZpc2libGUgPSBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0aWYgKCF2aXNpYmxlKSB7IHJldHVybiAwOyB9IC8qIGZhc3QgY2FzZTogbm90IHZpc2libGUgKi9cclxuXHRcclxuXHR2YXIgdmlzaWJsZUxlbmd0aCwgUDtcclxuXHJcblx0LyogY29tcHV0ZSB0aGUgbGVuZ3RoIG9mIHZpc2libGUgYXJjLCBhZGp1c3QgbGlzdCBvZiBzaGFkb3dzIChpZiBibG9ja2luZykgKi9cclxuXHR2YXIgcmVtb3ZlID0gaW5kZXgyLWluZGV4MSsxO1xyXG5cdGlmIChyZW1vdmUgJSAyKSB7XHJcblx0XHRpZiAoaW5kZXgxICUgMikgeyAvKiBmaXJzdCBlZGdlIHdpdGhpbiBleGlzdGluZyBzaGFkb3csIHNlY29uZCBvdXRzaWRlICovXHJcblx0XHRcdHZhciBQID0gU0hBRE9XU1tpbmRleDFdO1xyXG5cdFx0XHR2aXNpYmxlTGVuZ3RoID0gKEEyWzBdKlBbMV0gLSBQWzBdKkEyWzFdKSAvIChQWzFdICogQTJbMV0pO1xyXG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMik7IH1cclxuXHRcdH0gZWxzZSB7IC8qIHNlY29uZCBlZGdlIHdpdGhpbiBleGlzdGluZyBzaGFkb3csIGZpcnN0IG91dHNpZGUgKi9cclxuXHRcdFx0dmFyIFAgPSBTSEFET1dTW2luZGV4Ml07XHJcblx0XHRcdHZpc2libGVMZW5ndGggPSAoUFswXSpBMVsxXSAtIEExWzBdKlBbMV0pIC8gKEExWzFdICogUFsxXSk7XHJcblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUsIEExKTsgfVxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHRpZiAoaW5kZXgxICUgMikgeyAvKiBib3RoIGVkZ2VzIHdpdGhpbiBleGlzdGluZyBzaGFkb3dzICovXHJcblx0XHRcdHZhciBQMSA9IFNIQURPV1NbaW5kZXgxXTtcclxuXHRcdFx0dmFyIFAyID0gU0hBRE9XU1tpbmRleDJdO1xyXG5cdFx0XHR2aXNpYmxlTGVuZ3RoID0gKFAyWzBdKlAxWzFdIC0gUDFbMF0qUDJbMV0pIC8gKFAxWzFdICogUDJbMV0pO1xyXG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlKTsgfVxyXG5cdFx0fSBlbHNlIHsgLyogYm90aCBlZGdlcyBvdXRzaWRlIGV4aXN0aW5nIHNoYWRvd3MgKi9cclxuXHRcdFx0aWYgKGJsb2NrcykgeyBTSEFET1dTLnNwbGljZShpbmRleDEsIHJlbW92ZSwgQTEsIEEyKTsgfVxyXG5cdFx0XHRyZXR1cm4gMTsgLyogd2hvbGUgYXJjIHZpc2libGUhICovXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgYXJjTGVuZ3RoID0gKEEyWzBdKkExWzFdIC0gQTFbMF0qQTJbMV0pIC8gKEExWzFdICogQTJbMV0pO1xyXG5cclxuXHRyZXR1cm4gdmlzaWJsZUxlbmd0aC9hcmNMZW5ndGg7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUmVjdXJzaXZlIHNoYWRvd2Nhc3RpbmcgYWxnb3JpdGhtXHJcbiAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIDQvOCB0b3BvbG9naWVzLCBub3QgaGV4YWdvbmFsLlxyXG4gKiBCYXNlZCBvbiBQZXRlciBIYXJraW5zJyBpbXBsZW1lbnRhdGlvbiBvZiBCasO2cm4gQmVyZ3N0csO2bSdzIGFsZ29yaXRobSBkZXNjcmliZWQgaGVyZTogaHR0cDovL3d3dy5yb2d1ZWJhc2luLmNvbS9pbmRleC5waHA/dGl0bGU9Rk9WX3VzaW5nX3JlY3Vyc2l2ZV9zaGFkb3djYXN0aW5nXHJcbiAqIEBhdWdtZW50cyBST1QuRk9WXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0Uk9ULkZPVi5jYWxsKHRoaXMsIGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG59O1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuZXh0ZW5kKFJPVC5GT1YpO1xyXG5cclxuLyoqIE9jdGFudHMgdXNlZCBmb3IgdHJhbnNsYXRpbmcgcmVjdXJzaXZlIHNoYWRvd2Nhc3Rpbmcgb2Zmc2V0cyAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UUyA9IFtcclxuXHRbLTEsICAwLCAgMCwgIDFdLFxyXG5cdFsgMCwgLTEsICAxLCAgMF0sXHJcblx0WyAwLCAtMSwgLTEsICAwXSxcclxuXHRbLTEsICAwLCAgMCwgLTFdLFxyXG5cdFsgMSwgIDAsICAwLCAtMV0sXHJcblx0WyAwLCAgMSwgLTEsICAwXSxcclxuXHRbIDAsICAxLCAgMSwgIDBdLFxyXG5cdFsgMSwgIDAsICAwLCAgMV1cclxuXTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgMzYwLWRlZ3JlZSBjaXJjbGVcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHtcclxuXHQvL1lvdSBjYW4gYWx3YXlzIHNlZSB5b3VyIG93biB0aWxlXHJcblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbaV0sIFIsIGNhbGxiYWNrKTtcclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDE4MC1kZWdyZWUgYXJjXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcclxuICogQHBhcmFtIHtpbnR9IGRpciBEaXJlY3Rpb24gdG8gbG9vayBpbiAoZXhwcmVzc2VkIGluIGEgUk9ULkRJUlMgdmFsdWUpO1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlMTgwID0gZnVuY3Rpb24oeCwgeSwgUiwgZGlyLCBjYWxsYmFjaykge1xyXG5cdC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHR2YXIgcHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMSArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyBvY3RhbnQgdG8gcmVuZGVyIGEgZnVsbCAxODAgZGVncmVlc1xyXG5cdHZhciBuZXh0UHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMiArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyB0d28gb2N0YW50cyB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXHJcblx0dmFyIG5leHRPY3RhbnQgPSAoZGlyKyAxICsgOCkgJSA4OyAvL05lZWQgdG8gZ3JhYiB0byBuZXh0IG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW25leHRQcmV2aW91c09jdGFudF0sIFIsIGNhbGxiYWNrKTtcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbcHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW2Rpcl0sIFIsIGNhbGxiYWNrKTtcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbbmV4dE9jdGFudF0sIFIsIGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgOTAtZGVncmVlIGFyY1xyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7aW50fSBkaXIgRGlyZWN0aW9uIHRvIGxvb2sgaW4gKGV4cHJlc3NlZCBpbiBhIFJPVC5ESVJTIHZhbHVlKTtcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuY29tcHV0ZTkwID0gZnVuY3Rpb24oeCwgeSwgUiwgZGlyLCBjYWxsYmFjaykge1xyXG5cdC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHR2YXIgcHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMSArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyBvY3RhbnQgdG8gcmVuZGVyIGEgZnVsbCA5MCBkZWdyZWVzXHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW2Rpcl0sIFIsIGNhbGxiYWNrKTtcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbcHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVuZGVyIG9uZSBvY3RhbnQgKDQ1LWRlZ3JlZSBhcmMpIG9mIHRoZSB2aWV3c2hlZFxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gb2N0YW50IE9jdGFudCB0byBiZSByZW5kZXJlZFxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl9yZW5kZXJPY3RhbnQgPSBmdW5jdGlvbih4LCB5LCBvY3RhbnQsIFIsIGNhbGxiYWNrKSB7XHJcblx0Ly9SYWRpdXMgaW5jcmVtZW50ZWQgYnkgMSB0byBwcm92aWRlIHNhbWUgY292ZXJhZ2UgYXJlYSBhcyBvdGhlciBzaGFkb3djYXN0aW5nIHJhZGl1c2VzXHJcblx0dGhpcy5fY2FzdFZpc2liaWxpdHkoeCwgeSwgMSwgMS4wLCAwLjAsIFIgKyAxLCBvY3RhbnRbMF0sIG9jdGFudFsxXSwgb2N0YW50WzJdLCBvY3RhbnRbM10sIGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBY3R1YWxseSBjYWxjdWxhdGVzIHRoZSB2aXNpYmlsaXR5XHJcbiAqIEBwYXJhbSB7aW50fSBzdGFydFggVGhlIHN0YXJ0aW5nIFggY29vcmRpbmF0ZVxyXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRZIFRoZSBzdGFydGluZyBZIGNvb3JkaW5hdGVcclxuICogQHBhcmFtIHtpbnR9IHJvdyBUaGUgcm93IHRvIHJlbmRlclxyXG4gKiBAcGFyYW0ge2Zsb2F0fSB2aXNTbG9wZVN0YXJ0IFRoZSBzbG9wZSB0byBzdGFydCBhdFxyXG4gKiBAcGFyYW0ge2Zsb2F0fSB2aXNTbG9wZUVuZCBUaGUgc2xvcGUgdG8gZW5kIGF0XHJcbiAqIEBwYXJhbSB7aW50fSByYWRpdXMgVGhlIHJhZGl1cyB0byByZWFjaCBvdXQgdG9cclxuICogQHBhcmFtIHtpbnR9IHh4IFxyXG4gKiBAcGFyYW0ge2ludH0geHkgXHJcbiAqIEBwYXJhbSB7aW50fSB5eCBcclxuICogQHBhcmFtIHtpbnR9IHl5IFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gdXNlIHdoZW4gd2UgaGl0IGEgYmxvY2sgdGhhdCBpcyB2aXNpYmxlXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl9jYXN0VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKHN0YXJ0WCwgc3RhcnRZLCByb3csIHZpc1Nsb3BlU3RhcnQsIHZpc1Nsb3BlRW5kLCByYWRpdXMsIHh4LCB4eSwgeXgsIHl5LCBjYWxsYmFjaykge1xyXG5cdGlmKHZpc1Nsb3BlU3RhcnQgPCB2aXNTbG9wZUVuZCkgeyByZXR1cm47IH1cclxuXHRmb3IodmFyIGkgPSByb3c7IGkgPD0gcmFkaXVzOyBpKyspIHtcclxuXHRcdHZhciBkeCA9IC1pIC0gMTtcclxuXHRcdHZhciBkeSA9IC1pO1xyXG5cdFx0dmFyIGJsb2NrZWQgPSBmYWxzZTtcclxuXHRcdHZhciBuZXdTdGFydCA9IDA7XHJcblxyXG5cdFx0Ly8nUm93JyBjb3VsZCBiZSBjb2x1bW4sIG5hbWVzIGhlcmUgYXNzdW1lIG9jdGFudCAwIGFuZCB3b3VsZCBiZSBmbGlwcGVkIGZvciBoYWxmIHRoZSBvY3RhbnRzXHJcblx0XHR3aGlsZShkeCA8PSAwKSB7XHJcblx0XHRcdGR4ICs9IDE7XHJcblxyXG5cdFx0XHQvL1RyYW5zbGF0ZSBmcm9tIHJlbGF0aXZlIGNvb3JkaW5hdGVzIHRvIG1hcCBjb29yZGluYXRlc1xyXG5cdFx0XHR2YXIgbWFwWCA9IHN0YXJ0WCArIGR4ICogeHggKyBkeSAqIHh5O1xyXG5cdFx0XHR2YXIgbWFwWSA9IHN0YXJ0WSArIGR4ICogeXggKyBkeSAqIHl5O1xyXG5cclxuXHRcdFx0Ly9SYW5nZSBvZiB0aGUgcm93XHJcblx0XHRcdHZhciBzbG9wZVN0YXJ0ID0gKGR4IC0gMC41KSAvIChkeSArIDAuNSk7XHJcblx0XHRcdHZhciBzbG9wZUVuZCA9IChkeCArIDAuNSkgLyAoZHkgLSAwLjUpO1xyXG5cdFx0XHJcblx0XHRcdC8vSWdub3JlIGlmIG5vdCB5ZXQgYXQgbGVmdCBlZGdlIG9mIE9jdGFudFxyXG5cdFx0XHRpZihzbG9wZUVuZCA+IHZpc1Nsb3BlU3RhcnQpIHsgY29udGludWU7IH1cclxuXHRcdFx0XHJcblx0XHRcdC8vRG9uZSBpZiBwYXN0IHJpZ2h0IGVkZ2VcclxuXHRcdFx0aWYoc2xvcGVTdGFydCA8IHZpc1Nsb3BlRW5kKSB7IGJyZWFrOyB9XHJcblx0XHRcdFx0XHJcblx0XHRcdC8vSWYgaXQncyBpbiByYW5nZSwgaXQncyB2aXNpYmxlXHJcblx0XHRcdGlmKChkeCAqIGR4ICsgZHkgKiBkeSkgPCAocmFkaXVzICogcmFkaXVzKSkge1xyXG5cdFx0XHRcdGNhbGxiYWNrKG1hcFgsIG1hcFksIGksIDEpO1xyXG5cdFx0XHR9XHJcblx0XHJcblx0XHRcdGlmKCFibG9ja2VkKSB7XHJcblx0XHRcdFx0Ly9JZiB0aWxlIGlzIGEgYmxvY2tpbmcgdGlsZSwgY2FzdCBhcm91bmQgaXRcclxuXHRcdFx0XHRpZighdGhpcy5fbGlnaHRQYXNzZXMobWFwWCwgbWFwWSkgJiYgaSA8IHJhZGl1cykge1xyXG5cdFx0XHRcdFx0YmxvY2tlZCA9IHRydWU7XHJcblx0XHRcdFx0XHR0aGlzLl9jYXN0VmlzaWJpbGl0eShzdGFydFgsIHN0YXJ0WSwgaSArIDEsIHZpc1Nsb3BlU3RhcnQsIHNsb3BlU3RhcnQsIHJhZGl1cywgeHgsIHh5LCB5eCwgeXksIGNhbGxiYWNrKTtcclxuXHRcdFx0XHRcdG5ld1N0YXJ0ID0gc2xvcGVFbmQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vS2VlcCBuYXJyb3dpbmcgaWYgc2Nhbm5pbmcgYWNyb3NzIGEgYmxvY2tcclxuXHRcdFx0XHRpZighdGhpcy5fbGlnaHRQYXNzZXMobWFwWCwgbWFwWSkpIHtcclxuXHRcdFx0XHRcdG5ld1N0YXJ0ID0gc2xvcGVFbmQ7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRcdC8vQmxvY2sgaGFzIGVuZGVkXHJcblx0XHRcdFx0YmxvY2tlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHZpc1Nsb3BlU3RhcnQgPSBuZXdTdGFydDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYoYmxvY2tlZCkgeyBicmVhazsgfVxyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBuYW1lc3BhY2UgQ29sb3Igb3BlcmF0aW9uc1xyXG4gKi9cclxuUk9ULkNvbG9yID0ge1xyXG5cdGZyb21TdHJpbmc6IGZ1bmN0aW9uKHN0cikge1xyXG5cdFx0dmFyIGNhY2hlZCwgcjtcclxuXHRcdGlmIChzdHIgaW4gdGhpcy5fY2FjaGUpIHtcclxuXHRcdFx0Y2FjaGVkID0gdGhpcy5fY2FjaGVbc3RyXTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmIChzdHIuY2hhckF0KDApID09IFwiI1wiKSB7IC8qIGhleCByZ2IgKi9cclxuXHJcblx0XHRcdFx0dmFyIHZhbHVlcyA9IHN0ci5tYXRjaCgvWzAtOWEtZl0vZ2kpLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiBwYXJzZUludCh4LCAxNik7IH0pO1xyXG5cdFx0XHRcdGlmICh2YWx1ZXMubGVuZ3RoID09IDMpIHtcclxuXHRcdFx0XHRcdGNhY2hlZCA9IHZhbHVlcy5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4geCoxNzsgfSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhbHVlc1tpKzFdICs9IDE2KnZhbHVlc1tpXTtcclxuXHRcdFx0XHRcdFx0dmFsdWVzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNhY2hlZCA9IHZhbHVlcztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKChyID0gc3RyLm1hdGNoKC9yZ2JcXCgoWzAtOSwgXSspXFwpL2kpKSkgeyAvKiBkZWNpbWFsIHJnYiAqL1xyXG5cdFx0XHRcdGNhY2hlZCA9IHJbMV0uc3BsaXQoL1xccyosXFxzKi8pLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiBwYXJzZUludCh4KTsgfSk7XHJcblx0XHRcdH0gZWxzZSB7IC8qIGh0bWwgbmFtZSAqL1xyXG5cdFx0XHRcdGNhY2hlZCA9IFswLCAwLCAwXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5fY2FjaGVbc3RyXSA9IGNhY2hlZDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY2FjaGVkLnNsaWNlKCk7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQWRkIHR3byBvciBtb3JlIGNvbG9yc1xyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRhZGQ6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gY29sb3IxLnNsaWNlKCk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRmb3IgKHZhciBqPTE7ajxhcmd1bWVudHMubGVuZ3RoO2orKykge1xyXG5cdFx0XHRcdHJlc3VsdFtpXSArPSBhcmd1bWVudHNbal1baV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQWRkIHR3byBvciBtb3JlIGNvbG9ycywgTU9ESUZJRVMgRklSU1QgQVJHVU1FTlRcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0YWRkXzogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0Y29sb3IxW2ldICs9IGFyZ3VtZW50c1tqXVtpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvbG9yMTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBNdWx0aXBseSAobWl4KSB0d28gb3IgbW9yZSBjb2xvcnNcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0bXVsdGlwbHk6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gY29sb3IxLnNsaWNlKCk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRmb3IgKHZhciBqPTE7ajxhcmd1bWVudHMubGVuZ3RoO2orKykge1xyXG5cdFx0XHRcdHJlc3VsdFtpXSAqPSBhcmd1bWVudHNbal1baV0gLyAyNTU7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVzdWx0W2ldID0gTWF0aC5yb3VuZChyZXN1bHRbaV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBNdWx0aXBseSAobWl4KSB0d28gb3IgbW9yZSBjb2xvcnMsIE1PRElGSUVTIEZJUlNUIEFSR1VNRU5UXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdG11bHRpcGx5XzogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0Y29sb3IxW2ldICo9IGFyZ3VtZW50c1tqXVtpXSAvIDI1NTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb2xvcjFbaV0gPSBNYXRoLnJvdW5kKGNvbG9yMVtpXSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29sb3IxO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEludGVycG9sYXRlIChibGVuZCkgdHdvIGNvbG9ycyB3aXRoIGEgZ2l2ZW4gZmFjdG9yXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHBhcmFtIHtmbG9hdH0gW2ZhY3Rvcj0wLjVdIDAuLjFcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0aW50ZXJwb2xhdGU6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCBmYWN0b3IpIHtcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgeyBmYWN0b3IgPSAwLjU7IH1cclxuXHRcdHZhciByZXN1bHQgPSBjb2xvcjEuc2xpY2UoKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdHJlc3VsdFtpXSA9IE1hdGgucm91bmQocmVzdWx0W2ldICsgZmFjdG9yKihjb2xvcjJbaV0tY29sb3IxW2ldKSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEludGVycG9sYXRlIChibGVuZCkgdHdvIGNvbG9ycyB3aXRoIGEgZ2l2ZW4gZmFjdG9yIGluIEhTTCBtb2RlXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHBhcmFtIHtmbG9hdH0gW2ZhY3Rvcj0wLjVdIDAuLjFcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0aW50ZXJwb2xhdGVIU0w6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCBmYWN0b3IpIHtcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgeyBmYWN0b3IgPSAwLjU7IH1cclxuXHRcdHZhciBoc2wxID0gdGhpcy5yZ2IyaHNsKGNvbG9yMSk7XHJcblx0XHR2YXIgaHNsMiA9IHRoaXMucmdiMmhzbChjb2xvcjIpO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0aHNsMVtpXSArPSBmYWN0b3IqKGhzbDJbaV0taHNsMVtpXSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcy5oc2wycmdiKGhzbDEpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZSBhIG5ldyByYW5kb20gY29sb3IgYmFzZWQgb24gdGhpcyBvbmVcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGRpZmYgU2V0IG9mIHN0YW5kYXJkIGRldmlhdGlvbnNcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0cmFuZG9taXplOiBmdW5jdGlvbihjb2xvciwgZGlmZikge1xyXG5cdFx0aWYgKCEoZGlmZiBpbnN0YW5jZW9mIEFycmF5KSkgeyBkaWZmID0gTWF0aC5yb3VuZChST1QuUk5HLmdldE5vcm1hbCgwLCBkaWZmKSk7IH1cclxuXHRcdHZhciByZXN1bHQgPSBjb2xvci5zbGljZSgpO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0cmVzdWx0W2ldICs9IChkaWZmIGluc3RhbmNlb2YgQXJyYXkgPyBNYXRoLnJvdW5kKFJPVC5STkcuZ2V0Tm9ybWFsKDAsIGRpZmZbaV0pKSA6IGRpZmYpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0cyBhbiBSR0IgY29sb3IgdmFsdWUgdG8gSFNMLiBFeHBlY3RzIDAuLjI1NSBpbnB1dHMsIHByb2R1Y2VzIDAuLjEgb3V0cHV0cy5cclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRyZ2IyaHNsOiBmdW5jdGlvbihjb2xvcikge1xyXG5cdFx0dmFyIHIgPSBjb2xvclswXS8yNTU7XHJcblx0XHR2YXIgZyA9IGNvbG9yWzFdLzI1NTtcclxuXHRcdHZhciBiID0gY29sb3JbMl0vMjU1O1xyXG5cclxuXHRcdHZhciBtYXggPSBNYXRoLm1heChyLCBnLCBiKSwgbWluID0gTWF0aC5taW4ociwgZywgYik7XHJcblx0XHR2YXIgaCwgcywgbCA9IChtYXggKyBtaW4pIC8gMjtcclxuXHJcblx0XHRpZiAobWF4ID09IG1pbikge1xyXG5cdFx0XHRoID0gcyA9IDA7IC8vIGFjaHJvbWF0aWNcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBkID0gbWF4IC0gbWluO1xyXG5cdFx0XHRzID0gKGwgPiAwLjUgPyBkIC8gKDIgLSBtYXggLSBtaW4pIDogZCAvIChtYXggKyBtaW4pKTtcclxuXHRcdFx0c3dpdGNoKG1heCkge1xyXG5cdFx0XHRcdGNhc2UgcjogaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApOyBicmVhaztcclxuXHRcdFx0XHRjYXNlIGc6IGggPSAoYiAtIHIpIC8gZCArIDI7IGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgYjogaCA9IChyIC0gZykgLyBkICsgNDsgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0aCAvPSA2O1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBbaCwgcywgbF07XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydHMgYW4gSFNMIGNvbG9yIHZhbHVlIHRvIFJHQi4gRXhwZWN0cyAwLi4xIGlucHV0cywgcHJvZHVjZXMgMC4uMjU1IG91dHB1dHMuXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3JcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0aHNsMnJnYjogZnVuY3Rpb24oY29sb3IpIHtcclxuXHRcdHZhciBsID0gY29sb3JbMl07XHJcblxyXG5cdFx0aWYgKGNvbG9yWzFdID09IDApIHtcclxuXHRcdFx0bCA9IE1hdGgucm91bmQobCoyNTUpO1xyXG5cdFx0XHRyZXR1cm4gW2wsIGwsIGxdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGh1ZTJyZ2IgPSBmdW5jdGlvbihwLCBxLCB0KSB7XHJcblx0XHRcdFx0aWYgKHQgPCAwKSB0ICs9IDE7XHJcblx0XHRcdFx0aWYgKHQgPiAxKSB0IC09IDE7XHJcblx0XHRcdFx0aWYgKHQgPCAxLzYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xyXG5cdFx0XHRcdGlmICh0IDwgMS8yKSByZXR1cm4gcTtcclxuXHRcdFx0XHRpZiAodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcclxuXHRcdFx0XHRyZXR1cm4gcDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHMgPSBjb2xvclsxXTtcclxuXHRcdFx0dmFyIHEgPSAobCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcyk7XHJcblx0XHRcdHZhciBwID0gMiAqIGwgLSBxO1xyXG5cdFx0XHR2YXIgciA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0gKyAxLzMpO1xyXG5cdFx0XHR2YXIgZyA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0pO1xyXG5cdFx0XHR2YXIgYiA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0gLSAxLzMpO1xyXG5cdFx0XHRyZXR1cm4gW01hdGgucm91bmQocioyNTUpLCBNYXRoLnJvdW5kKGcqMjU1KSwgTWF0aC5yb3VuZChiKjI1NSldO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHRvUkdCOiBmdW5jdGlvbihjb2xvcikge1xyXG5cdFx0cmV0dXJuIFwicmdiKFwiICsgdGhpcy5fY2xhbXAoY29sb3JbMF0pICsgXCIsXCIgKyB0aGlzLl9jbGFtcChjb2xvclsxXSkgKyBcIixcIiArIHRoaXMuX2NsYW1wKGNvbG9yWzJdKSArIFwiKVwiO1xyXG5cdH0sXHJcblxyXG5cdHRvSGV4OiBmdW5jdGlvbihjb2xvcikge1xyXG5cdFx0dmFyIHBhcnRzID0gW107XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRwYXJ0cy5wdXNoKHRoaXMuX2NsYW1wKGNvbG9yW2ldKS50b1N0cmluZygxNikubHBhZChcIjBcIiwgMikpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIFwiI1wiICsgcGFydHMuam9pbihcIlwiKTtcclxuXHR9LFxyXG5cclxuXHRfY2xhbXA6IGZ1bmN0aW9uKG51bSkge1xyXG5cdFx0aWYgKG51bSA8IDApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9IGVsc2UgaWYgKG51bSA+IDI1NSkge1xyXG5cdFx0XHRyZXR1cm4gMjU1O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIG51bTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfY2FjaGU6IHtcclxuXHRcdFwiYmxhY2tcIjogWzAsMCwwXSxcclxuXHRcdFwibmF2eVwiOiBbMCwwLDEyOF0sXHJcblx0XHRcImRhcmtibHVlXCI6IFswLDAsMTM5XSxcclxuXHRcdFwibWVkaXVtYmx1ZVwiOiBbMCwwLDIwNV0sXHJcblx0XHRcImJsdWVcIjogWzAsMCwyNTVdLFxyXG5cdFx0XCJkYXJrZ3JlZW5cIjogWzAsMTAwLDBdLFxyXG5cdFx0XCJncmVlblwiOiBbMCwxMjgsMF0sXHJcblx0XHRcInRlYWxcIjogWzAsMTI4LDEyOF0sXHJcblx0XHRcImRhcmtjeWFuXCI6IFswLDEzOSwxMzldLFxyXG5cdFx0XCJkZWVwc2t5Ymx1ZVwiOiBbMCwxOTEsMjU1XSxcclxuXHRcdFwiZGFya3R1cnF1b2lzZVwiOiBbMCwyMDYsMjA5XSxcclxuXHRcdFwibWVkaXVtc3ByaW5nZ3JlZW5cIjogWzAsMjUwLDE1NF0sXHJcblx0XHRcImxpbWVcIjogWzAsMjU1LDBdLFxyXG5cdFx0XCJzcHJpbmdncmVlblwiOiBbMCwyNTUsMTI3XSxcclxuXHRcdFwiYXF1YVwiOiBbMCwyNTUsMjU1XSxcclxuXHRcdFwiY3lhblwiOiBbMCwyNTUsMjU1XSxcclxuXHRcdFwibWlkbmlnaHRibHVlXCI6IFsyNSwyNSwxMTJdLFxyXG5cdFx0XCJkb2RnZXJibHVlXCI6IFszMCwxNDQsMjU1XSxcclxuXHRcdFwiZm9yZXN0Z3JlZW5cIjogWzM0LDEzOSwzNF0sXHJcblx0XHRcInNlYWdyZWVuXCI6IFs0NiwxMzksODddLFxyXG5cdFx0XCJkYXJrc2xhdGVncmF5XCI6IFs0Nyw3OSw3OV0sXHJcblx0XHRcImRhcmtzbGF0ZWdyZXlcIjogWzQ3LDc5LDc5XSxcclxuXHRcdFwibGltZWdyZWVuXCI6IFs1MCwyMDUsNTBdLFxyXG5cdFx0XCJtZWRpdW1zZWFncmVlblwiOiBbNjAsMTc5LDExM10sXHJcblx0XHRcInR1cnF1b2lzZVwiOiBbNjQsMjI0LDIwOF0sXHJcblx0XHRcInJveWFsYmx1ZVwiOiBbNjUsMTA1LDIyNV0sXHJcblx0XHRcInN0ZWVsYmx1ZVwiOiBbNzAsMTMwLDE4MF0sXHJcblx0XHRcImRhcmtzbGF0ZWJsdWVcIjogWzcyLDYxLDEzOV0sXHJcblx0XHRcIm1lZGl1bXR1cnF1b2lzZVwiOiBbNzIsMjA5LDIwNF0sXHJcblx0XHRcImluZGlnb1wiOiBbNzUsMCwxMzBdLFxyXG5cdFx0XCJkYXJrb2xpdmVncmVlblwiOiBbODUsMTA3LDQ3XSxcclxuXHRcdFwiY2FkZXRibHVlXCI6IFs5NSwxNTgsMTYwXSxcclxuXHRcdFwiY29ybmZsb3dlcmJsdWVcIjogWzEwMCwxNDksMjM3XSxcclxuXHRcdFwibWVkaXVtYXF1YW1hcmluZVwiOiBbMTAyLDIwNSwxNzBdLFxyXG5cdFx0XCJkaW1ncmF5XCI6IFsxMDUsMTA1LDEwNV0sXHJcblx0XHRcImRpbWdyZXlcIjogWzEwNSwxMDUsMTA1XSxcclxuXHRcdFwic2xhdGVibHVlXCI6IFsxMDYsOTAsMjA1XSxcclxuXHRcdFwib2xpdmVkcmFiXCI6IFsxMDcsMTQyLDM1XSxcclxuXHRcdFwic2xhdGVncmF5XCI6IFsxMTIsMTI4LDE0NF0sXHJcblx0XHRcInNsYXRlZ3JleVwiOiBbMTEyLDEyOCwxNDRdLFxyXG5cdFx0XCJsaWdodHNsYXRlZ3JheVwiOiBbMTE5LDEzNiwxNTNdLFxyXG5cdFx0XCJsaWdodHNsYXRlZ3JleVwiOiBbMTE5LDEzNiwxNTNdLFxyXG5cdFx0XCJtZWRpdW1zbGF0ZWJsdWVcIjogWzEyMywxMDQsMjM4XSxcclxuXHRcdFwibGF3bmdyZWVuXCI6IFsxMjQsMjUyLDBdLFxyXG5cdFx0XCJjaGFydHJldXNlXCI6IFsxMjcsMjU1LDBdLFxyXG5cdFx0XCJhcXVhbWFyaW5lXCI6IFsxMjcsMjU1LDIxMl0sXHJcblx0XHRcIm1hcm9vblwiOiBbMTI4LDAsMF0sXHJcblx0XHRcInB1cnBsZVwiOiBbMTI4LDAsMTI4XSxcclxuXHRcdFwib2xpdmVcIjogWzEyOCwxMjgsMF0sXHJcblx0XHRcImdyYXlcIjogWzEyOCwxMjgsMTI4XSxcclxuXHRcdFwiZ3JleVwiOiBbMTI4LDEyOCwxMjhdLFxyXG5cdFx0XCJza3libHVlXCI6IFsxMzUsMjA2LDIzNV0sXHJcblx0XHRcImxpZ2h0c2t5Ymx1ZVwiOiBbMTM1LDIwNiwyNTBdLFxyXG5cdFx0XCJibHVldmlvbGV0XCI6IFsxMzgsNDMsMjI2XSxcclxuXHRcdFwiZGFya3JlZFwiOiBbMTM5LDAsMF0sXHJcblx0XHRcImRhcmttYWdlbnRhXCI6IFsxMzksMCwxMzldLFxyXG5cdFx0XCJzYWRkbGVicm93blwiOiBbMTM5LDY5LDE5XSxcclxuXHRcdFwiZGFya3NlYWdyZWVuXCI6IFsxNDMsMTg4LDE0M10sXHJcblx0XHRcImxpZ2h0Z3JlZW5cIjogWzE0NCwyMzgsMTQ0XSxcclxuXHRcdFwibWVkaXVtcHVycGxlXCI6IFsxNDcsMTEyLDIxNl0sXHJcblx0XHRcImRhcmt2aW9sZXRcIjogWzE0OCwwLDIxMV0sXHJcblx0XHRcInBhbGVncmVlblwiOiBbMTUyLDI1MSwxNTJdLFxyXG5cdFx0XCJkYXJrb3JjaGlkXCI6IFsxNTMsNTAsMjA0XSxcclxuXHRcdFwieWVsbG93Z3JlZW5cIjogWzE1NCwyMDUsNTBdLFxyXG5cdFx0XCJzaWVubmFcIjogWzE2MCw4Miw0NV0sXHJcblx0XHRcImJyb3duXCI6IFsxNjUsNDIsNDJdLFxyXG5cdFx0XCJkYXJrZ3JheVwiOiBbMTY5LDE2OSwxNjldLFxyXG5cdFx0XCJkYXJrZ3JleVwiOiBbMTY5LDE2OSwxNjldLFxyXG5cdFx0XCJsaWdodGJsdWVcIjogWzE3MywyMTYsMjMwXSxcclxuXHRcdFwiZ3JlZW55ZWxsb3dcIjogWzE3MywyNTUsNDddLFxyXG5cdFx0XCJwYWxldHVycXVvaXNlXCI6IFsxNzUsMjM4LDIzOF0sXHJcblx0XHRcImxpZ2h0c3RlZWxibHVlXCI6IFsxNzYsMTk2LDIyMl0sXHJcblx0XHRcInBvd2RlcmJsdWVcIjogWzE3NiwyMjQsMjMwXSxcclxuXHRcdFwiZmlyZWJyaWNrXCI6IFsxNzgsMzQsMzRdLFxyXG5cdFx0XCJkYXJrZ29sZGVucm9kXCI6IFsxODQsMTM0LDExXSxcclxuXHRcdFwibWVkaXVtb3JjaGlkXCI6IFsxODYsODUsMjExXSxcclxuXHRcdFwicm9zeWJyb3duXCI6IFsxODgsMTQzLDE0M10sXHJcblx0XHRcImRhcmtraGFraVwiOiBbMTg5LDE4MywxMDddLFxyXG5cdFx0XCJzaWx2ZXJcIjogWzE5MiwxOTIsMTkyXSxcclxuXHRcdFwibWVkaXVtdmlvbGV0cmVkXCI6IFsxOTksMjEsMTMzXSxcclxuXHRcdFwiaW5kaWFucmVkXCI6IFsyMDUsOTIsOTJdLFxyXG5cdFx0XCJwZXJ1XCI6IFsyMDUsMTMzLDYzXSxcclxuXHRcdFwiY2hvY29sYXRlXCI6IFsyMTAsMTA1LDMwXSxcclxuXHRcdFwidGFuXCI6IFsyMTAsMTgwLDE0MF0sXHJcblx0XHRcImxpZ2h0Z3JheVwiOiBbMjExLDIxMSwyMTFdLFxyXG5cdFx0XCJsaWdodGdyZXlcIjogWzIxMSwyMTEsMjExXSxcclxuXHRcdFwicGFsZXZpb2xldHJlZFwiOiBbMjE2LDExMiwxNDddLFxyXG5cdFx0XCJ0aGlzdGxlXCI6IFsyMTYsMTkxLDIxNl0sXHJcblx0XHRcIm9yY2hpZFwiOiBbMjE4LDExMiwyMTRdLFxyXG5cdFx0XCJnb2xkZW5yb2RcIjogWzIxOCwxNjUsMzJdLFxyXG5cdFx0XCJjcmltc29uXCI6IFsyMjAsMjAsNjBdLFxyXG5cdFx0XCJnYWluc2Jvcm9cIjogWzIyMCwyMjAsMjIwXSxcclxuXHRcdFwicGx1bVwiOiBbMjIxLDE2MCwyMjFdLFxyXG5cdFx0XCJidXJseXdvb2RcIjogWzIyMiwxODQsMTM1XSxcclxuXHRcdFwibGlnaHRjeWFuXCI6IFsyMjQsMjU1LDI1NV0sXHJcblx0XHRcImxhdmVuZGVyXCI6IFsyMzAsMjMwLDI1MF0sXHJcblx0XHRcImRhcmtzYWxtb25cIjogWzIzMywxNTAsMTIyXSxcclxuXHRcdFwidmlvbGV0XCI6IFsyMzgsMTMwLDIzOF0sXHJcblx0XHRcInBhbGVnb2xkZW5yb2RcIjogWzIzOCwyMzIsMTcwXSxcclxuXHRcdFwibGlnaHRjb3JhbFwiOiBbMjQwLDEyOCwxMjhdLFxyXG5cdFx0XCJraGFraVwiOiBbMjQwLDIzMCwxNDBdLFxyXG5cdFx0XCJhbGljZWJsdWVcIjogWzI0MCwyNDgsMjU1XSxcclxuXHRcdFwiaG9uZXlkZXdcIjogWzI0MCwyNTUsMjQwXSxcclxuXHRcdFwiYXp1cmVcIjogWzI0MCwyNTUsMjU1XSxcclxuXHRcdFwic2FuZHlicm93blwiOiBbMjQ0LDE2NCw5Nl0sXHJcblx0XHRcIndoZWF0XCI6IFsyNDUsMjIyLDE3OV0sXHJcblx0XHRcImJlaWdlXCI6IFsyNDUsMjQ1LDIyMF0sXHJcblx0XHRcIndoaXRlc21va2VcIjogWzI0NSwyNDUsMjQ1XSxcclxuXHRcdFwibWludGNyZWFtXCI6IFsyNDUsMjU1LDI1MF0sXHJcblx0XHRcImdob3N0d2hpdGVcIjogWzI0OCwyNDgsMjU1XSxcclxuXHRcdFwic2FsbW9uXCI6IFsyNTAsMTI4LDExNF0sXHJcblx0XHRcImFudGlxdWV3aGl0ZVwiOiBbMjUwLDIzNSwyMTVdLFxyXG5cdFx0XCJsaW5lblwiOiBbMjUwLDI0MCwyMzBdLFxyXG5cdFx0XCJsaWdodGdvbGRlbnJvZHllbGxvd1wiOiBbMjUwLDI1MCwyMTBdLFxyXG5cdFx0XCJvbGRsYWNlXCI6IFsyNTMsMjQ1LDIzMF0sXHJcblx0XHRcInJlZFwiOiBbMjU1LDAsMF0sXHJcblx0XHRcImZ1Y2hzaWFcIjogWzI1NSwwLDI1NV0sXHJcblx0XHRcIm1hZ2VudGFcIjogWzI1NSwwLDI1NV0sXHJcblx0XHRcImRlZXBwaW5rXCI6IFsyNTUsMjAsMTQ3XSxcclxuXHRcdFwib3JhbmdlcmVkXCI6IFsyNTUsNjksMF0sXHJcblx0XHRcInRvbWF0b1wiOiBbMjU1LDk5LDcxXSxcclxuXHRcdFwiaG90cGlua1wiOiBbMjU1LDEwNSwxODBdLFxyXG5cdFx0XCJjb3JhbFwiOiBbMjU1LDEyNyw4MF0sXHJcblx0XHRcImRhcmtvcmFuZ2VcIjogWzI1NSwxNDAsMF0sXHJcblx0XHRcImxpZ2h0c2FsbW9uXCI6IFsyNTUsMTYwLDEyMl0sXHJcblx0XHRcIm9yYW5nZVwiOiBbMjU1LDE2NSwwXSxcclxuXHRcdFwibGlnaHRwaW5rXCI6IFsyNTUsMTgyLDE5M10sXHJcblx0XHRcInBpbmtcIjogWzI1NSwxOTIsMjAzXSxcclxuXHRcdFwiZ29sZFwiOiBbMjU1LDIxNSwwXSxcclxuXHRcdFwicGVhY2hwdWZmXCI6IFsyNTUsMjE4LDE4NV0sXHJcblx0XHRcIm5hdmFqb3doaXRlXCI6IFsyNTUsMjIyLDE3M10sXHJcblx0XHRcIm1vY2Nhc2luXCI6IFsyNTUsMjI4LDE4MV0sXHJcblx0XHRcImJpc3F1ZVwiOiBbMjU1LDIyOCwxOTZdLFxyXG5cdFx0XCJtaXN0eXJvc2VcIjogWzI1NSwyMjgsMjI1XSxcclxuXHRcdFwiYmxhbmNoZWRhbG1vbmRcIjogWzI1NSwyMzUsMjA1XSxcclxuXHRcdFwicGFwYXlhd2hpcFwiOiBbMjU1LDIzOSwyMTNdLFxyXG5cdFx0XCJsYXZlbmRlcmJsdXNoXCI6IFsyNTUsMjQwLDI0NV0sXHJcblx0XHRcInNlYXNoZWxsXCI6IFsyNTUsMjQ1LDIzOF0sXHJcblx0XHRcImNvcm5zaWxrXCI6IFsyNTUsMjQ4LDIyMF0sXHJcblx0XHRcImxlbW9uY2hpZmZvblwiOiBbMjU1LDI1MCwyMDVdLFxyXG5cdFx0XCJmbG9yYWx3aGl0ZVwiOiBbMjU1LDI1MCwyNDBdLFxyXG5cdFx0XCJzbm93XCI6IFsyNTUsMjUwLDI1MF0sXHJcblx0XHRcInllbGxvd1wiOiBbMjU1LDI1NSwwXSxcclxuXHRcdFwibGlnaHR5ZWxsb3dcIjogWzI1NSwyNTUsMjI0XSxcclxuXHRcdFwiaXZvcnlcIjogWzI1NSwyNTUsMjQwXSxcclxuXHRcdFwid2hpdGVcIjogWzI1NSwyNTUsMjU1XVxyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBMaWdodGluZyBjb21wdXRhdGlvbiwgYmFzZWQgb24gYSB0cmFkaXRpb25hbCBGT1YgZm9yIG11bHRpcGxlIGxpZ2h0IHNvdXJjZXMgYW5kIG11bHRpcGxlIHBhc3Nlcy5cclxuICogQHBhcmFtIHtmdW5jdGlvbn0gcmVmbGVjdGl2aXR5Q2FsbGJhY2sgQ2FsbGJhY2sgdG8gcmV0cmlldmUgY2VsbCByZWZsZWN0aXZpdHkgKDAuLjEpXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnBhc3Nlcz0xXSBOdW1iZXIgb2YgcGFzc2VzLiAxIGVxdWFscyB0byBzaW1wbGUgRk9WIG9mIGFsbCBsaWdodCBzb3VyY2VzLCA+MSBtZWFucyBhICpoaWdobHkgc2ltcGxpZmllZCogcmFkaW9zaXR5LWxpa2UgYWxnb3JpdGhtLlxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMuZW1pc3Npb25UaHJlc2hvbGQ9MTAwXSBDZWxscyB3aXRoIGVtaXNzaXZpdHkgPiB0aHJlc2hvbGQgd2lsbCBiZSB0cmVhdGVkIGFzIGxpZ2h0IHNvdXJjZSBpbiB0aGUgbmV4dCBwYXNzLlxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucmFuZ2U9MTBdIE1heCBsaWdodCByYW5nZVxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nID0gZnVuY3Rpb24ocmVmbGVjdGl2aXR5Q2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHR0aGlzLl9yZWZsZWN0aXZpdHlDYWxsYmFjayA9IHJlZmxlY3Rpdml0eUNhbGxiYWNrO1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRwYXNzZXM6IDEsXHJcblx0XHRlbWlzc2lvblRocmVzaG9sZDogMTAwLFxyXG5cdFx0cmFuZ2U6IDEwXHJcblx0fTtcclxuXHR0aGlzLl9mb3YgPSBudWxsO1xyXG5cclxuXHR0aGlzLl9saWdodHMgPSB7fTtcclxuXHR0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZSA9IHt9O1xyXG5cdHRoaXMuX2ZvdkNhY2hlID0ge307XHJcblxyXG5cdHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGp1c3Qgb3B0aW9ucyBhdCBydW50aW1lXHJcbiAqIEBzZWUgUk9ULkxpZ2h0aW5nXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHRpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJhbmdlKSB7IHRoaXMucmVzZXQoKTsgfVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCB0aGUgdXNlZCBGaWVsZC1PZi1WaWV3IGFsZ29cclxuICogQHBhcmFtIHtST1QuRk9WfSBmb3ZcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuc2V0Rk9WID0gZnVuY3Rpb24oZm92KSB7XHJcblx0dGhpcy5fZm92ID0gZm92O1xyXG5cdHRoaXMuX2ZvdkNhY2hlID0ge307XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IChvciByZW1vdmUpIGEgbGlnaHQgc291cmNlXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7bnVsbCB8fCBzdHJpbmcgfHwgbnVtYmVyWzNdfSBjb2xvclxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5zZXRMaWdodCA9IGZ1bmN0aW9uKHgsIHksIGNvbG9yKSB7XHJcbiAgdmFyIGtleSA9IHggKyBcIixcIiArIHk7XHJcblxyXG4gIGlmIChjb2xvcikge1xyXG4gICAgdGhpcy5fbGlnaHRzW2tleV0gPSAodHlwZW9mKGNvbG9yKSA9PSBcInN0cmluZ1wiID8gUk9ULkNvbG9yLmZyb21TdHJpbmcoY29sb3IpIDogY29sb3IpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkZWxldGUgdGhpcy5fbGlnaHRzW2tleV07XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhbGwgbGlnaHQgc291cmNlc1xyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5jbGVhckxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fbGlnaHRzID0ge307XHJcbn07XHJcblxyXG4vKipcclxuICogUmVzZXQgdGhlIHByZS1jb21wdXRlZCB0b3BvbG9neSB2YWx1ZXMuIENhbGwgd2hlbmV2ZXIgdGhlIHVuZGVybHlpbmcgbWFwIGNoYW5nZXMgaXRzIGxpZ2h0LXBhc3NhYmlsaXR5LlxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlID0ge307XHJcblx0dGhpcy5fZm92Q2FjaGUgPSB7fTtcclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB0aGUgbGlnaHRpbmdcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gbGlnaHRpbmdDYWxsYmFjayBXaWxsIGJlIGNhbGxlZCB3aXRoICh4LCB5LCBjb2xvcikgZm9yIGV2ZXJ5IGxpdCBjZWxsXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihsaWdodGluZ0NhbGxiYWNrKSB7XHJcblx0dmFyIGRvbmVDZWxscyA9IHt9O1xyXG5cdHZhciBlbWl0dGluZ0NlbGxzID0ge307XHJcblx0dmFyIGxpdENlbGxzID0ge307XHJcblxyXG5cdGZvciAodmFyIGtleSBpbiB0aGlzLl9saWdodHMpIHsgLyogcHJlcGFyZSBlbWl0dGVycyBmb3IgZmlyc3QgcGFzcyAqL1xyXG5cdFx0dmFyIGxpZ2h0ID0gdGhpcy5fbGlnaHRzW2tleV07XHJcblx0XHRlbWl0dGluZ0NlbGxzW2tleV0gPSBbMCwgMCwgMF07XHJcblx0XHRST1QuQ29sb3IuYWRkXyhlbWl0dGluZ0NlbGxzW2tleV0sIGxpZ2h0KTtcclxuXHR9XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX29wdGlvbnMucGFzc2VzO2krKykgeyAvKiBtYWluIGxvb3AgKi9cclxuXHRcdHRoaXMuX2VtaXRMaWdodChlbWl0dGluZ0NlbGxzLCBsaXRDZWxscywgZG9uZUNlbGxzKTtcclxuXHRcdGlmIChpKzEgPT0gdGhpcy5fb3B0aW9ucy5wYXNzZXMpIHsgY29udGludWU7IH0gLyogbm90IGZvciB0aGUgbGFzdCBwYXNzICovXHJcblx0XHRlbWl0dGluZ0NlbGxzID0gdGhpcy5fY29tcHV0ZUVtaXR0ZXJzKGxpdENlbGxzLCBkb25lQ2VsbHMpO1xyXG5cdH1cclxuXHJcblx0Zm9yICh2YXIgbGl0S2V5IGluIGxpdENlbGxzKSB7IC8qIGxldCB0aGUgdXNlciBrbm93IHdoYXQgYW5kIGhvdyBpcyBsaXQgKi9cclxuXHRcdHZhciBwYXJ0cyA9IGxpdEtleS5zcGxpdChcIixcIik7XHJcblx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcclxuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0bGlnaHRpbmdDYWxsYmFjayh4LCB5LCBsaXRDZWxsc1tsaXRLZXldKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgb25lIGl0ZXJhdGlvbiBmcm9tIGFsbCBlbWl0dGluZyBjZWxsc1xyXG4gKiBAcGFyYW0ge29iamVjdH0gZW1pdHRpbmdDZWxscyBUaGVzZSBlbWl0IGxpZ2h0XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBsaXRDZWxscyBBZGQgcHJvamVjdGVkIGxpZ2h0IHRvIHRoZXNlXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBkb25lQ2VsbHMgVGhlc2UgYWxyZWFkeSBlbWl0dGVkLCBmb3JiaWQgdGhlbSBmcm9tIGZ1cnRoZXIgY2FsY3VsYXRpb25zXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLl9lbWl0TGlnaHQgPSBmdW5jdGlvbihlbWl0dGluZ0NlbGxzLCBsaXRDZWxscywgZG9uZUNlbGxzKSB7XHJcblx0Zm9yICh2YXIga2V5IGluIGVtaXR0aW5nQ2VsbHMpIHtcclxuXHRcdHZhciBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XHJcblx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcclxuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0dGhpcy5fZW1pdExpZ2h0RnJvbUNlbGwoeCwgeSwgZW1pdHRpbmdDZWxsc1trZXldLCBsaXRDZWxscyk7XHJcblx0XHRkb25lQ2VsbHNba2V5XSA9IDE7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFByZXBhcmUgYSBsaXN0IG9mIGVtaXR0ZXJzIGZvciBuZXh0IHBhc3NcclxuICogQHBhcmFtIHtvYmplY3R9IGxpdENlbGxzXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBkb25lQ2VsbHNcclxuICogQHJldHVybnMge29iamVjdH1cclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuX2NvbXB1dGVFbWl0dGVycyA9IGZ1bmN0aW9uKGxpdENlbGxzLCBkb25lQ2VsbHMpIHtcclxuXHR2YXIgcmVzdWx0ID0ge307XHJcblxyXG5cdGZvciAodmFyIGtleSBpbiBsaXRDZWxscykge1xyXG5cdFx0aWYgKGtleSBpbiBkb25lQ2VsbHMpIHsgY29udGludWU7IH0gLyogYWxyZWFkeSBlbWl0dGVkICovXHJcblxyXG5cdFx0dmFyIGNvbG9yID0gbGl0Q2VsbHNba2V5XTtcclxuXHJcblx0XHRpZiAoa2V5IGluIHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlKSB7XHJcblx0XHRcdHZhciByZWZsZWN0aXZpdHkgPSB0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZVtrZXldO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHBhcnRzID0ga2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdFx0dmFyIHggPSBwYXJzZUludChwYXJ0c1swXSk7XHJcblx0XHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0XHR2YXIgcmVmbGVjdGl2aXR5ID0gdGhpcy5fcmVmbGVjdGl2aXR5Q2FsbGJhY2soeCwgeSk7XHJcblx0XHRcdHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlW2tleV0gPSByZWZsZWN0aXZpdHk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHJlZmxlY3Rpdml0eSA9PSAwKSB7IGNvbnRpbnVlOyB9IC8qIHdpbGwgbm90IHJlZmxlY3QgYXQgYWxsICovXHJcblxyXG5cdFx0LyogY29tcHV0ZSBlbWlzc2lvbiBjb2xvciAqL1xyXG5cdFx0dmFyIGVtaXNzaW9uID0gW107XHJcblx0XHR2YXIgaW50ZW5zaXR5ID0gMDtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdHZhciBwYXJ0ID0gTWF0aC5yb3VuZChjb2xvcltpXSpyZWZsZWN0aXZpdHkpO1xyXG5cdFx0XHRlbWlzc2lvbltpXSA9IHBhcnQ7XHJcblx0XHRcdGludGVuc2l0eSArPSBwYXJ0O1xyXG5cdFx0fVxyXG5cdFx0aWYgKGludGVuc2l0eSA+IHRoaXMuX29wdGlvbnMuZW1pc3Npb25UaHJlc2hvbGQpIHsgcmVzdWx0W2tleV0gPSBlbWlzc2lvbjsgfVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIG9uZSBpdGVyYXRpb24gZnJvbSBvbmUgY2VsbFxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxyXG4gKiBAcGFyYW0ge29iamVjdH0gbGl0Q2VsbHMgQ2VsbCBkYXRhIHRvIGJ5IHVwZGF0ZWRcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuX2VtaXRMaWdodEZyb21DZWxsID0gZnVuY3Rpb24oeCwgeSwgY29sb3IsIGxpdENlbGxzKSB7XHJcblx0dmFyIGtleSA9IHgrXCIsXCIreTtcclxuXHRpZiAoa2V5IGluIHRoaXMuX2ZvdkNhY2hlKSB7XHJcblx0XHR2YXIgZm92ID0gdGhpcy5fZm92Q2FjaGVba2V5XTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGZvdiA9IHRoaXMuX3VwZGF0ZUZPVih4LCB5KTtcclxuXHR9XHJcblxyXG5cdGZvciAodmFyIGZvdktleSBpbiBmb3YpIHtcclxuXHRcdHZhciBmb3JtRmFjdG9yID0gZm92W2ZvdktleV07XHJcblxyXG5cdFx0aWYgKGZvdktleSBpbiBsaXRDZWxscykgeyAvKiBhbHJlYWR5IGxpdCAqL1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gbGl0Q2VsbHNbZm92S2V5XTtcclxuXHRcdH0gZWxzZSB7IC8qIG5ld2x5IGxpdCAqL1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gWzAsIDAsIDBdO1xyXG5cdFx0XHRsaXRDZWxsc1tmb3ZLZXldID0gcmVzdWx0O1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7IHJlc3VsdFtpXSArPSBNYXRoLnJvdW5kKGNvbG9yW2ldKmZvcm1GYWN0b3IpOyB9IC8qIGFkZCBsaWdodCBjb2xvciAqL1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBGT1YgKFwiZm9ybSBmYWN0b3JcIikgZm9yIGEgcG90ZW50aWFsIGxpZ2h0IHNvdXJjZSBhdCBbeCx5XVxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5fdXBkYXRlRk9WID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdHZhciBrZXkxID0geCtcIixcIit5O1xyXG5cdHZhciBjYWNoZSA9IHt9O1xyXG5cdHRoaXMuX2ZvdkNhY2hlW2tleTFdID0gY2FjaGU7XHJcblx0dmFyIHJhbmdlID0gdGhpcy5fb3B0aW9ucy5yYW5nZTtcclxuXHR2YXIgY2IgPSBmdW5jdGlvbih4LCB5LCByLCB2aXMpIHtcclxuXHRcdHZhciBrZXkyID0geCtcIixcIit5O1xyXG5cdFx0dmFyIGZvcm1GYWN0b3IgPSB2aXMgKiAoMS1yL3JhbmdlKTtcclxuXHRcdGlmIChmb3JtRmFjdG9yID09IDApIHsgcmV0dXJuOyB9XHJcblx0XHRjYWNoZVtrZXkyXSA9IGZvcm1GYWN0b3I7XHJcblx0fTtcclxuXHR0aGlzLl9mb3YuY29tcHV0ZSh4LCB5LCByYW5nZSwgY2IuYmluZCh0aGlzKSk7XHJcblxyXG5cdHJldHVybiBjYWNoZTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBBYnN0cmFjdCBwYXRoZmluZGVyXHJcbiAqIEBwYXJhbSB7aW50fSB0b1ggVGFyZ2V0IFggY29vcmRcclxuICogQHBhcmFtIHtpbnR9IHRvWSBUYXJnZXQgWSBjb29yZFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBwYXNzYWJsZUNhbGxiYWNrIENhbGxiYWNrIHRvIGRldGVybWluZSBtYXAgcGFzc2FiaWxpdHlcclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudG9wb2xvZ3k9OF1cclxuICovXHJcblJPVC5QYXRoID0gZnVuY3Rpb24odG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHR0aGlzLl90b1ggPSB0b1g7XHJcblx0dGhpcy5fdG9ZID0gdG9ZO1xyXG5cdHRoaXMuX2Zyb21YID0gbnVsbDtcclxuXHR0aGlzLl9mcm9tWSA9IG51bGw7XHJcblx0dGhpcy5fcGFzc2FibGVDYWxsYmFjayA9IHBhc3NhYmxlQ2FsbGJhY2s7XHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdHRvcG9sb2d5OiA4XHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHJcblx0dGhpcy5fZGlycyA9IFJPVC5ESVJTW3RoaXMuX29wdGlvbnMudG9wb2xvZ3ldO1xyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDgpIHsgLyogcmVvcmRlciBkaXJzIGZvciBtb3JlIGFlc3RoZXRpYyByZXN1bHQgKHZlcnRpY2FsL2hvcml6b250YWwgZmlyc3QpICovXHJcblx0XHR0aGlzLl9kaXJzID0gW1xyXG5cdFx0XHR0aGlzLl9kaXJzWzBdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzJdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzRdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzZdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzFdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzNdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzVdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzddXHJcblx0XHRdXHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgYSBwYXRoIGZyb20gYSBnaXZlbiBwb2ludFxyXG4gKiBAcGFyYW0ge2ludH0gZnJvbVhcclxuICogQHBhcmFtIHtpbnR9IGZyb21ZXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFdpbGwgYmUgY2FsbGVkIGZvciBldmVyeSBwYXRoIGl0ZW0gd2l0aCBhcmd1bWVudHMgXCJ4XCIgYW5kIFwieVwiXHJcbiAqL1xyXG5ST1QuUGF0aC5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKGZyb21YLCBmcm9tWSwgY2FsbGJhY2spIHtcclxufTtcclxuXHJcblJPVC5QYXRoLnByb3RvdHlwZS5fZ2V0TmVpZ2hib3JzID0gZnVuY3Rpb24oY3gsIGN5KSB7XHJcblx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX2RpcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGRpciA9IHRoaXMuX2RpcnNbaV07XHJcblx0XHR2YXIgeCA9IGN4ICsgZGlyWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIGRpclsxXTtcclxuXHRcdFxyXG5cdFx0aWYgKCF0aGlzLl9wYXNzYWJsZUNhbGxiYWNrKHgsIHkpKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRyZXN1bHQucHVzaChbeCwgeV0pO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFNpbXBsaWZpZWQgRGlqa3N0cmEncyBhbGdvcml0aG06IGFsbCBlZGdlcyBoYXZlIGEgdmFsdWUgb2YgMVxyXG4gKiBAYXVnbWVudHMgUk9ULlBhdGhcclxuICogQHNlZSBST1QuUGF0aFxyXG4gKi9cclxuUk9ULlBhdGguRGlqa3N0cmEgPSBmdW5jdGlvbih0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdFJPVC5QYXRoLmNhbGwodGhpcywgdG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG5cclxuXHR0aGlzLl9jb21wdXRlZCA9IHt9O1xyXG5cdHRoaXMuX3RvZG8gPSBbXTtcclxuXHR0aGlzLl9hZGQodG9YLCB0b1ksIG51bGwpO1xyXG59O1xyXG5ST1QuUGF0aC5EaWprc3RyYS5leHRlbmQoUk9ULlBhdGgpO1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgYSBwYXRoIGZyb20gYSBnaXZlbiBwb2ludFxyXG4gKiBAc2VlIFJPVC5QYXRoI2NvbXB1dGVcclxuICovXHJcblJPVC5QYXRoLkRpamtzdHJhLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZLCBjYWxsYmFjaykge1xyXG5cdHZhciBrZXkgPSBmcm9tWCtcIixcIitmcm9tWTtcclxuXHRpZiAoIShrZXkgaW4gdGhpcy5fY29tcHV0ZWQpKSB7IHRoaXMuX2NvbXB1dGUoZnJvbVgsIGZyb21ZKTsgfVxyXG5cdGlmICghKGtleSBpbiB0aGlzLl9jb21wdXRlZCkpIHsgcmV0dXJuOyB9XHJcblx0XHJcblx0dmFyIGl0ZW0gPSB0aGlzLl9jb21wdXRlZFtrZXldO1xyXG5cdHdoaWxlIChpdGVtKSB7XHJcblx0XHRjYWxsYmFjayhpdGVtLngsIGl0ZW0ueSk7XHJcblx0XHRpdGVtID0gaXRlbS5wcmV2O1xyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIGEgbm9uLWNhY2hlZCB2YWx1ZVxyXG4gKi9cclxuUk9ULlBhdGguRGlqa3N0cmEucHJvdG90eXBlLl9jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZKSB7XHJcblx0d2hpbGUgKHRoaXMuX3RvZG8ubGVuZ3RoKSB7XHJcblx0XHR2YXIgaXRlbSA9IHRoaXMuX3RvZG8uc2hpZnQoKTtcclxuXHRcdGlmIChpdGVtLnggPT0gZnJvbVggJiYgaXRlbS55ID09IGZyb21ZKSB7IHJldHVybjsgfVxyXG5cdFx0XHJcblx0XHR2YXIgbmVpZ2hib3JzID0gdGhpcy5fZ2V0TmVpZ2hib3JzKGl0ZW0ueCwgaXRlbS55KTtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8bmVpZ2hib3JzLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0dmFyIG5laWdoYm9yID0gbmVpZ2hib3JzW2ldO1xyXG5cdFx0XHR2YXIgeCA9IG5laWdoYm9yWzBdO1xyXG5cdFx0XHR2YXIgeSA9IG5laWdoYm9yWzFdO1xyXG5cdFx0XHR2YXIgaWQgPSB4K1wiLFwiK3k7XHJcblx0XHRcdGlmIChpZCBpbiB0aGlzLl9jb21wdXRlZCkgeyBjb250aW51ZTsgfSAvKiBhbHJlYWR5IGRvbmUgKi9cdFxyXG5cdFx0XHR0aGlzLl9hZGQoeCwgeSwgaXRlbSk7IFxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5QYXRoLkRpamtzdHJhLnByb3RvdHlwZS5fYWRkID0gZnVuY3Rpb24oeCwgeSwgcHJldikge1xyXG5cdHZhciBvYmogPSB7XHJcblx0XHR4OiB4LFxyXG5cdFx0eTogeSxcclxuXHRcdHByZXY6IHByZXZcclxuXHR9O1xyXG5cdHRoaXMuX2NvbXB1dGVkW3grXCIsXCIreV0gPSBvYmo7XHJcblx0dGhpcy5fdG9kby5wdXNoKG9iaik7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgU2ltcGxpZmllZCBBKiBhbGdvcml0aG06IGFsbCBlZGdlcyBoYXZlIGEgdmFsdWUgb2YgMVxyXG4gKiBAYXVnbWVudHMgUk9ULlBhdGhcclxuICogQHNlZSBST1QuUGF0aFxyXG4gKi9cclxuUk9ULlBhdGguQVN0YXIgPSBmdW5jdGlvbih0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdFJPVC5QYXRoLmNhbGwodGhpcywgdG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG5cclxuXHR0aGlzLl90b2RvID0gW107XHJcblx0dGhpcy5fZG9uZSA9IHt9O1xyXG5cdHRoaXMuX2Zyb21YID0gbnVsbDtcclxuXHR0aGlzLl9mcm9tWSA9IG51bGw7XHJcbn07XHJcblJPVC5QYXRoLkFTdGFyLmV4dGVuZChST1QuUGF0aCk7XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBhIHBhdGggZnJvbSBhIGdpdmVuIHBvaW50XHJcbiAqIEBzZWUgUk9ULlBhdGgjY29tcHV0ZVxyXG4gKi9cclxuUk9ULlBhdGguQVN0YXIucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihmcm9tWCwgZnJvbVksIGNhbGxiYWNrKSB7XHJcblx0dGhpcy5fdG9kbyA9IFtdO1xyXG5cdHRoaXMuX2RvbmUgPSB7fTtcclxuXHR0aGlzLl9mcm9tWCA9IGZyb21YO1xyXG5cdHRoaXMuX2Zyb21ZID0gZnJvbVk7XHJcblx0dGhpcy5fYWRkKHRoaXMuX3RvWCwgdGhpcy5fdG9ZLCBudWxsKTtcclxuXHJcblx0d2hpbGUgKHRoaXMuX3RvZG8ubGVuZ3RoKSB7XHJcblx0XHR2YXIgaXRlbSA9IHRoaXMuX3RvZG8uc2hpZnQoKTtcclxuXHRcdGlmIChpdGVtLnggPT0gZnJvbVggJiYgaXRlbS55ID09IGZyb21ZKSB7IGJyZWFrOyB9XHJcblx0XHR2YXIgbmVpZ2hib3JzID0gdGhpcy5fZ2V0TmVpZ2hib3JzKGl0ZW0ueCwgaXRlbS55KTtcclxuXHJcblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvcnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHR2YXIgbmVpZ2hib3IgPSBuZWlnaGJvcnNbaV07XHJcblx0XHRcdHZhciB4ID0gbmVpZ2hib3JbMF07XHJcblx0XHRcdHZhciB5ID0gbmVpZ2hib3JbMV07XHJcblx0XHRcdHZhciBpZCA9IHgrXCIsXCIreTtcclxuXHRcdFx0aWYgKGlkIGluIHRoaXMuX2RvbmUpIHsgY29udGludWU7IH1cclxuXHRcdFx0dGhpcy5fYWRkKHgsIHksIGl0ZW0pOyBcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dmFyIGl0ZW0gPSB0aGlzLl9kb25lW2Zyb21YK1wiLFwiK2Zyb21ZXTtcclxuXHRpZiAoIWl0ZW0pIHsgcmV0dXJuOyB9XHJcblx0XHJcblx0d2hpbGUgKGl0ZW0pIHtcclxuXHRcdGNhbGxiYWNrKGl0ZW0ueCwgaXRlbS55KTtcclxuXHRcdGl0ZW0gPSBpdGVtLnByZXY7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULlBhdGguQVN0YXIucHJvdG90eXBlLl9hZGQgPSBmdW5jdGlvbih4LCB5LCBwcmV2KSB7XHJcblx0dmFyIGggPSB0aGlzLl9kaXN0YW5jZSh4LCB5KTtcclxuXHR2YXIgb2JqID0ge1xyXG5cdFx0eDogeCxcclxuXHRcdHk6IHksXHJcblx0XHRwcmV2OiBwcmV2LFxyXG5cdFx0ZzogKHByZXYgPyBwcmV2LmcrMSA6IDApLFxyXG5cdFx0aDogaFxyXG5cdH07XHJcblx0dGhpcy5fZG9uZVt4K1wiLFwiK3ldID0gb2JqO1xyXG5cdFxyXG5cdC8qIGluc2VydCBpbnRvIHByaW9yaXR5IHF1ZXVlICovXHJcblx0XHJcblx0dmFyIGYgPSBvYmouZyArIG9iai5oO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3RvZG8ubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGl0ZW0gPSB0aGlzLl90b2RvW2ldO1xyXG5cdFx0dmFyIGl0ZW1GID0gaXRlbS5nICsgaXRlbS5oO1xyXG5cdFx0aWYgKGYgPCBpdGVtRiB8fCAoZiA9PSBpdGVtRiAmJiBoIDwgaXRlbS5oKSkge1xyXG5cdFx0XHR0aGlzLl90b2RvLnNwbGljZShpLCAwLCBvYmopO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX3RvZG8ucHVzaChvYmopO1xyXG59O1xyXG5cclxuUk9ULlBhdGguQVN0YXIucHJvdG90eXBlLl9kaXN0YW5jZSA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRzd2l0Y2ggKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kpIHtcclxuXHRcdGNhc2UgNDpcclxuXHRcdFx0cmV0dXJuIChNYXRoLmFicyh4LXRoaXMuX2Zyb21YKSArIE1hdGguYWJzKHktdGhpcy5fZnJvbVkpKTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgNjpcclxuXHRcdFx0dmFyIGR4ID0gTWF0aC5hYnMoeCAtIHRoaXMuX2Zyb21YKTtcclxuXHRcdFx0dmFyIGR5ID0gTWF0aC5hYnMoeSAtIHRoaXMuX2Zyb21ZKTtcclxuXHRcdFx0cmV0dXJuIGR5ICsgTWF0aC5tYXgoMCwgKGR4LWR5KS8yKTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgODogXHJcblx0XHRcdHJldHVybiBNYXRoLm1heChNYXRoLmFicyh4LXRoaXMuX2Zyb21YKSwgTWF0aC5hYnMoeS10aGlzLl9mcm9tWSkpO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHRvcG9sb2d5XCIpO1xyXG59O1xyXG4gIHJldHVybiBST1Q7XHJcbn0pKTtcclxuIl19
