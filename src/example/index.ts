
import {route, router, routeParam, HashLocationProvider} from '../main/index';

@route('/')
class Example {
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

    @route('*')
    public noMatch() {
        content.innerText = 'sorry, nothing found';
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

router.init(new HashLocationProvider());
