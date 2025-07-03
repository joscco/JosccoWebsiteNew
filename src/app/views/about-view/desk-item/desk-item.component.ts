import {AfterViewInit, Component, ChangeDetectorRef, ElementRef, Input, ViewChild} from '@angular/core';
import {gsap} from 'gsap';

@Component({
  selector: 'app-desk-item',
  templateUrl: './desk-item.component.html',
})
export class DeskItemComponent implements AfterViewInit{
  @Input() id!: string; // Eindeutige ID für jedes Element
  @Input() type!: 'wall' | 'table';
  @Input() position = { x: 0, y: 0 };
  @Input() width!: number

  @ViewChild('imgRef', {static: true}) imgRef!: ElementRef;
  currentImage = '';
  isDragging = false;
  private offset = { x: 0, y: 0 };

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    console.log("Init")
    this.currentImage = `images/about/${this.id}.png`;
    this.cdr.detectChanges();
    gsap.fromTo(
      this.imgRef.nativeElement,
      { scale: 0},
      { scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.offset.x = event.clientX - this.position.x;
    this.offset.y = event.clientY - this.position.y;
    event.preventDefault();
  }

  stopDrag() {
    if (this.isDragging) {
      this.isDragging = false;
    }
  }

  onDrag(event: MouseEvent) {
    if (this.isDragging) {

      // Berechnung der neuen Position
      const newX = event.clientX - this.offset.x;
      const newY = event.clientY - this.offset.y;

      // Begrenzung je nach Typ
      if (this.type === 'table' && newY < -100) {
        return; // Tischfläche: y ≥ 300
      } else if (this.type === 'wall' && newY >= 300) {
        return; // Wandfläche: y < 300
      }

      this.position.x = newX;
      this.position.y = newY;
    }
  }

  getPosition() {
    return { id: this.id, type: this.type, position: {x: this.position.x, y: this.position.y}, width: this.width };
  }
}
