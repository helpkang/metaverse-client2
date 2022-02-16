import Phaser from "phaser";
import { createAnimation } from "./createAnimation";
import { FrameInfo } from "./plaerType";
import { Player, Sprite, KeyboardKey, PlayerOptions } from "./Player";
import { upateMoving } from "./upateMoving";


export class PlayerImpl implements Player {
  sprite?: Sprite;
  // cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  keyboardKey: KeyboardKey;
  text?: Phaser.GameObjects.Text;

  constructor(public opt: PlayerOptions) {
    opt.depth = opt.depth ? opt.depth : 2;
    // our two characters
    const { moveKeys, scene, name, url, frameConfig } = this.opt;
    const { input } = scene;
    const { LEFT, RIGHT, UP, DOWN, SPEED_UP2X, SPEED_UP4X } = moveKeys;
    this.keyboardKey = {
      LEFT: input.keyboard.addKey(LEFT),
      RIGHT: input.keyboard.addKey(RIGHT),
      UP: input.keyboard.addKey(UP),
      DOWN: input.keyboard.addKey(DOWN),
      SPEED_UP2X: SPEED_UP2X ? input.keyboard.addKey(SPEED_UP2X) : undefined,
      SPEED_UP4X: SPEED_UP4X ? input.keyboard.addKey(SPEED_UP4X) : undefined,
    };
    let { load } = this.opt;
    load = load ? load : new Phaser.Loader.LoaderPlugin(scene);
    load.spritesheet(name, url, frameConfig);
    load.once(
      Phaser.Loader.Events.COMPLETE,
      () => {
        this.init();
      },
      scene
    );
    load.start();
  }

  queue: Function[] = [];

  private init() {
    const { name, scene, camera, frameInfo } = this.opt;
    const { anims, physics } = scene;

    createAnimation(anims, name, frameInfo);
    // this.player = this.physics.add.sprite(map.widthInPixels/2, map.heightInPixels/2, name, 6);
    const sprite = physics.add.sprite(800, 800, name, 6);
    if (this.opt.depth) sprite.setDepth(this.opt.depth);
    sprite.setCollideWorldBounds(true);
    this.sprite = sprite;

    this.start();
    if (camera) {
      camera.stopFollow();
      camera.startFollow(this.sprite);
      camera.roundPixels = true; // avoid tile bleed
    }

    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      font: "13px Arial",
      color: "black",
      wordWrap: { width: sprite.width },
      align: "center",
      // backgroundColor: "white",
      padding: { left: 5, right: 5, top: 1, bottom: 1 },
    };
    this.text = scene.add.text(0, 0, "이름:" + name, style);
    this.text.setOrigin(0.5, 0.5);
    // this.text.setAlpha(0.5);
    this.text.setBackgroundColor("#ffffff55");
    if (this.opt.depth) this.text.setDepth(this.opt.depth);
  }

  public addWall(wall: Phaser.Tilemaps.TilemapLayer) {
    // don't walk on trees
    const fn = () => {
      if (this.sprite) {
        this.opt.scene.physics.add.collider(this.sprite, wall);
      }
    };
    this.start(fn);
  }

  private start(fn?: Function) {
    if (fn) {
      this.queue.push(fn);
    }
    if (!this.sprite) {
      return;
    }
    const queue = this.queue;
    this.queue = [];
    queue.forEach((fn) => fn());
  }

  public overlap(
    spawns:
      | Phaser.GameObjects.GameObject
      | Phaser.GameObjects.GameObject[]
      | Phaser.GameObjects.Group
      | Phaser.GameObjects.Group[],
    callback?: ArcadePhysicsCallback
  ) {
    const fn = () => {
      if (this.sprite) {
        this.opt.scene.physics.add.overlap(this.sprite, spawns, callback);
      }
    };
    this.start(fn);
  }

  public update(time: number, delta: number) {
    upateMoving(this.keyboardKey, this.opt.frameInfo, this.sprite );
    this.drawText();
  }



  private drawText() {
    if (!this.text || !this.sprite) return;
    this.text.x = Math.floor(this.sprite.x);
    this.text.y = Math.floor(this.sprite.y - this.sprite.height);
  }
}




