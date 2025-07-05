import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ChangeDetectorRef
} from '@angular/core';
import gsap from 'gsap';

export interface DeskItem {
  id: string;
  type: 'wall' | 'table';
  relX: number;  // relativ zur Mitte: -100 bis +100 usw.
  y: number;     // absolut
  width: number;
}

@Component({
  selector: 'app-desk-scene',
  templateUrl: './desk.component.html',
  imports: []
})
export class DeskSceneComponent implements OnInit, AfterViewInit {
  @ViewChild('deskWrapper', {static: true}) deskWrapper!: ElementRef;
  @HostBinding('class') class = 'h-full w-full relative';

  @ViewChildren('item') itemRefs!: QueryList<ElementRef>;

  deskWidth = 850; // Standardwert
  isEditMode = false;

  defaultItems: DeskItem[] = [
    {"id": "notebook", "type": "table", "relX": -95, "y": 156, "width": 250},
    {"id": "coffee", "type": "table", "relX": 137, "y": 208, "width": 80},
    {"id": "right_photo", "type": "wall", "relX": -220, "y": 14, "width": 100},
    {"id": "left_photo", "type": "wall", "relX": 152, "y": 37, "width": 100}
  ]

  items: DeskItem[] = [];

  draggingId: string | null = null;
  dragOffset = {x: 0, y: 0};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const saved = localStorage.getItem('desk-layout');
    this.items = saved ? JSON.parse(saved) : [...this.defaultItems];
  }

  ngAfterViewInit() {
    this.deskWidth = this.deskWrapper.nativeElement.offsetWidth;

    window.addEventListener('resize', () => {
      this.deskWidth = this.deskWrapper.nativeElement.offsetWidth;
    });

    this.cdr.detectChanges()

    gsap.fromTo(
      this.deskWrapper.nativeElement,
      {y: '100%', opacity: 0},
      {y: '0%', opacity: 1, duration: 1, ease: 'power2.out'}
    );
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  resetPositions() {
    localStorage.removeItem('desk-layout');
    this.items = [...this.defaultItems];
    this.cdr.detectChanges();
  }

  logCurrentPositions() {
    const formatted = '[\n' + this.items.map(item => `  ${JSON.stringify(item)}`).join(', \n') + '\n]';
    console.log(formatted);
  }

  getScreenX(relX: number): number {
    return this.deskWidth / 2 + relX;
  }

  getRelativeX(screenX: number): number {
    return screenX - this.deskWidth / 2;
  }

  onPointerDown(event: PointerEvent, itemId: string) {
    this.draggingId = itemId;
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    this.dragOffset.x = event.clientX - this.getScreenX(item.relX);
    this.dragOffset.y = event.clientY - item.y;

    event.preventDefault();
  }

  onPointerMove(event: PointerEvent) {
    if (!this.draggingId) return;

    if (!this.isEditMode) return;

    const item = this.items.find(i => i.id === this.draggingId);
    if (!item) return;

    const newScreenX = event.clientX - this.dragOffset.x;
    const newRelX = this.getRelativeX(newScreenX);
    const newY = event.clientY - this.dragOffset.y;

    // Bereichsprüfung
    // if (item.type === 'table' && newY < 10) return;
    // if (item.type === 'wall' && newY >= 200) return;

    item.relX = Math.round(newRelX);
    item.y = Math.round(newY);
  }

  onPointerUp() {
    this.draggingId = null;
    localStorage.setItem('desk-layout', JSON.stringify(this.items));
  }
}
