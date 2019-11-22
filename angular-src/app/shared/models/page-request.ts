import {AppSettings} from "./app-settings";
import { URLSearchParams } from '@angular/http'

export class PageRequest {

    constructor(public page: number = 0, // TODO: first page must be 1
                public size: number = AppSettings.MAX_SIZE_VISIBLE,
                public totalPages: number = 0,
                public totalItems: number = 0,
                public sort: object = null) {}

    reset(): void {
        this.page = 0; // TODO: first page must be 1
        this.size = AppSettings.MAX_SIZE_VISIBLE;
        this.totalPages = 0;
        this.totalItems = 0;
        this.sort = null;
    }

    buildSortParam(query: URLSearchParams) {
        query.set('page', (this.page > 0 ? this.page - 1 : 0).toString());
        query.set('limit', this.size.toString());
    }

    buildPagingParam(query: URLSearchParams) {
        if (this.sort != null) {
            for(let prop in this.sort) {
                if (this.sort.hasOwnProperty(prop)) {
                    query.append('sort', prop + ',' + this.sort[prop]);
                }
            }
        }
    }
}