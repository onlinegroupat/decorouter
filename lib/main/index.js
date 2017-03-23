(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("route-parser"));
	else if(typeof define === 'function' && define.amd)
		define(["route-parser"], factory);
	else if(typeof exports === 'object')
		exports["decorouter"] = factory(require("route-parser"));
	else
		root["decorouter"] = factory(root[undefined]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
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
var Route = __webpack_require__(0);
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
        if (basePath === void 0) { basePath = '/'; }
        this.basePath = basePath;
    }
    Object.defineProperty(PathLocationProvider.prototype, "location", {
        get: function () {
            var pathName = '/' + window.location.pathname;
            if (pathName.indexOf(this.basePath) !== 0) {
                throw 'basePath not in current window.location.pathname';
            }
            return pathName.substring(this.basePath.length);
        },
        set: function (location) {
            var newPath = PathUtil.combinePath(this.basePath, location);
            history.pushState(null, null, newPath);
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
                    var routePath = PathUtil.combinePath(objectEntry.path, methodEntry.path);
                    this.addRoute(objectEntry.obj, methodEntry.methodName, new Route(routePath));
                }
            }
        }
    };
    RouterImpl.prototype.addRoute = function (obj, methodName, route) {
        var methodRoute = null;
        if (this.routes.has(obj)) {
            methodRoute = this.routes.get(obj);
        }
        else {
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
        obj[methodName].call(obj, args);
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


/***/ })
/******/ ]);
});