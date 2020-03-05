import {Component} from '@angular/core';
import {ModalComponent} from '../../common/modal/modal.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IMyDpOptions} from 'mydatepicker';
import {MoneySourcePresenter} from '../moneySourcePresenter';
import {createIMyDateModel} from '../../utils';
import {BankService} from '../../bank/bank.service';
import {BankPresenter} from '../../bank/bankPresenter';
import {IndividualService} from '../individual.service';

@Component({
  selector: 'moneySource',
  moduleId: module.id,
  templateUrl: 'moneySource.html',
  styleUrls: ['moneySource.css'],
})
export class MoneySourceComponent {
  modal: ModalComponent;
  moneySourceForm: FormGroup;
  moneySource: MoneySourcePresenter;
  dateModel: any;
  isSaveButtonDisplayed = false;
  banks: BankPresenter[];

  year: number;
  month: number;

  private myOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    width: '150px'
  };

  constructor(public _modal: ModalComponent,
              private fb: FormBuilder,
              private _bankService: BankService,
              private _individualService: IndividualService
  ) {
    this.modal = _modal;
    this.moneySource = this.modal.data;
  }

  ngOnInit(): void {
    console.log(this.modal);
    console.log(this.moneySource);

    this._bankService.getAllBanks().subscribe(
      (data) => {
        this.banks = data;
      }, error => {
        console.log(error);
      }
    );

    this.onReset();
  }

  onFormChange() {
    this.isSaveButtonDisplayed = true;
  }

  onSave() {
    console.log(this.moneySource);

    this.moneySource.name = this.moneySourceForm.get("name").value;
    this.moneySource.startDate = this.moneySourceForm.get('startDate').value.jsdate.getTime();
    this.moneySource.expiryDate = this.moneySourceForm.get('expiryDate').value.jsdate.getTime();
    this.moneySource.cardNumber = this.moneySourceForm.get("cardNumber").value;
    this.moneySource.creditLimit = this.moneySourceForm.get("creditLimit").value;
    this.moneySource.terminated = this.moneySourceForm.get("terminated").value;
    this.moneySource.bankId = this.moneySourceForm.get("bank").value;

    this.moneySource.bank = this.banks.find((item) => item.id == this.moneySource.bankId);

    this._individualService.updateMoneySource(this.moneySource).subscribe(
      (res) => {
        console.log(res);
      }, (error) => {
        console.log(error);
      }
    );

    this.modal.close();
  }

  onReset() {
    console.log("onReset");
    this.moneySourceForm = this.fb.group({
      name: [this.moneySource.name],
      startDate: [''],
      expiryDate: [''],
      cardNumber: [this.moneySource.cardNumber],
      creditLimit: [this.moneySource.creditLimit],
      terminated: [this.moneySource.terminated],
      bank: [this.moneySource.bank.id],
    });
    this.moneySourceForm.get('startDate').setValue(createIMyDateModel(new Date(this.moneySource.startDate)));
    this.moneySourceForm.get('expiryDate').setValue(createIMyDateModel(new Date(this.moneySource.expiryDate)));
    this.isSaveButtonDisplayed = false;
  }

  getData(data) {
    if (!data.expenses || !data.expenses.length) {
      return;
    }

    let year = data.year;
    let month = data.month;

  }

}
