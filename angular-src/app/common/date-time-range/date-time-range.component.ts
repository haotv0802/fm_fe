import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker'
import {DialogService} from "ng2-bootstrap-modal";
import {TranslateService} from "@ngx-translate/core";
import {createIMyDateModel, showErrorPopup} from "../../shared/utils";

@Component({
    selector: 'date-time-range',
    templateUrl: 'date-time-range.component.html',
    styleUrls: ['date-time-range.component.css']
})
export class DateTimeRangeComponent {
    @Input() startDate: IMyDateModel;
    @Output() startDateChange: EventEmitter<IMyDateModel> = new EventEmitter<IMyDateModel>();

    @Input() endDate: IMyDateModel;
    @Output() endDateChange: EventEmitter<IMyDateModel> = new EventEmitter<IMyDateModel>();

    @Input() hourAtStartDate: string;
    @Output() hourAtStartDateChange: EventEmitter<string> = new EventEmitter<string>();

    @Input() minuteAtStartDate: string;
    @Output() minuteAtStartDateChange: EventEmitter<string> = new EventEmitter<string>();

    @Input() hourAtEndDate: string;
    @Output() hourAtEndDateChange: EventEmitter<string> = new EventEmitter<string>();

    @Input() minuteAtEndDate: string;
    @Output() minuteAtEndDateChange: EventEmitter<string> = new EventEmitter<string>();

    @Input() numberOfLastDaysAllowed: number;

    @Input() required: boolean = false;

    @Input() displayMinute: string;

    myDatePickerOptions: IMyDpOptions = {
        todayBtnTxt: 'Today',
        dateFormat: 'yyyy-mm-dd',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        inline: false
    };

    hoursInDay = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    minutesInHour = ['00', '10', '20', '30', '40',  '50'];




    constructor(private dialogService: DialogService, private translateService: TranslateService) {
    }

// event properties are: event.date, event.jsdate, event.formatted and event.epoc
    handleStartDateChange(event: IMyDateModel) {
        this.startDate = event;
        this.startDateChange.emit(event);
        if(this.numberOfLastDaysAllowed != undefined) {
            let cDate = this.startDate;
            let selectedDate = new Date(cDate.date.year, cDate.date.month - 1, cDate.date.day);
            let lastAllowedDays = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * this.numberOfLastDaysAllowed));
            if (selectedDate < lastAllowedDays) {
                this.startDate = createIMyDateModel(new Date());
                event = createIMyDateModel(new Date());
                this.startDateChange.emit(event);
                let message = this.translateService.instant('message.error_select_date_range').replace("{}", this.numberOfLastDaysAllowed)
                showErrorPopup(this.dialogService, this.translateService, message);
            }
        }


    }

    handleEndDateChange(event: IMyDateModel) {
        this.endDate = event;
        this.endDateChange.emit(event);
        if(this.numberOfLastDaysAllowed != undefined) {
            let cDate = this.endDate;
            let selectedDate = new Date(cDate.date.year, cDate.date.month - 1, cDate.date.day);
            let lastAllowedDays = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * this.numberOfLastDaysAllowed));
            if (selectedDate < lastAllowedDays || selectedDate < this.startDate.jsdate ) {
                this.endDate = this.startDate;
                event = createIMyDateModel(this.startDate.jsdate);
                this.endDateChange.emit(event);
                let message = this.translateService.instant('message.error_select_date_range').replace("{}", this.numberOfLastDaysAllowed)
                showErrorPopup(this.dialogService, this.translateService, message);
            }
        }
    }

    onSelectHourAtStartDate(event) {
        this.hourAtStartDate =  event.target.value;
        this.hourAtStartDateChange.emit(event.target.value);
    }

    onSelectMinuteAtStartDate(event) {
        this.minuteAtStartDate =  event.target.value;
        this.minuteAtStartDateChange.emit(event.target.value);
    }
    onSelectHourAtEndDate(event) {
        this.hourAtEndDate =  event.target.value;
        this.hourAtEndDateChange.emit(event.target.value);
    }
    onSelectMinuteAtEndDate(event) {
        this.minuteAtEndDate =  event.target.value;
        this.minuteAtEndDateChange.emit(event.target.value);
    }

    handleSelectLastDate(forStartDate: boolean, event) {

    }


}