import {Component, OnInit, ViewChild, OnDestroy} from "@angular/core";
import {RoomType} from "./roomType";
import {RoomsService} from "./rooms.service";
import {Image} from "./image";
import {RoomImagesService} from "./roomImages.service";
import {Router} from "@angular/router";
import {ModalComponent} from "../../common/modal/modal.component";
import {RoomTabsComponent} from "./tabs/roomTabs.component";
import {RoomUpdateService} from "./tabs/roomUpdate.service";
import {Subscription} from "rxjs/Rx";
import {MessagesService} from "../../common/messages/messages.service";

@Component({
  moduleId: module.id,
  templateUrl: 'rooms.component.html'
  // templateUrl: 'app/admin/rooms/rooms.component.html'
  // styleUrls: ['app/products/product-list.component.css']
})
export class RoomsComponent implements OnInit, OnDestroy {

  ready: boolean = false;
  messages: {};
  pageTitle: string;
  roomTypes: RoomType[];
  private sub: Subscription;
  @ViewChild(ModalComponent) modal: ModalComponent;

  constructor(
    private _messagesService: MessagesService,
    private _roomService: RoomsService,
    private _roomImagesService: RoomImagesService,
    private _router: Router,
    private _roomUpdateService: RoomUpdateService
  ) {
    this.pageTitle = 'Room Management';
    // this.getRoomTypes();
    this.messages = this._messagesService.getMessagesByName("roomsList");
  }

  ngOnInit(): void {
    // let timer = Observable.interval(1000);
    // this.sub = timer.subscribe(
    //   () => {
    //     this.getRoomTypes();
    //   }
    // )
    // ;

    this.getRoomTypes();
    if (this.messages != null) {
      this.ready = true;
    }
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

  getRoomTypes(): void {
    this._roomService.getRoomTypes().subscribe(
      (roomTypes) => {
        this.roomTypes = roomTypes;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  displayImages(images: Image[]) {
    this._roomImagesService.images = images;
    this._router.navigate(['admin/roomImages']);
    return false;
  }

  editRoom(roomType: RoomType) {
    // this.modal.modalTitle = "Room Tabs";
    this.modal.modalHeader = false;
    this.modal.modalFooter = false;
    this.modal.modalMessage = true;
    this.modal.documentWidth = 700;
    // this.modal.message = "Here Users Update component will load.";
    this.modal.open(RoomTabsComponent);
    this._roomUpdateService.roomType = roomType;
  }

  counter(length: number){
    return new Array(length);
  }

  syncData(data: RoomType) {
    // Observable.forkJoin(
    //   this._roomUpdateService.updateRoomType(data),
    //   this._roomService.getRoomTypes()
    // ).subscribe(
    //   (data) => {
    //     console.log(data[0]);
    //     this.roomTypes = data[1];
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // )
    // ;
    // console.log(event);
    // this.getRoomTypes();
  }
}
