import {
  AfterViewInit,
  OnDestroy,
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
  intendedRelativeX: number;  // relativ zur Mitte: -100 bis +100 usw.
  x?: number,
  y: number;     // absolut
  width: number;
}

@Component({
  selector: 'app-desk-scene',
  templateUrl: './desk.component.html',
  imports: []
})
export class DeskSceneComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('deskWrapper', {static: true}) deskWrapper!: ElementRef;
  @HostBinding('class') class = 'h-full w-full relative';

  @ViewChildren('item') itemRefs!: QueryList<ElementRef>;

  maxDeskWidth = 1000; // Standardwert
  deskWidth = 0;
  isEditMode = false;

  defaultItems: DeskItem[] = [
    {"id": "block", "type": "table", "intendedRelativeX": -161, "y": 115, "width": 100, "x": -161},
    {"id": "coffee", "type": "table", "intendedRelativeX": 166, "y": 8, "width": 80, "x": 166},
    {"id": "keyboard", "type": "table", "intendedRelativeX": 118, "y": 148, "width": 200, "x": 118},
    {"id": "left_photo", "type": "wall", "intendedRelativeX": 285, "y": -323, "width": 100, "x": 195},
    {"id": "notebook", "type": "table", "intendedRelativeX": 0, "y": -1, "width": 250, "x": 0},
    {"id": "paper", "type": "table", "intendedRelativeX": -208, "y": 34, "width": 70, "x": -195},
    {"id": "pencils", "type": "table", "intendedRelativeX": -142, "y": -11, "width": 50, "x": -142},
    {"id": "right_photo", "type": "wall", "intendedRelativeX": -295, "y": -247, "width": 100, "x": -195}
  ]

  items: DeskItem[] = [];

  draggingId: string | null = null;
  dragOffset = {x: 0, y: 0};

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    const saved = localStorage.getItem('desk-layout');
    this.items = saved ? JSON.parse(saved) : [...this.defaultItems];
  }

  ngAfterViewInit() {
    this.resizeTableAndRepositionItems();

    window.addEventListener('resize', () => {
      this.resizeTableAndRepositionItems();
    });

    this.cdr.detectChanges()

    gsap.fromTo(
      this.deskWrapper.nativeElement,
      {y: '100%', opacity: 0},
      {y: '0%', opacity: 1, duration: 1, ease: 'power2.out'}
    );
  }

  ngOnDestroy() {
    gsap.to(
      this.deskWrapper.nativeElement,
      {y: '100%', opacity: 0, duration: 1, ease: 'power2.out'},
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

  resizeTableAndRepositionItems() {
    this.deskWidth = Math.min(this.deskWrapper.nativeElement.offsetWidth, this.maxDeskWidth)
    const deskWithHalf = this.deskWidth / 2;
    this.items = this.items.map(item => {
      return {
        ...item,
        "x": this.getRealScreenX(item.intendedRelativeX)
      }
    })
    this.cdr.detectChanges()
  }

  onPointerDown(event: PointerEvent, itemId: string) {
    this.draggingId = itemId;
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    this.dragOffset.x = event.clientX - this.getScreenX(item.intendedRelativeX);
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

    item.intendedRelativeX = Math.round(newRelX);
    item.x = this.getRealScreenX(item.intendedRelativeX);
    item.y = Math.round(newY);

    event.preventDefault();
  }

  onPointerUp() {
    this.draggingId = null;
    localStorage.setItem('desk-layout', JSON.stringify(this.items));
  }

  private getRealScreenX(intendedRelativeX: number): number {
    return Math.min(Math.max(intendedRelativeX, -this.deskWidth / 2), this.deskWidth / 2)
  }
}
