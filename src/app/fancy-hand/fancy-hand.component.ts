import {Component, HostBinding, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgFor} from '@angular/common';

@Component({
  selector: 'app-fancy-hand',
  templateUrl: './fancy-hand.component.html',
  styleUrl: './fancy-hand.component.scss',
  imports: [NgFor]
})
export class FancyHandComponent implements OnInit, OnDestroy {

  @HostBinding('class.w-full') wFull = true;
  @HostBinding('class.h-full') hFull = true;
  @HostBinding('class.flex') flex = true;
  @HostBinding('class.items-center') itemsCenter = true;
  @HostBinding('class.justify-center') justifyCenter = true;
  @HostBinding('class.flex-col') flexCol = true;

  width = 0
  seconds: number = 0;
  imagesFadedIn: boolean = false;
  blink: boolean = false;
  closeMouth: boolean = true;
  timer: any;
  positionTimer: any;
  fadeIn: any;
  itemPositions: {left: string, top: string, zIndex: number}[] = []

  minImages = [
    { path: 'images/StartSection/cloud1.png', alt: 'Cloud 1 Icon' },
    { path: 'images/StartSection/cloud2.png', alt: 'Cloud 2 Icon' },
    { path: 'images/StartSection/cloud3.png', alt: 'Cloud 3 Icon' },
    { path: 'images/StartSection/javaIcon.png', alt: 'Java Icon' },
    { path: 'images/StartSection/typescriptIcon.png', alt: 'Typescript Icon' },
    { path: 'images/StartSection/primeIcon.png', alt: 'Math Icon' },
    { path: 'images/StartSection/godotIcon.png', alt: 'Godot Icon' },
    { path: 'images/StartSection/functionIcon.png', alt: 'Code Icon' }
  ];

  ngOnInit() {
    this.fadeIn = setTimeout(() => {
      this.imagesFadedIn = true;
    }, 400);
    this.timer = setInterval(() => {
      this.seconds += 0.1;
      this.blink = this.decideIfBlinking(this.blink);
      this.closeMouth = this.decideIfCloseMouth(this.closeMouth);
    }, 100);
    this.positionTimer = setInterval(() => {
      this.evaluateItemPositions(this.seconds);
    }, 100);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  decideIfBlinking(blink: boolean): boolean {
    if (blink) {
      return Math.random() > 0.2;
    }
    return Math.random() < 0.03;
  }

  decideIfCloseMouth(closeMouth: boolean): boolean {
    if (closeMouth) {
      return Math.random() > 0.02;
    }
    return Math.random() < 0.3;
  }

  evaluateItemPositions(seconds: number){
    this.itemPositions = this.minImages.map((_, index) => this.calculateItemPosition(seconds, index))
  }

  calculateItemPosition(seconds: number, index: number): {left: string, top: string, zIndex: number} {
    return {
      left: (0.5 + Math.sin(0.6 * seconds + 10 * index) * 0.4) * 100 + '%',
      top: (0.5 + Math.sin(-0.6 * seconds + 20 * index) * 0.4) * 100 + '%',
      zIndex: -2 * Math.floor(Math.cos(0.6 * seconds + 10 * index))
    }
  }
}
