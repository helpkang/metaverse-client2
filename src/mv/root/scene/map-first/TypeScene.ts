import Phaser from "phaser";
import { Player, Sprite } from "./Player";

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

export const speed = 130;

export class WorldScene extends Phaser.Scene {
  player?: Player;
  they?: Player;

  spawns?: Phaser.Physics.Arcade.Group;

  constructor() {
    super({ key: "WorldScene" });
  }

  preload() {
    // map tiles
    this.load.image("tiles", "/assets/image/grass-tiles-2-small.png");

    // map in json format
    this.load.tilemapTiledJSON("map", "/assets/tilemaps/basemap.json");

    this.player = new Player({
      load: this.load,
      name: "player",
      url: "/assets/image/RPG_assets.png",
      scene: this,
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
      },
      moveKeys: {
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
        UP: 'UP',
        DOWN: 'DOWN',
      },
    });
    
    this.they = new Player({
      load: this.load,
      // load: new Phaser.Loader.LoaderPlugin(this),
      name: "they",
      url: "/assets/image/RPG_assets.png",
      scene: this,
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
      },
      moveKeys: {
        LEFT: 'A',
        RIGHT: 'D',
        UP: 'W',
        DOWN: 'S',
      },
    });
  }

  async dynamicLoad() {
    var name = "card-back";
    // texture needs to be loaded to create a placeholder card

    let loader = new Phaser.Loader.LoaderPlugin(this);
    // ask the LoaderPlugin to load the texture
    loader.image(name, "https://phaser.io/images/sponsors/twilio300.png");

    loader.once(Phaser.Loader.Events.COMPLETE, () => {
      // texture loaded so use instead of the placeholder
      const card = this.add.image(200, 200, name);
      // setInterval(() => {
      //   card.setPosition(card.x + 1, card.y + 1);
      // }, 1000 / 60);
      // card.setTexture(name)
      card.setDepth(1);
    });
    loader.start();
  }

  // async dynamicThey(wall: Phaser.Tilemaps.TilemapLayer) {
  //   let loader = new Phaser.Loader.LoaderPlugin(this);

  //   loader.spritesheet("they1", "/assets/image/RPG_assets.png", {
  //     frameWidth: 16,
  //     frameHeight: 16,
  //   });

  //   loader.once(Phaser.Loader.Events.COMPLETE, () => {
  //     console.log("load complete");
  //     this.they = this.makeAnimation("they1", wall);
  //   });
  //   loader.start();
  // }

  create() {
    // create the map
    const map = this.make.tilemap({ key: "map" });

    // first parameter is the name of the tilemap in tiled
    const tiles = map.addTilesetImage("grass-tiles-2-small", "tiles");

    // creating the layers
    map.createLayer("ground", tiles);

    // don't go out of the map
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
    const wall = this.createWall(map, tiles);
    this.player?.addWall(wall);
    this.they?.addWall(wall);
    // const player = this.makePalyer(wall);

    // limit camera to map
    this.setupCamera(map);

    // user input
    this.input.keyboard.addKeys(["W", "A", "S", "D"]);

    // where the enemies will be
    this.spawns = this.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });
    for (var i = 0; i < 30; i++) {
      var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
      // parameters are x, y, width, height
      this.spawns.create(x, y);
    }
    // add collider
    // this.physics.add.overlap(this.player.sprite, this.spawns, this.onMeetEnemy.bind(this));
    this.player?.overlap(this.spawns, this.onMeetEnemy.bind(this));
    this.they?.overlap(this.spawns, this.onMeetEnemy.bind(this));

    this.dynamicLoad();
    // this.dynamicThey(wall);
  }

  private setupCamera(map: Phaser.Tilemaps.Tilemap) {
    if (!this.player) return;
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    if (this.player.sprite) this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.roundPixels = true; // avoid tile bleed
  }

  private createWall(
    map: Phaser.Tilemaps.Tilemap,
    tiles: Phaser.Tilemaps.Tileset
  ): Phaser.Tilemaps.TilemapLayer {
    const wall = map.createLayer("wall", tiles);

    // make all tiles in obstacles collidable
    wall.setCollisionByExclusion([-1]);
    return wall;
  }

  private makePalyer(wall: Phaser.Tilemaps.TilemapLayer): Sprite {
    return this.makeAnimation("player", wall);
  }

  private makeAnimation(name: string, wall: Phaser.Tilemaps.TilemapLayer) {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(name, {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });

    // animation with key 'right'
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(name, {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers(name, {
        frames: [2, 8, 2, 14],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers(name, {
        frames: [0, 6, 0, 12],
      }),
      frameRate: 10,
      repeat: -1,
    });
    // this.player = this.physics.add.sprite(map.widthInPixels/2, map.heightInPixels/2, name, 6);
    const player = this.physics.add.sprite(800, 800, name, 6);
    player.setDepth(2);
    player.setCollideWorldBounds(true);

    // don't walk on trees
    this.physics.add.collider(player, wall);

    return player;
  }

  onMeetEnemy(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    zone: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    // we move the zone to some other location
    zone.body.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.body.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
    this.cameras.main.fadeOut(200).fadeIn(200);

    // shake the world
    // this.cameras.main.shake(300);

    // const isFpsSleeping  = this.scene.isSleeping('FpsScene')
    // isFpsSleeping ? this.scene.sleep('FpsScene') : this.scene.wake('FpsScene')

    // start battle
  }

  update(time: any, delta: any) {
    //    this.controls.update(delta);
    this.player?.update();
     this.they?.update();
  }
}


