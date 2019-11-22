import {Component, Input} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: 'tab',
    template: `
    <ng-content *ngIf="active"></ng-content>
  `,
    styleUrls: ['./tab.component.css']
})
export class TabComponent {

    @Input() title = '';
    @Input() active = false;
    @Input() disabled = false;

}