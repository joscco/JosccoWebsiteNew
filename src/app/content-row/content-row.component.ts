import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-content-row',
  imports: [],
  templateUrl: './content-row.component.html'
})
export class ContentRowComponent {
  @HostBinding('class.contents') contents = true;
  @Input() reverse!: boolean;
}
