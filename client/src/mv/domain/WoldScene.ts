import Phaser from "phaser";
import { DynamicLoadMoveBackground } from "./DynamicLoadMoveBackground";
import { ManagePlayer } from "./ManagePlayer";
import { MetaverseMap, MetaverseMapFactory } from "./MetaverseMap";

export class WorldScene extends Phaser.Scene {
  managePlayer?: ManagePlayer;

  constructor() {
    super({ key: "WorldScene" });
  }

  public preload() {
    // map tiles
    this.load.image("ground", "/assets/image/map/tiledmap.png");
    this.load.image("wall", "/assets/image/map/transparency16x16.png");

    // map in json format
    this.load.tilemapTiledJSON("map", "/assets/tilemaps/ke1.json");
  }

  public create() {
    // create the map


    const map = this.createMap();

    // creating the layers
    this.createLayer(map);
    // don't go out of the map
    this.createWorldRange(map);

    // limit camera to map
    this.createCameraRange(map); // avoid tile bleed

    const mvMap = this.createMvMap(map);

    this.createPlayer(mvMap);

    // this.createDynamicMove();
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

  private createDynamicMove() {
    new DynamicLoadMoveBackground().load(this);
  }

  private createPlayer(mvMap: MetaverseMap) {
    this.managePlayer = new ManagePlayer(
      this,
      mvMap,
      this.onMeetEnemy.bind(this)
    );
  }

  private createMvMap(map: Phaser.Tilemaps.Tilemap) {
    // first parameter is the name of the tilemap in tiled
    const wallTile = map.addTilesetImage("transparency16x16", "wall");

    return MetaverseMapFactory.create({
      wall: map.createLayer("wall", wallTile),
    });
  }

  private createCameraRange(map: Phaser.Tilemaps.Tilemap) {
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.roundPixels = true;
  }

  private createWorldRange(map: Phaser.Tilemaps.Tilemap) {
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
  }

  
  private createLayer(map: Phaser.Tilemaps.Tilemap) {
    this.add.image(0, 0, "ground").setOrigin(0, 0);
    // first parameter is the name of the tilemap in tiled
    // const groundImage = map.addTilesetImage("ground", "ground");
    // map.createLayer("ground", groundImage);
  }

  private createMap() {
    return this.make.tilemap({ key: "map" });
  }
}
