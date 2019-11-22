import {HttpStatus, ServerResponse} from "../../../../shared/models/server-response";
import {BaseModel} from "../../../../shared/models/base-model";

export class CategoryMappersResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'OK';
    public data: Array<CategoryMapperInDetail>;
    public pagination: {
        total: number,
        limit: number,
        page: number
    }
}

export class CategoryMapperInDetail {
    constructor(public srl?: number,
                public coId?:string,

                public extCat1Code?:string,
                public extCat2Code?:string,
                public extCat3Code?:string,
                public extCat4Code?:string,


                public extCat1Name?:string,
                public extCat2Name?:string,
                public extCat3Name?:string,
                public extCat4Name?:string,

                public intCat1Code?:number,
                public intCat2Code?:number,
                public checked?: boolean) {}
}

export class MapperFilterRequest extends BaseModel{
    public coIds: string[];
    public isUnmapped: boolean;
    public compTeamName: string;
    public snoopyTeamName:string;
    constructor() {
        super();
        this.coIds=['tmn', 'wmp'];
        this.isUnmapped = true;
        this.compTeamName ='';
        this.snoopyTeamName='';
    }
}

export class MappingRow {
    constructor(public srl?:number,
                public coName?:string,
                public compTeamName?: string,
                public snoopyOrgName?:string,
                public snoopyOrgId?:number,
                public snoopyTeamName?:string,
                public snoopyTeamId?:number,
                public categoryMapper?: CategoryMapperInDetail,
                public checked?: boolean,
                public selectedTeamId?: number,
                public selectedOrgName?: string
                ) {
        this.checked = false;
    }
}