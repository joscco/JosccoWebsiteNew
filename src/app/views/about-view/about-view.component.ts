import {Component, HostBinding} from '@angular/core';
import {FlowerMeadowComponent} from './flower-meadow/flower-meadow.component';

@Component({
  selector: 'app-about-view',
  templateUrl: './about-view.component.html',
  imports: [
    FlowerMeadowComponent
  ]
})
export class AboutViewComponent{
  @HostBinding('class') class = 'h-full';
}
