import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {DeskItemComponent} from '../desk-item/desk-item.component';
import {NgForOf} from '@angular/common';
import {gsap} from 'gsap';

@Component({
  selector: 'app-desk-scene',
  templateUrl: './desk.component.html',
  imports: [
    DeskItemComponent,
    NgForOf
  ]
})
export class DeskSceneComponent implements OnInit, AfterViewInit {
  @ViewChild('deskWrapper', {static: true}) deskWrapper!: ElementRef;
  @ViewChildren(DeskItemComponent) itemComponents!: QueryList<DeskItemComponent>;
  @HostBinding('class') class = 'h-full w-full relative';

  defaultItems: {id: string, type: 'table' | 'wall', position: {x: number, y:number}, width: number}[] = [
    { id: "notebook", type: 'table', position: { x: 0, y: 0 }, width: 250 },
    { id: "right_photo", type: 'wall', position: { x: 0, y: 0 }, width: 100 },
    { id: "coffee", type: 'table', position: { x: 0, y: 0 }, width: 75 },
    { id: "left_photo", type: 'wall', position: { x: 0, y: 0 }, width: 100 }
  ];

  items: {
    id: string, type: 'table' | 'wall', position: { x: number, y: number }, width: number }[] = [];

  ngOnInit() {
    const saved = localStorage.getItem('desk-layout');
    this.items = saved ? JSON.parse(saved) : [...this.defaultItems];
  }

  ngAfterViewInit() {
    gsap.fromTo(
      this.deskWrapper.nativeElement,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, ease: 'power2.out' }
    );
  }

// Call this when navigating away:
  leaveScene() {
    gsap.to(this.deskWrapper.nativeElement, {
      y: '100%',
      opacity: 0,
      duration: 1,
      onComplete: () => {
        // Optionally: emit event or destroy
      }
    });
  }

  logAndSavePositions() {
    const positions = this.itemComponents.map(item => item.getPosition());
    console.log('Aktuelle Positionen:', JSON.stringify(positions, null, 2));
    localStorage.setItem('desk-layout', JSON.stringify(positions));
  }

  resetPositions() {
    this.items = [...this.defaultItems];
    localStorage.removeItem('desk-layout');
  }

  getWallItems() {
    return this.items.filter(item => item.type === 'wall');
  }

  getDeskItems() {
    return this.items.filter(item => item.type === 'table');
  }
}
