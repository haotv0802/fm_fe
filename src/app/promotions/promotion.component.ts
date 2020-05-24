import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ModalComponent} from '../common/modal/modal.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import {ToasterService} from 'angular2-toaster';
import {Constants} from './../common/constant';
import {PromotionPresenter} from './promotionPresenter';
import {PromotionService} from './promotion.service';
import {IMyDateModel, IMyDpOptions} from 'mydatepicker';
import {createIMyDateModel} from '../utils';

@Component({
  moduleId: module.id,
  templateUrl: 'promotion.component.html',
  styleUrls: ['promotion.component.css']
})



export class PromotionComponent implements OnInit {
  pageTitle: string;
  promotionpresenter: PromotionPresenter;
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
  promotionData = [];
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
      this._promotionService.getPromotion(this.promoTionFilter)
    ).subscribe((data) => {
      this.promotionpresenter = data[0];
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
