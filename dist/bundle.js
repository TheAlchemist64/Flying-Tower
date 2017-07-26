(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
		key: 'collides',
		value: function collides(x, y) {
			var _this = this;

			var collides = false;
			var other = null;
			_game2.default.actors.forEach(function (actor) {
				if (_this != actor && x == actor.x && y == actor.y) {
					collides = true;
					other = actor;
				}
			});
			return [collides, other];
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

			var _collides = this.collides(x, y),
			    _collides2 = _slicedToArray(_collides, 2),
			    collides = _collides2[0],
			    other = _collides2[1];

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

},{"./game":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _actor = require('../actor');

var _actor2 = _interopRequireDefault(_actor);

var _game = require('./../game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Monster = function (_Actor) {
	_inherits(Monster, _Actor);

	function Monster(name, x, y, glyph, ai) {
		_classCallCheck(this, Monster);

		var _this = _possibleConstructorReturn(this, (Monster.__proto__ || Object.getPrototypeOf(Monster)).call(this, name, x, y, glyph));

		_this.ai = ai;
		return _this;
	}

	_createClass(Monster, [{
		key: 'act',
		value: function act() {
			this.ai.run(this);
		}
	}]);

	return Monster;
}(_actor2.default);

exports.default = Monster;

},{"../actor":1,"./../game":6}],3:[function(require,module,exports){
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
					_game2.default.bus.dispatch('playermove', this);
					break;
				case _rot2.default.VK_RIGHT:
					_get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'move', this).call(this, x + 1, y);
					_game2.default.bus.dispatch('playermove', this);
					break;
				case _rot2.default.VK_DOWN:
					_get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'move', this).call(this, x, y + 1);
					_game2.default.bus.dispatch('playermove', this);
					break;
				case _rot2.default.VK_LEFT:
					_get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'move', this).call(this, x - 1, y);
					_game2.default.bus.dispatch('playermove', this);
					break;
				case _rot2.default.VK_PERIOD:
					break; //Wait
				default:
					return; //Keyboard input not recognized.
			}
			window.removeEventListener('keydown', this);
			_game2.default.engine.unlock();
		}
	}, {
		key: 'canFall',
		value: function canFall() {
			var x = this.x;
			var y = this.y;
			var neighbors = [[x - 1, y], [x, y - 1], [x + 1, y], [x, y + 1]];
			var sky = null;
			neighbors.forEach(function (n) {
				if (_game2.default.map.get(n[0], n[1]).type == 'sky') {
					sky = { x: n[0], y: n[1] };
				}
			});
			if (!sky) {
				return [false, null];
			}
			return [true, sky];
		}
	}]);

	return Player;
}(_actor2.default);

exports.default = Player;

},{"../../../vendor/rot":11,"../actor":1,"./../game":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.BasicAI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _rot = require('../../../vendor/rot');

var _rot2 = _interopRequireDefault(_rot);

var _game = require('../game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isPassable(x, y, actor) {
	var passable = true;
	if (['wall', 'sky'].includes(_game2.default.map.get(x, y).type)) {
		passable = false;
	}

	var _actor$collides = actor.collides(x, y),
	    _actor$collides2 = _slicedToArray(_actor$collides, 2),
	    collides = _actor$collides2[0],
	    other = _actor$collides2[1];

	if (collides) {
		passable = false;
	}
	return passable;
}

var BasicAI = function () {
	function BasicAI() {
		_classCallCheck(this, BasicAI);
	}

	_createClass(BasicAI, [{
		key: 'run',
		value: function run(actor) {
			var _Game$player$canFall = _game2.default.player.canFall(),
			    _Game$player$canFall2 = _slicedToArray(_Game$player$canFall, 2),
			    result = _Game$player$canFall2[0],
			    tile = _Game$player$canFall2[1];

			if (!result) {
				return;
			}
			//Get the tile the AI needs to be on in order to push the player off
			var x = _game2.default.player.x - (tile.x - _game2.default.player.x);
			var y = _game2.default.player.y - (tile.y - _game2.default.player.y);
			//Make passable function callback
			var passableCallback = function passableCallback(x, y) {
				var result = isPassable(x, y, actor);
				return result;
			};
			//Initialize pathfinder
			var finder = new _rot2.default.Path.AStar(x, y, passableCallback, { topology: 4 });
			//Find path to tile where ai can push the player off
			var path = [];
			finder.compute(actor.x, actor.y, function (x, y) {
				path.push({ x: x, y: y });
			});
			if (path.length == 1) {
				actor.move(_game2.default.player.x, _game2.default.player.y);
			} else if (path.length > 1) {
				actor.move(path[1].x, path[1].y);
			}
		}
	}]);

	return BasicAI;
}();

exports.BasicAI = BasicAI;

},{"../../../vendor/rot":11,"../game":6}],5:[function(require,module,exports){
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

},{"../../vendor/rot":11,"./game":6,"./tile":9}],6:[function(require,module,exports){
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

var _player = require('./actors/player');

var _player2 = _interopRequireDefault(_player);

var _monster = require('./actors/monster');

var _monster2 = _interopRequireDefault(_monster);

var _glyph = require('./glyph');

var _glyph2 = _interopRequireDefault(_glyph);

var _basic = require('./ai/basic');

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

		//Initialize Display
		this.display = new _rot2.default.Display({ width: w, height: h });
		document.body.appendChild(this.display.getContainer());
		//Generate Map
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
		//Add Event Bus to global object
		this.bus = _eventbus2.default;
		//Initialize Turn Engine
		this.scheduler = new _rot2.default.Scheduler.Simple();
		this.engine = new _rot2.default.Engine(this.scheduler);
		//Create Player
		this.player = new _player2.default('Player', 4, 4, new _glyph2.default('@', '#fff'));
		this.player.draw();
		//Create test monster
		var m = new _monster2.default('Monster', 8, 8, new _glyph2.default('m', '#f00'), new _basic.BasicAI());
		m.draw();

		this.engine.start();
	},
	over: function over(victory) {
		//Game ended. Delete Scheduler and Engine
		this.scheduler.clear();
		//this.engine = null;
		var text = '';
		if (victory) {
			text = 'Congradulations! You won!';
		} else {
			text = 'Game over. You lost!';
		}
		this.display.drawText(Math.floor(w / 2) - Math.floor(text.length / 2), Math.floor(h / 2), text);
	}
};

},{"../../vendor/eventbus.min":10,"../../vendor/rot":11,"./actors/monster":2,"./actors/player":3,"./ai/basic":4,"./glyph":7,"./map.js":8,"./tile.js":9}],7:[function(require,module,exports){
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

},{"./game":6}],8:[function(require,module,exports){
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

},{"./tile":9}],9:[function(require,module,exports){
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

},{"./glyph":7}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxhY3Rvci5qcyIsImFzc2V0c1xcanNcXGFjdG9yc1xcbW9uc3Rlci5qcyIsImFzc2V0c1xcanNcXGFjdG9yc1xccGxheWVyLmpzIiwiYXNzZXRzXFxqc1xcYWlcXGJhc2ljLmpzIiwiYXNzZXRzXFxqc1xcYXBwLmpzIiwiYXNzZXRzXFxqc1xcZ2FtZS5qcyIsImFzc2V0c1xcanNcXGdseXBoLmpzIiwiYXNzZXRzXFxqc1xcbWFwLmpzIiwiYXNzZXRzXFxqc1xcdGlsZS5qcyIsInZlbmRvclxcZXZlbnRidXMubWluLmpzIiwidmVuZG9yXFxyb3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7O0lBRXFCLEs7QUFDcEIsZ0JBQVksSUFBWixFQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixLQUF4QixFQUE4QjtBQUFBOztBQUM3QixPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsT0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLE9BQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsaUJBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsSUFBakI7QUFDQSxpQkFBSyxTQUFMLENBQWUsR0FBZixDQUFtQixJQUFuQixFQUF3QixJQUF4QjtBQUNBOzs7O3dCQUNJLENBQUU7Ozt5QkFDRDtBQUNMLFFBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBSyxDQUFyQixFQUF3QixLQUFLLENBQTdCO0FBQ0E7OzsyQkFDUSxDLEVBQUcsQyxFQUFFO0FBQUE7O0FBQ2IsT0FBSSxXQUFXLEtBQWY7QUFDQSxPQUFJLFFBQVEsSUFBWjtBQUNBLGtCQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLFVBQUMsS0FBRCxFQUFTO0FBQzVCLFFBQUcsU0FBTSxLQUFOLElBQWUsS0FBRyxNQUFNLENBQXhCLElBQTZCLEtB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bUJFLFFBQU8sR0FBUDtBQUNELENBM3RLQSxDQUFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3RvciB7XHJcblx0Y29uc3RydWN0b3IobmFtZSwgeCwgeSwgZ2x5cGgpe1xyXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0dGhpcy5nbHlwaCA9IGdseXBoO1xyXG5cdFx0R2FtZS5hY3RvcnMucHVzaCh0aGlzKTtcclxuXHRcdEdhbWUuc2NoZWR1bGVyLmFkZCh0aGlzLHRydWUpO1xyXG5cdH1cclxuXHRhY3QoKXt9XHJcblx0ZHJhdygpe1xyXG5cdFx0dGhpcy5nbHlwaC5kcmF3KHRoaXMueCwgdGhpcy55KTtcclxuXHR9XHJcblx0Y29sbGlkZXMoeCwgeSl7XHJcblx0XHRsZXQgY29sbGlkZXMgPSBmYWxzZTtcclxuXHRcdGxldCBvdGhlciA9IG51bGw7XHJcblx0XHRHYW1lLmFjdG9ycy5mb3JFYWNoKChhY3Rvcik9PntcclxuXHRcdFx0aWYodGhpcyE9YWN0b3IgJiYgeD09YWN0b3IueCAmJiB5PT1hY3Rvci55KXtcclxuXHRcdFx0XHRjb2xsaWRlcyA9IHRydWU7XHJcblx0XHRcdFx0b3RoZXIgPSBhY3RvcjtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gW2NvbGxpZGVzLCBvdGhlcl07XHJcblx0fVxyXG5cdG1vdmUoeCwgeSl7XHJcblx0XHRpZighR2FtZS5tYXAuaW5Cb3VuZHMoeCwgeSkpe1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cclxuXHRcdGxldCB0aWxlVHlwZSA9IEdhbWUubWFwLmdldCh4LCB5KS50eXBlO1xyXG5cdFx0c3dpdGNoKHRpbGVUeXBlKXtcclxuXHRcdFx0Y2FzZSAnd2FsbCc6XHJcblx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3NreSc6XHJcblx0XHRcdFx0R2FtZS5tYXAuZ2V0KHRoaXMueCwgdGhpcy55KS5kcmF3KCk7XHJcblx0XHRcdFx0R2FtZS5zY2hlZHVsZXIucmVtb3ZlKHRoaXMpO1xyXG5cdFx0XHRcdEdhbWUuYWN0b3JzLnNwbGljZShHYW1lLmFjdG9ycy5pbmRleE9mKHRoaXMpLDEpO1xyXG5cdFx0XHRcdGlmKHRoaXMgPT0gR2FtZS5wbGF5ZXIpe1xyXG5cdFx0XHRcdFx0R2FtZS5vdmVyKGZhbHNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRsZXQgW2NvbGxpZGVzLCBvdGhlcl0gPSB0aGlzLmNvbGxpZGVzKHgsIHkpO1xyXG5cdFx0aWYoY29sbGlkZXMpe1xyXG5cdFx0XHQvL1B1c2ggYWN0b3JcclxuXHRcdFx0bGV0IGR4ID0geCAtIHRoaXMueDtcclxuXHRcdFx0bGV0IGR5ID0geSAtIHRoaXMueTtcclxuXHRcdFx0bGV0IG12ID0gb3RoZXIubW92ZShvdGhlci54K2R4LG90aGVyLnkrZHkpO1xyXG5cdFx0XHRpZighbXYpe1xyXG5cdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL0NhcHR1cmUgY3VycmVudCBwb3NpdGlvblxyXG5cdFx0bGV0IGN4ID0gdGhpcy54O1xyXG5cdFx0bGV0IGN5ID0gdGhpcy55O1xyXG5cdFx0Ly9TZXQgbmV3IHBvc2l0aW9uXHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdC8vUmVzZXQgYWN0b3IncyBwcmV2aW91cyB0aWxlIGFuZCBkcmF3IGFjdG9yIG9uIG5ldyB0aWxlXHJcblx0XHRHYW1lLm1hcC5nZXQoY3gsIGN5KS5kcmF3KCk7XHJcblx0XHR0aGlzLmRyYXcoKTtcclxuXHRcdHJldHVybiAxO1xyXG5cdH1cclxufSIsImltcG9ydCBBY3RvciBmcm9tICcuLi9hY3Rvcic7XHJcbmltcG9ydCBHYW1lIGZyb20gJy4vLi4vZ2FtZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb25zdGVyIGV4dGVuZHMgQWN0b3J7XHJcblx0Y29uc3RydWN0b3IobmFtZSwgeCwgeSwgZ2x5cGgsIGFpKXtcclxuXHRcdHN1cGVyKG5hbWUsIHgsIHksIGdseXBoKTtcclxuXHRcdHRoaXMuYWkgPSBhaTtcclxuXHR9XHJcblx0YWN0KCl7XHJcblx0XHR0aGlzLmFpLnJ1bih0aGlzKTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgQWN0b3IgZnJvbSAnLi4vYWN0b3InO1xyXG5pbXBvcnQgUk9UIGZyb20gJy4uLy4uLy4uL3ZlbmRvci9yb3QnO1xyXG5pbXBvcnQgR2FtZSBmcm9tICcuLy4uL2dhbWUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIGV4dGVuZHMgQWN0b3J7XHJcblx0YWN0KCl7XHJcblx0XHRHYW1lLmVuZ2luZS5sb2NrKCk7XHJcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsdGhpcyk7XHJcblx0fVxyXG5cdGhhbmRsZUV2ZW50KGUpe1xyXG5cdFx0bGV0IGNvZGUgPSBlLmtleUNvZGU7XHJcblx0XHRsZXQgeCA9IHRoaXMueDtcclxuXHRcdGxldCB5ID0gdGhpcy55O1xyXG5cdFx0c3dpdGNoKGNvZGUpe1xyXG5cdFx0XHRjYXNlIFJPVC5WS19VUDpcclxuXHRcdFx0XHRzdXBlci5tb3ZlKHgseS0xKTtcclxuXHRcdFx0XHRHYW1lLmJ1cy5kaXNwYXRjaCgncGxheWVybW92ZScsIHRoaXMpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFJPVC5WS19SSUdIVDpcclxuXHRcdFx0XHRzdXBlci5tb3ZlKHgrMSx5KTtcclxuXHRcdFx0XHRHYW1lLmJ1cy5kaXNwYXRjaCgncGxheWVybW92ZScsIHRoaXMpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFJPVC5WS19ET1dOOlxyXG5cdFx0XHRcdHN1cGVyLm1vdmUoeCx5KzEpO1xyXG5cdFx0XHRcdEdhbWUuYnVzLmRpc3BhdGNoKCdwbGF5ZXJtb3ZlJywgdGhpcyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgUk9ULlZLX0xFRlQ6XHJcblx0XHRcdFx0c3VwZXIubW92ZSh4LTEseSk7XHJcblx0XHRcdFx0R2FtZS5idXMuZGlzcGF0Y2goJ3BsYXllcm1vdmUnLCB0aGlzKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBST1QuVktfUEVSSU9EOlxyXG5cdFx0XHRcdGJyZWFrOyAvL1dhaXRcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRyZXR1cm47IC8vS2V5Ym9hcmQgaW5wdXQgbm90IHJlY29nbml6ZWQuXHJcblx0XHR9XHJcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsdGhpcyk7XHJcblx0XHRHYW1lLmVuZ2luZS51bmxvY2soKTtcclxuXHR9XHRcclxuXHRjYW5GYWxsKCl7XHJcblx0XHRsZXQgeCA9IHRoaXMueDtcclxuXHRcdGxldCB5ID0gdGhpcy55O1xyXG5cdFx0bGV0IG5laWdoYm9ycyA9IFtbeC0xLHldLFt4LHktMV0sW3grMSx5XSxbeCx5KzFdXTtcclxuXHRcdGxldCBza3kgPSBudWxsO1xyXG5cdFx0bmVpZ2hib3JzLmZvckVhY2goKG4pPT57XHJcblx0XHRcdGlmKEdhbWUubWFwLmdldChuWzBdLG5bMV0pLnR5cGUgPT0gJ3NreScpe1xyXG5cdFx0XHRcdHNreSA9IHt4Om5bMF0seTpuWzFdfTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRpZighc2t5KXtcclxuXHRcdFx0cmV0dXJuIFtmYWxzZSwgbnVsbF07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gW3RydWUsIHNreV07XHJcblx0fVxyXG59IiwiaW1wb3J0IFJPVCBmcm9tICcuLi8uLi8uLi92ZW5kb3Ivcm90JztcclxuaW1wb3J0IEdhbWUgZnJvbSAnLi4vZ2FtZSc7XHJcblxyXG5mdW5jdGlvbiBpc1Bhc3NhYmxlKHgsIHksIGFjdG9yKXtcclxuXHRsZXQgcGFzc2FibGUgPSB0cnVlO1xyXG5cdGlmKFsnd2FsbCcsJ3NreSddLmluY2x1ZGVzKEdhbWUubWFwLmdldCh4LCB5KS50eXBlKSl7XHJcblx0XHRwYXNzYWJsZSA9IGZhbHNlO1xyXG5cdH1cclxuXHRsZXQgW2NvbGxpZGVzLCBvdGhlcl0gPSBhY3Rvci5jb2xsaWRlcyh4LCB5KTtcclxuXHRpZihjb2xsaWRlcyl7XHJcblx0XHRwYXNzYWJsZSA9IGZhbHNlO1xyXG5cdH1cclxuXHRyZXR1cm4gcGFzc2FibGU7XHJcbn1cclxuXHJcbmNsYXNzIEJhc2ljQUkge1xyXG5cdHJ1bihhY3Rvcil7XHJcblx0XHRsZXQgW3Jlc3VsdCwgdGlsZV0gPSBHYW1lLnBsYXllci5jYW5GYWxsKCk7XHJcblx0XHRpZighcmVzdWx0KXtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Ly9HZXQgdGhlIHRpbGUgdGhlIEFJIG5lZWRzIHRvIGJlIG9uIGluIG9yZGVyIHRvIHB1c2ggdGhlIHBsYXllciBvZmZcclxuXHRcdGxldCB4ID0gR2FtZS5wbGF5ZXIueCAtICh0aWxlLnggLSBHYW1lLnBsYXllci54KTtcclxuXHRcdGxldCB5ID0gR2FtZS5wbGF5ZXIueSAtICh0aWxlLnkgLSBHYW1lLnBsYXllci55KTtcclxuXHRcdC8vTWFrZSBwYXNzYWJsZSBmdW5jdGlvbiBjYWxsYmFja1xyXG5cdFx0bGV0IHBhc3NhYmxlQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KXtcclxuXHRcdFx0bGV0IHJlc3VsdCA9IGlzUGFzc2FibGUoeCwgeSwgYWN0b3IpO1xyXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0fVxyXG5cdFx0Ly9Jbml0aWFsaXplIHBhdGhmaW5kZXJcclxuXHRcdGxldCBmaW5kZXIgPSBuZXcgUk9ULlBhdGguQVN0YXIoeCwgeSwgcGFzc2FibGVDYWxsYmFjaywge3RvcG9sb2d5OjR9KTtcclxuXHRcdC8vRmluZCBwYXRoIHRvIHRpbGUgd2hlcmUgYWkgY2FuIHB1c2ggdGhlIHBsYXllciBvZmZcclxuXHRcdGxldCBwYXRoID0gW107XHJcblx0XHRmaW5kZXIuY29tcHV0ZShhY3Rvci54LCBhY3Rvci55LCAoeCwgeSk9PntcclxuXHRcdFx0cGF0aC5wdXNoKHt4OiB4LCB5OiB5fSk7XHJcblx0XHR9KTtcclxuXHRcdGlmKHBhdGgubGVuZ3RoID09IDEpe1xyXG5cdFx0XHRhY3Rvci5tb3ZlKEdhbWUucGxheWVyLngsIEdhbWUucGxheWVyLnkpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZihwYXRoLmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRhY3Rvci5tb3ZlKHBhdGhbMV0ueCwgcGF0aFsxXS55KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7IEJhc2ljQUkgfTsiLCJpbXBvcnQgUk9UIGZyb20gXCIuLi8uLi92ZW5kb3Ivcm90XCJcclxuaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJ1xyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSAnLi90aWxlJztcclxuXHJcbmlmKCFST1QuaXNTdXBwb3J0ZWQoKSl7XHJcblx0YWxlcnQoXCJUaGUgcm90LmpzIGxpYnJhcnkgaXNuJ3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3Nlci5cIik7XHJcbn1cclxuZWxzZXtcclxuXHRHYW1lLmluaXQoKTtcclxufSIsImltcG9ydCBST1QgZnJvbSAnLi4vLi4vdmVuZG9yL3JvdCc7XHJcbmltcG9ydCBFdmVudEJ1cyBmcm9tICcuLi8uLi92ZW5kb3IvZXZlbnRidXMubWluJztcclxuXHJcbmltcG9ydCBUaWxlTWFwIGZyb20gJy4vbWFwLmpzJztcclxuaW1wb3J0IHsgVGlsZSwgVGlsZVR5cGVzIH0gZnJvbSAnLi90aWxlLmpzJztcclxuaW1wb3J0IFBsYXllciBmcm9tICcuL2FjdG9ycy9wbGF5ZXInO1xyXG5pbXBvcnQgTW9uc3RlciBmcm9tICcuL2FjdG9ycy9tb25zdGVyJztcclxuaW1wb3J0IEdseXBoIGZyb20gJy4vZ2x5cGgnO1xyXG5pbXBvcnQgeyBCYXNpY0FJIH0gZnJvbSAnLi9haS9iYXNpYyc7XHJcblxyXG5jb25zdCB3ID0gNTA7XHJcbmNvbnN0IGggPSAyNTtcclxuXHJcbnZhciByYW5kSW50ID0gZnVuY3Rpb24oYSwgYil7XHJcblx0cmV0dXJuIGEgKyBNYXRoLmZsb29yKChiLWEpICogUk9ULlJORy5nZXRVbmlmb3JtKCkpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0ZGlzcGxheTogbnVsbCxcclxuXHRtYXA6IG51bGwsXHJcblx0YnVzOiBudWxsLFxyXG5cdGFjdG9yczogW10sXHJcblx0cGxheWVyOiBudWxsLFxyXG5cdHNjaGVkdWxlcjogbnVsbCxcclxuXHRlbmdpbmU6IG51bGwsXHJcblx0XHJcblx0aW5pdCgpe1xyXG5cdFx0Ly9Jbml0aWFsaXplIERpc3BsYXlcclxuXHRcdHRoaXMuZGlzcGxheSA9IG5ldyBST1QuRGlzcGxheSh7d2lkdGg6IHcsIGhlaWdodDogaH0pO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRpc3BsYXkuZ2V0Q29udGFpbmVyKCkpO1xyXG5cdFx0Ly9HZW5lcmF0ZSBNYXBcclxuXHRcdHRoaXMubWFwID0gbmV3IFRpbGVNYXAodywgaCk7XHJcblx0XHRsZXQgZ2VuZXJhdG9yID0gbmV3IFJPVC5NYXAuQXJlbmEody00LGgtNCk7XHJcblx0XHRnZW5lcmF0b3IuY3JlYXRlKCh4LCB5LCB3YWxsKT0+e1xyXG5cdFx0XHRsZXQgV0FMTCA9IFRpbGVUeXBlcy5XQUxMO1xyXG5cdFx0XHRsZXQgRkxPT1IgPSBUaWxlVHlwZXMuRkxPT1I7XHJcblx0XHRcdHRoaXMubWFwLnNldCh4KzIsIHkrMiwgbmV3IFRpbGUoeCsyLCB5KzIsIHdhbGwgPyBXQUxMOiBGTE9PUikpO1xyXG5cdFx0fSk7XHJcblx0XHQvL0dlbmVyYXRlIGhvbGVzIGluIHRoZSBmbG9vclxyXG5cdFx0bGV0IGhvbGVzID0gNTtcclxuXHRcdHdoaWxlKGhvbGVzID4gMCl7XHJcblx0XHRcdGxldCB4ID0gcmFuZEludCgyLCB3LTIpO1xyXG5cdFx0XHRsZXQgeSA9IHJhbmRJbnQoMiwgaC0yKTtcclxuXHRcdFx0dGhpcy5tYXAuc2V0KHgsIHksIG5ldyBUaWxlKHgsIHksIFRpbGVUeXBlcy5TS1kpKTtcclxuXHRcdFx0aG9sZXMtLTtcclxuXHRcdH1cclxuXHRcdHRoaXMubWFwLmRyYXcoKTtcclxuXHRcdC8vQWRkIEV2ZW50IEJ1cyB0byBnbG9iYWwgb2JqZWN0XHJcblx0XHR0aGlzLmJ1cyA9IEV2ZW50QnVzO1xyXG5cdFx0Ly9Jbml0aWFsaXplIFR1cm4gRW5naW5lXHJcblx0XHR0aGlzLnNjaGVkdWxlciA9IG5ldyBST1QuU2NoZWR1bGVyLlNpbXBsZSgpO1xyXG5cdFx0dGhpcy5lbmdpbmUgPSBuZXcgUk9ULkVuZ2luZSh0aGlzLnNjaGVkdWxlcik7XHJcblx0XHQvL0NyZWF0ZSBQbGF5ZXJcclxuXHRcdHRoaXMucGxheWVyID0gbmV3IFBsYXllcignUGxheWVyJyw0LDQsbmV3IEdseXBoKCdAJywnI2ZmZicpKTtcclxuXHRcdHRoaXMucGxheWVyLmRyYXcoKTtcclxuXHRcdC8vQ3JlYXRlIHRlc3QgbW9uc3RlclxyXG5cdFx0bGV0IG0gPSBuZXcgTW9uc3RlcignTW9uc3RlcicsOCw4LG5ldyBHbHlwaCgnbScsJyNmMDAnKSxuZXcgQmFzaWNBSSgpKTtcclxuXHRcdG0uZHJhdygpO1xyXG5cdFx0XHJcblx0XHR0aGlzLmVuZ2luZS5zdGFydCgpO1xyXG5cdH0sXHJcblx0b3Zlcih2aWN0b3J5KXtcclxuXHRcdC8vR2FtZSBlbmRlZC4gRGVsZXRlIFNjaGVkdWxlciBhbmQgRW5naW5lXHJcblx0XHR0aGlzLnNjaGVkdWxlci5jbGVhcigpO1xyXG5cdFx0Ly90aGlzLmVuZ2luZSA9IG51bGw7XHJcblx0XHRsZXQgdGV4dCA9ICcnO1xyXG5cdFx0aWYodmljdG9yeSl7XHJcblx0XHRcdHRleHQgPSAnQ29uZ3JhZHVsYXRpb25zISBZb3Ugd29uISc7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHR0ZXh0ID0gJ0dhbWUgb3Zlci4gWW91IGxvc3QhJztcclxuXHRcdH1cclxuXHRcdHRoaXMuZGlzcGxheS5kcmF3VGV4dChNYXRoLmZsb29yKHcvMiktTWF0aC5mbG9vcih0ZXh0Lmxlbmd0aC8yKSxNYXRoLmZsb29yKGgvMiksdGV4dCk7XHJcblx0fVxyXG59IiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdseXBoIHtcclxuXHRjb25zdHJ1Y3RvcihjaHIsIGZnLCBiZyl7XHJcblx0XHR0aGlzLmNociA9IGNociB8fCAnICc7XHJcblx0XHR0aGlzLmZnID0gZmcgfHwgJyNmZmYnO1xyXG5cdFx0dGhpcy5iZyA9IGJnIHx8IG51bGw7XHJcblx0fVxyXG5cdGRyYXcoeCwgeSl7XHJcblx0XHRHYW1lLmRpc3BsYXkuZHJhdyh4LCB5LCB0aGlzLmNociwgdGhpcy5mZywgdGhpcy5iZyk7XHJcblx0fVxyXG59IiwiaW1wb3J0IHsgVGlsZSwgVGlsZVR5cGVzIH0gZnJvbSAnLi90aWxlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbGVNYXAge1xyXG5cdGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpe1xyXG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xyXG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblx0XHR0aGlzLnRpbGVzID0gbmV3IE1hcCgpO1xyXG5cdFx0Zm9yKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4Kyspe1xyXG5cdFx0XHRmb3IobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5Kyspe1xyXG5cdFx0XHRcdHRoaXMudGlsZXMuc2V0KHgrJywnK3ksbmV3IFRpbGUoeCwgeSwgVGlsZVR5cGVzLlNLWSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdHNldCh4LCB5LCB0aWxlKXtcclxuXHRcdHRoaXMudGlsZXMuc2V0KHgrJywnK3ksdGlsZSk7XHJcblx0fVxyXG5cdGdldCh4LCB5KXtcclxuXHRcdHJldHVybiB0aGlzLnRpbGVzLmdldCh4KycsJyt5KTtcclxuXHR9XHJcblx0aW5Cb3VuZHMoeCwgeSl7XHJcblx0XHRyZXR1cm4geCA+IDAgJiYgeCA8IHRoaXMud2lkdGggJiYgeT4gMCAmJiB5IDwgdGhpcy5oZWlnaHQ7XHJcblx0fVxyXG5cdGRyYXcoKXtcclxuXHRcdGZvcih2YXIgdGlsZSBvZiB0aGlzLnRpbGVzLnZhbHVlcygpKXtcclxuXHRcdFx0dGlsZS5kcmF3KCk7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiaW1wb3J0IEdseXBoIGZyb20gJy4vZ2x5cGgnO1xyXG5cclxuZXhwb3J0IGxldCBUaWxlVHlwZXMgPSB7XHJcblx0V0FMTDoge1xyXG5cdFx0bmFtZTogJ3dhbGwnLFxyXG5cdFx0Z2x5cGg6IG5ldyBHbHlwaCgnIycpXHJcblx0fSxcclxuXHRGTE9PUjoge1xyXG5cdFx0bmFtZTogJ2Zsb29yJyxcclxuXHRcdGdseXBoOiBuZXcgR2x5cGgoJy4nKVxyXG5cdH0sXHJcblx0U0tZOiB7XHJcblx0XHRuYW1lOiAnc2t5JyxcclxuXHRcdGdseXBoOiBuZXcgR2x5cGgoJyAnLCcjZmZmJywnc2t5Ymx1ZScpXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGlsZSB7XHJcblx0Y29uc3RydWN0b3IoeCwgeSwgdHlwZSl7XHJcblx0XHR0aGlzLnggPSB4O1xyXG5cdFx0dGhpcy55ID0geTtcclxuXHRcdHRoaXMudHlwZSA9IHR5cGUubmFtZTtcclxuXHRcdHRoaXMuX2dseXBoID0gdHlwZS5nbHlwaDtcclxuXHR9XHJcblx0Z2V0IGdseXBoKCl7IHJldHVybiB0aGlzLl9nbHlwaDsgfVxyXG5cdHNldCBnbHlwaChnbHlwaCkgeyB0aGlzLl9nbHlwaCA9IGdseXBoOyB0aGlzLmRyYXcoKTsgfVxyXG5cdGRyYXcoKXtcclxuXHRcdHRoaXMuZ2x5cGguZHJhdyh0aGlzLngsIHRoaXMueSk7XHJcblx0fVxyXG59IiwiKGZ1bmN0aW9uKHJvb3QsZmFjdG9yeSl7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlPT09XCJvYmplY3RcIiltb2R1bGUuZXhwb3J0cz1mYWN0b3J5KCk7ZWxzZSBpZih0eXBlb2YgZGVmaW5lPT09XCJmdW5jdGlvblwiJiZkZWZpbmUuYW1kKWRlZmluZShcIkV2ZW50QnVzXCIsW10sZmFjdG9yeSk7ZWxzZSBpZih0eXBlb2YgZXhwb3J0cz09PVwib2JqZWN0XCIpZXhwb3J0c1tcIkV2ZW50QnVzXCJdPWZhY3RvcnkoKTtlbHNlIHJvb3RbXCJFdmVudEJ1c1wiXT1mYWN0b3J5KCl9KSh0aGlzLGZ1bmN0aW9uKCl7dmFyIEV2ZW50QnVzQ2xhc3M9e307RXZlbnRCdXNDbGFzcz1mdW5jdGlvbigpe3RoaXMubGlzdGVuZXJzPXt9fTtFdmVudEJ1c0NsYXNzLnByb3RvdHlwZT17YWRkRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlLGNhbGxiYWNrLHNjb3BlKXt2YXIgYXJncz1bXTt2YXIgbnVtT2ZBcmdzPWFyZ3VtZW50cy5sZW5ndGg7Zm9yKHZhciBpPTA7aTxudW1PZkFyZ3M7aSsrKXthcmdzLnB1c2goYXJndW1lbnRzW2ldKX1hcmdzPWFyZ3MubGVuZ3RoPjM/YXJncy5zcGxpY2UoMyxhcmdzLmxlbmd0aC0xKTpbXTtpZih0eXBlb2YgdGhpcy5saXN0ZW5lcnNbdHlwZV0hPVwidW5kZWZpbmVkXCIpe3RoaXMubGlzdGVuZXJzW3R5cGVdLnB1c2goe3Njb3BlOnNjb3BlLGNhbGxiYWNrOmNhbGxiYWNrLGFyZ3M6YXJnc30pfWVsc2V7dGhpcy5saXN0ZW5lcnNbdHlwZV09W3tzY29wZTpzY29wZSxjYWxsYmFjazpjYWxsYmFjayxhcmdzOmFyZ3N9XX19LHJlbW92ZUV2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSxjYWxsYmFjayxzY29wZSl7aWYodHlwZW9mIHRoaXMubGlzdGVuZXJzW3R5cGVdIT1cInVuZGVmaW5lZFwiKXt2YXIgbnVtT2ZDYWxsYmFja3M9dGhpcy5saXN0ZW5lcnNbdHlwZV0ubGVuZ3RoO3ZhciBuZXdBcnJheT1bXTtmb3IodmFyIGk9MDtpPG51bU9mQ2FsbGJhY2tzO2krKyl7dmFyIGxpc3RlbmVyPXRoaXMubGlzdGVuZXJzW3R5cGVdW2ldO2lmKGxpc3RlbmVyLnNjb3BlPT1zY29wZSYmbGlzdGVuZXIuY2FsbGJhY2s9PWNhbGxiYWNrKXt9ZWxzZXtuZXdBcnJheS5wdXNoKGxpc3RlbmVyKX19dGhpcy5saXN0ZW5lcnNbdHlwZV09bmV3QXJyYXl9fSxoYXNFdmVudExpc3RlbmVyOmZ1bmN0aW9uKHR5cGUsY2FsbGJhY2ssc2NvcGUpe2lmKHR5cGVvZiB0aGlzLmxpc3RlbmVyc1t0eXBlXSE9XCJ1bmRlZmluZWRcIil7dmFyIG51bU9mQ2FsbGJhY2tzPXRoaXMubGlzdGVuZXJzW3R5cGVdLmxlbmd0aDtpZihjYWxsYmFjaz09PXVuZGVmaW5lZCYmc2NvcGU9PT11bmRlZmluZWQpe3JldHVybiBudW1PZkNhbGxiYWNrcz4wfWZvcih2YXIgaT0wO2k8bnVtT2ZDYWxsYmFja3M7aSsrKXt2YXIgbGlzdGVuZXI9dGhpcy5saXN0ZW5lcnNbdHlwZV1baV07aWYoKHNjb3BlP2xpc3RlbmVyLnNjb3BlPT1zY29wZTp0cnVlKSYmbGlzdGVuZXIuY2FsbGJhY2s9PWNhbGxiYWNrKXtyZXR1cm4gdHJ1ZX19fXJldHVybiBmYWxzZX0sZGlzcGF0Y2g6ZnVuY3Rpb24odHlwZSx0YXJnZXQpe3ZhciBldmVudD17dHlwZTp0eXBlLHRhcmdldDp0YXJnZXR9O3ZhciBhcmdzPVtdO3ZhciBudW1PZkFyZ3M9YXJndW1lbnRzLmxlbmd0aDtmb3IodmFyIGk9MDtpPG51bU9mQXJncztpKyspe2FyZ3MucHVzaChhcmd1bWVudHNbaV0pfWFyZ3M9YXJncy5sZW5ndGg+Mj9hcmdzLnNwbGljZSgyLGFyZ3MubGVuZ3RoLTEpOltdO2FyZ3M9W2V2ZW50XS5jb25jYXQoYXJncyk7aWYodHlwZW9mIHRoaXMubGlzdGVuZXJzW3R5cGVdIT1cInVuZGVmaW5lZFwiKXt2YXIgbGlzdGVuZXJzPXRoaXMubGlzdGVuZXJzW3R5cGVdLnNsaWNlKCk7dmFyIG51bU9mQ2FsbGJhY2tzPWxpc3RlbmVycy5sZW5ndGg7Zm9yKHZhciBpPTA7aTxudW1PZkNhbGxiYWNrcztpKyspe3ZhciBsaXN0ZW5lcj1saXN0ZW5lcnNbaV07aWYobGlzdGVuZXImJmxpc3RlbmVyLmNhbGxiYWNrKXt2YXIgY29uY2F0QXJncz1hcmdzLmNvbmNhdChsaXN0ZW5lci5hcmdzKTtsaXN0ZW5lci5jYWxsYmFjay5hcHBseShsaXN0ZW5lci5zY29wZSxjb25jYXRBcmdzKX19fX0sZ2V0RXZlbnRzOmZ1bmN0aW9uKCl7dmFyIHN0cj1cIlwiO2Zvcih2YXIgdHlwZSBpbiB0aGlzLmxpc3RlbmVycyl7dmFyIG51bU9mQ2FsbGJhY2tzPXRoaXMubGlzdGVuZXJzW3R5cGVdLmxlbmd0aDtmb3IodmFyIGk9MDtpPG51bU9mQ2FsbGJhY2tzO2krKyl7dmFyIGxpc3RlbmVyPXRoaXMubGlzdGVuZXJzW3R5cGVdW2ldO3N0cis9bGlzdGVuZXIuc2NvcGUmJmxpc3RlbmVyLnNjb3BlLmNsYXNzTmFtZT9saXN0ZW5lci5zY29wZS5jbGFzc05hbWU6XCJhbm9ueW1vdXNcIjtzdHIrPVwiIGxpc3RlbiBmb3IgJ1wiK3R5cGUrXCInXFxuXCJ9fXJldHVybiBzdHJ9fTt2YXIgRXZlbnRCdXM9bmV3IEV2ZW50QnVzQ2xhc3M7cmV0dXJuIEV2ZW50QnVzfSk7IiwiLypcclxuXHRUaGlzIGlzIHJvdC5qcywgdGhlIFJPZ3VlbGlrZSBUb29sa2l0IGluIEphdmFTY3JpcHQuXHJcblx0VmVyc2lvbiAwLjd+ZGV2LCBnZW5lcmF0ZWQgb24gVGh1IDI0IE5vdiAyMDE2IDA4OjA3OjM5IE1TVC5cclxuKi9cclxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XHJcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxyXG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxyXG4gICAgICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxyXG4gICAgICAgIC8vIGxpa2UgTm9kZS5cclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcclxuICAgICAgICByb290LlJPVCA9IGZhY3RvcnkoKTtcclxuICAgIH1cclxufSh0aGlzLCBmdW5jdGlvbigpIHtcclxuLyoqXHJcbiAqIEBuYW1lc3BhY2UgVG9wLWxldmVsIFJPVCBuYW1lc3BhY2VcclxuICovXHJcbnZhciBST1QgPSB7XHJcblx0LyoqXHJcblx0ICogQHJldHVybnMge2Jvb2x9IElzIHJvdC5qcyBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyP1xyXG5cdCAqL1xyXG5cdGlzU3VwcG9ydGVkOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAhIShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLmdldENvbnRleHQgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpO1xyXG5cdH0sXHJcblxyXG5cdC8qKiBEZWZhdWx0IHdpdGggZm9yIGRpc3BsYXkgYW5kIG1hcCBnZW5lcmF0b3JzICovXHJcblx0REVGQVVMVF9XSURUSDogODAsXHJcblx0LyoqIERlZmF1bHQgaGVpZ2h0IGZvciBkaXNwbGF5IGFuZCBtYXAgZ2VuZXJhdG9ycyAqL1xyXG5cdERFRkFVTFRfSEVJR0hUOiAyNSxcclxuXHJcblx0LyoqIERpcmVjdGlvbmFsIGNvbnN0YW50cy4gT3JkZXJpbmcgaXMgaW1wb3J0YW50ISAqL1xyXG5cdERJUlM6IHtcclxuXHRcdFwiNFwiOiBbXHJcblx0XHRcdFsgMCwgLTFdLFxyXG5cdFx0XHRbIDEsICAwXSxcclxuXHRcdFx0WyAwLCAgMV0sXHJcblx0XHRcdFstMSwgIDBdXHJcblx0XHRdLFxyXG5cdFx0XCI4XCI6IFtcclxuXHRcdFx0WyAwLCAtMV0sXHJcblx0XHRcdFsgMSwgLTFdLFxyXG5cdFx0XHRbIDEsICAwXSxcclxuXHRcdFx0WyAxLCAgMV0sXHJcblx0XHRcdFsgMCwgIDFdLFxyXG5cdFx0XHRbLTEsICAxXSxcclxuXHRcdFx0Wy0xLCAgMF0sXHJcblx0XHRcdFstMSwgLTFdXHJcblx0XHRdLFxyXG5cdFx0XCI2XCI6IFtcclxuXHRcdFx0Wy0xLCAtMV0sXHJcblx0XHRcdFsgMSwgLTFdLFxyXG5cdFx0XHRbIDIsICAwXSxcclxuXHRcdFx0WyAxLCAgMV0sXHJcblx0XHRcdFstMSwgIDFdLFxyXG5cdFx0XHRbLTIsICAwXVxyXG5cdFx0XVxyXG5cdH0sXHJcblxyXG5cdC8qKiBDYW5jZWwga2V5LiAqL1xyXG5cdFZLX0NBTkNFTDogMywgXHJcblx0LyoqIEhlbHAga2V5LiAqL1xyXG5cdFZLX0hFTFA6IDYsIFxyXG5cdC8qKiBCYWNrc3BhY2Uga2V5LiAqL1xyXG5cdFZLX0JBQ0tfU1BBQ0U6IDgsIFxyXG5cdC8qKiBUYWIga2V5LiAqL1xyXG5cdFZLX1RBQjogOSwgXHJcblx0LyoqIDUga2V5IG9uIE51bXBhZCB3aGVuIE51bUxvY2sgaXMgdW5sb2NrZWQuIE9yIG9uIE1hYywgY2xlYXIga2V5IHdoaWNoIGlzIHBvc2l0aW9uZWQgYXQgTnVtTG9jayBrZXkuICovXHJcblx0VktfQ0xFQVI6IDEyLCBcclxuXHQvKiogUmV0dXJuL2VudGVyIGtleSBvbiB0aGUgbWFpbiBrZXlib2FyZC4gKi9cclxuXHRWS19SRVRVUk46IDEzLCBcclxuXHQvKiogUmVzZXJ2ZWQsIGJ1dCBub3QgdXNlZC4gKi9cclxuXHRWS19FTlRFUjogMTQsIFxyXG5cdC8qKiBTaGlmdCBrZXkuICovXHJcblx0VktfU0hJRlQ6IDE2LCBcclxuXHQvKiogQ29udHJvbCBrZXkuICovXHJcblx0VktfQ09OVFJPTDogMTcsIFxyXG5cdC8qKiBBbHQgKE9wdGlvbiBvbiBNYWMpIGtleS4gKi9cclxuXHRWS19BTFQ6IDE4LCBcclxuXHQvKiogUGF1c2Uga2V5LiAqL1xyXG5cdFZLX1BBVVNFOiAxOSwgXHJcblx0LyoqIENhcHMgbG9jay4gKi9cclxuXHRWS19DQVBTX0xPQ0s6IDIwLCBcclxuXHQvKiogRXNjYXBlIGtleS4gKi9cclxuXHRWS19FU0NBUEU6IDI3LCBcclxuXHQvKiogU3BhY2UgYmFyLiAqL1xyXG5cdFZLX1NQQUNFOiAzMiwgXHJcblx0LyoqIFBhZ2UgVXAga2V5LiAqL1xyXG5cdFZLX1BBR0VfVVA6IDMzLCBcclxuXHQvKiogUGFnZSBEb3duIGtleS4gKi9cclxuXHRWS19QQUdFX0RPV046IDM0LCBcclxuXHQvKiogRW5kIGtleS4gKi9cclxuXHRWS19FTkQ6IDM1LCBcclxuXHQvKiogSG9tZSBrZXkuICovXHJcblx0VktfSE9NRTogMzYsIFxyXG5cdC8qKiBMZWZ0IGFycm93LiAqL1xyXG5cdFZLX0xFRlQ6IDM3LCBcclxuXHQvKiogVXAgYXJyb3cuICovXHJcblx0VktfVVA6IDM4LCBcclxuXHQvKiogUmlnaHQgYXJyb3cuICovXHJcblx0VktfUklHSFQ6IDM5LCBcclxuXHQvKiogRG93biBhcnJvdy4gKi9cclxuXHRWS19ET1dOOiA0MCwgXHJcblx0LyoqIFByaW50IFNjcmVlbiBrZXkuICovXHJcblx0VktfUFJJTlRTQ1JFRU46IDQ0LCBcclxuXHQvKiogSW5zKGVydCkga2V5LiAqL1xyXG5cdFZLX0lOU0VSVDogNDUsIFxyXG5cdC8qKiBEZWwoZXRlKSBrZXkuICovXHJcblx0VktfREVMRVRFOiA0NiwgXHJcblx0LyoqKi9cclxuXHRWS18wOiA0OCxcclxuXHQvKioqL1xyXG5cdFZLXzE6IDQ5LFxyXG5cdC8qKiovXHJcblx0VktfMjogNTAsXHJcblx0LyoqKi9cclxuXHRWS18zOiA1MSxcclxuXHQvKioqL1xyXG5cdFZLXzQ6IDUyLFxyXG5cdC8qKiovXHJcblx0VktfNTogNTMsXHJcblx0LyoqKi9cclxuXHRWS182OiA1NCxcclxuXHQvKioqL1xyXG5cdFZLXzc6IDU1LFxyXG5cdC8qKiovXHJcblx0VktfODogNTYsXHJcblx0LyoqKi9cclxuXHRWS185OiA1NyxcclxuXHQvKiogQ29sb24gKDopIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0NPTE9OOiA1OCwgXHJcblx0LyoqIFNlbWljb2xvbiAoOykga2V5LiAqL1xyXG5cdFZLX1NFTUlDT0xPTjogNTksIFxyXG5cdC8qKiBMZXNzLXRoYW4gKDwpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0xFU1NfVEhBTjogNjAsIFxyXG5cdC8qKiBFcXVhbHMgKD0pIGtleS4gKi9cclxuXHRWS19FUVVBTFM6IDYxLCBcclxuXHQvKiogR3JlYXRlci10aGFuICg+KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19HUkVBVEVSX1RIQU46IDYyLCBcclxuXHQvKiogUXVlc3Rpb24gbWFyayAoPykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfUVVFU1RJT05fTUFSSzogNjMsIFxyXG5cdC8qKiBBdG1hcmsgKEApIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0FUOiA2NCwgXHJcblx0LyoqKi9cclxuXHRWS19BOiA2NSxcclxuXHQvKioqL1xyXG5cdFZLX0I6IDY2LFxyXG5cdC8qKiovXHJcblx0VktfQzogNjcsXHJcblx0LyoqKi9cclxuXHRWS19EOiA2OCxcclxuXHQvKioqL1xyXG5cdFZLX0U6IDY5LFxyXG5cdC8qKiovXHJcblx0VktfRjogNzAsXHJcblx0LyoqKi9cclxuXHRWS19HOiA3MSxcclxuXHQvKioqL1xyXG5cdFZLX0g6IDcyLFxyXG5cdC8qKiovXHJcblx0VktfSTogNzMsXHJcblx0LyoqKi9cclxuXHRWS19KOiA3NCxcclxuXHQvKioqL1xyXG5cdFZLX0s6IDc1LFxyXG5cdC8qKiovXHJcblx0VktfTDogNzYsXHJcblx0LyoqKi9cclxuXHRWS19NOiA3NyxcclxuXHQvKioqL1xyXG5cdFZLX046IDc4LFxyXG5cdC8qKiovXHJcblx0VktfTzogNzksXHJcblx0LyoqKi9cclxuXHRWS19QOiA4MCxcclxuXHQvKioqL1xyXG5cdFZLX1E6IDgxLFxyXG5cdC8qKiovXHJcblx0VktfUjogODIsXHJcblx0LyoqKi9cclxuXHRWS19TOiA4MyxcclxuXHQvKioqL1xyXG5cdFZLX1Q6IDg0LFxyXG5cdC8qKiovXHJcblx0VktfVTogODUsXHJcblx0LyoqKi9cclxuXHRWS19WOiA4NixcclxuXHQvKioqL1xyXG5cdFZLX1c6IDg3LFxyXG5cdC8qKiovXHJcblx0VktfWDogODgsXHJcblx0LyoqKi9cclxuXHRWS19ZOiA4OSxcclxuXHQvKioqL1xyXG5cdFZLX1o6IDkwLFxyXG5cdC8qKiovXHJcblx0VktfQ09OVEVYVF9NRU5VOiA5MyxcclxuXHQvKiogMCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEMDogOTYsIFxyXG5cdC8qKiAxIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQxOiA5NywgXHJcblx0LyoqIDIgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDI6IDk4LCBcclxuXHQvKiogMyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEMzogOTksIFxyXG5cdC8qKiA0IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ0OiAxMDAsIFxyXG5cdC8qKiA1IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ1OiAxMDEsIFxyXG5cdC8qKiA2IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ2OiAxMDIsIFxyXG5cdC8qKiA3IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ3OiAxMDMsIFxyXG5cdC8qKiA4IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ4OiAxMDQsIFxyXG5cdC8qKiA5IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQ5OiAxMDUsIFxyXG5cdC8qKiAqIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19NVUxUSVBMWTogMTA2LFxyXG5cdC8qKiArIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19BREQ6IDEwNywgXHJcblx0LyoqKi9cclxuXHRWS19TRVBBUkFUT1I6IDEwOCxcclxuXHQvKiogLSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfU1VCVFJBQ1Q6IDEwOSwgXHJcblx0LyoqIERlY2ltYWwgcG9pbnQgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX0RFQ0lNQUw6IDExMCwgXHJcblx0LyoqIC8gb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX0RJVklERTogMTExLCBcclxuXHQvKiogRjEga2V5LiAqL1xyXG5cdFZLX0YxOiAxMTIsIFxyXG5cdC8qKiBGMiBrZXkuICovXHJcblx0VktfRjI6IDExMywgXHJcblx0LyoqIEYzIGtleS4gKi9cclxuXHRWS19GMzogMTE0LCBcclxuXHQvKiogRjQga2V5LiAqL1xyXG5cdFZLX0Y0OiAxMTUsIFxyXG5cdC8qKiBGNSBrZXkuICovXHJcblx0VktfRjU6IDExNiwgXHJcblx0LyoqIEY2IGtleS4gKi9cclxuXHRWS19GNjogMTE3LCBcclxuXHQvKiogRjcga2V5LiAqL1xyXG5cdFZLX0Y3OiAxMTgsIFxyXG5cdC8qKiBGOCBrZXkuICovXHJcblx0VktfRjg6IDExOSwgXHJcblx0LyoqIEY5IGtleS4gKi9cclxuXHRWS19GOTogMTIwLCBcclxuXHQvKiogRjEwIGtleS4gKi9cclxuXHRWS19GMTA6IDEyMSwgXHJcblx0LyoqIEYxMSBrZXkuICovXHJcblx0VktfRjExOiAxMjIsIFxyXG5cdC8qKiBGMTIga2V5LiAqL1xyXG5cdFZLX0YxMjogMTIzLCBcclxuXHQvKiogRjEzIGtleS4gKi9cclxuXHRWS19GMTM6IDEyNCwgXHJcblx0LyoqIEYxNCBrZXkuICovXHJcblx0VktfRjE0OiAxMjUsIFxyXG5cdC8qKiBGMTUga2V5LiAqL1xyXG5cdFZLX0YxNTogMTI2LCBcclxuXHQvKiogRjE2IGtleS4gKi9cclxuXHRWS19GMTY6IDEyNywgXHJcblx0LyoqIEYxNyBrZXkuICovXHJcblx0VktfRjE3OiAxMjgsIFxyXG5cdC8qKiBGMTgga2V5LiAqL1xyXG5cdFZLX0YxODogMTI5LCBcclxuXHQvKiogRjE5IGtleS4gKi9cclxuXHRWS19GMTk6IDEzMCwgXHJcblx0LyoqIEYyMCBrZXkuICovXHJcblx0VktfRjIwOiAxMzEsIFxyXG5cdC8qKiBGMjEga2V5LiAqL1xyXG5cdFZLX0YyMTogMTMyLCBcclxuXHQvKiogRjIyIGtleS4gKi9cclxuXHRWS19GMjI6IDEzMywgXHJcblx0LyoqIEYyMyBrZXkuICovXHJcblx0VktfRjIzOiAxMzQsIFxyXG5cdC8qKiBGMjQga2V5LiAqL1xyXG5cdFZLX0YyNDogMTM1LCBcclxuXHQvKiogTnVtIExvY2sga2V5LiAqL1xyXG5cdFZLX05VTV9MT0NLOiAxNDQsIFxyXG5cdC8qKiBTY3JvbGwgTG9jayBrZXkuICovXHJcblx0VktfU0NST0xMX0xPQ0s6IDE0NSwgXHJcblx0LyoqIENpcmN1bWZsZXggKF4pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0NJUkNVTUZMRVg6IDE2MCwgXHJcblx0LyoqIEV4Y2xhbWF0aW9uICghKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19FWENMQU1BVElPTjogMTYxLCBcclxuXHQvKiogRG91YmxlIHF1b3RlICgpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0RPVUJMRV9RVU9URTogMTYyLCBcclxuXHQvKiogSGFzaCAoIykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfSEFTSDogMTYzLCBcclxuXHQvKiogRG9sbGFyIHNpZ24gKCQpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0RPTExBUjogMTY0LCBcclxuXHQvKiogUGVyY2VudCAoJSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfUEVSQ0VOVDogMTY1LCBcclxuXHQvKiogQW1wZXJzYW5kICgmKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19BTVBFUlNBTkQ6IDE2NiwgXHJcblx0LyoqIFVuZGVyc2NvcmUgKF8pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1VOREVSU0NPUkU6IDE2NywgXHJcblx0LyoqIE9wZW4gcGFyZW50aGVzaXMgKCgpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX09QRU5fUEFSRU46IDE2OCwgXHJcblx0LyoqIENsb3NlIHBhcmVudGhlc2lzICgpKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19DTE9TRV9QQVJFTjogMTY5LCBcclxuXHQvKiBBc3RlcmlzayAoKikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQVNURVJJU0s6IDE3MCxcclxuXHQvKiogUGx1cyAoKykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfUExVUzogMTcxLCBcclxuXHQvKiogUGlwZSAofCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfUElQRTogMTcyLCBcclxuXHQvKiogSHlwaGVuLVVTL2RvY3MvTWludXMgKC0pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0hZUEhFTl9NSU5VUzogMTczLCBcclxuXHQvKiogT3BlbiBjdXJseSBicmFja2V0ICh7KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19PUEVOX0NVUkxZX0JSQUNLRVQ6IDE3NCwgXHJcblx0LyoqIENsb3NlIGN1cmx5IGJyYWNrZXQgKH0pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0NMT1NFX0NVUkxZX0JSQUNLRVQ6IDE3NSwgXHJcblx0LyoqIFRpbGRlICh+KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19USUxERTogMTc2LCBcclxuXHQvKiogQ29tbWEgKCwpIGtleS4gKi9cclxuXHRWS19DT01NQTogMTg4LCBcclxuXHQvKiogUGVyaW9kICguKSBrZXkuICovXHJcblx0VktfUEVSSU9EOiAxOTAsIFxyXG5cdC8qKiBTbGFzaCAoLykga2V5LiAqL1xyXG5cdFZLX1NMQVNIOiAxOTEsIFxyXG5cdC8qKiBCYWNrIHRpY2sgKGApIGtleS4gKi9cclxuXHRWS19CQUNLX1FVT1RFOiAxOTIsIFxyXG5cdC8qKiBPcGVuIHNxdWFyZSBicmFja2V0IChbKSBrZXkuICovXHJcblx0VktfT1BFTl9CUkFDS0VUOiAyMTksIFxyXG5cdC8qKiBCYWNrIHNsYXNoIChcXCkga2V5LiAqL1xyXG5cdFZLX0JBQ0tfU0xBU0g6IDIyMCwgXHJcblx0LyoqIENsb3NlIHNxdWFyZSBicmFja2V0IChdKSBrZXkuICovXHJcblx0VktfQ0xPU0VfQlJBQ0tFVDogMjIxLCBcclxuXHQvKiogUXVvdGUgKCcnJykga2V5LiAqL1xyXG5cdFZLX1FVT1RFOiAyMjIsIFxyXG5cdC8qKiBNZXRhIGtleSBvbiBMaW51eCwgQ29tbWFuZCBrZXkgb24gTWFjLiAqL1xyXG5cdFZLX01FVEE6IDIyNCwgXHJcblx0LyoqIEFsdEdyIGtleSBvbiBMaW51eC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0FMVEdSOiAyMjUsIFxyXG5cdC8qKiBXaW5kb3dzIGxvZ28ga2V5IG9uIFdpbmRvd3MuIE9yIFN1cGVyIG9yIEh5cGVyIGtleSBvbiBMaW51eC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1dJTjogOTEsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19LQU5BOiAyMSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0hBTkdVTDogMjEsIFxyXG5cdC8qKiDoi7HmlbAga2V5IG9uIEphcGFuZXNlIE1hYyBrZXlib2FyZC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0VJU1U6IDIyLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfSlVOSkE6IDIzLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfRklOQUw6IDI0LCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfSEFOSkE6IDI1LCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfS0FOSkk6IDI1LCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfQ09OVkVSVDogMjgsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19OT05DT05WRVJUOiAyOSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0FDQ0VQVDogMzAsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19NT0RFQ0hBTkdFOiAzMSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX1NFTEVDVDogNDEsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19QUklOVDogNDIsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19FWEVDVVRFOiA0MywgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLlx0ICovXHJcblx0VktfU0xFRVA6IDk1IFxyXG59O1xyXG4vKipcclxuICogQG5hbWVzcGFjZVxyXG4gKiBDb250YWlucyB0ZXh0IHRva2VuaXphdGlvbiBhbmQgYnJlYWtpbmcgcm91dGluZXNcclxuICovXHJcblJPVC5UZXh0ID0ge1xyXG5cdFJFX0NPTE9SUzogLyUoW2JjXSl7KFtefV0qKX0vZyxcclxuXHJcblx0LyogdG9rZW4gdHlwZXMgKi9cclxuXHRUWVBFX1RFWFQ6XHRcdDAsXHJcblx0VFlQRV9ORVdMSU5FOlx0MSxcclxuXHRUWVBFX0ZHOlx0XHQyLFxyXG5cdFRZUEVfQkc6XHRcdDMsXHJcblxyXG5cdC8qKlxyXG5cdCAqIE1lYXN1cmUgc2l6ZSBvZiBhIHJlc3VsdGluZyB0ZXh0IGJsb2NrXHJcblx0ICovXHJcblx0bWVhc3VyZTogZnVuY3Rpb24oc3RyLCBtYXhXaWR0aCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IHt3aWR0aDowLCBoZWlnaHQ6MX07XHJcblx0XHR2YXIgdG9rZW5zID0gdGhpcy50b2tlbml6ZShzdHIsIG1heFdpZHRoKTtcclxuXHRcdHZhciBsaW5lV2lkdGggPSAwO1xyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPHRva2Vucy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHZhciB0b2tlbiA9IHRva2Vuc1tpXTtcclxuXHRcdFx0c3dpdGNoICh0b2tlbi50eXBlKSB7XHJcblx0XHRcdFx0Y2FzZSB0aGlzLlRZUEVfVEVYVDpcclxuXHRcdFx0XHRcdGxpbmVXaWR0aCArPSB0b2tlbi52YWx1ZS5sZW5ndGg7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgdGhpcy5UWVBFX05FV0xJTkU6XHJcblx0XHRcdFx0XHRyZXN1bHQuaGVpZ2h0Kys7XHJcblx0XHRcdFx0XHRyZXN1bHQud2lkdGggPSBNYXRoLm1heChyZXN1bHQud2lkdGgsIGxpbmVXaWR0aCk7XHJcblx0XHRcdFx0XHRsaW5lV2lkdGggPSAwO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXN1bHQud2lkdGggPSBNYXRoLm1heChyZXN1bHQud2lkdGgsIGxpbmVXaWR0aCk7XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0IHN0cmluZyB0byBhIHNlcmllcyBvZiBhIGZvcm1hdHRpbmcgY29tbWFuZHNcclxuXHQgKi9cclxuXHR0b2tlbml6ZTogZnVuY3Rpb24oc3RyLCBtYXhXaWR0aCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuXHRcdC8qIGZpcnN0IHRva2VuaXphdGlvbiBwYXNzIC0gc3BsaXQgdGV4dHMgYW5kIGNvbG9yIGZvcm1hdHRpbmcgY29tbWFuZHMgKi9cclxuXHRcdHZhciBvZmZzZXQgPSAwO1xyXG5cdFx0c3RyLnJlcGxhY2UodGhpcy5SRV9DT0xPUlMsIGZ1bmN0aW9uKG1hdGNoLCB0eXBlLCBuYW1lLCBpbmRleCkge1xyXG5cdFx0XHQvKiBzdHJpbmcgYmVmb3JlICovXHJcblx0XHRcdHZhciBwYXJ0ID0gc3RyLnN1YnN0cmluZyhvZmZzZXQsIGluZGV4KTtcclxuXHRcdFx0aWYgKHBhcnQubGVuZ3RoKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goe1xyXG5cdFx0XHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9URVhULFxyXG5cdFx0XHRcdFx0dmFsdWU6IHBhcnRcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyogY29sb3IgY29tbWFuZCAqL1xyXG5cdFx0XHRyZXN1bHQucHVzaCh7XHJcblx0XHRcdFx0dHlwZTogKHR5cGUgPT0gXCJjXCIgPyBST1QuVGV4dC5UWVBFX0ZHIDogUk9ULlRleHQuVFlQRV9CRyksXHJcblx0XHRcdFx0dmFsdWU6IG5hbWUudHJpbSgpXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0b2Zmc2V0ID0gaW5kZXggKyBtYXRjaC5sZW5ndGg7XHJcblx0XHRcdHJldHVybiBcIlwiO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0LyogbGFzdCByZW1haW5pbmcgcGFydCAqL1xyXG5cdFx0dmFyIHBhcnQgPSBzdHIuc3Vic3RyaW5nKG9mZnNldCk7XHJcblx0XHRpZiAocGFydC5sZW5ndGgpIHtcclxuXHRcdFx0cmVzdWx0LnB1c2goe1xyXG5cdFx0XHRcdHR5cGU6IFJPVC5UZXh0LlRZUEVfVEVYVCxcclxuXHRcdFx0XHR2YWx1ZTogcGFydFxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fYnJlYWtMaW5lcyhyZXN1bHQsIG1heFdpZHRoKTtcclxuXHR9LFxyXG5cclxuXHQvKiBpbnNlcnQgbGluZSBicmVha3MgaW50byBmaXJzdC1wYXNzIHRva2VuaXplZCBkYXRhICovXHJcblx0X2JyZWFrTGluZXM6IGZ1bmN0aW9uKHRva2VucywgbWF4V2lkdGgpIHtcclxuXHRcdGlmICghbWF4V2lkdGgpIHsgbWF4V2lkdGggPSBJbmZpbml0eTsgfVxyXG5cclxuXHRcdHZhciBpID0gMDtcclxuXHRcdHZhciBsaW5lTGVuZ3RoID0gMDtcclxuXHRcdHZhciBsYXN0VG9rZW5XaXRoU3BhY2UgPSAtMTtcclxuXHJcblx0XHR3aGlsZSAoaSA8IHRva2Vucy5sZW5ndGgpIHsgLyogdGFrZSBhbGwgdGV4dCB0b2tlbnMsIHJlbW92ZSBzcGFjZSwgYXBwbHkgbGluZWJyZWFrcyAqL1xyXG5cdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbaV07XHJcblx0XHRcdGlmICh0b2tlbi50eXBlID09IFJPVC5UZXh0LlRZUEVfTkVXTElORSkgeyAvKiByZXNldCAqL1xyXG5cdFx0XHRcdGxpbmVMZW5ndGggPSAwOyBcclxuXHRcdFx0XHRsYXN0VG9rZW5XaXRoU3BhY2UgPSAtMTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodG9rZW4udHlwZSAhPSBST1QuVGV4dC5UWVBFX1RFWFQpIHsgLyogc2tpcCBub24tdGV4dCB0b2tlbnMgKi9cclxuXHRcdFx0XHRpKys7XHJcblx0XHRcdFx0Y29udGludWU7IFxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKiByZW1vdmUgc3BhY2VzIGF0IHRoZSBiZWdpbm5pbmcgb2YgbGluZSAqL1xyXG5cdFx0XHR3aGlsZSAobGluZUxlbmd0aCA9PSAwICYmIHRva2VuLnZhbHVlLmNoYXJBdCgwKSA9PSBcIiBcIikgeyB0b2tlbi52YWx1ZSA9IHRva2VuLnZhbHVlLnN1YnN0cmluZygxKTsgfVxyXG5cclxuXHRcdFx0LyogZm9yY2VkIG5ld2xpbmU/IGluc2VydCB0d28gbmV3IHRva2VucyBhZnRlciB0aGlzIG9uZSAqL1xyXG5cdFx0XHR2YXIgaW5kZXggPSB0b2tlbi52YWx1ZS5pbmRleE9mKFwiXFxuXCIpO1xyXG5cdFx0XHRpZiAoaW5kZXggIT0gLTEpIHsgXHJcblx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgaSwgaW5kZXgsIHRydWUpOyBcclxuXHJcblx0XHRcdFx0LyogaWYgdGhlcmUgYXJlIHNwYWNlcyBhdCB0aGUgZW5kLCB3ZSBtdXN0IHJlbW92ZSB0aGVtICh3ZSBkbyBub3Qgd2FudCB0aGUgbGluZSB0b28gbG9uZykgKi9cclxuXHRcdFx0XHR2YXIgYXJyID0gdG9rZW4udmFsdWUuc3BsaXQoXCJcIik7XHJcblx0XHRcdFx0d2hpbGUgKGFyci5sZW5ndGggJiYgYXJyW2Fyci5sZW5ndGgtMV0gPT0gXCIgXCIpIHsgYXJyLnBvcCgpOyB9XHJcblx0XHRcdFx0dG9rZW4udmFsdWUgPSBhcnIuam9pbihcIlwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyogdG9rZW4gZGVnZW5lcmF0ZWQ/ICovXHJcblx0XHRcdGlmICghdG9rZW4udmFsdWUubGVuZ3RoKSB7XHJcblx0XHRcdFx0dG9rZW5zLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGxpbmVMZW5ndGggKyB0b2tlbi52YWx1ZS5sZW5ndGggPiBtYXhXaWR0aCkgeyAvKiBsaW5lIHRvbyBsb25nLCBmaW5kIGEgc3VpdGFibGUgYnJlYWtpbmcgc3BvdCAqL1xyXG5cclxuXHRcdFx0XHQvKiBpcyBpdCBwb3NzaWJsZSB0byBicmVhayB3aXRoaW4gdGhpcyB0b2tlbj8gKi9cclxuXHRcdFx0XHR2YXIgaW5kZXggPSAtMTtcclxuXHRcdFx0XHR3aGlsZSAoMSkge1xyXG5cdFx0XHRcdFx0dmFyIG5leHRJbmRleCA9IHRva2VuLnZhbHVlLmluZGV4T2YoXCIgXCIsIGluZGV4KzEpO1xyXG5cdFx0XHRcdFx0aWYgKG5leHRJbmRleCA9PSAtMSkgeyBicmVhazsgfVxyXG5cdFx0XHRcdFx0aWYgKGxpbmVMZW5ndGggKyBuZXh0SW5kZXggPiBtYXhXaWR0aCkgeyBicmVhazsgfVxyXG5cdFx0XHRcdFx0aW5kZXggPSBuZXh0SW5kZXg7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoaW5kZXggIT0gLTEpIHsgLyogYnJlYWsgYXQgc3BhY2Ugd2l0aGluIHRoaXMgb25lICovXHJcblx0XHRcdFx0XHR0b2tlbi52YWx1ZSA9IHRoaXMuX2JyZWFrSW5zaWRlVG9rZW4odG9rZW5zLCBpLCBpbmRleCwgdHJ1ZSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChsYXN0VG9rZW5XaXRoU3BhY2UgIT0gLTEpIHsgLyogaXMgdGhlcmUgYSBwcmV2aW91cyB0b2tlbiB3aGVyZSBhIGJyZWFrIGNhbiBvY2N1cj8gKi9cclxuXHRcdFx0XHRcdHZhciB0b2tlbiA9IHRva2Vuc1tsYXN0VG9rZW5XaXRoU3BhY2VdO1xyXG5cdFx0XHRcdFx0dmFyIGJyZWFrSW5kZXggPSB0b2tlbi52YWx1ZS5sYXN0SW5kZXhPZihcIiBcIik7XHJcblx0XHRcdFx0XHR0b2tlbi52YWx1ZSA9IHRoaXMuX2JyZWFrSW5zaWRlVG9rZW4odG9rZW5zLCBsYXN0VG9rZW5XaXRoU3BhY2UsIGJyZWFrSW5kZXgsIHRydWUpO1xyXG5cdFx0XHRcdFx0aSA9IGxhc3RUb2tlbldpdGhTcGFjZTtcclxuXHRcdFx0XHR9IGVsc2UgeyAvKiBmb3JjZSBicmVhayBpbiB0aGlzIHRva2VuICovXHJcblx0XHRcdFx0XHR0b2tlbi52YWx1ZSA9IHRoaXMuX2JyZWFrSW5zaWRlVG9rZW4odG9rZW5zLCBpLCBtYXhXaWR0aC1saW5lTGVuZ3RoLCBmYWxzZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIHsgLyogbGluZSBub3QgbG9uZywgY29udGludWUgKi9cclxuXHRcdFx0XHRsaW5lTGVuZ3RoICs9IHRva2VuLnZhbHVlLmxlbmd0aDtcclxuXHRcdFx0XHRpZiAodG9rZW4udmFsdWUuaW5kZXhPZihcIiBcIikgIT0gLTEpIHsgbGFzdFRva2VuV2l0aFNwYWNlID0gaTsgfVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpKys7IC8qIGFkdmFuY2UgdG8gbmV4dCB0b2tlbiAqL1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHR0b2tlbnMucHVzaCh7dHlwZTogUk9ULlRleHQuVFlQRV9ORVdMSU5FfSk7IC8qIGluc2VydCBmYWtlIG5ld2xpbmUgdG8gZml4IHRoZSBsYXN0IHRleHQgbGluZSAqL1xyXG5cclxuXHRcdC8qIHJlbW92ZSB0cmFpbGluZyBzcGFjZSBmcm9tIHRleHQgdG9rZW5zIGJlZm9yZSBuZXdsaW5lcyAqL1xyXG5cdFx0dmFyIGxhc3RUZXh0VG9rZW4gPSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dG9rZW5zLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0dmFyIHRva2VuID0gdG9rZW5zW2ldO1xyXG5cdFx0XHRzd2l0Y2ggKHRva2VuLnR5cGUpIHtcclxuXHRcdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfVEVYVDogbGFzdFRleHRUb2tlbiA9IHRva2VuOyBicmVhaztcclxuXHRcdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfTkVXTElORTogXHJcblx0XHRcdFx0XHRpZiAobGFzdFRleHRUb2tlbikgeyAvKiByZW1vdmUgdHJhaWxpbmcgc3BhY2UgKi9cclxuXHRcdFx0XHRcdFx0dmFyIGFyciA9IGxhc3RUZXh0VG9rZW4udmFsdWUuc3BsaXQoXCJcIik7XHJcblx0XHRcdFx0XHRcdHdoaWxlIChhcnIubGVuZ3RoICYmIGFyclthcnIubGVuZ3RoLTFdID09IFwiIFwiKSB7IGFyci5wb3AoKTsgfVxyXG5cdFx0XHRcdFx0XHRsYXN0VGV4dFRva2VuLnZhbHVlID0gYXJyLmpvaW4oXCJcIik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsYXN0VGV4dFRva2VuID0gbnVsbDtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRva2Vucy5wb3AoKTsgLyogcmVtb3ZlIGZha2UgdG9rZW4gKi9cclxuXHJcblx0XHRyZXR1cm4gdG9rZW5zO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZSBuZXcgdG9rZW5zIGFuZCBpbnNlcnQgdGhlbSBpbnRvIHRoZSBzdHJlYW1cclxuXHQgKiBAcGFyYW0ge29iamVjdFtdfSB0b2tlbnNcclxuXHQgKiBAcGFyYW0ge2ludH0gdG9rZW5JbmRleCBUb2tlbiBiZWluZyBwcm9jZXNzZWRcclxuXHQgKiBAcGFyYW0ge2ludH0gYnJlYWtJbmRleCBJbmRleCB3aXRoaW4gY3VycmVudCB0b2tlbidzIHZhbHVlXHJcblx0ICogQHBhcmFtIHtib29sfSByZW1vdmVCcmVha0NoYXIgRG8gd2Ugd2FudCB0byByZW1vdmUgdGhlIGJyZWFraW5nIGNoYXJhY3Rlcj9cclxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSByZW1haW5pbmcgdW5icm9rZW4gdG9rZW4gdmFsdWVcclxuXHQgKi9cclxuXHRfYnJlYWtJbnNpZGVUb2tlbjogZnVuY3Rpb24odG9rZW5zLCB0b2tlbkluZGV4LCBicmVha0luZGV4LCByZW1vdmVCcmVha0NoYXIpIHtcclxuXHRcdHZhciBuZXdCcmVha1Rva2VuID0ge1xyXG5cdFx0XHR0eXBlOiBST1QuVGV4dC5UWVBFX05FV0xJTkVcclxuXHRcdH07XHJcblx0XHR2YXIgbmV3VGV4dFRva2VuID0ge1xyXG5cdFx0XHR0eXBlOiBST1QuVGV4dC5UWVBFX1RFWFQsXHJcblx0XHRcdHZhbHVlOiB0b2tlbnNbdG9rZW5JbmRleF0udmFsdWUuc3Vic3RyaW5nKGJyZWFrSW5kZXggKyAocmVtb3ZlQnJlYWtDaGFyID8gMSA6IDApKVxyXG5cdFx0fTtcclxuXHRcdHRva2Vucy5zcGxpY2UodG9rZW5JbmRleCsxLCAwLCBuZXdCcmVha1Rva2VuLCBuZXdUZXh0VG9rZW4pO1xyXG5cdFx0cmV0dXJuIHRva2Vuc1t0b2tlbkluZGV4XS52YWx1ZS5zdWJzdHJpbmcoMCwgYnJlYWtJbmRleCk7XHJcblx0fVxyXG59O1xyXG4vKipcclxuICogQHJldHVybnMge2FueX0gUmFuZG9tbHkgcGlja2VkIGl0ZW0sIG51bGwgd2hlbiBsZW5ndGg9MFxyXG4gKi9cclxuQXJyYXkucHJvdG90eXBlLnJhbmRvbSA9IEFycmF5LnByb3RvdHlwZS5yYW5kb20gfHwgZnVuY3Rpb24oKSB7XHJcblx0aWYgKCF0aGlzLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfVxyXG5cdHJldHVybiB0aGlzW01hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiB0aGlzLmxlbmd0aCldO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEByZXR1cm5zIHthcnJheX0gTmV3IGFycmF5IHdpdGggcmFuZG9taXplZCBpdGVtc1xyXG4gKi9cclxuQXJyYXkucHJvdG90eXBlLnJhbmRvbWl6ZSA9IEFycmF5LnByb3RvdHlwZS5yYW5kb21pemUgfHwgZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gIHZhciBjbG9uZSA9IHRoaXMuc2xpY2UoKTtcclxuICB3aGlsZSAoY2xvbmUubGVuZ3RoKSB7XHJcbiAgICB2YXIgaW5kZXggPSBjbG9uZS5pbmRleE9mKGNsb25lLnJhbmRvbSgpKTtcclxuICAgIHJlc3VsdC5wdXNoKGNsb25lLnNwbGljZShpbmRleCwgMSlbMF0pO1xyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG4vKipcclxuICogQWx3YXlzIHBvc2l0aXZlIG1vZHVsdXNcclxuICogQHBhcmFtIHtpbnR9IG4gTW9kdWx1c1xyXG4gKiBAcmV0dXJucyB7aW50fSB0aGlzIG1vZHVsbyBuXHJcbiAqL1xyXG5OdW1iZXIucHJvdG90eXBlLm1vZCA9IE51bWJlci5wcm90b3R5cGUubW9kIHx8IGZ1bmN0aW9uKG4pIHtcclxuXHRyZXR1cm4gKCh0aGlzJW4pK24pJW47XHJcbn07XHJcbi8qKlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBGaXJzdCBsZXR0ZXIgY2FwaXRhbGl6ZWRcclxuICovXHJcblN0cmluZy5wcm90b3R5cGUuY2FwaXRhbGl6ZSA9IFN0cmluZy5wcm90b3R5cGUuY2FwaXRhbGl6ZSB8fCBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRoaXMuc3Vic3RyaW5nKDEpO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBMZWZ0IHBhZFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NoYXJhY3Rlcj1cIjBcIl1cclxuICogQHBhcmFtIHtpbnR9IFtjb3VudD0yXVxyXG4gKi9cclxuU3RyaW5nLnByb3RvdHlwZS5scGFkID0gU3RyaW5nLnByb3RvdHlwZS5scGFkIHx8IGZ1bmN0aW9uKGNoYXJhY3RlciwgY291bnQpIHtcclxuXHR2YXIgY2ggPSBjaGFyYWN0ZXIgfHwgXCIwXCI7XHJcblx0dmFyIGNudCA9IGNvdW50IHx8IDI7XHJcblxyXG5cdHZhciBzID0gXCJcIjtcclxuXHR3aGlsZSAocy5sZW5ndGggPCAoY250IC0gdGhpcy5sZW5ndGgpKSB7IHMgKz0gY2g7IH1cclxuXHRzID0gcy5zdWJzdHJpbmcoMCwgY250LXRoaXMubGVuZ3RoKTtcclxuXHRyZXR1cm4gcyt0aGlzO1xyXG59O1xyXG5cclxuLyoqIFxyXG4gKiBSaWdodCBwYWRcclxuICogQHBhcmFtIHtzdHJpbmd9IFtjaGFyYWN0ZXI9XCIwXCJdXHJcbiAqIEBwYXJhbSB7aW50fSBbY291bnQ9Ml1cclxuICovXHJcblN0cmluZy5wcm90b3R5cGUucnBhZCA9IFN0cmluZy5wcm90b3R5cGUucnBhZCB8fCBmdW5jdGlvbihjaGFyYWN0ZXIsIGNvdW50KSB7XHJcblx0dmFyIGNoID0gY2hhcmFjdGVyIHx8IFwiMFwiO1xyXG5cdHZhciBjbnQgPSBjb3VudCB8fCAyO1xyXG5cclxuXHR2YXIgcyA9IFwiXCI7XHJcblx0d2hpbGUgKHMubGVuZ3RoIDwgKGNudCAtIHRoaXMubGVuZ3RoKSkgeyBzICs9IGNoOyB9XHJcblx0cyA9IHMuc3Vic3RyaW5nKDAsIGNudC10aGlzLmxlbmd0aCk7XHJcblx0cmV0dXJuIHRoaXMrcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGb3JtYXQgYSBzdHJpbmcgaW4gYSBmbGV4aWJsZSB3YXkuIFNjYW5zIGZvciAlcyBzdHJpbmdzIGFuZCByZXBsYWNlcyB0aGVtIHdpdGggYXJndW1lbnRzLiBMaXN0IG9mIHBhdHRlcm5zIGlzIG1vZGlmaWFibGUgdmlhIFN0cmluZy5mb3JtYXQubWFwLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVcclxuICogQHBhcmFtIHthbnl9IFthcmd2XVxyXG4gKi9cclxuU3RyaW5nLmZvcm1hdCA9IFN0cmluZy5mb3JtYXQgfHwgZnVuY3Rpb24odGVtcGxhdGUpIHtcclxuXHR2YXIgbWFwID0gU3RyaW5nLmZvcm1hdC5tYXA7XHJcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cclxuXHR2YXIgcmVwbGFjZXIgPSBmdW5jdGlvbihtYXRjaCwgZ3JvdXAxLCBncm91cDIsIGluZGV4KSB7XHJcblx0XHRpZiAodGVtcGxhdGUuY2hhckF0KGluZGV4LTEpID09IFwiJVwiKSB7IHJldHVybiBtYXRjaC5zdWJzdHJpbmcoMSk7IH1cclxuXHRcdGlmICghYXJncy5sZW5ndGgpIHsgcmV0dXJuIG1hdGNoOyB9XHJcblx0XHR2YXIgb2JqID0gYXJnc1swXTtcclxuXHJcblx0XHR2YXIgZ3JvdXAgPSBncm91cDEgfHwgZ3JvdXAyO1xyXG5cdFx0dmFyIHBhcnRzID0gZ3JvdXAuc3BsaXQoXCIsXCIpO1xyXG5cdFx0dmFyIG5hbWUgPSBwYXJ0cy5zaGlmdCgpO1xyXG5cdFx0dmFyIG1ldGhvZCA9IG1hcFtuYW1lLnRvTG93ZXJDYXNlKCldO1xyXG5cdFx0aWYgKCFtZXRob2QpIHsgcmV0dXJuIG1hdGNoOyB9XHJcblxyXG5cdFx0dmFyIG9iaiA9IGFyZ3Muc2hpZnQoKTtcclxuXHRcdHZhciByZXBsYWNlZCA9IG9ialttZXRob2RdLmFwcGx5KG9iaiwgcGFydHMpO1xyXG5cclxuXHRcdHZhciBmaXJzdCA9IG5hbWUuY2hhckF0KDApO1xyXG5cdFx0aWYgKGZpcnN0ICE9IGZpcnN0LnRvTG93ZXJDYXNlKCkpIHsgcmVwbGFjZWQgPSByZXBsYWNlZC5jYXBpdGFsaXplKCk7IH1cclxuXHJcblx0XHRyZXR1cm4gcmVwbGFjZWQ7XHJcblx0fTtcclxuXHRyZXR1cm4gdGVtcGxhdGUucmVwbGFjZSgvJSg/OihbYS16XSspfCg/OnsoW159XSspfSkpL2dpLCByZXBsYWNlcik7XHJcbn07XHJcblxyXG5TdHJpbmcuZm9ybWF0Lm1hcCA9IFN0cmluZy5mb3JtYXQubWFwIHx8IHtcclxuXHRcInNcIjogXCJ0b1N0cmluZ1wiXHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVuaWVuY2Ugc2hvcnRjdXQgdG8gU3RyaW5nLmZvcm1hdCh0aGlzKVxyXG4gKi9cclxuU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgPSBTdHJpbmcucHJvdG90eXBlLmZvcm1hdCB8fCBmdW5jdGlvbigpIHtcclxuXHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcblx0YXJncy51bnNoaWZ0KHRoaXMpO1xyXG5cdHJldHVybiBTdHJpbmcuZm9ybWF0LmFwcGx5KFN0cmluZywgYXJncyk7XHJcbn07XHJcblxyXG5pZiAoIU9iamVjdC5jcmVhdGUpIHsgIFxyXG5cdC8qKlxyXG5cdCAqIEVTNSBPYmplY3QuY3JlYXRlXHJcblx0ICovXHJcblx0T2JqZWN0LmNyZWF0ZSA9IGZ1bmN0aW9uKG8pIHsgIFxyXG5cdFx0dmFyIHRtcCA9IGZ1bmN0aW9uKCkge307XHJcblx0XHR0bXAucHJvdG90eXBlID0gbztcclxuXHRcdHJldHVybiBuZXcgdG1wKCk7XHJcblx0fTsgIFxyXG59ICBcclxuLyoqXHJcbiAqIFNldHMgcHJvdG90eXBlIG9mIHRoaXMgZnVuY3Rpb24gdG8gYW4gaW5zdGFuY2Ugb2YgcGFyZW50IGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHBhcmVudFxyXG4gKi9cclxuRnVuY3Rpb24ucHJvdG90eXBlLmV4dGVuZCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5leHRlbmQgfHwgZnVuY3Rpb24ocGFyZW50KSB7XHJcblx0dGhpcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBhcmVudC5wcm90b3R5cGUpO1xyXG5cdHRoaXMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gdGhpcztcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPVxyXG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgZnVuY3Rpb24oY2IpIHsgcmV0dXJuIHNldFRpbWVvdXQoY2IsIDEwMDAvNjApOyB9O1xyXG5cclxuXHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPVxyXG5cdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm9DYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm1zQ2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IGZ1bmN0aW9uKGlkKSB7IHJldHVybiBjbGVhclRpbWVvdXQoaWQpOyB9O1xyXG59XHJcbi8qKlxyXG4gKiBAY2xhc3MgVmlzdWFsIG1hcCBkaXNwbGF5XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLndpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMuaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLmZvbnRTaXplPTE1XVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZm9udEZhbWlseT1cIm1vbm9zcGFjZVwiXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZm9udFN0eWxlPVwiXCJdIGJvbGQvaXRhbGljL25vbmUvYm90aFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZmc9XCIjY2NjXCJdXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5iZz1cIiMwMDBcIl1cclxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMuc3BhY2luZz0xXVxyXG4gKiBAcGFyYW0ge2Zsb2F0fSBbb3B0aW9ucy5ib3JkZXI9MF1cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmxheW91dD1cInJlY3RcIl1cclxuICogQHBhcmFtIHtib29sfSBbb3B0aW9ucy5mb3JjZVNxdWFyZVJhdGlvPWZhbHNlXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudGlsZVdpZHRoPTMyXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudGlsZUhlaWdodD0zMl1cclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zLnRpbGVNYXA9e31dXHJcbiAqIEBwYXJhbSB7aW1hZ2V9IFtvcHRpb25zLnRpbGVTZXQ9bnVsbF1cclxuICogQHBhcmFtIHtpbWFnZX0gW29wdGlvbnMudGlsZUNvbG9yaXplPWZhbHNlXVxyXG4gKi9cclxuUk9ULkRpc3BsYXkgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcblx0dGhpcy5fY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblx0dGhpcy5fZGF0YSA9IHt9O1xyXG5cdHRoaXMuX2RpcnR5ID0gZmFsc2U7IC8qIGZhbHNlID0gbm90aGluZywgdHJ1ZSA9IGFsbCwgb2JqZWN0ID0gZGlydHkgY2VsbHMgKi9cclxuXHR0aGlzLl9vcHRpb25zID0ge307XHJcblx0dGhpcy5fYmFja2VuZCA9IG51bGw7XHJcblx0XHJcblx0dmFyIGRlZmF1bHRPcHRpb25zID0ge1xyXG5cdFx0d2lkdGg6IFJPVC5ERUZBVUxUX1dJRFRILFxyXG5cdFx0aGVpZ2h0OiBST1QuREVGQVVMVF9IRUlHSFQsXHJcblx0XHR0cmFuc3Bvc2U6IGZhbHNlLFxyXG5cdFx0bGF5b3V0OiBcInJlY3RcIixcclxuXHRcdGZvbnRTaXplOiAxNSxcclxuXHRcdHNwYWNpbmc6IDEsXHJcblx0XHRib3JkZXI6IDAsXHJcblx0XHRmb3JjZVNxdWFyZVJhdGlvOiBmYWxzZSxcclxuXHRcdGZvbnRGYW1pbHk6IFwibW9ub3NwYWNlXCIsXHJcblx0XHRmb250U3R5bGU6IFwiXCIsXHJcblx0XHRmZzogXCIjY2NjXCIsXHJcblx0XHRiZzogXCIjMDAwXCIsXHJcblx0XHR0aWxlV2lkdGg6IDMyLFxyXG5cdFx0dGlsZUhlaWdodDogMzIsXHJcblx0XHR0aWxlTWFwOiB7fSxcclxuXHRcdHRpbGVTZXQ6IG51bGwsXHJcblx0XHR0aWxlQ29sb3JpemU6IGZhbHNlLFxyXG5cdFx0dGVybUNvbG9yOiBcInh0ZXJtXCJcclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyBkZWZhdWx0T3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHR0aGlzLnNldE9wdGlvbnMoZGVmYXVsdE9wdGlvbnMpO1xyXG5cdHRoaXMuREVCVUcgPSB0aGlzLkRFQlVHLmJpbmQodGhpcyk7XHJcblxyXG5cdHRoaXMuX3RpY2sgPSB0aGlzLl90aWNrLmJpbmQodGhpcyk7XHJcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX3RpY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERlYnVnIGhlbHBlciwgaWRlYWwgYXMgYSBtYXAgZ2VuZXJhdG9yIGNhbGxiYWNrLiBBbHdheXMgYm91bmQgdG8gdGhpcy5cclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtpbnR9IHdoYXRcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5ERUJVRyA9IGZ1bmN0aW9uKHgsIHksIHdoYXQpIHtcclxuXHR2YXIgY29sb3JzID0gW3RoaXMuX29wdGlvbnMuYmcsIHRoaXMuX29wdGlvbnMuZmddO1xyXG5cdHRoaXMuZHJhdyh4LCB5LCBudWxsLCBudWxsLCBjb2xvcnNbd2hhdCAlIGNvbG9ycy5sZW5ndGhdKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbGVhciB0aGUgd2hvbGUgZGlzcGxheSAoY292ZXIgaXQgd2l0aCBiYWNrZ3JvdW5kIGNvbG9yKVxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fZGF0YSA9IHt9O1xyXG5cdHRoaXMuX2RpcnR5ID0gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5EaXNwbGF5XHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHRpZiAob3B0aW9ucy53aWR0aCB8fCBvcHRpb25zLmhlaWdodCB8fCBvcHRpb25zLmZvbnRTaXplIHx8IG9wdGlvbnMuZm9udEZhbWlseSB8fCBvcHRpb25zLnNwYWNpbmcgfHwgb3B0aW9ucy5sYXlvdXQpIHtcclxuXHRcdGlmIChvcHRpb25zLmxheW91dCkgeyBcclxuXHRcdFx0dGhpcy5fYmFja2VuZCA9IG5ldyBST1QuRGlzcGxheVtvcHRpb25zLmxheW91dC5jYXBpdGFsaXplKCldKHRoaXMuX2NvbnRleHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBmb250ID0gKHRoaXMuX29wdGlvbnMuZm9udFN0eWxlID8gdGhpcy5fb3B0aW9ucy5mb250U3R5bGUgKyBcIiBcIiA6IFwiXCIpICsgdGhpcy5fb3B0aW9ucy5mb250U2l6ZSArIFwicHggXCIgKyB0aGlzLl9vcHRpb25zLmZvbnRGYW1pbHk7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZvbnQgPSBmb250O1xyXG5cdFx0dGhpcy5fYmFja2VuZC5jb21wdXRlKHRoaXMuX29wdGlvbnMpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5mb250ID0gZm9udDtcclxuXHRcdHRoaXMuX2NvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuXHRcdHRoaXMuX2NvbnRleHQudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuXHRcdHRoaXMuX2RpcnR5ID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyBjdXJyZW50bHkgc2V0IG9wdGlvbnNcclxuICogQHJldHVybnMge29iamVjdH0gQ3VycmVudCBvcHRpb25zIG9iamVjdCBcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX29wdGlvbnM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgRE9NIG5vZGUgb2YgdGhpcyBkaXNwbGF5XHJcbiAqIEByZXR1cm5zIHtub2RlfSBET00gbm9kZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9jb250ZXh0LmNhbnZhcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHRoZSBtYXhpbXVtIHdpZHRoL2hlaWdodCB0byBmaXQgaW50byBhIHNldCBvZiBnaXZlbiBjb25zdHJhaW50c1xyXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxXaWR0aCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgd2lkdGhcclxuICogQHBhcmFtIHtpbnR9IGF2YWlsSGVpZ2h0IE1heGltdW0gYWxsb3dlZCBwaXhlbCBoZWlnaHRcclxuICogQHJldHVybnMge2ludFsyXX0gY2VsbFdpZHRoLGNlbGxIZWlnaHRcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0cmV0dXJuIHRoaXMuX2JhY2tlbmQuY29tcHV0ZVNpemUoYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQsIHRoaXMuX29wdGlvbnMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdGhlIG1heGltdW0gZm9udCBzaXplIHRvIGZpdCBpbnRvIGEgc2V0IG9mIGdpdmVuIGNvbnN0cmFpbnRzXHJcbiAqIEBwYXJhbSB7aW50fSBhdmFpbFdpZHRoIE1heGltdW0gYWxsb3dlZCBwaXhlbCB3aWR0aFxyXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxIZWlnaHQgTWF4aW11bSBhbGxvd2VkIHBpeGVsIGhlaWdodFxyXG4gKiBAcmV0dXJucyB7aW50fSBmb250U2l6ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0cmV0dXJuIHRoaXMuX2JhY2tlbmQuY29tcHV0ZUZvbnRTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0LCB0aGlzLl9vcHRpb25zKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgRE9NIGV2ZW50IChtb3VzZSBvciB0b3VjaCkgdG8gbWFwIGNvb3JkaW5hdGVzLiBVc2VzIGZpcnN0IHRvdWNoIGZvciBtdWx0aS10b3VjaC5cclxuICogQHBhcmFtIHtFdmVudH0gZSBldmVudFxyXG4gKiBAcmV0dXJucyB7aW50WzJdfSAtMSBmb3IgdmFsdWVzIG91dHNpZGUgb2YgdGhlIGNhbnZhc1xyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKGUpIHtcclxuXHRpZiAoZS50b3VjaGVzKSB7XHJcblx0XHR2YXIgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xyXG5cdFx0dmFyIHkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIHggPSBlLmNsaWVudFg7XHJcblx0XHR2YXIgeSA9IGUuY2xpZW50WTtcclxuXHR9XHJcblxyXG5cdHZhciByZWN0ID0gdGhpcy5fY29udGV4dC5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0eCAtPSByZWN0LmxlZnQ7XHJcblx0eSAtPSByZWN0LnRvcDtcclxuXHRcclxuXHR4ICo9IHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoIC8gdGhpcy5fY29udGV4dC5jYW52YXMuY2xpZW50V2lkdGg7XHJcblx0eSAqPSB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgLyB0aGlzLl9jb250ZXh0LmNhbnZhcy5jbGllbnRIZWlnaHQ7XHJcblxyXG5cdGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoIHx8IHkgPj0gdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0KSB7IHJldHVybiBbLTEsIC0xXTsgfVxyXG5cclxuXHRyZXR1cm4gdGhpcy5fYmFja2VuZC5ldmVudFRvUG9zaXRpb24oeCwgeSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtzdHJpbmcgfHwgc3RyaW5nW119IGNoIE9uZSBvciBtb3JlIGNoYXJzICh3aWxsIGJlIG92ZXJsYXBwaW5nIHRoZW1zZWx2ZXMpXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbZmddIGZvcmVncm91bmQgY29sb3JcclxuICogQHBhcmFtIHtzdHJpbmd9IFtiZ10gYmFja2dyb3VuZCBjb2xvclxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbih4LCB5LCBjaCwgZmcsIGJnKSB7XHJcblx0aWYgKCFmZykgeyBmZyA9IHRoaXMuX29wdGlvbnMuZmc7IH1cclxuXHRpZiAoIWJnKSB7IGJnID0gdGhpcy5fb3B0aW9ucy5iZzsgfVxyXG5cdHRoaXMuX2RhdGFbeCtcIixcIit5XSA9IFt4LCB5LCBjaCwgZmcsIGJnXTtcclxuXHRcclxuXHRpZiAodGhpcy5fZGlydHkgPT09IHRydWUpIHsgcmV0dXJuOyB9IC8qIHdpbGwgYWxyZWFkeSByZWRyYXcgZXZlcnl0aGluZyAqL1xyXG5cdGlmICghdGhpcy5fZGlydHkpIHsgdGhpcy5fZGlydHkgPSB7fTsgfSAvKiBmaXJzdCEgKi9cclxuXHR0aGlzLl9kaXJ0eVt4K1wiLFwiK3ldID0gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEcmF3cyBhIHRleHQgYXQgZ2l2ZW4gcG9zaXRpb24uIE9wdGlvbmFsbHkgd3JhcHMgYXQgYSBtYXhpbXVtIGxlbmd0aC4gQ3VycmVudGx5IGRvZXMgbm90IHdvcmsgd2l0aCBoZXggbGF5b3V0LlxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBNYXkgY29udGFpbiBjb2xvci9iYWNrZ3JvdW5kIGZvcm1hdCBzcGVjaWZpZXJzLCAlY3tuYW1lfS8lYntuYW1lfSwgYm90aCBvcHRpb25hbC4gJWN7fS8lYnt9IHJlc2V0cyB0byBkZWZhdWx0LlxyXG4gKiBAcGFyYW0ge2ludH0gW21heFdpZHRoXSB3cmFwIGF0IHdoYXQgd2lkdGg/XHJcbiAqIEByZXR1cm5zIHtpbnR9IGxpbmVzIGRyYXduXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZHJhd1RleHQgPSBmdW5jdGlvbih4LCB5LCB0ZXh0LCBtYXhXaWR0aCkge1xyXG5cdHZhciBmZyA9IG51bGw7XHJcblx0dmFyIGJnID0gbnVsbDtcclxuXHR2YXIgY3ggPSB4O1xyXG5cdHZhciBjeSA9IHk7XHJcblx0dmFyIGxpbmVzID0gMTtcclxuXHRpZiAoIW1heFdpZHRoKSB7IG1heFdpZHRoID0gdGhpcy5fb3B0aW9ucy53aWR0aC14OyB9XHJcblxyXG5cdHZhciB0b2tlbnMgPSBST1QuVGV4dC50b2tlbml6ZSh0ZXh0LCBtYXhXaWR0aCk7XHJcblxyXG5cdHdoaWxlICh0b2tlbnMubGVuZ3RoKSB7IC8qIGludGVycHJldCB0b2tlbml6ZWQgb3Bjb2RlIHN0cmVhbSAqL1xyXG5cdFx0dmFyIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XHJcblx0XHRzd2l0Y2ggKHRva2VuLnR5cGUpIHtcclxuXHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX1RFWFQ6XHJcblx0XHRcdFx0dmFyIGlzU3BhY2UgPSBmYWxzZSwgaXNQcmV2U3BhY2UgPSBmYWxzZSwgaXNGdWxsV2lkdGggPSBmYWxzZSwgaXNQcmV2RnVsbFdpZHRoID0gZmFsc2U7XHJcblx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8dG9rZW4udmFsdWUubGVuZ3RoO2krKykge1xyXG5cdFx0XHRcdFx0dmFyIGNjID0gdG9rZW4udmFsdWUuY2hhckNvZGVBdChpKTtcclxuXHRcdFx0XHRcdHZhciBjID0gdG9rZW4udmFsdWUuY2hhckF0KGkpO1xyXG5cdFx0XHRcdFx0Ly8gQXNzaWduIHRvIGB0cnVlYCB3aGVuIHRoZSBjdXJyZW50IGNoYXIgaXMgZnVsbC13aWR0aC5cclxuXHRcdFx0XHRcdGlzRnVsbFdpZHRoID0gKGNjID4gMHhmZjAwICYmIGNjIDwgMHhmZjYxKSB8fCAoY2MgPiAweGZmZGMgJiYgY2MgPCAweGZmZTgpIHx8IGNjID4gMHhmZmVlO1xyXG5cdFx0XHRcdFx0Ly8gQ3VycmVudCBjaGFyIGlzIHNwYWNlLCB3aGF0ZXZlciBmdWxsLXdpZHRoIG9yIGhhbGYtd2lkdGggYm90aCBhcmUgT0suXHJcblx0XHRcdFx0XHRpc1NwYWNlID0gKGMuY2hhckNvZGVBdCgwKSA9PSAweDIwIHx8IGMuY2hhckNvZGVBdCgwKSA9PSAweDMwMDApO1xyXG5cdFx0XHRcdFx0Ly8gVGhlIHByZXZpb3VzIGNoYXIgaXMgZnVsbC13aWR0aCBhbmRcclxuXHRcdFx0XHRcdC8vIGN1cnJlbnQgY2hhciBpcyBuZXRoZXIgaGFsZi13aWR0aCBub3IgYSBzcGFjZS5cclxuXHRcdFx0XHRcdGlmIChpc1ByZXZGdWxsV2lkdGggJiYgIWlzRnVsbFdpZHRoICYmICFpc1NwYWNlKSB7IGN4Kys7IH0gLy8gYWRkIGFuIGV4dHJhIHBvc2l0aW9uXHJcblx0XHRcdFx0XHQvLyBUaGUgY3VycmVudCBjaGFyIGlzIGZ1bGwtd2lkdGggYW5kXHJcblx0XHRcdFx0XHQvLyB0aGUgcHJldmlvdXMgY2hhciBpcyBub3QgYSBzcGFjZS5cclxuXHRcdFx0XHRcdGlmKGlzRnVsbFdpZHRoICYmICFpc1ByZXZTcGFjZSkgeyBjeCsrOyB9IC8vIGFkZCBhbiBleHRyYSBwb3NpdGlvblxyXG5cdFx0XHRcdFx0dGhpcy5kcmF3KGN4KyssIGN5LCBjLCBmZywgYmcpO1xyXG5cdFx0XHRcdFx0aXNQcmV2U3BhY2UgPSBpc1NwYWNlO1xyXG5cdFx0XHRcdFx0aXNQcmV2RnVsbFdpZHRoID0gaXNGdWxsV2lkdGg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9GRzpcclxuXHRcdFx0XHRmZyA9IHRva2VuLnZhbHVlIHx8IG51bGw7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX0JHOlxyXG5cdFx0XHRcdGJnID0gdG9rZW4udmFsdWUgfHwgbnVsbDtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfTkVXTElORTpcclxuXHRcdFx0XHRjeCA9IHg7XHJcblx0XHRcdFx0Y3krKztcclxuXHRcdFx0XHRsaW5lcysrO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiBsaW5lcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaW1lciB0aWNrOiB1cGRhdGUgZGlydHkgcGFydHNcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5fdGljayA9IGZ1bmN0aW9uKCkge1xyXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl90aWNrKTtcclxuXHJcblx0aWYgKCF0aGlzLl9kaXJ0eSkgeyByZXR1cm47IH1cclxuXHJcblx0aWYgKHRoaXMuX2RpcnR5ID09PSB0cnVlKSB7IC8qIGRyYXcgYWxsICovXHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuX29wdGlvbnMuYmc7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoLCB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xyXG5cclxuXHRcdGZvciAodmFyIGlkIGluIHRoaXMuX2RhdGEpIHsgLyogcmVkcmF3IGNhY2hlZCBkYXRhICovXHJcblx0XHRcdHRoaXMuX2RyYXcoaWQsIGZhbHNlKTtcclxuXHRcdH1cclxuXHJcblx0fSBlbHNlIHsgLyogZHJhdyBvbmx5IGRpcnR5ICovXHJcblx0XHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fZGlydHkpIHtcclxuXHRcdFx0dGhpcy5fZHJhdyhrZXksIHRydWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGhpcy5fZGlydHkgPSBmYWxzZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFdoYXQgdG8gZHJhd1xyXG4gKiBAcGFyYW0ge2Jvb2x9IGNsZWFyQmVmb3JlIElzIGl0IG5lY2Vzc2FyeSB0byBjbGVhbiBiZWZvcmU/XHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuX2RyYXcgPSBmdW5jdGlvbihrZXksIGNsZWFyQmVmb3JlKSB7XHJcblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XHJcblx0aWYgKGRhdGFbNF0gIT0gdGhpcy5fb3B0aW9ucy5iZykgeyBjbGVhckJlZm9yZSA9IHRydWU7IH1cclxuXHJcblx0dGhpcy5fYmFja2VuZC5kcmF3KGRhdGEsIGNsZWFyQmVmb3JlKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBBYnN0cmFjdCBkaXNwbGF5IGJhY2tlbmQgbW9kdWxlXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5CYWNrZW5kID0gZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHkpIHtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBSZWN0YW5ndWxhciBiYWNrZW5kXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5SZWN0ID0gZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFJPVC5EaXNwbGF5LkJhY2tlbmQuY2FsbCh0aGlzLCBjb250ZXh0KTtcclxuXHRcclxuXHR0aGlzLl9zcGFjaW5nWCA9IDA7XHJcblx0dGhpcy5fc3BhY2luZ1kgPSAwO1xyXG5cdHRoaXMuX2NhbnZhc0NhY2hlID0ge307XHJcblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xyXG59O1xyXG5ST1QuRGlzcGxheS5SZWN0LmV4dGVuZChST1QuRGlzcGxheS5CYWNrZW5kKTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QuY2FjaGUgPSBmYWxzZTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dGhpcy5fY2FudmFzQ2FjaGUgPSB7fTtcclxuXHR0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcclxuXHJcblx0dmFyIGNoYXJXaWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jb250ZXh0Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XHJcblx0dGhpcy5fc3BhY2luZ1ggPSBNYXRoLmNlaWwob3B0aW9ucy5zcGFjaW5nICogY2hhcldpZHRoKTtcclxuXHR0aGlzLl9zcGFjaW5nWSA9IE1hdGguY2VpbChvcHRpb25zLnNwYWNpbmcgKiBvcHRpb25zLmZvbnRTaXplKTtcclxuXHJcblx0aWYgKHRoaXMuX29wdGlvbnMuZm9yY2VTcXVhcmVSYXRpbykge1xyXG5cdFx0dGhpcy5fc3BhY2luZ1ggPSB0aGlzLl9zcGFjaW5nWSA9IE1hdGgubWF4KHRoaXMuX3NwYWNpbmdYLCB0aGlzLl9zcGFjaW5nWSk7XHJcblx0fVxyXG5cclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCA9IG9wdGlvbnMud2lkdGggKiB0aGlzLl9zcGFjaW5nWDtcclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCAqIHRoaXMuX3NwYWNpbmdZO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XHJcblx0aWYgKHRoaXMuY29uc3RydWN0b3IuY2FjaGUpIHtcclxuXHRcdHRoaXMuX2RyYXdXaXRoQ2FjaGUoZGF0YSwgY2xlYXJCZWZvcmUpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aGlzLl9kcmF3Tm9DYWNoZShkYXRhLCBjbGVhckJlZm9yZSk7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuX2RyYXdXaXRoQ2FjaGUgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG5cdHZhciB4ID0gZGF0YVswXTtcclxuXHR2YXIgeSA9IGRhdGFbMV07XHJcblx0dmFyIGNoID0gZGF0YVsyXTtcclxuXHR2YXIgZmcgPSBkYXRhWzNdO1xyXG5cdHZhciBiZyA9IGRhdGFbNF07XHJcblxyXG5cdHZhciBoYXNoID0gXCJcIitjaCtmZytiZztcclxuXHRpZiAoaGFzaCBpbiB0aGlzLl9jYW52YXNDYWNoZSkge1xyXG5cdFx0dmFyIGNhbnZhcyA9IHRoaXMuX2NhbnZhc0NhY2hlW2hhc2hdO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgYiA9IHRoaXMuX29wdGlvbnMuYm9yZGVyO1xyXG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcblx0XHR2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHRcdGNhbnZhcy53aWR0aCA9IHRoaXMuX3NwYWNpbmdYO1xyXG5cdFx0Y2FudmFzLmhlaWdodCA9IHRoaXMuX3NwYWNpbmdZO1xyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IGJnO1xyXG5cdFx0Y3R4LmZpbGxSZWN0KGIsIGIsIGNhbnZhcy53aWR0aC1iLCBjYW52YXMuaGVpZ2h0LWIpO1xyXG5cdFx0XHJcblx0XHRpZiAoY2gpIHtcclxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IGZnO1xyXG5cdFx0XHRjdHguZm9udCA9IHRoaXMuX2NvbnRleHQuZm9udDtcclxuXHRcdFx0Y3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcblx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG5cclxuXHRcdFx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcclxuXHRcdFx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHRcdGN0eC5maWxsVGV4dChjaGFyc1tpXSwgdGhpcy5fc3BhY2luZ1gvMiwgTWF0aC5jZWlsKHRoaXMuX3NwYWNpbmdZLzIpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5fY2FudmFzQ2FjaGVbaGFzaF0gPSBjYW52YXM7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKGNhbnZhcywgeCp0aGlzLl9zcGFjaW5nWCwgeSp0aGlzLl9zcGFjaW5nWSk7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5fZHJhd05vQ2FjaGUgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG5cdHZhciB4ID0gZGF0YVswXTtcclxuXHR2YXIgeSA9IGRhdGFbMV07XHJcblx0dmFyIGNoID0gZGF0YVsyXTtcclxuXHR2YXIgZmcgPSBkYXRhWzNdO1xyXG5cdHZhciBiZyA9IGRhdGFbNF07XHJcblxyXG5cdGlmIChjbGVhckJlZm9yZSkgeyBcclxuXHRcdHZhciBiID0gdGhpcy5fb3B0aW9ucy5ib3JkZXI7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsUmVjdCh4KnRoaXMuX3NwYWNpbmdYICsgYiwgeSp0aGlzLl9zcGFjaW5nWSArIGIsIHRoaXMuX3NwYWNpbmdYIC0gYiwgdGhpcy5fc3BhY2luZ1kgLSBiKTtcclxuXHR9XHJcblx0XHJcblx0aWYgKCFjaCkgeyByZXR1cm47IH1cclxuXHJcblx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBmZztcclxuXHJcblx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcclxuXHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxUZXh0KGNoYXJzW2ldLCAoeCswLjUpICogdGhpcy5fc3BhY2luZ1gsIE1hdGguY2VpbCgoeSswLjUpICogdGhpcy5fc3BhY2luZ1kpKTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0dmFyIHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fc3BhY2luZ1gpO1xyXG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fc3BhY2luZ1kpO1xyXG5cdHJldHVybiBbd2lkdGgsIGhlaWdodF07XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHZhciBib3hXaWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX29wdGlvbnMud2lkdGgpO1xyXG5cdHZhciBib3hIZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy5oZWlnaHQpO1xyXG5cclxuXHQvKiBjb21wdXRlIGNoYXIgcmF0aW8gKi9cclxuXHR2YXIgb2xkRm9udCA9IHRoaXMuX2NvbnRleHQuZm9udDtcclxuXHR0aGlzLl9jb250ZXh0LmZvbnQgPSBcIjEwMHB4IFwiICsgdGhpcy5fb3B0aW9ucy5mb250RmFtaWx5O1xyXG5cdHZhciB3aWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jb250ZXh0Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XHJcblx0dGhpcy5fY29udGV4dC5mb250ID0gb2xkRm9udDtcclxuXHR2YXIgcmF0aW8gPSB3aWR0aCAvIDEwMDtcclxuXHRcdFxyXG5cdHZhciB3aWR0aEZyYWN0aW9uID0gcmF0aW8gKiBib3hIZWlnaHQgLyBib3hXaWR0aDtcclxuXHRpZiAod2lkdGhGcmFjdGlvbiA+IDEpIHsgLyogdG9vIHdpZGUgd2l0aCBjdXJyZW50IGFzcGVjdCByYXRpbyAqL1xyXG5cdFx0Ym94SGVpZ2h0ID0gTWF0aC5mbG9vcihib3hIZWlnaHQgLyB3aWR0aEZyYWN0aW9uKTtcclxuXHR9XHJcblx0cmV0dXJuIE1hdGguZmxvb3IoYm94SGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy5zcGFjaW5nKTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRyZXR1cm4gW01hdGguZmxvb3IoeC90aGlzLl9zcGFjaW5nWCksIE1hdGguZmxvb3IoeS90aGlzLl9zcGFjaW5nWSldO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEhleGFnb25hbCBiYWNrZW5kXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5IZXggPSBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0Uk9ULkRpc3BsYXkuQmFja2VuZC5jYWxsKHRoaXMsIGNvbnRleHQpO1xyXG5cclxuXHR0aGlzLl9zcGFjaW5nWCA9IDA7XHJcblx0dGhpcy5fc3BhY2luZ1kgPSAwO1xyXG5cdHRoaXMuX2hleFNpemUgPSAwO1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7fTtcclxufTtcclxuUk9ULkRpc3BsYXkuSGV4LmV4dGVuZChST1QuRGlzcGxheS5CYWNrZW5kKTtcclxuXHJcblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcclxuXHJcblx0LyogRklYTUUgY2hhciBzaXplIGNvbXB1dGF0aW9uIGRvZXMgbm90IHJlc3BlY3QgdHJhbnNwb3NlZCBoZXhlcyAqL1xyXG5cdHZhciBjaGFyV2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xyXG5cdHRoaXMuX2hleFNpemUgPSBNYXRoLmZsb29yKG9wdGlvbnMuc3BhY2luZyAqIChvcHRpb25zLmZvbnRTaXplICsgY2hhcldpZHRoL01hdGguc3FydCgzKSkgLyAyKTtcclxuXHR0aGlzLl9zcGFjaW5nWCA9IHRoaXMuX2hleFNpemUgKiBNYXRoLnNxcnQoMykgLyAyO1xyXG5cdHRoaXMuX3NwYWNpbmdZID0gdGhpcy5faGV4U2l6ZSAqIDEuNTtcclxuXHJcblx0aWYgKG9wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHR2YXIgeHByb3AgPSBcImhlaWdodFwiO1xyXG5cdFx0dmFyIHlwcm9wID0gXCJ3aWR0aFwiO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgeHByb3AgPSBcIndpZHRoXCI7XHJcblx0XHR2YXIgeXByb3AgPSBcImhlaWdodFwiO1xyXG5cdH1cclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhc1t4cHJvcF0gPSBNYXRoLmNlaWwoIChvcHRpb25zLndpZHRoICsgMSkgKiB0aGlzLl9zcGFjaW5nWCApO1xyXG5cdHRoaXMuX2NvbnRleHQuY2FudmFzW3lwcm9wXSA9IE1hdGguY2VpbCggKG9wdGlvbnMuaGVpZ2h0IC0gMSkgKiB0aGlzLl9zcGFjaW5nWSArIDIqdGhpcy5faGV4U2l6ZSApO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxuXHR2YXIgeCA9IGRhdGFbMF07XHJcblx0dmFyIHkgPSBkYXRhWzFdO1xyXG5cdHZhciBjaCA9IGRhdGFbMl07XHJcblx0dmFyIGZnID0gZGF0YVszXTtcclxuXHR2YXIgYmcgPSBkYXRhWzRdO1xyXG5cclxuXHR2YXIgcHggPSBbXHJcblx0XHQoeCsxKSAqIHRoaXMuX3NwYWNpbmdYLFxyXG5cdFx0eSAqIHRoaXMuX3NwYWNpbmdZICsgdGhpcy5faGV4U2l6ZVxyXG5cdF07XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7IHB4LnJldmVyc2UoKTsgfVxyXG5cclxuXHRpZiAoY2xlYXJCZWZvcmUpIHtcclxuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gYmc7XHJcblx0XHR0aGlzLl9maWxsKHB4WzBdLCBweFsxXSk7XHJcblx0fVxyXG5cclxuXHRpZiAoIWNoKSB7IHJldHVybjsgfVxyXG5cclxuXHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGZnO1xyXG5cclxuXHR2YXIgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xyXG5cdGZvciAodmFyIGk9MDtpPGNoYXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFRleHQoY2hhcnNbaV0sIHB4WzBdLCBNYXRoLmNlaWwocHhbMV0pKTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHRpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcclxuXHRcdGF2YWlsV2lkdGggKz0gYXZhaWxIZWlnaHQ7XHJcblx0XHRhdmFpbEhlaWdodCA9IGF2YWlsV2lkdGggLSBhdmFpbEhlaWdodDtcclxuXHRcdGF2YWlsV2lkdGggLT0gYXZhaWxIZWlnaHQ7XHJcblx0fVxyXG5cclxuXHR2YXIgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9zcGFjaW5nWCkgLSAxO1xyXG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKChhdmFpbEhlaWdodCAtIDIqdGhpcy5faGV4U2l6ZSkgLyB0aGlzLl9zcGFjaW5nWSArIDEpO1xyXG5cdHJldHVybiBbd2lkdGgsIGhlaWdodF07XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHRhdmFpbFdpZHRoICs9IGF2YWlsSGVpZ2h0O1xyXG5cdFx0YXZhaWxIZWlnaHQgPSBhdmFpbFdpZHRoIC0gYXZhaWxIZWlnaHQ7XHJcblx0XHRhdmFpbFdpZHRoIC09IGF2YWlsSGVpZ2h0O1xyXG5cdH1cclxuXHJcblx0dmFyIGhleFNpemVXaWR0aCA9IDIqYXZhaWxXaWR0aCAvICgodGhpcy5fb3B0aW9ucy53aWR0aCsxKSAqIE1hdGguc3FydCgzKSkgLSAxO1xyXG5cdHZhciBoZXhTaXplSGVpZ2h0ID0gYXZhaWxIZWlnaHQgLyAoMiArIDEuNSoodGhpcy5fb3B0aW9ucy5oZWlnaHQtMSkpO1xyXG5cdHZhciBoZXhTaXplID0gTWF0aC5taW4oaGV4U2l6ZVdpZHRoLCBoZXhTaXplSGVpZ2h0KTtcclxuXHJcblx0LyogY29tcHV0ZSBjaGFyIHJhdGlvICovXHJcblx0dmFyIG9sZEZvbnQgPSB0aGlzLl9jb250ZXh0LmZvbnQ7XHJcblx0dGhpcy5fY29udGV4dC5mb250ID0gXCIxMDBweCBcIiArIHRoaXMuX29wdGlvbnMuZm9udEZhbWlseTtcclxuXHR2YXIgd2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xyXG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IG9sZEZvbnQ7XHJcblx0dmFyIHJhdGlvID0gd2lkdGggLyAxMDA7XHJcblxyXG5cdGhleFNpemUgPSBNYXRoLmZsb29yKGhleFNpemUpKzE7IC8qIGNsb3Nlc3QgbGFyZ2VyIGhleFNpemUgKi9cclxuXHJcblx0LyogRklYTUUgY2hhciBzaXplIGNvbXB1dGF0aW9uIGRvZXMgbm90IHJlc3BlY3QgdHJhbnNwb3NlZCBoZXhlcyAqL1xyXG5cdHZhciBmb250U2l6ZSA9IDIqaGV4U2l6ZSAvICh0aGlzLl9vcHRpb25zLnNwYWNpbmcgKiAoMSArIHJhdGlvIC8gTWF0aC5zcXJ0KDMpKSk7XHJcblxyXG5cdC8qIGNsb3Nlc3Qgc21hbGxlciBmb250U2l6ZSAqL1xyXG5cdHJldHVybiBNYXRoLmNlaWwoZm9udFNpemUpLTE7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcclxuXHRcdHggKz0geTtcclxuXHRcdHkgPSB4LXk7XHJcblx0XHR4IC09IHk7XHJcblx0XHR2YXIgbm9kZVNpemUgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aDtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIG5vZGVTaXplID0gdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0O1xyXG5cdH1cclxuXHR2YXIgc2l6ZSA9IG5vZGVTaXplIC8gdGhpcy5fb3B0aW9ucy5oZWlnaHQ7XHJcblx0eSA9IE1hdGguZmxvb3IoeS9zaXplKTtcclxuXHJcblx0aWYgKHkubW9kKDIpKSB7IC8qIG9kZCByb3cgKi9cclxuXHRcdHggLT0gdGhpcy5fc3BhY2luZ1g7XHJcblx0XHR4ID0gMSArIDIqTWF0aC5mbG9vcih4LygyKnRoaXMuX3NwYWNpbmdYKSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHggPSAyKk1hdGguZmxvb3IoeC8oMip0aGlzLl9zcGFjaW5nWCkpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIFt4LCB5XTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBcmd1bWVudHMgYXJlIHBpeGVsIHZhbHVlcy4gSWYgXCJ0cmFuc3Bvc2VkXCIgbW9kZSBpcyBlbmFibGVkLCB0aGVuIHRoZXNlIHR3byBhcmUgYWxyZWFkeSBzd2FwcGVkLlxyXG4gKi9cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5fZmlsbCA9IGZ1bmN0aW9uKGN4LCBjeSkge1xyXG5cdHZhciBhID0gdGhpcy5faGV4U2l6ZTtcclxuXHR2YXIgYiA9IHRoaXMuX29wdGlvbnMuYm9yZGVyO1xyXG5cclxuXHR0aGlzLl9jb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cclxuXHRpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcclxuXHRcdHRoaXMuX2NvbnRleHQubW92ZVRvKGN4LWErYixcdGN5KTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LWEvMitiLFx0Y3krdGhpcy5fc3BhY2luZ1gtYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCthLzItYixcdGN5K3RoaXMuX3NwYWNpbmdYLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grYS1iLFx0Y3kpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grYS8yLWIsXHRjeS10aGlzLl9zcGFjaW5nWCtiKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LWEvMitiLFx0Y3ktdGhpcy5fc3BhY2luZ1grYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC1hK2IsXHRjeSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRoaXMuX2NvbnRleHQubW92ZVRvKGN4LFx0XHRcdFx0XHRjeS1hK2IpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grdGhpcy5fc3BhY2luZ1gtYixcdGN5LWEvMitiKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K3RoaXMuX3NwYWNpbmdYLWIsXHRjeSthLzItYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCxcdFx0XHRcdFx0Y3krYS1iKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LXRoaXMuX3NwYWNpbmdYK2IsXHRjeSthLzItYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC10aGlzLl9zcGFjaW5nWCtiLFx0Y3ktYS8yK2IpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gsXHRcdFx0XHRcdGN5LWErYik7XHJcblx0fVxyXG5cdHRoaXMuX2NvbnRleHQuZmlsbCgpO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFRpbGUgYmFja2VuZFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkuVGlsZSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRST1QuRGlzcGxheS5SZWN0LmNhbGwodGhpcywgY29udGV4dCk7XHJcblx0XHJcblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xyXG5cdHRoaXMuX2NvbG9yQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxufTtcclxuUk9ULkRpc3BsYXkuVGlsZS5leHRlbmQoUk9ULkRpc3BsYXkuUmVjdCk7XHJcblxyXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xyXG5cdHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoID0gb3B0aW9ucy53aWR0aCAqIG9wdGlvbnMudGlsZVdpZHRoO1xyXG5cdHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0ICogb3B0aW9ucy50aWxlSGVpZ2h0O1xyXG5cdHRoaXMuX2NvbG9yQ2FudmFzLndpZHRoID0gb3B0aW9ucy50aWxlV2lkdGg7XHJcblx0dGhpcy5fY29sb3JDYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy50aWxlSGVpZ2h0O1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XHJcblx0dmFyIHggPSBkYXRhWzBdO1xyXG5cdHZhciB5ID0gZGF0YVsxXTtcclxuXHR2YXIgY2ggPSBkYXRhWzJdO1xyXG5cdHZhciBmZyA9IGRhdGFbM107XHJcblx0dmFyIGJnID0gZGF0YVs0XTtcclxuXHJcblx0dmFyIHRpbGVXaWR0aCA9IHRoaXMuX29wdGlvbnMudGlsZVdpZHRoO1xyXG5cdHZhciB0aWxlSGVpZ2h0ID0gdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0O1xyXG5cclxuXHRpZiAoY2xlYXJCZWZvcmUpIHtcclxuXHRcdGlmICh0aGlzLl9vcHRpb25zLnRpbGVDb2xvcml6ZSkge1xyXG5cdFx0XHR0aGlzLl9jb250ZXh0LmNsZWFyUmVjdCh4KnRpbGVXaWR0aCwgeSp0aWxlSGVpZ2h0LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBiZztcclxuXHRcdFx0dGhpcy5fY29udGV4dC5maWxsUmVjdCh4KnRpbGVXaWR0aCwgeSp0aWxlSGVpZ2h0LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKCFjaCkgeyByZXR1cm47IH1cclxuXHJcblx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcclxuXHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgdGlsZSA9IHRoaXMuX29wdGlvbnMudGlsZU1hcFtjaGFyc1tpXV07XHJcblx0XHRpZiAoIXRpbGUpIHsgdGhyb3cgbmV3IEVycm9yKFwiQ2hhciAnXCIgKyBjaGFyc1tpXSArIFwiJyBub3QgZm91bmQgaW4gdGlsZU1hcFwiKTsgfVxyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5fb3B0aW9ucy50aWxlQ29sb3JpemUpIHsgLyogYXBwbHkgY29sb3JpemF0aW9uICovXHJcblx0XHRcdHZhciBjYW52YXMgPSB0aGlzLl9jb2xvckNhbnZhcztcclxuXHRcdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cdFx0XHRjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xyXG5cclxuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UoXHJcblx0XHRcdFx0dGhpcy5fb3B0aW9ucy50aWxlU2V0LFxyXG5cdFx0XHRcdHRpbGVbMF0sIHRpbGVbMV0sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCxcclxuXHRcdFx0XHQwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHRcclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdGlmIChmZyAhPSBcInRyYW5zcGFyZW50XCIpIHtcclxuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGZnO1xyXG5cdFx0XHRcdGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJzb3VyY2UtYXRvcFwiO1xyXG5cdFx0XHRcdGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGJnICE9IFwidHJhbnNwYXJlbnRcIikge1xyXG5cdFx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gYmc7XHJcblx0XHRcdFx0Y29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcImRlc3RpbmF0aW9uLW92ZXJcIjtcclxuXHRcdFx0XHRjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKGNhbnZhcywgeCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHJcblx0XHR9IGVsc2UgeyAvKiBubyBjb2xvcml6aW5nLCBlYXN5ICovXHJcblx0XHRcdHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKFxyXG5cdFx0XHRcdHRoaXMuX29wdGlvbnMudGlsZVNldCxcclxuXHRcdFx0XHR0aWxlWzBdLCB0aWxlWzFdLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsXHJcblx0XHRcdFx0eCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX29wdGlvbnMudGlsZVdpZHRoKTtcclxuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX29wdGlvbnMudGlsZUhlaWdodCk7XHJcblx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0dmFyIHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fb3B0aW9ucy53aWR0aCk7XHJcblx0dmFyIGhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9vcHRpb25zLmhlaWdodCk7XHJcblx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmV2ZW50VG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRyZXR1cm4gW01hdGguZmxvb3IoeC90aGlzLl9vcHRpb25zLnRpbGVXaWR0aCksIE1hdGguZmxvb3IoeS90aGlzLl9vcHRpb25zLnRpbGVIZWlnaHQpXTtcclxufTtcclxuLyoqXHJcbiAqIEBuYW1lc3BhY2VcclxuICogVGhpcyBjb2RlIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIEFsZWEgYWxnb3JpdGhtOyAoQykgMjAxMCBKb2hhbm5lcyBCYWFnw7hlLlxyXG4gKiBBbGVhIGlzIGxpY2Vuc2VkIGFjY29yZGluZyB0byB0aGUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZS5cclxuICovXHJcblJPVC5STkcgPSB7XHJcblx0LyoqXHJcblx0ICogQHJldHVybnMge251bWJlcn0gXHJcblx0ICovXHJcblx0Z2V0U2VlZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2VlZDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gc2VlZCBTZWVkIHRoZSBudW1iZXIgZ2VuZXJhdG9yXHJcblx0ICovXHJcblx0c2V0U2VlZDogZnVuY3Rpb24oc2VlZCkge1xyXG5cdFx0c2VlZCA9IChzZWVkIDwgMSA/IDEvc2VlZCA6IHNlZWQpO1xyXG5cclxuXHRcdHRoaXMuX3NlZWQgPSBzZWVkO1xyXG5cdFx0dGhpcy5fczAgPSAoc2VlZCA+Pj4gMCkgKiB0aGlzLl9mcmFjO1xyXG5cclxuXHRcdHNlZWQgPSAoc2VlZCo2OTA2OSArIDEpID4+PiAwO1xyXG5cdFx0dGhpcy5fczEgPSBzZWVkICogdGhpcy5fZnJhYztcclxuXHJcblx0XHRzZWVkID0gKHNlZWQqNjkwNjkgKyAxKSA+Pj4gMDtcclxuXHRcdHRoaXMuX3MyID0gc2VlZCAqIHRoaXMuX2ZyYWM7XHJcblxyXG5cdFx0dGhpcy5fYyA9IDE7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBAcmV0dXJucyB7ZmxvYXR9IFBzZXVkb3JhbmRvbSB2YWx1ZSBbMCwxKSwgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkXHJcblx0ICovXHJcblx0Z2V0VW5pZm9ybTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdCA9IDIwOTE2MzkgKiB0aGlzLl9zMCArIHRoaXMuX2MgKiB0aGlzLl9mcmFjO1xyXG5cdFx0dGhpcy5fczAgPSB0aGlzLl9zMTtcclxuXHRcdHRoaXMuX3MxID0gdGhpcy5fczI7XHJcblx0XHR0aGlzLl9jID0gdCB8IDA7XHJcblx0XHR0aGlzLl9zMiA9IHQgLSB0aGlzLl9jO1xyXG5cdFx0cmV0dXJuIHRoaXMuX3MyO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7aW50fSBsb3dlckJvdW5kIFRoZSBsb3dlciBlbmQgb2YgdGhlIHJhbmdlIHRvIHJldHVybiBhIHZhbHVlIGZyb20sIGluY2x1c2l2ZVxyXG5cdCAqIEBwYXJhbSB7aW50fSB1cHBlckJvdW5kIFRoZSB1cHBlciBlbmQgb2YgdGhlIHJhbmdlIHRvIHJldHVybiBhIHZhbHVlIGZyb20sIGluY2x1c2l2ZVxyXG5cdCAqIEByZXR1cm5zIHtpbnR9IFBzZXVkb3JhbmRvbSB2YWx1ZSBbbG93ZXJCb3VuZCwgdXBwZXJCb3VuZF0sIHVzaW5nIFJPVC5STkcuZ2V0VW5pZm9ybSgpIHRvIGRpc3RyaWJ1dGUgdGhlIHZhbHVlXHJcblx0ICovXHJcblx0Z2V0VW5pZm9ybUludDogZnVuY3Rpb24obG93ZXJCb3VuZCwgdXBwZXJCb3VuZCkge1xyXG5cdFx0dmFyIG1heCA9IE1hdGgubWF4KGxvd2VyQm91bmQsIHVwcGVyQm91bmQpO1xyXG5cdFx0dmFyIG1pbiA9IE1hdGgubWluKGxvd2VyQm91bmQsIHVwcGVyQm91bmQpO1xyXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IodGhpcy5nZXRVbmlmb3JtKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7ZmxvYXR9IFttZWFuPTBdIE1lYW4gdmFsdWVcclxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbc3RkZGV2PTFdIFN0YW5kYXJkIGRldmlhdGlvbi4gfjk1JSBvZiB0aGUgYWJzb2x1dGUgdmFsdWVzIHdpbGwgYmUgbG93ZXIgdGhhbiAyKnN0ZGRldi5cclxuXHQgKiBAcmV0dXJucyB7ZmxvYXR9IEEgbm9ybWFsbHkgZGlzdHJpYnV0ZWQgcHNldWRvcmFuZG9tIHZhbHVlXHJcblx0ICovXHJcblx0Z2V0Tm9ybWFsOiBmdW5jdGlvbihtZWFuLCBzdGRkZXYpIHtcclxuXHRcdGRvIHtcclxuXHRcdFx0dmFyIHUgPSAyKnRoaXMuZ2V0VW5pZm9ybSgpLTE7XHJcblx0XHRcdHZhciB2ID0gMip0aGlzLmdldFVuaWZvcm0oKS0xO1xyXG5cdFx0XHR2YXIgciA9IHUqdSArIHYqdjtcclxuXHRcdH0gd2hpbGUgKHIgPiAxIHx8IHIgPT0gMCk7XHJcblxyXG5cdFx0dmFyIGdhdXNzID0gdSAqIE1hdGguc3FydCgtMipNYXRoLmxvZyhyKS9yKTtcclxuXHRcdHJldHVybiAobWVhbiB8fCAwKSArIGdhdXNzKihzdGRkZXYgfHwgMSk7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQHJldHVybnMge2ludH0gUHNldWRvcmFuZG9tIHZhbHVlIFsxLDEwMF0gaW5jbHVzaXZlLCB1bmlmb3JtbHkgZGlzdHJpYnV0ZWRcclxuXHQgKi9cclxuXHRnZXRQZXJjZW50YWdlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAxICsgTWF0aC5mbG9vcih0aGlzLmdldFVuaWZvcm0oKSoxMDApO1xyXG5cdH0sXHJcblx0XHJcblx0LyoqXHJcblx0ICogQHBhcmFtIHtvYmplY3R9IGRhdGEga2V5PXdoYXRldmVyLCB2YWx1ZT13ZWlnaHQgKHJlbGF0aXZlIHByb2JhYmlsaXR5KVxyXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IHdoYXRldmVyXHJcblx0ICovXHJcblx0Z2V0V2VpZ2h0ZWRWYWx1ZTogZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0dmFyIHRvdGFsID0gMDtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaWQgaW4gZGF0YSkge1xyXG5cdFx0XHR0b3RhbCArPSBkYXRhW2lkXTtcclxuXHRcdH1cclxuXHRcdHZhciByYW5kb20gPSB0aGlzLmdldFVuaWZvcm0oKSp0b3RhbDtcclxuXHRcdFxyXG5cdFx0dmFyIHBhcnQgPSAwO1xyXG5cdFx0Zm9yICh2YXIgaWQgaW4gZGF0YSkge1xyXG5cdFx0XHRwYXJ0ICs9IGRhdGFbaWRdO1xyXG5cdFx0XHRpZiAocmFuZG9tIDwgcGFydCkgeyByZXR1cm4gaWQ7IH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBJZiBieSBzb21lIGZsb2F0aW5nLXBvaW50IGFubm95YW5jZSB3ZSBoYXZlXHJcblx0XHQvLyByYW5kb20gPj0gdG90YWwsIGp1c3QgcmV0dXJuIHRoZSBsYXN0IGlkLlxyXG5cdFx0cmV0dXJuIGlkO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEdldCBSTkcgc3RhdGUuIFVzZWZ1bCBmb3Igc3RvcmluZyB0aGUgc3RhdGUgYW5kIHJlLXNldHRpbmcgaXQgdmlhIHNldFN0YXRlLlxyXG5cdCAqIEByZXR1cm5zIHs/fSBJbnRlcm5hbCBzdGF0ZVxyXG5cdCAqL1xyXG5cdGdldFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBbdGhpcy5fczAsIHRoaXMuX3MxLCB0aGlzLl9zMiwgdGhpcy5fY107XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogU2V0IGEgcHJldmlvdXNseSByZXRyaWV2ZWQgc3RhdGUuXHJcblx0ICogQHBhcmFtIHs/fSBzdGF0ZVxyXG5cdCAqL1xyXG5cdHNldFN0YXRlOiBmdW5jdGlvbihzdGF0ZSkge1xyXG5cdFx0dGhpcy5fczAgPSBzdGF0ZVswXTtcclxuXHRcdHRoaXMuX3MxID0gc3RhdGVbMV07XHJcblx0XHR0aGlzLl9zMiA9IHN0YXRlWzJdO1xyXG5cdFx0dGhpcy5fYyAgPSBzdGF0ZVszXTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgYSBjbG9uZWQgUk5HXHJcblx0ICovXHJcblx0Y2xvbmU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNsb25lID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcclxuXHRcdGNsb25lLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGUoKSk7XHJcblx0XHRyZXR1cm4gY2xvbmU7XHJcblx0fSxcclxuXHJcblx0X3MwOiAwLFxyXG5cdF9zMTogMCxcclxuXHRfczI6IDAsXHJcblx0X2M6IDAsXHJcblx0X2ZyYWM6IDIuMzI4MzA2NDM2NTM4Njk2M2UtMTAgLyogMl4tMzIgKi9cclxufTtcclxuXHJcblJPVC5STkcuc2V0U2VlZChEYXRlLm5vdygpKTtcclxuLyoqXHJcbiAqIEBjbGFzcyAoTWFya292IHByb2Nlc3MpLWJhc2VkIHN0cmluZyBnZW5lcmF0b3IuIFxyXG4gKiBDb3BpZWQgZnJvbSBhIDxhIGhyZWY9XCJodHRwOi8vd3d3LnJvZ3VlYmFzaW4ucm9ndWVsaWtlZGV2ZWxvcG1lbnQub3JnL2luZGV4LnBocD90aXRsZT1OYW1lc19mcm9tX2FfaGlnaF9vcmRlcl9NYXJrb3ZfUHJvY2Vzc19hbmRfYV9zaW1wbGlmaWVkX0thdHpfYmFjay1vZmZfc2NoZW1lXCI+Um9ndWVCYXNpbiBhcnRpY2xlPC9hPi4gXHJcbiAqIE9mZmVycyBjb25maWd1cmFibGUgb3JkZXIgYW5kIHByaW9yLlxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7Ym9vbH0gW29wdGlvbnMud29yZHM9ZmFsc2VdIFVzZSB3b3JkIG1vZGU/XHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5vcmRlcj0zXVxyXG4gKiBAcGFyYW0ge2Zsb2F0fSBbb3B0aW9ucy5wcmlvcj0wLjAwMV1cclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdHdvcmRzOiBmYWxzZSxcclxuXHRcdG9yZGVyOiAzLFxyXG5cdFx0cHJpb3I6IDAuMDAxXHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHJcblx0dGhpcy5fYm91bmRhcnkgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDApO1xyXG5cdHRoaXMuX3N1ZmZpeCA9IHRoaXMuX2JvdW5kYXJ5O1xyXG5cdHRoaXMuX3ByZWZpeCA9IFtdO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX29wdGlvbnMub3JkZXI7aSsrKSB7IHRoaXMuX3ByZWZpeC5wdXNoKHRoaXMuX2JvdW5kYXJ5KTsgfVxyXG5cclxuXHR0aGlzLl9wcmlvclZhbHVlcyA9IHt9O1xyXG5cdHRoaXMuX3ByaW9yVmFsdWVzW3RoaXMuX2JvdW5kYXJ5XSA9IHRoaXMuX29wdGlvbnMucHJpb3I7XHJcblxyXG5cdHRoaXMuX2RhdGEgPSB7fTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgYWxsIGxlYXJuaW5nIGRhdGFcclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fZGF0YSA9IHt9O1xyXG5cdHRoaXMuX3ByaW9yVmFsdWVzID0ge307XHJcbn07XHJcblxyXG4vKipcclxuICogQHJldHVybnMge3N0cmluZ30gR2VuZXJhdGVkIHN0cmluZ1xyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgcmVzdWx0ID0gW3RoaXMuX3NhbXBsZSh0aGlzLl9wcmVmaXgpXTtcclxuXHR3aGlsZSAocmVzdWx0W3Jlc3VsdC5sZW5ndGgtMV0gIT0gdGhpcy5fYm91bmRhcnkpIHtcclxuXHRcdHJlc3VsdC5wdXNoKHRoaXMuX3NhbXBsZShyZXN1bHQpKTtcclxuXHR9XHJcblx0cmV0dXJuIHRoaXMuX2pvaW4ocmVzdWx0LnNsaWNlKDAsIC0xKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogT2JzZXJ2ZSAobGVhcm4pIGEgc3RyaW5nIGZyb20gYSB0cmFpbmluZyBzZXRcclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbihzdHJpbmcpIHtcclxuXHR2YXIgdG9rZW5zID0gdGhpcy5fc3BsaXQoc3RyaW5nKTtcclxuXHJcblx0Zm9yICh2YXIgaT0wOyBpPHRva2Vucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dGhpcy5fcHJpb3JWYWx1ZXNbdG9rZW5zW2ldXSA9IHRoaXMuX29wdGlvbnMucHJpb3I7XHJcblx0fVxyXG5cclxuXHR0b2tlbnMgPSB0aGlzLl9wcmVmaXguY29uY2F0KHRva2VucykuY29uY2F0KHRoaXMuX3N1ZmZpeCk7IC8qIGFkZCBib3VuZGFyeSBzeW1ib2xzICovXHJcblxyXG5cdGZvciAodmFyIGk9dGhpcy5fb3B0aW9ucy5vcmRlcjsgaTx0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBjb250ZXh0ID0gdG9rZW5zLnNsaWNlKGktdGhpcy5fb3B0aW9ucy5vcmRlciwgaSk7XHJcblx0XHR2YXIgZXZlbnQgPSB0b2tlbnNbaV07XHJcblx0XHRmb3IgKHZhciBqPTA7IGo8Y29udGV4dC5sZW5ndGg7IGorKykge1xyXG5cdFx0XHR2YXIgc3ViY29udGV4dCA9IGNvbnRleHQuc2xpY2Uoaik7XHJcblx0XHRcdHRoaXMuX29ic2VydmVFdmVudChzdWJjb250ZXh0LCBldmVudCk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuZ2V0U3RhdHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgcGFydHMgPSBbXTtcclxuXHJcblx0dmFyIHByaW9yQ291bnQgPSAwO1xyXG5cdGZvciAodmFyIHAgaW4gdGhpcy5fcHJpb3JWYWx1ZXMpIHsgcHJpb3JDb3VudCsrOyB9XHJcblx0cHJpb3JDb3VudC0tOyAvKiBib3VuZGFyeSAqL1xyXG5cdHBhcnRzLnB1c2goXCJkaXN0aW5jdCBzYW1wbGVzOiBcIiArIHByaW9yQ291bnQpO1xyXG5cclxuXHR2YXIgZGF0YUNvdW50ID0gMDtcclxuXHR2YXIgZXZlbnRDb3VudCA9IDA7XHJcblx0Zm9yICh2YXIgcCBpbiB0aGlzLl9kYXRhKSB7IFxyXG5cdFx0ZGF0YUNvdW50Kys7IFxyXG5cdFx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2RhdGFbcF0pIHtcclxuXHRcdFx0ZXZlbnRDb3VudCsrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRwYXJ0cy5wdXNoKFwiZGljdGlvbmFyeSBzaXplIChjb250ZXh0cyk6IFwiICsgZGF0YUNvdW50KTtcclxuXHRwYXJ0cy5wdXNoKFwiZGljdGlvbmFyeSBzaXplIChldmVudHMpOiBcIiArIGV2ZW50Q291bnQpO1xyXG5cclxuXHRyZXR1cm4gcGFydHMuam9pbihcIiwgXCIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nW119XHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fc3BsaXQgPSBmdW5jdGlvbihzdHIpIHtcclxuXHRyZXR1cm4gc3RyLnNwbGl0KHRoaXMuX29wdGlvbnMud29yZHMgPyAvXFxzKy8gOiBcIlwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBcclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9qb2luID0gZnVuY3Rpb24oYXJyKSB7XHJcblx0cmV0dXJuIGFyci5qb2luKHRoaXMuX29wdGlvbnMud29yZHMgPyBcIiBcIiA6IFwiXCIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119IGNvbnRleHRcclxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fb2JzZXJ2ZUV2ZW50ID0gZnVuY3Rpb24oY29udGV4dCwgZXZlbnQpIHtcclxuXHR2YXIga2V5ID0gdGhpcy5fam9pbihjb250ZXh0KTtcclxuXHRpZiAoIShrZXkgaW4gdGhpcy5fZGF0YSkpIHsgdGhpcy5fZGF0YVtrZXldID0ge307IH1cclxuXHR2YXIgZGF0YSA9IHRoaXMuX2RhdGFba2V5XTtcclxuXHJcblx0aWYgKCEoZXZlbnQgaW4gZGF0YSkpIHsgZGF0YVtldmVudF0gPSAwOyB9XHJcblx0ZGF0YVtldmVudF0rKztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuX3NhbXBsZSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRjb250ZXh0ID0gdGhpcy5fYmFja29mZihjb250ZXh0KTtcclxuXHR2YXIga2V5ID0gdGhpcy5fam9pbihjb250ZXh0KTtcclxuXHR2YXIgZGF0YSA9IHRoaXMuX2RhdGFba2V5XTtcclxuXHJcblx0dmFyIGF2YWlsYWJsZSA9IHt9O1xyXG5cclxuXHRpZiAodGhpcy5fb3B0aW9ucy5wcmlvcikge1xyXG5cdFx0Zm9yICh2YXIgZXZlbnQgaW4gdGhpcy5fcHJpb3JWYWx1ZXMpIHsgYXZhaWxhYmxlW2V2ZW50XSA9IHRoaXMuX3ByaW9yVmFsdWVzW2V2ZW50XTsgfVxyXG5cdFx0Zm9yICh2YXIgZXZlbnQgaW4gZGF0YSkgeyBhdmFpbGFibGVbZXZlbnRdICs9IGRhdGFbZXZlbnRdOyB9XHJcblx0fSBlbHNlIHsgXHJcblx0XHRhdmFpbGFibGUgPSBkYXRhO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIFJPVC5STkcuZ2V0V2VpZ2h0ZWRWYWx1ZShhdmFpbGFibGUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119XHJcbiAqIEByZXR1cm5zIHtzdHJpbmdbXX1cclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9iYWNrb2ZmID0gZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdGlmIChjb250ZXh0Lmxlbmd0aCA+IHRoaXMuX29wdGlvbnMub3JkZXIpIHtcclxuXHRcdGNvbnRleHQgPSBjb250ZXh0LnNsaWNlKC10aGlzLl9vcHRpb25zLm9yZGVyKTtcclxuXHR9IGVsc2UgaWYgKGNvbnRleHQubGVuZ3RoIDwgdGhpcy5fb3B0aW9ucy5vcmRlcikge1xyXG5cdFx0Y29udGV4dCA9IHRoaXMuX3ByZWZpeC5zbGljZSgwLCB0aGlzLl9vcHRpb25zLm9yZGVyIC0gY29udGV4dC5sZW5ndGgpLmNvbmNhdChjb250ZXh0KTtcclxuXHR9XHJcblxyXG5cdHdoaWxlICghKHRoaXMuX2pvaW4oY29udGV4dCkgaW4gdGhpcy5fZGF0YSkgJiYgY29udGV4dC5sZW5ndGggPiAwKSB7IGNvbnRleHQgPSBjb250ZXh0LnNsaWNlKDEpOyB9XHJcblxyXG5cdHJldHVybiBjb250ZXh0O1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEdlbmVyaWMgZXZlbnQgcXVldWU6IHN0b3JlcyBldmVudHMgYW5kIHJldHJpZXZlcyB0aGVtIGJhc2VkIG9uIHRoZWlyIHRpbWVcclxuICovXHJcblJPVC5FdmVudFF1ZXVlID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fdGltZSA9IDA7XHJcblx0dGhpcy5fZXZlbnRzID0gW107XHJcblx0dGhpcy5fZXZlbnRUaW1lcyA9IFtdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IEVsYXBzZWQgdGltZVxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fdGltZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbGVhciBhbGwgc2NoZWR1bGVkIGV2ZW50c1xyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fZXZlbnRzID0gW107XHJcblx0dGhpcy5fZXZlbnRUaW1lcyA9IFtdO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7P30gZXZlbnRcclxuICogQHBhcmFtIHtudW1iZXJ9IHRpbWVcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihldmVudCwgdGltZSkge1xyXG5cdHZhciBpbmRleCA9IHRoaXMuX2V2ZW50cy5sZW5ndGg7XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fZXZlbnRUaW1lcy5sZW5ndGg7aSsrKSB7XHJcblx0XHRpZiAodGhpcy5fZXZlbnRUaW1lc1tpXSA+IHRpbWUpIHtcclxuXHRcdFx0aW5kZXggPSBpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuX2V2ZW50cy5zcGxpY2UoaW5kZXgsIDAsIGV2ZW50KTtcclxuXHR0aGlzLl9ldmVudFRpbWVzLnNwbGljZShpbmRleCwgMCwgdGltZSk7XHJcbn07XHJcblxyXG4vKipcclxuICogTG9jYXRlcyB0aGUgbmVhcmVzdCBldmVudCwgYWR2YW5jZXMgdGltZSBpZiBuZWNlc3NhcnkuIFJldHVybnMgdGhhdCBldmVudCBhbmQgcmVtb3ZlcyBpdCBmcm9tIHRoZSBxdWV1ZS5cclxuICogQHJldHVybnMgez8gfHwgbnVsbH0gVGhlIGV2ZW50IHByZXZpb3VzbHkgYWRkZWQgYnkgYWRkRXZlbnQsIG51bGwgaWYgbm8gZXZlbnQgYXZhaWxhYmxlXHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKCF0aGlzLl9ldmVudHMubGVuZ3RoKSB7IHJldHVybiBudWxsOyB9XHJcblxyXG5cdHZhciB0aW1lID0gdGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoMCwgMSlbMF07XHJcblx0aWYgKHRpbWUgPiAwKSB7IC8qIGFkdmFuY2UgKi9cclxuXHRcdHRoaXMuX3RpbWUgKz0gdGltZTtcclxuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuX2V2ZW50VGltZXMubGVuZ3RoO2krKykgeyB0aGlzLl9ldmVudFRpbWVzW2ldIC09IHRpbWU7IH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzLl9ldmVudHMuc3BsaWNlKDAsIDEpWzBdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgdGltZSBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIGV2ZW50XHJcbiAqIEBwYXJhbSB7P30gZXZlbnRcclxuICogQHJldHVybnMge251bWJlcn0gdGltZVxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmdldEV2ZW50VGltZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0dmFyIGluZGV4ID0gdGhpcy5fZXZlbnRzLmluZGV4T2YoZXZlbnQpO1xyXG5cdGlmIChpbmRleCA9PSAtMSkgeyByZXR1cm4gdW5kZWZpbmVkIH1cclxuXHRyZXR1cm4gdGhpcy5fZXZlbnRUaW1lc1tpbmRleF07XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGFuIGV2ZW50IGZyb20gdGhlIHF1ZXVlXHJcbiAqIEBwYXJhbSB7P30gZXZlbnRcclxuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3M/XHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHR2YXIgaW5kZXggPSB0aGlzLl9ldmVudHMuaW5kZXhPZihldmVudCk7XHJcblx0aWYgKGluZGV4ID09IC0xKSB7IHJldHVybiBmYWxzZSB9XHJcblx0dGhpcy5fcmVtb3ZlKGluZGV4KTtcclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgYW4gZXZlbnQgZnJvbSB0aGUgcXVldWVcclxuICogQHBhcmFtIHtpbnR9IGluZGV4XHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuX3JlbW92ZSA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0dGhpcy5fZXZlbnRzLnNwbGljZShpbmRleCwgMSk7XHJcblx0dGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEFic3RyYWN0IHNjaGVkdWxlclxyXG4gKi9cclxuUk9ULlNjaGVkdWxlciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX3F1ZXVlID0gbmV3IFJPVC5FdmVudFF1ZXVlKCk7XHJcblx0dGhpcy5fcmVwZWF0ID0gW107XHJcblx0dGhpcy5fY3VycmVudCA9IG51bGw7XHJcbn07XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuRXZlbnRRdWV1ZSNnZXRUaW1lXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5nZXRUaW1lID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3F1ZXVlLmdldFRpbWUoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gez99IGl0ZW1cclxuICogQHBhcmFtIHtib29sfSByZXBlYXRcclxuICovXHJcblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCkge1xyXG5cdGlmIChyZXBlYXQpIHsgdGhpcy5fcmVwZWF0LnB1c2goaXRlbSk7IH1cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHRpbWUgdGhlIGdpdmVuIGl0ZW0gaXMgc2NoZWR1bGVkIGZvclxyXG4gKiBAcGFyYW0gez99IGl0ZW1cclxuICogQHJldHVybnMge251bWJlcn0gdGltZVxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuZ2V0VGltZU9mID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdHJldHVybiB0aGlzLl9xdWV1ZS5nZXRFdmVudFRpbWUoaXRlbSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xlYXIgYWxsIGl0ZW1zXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX3F1ZXVlLmNsZWFyKCk7XHJcblx0dGhpcy5fcmVwZWF0ID0gW107XHJcblx0dGhpcy5fY3VycmVudCA9IG51bGw7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGEgcHJldmlvdXNseSBhZGRlZCBpdGVtXHJcbiAqIEBwYXJhbSB7P30gaXRlbVxyXG4gKiBAcmV0dXJucyB7Ym9vbH0gc3VjY2Vzc2Z1bD9cclxuICovXHJcblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHR2YXIgcmVzdWx0ID0gdGhpcy5fcXVldWUucmVtb3ZlKGl0ZW0pO1xyXG5cclxuXHR2YXIgaW5kZXggPSB0aGlzLl9yZXBlYXQuaW5kZXhPZihpdGVtKTtcclxuXHRpZiAoaW5kZXggIT0gLTEpIHsgdGhpcy5fcmVwZWF0LnNwbGljZShpbmRleCwgMSk7IH1cclxuXHJcblx0aWYgKHRoaXMuX2N1cnJlbnQgPT0gaXRlbSkgeyB0aGlzLl9jdXJyZW50ID0gbnVsbDsgfVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNjaGVkdWxlIG5leHQgaXRlbVxyXG4gKiBAcmV0dXJucyB7P31cclxuICovXHJcblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9jdXJyZW50ID0gdGhpcy5fcXVldWUuZ2V0KCk7XHJcblx0cmV0dXJuIHRoaXMuX2N1cnJlbnQ7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgU2ltcGxlIGZhaXIgc2NoZWR1bGVyIChyb3VuZC1yb2JpbiBzdHlsZSlcclxuICogQGF1Z21lbnRzIFJPVC5TY2hlZHVsZXJcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU2ltcGxlID0gZnVuY3Rpb24oKSB7XHJcblx0Uk9ULlNjaGVkdWxlci5jYWxsKHRoaXMpO1xyXG59O1xyXG5ST1QuU2NoZWR1bGVyLlNpbXBsZS5leHRlbmQoUk9ULlNjaGVkdWxlcik7XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuU2NoZWR1bGVyI2FkZFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5TaW1wbGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCkge1xyXG5cdHRoaXMuX3F1ZXVlLmFkZChpdGVtLCAwKTtcclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuYWRkLmNhbGwodGhpcywgaXRlbSwgcmVwZWF0KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjbmV4dFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5TaW1wbGUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcclxuXHRpZiAodGhpcy5fY3VycmVudCAmJiB0aGlzLl9yZXBlYXQuaW5kZXhPZih0aGlzLl9jdXJyZW50KSAhPSAtMSkge1xyXG5cdFx0dGhpcy5fcXVldWUuYWRkKHRoaXMuX2N1cnJlbnQsIDApO1xyXG5cdH1cclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFNwZWVkLWJhc2VkIHNjaGVkdWxlclxyXG4gKiBAYXVnbWVudHMgUk9ULlNjaGVkdWxlclxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5TcGVlZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFJPVC5TY2hlZHVsZXIuY2FsbCh0aGlzKTtcclxufTtcclxuUk9ULlNjaGVkdWxlci5TcGVlZC5leHRlbmQoUk9ULlNjaGVkdWxlcik7XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW0gYW55dGhpbmcgd2l0aCBcImdldFNwZWVkXCIgbWV0aG9kXHJcbiAqIEBwYXJhbSB7Ym9vbH0gcmVwZWF0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZT0xL2l0ZW0uZ2V0U3BlZWQoKV1cclxuICogQHNlZSBST1QuU2NoZWR1bGVyI2FkZFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5TcGVlZC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oaXRlbSwgcmVwZWF0LCB0aW1lKSB7XHJcblx0dGhpcy5fcXVldWUuYWRkKGl0ZW0sIHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiAxL2l0ZW0uZ2V0U3BlZWQoKSk7XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGl0ZW0sIHJlcGVhdCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuU2NoZWR1bGVyI25leHRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU3BlZWQucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcclxuXHRpZiAodGhpcy5fY3VycmVudCAmJiB0aGlzLl9yZXBlYXQuaW5kZXhPZih0aGlzLl9jdXJyZW50KSAhPSAtMSkge1xyXG5cdFx0dGhpcy5fcXVldWUuYWRkKHRoaXMuX2N1cnJlbnQsIDEvdGhpcy5fY3VycmVudC5nZXRTcGVlZCgpKTtcclxuXHR9XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBBY3Rpb24tYmFzZWQgc2NoZWR1bGVyXHJcbiAqIEBhdWdtZW50cyBST1QuU2NoZWR1bGVyXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFJPVC5TY2hlZHVsZXIuY2FsbCh0aGlzKTtcclxuXHR0aGlzLl9kZWZhdWx0RHVyYXRpb24gPSAxOyAvKiBmb3IgbmV3bHkgYWRkZWQgKi9cclxuXHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjsgLyogZm9yIHRoaXMuX2N1cnJlbnQgKi9cclxufTtcclxuUk9ULlNjaGVkdWxlci5BY3Rpb24uZXh0ZW5kKFJPVC5TY2hlZHVsZXIpO1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtXHJcbiAqIEBwYXJhbSB7Ym9vbH0gcmVwZWF0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZT0xXVxyXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjYWRkXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oaXRlbSwgcmVwZWF0LCB0aW1lKSB7XHJcblx0dGhpcy5fcXVldWUuYWRkKGl0ZW0sIHRpbWUgfHwgdGhpcy5fZGVmYXVsdER1cmF0aW9uKTtcclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuYWRkLmNhbGwodGhpcywgaXRlbSwgcmVwZWF0KTtcclxufTtcclxuXHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uO1xyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5jbGVhci5jYWxsKHRoaXMpO1xyXG59O1xyXG5cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRpZiAoaXRlbSA9PSB0aGlzLl9jdXJyZW50KSB7IHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uOyB9XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLnJlbW92ZS5jYWxsKHRoaXMsIGl0ZW0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNuZXh0XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xyXG5cdGlmICh0aGlzLl9jdXJyZW50ICYmIHRoaXMuX3JlcGVhdC5pbmRleE9mKHRoaXMuX2N1cnJlbnQpICE9IC0xKSB7XHJcblx0XHR0aGlzLl9xdWV1ZS5hZGQodGhpcy5fY3VycmVudCwgdGhpcy5fZHVyYXRpb24gfHwgdGhpcy5fZGVmYXVsdER1cmF0aW9uKTtcclxuXHRcdHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uO1xyXG5cdH1cclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkdXJhdGlvbiBmb3IgdGhlIGFjdGl2ZSBpdGVtXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUuc2V0RHVyYXRpb24gPSBmdW5jdGlvbih0aW1lKSB7XHJcblx0aWYgKHRoaXMuX2N1cnJlbnQpIHsgdGhpcy5fZHVyYXRpb24gPSB0aW1lOyB9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQXN5bmNocm9ub3VzIG1haW4gbG9vcFxyXG4gKiBAcGFyYW0ge1JPVC5TY2hlZHVsZXJ9IHNjaGVkdWxlclxyXG4gKi9cclxuUk9ULkVuZ2luZSA9IGZ1bmN0aW9uKHNjaGVkdWxlcikge1xyXG5cdHRoaXMuX3NjaGVkdWxlciA9IHNjaGVkdWxlcjtcclxuXHR0aGlzLl9sb2NrID0gMTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTdGFydCB0aGUgbWFpbiBsb29wLiBXaGVuIHRoaXMgY2FsbCByZXR1cm5zLCB0aGUgbG9vcCBpcyBsb2NrZWQuXHJcbiAqL1xyXG5ST1QuRW5naW5lLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLnVubG9jaygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEludGVycnVwdCB0aGUgZW5naW5lIGJ5IGFuIGFzeW5jaHJvbm91cyBhY3Rpb25cclxuICovXHJcblJPVC5FbmdpbmUucHJvdG90eXBlLmxvY2sgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9sb2NrKys7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVzdW1lIGV4ZWN1dGlvbiAocGF1c2VkIGJ5IGEgcHJldmlvdXMgbG9jaylcclxuICovXHJcblJPVC5FbmdpbmUucHJvdG90eXBlLnVubG9jayA9IGZ1bmN0aW9uKCkge1xyXG5cdGlmICghdGhpcy5fbG9jaykgeyB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgdW5sb2NrIHVubG9ja2VkIGVuZ2luZVwiKTsgfVxyXG5cdHRoaXMuX2xvY2stLTtcclxuXHJcblx0d2hpbGUgKCF0aGlzLl9sb2NrKSB7XHJcblx0XHR2YXIgYWN0b3IgPSB0aGlzLl9zY2hlZHVsZXIubmV4dCgpO1xyXG5cdFx0aWYgKCFhY3RvcikgeyByZXR1cm4gdGhpcy5sb2NrKCk7IH0gLyogbm8gYWN0b3JzICovXHJcblx0XHR2YXIgcmVzdWx0ID0gYWN0b3IuYWN0KCk7XHJcblx0XHRpZiAocmVzdWx0ICYmIHJlc3VsdC50aGVuKSB7IC8qIGFjdG9yIHJldHVybmVkIGEgXCJ0aGVuYWJsZVwiLCBsb29rcyBsaWtlIGEgUHJvbWlzZSAqL1xyXG5cdFx0XHR0aGlzLmxvY2soKTtcclxuXHRcdFx0cmVzdWx0LnRoZW4odGhpcy51bmxvY2suYmluZCh0aGlzKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBCYXNlIG1hcCBnZW5lcmF0b3JcclxuICogQHBhcmFtIHtpbnR9IFt3aWR0aD1ST1QuREVGQVVMVF9XSURUSF1cclxuICogQHBhcmFtIHtpbnR9IFtoZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxyXG4gKi9cclxuUk9ULk1hcCA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuXHR0aGlzLl93aWR0aCA9IHdpZHRoIHx8IFJPVC5ERUZBVUxUX1dJRFRIO1xyXG5cdHRoaXMuX2hlaWdodCA9IGhlaWdodCB8fCBST1QuREVGQVVMVF9IRUlHSFQ7XHJcbn07XHJcblxyXG5ST1QuTWFwLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge307XHJcblxyXG5ST1QuTWFwLnByb3RvdHlwZS5fZmlsbE1hcCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0dmFyIG1hcCA9IFtdO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xyXG5cdFx0bWFwLnB1c2goW10pO1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykgeyBtYXBbaV0ucHVzaCh2YWx1ZSk7IH1cclxuXHR9XHJcblx0cmV0dXJuIG1hcDtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBTaW1wbGUgZW1wdHkgcmVjdGFuZ3VsYXIgcm9vbVxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKi9cclxuUk9ULk1hcC5BcmVuYSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcbn07XHJcblJPVC5NYXAuQXJlbmEuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuUk9ULk1hcC5BcmVuYS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR2YXIgdyA9IHRoaXMuX3dpZHRoLTE7XHJcblx0dmFyIGggPSB0aGlzLl9oZWlnaHQtMTtcclxuXHRmb3IgKHZhciBpPTA7aTw9dztpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPD1oO2orKykge1xyXG5cdFx0XHR2YXIgZW1wdHkgPSAoaSAmJiBqICYmIGk8dyAmJiBqPGgpO1xyXG5cdFx0XHRjYWxsYmFjayhpLCBqLCBlbXB0eSA/IDAgOiAxKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUmVjdXJzaXZlbHkgZGl2aWRlZCBtYXplLCBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01hemVfZ2VuZXJhdGlvbl9hbGdvcml0aG0jUmVjdXJzaXZlX2RpdmlzaW9uX21ldGhvZFxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKi9cclxuUk9ULk1hcC5EaXZpZGVkTWF6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblx0dGhpcy5fc3RhY2sgPSBbXTtcclxufTtcclxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG5ST1QuTWFwLkRpdmlkZWRNYXplLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciB3ID0gdGhpcy5fd2lkdGg7XHJcblx0dmFyIGggPSB0aGlzLl9oZWlnaHQ7XHJcblx0XHJcblx0dGhpcy5fbWFwID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcclxuXHRcdHRoaXMuX21hcC5wdXNoKFtdKTtcclxuXHRcdGZvciAodmFyIGo9MDtqPGg7aisrKSB7XHJcblx0XHRcdHZhciBib3JkZXIgPSAoaSA9PSAwIHx8IGogPT0gMCB8fCBpKzEgPT0gdyB8fCBqKzEgPT0gaCk7XHJcblx0XHRcdHRoaXMuX21hcFtpXS5wdXNoKGJvcmRlciA/IDEgOiAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGhpcy5fc3RhY2sgPSBbXHJcblx0XHRbMSwgMSwgdy0yLCBoLTJdXHJcblx0XTtcclxuXHR0aGlzLl9wcm9jZXNzKCk7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPGg7aisrKSB7XHJcblx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHRoaXMuX21hcCA9IG51bGw7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpdmlkZWRNYXplLnByb3RvdHlwZS5fcHJvY2VzcyA9IGZ1bmN0aW9uKCkge1xyXG5cdHdoaWxlICh0aGlzLl9zdGFjay5sZW5ndGgpIHtcclxuXHRcdHZhciByb29tID0gdGhpcy5fc3RhY2suc2hpZnQoKTsgLyogW2xlZnQsIHRvcCwgcmlnaHQsIGJvdHRvbV0gKi9cclxuXHRcdHRoaXMuX3BhcnRpdGlvblJvb20ocm9vbSk7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5wcm90b3R5cGUuX3BhcnRpdGlvblJvb20gPSBmdW5jdGlvbihyb29tKSB7XHJcblx0dmFyIGF2YWlsWCA9IFtdO1xyXG5cdHZhciBhdmFpbFkgPSBbXTtcclxuXHRcclxuXHRmb3IgKHZhciBpPXJvb21bMF0rMTtpPHJvb21bMl07aSsrKSB7XHJcblx0XHR2YXIgdG9wID0gdGhpcy5fbWFwW2ldW3Jvb21bMV0tMV07XHJcblx0XHR2YXIgYm90dG9tID0gdGhpcy5fbWFwW2ldW3Jvb21bM10rMV07XHJcblx0XHRpZiAodG9wICYmIGJvdHRvbSAmJiAhKGkgJSAyKSkgeyBhdmFpbFgucHVzaChpKTsgfVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBqPXJvb21bMV0rMTtqPHJvb21bM107aisrKSB7XHJcblx0XHR2YXIgbGVmdCA9IHRoaXMuX21hcFtyb29tWzBdLTFdW2pdO1xyXG5cdFx0dmFyIHJpZ2h0ID0gdGhpcy5fbWFwW3Jvb21bMl0rMV1bal07XHJcblx0XHRpZiAobGVmdCAmJiByaWdodCAmJiAhKGogJSAyKSkgeyBhdmFpbFkucHVzaChqKTsgfVxyXG5cdH1cclxuXHJcblx0aWYgKCFhdmFpbFgubGVuZ3RoIHx8ICFhdmFpbFkubGVuZ3RoKSB7IHJldHVybjsgfVxyXG5cclxuXHR2YXIgeCA9IGF2YWlsWC5yYW5kb20oKTtcclxuXHR2YXIgeSA9IGF2YWlsWS5yYW5kb20oKTtcclxuXHRcclxuXHR0aGlzLl9tYXBbeF1beV0gPSAxO1xyXG5cdFxyXG5cdHZhciB3YWxscyA9IFtdO1xyXG5cdFxyXG5cdHZhciB3ID0gW107IHdhbGxzLnB1c2godyk7IC8qIGxlZnQgcGFydCAqL1xyXG5cdGZvciAodmFyIGk9cm9vbVswXTsgaTx4OyBpKyspIHsgXHJcblx0XHR0aGlzLl9tYXBbaV1beV0gPSAxO1xyXG5cdFx0dy5wdXNoKFtpLCB5XSk7IFxyXG5cdH1cclxuXHRcclxuXHR2YXIgdyA9IFtdOyB3YWxscy5wdXNoKHcpOyAvKiByaWdodCBwYXJ0ICovXHJcblx0Zm9yICh2YXIgaT14KzE7IGk8PXJvb21bMl07IGkrKykgeyBcclxuXHRcdHRoaXMuX21hcFtpXVt5XSA9IDE7XHJcblx0XHR3LnB1c2goW2ksIHldKTsgXHJcblx0fVxyXG5cclxuXHR2YXIgdyA9IFtdOyB3YWxscy5wdXNoKHcpOyAvKiB0b3AgcGFydCAqL1xyXG5cdGZvciAodmFyIGo9cm9vbVsxXTsgajx5OyBqKyspIHsgXHJcblx0XHR0aGlzLl9tYXBbeF1bal0gPSAxO1xyXG5cdFx0dy5wdXNoKFt4LCBqXSk7IFxyXG5cdH1cclxuXHRcclxuXHR2YXIgdyA9IFtdOyB3YWxscy5wdXNoKHcpOyAvKiBib3R0b20gcGFydCAqL1xyXG5cdGZvciAodmFyIGo9eSsxOyBqPD1yb29tWzNdOyBqKyspIHsgXHJcblx0XHR0aGlzLl9tYXBbeF1bal0gPSAxO1xyXG5cdFx0dy5wdXNoKFt4LCBqXSk7IFxyXG5cdH1cclxuXHRcdFxyXG5cdHZhciBzb2xpZCA9IHdhbGxzLnJhbmRvbSgpO1xyXG5cdGZvciAodmFyIGk9MDtpPHdhbGxzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciB3ID0gd2FsbHNbaV07XHJcblx0XHRpZiAodyA9PSBzb2xpZCkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHJcblx0XHR2YXIgaG9sZSA9IHcucmFuZG9tKCk7XHJcblx0XHR0aGlzLl9tYXBbaG9sZVswXV1baG9sZVsxXV0gPSAwO1xyXG5cdH1cclxuXHJcblx0dGhpcy5fc3RhY2sucHVzaChbcm9vbVswXSwgcm9vbVsxXSwgeC0xLCB5LTFdKTsgLyogbGVmdCB0b3AgKi9cclxuXHR0aGlzLl9zdGFjay5wdXNoKFt4KzEsIHJvb21bMV0sIHJvb21bMl0sIHktMV0pOyAvKiByaWdodCB0b3AgKi9cclxuXHR0aGlzLl9zdGFjay5wdXNoKFtyb29tWzBdLCB5KzEsIHgtMSwgcm9vbVszXV0pOyAvKiBsZWZ0IGJvdHRvbSAqL1xyXG5cdHRoaXMuX3N0YWNrLnB1c2goW3grMSwgeSsxLCByb29tWzJdLCByb29tWzNdXSk7IC8qIHJpZ2h0IGJvdHRvbSAqL1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEljZXkncyBNYXplIGdlbmVyYXRvclxyXG4gKiBTZWUgaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9U2ltcGxlX21hemUgZm9yIGV4cGxhbmF0aW9uXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwXHJcbiAqL1xyXG5ST1QuTWFwLkljZXlNYXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgcmVndWxhcml0eSkge1xyXG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHR0aGlzLl9yZWd1bGFyaXR5ID0gcmVndWxhcml0eSB8fCAwO1xyXG59O1xyXG5ST1QuTWFwLkljZXlNYXplLmV4dGVuZChST1QuTWFwKTtcclxuXHJcblJPVC5NYXAuSWNleU1hemUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIHdpZHRoID0gdGhpcy5fd2lkdGg7XHJcblx0dmFyIGhlaWdodCA9IHRoaXMuX2hlaWdodDtcclxuXHRcclxuXHR2YXIgbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcclxuXHRcclxuXHR3aWR0aCAtPSAod2lkdGggJSAyID8gMSA6IDIpO1xyXG5cdGhlaWdodCAtPSAoaGVpZ2h0ICUgMiA/IDEgOiAyKTtcclxuXHJcblx0dmFyIGN4ID0gMDtcclxuXHR2YXIgY3kgPSAwO1xyXG5cdHZhciBueCA9IDA7XHJcblx0dmFyIG55ID0gMDtcclxuXHJcblx0dmFyIGRvbmUgPSAwO1xyXG5cdHZhciBibG9ja2VkID0gZmFsc2U7XHJcblx0dmFyIGRpcnMgPSBbXHJcblx0XHRbMCwgMF0sXHJcblx0XHRbMCwgMF0sXHJcblx0XHRbMCwgMF0sXHJcblx0XHRbMCwgMF1cclxuXHRdO1xyXG5cdGRvIHtcclxuXHRcdGN4ID0gMSArIDIqTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSood2lkdGgtMSkgLyAyKTtcclxuXHRcdGN5ID0gMSArIDIqTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSooaGVpZ2h0LTEpIC8gMik7XHJcblxyXG5cdFx0aWYgKCFkb25lKSB7IG1hcFtjeF1bY3ldID0gMDsgfVxyXG5cdFx0XHJcblx0XHRpZiAoIW1hcFtjeF1bY3ldKSB7XHJcblx0XHRcdHRoaXMuX3JhbmRvbWl6ZShkaXJzKTtcclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdGlmIChNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKih0aGlzLl9yZWd1bGFyaXR5KzEpKSA9PSAwKSB7IHRoaXMuX3JhbmRvbWl6ZShkaXJzKTsgfVxyXG5cdFx0XHRcdGJsb2NrZWQgPSB0cnVlO1xyXG5cdFx0XHRcdGZvciAodmFyIGk9MDtpPDQ7aSsrKSB7XHJcblx0XHRcdFx0XHRueCA9IGN4ICsgZGlyc1tpXVswXSoyO1xyXG5cdFx0XHRcdFx0bnkgPSBjeSArIGRpcnNbaV1bMV0qMjtcclxuXHRcdFx0XHRcdGlmICh0aGlzLl9pc0ZyZWUobWFwLCBueCwgbnksIHdpZHRoLCBoZWlnaHQpKSB7XHJcblx0XHRcdFx0XHRcdG1hcFtueF1bbnldID0gMDtcclxuXHRcdFx0XHRcdFx0bWFwW2N4ICsgZGlyc1tpXVswXV1bY3kgKyBkaXJzW2ldWzFdXSA9IDA7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRjeCA9IG54O1xyXG5cdFx0XHRcdFx0XHRjeSA9IG55O1xyXG5cdFx0XHRcdFx0XHRibG9ja2VkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdGRvbmUrKztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IHdoaWxlICghYmxvY2tlZCk7XHJcblx0XHR9XHJcblx0fSB3aGlsZSAoZG9uZSsxIDwgd2lkdGgqaGVpZ2h0LzQpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0XHRjYWxsYmFjayhpLCBqLCBtYXBbaV1bal0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR0aGlzLl9tYXAgPSBudWxsO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5JY2V5TWF6ZS5wcm90b3R5cGUuX3JhbmRvbWl6ZSA9IGZ1bmN0aW9uKGRpcnMpIHtcclxuXHRmb3IgKHZhciBpPTA7aTw0O2krKykge1xyXG5cdFx0ZGlyc1tpXVswXSA9IDA7XHJcblx0XHRkaXJzW2ldWzFdID0gMDtcclxuXHR9XHJcblx0XHJcblx0c3dpdGNoIChNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKjQpKSB7XHJcblx0XHRjYXNlIDA6XHJcblx0XHRcdGRpcnNbMF1bMF0gPSAtMTsgZGlyc1sxXVswXSA9IDE7XHJcblx0XHRcdGRpcnNbMl1bMV0gPSAtMTsgZGlyc1szXVsxXSA9IDE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMTpcclxuXHRcdFx0ZGlyc1szXVswXSA9IC0xOyBkaXJzWzJdWzBdID0gMTtcclxuXHRcdFx0ZGlyc1sxXVsxXSA9IC0xOyBkaXJzWzBdWzFdID0gMTtcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAyOlxyXG5cdFx0XHRkaXJzWzJdWzBdID0gLTE7IGRpcnNbM11bMF0gPSAxO1xyXG5cdFx0XHRkaXJzWzBdWzFdID0gLTE7IGRpcnNbMV1bMV0gPSAxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDM6XHJcblx0XHRcdGRpcnNbMV1bMF0gPSAtMTsgZGlyc1swXVswXSA9IDE7XHJcblx0XHRcdGRpcnNbM11bMV0gPSAtMTsgZGlyc1syXVsxXSA9IDE7XHJcblx0XHRicmVhaztcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkljZXlNYXplLnByb3RvdHlwZS5faXNGcmVlID0gZnVuY3Rpb24obWFwLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcblx0aWYgKHggPCAxIHx8IHkgPCAxIHx8IHggPj0gd2lkdGggfHwgeSA+PSBoZWlnaHQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0cmV0dXJuIG1hcFt4XVt5XTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBNYXplIGdlbmVyYXRvciAtIEVsbGVyJ3MgYWxnb3JpdGhtXHJcbiAqIFNlZSBodHRwOi8vaG9tZXBhZ2VzLmN3aS5ubC9+dHJvbXAvbWF6ZS5odG1sIGZvciBleHBsYW5hdGlvblxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKi9cclxuUk9ULk1hcC5FbGxlck1hemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG59O1xyXG5ST1QuTWFwLkVsbGVyTWF6ZS5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG5ST1QuTWFwLkVsbGVyTWF6ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR2YXIgbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcclxuXHR2YXIgdyA9IE1hdGguY2VpbCgodGhpcy5fd2lkdGgtMikvMik7XHJcblx0XHJcblx0dmFyIHJhbmQgPSA5LzI0O1xyXG5cdFxyXG5cdHZhciBMID0gW107XHJcblx0dmFyIFIgPSBbXTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xyXG5cdFx0TC5wdXNoKGkpO1xyXG5cdFx0Ui5wdXNoKGkpO1xyXG5cdH1cclxuXHRMLnB1c2gody0xKTsgLyogZmFrZSBzdG9wLWJsb2NrIGF0IHRoZSByaWdodCBzaWRlICovXHJcblxyXG5cdGZvciAodmFyIGo9MTtqKzM8dGhpcy5faGVpZ2h0O2orPTIpIHtcclxuXHRcdC8qIG9uZSByb3cgKi9cclxuXHRcdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XHJcblx0XHRcdC8qIGNlbGwgY29vcmRzICh3aWxsIGJlIGFsd2F5cyBlbXB0eSkgKi9cclxuXHRcdFx0dmFyIHggPSAyKmkrMTtcclxuXHRcdFx0dmFyIHkgPSBqO1xyXG5cdFx0XHRtYXBbeF1beV0gPSAwO1xyXG5cdFx0XHRcclxuXHRcdFx0LyogcmlnaHQgY29ubmVjdGlvbiAqL1xyXG5cdFx0XHRpZiAoaSAhPSBMW2krMV0gJiYgUk9ULlJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSB7XHJcblx0XHRcdFx0dGhpcy5fYWRkVG9MaXN0KGksIEwsIFIpO1xyXG5cdFx0XHRcdG1hcFt4KzFdW3ldID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0LyogYm90dG9tIGNvbm5lY3Rpb24gKi9cclxuXHRcdFx0aWYgKGkgIT0gTFtpXSAmJiBST1QuUk5HLmdldFVuaWZvcm0oKSA+IHJhbmQpIHtcclxuXHRcdFx0XHQvKiByZW1vdmUgY29ubmVjdGlvbiAqL1xyXG5cdFx0XHRcdHRoaXMuX3JlbW92ZUZyb21MaXN0KGksIEwsIFIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8qIGNyZWF0ZSBjb25uZWN0aW9uICovXHJcblx0XHRcdFx0bWFwW3hdW3krMV0gPSAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKiBsYXN0IHJvdyAqL1xyXG5cdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XHJcblx0XHQvKiBjZWxsIGNvb3JkcyAod2lsbCBiZSBhbHdheXMgZW1wdHkpICovXHJcblx0XHR2YXIgeCA9IDIqaSsxO1xyXG5cdFx0dmFyIHkgPSBqO1xyXG5cdFx0bWFwW3hdW3ldID0gMDtcclxuXHRcdFxyXG5cdFx0LyogcmlnaHQgY29ubmVjdGlvbiAqL1xyXG5cdFx0aWYgKGkgIT0gTFtpKzFdICYmIChpID09IExbaV0gfHwgUk9ULlJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSkge1xyXG5cdFx0XHQvKiBkaWcgcmlnaHQgYWxzbyBpZiB0aGUgY2VsbCBpcyBzZXBhcmF0ZWQsIHNvIGl0IGdldHMgY29ubmVjdGVkIHRvIHRoZSByZXN0IG9mIG1hemUgKi9cclxuXHRcdFx0dGhpcy5fYWRkVG9MaXN0KGksIEwsIFIpO1xyXG5cdFx0XHRtYXBbeCsxXVt5XSA9IDA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuX3JlbW92ZUZyb21MaXN0KGksIEwsIFIpO1xyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdFx0Y2FsbGJhY2soaSwgaiwgbWFwW2ldW2pdKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIFwiaVwiIGZyb20gaXRzIGxpc3RcclxuICovXHJcblJPVC5NYXAuRWxsZXJNYXplLnByb3RvdHlwZS5fcmVtb3ZlRnJvbUxpc3QgPSBmdW5jdGlvbihpLCBMLCBSKSB7XHJcblx0UltMW2ldXSA9IFJbaV07XHJcblx0TFtSW2ldXSA9IExbaV07XHJcblx0UltpXSA9IGk7XHJcblx0TFtpXSA9IGk7XHJcbn07XHJcblxyXG4vKipcclxuICogSm9pbiBsaXN0cyB3aXRoIFwiaVwiIGFuZCBcImkrMVwiXHJcbiAqL1xyXG5ST1QuTWFwLkVsbGVyTWF6ZS5wcm90b3R5cGUuX2FkZFRvTGlzdCA9IGZ1bmN0aW9uKGksIEwsIFIpIHtcclxuXHRSW0xbaSsxXV0gPSBSW2ldO1xyXG5cdExbUltpXV0gPSBMW2krMV07XHJcblx0UltpXSA9IGkrMTtcclxuXHRMW2krMV0gPSBpO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIENlbGx1bGFyIGF1dG9tYXRvbiBtYXAgZ2VuZXJhdG9yXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwXHJcbiAqIEBwYXJhbSB7aW50fSBbd2lkdGg9Uk9ULkRFRkFVTFRfV0lEVEhdXHJcbiAqIEBwYXJhbSB7aW50fSBbaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBPcHRpb25zXHJcbiAqIEBwYXJhbSB7aW50W119IFtvcHRpb25zLmJvcm5dIExpc3Qgb2YgbmVpZ2hib3IgY291bnRzIGZvciBhIG5ldyBjZWxsIHRvIGJlIGJvcm4gaW4gZW1wdHkgc3BhY2VcclxuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuc3Vydml2ZV0gTGlzdCBvZiBuZWlnaGJvciBjb3VudHMgZm9yIGFuIGV4aXN0aW5nICBjZWxsIHRvIHN1cnZpdmVcclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5XSBUb3BvbG9neSA0IG9yIDYgb3IgOFxyXG4gKi9cclxuUk9ULk1hcC5DZWxsdWxhciA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdGJvcm46IFs1LCA2LCA3LCA4XSxcclxuXHRcdHN1cnZpdmU6IFs0LCA1LCA2LCA3LCA4XSxcclxuXHRcdHRvcG9sb2d5OiA4XHJcblx0fTtcclxuXHR0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcblxyXG5cdHRoaXMuX2RpcnMgPSBST1QuRElSU1t0aGlzLl9vcHRpb25zLnRvcG9sb2d5XTtcclxuXHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDApO1xyXG59O1xyXG5ST1QuTWFwLkNlbGx1bGFyLmV4dGVuZChST1QuTWFwKTtcclxuXHJcbi8qKlxyXG4gKiBGaWxsIHRoZSBtYXAgd2l0aCByYW5kb20gdmFsdWVzXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IHByb2JhYmlsaXR5IFByb2JhYmlsaXR5IGZvciBhIGNlbGwgdG8gYmVjb21lIGFsaXZlOyAwID0gYWxsIGVtcHR5LCAxID0gYWxsIGZ1bGxcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLnJhbmRvbWl6ZSA9IGZ1bmN0aW9uKHByb2JhYmlsaXR5KSB7XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHRcdHRoaXMuX21hcFtpXVtqXSA9IChST1QuUk5HLmdldFVuaWZvcm0oKSA8IHByb2JhYmlsaXR5ID8gMSA6IDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGFuZ2Ugb3B0aW9ucy5cclxuICogQHNlZSBST1QuTWFwLkNlbGx1bGFyXHJcbiAqL1xyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgdmFsdWUpIHtcclxuXHR0aGlzLl9tYXBbeF1beV0gPSB2YWx1ZTtcclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIG5ld01hcCA9IHRoaXMuX2ZpbGxNYXAoMCk7XHJcblx0dmFyIGJvcm4gPSB0aGlzLl9vcHRpb25zLmJvcm47XHJcblx0dmFyIHN1cnZpdmUgPSB0aGlzLl9vcHRpb25zLnN1cnZpdmU7XHJcblxyXG5cclxuXHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHR2YXIgd2lkdGhTdGVwID0gMTtcclxuXHRcdHZhciB3aWR0aFN0YXJ0ID0gMDtcclxuXHRcdGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDYpIHtcclxuXHRcdFx0d2lkdGhTdGVwID0gMjtcclxuXHRcdFx0d2lkdGhTdGFydCA9IGolMjtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciBpPXdpZHRoU3RhcnQ7IGk8dGhpcy5fd2lkdGg7IGkrPXdpZHRoU3RlcCkge1xyXG5cclxuXHRcdFx0dmFyIGN1ciA9IHRoaXMuX21hcFtpXVtqXTtcclxuXHRcdFx0dmFyIG5jb3VudCA9IHRoaXMuX2dldE5laWdoYm9ycyhpLCBqKTtcclxuXHJcblx0XHRcdGlmIChjdXIgJiYgc3Vydml2ZS5pbmRleE9mKG5jb3VudCkgIT0gLTEpIHsgLyogc3Vydml2ZSAqL1xyXG5cdFx0XHRcdG5ld01hcFtpXVtqXSA9IDE7XHJcblx0XHRcdH0gZWxzZSBpZiAoIWN1ciAmJiBib3JuLmluZGV4T2YobmNvdW50KSAhPSAtMSkgeyAvKiBib3JuICovXHJcblx0XHRcdFx0bmV3TWFwW2ldW2pdID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGhpcy5fbWFwID0gbmV3TWFwO1xyXG5cclxuXHR0aGlzLnNlcnZpY2VDYWxsYmFjayhjYWxsYmFjayk7XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5zZXJ2aWNlQ2FsbGJhY2sgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdGlmICghY2FsbGJhY2spIHsgcmV0dXJuOyB9XHJcblxyXG5cdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdHZhciB3aWR0aFN0ZXAgPSAxO1xyXG5cdFx0dmFyIHdpZHRoU3RhcnQgPSAwO1xyXG5cdFx0aWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gNikge1xyXG5cdFx0XHR3aWR0aFN0ZXAgPSAyO1xyXG5cdFx0XHR3aWR0aFN0YXJ0ID0gaiUyO1xyXG5cdFx0fVxyXG5cdFx0Zm9yICh2YXIgaT13aWR0aFN0YXJ0OyBpPHRoaXMuX3dpZHRoOyBpKz13aWR0aFN0ZXApIHtcclxuXHRcdFx0Y2FsbGJhY2soaSwgaiwgdGhpcy5fbWFwW2ldW2pdKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IG5laWdoYm9yIGNvdW50IGF0IFtpLGpdIGluIHRoaXMuX21hcFxyXG4gKi9cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX2dldE5laWdoYm9ycyA9IGZ1bmN0aW9uKGN4LCBjeSkge1xyXG5cdHZhciByZXN1bHQgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX2RpcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGRpciA9IHRoaXMuX2RpcnNbaV07XHJcblx0XHR2YXIgeCA9IGN4ICsgZGlyWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIGRpclsxXTtcclxuXHJcblx0XHRpZiAoeCA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5IDwgMCB8fCB5ID49IHRoaXMuX3dpZHRoKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRyZXN1bHQgKz0gKHRoaXMuX21hcFt4XVt5XSA9PSAxID8gMSA6IDApO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNYWtlIHN1cmUgZXZlcnkgbm9uLXdhbGwgc3BhY2UgaXMgYWNjZXNzaWJsZS5cclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdG8gY2FsbCB0byBkaXNwbGF5IG1hcCB3aGVuIGRvXHJcbiAqIEBwYXJhbSB7aW50fSB2YWx1ZSB0byBjb25zaWRlciBlbXB0eSBzcGFjZSAtIGRlZmF1bHRzIHRvIDBcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdG8gY2FsbCB3aGVuIGEgbmV3IGNvbm5lY3Rpb24gaXMgbWFkZVxyXG4gKi9cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB2YWx1ZSwgY29ubmVjdGlvbkNhbGxiYWNrKSB7XHJcblx0aWYgKCF2YWx1ZSkgdmFsdWUgPSAwO1xyXG5cclxuXHR2YXIgYWxsRnJlZVNwYWNlID0gW107XHJcblx0dmFyIG5vdENvbm5lY3RlZCA9IHt9O1xyXG5cdC8vIGZpbmQgYWxsIGZyZWUgc3BhY2VcclxuXHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuX3dpZHRoOyB4KyspIHtcclxuXHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5faGVpZ2h0OyB5KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuX2ZyZWVTcGFjZSh4LCB5LCB2YWx1ZSkpIHtcclxuXHRcdFx0XHR2YXIgcCA9IFt4LCB5XTtcclxuXHRcdFx0XHRub3RDb25uZWN0ZWRbdGhpcy5fcG9pbnRLZXkocCldID0gcDtcclxuXHRcdFx0XHRhbGxGcmVlU3BhY2UucHVzaChbeCwgeV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdHZhciBzdGFydCA9IGFsbEZyZWVTcGFjZVtST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgYWxsRnJlZVNwYWNlLmxlbmd0aCAtIDEpXTtcclxuXHJcblx0dmFyIGtleSA9IHRoaXMuX3BvaW50S2V5KHN0YXJ0KTtcclxuXHR2YXIgY29ubmVjdGVkID0ge307XHJcblx0Y29ubmVjdGVkW2tleV0gPSBzdGFydDtcclxuXHRkZWxldGUgbm90Q29ubmVjdGVkW2tleV07XHJcblxyXG5cdC8vIGZpbmQgd2hhdCdzIGNvbm5lY3RlZCB0byB0aGUgc3RhcnRpbmcgcG9pbnRcclxuXHR0aGlzLl9maW5kQ29ubmVjdGVkKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCBbc3RhcnRdLCBmYWxzZSwgdmFsdWUpO1xyXG5cclxuXHR3aGlsZSAoT2JqZWN0LmtleXMobm90Q29ubmVjdGVkKS5sZW5ndGggPiAwKSB7XHJcblxyXG5cdFx0Ly8gZmluZCB0d28gcG9pbnRzIGZyb20gbm90Q29ubmVjdGVkIHRvIGNvbm5lY3RlZFxyXG5cdFx0dmFyIHAgPSB0aGlzLl9nZXRGcm9tVG8oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQpO1xyXG5cdFx0dmFyIGZyb20gPSBwWzBdOyAvLyBub3RDb25uZWN0ZWRcclxuXHRcdHZhciB0byA9IHBbMV07IC8vIGNvbm5lY3RlZFxyXG5cclxuXHRcdC8vIGZpbmQgZXZlcnl0aGluZyBjb25uZWN0ZWQgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XHJcblx0XHR2YXIgbG9jYWwgPSB7fTtcclxuXHRcdGxvY2FsW3RoaXMuX3BvaW50S2V5KGZyb20pXSA9IGZyb207XHJcblx0XHR0aGlzLl9maW5kQ29ubmVjdGVkKGxvY2FsLCBub3RDb25uZWN0ZWQsIFtmcm9tXSwgdHJ1ZSwgdmFsdWUpO1xyXG5cclxuXHRcdC8vIGNvbm5lY3QgdG8gYSBjb25uZWN0ZWQgc3F1YXJlXHJcblx0XHR0aGlzLl90dW5uZWxUb0Nvbm5lY3RlZCh0bywgZnJvbSwgY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHZhbHVlLCBjb25uZWN0aW9uQ2FsbGJhY2spO1xyXG5cclxuXHRcdC8vIG5vdyBhbGwgb2YgbG9jYWwgaXMgY29ubmVjdGVkXHJcblx0XHRmb3IgKHZhciBrIGluIGxvY2FsKSB7XHJcblx0XHRcdHZhciBwcCA9IGxvY2FsW2tdO1xyXG5cdFx0XHR0aGlzLl9tYXBbcHBbMF1dW3BwWzFdXSA9IHZhbHVlO1xyXG5cdFx0XHRjb25uZWN0ZWRba10gPSBwcDtcclxuXHRcdFx0ZGVsZXRlIG5vdENvbm5lY3RlZFtrXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuc2VydmljZUNhbGxiYWNrKGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGaW5kIHJhbmRvbSBwb2ludHMgdG8gY29ubmVjdC4gU2VhcmNoIGZvciB0aGUgY2xvc2VzdCBwb2ludCBpbiB0aGUgbGFyZ2VyIHNwYWNlLlxyXG4gKiBUaGlzIGlzIHRvIG1pbmltaXplIHRoZSBsZW5ndGggb2YgdGhlIHBhc3NhZ2Ugd2hpbGUgbWFpbnRhaW5pbmcgZ29vZCBwZXJmb3JtYW5jZS5cclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9nZXRGcm9tVG8gPSBmdW5jdGlvbihjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCkge1xyXG5cdHZhciBmcm9tLCB0bywgZDtcclxuXHR2YXIgY29ubmVjdGVkS2V5cyA9IE9iamVjdC5rZXlzKGNvbm5lY3RlZCk7XHJcblx0dmFyIG5vdENvbm5lY3RlZEtleXMgPSBPYmplY3Qua2V5cyhub3RDb25uZWN0ZWQpO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XHJcblx0XHRpZiAoY29ubmVjdGVkS2V5cy5sZW5ndGggPCBub3RDb25uZWN0ZWRLZXlzLmxlbmd0aCkge1xyXG5cdFx0XHR2YXIga2V5cyA9IGNvbm5lY3RlZEtleXM7XHJcblx0XHRcdHRvID0gY29ubmVjdGVkW2tleXNbUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGtleXMubGVuZ3RoIC0gMSldXTtcclxuXHRcdFx0ZnJvbSA9IHRoaXMuX2dldENsb3Nlc3QodG8sIG5vdENvbm5lY3RlZCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIga2V5cyA9IG5vdENvbm5lY3RlZEtleXM7XHJcblx0XHRcdGZyb20gPSBub3RDb25uZWN0ZWRba2V5c1tST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwga2V5cy5sZW5ndGggLSAxKV1dO1xyXG5cdFx0XHR0byA9IHRoaXMuX2dldENsb3Nlc3QoZnJvbSwgY29ubmVjdGVkKTtcclxuXHRcdH1cclxuXHRcdGQgPSAoZnJvbVswXSAtIHRvWzBdKSAqIChmcm9tWzBdIC0gdG9bMF0pICsgKGZyb21bMV0gLSB0b1sxXSkgKiAoZnJvbVsxXSAtIHRvWzFdKTtcclxuXHRcdGlmIChkIDwgNjQpIHtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIGNvbnNvbGUubG9nKFwiPj4+IGNvbm5lY3RlZD1cIiArIHRvICsgXCIgbm90Q29ubmVjdGVkPVwiICsgZnJvbSArIFwiIGRpc3Q9XCIgKyBkKTtcclxuXHRyZXR1cm4gW2Zyb20sIHRvXTtcclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9nZXRDbG9zZXN0ID0gZnVuY3Rpb24ocG9pbnQsIHNwYWNlKSB7XHJcblx0dmFyIG1pblBvaW50ID0gbnVsbDtcclxuXHR2YXIgbWluRGlzdCA9IG51bGw7XHJcblx0Zm9yIChrIGluIHNwYWNlKSB7XHJcblx0XHR2YXIgcCA9IHNwYWNlW2tdO1xyXG5cdFx0dmFyIGQgPSAocFswXSAtIHBvaW50WzBdKSAqIChwWzBdIC0gcG9pbnRbMF0pICsgKHBbMV0gLSBwb2ludFsxXSkgKiAocFsxXSAtIHBvaW50WzFdKTtcclxuXHRcdGlmIChtaW5EaXN0ID09IG51bGwgfHwgZCA8IG1pbkRpc3QpIHtcclxuXHRcdFx0bWluRGlzdCA9IGQ7XHJcblx0XHRcdG1pblBvaW50ID0gcDtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIG1pblBvaW50O1xyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX2ZpbmRDb25uZWN0ZWQgPSBmdW5jdGlvbihjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCwgc3RhY2ssIGtlZXBOb3RDb25uZWN0ZWQsIHZhbHVlKSB7XHJcblx0d2hpbGUoc3RhY2subGVuZ3RoID4gMCkge1xyXG5cdFx0dmFyIHAgPSBzdGFjay5zcGxpY2UoMCwgMSlbMF07XHJcblx0XHR2YXIgdGVzdHMgPSBbXHJcblx0XHRcdFtwWzBdICsgMSwgcFsxXV0sXHJcblx0XHRcdFtwWzBdIC0gMSwgcFsxXV0sXHJcblx0XHRcdFtwWzBdLCAgICAgcFsxXSArIDFdLFxyXG5cdFx0XHRbcFswXSwgICAgIHBbMV0gLSAxXVxyXG5cdFx0XTtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGVzdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGtleSA9IHRoaXMuX3BvaW50S2V5KHRlc3RzW2ldKTtcclxuXHRcdFx0aWYgKGNvbm5lY3RlZFtrZXldID09IG51bGwgJiYgdGhpcy5fZnJlZVNwYWNlKHRlc3RzW2ldWzBdLCB0ZXN0c1tpXVsxXSwgdmFsdWUpKSB7XHJcblx0XHRcdFx0Y29ubmVjdGVkW2tleV0gPSB0ZXN0c1tpXTtcclxuXHRcdFx0XHRpZiAoIWtlZXBOb3RDb25uZWN0ZWQpIHtcclxuXHRcdFx0XHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRba2V5XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c3RhY2sucHVzaCh0ZXN0c1tpXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fdHVubmVsVG9Db25uZWN0ZWQgPSBmdW5jdGlvbih0bywgZnJvbSwgY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHZhbHVlLCBjb25uZWN0aW9uQ2FsbGJhY2spIHtcclxuXHR2YXIga2V5ID0gdGhpcy5fcG9pbnRLZXkoZnJvbSk7XHJcblx0dmFyIGEsIGI7XHJcblx0aWYgKGZyb21bMF0gPCB0b1swXSkge1xyXG5cdFx0YSA9IGZyb207XHJcblx0XHRiID0gdG87XHJcblx0fSBlbHNlIHtcclxuXHRcdGEgPSB0bztcclxuXHRcdGIgPSBmcm9tO1xyXG5cdH1cclxuXHRmb3IgKHZhciB4eCA9IGFbMF07IHh4IDw9IGJbMF07IHh4KyspIHtcclxuXHRcdHRoaXMuX21hcFt4eF1bYVsxXV0gPSB2YWx1ZTtcclxuXHRcdHZhciBwID0gW3h4LCBhWzFdXTtcclxuXHRcdHZhciBwa2V5ID0gdGhpcy5fcG9pbnRLZXkocCk7XHJcblx0XHRjb25uZWN0ZWRbcGtleV0gPSBwO1xyXG5cdFx0ZGVsZXRlIG5vdENvbm5lY3RlZFtwa2V5XTtcclxuXHR9XHJcblx0aWYgKGNvbm5lY3Rpb25DYWxsYmFjayAmJiBhWzBdIDwgYlswXSkge1xyXG5cdFx0Y29ubmVjdGlvbkNhbGxiYWNrKGEsIFtiWzBdLCBhWzFdXSk7XHJcblx0fVxyXG5cclxuXHQvLyB4IGlzIG5vdyBmaXhlZFxyXG5cdHZhciB4ID0gYlswXTtcclxuXHJcblx0aWYgKGZyb21bMV0gPCB0b1sxXSkge1xyXG5cdFx0YSA9IGZyb207XHJcblx0XHRiID0gdG87XHJcblx0fSBlbHNlIHtcclxuXHRcdGEgPSB0bztcclxuXHRcdGIgPSBmcm9tO1xyXG5cdH1cclxuXHRmb3IgKHZhciB5eSA9IGFbMV07IHl5IDwgYlsxXTsgeXkrKykge1xyXG5cdFx0dGhpcy5fbWFwW3hdW3l5XSA9IHZhbHVlO1xyXG5cdFx0dmFyIHAgPSBbeCwgeXldO1xyXG5cdFx0dmFyIHBrZXkgPSB0aGlzLl9wb2ludEtleShwKTtcclxuXHRcdGNvbm5lY3RlZFtwa2V5XSA9IHA7XHJcblx0XHRkZWxldGUgbm90Q29ubmVjdGVkW3BrZXldO1xyXG5cdH1cclxuXHRpZiAoY29ubmVjdGlvbkNhbGxiYWNrICYmIGFbMV0gPCBiWzFdKSB7XHJcblx0XHRjb25uZWN0aW9uQ2FsbGJhY2soW2JbMF0sIGFbMV1dLCBbYlswXSwgYlsxXV0pO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9mcmVlU3BhY2UgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xyXG5cdHJldHVybiB4ID49IDAgJiYgeCA8IHRoaXMuX3dpZHRoICYmIHkgPj0gMCAmJiB5IDwgdGhpcy5faGVpZ2h0ICYmIHRoaXMuX21hcFt4XVt5XSA9PSB2YWx1ZTtcclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9wb2ludEtleSA9IGZ1bmN0aW9uKHApIHtcclxuXHRyZXR1cm4gcFswXSArIFwiLlwiICsgcFsxXTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBEdW5nZW9uIG1hcDogaGFzIHJvb21zIGFuZCBjb3JyaWRvcnNcclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuRHVuZ2VvbiA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblx0dGhpcy5fcm9vbXMgPSBbXTsgLyogbGlzdCBvZiBhbGwgcm9vbXMgKi9cclxuXHR0aGlzLl9jb3JyaWRvcnMgPSBbXTtcclxufTtcclxuUk9ULk1hcC5EdW5nZW9uLmV4dGVuZChST1QuTWFwKTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgYWxsIGdlbmVyYXRlZCByb29tc1xyXG4gKiBAcmV0dXJucyB7Uk9ULk1hcC5GZWF0dXJlLlJvb21bXX1cclxuICovXHJcblJPVC5NYXAuRHVuZ2Vvbi5wcm90b3R5cGUuZ2V0Um9vbXMgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fcm9vbXM7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGFsbCBnZW5lcmF0ZWQgY29ycmlkb3JzXHJcbiAqIEByZXR1cm5zIHtST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3JbXX1cclxuICovXHJcblJPVC5NYXAuRHVuZ2Vvbi5wcm90b3R5cGUuZ2V0Q29ycmlkb3JzID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX2NvcnJpZG9ycztcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBSYW5kb20gZHVuZ2VvbiBnZW5lcmF0b3IgdXNpbmcgaHVtYW4tbGlrZSBkaWdnaW5nIHBhdHRlcm5zLlxyXG4gKiBIZWF2aWx5IGJhc2VkIG9uIE1pa2UgQW5kZXJzb24ncyBpZGVhcyBmcm9tIHRoZSBcIlR5cmFudFwiIGFsZ28sIG1lbnRpb25lZCBhdCBcclxuICogaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9RHVuZ2Vvbi1CdWlsZGluZ19BbGdvcml0aG0uXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwLkR1bmdlb25cclxuICovXHJcblJPVC5NYXAuRGlnZ2VyID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xyXG5cdFJPVC5NYXAuRHVuZ2Vvbi5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdFxyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRyb29tV2lkdGg6IFszLCA5XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIHdpZHRoICovXHJcblx0XHRyb29tSGVpZ2h0OiBbMywgNV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSBoZWlnaHQgKi9cclxuXHRcdGNvcnJpZG9yTGVuZ3RoOiBbMywgMTBdLCAvKiBjb3JyaWRvciBtaW5pbXVtIGFuZCBtYXhpbXVtIGxlbmd0aCAqL1xyXG5cdFx0ZHVnUGVyY2VudGFnZTogMC4yLCAvKiB3ZSBzdG9wIGFmdGVyIHRoaXMgcGVyY2VudGFnZSBvZiBsZXZlbCBhcmVhIGhhcyBiZWVuIGR1ZyBvdXQgKi9cclxuXHRcdHRpbWVMaW1pdDogMTAwMCAvKiB3ZSBzdG9wIGFmdGVyIHRoaXMgbXVjaCB0aW1lIGhhcyBwYXNzZWQgKG1zZWMpICovXHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHRcclxuXHR0aGlzLl9mZWF0dXJlcyA9IHtcclxuXHRcdFwiUm9vbVwiOiA0LFxyXG5cdFx0XCJDb3JyaWRvclwiOiA0XHJcblx0fTtcclxuXHR0aGlzLl9mZWF0dXJlQXR0ZW1wdHMgPSAyMDsgLyogaG93IG1hbnkgdGltZXMgZG8gd2UgdHJ5IHRvIGNyZWF0ZSBhIGZlYXR1cmUgb24gYSBzdWl0YWJsZSB3YWxsICovXHJcblx0dGhpcy5fd2FsbHMgPSB7fTsgLyogdGhlc2UgYXJlIGF2YWlsYWJsZSBmb3IgZGlnZ2luZyAqL1xyXG5cdFxyXG5cdHRoaXMuX2RpZ0NhbGxiYWNrID0gdGhpcy5fZGlnQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHR0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrID0gdGhpcy5fY2FuQmVEdWdDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG5cdHRoaXMuX2lzV2FsbENhbGxiYWNrID0gdGhpcy5faXNXYWxsQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHR0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjayA9IHRoaXMuX3ByaW9yaXR5V2FsbENhbGxiYWNrLmJpbmQodGhpcyk7XHJcbn07XHJcblJPVC5NYXAuRGlnZ2VyLmV4dGVuZChST1QuTWFwLkR1bmdlb24pO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIG1hcFxyXG4gKiBAc2VlIFJPVC5NYXAjY3JlYXRlXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR0aGlzLl9yb29tcyA9IFtdO1xyXG5cdHRoaXMuX2NvcnJpZG9ycyA9IFtdO1xyXG5cdHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0dGhpcy5fd2FsbHMgPSB7fTtcclxuXHR0aGlzLl9kdWcgPSAwO1xyXG5cdHZhciBhcmVhID0gKHRoaXMuX3dpZHRoLTIpICogKHRoaXMuX2hlaWdodC0yKTtcclxuXHJcblx0dGhpcy5fZmlyc3RSb29tKCk7XHJcblx0XHJcblx0dmFyIHQxID0gRGF0ZS5ub3coKTtcclxuXHJcblx0ZG8ge1xyXG5cdFx0dmFyIHQyID0gRGF0ZS5ub3coKTtcclxuXHRcdGlmICh0MiAtIHQxID4gdGhpcy5fb3B0aW9ucy50aW1lTGltaXQpIHsgYnJlYWs7IH1cclxuXHJcblx0XHQvKiBmaW5kIGEgZ29vZCB3YWxsICovXHJcblx0XHR2YXIgd2FsbCA9IHRoaXMuX2ZpbmRXYWxsKCk7XHJcblx0XHRpZiAoIXdhbGwpIHsgYnJlYWs7IH0gLyogbm8gbW9yZSB3YWxscyAqL1xyXG5cdFx0XHJcblx0XHR2YXIgcGFydHMgPSB3YWxsLnNwbGl0KFwiLFwiKTtcclxuXHRcdHZhciB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xyXG5cdFx0dmFyIHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XHJcblx0XHR2YXIgZGlyID0gdGhpcy5fZ2V0RGlnZ2luZ0RpcmVjdGlvbih4LCB5KTtcclxuXHRcdGlmICghZGlyKSB7IGNvbnRpbnVlOyB9IC8qIHRoaXMgd2FsbCBpcyBub3Qgc3VpdGFibGUgKi9cclxuXHRcdFxyXG4vL1x0XHRjb25zb2xlLmxvZyhcIndhbGxcIiwgeCwgeSk7XHJcblxyXG5cdFx0LyogdHJ5IGFkZGluZyBhIGZlYXR1cmUgKi9cclxuXHRcdHZhciBmZWF0dXJlQXR0ZW1wdHMgPSAwO1xyXG5cdFx0ZG8ge1xyXG5cdFx0XHRmZWF0dXJlQXR0ZW1wdHMrKztcclxuXHRcdFx0aWYgKHRoaXMuX3RyeUZlYXR1cmUoeCwgeSwgZGlyWzBdLCBkaXJbMV0pKSB7IC8qIGZlYXR1cmUgYWRkZWQgKi9cclxuXHRcdFx0XHQvL2lmICh0aGlzLl9yb29tcy5sZW5ndGggKyB0aGlzLl9jb3JyaWRvcnMubGVuZ3RoID09IDIpIHsgdGhpcy5fcm9vbXNbMF0uYWRkRG9vcih4LCB5KTsgfSAvKiBmaXJzdCByb29tIG9maWNpYWxseSBoYXMgZG9vcnMgKi9cclxuXHRcdFx0XHR0aGlzLl9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzKHgsIHkpO1xyXG5cdFx0XHRcdHRoaXMuX3JlbW92ZVN1cnJvdW5kaW5nV2FsbHMoeC1kaXJbMF0sIHktZGlyWzFdKTtcclxuXHRcdFx0XHRicmVhazsgXHJcblx0XHRcdH1cclxuXHRcdH0gd2hpbGUgKGZlYXR1cmVBdHRlbXB0cyA8IHRoaXMuX2ZlYXR1cmVBdHRlbXB0cyk7XHJcblx0XHRcclxuXHRcdHZhciBwcmlvcml0eVdhbGxzID0gMDtcclxuXHRcdGZvciAodmFyIGlkIGluIHRoaXMuX3dhbGxzKSB7IFxyXG5cdFx0XHRpZiAodGhpcy5fd2FsbHNbaWRdID4gMSkgeyBwcmlvcml0eVdhbGxzKys7IH1cclxuXHRcdH1cclxuXHJcblx0fSB3aGlsZSAodGhpcy5fZHVnL2FyZWEgPCB0aGlzLl9vcHRpb25zLmR1Z1BlcmNlbnRhZ2UgfHwgcHJpb3JpdHlXYWxscyk7IC8qIGZpeG1lIG51bWJlciBvZiBwcmlvcml0eSB3YWxscyAqL1xyXG5cclxuXHR0aGlzLl9hZGREb29ycygpO1xyXG5cclxuXHRpZiAoY2FsbGJhY2spIHtcclxuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xyXG5cdFx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soaSwgaiwgdGhpcy5fbWFwW2ldW2pdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR0aGlzLl93YWxscyA9IHt9O1xyXG5cdHRoaXMuX21hcCA9IG51bGw7XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9kaWdDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHksIHZhbHVlKSB7XHJcblx0aWYgKHZhbHVlID09IDAgfHwgdmFsdWUgPT0gMikgeyAvKiBlbXB0eSAqL1xyXG5cdFx0dGhpcy5fbWFwW3hdW3ldID0gMDtcclxuXHRcdHRoaXMuX2R1ZysrO1xyXG5cdH0gZWxzZSB7IC8qIHdhbGwgKi9cclxuXHRcdHRoaXMuX3dhbGxzW3grXCIsXCIreV0gPSAxO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5faXNXYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0aWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPj0gdGhpcy5fd2lkdGggfHwgeSA+PSB0aGlzLl9oZWlnaHQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0cmV0dXJuICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2NhbkJlRHVnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0aWYgKHggPCAxIHx8IHkgPCAxIHx8IHgrMSA+PSB0aGlzLl93aWR0aCB8fCB5KzEgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9wcmlvcml0eVdhbGxDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHR0aGlzLl93YWxsc1t4K1wiLFwiK3ldID0gMjtcclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fZmlyc3RSb29tID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGN4ID0gTWF0aC5mbG9vcih0aGlzLl93aWR0aC8yKTtcclxuXHR2YXIgY3kgPSBNYXRoLmZsb29yKHRoaXMuX2hlaWdodC8yKTtcclxuXHR2YXIgcm9vbSA9IFJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbUNlbnRlcihjeCwgY3ksIHRoaXMuX29wdGlvbnMpO1xyXG5cdHRoaXMuX3Jvb21zLnB1c2gocm9vbSk7XHJcblx0cm9vbS5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBhIHN1aXRhYmxlIHdhbGxcclxuICovXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fZmluZFdhbGwgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgcHJpbzEgPSBbXTtcclxuXHR2YXIgcHJpbzIgPSBbXTtcclxuXHRmb3IgKHZhciBpZCBpbiB0aGlzLl93YWxscykge1xyXG5cdFx0dmFyIHByaW8gPSB0aGlzLl93YWxsc1tpZF07XHJcblx0XHRpZiAocHJpbyA9PSAyKSB7IFxyXG5cdFx0XHRwcmlvMi5wdXNoKGlkKTsgXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwcmlvMS5wdXNoKGlkKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dmFyIGFyciA9IChwcmlvMi5sZW5ndGggPyBwcmlvMiA6IHByaW8xKTtcclxuXHRpZiAoIWFyci5sZW5ndGgpIHsgcmV0dXJuIG51bGw7IH0gLyogbm8gd2FsbHMgOi8gKi9cclxuXHRcclxuXHR2YXIgaWQgPSBhcnIucmFuZG9tKCk7XHJcblx0ZGVsZXRlIHRoaXMuX3dhbGxzW2lkXTtcclxuXHJcblx0cmV0dXJuIGlkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRyaWVzIGFkZGluZyBhIGZlYXR1cmVcclxuICogQHJldHVybnMge2Jvb2x9IHdhcyB0aGlzIGEgc3VjY2Vzc2Z1bCB0cnk/XHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX3RyeUZlYXR1cmUgPSBmdW5jdGlvbih4LCB5LCBkeCwgZHkpIHtcclxuXHR2YXIgZmVhdHVyZSA9IFJPVC5STkcuZ2V0V2VpZ2h0ZWRWYWx1ZSh0aGlzLl9mZWF0dXJlcyk7XHJcblx0ZmVhdHVyZSA9IFJPVC5NYXAuRmVhdHVyZVtmZWF0dXJlXS5jcmVhdGVSYW5kb21BdCh4LCB5LCBkeCwgZHksIHRoaXMuX29wdGlvbnMpO1xyXG5cdFxyXG5cdGlmICghZmVhdHVyZS5pc1ZhbGlkKHRoaXMuX2lzV2FsbENhbGxiYWNrLCB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrKSkge1xyXG4vL1x0XHRjb25zb2xlLmxvZyhcIm5vdCB2YWxpZFwiKTtcclxuLy9cdFx0ZmVhdHVyZS5kZWJ1ZygpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHRcclxuXHRmZWF0dXJlLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XHJcbi8vXHRmZWF0dXJlLmRlYnVnKCk7XHJcblxyXG5cdGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUk9ULk1hcC5GZWF0dXJlLlJvb20pIHsgdGhpcy5fcm9vbXMucHVzaChmZWF0dXJlKTsgfVxyXG5cdGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yKSB7IFxyXG5cdFx0ZmVhdHVyZS5jcmVhdGVQcmlvcml0eVdhbGxzKHRoaXMuX3ByaW9yaXR5V2FsbENhbGxiYWNrKTtcclxuXHRcdHRoaXMuX2NvcnJpZG9ycy5wdXNoKGZlYXR1cmUpOyBcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX3JlbW92ZVN1cnJvdW5kaW5nV2FsbHMgPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHR2YXIgZGVsdGFzID0gUk9ULkRJUlNbNF07XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPGRlbHRhcy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgZGVsdGEgPSBkZWx0YXNbaV07XHJcblx0XHR2YXIgeCA9IGN4ICsgZGVsdGFbMF07XHJcblx0XHR2YXIgeSA9IGN5ICsgZGVsdGFbMV07XHJcblx0XHRkZWxldGUgdGhpcy5fd2FsbHNbeCtcIixcIit5XTtcclxuXHRcdHZhciB4ID0gY3ggKyAyKmRlbHRhWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIDIqZGVsdGFbMV07XHJcblx0XHRkZWxldGUgdGhpcy5fd2FsbHNbeCtcIixcIit5XTtcclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyB2ZWN0b3IgaW4gXCJkaWdnaW5nXCIgZGlyZWN0aW9uLCBvciBmYWxzZSwgaWYgdGhpcyBkb2VzIG5vdCBleGlzdCAob3IgaXMgbm90IHVuaXF1ZSlcclxuICovXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fZ2V0RGlnZ2luZ0RpcmVjdGlvbiA9IGZ1bmN0aW9uKGN4LCBjeSkge1xyXG5cdGlmIChjeCA8PSAwIHx8IGN5IDw9IDAgfHwgY3ggPj0gdGhpcy5fd2lkdGggLSAxIHx8IGN5ID49IHRoaXMuX2hlaWdodCAtIDEpIHsgcmV0dXJuIG51bGw7IH1cclxuXHJcblx0dmFyIHJlc3VsdCA9IG51bGw7XHJcblx0dmFyIGRlbHRhcyA9IFJPVC5ESVJTWzRdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPGRlbHRhcy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgZGVsdGEgPSBkZWx0YXNbaV07XHJcblx0XHR2YXIgeCA9IGN4ICsgZGVsdGFbMF07XHJcblx0XHR2YXIgeSA9IGN5ICsgZGVsdGFbMV07XHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5fbWFwW3hdW3ldKSB7IC8qIHRoZXJlIGFscmVhZHkgaXMgYW5vdGhlciBlbXB0eSBuZWlnaGJvciEgKi9cclxuXHRcdFx0aWYgKHJlc3VsdCkgeyByZXR1cm4gbnVsbDsgfVxyXG5cdFx0XHRyZXN1bHQgPSBkZWx0YTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Lyogbm8gZW1wdHkgbmVpZ2hib3IgKi9cclxuXHRpZiAoIXJlc3VsdCkgeyByZXR1cm4gbnVsbDsgfVxyXG5cdFxyXG5cdHJldHVybiBbLXJlc3VsdFswXSwgLXJlc3VsdFsxXV07XHJcbn07XHJcblxyXG4vKipcclxuICogRmluZCBlbXB0eSBzcGFjZXMgc3Vycm91bmRpbmcgcm9vbXMsIGFuZCBhcHBseSBkb29ycy5cclxuICovXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fYWRkRG9vcnMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgZGF0YSA9IHRoaXMuX21hcDtcclxuXHR2YXIgaXNXYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0XHRyZXR1cm4gKGRhdGFbeF1beV0gPT0gMSk7XHJcblx0fTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3Jvb21zLmxlbmd0aDsgaSsrICkge1xyXG5cdFx0dmFyIHJvb20gPSB0aGlzLl9yb29tc1tpXTtcclxuXHRcdHJvb20uY2xlYXJEb29ycygpO1xyXG5cdFx0cm9vbS5hZGREb29ycyhpc1dhbGxDYWxsYmFjayk7XHJcblx0fVxyXG59O1xyXG4vKipcclxuICogQGNsYXNzIER1bmdlb24gZ2VuZXJhdG9yIHdoaWNoIHRyaWVzIHRvIGZpbGwgdGhlIHNwYWNlIGV2ZW5seS4gR2VuZXJhdGVzIGluZGVwZW5kZW50IHJvb21zIGFuZCB0cmllcyB0byBjb25uZWN0IHRoZW0uXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwLkR1bmdlb25cclxuICovXHJcblJPVC5NYXAuVW5pZm9ybSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcclxuXHRST1QuTWFwLkR1bmdlb24uY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdHJvb21XaWR0aDogWzMsIDldLCAvKiByb29tIG1pbmltdW0gYW5kIG1heGltdW0gd2lkdGggKi9cclxuXHRcdHJvb21IZWlnaHQ6IFszLCA1XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIGhlaWdodCAqL1xyXG5cdFx0cm9vbUR1Z1BlcmNlbnRhZ2U6IDAuMSwgLyogd2Ugc3RvcCBhZnRlciB0aGlzIHBlcmNlbnRhZ2Ugb2YgbGV2ZWwgYXJlYSBoYXMgYmVlbiBkdWcgb3V0IGJ5IHJvb21zICovXHJcblx0XHR0aW1lTGltaXQ6IDEwMDAgLyogd2Ugc3RvcCBhZnRlciB0aGlzIG11Y2ggdGltZSBoYXMgcGFzc2VkIChtc2VjKSAqL1xyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblxyXG5cdHRoaXMuX3Jvb21BdHRlbXB0cyA9IDIwOyAvKiBuZXcgcm9vbSBpcyBjcmVhdGVkIE4tdGltZXMgdW50aWwgaXMgY29uc2lkZXJlZCBhcyBpbXBvc3NpYmxlIHRvIGdlbmVyYXRlICovXHJcblx0dGhpcy5fY29ycmlkb3JBdHRlbXB0cyA9IDIwOyAvKiBjb3JyaWRvcnMgYXJlIHRyaWVkIE4tdGltZXMgdW50aWwgdGhlIGxldmVsIGlzIGNvbnNpZGVyZWQgYXMgaW1wb3NzaWJsZSB0byBjb25uZWN0ICovXHJcblxyXG5cdHRoaXMuX2Nvbm5lY3RlZCA9IFtdOyAvKiBsaXN0IG9mIGFscmVhZHkgY29ubmVjdGVkIHJvb21zICovXHJcblx0dGhpcy5fdW5jb25uZWN0ZWQgPSBbXTsgLyogbGlzdCBvZiByZW1haW5pbmcgdW5jb25uZWN0ZWQgcm9vbXMgKi9cclxuXHRcclxuXHR0aGlzLl9kaWdDYWxsYmFjayA9IHRoaXMuX2RpZ0NhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5fY2FuQmVEdWdDYWxsYmFjayA9IHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHR0aGlzLl9pc1dhbGxDYWxsYmFjayA9IHRoaXMuX2lzV2FsbENhbGxiYWNrLmJpbmQodGhpcyk7XHJcbn07XHJcblJPVC5NYXAuVW5pZm9ybS5leHRlbmQoUk9ULk1hcC5EdW5nZW9uKTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBtYXAuIElmIHRoZSB0aW1lIGxpbWl0IGhhcyBiZWVuIGhpdCwgcmV0dXJucyBudWxsLlxyXG4gKiBAc2VlIFJPVC5NYXAjY3JlYXRlXHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIHQxID0gRGF0ZS5ub3coKTtcclxuXHR3aGlsZSAoMSkge1xyXG5cdFx0dmFyIHQyID0gRGF0ZS5ub3coKTtcclxuXHRcdGlmICh0MiAtIHQxID4gdGhpcy5fb3B0aW9ucy50aW1lTGltaXQpIHsgcmV0dXJuIG51bGw7IH0gLyogdGltZSBsaW1pdCEgKi9cclxuXHRcclxuXHRcdHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0XHR0aGlzLl9kdWcgPSAwO1xyXG5cdFx0dGhpcy5fcm9vbXMgPSBbXTtcclxuXHRcdHRoaXMuX3VuY29ubmVjdGVkID0gW107XHJcblx0XHR0aGlzLl9nZW5lcmF0ZVJvb21zKCk7XHJcblx0XHRpZiAodGhpcy5fcm9vbXMubGVuZ3RoIDwgMikgeyBjb250aW51ZTsgfVxyXG5cdFx0aWYgKHRoaXMuX2dlbmVyYXRlQ29ycmlkb3JzKCkpIHsgYnJlYWs7IH1cclxuXHR9XHJcblx0XHJcblx0aWYgKGNhbGxiYWNrKSB7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogR2VuZXJhdGVzIGEgc3VpdGFibGUgYW1vdW50IG9mIHJvb21zXHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9nZW5lcmF0ZVJvb21zID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHcgPSB0aGlzLl93aWR0aC0yO1xyXG5cdHZhciBoID0gdGhpcy5faGVpZ2h0LTI7XHJcblxyXG5cdGRvIHtcclxuXHRcdHZhciByb29tID0gdGhpcy5fZ2VuZXJhdGVSb29tKCk7XHJcblx0XHRpZiAodGhpcy5fZHVnLyh3KmgpID4gdGhpcy5fb3B0aW9ucy5yb29tRHVnUGVyY2VudGFnZSkgeyBicmVhazsgfSAvKiBhY2hpZXZlZCByZXF1ZXN0ZWQgYW1vdW50IG9mIGZyZWUgc3BhY2UgKi9cclxuXHR9IHdoaWxlIChyb29tKTtcclxuXHJcblx0LyogZWl0aGVyIGVub3VnaCByb29tcywgb3Igbm90IGFibGUgdG8gZ2VuZXJhdGUgbW9yZSBvZiB0aGVtIDopICovXHJcbn07XHJcblxyXG4vKipcclxuICogVHJ5IHRvIGdlbmVyYXRlIG9uZSByb29tXHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9nZW5lcmF0ZVJvb20gPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgY291bnQgPSAwO1xyXG5cdHdoaWxlIChjb3VudCA8IHRoaXMuX3Jvb21BdHRlbXB0cykge1xyXG5cdFx0Y291bnQrKztcclxuXHRcdFxyXG5cdFx0dmFyIHJvb20gPSBST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb20odGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgdGhpcy5fb3B0aW9ucyk7XHJcblx0XHRpZiAoIXJvb20uaXNWYWxpZCh0aGlzLl9pc1dhbGxDYWxsYmFjaywgdGhpcy5fY2FuQmVEdWdDYWxsYmFjaykpIHsgY29udGludWU7IH1cclxuXHRcdFxyXG5cdFx0cm9vbS5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spO1xyXG5cdFx0dGhpcy5fcm9vbXMucHVzaChyb29tKTtcclxuXHRcdHJldHVybiByb29tO1xyXG5cdH0gXHJcblxyXG5cdC8qIG5vIHJvb20gd2FzIGdlbmVyYXRlZCBpbiBhIGdpdmVuIG51bWJlciBvZiBhdHRlbXB0cyAqL1xyXG5cdHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBjb25uZWN0b3JzIGJld2VlbiByb29tc1xyXG4gKiBAcmV0dXJucyB7Ym9vbH0gc3VjY2VzcyBXYXMgdGhpcyBhdHRlbXB0IHN1Y2Nlc3NmdWxsP1xyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZ2VuZXJhdGVDb3JyaWRvcnMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgY250ID0gMDtcclxuXHR3aGlsZSAoY250IDwgdGhpcy5fY29ycmlkb3JBdHRlbXB0cykge1xyXG5cdFx0Y250Kys7XHJcblx0XHR0aGlzLl9jb3JyaWRvcnMgPSBbXTtcclxuXHJcblx0XHQvKiBkaWcgcm9vbXMgaW50byBhIGNsZWFyIG1hcCAqL1xyXG5cdFx0dGhpcy5fbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuX3Jvb21zLmxlbmd0aDtpKyspIHsgXHJcblx0XHRcdHZhciByb29tID0gdGhpcy5fcm9vbXNbaV07XHJcblx0XHRcdHJvb20uY2xlYXJEb29ycygpO1xyXG5cdFx0XHRyb29tLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7IFxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3VuY29ubmVjdGVkID0gdGhpcy5fcm9vbXMuc2xpY2UoKS5yYW5kb21pemUoKTtcclxuXHRcdHRoaXMuX2Nvbm5lY3RlZCA9IFtdO1xyXG5cdFx0aWYgKHRoaXMuX3VuY29ubmVjdGVkLmxlbmd0aCkgeyB0aGlzLl9jb25uZWN0ZWQucHVzaCh0aGlzLl91bmNvbm5lY3RlZC5wb3AoKSk7IH0gLyogZmlyc3Qgb25lIGlzIGFsd2F5cyBjb25uZWN0ZWQgKi9cclxuXHRcdFxyXG5cdFx0d2hpbGUgKDEpIHtcclxuXHRcdFx0LyogMS4gcGljayByYW5kb20gY29ubmVjdGVkIHJvb20gKi9cclxuXHRcdFx0dmFyIGNvbm5lY3RlZCA9IHRoaXMuX2Nvbm5lY3RlZC5yYW5kb20oKTtcclxuXHRcdFx0XHJcblx0XHRcdC8qIDIuIGZpbmQgY2xvc2VzdCB1bmNvbm5lY3RlZCAqL1xyXG5cdFx0XHR2YXIgcm9vbTEgPSB0aGlzLl9jbG9zZXN0Um9vbSh0aGlzLl91bmNvbm5lY3RlZCwgY29ubmVjdGVkKTtcclxuXHRcdFx0XHJcblx0XHRcdC8qIDMuIGNvbm5lY3QgaXQgdG8gY2xvc2VzdCBjb25uZWN0ZWQgKi9cclxuXHRcdFx0dmFyIHJvb20yID0gdGhpcy5fY2xvc2VzdFJvb20odGhpcy5fY29ubmVjdGVkLCByb29tMSk7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgb2sgPSB0aGlzLl9jb25uZWN0Um9vbXMocm9vbTEsIHJvb20yKTtcclxuXHRcdFx0aWYgKCFvaykgeyBicmVhazsgfSAvKiBzdG9wIGNvbm5lY3RpbmcsIHJlLXNodWZmbGUgKi9cclxuXHRcdFx0XHJcblx0XHRcdGlmICghdGhpcy5fdW5jb25uZWN0ZWQubGVuZ3RoKSB7IHJldHVybiB0cnVlOyB9IC8qIGRvbmU7IG5vIHJvb21zIHJlbWFpbiAqL1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogRm9yIGEgZ2l2ZW4gcm9vbSwgZmluZCB0aGUgY2xvc2VzdCBvbmUgZnJvbSB0aGUgbGlzdFxyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fY2xvc2VzdFJvb20gPSBmdW5jdGlvbihyb29tcywgcm9vbSkge1xyXG5cdHZhciBkaXN0ID0gSW5maW5pdHk7XHJcblx0dmFyIGNlbnRlciA9IHJvb20uZ2V0Q2VudGVyKCk7XHJcblx0dmFyIHJlc3VsdCA9IG51bGw7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8cm9vbXMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHIgPSByb29tc1tpXTtcclxuXHRcdHZhciBjID0gci5nZXRDZW50ZXIoKTtcclxuXHRcdHZhciBkeCA9IGNbMF0tY2VudGVyWzBdO1xyXG5cdFx0dmFyIGR5ID0gY1sxXS1jZW50ZXJbMV07XHJcblx0XHR2YXIgZCA9IGR4KmR4K2R5KmR5O1xyXG5cdFx0XHJcblx0XHRpZiAoZCA8IGRpc3QpIHtcclxuXHRcdFx0ZGlzdCA9IGQ7XHJcblx0XHRcdHJlc3VsdCA9IHI7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9jb25uZWN0Um9vbXMgPSBmdW5jdGlvbihyb29tMSwgcm9vbTIpIHtcclxuXHQvKlxyXG5cdFx0cm9vbTEuZGVidWcoKTtcclxuXHRcdHJvb20yLmRlYnVnKCk7XHJcblx0Ki9cclxuXHJcblx0dmFyIGNlbnRlcjEgPSByb29tMS5nZXRDZW50ZXIoKTtcclxuXHR2YXIgY2VudGVyMiA9IHJvb20yLmdldENlbnRlcigpO1xyXG5cclxuXHR2YXIgZGlmZlggPSBjZW50ZXIyWzBdIC0gY2VudGVyMVswXTtcclxuXHR2YXIgZGlmZlkgPSBjZW50ZXIyWzFdIC0gY2VudGVyMVsxXTtcclxuXHJcblx0aWYgKE1hdGguYWJzKGRpZmZYKSA8IE1hdGguYWJzKGRpZmZZKSkgeyAvKiBmaXJzdCB0cnkgY29ubmVjdGluZyBub3J0aC1zb3V0aCB3YWxscyAqL1xyXG5cdFx0dmFyIGRpckluZGV4MSA9IChkaWZmWSA+IDAgPyAyIDogMCk7XHJcblx0XHR2YXIgZGlySW5kZXgyID0gKGRpckluZGV4MSArIDIpICUgNDtcclxuXHRcdHZhciBtaW4gPSByb29tMi5nZXRMZWZ0KCk7XHJcblx0XHR2YXIgbWF4ID0gcm9vbTIuZ2V0UmlnaHQoKTtcclxuXHRcdHZhciBpbmRleCA9IDA7XHJcblx0fSBlbHNlIHsgLyogZmlyc3QgdHJ5IGNvbm5lY3RpbmcgZWFzdC13ZXN0IHdhbGxzICovXHJcblx0XHR2YXIgZGlySW5kZXgxID0gKGRpZmZYID4gMCA/IDEgOiAzKTtcclxuXHRcdHZhciBkaXJJbmRleDIgPSAoZGlySW5kZXgxICsgMikgJSA0O1xyXG5cdFx0dmFyIG1pbiA9IHJvb20yLmdldFRvcCgpO1xyXG5cdFx0dmFyIG1heCA9IHJvb20yLmdldEJvdHRvbSgpO1xyXG5cdFx0dmFyIGluZGV4ID0gMTtcclxuXHR9XHJcblxyXG5cdHZhciBzdGFydCA9IHRoaXMuX3BsYWNlSW5XYWxsKHJvb20xLCBkaXJJbmRleDEpOyAvKiBjb3JyaWRvciB3aWxsIHN0YXJ0IGhlcmUgKi9cclxuXHRpZiAoIXN0YXJ0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuXHRpZiAoc3RhcnRbaW5kZXhdID49IG1pbiAmJiBzdGFydFtpbmRleF0gPD0gbWF4KSB7IC8qIHBvc3NpYmxlIHRvIGNvbm5lY3Qgd2l0aCBzdHJhaWdodCBsaW5lIChJLWxpa2UpICovXHJcblx0XHR2YXIgZW5kID0gc3RhcnQuc2xpY2UoKTtcclxuXHRcdHZhciB2YWx1ZSA9IG51bGw7XHJcblx0XHRzd2l0Y2ggKGRpckluZGV4Mikge1xyXG5cdFx0XHRjYXNlIDA6IHZhbHVlID0gcm9vbTIuZ2V0VG9wKCktMTsgYnJlYWs7XHJcblx0XHRcdGNhc2UgMTogdmFsdWUgPSByb29tMi5nZXRSaWdodCgpKzE7IGJyZWFrO1xyXG5cdFx0XHRjYXNlIDI6IHZhbHVlID0gcm9vbTIuZ2V0Qm90dG9tKCkrMTsgYnJlYWs7XHJcblx0XHRcdGNhc2UgMzogdmFsdWUgPSByb29tMi5nZXRMZWZ0KCktMTsgYnJlYWs7XHJcblx0XHR9XHJcblx0XHRlbmRbKGluZGV4KzEpJTJdID0gdmFsdWU7XHJcblx0XHR0aGlzLl9kaWdMaW5lKFtzdGFydCwgZW5kXSk7XHJcblx0XHRcclxuXHR9IGVsc2UgaWYgKHN0YXJ0W2luZGV4XSA8IG1pbi0xIHx8IHN0YXJ0W2luZGV4XSA+IG1heCsxKSB7IC8qIG5lZWQgdG8gc3dpdGNoIHRhcmdldCB3YWxsIChMLWxpa2UpICovXHJcblxyXG5cdFx0dmFyIGRpZmYgPSBzdGFydFtpbmRleF0gLSBjZW50ZXIyW2luZGV4XTtcclxuXHRcdHN3aXRjaCAoZGlySW5kZXgyKSB7XHJcblx0XHRcdGNhc2UgMDpcclxuXHRcdFx0Y2FzZSAxOlx0dmFyIHJvdGF0aW9uID0gKGRpZmYgPCAwID8gMyA6IDEpOyBicmVhaztcclxuXHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRjYXNlIDM6XHR2YXIgcm90YXRpb24gPSAoZGlmZiA8IDAgPyAxIDogMyk7IGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0ZGlySW5kZXgyID0gKGRpckluZGV4MiArIHJvdGF0aW9uKSAlIDQ7XHJcblx0XHRcclxuXHRcdHZhciBlbmQgPSB0aGlzLl9wbGFjZUluV2FsbChyb29tMiwgZGlySW5kZXgyKTtcclxuXHRcdGlmICghZW5kKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuXHRcdHZhciBtaWQgPSBbMCwgMF07XHJcblx0XHRtaWRbaW5kZXhdID0gc3RhcnRbaW5kZXhdO1xyXG5cdFx0dmFyIGluZGV4MiA9IChpbmRleCsxKSUyO1xyXG5cdFx0bWlkW2luZGV4Ml0gPSBlbmRbaW5kZXgyXTtcclxuXHRcdHRoaXMuX2RpZ0xpbmUoW3N0YXJ0LCBtaWQsIGVuZF0pO1xyXG5cdFx0XHJcblx0fSBlbHNlIHsgLyogdXNlIGN1cnJlbnQgd2FsbCBwYWlyLCBidXQgYWRqdXN0IHRoZSBsaW5lIGluIHRoZSBtaWRkbGUgKFMtbGlrZSkgKi9cclxuXHRcclxuXHRcdHZhciBpbmRleDIgPSAoaW5kZXgrMSklMjtcclxuXHRcdHZhciBlbmQgPSB0aGlzLl9wbGFjZUluV2FsbChyb29tMiwgZGlySW5kZXgyKTtcclxuXHRcdGlmICghZW5kKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0dmFyIG1pZCA9IE1hdGgucm91bmQoKGVuZFtpbmRleDJdICsgc3RhcnRbaW5kZXgyXSkvMik7XHJcblxyXG5cdFx0dmFyIG1pZDEgPSBbMCwgMF07XHJcblx0XHR2YXIgbWlkMiA9IFswLCAwXTtcclxuXHRcdG1pZDFbaW5kZXhdID0gc3RhcnRbaW5kZXhdO1xyXG5cdFx0bWlkMVtpbmRleDJdID0gbWlkO1xyXG5cdFx0bWlkMltpbmRleF0gPSBlbmRbaW5kZXhdO1xyXG5cdFx0bWlkMltpbmRleDJdID0gbWlkO1xyXG5cdFx0dGhpcy5fZGlnTGluZShbc3RhcnQsIG1pZDEsIG1pZDIsIGVuZF0pO1xyXG5cdH1cclxuXHJcblx0cm9vbTEuYWRkRG9vcihzdGFydFswXSwgc3RhcnRbMV0pO1xyXG5cdHJvb20yLmFkZERvb3IoZW5kWzBdLCBlbmRbMV0pO1xyXG5cdFxyXG5cdHZhciBpbmRleCA9IHRoaXMuX3VuY29ubmVjdGVkLmluZGV4T2Yocm9vbTEpO1xyXG5cdGlmIChpbmRleCAhPSAtMSkge1xyXG5cdFx0dGhpcy5fdW5jb25uZWN0ZWQuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdHRoaXMuX2Nvbm5lY3RlZC5wdXNoKHJvb20xKTtcclxuXHR9XHJcblxyXG5cdHZhciBpbmRleCA9IHRoaXMuX3VuY29ubmVjdGVkLmluZGV4T2Yocm9vbTIpO1xyXG5cdGlmIChpbmRleCAhPSAtMSkge1xyXG5cdFx0dGhpcy5fdW5jb25uZWN0ZWQuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdHRoaXMuX2Nvbm5lY3RlZC5wdXNoKHJvb20yKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9wbGFjZUluV2FsbCA9IGZ1bmN0aW9uKHJvb20sIGRpckluZGV4KSB7XHJcblx0dmFyIHN0YXJ0ID0gWzAsIDBdO1xyXG5cdHZhciBkaXIgPSBbMCwgMF07XHJcblx0dmFyIGxlbmd0aCA9IDA7XHJcblx0XHJcblx0c3dpdGNoIChkaXJJbmRleCkge1xyXG5cdFx0Y2FzZSAwOlxyXG5cdFx0XHRkaXIgPSBbMSwgMF07XHJcblx0XHRcdHN0YXJ0ID0gW3Jvb20uZ2V0TGVmdCgpLCByb29tLmdldFRvcCgpLTFdO1xyXG5cdFx0XHRsZW5ndGggPSByb29tLmdldFJpZ2h0KCktcm9vbS5nZXRMZWZ0KCkrMTtcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAxOlxyXG5cdFx0XHRkaXIgPSBbMCwgMV07XHJcblx0XHRcdHN0YXJ0ID0gW3Jvb20uZ2V0UmlnaHQoKSsxLCByb29tLmdldFRvcCgpXTtcclxuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRCb3R0b20oKS1yb29tLmdldFRvcCgpKzE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMjpcclxuXHRcdFx0ZGlyID0gWzEsIDBdO1xyXG5cdFx0XHRzdGFydCA9IFtyb29tLmdldExlZnQoKSwgcm9vbS5nZXRCb3R0b20oKSsxXTtcclxuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRSaWdodCgpLXJvb20uZ2V0TGVmdCgpKzE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMzpcclxuXHRcdFx0ZGlyID0gWzAsIDFdO1xyXG5cdFx0XHRzdGFydCA9IFtyb29tLmdldExlZnQoKS0xLCByb29tLmdldFRvcCgpXTtcclxuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRCb3R0b20oKS1yb29tLmdldFRvcCgpKzE7XHJcblx0XHRicmVhaztcclxuXHR9XHJcblx0XHJcblx0dmFyIGF2YWlsID0gW107XHJcblx0dmFyIGxhc3RCYWRJbmRleCA9IC0yO1xyXG5cclxuXHRmb3IgKHZhciBpPTA7aTxsZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgeCA9IHN0YXJ0WzBdICsgaSpkaXJbMF07XHJcblx0XHR2YXIgeSA9IHN0YXJ0WzFdICsgaSpkaXJbMV07XHJcblx0XHRhdmFpbC5wdXNoKG51bGwpO1xyXG5cdFx0XHJcblx0XHR2YXIgaXNXYWxsID0gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcclxuXHRcdGlmIChpc1dhbGwpIHtcclxuXHRcdFx0aWYgKGxhc3RCYWRJbmRleCAhPSBpLTEpIHsgYXZhaWxbaV0gPSBbeCwgeV07IH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxhc3RCYWRJbmRleCA9IGk7XHJcblx0XHRcdGlmIChpKSB7IGF2YWlsW2ktMV0gPSBudWxsOyB9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9YXZhaWwubGVuZ3RoLTE7IGk+PTA7IGktLSkge1xyXG5cdFx0aWYgKCFhdmFpbFtpXSkgeyBhdmFpbC5zcGxpY2UoaSwgMSk7IH1cclxuXHR9XHJcblx0cmV0dXJuIChhdmFpbC5sZW5ndGggPyBhdmFpbC5yYW5kb20oKSA6IG51bGwpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERpZyBhIHBvbHlsaW5lLlxyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZGlnTGluZSA9IGZ1bmN0aW9uKHBvaW50cykge1xyXG5cdGZvciAodmFyIGk9MTtpPHBvaW50cy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgc3RhcnQgPSBwb2ludHNbaS0xXTtcclxuXHRcdHZhciBlbmQgPSBwb2ludHNbaV07XHJcblx0XHR2YXIgY29ycmlkb3IgPSBuZXcgUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yKHN0YXJ0WzBdLCBzdGFydFsxXSwgZW5kWzBdLCBlbmRbMV0pO1xyXG5cdFx0Y29ycmlkb3IuY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcclxuXHRcdHRoaXMuX2NvcnJpZG9ycy5wdXNoKGNvcnJpZG9yKTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9kaWdDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHksIHZhbHVlKSB7XHJcblx0dGhpcy5fbWFwW3hdW3ldID0gdmFsdWU7XHJcblx0aWYgKHZhbHVlID09IDApIHsgdGhpcy5fZHVnKys7IH1cclxufTtcclxuXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2lzV2FsbENhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX3dpZHRoIHx8IHkgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fY2FuQmVEdWdDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRpZiAoeCA8IDEgfHwgeSA8IDEgfHwgeCsxID49IHRoaXMuX3dpZHRoIHx8IHkrMSA+PSB0aGlzLl9oZWlnaHQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0cmV0dXJuICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQGF1dGhvciBoeWFrdWdlaVxyXG4gKiBAY2xhc3MgRHVuZ2VvbiBnZW5lcmF0b3Igd2hpY2ggdXNlcyB0aGUgXCJvcmdpbmFsXCIgUm9ndWUgZHVuZ2VvbiBnZW5lcmF0aW9uIGFsZ29yaXRobS4gU2VlIGh0dHA6Ly9rdW9pLmNvbS9+a2FtaWthemUvR2FtZURlc2lnbi9hcnQwN19yb2d1ZV9kdW5nZW9uLnBocFxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKiBAcGFyYW0ge2ludH0gW3dpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxyXG4gKiBAcGFyYW0ge2ludH0gW2hlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gT3B0aW9uc1xyXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5jZWxsV2lkdGg9M10gTnVtYmVyIG9mIGNlbGxzIHRvIGNyZWF0ZSBvbiB0aGUgaG9yaXpvbnRhbCAobnVtYmVyIG9mIHJvb21zIGhvcml6b250YWxseSlcclxuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuY2VsbEhlaWdodD0zXSBOdW1iZXIgb2YgY2VsbHMgdG8gY3JlYXRlIG9uIHRoZSB2ZXJ0aWNhbCAobnVtYmVyIG9mIHJvb21zIHZlcnRpY2FsbHkpXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5yb29tV2lkdGhdIFJvb20gbWluIGFuZCBtYXggd2lkdGggLSBub3JtYWxseSBzZXQgYXV0by1tYWdpY2FsbHkgdmlhIHRoZSBjb25zdHJ1Y3Rvci5cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnJvb21IZWlnaHRdIFJvb20gbWluIGFuZCBtYXggaGVpZ2h0IC0gbm9ybWFsbHkgc2V0IGF1dG8tbWFnaWNhbGx5IHZpYSB0aGUgY29uc3RydWN0b3IuXHJcbiAqL1xyXG5ST1QuTWFwLlJvZ3VlID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblxyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRjZWxsV2lkdGg6IDMsICAvLyBOT1RFIHRvIHNlbGYsIHRoZXNlIGNvdWxkIHByb2JhYmx5IHdvcmsgdGhlIHNhbWUgYXMgdGhlIHJvb21XaWR0aC9yb29tIEhlaWdodCB2YWx1ZXNcclxuXHRcdGNlbGxIZWlnaHQ6IDMgIC8vICAgICBpZS4gYXMgYW4gYXJyYXkgd2l0aCBtaW4tbWF4IHZhbHVlcyBmb3IgZWFjaCBkaXJlY3Rpb24uLi4uXHJcblx0fTtcclxuXHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblxyXG5cdC8qXHJcblx0U2V0IHRoZSByb29tIHNpemVzIGFjY29yZGluZyB0byB0aGUgb3Zlci1hbGwgd2lkdGggb2YgdGhlIG1hcCxcclxuXHRhbmQgdGhlIGNlbGwgc2l6ZXMuXHJcblx0Ki9cclxuXHRpZiAoIXRoaXMuX29wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJyb29tV2lkdGhcIikpIHtcclxuXHRcdHRoaXMuX29wdGlvbnNbXCJyb29tV2lkdGhcIl0gPSB0aGlzLl9jYWxjdWxhdGVSb29tU2l6ZSh0aGlzLl93aWR0aCwgdGhpcy5fb3B0aW9uc1tcImNlbGxXaWR0aFwiXSk7XHJcblx0fVxyXG5cdGlmICghdGhpcy5fb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcInJvb21IZWlnaHRcIikpIHtcclxuXHRcdHRoaXMuX29wdGlvbnNbXCJyb29tSGVpZ2h0XCJdID0gdGhpcy5fY2FsY3VsYXRlUm9vbVNpemUodGhpcy5faGVpZ2h0LCB0aGlzLl9vcHRpb25zW1wiY2VsbEhlaWdodFwiXSk7XHJcblx0fVxyXG5cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULk1hcCNjcmVhdGVcclxuICovXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG5cdHRoaXMubWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcclxuXHR0aGlzLnJvb21zID0gW107XHJcblx0dGhpcy5jb25uZWN0ZWRDZWxscyA9IFtdO1xyXG5cclxuXHR0aGlzLl9pbml0Um9vbXMoKTtcclxuXHR0aGlzLl9jb25uZWN0Um9vbXMoKTtcclxuXHR0aGlzLl9jb25uZWN0VW5jb25uZWN0ZWRSb29tcygpO1xyXG5cdHRoaXMuX2NyZWF0ZVJhbmRvbVJvb21Db25uZWN0aW9ucygpO1xyXG5cdHRoaXMuX2NyZWF0ZVJvb21zKCk7XHJcblx0dGhpcy5fY3JlYXRlQ29ycmlkb3JzKCk7XHJcblxyXG5cdGlmIChjYWxsYmFjaykge1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl93aWR0aDsgaSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5faGVpZ2h0OyBqKyspIHtcclxuXHRcdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLm1hcFtpXVtqXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2NhbGN1bGF0ZVJvb21TaXplID0gZnVuY3Rpb24gKHNpemUsIGNlbGwpIHtcclxuXHR2YXIgbWF4ID0gTWF0aC5mbG9vcigoc2l6ZS9jZWxsKSAqIDAuOCk7XHJcblx0dmFyIG1pbiA9IE1hdGguZmxvb3IoKHNpemUvY2VsbCkgKiAwLjI1KTtcclxuXHRpZiAobWluIDwgMikgeyBtaW4gPSAyOyB9XHJcblx0aWYgKG1heCA8IDIpIHsgbWF4ID0gMjsgfVxyXG5cdHJldHVybiBbbWluLCBtYXhdO1xyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2luaXRSb29tcyA9IGZ1bmN0aW9uICgpIHtcclxuXHQvLyBjcmVhdGUgcm9vbXMgYXJyYXkuIFRoaXMgaXMgdGhlIFwiZ3JpZFwiIGxpc3QgZnJvbSB0aGUgYWxnby5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoOyBpKyspIHtcclxuXHRcdHRoaXMucm9vbXMucHVzaChbXSk7XHJcblx0XHRmb3IodmFyIGogPSAwOyBqIDwgdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0OyBqKyspIHtcclxuXHRcdFx0dGhpcy5yb29tc1tpXS5wdXNoKHtcInhcIjowLCBcInlcIjowLCBcIndpZHRoXCI6MCwgXCJoZWlnaHRcIjowLCBcImNvbm5lY3Rpb25zXCI6W10sIFwiY2VsbHhcIjppLCBcImNlbGx5XCI6an0pO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jb25uZWN0Um9vbXMgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly9waWNrIHJhbmRvbSBzdGFydGluZyBncmlkXHJcblx0dmFyIGNneCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludCgwLCB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aC0xKTtcclxuXHR2YXIgY2d5ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodC0xKTtcclxuXHJcblx0dmFyIGlkeDtcclxuXHR2YXIgbmNneDtcclxuXHR2YXIgbmNneTtcclxuXHJcblx0dmFyIGZvdW5kID0gZmFsc2U7XHJcblx0dmFyIHJvb207XHJcblx0dmFyIG90aGVyUm9vbTtcclxuXHJcblx0Ly8gZmluZCAgdW5jb25uZWN0ZWQgbmVpZ2hib3VyIGNlbGxzXHJcblx0ZG8ge1xyXG5cclxuXHRcdC8vdmFyIGRpclRvQ2hlY2sgPSBbMCwgMSwgMiwgMywgNCwgNSwgNiwgN107XHJcblx0XHR2YXIgZGlyVG9DaGVjayA9IFswLCAyLCA0LCA2XTtcclxuXHRcdGRpclRvQ2hlY2sgPSBkaXJUb0NoZWNrLnJhbmRvbWl6ZSgpO1xyXG5cclxuXHRcdGRvIHtcclxuXHRcdFx0Zm91bmQgPSBmYWxzZTtcclxuXHRcdFx0aWR4ID0gZGlyVG9DaGVjay5wb3AoKTtcclxuXHJcblx0XHRcdG5jZ3ggPSBjZ3ggKyBST1QuRElSU1s4XVtpZHhdWzBdO1xyXG5cdFx0XHRuY2d5ID0gY2d5ICsgUk9ULkRJUlNbOF1baWR4XVsxXTtcclxuXHJcblx0XHRcdGlmIChuY2d4IDwgMCB8fCBuY2d4ID49IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRcdGlmIChuY2d5IDwgMCB8fCBuY2d5ID49IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodCkgeyBjb250aW51ZTsgfVxyXG5cclxuXHRcdFx0cm9vbSA9IHRoaXMucm9vbXNbY2d4XVtjZ3ldO1xyXG5cclxuXHRcdFx0aWYgKHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Ly8gYXMgbG9uZyBhcyB0aGlzIHJvb20gZG9lc24ndCBhbHJlYWR5IGNvb25lY3QgdG8gbWUsIHdlIGFyZSBvayB3aXRoIGl0LlxyXG5cdFx0XHRcdGlmIChyb29tW1wiY29ubmVjdGlvbnNcIl1bMF1bMF0gPT0gbmNneCAmJiByb29tW1wiY29ubmVjdGlvbnNcIl1bMF1bMV0gPT0gbmNneSkge1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRvdGhlclJvb20gPSB0aGlzLnJvb21zW25jZ3hdW25jZ3ldO1xyXG5cclxuXHRcdFx0aWYgKG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0b3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl0ucHVzaChbY2d4LCBjZ3ldKTtcclxuXHJcblx0XHRcdFx0dGhpcy5jb25uZWN0ZWRDZWxscy5wdXNoKFtuY2d4LCBuY2d5XSk7XHJcblx0XHRcdFx0Y2d4ID0gbmNneDtcclxuXHRcdFx0XHRjZ3kgPSBuY2d5O1xyXG5cdFx0XHRcdGZvdW5kID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gd2hpbGUgKGRpclRvQ2hlY2subGVuZ3RoID4gMCAmJiBmb3VuZCA9PSBmYWxzZSk7XHJcblxyXG5cdH0gd2hpbGUgKGRpclRvQ2hlY2subGVuZ3RoID4gMCk7XHJcblxyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2Nvbm5lY3RVbmNvbm5lY3RlZFJvb21zID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vV2hpbGUgdGhlcmUgYXJlIHVuY29ubmVjdGVkIHJvb21zLCB0cnkgdG8gY29ubmVjdCB0aGVtIHRvIGEgcmFuZG9tIGNvbm5lY3RlZCBuZWlnaGJvclxyXG5cdC8vKGlmIGEgcm9vbSBoYXMgbm8gY29ubmVjdGVkIG5laWdoYm9ycyB5ZXQsIGp1c3Qga2VlcCBjeWNsaW5nLCB5b3UnbGwgZmlsbCBvdXQgdG8gaXQgZXZlbnR1YWxseSkuXHJcblx0dmFyIGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XHJcblx0dmFyIGNoID0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0O1xyXG5cclxuXHR0aGlzLmNvbm5lY3RlZENlbGxzID0gdGhpcy5jb25uZWN0ZWRDZWxscy5yYW5kb21pemUoKTtcclxuXHR2YXIgcm9vbTtcclxuXHR2YXIgb3RoZXJSb29tO1xyXG5cdHZhciB2YWxpZFJvb207XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7IGkrKykge1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7IGorKykgIHtcclxuXHJcblx0XHRcdHJvb20gPSB0aGlzLnJvb21zW2ldW2pdO1xyXG5cclxuXHRcdFx0aWYgKHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdHZhciBkaXJlY3Rpb25zID0gWzAsIDIsIDQsIDZdO1xyXG5cdFx0XHRcdGRpcmVjdGlvbnMgPSBkaXJlY3Rpb25zLnJhbmRvbWl6ZSgpO1xyXG5cclxuXHRcdFx0XHR2YWxpZFJvb20gPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0ZG8ge1xyXG5cclxuXHRcdFx0XHRcdHZhciBkaXJJZHggPSBkaXJlY3Rpb25zLnBvcCgpO1xyXG5cdFx0XHRcdFx0dmFyIG5ld0kgPSBpICsgUk9ULkRJUlNbOF1bZGlySWR4XVswXTtcclxuXHRcdFx0XHRcdHZhciBuZXdKID0gaiArIFJPVC5ESVJTWzhdW2RpcklkeF1bMV07XHJcblxyXG5cdFx0XHRcdFx0aWYgKG5ld0kgPCAwIHx8IG5ld0kgPj0gY3cgfHwgbmV3SiA8IDAgfHwgbmV3SiA+PSBjaCkgeyBjb250aW51ZTsgfVxyXG5cclxuXHRcdFx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbbmV3SV1bbmV3Sl07XHJcblxyXG5cdFx0XHRcdFx0dmFsaWRSb29tID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0XHRpZiAob3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID09IDApIHsgYnJlYWs7IH1cclxuXHJcblx0XHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aDsgaysrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXVtrXVswXSA9PSBpICYmIG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdW2tdWzFdID09IGopIHtcclxuXHRcdFx0XHRcdFx0XHR2YWxpZFJvb20gPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICh2YWxpZFJvb20pIHsgYnJlYWs7IH1cclxuXHJcblx0XHRcdFx0fSB3aGlsZSAoZGlyZWN0aW9ucy5sZW5ndGgpO1xyXG5cclxuXHRcdFx0XHRpZiAodmFsaWRSb29tKSB7XHJcblx0XHRcdFx0XHRyb29tW1wiY29ubmVjdGlvbnNcIl0ucHVzaChbb3RoZXJSb29tW1wiY2VsbHhcIl0sIG90aGVyUm9vbVtcImNlbGx5XCJdXSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiLS0gVW5hYmxlIHRvIGNvbm5lY3Qgcm9vbS5cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2NyZWF0ZVJhbmRvbVJvb21Db25uZWN0aW9ucyA9IGZ1bmN0aW9uIChjb25uZWN0aW9ucykge1xyXG5cdC8vIEVtcHR5IGZvciBub3cuXHJcbn07XHJcblxyXG5cclxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2NyZWF0ZVJvb21zID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vIENyZWF0ZSBSb29tc1xyXG5cclxuXHR2YXIgdyA9IHRoaXMuX3dpZHRoO1xyXG5cdHZhciBoID0gdGhpcy5faGVpZ2h0O1xyXG5cclxuXHR2YXIgY3cgPSB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDtcclxuXHR2YXIgY2ggPSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7XHJcblxyXG5cdHZhciBjd3AgPSBNYXRoLmZsb29yKHRoaXMuX3dpZHRoIC8gY3cpO1xyXG5cdHZhciBjaHAgPSBNYXRoLmZsb29yKHRoaXMuX2hlaWdodCAvIGNoKTtcclxuXHJcblx0dmFyIHJvb213O1xyXG5cdHZhciByb29taDtcclxuXHR2YXIgcm9vbVdpZHRoID0gdGhpcy5fb3B0aW9uc1tcInJvb21XaWR0aFwiXTtcclxuXHR2YXIgcm9vbUhlaWdodCA9IHRoaXMuX29wdGlvbnNbXCJyb29tSGVpZ2h0XCJdO1xyXG5cdHZhciBzeDtcclxuXHR2YXIgc3k7XHJcblx0dmFyIG90aGVyUm9vbTtcclxuXHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjdzsgaSsrKSB7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNoOyBqKyspIHtcclxuXHRcdFx0c3ggPSBjd3AgKiBpO1xyXG5cdFx0XHRzeSA9IGNocCAqIGo7XHJcblxyXG5cdFx0XHRpZiAoc3ggPT0gMCkgeyBzeCA9IDE7IH1cclxuXHRcdFx0aWYgKHN5ID09IDApIHsgc3kgPSAxOyB9XHJcblxyXG5cdFx0XHRyb29tdyA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChyb29tV2lkdGhbMF0sIHJvb21XaWR0aFsxXSk7XHJcblx0XHRcdHJvb21oID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KHJvb21IZWlnaHRbMF0sIHJvb21IZWlnaHRbMV0pO1xyXG5cclxuXHRcdFx0aWYgKGogPiAwKSB7XHJcblx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tpXVtqLTFdO1xyXG5cdFx0XHRcdHdoaWxlIChzeSAtIChvdGhlclJvb21bXCJ5XCJdICsgb3RoZXJSb29tW1wiaGVpZ2h0XCJdICkgPCAzKSB7XHJcblx0XHRcdFx0XHRzeSsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGkgPiAwKSB7XHJcblx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tpLTFdW2pdO1xyXG5cdFx0XHRcdHdoaWxlKHN4IC0gKG90aGVyUm9vbVtcInhcIl0gKyBvdGhlclJvb21bXCJ3aWR0aFwiXSkgPCAzKSB7XHJcblx0XHRcdFx0XHRzeCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHN4T2Zmc2V0ID0gTWF0aC5yb3VuZChST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgY3dwLXJvb213KS8yKTtcclxuXHRcdFx0dmFyIHN5T2Zmc2V0ID0gTWF0aC5yb3VuZChST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgY2hwLXJvb21oKS8yKTtcclxuXHJcblx0XHRcdHdoaWxlIChzeCArIHN4T2Zmc2V0ICsgcm9vbXcgPj0gdykge1xyXG5cdFx0XHRcdGlmKHN4T2Zmc2V0KSB7XHJcblx0XHRcdFx0XHRzeE9mZnNldC0tO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyb29tdy0tO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0d2hpbGUgKHN5ICsgc3lPZmZzZXQgKyByb29taCA+PSBoKSB7XHJcblx0XHRcdFx0aWYoc3lPZmZzZXQpIHtcclxuXHRcdFx0XHRcdHN5T2Zmc2V0LS07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJvb21oLS07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzeCA9IHN4ICsgc3hPZmZzZXQ7XHJcblx0XHRcdHN5ID0gc3kgKyBzeU9mZnNldDtcclxuXHJcblx0XHRcdHRoaXMucm9vbXNbaV1bal1bXCJ4XCJdID0gc3g7XHJcblx0XHRcdHRoaXMucm9vbXNbaV1bal1bXCJ5XCJdID0gc3k7XHJcblx0XHRcdHRoaXMucm9vbXNbaV1bal1bXCJ3aWR0aFwiXSA9IHJvb213O1xyXG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wiaGVpZ2h0XCJdID0gcm9vbWg7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpaSA9IHN4OyBpaSA8IHN4ICsgcm9vbXc7IGlpKyspIHtcclxuXHRcdFx0XHRmb3IgKHZhciBqaiA9IHN5OyBqaiA8IHN5ICsgcm9vbWg7IGpqKyspIHtcclxuXHRcdFx0XHRcdHRoaXMubWFwW2lpXVtqal0gPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9nZXRXYWxsUG9zaXRpb24gPSBmdW5jdGlvbiAoYVJvb20sIGFEaXJlY3Rpb24pIHtcclxuXHR2YXIgcng7XHJcblx0dmFyIHJ5O1xyXG5cdHZhciBkb29yO1xyXG5cclxuXHRpZiAoYURpcmVjdGlvbiA9PSAxIHx8IGFEaXJlY3Rpb24gPT0gMykge1xyXG5cdFx0cnggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQoYVJvb21bXCJ4XCJdICsgMSwgYVJvb21bXCJ4XCJdICsgYVJvb21bXCJ3aWR0aFwiXSAtIDIpO1xyXG5cdFx0aWYgKGFEaXJlY3Rpb24gPT0gMSkge1xyXG5cdFx0XHRyeSA9IGFSb29tW1wieVwiXSAtIDI7XHJcblx0XHRcdGRvb3IgPSByeSArIDE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyeSA9IGFSb29tW1wieVwiXSArIGFSb29tW1wiaGVpZ2h0XCJdICsgMTtcclxuXHRcdFx0ZG9vciA9IHJ5IC0xO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubWFwW3J4XVtkb29yXSA9IDA7IC8vIGknbSBub3Qgc2V0dGluZyBhIHNwZWNpZmljICdkb29yJyB0aWxlIHZhbHVlIHJpZ2h0IG5vdywganVzdCBlbXB0eSBzcGFjZS5cclxuXHJcblx0fSBlbHNlIGlmIChhRGlyZWN0aW9uID09IDIgfHwgYURpcmVjdGlvbiA9PSA0KSB7XHJcblx0XHRyeSA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChhUm9vbVtcInlcIl0gKyAxLCBhUm9vbVtcInlcIl0gKyBhUm9vbVtcImhlaWdodFwiXSAtIDIpO1xyXG5cdFx0aWYoYURpcmVjdGlvbiA9PSAyKSB7XHJcblx0XHRcdHJ4ID0gYVJvb21bXCJ4XCJdICsgYVJvb21bXCJ3aWR0aFwiXSArIDE7XHJcblx0XHRcdGRvb3IgPSByeCAtIDE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyeCA9IGFSb29tW1wieFwiXSAtIDI7XHJcblx0XHRcdGRvb3IgPSByeCArIDE7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5tYXBbZG9vcl1bcnldID0gMDsgLy8gaSdtIG5vdCBzZXR0aW5nIGEgc3BlY2lmaWMgJ2Rvb3InIHRpbGUgdmFsdWUgcmlnaHQgbm93LCBqdXN0IGVtcHR5IHNwYWNlLlxyXG5cclxuXHR9XHJcblx0cmV0dXJuIFtyeCwgcnldO1xyXG59O1xyXG5cclxuLyoqKlxyXG4qIEBwYXJhbSBzdGFydFBvc2l0aW9uIGEgMiBlbGVtZW50IGFycmF5XHJcbiogQHBhcmFtIGVuZFBvc2l0aW9uIGEgMiBlbGVtZW50IGFycmF5XHJcbiovXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9kcmF3Q29ycmlkb3IgPSBmdW5jdGlvbiAoc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24pIHtcclxuXHR2YXIgeE9mZnNldCA9IGVuZFBvc2l0aW9uWzBdIC0gc3RhcnRQb3NpdGlvblswXTtcclxuXHR2YXIgeU9mZnNldCA9IGVuZFBvc2l0aW9uWzFdIC0gc3RhcnRQb3NpdGlvblsxXTtcclxuXHJcblx0dmFyIHhwb3MgPSBzdGFydFBvc2l0aW9uWzBdO1xyXG5cdHZhciB5cG9zID0gc3RhcnRQb3NpdGlvblsxXTtcclxuXHJcblx0dmFyIHRlbXBEaXN0O1xyXG5cdHZhciB4RGlyO1xyXG5cdHZhciB5RGlyO1xyXG5cclxuXHR2YXIgbW92ZTsgLy8gMiBlbGVtZW50IGFycmF5LCBlbGVtZW50IDAgaXMgdGhlIGRpcmVjdGlvbiwgZWxlbWVudCAxIGlzIHRoZSB0b3RhbCB2YWx1ZSB0byBtb3ZlLlxyXG5cdHZhciBtb3ZlcyA9IFtdOyAvLyBhIGxpc3Qgb2YgMiBlbGVtZW50IGFycmF5c1xyXG5cclxuXHR2YXIgeEFicyA9IE1hdGguYWJzKHhPZmZzZXQpO1xyXG5cdHZhciB5QWJzID0gTWF0aC5hYnMoeU9mZnNldCk7XHJcblxyXG5cdHZhciBwZXJjZW50ID0gUk9ULlJORy5nZXRVbmlmb3JtKCk7IC8vIHVzZWQgdG8gc3BsaXQgdGhlIG1vdmUgYXQgZGlmZmVyZW50IHBsYWNlcyBhbG9uZyB0aGUgbG9uZyBheGlzXHJcblx0dmFyIGZpcnN0SGFsZiA9IHBlcmNlbnQ7XHJcblx0dmFyIHNlY29uZEhhbGYgPSAxIC0gcGVyY2VudDtcclxuXHJcblx0eERpciA9IHhPZmZzZXQgPiAwID8gMiA6IDY7XHJcblx0eURpciA9IHlPZmZzZXQgPiAwID8gNCA6IDA7XHJcblxyXG5cdGlmICh4QWJzIDwgeUFicykge1xyXG5cdFx0Ly8gbW92ZSBmaXJzdEhhbGYgb2YgdGhlIHkgb2Zmc2V0XHJcblx0XHR0ZW1wRGlzdCA9IE1hdGguY2VpbCh5QWJzICogZmlyc3RIYWxmKTtcclxuXHRcdG1vdmVzLnB1c2goW3lEaXIsIHRlbXBEaXN0XSk7XHJcblx0XHQvLyBtb3ZlIGFsbCB0aGUgeCBvZmZzZXRcclxuXHRcdG1vdmVzLnB1c2goW3hEaXIsIHhBYnNdKTtcclxuXHRcdC8vIG1vdmUgc2VuZEhhbGYgb2YgdGhlICB5IG9mZnNldFxyXG5cdFx0dGVtcERpc3QgPSBNYXRoLmZsb29yKHlBYnMgKiBzZWNvbmRIYWxmKTtcclxuXHRcdG1vdmVzLnB1c2goW3lEaXIsIHRlbXBEaXN0XSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdC8vICBtb3ZlIGZpcnN0SGFsZiBvZiB0aGUgeCBvZmZzZXRcclxuXHRcdHRlbXBEaXN0ID0gTWF0aC5jZWlsKHhBYnMgKiBmaXJzdEhhbGYpO1xyXG5cdFx0bW92ZXMucHVzaChbeERpciwgdGVtcERpc3RdKTtcclxuXHRcdC8vIG1vdmUgYWxsIHRoZSB5IG9mZnNldFxyXG5cdFx0bW92ZXMucHVzaChbeURpciwgeUFic10pO1xyXG5cdFx0Ly8gbW92ZSBzZWNvbmRIYWxmIG9mIHRoZSB4IG9mZnNldC5cclxuXHRcdHRlbXBEaXN0ID0gTWF0aC5mbG9vcih4QWJzICogc2Vjb25kSGFsZik7XHJcblx0XHRtb3Zlcy5wdXNoKFt4RGlyLCB0ZW1wRGlzdF0pO1xyXG5cdH1cclxuXHJcblx0dGhpcy5tYXBbeHBvc11beXBvc10gPSAwO1xyXG5cclxuXHR3aGlsZSAobW92ZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0bW92ZSA9IG1vdmVzLnBvcCgpO1xyXG5cdFx0d2hpbGUgKG1vdmVbMV0gPiAwKSB7XHJcblx0XHRcdHhwb3MgKz0gUk9ULkRJUlNbOF1bbW92ZVswXV1bMF07XHJcblx0XHRcdHlwb3MgKz0gUk9ULkRJUlNbOF1bbW92ZVswXV1bMV07XHJcblx0XHRcdHRoaXMubWFwW3hwb3NdW3lwb3NdID0gMDtcclxuXHRcdFx0bW92ZVsxXSA9IG1vdmVbMV0gLSAxO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jcmVhdGVDb3JyaWRvcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly8gRHJhdyBDb3JyaWRvcnMgYmV0d2VlbiBjb25uZWN0ZWQgcm9vbXNcclxuXHJcblx0dmFyIGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XHJcblx0dmFyIGNoID0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0O1xyXG5cdHZhciByb29tO1xyXG5cdHZhciBjb25uZWN0aW9uO1xyXG5cdHZhciBvdGhlclJvb207XHJcblx0dmFyIHdhbGw7XHJcblx0dmFyIG90aGVyV2FsbDtcclxuXHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjdzsgaSsrKSB7XHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNoOyBqKyspIHtcclxuXHRcdFx0cm9vbSA9IHRoaXMucm9vbXNbaV1bal07XHJcblxyXG5cdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGg7IGsrKykge1xyXG5cclxuXHRcdFx0XHRjb25uZWN0aW9uID0gcm9vbVtcImNvbm5lY3Rpb25zXCJdW2tdO1xyXG5cclxuXHRcdFx0XHRvdGhlclJvb20gPSB0aGlzLnJvb21zW2Nvbm5lY3Rpb25bMF1dW2Nvbm5lY3Rpb25bMV1dO1xyXG5cclxuXHRcdFx0XHQvLyBmaWd1cmUgb3V0IHdoYXQgd2FsbCBvdXIgY29ycmlkb3Igd2lsbCBzdGFydCBvbmUuXHJcblx0XHRcdFx0Ly8gZmlndXJlIG91dCB3aGF0IHdhbGwgb3VyIGNvcnJpZG9yIHdpbGwgZW5kIG9uLlxyXG5cdFx0XHRcdGlmIChvdGhlclJvb21bXCJjZWxseFwiXSA+IHJvb21bXCJjZWxseFwiXSkge1xyXG5cdFx0XHRcdFx0d2FsbCA9IDI7XHJcblx0XHRcdFx0XHRvdGhlcldhbGwgPSA0O1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAob3RoZXJSb29tW1wiY2VsbHhcIl0gPCByb29tW1wiY2VsbHhcIl0pIHtcclxuXHRcdFx0XHRcdHdhbGwgPSA0O1xyXG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gMjtcclxuXHRcdFx0XHR9IGVsc2UgaWYob3RoZXJSb29tW1wiY2VsbHlcIl0gPiByb29tW1wiY2VsbHlcIl0pIHtcclxuXHRcdFx0XHRcdHdhbGwgPSAzO1xyXG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gMTtcclxuXHRcdFx0XHR9IGVsc2UgaWYob3RoZXJSb29tW1wiY2VsbHlcIl0gPCByb29tW1wiY2VsbHlcIl0pIHtcclxuXHRcdFx0XHRcdHdhbGwgPSAxO1xyXG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gMztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuX2RyYXdDb3JyaWRvcih0aGlzLl9nZXRXYWxsUG9zaXRpb24ocm9vbSwgd2FsbCksIHRoaXMuX2dldFdhbGxQb3NpdGlvbihvdGhlclJvb20sIG90aGVyV2FsbCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG4vKipcclxuICogQGNsYXNzIER1bmdlb24gZmVhdHVyZTsgaGFzIG93biAuY3JlYXRlKCkgbWV0aG9kXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUgPSBmdW5jdGlvbigpIHt9O1xyXG5ST1QuTWFwLkZlYXR1cmUucHJvdG90eXBlLmlzVmFsaWQgPSBmdW5jdGlvbihjYW5CZUR1Z0NhbGxiYWNrKSB7fTtcclxuUk9ULk1hcC5GZWF0dXJlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihkaWdDYWxsYmFjaykge307XHJcblJPVC5NYXAuRmVhdHVyZS5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbigpIHt9O1xyXG5ST1QuTWFwLkZlYXR1cmUuY3JlYXRlUmFuZG9tQXQgPSBmdW5jdGlvbih4LCB5LCBkeCwgZHksIG9wdGlvbnMpIHt9O1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBSb29tXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwLkZlYXR1cmVcclxuICogQHBhcmFtIHtpbnR9IHgxXHJcbiAqIEBwYXJhbSB7aW50fSB5MVxyXG4gKiBAcGFyYW0ge2ludH0geDJcclxuICogQHBhcmFtIHtpbnR9IHkyXHJcbiAqIEBwYXJhbSB7aW50fSBbZG9vclhdXHJcbiAqIEBwYXJhbSB7aW50fSBbZG9vclldXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbSA9IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyLCBkb29yWCwgZG9vclkpIHtcclxuXHR0aGlzLl94MSA9IHgxO1xyXG5cdHRoaXMuX3kxID0geTE7XHJcblx0dGhpcy5feDIgPSB4MjtcclxuXHR0aGlzLl95MiA9IHkyO1xyXG5cdHRoaXMuX2Rvb3JzID0ge307XHJcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiA0KSB7IHRoaXMuYWRkRG9vcihkb29yWCwgZG9vclkpOyB9XHJcbn07XHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLmV4dGVuZChST1QuTWFwLkZlYXR1cmUpO1xyXG5cclxuLyoqXHJcbiAqIFJvb20gb2YgcmFuZG9tIHNpemUsIHdpdGggYSBnaXZlbiBkb29ycyBhbmQgZGlyZWN0aW9uXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb21BdCA9IGZ1bmN0aW9uKHgsIHksIGR4LCBkeSwgb3B0aW9ucykge1xyXG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21XaWR0aFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tV2lkdGhbMV07XHJcblx0dmFyIHdpZHRoID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tSGVpZ2h0WzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21IZWlnaHRbMV07XHJcblx0dmFyIGhlaWdodCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0aWYgKGR4ID09IDEpIHsgLyogdG8gdGhlIHJpZ2h0ICovXHJcblx0XHR2YXIgeTIgPSB5IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIGhlaWdodCk7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoeCsxLCB5MiwgeCt3aWR0aCwgeTIraGVpZ2h0LTEsIHgsIHkpO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoZHggPT0gLTEpIHsgLyogdG8gdGhlIGxlZnQgKi9cclxuXHRcdHZhciB5MiA9IHkgLSBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogaGVpZ2h0KTtcclxuXHRcdHJldHVybiBuZXcgdGhpcyh4LXdpZHRoLCB5MiwgeC0xLCB5MitoZWlnaHQtMSwgeCwgeSk7XHJcblx0fVxyXG5cclxuXHRpZiAoZHkgPT0gMSkgeyAvKiB0byB0aGUgYm90dG9tICovXHJcblx0XHR2YXIgeDIgPSB4IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIHdpZHRoKTtcclxuXHRcdHJldHVybiBuZXcgdGhpcyh4MiwgeSsxLCB4Mit3aWR0aC0xLCB5K2hlaWdodCwgeCwgeSk7XHJcblx0fVxyXG5cclxuXHRpZiAoZHkgPT0gLTEpIHsgLyogdG8gdGhlIHRvcCAqL1xyXG5cdFx0dmFyIHgyID0geCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoeDIsIHktaGVpZ2h0LCB4Mit3aWR0aC0xLCB5LTEsIHgsIHkpO1xyXG5cdH1cclxuXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZHggb3IgZHkgbXVzdCBiZSAxIG9yIC0xXCIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJvb20gb2YgcmFuZG9tIHNpemUsIHBvc2l0aW9uZWQgYXJvdW5kIGNlbnRlciBjb29yZHNcclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbUNlbnRlciA9IGZ1bmN0aW9uKGN4LCBjeSwgb3B0aW9ucykge1xyXG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21XaWR0aFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tV2lkdGhbMV07XHJcblx0dmFyIHdpZHRoID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tSGVpZ2h0WzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21IZWlnaHRbMV07XHJcblx0dmFyIGhlaWdodCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblxyXG5cdHZhciB4MSA9IGN4IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSp3aWR0aCk7XHJcblx0dmFyIHkxID0gY3kgLSBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKmhlaWdodCk7XHJcblx0dmFyIHgyID0geDEgKyB3aWR0aCAtIDE7XHJcblx0dmFyIHkyID0geTEgKyBoZWlnaHQgLSAxO1xyXG5cclxuXHRyZXR1cm4gbmV3IHRoaXMoeDEsIHkxLCB4MiwgeTIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJvb20gb2YgcmFuZG9tIHNpemUgd2l0aGluIGEgZ2l2ZW4gZGltZW5zaW9uc1xyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQsIG9wdGlvbnMpIHtcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbVdpZHRoWzFdO1xyXG5cdHZhciB3aWR0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbUhlaWdodFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xyXG5cdHZhciBoZWlnaHQgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdHZhciBsZWZ0ID0gYXZhaWxXaWR0aCAtIHdpZHRoIC0gMTtcclxuXHR2YXIgdG9wID0gYXZhaWxIZWlnaHQgLSBoZWlnaHQgLSAxO1xyXG5cclxuXHR2YXIgeDEgPSAxICsgTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSpsZWZ0KTtcclxuXHR2YXIgeTEgPSAxICsgTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSp0b3ApO1xyXG5cdHZhciB4MiA9IHgxICsgd2lkdGggLSAxO1xyXG5cdHZhciB5MiA9IHkxICsgaGVpZ2h0IC0gMTtcclxuXHJcblx0cmV0dXJuIG5ldyB0aGlzKHgxLCB5MSwgeDIsIHkyKTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5hZGREb29yID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdHRoaXMuX2Rvb3JzW3grXCIsXCIreV0gPSAxO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259XHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0RG9vcnMgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdGZvciAodmFyIGtleSBpbiB0aGlzLl9kb29ycykge1xyXG5cdFx0dmFyIHBhcnRzID0ga2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdGNhbGxiYWNrKHBhcnNlSW50KHBhcnRzWzBdKSwgcGFyc2VJbnQocGFydHNbMV0pKTtcclxuXHR9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuY2xlYXJEb29ycyA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2Rvb3JzID0ge307XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuYWRkRG9vcnMgPSBmdW5jdGlvbihpc1dhbGxDYWxsYmFjaykge1xyXG5cdHZhciBsZWZ0ID0gdGhpcy5feDEtMTtcclxuXHR2YXIgcmlnaHQgPSB0aGlzLl94MisxO1xyXG5cdHZhciB0b3AgPSB0aGlzLl95MS0xO1xyXG5cdHZhciBib3R0b20gPSB0aGlzLl95MisxO1xyXG5cclxuXHRmb3IgKHZhciB4PWxlZnQ7IHg8PXJpZ2h0OyB4KyspIHtcclxuXHRcdGZvciAodmFyIHk9dG9wOyB5PD1ib3R0b207IHkrKykge1xyXG5cdFx0XHRpZiAoeCAhPSBsZWZ0ICYmIHggIT0gcmlnaHQgJiYgeSAhPSB0b3AgJiYgeSAhPSBib3R0b20pIHsgY29udGludWU7IH1cclxuXHRcdFx0aWYgKGlzV2FsbENhbGxiYWNrKHgsIHkpKSB7IGNvbnRpbnVlOyB9XHJcblxyXG5cdFx0XHR0aGlzLmFkZERvb3IoeCwgeSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uKCkge1xyXG5cdGNvbnNvbGUubG9nKFwicm9vbVwiLCB0aGlzLl94MSwgdGhpcy5feTEsIHRoaXMuX3gyLCB0aGlzLl95Mik7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuaXNWYWxpZCA9IGZ1bmN0aW9uKGlzV2FsbENhbGxiYWNrLCBjYW5CZUR1Z0NhbGxiYWNrKSB7IFxyXG5cdHZhciBsZWZ0ID0gdGhpcy5feDEtMTtcclxuXHR2YXIgcmlnaHQgPSB0aGlzLl94MisxO1xyXG5cdHZhciB0b3AgPSB0aGlzLl95MS0xO1xyXG5cdHZhciBib3R0b20gPSB0aGlzLl95MisxO1xyXG5cdFxyXG5cdGZvciAodmFyIHg9bGVmdDsgeDw9cmlnaHQ7IHgrKykge1xyXG5cdFx0Zm9yICh2YXIgeT10b3A7IHk8PWJvdHRvbTsgeSsrKSB7XHJcblx0XHRcdGlmICh4ID09IGxlZnQgfHwgeCA9PSByaWdodCB8fCB5ID09IHRvcCB8fCB5ID09IGJvdHRvbSkge1xyXG5cdFx0XHRcdGlmICghaXNXYWxsQ2FsbGJhY2soeCwgeSkpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKCFjYW5CZUR1Z0NhbGxiYWNrKHgsIHkpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaWdDYWxsYmFjayBEaWcgY2FsbGJhY2sgd2l0aCBhIHNpZ25hdHVyZSAoeCwgeSwgdmFsdWUpLiBWYWx1ZXM6IDAgPSBlbXB0eSwgMSA9IHdhbGwsIDIgPSBkb29yLiBNdWx0aXBsZSBkb29ycyBhcmUgYWxsb3dlZC5cclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihkaWdDYWxsYmFjaykgeyBcclxuXHR2YXIgbGVmdCA9IHRoaXMuX3gxLTE7XHJcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcclxuXHR2YXIgdG9wID0gdGhpcy5feTEtMTtcclxuXHR2YXIgYm90dG9tID0gdGhpcy5feTIrMTtcclxuXHRcclxuXHR2YXIgdmFsdWUgPSAwO1xyXG5cdGZvciAodmFyIHg9bGVmdDsgeDw9cmlnaHQ7IHgrKykge1xyXG5cdFx0Zm9yICh2YXIgeT10b3A7IHk8PWJvdHRvbTsgeSsrKSB7XHJcblx0XHRcdGlmICh4K1wiLFwiK3kgaW4gdGhpcy5fZG9vcnMpIHtcclxuXHRcdFx0XHR2YWx1ZSA9IDI7XHJcblx0XHRcdH0gZWxzZSBpZiAoeCA9PSBsZWZ0IHx8IHggPT0gcmlnaHQgfHwgeSA9PSB0b3AgfHwgeSA9PSBib3R0b20pIHtcclxuXHRcdFx0XHR2YWx1ZSA9IDE7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFsdWUgPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRpZ0NhbGxiYWNrKHgsIHksIHZhbHVlKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0Q2VudGVyID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIFtNYXRoLnJvdW5kKCh0aGlzLl94MSArIHRoaXMuX3gyKS8yKSwgTWF0aC5yb3VuZCgodGhpcy5feTEgKyB0aGlzLl95MikvMildO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldExlZnQgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5feDE7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0UmlnaHQgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5feDI7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0VG9wID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3kxO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldEJvdHRvbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl95MjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ29ycmlkb3JcclxuICogQGF1Z21lbnRzIFJPVC5NYXAuRmVhdHVyZVxyXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRYXHJcbiAqIEBwYXJhbSB7aW50fSBzdGFydFlcclxuICogQHBhcmFtIHtpbnR9IGVuZFhcclxuICogQHBhcmFtIHtpbnR9IGVuZFlcclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvciA9IGZ1bmN0aW9uKHN0YXJ0WCwgc3RhcnRZLCBlbmRYLCBlbmRZKSB7XHJcblx0dGhpcy5fc3RhcnRYID0gc3RhcnRYO1xyXG5cdHRoaXMuX3N0YXJ0WSA9IHN0YXJ0WTtcclxuXHR0aGlzLl9lbmRYID0gZW5kWDsgXHJcblx0dGhpcy5fZW5kWSA9IGVuZFk7XHJcblx0dGhpcy5fZW5kc1dpdGhBV2FsbCA9IHRydWU7XHJcbn07XHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5leHRlbmQoUk9ULk1hcC5GZWF0dXJlKTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5jcmVhdGVSYW5kb21BdCA9IGZ1bmN0aW9uKHgsIHksIGR4LCBkeSwgb3B0aW9ucykge1xyXG5cdHZhciBtaW4gPSBvcHRpb25zLmNvcnJpZG9yTGVuZ3RoWzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLmNvcnJpZG9yTGVuZ3RoWzFdO1xyXG5cdHZhciBsZW5ndGggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgdGhpcyh4LCB5LCB4ICsgZHgqbGVuZ3RoLCB5ICsgZHkqbGVuZ3RoKTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbigpIHtcclxuXHRjb25zb2xlLmxvZyhcImNvcnJpZG9yXCIsIHRoaXMuX3N0YXJ0WCwgdGhpcy5fc3RhcnRZLCB0aGlzLl9lbmRYLCB0aGlzLl9lbmRZKTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuaXNWYWxpZCA9IGZ1bmN0aW9uKGlzV2FsbENhbGxiYWNrLCBjYW5CZUR1Z0NhbGxiYWNrKXsgXHJcblx0dmFyIHN4ID0gdGhpcy5fc3RhcnRYO1xyXG5cdHZhciBzeSA9IHRoaXMuX3N0YXJ0WTtcclxuXHR2YXIgZHggPSB0aGlzLl9lbmRYLXN4O1xyXG5cdHZhciBkeSA9IHRoaXMuX2VuZFktc3k7XHJcblx0dmFyIGxlbmd0aCA9IDEgKyBNYXRoLm1heChNYXRoLmFicyhkeCksIE1hdGguYWJzKGR5KSk7XHJcblx0XHJcblx0aWYgKGR4KSB7IGR4ID0gZHgvTWF0aC5hYnMoZHgpOyB9XHJcblx0aWYgKGR5KSB7IGR5ID0gZHkvTWF0aC5hYnMoZHkpOyB9XHJcblx0dmFyIG54ID0gZHk7XHJcblx0dmFyIG55ID0gLWR4O1xyXG5cdFxyXG5cdHZhciBvayA9IHRydWU7XHJcblx0Zm9yICh2YXIgaT0wOyBpPGxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgeCA9IHN4ICsgaSpkeDtcclxuXHRcdHZhciB5ID0gc3kgKyBpKmR5O1xyXG5cclxuXHRcdGlmICghY2FuQmVEdWdDYWxsYmFjayggICAgIHgsICAgICAgeSkpIHsgb2sgPSBmYWxzZTsgfVxyXG5cdFx0aWYgKCFpc1dhbGxDYWxsYmFjayAgKHggKyBueCwgeSArIG55KSkgeyBvayA9IGZhbHNlOyB9XHJcblx0XHRpZiAoIWlzV2FsbENhbGxiYWNrICAoeCAtIG54LCB5IC0gbnkpKSB7IG9rID0gZmFsc2U7IH1cclxuXHRcdFxyXG5cdFx0aWYgKCFvaykge1xyXG5cdFx0XHRsZW5ndGggPSBpO1xyXG5cdFx0XHR0aGlzLl9lbmRYID0geC1keDtcclxuXHRcdFx0dGhpcy5fZW5kWSA9IHktZHk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvKipcclxuXHQgKiBJZiB0aGUgbGVuZ3RoIGRlZ2VuZXJhdGVkLCB0aGlzIGNvcnJpZG9yIG1pZ2h0IGJlIGludmFsaWRcclxuXHQgKi9cclxuXHQgXHJcblx0Lyogbm90IHN1cHBvcnRlZCAqL1xyXG5cdGlmIChsZW5ndGggPT0gMCkgeyByZXR1cm4gZmFsc2U7IH0gXHJcblx0XHJcblx0IC8qIGxlbmd0aCAxIGFsbG93ZWQgb25seSBpZiB0aGUgbmV4dCBzcGFjZSBpcyBlbXB0eSAqL1xyXG5cdGlmIChsZW5ndGggPT0gMSAmJiBpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHgsIHRoaXMuX2VuZFkgKyBkeSkpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHJcblx0LyoqXHJcblx0ICogV2UgZG8gbm90IHdhbnQgdGhlIGNvcnJpZG9yIHRvIGNyYXNoIGludG8gYSBjb3JuZXIgb2YgYSByb29tO1xyXG5cdCAqIGlmIGFueSBvZiB0aGUgZW5kaW5nIGNvcm5lcnMgaXMgZW1wdHksIHRoZSBOKzF0aCBjZWxsIG9mIHRoaXMgY29ycmlkb3IgbXVzdCBiZSBlbXB0eSB0b28uXHJcblx0ICogXHJcblx0ICogU2l0dWF0aW9uOlxyXG5cdCAqICMjIyMjIyMxXHJcblx0ICogLi4uLi4uLj9cclxuXHQgKiAjIyMjIyMjMlxyXG5cdCAqIFxyXG5cdCAqIFRoZSBjb3JyaWRvciB3YXMgZHVnIGZyb20gbGVmdCB0byByaWdodC5cclxuXHQgKiAxLCAyIC0gcHJvYmxlbWF0aWMgY29ybmVycywgPyA9IE4rMXRoIGNlbGwgKG5vdCBkdWcpXHJcblx0ICovXHJcblx0dmFyIGZpcnN0Q29ybmVyQmFkID0gIWlzV2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCArIG54LCB0aGlzLl9lbmRZICsgZHkgKyBueSk7XHJcblx0dmFyIHNlY29uZENvcm5lckJhZCA9ICFpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHggLSBueCwgdGhpcy5fZW5kWSArIGR5IC0gbnkpO1xyXG5cdHRoaXMuX2VuZHNXaXRoQVdhbGwgPSBpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHgsIHRoaXMuX2VuZFkgKyBkeSk7XHJcblx0aWYgKChmaXJzdENvcm5lckJhZCB8fCBzZWNvbmRDb3JuZXJCYWQpICYmIHRoaXMuX2VuZHNXaXRoQVdhbGwpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblxyXG5cdHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpZ0NhbGxiYWNrIERpZyBjYWxsYmFjayB3aXRoIGEgc2lnbmF0dXJlICh4LCB5LCB2YWx1ZSkuIFZhbHVlczogMCA9IGVtcHR5LlxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihkaWdDYWxsYmFjaykgeyBcclxuXHR2YXIgc3ggPSB0aGlzLl9zdGFydFg7XHJcblx0dmFyIHN5ID0gdGhpcy5fc3RhcnRZO1xyXG5cdHZhciBkeCA9IHRoaXMuX2VuZFgtc3g7XHJcblx0dmFyIGR5ID0gdGhpcy5fZW5kWS1zeTtcclxuXHR2YXIgbGVuZ3RoID0gMStNYXRoLm1heChNYXRoLmFicyhkeCksIE1hdGguYWJzKGR5KSk7XHJcblx0XHJcblx0aWYgKGR4KSB7IGR4ID0gZHgvTWF0aC5hYnMoZHgpOyB9XHJcblx0aWYgKGR5KSB7IGR5ID0gZHkvTWF0aC5hYnMoZHkpOyB9XHJcblx0dmFyIG54ID0gZHk7XHJcblx0dmFyIG55ID0gLWR4O1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDsgaTxsZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHggPSBzeCArIGkqZHg7XHJcblx0XHR2YXIgeSA9IHN5ICsgaSpkeTtcclxuXHRcdGRpZ0NhbGxiYWNrKHgsIHksIDApO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuY3JlYXRlUHJpb3JpdHlXYWxscyA9IGZ1bmN0aW9uKHByaW9yaXR5V2FsbENhbGxiYWNrKSB7XHJcblx0aWYgKCF0aGlzLl9lbmRzV2l0aEFXYWxsKSB7IHJldHVybjsgfVxyXG5cclxuXHR2YXIgc3ggPSB0aGlzLl9zdGFydFg7XHJcblx0dmFyIHN5ID0gdGhpcy5fc3RhcnRZO1xyXG5cclxuXHR2YXIgZHggPSB0aGlzLl9lbmRYLXN4O1xyXG5cdHZhciBkeSA9IHRoaXMuX2VuZFktc3k7XHJcblx0aWYgKGR4KSB7IGR4ID0gZHgvTWF0aC5hYnMoZHgpOyB9XHJcblx0aWYgKGR5KSB7IGR5ID0gZHkvTWF0aC5hYnMoZHkpOyB9XHJcblx0dmFyIG54ID0gZHk7XHJcblx0dmFyIG55ID0gLWR4O1xyXG5cclxuXHRwcmlvcml0eVdhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHgsIHRoaXMuX2VuZFkgKyBkeSk7XHJcblx0cHJpb3JpdHlXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIG54LCB0aGlzLl9lbmRZICsgbnkpO1xyXG5cdHByaW9yaXR5V2FsbENhbGxiYWNrKHRoaXMuX2VuZFggLSBueCwgdGhpcy5fZW5kWSAtIG55KTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBCYXNlIG5vaXNlIGdlbmVyYXRvclxyXG4gKi9cclxuUk9ULk5vaXNlID0gZnVuY3Rpb24oKSB7XHJcbn07XHJcblxyXG5ST1QuTm9pc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHgsIHkpIHt9O1xyXG4vKipcclxuICogQSBzaW1wbGUgMmQgaW1wbGVtZW50YXRpb24gb2Ygc2ltcGxleCBub2lzZSBieSBPbmRyZWogWmFyYVxyXG4gKlxyXG4gKiBCYXNlZCBvbiBhIHNwZWVkLWltcHJvdmVkIHNpbXBsZXggbm9pc2UgYWxnb3JpdGhtIGZvciAyRCwgM0QgYW5kIDREIGluIEphdmEuXHJcbiAqIFdoaWNoIGlzIGJhc2VkIG9uIGV4YW1wbGUgY29kZSBieSBTdGVmYW4gR3VzdGF2c29uIChzdGVndUBpdG4ubGl1LnNlKS5cclxuICogV2l0aCBPcHRpbWlzYXRpb25zIGJ5IFBldGVyIEVhc3RtYW4gKHBlYXN0bWFuQGRyaXp6bGUuc3RhbmZvcmQuZWR1KS5cclxuICogQmV0dGVyIHJhbmsgb3JkZXJpbmcgbWV0aG9kIGJ5IFN0ZWZhbiBHdXN0YXZzb24gaW4gMjAxMi5cclxuICovXHJcblxyXG4vKipcclxuICogQGNsYXNzIDJEIHNpbXBsZXggbm9pc2UgZ2VuZXJhdG9yXHJcbiAqIEBwYXJhbSB7aW50fSBbZ3JhZGllbnRzPTI1Nl0gUmFuZG9tIGdyYWRpZW50c1xyXG4gKi9cclxuUk9ULk5vaXNlLlNpbXBsZXggPSBmdW5jdGlvbihncmFkaWVudHMpIHtcclxuXHRST1QuTm9pc2UuY2FsbCh0aGlzKTtcclxuXHJcblx0dGhpcy5fRjIgPSAwLjUgKiAoTWF0aC5zcXJ0KDMpIC0gMSk7XHJcblx0dGhpcy5fRzIgPSAoMyAtIE1hdGguc3FydCgzKSkgLyA2O1xyXG5cclxuXHR0aGlzLl9ncmFkaWVudHMgPSBbXHJcblx0XHRbIDAsIC0xXSxcclxuXHRcdFsgMSwgLTFdLFxyXG5cdFx0WyAxLCAgMF0sXHJcblx0XHRbIDEsICAxXSxcclxuXHRcdFsgMCwgIDFdLFxyXG5cdFx0Wy0xLCAgMV0sXHJcblx0XHRbLTEsICAwXSxcclxuXHRcdFstMSwgLTFdXHJcblx0XTtcclxuXHJcblx0dmFyIHBlcm11dGF0aW9ucyA9IFtdO1xyXG5cdHZhciBjb3VudCA9IGdyYWRpZW50cyB8fCAyNTY7XHJcblx0Zm9yICh2YXIgaT0wO2k8Y291bnQ7aSsrKSB7IHBlcm11dGF0aW9ucy5wdXNoKGkpOyB9XHJcblx0cGVybXV0YXRpb25zID0gcGVybXV0YXRpb25zLnJhbmRvbWl6ZSgpO1xyXG5cclxuXHR0aGlzLl9wZXJtcyA9IFtdO1xyXG5cdHRoaXMuX2luZGV4ZXMgPSBbXTtcclxuXHJcblx0Zm9yICh2YXIgaT0wO2k8Mipjb3VudDtpKyspIHtcclxuXHRcdHRoaXMuX3Blcm1zLnB1c2gocGVybXV0YXRpb25zW2kgJSBjb3VudF0pO1xyXG5cdFx0dGhpcy5faW5kZXhlcy5wdXNoKHRoaXMuX3Blcm1zW2ldICUgdGhpcy5fZ3JhZGllbnRzLmxlbmd0aCk7XHJcblx0fVxyXG5cclxufTtcclxuUk9ULk5vaXNlLlNpbXBsZXguZXh0ZW5kKFJPVC5Ob2lzZSk7XHJcblxyXG5ST1QuTm9pc2UuU2ltcGxleC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oeGluLCB5aW4pIHtcclxuXHR2YXIgcGVybXMgPSB0aGlzLl9wZXJtcztcclxuXHR2YXIgaW5kZXhlcyA9IHRoaXMuX2luZGV4ZXM7XHJcblx0dmFyIGNvdW50ID0gcGVybXMubGVuZ3RoLzI7XHJcblx0dmFyIEcyID0gdGhpcy5fRzI7XHJcblxyXG5cdHZhciBuMCA9MCwgbjEgPSAwLCBuMiA9IDAsIGdpOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcclxuXHJcblx0Ly8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxyXG5cdHZhciBzID0gKHhpbiArIHlpbikgKiB0aGlzLl9GMjsgLy8gSGFpcnkgZmFjdG9yIGZvciAyRFxyXG5cdHZhciBpID0gTWF0aC5mbG9vcih4aW4gKyBzKTtcclxuXHR2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XHJcblx0dmFyIHQgPSAoaSArIGopICogRzI7XHJcblx0dmFyIFgwID0gaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5KSBzcGFjZVxyXG5cdHZhciBZMCA9IGogLSB0O1xyXG5cdHZhciB4MCA9IHhpbiAtIFgwOyAvLyBUaGUgeCx5IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxyXG5cdHZhciB5MCA9IHlpbiAtIFkwO1xyXG5cclxuXHQvLyBGb3IgdGhlIDJEIGNhc2UsIHRoZSBzaW1wbGV4IHNoYXBlIGlzIGFuIGVxdWlsYXRlcmFsIHRyaWFuZ2xlLlxyXG5cdC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cclxuXHR2YXIgaTEsIGoxOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgKG1pZGRsZSkgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaikgY29vcmRzXHJcblx0aWYgKHgwID4geTApIHtcclxuXHRcdGkxID0gMTtcclxuXHRcdGoxID0gMDtcclxuXHR9IGVsc2UgeyAvLyBsb3dlciB0cmlhbmdsZSwgWFkgb3JkZXI6ICgwLDApLT4oMSwwKS0+KDEsMSlcclxuXHRcdGkxID0gMDtcclxuXHRcdGoxID0gMTtcclxuXHR9IC8vIHVwcGVyIHRyaWFuZ2xlLCBZWCBvcmRlcjogKDAsMCktPigwLDEpLT4oMSwxKVxyXG5cclxuXHQvLyBBIHN0ZXAgb2YgKDEsMCkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgxLWMsLWMpIGluICh4LHkpLCBhbmRcclxuXHQvLyBhIHN0ZXAgb2YgKDAsMSkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgtYywxLWMpIGluICh4LHkpLCB3aGVyZVxyXG5cdC8vIGMgPSAoMy1zcXJ0KDMpKS82XHJcblx0dmFyIHgxID0geDAgLSBpMSArIEcyOyAvLyBPZmZzZXRzIGZvciBtaWRkbGUgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xyXG5cdHZhciB5MSA9IHkwIC0gajEgKyBHMjtcclxuXHR2YXIgeDIgPSB4MCAtIDEgKyAyKkcyOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcclxuXHR2YXIgeTIgPSB5MCAtIDEgKyAyKkcyO1xyXG5cclxuXHQvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIHRocmVlIHNpbXBsZXggY29ybmVyc1xyXG5cdHZhciBpaSA9IGkubW9kKGNvdW50KTtcclxuXHR2YXIgamogPSBqLm1vZChjb3VudCk7XHJcblxyXG5cdC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcclxuXHR2YXIgdDAgPSAwLjUgLSB4MCp4MCAtIHkwKnkwO1xyXG5cdGlmICh0MCA+PSAwKSB7XHJcblx0XHR0MCAqPSB0MDtcclxuXHRcdGdpID0gaW5kZXhlc1tpaStwZXJtc1tqal1dO1xyXG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xyXG5cdFx0bjAgPSB0MCAqIHQwICogKGdyYWRbMF0gKiB4MCArIGdyYWRbMV0gKiB5MCk7XHJcblx0fVxyXG5cdFxyXG5cdHZhciB0MSA9IDAuNSAtIHgxKngxIC0geTEqeTE7XHJcblx0aWYgKHQxID49IDApIHtcclxuXHRcdHQxICo9IHQxO1xyXG5cdFx0Z2kgPSBpbmRleGVzW2lpK2kxK3Blcm1zW2pqK2oxXV07XHJcblx0XHR2YXIgZ3JhZCA9IHRoaXMuX2dyYWRpZW50c1tnaV07XHJcblx0XHRuMSA9IHQxICogdDEgKiAoZ3JhZFswXSAqIHgxICsgZ3JhZFsxXSAqIHkxKTtcclxuXHR9XHJcblx0XHJcblx0dmFyIHQyID0gMC41IC0geDIqeDIgLSB5Mip5MjtcclxuXHRpZiAodDIgPj0gMCkge1xyXG5cdFx0dDIgKj0gdDI7XHJcblx0XHRnaSA9IGluZGV4ZXNbaWkrMStwZXJtc1tqaisxXV07XHJcblx0XHR2YXIgZ3JhZCA9IHRoaXMuX2dyYWRpZW50c1tnaV07XHJcblx0XHRuMiA9IHQyICogdDIgKiAoZ3JhZFswXSAqIHgyICsgZ3JhZFsxXSAqIHkyKTtcclxuXHR9XHJcblxyXG5cdC8vIEFkZCBjb250cmlidXRpb25zIGZyb20gZWFjaCBjb3JuZXIgdG8gZ2V0IHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cclxuXHQvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXHJcblx0cmV0dXJuIDcwICogKG4wICsgbjEgKyBuMik7XHJcbn1cclxuLyoqXHJcbiAqIEBjbGFzcyBBYnN0cmFjdCBGT1YgYWxnb3JpdGhtXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpZ2h0UGFzc2VzQ2FsbGJhY2sgRG9lcyB0aGUgbGlnaHQgcGFzcyB0aHJvdWdoIHgseT9cclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudG9wb2xvZ3k9OF0gNC82LzhcclxuICovXHJcblJPVC5GT1YgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0dGhpcy5fbGlnaHRQYXNzZXMgPSBsaWdodFBhc3Nlc0NhbGxiYWNrO1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHR0b3BvbG9neTogOFxyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDM2MC1kZWdyZWUgY2lyY2xlXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcblJPVC5GT1YucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge307XHJcblxyXG4vKipcclxuICogUmV0dXJuIGFsbCBuZWlnaGJvcnMgaW4gYSBjb25jZW50cmljIHJpbmdcclxuICogQHBhcmFtIHtpbnR9IGN4IGNlbnRlci14XHJcbiAqIEBwYXJhbSB7aW50fSBjeSBjZW50ZXIteVxyXG4gKiBAcGFyYW0ge2ludH0gciByYW5nZVxyXG4gKi9cclxuUk9ULkZPVi5wcm90b3R5cGUuX2dldENpcmNsZSA9IGZ1bmN0aW9uKGN4LCBjeSwgcikge1xyXG5cdHZhciByZXN1bHQgPSBbXTtcclxuXHR2YXIgZGlycywgY291bnRGYWN0b3IsIHN0YXJ0T2Zmc2V0O1xyXG5cclxuXHRzd2l0Y2ggKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kpIHtcclxuXHRcdGNhc2UgNDpcclxuXHRcdFx0Y291bnRGYWN0b3IgPSAxO1xyXG5cdFx0XHRzdGFydE9mZnNldCA9IFswLCAxXTtcclxuXHRcdFx0ZGlycyA9IFtcclxuXHRcdFx0XHRST1QuRElSU1s4XVs3XSxcclxuXHRcdFx0XHRST1QuRElSU1s4XVsxXSxcclxuXHRcdFx0XHRST1QuRElSU1s4XVszXSxcclxuXHRcdFx0XHRST1QuRElSU1s4XVs1XVxyXG5cdFx0XHRdO1xyXG5cdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSA2OlxyXG5cdFx0XHRkaXJzID0gUk9ULkRJUlNbNl07XHJcblx0XHRcdGNvdW50RmFjdG9yID0gMTtcclxuXHRcdFx0c3RhcnRPZmZzZXQgPSBbLTEsIDFdO1xyXG5cdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSA4OlxyXG5cdFx0XHRkaXJzID0gUk9ULkRJUlNbNF07XHJcblx0XHRcdGNvdW50RmFjdG9yID0gMjtcclxuXHRcdFx0c3RhcnRPZmZzZXQgPSBbLTEsIDFdO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuXHQvKiBzdGFydGluZyBuZWlnaGJvciAqL1xyXG5cdHZhciB4ID0gY3ggKyBzdGFydE9mZnNldFswXSpyO1xyXG5cdHZhciB5ID0gY3kgKyBzdGFydE9mZnNldFsxXSpyO1xyXG5cclxuXHQvKiBjaXJjbGUgKi9cclxuXHRmb3IgKHZhciBpPTA7aTxkaXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPHIqY291bnRGYWN0b3I7aisrKSB7XHJcblx0XHRcdHJlc3VsdC5wdXNoKFt4LCB5XSk7XHJcblx0XHRcdHggKz0gZGlyc1tpXVswXTtcclxuXHRcdFx0eSArPSBkaXJzW2ldWzFdO1xyXG5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgRGlzY3JldGUgc2hhZG93Y2FzdGluZyBhbGdvcml0aG0uIE9ic29sZXRlZCBieSBQcmVjaXNlIHNoYWRvd2Nhc3RpbmcuXHJcbiAqIEBhdWdtZW50cyBST1QuRk9WXHJcbiAqL1xyXG5ST1QuRk9WLkRpc2NyZXRlU2hhZG93Y2FzdGluZyA9IGZ1bmN0aW9uKGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHRST1QuRk9WLmNhbGwodGhpcywgbGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucyk7XHJcbn07XHJcblJPVC5GT1YuRGlzY3JldGVTaGFkb3djYXN0aW5nLmV4dGVuZChST1QuRk9WKTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5GT1YjY29tcHV0ZVxyXG4gKi9cclxuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge1xyXG5cdHZhciBjZW50ZXIgPSB0aGlzLl9jb29yZHM7XHJcblx0dmFyIG1hcCA9IHRoaXMuX21hcDtcclxuXHJcblx0LyogdGhpcyBwbGFjZSBpcyBhbHdheXMgdmlzaWJsZSAqL1xyXG5cdGNhbGxiYWNrKHgsIHksIDAsIDEpO1xyXG5cclxuXHQvKiBzdGFuZGluZyBpbiBhIGRhcmsgcGxhY2UuIEZJWE1FIGlzIHRoaXMgYSBnb29kIGlkZWE/ICAqL1xyXG5cdGlmICghdGhpcy5fbGlnaHRQYXNzZXMoeCwgeSkpIHsgcmV0dXJuOyB9XHJcblx0XHJcblx0Lyogc3RhcnQgYW5kIGVuZCBhbmdsZXMgKi9cclxuXHR2YXIgREFUQSA9IFtdO1xyXG5cdFxyXG5cdHZhciBBLCBCLCBjeCwgY3ksIGJsb2NrcztcclxuXHJcblx0LyogYW5hbHl6ZSBzdXJyb3VuZGluZyBjZWxscyBpbiBjb25jZW50cmljIHJpbmdzLCBzdGFydGluZyBmcm9tIHRoZSBjZW50ZXIgKi9cclxuXHRmb3IgKHZhciByPTE7IHI8PVI7IHIrKykge1xyXG5cdFx0dmFyIG5laWdoYm9ycyA9IHRoaXMuX2dldENpcmNsZSh4LCB5LCByKTtcclxuXHRcdHZhciBhbmdsZSA9IDM2MCAvIG5laWdoYm9ycy5sZW5ndGg7XHJcblxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8bmVpZ2hib3JzLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0Y3ggPSBuZWlnaGJvcnNbaV1bMF07XHJcblx0XHRcdGN5ID0gbmVpZ2hib3JzW2ldWzFdO1xyXG5cdFx0XHRBID0gYW5nbGUgKiAoaSAtIDAuNSk7XHJcblx0XHRcdEIgPSBBICsgYW5nbGU7XHJcblx0XHRcdFxyXG5cdFx0XHRibG9ja3MgPSAhdGhpcy5fbGlnaHRQYXNzZXMoY3gsIGN5KTtcclxuXHRcdFx0aWYgKHRoaXMuX3Zpc2libGVDb29yZHMoTWF0aC5mbG9vcihBKSwgTWF0aC5jZWlsKEIpLCBibG9ja3MsIERBVEEpKSB7IGNhbGxiYWNrKGN4LCBjeSwgciwgMSk7IH1cclxuXHRcdFx0XHJcblx0XHRcdGlmIChEQVRBLmxlbmd0aCA9PSAyICYmIERBVEFbMF0gPT0gMCAmJiBEQVRBWzFdID09IDM2MCkgeyByZXR1cm47IH0gLyogY3V0b2ZmPyAqL1xyXG5cclxuXHRcdH0gLyogZm9yIGFsbCBjZWxscyBpbiB0aGlzIHJpbmcgKi9cclxuXHR9IC8qIGZvciBhbGwgcmluZ3MgKi9cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2ludH0gQSBzdGFydCBhbmdsZVxyXG4gKiBAcGFyYW0ge2ludH0gQiBlbmQgYW5nbGVcclxuICogQHBhcmFtIHtib29sfSBibG9ja3MgRG9lcyBjdXJyZW50IGNlbGwgYmxvY2sgdmlzaWJpbGl0eT9cclxuICogQHBhcmFtIHtpbnRbXVtdfSBEQVRBIHNoYWRvd2VkIGFuZ2xlIHBhaXJzXHJcbiAqL1xyXG5ST1QuRk9WLkRpc2NyZXRlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuX3Zpc2libGVDb29yZHMgPSBmdW5jdGlvbihBLCBCLCBibG9ja3MsIERBVEEpIHtcclxuXHRpZiAoQSA8IDApIHsgXHJcblx0XHR2YXIgdjEgPSBhcmd1bWVudHMuY2FsbGVlKDAsIEIsIGJsb2NrcywgREFUQSk7XHJcblx0XHR2YXIgdjIgPSBhcmd1bWVudHMuY2FsbGVlKDM2MCtBLCAzNjAsIGJsb2NrcywgREFUQSk7XHJcblx0XHRyZXR1cm4gdjEgfHwgdjI7XHJcblx0fVxyXG5cdFxyXG5cdHZhciBpbmRleCA9IDA7XHJcblx0d2hpbGUgKGluZGV4IDwgREFUQS5sZW5ndGggJiYgREFUQVtpbmRleF0gPCBBKSB7IGluZGV4Kys7IH1cclxuXHRcclxuXHRpZiAoaW5kZXggPT0gREFUQS5sZW5ndGgpIHsgLyogY29tcGxldGVseSBuZXcgc2hhZG93ICovXHJcblx0XHRpZiAoYmxvY2tzKSB7IERBVEEucHVzaChBLCBCKTsgfSBcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHR2YXIgY291bnQgPSAwO1xyXG5cdFxyXG5cdGlmIChpbmRleCAlIDIpIHsgLyogdGhpcyBzaGFkb3cgc3RhcnRzIGluIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2l0aGluIGl0cyBlbmRpbmcgYm91bmRhcnkgKi9cclxuXHRcdHdoaWxlIChpbmRleCA8IERBVEEubGVuZ3RoICYmIERBVEFbaW5kZXhdIDwgQikge1xyXG5cdFx0XHRpbmRleCsrO1xyXG5cdFx0XHRjb3VudCsrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAoY291bnQgPT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFxyXG5cdFx0aWYgKGJsb2NrcykgeyBcclxuXHRcdFx0aWYgKGNvdW50ICUgMikge1xyXG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCwgQik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0REFUQS5zcGxpY2UoaW5kZXgtY291bnQsIGNvdW50KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHJcblx0fSBlbHNlIHsgLyogdGhpcyBzaGFkb3cgc3RhcnRzIG91dHNpZGUgYW4gZXhpc3Rpbmcgc2hhZG93LCBvciB3aXRoaW4gYSBzdGFydGluZyBib3VuZGFyeSAqL1xyXG5cdFx0d2hpbGUgKGluZGV4IDwgREFUQS5sZW5ndGggJiYgREFUQVtpbmRleF0gPCBCKSB7XHJcblx0XHRcdGluZGV4Kys7XHJcblx0XHRcdGNvdW50Kys7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8qIHZpc2libGUgd2hlbiBvdXRzaWRlIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2hlbiBvdmVybGFwcGluZyAqL1xyXG5cdFx0aWYgKEEgPT0gREFUQVtpbmRleC1jb3VudF0gJiYgY291bnQgPT0gMSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFxyXG5cdFx0aWYgKGJsb2NrcykgeyBcclxuXHRcdFx0aWYgKGNvdW50ICUgMikge1xyXG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCwgQSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0REFUQS5zcGxpY2UoaW5kZXgtY291bnQsIGNvdW50LCBBLCBCKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHRcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBQcmVjaXNlIHNoYWRvd2Nhc3RpbmcgYWxnb3JpdGhtXHJcbiAqIEBhdWdtZW50cyBST1QuRk9WXHJcbiAqL1xyXG5ST1QuRk9WLlByZWNpc2VTaGFkb3djYXN0aW5nID0gZnVuY3Rpb24obGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdFJPVC5GT1YuY2FsbCh0aGlzLCBsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKTtcclxufTtcclxuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZy5leHRlbmQoUk9ULkZPVik7XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuRk9WI2NvbXB1dGVcclxuICovXHJcblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge1xyXG5cdC8qIHRoaXMgcGxhY2UgaXMgYWx3YXlzIHZpc2libGUgKi9cclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHJcblx0Lyogc3RhbmRpbmcgaW4gYSBkYXJrIHBsYWNlLiBGSVhNRSBpcyB0aGlzIGEgZ29vZCBpZGVhPyAgKi9cclxuXHRpZiAoIXRoaXMuX2xpZ2h0UGFzc2VzKHgsIHkpKSB7IHJldHVybjsgfVxyXG5cdFxyXG5cdC8qIGxpc3Qgb2YgYWxsIHNoYWRvd3MgKi9cclxuXHR2YXIgU0hBRE9XUyA9IFtdO1xyXG5cdFxyXG5cdHZhciBjeCwgY3ksIGJsb2NrcywgQTEsIEEyLCB2aXNpYmlsaXR5O1xyXG5cclxuXHQvKiBhbmFseXplIHN1cnJvdW5kaW5nIGNlbGxzIGluIGNvbmNlbnRyaWMgcmluZ3MsIHN0YXJ0aW5nIGZyb20gdGhlIGNlbnRlciAqL1xyXG5cdGZvciAodmFyIHI9MTsgcjw9UjsgcisrKSB7XHJcblx0XHR2YXIgbmVpZ2hib3JzID0gdGhpcy5fZ2V0Q2lyY2xlKHgsIHksIHIpO1xyXG5cdFx0dmFyIG5laWdoYm9yQ291bnQgPSBuZWlnaGJvcnMubGVuZ3RoO1xyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPG5laWdoYm9yQ291bnQ7aSsrKSB7XHJcblx0XHRcdGN4ID0gbmVpZ2hib3JzW2ldWzBdO1xyXG5cdFx0XHRjeSA9IG5laWdoYm9yc1tpXVsxXTtcclxuXHRcdFx0Lyogc2hpZnQgaGFsZi1hbi1hbmdsZSBiYWNrd2FyZHMgdG8gbWFpbnRhaW4gY29uc2lzdGVuY3kgb2YgMC10aCBjZWxscyAqL1xyXG5cdFx0XHRBMSA9IFtpID8gMippLTEgOiAyKm5laWdoYm9yQ291bnQtMSwgMipuZWlnaGJvckNvdW50XTtcclxuXHRcdFx0QTIgPSBbMippKzEsIDIqbmVpZ2hib3JDb3VudF07IFxyXG5cdFx0XHRcclxuXHRcdFx0YmxvY2tzID0gIXRoaXMuX2xpZ2h0UGFzc2VzKGN4LCBjeSk7XHJcblx0XHRcdHZpc2liaWxpdHkgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoQTEsIEEyLCBibG9ja3MsIFNIQURPV1MpO1xyXG5cdFx0XHRpZiAodmlzaWJpbGl0eSkgeyBjYWxsYmFjayhjeCwgY3ksIHIsIHZpc2liaWxpdHkpOyB9XHJcblxyXG5cdFx0XHRpZiAoU0hBRE9XUy5sZW5ndGggPT0gMiAmJiBTSEFET1dTWzBdWzBdID09IDAgJiYgU0hBRE9XU1sxXVswXSA9PSBTSEFET1dTWzFdWzFdKSB7IHJldHVybjsgfSAvKiBjdXRvZmY/ICovXHJcblxyXG5cdFx0fSAvKiBmb3IgYWxsIGNlbGxzIGluIHRoaXMgcmluZyAqL1xyXG5cdH0gLyogZm9yIGFsbCByaW5ncyAqL1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7aW50WzJdfSBBMSBhcmMgc3RhcnRcclxuICogQHBhcmFtIHtpbnRbMl19IEEyIGFyYyBlbmRcclxuICogQHBhcmFtIHtib29sfSBibG9ja3MgRG9lcyBjdXJyZW50IGFyYyBibG9jayB2aXNpYmlsaXR5P1xyXG4gKiBAcGFyYW0ge2ludFtdW119IFNIQURPV1MgbGlzdCBvZiBhY3RpdmUgc2hhZG93c1xyXG4gKi9cclxuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuX2NoZWNrVmlzaWJpbGl0eSA9IGZ1bmN0aW9uKEExLCBBMiwgYmxvY2tzLCBTSEFET1dTKSB7XHJcblx0aWYgKEExWzBdID4gQTJbMF0pIHsgLyogc3BsaXQgaW50byB0d28gc3ViLWFyY3MgKi9cclxuXHRcdHZhciB2MSA9IHRoaXMuX2NoZWNrVmlzaWJpbGl0eShBMSwgW0ExWzFdLCBBMVsxXV0sIGJsb2NrcywgU0hBRE9XUyk7XHJcblx0XHR2YXIgdjIgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoWzAsIDFdLCBBMiwgYmxvY2tzLCBTSEFET1dTKTtcclxuXHRcdHJldHVybiAodjErdjIpLzI7XHJcblx0fVxyXG5cclxuXHQvKiBpbmRleDE6IGZpcnN0IHNoYWRvdyA+PSBBMSAqL1xyXG5cdHZhciBpbmRleDEgPSAwLCBlZGdlMSA9IGZhbHNlO1xyXG5cdHdoaWxlIChpbmRleDEgPCBTSEFET1dTLmxlbmd0aCkge1xyXG5cdFx0dmFyIG9sZCA9IFNIQURPV1NbaW5kZXgxXTtcclxuXHRcdHZhciBkaWZmID0gb2xkWzBdKkExWzFdIC0gQTFbMF0qb2xkWzFdO1xyXG5cdFx0aWYgKGRpZmYgPj0gMCkgeyAvKiBvbGQgPj0gQTEgKi9cclxuXHRcdFx0aWYgKGRpZmYgPT0gMCAmJiAhKGluZGV4MSAlIDIpKSB7IGVkZ2UxID0gdHJ1ZTsgfVxyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdGluZGV4MSsrO1xyXG5cdH1cclxuXHJcblx0LyogaW5kZXgyOiBsYXN0IHNoYWRvdyA8PSBBMiAqL1xyXG5cdHZhciBpbmRleDIgPSBTSEFET1dTLmxlbmd0aCwgZWRnZTIgPSBmYWxzZTtcclxuXHR3aGlsZSAoaW5kZXgyLS0pIHtcclxuXHRcdHZhciBvbGQgPSBTSEFET1dTW2luZGV4Ml07XHJcblx0XHR2YXIgZGlmZiA9IEEyWzBdKm9sZFsxXSAtIG9sZFswXSpBMlsxXTtcclxuXHRcdGlmIChkaWZmID49IDApIHsgLyogb2xkIDw9IEEyICovXHJcblx0XHRcdGlmIChkaWZmID09IDAgJiYgKGluZGV4MiAlIDIpKSB7IGVkZ2UyID0gdHJ1ZTsgfVxyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciB2aXNpYmxlID0gdHJ1ZTtcclxuXHRpZiAoaW5kZXgxID09IGluZGV4MiAmJiAoZWRnZTEgfHwgZWRnZTIpKSB7ICAvKiBzdWJzZXQgb2YgZXhpc3Rpbmcgc2hhZG93LCBvbmUgb2YgdGhlIGVkZ2VzIG1hdGNoICovXHJcblx0XHR2aXNpYmxlID0gZmFsc2U7IFxyXG5cdH0gZWxzZSBpZiAoZWRnZTEgJiYgZWRnZTIgJiYgaW5kZXgxKzE9PWluZGV4MiAmJiAoaW5kZXgyICUgMikpIHsgLyogY29tcGxldGVseSBlcXVpdmFsZW50IHdpdGggZXhpc3Rpbmcgc2hhZG93ICovXHJcblx0XHR2aXNpYmxlID0gZmFsc2U7XHJcblx0fSBlbHNlIGlmIChpbmRleDEgPiBpbmRleDIgJiYgKGluZGV4MSAlIDIpKSB7IC8qIHN1YnNldCBvZiBleGlzdGluZyBzaGFkb3csIG5vdCB0b3VjaGluZyAqL1xyXG5cdFx0dmlzaWJsZSA9IGZhbHNlO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoIXZpc2libGUpIHsgcmV0dXJuIDA7IH0gLyogZmFzdCBjYXNlOiBub3QgdmlzaWJsZSAqL1xyXG5cdFxyXG5cdHZhciB2aXNpYmxlTGVuZ3RoLCBQO1xyXG5cclxuXHQvKiBjb21wdXRlIHRoZSBsZW5ndGggb2YgdmlzaWJsZSBhcmMsIGFkanVzdCBsaXN0IG9mIHNoYWRvd3MgKGlmIGJsb2NraW5nKSAqL1xyXG5cdHZhciByZW1vdmUgPSBpbmRleDItaW5kZXgxKzE7XHJcblx0aWYgKHJlbW92ZSAlIDIpIHtcclxuXHRcdGlmIChpbmRleDEgJSAyKSB7IC8qIGZpcnN0IGVkZ2Ugd2l0aGluIGV4aXN0aW5nIHNoYWRvdywgc2Vjb25kIG91dHNpZGUgKi9cclxuXHRcdFx0dmFyIFAgPSBTSEFET1dTW2luZGV4MV07XHJcblx0XHRcdHZpc2libGVMZW5ndGggPSAoQTJbMF0qUFsxXSAtIFBbMF0qQTJbMV0pIC8gKFBbMV0gKiBBMlsxXSk7XHJcblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUsIEEyKTsgfVxyXG5cdFx0fSBlbHNlIHsgLyogc2Vjb25kIGVkZ2Ugd2l0aGluIGV4aXN0aW5nIHNoYWRvdywgZmlyc3Qgb3V0c2lkZSAqL1xyXG5cdFx0XHR2YXIgUCA9IFNIQURPV1NbaW5kZXgyXTtcclxuXHRcdFx0dmlzaWJsZUxlbmd0aCA9IChQWzBdKkExWzFdIC0gQTFbMF0qUFsxXSkgLyAoQTFbMV0gKiBQWzFdKTtcclxuXHRcdFx0aWYgKGJsb2NrcykgeyBTSEFET1dTLnNwbGljZShpbmRleDEsIHJlbW92ZSwgQTEpOyB9XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdGlmIChpbmRleDEgJSAyKSB7IC8qIGJvdGggZWRnZXMgd2l0aGluIGV4aXN0aW5nIHNoYWRvd3MgKi9cclxuXHRcdFx0dmFyIFAxID0gU0hBRE9XU1tpbmRleDFdO1xyXG5cdFx0XHR2YXIgUDIgPSBTSEFET1dTW2luZGV4Ml07XHJcblx0XHRcdHZpc2libGVMZW5ndGggPSAoUDJbMF0qUDFbMV0gLSBQMVswXSpQMlsxXSkgLyAoUDFbMV0gKiBQMlsxXSk7XHJcblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUpOyB9XHJcblx0XHR9IGVsc2UgeyAvKiBib3RoIGVkZ2VzIG91dHNpZGUgZXhpc3Rpbmcgc2hhZG93cyAqL1xyXG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMSwgQTIpOyB9XHJcblx0XHRcdHJldHVybiAxOyAvKiB3aG9sZSBhcmMgdmlzaWJsZSEgKi9cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBhcmNMZW5ndGggPSAoQTJbMF0qQTFbMV0gLSBBMVswXSpBMlsxXSkgLyAoQTFbMV0gKiBBMlsxXSk7XHJcblxyXG5cdHJldHVybiB2aXNpYmxlTGVuZ3RoL2FyY0xlbmd0aDtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBSZWN1cnNpdmUgc2hhZG93Y2FzdGluZyBhbGdvcml0aG1cclxuICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgNC84IHRvcG9sb2dpZXMsIG5vdCBoZXhhZ29uYWwuXHJcbiAqIEJhc2VkIG9uIFBldGVyIEhhcmtpbnMnIGltcGxlbWVudGF0aW9uIG9mIEJqw7ZybiBCZXJnc3Ryw7ZtJ3MgYWxnb3JpdGhtIGRlc2NyaWJlZCBoZXJlOiBodHRwOi8vd3d3LnJvZ3VlYmFzaW4uY29tL2luZGV4LnBocD90aXRsZT1GT1ZfdXNpbmdfcmVjdXJzaXZlX3NoYWRvd2Nhc3RpbmdcclxuICogQGF1Z21lbnRzIFJPVC5GT1ZcclxuICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZyA9IGZ1bmN0aW9uKGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHRST1QuRk9WLmNhbGwodGhpcywgbGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucyk7XHJcbn07XHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5leHRlbmQoUk9ULkZPVik7XHJcblxyXG4vKiogT2N0YW50cyB1c2VkIGZvciB0cmFuc2xhdGluZyByZWN1cnNpdmUgc2hhZG93Y2FzdGluZyBvZmZzZXRzICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTID0gW1xyXG5cdFstMSwgIDAsICAwLCAgMV0sXHJcblx0WyAwLCAtMSwgIDEsICAwXSxcclxuXHRbIDAsIC0xLCAtMSwgIDBdLFxyXG5cdFstMSwgIDAsICAwLCAtMV0sXHJcblx0WyAxLCAgMCwgIDAsIC0xXSxcclxuXHRbIDAsICAxLCAtMSwgIDBdLFxyXG5cdFsgMCwgIDEsICAxLCAgMF0sXHJcblx0WyAxLCAgMCwgIDAsICAxXVxyXG5dO1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSAzNjAtZGVncmVlIGNpcmNsZVxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge1xyXG5cdC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1tpXSwgUiwgY2FsbGJhY2spO1xyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgMTgwLWRlZ3JlZSBhcmNcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xyXG4gKiBAcGFyYW0ge2ludH0gZGlyIERpcmVjdGlvbiB0byBsb29rIGluIChleHByZXNzZWQgaW4gYSBST1QuRElSUyB2YWx1ZSk7XHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUxODAgPSBmdW5jdGlvbih4LCB5LCBSLCBkaXIsIGNhbGxiYWNrKSB7XHJcblx0Ly9Zb3UgY2FuIGFsd2F5cyBzZWUgeW91ciBvd24gdGlsZVxyXG5cdGNhbGxiYWNrKHgsIHksIDAsIDEpO1xyXG5cdHZhciBwcmV2aW91c09jdGFudCA9IChkaXIgLSAxICsgOCkgJSA4OyAvL05lZWQgdG8gcmV0cmlldmUgdGhlIHByZXZpb3VzIG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXHJcblx0dmFyIG5leHRQcmV2aW91c09jdGFudCA9IChkaXIgLSAyICsgOCkgJSA4OyAvL05lZWQgdG8gcmV0cmlldmUgdGhlIHByZXZpb3VzIHR3byBvY3RhbnRzIHRvIHJlbmRlciBhIGZ1bGwgMTgwIGRlZ3JlZXNcclxuXHR2YXIgbmV4dE9jdGFudCA9IChkaXIrIDEgKyA4KSAlIDg7IC8vTmVlZCB0byBncmFiIHRvIG5leHQgb2N0YW50IHRvIHJlbmRlciBhIGZ1bGwgMTgwIGRlZ3JlZXNcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbbmV4dFByZXZpb3VzT2N0YW50XSwgUiwgY2FsbGJhY2spO1xyXG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1twcmV2aW91c09jdGFudF0sIFIsIGNhbGxiYWNrKTtcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbZGlyXSwgUiwgY2FsbGJhY2spO1xyXG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1tuZXh0T2N0YW50XSwgUiwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSA5MC1kZWdyZWUgYXJjXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcclxuICogQHBhcmFtIHtpbnR9IGRpciBEaXJlY3Rpb24gdG8gbG9vayBpbiAoZXhwcmVzc2VkIGluIGEgUk9ULkRJUlMgdmFsdWUpO1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlOTAgPSBmdW5jdGlvbih4LCB5LCBSLCBkaXIsIGNhbGxiYWNrKSB7XHJcblx0Ly9Zb3UgY2FuIGFsd2F5cyBzZWUgeW91ciBvd24gdGlsZVxyXG5cdGNhbGxiYWNrKHgsIHksIDAsIDEpO1xyXG5cdHZhciBwcmV2aW91c09jdGFudCA9IChkaXIgLSAxICsgOCkgJSA4OyAvL05lZWQgdG8gcmV0cmlldmUgdGhlIHByZXZpb3VzIG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDkwIGRlZ3JlZXNcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbZGlyXSwgUiwgY2FsbGJhY2spO1xyXG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1twcmV2aW91c09jdGFudF0sIFIsIGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW5kZXIgb25lIG9jdGFudCAoNDUtZGVncmVlIGFyYykgb2YgdGhlIHZpZXdzaGVkXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSBvY3RhbnQgT2N0YW50IHRvIGJlIHJlbmRlcmVkXHJcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuX3JlbmRlck9jdGFudCA9IGZ1bmN0aW9uKHgsIHksIG9jdGFudCwgUiwgY2FsbGJhY2spIHtcclxuXHQvL1JhZGl1cyBpbmNyZW1lbnRlZCBieSAxIHRvIHByb3ZpZGUgc2FtZSBjb3ZlcmFnZSBhcmVhIGFzIG90aGVyIHNoYWRvd2Nhc3RpbmcgcmFkaXVzZXNcclxuXHR0aGlzLl9jYXN0VmlzaWJpbGl0eSh4LCB5LCAxLCAxLjAsIDAuMCwgUiArIDEsIG9jdGFudFswXSwgb2N0YW50WzFdLCBvY3RhbnRbMl0sIG9jdGFudFszXSwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFjdHVhbGx5IGNhbGN1bGF0ZXMgdGhlIHZpc2liaWxpdHlcclxuICogQHBhcmFtIHtpbnR9IHN0YXJ0WCBUaGUgc3RhcnRpbmcgWCBjb29yZGluYXRlXHJcbiAqIEBwYXJhbSB7aW50fSBzdGFydFkgVGhlIHN0YXJ0aW5nIFkgY29vcmRpbmF0ZVxyXG4gKiBAcGFyYW0ge2ludH0gcm93IFRoZSByb3cgdG8gcmVuZGVyXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IHZpc1Nsb3BlU3RhcnQgVGhlIHNsb3BlIHRvIHN0YXJ0IGF0XHJcbiAqIEBwYXJhbSB7ZmxvYXR9IHZpc1Nsb3BlRW5kIFRoZSBzbG9wZSB0byBlbmQgYXRcclxuICogQHBhcmFtIHtpbnR9IHJhZGl1cyBUaGUgcmFkaXVzIHRvIHJlYWNoIG91dCB0b1xyXG4gKiBAcGFyYW0ge2ludH0geHggXHJcbiAqIEBwYXJhbSB7aW50fSB4eSBcclxuICogQHBhcmFtIHtpbnR9IHl4IFxyXG4gKiBAcGFyYW0ge2ludH0geXkgXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byB1c2Ugd2hlbiB3ZSBoaXQgYSBibG9jayB0aGF0IGlzIHZpc2libGVcclxuICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuX2Nhc3RWaXNpYmlsaXR5ID0gZnVuY3Rpb24oc3RhcnRYLCBzdGFydFksIHJvdywgdmlzU2xvcGVTdGFydCwgdmlzU2xvcGVFbmQsIHJhZGl1cywgeHgsIHh5LCB5eCwgeXksIGNhbGxiYWNrKSB7XHJcblx0aWYodmlzU2xvcGVTdGFydCA8IHZpc1Nsb3BlRW5kKSB7IHJldHVybjsgfVxyXG5cdGZvcih2YXIgaSA9IHJvdzsgaSA8PSByYWRpdXM7IGkrKykge1xyXG5cdFx0dmFyIGR4ID0gLWkgLSAxO1xyXG5cdFx0dmFyIGR5ID0gLWk7XHJcblx0XHR2YXIgYmxvY2tlZCA9IGZhbHNlO1xyXG5cdFx0dmFyIG5ld1N0YXJ0ID0gMDtcclxuXHJcblx0XHQvLydSb3cnIGNvdWxkIGJlIGNvbHVtbiwgbmFtZXMgaGVyZSBhc3N1bWUgb2N0YW50IDAgYW5kIHdvdWxkIGJlIGZsaXBwZWQgZm9yIGhhbGYgdGhlIG9jdGFudHNcclxuXHRcdHdoaWxlKGR4IDw9IDApIHtcclxuXHRcdFx0ZHggKz0gMTtcclxuXHJcblx0XHRcdC8vVHJhbnNsYXRlIGZyb20gcmVsYXRpdmUgY29vcmRpbmF0ZXMgdG8gbWFwIGNvb3JkaW5hdGVzXHJcblx0XHRcdHZhciBtYXBYID0gc3RhcnRYICsgZHggKiB4eCArIGR5ICogeHk7XHJcblx0XHRcdHZhciBtYXBZID0gc3RhcnRZICsgZHggKiB5eCArIGR5ICogeXk7XHJcblxyXG5cdFx0XHQvL1JhbmdlIG9mIHRoZSByb3dcclxuXHRcdFx0dmFyIHNsb3BlU3RhcnQgPSAoZHggLSAwLjUpIC8gKGR5ICsgMC41KTtcclxuXHRcdFx0dmFyIHNsb3BlRW5kID0gKGR4ICsgMC41KSAvIChkeSAtIDAuNSk7XHJcblx0XHRcclxuXHRcdFx0Ly9JZ25vcmUgaWYgbm90IHlldCBhdCBsZWZ0IGVkZ2Ugb2YgT2N0YW50XHJcblx0XHRcdGlmKHNsb3BlRW5kID4gdmlzU2xvcGVTdGFydCkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHRcclxuXHRcdFx0Ly9Eb25lIGlmIHBhc3QgcmlnaHQgZWRnZVxyXG5cdFx0XHRpZihzbG9wZVN0YXJ0IDwgdmlzU2xvcGVFbmQpIHsgYnJlYWs7IH1cclxuXHRcdFx0XHRcclxuXHRcdFx0Ly9JZiBpdCdzIGluIHJhbmdlLCBpdCdzIHZpc2libGVcclxuXHRcdFx0aWYoKGR4ICogZHggKyBkeSAqIGR5KSA8IChyYWRpdXMgKiByYWRpdXMpKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2sobWFwWCwgbWFwWSwgaSwgMSk7XHJcblx0XHRcdH1cclxuXHRcclxuXHRcdFx0aWYoIWJsb2NrZWQpIHtcclxuXHRcdFx0XHQvL0lmIHRpbGUgaXMgYSBibG9ja2luZyB0aWxlLCBjYXN0IGFyb3VuZCBpdFxyXG5cdFx0XHRcdGlmKCF0aGlzLl9saWdodFBhc3NlcyhtYXBYLCBtYXBZKSAmJiBpIDwgcmFkaXVzKSB7XHJcblx0XHRcdFx0XHRibG9ja2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHRoaXMuX2Nhc3RWaXNpYmlsaXR5KHN0YXJ0WCwgc3RhcnRZLCBpICsgMSwgdmlzU2xvcGVTdGFydCwgc2xvcGVTdGFydCwgcmFkaXVzLCB4eCwgeHksIHl4LCB5eSwgY2FsbGJhY2spO1xyXG5cdFx0XHRcdFx0bmV3U3RhcnQgPSBzbG9wZUVuZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly9LZWVwIG5hcnJvd2luZyBpZiBzY2FubmluZyBhY3Jvc3MgYSBibG9ja1xyXG5cdFx0XHRcdGlmKCF0aGlzLl9saWdodFBhc3NlcyhtYXBYLCBtYXBZKSkge1xyXG5cdFx0XHRcdFx0bmV3U3RhcnQgPSBzbG9wZUVuZDtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdFx0Ly9CbG9jayBoYXMgZW5kZWRcclxuXHRcdFx0XHRibG9ja2VkID0gZmFsc2U7XHJcblx0XHRcdFx0dmlzU2xvcGVTdGFydCA9IG5ld1N0YXJ0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZihibG9ja2VkKSB7IGJyZWFrOyB9XHJcblx0fVxyXG59O1xyXG4vKipcclxuICogQG5hbWVzcGFjZSBDb2xvciBvcGVyYXRpb25zXHJcbiAqL1xyXG5ST1QuQ29sb3IgPSB7XHJcblx0ZnJvbVN0cmluZzogZnVuY3Rpb24oc3RyKSB7XHJcblx0XHR2YXIgY2FjaGVkLCByO1xyXG5cdFx0aWYgKHN0ciBpbiB0aGlzLl9jYWNoZSkge1xyXG5cdFx0XHRjYWNoZWQgPSB0aGlzLl9jYWNoZVtzdHJdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHN0ci5jaGFyQXQoMCkgPT0gXCIjXCIpIHsgLyogaGV4IHJnYiAqL1xyXG5cclxuXHRcdFx0XHR2YXIgdmFsdWVzID0gc3RyLm1hdGNoKC9bMC05YS1mXS9naSkubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHBhcnNlSW50KHgsIDE2KTsgfSk7XHJcblx0XHRcdFx0aWYgKHZhbHVlcy5sZW5ndGggPT0gMykge1xyXG5cdFx0XHRcdFx0Y2FjaGVkID0gdmFsdWVzLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiB4KjE3OyB9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFsdWVzW2krMV0gKz0gMTYqdmFsdWVzW2ldO1xyXG5cdFx0XHRcdFx0XHR2YWx1ZXMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2FjaGVkID0gdmFsdWVzO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoKHIgPSBzdHIubWF0Y2goL3JnYlxcKChbMC05LCBdKylcXCkvaSkpKSB7IC8qIGRlY2ltYWwgcmdiICovXHJcblx0XHRcdFx0Y2FjaGVkID0gclsxXS5zcGxpdCgvXFxzKixcXHMqLykubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHBhcnNlSW50KHgpOyB9KTtcclxuXHRcdFx0fSBlbHNlIHsgLyogaHRtbCBuYW1lICovXHJcblx0XHRcdFx0Y2FjaGVkID0gWzAsIDAsIDBdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9jYWNoZVtzdHJdID0gY2FjaGVkO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjYWNoZWQuc2xpY2UoKTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBBZGQgdHdvIG9yIG1vcmUgY29sb3JzXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdGFkZDogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcclxuXHRcdHZhciByZXN1bHQgPSBjb2xvcjEuc2xpY2UoKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0cmVzdWx0W2ldICs9IGFyZ3VtZW50c1tqXVtpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBBZGQgdHdvIG9yIG1vcmUgY29sb3JzLCBNT0RJRklFUyBGSVJTVCBBUkdVTUVOVFxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRhZGRfOiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMikge1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0xO2o8YXJndW1lbnRzLmxlbmd0aDtqKyspIHtcclxuXHRcdFx0XHRjb2xvcjFbaV0gKz0gYXJndW1lbnRzW2pdW2ldO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29sb3IxO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIE11bHRpcGx5IChtaXgpIHR3byBvciBtb3JlIGNvbG9yc1xyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRtdWx0aXBseTogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcclxuXHRcdHZhciByZXN1bHQgPSBjb2xvcjEuc2xpY2UoKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0cmVzdWx0W2ldICo9IGFyZ3VtZW50c1tqXVtpXSAvIDI1NTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXN1bHRbaV0gPSBNYXRoLnJvdW5kKHJlc3VsdFtpXSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIE11bHRpcGx5IChtaXgpIHR3byBvciBtb3JlIGNvbG9ycywgTU9ESUZJRVMgRklSU1QgQVJHVU1FTlRcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0bXVsdGlwbHlfOiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMikge1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0xO2o8YXJndW1lbnRzLmxlbmd0aDtqKyspIHtcclxuXHRcdFx0XHRjb2xvcjFbaV0gKj0gYXJndW1lbnRzW2pdW2ldIC8gMjU1O1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbG9yMVtpXSA9IE1hdGgucm91bmQoY29sb3IxW2ldKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjb2xvcjE7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogSW50ZXJwb2xhdGUgKGJsZW5kKSB0d28gY29sb3JzIHdpdGggYSBnaXZlbiBmYWN0b3JcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbZmFjdG9yPTAuNV0gMC4uMVxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRpbnRlcnBvbGF0ZTogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIsIGZhY3Rvcikge1xyXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7IGZhY3RvciA9IDAuNTsgfVxyXG5cdFx0dmFyIHJlc3VsdCA9IGNvbG9yMS5zbGljZSgpO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0cmVzdWx0W2ldID0gTWF0aC5yb3VuZChyZXN1bHRbaV0gKyBmYWN0b3IqKGNvbG9yMltpXS1jb2xvcjFbaV0pKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogSW50ZXJwb2xhdGUgKGJsZW5kKSB0d28gY29sb3JzIHdpdGggYSBnaXZlbiBmYWN0b3IgaW4gSFNMIG1vZGVcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbZmFjdG9yPTAuNV0gMC4uMVxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRpbnRlcnBvbGF0ZUhTTDogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIsIGZhY3Rvcikge1xyXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7IGZhY3RvciA9IDAuNTsgfVxyXG5cdFx0dmFyIGhzbDEgPSB0aGlzLnJnYjJoc2woY29sb3IxKTtcclxuXHRcdHZhciBoc2wyID0gdGhpcy5yZ2IyaHNsKGNvbG9yMik7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRoc2wxW2ldICs9IGZhY3RvciooaHNsMltpXS1oc2wxW2ldKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzLmhzbDJyZ2IoaHNsMSk7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlIGEgbmV3IHJhbmRvbSBjb2xvciBiYXNlZCBvbiB0aGlzIG9uZVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gZGlmZiBTZXQgb2Ygc3RhbmRhcmQgZGV2aWF0aW9uc1xyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRyYW5kb21pemU6IGZ1bmN0aW9uKGNvbG9yLCBkaWZmKSB7XHJcblx0XHRpZiAoIShkaWZmIGluc3RhbmNlb2YgQXJyYXkpKSB7IGRpZmYgPSBNYXRoLnJvdW5kKFJPVC5STkcuZ2V0Tm9ybWFsKDAsIGRpZmYpKTsgfVxyXG5cdFx0dmFyIHJlc3VsdCA9IGNvbG9yLnNsaWNlKCk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRyZXN1bHRbaV0gKz0gKGRpZmYgaW5zdGFuY2VvZiBBcnJheSA/IE1hdGgucm91bmQoUk9ULlJORy5nZXROb3JtYWwoMCwgZGlmZltpXSkpIDogZGlmZik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbnZlcnRzIGFuIFJHQiBjb2xvciB2YWx1ZSB0byBIU0wuIEV4cGVjdHMgMC4uMjU1IGlucHV0cywgcHJvZHVjZXMgMC4uMSBvdXRwdXRzLlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdHJnYjJoc2w6IGZ1bmN0aW9uKGNvbG9yKSB7XHJcblx0XHR2YXIgciA9IGNvbG9yWzBdLzI1NTtcclxuXHRcdHZhciBnID0gY29sb3JbMV0vMjU1O1xyXG5cdFx0dmFyIGIgPSBjb2xvclsyXS8yNTU7XHJcblxyXG5cdFx0dmFyIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLCBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcclxuXHRcdHZhciBoLCBzLCBsID0gKG1heCArIG1pbikgLyAyO1xyXG5cclxuXHRcdGlmIChtYXggPT0gbWluKSB7XHJcblx0XHRcdGggPSBzID0gMDsgLy8gYWNocm9tYXRpY1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGQgPSBtYXggLSBtaW47XHJcblx0XHRcdHMgPSAobCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbikpO1xyXG5cdFx0XHRzd2l0Y2gobWF4KSB7XHJcblx0XHRcdFx0Y2FzZSByOiBoID0gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCk7IGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgZzogaCA9IChiIC0gcikgLyBkICsgMjsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBiOiBoID0gKHIgLSBnKSAvIGQgKyA0OyBicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0XHRoIC89IDY7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIFtoLCBzLCBsXTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0cyBhbiBIU0wgY29sb3IgdmFsdWUgdG8gUkdCLiBFeHBlY3RzIDAuLjEgaW5wdXRzLCBwcm9kdWNlcyAwLi4yNTUgb3V0cHV0cy5cclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRoc2wycmdiOiBmdW5jdGlvbihjb2xvcikge1xyXG5cdFx0dmFyIGwgPSBjb2xvclsyXTtcclxuXHJcblx0XHRpZiAoY29sb3JbMV0gPT0gMCkge1xyXG5cdFx0XHRsID0gTWF0aC5yb3VuZChsKjI1NSk7XHJcblx0XHRcdHJldHVybiBbbCwgbCwgbF07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgaHVlMnJnYiA9IGZ1bmN0aW9uKHAsIHEsIHQpIHtcclxuXHRcdFx0XHRpZiAodCA8IDApIHQgKz0gMTtcclxuXHRcdFx0XHRpZiAodCA+IDEpIHQgLT0gMTtcclxuXHRcdFx0XHRpZiAodCA8IDEvNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XHJcblx0XHRcdFx0aWYgKHQgPCAxLzIpIHJldHVybiBxO1xyXG5cdFx0XHRcdGlmICh0IDwgMi8zKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMi8zIC0gdCkgKiA2O1xyXG5cdFx0XHRcdHJldHVybiBwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgcyA9IGNvbG9yWzFdO1xyXG5cdFx0XHR2YXIgcSA9IChsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzKTtcclxuXHRcdFx0dmFyIHAgPSAyICogbCAtIHE7XHJcblx0XHRcdHZhciByID0gaHVlMnJnYihwLCBxLCBjb2xvclswXSArIDEvMyk7XHJcblx0XHRcdHZhciBnID0gaHVlMnJnYihwLCBxLCBjb2xvclswXSk7XHJcblx0XHRcdHZhciBiID0gaHVlMnJnYihwLCBxLCBjb2xvclswXSAtIDEvMyk7XHJcblx0XHRcdHJldHVybiBbTWF0aC5yb3VuZChyKjI1NSksIE1hdGgucm91bmQoZyoyNTUpLCBNYXRoLnJvdW5kKGIqMjU1KV07XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0dG9SR0I6IGZ1bmN0aW9uKGNvbG9yKSB7XHJcblx0XHRyZXR1cm4gXCJyZ2IoXCIgKyB0aGlzLl9jbGFtcChjb2xvclswXSkgKyBcIixcIiArIHRoaXMuX2NsYW1wKGNvbG9yWzFdKSArIFwiLFwiICsgdGhpcy5fY2xhbXAoY29sb3JbMl0pICsgXCIpXCI7XHJcblx0fSxcclxuXHJcblx0dG9IZXg6IGZ1bmN0aW9uKGNvbG9yKSB7XHJcblx0XHR2YXIgcGFydHMgPSBbXTtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdHBhcnRzLnB1c2godGhpcy5fY2xhbXAoY29sb3JbaV0pLnRvU3RyaW5nKDE2KS5scGFkKFwiMFwiLCAyKSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gXCIjXCIgKyBwYXJ0cy5qb2luKFwiXCIpO1xyXG5cdH0sXHJcblxyXG5cdF9jbGFtcDogZnVuY3Rpb24obnVtKSB7XHJcblx0XHRpZiAobnVtIDwgMCkge1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH0gZWxzZSBpZiAobnVtID4gMjU1KSB7XHJcblx0XHRcdHJldHVybiAyNTU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gbnVtO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF9jYWNoZToge1xyXG5cdFx0XCJibGFja1wiOiBbMCwwLDBdLFxyXG5cdFx0XCJuYXZ5XCI6IFswLDAsMTI4XSxcclxuXHRcdFwiZGFya2JsdWVcIjogWzAsMCwxMzldLFxyXG5cdFx0XCJtZWRpdW1ibHVlXCI6IFswLDAsMjA1XSxcclxuXHRcdFwiYmx1ZVwiOiBbMCwwLDI1NV0sXHJcblx0XHRcImRhcmtncmVlblwiOiBbMCwxMDAsMF0sXHJcblx0XHRcImdyZWVuXCI6IFswLDEyOCwwXSxcclxuXHRcdFwidGVhbFwiOiBbMCwxMjgsMTI4XSxcclxuXHRcdFwiZGFya2N5YW5cIjogWzAsMTM5LDEzOV0sXHJcblx0XHRcImRlZXBza3libHVlXCI6IFswLDE5MSwyNTVdLFxyXG5cdFx0XCJkYXJrdHVycXVvaXNlXCI6IFswLDIwNiwyMDldLFxyXG5cdFx0XCJtZWRpdW1zcHJpbmdncmVlblwiOiBbMCwyNTAsMTU0XSxcclxuXHRcdFwibGltZVwiOiBbMCwyNTUsMF0sXHJcblx0XHRcInNwcmluZ2dyZWVuXCI6IFswLDI1NSwxMjddLFxyXG5cdFx0XCJhcXVhXCI6IFswLDI1NSwyNTVdLFxyXG5cdFx0XCJjeWFuXCI6IFswLDI1NSwyNTVdLFxyXG5cdFx0XCJtaWRuaWdodGJsdWVcIjogWzI1LDI1LDExMl0sXHJcblx0XHRcImRvZGdlcmJsdWVcIjogWzMwLDE0NCwyNTVdLFxyXG5cdFx0XCJmb3Jlc3RncmVlblwiOiBbMzQsMTM5LDM0XSxcclxuXHRcdFwic2VhZ3JlZW5cIjogWzQ2LDEzOSw4N10sXHJcblx0XHRcImRhcmtzbGF0ZWdyYXlcIjogWzQ3LDc5LDc5XSxcclxuXHRcdFwiZGFya3NsYXRlZ3JleVwiOiBbNDcsNzksNzldLFxyXG5cdFx0XCJsaW1lZ3JlZW5cIjogWzUwLDIwNSw1MF0sXHJcblx0XHRcIm1lZGl1bXNlYWdyZWVuXCI6IFs2MCwxNzksMTEzXSxcclxuXHRcdFwidHVycXVvaXNlXCI6IFs2NCwyMjQsMjA4XSxcclxuXHRcdFwicm95YWxibHVlXCI6IFs2NSwxMDUsMjI1XSxcclxuXHRcdFwic3RlZWxibHVlXCI6IFs3MCwxMzAsMTgwXSxcclxuXHRcdFwiZGFya3NsYXRlYmx1ZVwiOiBbNzIsNjEsMTM5XSxcclxuXHRcdFwibWVkaXVtdHVycXVvaXNlXCI6IFs3MiwyMDksMjA0XSxcclxuXHRcdFwiaW5kaWdvXCI6IFs3NSwwLDEzMF0sXHJcblx0XHRcImRhcmtvbGl2ZWdyZWVuXCI6IFs4NSwxMDcsNDddLFxyXG5cdFx0XCJjYWRldGJsdWVcIjogWzk1LDE1OCwxNjBdLFxyXG5cdFx0XCJjb3JuZmxvd2VyYmx1ZVwiOiBbMTAwLDE0OSwyMzddLFxyXG5cdFx0XCJtZWRpdW1hcXVhbWFyaW5lXCI6IFsxMDIsMjA1LDE3MF0sXHJcblx0XHRcImRpbWdyYXlcIjogWzEwNSwxMDUsMTA1XSxcclxuXHRcdFwiZGltZ3JleVwiOiBbMTA1LDEwNSwxMDVdLFxyXG5cdFx0XCJzbGF0ZWJsdWVcIjogWzEwNiw5MCwyMDVdLFxyXG5cdFx0XCJvbGl2ZWRyYWJcIjogWzEwNywxNDIsMzVdLFxyXG5cdFx0XCJzbGF0ZWdyYXlcIjogWzExMiwxMjgsMTQ0XSxcclxuXHRcdFwic2xhdGVncmV5XCI6IFsxMTIsMTI4LDE0NF0sXHJcblx0XHRcImxpZ2h0c2xhdGVncmF5XCI6IFsxMTksMTM2LDE1M10sXHJcblx0XHRcImxpZ2h0c2xhdGVncmV5XCI6IFsxMTksMTM2LDE1M10sXHJcblx0XHRcIm1lZGl1bXNsYXRlYmx1ZVwiOiBbMTIzLDEwNCwyMzhdLFxyXG5cdFx0XCJsYXduZ3JlZW5cIjogWzEyNCwyNTIsMF0sXHJcblx0XHRcImNoYXJ0cmV1c2VcIjogWzEyNywyNTUsMF0sXHJcblx0XHRcImFxdWFtYXJpbmVcIjogWzEyNywyNTUsMjEyXSxcclxuXHRcdFwibWFyb29uXCI6IFsxMjgsMCwwXSxcclxuXHRcdFwicHVycGxlXCI6IFsxMjgsMCwxMjhdLFxyXG5cdFx0XCJvbGl2ZVwiOiBbMTI4LDEyOCwwXSxcclxuXHRcdFwiZ3JheVwiOiBbMTI4LDEyOCwxMjhdLFxyXG5cdFx0XCJncmV5XCI6IFsxMjgsMTI4LDEyOF0sXHJcblx0XHRcInNreWJsdWVcIjogWzEzNSwyMDYsMjM1XSxcclxuXHRcdFwibGlnaHRza3libHVlXCI6IFsxMzUsMjA2LDI1MF0sXHJcblx0XHRcImJsdWV2aW9sZXRcIjogWzEzOCw0MywyMjZdLFxyXG5cdFx0XCJkYXJrcmVkXCI6IFsxMzksMCwwXSxcclxuXHRcdFwiZGFya21hZ2VudGFcIjogWzEzOSwwLDEzOV0sXHJcblx0XHRcInNhZGRsZWJyb3duXCI6IFsxMzksNjksMTldLFxyXG5cdFx0XCJkYXJrc2VhZ3JlZW5cIjogWzE0MywxODgsMTQzXSxcclxuXHRcdFwibGlnaHRncmVlblwiOiBbMTQ0LDIzOCwxNDRdLFxyXG5cdFx0XCJtZWRpdW1wdXJwbGVcIjogWzE0NywxMTIsMjE2XSxcclxuXHRcdFwiZGFya3Zpb2xldFwiOiBbMTQ4LDAsMjExXSxcclxuXHRcdFwicGFsZWdyZWVuXCI6IFsxNTIsMjUxLDE1Ml0sXHJcblx0XHRcImRhcmtvcmNoaWRcIjogWzE1Myw1MCwyMDRdLFxyXG5cdFx0XCJ5ZWxsb3dncmVlblwiOiBbMTU0LDIwNSw1MF0sXHJcblx0XHRcInNpZW5uYVwiOiBbMTYwLDgyLDQ1XSxcclxuXHRcdFwiYnJvd25cIjogWzE2NSw0Miw0Ml0sXHJcblx0XHRcImRhcmtncmF5XCI6IFsxNjksMTY5LDE2OV0sXHJcblx0XHRcImRhcmtncmV5XCI6IFsxNjksMTY5LDE2OV0sXHJcblx0XHRcImxpZ2h0Ymx1ZVwiOiBbMTczLDIxNiwyMzBdLFxyXG5cdFx0XCJncmVlbnllbGxvd1wiOiBbMTczLDI1NSw0N10sXHJcblx0XHRcInBhbGV0dXJxdW9pc2VcIjogWzE3NSwyMzgsMjM4XSxcclxuXHRcdFwibGlnaHRzdGVlbGJsdWVcIjogWzE3NiwxOTYsMjIyXSxcclxuXHRcdFwicG93ZGVyYmx1ZVwiOiBbMTc2LDIyNCwyMzBdLFxyXG5cdFx0XCJmaXJlYnJpY2tcIjogWzE3OCwzNCwzNF0sXHJcblx0XHRcImRhcmtnb2xkZW5yb2RcIjogWzE4NCwxMzQsMTFdLFxyXG5cdFx0XCJtZWRpdW1vcmNoaWRcIjogWzE4Niw4NSwyMTFdLFxyXG5cdFx0XCJyb3N5YnJvd25cIjogWzE4OCwxNDMsMTQzXSxcclxuXHRcdFwiZGFya2toYWtpXCI6IFsxODksMTgzLDEwN10sXHJcblx0XHRcInNpbHZlclwiOiBbMTkyLDE5MiwxOTJdLFxyXG5cdFx0XCJtZWRpdW12aW9sZXRyZWRcIjogWzE5OSwyMSwxMzNdLFxyXG5cdFx0XCJpbmRpYW5yZWRcIjogWzIwNSw5Miw5Ml0sXHJcblx0XHRcInBlcnVcIjogWzIwNSwxMzMsNjNdLFxyXG5cdFx0XCJjaG9jb2xhdGVcIjogWzIxMCwxMDUsMzBdLFxyXG5cdFx0XCJ0YW5cIjogWzIxMCwxODAsMTQwXSxcclxuXHRcdFwibGlnaHRncmF5XCI6IFsyMTEsMjExLDIxMV0sXHJcblx0XHRcImxpZ2h0Z3JleVwiOiBbMjExLDIxMSwyMTFdLFxyXG5cdFx0XCJwYWxldmlvbGV0cmVkXCI6IFsyMTYsMTEyLDE0N10sXHJcblx0XHRcInRoaXN0bGVcIjogWzIxNiwxOTEsMjE2XSxcclxuXHRcdFwib3JjaGlkXCI6IFsyMTgsMTEyLDIxNF0sXHJcblx0XHRcImdvbGRlbnJvZFwiOiBbMjE4LDE2NSwzMl0sXHJcblx0XHRcImNyaW1zb25cIjogWzIyMCwyMCw2MF0sXHJcblx0XHRcImdhaW5zYm9yb1wiOiBbMjIwLDIyMCwyMjBdLFxyXG5cdFx0XCJwbHVtXCI6IFsyMjEsMTYwLDIyMV0sXHJcblx0XHRcImJ1cmx5d29vZFwiOiBbMjIyLDE4NCwxMzVdLFxyXG5cdFx0XCJsaWdodGN5YW5cIjogWzIyNCwyNTUsMjU1XSxcclxuXHRcdFwibGF2ZW5kZXJcIjogWzIzMCwyMzAsMjUwXSxcclxuXHRcdFwiZGFya3NhbG1vblwiOiBbMjMzLDE1MCwxMjJdLFxyXG5cdFx0XCJ2aW9sZXRcIjogWzIzOCwxMzAsMjM4XSxcclxuXHRcdFwicGFsZWdvbGRlbnJvZFwiOiBbMjM4LDIzMiwxNzBdLFxyXG5cdFx0XCJsaWdodGNvcmFsXCI6IFsyNDAsMTI4LDEyOF0sXHJcblx0XHRcImtoYWtpXCI6IFsyNDAsMjMwLDE0MF0sXHJcblx0XHRcImFsaWNlYmx1ZVwiOiBbMjQwLDI0OCwyNTVdLFxyXG5cdFx0XCJob25leWRld1wiOiBbMjQwLDI1NSwyNDBdLFxyXG5cdFx0XCJhenVyZVwiOiBbMjQwLDI1NSwyNTVdLFxyXG5cdFx0XCJzYW5keWJyb3duXCI6IFsyNDQsMTY0LDk2XSxcclxuXHRcdFwid2hlYXRcIjogWzI0NSwyMjIsMTc5XSxcclxuXHRcdFwiYmVpZ2VcIjogWzI0NSwyNDUsMjIwXSxcclxuXHRcdFwid2hpdGVzbW9rZVwiOiBbMjQ1LDI0NSwyNDVdLFxyXG5cdFx0XCJtaW50Y3JlYW1cIjogWzI0NSwyNTUsMjUwXSxcclxuXHRcdFwiZ2hvc3R3aGl0ZVwiOiBbMjQ4LDI0OCwyNTVdLFxyXG5cdFx0XCJzYWxtb25cIjogWzI1MCwxMjgsMTE0XSxcclxuXHRcdFwiYW50aXF1ZXdoaXRlXCI6IFsyNTAsMjM1LDIxNV0sXHJcblx0XHRcImxpbmVuXCI6IFsyNTAsMjQwLDIzMF0sXHJcblx0XHRcImxpZ2h0Z29sZGVucm9keWVsbG93XCI6IFsyNTAsMjUwLDIxMF0sXHJcblx0XHRcIm9sZGxhY2VcIjogWzI1MywyNDUsMjMwXSxcclxuXHRcdFwicmVkXCI6IFsyNTUsMCwwXSxcclxuXHRcdFwiZnVjaHNpYVwiOiBbMjU1LDAsMjU1XSxcclxuXHRcdFwibWFnZW50YVwiOiBbMjU1LDAsMjU1XSxcclxuXHRcdFwiZGVlcHBpbmtcIjogWzI1NSwyMCwxNDddLFxyXG5cdFx0XCJvcmFuZ2VyZWRcIjogWzI1NSw2OSwwXSxcclxuXHRcdFwidG9tYXRvXCI6IFsyNTUsOTksNzFdLFxyXG5cdFx0XCJob3RwaW5rXCI6IFsyNTUsMTA1LDE4MF0sXHJcblx0XHRcImNvcmFsXCI6IFsyNTUsMTI3LDgwXSxcclxuXHRcdFwiZGFya29yYW5nZVwiOiBbMjU1LDE0MCwwXSxcclxuXHRcdFwibGlnaHRzYWxtb25cIjogWzI1NSwxNjAsMTIyXSxcclxuXHRcdFwib3JhbmdlXCI6IFsyNTUsMTY1LDBdLFxyXG5cdFx0XCJsaWdodHBpbmtcIjogWzI1NSwxODIsMTkzXSxcclxuXHRcdFwicGlua1wiOiBbMjU1LDE5MiwyMDNdLFxyXG5cdFx0XCJnb2xkXCI6IFsyNTUsMjE1LDBdLFxyXG5cdFx0XCJwZWFjaHB1ZmZcIjogWzI1NSwyMTgsMTg1XSxcclxuXHRcdFwibmF2YWpvd2hpdGVcIjogWzI1NSwyMjIsMTczXSxcclxuXHRcdFwibW9jY2FzaW5cIjogWzI1NSwyMjgsMTgxXSxcclxuXHRcdFwiYmlzcXVlXCI6IFsyNTUsMjI4LDE5Nl0sXHJcblx0XHRcIm1pc3R5cm9zZVwiOiBbMjU1LDIyOCwyMjVdLFxyXG5cdFx0XCJibGFuY2hlZGFsbW9uZFwiOiBbMjU1LDIzNSwyMDVdLFxyXG5cdFx0XCJwYXBheWF3aGlwXCI6IFsyNTUsMjM5LDIxM10sXHJcblx0XHRcImxhdmVuZGVyYmx1c2hcIjogWzI1NSwyNDAsMjQ1XSxcclxuXHRcdFwic2Vhc2hlbGxcIjogWzI1NSwyNDUsMjM4XSxcclxuXHRcdFwiY29ybnNpbGtcIjogWzI1NSwyNDgsMjIwXSxcclxuXHRcdFwibGVtb25jaGlmZm9uXCI6IFsyNTUsMjUwLDIwNV0sXHJcblx0XHRcImZsb3JhbHdoaXRlXCI6IFsyNTUsMjUwLDI0MF0sXHJcblx0XHRcInNub3dcIjogWzI1NSwyNTAsMjUwXSxcclxuXHRcdFwieWVsbG93XCI6IFsyNTUsMjU1LDBdLFxyXG5cdFx0XCJsaWdodHllbGxvd1wiOiBbMjU1LDI1NSwyMjRdLFxyXG5cdFx0XCJpdm9yeVwiOiBbMjU1LDI1NSwyNDBdLFxyXG5cdFx0XCJ3aGl0ZVwiOiBbMjU1LDI1NSwyNTVdXHJcblx0fVxyXG59O1xyXG4vKipcclxuICogQGNsYXNzIExpZ2h0aW5nIGNvbXB1dGF0aW9uLCBiYXNlZCBvbiBhIHRyYWRpdGlvbmFsIEZPViBmb3IgbXVsdGlwbGUgbGlnaHQgc291cmNlcyBhbmQgbXVsdGlwbGUgcGFzc2VzLlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSByZWZsZWN0aXZpdHlDYWxsYmFjayBDYWxsYmFjayB0byByZXRyaWV2ZSBjZWxsIHJlZmxlY3Rpdml0eSAoMC4uMSlcclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucGFzc2VzPTFdIE51bWJlciBvZiBwYXNzZXMuIDEgZXF1YWxzIHRvIHNpbXBsZSBGT1Ygb2YgYWxsIGxpZ2h0IHNvdXJjZXMsID4xIG1lYW5zIGEgKmhpZ2hseSBzaW1wbGlmaWVkKiByYWRpb3NpdHktbGlrZSBhbGdvcml0aG0uXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5lbWlzc2lvblRocmVzaG9sZD0xMDBdIENlbGxzIHdpdGggZW1pc3Npdml0eSA+IHRocmVzaG9sZCB3aWxsIGJlIHRyZWF0ZWQgYXMgbGlnaHQgc291cmNlIGluIHRoZSBuZXh0IHBhc3MuXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5yYW5nZT0xMF0gTWF4IGxpZ2h0IHJhbmdlXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcgPSBmdW5jdGlvbihyZWZsZWN0aXZpdHlDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdHRoaXMuX3JlZmxlY3Rpdml0eUNhbGxiYWNrID0gcmVmbGVjdGl2aXR5Q2FsbGJhY2s7XHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdHBhc3NlczogMSxcclxuXHRcdGVtaXNzaW9uVGhyZXNob2xkOiAxMDAsXHJcblx0XHRyYW5nZTogMTBcclxuXHR9O1xyXG5cdHRoaXMuX2ZvdiA9IG51bGw7XHJcblxyXG5cdHRoaXMuX2xpZ2h0cyA9IHt9O1xyXG5cdHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlID0ge307XHJcblx0dGhpcy5fZm92Q2FjaGUgPSB7fTtcclxuXHJcblx0dGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCBvcHRpb25zIGF0IHJ1bnRpbWVcclxuICogQHNlZSBST1QuTGlnaHRpbmdcclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cdGlmIChvcHRpb25zICYmIG9wdGlvbnMucmFuZ2UpIHsgdGhpcy5yZXNldCgpOyB9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHRoZSB1c2VkIEZpZWxkLU9mLVZpZXcgYWxnb1xyXG4gKiBAcGFyYW0ge1JPVC5GT1Z9IGZvdlxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5zZXRGT1YgPSBmdW5jdGlvbihmb3YpIHtcclxuXHR0aGlzLl9mb3YgPSBmb3Y7XHJcblx0dGhpcy5fZm92Q2FjaGUgPSB7fTtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgKG9yIHJlbW92ZSkgYSBsaWdodCBzb3VyY2VcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtudWxsIHx8IHN0cmluZyB8fCBudW1iZXJbM119IGNvbG9yXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLnNldExpZ2h0ID0gZnVuY3Rpb24oeCwgeSwgY29sb3IpIHtcclxuICB2YXIga2V5ID0geCArIFwiLFwiICsgeTtcclxuXHJcbiAgaWYgKGNvbG9yKSB7XHJcbiAgICB0aGlzLl9saWdodHNba2V5XSA9ICh0eXBlb2YoY29sb3IpID09IFwic3RyaW5nXCIgPyBST1QuQ29sb3IuZnJvbVN0cmluZyhjb2xvcikgOiBjb2xvcik7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9saWdodHNba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGFsbCBsaWdodCBzb3VyY2VzXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLmNsZWFyTGlnaHRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9saWdodHMgPSB7fTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXNldCB0aGUgcHJlLWNvbXB1dGVkIHRvcG9sb2d5IHZhbHVlcy4gQ2FsbCB3aGVuZXZlciB0aGUgdW5kZXJseWluZyBtYXAgY2hhbmdlcyBpdHMgbGlnaHQtcGFzc2FiaWxpdHkuXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGUgPSB7fTtcclxuXHR0aGlzLl9mb3ZDYWNoZSA9IHt9O1xyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHRoZSBsaWdodGluZ1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaWdodGluZ0NhbGxiYWNrIFdpbGwgYmUgY2FsbGVkIHdpdGggKHgsIHksIGNvbG9yKSBmb3IgZXZlcnkgbGl0IGNlbGxcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKGxpZ2h0aW5nQ2FsbGJhY2spIHtcclxuXHR2YXIgZG9uZUNlbGxzID0ge307XHJcblx0dmFyIGVtaXR0aW5nQ2VsbHMgPSB7fTtcclxuXHR2YXIgbGl0Q2VsbHMgPSB7fTtcclxuXHJcblx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2xpZ2h0cykgeyAvKiBwcmVwYXJlIGVtaXR0ZXJzIGZvciBmaXJzdCBwYXNzICovXHJcblx0XHR2YXIgbGlnaHQgPSB0aGlzLl9saWdodHNba2V5XTtcclxuXHRcdGVtaXR0aW5nQ2VsbHNba2V5XSA9IFswLCAwLCAwXTtcclxuXHRcdFJPVC5Db2xvci5hZGRfKGVtaXR0aW5nQ2VsbHNba2V5XSwgbGlnaHQpO1xyXG5cdH1cclxuXHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fb3B0aW9ucy5wYXNzZXM7aSsrKSB7IC8qIG1haW4gbG9vcCAqL1xyXG5cdFx0dGhpcy5fZW1pdExpZ2h0KGVtaXR0aW5nQ2VsbHMsIGxpdENlbGxzLCBkb25lQ2VsbHMpO1xyXG5cdFx0aWYgKGkrMSA9PSB0aGlzLl9vcHRpb25zLnBhc3NlcykgeyBjb250aW51ZTsgfSAvKiBub3QgZm9yIHRoZSBsYXN0IHBhc3MgKi9cclxuXHRcdGVtaXR0aW5nQ2VsbHMgPSB0aGlzLl9jb21wdXRlRW1pdHRlcnMobGl0Q2VsbHMsIGRvbmVDZWxscyk7XHJcblx0fVxyXG5cclxuXHRmb3IgKHZhciBsaXRLZXkgaW4gbGl0Q2VsbHMpIHsgLyogbGV0IHRoZSB1c2VyIGtub3cgd2hhdCBhbmQgaG93IGlzIGxpdCAqL1xyXG5cdFx0dmFyIHBhcnRzID0gbGl0S2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdHZhciB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xyXG5cdFx0dmFyIHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XHJcblx0XHRsaWdodGluZ0NhbGxiYWNrKHgsIHksIGxpdENlbGxzW2xpdEtleV0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBvbmUgaXRlcmF0aW9uIGZyb20gYWxsIGVtaXR0aW5nIGNlbGxzXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBlbWl0dGluZ0NlbGxzIFRoZXNlIGVtaXQgbGlnaHRcclxuICogQHBhcmFtIHtvYmplY3R9IGxpdENlbGxzIEFkZCBwcm9qZWN0ZWQgbGlnaHQgdG8gdGhlc2VcclxuICogQHBhcmFtIHtvYmplY3R9IGRvbmVDZWxscyBUaGVzZSBhbHJlYWR5IGVtaXR0ZWQsIGZvcmJpZCB0aGVtIGZyb20gZnVydGhlciBjYWxjdWxhdGlvbnNcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuX2VtaXRMaWdodCA9IGZ1bmN0aW9uKGVtaXR0aW5nQ2VsbHMsIGxpdENlbGxzLCBkb25lQ2VsbHMpIHtcclxuXHRmb3IgKHZhciBrZXkgaW4gZW1pdHRpbmdDZWxscykge1xyXG5cdFx0dmFyIHBhcnRzID0ga2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdHZhciB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xyXG5cdFx0dmFyIHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XHJcblx0XHR0aGlzLl9lbWl0TGlnaHRGcm9tQ2VsbCh4LCB5LCBlbWl0dGluZ0NlbGxzW2tleV0sIGxpdENlbGxzKTtcclxuXHRcdGRvbmVDZWxsc1trZXldID0gMTtcclxuXHR9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUHJlcGFyZSBhIGxpc3Qgb2YgZW1pdHRlcnMgZm9yIG5leHQgcGFzc1xyXG4gKiBAcGFyYW0ge29iamVjdH0gbGl0Q2VsbHNcclxuICogQHBhcmFtIHtvYmplY3R9IGRvbmVDZWxsc1xyXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5fY29tcHV0ZUVtaXR0ZXJzID0gZnVuY3Rpb24obGl0Q2VsbHMsIGRvbmVDZWxscykge1xyXG5cdHZhciByZXN1bHQgPSB7fTtcclxuXHJcblx0Zm9yICh2YXIga2V5IGluIGxpdENlbGxzKSB7XHJcblx0XHRpZiAoa2V5IGluIGRvbmVDZWxscykgeyBjb250aW51ZTsgfSAvKiBhbHJlYWR5IGVtaXR0ZWQgKi9cclxuXHJcblx0XHR2YXIgY29sb3IgPSBsaXRDZWxsc1trZXldO1xyXG5cclxuXHRcdGlmIChrZXkgaW4gdGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGUpIHtcclxuXHRcdFx0dmFyIHJlZmxlY3Rpdml0eSA9IHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlW2tleV07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcGFydHMgPSBrZXkuc3BsaXQoXCIsXCIpO1xyXG5cdFx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcclxuXHRcdFx0dmFyIHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XHJcblx0XHRcdHZhciByZWZsZWN0aXZpdHkgPSB0aGlzLl9yZWZsZWN0aXZpdHlDYWxsYmFjayh4LCB5KTtcclxuXHRcdFx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGVba2V5XSA9IHJlZmxlY3Rpdml0eTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocmVmbGVjdGl2aXR5ID09IDApIHsgY29udGludWU7IH0gLyogd2lsbCBub3QgcmVmbGVjdCBhdCBhbGwgKi9cclxuXHJcblx0XHQvKiBjb21wdXRlIGVtaXNzaW9uIGNvbG9yICovXHJcblx0XHR2YXIgZW1pc3Npb24gPSBbXTtcclxuXHRcdHZhciBpbnRlbnNpdHkgPSAwO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0dmFyIHBhcnQgPSBNYXRoLnJvdW5kKGNvbG9yW2ldKnJlZmxlY3Rpdml0eSk7XHJcblx0XHRcdGVtaXNzaW9uW2ldID0gcGFydDtcclxuXHRcdFx0aW50ZW5zaXR5ICs9IHBhcnQ7XHJcblx0XHR9XHJcblx0XHRpZiAoaW50ZW5zaXR5ID4gdGhpcy5fb3B0aW9ucy5lbWlzc2lvblRocmVzaG9sZCkgeyByZXN1bHRba2V5XSA9IGVtaXNzaW9uOyB9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgb25lIGl0ZXJhdGlvbiBmcm9tIG9uZSBjZWxsXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBsaXRDZWxscyBDZWxsIGRhdGEgdG8gYnkgdXBkYXRlZFxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5fZW1pdExpZ2h0RnJvbUNlbGwgPSBmdW5jdGlvbih4LCB5LCBjb2xvciwgbGl0Q2VsbHMpIHtcclxuXHR2YXIga2V5ID0geCtcIixcIit5O1xyXG5cdGlmIChrZXkgaW4gdGhpcy5fZm92Q2FjaGUpIHtcclxuXHRcdHZhciBmb3YgPSB0aGlzLl9mb3ZDYWNoZVtrZXldO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgZm92ID0gdGhpcy5fdXBkYXRlRk9WKHgsIHkpO1xyXG5cdH1cclxuXHJcblx0Zm9yICh2YXIgZm92S2V5IGluIGZvdikge1xyXG5cdFx0dmFyIGZvcm1GYWN0b3IgPSBmb3ZbZm92S2V5XTtcclxuXHJcblx0XHRpZiAoZm92S2V5IGluIGxpdENlbGxzKSB7IC8qIGFscmVhZHkgbGl0ICovXHJcblx0XHRcdHZhciByZXN1bHQgPSBsaXRDZWxsc1tmb3ZLZXldO1xyXG5cdFx0fSBlbHNlIHsgLyogbmV3bHkgbGl0ICovXHJcblx0XHRcdHZhciByZXN1bHQgPSBbMCwgMCwgMF07XHJcblx0XHRcdGxpdENlbGxzW2ZvdktleV0gPSByZXN1bHQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHsgcmVzdWx0W2ldICs9IE1hdGgucm91bmQoY29sb3JbaV0qZm9ybUZhY3Rvcik7IH0gLyogYWRkIGxpZ2h0IGNvbG9yICovXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIEZPViAoXCJmb3JtIGZhY3RvclwiKSBmb3IgYSBwb3RlbnRpYWwgbGlnaHQgc291cmNlIGF0IFt4LHldXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLl91cGRhdGVGT1YgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0dmFyIGtleTEgPSB4K1wiLFwiK3k7XHJcblx0dmFyIGNhY2hlID0ge307XHJcblx0dGhpcy5fZm92Q2FjaGVba2V5MV0gPSBjYWNoZTtcclxuXHR2YXIgcmFuZ2UgPSB0aGlzLl9vcHRpb25zLnJhbmdlO1xyXG5cdHZhciBjYiA9IGZ1bmN0aW9uKHgsIHksIHIsIHZpcykge1xyXG5cdFx0dmFyIGtleTIgPSB4K1wiLFwiK3k7XHJcblx0XHR2YXIgZm9ybUZhY3RvciA9IHZpcyAqICgxLXIvcmFuZ2UpO1xyXG5cdFx0aWYgKGZvcm1GYWN0b3IgPT0gMCkgeyByZXR1cm47IH1cclxuXHRcdGNhY2hlW2tleTJdID0gZm9ybUZhY3RvcjtcclxuXHR9O1xyXG5cdHRoaXMuX2Zvdi5jb21wdXRlKHgsIHksIHJhbmdlLCBjYi5iaW5kKHRoaXMpKTtcclxuXHJcblx0cmV0dXJuIGNhY2hlO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEFic3RyYWN0IHBhdGhmaW5kZXJcclxuICogQHBhcmFtIHtpbnR9IHRvWCBUYXJnZXQgWCBjb29yZFxyXG4gKiBAcGFyYW0ge2ludH0gdG9ZIFRhcmdldCBZIGNvb3JkXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHBhc3NhYmxlQ2FsbGJhY2sgQ2FsbGJhY2sgdG8gZGV0ZXJtaW5lIG1hcCBwYXNzYWJpbGl0eVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50b3BvbG9neT04XVxyXG4gKi9cclxuUk9ULlBhdGggPSBmdW5jdGlvbih0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdHRoaXMuX3RvWCA9IHRvWDtcclxuXHR0aGlzLl90b1kgPSB0b1k7XHJcblx0dGhpcy5fZnJvbVggPSBudWxsO1xyXG5cdHRoaXMuX2Zyb21ZID0gbnVsbDtcclxuXHR0aGlzLl9wYXNzYWJsZUNhbGxiYWNrID0gcGFzc2FibGVDYWxsYmFjaztcclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0dG9wb2xvZ3k6IDhcclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cclxuXHR0aGlzLl9kaXJzID0gUk9ULkRJUlNbdGhpcy5fb3B0aW9ucy50b3BvbG9neV07XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gOCkgeyAvKiByZW9yZGVyIGRpcnMgZm9yIG1vcmUgYWVzdGhldGljIHJlc3VsdCAodmVydGljYWwvaG9yaXpvbnRhbCBmaXJzdCkgKi9cclxuXHRcdHRoaXMuX2RpcnMgPSBbXHJcblx0XHRcdHRoaXMuX2RpcnNbMF0sXHJcblx0XHRcdHRoaXMuX2RpcnNbMl0sXHJcblx0XHRcdHRoaXMuX2RpcnNbNF0sXHJcblx0XHRcdHRoaXMuX2RpcnNbNl0sXHJcblx0XHRcdHRoaXMuX2RpcnNbMV0sXHJcblx0XHRcdHRoaXMuX2RpcnNbM10sXHJcblx0XHRcdHRoaXMuX2RpcnNbNV0sXHJcblx0XHRcdHRoaXMuX2RpcnNbN11cclxuXHRcdF1cclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBhIHBhdGggZnJvbSBhIGdpdmVuIHBvaW50XHJcbiAqIEBwYXJhbSB7aW50fSBmcm9tWFxyXG4gKiBAcGFyYW0ge2ludH0gZnJvbVlcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgV2lsbCBiZSBjYWxsZWQgZm9yIGV2ZXJ5IHBhdGggaXRlbSB3aXRoIGFyZ3VtZW50cyBcInhcIiBhbmQgXCJ5XCJcclxuICovXHJcblJPVC5QYXRoLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZLCBjYWxsYmFjaykge1xyXG59O1xyXG5cclxuUk9ULlBhdGgucHJvdG90eXBlLl9nZXROZWlnaGJvcnMgPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHR2YXIgcmVzdWx0ID0gW107XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fZGlycy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgZGlyID0gdGhpcy5fZGlyc1tpXTtcclxuXHRcdHZhciB4ID0gY3ggKyBkaXJbMF07XHJcblx0XHR2YXIgeSA9IGN5ICsgZGlyWzFdO1xyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuX3Bhc3NhYmxlQ2FsbGJhY2soeCwgeSkpIHsgY29udGludWU7IH1cclxuXHRcdHJlc3VsdC5wdXNoKFt4LCB5XSk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgU2ltcGxpZmllZCBEaWprc3RyYSdzIGFsZ29yaXRobTogYWxsIGVkZ2VzIGhhdmUgYSB2YWx1ZSBvZiAxXHJcbiAqIEBhdWdtZW50cyBST1QuUGF0aFxyXG4gKiBAc2VlIFJPVC5QYXRoXHJcbiAqL1xyXG5ST1QuUGF0aC5EaWprc3RyYSA9IGZ1bmN0aW9uKHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0Uk9ULlBhdGguY2FsbCh0aGlzLCB0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucyk7XHJcblxyXG5cdHRoaXMuX2NvbXB1dGVkID0ge307XHJcblx0dGhpcy5fdG9kbyA9IFtdO1xyXG5cdHRoaXMuX2FkZCh0b1gsIHRvWSwgbnVsbCk7XHJcbn07XHJcblJPVC5QYXRoLkRpamtzdHJhLmV4dGVuZChST1QuUGF0aCk7XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBhIHBhdGggZnJvbSBhIGdpdmVuIHBvaW50XHJcbiAqIEBzZWUgUk9ULlBhdGgjY29tcHV0ZVxyXG4gKi9cclxuUk9ULlBhdGguRGlqa3N0cmEucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihmcm9tWCwgZnJvbVksIGNhbGxiYWNrKSB7XHJcblx0dmFyIGtleSA9IGZyb21YK1wiLFwiK2Zyb21ZO1xyXG5cdGlmICghKGtleSBpbiB0aGlzLl9jb21wdXRlZCkpIHsgdGhpcy5fY29tcHV0ZShmcm9tWCwgZnJvbVkpOyB9XHJcblx0aWYgKCEoa2V5IGluIHRoaXMuX2NvbXB1dGVkKSkgeyByZXR1cm47IH1cclxuXHRcclxuXHR2YXIgaXRlbSA9IHRoaXMuX2NvbXB1dGVkW2tleV07XHJcblx0d2hpbGUgKGl0ZW0pIHtcclxuXHRcdGNhbGxiYWNrKGl0ZW0ueCwgaXRlbS55KTtcclxuXHRcdGl0ZW0gPSBpdGVtLnByZXY7XHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgYSBub24tY2FjaGVkIHZhbHVlXHJcbiAqL1xyXG5ST1QuUGF0aC5EaWprc3RyYS5wcm90b3R5cGUuX2NvbXB1dGUgPSBmdW5jdGlvbihmcm9tWCwgZnJvbVkpIHtcclxuXHR3aGlsZSAodGhpcy5fdG9kby5sZW5ndGgpIHtcclxuXHRcdHZhciBpdGVtID0gdGhpcy5fdG9kby5zaGlmdCgpO1xyXG5cdFx0aWYgKGl0ZW0ueCA9PSBmcm9tWCAmJiBpdGVtLnkgPT0gZnJvbVkpIHsgcmV0dXJuOyB9XHJcblx0XHRcclxuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXROZWlnaGJvcnMoaXRlbS54LCBpdGVtLnkpO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvcnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHR2YXIgbmVpZ2hib3IgPSBuZWlnaGJvcnNbaV07XHJcblx0XHRcdHZhciB4ID0gbmVpZ2hib3JbMF07XHJcblx0XHRcdHZhciB5ID0gbmVpZ2hib3JbMV07XHJcblx0XHRcdHZhciBpZCA9IHgrXCIsXCIreTtcclxuXHRcdFx0aWYgKGlkIGluIHRoaXMuX2NvbXB1dGVkKSB7IGNvbnRpbnVlOyB9IC8qIGFscmVhZHkgZG9uZSAqL1x0XHJcblx0XHRcdHRoaXMuX2FkZCh4LCB5LCBpdGVtKTsgXHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULlBhdGguRGlqa3N0cmEucHJvdG90eXBlLl9hZGQgPSBmdW5jdGlvbih4LCB5LCBwcmV2KSB7XHJcblx0dmFyIG9iaiA9IHtcclxuXHRcdHg6IHgsXHJcblx0XHR5OiB5LFxyXG5cdFx0cHJldjogcHJldlxyXG5cdH07XHJcblx0dGhpcy5fY29tcHV0ZWRbeCtcIixcIit5XSA9IG9iajtcclxuXHR0aGlzLl90b2RvLnB1c2gob2JqKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBTaW1wbGlmaWVkIEEqIGFsZ29yaXRobTogYWxsIGVkZ2VzIGhhdmUgYSB2YWx1ZSBvZiAxXHJcbiAqIEBhdWdtZW50cyBST1QuUGF0aFxyXG4gKiBAc2VlIFJPVC5QYXRoXHJcbiAqL1xyXG5ST1QuUGF0aC5BU3RhciA9IGZ1bmN0aW9uKHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0Uk9ULlBhdGguY2FsbCh0aGlzLCB0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucyk7XHJcblxyXG5cdHRoaXMuX3RvZG8gPSBbXTtcclxuXHR0aGlzLl9kb25lID0ge307XHJcblx0dGhpcy5fZnJvbVggPSBudWxsO1xyXG5cdHRoaXMuX2Zyb21ZID0gbnVsbDtcclxufTtcclxuUk9ULlBhdGguQVN0YXIuZXh0ZW5kKFJPVC5QYXRoKTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIGEgcGF0aCBmcm9tIGEgZ2l2ZW4gcG9pbnRcclxuICogQHNlZSBST1QuUGF0aCNjb21wdXRlXHJcbiAqL1xyXG5ST1QuUGF0aC5BU3Rhci5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKGZyb21YLCBmcm9tWSwgY2FsbGJhY2spIHtcclxuXHR0aGlzLl90b2RvID0gW107XHJcblx0dGhpcy5fZG9uZSA9IHt9O1xyXG5cdHRoaXMuX2Zyb21YID0gZnJvbVg7XHJcblx0dGhpcy5fZnJvbVkgPSBmcm9tWTtcclxuXHR0aGlzLl9hZGQodGhpcy5fdG9YLCB0aGlzLl90b1ksIG51bGwpO1xyXG5cclxuXHR3aGlsZSAodGhpcy5fdG9kby5sZW5ndGgpIHtcclxuXHRcdHZhciBpdGVtID0gdGhpcy5fdG9kby5zaGlmdCgpO1xyXG5cdFx0aWYgKGl0ZW0ueCA9PSBmcm9tWCAmJiBpdGVtLnkgPT0gZnJvbVkpIHsgYnJlYWs7IH1cclxuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXROZWlnaGJvcnMoaXRlbS54LCBpdGVtLnkpO1xyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPG5laWdoYm9ycy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHZhciBuZWlnaGJvciA9IG5laWdoYm9yc1tpXTtcclxuXHRcdFx0dmFyIHggPSBuZWlnaGJvclswXTtcclxuXHRcdFx0dmFyIHkgPSBuZWlnaGJvclsxXTtcclxuXHRcdFx0dmFyIGlkID0geCtcIixcIit5O1xyXG5cdFx0XHRpZiAoaWQgaW4gdGhpcy5fZG9uZSkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHR0aGlzLl9hZGQoeCwgeSwgaXRlbSk7IFxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHR2YXIgaXRlbSA9IHRoaXMuX2RvbmVbZnJvbVgrXCIsXCIrZnJvbVldO1xyXG5cdGlmICghaXRlbSkgeyByZXR1cm47IH1cclxuXHRcclxuXHR3aGlsZSAoaXRlbSkge1xyXG5cdFx0Y2FsbGJhY2soaXRlbS54LCBpdGVtLnkpO1xyXG5cdFx0aXRlbSA9IGl0ZW0ucHJldjtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuUGF0aC5BU3Rhci5wcm90b3R5cGUuX2FkZCA9IGZ1bmN0aW9uKHgsIHksIHByZXYpIHtcclxuXHR2YXIgaCA9IHRoaXMuX2Rpc3RhbmNlKHgsIHkpO1xyXG5cdHZhciBvYmogPSB7XHJcblx0XHR4OiB4LFxyXG5cdFx0eTogeSxcclxuXHRcdHByZXY6IHByZXYsXHJcblx0XHRnOiAocHJldiA/IHByZXYuZysxIDogMCksXHJcblx0XHRoOiBoXHJcblx0fTtcclxuXHR0aGlzLl9kb25lW3grXCIsXCIreV0gPSBvYmo7XHJcblx0XHJcblx0LyogaW5zZXJ0IGludG8gcHJpb3JpdHkgcXVldWUgKi9cclxuXHRcclxuXHR2YXIgZiA9IG9iai5nICsgb2JqLmg7XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fdG9kby5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IHRoaXMuX3RvZG9baV07XHJcblx0XHR2YXIgaXRlbUYgPSBpdGVtLmcgKyBpdGVtLmg7XHJcblx0XHRpZiAoZiA8IGl0ZW1GIHx8IChmID09IGl0ZW1GICYmIGggPCBpdGVtLmgpKSB7XHJcblx0XHRcdHRoaXMuX3RvZG8uc3BsaWNlKGksIDAsIG9iaik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGhpcy5fdG9kby5wdXNoKG9iaik7XHJcbn07XHJcblxyXG5ST1QuUGF0aC5BU3Rhci5wcm90b3R5cGUuX2Rpc3RhbmNlID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdHN3aXRjaCAodGhpcy5fb3B0aW9ucy50b3BvbG9neSkge1xyXG5cdFx0Y2FzZSA0OlxyXG5cdFx0XHRyZXR1cm4gKE1hdGguYWJzKHgtdGhpcy5fZnJvbVgpICsgTWF0aC5hYnMoeS10aGlzLl9mcm9tWSkpO1xyXG5cdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSA2OlxyXG5cdFx0XHR2YXIgZHggPSBNYXRoLmFicyh4IC0gdGhpcy5fZnJvbVgpO1xyXG5cdFx0XHR2YXIgZHkgPSBNYXRoLmFicyh5IC0gdGhpcy5fZnJvbVkpO1xyXG5cdFx0XHRyZXR1cm4gZHkgKyBNYXRoLm1heCgwLCAoZHgtZHkpLzIpO1xyXG5cdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSA4OiBcclxuXHRcdFx0cmV0dXJuIE1hdGgubWF4KE1hdGguYWJzKHgtdGhpcy5fZnJvbVgpLCBNYXRoLmFicyh5LXRoaXMuX2Zyb21ZKSk7XHJcblx0XHRicmVhaztcclxuXHR9XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgdG9wb2xvZ3lcIik7XHJcbn07XHJcbiAgcmV0dXJuIFJPVDtcclxufSkpO1xyXG4iXX0=
