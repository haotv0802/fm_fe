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
import { PageRequest } from '../../../shared/models/page-request';
import { Area, AreaFilter } from '../models/area';
import { AreaEditComponent } from '../area-edit/area-edit.component';
import { BadRequestResponse } from '../../../shared/models/bad-request-response';
import { AlertComponent } from "../../../common/alert/alert.component";
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

const CURRENT_URL = '/admin/address-list';

@Component({
    templateUrl: 'area-list.component.html'
})
export class AreaListComponent implements OnInit, OnDestroy {

    constructor(private router: Router,
        private route: ActivatedRoute,
        private viewContainerRef: ViewContainerRef,
        private tableService: SmartTableService,
        private blockUI: BlockUIService,
        private translateService: TranslateService,
        private areaService: AreaService,
        private regionService: RegionService,
        private dialogService: DialogService) {

        this.blockUI.vRef = this.viewContainerRef;
        this.pageRequest = new PageRequest();

        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
            let params = RouteUtils.extractParams(this.route, {});
            this.filter = new AreaFilter();
            this.filter.bind(params);

            this.search();
        });

        this.getDepartments();
    }

    navSubscription: Subscription;
    ngOnInit(): void {

    }

    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
    }

    regions: any[];
    departments: string[] = [];
    departmentMap: any = {};
    pageRequest: PageRequest;
    filter: AreaFilter = new AreaFilter();
    areas: Area[];
    areaSetting = {
        table: {
            translate: true
        },
        column: {
            departName: {
                sortable: true,
                title: 'admin.region.departName'
            },
            groupName: {
                sortable: true,
                title: 'admin.region.name'
            },
            address: {
                sortable: true,
                title: 'admin.area.address'
            },
            _action: {
                title: '',
                clickable: true,
                align: 'center',
                render: (data: { value: any, item: object }, settings: object) => {
                    return this.translateService.instant('label.update');
                }
            },
            createdAt: {
                sortable: true,
                title: 'admin.region.createdAt',
                type: 'datetime'
            },
            updatedAt: {
                sortable: true,
                title: 'admin.region.updatedAt',
                type: 'datetime'
            }
        }
    };
    sortKeys: any = {
        departName: 'depart_name',
        groupName: 'group_name',
        address: 'address',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    };

    search() {
        this.blockUI.start();
        this.areaService.search(this.filter, this.pageRequest)
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
                        this.areas = serverResponse.data;
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

    getDepartments() {
        this.blockUI.start();
        this.regionService.getDepartment()
            .subscribe(serverResponse => {
                if (serverResponse.httpStatus === 'OK') {
                    this.departmentMap = serverResponse.data;
                    this.departments = Object.keys(this.departmentMap);

                    this.regions = this.departmentMap[this.filter.depart];
                    this.filter.region = '';
                }
                this.blockUI.stop()

            }, error => {
                console.log('find departments: ', error);
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
        this.areaSetting = this.tableService.refresh(this.areaSetting);
        this.pageRequest = new PageRequest();
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.filter.unbind(), true);
    }

    handleDepartChange(event) {
        let val = event.target.value;
        this.filter.depart = val;
        
        this.regions = this.departmentMap[val];
        this.filter.region = '';
    }

    handleCreate(event) {
        let mthis = this;
        let model = new Area();

        let params = {
            model: {...model},
            departmentMap: {...this.departmentMap}
        };
        this.dialogService.addDialog(AreaEditComponent, params).subscribe(model => {
            if (model) {
                this.blockUI.start();
                mthis.areaService.create(model).subscribe(area => {
                    mthis.search();
                    mthis.blockUI.stop();
                }, error => {
                    console.log('update area: ', error);
                    mthis.blockUI.stop();
                });
            }
        });
    }

    handleUpdate(model) {
        let mthis = this;
        let params = {
            model: {...model},
            departmentMap: {...this.departmentMap}
        };
        this.dialogService.addDialog(AreaEditComponent, params).subscribe(model => {
            if (model) {
                this.blockUI.start();
                mthis.areaService.update(model).subscribe(area => {
                    mthis.search();
                    mthis.blockUI.stop();
                }, error => {
                    console.log('update area: ', error);
                    mthis.blockUI.stop();
                });
            }
        });
    }

    onPaginationChanged(event: any): void {
        if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
            this.pageRequest.page = event.page;
            this.search();
        }
    }

    handleTableChange({ action, data, event }) {
        if (action === 'cellclick' && data.colId === '_action') {
            this.handleUpdate(data.item);
        } else if (action === 'sort') {
            let col = get(this.sortKeys, data.column, data.column);
            this.pageRequest.sort = {
                [col]: data.type
            };
            this.search();
        }
    }
}