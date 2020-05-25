import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import {PromotionPresenter} from './promotionPresenter';
import {PromotionService} from './promotion.service';
import {BankService} from '../bank/bank.service';
import {BankPresenter} from '../bank/bankPresenter';
import {CategoryService} from '../category/category.service';
import {CategoryPresenter} from '../category/categoryPresenter';
import {IMyDateModel, IMyDpOptions} from 'mydatepicker';
import {createIMyDateModel} from '../utils';

@Component({
  moduleId: module.id,
  templateUrl: 'promotion.component.html',
  styleUrls: ['promotion.component.css']
})



export class PromotionComponent implements OnInit {
  pageTitle: string;
  promotionPresenter: PromotionPresenter;
  bankPresenter: BankPresenter[];
  catePresenter: CategoryPresenter[];
  promoTionFilter: PromotionPresenter = {id : null ,
                                        title : null ,
                                        content : null,
                                        start_date: null,
                                        end_date: null,
                                        provision: null,
                                        instalment: null,
                                        bank_id: null,
                                        category_id: null,
                                        url: null};
  promotionFrom: FormGroup;
  isSaveButtonDisplayed = false;
  loaderOpen = true;
  public myOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
    width: '150px'
  };
  constructor(
    private _promotionService: PromotionService,
    private _bankService: BankService,
    private _cateService: CategoryService,
    private _router: Router,
    private fb: FormBuilder) {
    this.pageTitle = 'Promotion';
  }

  ngOnInit(): void {
    this.promoTionFilter.title = 'G';
    this.promoTionFilter.content = null;
    this.promoTionFilter.start_date = null;
    this.promoTionFilter.end_date = null ;
    this.promoTionFilter.bank_id = null;
    this.promoTionFilter.category_id = null ;
    this.promoTionFilter.url = 'AAABA' ;
    this.promoTionFilter.id = 1 ;
    Observable.forkJoin(
      this._promotionService.getPromotion(this.promoTionFilter),
      this._bankService.getAllBanks(),
      this._cateService.getAllCates()
    ).subscribe((data) => {
      this.promotionPresenter = data[0];
      this.bankPresenter = data[1];
      this.catePresenter = data[2];
      console.log(this.bankPresenter);
      console.log(this.catePresenter);
    });
    this.loaderOpen = false;
    this.promotionFrom = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      start_date: [new Date()],
      end_date: [new Date()],
    })

  }

  addExpense(): void {}


  onDisplaySaveButton() {
    this.isSaveButtonDisplayed = true;
  }

  onSave(): void {}
  onCancel(): void {}



}
