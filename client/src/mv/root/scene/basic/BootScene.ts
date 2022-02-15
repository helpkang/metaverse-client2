import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }
  // Phaser.Scene.call(this, { key: 'BootScene' });

  preload() {}

  create() {
    // start the WorldScene
    this.scene.start("WorldScene");
    this.scene.start("FpsScene");
  }
}