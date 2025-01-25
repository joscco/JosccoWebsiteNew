import {Component} from '@angular/core';
import {LogoComponent} from '../logo/logo.component';
import {NavItemComponent} from '../nav-item/nav-item.component';

@Component({
  selector: 'app-nav-bar',
  imports: [
    LogoComponent,
    NavItemComponent
  ],
  templateUrl: './nav-bar.component.html'
})
export class NavBarComponent {

}
