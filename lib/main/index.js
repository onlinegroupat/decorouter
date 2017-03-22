"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Route = require("route-parser");
var methods = [];
var params = [];
var objects = [];
var HashLocationProvider = (function () {
    function HashLocationProvider() {
    }
    Object.defineProperty(HashLocationProvider.prototype, "location", {
        get: function () {
            var currentPath = window.location.hash;
            if (currentPath && currentPath.startsWith('#')) {
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
        window.onpopstate = function (e) {
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
                    var routePath = this.combinePath(objectEntry.path, methodEntry.path);
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
        var _this = this;
        var found = false;
        this.routes.forEach(function (methodRoutes, obj) {
            methodRoutes.forEach(function (route, methodName) {
                var match = route.match(path);
                if (match) {
                    _this.handleRoute(obj, methodName, match);
                    found = true;
                }
            });
        });
        return found;
    };
    RouterImpl.prototype.combinePath = function (path1, path2) {
        path1 = path1 || '';
        path2 = path2 || '';
        if (!path1.endsWith('/') && !path2.startsWith('/')) {
            path1 += '/';
        }
        return path1 + path2;
    };
    RouterImpl.prototype.maybeAddState = function (obj, methodName, args) {
        var methodRoutes = this.routes.get(obj);
        if (methodRoutes) {
            var route_1 = methodRoutes.get(methodName);
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
            var newState = route_1.reverse(routeParams);
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
//# sourceMappingURL=index.js.map