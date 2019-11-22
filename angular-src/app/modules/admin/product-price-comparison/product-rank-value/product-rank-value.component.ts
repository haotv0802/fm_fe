import {Component, Input} from '@angular/core';

@Component({
    selector: 'product-rank',
    templateUrl: './product-rank-value.component.html',
    styleUrls: ['./product-rank-value.component.css']
})
export class ProductRankValueComponent{

    @Input() rank:number;
    @Input() rankGap: number;
    math: Math = Math;
}


