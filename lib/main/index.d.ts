export interface Router {
    init(): void;
}
export declare function routeMethod(path: string): Function;
export declare function routeClass(path?: string): Function;
export declare function routeParam(target: any, key: string, index: number): void;
export declare function route(route: string): (...args: any[]) => any;
export declare const router: Router;
