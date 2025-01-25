import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-notebook-illustration',
  templateUrl: './notebook-illustration.component.html',
  styleUrls: ['./notebook-illustration.component.scss']
})
export class NotebookIllustrationComponent implements OnInit, OnDestroy {
  @HostBinding('class.w-full') wFull = true;
  @HostBinding('class.h-full') hFull = true;
  @HostBinding('class.flex') flex = true;
  @HostBinding('class.items-center') itemsCenter = true;
  @HostBinding('class.justify-center') justifyCenter = true;
  @HostBinding('class.flex-col') flexCol = true;

  width: number = 0;
  seconds: number = 0;
  timer: any;

  ngOnInit() {
    this.timer = setInterval(() => {
      this.seconds += 0.1;
    }, 100);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  protected readonly Math = Math;
}
