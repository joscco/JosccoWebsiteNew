import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html'
})
export class LogoComponent {
  @Input() menuActive: boolean = false;
  @Output() toggleMenuActive = new EventEmitter<void>();
  hovered: boolean = false;

  onLogoClick(): void {
    this.toggleMenuActive.emit();
  }

  onEnter() {
    this.hovered = true;
  }

  onLeave() {
    this.hovered = false;
  }
}
