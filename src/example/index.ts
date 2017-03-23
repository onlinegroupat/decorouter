
import {route, router, routeParam, HashLocationProvider, PathLocationProvider} from '../main/index';

@route('/')
class Example {

    @route('')
    public index() {
        content.innerText = 'hello, index';
    }

    @route('test1')
    public test1() {
        content.innerText = 'hello, test1';
    }

    @route('test2')
    public test2() {
        content.innerText = 'hello, test2';
    }

    @route('custom/:value')
    public custom(@routeParam('value') value:string) {
        content.innerText = 'hello, ' + value;
    }

    @route('multi/:param(/value/:value)')
    public multi(@routeParam('param') param:string, @routeParam('value') value:string) {
        content.innerText = `multi: param = ${param} and value = ${value}`;
    }

    @route('sub/*path')
    public noMatchSub(@routeParam('path') path:string) {
        content.innerText = 'sorry, nothing found at subpath sub/' + path;
    }

    @route('*path')
    public noMatch(@routeParam('path') path:string) {
        content.innerText = 'sorry, nothing found at ' + path;
    }
}

let example = new Example();

let content = document.getElementById('content');
let test1 = document.getElementById('test1');
let test2 = document.getElementById('test2');
let test3 = document.getElementById('test3');

test1.onclick = (e) => {
    e.preventDefault();
    example.test1();
    return false;
};

let servedAsFile = location.protocol.indexOf('file') === 0;
router.init(servedAsFile ? new HashLocationProvider() : new PathLocationProvider('/'));
