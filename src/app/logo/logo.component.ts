import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [
    RouterLink
  ],
  templateUrl: './logo.component.html'
})
export class LogoComponent {
  hovered: boolean = false;

  onEnter() {
    this.hovered = true;
  }

  onLeave() {
    this.hovered = false;
  }
}
