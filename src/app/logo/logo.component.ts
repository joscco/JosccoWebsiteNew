import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';
import {gsap} from 'gsap';

@Component({
  selector: 'app-logo',
  imports: [
    RouterLink,
    NgForOf
  ],
  styleUrl: './logo.component.css',
  templateUrl: './logo.component.html'
})
export class LogoComponent implements AfterViewInit{

  @ViewChildren('letterImg') letterImages!: QueryList<ElementRef>;

  letters = [
    { default: 'svg/joscco_0.svg', alt: "J", alternatives: ['svg/joscco_0_1.svg'] },
    { default: 'svg/joscco_1.svg', alt: "o", alternatives: ['svg/joscco_1_1.svg']},
    { default: 'svg/joscco_2.svg', alt: "s", alternatives: ['svg/joscco_2_1.svg', 'svg/joscco_2_2.svg']},
    { default: 'svg/joscco_3.svg', alt: "c", alternatives: []},
    { default: 'svg/joscco_4.svg', alt: "c", alternatives: ['svg/joscco_4_1.svg']},
    { default: 'svg/joscco_5.svg', alt: "o", alternatives: ['svg/joscco_5_1.svg']}
  ];

  private lastReplacedIndex: number | null = null;

  ngAfterViewInit() {
    setInterval(() => {
      let randomIndex: number;
      let letter: { alt: string; alternatives: string[]; default: string };

      // Find a valid random index
      do {
        randomIndex = Math.floor(Math.random() * this.letters.length);
        letter = this.letters[randomIndex];
      } while (randomIndex === this.lastReplacedIndex || letter.alternatives.length === 0);

      const newSrc = letter.alternatives[Math.floor(Math.random() * letter.alternatives.length)];

      // Reset the last replaced letter to its default
      if (this.lastReplacedIndex !== null) {
        const lastImgElement = this.letterImages.toArray()[this.lastReplacedIndex].nativeElement;
        const lastAltImgElement = lastImgElement.parentElement.querySelector(`img.alternative:not(.hidden)`);
        gsap.to(lastAltImgElement, { scale: 0, duration: 0.15, onComplete: () => {
            lastAltImgElement?.classList.add('hidden');
          }});
        gsap.to(lastImgElement, { scale: 0, duration: 0.15, onComplete: () => {
            lastImgElement.classList.remove('hidden');
            gsap.to(lastImgElement, { scale: 1, duration: 0.15 });
          }});
      }

      // Replace the current letter
      const imgElement = this.letterImages.toArray()[randomIndex].nativeElement;
      const alternativeImgElement = imgElement.parentElement.querySelector(`img[src="${newSrc}"]`);
      gsap.to(imgElement, { scale: 0, duration: 0.15, onComplete: () => {
          imgElement.classList.add('hidden');
          gsap.set(alternativeImgElement, { scale: 0 }); // Reset scale for the new image
          alternativeImgElement?.classList.remove('hidden');
          gsap.to(alternativeImgElement, { scale: 1, duration: 0.15 });
        }});

      // Update the last replaced index
      this.lastReplacedIndex = randomIndex;
    }, 3000); // Replace every 3 seconds
  }
}
