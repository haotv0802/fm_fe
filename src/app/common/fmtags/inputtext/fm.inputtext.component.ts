import {Component, Input} from '@angular/core';

@Component({
  selector: 'fm-inputtext',
  templateUrl: 'fm.inputtext.component.html'
})
export class FmInputTextComponent {
  @Input() id: string;
  @Input() placeHolder: string;
  @Input() styleValue = {
    'font-style':  'italic',
    'color': 'black',
    'font-size':   '12px',
    'width':   '800px'
  };
  // @Input() styleValue = {
  //   'font-style':  'italic',
  //   'color': 'black',
  //   'font-size':   '12px'
  // };
}
