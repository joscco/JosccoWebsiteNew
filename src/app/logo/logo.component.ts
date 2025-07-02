import {AfterViewInit, Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
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
export class LogoComponent implements AfterViewInit {

  @ViewChildren('letterImg') letterImages!: QueryList<ElementRef>;
  @ViewChildren('altImg') altImages!: QueryList<ElementRef>;

  letters = [
    {default: 'svg/joscco_0.svg', alt: "J"},
    {default: 'svg/joscco_1.svg', alt: "o"},
    {default: 'svg/joscco_2.svg', alt: "s"},
    {default: 'svg/joscco_3.svg', alt: "c"},
    {default: 'svg/joscco_4.svg', alt: "c"},
    {default: 'svg/joscco_5.svg', alt: "o"}
  ];

  globalAlternatives = [
    'svg/joscco_0.svg',
    'svg/joscco_1.svg',
    'svg/joscco_2.svg',
    'svg/joscco_3.svg',
    'svg/joscco_4.svg',
    'svg/joscco_5.svg',
    'svg/joscco_0_1.svg',
    'svg/joscco_1_1.svg',
    'svg/joscco_2_1.svg',
    'svg/joscco_2_2.svg',
    'svg/joscco_4_1.svg',
    'svg/joscco_5_1.svg'
  ];

  ngAfterViewInit() {
    this.playAnimation();
  }

  playAnimation() {
    const letterElements = this.letterImages.toArray();

    // Randomly switch letters to alternatives
    letterElements.forEach((letterElement, index) => {
      const delays = index * 0.1; // Slight delay for each letter
      const randomSwitches = 5; // Number of random switches per letter

      for (let i = 0; i < randomSwitches; i++) {
        const randomAlternative = this.globalAlternatives[Math.floor(Math.random() * this.globalAlternatives.length)];
        gsap.to(letterElement.nativeElement, {
          scale: 0,
          delay: delays + i * 0.2,
          duration: 0.15,
          onComplete: () => {
            letterElement.nativeElement.src = randomAlternative;
            gsap.to(letterElement.nativeElement, {scale: 1, duration: 0.15});
          }
        });
      }

      // Return to default at the end
      gsap.to(letterElement.nativeElement, {
        scale: 0,
        delay: delays + randomSwitches * 0.2,
        duration: 0.15,
        onComplete: () => {
          letterElement.nativeElement.src = this.letters[index].default;
          gsap.to(letterElement.nativeElement, {scale: 1, duration: 0.15});
        }
      });
    });
  }
}
