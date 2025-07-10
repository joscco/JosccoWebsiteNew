import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {NgIf} from '@angular/common';
import gsap from 'gsap';
import {AboutItems} from './about-items';

export interface DeskItem {
  id: string;
  type: string;
  x: number;
  y: number;
  topOffsetsTooltip: Record<string, number>;
  states?: string[];
  showOnSmallScreen: boolean;
  stateTooltips?: Record<string, string>;
  currentStateIndex?: number;
}

@Component({
  selector: 'app-about-view',
  templateUrl: './about-view.component.html',
  imports: [NgIf]
})
export class AboutViewComponent implements OnInit, AfterViewInit {
  @HostBinding('class') class = 'h-full flex flex-col';

  @ViewChild('deskWrapper', {static: true}) deskWrapper!: ElementRef;
  @ViewChild('desk', {static: true}) desk!: ElementRef;
  @ViewChildren('item') itemRefs!: QueryList<ElementRef>;

  maxDeskWidth = 1000;
  deskWidth = 0;
  isEditMode = false;
  isTouchUser = false;
  isCompact = false;
  hoveredTooltip: { id: string, x: number, y: number, text: string } | null = null;
  tooltipTween?: gsap.core.Tween
  itemTweens: gsap.core.Tween[] = [];

  defaultItems: DeskItem[] = AboutItems.map(item => ({...item, currentStateIndex: 0}));

  items: DeskItem[] = [];
  draggingId: string | null = null;
  dragOffset = {x: 0, y: 0};

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.isTouchUser = 'ontouchstart' in window;
    this.items = [...this.defaultItems];
    this.resizeTableAndRepositionItems()
  }

  ngAfterViewInit() {
    this.resizeTableAndRepositionItems();
    window.addEventListener('resize', () => this.resizeTableAndRepositionItems());
    this.cdr.detectChanges();
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
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
    this.deskWidth = Math.min(this.deskWrapper.nativeElement.offsetWidth, this.maxDeskWidth);
    this.isCompact = window.innerWidth < 768;
    this.items = this.isCompact ? this.defaultItems.filter(item => item.showOnSmallScreen) : [...this.defaultItems];
    this.cdr.detectChanges();
  }

  onPointerDown(event: PointerEvent, itemId: string) {
    if (!this.isEditMode || this.isTouchUser) return;
    this.draggingId = itemId;
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;
    this.dragOffset.x = event.clientX - this.getScreenX(item.x);
    this.dragOffset.y = event.clientY - item.y;
    event.preventDefault();
  }

  onPointerMove(event: PointerEvent) {
    if (!this.draggingId || !this.isEditMode || this.isTouchUser) return;
    const item = this.items.find(i => i.id === this.draggingId);
    if (!item) return;
    const newScreenX = event.clientX - this.dragOffset.x;
    const newRelX = this.getRelativeX(newScreenX);
    const newY = event.clientY - this.dragOffset.y;
    item.x = Math.round(newRelX)
    item.y = Math.round(newY);
    event.preventDefault();
  }

  onPointerUp() {
    this.draggingId = null;
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
    gsap.fromTo(el, {scale: 1}, {
      scale: 0.85, duration: 0.1, ease: 'power2.out', onComplete: () => {
        item.currentStateIndex = nextState;
        this.focus(item, event);
        gsap.to(el, {scale: 1, duration: 0.1, ease: 'power2.out'});
      }
    });
  }

  getImageSrc(item: DeskItem): string {
    const state = item.states?.[item.currentStateIndex!];
    return `svg/about/${state}.svg`;
  }

  getTooltip(item: DeskItem): string {
    const state = item.states?.[item.currentStateIndex ?? 0];
    return item.stateTooltips?.[state ?? ''] ?? '';
  }

  focus(item: DeskItem, event: MouseEvent) {
    if (this.isTouchUser) return;
    this.showTooltip(item);
    this.rescaleItems();
    this.scaleItem(item, event);
  }

  showTooltip(item: DeskItem) {
    const tooltipText = this.getTooltip(item);
    if (!tooltipText) return;
    const x = item.x
    const y = item.y - this.getTooltipOffset(item);
    this.hoveredTooltip = {id: item.id, x, y, text: tooltipText};
    this.cdr.detectChanges();
    const el = document.getElementById('tooltip-box');
    if (el) {
      this.tooltipTween?.kill();
      this.tooltipTween = gsap.fromTo(el, {opacity: 0, scale: 0.9}, {
        opacity: 1,
        scale: 1,
        delay: 0.3,
        duration: 0.25,
        ease: 'power2.out'
      });
    }
  }

  hideTooltip() {
    const el = document.getElementById('tooltip-box');
    if (el) {
      this.tooltipTween?.kill();
      this.tooltipTween = gsap.to(el, {
        opacity: 0, scale: 0.9, duration: 0.2, ease: 'power2.in', onComplete: () => {
          this.hoveredTooltip = null;
        }
      });
    } else {
      this.hoveredTooltip = null;
    }
  }

  unfocus() {
    this.hideTooltip();
    this.rescaleItems();
  }

  private rescaleItems() {
    this.itemTweens.forEach(tween => tween.kill());
    this.itemTweens = [];
    this.itemRefs.forEach(ref => {
      const el = ref.nativeElement;
      this.itemTweens.push(gsap.to(el, {scale: 1, duration: 0.2, ease: 'power2.out'}));
    });
  }

  private scaleItem(item: DeskItem, event: MouseEvent) {
    const el = event.target as HTMLElement;
    // Kill and remove any existing tween for this item
    this.itemTweens = this.itemTweens.filter(tween => {
      if (tween.targets().includes(el)) {
        tween.kill();
        return false; // Remove this tween
      }
      return true; // Keep other tweens
    });
    if (el) {
      this.itemTweens.push(gsap.to(el, {
        scale: 1.05,
        duration: 0.2,
        ease: 'power2.out'
      }));
    }
  }

  private getTooltipOffset(item: DeskItem) {
    return item.topOffsetsTooltip[item.states?.[item.currentStateIndex ?? 0] ?? ''] || 0
  }
}
