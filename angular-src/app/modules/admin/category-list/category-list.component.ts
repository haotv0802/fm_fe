import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subscription } from 'rxjs/Subscription';

import { SmartTableService } from '../../../common/smart-table/smart-table.service';
import { PageRequest } from '../../../shared/models/page-request';
import { BlockUIService } from '../../../shared/services/block-ui.service';
import { CategoryService } from '../services/category.service';
import RouteUtils from '../../../shared/utils/RouteUtils';
import { isEmpty, get } from '../../../shared/utils';
import { getDealLink } from '../../../shared/utils/DealUtils';
import { Category, CategoryFilter } from '../models/category';
import { BadRequestResponse } from '../../../shared/models/bad-request-response';
import { AlertComponent } from "../../../common/alert/alert.component";
import { CategorySelectComponent } from './category-select/category-select.component';

const CURRENT_URL = '/admin/category-list';

@Component({
    templateUrl: 'category-list.component.html'
})
export class CategoryListComponent implements OnInit, OnDestroy {

    constructor(private router: Router,
        private route: ActivatedRoute,
        private viewContainerRef: ViewContainerRef,
        private blockUI: BlockUIService,
        private tableService: SmartTableService,
        private translateService: TranslateService,
        private categoryService: CategoryService,
        private dialogService: DialogService) {

        this.blockUI.vRef = this.viewContainerRef;
        this.pageRequest = new PageRequest();


    }

    navSubscription: Subscription;
    ngOnInit(): void {
        this.getCategoryList();
        this.navSubscription = RouteUtils.subscribeNavigationEnd(this.router, CURRENT_URL, (event) => {
            let params = RouteUtils.extractParams(this.route, {});
            this.filter = new CategoryFilter();
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
    filter: CategoryFilter = new CategoryFilter();

    categories: Category[];
    categorySetting = {
        table: {
            translate: true
        },
        column: {
            startDate: {
                width: '150px',
                sortable: true,
                type: 'datetime',
                title: 'admin.category.startDate'
            },
            endDate: {
                width: '150px',
                sortable: true,
                type: 'datetime',
                title: 'admin.category.endDate'
            },
            title: {
                width: '300px',
                sortable: true,
                title: 'admin.category.title',
                render: (data: { value: any, item: object }, settings: object) => {
                    return '<a href="' + getDealLink(data.item['coId'], data.item['dealId'], data.item['instantId']) + '" target="_blank">' + data.value + '</a>';
                }
            },
            categoryNo: {
                width: '100px',
                clickable: true,
                sortable: true,
                title: 'admin.category.categoryNo',
                render: (data: { value: any, item: object }, settings: object) => {
                    return this.categoryMap[data.value] ? this.categoryMap[data.value]['title'] : '';
                }
            },
            categoryConfirmYN: {
                clickable: true,
                width: '50px',
                align: 'center',
                sortable: true,
                title: 'label.confirm',
                render: (data: { value: any, item: object }, settings: object) => {
                    return data.value == 'Y' ? '<i class="fa fa-check-square-o"></i>' : '<i class="fa fa-square-o"></i>';
                }
            },
            categoryModifier: {
                width: '100px',
                sortable: true,
                title: 'admin.category.categoryModifier'
            },
            categoryConfirmer: {
                width: '100px',
                sortable: true,
                title: 'admin.category.categoryConfirmer'
            },
            categoryModifiedAt: {
                width: '150px',
                sortable: true,
                type: 'datetime',
                title: 'admin.category.categoryModifiedAt'
            },
            categoryConfirmAt: {
                width: '150px',
                sortable: true,
                type: 'datetime',
                title: 'admin.category.categoryConfirmAt'
            },
            orgCat1: {
                width: '100px',
                sortable: true,
                title: 'admin.category.orgCat1'
            },
            orgCat2: {
                width: '100px',
                sortable: true,
                title: 'admin.category.orgCat2'
            },
            orgCat3: {
                width: '100px',
                sortable: true,
                title: 'admin.category.orgCat3'
            },
            shopName: {
                width: '300px',
                sortable: true,
                title: 'admin.category.shopName'
            },
            shopAddress: {
                width: '300px',
                sortable: true,
                title: 'admin.category.shopAddress'
            }
        }
    };

    sortKeys = {
        startDate: 'startdate',
        endDate: 'enddate',
        title: 'title',
        categoryNo: 'category',
        categoryConfirmYN: 'category_confirm_yn',
        categoryModifier: 'category_modifier',
        categoryConfirmer: 'category_confirmer',
        categoryModifiedAt: 'category_modified_at',
        categoryConfirmAt: 'category_confirm_at',
        orgCat1: 'org_cat1',
        orgCat2: 'org_cat2',
        orgCat3: 'org_cat3',
        shopName: 'shop_name',
        shopAddress: 'shop_address'
    }

    competitors: any = [
        { code: 'tmn', name: '티켓몬스터' },
        { code: 'cpn2', name: '쿠팡' },
        { code: 'grp', name: '그루폰' },
        { code: 'wmp', name: '위메프' },
        { code: 'cj', name: '오클락' }
    ];

    categogyOpts = [];
    categoryMap = {};

    search() {
        this.blockUI.start();
        this.categoryService.search(this.filter, this.pageRequest)
            .subscribe(serverResponse => {
                switch (serverResponse.httpStatus) {
                    case 'BAD_REQUEST': {
                        let badRequestResponse = serverResponse as BadRequestResponse;
                        console.log(badRequestResponse.exceptionMsg);
                        this.showErrorPopup(badRequestResponse.exceptionMsg)
                        this.blockUI.stop();
                        break;
                    }
                    case 'OK': {
                        this.categories = serverResponse.data;
                        this.pageRequest.totalItems = serverResponse.pagination.total;
                        this.blockUI.stop();
                        break;
                    }
                    default:
                        this.blockUI.stop()
                }

            }, error => {
                console.log('find category-list: ', error);
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
        this.categorySetting = this.tableService.refresh(this.categorySetting);
        this.pageRequest = new PageRequest();
        RouteUtils.navigateTo(this.router, CURRENT_URL, this.filter.unbind(), true);
    }

    getCategoryList() {
        this.categoryService.getCategoryList('all')
            .subscribe(serverResponse => {
                switch (serverResponse.httpStatus) {
                    case 'BAD_REQUEST': {
                        let badRequestResponse = serverResponse as BadRequestResponse;
                        console.log(badRequestResponse.exceptionMsg);
                        this.showErrorPopup(badRequestResponse.exceptionMsg);
                        break;
                    }
                    case 'OK': {
                        this.categogyOpts = serverResponse.data;
                        this.categogyOpts.forEach(c => {
                            this.categoryMap[c['categoryNo']] = c;
                        });

                        break;
                    }
                }

            }, error => {
                console.log('get all category: ', error);
            });
    }

    updateCategory(categoryNo: number, coDealId: string) {
        this.blockUI.start();
        this.categoryService.updateCategory(categoryNo, coDealId).subscribe(result => {
            // console.log(result);
            // this.blockUI.stop();
            // this.search();
            this.reloadCategory(coDealId);
        }, error => {
            console.log('update category: ', error);
            this.showErrorPopup(this.translateService.instant('err_unknown'));
            this.blockUI.stop();
        });
    }

    handleSelectCategory(item) {
        this.dialogService.addDialog(
            CategorySelectComponent,
            { categories: this.categogyOpts, categoryNo: item.categoryNo }
        ).subscribe(categoryNo => {
            if (categoryNo !== null && categoryNo !== undefined) {
                this.updateCategory(categoryNo, item.coDealId);
            }
        });
    }

    handleConfirmCategory(item) {
        this.blockUI.start();
        let confirm = item.categoryConfirmYN == 'Y' ? 'N' : 'Y';
        this.categoryService.confirmCategory(item.coDealId, confirm).subscribe(result => {
            // console.log(result);
            // this.blockUI.stop();
            // this.search();
            this.reloadCategory(item.coDealId);
        }, error => {
            console.log('confirm category: ', error);
            this.showErrorPopup(this.translateService.instant('err_unknown'));
            this.blockUI.stop();
        });
    }

    reloadCategory(coDealId: string) {
        this.categoryService.findByCoDealId(coDealId).subscribe(serverResponse => {
            if (serverResponse.httpStatus === 'OK') {
                let cats: Category[] = [];
                for (let cat of this.categories) {
                    if (cat['coDealId'] !== coDealId) {
                        cats.push(cat);
                    } else {
                        cats.push(serverResponse.data);
                    }
                }
                this.categories = cats;
            }
            this.blockUI.stop();

        }, error => {
            console.log('confirm category: ', error);
            this.showErrorPopup(this.translateService.instant('err_unknown'));
            this.blockUI.stop();
        });
    }

    onPaginationChanged(event: any): void {
        if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
            this.pageRequest.page = event.page;
            this.search();
        }
    }

    handleTableChange({ action, data, event }) {
        if (action === 'cellclick') {
            if (data.colId === 'categoryNo') {
                this.handleSelectCategory(data.item);
            } else if (data.colId === 'categoryConfirmYN') {
                this.handleConfirmCategory(data.item);
            }

        } else if (action === 'sort') {
            let col = get(this.sortKeys, data.column, data.column);
            this.pageRequest.sort = {
                [col]: data.type
            };
            this.search();
        }
    }
}