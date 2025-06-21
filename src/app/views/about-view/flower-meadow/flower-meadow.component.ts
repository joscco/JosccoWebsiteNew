import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Phaser from 'phaser';
import {Flower} from './Flower';

@Component({
  selector: 'app-flower-meadow',
  templateUrl: './flower-meadow.component.html',
  styleUrls: ['./flower-meadow.component.scss']
})
export class FlowerMeadowComponent implements OnInit {
  @ViewChild('pixiContainer', { static: true }) pixiContainer!: ElementRef;

  game!: Phaser.Game;

  ngOnInit(): void {
    if (!this.game) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.CANVAS,
        width: this.pixiContainer.nativeElement.clientWidth,
        height: this.pixiContainer.nativeElement.clientHeight,
        transparent: true,
        parent: this.pixiContainer.nativeElement,
        scene: [FlowerScene],
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        input: {
          mouse: {
            preventDefaultWheel: false
          }
        }
      };

      this.game = new Phaser.Game(config);
    }

  }
}

// Deine Spielszene:
class FlowerScene extends Phaser.Scene {
  flowers: Flower[] = [];
  maxFlowers = 30;
  maxTries = 10;
  minDistance = 50; // Mindestabstand zwischen Blumen
  draggedFlower: Flower | null = null;
  stages = ['flower0', 'flower1', 'flower2'];

  constructor() {
    super({ key: 'FlowerScene' });
  }

  preload() {
    this.stages.forEach((name, i) => {
      this.load.image(name, `images/flowers/${name}.png`);
    });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const points = this.generatePoissonPoints(width, height, this.minDistance, this.maxTries, this.maxFlowers);

    points.forEach(point => {
      this.addFlower(point.x, point.y);
    });

    // Globales Dragging
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.draggedFlower) {
        // Berechne den Offset, um die Blume an der richtigen Stelle zu halten
        const offset = this.draggedFlower.getOffset()
        if (offset) {
          this.draggedFlower.setPosition(pointer.x - offset.x, pointer.y - offset.y);
        }
      }
    });

    this.input.on('pointerup', (event: PointerEvent) => {
      if (!this.draggedFlower) {
        this.addFlower(event.x, event.y)
      }
      this.draggedFlower = null;
    });
  }

  addFlower(x: number, y: number) {
      if (this.flowers.length >= this.maxFlowers) {
        const oldFlower = this.flowers.shift();
        oldFlower?.destroy();
      }

      const flower = new Flower(this, x, y, this.stages[0]);
      flower.getSprite().on('pointerdown', () => {
        this.draggedFlower = flower;
      });

      this.flowers.push(flower);
  }

  generatePoissonPoints(width: number, height: number, minDistance: number, maxTries: number, maxPoints: number): { x: number, y: number }[] {
    const points: { x: number, y: number }[] = [];

    while (points.length < maxPoints) {
      let attempts = 0;
      let found = false;

      while (attempts < maxTries && !found) {
        const x = Phaser.Math.Between(minDistance, width - minDistance);
        const y = Phaser.Math.Between(minDistance, height - minDistance);

        const tooClose = points.some(p => {
          const dx = p.x - x;
          const dy = p.y - y;
          return Math.hypot(dx, dy) < minDistance;
        });

        if (!tooClose) {
          points.push({ x, y });
          found = true;
        }

        attempts++;
      }

      // Falls kein Punkt mehr gefunden wird: abbrechen
      if (!found) {
        break;
      }
    }

    return points;
  }
}
