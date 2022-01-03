import Phaser from "phaser";

type Sprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
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

const speed = 130;

export class WorldScene extends Phaser.Scene {
  player?: Sprite;
  they?: Sprite;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  spawns?: Phaser.Physics.Arcade.Group;

  constructor() {
    super({ key: "WorldScene" });
  }

  preload() {
    // map tiles
    this.load.image("tiles", "/assets/image/grass-tiles-2-small.png");

    // map in json format
    this.load.tilemapTiledJSON("map", "/assets/tilemaps/basemap.json");

    // our two characters
    this.load.spritesheet("player", "/assets/image/RPG_assets.png", {
      frameWidth: 16,
      frameHeight: 16,
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

  async dynamicThey(wall: Phaser.Tilemaps.TilemapLayer) {
    let loader = new Phaser.Loader.LoaderPlugin(this);
    
    loader.spritesheet("they1", "/assets/image/RPG_assets.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    loader.once(Phaser.Loader.Events.COMPLETE, () => {
      console.log("load complete");
      this.they = this.makeAnimation('they1', wall);
    });
    loader.start();

  }

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
    const player = this.makePalyer(wall);
    this.player = player;

    // limit camera to map
    this.setupCamera(player, map);

    // user input
    this.input.keyboard.addKeys(["W", "A", "S", "D"]);
    this.cursors = this.input.keyboard.createCursorKeys();

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
    this.physics.add.overlap(player, this.spawns, this.onMeetEnemy.bind(this));

    this.dynamicLoad();
    this.dynamicThey(wall);
  }


  private setupCamera(player: Sprite, map: Phaser.Tilemaps.Tilemap) {
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
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
    if (!this.player || !this.cursors) return;
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
      this.player.anims.play("left", true);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.anims.play("right", true);
      this.player.flipX = false;
    } else if (this.cursors.up.isDown) {
      this.player.anims.play("up", true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play("down", true);
    } else {
      this.player.anims.stop();
    }



    if (!this.they) return;
    this.they.body.setVelocity(0);
    const {keys} = this.input.keyboard
    const {A,S,D,  W} =    Phaser.Input.Keyboard.KeyCodes
    // Horizontal movement
    if (keys[A].isDown) {
      this.they.body.setVelocityX(-speed);
    } else if (keys[D].isDown) {
      this.they.body.setVelocityX(speed);
    }

    // Vertical movement
    if (keys[W].isDown) {
      this.they.body.setVelocityY(-speed);
    } else if (keys[S].isDown) {
      this.they.body.setVelocityY(speed);
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (keys[A].isDown) {
      this.they.anims.play("left", true);
      this.they.flipX = true;
    } else if (keys[D].isDown) {
      this.they.anims.play("right", true);
      this.they.flipX = false;
    } else if (keys[W].isDown) {
      this.they.anims.play("up", true);
    } else if (keys[S].isDown) {
      this.they.anims.play("down", true);
    } else {
      this.they.anims.stop();
    }
  }
}
