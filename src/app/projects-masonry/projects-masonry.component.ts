import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, HostListener} from '@angular/core';
import {AsyncPipe, NgClass, NgFor, NgIf, NgStyle} from '@angular/common';
import {ReplaySubject} from 'rxjs';
import {resizeImage} from '../app.animations';

@Component({
  selector: 'app-projects-masonry',
  imports: [
    NgFor,
    AsyncPipe,
    NgStyle,
    NgClass,
    NgIf
  ],
  templateUrl: './projects-masonry.component.html',
  host: {
    class: 'w-full'
  },
  animations: [
    resizeImage
  ]
})
export class ProjectsMasonryComponent implements AfterViewInit, OnInit, OnDestroy {

  @Input() items?: {
    img: string;
    originalWidth: number,
    originalHeight: number,
    title?: string;
    link?: string;
    subtitle?: string
  }[];
  @Input() colLimits?: [minPixels: number, rows: number][];

  columnGap = 16;
  height = 0;
  resizeState = 'hidden';
  clickedItem?: string;
  hoveredItem?: string;

  @ViewChild('resizeContainer', {static: false}) masonryContainer!: ElementRef;

  columns: ReplaySubject<{
    img: string,
    y: number,
    left: number,
    width: number,
    title?: string,
    link?: string,
    subtitle?: string
  }[]> = new ReplaySubject(0);
  private resizeObserver?: ResizeObserver;

  ngOnInit() {
    setTimeout(() => {
      if (this.resizeState === 'hidden') {
        this.resizeState = 'shown';
      }
    }, 50);
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => this.updateColumns());
    this.resizeObserver.observe(this.masonryContainer.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  private updateColumns() {
    const width = this.masonryContainer.nativeElement.offsetWidth;
    const numberOfColumns = this.colLimits?.find(([minPixels]) => width >= minPixels)?.[1] ?? 1;
    const columnWidth = (width - this.columnGap * (numberOfColumns - 1)) / numberOfColumns;
    const heights = Array(numberOfColumns).fill(0);
    if (this.items) {
      const itemsByColumn = this.items?.map(image => {
        const column = heights.indexOf(Math.min(...heights));
        const imageHeight = image.originalHeight * columnWidth / image.originalWidth;
        const y = heights[column];
        heights[column] += imageHeight + this.columnGap;
        return {
          img: image.img,
          y: y,
          left: column * (columnWidth + this.columnGap),
          width: columnWidth,
          title: image.title,
          link: image.link,
          subtitle: image.subtitle
        }
      });
      this.columns.next(itemsByColumn);
      this.height = Math.max(...heights) - this.columnGap;
    }
  }

  trackByFn(index: number, item: any) {
    return item.img; // or any unique identifier
  }

  getResizeState() {
    return this.resizeState;
  }

  onImageClick(item: any) {
    // For mobile devices, the hoveredItem will be undefined
    // So the link must be clicked twice to navigate
    if (this.clickedItem === item.img || this.hoveredItem === item.img) {
      if (item.link) {
        window.location.href = item.link;
      }
    } else {
      this.clickedItem = item.img;
      this.hoveredItem = undefined;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.clickedItem = undefined;
  }

  onPointerEnter(event: PointerEvent, item: any) {
    // Hovering items should only be possible with mouse
    if (event.pointerType === 'mouse') {
      this.hoveredItem = item.img;
    }
  }
}
