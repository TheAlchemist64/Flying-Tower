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
			this.glyph.draw(this.x, this.y);
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
					_game2.default.map.get(this.x, this.y).draw();
					_game2.default.scheduler.remove(this);
					_game2.default.actors.splice(_game2.default.actors.indexOf(this), 1);
					if (this == _game2.default.player) {
						_game2.default.over(false);
					}
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
			//Reset actor's previous tile and draw actor on new tile
			_game2.default.map.get(cx, cy).draw();
			this.draw();
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

		this.scheduler = new _rot2.default.Scheduler.Simple();
		this.engine = new _rot2.default.Engine(this.scheduler);

		this.player = new _player2.default('Player', 4, 4, new _glyph2.default('@', '#fff'));
		this.player.draw();

		var m = new _actor2.default('Monster', 8, 8, new _glyph2.default('m', '#f00'));
		m.draw();

		this.engine.start();
	},
	over: function over(victory) {
		this.scheduler = null;
		this.engine = null;
		var text = '';
		if (victory) {
			text = 'Congradulations! You won!';
		} else {
			text = 'Game over. You lost!';
		}
		this.display.drawText(Math.floor(w / 2) - Math.floor(text.length / 2), Math.floor(h / 2), text);
	}
};

},{"../../vendor/eventbus.min":8,"../../vendor/rot":9,"./actor":1,"./actors/player":2,"./glyph":5,"./map.js":6,"./tile.js":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Glyph = function () {
	function Glyph(chr, fg, bg) {
		_classCallCheck(this, Glyph);

		this.chr = chr || ' ';
		this.fg = fg || '#fff';
		this.bg = bg || null;
	}

	_createClass(Glyph, [{
		key: 'draw',
		value: function draw(x, y) {
			_game2.default.display.draw(x, y, this.chr, this.fg, this.bg);
		}
	}]);

	return Glyph;
}();

exports.default = Glyph;

},{"./game":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tile = require('./tile');

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
		key: 'nearEdge',
		value: function nearEdge(x, y) {
			var _this = this;

			var result = new Map();
			var neighbors = [[x - 1, y], [x, y - 1], [x + 1, y], [x, y + 1]];
			neighbors.forEach(function (n) {
				result[_this.get(n[0], n[1]).type] = true;
			});
			return result['sky'];
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
	}]);

	return TileMap;
}();

exports.default = TileMap;

},{"./tile":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Tile = exports.TileTypes = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glyph = require('./glyph');

var _glyph2 = _interopRequireDefault(_glyph);

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
			this.glyph.draw(this.x, this.y);
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

},{"./glyph":5}],8:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxhY3Rvci5qcyIsImFzc2V0c1xcanNcXGFjdG9yc1xccGxheWVyLmpzIiwiYXNzZXRzXFxqc1xcYXBwLmpzIiwiYXNzZXRzXFxqc1xcZ2FtZS5qcyIsImFzc2V0c1xcanNcXGdseXBoLmpzIiwiYXNzZXRzXFxqc1xcbWFwLmpzIiwiYXNzZXRzXFxqc1xcdGlsZS5qcyIsInZlbmRvclxcZXZlbnRidXMubWluLmpzIiwidmVuZG9yXFxyb3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7Ozs7OztJQUVxQixLO0FBQ3BCLGdCQUFZLElBQVosRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsS0FBeEIsRUFBOEI7QUFBQTs7QUFDN0IsT0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLE9BQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxPQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLElBQWpCO0FBQ0EsaUJBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsSUFBbkIsRUFBd0IsSUFBeEI7QUFDQTs7Ozt3QkFDSSxDQUFFOzs7eUJBQ0Q7QUFDTCxRQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEtBQUssQ0FBckIsRUFBd0IsS0FBSyxDQUE3QjtBQUNBOzs7dUJBQ0ksQyxFQUFHLEMsRUFBRTtBQUNULE9BQUcsQ0FBQyxlQUFLLEdBQUwsQ0FBUyxRQUFULENBQWtCLENBQWxCLEVBQXFCLENBQXJCLENBQUosRUFBNEI7QUFDM0IsV0FBTyxDQUFQO0FBQ0E7QUFDRCxPQUFJLFdBQVcsZUFBSyxHQUFMLENBQVMsR0FBVCxDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsSUFBbEM7QUFDQSxXQUFPLFFBQVA7QUFDQyxTQUFLLE1BQUw7QUFDQyxZQUFPLENBQVA7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QUFMLENBQVMsSUFBSSxLQUFLLE1BQWxCLENBQVQ7QUFDQSxRQUFJLEtBQUssS0FBSyxHQUFMLENBQVMsSUFBSSxLQUFLLE1BQWxCLENBQVQ7QUFDQSxXQUFPLEtBQUssS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUMsS0FBRyxFQUFKLElBQVEsQ0FBcEIsQ0FBWjtBQUNEOztBQUVBLFFBQUssQ0FBTDtBQUNDLFdBQU8sS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFMLENBQVMsSUFBRSxLQUFLLE1BQWhCLENBQVQsRUFBa0MsS0FBSyxHQUFMLENBQVMsSUFBRSxLQUFLLE1BQWhCLENBQWxDLENBQVA7QUFDRDtBQWJEOztBQWdCTyxRQUFNLElBQUksS0FBSixDQUFVLGtCQUFWLENBQU47QUFDUCxFQWxCRDtBQW1CRSxRQUFPLEdBQVA7QUFDRCxDQTN0S0EsQ0FBRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgR2FtZSBmcm9tICcuL2dhbWUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0b3Ige1xyXG5cdGNvbnN0cnVjdG9yKG5hbWUsIHgsIHksIGdseXBoKXtcclxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMuZ2x5cGggPSBnbHlwaDtcclxuXHRcdEdhbWUuYWN0b3JzLnB1c2godGhpcyk7XHJcblx0XHRHYW1lLnNjaGVkdWxlci5hZGQodGhpcyx0cnVlKTtcclxuXHR9XHJcblx0YWN0KCl7fVxyXG5cdGRyYXcoKXtcclxuXHRcdHRoaXMuZ2x5cGguZHJhdyh0aGlzLngsIHRoaXMueSk7XHJcblx0fVxyXG5cdG1vdmUoeCwgeSl7XHJcblx0XHRpZighR2FtZS5tYXAuaW5Cb3VuZHMoeCwgeSkpe1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cclxuXHRcdGxldCB0aWxlVHlwZSA9IEdhbWUubWFwLmdldCh4LCB5KS50eXBlO1xyXG5cdFx0c3dpdGNoKHRpbGVUeXBlKXtcclxuXHRcdFx0Y2FzZSAnd2FsbCc6XHJcblx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3NreSc6XHJcblx0XHRcdFx0R2FtZS5tYXAuZ2V0KHRoaXMueCwgdGhpcy55KS5kcmF3KCk7XHJcblx0XHRcdFx0R2FtZS5zY2hlZHVsZXIucmVtb3ZlKHRoaXMpO1xyXG5cdFx0XHRcdEdhbWUuYWN0b3JzLnNwbGljZShHYW1lLmFjdG9ycy5pbmRleE9mKHRoaXMpLDEpO1xyXG5cdFx0XHRcdGlmKHRoaXMgPT0gR2FtZS5wbGF5ZXIpe1xyXG5cdFx0XHRcdFx0R2FtZS5vdmVyKGZhbHNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRsZXQgY29sbGlkZXMgPSBmYWxzZTtcclxuXHRcdGxldCBvdGhlciA9IG51bGw7XHJcblx0XHRHYW1lLmFjdG9ycy5mb3JFYWNoKChhY3Rvcik9PntcclxuXHRcdFx0aWYoeD09YWN0b3IueCAmJiB5PT1hY3Rvci55KXtcclxuXHRcdFx0XHRjb2xsaWRlcyA9IHRydWU7XHJcblx0XHRcdFx0b3RoZXIgPSBhY3RvcjtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRpZihjb2xsaWRlcyl7XHJcblx0XHRcdC8vUHVzaCBhY3RvclxyXG5cdFx0XHRsZXQgZHggPSB4IC0gdGhpcy54O1xyXG5cdFx0XHRsZXQgZHkgPSB5IC0gdGhpcy55O1xyXG5cdFx0XHRsZXQgbXYgPSBvdGhlci5tb3ZlKG90aGVyLngrZHgsb3RoZXIueStkeSk7XHJcblx0XHRcdGlmKCFtdil7XHJcblx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vQ2FwdHVyZSBjdXJyZW50IHBvc2l0aW9uXHJcblx0XHRsZXQgY3ggPSB0aGlzLng7XHJcblx0XHRsZXQgY3kgPSB0aGlzLnk7XHJcblx0XHQvL1NldCBuZXcgcG9zaXRpb25cclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0Ly9SZXNldCBhY3RvcidzIHByZXZpb3VzIHRpbGUgYW5kIGRyYXcgYWN0b3Igb24gbmV3IHRpbGVcclxuXHRcdEdhbWUubWFwLmdldChjeCwgY3kpLmRyYXcoKTtcclxuXHRcdHRoaXMuZHJhdygpO1xyXG5cdFx0cmV0dXJuIDE7XHJcblx0fVxyXG59IiwiaW1wb3J0IEFjdG9yIGZyb20gJy4uL2FjdG9yJztcclxuaW1wb3J0IFJPVCBmcm9tICcuLi8uLi8uLi92ZW5kb3Ivcm90JztcclxuaW1wb3J0IEdhbWUgZnJvbSAnLi8uLi9nYW1lJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciBleHRlbmRzIEFjdG9ye1xyXG5cdGFjdCgpe1xyXG5cdFx0R2FtZS5lbmdpbmUubG9jaygpO1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLHRoaXMpO1xyXG5cdH1cclxuXHRoYW5kbGVFdmVudChlKXtcclxuXHRcdGxldCBjb2RlID0gZS5rZXlDb2RlO1xyXG5cdFx0bGV0IHggPSB0aGlzLng7XHJcblx0XHRsZXQgeSA9IHRoaXMueTtcclxuXHRcdHN3aXRjaChjb2RlKXtcclxuXHRcdFx0Y2FzZSBST1QuVktfVVA6XHJcblx0XHRcdFx0c3VwZXIubW92ZSh4LHktMSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgUk9ULlZLX1JJR0hUOlxyXG5cdFx0XHRcdHN1cGVyLm1vdmUoeCsxLHkpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFJPVC5WS19ET1dOOlxyXG5cdFx0XHRcdHN1cGVyLm1vdmUoeCx5KzEpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFJPVC5WS19MRUZUOlxyXG5cdFx0XHRcdHN1cGVyLm1vdmUoeC0xLHkpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLHRoaXMpO1xyXG5cdFx0R2FtZS5lbmdpbmUudW5sb2NrKCk7XHJcblx0fVxyXG59IiwiaW1wb3J0IFJPVCBmcm9tIFwiLi4vLi4vdmVuZG9yL3JvdFwiXHJcbmltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSdcclxuaW1wb3J0IHsgVGlsZSB9IGZyb20gJy4vdGlsZSc7XHJcblxyXG5pZighUk9ULmlzU3VwcG9ydGVkKCkpe1xyXG5cdGFsZXJ0KFwiVGhlIHJvdC5qcyBsaWJyYXJ5IGlzbid0IHN1cHBvcnRlZCBieSB5b3VyIGJyb3dzZXIuXCIpO1xyXG59XHJcbmVsc2V7XHJcblx0R2FtZS5pbml0KCk7XHJcbn0iLCJpbXBvcnQgUk9UIGZyb20gJy4uLy4uL3ZlbmRvci9yb3QnO1xyXG5pbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi4vLi4vdmVuZG9yL2V2ZW50YnVzLm1pbic7XHJcblxyXG5pbXBvcnQgVGlsZU1hcCBmcm9tICcuL21hcC5qcyc7XHJcbmltcG9ydCB7IFRpbGUsIFRpbGVUeXBlcyB9IGZyb20gJy4vdGlsZS5qcyc7XHJcbmltcG9ydCBBY3RvciBmcm9tICcuL2FjdG9yJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL2FjdG9ycy9wbGF5ZXInO1xyXG5pbXBvcnQgR2x5cGggZnJvbSAnLi9nbHlwaCc7XHJcblxyXG5jb25zdCB3ID0gNTA7XHJcbmNvbnN0IGggPSAyNTtcclxuXHJcbnZhciByYW5kSW50ID0gZnVuY3Rpb24oYSwgYil7XHJcblx0cmV0dXJuIGEgKyBNYXRoLmZsb29yKChiLWEpICogUk9ULlJORy5nZXRVbmlmb3JtKCkpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0ZGlzcGxheTogbnVsbCxcclxuXHRtYXA6IG51bGwsXHJcblx0YnVzOiBudWxsLFxyXG5cdGFjdG9yczogW10sXHJcblx0cGxheWVyOiBudWxsLFxyXG5cdHNjaGVkdWxlcjogbnVsbCxcclxuXHRlbmdpbmU6IG51bGwsXHJcblx0XHJcblx0aW5pdCgpe1xyXG5cdFx0dGhpcy5kaXNwbGF5ID0gbmV3IFJPVC5EaXNwbGF5KHt3aWR0aDogdywgaGVpZ2h0OiBofSk7XHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZGlzcGxheS5nZXRDb250YWluZXIoKSk7XHJcblx0XHRcclxuXHRcdHRoaXMubWFwID0gbmV3IFRpbGVNYXAodywgaCk7XHJcblx0XHRcclxuXHRcdGxldCBnZW5lcmF0b3IgPSBuZXcgUk9ULk1hcC5BcmVuYSh3LTQsaC00KTtcclxuXHRcdGdlbmVyYXRvci5jcmVhdGUoKHgsIHksIHdhbGwpPT57XHJcblx0XHRcdGxldCBXQUxMID0gVGlsZVR5cGVzLldBTEw7XHJcblx0XHRcdGxldCBGTE9PUiA9IFRpbGVUeXBlcy5GTE9PUjtcclxuXHRcdFx0dGhpcy5tYXAuc2V0KHgrMiwgeSsyLCBuZXcgVGlsZSh4KzIsIHkrMiwgd2FsbCA/IFdBTEw6IEZMT09SKSk7XHJcblx0XHR9KTtcclxuXHRcdC8vR2VuZXJhdGUgaG9sZXMgaW4gdGhlIGZsb29yXHJcblx0XHRsZXQgaG9sZXMgPSA1O1xyXG5cdFx0d2hpbGUoaG9sZXMgPiAwKXtcclxuXHRcdFx0bGV0IHggPSByYW5kSW50KDIsIHctMik7XHJcblx0XHRcdGxldCB5ID0gcmFuZEludCgyLCBoLTIpO1xyXG5cdFx0XHR0aGlzLm1hcC5zZXQoeCwgeSwgbmV3IFRpbGUoeCwgeSwgVGlsZVR5cGVzLlNLWSkpO1xyXG5cdFx0XHRob2xlcy0tO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5tYXAuZHJhdygpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmJ1cyA9IEV2ZW50QnVzO1xyXG5cdFx0XHJcblx0XHR0aGlzLnNjaGVkdWxlciA9IG5ldyBST1QuU2NoZWR1bGVyLlNpbXBsZSgpO1xyXG5cdFx0dGhpcy5lbmdpbmUgPSBuZXcgUk9ULkVuZ2luZSh0aGlzLnNjaGVkdWxlcik7XHJcblx0XHRcclxuXHRcdHRoaXMucGxheWVyID0gbmV3IFBsYXllcignUGxheWVyJyw0LDQsbmV3IEdseXBoKCdAJywnI2ZmZicpKTtcclxuXHRcdHRoaXMucGxheWVyLmRyYXcoKTtcclxuXHRcdFxyXG5cdFx0bGV0IG0gPSBuZXcgQWN0b3IoJ01vbnN0ZXInLDgsOCxuZXcgR2x5cGgoJ20nLCcjZjAwJykpO1xyXG5cdFx0bS5kcmF3KCk7XHJcblx0XHRcclxuXHRcdHRoaXMuZW5naW5lLnN0YXJ0KCk7XHJcblx0fSxcclxuXHRvdmVyKHZpY3Rvcnkpe1xyXG5cdFx0dGhpcy5zY2hlZHVsZXIgPSBudWxsO1xyXG5cdFx0dGhpcy5lbmdpbmUgPSBudWxsO1xyXG5cdFx0bGV0IHRleHQgPSAnJztcclxuXHRcdGlmKHZpY3Rvcnkpe1xyXG5cdFx0XHR0ZXh0ID0gJ0NvbmdyYWR1bGF0aW9ucyEgWW91IHdvbiEnO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0dGV4dCA9ICdHYW1lIG92ZXIuIFlvdSBsb3N0ISc7XHJcblx0XHR9XHJcblx0XHR0aGlzLmRpc3BsYXkuZHJhd1RleHQoTWF0aC5mbG9vcih3LzIpLU1hdGguZmxvb3IodGV4dC5sZW5ndGgvMiksTWF0aC5mbG9vcihoLzIpLHRleHQpO1xyXG5cdH1cclxufSIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHbHlwaCB7XHJcblx0Y29uc3RydWN0b3IoY2hyLCBmZywgYmcpe1xyXG5cdFx0dGhpcy5jaHIgPSBjaHIgfHwgJyAnO1xyXG5cdFx0dGhpcy5mZyA9IGZnIHx8ICcjZmZmJztcclxuXHRcdHRoaXMuYmcgPSBiZyB8fCBudWxsO1xyXG5cdH1cclxuXHRkcmF3KHgsIHkpe1xyXG5cdFx0R2FtZS5kaXNwbGF5LmRyYXcoeCwgeSwgdGhpcy5jaHIsIHRoaXMuZmcsIHRoaXMuYmcpO1xyXG5cdH1cclxufSIsImltcG9ydCB7IFRpbGUsIFRpbGVUeXBlcyB9IGZyb20gJy4vdGlsZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWxlTWFwIHtcclxuXHRjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KXtcclxuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcclxuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFx0dGhpcy50aWxlcyA9IG5ldyBNYXAoKTtcclxuXHRcdGZvcihsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCsrKXtcclxuXHRcdFx0Zm9yKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKXtcclxuXHRcdFx0XHR0aGlzLnRpbGVzLnNldCh4KycsJyt5LG5ldyBUaWxlKHgsIHksIFRpbGVUeXBlcy5TS1kpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRzZXQoeCwgeSwgdGlsZSl7XHJcblx0XHR0aGlzLnRpbGVzLnNldCh4KycsJyt5LHRpbGUpO1xyXG5cdH1cclxuXHRnZXQoeCwgeSl7XHJcblx0XHRyZXR1cm4gdGhpcy50aWxlcy5nZXQoeCsnLCcreSk7XHJcblx0fVxyXG5cdGluQm91bmRzKHgsIHkpe1xyXG5cdFx0cmV0dXJuIHggPiAwICYmIHggPCB0aGlzLndpZHRoICYmIHk+IDAgJiYgeSA8IHRoaXMuaGVpZ2h0O1xyXG5cdH1cclxuXHRuZWFyRWRnZSh4LCB5KXtcclxuXHRcdGxldCByZXN1bHQgPSBuZXcgTWFwKCk7XHJcblx0XHRsZXQgbmVpZ2hib3JzID0gW1t4LTEseV0sW3gseS0xXSxbeCsxLHldLFt4LHkrMV1dO1xyXG5cdFx0bmVpZ2hib3JzLmZvckVhY2goKG4pPT57XHJcblx0XHRcdHJlc3VsdFt0aGlzLmdldChuWzBdLG5bMV0pLnR5cGVdID0gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHJlc3VsdFsnc2t5J107XHJcblx0fVxyXG5cdGRyYXcoKXtcclxuXHRcdGZvcih2YXIgdGlsZSBvZiB0aGlzLnRpbGVzLnZhbHVlcygpKXtcclxuXHRcdFx0dGlsZS5kcmF3KCk7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiaW1wb3J0IEdseXBoIGZyb20gJy4vZ2x5cGgnO1xyXG5cclxuZXhwb3J0IGxldCBUaWxlVHlwZXMgPSB7XHJcblx0V0FMTDoge1xyXG5cdFx0bmFtZTogJ3dhbGwnLFxyXG5cdFx0Z2x5cGg6IG5ldyBHbHlwaCgnIycpXHJcblx0fSxcclxuXHRGTE9PUjoge1xyXG5cdFx0bmFtZTogJ2Zsb29yJyxcclxuXHRcdGdseXBoOiBuZXcgR2x5cGgoJy4nKVxyXG5cdH0sXHJcblx0U0tZOiB7XHJcblx0XHRuYW1lOiAnc2t5JyxcclxuXHRcdGdseXBoOiBuZXcgR2x5cGgoJyAnLCcjZmZmJywnc2t5Ymx1ZScpXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGlsZSB7XHJcblx0Y29uc3RydWN0b3IoeCwgeSwgdHlwZSl7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMudHlwZSA9IHR5cGUubmFtZTtcclxuXHRcdHRoaXMuX2dseXBoID0gdHlwZS5nbHlwaDtcclxuXHR9XHJcblx0Z2V0IGdseXBoKCl7IHJldHVybiB0aGlzLl9nbHlwaDsgfVxyXG5cdHNldCBnbHlwaChnbHlwaCkgeyB0aGlzLl9nbHlwaCA9IGdseXBoOyB0aGlzLmRyYXcoKTsgfVxyXG5cdGRyYXcoKXtcclxuXHRcdHRoaXMuZ2x5cGguZHJhdyh0aGlzLngsIHRoaXMueSk7XHJcblx0fVxyXG59IiwiKGZ1bmN0aW9uKHJvb3QsZmFjdG9yeSl7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlPT09XCJvYmplY3RcIiltb2R1bGUuZXhwb3J0cz1mYWN0b3J5KCk7ZWxzZSBpZih0eXBlb2YgZGVmaW5lPT09XCJmdW5jdGlvblwiJiZkZWZpbmUuYW1kKWRlZmluZShcIkV2ZW50QnVzXCIsW10sZmFjdG9yeSk7ZWxzZSBpZih0eXBlb2YgZXhwb3J0cz09PVwib2JqZWN0XCIpZXhwb3J0c1tcIkV2ZW50QnVzXCJdPWZhY3RvcnkoKTtlbHNlIHJvb3RbXCJFdmVudEJ1c1wiXT1mYWN0b3J5KCl9KSh0aGlzLGZ1bmN0aW9uKCl7dmFyIEV2ZW50QnVzQ2xhc3M9e307RXZlbnRCdXNDbGFzcz1mdW5jdGlvbigpe3RoaXMubGlzdGVuZXJzPXt9fTtFdmVudEJ1c0NsYXNzLnByb3RvdHlwZT17YWRkRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlLGNhbGxiYWNrLHNjb3BlKXt2YXIgYXJncz1bXTt2YXIgbnVtT2ZBcmdzPWFyZ3VtZW50cy5sZW5ndGg7Zm9yKHZhciBpPTA7aTxudW1PZkFyZ3M7aSsrKXthcmdzLnB1c2goYXJndW1lbnRzW2ldKX1hcmdzPWFyZ3MubGVuZ3RoPjM/YXJncy5zcGxpY2UoMyxhcmdzLmxlbmd0aC0xKTpbXTtpZih0eXBlb2YgdGhpcy5saXN0ZW5lcnNbdHlwZV0hPVwidW5kZWZpbmVkXCIpe3RoaXMubGlzdGVuZXJzW3R5cGVdLnB1c2goe3Njb3BlOnNjb3BlLGNhbGxiYWNrOmNhbGxiYWNrLGFyZ3M6YXJnc30pfWVsc2V7dGhpcy5saXN0ZW5lcnNbdHlwZV09W3tzY29wZTpzY29wZSxjYWxsYmFjazpjYWxsYmFjayxhcmdzOmFyZ3N9XX19LHJlbW92ZUV2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSxjYWxsYmFjayxzY29wZSl7aWYodHlwZW9mIHRoaXMubGlzdGVuZXJzW3R5cGVdIT1cInVuZGVmaW5lZFwiKXt2YXIgbnVtT2ZDYWxsYmFja3M9dGhpcy5saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoO3ZhciBuZXdBcnJheT1bXTtmb3IodmFyIGk9MDtpPG51bU9mQ2FsbGJhY2tzO2krKyl7dmFyIGxpc3RlbmVyPXRoaXMubGlzdGVuZXJzW3R5cGVdW2ldO2lmKGxpc3RlbmVyLnNjb3BlPT1zY29wZSYmbGlzdGVuZXIuY2FsbGJhY2s9PWNhbGxiYWNrKXt9ZWxzZXtuZXdBcnJheS5wdXNoKGxpc3RlbmVyKX19dGhpcy5saXN0ZW5lcnNbdHlwZV09bmV3QXJyYXl9fSxoYXNFdmVudExpc3RlbmVyOmZ1bmN0aW9uKHR5cGUsY2FsbGJhY2ssc2NvcGUpe2lmKHR5cGVvZiB0aGlzLmxpc3RlbmVyc1t0eXBlXSE9XCJ1bmRlZmluZWRcIil7dmFyIG51bU9mQ2FsbGJhY2tzPXRoaXMubGlzdGVuZXJzW3R5cGVdLmxlbmd0aDtpZihjYWxsYmFjaz09PXVuZGVmaW5lZCYmc2NvcGU9PT11bmRlZmluZWQpe3JldHVybiBudW1PZkNhbGxiYWNrcz4wfWZvcih2YXIgaT0wO2k8bnVtT2ZDYWxsYmFja3M7aSsrKXt2YXIgbGlzdGVuZXI9dGhpcy5saXN0ZW5lcnNbdHlwZV1baV07aWYoKHNjb3BlP2xpc3RlbmVyLnNjb3BlPT1zY29wZTp0cnVlKSYmbGlzdGVuZXIuY2FsbGJhY2s9PWNhbGxiYWNrKXtyZXR1cm4gdHJ1ZX19fXJldHVybiBmYWxzZX0sZGlzcGF0Y2g6ZnVuY3Rpb24odHlwZSx0YXJnZXQpe3ZhciBldmVudD17dHlwZTp0eXBlLHRhcmdldDp0YXJnZXR9O3ZhciBhcmdzPVtdO3ZhciBudW1PZkFyZ3M9YXJndW1lbnRzLmxlbmd0aDtmb3IodmFyIGk9MDtpPG51bU9mQXJncztpKyspe2FyZ3MucHVzaChhcmd1bWVudHNbaV0pfWFyZ3M9YXJncy5sZW5ndGg+Mj9hcmdzLnNwbGljZSgyLGFyZ3MubGVuZ3RoLTEpOltdO2FyZ3M9W2V2ZW50XS5jb25jYXQoYXJncyk7aWYodHlwZW9mIHRoaXMubGlzdGVuZXJzW3R5cGVdIT1cInVuZGVmaW5lZFwiKXt2YXIgbGlzdGVuZXJzPXRoaXMubGlzdGVuZXJzW3R5cGVdLnNsaWNlKCk7dmFyIG51bU9mQ2FsbGJhY2tzPWxpc3RlbmVycy5sZW5ndGg7Zm9yKHZhciBpPTA7aTxudW1PZkNhbGxiYWNrcztpKyspe3ZhciBsaXN0ZW5lcj1saXN0ZW5lcnNbaV07aWYobGlzdGVuZXImJmxpc3RlbmVyLmNhbGxiYWNrKXt2YXIgY29uY2F0QXJncz1hcmdzLmNvbmNhdChsaXN0ZW5lci5hcmdzKTtsaXN0ZW5lci5jYWxsYmFjay5hcHBseShsaXN0ZW5lci5zY29wZSxjb25jYXRBcmdzKX19fX0sZ2V0RXZlbnRzOmZ1bmN0aW9uKCl7dmFyIHN0cj1cIlwiO2Zvcih2YXIgdHlwZSBpbiB0aGlzLmxpc3RlbmVycyl7dmFyIG51bU9mQ2FsbGJhY2tzPXRoaXMubGlzdGVuZXJzW3R5cGVdLmxlbmd0aDtmb3IodmFyIGk9MDtpPG51bU9mQ2FsbGJhY2tzO2krKyl7dmFyIGxpc3RlbmVyPXRoaXMubGlzdGVuZXJzW3R5cGVdW2ldO3N0cis9bGlzdGVuZXIuc2NvcGUmJmxpc3RlbmVyLnNjb3BlLmNsYXNzTmFtZT9saXN0ZW5lci5zY29wZS5jbGFzc05hbWU6XCJhbm9ueW1vdXNcIjtzdHIrPVwiIGxpc3RlbiBmb3IgJ1wiK3R5cGUrXCInXFxuXCJ9fXJldHVybiBzdHJ9fTt2YXIgRXZlbnRCdXM9bmV3IEV2ZW50QnVzQ2xhc3M7cmV0dXJuIEV2ZW50QnVzfSk7IiwiLypcclxuXHRUaGlzIGlzIHJvdC5qcywgdGhlIFJPZ3VlbGlrZSBUb29sa2l0IGluIEphdmFTY3JpcHQuXHJcblx0VmVyc2lvbiAwLjd+ZGV2LCBnZW5lcmF0ZWQgb24gVGh1IDI0IE5vdiAyMDE2IDA4OjA3OjM5IE1TVC5cclxuKi9cclxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XHJcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxyXG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxyXG4gICAgICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxyXG4gICAgICAgIC8vIGxpa2UgTm9kZS5cclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcclxuICAgICAgICByb290LlJPVCA9IGZhY3RvcnkoKTtcclxuICAgIH1cclxufSh0aGlzLCBmdW5jdGlvbigpIHtcclxuLyoqXHJcbiAqIEBuYW1lc3BhY2UgVG9wLWxldmVsIFJPVCBuYW1lc3BhY2VcclxuICovXHJcbnZhciBST1QgPSB7XHJcblx0LyoqXHJcblx0ICogQHJldHVybnMge2Jvb2x9IElzIHJvdC5qcyBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyP1xyXG5cdCAqL1xyXG5cdGlzU3VwcG9ydGVkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAhIShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLmdldENvbnRleHQgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpO1xyXG5cdH0sXHJcblxyXG5cdC8qKiBEZWZhdWx0IHdpdGggZm9yIGRpc3BsYXkgYW5kIG1hcCBnZW5lcmF0b3JzICovXHJcblx0REVGQVVMVF9XSURUSDogODAsXHJcblx0LyoqIERlZmF1bHQgaGVpZ2h0IGZvciBkaXNwbGF5IGFuZCBtYXAgZ2VuZXJhdG9ycyAqL1xyXG5cdERFRkFVTFRfSEVJR0hUOiAyNSxcclxuXHJcblx0LyoqIERpcmVjdGlvbmFsIGNvbnN0YW50cy4gT3JkZXJpbmcgaXMgaW1wb3J0YW50ISAqL1xyXG5cdERJUlM6IHtcclxuXHRcdFwiNFwiOiBbXHJcblx0XHRcdFsgMCwgLTFdLFxyXG5cdFx0XHRbIDEsICAwXSxcclxuXHRcdFx0WyAwLCAgMV0sXHJcblx0XHRcdFstMSwgIDBdXHJcblx0XHRdLFxyXG5cdFx0XCI4XCI6IFtcclxuXHRcdFx0WyAwLCAtMV0sXHJcblx0XHRcdFsgMSwgLTFdLFxyXG5cdFx0XHRbIDEsICAwXSxcclxuXHRcdFx0WyAxLCAgMV0sXHJcblx0XHRcdFsgMCwgIDFdLFxyXG5cdFx0XHRbLTEsICAxXSxcclxuXHRcdFx0Wy0xLCAgMF0sXHJcblx0XHRcdFstMSwgLTFdXHJcblx0XHRdLFxyXG5cdFx0XCI2XCI6IFtcclxuXHRcdFx0Wy0xLCAtMV0sXHJcblx0XHRcdFsgMSwgLTFdLFxyXG5cdFx0XHRbIDIsICAwXSxcclxuXHRcdFx0WyAxLCAgMV0sXHJcblx0XHRcdFstMSwgIDFdLFxyXG5cdFx0XHRbLTIsICAwXVxyXG5cdFx0XVxyXG5cdH0sXHJcblxyXG5cdC8qKiBDYW5jZWwga2V5LiAqL1xyXG5cdFZLX0NBTkNFTDogMywgXHJcblx0LyoqIEhlbHAga2V5LiAqL1xyXG5cdFZLX0hFTFA6IDYsIFxyXG5cdC8qKiBCYWNrc3BhY2Uga2V5LiAqL1xyXG5cdFZLX0JBQ0tfU1BBQ0U6IDgsIFxyXG5cdC8qKiBUYWIga2V5LiAqL1xyXG5cdFZLX1RBQjogOSwgXHJcblx0LyoqIDUga2V5IG9uIE51bXBhZCB3aGVuIE51bUxvY2sgaXMgdW5sb2NrZWQuIE9yIG9uIE1hYywgY2xlYXIga2V5IHdoaWNoIGlzIHBvc2l0aW9uZWQgYXQgTnVtTG9jayBrZXkuICovXHJcblx0VktfQ0xFQVI6IDEyLCBcclxuXHQvKiogUmV0dXJuL2VudGVyIGtleSBvbiB0aGUgbWFpbiBrZXlib2FyZC4gKi9cclxuXHRWS19SRVRVUk46IDEzLCBcclxuXHQvKiogUmVzZXJ2ZWQsIGJ1dCBub3QgdXNlZC4gKi9cclxuXHRWS19FTlRFUjogMTQsIFxyXG5cdC8qKiBTaGlmdCBrZXkuICovXHJcblx0VktfU0hJRlQ6IDE2LCBcclxuXHQvKiogQ29udHJvbCBrZXkuICovXHJcblx0VktfQ09OVFJPTDogMTcsIFxyXG5cdC8qKiBBbHQgKE9wdGlvbiBvbiBNYWMpIGtleS4gKi9cclxuXHRWS19BTFQ6IDE4LCBcclxuXHQvKiogUGF1c2Uga2V5LiAqL1xyXG5cdFZLX1BBVVNFOiAxOSwgXHJcblx0LyoqIENhcHMgbG9jay4gKi9cclxuXHRWS19DQVBTX0xPQ0s6IDIwLCBcclxuXHQvKiogRXNjYXBlIGtleS4gKi9cclxuXHRWS19FU0NBUEU6IDI3LCBcclxuXHQvKiogU3BhY2UgYmFyLiAqL1xyXG5cdFZLX1NQQUNFOiAzMiwgXHJcblx0LyoqIFBhZ2UgVXAga2V5LiAqL1xyXG5cdFZLX1BBR0VfVVA6IDMzLCBcclxuXHQvKiogUGFnZSBEb3duIGtleS4gKi9cclxuXHRWS19QQUdFX0RPV046IDM0LCBcclxuXHQvKiogRW5kIGtleS4gKi9cclxuXHRWS19FTkQ6IDM1LCBcclxuXHQvKiogSG9tZSBrZXkuICovXHJcblx0VktfSE9NRTogMzYsIFxyXG5cdC8qKiBMZWZ0IGFycm93LiAqL1xyXG5cdFZLX0xFRlQ6IDM3LCBcclxuXHQvKiogVXAgYXJyb3cuICovXHJcblx0VktfVVA6IDM4LCBcclxuXHQvKiogUmlnaHQgYXJyb3cuICovXHJcblx0VktfUklHSFQ6IDM5LCBcclxuXHQvKiogRG93biBhcnJvdy4gKi9cclxuXHRWS19ET1dOOiA0MCwgXHJcblx0LyoqIFByaW50IFNjcmVlbiBrZXkuICovXHJcblx0VktfUFJJTlRTQ1JFRU46IDQ0LCBcclxuXHQvKiogSW5zKGVydCkga2V5LiAqL1xyXG5cdFZLX0lOU0VSVDogNDUsIFxyXG5cdC8qKiBEZWwoZXRlKSBrZXkuICovXHJcblx0VktfREVMRVRFOiA0NiwgXHJcblx0LyoqKi9cclxuXHRWS18wOiA0OCxcclxuXHQvKioqL1xyXG5cdFZLXzE6IDQ5LFxyXG5cdC8qKiovXHJcblx0VktfMjogNTAsXHJcblx0LyoqKi9cclxuXHRWS18zOiA1MSxcclxuXHQvKioqL1xyXG5cdFZLXzQ6IDUyLFxyXG5cdC8qKiovXHJcblx0VktfNTogNTMsXHJcblx0LyoqKi9cclxuXHRWS182OiA1NCxcclxuXHQvKioqL1xyXG5cdFZLXzc6IDU1LFxyXG5cdC8qKiovXHJcblx0VktfODogNTYsXHJcblx0LyoqKi9cclxuXHRWS185OiA1NyxcclxuXHQvKiogQ29sb24gKDopIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0NPTE9OOiA1OCwgXHJcblx0LyoqIFNlbWljb2xvbiAoOykga2V5LiAqL1xyXG5cdFZLX1NFTUlDT0xPTjogNTksIFxyXG5cdC8qKiBMZXNzLXRoYW4gKDwpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0xFU1NfVEhBTjogNjAsIFxyXG5cdC8qKiBFcXVhbHMgKD0pIGtleS4gKi9cclxuXHRWS19FUVVBTFM6IDYxLCBcclxuXHQvKiogR3JlYXRlci10aGFuICg+KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19HUkVBVEVSX1RIQU46IDYyLCBcclxuXHQvKiogUXVlc3Rpb24gbWFyayAoPykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfUVVFU1RJT05fTUFSSzogNjMsIFxyXG5cdC8qKiBBdG1hcmsgKEApIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0FUOiA2NCwgXHJcblx0LyoqKi9cclxuXHRWS19BOiA2NSxcclxuXHQvKioqL1xyXG5cdFZLX0I6IDY2LFxyXG5cdC8qKiovXHJcblx0VktfQzogNjcsXHJcblx0LyoqKi9cclxuXHRWS19EOiA2OCxcclxuXHQvKioqL1xyXG5cdFZLX0U6IDY5LFxyXG5cdC8qKiovXHJcblx0VktfRjogNzAsXHJcblx0LyoqKi9cclxuXHRWS19HOiA3MSxcclxuXHQvKioqL1xyXG5cdFZLX0g6IDcyLFxyXG5cdC8qKiovXHJcblx0VktfSTogNzMsXHJcblx0LyoqKi9cclxuXHRWS19KOiA3NCxcclxuXHQvKioqL1xyXG5cdFZLX0s6IDc1LFxyXG5cdC8qKiovXHJcblx0VktfTDogNzYsXHJcblx0LyoqKi9cclxuXHRWS19NOiA3NyxcclxuXHQvKioqL1xyXG5cdFZLX046IDc4LFxyXG5cdC8qKiovXHJcblx0VktfTzogNzksXHJcblx0LyoqKi9cclxuXHRWS19QOiA4MCxcclxuXHQvKioqL1xyXG5cdFZLX1E6IDgxLFxyXG5cdC8qKiovXHJcblx0VktfUjogODIsXHJcblx0LyoqKi9cclxuXHRWS19TOiA4MyxcclxuXHQvKioqL1xyXG5cdFZLX1Q6IDg0LFxyXG5cdC8qKiovXHJcblx0VktfVTogODUsXHJcblx0LyoqKi9cclxuXHRWS19WOiA4NixcclxuXHQvKioqL1xyXG5cdFZLX1c6IDg3LFxyXG5cdC8qKiovXHJcblx0VktfWDogODgsXHJcblx0LyoqKi9cclxuXHRWS19ZOiA4OSxcclxuXHQvKioqL1xyXG5cdFZLX1o6IDkwLFxyXG5cdC8qKiovXHJcblx0VktfQ09OVEVYVF9NRU5VOiA5MyxcclxuXHQvKiogMCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEMDogOTYsIFxyXG5cdC8qKiAxIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQxOiA5NywgXHJcblx0LyoqIDIgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDI6IDk4LCBcclxuXHQvKiogMyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEMzogOTksIFxyXG5cdC8qKiA0IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ0OiAxMDAsIFxyXG5cdC8qKiA1IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ1OiAxMDEsIFxyXG5cdC8qKiA2IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ2OiAxMDIsIFxyXG5cdC8qKiA3IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ3OiAxMDMsIFxyXG5cdC8qKiA4IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ4OiAxMDQsIFxyXG5cdC8qKiA5IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ5OiAxMDUsIFxyXG5cdC8qKiAqIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19NVUxUSVBMWTogMTA2LFxyXG5cdC8qKiArIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19BREQ6IDEwNywgXHJcblx0LyoqKi9cclxuXHRWS19TRVBBUkFUT1I6IDEwOCxcclxuXHQvKiogLSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfU1VCVFJBQ1Q6IDEwOSwgXHJcblx0LyoqIERlY2ltYWwgcG9pbnQgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX0RFQ0lNQUw6IDExMCwgXHJcblx0LyoqIC8gb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX0RJVklERTogMTExLCBcclxuXHQvKiogRjEga2V5LiAqL1xyXG5cdFZLX0YxOiAxMTIsIFxyXG5cdC8qKiBGMiBrZXkuICovXHJcblx0VktfRjI6IDExMywgXHJcblx0LyoqIEYzIGtleS4gKi9cclxuXHRWS19GMzogMTE0LCBcclxuXHQvKiogRjQga2V5LiAqL1xyXG5cdFZLX0Y0OiAxMTUsIFxyXG5cdC8qKiBGNSBrZXkuICovXHJcblx0VktfRjU6IDExNiwgXHJcblx0LyoqIEY2IGtleS4gKi9cclxuXHRWS19GNjogMTE3LCBcclxuXHQvKiogRjcga2V5LiAqL1xyXG5cdFZLX0Y3OiAxMTgsIFxyXG5cdC8qKiBGOCBrZXkuICovXHJcblx0VktfRjg6IDExOSwgXHJcblx0LyoqIEY5IGtleS4gKi9cclxuXHRWS19GOTogMTIwLCBcclxuXHQvKiogRjEwIGtleS4gKi9cclxuXHRWS19GMTA6IDEyMSwgXHJcblx0LyoqIEYxMSBrZXkuICovXHJcblx0VktfRjExOiAxMjIsIFxyXG5cdC8qKiBGMTIga2V5LiAqL1xyXG5cdFZLX0YxMjogMTIzLCBcclxuXHQvKiogRjEzIGtleS4gKi9cclxuXHRWS19GMTM6IDEyNCwgXHJcblx0LyoqIEYxNCBrZXkuICovXHJcblx0VktfRjE0OiAxMjUsIFxyXG5cdC8qKiBGMTUga2V5LiAqL1xyXG5cdFZLX0YxNTogMTI2LCBcclxuXHQvKiogRjE2IGtleS4gKi9cclxuXHRWS19GMTY6IDEyNywgXHJcblx0LyoqIEYxNyBrZXkuICovXHJcblx0VktfRjE3OiAxMjgsIFxyXG5cdC8qKiBGMTgga2V5LiAqL1xyXG5cdFZLX0YxODogMTI5LCBcclxuXHQvKiogRjE5IGtleS4gKi9cclxuXHRWS19GMTk6IDEzMCwgXHJcblx0LyoqIEYyMCBrZXkuICovXHJcblx0VktfRjIwOiAxMzEsIFxyXG5cdC8qKiBGMjEga2V5LiAqL1xyXG5cdFZLX0YyMTogMTMyLCBcclxuXHQvKiogRjIyIGtleS4gKi9cclxuXHRWS19GMjI6IDEzMywgXHJcblx0LyoqIEYyMyBrZXkuICovXHJcblx0VktfRjIzOiAxMzQsIFxyXG5cdC8qKiBGMjQga2V5LiAqL1xyXG5cdFZLX0YyNDogMTM1LCBcclxuXHQvKiogTnVtIExvY2sga2V5LiAqL1xyXG5cdFZLX05VTV9MT0NLOiAxNDQsIFxyXG5cdC8qKiBTY3JvbGwgTG9jayBrZXkuICovXHJcblx0VktfU0NST0xMX0xPQ0s6IDE0NSwgXHJcblx0LyoqIENpcmN1bWZsZXggKF4pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0NJUkNVTUZMRVg6IDE2MCwgXHJcblx0LyoqIEV4Y2xhbWF0aW9uICghKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19FWENMQU1BVElPTjogMTYxLCBcclxuXHQvKiogRG91YmxlIHF1b3RlICgpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0RPVUJMRV9RVU9URTogMTYyLCBcclxuXHQvKiogSGFzaCAoIykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfSEFTSDogMTYzLCBcclxuXHQvKiogRG9sbGFyIHNpZ24gKCQpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0RPTExBUjogMTY0LCBcclxuXHQvKiogUGVyY2VudCAoJSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfUEVSQ0VOVDogMTY1LCBcclxuXHQvKiogQW1wZXJzYW5kICgmKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19BTVBFUlNBTkQ6IDE2NiwgXHJcblx0LyoqIFVuZGVyc2NvcmUgKF8pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1VOREVSU0NPUkU6IDE2NywgXHJcblx0LyoqIE9wZW4gcGFyZW50aGVzaXMgKCgpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX09QRU5fUEFSRU46IDE2OCwgXHJcblx0LyoqIENsb3NlIHBhcmVudGhlc2lzICgpKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19DTE9TRV9QQVJFTjogMTY5LCBcclxuXHQvKiBBc3RlcmlzayAoKikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQVNURVJJU0s6IDE3MCxcclxuXHQvKiogUGx1cyAoKykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfUExVUzogMTcxLCBcclxuXHQvKiogUGlwZSAofCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfUElQRTogMTcyLCBcclxuXHQvKiogSHlwaGVuLVVTL2RvY3MvTWludXMgKC0pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0hZUEhFTl9NSU5VUzogMTczLCBcclxuXHQvKiogT3BlbiBjdXJseSBicmFja2V0ICh7KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19PUEVOX0NVUkxZX0JSQUNLRVQ6IDE3NCwgXHJcblx0LyoqIENsb3NlIGN1cmx5IGJyYWNrZXQgKH0pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0NMT1NFX0NVUkxZX0JSQUNLRVQ6IDE3NSwgXHJcblx0LyoqIFRpbGRlICh+KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19USUxERTogMTc2LCBcclxuXHQvKiogQ29tbWEgKCwpIGtleS4gKi9cclxuXHRWS19DT01NQTogMTg4LCBcclxuXHQvKiogUGVyaW9kICguKSBrZXkuICovXHJcblx0VktfUEVSSU9EOiAxOTAsIFxyXG5cdC8qKiBTbGFzaCAoLykga2V5LiAqL1xyXG5cdFZLX1NMQVNIOiAxOTEsIFxyXG5cdC8qKiBCYWNrIHRpY2sgKGApIGtleS4gKi9cclxuXHRWS19CQUNLX1FVT1RFOiAxOTIsIFxyXG5cdC8qKiBPcGVuIHNxdWFyZSBicmFja2V0IChbKSBrZXkuICovXHJcblx0VktfT1BFTl9CUkFDS0VUOiAyMTksIFxyXG5cdC8qKiBCYWNrIHNsYXNoIChcXCkga2V5LiAqL1xyXG5cdFZLX0JBQ0tfU0xBU0g6IDIyMCwgXHJcblx0LyoqIENsb3NlIHNxdWFyZSBicmFja2V0IChdKSBrZXkuICovXHJcblx0VktfQ0xPU0VfQlJBQ0tFVDogMjIxLCBcclxuXHQvKiogUXVvdGUgKCcnJykga2V5LiAqL1xyXG5cdFZLX1FVT1RFOiAyMjIsIFxyXG5cdC8qKiBNZXRhIGtleSBvbiBMaW51eCwgQ29tbWFuZCBrZXkgb24gTWFjLiAqL1xyXG5cdFZLX01FVEE6IDIyNCwgXHJcblx0LyoqIEFsdEdyIGtleSBvbiBMaW51eC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0FMVEdSOiAyMjUsIFxyXG5cdC8qKiBXaW5kb3dzIGxvZ28ga2V5IG9uIFdpbmRvd3MuIE9yIFN1cGVyIG9yIEh5cGVyIGtleSBvbiBMaW51eC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1dJTjogOTEsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19LQU5BOiAyMSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0hBTkdVTDogMjEsIFxyXG5cdC8qKiDoi7HmlbAga2V5IG9uIEphcGFuZXNlIE1hYyBrZXlib2FyZC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0VJU1U6IDIyLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfSlVOSkE6IDIzLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfRklOQUw6IDI0LCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfSEFOSkE6IDI1LCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfS0FOSkk6IDI1LCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfQ09OVkVSVDogMjgsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19OT05DT05WRVJUOiAyOSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0FDQ0VQVDogMzAsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19NT0RFQ0hBTkdFOiAzMSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX1NFTEVDVDogNDEsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19QUklOVDogNDIsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19FWEVDVVRFOiA0MywgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLlx0ICovXHJcblx0VktfU0xFRVA6IDk1IFxyXG59O1xyXG4vKipcclxuICogQG5hbWVzcGFjZVxyXG4gKiBDb250YWlucyB0ZXh0IHRva2VuaXphdGlvbiBhbmQgYnJlYWtpbmcgcm91dGluZXNcclxuICovXHJcblJPVC5UZXh0ID0ge1xyXG5cdFJFX0NPTE9SUzogLyUoW2JjXSl7KFtefV0qKX0vZyxcclxuXHJcblx0LyogdG9rZW4gdHlwZXMgKi9cclxuXHRUWVBFX1RFWFQ6XHRcdDAsXHJcblx0VFlQRV9ORVdMSU5FOlx0MSxcclxuXHRUWVBFX0ZHOlx0XHQyLFxyXG5cdFRZUEVfQkc6XHRcdDMsXHJcblxyXG5cdC8qKlxyXG5cdCAqIE1lYXN1cmUgc2l6ZSBvZiBhIHJlc3VsdGluZyB0ZXh0IGJsb2NrXHJcblx0ICovXHJcblx0bWVhc3VyZTogZnVuY3Rpb24oc3RyLCBtYXhXaWR0aCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IHt3aWR0aDowLCBoZWlnaHQ6MX07XHJcblx0XHR2YXIgdG9rZW5zID0gdGhpcy50b2tlbml6ZShzdHIsIG1heFdpZHRoKTtcclxuXHRcdHZhciBsaW5lV2lkdGggPSAwO1xyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPHRva2Vucy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHZhciB0b2tlbiA9IHRva2Vuc1tpXTtcclxuXHRcdFx0c3dpdGNoICh0b2tlbi50eXBlKSB7XHJcblx0XHRcdFx0Y2FzZSB0aGlzLlRZUEVfVEVYVDpcclxuXHRcdFx0XHRcdGxpbmVXaWR0aCArPSB0b2tlbi52YWx1ZS5sZW5ndGg7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgdGhpcy5UWVBFX05FV0xJTkU6XHJcblx0XHRcdFx0XHRyZXN1bHQuaGVpZ2h0Kys7XHJcblx0XHRcdFx0XHRyZXN1bHQud2lkdGggPSBNYXRoLm1heChyZXN1bHQud2lkdGgsIGxpbmVXaWR0aCk7XHJcblx0XHRcdFx0XHRsaW5lV2lkdGggPSAwO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXN1bHQud2lkdGggPSBNYXRoLm1heChyZXN1bHQud2lkdGgsIGxpbmVXaWR0aCk7XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0IHN0cmluZyB0byBhIHNlcmllcyBvZiBhIGZvcm1hdHRpbmcgY29tbWFuZHNcclxuXHQgKi9cclxuXHR0b2tlbml6ZTogZnVuY3Rpb24oc3RyLCBtYXhXaWR0aCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuXHRcdC8qIGZpcnN0IHRva2VuaXphdGlvbiBwYXNzIC0gc3BsaXQgdGV4dHMgYW5kIGNvbG9yIGZvcm1hdHRpbmcgY29tbWFuZHMgKi9cclxuXHRcdHZhciBvZmZzZXQgPSAwO1xyXG5cdFx0c3RyLnJlcGxhY2UodGhpcy5SRV9DT0xPUlMsIGZ1bmN0aW9uKG1hdGNoLCB0eXBlLCBuYW1lLCBpbmRleCkge1xyXG5cdFx0XHQvKiBzdHJpbmcgYmVmb3JlICovXHJcblx0XHRcdHZhciBwYXJ0ID0gc3RyLnN1YnN0cmluZyhvZmZzZXQsIGluZGV4KTtcclxuXHRcdFx0aWYgKHBhcnQubGVuZ3RoKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goe1xyXG5cdFx0XHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9URVhULFxyXG5cdFx0XHRcdFx0dmFsdWU6IHBhcnRcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyogY29sb3IgY29tbWFuZCAqL1xyXG5cdFx0XHRyZXN1bHQucHVzaCh7XHJcblx0XHRcdFx0dHlwZTogKHR5cGUgPT0gXCJjXCIgPyBST1QuVGV4dC5UWVBFX0ZHIDogUk9ULlRleHQuVFlQRV9CRyksXHJcblx0XHRcdFx0dmFsdWU6IG5hbWUudHJpbSgpXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0b2Zmc2V0ID0gaW5kZXggKyBtYXRjaC5sZW5ndGg7XHJcblx0XHRcdHJldHVybiBcIlwiO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0LyogbGFzdCByZW1haW5pbmcgcGFydCAqL1xyXG5cdFx0dmFyIHBhcnQgPSBzdHIuc3Vic3RyaW5nKG9mZnNldCk7XHJcblx0XHRpZiAocGFydC5sZW5ndGgpIHtcclxuXHRcdFx0cmVzdWx0LnB1c2goe1xyXG5cdFx0XHRcdHR5cGU6IFJPVC5UZXh0LlRZUEVfVEVYVCxcclxuXHRcdFx0XHR2YWx1ZTogcGFydFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fYnJlYWtMaW5lcyhyZXN1bHQsIG1heFdpZHRoKTtcclxuXHR9LFxyXG5cclxuXHQvKiBpbnNlcnQgbGluZSBicmVha3MgaW50byBmaXJzdC1wYXNzIHRva2VuaXplZCBkYXRhICovXHJcblx0X2JyZWFrTGluZXM6IGZ1bmN0aW9uKHRva2VucywgbWF4V2lkdGgpIHtcclxuXHRcdGlmICghbWF4V2lkdGgpIHsgbWF4V2lkdGggPSBJbmZpbml0eTsgfVxyXG5cclxuXHRcdHZhciBpID0gMDtcclxuXHRcdHZhciBsaW5lTGVuZ3RoID0gMDtcclxuXHRcdHZhciBsYXN0VG9rZW5XaXRoU3BhY2UgPSAtMTtcclxuXHJcblx0XHR3aGlsZSAoaSA8IHRva2Vucy5sZW5ndGgpIHsgLyogdGFrZSBhbGwgdGV4dCB0b2tlbnMsIHJlbW92ZSBzcGFjZSwgYXBwbHkgbGluZWJyZWFrcyAqL1xyXG5cdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbaV07XHJcblx0XHRcdGlmICh0b2tlbi50eXBlID09IFJPVC5UZXh0LlRZUEVfTkVXTElORSkgeyAvKiByZXNldCAqL1xyXG5cdFx0XHRcdGxpbmVMZW5ndGggPSAwOyBcclxuXHRcdFx0XHRsYXN0VG9rZW5XaXRoU3BhY2UgPSAtMTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodG9rZW4udHlwZSAhPSBST1QuVGV4dC5UWVBFX1RFWFQpIHsgLyogc2tpcCBub24tdGV4dCB0b2tlbnMgKi9cclxuXHRcdFx0XHRpKys7XHJcblx0XHRcdFx0Y29udGludWU7IFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKiByZW1vdmUgc3BhY2VzIGF0IHRoZSBiZWdpbm5pbmcgb2YgbGluZSAqL1xyXG5cdFx0XHR3aGlsZSAobGluZUxlbmd0aCA9PSAwICYmIHRva2VuLnZhbHVlLmNoYXJBdCgwKSA9PSBcIiBcIikgeyB0b2tlbi52YWx1ZSA9IHRva2VuLnZhbHVlLnN1YnN0cmluZygxKTsgfVxyXG5cclxuXHRcdFx0LyogZm9yY2VkIG5ld2xpbmU/IGluc2VydCB0d28gbmV3IHRva2VucyBhZnRlciB0aGlzIG9uZSAqL1xyXG5cdFx0XHR2YXIgaW5kZXggPSB0b2tlbi52YWx1ZS5pbmRleE9mKFwiXFxuXCIpO1xyXG5cdFx0XHRpZiAoaW5kZXggIT0gLTEpIHsgXHJcblx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgaSwgaW5kZXgsIHRydWUpOyBcclxuXHJcblx0XHRcdFx0LyogaWYgdGhlcmUgYXJlIHNwYWNlcyBhdCB0aGUgZW5kLCB3ZSBtdXN0IHJlbW92ZSB0aGVtICh3ZSBkbyBub3Qgd2FudCB0aGUgbGluZSB0b28gbG9uZykgKi9cclxuXHRcdFx0XHR2YXIgYXJyID0gdG9rZW4udmFsdWUuc3BsaXQoXCJcIik7XHJcblx0XHRcdFx0d2hpbGUgKGFyci5sZW5ndGggJiYgYXJyW2Fyci5sZW5ndGgtMV0gPT0gXCIgXCIpIHsgYXJyLnBvcCgpOyB9XHJcblx0XHRcdFx0dG9rZW4udmFsdWUgPSBhcnIuam9pbihcIlwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyogdG9rZW4gZGVnZW5lcmF0ZWQ/ICovXHJcblx0XHRcdGlmICghdG9rZW4udmFsdWUubGVuZ3RoKSB7XHJcblx0XHRcdFx0dG9rZW5zLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGxpbmVMZW5ndGggKyB0b2tlbi52YWx1ZS5sZW5ndGggPiBtYXhXaWR0aCkgeyAvKiBsaW5lIHRvbyBsb25nLCBmaW5kIGEgc3VpdGFibGUgYnJlYWtpbmcgc3BvdCAqL1xyXG5cclxuXHRcdFx0XHQvKiBpcyBpdCBwb3NzaWJsZSB0byBicmVhayB3aXRoaW4gdGhpcyB0b2tlbj8gKi9cclxuXHRcdFx0XHR2YXIgaW5kZXggPSAtMTtcclxuXHRcdFx0XHR3aGlsZSAoMSkge1xyXG5cdFx0XHRcdFx0dmFyIG5leHRJbmRleCA9IHRva2VuLnZhbHVlLmluZGV4T2YoXCIgXCIsIGluZGV4KzEpO1xyXG5cdFx0XHRcdFx0aWYgKG5leHRJbmRleCA9PSAtMSkgeyBicmVhazsgfVxyXG5cdFx0XHRcdFx0aWYgKGxpbmVMZW5ndGggKyBuZXh0SW5kZXggPiBtYXhXaWR0aCkgeyBicmVhazsgfVxyXG5cdFx0XHRcdFx0aW5kZXggPSBuZXh0SW5kZXg7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoaW5kZXggIT0gLTEpIHsgLyogYnJlYWsgYXQgc3BhY2Ugd2l0aGluIHRoaXMgb25lICovXHJcblx0XHRcdFx0XHR0b2tlbi52YWx1ZSA9IHRoaXMuX2JyZWFrSW5zaWRlVG9rZW4odG9rZW5zLCBpLCBpbmRleCwgdHJ1ZSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChsYXN0VG9rZW5XaXRoU3BhY2UgIT0gLTEpIHsgLyogaXMgdGhlcmUgYSBwcmV2aW91cyB0b2tlbiB3aGVyZSBhIGJyZWFrIGNhbiBvY2N1cj8gKi9cclxuXHRcdFx0XHRcdHZhciB0b2tlbiA9IHRva2Vuc1tsYXN0VG9rZW5XaXRoU3BhY2VdO1xyXG5cdFx0XHRcdFx0dmFyIGJyZWFrSW5kZXggPSB0b2tlbi52YWx1ZS5sYXN0SW5kZXhPZihcIiBcIik7XHJcblx0XHRcdFx0XHR0b2tlbi52YWx1ZSA9IHRoaXMuX2JyZWFrSW5zaWRlVG9rZW4odG9rZW5zLCBsYXN0VG9rZW5XaXRoU3BhY2UsIGJyZWFrSW5kZXgsIHRydWUpO1xyXG5cdFx0XHRcdFx0aSA9IGxhc3RUb2tlbldpdGhTcGFjZTtcclxuXHRcdFx0XHR9IGVsc2UgeyAvKiBmb3JjZSBicmVhayBpbiB0aGlzIHRva2VuICovXHJcblx0XHRcdFx0XHR0b2tlbi52YWx1ZSA9IHRoaXMuX2JyZWFrSW5zaWRlVG9rZW4odG9rZW5zLCBpLCBtYXhXaWR0aC1saW5lTGVuZ3RoLCBmYWxzZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIHsgLyogbGluZSBub3QgbG9uZywgY29udGludWUgKi9cclxuXHRcdFx0XHRsaW5lTGVuZ3RoICs9IHRva2VuLnZhbHVlLmxlbmd0aDtcclxuXHRcdFx0XHRpZiAodG9rZW4udmFsdWUuaW5kZXhPZihcIiBcIikgIT0gLTEpIHsgbGFzdFRva2VuV2l0aFNwYWNlID0gaTsgfVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpKys7IC8qIGFkdmFuY2UgdG8gbmV4dCB0b2tlbiAqL1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHR0b2tlbnMucHVzaCh7dHlwZTogUk9ULlRleHQuVFlQRV9ORVdMSU5FfSk7IC8qIGluc2VydCBmYWtlIG5ld2xpbmUgdG8gZml4IHRoZSBsYXN0IHRleHQgbGluZSAqL1xyXG5cclxuXHRcdC8qIHJlbW92ZSB0cmFpbGluZyBzcGFjZSBmcm9tIHRleHQgdG9rZW5zIGJlZm9yZSBuZXdsaW5lcyAqL1xyXG5cdFx0dmFyIGxhc3RUZXh0VG9rZW4gPSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dG9rZW5zLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0dmFyIHRva2VuID0gdG9rZW5zW2ldO1xyXG5cdFx0XHRzd2l0Y2ggKHRva2VuLnR5cGUpIHtcclxuXHRcdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfVEVYVDogbGFzdFRleHRUb2tlbiA9IHRva2VuOyBicmVhaztcclxuXHRcdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfTkVXTElORTogXHJcblx0XHRcdFx0XHRpZiAobGFzdFRleHRUb2tlbikgeyAvKiByZW1vdmUgdHJhaWxpbmcgc3BhY2UgKi9cclxuXHRcdFx0XHRcdFx0dmFyIGFyciA9IGxhc3RUZXh0VG9rZW4udmFsdWUuc3BsaXQoXCJcIik7XHJcblx0XHRcdFx0XHRcdHdoaWxlIChhcnIubGVuZ3RoICYmIGFyclthcnIubGVuZ3RoLTFdID09IFwiIFwiKSB7IGFyci5wb3AoKTsgfVxyXG5cdFx0XHRcdFx0XHRsYXN0VGV4dFRva2VuLnZhbHVlID0gYXJyLmpvaW4oXCJcIik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsYXN0VGV4dFRva2VuID0gbnVsbDtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRva2Vucy5wb3AoKTsgLyogcmVtb3ZlIGZha2UgdG9rZW4gKi9cclxuXHJcblx0XHRyZXR1cm4gdG9rZW5zO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZSBuZXcgdG9rZW5zIGFuZCBpbnNlcnQgdGhlbSBpbnRvIHRoZSBzdHJlYW1cclxuXHQgKiBAcGFyYW0ge29iamVjdFtdfSB0b2tlbnNcclxuXHQgKiBAcGFyYW0ge2ludH0gdG9rZW5JbmRleCBUb2tlbiBiZWluZyBwcm9jZXNzZWRcclxuXHQgKiBAcGFyYW0ge2ludH0gYnJlYWtJbmRleCBJbmRleCB3aXRoaW4gY3VycmVudCB0b2tlbidzIHZhbHVlXHJcblx0ICogQHBhcmFtIHtib29sfSByZW1vdmVCcmVha0NoYXIgRG8gd2Ugd2FudCB0byByZW1vdmUgdGhlIGJyZWFraW5nIGNoYXJhY3Rlcj9cclxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSByZW1haW5pbmcgdW5icm9rZW4gdG9rZW4gdmFsdWVcclxuXHQgKi9cclxuXHRfYnJlYWtJbnNpZGVUb2tlbjogZnVuY3Rpb24odG9rZW5zLCB0b2tlbkluZGV4LCBicmVha0luZGV4LCByZW1vdmVCcmVha0NoYXIpIHtcclxuXHRcdHZhciBuZXdCcmVha1Rva2VuID0ge1xyXG5cdFx0XHR0eXBlOiBST1QuVGV4dC5UWVBFX05FV0xJTkVcclxuXHRcdH07XHJcblx0XHR2YXIgbmV3VGV4dFRva2VuID0ge1xyXG5cdFx0XHR0eXBlOiBST1QuVGV4dC5UWVBFX1RFWFQsXHJcblx0XHRcdHZhbHVlOiB0b2tlbnNbdG9rZW5JbmRleF0udmFsdWUuc3Vic3RyaW5nKGJyZWFrSW5kZXggKyAocmVtb3ZlQnJlYWtDaGFyID8gMSA6IDApKVxyXG5cdFx0fTtcclxuXHRcdHRva2Vucy5zcGxpY2UodG9rZW5JbmRleCsxLCAwLCBuZXdCcmVha1Rva2VuLCBuZXdUZXh0VG9rZW4pO1xyXG5cdFx0cmV0dXJuIHRva2Vuc1t0b2tlbkluZGV4XS52YWx1ZS5zdWJzdHJpbmcoMCwgYnJlYWtJbmRleCk7XHJcblx0fVxyXG59O1xyXG4vKipcclxuICogQHJldHVybnMge2FueX0gUmFuZG9tbHkgcGlja2VkIGl0ZW0sIG51bGwgd2hlbiBsZW5ndGg9MFxyXG4gKi9cclxuQXJyYXkucHJvdG90eXBlLnJhbmRvbSA9IEFycmF5LnByb3RvdHlwZS5yYW5kb20gfHwgZnVuY3Rpb24oKSB7XHJcblx0aWYgKCF0aGlzLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfVxyXG5cdHJldHVybiB0aGlzW01hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiB0aGlzLmxlbmd0aCldO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEByZXR1cm5zIHthcnJheX0gTmV3IGFycmF5IHdpdGggcmFuZG9taXplZCBpdGVtc1xyXG4gKi9cclxuQXJyYXkucHJvdG90eXBlLnJhbmRvbWl6ZSA9IEFycmF5LnByb3RvdHlwZS5yYW5kb21pemUgfHwgZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gIHZhciBjbG9uZSA9IHRoaXMuc2xpY2UoKTtcclxuICB3aGlsZSAoY2xvbmUubGVuZ3RoKSB7XHJcbiAgICB2YXIgaW5kZXggPSBjbG9uZS5pbmRleE9mKGNsb25lLnJhbmRvbSgpKTtcclxuICAgIHJlc3VsdC5wdXNoKGNsb25lLnNwbGljZShpbmRleCwgMSlbMF0pO1xyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG4vKipcclxuICogQWx3YXlzIHBvc2l0aXZlIG1vZHVsdXNcclxuICogQHBhcmFtIHtpbnR9IG4gTW9kdWx1c1xyXG4gKiBAcmV0dXJucyB7aW50fSB0aGlzIG1vZHVsbyBuXHJcbiAqL1xyXG5OdW1iZXIucHJvdG90eXBlLm1vZCA9IE51bWJlci5wcm90b3R5cGUubW9kIHx8IGZ1bmN0aW9uKG4pIHtcclxuXHRyZXR1cm4gKCh0aGlzJW4pK24pJW47XHJcbn07XHJcbi8qKlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBGaXJzdCBsZXR0ZXIgY2FwaXRhbGl6ZWRcclxuICovXHJcblN0cmluZy5wcm90b3R5cGUuY2FwaXRhbGl6ZSA9IFN0cmluZy5wcm90b3R5cGUuY2FwaXRhbGl6ZSB8fCBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRoaXMuc3Vic3RyaW5nKDEpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBMZWZ0IHBhZFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NoYXJhY3Rlcj1cIjBcIl1cclxuICogQHBhcmFtIHtpbnR9IFtjb3VudD0yXVxyXG4gKi9cclxuU3RyaW5nLnByb3RvdHlwZS5scGFkID0gU3RyaW5nLnByb3RvdHlwZS5scGFkIHx8IGZ1bmN0aW9uKGNoYXJhY3RlciwgY291bnQpIHtcclxuXHR2YXIgY2ggPSBjaGFyYWN0ZXIgfHwgXCIwXCI7XHJcblx0dmFyIGNudCA9IGNvdW50IHx8IDI7XHJcblxyXG5cdHZhciBzID0gXCJcIjtcclxuXHR3aGlsZSAocy5sZW5ndGggPCAoY250IC0gdGhpcy5sZW5ndGgpKSB7IHMgKz0gY2g7IH1cclxuXHRzID0gcy5zdWJzdHJpbmcoMCwgY250LXRoaXMubGVuZ3RoKTtcclxuXHRyZXR1cm4gcyt0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBSaWdodCBwYWRcclxuICogQHBhcmFtIHtzdHJpbmd9IFtjaGFyYWN0ZXI9XCIwXCJdXHJcbiAqIEBwYXJhbSB7aW50fSBbY291bnQ9Ml1cclxuICovXHJcblN0cmluZy5wcm90b3R5cGUucnBhZCA9IFN0cmluZy5wcm90b3R5cGUucnBhZCB8fCBmdW5jdGlvbihjaGFyYWN0ZXIsIGNvdW50KSB7XHJcblx0dmFyIGNoID0gY2hhcmFjdGVyIHx8IFwiMFwiO1xyXG5cdHZhciBjbnQgPSBjb3VudCB8fCAyO1xyXG5cclxuXHR2YXIgcyA9IFwiXCI7XHJcblx0d2hpbGUgKHMubGVuZ3RoIDwgKGNudCAtIHRoaXMubGVuZ3RoKSkgeyBzICs9IGNoOyB9XHJcblx0cyA9IHMuc3Vic3RyaW5nKDAsIGNudC10aGlzLmxlbmd0aCk7XHJcblx0cmV0dXJuIHRoaXMrcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGb3JtYXQgYSBzdHJpbmcgaW4gYSBmbGV4aWJsZSB3YXkuIFNjYW5zIGZvciAlcyBzdHJpbmdzIGFuZCByZXBsYWNlcyB0aGVtIHdpdGggYXJndW1lbnRzLiBMaXN0IG9mIHBhdHRlcm5zIGlzIG1vZGlmaWFibGUgdmlhIFN0cmluZy5mb3JtYXQubWFwLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVcclxuICogQHBhcmFtIHthbnl9IFthcmd2XVxyXG4gKi9cclxuU3RyaW5nLmZvcm1hdCA9IFN0cmluZy5mb3JtYXQgfHwgZnVuY3Rpb24odGVtcGxhdGUpIHtcclxuXHR2YXIgbWFwID0gU3RyaW5nLmZvcm1hdC5tYXA7XHJcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cclxuXHR2YXIgcmVwbGFjZXIgPSBmdW5jdGlvbihtYXRjaCwgZ3JvdXAxLCBncm91cDIsIGluZGV4KSB7XHJcblx0XHRpZiAodGVtcGxhdGUuY2hhckF0KGluZGV4LTEpID09IFwiJVwiKSB7IHJldHVybiBtYXRjaC5zdWJzdHJpbmcoMSk7IH1cclxuXHRcdGlmICghYXJncy5sZW5ndGgpIHsgcmV0dXJuIG1hdGNoOyB9XHJcblx0XHR2YXIgb2JqID0gYXJnc1swXTtcclxuXHJcblx0XHR2YXIgZ3JvdXAgPSBncm91cDEgfHwgZ3JvdXAyO1xyXG5cdFx0dmFyIHBhcnRzID0gZ3JvdXAuc3BsaXQoXCIsXCIpO1xyXG5cdFx0dmFyIG5hbWUgPSBwYXJ0cy5zaGlmdCgpO1xyXG5cdFx0dmFyIG1ldGhvZCA9IG1hcFtuYW1lLnRvTG93ZXJDYXNlKCldO1xyXG5cdFx0aWYgKCFtZXRob2QpIHsgcmV0dXJuIG1hdGNoOyB9XHJcblxyXG5cdFx0dmFyIG9iaiA9IGFyZ3Muc2hpZnQoKTtcclxuXHRcdHZhciByZXBsYWNlZCA9IG9ialttZXRob2RdLmFwcGx5KG9iaiwgcGFydHMpO1xyXG5cclxuXHRcdHZhciBmaXJzdCA9IG5hbWUuY2hhckF0KDApO1xyXG5cdFx0aWYgKGZpcnN0ICE9IGZpcnN0LnRvTG93ZXJDYXNlKCkpIHsgcmVwbGFjZWQgPSByZXBsYWNlZC5jYXBpdGFsaXplKCk7IH1cclxuXHJcblx0XHRyZXR1cm4gcmVwbGFjZWQ7XHJcblx0fTtcclxuXHRyZXR1cm4gdGVtcGxhdGUucmVwbGFjZSgvJSg/OihbYS16XSspfCg/OnsoW159XSspfSkpL2dpLCByZXBsYWNlcik7XHJcbn07XHJcblxyXG5TdHJpbmcuZm9ybWF0Lm1hcCA9IFN0cmluZy5mb3JtYXQubWFwIHx8IHtcclxuXHRcInNcIjogXCJ0b1N0cmluZ1wiXHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVuaWVuY2Ugc2hvcnRjdXQgdG8gU3RyaW5nLmZvcm1hdCh0aGlzKVxyXG4gKi9cclxuU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgPSBTdHJpbmcucHJvdG90eXBlLmZvcm1hdCB8fCBmdW5jdGlvbigpIHtcclxuXHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcblx0YXJncy51bnNoaWZ0KHRoaXMpO1xyXG5cdHJldHVybiBTdHJpbmcuZm9ybWF0LmFwcGx5KFN0cmluZywgYXJncyk7XHJcbn07XHJcblxyXG5pZiAoIU9iamVjdC5jcmVhdGUpIHsgIFxyXG5cdC8qKlxyXG5cdCAqIEVTNSBPYmplY3QuY3JlYXRlXHJcblx0ICovXHJcblx0T2JqZWN0LmNyZWF0ZSA9IGZ1bmN0aW9uKG8pIHsgIFxyXG5cdFx0dmFyIHRtcCA9IGZ1bmN0aW9uKCkge307XHJcblx0XHR0bXAucHJvdG90eXBlID0gbztcclxuXHRcdHJldHVybiBuZXcgdG1wKCk7XHJcblx0fTsgIFxyXG59ICBcclxuLyoqXHJcbiAqIFNldHMgcHJvdG90eXBlIG9mIHRoaXMgZnVuY3Rpb24gdG8gYW4gaW5zdGFuY2Ugb2YgcGFyZW50IGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHBhcmVudFxyXG4gKi9cclxuRnVuY3Rpb24ucHJvdG90eXBlLmV4dGVuZCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5leHRlbmQgfHwgZnVuY3Rpb24ocGFyZW50KSB7XHJcblx0dGhpcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBhcmVudC5wcm90b3R5cGUpO1xyXG5cdHRoaXMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gdGhpcztcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPVxyXG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgZnVuY3Rpb24oY2IpIHsgcmV0dXJuIHNldFRpbWVvdXQoY2IsIDEwMDAvNjApOyB9O1xyXG5cclxuXHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPVxyXG5cdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm9DYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm1zQ2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IGZ1bmN0aW9uKGlkKSB7IHJldHVybiBjbGVhclRpbWVvdXQoaWQpOyB9O1xyXG59XHJcbi8qKlxyXG4gKiBAY2xhc3MgVmlzdWFsIG1hcCBkaXNwbGF5XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLndpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMuaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLmZvbnRTaXplPTE1XVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZm9udEZhbWlseT1cIm1vbm9zcGFjZVwiXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZm9udFN0eWxlPVwiXCJdIGJvbGQvaXRhbGljL25vbmUvYm90aFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZmc9XCIjY2NjXCJdXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5iZz1cIiMwMDBcIl1cclxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMuc3BhY2luZz0xXVxyXG4gKiBAcGFyYW0ge2Zsb2F0fSBbb3B0aW9ucy5ib3JkZXI9MF1cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmxheW91dD1cInJlY3RcIl1cclxuICogQHBhcmFtIHtib29sfSBbb3B0aW9ucy5mb3JjZVNxdWFyZVJhdGlvPWZhbHNlXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudGlsZVdpZHRoPTMyXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudGlsZUhlaWdodD0zMl1cclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zLnRpbGVNYXA9e31dXHJcbiAqIEBwYXJhbSB7aW1hZ2V9IFtvcHRpb25zLnRpbGVTZXQ9bnVsbF1cclxuICogQHBhcmFtIHtpbWFnZX0gW29wdGlvbnMudGlsZUNvbG9yaXplPWZhbHNlXVxyXG4gKi9cclxuUk9ULkRpc3BsYXkgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcblx0dGhpcy5fY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblx0dGhpcy5fZGF0YSA9IHt9O1xyXG5cdHRoaXMuX2RpcnR5ID0gZmFsc2U7IC8qIGZhbHNlID0gbm90aGluZywgdHJ1ZSA9IGFsbCwgb2JqZWN0ID0gZGlydHkgY2VsbHMgKi9cclxuXHR0aGlzLl9vcHRpb25zID0ge307XHJcblx0dGhpcy5fYmFja2VuZCA9IG51bGw7XHJcblx0XHJcblx0dmFyIGRlZmF1bHRPcHRpb25zID0ge1xyXG5cdFx0d2lkdGg6IFJPVC5ERUZBVUxUX1dJRFRILFxyXG5cdFx0aGVpZ2h0OiBST1QuREVGQVVMVF9IRUlHSFQsXHJcblx0XHR0cmFuc3Bvc2U6IGZhbHNlLFxyXG5cdFx0bGF5b3V0OiBcInJlY3RcIixcclxuXHRcdGZvbnRTaXplOiAxNSxcclxuXHRcdHNwYWNpbmc6IDEsXHJcblx0XHRib3JkZXI6IDAsXHJcblx0XHRmb3JjZVNxdWFyZVJhdGlvOiBmYWxzZSxcclxuXHRcdGZvbnRGYW1pbHk6IFwibW9ub3NwYWNlXCIsXHJcblx0XHRmb250U3R5bGU6IFwiXCIsXHJcblx0XHRmZzogXCIjY2NjXCIsXHJcblx0XHRiZzogXCIjMDAwXCIsXHJcblx0XHR0aWxlV2lkdGg6IDMyLFxyXG5cdFx0dGlsZUhlaWdodDogMzIsXHJcblx0XHR0aWxlTWFwOiB7fSxcclxuXHRcdHRpbGVTZXQ6IG51bGwsXHJcblx0XHR0aWxlQ29sb3JpemU6IGZhbHNlLFxyXG5cdFx0dGVybUNvbG9yOiBcInh0ZXJtXCJcclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyBkZWZhdWx0T3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHR0aGlzLnNldE9wdGlvbnMoZGVmYXVsdE9wdGlvbnMpO1xyXG5cdHRoaXMuREVCVUcgPSB0aGlzLkRFQlVHLmJpbmQodGhpcyk7XHJcblxyXG5cdHRoaXMuX3RpY2sgPSB0aGlzLl90aWNrLmJpbmQodGhpcyk7XHJcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX3RpY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERlYnVnIGhlbHBlciwgaWRlYWwgYXMgYSBtYXAgZ2VuZXJhdG9yIGNhbGxiYWNrLiBBbHdheXMgYm91bmQgdG8gdGhpcy5cclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtpbnR9IHdoYXRcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5ERUJVRyA9IGZ1bmN0aW9uKHgsIHksIHdoYXQpIHtcclxuXHR2YXIgY29sb3JzID0gW3RoaXMuX29wdGlvbnMuYmcsIHRoaXMuX29wdGlvbnMuZmddO1xyXG5cdHRoaXMuZHJhdyh4LCB5LCBudWxsLCBudWxsLCBjb2xvcnNbd2hhdCAlIGNvbG9ycy5sZW5ndGhdKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbGVhciB0aGUgd2hvbGUgZGlzcGxheSAoY292ZXIgaXQgd2l0aCBiYWNrZ3JvdW5kIGNvbG9yKVxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fZGF0YSA9IHt9O1xyXG5cdHRoaXMuX2RpcnR5ID0gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5EaXNwbGF5XHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHRpZiAob3B0aW9ucy53aWR0aCB8fCBvcHRpb25zLmhlaWdodCB8fCBvcHRpb25zLmZvbnRTaXplIHx8IG9wdGlvbnMuZm9udEZhbWlseSB8fCBvcHRpb25zLnNwYWNpbmcgfHwgb3B0aW9ucy5sYXlvdXQpIHtcclxuXHRcdGlmIChvcHRpb25zLmxheW91dCkgeyBcclxuXHRcdFx0dGhpcy5fYmFja2VuZCA9IG5ldyBST1QuRGlzcGxheVtvcHRpb25zLmxheW91dC5jYXBpdGFsaXplKCldKHRoaXMuX2NvbnRleHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBmb250ID0gKHRoaXMuX29wdGlvbnMuZm9udFN0eWxlID8gdGhpcy5fb3B0aW9ucy5mb250U3R5bGUgKyBcIiBcIiA6IFwiXCIpICsgdGhpcy5fb3B0aW9ucy5mb250U2l6ZSArIFwicHggXCIgKyB0aGlzLl9vcHRpb25zLmZvbnRGYW1pbHk7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZvbnQgPSBmb250O1xyXG5cdFx0dGhpcy5fYmFja2VuZC5jb21wdXRlKHRoaXMuX29wdGlvbnMpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5mb250ID0gZm9udDtcclxuXHRcdHRoaXMuX2NvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuXHRcdHRoaXMuX2NvbnRleHQudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuXHRcdHRoaXMuX2RpcnR5ID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyBjdXJyZW50bHkgc2V0IG9wdGlvbnNcclxuICogQHJldHVybnMge29iamVjdH0gQ3VycmVudCBvcHRpb25zIG9iamVjdCBcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX29wdGlvbnM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgRE9NIG5vZGUgb2YgdGhpcyBkaXNwbGF5XHJcbiAqIEByZXR1cm5zIHtub2RlfSBET00gbm9kZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9jb250ZXh0LmNhbnZhcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHRoZSBtYXhpbXVtIHdpZHRoL2hlaWdodCB0byBmaXQgaW50byBhIHNldCBvZiBnaXZlbiBjb25zdHJhaW50c1xyXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxXaWR0aCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgd2lkdGhcclxuICogQHBhcmFtIHtpbnR9IGF2YWlsSGVpZ2h0IE1heGltdW0gYWxsb3dlZCBwaXhlbCBoZWlnaHRcclxuICogQHJldHVybnMge2ludFsyXX0gY2VsbFdpZHRoLGNlbGxIZWlnaHRcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0cmV0dXJuIHRoaXMuX2JhY2tlbmQuY29tcHV0ZVNpemUoYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQsIHRoaXMuX29wdGlvbnMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdGhlIG1heGltdW0gZm9udCBzaXplIHRvIGZpdCBpbnRvIGEgc2V0IG9mIGdpdmVuIGNvbnN0cmFpbnRzXHJcbiAqIEBwYXJhbSB7aW50fSBhdmFpbFdpZHRoIE1heGltdW0gYWxsb3dlZCBwaXhlbCB3aWR0aFxyXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxIZWlnaHQgTWF4aW11bSBhbGxvd2VkIHBpeGVsIGhlaWdodFxyXG4gKiBAcmV0dXJucyB7aW50fSBmb250U2l6ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0cmV0dXJuIHRoaXMuX2JhY2tlbmQuY29tcHV0ZUZvbnRTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0LCB0aGlzLl9vcHRpb25zKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgRE9NIGV2ZW50IChtb3VzZSBvciB0b3VjaCkgdG8gbWFwIGNvb3JkaW5hdGVzLiBVc2VzIGZpcnN0IHRvdWNoIGZvciBtdWx0aS10b3VjaC5cclxuICogQHBhcmFtIHtFdmVudH0gZSBldmVudFxyXG4gKiBAcmV0dXJucyB7aW50WzJdfSAtMSBmb3IgdmFsdWVzIG91dHNpZGUgb2YgdGhlIGNhbnZhc1xyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKGUpIHtcclxuXHRpZiAoZS50b3VjaGVzKSB7XHJcblx0XHR2YXIgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xyXG5cdFx0dmFyIHkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIHggPSBlLmNsaWVudFg7XHJcblx0XHR2YXIgeSA9IGUuY2xpZW50WTtcclxuXHR9XHJcblxyXG5cdHZhciByZWN0ID0gdGhpcy5fY29udGV4dC5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0eCAtPSByZWN0LmxlZnQ7XHJcblx0eSAtPSByZWN0LnRvcDtcclxuXHRcclxuXHR4ICo9IHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoIC8gdGhpcy5fY29udGV4dC5jYW52YXMuY2xpZW50V2lkdGg7XHJcblx0eSAqPSB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgLyB0aGlzLl9jb250ZXh0LmNhbnZhcy5jbGllbnRIZWlnaHQ7XHJcblxyXG5cdGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoIHx8IHkgPj0gdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0KSB7IHJldHVybiBbLTEsIC0xXTsgfVxyXG5cclxuXHRyZXR1cm4gdGhpcy5fYmFja2VuZC5ldmVudFRvUG9zaXRpb24oeCwgeSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtzdHJpbmcgfHwgc3RyaW5nW119IGNoIE9uZSBvciBtb3JlIGNoYXJzICh3aWxsIGJlIG92ZXJsYXBwaW5nIHRoZW1zZWx2ZXMpXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbZmddIGZvcmVncm91bmQgY29sb3JcclxuICogQHBhcmFtIHtzdHJpbmd9IFtiZ10gYmFja2dyb3VuZCBjb2xvclxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbih4LCB5LCBjaCwgZmcsIGJnKSB7XHJcblx0aWYgKCFmZykgeyBmZyA9IHRoaXMuX29wdGlvbnMuZmc7IH1cclxuXHRpZiAoIWJnKSB7IGJnID0gdGhpcy5fb3B0aW9ucy5iZzsgfVxyXG5cdHRoaXMuX2RhdGFbeCtcIixcIit5XSA9IFt4LCB5LCBjaCwgZmcsIGJnXTtcclxuXHRcclxuXHRpZiAodGhpcy5fZGlydHkgPT09IHRydWUpIHsgcmV0dXJuOyB9IC8qIHdpbGwgYWxyZWFkeSByZWRyYXcgZXZlcnl0aGluZyAqL1xyXG5cdGlmICghdGhpcy5fZGlydHkpIHsgdGhpcy5fZGlydHkgPSB7fTsgfSAvKiBmaXJzdCEgKi9cclxuXHR0aGlzLl9kaXJ0eVt4K1wiLFwiK3ldID0gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEcmF3cyBhIHRleHQgYXQgZ2l2ZW4gcG9zaXRpb24uIE9wdGlvbmFsbHkgd3JhcHMgYXQgYSBtYXhpbXVtIGxlbmd0aC4gQ3VycmVudGx5IGRvZXMgbm90IHdvcmsgd2l0aCBoZXggbGF5b3V0LlxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBNYXkgY29udGFpbiBjb2xvci9iYWNrZ3JvdW5kIGZvcm1hdCBzcGVjaWZpZXJzLCAlY3tuYW1lfS8lYntuYW1lfSwgYm90aCBvcHRpb25hbC4gJWN7fS8lYnt9IHJlc2V0cyB0byBkZWZhdWx0LlxyXG4gKiBAcGFyYW0ge2ludH0gW21heFdpZHRoXSB3cmFwIGF0IHdoYXQgd2lkdGg/XHJcbiAqIEByZXR1cm5zIHtpbnR9IGxpbmVzIGRyYXduXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZHJhd1RleHQgPSBmdW5jdGlvbih4LCB5LCB0ZXh0LCBtYXhXaWR0aCkge1xyXG5cdHZhciBmZyA9IG51bGw7XHJcblx0dmFyIGJnID0gbnVsbDtcclxuXHR2YXIgY3ggPSB4O1xyXG5cdHZhciBjeSA9IHk7XHJcblx0dmFyIGxpbmVzID0gMTtcclxuXHRpZiAoIW1heFdpZHRoKSB7IG1heFdpZHRoID0gdGhpcy5fb3B0aW9ucy53aWR0aC14OyB9XHJcblxyXG5cdHZhciB0b2tlbnMgPSBST1QuVGV4dC50b2tlbml6ZSh0ZXh0LCBtYXhXaWR0aCk7XHJcblxyXG5cdHdoaWxlICh0b2tlbnMubGVuZ3RoKSB7IC8qIGludGVycHJldCB0b2tlbml6ZWQgb3Bjb2RlIHN0cmVhbSAqL1xyXG5cdFx0dmFyIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XHJcblx0XHRzd2l0Y2ggKHRva2VuLnR5cGUpIHtcclxuXHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX1RFWFQ6XHJcblx0XHRcdFx0dmFyIGlzU3BhY2UgPSBmYWxzZSwgaXNQcmV2U3BhY2UgPSBmYWxzZSwgaXNGdWxsV2lkdGggPSBmYWxzZSwgaXNQcmV2RnVsbFdpZHRoID0gZmFsc2U7XHJcblx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8dG9rZW4udmFsdWUubGVuZ3RoO2krKykge1xyXG5cdFx0XHRcdFx0dmFyIGNjID0gdG9rZW4udmFsdWUuY2hhckNvZGVBdChpKTtcclxuXHRcdFx0XHRcdHZhciBjID0gdG9rZW4udmFsdWUuY2hhckF0KGkpO1xyXG5cdFx0XHRcdFx0Ly8gQXNzaWduIHRvIGB0cnVlYCB3aGVuIHRoZSBjdXJyZW50IGNoYXIgaXMgZnVsbC13aWR0aC5cclxuXHRcdFx0XHRcdGlzRnVsbFdpZHRoID0gKGNjID4gMHhmZjAwICYmIGNjIDwgMHhmZjYxKSB8fCAoY2MgPiAweGZmZGMgJiYgY2MgPCAweGZmZTgpIHx8IGNjID4gMHhmZmVlO1xyXG5cdFx0XHRcdFx0Ly8gQ3VycmVudCBjaGFyIGlzIHNwYWNlLCB3aGF0ZXZlciBmdWxsLXdpZHRoIG9yIGhhbGYtd2lkdGggYm90aCBhcmUgT0suXHJcblx0XHRcdFx0XHRpc1NwYWNlID0gKGMuY2hhckNvZGVBdCgwKSA9PSAweDIwIHx8IGMuY2hhckNvZGVBdCgwKSA9PSAweDMwMDApO1xyXG5cdFx0XHRcdFx0Ly8gVGhlIHByZXZpb3VzIGNoYXIgaXMgZnVsbC13aWR0aCBhbmRcclxuXHRcdFx0XHRcdC8vIGN1cnJlbnQgY2hhciBpcyBuZXRoZXIgaGFsZi13aWR0aCBub3IgYSBzcGFjZS5cclxuXHRcdFx0XHRcdGlmIChpc1ByZXZGdWxsV2lkdGggJiYgIWlzRnVsbFdpZHRoICYmICFpc1NwYWNlKSB7IGN4Kys7IH0gLy8gYWRkIGFuIGV4dHJhIHBvc2l0aW9uXHJcblx0XHRcdFx0XHQvLyBUaGUgY3VycmVudCBjaGFyIGlzIGZ1bGwtd2lkdGggYW5kXHJcblx0XHRcdFx0XHQvLyB0aGUgcHJldmlvdXMgY2hhciBpcyBub3QgYSBzcGFjZS5cclxuXHRcdFx0XHRcdGlmKGlzRnVsbFdpZHRoICYmICFpc1ByZXZTcGFjZSkgeyBjeCsrOyB9IC8vIGFkZCBhbiBleHRyYSBwb3NpdGlvblxyXG5cdFx0XHRcdFx0dGhpcy5kcmF3KGN4KyssIGN5LCBjLCBmZywgYmcpO1xyXG5cdFx0XHRcdFx0aXNQcmV2U3BhY2UgPSBpc1NwYWNlO1xyXG5cdFx0XHRcdFx0aXNQcmV2RnVsbFdpZHRoID0gaXNGdWxsV2lkdGg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9GRzpcclxuXHRcdFx0XHRmZyA9IHRva2VuLnZhbHVlIHx8IG51bGw7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX0JHOlxyXG5cdFx0XHRcdGJnID0gdG9rZW4udmFsdWUgfHwgbnVsbDtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfTkVXTElORTpcclxuXHRcdFx0XHRjeCA9IHg7XHJcblx0XHRcdFx0Y3krKztcclxuXHRcdFx0XHRsaW5lcysrO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBsaW5lcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaW1lciB0aWNrOiB1cGRhdGUgZGlydHkgcGFydHNcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5fdGljayA9IGZ1bmN0aW9uKCkge1xyXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl90aWNrKTtcclxuXHJcblx0aWYgKCF0aGlzLl9kaXJ0eSkgeyByZXR1cm47IH1cclxuXHJcblx0aWYgKHRoaXMuX2RpcnR5ID09PSB0cnVlKSB7IC8qIGRyYXcgYWxsICovXHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuX29wdGlvbnMuYmc7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoLCB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xyXG5cclxuXHRcdGZvciAodmFyIGlkIGluIHRoaXMuX2RhdGEpIHsgLyogcmVkcmF3IGNhY2hlZCBkYXRhICovXHJcblx0XHRcdHRoaXMuX2RyYXcoaWQsIGZhbHNlKTtcclxuXHRcdH1cclxuXHJcblx0fSBlbHNlIHsgLyogZHJhdyBvbmx5IGRpcnR5ICovXHJcblx0XHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fZGlydHkpIHtcclxuXHRcdFx0dGhpcy5fZHJhdyhrZXksIHRydWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGhpcy5fZGlydHkgPSBmYWxzZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFdoYXQgdG8gZHJhd1xyXG4gKiBAcGFyYW0ge2Jvb2x9IGNsZWFyQmVmb3JlIElzIGl0IG5lY2Vzc2FyeSB0byBjbGVhbiBiZWZvcmU/XHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuX2RyYXcgPSBmdW5jdGlvbihrZXksIGNsZWFyQmVmb3JlKSB7XHJcblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XHJcblx0aWYgKGRhdGFbNF0gIT0gdGhpcy5fb3B0aW9ucy5iZykgeyBjbGVhckJlZm9yZSA9IHRydWU7IH1cclxuXHJcblx0dGhpcy5fYmFja2VuZC5kcmF3KGRhdGEsIGNsZWFyQmVmb3JlKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBBYnN0cmFjdCBkaXNwbGF5IGJhY2tlbmQgbW9kdWxlXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5CYWNrZW5kID0gZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHkpIHtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBSZWN0YW5ndWxhciBiYWNrZW5kXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5SZWN0ID0gZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFJPVC5EaXNwbGF5LkJhY2tlbmQuY2FsbCh0aGlzLCBjb250ZXh0KTtcclxuXHRcclxuXHR0aGlzLl9zcGFjaW5nWCA9IDA7XHJcblx0dGhpcy5fc3BhY2luZ1kgPSAwO1xyXG5cdHRoaXMuX2NhbnZhc0NhY2hlID0ge307XHJcblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xyXG59O1xyXG5ST1QuRGlzcGxheS5SZWN0LmV4dGVuZChST1QuRGlzcGxheS5CYWNrZW5kKTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QuY2FjaGUgPSBmYWxzZTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dGhpcy5fY2FudmFzQ2FjaGUgPSB7fTtcclxuXHR0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcclxuXHJcblx0dmFyIGNoYXJXaWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jb250ZXh0Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XHJcblx0dGhpcy5fc3BhY2luZ1ggPSBNYXRoLmNlaWwob3B0aW9ucy5zcGFjaW5nICogY2hhcldpZHRoKTtcclxuXHR0aGlzLl9zcGFjaW5nWSA9IE1hdGguY2VpbChvcHRpb25zLnNwYWNpbmcgKiBvcHRpb25zLmZvbnRTaXplKTtcclxuXHJcblx0aWYgKHRoaXMuX29wdGlvbnMuZm9yY2VTcXVhcmVSYXRpbykge1xyXG5cdFx0dGhpcy5fc3BhY2luZ1ggPSB0aGlzLl9zcGFjaW5nWSA9IE1hdGgubWF4KHRoaXMuX3NwYWNpbmdYLCB0aGlzLl9zcGFjaW5nWSk7XHJcblx0fVxyXG5cclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCA9IG9wdGlvbnMud2lkdGggKiB0aGlzLl9zcGFjaW5nWDtcclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCAqIHRoaXMuX3NwYWNpbmdZO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XHJcblx0aWYgKHRoaXMuY29uc3RydWN0b3IuY2FjaGUpIHtcclxuXHRcdHRoaXMuX2RyYXdXaXRoQ2FjaGUoZGF0YSwgY2xlYXJCZWZvcmUpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aGlzLl9kcmF3Tm9DYWNoZShkYXRhLCBjbGVhckJlZm9yZSk7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuX2RyYXdXaXRoQ2FjaGUgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG5cdHZhciB4ID0gZGF0YVswXTtcclxuXHR2YXIgeSA9IGRhdGFbMV07XHJcblx0dmFyIGNoID0gZGF0YVsyXTtcclxuXHR2YXIgZmcgPSBkYXRhWzNdO1xyXG5cdHZhciBiZyA9IGRhdGFbNF07XHJcblxyXG5cdHZhciBoYXNoID0gXCJcIitjaCtmZytiZztcclxuXHRpZiAoaGFzaCBpbiB0aGlzLl9jYW52YXNDYWNoZSkge1xyXG5cdFx0dmFyIGNhbnZhcyA9IHRoaXMuX2NhbnZhc0NhY2hlW2hhc2hdO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgYiA9IHRoaXMuX29wdGlvbnMuYm9yZGVyO1xyXG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcblx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHRcdGNhbnZhcy53aWR0aCA9IHRoaXMuX3NwYWNpbmdYO1xyXG5cdFx0Y2FudmFzLmhlaWdodCA9IHRoaXMuX3NwYWNpbmdZO1xyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IGJnO1xyXG5cdFx0Y3R4LmZpbGxSZWN0KGIsIGIsIGNhbnZhcy53aWR0aC1iLCBjYW52YXMuaGVpZ2h0LWIpO1xyXG5cdFx0XHJcblx0XHRpZiAoY2gpIHtcclxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IGZnO1xyXG5cdFx0XHRjdHguZm9udCA9IHRoaXMuX2NvbnRleHQuZm9udDtcclxuXHRcdFx0Y3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcblx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG5cclxuXHRcdFx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcclxuXHRcdFx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHRcdGN0eC5maWxsVGV4dChjaGFyc1tpXSwgdGhpcy5fc3BhY2luZ1gvMiwgTWF0aC5jZWlsKHRoaXMuX3NwYWNpbmdZLzIpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5fY2FudmFzQ2FjaGVbaGFzaF0gPSBjYW52YXM7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKGNhbnZhcywgeCp0aGlzLl9zcGFjaW5nWCwgeSp0aGlzLl9zcGFjaW5nWSk7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5fZHJhd05vQ2FjaGUgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG5cdHZhciB4ID0gZGF0YVswXTtcclxuXHR2YXIgeSA9IGRhdGFbMV07XHJcblx0dmFyIGNoID0gZGF0YVsyXTtcclxuXHR2YXIgZmcgPSBkYXRhWzNdO1xyXG5cdHZhciBiZyA9IGRhdGFbNF07XHJcblxyXG5cdGlmIChjbGVhckJlZm9yZSkgeyBcclxuXHRcdHZhciBiID0gdGhpcy5fb3B0aW9ucy5ib3JkZXI7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsUmVjdCh4KnRoaXMuX3NwYWNpbmdYICsgYiwgeSp0aGlzLl9zcGFjaW5nWSArIGIsIHRoaXMuX3NwYWNpbmdYIC0gYiwgdGhpcy5fc3BhY2luZ1kgLSBiKTtcclxuXHR9XHJcblx0XHJcblx0aWYgKCFjaCkgeyByZXR1cm47IH1cclxuXHJcblx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBmZztcclxuXHJcblx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcclxuXHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxUZXh0KGNoYXJzW2ldLCAoeCswLjUpICogdGhpcy5fc3BhY2luZ1gsIE1hdGguY2VpbCgoeSswLjUpICogdGhpcy5fc3BhY2luZ1kpKTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0dmFyIHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fc3BhY2luZ1gpO1xyXG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fc3BhY2luZ1kpO1xyXG5cdHJldHVybiBbd2lkdGgsIGhlaWdodF07XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHZhciBib3hXaWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX29wdGlvbnMud2lkdGgpO1xyXG5cdHZhciBib3hIZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy5oZWlnaHQpO1xyXG5cclxuXHQvKiBjb21wdXRlIGNoYXIgcmF0aW8gKi9cclxuXHR2YXIgb2xkRm9udCA9IHRoaXMuX2NvbnRleHQuZm9udDtcclxuXHR0aGlzLl9jb250ZXh0LmZvbnQgPSBcIjEwMHB4IFwiICsgdGhpcy5fb3B0aW9ucy5mb250RmFtaWx5O1xyXG5cdHZhciB3aWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jb250ZXh0Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XHJcblx0dGhpcy5fY29udGV4dC5mb250ID0gb2xkRm9udDtcclxuXHR2YXIgcmF0aW8gPSB3aWR0aCAvIDEwMDtcclxuXHRcdFxyXG5cdHZhciB3aWR0aEZyYWN0aW9uID0gcmF0aW8gKiBib3hIZWlnaHQgLyBib3hXaWR0aDtcclxuXHRpZiAod2lkdGhGcmFjdGlvbiA+IDEpIHsgLyogdG9vIHdpZGUgd2l0aCBjdXJyZW50IGFzcGVjdCByYXRpbyAqL1xyXG5cdFx0Ym94SGVpZ2h0ID0gTWF0aC5mbG9vcihib3hIZWlnaHQgLyB3aWR0aEZyYWN0aW9uKTtcclxuXHR9XHJcblx0cmV0dXJuIE1hdGguZmxvb3IoYm94SGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy5zcGFjaW5nKTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRyZXR1cm4gW01hdGguZmxvb3IoeC90aGlzLl9zcGFjaW5nWCksIE1hdGguZmxvb3IoeS90aGlzLl9zcGFjaW5nWSldO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEhleGFnb25hbCBiYWNrZW5kXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5IZXggPSBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0Uk9ULkRpc3BsYXkuQmFja2VuZC5jYWxsKHRoaXMsIGNvbnRleHQpO1xyXG5cclxuXHR0aGlzLl9zcGFjaW5nWCA9IDA7XHJcblx0dGhpcy5fc3BhY2luZ1kgPSAwO1xyXG5cdHRoaXMuX2hleFNpemUgPSAwO1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7fTtcclxufTtcclxuUk9ULkRpc3BsYXkuSGV4LmV4dGVuZChST1QuRGlzcGxheS5CYWNrZW5kKTtcclxuXHJcblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcclxuXHJcblx0LyogRklYTUUgY2hhciBzaXplIGNvbXB1dGF0aW9uIGRvZXMgbm90IHJlc3BlY3QgdHJhbnNwb3NlZCBoZXhlcyAqL1xyXG5cdHZhciBjaGFyV2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xyXG5cdHRoaXMuX2hleFNpemUgPSBNYXRoLmZsb29yKG9wdGlvbnMuc3BhY2luZyAqIChvcHRpb25zLmZvbnRTaXplICsgY2hhcldpZHRoL01hdGguc3FydCgzKSkgLyAyKTtcclxuXHR0aGlzLl9zcGFjaW5nWCA9IHRoaXMuX2hleFNpemUgKiBNYXRoLnNxcnQoMykgLyAyO1xyXG5cdHRoaXMuX3NwYWNpbmdZID0gdGhpcy5faGV4U2l6ZSAqIDEuNTtcclxuXHJcblx0aWYgKG9wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHR2YXIgeHByb3AgPSBcImhlaWdodFwiO1xyXG5cdFx0dmFyIHlwcm9wID0gXCJ3aWR0aFwiO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgeHByb3AgPSBcIndpZHRoXCI7XHJcblx0XHR2YXIgeXByb3AgPSBcImhlaWdodFwiO1xyXG5cdH1cclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhc1t4cHJvcF0gPSBNYXRoLmNlaWwoIChvcHRpb25zLndpZHRoICsgMSkgKiB0aGlzLl9zcGFjaW5nWCApO1xyXG5cdHRoaXMuX2NvbnRleHQuY2FudmFzW3lwcm9wXSA9IE1hdGguY2VpbCggKG9wdGlvbnMuaGVpZ2h0IC0gMSkgKiB0aGlzLl9zcGFjaW5nWSArIDIqdGhpcy5faGV4U2l6ZSApO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxuXHR2YXIgeCA9IGRhdGFbMF07XHJcblx0dmFyIHkgPSBkYXRhWzFdO1xyXG5cdHZhciBjaCA9IGRhdGFbMl07XHJcblx0dmFyIGZnID0gZGF0YVszXTtcclxuXHR2YXIgYmcgPSBkYXRhWzRdO1xyXG5cclxuXHR2YXIgcHggPSBbXHJcblx0XHQoeCsxKSAqIHRoaXMuX3NwYWNpbmdYLFxyXG5cdFx0eSAqIHRoaXMuX3NwYWNpbmdZICsgdGhpcy5faGV4U2l6ZVxyXG5cdF07XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7IHB4LnJldmVyc2UoKTsgfVxyXG5cclxuXHRpZiAoY2xlYXJCZWZvcmUpIHtcclxuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gYmc7XHJcblx0XHR0aGlzLl9maWxsKHB4WzBdLCBweFsxXSk7XHJcblx0fVxyXG5cclxuXHRpZiAoIWNoKSB7IHJldHVybjsgfVxyXG5cclxuXHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGZnO1xyXG5cclxuXHR2YXIgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xyXG5cdGZvciAodmFyIGk9MDtpPGNoYXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFRleHQoY2hhcnNbaV0sIHB4WzBdLCBNYXRoLmNlaWwocHhbMV0pKTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHRpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcclxuXHRcdGF2YWlsV2lkdGggKz0gYXZhaWxIZWlnaHQ7XHJcblx0XHRhdmFpbEhlaWdodCA9IGF2YWlsV2lkdGggLSBhdmFpbEhlaWdodDtcclxuXHRcdGF2YWlsV2lkdGggLT0gYXZhaWxIZWlnaHQ7XHJcblx0fVxyXG5cclxuXHR2YXIgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9zcGFjaW5nWCkgLSAxO1xyXG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKChhdmFpbEhlaWdodCAtIDIqdGhpcy5faGV4U2l6ZSkgLyB0aGlzLl9zcGFjaW5nWSArIDEpO1xyXG5cdHJldHVybiBbd2lkdGgsIGhlaWdodF07XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHRhdmFpbFdpZHRoICs9IGF2YWlsSGVpZ2h0O1xyXG5cdFx0YXZhaWxIZWlnaHQgPSBhdmFpbFdpZHRoIC0gYXZhaWxIZWlnaHQ7XHJcblx0XHRhdmFpbFdpZHRoIC09IGF2YWlsSGVpZ2h0O1xyXG5cdH1cclxuXHJcblx0dmFyIGhleFNpemVXaWR0aCA9IDIqYXZhaWxXaWR0aCAvICgodGhpcy5fb3B0aW9ucy53aWR0aCsxKSAqIE1hdGguc3FydCgzKSkgLSAxO1xyXG5cdHZhciBoZXhTaXplSGVpZ2h0ID0gYXZhaWxIZWlnaHQgLyAoMiArIDEuNSoodGhpcy5fb3B0aW9ucy5oZWlnaHQtMSkpO1xyXG5cdHZhciBoZXhTaXplID0gTWF0aC5taW4oaGV4U2l6ZVdpZHRoLCBoZXhTaXplSGVpZ2h0KTtcclxuXHJcblx0LyogY29tcHV0ZSBjaGFyIHJhdGlvICovXHJcblx0dmFyIG9sZEZvbnQgPSB0aGlzLl9jb250ZXh0LmZvbnQ7XHJcblx0dGhpcy5fY29udGV4dC5mb250ID0gXCIxMDBweCBcIiArIHRoaXMuX29wdGlvbnMuZm9udEZhbWlseTtcclxuXHR2YXIgd2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xyXG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IG9sZEZvbnQ7XHJcblx0dmFyIHJhdGlvID0gd2lkdGggLyAxMDA7XHJcblxyXG5cdGhleFNpemUgPSBNYXRoLmZsb29yKGhleFNpemUpKzE7IC8qIGNsb3Nlc3QgbGFyZ2VyIGhleFNpemUgKi9cclxuXHJcblx0LyogRklYTUUgY2hhciBzaXplIGNvbXB1dGF0aW9uIGRvZXMgbm90IHJlc3BlY3QgdHJhbnNwb3NlZCBoZXhlcyAqL1xyXG5cdHZhciBmb250U2l6ZSA9IDIqaGV4U2l6ZSAvICh0aGlzLl9vcHRpb25zLnNwYWNpbmcgKiAoMSArIHJhdGlvIC8gTWF0aC5zcXJ0KDMpKSk7XHJcblxyXG5cdC8qIGNsb3Nlc3Qgc21hbGxlciBmb250U2l6ZSAqL1xyXG5cdHJldHVybiBNYXRoLmNlaWwoZm9udFNpemUpLTE7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcclxuXHRcdHggKz0geTtcclxuXHRcdHkgPSB4LXk7XHJcblx0XHR4IC09IHk7XHJcblx0XHR2YXIgbm9kZVNpemUgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aDtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIG5vZGVTaXplID0gdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0O1xyXG5cdH1cclxuXHR2YXIgc2l6ZSA9IG5vZGVTaXplIC8gdGhpcy5fb3B0aW9ucy5oZWlnaHQ7XHJcblx0eSA9IE1hdGguZmxvb3IoeS9zaXplKTtcclxuXHJcblx0aWYgKHkubW9kKDIpKSB7IC8qIG9kZCByb3cgKi9cclxuXHRcdHggLT0gdGhpcy5fc3BhY2luZ1g7XHJcblx0XHR4ID0gMSArIDIqTWF0aC5mbG9vcih4LygyKnRoaXMuX3NwYWNpbmdYKSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHggPSAyKk1hdGguZmxvb3IoeC8oMip0aGlzLl9zcGFjaW5nWCkpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIFt4LCB5XTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBcmd1bWVudHMgYXJlIHBpeGVsIHZhbHVlcy4gSWYgXCJ0cmFuc3Bvc2VkXCIgbW9kZSBpcyBlbmFibGVkLCB0aGVuIHRoZXNlIHR3byBhcmUgYWxyZWFkeSBzd2FwcGVkLlxyXG4gKi9cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5fZmlsbCA9IGZ1bmN0aW9uKGN4LCBjeSkge1xyXG5cdHZhciBhID0gdGhpcy5faGV4U2l6ZTtcclxuXHR2YXIgYiA9IHRoaXMuX29wdGlvbnMuYm9yZGVyO1xyXG5cclxuXHR0aGlzLl9jb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cclxuXHRpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcclxuXHRcdHRoaXMuX2NvbnRleHQubW92ZVRvKGN4LWErYixcdGN5KTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LWEvMitiLFx0Y3krdGhpcy5fc3BhY2luZ1gtYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCthLzItYixcdGN5K3RoaXMuX3NwYWNpbmdYLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grYS1iLFx0Y3kpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grYS8yLWIsXHRjeS10aGlzLl9zcGFjaW5nWCtiKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LWEvMitiLFx0Y3ktdGhpcy5fc3BhY2luZ1grYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC1hK2IsXHRjeSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRoaXMuX2NvbnRleHQubW92ZVRvKGN4LFx0XHRcdFx0XHRjeS1hK2IpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grdGhpcy5fc3BhY2luZ1gtYixcdGN5LWEvMitiKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K3RoaXMuX3NwYWNpbmdYLWIsXHRjeSthLzItYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCxcdFx0XHRcdFx0Y3krYS1iKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LXRoaXMuX3NwYWNpbmdYK2IsXHRjeSthLzItYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC10aGlzLl9zcGFjaW5nWCtiLFx0Y3ktYS8yK2IpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gsXHRcdFx0XHRcdGN5LWErYik7XHJcblx0fVxyXG5cdHRoaXMuX2NvbnRleHQuZmlsbCgpO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFRpbGUgYmFja2VuZFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkuVGlsZSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRST1QuRGlzcGxheS5SZWN0LmNhbGwodGhpcywgY29udGV4dCk7XHJcblx0XHJcblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xyXG5cdHRoaXMuX2NvbG9yQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxufTtcclxuUk9ULkRpc3BsYXkuVGlsZS5leHRlbmQoUk9ULkRpc3BsYXkuUmVjdCk7XHJcblxyXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xyXG5cdHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoID0gb3B0aW9ucy53aWR0aCAqIG9wdGlvbnMudGlsZVdpZHRoO1xyXG5cdHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0ICogb3B0aW9ucy50aWxlSGVpZ2h0O1xyXG5cdHRoaXMuX2NvbG9yQ2FudmFzLndpZHRoID0gb3B0aW9ucy50aWxlV2lkdGg7XHJcblx0dGhpcy5fY29sb3JDYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy50aWxlSGVpZ2h0O1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XHJcblx0dmFyIHggPSBkYXRhWzBdO1xyXG5cdHZhciB5ID0gZGF0YVsxXTtcclxuXHR2YXIgY2ggPSBkYXRhWzJdO1xyXG5cdHZhciBmZyA9IGRhdGFbM107XHJcblx0dmFyIGJnID0gZGF0YVs0XTtcclxuXHJcblx0dmFyIHRpbGVXaWR0aCA9IHRoaXMuX29wdGlvbnMudGlsZVdpZHRoO1xyXG5cdHZhciB0aWxlSGVpZ2h0ID0gdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0O1xyXG5cclxuXHRpZiAoY2xlYXJCZWZvcmUpIHtcclxuXHRcdGlmICh0aGlzLl9vcHRpb25zLnRpbGVDb2xvcml6ZSkge1xyXG5cdFx0XHR0aGlzLl9jb250ZXh0LmNsZWFyUmVjdCh4KnRpbGVXaWR0aCwgeSp0aWxlSGVpZ2h0LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBiZztcclxuXHRcdFx0dGhpcy5fY29udGV4dC5maWxsUmVjdCh4KnRpbGVXaWR0aCwgeSp0aWxlSGVpZ2h0LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKCFjaCkgeyByZXR1cm47IH1cclxuXHJcblx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcclxuXHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgdGlsZSA9IHRoaXMuX29wdGlvbnMudGlsZU1hcFtjaGFyc1tpXV07XHJcblx0XHRpZiAoIXRpbGUpIHsgdGhyb3cgbmV3IEVycm9yKFwiQ2hhciAnXCIgKyBjaGFyc1tpXSArIFwiJyBub3QgZm91bmQgaW4gdGlsZU1hcFwiKTsgfVxyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5fb3B0aW9ucy50aWxlQ29sb3JpemUpIHsgLyogYXBwbHkgY29sb3JpemF0aW9uICovXHJcblx0XHRcdHZhciBjYW52YXMgPSB0aGlzLl9jb2xvckNhbnZhcztcclxuXHRcdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cdFx0XHRjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xyXG5cclxuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UoXHJcblx0XHRcdFx0dGhpcy5fb3B0aW9ucy50aWxlU2V0LFxyXG5cdFx0XHRcdHRpbGVbMF0sIHRpbGVbMV0sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCxcclxuXHRcdFx0XHQwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHRcclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdGlmIChmZyAhPSBcInRyYW5zcGFyZW50XCIpIHtcclxuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGZnO1xyXG5cdFx0XHRcdGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2UtYXRvcFwiO1xyXG5cdFx0XHRcdGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGJnICE9IFwidHJhbnNwYXJlbnRcIikge1xyXG5cdFx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gYmc7XHJcblx0XHRcdFx0Y29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcImRlc3RpbmF0aW9uLW92ZXJcIjtcclxuXHRcdFx0XHRjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKGNhbnZhcywgeCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHJcblx0XHR9IGVsc2UgeyAvKiBubyBjb2xvcml6aW5nLCBlYXN5ICovXHJcblx0XHRcdHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKFxyXG5cdFx0XHRcdHRoaXMuX29wdGlvbnMudGlsZVNldCxcclxuXHRcdFx0XHR0aWxlWzBdLCB0aWxlWzFdLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsXHJcblx0XHRcdFx0eCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX29wdGlvbnMudGlsZVdpZHRoKTtcclxuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX29wdGlvbnMudGlsZUhlaWdodCk7XHJcblx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0dmFyIHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fb3B0aW9ucy53aWR0aCk7XHJcblx0dmFyIGhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9vcHRpb25zLmhlaWdodCk7XHJcblx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRyZXR1cm4gW01hdGguZmxvb3IoeC90aGlzLl9vcHRpb25zLnRpbGVXaWR0aCksIE1hdGguZmxvb3IoeS90aGlzLl9vcHRpb25zLnRpbGVIZWlnaHQpXTtcclxufTtcclxuLyoqXHJcbiAqIEBuYW1lc3BhY2VcclxuICogVGhpcyBjb2RlIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIEFsZWEgYWxnb3JpdGhtOyAoQykgMjAxMCBKb2hhbm5lcyBCYWFnw7hlLlxyXG4gKiBBbGVhIGlzIGxpY2Vuc2VkIGFjY29yZGluZyB0byB0aGUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZS5cclxuICovXHJcblJPVC5STkcgPSB7XHJcblx0LyoqXHJcblx0ICogQHJldHVybnMge251bWJlcn0gXHJcblx0ICovXHJcblx0Z2V0U2VlZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2VlZDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2VlZCBTZWVkIHRoZSBudW1iZXIgZ2VuZXJhdG9yXHJcblx0ICovXHJcblx0c2V0U2VlZDogZnVuY3Rpb24oc2VlZCkge1xyXG5cdFx0c2VlZCA9IChzZWVkIDwgMSA/IDEvc2VlZCA6IHNlZWQpO1xyXG5cclxuXHRcdHRoaXMuX3NlZWQgPSBzZWVkO1xyXG5cdFx0dGhpcy5fczAgPSAoc2VlZCA+Pj4gMCkgKiB0aGlzLl9mcmFjO1xyXG5cclxuXHRcdHNlZWQgPSAoc2VlZCo2OTA2OSArIDEpID4+PiAwO1xyXG5cdFx0dGhpcy5fczEgPSBzZWVkICogdGhpcy5fZnJhYztcclxuXHJcblx0XHRzZWVkID0gKHNlZWQqNjkwNjkgKyAxKSA+Pj4gMDtcclxuXHRcdHRoaXMuX3MyID0gc2VlZCAqIHRoaXMuX2ZyYWM7XHJcblxyXG5cdFx0dGhpcy5fYyA9IDE7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBAcmV0dXJucyB7ZmxvYXR9IFBzZXVkb3JhbmRvbSB2YWx1ZSBbMCwxKSwgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkXHJcblx0ICovXHJcblx0Z2V0VW5pZm9ybTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdCA9IDIwOTE2MzkgKiB0aGlzLl9zMCArIHRoaXMuX2MgKiB0aGlzLl9mcmFjO1xyXG5cdFx0dGhpcy5fczAgPSB0aGlzLl9zMTtcclxuXHRcdHRoaXMuX3MxID0gdGhpcy5fczI7XHJcblx0XHR0aGlzLl9jID0gdCB8IDA7XHJcblx0XHR0aGlzLl9zMiA9IHQgLSB0aGlzLl9jO1xyXG5cdFx0cmV0dXJuIHRoaXMuX3MyO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7aW50fSBsb3dlckJvdW5kIFRoZSBsb3dlciBlbmQgb2YgdGhlIHJhbmdlIHRvIHJldHVybiBhIHZhbHVlIGZyb20sIGluY2x1c2l2ZVxyXG5cdCAqIEBwYXJhbSB7aW50fSB1cHBlckJvdW5kIFRoZSB1cHBlciBlbmQgb2YgdGhlIHJhbmdlIHRvIHJldHVybiBhIHZhbHVlIGZyb20sIGluY2x1c2l2ZVxyXG5cdCAqIEByZXR1cm5zIHtpbnR9IFBzZXVkb3JhbmRvbSB2YWx1ZSBbbG93ZXJCb3VuZCwgdXBwZXJCb3VuZF0sIHVzaW5nIFJPVC5STkcuZ2V0VW5pZm9ybSgpIHRvIGRpc3RyaWJ1dGUgdGhlIHZhbHVlXHJcblx0ICovXHJcblx0Z2V0VW5pZm9ybUludDogZnVuY3Rpb24obG93ZXJCb3VuZCwgdXBwZXJCb3VuZCkge1xyXG5cdFx0dmFyIG1heCA9IE1hdGgubWF4KGxvd2VyQm91bmQsIHVwcGVyQm91bmQpO1xyXG5cdFx0dmFyIG1pbiA9IE1hdGgubWluKGxvd2VyQm91bmQsIHVwcGVyQm91bmQpO1xyXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IodGhpcy5nZXRVbmlmb3JtKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7ZmxvYXR9IFttZWFuPTBdIE1lYW4gdmFsdWVcclxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbc3RkZGV2PTFdIFN0YW5kYXJkIGRldmlhdGlvbi4gfjk1JSBvZiB0aGUgYWJzb2x1dGUgdmFsdWVzIHdpbGwgYmUgbG93ZXIgdGhhbiAyKnN0ZGRldi5cclxuXHQgKiBAcmV0dXJucyB7ZmxvYXR9IEEgbm9ybWFsbHkgZGlzdHJpYnV0ZWQgcHNldWRvcmFuZG9tIHZhbHVlXHJcblx0ICovXHJcblx0Z2V0Tm9ybWFsOiBmdW5jdGlvbihtZWFuLCBzdGRkZXYpIHtcclxuXHRcdGRvIHtcclxuXHRcdFx0dmFyIHUgPSAyKnRoaXMuZ2V0VW5pZm9ybSgpLTE7XHJcblx0XHRcdHZhciB2ID0gMip0aGlzLmdldFVuaWZvcm0oKS0xO1xyXG5cdFx0XHR2YXIgciA9IHUqdSArIHYqdjtcclxuXHRcdH0gd2hpbGUgKHIgPiAxIHx8IHIgPT0gMCk7XHJcblxyXG5cdFx0dmFyIGdhdXNzID0gdSAqIE1hdGguc3FydCgtMipNYXRoLmxvZyhyKS9yKTtcclxuXHRcdHJldHVybiAobWVhbiB8fCAwKSArIGdhdXNzKihzdGRkZXYgfHwgMSk7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQHJldHVybnMge2ludH0gUHNldWRvcmFuZG9tIHZhbHVlIFsxLDEwMF0gaW5jbHVzaXZlLCB1bmlmb3JtbHkgZGlzdHJpYnV0ZWRcclxuXHQgKi9cclxuXHRnZXRQZXJjZW50YWdlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAxICsgTWF0aC5mbG9vcih0aGlzLmdldFVuaWZvcm0oKSoxMDApO1xyXG5cdH0sXHJcblx0XHJcblx0LyoqXHJcblx0ICogQHBhcmFtIHtvYmplY3R9IGRhdGEga2V5PXdoYXRldmVyLCB2YWx1ZT13ZWlnaHQgKHJlbGF0aXZlIHByb2JhYmlsaXR5KVxyXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IHdoYXRldmVyXHJcblx0ICovXHJcblx0Z2V0V2VpZ2h0ZWRWYWx1ZTogZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0dmFyIHRvdGFsID0gMDtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaWQgaW4gZGF0YSkge1xyXG5cdFx0XHR0b3RhbCArPSBkYXRhW2lkXTtcclxuXHRcdH1cclxuXHRcdHZhciByYW5kb20gPSB0aGlzLmdldFVuaWZvcm0oKSp0b3RhbDtcclxuXHRcdFxyXG5cdFx0dmFyIHBhcnQgPSAwO1xyXG5cdFx0Zm9yICh2YXIgaWQgaW4gZGF0YSkge1xyXG5cdFx0XHRwYXJ0ICs9IGRhdGFbaWRdO1xyXG5cdFx0XHRpZiAocmFuZG9tIDwgcGFydCkgeyByZXR1cm4gaWQ7IH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBJZiBieSBzb21lIGZsb2F0aW5nLXBvaW50IGFubm95YW5jZSB3ZSBoYXZlXHJcblx0XHQvLyByYW5kb20gPj0gdG90YWwsIGp1c3QgcmV0dXJuIHRoZSBsYXN0IGlkLlxyXG5cdFx0cmV0dXJuIGlkO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEdldCBSTkcgc3RhdGUuIFVzZWZ1bCBmb3Igc3RvcmluZyB0aGUgc3RhdGUgYW5kIHJlLXNldHRpbmcgaXQgdmlhIHNldFN0YXRlLlxyXG5cdCAqIEByZXR1cm5zIHs/fSBJbnRlcm5hbCBzdGF0ZVxyXG5cdCAqL1xyXG5cdGdldFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBbdGhpcy5fczAsIHRoaXMuX3MxLCB0aGlzLl9zMiwgdGhpcy5fY107XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogU2V0IGEgcHJldmlvdXNseSByZXRyaWV2ZWQgc3RhdGUuXHJcblx0ICogQHBhcmFtIHs/fSBzdGF0ZVxyXG5cdCAqL1xyXG5cdHNldFN0YXRlOiBmdW5jdGlvbihzdGF0ZSkge1xyXG5cdFx0dGhpcy5fczAgPSBzdGF0ZVswXTtcclxuXHRcdHRoaXMuX3MxID0gc3RhdGVbMV07XHJcblx0XHR0aGlzLl9zMiA9IHN0YXRlWzJdO1xyXG5cdFx0dGhpcy5fYyAgPSBzdGF0ZVszXTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgYSBjbG9uZWQgUk5HXHJcblx0ICovXHJcblx0Y2xvbmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNsb25lID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcclxuXHRcdGNsb25lLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGUoKSk7XHJcblx0XHRyZXR1cm4gY2xvbmU7XHJcblx0fSxcclxuXHJcblx0X3MwOiAwLFxyXG5cdF9zMTogMCxcclxuXHRfczI6IDAsXHJcblx0X2M6IDAsXHJcblx0X2ZyYWM6IDIuMzI4MzA2NDM2NTM4Njk2M2UtMTAgLyogMl4tMzIgKi9cclxufTtcclxuXHJcblJPVC5STkcuc2V0U2VlZChEYXRlLm5vdygpKTtcclxuLyoqXHJcbiAqIEBjbGFzcyAoTWFya292IHByb2Nlc3MpLWJhc2VkIHN0cmluZyBnZW5lcmF0b3IuIFxyXG4gKiBDb3BpZWQgZnJvbSBhIDxhIGhyZWY9XCJodHRwOi8vd3d3LnJvZ3VlYmFzaW4ucm9ndWVsaWtlZGV2ZWxvcG1lbnQub3JnL2luZGV4LnBocD90aXRsZT1OYW1lc19mcm9tX2FfaGlnaF9vcmRlcl9NYXJrb3ZfUHJvY2Vzc19hbmRfYV9zaW1wbGlmaWVkX0thdHpfYmFjay1vZmZfc2NoZW1lXCI+Um9ndWVCYXNpbiBhcnRpY2xlPC9hPi4gXHJcbiAqIE9mZmVycyBjb25maWd1cmFibGUgb3JkZXIgYW5kIHByaW9yLlxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7Ym9vbH0gW29wdGlvbnMud29yZHM9ZmFsc2VdIFVzZSB3b3JkIG1vZGU/XHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5vcmRlcj0zXVxyXG4gKiBAcGFyYW0ge2Zsb2F0fSBbb3B0aW9ucy5wcmlvcj0wLjAwMV1cclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdHdvcmRzOiBmYWxzZSxcclxuXHRcdG9yZGVyOiAzLFxyXG5cdFx0cHJpb3I6IDAuMDAxXHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHJcblx0dGhpcy5fYm91bmRhcnkgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDApO1xyXG5cdHRoaXMuX3N1ZmZpeCA9IHRoaXMuX2JvdW5kYXJ5O1xyXG5cdHRoaXMuX3ByZWZpeCA9IFtdO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX29wdGlvbnMub3JkZXI7aSsrKSB7IHRoaXMuX3ByZWZpeC5wdXNoKHRoaXMuX2JvdW5kYXJ5KTsgfVxyXG5cclxuXHR0aGlzLl9wcmlvclZhbHVlcyA9IHt9O1xyXG5cdHRoaXMuX3ByaW9yVmFsdWVzW3RoaXMuX2JvdW5kYXJ5XSA9IHRoaXMuX29wdGlvbnMucHJpb3I7XHJcblxyXG5cdHRoaXMuX2RhdGEgPSB7fTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgYWxsIGxlYXJuaW5nIGRhdGFcclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fZGF0YSA9IHt9O1xyXG5cdHRoaXMuX3ByaW9yVmFsdWVzID0ge307XHJcbn07XHJcblxyXG4vKipcclxuICogQHJldHVybnMge3N0cmluZ30gR2VuZXJhdGVkIHN0cmluZ1xyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgcmVzdWx0ID0gW3RoaXMuX3NhbXBsZSh0aGlzLl9wcmVmaXgpXTtcclxuXHR3aGlsZSAocmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV0gIT0gdGhpcy5fYm91bmRhcnkpIHtcclxuXHRcdHJlc3VsdC5wdXNoKHRoaXMuX3NhbXBsZShyZXN1bHQpKTtcclxuXHR9XHJcblx0cmV0dXJuIHRoaXMuX2pvaW4ocmVzdWx0LnNsaWNlKDAsIC0xKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogT2JzZXJ2ZSAobGVhcm4pIGEgc3RyaW5nIGZyb20gYSB0cmFpbmluZyBzZXRcclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbihzdHJpbmcpIHtcclxuXHR2YXIgdG9rZW5zID0gdGhpcy5fc3BsaXQoc3RyaW5nKTtcclxuXHJcblx0Zm9yICh2YXIgaT0wOyBpPHRva2Vucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dGhpcy5fcHJpb3JWYWx1ZXNbdG9rZW5zW2ldXSA9IHRoaXMuX29wdGlvbnMucHJpb3I7XHJcblx0fVxyXG5cclxuXHR0b2tlbnMgPSB0aGlzLl9wcmVmaXguY29uY2F0KHRva2VucykuY29uY2F0KHRoaXMuX3N1ZmZpeCk7IC8qIGFkZCBib3VuZGFyeSBzeW1ib2xzICovXHJcblxyXG5cdGZvciAodmFyIGk9dGhpcy5fb3B0aW9ucy5vcmRlcjsgaTx0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBjb250ZXh0ID0gdG9rZW5zLnNsaWNlKGktdGhpcy5fb3B0aW9ucy5vcmRlciwgaSk7XHJcblx0XHR2YXIgZXZlbnQgPSB0b2tlbnNbaV07XHJcblx0XHRmb3IgKHZhciBqPTA7IGo8Y29udGV4dC5sZW5ndGg7IGorKykge1xyXG5cdFx0XHR2YXIgc3ViY29udGV4dCA9IGNvbnRleHQuc2xpY2Uoaik7XHJcblx0XHRcdHRoaXMuX29ic2VydmVFdmVudChzdWJjb250ZXh0LCBldmVudCk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuZ2V0U3RhdHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgcGFydHMgPSBbXTtcclxuXHJcblx0dmFyIHByaW9yQ291bnQgPSAwO1xyXG5cdGZvciAodmFyIHAgaW4gdGhpcy5fcHJpb3JWYWx1ZXMpIHsgcHJpb3JDb3VudCsrOyB9XHJcblx0cHJpb3JDb3VudC0tOyAvKiBib3VuZGFyeSAqL1xyXG5cdHBhcnRzLnB1c2goXCJkaXN0aW5jdCBzYW1wbGVzOiBcIiArIHByaW9yQ291bnQpO1xyXG5cclxuXHR2YXIgZGF0YUNvdW50ID0gMDtcclxuXHR2YXIgZXZlbnRDb3VudCA9IDA7XHJcblx0Zm9yICh2YXIgcCBpbiB0aGlzLl9kYXRhKSB7IFxyXG5cdFx0ZGF0YUNvdW50Kys7IFxyXG5cdFx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2RhdGFbcF0pIHtcclxuXHRcdFx0ZXZlbnRDb3VudCsrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRwYXJ0cy5wdXNoKFwiZGljdGlvbmFyeSBzaXplIChjb250ZXh0cyk6IFwiICsgZGF0YUNvdW50KTtcclxuXHRwYXJ0cy5wdXNoKFwiZGljdGlvbmFyeSBzaXplIChldmVudHMpOiBcIiArIGV2ZW50Q291bnQpO1xyXG5cclxuXHRyZXR1cm4gcGFydHMuam9pbihcIiwgXCIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nW119XHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fc3BsaXQgPSBmdW5jdGlvbihzdHIpIHtcclxuXHRyZXR1cm4gc3RyLnNwbGl0KHRoaXMuX29wdGlvbnMud29yZHMgPyAvXFxzKy8gOiBcIlwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBcclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9qb2luID0gZnVuY3Rpb24oYXJyKSB7XHJcblx0cmV0dXJuIGFyci5qb2luKHRoaXMuX29wdGlvbnMud29yZHMgPyBcIiBcIiA6IFwiXCIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119IGNvbnRleHRcclxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fb2JzZXJ2ZUV2ZW50ID0gZnVuY3Rpb24oY29udGV4dCwgZXZlbnQpIHtcclxuXHR2YXIga2V5ID0gdGhpcy5fam9pbihjb250ZXh0KTtcclxuXHRpZiAoIShrZXkgaW4gdGhpcy5fZGF0YSkpIHsgdGhpcy5fZGF0YVtrZXldID0ge307IH1cclxuXHR2YXIgZGF0YSA9IHRoaXMuX2RhdGFba2V5XTtcclxuXHJcblx0aWYgKCEoZXZlbnQgaW4gZGF0YSkpIHsgZGF0YVtldmVudF0gPSAwOyB9XHJcblx0ZGF0YVtldmVudF0rKztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuX3NhbXBsZSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRjb250ZXh0ID0gdGhpcy5fYmFja29mZihjb250ZXh0KTtcclxuXHR2YXIga2V5ID0gdGhpcy5fam9pbihjb250ZXh0KTtcclxuXHR2YXIgZGF0YSA9IHRoaXMuX2RhdGFba2V5XTtcclxuXHJcblx0dmFyIGF2YWlsYWJsZSA9IHt9O1xyXG5cclxuXHRpZiAodGhpcy5fb3B0aW9ucy5wcmlvcikge1xyXG5cdFx0Zm9yICh2YXIgZXZlbnQgaW4gdGhpcy5fcHJpb3JWYWx1ZXMpIHsgYXZhaWxhYmxlW2V2ZW50XSA9IHRoaXMuX3ByaW9yVmFsdWVzW2V2ZW50XTsgfVxyXG5cdFx0Zm9yICh2YXIgZXZlbnQgaW4gZGF0YSkgeyBhdmFpbGFibGVbZXZlbnRdICs9IGRhdGFbZXZlbnRdOyB9XHJcblx0fSBlbHNlIHsgXHJcblx0XHRhdmFpbGFibGUgPSBkYXRhO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIFJPVC5STkcuZ2V0V2VpZ2h0ZWRWYWx1ZShhdmFpbGFibGUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119XHJcbiAqIEByZXR1cm5zIHtzdHJpbmdbXX1cclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9iYWNrb2ZmID0gZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdGlmIChjb250ZXh0Lmxlbmd0aCA+IHRoaXMuX29wdGlvbnMub3JkZXIpIHtcclxuXHRcdGNvbnRleHQgPSBjb250ZXh0LnNsaWNlKC10aGlzLl9vcHRpb25zLm9yZGVyKTtcclxuXHR9IGVsc2UgaWYgKGNvbnRleHQubGVuZ3RoIDwgdGhpcy5fb3B0aW9ucy5vcmRlcikge1xyXG5cdFx0Y29udGV4dCA9IHRoaXMuX3ByZWZpeC5zbGljZSgwLCB0aGlzLl9vcHRpb25zLm9yZGVyIC0gY29udGV4dC5sZW5ndGgpLmNvbmNhdChjb250ZXh0KTtcclxuXHR9XHJcblxyXG5cdHdoaWxlICghKHRoaXMuX2pvaW4oY29udGV4dCkgaW4gdGhpcy5fZGF0YSkgJiYgY29udGV4dC5sZW5ndGggPiAwKSB7IGNvbnRleHQgPSBjb250ZXh0LnNsaWNlKDEpOyB9XHJcblxyXG5cdHJldHVybiBjb250ZXh0O1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEdlbmVyaWMgZXZlbnQgcXVldWU6IHN0b3JlcyBldmVudHMgYW5kIHJldHJpZXZlcyB0aGVtIGJhc2VkIG9uIHRoZWlyIHRpbWVcclxuICovXHJcblJPVC5FdmVudFF1ZXVlID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fdGltZSA9IDA7XHJcblx0dGhpcy5fZXZlbnRzID0gW107XHJcblx0dGhpcy5fZXZlbnRUaW1lcyA9IFtdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IEVsYXBzZWQgdGltZVxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fdGltZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbGVhciBhbGwgc2NoZWR1bGVkIGV2ZW50c1xyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fZXZlbnRzID0gW107XHJcblx0dGhpcy5fZXZlbnRUaW1lcyA9IFtdO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7P30gZXZlbnRcclxuICogQHBhcmFtIHtudW1iZXJ9IHRpbWVcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihldmVudCwgdGltZSkge1xyXG5cdHZhciBpbmRleCA9IHRoaXMuX2V2ZW50cy5sZW5ndGg7XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fZXZlbnRUaW1lcy5sZW5ndGg7aSsrKSB7XHJcblx0XHRpZiAodGhpcy5fZXZlbnRUaW1lc1tpXSA+IHRpbWUpIHtcclxuXHRcdFx0aW5kZXggPSBpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuX2V2ZW50cy5zcGxpY2UoaW5kZXgsIDAsIGV2ZW50KTtcclxuXHR0aGlzLl9ldmVudFRpbWVzLnNwbGljZShpbmRleCwgMCwgdGltZSk7XHJcbn07XHJcblxyXG4vKipcclxuICogTG9jYXRlcyB0aGUgbmVhcmVzdCBldmVudCwgYWR2YW5jZXMgdGltZSBpZiBuZWNlc3NhcnkuIFJldHVybnMgdGhhdCBldmVudCBhbmQgcmVtb3ZlcyBpdCBmcm9tIHRoZSBxdWV1ZS5cclxuICogQHJldHVybnMgez8gfHwgbnVsbH0gVGhlIGV2ZW50IHByZXZpb3VzbHkgYWRkZWQgYnkgYWRkRXZlbnQsIG51bGwgaWYgbm8gZXZlbnQgYXZhaWxhYmxlXHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKCF0aGlzLl9ldmVudHMubGVuZ3RoKSB7IHJldHVybiBudWxsOyB9XHJcblxyXG5cdHZhciB0aW1lID0gdGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoMCwgMSlbMF07XHJcblx0aWYgKHRpbWUgPiAwKSB7IC8qIGFkdmFuY2UgKi9cclxuXHRcdHRoaXMuX3RpbWUgKz0gdGltZTtcclxuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuX2V2ZW50VGltZXMubGVuZ3RoO2krKykgeyB0aGlzLl9ldmVudFRpbWVzW2ldIC09IHRpbWU7IH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzLl9ldmVudHMuc3BsaWNlKDAsIDEpWzBdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgdGltZSBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIGV2ZW50XHJcbiAqIEBwYXJhbSB7P30gZXZlbnRcclxuICogQHJldHVybnMge251bWJlcn0gdGltZVxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmdldEV2ZW50VGltZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0dmFyIGluZGV4ID0gdGhpcy5fZXZlbnRzLmluZGV4T2YoZXZlbnQpO1xyXG5cdGlmIChpbmRleCA9PSAtMSkgeyByZXR1cm4gdW5kZWZpbmVkIH1cclxuXHRyZXR1cm4gdGhpcy5fZXZlbnRUaW1lc1tpbmRleF07XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGFuIGV2ZW50IGZyb20gdGhlIHF1ZXVlXHJcbiAqIEBwYXJhbSB7P30gZXZlbnRcclxuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3M/XHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHR2YXIgaW5kZXggPSB0aGlzLl9ldmVudHMuaW5kZXhPZihldmVudCk7XHJcblx0aWYgKGluZGV4ID09IC0xKSB7IHJldHVybiBmYWxzZSB9XHJcblx0dGhpcy5fcmVtb3ZlKGluZGV4KTtcclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgYW4gZXZlbnQgZnJvbSB0aGUgcXVldWVcclxuICogQHBhcmFtIHtpbnR9IGluZGV4XHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuX3JlbW92ZSA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0dGhpcy5fZXZlbnRzLnNwbGljZShpbmRleCwgMSk7XHJcblx0dGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEFic3RyYWN0IHNjaGVkdWxlclxyXG4gKi9cclxuUk9ULlNjaGVkdWxlciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX3F1ZXVlID0gbmV3IFJPVC5FdmVudFF1ZXVlKCk7XHJcblx0dGhpcy5fcmVwZWF0ID0gW107XHJcblx0dGhpcy5fY3VycmVudCA9IG51bGw7XHJcbn07XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuRXZlbnRRdWV1ZSNnZXRUaW1lXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5nZXRUaW1lID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3F1ZXVlLmdldFRpbWUoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gez99IGl0ZW1cclxuICogQHBhcmFtIHtib29sfSByZXBlYXRcclxuICovXHJcblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCkge1xyXG5cdGlmIChyZXBlYXQpIHsgdGhpcy5fcmVwZWF0LnB1c2goaXRlbSk7IH1cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHRpbWUgdGhlIGdpdmVuIGl0ZW0gaXMgc2NoZWR1bGVkIGZvclxyXG4gKiBAcGFyYW0gez99IGl0ZW1cclxuICogQHJldHVybnMge251bWJlcn0gdGltZVxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuZ2V0VGltZU9mID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdHJldHVybiB0aGlzLl9xdWV1ZS5nZXRFdmVudFRpbWUoaXRlbSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xlYXIgYWxsIGl0ZW1zXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX3F1ZXVlLmNsZWFyKCk7XHJcblx0dGhpcy5fcmVwZWF0ID0gW107XHJcblx0dGhpcy5fY3VycmVudCA9IG51bGw7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGEgcHJldmlvdXNseSBhZGRlZCBpdGVtXHJcbiAqIEBwYXJhbSB7P30gaXRlbVxyXG4gKiBAcmV0dXJucyB7Ym9vbH0gc3VjY2Vzc2Z1bD9cclxuICovXHJcblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHR2YXIgcmVzdWx0ID0gdGhpcy5fcXVldWUucmVtb3ZlKGl0ZW0pO1xyXG5cclxuXHR2YXIgaW5kZXggPSB0aGlzLl9yZXBlYXQuaW5kZXhPZihpdGVtKTtcclxuXHRpZiAoaW5kZXggIT0gLTEpIHsgdGhpcy5fcmVwZWF0LnNwbGljZShpbmRleCwgMSk7IH1cclxuXHJcblx0aWYgKHRoaXMuX2N1cnJlbnQgPT0gaXRlbSkgeyB0aGlzLl9jdXJyZW50ID0gbnVsbDsgfVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNjaGVkdWxlIG5leHQgaXRlbVxyXG4gKiBAcmV0dXJucyB7P31cclxuICovXHJcblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9jdXJyZW50ID0gdGhpcy5fcXVldWUuZ2V0KCk7XHJcblx0cmV0dXJuIHRoaXMuX2N1cnJlbnQ7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgU2ltcGxlIGZhaXIgc2NoZWR1bGVyIChyb3VuZC1yb2JpbiBzdHlsZSlcclxuICogQGF1Z21lbnRzIFJPVC5TY2hlZHVsZXJcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU2ltcGxlID0gZnVuY3Rpb24oKSB7XHJcblx0Uk9ULlNjaGVkdWxlci5jYWxsKHRoaXMpO1xyXG59O1xyXG5ST1QuU2NoZWR1bGVyLlNpbXBsZS5leHRlbmQoUk9ULlNjaGVkdWxlcik7XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuU2NoZWR1bGVyI2FkZFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5TaW1wbGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCkge1xyXG5cdHRoaXMuX3F1ZXVlLmFkZChpdGVtLCAwKTtcclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuYWRkLmNhbGwodGhpcywgaXRlbSwgcmVwZWF0KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjbmV4dFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5TaW1wbGUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcclxuXHRpZiAodGhpcy5fY3VycmVudCAmJiB0aGlzLl9yZXBlYXQuaW5kZXhPZih0aGlzLl9jdXJyZW50KSAhPSAtMSkge1xyXG5cdFx0dGhpcy5fcXVldWUuYWRkKHRoaXMuX2N1cnJlbnQsIDApO1xyXG5cdH1cclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFNwZWVkLWJhc2VkIHNjaGVkdWxlclxyXG4gKiBAYXVnbWVudHMgUk9ULlNjaGVkdWxlclxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5TcGVlZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFJPVC5TY2hlZHVsZXIuY2FsbCh0aGlzKTtcclxufTtcclxuUk9ULlNjaGVkdWxlci5TcGVlZC5leHRlbmQoUk9ULlNjaGVkdWxlcik7XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW0gYW55dGhpbmcgd2l0aCBcImdldFNwZWVkXCIgbWV0aG9kXHJcbiAqIEBwYXJhbSB7Ym9vbH0gcmVwZWF0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZT0xL2l0ZW0uZ2V0U3BlZWQoKV1cclxuICogQHNlZSBST1QuU2NoZWR1bGVyI2FkZFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5TcGVlZC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oaXRlbSwgcmVwZWF0LCB0aW1lKSB7XHJcblx0dGhpcy5fcXVldWUuYWRkKGl0ZW0sIHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiAxL2l0ZW0uZ2V0U3BlZWQoKSk7XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGl0ZW0sIHJlcGVhdCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuU2NoZWR1bGVyI25leHRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU3BlZWQucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcclxuXHRpZiAodGhpcy5fY3VycmVudCAmJiB0aGlzLl9yZXBlYXQuaW5kZXhPZih0aGlzLl9jdXJyZW50KSAhPSAtMSkge1xyXG5cdFx0dGhpcy5fcXVldWUuYWRkKHRoaXMuX2N1cnJlbnQsIDEvdGhpcy5fY3VycmVudC5nZXRTcGVlZCgpKTtcclxuXHR9XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBBY3Rpb24tYmFzZWQgc2NoZWR1bGVyXHJcbiAqIEBhdWdtZW50cyBST1QuU2NoZWR1bGVyXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFJPVC5TY2hlZHVsZXIuY2FsbCh0aGlzKTtcclxuXHR0aGlzLl9kZWZhdWx0RHVyYXRpb24gPSAxOyAvKiBmb3IgbmV3bHkgYWRkZWQgKi9cclxuXHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjsgLyogZm9yIHRoaXMuX2N1cnJlbnQgKi9cclxufTtcclxuUk9ULlNjaGVkdWxlci5BY3Rpb24uZXh0ZW5kKFJPVC5TY2hlZHVsZXIpO1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtXHJcbiAqIEBwYXJhbSB7Ym9vbH0gcmVwZWF0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZT0xXVxyXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjYWRkXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oaXRlbSwgcmVwZWF0LCB0aW1lKSB7XHJcblx0dGhpcy5fcXVldWUuYWRkKGl0ZW0sIHRpbWUgfHwgdGhpcy5fZGVmYXVsdER1cmF0aW9uKTtcclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuYWRkLmNhbGwodGhpcywgaXRlbSwgcmVwZWF0KTtcclxufTtcclxuXHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uO1xyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5jbGVhci5jYWxsKHRoaXMpO1xyXG59O1xyXG5cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRpZiAoaXRlbSA9PSB0aGlzLl9jdXJyZW50KSB7IHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uOyB9XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLnJlbW92ZS5jYWxsKHRoaXMsIGl0ZW0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNuZXh0XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xyXG5cdGlmICh0aGlzLl9jdXJyZW50ICYmIHRoaXMuX3JlcGVhdC5pbmRleE9mKHRoaXMuX2N1cnJlbnQpICE9IC0xKSB7XHJcblx0XHR0aGlzLl9xdWV1ZS5hZGQodGhpcy5fY3VycmVudCwgdGhpcy5fZHVyYXRpb24gfHwgdGhpcy5fZGVmYXVsdER1cmF0aW9uKTtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uO1xyXG5cdH1cclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkdXJhdGlvbiBmb3IgdGhlIGFjdGl2ZSBpdGVtXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUuc2V0RHVyYXRpb24gPSBmdW5jdGlvbih0aW1lKSB7XHJcblx0aWYgKHRoaXMuX2N1cnJlbnQpIHsgdGhpcy5fZHVyYXRpb24gPSB0aW1lOyB9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQXN5bmNocm9ub3VzIG1haW4gbG9vcFxyXG4gKiBAcGFyYW0ge1JPVC5TY2hlZHVsZXJ9IHNjaGVkdWxlclxyXG4gKi9cclxuUk9ULkVuZ2luZSA9IGZ1bmN0aW9uKHNjaGVkdWxlcikge1xyXG5cdHRoaXMuX3NjaGVkdWxlciA9IHNjaGVkdWxlcjtcclxuXHR0aGlzLl9sb2NrID0gMTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTdGFydCB0aGUgbWFpbiBsb29wLiBXaGVuIHRoaXMgY2FsbCByZXR1cm5zLCB0aGUgbG9vcCBpcyBsb2NrZWQuXHJcbiAqL1xyXG5ST1QuRW5naW5lLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLnVubG9jaygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEludGVycnVwdCB0aGUgZW5naW5lIGJ5IGFuIGFzeW5jaHJvbm91cyBhY3Rpb25cclxuICovXHJcblJPVC5FbmdpbmUucHJvdG90eXBlLmxvY2sgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9sb2NrKys7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVzdW1lIGV4ZWN1dGlvbiAocGF1c2VkIGJ5IGEgcHJldmlvdXMgbG9jaylcclxuICovXHJcblJPVC5FbmdpbmUucHJvdG90eXBlLnVubG9jayA9IGZ1bmN0aW9uKCkge1xyXG5cdGlmICghdGhpcy5fbG9jaykgeyB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgdW5sb2NrIHVubG9ja2VkIGVuZ2luZVwiKTsgfVxyXG5cdHRoaXMuX2xvY2stLTtcclxuXHJcblx0d2hpbGUgKCF0aGlzLl9sb2NrKSB7XHJcblx0XHR2YXIgYWN0b3IgPSB0aGlzLl9zY2hlZHVsZXIubmV4dCgpO1xyXG5cdFx0aWYgKCFhY3RvcikgeyByZXR1cm4gdGhpcy5sb2NrKCk7IH0gLyogbm8gYWN0b3JzICovXHJcblx0XHR2YXIgcmVzdWx0ID0gYWN0b3IuYWN0KCk7XHJcblx0XHRpZiAocmVzdWx0ICYmIHJlc3VsdC50aGVuKSB7IC8qIGFjdG9yIHJldHVybmVkIGEgXCJ0aGVuYWJsZVwiLCBsb29rcyBsaWtlIGEgUHJvbWlzZSAqL1xyXG5cdFx0XHR0aGlzLmxvY2soKTtcclxuXHRcdFx0cmVzdWx0LnRoZW4odGhpcy51bmxvY2suYmluZCh0aGlzKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBCYXNlIG1hcCBnZW5lcmF0b3JcclxuICogQHBhcmFtIHtpbnR9IFt3aWR0aD1ST1QuREVGQVVMVF9XSURUSF1cclxuICogQHBhcmFtIHtpbnR9IFtoZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxyXG4gKi9cclxuUk9ULk1hcCA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuXHR0aGlzLl93aWR0aCA9IHdpZHRoIHx8IFJPVC5ERUZBVUxUX1dJRFRIO1xyXG5cdHRoaXMuX2hlaWdodCA9IGhlaWdodCB8fCBST1QuREVGQVVMVF9IRUlHSFQ7XHJcbn07XHJcblxyXG5ST1QuTWFwLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge307XHJcblxyXG5ST1QuTWFwLnByb3RvdHlwZS5fZmlsbE1hcCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0dmFyIG1hcCA9IFtdO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xyXG5cdFx0bWFwLnB1c2goW10pO1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykgeyBtYXBbaV0ucHVzaCh2YWx1ZSk7IH1cclxuXHR9XHJcblx0cmV0dXJuIG1hcDtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBTaW1wbGUgZW1wdHkgcmVjdGFuZ3VsYXIgcm9vbVxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKi9cclxuUk9ULk1hcC5BcmVuYSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcbn07XHJcblJPVC5NYXAuQXJlbmEuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuUk9ULk1hcC5BcmVuYS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR2YXIgdyA9IHRoaXMuX3dpZHRoLTE7XHJcblx0dmFyIGggPSB0aGlzLl9oZWlnaHQtMTtcclxuXHRmb3IgKHZhciBpPTA7aTw9dztpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPD1oO2orKykge1xyXG5cdFx0XHR2YXIgZW1wdHkgPSAoaSAmJiBqICYmIGk8dyAmJiBqPGgpO1xyXG5cdFx0XHRjYWxsYmFjayhpLCBqLCBlbXB0eSA/IDAgOiAxKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUmVjdXJzaXZlbHkgZGl2aWRlZCBtYXplLCBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01hemVfZ2VuZXJhdGlvbl9hbGdvcml0aG0jUmVjdXJzaXZlX2RpdmlzaW9uX21ldGhvZFxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKi9cclxuUk9ULk1hcC5EaXZpZGVkTWF6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblx0dGhpcy5fc3RhY2sgPSBbXTtcclxufTtcclxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG5ST1QuTWFwLkRpdmlkZWRNYXplLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciB3ID0gdGhpcy5fd2lkdGg7XHJcblx0dmFyIGggPSB0aGlzLl9oZWlnaHQ7XHJcblx0XHJcblx0dGhpcy5fbWFwID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcclxuXHRcdHRoaXMuX21hcC5wdXNoKFtdKTtcclxuXHRcdGZvciAodmFyIGo9MDtqPGg7aisrKSB7XHJcblx0XHRcdHZhciBib3JkZXIgPSAoaSA9PSAwIHx8IGogPT0gMCB8fCBpKzEgPT0gdyB8fCBqKzEgPT0gaCk7XHJcblx0XHRcdHRoaXMuX21hcFtpXS5wdXNoKGJvcmRlciA/IDEgOiAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGhpcy5fc3RhY2sgPSBbXHJcblx0XHRbMSwgMSwgdy0yLCBoLTJdXHJcblx0XTtcclxuXHR0aGlzLl9wcm9jZXNzKCk7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPGg7aisrKSB7XHJcblx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHRoaXMuX21hcCA9IG51bGw7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpdmlkZWRNYXplLnByb3RvdHlwZS5fcHJvY2VzcyA9IGZ1bmN0aW9uKCkge1xyXG5cdHdoaWxlICh0aGlzLl9zdGFjay5sZW5ndGgpIHtcclxuXHRcdHZhciByb29tID0gdGhpcy5fc3RhY2suc2hpZnQoKTsgLyogW2xlZnQsIHRvcCwgcmlnaHQsIGJvdHRvbV0gKi9cclxuXHRcdHRoaXMuX3BhcnRpdGlvblJvb20ocm9vbSk7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5wcm90b3R5cGUuX3BhcnRpdGlvblJvb20gPSBmdW5jdGlvbihyb29tKSB7XHJcblx0dmFyIGF2YWlsWCA9IFtdO1xyXG5cdHZhciBhdmFpbFkgPSBbXTtcclxuXHRcclxuXHRmb3IgKHZhciBpPXJvb21bMF0rMTtpPHJvb21bMl07aSsrKSB7XHJcblx0XHR2YXIgdG9wID0gdGhpcy5fbWFwW2ldW3Jvb21bMV0tMV07XHJcblx0XHR2YXIgYm90dG9tID0gdGhpcy5fbWFwW2ldW3Jvb21bM10rMV07XHJcblx0XHRpZiAodG9wICYmIGJvdHRvbSAmJiAhKGkgJSAyKSkgeyBhdmFpbFgucHVzaChpKTsgfVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBqPXJvb21bMV0rMTtqPHJvb21bM107aisrKSB7XHJcblx0XHR2YXIgbGVmdCA9IHRoaXMuX21hcFtyb29tWzBdLTFdW2pdO1xyXG5cdFx0dmFyIHJpZ2h0ID0gdGhpcy5fbWFwW3Jvb21bMl0rMV1bal07XHJcblx0XHRpZiAobGVmdCAmJiByaWdodCAmJiAhKGogJSAyKSkgeyBhdmFpbFkucHVzaChqKTsgfVxyXG5cdH1cclxuXHJcblx0aWYgKCFhdmFpbFgubGVuZ3RoIHx8ICFhdmFpbFkubGVuZ3RoKSB7IHJldHVybjsgfVxyXG5cclxuXHR2YXIgeCA9IGF2YWlsWC5yYW5kb20oKTtcclxuXHR2YXIgeSA9IGF2YWlsWS5yYW5kb20oKTtcclxuXHRcclxuXHR0aGlzLl9tYXBbeF1beV0gPSAxO1xyXG5cdFxyXG5cdHZhciB3YWxscyA9IFtdO1xyXG5cdFxyXG5cdHZhciB3ID0gW107IHdhbGxzLnB1c2godyk7IC8qIGxlZnQgcGFydCAqL1xyXG5cdGZvciAodmFyIGk9cm9vbVswXTsgaTx4OyBpKyspIHsgXHJcblx0XHR0aGlzLl9tYXBbaV1beV0gPSAxO1xyXG5cdFx0dy5wdXNoKFtpLCB5XSk7IFxyXG5cdH1cclxuXHRcclxuXHR2YXIgdyA9IFtdOyB3YWxscy5wdXNoKHcpOyAvKiByaWdodCBwYXJ0ICovXHJcblx0Zm9yICh2YXIgaT14KzE7IGk8PXJvb21bMl07IGkrKykgeyBcclxuXHRcdHRoaXMuX21hcFtpXVt5XSA9IDE7XHJcblx0XHR3LnB1c2goW2ksIHldKTsgXHJcblx0fVxyXG5cclxuXHR2YXIgdyA9IFtdOyB3YWxscy5wdXNoKHcpOyAvKiB0b3AgcGFydCAqL1xyXG5cdGZvciAodmFyIGo9cm9vbVsxXTsgajx5OyBqKyspIHsgXHJcblx0XHR0aGlzLl9tYXBbeF1bal0gPSAxO1xyXG5cdFx0dy5wdXNoKFt4LCBqXSk7IFxyXG5cdH1cclxuXHRcclxuXHR2YXIgdyA9IFtdOyB3YWxscy5wdXNoKHcpOyAvKiBib3R0b20gcGFydCAqL1xyXG5cdGZvciAodmFyIGo9eSsxOyBqPD1yb29tWzNdOyBqKyspIHsgXHJcblx0XHR0aGlzLl9tYXBbeF1bal0gPSAxO1xyXG5cdFx0dy5wdXNoKFt4LCBqXSk7IFxyXG5cdH1cclxuXHRcdFxyXG5cdHZhciBzb2xpZCA9IHdhbGxzLnJhbmRvbSgpO1xyXG5cdGZvciAodmFyIGk9MDtpPHdhbGxzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciB3ID0gd2FsbHNbaV07XHJcblx0XHRpZiAodyA9PSBzb2xpZCkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHJcblx0XHR2YXIgaG9sZSA9IHcucmFuZG9tKCk7XHJcblx0XHR0aGlzLl9tYXBbaG9sZVswXV1baG9sZVsxXV0gPSAwO1xyXG5cdH1cclxuXHJcblx0dGhpcy5fc3RhY2sucHVzaChbcm9vbVswXSwgcm9vbVsxXSwgeC0xLCB5LTFdKTsgLyogbGVmdCB0b3AgKi9cclxuXHR0aGlzLl9zdGFjay5wdXNoKFt4KzEsIHJvb21bMV0sIHJvb21bMl0sIHktMV0pOyAvKiByaWdodCB0b3AgKi9cclxuXHR0aGlzLl9zdGFjay5wdXNoKFtyb29tWzBdLCB5KzEsIHgtMSwgcm9vbVszXV0pOyAvKiBsZWZ0IGJvdHRvbSAqL1xyXG5cdHRoaXMuX3N0YWNrLnB1c2goW3grMSwgeSsxLCByb29tWzJdLCByb29tWzNdXSk7IC8qIHJpZ2h0IGJvdHRvbSAqL1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEljZXkncyBNYXplIGdlbmVyYXRvclxyXG4gKiBTZWUgaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9U2ltcGxlX21hemUgZm9yIGV4cGxhbmF0aW9uXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwXHJcbiAqL1xyXG5ST1QuTWFwLkljZXlNYXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgcmVndWxhcml0eSkge1xyXG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHR0aGlzLl9yZWd1bGFyaXR5ID0gcmVndWxhcml0eSB8fCAwO1xyXG59O1xyXG5ST1QuTWFwLkljZXlNYXplLmV4dGVuZChST1QuTWFwKTtcclxuXHJcblJPVC5NYXAuSWNleU1hemUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIHdpZHRoID0gdGhpcy5fd2lkdGg7XHJcblx0dmFyIGhlaWdodCA9IHRoaXMuX2hlaWdodDtcclxuXHRcclxuXHR2YXIgbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcclxuXHRcclxuXHR3aWR0aCAtPSAod2lkdGggJSAyID8gMSA6IDIpO1xyXG5cdGhlaWdodCAtPSAoaGVpZ2h0ICUgMiA/IDEgOiAyKTtcclxuXHJcblx0dmFyIGN4ID0gMDtcclxuXHR2YXIgY3kgPSAwO1xyXG5cdHZhciBueCA9IDA7XHJcblx0dmFyIG55ID0gMDtcclxuXHJcblx0dmFyIGRvbmUgPSAwO1xyXG5cdHZhciBibG9ja2VkID0gZmFsc2U7XHJcblx0dmFyIGRpcnMgPSBbXHJcblx0XHRbMCwgMF0sXHJcblx0XHRbMCwgMF0sXHJcblx0XHRbMCwgMF0sXHJcblx0XHRbMCwgMF1cclxuXHRdO1xyXG5cdGRvIHtcclxuXHRcdGN4ID0gMSArIDIqTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSood2lkdGgtMSkgLyAyKTtcclxuXHRcdGN5ID0gMSArIDIqTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSooaGVpZ2h0LTEpIC8gMik7XHJcblxyXG5cdFx0aWYgKCFkb25lKSB7IG1hcFtjeF1bY3ldID0gMDsgfVxyXG5cdFx0XHJcblx0XHRpZiAoIW1hcFtjeF1bY3ldKSB7XHJcblx0XHRcdHRoaXMuX3JhbmRvbWl6ZShkaXJzKTtcclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdGlmIChNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKih0aGlzLl9yZWd1bGFyaXR5KzEpKSA9PSAwKSB7IHRoaXMuX3JhbmRvbWl6ZShkaXJzKTsgfVxyXG5cdFx0XHRcdGJsb2NrZWQgPSB0cnVlO1xyXG5cdFx0XHRcdGZvciAodmFyIGk9MDtpPDQ7aSsrKSB7XHJcblx0XHRcdFx0XHRueCA9IGN4ICsgZGlyc1tpXVswXSoyO1xyXG5cdFx0XHRcdFx0bnkgPSBjeSArIGRpcnNbaV1bMV0qMjtcclxuXHRcdFx0XHRcdGlmICh0aGlzLl9pc0ZyZWUobWFwLCBueCwgbnksIHdpZHRoLCBoZWlnaHQpKSB7XHJcblx0XHRcdFx0XHRcdG1hcFtueF1bbnldID0gMDtcclxuXHRcdFx0XHRcdFx0bWFwW2N4ICsgZGlyc1tpXVswXV1bY3kgKyBkaXJzW2ldWzFdXSA9IDA7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRjeCA9IG54O1xyXG5cdFx0XHRcdFx0XHRjeSA9IG55O1xyXG5cdFx0XHRcdFx0XHRibG9ja2VkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdGRvbmUrKztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IHdoaWxlICghYmxvY2tlZCk7XHJcblx0XHR9XHJcblx0fSB3aGlsZSAoZG9uZSsxIDwgd2lkdGgqaGVpZ2h0LzQpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0XHRjYWxsYmFjayhpLCBqLCBtYXBbaV1bal0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR0aGlzLl9tYXAgPSBudWxsO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5JY2V5TWF6ZS5wcm90b3R5cGUuX3JhbmRvbWl6ZSA9IGZ1bmN0aW9uKGRpcnMpIHtcclxuXHRmb3IgKHZhciBpPTA7aTw0O2krKykge1xyXG5cdFx0ZGlyc1tpXVswXSA9IDA7XHJcblx0XHRkaXJzW2ldWzFdID0gMDtcclxuXHR9XHJcblx0XHJcblx0c3dpdGNoIChNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKjQpKSB7XHJcblx0XHRjYXNlIDA6XHJcblx0XHRcdGRpcnNbMF1bMF0gPSAtMTsgZGlyc1sxXVswXSA9IDE7XHJcblx0XHRcdGRpcnNbMl1bMV0gPSAtMTsgZGlyc1szXVsxXSA9IDE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMTpcclxuXHRcdFx0ZGlyc1szXVswXSA9IC0xOyBkaXJzWzJdWzBdID0gMTtcclxuXHRcdFx0ZGlyc1sxXVsxXSA9IC0xOyBkaXJzWzBdWzFdID0gMTtcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAyOlxyXG5cdFx0XHRkaXJzWzJdWzBdID0gLTE7IGRpcnNbM11bMF0gPSAxO1xyXG5cdFx0XHRkaXJzWzBdWzFdID0gLTE7IGRpcnNbMV1bMV0gPSAxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDM6XHJcblx0XHRcdGRpcnNbMV1bMF0gPSAtMTsgZGlyc1swXVswXSA9IDE7XHJcblx0XHRcdGRpcnNbM11bMV0gPSAtMTsgZGlyc1syXVsxXSA9IDE7XHJcblx0XHRicmVhaztcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkljZXlNYXplLnByb3RvdHlwZS5faXNGcmVlID0gZnVuY3Rpb24obWFwLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcblx0aWYgKHggPCAxIHx8IHkgPCAxIHx8IHggPj0gd2lkdGggfHwgeSA+PSBoZWlnaHQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0cmV0dXJuIG1hcFt4XVt5XTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBNYXplIGdlbmVyYXRvciAtIEVsbGVyJ3MgYWxnb3JpdGhtXHJcbiAqIFNlZSBodHRwOi8vaG9tZXBhZ2VzLmN3aS5ubC9+dHJvbXAvbWF6ZS5odG1sIGZvciBleHBsYW5hdGlvblxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKi9cclxuUk9ULk1hcC5FbGxlck1hemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG59O1xyXG5ST1QuTWFwLkVsbGVyTWF6ZS5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG5ST1QuTWFwLkVsbGVyTWF6ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR2YXIgbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcclxuXHR2YXIgdyA9IE1hdGguY2VpbCgodGhpcy5fd2lkdGgtMikvMik7XHJcblx0XHJcblx0dmFyIHJhbmQgPSA5LzI0O1xyXG5cdFxyXG5cdHZhciBMID0gW107XHJcblx0dmFyIFIgPSBbXTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xyXG5cdFx0TC5wdXNoKGkpO1xyXG5cdFx0Ui5wdXNoKGkpO1xyXG5cdH1cclxuXHRMLnB1c2gody0xKTsgLyogZmFrZSBzdG9wLWJsb2NrIGF0IHRoZSByaWdodCBzaWRlICovXHJcblxyXG5cdGZvciAodmFyIGo9MTtqKzM8dGhpcy5faGVpZ2h0O2orPTIpIHtcclxuXHRcdC8qIG9uZSByb3cgKi9cclxuXHRcdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XHJcblx0XHRcdC8qIGNlbGwgY29vcmRzICh3aWxsIGJlIGFsd2F5cyBlbXB0eSkgKi9cclxuXHRcdFx0dmFyIHggPSAyKmkrMTtcclxuXHRcdFx0dmFyIHkgPSBqO1xyXG5cdFx0XHRtYXBbeF1beV0gPSAwO1xyXG5cdFx0XHRcclxuXHRcdFx0LyogcmlnaHQgY29ubmVjdGlvbiAqL1xyXG5cdFx0XHRpZiAoaSAhPSBMW2krMV0gJiYgUk9ULlJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSB7XHJcblx0XHRcdFx0dGhpcy5fYWRkVG9MaXN0KGksIEwsIFIpO1xyXG5cdFx0XHRcdG1hcFt4KzFdW3ldID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0LyogYm90dG9tIGNvbm5lY3Rpb24gKi9cclxuXHRcdFx0aWYgKGkgIT0gTFtpXSAmJiBST1QuUk5HLmdldFVuaWZvcm0oKSA+IHJhbmQpIHtcclxuXHRcdFx0XHQvKiByZW1vdmUgY29ubmVjdGlvbiAqL1xyXG5cdFx0XHRcdHRoaXMuX3JlbW92ZUZyb21MaXN0KGksIEwsIFIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8qIGNyZWF0ZSBjb25uZWN0aW9uICovXHJcblx0XHRcdFx0bWFwW3hdW3krMV0gPSAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKiBsYXN0IHJvdyAqL1xyXG5cdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XHJcblx0XHQvKiBjZWxsIGNvb3JkcyAod2lsbCBiZSBhbHdheXMgZW1wdHkpICovXHJcblx0XHR2YXIgeCA9IDIqaSsxO1xyXG5cdFx0dmFyIHkgPSBqO1xyXG5cdFx0bWFwW3hdW3ldID0gMDtcclxuXHRcdFxyXG5cdFx0LyogcmlnaHQgY29ubmVjdGlvbiAqL1xyXG5cdFx0aWYgKGkgIT0gTFtpKzFdICYmIChpID09IExbaV0gfHwgUk9ULlJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSkge1xyXG5cdFx0XHQvKiBkaWcgcmlnaHQgYWxzbyBpZiB0aGUgY2VsbCBpcyBzZXBhcmF0ZWQsIHNvIGl0IGdldHMgY29ubmVjdGVkIHRvIHRoZSByZXN0IG9mIG1hemUgKi9cclxuXHRcdFx0dGhpcy5fYWRkVG9MaXN0KGksIEwsIFIpO1xyXG5cdFx0XHRtYXBbeCsxXVt5XSA9IDA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuX3JlbW92ZUZyb21MaXN0KGksIEwsIFIpO1xyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdFx0Y2FsbGJhY2soaSwgaiwgbWFwW2ldW2pdKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIFwiaVwiIGZyb20gaXRzIGxpc3RcclxuICovXHJcblJPVC5NYXAuRWxsZXJNYXplLnByb3RvdHlwZS5fcmVtb3ZlRnJvbUxpc3QgPSBmdW5jdGlvbihpLCBMLCBSKSB7XHJcblx0UltMW2ldXSA9IFJbaV07XHJcblx0TFtSW2ldXSA9IExbaV07XHJcblx0UltpXSA9IGk7XHJcblx0TFtpXSA9IGk7XHJcbn07XHJcblxyXG4vKipcclxuICogSm9pbiBsaXN0cyB3aXRoIFwiaVwiIGFuZCBcImkrMVwiXHJcbiAqL1xyXG5ST1QuTWFwLkVsbGVyTWF6ZS5wcm90b3R5cGUuX2FkZFRvTGlzdCA9IGZ1bmN0aW9uKGksIEwsIFIpIHtcclxuXHRSW0xbaSsxXV0gPSBSW2ldO1xyXG5cdExbUltpXV0gPSBMW2krMV07XHJcblx0UltpXSA9IGkrMTtcclxuXHRMW2krMV0gPSBpO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIENlbGx1bGFyIGF1dG9tYXRvbiBtYXAgZ2VuZXJhdG9yXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwXHJcbiAqIEBwYXJhbSB7aW50fSBbd2lkdGg9Uk9ULkRFRkFVTFRfV0lEVEhdXHJcbiAqIEBwYXJhbSB7aW50fSBbaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBPcHRpb25zXHJcbiAqIEBwYXJhbSB7aW50W119IFtvcHRpb25zLmJvcm5dIExpc3Qgb2YgbmVpZ2hib3IgY291bnRzIGZvciBhIG5ldyBjZWxsIHRvIGJlIGJvcm4gaW4gZW1wdHkgc3BhY2VcclxuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuc3Vydml2ZV0gTGlzdCBvZiBuZWlnaGJvciBjb3VudHMgZm9yIGFuIGV4aXN0aW5nICBjZWxsIHRvIHN1cnZpdmVcclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5XSBUb3BvbG9neSA0IG9yIDYgb3IgOFxyXG4gKi9cclxuUk9ULk1hcC5DZWxsdWxhciA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdGJvcm46IFs1LCA2LCA3LCA4XSxcclxuXHRcdHN1cnZpdmU6IFs0LCA1LCA2LCA3LCA4XSxcclxuXHRcdHRvcG9sb2d5OiA4XHJcblx0fTtcclxuXHR0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG5cdHRoaXMuX2RpcnMgPSBST1QuRElSU1t0aGlzLl9vcHRpb25zLnRvcG9sb2d5XTtcclxuXHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDApO1xyXG59O1xyXG5ST1QuTWFwLkNlbGx1bGFyLmV4dGVuZChST1QuTWFwKTtcclxuXHJcbi8qKlxyXG4gKiBGaWxsIHRoZSBtYXAgd2l0aCByYW5kb20gdmFsdWVzXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IHByb2JhYmlsaXR5IFByb2JhYmlsaXR5IGZvciBhIGNlbGwgdG8gYmVjb21lIGFsaXZlOyAwID0gYWxsIGVtcHR5LCAxID0gYWxsIGZ1bGxcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLnJhbmRvbWl6ZSA9IGZ1bmN0aW9uKHByb2JhYmlsaXR5KSB7XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHRcdHRoaXMuX21hcFtpXVtqXSA9IChST1QuUk5HLmdldFVuaWZvcm0oKSA8IHByb2JhYmlsaXR5ID8gMSA6IDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGFuZ2Ugb3B0aW9ucy5cclxuICogQHNlZSBST1QuTWFwLkNlbGx1bGFyXHJcbiAqL1xyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgdmFsdWUpIHtcclxuXHR0aGlzLl9tYXBbeF1beV0gPSB2YWx1ZTtcclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIG5ld01hcCA9IHRoaXMuX2ZpbGxNYXAoMCk7XHJcblx0dmFyIGJvcm4gPSB0aGlzLl9vcHRpb25zLmJvcm47XHJcblx0dmFyIHN1cnZpdmUgPSB0aGlzLl9vcHRpb25zLnN1cnZpdmU7XHJcblxyXG5cclxuXHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHR2YXIgd2lkdGhTdGVwID0gMTtcclxuXHRcdHZhciB3aWR0aFN0YXJ0ID0gMDtcclxuXHRcdGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDYpIHtcclxuXHRcdFx0d2lkdGhTdGVwID0gMjtcclxuXHRcdFx0d2lkdGhTdGFydCA9IGolMjtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciBpPXdpZHRoU3RhcnQ7IGk8dGhpcy5fd2lkdGg7IGkrPXdpZHRoU3RlcCkge1xyXG5cclxuXHRcdFx0dmFyIGN1ciA9IHRoaXMuX21hcFtpXVtqXTtcclxuXHRcdFx0dmFyIG5jb3VudCA9IHRoaXMuX2dldE5laWdoYm9ycyhpLCBqKTtcclxuXHJcblx0XHRcdGlmIChjdXIgJiYgc3Vydml2ZS5pbmRleE9mKG5jb3VudCkgIT0gLTEpIHsgLyogc3Vydml2ZSAqL1xyXG5cdFx0XHRcdG5ld01hcFtpXVtqXSA9IDE7XHJcblx0XHRcdH0gZWxzZSBpZiAoIWN1ciAmJiBib3JuLmluZGV4T2YobmNvdW50KSAhPSAtMSkgeyAvKiBib3JuICovXHJcblx0XHRcdFx0bmV3TWFwW2ldW2pdID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGhpcy5fbWFwID0gbmV3TWFwO1xyXG5cclxuXHR0aGlzLnNlcnZpY2VDYWxsYmFjayhjYWxsYmFjayk7XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5zZXJ2aWNlQ2FsbGJhY2sgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdGlmICghY2FsbGJhY2spIHsgcmV0dXJuOyB9XHJcblxyXG5cdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdHZhciB3aWR0aFN0ZXAgPSAxO1xyXG5cdFx0dmFyIHdpZHRoU3RhcnQgPSAwO1xyXG5cdFx0aWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gNikge1xyXG5cdFx0XHR3aWR0aFN0ZXAgPSAyO1xyXG5cdFx0XHR3aWR0aFN0YXJ0ID0gaiUyO1xyXG5cdFx0fVxyXG5cdFx0Zm9yICh2YXIgaT13aWR0aFN0YXJ0OyBpPHRoaXMuX3dpZHRoOyBpKz13aWR0aFN0ZXApIHtcclxuXHRcdFx0Y2FsbGJhY2soaSwgaiwgdGhpcy5fbWFwW2ldW2pdKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IG5laWdoYm9yIGNvdW50IGF0IFtpLGpdIGluIHRoaXMuX21hcFxyXG4gKi9cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX2dldE5laWdoYm9ycyA9IGZ1bmN0aW9uKGN4LCBjeSkge1xyXG5cdHZhciByZXN1bHQgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX2RpcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGRpciA9IHRoaXMuX2RpcnNbaV07XHJcblx0XHR2YXIgeCA9IGN4ICsgZGlyWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIGRpclsxXTtcclxuXHJcblx0XHRpZiAoeCA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5IDwgMCB8fCB5ID49IHRoaXMuX3dpZHRoKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRyZXN1bHQgKz0gKHRoaXMuX21hcFt4XVt5XSA9PSAxID8gMSA6IDApO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNYWtlIHN1cmUgZXZlcnkgbm9uLXdhbGwgc3BhY2UgaXMgYWNjZXNzaWJsZS5cclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdG8gY2FsbCB0byBkaXNwbGF5IG1hcCB3aGVuIGRvXHJcbiAqIEBwYXJhbSB7aW50fSB2YWx1ZSB0byBjb25zaWRlciBlbXB0eSBzcGFjZSAtIGRlZmF1bHRzIHRvIDBcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdG8gY2FsbCB3aGVuIGEgbmV3IGNvbm5lY3Rpb24gaXMgbWFkZVxyXG4gKi9cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB2YWx1ZSwgY29ubmVjdGlvbkNhbGxiYWNrKSB7XHJcblx0aWYgKCF2YWx1ZSkgdmFsdWUgPSAwO1xyXG5cclxuXHR2YXIgYWxsRnJlZVNwYWNlID0gW107XHJcblx0dmFyIG5vdENvbm5lY3RlZCA9IHt9O1xyXG5cdC8vIGZpbmQgYWxsIGZyZWUgc3BhY2VcclxuXHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuX3dpZHRoOyB4KyspIHtcclxuXHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5faGVpZ2h0OyB5KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuX2ZyZWVTcGFjZSh4LCB5LCB2YWx1ZSkpIHtcclxuXHRcdFx0XHR2YXIgcCA9IFt4LCB5XTtcclxuXHRcdFx0XHRub3RDb25uZWN0ZWRbdGhpcy5fcG9pbnRLZXkocCldID0gcDtcclxuXHRcdFx0XHRhbGxGcmVlU3BhY2UucHVzaChbeCwgeV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdHZhciBzdGFydCA9IGFsbEZyZWVTcGFjZVtST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgYWxsRnJlZVNwYWNlLmxlbmd0aCAtIDEpXTtcclxuXHJcblx0dmFyIGtleSA9IHRoaXMuX3BvaW50S2V5KHN0YXJ0KTtcclxuXHR2YXIgY29ubmVjdGVkID0ge307XHJcblx0Y29ubmVjdGVkW2tleV0gPSBzdGFydDtcclxuXHRkZWxldGUgbm90Q29ubmVjdGVkW2tleV07XHJcblxyXG5cdC8vIGZpbmQgd2hhdCdzIGNvbm5lY3RlZCB0byB0aGUgc3RhcnRpbmcgcG9pbnRcclxuXHR0aGlzLl9maW5kQ29ubmVjdGVkKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCBbc3RhcnRdLCBmYWxzZSwgdmFsdWUpO1xyXG5cclxuXHR3aGlsZSAoT2JqZWN0LmtleXMobm90Q29ubmVjdGVkKS5sZW5ndGggPiAwKSB7XHJcblxyXG5cdFx0Ly8gZmluZCB0d28gcG9pbnRzIGZyb20gbm90Q29ubmVjdGVkIHRvIGNvbm5lY3RlZFxyXG5cdFx0dmFyIHAgPSB0aGlzLl9nZXRGcm9tVG8oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQpO1xyXG5cdFx0dmFyIGZyb20gPSBwWzBdOyAvLyBub3RDb25uZWN0ZWRcclxuXHRcdHZhciB0byA9IHBbMV07IC8vIGNvbm5lY3RlZFxyXG5cclxuXHRcdC8vIGZpbmQgZXZlcnl0aGluZyBjb25uZWN0ZWQgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XHJcblx0XHR2YXIgbG9jYWwgPSB7fTtcclxuXHRcdGxvY2FsW3RoaXMuX3BvaW50S2V5KGZyb20pXSA9IGZyb207XHJcblx0XHR0aGlzLl9maW5kQ29ubmVjdGVkKGxvY2FsLCBub3RDb25uZWN0ZWQsIFtmcm9tXSwgdHJ1ZSwgdmFsdWUpO1xyXG5cclxuXHRcdC8vIGNvbm5lY3QgdG8gYSBjb25uZWN0ZWQgc3F1YXJlXHJcblx0XHR0aGlzLl90dW5uZWxUb0Nvbm5lY3RlZCh0bywgZnJvbSwgY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHZhbHVlLCBjb25uZWN0aW9uQ2FsbGJhY2spO1xyXG5cclxuXHRcdC8vIG5vdyBhbGwgb2YgbG9jYWwgaXMgY29ubmVjdGVkXHJcblx0XHRmb3IgKHZhciBrIGluIGxvY2FsKSB7XHJcblx0XHRcdHZhciBwcCA9IGxvY2FsW2tdO1xyXG5cdFx0XHR0aGlzLl9tYXBbcHBbMF1dW3BwWzFdXSA9IHZhbHVlO1xyXG5cdFx0XHRjb25uZWN0ZWRba10gPSBwcDtcclxuXHRcdFx0ZGVsZXRlIG5vdENvbm5lY3RlZFtrXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuc2VydmljZUNhbGxiYWNrKGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGaW5kIHJhbmRvbSBwb2ludHMgdG8gY29ubmVjdC4gU2VhcmNoIGZvciB0aGUgY2xvc2VzdCBwb2ludCBpbiB0aGUgbGFyZ2VyIHNwYWNlLlxyXG4gKiBUaGlzIGlzIHRvIG1pbmltaXplIHRoZSBsZW5ndGggb2YgdGhlIHBhc3NhZ2Ugd2hpbGUgbWFpbnRhaW5pbmcgZ29vZCBwZXJmb3JtYW5jZS5cclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9nZXRGcm9tVG8gPSBmdW5jdGlvbihjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCkge1xyXG5cdHZhciBmcm9tLCB0bywgZDtcclxuXHR2YXIgY29ubmVjdGVkS2V5cyA9IE9iamVjdC5rZXlzKGNvbm5lY3RlZCk7XHJcblx0dmFyIG5vdENvbm5lY3RlZEtleXMgPSBPYmplY3Qua2V5cyhub3RDb25uZWN0ZWQpO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XHJcblx0XHRpZiAoY29ubmVjdGVkS2V5cy5sZW5ndGggPCBub3RDb25uZWN0ZWRLZXlzLmxlbmd0aCkge1xyXG5cdFx0XHR2YXIga2V5cyA9IGNvbm5lY3RlZEtleXM7XHJcblx0XHRcdHRvID0gY29ubmVjdGVkW2tleXNbUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGtleXMubGVuZ3RoIC0gMSldXTtcclxuXHRcdFx0ZnJvbSA9IHRoaXMuX2dldENsb3Nlc3QodG8sIG5vdENvbm5lY3RlZCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIga2V5cyA9IG5vdENvbm5lY3RlZEtleXM7XHJcblx0XHRcdGZyb20gPSBub3RDb25uZWN0ZWRba2V5c1tST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwga2V5cy5sZW5ndGggLSAxKV1dO1xyXG5cdFx0XHR0byA9IHRoaXMuX2dldENsb3Nlc3QoZnJvbSwgY29ubmVjdGVkKTtcclxuXHRcdH1cclxuXHRcdGQgPSAoZnJvbVswXSAtIHRvWzBdKSAqIChmcm9tWzBdIC0gdG9bMF0pICsgKGZyb21bMV0gLSB0b1sxXSkgKiAoZnJvbVsxXSAtIHRvWzFdKTtcclxuXHRcdGlmIChkIDwgNjQpIHtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIGNvbnNvbGUubG9nKFwiPj4+IGNvbm5lY3RlZD1cIiArIHRvICsgXCIgbm90Q29ubmVjdGVkPVwiICsgZnJvbSArIFwiIGRpc3Q9XCIgKyBkKTtcclxuXHRyZXR1cm4gW2Zyb20sIHRvXTtcclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9nZXRDbG9zZXN0ID0gZnVuY3Rpb24ocG9pbnQsIHNwYWNlKSB7XHJcblx0dmFyIG1pblBvaW50ID0gbnVsbDtcclxuXHR2YXIgbWluRGlzdCA9IG51bGw7XHJcblx0Zm9yIChrIGluIHNwYWNlKSB7XHJcblx0XHR2YXIgcCA9IHNwYWNlW2tdO1xyXG5cdFx0dmFyIGQgPSAocFswXSAtIHBvaW50WzBdKSAqIChwWzBdIC0gcG9pbnRbMF0pICsgKHBbMV0gLSBwb2ludFsxXSkgKiAocFsxXSAtIHBvaW50WzFdKTtcclxuXHRcdGlmIChtaW5EaXN0ID09IG51bGwgfHwgZCA8IG1pbkRpc3QpIHtcclxuXHRcdFx0bWluRGlzdCA9IGQ7XHJcblx0XHRcdG1pblBvaW50ID0gcDtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIG1pblBvaW50O1xyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX2ZpbmRDb25uZWN0ZWQgPSBmdW5jdGlvbihjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCwgc3RhY2ssIGtlZXBOb3RDb25uZWN0ZWQsIHZhbHVlKSB7XHJcblx0d2hpbGUoc3RhY2subGVuZ3RoID4gMCkge1xyXG5cdFx0dmFyIHAgPSBzdGFjay5zcGxpY2UoMCwgMSlbMF07XHJcblx0XHR2YXIgdGVzdHMgPSBbXHJcblx0XHRcdFtwWzBdICsgMSwgcFsxXV0sXHJcblx0XHRcdFtwWzBdIC0gMSwgcFsxXV0sXHJcblx0XHRcdFtwWzBdLCAgICAgcFsxXSArIDFdLFxyXG5cdFx0XHRbcFswXSwgICAgIHBbMV0gLSAxXVxyXG5cdFx0XTtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGVzdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGtleSA9IHRoaXMuX3BvaW50S2V5KHRlc3RzW2ldKTtcclxuXHRcdFx0aWYgKGNvbm5lY3RlZFtrZXldID09IG51bGwgJiYgdGhpcy5fZnJlZVNwYWNlKHRlc3RzW2ldWzBdLCB0ZXN0c1tpXVsxXSwgdmFsdWUpKSB7XHJcblx0XHRcdFx0Y29ubmVjdGVkW2tleV0gPSB0ZXN0c1tpXTtcclxuXHRcdFx0XHRpZiAoIWtlZXBOb3RDb25uZWN0ZWQpIHtcclxuXHRcdFx0XHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRba2V5XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c3RhY2sucHVzaCh0ZXN0c1tpXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fdHVubmVsVG9Db25uZWN0ZWQgPSBmdW5jdGlvbih0bywgZnJvbSwgY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHZhbHVlLCBjb25uZWN0aW9uQ2FsbGJhY2spIHtcclxuXHR2YXIga2V5ID0gdGhpcy5fcG9pbnRLZXkoZnJvbSk7XHJcblx0dmFyIGEsIGI7XHJcblx0aWYgKGZyb21bMF0gPCB0b1swXSkge1xyXG5cdFx0YSA9IGZyb207XHJcblx0XHRiID0gdG87XHJcblx0fSBlbHNlIHtcclxuXHRcdGEgPSB0bztcclxuXHRcdGIgPSBmcm9tO1xyXG5cdH1cclxuXHRmb3IgKHZhciB4eCA9IGFbMF07IHh4IDw9IGJbMF07IHh4KyspIHtcclxuXHRcdHRoaXMuX21hcFt4eF1bYVsxXV0gPSB2YWx1ZTtcclxuXHRcdHZhciBwID0gW3h4LCBhWzFdXTtcclxuXHRcdHZhciBwa2V5ID0gdGhpcy5fcG9pbnRLZXkocCk7XHJcblx0XHRjb25uZWN0ZWRbcGtleV0gPSBwO1xyXG5cdFx0ZGVsZXRlIG5vdENvbm5lY3RlZFtwa2V5XTtcclxuXHR9XHJcblx0aWYgKGNvbm5lY3Rpb25DYWxsYmFjayAmJiBhWzBdIDwgYlswXSkge1xyXG5cdFx0Y29ubmVjdGlvbkNhbGxiYWNrKGEsIFtiWzBdLCBhWzFdXSk7XHJcblx0fVxyXG5cclxuXHQvLyB4IGlzIG5vdyBmaXhlZFxyXG5cdHZhciB4ID0gYlswXTtcclxuXHJcblx0aWYgKGZyb21bMV0gPCB0b1sxXSkge1xyXG5cdFx0YSA9IGZyb207XHJcblx0XHRiID0gdG87XHJcblx0fSBlbHNlIHtcclxuXHRcdGEgPSB0bztcclxuXHRcdGIgPSBmcm9tO1xyXG5cdH1cclxuXHRmb3IgKHZhciB5eSA9IGFbMV07IHl5IDwgYlsxXTsgeXkrKykge1xyXG5cdFx0dGhpcy5fbWFwW3hdW3l5XSA9IHZhbHVlO1xyXG5cdFx0dmFyIHAgPSBbeCwgeXldO1xyXG5cdFx0dmFyIHBrZXkgPSB0aGlzLl9wb2ludEtleShwKTtcclxuXHRcdGNvbm5lY3RlZFtwa2V5XSA9IHA7XHJcblx0XHRkZWxldGUgbm90Q29ubmVjdGVkW3BrZXldO1xyXG5cdH1cclxuXHRpZiAoY29ubmVjdGlvbkNhbGxiYWNrICYmIGFbMV0gPCBiWzFdKSB7XHJcblx0XHRjb25uZWN0aW9uQ2FsbGJhY2soW2JbMF0sIGFbMV1dLCBbYlswXSwgYlsxXV0pO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9mcmVlU3BhY2UgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xyXG5cdHJldHVybiB4ID49IDAgJiYgeCA8IHRoaXMuX3dpZHRoICYmIHkgPj0gMCAmJiB5IDwgdGhpcy5faGVpZ2h0ICYmIHRoaXMuX21hcFt4XVt5XSA9PSB2YWx1ZTtcclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9wb2ludEtleSA9IGZ1bmN0aW9uKHApIHtcclxuXHRyZXR1cm4gcFswXSArIFwiLlwiICsgcFsxXTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBEdW5nZW9uIG1hcDogaGFzIHJvb21zIGFuZCBjb3JyaWRvcnNcclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuRHVuZ2VvbiA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblx0dGhpcy5fcm9vbXMgPSBbXTsgLyogbGlzdCBvZiBhbGwgcm9vbXMgKi9cclxuXHR0aGlzLl9jb3JyaWRvcnMgPSBbXTtcclxufTtcclxuUk9ULk1hcC5EdW5nZW9uLmV4dGVuZChST1QuTWFwKTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgYWxsIGdlbmVyYXRlZCByb29tc1xyXG4gKiBAcmV0dXJucyB7Uk9ULk1hcC5GZWF0dXJlLlJvb21bXX1cclxuICovXHJcblJPVC5NYXAuRHVuZ2Vvbi5wcm90b3R5cGUuZ2V0Um9vbXMgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fcm9vbXM7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGFsbCBnZW5lcmF0ZWQgY29ycmlkb3JzXHJcbiAqIEByZXR1cm5zIHtST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3JbXX1cclxuICovXHJcblJPVC5NYXAuRHVuZ2Vvbi5wcm90b3R5cGUuZ2V0Q29ycmlkb3JzID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX2NvcnJpZG9ycztcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBSYW5kb20gZHVuZ2VvbiBnZW5lcmF0b3IgdXNpbmcgaHVtYW4tbGlrZSBkaWdnaW5nIHBhdHRlcm5zLlxyXG4gKiBIZWF2aWx5IGJhc2VkIG9uIE1pa2UgQW5kZXJzb24ncyBpZGVhcyBmcm9tIHRoZSBcIlR5cmFudFwiIGFsZ28sIG1lbnRpb25lZCBhdCBcclxuICogaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9RHVuZ2Vvbi1CdWlsZGluZ19BbGdvcml0aG0uXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwLkR1bmdlb25cclxuICovXHJcblJPVC5NYXAuRGlnZ2VyID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xyXG5cdFJPVC5NYXAuRHVuZ2Vvbi5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdFxyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRyb29tV2lkdGg6IFszLCA5XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIHdpZHRoICovXHJcblx0XHRyb29tSGVpZ2h0OiBbMywgNV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSBoZWlnaHQgKi9cclxuXHRcdGNvcnJpZG9yTGVuZ3RoOiBbMywgMTBdLCAvKiBjb3JyaWRvciBtaW5pbXVtIGFuZCBtYXhpbXVtIGxlbmd0aCAqL1xyXG5cdFx0ZHVnUGVyY2VudGFnZTogMC4yLCAvKiB3ZSBzdG9wIGFmdGVyIHRoaXMgcGVyY2VudGFnZSBvZiBsZXZlbCBhcmVhIGhhcyBiZWVuIGR1ZyBvdXQgKi9cclxuXHRcdHRpbWVMaW1pdDogMTAwMCAvKiB3ZSBzdG9wIGFmdGVyIHRoaXMgbXVjaCB0aW1lIGhhcyBwYXNzZWQgKG1zZWMpICovXHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHRcclxuXHR0aGlzLl9mZWF0dXJlcyA9IHtcclxuXHRcdFwiUm9vbVwiOiA0LFxyXG5cdFx0XCJDb3JyaWRvclwiOiA0XHJcblx0fTtcclxuXHR0aGlzLl9mZWF0dXJlQXR0ZW1wdHMgPSAyMDsgLyogaG93IG1hbnkgdGltZXMgZG8gd2UgdHJ5IHRvIGNyZWF0ZSBhIGZlYXR1cmUgb24gYSBzdWl0YWJsZSB3YWxsICovXHJcblx0dGhpcy5fd2FsbHMgPSB7fTsgLyogdGhlc2UgYXJlIGF2YWlsYWJsZSBmb3IgZGlnZ2luZyAqL1xyXG5cdFxyXG5cdHRoaXMuX2RpZ0NhbGxiYWNrID0gdGhpcy5fZGlnQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHR0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrID0gdGhpcy5fY2FuQmVEdWdDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG5cdHRoaXMuX2lzV2FsbENhbGxiYWNrID0gdGhpcy5faXNXYWxsQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHR0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjayA9IHRoaXMuX3ByaW9yaXR5V2FsbENhbGxiYWNrLmJpbmQodGhpcyk7XHJcbn07XHJcblJPVC5NYXAuRGlnZ2VyLmV4dGVuZChST1QuTWFwLkR1bmdlb24pO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIG1hcFxyXG4gKiBAc2VlIFJPVC5NYXAjY3JlYXRlXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR0aGlzLl9yb29tcyA9IFtdO1xyXG5cdHRoaXMuX2NvcnJpZG9ycyA9IFtdO1xyXG5cdHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0dGhpcy5fd2FsbHMgPSB7fTtcclxuXHR0aGlzLl9kdWcgPSAwO1xyXG5cdHZhciBhcmVhID0gKHRoaXMuX3dpZHRoLTIpICogKHRoaXMuX2hlaWdodC0yKTtcclxuXHJcblx0dGhpcy5fZmlyc3RSb29tKCk7XHJcblx0XHJcblx0dmFyIHQxID0gRGF0ZS5ub3coKTtcclxuXHJcblx0ZG8ge1xyXG5cdFx0dmFyIHQyID0gRGF0ZS5ub3coKTtcclxuXHRcdGlmICh0MiAtIHQxID4gdGhpcy5fb3B0aW9ucy50aW1lTGltaXQpIHsgYnJlYWs7IH1cclxuXHJcblx0XHQvKiBmaW5kIGEgZ29vZCB3YWxsICovXHJcblx0XHR2YXIgd2FsbCA9IHRoaXMuX2ZpbmRXYWxsKCk7XHJcblx0XHRpZiAoIXdhbGwpIHsgYnJlYWs7IH0gLyogbm8gbW9yZSB3YWxscyAqL1xyXG5cdFx0XHJcblx0XHR2YXIgcGFydHMgPSB3YWxsLnNwbGl0KFwiLFwiKTtcclxuXHRcdHZhciB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xyXG5cdFx0dmFyIHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XHJcblx0XHR2YXIgZGlyID0gdGhpcy5fZ2V0RGlnZ2luZ0RpcmVjdGlvbih4LCB5KTtcclxuXHRcdGlmICghZGlyKSB7IGNvbnRpbnVlOyB9IC8qIHRoaXMgd2FsbCBpcyBub3Qgc3VpdGFibGUgKi9cclxuXHRcdFxyXG4vL1x0XHRjb25zb2xlLmxvZyhcIndhbGxcIiwgeCwgeSk7XHJcblxyXG5cdFx0LyogdHJ5IGFkZGluZyBhIGZlYXR1cmUgKi9cclxuXHRcdHZhciBmZWF0dXJlQXR0ZW1wdHMgPSAwO1xyXG5cdFx0ZG8ge1xyXG5cdFx0XHRmZWF0dXJlQXR0ZW1wdHMrKztcclxuXHRcdFx0aWYgKHRoaXMuX3RyeUZlYXR1cmUoeCwgeSwgZGlyWzBdLCBkaXJbMV0pKSB7IC8qIGZlYXR1cmUgYWRkZWQgKi9cclxuXHRcdFx0XHQvL2lmICh0aGlzLl9yb29tcy5sZW5ndGggKyB0aGlzLl9jb3JyaWRvcnMubGVuZ3RoID09IDIpIHsgdGhpcy5fcm9vbXNbMF0uYWRkRG9vcih4LCB5KTsgfSAvKiBmaXJzdCByb29tIG9maWNpYWxseSBoYXMgZG9vcnMgKi9cclxuXHRcdFx0XHR0aGlzLl9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzKHgsIHkpO1xyXG5cdFx0XHRcdHRoaXMuX3JlbW92ZVN1cnJvdW5kaW5nV2FsbHMoeC1kaXJbMF0sIHktZGlyWzFdKTtcclxuXHRcdFx0XHRicmVhazsgXHJcblx0XHRcdH1cclxuXHRcdH0gd2hpbGUgKGZlYXR1cmVBdHRlbXB0cyA8IHRoaXMuX2ZlYXR1cmVBdHRlbXB0cyk7XHJcblx0XHRcclxuXHRcdHZhciBwcmlvcml0eVdhbGxzID0gMDtcclxuXHRcdGZvciAodmFyIGlkIGluIHRoaXMuX3dhbGxzKSB7IFxyXG5cdFx0XHRpZiAodGhpcy5fd2FsbHNbaWRdID4gMSkgeyBwcmlvcml0eVdhbGxzKys7IH1cclxuXHRcdH1cclxuXHJcblx0fSB3aGlsZSAodGhpcy5fZHVnL2FyZWEgPCB0aGlzLl9vcHRpb25zLmR1Z1BlcmNlbnRhZ2UgfHwgcHJpb3JpdHlXYWxscyk7IC8qIGZpeG1lIG51bWJlciBvZiBwcmlvcml0eSB3YWxscyAqL1xyXG5cclxuXHR0aGlzLl9hZGREb29ycygpO1xyXG5cclxuXHRpZiAoY2FsbGJhY2spIHtcclxuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xyXG5cdFx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soaSwgaiwgdGhpcy5fbWFwW2ldW2pdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0aGlzLl93YWxscyA9IHt9O1xyXG5cdHRoaXMuX21hcCA9IG51bGw7XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9kaWdDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHksIHZhbHVlKSB7XHJcblx0aWYgKHZhbHVlID09IDAgfHwgdmFsdWUgPT0gMikgeyAvKiBlbXB0eSAqL1xyXG5cdFx0dGhpcy5fbWFwW3hdW3ldID0gMDtcclxuXHRcdHRoaXMuX2R1ZysrO1xyXG5cdH0gZWxzZSB7IC8qIHdhbGwgKi9cclxuXHRcdHRoaXMuX3dhbGxzW3grXCIsXCIreV0gPSAxO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5faXNXYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0aWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPj0gdGhpcy5fd2lkdGggfHwgeSA+PSB0aGlzLl9oZWlnaHQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0cmV0dXJuICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2NhbkJlRHVnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0aWYgKHggPCAxIHx8IHkgPCAxIHx8IHgrMSA+PSB0aGlzLl93aWR0aCB8fCB5KzEgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9wcmlvcml0eVdhbGxDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHR0aGlzLl93YWxsc1t4K1wiLFwiK3ldID0gMjtcclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fZmlyc3RSb29tID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGN4ID0gTWF0aC5mbG9vcih0aGlzLl93aWR0aC8yKTtcclxuXHR2YXIgY3kgPSBNYXRoLmZsb29yKHRoaXMuX2hlaWdodC8yKTtcclxuXHR2YXIgcm9vbSA9IFJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbUNlbnRlcihjeCwgY3ksIHRoaXMuX29wdGlvbnMpO1xyXG5cdHRoaXMuX3Jvb21zLnB1c2gocm9vbSk7XHJcblx0cm9vbS5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBhIHN1aXRhYmxlIHdhbGxcclxuICovXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fZmluZFdhbGwgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgcHJpbzEgPSBbXTtcclxuXHR2YXIgcHJpbzIgPSBbXTtcclxuXHRmb3IgKHZhciBpZCBpbiB0aGlzLl93YWxscykge1xyXG5cdFx0dmFyIHByaW8gPSB0aGlzLl93YWxsc1tpZF07XHJcblx0XHRpZiAocHJpbyA9PSAyKSB7IFxyXG5cdFx0XHRwcmlvMi5wdXNoKGlkKTsgXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwcmlvMS5wdXNoKGlkKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dmFyIGFyciA9IChwcmlvMi5sZW5ndGggPyBwcmlvMiA6IHByaW8xKTtcclxuXHRpZiAoIWFyci5sZW5ndGgpIHsgcmV0dXJuIG51bGw7IH0gLyogbm8gd2FsbHMgOi8gKi9cclxuXHRcclxuXHR2YXIgaWQgPSBhcnIucmFuZG9tKCk7XHJcblx0ZGVsZXRlIHRoaXMuX3dhbGxzW2lkXTtcclxuXHJcblx0cmV0dXJuIGlkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRyaWVzIGFkZGluZyBhIGZlYXR1cmVcclxuICogQHJldHVybnMge2Jvb2x9IHdhcyB0aGlzIGEgc3VjY2Vzc2Z1bCB0cnk/XHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX3RyeUZlYXR1cmUgPSBmdW5jdGlvbih4LCB5LCBkeCwgZHkpIHtcclxuXHR2YXIgZmVhdHVyZSA9IFJPVC5STkcuZ2V0V2VpZ2h0ZWRWYWx1ZSh0aGlzLl9mZWF0dXJlcyk7XHJcblx0ZmVhdHVyZSA9IFJPVC5NYXAuRmVhdHVyZVtmZWF0dXJlXS5jcmVhdGVSYW5kb21BdCh4LCB5LCBkeCwgZHksIHRoaXMuX29wdGlvbnMpO1xyXG5cdFxyXG5cdGlmICghZmVhdHVyZS5pc1ZhbGlkKHRoaXMuX2lzV2FsbENhbGxiYWNrLCB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrKSkge1xyXG4vL1x0XHRjb25zb2xlLmxvZyhcIm5vdCB2YWxpZFwiKTtcclxuLy9cdFx0ZmVhdHVyZS5kZWJ1ZygpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHRcclxuXHRmZWF0dXJlLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XHJcbi8vXHRmZWF0dXJlLmRlYnVnKCk7XHJcblxyXG5cdGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUk9ULk1hcC5GZWF0dXJlLlJvb20pIHsgdGhpcy5fcm9vbXMucHVzaChmZWF0dXJlKTsgfVxyXG5cdGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yKSB7IFxyXG5cdFx0ZmVhdHVyZS5jcmVhdGVQcmlvcml0eVdhbGxzKHRoaXMuX3ByaW9yaXR5V2FsbENhbGxiYWNrKTtcclxuXHRcdHRoaXMuX2NvcnJpZG9ycy5wdXNoKGZlYXR1cmUpOyBcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX3JlbW92ZVN1cnJvdW5kaW5nV2FsbHMgPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHR2YXIgZGVsdGFzID0gUk9ULkRJUlNbNF07XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPGRlbHRhcy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgZGVsdGEgPSBkZWx0YXNbaV07XHJcblx0XHR2YXIgeCA9IGN4ICsgZGVsdGFbMF07XHJcblx0XHR2YXIgeSA9IGN5ICsgZGVsdGFbMV07XHJcblx0XHRkZWxldGUgdGhpcy5fd2FsbHNbeCtcIixcIit5XTtcclxuXHRcdHZhciB4ID0gY3ggKyAyKmRlbHRhWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIDIqZGVsdGFbMV07XHJcblx0XHRkZWxldGUgdGhpcy5fd2FsbHNbeCtcIixcIit5XTtcclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyB2ZWN0b3IgaW4gXCJkaWdnaW5nXCIgZGlyZWN0aW9uLCBvciBmYWxzZSwgaWYgdGhpcyBkb2VzIG5vdCBleGlzdCAob3IgaXMgbm90IHVuaXF1ZSlcclxuICovXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fZ2V0RGlnZ2luZ0RpcmVjdGlvbiA9IGZ1bmN0aW9uKGN4LCBjeSkge1xyXG5cdGlmIChjeCA8PSAwIHx8IGN5IDw9IDAgfHwgY3ggPj0gdGhpcy5fd2lkdGggLSAxIHx8IGN5ID49IHRoaXMuX2hlaWdodCAtIDEpIHsgcmV0dXJuIG51bGw7IH1cclxuXHJcblx0dmFyIHJlc3VsdCA9IG51bGw7XHJcblx0dmFyIGRlbHRhcyA9IFJPVC5ESVJTWzRdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPGRlbHRhcy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgZGVsdGEgPSBkZWx0YXNbaV07XHJcblx0XHR2YXIgeCA9IGN4ICsgZGVsdGFbMF07XHJcblx0XHR2YXIgeSA9IGN5ICsgZGVsdGFbMV07XHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5fbWFwW3hdW3ldKSB7IC8qIHRoZXJlIGFscmVhZHkgaXMgYW5vdGhlciBlbXB0eSBuZWlnaGJvciEgKi9cclxuXHRcdFx0aWYgKHJlc3VsdCkgeyByZXR1cm4gbnVsbDsgfVxyXG5cdFx0XHRyZXN1bHQgPSBkZWx0YTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Lyogbm8gZW1wdHkgbmVpZ2hib3IgKi9cclxuXHRpZiAoIXJlc3VsdCkgeyByZXR1cm4gbnVsbDsgfVxyXG5cdFxyXG5cdHJldHVybiBbLXJlc3VsdFswXSwgLXJlc3VsdFsxXV07XHJcbn07XHJcblxyXG4vKipcclxuICogRmluZCBlbXB0eSBzcGFjZXMgc3Vycm91bmRpbmcgcm9vbXMsIGFuZCBhcHBseSBkb29ycy5cclxuICovXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fYWRkRG9vcnMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgZGF0YSA9IHRoaXMuX21hcDtcclxuXHR2YXIgaXNXYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0XHRyZXR1cm4gKGRhdGFbeF1beV0gPT0gMSk7XHJcblx0fTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3Jvb21zLmxlbmd0aDsgaSsrICkge1xyXG5cdFx0dmFyIHJvb20gPSB0aGlzLl9yb29tc1tpXTtcclxuXHRcdHJvb20uY2xlYXJEb29ycygpO1xyXG5cdFx0cm9vbS5hZGREb29ycyhpc1dhbGxDYWxsYmFjayk7XHJcblx0fVxyXG59O1xyXG4vKipcclxuICogQGNsYXNzIER1bmdlb24gZ2VuZXJhdG9yIHdoaWNoIHRyaWVzIHRvIGZpbGwgdGhlIHNwYWNlIGV2ZW5seS4gR2VuZXJhdGVzIGluZGVwZW5kZW50IHJvb21zIGFuZCB0cmllcyB0byBjb25uZWN0IHRoZW0uXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwLkR1bmdlb25cclxuICovXHJcblJPVC5NYXAuVW5pZm9ybSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcclxuXHRST1QuTWFwLkR1bmdlb24uY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdHJvb21XaWR0aDogWzMsIDldLCAvKiByb29tIG1pbmltdW0gYW5kIG1heGltdW0gd2lkdGggKi9cclxuXHRcdHJvb21IZWlnaHQ6IFszLCA1XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIGhlaWdodCAqL1xyXG5cdFx0cm9vbUR1Z1BlcmNlbnRhZ2U6IDAuMSwgLyogd2Ugc3RvcCBhZnRlciB0aGlzIHBlcmNlbnRhZ2Ugb2YgbGV2ZWwgYXJlYSBoYXMgYmVlbiBkdWcgb3V0IGJ5IHJvb21zICovXHJcblx0XHR0aW1lTGltaXQ6IDEwMDAgLyogd2Ugc3RvcCBhZnRlciB0aGlzIG11Y2ggdGltZSBoYXMgcGFzc2VkIChtc2VjKSAqL1xyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblxyXG5cdHRoaXMuX3Jvb21BdHRlbXB0cyA9IDIwOyAvKiBuZXcgcm9vbSBpcyBjcmVhdGVkIE4tdGltZXMgdW50aWwgaXMgY29uc2lkZXJlZCBhcyBpbXBvc3NpYmxlIHRvIGdlbmVyYXRlICovXHJcblx0dGhpcy5fY29ycmlkb3JBdHRlbXB0cyA9IDIwOyAvKiBjb3JyaWRvcnMgYXJlIHRyaWVkIE4tdGltZXMgdW50aWwgdGhlIGxldmVsIGlzIGNvbnNpZGVyZWQgYXMgaW1wb3NzaWJsZSB0byBjb25uZWN0ICovXHJcblxyXG5cdHRoaXMuX2Nvbm5lY3RlZCA9IFtdOyAvKiBsaXN0IG9mIGFscmVhZHkgY29ubmVjdGVkIHJvb21zICovXHJcblx0dGhpcy5fdW5jb25uZWN0ZWQgPSBbXTsgLyogbGlzdCBvZiByZW1haW5pbmcgdW5jb25uZWN0ZWQgcm9vbXMgKi9cclxuXHRcclxuXHR0aGlzLl9kaWdDYWxsYmFjayA9IHRoaXMuX2RpZ0NhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5fY2FuQmVEdWdDYWxsYmFjayA9IHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHR0aGlzLl9pc1dhbGxDYWxsYmFjayA9IHRoaXMuX2lzV2FsbENhbGxiYWNrLmJpbmQodGhpcyk7XHJcbn07XHJcblJPVC5NYXAuVW5pZm9ybS5leHRlbmQoUk9ULk1hcC5EdW5nZW9uKTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBtYXAuIElmIHRoZSB0aW1lIGxpbWl0IGhhcyBiZWVuIGhpdCwgcmV0dXJucyBudWxsLlxyXG4gKiBAc2VlIFJPVC5NYXAjY3JlYXRlXHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIHQxID0gRGF0ZS5ub3coKTtcclxuXHR3aGlsZSAoMSkge1xyXG5cdFx0dmFyIHQyID0gRGF0ZS5ub3coKTtcclxuXHRcdGlmICh0MiAtIHQxID4gdGhpcy5fb3B0aW9ucy50aW1lTGltaXQpIHsgcmV0dXJuIG51bGw7IH0gLyogdGltZSBsaW1pdCEgKi9cclxuXHRcclxuXHRcdHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0XHR0aGlzLl9kdWcgPSAwO1xyXG5cdFx0dGhpcy5fcm9vbXMgPSBbXTtcclxuXHRcdHRoaXMuX3VuY29ubmVjdGVkID0gW107XHJcblx0XHR0aGlzLl9nZW5lcmF0ZVJvb21zKCk7XHJcblx0XHRpZiAodGhpcy5fcm9vbXMubGVuZ3RoIDwgMikgeyBjb250aW51ZTsgfVxyXG5cdFx0aWYgKHRoaXMuX2dlbmVyYXRlQ29ycmlkb3JzKCkpIHsgYnJlYWs7IH1cclxuXHR9XHJcblx0XHJcblx0aWYgKGNhbGxiYWNrKSB7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogR2VuZXJhdGVzIGEgc3VpdGFibGUgYW1vdW50IG9mIHJvb21zXHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9nZW5lcmF0ZVJvb21zID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHcgPSB0aGlzLl93aWR0aC0yO1xyXG5cdHZhciBoID0gdGhpcy5faGVpZ2h0LTI7XHJcblxyXG5cdGRvIHtcclxuXHRcdHZhciByb29tID0gdGhpcy5fZ2VuZXJhdGVSb29tKCk7XHJcblx0XHRpZiAodGhpcy5fZHVnLyh3KmgpID4gdGhpcy5fb3B0aW9ucy5yb29tRHVnUGVyY2VudGFnZSkgeyBicmVhazsgfSAvKiBhY2hpZXZlZCByZXF1ZXN0ZWQgYW1vdW50IG9mIGZyZWUgc3BhY2UgKi9cclxuXHR9IHdoaWxlIChyb29tKTtcclxuXHJcblx0LyogZWl0aGVyIGVub3VnaCByb29tcywgb3Igbm90IGFibGUgdG8gZ2VuZXJhdGUgbW9yZSBvZiB0aGVtIDopICovXHJcbn07XHJcblxyXG4vKipcclxuICogVHJ5IHRvIGdlbmVyYXRlIG9uZSByb29tXHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9nZW5lcmF0ZVJvb20gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgY291bnQgPSAwO1xyXG5cdHdoaWxlIChjb3VudCA8IHRoaXMuX3Jvb21BdHRlbXB0cykge1xyXG5cdFx0Y291bnQrKztcclxuXHRcdFxyXG5cdFx0dmFyIHJvb20gPSBST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb20odGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgdGhpcy5fb3B0aW9ucyk7XHJcblx0XHRpZiAoIXJvb20uaXNWYWxpZCh0aGlzLl9pc1dhbGxDYWxsYmFjaywgdGhpcy5fY2FuQmVEdWdDYWxsYmFjaykpIHsgY29udGludWU7IH1cclxuXHRcdFxyXG5cdFx0cm9vbS5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spO1xyXG5cdFx0dGhpcy5fcm9vbXMucHVzaChyb29tKTtcclxuXHRcdHJldHVybiByb29tO1xyXG5cdH0gXHJcblxyXG5cdC8qIG5vIHJvb20gd2FzIGdlbmVyYXRlZCBpbiBhIGdpdmVuIG51bWJlciBvZiBhdHRlbXB0cyAqL1xyXG5cdHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBjb25uZWN0b3JzIGJld2VlbiByb29tc1xyXG4gKiBAcmV0dXJucyB7Ym9vbH0gc3VjY2VzcyBXYXMgdGhpcyBhdHRlbXB0IHN1Y2Nlc3NmdWxsP1xyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZ2VuZXJhdGVDb3JyaWRvcnMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgY250ID0gMDtcclxuXHR3aGlsZSAoY250IDwgdGhpcy5fY29ycmlkb3JBdHRlbXB0cykge1xyXG5cdFx0Y250Kys7XHJcblx0XHR0aGlzLl9jb3JyaWRvcnMgPSBbXTtcclxuXHJcblx0XHQvKiBkaWcgcm9vbXMgaW50byBhIGNsZWFyIG1hcCAqL1xyXG5cdFx0dGhpcy5fbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuX3Jvb21zLmxlbmd0aDtpKyspIHsgXHJcblx0XHRcdHZhciByb29tID0gdGhpcy5fcm9vbXNbaV07XHJcblx0XHRcdHJvb20uY2xlYXJEb29ycygpO1xyXG5cdFx0XHRyb29tLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7IFxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3VuY29ubmVjdGVkID0gdGhpcy5fcm9vbXMuc2xpY2UoKS5yYW5kb21pemUoKTtcclxuXHRcdHRoaXMuX2Nvbm5lY3RlZCA9IFtdO1xyXG5cdFx0aWYgKHRoaXMuX3VuY29ubmVjdGVkLmxlbmd0aCkgeyB0aGlzLl9jb25uZWN0ZWQucHVzaCh0aGlzLl91bmNvbm5lY3RlZC5wb3AoKSk7IH0gLyogZmlyc3Qgb25lIGlzIGFsd2F5cyBjb25uZWN0ZWQgKi9cclxuXHRcdFxyXG5cdFx0d2hpbGUgKDEpIHtcclxuXHRcdFx0LyogMS4gcGljayByYW5kb20gY29ubmVjdGVkIHJvb20gKi9cclxuXHRcdFx0dmFyIGNvbm5lY3RlZCA9IHRoaXMuX2Nvbm5lY3RlZC5yYW5kb20oKTtcclxuXHRcdFx0XHJcblx0XHRcdC8qIDIuIGZpbmQgY2xvc2VzdCB1bmNvbm5lY3RlZCAqL1xyXG5cdFx0XHR2YXIgcm9vbTEgPSB0aGlzLl9jbG9zZXN0Um9vbSh0aGlzLl91bmNvbm5lY3RlZCwgY29ubmVjdGVkKTtcclxuXHRcdFx0XHJcblx0XHRcdC8qIDMuIGNvbm5lY3QgaXQgdG8gY2xvc2VzdCBjb25uZWN0ZWQgKi9cclxuXHRcdFx0dmFyIHJvb20yID0gdGhpcy5fY2xvc2VzdFJvb20odGhpcy5fY29ubmVjdGVkLCByb29tMSk7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgb2sgPSB0aGlzLl9jb25uZWN0Um9vbXMocm9vbTEsIHJvb20yKTtcclxuXHRcdFx0aWYgKCFvaykgeyBicmVhazsgfSAvKiBzdG9wIGNvbm5lY3RpbmcsIHJlLXNodWZmbGUgKi9cclxuXHRcdFx0XHJcblx0XHRcdGlmICghdGhpcy5fdW5jb25uZWN0ZWQubGVuZ3RoKSB7IHJldHVybiB0cnVlOyB9IC8qIGRvbmU7IG5vIHJvb21zIHJlbWFpbiAqL1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogRm9yIGEgZ2l2ZW4gcm9vbSwgZmluZCB0aGUgY2xvc2VzdCBvbmUgZnJvbSB0aGUgbGlzdFxyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fY2xvc2VzdFJvb20gPSBmdW5jdGlvbihyb29tcywgcm9vbSkge1xyXG5cdHZhciBkaXN0ID0gSW5maW5pdHk7XHJcblx0dmFyIGNlbnRlciA9IHJvb20uZ2V0Q2VudGVyKCk7XHJcblx0dmFyIHJlc3VsdCA9IG51bGw7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8cm9vbXMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHIgPSByb29tc1tpXTtcclxuXHRcdHZhciBjID0gci5nZXRDZW50ZXIoKTtcclxuXHRcdHZhciBkeCA9IGNbMF0tY2VudGVyWzBdO1xyXG5cdFx0dmFyIGR5ID0gY1sxXS1jZW50ZXJbMV07XHJcblx0XHR2YXIgZCA9IGR4KmR4K2R5KmR5O1xyXG5cdFx0XHJcblx0XHRpZiAoZCA8IGRpc3QpIHtcclxuXHRcdFx0ZGlzdCA9IGQ7XHJcblx0XHRcdHJlc3VsdCA9IHI7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9jb25uZWN0Um9vbXMgPSBmdW5jdGlvbihyb29tMSwgcm9vbTIpIHtcclxuXHQvKlxyXG5cdFx0cm9vbTEuZGVidWcoKTtcclxuXHRcdHJvb20yLmRlYnVnKCk7XHJcblx0Ki9cclxuXHJcblx0dmFyIGNlbnRlcjEgPSByb29tMS5nZXRDZW50ZXIoKTtcclxuXHR2YXIgY2VudGVyMiA9IHJvb20yLmdldENlbnRlcigpO1xyXG5cclxuXHR2YXIgZGlmZlggPSBjZW50ZXIyWzBdIC0gY2VudGVyMVswXTtcclxuXHR2YXIgZGlmZlkgPSBjZW50ZXIyWzFdIC0gY2VudGVyMVsxXTtcclxuXHJcblx0aWYgKE1hdGguYWJzKGRpZmZYKSA8IE1hdGguYWJzKGRpZmZZKSkgeyAvKiBmaXJzdCB0cnkgY29ubmVjdGluZyBub3J0aC1zb3V0aCB3YWxscyAqL1xyXG5cdFx0dmFyIGRpckluZGV4MSA9IChkaWZmWSA+IDAgPyAyIDogMCk7XHJcblx0XHR2YXIgZGlySW5kZXgyID0gKGRpckluZGV4MSArIDIpICUgNDtcclxuXHRcdHZhciBtaW4gPSByb29tMi5nZXRMZWZ0KCk7XHJcblx0XHR2YXIgbWF4ID0gcm9vbTIuZ2V0UmlnaHQoKTtcclxuXHRcdHZhciBpbmRleCA9IDA7XHJcblx0fSBlbHNlIHsgLyogZmlyc3QgdHJ5IGNvbm5lY3RpbmcgZWFzdC13ZXN0IHdhbGxzICovXHJcblx0XHR2YXIgZGlySW5kZXgxID0gKGRpZmZYID4gMCA/IDEgOiAzKTtcclxuXHRcdHZhciBkaXJJbmRleDIgPSAoZGlySW5kZXgxICsgMikgJSA0O1xyXG5cdFx0dmFyIG1pbiA9IHJvb20yLmdldFRvcCgpO1xyXG5cdFx0dmFyIG1heCA9IHJvb20yLmdldEJvdHRvbSgpO1xyXG5cdFx0dmFyIGluZGV4ID0gMTtcclxuXHR9XHJcblxyXG5cdHZhciBzdGFydCA9IHRoaXMuX3BsYWNlSW5XYWxsKHJvb20xLCBkaXJJbmRleDEpOyAvKiBjb3JyaWRvciB3aWxsIHN0YXJ0IGhlcmUgKi9cclxuXHRpZiAoIXN0YXJ0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuXHRpZiAoc3RhcnRbaW5kZXhdID49IG1pbiAmJiBzdGFydFtpbmRleF0gPD0gbWF4KSB7IC8qIHBvc3NpYmxlIHRvIGNvbm5lY3Qgd2l0aCBzdHJhaWdodCBsaW5lIChJLWxpa2UpICovXHJcblx0XHR2YXIgZW5kID0gc3RhcnQuc2xpY2UoKTtcclxuXHRcdHZhciB2YWx1ZSA9IG51bGw7XHJcblx0XHRzd2l0Y2ggKGRpckluZGV4Mikge1xyXG5cdFx0XHRjYXNlIDA6IHZhbHVlID0gcm9vbTIuZ2V0VG9wKCktMTsgYnJlYWs7XHJcblx0XHRcdGNhc2UgMTogdmFsdWUgPSByb29tMi5nZXRSaWdodCgpKzE7IGJyZWFrO1xyXG5cdFx0XHRjYXNlIDI6IHZhbHVlID0gcm9vbTIuZ2V0Qm90dG9tKCkrMTsgYnJlYWs7XHJcblx0XHRcdGNhc2UgMzogdmFsdWUgPSByb29tMi5nZXRMZWZ0KCktMTsgYnJlYWs7XHJcblx0XHR9XHJcblx0XHRlbmRbKGluZGV4KzEpJTJdID0gdmFsdWU7XHJcblx0XHR0aGlzLl9kaWdMaW5lKFtzdGFydCwgZW5kXSk7XHJcblx0XHRcclxuXHR9IGVsc2UgaWYgKHN0YXJ0W2luZGV4XSA8IG1pbi0xIHx8IHN0YXJ0W2luZGV4XSA+IG1heCsxKSB7IC8qIG5lZWQgdG8gc3dpdGNoIHRhcmdldCB3YWxsIChMLWxpa2UpICovXHJcblxyXG5cdFx0dmFyIGRpZmYgPSBzdGFydFtpbmRleF0gLSBjZW50ZXIyW2luZGV4XTtcclxuXHRcdHN3aXRjaCAoZGlySW5kZXgyKSB7XHJcblx0XHRcdGNhc2UgMDpcclxuXHRcdFx0Y2FzZSAxOlx0dmFyIHJvdGF0aW9uID0gKGRpZmYgPCAwID8gMyA6IDEpOyBicmVhaztcclxuXHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRjYXNlIDM6XHR2YXIgcm90YXRpb24gPSAoZGlmZiA8IDAgPyAxIDogMyk7IGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0ZGlySW5kZXgyID0gKGRpckluZGV4MiArIHJvdGF0aW9uKSAlIDQ7XHJcblx0XHRcclxuXHRcdHZhciBlbmQgPSB0aGlzLl9wbGFjZUluV2FsbChyb29tMiwgZGlySW5kZXgyKTtcclxuXHRcdGlmICghZW5kKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuXHRcdHZhciBtaWQgPSBbMCwgMF07XHJcblx0XHRtaWRbaW5kZXhdID0gc3RhcnRbaW5kZXhdO1xyXG5cdFx0dmFyIGluZGV4MiA9IChpbmRleCsxKSUyO1xyXG5cdFx0bWlkW2luZGV4Ml0gPSBlbmRbaW5kZXgyXTtcclxuXHRcdHRoaXMuX2RpZ0xpbmUoW3N0YXJ0LCBtaWQsIGVuZF0pO1xyXG5cdFx0XHJcblx0fSBlbHNlIHsgLyogdXNlIGN1cnJlbnQgd2FsbCBwYWlyLCBidXQgYWRqdXN0IHRoZSBsaW5lIGluIHRoZSBtaWRkbGUgKFMtbGlrZSkgKi9cclxuXHRcclxuXHRcdHZhciBpbmRleDIgPSAoaW5kZXgrMSklMjtcclxuXHRcdHZhciBlbmQgPSB0aGlzLl9wbGFjZUluV2FsbChyb29tMiwgZGlySW5kZXgyKTtcclxuXHRcdGlmICghZW5kKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0dmFyIG1pZCA9IE1hdGgucm91bmQoKGVuZFtpbmRleDJdICsgc3RhcnRbaW5kZXgyXSkvMik7XHJcblxyXG5cdFx0dmFyIG1pZDEgPSBbMCwgMF07XHJcblx0XHR2YXIgbWlkMiA9IFswLCAwXTtcclxuXHRcdG1pZDFbaW5kZXhdID0gc3RhcnRbaW5kZXhdO1xyXG5cdFx0bWlkMVtpbmRleDJdID0gbWlkO1xyXG5cdFx0bWlkMltpbmRleF0gPSBlbmRbaW5kZXhdO1xyXG5cdFx0bWlkMltpbmRleDJdID0gbWlkO1xyXG5cdFx0dGhpcy5fZGlnTGluZShbc3RhcnQsIG1pZDEsIG1pZDIsIGVuZF0pO1xyXG5cdH1cclxuXHJcblx0cm9vbTEuYWRkRG9vcihzdGFydFswXSwgc3RhcnRbMV0pO1xyXG5cdHJvb20yLmFkZERvb3IoZW5kWzBdLCBlbmRbMV0pO1xyXG5cdFxyXG5cdHZhciBpbmRleCA9IHRoaXMuX3VuY29ubmVjdGVkLmluZGV4T2Yocm9vbTEpO1xyXG5cdGlmIChpbmRleCAhPSAtMSkge1xyXG5cdFx0dGhpcy5fdW5jb25uZWN0ZWQuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdHRoaXMuX2Nvbm5lY3RlZC5wdXNoKHJvb20xKTtcclxuXHR9XHJcblxyXG5cdHZhciBpbmRleCA9IHRoaXMuX3VuY29ubmVjdGVkLmluZGV4T2Yocm9vbTIpO1xyXG5cdGlmIChpbmRleCAhPSAtMSkge1xyXG5cdFx0dGhpcy5fdW5jb25uZWN0ZWQuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdHRoaXMuX2Nvbm5lY3RlZC5wdXNoKHJvb20yKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9wbGFjZUluV2FsbCA9IGZ1bmN0aW9uKHJvb20sIGRpckluZGV4KSB7XHJcblx0dmFyIHN0YXJ0ID0gWzAsIDBdO1xyXG5cdHZhciBkaXIgPSBbMCwgMF07XHJcblx0dmFyIGxlbmd0aCA9IDA7XHJcblx0XHJcblx0c3dpdGNoIChkaXJJbmRleCkge1xyXG5cdFx0Y2FzZSAwOlxyXG5cdFx0XHRkaXIgPSBbMSwgMF07XHJcblx0XHRcdHN0YXJ0ID0gW3Jvb20uZ2V0TGVmdCgpLCByb29tLmdldFRvcCgpLTFdO1xyXG5cdFx0XHRsZW5ndGggPSByb29tLmdldFJpZ2h0KCktcm9vbS5nZXRMZWZ0KCkrMTtcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAxOlxyXG5cdFx0XHRkaXIgPSBbMCwgMV07XHJcblx0XHRcdHN0YXJ0ID0gW3Jvb20uZ2V0UmlnaHQoKSsxLCByb29tLmdldFRvcCgpXTtcclxuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRCb3R0b20oKS1yb29tLmdldFRvcCgpKzE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMjpcclxuXHRcdFx0ZGlyID0gWzEsIDBdO1xyXG5cdFx0XHRzdGFydCA9IFtyb29tLmdldExlZnQoKSwgcm9vbS5nZXRCb3R0b20oKSsxXTtcclxuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRSaWdodCgpLXJvb20uZ2V0TGVmdCgpKzE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMzpcclxuXHRcdFx0ZGlyID0gWzAsIDFdO1xyXG5cdFx0XHRzdGFydCA9IFtyb29tLmdldExlZnQoKS0xLCByb29tLmdldFRvcCgpXTtcclxuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRCb3R0b20oKS1yb29tLmdldFRvcCgpKzE7XHJcblx0XHRicmVhaztcclxuXHR9XHJcblx0XHJcblx0dmFyIGF2YWlsID0gW107XHJcblx0dmFyIGxhc3RCYWRJbmRleCA9IC0yO1xyXG5cclxuXHRmb3IgKHZhciBpPTA7aTxsZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgeCA9IHN0YXJ0WzBdICsgaSpkaXJbMF07XHJcblx0XHR2YXIgeSA9IHN0YXJ0WzFdICsgaSpkaXJbMV07XHJcblx0XHRhdmFpbC5wdXNoKG51bGwpO1xyXG5cdFx0XHJcblx0XHR2YXIgaXNXYWxsID0gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcclxuXHRcdGlmIChpc1dhbGwpIHtcclxuXHRcdFx0aWYgKGxhc3RCYWRJbmRleCAhPSBpLTEpIHsgYXZhaWxbaV0gPSBbeCwgeV07IH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxhc3RCYWRJbmRleCA9IGk7XHJcblx0XHRcdGlmIChpKSB7IGF2YWlsW2ktMV0gPSBudWxsOyB9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9YXZhaWwubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xyXG5cdFx0aWYgKCFhdmFpbFtpXSkgeyBhdmFpbC5zcGxpY2UoaSwgMSk7IH1cclxuXHR9XHJcblx0cmV0dXJuIChhdmFpbC5sZW5ndGggPyBhdmFpbC5yYW5kb20oKSA6IG51bGwpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERpZyBhIHBvbHlsaW5lLlxyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZGlnTGluZSA9IGZ1bmN0aW9uKHBvaW50cykge1xyXG5cdGZvciAodmFyIGk9MTtpPHBvaW50cy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgc3RhcnQgPSBwb2ludHNbaS0xXTtcclxuXHRcdHZhciBlbmQgPSBwb2ludHNbaV07XHJcblx0XHR2YXIgY29ycmlkb3IgPSBuZXcgUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yKHN0YXJ0WzBdLCBzdGFydFsxXSwgZW5kWzBdLCBlbmRbMV0pO1xyXG5cdFx0Y29ycmlkb3IuY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcclxuXHRcdHRoaXMuX2NvcnJpZG9ycy5wdXNoKGNvcnJpZG9yKTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9kaWdDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHksIHZhbHVlKSB7XHJcblx0dGhpcy5fbWFwW3hdW3ldID0gdmFsdWU7XHJcblx0aWYgKHZhbHVlID09IDApIHsgdGhpcy5fZHVnKys7IH1cclxufTtcclxuXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2lzV2FsbENhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX3dpZHRoIHx8IHkgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fY2FuQmVEdWdDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRpZiAoeCA8IDEgfHwgeSA8IDEgfHwgeCsxID49IHRoaXMuX3dpZHRoIHx8IHkrMSA+PSB0aGlzLl9oZWlnaHQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0cmV0dXJuICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQGF1dGhvciBoeWFrdWdlaVxyXG4gKiBAY2xhc3MgRHVuZ2VvbiBnZW5lcmF0b3Igd2hpY2ggdXNlcyB0aGUgXCJvcmdpbmFsXCIgUm9ndWUgZHVuZ2VvbiBnZW5lcmF0aW9uIGFsZ29yaXRobS4gU2VlIGh0dHA6Ly9rdW9pLmNvbS9+a2FtaWthemUvR2FtZURlc2lnbi9hcnQwN19yb2d1ZV9kdW5nZW9uLnBocFxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKiBAcGFyYW0ge2ludH0gW3dpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxyXG4gKiBAcGFyYW0ge2ludH0gW2hlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gT3B0aW9uc1xyXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5jZWxsV2lkdGg9M10gTnVtYmVyIG9mIGNlbGxzIHRvIGNyZWF0ZSBvbiB0aGUgaG9yaXpvbnRhbCAobnVtYmVyIG9mIHJvb21zIGhvcml6b250YWxseSlcclxuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuY2VsbEhlaWdodD0zXSBOdW1iZXIgb2YgY2VsbHMgdG8gY3JlYXRlIG9uIHRoZSB2ZXJ0aWNhbCAobnVtYmVyIG9mIHJvb21zIHZlcnRpY2FsbHkpXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5yb29tV2lkdGhdIFJvb20gbWluIGFuZCBtYXggd2lkdGggLSBub3JtYWxseSBzZXQgYXV0by1tYWdpY2FsbHkgdmlhIHRoZSBjb25zdHJ1Y3Rvci5cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnJvb21IZWlnaHRdIFJvb20gbWluIGFuZCBtYXggaGVpZ2h0IC0gbm9ybWFsbHkgc2V0IGF1dG8tbWFnaWNhbGx5IHZpYSB0aGUgY29uc3RydWN0b3IuXHJcbiAqL1xyXG5ST1QuTWFwLlJvZ3VlID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblxyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRjZWxsV2lkdGg6IDMsICAvLyBOT1RFIHRvIHNlbGYsIHRoZXNlIGNvdWxkIHByb2JhYmx5IHdvcmsgdGhlIHNhbWUgYXMgdGhlIHJvb21XaWR0aC9yb29tIEhlaWdodCB2YWx1ZXNcclxuXHRcdGNlbGxIZWlnaHQ6IDMgIC8vICAgICBpZS4gYXMgYW4gYXJyYXkgd2l0aCBtaW4tbWF4IHZhbHVlcyBmb3IgZWFjaCBkaXJlY3Rpb24uLi4uXHJcblx0fTtcclxuXHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblxyXG5cdC8qXHJcblx0U2V0IHRoZSByb29tIHNpemVzIGFjY29yZGluZyB0byB0aGUgb3Zlci1hbGwgd2lkdGggb2YgdGhlIG1hcCxcclxuXHRhbmQgdGhlIGNlbGwgc2l6ZXMuXHJcblx0Ki9cclxuXHRpZiAoIXRoaXMuX29wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJyb29tV2lkdGhcIikpIHtcclxuXHRcdHRoaXMuX29wdGlvbnNbXCJyb29tV2lkdGhcIl0gPSB0aGlzLl9jYWxjdWxhdGVSb29tU2l6ZSh0aGlzLl93aWR0aCwgdGhpcy5fb3B0aW9uc1tcImNlbGxXaWR0aFwiXSk7XHJcblx0fVxyXG5cdGlmICghdGhpcy5fb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcInJvb21IZWlnaHRcIikpIHtcclxuXHRcdHRoaXMuX29wdGlvbnNbXCJyb29tSGVpZ2h0XCJdID0gdGhpcy5fY2FsY3VsYXRlUm9vbVNpemUodGhpcy5faGVpZ2h0LCB0aGlzLl9vcHRpb25zW1wiY2VsbEhlaWdodFwiXSk7XHJcblx0fVxyXG5cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULk1hcCNjcmVhdGVcclxuICovXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG5cdHRoaXMubWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcclxuXHR0aGlzLnJvb21zID0gW107XHJcblx0dGhpcy5jb25uZWN0ZWRDZWxscyA9IFtdO1xyXG5cclxuXHR0aGlzLl9pbml0Um9vbXMoKTtcclxuXHR0aGlzLl9jb25uZWN0Um9vbXMoKTtcclxuXHR0aGlzLl9jb25uZWN0VW5jb25uZWN0ZWRSb29tcygpO1xyXG5cdHRoaXMuX2NyZWF0ZVJhbmRvbVJvb21Db25uZWN0aW9ucygpO1xyXG5cdHRoaXMuX2NyZWF0ZVJvb21zKCk7XHJcblx0dGhpcy5fY3JlYXRlQ29ycmlkb3JzKCk7XHJcblxyXG5cdGlmIChjYWxsYmFjaykge1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl93aWR0aDsgaSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5faGVpZ2h0OyBqKyspIHtcclxuXHRcdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLm1hcFtpXVtqXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2NhbGN1bGF0ZVJvb21TaXplID0gZnVuY3Rpb24gKHNpemUsIGNlbGwpIHtcclxuXHR2YXIgbWF4ID0gTWF0aC5mbG9vcigoc2l6ZS9jZWxsKSAqIDAuOCk7XHJcblx0dmFyIG1pbiA9IE1hdGguZmxvb3IoKHNpemUvY2VsbCkgKiAwLjI1KTtcclxuXHRpZiAobWluIDwgMikgeyBtaW4gPSAyOyB9XHJcblx0aWYgKG1heCA8IDIpIHsgbWF4ID0gMjsgfVxyXG5cdHJldHVybiBbbWluLCBtYXhdO1xyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2luaXRSb29tcyA9IGZ1bmN0aW9uICgpIHtcclxuXHQvLyBjcmVhdGUgcm9vbXMgYXJyYXkuIFRoaXMgaXMgdGhlIFwiZ3JpZFwiIGxpc3QgZnJvbSB0aGUgYWxnby5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoOyBpKyspIHtcclxuXHRcdHRoaXMucm9vbXMucHVzaChbXSk7XHJcblx0XHRmb3IodmFyIGogPSAwOyBqIDwgdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0OyBqKyspIHtcclxuXHRcdFx0dGhpcy5yb29tc1tpXS5wdXNoKHtcInhcIjowLCBcInlcIjowLCBcIndpZHRoXCI6MCwgXCJoZWlnaHRcIjowLCBcImNvbm5lY3Rpb25zXCI6W10sIFwiY2VsbHhcIjppLCBcImNlbGx5XCI6an0pO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jb25uZWN0Um9vbXMgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly9waWNrIHJhbmRvbSBzdGFydGluZyBncmlkXHJcblx0dmFyIGNneCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludCgwLCB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aC0xKTtcclxuXHR2YXIgY2d5ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodC0xKTtcclxuXHJcblx0dmFyIGlkeDtcclxuXHR2YXIgbmNneDtcclxuXHR2YXIgbmNneTtcclxuXHJcblx0dmFyIGZvdW5kID0gZmFsc2U7XHJcblx0dmFyIHJvb207XHJcblx0dmFyIG90aGVyUm9vbTtcclxuXHJcblx0Ly8gZmluZCAgdW5jb25uZWN0ZWQgbmVpZ2hib3VyIGNlbGxzXHJcblx0ZG8ge1xyXG5cclxuXHRcdC8vdmFyIGRpclRvQ2hlY2sgPSBbMCwgMSwgMiwgMywgNCwgNSwgNiwgN107XHJcblx0XHR2YXIgZGlyVG9DaGVjayA9IFswLCAyLCA0LCA2XTtcclxuXHRcdGRpclRvQ2hlY2sgPSBkaXJUb0NoZWNrLnJhbmRvbWl6ZSgpO1xyXG5cclxuXHRcdGRvIHtcclxuXHRcdFx0Zm91bmQgPSBmYWxzZTtcclxuXHRcdFx0aWR4ID0gZGlyVG9DaGVjay5wb3AoKTtcclxuXHJcblx0XHRcdG5jZ3ggPSBjZ3ggKyBST1QuRElSU1s4XVtpZHhdWzBdO1xyXG5cdFx0XHRuY2d5ID0gY2d5ICsgUk9ULkRJUlNbOF1baWR4XVsxXTtcclxuXHJcblx0XHRcdGlmIChuY2d4IDwgMCB8fCBuY2d4ID49IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRcdGlmIChuY2d5IDwgMCB8fCBuY2d5ID49IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodCkgeyBjb250aW51ZTsgfVxyXG5cclxuXHRcdFx0cm9vbSA9IHRoaXMucm9vbXNbY2d4XVtjZ3ldO1xyXG5cclxuXHRcdFx0aWYgKHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Ly8gYXMgbG9uZyBhcyB0aGlzIHJvb20gZG9lc24ndCBhbHJlYWR5IGNvb25lY3QgdG8gbWUsIHdlIGFyZSBvayB3aXRoIGl0LlxyXG5cdFx0XHRcdGlmIChyb29tW1wiY29ubmVjdGlvbnNcIl1bMF1bMF0gPT0gbmNneCAmJiByb29tW1wiY29ubmVjdGlvbnNcIl1bMF1bMV0gPT0gbmNneSkge1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRvdGhlclJvb20gPSB0aGlzLnJvb21zW25jZ3hdW25jZ3ldO1xyXG5cclxuXHRcdFx0aWYgKG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0b3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl0ucHVzaChbY2d4LCBjZ3ldKTtcclxuXHJcblx0XHRcdFx0dGhpcy5jb25uZWN0ZWRDZWxscy5wdXNoKFtuY2d4LCBuY2d5XSk7XHJcblx0XHRcdFx0Y2d4ID0gbmNneDtcclxuXHRcdFx0XHRjZ3kgPSBuY2d5O1xyXG5cdFx0XHRcdGZvdW5kID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gd2hpbGUgKGRpclRvQ2hlY2subGVuZ3RoID4gMCAmJiBmb3VuZCA9PSBmYWxzZSk7XHJcblxyXG5cdH0gd2hpbGUgKGRpclRvQ2hlY2subGVuZ3RoID4gMCk7XHJcblxyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2Nvbm5lY3RVbmNvbm5lY3RlZFJvb21zID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vV2hpbGUgdGhlcmUgYXJlIHVuY29ubmVjdGVkIHJvb21zLCB0cnkgdG8gY29ubmVjdCB0aGVtIHRvIGEgcmFuZG9tIGNvbm5lY3RlZCBuZWlnaGJvclxyXG5cdC8vKGlmIGEgcm9vbSBoYXMgbm8gY29ubmVjdGVkIG5laWdoYm9ycyB5ZXQsIGp1c3Qga2VlcCBjeWNsaW5nLCB5b3UnbGwgZmlsbCBvdXQgdG8gaXQgZXZlbnR1YWxseSkuXHJcblx0dmFyIGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XHJcblx0dmFyIGNoID0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0O1xyXG5cclxuXHR0aGlzLmNvbm5lY3RlZENlbGxzID0gdGhpcy5jb25uZWN0ZWRDZWxscy5yYW5kb21pemUoKTtcclxuXHR2YXIgcm9vbTtcclxuXHR2YXIgb3RoZXJSb29tO1xyXG5cdHZhciB2YWxpZFJvb207XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7IGkrKykge1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7IGorKykgIHtcclxuXHJcblx0XHRcdHJvb20gPSB0aGlzLnJvb21zW2ldW2pdO1xyXG5cclxuXHRcdFx0aWYgKHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdHZhciBkaXJlY3Rpb25zID0gWzAsIDIsIDQsIDZdO1xyXG5cdFx0XHRcdGRpcmVjdGlvbnMgPSBkaXJlY3Rpb25zLnJhbmRvbWl6ZSgpO1xyXG5cclxuXHRcdFx0XHR2YWxpZFJvb20gPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0ZG8ge1xyXG5cclxuXHRcdFx0XHRcdHZhciBkaXJJZHggPSBkaXJlY3Rpb25zLnBvcCgpO1xyXG5cdFx0XHRcdFx0dmFyIG5ld0kgPSBpICsgUk9ULkRJUlNbOF1bZGlySWR4XVswXTtcclxuXHRcdFx0XHRcdHZhciBuZXdKID0gaiArIFJPVC5ESVJTWzhdW2RpcklkeF1bMV07XHJcblxyXG5cdFx0XHRcdFx0aWYgKG5ld0kgPCAwIHx8IG5ld0kgPj0gY3cgfHwgbmV3SiA8IDAgfHwgbmV3SiA+PSBjaCkgeyBjb250aW51ZTsgfVxyXG5cclxuXHRcdFx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbbmV3SV1bbmV3Sl07XHJcblxyXG5cdFx0XHRcdFx0dmFsaWRSb29tID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0XHRpZiAob3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID09IDApIHsgYnJlYWs7IH1cclxuXHJcblx0XHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aDsgaysrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXVtrXVswXSA9PSBpICYmIG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdW2tdWzFdID09IGopIHtcclxuXHRcdFx0XHRcdFx0XHR2YWxpZFJvb20gPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICh2YWxpZFJvb20pIHsgYnJlYWs7IH1cclxuXHJcblx0XHRcdFx0fSB3aGlsZSAoZGlyZWN0aW9ucy5sZW5ndGgpO1xyXG5cclxuXHRcdFx0XHRpZiAodmFsaWRSb29tKSB7XHJcblx0XHRcdFx0XHRyb29tW1wiY29ubmVjdGlvbnNcIl0ucHVzaChbb3RoZXJSb29tW1wiY2VsbHhcIl0sIG90aGVyUm9vbVtcImNlbGx5XCJdXSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiLS0gVW5hYmxlIHRvIGNvbm5lY3Qgcm9vbS5cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2NyZWF0ZVJhbmRvbVJvb21Db25uZWN0aW9ucyA9IGZ1bmN0aW9uIChjb25uZWN0aW9ucykge1xyXG5cdC8vIEVtcHR5IGZvciBub3cuXHJcbn07XHJcblxyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2NyZWF0ZVJvb21zID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vIENyZWF0ZSBSb29tc1xyXG5cclxuXHR2YXIgdyA9IHRoaXMuX3dpZHRoO1xyXG5cdHZhciBoID0gdGhpcy5faGVpZ2h0O1xyXG5cclxuXHR2YXIgY3cgPSB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDtcclxuXHR2YXIgY2ggPSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7XHJcblxyXG5cdHZhciBjd3AgPSBNYXRoLmZsb29yKHRoaXMuX3dpZHRoIC8gY3cpO1xyXG5cdHZhciBjaHAgPSBNYXRoLmZsb29yKHRoaXMuX2hlaWdodCAvIGNoKTtcclxuXHJcblx0dmFyIHJvb213O1xyXG5cdHZhciByb29taDtcclxuXHR2YXIgcm9vbVdpZHRoID0gdGhpcy5fb3B0aW9uc1tcInJvb21XaWR0aFwiXTtcclxuXHR2YXIgcm9vbUhlaWdodCA9IHRoaXMuX29wdGlvbnNbXCJyb29tSGVpZ2h0XCJdO1xyXG5cdHZhciBzeDtcclxuXHR2YXIgc3k7XHJcblx0dmFyIG90aGVyUm9vbTtcclxuXHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjdzsgaSsrKSB7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNoOyBqKyspIHtcclxuXHRcdFx0c3ggPSBjd3AgKiBpO1xyXG5cdFx0XHRzeSA9IGNocCAqIGo7XHJcblxyXG5cdFx0XHRpZiAoc3ggPT0gMCkgeyBzeCA9IDE7IH1cclxuXHRcdFx0aWYgKHN5ID09IDApIHsgc3kgPSAxOyB9XHJcblxyXG5cdFx0XHRyb29tdyA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChyb29tV2lkdGhbMF0sIHJvb21XaWR0aFsxXSk7XHJcblx0XHRcdHJvb21oID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KHJvb21IZWlnaHRbMF0sIHJvb21IZWlnaHRbMV0pO1xyXG5cclxuXHRcdFx0aWYgKGogPiAwKSB7XHJcblx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tpXVtqLTFdO1xyXG5cdFx0XHRcdHdoaWxlIChzeSAtIChvdGhlclJvb21bXCJ5XCJdICsgb3RoZXJSb29tW1wiaGVpZ2h0XCJdICkgPCAzKSB7XHJcblx0XHRcdFx0XHRzeSsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGkgPiAwKSB7XHJcblx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tpLTFdW2pdO1xyXG5cdFx0XHRcdHdoaWxlKHN4IC0gKG90aGVyUm9vbVtcInhcIl0gKyBvdGhlclJvb21bXCJ3aWR0aFwiXSkgPCAzKSB7XHJcblx0XHRcdFx0XHRzeCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHN4T2Zmc2V0ID0gTWF0aC5yb3VuZChST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgY3dwLXJvb213KS8yKTtcclxuXHRcdFx0dmFyIHN5T2Zmc2V0ID0gTWF0aC5yb3VuZChST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgY2hwLXJvb21oKS8yKTtcclxuXHJcblx0XHRcdHdoaWxlIChzeCArIHN4T2Zmc2V0ICsgcm9vbXcgPj0gdykge1xyXG5cdFx0XHRcdGlmKHN4T2Zmc2V0KSB7XHJcblx0XHRcdFx0XHRzeE9mZnNldC0tO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyb29tdy0tO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0d2hpbGUgKHN5ICsgc3lPZmZzZXQgKyByb29taCA+PSBoKSB7XHJcblx0XHRcdFx0aWYoc3lPZmZzZXQpIHtcclxuXHRcdFx0XHRcdHN5T2Zmc2V0LS07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJvb21oLS07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzeCA9IHN4ICsgc3hPZmZzZXQ7XHJcblx0XHRcdHN5ID0gc3kgKyBzeU9mZnNldDtcclxuXHJcblx0XHRcdHRoaXMucm9vbXNbaV1bal1bXCJ4XCJdID0gc3g7XHJcblx0XHRcdHRoaXMucm9vbXNbaV1bal1bXCJ5XCJdID0gc3k7XHJcblx0XHRcdHRoaXMucm9vbXNbaV1bal1bXCJ3aWR0aFwiXSA9IHJvb213O1xyXG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wiaGVpZ2h0XCJdID0gcm9vbWg7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpaSA9IHN4OyBpaSA8IHN4ICsgcm9vbXc7IGlpKyspIHtcclxuXHRcdFx0XHRmb3IgKHZhciBqaiA9IHN5OyBqaiA8IHN5ICsgcm9vbWg7IGpqKyspIHtcclxuXHRcdFx0XHRcdHRoaXMubWFwW2lpXVtqal0gPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9nZXRXYWxsUG9zaXRpb24gPSBmdW5jdGlvbiAoYVJvb20sIGFEaXJlY3Rpb24pIHtcclxuXHR2YXIgcng7XHJcblx0dmFyIHJ5O1xyXG5cdHZhciBkb29yO1xyXG5cclxuXHRpZiAoYURpcmVjdGlvbiA9PSAxIHx8IGFEaXJlY3Rpb24gPT0gMykge1xyXG5cdFx0cnggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQoYVJvb21bXCJ4XCJdICsgMSwgYVJvb21bXCJ4XCJdICsgYVJvb21bXCJ3aWR0aFwiXSAtIDIpO1xyXG5cdFx0aWYgKGFEaXJlY3Rpb24gPT0gMSkge1xyXG5cdFx0XHRyeSA9IGFSb29tW1wieVwiXSAtIDI7XHJcblx0XHRcdGRvb3IgPSByeSArIDE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyeSA9IGFSb29tW1wieVwiXSArIGFSb29tW1wiaGVpZ2h0XCJdICsgMTtcclxuXHRcdFx0ZG9vciA9IHJ5IC0xO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubWFwW3J4XVtkb29yXSA9IDA7IC8vIGknbSBub3Qgc2V0dGluZyBhIHNwZWNpZmljICdkb29yJyB0aWxlIHZhbHVlIHJpZ2h0IG5vdywganVzdCBlbXB0eSBzcGFjZS5cclxuXHJcblx0fSBlbHNlIGlmIChhRGlyZWN0aW9uID09IDIgfHwgYURpcmVjdGlvbiA9PSA0KSB7XHJcblx0XHRyeSA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChhUm9vbVtcInlcIl0gKyAxLCBhUm9vbVtcInlcIl0gKyBhUm9vbVtcImhlaWdodFwiXSAtIDIpO1xyXG5cdFx0aWYoYURpcmVjdGlvbiA9PSAyKSB7XHJcblx0XHRcdHJ4ID0gYVJvb21bXCJ4XCJdICsgYVJvb21bXCJ3aWR0aFwiXSArIDE7XHJcblx0XHRcdGRvb3IgPSByeCAtIDE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyeCA9IGFSb29tW1wieFwiXSAtIDI7XHJcblx0XHRcdGRvb3IgPSByeCArIDE7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5tYXBbZG9vcl1bcnldID0gMDsgLy8gaSdtIG5vdCBzZXR0aW5nIGEgc3BlY2lmaWMgJ2Rvb3InIHRpbGUgdmFsdWUgcmlnaHQgbm93LCBqdXN0IGVtcHR5IHNwYWNlLlxyXG5cclxuXHR9XHJcblx0cmV0dXJuIFtyeCwgcnldO1xyXG59O1xyXG5cclxuLyoqKlxyXG4qIEBwYXJhbSBzdGFydFBvc2l0aW9uIGEgMiBlbGVtZW50IGFycmF5XHJcbiogQHBhcmFtIGVuZFBvc2l0aW9uIGEgMiBlbGVtZW50IGFycmF5XHJcbiovXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9kcmF3Q29ycmlkb3IgPSBmdW5jdGlvbiAoc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24pIHtcclxuXHR2YXIgeE9mZnNldCA9IGVuZFBvc2l0aW9uWzBdIC0gc3RhcnRQb3NpdGlvblswXTtcclxuXHR2YXIgeU9mZnNldCA9IGVuZFBvc2l0aW9uWzFdIC0gc3RhcnRQb3NpdGlvblsxXTtcclxuXHJcblx0dmFyIHhwb3MgPSBzdGFydFBvc2l0aW9uWzBdO1xyXG5cdHZhciB5cG9zID0gc3RhcnRQb3NpdGlvblsxXTtcclxuXHJcblx0dmFyIHRlbXBEaXN0O1xyXG5cdHZhciB4RGlyO1xyXG5cdHZhciB5RGlyO1xyXG5cclxuXHR2YXIgbW92ZTsgLy8gMiBlbGVtZW50IGFycmF5LCBlbGVtZW50IDAgaXMgdGhlIGRpcmVjdGlvbiwgZWxlbWVudCAxIGlzIHRoZSB0b3RhbCB2YWx1ZSB0byBtb3ZlLlxyXG5cdHZhciBtb3ZlcyA9IFtdOyAvLyBhIGxpc3Qgb2YgMiBlbGVtZW50IGFycmF5c1xyXG5cclxuXHR2YXIgeEFicyA9IE1hdGguYWJzKHhPZmZzZXQpO1xyXG5cdHZhciB5QWJzID0gTWF0aC5hYnMoeU9mZnNldCk7XHJcblxyXG5cdHZhciBwZXJjZW50ID0gUk9ULlJORy5nZXRVbmlmb3JtKCk7IC8vIHVzZWQgdG8gc3BsaXQgdGhlIG1vdmUgYXQgZGlmZmVyZW50IHBsYWNlcyBhbG9uZyB0aGUgbG9uZyBheGlzXHJcblx0dmFyIGZpcnN0SGFsZiA9IHBlcmNlbnQ7XHJcblx0dmFyIHNlY29uZEhhbGYgPSAxIC0gcGVyY2VudDtcclxuXHJcblx0eERpciA9IHhPZmZzZXQgPiAwID8gMiA6IDY7XHJcblx0eURpciA9IHlPZmZzZXQgPiAwID8gNCA6IDA7XHJcblxyXG5cdGlmICh4QWJzIDwgeUFicykge1xyXG5cdFx0Ly8gbW92ZSBmaXJzdEhhbGYgb2YgdGhlIHkgb2Zmc2V0XHJcblx0XHR0ZW1wRGlzdCA9IE1hdGguY2VpbCh5QWJzICogZmlyc3RIYWxmKTtcclxuXHRcdG1vdmVzLnB1c2goW3lEaXIsIHRlbXBEaXN0XSk7XHJcblx0XHQvLyBtb3ZlIGFsbCB0aGUgeCBvZmZzZXRcclxuXHRcdG1vdmVzLnB1c2goW3hEaXIsIHhBYnNdKTtcclxuXHRcdC8vIG1vdmUgc2VuZEhhbGYgb2YgdGhlICB5IG9mZnNldFxyXG5cdFx0dGVtcERpc3QgPSBNYXRoLmZsb29yKHlBYnMgKiBzZWNvbmRIYWxmKTtcclxuXHRcdG1vdmVzLnB1c2goW3lEaXIsIHRlbXBEaXN0XSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdC8vICBtb3ZlIGZpcnN0SGFsZiBvZiB0aGUgeCBvZmZzZXRcclxuXHRcdHRlbXBEaXN0ID0gTWF0aC5jZWlsKHhBYnMgKiBmaXJzdEhhbGYpO1xyXG5cdFx0bW92ZXMucHVzaChbeERpciwgdGVtcERpc3RdKTtcclxuXHRcdC8vIG1vdmUgYWxsIHRoZSB5IG9mZnNldFxyXG5cdFx0bW92ZXMucHVzaChbeURpciwgeUFic10pO1xyXG5cdFx0Ly8gbW92ZSBzZWNvbmRIYWxmIG9mIHRoZSB4IG9mZnNldC5cclxuXHRcdHRlbXBEaXN0ID0gTWF0aC5mbG9vcih4QWJzICogc2Vjb25kSGFsZik7XHJcblx0XHRtb3Zlcy5wdXNoKFt4RGlyLCB0ZW1wRGlzdF0pO1xyXG5cdH1cclxuXHJcblx0dGhpcy5tYXBbeHBvc11beXBvc10gPSAwO1xyXG5cclxuXHR3aGlsZSAobW92ZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0bW92ZSA9IG1vdmVzLnBvcCgpO1xyXG5cdFx0d2hpbGUgKG1vdmVbMV0gPiAwKSB7XHJcblx0XHRcdHhwb3MgKz0gUk9ULkRJUlNbOF1bbW92ZVswXV1bMF07XHJcblx0XHRcdHlwb3MgKz0gUk9ULkRJUlNbOF1bbW92ZVswXV1bMV07XHJcblx0XHRcdHRoaXMubWFwW3hwb3NdW3lwb3NdID0gMDtcclxuXHRcdFx0bW92ZVsxXSA9IG1vdmVbMV0gLSAxO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jcmVhdGVDb3JyaWRvcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly8gRHJhdyBDb3JyaWRvcnMgYmV0d2VlbiBjb25uZWN0ZWQgcm9vbXNcclxuXHJcblx0dmFyIGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XHJcblx0dmFyIGNoID0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0O1xyXG5cdHZhciByb29tO1xyXG5cdHZhciBjb25uZWN0aW9uO1xyXG5cdHZhciBvdGhlclJvb207XHJcblx0dmFyIHdhbGw7XHJcblx0dmFyIG90aGVyV2FsbDtcclxuXHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjdzsgaSsrKSB7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNoOyBqKyspIHtcclxuXHRcdFx0cm9vbSA9IHRoaXMucm9vbXNbaV1bal07XHJcblxyXG5cdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGg7IGsrKykge1xyXG5cclxuXHRcdFx0XHRjb25uZWN0aW9uID0gcm9vbVtcImNvbm5lY3Rpb25zXCJdW2tdO1xyXG5cclxuXHRcdFx0XHRvdGhlclJvb20gPSB0aGlzLnJvb21zW2Nvbm5lY3Rpb25bMF1dW2Nvbm5lY3Rpb25bMV1dO1xyXG5cclxuXHRcdFx0XHQvLyBmaWd1cmUgb3V0IHdoYXQgd2FsbCBvdXIgY29ycmlkb3Igd2lsbCBzdGFydCBvbmUuXHJcblx0XHRcdFx0Ly8gZmlndXJlIG91dCB3aGF0IHdhbGwgb3VyIGNvcnJpZG9yIHdpbGwgZW5kIG9uLlxyXG5cdFx0XHRcdGlmIChvdGhlclJvb21bXCJjZWxseFwiXSA+IHJvb21bXCJjZWxseFwiXSkge1xyXG5cdFx0XHRcdFx0d2FsbCA9IDI7XHJcblx0XHRcdFx0XHRvdGhlcldhbGwgPSA0O1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAob3RoZXJSb29tW1wiY2VsbHhcIl0gPCByb29tW1wiY2VsbHhcIl0pIHtcclxuXHRcdFx0XHRcdHdhbGwgPSA0O1xyXG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gMjtcclxuXHRcdFx0XHR9IGVsc2UgaWYob3RoZXJSb29tW1wiY2VsbHlcIl0gPiByb29tW1wiY2VsbHlcIl0pIHtcclxuXHRcdFx0XHRcdHdhbGwgPSAzO1xyXG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gMTtcclxuXHRcdFx0XHR9IGVsc2UgaWYob3RoZXJSb29tW1wiY2VsbHlcIl0gPCByb29tW1wiY2VsbHlcIl0pIHtcclxuXHRcdFx0XHRcdHdhbGwgPSAxO1xyXG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gMztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuX2RyYXdDb3JyaWRvcih0aGlzLl9nZXRXYWxsUG9zaXRpb24ocm9vbSwgd2FsbCksIHRoaXMuX2dldFdhbGxQb3NpdGlvbihvdGhlclJvb20sIG90aGVyV2FsbCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG4vKipcclxuICogQGNsYXNzIER1bmdlb24gZmVhdHVyZTsgaGFzIG93biAuY3JlYXRlKCkgbWV0aG9kXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUgPSBmdW5jdGlvbigpIHt9O1xyXG5ST1QuTWFwLkZlYXR1cmUucHJvdG90eXBlLmlzVmFsaWQgPSBmdW5jdGlvbihjYW5CZUR1Z0NhbGxiYWNrKSB7fTtcclxuUk9ULk1hcC5GZWF0dXJlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihkaWdDYWxsYmFjaykge307XHJcblJPVC5NYXAuRmVhdHVyZS5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbigpIHt9O1xyXG5ST1QuTWFwLkZlYXR1cmUuY3JlYXRlUmFuZG9tQXQgPSBmdW5jdGlvbih4LCB5LCBkeCwgZHksIG9wdGlvbnMpIHt9O1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBSb29tXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwLkZlYXR1cmVcclxuICogQHBhcmFtIHtpbnR9IHgxXHJcbiAqIEBwYXJhbSB7aW50fSB5MVxyXG4gKiBAcGFyYW0ge2ludH0geDJcclxuICogQHBhcmFtIHtpbnR9IHkyXHJcbiAqIEBwYXJhbSB7aW50fSBbZG9vclhdXHJcbiAqIEBwYXJhbSB7aW50fSBbZG9vclldXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbSA9IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyLCBkb29yWCwgZG9vclkpIHtcclxuXHR0aGlzLl94MSA9IHgxO1xyXG5cdHRoaXMuX3kxID0geTE7XHJcblx0dGhpcy5feDIgPSB4MjtcclxuXHR0aGlzLl95MiA9IHkyO1xyXG5cdHRoaXMuX2Rvb3JzID0ge307XHJcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiA0KSB7IHRoaXMuYWRkRG9vcihkb29yWCwgZG9vclkpOyB9XHJcbn07XHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLmV4dGVuZChST1QuTWFwLkZlYXR1cmUpO1xyXG5cclxuLyoqXHJcbiAqIFJvb20gb2YgcmFuZG9tIHNpemUsIHdpdGggYSBnaXZlbiBkb29ycyBhbmQgZGlyZWN0aW9uXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb21BdCA9IGZ1bmN0aW9uKHgsIHksIGR4LCBkeSwgb3B0aW9ucykge1xyXG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21XaWR0aFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tV2lkdGhbMV07XHJcblx0dmFyIHdpZHRoID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tSGVpZ2h0WzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21IZWlnaHRbMV07XHJcblx0dmFyIGhlaWdodCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0aWYgKGR4ID09IDEpIHsgLyogdG8gdGhlIHJpZ2h0ICovXHJcblx0XHR2YXIgeTIgPSB5IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIGhlaWdodCk7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoeCsxLCB5MiwgeCt3aWR0aCwgeTIraGVpZ2h0LTEsIHgsIHkpO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoZHggPT0gLTEpIHsgLyogdG8gdGhlIGxlZnQgKi9cclxuXHRcdHZhciB5MiA9IHkgLSBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogaGVpZ2h0KTtcclxuXHRcdHJldHVybiBuZXcgdGhpcyh4LXdpZHRoLCB5MiwgeC0xLCB5MitoZWlnaHQtMSwgeCwgeSk7XHJcblx0fVxyXG5cclxuXHRpZiAoZHkgPT0gMSkgeyAvKiB0byB0aGUgYm90dG9tICovXHJcblx0XHR2YXIgeDIgPSB4IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIHdpZHRoKTtcclxuXHRcdHJldHVybiBuZXcgdGhpcyh4MiwgeSsxLCB4Mit3aWR0aC0xLCB5K2hlaWdodCwgeCwgeSk7XHJcblx0fVxyXG5cclxuXHRpZiAoZHkgPT0gLTEpIHsgLyogdG8gdGhlIHRvcCAqL1xyXG5cdFx0dmFyIHgyID0geCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoeDIsIHktaGVpZ2h0LCB4Mit3aWR0aC0xLCB5LTEsIHgsIHkpO1xyXG5cdH1cclxuXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZHggb3IgZHkgbXVzdCBiZSAxIG9yIC0xXCIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJvb20gb2YgcmFuZG9tIHNpemUsIHBvc2l0aW9uZWQgYXJvdW5kIGNlbnRlciBjb29yZHNcclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbUNlbnRlciA9IGZ1bmN0aW9uKGN4LCBjeSwgb3B0aW9ucykge1xyXG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21XaWR0aFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tV2lkdGhbMV07XHJcblx0dmFyIHdpZHRoID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tSGVpZ2h0WzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21IZWlnaHRbMV07XHJcblx0dmFyIGhlaWdodCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblxyXG5cdHZhciB4MSA9IGN4IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSp3aWR0aCk7XHJcblx0dmFyIHkxID0gY3kgLSBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKmhlaWdodCk7XHJcblx0dmFyIHgyID0geDEgKyB3aWR0aCAtIDE7XHJcblx0dmFyIHkyID0geTEgKyBoZWlnaHQgLSAxO1xyXG5cclxuXHRyZXR1cm4gbmV3IHRoaXMoeDEsIHkxLCB4MiwgeTIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJvb20gb2YgcmFuZG9tIHNpemUgd2l0aGluIGEgZ2l2ZW4gZGltZW5zaW9uc1xyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQsIG9wdGlvbnMpIHtcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbVdpZHRoWzFdO1xyXG5cdHZhciB3aWR0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbUhlaWdodFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xyXG5cdHZhciBoZWlnaHQgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdHZhciBsZWZ0ID0gYXZhaWxXaWR0aCAtIHdpZHRoIC0gMTtcclxuXHR2YXIgdG9wID0gYXZhaWxIZWlnaHQgLSBoZWlnaHQgLSAxO1xyXG5cclxuXHR2YXIgeDEgPSAxICsgTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSpsZWZ0KTtcclxuXHR2YXIgeTEgPSAxICsgTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSp0b3ApO1xyXG5cdHZhciB4MiA9IHgxICsgd2lkdGggLSAxO1xyXG5cdHZhciB5MiA9IHkxICsgaGVpZ2h0IC0gMTtcclxuXHJcblx0cmV0dXJuIG5ldyB0aGlzKHgxLCB5MSwgeDIsIHkyKTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5hZGREb29yID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdHRoaXMuX2Rvb3JzW3grXCIsXCIreV0gPSAxO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259XHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0RG9vcnMgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdGZvciAodmFyIGtleSBpbiB0aGlzLl9kb29ycykge1xyXG5cdFx0dmFyIHBhcnRzID0ga2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdGNhbGxiYWNrKHBhcnNlSW50KHBhcnRzWzBdKSwgcGFyc2VJbnQocGFydHNbMV0pKTtcclxuXHR9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuY2xlYXJEb29ycyA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2Rvb3JzID0ge307XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuYWRkRG9vcnMgPSBmdW5jdGlvbihpc1dhbGxDYWxsYmFjaykge1xyXG5cdHZhciBsZWZ0ID0gdGhpcy5feDEtMTtcclxuXHR2YXIgcmlnaHQgPSB0aGlzLl94MisxO1xyXG5cdHZhciB0b3AgPSB0aGlzLl95MS0xO1xyXG5cdHZhciBib3R0b20gPSB0aGlzLl95MisxO1xyXG5cclxuXHRmb3IgKHZhciB4PWxlZnQ7IHg8PXJpZ2h0OyB4KyspIHtcclxuXHRcdGZvciAodmFyIHk9dG9wOyB5PD1ib3R0b207IHkrKykge1xyXG5cdFx0XHRpZiAoeCAhPSBsZWZ0ICYmIHggIT0gcmlnaHQgJiYgeSAhPSB0b3AgJiYgeSAhPSBib3R0b20pIHsgY29udGludWU7IH1cclxuXHRcdFx0aWYgKGlzV2FsbENhbGxiYWNrKHgsIHkpKSB7IGNvbnRpbnVlOyB9XHJcblxyXG5cdFx0XHR0aGlzLmFkZERvb3IoeCwgeSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uKCkge1xyXG5cdGNvbnNvbGUubG9nKFwicm9vbVwiLCB0aGlzLl94MSwgdGhpcy5feTEsIHRoaXMuX3gyLCB0aGlzLl95Mik7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuaXNWYWxpZCA9IGZ1bmN0aW9uKGlzV2FsbENhbGxiYWNrLCBjYW5CZUR1Z0NhbGxiYWNrKSB7IFxyXG5cdHZhciBsZWZ0ID0gdGhpcy5feDEtMTtcclxuXHR2YXIgcmlnaHQgPSB0aGlzLl94MisxO1xyXG5cdHZhciB0b3AgPSB0aGlzLl95MS0xO1xyXG5cdHZhciBib3R0b20gPSB0aGlzLl95MisxO1xyXG5cdFxyXG5cdGZvciAodmFyIHg9bGVmdDsgeDw9cmlnaHQ7IHgrKykge1xyXG5cdFx0Zm9yICh2YXIgeT10b3A7IHk8PWJvdHRvbTsgeSsrKSB7XHJcblx0XHRcdGlmICh4ID09IGxlZnQgfHwgeCA9PSByaWdodCB8fCB5ID09IHRvcCB8fCB5ID09IGJvdHRvbSkge1xyXG5cdFx0XHRcdGlmICghaXNXYWxsQ2FsbGJhY2soeCwgeSkpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKCFjYW5CZUR1Z0NhbGxiYWNrKHgsIHkpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaWdDYWxsYmFjayBEaWcgY2FsbGJhY2sgd2l0aCBhIHNpZ25hdHVyZSAoeCwgeSwgdmFsdWUpLiBWYWx1ZXM6IDAgPSBlbXB0eSwgMSA9IHdhbGwsIDIgPSBkb29yLiBNdWx0aXBsZSBkb29ycyBhcmUgYWxsb3dlZC5cclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihkaWdDYWxsYmFjaykgeyBcclxuXHR2YXIgbGVmdCA9IHRoaXMuX3gxLTE7XHJcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcclxuXHR2YXIgdG9wID0gdGhpcy5feTEtMTtcclxuXHR2YXIgYm90dG9tID0gdGhpcy5feTIrMTtcclxuXHRcclxuXHR2YXIgdmFsdWUgPSAwO1xyXG5cdGZvciAodmFyIHg9bGVmdDsgeDw9cmlnaHQ7IHgrKykge1xyXG5cdFx0Zm9yICh2YXIgeT10b3A7IHk8PWJvdHRvbTsgeSsrKSB7XHJcblx0XHRcdGlmICh4K1wiLFwiK3kgaW4gdGhpcy5fZG9vcnMpIHtcclxuXHRcdFx0XHR2YWx1ZSA9IDI7XHJcblx0XHRcdH0gZWxzZSBpZiAoeCA9PSBsZWZ0IHx8IHggPT0gcmlnaHQgfHwgeSA9PSB0b3AgfHwgeSA9PSBib3R0b20pIHtcclxuXHRcdFx0XHR2YWx1ZSA9IDE7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFsdWUgPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRpZ0NhbGxiYWNrKHgsIHksIHZhbHVlKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0Q2VudGVyID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIFtNYXRoLnJvdW5kKCh0aGlzLl94MSArIHRoaXMuX3gyKS8yKSwgTWF0aC5yb3VuZCgodGhpcy5feTEgKyB0aGlzLl95MikvMildO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldExlZnQgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5feDE7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0UmlnaHQgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5feDI7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0VG9wID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3kxO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldEJvdHRvbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl95MjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ29ycmlkb3JcclxuICogQGF1Z21lbnRzIFJPVC5NYXAuRmVhdHVyZVxyXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRYXHJcbiAqIEBwYXJhbSB7aW50fSBzdGFydFlcclxuICogQHBhcmFtIHtpbnR9IGVuZFhcclxuICogQHBhcmFtIHtpbnR9IGVuZFlcclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvciA9IGZ1bmN0aW9uKHN0YXJ0WCwgc3RhcnRZLCBlbmRYLCBlbmRZKSB7XHJcblx0dGhpcy5fc3RhcnRYID0gc3RhcnRYO1xyXG5cdHRoaXMuX3N0YXJ0WSA9IHN0YXJ0WTtcclxuXHR0aGlzLl9lbmRYID0gZW5kWDsgXHJcblx0dGhpcy5fZW5kWSA9IGVuZFk7XHJcblx0dGhpcy5fZW5kc1dpdGhBV2FsbCA9IHRydWU7XHJcbn07XHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5leHRlbmQoUk9ULk1hcC5GZWF0dXJlKTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5jcmVhdGVSYW5kb21BdCA9IGZ1bmN0aW9uKHgsIHksIGR4LCBkeSwgb3B0aW9ucykge1xyXG5cdHZhciBtaW4gPSBvcHRpb25zLmNvcnJpZG9yTGVuZ3RoWzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLmNvcnJpZG9yTGVuZ3RoWzFdO1xyXG5cdHZhciBsZW5ndGggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgdGhpcyh4LCB5LCB4ICsgZHgqbGVuZ3RoLCB5ICsgZHkqbGVuZ3RoKTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbigpIHtcclxuXHRjb25zb2xlLmxvZyhcImNvcnJpZG9yXCIsIHRoaXMuX3N0YXJ0WCwgdGhpcy5fc3RhcnRZLCB0aGlzLl9lbmRYLCB0aGlzLl9lbmRZKTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuaXNWYWxpZCA9IGZ1bmN0aW9uKGlzV2FsbENhbGxiYWNrLCBjYW5CZUR1Z0NhbGxiYWNrKXsgXHJcblx0dmFyIHN4ID0gdGhpcy5fc3RhcnRYO1xyXG5cdHZhciBzeSA9IHRoaXMuX3N0YXJ0WTtcclxuXHR2YXIgZHggPSB0aGlzLl9lbmRYLXN4O1xyXG5cdHZhciBkeSA9IHRoaXMuX2VuZFktc3k7XHJcblx0dmFyIGxlbmd0aCA9IDEgKyBNYXRoLm1heChNYXRoLmFicyhkeCksIE1hdGguYWJzKGR5KSk7XHJcblx0XHJcblx0aWYgKGR4KSB7IGR4ID0gZHgvTWF0aC5hYnMoZHgpOyB9XHJcblx0aWYgKGR5KSB7IGR5ID0gZHkvTWF0aC5hYnMoZHkpOyB9XHJcblx0dmFyIG54ID0gZHk7XHJcblx0dmFyIG55ID0gLWR4O1xyXG5cdFxyXG5cdHZhciBvayA9IHRydWU7XHJcblx0Zm9yICh2YXIgaT0wOyBpPGxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgeCA9IHN4ICsgaSpkeDtcclxuXHRcdHZhciB5ID0gc3kgKyBpKmR5O1xyXG5cclxuXHRcdGlmICghY2FuQmVEdWdDYWxsYmFjayggICAgIHgsICAgICAgeSkpIHsgb2sgPSBmYWxzZTsgfVxyXG5cdFx0aWYgKCFpc1dhbGxDYWxsYmFjayAgKHggKyBueCwgeSArIG55KSkgeyBvayA9IGZhbHNlOyB9XHJcblx0XHRpZiAoIWlzV2FsbENhbGxiYWNrICAoeCAtIG54LCB5IC0gbnkpKSB7IG9rID0gZmFsc2U7IH1cclxuXHRcdFxyXG5cdFx0aWYgKCFvaykge1xyXG5cdFx0XHRsZW5ndGggPSBpO1xyXG5cdFx0XHR0aGlzLl9lbmRYID0geC1keDtcclxuXHRcdFx0dGhpcy5fZW5kWSA9IHktZHk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvKipcclxuXHQgKiBJZiB0aGUgbGVuZ3RoIGRlZ2VuZXJhdGVkLCB0aGlzIGNvcnJpZG9yIG1pZ2h0IGJlIGludmFsaWRcclxuXHQgKi9cclxuXHQgXHJcblx0Lyogbm90IHN1cHBvcnRlZCAqL1xyXG5cdGlmIChsZW5ndGggPT0gMCkgeyByZXR1cm4gZmFsc2U7IH0gXHJcblx0XHJcblx0IC8qIGxlbmd0aCAxIGFsbG93ZWQgb25seSBpZiB0aGUgbmV4dCBzcGFjZSBpcyBlbXB0eSAqL1xyXG5cdGlmIChsZW5ndGggPT0gMSAmJiBpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHgsIHRoaXMuX2VuZFkgKyBkeSkpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHJcblx0LyoqXHJcblx0ICogV2UgZG8gbm90IHdhbnQgdGhlIGNvcnJpZG9yIHRvIGNyYXNoIGludG8gYSBjb3JuZXIgb2YgYSByb29tO1xyXG5cdCAqIGlmIGFueSBvZiB0aGUgZW5kaW5nIGNvcm5lcnMgaXMgZW1wdHksIHRoZSBOKzF0aCBjZWxsIG9mIHRoaXMgY29ycmlkb3IgbXVzdCBiZSBlbXB0eSB0b28uXHJcblx0ICogXHJcblx0ICogU2l0dWF0aW9uOlxyXG5cdCAqICMjIyMjIyMxXHJcblx0ICogLi4uLi4uLj9cclxuXHQgKiAjIyMjIyMjMlxyXG5cdCAqIFxyXG5cdCAqIFRoZSBjb3JyaWRvciB3YXMgZHVnIGZyb20gbGVmdCB0byByaWdodC5cclxuXHQgKiAxLCAyIC0gcHJvYmxlbWF0aWMgY29ybmVycywgPyA9IE4rMXRoIGNlbGwgKG5vdCBkdWcpXHJcblx0ICovXHJcblx0dmFyIGZpcnN0Q29ybmVyQmFkID0gIWlzV2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCArIG54LCB0aGlzLl9lbmRZICsgZHkgKyBueSk7XHJcblx0dmFyIHNlY29uZENvcm5lckJhZCA9ICFpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHggLSBueCwgdGhpcy5fZW5kWSArIGR5IC0gbnkpO1xyXG5cdHRoaXMuX2VuZHNXaXRoQVdhbGwgPSBpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHgsIHRoaXMuX2VuZFkgKyBkeSk7XHJcblx0aWYgKChmaXJzdENvcm5lckJhZCB8fCBzZWNvbmRDb3JuZXJCYWQpICYmIHRoaXMuX2VuZHNXaXRoQVdhbGwpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG5cdHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpZ0NhbGxiYWNrIERpZyBjYWxsYmFjayB3aXRoIGEgc2lnbmF0dXJlICh4LCB5LCB2YWx1ZSkuIFZhbHVlczogMCA9IGVtcHR5LlxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihkaWdDYWxsYmFjaykgeyBcclxuXHR2YXIgc3ggPSB0aGlzLl9zdGFydFg7XHJcblx0dmFyIHN5ID0gdGhpcy5fc3RhcnRZO1xyXG5cdHZhciBkeCA9IHRoaXMuX2VuZFgtc3g7XHJcblx0dmFyIGR5ID0gdGhpcy5fZW5kWS1zeTtcclxuXHR2YXIgbGVuZ3RoID0gMStNYXRoLm1heChNYXRoLmFicyhkeCksIE1hdGguYWJzKGR5KSk7XHJcblx0XHJcblx0aWYgKGR4KSB7IGR4ID0gZHgvTWF0aC5hYnMoZHgpOyB9XHJcblx0aWYgKGR5KSB7IGR5ID0gZHkvTWF0aC5hYnMoZHkpOyB9XHJcblx0dmFyIG54ID0gZHk7XHJcblx0dmFyIG55ID0gLWR4O1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDsgaTxsZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHggPSBzeCArIGkqZHg7XHJcblx0XHR2YXIgeSA9IHN5ICsgaSpkeTtcclxuXHRcdGRpZ0NhbGxiYWNrKHgsIHksIDApO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuY3JlYXRlUHJpb3JpdHlXYWxscyA9IGZ1bmN0aW9uKHByaW9yaXR5V2FsbENhbGxiYWNrKSB7XHJcblx0aWYgKCF0aGlzLl9lbmRzV2l0aEFXYWxsKSB7IHJldHVybjsgfVxyXG5cclxuXHR2YXIgc3ggPSB0aGlzLl9zdGFydFg7XHJcblx0dmFyIHN5ID0gdGhpcy5fc3RhcnRZO1xyXG5cclxuXHR2YXIgZHggPSB0aGlzLl9lbmRYLXN4O1xyXG5cdHZhciBkeSA9IHRoaXMuX2VuZFktc3k7XHJcblx0aWYgKGR4KSB7IGR4ID0gZHgvTWF0aC5hYnMoZHgpOyB9XHJcblx0aWYgKGR5KSB7IGR5ID0gZHkvTWF0aC5hYnMoZHkpOyB9XHJcblx0dmFyIG54ID0gZHk7XHJcblx0dmFyIG55ID0gLWR4O1xyXG5cclxuXHRwcmlvcml0eVdhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHgsIHRoaXMuX2VuZFkgKyBkeSk7XHJcblx0cHJpb3JpdHlXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIG54LCB0aGlzLl9lbmRZICsgbnkpO1xyXG5cdHByaW9yaXR5V2FsbENhbGxiYWNrKHRoaXMuX2VuZFggLSBueCwgdGhpcy5fZW5kWSAtIG55KTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBCYXNlIG5vaXNlIGdlbmVyYXRvclxyXG4gKi9cclxuUk9ULk5vaXNlID0gZnVuY3Rpb24oKSB7XHJcbn07XHJcblxyXG5ST1QuTm9pc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHgsIHkpIHt9O1xyXG4vKipcclxuICogQSBzaW1wbGUgMmQgaW1wbGVtZW50YXRpb24gb2Ygc2ltcGxleCBub2lzZSBieSBPbmRyZWogWmFyYVxyXG4gKlxyXG4gKiBCYXNlZCBvbiBhIHNwZWVkLWltcHJvdmVkIHNpbXBsZXggbm9pc2UgYWxnb3JpdGhtIGZvciAyRCwgM0QgYW5kIDREIGluIEphdmEuXHJcbiAqIFdoaWNoIGlzIGJhc2VkIG9uIGV4YW1wbGUgY29kZSBieSBTdGVmYW4gR3VzdGF2c29uIChzdGVndUBpdG4ubGl1LnNlKS5cclxuICogV2l0aCBPcHRpbWlzYXRpb25zIGJ5IFBldGVyIEVhc3RtYW4gKHBlYXN0bWFuQGRyaXp6bGUuc3RhbmZvcmQuZWR1KS5cclxuICogQmV0dGVyIHJhbmsgb3JkZXJpbmcgbWV0aG9kIGJ5IFN0ZWZhbiBHdXN0YXZzb24gaW4gMjAxMi5cclxuICovXHJcblxyXG4vKipcclxuICogQGNsYXNzIDJEIHNpbXBsZXggbm9pc2UgZ2VuZXJhdG9yXHJcbiAqIEBwYXJhbSB7aW50fSBbZ3JhZGllbnRzPTI1Nl0gUmFuZG9tIGdyYWRpZW50c1xyXG4gKi9cclxuUk9ULk5vaXNlLlNpbXBsZXggPSBmdW5jdGlvbihncmFkaWVudHMpIHtcclxuXHRST1QuTm9pc2UuY2FsbCh0aGlzKTtcclxuXHJcblx0dGhpcy5fRjIgPSAwLjUgKiAoTWF0aC5zcXJ0KDMpIC0gMSk7XHJcblx0dGhpcy5fRzIgPSAoMyAtIE1hdGguc3FydCgzKSkgLyA2O1xyXG5cclxuXHR0aGlzLl9ncmFkaWVudHMgPSBbXHJcblx0XHRbIDAsIC0xXSxcclxuXHRcdFsgMSwgLTFdLFxyXG5cdFx0WyAxLCAgMF0sXHJcblx0XHRbIDEsICAxXSxcclxuXHRcdFsgMCwgIDFdLFxyXG5cdFx0Wy0xLCAgMV0sXHJcblx0XHRbLTEsICAwXSxcclxuXHRcdFstMSwgLTFdXHJcblx0XTtcclxuXHJcblx0dmFyIHBlcm11dGF0aW9ucyA9IFtdO1xyXG5cdHZhciBjb3VudCA9IGdyYWRpZW50cyB8fCAyNTY7XHJcblx0Zm9yICh2YXIgaT0wO2k8Y291bnQ7aSsrKSB7IHBlcm11dGF0aW9ucy5wdXNoKGkpOyB9XHJcblx0cGVybXV0YXRpb25zID0gcGVybXV0YXRpb25zLnJhbmRvbWl6ZSgpO1xyXG5cclxuXHR0aGlzLl9wZXJtcyA9IFtdO1xyXG5cdHRoaXMuX2luZGV4ZXMgPSBbXTtcclxuXHJcblx0Zm9yICh2YXIgaT0wO2k8Mipjb3VudDtpKyspIHtcclxuXHRcdHRoaXMuX3Blcm1zLnB1c2gocGVybXV0YXRpb25zW2kgJSBjb3VudF0pO1xyXG5cdFx0dGhpcy5faW5kZXhlcy5wdXNoKHRoaXMuX3Blcm1zW2ldICUgdGhpcy5fZ3JhZGllbnRzLmxlbmd0aCk7XHJcblx0fVxyXG5cclxufTtcclxuUk9ULk5vaXNlLlNpbXBsZXguZXh0ZW5kKFJPVC5Ob2lzZSk7XHJcblxyXG5ST1QuTm9pc2UuU2ltcGxleC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oeGluLCB5aW4pIHtcclxuXHR2YXIgcGVybXMgPSB0aGlzLl9wZXJtcztcclxuXHR2YXIgaW5kZXhlcyA9IHRoaXMuX2luZGV4ZXM7XHJcblx0dmFyIGNvdW50ID0gcGVybXMubGVuZ3RoLzI7XHJcblx0dmFyIEcyID0gdGhpcy5fRzI7XHJcblxyXG5cdHZhciBuMCA9MCwgbjEgPSAwLCBuMiA9IDAsIGdpOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcclxuXHJcblx0Ly8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxyXG5cdHZhciBzID0gKHhpbiArIHlpbikgKiB0aGlzLl9GMjsgLy8gSGFpcnkgZmFjdG9yIGZvciAyRFxyXG5cdHZhciBpID0gTWF0aC5mbG9vcih4aW4gKyBzKTtcclxuXHR2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XHJcblx0dmFyIHQgPSAoaSArIGopICogRzI7XHJcblx0dmFyIFgwID0gaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5KSBzcGFjZVxyXG5cdHZhciBZMCA9IGogLSB0O1xyXG5cdHZhciB4MCA9IHhpbiAtIFgwOyAvLyBUaGUgeCx5IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxyXG5cdHZhciB5MCA9IHlpbiAtIFkwO1xyXG5cclxuXHQvLyBGb3IgdGhlIDJEIGNhc2UsIHRoZSBzaW1wbGV4IHNoYXBlIGlzIGFuIGVxdWlsYXRlcmFsIHRyaWFuZ2xlLlxyXG5cdC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cclxuXHR2YXIgaTEsIGoxOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgKG1pZGRsZSkgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaikgY29vcmRzXHJcblx0aWYgKHgwID4geTApIHtcclxuXHRcdGkxID0gMTtcclxuXHRcdGoxID0gMDtcclxuXHR9IGVsc2UgeyAvLyBsb3dlciB0cmlhbmdsZSwgWFkgb3JkZXI6ICgwLDApLT4oMSwwKS0+KDEsMSlcclxuXHRcdGkxID0gMDtcclxuXHRcdGoxID0gMTtcclxuXHR9IC8vIHVwcGVyIHRyaWFuZ2xlLCBZWCBvcmRlcjogKDAsMCktPigwLDEpLT4oMSwxKVxyXG5cclxuXHQvLyBBIHN0ZXAgb2YgKDEsMCkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgxLWMsLWMpIGluICh4LHkpLCBhbmRcclxuXHQvLyBhIHN0ZXAgb2YgKDAsMSkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgtYywxLWMpIGluICh4LHkpLCB3aGVyZVxyXG5cdC8vIGMgPSAoMy1zcXJ0KDMpKS82XHJcblx0dmFyIHgxID0geDAgLSBpMSArIEcyOyAvLyBPZmZzZXRzIGZvciBtaWRkbGUgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xyXG5cdHZhciB5MSA9IHkwIC0gajEgKyBHMjtcclxuXHR2YXIgeDIgPSB4MCAtIDEgKyAyKkcyOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcclxuXHR2YXIgeTIgPSB5MCAtIDEgKyAyKkcyO1xyXG5cclxuXHQvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIHRocmVlIHNpbXBsZXggY29ybmVyc1xyXG5cdHZhciBpaSA9IGkubW9kKGNvdW50KTtcclxuXHR2YXIgamogPSBqLm1vZChjb3VudCk7XHJcblxyXG5cdC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcclxuXHR2YXIgdDAgPSAwLjUgLSB4MCp4MCAtIHkwKnkwO1xyXG5cdGlmICh0MCA+PSAwKSB7XHJcblx0XHR0MCAqPSB0MDtcclxuXHRcdGdpID0gaW5kZXhlc1tpaStwZXJtc1tqal1dO1xyXG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xyXG5cdFx0bjAgPSB0MCAqIHQwICogKGdyYWRbMF0gKiB4MCArIGdyYWRbMV0gKiB5MCk7XHJcblx0fVxyXG5cdFxyXG5cdHZhciB0MSA9IDAuNSAtIHgxKngxIC0geTEqeTE7XHJcblx0aWYgKHQxID49IDApIHtcclxuXHRcdHQxICo9IHQxO1xyXG5cdFx0Z2kgPSBpbmRleGVzW2lpK2kxK3Blcm1zW2pqK2oxXV07XHJcblx0XHR2YXIgZ3JhZCA9IHRoaXMuX2dyYWRpZW50c1tnaV07XHJcblx0XHRuMSA9IHQxICogdDEgKiAoZ3JhZFswXSAqIHgxICsgZ3JhZFsxXSAqIHkxKTtcclxuXHR9XHJcblx0XHJcblx0dmFyIHQyID0gMC41IC0geDIqeDIgLSB5Mip5MjtcclxuXHRpZiAodDIgPj0gMCkge1xyXG5cdFx0dDIgKj0gdDI7XHJcblx0XHRnaSA9IGluZGV4ZXNbaWkrMStwZXJtc1tqaisxXV07XHJcblx0XHR2YXIgZ3JhZCA9IHRoaXMuX2dyYWRpZW50c1tnaV07XHJcblx0XHRuMiA9IHQyICogdDIgKiAoZ3JhZFswXSAqIHgyICsgZ3JhZFsxXSAqIHkyKTtcclxuXHR9XHJcblxyXG5cdC8vIEFkZCBjb250cmlidXRpb25zIGZyb20gZWFjaCBjb3JuZXIgdG8gZ2V0IHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cclxuXHQvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXHJcblx0cmV0dXJuIDcwICogKG4wICsgbjEgKyBuMik7XHJcbn1cclxuLyoqXHJcbiAqIEBjbGFzcyBBYnN0cmFjdCBGT1YgYWxnb3JpdGhtXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpZ2h0UGFzc2VzQ2FsbGJhY2sgRG9lcyB0aGUgbGlnaHQgcGFzcyB0aHJvdWdoIHgseT9cclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudG9wb2xvZ3k9OF0gNC82LzhcclxuICovXHJcblJPVC5GT1YgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0dGhpcy5fbGlnaHRQYXNzZXMgPSBsaWdodFBhc3Nlc0NhbGxiYWNrO1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHR0b3BvbG9neTogOFxyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDM2MC1kZWdyZWUgY2lyY2xlXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcblJPVC5GT1YucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge307XHJcblxyXG4vKipcclxuICogUmV0dXJuIGFsbCBuZWlnaGJvcnMgaW4gYSBjb25jZW50cmljIHJpbmdcclxuICogQHBhcmFtIHtpbnR9IGN4IGNlbnRlci14XHJcbiAqIEBwYXJhbSB7aW50fSBjeSBjZW50ZXIteVxyXG4gKiBAcGFyYW0ge2ludH0gciByYW5nZVxyXG4gKi9cclxuUk9ULkZPVi5wcm90b3R5cGUuX2dldENpcmNsZSA9IGZ1bmN0aW9uKGN4LCBjeSwgcikge1xyXG5cdHZhciByZXN1bHQgPSBbXTtcclxuXHR2YXIgZGlycywgY291bnRGYWN0b3IsIHN0YXJ0T2Zmc2V0O1xyXG5cclxuXHRzd2l0Y2ggKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kpIHtcclxuXHRcdGNhc2UgNDpcclxuXHRcdFx0Y291bnRGYWN0b3IgPSAxO1xyXG5cdFx0XHRzdGFydE9mZnNldCA9IFswLCAxXTtcclxuXHRcdFx0ZGlycyA9IFtcclxuXHRcdFx0XHRST1QuRElSU1s4XVs3XSxcclxuXHRcdFx0XHRST1QuRElSU1s4XVsxXSxcclxuXHRcdFx0XHRST1QuRElSU1s4XVszXSxcclxuXHRcdFx0XHRST1QuRElSU1s4XVs1XVxyXG5cdFx0XHRdO1xyXG5cdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSA2OlxyXG5cdFx0XHRkaXJzID0gUk9ULkRJUlNbNl07XHJcblx0XHRcdGNvdW50RmFjdG9yID0gMTtcclxuXHRcdFx0c3RhcnRPZmZzZXQgPSBbLTEsIDFdO1xyXG5cdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSA4OlxyXG5cdFx0XHRkaXJzID0gUk9ULkRJUlNbNF07XHJcblx0XHRcdGNvdW50RmFjdG9yID0gMjtcclxuXHRcdFx0c3RhcnRPZmZzZXQgPSBbLTEsIDFdO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuXHQvKiBzdGFydGluZyBuZWlnaGJvciAqL1xyXG5cdHZhciB4ID0gY3ggKyBzdGFydE9mZnNldFswXSpyO1xyXG5cdHZhciB5ID0gY3kgKyBzdGFydE9mZnNldFsxXSpyO1xyXG5cclxuXHQvKiBjaXJjbGUgKi9cclxuXHRmb3IgKHZhciBpPTA7aTxkaXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPHIqY291bnRGYWN0b3I7aisrKSB7XHJcblx0XHRcdHJlc3VsdC5wdXNoKFt4LCB5XSk7XHJcblx0XHRcdHggKz0gZGlyc1tpXVswXTtcclxuXHRcdFx0eSArPSBkaXJzW2ldWzFdO1xyXG5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgRGlzY3JldGUgc2hhZG93Y2FzdGluZyBhbGdvcml0aG0uIE9ic29sZXRlZCBieSBQcmVjaXNlIHNoYWRvd2Nhc3RpbmcuXHJcbiAqIEBhdWdtZW50cyBST1QuRk9WXHJcbiAqL1xyXG5ST1QuRk9WLkRpc2NyZXRlU2hhZG93Y2FzdGluZyA9IGZ1bmN0aW9uKGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHRST1QuRk9WLmNhbGwodGhpcywgbGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucyk7XHJcbn07XHJcblJPVC5GT1YuRGlzY3JldGVTaGFkb3djYXN0aW5nLmV4dGVuZChST1QuRk9WKTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5GT1YjY29tcHV0ZVxyXG4gKi9cclxuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge1xyXG5cdHZhciBjZW50ZXIgPSB0aGlzLl9jb29yZHM7XHJcblx0dmFyIG1hcCA9IHRoaXMuX21hcDtcclxuXHJcblx0LyogdGhpcyBwbGFjZSBpcyBhbHdheXMgdmlzaWJsZSAqL1xyXG5cdGNhbGxiYWNrKHgsIHksIDAsIDEpO1xyXG5cclxuXHQvKiBzdGFuZGluZyBpbiBhIGRhcmsgcGxhY2UuIEZJWE1FIGlzIHRoaXMgYSBnb29kIGlkZWE/ICAqL1xyXG5cdGlmICghdGhpcy5fbGlnaHRQYXNzZXMoeCwgeSkpIHsgcmV0dXJuOyB9XHJcblx0XHJcblx0Lyogc3RhcnQgYW5kIGVuZCBhbmdsZXMgKi9cclxuXHR2YXIgREFUQSA9IFtdO1xyXG5cdFxyXG5cdHZhciBBLCBCLCBjeCwgY3ksIGJsb2NrcztcclxuXHJcblx0LyogYW5hbHl6ZSBzdXJyb3VuZGluZyBjZWxscyBpbiBjb25jZW50cmljIHJpbmdzLCBzdGFydGluZyBmcm9tIHRoZSBjZW50ZXIgKi9cclxuXHRmb3IgKHZhciByPTE7IHI8PVI7IHIrKykge1xyXG5cdFx0dmFyIG5laWdoYm9ycyA9IHRoaXMuX2dldENpcmNsZSh4LCB5LCByKTtcclxuXHRcdHZhciBhbmdsZSA9IDM2MCAvIG5laWdoYm9ycy5sZW5ndGg7XHJcblxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8bmVpZ2hib3JzLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0Y3ggPSBuZWlnaGJvcnNbaV1bMF07XHJcblx0XHRcdGN5ID0gbmVpZ2hib3JzW2ldWzFdO1xyXG5cdFx0XHRBID0gYW5nbGUgKiAoaSAtIDAuNSk7XHJcblx0XHRcdEIgPSBBICsgYW5nbGU7XHJcblx0XHRcdFxyXG5cdFx0XHRibG9ja3MgPSAhdGhpcy5fbGlnaHRQYXNzZXMoY3gsIGN5KTtcclxuXHRcdFx0aWYgKHRoaXMuX3Zpc2libGVDb29yZHMoTWF0aC5mbG9vcihBKSwgTWF0aC5jZWlsKEIpLCBibG9ja3MsIERBVEEpKSB7IGNhbGxiYWNrKGN4LCBjeSwgciwgMSk7IH1cclxuXHRcdFx0XHJcblx0XHRcdGlmIChEQVRBLmxlbmd0aCA9PSAyICYmIERBVEFbMF0gPT0gMCAmJiBEQVRBWzFdID09IDM2MCkgeyByZXR1cm47IH0gLyogY3V0b2ZmPyAqL1xyXG5cclxuXHRcdH0gLyogZm9yIGFsbCBjZWxscyBpbiB0aGlzIHJpbmcgKi9cclxuXHR9IC8qIGZvciBhbGwgcmluZ3MgKi9cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2ludH0gQSBzdGFydCBhbmdsZVxyXG4gKiBAcGFyYW0ge2ludH0gQiBlbmQgYW5nbGVcclxuICogQHBhcmFtIHtib29sfSBibG9ja3MgRG9lcyBjdXJyZW50IGNlbGwgYmxvY2sgdmlzaWJpbGl0eT9cclxuICogQHBhcmFtIHtpbnRbXVtdfSBEQVRBIHNoYWRvd2VkIGFuZ2xlIHBhaXJzXHJcbiAqL1xyXG5ST1QuRk9WLkRpc2NyZXRlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuX3Zpc2libGVDb29yZHMgPSBmdW5jdGlvbihBLCBCLCBibG9ja3MsIERBVEEpIHtcclxuXHRpZiAoQSA8IDApIHsgXHJcblx0XHR2YXIgdjEgPSBhcmd1bWVudHMuY2FsbGVlKDAsIEIsIGJsb2NrcywgREFUQSk7XHJcblx0XHR2YXIgdjIgPSBhcmd1bWVudHMuY2FsbGVlKDM2MCtBLCAzNjAsIGJsb2NrcywgREFUQSk7XHJcblx0XHRyZXR1cm4gdjEgfHwgdjI7XHJcblx0fVxyXG5cdFxyXG5cdHZhciBpbmRleCA9IDA7XHJcblx0d2hpbGUgKGluZGV4IDwgREFUQS5sZW5ndGggJiYgREFUQVtpbmRleF0gPCBBKSB7IGluZGV4Kys7IH1cclxuXHRcclxuXHRpZiAoaW5kZXggPT0gREFUQS5sZW5ndGgpIHsgLyogY29tcGxldGVseSBuZXcgc2hhZG93ICovXHJcblx0XHRpZiAoYmxvY2tzKSB7IERBVEEucHVzaChBLCBCKTsgfSBcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHR2YXIgY291bnQgPSAwO1xyXG5cdFxyXG5cdGlmIChpbmRleCAlIDIpIHsgLyogdGhpcyBzaGFkb3cgc3RhcnRzIGluIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2l0aGluIGl0cyBlbmRpbmcgYm91bmRhcnkgKi9cclxuXHRcdHdoaWxlIChpbmRleCA8IERBVEEubGVuZ3RoICYmIERBVEFbaW5kZXhdIDwgQikge1xyXG5cdFx0XHRpbmRleCsrO1xyXG5cdFx0XHRjb3VudCsrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAoY291bnQgPT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFxyXG5cdFx0aWYgKGJsb2NrcykgeyBcclxuXHRcdFx0aWYgKGNvdW50ICUgMikge1xyXG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCwgQik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0REFUQS5zcGxpY2UoaW5kZXgtY291bnQsIGNvdW50KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHJcblx0fSBlbHNlIHsgLyogdGhpcyBzaGFkb3cgc3RhcnRzIG91dHNpZGUgYW4gZXhpc3Rpbmcgc2hhZG93LCBvciB3aXRoaW4gYSBzdGFydGluZyBib3VuZGFyeSAqL1xyXG5cdFx0d2hpbGUgKGluZGV4IDwgREFUQS5sZW5ndGggJiYgREFUQVtpbmRleF0gPCBCKSB7XHJcblx0XHRcdGluZGV4Kys7XHJcblx0XHRcdGNvdW50Kys7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8qIHZpc2libGUgd2hlbiBvdXRzaWRlIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2hlbiBvdmVybGFwcGluZyAqL1xyXG5cdFx0aWYgKEEgPT0gREFUQVtpbmRleC1jb3VudF0gJiYgY291bnQgPT0gMSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFxyXG5cdFx0aWYgKGJsb2NrcykgeyBcclxuXHRcdFx0aWYgKGNvdW50ICUgMikge1xyXG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCwgQSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0REFUQS5zcGxpY2UoaW5kZXgtY291bnQsIGNvdW50LCBBLCBCKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHRcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBQcmVjaXNlIHNoYWRvd2Nhc3RpbmcgYWxnb3JpdGhtXHJcbiAqIEBhdWdtZW50cyBST1QuRk9WXHJcbiAqL1xyXG5ST1QuRk9WLlByZWNpc2VTaGFkb3djYXN0aW5nID0gZnVuY3Rpb24obGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdFJPVC5GT1YuY2FsbCh0aGlzLCBsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKTtcclxufTtcclxuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZy5leHRlbmQoUk9ULkZPVik7XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuRk9WI2NvbXB1dGVcclxuICovXHJcblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge1xyXG5cdC8qIHRoaXMgcGxhY2UgaXMgYWx3YXlzIHZpc2libGUgKi9cclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHJcblx0Lyogc3RhbmRpbmcgaW4gYSBkYXJrIHBsYWNlLiBGSVhNRSBpcyB0aGlzIGEgZ29vZCBpZGVhPyAgKi9cclxuXHRpZiAoIXRoaXMuX2xpZ2h0UGFzc2VzKHgsIHkpKSB7IHJldHVybjsgfVxyXG5cdFxyXG5cdC8qIGxpc3Qgb2YgYWxsIHNoYWRvd3MgKi9cclxuXHR2YXIgU0hBRE9XUyA9IFtdO1xyXG5cdFxyXG5cdHZhciBjeCwgY3ksIGJsb2NrcywgQTEsIEEyLCB2aXNpYmlsaXR5O1xyXG5cclxuXHQvKiBhbmFseXplIHN1cnJvdW5kaW5nIGNlbGxzIGluIGNvbmNlbnRyaWMgcmluZ3MsIHN0YXJ0aW5nIGZyb20gdGhlIGNlbnRlciAqL1xyXG5cdGZvciAodmFyIHI9MTsgcjw9UjsgcisrKSB7XHJcblx0XHR2YXIgbmVpZ2hib3JzID0gdGhpcy5fZ2V0Q2lyY2xlKHgsIHksIHIpO1xyXG5cdFx0dmFyIG5laWdoYm9yQ291bnQgPSBuZWlnaGJvcnMubGVuZ3RoO1xyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPG5laWdoYm9yQ291bnQ7aSsrKSB7XHJcblx0XHRcdGN4ID0gbmVpZ2hib3JzW2ldWzBdO1xyXG5cdFx0XHRjeSA9IG5laWdoYm9yc1tpXVsxXTtcclxuXHRcdFx0Lyogc2hpZnQgaGFsZi1hbi1hbmdsZSBiYWNrd2FyZHMgdG8gbWFpbnRhaW4gY29uc2lzdGVuY3kgb2YgMC10aCBjZWxscyAqL1xyXG5cdFx0XHRBMSA9IFtpID8gMippLTEgOiAyKm5laWdoYm9yQ291bnQtMSwgMipuZWlnaGJvckNvdW50XTtcclxuXHRcdFx0QTIgPSBbMippKzEsIDIqbmVpZ2hib3JDb3VudF07IFxyXG5cdFx0XHRcclxuXHRcdFx0YmxvY2tzID0gIXRoaXMuX2xpZ2h0UGFzc2VzKGN4LCBjeSk7XHJcblx0XHRcdHZpc2liaWxpdHkgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoQTEsIEEyLCBibG9ja3MsIFNIQURPV1MpO1xyXG5cdFx0XHRpZiAodmlzaWJpbGl0eSkgeyBjYWxsYmFjayhjeCwgY3ksIHIsIHZpc2liaWxpdHkpOyB9XHJcblxyXG5cdFx0XHRpZiAoU0hBRE9XUy5sZW5ndGggPT0gMiAmJiBTSEFET1dTWzBdWzBdID09IDAgJiYgU0hBRE9XU1sxXVswXSA9PSBTSEFET1dTWzFdWzFdKSB7IHJldHVybjsgfSAvKiBjdXRvZmY/ICovXHJcblxyXG5cdFx0fSAvKiBmb3IgYWxsIGNlbGxzIGluIHRoaXMgcmluZyAqL1xyXG5cdH0gLyogZm9yIGFsbCByaW5ncyAqL1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7aW50WzJdfSBBMSBhcmMgc3RhcnRcclxuICogQHBhcmFtIHtpbnRbMl19IEEyIGFyYyBlbmRcclxuICogQHBhcmFtIHtib29sfSBibG9ja3MgRG9lcyBjdXJyZW50IGFyYyBibG9jayB2aXNpYmlsaXR5P1xyXG4gKiBAcGFyYW0ge2ludFtdW119IFNIQURPV1MgbGlzdCBvZiBhY3RpdmUgc2hhZG93c1xyXG4gKi9cclxuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuX2NoZWNrVmlzaWJpbGl0eSA9IGZ1bmN0aW9uKEExLCBBMiwgYmxvY2tzLCBTSEFET1dTKSB7XHJcblx0aWYgKEExWzBdID4gQTJbMF0pIHsgLyogc3BsaXQgaW50byB0d28gc3ViLWFyY3MgKi9cclxuXHRcdHZhciB2MSA9IHRoaXMuX2NoZWNrVmlzaWJpbGl0eShBMSwgW0ExWzFdLCBBMVsxXV0sIGJsb2NrcywgU0hBRE9XUyk7XHJcblx0XHR2YXIgdjIgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoWzAsIDFdLCBBMiwgYmxvY2tzLCBTSEFET1dTKTtcclxuXHRcdHJldHVybiAodjErdjIpLzI7XHJcblx0fVxyXG5cclxuXHQvKiBpbmRleDE6IGZpcnN0IHNoYWRvdyA+PSBBMSAqL1xyXG5cdHZhciBpbmRleDEgPSAwLCBlZGdlMSA9IGZhbHNlO1xyXG5cdHdoaWxlIChpbmRleDEgPCBTSEFET1dTLmxlbmd0aCkge1xyXG5cdFx0dmFyIG9sZCA9IFNIQURPV1NbaW5kZXgxXTtcclxuXHRcdHZhciBkaWZmID0gb2xkWzBdKkExWzFdIC0gQTFbMF0qb2xkWzFdO1xyXG5cdFx0aWYgKGRpZmYgPj0gMCkgeyAvKiBvbGQgPj0gQTEgKi9cclxuXHRcdFx0aWYgKGRpZmYgPT0gMCAmJiAhKGluZGV4MSAlIDIpKSB7IGVkZ2UxID0gdHJ1ZTsgfVxyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdGluZGV4MSsrO1xyXG5cdH1cclxuXHJcblx0LyogaW5kZXgyOiBsYXN0IHNoYWRvdyA8PSBBMiAqL1xyXG5cdHZhciBpbmRleDIgPSBTSEFET1dTLmxlbmd0aCwgZWRnZTIgPSBmYWxzZTtcclxuXHR3aGlsZSAoaW5kZXgyLS0pIHtcclxuXHRcdHZhciBvbGQgPSBTSEFET1dTW2luZGV4Ml07XHJcblx0XHR2YXIgZGlmZiA9IEEyWzBdKm9sZFsxXSAtIG9sZFswXSpBMlsxXTtcclxuXHRcdGlmIChkaWZmID49IDApIHsgLyogb2xkIDw9IEEyICovXHJcblx0XHRcdGlmIChkaWZmID09IDAgJiYgKGluZGV4MiAlIDIpKSB7IGVkZ2UyID0gdHJ1ZTsgfVxyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciB2aXNpYmxlID0gdHJ1ZTtcclxuXHRpZiAoaW5kZXgxID09IGluZGV4MiAmJiAoZWRnZTEgfHwgZWRnZTIpKSB7ICAvKiBzdWJzZXQgb2YgZXhpc3Rpbmcgc2hhZG93LCBvbmUgb2YgdGhlIGVkZ2VzIG1hdGNoICovXHJcblx0XHR2aXNpYmxlID0gZmFsc2U7IFxyXG5cdH0gZWxzZSBpZiAoZWRnZTEgJiYgZWRnZTIgJiYgaW5kZXgxKzE9PWluZGV4MiAmJiAoaW5kZXgyICUgMikpIHsgLyogY29tcGxldGVseSBlcXVpdmFsZW50IHdpdGggZXhpc3Rpbmcgc2hhZG93ICovXHJcblx0XHR2aXNpYmxlID0gZmFsc2U7XHJcblx0fSBlbHNlIGlmIChpbmRleDEgPiBpbmRleDIgJiYgKGluZGV4MSAlIDIpKSB7IC8qIHN1YnNldCBvZiBleGlzdGluZyBzaGFkb3csIG5vdCB0b3VjaGluZyAqL1xyXG5cdFx0dmlzaWJsZSA9IGZhbHNlO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoIXZpc2libGUpIHsgcmV0dXJuIDA7IH0gLyogZmFzdCBjYXNlOiBub3QgdmlzaWJsZSAqL1xyXG5cdFxyXG5cdHZhciB2aXNpYmxlTGVuZ3RoLCBQO1xyXG5cclxuXHQvKiBjb21wdXRlIHRoZSBsZW5ndGggb2YgdmlzaWJsZSBhcmMsIGFkanVzdCBsaXN0IG9mIHNoYWRvd3MgKGlmIGJsb2NraW5nKSAqL1xyXG5cdHZhciByZW1vdmUgPSBpbmRleDItaW5kZXgxKzE7XHJcblx0aWYgKHJlbW92ZSAlIDIpIHtcclxuXHRcdGlmIChpbmRleDEgJSAyKSB7IC8qIGZpcnN0IGVkZ2Ugd2l0aGluIGV4aXN0aW5nIHNoYWRvdywgc2Vjb25kIG91dHNpZGUgKi9cclxuXHRcdFx0dmFyIFAgPSBTSEFET1dTW2luZGV4MV07XHJcblx0XHRcdHZpc2libGVMZW5ndGggPSAoQTJbMF0qUFsxXSAtIFBbMF0qQTJbMV0pIC8gKFBbMV0gKiBBMlsxXSk7XHJcblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUsIEEyKTsgfVxyXG5cdFx0fSBlbHNlIHsgLyogc2Vjb25kIGVkZ2Ugd2l0aGluIGV4aXN0aW5nIHNoYWRvdywgZmlyc3Qgb3V0c2lkZSAqL1xyXG5cdFx0XHR2YXIgUCA9IFNIQURPV1NbaW5kZXgyXTtcclxuXHRcdFx0dmlzaWJsZUxlbmd0aCA9IChQWzBdKkExWzFdIC0gQTFbMF0qUFsxXSkgLyAoQTFbMV0gKiBQWzFdKTtcclxuXHRcdFx0aWYgKGJsb2NrcykgeyBTSEFET1dTLnNwbGljZShpbmRleDEsIHJlbW92ZSwgQTEpOyB9XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdGlmIChpbmRleDEgJSAyKSB7IC8qIGJvdGggZWRnZXMgd2l0aGluIGV4aXN0aW5nIHNoYWRvd3MgKi9cclxuXHRcdFx0dmFyIFAxID0gU0hBRE9XU1tpbmRleDFdO1xyXG5cdFx0XHR2YXIgUDIgPSBTSEFET1dTW2luZGV4Ml07XHJcblx0XHRcdHZpc2libGVMZW5ndGggPSAoUDJbMF0qUDFbMV0gLSBQMVswXSpQMlsxXSkgLyAoUDFbMV0gKiBQMlsxXSk7XHJcblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUpOyB9XHJcblx0XHR9IGVsc2UgeyAvKiBib3RoIGVkZ2VzIG91dHNpZGUgZXhpc3Rpbmcgc2hhZG93cyAqL1xyXG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMSwgQTIpOyB9XHJcblx0XHRcdHJldHVybiAxOyAvKiB3aG9sZSBhcmMgdmlzaWJsZSEgKi9cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBhcmNMZW5ndGggPSAoQTJbMF0qQTFbMV0gLSBBMVswXSpBMlsxXSkgLyAoQTFbMV0gKiBBMlsxXSk7XHJcblxyXG5cdHJldHVybiB2aXNpYmxlTGVuZ3RoL2FyY0xlbmd0aDtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBSZWN1cnNpdmUgc2hhZG93Y2FzdGluZyBhbGdvcml0aG1cclxuICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgNC84IHRvcG9sb2dpZXMsIG5vdCBoZXhhZ29uYWwuXHJcbiAqIEJhc2VkIG9uIFBldGVyIEhhcmtpbnMnIGltcGxlbWVudGF0aW9uIG9mIEJqw7ZybiBCZXJnc3Ryw7ZtJ3MgYWxnb3JpdGhtIGRlc2NyaWJlZCBoZXJlOiBodHRwOi8vd3d3LnJvZ3VlYmFzaW4uY29tL2luZGV4LnBocD90aXRsZT1GT1ZfdXNpbmdfcmVjdXJzaXZlX3NoYWRvd2Nhc3RpbmdcclxuICogQGF1Z21lbnRzIFJPVC5GT1ZcclxuICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZyA9IGZ1bmN0aW9uKGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHRST1QuRk9WLmNhbGwodGhpcywgbGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucyk7XHJcbn07XHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5leHRlbmQoUk9ULkZPVik7XHJcblxyXG4vKiogT2N0YW50cyB1c2VkIGZvciB0cmFuc2xhdGluZyByZWN1cnNpdmUgc2hhZG93Y2FzdGluZyBvZmZzZXRzICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTID0gW1xyXG5cdFstMSwgIDAsICAwLCAgMV0sXHJcblx0WyAwLCAtMSwgIDEsICAwXSxcclxuXHRbIDAsIC0xLCAtMSwgIDBdLFxyXG5cdFstMSwgIDAsICAwLCAtMV0sXHJcblx0WyAxLCAgMCwgIDAsIC0xXSxcclxuXHRbIDAsICAxLCAtMSwgIDBdLFxyXG5cdFsgMCwgIDEsICAxLCAgMF0sXHJcblx0WyAxLCAgMCwgIDAsICAxXVxyXG5dO1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSAzNjAtZGVncmVlIGNpcmNsZVxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge1xyXG5cdC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1tpXSwgUiwgY2FsbGJhY2spO1xyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgMTgwLWRlZ3JlZSBhcmNcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xyXG4gKiBAcGFyYW0ge2ludH0gZGlyIERpcmVjdGlvbiB0byBsb29rIGluIChleHByZXNzZWQgaW4gYSBST1QuRElSUyB2YWx1ZSk7XHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUxODAgPSBmdW5jdGlvbih4LCB5LCBSLCBkaXIsIGNhbGxiYWNrKSB7XHJcblx0Ly9Zb3UgY2FuIGFsd2F5cyBzZWUgeW91ciBvd24gdGlsZVxyXG5cdGNhbGxiYWNrKHgsIHksIDAsIDEpO1xyXG5cdHZhciBwcmV2aW91c09jdGFudCA9IChkaXIgLSAxICsgOCkgJSA4OyAvL05lZWQgdG8gcmV0cmlldmUgdGhlIHByZXZpb3VzIG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXHJcblx0dmFyIG5leHRQcmV2aW91c09jdGFudCA9IChkaXIgLSAyICsgOCkgJSA4OyAvL05lZWQgdG8gcmV0cmlldmUgdGhlIHByZXZpb3VzIHR3byBvY3RhbnRzIHRvIHJlbmRlciBhIGZ1bGwgMTgwIGRlZ3JlZXNcclxuXHR2YXIgbmV4dE9jdGFudCA9IChkaXIrIDEgKyA4KSAlIDg7IC8vTmVlZCB0byBncmFiIHRvIG5leHQgb2N0YW50IHRvIHJlbmRlciBhIGZ1bGwgMTgwIGRlZ3JlZXNcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbbmV4dFByZXZpb3VzT2N0YW50XSwgUiwgY2FsbGJhY2spO1xyXG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1twcmV2aW91c09jdGFudF0sIFIsIGNhbGxiYWNrKTtcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbZGlyXSwgUiwgY2FsbGJhY2spO1xyXG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1tuZXh0T2N0YW50XSwgUiwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSA5MC1kZWdyZWUgYXJjXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcclxuICogQHBhcmFtIHtpbnR9IGRpciBEaXJlY3Rpb24gdG8gbG9vayBpbiAoZXhwcmVzc2VkIGluIGEgUk9ULkRJUlMgdmFsdWUpO1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlOTAgPSBmdW5jdGlvbih4LCB5LCBSLCBkaXIsIGNhbGxiYWNrKSB7XHJcblx0Ly9Zb3UgY2FuIGFsd2F5cyBzZWUgeW91ciBvd24gdGlsZVxyXG5cdGNhbGxiYWNrKHgsIHksIDAsIDEpO1xyXG5cdHZhciBwcmV2aW91c09jdGFudCA9IChkaXIgLSAxICsgOCkgJSA4OyAvL05lZWQgdG8gcmV0cmlldmUgdGhlIHByZXZpb3VzIG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDkwIGRlZ3JlZXNcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbZGlyXSwgUiwgY2FsbGJhY2spO1xyXG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1twcmV2aW91c09jdGFudF0sIFIsIGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW5kZXIgb25lIG9jdGFudCAoNDUtZGVncmVlIGFyYykgb2YgdGhlIHZpZXdzaGVkXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSBvY3RhbnQgT2N0YW50IHRvIGJlIHJlbmRlcmVkXHJcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuX3JlbmRlck9jdGFudCA9IGZ1bmN0aW9uKHgsIHksIG9jdGFudCwgUiwgY2FsbGJhY2spIHtcclxuXHQvL1JhZGl1cyBpbmNyZW1lbnRlZCBieSAxIHRvIHByb3ZpZGUgc2FtZSBjb3ZlcmFnZSBhcmVhIGFzIG90aGVyIHNoYWRvd2Nhc3RpbmcgcmFkaXVzZXNcclxuXHR0aGlzLl9jYXN0VmlzaWJpbGl0eSh4LCB5LCAxLCAxLjAsIDAuMCwgUiArIDEsIG9jdGFudFswXSwgb2N0YW50WzFdLCBvY3RhbnRbMl0sIG9jdGFudFszXSwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFjdHVhbGx5IGNhbGN1bGF0ZXMgdGhlIHZpc2liaWxpdHlcclxuICogQHBhcmFtIHtpbnR9IHN0YXJ0WCBUaGUgc3RhcnRpbmcgWCBjb29yZGluYXRlXHJcbiAqIEBwYXJhbSB7aW50fSBzdGFydFkgVGhlIHN0YXJ0aW5nIFkgY29vcmRpbmF0ZVxyXG4gKiBAcGFyYW0ge2ludH0gcm93IFRoZSByb3cgdG8gcmVuZGVyXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IHZpc1Nsb3BlU3RhcnQgVGhlIHNsb3BlIHRvIHN0YXJ0IGF0XHJcbiAqIEBwYXJhbSB7ZmxvYXR9IHZpc1Nsb3BlRW5kIFRoZSBzbG9wZSB0byBlbmQgYXRcclxuICogQHBhcmFtIHtpbnR9IHJhZGl1cyBUaGUgcmFkaXVzIHRvIHJlYWNoIG91dCB0b1xyXG4gKiBAcGFyYW0ge2ludH0geHggXHJcbiAqIEBwYXJhbSB7aW50fSB4eSBcclxuICogQHBhcmFtIHtpbnR9IHl4IFxyXG4gKiBAcGFyYW0ge2ludH0geXkgXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byB1c2Ugd2hlbiB3ZSBoaXQgYSBibG9jayB0aGF0IGlzIHZpc2libGVcclxuICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuX2Nhc3RWaXNpYmlsaXR5ID0gZnVuY3Rpb24oc3RhcnRYLCBzdGFydFksIHJvdywgdmlzU2xvcGVTdGFydCwgdmlzU2xvcGVFbmQsIHJhZGl1cywgeHgsIHh5LCB5eCwgeXksIGNhbGxiYWNrKSB7XHJcblx0aWYodmlzU2xvcGVTdGFydCA8IHZpc1Nsb3BlRW5kKSB7IHJldHVybjsgfVxyXG5cdGZvcih2YXIgaSA9IHJvdzsgaSA8PSByYWRpdXM7IGkrKykge1xyXG5cdFx0dmFyIGR4ID0gLWkgLSAxO1xyXG5cdFx0dmFyIGR5ID0gLWk7XHJcblx0XHR2YXIgYmxvY2tlZCA9IGZhbHNlO1xyXG5cdFx0dmFyIG5ld1N0YXJ0ID0gMDtcclxuXHJcblx0XHQvLydSb3cnIGNvdWxkIGJlIGNvbHVtbiwgbmFtZXMgaGVyZSBhc3N1bWUgb2N0YW50IDAgYW5kIHdvdWxkIGJlIGZsaXBwZWQgZm9yIGhhbGYgdGhlIG9jdGFudHNcclxuXHRcdHdoaWxlKGR4IDw9IDApIHtcclxuXHRcdFx0ZHggKz0gMTtcclxuXHJcblx0XHRcdC8vVHJhbnNsYXRlIGZyb20gcmVsYXRpdmUgY29vcmRpbmF0ZXMgdG8gbWFwIGNvb3JkaW5hdGVzXHJcblx0XHRcdHZhciBtYXBYID0gc3RhcnRYICsgZHggKiB4eCArIGR5ICogeHk7XHJcblx0XHRcdHZhciBtYXBZID0gc3RhcnRZICsgZHggKiB5eCArIGR5ICogeXk7XHJcblxyXG5cdFx0XHQvL1JhbmdlIG9mIHRoZSByb3dcclxuXHRcdFx0dmFyIHNsb3BlU3RhcnQgPSAoZHggLSAwLjUpIC8gKGR5ICsgMC41KTtcclxuXHRcdFx0dmFyIHNsb3BlRW5kID0gKGR4ICsgMC41KSAvIChkeSAtIDAuNSk7XHJcblx0XHRcclxuXHRcdFx0Ly9JZ25vcmUgaWYgbm90IHlldCBhdCBsZWZ0IGVkZ2Ugb2YgT2N0YW50XHJcblx0XHRcdGlmKHNsb3BlRW5kID4gdmlzU2xvcGVTdGFydCkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHRcclxuXHRcdFx0Ly9Eb25lIGlmIHBhc3QgcmlnaHQgZWRnZVxyXG5cdFx0XHRpZihzbG9wZVN0YXJ0IDwgdmlzU2xvcGVFbmQpIHsgYnJlYWs7IH1cclxuXHRcdFx0XHRcclxuXHRcdFx0Ly9JZiBpdCdzIGluIHJhbmdlLCBpdCdzIHZpc2libGVcclxuXHRcdFx0aWYoKGR4ICogZHggKyBkeSAqIGR5KSA8IChyYWRpdXMgKiByYWRpdXMpKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2sobWFwWCwgbWFwWSwgaSwgMSk7XHJcblx0XHRcdH1cclxuXHRcclxuXHRcdFx0aWYoIWJsb2NrZWQpIHtcclxuXHRcdFx0XHQvL0lmIHRpbGUgaXMgYSBibG9ja2luZyB0aWxlLCBjYXN0IGFyb3VuZCBpdFxyXG5cdFx0XHRcdGlmKCF0aGlzLl9saWdodFBhc3NlcyhtYXBYLCBtYXBZKSAmJiBpIDwgcmFkaXVzKSB7XHJcblx0XHRcdFx0XHRibG9ja2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHRoaXMuX2Nhc3RWaXNpYmlsaXR5KHN0YXJ0WCwgc3RhcnRZLCBpICsgMSwgdmlzU2xvcGVTdGFydCwgc2xvcGVTdGFydCwgcmFkaXVzLCB4eCwgeHksIHl4LCB5eSwgY2FsbGJhY2spO1xyXG5cdFx0XHRcdFx0bmV3U3RhcnQgPSBzbG9wZUVuZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly9LZWVwIG5hcnJvd2luZyBpZiBzY2FubmluZyBhY3Jvc3MgYSBibG9ja1xyXG5cdFx0XHRcdGlmKCF0aGlzLl9saWdodFBhc3NlcyhtYXBYLCBtYXBZKSkge1xyXG5cdFx0XHRcdFx0bmV3U3RhcnQgPSBzbG9wZUVuZDtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdFx0Ly9CbG9jayBoYXMgZW5kZWRcclxuXHRcdFx0XHRibG9ja2VkID0gZmFsc2U7XHJcblx0XHRcdFx0dmlzU2xvcGVTdGFydCA9IG5ld1N0YXJ0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZihibG9ja2VkKSB7IGJyZWFrOyB9XHJcblx0fVxyXG59O1xyXG4vKipcclxuICogQG5hbWVzcGFjZSBDb2xvciBvcGVyYXRpb25zXHJcbiAqL1xyXG5ST1QuQ29sb3IgPSB7XHJcblx0ZnJvbVN0cmluZzogZnVuY3Rpb24oc3RyKSB7XHJcblx0XHR2YXIgY2FjaGVkLCByO1xyXG5cdFx0aWYgKHN0ciBpbiB0aGlzLl9jYWNoZSkge1xyXG5cdFx0XHRjYWNoZWQgPSB0aGlzLl9jYWNoZVtzdHJdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHN0ci5jaGFyQXQoMCkgPT0gXCIjXCIpIHsgLyogaGV4IHJnYiAqL1xyXG5cclxuXHRcdFx0XHR2YXIgdmFsdWVzID0gc3RyLm1hdGNoKC9bMC05YS1mXS9naSkubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHBhcnNlSW50KHgsIDE2KTsgfSk7XHJcblx0XHRcdFx0aWYgKHZhbHVlcy5sZW5ndGggPT0gMykge1xyXG5cdFx0XHRcdFx0Y2FjaGVkID0gdmFsdWVzLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiB4KjE3OyB9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFsdWVzW2krMV0gKz0gMTYqdmFsdWVzW2ldO1xyXG5cdFx0XHRcdFx0XHR2YWx1ZXMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2FjaGVkID0gdmFsdWVzO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoKHIgPSBzdHIubWF0Y2goL3JnYlxcKChbMC05LCBdKylcXCkvaSkpKSB7IC8qIGRlY2ltYWwgcmdiICovXHJcblx0XHRcdFx0Y2FjaGVkID0gclsxXS5zcGxpdCgvXFxzKixcXHMqLykubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHBhcnNlSW50KHgpOyB9KTtcclxuXHRcdFx0fSBlbHNlIHsgLyogaHRtbCBuYW1lICovXHJcblx0XHRcdFx0Y2FjaGVkID0gWzAsIDAsIDBdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9jYWNoZVtzdHJdID0gY2FjaGVkO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjYWNoZWQuc2xpY2UoKTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBBZGQgdHdvIG9yIG1vcmUgY29sb3JzXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdGFkZDogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcclxuXHRcdHZhciByZXN1bHQgPSBjb2xvcjEuc2xpY2UoKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0cmVzdWx0W2ldICs9IGFyZ3VtZW50c1tqXVtpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBBZGQgdHdvIG9yIG1vcmUgY29sb3JzLCBNT0RJRklFUyBGSVJTVCBBUkdVTUVOVFxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRhZGRfOiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMikge1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0xO2o8YXJndW1lbnRzLmxlbmd0aDtqKyspIHtcclxuXHRcdFx0XHRjb2xvcjFbaV0gKz0gYXJndW1lbnRzW2pdW2ldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29sb3IxO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIE11bHRpcGx5IChtaXgpIHR3byBvciBtb3JlIGNvbG9yc1xyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRtdWx0aXBseTogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcclxuXHRcdHZhciByZXN1bHQgPSBjb2xvcjEuc2xpY2UoKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0cmVzdWx0W2ldICo9IGFyZ3VtZW50c1tqXVtpXSAvIDI1NTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXN1bHRbaV0gPSBNYXRoLnJvdW5kKHJlc3VsdFtpXSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIE11bHRpcGx5IChtaXgpIHR3byBvciBtb3JlIGNvbG9ycywgTU9ESUZJRVMgRklSU1QgQVJHVU1FTlRcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0bXVsdGlwbHlfOiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMikge1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0xO2o8YXJndW1lbnRzLmxlbmd0aDtqKyspIHtcclxuXHRcdFx0XHRjb2xvcjFbaV0gKj0gYXJndW1lbnRzW2pdW2ldIC8gMjU1O1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbG9yMVtpXSA9IE1hdGgucm91bmQoY29sb3IxW2ldKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjb2xvcjE7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogSW50ZXJwb2xhdGUgKGJsZW5kKSB0d28gY29sb3JzIHdpdGggYSBnaXZlbiBmYWN0b3JcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbZmFjdG9yPTAuNV0gMC4uMVxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRpbnRlcnBvbGF0ZTogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIsIGZhY3Rvcikge1xyXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7IGZhY3RvciA9IDAuNTsgfVxyXG5cdFx0dmFyIHJlc3VsdCA9IGNvbG9yMS5zbGljZSgpO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0cmVzdWx0W2ldID0gTWF0aC5yb3VuZChyZXN1bHRbaV0gKyBmYWN0b3IqKGNvbG9yMltpXS1jb2xvcjFbaV0pKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogSW50ZXJwb2xhdGUgKGJsZW5kKSB0d28gY29sb3JzIHdpdGggYSBnaXZlbiBmYWN0b3IgaW4gSFNMIG1vZGVcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbZmFjdG9yPTAuNV0gMC4uMVxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRpbnRlcnBvbGF0ZUhTTDogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIsIGZhY3Rvcikge1xyXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7IGZhY3RvciA9IDAuNTsgfVxyXG5cdFx0dmFyIGhzbDEgPSB0aGlzLnJnYjJoc2woY29sb3IxKTtcclxuXHRcdHZhciBoc2wyID0gdGhpcy5yZ2IyaHNsKGNvbG9yMik7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRoc2wxW2ldICs9IGZhY3RvciooaHNsMltpXS1oc2wxW2ldKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzLmhzbDJyZ2IoaHNsMSk7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlIGEgbmV3IHJhbmRvbSBjb2xvciBiYXNlZCBvbiB0aGlzIG9uZVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gZGlmZiBTZXQgb2Ygc3RhbmRhcmQgZGV2aWF0aW9uc1xyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRyYW5kb21pemU6IGZ1bmN0aW9uKGNvbG9yLCBkaWZmKSB7XHJcblx0XHRpZiAoIShkaWZmIGluc3RhbmNlb2YgQXJyYXkpKSB7IGRpZmYgPSBNYXRoLnJvdW5kKFJPVC5STkcuZ2V0Tm9ybWFsKDAsIGRpZmYpKTsgfVxyXG5cdFx0dmFyIHJlc3VsdCA9IGNvbG9yLnNsaWNlKCk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRyZXN1bHRbaV0gKz0gKGRpZmYgaW5zdGFuY2VvZiBBcnJheSA/IE1hdGgucm91bmQoUk9ULlJORy5nZXROb3JtYWwoMCwgZGlmZltpXSkpIDogZGlmZik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbnZlcnRzIGFuIFJHQiBjb2xvciB2YWx1ZSB0byBIU0wuIEV4cGVjdHMgMC4uMjU1IGlucHV0cywgcHJvZHVjZXMgMC4uMSBvdXRwdXRzLlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdHJnYjJoc2w6IGZ1bmN0aW9uKGNvbG9yKSB7XHJcblx0XHR2YXIgciA9IGNvbG9yWzBdLzI1NTtcclxuXHRcdHZhciBnID0gY29sb3JbMV0vMjU1O1xyXG5cdFx0dmFyIGIgPSBjb2xvclsyXS8yNTU7XHJcblxyXG5cdFx0dmFyIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLCBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcclxuXHRcdHZhciBoLCBzLCBsID0gKG1heCArIG1pbikgLyAyO1xyXG5cclxuXHRcdGlmIChtYXggPT0gbWluKSB7XHJcblx0XHRcdGggPSBzID0gMDsgLy8gYWNocm9tYXRpY1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGQgPSBtYXggLSBtaW47XHJcblx0XHRcdHMgPSAobCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbikpO1xyXG5cdFx0XHRzd2l0Y2gobWF4KSB7XHJcblx0XHRcdFx0Y2FzZSByOiBoID0gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCk7IGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgZzogaCA9IChiIC0gcikgLyBkICsgMjsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBiOiBoID0gKHIgLSBnKSAvIGQgKyA0OyBicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0XHRoIC89IDY7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIFtoLCBzLCBsXTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0cyBhbiBIU0wgY29sb3IgdmFsdWUgdG8gUkdCLiBFeHBlY3RzIDAuLjEgaW5wdXRzLCBwcm9kdWNlcyAwLi4yNTUgb3V0cHV0cy5cclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRoc2wycmdiOiBmdW5jdGlvbihjb2xvcikge1xyXG5cdFx0dmFyIGwgPSBjb2xvclsyXTtcclxuXHJcblx0XHRpZiAoY29sb3JbMV0gPT0gMCkge1xyXG5cdFx0XHRsID0gTWF0aC5yb3VuZChsKjI1NSk7XHJcblx0XHRcdHJldHVybiBbbCwgbCwgbF07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgaHVlMnJnYiA9IGZ1bmN0aW9uKHAsIHEsIHQpIHtcclxuXHRcdFx0XHRpZiAodCA8IDApIHQgKz0gMTtcclxuXHRcdFx0XHRpZiAodCA+IDEpIHQgLT0gMTtcclxuXHRcdFx0XHRpZiAodCA8IDEvNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XHJcblx0XHRcdFx0aWYgKHQgPCAxLzIpIHJldHVybiBxO1xyXG5cdFx0XHRcdGlmICh0IDwgMi8zKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMi8zIC0gdCkgKiA2O1xyXG5cdFx0XHRcdHJldHVybiBwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgcyA9IGNvbG9yWzFdO1xyXG5cdFx0XHR2YXIgcSA9IChsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzKTtcclxuXHRcdFx0dmFyIHAgPSAyICogbCAtIHE7XHJcblx0XHRcdHZhciByID0gaHVlMnJnYihwLCBxLCBjb2xvclswXSArIDEvMyk7XHJcblx0XHRcdHZhciBnID0gaHVlMnJnYihwLCBxLCBjb2xvclswXSk7XHJcblx0XHRcdHZhciBiID0gaHVlMnJnYihwLCBxLCBjb2xvclswXSAtIDEvMyk7XHJcblx0XHRcdHJldHVybiBbTWF0aC5yb3VuZChyKjI1NSksIE1hdGgucm91bmQoZyoyNTUpLCBNYXRoLnJvdW5kKGIqMjU1KV07XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0dG9SR0I6IGZ1bmN0aW9uKGNvbG9yKSB7XHJcblx0XHRyZXR1cm4gXCJyZ2IoXCIgKyB0aGlzLl9jbGFtcChjb2xvclswXSkgKyBcIixcIiArIHRoaXMuX2NsYW1wKGNvbG9yWzFdKSArIFwiLFwiICsgdGhpcy5fY2xhbXAoY29sb3JbMl0pICsgXCIpXCI7XHJcblx0fSxcclxuXHJcblx0dG9IZXg6IGZ1bmN0aW9uKGNvbG9yKSB7XHJcblx0XHR2YXIgcGFydHMgPSBbXTtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdHBhcnRzLnB1c2godGhpcy5fY2xhbXAoY29sb3JbaV0pLnRvU3RyaW5nKDE2KS5scGFkKFwiMFwiLCAyKSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gXCIjXCIgKyBwYXJ0cy5qb2luKFwiXCIpO1xyXG5cdH0sXHJcblxyXG5cdF9jbGFtcDogZnVuY3Rpb24obnVtKSB7XHJcblx0XHRpZiAobnVtIDwgMCkge1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH0gZWxzZSBpZiAobnVtID4gMjU1KSB7XHJcblx0XHRcdHJldHVybiAyNTU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gbnVtO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF9jYWNoZToge1xyXG5cdFx0XCJibGFja1wiOiBbMCwwLDBdLFxyXG5cdFx0XCJuYXZ5XCI6IFswLDAsMTI4XSxcclxuXHRcdFwiZGFya2JsdWVcIjogWzAsMCwxMzldLFxyXG5cdFx0XCJtZWRpdW1ibHVlXCI6IFswLDAsMjA1XSxcclxuXHRcdFwiYmx1ZVwiOiBbMCwwLDI1NV0sXHJcblx0XHRcImRhcmtncmVlblwiOiBbMCwxMDAsMF0sXHJcblx0XHRcImdyZWVuXCI6IFswLDEyOCwwXSxcclxuXHRcdFwidGVhbFwiOiBbMCwxMjgsMTI4XSxcclxuXHRcdFwiZGFya2N5YW5cIjogWzAsMTM5LDEzOV0sXHJcblx0XHRcImRlZXBza3libHVlXCI6IFswLDE5MSwyNTVdLFxyXG5cdFx0XCJkYXJrdHVycXVvaXNlXCI6IFswLDIwNiwyMDldLFxyXG5cdFx0XCJtZWRpdW1zcHJpbmdncmVlblwiOiBbMCwyNTAsMTU0XSxcclxuXHRcdFwibGltZVwiOiBbMCwyNTUsMF0sXHJcblx0XHRcInNwcmluZ2dyZWVuXCI6IFswLDI1NSwxMjddLFxyXG5cdFx0XCJhcXVhXCI6IFswLDI1NSwyNTVdLFxyXG5cdFx0XCJjeWFuXCI6IFswLDI1NSwyNTVdLFxyXG5cdFx0XCJtaWRuaWdodGJsdWVcIjogWzI1LDI1LDExMl0sXHJcblx0XHRcImRvZGdlcmJsdWVcIjogWzMwLDE0NCwyNTVdLFxyXG5cdFx0XCJmb3Jlc3RncmVlblwiOiBbMzQsMTM5LDM0XSxcclxuXHRcdFwic2VhZ3JlZW5cIjogWzQ2LDEzOSw4N10sXHJcblx0XHRcImRhcmtzbGF0ZWdyYXlcIjogWzQ3LDc5LDc5XSxcclxuXHRcdFwiZGFya3NsYXRlZ3JleVwiOiBbNDcsNzksNzldLFxyXG5cdFx0XCJsaW1lZ3JlZW5cIjogWzUwLDIwNSw1MF0sXHJcblx0XHRcIm1lZGl1bXNlYWdyZWVuXCI6IFs2MCwxNzksMTEzXSxcclxuXHRcdFwidHVycXVvaXNlXCI6IFs2NCwyMjQsMjA4XSxcclxuXHRcdFwicm95YWxibHVlXCI6IFs2NSwxMDUsMjI1XSxcclxuXHRcdFwic3RlZWxibHVlXCI6IFs3MCwxMzAsMTgwXSxcclxuXHRcdFwiZGFya3NsYXRlYmx1ZVwiOiBbNzIsNjEsMTM5XSxcclxuXHRcdFwibWVkaXVtdHVycXVvaXNlXCI6IFs3MiwyMDksMjA0XSxcclxuXHRcdFwiaW5kaWdvXCI6IFs3NSwwLDEzMF0sXHJcblx0XHRcImRhcmtvbGl2ZWdyZWVuXCI6IFs4NSwxMDcsNDddLFxyXG5cdFx0XCJjYWRldGJsdWVcIjogWzk1LDE1OCwxNjBdLFxyXG5cdFx0XCJjb3JuZmxvd2VyYmx1ZVwiOiBbMTAwLDE0OSwyMzddLFxyXG5cdFx0XCJtZWRpdW1hcXVhbWFyaW5lXCI6IFsxMDIsMjA1LDE3MF0sXHJcblx0XHRcImRpbWdyYXlcIjogWzEwNSwxMDUsMTA1XSxcclxuXHRcdFwiZGltZ3JleVwiOiBbMTA1LDEwNSwxMDVdLFxyXG5cdFx0XCJzbGF0ZWJsdWVcIjogWzEwNiw5MCwyMDVdLFxyXG5cdFx0XCJvbGl2ZWRyYWJcIjogWzEwNywxNDIsMzVdLFxyXG5cdFx0XCJzbGF0ZWdyYXlcIjogWzExMiwxMjgsMTQ0XSxcclxuXHRcdFwic2xhdGVncmV5XCI6IFsxMTIsMTI4LDE0NF0sXHJcblx0XHRcImxpZ2h0c2xhdGVncmF5XCI6IFsxMTksMTM2LDE1M10sXHJcblx0XHRcImxpZ2h0c2xhdGVncmV5XCI6IFsxMTksMTM2LDE1M10sXHJcblx0XHRcIm1lZGl1bXNsYXRlYmx1ZVwiOiBbMTIzLDEwNCwyMzhdLFxyXG5cdFx0XCJsYXduZ3JlZW5cIjogWzEyNCwyNTIsMF0sXHJcblx0XHRcImNoYXJ0cmV1c2VcIjogWzEyNywyNTUsMF0sXHJcblx0XHRcImFxdWFtYXJpbmVcIjogWzEyNywyNTUsMjEyXSxcclxuXHRcdFwibWFyb29uXCI6IFsxMjgsMCwwXSxcclxuXHRcdFwicHVycGxlXCI6IFsxMjgsMCwxMjhdLFxyXG5cdFx0XCJvbGl2ZVwiOiBbMTI4LDEyOCwwXSxcclxuXHRcdFwiZ3JheVwiOiBbMTI4LDEyOCwxMjhdLFxyXG5cdFx0XCJncmV5XCI6IFsxMjgsMTI4LDEyOF0sXHJcblx0XHRcInNreWJsdWVcIjogWzEzNSwyMDYsMjM1XSxcclxuXHRcdFwibGlnaHRza3libHVlXCI6IFsxMzUsMjA2LDI1MF0sXHJcblx0XHRcImJsdWV2aW9sZXRcIjogWzEzOCw0MywyMjZdLFxyXG5cdFx0XCJkYXJrcmVkXCI6IFsxMzksMCwwXSxcclxuXHRcdFwiZGFya21hZ2VudGFcIjogWzEzOSwwLDEzOV0sXHJcblx0XHRcInNhZGRsZWJyb3duXCI6IFsxMzksNjksMTldLFxyXG5cdFx0XCJkYXJrc2VhZ3JlZW5cIjogWzE0MywxODgsMTQzXSxcclxuXHRcdFwibGlnaHRncmVlblwiOiBbMTQ0LDIzOCwxNDRdLFxyXG5cdFx0XCJtZWRpdW1wdXJwbGVcIjogWzE0NywxMTIsMjE2XSxcclxuXHRcdFwiZGFya3Zpb2xldFwiOiBbMTQ4LDAsMjExXSxcclxuXHRcdFwicGFsZWdyZWVuXCI6IFsxNTIsMjUxLDE1Ml0sXHJcblx0XHRcImRhcmtvcmNoaWRcIjogWzE1Myw1MCwyMDRdLFxyXG5cdFx0XCJ5ZWxsb3dncmVlblwiOiBbMTU0LDIwNSw1MF0sXHJcblx0XHRcInNpZW5uYVwiOiBbMTYwLDgyLDQ1XSxcclxuXHRcdFwiYnJvd25cIjogWzE2NSw0Miw0Ml0sXHJcblx0XHRcImRhcmtncmF5XCI6IFsxNjksMTY5LDE2OV0sXHJcblx0XHRcImRhcmtncmV5XCI6IFsxNjksMTY5LDE2OV0sXHJcblx0XHRcImxpZ2h0Ymx1ZVwiOiBbMTczLDIxNiwyMzBdLFxyXG5cdFx0XCJncmVlbnllbGxvd1wiOiBbMTczLDI1NSw0N10sXHJcblx0XHRcInBhbGV0dXJxdW9pc2VcIjogWzE3NSwyMzgsMjM4XSxcclxuXHRcdFwibGlnaHRzdGVlbGJsdWVcIjogWzE3NiwxOTYsMjIyXSxcclxuXHRcdFwicG93ZGVyYmx1ZVwiOiBbMTc2LDIyNCwyMzBdLFxyXG5cdFx0XCJmaXJlYnJpY2tcIjogWzE3OCwzNCwzNF0sXHJcblx0XHRcImRhcmtnb2xkZW5yb2RcIjogWzE4NCwxMzQsMTFdLFxyXG5cdFx0XCJtZWRpdW1vcmNoaWRcIjogWzE4Niw4NSwyMTFdLFxyXG5cdFx0XCJyb3N5YnJvd25cIjogWzE4OCwxNDMsMTQzXSxcclxuXHRcdFwiZGFya2toYWtpXCI6IFsxODksMTgzLDEwN10sXHJcblx0XHRcInNpbHZlclwiOiBbMTkyLDE5MiwxOTJdLFxyXG5cdFx0XCJtZWRpdW12aW9sZXRyZWRcIjogWzE5OSwyMSwxMzNdLFxyXG5cdFx0XCJpbmRpYW5yZWRcIjogWzIwNSw5Miw5Ml0sXHJcblx0XHRcInBlcnVcIjogWzIwNSwxMzMsNjNdLFxyXG5cdFx0XCJjaG9jb2xhdGVcIjogWzIxMCwxMDUsMzBdLFxyXG5cdFx0XCJ0YW5cIjogWzIxMCwxODAsMTQwXSxcclxuXHRcdFwibGlnaHRncmF5XCI6IFsyMTEsMjExLDIxMV0sXHJcblx0XHRcImxpZ2h0Z3JleVwiOiBbMjExLDIxMSwyMTFdLFxyXG5cdFx0XCJwYWxldmlvbGV0cmVkXCI6IFsyMTYsMTEyLDE0N10sXHJcblx0XHRcInRoaXN0bGVcIjogWzIxNiwxOTEsMjE2XSxcclxuXHRcdFwib3JjaGlkXCI6IFsyMTgsMTEyLDIxNF0sXHJcblx0XHRcImdvbGRlbnJvZFwiOiBbMjE4LDE2NSwzMl0sXHJcblx0XHRcImNyaW1zb25cIjogWzIyMCwyMCw2MF0sXHJcblx0XHRcImdhaW5zYm9yb1wiOiBbMjIwLDIyMCwyMjBdLFxyXG5cdFx0XCJwbHVtXCI6IFsyMjEsMTYwLDIyMV0sXHJcblx0XHRcImJ1cmx5d29vZFwiOiBbMjIyLDE4NCwxMzVdLFxyXG5cdFx0XCJsaWdodGN5YW5cIjogWzIyNCwyNTUsMjU1XSxcclxuXHRcdFwibGF2ZW5kZXJcIjogWzIzMCwyMzAsMjUwXSxcclxuXHRcdFwiZGFya3NhbG1vblwiOiBbMjMzLDE1MCwxMjJdLFxyXG5cdFx0XCJ2aW9sZXRcIjogWzIzOCwxMzAsMjM4XSxcclxuXHRcdFwicGFsZWdvbGRlbnJvZFwiOiBbMjM4LDIzMiwxNzBdLFxyXG5cdFx0XCJsaWdodGNvcmFsXCI6IFsyNDAsMTI4LDEyOF0sXHJcblx0XHRcImtoYWtpXCI6IFsyNDAsMjMwLDE0MF0sXHJcblx0XHRcImFsaWNlYmx1ZVwiOiBbMjQwLDI0OCwyNTVdLFxyXG5cdFx0XCJob25leWRld1wiOiBbMjQwLDI1NSwyNDBdLFxyXG5cdFx0XCJhenVyZVwiOiBbMjQwLDI1NSwyNTVdLFxyXG5cdFx0XCJzYW5keWJyb3duXCI6IFsyNDQsMTY0LDk2XSxcclxuXHRcdFwid2hlYXRcIjogWzI0NSwyMjIsMTc5XSxcclxuXHRcdFwiYmVpZ2VcIjogWzI0NSwyNDUsMjIwXSxcclxuXHRcdFwid2hpdGVzbW9rZVwiOiBbMjQ1LDI0NSwyNDVdLFxyXG5cdFx0XCJtaW50Y3JlYW1cIjogWzI0NSwyNTUsMjUwXSxcclxuXHRcdFwiZ2hvc3R3aGl0ZVwiOiBbMjQ4LDI0OCwyNTVdLFxyXG5cdFx0XCJzYWxtb25cIjogWzI1MCwxMjgsMTE0XSxcclxuXHRcdFwiYW50aXF1ZXdoaXRlXCI6IFsyNTAsMjM1LDIxNV0sXHJcblx0XHRcImxpbmVuXCI6IFsyNTAsMjQwLDIzMF0sXHJcblx0XHRcImxpZ2h0Z29sZGVucm9keWVsbG93XCI6IFsyNTAsMjUwLDIxMF0sXHJcblx0XHRcIm9sZGxhY2VcIjogWzI1MywyNDUsMjMwXSxcclxuXHRcdFwicmVkXCI6IFsyNTUsMCwwXSxcclxuXHRcdFwiZnVjaHNpYVwiOiBbMjU1LDAsMjU1XSxcclxuXHRcdFwibWFnZW50YVwiOiBbMjU1LDAsMjU1XSxcclxuXHRcdFwiZGVlcHBpbmtcIjogWzI1NSwyMCwxNDddLFxyXG5cdFx0XCJvcmFuZ2VyZWRcIjogWzI1NSw2OSwwXSxcclxuXHRcdFwidG9tYXRvXCI6IFsyNTUsOTksNzFdLFxyXG5cdFx0XCJob3RwaW5rXCI6IFsyNTUsMTA1LDE4MF0sXHJcblx0XHRcImNvcmFsXCI6IFsyNTUsMTI3LDgwXSxcclxuXHRcdFwiZGFya29yYW5nZVwiOiBbMjU1LDE0MCwwXSxcclxuXHRcdFwibGlnaHRzYWxtb25cIjogWzI1NSwxNjAsMTIyXSxcclxuXHRcdFwib3JhbmdlXCI6IFsyNTUsMTY1LDBdLFxyXG5cdFx0XCJsaWdodHBpbmtcIjogWzI1NSwxODIsMTkzXSxcclxuXHRcdFwicGlua1wiOiBbMjU1LDE5MiwyMDNdLFxyXG5cdFx0XCJnb2xkXCI6IFsyNTUsMjE1LDBdLFxyXG5cdFx0XCJwZWFjaHB1ZmZcIjogWzI1NSwyMTgsMTg1XSxcclxuXHRcdFwibmF2YWpvd2hpdGVcIjogWzI1NSwyMjIsMTczXSxcclxuXHRcdFwibW9jY2FzaW5cIjogWzI1NSwyMjgsMTgxXSxcclxuXHRcdFwiYmlzcXVlXCI6IFsyNTUsMjI4LDE5Nl0sXHJcblx0XHRcIm1pc3R5cm9zZVwiOiBbMjU1LDIyOCwyMjVdLFxyXG5cdFx0XCJibGFuY2hlZGFsbW9uZFwiOiBbMjU1LDIzNSwyMDVdLFxyXG5cdFx0XCJwYXBheWF3aGlwXCI6IFsyNTUsMjM5LDIxM10sXHJcblx0XHRcImxhdmVuZGVyYmx1c2hcIjogWzI1NSwyNDAsMjQ1XSxcclxuXHRcdFwic2Vhc2hlbGxcIjogWzI1NSwyNDUsMjM4XSxcclxuXHRcdFwiY29ybnNpbGtcIjogWzI1NSwyNDgsMjIwXSxcclxuXHRcdFwibGVtb25jaGlmZm9uXCI6IFsyNTUsMjUwLDIwNV0sXHJcblx0XHRcImZsb3JhbHdoaXRlXCI6IFsyNTUsMjUwLDI0MF0sXHJcblx0XHRcInNub3dcIjogWzI1NSwyNTAsMjUwXSxcclxuXHRcdFwieWVsbG93XCI6IFsyNTUsMjU1LDBdLFxyXG5cdFx0XCJsaWdodHllbGxvd1wiOiBbMjU1LDI1NSwyMjRdLFxyXG5cdFx0XCJpdm9yeVwiOiBbMjU1LDI1NSwyNDBdLFxyXG5cdFx0XCJ3aGl0ZVwiOiBbMjU1LDI1NSwyNTVdXHJcblx0fVxyXG59O1xyXG4vKipcclxuICogQGNsYXNzIExpZ2h0aW5nIGNvbXB1dGF0aW9uLCBiYXNlZCBvbiBhIHRyYWRpdGlvbmFsIEZPViBmb3IgbXVsdGlwbGUgbGlnaHQgc291cmNlcyBhbmQgbXVsdGlwbGUgcGFzc2VzLlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSByZWZsZWN0aXZpdHlDYWxsYmFjayBDYWxsYmFjayB0byByZXRyaWV2ZSBjZWxsIHJlZmxlY3Rpdml0eSAoMC4uMSlcclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucGFzc2VzPTFdIE51bWJlciBvZiBwYXNzZXMuIDEgZXF1YWxzIHRvIHNpbXBsZSBGT1Ygb2YgYWxsIGxpZ2h0IHNvdXJjZXMsID4xIG1lYW5zIGEgKmhpZ2hseSBzaW1wbGlmaWVkKiByYWRpb3NpdHktbGlrZSBhbGdvcml0aG0uXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5lbWlzc2lvblRocmVzaG9sZD0xMDBdIENlbGxzIHdpdGggZW1pc3Npdml0eSA+IHRocmVzaG9sZCB3aWxsIGJlIHRyZWF0ZWQgYXMgbGlnaHQgc291cmNlIGluIHRoZSBuZXh0IHBhc3MuXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5yYW5nZT0xMF0gTWF4IGxpZ2h0IHJhbmdlXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcgPSBmdW5jdGlvbihyZWZsZWN0aXZpdHlDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdHRoaXMuX3JlZmxlY3Rpdml0eUNhbGxiYWNrID0gcmVmbGVjdGl2aXR5Q2FsbGJhY2s7XHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdHBhc3NlczogMSxcclxuXHRcdGVtaXNzaW9uVGhyZXNob2xkOiAxMDAsXHJcblx0XHRyYW5nZTogMTBcclxuXHR9O1xyXG5cdHRoaXMuX2ZvdiA9IG51bGw7XHJcblxyXG5cdHRoaXMuX2xpZ2h0cyA9IHt9O1xyXG5cdHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlID0ge307XHJcblx0dGhpcy5fZm92Q2FjaGUgPSB7fTtcclxuXHJcblx0dGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCBvcHRpb25zIGF0IHJ1bnRpbWVcclxuICogQHNlZSBST1QuTGlnaHRpbmdcclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cdGlmIChvcHRpb25zICYmIG9wdGlvbnMucmFuZ2UpIHsgdGhpcy5yZXNldCgpOyB9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHRoZSB1c2VkIEZpZWxkLU9mLVZpZXcgYWxnb1xyXG4gKiBAcGFyYW0ge1JPVC5GT1Z9IGZvdlxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5zZXRGT1YgPSBmdW5jdGlvbihmb3YpIHtcclxuXHR0aGlzLl9mb3YgPSBmb3Y7XHJcblx0dGhpcy5fZm92Q2FjaGUgPSB7fTtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgKG9yIHJlbW92ZSkgYSBsaWdodCBzb3VyY2VcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtudWxsIHx8IHN0cmluZyB8fCBudW1iZXJbM119IGNvbG9yXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLnNldExpZ2h0ID0gZnVuY3Rpb24oeCwgeSwgY29sb3IpIHtcclxuICB2YXIga2V5ID0geCArIFwiLFwiICsgeTtcclxuXHJcbiAgaWYgKGNvbG9yKSB7XHJcbiAgICB0aGlzLl9saWdodHNba2V5XSA9ICh0eXBlb2YoY29sb3IpID09IFwic3RyaW5nXCIgPyBST1QuQ29sb3IuZnJvbVN0cmluZyhjb2xvcikgOiBjb2xvcik7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9saWdodHNba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGFsbCBsaWdodCBzb3VyY2VzXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLmNsZWFyTGlnaHRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9saWdodHMgPSB7fTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXNldCB0aGUgcHJlLWNvbXB1dGVkIHRvcG9sb2d5IHZhbHVlcy4gQ2FsbCB3aGVuZXZlciB0aGUgdW5kZXJseWluZyBtYXAgY2hhbmdlcyBpdHMgbGlnaHQtcGFzc2FiaWxpdHkuXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGUgPSB7fTtcclxuXHR0aGlzLl9mb3ZDYWNoZSA9IHt9O1xyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHRoZSBsaWdodGluZ1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaWdodGluZ0NhbGxiYWNrIFdpbGwgYmUgY2FsbGVkIHdpdGggKHgsIHksIGNvbG9yKSBmb3IgZXZlcnkgbGl0IGNlbGxcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKGxpZ2h0aW5nQ2FsbGJhY2spIHtcclxuXHR2YXIgZG9uZUNlbGxzID0ge307XHJcblx0dmFyIGVtaXR0aW5nQ2VsbHMgPSB7fTtcclxuXHR2YXIgbGl0Q2VsbHMgPSB7fTtcclxuXHJcblx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2xpZ2h0cykgeyAvKiBwcmVwYXJlIGVtaXR0ZXJzIGZvciBmaXJzdCBwYXNzICovXHJcblx0XHR2YXIgbGlnaHQgPSB0aGlzLl9saWdodHNba2V5XTtcclxuXHRcdGVtaXR0aW5nQ2VsbHNba2V5XSA9IFswLCAwLCAwXTtcclxuXHRcdFJPVC5Db2xvci5hZGRfKGVtaXR0aW5nQ2VsbHNba2V5XSwgbGlnaHQpO1xyXG5cdH1cclxuXHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fb3B0aW9ucy5wYXNzZXM7aSsrKSB7IC8qIG1haW4gbG9vcCAqL1xyXG5cdFx0dGhpcy5fZW1pdExpZ2h0KGVtaXR0aW5nQ2VsbHMsIGxpdENlbGxzLCBkb25lQ2VsbHMpO1xyXG5cdFx0aWYgKGkrMSA9PSB0aGlzLl9vcHRpb25zLnBhc3NlcykgeyBjb250aW51ZTsgfSAvKiBub3QgZm9yIHRoZSBsYXN0IHBhc3MgKi9cclxuXHRcdGVtaXR0aW5nQ2VsbHMgPSB0aGlzLl9jb21wdXRlRW1pdHRlcnMobGl0Q2VsbHMsIGRvbmVDZWxscyk7XHJcblx0fVxyXG5cclxuXHRmb3IgKHZhciBsaXRLZXkgaW4gbGl0Q2VsbHMpIHsgLyogbGV0IHRoZSB1c2VyIGtub3cgd2hhdCBhbmQgaG93IGlzIGxpdCAqL1xyXG5cdFx0dmFyIHBhcnRzID0gbGl0S2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdHZhciB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xyXG5cdFx0dmFyIHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XHJcblx0XHRsaWdodGluZ0NhbGxiYWNrKHgsIHksIGxpdENlbGxzW2xpdEtleV0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBvbmUgaXRlcmF0aW9uIGZyb20gYWxsIGVtaXR0aW5nIGNlbGxzXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBlbWl0dGluZ0NlbGxzIFRoZXNlIGVtaXQgbGlnaHRcclxuICogQHBhcmFtIHtvYmplY3R9IGxpdENlbGxzIEFkZCBwcm9qZWN0ZWQgbGlnaHQgdG8gdGhlc2VcclxuICogQHBhcmFtIHtvYmplY3R9IGRvbmVDZWxscyBUaGVzZSBhbHJlYWR5IGVtaXR0ZWQsIGZvcmJpZCB0aGVtIGZyb20gZnVydGhlciBjYWxjdWxhdGlvbnNcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuX2VtaXRMaWdodCA9IGZ1bmN0aW9uKGVtaXR0aW5nQ2VsbHMsIGxpdENlbGxzLCBkb25lQ2VsbHMpIHtcclxuXHRmb3IgKHZhciBrZXkgaW4gZW1pdHRpbmdDZWxscykge1xyXG5cdFx0dmFyIHBhcnRzID0ga2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdHZhciB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xyXG5cdFx0dmFyIHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XHJcblx0XHR0aGlzLl9lbWl0TGlnaHRGcm9tQ2VsbCh4LCB5LCBlbWl0dGluZ0NlbGxzW2tleV0sIGxpdENlbGxzKTtcclxuXHRcdGRvbmVDZWxsc1trZXldID0gMTtcclxuXHR9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUHJlcGFyZSBhIGxpc3Qgb2YgZW1pdHRlcnMgZm9yIG5leHQgcGFzc1xyXG4gKiBAcGFyYW0ge29iamVjdH0gbGl0Q2VsbHNcclxuICogQHBhcmFtIHtvYmplY3R9IGRvbmVDZWxsc1xyXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5fY29tcHV0ZUVtaXR0ZXJzID0gZnVuY3Rpb24obGl0Q2VsbHMsIGRvbmVDZWxscykge1xyXG5cdHZhciByZXN1bHQgPSB7fTtcclxuXHJcblx0Zm9yICh2YXIga2V5IGluIGxpdENlbGxzKSB7XHJcblx0XHRpZiAoa2V5IGluIGRvbmVDZWxscykgeyBjb250aW51ZTsgfSAvKiBhbHJlYWR5IGVtaXR0ZWQgKi9cclxuXHJcblx0XHR2YXIgY29sb3IgPSBsaXRDZWxsc1trZXldO1xyXG5cclxuXHRcdGlmIChrZXkgaW4gdGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGUpIHtcclxuXHRcdFx0dmFyIHJlZmxlY3Rpdml0eSA9IHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlW2tleV07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcGFydHMgPSBrZXkuc3BsaXQoXCIsXCIpO1xyXG5cdFx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcclxuXHRcdFx0dmFyIHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XHJcblx0XHRcdHZhciByZWZsZWN0aXZpdHkgPSB0aGlzLl9yZWZsZWN0aXZpdHlDYWxsYmFjayh4LCB5KTtcclxuXHRcdFx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGVba2V5XSA9IHJlZmxlY3Rpdml0eTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocmVmbGVjdGl2aXR5ID09IDApIHsgY29udGludWU7IH0gLyogd2lsbCBub3QgcmVmbGVjdCBhdCBhbGwgKi9cclxuXHJcblx0XHQvKiBjb21wdXRlIGVtaXNzaW9uIGNvbG9yICovXHJcblx0XHR2YXIgZW1pc3Npb24gPSBbXTtcclxuXHRcdHZhciBpbnRlbnNpdHkgPSAwO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0dmFyIHBhcnQgPSBNYXRoLnJvdW5kKGNvbG9yW2ldKnJlZmxlY3Rpdml0eSk7XHJcblx0XHRcdGVtaXNzaW9uW2ldID0gcGFydDtcclxuXHRcdFx0aW50ZW5zaXR5ICs9IHBhcnQ7XHJcblx0XHR9XHJcblx0XHRpZiAoaW50ZW5zaXR5ID4gdGhpcy5fb3B0aW9ucy5lbWlzc2lvblRocmVzaG9sZCkgeyByZXN1bHRba2V5XSA9IGVtaXNzaW9uOyB9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgb25lIGl0ZXJhdGlvbiBmcm9tIG9uZSBjZWxsXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBsaXRDZWxscyBDZWxsIGRhdGEgdG8gYnkgdXBkYXRlZFxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5fZW1pdExpZ2h0RnJvbUNlbGwgPSBmdW5jdGlvbih4LCB5LCBjb2xvciwgbGl0Q2VsbHMpIHtcclxuXHR2YXIga2V5ID0geCtcIixcIit5O1xyXG5cdGlmIChrZXkgaW4gdGhpcy5fZm92Q2FjaGUpIHtcclxuXHRcdHZhciBmb3YgPSB0aGlzLl9mb3ZDYWNoZVtrZXldO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgZm92ID0gdGhpcy5fdXBkYXRlRk9WKHgsIHkpO1xyXG5cdH1cclxuXHJcblx0Zm9yICh2YXIgZm92S2V5IGluIGZvdikge1xyXG5cdFx0dmFyIGZvcm1GYWN0b3IgPSBmb3ZbZm92S2V5XTtcclxuXHJcblx0XHRpZiAoZm92S2V5IGluIGxpdENlbGxzKSB7IC8qIGFscmVhZHkgbGl0ICovXHJcblx0XHRcdHZhciByZXN1bHQgPSBsaXRDZWxsc1tmb3ZLZXldO1xyXG5cdFx0fSBlbHNlIHsgLyogbmV3bHkgbGl0ICovXHJcblx0XHRcdHZhciByZXN1bHQgPSBbMCwgMCwgMF07XHJcblx0XHRcdGxpdENlbGxzW2ZvdktleV0gPSByZXN1bHQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHsgcmVzdWx0W2ldICs9IE1hdGgucm91bmQoY29sb3JbaV0qZm9ybUZhY3Rvcik7IH0gLyogYWRkIGxpZ2h0IGNvbG9yICovXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIEZPViAoXCJmb3JtIGZhY3RvclwiKSBmb3IgYSBwb3RlbnRpYWwgbGlnaHQgc291cmNlIGF0IFt4LHldXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLl91cGRhdGVGT1YgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0dmFyIGtleTEgPSB4K1wiLFwiK3k7XHJcblx0dmFyIGNhY2hlID0ge307XHJcblx0dGhpcy5fZm92Q2FjaGVba2V5MV0gPSBjYWNoZTtcclxuXHR2YXIgcmFuZ2UgPSB0aGlzLl9vcHRpb25zLnJhbmdlO1xyXG5cdHZhciBjYiA9IGZ1bmN0aW9uKHgsIHksIHIsIHZpcykge1xyXG5cdFx0dmFyIGtleTIgPSB4K1wiLFwiK3k7XHJcblx0XHR2YXIgZm9ybUZhY3RvciA9IHZpcyAqICgxLXIvcmFuZ2UpO1xyXG5cdFx0aWYgKGZvcm1GYWN0b3IgPT0gMCkgeyByZXR1cm47IH1cclxuXHRcdGNhY2hlW2tleTJdID0gZm9ybUZhY3RvcjtcclxuXHR9O1xyXG5cdHRoaXMuX2Zvdi5jb21wdXRlKHgsIHksIHJhbmdlLCBjYi5iaW5kKHRoaXMpKTtcclxuXHJcblx0cmV0dXJuIGNhY2hlO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEFic3RyYWN0IHBhdGhmaW5kZXJcclxuICogQHBhcmFtIHtpbnR9IHRvWCBUYXJnZXQgWCBjb29yZFxyXG4gKiBAcGFyYW0ge2ludH0gdG9ZIFRhcmdldCBZIGNvb3JkXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHBhc3NhYmxlQ2FsbGJhY2sgQ2FsbGJhY2sgdG8gZGV0ZXJtaW5lIG1hcCBwYXNzYWJpbGl0eVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50b3BvbG9neT04XVxyXG4gKi9cclxuUk9ULlBhdGggPSBmdW5jdGlvbih0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdHRoaXMuX3RvWCA9IHRvWDtcclxuXHR0aGlzLl90b1kgPSB0b1k7XHJcblx0dGhpcy5fZnJvbVggPSBudWxsO1xyXG5cdHRoaXMuX2Zyb21ZID0gbnVsbDtcclxuXHR0aGlzLl9wYXNzYWJsZUNhbGxiYWNrID0gcGFzc2FibGVDYWxsYmFjaztcclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0dG9wb2xvZ3k6IDhcclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cclxuXHR0aGlzLl9kaXJzID0gUk9ULkRJUlNbdGhpcy5fb3B0aW9ucy50b3BvbG9neV07XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gOCkgeyAvKiByZW9yZGVyIGRpcnMgZm9yIG1vcmUgYWVzdGhldGljIHJlc3VsdCAodmVydGljYWwvaG9yaXpvbnRhbCBmaXJzdCkgKi9cclxuXHRcdHRoaXMuX2RpcnMgPSBbXHJcblx0XHRcdHRoaXMuX2RpcnNbMF0sXHJcblx0XHRcdHRoaXMuX2RpcnNbMl0sXHJcblx0XHRcdHRoaXMuX2RpcnNbNF0sXHJcblx0XHRcdHRoaXMuX2RpcnNbNl0sXHJcblx0XHRcdHRoaXMuX2RpcnNbMV0sXHJcblx0XHRcdHRoaXMuX2RpcnNbM10sXHJcblx0XHRcdHRoaXMuX2RpcnNbNV0sXHJcblx0XHRcdHRoaXMuX2RpcnNbN11cclxuXHRcdF1cclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBhIHBhdGggZnJvbSBhIGdpdmVuIHBvaW50XHJcbiAqIEBwYXJhbSB7aW50fSBmcm9tWFxyXG4gKiBAcGFyYW0ge2ludH0gZnJvbVlcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgV2lsbCBiZSBjYWxsZWQgZm9yIGV2ZXJ5IHBhdGggaXRlbSB3aXRoIGFyZ3VtZW50cyBcInhcIiBhbmQgXCJ5XCJcclxuICovXHJcblJPVC5QYXRoLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZLCBjYWxsYmFjaykge1xyXG59O1xyXG5cclxuUk9ULlBhdGgucHJvdG90eXBlLl9nZXROZWlnaGJvcnMgPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHR2YXIgcmVzdWx0ID0gW107XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fZGlycy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgZGlyID0gdGhpcy5fZGlyc1tpXTtcclxuXHRcdHZhciB4ID0gY3ggKyBkaXJbMF07XHJcblx0XHR2YXIgeSA9IGN5ICsgZGlyWzFdO1xyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuX3Bhc3NhYmxlQ2FsbGJhY2soeCwgeSkpIHsgY29udGludWU7IH1cclxuXHRcdHJlc3VsdC5wdXNoKFt4LCB5XSk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgU2ltcGxpZmllZCBEaWprc3RyYSdzIGFsZ29yaXRobTogYWxsIGVkZ2VzIGhhdmUgYSB2YWx1ZSBvZiAxXHJcbiAqIEBhdWdtZW50cyBST1QuUGF0aFxyXG4gKiBAc2VlIFJPVC5QYXRoXHJcbiAqL1xyXG5ST1QuUGF0aC5EaWprc3RyYSA9IGZ1bmN0aW9uKHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0Uk9ULlBhdGguY2FsbCh0aGlzLCB0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucyk7XHJcblxyXG5cdHRoaXMuX2NvbXB1dGVkID0ge307XHJcblx0dGhpcy5fdG9kbyA9IFtdO1xyXG5cdHRoaXMuX2FkZCh0b1gsIHRvWSwgbnVsbCk7XHJcbn07XHJcblJPVC5QYXRoLkRpamtzdHJhLmV4dGVuZChST1QuUGF0aCk7XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBhIHBhdGggZnJvbSBhIGdpdmVuIHBvaW50XHJcbiAqIEBzZWUgUk9ULlBhdGgjY29tcHV0ZVxyXG4gKi9cclxuUk9ULlBhdGguRGlqa3N0cmEucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihmcm9tWCwgZnJvbVksIGNhbGxiYWNrKSB7XHJcblx0dmFyIGtleSA9IGZyb21YK1wiLFwiK2Zyb21ZO1xyXG5cdGlmICghKGtleSBpbiB0aGlzLl9jb21wdXRlZCkpIHsgdGhpcy5fY29tcHV0ZShmcm9tWCwgZnJvbVkpOyB9XHJcblx0aWYgKCEoa2V5IGluIHRoaXMuX2NvbXB1dGVkKSkgeyByZXR1cm47IH1cclxuXHRcclxuXHR2YXIgaXRlbSA9IHRoaXMuX2NvbXB1dGVkW2tleV07XHJcblx0d2hpbGUgKGl0ZW0pIHtcclxuXHRcdGNhbGxiYWNrKGl0ZW0ueCwgaXRlbS55KTtcclxuXHRcdGl0ZW0gPSBpdGVtLnByZXY7XHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgYSBub24tY2FjaGVkIHZhbHVlXHJcbiAqL1xyXG5ST1QuUGF0aC5EaWprc3RyYS5wcm90b3R5cGUuX2NvbXB1dGUgPSBmdW5jdGlvbihmcm9tWCwgZnJvbVkpIHtcclxuXHR3aGlsZSAodGhpcy5fdG9kby5sZW5ndGgpIHtcclxuXHRcdHZhciBpdGVtID0gdGhpcy5fdG9kby5zaGlmdCgpO1xyXG5cdFx0aWYgKGl0ZW0ueCA9PSBmcm9tWCAmJiBpdGVtLnkgPT0gZnJvbVkpIHsgcmV0dXJuOyB9XHJcblx0XHRcclxuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXROZWlnaGJvcnMoaXRlbS54LCBpdGVtLnkpO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvcnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHR2YXIgbmVpZ2hib3IgPSBuZWlnaGJvcnNbaV07XHJcblx0XHRcdHZhciB4ID0gbmVpZ2hib3JbMF07XHJcblx0XHRcdHZhciB5ID0gbmVpZ2hib3JbMV07XHJcblx0XHRcdHZhciBpZCA9IHgrXCIsXCIreTtcclxuXHRcdFx0aWYgKGlkIGluIHRoaXMuX2NvbXB1dGVkKSB7IGNvbnRpbnVlOyB9IC8qIGFscmVhZHkgZG9uZSAqL1x0XHJcblx0XHRcdHRoaXMuX2FkZCh4LCB5LCBpdGVtKTsgXHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULlBhdGguRGlqa3N0cmEucHJvdG90eXBlLl9hZGQgPSBmdW5jdGlvbih4LCB5LCBwcmV2KSB7XHJcblx0dmFyIG9iaiA9IHtcclxuXHRcdHg6IHgsXHJcblx0XHR5OiB5LFxyXG5cdFx0cHJldjogcHJldlxyXG5cdH07XHJcblx0dGhpcy5fY29tcHV0ZWRbeCtcIixcIit5XSA9IG9iajtcclxuXHR0aGlzLl90b2RvLnB1c2gob2JqKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBTaW1wbGlmaWVkIEEqIGFsZ29yaXRobTogYWxsIGVkZ2VzIGhhdmUgYSB2YWx1ZSBvZiAxXHJcbiAqIEBhdWdtZW50cyBST1QuUGF0aFxyXG4gKiBAc2VlIFJPVC5QYXRoXHJcbiAqL1xyXG5ST1QuUGF0aC5BU3RhciA9IGZ1bmN0aW9uKHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0Uk9ULlBhdGguY2FsbCh0aGlzLCB0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucyk7XHJcblxyXG5cdHRoaXMuX3RvZG8gPSBbXTtcclxuXHR0aGlzLl9kb25lID0ge307XHJcblx0dGhpcy5fZnJvbVggPSBudWxsO1xyXG5cdHRoaXMuX2Zyb21ZID0gbnVsbDtcclxufTtcclxuUk9ULlBhdGguQVN0YXIuZXh0ZW5kKFJPVC5QYXRoKTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIGEgcGF0aCBmcm9tIGEgZ2l2ZW4gcG9pbnRcclxuICogQHNlZSBST1QuUGF0aCNjb21wdXRlXHJcbiAqL1xyXG5ST1QuUGF0aC5BU3Rhci5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKGZyb21YLCBmcm9tWSwgY2FsbGJhY2spIHtcclxuXHR0aGlzLl90b2RvID0gW107XHJcblx0dGhpcy5fZG9uZSA9IHt9O1xyXG5cdHRoaXMuX2Zyb21YID0gZnJvbVg7XHJcblx0dGhpcy5fZnJvbVkgPSBmcm9tWTtcclxuXHR0aGlzLl9hZGQodGhpcy5fdG9YLCB0aGlzLl90b1ksIG51bGwpO1xyXG5cclxuXHR3aGlsZSAodGhpcy5fdG9kby5sZW5ndGgpIHtcclxuXHRcdHZhciBpdGVtID0gdGhpcy5fdG9kby5zaGlmdCgpO1xyXG5cdFx0aWYgKGl0ZW0ueCA9PSBmcm9tWCAmJiBpdGVtLnkgPT0gZnJvbVkpIHsgYnJlYWs7IH1cclxuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXROZWlnaGJvcnMoaXRlbS54LCBpdGVtLnkpO1xyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPG5laWdoYm9ycy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHZhciBuZWlnaGJvciA9IG5laWdoYm9yc1tpXTtcclxuXHRcdFx0dmFyIHggPSBuZWlnaGJvclswXTtcclxuXHRcdFx0dmFyIHkgPSBuZWlnaGJvclsxXTtcclxuXHRcdFx0dmFyIGlkID0geCtcIixcIit5O1xyXG5cdFx0XHRpZiAoaWQgaW4gdGhpcy5fZG9uZSkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHR0aGlzLl9hZGQoeCwgeSwgaXRlbSk7IFxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR2YXIgaXRlbSA9IHRoaXMuX2RvbmVbZnJvbVgrXCIsXCIrZnJvbVldO1xyXG5cdGlmICghaXRlbSkgeyByZXR1cm47IH1cclxuXHRcclxuXHR3aGlsZSAoaXRlbSkge1xyXG5cdFx0Y2FsbGJhY2soaXRlbS54LCBpdGVtLnkpO1xyXG5cdFx0aXRlbSA9IGl0ZW0ucHJldjtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuUGF0aC5BU3Rhci5wcm90b3R5cGUuX2FkZCA9IGZ1bmN0aW9uKHgsIHksIHByZXYpIHtcclxuXHR2YXIgaCA9IHRoaXMuX2Rpc3RhbmNlKHgsIHkpO1xyXG5cdHZhciBvYmogPSB7XHJcblx0XHR4OiB4LFxyXG5cdFx0eTogeSxcclxuXHRcdHByZXY6IHByZXYsXHJcblx0XHRnOiAocHJldiA/IHByZXYuZysxIDogMCksXHJcblx0XHRoOiBoXHJcblx0fTtcclxuXHR0aGlzLl9kb25lW3grXCIsXCIreV0gPSBvYmo7XHJcblx0XHJcblx0LyogaW5zZXJ0IGludG8gcHJpb3JpdHkgcXVldWUgKi9cclxuXHRcclxuXHR2YXIgZiA9IG9iai5nICsgb2JqLmg7XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fdG9kby5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IHRoaXMuX3RvZG9baV07XHJcblx0XHR2YXIgaXRlbUYgPSBpdGVtLmcgKyBpdGVtLmg7XHJcblx0XHRpZiAoZiA8IGl0ZW1GIHx8IChmID09IGl0ZW1GICYmIGggPCBpdGVtLmgpKSB7XHJcblx0XHRcdHRoaXMuX3RvZG8uc3BsaWNlKGksIDAsIG9iaik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGhpcy5fdG9kby5wdXNoKG9iaik7XHJcbn07XHJcblxyXG5ST1QuUGF0aC5BU3Rhci5wcm90b3R5cGUuX2Rpc3RhbmNlID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdHN3aXRjaCAodGhpcy5fb3B0aW9ucy50b3BvbG9neSkge1xyXG5cdFx0Y2FzZSA0OlxyXG5cdFx0XHRyZXR1cm4gKE1hdGguYWJzKHgtdGhpcy5fZnJvbVgpICsgTWF0aC5hYnMoeS10aGlzLl9mcm9tWSkpO1xyXG5cdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSA2OlxyXG5cdFx0XHR2YXIgZHggPSBNYXRoLmFicyh4IC0gdGhpcy5fZnJvbVgpO1xyXG5cdFx0XHR2YXIgZHkgPSBNYXRoLmFicyh5IC0gdGhpcy5fZnJvbVkpO1xyXG5cdFx0XHRyZXR1cm4gZHkgKyBNYXRoLm1heCgwLCAoZHgtZHkpLzIpO1xyXG5cdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSA4OiBcclxuXHRcdFx0cmV0dXJuIE1hdGgubWF4KE1hdGguYWJzKHgtdGhpcy5fZnJvbVgpLCBNYXRoLmFicyh5LXRoaXMuX2Zyb21ZKSk7XHJcblx0XHRicmVhaztcclxuXHR9XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgdG9wb2xvZ3lcIik7XHJcbn07XHJcbiAgcmV0dXJuIFJPVDtcclxufSkpO1xyXG4iXX0=
