import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';
import {gsap} from 'gsap';

interface LetterData {
  format: string;
  default: string;
  alt: string;
  alternatives: string[];
}

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

  private tweens: gsap.core.Tween[] = [];

  letters = [
    {format: 'svg/letter_spritesheet.svg#joscco_0_%s', default: '0', alt: "J", alternatives: ['1', '2', '3', '4', '5']},
    {format: 'svg/letter_spritesheet.svg#joscco_1_%s', default: '0', alt: "o", alternatives: ['1', '2', '3', '4', '5']},
    {format: 'svg/letter_spritesheet.svg#joscco_2_%s', default: '0', alt: "s", alternatives: ['1', '2', '3', '4', '5']},
    {format: 'svg/letter_spritesheet.svg#joscco_3_%s', default: '0', alt: "c", alternatives: ['1', '2', '3', '4', '5']},
    {format: 'svg/letter_spritesheet.svg#joscco_4_%s', default: '0', alt: "c", alternatives: ['1', '2', '3', '4', '5']},
    {format: 'svg/letter_spritesheet.svg#joscco_5_%s', default: '0', alt: "o", alternatives: ['1', '2', '3', '4', '5']}
  ];

  ngAfterViewInit() {
    this.playAnimation();
  }

  playAnimation() {
    const letterElements = this.letterImages.toArray();
    this.tweens.forEach(tween => tween.kill()); // Stop any previous animations
    this.tweens = [];

    // Randomly switch letters to alternatives
    letterElements.forEach((letterElement, index) => {
      const delays = index * 0.1; // Slight delay for each letter
      const letter = this.letters[index];

      this.shuffleArray(letter.alternatives).forEach((randomAlternative, i) => {
        const src = this.getSrcString(letter, randomAlternative);
        let tween = gsap.to(letterElement.nativeElement, {
          scale: 0.9,
          delay: delays + i * 0.2,
          // This is needed to center the scaling transformation
          transformOrigin: "50% 50%",
          duration: 0.15,
          onComplete: () => {
            letterElement.nativeElement.setAttribute('xlink:href', src);
            gsap.to(letterElement.nativeElement, {scale: 1, duration: 0.15});
          }
        });
        this.tweens.push(tween);
      });

      // Return to default at the end
      let finalTween = gsap.to(letterElement.nativeElement, {
        scale: 0.9,
        delay: delays + letter.alternatives.length * 0.2,
        duration: 0.15,
        onComplete: () => {
          const src = this.getSrcString(letter)
          letterElement.nativeElement.setAttribute('xlink:href', src);
          gsap.to(letterElement.nativeElement, {scale: 1, duration: 0.15});
        }
      });
      this.tweens.push(finalTween);
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

  getSrcString(letter: LetterData, replacement?: string): string {
    let replaceValue = replacement || letter.default;
    return letter.format.replace('%s', replaceValue)
  }
}
