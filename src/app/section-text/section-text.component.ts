import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-section-text',
  imports: [],
  templateUrl: './section-text.component.html'
})
export class SectionTextComponent {
  @HostBinding('class.section-text') sectionText = true;
}
