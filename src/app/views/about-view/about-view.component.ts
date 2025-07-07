import {Component, HostBinding} from '@angular/core';
import { DeskSceneComponent} from './desk/desk.component';

@Component({
  selector: 'app-about-view',
  templateUrl: './about-view.component.html',
  imports: [
    DeskSceneComponent
  ]
})
export class AboutViewComponent{
  @HostBinding('class') class = 'h-full flex flex-1';
}
