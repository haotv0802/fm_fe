import {Component, Input} from "@angular/core";
@Component({
    selector: 'block-ui',
    templateUrl: 'block-ui.component.html',
    styleUrls: ['block-ui.component.css']
})
export class BlockUIComponent {
    private state: any;

    constructor() {
        this.state = {message: 'Loading...'};
    }
}