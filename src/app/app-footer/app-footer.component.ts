import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './app-footer.component.html'
})
export class AppFooterComponent {
  @HostBinding('class') class = 'w-full';

}
