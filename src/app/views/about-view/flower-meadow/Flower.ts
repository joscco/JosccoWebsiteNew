export class Flower {
  private sprite: Phaser.GameObjects.Image;
  private scene: Phaser.Scene;
  private stage: number;
  private offset: { x: number; y: number } | null;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    this.scene = scene;
    this.sprite = scene.add.image(x, y, texture).setInteractive();
    this.sprite.setScale(0);
    this.sprite.setOrigin(0.5, 1);

    this.stage = 0; // Initialize stage
    this.offset = null; // Initialize offset

    this.sprite.setData('stage', this.stage);

    this.initInteractions();
    this.animateAppearance();
  }

  private initInteractions(): void {
    this.sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.sprite.setAlpha(0.7);
      this.sprite.setDepth(10);
      this.offset = {x: pointer.x - this.sprite.x, y: pointer.y - this.sprite.y};
      this.sprite.setData('lastPointerDownTime', Date.now());
    });

    this.sprite.on('pointerup', () => {
      this.sprite.setAlpha(1);
      this.sprite.setDepth(1);

      const lastPointerDownTime = this.sprite.getData('lastPointerDownTime');
      const timeSincePointerDown = Date.now() - lastPointerDownTime;

      if (timeSincePointerDown < 300) {
        this.updateStage();
      }
    });

    this.sprite.on('pointerupoutside', () => {
      this.sprite.setAlpha(1);
      this.sprite.setDepth(1);
    });
  }

  private async animateAppearance(): Promise<void> {
    await new Promise<void>((resolve, reject) => this.scene.tweens.add({
      targets: this.sprite,
      scale: 1,
      duration: 200,
      ease: Phaser.Math.Easing.Back.Out,
      onComplete: () => {
        this.sprite.setInteractive();
        resolve();
      }
    }));
    // Start wiggling
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.05,
      scaleY: 0.95,
      duration: 1000,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      yoyo: true,
      delay: Phaser.Math.Between(0, 1000),
      repeat: -1
    });
  }

  private updateStage(): void {
    this.stage = Phaser.Math.Clamp(this.stage + 1, 0, ['flower0', 'flower1', 'flower2'].length - 1);
    this.sprite.setTexture(['flower0', 'flower1', 'flower2'][this.stage]);
  }

  destroy(): void {
    this.scene.tweens.killTweensOf(this.sprite);
    this.scene.tweens.add({
      targets: this.sprite,
      scale: 0,
      duration: 200,
      ease: Phaser.Math.Easing.Back.In,
      onComplete: () => {
        this.sprite.removeAllListeners();
        this.sprite.destroy();
      }
    })
  }

  getSprite(): Phaser.GameObjects.Image {
    return this.sprite;
  }

  getOffset(): { x: number; y: number } | null {
    return this.offset;
  }

  getStage(): number {
    return this.stage;
  }

  setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }
}
