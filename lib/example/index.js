"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../main/index");
let Example = class Example {
    test1() {
        content.innerText = 'hello, test1';
    }
    test2() {
        content.innerText = 'hello, test2';
    }
    custom(value) {
        content.innerText = 'hello, ' + value;
    }
    noMatch() {
        content.innerText = 'sorry, nothing found';
    }
};
__decorate([
    index_1.route('test1')
], Example.prototype, "test1", null);
__decorate([
    index_1.route('test2')
], Example.prototype, "test2", null);
__decorate([
    index_1.route('custom/:value'),
    __param(0, index_1.routeParam('value'))
], Example.prototype, "custom", null);
__decorate([
    index_1.route('*')
], Example.prototype, "noMatch", null);
Example = __decorate([
    index_1.route('/')
], Example);
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
index_1.router.init(new index_1.HashLocationProvider());
//# sourceMappingURL=index.js.map