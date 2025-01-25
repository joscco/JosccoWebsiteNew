import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-section-heading',
  imports: [],
  templateUrl: './section-heading.component.html'
})
export class SectionHeadingComponent {
  @HostBinding('class.rounded-xl') roundedLg = true;
  @HostBinding('class.font-bold') fontBold = true;
  @HostBinding('class.p-5') p5 = true;
  @HostBinding('class.mx-1') mx1 = true;
  @HostBinding('class.my-0') my0 = true;
  @HostBinding('class.text-2xl') text2xl = true;
  @HostBinding('class.sm:text-3xl') textsm3xl = true;
  @HostBinding('class.md:text-4xl') textmd4xl = true;
  @HostBinding('class.lg:text-5xl') textlg5xl = true;
  @HostBinding('class.w-[250px]') w250 = true;
  @HostBinding('class.sm:w-[300px]') sm300 = true;
  @HostBinding('class.md:w-[350px]') md350 = true;
  @HostBinding('class.lg:w-[400px]') lg400 = true;
}
