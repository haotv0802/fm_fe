import {
    Component,
    Input,
    Output,
    ContentChildren,
    EventEmitter
} from '@angular/core';

import {TabComponent} from './tab.component';

@Component({
    selector: 'tabset',
    template: `
    <section class="tab-set">
      <ul
        class="nav"
        [class.nav-pills]="vertical"
        [class.nav-tabs]="!vertical">
        <li
          *ngFor="let tab of tabs"
          [class.active]="tab.active">
          <a
            (click)="tabClicked(tab)"
            class="btn"
            [class.disabled]="tab.disabled">
            <span>{{tab.title}}</span>
          </a>
        </li>
      </ul>
      <div class="tab-content">
        <ng-content></ng-content>
      </div>
    </section>
  `,
    styleUrls: ['./tab.component.css']
})
export class TabsetComponent {

    @Input() vertical;
    @Output() onSelect = new EventEmitter();
    @ContentChildren(TabComponent) tabs;

    ngAfterContentInit() {
        const tabs = this.tabs.toArray();
        const actives = this.tabs.filter(t => { return t.active });

        if(actives.length > 1) {
            console.error(`Multiple active tabs set 'active'`);
        } else if(!actives.length && tabs.length) {
            tabs[0].active = true;
        }
    }

    tabClicked(tab) {
        const tabs = this.tabs.toArray();

        tabs.forEach(tab => tab.active = false);
        tab.active = true;

        this.onSelect.emit(tab);
    }

}

export const TAB_COMPONENTS = [
    TabsetComponent,
    TabComponent
];