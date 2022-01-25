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
export interface Player {
  addWall(wall: Phaser.Tilemaps.TilemapLayer): void;
  overlap(
    spawns:
      | Phaser.GameObjects.GameObject
      | Phaser.GameObjects.GameObject[]
      | Phaser.GameObjects.Group
      | Phaser.GameObjects.Group[],
    callback?: ArcadePhysicsCallback
  ): void;
  update(time: number, delta: number): void;
}

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
    if (!this.sprite) return;
    this.sprite.body.setVelocity(0);
    const { LEFT, RIGHT, UP, DOWN, SPEED_UP2X, SPEED_UP4X } = this.keyboardKey;
    // const  LEFT = Phaser.Input.Keyboard.KeyCodes[moveKeys.LEFT] ;

    const m1 = SPEED_UP2X ? (SPEED_UP2X.isDown ? 2 : 1) : 1;
    const m2 = SPEED_UP4X ? (SPEED_UP4X.isDown ? 4 : 1) : 1;
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
    if (!this.text) return;
    this.text.x = Math.floor(this.sprite.x);
    this.text.y = Math.floor(this.sprite.y - this.sprite.height);
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
  depth?: number;
}

export class PalyerFactory {
  static create(
    wall: Phaser.Tilemaps.TilemapLayer,
    opt: PlayerOptions,
    spwans?: Phaser.Physics.Arcade.Group,
    callback?: ArcadePhysicsCallback
  ): Player {
    const player = new PlayerImpl(opt);
    player.addWall(wall);

    if (spwans) player.overlap(spwans, callback);
    return player;
  }
}

export type Sprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
