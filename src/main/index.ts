import * as Route from 'route-parser';

interface MethodEntry {
    target:typeof Object;
    methodName:string;
    path:string;
}

interface ParamEntry {
    target:typeof Object;
    methodName:string;
    index:number;
    paramName:string;
}

interface ObjectEntry {
    obj:Object;
    path?:string;
}

const methods:MethodEntry[] = [];
const params:ParamEntry[] = [];
const objects:ObjectEntry[] = [];

type RouteParams = { [key:string]:string }

export interface LocationProvider {
    location:string;
}

export interface Router {
    init(locationProvider:LocationProvider):void;
}

class PathUtil {

    private static MultiSlashRegex = /\/[\/]+/g;

    public static combinePath(path1:string, path2:string) {
        path1 = path1 || '';
        path2 = path2 || '';

        let path = path1 + '/' + path2;

        return path.replace(PathUtil.MultiSlashRegex, '/');
    }
}

export class HashLocationProvider implements LocationProvider {
    get location():string {
        let currentPath = window.location.hash;
        if (currentPath && currentPath.indexOf('#') === 0) {
            currentPath = currentPath.substring(1);
        }
        return currentPath;
    }

    set location(location:string) {
        window.location.hash = '#' + location;
    }
}

export class PathLocationProvider implements LocationProvider {

    constructor(private basePath:string|null = null) {
    }

    get location():string {
        let pathName = window.location.pathname;
        if (this.basePath) {
            if (pathName.indexOf(this.basePath) !== 0) {
                throw 'basePath not in current window.location.pathname';
            }
            return pathName.substring(this.basePath.length);
        }
        else {
            return pathName;
        }
    }

    set location(location:string) {
        if (location != this.location) {
            let newPath = this.basePath ? PathUtil.combinePath(this.basePath, location) : location;
            history.pushState(null, '', newPath);
        }
    }
}

class RouterImpl implements Router {

    private routes:Map<Object, Map<string, Route>> = new Map<Object, Map<string, Route>>();

    private locationProvider:LocationProvider;

    constructor() {
    }

    public init(locationProvider:LocationProvider):void {

        if (!locationProvider) {
            throw new Error('locationProvider was not specified.');
        }

        this.locationProvider = locationProvider;

        this.buildRoutes();

        window.onpopstate = () => {
            this.navigateToPath(this.locationProvider.location);
        };

        this.navigateToPath(this.locationProvider.location);
    }

    private buildRoutes() {

        for (let objectEntry of objects) {
            for (let methodEntry of methods) {

                if (objectEntry.obj instanceof methodEntry.target.constructor) {
                    let routePath = objectEntry.path ? PathUtil.combinePath(objectEntry.path, methodEntry.path) : methodEntry.path;

                    this.addRoute(objectEntry.obj, methodEntry.methodName, new Route(routePath));
                }
            }
        }
    }

    private addRoute(obj:Object, methodName:string, route:Route) {
        let methodRoute = this.routes.get(obj);
        if (!methodRoute) {
            methodRoute = new Map<string, Route>();
            this.routes.set(obj, methodRoute);
        }
        methodRoute.set(methodName, route);
    }

    private handleRoute(obj:any, methodName:string, routeParams:RouteParams) {
        // build argument list
        let args:any[] = [];
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
        obj[methodName].call(obj, ...args);
    }

    private navigateToPath(path:string):boolean {

        if (!path) {
            path = '/';
        }

        for (let [obj, methodRoutes] of Array.from(this.routes.entries())) {
            for (let [methodName, route] of Array.from(methodRoutes.entries())) {
                let match = route.match(path);
                if (match) {
                    this.handleRoute(obj, methodName, match as RouteParams);
                    return true;
                }
            }
        }
        return false;
    }


    public maybeAddState(obj:any, methodName:string, args:IArguments) {
        let methodRoutes = this.routes.get(obj);
        if (methodRoutes) {
            let route = methodRoutes.get(methodName);
            if (route) {
                let routeParams:RouteParams = {};

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
                    this.locationProvider.location = newState as string;
                }
            }
        }
    }
}

export function routeMethod(path:string):Function {
    return (target: typeof Object, methodName: string, descriptor: TypedPropertyDescriptor<any>) => {

        methods.push({target, methodName, path});

        let original = descriptor.value;

        // inject wrapper
        descriptor.value = function() {
            // add state
            routerImpl.maybeAddState(this, methodName, arguments);

            // call original
            original.apply(this, arguments);
        };

        return descriptor;
    };
}

export function routeClass(path?:string):Function {
    return (target:typeof Object) => {

        return class Wrapper extends target {
            constructor() {
                super();
                objects.push({ obj: this, path: path });
            }
        }
    };
}

export function routeParam(paramName:string) {
    return (target:any, methodName:string, index:number) => {
        params.push( {target, methodName, index, paramName });
    };
}

export function route(route:string) {
    return (...args : any[]) => {
        switch(args.length) {
            case 1:
                return routeClass(route).apply(this, args);
            case 2:
                throw new Error('decorator @route not supported on properties.');
            case 3:
                if(typeof args[2] === "number") {
                    throw new Error('decorator @route not supported on parameters.');
                }
                return routeMethod(route).apply(this, args);
            default:
                throw new Error('unsupported decorator signature');
        }
    }
}

const routerImpl = new RouterImpl();

export const router:Router = routerImpl;