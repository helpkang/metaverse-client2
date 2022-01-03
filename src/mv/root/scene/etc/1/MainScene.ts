import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
    
  private character: Phaser.Physics.Matter.Image | null = null;
  // 방향키를 감지할 키를 추가하기!
  private upKey: Phaser.Input.Keyboard.Key | null = null;
  private downKey: Phaser.Input.Keyboard.Key | null = null;
  private leftKey: Phaser.Input.Keyboard.Key | null = null;
  private rightKey: Phaser.Input.Keyboard.Key | null = null;

  private KeyCodes = Phaser.Input.Keyboard.KeyCodes;

  constructor() {
    super({ key: "main", active: true });
  }

  preload(): void {
    this.load.image("character", "/assets/image/character.png");
  }

  create(): void {
    this.character = this.matter.add.image(100, 150, "character");
    this.character.setStatic(true)
    // 사용할 키를 추가해줍니다.
    this.upKey = this.input.keyboard.addKey(this.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(this.KeyCodes.DOWN);
    this.leftKey = this.input.keyboard.addKey(this.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(this.KeyCodes.RIGHT);
  }

  update(time: number, delta: number): void {
    if (this.character) {
      if (this.upKey?.isDown) this.character.y -= 10;
      if (this.downKey?.isDown) this.character.y += 10;
      if (this.leftKey?.isDown) this.character.x -= 10;
      if (this.rightKey?.isDown) this.character.x += 10;
    }
  }

  destroy(): void {}
}