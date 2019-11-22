import {Component, OnInit, ViewContainerRef} from '@angular/core';
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
import {
    DetailedUserActionDto, DetailedUserActionServerResponse, DetailedUserRow,
    TeamAndUserServerResponse
} from "../models/user-action-dto";
import {CompetitorService} from "../../../competitor/services/competitor-service";
import {CategoryGroupsInDetailResponse} from "../../../competitor/models/competitor-by-category";

const PAGE_ID = "DETAILED_USER_MONITOR";
const PAGE_SUB_ID = "DETAILED_USER_PER_DAY_MONITOR";
const EMPTY_DEPT_VALUE ="[Empty]";
const STATISTIC_HEADER = "누적접속자수";
@Component({
    selector: 'detailed-user-monitor',
    templateUrl: './detailed-user-monitor.component.html',
    styleUrls: ['./detailed-user-monitor.component.css']
})

export class DetailedUserMonitorComponent implements OnInit {
    pagination: Pagination = new Pagination(new PageRequest());
    subPagination: Pagination = new Pagination(new PageRequest());

    constructor(private auditActionService: AuditActionService,
                private viewContainerRef: ViewContainerRef,
                private competitorService: CompetitorService,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService, private dialogService: DialogService,
                private translateService: TranslateService) {

        this.pagination.pageRequest.reset();
        this.subPagination.pageRequest.reset();
        this.blockUI.vRef = this.viewContainerRef;
    }

    filter: AuditActionFilter = new AuditActionFilter();

    auditActionDto: AuditActionDto = new AuditActionDto();
    auditActionBindedData: DetailedUserRow[] = [];
    auditActionPagging: DetailedUserRow[] = [];

    subAuditActionDto: AuditActionDto = new AuditActionDto();
    subAuditActionBindedData: DetailedUserRow[] = [];
    subAuditActionPagging: DetailedUserRow[] = [];

    navSubscription: Subscription;
    queryParamsSubscription: Subscription;
    disableSearch: boolean = false;
    sellers = [ { coId: 'button_count', name: '서비스별 클릭수' , settingsForShow: [
            {"fieldName":"totalButton", "width": "120px", "align": "right", "type": "string"},
            {"fieldName":"searchButton", "width": "120px", "align": "right", "type": "string"},
            {"fieldName": "excelDownloadButton", "width": "120px", "align": "right", "type": "string"},
            {"fieldName": "etc", "width": "120px", "align": "right", "type": "string"}]}
    ];

    lineNo: number = 0;
    subLineNo: number = 0;

    departmentMap={};
    users=[];
    teams = [];
    const_teams = [{id: '[Empty]',name: ''},
        {id: 'B2B사업실',name: 'B2B사업실'},
        {id: 'BI시스템팀',name: 'BI시스템팀'},
        {id: 'CFO',name: 'CFO'},
        {id: 'CM팀',name: 'CM팀'},
        {id: 'CSO',name: 'CSO'},
        {id: 'CTO',name: 'CTO'},
        {id: 'Customer Centric팀',name: 'Customer Centric팀'},
        {id: 'DC2파트',name: 'DC2파트'},
        {id: 'FIT개발유닛',name: 'FIT개발유닛'},
        {id: 'FP&A팀',name: 'FP&A팀'},
        {id: 'IR팀',name: 'IR팀'},
        {id: 'IT팀',name: 'IT팀'},
        {id: 'PB사업팀',name: 'PB사업팀'},
        {id: 'SO실',name: 'SO실'},
        {id: 'Trust Improvement팀',name: 'Trust Improvement팀'},
        {id: '가공식품팀',name: '가공식품팀'},
        {id: '가구팀',name: '가구팀'},
        {id: '가구홈데코1팀',name: '가구홈데코1팀'},
        {id: '가구홈데코2팀',name: '가구홈데코2팀'},
        {id: '가구홈데코팀',name: '가구홈데코팀'},
        {id: '가전디지털1팀',name: '가전디지털1팀'},
        {id: '가전디지털2팀',name: '가전디지털2팀'},
        {id: '가전팀',name: '가전팀'},
        {id: '경영관리팀',name: '경영관리팀'},
        {id: '경영기획실',name: '경영기획실'},
        {id: '경영분석팀',name: '경영분석팀'},
        {id: '경영전략BLT',name: '경영전략BLT'},
        {id: '경영지원팀',name: '경영지원팀'},
        {id: '경영혁신센터',name: '경영혁신센터'},
        {id: '경영혁신실',name: '경영혁신실'},
        {id: '고객경험실',name: '고객경험실'},
        {id: '광고사업팀',name: '광고사업팀'},
        {id: '교육/문구/취미팀',name: '교육/문구/취미팀'},
        {id: '국내숙박팀',name: '국내숙박팀'},
        {id: '국내여행/O2O지원팀',name: '국내여행/O2O지원팀'},
        {id: '국내여행레져지원팀',name: '국내여행레져지원팀'},
        {id: '국내여행실',name: '국내여행실'},
        {id: '남성의류팀',name: '남성의류팀'},
        {id: '대표이사',name: '대표이사'},
        {id: '데이터개발팀',name: '데이터개발팀'},
        {id: '데이터기획유닛',name: '데이터기획유닛'},
        {id: '딜기획팀',name: '딜기획팀'},
        {id: '라이프스타일팀',name: '라이프스타일팀'},
        {id: '레져/리조트팀',name: '레져/리조트팀'},
        {id: '레져리조트팀',name: '레져리조트팀'},
        {id: '레져팀',name: '레져팀'},
        {id: '렌탈팀',name: '렌탈팀'},
        {id: '리빙1팀',name: '리빙1팀'},
        {id: '리빙2팀',name: '리빙2팀'},
        {id: '리빙본부',name: '리빙본부'},
        {id: '리빙실',name: '리빙실'},
        {id: '리빙지원팀',name: '리빙지원팀'},
        {id: '리스트기획팀',name: '리스트기획팀'},
        {id: '마케팅실',name: '마케팅실'},
        {id: '마트생활팀',name: '마트생활팀'},
        {id: '마트식품팀',name: '마트식품팀'},
        {id: '마트실',name: '마트실'},
        {id: '메타플랫폼1팀',name: '메타플랫폼1팀'},
        {id: '모바일용품팀',name: '모바일용품팀'},
        {id: '미디어커머스운영팀',name: '미디어커머스운영팀'},
        {id: '미디어커머스전략팀',name: '미디어커머스전략팀'},
        {id: '반려용품팀',name: '반려용품팀'},
        {id: '백화점사업팀',name: '백화점사업팀'},
        {id: '베트남사무소',name: '베트남사무소'},
        {id: '보안기술팀',name: '보안기술팀'},
        {id: '뷰티팀',name: '뷰티팀'},
        {id: '브랜드/제휴팀',name: '브랜드/제휴팀'},
        {id: '브랜드잡화팀',name: '브랜드잡화팀'},
        {id: '브랜드패션팀',name: '브랜드패션팀'},
        {id: '비용관리팀',name: '비용관리팀'},
        {id: '비즈니스플랫폼기획팀',name: '비즈니스플랫폼기획팀'},
        {id: '사업지원실',name: '사업지원실'},
        {id: '상품개발실',name: '상품개발실'},
        {id: '상품기획1팀',name: '상품기획1팀'},
        {id: '상품기획2팀',name: '상품기획2팀'},
        {id: '상품기획3팀',name: '상품기획3팀'},
        {id: '생활주방1팀',name: '생활주방1팀'},
        {id: '생활주방2팀',name: '생활주방2팀'},
        {id: '생활주방팀',name: '생활주방팀'},
        {id: '서비스기획실',name: '서비스기획실'},
        {id: '서비스랩',name: '서비스랩'},
        {id: '서비스지원실',name: '서비스지원실'},
        {id: '숙박팀',name: '숙박팀'},
        {id: '스포츠/자동차팀',name: '스포츠/자동차팀'},
        {id: '스포츠레져팀',name: '스포츠레져팀'},
        {id: '식품1팀',name: '식품1팀'},
        {id: '식품2팀',name: '식품2팀'},
        {id: '식품실',name: '식품실'},
        {id: '식품지원팀',name: '식품지원팀'},
        {id: '신선식품팀',name: '신선식품팀'},
        {id: '액티비티팀',name: '액티비티팀'},
        {id: '여성의류팀',name: '여성의류팀'},
        {id: '여행/O2O실',name: '여행/O2O실'},
        {id: '여행/O2O지원팀',name: '여행/O2O지원팀'},
        {id: '영업지원실',name: '영업지원실'},
        {id: '영업프로모션팀',name: '영업프로모션팀'},
        {id: '운영기획실',name: '운영기획실'},
        {id: '운영기획팀',name: '운영기획팀'},
        {id: '운영부문',name: '운영부문'},
        {id: '유아동팀',name: '유아동팀'},
        {id: '유아동패션팀',name: '유아동패션팀'},
        {id: '의장',name: '의장'},
        {id: '재무관리실',name: '재무관리실'},
        {id: '재무실',name: '재무실'},
        {id: '재무회계팀',name: '재무회계팀'},
        {id: '정책기획팀',name: '정책기획팀'},
        {id: '제주/항공여행팀',name: '제주/항공여행팀'},
        {id: '제주여행팀',name: '제주여행팀'},
        {id: '제휴사업팀',name: '제휴사업팀'},
        {id: '제휴플랫폼사업실',name: '제휴플랫폼사업실'},
        {id: '지역사업팀',name: '지역사업팀'},
        {id: '추천랩',name: '추천랩'},
        {id: '커뮤니케이션실',name: '커뮤니케이션실'},
        {id: '컴퓨터디지털팀',name: '컴퓨터디지털팀'},
        {id: '콘텐츠제작팀',name: '콘텐츠제작팀'},
        {id: '쿠폰프로모션팀',name: '쿠폰프로모션팀'},
        {id: '큐레이션팀',name: '큐레이션팀'},
        {id: '투어연동팀',name: '투어연동팀'},
        {id: '트렌드의류/언더웨어팀',name: '트렌드의류/언더웨어팀'},
        {id: '트렌드의류1팀',name: '트렌드의류1팀'},
        {id: '트렌드의류2팀',name: '트렌드의류2팀'},
        {id: '티몬팩토리팀',name: '티몬팩토리팀'},
        {id: '티켓사업팀',name: '티켓사업팀'},
        {id: '파트너개발팀',name: '파트너개발팀'},
        {id: '파트너운영관리팀',name: '파트너운영관리팀'},
        {id: '패션본부',name: '패션본부'},
        {id: '패션브랜드본부',name: '패션브랜드본부'},
        {id: '패션실',name: '패션실'},
        {id: '패션잡화팀',name: '패션잡화팀'},
        {id: '패션지원팀',name: '패션지원팀'},
        {id: '퍼포먼스마케팅팀',name: '퍼포먼스마케팅팀'},
        {id: '푸시/메일마케팅팀',name: '푸시/메일마케팅팀'},
        {id: '프로모션기획팀',name: '프로모션기획팀'},
        {id: '프론트운영팀',name: '프론트운영팀'},
        {id: '플랫폼개발실',name: '플랫폼개발실'},
        {id: '항공여행실',name: '항공여행실'},
        {id: '항공팀',name: '항공팀'},
        {id: '해외여행실',name: '해외여행실'},
        {id: '해외여행팀',name: '해외여행팀'},
        {id: '해외팀',name: '해외팀'},
        {id: '홈&키친팀',name: '홈&키친팀'},
        {id: '홍보팀',name: '홍보팀'}];

    menuItems = [{id: 'COMPETITOR', name: '조직별 영업실적'}, {id: 'DEAL_LIST', name: '딜별 영업실적'},{id: 'GROSS_REPORT', name: 'GR 보고서'}
        , {id: 'PRICE_COMPARE', name: '실시간 베스트'},{id: 'PRO_BEST_OPT', name: '실시간 베스트(옵션)'}, {id: 'NAVER_SEARCH', name: '실시간 키워드 검색'}];

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

    subActivityDataSettings: object = {
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

    onSubPaginationChanged(event: any): void {
        //if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
        let pageNumReq: number = event.page - 1;
        this.subPagination.pageRequest.page = pageNumReq;
        this.subLineNo = (event.page -1)* event.itemsPerPage;
        this.subAuditActionPagging = this.subAuditActionBindedData.slice(this.subPagination.pageRequest.page*this.subPagination.maxSize, this.subPagination.pageRequest.page*this.subPagination.maxSize + this.subPagination.maxSize)
        //}
    }

    resetData() {
        this.auditActionBindedData = [];
        this.pagination = new Pagination(new PageRequest());
        this.pagination.pageRequest.reset();
        this.subPagination = new Pagination(new PageRequest());
        this.subPagination.pageRequest.reset();
        this.lineNo = 0;
        this.subLineNo = 0;
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
        this.loadSubData();
        this.buildSubTableHeader();
        this.filter.unbind();
        this.onLoadTeamAndUsers();
    }
    loadData() {
        this.blockUI.start();
        this.filter.typeSearch = PAGE_ID;
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
                    let response = serverResponse as DetailedUserActionServerResponse;
                    if (response != null && response != undefined) {
                        this.convertAPIDataToTableRowData(response) ;
                        this.auditActionPagging = this.auditActionBindedData.slice(this.pagination.pageRequest.page*this.pagination.maxSize, this.pagination.pageRequest.page*this.pagination.maxSize + this.pagination.maxSize);
                        this.pagination.totalItems = this.auditActionBindedData.length;
                    } else {
                        this.auditActionDto = {};
                        this.auditActionBindedData.push(new DetailedUserRow());
                        this.auditActionPagging = [];
                    }
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


    loadSubData() {
        this.blockUI.start();
        this.filter.typeSearch = PAGE_SUB_ID;
        this.auditActionService.loadData(this.filter, this.subPagination.pageRequest).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                    this.blockUI.stop();
                    this.disableSearch = false;
                    break;
                }
                case 'OK': {
                    let response = serverResponse as DetailedUserActionServerResponse;
                    if (response != null && response != undefined) {
                        this.convertAPIDataToSubTableRowData(response) ;
                        this.subAuditActionPagging = this.subAuditActionBindedData.slice(this.subPagination.pageRequest.page*this.subPagination.maxSize, this.subPagination.pageRequest.page*this.subPagination.maxSize + this.subPagination.maxSize);
                        this.subPagination.totalItems = this.subAuditActionBindedData.length;
                    } else {
                        this.subAuditActionDto = {};
                        this.subAuditActionBindedData.push(new DetailedUserRow());
                        this.subAuditActionPagging = [];
                    }
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
        this.subPagination.pageRequest.reset();
        if(this.validateInput()) {
            this.auditActionDto = {};
            this.auditActionBindedData = [];
            this.auditActionPagging = [];

            this.subAuditActionDto = {};
            this.subAuditActionBindedData = [];
            this.subAuditActionPagging = [];

            let params = RouteUtils.extractParams(this.route, {});
            this.filter.bind(params);
            this.loadData();
            this.buildTableHeader();
            //this.filter.unbind();
            this.loadSubData();
            this.buildSubTableHeader();
            this.filter.unbind();
        }
    }

    onReset(): void {
        this.filter = new AuditActionFilter();
        this.pagination.pageRequest.reset();
        this.lineNo = 0;
        this.subPagination.pageRequest.reset();
        this.subLineNo = 0;
        this.filter.unbind();
    }

    isShowDetails(): boolean {
        return this.filter.isShowDetails;
    }

    buildTableHeader(): void {
        let settingsProductSearch: object = {};
        settingsProductSearch['searchPeriod'] = {
            title: 'monitorUserActivities.column.date',
            width: '200px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                return data.item['searchPeriod'];
            }
        };
        settingsProductSearch['teamName'] = {
            title: 'monitorUserActivities.column.teamName',
            width: '250px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                return data.item['teamName'];
            }
        };
        settingsProductSearch['userName'] = {
            title: 'monitorUserActivities.column.userName',
            width: '250px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                return data.item['userName'];
            }
        };
        settingsProductSearch['ad'] = {
            title: 'monitorUserActivities.column.ad',
            width: '150px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                return data.item['ad'];
            }
        };
        settingsProductSearch['menuAndTab'] = {
            title: 'monitorUserActivities.column.menuAndTab',
            width: '350px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                return data.item['menuAndTab'];
            }
        };
        settingsProductSearch['buttonName'] = {
            title: 'monitorUserActivities.column.buttonName',
            width: '250px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                return data.item['buttonName'];
            }
        };
        settingsProductSearch['time'] = {
            title: 'monitorUserActivities.column.time',
            width: '150px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                return data.item['time'];
            }
        };

        this.activityDataSettings = {
            table: this.activityDataSettings['table'],
            column: settingsProductSearch
        };

    }

    buildSubTableHeader(): void {
        let settingsProductSearch: object = {};
        settingsProductSearch['date'] = {
            title: 'monitorUserActivities.column.date',
            width: '200px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                return data.item['searchPeriod'];
            }
        };
        settingsProductSearch['teamName'] = {
            title: 'monitorUserActivities.column.teamName',
            width: '250px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                return data.item['teamName'];
            }
        };
        settingsProductSearch['userName'] = {
            title: 'monitorUserActivities.column.userName',
            width: '250px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                return data.item['userName'];
            }
        };
        settingsProductSearch['ad'] = {
            title: 'monitorUserActivities.column.ad',
            width: '150px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                return data.item['ad'];
            }
        };
        settingsProductSearch['menuAndTab'] = {
            title: 'monitorUserActivities.column.menuAndTab',
            width: '150px',
            align: 'center',
            render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                if (data.item['menuAndTab'] === STATISTIC_HEADER) {
                    return '<span style="color:blue">' + data.item['menuAndTab'] + '</span>';
                } else {
                    return data.item['menuAndTab'];
                }
            }
        };
        this.sellers.forEach(seller => {
            seller.settingsForShow.forEach(setting => {
                if (setting.fieldName === 'totalButton') {
                    settingsProductSearch['seller_' + seller.coId + '_' + setting.fieldName] = {
                        title: [seller.name, 'monitorUserActivities.column.' + setting.fieldName],
                        type: setting.type,
                        width: setting.width,
                        align: setting.align,
                        render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
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
                        render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                            if (data.item['menuAndTab'] === STATISTIC_HEADER) {
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
                        render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                            if (data.item['menuAndTab'] === STATISTIC_HEADER) {
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
                        render: (data: { item: DetailedUserRow, value: any }, settings: object) => {
                            if (data.item['menuAndTab'] === STATISTIC_HEADER) {
                                return '<span style="color:blue">' + data.item['etcCount'] + '</span>';
                            } else {
                                return data.item['etcCount'];
                            }
                        }
                    };
                }
            });
        });
        this.subActivityDataSettings = {
            table: this.subActivityDataSettings['table'],
            column: settingsProductSearch
        };

    }

    validateInput(){
        return true;
    }

    convertAPIDataToTableRowData(response:DetailedUserActionServerResponse): void {
        let listObjs = response.data ;
        if (listObjs == null || listObjs.length == 0) {
            this.auditActionBindedData = [];
        } else {
            this.auditActionBindedData = [];
            listObjs.forEach(item => {
                let competitor: DetailedUserActionDto = item;
                let row = new DetailedUserRow();
                if (competitor != null) {
                    row.searchPeriod = competitor.searchPeriod;
                    row.teamName = competitor.teamName;
                    row.menuCode = competitor.menuCode;
                    row.menuName = competitor.menuName;
                    row.totalMenuCount = competitor.totalMenuCount;
                    row.totalButtonCount = competitor.totalButtonCount;
                    row.searchCount = competitor.searchCount;
                    row.downloadCount = competitor.downloadCount;
                    row.etcCount = competitor.etcCount;
                    //New info
                    row.userName = competitor.userName;
                    row.ad = competitor.userId;
                    row.menuAndTab = competitor.menuAndTab;
                    row.time = competitor.time;
                    row.buttonName = competitor.buttonName;
                }
                this.auditActionBindedData.push(row);
            });
        }
    }

    convertAPIDataToSubTableRowData(response:DetailedUserActionServerResponse): void {
        let listObjs = response.data ;
        if (listObjs == null || listObjs.length == 0) {
            this.subAuditActionBindedData = [];
        } else {
            this.subAuditActionBindedData = [];
            listObjs.forEach(item => {
                let competitor: DetailedUserActionDto = item;
                let row = new DetailedUserRow();
                if (competitor != null) {
                    row.searchPeriod = competitor.searchPeriod;
                    row.teamName = competitor.teamName;
                    row.menuCode = competitor.menuCode;
                    row.menuName = competitor.menuName;
                    row.totalMenuCount = competitor.totalMenuCount;
                    row.totalButtonCount = competitor.totalButtonCount;
                    row.searchCount = competitor.searchCount;
                    row.downloadCount = competitor.downloadCount;
                    row.etcCount = competitor.etcCount;
                    //New info
                    row.userName = competitor.userName;
                    row.ad = competitor.userId;
                    row.menuAndTab = competitor.menuAndTab;
                }
                this.subAuditActionBindedData.push(row);
            });
        }
    }
    onCheckedShowingDetails(event) {
        this.filter.isShowDetails=!this.filter.isShowDetails;
    }

    loadUsersByTeam(event) {
        let teamId = this.filter.teamId;
        let selectedTeam = [];
        if (teamId !== '') {
            selectedTeam = this.departmentMap[teamId];
            this.users = selectedTeam;
        }
        this.users = selectedTeam;
    }

    onLoadTeamAndUsers(): void {
        if(this.teams.length == 0) {
            this.blockUI.start();
            this.auditActionService.loadTeamAndUsers().subscribe(serverResponse => {
                switch (serverResponse.httpStatus) {
                    case 'BAD_REQUEST': {
                        let badRequestResponse = serverResponse as BadRequestResponse;
                        console.log(badRequestResponse.exceptionMsg);
                        showErrorPopup(this.dialogService, this.translateService, badRequestResponse.exceptionMsg);
                    }
                    case 'OK': {
                        let response = serverResponse as TeamAndUserServerResponse;
                        if (response != null && response != undefined) {
                            response.data.forEach(obj => {
                                if (obj != null && obj != undefined) {
                                    if (obj.department=='') { /* Case of empty department*/
                                        this.departmentMap[EMPTY_DEPT_VALUE] = obj.users ;
                                        this.teams.push({id: EMPTY_DEPT_VALUE , name: obj.department});
                                    } else {
                                        this.departmentMap[obj.department] = obj.users ;
                                        this.teams.push({id: obj.department, name: obj.department});
                                    }
                                }
                            });
                            if(this.filter.teamId !=='') {
                                this.teams = this.departmentMap[this.filter.teamId];
                            }
                        };
                    }
                };
                //this.blockUI.stop();
            }, error => {
                console.log('error to load departments', error);
                this.blockUI.stop();
                let errorMessage = this.translateService.instant("message.err_unknown");
                showErrorPopup(this.dialogService, this.translateService, errorMessage);
            });
        }
    }
}
