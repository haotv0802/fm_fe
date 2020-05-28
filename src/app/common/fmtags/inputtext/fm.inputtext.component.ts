import {Component, Input} from '@angular/core';

@Component({
  selector: 'fm-inputtext',
  templateUrl: 'fm.inputtext.component.html'
})
export class FmInputTextComponent {
  @Input() id: string;
  @Input() placeHolder: string;
  @Input() styleValue = {
    'width':   '200px'
  };
  // @Input() styleValue = {
  //   'font-style':  'italic',
  //   'color': 'black',
  //   'font-size':   '12px'
  // };

  @Input() handleOnClick: Function;

}
