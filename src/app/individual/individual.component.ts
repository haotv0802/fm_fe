import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {IndividualService} from './individual.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IndividualPresenter} from './individualPresenter';
import {IMyDpOptions} from 'mydatepicker';
import {createIMyDateModel} from '../utils';
import {BankService} from '../bank/bank.service';
import {ModalComponent} from '../common/modal/modal.component';
import {MoneySourcePresenter} from './moneySourcePresenter';
import {MoneySourceComponent} from './modals/moneySource.component';

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
  @ViewChild(ModalComponent) modal: ModalComponent;

  private myOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
    width: '300px'
  };

  constructor(
    private _individualService: IndividualService,
    private _bankService: BankService,
    private _router: Router,
    private fb: FormBuilder
  ) {
    this.pageTitle = 'Individual';
  }

  ngOnInit(): void {

    this._bankService.getBanks().subscribe(
      (res) => {
        console.log("banks:");
        console.log(res);
      }, (error) => {
        console.log(error);
      }
    );

    this._individualService.getIndividual().subscribe(
      (res) => {
        this.individual = res;
        console.log(this.individual);

        this.individualForm = this.fb.group({
          firstName: [this.individual.firstName],
          middleName: [this.individual.middleName],
          lastName: [this.individual.lastName],
          birthday: [''],
          gender: [this.individual.gender],
          email: [this.individual.email],
          phoneNumber: [this.individual.phoneNumber],
          income: [this.individual.income],
        });
        this.individualForm.get('birthday').setValue(createIMyDateModel(new Date(this.individual.birthday)));
        this.loaderOpen = false;
      }, (error) => {
        console.log(error);
      }
    );
  }

  onSave(): void {
    this.individual.firstName = this.individualForm.get('firstName').value;
    this.individual.middleName = this.individualForm.get('middleName').value;
    this.individual.lastName = this.individualForm.get('lastName').value;
    this.individual.birthday = this.individualForm.get('birthday').value;
    this.individual.gender = this.individualForm.get('gender').value;
    this.individual.email = this.individualForm.get('email').value;
    this.individual.phoneNumber = this.individualForm.get('phoneNumber').value;
    this.individual.income = this.individualForm.get('income').value;
  }

  onOpenEdit(moneySource: MoneySourcePresenter): void {
    this.modal.modalFooter = false;
    this.modal.modalMessage = true;
    this.modal.documentWidth = 800;

    this.modal.data = moneySource;

    this.modal.open(MoneySourceComponent);
  }

  getData(data) {
    console.log(data);
  }
}
