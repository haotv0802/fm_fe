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
import {ToasterService} from 'angular2-toaster';
import {Constants} from '../common/constant';
import * as moment from 'moment';

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
    dateFormat: 'yyyy-mm-dd',
    width: '150px'
  };
  constructor(
    private _promotionService: PromotionService,
    private _bankService: BankService,
    private _cateService: CategoryService,
    private _router: Router,
    private _toasterService: ToasterService,
    private _constants: Constants,
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
      this.catePresenter = data[2]
      console.log(this.promotionPresenter);
    });
    this.loaderOpen = false;
    this.promotionFrom = this.fb.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      start_date: [new Date()],
      end_date: [new Date()],
      bank: [null, [Validators.required]],
      cate: [null, [Validators.required]],
    })

  }


  onDisplaySaveButton() {
    this.isSaveButtonDisplayed = true;
  }

  onSearch(): void {
    let startDateVal: string;
    let endDateVal: string;
    let startDateNumb: number;
    let endDateNumb: number;



    if (this.promotionFrom.get('start_date').value.jsdate !== undefined) {
       startDateVal = moment(this.promotionFrom.get('start_date').value.jsdate.toLocaleString()).format('YYYY-MM-DD');
       startDateNumb = this.promotionFrom.get('start_date').value.jsdate.getFullYear()
         + this.promotionFrom.get('start_date').value.jsdate.getMonth()
         +  this.promotionFrom.get('start_date').value.jsdate.getDate();
    }
    if (this.promotionFrom.get('end_date').value.jsdate !== undefined) {
         endDateVal = moment(this.promotionFrom.get('end_date').value.jsdate.toLocaleString()).format('YYYY-MM-DD');
      endDateNumb = this.promotionFrom.get('end_date').value.jsdate.getFullYear()
        + this.promotionFrom.get('end_date').value.jsdate.getMonth()
        + this.promotionFrom.get('end_date').value.jsdate.getDate();
    }
    if (startDateNumb > endDateNumb) {
      this._toasterService.pop(this._constants.TOASTER_ERROR);
    }else {
      this.promoTionFilter.title = this.promotionFrom.get('title').value;
      this.promoTionFilter.content = this.promotionFrom.get('content').value;
      this.promoTionFilter.start_date = startDateVal;
      this.promoTionFilter.end_date = endDateVal;
      this.promoTionFilter.bank_id = this.promotionFrom.get('bank').value;
      this.promoTionFilter.category_id = this.promotionFrom.get('cate').value;
      this._promotionService.getPromotion(this.promoTionFilter).subscribe((promotion) => {
        this.promotionPresenter = promotion ;
        console.log(this.promotionPresenter);
      });
    }
  }
  onCancel(): void {
    this.promotionFrom.reset();
  }





}
