import {Component, OnInit, animate}  from '@angular/core';
import {RoomImagesService} from "./roomImages.service";
import {ActivatedRoute} from "@angular/router";
import {Image} from "./image";

@Component({
  templateUrl: 'app/admin/rooms/roomImages.component.html',
  styleUrls: ['app/admin/rooms/roomImages.component.css']
})
export class RoomImagesComponent implements OnInit {
  pageTitle: string;
  images: Image[];

  constructor(private _route: ActivatedRoute, private _roomImagesService: RoomImagesService) {
    this.pageTitle = 'Room images component';
    // console.log("Images: ");
    // console.log(this._roomImagesService.images);
    this.images = this._roomImagesService.images;
  }

  ngOnInit(): void {
    // this.getUsers();
  }

// initial image index
  _Index: number = 0;
// if a current image is the same as requested image
  isActive(index: number) {
    return this._Index = index;
  };

// show prev image
  showPrev() {
    this._Index = (this._Index > 0) ? --this._Index : this.images.length - 1;
  };

// show next image
  showNext() {
    this._Index = (this._Index < this.images.length - 1) ? ++this._Index : 0;
  };

// show a certain image
  showPhoto(index: number) {
    this._Index = index;
  };

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  // action triggered when user swipes
  swipe(currentIndex: number, action = this.SWIPE_ACTION.RIGHT) {
    // out of range
    if (currentIndex > this.images.length || currentIndex < 0) return;

    let nextIndex = 0;

    // swipe right, next avatar
    if (action === this.SWIPE_ACTION.RIGHT) {
      const isLast = currentIndex === this.images.length - 1;
      nextIndex = isLast ? 0 : currentIndex + 1;
    }

    // swipe left, previous avatar
    if (action === this.SWIPE_ACTION.LEFT) {
      const isFirst = currentIndex === 0;
      nextIndex = isFirst ? this.images.length - 1 : currentIndex - 1;
    }

    // toggle avatar visibility
    this.images.forEach((x, i) => i === nextIndex);
  }
}
