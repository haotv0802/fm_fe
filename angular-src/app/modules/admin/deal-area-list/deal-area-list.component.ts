import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subscription } from 'rxjs/Subscription';

import { SmartTableService } from '../../../common/smart-table/smart-table.service';
import { BlockUIService } from '../../../shared/services/block-ui.service';
import { AreaService } from '../services/area.service';
import { RegionService } from '../services/region.service';
import RouteUtils from '../../../shared/utils/RouteUtils';
import { isEmpty, get } from '../../../shared/utils';
import { getDealLink } from '../../../shared/utils/DealUtils';
import { PageRequest } from '../../../shared/models/page-request';
import { Area, DealAreaFilter } from '../models/area';
import { AreaEditComponent } from '../area-edit/area-edit.component';
import { BadRequestResponse } from '../../../shared/models/bad-request-response';
import { AlertComponent } from "../../../common/alert/alert.component";
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

const CURRENT_URL = '/admin/area-list';

@Component({
    templateUrl: 'deal-area-list.component.html'
})
export class DealAreaListComponent implements OnInit, OnDestroy {

    constructor(private router: Router,
        private route: ActivatedRoute,
        private viewContainerRef: ViewContainerRef,
        private blockUI: BlockUIService,
        private tableService: SmartTableService,
        private translateService: TranslateService,
        private areaService: AreaService,
        private regionService: RegionService,
        private dialogService: DialogService) {

        this.blockUI.vRef = this.viewContainerRef;
        this.pageRequest = new PageRequest();
    }

    navSubscription: Subscription;
    ngOnInit(): void {
        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
            let params = RouteUtils.extractParams(this.route, {});
            this.filter = new DealAreaFilter();
            this.filter.bind(params);

            this.search();
        });
    }

    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
    }

    pageRequest: PageRequest;
    filter: DealAreaFilter = new DealAreaFilter();
    sources: any[]
    settings = {
        table: {
            translate: true
        },
        column: {
            title: {
                width: '150px',
                clickable: true,
                sortable: true,
                title: 'admin.category.title'
            },
            categoryTitle: {
                width: '150px',
                clickable: true,
                sortable: true,
                title: 'admin.category.categoryNo'
            },
            shopAddress: {
                width: '200px',
                sortable: true,
                title: 'admin.area.shopAddress'
            },
            areaAddress: {
                width: '200px',
                sortable: true,
                title: 'admin.area.areaAddress'
            },
            regionDepart: {
                width: '150px',
                sortable: true,
                title: 'admin.region.departName'
            },
            regionName: {
                width: '150px',
                sortable: true,
                title: 'admin.area.regionName'
            },
            areaConfirmYN: {
                width: '100px',
                title: 'label.confirm'
            },
            startDate: {
                width: '150px',
                type: 'datetime',
                sortable: true,
                title: 'admin.category.startDate',
            },
            endDate: {
                width: '150px',
                type: 'datetime',
                sortable: true,
                title: 'admin.category.endDate'
            },
            area1: {
                width: '100px',
                sortable: true,
                title: 'admin.area.area1'
            },
            area2: {
                width: '100px',
                sortable: true,
                title: 'admin.area.area2'
            },
            area3: {
                width: '100px',
                sortable: true,
                title: 'admin.area.area3'
            },
            shopName: {
                width: '150px',
                sortable: true,
                title: 'admin.area.shopName'
            },
            modifier: {
                width: '100px',
                sortable: true,
                title: 'admin.area.areaModifier'
            },
            confirmer: {
                width: '100px',
                sortable: true,
                title: 'admin.area.areaConfirmer'
            },
            modifiedAt: {
                sortable: true,
                width: '150px',
                type: 'datetime',
                title: 'admin.area.areaModifiedAt'
            },
            confirmAt: {
                sortable: true,
                width: '150px',
                type: 'datetime',
                title: 'admin.area.areaConfirmAt'
            },
        }
    };
    sortKeys: any = {
        title: 'title',
        categoryTitle: 'category_title',
        shopAddress: 'shop_address',
        areaAddress: 'area_address',
        regionDepart: 'region_depart',
        regionName: 'region_name',
        areaConfirmYN: 'area_confirm_yn',
        startDate: 'startdate',
        endDate: 'enddate',
        area1: 'area1',
        area2: 'area2',
        area3: 'area3',
        shopName: 'shop_name',
        areaModifier: 'area_modifier',
        areaConfirmer: 'area_confirmer',
        areaModifiedAt: 'area_modified_at',
        areaConfirmAt: 'area_confirm_at'
    };
    competitors: any = [
        { code: 'tmn', name: '티켓몬스터' },
        { code: 'cpn2', name: '쿠팡' },
        { code: 'grp', name: '그루폰' },
        { code: 'wmp', name: '위메프' },
        { code: 'cj', name: '오클락' }
    ];

    search() {
        this.blockUI.start();
        this.areaService.searchDealArea(this.filter, this.pageRequest)
            .subscribe(serverResponse => {
                switch (serverResponse.httpStatus) {
                    case 'BAD_REQUEST': {
                        let badRequestResponse = serverResponse as BadRequestResponse;
                        console.log(badRequestResponse.exceptionMsg);
                        this.showErrorPopup(badRequestResponse.exceptionMsg)
                        this.blockUI.stop()
                        break;
                    }
                    case 'OK': {
                        this.sources = serverResponse.data;
                        this.pageRequest.totalItems = serverResponse.pagination.total;
                        this.blockUI.stop();
                        break;
                    }
                    default:
                        this.blockUI.stop()
                }

            }, error => {
                console.log('find area-list: ', error);
                this.blockUI.stop();
            });
    }

    showErrorPopup(message: string) {
        this.dialogService.addDialog(AlertComponent, {
            title: 'Exception',
            message: message,

        }).subscribe(() => { });
    }

    handleSearch(event?: any) {
        this.settings = this.tableService.refresh(this.settings);
        this.pageRequest = new PageRequest();
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.filter.unbind(), true);
    }

    onPaginationChanged(event: any): void {
        if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
            this.pageRequest.page = event.page;
            this.search();
        }
    }

    handleCheckArea(event) {
        this.filter.area = event.target.checked;
    }

    handleTableChange({ action, data, event }) {
        if (action === 'cellclick') {
            switch(data.colId) {
                case 'title':
                    let link = getDealLink(data.item['coId'], data.item['dealId'], data.item['instantId']);
                    window.open(link, '_blank');
                    break;
                case 'categoryTitle':
                    RouteUtils.navigateTo(this.router, '/admin/category-list', {dealSrl: data.item['srl']});
                    break; 
            }
            

            // this.handleUpdate(data.item);
        } else if (action === 'sort') {
            let col = get(this.sortKeys, data.column, data.column);
            this.pageRequest.sort = {
                [col]: data.type
            };
            this.search();
        }
    }
}