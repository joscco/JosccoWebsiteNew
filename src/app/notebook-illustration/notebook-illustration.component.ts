import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-notebook-illustration',
  templateUrl: './notebook-illustration.component.html'
})
export class NotebookIllustrationComponent implements AfterViewInit {

  @ViewChild('notebook', {static: false}) elementRef!: ElementRef;

  context: any;
  cup?: HTMLImageElement;
  notebook?: HTMLImageElement;
  code?: HTMLImageElement;
  codeBackground?: HTMLImageElement;
  backgroundNotebook?: HTMLImageElement;
  pencil?: HTMLImageElement;
  smoke1?: HTMLImageElement;
  smoke2?: HTMLImageElement;

  ngAfterViewInit() {
    const canvas = this.elementRef.nativeElement;
    this.context = canvas.getContext('2d');

    this.cup = new Image();
    this.cup.src = '/images/AboutSection/cup.png';

    this.notebook = new Image();
    this.notebook.src = '/images/AboutSection/notebook.png';

    this.code = new Image();
    this.code.src = '/images/AboutSection/code.png';

    this.codeBackground = new Image();
    this.codeBackground.src = '/images/AboutSection/codeBackground.png';

    this.backgroundNotebook = new Image();
    this.backgroundNotebook.src = '/images/AboutSection/backgroundNotebook.png';

    this.pencil = new Image();
    this.pencil.src = '/images/AboutSection/pen.png';

    this.smoke1 = new Image();
    this.smoke1.src = '/images/AboutSection/smoke1.png';

    this.smoke2 = new Image();
    this.smoke2.src = '/images/AboutSection/smoke2.png';

    window.requestAnimationFrame(() => this.draw());
  }

  draw() {
    const time = new Date();
    let width = 512;
    let height = 512;
    let realWidth = this.elementRef.nativeElement.width;
    let realHeight = this.elementRef.nativeElement.height;
    let scaleX = realWidth / width;
    let scaleY = realHeight / height;
    this.context.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    let slowSine = Math.sin(time.getTime() / 1500);
    let slowSine2 = Math.sin(1 + time.getTime() / 1500);
    this.context.clearRect(0, 0, this.elementRef.nativeElement.width, this.elementRef.nativeElement.height);
    this.context.drawImage(this.codeBackground, 55, 45);
    this.context.drawImage(this.code, 5 + 4 * slowSine, -35 + 30 * slowSine);
    this.context.drawImage(this.backgroundNotebook, 30, 10);
    this.context.drawImage(this.notebook, 30, 40);

    this.context.drawImage(this.cup, 380, 140);
    this.context.drawImage(this.pencil, 430 + 10 * slowSine2, 270);
    this.context.drawImage(this.smoke1, 440, 80 + 5 * slowSine2);
    this.context.drawImage(this.smoke2, 390, 40 + 10 * slowSine);
    this.context.save();
    window.requestAnimationFrame(() => this.draw());
  }


}
