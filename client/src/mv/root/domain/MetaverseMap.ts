export interface MetaverseMapOptions{
  wall: Phaser.Tilemaps.TilemapLayer;
}

export interface MetaverseMap {
  // addWall(wall: Phaser.Tilemaps.TilemapLayer): Phaser.Tilemaps.TilemapLayer;
  getWall(): Phaser.Tilemaps.TilemapLayer;
}



export class MetaverseMapImpl implements MetaverseMap {
  wall: Phaser.Tilemaps.TilemapLayer;

  constructor(opt: MetaverseMapOptions) {
    this.wall = opt.wall;
    this.wall.setCollisionByExclusion([-1]);
  }

  getWall(): Phaser.Tilemaps.TilemapLayer {
    return this.wall;
  }

  // addWall(wall: Phaser.Tilemaps.TilemapLayer): Phaser.Tilemaps.TilemapLayer {
  //   wall.setCollisionByExclusion([-1]);
  //   return wall;
  // }

}

export class MetaverseMapFactory {
  static create(opt: MetaverseMapOptions): MetaverseMap {
    return new MetaverseMapImpl(opt);
  }
}

