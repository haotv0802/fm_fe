import {HttpStatus, ServerResponse} from "../../../shared/models/server-response";

export class NaverDeals {
    public keyword?: string
    public countOfResult?: number;
    public resultRank?: number;
    public seller1?: string;
    public title?: string;
    public minPrice?: number;
    public maxPrice?: number;
    public tag?: string;
    public countTag?: number;
    public deliveryFee?: string;
    public startdate?: string;
    public category?: string;
    public discountInfo?: string;
    public mainUrl?: string;
    public categoryPath?: string;
}

export class SearchNaverDealResultDto {
    public naverDealDtos?: NaverDeals[];
    public pageSize?: number;
    public pageNumber?: number;
    public searchFinish?: boolean;
    public totalDeals?: number;
}

export class NaverDealsServerResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: SearchNaverDealResultDto;
}