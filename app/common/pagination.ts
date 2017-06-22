export class Pagination {
  content: Array<any>;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  numberOfPages: number;

  // constructor() {
  // }

  constructor(slice: any, count: number) {
    this.content = slice.content;
    this.size = slice.size;
    this.number = slice.number + 1;
    this.first = slice.first;
    this.last = slice.last;
    this.numberOfElements = slice.numberOfElements;
    this.numberOfPages = Math.ceil(count / this.size);
  }
}