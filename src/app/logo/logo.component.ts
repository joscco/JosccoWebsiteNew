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
    {format: 'svg/joscco_0_%s.svg', default: '0', alt: "J", alternatives: ['1', '2', '3', '4', '5']},
    {format: 'svg/joscco_1_%s.svg', default: '0', alt: "o", alternatives: ['1', '2', '3', '4', '5']},
    {format: 'svg/joscco_2_%s.svg', default: '0', alt: "s", alternatives: ['1', '2', '3', '4', '5']},
    {format: 'svg/joscco_3_%s.svg', default: '0', alt: "c", alternatives: ['1', '2', '3', '4', '5']},
    {format: 'svg/joscco_4_%s.svg', default: '0', alt: "c", alternatives: ['1', '2', '3', '4', '5']},
    {format: 'svg/joscco_5_%s.svg', default: '0', alt: "o", alternatives: ['1', '2', '3', '4', '5']}
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
      const letter = this.letters[index];

      this.shuffleArray(letter.alternatives).forEach((randomAlternative, i) => {
        const src = letter.format.replace('%s', randomAlternative);
        gsap.to(letterElement.nativeElement, {
          scale: 0.9,
          delay: delays + i * 0.2,
          duration: 0.15,
          onComplete: () => {
            letterElement.nativeElement.src = src;
            gsap.to(letterElement.nativeElement, {scale: 1, duration: 0.15});
          }
        });
      });

      // Return to default at the end
      gsap.to(letterElement.nativeElement, {
        scale: 0.9,
        delay: delays + randomSwitches * 0.2,
        duration: 0.15,
        onComplete: () => {
          letterElement.nativeElement.src =  letter.format.replace('%s', letter.default);
          gsap.to(letterElement.nativeElement, {scale: 1, duration: 0.15});
        }
      });
    });
  }

  shuffleArray<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
