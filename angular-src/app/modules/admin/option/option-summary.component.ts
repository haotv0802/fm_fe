import {BlockUIService} from "../../../shared/services/block-ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from "ng2-bootstrap-modal";
import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {OptionSummary, OptionSummaryFilter} from "../models/option";
import {KeyValue} from "../models/keyValue";
import {OptionSummaryService} from "../services/option-summary-service";
import {BadRequestResponse} from "../../../shared/models/bad-request-response";
import {AlertComponent} from "../../../common/alert/alert.component";
import RouteUtils from "../../../shared/utils/RouteUtils";
import {Subscription} from "rxjs/Subscription";

const CURRENT_URL = '/admin/option-summary';

@Component({
    moduleId: module.id,
    templateUrl: 'option-summary.component.html',
    styleUrls: ['option-summary.component.css']
})
export class OptionSummaryComponent implements OnInit {

    optionSummaries: OptionSummary[];

    categories: KeyValue[];

    optionSummaryFilter: OptionSummaryFilter = new OptionSummaryFilter();

    navSubscription: Subscription;

    constructor(private optionSummaryService: OptionSummaryService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService,
                private dialogService: DialogService) {
        this.blockUI.vRef = this.viewContainerRef;


    }

    ngOnInit(): void {
        this.displayCategories();
        this.displayOptionSummaries();

        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
            let params = RouteUtils.extractParams(this.route, {});
            this.optionSummaryFilter = new OptionSummaryFilter();
            this.optionSummaryFilter.bind(params);
        });
    }

    exportExcel() {
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.optionSummaryFilter.unbind());
        this.optionSummaryService.exportExcel(this.optionSummaryFilter);
    }

    search() {
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.optionSummaryFilter.unbind());
        this.displayOptionSummaries();
    }

    displayOptionSummaries() {
        this.blockUI.start();
        this.optionSummaryService.getOptionSummaries(this.optionSummaryFilter).subscribe(serverResponse => {
            switch(serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.showErrorPopup(badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    let response = serverResponse;
                    this.optionSummaries = response.data as OptionSummary[];
                    this.blockUI.stop();
                }
                default:
                    this.blockUI.stop();
            }
        }, error => {
            this.blockUI.stop();
        });
    }

    displayCategories() {
        this.blockUI.start();
        this.optionSummaryService.getCategories().subscribe(serverResponse => {
            switch(serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.showErrorPopup(badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    break;
                }
                case 'OK': {
                    let response = serverResponse;
                    this.categories = response.data as KeyValue[];
                    this.blockUI.stop();
                }
                default:
                    this.blockUI.stop();
            }
        }, error => {
            this.blockUI.stop();
        });
    }

    showErrorPopup(message: string){
        this.dialogService.addDialog(AlertComponent, {
            title:'Exception',
            message: message,

        }).subscribe(()=>{});
    }

    settings: object = {
        table: {
            sort: {
                column: 'no',
                type: 'asc'
            }
        },
        column: {
            date: {
                title: '일자',
                width: '80px',
                align: "center"
            },
            competitor: {
                title: '경쟁사',
                width: '80px',
                align: "center"
            },
            category: {
                title: '카테고리',
                width: '100px',
                align: "center"
            },
            dealNumber: {
                title: '딜번호',
                width: '200px',
                align: "center"
            },
            dealName: {
                title: '딜명',
                width: '200px',
                align: "center"
            },
            optionNumber: {
                title: '옵션번호',
                width: '200px',
                align: "center"
            },
            optionTitle: {
                title: '옵션명',
                width: '200px',
                align: "center"
            },
            price: {
                title: '판매가',
                width: '80px',
                align: "center"
            },
            sellCount: {
                title: '판매수량',
                width: '80px',
                align: "center"
            },
            sales: {
                title: '매출액',
                width: '80px',
                align: "center"
            },
            sellStartTime: {
                title: '판매시작시간',
                width: '80px',
                align: "center"
            },
            sellEndTime: {
                title: '판매종료시간',
                width: '80px',
                align: "center"
            }
        }
    };
}