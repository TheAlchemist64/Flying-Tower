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

var _actor = require('./actor');

var _actor2 = _interopRequireDefault(_actor);

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

},{"../../vendor/eventbus.min":10,"../../vendor/rot":11,"./actor":1,"./actors/monster":2,"./actors/player":3,"./ai/basic":4,"./glyph":7,"./map.js":8,"./tile.js":9}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxhY3Rvci5qcyIsImFzc2V0c1xcanNcXGFjdG9yc1xcbW9uc3Rlci5qcyIsImFzc2V0c1xcanNcXGFjdG9yc1xccGxheWVyLmpzIiwiYXNzZXRzXFxqc1xcYWlcXGJhc2ljLmpzIiwiYXNzZXRzXFxqc1xcYXBwLmpzIiwiYXNzZXRzXFxqc1xcZ2FtZS5qcyIsImFzc2V0c1xcanNcXGdseXBoLmpzIiwiYXNzZXRzXFxqc1xcbWFwLmpzIiwiYXNzZXRzXFxqc1xcdGlsZS5qcyIsInZlbmRvclxcZXZlbnRidXMubWluLmpzIiwidmVuZG9yXFxyb3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7O0lBRXFCLEs7QUFDcEIsZ0JBQVksSUFBWixFQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixLQUF4QixFQUE4QjtBQUFBOztBQUM3QixPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsT0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLE9BQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsaUJBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsSUFBakI7QUFDQSxpQkFBSyxTQUFMLENBQWUsR0FBZixDQUFtQixJQUFuQixFQUF3QixJQUF4QjtBQUNBOzs7O3dCQUNJLENBQUU7Ozt5QkFDRDtBQUNMLFFBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBSyxDQUFyQixFQUF3QixLQUFLLENBQTdCO0FBQ0E7OzsyQkFDUSxDLEVBQUcsQyxFQUFFO0FBQUE7O0FBQ2IsT0FBSSxXQUFXLEtBQWY7QUFDQSxPQUFJLFFBQVEsSUFBWjtBQUNBLGtCQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLFVBQUMsS0FBRCxFQUFTO0FBQzVCLFFBQUcsU0FBTSxLQUFOLElBQWUsS0FBRyxNQUFNLENBQXhCLElBQTZCLEtB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RUFsQkQ7QUFtQkUsUUFBTyxHQUFQO0FBQ0QsQ0EzdEtBLENBQUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihuYW1lLCB4LCB5LCBnbHlwaCl7XHJcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLmdseXBoID0gZ2x5cGg7XHJcblx0XHRHYW1lLmFjdG9ycy5wdXNoKHRoaXMpO1xyXG5cdFx0R2FtZS5zY2hlZHVsZXIuYWRkKHRoaXMsdHJ1ZSk7XHJcblx0fVxyXG5cdGFjdCgpe31cclxuXHRkcmF3KCl7XHJcblx0XHR0aGlzLmdseXBoLmRyYXcodGhpcy54LCB0aGlzLnkpO1xyXG5cdH1cclxuXHRjb2xsaWRlcyh4LCB5KXtcclxuXHRcdGxldCBjb2xsaWRlcyA9IGZhbHNlO1xyXG5cdFx0bGV0IG90aGVyID0gbnVsbDtcclxuXHRcdEdhbWUuYWN0b3JzLmZvckVhY2goKGFjdG9yKT0+e1xyXG5cdFx0XHRpZih0aGlzIT1hY3RvciAmJiB4PT1hY3Rvci54ICYmIHk9PWFjdG9yLnkpe1xyXG5cdFx0XHRcdGNvbGxpZGVzID0gdHJ1ZTtcclxuXHRcdFx0XHRvdGhlciA9IGFjdG9yO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBbY29sbGlkZXMsIG90aGVyXTtcclxuXHR9XHJcblx0bW92ZSh4LCB5KXtcclxuXHRcdGlmKCFHYW1lLm1hcC5pbkJvdW5kcyh4LCB5KSl7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHRpbGVUeXBlID0gR2FtZS5tYXAuZ2V0KHgsIHkpLnR5cGU7XHJcblx0XHRzd2l0Y2godGlsZVR5cGUpe1xyXG5cdFx0XHRjYXNlICd3YWxsJzpcclxuXHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnc2t5JzpcclxuXHRcdFx0XHRHYW1lLm1hcC5nZXQodGhpcy54LCB0aGlzLnkpLmRyYXcoKTtcclxuXHRcdFx0XHRHYW1lLnNjaGVkdWxlci5yZW1vdmUodGhpcyk7XHJcblx0XHRcdFx0R2FtZS5hY3RvcnMuc3BsaWNlKEdhbWUuYWN0b3JzLmluZGV4T2YodGhpcyksMSk7XHJcblx0XHRcdFx0aWYodGhpcyA9PSBHYW1lLnBsYXllcil7XHJcblx0XHRcdFx0XHRHYW1lLm92ZXIoZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gMTtcclxuXHRcdH1cclxuXHRcdGxldCBbY29sbGlkZXMsIG90aGVyXSA9IHRoaXMuY29sbGlkZXMoeCwgeSk7XHJcblx0XHRpZihjb2xsaWRlcyl7XHJcblx0XHRcdC8vUHVzaCBhY3RvclxyXG5cdFx0XHRsZXQgZHggPSB4IC0gdGhpcy54O1xyXG5cdFx0XHRsZXQgZHkgPSB5IC0gdGhpcy55O1xyXG5cdFx0XHRsZXQgbXYgPSBvdGhlci5tb3ZlKG90aGVyLngrZHgsb3RoZXIueStkeSk7XHJcblx0XHRcdGlmKCFtdil7XHJcblx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vQ2FwdHVyZSBjdXJyZW50IHBvc2l0aW9uXHJcblx0XHRsZXQgY3ggPSB0aGlzLng7XHJcblx0XHRsZXQgY3kgPSB0aGlzLnk7XHJcblx0XHQvL1NldCBuZXcgcG9zaXRpb25cclxuXHRcdHRoaXMueCA9IHg7XHJcblx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0Ly9SZXNldCBhY3RvcidzIHByZXZpb3VzIHRpbGUgYW5kIGRyYXcgYWN0b3Igb24gbmV3IHRpbGVcclxuXHRcdEdhbWUubWFwLmdldChjeCwgY3kpLmRyYXcoKTtcclxuXHRcdHRoaXMuZHJhdygpO1xyXG5cdFx0cmV0dXJuIDE7XHJcblx0fVxyXG59IiwiaW1wb3J0IEFjdG9yIGZyb20gJy4uL2FjdG9yJztcclxuaW1wb3J0IEdhbWUgZnJvbSAnLi8uLi9nYW1lJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vbnN0ZXIgZXh0ZW5kcyBBY3RvcntcclxuXHRjb25zdHJ1Y3RvcihuYW1lLCB4LCB5LCBnbHlwaCwgYWkpe1xyXG5cdFx0c3VwZXIobmFtZSwgeCwgeSwgZ2x5cGgpO1xyXG5cdFx0dGhpcy5haSA9IGFpO1xyXG5cdH1cclxuXHRhY3QoKXtcclxuXHRcdHRoaXMuYWkucnVuKHRoaXMpO1xyXG5cdH1cclxufSIsImltcG9ydCBBY3RvciBmcm9tICcuLi9hY3Rvcic7XHJcbmltcG9ydCBST1QgZnJvbSAnLi4vLi4vLi4vdmVuZG9yL3JvdCc7XHJcbmltcG9ydCBHYW1lIGZyb20gJy4vLi4vZ2FtZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBBY3RvcntcclxuXHRhY3QoKXtcclxuXHRcdEdhbWUuZW5naW5lLmxvY2soKTtcclxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyx0aGlzKTtcclxuXHR9XHJcblx0aGFuZGxlRXZlbnQoZSl7XHJcblx0XHRsZXQgY29kZSA9IGUua2V5Q29kZTtcclxuXHRcdGxldCB4ID0gdGhpcy54O1xyXG5cdFx0bGV0IHkgPSB0aGlzLnk7XHJcblx0XHRzd2l0Y2goY29kZSl7XHJcblx0XHRcdGNhc2UgUk9ULlZLX1VQOlxyXG5cdFx0XHRcdHN1cGVyLm1vdmUoeCx5LTEpO1xyXG5cdFx0XHRcdEdhbWUuYnVzLmRpc3BhdGNoKCdwbGF5ZXJtb3ZlJywgdGhpcyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgUk9ULlZLX1JJR0hUOlxyXG5cdFx0XHRcdHN1cGVyLm1vdmUoeCsxLHkpO1xyXG5cdFx0XHRcdEdhbWUuYnVzLmRpc3BhdGNoKCdwbGF5ZXJtb3ZlJywgdGhpcyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgUk9ULlZLX0RPV046XHJcblx0XHRcdFx0c3VwZXIubW92ZSh4LHkrMSk7XHJcblx0XHRcdFx0R2FtZS5idXMuZGlzcGF0Y2goJ3BsYXllcm1vdmUnLCB0aGlzKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBST1QuVktfTEVGVDpcclxuXHRcdFx0XHRzdXBlci5tb3ZlKHgtMSx5KTtcclxuXHRcdFx0XHRHYW1lLmJ1cy5kaXNwYXRjaCgncGxheWVybW92ZScsIHRoaXMpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFJPVC5WS19QRVJJT0Q6XHJcblx0XHRcdFx0YnJlYWs7IC8vV2FpdFxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHJldHVybjsgLy9LZXlib2FyZCBpbnB1dCBub3QgcmVjb2duaXplZC5cclxuXHRcdH1cclxuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJyx0aGlzKTtcclxuXHRcdEdhbWUuZW5naW5lLnVubG9jaygpO1xyXG5cdH1cdFxyXG5cdGNhbkZhbGwoKXtcclxuXHRcdGxldCB4ID0gdGhpcy54O1xyXG5cdFx0bGV0IHkgPSB0aGlzLnk7XHJcblx0XHRsZXQgbmVpZ2hib3JzID0gW1t4LTEseV0sW3gseS0xXSxbeCsxLHldLFt4LHkrMV1dO1xyXG5cdFx0bGV0IHNreSA9IG51bGw7XHJcblx0XHRuZWlnaGJvcnMuZm9yRWFjaCgobik9PntcclxuXHRcdFx0aWYoR2FtZS5tYXAuZ2V0KG5bMF0sblsxXSkudHlwZSA9PSAnc2t5Jyl7XHJcblx0XHRcdFx0c2t5ID0ge3g6blswXSx5Om5bMV19O1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdGlmKCFza3kpe1xyXG5cdFx0XHRyZXR1cm4gW2ZhbHNlLCBudWxsXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBbdHJ1ZSwgc2t5XTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgUk9UIGZyb20gJy4uLy4uLy4uL3ZlbmRvci9yb3QnO1xyXG5pbXBvcnQgR2FtZSBmcm9tICcuLi9nYW1lJztcclxuXHJcbmZ1bmN0aW9uIGlzUGFzc2FibGUoeCwgeSwgYWN0b3Ipe1xyXG5cdGxldCBwYXNzYWJsZSA9IHRydWU7XHJcblx0aWYoWyd3YWxsJywnc2t5J10uaW5jbHVkZXMoR2FtZS5tYXAuZ2V0KHgsIHkpLnR5cGUpKXtcclxuXHRcdHBhc3NhYmxlID0gZmFsc2U7XHJcblx0fVxyXG5cdGxldCBbY29sbGlkZXMsIG90aGVyXSA9IGFjdG9yLmNvbGxpZGVzKHgsIHkpO1xyXG5cdGlmKGNvbGxpZGVzKXtcclxuXHRcdHBhc3NhYmxlID0gZmFsc2U7XHJcblx0fVxyXG5cdHJldHVybiBwYXNzYWJsZTtcclxufVxyXG5cclxuY2xhc3MgQmFzaWNBSSB7XHJcblx0cnVuKGFjdG9yKXtcclxuXHRcdGxldCBbcmVzdWx0LCB0aWxlXSA9IEdhbWUucGxheWVyLmNhbkZhbGwoKTtcclxuXHRcdGlmKCFyZXN1bHQpe1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHQvL0dldCB0aGUgdGlsZSB0aGUgQUkgbmVlZHMgdG8gYmUgb24gaW4gb3JkZXIgdG8gcHVzaCB0aGUgcGxheWVyIG9mZlxyXG5cdFx0bGV0IHggPSBHYW1lLnBsYXllci54IC0gKHRpbGUueCAtIEdhbWUucGxheWVyLngpO1xyXG5cdFx0bGV0IHkgPSBHYW1lLnBsYXllci55IC0gKHRpbGUueSAtIEdhbWUucGxheWVyLnkpO1xyXG5cdFx0Ly9NYWtlIHBhc3NhYmxlIGZ1bmN0aW9uIGNhbGxiYWNrXHJcblx0XHRsZXQgcGFzc2FibGVDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpe1xyXG5cdFx0XHRsZXQgcmVzdWx0ID0gaXNQYXNzYWJsZSh4LCB5LCBhY3Rvcik7XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9XHJcblx0XHQvL0luaXRpYWxpemUgcGF0aGZpbmRlclxyXG5cdFx0bGV0IGZpbmRlciA9IG5ldyBST1QuUGF0aC5BU3Rhcih4LCB5LCBwYXNzYWJsZUNhbGxiYWNrLCB7dG9wb2xvZ3k6NH0pO1xyXG5cdFx0Ly9GaW5kIHBhdGggdG8gdGlsZSB3aGVyZSBhaSBjYW4gcHVzaCB0aGUgcGxheWVyIG9mZlxyXG5cdFx0bGV0IHBhdGggPSBbXTtcclxuXHRcdGZpbmRlci5jb21wdXRlKGFjdG9yLngsIGFjdG9yLnksICh4LCB5KT0+e1xyXG5cdFx0XHRwYXRoLnB1c2goe3g6IHgsIHk6IHl9KTtcclxuXHRcdH0pO1xyXG5cdFx0aWYocGF0aC5sZW5ndGggPT0gMSl7XHJcblx0XHRcdGFjdG9yLm1vdmUoR2FtZS5wbGF5ZXIueCwgR2FtZS5wbGF5ZXIueSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKHBhdGgubGVuZ3RoID4gMSl7XHJcblx0XHRcdGFjdG9yLm1vdmUocGF0aFsxXS54LCBwYXRoWzFdLnkpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IHsgQmFzaWNBSSB9OyIsImltcG9ydCBST1QgZnJvbSBcIi4uLy4uL3ZlbmRvci9yb3RcIlxyXG5pbXBvcnQgR2FtZSBmcm9tICcuL2dhbWUnXHJcbmltcG9ydCB7IFRpbGUgfSBmcm9tICcuL3RpbGUnO1xyXG5cclxuaWYoIVJPVC5pc1N1cHBvcnRlZCgpKXtcclxuXHRhbGVydChcIlRoZSByb3QuanMgbGlicmFyeSBpc24ndCBzdXBwb3J0ZWQgYnkgeW91ciBicm93c2VyLlwiKTtcclxufVxyXG5lbHNle1xyXG5cdEdhbWUuaW5pdCgpO1xyXG59IiwiaW1wb3J0IFJPVCBmcm9tICcuLi8uLi92ZW5kb3Ivcm90JztcclxuaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4uLy4uL3ZlbmRvci9ldmVudGJ1cy5taW4nO1xyXG5cclxuaW1wb3J0IFRpbGVNYXAgZnJvbSAnLi9tYXAuanMnO1xyXG5pbXBvcnQgeyBUaWxlLCBUaWxlVHlwZXMgfSBmcm9tICcuL3RpbGUuanMnO1xyXG5pbXBvcnQgQWN0b3IgZnJvbSAnLi9hY3Rvcic7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9hY3RvcnMvcGxheWVyJztcclxuaW1wb3J0IE1vbnN0ZXIgZnJvbSAnLi9hY3RvcnMvbW9uc3Rlcic7XHJcbmltcG9ydCBHbHlwaCBmcm9tICcuL2dseXBoJztcclxuaW1wb3J0IHsgQmFzaWNBSSB9IGZyb20gJy4vYWkvYmFzaWMnO1xyXG5cclxuY29uc3QgdyA9IDUwO1xyXG5jb25zdCBoID0gMjU7XHJcblxyXG52YXIgcmFuZEludCA9IGZ1bmN0aW9uKGEsIGIpe1xyXG5cdHJldHVybiBhICsgTWF0aC5mbG9vcigoYi1hKSAqIFJPVC5STkcuZ2V0VW5pZm9ybSgpKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG5cdGRpc3BsYXk6IG51bGwsXHJcblx0bWFwOiBudWxsLFxyXG5cdGJ1czogbnVsbCxcclxuXHRhY3RvcnM6IFtdLFxyXG5cdHBsYXllcjogbnVsbCxcclxuXHRzY2hlZHVsZXI6IG51bGwsXHJcblx0ZW5naW5lOiBudWxsLFxyXG5cdFxyXG5cdGluaXQoKXtcclxuXHRcdC8vSW5pdGlhbGl6ZSBEaXNwbGF5XHJcblx0XHR0aGlzLmRpc3BsYXkgPSBuZXcgUk9ULkRpc3BsYXkoe3dpZHRoOiB3LCBoZWlnaHQ6IGh9KTtcclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kaXNwbGF5LmdldENvbnRhaW5lcigpKTtcclxuXHRcdC8vR2VuZXJhdGUgTWFwXHJcblx0XHR0aGlzLm1hcCA9IG5ldyBUaWxlTWFwKHcsIGgpO1xyXG5cdFx0bGV0IGdlbmVyYXRvciA9IG5ldyBST1QuTWFwLkFyZW5hKHctNCxoLTQpO1xyXG5cdFx0Z2VuZXJhdG9yLmNyZWF0ZSgoeCwgeSwgd2FsbCk9PntcclxuXHRcdFx0bGV0IFdBTEwgPSBUaWxlVHlwZXMuV0FMTDtcclxuXHRcdFx0bGV0IEZMT09SID0gVGlsZVR5cGVzLkZMT09SO1xyXG5cdFx0XHR0aGlzLm1hcC5zZXQoeCsyLCB5KzIsIG5ldyBUaWxlKHgrMiwgeSsyLCB3YWxsID8gV0FMTDogRkxPT1IpKTtcclxuXHRcdH0pO1xyXG5cdFx0Ly9HZW5lcmF0ZSBob2xlcyBpbiB0aGUgZmxvb3JcclxuXHRcdGxldCBob2xlcyA9IDU7XHJcblx0XHR3aGlsZShob2xlcyA+IDApe1xyXG5cdFx0XHRsZXQgeCA9IHJhbmRJbnQoMiwgdy0yKTtcclxuXHRcdFx0bGV0IHkgPSByYW5kSW50KDIsIGgtMik7XHJcblx0XHRcdHRoaXMubWFwLnNldCh4LCB5LCBuZXcgVGlsZSh4LCB5LCBUaWxlVHlwZXMuU0tZKSk7XHJcblx0XHRcdGhvbGVzLS07XHJcblx0XHR9XHJcblx0XHR0aGlzLm1hcC5kcmF3KCk7XHJcblx0XHQvL0FkZCBFdmVudCBCdXMgdG8gZ2xvYmFsIG9iamVjdFxyXG5cdFx0dGhpcy5idXMgPSBFdmVudEJ1cztcclxuXHRcdC8vSW5pdGlhbGl6ZSBUdXJuIEVuZ2luZVxyXG5cdFx0dGhpcy5zY2hlZHVsZXIgPSBuZXcgUk9ULlNjaGVkdWxlci5TaW1wbGUoKTtcclxuXHRcdHRoaXMuZW5naW5lID0gbmV3IFJPVC5FbmdpbmUodGhpcy5zY2hlZHVsZXIpO1xyXG5cdFx0Ly9DcmVhdGUgUGxheWVyXHJcblx0XHR0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoJ1BsYXllcicsNCw0LG5ldyBHbHlwaCgnQCcsJyNmZmYnKSk7XHJcblx0XHR0aGlzLnBsYXllci5kcmF3KCk7XHJcblx0XHQvL0NyZWF0ZSB0ZXN0IG1vbnN0ZXJcclxuXHRcdGxldCBtID0gbmV3IE1vbnN0ZXIoJ01vbnN0ZXInLDgsOCxuZXcgR2x5cGgoJ20nLCcjZjAwJyksbmV3IEJhc2ljQUkoKSk7XHJcblx0XHRtLmRyYXcoKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5lbmdpbmUuc3RhcnQoKTtcclxuXHR9LFxyXG5cdG92ZXIodmljdG9yeSl7XHJcblx0XHQvL0dhbWUgZW5kZWQuIERlbGV0ZSBTY2hlZHVsZXIgYW5kIEVuZ2luZVxyXG5cdFx0dGhpcy5zY2hlZHVsZXIuY2xlYXIoKTtcclxuXHRcdC8vdGhpcy5lbmdpbmUgPSBudWxsO1xyXG5cdFx0bGV0IHRleHQgPSAnJztcclxuXHRcdGlmKHZpY3Rvcnkpe1xyXG5cdFx0XHR0ZXh0ID0gJ0NvbmdyYWR1bGF0aW9ucyEgWW91IHdvbiEnO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0dGV4dCA9ICdHYW1lIG92ZXIuIFlvdSBsb3N0ISc7XHJcblx0XHR9XHJcblx0XHR0aGlzLmRpc3BsYXkuZHJhd1RleHQoTWF0aC5mbG9vcih3LzIpLU1hdGguZmxvb3IodGV4dC5sZW5ndGgvMiksTWF0aC5mbG9vcihoLzIpLHRleHQpO1xyXG5cdH1cclxufSIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHbHlwaCB7XHJcblx0Y29uc3RydWN0b3IoY2hyLCBmZywgYmcpe1xyXG5cdFx0dGhpcy5jaHIgPSBjaHIgfHwgJyAnO1xyXG5cdFx0dGhpcy5mZyA9IGZnIHx8ICcjZmZmJztcclxuXHRcdHRoaXMuYmcgPSBiZyB8fCBudWxsO1xyXG5cdH1cclxuXHRkcmF3KHgsIHkpe1xyXG5cdFx0R2FtZS5kaXNwbGF5LmRyYXcoeCwgeSwgdGhpcy5jaHIsIHRoaXMuZmcsIHRoaXMuYmcpO1xyXG5cdH1cclxufSIsImltcG9ydCB7IFRpbGUsIFRpbGVUeXBlcyB9IGZyb20gJy4vdGlsZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWxlTWFwIHtcclxuXHRjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KXtcclxuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcclxuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFx0dGhpcy50aWxlcyA9IG5ldyBNYXAoKTtcclxuXHRcdGZvcihsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCsrKXtcclxuXHRcdFx0Zm9yKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKXtcclxuXHRcdFx0XHR0aGlzLnRpbGVzLnNldCh4KycsJyt5LG5ldyBUaWxlKHgsIHksIFRpbGVUeXBlcy5TS1kpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRzZXQoeCwgeSwgdGlsZSl7XHJcblx0XHR0aGlzLnRpbGVzLnNldCh4KycsJyt5LHRpbGUpO1xyXG5cdH1cclxuXHRnZXQoeCwgeSl7XHJcblx0XHRyZXR1cm4gdGhpcy50aWxlcy5nZXQoeCsnLCcreSk7XHJcblx0fVxyXG5cdGluQm91bmRzKHgsIHkpe1xyXG5cdFx0cmV0dXJuIHggPiAwICYmIHggPCB0aGlzLndpZHRoICYmIHk+IDAgJiYgeSA8IHRoaXMuaGVpZ2h0O1xyXG5cdH1cclxuXHRkcmF3KCl7XHJcblx0XHRmb3IodmFyIHRpbGUgb2YgdGhpcy50aWxlcy52YWx1ZXMoKSl7XHJcblx0XHRcdHRpbGUuZHJhdygpO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsImltcG9ydCBHbHlwaCBmcm9tICcuL2dseXBoJztcclxuXHJcbmV4cG9ydCBsZXQgVGlsZVR5cGVzID0ge1xyXG5cdFdBTEw6IHtcclxuXHRcdG5hbWU6ICd3YWxsJyxcclxuXHRcdGdseXBoOiBuZXcgR2x5cGgoJyMnKVxyXG5cdH0sXHJcblx0RkxPT1I6IHtcclxuXHRcdG5hbWU6ICdmbG9vcicsXHJcblx0XHRnbHlwaDogbmV3IEdseXBoKCcuJylcclxuXHR9LFxyXG5cdFNLWToge1xyXG5cdFx0bmFtZTogJ3NreScsXHJcblx0XHRnbHlwaDogbmV3IEdseXBoKCcgJywnI2ZmZicsJ3NreWJsdWUnKVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRpbGUge1xyXG5cdGNvbnN0cnVjdG9yKHgsIHksIHR5cGUpe1xyXG5cdFx0dGhpcy54ID0geDtcclxuXHRcdHRoaXMueSA9IHk7XHJcblx0XHR0aGlzLnR5cGUgPSB0eXBlLm5hbWU7XHJcblx0XHR0aGlzLl9nbHlwaCA9IHR5cGUuZ2x5cGg7XHJcblx0fVxyXG5cdGdldCBnbHlwaCgpeyByZXR1cm4gdGhpcy5fZ2x5cGg7IH1cclxuXHRzZXQgZ2x5cGgoZ2x5cGgpIHsgdGhpcy5fZ2x5cGggPSBnbHlwaDsgdGhpcy5kcmF3KCk7IH1cclxuXHRkcmF3KCl7XHJcblx0XHR0aGlzLmdseXBoLmRyYXcodGhpcy54LCB0aGlzLnkpO1xyXG5cdH1cclxufSIsIihmdW5jdGlvbihyb290LGZhY3Rvcnkpe2lmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZT09PVwib2JqZWN0XCIpbW9kdWxlLmV4cG9ydHM9ZmFjdG9yeSgpO2Vsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZClkZWZpbmUoXCJFdmVudEJ1c1wiLFtdLGZhY3RvcnkpO2Vsc2UgaWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiKWV4cG9ydHNbXCJFdmVudEJ1c1wiXT1mYWN0b3J5KCk7ZWxzZSByb290W1wiRXZlbnRCdXNcIl09ZmFjdG9yeSgpfSkodGhpcyxmdW5jdGlvbigpe3ZhciBFdmVudEJ1c0NsYXNzPXt9O0V2ZW50QnVzQ2xhc3M9ZnVuY3Rpb24oKXt0aGlzLmxpc3RlbmVycz17fX07RXZlbnRCdXNDbGFzcy5wcm90b3R5cGU9e2FkZEV2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSxjYWxsYmFjayxzY29wZSl7dmFyIGFyZ3M9W107dmFyIG51bU9mQXJncz1hcmd1bWVudHMubGVuZ3RoO2Zvcih2YXIgaT0wO2k8bnVtT2ZBcmdzO2krKyl7YXJncy5wdXNoKGFyZ3VtZW50c1tpXSl9YXJncz1hcmdzLmxlbmd0aD4zP2FyZ3Muc3BsaWNlKDMsYXJncy5sZW5ndGgtMSk6W107aWYodHlwZW9mIHRoaXMubGlzdGVuZXJzW3R5cGVdIT1cInVuZGVmaW5lZFwiKXt0aGlzLmxpc3RlbmVyc1t0eXBlXS5wdXNoKHtzY29wZTpzY29wZSxjYWxsYmFjazpjYWxsYmFjayxhcmdzOmFyZ3N9KX1lbHNle3RoaXMubGlzdGVuZXJzW3R5cGVdPVt7c2NvcGU6c2NvcGUsY2FsbGJhY2s6Y2FsbGJhY2ssYXJnczphcmdzfV19fSxyZW1vdmVFdmVudExpc3RlbmVyOmZ1bmN0aW9uKHR5cGUsY2FsbGJhY2ssc2NvcGUpe2lmKHR5cGVvZiB0aGlzLmxpc3RlbmVyc1t0eXBlXSE9XCJ1bmRlZmluZWRcIil7dmFyIG51bU9mQ2FsbGJhY2tzPXRoaXMubGlzdGVuZXJzW3R5cGVdLmxlbmd0aDt2YXIgbmV3QXJyYXk9W107Zm9yKHZhciBpPTA7aTxudW1PZkNhbGxiYWNrcztpKyspe3ZhciBsaXN0ZW5lcj10aGlzLmxpc3RlbmVyc1t0eXBlXVtpXTtpZihsaXN0ZW5lci5zY29wZT09c2NvcGUmJmxpc3RlbmVyLmNhbGxiYWNrPT1jYWxsYmFjayl7fWVsc2V7bmV3QXJyYXkucHVzaChsaXN0ZW5lcil9fXRoaXMubGlzdGVuZXJzW3R5cGVdPW5ld0FycmF5fX0saGFzRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlLGNhbGxiYWNrLHNjb3BlKXtpZih0eXBlb2YgdGhpcy5saXN0ZW5lcnNbdHlwZV0hPVwidW5kZWZpbmVkXCIpe3ZhciBudW1PZkNhbGxiYWNrcz10aGlzLmxpc3RlbmVyc1t0eXBlXS5sZW5ndGg7aWYoY2FsbGJhY2s9PT11bmRlZmluZWQmJnNjb3BlPT09dW5kZWZpbmVkKXtyZXR1cm4gbnVtT2ZDYWxsYmFja3M+MH1mb3IodmFyIGk9MDtpPG51bU9mQ2FsbGJhY2tzO2krKyl7dmFyIGxpc3RlbmVyPXRoaXMubGlzdGVuZXJzW3R5cGVdW2ldO2lmKChzY29wZT9saXN0ZW5lci5zY29wZT09c2NvcGU6dHJ1ZSkmJmxpc3RlbmVyLmNhbGxiYWNrPT1jYWxsYmFjayl7cmV0dXJuIHRydWV9fX1yZXR1cm4gZmFsc2V9LGRpc3BhdGNoOmZ1bmN0aW9uKHR5cGUsdGFyZ2V0KXt2YXIgZXZlbnQ9e3R5cGU6dHlwZSx0YXJnZXQ6dGFyZ2V0fTt2YXIgYXJncz1bXTt2YXIgbnVtT2ZBcmdzPWFyZ3VtZW50cy5sZW5ndGg7Zm9yKHZhciBpPTA7aTxudW1PZkFyZ3M7aSsrKXthcmdzLnB1c2goYXJndW1lbnRzW2ldKX1hcmdzPWFyZ3MubGVuZ3RoPjI/YXJncy5zcGxpY2UoMixhcmdzLmxlbmd0aC0xKTpbXTthcmdzPVtldmVudF0uY29uY2F0KGFyZ3MpO2lmKHR5cGVvZiB0aGlzLmxpc3RlbmVyc1t0eXBlXSE9XCJ1bmRlZmluZWRcIil7dmFyIGxpc3RlbmVycz10aGlzLmxpc3RlbmVyc1t0eXBlXS5zbGljZSgpO3ZhciBudW1PZkNhbGxiYWNrcz1saXN0ZW5lcnMubGVuZ3RoO2Zvcih2YXIgaT0wO2k8bnVtT2ZDYWxsYmFja3M7aSsrKXt2YXIgbGlzdGVuZXI9bGlzdGVuZXJzW2ldO2lmKGxpc3RlbmVyJiZsaXN0ZW5lci5jYWxsYmFjayl7dmFyIGNvbmNhdEFyZ3M9YXJncy5jb25jYXQobGlzdGVuZXIuYXJncyk7bGlzdGVuZXIuY2FsbGJhY2suYXBwbHkobGlzdGVuZXIuc2NvcGUsY29uY2F0QXJncyl9fX19LGdldEV2ZW50czpmdW5jdGlvbigpe3ZhciBzdHI9XCJcIjtmb3IodmFyIHR5cGUgaW4gdGhpcy5saXN0ZW5lcnMpe3ZhciBudW1PZkNhbGxiYWNrcz10aGlzLmxpc3RlbmVyc1t0eXBlXS5sZW5ndGg7Zm9yKHZhciBpPTA7aTxudW1PZkNhbGxiYWNrcztpKyspe3ZhciBsaXN0ZW5lcj10aGlzLmxpc3RlbmVyc1t0eXBlXVtpXTtzdHIrPWxpc3RlbmVyLnNjb3BlJiZsaXN0ZW5lci5zY29wZS5jbGFzc05hbWU/bGlzdGVuZXIuc2NvcGUuY2xhc3NOYW1lOlwiYW5vbnltb3VzXCI7c3RyKz1cIiBsaXN0ZW4gZm9yICdcIit0eXBlK1wiJ1xcblwifX1yZXR1cm4gc3RyfX07dmFyIEV2ZW50QnVzPW5ldyBFdmVudEJ1c0NsYXNzO3JldHVybiBFdmVudEJ1c30pOyIsIi8qXHJcblx0VGhpcyBpcyByb3QuanMsIHRoZSBST2d1ZWxpa2UgVG9vbGtpdCBpbiBKYXZhU2NyaXB0LlxyXG5cdFZlcnNpb24gMC43fmRldiwgZ2VuZXJhdGVkIG9uIFRodSAyNCBOb3YgMjAxNiAwODowNzozOSBNU1QuXHJcbiovXHJcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgICAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcclxuICAgICAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcclxuICAgICAgICAvLyBsaWtlIE5vZGUuXHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXHJcbiAgICAgICAgcm9vdC5ST1QgPSBmYWN0b3J5KCk7XHJcbiAgICB9XHJcbn0odGhpcywgZnVuY3Rpb24oKSB7XHJcbi8qKlxyXG4gKiBAbmFtZXNwYWNlIFRvcC1sZXZlbCBST1QgbmFtZXNwYWNlXHJcbiAqL1xyXG52YXIgUk9UID0ge1xyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm5zIHtib29sfSBJcyByb3QuanMgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3Nlcj9cclxuXHQgKi9cclxuXHRpc1N1cHBvcnRlZDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gISEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKS5nZXRDb250ZXh0ICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKTtcclxuXHR9LFxyXG5cclxuXHQvKiogRGVmYXVsdCB3aXRoIGZvciBkaXNwbGF5IGFuZCBtYXAgZ2VuZXJhdG9ycyAqL1xyXG5cdERFRkFVTFRfV0lEVEg6IDgwLFxyXG5cdC8qKiBEZWZhdWx0IGhlaWdodCBmb3IgZGlzcGxheSBhbmQgbWFwIGdlbmVyYXRvcnMgKi9cclxuXHRERUZBVUxUX0hFSUdIVDogMjUsXHJcblxyXG5cdC8qKiBEaXJlY3Rpb25hbCBjb25zdGFudHMuIE9yZGVyaW5nIGlzIGltcG9ydGFudCEgKi9cclxuXHRESVJTOiB7XHJcblx0XHRcIjRcIjogW1xyXG5cdFx0XHRbIDAsIC0xXSxcclxuXHRcdFx0WyAxLCAgMF0sXHJcblx0XHRcdFsgMCwgIDFdLFxyXG5cdFx0XHRbLTEsICAwXVxyXG5cdFx0XSxcclxuXHRcdFwiOFwiOiBbXHJcblx0XHRcdFsgMCwgLTFdLFxyXG5cdFx0XHRbIDEsIC0xXSxcclxuXHRcdFx0WyAxLCAgMF0sXHJcblx0XHRcdFsgMSwgIDFdLFxyXG5cdFx0XHRbIDAsICAxXSxcclxuXHRcdFx0Wy0xLCAgMV0sXHJcblx0XHRcdFstMSwgIDBdLFxyXG5cdFx0XHRbLTEsIC0xXVxyXG5cdFx0XSxcclxuXHRcdFwiNlwiOiBbXHJcblx0XHRcdFstMSwgLTFdLFxyXG5cdFx0XHRbIDEsIC0xXSxcclxuXHRcdFx0WyAyLCAgMF0sXHJcblx0XHRcdFsgMSwgIDFdLFxyXG5cdFx0XHRbLTEsICAxXSxcclxuXHRcdFx0Wy0yLCAgMF1cclxuXHRcdF1cclxuXHR9LFxyXG5cclxuXHQvKiogQ2FuY2VsIGtleS4gKi9cclxuXHRWS19DQU5DRUw6IDMsIFxyXG5cdC8qKiBIZWxwIGtleS4gKi9cclxuXHRWS19IRUxQOiA2LCBcclxuXHQvKiogQmFja3NwYWNlIGtleS4gKi9cclxuXHRWS19CQUNLX1NQQUNFOiA4LCBcclxuXHQvKiogVGFiIGtleS4gKi9cclxuXHRWS19UQUI6IDksIFxyXG5cdC8qKiA1IGtleSBvbiBOdW1wYWQgd2hlbiBOdW1Mb2NrIGlzIHVubG9ja2VkLiBPciBvbiBNYWMsIGNsZWFyIGtleSB3aGljaCBpcyBwb3NpdGlvbmVkIGF0IE51bUxvY2sga2V5LiAqL1xyXG5cdFZLX0NMRUFSOiAxMiwgXHJcblx0LyoqIFJldHVybi9lbnRlciBrZXkgb24gdGhlIG1haW4ga2V5Ym9hcmQuICovXHJcblx0VktfUkVUVVJOOiAxMywgXHJcblx0LyoqIFJlc2VydmVkLCBidXQgbm90IHVzZWQuICovXHJcblx0VktfRU5URVI6IDE0LCBcclxuXHQvKiogU2hpZnQga2V5LiAqL1xyXG5cdFZLX1NISUZUOiAxNiwgXHJcblx0LyoqIENvbnRyb2wga2V5LiAqL1xyXG5cdFZLX0NPTlRST0w6IDE3LCBcclxuXHQvKiogQWx0IChPcHRpb24gb24gTWFjKSBrZXkuICovXHJcblx0VktfQUxUOiAxOCwgXHJcblx0LyoqIFBhdXNlIGtleS4gKi9cclxuXHRWS19QQVVTRTogMTksIFxyXG5cdC8qKiBDYXBzIGxvY2suICovXHJcblx0VktfQ0FQU19MT0NLOiAyMCwgXHJcblx0LyoqIEVzY2FwZSBrZXkuICovXHJcblx0VktfRVNDQVBFOiAyNywgXHJcblx0LyoqIFNwYWNlIGJhci4gKi9cclxuXHRWS19TUEFDRTogMzIsIFxyXG5cdC8qKiBQYWdlIFVwIGtleS4gKi9cclxuXHRWS19QQUdFX1VQOiAzMywgXHJcblx0LyoqIFBhZ2UgRG93biBrZXkuICovXHJcblx0VktfUEFHRV9ET1dOOiAzNCwgXHJcblx0LyoqIEVuZCBrZXkuICovXHJcblx0VktfRU5EOiAzNSwgXHJcblx0LyoqIEhvbWUga2V5LiAqL1xyXG5cdFZLX0hPTUU6IDM2LCBcclxuXHQvKiogTGVmdCBhcnJvdy4gKi9cclxuXHRWS19MRUZUOiAzNywgXHJcblx0LyoqIFVwIGFycm93LiAqL1xyXG5cdFZLX1VQOiAzOCwgXHJcblx0LyoqIFJpZ2h0IGFycm93LiAqL1xyXG5cdFZLX1JJR0hUOiAzOSwgXHJcblx0LyoqIERvd24gYXJyb3cuICovXHJcblx0VktfRE9XTjogNDAsIFxyXG5cdC8qKiBQcmludCBTY3JlZW4ga2V5LiAqL1xyXG5cdFZLX1BSSU5UU0NSRUVOOiA0NCwgXHJcblx0LyoqIElucyhlcnQpIGtleS4gKi9cclxuXHRWS19JTlNFUlQ6IDQ1LCBcclxuXHQvKiogRGVsKGV0ZSkga2V5LiAqL1xyXG5cdFZLX0RFTEVURTogNDYsIFxyXG5cdC8qKiovXHJcblx0VktfMDogNDgsXHJcblx0LyoqKi9cclxuXHRWS18xOiA0OSxcclxuXHQvKioqL1xyXG5cdFZLXzI6IDUwLFxyXG5cdC8qKiovXHJcblx0VktfMzogNTEsXHJcblx0LyoqKi9cclxuXHRWS180OiA1MixcclxuXHQvKioqL1xyXG5cdFZLXzU6IDUzLFxyXG5cdC8qKiovXHJcblx0VktfNjogNTQsXHJcblx0LyoqKi9cclxuXHRWS183OiA1NSxcclxuXHQvKioqL1xyXG5cdFZLXzg6IDU2LFxyXG5cdC8qKiovXHJcblx0VktfOTogNTcsXHJcblx0LyoqIENvbG9uICg6KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19DT0xPTjogNTgsIFxyXG5cdC8qKiBTZW1pY29sb24gKDspIGtleS4gKi9cclxuXHRWS19TRU1JQ09MT046IDU5LCBcclxuXHQvKiogTGVzcy10aGFuICg8KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19MRVNTX1RIQU46IDYwLCBcclxuXHQvKiogRXF1YWxzICg9KSBrZXkuICovXHJcblx0VktfRVFVQUxTOiA2MSwgXHJcblx0LyoqIEdyZWF0ZXItdGhhbiAoPikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfR1JFQVRFUl9USEFOOiA2MiwgXHJcblx0LyoqIFF1ZXN0aW9uIG1hcmsgKD8pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1FVRVNUSU9OX01BUks6IDYzLCBcclxuXHQvKiogQXRtYXJrIChAKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19BVDogNjQsIFxyXG5cdC8qKiovXHJcblx0VktfQTogNjUsXHJcblx0LyoqKi9cclxuXHRWS19COiA2NixcclxuXHQvKioqL1xyXG5cdFZLX0M6IDY3LFxyXG5cdC8qKiovXHJcblx0VktfRDogNjgsXHJcblx0LyoqKi9cclxuXHRWS19FOiA2OSxcclxuXHQvKioqL1xyXG5cdFZLX0Y6IDcwLFxyXG5cdC8qKiovXHJcblx0VktfRzogNzEsXHJcblx0LyoqKi9cclxuXHRWS19IOiA3MixcclxuXHQvKioqL1xyXG5cdFZLX0k6IDczLFxyXG5cdC8qKiovXHJcblx0VktfSjogNzQsXHJcblx0LyoqKi9cclxuXHRWS19LOiA3NSxcclxuXHQvKioqL1xyXG5cdFZLX0w6IDc2LFxyXG5cdC8qKiovXHJcblx0VktfTTogNzcsXHJcblx0LyoqKi9cclxuXHRWS19OOiA3OCxcclxuXHQvKioqL1xyXG5cdFZLX086IDc5LFxyXG5cdC8qKiovXHJcblx0VktfUDogODAsXHJcblx0LyoqKi9cclxuXHRWS19ROiA4MSxcclxuXHQvKioqL1xyXG5cdFZLX1I6IDgyLFxyXG5cdC8qKiovXHJcblx0VktfUzogODMsXHJcblx0LyoqKi9cclxuXHRWS19UOiA4NCxcclxuXHQvKioqL1xyXG5cdFZLX1U6IDg1LFxyXG5cdC8qKiovXHJcblx0VktfVjogODYsXHJcblx0LyoqKi9cclxuXHRWS19XOiA4NyxcclxuXHQvKioqL1xyXG5cdFZLX1g6IDg4LFxyXG5cdC8qKiovXHJcblx0VktfWTogODksXHJcblx0LyoqKi9cclxuXHRWS19aOiA5MCxcclxuXHQvKioqL1xyXG5cdFZLX0NPTlRFWFRfTUVOVTogOTMsXHJcblx0LyoqIDAgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDA6IDk2LCBcclxuXHQvKiogMSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEMTogOTcsIFxyXG5cdC8qKiAyIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19OVU1QQUQyOiA5OCwgXHJcblx0LyoqIDMgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX05VTVBBRDM6IDk5LCBcclxuXHQvKiogNCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENDogMTAwLCBcclxuXHQvKiogNSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENTogMTAxLCBcclxuXHQvKiogNiBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENjogMTAyLCBcclxuXHQvKiogNyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFENzogMTAzLCBcclxuXHQvKiogOCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEODogMTA0LCBcclxuXHQvKiogOSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTlVNUEFEOTogMTA1LCBcclxuXHQvKiogKiBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfTVVMVElQTFk6IDEwNixcclxuXHQvKiogKyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXHJcblx0VktfQUREOiAxMDcsIFxyXG5cdC8qKiovXHJcblx0VktfU0VQQVJBVE9SOiAxMDgsXHJcblx0LyoqIC0gb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xyXG5cdFZLX1NVQlRSQUNUOiAxMDksIFxyXG5cdC8qKiBEZWNpbWFsIHBvaW50IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19ERUNJTUFMOiAxMTAsIFxyXG5cdC8qKiAvIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cclxuXHRWS19ESVZJREU6IDExMSwgXHJcblx0LyoqIEYxIGtleS4gKi9cclxuXHRWS19GMTogMTEyLCBcclxuXHQvKiogRjIga2V5LiAqL1xyXG5cdFZLX0YyOiAxMTMsIFxyXG5cdC8qKiBGMyBrZXkuICovXHJcblx0VktfRjM6IDExNCwgXHJcblx0LyoqIEY0IGtleS4gKi9cclxuXHRWS19GNDogMTE1LCBcclxuXHQvKiogRjUga2V5LiAqL1xyXG5cdFZLX0Y1OiAxMTYsIFxyXG5cdC8qKiBGNiBrZXkuICovXHJcblx0VktfRjY6IDExNywgXHJcblx0LyoqIEY3IGtleS4gKi9cclxuXHRWS19GNzogMTE4LCBcclxuXHQvKiogRjgga2V5LiAqL1xyXG5cdFZLX0Y4OiAxMTksIFxyXG5cdC8qKiBGOSBrZXkuICovXHJcblx0VktfRjk6IDEyMCwgXHJcblx0LyoqIEYxMCBrZXkuICovXHJcblx0VktfRjEwOiAxMjEsIFxyXG5cdC8qKiBGMTEga2V5LiAqL1xyXG5cdFZLX0YxMTogMTIyLCBcclxuXHQvKiogRjEyIGtleS4gKi9cclxuXHRWS19GMTI6IDEyMywgXHJcblx0LyoqIEYxMyBrZXkuICovXHJcblx0VktfRjEzOiAxMjQsIFxyXG5cdC8qKiBGMTQga2V5LiAqL1xyXG5cdFZLX0YxNDogMTI1LCBcclxuXHQvKiogRjE1IGtleS4gKi9cclxuXHRWS19GMTU6IDEyNiwgXHJcblx0LyoqIEYxNiBrZXkuICovXHJcblx0VktfRjE2OiAxMjcsIFxyXG5cdC8qKiBGMTcga2V5LiAqL1xyXG5cdFZLX0YxNzogMTI4LCBcclxuXHQvKiogRjE4IGtleS4gKi9cclxuXHRWS19GMTg6IDEyOSwgXHJcblx0LyoqIEYxOSBrZXkuICovXHJcblx0VktfRjE5OiAxMzAsIFxyXG5cdC8qKiBGMjAga2V5LiAqL1xyXG5cdFZLX0YyMDogMTMxLCBcclxuXHQvKiogRjIxIGtleS4gKi9cclxuXHRWS19GMjE6IDEzMiwgXHJcblx0LyoqIEYyMiBrZXkuICovXHJcblx0VktfRjIyOiAxMzMsIFxyXG5cdC8qKiBGMjMga2V5LiAqL1xyXG5cdFZLX0YyMzogMTM0LCBcclxuXHQvKiogRjI0IGtleS4gKi9cclxuXHRWS19GMjQ6IDEzNSwgXHJcblx0LyoqIE51bSBMb2NrIGtleS4gKi9cclxuXHRWS19OVU1fTE9DSzogMTQ0LCBcclxuXHQvKiogU2Nyb2xsIExvY2sga2V5LiAqL1xyXG5cdFZLX1NDUk9MTF9MT0NLOiAxNDUsIFxyXG5cdC8qKiBDaXJjdW1mbGV4ICheKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19DSVJDVU1GTEVYOiAxNjAsIFxyXG5cdC8qKiBFeGNsYW1hdGlvbiAoISkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfRVhDTEFNQVRJT046IDE2MSwgXHJcblx0LyoqIERvdWJsZSBxdW90ZSAoKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19ET1VCTEVfUVVPVEU6IDE2MiwgXHJcblx0LyoqIEhhc2ggKCMpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0hBU0g6IDE2MywgXHJcblx0LyoqIERvbGxhciBzaWduICgkKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19ET0xMQVI6IDE2NCwgXHJcblx0LyoqIFBlcmNlbnQgKCUpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1BFUkNFTlQ6IDE2NSwgXHJcblx0LyoqIEFtcGVyc2FuZCAoJikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQU1QRVJTQU5EOiAxNjYsIFxyXG5cdC8qKiBVbmRlcnNjb3JlIChfKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19VTkRFUlNDT1JFOiAxNjcsIFxyXG5cdC8qKiBPcGVuIHBhcmVudGhlc2lzICgoKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19PUEVOX1BBUkVOOiAxNjgsIFxyXG5cdC8qKiBDbG9zZSBwYXJlbnRoZXNpcyAoKSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfQ0xPU0VfUEFSRU46IDE2OSwgXHJcblx0LyogQXN0ZXJpc2sgKCopIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX0FTVEVSSVNLOiAxNzAsXHJcblx0LyoqIFBsdXMgKCspIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1BMVVM6IDE3MSwgXHJcblx0LyoqIFBpcGUgKHwpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xyXG5cdFZLX1BJUEU6IDE3MiwgXHJcblx0LyoqIEh5cGhlbi1VUy9kb2NzL01pbnVzICgtKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19IWVBIRU5fTUlOVVM6IDE3MywgXHJcblx0LyoqIE9wZW4gY3VybHkgYnJhY2tldCAoeykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfT1BFTl9DVVJMWV9CUkFDS0VUOiAxNzQsIFxyXG5cdC8qKiBDbG9zZSBjdXJseSBicmFja2V0ICh9KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19DTE9TRV9DVVJMWV9CUkFDS0VUOiAxNzUsIFxyXG5cdC8qKiBUaWxkZSAofikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXHJcblx0VktfVElMREU6IDE3NiwgXHJcblx0LyoqIENvbW1hICgsKSBrZXkuICovXHJcblx0VktfQ09NTUE6IDE4OCwgXHJcblx0LyoqIFBlcmlvZCAoLikga2V5LiAqL1xyXG5cdFZLX1BFUklPRDogMTkwLCBcclxuXHQvKiogU2xhc2ggKC8pIGtleS4gKi9cclxuXHRWS19TTEFTSDogMTkxLCBcclxuXHQvKiogQmFjayB0aWNrIChgKSBrZXkuICovXHJcblx0VktfQkFDS19RVU9URTogMTkyLCBcclxuXHQvKiogT3BlbiBzcXVhcmUgYnJhY2tldCAoWykga2V5LiAqL1xyXG5cdFZLX09QRU5fQlJBQ0tFVDogMjE5LCBcclxuXHQvKiogQmFjayBzbGFzaCAoXFwpIGtleS4gKi9cclxuXHRWS19CQUNLX1NMQVNIOiAyMjAsIFxyXG5cdC8qKiBDbG9zZSBzcXVhcmUgYnJhY2tldCAoXSkga2V5LiAqL1xyXG5cdFZLX0NMT1NFX0JSQUNLRVQ6IDIyMSwgXHJcblx0LyoqIFF1b3RlICgnJycpIGtleS4gKi9cclxuXHRWS19RVU9URTogMjIyLCBcclxuXHQvKiogTWV0YSBrZXkgb24gTGludXgsIENvbW1hbmQga2V5IG9uIE1hYy4gKi9cclxuXHRWS19NRVRBOiAyMjQsIFxyXG5cdC8qKiBBbHRHciBrZXkgb24gTGludXguIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19BTFRHUjogMjI1LCBcclxuXHQvKiogV2luZG93cyBsb2dvIGtleSBvbiBXaW5kb3dzLiBPciBTdXBlciBvciBIeXBlciBrZXkgb24gTGludXguIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19XSU46IDkxLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfS0FOQTogMjEsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19IQU5HVUw6IDIxLCBcclxuXHQvKiog6Iux5pWwIGtleSBvbiBKYXBhbmVzZSBNYWMga2V5Ym9hcmQuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cclxuXHRWS19FSVNVOiAyMiwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0pVTkpBOiAyMywgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0ZJTkFMOiAyNCwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0hBTkpBOiAyNSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0tBTkpJOiAyNSwgXHJcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xyXG5cdFZLX0NPTlZFUlQ6IDI4LCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfTk9OQ09OVkVSVDogMjksIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19BQ0NFUFQ6IDMwLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfTU9ERUNIQU5HRTogMzEsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cclxuXHRWS19TRUxFQ1Q6IDQxLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfUFJJTlQ6IDQyLCBcclxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXHJcblx0VktfRVhFQ1VURTogNDMsIFxyXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC5cdCAqL1xyXG5cdFZLX1NMRUVQOiA5NSBcclxufTtcclxuLyoqXHJcbiAqIEBuYW1lc3BhY2VcclxuICogQ29udGFpbnMgdGV4dCB0b2tlbml6YXRpb24gYW5kIGJyZWFraW5nIHJvdXRpbmVzXHJcbiAqL1xyXG5ST1QuVGV4dCA9IHtcclxuXHRSRV9DT0xPUlM6IC8lKFtiY10peyhbXn1dKil9L2csXHJcblxyXG5cdC8qIHRva2VuIHR5cGVzICovXHJcblx0VFlQRV9URVhUOlx0XHQwLFxyXG5cdFRZUEVfTkVXTElORTpcdDEsXHJcblx0VFlQRV9GRzpcdFx0MixcclxuXHRUWVBFX0JHOlx0XHQzLFxyXG5cclxuXHQvKipcclxuXHQgKiBNZWFzdXJlIHNpemUgb2YgYSByZXN1bHRpbmcgdGV4dCBibG9ja1xyXG5cdCAqL1xyXG5cdG1lYXN1cmU6IGZ1bmN0aW9uKHN0ciwgbWF4V2lkdGgpIHtcclxuXHRcdHZhciByZXN1bHQgPSB7d2lkdGg6MCwgaGVpZ2h0OjF9O1xyXG5cdFx0dmFyIHRva2VucyA9IHRoaXMudG9rZW5pemUoc3RyLCBtYXhXaWR0aCk7XHJcblx0XHR2YXIgbGluZVdpZHRoID0gMDtcclxuXHJcblx0XHRmb3IgKHZhciBpPTA7aTx0b2tlbnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbaV07XHJcblx0XHRcdHN3aXRjaCAodG9rZW4udHlwZSkge1xyXG5cdFx0XHRcdGNhc2UgdGhpcy5UWVBFX1RFWFQ6XHJcblx0XHRcdFx0XHRsaW5lV2lkdGggKz0gdG9rZW4udmFsdWUubGVuZ3RoO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlIHRoaXMuVFlQRV9ORVdMSU5FOlxyXG5cdFx0XHRcdFx0cmVzdWx0LmhlaWdodCsrO1xyXG5cdFx0XHRcdFx0cmVzdWx0LndpZHRoID0gTWF0aC5tYXgocmVzdWx0LndpZHRoLCBsaW5lV2lkdGgpO1xyXG5cdFx0XHRcdFx0bGluZVdpZHRoID0gMDtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmVzdWx0LndpZHRoID0gTWF0aC5tYXgocmVzdWx0LndpZHRoLCBsaW5lV2lkdGgpO1xyXG5cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydCBzdHJpbmcgdG8gYSBzZXJpZXMgb2YgYSBmb3JtYXR0aW5nIGNvbW1hbmRzXHJcblx0ICovXHJcblx0dG9rZW5pemU6IGZ1bmN0aW9uKHN0ciwgbWF4V2lkdGgpIHtcclxuXHRcdHZhciByZXN1bHQgPSBbXTtcclxuXHJcblx0XHQvKiBmaXJzdCB0b2tlbml6YXRpb24gcGFzcyAtIHNwbGl0IHRleHRzIGFuZCBjb2xvciBmb3JtYXR0aW5nIGNvbW1hbmRzICovXHJcblx0XHR2YXIgb2Zmc2V0ID0gMDtcclxuXHRcdHN0ci5yZXBsYWNlKHRoaXMuUkVfQ09MT1JTLCBmdW5jdGlvbihtYXRjaCwgdHlwZSwgbmFtZSwgaW5kZXgpIHtcclxuXHRcdFx0Lyogc3RyaW5nIGJlZm9yZSAqL1xyXG5cdFx0XHR2YXIgcGFydCA9IHN0ci5zdWJzdHJpbmcob2Zmc2V0LCBpbmRleCk7XHJcblx0XHRcdGlmIChwYXJ0Lmxlbmd0aCkge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKHtcclxuXHRcdFx0XHRcdHR5cGU6IFJPVC5UZXh0LlRZUEVfVEVYVCxcclxuXHRcdFx0XHRcdHZhbHVlOiBwYXJ0XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qIGNvbG9yIGNvbW1hbmQgKi9cclxuXHRcdFx0cmVzdWx0LnB1c2goe1xyXG5cdFx0XHRcdHR5cGU6ICh0eXBlID09IFwiY1wiID8gUk9ULlRleHQuVFlQRV9GRyA6IFJPVC5UZXh0LlRZUEVfQkcpLFxyXG5cdFx0XHRcdHZhbHVlOiBuYW1lLnRyaW0oKVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdG9mZnNldCA9IGluZGV4ICsgbWF0Y2gubGVuZ3RoO1xyXG5cdFx0XHRyZXR1cm4gXCJcIjtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8qIGxhc3QgcmVtYWluaW5nIHBhcnQgKi9cclxuXHRcdHZhciBwYXJ0ID0gc3RyLnN1YnN0cmluZyhvZmZzZXQpO1xyXG5cdFx0aWYgKHBhcnQubGVuZ3RoKSB7XHJcblx0XHRcdHJlc3VsdC5wdXNoKHtcclxuXHRcdFx0XHR0eXBlOiBST1QuVGV4dC5UWVBFX1RFWFQsXHJcblx0XHRcdFx0dmFsdWU6IHBhcnRcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX2JyZWFrTGluZXMocmVzdWx0LCBtYXhXaWR0aCk7XHJcblx0fSxcclxuXHJcblx0LyogaW5zZXJ0IGxpbmUgYnJlYWtzIGludG8gZmlyc3QtcGFzcyB0b2tlbml6ZWQgZGF0YSAqL1xyXG5cdF9icmVha0xpbmVzOiBmdW5jdGlvbih0b2tlbnMsIG1heFdpZHRoKSB7XHJcblx0XHRpZiAoIW1heFdpZHRoKSB7IG1heFdpZHRoID0gSW5maW5pdHk7IH1cclxuXHJcblx0XHR2YXIgaSA9IDA7XHJcblx0XHR2YXIgbGluZUxlbmd0aCA9IDA7XHJcblx0XHR2YXIgbGFzdFRva2VuV2l0aFNwYWNlID0gLTE7XHJcblxyXG5cdFx0d2hpbGUgKGkgPCB0b2tlbnMubGVuZ3RoKSB7IC8qIHRha2UgYWxsIHRleHQgdG9rZW5zLCByZW1vdmUgc3BhY2UsIGFwcGx5IGxpbmVicmVha3MgKi9cclxuXHRcdFx0dmFyIHRva2VuID0gdG9rZW5zW2ldO1xyXG5cdFx0XHRpZiAodG9rZW4udHlwZSA9PSBST1QuVGV4dC5UWVBFX05FV0xJTkUpIHsgLyogcmVzZXQgKi9cclxuXHRcdFx0XHRsaW5lTGVuZ3RoID0gMDsgXHJcblx0XHRcdFx0bGFzdFRva2VuV2l0aFNwYWNlID0gLTE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRva2VuLnR5cGUgIT0gUk9ULlRleHQuVFlQRV9URVhUKSB7IC8qIHNraXAgbm9uLXRleHQgdG9rZW5zICovXHJcblx0XHRcdFx0aSsrO1xyXG5cdFx0XHRcdGNvbnRpbnVlOyBcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyogcmVtb3ZlIHNwYWNlcyBhdCB0aGUgYmVnaW5uaW5nIG9mIGxpbmUgKi9cclxuXHRcdFx0d2hpbGUgKGxpbmVMZW5ndGggPT0gMCAmJiB0b2tlbi52YWx1ZS5jaGFyQXQoMCkgPT0gXCIgXCIpIHsgdG9rZW4udmFsdWUgPSB0b2tlbi52YWx1ZS5zdWJzdHJpbmcoMSk7IH1cclxuXHJcblx0XHRcdC8qIGZvcmNlZCBuZXdsaW5lPyBpbnNlcnQgdHdvIG5ldyB0b2tlbnMgYWZ0ZXIgdGhpcyBvbmUgKi9cclxuXHRcdFx0dmFyIGluZGV4ID0gdG9rZW4udmFsdWUuaW5kZXhPZihcIlxcblwiKTtcclxuXHRcdFx0aWYgKGluZGV4ICE9IC0xKSB7IFxyXG5cdFx0XHRcdHRva2VuLnZhbHVlID0gdGhpcy5fYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGksIGluZGV4LCB0cnVlKTsgXHJcblxyXG5cdFx0XHRcdC8qIGlmIHRoZXJlIGFyZSBzcGFjZXMgYXQgdGhlIGVuZCwgd2UgbXVzdCByZW1vdmUgdGhlbSAod2UgZG8gbm90IHdhbnQgdGhlIGxpbmUgdG9vIGxvbmcpICovXHJcblx0XHRcdFx0dmFyIGFyciA9IHRva2VuLnZhbHVlLnNwbGl0KFwiXCIpO1xyXG5cdFx0XHRcdHdoaWxlIChhcnIubGVuZ3RoICYmIGFyclthcnIubGVuZ3RoLTFdID09IFwiIFwiKSB7IGFyci5wb3AoKTsgfVxyXG5cdFx0XHRcdHRva2VuLnZhbHVlID0gYXJyLmpvaW4oXCJcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qIHRva2VuIGRlZ2VuZXJhdGVkPyAqL1xyXG5cdFx0XHRpZiAoIXRva2VuLnZhbHVlLmxlbmd0aCkge1xyXG5cdFx0XHRcdHRva2Vucy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChsaW5lTGVuZ3RoICsgdG9rZW4udmFsdWUubGVuZ3RoID4gbWF4V2lkdGgpIHsgLyogbGluZSB0b28gbG9uZywgZmluZCBhIHN1aXRhYmxlIGJyZWFraW5nIHNwb3QgKi9cclxuXHJcblx0XHRcdFx0LyogaXMgaXQgcG9zc2libGUgdG8gYnJlYWsgd2l0aGluIHRoaXMgdG9rZW4/ICovXHJcblx0XHRcdFx0dmFyIGluZGV4ID0gLTE7XHJcblx0XHRcdFx0d2hpbGUgKDEpIHtcclxuXHRcdFx0XHRcdHZhciBuZXh0SW5kZXggPSB0b2tlbi52YWx1ZS5pbmRleE9mKFwiIFwiLCBpbmRleCsxKTtcclxuXHRcdFx0XHRcdGlmIChuZXh0SW5kZXggPT0gLTEpIHsgYnJlYWs7IH1cclxuXHRcdFx0XHRcdGlmIChsaW5lTGVuZ3RoICsgbmV4dEluZGV4ID4gbWF4V2lkdGgpIHsgYnJlYWs7IH1cclxuXHRcdFx0XHRcdGluZGV4ID0gbmV4dEluZGV4O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGluZGV4ICE9IC0xKSB7IC8qIGJyZWFrIGF0IHNwYWNlIHdpdGhpbiB0aGlzIG9uZSAqL1xyXG5cdFx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgaSwgaW5kZXgsIHRydWUpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobGFzdFRva2VuV2l0aFNwYWNlICE9IC0xKSB7IC8qIGlzIHRoZXJlIGEgcHJldmlvdXMgdG9rZW4gd2hlcmUgYSBicmVhayBjYW4gb2NjdXI/ICovXHJcblx0XHRcdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbbGFzdFRva2VuV2l0aFNwYWNlXTtcclxuXHRcdFx0XHRcdHZhciBicmVha0luZGV4ID0gdG9rZW4udmFsdWUubGFzdEluZGV4T2YoXCIgXCIpO1xyXG5cdFx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgbGFzdFRva2VuV2l0aFNwYWNlLCBicmVha0luZGV4LCB0cnVlKTtcclxuXHRcdFx0XHRcdGkgPSBsYXN0VG9rZW5XaXRoU3BhY2U7XHJcblx0XHRcdFx0fSBlbHNlIHsgLyogZm9yY2UgYnJlYWsgaW4gdGhpcyB0b2tlbiAqL1xyXG5cdFx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgaSwgbWF4V2lkdGgtbGluZUxlbmd0aCwgZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0gZWxzZSB7IC8qIGxpbmUgbm90IGxvbmcsIGNvbnRpbnVlICovXHJcblx0XHRcdFx0bGluZUxlbmd0aCArPSB0b2tlbi52YWx1ZS5sZW5ndGg7XHJcblx0XHRcdFx0aWYgKHRva2VuLnZhbHVlLmluZGV4T2YoXCIgXCIpICE9IC0xKSB7IGxhc3RUb2tlbldpdGhTcGFjZSA9IGk7IH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aSsrOyAvKiBhZHZhbmNlIHRvIG5leHQgdG9rZW4gKi9cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0dG9rZW5zLnB1c2goe3R5cGU6IFJPVC5UZXh0LlRZUEVfTkVXTElORX0pOyAvKiBpbnNlcnQgZmFrZSBuZXdsaW5lIHRvIGZpeCB0aGUgbGFzdCB0ZXh0IGxpbmUgKi9cclxuXHJcblx0XHQvKiByZW1vdmUgdHJhaWxpbmcgc3BhY2UgZnJvbSB0ZXh0IHRva2VucyBiZWZvcmUgbmV3bGluZXMgKi9cclxuXHRcdHZhciBsYXN0VGV4dFRva2VuID0gbnVsbDtcclxuXHRcdGZvciAodmFyIGk9MDtpPHRva2Vucy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHZhciB0b2tlbiA9IHRva2Vuc1tpXTtcclxuXHRcdFx0c3dpdGNoICh0b2tlbi50eXBlKSB7XHJcblx0XHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX1RFWFQ6IGxhc3RUZXh0VG9rZW4gPSB0b2tlbjsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX05FV0xJTkU6IFxyXG5cdFx0XHRcdFx0aWYgKGxhc3RUZXh0VG9rZW4pIHsgLyogcmVtb3ZlIHRyYWlsaW5nIHNwYWNlICovXHJcblx0XHRcdFx0XHRcdHZhciBhcnIgPSBsYXN0VGV4dFRva2VuLnZhbHVlLnNwbGl0KFwiXCIpO1xyXG5cdFx0XHRcdFx0XHR3aGlsZSAoYXJyLmxlbmd0aCAmJiBhcnJbYXJyLmxlbmd0aC0xXSA9PSBcIiBcIikgeyBhcnIucG9wKCk7IH1cclxuXHRcdFx0XHRcdFx0bGFzdFRleHRUb2tlbi52YWx1ZSA9IGFyci5qb2luKFwiXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGFzdFRleHRUb2tlbiA9IG51bGw7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0b2tlbnMucG9wKCk7IC8qIHJlbW92ZSBmYWtlIHRva2VuICovXHJcblxyXG5cdFx0cmV0dXJuIHRva2VucztcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGUgbmV3IHRva2VucyBhbmQgaW5zZXJ0IHRoZW0gaW50byB0aGUgc3RyZWFtXHJcblx0ICogQHBhcmFtIHtvYmplY3RbXX0gdG9rZW5zXHJcblx0ICogQHBhcmFtIHtpbnR9IHRva2VuSW5kZXggVG9rZW4gYmVpbmcgcHJvY2Vzc2VkXHJcblx0ICogQHBhcmFtIHtpbnR9IGJyZWFrSW5kZXggSW5kZXggd2l0aGluIGN1cnJlbnQgdG9rZW4ncyB2YWx1ZVxyXG5cdCAqIEBwYXJhbSB7Ym9vbH0gcmVtb3ZlQnJlYWtDaGFyIERvIHdlIHdhbnQgdG8gcmVtb3ZlIHRoZSBicmVha2luZyBjaGFyYWN0ZXI/XHJcblx0ICogQHJldHVybnMge3N0cmluZ30gcmVtYWluaW5nIHVuYnJva2VuIHRva2VuIHZhbHVlXHJcblx0ICovXHJcblx0X2JyZWFrSW5zaWRlVG9rZW46IGZ1bmN0aW9uKHRva2VucywgdG9rZW5JbmRleCwgYnJlYWtJbmRleCwgcmVtb3ZlQnJlYWtDaGFyKSB7XHJcblx0XHR2YXIgbmV3QnJlYWtUb2tlbiA9IHtcclxuXHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9ORVdMSU5FXHJcblx0XHR9O1xyXG5cdFx0dmFyIG5ld1RleHRUb2tlbiA9IHtcclxuXHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9URVhULFxyXG5cdFx0XHR2YWx1ZTogdG9rZW5zW3Rva2VuSW5kZXhdLnZhbHVlLnN1YnN0cmluZyhicmVha0luZGV4ICsgKHJlbW92ZUJyZWFrQ2hhciA/IDEgOiAwKSlcclxuXHRcdH07XHJcblx0XHR0b2tlbnMuc3BsaWNlKHRva2VuSW5kZXgrMSwgMCwgbmV3QnJlYWtUb2tlbiwgbmV3VGV4dFRva2VuKTtcclxuXHRcdHJldHVybiB0b2tlbnNbdG9rZW5JbmRleF0udmFsdWUuc3Vic3RyaW5nKDAsIGJyZWFrSW5kZXgpO1xyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEByZXR1cm5zIHthbnl9IFJhbmRvbWx5IHBpY2tlZCBpdGVtLCBudWxsIHdoZW4gbGVuZ3RoPTBcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5yYW5kb20gPSBBcnJheS5wcm90b3R5cGUucmFuZG9tIHx8IGZ1bmN0aW9uKCkge1xyXG5cdGlmICghdGhpcy5sZW5ndGgpIHsgcmV0dXJuIG51bGw7IH1cclxuXHRyZXR1cm4gdGhpc1tNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogdGhpcy5sZW5ndGgpXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcmV0dXJucyB7YXJyYXl9IE5ldyBhcnJheSB3aXRoIHJhbmRvbWl6ZWQgaXRlbXNcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5yYW5kb21pemUgPSBBcnJheS5wcm90b3R5cGUucmFuZG9taXplIHx8IGZ1bmN0aW9uKCkge1xyXG4gIHZhciByZXN1bHQgPSBbXTtcclxuICB2YXIgY2xvbmUgPSB0aGlzLnNsaWNlKCk7XHJcbiAgd2hpbGUgKGNsb25lLmxlbmd0aCkge1xyXG4gICAgdmFyIGluZGV4ID0gY2xvbmUuaW5kZXhPZihjbG9uZS5yYW5kb20oKSk7XHJcbiAgICByZXN1bHQucHVzaChjbG9uZS5zcGxpY2UoaW5kZXgsIDEpWzBdKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuLyoqXHJcbiAqIEFsd2F5cyBwb3NpdGl2ZSBtb2R1bHVzXHJcbiAqIEBwYXJhbSB7aW50fSBuIE1vZHVsdXNcclxuICogQHJldHVybnMge2ludH0gdGhpcyBtb2R1bG8gblxyXG4gKi9cclxuTnVtYmVyLnByb3RvdHlwZS5tb2QgPSBOdW1iZXIucHJvdG90eXBlLm1vZCB8fCBmdW5jdGlvbihuKSB7XHJcblx0cmV0dXJuICgodGhpcyVuKStuKSVuO1xyXG59O1xyXG4vKipcclxuICogQHJldHVybnMge3N0cmluZ30gRmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkXHJcbiAqL1xyXG5TdHJpbmcucHJvdG90eXBlLmNhcGl0YWxpemUgPSBTdHJpbmcucHJvdG90eXBlLmNhcGl0YWxpemUgfHwgZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnN1YnN0cmluZygxKTtcclxufTtcclxuXHJcbi8qKiBcclxuICogTGVmdCBwYWRcclxuICogQHBhcmFtIHtzdHJpbmd9IFtjaGFyYWN0ZXI9XCIwXCJdXHJcbiAqIEBwYXJhbSB7aW50fSBbY291bnQ9Ml1cclxuICovXHJcblN0cmluZy5wcm90b3R5cGUubHBhZCA9IFN0cmluZy5wcm90b3R5cGUubHBhZCB8fCBmdW5jdGlvbihjaGFyYWN0ZXIsIGNvdW50KSB7XHJcblx0dmFyIGNoID0gY2hhcmFjdGVyIHx8IFwiMFwiO1xyXG5cdHZhciBjbnQgPSBjb3VudCB8fCAyO1xyXG5cclxuXHR2YXIgcyA9IFwiXCI7XHJcblx0d2hpbGUgKHMubGVuZ3RoIDwgKGNudCAtIHRoaXMubGVuZ3RoKSkgeyBzICs9IGNoOyB9XHJcblx0cyA9IHMuc3Vic3RyaW5nKDAsIGNudC10aGlzLmxlbmd0aCk7XHJcblx0cmV0dXJuIHMrdGhpcztcclxufTtcclxuXHJcbi8qKiBcclxuICogUmlnaHQgcGFkXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbY2hhcmFjdGVyPVwiMFwiXVxyXG4gKiBAcGFyYW0ge2ludH0gW2NvdW50PTJdXHJcbiAqL1xyXG5TdHJpbmcucHJvdG90eXBlLnJwYWQgPSBTdHJpbmcucHJvdG90eXBlLnJwYWQgfHwgZnVuY3Rpb24oY2hhcmFjdGVyLCBjb3VudCkge1xyXG5cdHZhciBjaCA9IGNoYXJhY3RlciB8fCBcIjBcIjtcclxuXHR2YXIgY250ID0gY291bnQgfHwgMjtcclxuXHJcblx0dmFyIHMgPSBcIlwiO1xyXG5cdHdoaWxlIChzLmxlbmd0aCA8IChjbnQgLSB0aGlzLmxlbmd0aCkpIHsgcyArPSBjaDsgfVxyXG5cdHMgPSBzLnN1YnN0cmluZygwLCBjbnQtdGhpcy5sZW5ndGgpO1xyXG5cdHJldHVybiB0aGlzK3M7XHJcbn07XHJcblxyXG4vKipcclxuICogRm9ybWF0IGEgc3RyaW5nIGluIGEgZmxleGlibGUgd2F5LiBTY2FucyBmb3IgJXMgc3RyaW5ncyBhbmQgcmVwbGFjZXMgdGhlbSB3aXRoIGFyZ3VtZW50cy4gTGlzdCBvZiBwYXR0ZXJucyBpcyBtb2RpZmlhYmxlIHZpYSBTdHJpbmcuZm9ybWF0Lm1hcC5cclxuICogQHBhcmFtIHtzdHJpbmd9IHRlbXBsYXRlXHJcbiAqIEBwYXJhbSB7YW55fSBbYXJndl1cclxuICovXHJcblN0cmluZy5mb3JtYXQgPSBTdHJpbmcuZm9ybWF0IHx8IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XHJcblx0dmFyIG1hcCA9IFN0cmluZy5mb3JtYXQubWFwO1xyXG5cdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuXHJcblx0dmFyIHJlcGxhY2VyID0gZnVuY3Rpb24obWF0Y2gsIGdyb3VwMSwgZ3JvdXAyLCBpbmRleCkge1xyXG5cdFx0aWYgKHRlbXBsYXRlLmNoYXJBdChpbmRleC0xKSA9PSBcIiVcIikgeyByZXR1cm4gbWF0Y2guc3Vic3RyaW5nKDEpOyB9XHJcblx0XHRpZiAoIWFyZ3MubGVuZ3RoKSB7IHJldHVybiBtYXRjaDsgfVxyXG5cdFx0dmFyIG9iaiA9IGFyZ3NbMF07XHJcblxyXG5cdFx0dmFyIGdyb3VwID0gZ3JvdXAxIHx8IGdyb3VwMjtcclxuXHRcdHZhciBwYXJ0cyA9IGdyb3VwLnNwbGl0KFwiLFwiKTtcclxuXHRcdHZhciBuYW1lID0gcGFydHMuc2hpZnQoKTtcclxuXHRcdHZhciBtZXRob2QgPSBtYXBbbmFtZS50b0xvd2VyQ2FzZSgpXTtcclxuXHRcdGlmICghbWV0aG9kKSB7IHJldHVybiBtYXRjaDsgfVxyXG5cclxuXHRcdHZhciBvYmogPSBhcmdzLnNoaWZ0KCk7XHJcblx0XHR2YXIgcmVwbGFjZWQgPSBvYmpbbWV0aG9kXS5hcHBseShvYmosIHBhcnRzKTtcclxuXHJcblx0XHR2YXIgZmlyc3QgPSBuYW1lLmNoYXJBdCgwKTtcclxuXHRcdGlmIChmaXJzdCAhPSBmaXJzdC50b0xvd2VyQ2FzZSgpKSB7IHJlcGxhY2VkID0gcmVwbGFjZWQuY2FwaXRhbGl6ZSgpOyB9XHJcblxyXG5cdFx0cmV0dXJuIHJlcGxhY2VkO1xyXG5cdH07XHJcblx0cmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoLyUoPzooW2Etel0rKXwoPzp7KFtefV0rKX0pKS9naSwgcmVwbGFjZXIpO1xyXG59O1xyXG5cclxuU3RyaW5nLmZvcm1hdC5tYXAgPSBTdHJpbmcuZm9ybWF0Lm1hcCB8fCB7XHJcblx0XCJzXCI6IFwidG9TdHJpbmdcIlxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlbmllbmNlIHNob3J0Y3V0IHRvIFN0cmluZy5mb3JtYXQodGhpcylcclxuICovXHJcblN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgfHwgZnVuY3Rpb24oKSB7XHJcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG5cdGFyZ3MudW5zaGlmdCh0aGlzKTtcclxuXHRyZXR1cm4gU3RyaW5nLmZvcm1hdC5hcHBseShTdHJpbmcsIGFyZ3MpO1xyXG59O1xyXG5cclxuaWYgKCFPYmplY3QuY3JlYXRlKSB7ICBcclxuXHQvKipcclxuXHQgKiBFUzUgT2JqZWN0LmNyZWF0ZVxyXG5cdCAqL1xyXG5cdE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbihvKSB7ICBcclxuXHRcdHZhciB0bXAgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0dG1wLnByb3RvdHlwZSA9IG87XHJcblx0XHRyZXR1cm4gbmV3IHRtcCgpO1xyXG5cdH07ICBcclxufSAgXHJcbi8qKlxyXG4gKiBTZXRzIHByb3RvdHlwZSBvZiB0aGlzIGZ1bmN0aW9uIHRvIGFuIGluc3RhbmNlIG9mIHBhcmVudCBmdW5jdGlvblxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBwYXJlbnRcclxuICovXHJcbkZ1bmN0aW9uLnByb3RvdHlwZS5leHRlbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuZXh0ZW5kIHx8IGZ1bmN0aW9uKHBhcmVudCkge1xyXG5cdHRoaXMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcclxuXHR0aGlzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHRoaXM7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbmlmICh0eXBlb2Ygd2luZG93ICE9IFwidW5kZWZpbmVkXCIpIHtcclxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID1cclxuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IGZ1bmN0aW9uKGNiKSB7IHJldHVybiBzZXRUaW1lb3V0KGNiLCAxMDAwLzYwKTsgfTtcclxuXHJcblx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID1cclxuXHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cdFx0fHwgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5vQ2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHRcdHx8IHdpbmRvdy5tc0NhbmNlbEFuaW1hdGlvbkZyYW1lXHJcblx0XHR8fCBmdW5jdGlvbihpZCkgeyByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTsgfTtcclxufVxyXG4vKipcclxuICogQGNsYXNzIFZpc3VhbCBtYXAgZGlzcGxheVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy53aWR0aD1ST1QuREVGQVVMVF9XSURUSF1cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLmhlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5mb250U2l6ZT0xNV1cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmZvbnRGYW1pbHk9XCJtb25vc3BhY2VcIl1cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmZvbnRTdHlsZT1cIlwiXSBib2xkL2l0YWxpYy9ub25lL2JvdGhcclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmZnPVwiI2NjY1wiXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuYmc9XCIjMDAwXCJdXHJcbiAqIEBwYXJhbSB7ZmxvYXR9IFtvcHRpb25zLnNwYWNpbmc9MV1cclxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMuYm9yZGVyPTBdXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5sYXlvdXQ9XCJyZWN0XCJdXHJcbiAqIEBwYXJhbSB7Ym9vbH0gW29wdGlvbnMuZm9yY2VTcXVhcmVSYXRpbz1mYWxzZV1cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRpbGVXaWR0aD0zMl1cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRpbGVIZWlnaHQ9MzJdXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy50aWxlTWFwPXt9XVxyXG4gKiBAcGFyYW0ge2ltYWdlfSBbb3B0aW9ucy50aWxlU2V0PW51bGxdXHJcbiAqIEBwYXJhbSB7aW1hZ2V9IFtvcHRpb25zLnRpbGVDb2xvcml6ZT1mYWxzZV1cclxuICovXHJcblJPVC5EaXNwbGF5ID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG5cdHRoaXMuX2NvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cdHRoaXMuX2RhdGEgPSB7fTtcclxuXHR0aGlzLl9kaXJ0eSA9IGZhbHNlOyAvKiBmYWxzZSA9IG5vdGhpbmcsIHRydWUgPSBhbGwsIG9iamVjdCA9IGRpcnR5IGNlbGxzICovXHJcblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xyXG5cdHRoaXMuX2JhY2tlbmQgPSBudWxsO1xyXG5cdFxyXG5cdHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcclxuXHRcdHdpZHRoOiBST1QuREVGQVVMVF9XSURUSCxcclxuXHRcdGhlaWdodDogUk9ULkRFRkFVTFRfSEVJR0hULFxyXG5cdFx0dHJhbnNwb3NlOiBmYWxzZSxcclxuXHRcdGxheW91dDogXCJyZWN0XCIsXHJcblx0XHRmb250U2l6ZTogMTUsXHJcblx0XHRzcGFjaW5nOiAxLFxyXG5cdFx0Ym9yZGVyOiAwLFxyXG5cdFx0Zm9yY2VTcXVhcmVSYXRpbzogZmFsc2UsXHJcblx0XHRmb250RmFtaWx5OiBcIm1vbm9zcGFjZVwiLFxyXG5cdFx0Zm9udFN0eWxlOiBcIlwiLFxyXG5cdFx0Zmc6IFwiI2NjY1wiLFxyXG5cdFx0Ymc6IFwiIzAwMFwiLFxyXG5cdFx0dGlsZVdpZHRoOiAzMixcclxuXHRcdHRpbGVIZWlnaHQ6IDMyLFxyXG5cdFx0dGlsZU1hcDoge30sXHJcblx0XHR0aWxlU2V0OiBudWxsLFxyXG5cdFx0dGlsZUNvbG9yaXplOiBmYWxzZSxcclxuXHRcdHRlcm1Db2xvcjogXCJ4dGVybVwiXHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgZGVmYXVsdE9wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblx0dGhpcy5zZXRPcHRpb25zKGRlZmF1bHRPcHRpb25zKTtcclxuXHR0aGlzLkRFQlVHID0gdGhpcy5ERUJVRy5iaW5kKHRoaXMpO1xyXG5cclxuXHR0aGlzLl90aWNrID0gdGhpcy5fdGljay5iaW5kKHRoaXMpO1xyXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl90aWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZWJ1ZyBoZWxwZXIsIGlkZWFsIGFzIGEgbWFwIGdlbmVyYXRvciBjYWxsYmFjay4gQWx3YXlzIGJvdW5kIHRvIHRoaXMuXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSB3aGF0XHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuREVCVUcgPSBmdW5jdGlvbih4LCB5LCB3aGF0KSB7XHJcblx0dmFyIGNvbG9ycyA9IFt0aGlzLl9vcHRpb25zLmJnLCB0aGlzLl9vcHRpb25zLmZnXTtcclxuXHR0aGlzLmRyYXcoeCwgeSwgbnVsbCwgbnVsbCwgY29sb3JzW3doYXQgJSBjb2xvcnMubGVuZ3RoXSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xlYXIgdGhlIHdob2xlIGRpc3BsYXkgKGNvdmVyIGl0IHdpdGggYmFja2dyb3VuZCBjb2xvcilcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2RhdGEgPSB7fTtcclxuXHR0aGlzLl9kaXJ0eSA9IHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuRGlzcGxheVxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblx0aWYgKG9wdGlvbnMud2lkdGggfHwgb3B0aW9ucy5oZWlnaHQgfHwgb3B0aW9ucy5mb250U2l6ZSB8fCBvcHRpb25zLmZvbnRGYW1pbHkgfHwgb3B0aW9ucy5zcGFjaW5nIHx8IG9wdGlvbnMubGF5b3V0KSB7XHJcblx0XHRpZiAob3B0aW9ucy5sYXlvdXQpIHsgXHJcblx0XHRcdHRoaXMuX2JhY2tlbmQgPSBuZXcgUk9ULkRpc3BsYXlbb3B0aW9ucy5sYXlvdXQuY2FwaXRhbGl6ZSgpXSh0aGlzLl9jb250ZXh0KTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZm9udCA9ICh0aGlzLl9vcHRpb25zLmZvbnRTdHlsZSA/IHRoaXMuX29wdGlvbnMuZm9udFN0eWxlICsgXCIgXCIgOiBcIlwiKSArIHRoaXMuX29wdGlvbnMuZm9udFNpemUgKyBcInB4IFwiICsgdGhpcy5fb3B0aW9ucy5mb250RmFtaWx5O1xyXG5cdFx0dGhpcy5fY29udGV4dC5mb250ID0gZm9udDtcclxuXHRcdHRoaXMuX2JhY2tlbmQuY29tcHV0ZSh0aGlzLl9vcHRpb25zKTtcclxuXHRcdHRoaXMuX2NvbnRleHQuZm9udCA9IGZvbnQ7XHJcblx0XHR0aGlzLl9jb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcblx0XHR0aGlzLl9jb250ZXh0LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcblx0XHR0aGlzLl9kaXJ0eSA9IHRydWU7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgY3VycmVudGx5IHNldCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9IEN1cnJlbnQgb3B0aW9ucyBvYmplY3QgXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIERPTSBub2RlIG9mIHRoaXMgZGlzcGxheVxyXG4gKiBAcmV0dXJucyB7bm9kZX0gRE9NIG5vZGVcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5nZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5fY29udGV4dC5jYW52YXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB0aGUgbWF4aW11bSB3aWR0aC9oZWlnaHQgdG8gZml0IGludG8gYSBzZXQgb2YgZ2l2ZW4gY29uc3RyYWludHNcclxuICogQHBhcmFtIHtpbnR9IGF2YWlsV2lkdGggTWF4aW11bSBhbGxvd2VkIHBpeGVsIHdpZHRoXHJcbiAqIEBwYXJhbSB7aW50fSBhdmFpbEhlaWdodCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgaGVpZ2h0XHJcbiAqIEByZXR1cm5zIHtpbnRbMl19IGNlbGxXaWR0aCxjZWxsSGVpZ2h0XHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHJldHVybiB0aGlzLl9iYWNrZW5kLmNvbXB1dGVTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0LCB0aGlzLl9vcHRpb25zKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHRoZSBtYXhpbXVtIGZvbnQgc2l6ZSB0byBmaXQgaW50byBhIHNldCBvZiBnaXZlbiBjb25zdHJhaW50c1xyXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxXaWR0aCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgd2lkdGhcclxuICogQHBhcmFtIHtpbnR9IGF2YWlsSGVpZ2h0IE1heGltdW0gYWxsb3dlZCBwaXhlbCBoZWlnaHRcclxuICogQHJldHVybnMge2ludH0gZm9udFNpemVcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHJldHVybiB0aGlzLl9iYWNrZW5kLmNvbXB1dGVGb250U2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCwgdGhpcy5fb3B0aW9ucyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29udmVydCBhIERPTSBldmVudCAobW91c2Ugb3IgdG91Y2gpIHRvIG1hcCBjb29yZGluYXRlcy4gVXNlcyBmaXJzdCB0b3VjaCBmb3IgbXVsdGktdG91Y2guXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgZXZlbnRcclxuICogQHJldHVybnMge2ludFsyXX0gLTEgZm9yIHZhbHVlcyBvdXRzaWRlIG9mIHRoZSBjYW52YXNcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbihlKSB7XHJcblx0aWYgKGUudG91Y2hlcykge1xyXG5cdFx0dmFyIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuXHRcdHZhciB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciB4ID0gZS5jbGllbnRYO1xyXG5cdFx0dmFyIHkgPSBlLmNsaWVudFk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVjdCA9IHRoaXMuX2NvbnRleHQuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdHggLT0gcmVjdC5sZWZ0O1xyXG5cdHkgLT0gcmVjdC50b3A7XHJcblx0XHJcblx0eCAqPSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCAvIHRoaXMuX2NvbnRleHQuY2FudmFzLmNsaWVudFdpZHRoO1xyXG5cdHkgKj0gdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0IC8gdGhpcy5fY29udGV4dC5jYW52YXMuY2xpZW50SGVpZ2h0O1xyXG5cclxuXHRpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCB8fCB5ID49IHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCkgeyByZXR1cm4gWy0xLCAtMV07IH1cclxuXHJcblx0cmV0dXJuIHRoaXMuX2JhY2tlbmQuZXZlbnRUb1Bvc2l0aW9uKHgsIHkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7c3RyaW5nIHx8IHN0cmluZ1tdfSBjaCBPbmUgb3IgbW9yZSBjaGFycyAod2lsbCBiZSBvdmVybGFwcGluZyB0aGVtc2VsdmVzKVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW2ZnXSBmb3JlZ3JvdW5kIGNvbG9yXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYmddIGJhY2tncm91bmQgY29sb3JcclxuICovXHJcblJPVC5EaXNwbGF5LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oeCwgeSwgY2gsIGZnLCBiZykge1xyXG5cdGlmICghZmcpIHsgZmcgPSB0aGlzLl9vcHRpb25zLmZnOyB9XHJcblx0aWYgKCFiZykgeyBiZyA9IHRoaXMuX29wdGlvbnMuYmc7IH1cclxuXHR0aGlzLl9kYXRhW3grXCIsXCIreV0gPSBbeCwgeSwgY2gsIGZnLCBiZ107XHJcblx0XHJcblx0aWYgKHRoaXMuX2RpcnR5ID09PSB0cnVlKSB7IHJldHVybjsgfSAvKiB3aWxsIGFscmVhZHkgcmVkcmF3IGV2ZXJ5dGhpbmcgKi9cclxuXHRpZiAoIXRoaXMuX2RpcnR5KSB7IHRoaXMuX2RpcnR5ID0ge307IH0gLyogZmlyc3QhICovXHJcblx0dGhpcy5fZGlydHlbeCtcIixcIit5XSA9IHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogRHJhd3MgYSB0ZXh0IGF0IGdpdmVuIHBvc2l0aW9uLiBPcHRpb25hbGx5IHdyYXBzIGF0IGEgbWF4aW11bSBsZW5ndGguIEN1cnJlbnRseSBkb2VzIG5vdCB3b3JrIHdpdGggaGV4IGxheW91dC5cclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgTWF5IGNvbnRhaW4gY29sb3IvYmFja2dyb3VuZCBmb3JtYXQgc3BlY2lmaWVycywgJWN7bmFtZX0vJWJ7bmFtZX0sIGJvdGggb3B0aW9uYWwuICVje30vJWJ7fSByZXNldHMgdG8gZGVmYXVsdC5cclxuICogQHBhcmFtIHtpbnR9IFttYXhXaWR0aF0gd3JhcCBhdCB3aGF0IHdpZHRoP1xyXG4gKiBAcmV0dXJucyB7aW50fSBsaW5lcyBkcmF3blxyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLmRyYXdUZXh0ID0gZnVuY3Rpb24oeCwgeSwgdGV4dCwgbWF4V2lkdGgpIHtcclxuXHR2YXIgZmcgPSBudWxsO1xyXG5cdHZhciBiZyA9IG51bGw7XHJcblx0dmFyIGN4ID0geDtcclxuXHR2YXIgY3kgPSB5O1xyXG5cdHZhciBsaW5lcyA9IDE7XHJcblx0aWYgKCFtYXhXaWR0aCkgeyBtYXhXaWR0aCA9IHRoaXMuX29wdGlvbnMud2lkdGgteDsgfVxyXG5cclxuXHR2YXIgdG9rZW5zID0gUk9ULlRleHQudG9rZW5pemUodGV4dCwgbWF4V2lkdGgpO1xyXG5cclxuXHR3aGlsZSAodG9rZW5zLmxlbmd0aCkgeyAvKiBpbnRlcnByZXQgdG9rZW5pemVkIG9wY29kZSBzdHJlYW0gKi9cclxuXHRcdHZhciB0b2tlbiA9IHRva2Vucy5zaGlmdCgpO1xyXG5cdFx0c3dpdGNoICh0b2tlbi50eXBlKSB7XHJcblx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9URVhUOlxyXG5cdFx0XHRcdHZhciBpc1NwYWNlID0gZmFsc2UsIGlzUHJldlNwYWNlID0gZmFsc2UsIGlzRnVsbFdpZHRoID0gZmFsc2UsIGlzUHJldkZ1bGxXaWR0aCA9IGZhbHNlO1xyXG5cdFx0XHRcdGZvciAodmFyIGk9MDtpPHRva2VuLnZhbHVlLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0XHRcdHZhciBjYyA9IHRva2VuLnZhbHVlLmNoYXJDb2RlQXQoaSk7XHJcblx0XHRcdFx0XHR2YXIgYyA9IHRva2VuLnZhbHVlLmNoYXJBdChpKTtcclxuXHRcdFx0XHRcdC8vIEFzc2lnbiB0byBgdHJ1ZWAgd2hlbiB0aGUgY3VycmVudCBjaGFyIGlzIGZ1bGwtd2lkdGguXHJcblx0XHRcdFx0XHRpc0Z1bGxXaWR0aCA9IChjYyA+IDB4ZmYwMCAmJiBjYyA8IDB4ZmY2MSkgfHwgKGNjID4gMHhmZmRjICYmIGNjIDwgMHhmZmU4KSB8fCBjYyA+IDB4ZmZlZTtcclxuXHRcdFx0XHRcdC8vIEN1cnJlbnQgY2hhciBpcyBzcGFjZSwgd2hhdGV2ZXIgZnVsbC13aWR0aCBvciBoYWxmLXdpZHRoIGJvdGggYXJlIE9LLlxyXG5cdFx0XHRcdFx0aXNTcGFjZSA9IChjLmNoYXJDb2RlQXQoMCkgPT0gMHgyMCB8fCBjLmNoYXJDb2RlQXQoMCkgPT0gMHgzMDAwKTtcclxuXHRcdFx0XHRcdC8vIFRoZSBwcmV2aW91cyBjaGFyIGlzIGZ1bGwtd2lkdGggYW5kXHJcblx0XHRcdFx0XHQvLyBjdXJyZW50IGNoYXIgaXMgbmV0aGVyIGhhbGYtd2lkdGggbm9yIGEgc3BhY2UuXHJcblx0XHRcdFx0XHRpZiAoaXNQcmV2RnVsbFdpZHRoICYmICFpc0Z1bGxXaWR0aCAmJiAhaXNTcGFjZSkgeyBjeCsrOyB9IC8vIGFkZCBhbiBleHRyYSBwb3NpdGlvblxyXG5cdFx0XHRcdFx0Ly8gVGhlIGN1cnJlbnQgY2hhciBpcyBmdWxsLXdpZHRoIGFuZFxyXG5cdFx0XHRcdFx0Ly8gdGhlIHByZXZpb3VzIGNoYXIgaXMgbm90IGEgc3BhY2UuXHJcblx0XHRcdFx0XHRpZihpc0Z1bGxXaWR0aCAmJiAhaXNQcmV2U3BhY2UpIHsgY3grKzsgfSAvLyBhZGQgYW4gZXh0cmEgcG9zaXRpb25cclxuXHRcdFx0XHRcdHRoaXMuZHJhdyhjeCsrLCBjeSwgYywgZmcsIGJnKTtcclxuXHRcdFx0XHRcdGlzUHJldlNwYWNlID0gaXNTcGFjZTtcclxuXHRcdFx0XHRcdGlzUHJldkZ1bGxXaWR0aCA9IGlzRnVsbFdpZHRoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfRkc6XHJcblx0XHRcdFx0ZmcgPSB0b2tlbi52YWx1ZSB8fCBudWxsO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgUk9ULlRleHQuVFlQRV9CRzpcclxuXHRcdFx0XHRiZyA9IHRva2VuLnZhbHVlIHx8IG51bGw7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX05FV0xJTkU6XHJcblx0XHRcdFx0Y3ggPSB4O1xyXG5cdFx0XHRcdGN5Kys7XHJcblx0XHRcdFx0bGluZXMrKztcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbGluZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogVGltZXIgdGljazogdXBkYXRlIGRpcnR5IHBhcnRzXHJcbiAqL1xyXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuX3RpY2sgPSBmdW5jdGlvbigpIHtcclxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fdGljayk7XHJcblxyXG5cdGlmICghdGhpcy5fZGlydHkpIHsgcmV0dXJuOyB9XHJcblxyXG5cdGlmICh0aGlzLl9kaXJ0eSA9PT0gdHJ1ZSkgeyAvKiBkcmF3IGFsbCAqL1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLl9vcHRpb25zLmJnO1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcclxuXHJcblx0XHRmb3IgKHZhciBpZCBpbiB0aGlzLl9kYXRhKSB7IC8qIHJlZHJhdyBjYWNoZWQgZGF0YSAqL1xyXG5cdFx0XHR0aGlzLl9kcmF3KGlkLCBmYWxzZSk7XHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSB7IC8qIGRyYXcgb25seSBkaXJ0eSAqL1xyXG5cdFx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2RpcnR5KSB7XHJcblx0XHRcdHRoaXMuX2RyYXcoa2V5LCB0cnVlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuX2RpcnR5ID0gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBXaGF0IHRvIGRyYXdcclxuICogQHBhcmFtIHtib29sfSBjbGVhckJlZm9yZSBJcyBpdCBuZWNlc3NhcnkgdG8gY2xlYW4gYmVmb3JlP1xyXG4gKi9cclxuUk9ULkRpc3BsYXkucHJvdG90eXBlLl9kcmF3ID0gZnVuY3Rpb24oa2V5LCBjbGVhckJlZm9yZSkge1xyXG5cdHZhciBkYXRhID0gdGhpcy5fZGF0YVtrZXldO1xyXG5cdGlmIChkYXRhWzRdICE9IHRoaXMuX29wdGlvbnMuYmcpIHsgY2xlYXJCZWZvcmUgPSB0cnVlOyB9XHJcblxyXG5cdHRoaXMuX2JhY2tlbmQuZHJhdyhkYXRhLCBjbGVhckJlZm9yZSk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQWJzdHJhY3QgZGlzcGxheSBiYWNrZW5kIG1vZHVsZVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkuQmFja2VuZCA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHR0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkJhY2tlbmQucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUmVjdGFuZ3VsYXIgYmFja2VuZFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkuUmVjdCA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRST1QuRGlzcGxheS5CYWNrZW5kLmNhbGwodGhpcywgY29udGV4dCk7XHJcblx0XHJcblx0dGhpcy5fc3BhY2luZ1ggPSAwO1xyXG5cdHRoaXMuX3NwYWNpbmdZID0gMDtcclxuXHR0aGlzLl9jYW52YXNDYWNoZSA9IHt9O1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7fTtcclxufTtcclxuUk9ULkRpc3BsYXkuUmVjdC5leHRlbmQoUk9ULkRpc3BsYXkuQmFja2VuZCk7XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LmNhY2hlID0gZmFsc2U7XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHRoaXMuX2NhbnZhc0NhY2hlID0ge307XHJcblx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG5cdHZhciBjaGFyV2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xyXG5cdHRoaXMuX3NwYWNpbmdYID0gTWF0aC5jZWlsKG9wdGlvbnMuc3BhY2luZyAqIGNoYXJXaWR0aCk7XHJcblx0dGhpcy5fc3BhY2luZ1kgPSBNYXRoLmNlaWwob3B0aW9ucy5zcGFjaW5nICogb3B0aW9ucy5mb250U2l6ZSk7XHJcblxyXG5cdGlmICh0aGlzLl9vcHRpb25zLmZvcmNlU3F1YXJlUmF0aW8pIHtcclxuXHRcdHRoaXMuX3NwYWNpbmdYID0gdGhpcy5fc3BhY2luZ1kgPSBNYXRoLm1heCh0aGlzLl9zcGFjaW5nWCwgdGhpcy5fc3BhY2luZ1kpO1xyXG5cdH1cclxuXHJcblx0dGhpcy5fY29udGV4dC5jYW52YXMud2lkdGggPSBvcHRpb25zLndpZHRoICogdGhpcy5fc3BhY2luZ1g7XHJcblx0dGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgKiB0aGlzLl9zcGFjaW5nWTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG5cdGlmICh0aGlzLmNvbnN0cnVjdG9yLmNhY2hlKSB7XHJcblx0XHR0aGlzLl9kcmF3V2l0aENhY2hlKGRhdGEsIGNsZWFyQmVmb3JlKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dGhpcy5fZHJhd05vQ2FjaGUoZGF0YSwgY2xlYXJCZWZvcmUpO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLl9kcmF3V2l0aENhY2hlID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxuXHR2YXIgeCA9IGRhdGFbMF07XHJcblx0dmFyIHkgPSBkYXRhWzFdO1xyXG5cdHZhciBjaCA9IGRhdGFbMl07XHJcblx0dmFyIGZnID0gZGF0YVszXTtcclxuXHR2YXIgYmcgPSBkYXRhWzRdO1xyXG5cclxuXHR2YXIgaGFzaCA9IFwiXCIrY2grZmcrYmc7XHJcblx0aWYgKGhhc2ggaW4gdGhpcy5fY2FudmFzQ2FjaGUpIHtcclxuXHRcdHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXNDYWNoZVtoYXNoXTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGIgPSB0aGlzLl9vcHRpb25zLmJvcmRlcjtcclxuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG5cdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblx0XHRjYW52YXMud2lkdGggPSB0aGlzLl9zcGFjaW5nWDtcclxuXHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLl9zcGFjaW5nWTtcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBiZztcclxuXHRcdGN0eC5maWxsUmVjdChiLCBiLCBjYW52YXMud2lkdGgtYiwgY2FudmFzLmhlaWdodC1iKTtcclxuXHRcdFxyXG5cdFx0aWYgKGNoKSB7XHJcblx0XHRcdGN0eC5maWxsU3R5bGUgPSBmZztcclxuXHRcdFx0Y3R4LmZvbnQgPSB0aGlzLl9jb250ZXh0LmZvbnQ7XHJcblx0XHRcdGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG5cdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuXHJcblx0XHRcdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XHJcblx0XHRcdGZvciAodmFyIGk9MDtpPGNoYXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0XHRjdHguZmlsbFRleHQoY2hhcnNbaV0sIHRoaXMuX3NwYWNpbmdYLzIsIE1hdGguY2VpbCh0aGlzLl9zcGFjaW5nWS8yKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMuX2NhbnZhc0NhY2hlW2hhc2hdID0gY2FudmFzO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLl9jb250ZXh0LmRyYXdJbWFnZShjYW52YXMsIHgqdGhpcy5fc3BhY2luZ1gsIHkqdGhpcy5fc3BhY2luZ1kpO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuX2RyYXdOb0NhY2hlID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcclxuXHR2YXIgeCA9IGRhdGFbMF07XHJcblx0dmFyIHkgPSBkYXRhWzFdO1xyXG5cdHZhciBjaCA9IGRhdGFbMl07XHJcblx0dmFyIGZnID0gZGF0YVszXTtcclxuXHR2YXIgYmcgPSBkYXRhWzRdO1xyXG5cclxuXHRpZiAoY2xlYXJCZWZvcmUpIHsgXHJcblx0XHR2YXIgYiA9IHRoaXMuX29wdGlvbnMuYm9yZGVyO1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBiZztcclxuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoeCp0aGlzLl9zcGFjaW5nWCArIGIsIHkqdGhpcy5fc3BhY2luZ1kgKyBiLCB0aGlzLl9zcGFjaW5nWCAtIGIsIHRoaXMuX3NwYWNpbmdZIC0gYik7XHJcblx0fVxyXG5cdFxyXG5cdGlmICghY2gpIHsgcmV0dXJuOyB9XHJcblxyXG5cdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gZmc7XHJcblxyXG5cdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XHJcblx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dGhpcy5fY29udGV4dC5maWxsVGV4dChjaGFyc1tpXSwgKHgrMC41KSAqIHRoaXMuX3NwYWNpbmdYLCBNYXRoLmNlaWwoKHkrMC41KSAqIHRoaXMuX3NwYWNpbmdZKSk7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX3NwYWNpbmdYKTtcclxuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX3NwYWNpbmdZKTtcclxuXHRyZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHR2YXIgYm94V2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLndpZHRoKTtcclxuXHR2YXIgYm94SGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0KTtcclxuXHJcblx0LyogY29tcHV0ZSBjaGFyIHJhdGlvICovXHJcblx0dmFyIG9sZEZvbnQgPSB0aGlzLl9jb250ZXh0LmZvbnQ7XHJcblx0dGhpcy5fY29udGV4dC5mb250ID0gXCIxMDBweCBcIiArIHRoaXMuX29wdGlvbnMuZm9udEZhbWlseTtcclxuXHR2YXIgd2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xyXG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IG9sZEZvbnQ7XHJcblx0dmFyIHJhdGlvID0gd2lkdGggLyAxMDA7XHJcblx0XHRcclxuXHR2YXIgd2lkdGhGcmFjdGlvbiA9IHJhdGlvICogYm94SGVpZ2h0IC8gYm94V2lkdGg7XHJcblx0aWYgKHdpZHRoRnJhY3Rpb24gPiAxKSB7IC8qIHRvbyB3aWRlIHdpdGggY3VycmVudCBhc3BlY3QgcmF0aW8gKi9cclxuXHRcdGJveEhlaWdodCA9IE1hdGguZmxvb3IoYm94SGVpZ2h0IC8gd2lkdGhGcmFjdGlvbik7XHJcblx0fVxyXG5cdHJldHVybiBNYXRoLmZsb29yKGJveEhlaWdodCAvIHRoaXMuX29wdGlvbnMuc3BhY2luZyk7XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0cmV0dXJuIFtNYXRoLmZsb29yKHgvdGhpcy5fc3BhY2luZ1gpLCBNYXRoLmZsb29yKHkvdGhpcy5fc3BhY2luZ1kpXTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBIZXhhZ29uYWwgYmFja2VuZFxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUk9ULkRpc3BsYXkuSGV4ID0gZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFJPVC5EaXNwbGF5LkJhY2tlbmQuY2FsbCh0aGlzLCBjb250ZXh0KTtcclxuXHJcblx0dGhpcy5fc3BhY2luZ1ggPSAwO1xyXG5cdHRoaXMuX3NwYWNpbmdZID0gMDtcclxuXHR0aGlzLl9oZXhTaXplID0gMDtcclxuXHR0aGlzLl9vcHRpb25zID0ge307XHJcbn07XHJcblJPVC5EaXNwbGF5LkhleC5leHRlbmQoUk9ULkRpc3BsYXkuQmFja2VuZCk7XHJcblxyXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG5cdC8qIEZJWE1FIGNoYXIgc2l6ZSBjb21wdXRhdGlvbiBkb2VzIG5vdCByZXNwZWN0IHRyYW5zcG9zZWQgaGV4ZXMgKi9cclxuXHR2YXIgY2hhcldpZHRoID0gTWF0aC5jZWlsKHRoaXMuX2NvbnRleHQubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcclxuXHR0aGlzLl9oZXhTaXplID0gTWF0aC5mbG9vcihvcHRpb25zLnNwYWNpbmcgKiAob3B0aW9ucy5mb250U2l6ZSArIGNoYXJXaWR0aC9NYXRoLnNxcnQoMykpIC8gMik7XHJcblx0dGhpcy5fc3BhY2luZ1ggPSB0aGlzLl9oZXhTaXplICogTWF0aC5zcXJ0KDMpIC8gMjtcclxuXHR0aGlzLl9zcGFjaW5nWSA9IHRoaXMuX2hleFNpemUgKiAxLjU7XHJcblxyXG5cdGlmIChvcHRpb25zLnRyYW5zcG9zZSkge1xyXG5cdFx0dmFyIHhwcm9wID0gXCJoZWlnaHRcIjtcclxuXHRcdHZhciB5cHJvcCA9IFwid2lkdGhcIjtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIHhwcm9wID0gXCJ3aWR0aFwiO1xyXG5cdFx0dmFyIHlwcm9wID0gXCJoZWlnaHRcIjtcclxuXHR9XHJcblx0dGhpcy5fY29udGV4dC5jYW52YXNbeHByb3BdID0gTWF0aC5jZWlsKCAob3B0aW9ucy53aWR0aCArIDEpICogdGhpcy5fc3BhY2luZ1ggKTtcclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhc1t5cHJvcF0gPSBNYXRoLmNlaWwoIChvcHRpb25zLmhlaWdodCAtIDEpICogdGhpcy5fc3BhY2luZ1kgKyAyKnRoaXMuX2hleFNpemUgKTtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XHJcblx0dmFyIHggPSBkYXRhWzBdO1xyXG5cdHZhciB5ID0gZGF0YVsxXTtcclxuXHR2YXIgY2ggPSBkYXRhWzJdO1xyXG5cdHZhciBmZyA9IGRhdGFbM107XHJcblx0dmFyIGJnID0gZGF0YVs0XTtcclxuXHJcblx0dmFyIHB4ID0gW1xyXG5cdFx0KHgrMSkgKiB0aGlzLl9zcGFjaW5nWCxcclxuXHRcdHkgKiB0aGlzLl9zcGFjaW5nWSArIHRoaXMuX2hleFNpemVcclxuXHRdO1xyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkgeyBweC5yZXZlcnNlKCk7IH1cclxuXHJcblx0aWYgKGNsZWFyQmVmb3JlKSB7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xyXG5cdFx0dGhpcy5fZmlsbChweFswXSwgcHhbMV0pO1xyXG5cdH1cclxuXHJcblx0aWYgKCFjaCkgeyByZXR1cm47IH1cclxuXHJcblx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBmZztcclxuXHJcblx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcclxuXHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XHJcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxUZXh0KGNoYXJzW2ldLCBweFswXSwgTWF0aC5jZWlsKHB4WzFdKSk7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHRhdmFpbFdpZHRoICs9IGF2YWlsSGVpZ2h0O1xyXG5cdFx0YXZhaWxIZWlnaHQgPSBhdmFpbFdpZHRoIC0gYXZhaWxIZWlnaHQ7XHJcblx0XHRhdmFpbFdpZHRoIC09IGF2YWlsSGVpZ2h0O1xyXG5cdH1cclxuXHJcblx0dmFyIHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fc3BhY2luZ1gpIC0gMTtcclxuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcigoYXZhaWxIZWlnaHQgLSAyKnRoaXMuX2hleFNpemUpIC8gdGhpcy5fc3BhY2luZ1kgKyAxKTtcclxuXHRyZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRyYW5zcG9zZSkge1xyXG5cdFx0YXZhaWxXaWR0aCArPSBhdmFpbEhlaWdodDtcclxuXHRcdGF2YWlsSGVpZ2h0ID0gYXZhaWxXaWR0aCAtIGF2YWlsSGVpZ2h0O1xyXG5cdFx0YXZhaWxXaWR0aCAtPSBhdmFpbEhlaWdodDtcclxuXHR9XHJcblxyXG5cdHZhciBoZXhTaXplV2lkdGggPSAyKmF2YWlsV2lkdGggLyAoKHRoaXMuX29wdGlvbnMud2lkdGgrMSkgKiBNYXRoLnNxcnQoMykpIC0gMTtcclxuXHR2YXIgaGV4U2l6ZUhlaWdodCA9IGF2YWlsSGVpZ2h0IC8gKDIgKyAxLjUqKHRoaXMuX29wdGlvbnMuaGVpZ2h0LTEpKTtcclxuXHR2YXIgaGV4U2l6ZSA9IE1hdGgubWluKGhleFNpemVXaWR0aCwgaGV4U2l6ZUhlaWdodCk7XHJcblxyXG5cdC8qIGNvbXB1dGUgY2hhciByYXRpbyAqL1xyXG5cdHZhciBvbGRGb250ID0gdGhpcy5fY29udGV4dC5mb250O1xyXG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IFwiMTAwcHggXCIgKyB0aGlzLl9vcHRpb25zLmZvbnRGYW1pbHk7XHJcblx0dmFyIHdpZHRoID0gTWF0aC5jZWlsKHRoaXMuX2NvbnRleHQubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcclxuXHR0aGlzLl9jb250ZXh0LmZvbnQgPSBvbGRGb250O1xyXG5cdHZhciByYXRpbyA9IHdpZHRoIC8gMTAwO1xyXG5cclxuXHRoZXhTaXplID0gTWF0aC5mbG9vcihoZXhTaXplKSsxOyAvKiBjbG9zZXN0IGxhcmdlciBoZXhTaXplICovXHJcblxyXG5cdC8qIEZJWE1FIGNoYXIgc2l6ZSBjb21wdXRhdGlvbiBkb2VzIG5vdCByZXNwZWN0IHRyYW5zcG9zZWQgaGV4ZXMgKi9cclxuXHR2YXIgZm9udFNpemUgPSAyKmhleFNpemUgLyAodGhpcy5fb3B0aW9ucy5zcGFjaW5nICogKDEgKyByYXRpbyAvIE1hdGguc3FydCgzKSkpO1xyXG5cclxuXHQvKiBjbG9zZXN0IHNtYWxsZXIgZm9udFNpemUgKi9cclxuXHRyZXR1cm4gTWF0aC5jZWlsKGZvbnRTaXplKS0xO1xyXG59O1xyXG5cclxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHR4ICs9IHk7XHJcblx0XHR5ID0geC15O1xyXG5cdFx0eCAtPSB5O1xyXG5cdFx0dmFyIG5vZGVTaXplID0gdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGg7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBub2RlU2l6ZSA9IHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodDtcclxuXHR9XHJcblx0dmFyIHNpemUgPSBub2RlU2l6ZSAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0O1xyXG5cdHkgPSBNYXRoLmZsb29yKHkvc2l6ZSk7XHJcblxyXG5cdGlmICh5Lm1vZCgyKSkgeyAvKiBvZGQgcm93ICovXHJcblx0XHR4IC09IHRoaXMuX3NwYWNpbmdYO1xyXG5cdFx0eCA9IDEgKyAyKk1hdGguZmxvb3IoeC8oMip0aGlzLl9zcGFjaW5nWCkpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR4ID0gMipNYXRoLmZsb29yKHgvKDIqdGhpcy5fc3BhY2luZ1gpKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBbeCwgeV07XHJcbn07XHJcblxyXG4vKipcclxuICogQXJndW1lbnRzIGFyZSBwaXhlbCB2YWx1ZXMuIElmIFwidHJhbnNwb3NlZFwiIG1vZGUgaXMgZW5hYmxlZCwgdGhlbiB0aGVzZSB0d28gYXJlIGFscmVhZHkgc3dhcHBlZC5cclxuICovXHJcblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuX2ZpbGwgPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHR2YXIgYSA9IHRoaXMuX2hleFNpemU7XHJcblx0dmFyIGIgPSB0aGlzLl9vcHRpb25zLmJvcmRlcjtcclxuXHJcblx0dGhpcy5fY29udGV4dC5iZWdpblBhdGgoKTtcclxuXHJcblx0aWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XHJcblx0XHR0aGlzLl9jb250ZXh0Lm1vdmVUbyhjeC1hK2IsXHRjeSk7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC1hLzIrYixcdGN5K3RoaXMuX3NwYWNpbmdYLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3grYS8yLWIsXHRjeSt0aGlzLl9zcGFjaW5nWC1iKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K2EtYixcdGN5KTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K2EvMi1iLFx0Y3ktdGhpcy5fc3BhY2luZ1grYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC1hLzIrYixcdGN5LXRoaXMuX3NwYWNpbmdYK2IpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gtYStiLFx0Y3kpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aGlzLl9jb250ZXh0Lm1vdmVUbyhjeCxcdFx0XHRcdFx0Y3ktYStiKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4K3RoaXMuX3NwYWNpbmdYLWIsXHRjeS1hLzIrYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeCt0aGlzLl9zcGFjaW5nWC1iLFx0Y3krYS8yLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gsXHRcdFx0XHRcdGN5K2EtYik7XHJcblx0XHR0aGlzLl9jb250ZXh0LmxpbmVUbyhjeC10aGlzLl9zcGFjaW5nWCtiLFx0Y3krYS8yLWIpO1xyXG5cdFx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gtdGhpcy5fc3BhY2luZ1grYixcdGN5LWEvMitiKTtcclxuXHRcdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LFx0XHRcdFx0XHRjeS1hK2IpO1xyXG5cdH1cclxuXHR0aGlzLl9jb250ZXh0LmZpbGwoKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBUaWxlIGJhY2tlbmRcclxuICogQHByaXZhdGVcclxuICovXHJcblJPVC5EaXNwbGF5LlRpbGUgPSBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0Uk9ULkRpc3BsYXkuUmVjdC5jYWxsKHRoaXMsIGNvbnRleHQpO1xyXG5cdFxyXG5cdHRoaXMuX29wdGlvbnMgPSB7fTtcclxuXHR0aGlzLl9jb2xvckNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbn07XHJcblJPVC5EaXNwbGF5LlRpbGUuZXh0ZW5kKFJPVC5EaXNwbGF5LlJlY3QpO1xyXG5cclxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCA9IG9wdGlvbnMud2lkdGggKiBvcHRpb25zLnRpbGVXaWR0aDtcclxuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCAqIG9wdGlvbnMudGlsZUhlaWdodDtcclxuXHR0aGlzLl9jb2xvckNhbnZhcy53aWR0aCA9IG9wdGlvbnMudGlsZVdpZHRoO1xyXG5cdHRoaXMuX2NvbG9yQ2FudmFzLmhlaWdodCA9IG9wdGlvbnMudGlsZUhlaWdodDtcclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xyXG5cdHZhciB4ID0gZGF0YVswXTtcclxuXHR2YXIgeSA9IGRhdGFbMV07XHJcblx0dmFyIGNoID0gZGF0YVsyXTtcclxuXHR2YXIgZmcgPSBkYXRhWzNdO1xyXG5cdHZhciBiZyA9IGRhdGFbNF07XHJcblxyXG5cdHZhciB0aWxlV2lkdGggPSB0aGlzLl9vcHRpb25zLnRpbGVXaWR0aDtcclxuXHR2YXIgdGlsZUhlaWdodCA9IHRoaXMuX29wdGlvbnMudGlsZUhlaWdodDtcclxuXHJcblx0aWYgKGNsZWFyQmVmb3JlKSB7XHJcblx0XHRpZiAodGhpcy5fb3B0aW9ucy50aWxlQ29sb3JpemUpIHtcclxuXHRcdFx0dGhpcy5fY29udGV4dC5jbGVhclJlY3QoeCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gYmc7XHJcblx0XHRcdHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoeCp0aWxlV2lkdGgsIHkqdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmICghY2gpIHsgcmV0dXJuOyB9XHJcblxyXG5cdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XHJcblx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHRpbGUgPSB0aGlzLl9vcHRpb25zLnRpbGVNYXBbY2hhcnNbaV1dO1xyXG5cdFx0aWYgKCF0aWxlKSB7IHRocm93IG5ldyBFcnJvcihcIkNoYXIgJ1wiICsgY2hhcnNbaV0gKyBcIicgbm90IGZvdW5kIGluIHRpbGVNYXBcIik7IH1cclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuX29wdGlvbnMudGlsZUNvbG9yaXplKSB7IC8qIGFwcGx5IGNvbG9yaXphdGlvbiAqL1xyXG5cdFx0XHR2YXIgY2FudmFzID0gdGhpcy5fY29sb3JDYW52YXM7XHJcblx0XHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHRcdFx0Y29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcclxuXHJcblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKFxyXG5cdFx0XHRcdHRoaXMuX29wdGlvbnMudGlsZVNldCxcclxuXHRcdFx0XHR0aWxlWzBdLCB0aWxlWzFdLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsXHJcblx0XHRcdFx0MCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRpZiAoZmcgIT0gXCJ0cmFuc3BhcmVudFwiKSB7XHJcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBmZztcclxuXHRcdFx0XHRjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwic291cmNlLWF0b3BcIjtcclxuXHRcdFx0XHRjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChiZyAhPSBcInRyYW5zcGFyZW50XCIpIHtcclxuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xyXG5cdFx0XHRcdGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJkZXN0aW5hdGlvbi1vdmVyXCI7XHJcblx0XHRcdFx0Y29udGV4dC5maWxsUmVjdCgwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9jb250ZXh0LmRyYXdJbWFnZShjYW52YXMsIHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XHJcblxyXG5cdFx0fSBlbHNlIHsgLyogbm8gY29sb3JpemluZywgZWFzeSAqL1xyXG5cdFx0XHR0aGlzLl9jb250ZXh0LmRyYXdJbWFnZShcclxuXHRcdFx0XHR0aGlzLl9vcHRpb25zLnRpbGVTZXQsXHJcblx0XHRcdFx0dGlsZVswXSwgdGlsZVsxXSwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LFxyXG5cdFx0XHRcdHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodFxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcclxuXHR2YXIgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLnRpbGVXaWR0aCk7XHJcblx0dmFyIGhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9vcHRpb25zLnRpbGVIZWlnaHQpO1xyXG5cdHJldHVybiBbd2lkdGgsIGhlaWdodF07XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xyXG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX29wdGlvbnMud2lkdGgpO1xyXG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy5oZWlnaHQpO1xyXG5cdHJldHVybiBbd2lkdGgsIGhlaWdodF07XHJcbn07XHJcblxyXG5ST1QuRGlzcGxheS5UaWxlLnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0cmV0dXJuIFtNYXRoLmZsb29yKHgvdGhpcy5fb3B0aW9ucy50aWxlV2lkdGgpLCBNYXRoLmZsb29yKHkvdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0KV07XHJcbn07XHJcbi8qKlxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqIFRoaXMgY29kZSBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiBBbGVhIGFsZ29yaXRobTsgKEMpIDIwMTAgSm9oYW5uZXMgQmFhZ8O4ZS5cclxuICogQWxlYSBpcyBsaWNlbnNlZCBhY2NvcmRpbmcgdG8gdGhlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UuXHJcbiAqL1xyXG5ST1QuUk5HID0ge1xyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFxyXG5cdCAqL1xyXG5cdGdldFNlZWQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NlZWQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNlZWQgU2VlZCB0aGUgbnVtYmVyIGdlbmVyYXRvclxyXG5cdCAqL1xyXG5cdHNldFNlZWQ6IGZ1bmN0aW9uKHNlZWQpIHtcclxuXHRcdHNlZWQgPSAoc2VlZCA8IDEgPyAxL3NlZWQgOiBzZWVkKTtcclxuXHJcblx0XHR0aGlzLl9zZWVkID0gc2VlZDtcclxuXHRcdHRoaXMuX3MwID0gKHNlZWQgPj4+IDApICogdGhpcy5fZnJhYztcclxuXHJcblx0XHRzZWVkID0gKHNlZWQqNjkwNjkgKyAxKSA+Pj4gMDtcclxuXHRcdHRoaXMuX3MxID0gc2VlZCAqIHRoaXMuX2ZyYWM7XHJcblxyXG5cdFx0c2VlZCA9IChzZWVkKjY5MDY5ICsgMSkgPj4+IDA7XHJcblx0XHR0aGlzLl9zMiA9IHNlZWQgKiB0aGlzLl9mcmFjO1xyXG5cclxuXHRcdHRoaXMuX2MgPSAxO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQHJldHVybnMge2Zsb2F0fSBQc2V1ZG9yYW5kb20gdmFsdWUgWzAsMSksIHVuaWZvcm1seSBkaXN0cmlidXRlZFxyXG5cdCAqL1xyXG5cdGdldFVuaWZvcm06IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHQgPSAyMDkxNjM5ICogdGhpcy5fczAgKyB0aGlzLl9jICogdGhpcy5fZnJhYztcclxuXHRcdHRoaXMuX3MwID0gdGhpcy5fczE7XHJcblx0XHR0aGlzLl9zMSA9IHRoaXMuX3MyO1xyXG5cdFx0dGhpcy5fYyA9IHQgfCAwO1xyXG5cdFx0dGhpcy5fczIgPSB0IC0gdGhpcy5fYztcclxuXHRcdHJldHVybiB0aGlzLl9zMjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBAcGFyYW0ge2ludH0gbG93ZXJCb3VuZCBUaGUgbG93ZXIgZW5kIG9mIHRoZSByYW5nZSB0byByZXR1cm4gYSB2YWx1ZSBmcm9tLCBpbmNsdXNpdmVcclxuXHQgKiBAcGFyYW0ge2ludH0gdXBwZXJCb3VuZCBUaGUgdXBwZXIgZW5kIG9mIHRoZSByYW5nZSB0byByZXR1cm4gYSB2YWx1ZSBmcm9tLCBpbmNsdXNpdmVcclxuXHQgKiBAcmV0dXJucyB7aW50fSBQc2V1ZG9yYW5kb20gdmFsdWUgW2xvd2VyQm91bmQsIHVwcGVyQm91bmRdLCB1c2luZyBST1QuUk5HLmdldFVuaWZvcm0oKSB0byBkaXN0cmlidXRlIHRoZSB2YWx1ZVxyXG5cdCAqL1xyXG5cdGdldFVuaWZvcm1JbnQ6IGZ1bmN0aW9uKGxvd2VyQm91bmQsIHVwcGVyQm91bmQpIHtcclxuXHRcdHZhciBtYXggPSBNYXRoLm1heChsb3dlckJvdW5kLCB1cHBlckJvdW5kKTtcclxuXHRcdHZhciBtaW4gPSBNYXRoLm1pbihsb3dlckJvdW5kLCB1cHBlckJvdW5kKTtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2V0VW5pZm9ybSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbbWVhbj0wXSBNZWFuIHZhbHVlXHJcblx0ICogQHBhcmFtIHtmbG9hdH0gW3N0ZGRldj0xXSBTdGFuZGFyZCBkZXZpYXRpb24uIH45NSUgb2YgdGhlIGFic29sdXRlIHZhbHVlcyB3aWxsIGJlIGxvd2VyIHRoYW4gMipzdGRkZXYuXHJcblx0ICogQHJldHVybnMge2Zsb2F0fSBBIG5vcm1hbGx5IGRpc3RyaWJ1dGVkIHBzZXVkb3JhbmRvbSB2YWx1ZVxyXG5cdCAqL1xyXG5cdGdldE5vcm1hbDogZnVuY3Rpb24obWVhbiwgc3RkZGV2KSB7XHJcblx0XHRkbyB7XHJcblx0XHRcdHZhciB1ID0gMip0aGlzLmdldFVuaWZvcm0oKS0xO1xyXG5cdFx0XHR2YXIgdiA9IDIqdGhpcy5nZXRVbmlmb3JtKCktMTtcclxuXHRcdFx0dmFyIHIgPSB1KnUgKyB2KnY7XHJcblx0XHR9IHdoaWxlIChyID4gMSB8fCByID09IDApO1xyXG5cclxuXHRcdHZhciBnYXVzcyA9IHUgKiBNYXRoLnNxcnQoLTIqTWF0aC5sb2cocikvcik7XHJcblx0XHRyZXR1cm4gKG1lYW4gfHwgMCkgKyBnYXVzcyooc3RkZGV2IHx8IDEpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm5zIHtpbnR9IFBzZXVkb3JhbmRvbSB2YWx1ZSBbMSwxMDBdIGluY2x1c2l2ZSwgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkXHJcblx0ICovXHJcblx0Z2V0UGVyY2VudGFnZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gMSArIE1hdGguZmxvb3IodGhpcy5nZXRVbmlmb3JtKCkqMTAwKTtcclxuXHR9LFxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIGtleT13aGF0ZXZlciwgdmFsdWU9d2VpZ2h0IChyZWxhdGl2ZSBwcm9iYWJpbGl0eSlcclxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSB3aGF0ZXZlclxyXG5cdCAqL1xyXG5cdGdldFdlaWdodGVkVmFsdWU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdHZhciB0b3RhbCA9IDA7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGlkIGluIGRhdGEpIHtcclxuXHRcdFx0dG90YWwgKz0gZGF0YVtpZF07XHJcblx0XHR9XHJcblx0XHR2YXIgcmFuZG9tID0gdGhpcy5nZXRVbmlmb3JtKCkqdG90YWw7XHJcblx0XHRcclxuXHRcdHZhciBwYXJ0ID0gMDtcclxuXHRcdGZvciAodmFyIGlkIGluIGRhdGEpIHtcclxuXHRcdFx0cGFydCArPSBkYXRhW2lkXTtcclxuXHRcdFx0aWYgKHJhbmRvbSA8IHBhcnQpIHsgcmV0dXJuIGlkOyB9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWYgYnkgc29tZSBmbG9hdGluZy1wb2ludCBhbm5veWFuY2Ugd2UgaGF2ZVxyXG5cdFx0Ly8gcmFuZG9tID49IHRvdGFsLCBqdXN0IHJldHVybiB0aGUgbGFzdCBpZC5cclxuXHRcdHJldHVybiBpZDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBHZXQgUk5HIHN0YXRlLiBVc2VmdWwgZm9yIHN0b3JpbmcgdGhlIHN0YXRlIGFuZCByZS1zZXR0aW5nIGl0IHZpYSBzZXRTdGF0ZS5cclxuXHQgKiBAcmV0dXJucyB7P30gSW50ZXJuYWwgc3RhdGVcclxuXHQgKi9cclxuXHRnZXRTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gW3RoaXMuX3MwLCB0aGlzLl9zMSwgdGhpcy5fczIsIHRoaXMuX2NdO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIFNldCBhIHByZXZpb3VzbHkgcmV0cmlldmVkIHN0YXRlLlxyXG5cdCAqIEBwYXJhbSB7P30gc3RhdGVcclxuXHQgKi9cclxuXHRzZXRTdGF0ZTogZnVuY3Rpb24oc3RhdGUpIHtcclxuXHRcdHRoaXMuX3MwID0gc3RhdGVbMF07XHJcblx0XHR0aGlzLl9zMSA9IHN0YXRlWzFdO1xyXG5cdFx0dGhpcy5fczIgPSBzdGF0ZVsyXTtcclxuXHRcdHRoaXMuX2MgID0gc3RhdGVbM107XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIGEgY2xvbmVkIFJOR1xyXG5cdCAqL1xyXG5cdGNsb25lOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBjbG9uZSA9IE9iamVjdC5jcmVhdGUodGhpcyk7XHJcblx0XHRjbG9uZS5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlKCkpO1xyXG5cdFx0cmV0dXJuIGNsb25lO1xyXG5cdH0sXHJcblxyXG5cdF9zMDogMCxcclxuXHRfczE6IDAsXHJcblx0X3MyOiAwLFxyXG5cdF9jOiAwLFxyXG5cdF9mcmFjOiAyLjMyODMwNjQzNjUzODY5NjNlLTEwIC8qIDJeLTMyICovXHJcbn07XHJcblxyXG5ST1QuUk5HLnNldFNlZWQoRGF0ZS5ub3coKSk7XHJcbi8qKlxyXG4gKiBAY2xhc3MgKE1hcmtvdiBwcm9jZXNzKS1iYXNlZCBzdHJpbmcgZ2VuZXJhdG9yLiBcclxuICogQ29waWVkIGZyb20gYSA8YSBocmVmPVwiaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9TmFtZXNfZnJvbV9hX2hpZ2hfb3JkZXJfTWFya292X1Byb2Nlc3NfYW5kX2Ffc2ltcGxpZmllZF9LYXR6X2JhY2stb2ZmX3NjaGVtZVwiPlJvZ3VlQmFzaW4gYXJ0aWNsZTwvYT4uIFxyXG4gKiBPZmZlcnMgY29uZmlndXJhYmxlIG9yZGVyIGFuZCBwcmlvci5cclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2Jvb2x9IFtvcHRpb25zLndvcmRzPWZhbHNlXSBVc2Ugd29yZCBtb2RlP1xyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMub3JkZXI9M11cclxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMucHJpb3I9MC4wMDFdXHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHR3b3JkczogZmFsc2UsXHJcblx0XHRvcmRlcjogMyxcclxuXHRcdHByaW9yOiAwLjAwMVxyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblxyXG5cdHRoaXMuX2JvdW5kYXJ5ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgwKTtcclxuXHR0aGlzLl9zdWZmaXggPSB0aGlzLl9ib3VuZGFyeTtcclxuXHR0aGlzLl9wcmVmaXggPSBbXTtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9vcHRpb25zLm9yZGVyO2krKykgeyB0aGlzLl9wcmVmaXgucHVzaCh0aGlzLl9ib3VuZGFyeSk7IH1cclxuXHJcblx0dGhpcy5fcHJpb3JWYWx1ZXMgPSB7fTtcclxuXHR0aGlzLl9wcmlvclZhbHVlc1t0aGlzLl9ib3VuZGFyeV0gPSB0aGlzLl9vcHRpb25zLnByaW9yO1xyXG5cclxuXHR0aGlzLl9kYXRhID0ge307XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGFsbCBsZWFybmluZyBkYXRhXHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2RhdGEgPSB7fTtcclxuXHR0aGlzLl9wcmlvclZhbHVlcyA9IHt9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEdlbmVyYXRlZCBzdHJpbmdcclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHJlc3VsdCA9IFt0aGlzLl9zYW1wbGUodGhpcy5fcHJlZml4KV07XHJcblx0d2hpbGUgKHJlc3VsdFtyZXN1bHQubGVuZ3RoLTFdICE9IHRoaXMuX2JvdW5kYXJ5KSB7XHJcblx0XHRyZXN1bHQucHVzaCh0aGlzLl9zYW1wbGUocmVzdWx0KSk7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzLl9qb2luKHJlc3VsdC5zbGljZSgwLCAtMSkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE9ic2VydmUgKGxlYXJuKSBhIHN0cmluZyBmcm9tIGEgdHJhaW5pbmcgc2V0XHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24oc3RyaW5nKSB7XHJcblx0dmFyIHRva2VucyA9IHRoaXMuX3NwbGl0KHN0cmluZyk7XHJcblxyXG5cdGZvciAodmFyIGk9MDsgaTx0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHRoaXMuX3ByaW9yVmFsdWVzW3Rva2Vuc1tpXV0gPSB0aGlzLl9vcHRpb25zLnByaW9yO1xyXG5cdH1cclxuXHJcblx0dG9rZW5zID0gdGhpcy5fcHJlZml4LmNvbmNhdCh0b2tlbnMpLmNvbmNhdCh0aGlzLl9zdWZmaXgpOyAvKiBhZGQgYm91bmRhcnkgc3ltYm9scyAqL1xyXG5cclxuXHRmb3IgKHZhciBpPXRoaXMuX29wdGlvbnMub3JkZXI7IGk8dG9rZW5zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgY29udGV4dCA9IHRva2Vucy5zbGljZShpLXRoaXMuX29wdGlvbnMub3JkZXIsIGkpO1xyXG5cdFx0dmFyIGV2ZW50ID0gdG9rZW5zW2ldO1xyXG5cdFx0Zm9yICh2YXIgaj0wOyBqPGNvbnRleHQubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0dmFyIHN1YmNvbnRleHQgPSBjb250ZXh0LnNsaWNlKGopO1xyXG5cdFx0XHR0aGlzLl9vYnNlcnZlRXZlbnQoc3ViY29udGV4dCwgZXZlbnQpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLmdldFN0YXRzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHBhcnRzID0gW107XHJcblxyXG5cdHZhciBwcmlvckNvdW50ID0gMDtcclxuXHRmb3IgKHZhciBwIGluIHRoaXMuX3ByaW9yVmFsdWVzKSB7IHByaW9yQ291bnQrKzsgfVxyXG5cdHByaW9yQ291bnQtLTsgLyogYm91bmRhcnkgKi9cclxuXHRwYXJ0cy5wdXNoKFwiZGlzdGluY3Qgc2FtcGxlczogXCIgKyBwcmlvckNvdW50KTtcclxuXHJcblx0dmFyIGRhdGFDb3VudCA9IDA7XHJcblx0dmFyIGV2ZW50Q291bnQgPSAwO1xyXG5cdGZvciAodmFyIHAgaW4gdGhpcy5fZGF0YSkgeyBcclxuXHRcdGRhdGFDb3VudCsrOyBcclxuXHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl9kYXRhW3BdKSB7XHJcblx0XHRcdGV2ZW50Q291bnQrKztcclxuXHRcdH1cclxuXHR9XHJcblx0cGFydHMucHVzaChcImRpY3Rpb25hcnkgc2l6ZSAoY29udGV4dHMpOiBcIiArIGRhdGFDb3VudCk7XHJcblx0cGFydHMucHVzaChcImRpY3Rpb25hcnkgc2l6ZSAoZXZlbnRzKTogXCIgKyBldmVudENvdW50KTtcclxuXHJcblx0cmV0dXJuIHBhcnRzLmpvaW4oXCIsIFwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ31cclxuICogQHJldHVybnMge3N0cmluZ1tdfVxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuX3NwbGl0ID0gZnVuY3Rpb24oc3RyKSB7XHJcblx0cmV0dXJuIHN0ci5zcGxpdCh0aGlzLl9vcHRpb25zLndvcmRzID8gL1xccysvIDogXCJcIik7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmdbXX1cclxuICogQHJldHVybnMge3N0cmluZ30gXHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fam9pbiA9IGZ1bmN0aW9uKGFycikge1xyXG5cdHJldHVybiBhcnIuam9pbih0aGlzLl9vcHRpb25zLndvcmRzID8gXCIgXCIgOiBcIlwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBjb250ZXh0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gKi9cclxuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuX29ic2VydmVFdmVudCA9IGZ1bmN0aW9uKGNvbnRleHQsIGV2ZW50KSB7XHJcblx0dmFyIGtleSA9IHRoaXMuX2pvaW4oY29udGV4dCk7XHJcblx0aWYgKCEoa2V5IGluIHRoaXMuX2RhdGEpKSB7IHRoaXMuX2RhdGFba2V5XSA9IHt9OyB9XHJcblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XHJcblxyXG5cdGlmICghKGV2ZW50IGluIGRhdGEpKSB7IGRhdGFbZXZlbnRdID0gMDsgfVxyXG5cdGRhdGFbZXZlbnRdKys7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmdbXX1cclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9zYW1wbGUgPSBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0Y29udGV4dCA9IHRoaXMuX2JhY2tvZmYoY29udGV4dCk7XHJcblx0dmFyIGtleSA9IHRoaXMuX2pvaW4oY29udGV4dCk7XHJcblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XHJcblxyXG5cdHZhciBhdmFpbGFibGUgPSB7fTtcclxuXHJcblx0aWYgKHRoaXMuX29wdGlvbnMucHJpb3IpIHtcclxuXHRcdGZvciAodmFyIGV2ZW50IGluIHRoaXMuX3ByaW9yVmFsdWVzKSB7IGF2YWlsYWJsZVtldmVudF0gPSB0aGlzLl9wcmlvclZhbHVlc1tldmVudF07IH1cclxuXHRcdGZvciAodmFyIGV2ZW50IGluIGRhdGEpIHsgYXZhaWxhYmxlW2V2ZW50XSArPSBkYXRhW2V2ZW50XTsgfVxyXG5cdH0gZWxzZSB7IFxyXG5cdFx0YXZhaWxhYmxlID0gZGF0YTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBST1QuUk5HLmdldFdlaWdodGVkVmFsdWUoYXZhaWxhYmxlKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nW119XHJcbiAqL1xyXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fYmFja29mZiA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRpZiAoY29udGV4dC5sZW5ndGggPiB0aGlzLl9vcHRpb25zLm9yZGVyKSB7XHJcblx0XHRjb250ZXh0ID0gY29udGV4dC5zbGljZSgtdGhpcy5fb3B0aW9ucy5vcmRlcik7XHJcblx0fSBlbHNlIGlmIChjb250ZXh0Lmxlbmd0aCA8IHRoaXMuX29wdGlvbnMub3JkZXIpIHtcclxuXHRcdGNvbnRleHQgPSB0aGlzLl9wcmVmaXguc2xpY2UoMCwgdGhpcy5fb3B0aW9ucy5vcmRlciAtIGNvbnRleHQubGVuZ3RoKS5jb25jYXQoY29udGV4dCk7XHJcblx0fVxyXG5cclxuXHR3aGlsZSAoISh0aGlzLl9qb2luKGNvbnRleHQpIGluIHRoaXMuX2RhdGEpICYmIGNvbnRleHQubGVuZ3RoID4gMCkgeyBjb250ZXh0ID0gY29udGV4dC5zbGljZSgxKTsgfVxyXG5cclxuXHRyZXR1cm4gY29udGV4dDtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBHZW5lcmljIGV2ZW50IHF1ZXVlOiBzdG9yZXMgZXZlbnRzIGFuZCByZXRyaWV2ZXMgdGhlbSBiYXNlZCBvbiB0aGVpciB0aW1lXHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX3RpbWUgPSAwO1xyXG5cdHRoaXMuX2V2ZW50cyA9IFtdO1xyXG5cdHRoaXMuX2V2ZW50VGltZXMgPSBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBFbGFwc2VkIHRpbWVcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5nZXRUaW1lID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3RpbWU7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xlYXIgYWxsIHNjaGVkdWxlZCBldmVudHNcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX2V2ZW50cyA9IFtdO1xyXG5cdHRoaXMuX2V2ZW50VGltZXMgPSBbXTtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gez99IGV2ZW50XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lXHJcbiAqL1xyXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oZXZlbnQsIHRpbWUpIHtcclxuXHR2YXIgaW5kZXggPSB0aGlzLl9ldmVudHMubGVuZ3RoO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX2V2ZW50VGltZXMubGVuZ3RoO2krKykge1xyXG5cdFx0aWYgKHRoaXMuX2V2ZW50VGltZXNbaV0gPiB0aW1lKSB7XHJcblx0XHRcdGluZGV4ID0gaTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aGlzLl9ldmVudHMuc3BsaWNlKGluZGV4LCAwLCBldmVudCk7XHJcblx0dGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoaW5kZXgsIDAsIHRpbWUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIExvY2F0ZXMgdGhlIG5lYXJlc3QgZXZlbnQsIGFkdmFuY2VzIHRpbWUgaWYgbmVjZXNzYXJ5LiBSZXR1cm5zIHRoYXQgZXZlbnQgYW5kIHJlbW92ZXMgaXQgZnJvbSB0aGUgcXVldWUuXHJcbiAqIEByZXR1cm5zIHs/IHx8IG51bGx9IFRoZSBldmVudCBwcmV2aW91c2x5IGFkZGVkIGJ5IGFkZEV2ZW50LCBudWxsIGlmIG5vIGV2ZW50IGF2YWlsYWJsZVxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCkge1xyXG5cdGlmICghdGhpcy5fZXZlbnRzLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfVxyXG5cclxuXHR2YXIgdGltZSA9IHRoaXMuX2V2ZW50VGltZXMuc3BsaWNlKDAsIDEpWzBdO1xyXG5cdGlmICh0aW1lID4gMCkgeyAvKiBhZHZhbmNlICovXHJcblx0XHR0aGlzLl90aW1lICs9IHRpbWU7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl9ldmVudFRpbWVzLmxlbmd0aDtpKyspIHsgdGhpcy5fZXZlbnRUaW1lc1tpXSAtPSB0aW1lOyB9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcy5fZXZlbnRzLnNwbGljZSgwLCAxKVswXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHRpbWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBldmVudFxyXG4gKiBAcGFyYW0gez99IGV2ZW50XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHRpbWVcclxuICovXHJcblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5nZXRFdmVudFRpbWUgPSBmdW5jdGlvbihldmVudCkge1xyXG5cdHZhciBpbmRleCA9IHRoaXMuX2V2ZW50cy5pbmRleE9mKGV2ZW50KTtcclxuXHRpZiAoaW5kZXggPT0gLTEpIHsgcmV0dXJuIHVuZGVmaW5lZCB9XHJcblx0cmV0dXJuIHRoaXMuX2V2ZW50VGltZXNbaW5kZXhdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhbiBldmVudCBmcm9tIHRoZSBxdWV1ZVxyXG4gKiBAcGFyYW0gez99IGV2ZW50XHJcbiAqIEByZXR1cm5zIHtib29sfSBzdWNjZXNzP1xyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0dmFyIGluZGV4ID0gdGhpcy5fZXZlbnRzLmluZGV4T2YoZXZlbnQpO1xyXG5cdGlmIChpbmRleCA9PSAtMSkgeyByZXR1cm4gZmFsc2UgfVxyXG5cdHRoaXMuX3JlbW92ZShpbmRleCk7XHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGFuIGV2ZW50IGZyb20gdGhlIHF1ZXVlXHJcbiAqIEBwYXJhbSB7aW50fSBpbmRleFxyXG4gKi9cclxuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLl9yZW1vdmUgPSBmdW5jdGlvbihpbmRleCkge1xyXG5cdHRoaXMuX2V2ZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdHRoaXMuX2V2ZW50VGltZXMuc3BsaWNlKGluZGV4LCAxKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBBYnN0cmFjdCBzY2hlZHVsZXJcclxuICovXHJcblJPVC5TY2hlZHVsZXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9xdWV1ZSA9IG5ldyBST1QuRXZlbnRRdWV1ZSgpO1xyXG5cdHRoaXMuX3JlcGVhdCA9IFtdO1xyXG5cdHRoaXMuX2N1cnJlbnQgPSBudWxsO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULkV2ZW50UXVldWUjZ2V0VGltZVxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuZ2V0VGltZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9xdWV1ZS5nZXRUaW1lKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHs/fSBpdGVtXHJcbiAqIEBwYXJhbSB7Ym9vbH0gcmVwZWF0XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQpIHtcclxuXHRpZiAocmVwZWF0KSB7IHRoaXMuX3JlcGVhdC5wdXNoKGl0ZW0pOyB9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHRoZSB0aW1lIHRoZSBnaXZlbiBpdGVtIGlzIHNjaGVkdWxlZCBmb3JcclxuICogQHBhcmFtIHs/fSBpdGVtXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHRpbWVcclxuICovXHJcblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmdldFRpbWVPZiA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRyZXR1cm4gdGhpcy5fcXVldWUuZ2V0RXZlbnRUaW1lKGl0ZW0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsZWFyIGFsbCBpdGVtc1xyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9xdWV1ZS5jbGVhcigpO1xyXG5cdHRoaXMuX3JlcGVhdCA9IFtdO1xyXG5cdHRoaXMuX2N1cnJlbnQgPSBudWxsO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhIHByZXZpb3VzbHkgYWRkZWQgaXRlbVxyXG4gKiBAcGFyYW0gez99IGl0ZW1cclxuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3NmdWw/XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0dmFyIHJlc3VsdCA9IHRoaXMuX3F1ZXVlLnJlbW92ZShpdGVtKTtcclxuXHJcblx0dmFyIGluZGV4ID0gdGhpcy5fcmVwZWF0LmluZGV4T2YoaXRlbSk7XHJcblx0aWYgKGluZGV4ICE9IC0xKSB7IHRoaXMuX3JlcGVhdC5zcGxpY2UoaW5kZXgsIDEpOyB9XHJcblxyXG5cdGlmICh0aGlzLl9jdXJyZW50ID09IGl0ZW0pIHsgdGhpcy5fY3VycmVudCA9IG51bGw7IH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTY2hlZHVsZSBuZXh0IGl0ZW1cclxuICogQHJldHVybnMgez99XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fY3VycmVudCA9IHRoaXMuX3F1ZXVlLmdldCgpO1xyXG5cdHJldHVybiB0aGlzLl9jdXJyZW50O1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFNpbXBsZSBmYWlyIHNjaGVkdWxlciAocm91bmQtcm9iaW4gc3R5bGUpXHJcbiAqIEBhdWdtZW50cyBST1QuU2NoZWR1bGVyXHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLlNpbXBsZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFJPVC5TY2hlZHVsZXIuY2FsbCh0aGlzKTtcclxufTtcclxuUk9ULlNjaGVkdWxlci5TaW1wbGUuZXh0ZW5kKFJPVC5TY2hlZHVsZXIpO1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNhZGRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU2ltcGxlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQpIHtcclxuXHR0aGlzLl9xdWV1ZS5hZGQoaXRlbSwgMCk7XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGl0ZW0sIHJlcGVhdCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuU2NoZWR1bGVyI25leHRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU2ltcGxlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKHRoaXMuX2N1cnJlbnQgJiYgdGhpcy5fcmVwZWF0LmluZGV4T2YodGhpcy5fY3VycmVudCkgIT0gLTEpIHtcclxuXHRcdHRoaXMuX3F1ZXVlLmFkZCh0aGlzLl9jdXJyZW50LCAwKTtcclxuXHR9XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBTcGVlZC1iYXNlZCBzY2hlZHVsZXJcclxuICogQGF1Z21lbnRzIFJPVC5TY2hlZHVsZXJcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU3BlZWQgPSBmdW5jdGlvbigpIHtcclxuXHRST1QuU2NoZWR1bGVyLmNhbGwodGhpcyk7XHJcbn07XHJcblJPVC5TY2hlZHVsZXIuU3BlZWQuZXh0ZW5kKFJPVC5TY2hlZHVsZXIpO1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtIGFueXRoaW5nIHdpdGggXCJnZXRTcGVlZFwiIG1ldGhvZFxyXG4gKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3RpbWU9MS9pdGVtLmdldFNwZWVkKCldXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNhZGRcclxuICovXHJcblJPVC5TY2hlZHVsZXIuU3BlZWQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCwgdGltZSkge1xyXG5cdHRoaXMuX3F1ZXVlLmFkZChpdGVtLCB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogMS9pdGVtLmdldFNwZWVkKCkpO1xyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5hZGQuY2FsbCh0aGlzLCBpdGVtLCByZXBlYXQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNuZXh0XHJcbiAqL1xyXG5ST1QuU2NoZWR1bGVyLlNwZWVkLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKHRoaXMuX2N1cnJlbnQgJiYgdGhpcy5fcmVwZWF0LmluZGV4T2YodGhpcy5fY3VycmVudCkgIT0gLTEpIHtcclxuXHRcdHRoaXMuX3F1ZXVlLmFkZCh0aGlzLl9jdXJyZW50LCAxL3RoaXMuX2N1cnJlbnQuZ2V0U3BlZWQoKSk7XHJcblx0fVxyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQWN0aW9uLWJhc2VkIHNjaGVkdWxlclxyXG4gKiBAYXVnbWVudHMgUk9ULlNjaGVkdWxlclxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuXHRST1QuU2NoZWR1bGVyLmNhbGwodGhpcyk7XHJcblx0dGhpcy5fZGVmYXVsdER1cmF0aW9uID0gMTsgLyogZm9yIG5ld2x5IGFkZGVkICovXHJcblx0dGhpcy5fZHVyYXRpb24gPSB0aGlzLl9kZWZhdWx0RHVyYXRpb247IC8qIGZvciB0aGlzLl9jdXJyZW50ICovXHJcbn07XHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uLmV4dGVuZChST1QuU2NoZWR1bGVyKTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge29iamVjdH0gaXRlbVxyXG4gKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3RpbWU9MV1cclxuICogQHNlZSBST1QuU2NoZWR1bGVyI2FkZFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCwgdGltZSkge1xyXG5cdHRoaXMuX3F1ZXVlLmFkZChpdGVtLCB0aW1lIHx8IHRoaXMuX2RlZmF1bHREdXJhdGlvbik7XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGl0ZW0sIHJlcGVhdCk7XHJcbn07XHJcblxyXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjtcclxuXHRyZXR1cm4gUk9ULlNjaGVkdWxlci5wcm90b3R5cGUuY2xlYXIuY2FsbCh0aGlzKTtcclxufTtcclxuXHJcblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0aWYgKGl0ZW0gPT0gdGhpcy5fY3VycmVudCkgeyB0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjsgfVxyXG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5yZW1vdmUuY2FsbCh0aGlzLCBpdGVtKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjbmV4dFxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcclxuXHRpZiAodGhpcy5fY3VycmVudCAmJiB0aGlzLl9yZXBlYXQuaW5kZXhPZih0aGlzLl9jdXJyZW50KSAhPSAtMSkge1xyXG5cdFx0dGhpcy5fcXVldWUuYWRkKHRoaXMuX2N1cnJlbnQsIHRoaXMuX2R1cmF0aW9uIHx8IHRoaXMuX2RlZmF1bHREdXJhdGlvbik7XHJcblx0XHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjtcclxuXHR9XHJcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZHVyYXRpb24gZm9yIHRoZSBhY3RpdmUgaXRlbVxyXG4gKi9cclxuUk9ULlNjaGVkdWxlci5BY3Rpb24ucHJvdG90eXBlLnNldER1cmF0aW9uID0gZnVuY3Rpb24odGltZSkge1xyXG5cdGlmICh0aGlzLl9jdXJyZW50KSB7IHRoaXMuX2R1cmF0aW9uID0gdGltZTsgfVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIEFzeW5jaHJvbm91cyBtYWluIGxvb3BcclxuICogQHBhcmFtIHtST1QuU2NoZWR1bGVyfSBzY2hlZHVsZXJcclxuICovXHJcblJPVC5FbmdpbmUgPSBmdW5jdGlvbihzY2hlZHVsZXIpIHtcclxuXHR0aGlzLl9zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XHJcblx0dGhpcy5fbG9jayA9IDE7XHJcbn07XHJcblxyXG4vKipcclxuICogU3RhcnQgdGhlIG1haW4gbG9vcC4gV2hlbiB0aGlzIGNhbGwgcmV0dXJucywgdGhlIGxvb3AgaXMgbG9ja2VkLlxyXG4gKi9cclxuUk9ULkVuZ2luZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy51bmxvY2soKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbnRlcnJ1cHQgdGhlIGVuZ2luZSBieSBhbiBhc3luY2hyb25vdXMgYWN0aW9uXHJcbiAqL1xyXG5ST1QuRW5naW5lLnByb3RvdHlwZS5sb2NrID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5fbG9jaysrO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlc3VtZSBleGVjdXRpb24gKHBhdXNlZCBieSBhIHByZXZpb3VzIGxvY2spXHJcbiAqL1xyXG5ST1QuRW5naW5lLnByb3RvdHlwZS51bmxvY2sgPSBmdW5jdGlvbigpIHtcclxuXHRpZiAoIXRoaXMuX2xvY2spIHsgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHVubG9jayB1bmxvY2tlZCBlbmdpbmVcIik7IH1cclxuXHR0aGlzLl9sb2NrLS07XHJcblxyXG5cdHdoaWxlICghdGhpcy5fbG9jaykge1xyXG5cdFx0dmFyIGFjdG9yID0gdGhpcy5fc2NoZWR1bGVyLm5leHQoKTtcclxuXHRcdGlmICghYWN0b3IpIHsgcmV0dXJuIHRoaXMubG9jaygpOyB9IC8qIG5vIGFjdG9ycyAqL1xyXG5cdFx0dmFyIHJlc3VsdCA9IGFjdG9yLmFjdCgpO1xyXG5cdFx0aWYgKHJlc3VsdCAmJiByZXN1bHQudGhlbikgeyAvKiBhY3RvciByZXR1cm5lZCBhIFwidGhlbmFibGVcIiwgbG9va3MgbGlrZSBhIFByb21pc2UgKi9cclxuXHRcdFx0dGhpcy5sb2NrKCk7XHJcblx0XHRcdHJlc3VsdC50aGVuKHRoaXMudW5sb2NrLmJpbmQodGhpcykpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQmFzZSBtYXAgZ2VuZXJhdG9yXHJcbiAqIEBwYXJhbSB7aW50fSBbd2lkdGg9Uk9ULkRFRkFVTFRfV0lEVEhdXHJcbiAqIEBwYXJhbSB7aW50fSBbaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cclxuICovXHJcblJPVC5NYXAgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0dGhpcy5fd2lkdGggPSB3aWR0aCB8fCBST1QuREVGQVVMVF9XSURUSDtcclxuXHR0aGlzLl9oZWlnaHQgPSBoZWlnaHQgfHwgUk9ULkRFRkFVTFRfSEVJR0hUO1xyXG59O1xyXG5cclxuUk9ULk1hcC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHt9O1xyXG5cclxuUk9ULk1hcC5wcm90b3R5cGUuX2ZpbGxNYXAgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdHZhciBtYXAgPSBbXTtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdG1hcC5wdXNoKFtdKTtcclxuXHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHsgbWFwW2ldLnB1c2godmFsdWUpOyB9XHJcblx0fVxyXG5cdHJldHVybiBtYXA7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgU2ltcGxlIGVtcHR5IHJlY3Rhbmd1bGFyIHJvb21cclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuQXJlbmEgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG59O1xyXG5ST1QuTWFwLkFyZW5hLmV4dGVuZChST1QuTWFwKTtcclxuXHJcblJPVC5NYXAuQXJlbmEucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIHcgPSB0aGlzLl93aWR0aC0xO1xyXG5cdHZhciBoID0gdGhpcy5faGVpZ2h0LTE7XHJcblx0Zm9yICh2YXIgaT0wO2k8PXc7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajw9aDtqKyspIHtcclxuXHRcdFx0dmFyIGVtcHR5ID0gKGkgJiYgaiAmJiBpPHcgJiYgajxoKTtcclxuXHRcdFx0Y2FsbGJhY2soaSwgaiwgZW1wdHkgPyAwIDogMSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFJlY3Vyc2l2ZWx5IGRpdmlkZWQgbWF6ZSwgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NYXplX2dlbmVyYXRpb25fYWxnb3JpdGhtI1JlY3Vyc2l2ZV9kaXZpc2lvbl9tZXRob2RcclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuRGl2aWRlZE1hemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdHRoaXMuX3N0YWNrID0gW107XHJcbn07XHJcblJPVC5NYXAuRGl2aWRlZE1hemUuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHR2YXIgdyA9IHRoaXMuX3dpZHRoO1xyXG5cdHZhciBoID0gdGhpcy5faGVpZ2h0O1xyXG5cdFxyXG5cdHRoaXMuX21hcCA9IFtdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XHJcblx0XHR0aGlzLl9tYXAucHVzaChbXSk7XHJcblx0XHRmb3IgKHZhciBqPTA7ajxoO2orKykge1xyXG5cdFx0XHR2YXIgYm9yZGVyID0gKGkgPT0gMCB8fCBqID09IDAgfHwgaSsxID09IHcgfHwgaisxID09IGgpO1xyXG5cdFx0XHR0aGlzLl9tYXBbaV0ucHVzaChib3JkZXIgPyAxIDogMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX3N0YWNrID0gW1xyXG5cdFx0WzEsIDEsIHctMiwgaC0yXVxyXG5cdF07XHJcblx0dGhpcy5fcHJvY2VzcygpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajxoO2orKykge1xyXG5cdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR0aGlzLl9tYXAgPSBudWxsO1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5wcm90b3R5cGUuX3Byb2Nlc3MgPSBmdW5jdGlvbigpIHtcclxuXHR3aGlsZSAodGhpcy5fc3RhY2subGVuZ3RoKSB7XHJcblx0XHR2YXIgcm9vbSA9IHRoaXMuX3N0YWNrLnNoaWZ0KCk7IC8qIFtsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b21dICovXHJcblx0XHR0aGlzLl9wYXJ0aXRpb25Sb29tKHJvb20pO1xyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuRGl2aWRlZE1hemUucHJvdG90eXBlLl9wYXJ0aXRpb25Sb29tID0gZnVuY3Rpb24ocm9vbSkge1xyXG5cdHZhciBhdmFpbFggPSBbXTtcclxuXHR2YXIgYXZhaWxZID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT1yb29tWzBdKzE7aTxyb29tWzJdO2krKykge1xyXG5cdFx0dmFyIHRvcCA9IHRoaXMuX21hcFtpXVtyb29tWzFdLTFdO1xyXG5cdFx0dmFyIGJvdHRvbSA9IHRoaXMuX21hcFtpXVtyb29tWzNdKzFdO1xyXG5cdFx0aWYgKHRvcCAmJiBib3R0b20gJiYgIShpICUgMikpIHsgYXZhaWxYLnB1c2goaSk7IH1cclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaj1yb29tWzFdKzE7ajxyb29tWzNdO2orKykge1xyXG5cdFx0dmFyIGxlZnQgPSB0aGlzLl9tYXBbcm9vbVswXS0xXVtqXTtcclxuXHRcdHZhciByaWdodCA9IHRoaXMuX21hcFtyb29tWzJdKzFdW2pdO1xyXG5cdFx0aWYgKGxlZnQgJiYgcmlnaHQgJiYgIShqICUgMikpIHsgYXZhaWxZLnB1c2goaik7IH1cclxuXHR9XHJcblxyXG5cdGlmICghYXZhaWxYLmxlbmd0aCB8fCAhYXZhaWxZLmxlbmd0aCkgeyByZXR1cm47IH1cclxuXHJcblx0dmFyIHggPSBhdmFpbFgucmFuZG9tKCk7XHJcblx0dmFyIHkgPSBhdmFpbFkucmFuZG9tKCk7XHJcblx0XHJcblx0dGhpcy5fbWFwW3hdW3ldID0gMTtcclxuXHRcclxuXHR2YXIgd2FsbHMgPSBbXTtcclxuXHRcclxuXHR2YXIgdyA9IFtdOyB3YWxscy5wdXNoKHcpOyAvKiBsZWZ0IHBhcnQgKi9cclxuXHRmb3IgKHZhciBpPXJvb21bMF07IGk8eDsgaSsrKSB7IFxyXG5cdFx0dGhpcy5fbWFwW2ldW3ldID0gMTtcclxuXHRcdHcucHVzaChbaSwgeV0pOyBcclxuXHR9XHJcblx0XHJcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogcmlnaHQgcGFydCAqL1xyXG5cdGZvciAodmFyIGk9eCsxOyBpPD1yb29tWzJdOyBpKyspIHsgXHJcblx0XHR0aGlzLl9tYXBbaV1beV0gPSAxO1xyXG5cdFx0dy5wdXNoKFtpLCB5XSk7IFxyXG5cdH1cclxuXHJcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogdG9wIHBhcnQgKi9cclxuXHRmb3IgKHZhciBqPXJvb21bMV07IGo8eTsgaisrKSB7IFxyXG5cdFx0dGhpcy5fbWFwW3hdW2pdID0gMTtcclxuXHRcdHcucHVzaChbeCwgal0pOyBcclxuXHR9XHJcblx0XHJcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogYm90dG9tIHBhcnQgKi9cclxuXHRmb3IgKHZhciBqPXkrMTsgajw9cm9vbVszXTsgaisrKSB7IFxyXG5cdFx0dGhpcy5fbWFwW3hdW2pdID0gMTtcclxuXHRcdHcucHVzaChbeCwgal0pOyBcclxuXHR9XHJcblx0XHRcclxuXHR2YXIgc29saWQgPSB3YWxscy5yYW5kb20oKTtcclxuXHRmb3IgKHZhciBpPTA7aTx3YWxscy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgdyA9IHdhbGxzW2ldO1xyXG5cdFx0aWYgKHcgPT0gc29saWQpIHsgY29udGludWU7IH1cclxuXHRcdFxyXG5cdFx0dmFyIGhvbGUgPSB3LnJhbmRvbSgpO1xyXG5cdFx0dGhpcy5fbWFwW2hvbGVbMF1dW2hvbGVbMV1dID0gMDtcclxuXHR9XHJcblxyXG5cdHRoaXMuX3N0YWNrLnB1c2goW3Jvb21bMF0sIHJvb21bMV0sIHgtMSwgeS0xXSk7IC8qIGxlZnQgdG9wICovXHJcblx0dGhpcy5fc3RhY2sucHVzaChbeCsxLCByb29tWzFdLCByb29tWzJdLCB5LTFdKTsgLyogcmlnaHQgdG9wICovXHJcblx0dGhpcy5fc3RhY2sucHVzaChbcm9vbVswXSwgeSsxLCB4LTEsIHJvb21bM11dKTsgLyogbGVmdCBib3R0b20gKi9cclxuXHR0aGlzLl9zdGFjay5wdXNoKFt4KzEsIHkrMSwgcm9vbVsyXSwgcm9vbVszXV0pOyAvKiByaWdodCBib3R0b20gKi9cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBJY2V5J3MgTWF6ZSBnZW5lcmF0b3JcclxuICogU2VlIGh0dHA6Ly93d3cucm9ndWViYXNpbi5yb2d1ZWxpa2VkZXZlbG9wbWVudC5vcmcvaW5kZXgucGhwP3RpdGxlPVNpbXBsZV9tYXplIGZvciBleHBsYW5hdGlvblxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKi9cclxuUk9ULk1hcC5JY2V5TWF6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIHJlZ3VsYXJpdHkpIHtcclxuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblx0dGhpcy5fcmVndWxhcml0eSA9IHJlZ3VsYXJpdHkgfHwgMDtcclxufTtcclxuUk9ULk1hcC5JY2V5TWF6ZS5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG5ST1QuTWFwLkljZXlNYXplLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciB3aWR0aCA9IHRoaXMuX3dpZHRoO1xyXG5cdHZhciBoZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XHJcblx0XHJcblx0dmFyIG1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0XHJcblx0d2lkdGggLT0gKHdpZHRoICUgMiA/IDEgOiAyKTtcclxuXHRoZWlnaHQgLT0gKGhlaWdodCAlIDIgPyAxIDogMik7XHJcblxyXG5cdHZhciBjeCA9IDA7XHJcblx0dmFyIGN5ID0gMDtcclxuXHR2YXIgbnggPSAwO1xyXG5cdHZhciBueSA9IDA7XHJcblxyXG5cdHZhciBkb25lID0gMDtcclxuXHR2YXIgYmxvY2tlZCA9IGZhbHNlO1xyXG5cdHZhciBkaXJzID0gW1xyXG5cdFx0WzAsIDBdLFxyXG5cdFx0WzAsIDBdLFxyXG5cdFx0WzAsIDBdLFxyXG5cdFx0WzAsIDBdXHJcblx0XTtcclxuXHRkbyB7XHJcblx0XHRjeCA9IDEgKyAyKk1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqKHdpZHRoLTEpIC8gMik7XHJcblx0XHRjeSA9IDEgKyAyKk1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqKGhlaWdodC0xKSAvIDIpO1xyXG5cclxuXHRcdGlmICghZG9uZSkgeyBtYXBbY3hdW2N5XSA9IDA7IH1cclxuXHRcdFxyXG5cdFx0aWYgKCFtYXBbY3hdW2N5XSkge1xyXG5cdFx0XHR0aGlzLl9yYW5kb21pemUoZGlycyk7XHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHRpZiAoTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSoodGhpcy5fcmVndWxhcml0eSsxKSkgPT0gMCkgeyB0aGlzLl9yYW5kb21pemUoZGlycyk7IH1cclxuXHRcdFx0XHRibG9ja2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRmb3IgKHZhciBpPTA7aTw0O2krKykge1xyXG5cdFx0XHRcdFx0bnggPSBjeCArIGRpcnNbaV1bMF0qMjtcclxuXHRcdFx0XHRcdG55ID0gY3kgKyBkaXJzW2ldWzFdKjI7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5faXNGcmVlKG1hcCwgbngsIG55LCB3aWR0aCwgaGVpZ2h0KSkge1xyXG5cdFx0XHRcdFx0XHRtYXBbbnhdW255XSA9IDA7XHJcblx0XHRcdFx0XHRcdG1hcFtjeCArIGRpcnNbaV1bMF1dW2N5ICsgZGlyc1tpXVsxXV0gPSAwO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Y3ggPSBueDtcclxuXHRcdFx0XHRcdFx0Y3kgPSBueTtcclxuXHRcdFx0XHRcdFx0YmxvY2tlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRkb25lKys7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSB3aGlsZSAoIWJsb2NrZWQpO1xyXG5cdFx0fVxyXG5cdH0gd2hpbGUgKGRvbmUrMSA8IHdpZHRoKmhlaWdodC80KTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdFx0Y2FsbGJhY2soaSwgaiwgbWFwW2ldW2pdKTtcclxuXHRcdH1cclxuXHR9XHJcblx0dGhpcy5fbWFwID0gbnVsbDtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuSWNleU1hemUucHJvdG90eXBlLl9yYW5kb21pemUgPSBmdW5jdGlvbihkaXJzKSB7XHJcblx0Zm9yICh2YXIgaT0wO2k8NDtpKyspIHtcclxuXHRcdGRpcnNbaV1bMF0gPSAwO1xyXG5cdFx0ZGlyc1tpXVsxXSA9IDA7XHJcblx0fVxyXG5cdFxyXG5cdHN3aXRjaCAoTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSo0KSkge1xyXG5cdFx0Y2FzZSAwOlxyXG5cdFx0XHRkaXJzWzBdWzBdID0gLTE7IGRpcnNbMV1bMF0gPSAxO1xyXG5cdFx0XHRkaXJzWzJdWzFdID0gLTE7IGRpcnNbM11bMV0gPSAxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDE6XHJcblx0XHRcdGRpcnNbM11bMF0gPSAtMTsgZGlyc1syXVswXSA9IDE7XHJcblx0XHRcdGRpcnNbMV1bMV0gPSAtMTsgZGlyc1swXVsxXSA9IDE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMjpcclxuXHRcdFx0ZGlyc1syXVswXSA9IC0xOyBkaXJzWzNdWzBdID0gMTtcclxuXHRcdFx0ZGlyc1swXVsxXSA9IC0xOyBkaXJzWzFdWzFdID0gMTtcclxuXHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAzOlxyXG5cdFx0XHRkaXJzWzFdWzBdID0gLTE7IGRpcnNbMF1bMF0gPSAxO1xyXG5cdFx0XHRkaXJzWzNdWzFdID0gLTE7IGRpcnNbMl1bMV0gPSAxO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5JY2V5TWF6ZS5wcm90b3R5cGUuX2lzRnJlZSA9IGZ1bmN0aW9uKG1hcCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG5cdGlmICh4IDwgMSB8fCB5IDwgMSB8fCB4ID49IHdpZHRoIHx8IHkgPj0gaGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiBtYXBbeF1beV07XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgTWF6ZSBnZW5lcmF0b3IgLSBFbGxlcidzIGFsZ29yaXRobVxyXG4gKiBTZWUgaHR0cDovL2hvbWVwYWdlcy5jd2kubmwvfnRyb21wL21hemUuaHRtbCBmb3IgZXhwbGFuYXRpb25cclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICovXHJcblJPVC5NYXAuRWxsZXJNYXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxufTtcclxuUk9ULk1hcC5FbGxlck1hemUuZXh0ZW5kKFJPVC5NYXApO1xyXG5cclxuUk9ULk1hcC5FbGxlck1hemUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dmFyIG1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0dmFyIHcgPSBNYXRoLmNlaWwoKHRoaXMuX3dpZHRoLTIpLzIpO1xyXG5cdFxyXG5cdHZhciByYW5kID0gOS8yNDtcclxuXHRcclxuXHR2YXIgTCA9IFtdO1xyXG5cdHZhciBSID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcclxuXHRcdEwucHVzaChpKTtcclxuXHRcdFIucHVzaChpKTtcclxuXHR9XHJcblx0TC5wdXNoKHctMSk7IC8qIGZha2Ugc3RvcC1ibG9jayBhdCB0aGUgcmlnaHQgc2lkZSAqL1xyXG5cclxuXHRmb3IgKHZhciBqPTE7aiszPHRoaXMuX2hlaWdodDtqKz0yKSB7XHJcblx0XHQvKiBvbmUgcm93ICovXHJcblx0XHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xyXG5cdFx0XHQvKiBjZWxsIGNvb3JkcyAod2lsbCBiZSBhbHdheXMgZW1wdHkpICovXHJcblx0XHRcdHZhciB4ID0gMippKzE7XHJcblx0XHRcdHZhciB5ID0gajtcclxuXHRcdFx0bWFwW3hdW3ldID0gMDtcclxuXHRcdFx0XHJcblx0XHRcdC8qIHJpZ2h0IGNvbm5lY3Rpb24gKi9cclxuXHRcdFx0aWYgKGkgIT0gTFtpKzFdICYmIFJPVC5STkcuZ2V0VW5pZm9ybSgpID4gcmFuZCkge1xyXG5cdFx0XHRcdHRoaXMuX2FkZFRvTGlzdChpLCBMLCBSKTtcclxuXHRcdFx0XHRtYXBbeCsxXVt5XSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdC8qIGJvdHRvbSBjb25uZWN0aW9uICovXHJcblx0XHRcdGlmIChpICE9IExbaV0gJiYgUk9ULlJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSB7XHJcblx0XHRcdFx0LyogcmVtb3ZlIGNvbm5lY3Rpb24gKi9cclxuXHRcdFx0XHR0aGlzLl9yZW1vdmVGcm9tTGlzdChpLCBMLCBSKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvKiBjcmVhdGUgY29ubmVjdGlvbiAqL1xyXG5cdFx0XHRcdG1hcFt4XVt5KzFdID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyogbGFzdCByb3cgKi9cclxuXHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xyXG5cdFx0LyogY2VsbCBjb29yZHMgKHdpbGwgYmUgYWx3YXlzIGVtcHR5KSAqL1xyXG5cdFx0dmFyIHggPSAyKmkrMTtcclxuXHRcdHZhciB5ID0gajtcclxuXHRcdG1hcFt4XVt5XSA9IDA7XHJcblx0XHRcclxuXHRcdC8qIHJpZ2h0IGNvbm5lY3Rpb24gKi9cclxuXHRcdGlmIChpICE9IExbaSsxXSAmJiAoaSA9PSBMW2ldIHx8IFJPVC5STkcuZ2V0VW5pZm9ybSgpID4gcmFuZCkpIHtcclxuXHRcdFx0LyogZGlnIHJpZ2h0IGFsc28gaWYgdGhlIGNlbGwgaXMgc2VwYXJhdGVkLCBzbyBpdCBnZXRzIGNvbm5lY3RlZCB0byB0aGUgcmVzdCBvZiBtYXplICovXHJcblx0XHRcdHRoaXMuX2FkZFRvTGlzdChpLCBMLCBSKTtcclxuXHRcdFx0bWFwW3grMV1beV0gPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLl9yZW1vdmVGcm9tTGlzdChpLCBMLCBSKTtcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHRcdGNhbGxiYWNrKGksIGosIG1hcFtpXVtqXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBcImlcIiBmcm9tIGl0cyBsaXN0XHJcbiAqL1xyXG5ST1QuTWFwLkVsbGVyTWF6ZS5wcm90b3R5cGUuX3JlbW92ZUZyb21MaXN0ID0gZnVuY3Rpb24oaSwgTCwgUikge1xyXG5cdFJbTFtpXV0gPSBSW2ldO1xyXG5cdExbUltpXV0gPSBMW2ldO1xyXG5cdFJbaV0gPSBpO1xyXG5cdExbaV0gPSBpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEpvaW4gbGlzdHMgd2l0aCBcImlcIiBhbmQgXCJpKzFcIlxyXG4gKi9cclxuUk9ULk1hcC5FbGxlck1hemUucHJvdG90eXBlLl9hZGRUb0xpc3QgPSBmdW5jdGlvbihpLCBMLCBSKSB7XHJcblx0UltMW2krMV1dID0gUltpXTtcclxuXHRMW1JbaV1dID0gTFtpKzFdO1xyXG5cdFJbaV0gPSBpKzE7XHJcblx0TFtpKzFdID0gaTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBDZWxsdWxhciBhdXRvbWF0b24gbWFwIGdlbmVyYXRvclxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxyXG4gKiBAcGFyYW0ge2ludH0gW3dpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxyXG4gKiBAcGFyYW0ge2ludH0gW2hlaWdodD1ST1QuREVGQVVMVF9IRUlHSFRdXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gT3B0aW9uc1xyXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5ib3JuXSBMaXN0IG9mIG5laWdoYm9yIGNvdW50cyBmb3IgYSBuZXcgY2VsbCB0byBiZSBib3JuIGluIGVtcHR5IHNwYWNlXHJcbiAqIEBwYXJhbSB7aW50W119IFtvcHRpb25zLnN1cnZpdmVdIExpc3Qgb2YgbmVpZ2hib3IgY291bnRzIGZvciBhbiBleGlzdGluZyAgY2VsbCB0byBzdXJ2aXZlXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50b3BvbG9neV0gVG9wb2xvZ3kgNCBvciA2IG9yIDhcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRib3JuOiBbNSwgNiwgNywgOF0sXHJcblx0XHRzdXJ2aXZlOiBbNCwgNSwgNiwgNywgOF0sXHJcblx0XHR0b3BvbG9neTogOFxyXG5cdH07XHJcblx0dGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuXHR0aGlzLl9kaXJzID0gUk9ULkRJUlNbdGhpcy5fb3B0aW9ucy50b3BvbG9neV07XHJcblx0dGhpcy5fbWFwID0gdGhpcy5fZmlsbE1hcCgwKTtcclxufTtcclxuUk9ULk1hcC5DZWxsdWxhci5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG4vKipcclxuICogRmlsbCB0aGUgbWFwIHdpdGggcmFuZG9tIHZhbHVlc1xyXG4gKiBAcGFyYW0ge2Zsb2F0fSBwcm9iYWJpbGl0eSBQcm9iYWJpbGl0eSBmb3IgYSBjZWxsIHRvIGJlY29tZSBhbGl2ZTsgMCA9IGFsbCBlbXB0eSwgMSA9IGFsbCBmdWxsXHJcbiAqL1xyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5yYW5kb21pemUgPSBmdW5jdGlvbihwcm9iYWJpbGl0eSkge1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xyXG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0XHR0aGlzLl9tYXBbaV1bal0gPSAoUk9ULlJORy5nZXRVbmlmb3JtKCkgPCBwcm9iYWJpbGl0eSA/IDEgOiAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hhbmdlIG9wdGlvbnMuXHJcbiAqIEBzZWUgUk9ULk1hcC5DZWxsdWxhclxyXG4gKi9cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHksIHZhbHVlKSB7XHJcblx0dGhpcy5fbWFwW3hdW3ldID0gdmFsdWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciBuZXdNYXAgPSB0aGlzLl9maWxsTWFwKDApO1xyXG5cdHZhciBib3JuID0gdGhpcy5fb3B0aW9ucy5ib3JuO1xyXG5cdHZhciBzdXJ2aXZlID0gdGhpcy5fb3B0aW9ucy5zdXJ2aXZlO1xyXG5cclxuXHJcblx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0dmFyIHdpZHRoU3RlcCA9IDE7XHJcblx0XHR2YXIgd2lkdGhTdGFydCA9IDA7XHJcblx0XHRpZiAodGhpcy5fb3B0aW9ucy50b3BvbG9neSA9PSA2KSB7XHJcblx0XHRcdHdpZHRoU3RlcCA9IDI7XHJcblx0XHRcdHdpZHRoU3RhcnQgPSBqJTI7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgaT13aWR0aFN0YXJ0OyBpPHRoaXMuX3dpZHRoOyBpKz13aWR0aFN0ZXApIHtcclxuXHJcblx0XHRcdHZhciBjdXIgPSB0aGlzLl9tYXBbaV1bal07XHJcblx0XHRcdHZhciBuY291bnQgPSB0aGlzLl9nZXROZWlnaGJvcnMoaSwgaik7XHJcblxyXG5cdFx0XHRpZiAoY3VyICYmIHN1cnZpdmUuaW5kZXhPZihuY291bnQpICE9IC0xKSB7IC8qIHN1cnZpdmUgKi9cclxuXHRcdFx0XHRuZXdNYXBbaV1bal0gPSAxO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCFjdXIgJiYgYm9ybi5pbmRleE9mKG5jb3VudCkgIT0gLTEpIHsgLyogYm9ybiAqL1xyXG5cdFx0XHRcdG5ld01hcFtpXVtqXSA9IDE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuX21hcCA9IG5ld01hcDtcclxuXHJcblx0dGhpcy5zZXJ2aWNlQ2FsbGJhY2soY2FsbGJhY2spO1xyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuc2VydmljZUNhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRpZiAoIWNhbGxiYWNrKSB7IHJldHVybjsgfVxyXG5cclxuXHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XHJcblx0XHR2YXIgd2lkdGhTdGVwID0gMTtcclxuXHRcdHZhciB3aWR0aFN0YXJ0ID0gMDtcclxuXHRcdGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDYpIHtcclxuXHRcdFx0d2lkdGhTdGVwID0gMjtcclxuXHRcdFx0d2lkdGhTdGFydCA9IGolMjtcclxuXHRcdH1cclxuXHRcdGZvciAodmFyIGk9d2lkdGhTdGFydDsgaTx0aGlzLl93aWR0aDsgaSs9d2lkdGhTdGVwKSB7XHJcblx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBuZWlnaGJvciBjb3VudCBhdCBbaSxqXSBpbiB0aGlzLl9tYXBcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9nZXROZWlnaGJvcnMgPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHR2YXIgcmVzdWx0ID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9kaXJzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBkaXIgPSB0aGlzLl9kaXJzW2ldO1xyXG5cdFx0dmFyIHggPSBjeCArIGRpclswXTtcclxuXHRcdHZhciB5ID0gY3kgKyBkaXJbMV07XHJcblxyXG5cdFx0aWYgKHggPCAwIHx8IHggPj0gdGhpcy5fd2lkdGggfHwgeSA8IDAgfHwgeSA+PSB0aGlzLl93aWR0aCkgeyBjb250aW51ZTsgfVxyXG5cdFx0cmVzdWx0ICs9ICh0aGlzLl9tYXBbeF1beV0gPT0gMSA/IDEgOiAwKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG4vKipcclxuICogTWFrZSBzdXJlIGV2ZXJ5IG5vbi13YWxsIHNwYWNlIGlzIGFjY2Vzc2libGUuXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgdG8gZGlzcGxheSBtYXAgd2hlbiBkb1xyXG4gKiBAcGFyYW0ge2ludH0gdmFsdWUgdG8gY29uc2lkZXIgZW1wdHkgc3BhY2UgLSBkZWZhdWx0cyB0byAwXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgd2hlbiBhIG5ldyBjb25uZWN0aW9uIGlzIG1hZGVcclxuICovXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbihjYWxsYmFjaywgdmFsdWUsIGNvbm5lY3Rpb25DYWxsYmFjaykge1xyXG5cdGlmICghdmFsdWUpIHZhbHVlID0gMDtcclxuXHJcblx0dmFyIGFsbEZyZWVTcGFjZSA9IFtdO1xyXG5cdHZhciBub3RDb25uZWN0ZWQgPSB7fTtcclxuXHQvLyBmaW5kIGFsbCBmcmVlIHNwYWNlXHJcblx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLl93aWR0aDsgeCsrKSB7XHJcblx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuX2hlaWdodDsgeSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLl9mcmVlU3BhY2UoeCwgeSwgdmFsdWUpKSB7XHJcblx0XHRcdFx0dmFyIHAgPSBbeCwgeV07XHJcblx0XHRcdFx0bm90Q29ubmVjdGVkW3RoaXMuX3BvaW50S2V5KHApXSA9IHA7XHJcblx0XHRcdFx0YWxsRnJlZVNwYWNlLnB1c2goW3gsIHldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHR2YXIgc3RhcnQgPSBhbGxGcmVlU3BhY2VbUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGFsbEZyZWVTcGFjZS5sZW5ndGggLSAxKV07XHJcblxyXG5cdHZhciBrZXkgPSB0aGlzLl9wb2ludEtleShzdGFydCk7XHJcblx0dmFyIGNvbm5lY3RlZCA9IHt9O1xyXG5cdGNvbm5lY3RlZFtrZXldID0gc3RhcnQ7XHJcblx0ZGVsZXRlIG5vdENvbm5lY3RlZFtrZXldO1xyXG5cclxuXHQvLyBmaW5kIHdoYXQncyBjb25uZWN0ZWQgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XHJcblx0dGhpcy5fZmluZENvbm5lY3RlZChjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCwgW3N0YXJ0XSwgZmFsc2UsIHZhbHVlKTtcclxuXHJcblx0d2hpbGUgKE9iamVjdC5rZXlzKG5vdENvbm5lY3RlZCkubGVuZ3RoID4gMCkge1xyXG5cclxuXHRcdC8vIGZpbmQgdHdvIHBvaW50cyBmcm9tIG5vdENvbm5lY3RlZCB0byBjb25uZWN0ZWRcclxuXHRcdHZhciBwID0gdGhpcy5fZ2V0RnJvbVRvKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkKTtcclxuXHRcdHZhciBmcm9tID0gcFswXTsgLy8gbm90Q29ubmVjdGVkXHJcblx0XHR2YXIgdG8gPSBwWzFdOyAvLyBjb25uZWN0ZWRcclxuXHJcblx0XHQvLyBmaW5kIGV2ZXJ5dGhpbmcgY29ubmVjdGVkIHRvIHRoZSBzdGFydGluZyBwb2ludFxyXG5cdFx0dmFyIGxvY2FsID0ge307XHJcblx0XHRsb2NhbFt0aGlzLl9wb2ludEtleShmcm9tKV0gPSBmcm9tO1xyXG5cdFx0dGhpcy5fZmluZENvbm5lY3RlZChsb2NhbCwgbm90Q29ubmVjdGVkLCBbZnJvbV0sIHRydWUsIHZhbHVlKTtcclxuXHJcblx0XHQvLyBjb25uZWN0IHRvIGEgY29ubmVjdGVkIHNxdWFyZVxyXG5cdFx0dGhpcy5fdHVubmVsVG9Db25uZWN0ZWQodG8sIGZyb20sIGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCB2YWx1ZSwgY29ubmVjdGlvbkNhbGxiYWNrKTtcclxuXHJcblx0XHQvLyBub3cgYWxsIG9mIGxvY2FsIGlzIGNvbm5lY3RlZFxyXG5cdFx0Zm9yICh2YXIgayBpbiBsb2NhbCkge1xyXG5cdFx0XHR2YXIgcHAgPSBsb2NhbFtrXTtcclxuXHRcdFx0dGhpcy5fbWFwW3BwWzBdXVtwcFsxXV0gPSB2YWx1ZTtcclxuXHRcdFx0Y29ubmVjdGVkW2tdID0gcHA7XHJcblx0XHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRba107XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aGlzLnNlcnZpY2VDYWxsYmFjayhjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogRmluZCByYW5kb20gcG9pbnRzIHRvIGNvbm5lY3QuIFNlYXJjaCBmb3IgdGhlIGNsb3Nlc3QgcG9pbnQgaW4gdGhlIGxhcmdlciBzcGFjZS5cclxuICogVGhpcyBpcyB0byBtaW5pbWl6ZSB0aGUgbGVuZ3RoIG9mIHRoZSBwYXNzYWdlIHdoaWxlIG1haW50YWluaW5nIGdvb2QgcGVyZm9ybWFuY2UuXHJcbiAqL1xyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZ2V0RnJvbVRvID0gZnVuY3Rpb24oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQpIHtcclxuXHR2YXIgZnJvbSwgdG8sIGQ7XHJcblx0dmFyIGNvbm5lY3RlZEtleXMgPSBPYmplY3Qua2V5cyhjb25uZWN0ZWQpO1xyXG5cdHZhciBub3RDb25uZWN0ZWRLZXlzID0gT2JqZWN0LmtleXMobm90Q29ubmVjdGVkKTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xyXG5cdFx0aWYgKGNvbm5lY3RlZEtleXMubGVuZ3RoIDwgbm90Q29ubmVjdGVkS2V5cy5sZW5ndGgpIHtcclxuXHRcdFx0dmFyIGtleXMgPSBjb25uZWN0ZWRLZXlzO1xyXG5cdFx0XHR0byA9IGNvbm5lY3RlZFtrZXlzW1JPVC5STkcuZ2V0VW5pZm9ybUludCgwLCBrZXlzLmxlbmd0aCAtIDEpXV07XHJcblx0XHRcdGZyb20gPSB0aGlzLl9nZXRDbG9zZXN0KHRvLCBub3RDb25uZWN0ZWQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGtleXMgPSBub3RDb25uZWN0ZWRLZXlzO1xyXG5cdFx0XHRmcm9tID0gbm90Q29ubmVjdGVkW2tleXNbUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGtleXMubGVuZ3RoIC0gMSldXTtcclxuXHRcdFx0dG8gPSB0aGlzLl9nZXRDbG9zZXN0KGZyb20sIGNvbm5lY3RlZCk7XHJcblx0XHR9XHJcblx0XHRkID0gKGZyb21bMF0gLSB0b1swXSkgKiAoZnJvbVswXSAtIHRvWzBdKSArIChmcm9tWzFdIC0gdG9bMV0pICogKGZyb21bMV0gLSB0b1sxXSk7XHJcblx0XHRpZiAoZCA8IDY0KSB7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvLyBjb25zb2xlLmxvZyhcIj4+PiBjb25uZWN0ZWQ9XCIgKyB0byArIFwiIG5vdENvbm5lY3RlZD1cIiArIGZyb20gKyBcIiBkaXN0PVwiICsgZCk7XHJcblx0cmV0dXJuIFtmcm9tLCB0b107XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZ2V0Q2xvc2VzdCA9IGZ1bmN0aW9uKHBvaW50LCBzcGFjZSkge1xyXG5cdHZhciBtaW5Qb2ludCA9IG51bGw7XHJcblx0dmFyIG1pbkRpc3QgPSBudWxsO1xyXG5cdGZvciAoayBpbiBzcGFjZSkge1xyXG5cdFx0dmFyIHAgPSBzcGFjZVtrXTtcclxuXHRcdHZhciBkID0gKHBbMF0gLSBwb2ludFswXSkgKiAocFswXSAtIHBvaW50WzBdKSArIChwWzFdIC0gcG9pbnRbMV0pICogKHBbMV0gLSBwb2ludFsxXSk7XHJcblx0XHRpZiAobWluRGlzdCA9PSBudWxsIHx8IGQgPCBtaW5EaXN0KSB7XHJcblx0XHRcdG1pbkRpc3QgPSBkO1xyXG5cdFx0XHRtaW5Qb2ludCA9IHA7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBtaW5Qb2ludDtcclxufTtcclxuXHJcblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9maW5kQ29ubmVjdGVkID0gZnVuY3Rpb24oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHN0YWNrLCBrZWVwTm90Q29ubmVjdGVkLCB2YWx1ZSkge1xyXG5cdHdoaWxlKHN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHRcdHZhciBwID0gc3RhY2suc3BsaWNlKDAsIDEpWzBdO1xyXG5cdFx0dmFyIHRlc3RzID0gW1xyXG5cdFx0XHRbcFswXSArIDEsIHBbMV1dLFxyXG5cdFx0XHRbcFswXSAtIDEsIHBbMV1dLFxyXG5cdFx0XHRbcFswXSwgICAgIHBbMV0gKyAxXSxcclxuXHRcdFx0W3BbMF0sICAgICBwWzFdIC0gMV1cclxuXHRcdF07XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRlc3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBrZXkgPSB0aGlzLl9wb2ludEtleSh0ZXN0c1tpXSk7XHJcblx0XHRcdGlmIChjb25uZWN0ZWRba2V5XSA9PSBudWxsICYmIHRoaXMuX2ZyZWVTcGFjZSh0ZXN0c1tpXVswXSwgdGVzdHNbaV1bMV0sIHZhbHVlKSkge1xyXG5cdFx0XHRcdGNvbm5lY3RlZFtrZXldID0gdGVzdHNbaV07XHJcblx0XHRcdFx0aWYgKCFrZWVwTm90Q29ubmVjdGVkKSB7XHJcblx0XHRcdFx0XHRkZWxldGUgbm90Q29ubmVjdGVkW2tleV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHN0YWNrLnB1c2godGVzdHNbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX3R1bm5lbFRvQ29ubmVjdGVkID0gZnVuY3Rpb24odG8sIGZyb20sIGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCB2YWx1ZSwgY29ubmVjdGlvbkNhbGxiYWNrKSB7XHJcblx0dmFyIGtleSA9IHRoaXMuX3BvaW50S2V5KGZyb20pO1xyXG5cdHZhciBhLCBiO1xyXG5cdGlmIChmcm9tWzBdIDwgdG9bMF0pIHtcclxuXHRcdGEgPSBmcm9tO1xyXG5cdFx0YiA9IHRvO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRhID0gdG87XHJcblx0XHRiID0gZnJvbTtcclxuXHR9XHJcblx0Zm9yICh2YXIgeHggPSBhWzBdOyB4eCA8PSBiWzBdOyB4eCsrKSB7XHJcblx0XHR0aGlzLl9tYXBbeHhdW2FbMV1dID0gdmFsdWU7XHJcblx0XHR2YXIgcCA9IFt4eCwgYVsxXV07XHJcblx0XHR2YXIgcGtleSA9IHRoaXMuX3BvaW50S2V5KHApO1xyXG5cdFx0Y29ubmVjdGVkW3BrZXldID0gcDtcclxuXHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRbcGtleV07XHJcblx0fVxyXG5cdGlmIChjb25uZWN0aW9uQ2FsbGJhY2sgJiYgYVswXSA8IGJbMF0pIHtcclxuXHRcdGNvbm5lY3Rpb25DYWxsYmFjayhhLCBbYlswXSwgYVsxXV0pO1xyXG5cdH1cclxuXHJcblx0Ly8geCBpcyBub3cgZml4ZWRcclxuXHR2YXIgeCA9IGJbMF07XHJcblxyXG5cdGlmIChmcm9tWzFdIDwgdG9bMV0pIHtcclxuXHRcdGEgPSBmcm9tO1xyXG5cdFx0YiA9IHRvO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRhID0gdG87XHJcblx0XHRiID0gZnJvbTtcclxuXHR9XHJcblx0Zm9yICh2YXIgeXkgPSBhWzFdOyB5eSA8IGJbMV07IHl5KyspIHtcclxuXHRcdHRoaXMuX21hcFt4XVt5eV0gPSB2YWx1ZTtcclxuXHRcdHZhciBwID0gW3gsIHl5XTtcclxuXHRcdHZhciBwa2V5ID0gdGhpcy5fcG9pbnRLZXkocCk7XHJcblx0XHRjb25uZWN0ZWRbcGtleV0gPSBwO1xyXG5cdFx0ZGVsZXRlIG5vdENvbm5lY3RlZFtwa2V5XTtcclxuXHR9XHJcblx0aWYgKGNvbm5lY3Rpb25DYWxsYmFjayAmJiBhWzFdIDwgYlsxXSkge1xyXG5cdFx0Y29ubmVjdGlvbkNhbGxiYWNrKFtiWzBdLCBhWzFdXSwgW2JbMF0sIGJbMV1dKTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZnJlZVNwYWNlID0gZnVuY3Rpb24oeCwgeSwgdmFsdWUpIHtcclxuXHRyZXR1cm4geCA+PSAwICYmIHggPCB0aGlzLl93aWR0aCAmJiB5ID49IDAgJiYgeSA8IHRoaXMuX2hlaWdodCAmJiB0aGlzLl9tYXBbeF1beV0gPT0gdmFsdWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fcG9pbnRLZXkgPSBmdW5jdGlvbihwKSB7XHJcblx0cmV0dXJuIHBbMF0gKyBcIi5cIiArIHBbMV07XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgRHVuZ2VvbiBtYXA6IGhhcyByb29tcyBhbmQgY29ycmlkb3JzXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwXHJcbiAqL1xyXG5ST1QuTWFwLkR1bmdlb24gPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cdHRoaXMuX3Jvb21zID0gW107IC8qIGxpc3Qgb2YgYWxsIHJvb21zICovXHJcblx0dGhpcy5fY29ycmlkb3JzID0gW107XHJcbn07XHJcblJPVC5NYXAuRHVuZ2Vvbi5leHRlbmQoUk9ULk1hcCk7XHJcblxyXG4vKipcclxuICogR2V0IGFsbCBnZW5lcmF0ZWQgcm9vbXNcclxuICogQHJldHVybnMge1JPVC5NYXAuRmVhdHVyZS5Sb29tW119XHJcbiAqL1xyXG5ST1QuTWFwLkR1bmdlb24ucHJvdG90eXBlLmdldFJvb21zID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3Jvb21zO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbGwgZ2VuZXJhdGVkIGNvcnJpZG9yc1xyXG4gKiBAcmV0dXJucyB7Uk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yW119XHJcbiAqL1xyXG5ST1QuTWFwLkR1bmdlb24ucHJvdG90eXBlLmdldENvcnJpZG9ycyA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl9jb3JyaWRvcnM7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUmFuZG9tIGR1bmdlb24gZ2VuZXJhdG9yIHVzaW5nIGh1bWFuLWxpa2UgZGlnZ2luZyBwYXR0ZXJucy5cclxuICogSGVhdmlseSBiYXNlZCBvbiBNaWtlIEFuZGVyc29uJ3MgaWRlYXMgZnJvbSB0aGUgXCJUeXJhbnRcIiBhbGdvLCBtZW50aW9uZWQgYXQgXHJcbiAqIGh0dHA6Ly93d3cucm9ndWViYXNpbi5yb2d1ZWxpa2VkZXZlbG9wbWVudC5vcmcvaW5kZXgucGhwP3RpdGxlPUR1bmdlb24tQnVpbGRpbmdfQWxnb3JpdGhtLlxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5EdW5nZW9uXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlciA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcclxuXHRST1QuTWFwLkR1bmdlb24uY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0cm9vbVdpZHRoOiBbMywgOV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSB3aWR0aCAqL1xyXG5cdFx0cm9vbUhlaWdodDogWzMsIDVdLCAvKiByb29tIG1pbmltdW0gYW5kIG1heGltdW0gaGVpZ2h0ICovXHJcblx0XHRjb3JyaWRvckxlbmd0aDogWzMsIDEwXSwgLyogY29ycmlkb3IgbWluaW11bSBhbmQgbWF4aW11bSBsZW5ndGggKi9cclxuXHRcdGR1Z1BlcmNlbnRhZ2U6IDAuMiwgLyogd2Ugc3RvcCBhZnRlciB0aGlzIHBlcmNlbnRhZ2Ugb2YgbGV2ZWwgYXJlYSBoYXMgYmVlbiBkdWcgb3V0ICovXHJcblx0XHR0aW1lTGltaXQ6IDEwMDAgLyogd2Ugc3RvcCBhZnRlciB0aGlzIG11Y2ggdGltZSBoYXMgcGFzc2VkIChtc2VjKSAqL1xyXG5cdH07XHJcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XHJcblx0XHJcblx0dGhpcy5fZmVhdHVyZXMgPSB7XHJcblx0XHRcIlJvb21cIjogNCxcclxuXHRcdFwiQ29ycmlkb3JcIjogNFxyXG5cdH07XHJcblx0dGhpcy5fZmVhdHVyZUF0dGVtcHRzID0gMjA7IC8qIGhvdyBtYW55IHRpbWVzIGRvIHdlIHRyeSB0byBjcmVhdGUgYSBmZWF0dXJlIG9uIGEgc3VpdGFibGUgd2FsbCAqL1xyXG5cdHRoaXMuX3dhbGxzID0ge307IC8qIHRoZXNlIGFyZSBhdmFpbGFibGUgZm9yIGRpZ2dpbmcgKi9cclxuXHRcclxuXHR0aGlzLl9kaWdDYWxsYmFjayA9IHRoaXMuX2RpZ0NhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5fY2FuQmVEdWdDYWxsYmFjayA9IHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHR0aGlzLl9pc1dhbGxDYWxsYmFjayA9IHRoaXMuX2lzV2FsbENhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5fcHJpb3JpdHlXYWxsQ2FsbGJhY2sgPSB0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG59O1xyXG5ST1QuTWFwLkRpZ2dlci5leHRlbmQoUk9ULk1hcC5EdW5nZW9uKTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBtYXBcclxuICogQHNlZSBST1QuTWFwI2NyZWF0ZVxyXG4gKi9cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcblx0dGhpcy5fcm9vbXMgPSBbXTtcclxuXHR0aGlzLl9jb3JyaWRvcnMgPSBbXTtcclxuXHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xyXG5cdHRoaXMuX3dhbGxzID0ge307XHJcblx0dGhpcy5fZHVnID0gMDtcclxuXHR2YXIgYXJlYSA9ICh0aGlzLl93aWR0aC0yKSAqICh0aGlzLl9oZWlnaHQtMik7XHJcblxyXG5cdHRoaXMuX2ZpcnN0Um9vbSgpO1xyXG5cdFxyXG5cdHZhciB0MSA9IERhdGUubm93KCk7XHJcblxyXG5cdGRvIHtcclxuXHRcdHZhciB0MiA9IERhdGUubm93KCk7XHJcblx0XHRpZiAodDIgLSB0MSA+IHRoaXMuX29wdGlvbnMudGltZUxpbWl0KSB7IGJyZWFrOyB9XHJcblxyXG5cdFx0LyogZmluZCBhIGdvb2Qgd2FsbCAqL1xyXG5cdFx0dmFyIHdhbGwgPSB0aGlzLl9maW5kV2FsbCgpO1xyXG5cdFx0aWYgKCF3YWxsKSB7IGJyZWFrOyB9IC8qIG5vIG1vcmUgd2FsbHMgKi9cclxuXHRcdFxyXG5cdFx0dmFyIHBhcnRzID0gd2FsbC5zcGxpdChcIixcIik7XHJcblx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcclxuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0dmFyIGRpciA9IHRoaXMuX2dldERpZ2dpbmdEaXJlY3Rpb24oeCwgeSk7XHJcblx0XHRpZiAoIWRpcikgeyBjb250aW51ZTsgfSAvKiB0aGlzIHdhbGwgaXMgbm90IHN1aXRhYmxlICovXHJcblx0XHRcclxuLy9cdFx0Y29uc29sZS5sb2coXCJ3YWxsXCIsIHgsIHkpO1xyXG5cclxuXHRcdC8qIHRyeSBhZGRpbmcgYSBmZWF0dXJlICovXHJcblx0XHR2YXIgZmVhdHVyZUF0dGVtcHRzID0gMDtcclxuXHRcdGRvIHtcclxuXHRcdFx0ZmVhdHVyZUF0dGVtcHRzKys7XHJcblx0XHRcdGlmICh0aGlzLl90cnlGZWF0dXJlKHgsIHksIGRpclswXSwgZGlyWzFdKSkgeyAvKiBmZWF0dXJlIGFkZGVkICovXHJcblx0XHRcdFx0Ly9pZiAodGhpcy5fcm9vbXMubGVuZ3RoICsgdGhpcy5fY29ycmlkb3JzLmxlbmd0aCA9PSAyKSB7IHRoaXMuX3Jvb21zWzBdLmFkZERvb3IoeCwgeSk7IH0gLyogZmlyc3Qgcm9vbSBvZmljaWFsbHkgaGFzIGRvb3JzICovXHJcblx0XHRcdFx0dGhpcy5fcmVtb3ZlU3Vycm91bmRpbmdXYWxscyh4LCB5KTtcclxuXHRcdFx0XHR0aGlzLl9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzKHgtZGlyWzBdLCB5LWRpclsxXSk7XHJcblx0XHRcdFx0YnJlYWs7IFxyXG5cdFx0XHR9XHJcblx0XHR9IHdoaWxlIChmZWF0dXJlQXR0ZW1wdHMgPCB0aGlzLl9mZWF0dXJlQXR0ZW1wdHMpO1xyXG5cdFx0XHJcblx0XHR2YXIgcHJpb3JpdHlXYWxscyA9IDA7XHJcblx0XHRmb3IgKHZhciBpZCBpbiB0aGlzLl93YWxscykgeyBcclxuXHRcdFx0aWYgKHRoaXMuX3dhbGxzW2lkXSA+IDEpIHsgcHJpb3JpdHlXYWxscysrOyB9XHJcblx0XHR9XHJcblxyXG5cdH0gd2hpbGUgKHRoaXMuX2R1Zy9hcmVhIDwgdGhpcy5fb3B0aW9ucy5kdWdQZXJjZW50YWdlIHx8IHByaW9yaXR5V2FsbHMpOyAvKiBmaXhtZSBudW1iZXIgb2YgcHJpb3JpdHkgd2FsbHMgKi9cclxuXHJcblx0dGhpcy5fYWRkRG9vcnMoKTtcclxuXHJcblx0aWYgKGNhbGxiYWNrKSB7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dGhpcy5fd2FsbHMgPSB7fTtcclxuXHR0aGlzLl9tYXAgPSBudWxsO1xyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fZGlnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xyXG5cdGlmICh2YWx1ZSA9PSAwIHx8IHZhbHVlID09IDIpIHsgLyogZW1wdHkgKi9cclxuXHRcdHRoaXMuX21hcFt4XVt5XSA9IDA7XHJcblx0XHR0aGlzLl9kdWcrKztcclxuXHR9IGVsc2UgeyAvKiB3YWxsICovXHJcblx0XHR0aGlzLl93YWxsc1t4K1wiLFwiK3ldID0gMTtcclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2lzV2FsbENhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX3dpZHRoIHx8IHkgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9jYW5CZUR1Z0NhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdGlmICh4IDwgMSB8fCB5IDwgMSB8fCB4KzEgPj0gdGhpcy5fd2lkdGggfHwgeSsxID49IHRoaXMuX2hlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRyZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcclxufTtcclxuXHJcblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fcHJpb3JpdHlXYWxsQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0dGhpcy5fd2FsbHNbeCtcIixcIit5XSA9IDI7XHJcbn07XHJcblxyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2ZpcnN0Um9vbSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBjeCA9IE1hdGguZmxvb3IodGhpcy5fd2lkdGgvMik7XHJcblx0dmFyIGN5ID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQvMik7XHJcblx0dmFyIHJvb20gPSBST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb21DZW50ZXIoY3gsIGN5LCB0aGlzLl9vcHRpb25zKTtcclxuXHR0aGlzLl9yb29tcy5wdXNoKHJvb20pO1xyXG5cdHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgYSBzdWl0YWJsZSB3YWxsXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2ZpbmRXYWxsID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIHByaW8xID0gW107XHJcblx0dmFyIHByaW8yID0gW107XHJcblx0Zm9yICh2YXIgaWQgaW4gdGhpcy5fd2FsbHMpIHtcclxuXHRcdHZhciBwcmlvID0gdGhpcy5fd2FsbHNbaWRdO1xyXG5cdFx0aWYgKHByaW8gPT0gMikgeyBcclxuXHRcdFx0cHJpbzIucHVzaChpZCk7IFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cHJpbzEucHVzaChpZCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHZhciBhcnIgPSAocHJpbzIubGVuZ3RoID8gcHJpbzIgOiBwcmlvMSk7XHJcblx0aWYgKCFhcnIubGVuZ3RoKSB7IHJldHVybiBudWxsOyB9IC8qIG5vIHdhbGxzIDovICovXHJcblx0XHJcblx0dmFyIGlkID0gYXJyLnJhbmRvbSgpO1xyXG5cdGRlbGV0ZSB0aGlzLl93YWxsc1tpZF07XHJcblxyXG5cdHJldHVybiBpZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUcmllcyBhZGRpbmcgYSBmZWF0dXJlXHJcbiAqIEByZXR1cm5zIHtib29sfSB3YXMgdGhpcyBhIHN1Y2Nlc3NmdWwgdHJ5P1xyXG4gKi9cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl90cnlGZWF0dXJlID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5KSB7XHJcblx0dmFyIGZlYXR1cmUgPSBST1QuUk5HLmdldFdlaWdodGVkVmFsdWUodGhpcy5fZmVhdHVyZXMpO1xyXG5cdGZlYXR1cmUgPSBST1QuTWFwLkZlYXR1cmVbZmVhdHVyZV0uY3JlYXRlUmFuZG9tQXQoeCwgeSwgZHgsIGR5LCB0aGlzLl9vcHRpb25zKTtcclxuXHRcclxuXHRpZiAoIWZlYXR1cmUuaXNWYWxpZCh0aGlzLl9pc1dhbGxDYWxsYmFjaywgdGhpcy5fY2FuQmVEdWdDYWxsYmFjaykpIHtcclxuLy9cdFx0Y29uc29sZS5sb2coXCJub3QgdmFsaWRcIik7XHJcbi8vXHRcdGZlYXR1cmUuZGVidWcoKTtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0ZmVhdHVyZS5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spO1xyXG4vL1x0ZmVhdHVyZS5kZWJ1ZygpO1xyXG5cclxuXHRpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJPVC5NYXAuRmVhdHVyZS5Sb29tKSB7IHRoaXMuX3Jvb21zLnB1c2goZmVhdHVyZSk7IH1cclxuXHRpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcikgeyBcclxuXHRcdGZlYXR1cmUuY3JlYXRlUHJpb3JpdHlXYWxscyh0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjayk7XHJcblx0XHR0aGlzLl9jb3JyaWRvcnMucHVzaChmZWF0dXJlKTsgXHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzID0gZnVuY3Rpb24oY3gsIGN5KSB7XHJcblx0dmFyIGRlbHRhcyA9IFJPVC5ESVJTWzRdO1xyXG5cclxuXHRmb3IgKHZhciBpPTA7aTxkZWx0YXMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGRlbHRhID0gZGVsdGFzW2ldO1xyXG5cdFx0dmFyIHggPSBjeCArIGRlbHRhWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIGRlbHRhWzFdO1xyXG5cdFx0ZGVsZXRlIHRoaXMuX3dhbGxzW3grXCIsXCIreV07XHJcblx0XHR2YXIgeCA9IGN4ICsgMipkZWx0YVswXTtcclxuXHRcdHZhciB5ID0gY3kgKyAyKmRlbHRhWzFdO1xyXG5cdFx0ZGVsZXRlIHRoaXMuX3dhbGxzW3grXCIsXCIreV07XHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdmVjdG9yIGluIFwiZGlnZ2luZ1wiIGRpcmVjdGlvbiwgb3IgZmFsc2UsIGlmIHRoaXMgZG9lcyBub3QgZXhpc3QgKG9yIGlzIG5vdCB1bmlxdWUpXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2dldERpZ2dpbmdEaXJlY3Rpb24gPSBmdW5jdGlvbihjeCwgY3kpIHtcclxuXHRpZiAoY3ggPD0gMCB8fCBjeSA8PSAwIHx8IGN4ID49IHRoaXMuX3dpZHRoIC0gMSB8fCBjeSA+PSB0aGlzLl9oZWlnaHQgLSAxKSB7IHJldHVybiBudWxsOyB9XHJcblxyXG5cdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdHZhciBkZWx0YXMgPSBST1QuRElSU1s0XTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTxkZWx0YXMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGRlbHRhID0gZGVsdGFzW2ldO1xyXG5cdFx0dmFyIHggPSBjeCArIGRlbHRhWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIGRlbHRhWzFdO1xyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuX21hcFt4XVt5XSkgeyAvKiB0aGVyZSBhbHJlYWR5IGlzIGFub3RoZXIgZW1wdHkgbmVpZ2hib3IhICovXHJcblx0XHRcdGlmIChyZXN1bHQpIHsgcmV0dXJuIG51bGw7IH1cclxuXHRcdFx0cmVzdWx0ID0gZGVsdGE7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8qIG5vIGVtcHR5IG5laWdoYm9yICovXHJcblx0aWYgKCFyZXN1bHQpIHsgcmV0dXJuIG51bGw7IH1cclxuXHRcclxuXHRyZXR1cm4gWy1yZXN1bHRbMF0sIC1yZXN1bHRbMV1dO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZpbmQgZW1wdHkgc3BhY2VzIHN1cnJvdW5kaW5nIHJvb21zLCBhbmQgYXBwbHkgZG9vcnMuXHJcbiAqL1xyXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2FkZERvb3JzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGRhdGEgPSB0aGlzLl9tYXA7XHJcblx0dmFyIGlzV2FsbENhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdFx0cmV0dXJuIChkYXRhW3hdW3ldID09IDEpO1xyXG5cdH07XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9yb29tcy5sZW5ndGg7IGkrKyApIHtcclxuXHRcdHZhciByb29tID0gdGhpcy5fcm9vbXNbaV07XHJcblx0XHRyb29tLmNsZWFyRG9vcnMoKTtcclxuXHRcdHJvb20uYWRkRG9vcnMoaXNXYWxsQ2FsbGJhY2spO1xyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBEdW5nZW9uIGdlbmVyYXRvciB3aGljaCB0cmllcyB0byBmaWxsIHRoZSBzcGFjZSBldmVubHkuIEdlbmVyYXRlcyBpbmRlcGVuZGVudCByb29tcyBhbmQgdHJpZXMgdG8gY29ubmVjdCB0aGVtLlxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5EdW5nZW9uXHJcbiAqL1xyXG5ST1QuTWFwLlVuaWZvcm0gPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0Uk9ULk1hcC5EdW5nZW9uLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XHJcblxyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRyb29tV2lkdGg6IFszLCA5XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIHdpZHRoICovXHJcblx0XHRyb29tSGVpZ2h0OiBbMywgNV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSBoZWlnaHQgKi9cclxuXHRcdHJvb21EdWdQZXJjZW50YWdlOiAwLjEsIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBwZXJjZW50YWdlIG9mIGxldmVsIGFyZWEgaGFzIGJlZW4gZHVnIG91dCBieSByb29tcyAqL1xyXG5cdFx0dGltZUxpbWl0OiAxMDAwIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBtdWNoIHRpbWUgaGFzIHBhc3NlZCAobXNlYykgKi9cclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cclxuXHR0aGlzLl9yb29tQXR0ZW1wdHMgPSAyMDsgLyogbmV3IHJvb20gaXMgY3JlYXRlZCBOLXRpbWVzIHVudGlsIGlzIGNvbnNpZGVyZWQgYXMgaW1wb3NzaWJsZSB0byBnZW5lcmF0ZSAqL1xyXG5cdHRoaXMuX2NvcnJpZG9yQXR0ZW1wdHMgPSAyMDsgLyogY29ycmlkb3JzIGFyZSB0cmllZCBOLXRpbWVzIHVudGlsIHRoZSBsZXZlbCBpcyBjb25zaWRlcmVkIGFzIGltcG9zc2libGUgdG8gY29ubmVjdCAqL1xyXG5cclxuXHR0aGlzLl9jb25uZWN0ZWQgPSBbXTsgLyogbGlzdCBvZiBhbHJlYWR5IGNvbm5lY3RlZCByb29tcyAqL1xyXG5cdHRoaXMuX3VuY29ubmVjdGVkID0gW107IC8qIGxpc3Qgb2YgcmVtYWluaW5nIHVuY29ubmVjdGVkIHJvb21zICovXHJcblx0XHJcblx0dGhpcy5fZGlnQ2FsbGJhY2sgPSB0aGlzLl9kaWdDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG5cdHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2sgPSB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrLmJpbmQodGhpcyk7XHJcblx0dGhpcy5faXNXYWxsQ2FsbGJhY2sgPSB0aGlzLl9pc1dhbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG59O1xyXG5ST1QuTWFwLlVuaWZvcm0uZXh0ZW5kKFJPVC5NYXAuRHVuZ2Vvbik7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbWFwLiBJZiB0aGUgdGltZSBsaW1pdCBoYXMgYmVlbiBoaXQsIHJldHVybnMgbnVsbC5cclxuICogQHNlZSBST1QuTWFwI2NyZWF0ZVxyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG5cdHZhciB0MSA9IERhdGUubm93KCk7XHJcblx0d2hpbGUgKDEpIHtcclxuXHRcdHZhciB0MiA9IERhdGUubm93KCk7XHJcblx0XHRpZiAodDIgLSB0MSA+IHRoaXMuX29wdGlvbnMudGltZUxpbWl0KSB7IHJldHVybiBudWxsOyB9IC8qIHRpbWUgbGltaXQhICovXHJcblx0XHJcblx0XHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xyXG5cdFx0dGhpcy5fZHVnID0gMDtcclxuXHRcdHRoaXMuX3Jvb21zID0gW107XHJcblx0XHR0aGlzLl91bmNvbm5lY3RlZCA9IFtdO1xyXG5cdFx0dGhpcy5fZ2VuZXJhdGVSb29tcygpO1xyXG5cdFx0aWYgKHRoaXMuX3Jvb21zLmxlbmd0aCA8IDIpIHsgY29udGludWU7IH1cclxuXHRcdGlmICh0aGlzLl9nZW5lcmF0ZUNvcnJpZG9ycygpKSB7IGJyZWFrOyB9XHJcblx0fVxyXG5cdFxyXG5cdGlmIChjYWxsYmFjaykge1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcclxuXHRcdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBhIHN1aXRhYmxlIGFtb3VudCBvZiByb29tc1xyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZ2VuZXJhdGVSb29tcyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciB3ID0gdGhpcy5fd2lkdGgtMjtcclxuXHR2YXIgaCA9IHRoaXMuX2hlaWdodC0yO1xyXG5cclxuXHRkbyB7XHJcblx0XHR2YXIgcm9vbSA9IHRoaXMuX2dlbmVyYXRlUm9vbSgpO1xyXG5cdFx0aWYgKHRoaXMuX2R1Zy8odypoKSA+IHRoaXMuX29wdGlvbnMucm9vbUR1Z1BlcmNlbnRhZ2UpIHsgYnJlYWs7IH0gLyogYWNoaWV2ZWQgcmVxdWVzdGVkIGFtb3VudCBvZiBmcmVlIHNwYWNlICovXHJcblx0fSB3aGlsZSAocm9vbSk7XHJcblxyXG5cdC8qIGVpdGhlciBlbm91Z2ggcm9vbXMsIG9yIG5vdCBhYmxlIHRvIGdlbmVyYXRlIG1vcmUgb2YgdGhlbSA6KSAqL1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRyeSB0byBnZW5lcmF0ZSBvbmUgcm9vbVxyXG4gKi9cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZ2VuZXJhdGVSb29tID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGNvdW50ID0gMDtcclxuXHR3aGlsZSAoY291bnQgPCB0aGlzLl9yb29tQXR0ZW1wdHMpIHtcclxuXHRcdGNvdW50Kys7XHJcblx0XHRcclxuXHRcdHZhciByb29tID0gUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIHRoaXMuX29wdGlvbnMpO1xyXG5cdFx0aWYgKCFyb29tLmlzVmFsaWQodGhpcy5faXNXYWxsQ2FsbGJhY2ssIHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2spKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRcclxuXHRcdHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcclxuXHRcdHRoaXMuX3Jvb21zLnB1c2gocm9vbSk7XHJcblx0XHRyZXR1cm4gcm9vbTtcclxuXHR9IFxyXG5cclxuXHQvKiBubyByb29tIHdhcyBnZW5lcmF0ZWQgaW4gYSBnaXZlbiBudW1iZXIgb2YgYXR0ZW1wdHMgKi9cclxuXHRyZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZW5lcmF0ZXMgY29ubmVjdG9ycyBiZXdlZW4gcm9vbXNcclxuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3MgV2FzIHRoaXMgYXR0ZW1wdCBzdWNjZXNzZnVsbD9cclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2dlbmVyYXRlQ29ycmlkb3JzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGNudCA9IDA7XHJcblx0d2hpbGUgKGNudCA8IHRoaXMuX2NvcnJpZG9yQXR0ZW1wdHMpIHtcclxuXHRcdGNudCsrO1xyXG5cdFx0dGhpcy5fY29ycmlkb3JzID0gW107XHJcblxyXG5cdFx0LyogZGlnIHJvb21zIGludG8gYSBjbGVhciBtYXAgKi9cclxuXHRcdHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl9yb29tcy5sZW5ndGg7aSsrKSB7IFxyXG5cdFx0XHR2YXIgcm9vbSA9IHRoaXMuX3Jvb21zW2ldO1xyXG5cdFx0XHRyb29tLmNsZWFyRG9vcnMoKTtcclxuXHRcdFx0cm9vbS5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spOyBcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl91bmNvbm5lY3RlZCA9IHRoaXMuX3Jvb21zLnNsaWNlKCkucmFuZG9taXplKCk7XHJcblx0XHR0aGlzLl9jb25uZWN0ZWQgPSBbXTtcclxuXHRcdGlmICh0aGlzLl91bmNvbm5lY3RlZC5sZW5ndGgpIHsgdGhpcy5fY29ubmVjdGVkLnB1c2godGhpcy5fdW5jb25uZWN0ZWQucG9wKCkpOyB9IC8qIGZpcnN0IG9uZSBpcyBhbHdheXMgY29ubmVjdGVkICovXHJcblx0XHRcclxuXHRcdHdoaWxlICgxKSB7XHJcblx0XHRcdC8qIDEuIHBpY2sgcmFuZG9tIGNvbm5lY3RlZCByb29tICovXHJcblx0XHRcdHZhciBjb25uZWN0ZWQgPSB0aGlzLl9jb25uZWN0ZWQucmFuZG9tKCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvKiAyLiBmaW5kIGNsb3Nlc3QgdW5jb25uZWN0ZWQgKi9cclxuXHRcdFx0dmFyIHJvb20xID0gdGhpcy5fY2xvc2VzdFJvb20odGhpcy5fdW5jb25uZWN0ZWQsIGNvbm5lY3RlZCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvKiAzLiBjb25uZWN0IGl0IHRvIGNsb3Nlc3QgY29ubmVjdGVkICovXHJcblx0XHRcdHZhciByb29tMiA9IHRoaXMuX2Nsb3Nlc3RSb29tKHRoaXMuX2Nvbm5lY3RlZCwgcm9vbTEpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIG9rID0gdGhpcy5fY29ubmVjdFJvb21zKHJvb20xLCByb29tMik7XHJcblx0XHRcdGlmICghb2spIHsgYnJlYWs7IH0gLyogc3RvcCBjb25uZWN0aW5nLCByZS1zaHVmZmxlICovXHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIXRoaXMuX3VuY29ubmVjdGVkLmxlbmd0aCkgeyByZXR1cm4gdHJ1ZTsgfSAvKiBkb25lOyBubyByb29tcyByZW1haW4gKi9cclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZvciBhIGdpdmVuIHJvb20sIGZpbmQgdGhlIGNsb3Nlc3Qgb25lIGZyb20gdGhlIGxpc3RcclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2Nsb3Nlc3RSb29tID0gZnVuY3Rpb24ocm9vbXMsIHJvb20pIHtcclxuXHR2YXIgZGlzdCA9IEluZmluaXR5O1xyXG5cdHZhciBjZW50ZXIgPSByb29tLmdldENlbnRlcigpO1xyXG5cdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHJvb21zLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciByID0gcm9vbXNbaV07XHJcblx0XHR2YXIgYyA9IHIuZ2V0Q2VudGVyKCk7XHJcblx0XHR2YXIgZHggPSBjWzBdLWNlbnRlclswXTtcclxuXHRcdHZhciBkeSA9IGNbMV0tY2VudGVyWzFdO1xyXG5cdFx0dmFyIGQgPSBkeCpkeCtkeSpkeTtcclxuXHRcdFxyXG5cdFx0aWYgKGQgPCBkaXN0KSB7XHJcblx0XHRcdGRpc3QgPSBkO1xyXG5cdFx0XHRyZXN1bHQgPSByO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fY29ubmVjdFJvb21zID0gZnVuY3Rpb24ocm9vbTEsIHJvb20yKSB7XHJcblx0LypcclxuXHRcdHJvb20xLmRlYnVnKCk7XHJcblx0XHRyb29tMi5kZWJ1ZygpO1xyXG5cdCovXHJcblxyXG5cdHZhciBjZW50ZXIxID0gcm9vbTEuZ2V0Q2VudGVyKCk7XHJcblx0dmFyIGNlbnRlcjIgPSByb29tMi5nZXRDZW50ZXIoKTtcclxuXHJcblx0dmFyIGRpZmZYID0gY2VudGVyMlswXSAtIGNlbnRlcjFbMF07XHJcblx0dmFyIGRpZmZZID0gY2VudGVyMlsxXSAtIGNlbnRlcjFbMV07XHJcblxyXG5cdGlmIChNYXRoLmFicyhkaWZmWCkgPCBNYXRoLmFicyhkaWZmWSkpIHsgLyogZmlyc3QgdHJ5IGNvbm5lY3Rpbmcgbm9ydGgtc291dGggd2FsbHMgKi9cclxuXHRcdHZhciBkaXJJbmRleDEgPSAoZGlmZlkgPiAwID8gMiA6IDApO1xyXG5cdFx0dmFyIGRpckluZGV4MiA9IChkaXJJbmRleDEgKyAyKSAlIDQ7XHJcblx0XHR2YXIgbWluID0gcm9vbTIuZ2V0TGVmdCgpO1xyXG5cdFx0dmFyIG1heCA9IHJvb20yLmdldFJpZ2h0KCk7XHJcblx0XHR2YXIgaW5kZXggPSAwO1xyXG5cdH0gZWxzZSB7IC8qIGZpcnN0IHRyeSBjb25uZWN0aW5nIGVhc3Qtd2VzdCB3YWxscyAqL1xyXG5cdFx0dmFyIGRpckluZGV4MSA9IChkaWZmWCA+IDAgPyAxIDogMyk7XHJcblx0XHR2YXIgZGlySW5kZXgyID0gKGRpckluZGV4MSArIDIpICUgNDtcclxuXHRcdHZhciBtaW4gPSByb29tMi5nZXRUb3AoKTtcclxuXHRcdHZhciBtYXggPSByb29tMi5nZXRCb3R0b20oKTtcclxuXHRcdHZhciBpbmRleCA9IDE7XHJcblx0fVxyXG5cclxuXHR2YXIgc3RhcnQgPSB0aGlzLl9wbGFjZUluV2FsbChyb29tMSwgZGlySW5kZXgxKTsgLyogY29ycmlkb3Igd2lsbCBzdGFydCBoZXJlICovXHJcblx0aWYgKCFzdGFydCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0aWYgKHN0YXJ0W2luZGV4XSA+PSBtaW4gJiYgc3RhcnRbaW5kZXhdIDw9IG1heCkgeyAvKiBwb3NzaWJsZSB0byBjb25uZWN0IHdpdGggc3RyYWlnaHQgbGluZSAoSS1saWtlKSAqL1xyXG5cdFx0dmFyIGVuZCA9IHN0YXJ0LnNsaWNlKCk7XHJcblx0XHR2YXIgdmFsdWUgPSBudWxsO1xyXG5cdFx0c3dpdGNoIChkaXJJbmRleDIpIHtcclxuXHRcdFx0Y2FzZSAwOiB2YWx1ZSA9IHJvb20yLmdldFRvcCgpLTE7IGJyZWFrO1xyXG5cdFx0XHRjYXNlIDE6IHZhbHVlID0gcm9vbTIuZ2V0UmlnaHQoKSsxOyBicmVhaztcclxuXHRcdFx0Y2FzZSAyOiB2YWx1ZSA9IHJvb20yLmdldEJvdHRvbSgpKzE7IGJyZWFrO1xyXG5cdFx0XHRjYXNlIDM6IHZhbHVlID0gcm9vbTIuZ2V0TGVmdCgpLTE7IGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0ZW5kWyhpbmRleCsxKSUyXSA9IHZhbHVlO1xyXG5cdFx0dGhpcy5fZGlnTGluZShbc3RhcnQsIGVuZF0pO1xyXG5cdFx0XHJcblx0fSBlbHNlIGlmIChzdGFydFtpbmRleF0gPCBtaW4tMSB8fCBzdGFydFtpbmRleF0gPiBtYXgrMSkgeyAvKiBuZWVkIHRvIHN3aXRjaCB0YXJnZXQgd2FsbCAoTC1saWtlKSAqL1xyXG5cclxuXHRcdHZhciBkaWZmID0gc3RhcnRbaW5kZXhdIC0gY2VudGVyMltpbmRleF07XHJcblx0XHRzd2l0Y2ggKGRpckluZGV4Mikge1xyXG5cdFx0XHRjYXNlIDA6XHJcblx0XHRcdGNhc2UgMTpcdHZhciByb3RhdGlvbiA9IChkaWZmIDwgMCA/IDMgOiAxKTsgYnJlYWs7XHJcblx0XHRcdGNhc2UgMjpcclxuXHRcdFx0Y2FzZSAzOlx0dmFyIHJvdGF0aW9uID0gKGRpZmYgPCAwID8gMSA6IDMpOyBicmVhaztcclxuXHRcdH1cclxuXHRcdGRpckluZGV4MiA9IChkaXJJbmRleDIgKyByb3RhdGlvbikgJSA0O1xyXG5cdFx0XHJcblx0XHR2YXIgZW5kID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTIsIGRpckluZGV4Mik7XHJcblx0XHRpZiAoIWVuZCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0XHR2YXIgbWlkID0gWzAsIDBdO1xyXG5cdFx0bWlkW2luZGV4XSA9IHN0YXJ0W2luZGV4XTtcclxuXHRcdHZhciBpbmRleDIgPSAoaW5kZXgrMSklMjtcclxuXHRcdG1pZFtpbmRleDJdID0gZW5kW2luZGV4Ml07XHJcblx0XHR0aGlzLl9kaWdMaW5lKFtzdGFydCwgbWlkLCBlbmRdKTtcclxuXHRcdFxyXG5cdH0gZWxzZSB7IC8qIHVzZSBjdXJyZW50IHdhbGwgcGFpciwgYnV0IGFkanVzdCB0aGUgbGluZSBpbiB0aGUgbWlkZGxlIChTLWxpa2UpICovXHJcblx0XHJcblx0XHR2YXIgaW5kZXgyID0gKGluZGV4KzEpJTI7XHJcblx0XHR2YXIgZW5kID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTIsIGRpckluZGV4Mik7XHJcblx0XHRpZiAoIWVuZCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdHZhciBtaWQgPSBNYXRoLnJvdW5kKChlbmRbaW5kZXgyXSArIHN0YXJ0W2luZGV4Ml0pLzIpO1xyXG5cclxuXHRcdHZhciBtaWQxID0gWzAsIDBdO1xyXG5cdFx0dmFyIG1pZDIgPSBbMCwgMF07XHJcblx0XHRtaWQxW2luZGV4XSA9IHN0YXJ0W2luZGV4XTtcclxuXHRcdG1pZDFbaW5kZXgyXSA9IG1pZDtcclxuXHRcdG1pZDJbaW5kZXhdID0gZW5kW2luZGV4XTtcclxuXHRcdG1pZDJbaW5kZXgyXSA9IG1pZDtcclxuXHRcdHRoaXMuX2RpZ0xpbmUoW3N0YXJ0LCBtaWQxLCBtaWQyLCBlbmRdKTtcclxuXHR9XHJcblxyXG5cdHJvb20xLmFkZERvb3Ioc3RhcnRbMF0sIHN0YXJ0WzFdKTtcclxuXHRyb29tMi5hZGREb29yKGVuZFswXSwgZW5kWzFdKTtcclxuXHRcclxuXHR2YXIgaW5kZXggPSB0aGlzLl91bmNvbm5lY3RlZC5pbmRleE9mKHJvb20xKTtcclxuXHRpZiAoaW5kZXggIT0gLTEpIHtcclxuXHRcdHRoaXMuX3VuY29ubmVjdGVkLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHR0aGlzLl9jb25uZWN0ZWQucHVzaChyb29tMSk7XHJcblx0fVxyXG5cclxuXHR2YXIgaW5kZXggPSB0aGlzLl91bmNvbm5lY3RlZC5pbmRleE9mKHJvb20yKTtcclxuXHRpZiAoaW5kZXggIT0gLTEpIHtcclxuXHRcdHRoaXMuX3VuY29ubmVjdGVkLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHR0aGlzLl9jb25uZWN0ZWQucHVzaChyb29tMik7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fcGxhY2VJbldhbGwgPSBmdW5jdGlvbihyb29tLCBkaXJJbmRleCkge1xyXG5cdHZhciBzdGFydCA9IFswLCAwXTtcclxuXHR2YXIgZGlyID0gWzAsIDBdO1xyXG5cdHZhciBsZW5ndGggPSAwO1xyXG5cdFxyXG5cdHN3aXRjaCAoZGlySW5kZXgpIHtcclxuXHRcdGNhc2UgMDpcclxuXHRcdFx0ZGlyID0gWzEsIDBdO1xyXG5cdFx0XHRzdGFydCA9IFtyb29tLmdldExlZnQoKSwgcm9vbS5nZXRUb3AoKS0xXTtcclxuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRSaWdodCgpLXJvb20uZ2V0TGVmdCgpKzE7XHJcblx0XHRicmVhaztcclxuXHRcdGNhc2UgMTpcclxuXHRcdFx0ZGlyID0gWzAsIDFdO1xyXG5cdFx0XHRzdGFydCA9IFtyb29tLmdldFJpZ2h0KCkrMSwgcm9vbS5nZXRUb3AoKV07XHJcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0Qm90dG9tKCktcm9vbS5nZXRUb3AoKSsxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDI6XHJcblx0XHRcdGRpciA9IFsxLCAwXTtcclxuXHRcdFx0c3RhcnQgPSBbcm9vbS5nZXRMZWZ0KCksIHJvb20uZ2V0Qm90dG9tKCkrMV07XHJcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0UmlnaHQoKS1yb29tLmdldExlZnQoKSsxO1xyXG5cdFx0YnJlYWs7XHJcblx0XHRjYXNlIDM6XHJcblx0XHRcdGRpciA9IFswLCAxXTtcclxuXHRcdFx0c3RhcnQgPSBbcm9vbS5nZXRMZWZ0KCktMSwgcm9vbS5nZXRUb3AoKV07XHJcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0Qm90dG9tKCktcm9vbS5nZXRUb3AoKSsxO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG5cdFxyXG5cdHZhciBhdmFpbCA9IFtdO1xyXG5cdHZhciBsYXN0QmFkSW5kZXggPSAtMjtcclxuXHJcblx0Zm9yICh2YXIgaT0wO2k8bGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHggPSBzdGFydFswXSArIGkqZGlyWzBdO1xyXG5cdFx0dmFyIHkgPSBzdGFydFsxXSArIGkqZGlyWzFdO1xyXG5cdFx0YXZhaWwucHVzaChudWxsKTtcclxuXHRcdFxyXG5cdFx0dmFyIGlzV2FsbCA9ICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XHJcblx0XHRpZiAoaXNXYWxsKSB7XHJcblx0XHRcdGlmIChsYXN0QmFkSW5kZXggIT0gaS0xKSB7IGF2YWlsW2ldID0gW3gsIHldOyB9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsYXN0QmFkSW5kZXggPSBpO1xyXG5cdFx0XHRpZiAoaSkgeyBhdmFpbFtpLTFdID0gbnVsbDsgfVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPWF2YWlsLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcclxuXHRcdGlmICghYXZhaWxbaV0pIHsgYXZhaWwuc3BsaWNlKGksIDEpOyB9XHJcblx0fVxyXG5cdHJldHVybiAoYXZhaWwubGVuZ3RoID8gYXZhaWwucmFuZG9tKCkgOiBudWxsKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEaWcgYSBwb2x5bGluZS5cclxuICovXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2RpZ0xpbmUgPSBmdW5jdGlvbihwb2ludHMpIHtcclxuXHRmb3IgKHZhciBpPTE7aTxwb2ludHMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIHN0YXJ0ID0gcG9pbnRzW2ktMV07XHJcblx0XHR2YXIgZW5kID0gcG9pbnRzW2ldO1xyXG5cdFx0dmFyIGNvcnJpZG9yID0gbmV3IFJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcihzdGFydFswXSwgc3RhcnRbMV0sIGVuZFswXSwgZW5kWzFdKTtcclxuXHRcdGNvcnJpZG9yLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XHJcblx0XHR0aGlzLl9jb3JyaWRvcnMucHVzaChjb3JyaWRvcik7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZGlnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xyXG5cdHRoaXMuX21hcFt4XVt5XSA9IHZhbHVlO1xyXG5cdGlmICh2YWx1ZSA9PSAwKSB7IHRoaXMuX2R1ZysrOyB9XHJcbn07XHJcblxyXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9pc1dhbGxDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5ID49IHRoaXMuX2hlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRyZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcclxufTtcclxuXHJcblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2NhbkJlRHVnQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0aWYgKHggPCAxIHx8IHkgPCAxIHx8IHgrMSA+PSB0aGlzLl93aWR0aCB8fCB5KzEgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBhdXRob3IgaHlha3VnZWlcclxuICogQGNsYXNzIER1bmdlb24gZ2VuZXJhdG9yIHdoaWNoIHVzZXMgdGhlIFwib3JnaW5hbFwiIFJvZ3VlIGR1bmdlb24gZ2VuZXJhdGlvbiBhbGdvcml0aG0uIFNlZSBodHRwOi8va3VvaS5jb20vfmthbWlrYXplL0dhbWVEZXNpZ24vYXJ0MDdfcm9ndWVfZHVuZ2Vvbi5waHBcclxuICogQGF1Z21lbnRzIFJPVC5NYXBcclxuICogQHBhcmFtIHtpbnR9IFt3aWR0aD1ST1QuREVGQVVMVF9XSURUSF1cclxuICogQHBhcmFtIHtpbnR9IFtoZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIE9wdGlvbnNcclxuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuY2VsbFdpZHRoPTNdIE51bWJlciBvZiBjZWxscyB0byBjcmVhdGUgb24gdGhlIGhvcml6b250YWwgKG51bWJlciBvZiByb29tcyBob3Jpem9udGFsbHkpXHJcbiAqIEBwYXJhbSB7aW50W119IFtvcHRpb25zLmNlbGxIZWlnaHQ9M10gTnVtYmVyIG9mIGNlbGxzIHRvIGNyZWF0ZSBvbiB0aGUgdmVydGljYWwgKG51bWJlciBvZiByb29tcyB2ZXJ0aWNhbGx5KVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucm9vbVdpZHRoXSBSb29tIG1pbiBhbmQgbWF4IHdpZHRoIC0gbm9ybWFsbHkgc2V0IGF1dG8tbWFnaWNhbGx5IHZpYSB0aGUgY29uc3RydWN0b3IuXHJcbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5yb29tSGVpZ2h0XSBSb29tIG1pbiBhbmQgbWF4IGhlaWdodCAtIG5vcm1hbGx5IHNldCBhdXRvLW1hZ2ljYWxseSB2aWEgdGhlIGNvbnN0cnVjdG9yLlxyXG4gKi9cclxuUk9ULk1hcC5Sb2d1ZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0Y2VsbFdpZHRoOiAzLCAgLy8gTk9URSB0byBzZWxmLCB0aGVzZSBjb3VsZCBwcm9iYWJseSB3b3JrIHRoZSBzYW1lIGFzIHRoZSByb29tV2lkdGgvcm9vbSBIZWlnaHQgdmFsdWVzXHJcblx0XHRjZWxsSGVpZ2h0OiAzICAvLyAgICAgaWUuIGFzIGFuIGFycmF5IHdpdGggbWluLW1heCB2YWx1ZXMgZm9yIGVhY2ggZGlyZWN0aW9uLi4uLlxyXG5cdH07XHJcblxyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG5cclxuXHQvKlxyXG5cdFNldCB0aGUgcm9vbSBzaXplcyBhY2NvcmRpbmcgdG8gdGhlIG92ZXItYWxsIHdpZHRoIG9mIHRoZSBtYXAsXHJcblx0YW5kIHRoZSBjZWxsIHNpemVzLlxyXG5cdCovXHJcblx0aWYgKCF0aGlzLl9vcHRpb25zLmhhc093blByb3BlcnR5KFwicm9vbVdpZHRoXCIpKSB7XHJcblx0XHR0aGlzLl9vcHRpb25zW1wicm9vbVdpZHRoXCJdID0gdGhpcy5fY2FsY3VsYXRlUm9vbVNpemUodGhpcy5fd2lkdGgsIHRoaXMuX29wdGlvbnNbXCJjZWxsV2lkdGhcIl0pO1xyXG5cdH1cclxuXHRpZiAoIXRoaXMuX29wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJyb29tSGVpZ2h0XCIpKSB7XHJcblx0XHR0aGlzLl9vcHRpb25zW1wicm9vbUhlaWdodFwiXSA9IHRoaXMuX2NhbGN1bGF0ZVJvb21TaXplKHRoaXMuX2hlaWdodCwgdGhpcy5fb3B0aW9uc1tcImNlbGxIZWlnaHRcIl0pO1xyXG5cdH1cclxuXHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLmV4dGVuZChST1QuTWFwKTtcclxuXHJcbi8qKlxyXG4gKiBAc2VlIFJPVC5NYXAjY3JlYXRlXHJcbiAqL1xyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuXHR0aGlzLm1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XHJcblx0dGhpcy5yb29tcyA9IFtdO1xyXG5cdHRoaXMuY29ubmVjdGVkQ2VsbHMgPSBbXTtcclxuXHJcblx0dGhpcy5faW5pdFJvb21zKCk7XHJcblx0dGhpcy5fY29ubmVjdFJvb21zKCk7XHJcblx0dGhpcy5fY29ubmVjdFVuY29ubmVjdGVkUm9vbXMoKTtcclxuXHR0aGlzLl9jcmVhdGVSYW5kb21Sb29tQ29ubmVjdGlvbnMoKTtcclxuXHR0aGlzLl9jcmVhdGVSb29tcygpO1xyXG5cdHRoaXMuX2NyZWF0ZUNvcnJpZG9ycygpO1xyXG5cclxuXHRpZiAoY2FsbGJhY2spIHtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fd2lkdGg7IGkrKykge1xyXG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soaSwgaiwgdGhpcy5tYXBbaV1bal0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jYWxjdWxhdGVSb29tU2l6ZSA9IGZ1bmN0aW9uIChzaXplLCBjZWxsKSB7XHJcblx0dmFyIG1heCA9IE1hdGguZmxvb3IoKHNpemUvY2VsbCkgKiAwLjgpO1xyXG5cdHZhciBtaW4gPSBNYXRoLmZsb29yKChzaXplL2NlbGwpICogMC4yNSk7XHJcblx0aWYgKG1pbiA8IDIpIHsgbWluID0gMjsgfVxyXG5cdGlmIChtYXggPCAyKSB7IG1heCA9IDI7IH1cclxuXHRyZXR1cm4gW21pbiwgbWF4XTtcclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9pbml0Um9vbXMgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly8gY3JlYXRlIHJvb21zIGFycmF5LiBUaGlzIGlzIHRoZSBcImdyaWRcIiBsaXN0IGZyb20gdGhlIGFsZ28uXHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDsgaSsrKSB7XHJcblx0XHR0aGlzLnJvb21zLnB1c2goW10pO1xyXG5cdFx0Zm9yKHZhciBqID0gMDsgaiA8IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDsgaisrKSB7XHJcblx0XHRcdHRoaXMucm9vbXNbaV0ucHVzaCh7XCJ4XCI6MCwgXCJ5XCI6MCwgXCJ3aWR0aFwiOjAsIFwiaGVpZ2h0XCI6MCwgXCJjb25uZWN0aW9uc1wiOltdLCBcImNlbGx4XCI6aSwgXCJjZWxseVwiOmp9KTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY29ubmVjdFJvb21zID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vcGljayByYW5kb20gc3RhcnRpbmcgZ3JpZFxyXG5cdHZhciBjZ3ggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGgtMSk7XHJcblx0dmFyIGNneSA9IFJPVC5STkcuZ2V0VW5pZm9ybUludCgwLCB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQtMSk7XHJcblxyXG5cdHZhciBpZHg7XHJcblx0dmFyIG5jZ3g7XHJcblx0dmFyIG5jZ3k7XHJcblxyXG5cdHZhciBmb3VuZCA9IGZhbHNlO1xyXG5cdHZhciByb29tO1xyXG5cdHZhciBvdGhlclJvb207XHJcblxyXG5cdC8vIGZpbmQgIHVuY29ubmVjdGVkIG5laWdoYm91ciBjZWxsc1xyXG5cdGRvIHtcclxuXHJcblx0XHQvL3ZhciBkaXJUb0NoZWNrID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddO1xyXG5cdFx0dmFyIGRpclRvQ2hlY2sgPSBbMCwgMiwgNCwgNl07XHJcblx0XHRkaXJUb0NoZWNrID0gZGlyVG9DaGVjay5yYW5kb21pemUoKTtcclxuXHJcblx0XHRkbyB7XHJcblx0XHRcdGZvdW5kID0gZmFsc2U7XHJcblx0XHRcdGlkeCA9IGRpclRvQ2hlY2sucG9wKCk7XHJcblxyXG5cdFx0XHRuY2d4ID0gY2d4ICsgUk9ULkRJUlNbOF1baWR4XVswXTtcclxuXHRcdFx0bmNneSA9IGNneSArIFJPVC5ESVJTWzhdW2lkeF1bMV07XHJcblxyXG5cdFx0XHRpZiAobmNneCA8IDAgfHwgbmNneCA+PSB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aCkgeyBjb250aW51ZTsgfVxyXG5cdFx0XHRpZiAobmNneSA8IDAgfHwgbmNneSA+PSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQpIHsgY29udGludWU7IH1cclxuXHJcblx0XHRcdHJvb20gPSB0aGlzLnJvb21zW2NneF1bY2d5XTtcclxuXHJcblx0XHRcdGlmIChyb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdC8vIGFzIGxvbmcgYXMgdGhpcyByb29tIGRvZXNuJ3QgYWxyZWFkeSBjb29uZWN0IHRvIG1lLCB3ZSBhcmUgb2sgd2l0aCBpdC5cclxuXHRcdFx0XHRpZiAocm9vbVtcImNvbm5lY3Rpb25zXCJdWzBdWzBdID09IG5jZ3ggJiYgcm9vbVtcImNvbm5lY3Rpb25zXCJdWzBdWzFdID09IG5jZ3kpIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tuY2d4XVtuY2d5XTtcclxuXHJcblx0XHRcdGlmIChvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLnB1c2goW2NneCwgY2d5XSk7XHJcblxyXG5cdFx0XHRcdHRoaXMuY29ubmVjdGVkQ2VsbHMucHVzaChbbmNneCwgbmNneV0pO1xyXG5cdFx0XHRcdGNneCA9IG5jZ3g7XHJcblx0XHRcdFx0Y2d5ID0gbmNneTtcclxuXHRcdFx0XHRmb3VuZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9IHdoaWxlIChkaXJUb0NoZWNrLmxlbmd0aCA+IDAgJiYgZm91bmQgPT0gZmFsc2UpO1xyXG5cclxuXHR9IHdoaWxlIChkaXJUb0NoZWNrLmxlbmd0aCA+IDApO1xyXG5cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jb25uZWN0VW5jb25uZWN0ZWRSb29tcyA9IGZ1bmN0aW9uICgpIHtcclxuXHQvL1doaWxlIHRoZXJlIGFyZSB1bmNvbm5lY3RlZCByb29tcywgdHJ5IHRvIGNvbm5lY3QgdGhlbSB0byBhIHJhbmRvbSBjb25uZWN0ZWQgbmVpZ2hib3JcclxuXHQvLyhpZiBhIHJvb20gaGFzIG5vIGNvbm5lY3RlZCBuZWlnaGJvcnMgeWV0LCBqdXN0IGtlZXAgY3ljbGluZywgeW91J2xsIGZpbGwgb3V0IHRvIGl0IGV2ZW50dWFsbHkpLlxyXG5cdHZhciBjdyA9IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoO1xyXG5cdHZhciBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcclxuXHJcblx0dGhpcy5jb25uZWN0ZWRDZWxscyA9IHRoaXMuY29ubmVjdGVkQ2VsbHMucmFuZG9taXplKCk7XHJcblx0dmFyIHJvb207XHJcblx0dmFyIG90aGVyUm9vbTtcclxuXHR2YXIgdmFsaWRSb29tO1xyXG5cclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoOyBpKyspIHtcclxuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0OyBqKyspICB7XHJcblxyXG5cdFx0XHRyb29tID0gdGhpcy5yb29tc1tpXVtqXTtcclxuXHJcblx0XHRcdGlmIChyb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHR2YXIgZGlyZWN0aW9ucyA9IFswLCAyLCA0LCA2XTtcclxuXHRcdFx0XHRkaXJlY3Rpb25zID0gZGlyZWN0aW9ucy5yYW5kb21pemUoKTtcclxuXHJcblx0XHRcdFx0dmFsaWRSb29tID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdGRvIHtcclxuXHJcblx0XHRcdFx0XHR2YXIgZGlySWR4ID0gZGlyZWN0aW9ucy5wb3AoKTtcclxuXHRcdFx0XHRcdHZhciBuZXdJID0gaSArIFJPVC5ESVJTWzhdW2RpcklkeF1bMF07XHJcblx0XHRcdFx0XHR2YXIgbmV3SiA9IGogKyBST1QuRElSU1s4XVtkaXJJZHhdWzFdO1xyXG5cclxuXHRcdFx0XHRcdGlmIChuZXdJIDwgMCB8fCBuZXdJID49IGN3IHx8IG5ld0ogPCAwIHx8IG5ld0ogPj0gY2gpIHsgY29udGludWU7IH1cclxuXHJcblx0XHRcdFx0XHRvdGhlclJvb20gPSB0aGlzLnJvb21zW25ld0ldW25ld0pdO1xyXG5cclxuXHRcdFx0XHRcdHZhbGlkUm9vbSA9IHRydWU7XHJcblxyXG5cdFx0XHRcdFx0aWYgKG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aCA9PSAwKSB7IGJyZWFrOyB9XHJcblxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGg7IGsrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAob3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl1ba11bMF0gPT0gaSAmJiBvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXVtrXVsxXSA9PSBqKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFsaWRSb29tID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAodmFsaWRSb29tKSB7IGJyZWFrOyB9XHJcblxyXG5cdFx0XHRcdH0gd2hpbGUgKGRpcmVjdGlvbnMubGVuZ3RoKTtcclxuXHJcblx0XHRcdFx0aWYgKHZhbGlkUm9vbSkge1xyXG5cdFx0XHRcdFx0cm9vbVtcImNvbm5lY3Rpb25zXCJdLnB1c2goW290aGVyUm9vbVtcImNlbGx4XCJdLCBvdGhlclJvb21bXCJjZWxseVwiXV0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIi0tIFVuYWJsZSB0byBjb25uZWN0IHJvb20uXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jcmVhdGVSYW5kb21Sb29tQ29ubmVjdGlvbnMgPSBmdW5jdGlvbiAoY29ubmVjdGlvbnMpIHtcclxuXHQvLyBFbXB0eSBmb3Igbm93LlxyXG59O1xyXG5cclxuXHJcblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jcmVhdGVSb29tcyA9IGZ1bmN0aW9uICgpIHtcclxuXHQvLyBDcmVhdGUgUm9vbXNcclxuXHJcblx0dmFyIHcgPSB0aGlzLl93aWR0aDtcclxuXHR2YXIgaCA9IHRoaXMuX2hlaWdodDtcclxuXHJcblx0dmFyIGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XHJcblx0dmFyIGNoID0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0O1xyXG5cclxuXHR2YXIgY3dwID0gTWF0aC5mbG9vcih0aGlzLl93aWR0aCAvIGN3KTtcclxuXHR2YXIgY2hwID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQgLyBjaCk7XHJcblxyXG5cdHZhciByb29tdztcclxuXHR2YXIgcm9vbWg7XHJcblx0dmFyIHJvb21XaWR0aCA9IHRoaXMuX29wdGlvbnNbXCJyb29tV2lkdGhcIl07XHJcblx0dmFyIHJvb21IZWlnaHQgPSB0aGlzLl9vcHRpb25zW1wicm9vbUhlaWdodFwiXTtcclxuXHR2YXIgc3g7XHJcblx0dmFyIHN5O1xyXG5cdHZhciBvdGhlclJvb207XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY3c7IGkrKykge1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaDsgaisrKSB7XHJcblx0XHRcdHN4ID0gY3dwICogaTtcclxuXHRcdFx0c3kgPSBjaHAgKiBqO1xyXG5cclxuXHRcdFx0aWYgKHN4ID09IDApIHsgc3ggPSAxOyB9XHJcblx0XHRcdGlmIChzeSA9PSAwKSB7IHN5ID0gMTsgfVxyXG5cclxuXHRcdFx0cm9vbXcgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQocm9vbVdpZHRoWzBdLCByb29tV2lkdGhbMV0pO1xyXG5cdFx0XHRyb29taCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChyb29tSGVpZ2h0WzBdLCByb29tSGVpZ2h0WzFdKTtcclxuXHJcblx0XHRcdGlmIChqID4gMCkge1xyXG5cdFx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbaV1bai0xXTtcclxuXHRcdFx0XHR3aGlsZSAoc3kgLSAob3RoZXJSb29tW1wieVwiXSArIG90aGVyUm9vbVtcImhlaWdodFwiXSApIDwgMykge1xyXG5cdFx0XHRcdFx0c3krKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpID4gMCkge1xyXG5cdFx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbaS0xXVtqXTtcclxuXHRcdFx0XHR3aGlsZShzeCAtIChvdGhlclJvb21bXCJ4XCJdICsgb3RoZXJSb29tW1wid2lkdGhcIl0pIDwgMykge1xyXG5cdFx0XHRcdFx0c3grKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBzeE9mZnNldCA9IE1hdGgucm91bmQoUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGN3cC1yb29tdykvMik7XHJcblx0XHRcdHZhciBzeU9mZnNldCA9IE1hdGgucm91bmQoUk9ULlJORy5nZXRVbmlmb3JtSW50KDAsIGNocC1yb29taCkvMik7XHJcblxyXG5cdFx0XHR3aGlsZSAoc3ggKyBzeE9mZnNldCArIHJvb213ID49IHcpIHtcclxuXHRcdFx0XHRpZihzeE9mZnNldCkge1xyXG5cdFx0XHRcdFx0c3hPZmZzZXQtLTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cm9vbXctLTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHdoaWxlIChzeSArIHN5T2Zmc2V0ICsgcm9vbWggPj0gaCkge1xyXG5cdFx0XHRcdGlmKHN5T2Zmc2V0KSB7XHJcblx0XHRcdFx0XHRzeU9mZnNldC0tO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyb29taC0tO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3ggPSBzeCArIHN4T2Zmc2V0O1xyXG5cdFx0XHRzeSA9IHN5ICsgc3lPZmZzZXQ7XHJcblxyXG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wieFwiXSA9IHN4O1xyXG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wieVwiXSA9IHN5O1xyXG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wid2lkdGhcIl0gPSByb29tdztcclxuXHRcdFx0dGhpcy5yb29tc1tpXVtqXVtcImhlaWdodFwiXSA9IHJvb21oO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaWkgPSBzeDsgaWkgPCBzeCArIHJvb213OyBpaSsrKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgamogPSBzeTsgamogPCBzeSArIHJvb21oOyBqaisrKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1hcFtpaV1bampdID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fZ2V0V2FsbFBvc2l0aW9uID0gZnVuY3Rpb24gKGFSb29tLCBhRGlyZWN0aW9uKSB7XHJcblx0dmFyIHJ4O1xyXG5cdHZhciByeTtcclxuXHR2YXIgZG9vcjtcclxuXHJcblx0aWYgKGFEaXJlY3Rpb24gPT0gMSB8fCBhRGlyZWN0aW9uID09IDMpIHtcclxuXHRcdHJ4ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KGFSb29tW1wieFwiXSArIDEsIGFSb29tW1wieFwiXSArIGFSb29tW1wid2lkdGhcIl0gLSAyKTtcclxuXHRcdGlmIChhRGlyZWN0aW9uID09IDEpIHtcclxuXHRcdFx0cnkgPSBhUm9vbVtcInlcIl0gLSAyO1xyXG5cdFx0XHRkb29yID0gcnkgKyAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cnkgPSBhUm9vbVtcInlcIl0gKyBhUm9vbVtcImhlaWdodFwiXSArIDE7XHJcblx0XHRcdGRvb3IgPSByeSAtMTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLm1hcFtyeF1bZG9vcl0gPSAwOyAvLyBpJ20gbm90IHNldHRpbmcgYSBzcGVjaWZpYyAnZG9vcicgdGlsZSB2YWx1ZSByaWdodCBub3csIGp1c3QgZW1wdHkgc3BhY2UuXHJcblxyXG5cdH0gZWxzZSBpZiAoYURpcmVjdGlvbiA9PSAyIHx8IGFEaXJlY3Rpb24gPT0gNCkge1xyXG5cdFx0cnkgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQoYVJvb21bXCJ5XCJdICsgMSwgYVJvb21bXCJ5XCJdICsgYVJvb21bXCJoZWlnaHRcIl0gLSAyKTtcclxuXHRcdGlmKGFEaXJlY3Rpb24gPT0gMikge1xyXG5cdFx0XHRyeCA9IGFSb29tW1wieFwiXSArIGFSb29tW1wid2lkdGhcIl0gKyAxO1xyXG5cdFx0XHRkb29yID0gcnggLSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cnggPSBhUm9vbVtcInhcIl0gLSAyO1xyXG5cdFx0XHRkb29yID0gcnggKyAxO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubWFwW2Rvb3JdW3J5XSA9IDA7IC8vIGknbSBub3Qgc2V0dGluZyBhIHNwZWNpZmljICdkb29yJyB0aWxlIHZhbHVlIHJpZ2h0IG5vdywganVzdCBlbXB0eSBzcGFjZS5cclxuXHJcblx0fVxyXG5cdHJldHVybiBbcngsIHJ5XTtcclxufTtcclxuXHJcbi8qKipcclxuKiBAcGFyYW0gc3RhcnRQb3NpdGlvbiBhIDIgZWxlbWVudCBhcnJheVxyXG4qIEBwYXJhbSBlbmRQb3NpdGlvbiBhIDIgZWxlbWVudCBhcnJheVxyXG4qL1xyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fZHJhd0NvcnJpZG9yID0gZnVuY3Rpb24gKHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uKSB7XHJcblx0dmFyIHhPZmZzZXQgPSBlbmRQb3NpdGlvblswXSAtIHN0YXJ0UG9zaXRpb25bMF07XHJcblx0dmFyIHlPZmZzZXQgPSBlbmRQb3NpdGlvblsxXSAtIHN0YXJ0UG9zaXRpb25bMV07XHJcblxyXG5cdHZhciB4cG9zID0gc3RhcnRQb3NpdGlvblswXTtcclxuXHR2YXIgeXBvcyA9IHN0YXJ0UG9zaXRpb25bMV07XHJcblxyXG5cdHZhciB0ZW1wRGlzdDtcclxuXHR2YXIgeERpcjtcclxuXHR2YXIgeURpcjtcclxuXHJcblx0dmFyIG1vdmU7IC8vIDIgZWxlbWVudCBhcnJheSwgZWxlbWVudCAwIGlzIHRoZSBkaXJlY3Rpb24sIGVsZW1lbnQgMSBpcyB0aGUgdG90YWwgdmFsdWUgdG8gbW92ZS5cclxuXHR2YXIgbW92ZXMgPSBbXTsgLy8gYSBsaXN0IG9mIDIgZWxlbWVudCBhcnJheXNcclxuXHJcblx0dmFyIHhBYnMgPSBNYXRoLmFicyh4T2Zmc2V0KTtcclxuXHR2YXIgeUFicyA9IE1hdGguYWJzKHlPZmZzZXQpO1xyXG5cclxuXHR2YXIgcGVyY2VudCA9IFJPVC5STkcuZ2V0VW5pZm9ybSgpOyAvLyB1c2VkIHRvIHNwbGl0IHRoZSBtb3ZlIGF0IGRpZmZlcmVudCBwbGFjZXMgYWxvbmcgdGhlIGxvbmcgYXhpc1xyXG5cdHZhciBmaXJzdEhhbGYgPSBwZXJjZW50O1xyXG5cdHZhciBzZWNvbmRIYWxmID0gMSAtIHBlcmNlbnQ7XHJcblxyXG5cdHhEaXIgPSB4T2Zmc2V0ID4gMCA/IDIgOiA2O1xyXG5cdHlEaXIgPSB5T2Zmc2V0ID4gMCA/IDQgOiAwO1xyXG5cclxuXHRpZiAoeEFicyA8IHlBYnMpIHtcclxuXHRcdC8vIG1vdmUgZmlyc3RIYWxmIG9mIHRoZSB5IG9mZnNldFxyXG5cdFx0dGVtcERpc3QgPSBNYXRoLmNlaWwoeUFicyAqIGZpcnN0SGFsZik7XHJcblx0XHRtb3Zlcy5wdXNoKFt5RGlyLCB0ZW1wRGlzdF0pO1xyXG5cdFx0Ly8gbW92ZSBhbGwgdGhlIHggb2Zmc2V0XHJcblx0XHRtb3Zlcy5wdXNoKFt4RGlyLCB4QWJzXSk7XHJcblx0XHQvLyBtb3ZlIHNlbmRIYWxmIG9mIHRoZSAgeSBvZmZzZXRcclxuXHRcdHRlbXBEaXN0ID0gTWF0aC5mbG9vcih5QWJzICogc2Vjb25kSGFsZik7XHJcblx0XHRtb3Zlcy5wdXNoKFt5RGlyLCB0ZW1wRGlzdF0pO1xyXG5cdH0gZWxzZSB7XHJcblx0XHQvLyAgbW92ZSBmaXJzdEhhbGYgb2YgdGhlIHggb2Zmc2V0XHJcblx0XHR0ZW1wRGlzdCA9IE1hdGguY2VpbCh4QWJzICogZmlyc3RIYWxmKTtcclxuXHRcdG1vdmVzLnB1c2goW3hEaXIsIHRlbXBEaXN0XSk7XHJcblx0XHQvLyBtb3ZlIGFsbCB0aGUgeSBvZmZzZXRcclxuXHRcdG1vdmVzLnB1c2goW3lEaXIsIHlBYnNdKTtcclxuXHRcdC8vIG1vdmUgc2Vjb25kSGFsZiBvZiB0aGUgeCBvZmZzZXQuXHJcblx0XHR0ZW1wRGlzdCA9IE1hdGguZmxvb3IoeEFicyAqIHNlY29uZEhhbGYpO1xyXG5cdFx0bW92ZXMucHVzaChbeERpciwgdGVtcERpc3RdKTtcclxuXHR9XHJcblxyXG5cdHRoaXMubWFwW3hwb3NdW3lwb3NdID0gMDtcclxuXHJcblx0d2hpbGUgKG1vdmVzLmxlbmd0aCA+IDApIHtcclxuXHRcdG1vdmUgPSBtb3Zlcy5wb3AoKTtcclxuXHRcdHdoaWxlIChtb3ZlWzFdID4gMCkge1xyXG5cdFx0XHR4cG9zICs9IFJPVC5ESVJTWzhdW21vdmVbMF1dWzBdO1xyXG5cdFx0XHR5cG9zICs9IFJPVC5ESVJTWzhdW21vdmVbMF1dWzFdO1xyXG5cdFx0XHR0aGlzLm1hcFt4cG9zXVt5cG9zXSA9IDA7XHJcblx0XHRcdG1vdmVbMV0gPSBtb3ZlWzFdIC0gMTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY3JlYXRlQ29ycmlkb3JzID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vIERyYXcgQ29ycmlkb3JzIGJldHdlZW4gY29ubmVjdGVkIHJvb21zXHJcblxyXG5cdHZhciBjdyA9IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoO1xyXG5cdHZhciBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcclxuXHR2YXIgcm9vbTtcclxuXHR2YXIgY29ubmVjdGlvbjtcclxuXHR2YXIgb3RoZXJSb29tO1xyXG5cdHZhciB3YWxsO1xyXG5cdHZhciBvdGhlcldhbGw7XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY3c7IGkrKykge1xyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaDsgaisrKSB7XHJcblx0XHRcdHJvb20gPSB0aGlzLnJvb21zW2ldW2pdO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCByb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoOyBrKyspIHtcclxuXHJcblx0XHRcdFx0Y29ubmVjdGlvbiA9IHJvb21bXCJjb25uZWN0aW9uc1wiXVtrXTtcclxuXHJcblx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tjb25uZWN0aW9uWzBdXVtjb25uZWN0aW9uWzFdXTtcclxuXHJcblx0XHRcdFx0Ly8gZmlndXJlIG91dCB3aGF0IHdhbGwgb3VyIGNvcnJpZG9yIHdpbGwgc3RhcnQgb25lLlxyXG5cdFx0XHRcdC8vIGZpZ3VyZSBvdXQgd2hhdCB3YWxsIG91ciBjb3JyaWRvciB3aWxsIGVuZCBvbi5cclxuXHRcdFx0XHRpZiAob3RoZXJSb29tW1wiY2VsbHhcIl0gPiByb29tW1wiY2VsbHhcIl0pIHtcclxuXHRcdFx0XHRcdHdhbGwgPSAyO1xyXG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gNDtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG90aGVyUm9vbVtcImNlbGx4XCJdIDwgcm9vbVtcImNlbGx4XCJdKSB7XHJcblx0XHRcdFx0XHR3YWxsID0gNDtcclxuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDI7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG90aGVyUm9vbVtcImNlbGx5XCJdID4gcm9vbVtcImNlbGx5XCJdKSB7XHJcblx0XHRcdFx0XHR3YWxsID0gMztcclxuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDE7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG90aGVyUm9vbVtcImNlbGx5XCJdIDwgcm9vbVtcImNlbGx5XCJdKSB7XHJcblx0XHRcdFx0XHR3YWxsID0gMTtcclxuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDM7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLl9kcmF3Q29ycmlkb3IodGhpcy5fZ2V0V2FsbFBvc2l0aW9uKHJvb20sIHdhbGwpLCB0aGlzLl9nZXRXYWxsUG9zaXRpb24ob3RoZXJSb29tLCBvdGhlcldhbGwpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBEdW5nZW9uIGZlYXR1cmU7IGhhcyBvd24gLmNyZWF0ZSgpIG1ldGhvZFxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlID0gZnVuY3Rpb24oKSB7fTtcclxuUk9ULk1hcC5GZWF0dXJlLnByb3RvdHlwZS5pc1ZhbGlkID0gZnVuY3Rpb24oY2FuQmVEdWdDYWxsYmFjaykge307XHJcblJPVC5NYXAuRmVhdHVyZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHt9O1xyXG5ST1QuTWFwLkZlYXR1cmUucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24oKSB7fTtcclxuUk9ULk1hcC5GZWF0dXJlLmNyZWF0ZVJhbmRvbUF0ID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5LCBvcHRpb25zKSB7fTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUm9vbVxyXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5GZWF0dXJlXHJcbiAqIEBwYXJhbSB7aW50fSB4MVxyXG4gKiBAcGFyYW0ge2ludH0geTFcclxuICogQHBhcmFtIHtpbnR9IHgyXHJcbiAqIEBwYXJhbSB7aW50fSB5MlxyXG4gKiBAcGFyYW0ge2ludH0gW2Rvb3JYXVxyXG4gKiBAcGFyYW0ge2ludH0gW2Rvb3JZXVxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20gPSBmdW5jdGlvbih4MSwgeTEsIHgyLCB5MiwgZG9vclgsIGRvb3JZKSB7XHJcblx0dGhpcy5feDEgPSB4MTtcclxuXHR0aGlzLl95MSA9IHkxO1xyXG5cdHRoaXMuX3gyID0geDI7XHJcblx0dGhpcy5feTIgPSB5MjtcclxuXHR0aGlzLl9kb29ycyA9IHt9O1xyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID4gNCkgeyB0aGlzLmFkZERvb3IoZG9vclgsIGRvb3JZKTsgfVxyXG59O1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5leHRlbmQoUk9ULk1hcC5GZWF0dXJlKTtcclxuXHJcbi8qKlxyXG4gKiBSb29tIG9mIHJhbmRvbSBzaXplLCB3aXRoIGEgZ2l2ZW4gZG9vcnMgYW5kIGRpcmVjdGlvblxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tQXQgPSBmdW5jdGlvbih4LCB5LCBkeCwgZHksIG9wdGlvbnMpIHtcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbVdpZHRoWzFdO1xyXG5cdHZhciB3aWR0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbUhlaWdodFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xyXG5cdHZhciBoZWlnaHQgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdGlmIChkeCA9PSAxKSB7IC8qIHRvIHRoZSByaWdodCAqL1xyXG5cdFx0dmFyIHkyID0geSAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiBoZWlnaHQpO1xyXG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgrMSwgeTIsIHgrd2lkdGgsIHkyK2hlaWdodC0xLCB4LCB5KTtcclxuXHR9XHJcblx0XHJcblx0aWYgKGR4ID09IC0xKSB7IC8qIHRvIHRoZSBsZWZ0ICovXHJcblx0XHR2YXIgeTIgPSB5IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIGhlaWdodCk7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoeC13aWR0aCwgeTIsIHgtMSwgeTIraGVpZ2h0LTEsIHgsIHkpO1xyXG5cdH1cclxuXHJcblx0aWYgKGR5ID09IDEpIHsgLyogdG8gdGhlIGJvdHRvbSAqL1xyXG5cdFx0dmFyIHgyID0geCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoeDIsIHkrMSwgeDIrd2lkdGgtMSwgeStoZWlnaHQsIHgsIHkpO1xyXG5cdH1cclxuXHJcblx0aWYgKGR5ID09IC0xKSB7IC8qIHRvIHRoZSB0b3AgKi9cclxuXHRcdHZhciB4MiA9IHggLSBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogd2lkdGgpO1xyXG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgyLCB5LWhlaWdodCwgeDIrd2lkdGgtMSwgeS0xLCB4LCB5KTtcclxuXHR9XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImR4IG9yIGR5IG11c3QgYmUgMSBvciAtMVwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSb29tIG9mIHJhbmRvbSBzaXplLCBwb3NpdGlvbmVkIGFyb3VuZCBjZW50ZXIgY29vcmRzXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb21DZW50ZXIgPSBmdW5jdGlvbihjeCwgY3ksIG9wdGlvbnMpIHtcclxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbVdpZHRoWzFdO1xyXG5cdHZhciB3aWR0aCA9IFJPVC5STkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XHJcblx0XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbUhlaWdodFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xyXG5cdHZhciBoZWlnaHQgPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cclxuXHR2YXIgeDEgPSBjeCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqd2lkdGgpO1xyXG5cdHZhciB5MSA9IGN5IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSpoZWlnaHQpO1xyXG5cdHZhciB4MiA9IHgxICsgd2lkdGggLSAxO1xyXG5cdHZhciB5MiA9IHkxICsgaGVpZ2h0IC0gMTtcclxuXHJcblx0cmV0dXJuIG5ldyB0aGlzKHgxLCB5MSwgeDIsIHkyKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSb29tIG9mIHJhbmRvbSBzaXplIHdpdGhpbiBhIGdpdmVuIGRpbWVuc2lvbnNcclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0LCBvcHRpb25zKSB7XHJcblx0dmFyIG1pbiA9IG9wdGlvbnMucm9vbVdpZHRoWzBdO1xyXG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21XaWR0aFsxXTtcclxuXHR2YXIgd2lkdGggPSBST1QuUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xyXG5cdFxyXG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21IZWlnaHRbMF07XHJcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbUhlaWdodFsxXTtcclxuXHR2YXIgaGVpZ2h0ID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHR2YXIgbGVmdCA9IGF2YWlsV2lkdGggLSB3aWR0aCAtIDE7XHJcblx0dmFyIHRvcCA9IGF2YWlsSGVpZ2h0IC0gaGVpZ2h0IC0gMTtcclxuXHJcblx0dmFyIHgxID0gMSArIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqbGVmdCk7XHJcblx0dmFyIHkxID0gMSArIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqdG9wKTtcclxuXHR2YXIgeDIgPSB4MSArIHdpZHRoIC0gMTtcclxuXHR2YXIgeTIgPSB5MSArIGhlaWdodCAtIDE7XHJcblxyXG5cdHJldHVybiBuZXcgdGhpcyh4MSwgeTEsIHgyLCB5Mik7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuYWRkRG9vciA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHR0aGlzLl9kb29yc1t4K1wiLFwiK3ldID0gMTtcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufVxyXG4gKi9cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldERvb3JzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuXHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fZG9vcnMpIHtcclxuXHRcdHZhciBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XHJcblx0XHRjYWxsYmFjayhwYXJzZUludChwYXJ0c1swXSksIHBhcnNlSW50KHBhcnRzWzFdKSk7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmNsZWFyRG9vcnMgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLl9kb29ycyA9IHt9O1xyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmFkZERvb3JzID0gZnVuY3Rpb24oaXNXYWxsQ2FsbGJhY2spIHtcclxuXHR2YXIgbGVmdCA9IHRoaXMuX3gxLTE7XHJcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcclxuXHR2YXIgdG9wID0gdGhpcy5feTEtMTtcclxuXHR2YXIgYm90dG9tID0gdGhpcy5feTIrMTtcclxuXHJcblx0Zm9yICh2YXIgeD1sZWZ0OyB4PD1yaWdodDsgeCsrKSB7XHJcblx0XHRmb3IgKHZhciB5PXRvcDsgeTw9Ym90dG9tOyB5KyspIHtcclxuXHRcdFx0aWYgKHggIT0gbGVmdCAmJiB4ICE9IHJpZ2h0ICYmIHkgIT0gdG9wICYmIHkgIT0gYm90dG9tKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRcdGlmIChpc1dhbGxDYWxsYmFjayh4LCB5KSkgeyBjb250aW51ZTsgfVxyXG5cclxuXHRcdFx0dGhpcy5hZGREb29yKHgsIHkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbigpIHtcclxuXHRjb25zb2xlLmxvZyhcInJvb21cIiwgdGhpcy5feDEsIHRoaXMuX3kxLCB0aGlzLl94MiwgdGhpcy5feTIpO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmlzVmFsaWQgPSBmdW5jdGlvbihpc1dhbGxDYWxsYmFjaywgY2FuQmVEdWdDYWxsYmFjaykgeyBcclxuXHR2YXIgbGVmdCA9IHRoaXMuX3gxLTE7XHJcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcclxuXHR2YXIgdG9wID0gdGhpcy5feTEtMTtcclxuXHR2YXIgYm90dG9tID0gdGhpcy5feTIrMTtcclxuXHRcclxuXHRmb3IgKHZhciB4PWxlZnQ7IHg8PXJpZ2h0OyB4KyspIHtcclxuXHRcdGZvciAodmFyIHk9dG9wOyB5PD1ib3R0b207IHkrKykge1xyXG5cdFx0XHRpZiAoeCA9PSBsZWZ0IHx8IHggPT0gcmlnaHQgfHwgeSA9PSB0b3AgfHwgeSA9PSBib3R0b20pIHtcclxuXHRcdFx0XHRpZiAoIWlzV2FsbENhbGxiYWNrKHgsIHkpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmICghY2FuQmVEdWdDYWxsYmFjayh4LCB5KSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gZGlnQ2FsbGJhY2sgRGlnIGNhbGxiYWNrIHdpdGggYSBzaWduYXR1cmUgKHgsIHksIHZhbHVlKS4gVmFsdWVzOiAwID0gZW1wdHksIDEgPSB3YWxsLCAyID0gZG9vci4gTXVsdGlwbGUgZG9vcnMgYXJlIGFsbG93ZWQuXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHsgXHJcblx0dmFyIGxlZnQgPSB0aGlzLl94MS0xO1xyXG5cdHZhciByaWdodCA9IHRoaXMuX3gyKzE7XHJcblx0dmFyIHRvcCA9IHRoaXMuX3kxLTE7XHJcblx0dmFyIGJvdHRvbSA9IHRoaXMuX3kyKzE7XHJcblx0XHJcblx0dmFyIHZhbHVlID0gMDtcclxuXHRmb3IgKHZhciB4PWxlZnQ7IHg8PXJpZ2h0OyB4KyspIHtcclxuXHRcdGZvciAodmFyIHk9dG9wOyB5PD1ib3R0b207IHkrKykge1xyXG5cdFx0XHRpZiAoeCtcIixcIit5IGluIHRoaXMuX2Rvb3JzKSB7XHJcblx0XHRcdFx0dmFsdWUgPSAyO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHggPT0gbGVmdCB8fCB4ID09IHJpZ2h0IHx8IHkgPT0gdG9wIHx8IHkgPT0gYm90dG9tKSB7XHJcblx0XHRcdFx0dmFsdWUgPSAxO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhbHVlID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRkaWdDYWxsYmFjayh4LCB5LCB2YWx1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldENlbnRlciA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiBbTWF0aC5yb3VuZCgodGhpcy5feDEgKyB0aGlzLl94MikvMiksIE1hdGgucm91bmQoKHRoaXMuX3kxICsgdGhpcy5feTIpLzIpXTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5nZXRMZWZ0ID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3gxO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldFJpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuX3gyO1xyXG59O1xyXG5cclxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldFRvcCA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLl95MTtcclxufTtcclxuXHJcblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5nZXRCb3R0b20gPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5feTI7XHJcbn07XHJcblxyXG4vKipcclxuICogQGNsYXNzIENvcnJpZG9yXHJcbiAqIEBhdWdtZW50cyBST1QuTWFwLkZlYXR1cmVcclxuICogQHBhcmFtIHtpbnR9IHN0YXJ0WFxyXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRZXHJcbiAqIEBwYXJhbSB7aW50fSBlbmRYXHJcbiAqIEBwYXJhbSB7aW50fSBlbmRZXHJcbiAqL1xyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IgPSBmdW5jdGlvbihzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSkge1xyXG5cdHRoaXMuX3N0YXJ0WCA9IHN0YXJ0WDtcclxuXHR0aGlzLl9zdGFydFkgPSBzdGFydFk7XHJcblx0dGhpcy5fZW5kWCA9IGVuZFg7IFxyXG5cdHRoaXMuX2VuZFkgPSBlbmRZO1xyXG5cdHRoaXMuX2VuZHNXaXRoQVdhbGwgPSB0cnVlO1xyXG59O1xyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IuZXh0ZW5kKFJPVC5NYXAuRmVhdHVyZSk7XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IuY3JlYXRlUmFuZG9tQXQgPSBmdW5jdGlvbih4LCB5LCBkeCwgZHksIG9wdGlvbnMpIHtcclxuXHR2YXIgbWluID0gb3B0aW9ucy5jb3JyaWRvckxlbmd0aFswXTtcclxuXHR2YXIgbWF4ID0gb3B0aW9ucy5jb3JyaWRvckxlbmd0aFsxXTtcclxuXHR2YXIgbGVuZ3RoID0gUk9ULlJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IHRoaXMoeCwgeSwgeCArIGR4Kmxlbmd0aCwgeSArIGR5Kmxlbmd0aCk7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24oKSB7XHJcblx0Y29uc29sZS5sb2coXCJjb3JyaWRvclwiLCB0aGlzLl9zdGFydFgsIHRoaXMuX3N0YXJ0WSwgdGhpcy5fZW5kWCwgdGhpcy5fZW5kWSk7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmlzVmFsaWQgPSBmdW5jdGlvbihpc1dhbGxDYWxsYmFjaywgY2FuQmVEdWdDYWxsYmFjayl7IFxyXG5cdHZhciBzeCA9IHRoaXMuX3N0YXJ0WDtcclxuXHR2YXIgc3kgPSB0aGlzLl9zdGFydFk7XHJcblx0dmFyIGR4ID0gdGhpcy5fZW5kWC1zeDtcclxuXHR2YXIgZHkgPSB0aGlzLl9lbmRZLXN5O1xyXG5cdHZhciBsZW5ndGggPSAxICsgTWF0aC5tYXgoTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpO1xyXG5cdFxyXG5cdGlmIChkeCkgeyBkeCA9IGR4L01hdGguYWJzKGR4KTsgfVxyXG5cdGlmIChkeSkgeyBkeSA9IGR5L01hdGguYWJzKGR5KTsgfVxyXG5cdHZhciBueCA9IGR5O1xyXG5cdHZhciBueSA9IC1keDtcclxuXHRcclxuXHR2YXIgb2sgPSB0cnVlO1xyXG5cdGZvciAodmFyIGk9MDsgaTxsZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHggPSBzeCArIGkqZHg7XHJcblx0XHR2YXIgeSA9IHN5ICsgaSpkeTtcclxuXHJcblx0XHRpZiAoIWNhbkJlRHVnQ2FsbGJhY2soICAgICB4LCAgICAgIHkpKSB7IG9rID0gZmFsc2U7IH1cclxuXHRcdGlmICghaXNXYWxsQ2FsbGJhY2sgICh4ICsgbngsIHkgKyBueSkpIHsgb2sgPSBmYWxzZTsgfVxyXG5cdFx0aWYgKCFpc1dhbGxDYWxsYmFjayAgKHggLSBueCwgeSAtIG55KSkgeyBvayA9IGZhbHNlOyB9XHJcblx0XHRcclxuXHRcdGlmICghb2spIHtcclxuXHRcdFx0bGVuZ3RoID0gaTtcclxuXHRcdFx0dGhpcy5fZW5kWCA9IHgtZHg7XHJcblx0XHRcdHRoaXMuX2VuZFkgPSB5LWR5O1xyXG5cdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0LyoqXHJcblx0ICogSWYgdGhlIGxlbmd0aCBkZWdlbmVyYXRlZCwgdGhpcyBjb3JyaWRvciBtaWdodCBiZSBpbnZhbGlkXHJcblx0ICovXHJcblx0IFxyXG5cdC8qIG5vdCBzdXBwb3J0ZWQgKi9cclxuXHRpZiAobGVuZ3RoID09IDApIHsgcmV0dXJuIGZhbHNlOyB9IFxyXG5cdFxyXG5cdCAvKiBsZW5ndGggMSBhbGxvd2VkIG9ubHkgaWYgdGhlIG5leHQgc3BhY2UgaXMgZW1wdHkgKi9cclxuXHRpZiAobGVuZ3RoID09IDEgJiYgaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIFdlIGRvIG5vdCB3YW50IHRoZSBjb3JyaWRvciB0byBjcmFzaCBpbnRvIGEgY29ybmVyIG9mIGEgcm9vbTtcclxuXHQgKiBpZiBhbnkgb2YgdGhlIGVuZGluZyBjb3JuZXJzIGlzIGVtcHR5LCB0aGUgTisxdGggY2VsbCBvZiB0aGlzIGNvcnJpZG9yIG11c3QgYmUgZW1wdHkgdG9vLlxyXG5cdCAqIFxyXG5cdCAqIFNpdHVhdGlvbjpcclxuXHQgKiAjIyMjIyMjMVxyXG5cdCAqIC4uLi4uLi4/XHJcblx0ICogIyMjIyMjIzJcclxuXHQgKiBcclxuXHQgKiBUaGUgY29ycmlkb3Igd2FzIGR1ZyBmcm9tIGxlZnQgdG8gcmlnaHQuXHJcblx0ICogMSwgMiAtIHByb2JsZW1hdGljIGNvcm5lcnMsID8gPSBOKzF0aCBjZWxsIChub3QgZHVnKVxyXG5cdCAqL1xyXG5cdHZhciBmaXJzdENvcm5lckJhZCA9ICFpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHggKyBueCwgdGhpcy5fZW5kWSArIGR5ICsgbnkpO1xyXG5cdHZhciBzZWNvbmRDb3JuZXJCYWQgPSAhaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4IC0gbngsIHRoaXMuX2VuZFkgKyBkeSAtIG55KTtcclxuXHR0aGlzLl9lbmRzV2l0aEFXYWxsID0gaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpO1xyXG5cdGlmICgoZmlyc3RDb3JuZXJCYWQgfHwgc2Vjb25kQ29ybmVyQmFkKSAmJiB0aGlzLl9lbmRzV2l0aEFXYWxsKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuXHRyZXR1cm4gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaWdDYWxsYmFjayBEaWcgY2FsbGJhY2sgd2l0aCBhIHNpZ25hdHVyZSAoeCwgeSwgdmFsdWUpLiBWYWx1ZXM6IDAgPSBlbXB0eS5cclxuICovXHJcblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHsgXHJcblx0dmFyIHN4ID0gdGhpcy5fc3RhcnRYO1xyXG5cdHZhciBzeSA9IHRoaXMuX3N0YXJ0WTtcclxuXHR2YXIgZHggPSB0aGlzLl9lbmRYLXN4O1xyXG5cdHZhciBkeSA9IHRoaXMuX2VuZFktc3k7XHJcblx0dmFyIGxlbmd0aCA9IDErTWF0aC5tYXgoTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpO1xyXG5cdFxyXG5cdGlmIChkeCkgeyBkeCA9IGR4L01hdGguYWJzKGR4KTsgfVxyXG5cdGlmIChkeSkgeyBkeSA9IGR5L01hdGguYWJzKGR5KTsgfVxyXG5cdHZhciBueCA9IGR5O1xyXG5cdHZhciBueSA9IC1keDtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciB4ID0gc3ggKyBpKmR4O1xyXG5cdFx0dmFyIHkgPSBzeSArIGkqZHk7XHJcblx0XHRkaWdDYWxsYmFjayh4LCB5LCAwKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IucHJvdG90eXBlLmNyZWF0ZVByaW9yaXR5V2FsbHMgPSBmdW5jdGlvbihwcmlvcml0eVdhbGxDYWxsYmFjaykge1xyXG5cdGlmICghdGhpcy5fZW5kc1dpdGhBV2FsbCkgeyByZXR1cm47IH1cclxuXHJcblx0dmFyIHN4ID0gdGhpcy5fc3RhcnRYO1xyXG5cdHZhciBzeSA9IHRoaXMuX3N0YXJ0WTtcclxuXHJcblx0dmFyIGR4ID0gdGhpcy5fZW5kWC1zeDtcclxuXHR2YXIgZHkgPSB0aGlzLl9lbmRZLXN5O1xyXG5cdGlmIChkeCkgeyBkeCA9IGR4L01hdGguYWJzKGR4KTsgfVxyXG5cdGlmIChkeSkgeyBkeSA9IGR5L01hdGguYWJzKGR5KTsgfVxyXG5cdHZhciBueCA9IGR5O1xyXG5cdHZhciBueSA9IC1keDtcclxuXHJcblx0cHJpb3JpdHlXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpO1xyXG5cdHByaW9yaXR5V2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBueCwgdGhpcy5fZW5kWSArIG55KTtcclxuXHRwcmlvcml0eVdhbGxDYWxsYmFjayh0aGlzLl9lbmRYIC0gbngsIHRoaXMuX2VuZFkgLSBueSk7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgQmFzZSBub2lzZSBnZW5lcmF0b3JcclxuICovXHJcblJPVC5Ob2lzZSA9IGZ1bmN0aW9uKCkge1xyXG59O1xyXG5cclxuUk9ULk5vaXNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbih4LCB5KSB7fTtcclxuLyoqXHJcbiAqIEEgc2ltcGxlIDJkIGltcGxlbWVudGF0aW9uIG9mIHNpbXBsZXggbm9pc2UgYnkgT25kcmVqIFphcmFcclxuICpcclxuICogQmFzZWQgb24gYSBzcGVlZC1pbXByb3ZlZCBzaW1wbGV4IG5vaXNlIGFsZ29yaXRobSBmb3IgMkQsIDNEIGFuZCA0RCBpbiBKYXZhLlxyXG4gKiBXaGljaCBpcyBiYXNlZCBvbiBleGFtcGxlIGNvZGUgYnkgU3RlZmFuIEd1c3RhdnNvbiAoc3RlZ3VAaXRuLmxpdS5zZSkuXHJcbiAqIFdpdGggT3B0aW1pc2F0aW9ucyBieSBQZXRlciBFYXN0bWFuIChwZWFzdG1hbkBkcml6emxlLnN0YW5mb3JkLmVkdSkuXHJcbiAqIEJldHRlciByYW5rIG9yZGVyaW5nIG1ldGhvZCBieSBTdGVmYW4gR3VzdGF2c29uIGluIDIwMTIuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyAyRCBzaW1wbGV4IG5vaXNlIGdlbmVyYXRvclxyXG4gKiBAcGFyYW0ge2ludH0gW2dyYWRpZW50cz0yNTZdIFJhbmRvbSBncmFkaWVudHNcclxuICovXHJcblJPVC5Ob2lzZS5TaW1wbGV4ID0gZnVuY3Rpb24oZ3JhZGllbnRzKSB7XHJcblx0Uk9ULk5vaXNlLmNhbGwodGhpcyk7XHJcblxyXG5cdHRoaXMuX0YyID0gMC41ICogKE1hdGguc3FydCgzKSAtIDEpO1xyXG5cdHRoaXMuX0cyID0gKDMgLSBNYXRoLnNxcnQoMykpIC8gNjtcclxuXHJcblx0dGhpcy5fZ3JhZGllbnRzID0gW1xyXG5cdFx0WyAwLCAtMV0sXHJcblx0XHRbIDEsIC0xXSxcclxuXHRcdFsgMSwgIDBdLFxyXG5cdFx0WyAxLCAgMV0sXHJcblx0XHRbIDAsICAxXSxcclxuXHRcdFstMSwgIDFdLFxyXG5cdFx0Wy0xLCAgMF0sXHJcblx0XHRbLTEsIC0xXVxyXG5cdF07XHJcblxyXG5cdHZhciBwZXJtdXRhdGlvbnMgPSBbXTtcclxuXHR2YXIgY291bnQgPSBncmFkaWVudHMgfHwgMjU2O1xyXG5cdGZvciAodmFyIGk9MDtpPGNvdW50O2krKykgeyBwZXJtdXRhdGlvbnMucHVzaChpKTsgfVxyXG5cdHBlcm11dGF0aW9ucyA9IHBlcm11dGF0aW9ucy5yYW5kb21pemUoKTtcclxuXHJcblx0dGhpcy5fcGVybXMgPSBbXTtcclxuXHR0aGlzLl9pbmRleGVzID0gW107XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPDIqY291bnQ7aSsrKSB7XHJcblx0XHR0aGlzLl9wZXJtcy5wdXNoKHBlcm11dGF0aW9uc1tpICUgY291bnRdKTtcclxuXHRcdHRoaXMuX2luZGV4ZXMucHVzaCh0aGlzLl9wZXJtc1tpXSAlIHRoaXMuX2dyYWRpZW50cy5sZW5ndGgpO1xyXG5cdH1cclxuXHJcbn07XHJcblJPVC5Ob2lzZS5TaW1wbGV4LmV4dGVuZChST1QuTm9pc2UpO1xyXG5cclxuUk9ULk5vaXNlLlNpbXBsZXgucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHhpbiwgeWluKSB7XHJcblx0dmFyIHBlcm1zID0gdGhpcy5fcGVybXM7XHJcblx0dmFyIGluZGV4ZXMgPSB0aGlzLl9pbmRleGVzO1xyXG5cdHZhciBjb3VudCA9IHBlcm1zLmxlbmd0aC8yO1xyXG5cdHZhciBHMiA9IHRoaXMuX0cyO1xyXG5cclxuXHR2YXIgbjAgPTAsIG4xID0gMCwgbjIgPSAwLCBnaTsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXHJcblxyXG5cdC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cclxuXHR2YXIgcyA9ICh4aW4gKyB5aW4pICogdGhpcy5fRjI7IC8vIEhhaXJ5IGZhY3RvciBmb3IgMkRcclxuXHR2YXIgaSA9IE1hdGguZmxvb3IoeGluICsgcyk7XHJcblx0dmFyIGogPSBNYXRoLmZsb29yKHlpbiArIHMpO1xyXG5cdHZhciB0ID0gKGkgKyBqKSAqIEcyO1xyXG5cdHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSkgc3BhY2VcclxuXHR2YXIgWTAgPSBqIC0gdDtcclxuXHR2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cclxuXHR2YXIgeTAgPSB5aW4gLSBZMDtcclxuXHJcblx0Ly8gRm9yIHRoZSAyRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhbiBlcXVpbGF0ZXJhbCB0cmlhbmdsZS5cclxuXHQvLyBEZXRlcm1pbmUgd2hpY2ggc2ltcGxleCB3ZSBhcmUgaW4uXHJcblx0dmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xyXG5cdGlmICh4MCA+IHkwKSB7XHJcblx0XHRpMSA9IDE7XHJcblx0XHRqMSA9IDA7XHJcblx0fSBlbHNlIHsgLy8gbG93ZXIgdHJpYW5nbGUsIFhZIG9yZGVyOiAoMCwwKS0+KDEsMCktPigxLDEpXHJcblx0XHRpMSA9IDA7XHJcblx0XHRqMSA9IDE7XHJcblx0fSAvLyB1cHBlciB0cmlhbmdsZSwgWVggb3JkZXI6ICgwLDApLT4oMCwxKS0+KDEsMSlcclxuXHJcblx0Ly8gQSBzdGVwIG9mICgxLDApIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jKSBpbiAoeCx5KSwgYW5kXHJcblx0Ly8gYSBzdGVwIG9mICgwLDEpIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jKSBpbiAoeCx5KSwgd2hlcmVcclxuXHQvLyBjID0gKDMtc3FydCgzKSkvNlxyXG5cdHZhciB4MSA9IHgwIC0gaTEgKyBHMjsgLy8gT2Zmc2V0cyBmb3IgbWlkZGxlIGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcclxuXHR2YXIgeTEgPSB5MCAtIGoxICsgRzI7XHJcblx0dmFyIHgyID0geDAgLSAxICsgMipHMjsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXHJcblx0dmFyIHkyID0geTAgLSAxICsgMipHMjtcclxuXHJcblx0Ly8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSB0aHJlZSBzaW1wbGV4IGNvcm5lcnNcclxuXHR2YXIgaWkgPSBpLm1vZChjb3VudCk7XHJcblx0dmFyIGpqID0gai5tb2QoY291bnQpO1xyXG5cclxuXHQvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXHJcblx0dmFyIHQwID0gMC41IC0geDAqeDAgLSB5MCp5MDtcclxuXHRpZiAodDAgPj0gMCkge1xyXG5cdFx0dDAgKj0gdDA7XHJcblx0XHRnaSA9IGluZGV4ZXNbaWkrcGVybXNbampdXTtcclxuXHRcdHZhciBncmFkID0gdGhpcy5fZ3JhZGllbnRzW2dpXTtcclxuXHRcdG4wID0gdDAgKiB0MCAqIChncmFkWzBdICogeDAgKyBncmFkWzFdICogeTApO1xyXG5cdH1cclxuXHRcclxuXHR2YXIgdDEgPSAwLjUgLSB4MSp4MSAtIHkxKnkxO1xyXG5cdGlmICh0MSA+PSAwKSB7XHJcblx0XHR0MSAqPSB0MTtcclxuXHRcdGdpID0gaW5kZXhlc1tpaStpMStwZXJtc1tqaitqMV1dO1xyXG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xyXG5cdFx0bjEgPSB0MSAqIHQxICogKGdyYWRbMF0gKiB4MSArIGdyYWRbMV0gKiB5MSk7XHJcblx0fVxyXG5cdFxyXG5cdHZhciB0MiA9IDAuNSAtIHgyKngyIC0geTIqeTI7XHJcblx0aWYgKHQyID49IDApIHtcclxuXHRcdHQyICo9IHQyO1xyXG5cdFx0Z2kgPSBpbmRleGVzW2lpKzErcGVybXNbamorMV1dO1xyXG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xyXG5cdFx0bjIgPSB0MiAqIHQyICogKGdyYWRbMF0gKiB4MiArIGdyYWRbMV0gKiB5Mik7XHJcblx0fVxyXG5cclxuXHQvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXHJcblx0Ly8gVGhlIHJlc3VsdCBpcyBzY2FsZWQgdG8gcmV0dXJuIHZhbHVlcyBpbiB0aGUgaW50ZXJ2YWwgWy0xLDFdLlxyXG5cdHJldHVybiA3MCAqIChuMCArIG4xICsgbjIpO1xyXG59XHJcbi8qKlxyXG4gKiBAY2xhc3MgQWJzdHJhY3QgRk9WIGFsZ29yaXRobVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaWdodFBhc3Nlc0NhbGxiYWNrIERvZXMgdGhlIGxpZ2h0IHBhc3MgdGhyb3VnaCB4LHk/XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5PThdIDQvNi84XHJcbiAqL1xyXG5ST1QuRk9WID0gZnVuY3Rpb24obGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdHRoaXMuX2xpZ2h0UGFzc2VzID0gbGlnaHRQYXNzZXNDYWxsYmFjaztcclxuXHR0aGlzLl9vcHRpb25zID0ge1xyXG5cdFx0dG9wb2xvZ3k6IDhcclxuXHR9O1xyXG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSAzNjAtZGVncmVlIGNpcmNsZVxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5ST1QuRk9WLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHt9O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhbGwgbmVpZ2hib3JzIGluIGEgY29uY2VudHJpYyByaW5nXHJcbiAqIEBwYXJhbSB7aW50fSBjeCBjZW50ZXIteFxyXG4gKiBAcGFyYW0ge2ludH0gY3kgY2VudGVyLXlcclxuICogQHBhcmFtIHtpbnR9IHIgcmFuZ2VcclxuICovXHJcblJPVC5GT1YucHJvdG90eXBlLl9nZXRDaXJjbGUgPSBmdW5jdGlvbihjeCwgY3ksIHIpIHtcclxuXHR2YXIgcmVzdWx0ID0gW107XHJcblx0dmFyIGRpcnMsIGNvdW50RmFjdG9yLCBzdGFydE9mZnNldDtcclxuXHJcblx0c3dpdGNoICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5KSB7XHJcblx0XHRjYXNlIDQ6XHJcblx0XHRcdGNvdW50RmFjdG9yID0gMTtcclxuXHRcdFx0c3RhcnRPZmZzZXQgPSBbMCwgMV07XHJcblx0XHRcdGRpcnMgPSBbXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bN10sXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bMV0sXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bM10sXHJcblx0XHRcdFx0Uk9ULkRJUlNbOF1bNV1cclxuXHRcdFx0XTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgNjpcclxuXHRcdFx0ZGlycyA9IFJPVC5ESVJTWzZdO1xyXG5cdFx0XHRjb3VudEZhY3RvciA9IDE7XHJcblx0XHRcdHN0YXJ0T2Zmc2V0ID0gWy0xLCAxXTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgODpcclxuXHRcdFx0ZGlycyA9IFJPVC5ESVJTWzRdO1xyXG5cdFx0XHRjb3VudEZhY3RvciA9IDI7XHJcblx0XHRcdHN0YXJ0T2Zmc2V0ID0gWy0xLCAxXTtcclxuXHRcdGJyZWFrO1xyXG5cdH1cclxuXHJcblx0Lyogc3RhcnRpbmcgbmVpZ2hib3IgKi9cclxuXHR2YXIgeCA9IGN4ICsgc3RhcnRPZmZzZXRbMF0qcjtcclxuXHR2YXIgeSA9IGN5ICsgc3RhcnRPZmZzZXRbMV0qcjtcclxuXHJcblx0LyogY2lyY2xlICovXHJcblx0Zm9yICh2YXIgaT0wO2k8ZGlycy5sZW5ndGg7aSsrKSB7XHJcblx0XHRmb3IgKHZhciBqPTA7ajxyKmNvdW50RmFjdG9yO2orKykge1xyXG5cdFx0XHRyZXN1bHQucHVzaChbeCwgeV0pO1xyXG5cdFx0XHR4ICs9IGRpcnNbaV1bMF07XHJcblx0XHRcdHkgKz0gZGlyc1tpXVsxXTtcclxuXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIERpc2NyZXRlIHNoYWRvd2Nhc3RpbmcgYWxnb3JpdGhtLiBPYnNvbGV0ZWQgYnkgUHJlY2lzZSBzaGFkb3djYXN0aW5nLlxyXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxyXG4gKi9cclxuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0Uk9ULkZPVi5jYWxsKHRoaXMsIGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG59O1xyXG5ST1QuRk9WLkRpc2NyZXRlU2hhZG93Y2FzdGluZy5leHRlbmQoUk9ULkZPVik7XHJcblxyXG4vKipcclxuICogQHNlZSBST1QuRk9WI2NvbXB1dGVcclxuICovXHJcblJPVC5GT1YuRGlzY3JldGVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHtcclxuXHR2YXIgY2VudGVyID0gdGhpcy5fY29vcmRzO1xyXG5cdHZhciBtYXAgPSB0aGlzLl9tYXA7XHJcblxyXG5cdC8qIHRoaXMgcGxhY2UgaXMgYWx3YXlzIHZpc2libGUgKi9cclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHJcblx0Lyogc3RhbmRpbmcgaW4gYSBkYXJrIHBsYWNlLiBGSVhNRSBpcyB0aGlzIGEgZ29vZCBpZGVhPyAgKi9cclxuXHRpZiAoIXRoaXMuX2xpZ2h0UGFzc2VzKHgsIHkpKSB7IHJldHVybjsgfVxyXG5cdFxyXG5cdC8qIHN0YXJ0IGFuZCBlbmQgYW5nbGVzICovXHJcblx0dmFyIERBVEEgPSBbXTtcclxuXHRcclxuXHR2YXIgQSwgQiwgY3gsIGN5LCBibG9ja3M7XHJcblxyXG5cdC8qIGFuYWx5emUgc3Vycm91bmRpbmcgY2VsbHMgaW4gY29uY2VudHJpYyByaW5ncywgc3RhcnRpbmcgZnJvbSB0aGUgY2VudGVyICovXHJcblx0Zm9yICh2YXIgcj0xOyByPD1SOyByKyspIHtcclxuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXRDaXJjbGUoeCwgeSwgcik7XHJcblx0XHR2YXIgYW5nbGUgPSAzNjAgLyBuZWlnaGJvcnMubGVuZ3RoO1xyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPG5laWdoYm9ycy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdGN4ID0gbmVpZ2hib3JzW2ldWzBdO1xyXG5cdFx0XHRjeSA9IG5laWdoYm9yc1tpXVsxXTtcclxuXHRcdFx0QSA9IGFuZ2xlICogKGkgLSAwLjUpO1xyXG5cdFx0XHRCID0gQSArIGFuZ2xlO1xyXG5cdFx0XHRcclxuXHRcdFx0YmxvY2tzID0gIXRoaXMuX2xpZ2h0UGFzc2VzKGN4LCBjeSk7XHJcblx0XHRcdGlmICh0aGlzLl92aXNpYmxlQ29vcmRzKE1hdGguZmxvb3IoQSksIE1hdGguY2VpbChCKSwgYmxvY2tzLCBEQVRBKSkgeyBjYWxsYmFjayhjeCwgY3ksIHIsIDEpOyB9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoREFUQS5sZW5ndGggPT0gMiAmJiBEQVRBWzBdID09IDAgJiYgREFUQVsxXSA9PSAzNjApIHsgcmV0dXJuOyB9IC8qIGN1dG9mZj8gKi9cclxuXHJcblx0XHR9IC8qIGZvciBhbGwgY2VsbHMgaW4gdGhpcyByaW5nICovXHJcblx0fSAvKiBmb3IgYWxsIHJpbmdzICovXHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtpbnR9IEEgc3RhcnQgYW5nbGVcclxuICogQHBhcmFtIHtpbnR9IEIgZW5kIGFuZ2xlXHJcbiAqIEBwYXJhbSB7Ym9vbH0gYmxvY2tzIERvZXMgY3VycmVudCBjZWxsIGJsb2NrIHZpc2liaWxpdHk/XHJcbiAqIEBwYXJhbSB7aW50W11bXX0gREFUQSBzaGFkb3dlZCBhbmdsZSBwYWlyc1xyXG4gKi9cclxuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl92aXNpYmxlQ29vcmRzID0gZnVuY3Rpb24oQSwgQiwgYmxvY2tzLCBEQVRBKSB7XHJcblx0aWYgKEEgPCAwKSB7IFxyXG5cdFx0dmFyIHYxID0gYXJndW1lbnRzLmNhbGxlZSgwLCBCLCBibG9ja3MsIERBVEEpO1xyXG5cdFx0dmFyIHYyID0gYXJndW1lbnRzLmNhbGxlZSgzNjArQSwgMzYwLCBibG9ja3MsIERBVEEpO1xyXG5cdFx0cmV0dXJuIHYxIHx8IHYyO1xyXG5cdH1cclxuXHRcclxuXHR2YXIgaW5kZXggPSAwO1xyXG5cdHdoaWxlIChpbmRleCA8IERBVEEubGVuZ3RoICYmIERBVEFbaW5kZXhdIDwgQSkgeyBpbmRleCsrOyB9XHJcblx0XHJcblx0aWYgKGluZGV4ID09IERBVEEubGVuZ3RoKSB7IC8qIGNvbXBsZXRlbHkgbmV3IHNoYWRvdyAqL1xyXG5cdFx0aWYgKGJsb2NrcykgeyBEQVRBLnB1c2goQSwgQik7IH0gXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0dmFyIGNvdW50ID0gMDtcclxuXHRcclxuXHRpZiAoaW5kZXggJSAyKSB7IC8qIHRoaXMgc2hhZG93IHN0YXJ0cyBpbiBhbiBleGlzdGluZyBzaGFkb3csIG9yIHdpdGhpbiBpdHMgZW5kaW5nIGJvdW5kYXJ5ICovXHJcblx0XHR3aGlsZSAoaW5kZXggPCBEQVRBLmxlbmd0aCAmJiBEQVRBW2luZGV4XSA8IEIpIHtcclxuXHRcdFx0aW5kZXgrKztcclxuXHRcdFx0Y291bnQrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKGNvdW50ID09IDApIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcclxuXHRcdGlmIChibG9ja3MpIHsgXHJcblx0XHRcdGlmIChjb3VudCAlIDIpIHtcclxuXHRcdFx0XHREQVRBLnNwbGljZShpbmRleC1jb3VudCwgY291bnQsIEIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblxyXG5cdH0gZWxzZSB7IC8qIHRoaXMgc2hhZG93IHN0YXJ0cyBvdXRzaWRlIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2l0aGluIGEgc3RhcnRpbmcgYm91bmRhcnkgKi9cclxuXHRcdHdoaWxlIChpbmRleCA8IERBVEEubGVuZ3RoICYmIERBVEFbaW5kZXhdIDwgQikge1xyXG5cdFx0XHRpbmRleCsrO1xyXG5cdFx0XHRjb3VudCsrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKiB2aXNpYmxlIHdoZW4gb3V0c2lkZSBhbiBleGlzdGluZyBzaGFkb3csIG9yIHdoZW4gb3ZlcmxhcHBpbmcgKi9cclxuXHRcdGlmIChBID09IERBVEFbaW5kZXgtY291bnRdICYmIGNvdW50ID09IDEpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcclxuXHRcdGlmIChibG9ja3MpIHsgXHJcblx0XHRcdGlmIChjb3VudCAlIDIpIHtcclxuXHRcdFx0XHREQVRBLnNwbGljZShpbmRleC1jb3VudCwgY291bnQsIEEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCwgQSwgQik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFx0XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJlY2lzZSBzaGFkb3djYXN0aW5nIGFsZ29yaXRobVxyXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxyXG4gKi9cclxuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZyA9IGZ1bmN0aW9uKGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHRST1QuRk9WLmNhbGwodGhpcywgbGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucyk7XHJcbn07XHJcblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcuZXh0ZW5kKFJPVC5GT1YpO1xyXG5cclxuLyoqXHJcbiAqIEBzZWUgUk9ULkZPViNjb21wdXRlXHJcbiAqL1xyXG5ST1QuRk9WLlByZWNpc2VTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHtcclxuXHQvKiB0aGlzIHBsYWNlIGlzIGFsd2F5cyB2aXNpYmxlICovXHJcblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XHJcblxyXG5cdC8qIHN0YW5kaW5nIGluIGEgZGFyayBwbGFjZS4gRklYTUUgaXMgdGhpcyBhIGdvb2QgaWRlYT8gICovXHJcblx0aWYgKCF0aGlzLl9saWdodFBhc3Nlcyh4LCB5KSkgeyByZXR1cm47IH1cclxuXHRcclxuXHQvKiBsaXN0IG9mIGFsbCBzaGFkb3dzICovXHJcblx0dmFyIFNIQURPV1MgPSBbXTtcclxuXHRcclxuXHR2YXIgY3gsIGN5LCBibG9ja3MsIEExLCBBMiwgdmlzaWJpbGl0eTtcclxuXHJcblx0LyogYW5hbHl6ZSBzdXJyb3VuZGluZyBjZWxscyBpbiBjb25jZW50cmljIHJpbmdzLCBzdGFydGluZyBmcm9tIHRoZSBjZW50ZXIgKi9cclxuXHRmb3IgKHZhciByPTE7IHI8PVI7IHIrKykge1xyXG5cdFx0dmFyIG5laWdoYm9ycyA9IHRoaXMuX2dldENpcmNsZSh4LCB5LCByKTtcclxuXHRcdHZhciBuZWlnaGJvckNvdW50ID0gbmVpZ2hib3JzLmxlbmd0aDtcclxuXHJcblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvckNvdW50O2krKykge1xyXG5cdFx0XHRjeCA9IG5laWdoYm9yc1tpXVswXTtcclxuXHRcdFx0Y3kgPSBuZWlnaGJvcnNbaV1bMV07XHJcblx0XHRcdC8qIHNoaWZ0IGhhbGYtYW4tYW5nbGUgYmFja3dhcmRzIHRvIG1haW50YWluIGNvbnNpc3RlbmN5IG9mIDAtdGggY2VsbHMgKi9cclxuXHRcdFx0QTEgPSBbaSA/IDIqaS0xIDogMipuZWlnaGJvckNvdW50LTEsIDIqbmVpZ2hib3JDb3VudF07XHJcblx0XHRcdEEyID0gWzIqaSsxLCAyKm5laWdoYm9yQ291bnRdOyBcclxuXHRcdFx0XHJcblx0XHRcdGJsb2NrcyA9ICF0aGlzLl9saWdodFBhc3NlcyhjeCwgY3kpO1xyXG5cdFx0XHR2aXNpYmlsaXR5ID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KEExLCBBMiwgYmxvY2tzLCBTSEFET1dTKTtcclxuXHRcdFx0aWYgKHZpc2liaWxpdHkpIHsgY2FsbGJhY2soY3gsIGN5LCByLCB2aXNpYmlsaXR5KTsgfVxyXG5cclxuXHRcdFx0aWYgKFNIQURPV1MubGVuZ3RoID09IDIgJiYgU0hBRE9XU1swXVswXSA9PSAwICYmIFNIQURPV1NbMV1bMF0gPT0gU0hBRE9XU1sxXVsxXSkgeyByZXR1cm47IH0gLyogY3V0b2ZmPyAqL1xyXG5cclxuXHRcdH0gLyogZm9yIGFsbCBjZWxscyBpbiB0aGlzIHJpbmcgKi9cclxuXHR9IC8qIGZvciBhbGwgcmluZ3MgKi9cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge2ludFsyXX0gQTEgYXJjIHN0YXJ0XHJcbiAqIEBwYXJhbSB7aW50WzJdfSBBMiBhcmMgZW5kXHJcbiAqIEBwYXJhbSB7Ym9vbH0gYmxvY2tzIERvZXMgY3VycmVudCBhcmMgYmxvY2sgdmlzaWJpbGl0eT9cclxuICogQHBhcmFtIHtpbnRbXVtdfSBTSEFET1dTIGxpc3Qgb2YgYWN0aXZlIHNoYWRvd3NcclxuICovXHJcblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl9jaGVja1Zpc2liaWxpdHkgPSBmdW5jdGlvbihBMSwgQTIsIGJsb2NrcywgU0hBRE9XUykge1xyXG5cdGlmIChBMVswXSA+IEEyWzBdKSB7IC8qIHNwbGl0IGludG8gdHdvIHN1Yi1hcmNzICovXHJcblx0XHR2YXIgdjEgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoQTEsIFtBMVsxXSwgQTFbMV1dLCBibG9ja3MsIFNIQURPV1MpO1xyXG5cdFx0dmFyIHYyID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KFswLCAxXSwgQTIsIGJsb2NrcywgU0hBRE9XUyk7XHJcblx0XHRyZXR1cm4gKHYxK3YyKS8yO1xyXG5cdH1cclxuXHJcblx0LyogaW5kZXgxOiBmaXJzdCBzaGFkb3cgPj0gQTEgKi9cclxuXHR2YXIgaW5kZXgxID0gMCwgZWRnZTEgPSBmYWxzZTtcclxuXHR3aGlsZSAoaW5kZXgxIDwgU0hBRE9XUy5sZW5ndGgpIHtcclxuXHRcdHZhciBvbGQgPSBTSEFET1dTW2luZGV4MV07XHJcblx0XHR2YXIgZGlmZiA9IG9sZFswXSpBMVsxXSAtIEExWzBdKm9sZFsxXTtcclxuXHRcdGlmIChkaWZmID49IDApIHsgLyogb2xkID49IEExICovXHJcblx0XHRcdGlmIChkaWZmID09IDAgJiYgIShpbmRleDEgJSAyKSkgeyBlZGdlMSA9IHRydWU7IH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHRpbmRleDErKztcclxuXHR9XHJcblxyXG5cdC8qIGluZGV4MjogbGFzdCBzaGFkb3cgPD0gQTIgKi9cclxuXHR2YXIgaW5kZXgyID0gU0hBRE9XUy5sZW5ndGgsIGVkZ2UyID0gZmFsc2U7XHJcblx0d2hpbGUgKGluZGV4Mi0tKSB7XHJcblx0XHR2YXIgb2xkID0gU0hBRE9XU1tpbmRleDJdO1xyXG5cdFx0dmFyIGRpZmYgPSBBMlswXSpvbGRbMV0gLSBvbGRbMF0qQTJbMV07XHJcblx0XHRpZiAoZGlmZiA+PSAwKSB7IC8qIG9sZCA8PSBBMiAqL1xyXG5cdFx0XHRpZiAoZGlmZiA9PSAwICYmIChpbmRleDIgJSAyKSkgeyBlZGdlMiA9IHRydWU7IH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgdmlzaWJsZSA9IHRydWU7XHJcblx0aWYgKGluZGV4MSA9PSBpbmRleDIgJiYgKGVkZ2UxIHx8IGVkZ2UyKSkgeyAgLyogc3Vic2V0IG9mIGV4aXN0aW5nIHNoYWRvdywgb25lIG9mIHRoZSBlZGdlcyBtYXRjaCAqL1xyXG5cdFx0dmlzaWJsZSA9IGZhbHNlOyBcclxuXHR9IGVsc2UgaWYgKGVkZ2UxICYmIGVkZ2UyICYmIGluZGV4MSsxPT1pbmRleDIgJiYgKGluZGV4MiAlIDIpKSB7IC8qIGNvbXBsZXRlbHkgZXF1aXZhbGVudCB3aXRoIGV4aXN0aW5nIHNoYWRvdyAqL1xyXG5cdFx0dmlzaWJsZSA9IGZhbHNlO1xyXG5cdH0gZWxzZSBpZiAoaW5kZXgxID4gaW5kZXgyICYmIChpbmRleDEgJSAyKSkgeyAvKiBzdWJzZXQgb2YgZXhpc3Rpbmcgc2hhZG93LCBub3QgdG91Y2hpbmcgKi9cclxuXHRcdHZpc2libGUgPSBmYWxzZTtcclxuXHR9XHJcblx0XHJcblx0aWYgKCF2aXNpYmxlKSB7IHJldHVybiAwOyB9IC8qIGZhc3QgY2FzZTogbm90IHZpc2libGUgKi9cclxuXHRcclxuXHR2YXIgdmlzaWJsZUxlbmd0aCwgUDtcclxuXHJcblx0LyogY29tcHV0ZSB0aGUgbGVuZ3RoIG9mIHZpc2libGUgYXJjLCBhZGp1c3QgbGlzdCBvZiBzaGFkb3dzIChpZiBibG9ja2luZykgKi9cclxuXHR2YXIgcmVtb3ZlID0gaW5kZXgyLWluZGV4MSsxO1xyXG5cdGlmIChyZW1vdmUgJSAyKSB7XHJcblx0XHRpZiAoaW5kZXgxICUgMikgeyAvKiBmaXJzdCBlZGdlIHdpdGhpbiBleGlzdGluZyBzaGFkb3csIHNlY29uZCBvdXRzaWRlICovXHJcblx0XHRcdHZhciBQID0gU0hBRE9XU1tpbmRleDFdO1xyXG5cdFx0XHR2aXNpYmxlTGVuZ3RoID0gKEEyWzBdKlBbMV0gLSBQWzBdKkEyWzFdKSAvIChQWzFdICogQTJbMV0pO1xyXG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMik7IH1cclxuXHRcdH0gZWxzZSB7IC8qIHNlY29uZCBlZGdlIHdpdGhpbiBleGlzdGluZyBzaGFkb3csIGZpcnN0IG91dHNpZGUgKi9cclxuXHRcdFx0dmFyIFAgPSBTSEFET1dTW2luZGV4Ml07XHJcblx0XHRcdHZpc2libGVMZW5ndGggPSAoUFswXSpBMVsxXSAtIEExWzBdKlBbMV0pIC8gKEExWzFdICogUFsxXSk7XHJcblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUsIEExKTsgfVxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHRpZiAoaW5kZXgxICUgMikgeyAvKiBib3RoIGVkZ2VzIHdpdGhpbiBleGlzdGluZyBzaGFkb3dzICovXHJcblx0XHRcdHZhciBQMSA9IFNIQURPV1NbaW5kZXgxXTtcclxuXHRcdFx0dmFyIFAyID0gU0hBRE9XU1tpbmRleDJdO1xyXG5cdFx0XHR2aXNpYmxlTGVuZ3RoID0gKFAyWzBdKlAxWzFdIC0gUDFbMF0qUDJbMV0pIC8gKFAxWzFdICogUDJbMV0pO1xyXG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlKTsgfVxyXG5cdFx0fSBlbHNlIHsgLyogYm90aCBlZGdlcyBvdXRzaWRlIGV4aXN0aW5nIHNoYWRvd3MgKi9cclxuXHRcdFx0aWYgKGJsb2NrcykgeyBTSEFET1dTLnNwbGljZShpbmRleDEsIHJlbW92ZSwgQTEsIEEyKTsgfVxyXG5cdFx0XHRyZXR1cm4gMTsgLyogd2hvbGUgYXJjIHZpc2libGUhICovXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgYXJjTGVuZ3RoID0gKEEyWzBdKkExWzFdIC0gQTFbMF0qQTJbMV0pIC8gKEExWzFdICogQTJbMV0pO1xyXG5cclxuXHRyZXR1cm4gdmlzaWJsZUxlbmd0aC9hcmNMZW5ndGg7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgUmVjdXJzaXZlIHNoYWRvd2Nhc3RpbmcgYWxnb3JpdGhtXHJcbiAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIDQvOCB0b3BvbG9naWVzLCBub3QgaGV4YWdvbmFsLlxyXG4gKiBCYXNlZCBvbiBQZXRlciBIYXJraW5zJyBpbXBsZW1lbnRhdGlvbiBvZiBCasO2cm4gQmVyZ3N0csO2bSdzIGFsZ29yaXRobSBkZXNjcmliZWQgaGVyZTogaHR0cDovL3d3dy5yb2d1ZWJhc2luLmNvbS9pbmRleC5waHA/dGl0bGU9Rk9WX3VzaW5nX3JlY3Vyc2l2ZV9zaGFkb3djYXN0aW5nXHJcbiAqIEBhdWdtZW50cyBST1QuRk9WXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0Uk9ULkZPVi5jYWxsKHRoaXMsIGxpZ2h0UGFzc2VzQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG59O1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuZXh0ZW5kKFJPVC5GT1YpO1xyXG5cclxuLyoqIE9jdGFudHMgdXNlZCBmb3IgdHJhbnNsYXRpbmcgcmVjdXJzaXZlIHNoYWRvd2Nhc3Rpbmcgb2Zmc2V0cyAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UUyA9IFtcclxuXHRbLTEsICAwLCAgMCwgIDFdLFxyXG5cdFsgMCwgLTEsICAxLCAgMF0sXHJcblx0WyAwLCAtMSwgLTEsICAwXSxcclxuXHRbLTEsICAwLCAgMCwgLTFdLFxyXG5cdFsgMSwgIDAsICAwLCAtMV0sXHJcblx0WyAwLCAgMSwgLTEsICAwXSxcclxuXHRbIDAsICAxLCAgMSwgIDBdLFxyXG5cdFsgMSwgIDAsICAwLCAgMV1cclxuXTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgMzYwLWRlZ3JlZSBjaXJjbGVcclxuICogQHBhcmFtIHtpbnR9IHhcclxuICogQHBhcmFtIHtpbnR9IHlcclxuICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oeCwgeSwgUiwgY2FsbGJhY2spIHtcclxuXHQvL1lvdSBjYW4gYWx3YXlzIHNlZSB5b3VyIG93biB0aWxlXHJcblx0Y2FsbGJhY2soeCwgeSwgMCwgMSk7XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbaV0sIFIsIGNhbGxiYWNrKTtcclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDE4MC1kZWdyZWUgYXJjXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcclxuICogQHBhcmFtIHtpbnR9IGRpciBEaXJlY3Rpb24gdG8gbG9vayBpbiAoZXhwcmVzc2VkIGluIGEgUk9ULkRJUlMgdmFsdWUpO1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKi9cclxuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5jb21wdXRlMTgwID0gZnVuY3Rpb24oeCwgeSwgUiwgZGlyLCBjYWxsYmFjaykge1xyXG5cdC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHR2YXIgcHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMSArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyBvY3RhbnQgdG8gcmVuZGVyIGEgZnVsbCAxODAgZGVncmVlc1xyXG5cdHZhciBuZXh0UHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMiArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyB0d28gb2N0YW50cyB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXHJcblx0dmFyIG5leHRPY3RhbnQgPSAoZGlyKyAxICsgOCkgJSA4OyAvL05lZWQgdG8gZ3JhYiB0byBuZXh0IG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW25leHRQcmV2aW91c09jdGFudF0sIFIsIGNhbGxiYWNrKTtcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbcHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW2Rpcl0sIFIsIGNhbGxiYWNrKTtcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbbmV4dE9jdGFudF0sIFIsIGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgOTAtZGVncmVlIGFyY1xyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7aW50fSBkaXIgRGlyZWN0aW9uIHRvIGxvb2sgaW4gKGV4cHJlc3NlZCBpbiBhIFJPVC5ESVJTIHZhbHVlKTtcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcclxuICovXHJcblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuY29tcHV0ZTkwID0gZnVuY3Rpb24oeCwgeSwgUiwgZGlyLCBjYWxsYmFjaykge1xyXG5cdC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcclxuXHRjYWxsYmFjayh4LCB5LCAwLCAxKTtcclxuXHR2YXIgcHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMSArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyBvY3RhbnQgdG8gcmVuZGVyIGEgZnVsbCA5MCBkZWdyZWVzXHJcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW2Rpcl0sIFIsIGNhbGxiYWNrKTtcclxuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbcHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVuZGVyIG9uZSBvY3RhbnQgKDQ1LWRlZ3JlZSBhcmMpIG9mIHRoZSB2aWV3c2hlZFxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge2ludH0gb2N0YW50IE9jdGFudCB0byBiZSByZW5kZXJlZFxyXG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl9yZW5kZXJPY3RhbnQgPSBmdW5jdGlvbih4LCB5LCBvY3RhbnQsIFIsIGNhbGxiYWNrKSB7XHJcblx0Ly9SYWRpdXMgaW5jcmVtZW50ZWQgYnkgMSB0byBwcm92aWRlIHNhbWUgY292ZXJhZ2UgYXJlYSBhcyBvdGhlciBzaGFkb3djYXN0aW5nIHJhZGl1c2VzXHJcblx0dGhpcy5fY2FzdFZpc2liaWxpdHkoeCwgeSwgMSwgMS4wLCAwLjAsIFIgKyAxLCBvY3RhbnRbMF0sIG9jdGFudFsxXSwgb2N0YW50WzJdLCBvY3RhbnRbM10sIGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBY3R1YWxseSBjYWxjdWxhdGVzIHRoZSB2aXNpYmlsaXR5XHJcbiAqIEBwYXJhbSB7aW50fSBzdGFydFggVGhlIHN0YXJ0aW5nIFggY29vcmRpbmF0ZVxyXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRZIFRoZSBzdGFydGluZyBZIGNvb3JkaW5hdGVcclxuICogQHBhcmFtIHtpbnR9IHJvdyBUaGUgcm93IHRvIHJlbmRlclxyXG4gKiBAcGFyYW0ge2Zsb2F0fSB2aXNTbG9wZVN0YXJ0IFRoZSBzbG9wZSB0byBzdGFydCBhdFxyXG4gKiBAcGFyYW0ge2Zsb2F0fSB2aXNTbG9wZUVuZCBUaGUgc2xvcGUgdG8gZW5kIGF0XHJcbiAqIEBwYXJhbSB7aW50fSByYWRpdXMgVGhlIHJhZGl1cyB0byByZWFjaCBvdXQgdG9cclxuICogQHBhcmFtIHtpbnR9IHh4IFxyXG4gKiBAcGFyYW0ge2ludH0geHkgXHJcbiAqIEBwYXJhbSB7aW50fSB5eCBcclxuICogQHBhcmFtIHtpbnR9IHl5IFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gdXNlIHdoZW4gd2UgaGl0IGEgYmxvY2sgdGhhdCBpcyB2aXNpYmxlXHJcbiAqL1xyXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl9jYXN0VmlzaWJpbGl0eSA9IGZ1bmN0aW9uKHN0YXJ0WCwgc3RhcnRZLCByb3csIHZpc1Nsb3BlU3RhcnQsIHZpc1Nsb3BlRW5kLCByYWRpdXMsIHh4LCB4eSwgeXgsIHl5LCBjYWxsYmFjaykge1xyXG5cdGlmKHZpc1Nsb3BlU3RhcnQgPCB2aXNTbG9wZUVuZCkgeyByZXR1cm47IH1cclxuXHRmb3IodmFyIGkgPSByb3c7IGkgPD0gcmFkaXVzOyBpKyspIHtcclxuXHRcdHZhciBkeCA9IC1pIC0gMTtcclxuXHRcdHZhciBkeSA9IC1pO1xyXG5cdFx0dmFyIGJsb2NrZWQgPSBmYWxzZTtcclxuXHRcdHZhciBuZXdTdGFydCA9IDA7XHJcblxyXG5cdFx0Ly8nUm93JyBjb3VsZCBiZSBjb2x1bW4sIG5hbWVzIGhlcmUgYXNzdW1lIG9jdGFudCAwIGFuZCB3b3VsZCBiZSBmbGlwcGVkIGZvciBoYWxmIHRoZSBvY3RhbnRzXHJcblx0XHR3aGlsZShkeCA8PSAwKSB7XHJcblx0XHRcdGR4ICs9IDE7XHJcblxyXG5cdFx0XHQvL1RyYW5zbGF0ZSBmcm9tIHJlbGF0aXZlIGNvb3JkaW5hdGVzIHRvIG1hcCBjb29yZGluYXRlc1xyXG5cdFx0XHR2YXIgbWFwWCA9IHN0YXJ0WCArIGR4ICogeHggKyBkeSAqIHh5O1xyXG5cdFx0XHR2YXIgbWFwWSA9IHN0YXJ0WSArIGR4ICogeXggKyBkeSAqIHl5O1xyXG5cclxuXHRcdFx0Ly9SYW5nZSBvZiB0aGUgcm93XHJcblx0XHRcdHZhciBzbG9wZVN0YXJ0ID0gKGR4IC0gMC41KSAvIChkeSArIDAuNSk7XHJcblx0XHRcdHZhciBzbG9wZUVuZCA9IChkeCArIDAuNSkgLyAoZHkgLSAwLjUpO1xyXG5cdFx0XHJcblx0XHRcdC8vSWdub3JlIGlmIG5vdCB5ZXQgYXQgbGVmdCBlZGdlIG9mIE9jdGFudFxyXG5cdFx0XHRpZihzbG9wZUVuZCA+IHZpc1Nsb3BlU3RhcnQpIHsgY29udGludWU7IH1cclxuXHRcdFx0XHJcblx0XHRcdC8vRG9uZSBpZiBwYXN0IHJpZ2h0IGVkZ2VcclxuXHRcdFx0aWYoc2xvcGVTdGFydCA8IHZpc1Nsb3BlRW5kKSB7IGJyZWFrOyB9XHJcblx0XHRcdFx0XHJcblx0XHRcdC8vSWYgaXQncyBpbiByYW5nZSwgaXQncyB2aXNpYmxlXHJcblx0XHRcdGlmKChkeCAqIGR4ICsgZHkgKiBkeSkgPCAocmFkaXVzICogcmFkaXVzKSkge1xyXG5cdFx0XHRcdGNhbGxiYWNrKG1hcFgsIG1hcFksIGksIDEpO1xyXG5cdFx0XHR9XHJcblx0XHJcblx0XHRcdGlmKCFibG9ja2VkKSB7XHJcblx0XHRcdFx0Ly9JZiB0aWxlIGlzIGEgYmxvY2tpbmcgdGlsZSwgY2FzdCBhcm91bmQgaXRcclxuXHRcdFx0XHRpZighdGhpcy5fbGlnaHRQYXNzZXMobWFwWCwgbWFwWSkgJiYgaSA8IHJhZGl1cykge1xyXG5cdFx0XHRcdFx0YmxvY2tlZCA9IHRydWU7XHJcblx0XHRcdFx0XHR0aGlzLl9jYXN0VmlzaWJpbGl0eShzdGFydFgsIHN0YXJ0WSwgaSArIDEsIHZpc1Nsb3BlU3RhcnQsIHNsb3BlU3RhcnQsIHJhZGl1cywgeHgsIHh5LCB5eCwgeXksIGNhbGxiYWNrKTtcclxuXHRcdFx0XHRcdG5ld1N0YXJ0ID0gc2xvcGVFbmQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vS2VlcCBuYXJyb3dpbmcgaWYgc2Nhbm5pbmcgYWNyb3NzIGEgYmxvY2tcclxuXHRcdFx0XHRpZighdGhpcy5fbGlnaHRQYXNzZXMobWFwWCwgbWFwWSkpIHtcclxuXHRcdFx0XHRcdG5ld1N0YXJ0ID0gc2xvcGVFbmQ7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRcdC8vQmxvY2sgaGFzIGVuZGVkXHJcblx0XHRcdFx0YmxvY2tlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHZpc1Nsb3BlU3RhcnQgPSBuZXdTdGFydDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYoYmxvY2tlZCkgeyBicmVhazsgfVxyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBuYW1lc3BhY2UgQ29sb3Igb3BlcmF0aW9uc1xyXG4gKi9cclxuUk9ULkNvbG9yID0ge1xyXG5cdGZyb21TdHJpbmc6IGZ1bmN0aW9uKHN0cikge1xyXG5cdFx0dmFyIGNhY2hlZCwgcjtcclxuXHRcdGlmIChzdHIgaW4gdGhpcy5fY2FjaGUpIHtcclxuXHRcdFx0Y2FjaGVkID0gdGhpcy5fY2FjaGVbc3RyXTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmIChzdHIuY2hhckF0KDApID09IFwiI1wiKSB7IC8qIGhleCByZ2IgKi9cclxuXHJcblx0XHRcdFx0dmFyIHZhbHVlcyA9IHN0ci5tYXRjaCgvWzAtOWEtZl0vZ2kpLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiBwYXJzZUludCh4LCAxNik7IH0pO1xyXG5cdFx0XHRcdGlmICh2YWx1ZXMubGVuZ3RoID09IDMpIHtcclxuXHRcdFx0XHRcdGNhY2hlZCA9IHZhbHVlcy5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4geCoxNzsgfSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhbHVlc1tpKzFdICs9IDE2KnZhbHVlc1tpXTtcclxuXHRcdFx0XHRcdFx0dmFsdWVzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNhY2hlZCA9IHZhbHVlcztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKChyID0gc3RyLm1hdGNoKC9yZ2JcXCgoWzAtOSwgXSspXFwpL2kpKSkgeyAvKiBkZWNpbWFsIHJnYiAqL1xyXG5cdFx0XHRcdGNhY2hlZCA9IHJbMV0uc3BsaXQoL1xccyosXFxzKi8pLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiBwYXJzZUludCh4KTsgfSk7XHJcblx0XHRcdH0gZWxzZSB7IC8qIGh0bWwgbmFtZSAqL1xyXG5cdFx0XHRcdGNhY2hlZCA9IFswLCAwLCAwXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5fY2FjaGVbc3RyXSA9IGNhY2hlZDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY2FjaGVkLnNsaWNlKCk7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQWRkIHR3byBvciBtb3JlIGNvbG9yc1xyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRhZGQ6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gY29sb3IxLnNsaWNlKCk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRmb3IgKHZhciBqPTE7ajxhcmd1bWVudHMubGVuZ3RoO2orKykge1xyXG5cdFx0XHRcdHJlc3VsdFtpXSArPSBhcmd1bWVudHNbal1baV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQWRkIHR3byBvciBtb3JlIGNvbG9ycywgTU9ESUZJRVMgRklSU1QgQVJHVU1FTlRcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0YWRkXzogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0Y29sb3IxW2ldICs9IGFyZ3VtZW50c1tqXVtpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvbG9yMTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBNdWx0aXBseSAobWl4KSB0d28gb3IgbW9yZSBjb2xvcnNcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0bXVsdGlwbHk6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gY29sb3IxLnNsaWNlKCk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRmb3IgKHZhciBqPTE7ajxhcmd1bWVudHMubGVuZ3RoO2orKykge1xyXG5cdFx0XHRcdHJlc3VsdFtpXSAqPSBhcmd1bWVudHNbal1baV0gLyAyNTU7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVzdWx0W2ldID0gTWF0aC5yb3VuZChyZXN1bHRbaV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBNdWx0aXBseSAobWl4KSB0d28gb3IgbW9yZSBjb2xvcnMsIE1PRElGSUVTIEZJUlNUIEFSR1VNRU5UXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHJldHVybnMge251bWJlcltdfVxyXG5cdCAqL1xyXG5cdG11bHRpcGx5XzogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XHJcblx0XHRcdFx0Y29sb3IxW2ldICo9IGFyZ3VtZW50c1tqXVtpXSAvIDI1NTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb2xvcjFbaV0gPSBNYXRoLnJvdW5kKGNvbG9yMVtpXSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29sb3IxO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEludGVycG9sYXRlIChibGVuZCkgdHdvIGNvbG9ycyB3aXRoIGEgZ2l2ZW4gZmFjdG9yXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHBhcmFtIHtmbG9hdH0gW2ZhY3Rvcj0wLjVdIDAuLjFcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0aW50ZXJwb2xhdGU6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCBmYWN0b3IpIHtcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgeyBmYWN0b3IgPSAwLjU7IH1cclxuXHRcdHZhciByZXN1bHQgPSBjb2xvcjEuc2xpY2UoKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdHJlc3VsdFtpXSA9IE1hdGgucm91bmQocmVzdWx0W2ldICsgZmFjdG9yKihjb2xvcjJbaV0tY29sb3IxW2ldKSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEludGVycG9sYXRlIChibGVuZCkgdHdvIGNvbG9ycyB3aXRoIGEgZ2l2ZW4gZmFjdG9yIGluIEhTTCBtb2RlXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXHJcblx0ICogQHBhcmFtIHtmbG9hdH0gW2ZhY3Rvcj0wLjVdIDAuLjFcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0aW50ZXJwb2xhdGVIU0w6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCBmYWN0b3IpIHtcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgeyBmYWN0b3IgPSAwLjU7IH1cclxuXHRcdHZhciBoc2wxID0gdGhpcy5yZ2IyaHNsKGNvbG9yMSk7XHJcblx0XHR2YXIgaHNsMiA9IHRoaXMucmdiMmhzbChjb2xvcjIpO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0aHNsMVtpXSArPSBmYWN0b3IqKGhzbDJbaV0taHNsMVtpXSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcy5oc2wycmdiKGhzbDEpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZSBhIG5ldyByYW5kb20gY29sb3IgYmFzZWQgb24gdGhpcyBvbmVcclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGRpZmYgU2V0IG9mIHN0YW5kYXJkIGRldmlhdGlvbnNcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0cmFuZG9taXplOiBmdW5jdGlvbihjb2xvciwgZGlmZikge1xyXG5cdFx0aWYgKCEoZGlmZiBpbnN0YW5jZW9mIEFycmF5KSkgeyBkaWZmID0gTWF0aC5yb3VuZChST1QuUk5HLmdldE5vcm1hbCgwLCBkaWZmKSk7IH1cclxuXHRcdHZhciByZXN1bHQgPSBjb2xvci5zbGljZSgpO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcclxuXHRcdFx0cmVzdWx0W2ldICs9IChkaWZmIGluc3RhbmNlb2YgQXJyYXkgPyBNYXRoLnJvdW5kKFJPVC5STkcuZ2V0Tm9ybWFsKDAsIGRpZmZbaV0pKSA6IGRpZmYpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDb252ZXJ0cyBhbiBSR0IgY29sb3IgdmFsdWUgdG8gSFNMLiBFeHBlY3RzIDAuLjI1NSBpbnB1dHMsIHByb2R1Y2VzIDAuLjEgb3V0cHV0cy5cclxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuXHQgKi9cclxuXHRyZ2IyaHNsOiBmdW5jdGlvbihjb2xvcikge1xyXG5cdFx0dmFyIHIgPSBjb2xvclswXS8yNTU7XHJcblx0XHR2YXIgZyA9IGNvbG9yWzFdLzI1NTtcclxuXHRcdHZhciBiID0gY29sb3JbMl0vMjU1O1xyXG5cclxuXHRcdHZhciBtYXggPSBNYXRoLm1heChyLCBnLCBiKSwgbWluID0gTWF0aC5taW4ociwgZywgYik7XHJcblx0XHR2YXIgaCwgcywgbCA9IChtYXggKyBtaW4pIC8gMjtcclxuXHJcblx0XHRpZiAobWF4ID09IG1pbikge1xyXG5cdFx0XHRoID0gcyA9IDA7IC8vIGFjaHJvbWF0aWNcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBkID0gbWF4IC0gbWluO1xyXG5cdFx0XHRzID0gKGwgPiAwLjUgPyBkIC8gKDIgLSBtYXggLSBtaW4pIDogZCAvIChtYXggKyBtaW4pKTtcclxuXHRcdFx0c3dpdGNoKG1heCkge1xyXG5cdFx0XHRcdGNhc2UgcjogaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApOyBicmVhaztcclxuXHRcdFx0XHRjYXNlIGc6IGggPSAoYiAtIHIpIC8gZCArIDI7IGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgYjogaCA9IChyIC0gZykgLyBkICsgNDsgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0aCAvPSA2O1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBbaCwgcywgbF07XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogQ29udmVydHMgYW4gSFNMIGNvbG9yIHZhbHVlIHRvIFJHQi4gRXhwZWN0cyAwLi4xIGlucHV0cywgcHJvZHVjZXMgMC4uMjU1IG91dHB1dHMuXHJcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3JcclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcblx0ICovXHJcblx0aHNsMnJnYjogZnVuY3Rpb24oY29sb3IpIHtcclxuXHRcdHZhciBsID0gY29sb3JbMl07XHJcblxyXG5cdFx0aWYgKGNvbG9yWzFdID09IDApIHtcclxuXHRcdFx0bCA9IE1hdGgucm91bmQobCoyNTUpO1xyXG5cdFx0XHRyZXR1cm4gW2wsIGwsIGxdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGh1ZTJyZ2IgPSBmdW5jdGlvbihwLCBxLCB0KSB7XHJcblx0XHRcdFx0aWYgKHQgPCAwKSB0ICs9IDE7XHJcblx0XHRcdFx0aWYgKHQgPiAxKSB0IC09IDE7XHJcblx0XHRcdFx0aWYgKHQgPCAxLzYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xyXG5cdFx0XHRcdGlmICh0IDwgMS8yKSByZXR1cm4gcTtcclxuXHRcdFx0XHRpZiAodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcclxuXHRcdFx0XHRyZXR1cm4gcDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHMgPSBjb2xvclsxXTtcclxuXHRcdFx0dmFyIHEgPSAobCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcyk7XHJcblx0XHRcdHZhciBwID0gMiAqIGwgLSBxO1xyXG5cdFx0XHR2YXIgciA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0gKyAxLzMpO1xyXG5cdFx0XHR2YXIgZyA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0pO1xyXG5cdFx0XHR2YXIgYiA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0gLSAxLzMpO1xyXG5cdFx0XHRyZXR1cm4gW01hdGgucm91bmQocioyNTUpLCBNYXRoLnJvdW5kKGcqMjU1KSwgTWF0aC5yb3VuZChiKjI1NSldO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHRvUkdCOiBmdW5jdGlvbihjb2xvcikge1xyXG5cdFx0cmV0dXJuIFwicmdiKFwiICsgdGhpcy5fY2xhbXAoY29sb3JbMF0pICsgXCIsXCIgKyB0aGlzLl9jbGFtcChjb2xvclsxXSkgKyBcIixcIiArIHRoaXMuX2NsYW1wKGNvbG9yWzJdKSArIFwiKVwiO1xyXG5cdH0sXHJcblxyXG5cdHRvSGV4OiBmdW5jdGlvbihjb2xvcikge1xyXG5cdFx0dmFyIHBhcnRzID0gW107XHJcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xyXG5cdFx0XHRwYXJ0cy5wdXNoKHRoaXMuX2NsYW1wKGNvbG9yW2ldKS50b1N0cmluZygxNikubHBhZChcIjBcIiwgMikpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIFwiI1wiICsgcGFydHMuam9pbihcIlwiKTtcclxuXHR9LFxyXG5cclxuXHRfY2xhbXA6IGZ1bmN0aW9uKG51bSkge1xyXG5cdFx0aWYgKG51bSA8IDApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9IGVsc2UgaWYgKG51bSA+IDI1NSkge1xyXG5cdFx0XHRyZXR1cm4gMjU1O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIG51bTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfY2FjaGU6IHtcclxuXHRcdFwiYmxhY2tcIjogWzAsMCwwXSxcclxuXHRcdFwibmF2eVwiOiBbMCwwLDEyOF0sXHJcblx0XHRcImRhcmtibHVlXCI6IFswLDAsMTM5XSxcclxuXHRcdFwibWVkaXVtYmx1ZVwiOiBbMCwwLDIwNV0sXHJcblx0XHRcImJsdWVcIjogWzAsMCwyNTVdLFxyXG5cdFx0XCJkYXJrZ3JlZW5cIjogWzAsMTAwLDBdLFxyXG5cdFx0XCJncmVlblwiOiBbMCwxMjgsMF0sXHJcblx0XHRcInRlYWxcIjogWzAsMTI4LDEyOF0sXHJcblx0XHRcImRhcmtjeWFuXCI6IFswLDEzOSwxMzldLFxyXG5cdFx0XCJkZWVwc2t5Ymx1ZVwiOiBbMCwxOTEsMjU1XSxcclxuXHRcdFwiZGFya3R1cnF1b2lzZVwiOiBbMCwyMDYsMjA5XSxcclxuXHRcdFwibWVkaXVtc3ByaW5nZ3JlZW5cIjogWzAsMjUwLDE1NF0sXHJcblx0XHRcImxpbWVcIjogWzAsMjU1LDBdLFxyXG5cdFx0XCJzcHJpbmdncmVlblwiOiBbMCwyNTUsMTI3XSxcclxuXHRcdFwiYXF1YVwiOiBbMCwyNTUsMjU1XSxcclxuXHRcdFwiY3lhblwiOiBbMCwyNTUsMjU1XSxcclxuXHRcdFwibWlkbmlnaHRibHVlXCI6IFsyNSwyNSwxMTJdLFxyXG5cdFx0XCJkb2RnZXJibHVlXCI6IFszMCwxNDQsMjU1XSxcclxuXHRcdFwiZm9yZXN0Z3JlZW5cIjogWzM0LDEzOSwzNF0sXHJcblx0XHRcInNlYWdyZWVuXCI6IFs0NiwxMzksODddLFxyXG5cdFx0XCJkYXJrc2xhdGVncmF5XCI6IFs0Nyw3OSw3OV0sXHJcblx0XHRcImRhcmtzbGF0ZWdyZXlcIjogWzQ3LDc5LDc5XSxcclxuXHRcdFwibGltZWdyZWVuXCI6IFs1MCwyMDUsNTBdLFxyXG5cdFx0XCJtZWRpdW1zZWFncmVlblwiOiBbNjAsMTc5LDExM10sXHJcblx0XHRcInR1cnF1b2lzZVwiOiBbNjQsMjI0LDIwOF0sXHJcblx0XHRcInJveWFsYmx1ZVwiOiBbNjUsMTA1LDIyNV0sXHJcblx0XHRcInN0ZWVsYmx1ZVwiOiBbNzAsMTMwLDE4MF0sXHJcblx0XHRcImRhcmtzbGF0ZWJsdWVcIjogWzcyLDYxLDEzOV0sXHJcblx0XHRcIm1lZGl1bXR1cnF1b2lzZVwiOiBbNzIsMjA5LDIwNF0sXHJcblx0XHRcImluZGlnb1wiOiBbNzUsMCwxMzBdLFxyXG5cdFx0XCJkYXJrb2xpdmVncmVlblwiOiBbODUsMTA3LDQ3XSxcclxuXHRcdFwiY2FkZXRibHVlXCI6IFs5NSwxNTgsMTYwXSxcclxuXHRcdFwiY29ybmZsb3dlcmJsdWVcIjogWzEwMCwxNDksMjM3XSxcclxuXHRcdFwibWVkaXVtYXF1YW1hcmluZVwiOiBbMTAyLDIwNSwxNzBdLFxyXG5cdFx0XCJkaW1ncmF5XCI6IFsxMDUsMTA1LDEwNV0sXHJcblx0XHRcImRpbWdyZXlcIjogWzEwNSwxMDUsMTA1XSxcclxuXHRcdFwic2xhdGVibHVlXCI6IFsxMDYsOTAsMjA1XSxcclxuXHRcdFwib2xpdmVkcmFiXCI6IFsxMDcsMTQyLDM1XSxcclxuXHRcdFwic2xhdGVncmF5XCI6IFsxMTIsMTI4LDE0NF0sXHJcblx0XHRcInNsYXRlZ3JleVwiOiBbMTEyLDEyOCwxNDRdLFxyXG5cdFx0XCJsaWdodHNsYXRlZ3JheVwiOiBbMTE5LDEzNiwxNTNdLFxyXG5cdFx0XCJsaWdodHNsYXRlZ3JleVwiOiBbMTE5LDEzNiwxNTNdLFxyXG5cdFx0XCJtZWRpdW1zbGF0ZWJsdWVcIjogWzEyMywxMDQsMjM4XSxcclxuXHRcdFwibGF3bmdyZWVuXCI6IFsxMjQsMjUyLDBdLFxyXG5cdFx0XCJjaGFydHJldXNlXCI6IFsxMjcsMjU1LDBdLFxyXG5cdFx0XCJhcXVhbWFyaW5lXCI6IFsxMjcsMjU1LDIxMl0sXHJcblx0XHRcIm1hcm9vblwiOiBbMTI4LDAsMF0sXHJcblx0XHRcInB1cnBsZVwiOiBbMTI4LDAsMTI4XSxcclxuXHRcdFwib2xpdmVcIjogWzEyOCwxMjgsMF0sXHJcblx0XHRcImdyYXlcIjogWzEyOCwxMjgsMTI4XSxcclxuXHRcdFwiZ3JleVwiOiBbMTI4LDEyOCwxMjhdLFxyXG5cdFx0XCJza3libHVlXCI6IFsxMzUsMjA2LDIzNV0sXHJcblx0XHRcImxpZ2h0c2t5Ymx1ZVwiOiBbMTM1LDIwNiwyNTBdLFxyXG5cdFx0XCJibHVldmlvbGV0XCI6IFsxMzgsNDMsMjI2XSxcclxuXHRcdFwiZGFya3JlZFwiOiBbMTM5LDAsMF0sXHJcblx0XHRcImRhcmttYWdlbnRhXCI6IFsxMzksMCwxMzldLFxyXG5cdFx0XCJzYWRkbGVicm93blwiOiBbMTM5LDY5LDE5XSxcclxuXHRcdFwiZGFya3NlYWdyZWVuXCI6IFsxNDMsMTg4LDE0M10sXHJcblx0XHRcImxpZ2h0Z3JlZW5cIjogWzE0NCwyMzgsMTQ0XSxcclxuXHRcdFwibWVkaXVtcHVycGxlXCI6IFsxNDcsMTEyLDIxNl0sXHJcblx0XHRcImRhcmt2aW9sZXRcIjogWzE0OCwwLDIxMV0sXHJcblx0XHRcInBhbGVncmVlblwiOiBbMTUyLDI1MSwxNTJdLFxyXG5cdFx0XCJkYXJrb3JjaGlkXCI6IFsxNTMsNTAsMjA0XSxcclxuXHRcdFwieWVsbG93Z3JlZW5cIjogWzE1NCwyMDUsNTBdLFxyXG5cdFx0XCJzaWVubmFcIjogWzE2MCw4Miw0NV0sXHJcblx0XHRcImJyb3duXCI6IFsxNjUsNDIsNDJdLFxyXG5cdFx0XCJkYXJrZ3JheVwiOiBbMTY5LDE2OSwxNjldLFxyXG5cdFx0XCJkYXJrZ3JleVwiOiBbMTY5LDE2OSwxNjldLFxyXG5cdFx0XCJsaWdodGJsdWVcIjogWzE3MywyMTYsMjMwXSxcclxuXHRcdFwiZ3JlZW55ZWxsb3dcIjogWzE3MywyNTUsNDddLFxyXG5cdFx0XCJwYWxldHVycXVvaXNlXCI6IFsxNzUsMjM4LDIzOF0sXHJcblx0XHRcImxpZ2h0c3RlZWxibHVlXCI6IFsxNzYsMTk2LDIyMl0sXHJcblx0XHRcInBvd2RlcmJsdWVcIjogWzE3NiwyMjQsMjMwXSxcclxuXHRcdFwiZmlyZWJyaWNrXCI6IFsxNzgsMzQsMzRdLFxyXG5cdFx0XCJkYXJrZ29sZGVucm9kXCI6IFsxODQsMTM0LDExXSxcclxuXHRcdFwibWVkaXVtb3JjaGlkXCI6IFsxODYsODUsMjExXSxcclxuXHRcdFwicm9zeWJyb3duXCI6IFsxODgsMTQzLDE0M10sXHJcblx0XHRcImRhcmtraGFraVwiOiBbMTg5LDE4MywxMDddLFxyXG5cdFx0XCJzaWx2ZXJcIjogWzE5MiwxOTIsMTkyXSxcclxuXHRcdFwibWVkaXVtdmlvbGV0cmVkXCI6IFsxOTksMjEsMTMzXSxcclxuXHRcdFwiaW5kaWFucmVkXCI6IFsyMDUsOTIsOTJdLFxyXG5cdFx0XCJwZXJ1XCI6IFsyMDUsMTMzLDYzXSxcclxuXHRcdFwiY2hvY29sYXRlXCI6IFsyMTAsMTA1LDMwXSxcclxuXHRcdFwidGFuXCI6IFsyMTAsMTgwLDE0MF0sXHJcblx0XHRcImxpZ2h0Z3JheVwiOiBbMjExLDIxMSwyMTFdLFxyXG5cdFx0XCJsaWdodGdyZXlcIjogWzIxMSwyMTEsMjExXSxcclxuXHRcdFwicGFsZXZpb2xldHJlZFwiOiBbMjE2LDExMiwxNDddLFxyXG5cdFx0XCJ0aGlzdGxlXCI6IFsyMTYsMTkxLDIxNl0sXHJcblx0XHRcIm9yY2hpZFwiOiBbMjE4LDExMiwyMTRdLFxyXG5cdFx0XCJnb2xkZW5yb2RcIjogWzIxOCwxNjUsMzJdLFxyXG5cdFx0XCJjcmltc29uXCI6IFsyMjAsMjAsNjBdLFxyXG5cdFx0XCJnYWluc2Jvcm9cIjogWzIyMCwyMjAsMjIwXSxcclxuXHRcdFwicGx1bVwiOiBbMjIxLDE2MCwyMjFdLFxyXG5cdFx0XCJidXJseXdvb2RcIjogWzIyMiwxODQsMTM1XSxcclxuXHRcdFwibGlnaHRjeWFuXCI6IFsyMjQsMjU1LDI1NV0sXHJcblx0XHRcImxhdmVuZGVyXCI6IFsyMzAsMjMwLDI1MF0sXHJcblx0XHRcImRhcmtzYWxtb25cIjogWzIzMywxNTAsMTIyXSxcclxuXHRcdFwidmlvbGV0XCI6IFsyMzgsMTMwLDIzOF0sXHJcblx0XHRcInBhbGVnb2xkZW5yb2RcIjogWzIzOCwyMzIsMTcwXSxcclxuXHRcdFwibGlnaHRjb3JhbFwiOiBbMjQwLDEyOCwxMjhdLFxyXG5cdFx0XCJraGFraVwiOiBbMjQwLDIzMCwxNDBdLFxyXG5cdFx0XCJhbGljZWJsdWVcIjogWzI0MCwyNDgsMjU1XSxcclxuXHRcdFwiaG9uZXlkZXdcIjogWzI0MCwyNTUsMjQwXSxcclxuXHRcdFwiYXp1cmVcIjogWzI0MCwyNTUsMjU1XSxcclxuXHRcdFwic2FuZHlicm93blwiOiBbMjQ0LDE2NCw5Nl0sXHJcblx0XHRcIndoZWF0XCI6IFsyNDUsMjIyLDE3OV0sXHJcblx0XHRcImJlaWdlXCI6IFsyNDUsMjQ1LDIyMF0sXHJcblx0XHRcIndoaXRlc21va2VcIjogWzI0NSwyNDUsMjQ1XSxcclxuXHRcdFwibWludGNyZWFtXCI6IFsyNDUsMjU1LDI1MF0sXHJcblx0XHRcImdob3N0d2hpdGVcIjogWzI0OCwyNDgsMjU1XSxcclxuXHRcdFwic2FsbW9uXCI6IFsyNTAsMTI4LDExNF0sXHJcblx0XHRcImFudGlxdWV3aGl0ZVwiOiBbMjUwLDIzNSwyMTVdLFxyXG5cdFx0XCJsaW5lblwiOiBbMjUwLDI0MCwyMzBdLFxyXG5cdFx0XCJsaWdodGdvbGRlbnJvZHllbGxvd1wiOiBbMjUwLDI1MCwyMTBdLFxyXG5cdFx0XCJvbGRsYWNlXCI6IFsyNTMsMjQ1LDIzMF0sXHJcblx0XHRcInJlZFwiOiBbMjU1LDAsMF0sXHJcblx0XHRcImZ1Y2hzaWFcIjogWzI1NSwwLDI1NV0sXHJcblx0XHRcIm1hZ2VudGFcIjogWzI1NSwwLDI1NV0sXHJcblx0XHRcImRlZXBwaW5rXCI6IFsyNTUsMjAsMTQ3XSxcclxuXHRcdFwib3JhbmdlcmVkXCI6IFsyNTUsNjksMF0sXHJcblx0XHRcInRvbWF0b1wiOiBbMjU1LDk5LDcxXSxcclxuXHRcdFwiaG90cGlua1wiOiBbMjU1LDEwNSwxODBdLFxyXG5cdFx0XCJjb3JhbFwiOiBbMjU1LDEyNyw4MF0sXHJcblx0XHRcImRhcmtvcmFuZ2VcIjogWzI1NSwxNDAsMF0sXHJcblx0XHRcImxpZ2h0c2FsbW9uXCI6IFsyNTUsMTYwLDEyMl0sXHJcblx0XHRcIm9yYW5nZVwiOiBbMjU1LDE2NSwwXSxcclxuXHRcdFwibGlnaHRwaW5rXCI6IFsyNTUsMTgyLDE5M10sXHJcblx0XHRcInBpbmtcIjogWzI1NSwxOTIsMjAzXSxcclxuXHRcdFwiZ29sZFwiOiBbMjU1LDIxNSwwXSxcclxuXHRcdFwicGVhY2hwdWZmXCI6IFsyNTUsMjE4LDE4NV0sXHJcblx0XHRcIm5hdmFqb3doaXRlXCI6IFsyNTUsMjIyLDE3M10sXHJcblx0XHRcIm1vY2Nhc2luXCI6IFsyNTUsMjI4LDE4MV0sXHJcblx0XHRcImJpc3F1ZVwiOiBbMjU1LDIyOCwxOTZdLFxyXG5cdFx0XCJtaXN0eXJvc2VcIjogWzI1NSwyMjgsMjI1XSxcclxuXHRcdFwiYmxhbmNoZWRhbG1vbmRcIjogWzI1NSwyMzUsMjA1XSxcclxuXHRcdFwicGFwYXlhd2hpcFwiOiBbMjU1LDIzOSwyMTNdLFxyXG5cdFx0XCJsYXZlbmRlcmJsdXNoXCI6IFsyNTUsMjQwLDI0NV0sXHJcblx0XHRcInNlYXNoZWxsXCI6IFsyNTUsMjQ1LDIzOF0sXHJcblx0XHRcImNvcm5zaWxrXCI6IFsyNTUsMjQ4LDIyMF0sXHJcblx0XHRcImxlbW9uY2hpZmZvblwiOiBbMjU1LDI1MCwyMDVdLFxyXG5cdFx0XCJmbG9yYWx3aGl0ZVwiOiBbMjU1LDI1MCwyNDBdLFxyXG5cdFx0XCJzbm93XCI6IFsyNTUsMjUwLDI1MF0sXHJcblx0XHRcInllbGxvd1wiOiBbMjU1LDI1NSwwXSxcclxuXHRcdFwibGlnaHR5ZWxsb3dcIjogWzI1NSwyNTUsMjI0XSxcclxuXHRcdFwiaXZvcnlcIjogWzI1NSwyNTUsMjQwXSxcclxuXHRcdFwid2hpdGVcIjogWzI1NSwyNTUsMjU1XVxyXG5cdH1cclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBMaWdodGluZyBjb21wdXRhdGlvbiwgYmFzZWQgb24gYSB0cmFkaXRpb25hbCBGT1YgZm9yIG11bHRpcGxlIGxpZ2h0IHNvdXJjZXMgYW5kIG11bHRpcGxlIHBhc3Nlcy5cclxuICogQHBhcmFtIHtmdW5jdGlvbn0gcmVmbGVjdGl2aXR5Q2FsbGJhY2sgQ2FsbGJhY2sgdG8gcmV0cmlldmUgY2VsbCByZWZsZWN0aXZpdHkgKDAuLjEpXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnBhc3Nlcz0xXSBOdW1iZXIgb2YgcGFzc2VzLiAxIGVxdWFscyB0byBzaW1wbGUgRk9WIG9mIGFsbCBsaWdodCBzb3VyY2VzLCA+MSBtZWFucyBhICpoaWdobHkgc2ltcGxpZmllZCogcmFkaW9zaXR5LWxpa2UgYWxnb3JpdGhtLlxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMuZW1pc3Npb25UaHJlc2hvbGQ9MTAwXSBDZWxscyB3aXRoIGVtaXNzaXZpdHkgPiB0aHJlc2hvbGQgd2lsbCBiZSB0cmVhdGVkIGFzIGxpZ2h0IHNvdXJjZSBpbiB0aGUgbmV4dCBwYXNzLlxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucmFuZ2U9MTBdIE1heCBsaWdodCByYW5nZVxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nID0gZnVuY3Rpb24ocmVmbGVjdGl2aXR5Q2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHR0aGlzLl9yZWZsZWN0aXZpdHlDYWxsYmFjayA9IHJlZmxlY3Rpdml0eUNhbGxiYWNrO1xyXG5cdHRoaXMuX29wdGlvbnMgPSB7XHJcblx0XHRwYXNzZXM6IDEsXHJcblx0XHRlbWlzc2lvblRocmVzaG9sZDogMTAwLFxyXG5cdFx0cmFuZ2U6IDEwXHJcblx0fTtcclxuXHR0aGlzLl9mb3YgPSBudWxsO1xyXG5cclxuXHR0aGlzLl9saWdodHMgPSB7fTtcclxuXHR0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZSA9IHt9O1xyXG5cdHRoaXMuX2ZvdkNhY2hlID0ge307XHJcblxyXG5cdHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGp1c3Qgb3B0aW9ucyBhdCBydW50aW1lXHJcbiAqIEBzZWUgUk9ULkxpZ2h0aW5nXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHRpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJhbmdlKSB7IHRoaXMucmVzZXQoKTsgfVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCB0aGUgdXNlZCBGaWVsZC1PZi1WaWV3IGFsZ29cclxuICogQHBhcmFtIHtST1QuRk9WfSBmb3ZcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuc2V0Rk9WID0gZnVuY3Rpb24oZm92KSB7XHJcblx0dGhpcy5fZm92ID0gZm92O1xyXG5cdHRoaXMuX2ZvdkNhY2hlID0ge307XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IChvciByZW1vdmUpIGEgbGlnaHQgc291cmNlXHJcbiAqIEBwYXJhbSB7aW50fSB4XHJcbiAqIEBwYXJhbSB7aW50fSB5XHJcbiAqIEBwYXJhbSB7bnVsbCB8fCBzdHJpbmcgfHwgbnVtYmVyWzNdfSBjb2xvclxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5zZXRMaWdodCA9IGZ1bmN0aW9uKHgsIHksIGNvbG9yKSB7XHJcbiAgdmFyIGtleSA9IHggKyBcIixcIiArIHk7XHJcblxyXG4gIGlmIChjb2xvcikge1xyXG4gICAgdGhpcy5fbGlnaHRzW2tleV0gPSAodHlwZW9mKGNvbG9yKSA9PSBcInN0cmluZ1wiID8gUk9ULkNvbG9yLmZyb21TdHJpbmcoY29sb3IpIDogY29sb3IpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkZWxldGUgdGhpcy5fbGlnaHRzW2tleV07XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBhbGwgbGlnaHQgc291cmNlc1xyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5jbGVhckxpZ2h0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fbGlnaHRzID0ge307XHJcbn07XHJcblxyXG4vKipcclxuICogUmVzZXQgdGhlIHByZS1jb21wdXRlZCB0b3BvbG9neSB2YWx1ZXMuIENhbGwgd2hlbmV2ZXIgdGhlIHVuZGVybHlpbmcgbWFwIGNoYW5nZXMgaXRzIGxpZ2h0LXBhc3NhYmlsaXR5LlxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlID0ge307XHJcblx0dGhpcy5fZm92Q2FjaGUgPSB7fTtcclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSB0aGUgbGlnaHRpbmdcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gbGlnaHRpbmdDYWxsYmFjayBXaWxsIGJlIGNhbGxlZCB3aXRoICh4LCB5LCBjb2xvcikgZm9yIGV2ZXJ5IGxpdCBjZWxsXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihsaWdodGluZ0NhbGxiYWNrKSB7XHJcblx0dmFyIGRvbmVDZWxscyA9IHt9O1xyXG5cdHZhciBlbWl0dGluZ0NlbGxzID0ge307XHJcblx0dmFyIGxpdENlbGxzID0ge307XHJcblxyXG5cdGZvciAodmFyIGtleSBpbiB0aGlzLl9saWdodHMpIHsgLyogcHJlcGFyZSBlbWl0dGVycyBmb3IgZmlyc3QgcGFzcyAqL1xyXG5cdFx0dmFyIGxpZ2h0ID0gdGhpcy5fbGlnaHRzW2tleV07XHJcblx0XHRlbWl0dGluZ0NlbGxzW2tleV0gPSBbMCwgMCwgMF07XHJcblx0XHRST1QuQ29sb3IuYWRkXyhlbWl0dGluZ0NlbGxzW2tleV0sIGxpZ2h0KTtcclxuXHR9XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX29wdGlvbnMucGFzc2VzO2krKykgeyAvKiBtYWluIGxvb3AgKi9cclxuXHRcdHRoaXMuX2VtaXRMaWdodChlbWl0dGluZ0NlbGxzLCBsaXRDZWxscywgZG9uZUNlbGxzKTtcclxuXHRcdGlmIChpKzEgPT0gdGhpcy5fb3B0aW9ucy5wYXNzZXMpIHsgY29udGludWU7IH0gLyogbm90IGZvciB0aGUgbGFzdCBwYXNzICovXHJcblx0XHRlbWl0dGluZ0NlbGxzID0gdGhpcy5fY29tcHV0ZUVtaXR0ZXJzKGxpdENlbGxzLCBkb25lQ2VsbHMpO1xyXG5cdH1cclxuXHJcblx0Zm9yICh2YXIgbGl0S2V5IGluIGxpdENlbGxzKSB7IC8qIGxldCB0aGUgdXNlciBrbm93IHdoYXQgYW5kIGhvdyBpcyBsaXQgKi9cclxuXHRcdHZhciBwYXJ0cyA9IGxpdEtleS5zcGxpdChcIixcIik7XHJcblx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcclxuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0bGlnaHRpbmdDYWxsYmFjayh4LCB5LCBsaXRDZWxsc1tsaXRLZXldKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgb25lIGl0ZXJhdGlvbiBmcm9tIGFsbCBlbWl0dGluZyBjZWxsc1xyXG4gKiBAcGFyYW0ge29iamVjdH0gZW1pdHRpbmdDZWxscyBUaGVzZSBlbWl0IGxpZ2h0XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBsaXRDZWxscyBBZGQgcHJvamVjdGVkIGxpZ2h0IHRvIHRoZXNlXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBkb25lQ2VsbHMgVGhlc2UgYWxyZWFkeSBlbWl0dGVkLCBmb3JiaWQgdGhlbSBmcm9tIGZ1cnRoZXIgY2FsY3VsYXRpb25zXHJcbiAqL1xyXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLl9lbWl0TGlnaHQgPSBmdW5jdGlvbihlbWl0dGluZ0NlbGxzLCBsaXRDZWxscywgZG9uZUNlbGxzKSB7XHJcblx0Zm9yICh2YXIga2V5IGluIGVtaXR0aW5nQ2VsbHMpIHtcclxuXHRcdHZhciBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XHJcblx0XHR2YXIgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcclxuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0dGhpcy5fZW1pdExpZ2h0RnJvbUNlbGwoeCwgeSwgZW1pdHRpbmdDZWxsc1trZXldLCBsaXRDZWxscyk7XHJcblx0XHRkb25lQ2VsbHNba2V5XSA9IDE7XHJcblx0fVxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFByZXBhcmUgYSBsaXN0IG9mIGVtaXR0ZXJzIGZvciBuZXh0IHBhc3NcclxuICogQHBhcmFtIHtvYmplY3R9IGxpdENlbGxzXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBkb25lQ2VsbHNcclxuICogQHJldHVybnMge29iamVjdH1cclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuX2NvbXB1dGVFbWl0dGVycyA9IGZ1bmN0aW9uKGxpdENlbGxzLCBkb25lQ2VsbHMpIHtcclxuXHR2YXIgcmVzdWx0ID0ge307XHJcblxyXG5cdGZvciAodmFyIGtleSBpbiBsaXRDZWxscykge1xyXG5cdFx0aWYgKGtleSBpbiBkb25lQ2VsbHMpIHsgY29udGludWU7IH0gLyogYWxyZWFkeSBlbWl0dGVkICovXHJcblxyXG5cdFx0dmFyIGNvbG9yID0gbGl0Q2VsbHNba2V5XTtcclxuXHJcblx0XHRpZiAoa2V5IGluIHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlKSB7XHJcblx0XHRcdHZhciByZWZsZWN0aXZpdHkgPSB0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZVtrZXldO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHBhcnRzID0ga2V5LnNwbGl0KFwiLFwiKTtcclxuXHRcdFx0dmFyIHggPSBwYXJzZUludChwYXJ0c1swXSk7XHJcblx0XHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xyXG5cdFx0XHR2YXIgcmVmbGVjdGl2aXR5ID0gdGhpcy5fcmVmbGVjdGl2aXR5Q2FsbGJhY2soeCwgeSk7XHJcblx0XHRcdHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlW2tleV0gPSByZWZsZWN0aXZpdHk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHJlZmxlY3Rpdml0eSA9PSAwKSB7IGNvbnRpbnVlOyB9IC8qIHdpbGwgbm90IHJlZmxlY3QgYXQgYWxsICovXHJcblxyXG5cdFx0LyogY29tcHV0ZSBlbWlzc2lvbiBjb2xvciAqL1xyXG5cdFx0dmFyIGVtaXNzaW9uID0gW107XHJcblx0XHR2YXIgaW50ZW5zaXR5ID0gMDtcclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XHJcblx0XHRcdHZhciBwYXJ0ID0gTWF0aC5yb3VuZChjb2xvcltpXSpyZWZsZWN0aXZpdHkpO1xyXG5cdFx0XHRlbWlzc2lvbltpXSA9IHBhcnQ7XHJcblx0XHRcdGludGVuc2l0eSArPSBwYXJ0O1xyXG5cdFx0fVxyXG5cdFx0aWYgKGludGVuc2l0eSA+IHRoaXMuX29wdGlvbnMuZW1pc3Npb25UaHJlc2hvbGQpIHsgcmVzdWx0W2tleV0gPSBlbWlzc2lvbjsgfVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIG9uZSBpdGVyYXRpb24gZnJvbSBvbmUgY2VsbFxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcGFyYW0ge251bWJlcltdfSBjb2xvclxyXG4gKiBAcGFyYW0ge29iamVjdH0gbGl0Q2VsbHMgQ2VsbCBkYXRhIHRvIGJ5IHVwZGF0ZWRcclxuICovXHJcblJPVC5MaWdodGluZy5wcm90b3R5cGUuX2VtaXRMaWdodEZyb21DZWxsID0gZnVuY3Rpb24oeCwgeSwgY29sb3IsIGxpdENlbGxzKSB7XHJcblx0dmFyIGtleSA9IHgrXCIsXCIreTtcclxuXHRpZiAoa2V5IGluIHRoaXMuX2ZvdkNhY2hlKSB7XHJcblx0XHR2YXIgZm92ID0gdGhpcy5fZm92Q2FjaGVba2V5XTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGZvdiA9IHRoaXMuX3VwZGF0ZUZPVih4LCB5KTtcclxuXHR9XHJcblxyXG5cdGZvciAodmFyIGZvdktleSBpbiBmb3YpIHtcclxuXHRcdHZhciBmb3JtRmFjdG9yID0gZm92W2ZvdktleV07XHJcblxyXG5cdFx0aWYgKGZvdktleSBpbiBsaXRDZWxscykgeyAvKiBhbHJlYWR5IGxpdCAqL1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gbGl0Q2VsbHNbZm92S2V5XTtcclxuXHRcdH0gZWxzZSB7IC8qIG5ld2x5IGxpdCAqL1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gWzAsIDAsIDBdO1xyXG5cdFx0XHRsaXRDZWxsc1tmb3ZLZXldID0gcmVzdWx0O1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7IHJlc3VsdFtpXSArPSBNYXRoLnJvdW5kKGNvbG9yW2ldKmZvcm1GYWN0b3IpOyB9IC8qIGFkZCBsaWdodCBjb2xvciAqL1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBGT1YgKFwiZm9ybSBmYWN0b3JcIikgZm9yIGEgcG90ZW50aWFsIGxpZ2h0IHNvdXJjZSBhdCBbeCx5XVxyXG4gKiBAcGFyYW0ge2ludH0geFxyXG4gKiBAcGFyYW0ge2ludH0geVxyXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxyXG4gKi9cclxuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5fdXBkYXRlRk9WID0gZnVuY3Rpb24oeCwgeSkge1xyXG5cdHZhciBrZXkxID0geCtcIixcIit5O1xyXG5cdHZhciBjYWNoZSA9IHt9O1xyXG5cdHRoaXMuX2ZvdkNhY2hlW2tleTFdID0gY2FjaGU7XHJcblx0dmFyIHJhbmdlID0gdGhpcy5fb3B0aW9ucy5yYW5nZTtcclxuXHR2YXIgY2IgPSBmdW5jdGlvbih4LCB5LCByLCB2aXMpIHtcclxuXHRcdHZhciBrZXkyID0geCtcIixcIit5O1xyXG5cdFx0dmFyIGZvcm1GYWN0b3IgPSB2aXMgKiAoMS1yL3JhbmdlKTtcclxuXHRcdGlmIChmb3JtRmFjdG9yID09IDApIHsgcmV0dXJuOyB9XHJcblx0XHRjYWNoZVtrZXkyXSA9IGZvcm1GYWN0b3I7XHJcblx0fTtcclxuXHR0aGlzLl9mb3YuY29tcHV0ZSh4LCB5LCByYW5nZSwgY2IuYmluZCh0aGlzKSk7XHJcblxyXG5cdHJldHVybiBjYWNoZTtcclxufTtcclxuLyoqXHJcbiAqIEBjbGFzcyBBYnN0cmFjdCBwYXRoZmluZGVyXHJcbiAqIEBwYXJhbSB7aW50fSB0b1ggVGFyZ2V0IFggY29vcmRcclxuICogQHBhcmFtIHtpbnR9IHRvWSBUYXJnZXQgWSBjb29yZFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBwYXNzYWJsZUNhbGxiYWNrIENhbGxiYWNrIHRvIGRldGVybWluZSBtYXAgcGFzc2FiaWxpdHlcclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudG9wb2xvZ3k9OF1cclxuICovXHJcblJPVC5QYXRoID0gZnVuY3Rpb24odG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHR0aGlzLl90b1ggPSB0b1g7XHJcblx0dGhpcy5fdG9ZID0gdG9ZO1xyXG5cdHRoaXMuX2Zyb21YID0gbnVsbDtcclxuXHR0aGlzLl9mcm9tWSA9IG51bGw7XHJcblx0dGhpcy5fcGFzc2FibGVDYWxsYmFjayA9IHBhc3NhYmxlQ2FsbGJhY2s7XHJcblx0dGhpcy5fb3B0aW9ucyA9IHtcclxuXHRcdHRvcG9sb2d5OiA4XHJcblx0fTtcclxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cclxuXHJcblx0dGhpcy5fZGlycyA9IFJPVC5ESVJTW3RoaXMuX29wdGlvbnMudG9wb2xvZ3ldO1xyXG5cdGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDgpIHsgLyogcmVvcmRlciBkaXJzIGZvciBtb3JlIGFlc3RoZXRpYyByZXN1bHQgKHZlcnRpY2FsL2hvcml6b250YWwgZmlyc3QpICovXHJcblx0XHR0aGlzLl9kaXJzID0gW1xyXG5cdFx0XHR0aGlzLl9kaXJzWzBdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzJdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzRdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzZdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzFdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzNdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzVdLFxyXG5cdFx0XHR0aGlzLl9kaXJzWzddXHJcblx0XHRdXHJcblx0fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgYSBwYXRoIGZyb20gYSBnaXZlbiBwb2ludFxyXG4gKiBAcGFyYW0ge2ludH0gZnJvbVhcclxuICogQHBhcmFtIHtpbnR9IGZyb21ZXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFdpbGwgYmUgY2FsbGVkIGZvciBldmVyeSBwYXRoIGl0ZW0gd2l0aCBhcmd1bWVudHMgXCJ4XCIgYW5kIFwieVwiXHJcbiAqL1xyXG5ST1QuUGF0aC5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKGZyb21YLCBmcm9tWSwgY2FsbGJhY2spIHtcclxufTtcclxuXHJcblJPVC5QYXRoLnByb3RvdHlwZS5fZ2V0TmVpZ2hib3JzID0gZnVuY3Rpb24oY3gsIGN5KSB7XHJcblx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX2RpcnMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGRpciA9IHRoaXMuX2RpcnNbaV07XHJcblx0XHR2YXIgeCA9IGN4ICsgZGlyWzBdO1xyXG5cdFx0dmFyIHkgPSBjeSArIGRpclsxXTtcclxuXHRcdFxyXG5cdFx0aWYgKCF0aGlzLl9wYXNzYWJsZUNhbGxiYWNrKHgsIHkpKSB7IGNvbnRpbnVlOyB9XHJcblx0XHRyZXN1bHQucHVzaChbeCwgeV0pO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59O1xyXG4vKipcclxuICogQGNsYXNzIFNpbXBsaWZpZWQgRGlqa3N0cmEncyBhbGdvcml0aG06IGFsbCBlZGdlcyBoYXZlIGEgdmFsdWUgb2YgMVxyXG4gKiBAYXVnbWVudHMgUk9ULlBhdGhcclxuICogQHNlZSBST1QuUGF0aFxyXG4gKi9cclxuUk9ULlBhdGguRGlqa3N0cmEgPSBmdW5jdGlvbih0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdFJPVC5QYXRoLmNhbGwodGhpcywgdG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG5cclxuXHR0aGlzLl9jb21wdXRlZCA9IHt9O1xyXG5cdHRoaXMuX3RvZG8gPSBbXTtcclxuXHR0aGlzLl9hZGQodG9YLCB0b1ksIG51bGwpO1xyXG59O1xyXG5ST1QuUGF0aC5EaWprc3RyYS5leHRlbmQoUk9ULlBhdGgpO1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGUgYSBwYXRoIGZyb20gYSBnaXZlbiBwb2ludFxyXG4gKiBAc2VlIFJPVC5QYXRoI2NvbXB1dGVcclxuICovXHJcblJPVC5QYXRoLkRpamtzdHJhLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZLCBjYWxsYmFjaykge1xyXG5cdHZhciBrZXkgPSBmcm9tWCtcIixcIitmcm9tWTtcclxuXHRpZiAoIShrZXkgaW4gdGhpcy5fY29tcHV0ZWQpKSB7IHRoaXMuX2NvbXB1dGUoZnJvbVgsIGZyb21ZKTsgfVxyXG5cdGlmICghKGtleSBpbiB0aGlzLl9jb21wdXRlZCkpIHsgcmV0dXJuOyB9XHJcblx0XHJcblx0dmFyIGl0ZW0gPSB0aGlzLl9jb21wdXRlZFtrZXldO1xyXG5cdHdoaWxlIChpdGVtKSB7XHJcblx0XHRjYWxsYmFjayhpdGVtLngsIGl0ZW0ueSk7XHJcblx0XHRpdGVtID0gaXRlbS5wcmV2O1xyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlIGEgbm9uLWNhY2hlZCB2YWx1ZVxyXG4gKi9cclxuUk9ULlBhdGguRGlqa3N0cmEucHJvdG90eXBlLl9jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZKSB7XHJcblx0d2hpbGUgKHRoaXMuX3RvZG8ubGVuZ3RoKSB7XHJcblx0XHR2YXIgaXRlbSA9IHRoaXMuX3RvZG8uc2hpZnQoKTtcclxuXHRcdGlmIChpdGVtLnggPT0gZnJvbVggJiYgaXRlbS55ID09IGZyb21ZKSB7IHJldHVybjsgfVxyXG5cdFx0XHJcblx0XHR2YXIgbmVpZ2hib3JzID0gdGhpcy5fZ2V0TmVpZ2hib3JzKGl0ZW0ueCwgaXRlbS55KTtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8bmVpZ2hib3JzLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0dmFyIG5laWdoYm9yID0gbmVpZ2hib3JzW2ldO1xyXG5cdFx0XHR2YXIgeCA9IG5laWdoYm9yWzBdO1xyXG5cdFx0XHR2YXIgeSA9IG5laWdoYm9yWzFdO1xyXG5cdFx0XHR2YXIgaWQgPSB4K1wiLFwiK3k7XHJcblx0XHRcdGlmIChpZCBpbiB0aGlzLl9jb21wdXRlZCkgeyBjb250aW51ZTsgfSAvKiBhbHJlYWR5IGRvbmUgKi9cdFxyXG5cdFx0XHR0aGlzLl9hZGQoeCwgeSwgaXRlbSk7IFxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblJPVC5QYXRoLkRpamtzdHJhLnByb3RvdHlwZS5fYWRkID0gZnVuY3Rpb24oeCwgeSwgcHJldikge1xyXG5cdHZhciBvYmogPSB7XHJcblx0XHR4OiB4LFxyXG5cdFx0eTogeSxcclxuXHRcdHByZXY6IHByZXZcclxuXHR9O1xyXG5cdHRoaXMuX2NvbXB1dGVkW3grXCIsXCIreV0gPSBvYmo7XHJcblx0dGhpcy5fdG9kby5wdXNoKG9iaik7XHJcbn07XHJcbi8qKlxyXG4gKiBAY2xhc3MgU2ltcGxpZmllZCBBKiBhbGdvcml0aG06IGFsbCBlZGdlcyBoYXZlIGEgdmFsdWUgb2YgMVxyXG4gKiBAYXVnbWVudHMgUk9ULlBhdGhcclxuICogQHNlZSBST1QuUGF0aFxyXG4gKi9cclxuUk9ULlBhdGguQVN0YXIgPSBmdW5jdGlvbih0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucykge1xyXG5cdFJPVC5QYXRoLmNhbGwodGhpcywgdG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpO1xyXG5cclxuXHR0aGlzLl90b2RvID0gW107XHJcblx0dGhpcy5fZG9uZSA9IHt9O1xyXG5cdHRoaXMuX2Zyb21YID0gbnVsbDtcclxuXHR0aGlzLl9mcm9tWSA9IG51bGw7XHJcbn07XHJcblJPVC5QYXRoLkFTdGFyLmV4dGVuZChST1QuUGF0aCk7XHJcblxyXG4vKipcclxuICogQ29tcHV0ZSBhIHBhdGggZnJvbSBhIGdpdmVuIHBvaW50XHJcbiAqIEBzZWUgUk9ULlBhdGgjY29tcHV0ZVxyXG4gKi9cclxuUk9ULlBhdGguQVN0YXIucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihmcm9tWCwgZnJvbVksIGNhbGxiYWNrKSB7XHJcblx0dGhpcy5fdG9kbyA9IFtdO1xyXG5cdHRoaXMuX2RvbmUgPSB7fTtcclxuXHR0aGlzLl9mcm9tWCA9IGZyb21YO1xyXG5cdHRoaXMuX2Zyb21ZID0gZnJvbVk7XHJcblx0dGhpcy5fYWRkKHRoaXMuX3RvWCwgdGhpcy5fdG9ZLCBudWxsKTtcclxuXHJcblx0d2hpbGUgKHRoaXMuX3RvZG8ubGVuZ3RoKSB7XHJcblx0XHR2YXIgaXRlbSA9IHRoaXMuX3RvZG8uc2hpZnQoKTtcclxuXHRcdGlmIChpdGVtLnggPT0gZnJvbVggJiYgaXRlbS55ID09IGZyb21ZKSB7IGJyZWFrOyB9XHJcblx0XHR2YXIgbmVpZ2hib3JzID0gdGhpcy5fZ2V0TmVpZ2hib3JzKGl0ZW0ueCwgaXRlbS55KTtcclxuXHJcblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvcnMubGVuZ3RoO2krKykge1xyXG5cdFx0XHR2YXIgbmVpZ2hib3IgPSBuZWlnaGJvcnNbaV07XHJcblx0XHRcdHZhciB4ID0gbmVpZ2hib3JbMF07XHJcblx0XHRcdHZhciB5ID0gbmVpZ2hib3JbMV07XHJcblx0XHRcdHZhciBpZCA9IHgrXCIsXCIreTtcclxuXHRcdFx0aWYgKGlkIGluIHRoaXMuX2RvbmUpIHsgY29udGludWU7IH1cclxuXHRcdFx0dGhpcy5fYWRkKHgsIHksIGl0ZW0pOyBcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0dmFyIGl0ZW0gPSB0aGlzLl9kb25lW2Zyb21YK1wiLFwiK2Zyb21ZXTtcclxuXHRpZiAoIWl0ZW0pIHsgcmV0dXJuOyB9XHJcblx0XHJcblx0d2hpbGUgKGl0ZW0pIHtcclxuXHRcdGNhbGxiYWNrKGl0ZW0ueCwgaXRlbS55KTtcclxuXHRcdGl0ZW0gPSBpdGVtLnByZXY7XHJcblx0fVxyXG59O1xyXG5cclxuUk9ULlBhdGguQVN0YXIucHJvdG90eXBlLl9hZGQgPSBmdW5jdGlvbih4LCB5LCBwcmV2KSB7XHJcblx0dmFyIGggPSB0aGlzLl9kaXN0YW5jZSh4LCB5KTtcclxuXHR2YXIgb2JqID0ge1xyXG5cdFx0eDogeCxcclxuXHRcdHk6IHksXHJcblx0XHRwcmV2OiBwcmV2LFxyXG5cdFx0ZzogKHByZXYgPyBwcmV2LmcrMSA6IDApLFxyXG5cdFx0aDogaFxyXG5cdH07XHJcblx0dGhpcy5fZG9uZVt4K1wiLFwiK3ldID0gb2JqO1xyXG5cdFxyXG5cdC8qIGluc2VydCBpbnRvIHByaW9yaXR5IHF1ZXVlICovXHJcblx0XHJcblx0dmFyIGYgPSBvYmouZyArIG9iai5oO1xyXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3RvZG8ubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGl0ZW0gPSB0aGlzLl90b2RvW2ldO1xyXG5cdFx0dmFyIGl0ZW1GID0gaXRlbS5nICsgaXRlbS5oO1xyXG5cdFx0aWYgKGYgPCBpdGVtRiB8fCAoZiA9PSBpdGVtRiAmJiBoIDwgaXRlbS5oKSkge1xyXG5cdFx0XHR0aGlzLl90b2RvLnNwbGljZShpLCAwLCBvYmopO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX3RvZG8ucHVzaChvYmopO1xyXG59O1xyXG5cclxuUk9ULlBhdGguQVN0YXIucHJvdG90eXBlLl9kaXN0YW5jZSA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRzd2l0Y2ggKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kpIHtcclxuXHRcdGNhc2UgNDpcclxuXHRcdFx0cmV0dXJuIChNYXRoLmFicyh4LXRoaXMuX2Zyb21YKSArIE1hdGguYWJzKHktdGhpcy5fZnJvbVkpKTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgNjpcclxuXHRcdFx0dmFyIGR4ID0gTWF0aC5hYnMoeCAtIHRoaXMuX2Zyb21YKTtcclxuXHRcdFx0dmFyIGR5ID0gTWF0aC5hYnMoeSAtIHRoaXMuX2Zyb21ZKTtcclxuXHRcdFx0cmV0dXJuIGR5ICsgTWF0aC5tYXgoMCwgKGR4LWR5KS8yKTtcclxuXHRcdGJyZWFrO1xyXG5cclxuXHRcdGNhc2UgODogXHJcblx0XHRcdHJldHVybiBNYXRoLm1heChNYXRoLmFicyh4LXRoaXMuX2Zyb21YKSwgTWF0aC5hYnMoeS10aGlzLl9mcm9tWSkpO1xyXG5cdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHRvcG9sb2d5XCIpO1xyXG59O1xyXG4gIHJldHVybiBST1Q7XHJcbn0pKTtcclxuIl19
