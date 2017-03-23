# decorouter

Decorative Router - very lightweight client routing using TypeScript decorators and HTML5 History API.

## Example usage

```typescript
import { route, routeParam } from 'src/main/index.ts';

let content = document.getElementById('#content');

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

    @route('sub/*path')
    public noMatchSub(@routeParam('path') path:string) {
        content.innerText = 'sorry, nothing found at subpath sub/' + path;
    }

    @route('*path')
    public noMatch(@routeParam('path') path:string) {
        content.innerText = 'sorry, nothing found at ' + path;
    }
}
```

## Getting started

Install decorouter into your project using npm from GitHub:

```bash
npm install --save git+https://github.com/onlinegroupat/decorouter.git
```

Unfortunately there is no package at NPM yet.

## Prerequisites

The code is ES5 compatible, but requires the HTML5 History API and the ```Map``` class.
Be sure to polyfill if the browser you target does not support either of them. 