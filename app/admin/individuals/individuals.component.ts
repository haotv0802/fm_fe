import {Component, OnInit, HostListener, Inject, ViewContainerRef} from "@angular/core";
import {Individual} from "./individual";
import {IndividualsService} from "./individuals.service";
import {IndividualDetailsService} from "./individualDetails.service";
import {Router} from "@angular/router";
import {IndividualUpdateService} from "./individualUpdate.service";
import {Pagination} from "../../common/pagination";
import {Observable} from "rxjs/Rx";
import {DOCUMENT} from "@angular/platform-browser";
import {Overlay} from "angular2-modal";
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {MessagesService} from "../../common/messages/messages.service";

@Component({
  moduleId: module.id,
  templateUrl: 'individuals.component.html',
  styleUrls: ['individual.bubbling.component.css']
})
export class IndividualsComponent implements OnInit {
  pageTitle: string;
  individuals: Individual[];
  individualsALL: Individual[];
  pagination: Pagination;
  individualsCount: number;
  isOpen: boolean = true;

  constructor(
    private _messagesService: MessagesService,
    private _individualService: IndividualsService,
    private _individualDetailsService: IndividualDetailsService,
    private _individualUpdateService: IndividualUpdateService,
    private _router: Router,
    overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.pageTitle = 'Individual List';
    overlay.defaultViewContainer = vcRef;
  }

  onClick() {
    this.modal.alert()
      .size('lg')
      .showClose(true)
      .title('A simple Alert style modal window')
      .body(`
            <h4>Alert is a classic (title/body/footer) 1 button modal window that 
            does not block.</h4>
            <b>Configuration:</b>
            <ul>
                <li>Non blocking (click anywhere outside to dismiss)</li>
                <li>Size large</li>
                <li>Dismissed with default keyboard key (ESC)</li>
                <li>Close wth button click</li>
                <li>HTML content</li>
            </ul>
        `)
      .open();
  }

  ngOnInit(): void {
    this.getIndividuals(0);
    this.getAllIndividuals();
  }

  getAllIndividuals(): void {
    // let timer = Observable.interval(1000);
    // // subscribing to a observable returns a subscription object
    // timer.subscribe(
    //   () => {
    //     this._individualService.getIndividuals().subscribe(
    //       (individuals) => {
    //         this.individualsALL = individuals;
    //         this.isOpen = false;
    //       },
    //       (error) => {
    //         console.log(error);
    //       }
    //     );
    //   }
    // );
    this._individualService.getIndividuals().subscribe(
      (individuals) => {
        this.individualsALL = individuals;
        this.isOpen = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // @HostListener("window:scroll", [])
  // onWindowScroll() {
  //   let number = this.document.body.scrollTop;
  //   console.log("number: " + number);
  // }

  getIndividuals(pageNum: number) {
    Observable.forkJoin(
      this._individualService.getIndividualsCount(),
      this._individualService.getIndividualsWithPaging(pageNum)
    ).subscribe(
      (data) => {
        this.individualsCount = data[0];
        this.individuals = data[1].content;
        this.pagination = new Pagination(data[1], this.individualsCount);
      },
      (error: any) => {
        console.log(error);
      }
    )
    ;
    return false;
  }

  displayIndividual(individual: Individual) : void {
    this._individualDetailsService.individual = individual;
    this._router.navigate(["admin/individuals/details"]);
  }

  editIndividual(individual: Individual) : void {
    this._individualUpdateService.individual = individual;
    this._router.navigate(["admin/individuals/update"]);
  }

  addIndividual() {
    this._router.navigate(["admin/individuals/add"]);
    return false;
  }

  counter(length: number){
    return new Array(length);
  }

  // @HostListener('scroll', ['$event'])
  // onScroll(event: any) {
  //   console.log(event);
  // }

  onLoaderClicked(message: string): void {
    this.pageTitle = '--->' + message;
  }
}
