export class Register {
    constructor(
        public username?: string,
        public fullName?: string,
        public currentDepartment?: Department,
        public version?: string,
        public departments?: Department[],
        public newDepartments?: Department[],
        public isRegister?: boolean,
        public userMemo?: string,
        public requestedCategories?:string,
        public appliedToSystem?: number,
    ){
        this.isRegister = true;
        this.newDepartments = [];
        this.appliedToSystem = AppliedSystem.SNOOPY1_SNOOPY2;
    };
}
export class Department {
    constructor(
        public id?: string,
        public name?: string,
        public selected?: boolean
    ){};
}

export enum AppliedSystem {
    SNOOPY1 = 1, SNOOPY2 = 2, SNOOPY1_SNOOPY2 = 0
}
