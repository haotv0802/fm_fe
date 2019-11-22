import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {BlockUIService} from "../../../../shared/services/block-ui.service";
import {DialogService} from "ng2-bootstrap-modal";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {CategoryMappingService} from "../services/category-mappers.service";
import {
    CategoryMapperInDetail,
    CategoryMappersResponse,
    MapperFilterRequest,
    MappingRow
} from "../models/category-mappers";
import {BadRequestResponse} from "../../../../shared/models/bad-request-response";
import {PageRequest} from "../../../../shared/models/page-request";
import {CategoryGroupsInDetailResponse} from "../../../competitor/models/competitor-by-category";
import {doLogout, isNull, showErrorPopup} from "../../../../shared/utils";
import {FileUploader} from "ng2-file-upload";
import { FileUploadModule } from "ng2-file-upload";
import {AlertComponent} from "../../../../common/alert/alert.component";

@Component({
    templateUrl: './competitor-mapping.component.html',
    styleUrls: ['./competitor-mapping.component.css']
})
export class CompetitorMappingComponent implements OnInit {

    filterRequest: MapperFilterRequest;
    isChangeMode: boolean;
    pageRequest: PageRequest;
    public fileUploader:FileUploader = new FileUploader({url: "/api/categorymappers/importcsv"});
    private target: any;
    private fileName : string;
    private hasAnyUploadError = false;

    snoopyTeams = [];

    mappingRowsSource : MappingRow[] = [];

    newMappers: CategoryMapperInDetail[] = [];
    teamSelectedIdForCheckAll: number = 0;
    checkAllSelectDisabled: boolean = true;

    competitors = [
        { coId:'tmn',  name: 'TMN'},
        { coId:'wmp',  name: 'WMP'}
    ];

    constructor(private categoryMappingsService: CategoryMappingService,
                private router: Router,
                private route: ActivatedRoute,
                private blockUI: BlockUIService,
                private dialogService: DialogService,
                private viewContainerRef: ViewContainerRef,
                private translateService: TranslateService
    ) {
        this.blockUI.vRef = this.viewContainerRef;

        this.filterRequest = new MapperFilterRequest();
        this.isChangeMode = false;
        this.pageRequest = new PageRequest();
    }

    onPaginationChanged(event: any): void {
        if (!this.blockUI.isLoading()) { // prevent duplicate call search method (search after paging)
            this.pageRequest.page = event.page - 1;
            this.onGetMappers();
        }
    }
    ngOnInit() {
        this.onGetCurrentCategoryGroups();
        this.initUploader();
    }

    ngAfterViewInit(): void {
        this.blockUI.start;
        this.onBtnClickInquiry();
        this.blockUI.stop;
    }

    onBtnClickChangeMode() {
        this.isChangeMode = !this.isChangeMode;
        this.teamSelectedIdForCheckAll = 0;
    }


    onBtnClickChangeMappers(): void {
        this.onSaveMappers();
    }


    onBtnClickCancelChange():void  {
        this.isChangeMode = false;
        this.teamSelectedIdForCheckAll = 0;
        this.newMappers = [];
        this.pageRequest.reset();
        this.onGetMappers();
    }

    onBtnClickExport(): void {
        this.categoryMappingsService.exportToExcel(this.filterRequest);
    }

    onBtnClickInquiry(): void  {
        this.pageRequest.reset();
        this.onGetMappers();
        this.teamSelectedIdForCheckAll = 0;
    }

    onCheckedUnmappedMapping(event) {
        this.filterRequest.isUnmapped=!this.filterRequest.isUnmapped;
    }


    onGetMappers():void {
        this.blockUI.start();
        this.categoryMappingsService.getMappers(this.filterRequest, this.pageRequest).subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                }
                case 'OK': {
                    this.mappingRowsSource = [];
                    let mappersResp = serverResponse as CategoryMappersResponse;
                    mappersResp.data.forEach(m => {
                        let team = this.snoopyTeams.find(t => t.id == m.intCat2Code);
                        if(team ===undefined || team === null) {
                            team = {id: 0, name:'', selectedTeamId: 0, org: {id: 0, name: ''}};
                        }
                        let coName = this.competitors.find(cmp=> cmp.coId == m.coId).name;
                        let mappingRow = new MappingRow(m.srl, coName,  m.extCat1Name + ' > '+m.extCat2Name + ' > ' + m.extCat3Name + ' > ' + m.extCat4Name,
                            team.org.name, team.org.id, team.name, team.id, m);
                        this.mappingRowsSource.push(mappingRow);
                    });
                    this.pageRequest.totalItems = mappersResp.pagination.total;
                }
            }
            this.blockUI.stop();
        }, error => {
            console.log('error to category mappers', error);
            this.blockUI.stop();
        });
    }


    onSaveMappers():void {

        let updatedMappers = new Map<number, CategoryMapperInDetail>();

        if(this.newMappers.length > 0){

            this.newMappers.forEach(e => {
               if(e.checked){
                   updatedMappers.set(e.srl, e);
               }
            });
            this.blockUI.start();
            this.categoryMappingsService.updateMappers(Array.from(updatedMappers.values())).subscribe(serverResponse => {
                switch (serverResponse.httpStatus) {
                    case 'BAD_REQUEST': {
                        let badRequestResponse = serverResponse as BadRequestResponse;
                        console.log(badRequestResponse.exceptionMsg);
                    }
                    case 'OK': {
                        this.pageRequest.reset();
                        this.onGetMappers();
                    }
                }
                this.blockUI.stop();
            }, error => {
                console.log('error to get current category groups', error);
                this.blockUI.stop();
            });

            //reset to new view
            this.isChangeMode= false;
            this.newMappers =[];

        }


    }

    onGetCurrentCategoryGroups(): void {
        this.blockUI.start();
        this.categoryMappingsService.getCurrentCategoryGroups().subscribe(serverResponse => {
            switch (serverResponse.httpStatus) {
                case 'BAD_REQUEST': {
                    let badRequestResponse = serverResponse as BadRequestResponse;
                    console.log(badRequestResponse.exceptionMsg);
                }
                case 'OK': {
                    let groups = serverResponse as CategoryGroupsInDetailResponse;

                    groups.data.forEach(gr => {

                        let dep  = gr.childs.find(c=> c.cateNo == gr.cateNo);
                        if(!isNull(dep)) {
                            gr.childs.filter(c=> c.cateNo != gr.cateNo)
                                .forEach(t => {
                                    this.snoopyTeams.push({
                                        id: t.cateNo,
                                        name: t.name,
                                        org: {id: dep.cateNo, name: dep.name }
                                    });
                                });
                        }

                    });
                }
            }
            this.blockUI.stop();
        }, error => {
            console.log('error to get current category groups', error);
            this.blockUI.stop();
        });
    }
    onCompanyChange(event) {
        if(event.target.value === '') {
            this.filterRequest.coIds = this.competitors.map(comp=> comp.coId);
        } else {
            this.filterRequest.coIds =  [event.target.value];
        }
    }

    onTeamChangeForCheckAll() {
        let selectedTeam = this.snoopyTeams.find(i=>i.id == this.teamSelectedIdForCheckAll);
        this.mappingRowsSource.forEach(e => {
            if(e.checked) {
                e.selectedTeamId = selectedTeam != undefined ? selectedTeam.id : "";
                this.onSelectChangeItem(e);
            }
        });
    }

    onCheckOnACheckBox(item, event){
        this.newMappers.forEach(e => {
            if(e.srl == item.srl){
                e.checked = event.target.checked;
            }
        });

        this.checkAllSelectDisabled = false;
    }

    handleCheckAll(event) {
        if(event.target.value)
        this.mappingRowsSource.forEach(e => {
            e.checked = event.target.checked;
        });
        this.newMappers.forEach(e=>{
           e.checked = event.target.checked;
        });
    }

    onSelectChangeItem(event) {
        let mappingItem = event;
        let selectedTeam = this.snoopyTeams.find(t =>  t['id']== event.selectedTeamId);
        if(selectedTeam != undefined) {
            mappingItem["selectedOrgName"] = selectedTeam.org.name;

            //add new mapping item
            let newMapper = this.newMappers.find(cm => cm.srl == mappingItem.srl);
            if(newMapper == undefined || newMapper == null) {
                let originMapper = mappingItem['categoryMapper'];
                newMapper = Object.assign({}, originMapper);
            }

            newMapper.intCat1Code = selectedTeam.org.id;
            newMapper.intCat2Code = selectedTeam.id;
            newMapper.checked = mappingItem["checked"];
            this.newMappers.push(newMapper);
        }else{
            mappingItem["selectedOrgName"] = "";
            this.newMappers = [];
        }
    }

    public initUploader(){

        this.fileUploader.onCompleteItem = (item, response, status) => {
            this.fileName = item.file.name;

            let responseJson = JSON.parse(response);

            if(responseJson["httpStatus"] === "BAD_REQUEST"){
                this.blockUI.stop();
                showErrorPopup(this.dialogService, this.translateService, responseJson["exceptionMsg"])
            }
            else if(status === 200) {
                let res = JSON.parse(response);
                this.fileUploader.clearQueue();
                this.showInfoPopup(res["data"]);

            } else {
                this.hasAnyUploadError = true;
                //this.data = [];
            }
            this.blockUI.stop();
        }

        this.fileUploader.onBuildItemForm = (fileItem: any, form: any) => {
            this.fileName = fileItem.file.name;
        };
        this.fileUploader.onErrorItem = (item, response, status) => {
            this.hasAnyUploadError = true;
            this.fileName = item.file.name;
        }

        this.fileUploader.onCompleteAll = () => {
            this.blockUI.stop();
            this.fileUploader.clearQueue();
            if (this.target) this.target.value = '';
        }

    }

    public onUpload(event) {

        this.blockUI.start();
        this.target = event.target || event.srcElement;
        if(this.fileUploader.queue.length > 0) {
            this.hasAnyUploadError = false;
            this.fileUploader.uploadAll();
        }
    }

    showInfoPopup(data) : void{
        let title = this.translateService.instant("label.info");
        let msg = this.translateService.instant("message.file_upload_success");
        msg = msg.replace("<FILE>", data);

        this.dialogService.addDialog(AlertComponent, {
            title: title,
            message: msg,

        }).subscribe(() => {
            this.blockUI.stop();
        });
    }

}
