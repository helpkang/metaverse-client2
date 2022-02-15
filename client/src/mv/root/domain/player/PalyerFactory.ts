import Phaser from "phaser";
import { Player, PlayerOptions } from "./Player";
import { PlayerImpl } from "./PlayerImpl";


export class PalyerFactory
{
  static create(
    wall: Phaser.Tilemaps.TilemapLayer,
    opt: PlayerOptions,
    spwans?: Phaser.Physics.Arcade.Group,
    callback?: ArcadePhysicsCallback
  ): Player
  {
    const player = new PlayerImpl(opt);
    player.addWall(wall);

    if (spwans)
      player.overlap(spwans, callback);
    return player;
  }
}
