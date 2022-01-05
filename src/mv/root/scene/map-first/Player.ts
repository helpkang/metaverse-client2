import Phaser from "phaser";

const SPEED = 130;

interface MoveKeys {
  LEFT: string;
  RIGHT: string;
  UP: string;
  DOWN: string;
  SPEED_UP2X?: string;
  SPEED_UP4X?: string;
}

interface KeyboardKey {
  LEFT: Phaser.Input.Keyboard.Key;
  RIGHT: Phaser.Input.Keyboard.Key;
  UP: Phaser.Input.Keyboard.Key;
  DOWN: Phaser.Input.Keyboard.Key;
  SPEED_UP2X?: Phaser.Input.Keyboard.Key;
  SPEED_UP4X?: Phaser.Input.Keyboard.Key;
}
export class Player {
  sprite?: Sprite;
  // cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  keyboardKey: KeyboardKey;

  constructor(public opt: PlayerOptions) {
    // our two characters
    const { moveKeys, scene, name, url, frameConfig } = this.opt;
    const { input } = scene;
    const { LEFT, RIGHT, UP, DOWN, SPEED_UP2X, SPEED_UP4X, } = moveKeys;
    this.keyboardKey = {
      LEFT: input.keyboard.addKey(LEFT),
      RIGHT: input.keyboard.addKey(RIGHT),
      UP: input.keyboard.addKey(UP),
      DOWN: input.keyboard.addKey(DOWN),
      SPEED_UP2X: SPEED_UP2X? input.keyboard.addKey(SPEED_UP2X) : undefined,
      SPEED_UP4X: SPEED_UP4X? input.keyboard.addKey(SPEED_UP4X) : undefined,
    };
    let {load} = this.opt
    load = load ? load : new Phaser.Loader.LoaderPlugin(scene);
    load.spritesheet(name, url, frameConfig);
    load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.init();
    }, scene);
    load.start();
  }
  
  queue: Function[] = [];

  init() {
    const { name, scene, camera } = this.opt;
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
    const queue = this.queue;
    this.queue = [];
    queue.forEach((fn) => fn());
    if(camera) {
      camera.startFollow(this.sprite);
    }
  }

  addWall(wall: Phaser.Tilemaps.TilemapLayer) {
    // don't walk on trees
    const fn = () => {
      if (this.sprite) {
        this.opt.scene.physics.add.collider(this.sprite, wall);
      }
    };
    if (!this.sprite) {
      this.queue.push(fn);
      return;
    }
    fn();
  }

  overlap(
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
    if (!this.sprite) {
      this.queue.push(fn);
      return;
    }
    fn();
  }

  update(time: number, delta: number) {
    if (!this.sprite) return;
    this.sprite.body.setVelocity(0);
    const { LEFT, RIGHT, UP, DOWN, SPEED_UP2X, SPEED_UP4X } = this.keyboardKey;
    // const  LEFT = Phaser.Input.Keyboard.KeyCodes[moveKeys.LEFT] ;

    const m1 = SPEED_UP2X ? SPEED_UP2X.isDown? 2: 1 : 1;
    const m2 = SPEED_UP4X ? SPEED_UP4X.isDown? 4: 1 : 1;
    const speed = SPEED * m1 * m2;
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
export interface PlayerOptions {
  load?: Phaser.Loader.LoaderPlugin;
  name: string;
  url: string;
  frameConfig?: Phaser.Types.Loader.FileTypes.ImageFrameConfig;
  scene: Phaser.Scene;
  moveKeys: MoveKeys;
  camera?: Phaser.Cameras.Scene2D.Camera;
}
export type Sprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
