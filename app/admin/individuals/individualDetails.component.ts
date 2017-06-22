import {Component, OnInit} from "@angular/core";
import {Individual} from "./individual";
import {IndividualDetailsService} from "./individualDetails.service";
import {Router} from "@angular/router";
import {IndividualUpdateService} from "./individualUpdate.service";

@Component({
  moduleId: module.id,
  templateUrl: 'individualDetails.component.html',
  styleUrls: ['individualDetails.component.css']
})
export class IndividualDetailsComponent implements OnInit {
  individual: Individual;
  pageTitle: string;
  constructor(
    private _individualDetailsService: IndividualDetailsService,
    private _individualUpdateService: IndividualUpdateService,
    private _router: Router
  ) {
    this.pageTitle = 'Individual Details';
  }

  ngOnInit(): void {
    this.individual = this._individualDetailsService.individual;
  }

  backIndividualList() {
    this._router.navigate(["admin/individuals"]);
  }

  editIndividual() {
    this._individualUpdateService.individual = this.individual;
    this._router.navigate(["admin/individuals/update"]);
  }
}
