/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/** @module route/nodes */


/**
 * Create a node for use with the parser, giving it a constructor that takes
 * props, children, and returns an object with props, children, and a
 * displayName.
 * @param  {String} displayName The display name for the node
 * @return {{displayName: string, props: Object, children: Array}}
 */
function createNode(displayName) {
  return function(props, children) {
    return {
      displayName: displayName,
      props: props,
      children: children || []
    };
  };
}

module.exports = {
  Root: createNode('Root'),
  Concat: createNode('Concat'),
  Literal: createNode('Literal'),
  Splat: createNode('Splat'),
  Param: createNode('Param'),
  Optional: createNode('Optional')
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @module route/visitors/create_visitor
 */

var nodeTypes = Object.keys(__webpack_require__(0));

/**
 * Helper for creating visitors. Take an object of node name to handler
 * mappings, returns an object with a "visit" method that can be called
 * @param  {Object.<string,function(node,context)>} handlers A mapping of node
 * type to visitor functions
 * @return {{visit: function(node,context)}}  A visitor object with a "visit"
 * method that can be called on a node with a context
 */
function createVisitor(handlers) {
  nodeTypes.forEach(function(nodeType) {
    if( typeof handlers[nodeType] === 'undefined') {
      throw new Error('No handler defined for ' + nodeType.displayName);
    }

  });

  return {
    /**
     * Call the given handler for this node type
     * @param  {Object} node    the AST node
     * @param  {Object} context context to pass through to handlers
     * @return {Object}
     */
    visit: function(node, context) {
      return this.handlers[node.displayName].call(this,node, context);
    },
    handlers: handlers
  };
}

module.exports = createVisitor;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Route = __webpack_require__(4);
var methods = [];
var params = [];
var objects = [];
var PathUtil = (function () {
    function PathUtil() {
    }
    PathUtil.combinePath = function (path1, path2) {
        path1 = path1 || '';
        path2 = path2 || '';
        var path = path1 + '/' + path2;
        return path.replace(PathUtil.MultiSlashRegex, '/');
    };
    return PathUtil;
}());
PathUtil.MultiSlashRegex = /\/[\/]+/g;
var HashLocationProvider = (function () {
    function HashLocationProvider() {
    }
    Object.defineProperty(HashLocationProvider.prototype, "location", {
        get: function () {
            var currentPath = window.location.hash;
            if (currentPath && currentPath.indexOf('#') === 0) {
                currentPath = currentPath.substring(1);
            }
            return currentPath;
        },
        set: function (location) {
            window.location.hash = '#' + location;
        },
        enumerable: true,
        configurable: true
    });
    return HashLocationProvider;
}());
exports.HashLocationProvider = HashLocationProvider;
var PathLocationProvider = (function () {
    function PathLocationProvider(basePath) {
        if (basePath === void 0) { basePath = null; }
        this.basePath = basePath;
    }
    Object.defineProperty(PathLocationProvider.prototype, "location", {
        get: function () {
            var pathName = window.location.pathname;
            if (this.basePath) {
                if (pathName.indexOf(this.basePath) !== 0) {
                    throw 'basePath not in current window.location.pathname';
                }
                return pathName.substring(this.basePath.length);
            }
            else {
                return pathName;
            }
        },
        set: function (location) {
            if (location != this.location) {
                var newPath = this.basePath ? PathUtil.combinePath(this.basePath, location) : location;
                history.pushState(null, '', newPath);
            }
        },
        enumerable: true,
        configurable: true
    });
    return PathLocationProvider;
}());
exports.PathLocationProvider = PathLocationProvider;
var RouterImpl = (function () {
    function RouterImpl() {
        this.routes = new Map();
    }
    RouterImpl.prototype.init = function (locationProvider) {
        var _this = this;
        if (!locationProvider) {
            throw new Error('locationProvider was not specified.');
        }
        this.locationProvider = locationProvider;
        this.buildRoutes();
        window.onpopstate = function () {
            _this.navigateToPath(_this.locationProvider.location);
        };
        this.navigateToPath(this.locationProvider.location);
    };
    RouterImpl.prototype.buildRoutes = function () {
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var objectEntry = objects_1[_i];
            for (var _a = 0, methods_1 = methods; _a < methods_1.length; _a++) {
                var methodEntry = methods_1[_a];
                if (objectEntry.obj instanceof methodEntry.target.constructor) {
                    var routePath = objectEntry.path ? PathUtil.combinePath(objectEntry.path, methodEntry.path) : methodEntry.path;
                    this.addRoute(objectEntry.obj, methodEntry.methodName, new Route(routePath));
                }
            }
        }
    };
    RouterImpl.prototype.addRoute = function (obj, methodName, route) {
        var methodRoute = this.routes.get(obj);
        if (!methodRoute) {
            methodRoute = new Map();
            this.routes.set(obj, methodRoute);
        }
        methodRoute.set(methodName, route);
    };
    RouterImpl.prototype.handleRoute = function (obj, methodName, routeParams) {
        // build argument list
        var args = [];
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var paramEntry = params_1[_i];
            // check class
            if (obj instanceof paramEntry.target.constructor) {
                // check method
                if (methodName == paramEntry.methodName) {
                    args[paramEntry.index] = routeParams[paramEntry.paramName];
                }
            }
        }
        // call method
        (_a = obj[methodName]).call.apply(_a, [obj].concat(args));
        var _a;
    };
    RouterImpl.prototype.navigateToPath = function (path) {
        if (!path) {
            path = '/';
        }
        for (var _i = 0, _a = Array.from(this.routes.entries()); _i < _a.length; _i++) {
            var _b = _a[_i], obj = _b[0], methodRoutes = _b[1];
            for (var _c = 0, _d = Array.from(methodRoutes.entries()); _c < _d.length; _c++) {
                var _e = _d[_c], methodName = _e[0], route_1 = _e[1];
                var match = route_1.match(path);
                if (match) {
                    this.handleRoute(obj, methodName, match);
                    return true;
                }
            }
        }
        return false;
    };
    RouterImpl.prototype.maybeAddState = function (obj, methodName, args) {
        var methodRoutes = this.routes.get(obj);
        if (methodRoutes) {
            var route_2 = methodRoutes.get(methodName);
            if (route_2) {
                var routeParams = {};
                for (var _i = 0, params_2 = params; _i < params_2.length; _i++) {
                    var paramEntry = params_2[_i];
                    // check class
                    if (obj instanceof paramEntry.target.constructor) {
                        // check method
                        if (methodName == paramEntry.methodName) {
                            routeParams[paramEntry.paramName] = args[paramEntry.index];
                        }
                    }
                }
                var newState = route_2.reverse(routeParams);
                if (newState) {
                    this.locationProvider.location = newState;
                }
            }
        }
    };
    return RouterImpl;
}());
function routeMethod(path) {
    return function (target, methodName, descriptor) {
        methods.push({ target: target, methodName: methodName, path: path });
        var original = descriptor.value;
        // inject wrapper
        descriptor.value = function () {
            // add state
            routerImpl.maybeAddState(this, methodName, arguments);
            // call original
            original.apply(this, arguments);
        };
        return descriptor;
    };
}
exports.routeMethod = routeMethod;
function routeClass(path) {
    return function (target) {
        return (function (_super) {
            __extends(Wrapper, _super);
            function Wrapper() {
                var _this = _super.call(this) || this;
                objects.push({ obj: _this, path: path });
                return _this;
            }
            return Wrapper;
        }(target));
    };
}
exports.routeClass = routeClass;
function routeParam(paramName) {
    return function (target, methodName, index) {
        params.push({ target: target, methodName: methodName, index: index, paramName: paramName });
    };
}
exports.routeParam = routeParam;
function route(route) {
    var _this = this;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        switch (args.length) {
            case 1:
                return routeClass(route).apply(_this, args);
            case 2:
                throw new Error('decorator @route not supported on properties.');
            case 3:
                if (typeof args[2] === "number") {
                    throw new Error('decorator @route not supported on parameters.');
                }
                return routeMethod(route).apply(_this, args);
            default:
                throw new Error('unsupported decorator signature');
        }
    };
}
exports.route = route;
var routerImpl = new RouterImpl();
exports.router = routerImpl;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(2);
var Example = (function () {
    function Example() {
    }
    Example.prototype.index = function () {
        content.innerText = 'hello, index';
    };
    Example.prototype.test1 = function () {
        content.innerText = 'hello, test1';
    };
    Example.prototype.test2 = function () {
        content.innerText = 'hello, test2';
    };
    Example.prototype.param = function (value) {
        content.innerText = 'hello, ' + value;
    };
    Example.prototype.multi = function (param, value) {
        content.innerText = "multi: param = " + param + " and value = " + value;
    };
    Example.prototype.noMatchSub = function (path) {
        content.innerText = 'sorry, nothing found at subpath sub/' + path;
    };
    Example.prototype.noMatch = function (path) {
        content.innerText = 'sorry, nothing found at ' + path;
    };
    return Example;
}());
__decorate([
    index_1.route('')
], Example.prototype, "index", null);
__decorate([
    index_1.route('test1')
], Example.prototype, "test1", null);
__decorate([
    index_1.route('test2')
], Example.prototype, "test2", null);
__decorate([
    index_1.route('param/:value'),
    __param(0, index_1.routeParam('value'))
], Example.prototype, "param", null);
__decorate([
    index_1.route('multi/:param(/value/:value)'),
    __param(0, index_1.routeParam('param')), __param(1, index_1.routeParam('value'))
], Example.prototype, "multi", null);
__decorate([
    index_1.route('sub/*path'),
    __param(0, index_1.routeParam('path'))
], Example.prototype, "noMatchSub", null);
__decorate([
    index_1.route('*path'),
    __param(0, index_1.routeParam('path'))
], Example.prototype, "noMatch", null);
Example = __decorate([
    index_1.route('/')
], Example);
var example = new Example();
var content = document.getElementById('content') || document.createElement('div');
var test1 = document.getElementById('test1');
var test2 = document.getElementById('test2');
var param = document.getElementById('param');
var multi = document.getElementById('multi');
if (test1) {
    test1.onclick = function (e) {
        e.preventDefault();
        example.test1();
        return false;
    };
}
if (test2) {
    test2.onclick = function (e) {
        e.preventDefault();
        example.test2();
        return false;
    };
}
if (param) {
    param.onclick = function (e) {
        e.preventDefault();
        example.param('programmatic value');
        return false;
    };
}
if (multi) {
    multi.onclick = function (e) {
        e.preventDefault();
        example.multi('foo2', 'bar2');
        return false;
    };
}
var servedAsFile = location.protocol.indexOf('file') === 0;
index_1.router.init(servedAsFile ? new index_1.HashLocationProvider() : new index_1.PathLocationProvider());


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module Passage
 */


var Route = __webpack_require__(5);


module.exports = Route;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Parser = __webpack_require__(7),
    RegexpVisitor = __webpack_require__(8),
    ReverseVisitor = __webpack_require__(9);

Route.prototype = Object.create(null)

/**
 * Match a path against this route, returning the matched parameters if
 * it matches, false if not.
 * @example
 * var route = new Route('/this/is/my/route')
 * route.match('/this/is/my/route') // -> {}
 * @example
 * var route = new Route('/:one/:two')
 * route.match('/foo/bar/') // -> {one: 'foo', two: 'bar'}
 * @param  {string} path the path to match this route against
 * @return {(Object.<string,string>|false)} A map of the matched route
 * parameters, or false if matching failed
 */
Route.prototype.match = function(path) {
  var re = RegexpVisitor.visit(this.ast),
      matched = re.match(path);

  return matched ? matched : false;

};

/**
 * Reverse a route specification to a path, returning false if it can't be
 * fulfilled
 * @example
 * var route = new Route('/:one/:two')
 * route.reverse({one: 'foo', two: 'bar'}) -> '/foo/bar'
 * @param  {Object} params The parameters to fill in
 * @return {(String|false)} The filled in path
 */
Route.prototype.reverse = function(params) {
  return ReverseVisitor.visit(this.ast, params);
};

/**
 * Represents a route
 * @example
 * var route = Route('/:foo/:bar');
 * @example
 * var route = Route('/:foo/:bar');
 * @param {string} spec -  the string specification of the route.
 *     use :param for single portion captures, *param for splat style captures,
 *     and () for optional route branches
 * @constructor
 */
function Route(spec) {
  var route;
  if (this) {
    // constructor called with new
    route = this;
  } else {
    // constructor called as a function
    route = Object.create(Route.prototype);
  }
  if( typeof spec === 'undefined' ) {
    throw new Error('A route spec is required');
  }
  route.spec = spec;
  route.ast = Parser.parse(spec);
  return route;
}

module.exports = Route;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,9],$V1=[1,10],$V2=[1,11],$V3=[1,12],$V4=[5,11,12,13,14,15];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"expressions":4,"EOF":5,"expression":6,"optional":7,"literal":8,"splat":9,"param":10,"(":11,")":12,"LITERAL":13,"SPLAT":14,"PARAM":15,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},
productions_: [0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
return new yy.Root({},[$$[$0-1]])
break;
case 2:
return new yy.Root({},[new yy.Literal({value: ''})])
break;
case 3:
this.$ = new yy.Concat({},[$$[$0-1],$$[$0]]);
break;
case 4: case 5:
this.$ = $$[$0];
break;
case 6:
this.$ = new yy.Literal({value: $$[$0]});
break;
case 7:
this.$ = new yy.Splat({name: $$[$0]});
break;
case 8:
this.$ = new yy.Param({name: $$[$0]});
break;
case 9:
this.$ = new yy.Optional({},[$$[$0-1]]);
break;
case 10:
this.$ = yytext;
break;
case 11: case 12:
this.$ = yytext.slice(1);
break;
}
},
table: [{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:$V0,13:$V1,14:$V2,15:$V3},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:$V0,13:$V1,14:$V2,15:$V3},{1:[2,2]},o($V4,[2,4]),o($V4,[2,5]),o($V4,[2,6]),o($V4,[2,7]),o($V4,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:$V0,13:$V1,14:$V2,15:$V3},o($V4,[2,10]),o($V4,[2,11]),o($V4,[2,12]),{1:[2,1]},o($V4,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:$V0,12:[1,16],13:$V1,14:$V2,15:$V3},o($V4,[2,9])],
defaultActions: {3:[2,2],13:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return "(";
break;
case 1:return ")";
break;
case 2:return "SPLAT";
break;
case 3:return "PARAM";
break;
case 4:return "LITERAL";
break;
case 5:return "LITERAL";
break;
case 6:return "EOF";
break;
}
},
rules: [/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (true) {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module route/parser
 */


/** Wrap the compiled parser with the context to create node objects */
var parser = __webpack_require__(6).parser;
parser.yy = __webpack_require__(0);
module.exports = parser;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createVisitor  = __webpack_require__(1),
    escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

/**
 * @class
 * @private
 */
function Matcher(options) {
  this.captures = options.captures;
  this.re = options.re;
}

/**
 * Try matching a path against the generated regular expression
 * @param  {String} path The path to try to match
 * @return {Object|false}      matched parameters or false
 */
Matcher.prototype.match = function (path) {
  var match = this.re.exec(path),
      matchParams = {};

  if( !match ) {
    return;
  }

  this.captures.forEach( function(capture, i) {
    if( typeof match[i+1] === 'undefined' ) {
      matchParams[capture] = undefined;
    }
    else {
      matchParams[capture] = decodeURIComponent(match[i+1]);
    }
  });

  return matchParams;
};

/**
 * Visitor for the AST to create a regular expression matcher
 * @class RegexpVisitor
 * @borrows Visitor-visit
 */
var RegexpVisitor = createVisitor({
  'Concat': function(node) {
    return node.children
      .reduce(
        function(memo, child) {
          var childResult = this.visit(child);
          return {
            re: memo.re + childResult.re,
            captures: memo.captures.concat(childResult.captures)
          };
        }.bind(this),
        {re: '', captures: []}
      );
  },
  'Literal': function(node) {
    return {
      re: node.props.value.replace(escapeRegExp, '\\$&'),
      captures: []
    };
  },

  'Splat': function(node) {
    return {
      re: '([^?]*?)',
      captures: [node.props.name]
    };
  },

  'Param': function(node) {
    return {
      re: '([^\\/\\?]+)',
      captures: [node.props.name]
    };
  },

  'Optional': function(node) {
    var child = this.visit(node.children[0]);
    return {
      re: '(?:' + child.re + ')?',
      captures: child.captures
    };
  },

  'Root': function(node) {
    var childResult = this.visit(node.children[0]);
    return new Matcher({
      re: new RegExp('^' + childResult.re + '(?=\\?|$)' ),
      captures: childResult.captures
    });
  }
});

module.exports = RegexpVisitor;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createVisitor  = __webpack_require__(1);

/**
 * Visitor for the AST to construct a path with filled in parameters
 * @class ReverseVisitor
 * @borrows Visitor-visit
 */
var ReverseVisitor = createVisitor({
  'Concat': function(node, context) {
    var childResults =  node.children
      .map( function(child) {
        return this.visit(child,context);
      }.bind(this));

    if( childResults.some(function(c) { return c === false; }) ) {
      return false;
    }
    else {
      return childResults.join('');
    }
  },

  'Literal': function(node) {
    return decodeURI(node.props.value);
  },

  'Splat': function(node, context) {
    if( context[node.props.name] ) {
      return context[node.props.name];
    }
    else {
      return false;
    }
  },

  'Param': function(node, context) {
    if( context[node.props.name] ) {
      return context[node.props.name];
    }
    else {
      return false;
    }
  },

  'Optional': function(node, context) {
    var childResult = this.visit(node.children[0], context);
    if( childResult ) {
      return childResult;
    }
    else {
      return '';
    }
  },

  'Root': function(node, context) {
    context = context || {};
    var childResult = this.visit(node.children[0], context);
    if( !childResult ) {
      return false;
    }
    return encodeURI(childResult);
  }
});

module.exports = ReverseVisitor;

/***/ })
/******/ ]);
//# sourceMappingURL=example.js.map