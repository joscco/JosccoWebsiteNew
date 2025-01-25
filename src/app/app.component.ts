import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {animate, animateChild, group, query, style, trigger} from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavBarComponent
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
}
