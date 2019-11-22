export class CellData {
    constructor(
        public saleDate?: string,
        public coId?: string,
        public departId?: number,
        public sales?: number,
        public isCancel?: boolean,
    ){}
}
export class RequestBody {
    public issues: CellData[];
    public modifiedUser: string;
}