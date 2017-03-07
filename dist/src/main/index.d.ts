export interface LocationProvider {
    location: string;
}
export interface Router {
    init(locationProvider: LocationProvider): void;
}
export declare class HashLocationProvider {
    location: string;
}
export declare function routeMethod(path: string): Function;
export declare function routeClass(path?: string): Function;
export declare function routeParam(paramName: string): (target: any, methodName: string, index: number) => void;
export declare function route(route: string): (...args: any[]) => any;
export declare const router: Router;
