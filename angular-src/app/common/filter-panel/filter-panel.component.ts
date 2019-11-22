import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

@Component({
    selector: 'filter-panel',
    templateUrl: 'filter-panel.component.html',
    styleUrls: ['filter-panel.component.css']
})
export class FilterPanelComponent {
    @Input() title?: string;
    @Input() expanded?: boolean = true;

    handleExpand() {
        this.expanded = !this.expanded;
    }
}

