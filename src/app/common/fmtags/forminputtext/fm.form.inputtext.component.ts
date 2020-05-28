import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'fm-form-inputtext',
  templateUrl: 'fm.form.inputtext.component.html'
})
export class FmFormInputtextComponent {
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
  @Input() formGroup: FormGroup;
}
