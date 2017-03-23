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
var index_1 = require("../main/index");
var Example = (function () {
    function Example() {
    }
    Example.prototype.index = function () {
        content.innerText = 'hello, index';
    };
    Example.prototype.test1 = function () {
        content.innerText = 'hello, test1';
    };
    Example.prototype.test2 = function () {
        content.innerText = 'hello, test2';
    };
    Example.prototype.custom = function (value) {
        content.innerText = 'hello, ' + value;
    };
    Example.prototype.noMatchSub = function (path) {
        content.innerText = 'sorry, nothing found at subpath sub/' + path;
    };
    Example.prototype.noMatch = function (path) {
        content.innerText = 'sorry, nothing found at ' + path;
    };
    return Example;
}());
__decorate([
    index_1.route('')
], Example.prototype, "index", null);
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
    index_1.route('sub/*path'),
    __param(0, index_1.routeParam('path'))
], Example.prototype, "noMatchSub", null);
__decorate([
    index_1.route('*path'),
    __param(0, index_1.routeParam('path'))
], Example.prototype, "noMatch", null);
Example = __decorate([
    index_1.route('/')
], Example);
var example = new Example();
var content = document.getElementById('content');
var test1 = document.getElementById('test1');
var test2 = document.getElementById('test2');
var test3 = document.getElementById('test3');
test1.onclick = function (e) {
    e.preventDefault();
    example.test1();
    return false;
};
var servedAsFile = location.protocol.indexOf('file') === 0;
index_1.router.init(servedAsFile ? new index_1.HashLocationProvider() : new index_1.PathLocationProvider('/'));
//# sourceMappingURL=index.js.map