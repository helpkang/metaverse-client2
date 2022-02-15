import Phaser from "phaser";

export class FPSScene extends Phaser.Scene {
  private text: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: "FpsScene"});
  }

  create(): void {
    this.text = this.add.text(10, 10, "");
  }

  update(): void {
    this.text?.setText(`FPS: ${this.game.loop.actualFps}`);
  }
}
