import Phaser from "phaser";
import { MetaverseMap, MetaverseMapFactory } from "./MetaverseMap";
import { Player, PalyerFactory, PlayerOptions } from "./Player";

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

export class WorldScene extends Phaser.Scene {

  players: Player[] = [];

  spawns?: Phaser.Physics.Arcade.Group;

  mvMap?: MetaverseMap

  constructor() {
    super({ key: "WorldScene" });
  }


  public preload() {
    // map tiles
    this.load.image("tiles", "/assets/image/grass-tiles-2-small.png");

    // map in json format
    this.load.tilemapTiledJSON("map", "/assets/tilemaps/basemap.json");
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
      const cardInter = setInterval(() => {
        card.setPosition(card.x + 1, card.y + 1);
        if (card.x > this.game.config.width) {
          clearInterval(cardInter);
        }
      }, 1000 / 60);
      card.setTexture(name);
      card.setDepth(1);
    });
    loader.start();
  }

  async dynamicPlayerAll(
    callback?: ArcadePhysicsCallback
  ) {
    const wall = this.mvMap?.getWall();
    if(!wall) return;
    
    const p1 = PalyerFactory.create(
      wall,
      {
        name: "player",
        url: "/assets/image/RPG_assets.png",
        scene: this,
        frameConfig: {
          frameWidth: 16,
          frameHeight: 16,
        },
        moveKeys: {
          LEFT: "LEFT",
          RIGHT: "RIGHT",
          UP: "UP",
          DOWN: "DOWN",
          SPEED_UP2X: "SHIFT",
          SPEED_UP4X: "CTRL",
        },
        camera: this.cameras.main,
        depth:3,
      },
      this.getSpwans(),
      callback,
    );
    const p2 = PalyerFactory.create(
      wall,
      {
        load: this.load,
        name: "they",
        url: "/assets/image/RPG_assets.png",
        scene: this,
        frameConfig: {
          frameWidth: 16,
          frameHeight: 16,
        },
        moveKeys: {
          LEFT: "A",
          RIGHT: "D",
          UP: "W",
          DOWN: "S",
          SPEED_UP2X: "ALT",
          SPEED_UP4X: "CTRL",
        },
        camera: this.cameras.main,
        depth:2,
      },
      this.getSpwans(),
      callback,
    );
    this.players.push(p1);
    this.players.push(p2);
  }

  public create() {
    // create the map
    const map = this.make.tilemap({ key: "map" });

    // first parameter is the name of the tilemap in tiled
    const tiles = map.addTilesetImage("grass-tiles-2-small", "tiles");

    // creating the layers
    map.createLayer("ground", tiles);
    // don't go out of the map
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    // limit camera to map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.roundPixels = true; // avoid tile bleed

    this.mvMap = MetaverseMapFactory.create({wall: map.createLayer("wall", tiles)})
    this.dynamicPlayerAll(this.onMeetEnemy.bind(this));
    this.dynamicLoad();
  }

  public override update(time: number, delta: number) {
    this.players.forEach((player) => {
      player.update(time, delta);
    });
  }

  

  private getSpwans(): Phaser.Physics.Arcade.Group {
    if (this.spawns) return this.spawns;
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
    return this.spawns;
  }


  private onMeetEnemy(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    zone: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    // we move the zone to some other location
    zone.body.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.body.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
    // this.cameras.main.fadeOut(200).fadeIn(200);
    this.cameras.main.flash(200);

    // shake the world
    // this.cameras.main.shake(300);

    // const isFpsSleeping  = this.scene.isSleeping('FpsScene')
    // isFpsSleeping ? this.scene.sleep('FpsScene') : this.scene.wake('FpsScene')

    // start battle
  }


}
