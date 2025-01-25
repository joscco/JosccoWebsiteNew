import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {AsyncPipe, NgFor, NgStyle} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ReplaySubject} from 'rxjs';

@Component({
  selector: 'app-projects-masonry',
  imports: [
    NgFor,
    AsyncPipe,
    NgStyle,
    RouterLink
  ],
  templateUrl: './projects-masonry.component.html',
  host:{
    class: 'w-full'
  }
})
export class ProjectsMasonryComponent implements AfterViewInit, OnDestroy {

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
  height = 0

  @ViewChild('resizeContainer', {static: false}) masonryContainer!: ElementRef;

  columns: ReplaySubject<{ img: string, y: number, left: number, width: number, title?: string, link?: string, subtitle?: string }[]> = new ReplaySubject(0);
  private resizeObserver?: ResizeObserver;

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
}
