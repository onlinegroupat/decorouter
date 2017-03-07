"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Route = require("route-parser");
const methods = [];
const params = [];
const objects = [];
class HashLocationProvider {
    get location() {
        let currentPath = window.location.hash;
        if (currentPath && currentPath.startsWith('#')) {
            currentPath = currentPath.substring(1);
        }
        return currentPath;
    }
    set location(location) {
        window.location.hash = '#' + location;
    }
}
exports.HashLocationProvider = HashLocationProvider;
class RouterImpl {
    constructor() {
        this.routes = new Map();
    }
    init(locationProvider) {
        if (!locationProvider) {
            throw new Error('locationProvider was not specified.');
        }
        this.locationProvider = locationProvider;
        this.buildRoutes();
        window.onpopstate = (e) => {
            this.navigateToPath(this.getCurrentHashLocation());
        };
        this.navigateToPath(this.getCurrentHashLocation());
    }
    getCurrentHashLocation() {
        let currentPath = window.location.hash;
        if (currentPath && currentPath.startsWith('#')) {
            currentPath = currentPath.substring(1);
        }
        return currentPath;
    }
    buildRoutes() {
        for (let objectEntry of objects) {
            for (let methodEntry of methods) {
                if (objectEntry.obj instanceof methodEntry.target.constructor) {
                    let routePath = this.combinePath(objectEntry.path, methodEntry.path);
                    this.addRoute(objectEntry.obj, methodEntry.methodName, new Route(routePath));
                }
            }
        }
    }
    addRoute(obj, methodName, route) {
        let methodRoute = null;
        if (this.routes.has(obj)) {
            methodRoute = this.routes.get(obj);
        }
        else {
            methodRoute = new Map();
            this.routes.set(obj, methodRoute);
        }
        methodRoute.set(methodName, route);
    }
    handleRoute(obj, methodName, routeParams) {
        // build argument list
        let args = [];
        for (let paramEntry of params) {
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
    }
    navigateToPath(path) {
        let found = false;
        for (let [obj, methodRoutes] of this.routes) {
            for (let [methodName, route] of methodRoutes) {
                let match = route.match(path);
                if (match) {
                    this.handleRoute(obj, methodName, match);
                    found = true;
                    break;
                }
            }
        }
    }
    combinePath(path1, path2) {
        path1 = path1 || '';
        path2 = path2 || '';
        if (!path1.endsWith('/') && !path2.startsWith('/')) {
            path1 += '/';
        }
        return path1 + path2;
    }
    maybeAddState(obj, methodName, args) {
        let methodRoutes = this.routes.get(obj);
        let route = methodRoutes.get(methodName);
        let routeParams = {};
        for (let paramEntry of params) {
            // check class
            if (obj instanceof paramEntry.target.constructor) {
                // check method
                if (methodName == paramEntry.methodName) {
                    routeParams[paramEntry.paramName] = args[paramEntry.index];
                }
            }
        }
        let newState = route.reverse(routeParams);
        if (newState) {
            this.locationProvider.location = newState;
        }
    }
}
function routeMethod(path) {
    return (target, methodName, descriptor) => {
        methods.push({ target, methodName, path });
        let original = descriptor.value;
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
    return (target) => {
        return class Wrapper extends target {
            constructor() {
                super();
                objects.push({ obj: this, path: path });
            }
        };
    };
}
exports.routeClass = routeClass;
function routeParam(paramName) {
    return (target, methodName, index) => {
        params.push({ target, methodName, index, paramName });
    };
}
exports.routeParam = routeParam;
function route(route) {
    return (...args) => {
        switch (args.length) {
            case 1:
                return routeClass(route).apply(this, args);
            case 2:
                throw new Error('decorator @route not supported on properties.');
            case 3:
                if (typeof args[2] === "number") {
                    throw new Error('decorator @route not supported on parameters.');
                }
                return routeMethod(route).apply(this, args);
            default:
                throw new Error('unsupported decorator signature');
        }
    };
}
exports.route = route;
const routerImpl = new RouterImpl();
exports.router = routerImpl;
//# sourceMappingURL=index.js.map