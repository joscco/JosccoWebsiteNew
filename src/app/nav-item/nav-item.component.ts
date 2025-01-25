import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-nav-item',
  imports: [
    RouterLink
  ],
  templateUrl: './nav-item.component.html'
})
export class NavItemComponent {
  @Input() text: string = '';
  @Input() href: string = '';

}
