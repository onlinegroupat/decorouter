"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Route = require("route-parser");
const methods = [];
const params = [];
const objects = [];
class RouterImpl {
    constructor() {
        this.routes = new Map();
    }
    init() {
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
        console.log('currentPath ', currentPath);
        return currentPath;
    }
    buildRoutes() {
        for (let objectEntry of objects) {
            for (let methodEntry of methods) {
                if (objectEntry.obj instanceof methodEntry.target.constructor) {
                    let routePath = this.combinePath(objectEntry.path, methodEntry.path);
                    let route = new Route(routePath);
                    let handler = (params) => this.handleRoute(objectEntry, methodEntry, params);
                    this.routes.set(route, handler);
                }
            }
        }
    }
    handleRoute(objectEntry, methodEntry, routeParams) {
        // build argument list
        let args = [];
        for (let paramEntry of params) {
            // check class
            if (objectEntry.obj instanceof paramEntry.target.constructor) {
                // check method
                if (methodEntry.methodName == paramEntry.methodName) {
                    args[paramEntry.index] = routeParams[paramEntry.paramName];
                }
            }
        }
        console.log('built args', args);
        // call method
        objectEntry.obj[methodEntry.methodName].call(objectEntry.obj, args);
    }
    navigateToPath(path) {
        let found = false;
        for (let [route, handler] of this.routes) {
            let match = route.match(path);
            if (match) {
                handler(match);
                found = true;
                break;
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
    maybeAddState(target, methodName) {
    }
}
function routeMethod(path) {
    return (target, methodName, descriptor) => {
        descriptor.value.__decorouter_path = path;
        let original = descriptor.value;
        // inject wrapper
        descriptor.value = function () {
            // TODO: ensure the currentPath matches our route pattern
            routerImpl.maybeAddState(target, methodName);
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