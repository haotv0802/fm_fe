import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Shape from 'd3-shape';
import * as d3TimeFormat from 'd3-time-format';
import * as moment from 'moment';
import * as _ from 'lodash';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {DialogService} from "ng2-bootstrap-modal";
import {Subscription} from "rxjs/Subscription";
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import RouteUtils from "../../../../shared/utils/RouteUtils";
import {Pagination} from "../../../../shared/models/pagination";
import {PageRequest} from "../../../../shared/models/page-request";
import {formatNumber, showErrorPopup} from "../../../../shared/utils";
import {BadRequestResponse} from "../../../../shared/models/bad-request-response";
import {AppSettings} from "../../../../shared/models/app-settings";
import {Observable, Observer} from "rxjs";
import {AuditActionService} from "../service/monitor-user-activities-service";
import {AuditActionFilter} from "../models/audit-action-model";
import {AuditActionDto, AuditActionServerResponse} from "../models/audit-action-dto";
import {DailyStatusActionDto, DailyStatusActionServerResponse, DailyStatusRow, ChartValue} from "../models/daily-status-action-dto";
import {AxisScale, AxisTimeInterval} from "d3-axis";

const PAGE_ID = "DAILY_STATUS_MONITOR";
const STATISTIC_HEADER = "누적접속자수";

@Component({
    selector: 'daily-status-monitor',
    templateUrl: './daily-status-monitor.component.html',
    styleUrls: ['./daily-status-monitor.component.css']
})

export class DailyStatusMonitorComponent implements OnInit {
    pagination: Pagination = new Pagination(new PageRequest());

    constructor(private auditActionService: AuditActionService,
                private viewContainerRef: ViewContainerRef,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService, private dialogService: DialogService,
                private translateService: TranslateService) {

        this.pagination.pageRequest.reset();
        this.blockUI.vRef = this.viewContainerRef;
    }

    filter: AuditActionFilter = new AuditActionFilter();
    auditActionDto: AuditActionDto = new AuditActionDto();
    //auditActionResponseData: Map<number, Map<string, DailyStatusActionDto[]>> = new Map();
    auditActionBindedData: DailyStatusRow[] = [];
    auditActionPagging: DailyStatusRow[] = [];
    chartData: ChartValue[] = [];
    navSubscription: Subscription;
    queryParamsSubscription: Subscription;
    disableSearch: boolean = false;

    sellers = [
        { coId: 'menu_count', name: '메뉴별 접속자수', settingsForShow: [
                {"fieldName":"menu1", "width": "120px", "align": "right", "type": "string"},
                {"fieldName":"menu2", "width": "120px", "align": "right", "type": "string"},
                {"fieldName": "menu3", "width": "120px", "align": "right", "type": "string"},
                {"fieldName": "menu4", "width": "120px", "align": "right", "type": "string"},
                {"fieldName": "menu5", "width": "120px", "align": "right", "type": "string"},
                {"fieldName": "menu6", "width": "120px", "align": "right", "type": "string"}] },
        { coId: 'button_count', name: '서비스별 클릭수' , settingsForShow: [
                {"fieldName":"totalButton", "width": "120px", "align": "right", "type": "string"},
                {"fieldName":"searchButton", "width": "120px", "align": "right", "type": "string"},
                {"fieldName": "excelDownloadButton", "width": "120px", "align": "right", "type": "string"},
                {"fieldName": "etc", "width": "120px", "align": "right", "type": "string"}]}
    ];

    lineNo: number = 0;

    svgMargin = {top: 70, right: 10, bottom: 30, left: 60};
    x: any;
    y: any;
    svg: any;
    g: any;
    svgWidth: number = 800;
    svgHeight: number = 400 ;

    isFirstShowChart: boolean = true;

    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
        if(this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe()
        }
    }

    activityDataSettings: object = {
        table: {
            translate: true,
            tableScroll: true,
            tableScrollHeight: '500px',
            width: '2000px',
            usedColSpanTable: true
        }
    };

    isAdminView:boolean= false;

    onPaginationChanged(event: any): void {
        //if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
        let pageNumReq: number = event.page - 1;
        this.pagination.pageRequest.page = pageNumReq;
        this.lineNo = (event.page -1)* event.itemsPerPage;
        this.auditActionPagging = this.auditActionBindedData.slice(this.pagination.pageRequest.page*this.pagination.maxSize, this.pagination.pageRequest.page*this.pagination.maxSize + this.pagination.maxSize)
        //}
    }

    resetData() {
        this.auditActionBindedData = [];
        this.pagination = new Pagination(new PageRequest());
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
    }

    ngOnInit() {
        this.queryParamsSubscription = this.route.queryParams.subscribe(params=> {
            let role = window.localStorage.getItem("role");
            this.isAdminView = (params['isAdminView']==='true') && role ==='admin';
        });
        this.filter.typeSearch = PAGE_ID;
        let params = RouteUtils.extractParams(this.route, {});
        this.filter.bind(params);
        this.loadData();
        this.buildTableHeader();
        this.filter.isShowAnalysis = false;
        this.drawChart(this.chartData);
    }
    loadData() {
        this.blockUI.start();
        this.auditActionService.loadData(this.filter, this.pagination.pageRequest).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    this.disableSearch = false;
                    break;
                }
                case 'OK': {
                    let response = serverResponse as DailyStatusActionServerResponse;
                    if (response != null && response != undefined) {
                        this.convertAPIDataToTableRowData(response) ;
                        this.auditActionPagging = this.auditActionBindedData.slice(this.pagination.pageRequest.page*this.pagination.maxSize, this.pagination.pageRequest.page*this.pagination.maxSize + this.pagination.maxSize);
                        this.pagination.totalItems = this.auditActionBindedData.length;
                    } else {
                        this.auditActionDto = {};
                        this.auditActionBindedData.push(new DailyStatusRow());
                        this.auditActionPagging = [];
                    }
                    this.refreshGraph();
                    this.blockUI.stop();
                    this.disableSearch = false;
                    break;
                }
                default: {
                    this.blockUI.stop();
                    this.disableSearch = false;
                    break;
                }
            }
        }, error => {
            this.blockUI.stop();
            this.disableSearch = false;
            console.log('error onSearchDeals', error);
        });
    }

    onSearch(): void {
        this.disableSearch = true;
        this.pagination.pageRequest.reset();
        if(this.validateInput()) {
            this.auditActionDto = {};
            /*this.bestDealComparisionDTO.prodHisByRank = new Map();*/
            this.auditActionBindedData = [];
            this.auditActionPagging = [];
            this.loadData();
            this.buildTableHeader();
            this.filter.unbind();
        }
    }

    onReset(): void {
        this.filter = new AuditActionFilter();
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
        this.filter.unbind();
    }

    buildTableHeader(): void {
        let settingsProductSearch: object = {};
        settingsProductSearch['searchPeriod'] = {
            title: 'monitorUserActivities.column.day',
            width: '100px',
            align: 'center',
            render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                if (data.item['searchPeriod'] === STATISTIC_HEADER) {
                    return '<span style="color:blue">' + data.item['searchPeriod'] + '</span>';
                } else {
                    return data.item['searchPeriod'];
                }
            }
        };
        settingsProductSearch['count'] = {
            title: 'monitorUserActivities.column.count',
            width: '100px',
            align: 'center',
            render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                if (data.item['searchPeriod'] === STATISTIC_HEADER) {
                    return '<span style="color:blue">' + data.item['totalMenuCount'] + '</span>';
                } else {
                    return data.item['totalMenuCount'];
                }
            }
        };
        this.sellers.forEach(seller => {
            seller.settingsForShow.forEach(setting => {
                if (setting.fieldName === 'menu1') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                            title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                            type: setting.type,
                            width: setting.width,
                            align: setting.align,
                            render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                                if (data.item['searchPeriod'] === STATISTIC_HEADER) {
                                    return '<span style="color:blue">' + data.item['menu1'] + '</span>';
                                } else {
                                    return data.item['menu1'];
                                }
                            }
                        };
                }
                if (setting.fieldName === 'menu2') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                            if (data.item['searchPeriod'] === STATISTIC_HEADER) {
                                return '<span style="color:blue">' + data.item['menu2'] + '</span>';
                            } else {
                                return data.item['menu2'];
                            }
                        }
                    };
                }
                if (setting.fieldName === 'menu3') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                            if (data.item['searchPeriod'] === STATISTIC_HEADER) {
                                return '<span style="color:blue">' + data.item['menu3'] + '</span>';
                            } else {
                                return data.item['menu3'];
                            }
                        }
                    };
                }
                if (setting.fieldName === 'menu4') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                            if (data.item['searchPeriod'] === STATISTIC_HEADER) {
                                return '<span style="color:blue">' + data.item['menu4'] + '</span>';
                            } else {
                                return data.item['menu4'];
                            }
                        }
                    };
                }
                if (setting.fieldName === 'menu5') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                            if (data.item['searchPeriod'] === STATISTIC_HEADER) {
                                return '<span style="color:blue">' + data.item['menu5'] + '</span>';
                            } else {
                                return data.item['menu5'];
                            }
                        }
                    };
                }
                if (setting.fieldName === 'menu6') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                            if (data.item['searchPeriod'] === STATISTIC_HEADER) {
                                return '<span style="color:blue">' + data.item['menu6'] + '</span>';
                            } else {
                                return data.item['menu6'];
                            }
                        }
                    };
                }

                if (setting.fieldName === 'totalButton') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                            return '<span style="color:blue">' + data.item['totalButtonCount'] + '</span>';
                        }
                    };
                }

                if (setting.fieldName === 'searchButton') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                            if (data.item['searchPeriod'] === STATISTIC_HEADER) {
                                return '<span style="color:blue">' + data.item['searchCount'] + '</span>';
                            } else {
                                return data.item['searchCount'];
                            }
                        }
                    };
                }

                if (setting.fieldName === 'excelDownloadButton') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                            if (data.item['searchPeriod'] === STATISTIC_HEADER) {
                                return '<span style="color:blue">' + data.item['downloadCount'] + '</span>';
                            } else {
                                return data.item['downloadCount'];
                            }
                        }
                    };
                }

                if (setting.fieldName === 'etc') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: DailyStatusRow, value: any }, settings: object) => {
                            if (data.item['searchPeriod'] === STATISTIC_HEADER) {
                                return '<span style="color:blue">' + data.item['etcCount'] + '</span>';
                            } else {
                                return data.item['etcCount'];
                            }
                        }
                    };
                }
            });
        });
        this.activityDataSettings = {
            table: this.activityDataSettings['table'],
            column: settingsProductSearch
        };

    }

    validateInput(){
        return true;
    }

    handleGraphChange(event) {
        this.filter.isShowAnalysis = true ;
        this.filter.graphSearch = event.target.value;
        this.refreshGraph();
    }

    refreshGraph() {
        if (this.filter.graphSearch ==='Y' || this.filter.graphSearch ==='N') {
            this.copyData(this.filter.graphSearch);
            this.redrawChart(this.chartData);
        }
    }

    copyData(graphType) {
        this.chartData = [] ;
        let countDay:number = 0;
        this.auditActionBindedData.forEach(item => {
            if (item.searchPeriod != STATISTIC_HEADER) {
                let obj = new ChartValue() ;
                obj.xDate = moment(item.searchPeriod, moment.ISO_8601).toDate();
                if (this.filter.graphSearch == 'N') {
                    obj.countValue = item.totalButtonCount;
                } else {
                    obj.countValue = item.totalMenuCount;
                }
                this.chartData.push(obj)
            }
        });
    }

    convertAPIDataToTableRowData(response:DailyStatusActionServerResponse): void {
        let listObjs = response.data;
        if (listObjs == null || listObjs.length == 0) {
            this.auditActionBindedData = [];
        } else {
            this.auditActionBindedData = [];
            listObjs.forEach(item => {
                let competitor: DailyStatusActionDto = item;
                let row = new DailyStatusRow();
                if (competitor != null) {
                    row.searchPeriod = competitor.searchPeriod;
                    row.totalMenuCount = competitor.totalMenuCount;
                    row.totalButtonCount = competitor.totalButtonCount;
                    row.searchCount = competitor.searchCount;
                    row.downloadCount = competitor.downloadCount;
                    row.etcCount = competitor.etcCount;
                    row.menu1 = 0;
                    row.menu2 = 0;
                    row.menu3 = 0;
                    row.menu4 = 0;
                    row.menu5 = 0;
                    row.menu6 = 0;
                    if (competitor.menuItems != null) {
                        if (competitor.menuItems['COMPETITOR'] != null && competitor.menuItems['COMPETITOR'] != undefined) {
                            row.menu1 = competitor.menuItems['COMPETITOR'];
                        }
                        if (competitor.menuItems['DEAL_LIST'] != null && competitor.menuItems['DEAL_LIST'] != undefined) {
                            row.menu2 = competitor.menuItems['DEAL_LIST'];
                        }
                        if (competitor.menuItems['GROSS_REPORT'] != null && competitor.menuItems['GROSS_REPORT'] != undefined) {
                            row.menu3 = competitor.menuItems['GROSS_REPORT'];
                        }
                        if (competitor.menuItems['PRICE_COMPARE'] != null && competitor.menuItems['PRICE_COMPARE'] != undefined) {
                            row.menu4 = competitor.menuItems['PRICE_COMPARE'];
                        }
                        if (competitor.menuItems['PRO_BEST_OPT'] != null && competitor.menuItems['PRO_BEST_OPT'] != undefined) {
                            row.menu5 = competitor.menuItems['PRO_BEST_OPT'];
                        }
                        if (competitor.menuItems['NAVER_SEARCH'] != null && competitor.menuItems['NAVER_SEARCH'] != undefined) {
                            row.menu6 = competitor.menuItems['NAVER_SEARCH'];
                        }
                    }
                }
                this.auditActionBindedData.push(row)
            });
        }
    }


    drawChart(data) {
        this.initSvg();
        this.initLineChart(data)
    }

    redrawChart(data) {
        if (this.g != null &&  this.g != undefined) {
            this.g.remove("g");
        }
        this.drawChart(data);
    }

    initSvg() {
        this.svg = d3.select("svg");
        if (this.svg == null || this.svg == undefined) {
            this.svg  = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            document.body.appendChild(this.svg);
        }

        if (this.svg != null && this.svg != undefined ) {
            if ((this.filter.graphSearch == 'Y' || this.filter.graphSearch == 'N')) {
                this.svgWidth = +this.svg.attr("width") - this.svgMargin.left - this.svgMargin.right - 20;
                this.svgHeight = +this.svg.attr("height") - this.svgMargin.top - this.svgMargin.bottom;
            }
            this.g = this.svg.append("g").attr("transform", "translate(" + this.svgMargin.left + "," + this.svgMargin.top + ")");
        }
    }

    initLineChart(chartData) {
        this.x = d3Scale.scaleTime().range([0, this.svgWidth]);
        this.y = d3Scale.scaleLinear().range([this.svgHeight,0]);
        var x = this.x;
        var y = this.y;

        var valueLineTmon = d3Shape.line()
            .x(function (d) {
                return x(d["xDate"]);
            })
            .y(function (d) {
                return y(d["countValue"]);
            });


        this.x.domain(d3Array.extent(chartData, function (d) {
            return d["xDate"];
        }));

        this.y.domain([0, d3Array.max(chartData, function (d) {
            return Math.max(d["countValue"]);
        })]).nice();

        this.g.selectAll("dot")
            .data(chartData)
            .enter().append("circle")
            .attr('class', 'dot-tmon')
            .attr("r", 3.5)
            .attr("cx", function (d) {
                return x(d["xDate"]);
            })
            .attr("cy", function (d) {
                return y(d["countValue"]);
            })
            .on('mouseover', function (el) {
                d3.select(this)
                    .attr('r', 5);
            })
            .on('mouseout', function (el) {
                d3.select(this)
                    .attr('r', 3.5);
            });

        this.g.append("path")
            .attr("class", "line")
            .style("stroke", "#6A5ACD")
            .attr("d", valueLineTmon(chartData));


        // Add the X Axis
        this.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.svgHeight + ")")
            .call(d3Axis.axisBottom(this.x).tickFormat(d3TimeFormat.timeFormat("%m/%d")));

        // Add the Y Axis
        this.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3Axis.axisLeft(this.y)
                .ticks(20, "s"));

    }

}
