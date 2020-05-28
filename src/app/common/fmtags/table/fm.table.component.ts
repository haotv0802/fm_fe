import {Component, OnChanges} from '@angular/core';

@Component({
  selector: 'fm-table',
  templateUrl: 'fm.table.component.html'
})
export class FmTableComponent implements OnChanges {
  ngOnChanges(): void {
    // console.log("LoaderComponent, ngOnChanges " + this.opening);
  }
}
