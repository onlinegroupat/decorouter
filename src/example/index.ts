
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

    @route('param/:value')
    public param(@routeParam('value') value:string) {
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

let content = document.getElementById('content') || document.createElement('div');

let test1 = document.getElementById('test1');
let test2 = document.getElementById('test2');
let param = document.getElementById('param');
let multi = document.getElementById('multi');

if (test1) {
    test1.onclick = (e) => {
        e.preventDefault();
        example.test1();
        return false;
    };
}

if (test2) {
    test2.onclick = (e) => {
        e.preventDefault();
        example.test2();
        return false;
    };
}

if (param) {
    param.onclick = (e) => {
        e.preventDefault();
        example.param('programmatic value');
        return false;
    };
}

if (multi) {
    multi.onclick = (e) => {
        e.preventDefault();
        example.multi('foo2', 'bar2');
        return false;
    };
}

let servedAsFile = location.protocol.indexOf('file') === 0;
router.init(servedAsFile ? new HashLocationProvider() : new PathLocationProvider());
