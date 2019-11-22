import {Component, Input} from '@angular/core';

@Component({
    selector: 'product-rank-options',
    templateUrl: './product-rank-option-value.component.html',
    styleUrls: ['./product-rank-option-value.component.css']
})
export class ProductRankOptionValueComponent{

    @Input() rank:number;
    @Input() rankGap: number;
    math: Math = Math;
}


