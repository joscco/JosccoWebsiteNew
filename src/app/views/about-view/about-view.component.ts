import {ChangeDetectorRef, Component, ElementRef, HostBinding, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NgIf} from '@angular/common';
import gsap from 'gsap';

interface DeskItem {
  id: string;
  type: 'wall' | 'table';
  x: number;
  y: number;
  states?: string[];
  currentStateIndex?: number;
  stateTooltips?: Record<string, string>;
}

@Component({
  selector: 'app-about-view',
  templateUrl: './about-view.component.html',
  imports: [NgIf]
})
export class AboutViewComponent {
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

  defaultItems: DeskItem[] = [
    // {
    //   id: "notebook", type: "table", intendedRelativeX: 0, y: -1,, x: 0,
    //   states: ["notebook"],
    //   stateTooltips: {
    //     notebook: "Productivity, but make it cute."
    //   }
    // },
    // {
    //   id: "coffee", type: "table", intendedRelativeX: 166, y: 8, x: 166,
    //   states: ["coffee"],
    //   stateTooltips: {
    //     coffee: "Hydrate or die-drate."
    //   }
    // },
    // {
    //   id: "pencils", type: "table", intendedRelativeX: -185, y: -10, x: -185,
    //   states: ["pencils", "llama", "buddha", "dino", "treetrunks"],
    //   currentStateIndex: 4,
    //   stateTooltips: {
    //     pencils: "Organized chaos. Emphasis on organized.",
    //     llama: "No drama, just llama.",
    //     buddha: "Inner peace in pastel.",
    //     dino: "Roar means I love you in dinosaur.",
    //     treetrunks: "Don't eat the apple pie!"
    //   }
    // },
    {
      "id": "item",
      "type": "table",
      "y": -27,
      "x": -156,
      "states": ["item_0", "item_1", "item_2", "item_3"],
      "currentStateIndex": 3
    },
    {
      "id": "left_photo",
      "type": "wall",
      "y": -302,
      "x": -255,
      "states": ["photo_left_0"],
      stateTooltips: {
        photo_left_0: "My dogs."
      },
      "currentStateIndex": 0
    },
    {
      "id": "pencils",
      "type": "table",
      "y": 28,
      "x": -261,
      "states": ["pencils_0", "pencils_1"],
      "currentStateIndex": 1
    },
    {
      "id": "right_photo",
      "type": "wall",
      "y": -353,
      "x": 272,
      "states": ["photo_right_0"],
      stateTooltips: {
        photo_right_0: "My family."
      },
      "currentStateIndex": 0
    },
    {
      "id": "coffee",
      "type": "table",
      "intendedRelativeX": 202,
      "y": -30,
      "x": 202,
      "states": ["coffee_0", "coffee_1"],
      stateTooltips: {
        coffee_0: "Hydrate or die-drate.",
        coffee_1: "Summer mode: Activated."
      },
      "currentStateIndex": 0
    }
  ].map(item => ({...item, currentStateIndex: 0})) as DeskItem[];

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
    gsap.fromTo(this.desk.nativeElement, {y: '100%', opacity: 0}, {
      y: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    });
  }

  ngOnDestroy() {
    gsap.to(this.desk.nativeElement, {y: '100%', opacity: 0, duration: 1, ease: 'power2.out'});
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
    this.deskWidth = Math.min(this.deskWrapper.nativeElement.offsetWidth, this.maxDeskWidth);
    this.isCompact = window.innerWidth < 768;
    this.items = this.isCompact ? this.defaultItems.slice(0, 4) : [...this.defaultItems];
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
        this.showTooltip(item);
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

  showTooltip(item: DeskItem) {
    if (this.isTouchUser) return;
    const tooltipText = this.getTooltip(item);
    if (!tooltipText) return;
    const x = item.x;
    const y = item.y + 20;
    this.hoveredTooltip = {id: item.id, x, y, text: tooltipText};
    this.cdr.detectChanges();
    const el = document.getElementById('tooltip-box');
    if (el) {
      this.tooltipTween?.kill();
      this.tooltipTween = gsap.fromTo(el, {opacity: 0, scale: 0.9}, {
        opacity: 1,
        scale: 1,
        delay: 1,
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
}
