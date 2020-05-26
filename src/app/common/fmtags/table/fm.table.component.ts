import {Component, Input, OnChanges, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'fm-table',
  moduleId: module.id,
  templateUrl: 'fm.table.component.html'
})
export class FmTableComponent implements OnChanges {
  ngOnChanges(): void {
    // console.log("LoaderComponent, ngOnChanges " + this.opening);
  }
}
