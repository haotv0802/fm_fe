import {PageRequest} from "./page-request";
import {AppSettings} from "./app-settings";

export class Pagination {
    constructor(public pageRequest: PageRequest,
                public maxSize: number = AppSettings.MAX_SIZE_VISIBLE,
                public itemPerPage: number = AppSettings.MAX_SIZE_VISIBLE,
                public totalItems: number = 0) {
    }
}