import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {IndividualService} from './individual.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IndividualPresenter} from './individualPresenter';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  moduleId: module.id,
  templateUrl: 'individual.component.html',
  styleUrls: ['individual.component.css']
})
export class IndividualComponent implements OnInit {
  pageTitle: string;
  individual: IndividualPresenter;
  loaderOpen = true;
  individualForm: FormGroup;

  private myOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
    width: '300px'
  };

  constructor(
    private _individualService: IndividualService,
    private _router: Router,
    private fb: FormBuilder
  ) {
    this.pageTitle = 'Individual';
  }

  ngOnInit(): void {
    this._individualService.getIndividual().subscribe(
      (res) => {
        this.individual = res;
        console.log(this.individual);

        this.individualForm = this.fb.group({
          firstName: [this.individual.firstName],
          middleName: [this.individual.middleName],
          lastName: [this.individual.lastName],
          birthday: [new Date()],
          gender: [this.individual.gender],
          email: [this.individual.email],
          phoneNumber: [this.individual.phoneNumber],
          income: [this.individual.income],
          moneySourceId: [this.individual.moneySourceId],
          moneySourceName: [this.individual.moneySourceName],
          startDate: [new Date()],
          expiryDate: [this.individual.expiryDate],
          cardNumber: [this.individual.cardNumber],
          creditLimit: [this.individual.creditLimit],
          bankId: [this.individual.bankId]
        });

        this.loaderOpen = false;
      }, (error) => {
        console.log(error);
      }
    );


  }
}
