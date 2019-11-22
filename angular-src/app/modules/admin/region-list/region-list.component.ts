import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subscription } from 'rxjs/Subscription';

import { SmartTableService } from '../../../common/smart-table/smart-table.service';
import { BlockUIService } from '../../../shared/services/block-ui.service';
import { RegionService } from '../services/region.service';
import RouteUtils from '../../../shared/utils/RouteUtils';
import { isEmpty } from '../../../shared/utils';
import { PageRequest } from '../../../shared/models/page-request';
import { Region, RegionFilter } from '../models/region';
import { RegionEditComponent } from '../region-edit/region-edit.component';
import { BadRequestResponse } from '../../../shared/models/bad-request-response';
import { AlertComponent } from "../../../common/alert/alert.component";
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

const CURRENT_URL = '/admin/region-list';

@Component({
    templateUrl: 'region-list.component.html'
})
export class RegionListComponent implements OnInit, OnDestroy {

    constructor(private router: Router,
        private route: ActivatedRoute,
        private viewContainerRef: ViewContainerRef,
        private blockUI: BlockUIService,
        private tableService: SmartTableService,
        private translateService: TranslateService,
        private regionService: RegionService,
        private dialogService: DialogService) {

        this.blockUI.vRef = this.viewContainerRef;


    }

    navSubscription: Subscription;
    ngOnInit(): void {
        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
            let params = RouteUtils.extractParams(this.route, {});
            this.regionFilter = new RegionFilter();
            this.regionFilter.bind(params);

            this.search();
        });
    }

    ngOnDestroy() {
        if (this.navSubscription) {
            this.navSubscription.unsubscribe();
        }
    }

    departments: String[] = [];
    departmentGroupMap: any = {};
    regionFilter: RegionFilter = new RegionFilter();
    regions: Region[];
    regionSetting = {
        table: {
            translate: true,
            sortMode: 'local'
        },
        column: {
            departName: {
                sortable: true,
                title: 'admin.region.departName'
            },
            groupName: {
                sortable: true,
                title: 'admin.region.groupName'
            },
            name: {
                sortable: true,
                title: 'admin.region.name'
            },
            used: {
                sortable: true,
                title: 'admin.region.used',
                align: 'center',
                render: (data: { value: any, item: object }, settings: object) => {
                    return data.value === 'Y' ? this.translateService.instant('admin.region.used_y') : this.translateService.instant('admin.region.used_n');
                }
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

    search() {
        this.blockUI.start();
        this.regionService.getAll()
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
                        let allRegions = serverResponse.data;
                        this.regions = serverResponse.data.filter(region => {
                            return (isEmpty(this.regionFilter.depart) || region.departName === this.regionFilter.depart)
                                && (isEmpty(this.regionFilter.keyword) || region.name.indexOf(this.regionFilter.keyword) >= 0)
                                && (isEmpty(this.regionFilter.used) || region.used === this.regionFilter.used)
                        });

                        this.departmentGroupMap = {};
                        allRegions.forEach(region => {
                            if (this.departmentGroupMap[region.departName] == undefined) {
                                this.departmentGroupMap[region.departName] = [region.groupName];
                            } else if (this.departmentGroupMap[region.departName].indexOf(region.groupName) < 0) {
                                this.departmentGroupMap[region.departName].push(region.groupName);
                            }
                        });

                        this.departments = Object.keys(this.departmentGroupMap);

                        this.blockUI.stop();
                        break;
                    }
                    default:
                        this.blockUI.stop()
                }

            }, error => {
                console.log('find region-list: ', error);
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
        this.regionSetting = this.tableService.refresh(this.regionSetting);
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.regionFilter.unbind(), true);
    }

    handleCreate(event) {
        let mthis = this;
        let model = new Region();
        model.used = 'Y';

        let params = {
            model: model,
            departmentGroupMap: this.departmentGroupMap
        };
        this.dialogService.addDialog(RegionEditComponent, params).subscribe(model => {
            if (model) {
                this.blockUI.start();
                mthis.regionService.create(model).subscribe(region => {
                    if (region && region.regionNo) {
                        mthis.search();
                    } else {
                        mthis.showErrorPopup(mthis.translateService.instant('err_unknown'))
                    }

                    mthis.blockUI.stop();
                }, error => {
                    console.log('update region: ', error);
                    mthis.blockUI.stop();
                });
            }
        });
    }

    handleUpdate(model) {
        let mthis = this;
        let params = {
            model: model,
            departmentGroupMap: this.departmentGroupMap
        };
        this.dialogService.addDialog(RegionEditComponent, params).subscribe(model => {
            if (model) {
                this.blockUI.start();
                mthis.regionService.update(model).subscribe(region => {
                    if (region && region.regionNo) {
                        mthis.search();
                    } else {
                        mthis.showErrorPopup(mthis.translateService.instant('err_unknown'))
                    }

                    mthis.blockUI.stop();
                }, error => {
                    console.log('update region: ', error);
                    mthis.blockUI.stop();
                });
            }
        });
    }

    handleTableChange({ action, data, event }) {
        if (action === 'cellclick' && data.colId === '_action') {
            this.handleUpdate(data.item);
        }
    }
}