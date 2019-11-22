import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker'
import {DialogService} from "ng2-bootstrap-modal";
import {createIMyDateModel, getCurrentDate, showErrorPopup} from "../../shared/utils";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'date-range',
    templateUrl: 'date-range.component.html',
    styleUrls: ['date-range.component.css']
})
export class DateRangeComponent {
    @Input() startDate: IMyDateModel;
    @Output() startDateChange: EventEmitter<IMyDateModel> = new EventEmitter<IMyDateModel>();

    @Input() endDate: IMyDateModel;
    @Output() endDateChange: EventEmitter<IMyDateModel> = new EventEmitter<IMyDateModel>();

    @Input() required: boolean = false;

    myDatePickerOptions: IMyDpOptions = {
        todayBtnTxt: 'Today',
        dateFormat: 'yyyy-mm-dd',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        inline: false
    };


    constructor(private dialogService: DialogService, private translateService: TranslateService) {
    }

// event properties are: event.date, event.jsdate, event.formatted and event.epoc
    handleStartDateChange(event: IMyDateModel) {
        this.startDate = event;
        this.startDateChange.emit(event);

        // let selectedDate = new Date(this.startDate.date.year, this.startDate.date.month - 1, this.startDate.date.day);
        // let last30Days = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 30));
        // if(selectedDate < last30Days){
        //     showErrorPopup(this.dialogService, this.translateService, "message.error_select_date_range");
        //     this.startDate = createIMyDateModel(new Date());
        //     event = createIMyDateModel(new Date());
        //     this.startDateChange.emit(event);
        // }


    }

    handleEndDateChange(event: IMyDateModel) {
        this.endDate = event;
        this.endDateChange.emit(event);
    }


}