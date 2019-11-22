import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

@Component({
    selector: 'category-select',
    templateUrl: 'category-select.component.html',
    styleUrls: ['category-select.component.css']
})
export class CategorySelectComponent extends DialogComponent<{ categories: any[], categoryNo: number }, number> {

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    categories: any[];
    categoryNo: number

    handleSelect(categoryNo) {
        this.result = categoryNo;
        this.close();
    }

    handleCancel() {
        this.result = null;
        this.close();
    }
}