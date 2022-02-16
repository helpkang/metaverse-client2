import Phaser from "phaser";
import { DynamicLoadMoveBackground } from "./DynamicLoadMoveBackground";
import { ManagePlayer } from "./ManagePlayer";
import { MetaverseMapFactory } from "./MetaverseMap";

export class WorldScene extends Phaser.Scene {

  managePlayer?: ManagePlayer;

  constructor() {
    super({ key: "WorldScene" });
  }

  public preload() {
    // map tiles
    this.load.image("tiles", "/assets/image/grass-tiles-2-small.png");

    // map in json format
    this.load.tilemapTiledJSON("map", "/assets/tilemaps/basemap.json");
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

    const mvMap = MetaverseMapFactory.create({
      wall: map.createLayer("wall", tiles)
    });
    this.managePlayer = new ManagePlayer(
      this,
      mvMap,
      this.onMeetEnemy.bind(this)
    );
    new DynamicLoadMoveBackground().load(this)
  }

  public override update(time: number, delta: number) {
    this.managePlayer?.update(time, delta);
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


