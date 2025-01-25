import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-sub-section-heading',
  imports: [],
  templateUrl: './section-sub-heading.component.html'
})
export class SectionSubHeadingComponent {
  @HostBinding('class.text-lg') text2xl = true;
  @HostBinding('class.sm:text-xl') textsm3xl = true;
  @HostBinding('class.md:text-2xl') textmd4xl = true;
  @HostBinding('class.lg:text-3xl') textlg5xl = true;
}
