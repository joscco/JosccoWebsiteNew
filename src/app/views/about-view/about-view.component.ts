import {AfterViewInit, Component, ElementRef, HostBinding, ViewChild} from '@angular/core';
import {NotebookIllustrationComponent} from '../../notebook-illustration/notebook-illustration.component';
import {NgForOf} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-about-view',
  imports: [
    NgForOf
  ],
  templateUrl: './about-view.component.html',
  animations: [
    trigger('scaleIn', [
      state('void', style({transform: 'scale(0)', opacity: 0})),
      state('*', style({transform: 'scale(1)', opacity: 1})),
      transition('void => *', animate('100ms cubic-bezier(0.68, -0.55, 0.27, 1.55)'))
    ])
  ]
})
export class AboutViewComponent implements AfterViewInit {
  flowers: { x: number; y: number }[] = [];
  flowerSize = { width: 50, height: 50 };
  isDragging = false;
  lastDragStartTime = Date.now();
  draggedFlowerIndex: number | null = null;
  startPosition = {x: 0, y: 0};

  @ViewChild('meadow') meadow!: ElementRef;
  @ViewChild('textBox') textBox!: ElementRef;

  ngAfterViewInit(): void {
    // Randomly place 10 flowers at the start
    for (let i = 0; i < 10; i++) {
      this.flowers.push(this.getRandomPosition());
    }
  }

  getRandomPosition(): { x: number; y: number } {
    const meadowRect = this.meadow.nativeElement.getBoundingClientRect();
    const flowerSize = { width: 50, height: 50 };

    let position;
    do {
      position = {
        x: Math.random() * (meadowRect.width - flowerSize.width),
        y: Math.random() * (meadowRect.height - flowerSize.height)
      };
    } while (!this.isPositionValid(position, flowerSize));

    return position;
  }

  private getAdjustedClickPosition(event: MouseEvent): { x: number; y: number } {
    const meadowRect = this.meadow.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - meadowRect.left,
      y: event.clientY - meadowRect.top
    };
  }

  onMeadowClick(event: MouseEvent): void {
    const clickPosition = this.getAdjustedClickPosition(event);
    const flowerSize = { width: 50, height: 50 };

    if (this.isPositionValid(clickPosition, flowerSize)) {
      this.flowers.push({
        x: clickPosition.x - flowerSize.width / 2,
        y: clickPosition.y - flowerSize.height / 2
      });
    }
  }

  private isPositionValid(position: { x: number; y: number }, flowerSize: { width: number; height: number }): boolean {
    const meadowRect = this.meadow.nativeElement.getBoundingClientRect();
    const textBoxRect = this.textBox.nativeElement.getBoundingClientRect();

    // Adjust textBoxRect to be relative to the meadow
    const adjustedTextBoxRect = {
      left: textBoxRect.left - meadowRect.left,
      right: textBoxRect.right - meadowRect.left,
      top: textBoxRect.top - meadowRect.top,
      bottom: textBoxRect.bottom - meadowRect.top
    };

    // Check if the position is outside the text box
    const isOutsideTextBox = (
      position.x < adjustedTextBoxRect.left - flowerSize.width / 2 ||
      position.x > adjustedTextBoxRect.right + flowerSize.width / 2 ||
      position.y < adjustedTextBoxRect.top - flowerSize.height / 2 ||
      position.y > adjustedTextBoxRect.bottom + flowerSize.height / 2
    );

    // Check if the position is far enough from other flowers
    const isFarEnoughFromFlowers = this.flowers.every(flower => {
      const flowerCenter = { x: flower.x + flowerSize.width / 2, y: flower.y + flowerSize.height / 2 };
      return Math.hypot(flowerCenter.x - position.x, flowerCenter.y - position.y) > 50;
    });

    return isOutsideTextBox && isFarEnoughFromFlowers;
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.lastDragStartTime = Date.now();
    this.isDragging = true;

    let clickPosition = this.getAdjustedClickPosition(event)

    let index = this.findNearFlowerIndex(clickPosition);
    if (index === null) {
      return;
    }

    this.draggedFlowerIndex = index;
    this.startPosition = clickPosition
  }

  findNearFlowerIndex(clickPosition: { x: number; y: number }): number | null {
    for (let i = 0; i < this.flowers.length; i++) {
      const flower = this.flowers[i];
      const flowerCenter = {
        x: flower.x + this.flowerSize.width / 2,
        y: flower.y + this.flowerSize.height / 2
      };

      // Calculate the distance between the click position and the flower center
      if (Math.hypot(flowerCenter.x - clickPosition.x, flowerCenter.y - clickPosition.y) < this.flowerSize.width / 2) {
        return i;
      }
    }

    return null;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.draggedFlowerIndex !== null) {
      const flower = this.flowers[this.draggedFlowerIndex];

      // Calculate the new position relative to the meadow
      const newPosition = this.getAdjustedClickPosition(event)
      const newX = newPosition.x;
      const newY = newPosition.y;

      // Ensure the flower stays within the meadow boundaries
      flower.x = newX - this.flowerSize.width / 2;
      flower.y = newY - this.flowerSize.height / 2;
    }
  }

  onMouseUp(event: MouseEvent): void {
    this.isDragging = false;
    this.draggedFlowerIndex = null;
    const currentTime = Date.now();
    // If the drag was very short, treat it as a click
    if (currentTime - this.lastDragStartTime < 500) {
      // Handle click logic here if needed
      this.onMeadowClick(event)
    }
  }
}
