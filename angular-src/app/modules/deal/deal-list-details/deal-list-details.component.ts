import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {IMyDpOptions} from "mydatepicker";
import RouteUtils from "../../../shared/utils/RouteUtils";
import {ActivatedRoute, Router} from "@angular/router";
import {BlockUIService} from "../../../shared/services/block-ui.service";
import {DialogService} from "ng2-bootstrap-modal";
import {LanguageService} from "../../../shared/services/language.service";
import {PageRequest} from "../../../shared/models/page-request";
import {Subscription} from "rxjs/Subscription";
import {BadRequestResponse} from "../../../shared/models/bad-request-response";
import {DealerSaleInfo, DealSaleCategory, DealSaleCategoryPageResponse, DealSaleFilter} from "../models/deal-sale";
import {DealService} from "../services/deal-service";
import {AlertComponent} from "../../../common/alert/alert.component";
import {Pagination} from "../../../shared/models/pagination";
import {TranslateService} from "@ngx-translate/core";
import {RowListDetailsComponent} from "./row-list-details/row-list-details.component";


const CURRENT_URL = '/deal-list-details';


@Component({
    selector: 'app-deal-list-details',
    templateUrl: './deal-list-details.component.html',
    styleUrls: ['./deal-list-details.component.css']
})
export class DealListDetailsComponent implements OnInit, OnDestroy {


    constructor(private dealService: DealService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private translateService: TranslateService,
                private blockUI: BlockUIService, private dialogService: DialogService, private languageService: LanguageService) {
        this.blockUI.vRef = this.viewContainerRef;
        this.languageService.getLanguage();

    }

    navSubscription: Subscription;

    apiData: any
    sources: any = []
    providers: any = []
    previousCellActionIndex: number = -1;
    options: any = []

    ngOnInit(): void {
        this.initTableColumn();
        this.handleApiRequest();
    }

    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
    }

    handleApiRequest(): void {
        this.resetPreviousCellClick();
        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
            let contextRoot = event["url"];
            let params = RouteUtils.extractParams(this.route, {});
            if (contextRoot != CURRENT_URL) {
                // if(params['_viewCorrected'] === 'true')
                //     this.searchFilter.viewCorrected = true;

                this.searchFilter.bind(params);
                this.pagination = new Pagination(new PageRequest);
                this.onFindListDealDetails()
            }
        });
    }

    cat1: Array<string> = []
    cat2: Array<string> = []

    pagination: Pagination = new Pagination(new PageRequest);

    searchFilter: DealSaleFilter = new DealSaleFilter();

    myDatePickerOptions: IMyDpOptions = {
        todayBtnTxt: 'Today',
        dateFormat: 'yyyy-mm-dd',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        inline: false
    };

    cat1Depths: any[] = [
        {key: '0', label: '기타'},
        {key: '4', label: '지역'},
        {key: '8', label: '전국'},
        {key: '12', label: '투어'},
        {key: '20', label: '컬쳐'},
        {key: '24', label: '나우'},
        {key: '130', label: '쇼핑'},
        {key: '134', label: '패션'}
    ];

    cat2Depths: any[] = [
        {key: '', label: '전체'},
        {key: '88', label: '레저/리조트'},
        {key: '92', label: '호텔'},
        {key: '96', label: '숙박'},
        {key: '100', label: '국내여행'},
        {key: '104', label: '해외여행'},
        {key: '108', label: '제주여행'},
        {key: '112', label: '뮤지컬'},
        {key: '116', label: '연극'},
        {key: '120', label: '콘서트'},
        {key: '124', label: '클래식'},
        {key: '128', label: '전시/체험'},
        {key: '142', label: '컬쳐 기타'},
        {key: '36', label: '식품'},
        {key: '44', label: '가전'},
        {key: '56', label: '뷰티'},
        {key: '60', label: '생활'},
        {key: '64', label: '육아'},
        {key: '76', label: '홈데코'},
        {key: '138', label: '도서/교육'},
        {key: '52', label: '패션의류'},
        {key: '68', label: '패션잡화'},
        {key: '72', label: '스포츠/레저'}

    ];

    onSearch(): void {
        this.resetPreviousCellClick();
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.searchFilter.unbind());
    }

    onReset(): void {
        this.searchFilter = new DealSaleFilter();
        this.resetOldData();
        this.pagination = new Pagination(new PageRequest);
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.searchFilter.unbind());
    }

    onPaginationChanged(event: any): void {
        if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
            this.pagination.pageRequest.page = event.page - 1;
            this.resetPreviousCellClick();
            this.onFindListDealDetails();
        }
    }

    private onFindListDealDetails() {

        // this.subRows = {}; // hide all subrows
        this.blockUI.start();

        this.dealService.getDealDealListDetails(this.searchFilter, this.pagination.pageRequest).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.showErrorPopup(badRequestResponse.exceptionMsg)
                    this.blockUI.stop()
                    break;
                }
                case 'OK': {
                    this.resetOldData();
                    let pageResponse = serverResponse as DealSaleCategoryPageResponse;
                    this.apiData = pageResponse.data;
                    this.parseApiData(pageResponse.data)
                    this.pagination.totalItems = pageResponse.pagination.total;

                    //reload table
                    this.initTableColumn();
                    this.blockUI.stop();
                }
                default:
                    this.blockUI.stop()
            }


        }, error => {
            console.log('error to find deal sales', error);
            this.blockUI.stop();
        });

    }

    parseApiData(data: DealSaleCategory[]): void {

        if (data != null) {

            let dealers = []
            let totalSales: number = 0

            data = data.sort((a, b) => a.items.length - b.items.length)

            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                var items = obj.items
                dealers.push(new DealerSaleInfo(obj.name, obj.totalSales, obj.countNew, obj.totalDeals))
                totalSales += obj.totalSales;

                for (var j = 0; j < items.length; j++) {
                    var dealSale = items[j];
                    var msCat1Title = 'msCat1Title' + (i + 1);
                    var dealId = 'dealId' + (i + 1);
                    var dealTitle = 'dealTitle' + (i + 1);
                    var sale = 'sale' + (i + 1);

                    if (i == 0) {
                        var deals = {
                            'idx': j + 1,
                            msCat1Title1: dealSale.msCat1Title,
                            dealId1: dealSale.dealId,
                            dealTitle1: dealSale.title,
                            sale1: dealSale.sales.toLocaleString()
                        }
                        this.sources.push(deals)
                    } else {
                        this.sources[j][msCat1Title] = dealSale.msCat1Title;
                        this.sources[j][dealId] = dealSale.dealId;
                        this.sources[j][dealTitle] = dealSale.title;
                        this.sources[j][sale] = dealSale.sales.toLocaleString();

                    }
                }
            }
            //parsing dealer info
            for(let d of dealers){
                var deal = {
                    'name' : d.name.toUpperCase(),
                    'percentage' : (d.totalSales*100/totalSales).toFixed(2),
                    'totalSales' : totalSales,
                    'sale': d.totalSales,
                    'totalDeals': d.totalDeals,
                    'countNew': d.countNew
                }
                this.providers.push(deal);
            }
        }
    }

    showErrorPopup(message: string) {
        this.dialogService.addDialog(AlertComponent, {
            title: 'Exception',
            message: message,

        }).subscribe(() => {
        });
    }

    handleClickCat1Depth(event) {
        this.parseBtnFilterValue(this.cat1, event);
        this.searchFilter.setPropValue('cat1', this.cat1.filter(Boolean))


    }

    handleClickCat2Depth(event) {
        this.parseBtnFilterValue(this.cat2, event);
        this.searchFilter.setPropValue('cat2', this.cat2.filter(Boolean));
    }

    // handleCheckboxCorrected(){
    //     if(this.searchFilter.viewCorrected == true)
    //         this.searchFilter._viewCorrected = 'true';
    //     else
    //         this.searchFilter._viewCorrected = 'false';
    // }

    parseBtnFilterValue(cat: Array<string>, event): void {
        if (event.selected) {
            cat.push(event.key);
        }
        else {
            const index: number = cat.indexOf(event.key);
            if (index !== -1) {
                cat.splice(index, 1);
            }
        }
    }

    subRows: object = {};
    settings: object = {
        table: {
            translate: true,
        },
        column: {
            idx: {
                title: ''
            }
        },
        row: {
            renderSubRow: (item: object, settings: object, rowIndex: number) => {
                if (this.subRows[rowIndex]) {
                    return {
                        component: RowListDetailsComponent

                        ,
                        inputs: {
                            sources: this.chartDetailsMockData,
                            options: this.options
                        }
                    };
                }
                return false;
            }
        }
    };

    chartDetailsMockData: any[] = [
        {date: "2018-03-01", data: 324957},
        {date: "2018-03-02", data: 652469472},
        {date: "2018-03-03", data: 24362460},
        {date: "2018-03-04", data: 84362460}
    ];

    handleTableChange(event) {
        console.log(event);
        if (event.action == 'sort') {
            // handle sort
        } else if (event.action == 'cellclick') {
            let rowIndex = event.data.rowIndex;
            this.subRows[rowIndex] = !this.subRows[rowIndex];

            if(this.previousCellActionIndex != rowIndex)
                this.subRows[this.previousCellActionIndex] = false;

            this.previousCellActionIndex = rowIndex;

            if(this.subRows[rowIndex]){
                let temp = event.data.item.dealId1;
                let dealId = "", coId = "";
                if(temp.length > 0){
                    temp = temp.split("_");
                    if(temp.length > 1){
                        dealId = temp[1];
                        coId = temp[0];
                    }
                    this.onFindDealOptions(coId, dealId);
                }

                //this.parseDataforOptionChart(data.item.startDate)

            }
        }
    }

    private onFindDealOptions(coId: string, dealId: string): void {

        this.blockUI.start();

        this.dealService.getListDealOption(coId, dealId).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.showErrorPopup(badRequestResponse.exceptionMsg)
                    this.blockUI.stop()
                    break;
                }
                case 'OK': {
                    // let optionsResponse = serverResponse as DealOptionsResponse;
                    // this.options = optionsResponse.data;
                    this.blockUI.stop();
                }
                default:
                    this.blockUI.stop()
            }


        }, error => {
            console.log('error to find deal sales', error);
            this.blockUI.stop();
        });
    }

    initTableColumn() {
        let column = this.providers.length > 0 ? this.settings['column'] : {
            idx: {
                title: ''
            }};
        let idx = 1
        let headerTitle = this.translateService.instant('table.headerTitle')
        let headerSubTitle = this.translateService.instant('table.headerSubTitle')
        let headerSubTitleSale = this.translateService.instant('table.headerSubTitleSale')

        for (let provider of this.providers) {
            var totalSales = (provider.sale/provider.totalDeals).toFixed(0)

            let nameTitle = headerTitle.replace("{0}", provider.name).replace("{1}", provider.percentage).replace("{2}", totalSales);
            let totalCountNew = headerSubTitle.replace('{0}', provider.totalDeals.toLocaleString()).replace('{1}', provider.countNew.toLocaleString())
            let headerSale = headerSubTitleSale.replace("{0}", provider.sale.toLocaleString())

            column['msCat1Title' + idx] = {
                title: [nameTitle, 'deal.msCat1Title', ''],
            };
            column['dealId' + idx] = {
                title: [nameTitle, 'deal.dealId', ''],
            };

            column['dealTitle' + idx] = {
                title: [nameTitle, 'deal.title',  totalCountNew],
                sortable: true
            };

            column['sale' + idx] = {
                title: [nameTitle, 'deal.sales',  headerSale],
                sortable: true,
                clickable: true
            };

            idx++

        }
        this.settings = {
            table: this.settings['table'],
            column: column,
            row: this.settings['row']
        };

    }

    resetOldData(): void {
        this.sources = [];
        this.providers = [];
        this.apiData = null;
        this.initTableColumn();
    }

    resetPreviousCellClick(): void {
        this.subRows[this.previousCellActionIndex] = false;
    }


}
