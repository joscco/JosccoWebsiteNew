import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-content-col',
  imports: [],
  templateUrl: './content-col.component.html'
})
export class ContentColComponent {
  @HostBinding('class.w-full') wFull = true;
  @HostBinding('class.flex') flex = true;
  @HostBinding('class.items-center') itemsCenter = true;
  @HostBinding('class.justify-center') justifyCenter = true;
  @HostBinding('class.flex-col') flexCol = true;
  @HostBinding('class.text-center') textCenter = true;
}
