import {Component, Input, OnChanges, Output, EventEmitter, Directive} from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'fm-table',
  templateUrl: 'fm.table.component.html'
})
export class FmTableComponent implements OnChanges {
  ngOnChanges(): void {
    // console.log("LoaderComponent, ngOnChanges " + this.opening);
  }
}
