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

  editButton?: HTMLElement;

  maxDeskWidth = 1000;
  deskWidth = 0;
  isEditMode = false;
  isTouchUser = false;
  isCompact = false;
  hoveredTooltip: { id: string, x: number, y: number, text: string } | null = null;
  tooltipTween?: gsap.core.Tween
  itemTweens: gsap.core.Tween[] = [];
  editButtonTween?: gsap.core.Tween;

  defaultItems: DeskItem[] = AboutItems.map(item => ({...item, currentStateIndex: 0}));

  items: DeskItem[] = [];
  draggingId: string | null = null;
  dragOffset = {x: 0, y: 0};

  private resizeListener = () => this.resizeTableAndRepositionItems();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.isTouchUser = 'ontouchstart' in window;
    this.items = [...this.defaultItems];
    this.resizeTableAndRepositionItems()
  }

  ngAfterViewInit() {
    this.resizeTableAndRepositionItems();
    window.addEventListener('resize', () => this.resizeListener);
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
    this.itemTweens.forEach(tween => tween.kill());
    this.tooltipTween?.kill();
    this.editButtonTween?.kill();
  }

  toggleEditMode(target: EventTarget | null, newMode: boolean = !this.isEditMode) {
    if (this.isEditMode === newMode) return;
    this.swapEditButton(target as HTMLElement, newMode);
    newMode ? this.startWiggle() : this.stopWiggle();
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
    if (this.isCompact && this.editButton) {
      this.toggleEditMode(this.editButton, false)
    }
    this.items = this.isCompact
      ? this.defaultItems.filter(item => item.showOnSmallScreen)
      : [...this.defaultItems];
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
    item.x = Math.round(this.getRelativeX(event.clientX - this.dragOffset.x));
    item.y = Math.round(event.clientY - this.dragOffset.y);
    event.preventDefault();
  }

  onPointerUp() {
    this.draggingId = null;
  }

  cycleState(event: MouseEvent, item: DeskItem) {
    if (this.isEditMode || !item.states) return;
    const nextState = ((item.currentStateIndex ?? 0) + 1) % item.states.length;
    const el = event.target as HTMLElement;
    gsap.fromTo(el, { scale: 1 }, {
      scale: 0.85, duration: 0.1, ease: 'power2.out', onComplete: () => {
        item.currentStateIndex = nextState;
        this.focus(item, event);
        gsap.to(el, { scale: 1, duration: 0.1, ease: 'power2.out' });
      }
    });
  }

  getImageSrc(item: DeskItem): string {
    const state = item.states?.[item.currentStateIndex!];
    return `svg/about/${state}.svg`;
  }

  focus(item: DeskItem, event: MouseEvent) {
    if (this.isTouchUser) return;
    if (this.isEditMode) return;
    this.showTooltip(item);
    this.rescaleItems();
    this.scaleItem(event);
  }

  unfocus() {
    if (this.isTouchUser) return;
    if (this.isEditMode) return;
    this.hideTooltip();
    this.rescaleItems();
  }

  getTooltip(item: DeskItem): string {
    const state = item.states?.[item.currentStateIndex ?? 0];
    return item.stateTooltips?.[state ?? ''] ?? '';
  }

  showTooltip(item: DeskItem) {
    const tooltipText = this.getTooltip(item);
    if (!tooltipText) return;
    const el = document.getElementById('tooltip-box');
    this.tooltipTween?.kill();
    this.tooltipTween = gsap.to(el, {
      opacity: 0,
      scale: 0.9,
      duration: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        const x = item.x
        const y = item.y - this.getTooltipOffset(item);
        this.hoveredTooltip = {id: item.id, x, y, text: tooltipText};
        this.cdr.detectChanges();
        if (el) {
          this.tooltipTween = gsap.fromTo(el, {opacity: 0, scale: 0.9}, {
            opacity: 1,
            scale: 1,
            delay: 0.1,
            duration: 0.25,
            ease: 'power2.out'
          });
        }
      }
    })
  }

  hideTooltip() {
    const el = document.getElementById('tooltip-box');
    this.tooltipTween?.kill();
    if (el) {
      this.tooltipTween = gsap.to(el, {
        opacity: 0, scale: 0.9, duration: 0.2, ease: 'power2.in'
      });
    }
    this.hoveredTooltip = null;
  }

  private rescaleItems() {
    this.itemTweens.forEach(tween => tween.kill());
    this.itemTweens = [];
    this.itemRefs.forEach(ref => {
      const el = ref.nativeElement;
      this.itemTweens.push(gsap.to(el, {scale: 1, duration: 0.2, ease: 'power2.out'}));
    });
  }

  private scaleItem(event: MouseEvent) {
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

  private startWiggle() {
    // Start a wiggle rotation animation for all items
    this.itemRefs.forEach(item => {
      const el = item.nativeElement;
      const tween = gsap.fromTo(el, {rotation: -1}, {
        rotation: 1,
        duration: 0.1,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      })
      this.itemTweens.push(tween);
    });
  }

  private stopWiggle() {
    this.itemTweens.forEach(tween => tween.kill());
    this.itemTweens = [];
    this.itemRefs.forEach(item => {
      const el = item.nativeElement;
      gsap.set(el, {rotation: 0}); // Reset rotation
    });
  }

  onEditOver(target: EventTarget | null) {
    this.editButton = target as HTMLElement;
    this.editButtonTween?.kill();
    this.editButtonTween = gsap.to(target, {
      scale: 1.1,
      duration: 0.2,
      ease: 'power2.out'
    });
  }

  onEditOut(target: EventTarget | null) {
    this.editButtonTween?.kill();
    this.editButtonTween = gsap.to(target, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.out'
    });
  }

  private swapEditButton(target: HTMLElement, newMode: boolean) {
    this.editButtonTween?.kill();
    let previousScale = gsap.getProperty(target, 'scale');
    this.editButtonTween = gsap.to(target, {
      scale: 0.85, duration: 0.1, ease: 'power2.out', onComplete: () => {
        this.isEditMode = newMode;
        this.cdr.detectChanges()
        gsap.to(target, {scale: previousScale, duration: 0.1, ease: 'power2.out'});
      }
    });
  }
}
