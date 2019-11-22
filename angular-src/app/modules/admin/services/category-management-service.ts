import {ApiService} from "../../../shared/services/api.service";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Organization, OrganizationType, ParentOrganization, Version} from "../models/category";

const URL_GET_ALL_ORGANIZATION_TEAM = "api/organizationCategory/organizationsAndTeams/list";
const URL_POST_CREATE_ORGANIZATION = "api/organizationCategory/organization/add";
const URL_POST_CREATE_TEAM = "api/organizationCategory/team/add";
const URL_POST_RENEWAL_ORGANIZATION = "api/organizationCategory/organization/renewOrganizationVersion";
const URL_POST_ORGANIZATION_MAPPING_CHECK = "api/organizationCategory/organization/checkMapping";
const URL_POST_UPDATE_ORGANIZATION_CHANGES = "api/organizationCategory/organizationsAndTeams/update";

@Injectable()
export class CategoryManagementService {
    constructor(private apiService: ApiService) {
    };

    getAllOrganizationAndTeam(): Observable<any> {
        return this.apiService.getRaw(URL_GET_ALL_ORGANIZATION_TEAM, null).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    postCreateOrganizationOrTeam(type: OrganizationType, organization: Organization, other: ParentOrganization): Observable<any> {
        let url = type == OrganizationType.Org ? URL_POST_CREATE_ORGANIZATION : URL_POST_CREATE_TEAM;
        let requestBody = type == OrganizationType.Org ? organization : other;
        return this.apiService.postRaw(url, requestBody).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    postRenewalOrganization(version: Version): Observable<any> {
        return this.apiService.postRaw(URL_POST_RENEWAL_ORGANIZATION, version).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    postCheckOrganizationMapping(organization: Organization): Observable<any> {
        return this.apiService.postRaw(URL_POST_ORGANIZATION_MAPPING_CHECK, organization).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }

    postUpdateAllOrganizationChanges(organizations: Organization[]): Observable<any> {
        return this.apiService.postRaw(URL_POST_UPDATE_ORGANIZATION_CHANGES, organizations).map(resp => {
            return resp;
        }).catch(error => Observable.throw(error))
    }
}

