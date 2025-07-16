import {Component} from '@angular/core';
import {ChildrenOutletContexts, RouterOutlet} from '@angular/router';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {AppFooterComponent} from './app-footer/app-footer.component';
import {fadeInAndOutAnimations} from './app.animations';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavBarComponent,
    AppFooterComponent
  ],
  templateUrl: './app.component.html',
  animations: [
    fadeInAndOutAnimations
  ]
})
export class AppComponent {
  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
