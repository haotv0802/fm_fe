import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {BlockUIService} from '../../../shared/services/block-ui.service';
import {CompetitorService} from '../services/competitor-service';
import {IMyDpOptions} from 'mydatepicker';
import {
    CompetitorSummaryData,
    CompetitorSummaryFilter,
    CompetitorSummaryPageResponse,
    SaleItem,
    SaleProvider
} from '../models/competitor-sale';
import {DialogService} from 'ng2-bootstrap-modal';
import {LanguageService} from "../../../shared/services/language.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import RouteUtils from "../../../shared/utils/RouteUtils";
import {AlertComponent} from "../../../common/alert/alert.component";
import {BadRequestResponse} from "../../../shared/models/bad-request-response";
import {Subscription} from "rxjs/Subscription";
import * as moment from 'moment';
import {TranslateService} from "@ngx-translate/core";

const CURRENT_URL = '/competitor-summary';

@Component({
    selector: 'app-competitor-summary',
    templateUrl: './competitor-summary.component.html',
    styleUrls: ['./competitor-summary.component.css']
})



export class CompetitorSummaryComponent implements OnInit, OnDestroy {

    navSubscription: Subscription;

    ngOnInit(): void {
        this.handleApiRequest();
    }

    handleApiRequest(): void{
        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
                var contextRoot = event["url"];
                if(!contextRoot.startsWith(CURRENT_URL))
                    return;
                let params = RouteUtils.extractParams(this.route, {});
                if(contextRoot != CURRENT_URL){
                    this.competitorSummaryFilter.bind(params);
                    this.resetData();
                    this.onGetCompetitorSummary();
                }
            }
        );
    }

    ngOnDestroy(): void {

        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
    }

    constructor(private competitorService: CompetitorService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private translateService: TranslateService,
                private blockUI: BlockUIService, private dialogService: DialogService, private languageService : LanguageService) {
        this.blockUI.vRef = this.viewContainerRef;
        this.languageService.getLanguage();


    }

    competitors = [];
    providers = []
    total = 0

    monthForecastTitle: string

    chartData = []

    cat1: Array<string> = []
    cat2: Array<string> = []


    competitorSummaryFilter: CompetitorSummaryFilter = new CompetitorSummaryFilter();

    myDatePickerOptions: IMyDpOptions = {
        todayBtnTxt: 'Today',
        dateFormat: 'yyyy-mm-dd',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        inline: false
    };

    cat1Depths: any[] = [
        { key: '0', label: '기타' },
        { key: '4', label: '지역' },
        { key: '8', label: '전국' },
        { key: '12', label: '투어' },
        { key: '20', label: '컬쳐' },
        { key: '24', label: '나우' },
        { key: '130', label: '쇼핑' },
        { key: '134', label: '패션' }
    ];

    cat2Depths: any[] = [
        { key: '', label: '전체' },
        { key: '88', label: '레저/리조트' },
        { key: '92', label: '호텔' },
        { key: '96', label: '숙박' },
        { key: '100', label: '국내여행' },
        { key: '104', label: '해외여행' },
        { key: '108', label: '제주여행' },
        { key: '112', label: '뮤지컬' },
        { key: '116', label: '연극' },
        { key: '120', label: '콘서트' },
        { key: '124', label: '클래식' },
        { key: '128', label: '전시/체험' },
        { key: '142', label: '컬쳐 기타' },
        { key: '36', label: '식품' },
        { key: '44', label: '가전' },
        { key: '56', label: '뷰티' },
        { key: '60', label: '생활' },
        { key: '64', label: '육아' },
        { key: '76', label: '홈데코' },
        { key: '138', label: '도서/교육' },
        { key: '52', label: '패션의류' },
        { key: '68', label: '패션잡화' },
        { key: '72', label: '스포츠/레저' }

    ];

    handleClickCat1Depth(event) {
        this.parseBtnFilterValue(this.cat1, event);
        this.competitorSummaryFilter.setPropValue('cat1', this.cat1.filter(Boolean))


    }

    handleClickCat2Depth(event) {
        this.parseBtnFilterValue(this.cat2, event);
        this.competitorSummaryFilter.setPropValue('cat2', this.cat2.filter(Boolean));
    }

    parseBtnFilterValue(cat : Array<string>, event) : void {
        if(event.selected){
            cat.push(event.key);
        }
        else {
            const index: number = cat.indexOf(event.key);
            if (index !== -1) {
                cat.splice(index, 1);
            }
        }

    }

    onSearch(): void {
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.competitorSummaryFilter.unbind());
    }

    onReset(): void {
        this.competitorSummaryFilter = new CompetitorSummaryFilter();
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.competitorSummaryFilter.unbind());
    }

    private onGetCompetitorSummary(): void {

        this.blockUI.start();
        this.competitorService.getCompetitorSummary(this.competitorSummaryFilter).subscribe(serverResponse => {
            switch(serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.showErrorPopup(badRequestResponse.exceptionMsg)
                    this.blockUI.stop()
                    break;
                }
                case 'OK': {
                    let response = serverResponse as CompetitorSummaryPageResponse;
                    this.parseData(response.data)
                    this.blockUI.stop();
                }
                default:
                    this.blockUI.stop();
            }
        }, error => {
            console.log('error to find deal sales', error);
            this.blockUI.stop();
        });
    }

    private parseData(data: CompetitorSummaryData): void {
        this.blockUI.start();
        if (data != null) {
            let items = data.items;
            let sales = data.sales as Array<SaleProvider>;
            let forecasts = data.forecast;
            let mapCompetitorForecast = new Map();
            this.total = data.total;

            for (var item in items) {
                let _date = item.toString();

                let saleItem = items[item] as SaleItem;
                let providers = saleItem.providers as Array<SaleProvider>

                let _dateData = this.competitorSummaryFilter.unit == 'DAILY' ? _date + '(' + saleItem.saleWeekDay+')' : _date;

                if(this.competitorSummaryFilter.unit == 'WEEKLY'){
                    let currentYear = this.competitorSummaryFilter.startDate.jsdate.getFullYear()
                    _date = _date.split("-")[0];
                    _date = currentYear+''+_date;
                }else if(this.competitorSummaryFilter.unit == 'DAILY'){
                    _date = _date.replace("-","");
                }else{
                    let tmp = _date.split("-");
                    let d = tmp[1];
                    if(d.length == 1)
                        d = "0"+d;
                    _date = tmp[0]+""+d+"01";

                }


                let providerItems = []
                let providerChart = []
                for (let p of providers) {
                    let hrefLink = "/#/deal-list?coId={0}&typeSale={1}&typeSearch=0&pageLimit=100&_viewCorrected=false&startDate={2}&endDate={3}";
                    hrefLink = hrefLink.replace("{0}", p.coId).replace("{1}",this.competitorSummaryFilter.typeSale.toString()).replace("{2}", p.saleDate.toString()).replace("{3}", p.saleDate.toString())
                    providerItems.push([p.sales, (p.sales * 100 / saleItem.total).toFixed(2), hrefLink])
                    providerChart.push([{'coId': p.coId, 'sale' : p.sales}]);
                }
                this.chartData.push({'date': _date, 'sale': providerChart});

                this.competitors.push({
                    'date': _dateData,
                    'providers': providerItems,
                    'saleWeekDay': saleItem.saleWeekDay,
                    'providerTotal': saleItem.total
                });
            }

            for(var item in forecasts){
                mapCompetitorForecast.set(item, forecasts[item]);
            }

            for (let item of sales) {

                let providerId = item.coId;
                if(providerId == 'tmn'){
                    providerId = 'TMON';
                }else if(providerId == 'tmnw'){
                    providerId = 'TMON WEB';
                }else if(providerId == 'grp'){
                    providerId = 'GMARKET';
                }else if(providerId == 'cj'){
                    providerId = 'CJ O Clock';
                }else if(providerId == 'cpn2'){
                    providerId = 'COUPANG';
                }else if(providerId == 'wmp'){
                    providerId = 'WEMAKEPRICE';
                }
                let totalCountByProvider = item.sales;
                this.providers.push({
                    'providerId': providerId,
                    'totalCountByProvider': totalCountByProvider,
                    'totalAvaragePercent': (totalCountByProvider * 100 / this.total).toFixed(2),
                    'forecast': mapCompetitorForecast.get(item.coId)
                })

            }

            let monthForecastTitle = this.translateService.instant("competitor.forecast");
            this.monthForecastTitle = monthForecastTitle.replace("{0}", (this.competitorSummaryFilter.endDate.jsdate.getMonth() + 1));

        }
        this.blockUI.stop();
    }

    private resetData(): void {
        this.competitors = []
        this.providers = []
        this.total = 0
        this.chartData = []

    }
    showErrorPopup(message: string){
        this.dialogService.addDialog(AlertComponent, {
            title:'Exception',
            message: message,

        }).subscribe(()=>{});
    }


}