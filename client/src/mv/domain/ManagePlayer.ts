import Phaser from "phaser";
import { MetaverseMap } from "./MetaverseMap";
import { Player } from "./player/Player";
import { PalyerFactory } from "./player/PalyerFactory";

const frameInfo = {
  "left": {
    frames: [1, 7, 1, 13],
    flipX: true,
  },
  "right": {
    frames: [1, 7, 1, 13],
  },
  "up":
  {
    frames: [2, 8, 2, 14],
  },
  "down": {
    frames: [0, 6, 0, 12],
  },
}

const frameInfoNew = {
  "left": {
    frames: [6, 7, 8],
  },
  "right": {
    frames: [6, 7, 8],
    flipX: true,
  },
  "up":
  {
    frames: [3,4,5],
  },
  "down": {
    frames: [0,1,2],
  },
}
export class ManagePlayer
{
  players: Player[] = [];

  spawns?: Phaser.Physics.Arcade.Group;

  constructor(
    private scene: Phaser.Scene,
    private mvMap: MetaverseMap,
    private callback?: ArcadePhysicsCallback,
  )
  {
    this.dynamicPlayerAll(callback);
  }


  private getSpwans(): Phaser.Physics.Arcade.Group
  {
    if (this.spawns)
      return this.spawns;
    // where the enemies will be
    this.spawns = this.scene.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });
    for (var i = 0; i < 30; i++)
    {
      var x = Phaser.Math.RND.between(0, this.scene.physics.world.bounds.width);
      var y = Phaser.Math.RND.between(
        0,
        this.scene.physics.world.bounds.height
      );
      // parameters are x, y, width, height
      this.spawns.create(x, y);
    }
    return this.spawns;
  }


  async dynamicPlayerAll(callback?: ArcadePhysicsCallback)
  {
    const wall = this.mvMap?.getWall();
    if (!wall)
      return;

    const p1 = PalyerFactory.create(
      wall,
      {
        name: "player",
        url: "/assets/image/avatar01_26x34.png",
        scene: this.scene,
        frameConfig: {
          frameWidth: 26,
          frameHeight: 34,
        },
        moveKeys: {
          LEFT: ["LEFT"],
          RIGHT: ["RIGHT"],
          UP: ["UP"],
          DOWN: ["DOWN"],
          SPEED_UP2X: "SHIFT",
          SPEED_UP4X: "CTRL",
        },
        camera: this.scene.cameras.main,
        depth: 3,
        frameInfo: frameInfoNew,
      },
      this.getSpwans(),
      callback
    );
    const p2 = PalyerFactory.create(
      wall,
      {
        // load: this.scene.load,
        name: "player2",
        url: "/assets/image/RPG_assets.png",
        scene: this.scene,
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
        camera: this.scene.cameras.main,
        depth: 2,
        frameInfo,
      },
      this.getSpwans(),
      callback
    );
    this.players.push(p2);   
    this.players.push(p1);

  }

  update(time: number, delta: number)
  {
    this.players.forEach((player) =>
    {
      player.update(time, delta);
    });
  }
}
