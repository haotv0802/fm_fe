import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

/**
 * filterSources: any = [
        {key: 'a', label: 'label a', selected: true},
        {key: 'b', label: 'label b'},
        {key: 'c', label: 'label c'},
    ];
 * selectedVal: string = 'a';
 * 
 * <filter-btn [sources]="filterSources" label="xxx" (onSelect)="handleClickFilter($event)"></filter-btn>
 */

@Component({
    selector: 'filter-btn',
    templateUrl: 'filter-btn.component.html',
    styleUrls: ['filter-btn.component.css']
})
export class FilterBtnComponent {
    @Input() sources: { key: string, label: string, selected?: boolean }[];
    @Input() label?: string;
    @Input() single: boolean = false;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();

    selectedItems: string[];

    constructor() { }

    handleClick(item) {
        let isSelected = !item.selected;

        if (this.single !== false) {
            this.sources.forEach(e => {
                e.selected = false;
            });
        }
        
        item.selected = isSelected;
        this.onSelect.emit(item);
    }
}

