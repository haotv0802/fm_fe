import {Component} from '@angular/core';

@Component({
  templateUrl: 'app/common/home/welcome.component.html',
  styleUrls: ['app/common/home/fountain.component.css', 'app/common/home/bubbling.component.css']
})
export class WelcomeComponent {
  public pageTitle: string = 'Welcome';
}
