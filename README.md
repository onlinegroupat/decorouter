# Decorouter

The Decorative Router - very lightweight client routing using TypeScript decorators and HTML5 History API.

## Usage

```typescript
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
```

