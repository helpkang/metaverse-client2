import Phaser from "phaser";
import { speed } from "./TypeScene";

interface MoveKeys {
  LEFT: string
  RIGHT: string
  UP: string
  DOWN: string
}

interface KeyboardKey {
  LEFT: Phaser.Input.Keyboard.Key
  RIGHT: Phaser.Input.Keyboard.Key
  UP: Phaser.Input.Keyboard.Key
  DOWN: Phaser.Input.Keyboard.Key
}
export class Player {
  sprite?: Sprite;
  // cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  keyboardKey: KeyboardKey

  constructor(public opt: PlayerOptions) {
    // our two characters
    opt.load.spritesheet(opt.name, opt.url, opt.frameConfig);
    const { moveKeys, scene } = this.opt;
    const { input } = scene;
    const {LEFT, RIGHT, UP, DOWN} = moveKeys;
    this.keyboardKey = {
      LEFT: input.keyboard.addKey(LEFT),
      RIGHT: input.keyboard.addKey(RIGHT),
      UP: input.keyboard.addKey(UP),
      DOWN: input.keyboard.addKey(DOWN),
    }
    opt.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.init();
    });
    // this.cursors = this.opt.scene.input.keyboard.createCursorKeys();
  }
  init() {
    const { name, scene } = this.opt;
    const { anims, physics } = scene;
    


    anims.create({
      key: "left",
      frames: anims.generateFrameNumbers(name, {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });

    // animation with key 'right'
    anims.create({
      key: "right",
      frames: anims.generateFrameNumbers(name, {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "up",
      frames: anims.generateFrameNumbers(name, {
        frames: [2, 8, 2, 14],
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "down",
      frames: anims.generateFrameNumbers(name, {
        frames: [0, 6, 0, 12],
      }),
      frameRate: 10,
      repeat: -1,
    });
    // this.player = this.physics.add.sprite(map.widthInPixels/2, map.heightInPixels/2, name, 6);
    const sprite = physics.add.sprite(800, 800, name, 6);
    sprite.setDepth(2);
    sprite.setCollideWorldBounds(true);
    this.sprite = sprite;
  }

  addWall(wall: Phaser.Tilemaps.TilemapLayer) {
    if (!this.sprite) return;
    // don't walk on trees
    this.opt.scene.physics.add.collider(this.sprite, wall);
  }

  overlap(
    spawns:
      | Phaser.GameObjects.GameObject
      | Phaser.GameObjects.GameObject[]
      | Phaser.GameObjects.Group
      | Phaser.GameObjects.Group[],
    callback?: ArcadePhysicsCallback
  ) {
    if (!this.sprite) return;
    this.opt.scene.physics.add.overlap(this.sprite, spawns, callback);
  }

  update() {
    if (!this.sprite) return;
    this.sprite.body.setVelocity(0);
    const { LEFT, RIGHT, UP, DOWN } = this.keyboardKey;
    // const  LEFT = Phaser.Input.Keyboard.KeyCodes[moveKeys.LEFT] ;

    // Horizontal movement
    if (LEFT.isDown) {
      this.sprite.body.setVelocityX(-speed);
    } else if (RIGHT.isDown) {
      this.sprite.body.setVelocityX(speed);
    }

    // Vertical movement
    if (UP.isDown) {
      this.sprite.body.setVelocityY(-speed);
    } else if (DOWN.isDown) {
      this.sprite.body.setVelocityY(speed);
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (LEFT.isDown) {
      this.sprite.anims.play("left", true);
      this.sprite.flipX = true;
    } else if (RIGHT.isDown) {
      this.sprite.anims.play("right", true);
      this.sprite.flipX = false;
    } else if (UP.isDown) {
      this.sprite.anims.play("up", true);
    } else if (DOWN.isDown) {
      this.sprite.anims.play("down", true);
    } else {
      this.sprite.anims.stop();
    }
  }
}
interface PlayerOptions {
  load: Phaser.Loader.LoaderPlugin;
  name: string;
  url: string;
  frameConfig?: Phaser.Types.Loader.FileTypes.ImageFrameConfig;
  scene: Phaser.Scene;
  moveKeys: MoveKeys;
}
export type Sprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
