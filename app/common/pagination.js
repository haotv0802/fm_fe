"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pagination = (function () {
    // constructor() {
    // }
    function Pagination(slice, count) {
        this.content = slice.content;
        this.size = slice.size;
        this.number = slice.number + 1;
        this.first = slice.first;
        this.last = slice.last;
        this.numberOfElements = slice.numberOfElements;
        this.numberOfPages = Math.ceil(count / this.size);
    }
    return Pagination;
}());
exports.Pagination = Pagination;
//# sourceMappingURL=pagination.js.map