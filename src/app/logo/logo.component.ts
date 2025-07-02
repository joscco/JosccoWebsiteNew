import {AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';
import {gsap} from 'gsap';

@Component({
  selector: 'app-logo',
  imports: [
    RouterLink,
    NgForOf
  ],
  templateUrl: './logo.component.html'
})
export class LogoComponent implements AfterViewInit, OnDestroy {

  @ViewChildren('letterImg') letterImages!: QueryList<ElementRef>;
  @ViewChildren('altImg') altImages!: QueryList<ElementRef>;

  letters = [
    {default: 'svg/joscco_0.svg', alt: "J", alternatives: ['svg/joscco_0_1.svg']},
    {default: 'svg/joscco_1.svg', alt: "o", alternatives: ['svg/joscco_1_1.svg']},
    {default: 'svg/joscco_2.svg', alt: "s", alternatives: ['svg/joscco_2_1.svg', 'svg/joscco_2_2.svg']},
    {default: 'svg/joscco_3.svg', alt: "c", alternatives: []},
    {default: 'svg/joscco_4.svg', alt: "c", alternatives: ['svg/joscco_4_1.svg']},
    {default: 'svg/joscco_5.svg', alt: "o", alternatives: ['svg/joscco_5_1.svg']}
  ];

  private lastReplacedIndex: number | null = null;
  private lastTimestamp = 0;
  private interval = 3000;
  private tickerFunction?: () => void;

  ngAfterViewInit() {
    this.altImages.forEach((img) => {
      gsap.set(img.nativeElement, { scale: 0 });
    });

    this.tickerFunction = () => {
      if (document.hidden) return; // Tab ist inaktiv → überspringen

      const now = Date.now();
      if (now - this.lastTimestamp >= this.interval) {
        this.swapLetter();
        this.lastTimestamp = now;
      }
    };

    gsap.ticker.add(this.tickerFunction);
  }

  ngOnDestroy() {
    if (!this.tickerFunction) return;
    gsap.ticker.remove(this.tickerFunction);
  }

  private swapLetter() {
    let randomIndex: number;
    let letter: { alt: string; alternatives: string[]; default: string };

    do {
      randomIndex = Math.floor(Math.random() * this.letters.length);
      letter = this.letters[randomIndex];
    } while (randomIndex === this.lastReplacedIndex || letter.alternatives.length === 0);

    const newSrc = letter.alternatives[Math.floor(Math.random() * letter.alternatives.length)];

    if (this.lastReplacedIndex !== null) {
      const lastImgElement = this.letterImages.toArray()[this.lastReplacedIndex].nativeElement;
      const lastAltImgElement = this.altImages.toArray()[this.lastReplacedIndex].nativeElement;

      gsap.to(lastAltImgElement, {
        scale: 0, duration: 0.15, onComplete: () => {
          gsap.to(lastImgElement, { scale: 1, duration: 0.15 });
        }
      });
    }

    const imgElement = this.letterImages.toArray()[randomIndex].nativeElement;
    const alternativeImgElement = this.altImages.toArray()[randomIndex].nativeElement;

    gsap.to(imgElement, {
      scale: 0, duration: 0.15, onComplete: () => {
        gsap.to(alternativeImgElement, { scale: 1, duration: 0.15 });
      }
    });

    this.lastReplacedIndex = randomIndex;
  }
}
