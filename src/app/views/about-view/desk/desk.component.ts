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
  ChangeDetectorRef, Renderer2
} from '@angular/core';
import gsap from 'gsap';
import {NgIf} from '@angular/common';

export interface DeskItem {
  id: string;
  type: 'wall' | 'table';
  intendedRelativeX: number;  // relativ zur Mitte: -100 bis +100 usw.
  x?: number,
  y: number;
  height?: number;
  width: number;
  states?: string[];
  currentStateIndex?: number;
}

@Component({
  selector: 'app-desk-scene',
  templateUrl: './desk.component.html',
  imports: [
    NgIf
  ]
})
export class DeskSceneComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('class') class = 'h-full w-full relative';

  @ViewChild('deskWrapper', {static: true}) deskWrapper!: ElementRef;
  @ViewChild('desk', {static: true}) desk!: ElementRef;
  @ViewChildren('item') itemRefs!: QueryList<ElementRef>;

  maxDeskWidth = 1000; // Standardwert
  deskWidth = 0;
  isEditMode = false;
  isTouchUser = false;
  isCompact = false;
  hoveredTooltip: { id: string, x: number, y: number, text: string } | null = null;
  tooltipTween?: gsap.core.Tween

  defaultItems: DeskItem[] = [
    {"id":"notebook","type":"table","intendedRelativeX":0,"y":-1,"width":250,"height":200,"x":0,"states":["notebook"],"currentStateIndex":0},
    {"id":"coffee","type":"table","intendedRelativeX":166,"y":8,"width":80,"x":166,"states":["coffee"],"currentStateIndex":0},
    {"id":"block","type":"table","intendedRelativeX":-232,"y":123,"width":100,"x":-232,"states":["block"],"currentStateIndex":0},
    {"id":"pencils","type":"table","intendedRelativeX":-185,"y":-10,"x":-185,"width":150,"states":["pencils","llama","buddha","dino","treetrunks"],"currentStateIndex":4},
    {"id":"keyboard","type":"table","intendedRelativeX":255,"y":103,"width":200,"x":255,"states":["keyboard"],"currentStateIndex":0},
    {"id":"left_photo","type":"wall","intendedRelativeX":283,"y":-261,"width":100,"x":283,"states":["left_photo"],"currentStateIndex":0},
    {"id":"paper","type":"table","intendedRelativeX":-333,"y":59,"width":70,"x":-333,"states":["paper"],"currentStateIndex":0},
    {"id":"right_photo","type":"wall","intendedRelativeX":-287,"y":-199,"width":100,"x":-287,"states":["right_photo"],"currentStateIndex":0}
  ].map(item => ({...item, currentStateIndex: 0})) as DeskItem[];

  items: DeskItem[] = [];
  draggingId: string | null = null;
  dragOffset = {x: 0, y: 0};

  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.isTouchUser = 'ontouchstart' in window;
    this.items = [...this.defaultItems];
    this.resizeTableAndRepositionItems()
  }

  ngAfterViewInit() {
    this.resizeTableAndRepositionItems();

    window.addEventListener('resize', () => {
      this.resizeTableAndRepositionItems();
    });

    this.cdr.detectChanges()

    gsap.fromTo(
      this.desk.nativeElement,
      {y: '100%', opacity: 0},
      {y: '0%', opacity: 1, duration: 1, ease: 'power2.out'}
    );
  }

  ngOnDestroy() {
    gsap.to(
      this.desk.nativeElement,
      {y: '100%', opacity: 0, duration: 1, ease: 'power2.out'},
    );
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  resetPositions() {
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

    this.isCompact = window.innerWidth < 768;
    if (this.isCompact) {
      this.items = this.defaultItems.slice(0, 4);
    } else {
      this.items = this.defaultItems;
    }
    this.items = this.items.map(item => {
      return {
        ...item,
        "x": this.getRealScreenX(item.intendedRelativeX)
      }
    })
    this.cdr.detectChanges()
  }

  onPointerDown(event: PointerEvent, itemId: string) {
    if (!this.isEditMode) return;
    if (this.isTouchUser) return;

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
    if (this.isTouchUser) return;

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
  }

  private getRealScreenX(intendedRelativeX: number): number {
    return Math.min(Math.max(intendedRelativeX, -this.deskWidth / 2), this.deskWidth / 2)
  }

  getDeskItems() {
    return this.items.filter(item => item.type === 'table');
  }

  getWallItems() {
    return this.items.filter(item => item.type === 'wall');
  }

  cycleState(event: MouseEvent, item: DeskItem) {
    if (!item.states) return;

    let nextState = (item.currentStateIndex! + 1) % item.states.length;
    const el = event.target as HTMLElement;
    gsap.fromTo(el,
      {scale: 1},
      {
        scale: 0.85, duration: 0.1, ease: 'power2.out', onComplete: () => {
          item.currentStateIndex = nextState;
          gsap.to(el, {scale: 1, duration: 0.1, ease: 'power2.out'});
        }
      })
  }

  getImageSrc(item: DeskItem): string {
    const state = item.states?.[item.currentStateIndex!];
    return `images/about/${state}.png`;
  }

  getTooltip(item: DeskItem): string {
    return {
      coffee: 'Hydrate or die-drate.',
      notebook: 'Productivity, but make it cute.',
      left_photo: 'Our dogs – always watching.',
      right_photo: 'Where my mind goes when I need calm.',
      pencils: 'Organized chaos. Emphasis on organized.',
      block: 'By the power of Grayskull!',
    }[item.id] || '';
  }

  showTooltip(item: DeskItem, event: MouseEvent) {
    if (this.isTouchUser) return;
    const tooltipText = this.getTooltip(item);
    if (!tooltipText) return;
    const x = this.getRealScreenX(item.intendedRelativeX);
    const y = item.y - (item.height ?? 0) / 2 + 20;
    this.hoveredTooltip = {id: item.id, x, y, text: tooltipText};
    this.cdr.detectChanges();

    const el = document.getElementById('tooltip-box');
    if (el) {
      this.tooltipTween?.kill()
      this.tooltipTween = gsap.fromTo(
        el,
        {opacity: 0, scale: 0.9},
        {opacity: 1, scale: 1, delay: 0.3, duration: 0.25, ease: 'power2.out'}
      );
    }
  }

  hideTooltip() {
    const el = document.getElementById('tooltip-box');
    if (el) {
      this.tooltipTween?.kill()
      this.tooltipTween = gsap.to(el, {
        opacity: 0, scale: 0.9, duration: 0.2, ease: 'power2.in', onComplete: () => {
          this.hoveredTooltip = null;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.hoveredTooltip = null;
    }
  }
}
