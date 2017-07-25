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

		var generator = new _rot2.default.Map.Arena(w - 2, h - 2);
		generator.create(function (x, y, wall) {
			var WALL = _tile.TileTypes.WALL;
			var FLOOR = _tile.TileTypes.FLOOR;
			_this.map.set(x, y, new _tile.Tile(x, y, wall ? WALL : FLOOR));
		});
		//Generate holes in the floor
		var holes = 10;
		while (holes > 0) {
			var x = randInt(0, w);
			var y = randInt(0, h);
			if (this.map.get(x, y).type == 'wall') {
				continue;
			}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxhY3Rvci5qcyIsImFzc2V0c1xcanNcXGFjdG9yc1xccGxheWVyLmpzIiwiYXNzZXRzXFxqc1xcYXBwLmpzIiwiYXNzZXRzXFxqc1xcZ2FtZS5qcyIsImFzc2V0c1xcanNcXGdseXBoLmpzIiwiYXNzZXRzXFxqc1xcbWFwLmpzIiwiYXNzZXRzXFxqc1xcdGlsZS5qcyIsInZlbmRvclxcZXZlbnRidXMubWluLmpzIiwidmVuZG9yXFxyb3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztJQUVxQixLO0FBQ3BCLGdCQUFZLElBQVosRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsS0FBeEIsRUFBOEI7QUFBQTs7QUFDN0IsT0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLE9BQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxPQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLElBQWpCO0FBQ0EsaUJBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsSUFBbkIsRUFBd0IsSUFBeEI7QUFDQTs7Ozt3QkFDSSxDQUFFOzs7eUJBQ0Q7QUFDTCxrQkFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFLLENBQXZCLEVBQTBCLEtBQUssQ0FBL0IsRUFBa0MsS0FBSyxLQUFMLENBQVcsR0FBN0MsRUFBa0QsS0FBSyxLQUFMLENBQVcsRUFBN0QsRUFBaUUsS0FBSyxLQUFMLENBQVcsRUFBNUU7QUFDQTs7O3VCQUNJLEMsRUFBRyxDLEVBQUU7QUFDVCxPQUFHLENBQUMsZUFBSyxHQUFMLENBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQixDQUFyQixDQUFKLEVBQTRCO0FBQzNCLFdBQU8sQ0FBUDtBQUNBO0FBQ0QsT0FBSSxXQUFXLGVBQUssR0FBTCxDQUFTLEdB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R0FBTCxDQUFTLElBQUUsS0FBSyxNQUFoQixDQUFsQyxDQUFQO0FBQ0Q7QUFiRDs7QUFnQk8sUUFBTSxJQUFJLEtBQUosQ0FBVSxrQkFBVixDQUFOO0FBQ1AsRUFsQkQ7QUFtQkUsUUFBTyxHQUFQO0FBQ0QsQ0EzdEtBLENBQUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihuYW1lLCB4LCB5LCBnbHlwaCl7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLmdseXBoID0gZ2x5cGg7XHJcblx0XHRHYW1lLmFjdG9ycy5wdXNoKHRoaXMpO1xyXG5cdFx0R2FtZS5zY2hlZHVsZXIuYWRkKHRoaXMsdHJ1ZSk7XHJcblx0fVxyXG5cdGFjdCgpe31cclxuXHRkcmF3KCl7XHJcblx0XHRHYW1lLmRpc3BsYXkuZHJhdyh0aGlzLngsIHRoaXMueSwgdGhpcy5nbHlwaC5jaHIsIHRoaXMuZ2x5cGguZmcsIHRoaXMuZ2x5cGguYmcpO1xyXG5cdH1cclxuXHRtb3ZlKHgsIHkpe1xyXG5cdFx0aWYoIUdhbWUubWFwLmluQm91bmRzKHgsIHkpKXtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRsZXQgdGlsZVR5cGUgPSBHYW1lLm1hcC5nZXQoeCwgeSkudHlwZTtcclxuXHRcdHN3aXRjaCh0aWxlVHlwZSl7XHJcblx0XHRcdGNhc2UgJ3dhbGwnOlxyXG5cdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdza3knOlxyXG5cdFx0XHRcdEdhbWUuYnVzLmRpc3BhdGNoKCdmYWxsJyx0aGlzKTtcclxuXHRcdFx0XHRyZXR1cm4gMTtcclxuXHRcdH1cclxuXHRcdGxldCBjb2xsaWRlcyA9IGZhbHNlO1xyXG5cdFx0bGV0IG90aGVyID0gbnVsbDtcclxuXHRcdEdhbWUuYWN0b3JzLmZvckVhY2goKGFjdG9yKT0+e1xyXG5cdFx0XHRpZih4PT1hY3Rvci54ICYmIHk9PWFjdG9yLnkpe1xyXG5cdFx0XHRcdGNvbGxpZGVzID0gdHJ1ZTtcclxuXHRcdFx0XHRvdGhlciA9IGFjdG9yO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdGlmKGNvbGxpZGVzKXtcclxuXHRcdFx0Ly9QdXNoIGFjdG9yXHJcblx0XHRcdGxldCBkeCA9IHggLSB0aGlzLng7XHJcblx0XHRcdGxldCBkeSA9IHkgLSB0aGlzLnk7XHJcblx0XHRcdGxldCBtdiA9IG90aGVyLm1vdmUob3RoZXIueCtkeCxvdGhlci55K2R5KTtcclxuXHRcdFx0aWYoIW12KXtcclxuXHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9DYXB0dXJlIGN1cnJlbnQgcG9zaXRpb25cclxuXHRcdGxldCBjeCA9IHRoaXMueDtcclxuXHRcdGxldCBjeSA9IHRoaXMueTtcclxuXHRcdC8vU2V0IG5ldyBwb3NpdGlvblxyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHQvL0Rpc3BhdGNoIGV2ZW50IGZvciBncmFwaGljYWwgY2hhbmdlXHJcblx0XHRHYW1lLmJ1cy5kaXNwYXRjaCgnbW92ZScsIHRoaXMsIGN4LCBjeSk7XHJcblx0XHRyZXR1cm4gMTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgQWN0b3IgZnJvbSAnLi4vYWN0b3InO1xyXG5pbXBvcnQgUk9UIGZyb20gJy4uLy4uLy4uL3ZlbmRvci9yb3QnO1xyXG5pbXBvcnQgR2FtZSBmcm9tICcuLy4uL2dhbWUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIGV4dGVuZHMgQWN0b3J7XHJcblx0YWN0KCl7XHJcblx0XHRHYW1lLmVuZ2luZS5sb2NrKCk7XHJcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsdGhpcyk7XHJcblx0fVxyXG5cdGhhbmRsZUV2ZW50KGUpe1xyXG5cdFx0bGV0IGNvZGUgPSBlLmtleUNvZGU7XHJcblx0XHRsZXQgeCA9IHRoaXMueDtcclxuXHRcdGxldCB5ID0gdGhpcy55O1xyXG5cdFx0c3dpdGNoKGNvZGUpe1xyXG5cdFx0XHRjYXNlIFJPVC5WS19VUDpcclxuXHRcdFx0XHRzdXBlci5tb3ZlKHgseS0xKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBST1QuVktfUklHSFQ6XHJcblx0XHRcdFx0c3VwZXIubW92ZSh4KzEseSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgUk9ULlZLX0RPV046XHJcblx0XHRcdFx0c3VwZXIubW92ZSh4LHkrMSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgUk9ULlZLX0xFRlQ6XHJcblx0XHRcdFx0c3VwZXIubW92ZSh4LTEseSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsdGhpcyk7XHJcblx0XHRHYW1lLmVuZ2luZS51bmxvY2soKTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgUk9UIGZyb20gXCIuLi8uLi92ZW5kb3Ivcm90XCJcclxuaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJ1xyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSAnLi90aWxlJztcclxuXHJcbmlmKCFST1QuaXNTdXBwb3J0ZWQoKSl7XHJcblx0YWxlcnQoXCJUaGUgcm90LmpzIGxpYnJhcnkgaXNuJ3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3Nlci5cIik7XHJcbn1cclxuZWxzZXtcclxuXHRHYW1lLmluaXQoKTtcclxufSIsImltcG9ydCBST1QgZnJvbSAnLi4vLi4vdmVuZG9yL3JvdCc7XHJcbmltcG9ydCBFdmVudEJ1cyBmcm9tICcuLi8uLi92ZW5kb3IvZXZlbnRidXMubWluJztcclxuXHJcbmltcG9ydCBUaWxlTWFwIGZyb20gJy4vbWFwLmpzJztcclxuaW1wb3J0IHsgVGlsZSwgVGlsZVR5cGVzIH0gZnJvbSAnLi90aWxlLmpzJztcclxuaW1wb3J0IEFjdG9yIGZyb20gJy4vYWN0b3InO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gJy4vYWN0b3JzL3BsYXllcic7XHJcbmltcG9ydCBHbHlwaCBmcm9tICcuL2dseXBoJztcclxuXHJcbmNvbnN0IHcgPSA1MDtcclxuY29uc3QgaCA9IDI1O1xyXG5cclxudmFyIHJhbmRJbnQgPSBmdW5jdGlvbihhLCBiKXtcclxuXHRyZXR1cm4gYSArIE1hdGguZmxvb3IoKGItYSkgKiBST1QuUk5HLmdldFVuaWZvcm0oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuXHRkaXNwbGF5OiBudWxsLFxyXG5cdG1hcDogbnVsbCxcclxuXHRidXM6IG51bGwsXHJcblx0YWN0b3JzOiBbXSxcclxuXHRwbGF5ZXI6IG51bGwsXHJcblx0c2NoZWR1bGVyOiBudWxsLFxyXG5cdGVuZ2luZTogbnVsbCxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5kaXNwbGF5ID0gbmV3IFJPVC5EaXNwbGF5KHt3aWR0aDogdywgaGVpZ2h0OiBofSk7XHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZGlzcGxheS5nZXRDb250YWluZXIoKSk7XHJcblx0XHRcclxuXHRcdHRoaXMubWFwID0gbmV3IFRpbGVNYXAodywgaCk7XHJcblx0XHRcclxuXHRcdGxldCBnZW5lcmF0b3IgPSBuZXcgUk9ULk1hcC5BcmVuYSh3LTIsaC0yKTtcclxuXHRcdGdlbmVyYXRvci5jcmVhdGUoKHgsIHksIHdhbGwpPT57XHJcblx0XHRcdGxldCBXQUxMID0gVGlsZVR5cGVzLldBTEw7XHJcblx0XHRcdGxldCBGTE9PUiA9IFRpbGVUeXBlcy5GTE9PUjtcclxuXHRcdFx0dGhpcy5tYXAuc2V0KHgsIHksIG5ldyBUaWxlKHgsIHksIHdhbGwgPyBXQUxMOiBGTE9PUikpO1xyXG5cdFx0fSk7XHJcblx0XHQvL0dlbmVyYXRlIGhvbGVzIGluIHRoZSBmbG9vclxyXG5cdFx0bGV0IGhvbGVzID0gMTA7XHJcblx0XHR3aGlsZShob2xlcyA+IDApe1xyXG5cdFx0XHRsZXQgeCA9IHJhbmRJbnQoMCwgdyk7XHJcblx0XHRcdGxldCB5ID0gcmFuZEludCgwLCBoKTtcclxuXHRcdFx0aWYodGhpcy5tYXAuZ2V0KHgseSkudHlwZSA9PSAnd2FsbCcpe1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMubWFwLnNldCh4LCB5LCBuZXcgVGlsZSh4LCB5LCBUaWxlVHlwZXMuU0tZKSk7XHJcblx0XHRcdGhvbGVzLS07XHJcblx0XHR9XHJcblx0XHR0aGlzLm1hcC5kcmF3KCk7XHJcblx0XHRcclxuXHRcdHRoaXMuYnVzID0gRXZlbnRCdXM7XHJcblx0XHRcclxuXHRcdHRoaXMuYnVzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdmUnLChlLCB4LCB5KT0+e1xyXG5cdFx0XHR0aGlzLm1hcC5yZXNldChlLCB4LCB5KTtcclxuXHRcdFx0ZS50YXJnZXQuZHJhdygpO1xyXG5cdFx0fSx0aGlzLm1hcCk7XHJcblx0XHRcclxuXHRcdHRoaXMuYnVzLmFkZEV2ZW50TGlzdGVuZXIoJ2ZhbGwnLChlKT0+e1xyXG5cdFx0XHR0aGlzLm1hcC5yZXNldChlLGUudGFyZ2V0LngsZS50YXJnZXQueSk7XHJcblx0XHRcdHRoaXMuc2NoZWR1bGVyLnJlbW92ZShlLnRhcmdldCk7XHJcblx0XHRcdHRoaXMuYWN0b3JzLnNwbGljZSh0aGlzLmFjdG9ycy5pbmRleE9mKGUudGFyZ2V0KSwxKTtcclxuXHRcdH0sdGhpcy5tYXApO1xyXG5cdFx0XHJcblx0XHR0aGlzLnNjaGVkdWxlciA9IG5ldyBST1QuU2NoZWR1bGVyLlNpbXBsZSgpO1xyXG5cdFx0dGhpcy5lbmdpbmUgPSBuZXcgUk9ULkVuZ2luZSh0aGlzLnNjaGVkdWxlcik7XHJcblx0XHRcclxuXHRcdHRoaXMucGxheWVyID0gbmV3IFBsYXllcignUGxheWVyJyw0LDQsbmV3IEdseXBoKCdAJywnI2ZmZicpKTtcclxuXHRcdHRoaXMucGxheWVyLmRyYXcoKTtcclxuXHRcdFxyXG5cdFx0bGV0IG0gPSBuZXcgQWN0b3IoJ01vbnN0ZXInLDgsOCxuZXcgR2x5cGgoJ20nLCcjZjAwJykpO1xyXG5cdFx0bS5kcmF3KCk7XHJcblx0XHRcclxuXHRcdHRoaXMuZW5naW5lLnN0YXJ0KCk7XHJcblx0fVxyXG59IiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdseXBoIHtcclxuXHRjb25zdHJ1Y3RvcihjaHIsIGZnLCBiZyl7XHJcblx0XHR0aGlzLmNociA9IGNociB8fCAnICc7XHJcblx0XHR0aGlzLmZnID0gZmcgfHwgbnVsbDtcclxuXHRcdHRoaXMuYmcgPSBiZyB8fCBudWxsO1xyXG5cdH1cclxufSIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XHJcbmltcG9ydCB7IFRpbGUsIFRpbGVUeXBlcyB9IGZyb20gJy4vdGlsZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWxlTWFwIHtcclxuXHRjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KXtcclxuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcclxuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFx0dGhpcy50aWxlcyA9IG5ldyBNYXAoKTtcclxuXHRcdGZvcihsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCsrKXtcclxuXHRcdFx0Zm9yKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKXtcclxuXHRcdFx0XHR0aGlzLnRpbGVzLnNldCh4KycsJyt5LG5ldyBUaWxlKHgsIHksIFRpbGVUeXBlcy5TS1kpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRzZXQoeCwgeSwgdGlsZSl7XHJcblx0XHR0aGlzLnRpbGVzLnNldCh4KycsJyt5LHRpbGUpO1xyXG5cdH1cclxuXHRnZXQoeCwgeSl7XHJcblx0XHRyZXR1cm4gdGhpcy50aWxlcy5nZXQoeCsnLCcreSk7XHJcblx0fVxyXG5cdGluQm91bmRzKHgsIHkpe1xyXG5cdFx0cmV0dXJuIHggPiAwICYmIHggPCB0aGlzLndpZHRoICYmIHk+IDAgJiYgeSA8IHRoaXMuaGVpZ2h0O1xyXG5cdH1cclxuXHRkcmF3KCl7XHJcblx0XHRmb3IodmFyIHRpbGUgb2YgdGhpcy50aWxlcy52YWx1ZXMoKSl7XHJcblx0XHRcdHRpbGUuZHJhdygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXNldChlLCB4LCB5KXtcclxuXHRcdC8vUmVkcmF3IFRpbGVcclxuXHRcdHRoaXMuZ2V0KHgsIHkpLmRyYXcoKTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgR2x5cGggZnJvbSAnLi9nbHlwaCc7XHJcbmltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XHJcblxyXG5leHBvcnQgbGV0IFRpbGVUeXBlcyA9IHtcclxuXHRXQUxMOiB7XHJcblx0XHRuYW1lOiAnd2FsbCcsXHJcblx0XHRnbHlwaDogbmV3IEdseXBoKCcjJylcclxuXHR9LFxyXG5cdEZMT09SOiB7XHJcblx0XHRuYW1lOiAnZmxvb3InLFxyXG5cdFx0Z2x5cGg6IG5ldyBHbHlwaCgnLicpXHJcblx0fSxcclxuXHRTS1k6IHtcclxuXHRcdG5hbWU6ICdza3knLFxyXG5cdFx0Z2x5cGg6IG5ldyBHbHlwaCgnICcsJyNmZmYnLCdza3libHVlJylcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUaWxlIHtcclxuXHRjb25zdHJ1Y3Rvcih4LCB5LCB0eXBlKXtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy50eXBlID0gdHlwZS5uYW1lO1xyXG5cdFx0dGhpcy5fZ2x5cGggPSB0eXBlLmdseXBoO1xyXG5cdH1cclxuXHRnZXQgZ2x5cGgoKXsgcmV0dXJuIHRoaXMuX2dseXBoOyB9XHJcblx0c2V0IGdseXBoKGdseXBoKSB7IHRoaXMuX2dseXBoID0gZ2x5cGg7IHRoaXMuZHJhdygpOyB9XHJcblx0ZHJhdygpe1xyXG5cdFx0R2FtZS5kaXNwbGF5LmRyYXcodGhpcy54LCB0aGlzLnksIHRoaXMuZ2x5cGguY2hyLCB0aGlzLmdseXBoLmZnLCB0aGlzLmdseXBoLmJnKTtcclxuXHR9XHJcbn0iLCIoZnVuY3Rpb24ocm9vdCxmYWN0b3J5KXtpZih0eXBlb2YgZXhwb3J0cz09PVwib2JqZWN0XCImJnR5cGVvZiBtb2R1bGU9PT1cIm9iamVjdFwiKW1vZHVsZS5leHBvcnRzPWZhY3RvcnkoKTtlbHNlIGlmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQpZGVmaW5lKFwiRXZlbnRCdXNcIixbXSxmYWN0b3J5KTtlbHNlIGlmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIilleHBvcnRzW1wiRXZlbnRCdXNcIl09ZmFjdG9yeSgpO2Vsc2Ugcm9vdFtcIkV2ZW50QnVzXCJdPWZhY3RvcnkoKX0pKHRoaXMsZnVuY3Rpb24oKXt2YXIgRXZlbnRCdXNDbGFzcz17fTtFdmVudEJ1c0NsYXNzPWZ1bmN0aW9uKCl7dGhpcy5saXN0ZW5lcnM9e319O0V2ZW50QnVzQ2xhc3MucHJvdG90eXBlPXthZGRFdmVudExpc3RlbmVyOmZ1bmN0aW9uKHR5cGUsY2FsbGJhY2ssc2NvcGUpe3ZhciBhcmdzPVtdO3ZhciBudW1PZkFyZ3M9YXJndW1lbnRzLmxlbmd0aDtmb3IodmFyIGk9MDtpPG51bU9mQXJncztpKyspe2FyZ3MucHVzaChhcmd1bWVudHNbaV0pfWFyZ3M9YXJncy5sZW5ndGg+Mz9hcmdzLnNwbGljZSgzLGFyZ3MubGVuZ3RoLTEpOltdO2lmKHR5cGVvZiB0aGlzLmxpc3RlbmVyc1t0eXBlXSE9XCJ1bmRlZmluZWRcIil7dGhpcy5saXN0ZW5lcnNbdHlwZV0ucHVzaCh7c2NvcGU6c2NvcGUsY2FsbGJhY2s6Y2FsbGJhY2ssYXJnczphcmdzfSl9ZWxzZXt0aGlzLmxpc3RlbmVyc1t0eXBlXT1be3Njb3BlOnNjb3BlLGNhbGxiYWNrOmNhbGxiYWNrLGFyZ3M6YXJnc31dfX0scmVtb3ZlRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlLGNhbGxiYWNrLHNjb3BlKXtpZih0eXBlb2YgdGhpcy5saXN0ZW5lcnNbdHlwZV0hPVwidW5kZWZpbmVkXCIpe3ZhciBudW1PZkNhbGxiYWNrcz10aGlzLmxpc3RlbmVyc1t0eXBlXS5sZW5ndGg7dmFyIG5ld0FycmF5PVtdO2Zvcih2YXIgaT0wO2k8bnVtT2ZDYWxsYmFja3M7aSsrKXt2YXIgbGlzdGVuZXI9dGhpcy5saXN0ZW5lcnNbdHlwZV1baV07aWYobGlzdGVuZXIuc2NvcGU9PXNjb3BlJiZsaXN0ZW5lci5jYWxsYmFjaz09Y2FsbGJhY2spe31lbHNle25ld0FycmF5LnB1c2gobGlzdGVuZXIpfX10aGlzLmxpc3RlbmVyc1t0eXBlXT1uZXdBcnJheX19LGhhc0V2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSxjYWxsYmFjayxzY29wZSl7aWYodHlwZW9mIHRoaXMubGlzdGVuZXJzW3R5cGVdIT1cInVuZGVmaW5lZFwiKXt2YXIgbnVtT2ZDYWxsYmFja3M9dGhpcy5saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoO2lmKGNhbGxiYWNrPT09dW5kZWZpbmVkJiZzY29wZT09PXVuZGVmaW5lZCl7cmV0dXJuIG51bU9mQ2FsbGJhY2tzPjB9Zm9yKHZhciBpPTA7aTxudW1PZkNhbGxiYWNrcztpKyspe3ZhciBsaXN0ZW5lcj10aGlzLmxpc3RlbmVyc1t0eXBlXVtpXTtpZigoc2NvcGU/bGlzdGVuZXIuc2NvcGU9PXNjb3BlOnRydWUpJiZsaXN0ZW5lci5jYWxsYmFjaz09Y2FsbGJhY2spe3JldHVybiB0cnVlfX19cmV0dXJuIGZhbHNlfSxkaXNwYXRjaDpmdW5jdGlvbih0eXBlLHRhcmdldCl7dmFyIGV2ZW50PXt0eXBlOnR5cGUsdGFyZ2V0OnRhcmdldH07dmFyIGFyZ3M9W107dmFyIG51bU9mQXJncz1hcmd1bWVudHMubGVuZ3RoO2Zvcih2YXIgaT0wO2k8bnVtT2ZBcmdzO2krKyl7YXJncy5wdXNoKGFyZ3VtZW50c1tpXSl9YXJncz1hcmdzLmxlbmd0aD4yP2FyZ3Muc3BsaWNlKDIsYXJncy5sZW5ndGgtMSk6W107YXJncz1bZXZlbnRdLmNvbmNhdChhcmdzKTtpZih0eXBlb2YgdGhpcy5saXN0ZW5lcnNbdHlwZV0hPVwidW5kZWZpbmVkXCIpe3ZhciBsaXN0ZW5lcnM9dGhpcy5saXN0ZW5lcnNbdHlwZV0uc2xpY2UoKTt2YXIgbnVtT2ZDYWxsYmFja3M9bGlzdGVuZXJzLmxlbmd0aDtmb3IodmFyIGk9MDtpPG51bU9mQ2FsbGJhY2tzO2krKyl7dmFyIGxpc3RlbmVyPWxpc3RlbmVyc1tpXTtpZihsaXN0ZW5lciYmbGlzdGVuZXIuY2FsbGJhY2spe3ZhciBjb25jYXRBcmdzPWFyZ3MuY29uY2F0KGxpc3RlbmVyLmFyZ3MpO2xpc3RlbmVyLmNhbGxiYWNrLmFwcGx5KGxpc3RlbmVyLnNjb3BlLGNvbmNhdEFyZ3MpfX19fSxnZXRFdmVudHM6ZnVuY3Rpb24oKXt2YXIgc3RyPVwiXCI7Zm9yKHZhciB0eXBlIGluIHRoaXMubGlzdGVuZXJzKXt2YXIgbnVtT2ZDYWxsYmFja3M9dGhpcy5saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoO2Zvcih2YXIgaT0wO2k8bnVtT2ZDYWxsYmFja3M7aSsrKXt2YXIgbGlzdGVuZXI9dGhpcy5saXN0ZW5lcnNbdHlwZV1baV07c3RyKz1saXN0ZW5lci5zY29wZSYmbGlzdGVuZXIuc2NvcGUuY2xhc3NOYW1lP2xpc3RlbmVyLnNjb3BlLmNsYXNzTmFtZTpcImFub255bW91c1wiO3N0cis9XCIgbGlzdGVuIGZvciAnXCIrdHlwZStcIidcXG5cIn19cmV0dXJuIHN0cn19O3ZhciBFdmVudEJ1cz1uZXcgRXZlbnRCdXNDbGFzcztyZXR1cm4gRXZlbnRCdXN9KTsiLCIvKlxyXG5cdFRoaXMgaXMgcm90LmpzLCB0aGUgUk9ndWVsaWtlIFRvb2xraXQgaW4gSmF2YVNjcmlwdC5cclxuXHRWZXJzaW9uIDAuN35kZXYsIGdlbmVyYXRlZCBvbiBUaHUgMjQgTm92IDIwMTYgMDg6MDc6MzkgTVNULlxyXG4qL1xyXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcclxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXHJcbiAgICAgICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XHJcbiAgICAgICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXHJcbiAgICAgICAgLy8gbGlrZSBOb2RlLlxyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxyXG4gICAgICAgIHJvb3QuUk9UID0gZmFjdG9yeSgpO1xyXG4gICAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uKCkge1xyXG4vKipcclxuICogQG5hbWVzcGFjZSBUb3AtbGV2ZWwgUk9UIG5hbWVzcGFjZVxyXG4gKi9cclxudmFyIFJPVCA9IHtcclxuXHQvKipcclxuXHQgKiBAcmV0dXJucyB7Ym9vbH0gSXMgcm90LmpzIHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXI/XHJcblx0ICovXHJcblx0aXNTdXBwb3J0ZWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuICEhKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikuZ2V0Q29udGV4dCAmJiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCk7XHJcblx0fSxcclxuXHJcblx0LyoqIERlZmF1bHQgd2l0aCBmb3IgZGlzcGxheSBhbmQgbWFwIGdlbmVyYXRvcnMgKi9cclxuXHRERUZBVUxUX1dJRFRIOiA4MCxcclxuXHQvKiogRGVmYXVsdCBoZWlnaHQgZm9yIGRpc3BsYXkgYW5kIG1hcCBnZW5lcmF0b3JzICovXHJcblx0REVGQVVMVF9IRUlHSFQ6IDI1LFxyXG5cclxuXHQvKiogRGlyZWN0aW9uYWwgY29uc3RhbnRzLiBPcmRlcmluZyBpcyBpbXBvcnRhbnQhICovXHJcblx0RElSUzoge1xyXG5cdFx0XCI0XCI6IFtcclxuXHRcdFx0WyAwLCAtMV0sXHJcblx0XHRcdFsgMSwgIDBdLFxyXG5cdFx0XHRbIDAsICAxXSxcclxuXHRcdFx0Wy0xLCAgMF1cclxuXHRcdF0sXHJcblx0XHRcIjhcIjogW1xyXG5cdFx0XHRbIDAsIC0xXSxcclxuXHRcdFx0WyAxLCAtMV0sXHJcblx0XHRcdFsgMSwgIDBdLFxyXG5cdFx0XHRbIDEsICAxXSxcclxuXHRcdFx0WyAwLCAgMV0sXHJcblx0XHRcdFstMSwgIDFdLFxyXG5cdFx0XHRbLTEsICAwXSxcclxuXHRcdFx0Wy0xLCAtMV1cclxuXHRcdF0sXHJcblx0XHRcIjZcIjogW1xyXG5cdFx0XHRbLTEsIC0xXSxcclxuXHRcdFx0WyAxLCAtMV0sXHJcblx0XHRcdFsgMiwgIDBdLFxyXG5cdFx0XHRbIDEsICAxXSxcclxuXHRcdFx0Wy0xLCAgMV0sXHJcblx0XHRcdFstMiwgIDBdXHJcblx0XHRdXHJcblx0fSxcclxuXHJcblx0LyoqIENhbmNlbCBrZXkuICovXHJcblx0VktfQ0FOQ0VMOiAzLCBcclxuXHQvKiogSGVscCBrZXkuICovXHJcblx0VktfSEVMUDogNiwgXHJcblx0LyoqIEJhY2tzcGFjZSBrZXkuICovXHJcblx0VktfQkFDS19TUEFDRTogOCwgXHJcblx0LyoqIFRhYiBrZXkuICovXHJcblx0VktfVEFCOiA5LCBcclxuXHQvKiogNSBrZXkgb24gTnVtcGFkIHdoZW4gTnVtTG9jayBpcyB1bmxvY2tlZC4gT3Igb24gTWFjLCBjbGVhciBrZXkgd2hpY2ggaXMgcG9zaXRpb25lZCBhdCBOdW1Mb2NrIGtleS4gKi9cclxuXHRWS19DTEVBUjogMTIsIFxyXG5cdC8qKiBSZXR1cm4vZW50ZXIga2V5IG9uIHRoZSBtYWluIGtleWJvYXJkLiAqL1xyXG5cdFZLX1JFVFVSTjogMTMsIFxyXG5cdC8qKiBSZXNlcnZlZCwgYnV0IG5vdCB1c2VkLiAqL1xyXG5cdFZLX0VOVEVSOiAxNCwgXHJcblx0LyoqIFNoaWZ0IGtleS4gKi9cclxuXHRWS19TSElGVDogMTYsIFxyXG5cdC8qKiBDb250cm9sIGtleS4gKi9cclxuXHRWS19DT05UUk9MOiAxNywgXHJcblx0LyoqIEFsdCAoT3B0aW9uIG9uIE1hYykga2V5LiAqL1xyXG5cdFZLX0FMVDogMTgsIFxyXG5cdC8qKiBQYXVzZSBrZXkuICovXHJcblx0VktfUEFVU0U6IDE5LCBcclxuXHQvKiogQ2FwcyBsb2NrLiAqL1xyXG5cdFZLX0NBUFNfTE9DSzogMjAsIFxyXG5cdC8qKiBFc2NhcGUga2V5LiAqL1xyXG5cdFZLX0VTQ0FQRTogMjcsIFxyXG5cdC8qKiBTcGFjZSBiYXIuICovXHJcblx0VktfU1BBQ0U6IDMyLCBcclxuXHQvKiogUGFnZSBVcCBrZXkuICovXHJcblx0VktfUEFHRV9VUDogMzMsIFxyXG5cdC8qKiBQYWdlIERvd24ga2V5LiAqL1xyXG5cdFZLX1BBR0VfRE9XTjogMzQsIFxyXG5cdC8qKiBFbmQga2V5LiAqL1xyXG5cdFZLX0VORDogMzUsIFxyXG5cdC8qKiBIb21lIGtleS4gKi9cclxuXHRWS19IT01FOiAzNiwgXHJcblx0LyoqIExlZnQgYXJyb3cuICovXHJcblx0VktfTEVGVDogMzcsIFxyXG5cdC8qKiBVcCBhcnJvdy4gKi9cclxuXHRWS19VUDogMzgsIFxyXG5cdC8qKiBSaWdodCBhcnJvdy4gKi9cclxuXHRWS19SSUdIVDogMzksIFxyXG5cdC8qKiBEb3duIGFycm93LiAqL1xyXG5cdFZLX0RPV046IDQwLCBcclxuXHQvKiogUHJpbnQgU2NyZWVuIGtleS4gKi9cclxuXHRWS19QUklOVFNDUkVFTjogNDQsIFxyXG5cdC8qKiBJbnMoZXJ0KSBrZXkuICovXHJcblx0VktfSU5TRVJUOiA0NSwgXHJcblx0LyoqIERlbChldGUpIGtleS4gKi9cclxuXHRWS19ERUxFVEU6IDQ2LCBcclxuXHQvKioqL1xyXG5cdFZLXzA6IDQ4LFxyXG5cdC8qKiovXHJcblx0VktfMTogNDksXHJcblx0LyoqKi9cclxuXHRWS18yOiA1MCxcclxuXHQvKioqL1xyXG5cdFZLXzM6IDUxLFxyXG5cdC8qKiovXHJcblx0VktfNDogNTIsXHJcblx0LyoqKi9cclxuXHRWS181OiA1MyxcclxuXHQvKioqL1xyXG5cdFZLXzY6IDU0LFxyXG5cdC8qKiovXHJcblx0VktfNzogNTUsXHJcblx0LyoqKi9cclxuXHRWS184OiA1NixcclxuXHQvKioqL1xyXG5cdFZLXzk6IDU3LFxyXG5cdC8qKiBDb2xvbiAoOikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQ09MT046IDU4LCBcclxuXHQvKiogU2VtaWNvbG9uICg7KSBrZXkuICovXHJcblx0VktfU0VNSUNPTE9OOiA1OSwgXHJcblx0LyoqIExlc3MtdGhhbiAoPCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfTEVTU19USEFOOiA2MCwgXHJcblx0LyoqIEVxdWFscyAoPSkga2V5LiAqL1xyXG5cdFZLX0VRVUFMUzogNjEsIFxyXG5cdC8qKiBHcmVhdGVyLXRoYW4gKD4pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0dSRUFURVJfVEhBTjogNjIsIFxyXG5cdC8qKiBRdWVzdGlvbiBtYXJrICg/KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19RVUVTVElPTl9NQVJLOiA2MywgXHJcblx0LyoqIEF0bWFyayAoQCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQVQ6IDY0LCBcclxuXHQvKioqL1xyXG5cdFZLX0E6IDY1LFxyXG5cdC8qKiovXHJcblx0VktfQjogNjYsXHJcblx0LyoqKi9cclxuXHRWS19DOiA2NyxcclxuXHQvKioqL1xyXG5cdFZLX0Q6IDY4LFxyXG5cdC8qKiovXHJcblx0VktfRTogNjksXHJcblx0LyoqKi9cclxuXHRWS19GOiA3MCxcclxuXHQvKioqL1xyXG5cdFZLX0c6IDcxLFxyXG5cdC8qKiovXHJcblx0VktfSDogNzIsXHJcblx0LyoqKi9cclxuXHRWS19JOiA3MyxcclxuXHQvKioqL1xyXG5cdFZLX0o6IDc0LFxyXG5cdC8qKiovXHJcblx0VktfSzogNzUsXHJcblx0LyoqKi9cclxuXHRWS19MOiA3NixcclxuXHQvKioqL1xyXG5cdFZLX006IDc3LFxyXG5cdC8qKiovXHJcblx0VktfTjogNzgsXHJcblx0LyoqKi9cclxuXHRWS19POiA3OSxcclxuXHQvKioqL1xyXG5cdFZLX1A6IDgwLFxyXG5cdC8qKiovXHJcblx0VktfUTogODEsXHJcblx0LyoqKi9cclxuXHRWS19SOiA4MixcclxuXHQvKioqL1xyXG5cdFZLX1M6IDgzLFxyXG5cdC8qKiovXHJcblx0VktfVDogODQsXHJcblx0LyoqKi9cclxuXHRWS19VOiA4NSxcclxuXHQvKioqL1xyXG5cdFZLX1Y6IDg2LFxyXG5cdC8qKiovXHJcblx0VktfVzogODcsXHJcblx0LyoqKi9cclxuXHRWS19YOiA4OCxcclxuXHQvKioqL1xyXG5cdFZLX1k6IDg5LFxyXG5cdC8qKiovXHJcblx0VktfWjogOTAsXHJcblx0LyoqKi9cclxuXHRWS19DT05URVhUX01FTlU6IDkzLFxyXG5cdC8qKiAwIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQwOiA5NiwgXHJcblx0LyoqIDEgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDE6IDk3LCBcclxuXHQvKiogMiBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEMjogOTgsIFxyXG5cdC8qKiAzIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQzOiA5OSwgXHJcblx0LyoqIDQgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDQ6IDEwMCwgXHJcblx0LyoqIDUgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDU6IDEwMSwgXHJcblx0LyoqIDYgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDY6IDEwMiwgXHJcblx0LyoqIDcgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDc6IDEwMywgXHJcblx0LyoqIDggb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDg6IDEwNCwgXHJcblx0LyoqIDkgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDk6IDEwNSwgXHJcblx0LyoqICogb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX01VTFRJUExZOiAxMDYsXHJcblx0LyoqICsgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX0FERDogMTA3LCBcclxuXHQvKioqL1xyXG5cdFZLX1NFUEFSQVRPUjogMTA4LFxyXG5cdC8qKiAtIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19TVUJUUkFDVDogMTA5LCBcclxuXHQvKiogRGVjaW1hbCBwb2ludCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfREVDSU1BTDogMTEwLCBcclxuXHQvKiogLyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfRElWSURFOiAxMTEsIFxyXG5cdC8qKiBGMSBrZXkuICovXHJcblx0VktfRjE6IDExMiwgXHJcblx0LyoqIEYyIGtleS4gKi9cclxuXHRWS19GMjogMTEzLCBcclxuXHQvKiogRjMga2V5LiAqL1xyXG5cdFZLX0YzOiAxMTQsIFxyXG5cdC8qKiBGNCBrZXkuICovXHJcblx0VktfRjQ6IDExNSwgXHJcblx0LyoqIEY1IGtleS4gKi9cclxuXHRWS19GNTogMTE2LCBcclxuXHQvKiogRjYga2V5LiAqL1xyXG5cdFZLX0Y2OiAxMTcsIFxyXG5cdC8qKiBGNyBrZXkuICovXHJcblx0VktfRjc6IDExOCwgXHJcblx0LyoqIEY4IGtleS4gKi9cclxuXHRWS19GODogMTE5LCBcclxuXHQvKiogRjkga2V5LiAqL1xyXG5cdFZLX0Y5OiAxMjAsIFxyXG5cdC8qKiBGMTAga2V5LiAqL1xyXG5cdFZLX0YxMDogMTIxLCBcclxuXHQvKiogRjExIGtleS4gKi9cclxuXHRWS19GMTE6IDEyMiwgXHJcblx0LyoqIEYxMiBrZXkuICovXHJcblx0VktfRjEyOiAxMjMsIFxyXG5cdC8qKiBGMTMga2V5LiAqL1xyXG5cdFZLX0YxMzogMTI0LCBcclxuXHQvKiogRjE0IGtleS4gKi9cclxuXHRWS19GMTQ6IDEyNSwgXHJcblx0LyoqIEYxNSBrZXkuICovXHJcblx0VktfRjE1OiAxMjYsIFxyXG5cdC8qKiBGMTYga2V5LiAqL1xyXG5cdFZLX0YxNjogMTI3LCBcclxuXHQvKiogRjE3IGtleS4gKi9cclxuXHRWS19GMTc6IDEyOCwgXHJcblx0LyoqIEYxOCBrZXkuICovXHJcblx0VktfRjE4OiAxMjksIFxyXG5cdC8qKiBGMTkga2V5LiAqL1xyXG5cdFZLX0YxOTogMTMwLCBcclxuXHQvKiogRjIwIGtleS4gKi9cclxuXHRWS19GMjA6IDEzMSwgXHJcblx0LyoqIEYyMSBrZXkuICovXHJcblx0VktfRjIxOiAxMzIsIFxyXG5cdC8qKiBGMjIga2V5LiAqL1xyXG5cdFZLX0YyMjogMTMzLCBcclxuXHQvKiogRjIzIGtleS4gKi9cclxuXHRWS19GMjM6IDEzNCwgXHJcblx0LyoqIEYyNCBrZXkuICovXHJcblx0VktfRjI0OiAxMzUsIFxyXG5cdC8qKiBOdW0gTG9jayBrZXkuICovXHJcblx0VktfTlVNX0xPQ0s6IDE0NCwgXHJcblx0LyoqIFNjcm9sbCBMb2NrIGtleS4gKi9cclxuXHRWS19TQ1JPTExfTE9DSzogMTQ1LCBcclxuXHQvKiogQ2lyY3VtZmxleCAoXikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQ0lSQ1VNRkxFWDogMTYwLCBcclxuXHQvKiogRXhjbGFtYXRpb24gKCEpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0VYQ0xBTUFUSU9OOiAxNjEsIFxyXG5cdC8qKiBEb3VibGUgcXVvdGUgKCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfRE9VQkxFX1FVT1RFOiAxNjIsIFxyXG5cdC8qKiBIYXNoICgjKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19IQVNIOiAxNjMsIFxyXG5cdC8qKiBEb2xsYXIgc2lnbiAoJCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfRE9MTEFSOiAxNjQsIFxyXG5cdC8qKiBQZXJjZW50ICglKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19QRVJDRU5UOiAxNjUsIFxyXG5cdC8qKiBBbXBlcnNhbmQgKCYpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0FNUEVSU0FORDogMTY2LCBcclxuXHQvKiogVW5kZXJzY29yZSAoXykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfVU5ERVJTQ09SRTogMTY3LCBcclxuXHQvKiogT3BlbiBwYXJlbnRoZXNpcyAoKCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfT1BFTl9QQVJFTjogMTY4LCBcclxuXHQvKiogQ2xvc2UgcGFyZW50aGVzaXMgKCkpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0NMT1NFX1BBUkVOOiAxNjksIFxyXG5cdC8qIEFzdGVyaXNrICgqKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19BU1RFUklTSzogMTcwLFxyXG5cdC8qKiBQbHVzICgrKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19QTFVTOiAxNzEsIFxyXG5cdC8qKiBQaXBlICh8KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19QSVBFOiAxNzIsIFxyXG5cdC8qKiBIeXBoZW4tVVMvZG9jcy9NaW51cyAoLSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfSFlQSEVOX01JTlVTOiAxNzMsIFxyXG5cdC8qKiBPcGVuIGN1cmx5IGJyYWNrZXQgKHspIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX09QRU5fQ1VSTFlfQlJBQ0tFVDogMTc0LCBcclxuXHQvKiogQ2xvc2UgY3VybHkgYnJhY2tldCAofSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQ0xPU0VfQ1VSTFlfQlJBQ0tFVDogMTc1LCBcclxuXHQvKiogVGlsZGUgKH4pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1RJTERFOiAxNzYsIFxyXG5cdC8qKiBDb21tYSAoLCkga2V5LiAqL1xyXG5cdFZLX0NPTU1BOiAxODgsIFxyXG5cdC8qKiBQZXJpb2QgKC4pIGtleS4gKi9cclxuXHRWS19QRVJJT0Q6IDE5MCwgXHJcblx0LyoqIFNsYXNoICgvKSBrZXkuICovXHJcblx0VktfU0xBU0g6IDE5MSwgXHJcblx0LyoqIEJhY2sgdGljayAoYCkga2V5LiAqL1xyXG5cdFZLX0JBQ0tfUVVPVEU6IDE5MiwgXHJcblx0LyoqIE9wZW4gc3F1YXJlIGJyYWNrZXQgKFspIGtleS4gKi9cclxuXHRWS19PUEVOX0JSQUNLRVQ6IDIxOSwgXHJcblx0LyoqIEJhY2sgc2xhc2ggKFxcKSBrZXkuICovXHJcblx0VktfQkFDS19TTEFTSDogMjIwLCBcclxuXHQvKiogQ2xvc2Ugc3F1YXJlIGJyYWNrZXQgKF0pIGtleS4gKi9cclxuXHRWS19DTE9TRV9CUkFDS0VUOiAyMjEsIFxyXG5cdC8qKiBRdW90ZSAoJycnKSBrZXkuICovXHJcblx0VktfUVVPVEU6IDIyMiwgXHJcblx0LyoqIE1ldGEga2V5IG9uIExpbnV4LCBDb21tYW5kIGtleSBvbiBNYWMuICovXHJcblx0VktfTUVUQTogMjI0LCBcclxuXHQvKiogQWx0R3Iga2V5IG9uIExpbnV4LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQUxUR1I6IDIyNSwgXHJcblx0LyoqIFdpbmRvd3MgbG9nbyBrZXkgb24gV2luZG93cy4gT3IgU3VwZXIgb3IgSHlwZXIga2V5IG9uIExpbnV4LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfV0lOOiA5MSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0tBTkE6IDIxLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfSEFOR1VMOiAyMSwgXHJcblx0LyoqIOiLseaVsCBrZXkgb24gSmFwYW5lc2UgTWFjIGtleWJvYXJkLiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfRUlTVTogMjIsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19KVU5KQTogMjMsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19GSU5BTDogMjQsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19IQU5KQTogMjUsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19LQU5KSTogMjUsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19DT05WRVJUOiAyOCwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX05PTkNPTlZFUlQ6IDI5LCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfQUNDRVBUOiAzMCwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX01PREVDSEFOR0U6IDMxLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfU0VMRUNUOiA0MSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX1BSSU5UOiA0MiwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0VYRUNVVEU6IDQzLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuXHQgKi9cclxuXHRWS19TTEVFUDogOTUgXHJcbn07XHJcbi8qKlxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqIENvbnRhaW5zIHRleHQgdG9rZW5pemF0aW9uIGFuZCBicmVha2luZyByb3V0aW5lc1xyXG4gKi9cclxuUk9ULlRleHQgPSB7XHJcblx0UkVfQ09MT1JTOiAvJShbYmNdKXsoW159XSopfS9nLFxyXG5cclxuXHQvKiB0b2tlbiB0eXBlcyAqL1xyXG5cdFRZUEVfVEVYVDpcdFx0MCxcclxuXHRUWVBFX05FV0xJTkU6XHQxLFxyXG5cdFRZUEVfRkc6XHRcdDIsXHJcblx0VFlQRV9CRzpcdFx0MyxcclxuXHJcblx0LyoqXHJcblx0ICogTWVhc3VyZSBzaXplIG9mIGEgcmVzdWx0aW5nIHRleHQgYmxvY2tcclxuXHQgKi9cclxuXHRtZWFzdXJlOiBmdW5jdGlvbihzdHIsIG1heFdpZHRoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0ge3dpZHRoOjAsIGhlaWdodDoxfTtcclxuXHRcdHZhciB0b2tlbnMgPSB0aGlzLnRva2VuaXplKHN0ciwgbWF4V2lkdGgpO1xyXG5cdFx0dmFyIGxpbmVXaWR0aCA9IDA7XHJcblxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dG9rZW5zLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0dmFyIHRva2VuID0gdG9rZW5zW2ldO1xyXG5cdFx0XHRzd2l0Y2ggKHRva2VuLnR5cGUpIHtcclxuXHRcdFx0XHRjYXNlIHRoaXMuVFlQRV9URVhUOlxyXG5cdFx0XHRcdFx0bGluZVdpZHRoICs9IHRva2VuLnZhbHVlLmxlbmd0aDtcclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSB0aGlzLlRZUEVfTkVXTElORTpcclxuXHRcdFx0XHRcdHJlc3VsdC5oZWlnaHQrKztcclxuXHRcdFx0XHRcdHJlc3VsdC53aWR0aCA9IE1hdGgubWF4KHJlc3VsdC53aWR0aCwgbGluZVdpZHRoKTtcclxuXHRcdFx0XHRcdGxpbmVXaWR0aCA9IDA7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJlc3VsdC53aWR0aCA9IE1hdGgubWF4KHJlc3VsdC53aWR0aCwgbGluZVdpZHRoKTtcclxuXHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbnZlcnQgc3RyaW5nIHRvIGEgc2VyaWVzIG9mIGEgZm9ybWF0dGluZyBjb21tYW5kc1xyXG5cdCAqL1xyXG5cdHRva2VuaXplOiBmdW5jdGlvbihzdHIsIG1heFdpZHRoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW107XHJcblxyXG5cdFx0LyogZmlyc3QgdG9rZW5pemF0aW9uIHBhc3MgLSBzcGxpdCB0ZXh0cyBhbmQgY29sb3IgZm9ybWF0dGluZyBjb21tYW5kcyAqL1xyXG5cdFx0dmFyIG9mZnNldCA9IDA7XHJcblx0XHRzdHIucmVwbGFjZSh0aGlzLlJFX0NPTE9SUywgZnVuY3Rpb24obWF0Y2gsIHR5cGUsIG5hbWUsIGluZGV4KSB7XHJcblx0XHRcdC8qIHN0cmluZyBiZWZvcmUgKi9cclxuXHRcdFx0dmFyIHBhcnQgPSBzdHIuc3Vic3RyaW5nKG9mZnNldCwgaW5kZXgpO1xyXG5cdFx0XHRpZiAocGFydC5sZW5ndGgpIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaCh7XHJcblx0XHRcdFx0XHR0eXBlOiBST1QuVGV4dC5UWVBFX1RFWFQsXHJcblx0XHRcdFx0XHR2YWx1ZTogcGFydFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKiBjb2xvciBjb21tYW5kICovXHJcblx0XHRcdHJlc3VsdC5wdXNoKHtcclxuXHRcdFx0XHR0eXBlOiAodHlwZSA9PSBcImNcIiA/IFJPVC5UZXh0LlRZUEVfRkcgOiBST1QuVGV4dC5UWVBFX0JHKSxcclxuXHRcdFx0XHR2YWx1ZTogbmFtZS50cmltKClcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRvZmZzZXQgPSBpbmRleCArIG1hdGNoLmxlbmd0aDtcclxuXHRcdFx0cmV0dXJuIFwiXCI7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvKiBsYXN0IHJlbWFpbmluZyBwYXJ0ICovXHJcblx0XHR2YXIgcGFydCA9IHN0ci5zdWJzdHJpbmcob2Zmc2V0KTtcclxuXHRcdGlmIChwYXJ0Lmxlbmd0aCkge1xyXG5cdFx0XHRyZXN1bHQucHVzaCh7XHJcblx0XHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9URVhULFxyXG5cdFx0XHRcdHZhbHVlOiBwYXJ0XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLl9icmVha0xpbmVzKHJlc3VsdCwgbWF4V2lkdGgpO1xyXG5cdH0sXHJcblxyXG5cdC8qIGluc2VydCBsaW5lIGJyZWFrcyBpbnRvIGZpcnN0LXBhc3MgdG9rZW5pemVkIGRhdGEgKi9cclxuXHRfYnJlYWtMaW5lczogZnVuY3Rpb24odG9rZW5zLCBtYXhXaWR0aCkge1xyXG5cdFx0aWYgKCFtYXhXaWR0aCkgeyBtYXhXaWR0aCA9IEluZmluaXR5OyB9XHJcblxyXG5cdFx0dmFyIGkgPSAwO1xyXG5cdFx0dmFyIGxpbmVMZW5ndGggPSAwO1xyXG5cdFx0dmFyIGxhc3RUb2tlbldpdGhTcGFjZSA9IC0xO1xyXG5cclxuXHRcdHdoaWxlIChpIDwgdG9rZW5zLmxlbmd0aCkgeyAvKiB0YWtlIGFsbCB0ZXh0IHRva2VucywgcmVtb3ZlIHNwYWNlLCBhcHBseSBsaW5lYnJlYWtzICovXHJcblx0XHRcdHZhciB0b2tlbiA9IHRva2Vuc1tpXTtcclxuXHRcdFx0aWYgKHRva2VuLnR5cGUgPT0gUk9ULlRleHQuVFlQRV9ORVdMSU5FKSB7IC8qIHJlc2V0ICovXHJcblx0XHRcdFx0bGluZUxlbmd0aCA9IDA7IFxyXG5cdFx0XHRcdGxhc3RUb2tlbldpdGhTcGFjZSA9IC0xO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0b2tlbi50eXBlICE9IFJPVC5UZXh0LlRZUEVfVEVYVCkgeyAvKiBza2lwIG5vbi10ZXh0IHRva2VucyAqL1xyXG5cdFx0XHRcdGkrKztcclxuXHRcdFx0XHRjb250aW51ZTsgXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qIHJlbW92ZSBzcGFjZXMgYXQgdGhlIGJlZ2lubmluZyBvZiBsaW5lICovXHJcblx0XHRcdHdoaWxlIChsaW5lTGVuZ3RoID09IDAgJiYgdG9rZW4udmFsdWUuY2hhckF0KDApID09IFwiIFwiKSB7IHRva2VuLnZhbHVlID0gdG9rZW4udmFsdWUuc3Vic3RyaW5nKDEpOyB9XHJcblxyXG5cdFx0XHQvKiBmb3JjZWQgbmV3bGluZT8gaW5zZXJ0IHR3byBuZXcgdG9rZW5zIGFmdGVyIHRoaXMgb25lICovXHJcblx0XHRcdHZhciBpbmRleCA9IHRva2VuLnZhbHVlLmluZGV4T2YoXCJcXG5cIik7XHJcblx0XHRcdGlmIChpbmRleCAhPSAtMSkgeyBcclxuXHRcdFx0XHR0b2tlbi52YWx1ZSA9IHRoaXMuX2JyZWFrSW5zaWRlVG9rZW4odG9rZW5zLCBpLCBpbmRleCwgdHJ1ZSk7IFxyXG5cclxuXHRcdFx0XHQvKiBpZiB0aGVyZSBhcmUgc3BhY2VzIGF0IHRoZSBlbmQsIHdlIG11c3QgcmVtb3ZlIHRoZW0gKHdlIGRvIG5vdCB3YW50IHRoZSBsaW5lIHRvbyBsb25nKSAqL1xyXG5cdFx0XHRcdHZhciBhcnIgPSB0b2tlbi52YWx1ZS5zcGxpdChcIlwiKTtcclxuXHRcdFx0XHR3aGlsZSAoYXJyLmxlbmd0aCAmJiBhcnJbYXJyLmxlbmd0aC0xXSA9PSBcIiBcIikgeyBhcnIucG9wKCk7IH1cclxuXHRcdFx0XHR0b2tlbi52YWx1ZSA9IGFyci5qb2luKFwiXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKiB0b2tlbiBkZWdlbmVyYXRlZD8gKi9cclxuXHRcdFx0aWYgKCF0b2tlbi52YWx1ZS5sZW5ndGgpIHtcclxuXHRcdFx0XHR0b2tlbnMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAobGluZUxlbmd0aCArIHRva2VuLnZhbHVlLmxlbmd0aCA+IG1heFdpZHRoKSB7IC8qIGxpbmUgdG9vIGxvbmcsIGZpbmQgYSBzdWl0YWJsZSBicmVha2luZyBzcG90ICovXHJcblxyXG5cdFx0XHRcdC8qIGlzIGl0IHBvc3NpYmxlIHRvIGJyZWFrIHdpdGhpbiB0aGlzIHRva2VuPyAqL1xyXG5cdFx0XHRcdHZhciBpbmRleCA9IC0xO1xyXG5cdFx0XHRcdHdoaWxlICgxKSB7XHJcblx0XHRcdFx0XHR2YXIgbmV4dEluZGV4ID0gdG9rZW4udmFsdWUuaW5kZXhPZihcIiBcIiwgaW5kZXgrMSk7XHJcblx0XHRcdFx0XHRpZiAobmV4dEluZGV4ID09IC0xKSB7IGJyZWFrOyB9XHJcblx0XHRcdFx0XHRpZiAobGluZUxlbmd0aCArIG5leHRJbmRleCA+IG1heFdpZHRoKSB7IGJyZWFrOyB9XHJcblx0XHRcdFx0XHRpbmRleCA9IG5leHRJbmRleDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChpbmRleCAhPSAtMSkgeyAvKiBicmVhayBhdCBzcGFjZSB3aXRoaW4gdGhpcyBvbmUgKi9cclxuXHRcdFx0XHRcdHRva2VuLnZhbHVlID0gdGhpcy5fYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGksIGluZGV4LCB0cnVlKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGxhc3RUb2tlbldpdGhTcGFjZSAhPSAtMSkgeyAvKiBpcyB0aGVyZSBhIHByZXZpb3VzIHRva2VuIHdoZXJlIGEgYnJlYWsgY2FuIG9jY3VyPyAqL1xyXG5cdFx0XHRcdFx0dmFyIHRva2VuID0gdG9rZW5zW2xhc3RUb2tlbldpdGhTcGFjZV07XHJcblx0XHRcdFx0XHR2YXIgYnJlYWtJbmRleCA9IHRva2VuLnZhbHVlLmxhc3RJbmRleE9mKFwiIFwiKTtcclxuXHRcdFx0XHRcdHRva2VuLnZhbHVlID0gdGhpcy5fYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGxhc3RUb2tlbldpdGhTcGFjZSwgYnJlYWtJbmRleCwgdHJ1ZSk7XHJcblx0XHRcdFx0XHRpID0gbGFzdFRva2VuV2l0aFNwYWNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7IC8qIGZvcmNlIGJyZWFrIGluIHRoaXMgdG9rZW4gKi9cclxuXHRcdFx0XHRcdHRva2VuLnZhbHVlID0gdGhpcy5fYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGksIG1heFdpZHRoLWxpbmVMZW5ndGgsIGZhbHNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2UgeyAvKiBsaW5lIG5vdCBsb25nLCBjb250aW51ZSAqL1xyXG5cdFx0XHRcdGxpbmVMZW5ndGggKz0gdG9rZW4udmFsdWUubGVuZ3RoO1xyXG5cdFx0XHRcdGlmICh0b2tlbi52YWx1ZS5pbmRleE9mKFwiIFwiKSAhPSAtMSkgeyBsYXN0VG9rZW5XaXRoU3BhY2UgPSBpOyB9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGkrKzsgLyogYWR2YW5jZSB0byBuZXh0IHRva2VuICovXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHRva2Vucy5wdXNoKHt0eXBlOiBST1QuVGV4dC5UWVBFX05FV0xJTkV9KTsgLyogaW5zZXJ0IGZha2UgbmV3bGluZSB0byBmaXggdGhlIGxhc3QgdGV4dCBsaW5lICovXHJcblxyXG5cdFx0LyogcmVtb3ZlIHRyYWlsaW5nIHNwYWNlIGZyb20gdGV4dCB0b2tlbnMgYmVmb3JlIG5ld2xpbmVzICovXHJcblx0XHR2YXIgbGFzdFRleHRUb2tlbiA9IG51bGw7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0b2tlbnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbaV07XHJcblx0XHRcdHN3aXRjaCAodG9rZW4udHlwZSkge1xyXG5cdFx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9URVhUOiBsYXN0VGV4dFRva2VuID0gdG9rZW47IGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9ORVdMSU5FOiBcclxuXHRcdFx0XHRcdGlmIChsYXN0VGV4dFRva2VuKSB7IC8qIHJlbW92ZSB0cmFpbGluZyBzcGFjZSAqL1xyXG5cdFx0XHRcdFx0XHR2YXIgYXJyID0gbGFzdFRleHRUb2tlbi52YWx1ZS5zcGxpdChcIlwiKTtcclxuXHRcdFx0XHRcdFx0d2hpbGUgKGFyci5sZW5ndGggJiYgYXJyW2Fyci5sZW5ndGgtMV0gPT0gXCIgXCIpIHsgYXJyLnBvcCgpOyB9XHJcblx0XHRcdFx0XHRcdGxhc3RUZXh0VG9rZW4udmFsdWUgPSBhcnIuam9pbihcIlwiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxhc3RUZXh0VG9rZW4gPSBudWxsO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dG9rZW5zLnBvcCgpOyAvKiByZW1vdmUgZmFrZSB0b2tlbiAqL1xyXG5cclxuXHRcdHJldHVybiB0b2tlbnM7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlIG5ldyB0b2tlbnMgYW5kIGluc2VydCB0aGVtIGludG8gdGhlIHN0cmVhbVxyXG5cdCAqIEBwYXJhbSB7b2JqZWN0W119IHRva2Vuc1xyXG5cdCAqIEBwYXJhbSB7aW50fSB0b2tlbkluZGV4IFRva2VuIGJlaW5nIHByb2Nlc3NlZFxyXG5cdCAqIEBwYXJhbSB7aW50fSBicmVha0luZGV4IEluZGV4IHdpdGhpbiBjdXJyZW50IHRva2VuJ3MgdmFsdWVcclxuXHQgKiBAcGFyYW0ge2Jvb2x9IHJlbW92ZUJyZWFrQ2hhciBEbyB3ZSB3YW50IHRvIHJlbW92ZSB0aGUgYnJlYWtpbmcgY2hhcmFjdGVyP1xyXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IHJlbWFpbmluZyB1bmJyb2tlbiB0b2tlbiB2YWx1ZVxyXG5cdCAqL1xyXG5cdF9icmVha0luc2lkZVRva2VuOiBmdW5jdGlvbih0b2tlbnMsIHRva2VuSW5kZXgsIGJyZWFrSW5kZXgsIHJlbW92ZUJyZWFrQ2hhcikge1xyXG5cdFx0dmFyIG5ld0JyZWFrVG9rZW4gPSB7XHJcblx0XHRcdHR5cGU6IFJPVC5UZXh0LlRZUEVfTkVXTElORVxyXG5cdFx0fTtcclxuXHRcdHZhciBuZXdUZXh0VG9rZW4gPSB7XHJcblx0XHRcdHR5cGU6IFJPVC5UZXh0LlRZUEVfVEVYVCxcclxuXHRcdFx0dmFsdWU6IHRva2Vuc1t0b2tlbkluZGV4XS52YWx1ZS5zdWJzdHJpbmcoYnJlYWtJbmRleCArIChyZW1vdmVCcmVha0NoYXIgPyAxIDogMCkpXHJcblx0XHR9O1xyXG5cdFx0dG9rZW5zLnNwbGljZSh0b2tlbkluZGV4KzEsIDAsIG5ld0JyZWFrVG9rZW4sIG5ld1RleHRUb2tlbik7XHJcblx0XHRyZXR1cm4gdG9rZW5zW3Rva2VuSW5kZXhdLnZhbHVlLnN1YnN0cmluZygwLCBicmVha0luZGV4KTtcclxuXHR9XHJcbn07XHJcbi8qKlxyXG4gKiBAcmV0dXJucyB7YW55fSBSYW5kb21seSBwaWNrZWQgaXRlbSwgbnVsbCB3aGVuIGxlbmd0aD0wXHJcbiAqL1xyXG5BcnJheS5wcm90b3R5cGUucmFuZG9tID0gQXJyYXkucHJvdG90eXBlLnJhbmRvbSB8fCBmdW5jdGlvbigpIHtcclxuXHRpZiAoIXRoaXMubGVuZ3RoKSB7IHJldHVybiBudWxsOyB9XHJcblx0cmV0dXJuIHRoaXNbTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIHRoaXMubGVuZ3RoKV07XHJcbn07XHJcblxyXG4vKipcclxuICogQHJldHVybnMge2FycmF5fSBOZXcgYXJyYXkgd2l0aCByYW5kb21pemVkIGl0ZW1zXHJcbiAqL1xyXG5BcnJheS5wcm90b3R5cGUucmFuZG9taXplID0gQXJyYXkucHJvdG90eXBlLnJhbmRvbWl6ZSB8fCBmdW5jdGlvbigpIHtcclxuICB2YXIgcmVzdWx0ID0gW107XHJcbiAgdmFyIGNsb25lID0gdGhpcy5zbGljZSgpO1xyXG4gIHdoaWxlIChjbG9uZS5sZW5ndGgpIHtcclxuICAgIHZhciBpbmRleCA9IGNsb25lLmluZGV4T2YoY2xvbmUucmFuZG9tKCkpO1xyXG4gICAgcmVzdWx0LnB1c2goY2xvbmUuc3BsaWNlKGluZGV4LCAxKVswXSk7XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn07XHJcbi8qKlxyXG4gKiBBbHdheXMgcG9zaXRpdmUgbW9kdWx1c1xyXG4gKiBAcGFyYW0ge2ludH0gbiBNb2R1bHVzXHJcbiAqIEByZXR1cm5zIHtpbnR9IHRoaXMgbW9kdWxvIG5cclxuICovXHJcbk51bWJlci5wcm90b3R5cGUubW9kID0gTnVtYmVyLnByb3RvdHlwZS5tb2QgfHwgZnVuY3Rpb24obikge1xyXG5cdHJldHVybiAoKHRoaXMlbikrbiklbjtcclxufTtcclxuLyoqXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEZpcnN0IGxldHRlciBjYXBpdGFsaXplZFxyXG4gKi9cclxuU3RyaW5nLnByb3RvdHlwZS5jYXBpdGFsaXplID0gU3RyaW5nLnByb3RvdHlwZS5jYXBpdGFsaXplIHx8IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5zdWJzdHJpbmcoMSk7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIExlZnQgcGFkXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbY2hhcmFjdGVyPVwiMFwiXVxyXG4gKiBAcGFyYW0ge2ludH0gW2NvdW50PTJdXHJcbiAqL1xyXG5TdHJpbmcucHJvdG90eXBlLmxwYWQgPSBTdHJpbmcucHJvdG90eXBlLmxwYWQgfHwgZnVuY3Rpb24oY2hhcmFjdGVyLCBjb3VudCkge1xyXG5cdHZhciBjaCA9IGNoYXJhY3RlciB8fCBcIjBcIjtcclxuXHR2YXIgY250ID0gY291bnQgfHwgMjtcclxuXHJcblx0dmFyIHMgPSBcIlwiO1xyXG5cdHdoaWxlIChzLmxlbmd0aCA8IChjbnQgLSB0aGlzLmxlbmd0aCkpIHsgcyArPSBjaDsgfVxyXG5cdHMgPSBzLnN1YnN0cmluZygwLCBjbnQtdGhpcy5sZW5ndGgpO1xyXG5cdHJldHVybiBzK3RoaXM7XHJcbn07XHJcblxyXG4vKiogXHJcbiAqIFJpZ2h0IHBhZFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NoYXJhY3Rlcj1cIjBcIl1cclxuICogQHBhcmFtIHtpbnR9IFtjb3VudD0yXVxyXG4gKi9cclxuU3RyaW5nLnByb3RvdHlwZS5ycGFkID0gU3RyaW5nLnByb3RvdHlwZS5ycGFkIHx8IGZ1bmN0aW9uKGNoYXJhY3RlciwgY291bnQpIHtcclxuXHR2YXIgY2ggPSBjaGFyYWN0ZXIgfHwgXCIwXCI7XHJcblx0dmFyIGNudCA9IGNvdW50IHx8IDI7XHJcblxyXG5cdHZhciBzID0gXCJcIjtcclxuXHR3aGlsZSAocy5sZW5ndGggPCAoY250IC0gdGhpcy5sZW5ndGgpKSB7IHMgKz0gY2g7IH1cclxuXHRzID0gcy5zdWJzdHJpbmcoMCwgY250LXRoaXMubGVuZ3RoKTtcclxuXHRyZXR1cm4gdGhpcytzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZvcm1hdCBhIHN0cmluZyBpbiBhIGZsZXhpYmxlIHdheS4gU2NhbnMgZm9yICVzIHN0cmluZ3MgYW5kIHJlcGxhY2VzIHRoZW0gd2l0aCBhcmd1bWVudHMuIExpc3Qgb2YgcGF0dGVybnMgaXMgbW9kaWZpYWJsZSB2aWEgU3RyaW5nLmZvcm1hdC5tYXAuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZVxyXG4gKiBAcGFyYW0ge2FueX0gW2FyZ3ZdXHJcbiAqL1xyXG5TdHJpbmcuZm9ybWF0ID0gU3RyaW5nLmZvcm1hdCB8fCBmdW5jdGlvbih0ZW1wbGF0ZSkge1xyXG5cdHZhciBtYXAgPSBTdHJpbmcuZm9ybWF0Lm1hcDtcclxuXHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcblxyXG5cdHZhciByZXBsYWNlciA9IGZ1bmN0aW9uKG1hdGNoLCBncm91cDEsIGdyb3VwMiwgaW5kZXgpIHtcclxuXHRcdGlmICh0ZW1wbGF0ZS5jaGFyQXQoaW5kZXgtMSkgPT0gXCIlXCIpIHsgcmV0dXJuIG1hdGNoLnN1YnN0cmluZygxKTsgfVxyXG5cdFx0aWYgKCFhcmdzLmxlbmd0aCkgeyByZXR1cm4gbWF0Y2g7IH1cclxuXHRcdHZhciBvYmogPSBhcmdzWzBdO1xyXG5cclxuXHRcdHZhciBncm91cCA9IGdyb3VwMSB8fCBncm91cDI7XHJcblx0XHR2YXIgcGFydHMgPSBncm91cC5zcGxpdChcIixcIik7XHJcblx0XHR2YXIgbmFtZSA9IHBhcnRzLnNoaWZ0KCk7XHJcblx0XHR2YXIgbWV0aG9kID0gbWFwW25hbWUudG9Mb3dlckNhc2UoKV07XHJcblx0XHRpZiAoIW1ldGhvZCkgeyByZXR1cm4gbWF0Y2g7IH1cclxuXHJcblx0XHR2YXIgb2JqID0gYXJncy5zaGlmdCgpO1xyXG5cdFx0dmFyIHJlcGxhY2VkID0gb2JqW21ldGhvZF0uYXBwbHkob2JqLCBwYXJ0cyk7XHJcblxyXG5cdFx0dmFyIGZpcnN0ID0gbmFtZS5jaGFyQXQoMCk7XHJcblx0XHRpZiAoZmlyc3QgIT0gZmlyc3QudG9Mb3dlckNhc2UoKSkgeyByZXBsYWNlZCA9IHJlcGxhY2VkLmNhcGl0YWxpemUoKTsgfVxyXG5cclxuXHRcdHJldHVybiByZXBsYWNlZDtcclxuXHR9O1xyXG5cdHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKC8lKD86KFthLXpdKyl8KD86eyhbXn1dKyl9KSkvZ2ksIHJlcGxhY2VyKTtcclxufTtcclxuXHJcblN0cmluZy5mb3JtYXQubWFwID0gU3RyaW5nLmZvcm1hdC5tYXAgfHwge1xyXG5cdFwic1wiOiBcInRvU3RyaW5nXCJcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb252ZW5pZW5jZSBzaG9ydGN1dCB0byBTdHJpbmcuZm9ybWF0KHRoaXMpXHJcbiAqL1xyXG5TdHJpbmcucHJvdG90eXBlLmZvcm1hdCA9IFN0cmluZy5wcm90b3R5cGUuZm9ybWF0IHx8IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcclxuXHRhcmdzLnVuc2hpZnQodGhpcyk7XHJcblx0cmV0dXJuIFN0cmluZy5mb3JtYXQuYXBwbHkoU3RyaW5nLCBhcmdzKTtcclxufTtcclxuXHJcbmlmICghT2JqZWN0LmNyZWF0ZSkgeyAgXHJcblx0LyoqXHJcblx0ICogRVM1IE9iamVjdC5jcmVhdGVcclxuXHQgKi9cclxuXHRPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24obykgeyAgXHJcblx0XHR2YXIgdG1wID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdHRtcC5wcm90b3R5cGUgPSBvO1xyXG5cdFx0cmV0dXJuIG5ldyB0bXAoKTtcclxuXHR9OyAgXHJcbn0gIFxyXG4vKipcclxuICogU2V0cyBwcm90b3R5cGUgb2YgdGhpcyBmdW5jdGlvbiB0byBhbiBpbnN0YW5jZSBvZiBwYXJlbnQgZnVuY3Rpb25cclxuICogQHBhcmFtIHtmdW5jdGlvbn0gcGFyZW50XHJcbiAqL1xyXG5GdW5jdGlvbi5wcm90b3R5cGUuZXh0ZW5kID0gRnVuY3Rpb24ucHJvdG90eXBlLmV4dGVuZCB8fCBmdW5jdGlvbihwYXJlbnQpIHtcclxuXHR0aGlzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSk7XHJcblx0dGhpcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSB0aGlzO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5pZiAodHlwZW9mIHdpbmRvdyAhPSBcInVuZGVmaW5lZFwiKSB7XHJcblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9XHJcblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCBmdW5jdGlvbihjYikgeyByZXR1cm4gc2V0VGltZW91dChjYiwgMTAwMC82MCk7IH07XHJcblxyXG5cdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9XHJcblx0XHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cub0NhbmNlbEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cubXNDYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgZnVuY3Rpb24oaWQpIHsgcmV0dXJuIGNsZWFyVGltZW91dChpZCk7IH07XHJcbn1cclxuLyoqXHJcbiAqIEBjbGFzcyBWaXN1YWwgbWFwIGRpc3BsYXlcclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMud2lkdGg9Uk9ULkRFRkFVTFRfV0lEVEhdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5oZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMuZm9udFNpemU9MTVdXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5mb250RmFtaWx5PVwibW9ub3NwYWNlXCJdXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5mb250U3R5bGU9XCJcIl0gYm9sZC9pdGFsaWMvbm9uZS9ib3RoXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5mZz1cIiNjY2NcIl1cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmJnPVwiIzAwMFwiXVxyXG4gKiBAcGFyYW0ge2Zsb2F0fSBbb3B0aW9ucy5zcGFjaW5nPTFdXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IFtvcHRpb25zLmJvcmRlcj0wXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubGF5b3V0PVwicmVjdFwiXVxyXG4gKiBAcGFyYW0ge2Jvb2x9IFtvcHRpb25zLmZvcmNlU3F1YXJlUmF0aW89ZmFsc2VdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50aWxlV2lkdGg9MzJdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50aWxlSGVpZ2h0PTMyXVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnMudGlsZU1hcD17fV1cclxuICogQHBhcmFtIHtpbWFnZX0gW29wdGlvbnMudGlsZVNldD1udWxsXVxyXG4gKiBAcGFyYW0ge2ltYWdlfSBbb3B0aW9ucy50aWxlQ29sb3JpemU9ZmFsc2VdXHJcbiAqL1xyXG5ST1QuRGlzcGxheSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuXHR0aGlzLl9jb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHR0aGlzLl9kYXRhID0ge307XHJcblx0dGhpcy5fZGlydHkgPSBmYWxzZTsgLyogZmFsc2UgPSBub3RoaW5nLCB0cnVlID0gYWxsLCBvYmplY3QgPSBkaXJ0eSBjZWxscyAqL1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7fTtcclxuXHR0aGlzLl9iYWNrZW5kID0gbnVsbDtcclxuXHRcclxuXHR2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XHJcblx0XHR3aWR0aDogUk9ULkRFRkFVTFRfV0lEVEgsXHJcblx0XHRoZWlnaHQ6IFJPVC5ERUZBVUxUX0hFSUdIVCxcclxuXHRcdHRyYW5zcG9zZTogZmFsc2UsXHJcblx0XHRsYXlvdXQ6IFwicmVjdFwiLFxyXG5cdFx0Zm9udFNpemU6IDE1LFxyXG5cdFx0c3BhY2luZzogMSxcclxuXHRcdGJvcmRlcjogMCxcclxuXHRcdGZvcmNlU3F1YXJlUmF0aW86IGZhbHNlLFxyXG5cdFx0Zm9udEZhbWlseTogXCJtb25vc3BhY2VcIixcclxuXHRcdGZvbnRTdHlsZTogXCJcIixcclxuXHRcdGZnOiBcIiNjY2NcIixcclxuXHRcdGJnOiBcIiMwMDBcIixcclxuXHRcdHRpbGVXaWR0aDogMzIsXHJcblx0XHR0aWxlSGVpZ2h0OiAzMixcclxuXHRcdHRpbGVNYXA6IHt9LFxyXG5cdFx0dGlsZVNldDogbnVsbCxcclxuXHRcdHRpbGVDb2xvcml6ZTogZmFsc2UsXHJcblx0XHR0ZXJtQ29sb3I6IFwieHRlcm1cIlxyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IGRlZmF1bHRPcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cdHRoaXMuc2V0T3B0aW9ucyhkZWZhdWx0T3B0aW9ucyk7XHJcblx0dGhpcy5ERUJVRyA9IHRoaXMuREVCVUcuYmluZCh0aGlzKTtcclxuXHJcblx0dGhpcy5fdGljayA9IHRoaXMuX3RpY2suYmluZCh0aGlzKTtcclxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fdGljayk7XHJcbn07XHJcblxyXG4vKipcclxuICogRGVidWcgaGVscGVyLCBpZGVhbCBhcyBhIG1hcCBnZW5lcmF0b3IgY2FsbGJhY2suIEFsd2F5cyBib3VuZCB0byB0aGlzLlxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gd2hhdFxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLkRFQlVHID0gZnVuY3Rpb24oeCwgeSwgd2hhdCkge1xyXG5cdHZhciBjb2xvcnMgPSBbdGhpcy5fb3B0aW9ucy5iZywgdGhpcy5fb3B0aW9ucy5mZ107XHJcblx0dGhpcy5kcmF3KHgsIHksIG51bGwsIG51bGwsIGNvbG9yc1t3aGF0ICUgY29sb3JzLmxlbmd0aF0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsZWFyIHRoZSB3aG9sZSBkaXNwbGF5IChjb3ZlciBpdCB3aXRoIGJhY2tncm91bmQgY29sb3IpXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9kYXRhID0ge307XHJcblx0dGhpcy5fZGlydHkgPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULkRpc3BsYXlcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cdGlmIChvcHRpb25zLndpZHRoIHx8IG9wdGlvbnMuaGVpZ2h0IHx8IG9wdGlvbnMuZm9udFNpemUgfHwgb3B0aW9ucy5mb250RmFtaWx5IHx8IG9wdGlvbnMuc3BhY2luZyB8fCBvcHRpb25zLmxheW91dCkge1xyXG5cdFx0aWYgKG9wdGlvbnMubGF5b3V0KSB7IFxyXG5cdFx0XHR0aGlzLl9iYWNrZW5kID0gbmV3IFJPVC5EaXNwbGF5W29wdGlvbnMubGF5b3V0LmNhcGl0YWxpemUoKV0odGhpcy5fY29udGV4dCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGZvbnQgPSAodGhpcy5fb3B0aW9ucy5mb250U3R5bGUgPyB0aGlzLl9vcHRpb25zLmZvbnRTdHlsZSArIFwiIFwiIDogXCJcIikgKyB0aGlzLl9vcHRpb25zLmZvbnRTaXplICsgXCJweCBcIiArIHRoaXMuX29wdGlvbnMuZm9udEZhbWlseTtcclxuXHRcdHRoaXMuX2NvbnRleHQuZm9udCA9IGZvbnQ7XHJcblx0XHR0aGlzLl9iYWNrZW5kLmNvbXB1dGUodGhpcy5fb3B0aW9ucyk7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZvbnQgPSBmb250O1xyXG5cdFx0dGhpcy5fY29udGV4dC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG5cdFx0dGhpcy5fY29udGV4dC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG5cdFx0dGhpcy5fZGlydHkgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGN1cnJlbnRseSBzZXQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBDdXJyZW50IG9wdGlvbnMgb2JqZWN0IFxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmdldE9wdGlvbnMgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fb3B0aW9ucztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBET00gbm9kZSBvZiB0aGlzIGRpc3BsYXlcclxuICogQHJldHVybnMge25vZGV9IERPTSBub2RlXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX2NvbnRleHQuY2FudmFzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdGhlIG1heGltdW0gd2lkdGgvaGVpZ2h0IHRvIGZpdCBpbnRvIGEgc2V0IG9mIGdpdmVuIGNvbnN0cmFpbnRzXHJcbiAqIEBwYXJhbSB7aW50fSBhdmFpbFdpZHRoIE1heGltdW0gYWxsb3dlZCBwaXhlbCB3aWR0aFxyXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxIZWlnaHQgTWF4aW11bSBhbGxvd2VkIHBpeGVsIGhlaWdodFxyXG4gKiBAcmV0dXJucyB7aW50WzJdfSBjZWxsV2lkdGgsY2VsbEhlaWdodFxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHRyZXR1cm4gdGhpcy5fYmFja2VuZC5jb21wdXRlU2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCwgdGhpcy5fb3B0aW9ucyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB0aGUgbWF4aW11bSBmb250IHNpemUgdG8gZml0IGludG8gYSBzZXQgb2YgZ2l2ZW4gY29uc3RyYWludHNcclxuICogQHBhcmFtIHtpbnR9IGF2YWlsV2lkdGggTWF4aW11bSBhbGxvd2VkIHBpeGVsIHdpZHRoXHJcbiAqIEBwYXJhbSB7aW50fSBhdmFpbEhlaWdodCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgaGVpZ2h0XHJcbiAqIEByZXR1cm5zIHtpbnR9IGZvbnRTaXplXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHRyZXR1cm4gdGhpcy5fYmFja2VuZC5jb21wdXRlRm9udFNpemUoYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQsIHRoaXMuX29wdGlvbnMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYSBET00gZXZlbnQgKG1vdXNlIG9yIHRvdWNoKSB0byBtYXAgY29vcmRpbmF0ZXMuIFVzZXMgZmlyc3QgdG91Y2ggZm9yIG11bHRpLXRvdWNoLlxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIGV2ZW50XHJcbiAqIEByZXR1cm5zIHtpbnRbMl19IC0xIGZvciB2YWx1ZXMgb3V0c2lkZSBvZiB0aGUgY2FudmFzXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZXZlbnRUb1Bvc2l0aW9uID0gZnVuY3Rpb24oZSkge1xyXG5cdGlmIChlLnRvdWNoZXMpIHtcclxuXHRcdHZhciB4ID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcblx0XHR2YXIgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgeCA9IGUuY2xpZW50WDtcclxuXHRcdHZhciB5ID0gZS5jbGllbnRZO1xyXG5cdH1cclxuXHJcblx0dmFyIHJlY3QgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHR4IC09IHJlY3QubGVmdDtcclxuXHR5IC09IHJlY3QudG9wO1xyXG5cdFxyXG5cdHggKj0gdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGggLyB0aGlzLl9jb250ZXh0LmNhbnZhcy5jbGllbnRXaWR0aDtcclxuXHR5ICo9IHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCAvIHRoaXMuX2NvbnRleHQuY2FudmFzLmNsaWVudEhlaWdodDtcclxuXHJcblx0aWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPj0gdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGggfHwgeSA+PSB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQpIHsgcmV0dXJuIFstMSwgLTFdOyB9XHJcblxyXG5cdHJldHVybiB0aGlzLl9iYWNrZW5kLmV2ZW50VG9Qb3NpdGlvbih4LCB5KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge3N0cmluZyB8fCBzdHJpbmdbXX0gY2ggT25lIG9yIG1vcmUgY2hhcnMgKHdpbGwgYmUgb3ZlcmxhcHBpbmcgdGhlbXNlbHZlcylcclxuICogQHBhcmFtIHtzdHJpbmd9IFtmZ10gZm9yZWdyb3VuZCBjb2xvclxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW2JnXSBiYWNrZ3JvdW5kIGNvbG9yXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKHgsIHksIGNoLCBmZywgYmcpIHtcclxuXHRpZiAoIWZnKSB7IGZnID0gdGhpcy5fb3B0aW9ucy5mZzsgfVxyXG5cdGlmICghYmcpIHsgYmcgPSB0aGlzLl9vcHRpb25zLmJnOyB9XHJcblx0dGhpcy5fZGF0YVt4K1wiLFwiK3ldID0gW3gsIHksIGNoLCBmZywgYmddO1xyXG5cdFxyXG5cdGlmICh0aGlzLl9kaXJ0eSA9PT0gdHJ1ZSkgeyByZXR1cm47IH0gLyogd2lsbCBhbHJlYWR5IHJlZHJhdyBldmVyeXRoaW5nICovXHJcblx0aWYgKCF0aGlzLl9kaXJ0eSkgeyB0aGlzLl9kaXJ0eSA9IHt9OyB9IC8qIGZpcnN0ISAqL1xyXG5cdHRoaXMuX2RpcnR5W3grXCIsXCIreV0gPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERyYXdzIGEgdGV4dCBhdCBnaXZlbiBwb3NpdGlvbi4gT3B0aW9uYWxseSB3cmFwcyBhdCBhIG1heGltdW0gbGVuZ3RoLiBDdXJyZW50bHkgZG9lcyBub3Qgd29yayB3aXRoIGhleCBsYXlvdXQuXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IE1heSBjb250YWluIGNvbG9yL2JhY2tncm91bmQgZm9ybWF0IHNwZWNpZmllcnMsICVje25hbWV9LyVie25hbWV9LCBib3RoIG9wdGlvbmFsLiAlY3t9LyVie30gcmVzZXRzIHRvIGRlZmF1bHQuXHJcbiAqIEBwYXJhbSB7aW50fSBbbWF4V2lkdGhdIHdyYXAgYXQgd2hhdCB3aWR0aD9cclxuICogQHJldHVybnMge2ludH0gbGluZXMgZHJhd25cclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5kcmF3VGV4dCA9IGZ1bmN0aW9uKHgsIHksIHRleHQsIG1heFdpZHRoKSB7XHJcblx0dmFyIGZnID0gbnVsbDtcclxuXHR2YXIgYmcgPSBudWxsO1xyXG5cdHZhciBjeCA9IHg7XHJcblx0dmFyIGN5ID0geTtcclxuXHR2YXIgbGluZXMgPSAxO1xyXG5cdGlmICghbWF4V2lkdGgpIHsgbWF4V2lkdGggPSB0aGlzLl9vcHRpb25zLndpZHRoLXg7IH1cclxuXHJcblx0dmFyIHRva2VucyA9IFJPVC5UZXh0LnRva2VuaXplKHRleHQsIG1heFdpZHRoKTtcclxuXHJcblx0d2hpbGUgKHRva2Vucy5sZW5ndGgpIHsgLyogaW50ZXJwcmV0IHRva2VuaXplZCBvcGNvZGUgc3RyZWFtICovXHJcblx0XHR2YXIgdG9rZW4gPSB0b2tlbnMuc2hpZnQoKTtcclxuXHRcdHN3aXRjaCAodG9rZW4udHlwZSkge1xyXG5cdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfVEVYVDpcclxuXHRcdFx0XHR2YXIgaXNTcGFjZSA9IGZhbHNlLCBpc1ByZXZTcGFjZSA9IGZhbHNlLCBpc0Z1bGxXaWR0aCA9IGZhbHNlLCBpc1ByZXZGdWxsV2lkdGggPSBmYWxzZTtcclxuXHRcdFx0XHRmb3IgKHZhciBpPTA7aTx0b2tlbi52YWx1ZS5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdFx0XHR2YXIgY2MgPSB0b2tlbi52YWx1ZS5jaGFyQ29kZUF0KGkpO1xyXG5cdFx0XHRcdFx0dmFyIGMgPSB0b2tlbi52YWx1ZS5jaGFyQXQoaSk7XHJcblx0XHRcdFx0XHQvLyBBc3NpZ24gdG8gYHRydWVgIHdoZW4gdGhlIGN1cnJlbnQgY2hhciBpcyBmdWxsLXdpZHRoLlxyXG5cdFx0XHRcdFx0aXNGdWxsV2lkdGggPSAoY2MgPiAweGZmMDAgJiYgY2MgPCAweGZmNjEpIHx8IChjYyA+IDB4ZmZkYyAmJiBjYyA8IDB4ZmZlOCkgfHwgY2MgPiAweGZmZWU7XHJcblx0XHRcdFx0XHQvLyBDdXJyZW50IGNoYXIgaXMgc3BhY2UsIHdoYXRldmVyIGZ1bGwtd2lkdGggb3IgaGFsZi13aWR0aCBib3RoIGFyZSBPSy5cclxuXHRcdFx0XHRcdGlzU3BhY2UgPSAoYy5jaGFyQ29kZUF0KDApID09IDB4MjAgfHwgYy5jaGFyQ29kZUF0KDApID09IDB4MzAwMCk7XHJcblx0XHRcdFx0XHQvLyBUaGUgcHJldmlvdXMgY2hhciBpcyBmdWxsLXdpZHRoIGFuZFxyXG5cdFx0XHRcdFx0Ly8gY3VycmVudCBjaGFyIGlzIG5ldGhlciBoYWxmLXdpZHRoIG5vciBhIHNwYWNlLlxyXG5cdFx0XHRcdFx0aWYgKGlzUHJldkZ1bGxXaWR0aCAmJiAhaXNGdWxsV2lkdGggJiYgIWlzU3BhY2UpIHsgY3grKzsgfSAvLyBhZGQgYW4gZXh0cmEgcG9zaXRpb25cclxuXHRcdFx0XHRcdC8vIFRoZSBjdXJyZW50IGNoYXIgaXMgZnVsbC13aWR0aCBhbmRcclxuXHRcdFx0XHRcdC8vIHRoZSBwcmV2aW91cyBjaGFyIGlzIG5vdCBhIHNwYWNlLlxyXG5cdFx0XHRcdFx0aWYoaXNGdWxsV2lkdGggJiYgIWlzUHJldlNwYWNlKSB7IGN4Kys7IH0gLy8gYWRkIGFuIGV4dHJhIHBvc2l0aW9uXHJcblx0XHRcdFx0XHR0aGlzLmRyYXcoY3grKywgY3ksIGMsIGZnLCBiZyk7XHJcblx0XHRcdFx0XHRpc1ByZXZTcGFjZSA9IGlzU3BhY2U7XHJcblx0XHRcdFx0XHRpc1ByZXZGdWxsV2lkdGggPSBpc0Z1bGxXaWR0aDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX0ZHOlxyXG5cdFx0XHRcdGZnID0gdG9rZW4udmFsdWUgfHwgbnVsbDtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfQkc6XHJcblx0XHRcdFx0YmcgPSB0b2tlbi52YWx1ZSB8fCBudWxsO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9ORVdMSU5FOlxyXG5cdFx0XHRcdGN4ID0geDtcclxuXHRcdFx0XHRjeSsrO1xyXG5cdFx0XHRcdGxpbmVzKys7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGxpbmVzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRpbWVyIHRpY2s6IHVwZGF0ZSBkaXJ0eSBwYXJ0c1xyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLl90aWNrID0gZnVuY3Rpb24oKSB7XHJcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX3RpY2spO1xyXG5cclxuXHRpZiAoIXRoaXMuX2RpcnR5KSB7IHJldHVybjsgfVxyXG5cclxuXHRpZiAodGhpcy5fZGlydHkgPT09IHRydWUpIHsgLyogZHJhdyBhbGwgKi9cclxuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5fb3B0aW9ucy5iZztcclxuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCk7XHJcblxyXG5cdFx0Zm9yICh2YXIgaWQgaW4gdGhpcy5fZGF0YSkgeyAvKiByZWRyYXcgY2FjaGVkIGRhdGEgKi9cclxuXHRcdFx0dGhpcy5fZHJhdyhpZCwgZmFsc2UpO1xyXG5cdFx0fVxyXG5cclxuXHR9IGVsc2UgeyAvKiBkcmF3IG9ubHkgZGlydHkgKi9cclxuXHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl9kaXJ0eSkge1xyXG5cdFx0XHR0aGlzLl9kcmF3KGtleSwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aGlzLl9kaXJ0eSA9IGZhbHNlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgV2hhdCB0byBkcmF3XHJcbiAqIEBwYXJhbSB7Ym9vbH0gY2xlYXJCZWZvcmUgSXMgaXQgbmVjZXNzYXJ5IHRvIGNsZWFuIGJlZm9yZT9cclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5fZHJhdyA9IGZ1bmN0aW9uKGtleSwgY2xlYXJCZWZvcmUpIHtcclxuXHR2YXIgZGF0YSA9IHRoaXMuX2RhdGFba2V5XTtcclxuXHRpZiAoZGF0YVs0XSAhPSB0aGlzLl9vcHRpb25zLmJnKSB7IGNsZWFyQmVmb3JlID0gdHJ1ZTsgfVxyXG5cclxuXHR0aGlzLl9iYWNrZW5kLmRyYXcoZGF0YSwgY2xlYXJCZWZvcmUpO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEFic3RyYWN0IGRpc3BsYXkgYmFja2VuZCBtb2R1bGVcclxuICogQHByaXZhdGVcclxuICovXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQgPSBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0dGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuZXZlbnRUb1Bvc2l0aW9uID0gZnVuY3Rpb24oeCwgeSkge1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFJlY3Rhbmd1bGFyIGJhY2tlbmRcclxuICogQHByaXZhdGVcclxuICovXHJcblJPVC5EaXNwbGF5LlJlY3QgPSBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0Uk9ULkRpc3BsYXkuQmFja2VuZC5jYWxsKHRoaXMsIGNvbnRleHQpO1xyXG5cdFxyXG5cdHRoaXMuX3NwYWNpbmdYID0gMDtcclxuXHR0aGlzLl9zcGFjaW5nWSA9IDA7XHJcblx0dGhpcy5fY2FudmFzQ2FjaGUgPSB7fTtcclxuXHR0aGlzLl9vcHRpb25zID0ge307XHJcbn07XHJcblJPVC5EaXNwbGF5LlJlY3QuZXh0ZW5kKFJPVC5EaXNwbGF5LkJhY2tlbmQpO1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5jYWNoZSA9IGZhbHNlO1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR0aGlzLl9jYW52YXNDYWNoZSA9IHt9O1xyXG5cdHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xyXG5cclxuXHR2YXIgY2hhcldpZHRoID0gTWF0aC5jZWlsKHRoaXMuX2NvbnRleHQubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcclxuXHR0aGlzLl9zcGFjaW5nWCA9IE1hdGguY2VpbChvcHRpb25zLnNwYWNpbmcgKiBjaGFyV2lkdGgpO1xyXG5cdHRoaXMuX3NwYWNpbmdZID0gTWF0aC5jZWlsKG9wdGlvbnMuc3BhY2luZyAqIG9wdGlvbnMuZm9udFNpemUpO1xyXG5cclxuXHRpZiAodGhpcy5fb3B0aW9ucy5mb3JjZVNxdWFyZVJhdGlvKSB7XHJcblx0XHR0aGlzLl9zcGFjaW5nWCA9IHRoaXMuX3NwYWNpbmdZID0gTWF0aC5tYXgodGhpcy5fc3BhY2luZ1gsIHRoaXMuX3NwYWNpbmdZKTtcclxuXHR9XHJcblxyXG5cdHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoID0gb3B0aW9ucy53aWR0aCAqIHRoaXMuX3NwYWNpbmdYO1xyXG5cdHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0ICogdGhpcy5fc3BhY2luZ1k7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxuXHRpZiAodGhpcy5jb25zdHJ1Y3Rvci5jYWNoZSkge1xyXG5cdFx0dGhpcy5fZHJhd1dpdGhDYWNoZShkYXRhLCBjbGVhckJlZm9yZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRoaXMuX2RyYXdOb0NhY2hlKGRhdGEsIGNsZWFyQmVmb3JlKTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5fZHJhd1dpdGhDYWNoZSA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XHJcblx0dmFyIHggPSBkYXRhWzBdO1xyXG5cdHZhciB5ID0gZGF0YVsxXTtcclxuXHR2YXIgY2ggPSBkYXRhWzJdO1xyXG5cdHZhciBmZyA9IGRhdGFbM107XHJcblx0dmFyIGJnID0gZGF0YVs0XTtcclxuXHJcblx0dmFyIGhhc2ggPSBcIlwiK2NoK2ZnK2JnO1xyXG5cdGlmIChoYXNoIGluIHRoaXMuX2NhbnZhc0NhY2hlKSB7XHJcblx0XHR2YXIgY2FudmFzID0gdGhpcy5fY2FudmFzQ2FjaGVbaGFzaF07XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBiID0gdGhpcy5fb3B0aW9ucy5ib3JkZXI7XHJcblx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuXHRcdHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cdFx0Y2FudmFzLndpZHRoID0gdGhpcy5fc3BhY2luZ1g7XHJcblx0XHRjYW52YXMuaGVpZ2h0ID0gdGhpcy5fc3BhY2luZ1k7XHJcblx0XHRjdHguZmlsbFN0eWxlID0gYmc7XHJcblx0XHRjdHguZmlsbFJlY3QoYiwgYiwgY2FudmFzLndpZHRoLWIsIGNhbnZhcy5oZWlnaHQtYik7XHJcblx0XHRcclxuXHRcdGlmIChjaCkge1xyXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gZmc7XHJcblx0XHRcdGN0eC5mb250ID0gdGhpcy5fY29udGV4dC5mb250O1xyXG5cdFx0XHRjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuXHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcblxyXG5cdFx0XHR2YXIgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xyXG5cdFx0XHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdFx0Y3R4LmZpbGxUZXh0KGNoYXJzW2ldLCB0aGlzLl9zcGFjaW5nWC8yLCBNYXRoLmNlaWwodGhpcy5fc3BhY2luZ1kvMikpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLl9jYW52YXNDYWNoZVtoYXNoXSA9IGNhbnZhcztcclxuXHR9XHJcblx0XHJcblx0dGhpcy5fY29udGV4dC5kcmF3SW1hZ2UoY2FudmFzLCB4KnRoaXMuX3NwYWNpbmdYLCB5KnRoaXMuX3NwYWNpbmdZKTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLl9kcmF3Tm9DYWNoZSA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XHJcblx0dmFyIHggPSBkYXRhWzBdO1xyXG5cdHZhciB5ID0gZGF0YVsxXTtcclxuXHR2YXIgY2ggPSBkYXRhWzJdO1xyXG5cdHZhciBmZyA9IGRhdGFbM107XHJcblx0dmFyIGJnID0gZGF0YVs0XTtcclxuXHJcblx0aWYgKGNsZWFyQmVmb3JlKSB7IFxyXG5cdFx0dmFyIGIgPSB0aGlzLl9vcHRpb25zLmJvcmRlcjtcclxuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gYmc7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxSZWN0KHgqdGhpcy5fc3BhY2luZ1ggKyBiLCB5KnRoaXMuX3NwYWNpbmdZICsgYiwgdGhpcy5fc3BhY2luZ1ggLSBiLCB0aGlzLl9zcGFjaW5nWSAtIGIpO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoIWNoKSB7IHJldHVybjsgfVxyXG5cclxuXHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGZnO1xyXG5cclxuXHR2YXIgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xyXG5cdGZvciAodmFyIGk9MDtpPGNoYXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFRleHQoY2hhcnNbaV0sICh4KzAuNSkgKiB0aGlzLl9zcGFjaW5nWCwgTWF0aC5jZWlsKCh5KzAuNSkgKiB0aGlzLl9zcGFjaW5nWSkpO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHR2YXIgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9zcGFjaW5nWCk7XHJcblx0dmFyIGhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9zcGFjaW5nWSk7XHJcblx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0dmFyIGJveFdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fb3B0aW9ucy53aWR0aCk7XHJcblx0dmFyIGJveEhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9vcHRpb25zLmhlaWdodCk7XHJcblxyXG5cdC8qIGNvbXB1dGUgY2hhciByYXRpbyAqL1xyXG5cdHZhciBvbGRGb250ID0gdGhpcy5fY29udGV4dC5mb250O1xyXG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IFwiMTAwcHggXCIgKyB0aGlzLl9vcHRpb25zLmZvbnRGYW1pbHk7XHJcblx0dmFyIHdpZHRoID0gTWF0aC5jZWlsKHRoaXMuX2NvbnRleHQubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcclxuXHR0aGlzLl9jb250ZXh0LmZvbnQgPSBvbGRGb250O1xyXG5cdHZhciByYXRpbyA9IHdpZHRoIC8gMTAwO1xyXG5cdFx0XHJcblx0dmFyIHdpZHRoRnJhY3Rpb24gPSByYXRpbyAqIGJveEhlaWdodCAvIGJveFdpZHRoO1xyXG5cdGlmICh3aWR0aEZyYWN0aW9uID4gMSkgeyAvKiB0b28gd2lkZSB3aXRoIGN1cnJlbnQgYXNwZWN0IHJhdGlvICovXHJcblx0XHRib3hIZWlnaHQgPSBNYXRoLmZsb29yKGJveEhlaWdodCAvIHdpZHRoRnJhY3Rpb24pO1xyXG5cdH1cclxuXHRyZXR1cm4gTWF0aC5mbG9vcihib3hIZWlnaHQgLyB0aGlzLl9vcHRpb25zLnNwYWNpbmcpO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuZXZlbnRUb1Bvc2l0aW9uID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdHJldHVybiBbTWF0aC5mbG9vcih4L3RoaXMuX3NwYWNpbmdYKSwgTWF0aC5mbG9vcih5L3RoaXMuX3NwYWNpbmdZKV07XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgSGV4YWdvbmFsIGJhY2tlbmRcclxuICogQHByaXZhdGVcclxuICovXHJcblJPVC5EaXNwbGF5LkhleCA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRST1QuRGlzcGxheS5CYWNrZW5kLmNhbGwodGhpcywgY29udGV4dCk7XHJcblxyXG5cdHRoaXMuX3NwYWNpbmdYID0gMDtcclxuXHR0aGlzLl9zcGFjaW5nWSA9IDA7XHJcblx0dGhpcy5faGV4U2l6ZSA9IDA7XHJcblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xyXG59O1xyXG5ST1QuRGlzcGxheS5IZXguZXh0ZW5kKFJPVC5EaXNwbGF5LkJhY2tlbmQpO1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xyXG5cclxuXHQvKiBGSVhNRSBjaGFyIHNpemUgY29tcHV0YXRpb24gZG9lcyBub3QgcmVzcGVjdCB0cmFuc3Bvc2VkIGhleGVzICovXHJcblx0dmFyIGNoYXJXaWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jb250ZXh0Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XHJcblx0dGhpcy5faGV4U2l6ZSA9IE1hdGguZmxvb3Iob3B0aW9ucy5zcGFjaW5nICogKG9wdGlvbnMuZm9udFNpemUgKyBjaGFyV2lkdGgvTWF0aC5zcXJ0KDMpKSAvIDIpO1xyXG5cdHRoaXMuX3NwYWNpbmdYID0gdGhpcy5faGV4U2l6ZSAqIE1hdGguc3FydCgzKSAvIDI7XHJcblx0dGhpcy5fc3BhY2luZ1kgPSB0aGlzLl9oZXhTaXplICogMS41O1xyXG5cclxuXHRpZiAob3B0aW9ucy50cmFuc3Bvc2UpIHtcclxuXHRcdHZhciB4cHJvcCA9IFwiaGVpZ2h0XCI7XHJcblx0XHR2YXIgeXByb3AgPSBcIndpZHRoXCI7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciB4cHJvcCA9IFwid2lkdGhcIjtcclxuXHRcdHZhciB5cHJvcCA9IFwiaGVpZ2h0XCI7XHJcblx0fVxyXG5cdHRoaXMuX2NvbnRleHQuY2FudmFzW3hwcm9wXSA9IE1hdGguY2VpbCggKG9wdGlvbnMud2lkdGggKyAxKSAqIHRoaXMuX3NwYWNpbmdYICk7XHJcblx0dGhpcy5fY29udGV4dC5jYW52YXNbeXByb3BdID0gTWF0aC5jZWlsKCAob3B0aW9ucy5oZWlnaHQgLSAxKSAqIHRoaXMuX3NwYWNpbmdZICsgMip0aGlzLl9oZXhTaXplICk7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG5cdHZhciB4ID0gZGF0YVswXTtcclxuXHR2YXIgeSA9IGRhdGFbMV07XHJcblx0dmFyIGNoID0gZGF0YVsyXTtcclxuXHR2YXIgZmcgPSBkYXRhWzNdO1xyXG5cdHZhciBiZyA9IGRhdGFbNF07XHJcblxyXG5cdHZhciBweCA9IFtcclxuXHRcdCh4KzEpICogdGhpcy5fc3BhY2luZ1gsXHJcblx0XHR5ICogdGhpcy5fc3BhY2luZ1kgKyB0aGlzLl9oZXhTaXplXHJcblx0XTtcclxuXHRpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHsgcHgucmV2ZXJzZSgpOyB9XHJcblxyXG5cdGlmIChjbGVhckJlZm9yZSkge1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBiZztcclxuXHRcdHRoaXMuX2ZpbGwocHhbMF0sIHB4WzFdKTtcclxuXHR9XHJcblxyXG5cdGlmICghY2gpIHsgcmV0dXJuOyB9XHJcblxyXG5cdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gZmc7XHJcblxyXG5cdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XHJcblx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsVGV4dChjaGFyc1tpXSwgcHhbMF0sIE1hdGguY2VpbChweFsxXSkpO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkge1xyXG5cdFx0YXZhaWxXaWR0aCArPSBhdmFpbEhlaWdodDtcclxuXHRcdGF2YWlsSGVpZ2h0ID0gYXZhaWxXaWR0aCAtIGF2YWlsSGVpZ2h0O1xyXG5cdFx0YXZhaWxXaWR0aCAtPSBhdmFpbEhlaWdodDtcclxuXHR9XHJcblxyXG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX3NwYWNpbmdYKSAtIDE7XHJcblx0dmFyIGhlaWdodCA9IE1hdGguZmxvb3IoKGF2YWlsSGVpZ2h0IC0gMip0aGlzLl9oZXhTaXplKSAvIHRoaXMuX3NwYWNpbmdZICsgMSk7XHJcblx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHRpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcclxuXHRcdGF2YWlsV2lkdGggKz0gYXZhaWxIZWlnaHQ7XHJcblx0XHRhdmFpbEhlaWdodCA9IGF2YWlsV2lkdGggLSBhdmFpbEhlaWdodDtcclxuXHRcdGF2YWlsV2lkdGggLT0gYXZhaWxIZWlnaHQ7XHJcblx0fVxyXG5cclxuXHR2YXIgaGV4U2l6ZVdpZHRoID0gMiphdmFpbFdpZHRoIC8gKCh0aGlzLl9vcHRpb25zLndpZHRoKzEpICogTWF0aC5zcXJ0KDMpKSAtIDE7XHJcblx0dmFyIGhleFNpemVIZWlnaHQgPSBhdmFpbEhlaWdodCAvICgyICsgMS41Kih0aGlzLl9vcHRpb25zLmhlaWdodC0xKSk7XHJcblx0dmFyIGhleFNpemUgPSBNYXRoLm1pbihoZXhTaXplV2lkdGgsIGhleFNpemVIZWlnaHQpO1xyXG5cclxuXHQvKiBjb21wdXRlIGNoYXIgcmF0aW8gKi9cclxuXHR2YXIgb2xkRm9udCA9IHRoaXMuX2NvbnRleHQuZm9udDtcclxuXHR0aGlzLl9jb250ZXh0LmZvbnQgPSBcIjEwMHB4IFwiICsgdGhpcy5fb3B0aW9ucy5mb250RmFtaWx5O1xyXG5cdHZhciB3aWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jb250ZXh0Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XHJcblx0dGhpcy5fY29udGV4dC5mb250ID0gb2xkRm9udDtcclxuXHR2YXIgcmF0aW8gPSB3aWR0aCAvIDEwMDtcclxuXHJcblx0aGV4U2l6ZSA9IE1hdGguZmxvb3IoaGV4U2l6ZSkrMTsgLyogY2xvc2VzdCBsYXJnZXIgaGV4U2l6ZSAqL1xyXG5cclxuXHQvKiBGSVhNRSBjaGFyIHNpemUgY29tcHV0YXRpb24gZG9lcyBub3QgcmVzcGVjdCB0cmFuc3Bvc2VkIGhleGVzICovXHJcblx0dmFyIGZvbnRTaXplID0gMipoZXhTaXplIC8gKHRoaXMuX29wdGlvbnMuc3BhY2luZyAqICgxICsgcmF0aW8gLyBNYXRoLnNxcnQoMykpKTtcclxuXHJcblx0LyogY2xvc2VzdCBzbWFsbGVyIGZvbnRTaXplICovXHJcblx0cmV0dXJuIE1hdGguY2VpbChmb250U2l6ZSktMTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuZXZlbnRUb1Bvc2l0aW9uID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkge1xyXG5cdFx0eCArPSB5O1xyXG5cdFx0eSA9IHgteTtcclxuXHRcdHggLT0geTtcclxuXHRcdHZhciBub2RlU2l6ZSA9IHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgbm9kZVNpemUgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQ7XHJcblx0fVxyXG5cdHZhciBzaXplID0gbm9kZVNpemUgLyB0aGlzLl9vcHRpb25zLmhlaWdodDtcclxuXHR5ID0gTWF0aC5mbG9vcih5L3NpemUpO1xyXG5cclxuXHRpZiAoeS5tb2QoMikpIHsgLyogb2RkIHJvdyAqL1xyXG5cdFx0eCAtPSB0aGlzLl9zcGFjaW5nWDtcclxuXHRcdHggPSAxICsgMipNYXRoLmZsb29yKHgvKDIqdGhpcy5fc3BhY2luZ1gpKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0eCA9IDIqTWF0aC5mbG9vcih4LygyKnRoaXMuX3NwYWNpbmdYKSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gW3gsIHldO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFyZ3VtZW50cyBhcmUgcGl4ZWwgdmFsdWVzLiBJZiBcInRyYW5zcG9zZWRcIiBtb2RlIGlzIGVuYWJsZWQsIHRoZW4gdGhlc2UgdHdvIGFyZSBhbHJlYWR5IHN3YXBwZWQuXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLl9maWxsID0gZnVuY3Rpb24oY3gsIGN5KSB7XHJcblx0dmFyIGEgPSB0aGlzLl9oZXhTaXplO1xyXG5cdHZhciBiID0gdGhpcy5fb3B0aW9ucy5ib3JkZXI7XHJcblxyXG5cdHRoaXMuX2NvbnRleHQuYmVnaW5QYXRoKCk7XHJcblxyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkge1xyXG5cdFx0dGhpcy5fY29udGV4dC5tb3ZlVG8oY3gtYStiLFx0Y3kpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gtYS8yK2IsXHRjeSt0aGlzLl9zcGFjaW5nWC1iKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K2EvMi1iLFx0Y3krdGhpcy5fc3BhY2luZ1gtYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCthLWIsXHRjeSk7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCthLzItYixcdGN5LXRoaXMuX3NwYWNpbmdYK2IpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gtYS8yK2IsXHRjeS10aGlzLl9zcGFjaW5nWCtiKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LWErYixcdGN5KTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhpcy5fY29udGV4dC5tb3ZlVG8oY3gsXHRcdFx0XHRcdGN5LWErYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCt0aGlzLl9zcGFjaW5nWC1iLFx0Y3ktYS8yK2IpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grdGhpcy5fc3BhY2luZ1gtYixcdGN5K2EvMi1iKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LFx0XHRcdFx0XHRjeSthLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gtdGhpcy5fc3BhY2luZ1grYixcdGN5K2EvMi1iKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LXRoaXMuX3NwYWNpbmdYK2IsXHRjeS1hLzIrYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCxcdFx0XHRcdFx0Y3ktYStiKTtcclxuXHR9XHJcblx0dGhpcy5fY29udGV4dC5maWxsKCk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgVGlsZSBiYWNrZW5kXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5UaWxlID0gZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFJPVC5EaXNwbGF5LlJlY3QuY2FsbCh0aGlzLCBjb250ZXh0KTtcclxuXHRcclxuXHR0aGlzLl9vcHRpb25zID0ge307XHJcblx0dGhpcy5fY29sb3JDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG59O1xyXG5ST1QuRGlzcGxheS5UaWxlLmV4dGVuZChST1QuRGlzcGxheS5SZWN0KTtcclxuXHJcblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcblx0dGhpcy5fY29udGV4dC5jYW52YXMud2lkdGggPSBvcHRpb25zLndpZHRoICogb3B0aW9ucy50aWxlV2lkdGg7XHJcblx0dGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgKiBvcHRpb25zLnRpbGVIZWlnaHQ7XHJcblx0dGhpcy5fY29sb3JDYW52YXMud2lkdGggPSBvcHRpb25zLnRpbGVXaWR0aDtcclxuXHR0aGlzLl9jb2xvckNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLnRpbGVIZWlnaHQ7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxuXHR2YXIgeCA9IGRhdGFbMF07XHJcblx0dmFyIHkgPSBkYXRhWzFdO1xyXG5cdHZhciBjaCA9IGRhdGFbMl07XHJcblx0dmFyIGZnID0gZGF0YVszXTtcclxuXHR2YXIgYmcgPSBkYXRhWzRdO1xyXG5cclxuXHR2YXIgdGlsZVdpZHRoID0gdGhpcy5fb3B0aW9ucy50aWxlV2lkdGg7XHJcblx0dmFyIHRpbGVIZWlnaHQgPSB0aGlzLl9vcHRpb25zLnRpbGVIZWlnaHQ7XHJcblxyXG5cdGlmIChjbGVhckJlZm9yZSkge1xyXG5cdFx0aWYgKHRoaXMuX29wdGlvbnMudGlsZUNvbG9yaXplKSB7XHJcblx0XHRcdHRoaXMuX2NvbnRleHQuY2xlYXJSZWN0KHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xyXG5cdFx0XHR0aGlzLl9jb250ZXh0LmZpbGxSZWN0KHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpZiAoIWNoKSB7IHJldHVybjsgfVxyXG5cclxuXHR2YXIgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xyXG5cdGZvciAodmFyIGk9MDtpPGNoYXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciB0aWxlID0gdGhpcy5fb3B0aW9ucy50aWxlTWFwW2NoYXJzW2ldXTtcclxuXHRcdGlmICghdGlsZSkgeyB0aHJvdyBuZXcgRXJyb3IoXCJDaGFyICdcIiArIGNoYXJzW2ldICsgXCInIG5vdCBmb3VuZCBpbiB0aWxlTWFwXCIpOyB9XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLl9vcHRpb25zLnRpbGVDb2xvcml6ZSkgeyAvKiBhcHBseSBjb2xvcml6YXRpb24gKi9cclxuXHRcdFx0dmFyIGNhbnZhcyA9IHRoaXMuX2NvbG9yQ2FudmFzO1xyXG5cdFx0XHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblx0XHRcdGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XHJcblxyXG5cdFx0XHRjb250ZXh0LmRyYXdJbWFnZShcclxuXHRcdFx0XHR0aGlzLl9vcHRpb25zLnRpbGVTZXQsXHJcblx0XHRcdFx0dGlsZVswXSwgdGlsZVsxXSwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LFxyXG5cdFx0XHRcdDAsIDAsIHRpbGVXaWR0aCwgdGlsZUhlaWdodFxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0aWYgKGZnICE9IFwidHJhbnNwYXJlbnRcIikge1xyXG5cdFx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gZmc7XHJcblx0XHRcdFx0Y29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcInNvdXJjZS1hdG9wXCI7XHJcblx0XHRcdFx0Y29udGV4dC5maWxsUmVjdCgwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoYmcgIT0gXCJ0cmFuc3BhcmVudFwiKSB7XHJcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBiZztcclxuXHRcdFx0XHRjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGVzdGluYXRpb24tb3ZlclwiO1xyXG5cdFx0XHRcdGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5fY29udGV4dC5kcmF3SW1hZ2UoY2FudmFzLCB4KnRpbGVXaWR0aCwgeSp0aWxlSGVpZ2h0LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xyXG5cclxuXHRcdH0gZWxzZSB7IC8qIG5vIGNvbG9yaXppbmcsIGVhc3kgKi9cclxuXHRcdFx0dGhpcy5fY29udGV4dC5kcmF3SW1hZ2UoXHJcblx0XHRcdFx0dGhpcy5fb3B0aW9ucy50aWxlU2V0LFxyXG5cdFx0XHRcdHRpbGVbMF0sIHRpbGVbMV0sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCxcclxuXHRcdFx0XHR4KnRpbGVXaWR0aCwgeSp0aWxlSGVpZ2h0LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHRcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0dmFyIHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fb3B0aW9ucy50aWxlV2lkdGgpO1xyXG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0KTtcclxuXHRyZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHR2YXIgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLndpZHRoKTtcclxuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0KTtcclxuXHRyZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuZXZlbnRUb1Bvc2l0aW9uID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdHJldHVybiBbTWF0aC5mbG9vcih4L3RoaXMuX29wdGlvbnMudGlsZVdpZHRoKSwgTWF0aC5mbG9vcih5L3RoaXMuX29wdGlvbnMudGlsZUhlaWdodCldO1xyXG59O1xyXG4vKipcclxuICogQG5hbWVzcGFjZVxyXG4gKiBUaGlzIGNvZGUgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgQWxlYSBhbGdvcml0aG07IChDKSAyMDEwIEpvaGFubmVzIEJhYWfDuGUuXHJcbiAqIEFsZWEgaXMgbGljZW5zZWQgYWNjb3JkaW5nIHRvIHRoZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlLlxyXG4gKi9cclxuUk9ULlJORyA9IHtcclxuXHQvKipcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBcclxuXHQgKi9cclxuXHRnZXRTZWVkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9zZWVkO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZWVkIFNlZWQgdGhlIG51bWJlciBnZW5lcmF0b3JcclxuXHQgKi9cclxuXHRzZXRTZWVkOiBmdW5jdGlvbihzZWVkKSB7XHJcblx0XHRzZWVkID0gKHNlZWQgPCAxID8gMS9zZWVkIDogc2VlZCk7XHJcblxyXG5cdFx0dGhpcy5fc2VlZCA9IHNlZWQ7XHJcblx0XHR0aGlzLl9zMCA9IChzZWVkID4+PiAwKSAqIHRoaXMuX2ZyYWM7XHJcblxyXG5cdFx0c2VlZCA9IChzZWVkKjY5MDY5ICsgMSkgPj4+IDA7XHJcblx0XHR0aGlzLl9zMSA9IHNlZWQgKiB0aGlzLl9mcmFjO1xyXG5cclxuXHRcdHNlZWQgPSAoc2VlZCo2OTA2OSArIDEpID4+PiAwO1xyXG5cdFx0dGhpcy5fczIgPSBzZWVkICogdGhpcy5fZnJhYztcclxuXHJcblx0XHR0aGlzLl9jID0gMTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm5zIHtmbG9hdH0gUHNldWRvcmFuZG9tIHZhbHVlIFswLDEpLCB1bmlmb3JtbHkgZGlzdHJpYnV0ZWRcclxuXHQgKi9cclxuXHRnZXRVbmlmb3JtOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciB0ID0gMjA5MTYzOSAqIHRoaXMuX3MwICsgdGhpcy5fYyAqIHRoaXMuX2ZyYWM7XHJcblx0XHR0aGlzLl9zMCA9IHRoaXMuX3MxO1xyXG5cdFx0dGhpcy5fczEgPSB0aGlzLl9zMjtcclxuXHRcdHRoaXMuX2MgPSB0IHwgMDtcclxuXHRcdHRoaXMuX3MyID0gdCAtIHRoaXMuX2M7XHJcblx0XHRyZXR1cm4gdGhpcy5fczI7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQHBhcmFtIHtpbnR9IGxvd2VyQm91bmQgVGhlIGxvd2VyIGVuZCBvZiB0aGUgcmFuZ2UgdG8gcmV0dXJuIGEgdmFsdWUgZnJvbSwgaW5jbHVzaXZlXHJcblx0ICogQHBhcmFtIHtpbnR9IHVwcGVyQm91bmQgVGhlIHVwcGVyIGVuZCBvZiB0aGUgcmFuZ2UgdG8gcmV0dXJuIGEgdmFsdWUgZnJvbSwgaW5jbHVzaXZlXHJcblx0ICogQHJldHVybnMge2ludH0gUHNldWRvcmFuZG9tIHZhbHVlIFtsb3dlckJvdW5kLCB1cHBlckJvdW5kXSwgdXNpbmcgUk9ULlJORy5nZXRVbmlmb3JtKCkgdG8gZGlzdHJpYnV0ZSB0aGUgdmFsdWVcclxuXHQgKi9cclxuXHRnZXRVbmlmb3JtSW50OiBmdW5jdGlvbihsb3dlckJvdW5kLCB1cHBlckJvdW5kKSB7XHJcblx0XHR2YXIgbWF4ID0gTWF0aC5tYXgobG93ZXJCb3VuZCwgdXBwZXJCb3VuZCk7XHJcblx0XHR2YXIgbWluID0gTWF0aC5taW4obG93ZXJCb3VuZCwgdXBwZXJCb3VuZCk7XHJcblx0XHRyZXR1cm4gTWF0aC5mbG9vcih0aGlzLmdldFVuaWZvcm0oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQHBhcmFtIHtmbG9hdH0gW21lYW49MF0gTWVhbiB2YWx1ZVxyXG5cdCAqIEBwYXJhbSB7ZmxvYXR9IFtzdGRkZXY9MV0gU3RhbmRhcmQgZGV2aWF0aW9uLiB+OTUlIG9mIHRoZSBhYnNvbHV0ZSB2YWx1ZXMgd2lsbCBiZSBsb3dlciB0aGFuIDIqc3RkZGV2LlxyXG5cdCAqIEByZXR1cm5zIHtmbG9hdH0gQSBub3JtYWxseSBkaXN0cmlidXRlZCBwc2V1ZG9yYW5kb20gdmFsdWVcclxuXHQgKi9cclxuXHRnZXROb3JtYWw6IGZ1bmN0aW9uKG1lYW4sIHN0ZGRldikge1xyXG5cdFx0ZG8ge1xyXG5cdFx0XHR2YXIgdSA9IDIqdGhpcy5nZXRVbmlmb3JtKCktMTtcclxuXHRcdFx0dmFyIHYgPSAyKnRoaXMuZ2V0VW5pZm9ybSgpLTE7XHJcblx0XHRcdHZhciByID0gdSp1ICsgdip2O1xyXG5cdFx0fSB3aGlsZSAociA+IDEgfHwgciA9PSAwKTtcclxuXHJcblx0XHR2YXIgZ2F1c3MgPSB1ICogTWF0aC5zcXJ0KC0yKk1hdGgubG9nKHIpL3IpO1xyXG5cdFx0cmV0dXJuIChtZWFuIHx8IDApICsgZ2F1c3MqKHN0ZGRldiB8fCAxKTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBAcmV0dXJucyB7aW50fSBQc2V1ZG9yYW5kb20gdmFsdWUgWzEsMTAwXSBpbmNsdXNpdmUsIHVuaWZvcm1seSBkaXN0cmlidXRlZFxyXG5cdCAqL1xyXG5cdGdldFBlcmNlbnRhZ2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIDEgKyBNYXRoLmZsb29yKHRoaXMuZ2V0VW5pZm9ybSgpKjEwMCk7XHJcblx0fSxcclxuXHRcclxuXHQvKipcclxuXHQgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBrZXk9d2hhdGV2ZXIsIHZhbHVlPXdlaWdodCAocmVsYXRpdmUgcHJvYmFiaWxpdHkpXHJcblx0ICogQHJldHVybnMge3N0cmluZ30gd2hhdGV2ZXJcclxuXHQgKi9cclxuXHRnZXRXZWlnaHRlZFZhbHVlOiBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHR2YXIgdG90YWwgPSAwO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpZCBpbiBkYXRhKSB7XHJcblx0XHRcdHRvdGFsICs9IGRhdGFbaWRdO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHJhbmRvbSA9IHRoaXMuZ2V0VW5pZm9ybSgpKnRvdGFsO1xyXG5cdFx0XHJcblx0XHR2YXIgcGFydCA9IDA7XHJcblx0XHRmb3IgKHZhciBpZCBpbiBkYXRhKSB7XHJcblx0XHRcdHBhcnQgKz0gZGF0YVtpZF07XHJcblx0XHRcdGlmIChyYW5kb20gPCBwYXJ0KSB7IHJldHVybiBpZDsgfVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElmIGJ5IHNvbWUgZmxvYXRpbmctcG9pbnQgYW5ub3lhbmNlIHdlIGhhdmVcclxuXHRcdC8vIHJhbmRvbSA+PSB0b3RhbCwganVzdCByZXR1cm4gdGhlIGxhc3QgaWQuXHJcblx0XHRyZXR1cm4gaWQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogR2V0IFJORyBzdGF0ZS4gVXNlZnVsIGZvciBzdG9yaW5nIHRoZSBzdGF0ZSBhbmQgcmUtc2V0dGluZyBpdCB2aWEgc2V0U3RhdGUuXHJcblx0ICogQHJldHVybnMgez99IEludGVybmFsIHN0YXRlXHJcblx0ICovXHJcblx0Z2V0U3RhdGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIFt0aGlzLl9zMCwgdGhpcy5fczEsIHRoaXMuX3MyLCB0aGlzLl9jXTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBTZXQgYSBwcmV2aW91c2x5IHJldHJpZXZlZCBzdGF0ZS5cclxuXHQgKiBAcGFyYW0gez99IHN0YXRlXHJcblx0ICovXHJcblx0c2V0U3RhdGU6IGZ1bmN0aW9uKHN0YXRlKSB7XHJcblx0XHR0aGlzLl9zMCA9IHN0YXRlWzBdO1xyXG5cdFx0dGhpcy5fczEgPSBzdGF0ZVsxXTtcclxuXHRcdHRoaXMuX3MyID0gc3RhdGVbMl07XHJcblx0XHR0aGlzLl9jICA9IHN0YXRlWzNdO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyBhIGNsb25lZCBSTkdcclxuXHQgKi9cclxuXHRjbG9uZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY2xvbmUgPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xyXG5cdFx0Y2xvbmUuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZSgpKTtcclxuXHRcdHJldHVybiBjbG9uZTtcclxuXHR9LFxyXG5cclxuXHRfczA6IDAsXHJcblx0X3MxOiAwLFxyXG5cdF9zMjogMCxcclxuXHRfYzogMCxcclxuXHRfZnJhYzogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMCAvKiAyXi0zMiAqL1xyXG59O1xyXG5cclxuUk9ULlJORy5zZXRTZWVkKERhdGUubm93KCkpO1xyXG4vKipcclxuICogQGNsYXNzIChNYXJrb3YgcHJvY2VzcyktYmFzZWQgc3RyaW5nIGdlbmVyYXRvci4gXHJcbiAqIENvcGllZCBmcm9tIGEgPGEgaHJlZj1cImh0dHA6Ly93d3cucm9ndWViYXNpbi5yb2d1ZWxpa2VkZXZlbG9wbWVudC5vcmcvaW5kZXgucGhwP3RpdGxlPU5hbWVzX2Zyb21fYV9oaWdoX29yZGVyX01hcmtvdl9Qcm9jZXNzX2FuZF9hX3NpbXBsaWZpZWRfS2F0el9iYWNrLW9mZl9zY2hlbWVcIj5Sb2d1ZUJhc2luIGFydGljbGU8L2E+LiBcclxuICogT2ZmZXJzIGNvbmZpZ3VyYWJsZSBvcmRlciBhbmQgcHJpb3IuXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtib29sfSBbb3B0aW9ucy53b3Jkcz1mYWxzZV0gVXNlIHdvcmQgbW9kZT9cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLm9yZGVyPTNdXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IFtvcHRpb25zLnByaW9yPTAuMDAxXVxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0d29yZHM6IGZhbHNlLFxyXG5cdFx0b3JkZXI6IDMsXHJcblx0XHRwcmlvcjogMC4wMDFcclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cclxuXHR0aGlzLl9ib3VuZGFyeSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMCk7XHJcblx0dGhpcy5fc3VmZml4ID0gdGhpcy5fYm91bmRhcnk7XHJcblx0dGhpcy5fcHJlZml4ID0gW107XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fb3B0aW9ucy5vcmRlcjtpKyspIHsgdGhpcy5fcHJlZml4LnB1c2godGhpcy5fYm91bmRhcnkpOyB9XHJcblxyXG5cdHRoaXMuX3ByaW9yVmFsdWVzID0ge307XHJcblx0dGhpcy5fcHJpb3JWYWx1ZXNbdGhpcy5fYm91bmRhcnldID0gdGhpcy5fb3B0aW9ucy5wcmlvcjtcclxuXHJcblx0dGhpcy5fZGF0YSA9IHt9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhbGwgbGVhcm5pbmcgZGF0YVxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9kYXRhID0ge307XHJcblx0dGhpcy5fcHJpb3JWYWx1ZXMgPSB7fTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBHZW5lcmF0ZWQgc3RyaW5nXHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5nZW5lcmF0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciByZXN1bHQgPSBbdGhpcy5fc2FtcGxlKHRoaXMuX3ByZWZpeCldO1xyXG5cdHdoaWxlIChyZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXSAhPSB0aGlzLl9ib3VuZGFyeSkge1xyXG5cdFx0cmVzdWx0LnB1c2godGhpcy5fc2FtcGxlKHJlc3VsdCkpO1xyXG5cdH1cclxuXHRyZXR1cm4gdGhpcy5fam9pbihyZXN1bHQuc2xpY2UoMCwgLTEpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBPYnNlcnZlIChsZWFybikgYSBzdHJpbmcgZnJvbSBhIHRyYWluaW5nIHNldFxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUub2JzZXJ2ZSA9IGZ1bmN0aW9uKHN0cmluZykge1xyXG5cdHZhciB0b2tlbnMgPSB0aGlzLl9zcGxpdChzdHJpbmcpO1xyXG5cclxuXHRmb3IgKHZhciBpPTA7IGk8dG9rZW5zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR0aGlzLl9wcmlvclZhbHVlc1t0b2tlbnNbaV1dID0gdGhpcy5fb3B0aW9ucy5wcmlvcjtcclxuXHR9XHJcblxyXG5cdHRva2VucyA9IHRoaXMuX3ByZWZpeC5jb25jYXQodG9rZW5zKS5jb25jYXQodGhpcy5fc3VmZml4KTsgLyogYWRkIGJvdW5kYXJ5IHN5bWJvbHMgKi9cclxuXHJcblx0Zm9yICh2YXIgaT10aGlzLl9vcHRpb25zLm9yZGVyOyBpPHRva2Vucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGNvbnRleHQgPSB0b2tlbnMuc2xpY2UoaS10aGlzLl9vcHRpb25zLm9yZGVyLCBpKTtcclxuXHRcdHZhciBldmVudCA9IHRva2Vuc1tpXTtcclxuXHRcdGZvciAodmFyIGo9MDsgajxjb250ZXh0Lmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdHZhciBzdWJjb250ZXh0ID0gY29udGV4dC5zbGljZShqKTtcclxuXHRcdFx0dGhpcy5fb2JzZXJ2ZUV2ZW50KHN1YmNvbnRleHQsIGV2ZW50KTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5nZXRTdGF0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBwYXJ0cyA9IFtdO1xyXG5cclxuXHR2YXIgcHJpb3JDb3VudCA9IDA7XHJcblx0Zm9yICh2YXIgcCBpbiB0aGlzLl9wcmlvclZhbHVlcykgeyBwcmlvckNvdW50Kys7IH1cclxuXHRwcmlvckNvdW50LS07IC8qIGJvdW5kYXJ5ICovXHJcblx0cGFydHMucHVzaChcImRpc3RpbmN0IHNhbXBsZXM6IFwiICsgcHJpb3JDb3VudCk7XHJcblxyXG5cdHZhciBkYXRhQ291bnQgPSAwO1xyXG5cdHZhciBldmVudENvdW50ID0gMDtcclxuXHRmb3IgKHZhciBwIGluIHRoaXMuX2RhdGEpIHsgXHJcblx0XHRkYXRhQ291bnQrKzsgXHJcblx0XHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fZGF0YVtwXSkge1xyXG5cdFx0XHRldmVudENvdW50Kys7XHJcblx0XHR9XHJcblx0fVxyXG5cdHBhcnRzLnB1c2goXCJkaWN0aW9uYXJ5IHNpemUgKGNvbnRleHRzKTogXCIgKyBkYXRhQ291bnQpO1xyXG5cdHBhcnRzLnB1c2goXCJkaWN0aW9uYXJ5IHNpemUgKGV2ZW50cyk6IFwiICsgZXZlbnRDb3VudCk7XHJcblxyXG5cdHJldHVybiBwYXJ0cy5qb2luKFwiLCBcIik7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmd9XHJcbiAqIEByZXR1cm5zIHtzdHJpbmdbXX1cclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9zcGxpdCA9IGZ1bmN0aW9uKHN0cikge1xyXG5cdHJldHVybiBzdHIuc3BsaXQodGhpcy5fb3B0aW9ucy53b3JkcyA/IC9cXHMrLyA6IFwiXCIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119XHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuX2pvaW4gPSBmdW5jdGlvbihhcnIpIHtcclxuXHRyZXR1cm4gYXJyLmpvaW4odGhpcy5fb3B0aW9ucy53b3JkcyA/IFwiIFwiIDogXCJcIik7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmdbXX0gY29udGV4dFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9vYnNlcnZlRXZlbnQgPSBmdW5jdGlvbihjb250ZXh0LCBldmVudCkge1xyXG5cdHZhciBrZXkgPSB0aGlzLl9qb2luKGNvbnRleHQpO1xyXG5cdGlmICghKGtleSBpbiB0aGlzLl9kYXRhKSkgeyB0aGlzLl9kYXRhW2tleV0gPSB7fTsgfVxyXG5cdHZhciBkYXRhID0gdGhpcy5fZGF0YVtrZXldO1xyXG5cclxuXHRpZiAoIShldmVudCBpbiBkYXRhKSkgeyBkYXRhW2V2ZW50XSA9IDA7IH1cclxuXHRkYXRhW2V2ZW50XSsrO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119XHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fc2FtcGxlID0gZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdGNvbnRleHQgPSB0aGlzLl9iYWNrb2ZmKGNvbnRleHQpO1xyXG5cdHZhciBrZXkgPSB0aGlzLl9qb2luKGNvbnRleHQpO1xyXG5cdHZhciBkYXRhID0gdGhpcy5fZGF0YVtrZXldO1xyXG5cclxuXHR2YXIgYXZhaWxhYmxlID0ge307XHJcblxyXG5cdGlmICh0aGlzLl9vcHRpb25zLnByaW9yKSB7XHJcblx0XHRmb3IgKHZhciBldmVudCBpbiB0aGlzLl9wcmlvclZhbHVlcykgeyBhdmFpbGFibGVbZXZlbnRdID0gdGhpcy5fcHJpb3JWYWx1ZXNbZXZlbnRdOyB9XHJcblx0XHRmb3IgKHZhciBldmVudCBpbiBkYXRhKSB7IGF2YWlsYWJsZVtldmVudF0gKz0gZGF0YVtldmVudF07IH1cclxuXHR9IGVsc2UgeyBcclxuXHRcdGF2YWlsYWJsZSA9IGRhdGE7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gUk9ULlJORy5nZXRXZWlnaHRlZFZhbHVlKGF2YWlsYWJsZSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmdbXX1cclxuICogQHJldHVybnMge3N0cmluZ1tdfVxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuX2JhY2tvZmYgPSBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0aWYgKGNvbnRleHQubGVuZ3RoID4gdGhpcy5fb3B0aW9ucy5vcmRlcikge1xyXG5cdFx0Y29udGV4dCA9IGNvbnRleHQuc2xpY2UoLXRoaXMuX29wdGlvbnMub3JkZXIpO1xyXG5cdH0gZWxzZSBpZiAoY29udGV4dC5sZW5ndGggPCB0aGlzLl9vcHRpb25zLm9yZGVyKSB7XHJcblx0XHRjb250ZXh0ID0gdGhpcy5fcHJlZml4LnNsaWNlKDAsIHRoaXMuX29wdGlvbnMub3JkZXIgLSBjb250ZXh0Lmxlbmd0aCkuY29uY2F0KGNvbnRleHQpO1xyXG5cdH1cclxuXHJcblx0d2hpbGUgKCEodGhpcy5fam9pbihjb250ZXh0KSBpbiB0aGlzLl9kYXRhKSAmJiBjb250ZXh0Lmxlbmd0aCA+IDApIHsgY29udGV4dCA9IGNvbnRleHQuc2xpY2UoMSk7IH1cclxuXHJcblx0cmV0dXJuIGNvbnRleHQ7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgR2VuZXJpYyBldmVudCBxdWV1ZTogc3RvcmVzIGV2ZW50cyBhbmQgcmV0cmlldmVzIHRoZW0gYmFzZWQgb24gdGhlaXIgdGltZVxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl90aW1lID0gMDtcclxuXHR0aGlzLl9ldmVudHMgPSBbXTtcclxuXHR0aGlzLl9ldmVudFRpbWVzID0gW107XHJcbn07XHJcblxyXG4vKipcclxuICogQHJldHVybnMge251bWJlcn0gRWxhcHNlZCB0aW1lXHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuZ2V0VGltZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl90aW1lO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsZWFyIGFsbCBzY2hlZHVsZWQgZXZlbnRzXHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9ldmVudHMgPSBbXTtcclxuXHR0aGlzLl9ldmVudFRpbWVzID0gW107XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHs/fSBldmVudFxyXG4gKiBAcGFyYW0ge251bWJlcn0gdGltZVxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGV2ZW50LCB0aW1lKSB7XHJcblx0dmFyIGluZGV4ID0gdGhpcy5fZXZlbnRzLmxlbmd0aDtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9ldmVudFRpbWVzLmxlbmd0aDtpKyspIHtcclxuXHRcdGlmICh0aGlzLl9ldmVudFRpbWVzW2ldID4gdGltZSkge1xyXG5cdFx0XHRpbmRleCA9IGk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGhpcy5fZXZlbnRzLnNwbGljZShpbmRleCwgMCwgZXZlbnQpO1xyXG5cdHRoaXMuX2V2ZW50VGltZXMuc3BsaWNlKGluZGV4LCAwLCB0aW1lKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBMb2NhdGVzIHRoZSBuZWFyZXN0IGV2ZW50LCBhZHZhbmNlcyB0aW1lIGlmIG5lY2Vzc2FyeS4gUmV0dXJucyB0aGF0IGV2ZW50IGFuZCByZW1vdmVzIGl0IGZyb20gdGhlIHF1ZXVlLlxyXG4gKiBAcmV0dXJucyB7PyB8fCBudWxsfSBUaGUgZXZlbnQgcHJldmlvdXNseSBhZGRlZCBieSBhZGRFdmVudCwgbnVsbCBpZiBubyBldmVudCBhdmFpbGFibGVcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbigpIHtcclxuXHRpZiAoIXRoaXMuX2V2ZW50cy5sZW5ndGgpIHsgcmV0dXJuIG51bGw7IH1cclxuXHJcblx0dmFyIHRpbWUgPSB0aGlzLl9ldmVudFRpbWVzLnNwbGljZSgwLCAxKVswXTtcclxuXHRpZiAodGltZSA+IDApIHsgLyogYWR2YW5jZSAqL1xyXG5cdFx0dGhpcy5fdGltZSArPSB0aW1lO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fZXZlbnRUaW1lcy5sZW5ndGg7aSsrKSB7IHRoaXMuX2V2ZW50VGltZXNbaV0gLT0gdGltZTsgfVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXMuX2V2ZW50cy5zcGxpY2UoMCwgMSlbMF07XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHRoZSB0aW1lIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gZXZlbnRcclxuICogQHBhcmFtIHs/fSBldmVudFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aW1lXHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuZ2V0RXZlbnRUaW1lID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHR2YXIgaW5kZXggPSB0aGlzLl9ldmVudHMuaW5kZXhPZihldmVudCk7XHJcblx0aWYgKGluZGV4ID09IC0xKSB7IHJldHVybiB1bmRlZmluZWQgfVxyXG5cdHJldHVybiB0aGlzLl9ldmVudFRpbWVzW2luZGV4XTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgYW4gZXZlbnQgZnJvbSB0aGUgcXVldWVcclxuICogQHBhcmFtIHs/fSBldmVudFxyXG4gKiBAcmV0dXJucyB7Ym9vbH0gc3VjY2Vzcz9cclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdHZhciBpbmRleCA9IHRoaXMuX2V2ZW50cy5pbmRleE9mKGV2ZW50KTtcclxuXHRpZiAoaW5kZXggPT0gLTEpIHsgcmV0dXJuIGZhbHNlIH1cclxuXHR0aGlzLl9yZW1vdmUoaW5kZXgpO1xyXG5cdHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhbiBldmVudCBmcm9tIHRoZSBxdWV1ZVxyXG4gKiBAcGFyYW0ge2ludH0gaW5kZXhcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5fcmVtb3ZlID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuXHR0aGlzLl9ldmVudHMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHR0aGlzLl9ldmVudFRpbWVzLnNwbGljZShpbmRleCwgMSk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQWJzdHJhY3Qgc2NoZWR1bGVyXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fcXVldWUgPSBuZXcgUk9ULkV2ZW50UXVldWUoKTtcclxuXHR0aGlzLl9yZXBlYXQgPSBbXTtcclxuXHR0aGlzLl9jdXJyZW50ID0gbnVsbDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5FdmVudFF1ZXVlI2dldFRpbWVcclxuICovXHJcblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fcXVldWUuZ2V0VGltZSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7P30gaXRlbVxyXG4gKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oaXRlbSwgcmVwZWF0KSB7XHJcblx0aWYgKHJlcGVhdCkgeyB0aGlzLl9yZXBlYXQucHVzaChpdGVtKTsgfVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgdGltZSB0aGUgZ2l2ZW4gaXRlbSBpcyBzY2hlZHVsZWQgZm9yXHJcbiAqIEBwYXJhbSB7P30gaXRlbVxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aW1lXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5nZXRUaW1lT2YgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0cmV0dXJuIHRoaXMuX3F1ZXVlLmdldEV2ZW50VGltZShpdGVtKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbGVhciBhbGwgaXRlbXNcclxuICovXHJcblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fcXVldWUuY2xlYXIoKTtcclxuXHR0aGlzLl9yZXBlYXQgPSBbXTtcclxuXHR0aGlzLl9jdXJyZW50ID0gbnVsbDtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgYSBwcmV2aW91c2x5IGFkZGVkIGl0ZW1cclxuICogQHBhcmFtIHs/fSBpdGVtXHJcbiAqIEByZXR1cm5zIHtib29sfSBzdWNjZXNzZnVsP1xyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdHZhciByZXN1bHQgPSB0aGlzLl9xdWV1ZS5yZW1vdmUoaXRlbSk7XHJcblxyXG5cdHZhciBpbmRleCA9IHRoaXMuX3JlcGVhdC5pbmRleE9mKGl0ZW0pO1xyXG5cdGlmIChpbmRleCAhPSAtMSkgeyB0aGlzLl9yZXBlYXQuc3BsaWNlKGluZGV4LCAxKTsgfVxyXG5cclxuXHRpZiAodGhpcy5fY3VycmVudCA9PSBpdGVtKSB7IHRoaXMuX2N1cnJlbnQgPSBudWxsOyB9XHJcblxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vKipcclxuICogU2NoZWR1bGUgbmV4dCBpdGVtXHJcbiAqIEByZXR1cm5zIHs/fVxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9xdWV1ZS5nZXQoKTtcclxuXHRyZXR1cm4gdGhpcy5fY3VycmVudDtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBTaW1wbGUgZmFpciBzY2hlZHVsZXIgKHJvdW5kLXJvYmluIHN0eWxlKVxyXG4gKiBAYXVnbWVudHMgUk9ULlNjaGVkdWxlclxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5TaW1wbGUgPSBmdW5jdGlvbigpIHtcclxuXHRST1QuU2NoZWR1bGVyLmNhbGwodGhpcyk7XHJcbn07XHJcblJPVC5TY2hlZHVsZXIuU2ltcGxlLmV4dGVuZChST1QuU2NoZWR1bGVyKTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjYWRkXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLlNpbXBsZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oaXRlbSwgcmVwZWF0KSB7XHJcblx0dGhpcy5fcXVldWUuYWRkKGl0ZW0sIDApO1xyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5hZGQuY2FsbCh0aGlzLCBpdGVtLCByZXBlYXQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNuZXh0XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLlNpbXBsZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xyXG5cdGlmICh0aGlzLl9jdXJyZW50ICYmIHRoaXMuX3JlcGVhdC5pbmRleE9mKHRoaXMuX2N1cnJlbnQpICE9IC0xKSB7XHJcblx0XHR0aGlzLl9xdWV1ZS5hZGQodGhpcy5fY3VycmVudCwgMCk7XHJcblx0fVxyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgU3BlZWQtYmFzZWQgc2NoZWR1bGVyXHJcbiAqIEBhdWdtZW50cyBST1QuU2NoZWR1bGVyXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLlNwZWVkID0gZnVuY3Rpb24oKSB7XHJcblx0Uk9ULlNjaGVkdWxlci5jYWxsKHRoaXMpO1xyXG59O1xyXG5ST1QuU2NoZWR1bGVyLlNwZWVkLmV4dGVuZChST1QuU2NoZWR1bGVyKTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge29iamVjdH0gaXRlbSBhbnl0aGluZyB3aXRoIFwiZ2V0U3BlZWRcIiBtZXRob2RcclxuICogQHBhcmFtIHtib29sfSByZXBlYXRcclxuICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lPTEvaXRlbS5nZXRTcGVlZCgpXVxyXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjYWRkXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLlNwZWVkLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQsIHRpbWUpIHtcclxuXHR0aGlzLl9xdWV1ZS5hZGQoaXRlbSwgdGltZSAhPT0gdW5kZWZpbmVkID8gdGltZSA6IDEvaXRlbS5nZXRTcGVlZCgpKTtcclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuYWRkLmNhbGwodGhpcywgaXRlbSwgcmVwZWF0KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjbmV4dFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5TcGVlZC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xyXG5cdGlmICh0aGlzLl9jdXJyZW50ICYmIHRoaXMuX3JlcGVhdC5pbmRleE9mKHRoaXMuX2N1cnJlbnQpICE9IC0xKSB7XHJcblx0XHR0aGlzLl9xdWV1ZS5hZGQodGhpcy5fY3VycmVudCwgMS90aGlzLl9jdXJyZW50LmdldFNwZWVkKCkpO1xyXG5cdH1cclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEFjdGlvbi1iYXNlZCBzY2hlZHVsZXJcclxuICogQGF1Z21lbnRzIFJPVC5TY2hlZHVsZXJcclxuICovXHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uID0gZnVuY3Rpb24oKSB7XHJcblx0Uk9ULlNjaGVkdWxlci5jYWxsKHRoaXMpO1xyXG5cdHRoaXMuX2RlZmF1bHREdXJhdGlvbiA9IDE7IC8qIGZvciBuZXdseSBhZGRlZCAqL1xyXG5cdHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uOyAvKiBmb3IgdGhpcy5fY3VycmVudCAqL1xyXG59O1xyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5leHRlbmQoUk9ULlNjaGVkdWxlcik7XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW1cclxuICogQHBhcmFtIHtib29sfSByZXBlYXRcclxuICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lPTFdXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNhZGRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQsIHRpbWUpIHtcclxuXHR0aGlzLl9xdWV1ZS5hZGQoaXRlbSwgdGltZSB8fCB0aGlzLl9kZWZhdWx0RHVyYXRpb24pO1xyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5hZGQuY2FsbCh0aGlzLCBpdGVtLCByZXBlYXQpO1xyXG59O1xyXG5cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fZHVyYXRpb24gPSB0aGlzLl9kZWZhdWx0RHVyYXRpb247XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmNsZWFyLmNhbGwodGhpcyk7XHJcbn07XHJcblxyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdGlmIChpdGVtID09IHRoaXMuX2N1cnJlbnQpIHsgdGhpcy5fZHVyYXRpb24gPSB0aGlzLl9kZWZhdWx0RHVyYXRpb247IH1cclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUucmVtb3ZlLmNhbGwodGhpcywgaXRlbSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuU2NoZWR1bGVyI25leHRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKHRoaXMuX2N1cnJlbnQgJiYgdGhpcy5fcmVwZWF0LmluZGV4T2YodGhpcy5fY3VycmVudCkgIT0gLTEpIHtcclxuXHRcdHRoaXMuX3F1ZXVlLmFkZCh0aGlzLl9jdXJyZW50LCB0aGlzLl9kdXJhdGlvbiB8fCB0aGlzLl9kZWZhdWx0RHVyYXRpb24pO1xyXG5cdFx0dGhpcy5fZHVyYXRpb24gPSB0aGlzLl9kZWZhdWx0RHVyYXRpb247XHJcblx0fVxyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGR1cmF0aW9uIGZvciB0aGUgYWN0aXZlIGl0ZW1cclxuICovXHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5zZXREdXJhdGlvbiA9IGZ1bmN0aW9uKHRpbWUpIHtcclxuXHRpZiAodGhpcy5fY3VycmVudCkgeyB0aGlzLl9kdXJhdGlvbiA9IHRpbWU7IH1cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBBc3luY2hyb25vdXMgbWFpbiBsb29wXHJcbiAqIEBwYXJhbSB7Uk9ULlNjaGVkdWxlcn0gc2NoZWR1bGVyXHJcbiAqL1xyXG5ST1QuRW5naW5lID0gZnVuY3Rpb24oc2NoZWR1bGVyKSB7XHJcblx0dGhpcy5fc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xyXG5cdHRoaXMuX2xvY2sgPSAxO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN0YXJ0IHRoZSBtYWluIGxvb3AuIFdoZW4gdGhpcyBjYWxsIHJldHVybnMsIHRoZSBsb29wIGlzIGxvY2tlZC5cclxuICovXHJcblJPVC5FbmdpbmUucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMudW5sb2NrKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogSW50ZXJydXB0IHRoZSBlbmdpbmUgYnkgYW4gYXN5bmNocm9ub3VzIGFjdGlvblxyXG4gKi9cclxuUk9ULkVuZ2luZS5wcm90b3R5cGUubG9jayA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2xvY2srKztcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXN1bWUgZXhlY3V0aW9uIChwYXVzZWQgYnkgYSBwcmV2aW91cyBsb2NrKVxyXG4gKi9cclxuUk9ULkVuZ2luZS5wcm90b3R5cGUudW5sb2NrID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKCF0aGlzLl9sb2NrKSB7IHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCB1bmxvY2sgdW5sb2NrZWQgZW5naW5lXCIpOyB9XHJcblx0dGhpcy5fbG9jay0tO1xyXG5cclxuXHR3aGlsZSAoIXRoaXMuX2xvY2spIHtcclxuXHRcdHZhciBhY3RvciA9IHRoaXMuX3NjaGVkdWxlci5uZXh0KCk7XHJcblx0XHRpZiAoIWFjdG9yKSB7IHJldHVybiB0aGlzLmxvY2soKTsgfSAvKiBubyBhY3RvcnMgKi9cclxuXHRcdHZhciByZXN1bHQgPSBhY3Rvci5hY3QoKTtcclxuXHRcdGlmIChyZXN1bHQgJiYgcmVzdWx0LnRoZW4pIHsgLyogYWN0b3IgcmV0dXJuZWQgYSBcInRoZW5hYmxlXCIsIGxvb2tzIGxpa2UgYSBQcm9taXNlICovXHJcblx0XHRcdHRoaXMubG9jaygpO1xyXG5cdFx0XHRyZXN1bHQudGhlbih0aGlzLnVubG9jay5iaW5kKHRoaXMpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEJhc2UgbWFwIGdlbmVyYXRvclxyXG4gKiBAcGFyYW0ge2ludH0gW3dpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxyXG4gKiBAcGFyYW0ge2ludH0gW2hlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXHJcbiAqL1xyXG5ST1QuTWFwID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG5cdHRoaXMuX3dpZHRoID0gd2lkdGggfHwgUk9ULkRFRkFVTFRfV0lEVEg7XHJcblx0dGhpcy5faGVpZ2h0ID0gaGVpZ2h0IHx8IFJPVC5ERUZBVUxUX0hFSUdIVDtcclxufTtcclxuXHJcblJPVC5NYXAucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7fTtcclxuXHJcblJPVC5NYXAucHJvdG90eXBlLl9maWxsTWFwID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHR2YXIgbWFwID0gW107XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XHJcblx0XHRtYXAucHVzaChbXSk7XHJcblx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7IG1hcFtpXS5wdXNoKHZhbHVlKTsgfVxyXG5cdH1cclxuXHRyZXR1cm4gbWFwO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFNpbXBsZSBlbXB0eSByZWN0YW5ndWxhciByb29tXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwXHJcbiAqL1xyXG5ST1QuTWFwLkFyZW5hID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxufTtcclxuUk9ULk1hcC5BcmVuYS5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG5ST1QuTWFwLkFyZW5hLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciB3ID0gdGhpcy5fd2lkdGgtMTtcclxuXHR2YXIgaCA9IHRoaXMuX2hlaWdodC0xO1xyXG5cdGZvciAodmFyIGk9MDtpPD13O2krKykge1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8PWg7aisrKSB7XHJcblx0XHRcdHZhciBlbXB0eSA9IChpICYmIGogJiYgaTx3ICYmIGo8aCk7XHJcblx0XHRcdGNhbGxiYWNrKGksIGosIGVtcHR5ID8gMCA6IDEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBSZWN1cnNpdmVseSBkaXZpZGVkIG1hemUsIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTWF6ZV9nZW5lcmF0aW9uX2FsZ29yaXRobSNSZWN1cnNpdmVfZGl2aXNpb25fbWV0aG9kXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwXHJcbiAqL1xyXG5ST1QuTWFwLkRpdmlkZWRNYXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHR0aGlzLl9zdGFjayA9IFtdO1xyXG59O1xyXG5ST1QuTWFwLkRpdmlkZWRNYXplLmV4dGVuZChST1QuTWFwKTtcclxuXHJcblJPVC5NYXAuRGl2aWRlZE1hemUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIHcgPSB0aGlzLl93aWR0aDtcclxuXHR2YXIgaCA9IHRoaXMuX2hlaWdodDtcclxuXHRcclxuXHR0aGlzLl9tYXAgPSBbXTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xyXG5cdFx0dGhpcy5fbWFwLnB1c2goW10pO1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8aDtqKyspIHtcclxuXHRcdFx0dmFyIGJvcmRlciA9IChpID09IDAgfHwgaiA9PSAwIHx8IGkrMSA9PSB3IHx8IGorMSA9PSBoKTtcclxuXHRcdFx0dGhpcy5fbWFwW2ldLnB1c2goYm9yZGVyID8gMSA6IDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0aGlzLl9zdGFjayA9IFtcclxuXHRcdFsxLCAxLCB3LTIsIGgtMl1cclxuXHRdO1xyXG5cdHRoaXMuX3Byb2Nlc3MoKTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8aDtqKyspIHtcclxuXHRcdFx0Y2FsbGJhY2soaSwgaiwgdGhpcy5fbWFwW2ldW2pdKTtcclxuXHRcdH1cclxuXHR9XHJcblx0dGhpcy5fbWFwID0gbnVsbDtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuRGl2aWRlZE1hemUucHJvdG90eXBlLl9wcm9jZXNzID0gZnVuY3Rpb24oKSB7XHJcblx0d2hpbGUgKHRoaXMuX3N0YWNrLmxlbmd0aCkge1xyXG5cdFx0dmFyIHJvb20gPSB0aGlzLl9zdGFjay5zaGlmdCgpOyAvKiBbbGVmdCwgdG9wLCByaWdodCwgYm90dG9tXSAqL1xyXG5cdFx0dGhpcy5fcGFydGl0aW9uUm9vbShyb29tKTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpdmlkZWRNYXplLnByb3RvdHlwZS5fcGFydGl0aW9uUm9vbSA9IGZ1bmN0aW9uKHJvb20pIHtcclxuXHR2YXIgYXZhaWxYID0gW107XHJcblx0dmFyIGF2YWlsWSA9IFtdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9cm9vbVswXSsxO2k8cm9vbVsyXTtpKyspIHtcclxuXHRcdHZhciB0b3AgPSB0aGlzLl9tYXBbaV1bcm9vbVsxXS0xXTtcclxuXHRcdHZhciBib3R0b20gPSB0aGlzLl9tYXBbaV1bcm9vbVszXSsxXTtcclxuXHRcdGlmICh0b3AgJiYgYm90dG9tICYmICEoaSAlIDIpKSB7IGF2YWlsWC5wdXNoKGkpOyB9XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGo9cm9vbVsxXSsxO2o8cm9vbVszXTtqKyspIHtcclxuXHRcdHZhciBsZWZ0ID0gdGhpcy5fbWFwW3Jvb21bMF0tMV1bal07XHJcblx0XHR2YXIgcmlnaHQgPSB0aGlzLl9tYXBbcm9vbVsyXSsxXVtqXTtcclxuXHRcdGlmIChsZWZ0ICYmIHJpZ2h0ICYmICEoaiAlIDIpKSB7IGF2YWlsWS5wdXNoKGopOyB9XHJcblx0fVxyXG5cclxuXHRpZiAoIWF2YWlsWC5sZW5ndGggfHwgIWF2YWlsWS5sZW5ndGgpIHsgcmV0dXJuOyB9XHJcblxyXG5cdHZhciB4ID0gYXZhaWxYLnJhbmRvbSgpO1xyXG5cdHZhciB5ID0gYXZhaWxZLnJhbmRvbSgpO1xyXG5cdFxyXG5cdHRoaXMuX21hcFt4XVt5XSA9IDE7XHJcblx0XHJcblx0dmFyIHdhbGxzID0gW107XHJcblx0XHJcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogbGVmdCBwYXJ0ICovXHJcblx0Zm9yICh2YXIgaT1yb29tWzBdOyBpPHg7IGkrKykgeyBcclxuXHRcdHRoaXMuX21hcFtpXVt5XSA9IDE7XHJcblx0XHR3LnB1c2goW2ksIHldKTsgXHJcblx0fVxyXG5cdFxyXG5cdHZhciB3ID0gW107IHdhbGxzLnB1c2godyk7IC8qIHJpZ2h0IHBhcnQgKi9cclxuXHRmb3IgKHZhciBpPXgrMTsgaTw9cm9vbVsyXTsgaSsrKSB7IFxyXG5cdFx0dGhpcy5fbWFwW2ldW3ldID0gMTtcclxuXHRcdHcucHVzaChbaSwgeV0pOyBcclxuXHR9XHJcblxyXG5cdHZhciB3ID0gW107IHdhbGxzLnB1c2godyk7IC8qIHRvcCBwYXJ0ICovXHJcblx0Zm9yICh2YXIgaj1yb29tWzFdOyBqPHk7IGorKykgeyBcclxuXHRcdHRoaXMuX21hcFt4XVtqXSA9IDE7XHJcblx0XHR3LnB1c2goW3gsIGpdKTsgXHJcblx0fVxyXG5cdFxyXG5cdHZhciB3ID0gW107IHdhbGxzLnB1c2godyk7IC8qIGJvdHRvbSBwYXJ0ICovXHJcblx0Zm9yICh2YXIgaj15KzE7IGo8PXJvb21bM107IGorKykgeyBcclxuXHRcdHRoaXMuX21hcFt4XVtqXSA9IDE7XHJcblx0XHR3LnB1c2goW3gsIGpdKTsgXHJcblx0fVxyXG5cdFx0XHJcblx0dmFyIHNvbGlkID0gd2FsbHMucmFuZG9tKCk7XHJcblx0Zm9yICh2YXIgaT0wO2k8d2FsbHMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHcgPSB3YWxsc1tpXTtcclxuXHRcdGlmICh3ID09IHNvbGlkKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRcclxuXHRcdHZhciBob2xlID0gdy5yYW5kb20oKTtcclxuXHRcdHRoaXMuX21hcFtob2xlWzBdXVtob2xlWzFdXSA9IDA7XHJcblx0fVxyXG5cclxuXHR0aGlzLl9zdGFjay5wdXNoKFtyb29tWzBdLCByb29tWzFdLCB4LTEsIHktMV0pOyAvKiBsZWZ0IHRvcCAqL1xyXG5cdHRoaXMuX3N0YWNrLnB1c2goW3grMSwgcm9vbVsxXSwgcm9vbVsyXSwgeS0xXSk7IC8qIHJpZ2h0IHRvcCAqL1xyXG5cdHRoaXMuX3N0YWNrLnB1c2goW3Jvb21bMF0sIHkrMSwgeC0xLCByb29tWzNdXSk7IC8qIGxlZnQgYm90dG9tICovXHJcblx0dGhpcy5fc3RhY2sucHVzaChbeCsxLCB5KzEsIHJvb21bMl0sIHJvb21bM11dKTsgLyogcmlnaHQgYm90dG9tICovXHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgSWNleSdzIE1hemUgZ2VuZXJhdG9yXHJcbiAqIFNlZSBodHRwOi8vd3d3LnJvZ3VlYmFzaW4ucm9ndWVsaWtlZGV2ZWxvcG1lbnQub3JnL2luZGV4LnBocD90aXRsZT1TaW1wbGVfbWF6ZSBmb3IgZXhwbGFuYXRpb25cclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuSWNleU1hemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCByZWd1bGFyaXR5KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdHRoaXMuX3JlZ3VsYXJpdHkgPSByZWd1bGFyaXR5IHx8IDA7XHJcbn07XHJcblJPVC5NYXAuSWNleU1hemUuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuUk9ULk1hcC5JY2V5TWF6ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR2YXIgd2lkdGggPSB0aGlzLl93aWR0aDtcclxuXHR2YXIgaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xyXG5cdFxyXG5cdHZhciBtYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xyXG5cdFxyXG5cdHdpZHRoIC09ICh3aWR0aCAlIDIgPyAxIDogMik7XHJcblx0aGVpZ2h0IC09IChoZWlnaHQgJSAyID8gMSA6IDIpO1xyXG5cclxuXHR2YXIgY3ggPSAwO1xyXG5cdHZhciBjeSA9IDA7XHJcblx0dmFyIG54ID0gMDtcclxuXHR2YXIgbnkgPSAwO1xyXG5cclxuXHR2YXIgZG9uZSA9IDA7XHJcblx0dmFyIGJsb2NrZWQgPSBmYWxzZTtcclxuXHR2YXIgZGlycyA9IFtcclxuXHRcdFswLCAwXSxcclxuXHRcdFswLCAwXSxcclxuXHRcdFswLCAwXSxcclxuXHRcdFswLCAwXVxyXG5cdF07XHJcblx0ZG8ge1xyXG5cdFx0Y3ggPSAxICsgMipNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKih3aWR0aC0xKSAvIDIpO1xyXG5cdFx0Y3kgPSAxICsgMipNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKihoZWlnaHQtMSkgLyAyKTtcclxuXHJcblx0XHRpZiAoIWRvbmUpIHsgbWFwW2N4XVtjeV0gPSAwOyB9XHJcblx0XHRcclxuXHRcdGlmICghbWFwW2N4XVtjeV0pIHtcclxuXHRcdFx0dGhpcy5fcmFuZG9taXplKGRpcnMpO1xyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0aWYgKE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqKHRoaXMuX3JlZ3VsYXJpdHkrMSkpID09IDApIHsgdGhpcy5fcmFuZG9taXplKGRpcnMpOyB9XHJcblx0XHRcdFx0YmxvY2tlZCA9IHRydWU7XHJcblx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8NDtpKyspIHtcclxuXHRcdFx0XHRcdG54ID0gY3ggKyBkaXJzW2ldWzBdKjI7XHJcblx0XHRcdFx0XHRueSA9IGN5ICsgZGlyc1tpXVsxXSoyO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuX2lzRnJlZShtYXAsIG54LCBueSwgd2lkdGgsIGhlaWdodCkpIHtcclxuXHRcdFx0XHRcdFx0bWFwW254XVtueV0gPSAwO1xyXG5cdFx0XHRcdFx0XHRtYXBbY3ggKyBkaXJzW2ldWzBdXVtjeSArIGRpcnNbaV1bMV1dID0gMDtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGN4ID0gbng7XHJcblx0XHRcdFx0XHRcdGN5ID0gbnk7XHJcblx0XHRcdFx0XHRcdGJsb2NrZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0ZG9uZSsrO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gd2hpbGUgKCFibG9ja2VkKTtcclxuXHRcdH1cclxuXHR9IHdoaWxlIChkb25lKzEgPCB3aWR0aCpoZWlnaHQvNCk7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHRcdGNhbGxiYWNrKGksIGosIG1hcFtpXVtqXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHRoaXMuX21hcCA9IG51bGw7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLkljZXlNYXplLnByb3RvdHlwZS5fcmFuZG9taXplID0gZnVuY3Rpb24oZGlycykge1xyXG5cdGZvciAodmFyIGk9MDtpPDQ7aSsrKSB7XHJcblx0XHRkaXJzW2ldWzBdID0gMDtcclxuXHRcdGRpcnNbaV1bMV0gPSAwO1xyXG5cdH1cclxuXHRcclxuXHRzd2l0Y2ggKE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqNCkpIHtcclxuXHRcdGNhc2UgMDpcclxuXHRcdFx0ZGlyc1swXVswXSA9IC0xOyBkaXJzWzFdWzBdID0gMTtcclxuXHRcdFx0ZGlyc1syXVsxXSA9IC0xOyBkaXJzWzNdWzFdID0gMTtcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAxOlxyXG5cdFx0XHRkaXJzWzNdWzBdID0gLTE7IGRpcnNbMl1bMF0gPSAxO1xyXG5cdFx0XHRkaXJzWzFdWzFdID0gLTE7IGRpcnNbMF1bMV0gPSAxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDI6XHJcblx0XHRcdGRpcnNbMl1bMF0gPSAtMTsgZGlyc1szXVswXSA9IDE7XHJcblx0XHRcdGRpcnNbMF1bMV0gPSAtMTsgZGlyc1sxXVsxXSA9IDE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMzpcclxuXHRcdFx0ZGlyc1sxXVswXSA9IC0xOyBkaXJzWzBdWzBdID0gMTtcclxuXHRcdFx0ZGlyc1szXVsxXSA9IC0xOyBkaXJzWzJdWzFdID0gMTtcclxuXHRcdGJyZWFrO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuSWNleU1hemUucHJvdG90eXBlLl9pc0ZyZWUgPSBmdW5jdGlvbihtYXAsIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuXHRpZiAoeCA8IDEgfHwgeSA8IDEgfHwgeCA+PSB3aWR0aCB8fCB5ID49IGhlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRyZXR1cm4gbWFwW3hdW3ldO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIE1hemUgZ2VuZXJhdG9yIC0gRWxsZXIncyBhbGdvcml0aG1cclxuICogU2VlIGh0dHA6Ly9ob21lcGFnZXMuY3dpLm5sL350cm9tcC9tYXplLmh0bWwgZm9yIGV4cGxhbmF0aW9uXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwXHJcbiAqL1xyXG5ST1QuTWFwLkVsbGVyTWF6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcbn07XHJcblJPVC5NYXAuRWxsZXJNYXplLmV4dGVuZChST1QuTWFwKTtcclxuXHJcblJPVC5NYXAuRWxsZXJNYXplLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciBtYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xyXG5cdHZhciB3ID0gTWF0aC5jZWlsKCh0aGlzLl93aWR0aC0yKS8yKTtcclxuXHRcclxuXHR2YXIgcmFuZCA9IDkvMjQ7XHJcblx0XHJcblx0dmFyIEwgPSBbXTtcclxuXHR2YXIgUiA9IFtdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XHJcblx0XHRMLnB1c2goaSk7XHJcblx0XHRSLnB1c2goaSk7XHJcblx0fVxyXG5cdEwucHVzaCh3LTEpOyAvKiBmYWtlIHN0b3AtYmxvY2sgYXQgdGhlIHJpZ2h0IHNpZGUgKi9cclxuXHJcblx0Zm9yICh2YXIgaj0xO2orMzx0aGlzLl9oZWlnaHQ7ais9Mikge1xyXG5cdFx0Lyogb25lIHJvdyAqL1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcclxuXHRcdFx0LyogY2VsbCBjb29yZHMgKHdpbGwgYmUgYWx3YXlzIGVtcHR5KSAqL1xyXG5cdFx0XHR2YXIgeCA9IDIqaSsxO1xyXG5cdFx0XHR2YXIgeSA9IGo7XHJcblx0XHRcdG1hcFt4XVt5XSA9IDA7XHJcblx0XHRcdFxyXG5cdFx0XHQvKiByaWdodCBjb25uZWN0aW9uICovXHJcblx0XHRcdGlmIChpICE9IExbaSsxXSAmJiBST1QuUk5HLmdldFVuaWZvcm0oKSA+IHJhbmQpIHtcclxuXHRcdFx0XHR0aGlzLl9hZGRUb0xpc3QoaSwgTCwgUik7XHJcblx0XHRcdFx0bWFwW3grMV1beV0gPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvKiBib3R0b20gY29ubmVjdGlvbiAqL1xyXG5cdFx0XHRpZiAoaSAhPSBMW2ldICYmIFJPVC5STkcuZ2V0VW5pZm9ybSgpID4gcmFuZCkge1xyXG5cdFx0XHRcdC8qIHJlbW92ZSBjb25uZWN0aW9uICovXHJcblx0XHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUxpc3QoaSwgTCwgUik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0LyogY3JlYXRlIGNvbm5lY3Rpb24gKi9cclxuXHRcdFx0XHRtYXBbeF1beSsxXSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qIGxhc3Qgcm93ICovXHJcblx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcclxuXHRcdC8qIGNlbGwgY29vcmRzICh3aWxsIGJlIGFsd2F5cyBlbXB0eSkgKi9cclxuXHRcdHZhciB4ID0gMippKzE7XHJcblx0XHR2YXIgeSA9IGo7XHJcblx0XHRtYXBbeF1beV0gPSAwO1xyXG5cdFx0XHJcblx0XHQvKiByaWdodCBjb25uZWN0aW9uICovXHJcblx0XHRpZiAoaSAhPSBMW2krMV0gJiYgKGkgPT0gTFtpXSB8fCBST1QuUk5HLmdldFVuaWZvcm0oKSA+IHJhbmQpKSB7XHJcblx0XHRcdC8qIGRpZyByaWdodCBhbHNvIGlmIHRoZSBjZWxsIGlzIHNlcGFyYXRlZCwgc28gaXQgZ2V0cyBjb25uZWN0ZWQgdG8gdGhlIHJlc3Qgb2YgbWF6ZSAqL1xyXG5cdFx0XHR0aGlzLl9hZGRUb0xpc3QoaSwgTCwgUik7XHJcblx0XHRcdG1hcFt4KzFdW3ldID0gMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5fcmVtb3ZlRnJvbUxpc3QoaSwgTCwgUik7XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0XHRjYWxsYmFjayhpLCBqLCBtYXBbaV1bal0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgXCJpXCIgZnJvbSBpdHMgbGlzdFxyXG4gKi9cclxuUk9ULk1hcC5FbGxlck1hemUucHJvdG90eXBlLl9yZW1vdmVGcm9tTGlzdCA9IGZ1bmN0aW9uKGksIEwsIFIpIHtcclxuXHRSW0xbaV1dID0gUltpXTtcclxuXHRMW1JbaV1dID0gTFtpXTtcclxuXHRSW2ldID0gaTtcclxuXHRMW2ldID0gaTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBKb2luIGxpc3RzIHdpdGggXCJpXCIgYW5kIFwiaSsxXCJcclxuICovXHJcblJPVC5NYXAuRWxsZXJNYXplLnByb3RvdHlwZS5fYWRkVG9MaXN0ID0gZnVuY3Rpb24oaSwgTCwgUikge1xyXG5cdFJbTFtpKzFdXSA9IFJbaV07XHJcblx0TFtSW2ldXSA9IExbaSsxXTtcclxuXHRSW2ldID0gaSsxO1xyXG5cdExbaSsxXSA9IGk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQ2VsbHVsYXIgYXV0b21hdG9uIG1hcCBnZW5lcmF0b3JcclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICogQHBhcmFtIHtpbnR9IFt3aWR0aD1ST1QuREVGQVVMVF9XSURUSF1cclxuICogQHBhcmFtIHtpbnR9IFtoZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIE9wdGlvbnNcclxuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuYm9ybl0gTGlzdCBvZiBuZWlnaGJvciBjb3VudHMgZm9yIGEgbmV3IGNlbGwgdG8gYmUgYm9ybiBpbiBlbXB0eSBzcGFjZVxyXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5zdXJ2aXZlXSBMaXN0IG9mIG5laWdoYm9yIGNvdW50cyBmb3IgYW4gZXhpc3RpbmcgIGNlbGwgdG8gc3Vydml2ZVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudG9wb2xvZ3ldIFRvcG9sb2d5IDQgb3IgNiBvciA4XHJcbiAqL1xyXG5ST1QuTWFwLkNlbGx1bGFyID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xyXG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0Ym9ybjogWzUsIDYsIDcsIDhdLFxyXG5cdFx0c3Vydml2ZTogWzQsIDUsIDYsIDcsIDhdLFxyXG5cdFx0dG9wb2xvZ3k6IDhcclxuXHR9O1xyXG5cdHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcclxuXHJcblx0dGhpcy5fZGlycyA9IFJPVC5ESVJTW3RoaXMuX29wdGlvbnMudG9wb2xvZ3ldO1xyXG5cdHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMCk7XHJcbn07XHJcblJPVC5NYXAuQ2VsbHVsYXIuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuLyoqXHJcbiAqIEZpbGwgdGhlIG1hcCB3aXRoIHJhbmRvbSB2YWx1ZXNcclxuICogQHBhcmFtIHtmbG9hdH0gcHJvYmFiaWxpdHkgUHJvYmFiaWxpdHkgZm9yIGEgY2VsbCB0byBiZWNvbWUgYWxpdmU7IDAgPSBhbGwgZW1wdHksIDEgPSBhbGwgZnVsbFxyXG4gKi9cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUucmFuZG9taXplID0gZnVuY3Rpb24ocHJvYmFiaWxpdHkpIHtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdFx0dGhpcy5fbWFwW2ldW2pdID0gKFJPVC5STkcuZ2V0VW5pZm9ybSgpIDwgcHJvYmFiaWxpdHkgPyAxIDogMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoYW5nZSBvcHRpb25zLlxyXG4gKiBAc2VlIFJPVC5NYXAuQ2VsbHVsYXJcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xyXG5cdHRoaXMuX21hcFt4XVt5XSA9IHZhbHVlO1xyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR2YXIgbmV3TWFwID0gdGhpcy5fZmlsbE1hcCgwKTtcclxuXHR2YXIgYm9ybiA9IHRoaXMuX29wdGlvbnMuYm9ybjtcclxuXHR2YXIgc3Vydml2ZSA9IHRoaXMuX29wdGlvbnMuc3Vydml2ZTtcclxuXHJcblxyXG5cdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdHZhciB3aWR0aFN0ZXAgPSAxO1xyXG5cdFx0dmFyIHdpZHRoU3RhcnQgPSAwO1xyXG5cdFx0aWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gNikge1xyXG5cdFx0XHR3aWR0aFN0ZXAgPSAyO1xyXG5cdFx0XHR3aWR0aFN0YXJ0ID0gaiUyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGk9d2lkdGhTdGFydDsgaTx0aGlzLl93aWR0aDsgaSs9d2lkdGhTdGVwKSB7XHJcblxyXG5cdFx0XHR2YXIgY3VyID0gdGhpcy5fbWFwW2ldW2pdO1xyXG5cdFx0XHR2YXIgbmNvdW50ID0gdGhpcy5fZ2V0TmVpZ2hib3JzKGksIGopO1xyXG5cclxuXHRcdFx0aWYgKGN1ciAmJiBzdXJ2aXZlLmluZGV4T2YobmNvdW50KSAhPSAtMSkgeyAvKiBzdXJ2aXZlICovXHJcblx0XHRcdFx0bmV3TWFwW2ldW2pdID0gMTtcclxuXHRcdFx0fSBlbHNlIGlmICghY3VyICYmIGJvcm4uaW5kZXhPZihuY291bnQpICE9IC0xKSB7IC8qIGJvcm4gKi9cclxuXHRcdFx0XHRuZXdNYXBbaV1bal0gPSAxO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aGlzLl9tYXAgPSBuZXdNYXA7XHJcblxyXG5cdHRoaXMuc2VydmljZUNhbGxiYWNrKGNhbGxiYWNrKTtcclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLnNlcnZpY2VDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0aWYgKCFjYWxsYmFjaykgeyByZXR1cm47IH1cclxuXHJcblx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0dmFyIHdpZHRoU3RlcCA9IDE7XHJcblx0XHR2YXIgd2lkdGhTdGFydCA9IDA7XHJcblx0XHRpZiAodGhpcy5fb3B0aW9ucy50b3BvbG9neSA9PSA2KSB7XHJcblx0XHRcdHdpZHRoU3RlcCA9IDI7XHJcblx0XHRcdHdpZHRoU3RhcnQgPSBqJTI7XHJcblx0XHR9XHJcblx0XHRmb3IgKHZhciBpPXdpZHRoU3RhcnQ7IGk8dGhpcy5fd2lkdGg7IGkrPXdpZHRoU3RlcCkge1xyXG5cdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgbmVpZ2hib3IgY291bnQgYXQgW2ksal0gaW4gdGhpcy5fbWFwXHJcbiAqL1xyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZ2V0TmVpZ2hib3JzID0gZnVuY3Rpb24oY3gsIGN5KSB7XHJcblx0dmFyIHJlc3VsdCA9IDA7XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fZGlycy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgZGlyID0gdGhpcy5fZGlyc1tpXTtcclxuXHRcdHZhciB4ID0gY3ggKyBkaXJbMF07XHJcblx0XHR2YXIgeSA9IGN5ICsgZGlyWzFdO1xyXG5cclxuXHRcdGlmICh4IDwgMCB8fCB4ID49IHRoaXMuX3dpZHRoIHx8IHkgPCAwIHx8IHkgPj0gdGhpcy5fd2lkdGgpIHsgY29udGludWU7IH1cclxuXHRcdHJlc3VsdCArPSAodGhpcy5fbWFwW3hdW3ldID09IDEgPyAxIDogMCk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1ha2Ugc3VyZSBldmVyeSBub24td2FsbCBzcGFjZSBpcyBhY2Nlc3NpYmxlLlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayB0byBjYWxsIHRvIGRpc3BsYXkgbWFwIHdoZW4gZG9cclxuICogQHBhcmFtIHtpbnR9IHZhbHVlIHRvIGNvbnNpZGVyIGVtcHR5IHNwYWNlIC0gZGVmYXVsdHMgdG8gMFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayB0byBjYWxsIHdoZW4gYSBuZXcgY29ubmVjdGlvbiBpcyBtYWRlXHJcbiAqL1xyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24oY2FsbGJhY2ssIHZhbHVlLCBjb25uZWN0aW9uQ2FsbGJhY2spIHtcclxuXHRpZiAoIXZhbHVlKSB2YWx1ZSA9IDA7XHJcblxyXG5cdHZhciBhbGxGcmVlU3BhY2UgPSBbXTtcclxuXHR2YXIgbm90Q29ubmVjdGVkID0ge307XHJcblx0Ly8gZmluZCBhbGwgZnJlZSBzcGFjZVxyXG5cdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5fd2lkdGg7IHgrKykge1xyXG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLl9oZWlnaHQ7IHkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5fZnJlZVNwYWNlKHgsIHksIHZhbHVlKSkge1xyXG5cdFx0XHRcdHZhciBwID0gW3gsIHldO1xyXG5cdFx0XHRcdG5vdENvbm5lY3RlZFt0aGlzLl9wb2ludEtleShwKV0gPSBwO1xyXG5cdFx0XHRcdGFsbEZyZWVTcGFjZS5wdXNoKFt4LCB5XSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0dmFyIHN0YXJ0ID0gYWxsRnJlZVNwYWNlW1JPVC5STkcuZ2V0VW5pZm9ybUludCgwLCBhbGxGcmVlU3BhY2UubGVuZ3RoIC0gMSldO1xyXG5cclxuXHR2YXIga2V5ID0gdGhpcy5fcG9pbnRLZXkoc3RhcnQpO1xyXG5cdHZhciBjb25uZWN0ZWQgPSB7fTtcclxuXHRjb25uZWN0ZWRba2V5XSA9IHN0YXJ0O1xyXG5cdGRlbGV0ZSBub3RDb25uZWN0ZWRba2V5XTtcclxuXHJcblx0Ly8gZmluZCB3aGF0J3MgY29ubmVjdGVkIHRvIHRoZSBzdGFydGluZyBwb2ludFxyXG5cdHRoaXMuX2ZpbmRDb25uZWN0ZWQoY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIFtzdGFydF0sIGZhbHNlLCB2YWx1ZSk7XHJcblxyXG5cdHdoaWxlIChPYmplY3Qua2V5cyhub3RDb25uZWN0ZWQpLmxlbmd0aCA+IDApIHtcclxuXHJcblx0XHQvLyBmaW5kIHR3byBwb2ludHMgZnJvbSBub3RDb25uZWN0ZWQgdG8gY29ubmVjdGVkXHJcblx0XHR2YXIgcCA9IHRoaXMuX2dldEZyb21Ubyhjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCk7XHJcblx0XHR2YXIgZnJvbSA9IHBbMF07IC8vIG5vdENvbm5lY3RlZFxyXG5cdFx0dmFyIHRvID0gcFsxXTsgLy8gY29ubmVjdGVkXHJcblxyXG5cdFx0Ly8gZmluZCBldmVyeXRoaW5nIGNvbm5lY3RlZCB0byB0aGUgc3RhcnRpbmcgcG9pbnRcclxuXHRcdHZhciBsb2NhbCA9IHt9O1xyXG5cdFx0bG9jYWxbdGhpcy5fcG9pbnRLZXkoZnJvbSldID0gZnJvbTtcclxuXHRcdHRoaXMuX2ZpbmRDb25uZWN0ZWQobG9jYWwsIG5vdENvbm5lY3RlZCwgW2Zyb21dLCB0cnVlLCB2YWx1ZSk7XHJcblxyXG5cdFx0Ly8gY29ubmVjdCB0byBhIGNvbm5lY3RlZCBzcXVhcmVcclxuXHRcdHRoaXMuX3R1bm5lbFRvQ29ubmVjdGVkKHRvLCBmcm9tLCBjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCwgdmFsdWUsIGNvbm5lY3Rpb25DYWxsYmFjayk7XHJcblxyXG5cdFx0Ly8gbm93IGFsbCBvZiBsb2NhbCBpcyBjb25uZWN0ZWRcclxuXHRcdGZvciAodmFyIGsgaW4gbG9jYWwpIHtcclxuXHRcdFx0dmFyIHBwID0gbG9jYWxba107XHJcblx0XHRcdHRoaXMuX21hcFtwcFswXV1bcHBbMV1dID0gdmFsdWU7XHJcblx0XHRcdGNvbm5lY3RlZFtrXSA9IHBwO1xyXG5cdFx0XHRkZWxldGUgbm90Q29ubmVjdGVkW2tdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGhpcy5zZXJ2aWNlQ2FsbGJhY2soY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZpbmQgcmFuZG9tIHBvaW50cyB0byBjb25uZWN0LiBTZWFyY2ggZm9yIHRoZSBjbG9zZXN0IHBvaW50IGluIHRoZSBsYXJnZXIgc3BhY2UuXHJcbiAqIFRoaXMgaXMgdG8gbWluaW1pemUgdGhlIGxlbmd0aCBvZiB0aGUgcGFzc2FnZSB3aGlsZSBtYWludGFpbmluZyBnb29kIHBlcmZvcm1hbmNlLlxyXG4gKi9cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX2dldEZyb21UbyA9IGZ1bmN0aW9uKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkKSB7XHJcblx0dmFyIGZyb20sIHRvLCBkO1xyXG5cdHZhciBjb25uZWN0ZWRLZXlzID0gT2JqZWN0LmtleXMoY29ubmVjdGVkKTtcclxuXHR2YXIgbm90Q29ubmVjdGVkS2V5cyA9IE9iamVjdC5rZXlzKG5vdENvbm5lY3RlZCk7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCA1OyBpKyspIHtcclxuXHRcdGlmIChjb25uZWN0ZWRLZXlzLmxlbmd0aCA8IG5vdENvbm5lY3RlZEtleXMubGVuZ3RoKSB7XHJcblx0XHRcdHZhciBrZXlzID0gY29ubmVjdGVkS2V5cztcclxuXHRcdFx0dG8gPSBjb25uZWN0ZWRba2V5c1tST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwga2V5cy5sZW5ndGggLSAxKV1dO1xyXG5cdFx0XHRmcm9tID0gdGhpcy5fZ2V0Q2xvc2VzdCh0bywgbm90Q29ubmVjdGVkKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBrZXlzID0gbm90Q29ubmVjdGVkS2V5cztcclxuXHRcdFx0ZnJvbSA9IG5vdENvbm5lY3RlZFtrZXlzW1JPVC5STkcuZ2V0VW5pZm9ybUludCgwLCBrZXlzLmxlbmd0aCAtIDEpXV07XHJcblx0XHRcdHRvID0gdGhpcy5fZ2V0Q2xvc2VzdChmcm9tLCBjb25uZWN0ZWQpO1xyXG5cdFx0fVxyXG5cdFx0ZCA9IChmcm9tWzBdIC0gdG9bMF0pICogKGZyb21bMF0gLSB0b1swXSkgKyAoZnJvbVsxXSAtIHRvWzFdKSAqIChmcm9tWzFdIC0gdG9bMV0pO1xyXG5cdFx0aWYgKGQgPCA2NCkge1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblx0Ly8gY29uc29sZS5sb2coXCI+Pj4gY29ubmVjdGVkPVwiICsgdG8gKyBcIiBub3RDb25uZWN0ZWQ9XCIgKyBmcm9tICsgXCIgZGlzdD1cIiArIGQpO1xyXG5cdHJldHVybiBbZnJvbSwgdG9dO1xyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX2dldENsb3Nlc3QgPSBmdW5jdGlvbihwb2ludCwgc3BhY2UpIHtcclxuXHR2YXIgbWluUG9pbnQgPSBudWxsO1xyXG5cdHZhciBtaW5EaXN0ID0gbnVsbDtcclxuXHRmb3IgKGsgaW4gc3BhY2UpIHtcclxuXHRcdHZhciBwID0gc3BhY2Vba107XHJcblx0XHR2YXIgZCA9IChwWzBdIC0gcG9pbnRbMF0pICogKHBbMF0gLSBwb2ludFswXSkgKyAocFsxXSAtIHBvaW50WzFdKSAqIChwWzFdIC0gcG9pbnRbMV0pO1xyXG5cdFx0aWYgKG1pbkRpc3QgPT0gbnVsbCB8fCBkIDwgbWluRGlzdCkge1xyXG5cdFx0XHRtaW5EaXN0ID0gZDtcclxuXHRcdFx0bWluUG9pbnQgPSBwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gbWluUG9pbnQ7XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZmluZENvbm5lY3RlZCA9IGZ1bmN0aW9uKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCBzdGFjaywga2VlcE5vdENvbm5lY3RlZCwgdmFsdWUpIHtcclxuXHR3aGlsZShzdGFjay5sZW5ndGggPiAwKSB7XHJcblx0XHR2YXIgcCA9IHN0YWNrLnNwbGljZSgwLCAxKVswXTtcclxuXHRcdHZhciB0ZXN0cyA9IFtcclxuXHRcdFx0W3BbMF0gKyAxLCBwWzFdXSxcclxuXHRcdFx0W3BbMF0gLSAxLCBwWzFdXSxcclxuXHRcdFx0W3BbMF0sICAgICBwWzFdICsgMV0sXHJcblx0XHRcdFtwWzBdLCAgICAgcFsxXSAtIDFdXHJcblx0XHRdO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0ZXN0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIga2V5ID0gdGhpcy5fcG9pbnRLZXkodGVzdHNbaV0pO1xyXG5cdFx0XHRpZiAoY29ubmVjdGVkW2tleV0gPT0gbnVsbCAmJiB0aGlzLl9mcmVlU3BhY2UodGVzdHNbaV1bMF0sIHRlc3RzW2ldWzFdLCB2YWx1ZSkpIHtcclxuXHRcdFx0XHRjb25uZWN0ZWRba2V5XSA9IHRlc3RzW2ldO1xyXG5cdFx0XHRcdGlmICgha2VlcE5vdENvbm5lY3RlZCkge1xyXG5cdFx0XHRcdFx0ZGVsZXRlIG5vdENvbm5lY3RlZFtrZXldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzdGFjay5wdXNoKHRlc3RzW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl90dW5uZWxUb0Nvbm5lY3RlZCA9IGZ1bmN0aW9uKHRvLCBmcm9tLCBjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCwgdmFsdWUsIGNvbm5lY3Rpb25DYWxsYmFjaykge1xyXG5cdHZhciBrZXkgPSB0aGlzLl9wb2ludEtleShmcm9tKTtcclxuXHR2YXIgYSwgYjtcclxuXHRpZiAoZnJvbVswXSA8IHRvWzBdKSB7XHJcblx0XHRhID0gZnJvbTtcclxuXHRcdGIgPSB0bztcclxuXHR9IGVsc2Uge1xyXG5cdFx0YSA9IHRvO1xyXG5cdFx0YiA9IGZyb207XHJcblx0fVxyXG5cdGZvciAodmFyIHh4ID0gYVswXTsgeHggPD0gYlswXTsgeHgrKykge1xyXG5cdFx0dGhpcy5fbWFwW3h4XVthWzFdXSA9IHZhbHVlO1xyXG5cdFx0dmFyIHAgPSBbeHgsIGFbMV1dO1xyXG5cdFx0dmFyIHBrZXkgPSB0aGlzLl9wb2ludEtleShwKTtcclxuXHRcdGNvbm5lY3RlZFtwa2V5XSA9IHA7XHJcblx0XHRkZWxldGUgbm90Q29ubmVjdGVkW3BrZXldO1xyXG5cdH1cclxuXHRpZiAoY29ubmVjdGlvbkNhbGxiYWNrICYmIGFbMF0gPCBiWzBdKSB7XHJcblx0XHRjb25uZWN0aW9uQ2FsbGJhY2soYSwgW2JbMF0sIGFbMV1dKTtcclxuXHR9XHJcblxyXG5cdC8vIHggaXMgbm93IGZpeGVkXHJcblx0dmFyIHggPSBiWzBdO1xyXG5cclxuXHRpZiAoZnJvbVsxXSA8IHRvWzFdKSB7XHJcblx0XHRhID0gZnJvbTtcclxuXHRcdGIgPSB0bztcclxuXHR9IGVsc2Uge1xyXG5cdFx0YSA9IHRvO1xyXG5cdFx0YiA9IGZyb207XHJcblx0fVxyXG5cdGZvciAodmFyIHl5ID0gYVsxXTsgeXkgPCBiWzFdOyB5eSsrKSB7XHJcblx0XHR0aGlzLl9tYXBbeF1beXldID0gdmFsdWU7XHJcblx0XHR2YXIgcCA9IFt4LCB5eV07XHJcblx0XHR2YXIgcGtleSA9IHRoaXMuX3BvaW50S2V5KHApO1xyXG5cdFx0Y29ubmVjdGVkW3BrZXldID0gcDtcclxuXHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRbcGtleV07XHJcblx0fVxyXG5cdGlmIChjb25uZWN0aW9uQ2FsbGJhY2sgJiYgYVsxXSA8IGJbMV0pIHtcclxuXHRcdGNvbm5lY3Rpb25DYWxsYmFjayhbYlswXSwgYVsxXV0sIFtiWzBdLCBiWzFdXSk7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX2ZyZWVTcGFjZSA9IGZ1bmN0aW9uKHgsIHksIHZhbHVlKSB7XHJcblx0cmV0dXJuIHggPj0gMCAmJiB4IDwgdGhpcy5fd2lkdGggJiYgeSA+PSAwICYmIHkgPCB0aGlzLl9oZWlnaHQgJiYgdGhpcy5fbWFwW3hdW3ldID09IHZhbHVlO1xyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX3BvaW50S2V5ID0gZnVuY3Rpb24ocCkge1xyXG5cdHJldHVybiBwWzBdICsgXCIuXCIgKyBwWzFdO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIER1bmdlb24gbWFwOiBoYXMgcm9vbXMgYW5kIGNvcnJpZG9yc1xyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKi9cclxuUk9ULk1hcC5EdW5nZW9uID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHR0aGlzLl9yb29tcyA9IFtdOyAvKiBsaXN0IG9mIGFsbCByb29tcyAqL1xyXG5cdHRoaXMuX2NvcnJpZG9ycyA9IFtdO1xyXG59O1xyXG5ST1QuTWFwLkR1bmdlb24uZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbGwgZ2VuZXJhdGVkIHJvb21zXHJcbiAqIEByZXR1cm5zIHtST1QuTWFwLkZlYXR1cmUuUm9vbVtdfVxyXG4gKi9cclxuUk9ULk1hcC5EdW5nZW9uLnByb3RvdHlwZS5nZXRSb29tcyA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9yb29tcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgYWxsIGdlbmVyYXRlZCBjb3JyaWRvcnNcclxuICogQHJldHVybnMge1JPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcltdfVxyXG4gKi9cclxuUk9ULk1hcC5EdW5nZW9uLnByb3RvdHlwZS5nZXRDb3JyaWRvcnMgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fY29ycmlkb3JzO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFJhbmRvbSBkdW5nZW9uIGdlbmVyYXRvciB1c2luZyBodW1hbi1saWtlIGRpZ2dpbmcgcGF0dGVybnMuXHJcbiAqIEhlYXZpbHkgYmFzZWQgb24gTWlrZSBBbmRlcnNvbidzIGlkZWFzIGZyb20gdGhlIFwiVHlyYW50XCIgYWxnbywgbWVudGlvbmVkIGF0IFxyXG4gKiBodHRwOi8vd3d3LnJvZ3VlYmFzaW4ucm9ndWVsaWtlZGV2ZWxvcG1lbnQub3JnL2luZGV4LnBocD90aXRsZT1EdW5nZW9uLUJ1aWxkaW5nX0FsZ29yaXRobS5cclxuICogQGF1Z21lbnRzIFJPVC5NYXAuRHVuZ2VvblxyXG4gKi9cclxuUk9ULk1hcC5EaWdnZXIgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0Uk9ULk1hcC5EdW5nZW9uLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblx0XHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdHJvb21XaWR0aDogWzMsIDldLCAvKiByb29tIG1pbmltdW0gYW5kIG1heGltdW0gd2lkdGggKi9cclxuXHRcdHJvb21IZWlnaHQ6IFszLCA1XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIGhlaWdodCAqL1xyXG5cdFx0Y29ycmlkb3JMZW5ndGg6IFszLCAxMF0sIC8qIGNvcnJpZG9yIG1pbmltdW0gYW5kIG1heGltdW0gbGVuZ3RoICovXHJcblx0XHRkdWdQZXJjZW50YWdlOiAwLjIsIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBwZXJjZW50YWdlIG9mIGxldmVsIGFyZWEgaGFzIGJlZW4gZHVnIG91dCAqL1xyXG5cdFx0dGltZUxpbWl0OiAxMDAwIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBtdWNoIHRpbWUgaGFzIHBhc3NlZCAobXNlYykgKi9cclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cdFxyXG5cdHRoaXMuX2ZlYXR1cmVzID0ge1xyXG5cdFx0XCJSb29tXCI6IDQsXHJcblx0XHRcIkNvcnJpZG9yXCI6IDRcclxuXHR9O1xyXG5cdHRoaXMuX2ZlYXR1cmVBdHRlbXB0cyA9IDIwOyAvKiBob3cgbWFueSB0aW1lcyBkbyB3ZSB0cnkgdG8gY3JlYXRlIGEgZmVhdHVyZSBvbiBhIHN1aXRhYmxlIHdhbGwgKi9cclxuXHR0aGlzLl93YWxscyA9IHt9OyAvKiB0aGVzZSBhcmUgYXZhaWxhYmxlIGZvciBkaWdnaW5nICovXHJcblx0XHJcblx0dGhpcy5fZGlnQ2FsbGJhY2sgPSB0aGlzLl9kaWdDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG5cdHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2sgPSB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5faXNXYWxsQ2FsbGJhY2sgPSB0aGlzLl9pc1dhbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG5cdHRoaXMuX3ByaW9yaXR5V2FsbENhbGxiYWNrID0gdGhpcy5fcHJpb3JpdHlXYWxsQ2FsbGJhY2suYmluZCh0aGlzKTtcclxufTtcclxuUk9ULk1hcC5EaWdnZXIuZXh0ZW5kKFJPVC5NYXAuRHVuZ2Vvbik7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbWFwXHJcbiAqIEBzZWUgUk9ULk1hcCNjcmVhdGVcclxuICovXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHRoaXMuX3Jvb21zID0gW107XHJcblx0dGhpcy5fY29ycmlkb3JzID0gW107XHJcblx0dGhpcy5fbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcclxuXHR0aGlzLl93YWxscyA9IHt9O1xyXG5cdHRoaXMuX2R1ZyA9IDA7XHJcblx0dmFyIGFyZWEgPSAodGhpcy5fd2lkdGgtMikgKiAodGhpcy5faGVpZ2h0LTIpO1xyXG5cclxuXHR0aGlzLl9maXJzdFJvb20oKTtcclxuXHRcclxuXHR2YXIgdDEgPSBEYXRlLm5vdygpO1xyXG5cclxuXHRkbyB7XHJcblx0XHR2YXIgdDIgPSBEYXRlLm5vdygpO1xyXG5cdFx0aWYgKHQyIC0gdDEgPiB0aGlzLl9vcHRpb25zLnRpbWVMaW1pdCkgeyBicmVhazsgfVxyXG5cclxuXHRcdC8qIGZpbmQgYSBnb29kIHdhbGwgKi9cclxuXHRcdHZhciB3YWxsID0gdGhpcy5fZmluZFdhbGwoKTtcclxuXHRcdGlmICghd2FsbCkgeyBicmVhazsgfSAvKiBubyBtb3JlIHdhbGxzICovXHJcblx0XHRcclxuXHRcdHZhciBwYXJ0cyA9IHdhbGwuc3BsaXQoXCIsXCIpO1xyXG5cdFx0dmFyIHggPSBwYXJzZUludChwYXJ0c1swXSk7XHJcblx0XHR2YXIgeSA9IHBhcnNlSW50KHBhcnRzWzFdKTtcclxuXHRcdHZhciBkaXIgPSB0aGlzLl9nZXREaWdnaW5nRGlyZWN0aW9uKHgsIHkpO1xyXG5cdFx0aWYgKCFkaXIpIHsgY29udGludWU7IH0gLyogdGhpcyB3YWxsIGlzIG5vdCBzdWl0YWJsZSAqL1xyXG5cdFx0XHJcbi8vXHRcdGNvbnNvbGUubG9nKFwid2FsbFwiLCB4LCB5KTtcclxuXHJcblx0XHQvKiB0cnkgYWRkaW5nIGEgZmVhdHVyZSAqL1xyXG5cdFx0dmFyIGZlYXR1cmVBdHRlbXB0cyA9IDA7XHJcblx0XHRkbyB7XHJcblx0XHRcdGZlYXR1cmVBdHRlbXB0cysrO1xyXG5cdFx0XHRpZiAodGhpcy5fdHJ5RmVhdHVyZSh4LCB5LCBkaXJbMF0sIGRpclsxXSkpIHsgLyogZmVhdHVyZSBhZGRlZCAqL1xyXG5cdFx0XHRcdC8vaWYgKHRoaXMuX3Jvb21zLmxlbmd0aCArIHRoaXMuX2NvcnJpZG9ycy5sZW5ndGggPT0gMikgeyB0aGlzLl9yb29tc1swXS5hZGREb29yKHgsIHkpOyB9IC8qIGZpcnN0IHJvb20gb2ZpY2lhbGx5IGhhcyBkb29ycyAqL1xyXG5cdFx0XHRcdHRoaXMuX3JlbW92ZVN1cnJvdW5kaW5nV2FsbHMoeCwgeSk7XHJcblx0XHRcdFx0dGhpcy5fcmVtb3ZlU3Vycm91bmRpbmdXYWxscyh4LWRpclswXSwgeS1kaXJbMV0pO1xyXG5cdFx0XHRcdGJyZWFrOyBcclxuXHRcdFx0fVxyXG5cdFx0fSB3aGlsZSAoZmVhdHVyZUF0dGVtcHRzIDwgdGhpcy5fZmVhdHVyZUF0dGVtcHRzKTtcclxuXHRcdFxyXG5cdFx0dmFyIHByaW9yaXR5V2FsbHMgPSAwO1xyXG5cdFx0Zm9yICh2YXIgaWQgaW4gdGhpcy5fd2FsbHMpIHsgXHJcblx0XHRcdGlmICh0aGlzLl93YWxsc1tpZF0gPiAxKSB7IHByaW9yaXR5V2FsbHMrKzsgfVxyXG5cdFx0fVxyXG5cclxuXHR9IHdoaWxlICh0aGlzLl9kdWcvYXJlYSA8IHRoaXMuX29wdGlvbnMuZHVnUGVyY2VudGFnZSB8fCBwcmlvcml0eVdhbGxzKTsgLyogZml4bWUgbnVtYmVyIG9mIHByaW9yaXR5IHdhbGxzICovXHJcblxyXG5cdHRoaXMuX2FkZERvb3JzKCk7XHJcblxyXG5cdGlmIChjYWxsYmFjaykge1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX3dhbGxzID0ge307XHJcblx0dGhpcy5fbWFwID0gbnVsbDtcclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2RpZ0NhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSwgdmFsdWUpIHtcclxuXHRpZiAodmFsdWUgPT0gMCB8fCB2YWx1ZSA9PSAyKSB7IC8qIGVtcHR5ICovXHJcblx0XHR0aGlzLl9tYXBbeF1beV0gPSAwO1xyXG5cdFx0dGhpcy5fZHVnKys7XHJcblx0fSBlbHNlIHsgLyogd2FsbCAqL1xyXG5cdFx0dGhpcy5fd2FsbHNbeCtcIixcIit5XSA9IDE7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9pc1dhbGxDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5ID49IHRoaXMuX2hlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRyZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fY2FuQmVEdWdDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRpZiAoeCA8IDEgfHwgeSA8IDEgfHwgeCsxID49IHRoaXMuX3dpZHRoIHx8IHkrMSA+PSB0aGlzLl9oZWlnaHQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0cmV0dXJuICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX3ByaW9yaXR5V2FsbENhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdHRoaXMuX3dhbGxzW3grXCIsXCIreV0gPSAyO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9maXJzdFJvb20gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgY3ggPSBNYXRoLmZsb29yKHRoaXMuX3dpZHRoLzIpO1xyXG5cdHZhciBjeSA9IE1hdGguZmxvb3IodGhpcy5faGVpZ2h0LzIpO1xyXG5cdHZhciByb29tID0gUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tQ2VudGVyKGN4LCBjeSwgdGhpcy5fb3B0aW9ucyk7XHJcblx0dGhpcy5fcm9vbXMucHVzaChyb29tKTtcclxuXHRyb29tLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGEgc3VpdGFibGUgd2FsbFxyXG4gKi9cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9maW5kV2FsbCA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBwcmlvMSA9IFtdO1xyXG5cdHZhciBwcmlvMiA9IFtdO1xyXG5cdGZvciAodmFyIGlkIGluIHRoaXMuX3dhbGxzKSB7XHJcblx0XHR2YXIgcHJpbyA9IHRoaXMuX3dhbGxzW2lkXTtcclxuXHRcdGlmIChwcmlvID09IDIpIHsgXHJcblx0XHRcdHByaW8yLnB1c2goaWQpOyBcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHByaW8xLnB1c2goaWQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR2YXIgYXJyID0gKHByaW8yLmxlbmd0aCA/IHByaW8yIDogcHJpbzEpO1xyXG5cdGlmICghYXJyLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfSAvKiBubyB3YWxscyA6LyAqL1xyXG5cdFxyXG5cdHZhciBpZCA9IGFyci5yYW5kb20oKTtcclxuXHRkZWxldGUgdGhpcy5fd2FsbHNbaWRdO1xyXG5cclxuXHRyZXR1cm4gaWQ7XHJcbn07XHJcblxyXG4vKipcclxuICogVHJpZXMgYWRkaW5nIGEgZmVhdHVyZVxyXG4gKiBAcmV0dXJucyB7Ym9vbH0gd2FzIHRoaXMgYSBzdWNjZXNzZnVsIHRyeT9cclxuICovXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fdHJ5RmVhdHVyZSA9IGZ1bmN0aW9uKHgsIHksIGR4LCBkeSkge1xyXG5cdHZhciBmZWF0dXJlID0gUk9ULlJORy5nZXRXZWlnaHRlZFZhbHVlKHRoaXMuX2ZlYXR1cmVzKTtcclxuXHRmZWF0dXJlID0gUk9ULk1hcC5GZWF0dXJlW2ZlYXR1cmVdLmNyZWF0ZVJhbmRvbUF0KHgsIHksIGR4LCBkeSwgdGhpcy5fb3B0aW9ucyk7XHJcblx0XHJcblx0aWYgKCFmZWF0dXJlLmlzVmFsaWQodGhpcy5faXNXYWxsQ2FsbGJhY2ssIHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2spKSB7XHJcbi8vXHRcdGNvbnNvbGUubG9nKFwibm90IHZhbGlkXCIpO1xyXG4vL1x0XHRmZWF0dXJlLmRlYnVnKCk7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cdFxyXG5cdGZlYXR1cmUuY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcclxuLy9cdGZlYXR1cmUuZGVidWcoKTtcclxuXHJcblx0aWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBST1QuTWFwLkZlYXR1cmUuUm9vbSkgeyB0aGlzLl9yb29tcy5wdXNoKGZlYXR1cmUpOyB9XHJcblx0aWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IpIHsgXHJcblx0XHRmZWF0dXJlLmNyZWF0ZVByaW9yaXR5V2FsbHModGhpcy5fcHJpb3JpdHlXYWxsQ2FsbGJhY2spO1xyXG5cdFx0dGhpcy5fY29ycmlkb3JzLnB1c2goZmVhdHVyZSk7IFxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fcmVtb3ZlU3Vycm91bmRpbmdXYWxscyA9IGZ1bmN0aW9uKGN4LCBjeSkge1xyXG5cdHZhciBkZWx0YXMgPSBST1QuRElSU1s0XTtcclxuXHJcblx0Zm9yICh2YXIgaT0wO2k8ZGVsdGFzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBkZWx0YSA9IGRlbHRhc1tpXTtcclxuXHRcdHZhciB4ID0gY3ggKyBkZWx0YVswXTtcclxuXHRcdHZhciB5ID0gY3kgKyBkZWx0YVsxXTtcclxuXHRcdGRlbGV0ZSB0aGlzLl93YWxsc1t4K1wiLFwiK3ldO1xyXG5cdFx0dmFyIHggPSBjeCArIDIqZGVsdGFbMF07XHJcblx0XHR2YXIgeSA9IGN5ICsgMipkZWx0YVsxXTtcclxuXHRcdGRlbGV0ZSB0aGlzLl93YWxsc1t4K1wiLFwiK3ldO1xyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHZlY3RvciBpbiBcImRpZ2dpbmdcIiBkaXJlY3Rpb24sIG9yIGZhbHNlLCBpZiB0aGlzIGRvZXMgbm90IGV4aXN0IChvciBpcyBub3QgdW5pcXVlKVxyXG4gKi9cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9nZXREaWdnaW5nRGlyZWN0aW9uID0gZnVuY3Rpb24oY3gsIGN5KSB7XHJcblx0aWYgKGN4IDw9IDAgfHwgY3kgPD0gMCB8fCBjeCA+PSB0aGlzLl93aWR0aCAtIDEgfHwgY3kgPj0gdGhpcy5faGVpZ2h0IC0gMSkgeyByZXR1cm4gbnVsbDsgfVxyXG5cclxuXHR2YXIgcmVzdWx0ID0gbnVsbDtcclxuXHR2YXIgZGVsdGFzID0gUk9ULkRJUlNbNF07XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8ZGVsdGFzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBkZWx0YSA9IGRlbHRhc1tpXTtcclxuXHRcdHZhciB4ID0gY3ggKyBkZWx0YVswXTtcclxuXHRcdHZhciB5ID0gY3kgKyBkZWx0YVsxXTtcclxuXHRcdFxyXG5cdFx0aWYgKCF0aGlzLl9tYXBbeF1beV0pIHsgLyogdGhlcmUgYWxyZWFkeSBpcyBhbm90aGVyIGVtcHR5IG5laWdoYm9yISAqL1xyXG5cdFx0XHRpZiAocmVzdWx0KSB7IHJldHVybiBudWxsOyB9XHJcblx0XHRcdHJlc3VsdCA9IGRlbHRhO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvKiBubyBlbXB0eSBuZWlnaGJvciAqL1xyXG5cdGlmICghcmVzdWx0KSB7IHJldHVybiBudWxsOyB9XHJcblx0XHJcblx0cmV0dXJuIFstcmVzdWx0WzBdLCAtcmVzdWx0WzFdXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGaW5kIGVtcHR5IHNwYWNlcyBzdXJyb3VuZGluZyByb29tcywgYW5kIGFwcGx5IGRvb3JzLlxyXG4gKi9cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9hZGREb29ycyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBkYXRhID0gdGhpcy5fbWFwO1xyXG5cdHZhciBpc1dhbGxDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRcdHJldHVybiAoZGF0YVt4XVt5XSA9PSAxKTtcclxuXHR9O1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fcm9vbXMubGVuZ3RoOyBpKysgKSB7XHJcblx0XHR2YXIgcm9vbSA9IHRoaXMuX3Jvb21zW2ldO1xyXG5cdFx0cm9vbS5jbGVhckRvb3JzKCk7XHJcblx0XHRyb29tLmFkZERvb3JzKGlzV2FsbENhbGxiYWNrKTtcclxuXHR9XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgRHVuZ2VvbiBnZW5lcmF0b3Igd2hpY2ggdHJpZXMgdG8gZmlsbCB0aGUgc3BhY2UgZXZlbmx5LiBHZW5lcmF0ZXMgaW5kZXBlbmRlbnQgcm9vbXMgYW5kIHRyaWVzIHRvIGNvbm5lY3QgdGhlbS5cclxuICogQGF1Z21lbnRzIFJPVC5NYXAuRHVuZ2VvblxyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xyXG5cdFJPVC5NYXAuRHVuZ2Vvbi5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0cm9vbVdpZHRoOiBbMywgOV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSB3aWR0aCAqL1xyXG5cdFx0cm9vbUhlaWdodDogWzMsIDVdLCAvKiByb29tIG1pbmltdW0gYW5kIG1heGltdW0gaGVpZ2h0ICovXHJcblx0XHRyb29tRHVnUGVyY2VudGFnZTogMC4xLCAvKiB3ZSBzdG9wIGFmdGVyIHRoaXMgcGVyY2VudGFnZSBvZiBsZXZlbCBhcmVhIGhhcyBiZWVuIGR1ZyBvdXQgYnkgcm9vbXMgKi9cclxuXHRcdHRpbWVMaW1pdDogMTAwMCAvKiB3ZSBzdG9wIGFmdGVyIHRoaXMgbXVjaCB0aW1lIGhhcyBwYXNzZWQgKG1zZWMpICovXHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHJcblx0dGhpcy5fcm9vbUF0dGVtcHRzID0gMjA7IC8qIG5ldyByb29tIGlzIGNyZWF0ZWQgTi10aW1lcyB1bnRpbCBpcyBjb25zaWRlcmVkIGFzIGltcG9zc2libGUgdG8gZ2VuZXJhdGUgKi9cclxuXHR0aGlzLl9jb3JyaWRvckF0dGVtcHRzID0gMjA7IC8qIGNvcnJpZG9ycyBhcmUgdHJpZWQgTi10aW1lcyB1bnRpbCB0aGUgbGV2ZWwgaXMgY29uc2lkZXJlZCBhcyBpbXBvc3NpYmxlIHRvIGNvbm5lY3QgKi9cclxuXHJcblx0dGhpcy5fY29ubmVjdGVkID0gW107IC8qIGxpc3Qgb2YgYWxyZWFkeSBjb25uZWN0ZWQgcm9vbXMgKi9cclxuXHR0aGlzLl91bmNvbm5lY3RlZCA9IFtdOyAvKiBsaXN0IG9mIHJlbWFpbmluZyB1bmNvbm5lY3RlZCByb29tcyAqL1xyXG5cdFxyXG5cdHRoaXMuX2RpZ0NhbGxiYWNrID0gdGhpcy5fZGlnQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHR0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrID0gdGhpcy5fY2FuQmVEdWdDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG5cdHRoaXMuX2lzV2FsbENhbGxiYWNrID0gdGhpcy5faXNXYWxsQ2FsbGJhY2suYmluZCh0aGlzKTtcclxufTtcclxuUk9ULk1hcC5Vbmlmb3JtLmV4dGVuZChST1QuTWFwLkR1bmdlb24pO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIG1hcC4gSWYgdGhlIHRpbWUgbGltaXQgaGFzIGJlZW4gaGl0LCByZXR1cm5zIG51bGwuXHJcbiAqIEBzZWUgUk9ULk1hcCNjcmVhdGVcclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR2YXIgdDEgPSBEYXRlLm5vdygpO1xyXG5cdHdoaWxlICgxKSB7XHJcblx0XHR2YXIgdDIgPSBEYXRlLm5vdygpO1xyXG5cdFx0aWYgKHQyIC0gdDEgPiB0aGlzLl9vcHRpb25zLnRpbWVMaW1pdCkgeyByZXR1cm4gbnVsbDsgfSAvKiB0aW1lIGxpbWl0ISAqL1xyXG5cdFxyXG5cdFx0dGhpcy5fbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcclxuXHRcdHRoaXMuX2R1ZyA9IDA7XHJcblx0XHR0aGlzLl9yb29tcyA9IFtdO1xyXG5cdFx0dGhpcy5fdW5jb25uZWN0ZWQgPSBbXTtcclxuXHRcdHRoaXMuX2dlbmVyYXRlUm9vbXMoKTtcclxuXHRcdGlmICh0aGlzLl9yb29tcy5sZW5ndGggPCAyKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRpZiAodGhpcy5fZ2VuZXJhdGVDb3JyaWRvcnMoKSkgeyBicmVhazsgfVxyXG5cdH1cclxuXHRcclxuXHRpZiAoY2FsbGJhY2spIHtcclxuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xyXG5cdFx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soaSwgaiwgdGhpcy5fbWFwW2ldW2pdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgYSBzdWl0YWJsZSBhbW91bnQgb2Ygcm9vbXNcclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2dlbmVyYXRlUm9vbXMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgdyA9IHRoaXMuX3dpZHRoLTI7XHJcblx0dmFyIGggPSB0aGlzLl9oZWlnaHQtMjtcclxuXHJcblx0ZG8ge1xyXG5cdFx0dmFyIHJvb20gPSB0aGlzLl9nZW5lcmF0ZVJvb20oKTtcclxuXHRcdGlmICh0aGlzLl9kdWcvKHcqaCkgPiB0aGlzLl9vcHRpb25zLnJvb21EdWdQZXJjZW50YWdlKSB7IGJyZWFrOyB9IC8qIGFjaGlldmVkIHJlcXVlc3RlZCBhbW91bnQgb2YgZnJlZSBzcGFjZSAqL1xyXG5cdH0gd2hpbGUgKHJvb20pO1xyXG5cclxuXHQvKiBlaXRoZXIgZW5vdWdoIHJvb21zLCBvciBub3QgYWJsZSB0byBnZW5lcmF0ZSBtb3JlIG9mIHRoZW0gOikgKi9cclxufTtcclxuXHJcbi8qKlxyXG4gKiBUcnkgdG8gZ2VuZXJhdGUgb25lIHJvb21cclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2dlbmVyYXRlUm9vbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBjb3VudCA9IDA7XHJcblx0d2hpbGUgKGNvdW50IDwgdGhpcy5fcm9vbUF0dGVtcHRzKSB7XHJcblx0XHRjb3VudCsrO1xyXG5cdFx0XHJcblx0XHR2YXIgcm9vbSA9IFJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbSh0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCB0aGlzLl9vcHRpb25zKTtcclxuXHRcdGlmICghcm9vbS5pc1ZhbGlkKHRoaXMuX2lzV2FsbENhbGxiYWNrLCB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrKSkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHJcblx0XHRyb29tLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XHJcblx0XHR0aGlzLl9yb29tcy5wdXNoKHJvb20pO1xyXG5cdFx0cmV0dXJuIHJvb207XHJcblx0fSBcclxuXHJcblx0Lyogbm8gcm9vbSB3YXMgZ2VuZXJhdGVkIGluIGEgZ2l2ZW4gbnVtYmVyIG9mIGF0dGVtcHRzICovXHJcblx0cmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG4vKipcclxuICogR2VuZXJhdGVzIGNvbm5lY3RvcnMgYmV3ZWVuIHJvb21zXHJcbiAqIEByZXR1cm5zIHtib29sfSBzdWNjZXNzIFdhcyB0aGlzIGF0dGVtcHQgc3VjY2Vzc2Z1bGw/XHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9nZW5lcmF0ZUNvcnJpZG9ycyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBjbnQgPSAwO1xyXG5cdHdoaWxlIChjbnQgPCB0aGlzLl9jb3JyaWRvckF0dGVtcHRzKSB7XHJcblx0XHRjbnQrKztcclxuXHRcdHRoaXMuX2NvcnJpZG9ycyA9IFtdO1xyXG5cclxuXHRcdC8qIGRpZyByb29tcyBpbnRvIGEgY2xlYXIgbWFwICovXHJcblx0XHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fcm9vbXMubGVuZ3RoO2krKykgeyBcclxuXHRcdFx0dmFyIHJvb20gPSB0aGlzLl9yb29tc1tpXTtcclxuXHRcdFx0cm9vbS5jbGVhckRvb3JzKCk7XHJcblx0XHRcdHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTsgXHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fdW5jb25uZWN0ZWQgPSB0aGlzLl9yb29tcy5zbGljZSgpLnJhbmRvbWl6ZSgpO1xyXG5cdFx0dGhpcy5fY29ubmVjdGVkID0gW107XHJcblx0XHRpZiAodGhpcy5fdW5jb25uZWN0ZWQubGVuZ3RoKSB7IHRoaXMuX2Nvbm5lY3RlZC5wdXNoKHRoaXMuX3VuY29ubmVjdGVkLnBvcCgpKTsgfSAvKiBmaXJzdCBvbmUgaXMgYWx3YXlzIGNvbm5lY3RlZCAqL1xyXG5cdFx0XHJcblx0XHR3aGlsZSAoMSkge1xyXG5cdFx0XHQvKiAxLiBwaWNrIHJhbmRvbSBjb25uZWN0ZWQgcm9vbSAqL1xyXG5cdFx0XHR2YXIgY29ubmVjdGVkID0gdGhpcy5fY29ubmVjdGVkLnJhbmRvbSgpO1xyXG5cdFx0XHRcclxuXHRcdFx0LyogMi4gZmluZCBjbG9zZXN0IHVuY29ubmVjdGVkICovXHJcblx0XHRcdHZhciByb29tMSA9IHRoaXMuX2Nsb3Nlc3RSb29tKHRoaXMuX3VuY29ubmVjdGVkLCBjb25uZWN0ZWQpO1xyXG5cdFx0XHRcclxuXHRcdFx0LyogMy4gY29ubmVjdCBpdCB0byBjbG9zZXN0IGNvbm5lY3RlZCAqL1xyXG5cdFx0XHR2YXIgcm9vbTIgPSB0aGlzLl9jbG9zZXN0Um9vbSh0aGlzLl9jb25uZWN0ZWQsIHJvb20xKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBvayA9IHRoaXMuX2Nvbm5lY3RSb29tcyhyb29tMSwgcm9vbTIpO1xyXG5cdFx0XHRpZiAoIW9rKSB7IGJyZWFrOyB9IC8qIHN0b3AgY29ubmVjdGluZywgcmUtc2h1ZmZsZSAqL1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCF0aGlzLl91bmNvbm5lY3RlZC5sZW5ndGgpIHsgcmV0dXJuIHRydWU7IH0gLyogZG9uZTsgbm8gcm9vbXMgcmVtYWluICovXHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGb3IgYSBnaXZlbiByb29tLCBmaW5kIHRoZSBjbG9zZXN0IG9uZSBmcm9tIHRoZSBsaXN0XHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9jbG9zZXN0Um9vbSA9IGZ1bmN0aW9uKHJvb21zLCByb29tKSB7XHJcblx0dmFyIGRpc3QgPSBJbmZpbml0eTtcclxuXHR2YXIgY2VudGVyID0gcm9vbS5nZXRDZW50ZXIoKTtcclxuXHR2YXIgcmVzdWx0ID0gbnVsbDtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTxyb29tcy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgciA9IHJvb21zW2ldO1xyXG5cdFx0dmFyIGMgPSByLmdldENlbnRlcigpO1xyXG5cdFx0dmFyIGR4ID0gY1swXS1jZW50ZXJbMF07XHJcblx0XHR2YXIgZHkgPSBjWzFdLWNlbnRlclsxXTtcclxuXHRcdHZhciBkID0gZHgqZHgrZHkqZHk7XHJcblx0XHRcclxuXHRcdGlmIChkIDwgZGlzdCkge1xyXG5cdFx0XHRkaXN0ID0gZDtcclxuXHRcdFx0cmVzdWx0ID0gcjtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2Nvbm5lY3RSb29tcyA9IGZ1bmN0aW9uKHJvb20xLCByb29tMikge1xyXG5cdC8qXHJcblx0XHRyb29tMS5kZWJ1ZygpO1xyXG5cdFx0cm9vbTIuZGVidWcoKTtcclxuXHQqL1xyXG5cclxuXHR2YXIgY2VudGVyMSA9IHJvb20xLmdldENlbnRlcigpO1xyXG5cdHZhciBjZW50ZXIyID0gcm9vbTIuZ2V0Q2VudGVyKCk7XHJcblxyXG5cdHZhciBkaWZmWCA9IGNlbnRlcjJbMF0gLSBjZW50ZXIxWzBdO1xyXG5cdHZhciBkaWZmWSA9IGNlbnRlcjJbMV0gLSBjZW50ZXIxWzFdO1xyXG5cclxuXHRpZiAoTWF0aC5hYnMoZGlmZlgpIDwgTWF0aC5hYnMoZGlmZlkpKSB7IC8qIGZpcnN0IHRyeSBjb25uZWN0aW5nIG5vcnRoLXNvdXRoIHdhbGxzICovXHJcblx0XHR2YXIgZGlySW5kZXgxID0gKGRpZmZZID4gMCA/IDIgOiAwKTtcclxuXHRcdHZhciBkaXJJbmRleDIgPSAoZGlySW5kZXgxICsgMikgJSA0O1xyXG5cdFx0dmFyIG1pbiA9IHJvb20yLmdldExlZnQoKTtcclxuXHRcdHZhciBtYXggPSByb29tMi5nZXRSaWdodCgpO1xyXG5cdFx0dmFyIGluZGV4ID0gMDtcclxuXHR9IGVsc2UgeyAvKiBmaXJzdCB0cnkgY29ubmVjdGluZyBlYXN0LXdlc3Qgd2FsbHMgKi9cclxuXHRcdHZhciBkaXJJbmRleDEgPSAoZGlmZlggPiAwID8gMSA6IDMpO1xyXG5cdFx0dmFyIGRpckluZGV4MiA9IChkaXJJbmRleDEgKyAyKSAlIDQ7XHJcblx0XHR2YXIgbWluID0gcm9vbTIuZ2V0VG9wKCk7XHJcblx0XHR2YXIgbWF4ID0gcm9vbTIuZ2V0Qm90dG9tKCk7XHJcblx0XHR2YXIgaW5kZXggPSAxO1xyXG5cdH1cclxuXHJcblx0dmFyIHN0YXJ0ID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTEsIGRpckluZGV4MSk7IC8qIGNvcnJpZG9yIHdpbGwgc3RhcnQgaGVyZSAqL1xyXG5cdGlmICghc3RhcnQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG5cdGlmIChzdGFydFtpbmRleF0gPj0gbWluICYmIHN0YXJ0W2luZGV4XSA8PSBtYXgpIHsgLyogcG9zc2libGUgdG8gY29ubmVjdCB3aXRoIHN0cmFpZ2h0IGxpbmUgKEktbGlrZSkgKi9cclxuXHRcdHZhciBlbmQgPSBzdGFydC5zbGljZSgpO1xyXG5cdFx0dmFyIHZhbHVlID0gbnVsbDtcclxuXHRcdHN3aXRjaCAoZGlySW5kZXgyKSB7XHJcblx0XHRcdGNhc2UgMDogdmFsdWUgPSByb29tMi5nZXRUb3AoKS0xOyBicmVhaztcclxuXHRcdFx0Y2FzZSAxOiB2YWx1ZSA9IHJvb20yLmdldFJpZ2h0KCkrMTsgYnJlYWs7XHJcblx0XHRcdGNhc2UgMjogdmFsdWUgPSByb29tMi5nZXRCb3R0b20oKSsxOyBicmVhaztcclxuXHRcdFx0Y2FzZSAzOiB2YWx1ZSA9IHJvb20yLmdldExlZnQoKS0xOyBicmVhaztcclxuXHRcdH1cclxuXHRcdGVuZFsoaW5kZXgrMSklMl0gPSB2YWx1ZTtcclxuXHRcdHRoaXMuX2RpZ0xpbmUoW3N0YXJ0LCBlbmRdKTtcclxuXHRcdFxyXG5cdH0gZWxzZSBpZiAoc3RhcnRbaW5kZXhdIDwgbWluLTEgfHwgc3RhcnRbaW5kZXhdID4gbWF4KzEpIHsgLyogbmVlZCB0byBzd2l0Y2ggdGFyZ2V0IHdhbGwgKEwtbGlrZSkgKi9cclxuXHJcblx0XHR2YXIgZGlmZiA9IHN0YXJ0W2luZGV4XSAtIGNlbnRlcjJbaW5kZXhdO1xyXG5cdFx0c3dpdGNoIChkaXJJbmRleDIpIHtcclxuXHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRjYXNlIDE6XHR2YXIgcm90YXRpb24gPSAoZGlmZiA8IDAgPyAzIDogMSk7IGJyZWFrO1xyXG5cdFx0XHRjYXNlIDI6XHJcblx0XHRcdGNhc2UgMzpcdHZhciByb3RhdGlvbiA9IChkaWZmIDwgMCA/IDEgOiAzKTsgYnJlYWs7XHJcblx0XHR9XHJcblx0XHRkaXJJbmRleDIgPSAoZGlySW5kZXgyICsgcm90YXRpb24pICUgNDtcclxuXHRcdFxyXG5cdFx0dmFyIGVuZCA9IHRoaXMuX3BsYWNlSW5XYWxsKHJvb20yLCBkaXJJbmRleDIpO1xyXG5cdFx0aWYgKCFlbmQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG5cdFx0dmFyIG1pZCA9IFswLCAwXTtcclxuXHRcdG1pZFtpbmRleF0gPSBzdGFydFtpbmRleF07XHJcblx0XHR2YXIgaW5kZXgyID0gKGluZGV4KzEpJTI7XHJcblx0XHRtaWRbaW5kZXgyXSA9IGVuZFtpbmRleDJdO1xyXG5cdFx0dGhpcy5fZGlnTGluZShbc3RhcnQsIG1pZCwgZW5kXSk7XHJcblx0XHRcclxuXHR9IGVsc2UgeyAvKiB1c2UgY3VycmVudCB3YWxsIHBhaXIsIGJ1dCBhZGp1c3QgdGhlIGxpbmUgaW4gdGhlIG1pZGRsZSAoUy1saWtlKSAqL1xyXG5cdFxyXG5cdFx0dmFyIGluZGV4MiA9IChpbmRleCsxKSUyO1xyXG5cdFx0dmFyIGVuZCA9IHRoaXMuX3BsYWNlSW5XYWxsKHJvb20yLCBkaXJJbmRleDIpO1xyXG5cdFx0aWYgKCFlbmQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHR2YXIgbWlkID0gTWF0aC5yb3VuZCgoZW5kW2luZGV4Ml0gKyBzdGFydFtpbmRleDJdKS8yKTtcclxuXHJcblx0XHR2YXIgbWlkMSA9IFswLCAwXTtcclxuXHRcdHZhciBtaWQyID0gWzAsIDBdO1xyXG5cdFx0bWlkMVtpbmRleF0gPSBzdGFydFtpbmRleF07XHJcblx0XHRtaWQxW2luZGV4Ml0gPSBtaWQ7XHJcblx0XHRtaWQyW2luZGV4XSA9IGVuZFtpbmRleF07XHJcblx0XHRtaWQyW2luZGV4Ml0gPSBtaWQ7XHJcblx0XHR0aGlzLl9kaWdMaW5lKFtzdGFydCwgbWlkMSwgbWlkMiwgZW5kXSk7XHJcblx0fVxyXG5cclxuXHRyb29tMS5hZGREb29yKHN0YXJ0WzBdLCBzdGFydFsxXSk7XHJcblx0cm9vbTIuYWRkRG9vcihlbmRbMF0sIGVuZFsxXSk7XHJcblx0XHJcblx0dmFyIGluZGV4ID0gdGhpcy5fdW5jb25uZWN0ZWQuaW5kZXhPZihyb29tMSk7XHJcblx0aWYgKGluZGV4ICE9IC0xKSB7XHJcblx0XHR0aGlzLl91bmNvbm5lY3RlZC5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0dGhpcy5fY29ubmVjdGVkLnB1c2gocm9vbTEpO1xyXG5cdH1cclxuXHJcblx0dmFyIGluZGV4ID0gdGhpcy5fdW5jb25uZWN0ZWQuaW5kZXhPZihyb29tMik7XHJcblx0aWYgKGluZGV4ICE9IC0xKSB7XHJcblx0XHR0aGlzLl91bmNvbm5lY3RlZC5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0dGhpcy5fY29ubmVjdGVkLnB1c2gocm9vbTIpO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX3BsYWNlSW5XYWxsID0gZnVuY3Rpb24ocm9vbSwgZGlySW5kZXgpIHtcclxuXHR2YXIgc3RhcnQgPSBbMCwgMF07XHJcblx0dmFyIGRpciA9IFswLCAwXTtcclxuXHR2YXIgbGVuZ3RoID0gMDtcclxuXHRcclxuXHRzd2l0Y2ggKGRpckluZGV4KSB7XHJcblx0XHRjYXNlIDA6XHJcblx0XHRcdGRpciA9IFsxLCAwXTtcclxuXHRcdFx0c3RhcnQgPSBbcm9vbS5nZXRMZWZ0KCksIHJvb20uZ2V0VG9wKCktMV07XHJcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0UmlnaHQoKS1yb29tLmdldExlZnQoKSsxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDE6XHJcblx0XHRcdGRpciA9IFswLCAxXTtcclxuXHRcdFx0c3RhcnQgPSBbcm9vbS5nZXRSaWdodCgpKzEsIHJvb20uZ2V0VG9wKCldO1xyXG5cdFx0XHRsZW5ndGggPSByb29tLmdldEJvdHRvbSgpLXJvb20uZ2V0VG9wKCkrMTtcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAyOlxyXG5cdFx0XHRkaXIgPSBbMSwgMF07XHJcblx0XHRcdHN0YXJ0ID0gW3Jvb20uZ2V0TGVmdCgpLCByb29tLmdldEJvdHRvbSgpKzFdO1xyXG5cdFx0XHRsZW5ndGggPSByb29tLmdldFJpZ2h0KCktcm9vbS5nZXRMZWZ0KCkrMTtcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAzOlxyXG5cdFx0XHRkaXIgPSBbMCwgMV07XHJcblx0XHRcdHN0YXJ0ID0gW3Jvb20uZ2V0TGVmdCgpLTEsIHJvb20uZ2V0VG9wKCldO1xyXG5cdFx0XHRsZW5ndGggPSByb29tLmdldEJvdHRvbSgpLXJvb20uZ2V0VG9wKCkrMTtcclxuXHRcdGJyZWFrO1xyXG5cdH1cclxuXHRcclxuXHR2YXIgYXZhaWwgPSBbXTtcclxuXHR2YXIgbGFzdEJhZEluZGV4ID0gLTI7XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPGxlbmd0aDtpKyspIHtcclxuXHRcdHZhciB4ID0gc3RhcnRbMF0gKyBpKmRpclswXTtcclxuXHRcdHZhciB5ID0gc3RhcnRbMV0gKyBpKmRpclsxXTtcclxuXHRcdGF2YWlsLnB1c2gobnVsbCk7XHJcblx0XHRcclxuXHRcdHZhciBpc1dhbGwgPSAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xyXG5cdFx0aWYgKGlzV2FsbCkge1xyXG5cdFx0XHRpZiAobGFzdEJhZEluZGV4ICE9IGktMSkgeyBhdmFpbFtpXSA9IFt4LCB5XTsgfVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGFzdEJhZEluZGV4ID0gaTtcclxuXHRcdFx0aWYgKGkpIHsgYXZhaWxbaS0xXSA9IG51bGw7IH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT1hdmFpbC5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XHJcblx0XHRpZiAoIWF2YWlsW2ldKSB7IGF2YWlsLnNwbGljZShpLCAxKTsgfVxyXG5cdH1cclxuXHRyZXR1cm4gKGF2YWlsLmxlbmd0aCA/IGF2YWlsLnJhbmRvbSgpIDogbnVsbCk7XHJcbn07XHJcblxyXG4vKipcclxuICogRGlnIGEgcG9seWxpbmUuXHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9kaWdMaW5lID0gZnVuY3Rpb24ocG9pbnRzKSB7XHJcblx0Zm9yICh2YXIgaT0xO2k8cG9pbnRzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBzdGFydCA9IHBvaW50c1tpLTFdO1xyXG5cdFx0dmFyIGVuZCA9IHBvaW50c1tpXTtcclxuXHRcdHZhciBjb3JyaWRvciA9IG5ldyBST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3Ioc3RhcnRbMF0sIHN0YXJ0WzFdLCBlbmRbMF0sIGVuZFsxXSk7XHJcblx0XHRjb3JyaWRvci5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spO1xyXG5cdFx0dGhpcy5fY29ycmlkb3JzLnB1c2goY29ycmlkb3IpO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2RpZ0NhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSwgdmFsdWUpIHtcclxuXHR0aGlzLl9tYXBbeF1beV0gPSB2YWx1ZTtcclxuXHRpZiAodmFsdWUgPT0gMCkgeyB0aGlzLl9kdWcrKzsgfVxyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5faXNXYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0aWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPj0gdGhpcy5fd2lkdGggfHwgeSA+PSB0aGlzLl9oZWlnaHQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0cmV0dXJuICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XHJcbn07XHJcblxyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9jYW5CZUR1Z0NhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdGlmICh4IDwgMSB8fCB5IDwgMSB8fCB4KzEgPj0gdGhpcy5fd2lkdGggfHwgeSsxID49IHRoaXMuX2hlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRyZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAYXV0aG9yIGh5YWt1Z2VpXHJcbiAqIEBjbGFzcyBEdW5nZW9uIGdlbmVyYXRvciB3aGljaCB1c2VzIHRoZSBcIm9yZ2luYWxcIiBSb2d1ZSBkdW5nZW9uIGdlbmVyYXRpb24gYWxnb3JpdGhtLiBTZWUgaHR0cDovL2t1b2kuY29tL35rYW1pa2F6ZS9HYW1lRGVzaWduL2FydDA3X3JvZ3VlX2R1bmdlb24ucGhwXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwXHJcbiAqIEBwYXJhbSB7aW50fSBbd2lkdGg9Uk9ULkRFRkFVTFRfV0lEVEhdXHJcbiAqIEBwYXJhbSB7aW50fSBbaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBPcHRpb25zXHJcbiAqIEBwYXJhbSB7aW50W119IFtvcHRpb25zLmNlbGxXaWR0aD0zXSBOdW1iZXIgb2YgY2VsbHMgdG8gY3JlYXRlIG9uIHRoZSBob3Jpem9udGFsIChudW1iZXIgb2Ygcm9vbXMgaG9yaXpvbnRhbGx5KVxyXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5jZWxsSGVpZ2h0PTNdIE51bWJlciBvZiBjZWxscyB0byBjcmVhdGUgb24gdGhlIHZlcnRpY2FsIChudW1iZXIgb2Ygcm9vbXMgdmVydGljYWxseSlcclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnJvb21XaWR0aF0gUm9vbSBtaW4gYW5kIG1heCB3aWR0aCAtIG5vcm1hbGx5IHNldCBhdXRvLW1hZ2ljYWxseSB2aWEgdGhlIGNvbnN0cnVjdG9yLlxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucm9vbUhlaWdodF0gUm9vbSBtaW4gYW5kIG1heCBoZWlnaHQgLSBub3JtYWxseSBzZXQgYXV0by1tYWdpY2FsbHkgdmlhIHRoZSBjb25zdHJ1Y3Rvci5cclxuICovXHJcblJPVC5NYXAuUm9ndWUgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xyXG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdGNlbGxXaWR0aDogMywgIC8vIE5PVEUgdG8gc2VsZiwgdGhlc2UgY291bGQgcHJvYmFibHkgd29yayB0aGUgc2FtZSBhcyB0aGUgcm9vbVdpZHRoL3Jvb20gSGVpZ2h0IHZhbHVlc1xyXG5cdFx0Y2VsbEhlaWdodDogMyAgLy8gICAgIGllLiBhcyBhbiBhcnJheSB3aXRoIG1pbi1tYXggdmFsdWVzIGZvciBlYWNoIGRpcmVjdGlvbi4uLi5cclxuXHR9O1xyXG5cclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHJcblx0LypcclxuXHRTZXQgdGhlIHJvb20gc2l6ZXMgYWNjb3JkaW5nIHRvIHRoZSBvdmVyLWFsbCB3aWR0aCBvZiB0aGUgbWFwLFxyXG5cdGFuZCB0aGUgY2VsbCBzaXplcy5cclxuXHQqL1xyXG5cdGlmICghdGhpcy5fb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcInJvb21XaWR0aFwiKSkge1xyXG5cdFx0dGhpcy5fb3B0aW9uc1tcInJvb21XaWR0aFwiXSA9IHRoaXMuX2NhbGN1bGF0ZVJvb21TaXplKHRoaXMuX3dpZHRoLCB0aGlzLl9vcHRpb25zW1wiY2VsbFdpZHRoXCJdKTtcclxuXHR9XHJcblx0aWYgKCF0aGlzLl9vcHRpb25zLmhhc093blByb3BlcnR5KFwicm9vbUhlaWdodFwiKSkge1xyXG5cdFx0dGhpcy5fb3B0aW9uc1tcInJvb21IZWlnaHRcIl0gPSB0aGlzLl9jYWxjdWxhdGVSb29tU2l6ZSh0aGlzLl9oZWlnaHQsIHRoaXMuX29wdGlvbnNbXCJjZWxsSGVpZ2h0XCJdKTtcclxuXHR9XHJcblxyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuTWFwI2NyZWF0ZVxyXG4gKi9cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcblx0dGhpcy5tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xyXG5cdHRoaXMucm9vbXMgPSBbXTtcclxuXHR0aGlzLmNvbm5lY3RlZENlbGxzID0gW107XHJcblxyXG5cdHRoaXMuX2luaXRSb29tcygpO1xyXG5cdHRoaXMuX2Nvbm5lY3RSb29tcygpO1xyXG5cdHRoaXMuX2Nvbm5lY3RVbmNvbm5lY3RlZFJvb21zKCk7XHJcblx0dGhpcy5fY3JlYXRlUmFuZG9tUm9vbUNvbm5lY3Rpb25zKCk7XHJcblx0dGhpcy5fY3JlYXRlUm9vbXMoKTtcclxuXHR0aGlzLl9jcmVhdGVDb3JyaWRvcnMoKTtcclxuXHJcblx0aWYgKGNhbGxiYWNrKSB7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3dpZHRoOyBpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9oZWlnaHQ7IGorKykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMubWFwW2ldW2pdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY2FsY3VsYXRlUm9vbVNpemUgPSBmdW5jdGlvbiAoc2l6ZSwgY2VsbCkge1xyXG5cdHZhciBtYXggPSBNYXRoLmZsb29yKChzaXplL2NlbGwpICogMC44KTtcclxuXHR2YXIgbWluID0gTWF0aC5mbG9vcigoc2l6ZS9jZWxsKSAqIDAuMjUpO1xyXG5cdGlmIChtaW4gPCAyKSB7IG1pbiA9IDI7IH1cclxuXHRpZiAobWF4IDwgMikgeyBtYXggPSAyOyB9XHJcblx0cmV0dXJuIFttaW4sIG1heF07XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5faW5pdFJvb21zID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vIGNyZWF0ZSByb29tcyBhcnJheS4gVGhpcyBpcyB0aGUgXCJncmlkXCIgbGlzdCBmcm9tIHRoZSBhbGdvLlxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7IGkrKykge1xyXG5cdFx0dGhpcy5yb29tcy5wdXNoKFtdKTtcclxuXHRcdGZvcih2YXIgaiA9IDA7IGogPCB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7IGorKykge1xyXG5cdFx0XHR0aGlzLnJvb21zW2ldLnB1c2goe1wieFwiOjAsIFwieVwiOjAsIFwid2lkdGhcIjowLCBcImhlaWdodFwiOjAsIFwiY29ubmVjdGlvbnNcIjpbXSwgXCJjZWxseFwiOmksIFwiY2VsbHlcIjpqfSk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2Nvbm5lY3RSb29tcyA9IGZ1bmN0aW9uICgpIHtcclxuXHQvL3BpY2sgcmFuZG9tIHN0YXJ0aW5nIGdyaWRcclxuXHR2YXIgY2d4ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoLTEpO1xyXG5cdHZhciBjZ3kgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0LTEpO1xyXG5cclxuXHR2YXIgaWR4O1xyXG5cdHZhciBuY2d4O1xyXG5cdHZhciBuY2d5O1xyXG5cclxuXHR2YXIgZm91bmQgPSBmYWxzZTtcclxuXHR2YXIgcm9vbTtcclxuXHR2YXIgb3RoZXJSb29tO1xyXG5cclxuXHQvLyBmaW5kICB1bmNvbm5lY3RlZCBuZWlnaGJvdXIgY2VsbHNcclxuXHRkbyB7XHJcblxyXG5cdFx0Ly92YXIgZGlyVG9DaGVjayA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3XTtcclxuXHRcdHZhciBkaXJUb0NoZWNrID0gWzAsIDIsIDQsIDZdO1xyXG5cdFx0ZGlyVG9DaGVjayA9IGRpclRvQ2hlY2sucmFuZG9taXplKCk7XHJcblxyXG5cdFx0ZG8ge1xyXG5cdFx0XHRmb3VuZCA9IGZhbHNlO1xyXG5cdFx0XHRpZHggPSBkaXJUb0NoZWNrLnBvcCgpO1xyXG5cclxuXHRcdFx0bmNneCA9IGNneCArIFJPVC5ESVJTWzhdW2lkeF1bMF07XHJcblx0XHRcdG5jZ3kgPSBjZ3kgKyBST1QuRElSU1s4XVtpZHhdWzFdO1xyXG5cclxuXHRcdFx0aWYgKG5jZ3ggPCAwIHx8IG5jZ3ggPj0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGgpIHsgY29udGludWU7IH1cclxuXHRcdFx0aWYgKG5jZ3kgPCAwIHx8IG5jZ3kgPj0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0KSB7IGNvbnRpbnVlOyB9XHJcblxyXG5cdFx0XHRyb29tID0gdGhpcy5yb29tc1tjZ3hdW2NneV07XHJcblxyXG5cdFx0XHRpZiAocm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHQvLyBhcyBsb25nIGFzIHRoaXMgcm9vbSBkb2Vzbid0IGFscmVhZHkgY29vbmVjdCB0byBtZSwgd2UgYXJlIG9rIHdpdGggaXQuXHJcblx0XHRcdFx0aWYgKHJvb21bXCJjb25uZWN0aW9uc1wiXVswXVswXSA9PSBuY2d4ICYmIHJvb21bXCJjb25uZWN0aW9uc1wiXVswXVsxXSA9PSBuY2d5KSB7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbbmNneF1bbmNneV07XHJcblxyXG5cdFx0XHRpZiAob3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHRvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5wdXNoKFtjZ3gsIGNneV0pO1xyXG5cclxuXHRcdFx0XHR0aGlzLmNvbm5lY3RlZENlbGxzLnB1c2goW25jZ3gsIG5jZ3ldKTtcclxuXHRcdFx0XHRjZ3ggPSBuY2d4O1xyXG5cdFx0XHRcdGNneSA9IG5jZ3k7XHJcblx0XHRcdFx0Zm91bmQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSB3aGlsZSAoZGlyVG9DaGVjay5sZW5ndGggPiAwICYmIGZvdW5kID09IGZhbHNlKTtcclxuXHJcblx0fSB3aGlsZSAoZGlyVG9DaGVjay5sZW5ndGggPiAwKTtcclxuXHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY29ubmVjdFVuY29ubmVjdGVkUm9vbXMgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly9XaGlsZSB0aGVyZSBhcmUgdW5jb25uZWN0ZWQgcm9vbXMsIHRyeSB0byBjb25uZWN0IHRoZW0gdG8gYSByYW5kb20gY29ubmVjdGVkIG5laWdoYm9yXHJcblx0Ly8oaWYgYSByb29tIGhhcyBubyBjb25uZWN0ZWQgbmVpZ2hib3JzIHlldCwganVzdCBrZWVwIGN5Y2xpbmcsIHlvdSdsbCBmaWxsIG91dCB0byBpdCBldmVudHVhbGx5KS5cclxuXHR2YXIgY3cgPSB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDtcclxuXHR2YXIgY2ggPSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7XHJcblxyXG5cdHRoaXMuY29ubmVjdGVkQ2VsbHMgPSB0aGlzLmNvbm5lY3RlZENlbGxzLnJhbmRvbWl6ZSgpO1xyXG5cdHZhciByb29tO1xyXG5cdHZhciBvdGhlclJvb207XHJcblx0dmFyIHZhbGlkUm9vbTtcclxuXHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDsgaSsrKSB7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDsgaisrKSAge1xyXG5cclxuXHRcdFx0cm9vbSA9IHRoaXMucm9vbXNbaV1bal07XHJcblxyXG5cdFx0XHRpZiAocm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0dmFyIGRpcmVjdGlvbnMgPSBbMCwgMiwgNCwgNl07XHJcblx0XHRcdFx0ZGlyZWN0aW9ucyA9IGRpcmVjdGlvbnMucmFuZG9taXplKCk7XHJcblxyXG5cdFx0XHRcdHZhbGlkUm9vbSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRkbyB7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGRpcklkeCA9IGRpcmVjdGlvbnMucG9wKCk7XHJcblx0XHRcdFx0XHR2YXIgbmV3SSA9IGkgKyBST1QuRElSU1s4XVtkaXJJZHhdWzBdO1xyXG5cdFx0XHRcdFx0dmFyIG5ld0ogPSBqICsgUk9ULkRJUlNbOF1bZGlySWR4XVsxXTtcclxuXHJcblx0XHRcdFx0XHRpZiAobmV3SSA8IDAgfHwgbmV3SSA+PSBjdyB8fCBuZXdKIDwgMCB8fCBuZXdKID49IGNoKSB7IGNvbnRpbnVlOyB9XHJcblxyXG5cdFx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tuZXdJXVtuZXdKXTtcclxuXHJcblx0XHRcdFx0XHR2YWxpZFJvb20gPSB0cnVlO1xyXG5cclxuXHRcdFx0XHRcdGlmIChvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPT0gMCkgeyBicmVhazsgfVxyXG5cclxuXHRcdFx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgb3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoOyBrKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdW2tdWzBdID09IGkgJiYgb3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl1ba11bMV0gPT0gaikge1xyXG5cdFx0XHRcdFx0XHRcdHZhbGlkUm9vbSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKHZhbGlkUm9vbSkgeyBicmVhazsgfVxyXG5cclxuXHRcdFx0XHR9IHdoaWxlIChkaXJlY3Rpb25zLmxlbmd0aCk7XHJcblxyXG5cdFx0XHRcdGlmICh2YWxpZFJvb20pIHtcclxuXHRcdFx0XHRcdHJvb21bXCJjb25uZWN0aW9uc1wiXS5wdXNoKFtvdGhlclJvb21bXCJjZWxseFwiXSwgb3RoZXJSb29tW1wiY2VsbHlcIl1dKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCItLSBVbmFibGUgdG8gY29ubmVjdCByb29tLlwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY3JlYXRlUmFuZG9tUm9vbUNvbm5lY3Rpb25zID0gZnVuY3Rpb24gKGNvbm5lY3Rpb25zKSB7XHJcblx0Ly8gRW1wdHkgZm9yIG5vdy5cclxufTtcclxuXHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY3JlYXRlUm9vbXMgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly8gQ3JlYXRlIFJvb21zXHJcblxyXG5cdHZhciB3ID0gdGhpcy5fd2lkdGg7XHJcblx0dmFyIGggPSB0aGlzLl9oZWlnaHQ7XHJcblxyXG5cdHZhciBjdyA9IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoO1xyXG5cdHZhciBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcclxuXHJcblx0dmFyIGN3cCA9IE1hdGguZmxvb3IodGhpcy5fd2lkdGggLyBjdyk7XHJcblx0dmFyIGNocCA9IE1hdGguZmxvb3IodGhpcy5faGVpZ2h0IC8gY2gpO1xyXG5cclxuXHR2YXIgcm9vbXc7XHJcblx0dmFyIHJvb21oO1xyXG5cdHZhciByb29tV2lkdGggPSB0aGlzLl9vcHRpb25zW1wicm9vbVdpZHRoXCJdO1xyXG5cdHZhciByb29tSGVpZ2h0ID0gdGhpcy5fb3B0aW9uc1tcInJvb21IZWlnaHRcIl07XHJcblx0dmFyIHN4O1xyXG5cdHZhciBzeTtcclxuXHR2YXIgb3RoZXJSb29tO1xyXG5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGN3OyBpKyspIHtcclxuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2g7IGorKykge1xyXG5cdFx0XHRzeCA9IGN3cCAqIGk7XHJcblx0XHRcdHN5ID0gY2hwICogajtcclxuXHJcblx0XHRcdGlmIChzeCA9PSAwKSB7IHN4ID0gMTsgfVxyXG5cdFx0XHRpZiAoc3kgPT0gMCkgeyBzeSA9IDE7IH1cclxuXHJcblx0XHRcdHJvb213ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KHJvb21XaWR0aFswXSwgcm9vbVdpZHRoWzFdKTtcclxuXHRcdFx0cm9vbWggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQocm9vbUhlaWdodFswXSwgcm9vbUhlaWdodFsxXSk7XHJcblxyXG5cdFx0XHRpZiAoaiA+IDApIHtcclxuXHRcdFx0XHRvdGhlclJvb20gPSB0aGlzLnJvb21zW2ldW2otMV07XHJcblx0XHRcdFx0d2hpbGUgKHN5IC0gKG90aGVyUm9vbVtcInlcIl0gKyBvdGhlclJvb21bXCJoZWlnaHRcIl0gKSA8IDMpIHtcclxuXHRcdFx0XHRcdHN5Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaSA+IDApIHtcclxuXHRcdFx0XHRvdGhlclJvb20gPSB0aGlzLnJvb21zW2ktMV1bal07XHJcblx0XHRcdFx0d2hpbGUoc3ggLSAob3RoZXJSb29tW1wieFwiXSArIG90aGVyUm9vbVtcIndpZHRoXCJdKSA8IDMpIHtcclxuXHRcdFx0XHRcdHN4Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgc3hPZmZzZXQgPSBNYXRoLnJvdW5kKFJPVC5STkcuZ2V0VW5pZm9ybUludCgwLCBjd3Atcm9vbXcpLzIpO1xyXG5cdFx0XHR2YXIgc3lPZmZzZXQgPSBNYXRoLnJvdW5kKFJPVC5STkcuZ2V0VW5pZm9ybUludCgwLCBjaHAtcm9vbWgpLzIpO1xyXG5cclxuXHRcdFx0d2hpbGUgKHN4ICsgc3hPZmZzZXQgKyByb29tdyA+PSB3KSB7XHJcblx0XHRcdFx0aWYoc3hPZmZzZXQpIHtcclxuXHRcdFx0XHRcdHN4T2Zmc2V0LS07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJvb213LS07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR3aGlsZSAoc3kgKyBzeU9mZnNldCArIHJvb21oID49IGgpIHtcclxuXHRcdFx0XHRpZihzeU9mZnNldCkge1xyXG5cdFx0XHRcdFx0c3lPZmZzZXQtLTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cm9vbWgtLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN4ID0gc3ggKyBzeE9mZnNldDtcclxuXHRcdFx0c3kgPSBzeSArIHN5T2Zmc2V0O1xyXG5cclxuXHRcdFx0dGhpcy5yb29tc1tpXVtqXVtcInhcIl0gPSBzeDtcclxuXHRcdFx0dGhpcy5yb29tc1tpXVtqXVtcInlcIl0gPSBzeTtcclxuXHRcdFx0dGhpcy5yb29tc1tpXVtqXVtcIndpZHRoXCJdID0gcm9vbXc7XHJcblx0XHRcdHRoaXMucm9vbXNbaV1bal1bXCJoZWlnaHRcIl0gPSByb29taDtcclxuXHJcblx0XHRcdGZvciAodmFyIGlpID0gc3g7IGlpIDwgc3ggKyByb29tdzsgaWkrKykge1xyXG5cdFx0XHRcdGZvciAodmFyIGpqID0gc3k7IGpqIDwgc3kgKyByb29taDsgamorKykge1xyXG5cdFx0XHRcdFx0dGhpcy5tYXBbaWldW2pqXSA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2dldFdhbGxQb3NpdGlvbiA9IGZ1bmN0aW9uIChhUm9vbSwgYURpcmVjdGlvbikge1xyXG5cdHZhciByeDtcclxuXHR2YXIgcnk7XHJcblx0dmFyIGRvb3I7XHJcblxyXG5cdGlmIChhRGlyZWN0aW9uID09IDEgfHwgYURpcmVjdGlvbiA9PSAzKSB7XHJcblx0XHRyeCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChhUm9vbVtcInhcIl0gKyAxLCBhUm9vbVtcInhcIl0gKyBhUm9vbVtcIndpZHRoXCJdIC0gMik7XHJcblx0XHRpZiAoYURpcmVjdGlvbiA9PSAxKSB7XHJcblx0XHRcdHJ5ID0gYVJvb21bXCJ5XCJdIC0gMjtcclxuXHRcdFx0ZG9vciA9IHJ5ICsgMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJ5ID0gYVJvb21bXCJ5XCJdICsgYVJvb21bXCJoZWlnaHRcIl0gKyAxO1xyXG5cdFx0XHRkb29yID0gcnkgLTE7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5tYXBbcnhdW2Rvb3JdID0gMDsgLy8gaSdtIG5vdCBzZXR0aW5nIGEgc3BlY2lmaWMgJ2Rvb3InIHRpbGUgdmFsdWUgcmlnaHQgbm93LCBqdXN0IGVtcHR5IHNwYWNlLlxyXG5cclxuXHR9IGVsc2UgaWYgKGFEaXJlY3Rpb24gPT0gMiB8fCBhRGlyZWN0aW9uID09IDQpIHtcclxuXHRcdHJ5ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KGFSb29tW1wieVwiXSArIDEsIGFSb29tW1wieVwiXSArIGFSb29tW1wiaGVpZ2h0XCJdIC0gMik7XHJcblx0XHRpZihhRGlyZWN0aW9uID09IDIpIHtcclxuXHRcdFx0cnggPSBhUm9vbVtcInhcIl0gKyBhUm9vbVtcIndpZHRoXCJdICsgMTtcclxuXHRcdFx0ZG9vciA9IHJ4IC0gMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJ4ID0gYVJvb21bXCJ4XCJdIC0gMjtcclxuXHRcdFx0ZG9vciA9IHJ4ICsgMTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLm1hcFtkb29yXVtyeV0gPSAwOyAvLyBpJ20gbm90IHNldHRpbmcgYSBzcGVjaWZpYyAnZG9vcicgdGlsZSB2YWx1ZSByaWdodCBub3csIGp1c3QgZW1wdHkgc3BhY2UuXHJcblxyXG5cdH1cclxuXHRyZXR1cm4gW3J4LCByeV07XHJcbn07XHJcblxyXG4vKioqXHJcbiogQHBhcmFtIHN0YXJ0UG9zaXRpb24gYSAyIGVsZW1lbnQgYXJyYXlcclxuKiBAcGFyYW0gZW5kUG9zaXRpb24gYSAyIGVsZW1lbnQgYXJyYXlcclxuKi9cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2RyYXdDb3JyaWRvciA9IGZ1bmN0aW9uIChzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbikge1xyXG5cdHZhciB4T2Zmc2V0ID0gZW5kUG9zaXRpb25bMF0gLSBzdGFydFBvc2l0aW9uWzBdO1xyXG5cdHZhciB5T2Zmc2V0ID0gZW5kUG9zaXRpb25bMV0gLSBzdGFydFBvc2l0aW9uWzFdO1xyXG5cclxuXHR2YXIgeHBvcyA9IHN0YXJ0UG9zaXRpb25bMF07XHJcblx0dmFyIHlwb3MgPSBzdGFydFBvc2l0aW9uWzFdO1xyXG5cclxuXHR2YXIgdGVtcERpc3Q7XHJcblx0dmFyIHhEaXI7XHJcblx0dmFyIHlEaXI7XHJcblxyXG5cdHZhciBtb3ZlOyAvLyAyIGVsZW1lbnQgYXJyYXksIGVsZW1lbnQgMCBpcyB0aGUgZGlyZWN0aW9uLCBlbGVtZW50IDEgaXMgdGhlIHRvdGFsIHZhbHVlIHRvIG1vdmUuXHJcblx0dmFyIG1vdmVzID0gW107IC8vIGEgbGlzdCBvZiAyIGVsZW1lbnQgYXJyYXlzXHJcblxyXG5cdHZhciB4QWJzID0gTWF0aC5hYnMoeE9mZnNldCk7XHJcblx0dmFyIHlBYnMgPSBNYXRoLmFicyh5T2Zmc2V0KTtcclxuXHJcblx0dmFyIHBlcmNlbnQgPSBST1QuUk5HLmdldFVuaWZvcm0oKTsgLy8gdXNlZCB0byBzcGxpdCB0aGUgbW92ZSBhdCBkaWZmZXJlbnQgcGxhY2VzIGFsb25nIHRoZSBsb25nIGF4aXNcclxuXHR2YXIgZmlyc3RIYWxmID0gcGVyY2VudDtcclxuXHR2YXIgc2Vjb25kSGFsZiA9IDEgLSBwZXJjZW50O1xyXG5cclxuXHR4RGlyID0geE9mZnNldCA+IDAgPyAyIDogNjtcclxuXHR5RGlyID0geU9mZnNldCA+IDAgPyA0IDogMDtcclxuXHJcblx0aWYgKHhBYnMgPCB5QWJzKSB7XHJcblx0XHQvLyBtb3ZlIGZpcnN0SGFsZiBvZiB0aGUgeSBvZmZzZXRcclxuXHRcdHRlbXBEaXN0ID0gTWF0aC5jZWlsKHlBYnMgKiBmaXJzdEhhbGYpO1xyXG5cdFx0bW92ZXMucHVzaChbeURpciwgdGVtcERpc3RdKTtcclxuXHRcdC8vIG1vdmUgYWxsIHRoZSB4IG9mZnNldFxyXG5cdFx0bW92ZXMucHVzaChbeERpciwgeEFic10pO1xyXG5cdFx0Ly8gbW92ZSBzZW5kSGFsZiBvZiB0aGUgIHkgb2Zmc2V0XHJcblx0XHR0ZW1wRGlzdCA9IE1hdGguZmxvb3IoeUFicyAqIHNlY29uZEhhbGYpO1xyXG5cdFx0bW92ZXMucHVzaChbeURpciwgdGVtcERpc3RdKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0Ly8gIG1vdmUgZmlyc3RIYWxmIG9mIHRoZSB4IG9mZnNldFxyXG5cdFx0dGVtcERpc3QgPSBNYXRoLmNlaWwoeEFicyAqIGZpcnN0SGFsZik7XHJcblx0XHRtb3Zlcy5wdXNoKFt4RGlyLCB0ZW1wRGlzdF0pO1xyXG5cdFx0Ly8gbW92ZSBhbGwgdGhlIHkgb2Zmc2V0XHJcblx0XHRtb3Zlcy5wdXNoKFt5RGlyLCB5QWJzXSk7XHJcblx0XHQvLyBtb3ZlIHNlY29uZEhhbGYgb2YgdGhlIHggb2Zmc2V0LlxyXG5cdFx0dGVtcERpc3QgPSBNYXRoLmZsb29yKHhBYnMgKiBzZWNvbmRIYWxmKTtcclxuXHRcdG1vdmVzLnB1c2goW3hEaXIsIHRlbXBEaXN0XSk7XHJcblx0fVxyXG5cclxuXHR0aGlzLm1hcFt4cG9zXVt5cG9zXSA9IDA7XHJcblxyXG5cdHdoaWxlIChtb3Zlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRtb3ZlID0gbW92ZXMucG9wKCk7XHJcblx0XHR3aGlsZSAobW92ZVsxXSA+IDApIHtcclxuXHRcdFx0eHBvcyArPSBST1QuRElSU1s4XVttb3ZlWzBdXVswXTtcclxuXHRcdFx0eXBvcyArPSBST1QuRElSU1s4XVttb3ZlWzBdXVsxXTtcclxuXHRcdFx0dGhpcy5tYXBbeHBvc11beXBvc10gPSAwO1xyXG5cdFx0XHRtb3ZlWzFdID0gbW92ZVsxXSAtIDE7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2NyZWF0ZUNvcnJpZG9ycyA9IGZ1bmN0aW9uICgpIHtcclxuXHQvLyBEcmF3IENvcnJpZG9ycyBiZXR3ZWVuIGNvbm5lY3RlZCByb29tc1xyXG5cclxuXHR2YXIgY3cgPSB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDtcclxuXHR2YXIgY2ggPSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7XHJcblx0dmFyIHJvb207XHJcblx0dmFyIGNvbm5lY3Rpb247XHJcblx0dmFyIG90aGVyUm9vbTtcclxuXHR2YXIgd2FsbDtcclxuXHR2YXIgb3RoZXJXYWxsO1xyXG5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGN3OyBpKyspIHtcclxuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2g7IGorKykge1xyXG5cdFx0XHRyb29tID0gdGhpcy5yb29tc1tpXVtqXTtcclxuXHJcblx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgcm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aDsgaysrKSB7XHJcblxyXG5cdFx0XHRcdGNvbm5lY3Rpb24gPSByb29tW1wiY29ubmVjdGlvbnNcIl1ba107XHJcblxyXG5cdFx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbY29ubmVjdGlvblswXV1bY29ubmVjdGlvblsxXV07XHJcblxyXG5cdFx0XHRcdC8vIGZpZ3VyZSBvdXQgd2hhdCB3YWxsIG91ciBjb3JyaWRvciB3aWxsIHN0YXJ0IG9uZS5cclxuXHRcdFx0XHQvLyBmaWd1cmUgb3V0IHdoYXQgd2FsbCBvdXIgY29ycmlkb3Igd2lsbCBlbmQgb24uXHJcblx0XHRcdFx0aWYgKG90aGVyUm9vbVtcImNlbGx4XCJdID4gcm9vbVtcImNlbGx4XCJdKSB7XHJcblx0XHRcdFx0XHR3YWxsID0gMjtcclxuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDQ7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChvdGhlclJvb21bXCJjZWxseFwiXSA8IHJvb21bXCJjZWxseFwiXSkge1xyXG5cdFx0XHRcdFx0d2FsbCA9IDQ7XHJcblx0XHRcdFx0XHRvdGhlcldhbGwgPSAyO1xyXG5cdFx0XHRcdH0gZWxzZSBpZihvdGhlclJvb21bXCJjZWxseVwiXSA+IHJvb21bXCJjZWxseVwiXSkge1xyXG5cdFx0XHRcdFx0d2FsbCA9IDM7XHJcblx0XHRcdFx0XHRvdGhlcldhbGwgPSAxO1xyXG5cdFx0XHRcdH0gZWxzZSBpZihvdGhlclJvb21bXCJjZWxseVwiXSA8IHJvb21bXCJjZWxseVwiXSkge1xyXG5cdFx0XHRcdFx0d2FsbCA9IDE7XHJcblx0XHRcdFx0XHRvdGhlcldhbGwgPSAzO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5fZHJhd0NvcnJpZG9yKHRoaXMuX2dldFdhbGxQb3NpdGlvbihyb29tLCB3YWxsKSwgdGhpcy5fZ2V0V2FsbFBvc2l0aW9uKG90aGVyUm9vbSwgb3RoZXJXYWxsKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgRHVuZ2VvbiBmZWF0dXJlOyBoYXMgb3duIC5jcmVhdGUoKSBtZXRob2RcclxuICovXHJcblJPVC5NYXAuRmVhdHVyZSA9IGZ1bmN0aW9uKCkge307XHJcblJPVC5NYXAuRmVhdHVyZS5wcm90b3R5cGUuaXNWYWxpZCA9IGZ1bmN0aW9uKGNhbkJlRHVnQ2FsbGJhY2spIHt9O1xyXG5ST1QuTWFwLkZlYXR1cmUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGRpZ0NhbGxiYWNrKSB7fTtcclxuUk9ULk1hcC5GZWF0dXJlLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uKCkge307XHJcblJPVC5NYXAuRmVhdHVyZS5jcmVhdGVSYW5kb21BdCA9IGZ1bmN0aW9uKHgsIHksIGR4LCBkeSwgb3B0aW9ucykge307XHJcblxyXG4vKipcclxuICogQGNsYXNzIFJvb21cclxuICogQGF1Z21lbnRzIFJPVC5NYXAuRmVhdHVyZVxyXG4gKiBAcGFyYW0ge2ludH0geDFcclxuICogQHBhcmFtIHtpbnR9IHkxXHJcbiAqIEBwYXJhbSB7aW50fSB4MlxyXG4gKiBAcGFyYW0ge2ludH0geTJcclxuICogQHBhcmFtIHtpbnR9IFtkb29yWF1cclxuICogQHBhcmFtIHtpbnR9IFtkb29yWV1cclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tID0gZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIsIGRvb3JYLCBkb29yWSkge1xyXG5cdHRoaXMuX3gxID0geDE7XHJcblx0dGhpcy5feTEgPSB5MTtcclxuXHR0aGlzLl94MiA9IHgyO1xyXG5cdHRoaXMuX3kyID0geTI7XHJcblx0dGhpcy5fZG9vcnMgPSB7fTtcclxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDQpIHsgdGhpcy5hZGREb29yKGRvb3JYLCBkb29yWSk7IH1cclxufTtcclxuUk9ULk1hcC5GZWF0dXJlLlJvb20uZXh0ZW5kKFJPVC5NYXAuRmVhdHVyZSk7XHJcblxyXG4vKipcclxuICogUm9vbSBvZiByYW5kb20gc2l6ZSwgd2l0aCBhIGdpdmVuIGRvb3JzIGFuZCBkaXJlY3Rpb25cclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbUF0ID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5LCBvcHRpb25zKSB7XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbVdpZHRoWzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21XaWR0aFsxXTtcclxuXHR2YXIgd2lkdGggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21IZWlnaHRbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbUhlaWdodFsxXTtcclxuXHR2YXIgaGVpZ2h0ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHRpZiAoZHggPT0gMSkgeyAvKiB0byB0aGUgcmlnaHQgKi9cclxuXHRcdHZhciB5MiA9IHkgLSBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogaGVpZ2h0KTtcclxuXHRcdHJldHVybiBuZXcgdGhpcyh4KzEsIHkyLCB4K3dpZHRoLCB5MitoZWlnaHQtMSwgeCwgeSk7XHJcblx0fVxyXG5cdFxyXG5cdGlmIChkeCA9PSAtMSkgeyAvKiB0byB0aGUgbGVmdCAqL1xyXG5cdFx0dmFyIHkyID0geSAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiBoZWlnaHQpO1xyXG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgtd2lkdGgsIHkyLCB4LTEsIHkyK2hlaWdodC0xLCB4LCB5KTtcclxuXHR9XHJcblxyXG5cdGlmIChkeSA9PSAxKSB7IC8qIHRvIHRoZSBib3R0b20gKi9cclxuXHRcdHZhciB4MiA9IHggLSBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogd2lkdGgpO1xyXG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgyLCB5KzEsIHgyK3dpZHRoLTEsIHkraGVpZ2h0LCB4LCB5KTtcclxuXHR9XHJcblxyXG5cdGlmIChkeSA9PSAtMSkgeyAvKiB0byB0aGUgdG9wICovXHJcblx0XHR2YXIgeDIgPSB4IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIHdpZHRoKTtcclxuXHRcdHJldHVybiBuZXcgdGhpcyh4MiwgeS1oZWlnaHQsIHgyK3dpZHRoLTEsIHktMSwgeCwgeSk7XHJcblx0fVxyXG5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkeCBvciBkeSBtdXN0IGJlIDEgb3IgLTFcIik7XHJcbn07XHJcblxyXG4vKipcclxuICogUm9vbSBvZiByYW5kb20gc2l6ZSwgcG9zaXRpb25lZCBhcm91bmQgY2VudGVyIGNvb3Jkc1xyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tQ2VudGVyID0gZnVuY3Rpb24oY3gsIGN5LCBvcHRpb25zKSB7XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbVdpZHRoWzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21XaWR0aFsxXTtcclxuXHR2YXIgd2lkdGggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21IZWlnaHRbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbUhlaWdodFsxXTtcclxuXHR2YXIgaGVpZ2h0ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHJcblx0dmFyIHgxID0gY3ggLSBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKndpZHRoKTtcclxuXHR2YXIgeTEgPSBjeSAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqaGVpZ2h0KTtcclxuXHR2YXIgeDIgPSB4MSArIHdpZHRoIC0gMTtcclxuXHR2YXIgeTIgPSB5MSArIGhlaWdodCAtIDE7XHJcblxyXG5cdHJldHVybiBuZXcgdGhpcyh4MSwgeTEsIHgyLCB5Mik7XHJcbn07XHJcblxyXG4vKipcclxuICogUm9vbSBvZiByYW5kb20gc2l6ZSB3aXRoaW4gYSBnaXZlbiBkaW1lbnNpb25zXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb20gPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCwgb3B0aW9ucykge1xyXG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21XaWR0aFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tV2lkdGhbMV07XHJcblx0dmFyIHdpZHRoID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tSGVpZ2h0WzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21IZWlnaHRbMV07XHJcblx0dmFyIGhlaWdodCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0dmFyIGxlZnQgPSBhdmFpbFdpZHRoIC0gd2lkdGggLSAxO1xyXG5cdHZhciB0b3AgPSBhdmFpbEhlaWdodCAtIGhlaWdodCAtIDE7XHJcblxyXG5cdHZhciB4MSA9IDEgKyBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKmxlZnQpO1xyXG5cdHZhciB5MSA9IDEgKyBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKnRvcCk7XHJcblx0dmFyIHgyID0geDEgKyB3aWR0aCAtIDE7XHJcblx0dmFyIHkyID0geTEgKyBoZWlnaHQgLSAxO1xyXG5cclxuXHRyZXR1cm4gbmV3IHRoaXMoeDEsIHkxLCB4MiwgeTIpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmFkZERvb3IgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0dGhpcy5fZG9vcnNbeCtcIixcIit5XSA9IDE7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtmdW5jdGlvbn1cclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5nZXREb29ycyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2Rvb3JzKSB7XHJcblx0XHR2YXIgcGFydHMgPSBrZXkuc3BsaXQoXCIsXCIpO1xyXG5cdFx0Y2FsbGJhY2socGFyc2VJbnQocGFydHNbMF0pLCBwYXJzZUludChwYXJ0c1sxXSkpO1xyXG5cdH1cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5jbGVhckRvb3JzID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fZG9vcnMgPSB7fTtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5hZGREb29ycyA9IGZ1bmN0aW9uKGlzV2FsbENhbGxiYWNrKSB7XHJcblx0dmFyIGxlZnQgPSB0aGlzLl94MS0xO1xyXG5cdHZhciByaWdodCA9IHRoaXMuX3gyKzE7XHJcblx0dmFyIHRvcCA9IHRoaXMuX3kxLTE7XHJcblx0dmFyIGJvdHRvbSA9IHRoaXMuX3kyKzE7XHJcblxyXG5cdGZvciAodmFyIHg9bGVmdDsgeDw9cmlnaHQ7IHgrKykge1xyXG5cdFx0Zm9yICh2YXIgeT10b3A7IHk8PWJvdHRvbTsgeSsrKSB7XHJcblx0XHRcdGlmICh4ICE9IGxlZnQgJiYgeCAhPSByaWdodCAmJiB5ICE9IHRvcCAmJiB5ICE9IGJvdHRvbSkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHRpZiAoaXNXYWxsQ2FsbGJhY2soeCwgeSkpIHsgY29udGludWU7IH1cclxuXHJcblx0XHRcdHRoaXMuYWRkRG9vcih4LCB5KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24oKSB7XHJcblx0Y29uc29sZS5sb2coXCJyb29tXCIsIHRoaXMuX3gxLCB0aGlzLl95MSwgdGhpcy5feDIsIHRoaXMuX3kyKTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5pc1ZhbGlkID0gZnVuY3Rpb24oaXNXYWxsQ2FsbGJhY2ssIGNhbkJlRHVnQ2FsbGJhY2spIHsgXHJcblx0dmFyIGxlZnQgPSB0aGlzLl94MS0xO1xyXG5cdHZhciByaWdodCA9IHRoaXMuX3gyKzE7XHJcblx0dmFyIHRvcCA9IHRoaXMuX3kxLTE7XHJcblx0dmFyIGJvdHRvbSA9IHRoaXMuX3kyKzE7XHJcblx0XHJcblx0Zm9yICh2YXIgeD1sZWZ0OyB4PD1yaWdodDsgeCsrKSB7XHJcblx0XHRmb3IgKHZhciB5PXRvcDsgeTw9Ym90dG9tOyB5KyspIHtcclxuXHRcdFx0aWYgKHggPT0gbGVmdCB8fCB4ID09IHJpZ2h0IHx8IHkgPT0gdG9wIHx8IHkgPT0gYm90dG9tKSB7XHJcblx0XHRcdFx0aWYgKCFpc1dhbGxDYWxsYmFjayh4LCB5KSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoIWNhbkJlRHVnQ2FsbGJhY2soeCwgeSkpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpZ0NhbGxiYWNrIERpZyBjYWxsYmFjayB3aXRoIGEgc2lnbmF0dXJlICh4LCB5LCB2YWx1ZSkuIFZhbHVlczogMCA9IGVtcHR5LCAxID0gd2FsbCwgMiA9IGRvb3IuIE11bHRpcGxlIGRvb3JzIGFyZSBhbGxvd2VkLlxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGRpZ0NhbGxiYWNrKSB7IFxyXG5cdHZhciBsZWZ0ID0gdGhpcy5feDEtMTtcclxuXHR2YXIgcmlnaHQgPSB0aGlzLl94MisxO1xyXG5cdHZhciB0b3AgPSB0aGlzLl95MS0xO1xyXG5cdHZhciBib3R0b20gPSB0aGlzLl95MisxO1xyXG5cdFxyXG5cdHZhciB2YWx1ZSA9IDA7XHJcblx0Zm9yICh2YXIgeD1sZWZ0OyB4PD1yaWdodDsgeCsrKSB7XHJcblx0XHRmb3IgKHZhciB5PXRvcDsgeTw9Ym90dG9tOyB5KyspIHtcclxuXHRcdFx0aWYgKHgrXCIsXCIreSBpbiB0aGlzLl9kb29ycykge1xyXG5cdFx0XHRcdHZhbHVlID0gMjtcclxuXHRcdFx0fSBlbHNlIGlmICh4ID09IGxlZnQgfHwgeCA9PSByaWdodCB8fCB5ID09IHRvcCB8fCB5ID09IGJvdHRvbSkge1xyXG5cdFx0XHRcdHZhbHVlID0gMTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YWx1ZSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0ZGlnQ2FsbGJhY2soeCwgeSwgdmFsdWUpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5nZXRDZW50ZXIgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gW01hdGgucm91bmQoKHRoaXMuX3gxICsgdGhpcy5feDIpLzIpLCBNYXRoLnJvdW5kKCh0aGlzLl95MSArIHRoaXMuX3kyKS8yKV07XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0TGVmdCA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl94MTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5nZXRSaWdodCA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl94MjtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5nZXRUb3AgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5feTE7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0Qm90dG9tID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3kyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBDb3JyaWRvclxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5GZWF0dXJlXHJcbiAqIEBwYXJhbSB7aW50fSBzdGFydFhcclxuICogQHBhcmFtIHtpbnR9IHN0YXJ0WVxyXG4gKiBAcGFyYW0ge2ludH0gZW5kWFxyXG4gKiBAcGFyYW0ge2ludH0gZW5kWVxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yID0gZnVuY3Rpb24oc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFkpIHtcclxuXHR0aGlzLl9zdGFydFggPSBzdGFydFg7XHJcblx0dGhpcy5fc3RhcnRZID0gc3RhcnRZO1xyXG5cdHRoaXMuX2VuZFggPSBlbmRYOyBcclxuXHR0aGlzLl9lbmRZID0gZW5kWTtcclxuXHR0aGlzLl9lbmRzV2l0aEFXYWxsID0gdHJ1ZTtcclxufTtcclxuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yLmV4dGVuZChST1QuTWFwLkZlYXR1cmUpO1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yLmNyZWF0ZVJhbmRvbUF0ID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5LCBvcHRpb25zKSB7XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMuY29ycmlkb3JMZW5ndGhbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMuY29ycmlkb3JMZW5ndGhbMV07XHJcblx0dmFyIGxlbmd0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0cmV0dXJuIG5ldyB0aGlzKHgsIHksIHggKyBkeCpsZW5ndGgsIHkgKyBkeSpsZW5ndGgpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uKCkge1xyXG5cdGNvbnNvbGUubG9nKFwiY29ycmlkb3JcIiwgdGhpcy5fc3RhcnRYLCB0aGlzLl9zdGFydFksIHRoaXMuX2VuZFgsIHRoaXMuX2VuZFkpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yLnByb3RvdHlwZS5pc1ZhbGlkID0gZnVuY3Rpb24oaXNXYWxsQ2FsbGJhY2ssIGNhbkJlRHVnQ2FsbGJhY2speyBcclxuXHR2YXIgc3ggPSB0aGlzLl9zdGFydFg7XHJcblx0dmFyIHN5ID0gdGhpcy5fc3RhcnRZO1xyXG5cdHZhciBkeCA9IHRoaXMuX2VuZFgtc3g7XHJcblx0dmFyIGR5ID0gdGhpcy5fZW5kWS1zeTtcclxuXHR2YXIgbGVuZ3RoID0gMSArIE1hdGgubWF4KE1hdGguYWJzKGR4KSwgTWF0aC5hYnMoZHkpKTtcclxuXHRcclxuXHRpZiAoZHgpIHsgZHggPSBkeC9NYXRoLmFicyhkeCk7IH1cclxuXHRpZiAoZHkpIHsgZHkgPSBkeS9NYXRoLmFicyhkeSk7IH1cclxuXHR2YXIgbnggPSBkeTtcclxuXHR2YXIgbnkgPSAtZHg7XHJcblx0XHJcblx0dmFyIG9rID0gdHJ1ZTtcclxuXHRmb3IgKHZhciBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciB4ID0gc3ggKyBpKmR4O1xyXG5cdFx0dmFyIHkgPSBzeSArIGkqZHk7XHJcblxyXG5cdFx0aWYgKCFjYW5CZUR1Z0NhbGxiYWNrKCAgICAgeCwgICAgICB5KSkgeyBvayA9IGZhbHNlOyB9XHJcblx0XHRpZiAoIWlzV2FsbENhbGxiYWNrICAoeCArIG54LCB5ICsgbnkpKSB7IG9rID0gZmFsc2U7IH1cclxuXHRcdGlmICghaXNXYWxsQ2FsbGJhY2sgICh4IC0gbngsIHkgLSBueSkpIHsgb2sgPSBmYWxzZTsgfVxyXG5cdFx0XHJcblx0XHRpZiAoIW9rKSB7XHJcblx0XHRcdGxlbmd0aCA9IGk7XHJcblx0XHRcdHRoaXMuX2VuZFggPSB4LWR4O1xyXG5cdFx0XHR0aGlzLl9lbmRZID0geS1keTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIElmIHRoZSBsZW5ndGggZGVnZW5lcmF0ZWQsIHRoaXMgY29ycmlkb3IgbWlnaHQgYmUgaW52YWxpZFxyXG5cdCAqL1xyXG5cdCBcclxuXHQvKiBub3Qgc3VwcG9ydGVkICovXHJcblx0aWYgKGxlbmd0aCA9PSAwKSB7IHJldHVybiBmYWxzZTsgfSBcclxuXHRcclxuXHQgLyogbGVuZ3RoIDEgYWxsb3dlZCBvbmx5IGlmIHRoZSBuZXh0IHNwYWNlIGlzIGVtcHR5ICovXHJcblx0aWYgKGxlbmd0aCA9PSAxICYmIGlzV2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCwgdGhpcy5fZW5kWSArIGR5KSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcclxuXHQvKipcclxuXHQgKiBXZSBkbyBub3Qgd2FudCB0aGUgY29ycmlkb3IgdG8gY3Jhc2ggaW50byBhIGNvcm5lciBvZiBhIHJvb207XHJcblx0ICogaWYgYW55IG9mIHRoZSBlbmRpbmcgY29ybmVycyBpcyBlbXB0eSwgdGhlIE4rMXRoIGNlbGwgb2YgdGhpcyBjb3JyaWRvciBtdXN0IGJlIGVtcHR5IHRvby5cclxuXHQgKiBcclxuXHQgKiBTaXR1YXRpb246XHJcblx0ICogIyMjIyMjIzFcclxuXHQgKiAuLi4uLi4uP1xyXG5cdCAqICMjIyMjIyMyXHJcblx0ICogXHJcblx0ICogVGhlIGNvcnJpZG9yIHdhcyBkdWcgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxyXG5cdCAqIDEsIDIgLSBwcm9ibGVtYXRpYyBjb3JuZXJzLCA/ID0gTisxdGggY2VsbCAobm90IGR1ZylcclxuXHQgKi9cclxuXHR2YXIgZmlyc3RDb3JuZXJCYWQgPSAhaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4ICsgbngsIHRoaXMuX2VuZFkgKyBkeSArIG55KTtcclxuXHR2YXIgc2Vjb25kQ29ybmVyQmFkID0gIWlzV2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCAtIG54LCB0aGlzLl9lbmRZICsgZHkgLSBueSk7XHJcblx0dGhpcy5fZW5kc1dpdGhBV2FsbCA9IGlzV2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCwgdGhpcy5fZW5kWSArIGR5KTtcclxuXHRpZiAoKGZpcnN0Q29ybmVyQmFkIHx8IHNlY29uZENvcm5lckJhZCkgJiYgdGhpcy5fZW5kc1dpdGhBV2FsbCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZGlnQ2FsbGJhY2sgRGlnIGNhbGxiYWNrIHdpdGggYSBzaWduYXR1cmUgKHgsIHksIHZhbHVlKS4gVmFsdWVzOiAwID0gZW1wdHkuXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGRpZ0NhbGxiYWNrKSB7IFxyXG5cdHZhciBzeCA9IHRoaXMuX3N0YXJ0WDtcclxuXHR2YXIgc3kgPSB0aGlzLl9zdGFydFk7XHJcblx0dmFyIGR4ID0gdGhpcy5fZW5kWC1zeDtcclxuXHR2YXIgZHkgPSB0aGlzLl9lbmRZLXN5O1xyXG5cdHZhciBsZW5ndGggPSAxK01hdGgubWF4KE1hdGguYWJzKGR4KSwgTWF0aC5hYnMoZHkpKTtcclxuXHRcclxuXHRpZiAoZHgpIHsgZHggPSBkeC9NYXRoLmFicyhkeCk7IH1cclxuXHRpZiAoZHkpIHsgZHkgPSBkeS9NYXRoLmFicyhkeSk7IH1cclxuXHR2YXIgbnggPSBkeTtcclxuXHR2YXIgbnkgPSAtZHg7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wOyBpPGxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgeCA9IHN4ICsgaSpkeDtcclxuXHRcdHZhciB5ID0gc3kgKyBpKmR5O1xyXG5cdFx0ZGlnQ2FsbGJhY2soeCwgeSwgMCk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yLnByb3RvdHlwZS5jcmVhdGVQcmlvcml0eVdhbGxzID0gZnVuY3Rpb24ocHJpb3JpdHlXYWxsQ2FsbGJhY2spIHtcclxuXHRpZiAoIXRoaXMuX2VuZHNXaXRoQVdhbGwpIHsgcmV0dXJuOyB9XHJcblxyXG5cdHZhciBzeCA9IHRoaXMuX3N0YXJ0WDtcclxuXHR2YXIgc3kgPSB0aGlzLl9zdGFydFk7XHJcblxyXG5cdHZhciBkeCA9IHRoaXMuX2VuZFgtc3g7XHJcblx0dmFyIGR5ID0gdGhpcy5fZW5kWS1zeTtcclxuXHRpZiAoZHgpIHsgZHggPSBkeC9NYXRoLmFicyhkeCk7IH1cclxuXHRpZiAoZHkpIHsgZHkgPSBkeS9NYXRoLmFicyhkeSk7IH1cclxuXHR2YXIgbnggPSBkeTtcclxuXHR2YXIgbnkgPSAtZHg7XHJcblxyXG5cdHByaW9yaXR5V2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCwgdGhpcy5fZW5kWSArIGR5KTtcclxuXHRwcmlvcml0eVdhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgbngsIHRoaXMuX2VuZFkgKyBueSk7XHJcblx0cHJpb3JpdHlXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCAtIG54LCB0aGlzLl9lbmRZIC0gbnkpO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEJhc2Ugbm9pc2UgZ2VuZXJhdG9yXHJcbiAqL1xyXG5ST1QuTm9pc2UgPSBmdW5jdGlvbigpIHtcclxufTtcclxuXHJcblJPVC5Ob2lzZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oeCwgeSkge307XHJcbi8qKlxyXG4gKiBBIHNpbXBsZSAyZCBpbXBsZW1lbnRhdGlvbiBvZiBzaW1wbGV4IG5vaXNlIGJ5IE9uZHJlaiBaYXJhXHJcbiAqXHJcbiAqIEJhc2VkIG9uIGEgc3BlZWQtaW1wcm92ZWQgc2ltcGxleCBub2lzZSBhbGdvcml0aG0gZm9yIDJELCAzRCBhbmQgNEQgaW4gSmF2YS5cclxuICogV2hpY2ggaXMgYmFzZWQgb24gZXhhbXBsZSBjb2RlIGJ5IFN0ZWZhbiBHdXN0YXZzb24gKHN0ZWd1QGl0bi5saXUuc2UpLlxyXG4gKiBXaXRoIE9wdGltaXNhdGlvbnMgYnkgUGV0ZXIgRWFzdG1hbiAocGVhc3RtYW5AZHJpenpsZS5zdGFuZm9yZC5lZHUpLlxyXG4gKiBCZXR0ZXIgcmFuayBvcmRlcmluZyBtZXRob2QgYnkgU3RlZmFuIEd1c3RhdnNvbiBpbiAyMDEyLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgMkQgc2ltcGxleCBub2lzZSBnZW5lcmF0b3JcclxuICogQHBhcmFtIHtpbnR9IFtncmFkaWVudHM9MjU2XSBSYW5kb20gZ3JhZGllbnRzXHJcbiAqL1xyXG5ST1QuTm9pc2UuU2ltcGxleCA9IGZ1bmN0aW9uKGdyYWRpZW50cykge1xyXG5cdFJPVC5Ob2lzZS5jYWxsKHRoaXMpO1xyXG5cclxuXHR0aGlzLl9GMiA9IDAuNSAqIChNYXRoLnNxcnQoMykgLSAxKTtcclxuXHR0aGlzLl9HMiA9ICgzIC0gTWF0aC5zcXJ0KDMpKSAvIDY7XHJcblxyXG5cdHRoaXMuX2dyYWRpZW50cyA9IFtcclxuXHRcdFsgMCwgLTFdLFxyXG5cdFx0WyAxLCAtMV0sXHJcblx0XHRbIDEsICAwXSxcclxuXHRcdFsgMSwgIDFdLFxyXG5cdFx0WyAwLCAgMV0sXHJcblx0XHRbLTEsICAxXSxcclxuXHRcdFstMSwgIDBdLFxyXG5cdFx0Wy0xLCAtMV1cclxuXHRdO1xyXG5cclxuXHR2YXIgcGVybXV0YXRpb25zID0gW107XHJcblx0dmFyIGNvdW50ID0gZ3JhZGllbnRzIHx8IDI1NjtcclxuXHRmb3IgKHZhciBpPTA7aTxjb3VudDtpKyspIHsgcGVybXV0YXRpb25zLnB1c2goaSk7IH1cclxuXHRwZXJtdXRhdGlvbnMgPSBwZXJtdXRhdGlvbnMucmFuZG9taXplKCk7XHJcblxyXG5cdHRoaXMuX3Blcm1zID0gW107XHJcblx0dGhpcy5faW5kZXhlcyA9IFtdO1xyXG5cclxuXHRmb3IgKHZhciBpPTA7aTwyKmNvdW50O2krKykge1xyXG5cdFx0dGhpcy5fcGVybXMucHVzaChwZXJtdXRhdGlvbnNbaSAlIGNvdW50XSk7XHJcblx0XHR0aGlzLl9pbmRleGVzLnB1c2godGhpcy5fcGVybXNbaV0gJSB0aGlzLl9ncmFkaWVudHMubGVuZ3RoKTtcclxuXHR9XHJcblxyXG59O1xyXG5ST1QuTm9pc2UuU2ltcGxleC5leHRlbmQoUk9ULk5vaXNlKTtcclxuXHJcblJPVC5Ob2lzZS5TaW1wbGV4LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbih4aW4sIHlpbikge1xyXG5cdHZhciBwZXJtcyA9IHRoaXMuX3Blcm1zO1xyXG5cdHZhciBpbmRleGVzID0gdGhpcy5faW5kZXhlcztcclxuXHR2YXIgY291bnQgPSBwZXJtcy5sZW5ndGgvMjtcclxuXHR2YXIgRzIgPSB0aGlzLl9HMjtcclxuXHJcblx0dmFyIG4wID0wLCBuMSA9IDAsIG4yID0gMCwgZ2k7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xyXG5cclxuXHQvLyBTa2V3IHRoZSBpbnB1dCBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggc2ltcGxleCBjZWxsIHdlJ3JlIGluXHJcblx0dmFyIHMgPSAoeGluICsgeWluKSAqIHRoaXMuX0YyOyAvLyBIYWlyeSBmYWN0b3IgZm9yIDJEXHJcblx0dmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xyXG5cdHZhciBqID0gTWF0aC5mbG9vcih5aW4gKyBzKTtcclxuXHR2YXIgdCA9IChpICsgaikgKiBHMjtcclxuXHR2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkpIHNwYWNlXHJcblx0dmFyIFkwID0gaiAtIHQ7XHJcblx0dmFyIHgwID0geGluIC0gWDA7IC8vIFRoZSB4LHkgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXHJcblx0dmFyIHkwID0geWluIC0gWTA7XHJcblxyXG5cdC8vIEZvciB0aGUgMkQgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYW4gZXF1aWxhdGVyYWwgdHJpYW5nbGUuXHJcblx0Ly8gRGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggd2UgYXJlIGluLlxyXG5cdHZhciBpMSwgajE7IC8vIE9mZnNldHMgZm9yIHNlY29uZCAobWlkZGxlKSBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqKSBjb29yZHNcclxuXHRpZiAoeDAgPiB5MCkge1xyXG5cdFx0aTEgPSAxO1xyXG5cdFx0ajEgPSAwO1xyXG5cdH0gZWxzZSB7IC8vIGxvd2VyIHRyaWFuZ2xlLCBYWSBvcmRlcjogKDAsMCktPigxLDApLT4oMSwxKVxyXG5cdFx0aTEgPSAwO1xyXG5cdFx0ajEgPSAxO1xyXG5cdH0gLy8gdXBwZXIgdHJpYW5nbGUsIFlYIG9yZGVyOiAoMCwwKS0+KDAsMSktPigxLDEpXHJcblxyXG5cdC8vIEEgc3RlcCBvZiAoMSwwKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKDEtYywtYykgaW4gKHgseSksIGFuZFxyXG5cdC8vIGEgc3RlcCBvZiAoMCwxKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKC1jLDEtYykgaW4gKHgseSksIHdoZXJlXHJcblx0Ly8gYyA9ICgzLXNxcnQoMykpLzZcclxuXHR2YXIgeDEgPSB4MCAtIGkxICsgRzI7IC8vIE9mZnNldHMgZm9yIG1pZGRsZSBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXHJcblx0dmFyIHkxID0geTAgLSBqMSArIEcyO1xyXG5cdHZhciB4MiA9IHgwIC0gMSArIDIqRzI7IC8vIE9mZnNldHMgZm9yIGxhc3QgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xyXG5cdHZhciB5MiA9IHkwIC0gMSArIDIqRzI7XHJcblxyXG5cdC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgdGhyZWUgc2ltcGxleCBjb3JuZXJzXHJcblx0dmFyIGlpID0gaS5tb2QoY291bnQpO1xyXG5cdHZhciBqaiA9IGoubW9kKGNvdW50KTtcclxuXHJcblx0Ly8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xyXG5cdHZhciB0MCA9IDAuNSAtIHgwKngwIC0geTAqeTA7XHJcblx0aWYgKHQwID49IDApIHtcclxuXHRcdHQwICo9IHQwO1xyXG5cdFx0Z2kgPSBpbmRleGVzW2lpK3Blcm1zW2pqXV07XHJcblx0XHR2YXIgZ3JhZCA9IHRoaXMuX2dyYWRpZW50c1tnaV07XHJcblx0XHRuMCA9IHQwICogdDAgKiAoZ3JhZFswXSAqIHgwICsgZ3JhZFsxXSAqIHkwKTtcclxuXHR9XHJcblx0XHJcblx0dmFyIHQxID0gMC41IC0geDEqeDEgLSB5MSp5MTtcclxuXHRpZiAodDEgPj0gMCkge1xyXG5cdFx0dDEgKj0gdDE7XHJcblx0XHRnaSA9IGluZGV4ZXNbaWkraTErcGVybXNbamorajFdXTtcclxuXHRcdHZhciBncmFkID0gdGhpcy5fZ3JhZGllbnRzW2dpXTtcclxuXHRcdG4xID0gdDEgKiB0MSAqIChncmFkWzBdICogeDEgKyBncmFkWzFdICogeTEpO1xyXG5cdH1cclxuXHRcclxuXHR2YXIgdDIgPSAwLjUgLSB4Mip4MiAtIHkyKnkyO1xyXG5cdGlmICh0MiA+PSAwKSB7XHJcblx0XHR0MiAqPSB0MjtcclxuXHRcdGdpID0gaW5kZXhlc1tpaSsxK3Blcm1zW2pqKzFdXTtcclxuXHRcdHZhciBncmFkID0gdGhpcy5fZ3JhZGllbnRzW2dpXTtcclxuXHRcdG4yID0gdDIgKiB0MiAqIChncmFkWzBdICogeDIgKyBncmFkWzFdICogeTIpO1xyXG5cdH1cclxuXHJcblx0Ly8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxyXG5cdC8vIFRoZSByZXN1bHQgaXMgc2NhbGVkIHRvIHJldHVybiB2YWx1ZXMgaW4gdGhlIGludGVydmFsIFstMSwxXS5cclxuXHRyZXR1cm4gNzAgKiAobjAgKyBuMSArIG4yKTtcclxufVxyXG4vKipcclxuICogQGNsYXNzIEFic3RyYWN0IEZPViBhbGdvcml0aG1cclxuICogQHBhcmFtIHtmdW5jdGlvbn0gbGlnaHRQYXNzZXNDYWxsYmFjayBEb2VzIHRoZSBsaWdodCBwYXNzIHRocm91Z2ggeCx5P1xyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50b3BvbG9neT04XSA0LzYvOFxyXG4gKi9cclxuUk9ULkZPViA9IGZ1bmN0aW9uKGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHR0aGlzLl9saWdodFBhc3NlcyA9IGxpZ2h0UGFzc2VzQ2FsbGJhY2s7XHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdHRvcG9sb2d5OiA4XHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgMzYwLWRlZ3JlZSBjaXJjbGVcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKi9cclxuUk9ULkZPVi5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKHgsIHksIFIsIGNhbGxiYWNrKSB7fTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYWxsIG5laWdoYm9ycyBpbiBhIGNvbmNlbnRyaWMgcmluZ1xyXG4gKiBAcGFyYW0ge2ludH0gY3ggY2VudGVyLXhcclxuICogQHBhcmFtIHtpbnR9IGN5IGNlbnRlci15XHJcbiAqIEBwYXJhbSB7aW50fSByIHJhbmdlXHJcbiAqL1xyXG5ST1QuRk9WLnByb3RvdHlwZS5fZ2V0Q2lyY2xlID0gZnVuY3Rpb24oY3gsIGN5LCByKSB7XHJcblx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdHZhciBkaXJzLCBjb3VudEZhY3Rvciwgc3RhcnRPZmZzZXQ7XHJcblxyXG5cdHN3aXRjaCAodGhpcy5fb3B0aW9ucy50b3BvbG9neSkge1xyXG5cdFx0Y2FzZSA0OlxyXG5cdFx0XHRjb3VudEZhY3RvciA9IDE7XHJcblx0XHRcdHN0YXJ0T2Zmc2V0ID0gWzAsIDFdO1xyXG5cdFx0XHRkaXJzID0gW1xyXG5cdFx0XHRcdFJPVC5ESVJTWzhdWzddLFxyXG5cdFx0XHRcdFJPVC5ESVJTWzhdWzFdLFxyXG5cdFx0XHRcdFJPVC5ESVJTWzhdWzNdLFxyXG5cdFx0XHRcdFJPVC5ESVJTWzhdWzVdXHJcblx0XHRcdF07XHJcblx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlIDY6XHJcblx0XHRcdGRpcnMgPSBST1QuRElSU1s2XTtcclxuXHRcdFx0Y291bnRGYWN0b3IgPSAxO1xyXG5cdFx0XHRzdGFydE9mZnNldCA9IFstMSwgMV07XHJcblx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlIDg6XHJcblx0XHRcdGRpcnMgPSBST1QuRElSU1s0XTtcclxuXHRcdFx0Y291bnRGYWN0b3IgPSAyO1xyXG5cdFx0XHRzdGFydE9mZnNldCA9IFstMSwgMV07XHJcblx0XHRicmVhaztcclxuXHR9XHJcblxyXG5cdC8qIHN0YXJ0aW5nIG5laWdoYm9yICovXHJcblx0dmFyIHggPSBjeCArIHN0YXJ0T2Zmc2V0WzBdKnI7XHJcblx0dmFyIHkgPSBjeSArIHN0YXJ0T2Zmc2V0WzFdKnI7XHJcblxyXG5cdC8qIGNpcmNsZSAqL1xyXG5cdGZvciAodmFyIGk9MDtpPGRpcnMubGVuZ3RoO2krKykge1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8cipjb3VudEZhY3RvcjtqKyspIHtcclxuXHRcdFx0cmVzdWx0LnB1c2goW3gsIHldKTtcclxuXHRcdFx0eCArPSBkaXJzW2ldWzBdO1xyXG5cdFx0XHR5ICs9IGRpcnNbaV1bMV07XHJcblxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBEaXNjcmV0ZSBzaGFkb3djYXN0aW5nIGFsZ29yaXRobS4gT2Jzb2xldGVkIGJ5IFByZWNpc2Ugc2hhZG93Y2FzdGluZy5cclxuICogQGF1Z21lbnRzIFJPVC5GT1ZcclxuICovXHJcblJPVC5GT1YuRGlzY3JldGVTaGFkb3djYXN0aW5nID0gZnVuY3Rpb24obGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdFJPVC5GT1YuY2FsbCh0aGlzLCBsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKTtcclxufTtcclxuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcuZXh0ZW5kKFJPVC5GT1YpO1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULkZPViNjb21wdXRlXHJcbiAqL1xyXG5ST1QuRk9WLkRpc2NyZXRlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKHgsIHksIFIsIGNhbGxiYWNrKSB7XHJcblx0dmFyIGNlbnRlciA9IHRoaXMuX2Nvb3JkcztcclxuXHR2YXIgbWFwID0gdGhpcy5fbWFwO1xyXG5cclxuXHQvKiB0aGlzIHBsYWNlIGlzIGFsd2F5cyB2aXNpYmxlICovXHJcblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XHJcblxyXG5cdC8qIHN0YW5kaW5nIGluIGEgZGFyayBwbGFjZS4gRklYTUUgaXMgdGhpcyBhIGdvb2QgaWRlYT8gICovXHJcblx0aWYgKCF0aGlzLl9saWdodFBhc3Nlcyh4LCB5KSkgeyByZXR1cm47IH1cclxuXHRcclxuXHQvKiBzdGFydCBhbmQgZW5kIGFuZ2xlcyAqL1xyXG5cdHZhciBEQVRBID0gW107XHJcblx0XHJcblx0dmFyIEEsIEIsIGN4LCBjeSwgYmxvY2tzO1xyXG5cclxuXHQvKiBhbmFseXplIHN1cnJvdW5kaW5nIGNlbGxzIGluIGNvbmNlbnRyaWMgcmluZ3MsIHN0YXJ0aW5nIGZyb20gdGhlIGNlbnRlciAqL1xyXG5cdGZvciAodmFyIHI9MTsgcjw9UjsgcisrKSB7XHJcblx0XHR2YXIgbmVpZ2hib3JzID0gdGhpcy5fZ2V0Q2lyY2xlKHgsIHksIHIpO1xyXG5cdFx0dmFyIGFuZ2xlID0gMzYwIC8gbmVpZ2hib3JzLmxlbmd0aDtcclxuXHJcblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvcnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHRjeCA9IG5laWdoYm9yc1tpXVswXTtcclxuXHRcdFx0Y3kgPSBuZWlnaGJvcnNbaV1bMV07XHJcblx0XHRcdEEgPSBhbmdsZSAqIChpIC0gMC41KTtcclxuXHRcdFx0QiA9IEEgKyBhbmdsZTtcclxuXHRcdFx0XHJcblx0XHRcdGJsb2NrcyA9ICF0aGlzLl9saWdodFBhc3NlcyhjeCwgY3kpO1xyXG5cdFx0XHRpZiAodGhpcy5fdmlzaWJsZUNvb3JkcyhNYXRoLmZsb29yKEEpLCBNYXRoLmNlaWwoQiksIGJsb2NrcywgREFUQSkpIHsgY2FsbGJhY2soY3gsIGN5LCByLCAxKTsgfVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKERBVEEubGVuZ3RoID09IDIgJiYgREFUQVswXSA9PSAwICYmIERBVEFbMV0gPT0gMzYwKSB7IHJldHVybjsgfSAvKiBjdXRvZmY/ICovXHJcblxyXG5cdFx0fSAvKiBmb3IgYWxsIGNlbGxzIGluIHRoaXMgcmluZyAqL1xyXG5cdH0gLyogZm9yIGFsbCByaW5ncyAqL1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7aW50fSBBIHN0YXJ0IGFuZ2xlXHJcbiAqIEBwYXJhbSB7aW50fSBCIGVuZCBhbmdsZVxyXG4gKiBAcGFyYW0ge2Jvb2x9IGJsb2NrcyBEb2VzIGN1cnJlbnQgY2VsbCBibG9jayB2aXNpYmlsaXR5P1xyXG4gKiBAcGFyYW0ge2ludFtdW119IERBVEEgc2hhZG93ZWQgYW5nbGUgcGFpcnNcclxuICovXHJcblJPVC5GT1YuRGlzY3JldGVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5fdmlzaWJsZUNvb3JkcyA9IGZ1bmN0aW9uKEEsIEIsIGJsb2NrcywgREFUQSkge1xyXG5cdGlmIChBIDwgMCkgeyBcclxuXHRcdHZhciB2MSA9IGFyZ3VtZW50cy5jYWxsZWUoMCwgQiwgYmxvY2tzLCBEQVRBKTtcclxuXHRcdHZhciB2MiA9IGFyZ3VtZW50cy5jYWxsZWUoMzYwK0EsIDM2MCwgYmxvY2tzLCBEQVRBKTtcclxuXHRcdHJldHVybiB2MSB8fCB2MjtcclxuXHR9XHJcblx0XHJcblx0dmFyIGluZGV4ID0gMDtcclxuXHR3aGlsZSAoaW5kZXggPCBEQVRBLmxlbmd0aCAmJiBEQVRBW2luZGV4XSA8IEEpIHsgaW5kZXgrKzsgfVxyXG5cdFxyXG5cdGlmIChpbmRleCA9PSBEQVRBLmxlbmd0aCkgeyAvKiBjb21wbGV0ZWx5IG5ldyBzaGFkb3cgKi9cclxuXHRcdGlmIChibG9ja3MpIHsgREFUQS5wdXNoKEEsIEIpOyB9IFxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdHZhciBjb3VudCA9IDA7XHJcblx0XHJcblx0aWYgKGluZGV4ICUgMikgeyAvKiB0aGlzIHNoYWRvdyBzdGFydHMgaW4gYW4gZXhpc3Rpbmcgc2hhZG93LCBvciB3aXRoaW4gaXRzIGVuZGluZyBib3VuZGFyeSAqL1xyXG5cdFx0d2hpbGUgKGluZGV4IDwgREFUQS5sZW5ndGggJiYgREFUQVtpbmRleF0gPCBCKSB7XHJcblx0XHRcdGluZGV4Kys7XHJcblx0XHRcdGNvdW50Kys7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChjb3VudCA9PSAwKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHJcblx0XHRpZiAoYmxvY2tzKSB7IFxyXG5cdFx0XHRpZiAoY291bnQgJSAyKSB7XHJcblx0XHRcdFx0REFUQS5zcGxpY2UoaW5kZXgtY291bnQsIGNvdW50LCBCKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHREQVRBLnNwbGljZShpbmRleC1jb3VudCwgY291bnQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cclxuXHR9IGVsc2UgeyAvKiB0aGlzIHNoYWRvdyBzdGFydHMgb3V0c2lkZSBhbiBleGlzdGluZyBzaGFkb3csIG9yIHdpdGhpbiBhIHN0YXJ0aW5nIGJvdW5kYXJ5ICovXHJcblx0XHR3aGlsZSAoaW5kZXggPCBEQVRBLmxlbmd0aCAmJiBEQVRBW2luZGV4XSA8IEIpIHtcclxuXHRcdFx0aW5kZXgrKztcclxuXHRcdFx0Y291bnQrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0LyogdmlzaWJsZSB3aGVuIG91dHNpZGUgYW4gZXhpc3Rpbmcgc2hhZG93LCBvciB3aGVuIG92ZXJsYXBwaW5nICovXHJcblx0XHRpZiAoQSA9PSBEQVRBW2luZGV4LWNvdW50XSAmJiBjb3VudCA9PSAxKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHJcblx0XHRpZiAoYmxvY2tzKSB7IFxyXG5cdFx0XHRpZiAoY291bnQgJSAyKSB7XHJcblx0XHRcdFx0REFUQS5zcGxpY2UoaW5kZXgtY291bnQsIGNvdW50LCBBKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHREQVRBLnNwbGljZShpbmRleC1jb3VudCwgY291bnQsIEEsIEIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcdFxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFByZWNpc2Ugc2hhZG93Y2FzdGluZyBhbGdvcml0aG1cclxuICogQGF1Z21lbnRzIFJPVC5GT1ZcclxuICovXHJcblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0Uk9ULkZPVi5jYWxsKHRoaXMsIGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG59O1xyXG5ST1QuRk9WLlByZWNpc2VTaGFkb3djYXN0aW5nLmV4dGVuZChST1QuRk9WKTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5GT1YjY29tcHV0ZVxyXG4gKi9cclxuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKHgsIHksIFIsIGNhbGxiYWNrKSB7XHJcblx0LyogdGhpcyBwbGFjZSBpcyBhbHdheXMgdmlzaWJsZSAqL1xyXG5cdGNhbGxiYWNrKHgsIHksIDAsIDEpO1xyXG5cclxuXHQvKiBzdGFuZGluZyBpbiBhIGRhcmsgcGxhY2UuIEZJWE1FIGlzIHRoaXMgYSBnb29kIGlkZWE/ICAqL1xyXG5cdGlmICghdGhpcy5fbGlnaHRQYXNzZXMoeCwgeSkpIHsgcmV0dXJuOyB9XHJcblx0XHJcblx0LyogbGlzdCBvZiBhbGwgc2hhZG93cyAqL1xyXG5cdHZhciBTSEFET1dTID0gW107XHJcblx0XHJcblx0dmFyIGN4LCBjeSwgYmxvY2tzLCBBMSwgQTIsIHZpc2liaWxpdHk7XHJcblxyXG5cdC8qIGFuYWx5emUgc3Vycm91bmRpbmcgY2VsbHMgaW4gY29uY2VudHJpYyByaW5ncywgc3RhcnRpbmcgZnJvbSB0aGUgY2VudGVyICovXHJcblx0Zm9yICh2YXIgcj0xOyByPD1SOyByKyspIHtcclxuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXRDaXJjbGUoeCwgeSwgcik7XHJcblx0XHR2YXIgbmVpZ2hib3JDb3VudCA9IG5laWdoYm9ycy5sZW5ndGg7XHJcblxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8bmVpZ2hib3JDb3VudDtpKyspIHtcclxuXHRcdFx0Y3ggPSBuZWlnaGJvcnNbaV1bMF07XHJcblx0XHRcdGN5ID0gbmVpZ2hib3JzW2ldWzFdO1xyXG5cdFx0XHQvKiBzaGlmdCBoYWxmLWFuLWFuZ2xlIGJhY2t3YXJkcyB0byBtYWludGFpbiBjb25zaXN0ZW5jeSBvZiAwLXRoIGNlbGxzICovXHJcblx0XHRcdEExID0gW2kgPyAyKmktMSA6IDIqbmVpZ2hib3JDb3VudC0xLCAyKm5laWdoYm9yQ291bnRdO1xyXG5cdFx0XHRBMiA9IFsyKmkrMSwgMipuZWlnaGJvckNvdW50XTsgXHJcblx0XHRcdFxyXG5cdFx0XHRibG9ja3MgPSAhdGhpcy5fbGlnaHRQYXNzZXMoY3gsIGN5KTtcclxuXHRcdFx0dmlzaWJpbGl0eSA9IHRoaXMuX2NoZWNrVmlzaWJpbGl0eShBMSwgQTIsIGJsb2NrcywgU0hBRE9XUyk7XHJcblx0XHRcdGlmICh2aXNpYmlsaXR5KSB7IGNhbGxiYWNrKGN4LCBjeSwgciwgdmlzaWJpbGl0eSk7IH1cclxuXHJcblx0XHRcdGlmIChTSEFET1dTLmxlbmd0aCA9PSAyICYmIFNIQURPV1NbMF1bMF0gPT0gMCAmJiBTSEFET1dTWzFdWzBdID09IFNIQURPV1NbMV1bMV0pIHsgcmV0dXJuOyB9IC8qIGN1dG9mZj8gKi9cclxuXHJcblx0XHR9IC8qIGZvciBhbGwgY2VsbHMgaW4gdGhpcyByaW5nICovXHJcblx0fSAvKiBmb3IgYWxsIHJpbmdzICovXHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtpbnRbMl19IEExIGFyYyBzdGFydFxyXG4gKiBAcGFyYW0ge2ludFsyXX0gQTIgYXJjIGVuZFxyXG4gKiBAcGFyYW0ge2Jvb2x9IGJsb2NrcyBEb2VzIGN1cnJlbnQgYXJjIGJsb2NrIHZpc2liaWxpdHk/XHJcbiAqIEBwYXJhbSB7aW50W11bXX0gU0hBRE9XUyBsaXN0IG9mIGFjdGl2ZSBzaGFkb3dzXHJcbiAqL1xyXG5ST1QuRk9WLlByZWNpc2VTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5fY2hlY2tWaXNpYmlsaXR5ID0gZnVuY3Rpb24oQTEsIEEyLCBibG9ja3MsIFNIQURPV1MpIHtcclxuXHRpZiAoQTFbMF0gPiBBMlswXSkgeyAvKiBzcGxpdCBpbnRvIHR3byBzdWItYXJjcyAqL1xyXG5cdFx0dmFyIHYxID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KEExLCBbQTFbMV0sIEExWzFdXSwgYmxvY2tzLCBTSEFET1dTKTtcclxuXHRcdHZhciB2MiA9IHRoaXMuX2NoZWNrVmlzaWJpbGl0eShbMCwgMV0sIEEyLCBibG9ja3MsIFNIQURPV1MpO1xyXG5cdFx0cmV0dXJuICh2MSt2MikvMjtcclxuXHR9XHJcblxyXG5cdC8qIGluZGV4MTogZmlyc3Qgc2hhZG93ID49IEExICovXHJcblx0dmFyIGluZGV4MSA9IDAsIGVkZ2UxID0gZmFsc2U7XHJcblx0d2hpbGUgKGluZGV4MSA8IFNIQURPV1MubGVuZ3RoKSB7XHJcblx0XHR2YXIgb2xkID0gU0hBRE9XU1tpbmRleDFdO1xyXG5cdFx0dmFyIGRpZmYgPSBvbGRbMF0qQTFbMV0gLSBBMVswXSpvbGRbMV07XHJcblx0XHRpZiAoZGlmZiA+PSAwKSB7IC8qIG9sZCA+PSBBMSAqL1xyXG5cdFx0XHRpZiAoZGlmZiA9PSAwICYmICEoaW5kZXgxICUgMikpIHsgZWRnZTEgPSB0cnVlOyB9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0aW5kZXgxKys7XHJcblx0fVxyXG5cclxuXHQvKiBpbmRleDI6IGxhc3Qgc2hhZG93IDw9IEEyICovXHJcblx0dmFyIGluZGV4MiA9IFNIQURPV1MubGVuZ3RoLCBlZGdlMiA9IGZhbHNlO1xyXG5cdHdoaWxlIChpbmRleDItLSkge1xyXG5cdFx0dmFyIG9sZCA9IFNIQURPV1NbaW5kZXgyXTtcclxuXHRcdHZhciBkaWZmID0gQTJbMF0qb2xkWzFdIC0gb2xkWzBdKkEyWzFdO1xyXG5cdFx0aWYgKGRpZmYgPj0gMCkgeyAvKiBvbGQgPD0gQTIgKi9cclxuXHRcdFx0aWYgKGRpZmYgPT0gMCAmJiAoaW5kZXgyICUgMikpIHsgZWRnZTIgPSB0cnVlOyB9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIHZpc2libGUgPSB0cnVlO1xyXG5cdGlmIChpbmRleDEgPT0gaW5kZXgyICYmIChlZGdlMSB8fCBlZGdlMikpIHsgIC8qIHN1YnNldCBvZiBleGlzdGluZyBzaGFkb3csIG9uZSBvZiB0aGUgZWRnZXMgbWF0Y2ggKi9cclxuXHRcdHZpc2libGUgPSBmYWxzZTsgXHJcblx0fSBlbHNlIGlmIChlZGdlMSAmJiBlZGdlMiAmJiBpbmRleDErMT09aW5kZXgyICYmIChpbmRleDIgJSAyKSkgeyAvKiBjb21wbGV0ZWx5IGVxdWl2YWxlbnQgd2l0aCBleGlzdGluZyBzaGFkb3cgKi9cclxuXHRcdHZpc2libGUgPSBmYWxzZTtcclxuXHR9IGVsc2UgaWYgKGluZGV4MSA+IGluZGV4MiAmJiAoaW5kZXgxICUgMikpIHsgLyogc3Vic2V0IG9mIGV4aXN0aW5nIHNoYWRvdywgbm90IHRvdWNoaW5nICovXHJcblx0XHR2aXNpYmxlID0gZmFsc2U7XHJcblx0fVxyXG5cdFxyXG5cdGlmICghdmlzaWJsZSkgeyByZXR1cm4gMDsgfSAvKiBmYXN0IGNhc2U6IG5vdCB2aXNpYmxlICovXHJcblx0XHJcblx0dmFyIHZpc2libGVMZW5ndGgsIFA7XHJcblxyXG5cdC8qIGNvbXB1dGUgdGhlIGxlbmd0aCBvZiB2aXNpYmxlIGFyYywgYWRqdXN0IGxpc3Qgb2Ygc2hhZG93cyAoaWYgYmxvY2tpbmcpICovXHJcblx0dmFyIHJlbW92ZSA9IGluZGV4Mi1pbmRleDErMTtcclxuXHRpZiAocmVtb3ZlICUgMikge1xyXG5cdFx0aWYgKGluZGV4MSAlIDIpIHsgLyogZmlyc3QgZWRnZSB3aXRoaW4gZXhpc3Rpbmcgc2hhZG93LCBzZWNvbmQgb3V0c2lkZSAqL1xyXG5cdFx0XHR2YXIgUCA9IFNIQURPV1NbaW5kZXgxXTtcclxuXHRcdFx0dmlzaWJsZUxlbmd0aCA9IChBMlswXSpQWzFdIC0gUFswXSpBMlsxXSkgLyAoUFsxXSAqIEEyWzFdKTtcclxuXHRcdFx0aWYgKGJsb2NrcykgeyBTSEFET1dTLnNwbGljZShpbmRleDEsIHJlbW92ZSwgQTIpOyB9XHJcblx0XHR9IGVsc2UgeyAvKiBzZWNvbmQgZWRnZSB3aXRoaW4gZXhpc3Rpbmcgc2hhZG93LCBmaXJzdCBvdXRzaWRlICovXHJcblx0XHRcdHZhciBQID0gU0hBRE9XU1tpbmRleDJdO1xyXG5cdFx0XHR2aXNpYmxlTGVuZ3RoID0gKFBbMF0qQTFbMV0gLSBBMVswXSpQWzFdKSAvIChBMVsxXSAqIFBbMV0pO1xyXG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMSk7IH1cclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0aWYgKGluZGV4MSAlIDIpIHsgLyogYm90aCBlZGdlcyB3aXRoaW4gZXhpc3Rpbmcgc2hhZG93cyAqL1xyXG5cdFx0XHR2YXIgUDEgPSBTSEFET1dTW2luZGV4MV07XHJcblx0XHRcdHZhciBQMiA9IFNIQURPV1NbaW5kZXgyXTtcclxuXHRcdFx0dmlzaWJsZUxlbmd0aCA9IChQMlswXSpQMVsxXSAtIFAxWzBdKlAyWzFdKSAvIChQMVsxXSAqIFAyWzFdKTtcclxuXHRcdFx0aWYgKGJsb2NrcykgeyBTSEFET1dTLnNwbGljZShpbmRleDEsIHJlbW92ZSk7IH1cclxuXHRcdH0gZWxzZSB7IC8qIGJvdGggZWRnZXMgb3V0c2lkZSBleGlzdGluZyBzaGFkb3dzICovXHJcblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUsIEExLCBBMik7IH1cclxuXHRcdFx0cmV0dXJuIDE7IC8qIHdob2xlIGFyYyB2aXNpYmxlISAqL1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGFyY0xlbmd0aCA9IChBMlswXSpBMVsxXSAtIEExWzBdKkEyWzFdKSAvIChBMVsxXSAqIEEyWzFdKTtcclxuXHJcblx0cmV0dXJuIHZpc2libGVMZW5ndGgvYXJjTGVuZ3RoO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFJlY3Vyc2l2ZSBzaGFkb3djYXN0aW5nIGFsZ29yaXRobVxyXG4gKiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyA0LzggdG9wb2xvZ2llcywgbm90IGhleGFnb25hbC5cclxuICogQmFzZWQgb24gUGV0ZXIgSGFya2lucycgaW1wbGVtZW50YXRpb24gb2YgQmrDtnJuIEJlcmdzdHLDtm0ncyBhbGdvcml0aG0gZGVzY3JpYmVkIGhlcmU6IGh0dHA6Ly93d3cucm9ndWViYXNpbi5jb20vaW5kZXgucGhwP3RpdGxlPUZPVl91c2luZ19yZWN1cnNpdmVfc2hhZG93Y2FzdGluZ1xyXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxyXG4gKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nID0gZnVuY3Rpb24obGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdFJPVC5GT1YuY2FsbCh0aGlzLCBsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKTtcclxufTtcclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLmV4dGVuZChST1QuRk9WKTtcclxuXHJcbi8qKiBPY3RhbnRzIHVzZWQgZm9yIHRyYW5zbGF0aW5nIHJlY3Vyc2l2ZSBzaGFkb3djYXN0aW5nIG9mZnNldHMgKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFMgPSBbXHJcblx0Wy0xLCAgMCwgIDAsICAxXSxcclxuXHRbIDAsIC0xLCAgMSwgIDBdLFxyXG5cdFsgMCwgLTEsIC0xLCAgMF0sXHJcblx0Wy0xLCAgMCwgIDAsIC0xXSxcclxuXHRbIDEsICAwLCAgMCwgLTFdLFxyXG5cdFsgMCwgIDEsIC0xLCAgMF0sXHJcblx0WyAwLCAgMSwgIDEsICAwXSxcclxuXHRbIDEsICAwLCAgMCwgIDFdXHJcbl07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDM2MC1kZWdyZWUgY2lyY2xlXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKHgsIHksIFIsIGNhbGxiYWNrKSB7XHJcblx0Ly9Zb3UgY2FuIGFsd2F5cyBzZWUgeW91ciBvd24gdGlsZVxyXG5cdGNhbGxiYWNrKHgsIHksIDAsIDEpO1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UUy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW2ldLCBSLCBjYWxsYmFjayk7XHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSAxODAtZGVncmVlIGFyY1xyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7aW50fSBkaXIgRGlyZWN0aW9uIHRvIGxvb2sgaW4gKGV4cHJlc3NlZCBpbiBhIFJPVC5ESVJTIHZhbHVlKTtcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuY29tcHV0ZTE4MCA9IGZ1bmN0aW9uKHgsIHksIFIsIGRpciwgY2FsbGJhY2spIHtcclxuXHQvL1lvdSBjYW4gYWx3YXlzIHNlZSB5b3VyIG93biB0aWxlXHJcblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XHJcblx0dmFyIHByZXZpb3VzT2N0YW50ID0gKGRpciAtIDEgKyA4KSAlIDg7IC8vTmVlZCB0byByZXRyaWV2ZSB0aGUgcHJldmlvdXMgb2N0YW50IHRvIHJlbmRlciBhIGZ1bGwgMTgwIGRlZ3JlZXNcclxuXHR2YXIgbmV4dFByZXZpb3VzT2N0YW50ID0gKGRpciAtIDIgKyA4KSAlIDg7IC8vTmVlZCB0byByZXRyaWV2ZSB0aGUgcHJldmlvdXMgdHdvIG9jdGFudHMgdG8gcmVuZGVyIGEgZnVsbCAxODAgZGVncmVlc1xyXG5cdHZhciBuZXh0T2N0YW50ID0gKGRpcisgMSArIDgpICUgODsgLy9OZWVkIHRvIGdyYWIgdG8gbmV4dCBvY3RhbnQgdG8gcmVuZGVyIGEgZnVsbCAxODAgZGVncmVlc1xyXG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1tuZXh0UHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW3ByZXZpb3VzT2N0YW50XSwgUiwgY2FsbGJhY2spO1xyXG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1tkaXJdLCBSLCBjYWxsYmFjayk7XHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW25leHRPY3RhbnRdLCBSLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDkwLWRlZ3JlZSBhcmNcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xyXG4gKiBAcGFyYW0ge2ludH0gZGlyIERpcmVjdGlvbiB0byBsb29rIGluIChleHByZXNzZWQgaW4gYSBST1QuRElSUyB2YWx1ZSk7XHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGU5MCA9IGZ1bmN0aW9uKHgsIHksIFIsIGRpciwgY2FsbGJhY2spIHtcclxuXHQvL1lvdSBjYW4gYWx3YXlzIHNlZSB5b3VyIG93biB0aWxlXHJcblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XHJcblx0dmFyIHByZXZpb3VzT2N0YW50ID0gKGRpciAtIDEgKyA4KSAlIDg7IC8vTmVlZCB0byByZXRyaWV2ZSB0aGUgcHJldmlvdXMgb2N0YW50IHRvIHJlbmRlciBhIGZ1bGwgOTAgZGVncmVlc1xyXG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1tkaXJdLCBSLCBjYWxsYmFjayk7XHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW3ByZXZpb3VzT2N0YW50XSwgUiwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbmRlciBvbmUgb2N0YW50ICg0NS1kZWdyZWUgYXJjKSBvZiB0aGUgdmlld3NoZWRcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtpbnR9IG9jdGFudCBPY3RhbnQgdG8gYmUgcmVuZGVyZWRcclxuICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5fcmVuZGVyT2N0YW50ID0gZnVuY3Rpb24oeCwgeSwgb2N0YW50LCBSLCBjYWxsYmFjaykge1xyXG5cdC8vUmFkaXVzIGluY3JlbWVudGVkIGJ5IDEgdG8gcHJvdmlkZSBzYW1lIGNvdmVyYWdlIGFyZWEgYXMgb3RoZXIgc2hhZG93Y2FzdGluZyByYWRpdXNlc1xyXG5cdHRoaXMuX2Nhc3RWaXNpYmlsaXR5KHgsIHksIDEsIDEuMCwgMC4wLCBSICsgMSwgb2N0YW50WzBdLCBvY3RhbnRbMV0sIG9jdGFudFsyXSwgb2N0YW50WzNdLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQWN0dWFsbHkgY2FsY3VsYXRlcyB0aGUgdmlzaWJpbGl0eVxyXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRYIFRoZSBzdGFydGluZyBYIGNvb3JkaW5hdGVcclxuICogQHBhcmFtIHtpbnR9IHN0YXJ0WSBUaGUgc3RhcnRpbmcgWSBjb29yZGluYXRlXHJcbiAqIEBwYXJhbSB7aW50fSByb3cgVGhlIHJvdyB0byByZW5kZXJcclxuICogQHBhcmFtIHtmbG9hdH0gdmlzU2xvcGVTdGFydCBUaGUgc2xvcGUgdG8gc3RhcnQgYXRcclxuICogQHBhcmFtIHtmbG9hdH0gdmlzU2xvcGVFbmQgVGhlIHNsb3BlIHRvIGVuZCBhdFxyXG4gKiBAcGFyYW0ge2ludH0gcmFkaXVzIFRoZSByYWRpdXMgdG8gcmVhY2ggb3V0IHRvXHJcbiAqIEBwYXJhbSB7aW50fSB4eCBcclxuICogQHBhcmFtIHtpbnR9IHh5IFxyXG4gKiBAcGFyYW0ge2ludH0geXggXHJcbiAqIEBwYXJhbSB7aW50fSB5eSBcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIHVzZSB3aGVuIHdlIGhpdCBhIGJsb2NrIHRoYXQgaXMgdmlzaWJsZVxyXG4gKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5fY2FzdFZpc2liaWxpdHkgPSBmdW5jdGlvbihzdGFydFgsIHN0YXJ0WSwgcm93LCB2aXNTbG9wZVN0YXJ0LCB2aXNTbG9wZUVuZCwgcmFkaXVzLCB4eCwgeHksIHl4LCB5eSwgY2FsbGJhY2spIHtcclxuXHRpZih2aXNTbG9wZVN0YXJ0IDwgdmlzU2xvcGVFbmQpIHsgcmV0dXJuOyB9XHJcblx0Zm9yKHZhciBpID0gcm93OyBpIDw9IHJhZGl1czsgaSsrKSB7XHJcblx0XHR2YXIgZHggPSAtaSAtIDE7XHJcblx0XHR2YXIgZHkgPSAtaTtcclxuXHRcdHZhciBibG9ja2VkID0gZmFsc2U7XHJcblx0XHR2YXIgbmV3U3RhcnQgPSAwO1xyXG5cclxuXHRcdC8vJ1JvdycgY291bGQgYmUgY29sdW1uLCBuYW1lcyBoZXJlIGFzc3VtZSBvY3RhbnQgMCBhbmQgd291bGQgYmUgZmxpcHBlZCBmb3IgaGFsZiB0aGUgb2N0YW50c1xyXG5cdFx0d2hpbGUoZHggPD0gMCkge1xyXG5cdFx0XHRkeCArPSAxO1xyXG5cclxuXHRcdFx0Ly9UcmFuc2xhdGUgZnJvbSByZWxhdGl2ZSBjb29yZGluYXRlcyB0byBtYXAgY29vcmRpbmF0ZXNcclxuXHRcdFx0dmFyIG1hcFggPSBzdGFydFggKyBkeCAqIHh4ICsgZHkgKiB4eTtcclxuXHRcdFx0dmFyIG1hcFkgPSBzdGFydFkgKyBkeCAqIHl4ICsgZHkgKiB5eTtcclxuXHJcblx0XHRcdC8vUmFuZ2Ugb2YgdGhlIHJvd1xyXG5cdFx0XHR2YXIgc2xvcGVTdGFydCA9IChkeCAtIDAuNSkgLyAoZHkgKyAwLjUpO1xyXG5cdFx0XHR2YXIgc2xvcGVFbmQgPSAoZHggKyAwLjUpIC8gKGR5IC0gMC41KTtcclxuXHRcdFxyXG5cdFx0XHQvL0lnbm9yZSBpZiBub3QgeWV0IGF0IGxlZnQgZWRnZSBvZiBPY3RhbnRcclxuXHRcdFx0aWYoc2xvcGVFbmQgPiB2aXNTbG9wZVN0YXJ0KSB7IGNvbnRpbnVlOyB9XHJcblx0XHRcdFxyXG5cdFx0XHQvL0RvbmUgaWYgcGFzdCByaWdodCBlZGdlXHJcblx0XHRcdGlmKHNsb3BlU3RhcnQgPCB2aXNTbG9wZUVuZCkgeyBicmVhazsgfVxyXG5cdFx0XHRcdFxyXG5cdFx0XHQvL0lmIGl0J3MgaW4gcmFuZ2UsIGl0J3MgdmlzaWJsZVxyXG5cdFx0XHRpZigoZHggKiBkeCArIGR5ICogZHkpIDwgKHJhZGl1cyAqIHJhZGl1cykpIHtcclxuXHRcdFx0XHRjYWxsYmFjayhtYXBYLCBtYXBZLCBpLCAxKTtcclxuXHRcdFx0fVxyXG5cdFxyXG5cdFx0XHRpZighYmxvY2tlZCkge1xyXG5cdFx0XHRcdC8vSWYgdGlsZSBpcyBhIGJsb2NraW5nIHRpbGUsIGNhc3QgYXJvdW5kIGl0XHJcblx0XHRcdFx0aWYoIXRoaXMuX2xpZ2h0UGFzc2VzKG1hcFgsIG1hcFkpICYmIGkgPCByYWRpdXMpIHtcclxuXHRcdFx0XHRcdGJsb2NrZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0dGhpcy5fY2FzdFZpc2liaWxpdHkoc3RhcnRYLCBzdGFydFksIGkgKyAxLCB2aXNTbG9wZVN0YXJ0LCBzbG9wZVN0YXJ0LCByYWRpdXMsIHh4LCB4eSwgeXgsIHl5LCBjYWxsYmFjayk7XHJcblx0XHRcdFx0XHRuZXdTdGFydCA9IHNsb3BlRW5kO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvL0tlZXAgbmFycm93aW5nIGlmIHNjYW5uaW5nIGFjcm9zcyBhIGJsb2NrXHJcblx0XHRcdFx0aWYoIXRoaXMuX2xpZ2h0UGFzc2VzKG1hcFgsIG1hcFkpKSB7XHJcblx0XHRcdFx0XHRuZXdTdGFydCA9IHNsb3BlRW5kO1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0XHQvL0Jsb2NrIGhhcyBlbmRlZFxyXG5cdFx0XHRcdGJsb2NrZWQgPSBmYWxzZTtcclxuXHRcdFx0XHR2aXNTbG9wZVN0YXJ0ID0gbmV3U3RhcnQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmKGJsb2NrZWQpIHsgYnJlYWs7IH1cclxuXHR9XHJcbn07XHJcbi8qKlxyXG4gKiBAbmFtZXNwYWNlIENvbG9yIG9wZXJhdGlvbnNcclxuICovXHJcblJPVC5Db2xvciA9IHtcclxuXHRmcm9tU3RyaW5nOiBmdW5jdGlvbihzdHIpIHtcclxuXHRcdHZhciBjYWNoZWQsIHI7XHJcblx0XHRpZiAoc3RyIGluIHRoaXMuX2NhY2hlKSB7XHJcblx0XHRcdGNhY2hlZCA9IHRoaXMuX2NhY2hlW3N0cl07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoc3RyLmNoYXJBdCgwKSA9PSBcIiNcIikgeyAvKiBoZXggcmdiICovXHJcblxyXG5cdFx0XHRcdHZhciB2YWx1ZXMgPSBzdHIubWF0Y2goL1swLTlhLWZdL2dpKS5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4gcGFyc2VJbnQoeCwgMTYpOyB9KTtcclxuXHRcdFx0XHRpZiAodmFsdWVzLmxlbmd0aCA9PSAzKSB7XHJcblx0XHRcdFx0XHRjYWNoZWQgPSB2YWx1ZXMubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHgqMTc7IH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRcdFx0XHR2YWx1ZXNbaSsxXSArPSAxNip2YWx1ZXNbaV07XHJcblx0XHRcdFx0XHRcdHZhbHVlcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYWNoZWQgPSB2YWx1ZXM7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIGlmICgociA9IHN0ci5tYXRjaCgvcmdiXFwoKFswLTksIF0rKVxcKS9pKSkpIHsgLyogZGVjaW1hbCByZ2IgKi9cclxuXHRcdFx0XHRjYWNoZWQgPSByWzFdLnNwbGl0KC9cXHMqLFxccyovKS5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4gcGFyc2VJbnQoeCk7IH0pO1xyXG5cdFx0XHR9IGVsc2UgeyAvKiBodG1sIG5hbWUgKi9cclxuXHRcdFx0XHRjYWNoZWQgPSBbMCwgMCwgMF07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX2NhY2hlW3N0cl0gPSBjYWNoZWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGNhY2hlZC5zbGljZSgpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEFkZCB0d28gb3IgbW9yZSBjb2xvcnNcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0YWRkOiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMikge1xyXG5cdFx0dmFyIHJlc3VsdCA9IGNvbG9yMS5zbGljZSgpO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0xO2o8YXJndW1lbnRzLmxlbmd0aDtqKyspIHtcclxuXHRcdFx0XHRyZXN1bHRbaV0gKz0gYXJndW1lbnRzW2pdW2ldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEFkZCB0d28gb3IgbW9yZSBjb2xvcnMsIE1PRElGSUVTIEZJUlNUIEFSR1VNRU5UXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdGFkZF86IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRmb3IgKHZhciBqPTE7ajxhcmd1bWVudHMubGVuZ3RoO2orKykge1xyXG5cdFx0XHRcdGNvbG9yMVtpXSArPSBhcmd1bWVudHNbal1baV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjb2xvcjE7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogTXVsdGlwbHkgKG1peCkgdHdvIG9yIG1vcmUgY29sb3JzXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdG11bHRpcGx5OiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMikge1xyXG5cdFx0dmFyIHJlc3VsdCA9IGNvbG9yMS5zbGljZSgpO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0xO2o8YXJndW1lbnRzLmxlbmd0aDtqKyspIHtcclxuXHRcdFx0XHRyZXN1bHRbaV0gKj0gYXJndW1lbnRzW2pdW2ldIC8gMjU1O1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlc3VsdFtpXSA9IE1hdGgucm91bmQocmVzdWx0W2ldKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogTXVsdGlwbHkgKG1peCkgdHdvIG9yIG1vcmUgY29sb3JzLCBNT0RJRklFUyBGSVJTVCBBUkdVTUVOVFxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRtdWx0aXBseV86IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRmb3IgKHZhciBqPTE7ajxhcmd1bWVudHMubGVuZ3RoO2orKykge1xyXG5cdFx0XHRcdGNvbG9yMVtpXSAqPSBhcmd1bWVudHNbal1baV0gLyAyNTU7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29sb3IxW2ldID0gTWF0aC5yb3VuZChjb2xvcjFbaV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvbG9yMTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBJbnRlcnBvbGF0ZSAoYmxlbmQpIHR3byBjb2xvcnMgd2l0aCBhIGdpdmVuIGZhY3RvclxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxyXG5cdCAqIEBwYXJhbSB7ZmxvYXR9IFtmYWN0b3I9MC41XSAwLi4xXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdGludGVycG9sYXRlOiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMiwgZmFjdG9yKSB7XHJcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHsgZmFjdG9yID0gMC41OyB9XHJcblx0XHR2YXIgcmVzdWx0ID0gY29sb3IxLnNsaWNlKCk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRyZXN1bHRbaV0gPSBNYXRoLnJvdW5kKHJlc3VsdFtpXSArIGZhY3RvciooY29sb3IyW2ldLWNvbG9yMVtpXSkpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBJbnRlcnBvbGF0ZSAoYmxlbmQpIHR3byBjb2xvcnMgd2l0aCBhIGdpdmVuIGZhY3RvciBpbiBIU0wgbW9kZVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxyXG5cdCAqIEBwYXJhbSB7ZmxvYXR9IFtmYWN0b3I9MC41XSAwLi4xXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdGludGVycG9sYXRlSFNMOiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMiwgZmFjdG9yKSB7XHJcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHsgZmFjdG9yID0gMC41OyB9XHJcblx0XHR2YXIgaHNsMSA9IHRoaXMucmdiMmhzbChjb2xvcjEpO1xyXG5cdFx0dmFyIGhzbDIgPSB0aGlzLnJnYjJoc2woY29sb3IyKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdGhzbDFbaV0gKz0gZmFjdG9yKihoc2wyW2ldLWhzbDFbaV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXMuaHNsMnJnYihoc2wxKTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGUgYSBuZXcgcmFuZG9tIGNvbG9yIGJhc2VkIG9uIHRoaXMgb25lXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3JcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBkaWZmIFNldCBvZiBzdGFuZGFyZCBkZXZpYXRpb25zXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdHJhbmRvbWl6ZTogZnVuY3Rpb24oY29sb3IsIGRpZmYpIHtcclxuXHRcdGlmICghKGRpZmYgaW5zdGFuY2VvZiBBcnJheSkpIHsgZGlmZiA9IE1hdGgucm91bmQoUk9ULlJORy5nZXROb3JtYWwoMCwgZGlmZikpOyB9XHJcblx0XHR2YXIgcmVzdWx0ID0gY29sb3Iuc2xpY2UoKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdHJlc3VsdFtpXSArPSAoZGlmZiBpbnN0YW5jZW9mIEFycmF5ID8gTWF0aC5yb3VuZChST1QuUk5HLmdldE5vcm1hbCgwLCBkaWZmW2ldKSkgOiBkaWZmKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydHMgYW4gUkdCIGNvbG9yIHZhbHVlIHRvIEhTTC4gRXhwZWN0cyAwLi4yNTUgaW5wdXRzLCBwcm9kdWNlcyAwLi4xIG91dHB1dHMuXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3JcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0cmdiMmhzbDogZnVuY3Rpb24oY29sb3IpIHtcclxuXHRcdHZhciByID0gY29sb3JbMF0vMjU1O1xyXG5cdFx0dmFyIGcgPSBjb2xvclsxXS8yNTU7XHJcblx0XHR2YXIgYiA9IGNvbG9yWzJdLzI1NTtcclxuXHJcblx0XHR2YXIgbWF4ID0gTWF0aC5tYXgociwgZywgYiksIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xyXG5cdFx0dmFyIGgsIHMsIGwgPSAobWF4ICsgbWluKSAvIDI7XHJcblxyXG5cdFx0aWYgKG1heCA9PSBtaW4pIHtcclxuXHRcdFx0aCA9IHMgPSAwOyAvLyBhY2hyb21hdGljXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgZCA9IG1heCAtIG1pbjtcclxuXHRcdFx0cyA9IChsID4gMC41ID8gZCAvICgyIC0gbWF4IC0gbWluKSA6IGQgLyAobWF4ICsgbWluKSk7XHJcblx0XHRcdHN3aXRjaChtYXgpIHtcclxuXHRcdFx0XHRjYXNlIHI6IGggPSAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKTsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBnOiBoID0gKGIgLSByKSAvIGQgKyAyOyBicmVhaztcclxuXHRcdFx0XHRjYXNlIGI6IGggPSAociAtIGcpIC8gZCArIDQ7IGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGggLz0gNjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gW2gsIHMsIGxdO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbnZlcnRzIGFuIEhTTCBjb2xvciB2YWx1ZSB0byBSR0IuIEV4cGVjdHMgMC4uMSBpbnB1dHMsIHByb2R1Y2VzIDAuLjI1NSBvdXRwdXRzLlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdGhzbDJyZ2I6IGZ1bmN0aW9uKGNvbG9yKSB7XHJcblx0XHR2YXIgbCA9IGNvbG9yWzJdO1xyXG5cclxuXHRcdGlmIChjb2xvclsxXSA9PSAwKSB7XHJcblx0XHRcdGwgPSBNYXRoLnJvdW5kKGwqMjU1KTtcclxuXHRcdFx0cmV0dXJuIFtsLCBsLCBsXTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBodWUycmdiID0gZnVuY3Rpb24ocCwgcSwgdCkge1xyXG5cdFx0XHRcdGlmICh0IDwgMCkgdCArPSAxO1xyXG5cdFx0XHRcdGlmICh0ID4gMSkgdCAtPSAxO1xyXG5cdFx0XHRcdGlmICh0IDwgMS82KSByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcclxuXHRcdFx0XHRpZiAodCA8IDEvMikgcmV0dXJuIHE7XHJcblx0XHRcdFx0aWYgKHQgPCAyLzMpIHJldHVybiBwICsgKHEgLSBwKSAqICgyLzMgLSB0KSAqIDY7XHJcblx0XHRcdFx0cmV0dXJuIHA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBzID0gY29sb3JbMV07XHJcblx0XHRcdHZhciBxID0gKGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHMpO1xyXG5cdFx0XHR2YXIgcCA9IDIgKiBsIC0gcTtcclxuXHRcdFx0dmFyIHIgPSBodWUycmdiKHAsIHEsIGNvbG9yWzBdICsgMS8zKTtcclxuXHRcdFx0dmFyIGcgPSBodWUycmdiKHAsIHEsIGNvbG9yWzBdKTtcclxuXHRcdFx0dmFyIGIgPSBodWUycmdiKHAsIHEsIGNvbG9yWzBdIC0gMS8zKTtcclxuXHRcdFx0cmV0dXJuIFtNYXRoLnJvdW5kKHIqMjU1KSwgTWF0aC5yb3VuZChnKjI1NSksIE1hdGgucm91bmQoYioyNTUpXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR0b1JHQjogZnVuY3Rpb24oY29sb3IpIHtcclxuXHRcdHJldHVybiBcInJnYihcIiArIHRoaXMuX2NsYW1wKGNvbG9yWzBdKSArIFwiLFwiICsgdGhpcy5fY2xhbXAoY29sb3JbMV0pICsgXCIsXCIgKyB0aGlzLl9jbGFtcChjb2xvclsyXSkgKyBcIilcIjtcclxuXHR9LFxyXG5cclxuXHR0b0hleDogZnVuY3Rpb24oY29sb3IpIHtcclxuXHRcdHZhciBwYXJ0cyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0cGFydHMucHVzaCh0aGlzLl9jbGFtcChjb2xvcltpXSkudG9TdHJpbmcoMTYpLmxwYWQoXCIwXCIsIDIpKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBcIiNcIiArIHBhcnRzLmpvaW4oXCJcIik7XHJcblx0fSxcclxuXHJcblx0X2NsYW1wOiBmdW5jdGlvbihudW0pIHtcclxuXHRcdGlmIChudW0gPCAwKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fSBlbHNlIGlmIChudW0gPiAyNTUpIHtcclxuXHRcdFx0cmV0dXJuIDI1NTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBudW07XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X2NhY2hlOiB7XHJcblx0XHRcImJsYWNrXCI6IFswLDAsMF0sXHJcblx0XHRcIm5hdnlcIjogWzAsMCwxMjhdLFxyXG5cdFx0XCJkYXJrYmx1ZVwiOiBbMCwwLDEzOV0sXHJcblx0XHRcIm1lZGl1bWJsdWVcIjogWzAsMCwyMDVdLFxyXG5cdFx0XCJibHVlXCI6IFswLDAsMjU1XSxcclxuXHRcdFwiZGFya2dyZWVuXCI6IFswLDEwMCwwXSxcclxuXHRcdFwiZ3JlZW5cIjogWzAsMTI4LDBdLFxyXG5cdFx0XCJ0ZWFsXCI6IFswLDEyOCwxMjhdLFxyXG5cdFx0XCJkYXJrY3lhblwiOiBbMCwxMzksMTM5XSxcclxuXHRcdFwiZGVlcHNreWJsdWVcIjogWzAsMTkxLDI1NV0sXHJcblx0XHRcImRhcmt0dXJxdW9pc2VcIjogWzAsMjA2LDIwOV0sXHJcblx0XHRcIm1lZGl1bXNwcmluZ2dyZWVuXCI6IFswLDI1MCwxNTRdLFxyXG5cdFx0XCJsaW1lXCI6IFswLDI1NSwwXSxcclxuXHRcdFwic3ByaW5nZ3JlZW5cIjogWzAsMjU1LDEyN10sXHJcblx0XHRcImFxdWFcIjogWzAsMjU1LDI1NV0sXHJcblx0XHRcImN5YW5cIjogWzAsMjU1LDI1NV0sXHJcblx0XHRcIm1pZG5pZ2h0Ymx1ZVwiOiBbMjUsMjUsMTEyXSxcclxuXHRcdFwiZG9kZ2VyYmx1ZVwiOiBbMzAsMTQ0LDI1NV0sXHJcblx0XHRcImZvcmVzdGdyZWVuXCI6IFszNCwxMzksMzRdLFxyXG5cdFx0XCJzZWFncmVlblwiOiBbNDYsMTM5LDg3XSxcclxuXHRcdFwiZGFya3NsYXRlZ3JheVwiOiBbNDcsNzksNzldLFxyXG5cdFx0XCJkYXJrc2xhdGVncmV5XCI6IFs0Nyw3OSw3OV0sXHJcblx0XHRcImxpbWVncmVlblwiOiBbNTAsMjA1LDUwXSxcclxuXHRcdFwibWVkaXVtc2VhZ3JlZW5cIjogWzYwLDE3OSwxMTNdLFxyXG5cdFx0XCJ0dXJxdW9pc2VcIjogWzY0LDIyNCwyMDhdLFxyXG5cdFx0XCJyb3lhbGJsdWVcIjogWzY1LDEwNSwyMjVdLFxyXG5cdFx0XCJzdGVlbGJsdWVcIjogWzcwLDEzMCwxODBdLFxyXG5cdFx0XCJkYXJrc2xhdGVibHVlXCI6IFs3Miw2MSwxMzldLFxyXG5cdFx0XCJtZWRpdW10dXJxdW9pc2VcIjogWzcyLDIwOSwyMDRdLFxyXG5cdFx0XCJpbmRpZ29cIjogWzc1LDAsMTMwXSxcclxuXHRcdFwiZGFya29saXZlZ3JlZW5cIjogWzg1LDEwNyw0N10sXHJcblx0XHRcImNhZGV0Ymx1ZVwiOiBbOTUsMTU4LDE2MF0sXHJcblx0XHRcImNvcm5mbG93ZXJibHVlXCI6IFsxMDAsMTQ5LDIzN10sXHJcblx0XHRcIm1lZGl1bWFxdWFtYXJpbmVcIjogWzEwMiwyMDUsMTcwXSxcclxuXHRcdFwiZGltZ3JheVwiOiBbMTA1LDEwNSwxMDVdLFxyXG5cdFx0XCJkaW1ncmV5XCI6IFsxMDUsMTA1LDEwNV0sXHJcblx0XHRcInNsYXRlYmx1ZVwiOiBbMTA2LDkwLDIwNV0sXHJcblx0XHRcIm9saXZlZHJhYlwiOiBbMTA3LDE0MiwzNV0sXHJcblx0XHRcInNsYXRlZ3JheVwiOiBbMTEyLDEyOCwxNDRdLFxyXG5cdFx0XCJzbGF0ZWdyZXlcIjogWzExMiwxMjgsMTQ0XSxcclxuXHRcdFwibGlnaHRzbGF0ZWdyYXlcIjogWzExOSwxMzYsMTUzXSxcclxuXHRcdFwibGlnaHRzbGF0ZWdyZXlcIjogWzExOSwxMzYsMTUzXSxcclxuXHRcdFwibWVkaXVtc2xhdGVibHVlXCI6IFsxMjMsMTA0LDIzOF0sXHJcblx0XHRcImxhd25ncmVlblwiOiBbMTI0LDI1MiwwXSxcclxuXHRcdFwiY2hhcnRyZXVzZVwiOiBbMTI3LDI1NSwwXSxcclxuXHRcdFwiYXF1YW1hcmluZVwiOiBbMTI3LDI1NSwyMTJdLFxyXG5cdFx0XCJtYXJvb25cIjogWzEyOCwwLDBdLFxyXG5cdFx0XCJwdXJwbGVcIjogWzEyOCwwLDEyOF0sXHJcblx0XHRcIm9saXZlXCI6IFsxMjgsMTI4LDBdLFxyXG5cdFx0XCJncmF5XCI6IFsxMjgsMTI4LDEyOF0sXHJcblx0XHRcImdyZXlcIjogWzEyOCwxMjgsMTI4XSxcclxuXHRcdFwic2t5Ymx1ZVwiOiBbMTM1LDIwNiwyMzVdLFxyXG5cdFx0XCJsaWdodHNreWJsdWVcIjogWzEzNSwyMDYsMjUwXSxcclxuXHRcdFwiYmx1ZXZpb2xldFwiOiBbMTM4LDQzLDIyNl0sXHJcblx0XHRcImRhcmtyZWRcIjogWzEzOSwwLDBdLFxyXG5cdFx0XCJkYXJrbWFnZW50YVwiOiBbMTM5LDAsMTM5XSxcclxuXHRcdFwic2FkZGxlYnJvd25cIjogWzEzOSw2OSwxOV0sXHJcblx0XHRcImRhcmtzZWFncmVlblwiOiBbMTQzLDE4OCwxNDNdLFxyXG5cdFx0XCJsaWdodGdyZWVuXCI6IFsxNDQsMjM4LDE0NF0sXHJcblx0XHRcIm1lZGl1bXB1cnBsZVwiOiBbMTQ3LDExMiwyMTZdLFxyXG5cdFx0XCJkYXJrdmlvbGV0XCI6IFsxNDgsMCwyMTFdLFxyXG5cdFx0XCJwYWxlZ3JlZW5cIjogWzE1MiwyNTEsMTUyXSxcclxuXHRcdFwiZGFya29yY2hpZFwiOiBbMTUzLDUwLDIwNF0sXHJcblx0XHRcInllbGxvd2dyZWVuXCI6IFsxNTQsMjA1LDUwXSxcclxuXHRcdFwic2llbm5hXCI6IFsxNjAsODIsNDVdLFxyXG5cdFx0XCJicm93blwiOiBbMTY1LDQyLDQyXSxcclxuXHRcdFwiZGFya2dyYXlcIjogWzE2OSwxNjksMTY5XSxcclxuXHRcdFwiZGFya2dyZXlcIjogWzE2OSwxNjksMTY5XSxcclxuXHRcdFwibGlnaHRibHVlXCI6IFsxNzMsMjE2LDIzMF0sXHJcblx0XHRcImdyZWVueWVsbG93XCI6IFsxNzMsMjU1LDQ3XSxcclxuXHRcdFwicGFsZXR1cnF1b2lzZVwiOiBbMTc1LDIzOCwyMzhdLFxyXG5cdFx0XCJsaWdodHN0ZWVsYmx1ZVwiOiBbMTc2LDE5NiwyMjJdLFxyXG5cdFx0XCJwb3dkZXJibHVlXCI6IFsxNzYsMjI0LDIzMF0sXHJcblx0XHRcImZpcmVicmlja1wiOiBbMTc4LDM0LDM0XSxcclxuXHRcdFwiZGFya2dvbGRlbnJvZFwiOiBbMTg0LDEzNCwxMV0sXHJcblx0XHRcIm1lZGl1bW9yY2hpZFwiOiBbMTg2LDg1LDIxMV0sXHJcblx0XHRcInJvc3licm93blwiOiBbMTg4LDE0MywxNDNdLFxyXG5cdFx0XCJkYXJra2hha2lcIjogWzE4OSwxODMsMTA3XSxcclxuXHRcdFwic2lsdmVyXCI6IFsxOTIsMTkyLDE5Ml0sXHJcblx0XHRcIm1lZGl1bXZpb2xldHJlZFwiOiBbMTk5LDIxLDEzM10sXHJcblx0XHRcImluZGlhbnJlZFwiOiBbMjA1LDkyLDkyXSxcclxuXHRcdFwicGVydVwiOiBbMjA1LDEzMyw2M10sXHJcblx0XHRcImNob2NvbGF0ZVwiOiBbMjEwLDEwNSwzMF0sXHJcblx0XHRcInRhblwiOiBbMjEwLDE4MCwxNDBdLFxyXG5cdFx0XCJsaWdodGdyYXlcIjogWzIxMSwyMTEsMjExXSxcclxuXHRcdFwibGlnaHRncmV5XCI6IFsyMTEsMjExLDIxMV0sXHJcblx0XHRcInBhbGV2aW9sZXRyZWRcIjogWzIxNiwxMTIsMTQ3XSxcclxuXHRcdFwidGhpc3RsZVwiOiBbMjE2LDE5MSwyMTZdLFxyXG5cdFx0XCJvcmNoaWRcIjogWzIxOCwxMTIsMjE0XSxcclxuXHRcdFwiZ29sZGVucm9kXCI6IFsyMTgsMTY1LDMyXSxcclxuXHRcdFwiY3JpbXNvblwiOiBbMjIwLDIwLDYwXSxcclxuXHRcdFwiZ2FpbnNib3JvXCI6IFsyMjAsMjIwLDIyMF0sXHJcblx0XHRcInBsdW1cIjogWzIyMSwxNjAsMjIxXSxcclxuXHRcdFwiYnVybHl3b29kXCI6IFsyMjIsMTg0LDEzNV0sXHJcblx0XHRcImxpZ2h0Y3lhblwiOiBbMjI0LDI1NSwyNTVdLFxyXG5cdFx0XCJsYXZlbmRlclwiOiBbMjMwLDIzMCwyNTBdLFxyXG5cdFx0XCJkYXJrc2FsbW9uXCI6IFsyMzMsMTUwLDEyMl0sXHJcblx0XHRcInZpb2xldFwiOiBbMjM4LDEzMCwyMzhdLFxyXG5cdFx0XCJwYWxlZ29sZGVucm9kXCI6IFsyMzgsMjMyLDE3MF0sXHJcblx0XHRcImxpZ2h0Y29yYWxcIjogWzI0MCwxMjgsMTI4XSxcclxuXHRcdFwia2hha2lcIjogWzI0MCwyMzAsMTQwXSxcclxuXHRcdFwiYWxpY2VibHVlXCI6IFsyNDAsMjQ4LDI1NV0sXHJcblx0XHRcImhvbmV5ZGV3XCI6IFsyNDAsMjU1LDI0MF0sXHJcblx0XHRcImF6dXJlXCI6IFsyNDAsMjU1LDI1NV0sXHJcblx0XHRcInNhbmR5YnJvd25cIjogWzI0NCwxNjQsOTZdLFxyXG5cdFx0XCJ3aGVhdFwiOiBbMjQ1LDIyMiwxNzldLFxyXG5cdFx0XCJiZWlnZVwiOiBbMjQ1LDI0NSwyMjBdLFxyXG5cdFx0XCJ3aGl0ZXNtb2tlXCI6IFsyNDUsMjQ1LDI0NV0sXHJcblx0XHRcIm1pbnRjcmVhbVwiOiBbMjQ1LDI1NSwyNTBdLFxyXG5cdFx0XCJnaG9zdHdoaXRlXCI6IFsyNDgsMjQ4LDI1NV0sXHJcblx0XHRcInNhbG1vblwiOiBbMjUwLDEyOCwxMTRdLFxyXG5cdFx0XCJhbnRpcXVld2hpdGVcIjogWzI1MCwyMzUsMjE1XSxcclxuXHRcdFwibGluZW5cIjogWzI1MCwyNDAsMjMwXSxcclxuXHRcdFwibGlnaHRnb2xkZW5yb2R5ZWxsb3dcIjogWzI1MCwyNTAsMjEwXSxcclxuXHRcdFwib2xkbGFjZVwiOiBbMjUzLDI0NSwyMzBdLFxyXG5cdFx0XCJyZWRcIjogWzI1NSwwLDBdLFxyXG5cdFx0XCJmdWNoc2lhXCI6IFsyNTUsMCwyNTVdLFxyXG5cdFx0XCJtYWdlbnRhXCI6IFsyNTUsMCwyNTVdLFxyXG5cdFx0XCJkZWVwcGlua1wiOiBbMjU1LDIwLDE0N10sXHJcblx0XHRcIm9yYW5nZXJlZFwiOiBbMjU1LDY5LDBdLFxyXG5cdFx0XCJ0b21hdG9cIjogWzI1NSw5OSw3MV0sXHJcblx0XHRcImhvdHBpbmtcIjogWzI1NSwxMDUsMTgwXSxcclxuXHRcdFwiY29yYWxcIjogWzI1NSwxMjcsODBdLFxyXG5cdFx0XCJkYXJrb3JhbmdlXCI6IFsyNTUsMTQwLDBdLFxyXG5cdFx0XCJsaWdodHNhbG1vblwiOiBbMjU1LDE2MCwxMjJdLFxyXG5cdFx0XCJvcmFuZ2VcIjogWzI1NSwxNjUsMF0sXHJcblx0XHRcImxpZ2h0cGlua1wiOiBbMjU1LDE4MiwxOTNdLFxyXG5cdFx0XCJwaW5rXCI6IFsyNTUsMTkyLDIwM10sXHJcblx0XHRcImdvbGRcIjogWzI1NSwyMTUsMF0sXHJcblx0XHRcInBlYWNocHVmZlwiOiBbMjU1LDIxOCwxODVdLFxyXG5cdFx0XCJuYXZham93aGl0ZVwiOiBbMjU1LDIyMiwxNzNdLFxyXG5cdFx0XCJtb2NjYXNpblwiOiBbMjU1LDIyOCwxODFdLFxyXG5cdFx0XCJiaXNxdWVcIjogWzI1NSwyMjgsMTk2XSxcclxuXHRcdFwibWlzdHlyb3NlXCI6IFsyNTUsMjI4LDIyNV0sXHJcblx0XHRcImJsYW5jaGVkYWxtb25kXCI6IFsyNTUsMjM1LDIwNV0sXHJcblx0XHRcInBhcGF5YXdoaXBcIjogWzI1NSwyMzksMjEzXSxcclxuXHRcdFwibGF2ZW5kZXJibHVzaFwiOiBbMjU1LDI0MCwyNDVdLFxyXG5cdFx0XCJzZWFzaGVsbFwiOiBbMjU1LDI0NSwyMzhdLFxyXG5cdFx0XCJjb3Juc2lsa1wiOiBbMjU1LDI0OCwyMjBdLFxyXG5cdFx0XCJsZW1vbmNoaWZmb25cIjogWzI1NSwyNTAsMjA1XSxcclxuXHRcdFwiZmxvcmFsd2hpdGVcIjogWzI1NSwyNTAsMjQwXSxcclxuXHRcdFwic25vd1wiOiBbMjU1LDI1MCwyNTBdLFxyXG5cdFx0XCJ5ZWxsb3dcIjogWzI1NSwyNTUsMF0sXHJcblx0XHRcImxpZ2h0eWVsbG93XCI6IFsyNTUsMjU1LDIyNF0sXHJcblx0XHRcIml2b3J5XCI6IFsyNTUsMjU1LDI0MF0sXHJcblx0XHRcIndoaXRlXCI6IFsyNTUsMjU1LDI1NV1cclxuXHR9XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgTGlnaHRpbmcgY29tcHV0YXRpb24sIGJhc2VkIG9uIGEgdHJhZGl0aW9uYWwgRk9WIGZvciBtdWx0aXBsZSBsaWdodCBzb3VyY2VzIGFuZCBtdWx0aXBsZSBwYXNzZXMuXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHJlZmxlY3Rpdml0eUNhbGxiYWNrIENhbGxiYWNrIHRvIHJldHJpZXZlIGNlbGwgcmVmbGVjdGl2aXR5ICgwLi4xKVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5wYXNzZXM9MV0gTnVtYmVyIG9mIHBhc3Nlcy4gMSBlcXVhbHMgdG8gc2ltcGxlIEZPViBvZiBhbGwgbGlnaHQgc291cmNlcywgPjEgbWVhbnMgYSAqaGlnaGx5IHNpbXBsaWZpZWQqIHJhZGlvc2l0eS1saWtlIGFsZ29yaXRobS5cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLmVtaXNzaW9uVGhyZXNob2xkPTEwMF0gQ2VsbHMgd2l0aCBlbWlzc2l2aXR5ID4gdGhyZXNob2xkIHdpbGwgYmUgdHJlYXRlZCBhcyBsaWdodCBzb3VyY2UgaW4gdGhlIG5leHQgcGFzcy5cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnJhbmdlPTEwXSBNYXggbGlnaHQgcmFuZ2VcclxuICovXHJcblJPVC5MaWdodGluZyA9IGZ1bmN0aW9uKHJlZmxlY3Rpdml0eUNhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FsbGJhY2sgPSByZWZsZWN0aXZpdHlDYWxsYmFjaztcclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0cGFzc2VzOiAxLFxyXG5cdFx0ZW1pc3Npb25UaHJlc2hvbGQ6IDEwMCxcclxuXHRcdHJhbmdlOiAxMFxyXG5cdH07XHJcblx0dGhpcy5fZm92ID0gbnVsbDtcclxuXHJcblx0dGhpcy5fbGlnaHRzID0ge307XHJcblx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGUgPSB7fTtcclxuXHR0aGlzLl9mb3ZDYWNoZSA9IHt9O1xyXG5cclxuXHR0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRqdXN0IG9wdGlvbnMgYXQgcnVudGltZVxyXG4gKiBAc2VlIFJPVC5MaWdodGluZ1xyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblx0aWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5yYW5nZSkgeyB0aGlzLnJlc2V0KCk7IH1cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHVzZWQgRmllbGQtT2YtVmlldyBhbGdvXHJcbiAqIEBwYXJhbSB7Uk9ULkZPVn0gZm92XHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLnNldEZPViA9IGZ1bmN0aW9uKGZvdikge1xyXG5cdHRoaXMuX2ZvdiA9IGZvdjtcclxuXHR0aGlzLl9mb3ZDYWNoZSA9IHt9O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCAob3IgcmVtb3ZlKSBhIGxpZ2h0IHNvdXJjZVxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge251bGwgfHwgc3RyaW5nIHx8IG51bWJlclszXX0gY29sb3JcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuc2V0TGlnaHQgPSBmdW5jdGlvbih4LCB5LCBjb2xvcikge1xyXG4gIHZhciBrZXkgPSB4ICsgXCIsXCIgKyB5O1xyXG5cclxuICBpZiAoY29sb3IpIHtcclxuICAgIHRoaXMuX2xpZ2h0c1trZXldID0gKHR5cGVvZihjb2xvcikgPT0gXCJzdHJpbmdcIiA/IFJPVC5Db2xvci5mcm9tU3RyaW5nKGNvbG9yKSA6IGNvbG9yKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZGVsZXRlIHRoaXMuX2xpZ2h0c1trZXldO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgYWxsIGxpZ2h0IHNvdXJjZXNcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuY2xlYXJMaWdodHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX2xpZ2h0cyA9IHt9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlc2V0IHRoZSBwcmUtY29tcHV0ZWQgdG9wb2xvZ3kgdmFsdWVzLiBDYWxsIHdoZW5ldmVyIHRoZSB1bmRlcmx5aW5nIG1hcCBjaGFuZ2VzIGl0cyBsaWdodC1wYXNzYWJpbGl0eS5cclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZSA9IHt9O1xyXG5cdHRoaXMuX2ZvdkNhY2hlID0ge307XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdGhlIGxpZ2h0aW5nXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpZ2h0aW5nQ2FsbGJhY2sgV2lsbCBiZSBjYWxsZWQgd2l0aCAoeCwgeSwgY29sb3IpIGZvciBldmVyeSBsaXQgY2VsbFxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24obGlnaHRpbmdDYWxsYmFjaykge1xyXG5cdHZhciBkb25lQ2VsbHMgPSB7fTtcclxuXHR2YXIgZW1pdHRpbmdDZWxscyA9IHt9O1xyXG5cdHZhciBsaXRDZWxscyA9IHt9O1xyXG5cclxuXHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fbGlnaHRzKSB7IC8qIHByZXBhcmUgZW1pdHRlcnMgZm9yIGZpcnN0IHBhc3MgKi9cclxuXHRcdHZhciBsaWdodCA9IHRoaXMuX2xpZ2h0c1trZXldO1xyXG5cdFx0ZW1pdHRpbmdDZWxsc1trZXldID0gWzAsIDAsIDBdO1xyXG5cdFx0Uk9ULkNvbG9yLmFkZF8oZW1pdHRpbmdDZWxsc1trZXldLCBsaWdodCk7XHJcblx0fVxyXG5cclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9vcHRpb25zLnBhc3NlcztpKyspIHsgLyogbWFpbiBsb29wICovXHJcblx0XHR0aGlzLl9lbWl0TGlnaHQoZW1pdHRpbmdDZWxscywgbGl0Q2VsbHMsIGRvbmVDZWxscyk7XHJcblx0XHRpZiAoaSsxID09IHRoaXMuX29wdGlvbnMucGFzc2VzKSB7IGNvbnRpbnVlOyB9IC8qIG5vdCBmb3IgdGhlIGxhc3QgcGFzcyAqL1xyXG5cdFx0ZW1pdHRpbmdDZWxscyA9IHRoaXMuX2NvbXB1dGVFbWl0dGVycyhsaXRDZWxscywgZG9uZUNlbGxzKTtcclxuXHR9XHJcblxyXG5cdGZvciAodmFyIGxpdEtleSBpbiBsaXRDZWxscykgeyAvKiBsZXQgdGhlIHVzZXIga25vdyB3aGF0IGFuZCBob3cgaXMgbGl0ICovXHJcblx0XHR2YXIgcGFydHMgPSBsaXRLZXkuc3BsaXQoXCIsXCIpO1xyXG5cdFx0dmFyIHggPSBwYXJzZUludChwYXJ0c1swXSk7XHJcblx0XHR2YXIgeSA9IHBhcnNlSW50KHBhcnRzWzFdKTtcclxuXHRcdGxpZ2h0aW5nQ2FsbGJhY2soeCwgeSwgbGl0Q2VsbHNbbGl0S2V5XSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIG9uZSBpdGVyYXRpb24gZnJvbSBhbGwgZW1pdHRpbmcgY2VsbHNcclxuICogQHBhcmFtIHtvYmplY3R9IGVtaXR0aW5nQ2VsbHMgVGhlc2UgZW1pdCBsaWdodFxyXG4gKiBAcGFyYW0ge29iamVjdH0gbGl0Q2VsbHMgQWRkIHByb2plY3RlZCBsaWdodCB0byB0aGVzZVxyXG4gKiBAcGFyYW0ge29iamVjdH0gZG9uZUNlbGxzIFRoZXNlIGFscmVhZHkgZW1pdHRlZCwgZm9yYmlkIHRoZW0gZnJvbSBmdXJ0aGVyIGNhbGN1bGF0aW9uc1xyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5fZW1pdExpZ2h0ID0gZnVuY3Rpb24oZW1pdHRpbmdDZWxscywgbGl0Q2VsbHMsIGRvbmVDZWxscykge1xyXG5cdGZvciAodmFyIGtleSBpbiBlbWl0dGluZ0NlbGxzKSB7XHJcblx0XHR2YXIgcGFydHMgPSBrZXkuc3BsaXQoXCIsXCIpO1xyXG5cdFx0dmFyIHggPSBwYXJzZUludChwYXJ0c1swXSk7XHJcblx0XHR2YXIgeSA9IHBhcnNlSW50KHBhcnRzWzFdKTtcclxuXHRcdHRoaXMuX2VtaXRMaWdodEZyb21DZWxsKHgsIHksIGVtaXR0aW5nQ2VsbHNba2V5XSwgbGl0Q2VsbHMpO1xyXG5cdFx0ZG9uZUNlbGxzW2tleV0gPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQcmVwYXJlIGEgbGlzdCBvZiBlbWl0dGVycyBmb3IgbmV4dCBwYXNzXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBsaXRDZWxsc1xyXG4gKiBAcGFyYW0ge29iamVjdH0gZG9uZUNlbGxzXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLl9jb21wdXRlRW1pdHRlcnMgPSBmdW5jdGlvbihsaXRDZWxscywgZG9uZUNlbGxzKSB7XHJcblx0dmFyIHJlc3VsdCA9IHt9O1xyXG5cclxuXHRmb3IgKHZhciBrZXkgaW4gbGl0Q2VsbHMpIHtcclxuXHRcdGlmIChrZXkgaW4gZG9uZUNlbGxzKSB7IGNvbnRpbnVlOyB9IC8qIGFscmVhZHkgZW1pdHRlZCAqL1xyXG5cclxuXHRcdHZhciBjb2xvciA9IGxpdENlbGxzW2tleV07XHJcblxyXG5cdFx0aWYgKGtleSBpbiB0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZSkge1xyXG5cdFx0XHR2YXIgcmVmbGVjdGl2aXR5ID0gdGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGVba2V5XTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XHJcblx0XHRcdHZhciB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xyXG5cdFx0XHR2YXIgeSA9IHBhcnNlSW50KHBhcnRzWzFdKTtcclxuXHRcdFx0dmFyIHJlZmxlY3Rpdml0eSA9IHRoaXMuX3JlZmxlY3Rpdml0eUNhbGxiYWNrKHgsIHkpO1xyXG5cdFx0XHR0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZVtrZXldID0gcmVmbGVjdGl2aXR5O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChyZWZsZWN0aXZpdHkgPT0gMCkgeyBjb250aW51ZTsgfSAvKiB3aWxsIG5vdCByZWZsZWN0IGF0IGFsbCAqL1xyXG5cclxuXHRcdC8qIGNvbXB1dGUgZW1pc3Npb24gY29sb3IgKi9cclxuXHRcdHZhciBlbWlzc2lvbiA9IFtdO1xyXG5cdFx0dmFyIGludGVuc2l0eSA9IDA7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHR2YXIgcGFydCA9IE1hdGgucm91bmQoY29sb3JbaV0qcmVmbGVjdGl2aXR5KTtcclxuXHRcdFx0ZW1pc3Npb25baV0gPSBwYXJ0O1xyXG5cdFx0XHRpbnRlbnNpdHkgKz0gcGFydDtcclxuXHRcdH1cclxuXHRcdGlmIChpbnRlbnNpdHkgPiB0aGlzLl9vcHRpb25zLmVtaXNzaW9uVGhyZXNob2xkKSB7IHJlc3VsdFtrZXldID0gZW1pc3Npb247IH1cclxuXHR9XHJcblxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBvbmUgaXRlcmF0aW9uIGZyb20gb25lIGNlbGxcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3JcclxuICogQHBhcmFtIHtvYmplY3R9IGxpdENlbGxzIENlbGwgZGF0YSB0byBieSB1cGRhdGVkXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLl9lbWl0TGlnaHRGcm9tQ2VsbCA9IGZ1bmN0aW9uKHgsIHksIGNvbG9yLCBsaXRDZWxscykge1xyXG5cdHZhciBrZXkgPSB4K1wiLFwiK3k7XHJcblx0aWYgKGtleSBpbiB0aGlzLl9mb3ZDYWNoZSkge1xyXG5cdFx0dmFyIGZvdiA9IHRoaXMuX2ZvdkNhY2hlW2tleV07XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBmb3YgPSB0aGlzLl91cGRhdGVGT1YoeCwgeSk7XHJcblx0fVxyXG5cclxuXHRmb3IgKHZhciBmb3ZLZXkgaW4gZm92KSB7XHJcblx0XHR2YXIgZm9ybUZhY3RvciA9IGZvdltmb3ZLZXldO1xyXG5cclxuXHRcdGlmIChmb3ZLZXkgaW4gbGl0Q2VsbHMpIHsgLyogYWxyZWFkeSBsaXQgKi9cclxuXHRcdFx0dmFyIHJlc3VsdCA9IGxpdENlbGxzW2ZvdktleV07XHJcblx0XHR9IGVsc2UgeyAvKiBuZXdseSBsaXQgKi9cclxuXHRcdFx0dmFyIHJlc3VsdCA9IFswLCAwLCAwXTtcclxuXHRcdFx0bGl0Q2VsbHNbZm92S2V5XSA9IHJlc3VsdDtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykgeyByZXN1bHRbaV0gKz0gTWF0aC5yb3VuZChjb2xvcltpXSpmb3JtRmFjdG9yKTsgfSAvKiBhZGQgbGlnaHQgY29sb3IgKi9cclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgRk9WIChcImZvcm0gZmFjdG9yXCIpIGZvciBhIHBvdGVudGlhbCBsaWdodCBzb3VyY2UgYXQgW3gseV1cclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHJldHVybnMge29iamVjdH1cclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuX3VwZGF0ZUZPViA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHR2YXIga2V5MSA9IHgrXCIsXCIreTtcclxuXHR2YXIgY2FjaGUgPSB7fTtcclxuXHR0aGlzLl9mb3ZDYWNoZVtrZXkxXSA9IGNhY2hlO1xyXG5cdHZhciByYW5nZSA9IHRoaXMuX29wdGlvbnMucmFuZ2U7XHJcblx0dmFyIGNiID0gZnVuY3Rpb24oeCwgeSwgciwgdmlzKSB7XHJcblx0XHR2YXIga2V5MiA9IHgrXCIsXCIreTtcclxuXHRcdHZhciBmb3JtRmFjdG9yID0gdmlzICogKDEtci9yYW5nZSk7XHJcblx0XHRpZiAoZm9ybUZhY3RvciA9PSAwKSB7IHJldHVybjsgfVxyXG5cdFx0Y2FjaGVba2V5Ml0gPSBmb3JtRmFjdG9yO1xyXG5cdH07XHJcblx0dGhpcy5fZm92LmNvbXB1dGUoeCwgeSwgcmFuZ2UsIGNiLmJpbmQodGhpcykpO1xyXG5cclxuXHRyZXR1cm4gY2FjaGU7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQWJzdHJhY3QgcGF0aGZpbmRlclxyXG4gKiBAcGFyYW0ge2ludH0gdG9YIFRhcmdldCBYIGNvb3JkXHJcbiAqIEBwYXJhbSB7aW50fSB0b1kgVGFyZ2V0IFkgY29vcmRcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gcGFzc2FibGVDYWxsYmFjayBDYWxsYmFjayB0byBkZXRlcm1pbmUgbWFwIHBhc3NhYmlsaXR5XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5PThdXHJcbiAqL1xyXG5ST1QuUGF0aCA9IGZ1bmN0aW9uKHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0dGhpcy5fdG9YID0gdG9YO1xyXG5cdHRoaXMuX3RvWSA9IHRvWTtcclxuXHR0aGlzLl9mcm9tWCA9IG51bGw7XHJcblx0dGhpcy5fZnJvbVkgPSBudWxsO1xyXG5cdHRoaXMuX3Bhc3NhYmxlQ2FsbGJhY2sgPSBwYXNzYWJsZUNhbGxiYWNrO1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHR0b3BvbG9neTogOFxyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblxyXG5cdHRoaXMuX2RpcnMgPSBST1QuRElSU1t0aGlzLl9vcHRpb25zLnRvcG9sb2d5XTtcclxuXHRpZiAodGhpcy5fb3B0aW9ucy50b3BvbG9neSA9PSA4KSB7IC8qIHJlb3JkZXIgZGlycyBmb3IgbW9yZSBhZXN0aGV0aWMgcmVzdWx0ICh2ZXJ0aWNhbC9ob3Jpem9udGFsIGZpcnN0KSAqL1xyXG5cdFx0dGhpcy5fZGlycyA9IFtcclxuXHRcdFx0dGhpcy5fZGlyc1swXSxcclxuXHRcdFx0dGhpcy5fZGlyc1syXSxcclxuXHRcdFx0dGhpcy5fZGlyc1s0XSxcclxuXHRcdFx0dGhpcy5fZGlyc1s2XSxcclxuXHRcdFx0dGhpcy5fZGlyc1sxXSxcclxuXHRcdFx0dGhpcy5fZGlyc1szXSxcclxuXHRcdFx0dGhpcy5fZGlyc1s1XSxcclxuXHRcdFx0dGhpcy5fZGlyc1s3XVxyXG5cdFx0XVxyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIGEgcGF0aCBmcm9tIGEgZ2l2ZW4gcG9pbnRcclxuICogQHBhcmFtIHtpbnR9IGZyb21YXHJcbiAqIEBwYXJhbSB7aW50fSBmcm9tWVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBXaWxsIGJlIGNhbGxlZCBmb3IgZXZlcnkgcGF0aCBpdGVtIHdpdGggYXJndW1lbnRzIFwieFwiIGFuZCBcInlcIlxyXG4gKi9cclxuUk9ULlBhdGgucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihmcm9tWCwgZnJvbVksIGNhbGxiYWNrKSB7XHJcbn07XHJcblxyXG5ST1QuUGF0aC5wcm90b3R5cGUuX2dldE5laWdoYm9ycyA9IGZ1bmN0aW9uKGN4LCBjeSkge1xyXG5cdHZhciByZXN1bHQgPSBbXTtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9kaXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBkaXIgPSB0aGlzLl9kaXJzW2ldO1xyXG5cdFx0dmFyIHggPSBjeCArIGRpclswXTtcclxuXHRcdHZhciB5ID0gY3kgKyBkaXJbMV07XHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5fcGFzc2FibGVDYWxsYmFjayh4LCB5KSkgeyBjb250aW51ZTsgfVxyXG5cdFx0cmVzdWx0LnB1c2goW3gsIHldKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBTaW1wbGlmaWVkIERpamtzdHJhJ3MgYWxnb3JpdGhtOiBhbGwgZWRnZXMgaGF2ZSBhIHZhbHVlIG9mIDFcclxuICogQGF1Z21lbnRzIFJPVC5QYXRoXHJcbiAqIEBzZWUgUk9ULlBhdGhcclxuICovXHJcblJPVC5QYXRoLkRpamtzdHJhID0gZnVuY3Rpb24odG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHRST1QuUGF0aC5jYWxsKHRoaXMsIHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zKTtcclxuXHJcblx0dGhpcy5fY29tcHV0ZWQgPSB7fTtcclxuXHR0aGlzLl90b2RvID0gW107XHJcblx0dGhpcy5fYWRkKHRvWCwgdG9ZLCBudWxsKTtcclxufTtcclxuUk9ULlBhdGguRGlqa3N0cmEuZXh0ZW5kKFJPVC5QYXRoKTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIGEgcGF0aCBmcm9tIGEgZ2l2ZW4gcG9pbnRcclxuICogQHNlZSBST1QuUGF0aCNjb21wdXRlXHJcbiAqL1xyXG5ST1QuUGF0aC5EaWprc3RyYS5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKGZyb21YLCBmcm9tWSwgY2FsbGJhY2spIHtcclxuXHR2YXIga2V5ID0gZnJvbVgrXCIsXCIrZnJvbVk7XHJcblx0aWYgKCEoa2V5IGluIHRoaXMuX2NvbXB1dGVkKSkgeyB0aGlzLl9jb21wdXRlKGZyb21YLCBmcm9tWSk7IH1cclxuXHRpZiAoIShrZXkgaW4gdGhpcy5fY29tcHV0ZWQpKSB7IHJldHVybjsgfVxyXG5cdFxyXG5cdHZhciBpdGVtID0gdGhpcy5fY29tcHV0ZWRba2V5XTtcclxuXHR3aGlsZSAoaXRlbSkge1xyXG5cdFx0Y2FsbGJhY2soaXRlbS54LCBpdGVtLnkpO1xyXG5cdFx0aXRlbSA9IGl0ZW0ucHJldjtcclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBhIG5vbi1jYWNoZWQgdmFsdWVcclxuICovXHJcblJPVC5QYXRoLkRpamtzdHJhLnByb3RvdHlwZS5fY29tcHV0ZSA9IGZ1bmN0aW9uKGZyb21YLCBmcm9tWSkge1xyXG5cdHdoaWxlICh0aGlzLl90b2RvLmxlbmd0aCkge1xyXG5cdFx0dmFyIGl0ZW0gPSB0aGlzLl90b2RvLnNoaWZ0KCk7XHJcblx0XHRpZiAoaXRlbS54ID09IGZyb21YICYmIGl0ZW0ueSA9PSBmcm9tWSkgeyByZXR1cm47IH1cclxuXHRcdFxyXG5cdFx0dmFyIG5laWdoYm9ycyA9IHRoaXMuX2dldE5laWdoYm9ycyhpdGVtLngsIGl0ZW0ueSk7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9MDtpPG5laWdoYm9ycy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHZhciBuZWlnaGJvciA9IG5laWdoYm9yc1tpXTtcclxuXHRcdFx0dmFyIHggPSBuZWlnaGJvclswXTtcclxuXHRcdFx0dmFyIHkgPSBuZWlnaGJvclsxXTtcclxuXHRcdFx0dmFyIGlkID0geCtcIixcIit5O1xyXG5cdFx0XHRpZiAoaWQgaW4gdGhpcy5fY29tcHV0ZWQpIHsgY29udGludWU7IH0gLyogYWxyZWFkeSBkb25lICovXHRcclxuXHRcdFx0dGhpcy5fYWRkKHgsIHksIGl0ZW0pOyBcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuUGF0aC5EaWprc3RyYS5wcm90b3R5cGUuX2FkZCA9IGZ1bmN0aW9uKHgsIHksIHByZXYpIHtcclxuXHR2YXIgb2JqID0ge1xyXG5cdFx0eDogeCxcclxuXHRcdHk6IHksXHJcblx0XHRwcmV2OiBwcmV2XHJcblx0fTtcclxuXHR0aGlzLl9jb21wdXRlZFt4K1wiLFwiK3ldID0gb2JqO1xyXG5cdHRoaXMuX3RvZG8ucHVzaChvYmopO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFNpbXBsaWZpZWQgQSogYWxnb3JpdGhtOiBhbGwgZWRnZXMgaGF2ZSBhIHZhbHVlIG9mIDFcclxuICogQGF1Z21lbnRzIFJPVC5QYXRoXHJcbiAqIEBzZWUgUk9ULlBhdGhcclxuICovXHJcblJPVC5QYXRoLkFTdGFyID0gZnVuY3Rpb24odG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHRST1QuUGF0aC5jYWxsKHRoaXMsIHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zKTtcclxuXHJcblx0dGhpcy5fdG9kbyA9IFtdO1xyXG5cdHRoaXMuX2RvbmUgPSB7fTtcclxuXHR0aGlzLl9mcm9tWCA9IG51bGw7XHJcblx0dGhpcy5fZnJvbVkgPSBudWxsO1xyXG59O1xyXG5ST1QuUGF0aC5BU3Rhci5leHRlbmQoUk9ULlBhdGgpO1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgYSBwYXRoIGZyb20gYSBnaXZlbiBwb2ludFxyXG4gKiBAc2VlIFJPVC5QYXRoI2NvbXB1dGVcclxuICovXHJcblJPVC5QYXRoLkFTdGFyLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZLCBjYWxsYmFjaykge1xyXG5cdHRoaXMuX3RvZG8gPSBbXTtcclxuXHR0aGlzLl9kb25lID0ge307XHJcblx0dGhpcy5fZnJvbVggPSBmcm9tWDtcclxuXHR0aGlzLl9mcm9tWSA9IGZyb21ZO1xyXG5cdHRoaXMuX2FkZCh0aGlzLl90b1gsIHRoaXMuX3RvWSwgbnVsbCk7XHJcblxyXG5cdHdoaWxlICh0aGlzLl90b2RvLmxlbmd0aCkge1xyXG5cdFx0dmFyIGl0ZW0gPSB0aGlzLl90b2RvLnNoaWZ0KCk7XHJcblx0XHRpZiAoaXRlbS54ID09IGZyb21YICYmIGl0ZW0ueSA9PSBmcm9tWSkgeyBicmVhazsgfVxyXG5cdFx0dmFyIG5laWdoYm9ycyA9IHRoaXMuX2dldE5laWdoYm9ycyhpdGVtLngsIGl0ZW0ueSk7XHJcblxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8bmVpZ2hib3JzLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0dmFyIG5laWdoYm9yID0gbmVpZ2hib3JzW2ldO1xyXG5cdFx0XHR2YXIgeCA9IG5laWdoYm9yWzBdO1xyXG5cdFx0XHR2YXIgeSA9IG5laWdoYm9yWzFdO1xyXG5cdFx0XHR2YXIgaWQgPSB4K1wiLFwiK3k7XHJcblx0XHRcdGlmIChpZCBpbiB0aGlzLl9kb25lKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRcdHRoaXMuX2FkZCh4LCB5LCBpdGVtKTsgXHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHZhciBpdGVtID0gdGhpcy5fZG9uZVtmcm9tWCtcIixcIitmcm9tWV07XHJcblx0aWYgKCFpdGVtKSB7IHJldHVybjsgfVxyXG5cdFxyXG5cdHdoaWxlIChpdGVtKSB7XHJcblx0XHRjYWxsYmFjayhpdGVtLngsIGl0ZW0ueSk7XHJcblx0XHRpdGVtID0gaXRlbS5wcmV2O1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5QYXRoLkFTdGFyLnByb3RvdHlwZS5fYWRkID0gZnVuY3Rpb24oeCwgeSwgcHJldikge1xyXG5cdHZhciBoID0gdGhpcy5fZGlzdGFuY2UoeCwgeSk7XHJcblx0dmFyIG9iaiA9IHtcclxuXHRcdHg6IHgsXHJcblx0XHR5OiB5LFxyXG5cdFx0cHJldjogcHJldixcclxuXHRcdGc6IChwcmV2ID8gcHJldi5nKzEgOiAwKSxcclxuXHRcdGg6IGhcclxuXHR9O1xyXG5cdHRoaXMuX2RvbmVbeCtcIixcIit5XSA9IG9iajtcclxuXHRcclxuXHQvKiBpbnNlcnQgaW50byBwcmlvcml0eSBxdWV1ZSAqL1xyXG5cdFxyXG5cdHZhciBmID0gb2JqLmcgKyBvYmouaDtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl90b2RvLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBpdGVtID0gdGhpcy5fdG9kb1tpXTtcclxuXHRcdHZhciBpdGVtRiA9IGl0ZW0uZyArIGl0ZW0uaDtcclxuXHRcdGlmIChmIDwgaXRlbUYgfHwgKGYgPT0gaXRlbUYgJiYgaCA8IGl0ZW0uaCkpIHtcclxuXHRcdFx0dGhpcy5fdG9kby5zcGxpY2UoaSwgMCwgb2JqKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0aGlzLl90b2RvLnB1c2gob2JqKTtcclxufTtcclxuXHJcblJPVC5QYXRoLkFTdGFyLnByb3RvdHlwZS5fZGlzdGFuY2UgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0c3dpdGNoICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5KSB7XHJcblx0XHRjYXNlIDQ6XHJcblx0XHRcdHJldHVybiAoTWF0aC5hYnMoeC10aGlzLl9mcm9tWCkgKyBNYXRoLmFicyh5LXRoaXMuX2Zyb21ZKSk7XHJcblx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlIDY6XHJcblx0XHRcdHZhciBkeCA9IE1hdGguYWJzKHggLSB0aGlzLl9mcm9tWCk7XHJcblx0XHRcdHZhciBkeSA9IE1hdGguYWJzKHkgLSB0aGlzLl9mcm9tWSk7XHJcblx0XHRcdHJldHVybiBkeSArIE1hdGgubWF4KDAsIChkeC1keSkvMik7XHJcblx0XHRicmVhaztcclxuXHJcblx0XHRjYXNlIDg6IFxyXG5cdFx0XHRyZXR1cm4gTWF0aC5tYXgoTWF0aC5hYnMoeC10aGlzLl9mcm9tWCksIE1hdGguYWJzKHktdGhpcy5fZnJvbVkpKTtcclxuXHRcdGJyZWFrO1xyXG5cdH1cclxuXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSWxsZWdhbCB0b3BvbG9neVwiKTtcclxufTtcclxuICByZXR1cm4gUk9UO1xyXG59KSk7XHJcbiJdfQ==
