import Phaser from "phaser";
import { MetaverseMap } from "./MetaverseMap";
import { Player } from "./player/Player";
import { PalyerFactory } from "./player/PalyerFactory";

const frameInfo = {
  left: {
    frames: [1, 7, 1, 13],
    flipX: true,
  },
  right: {
    frames: [1, 7, 1, 13],
  },
  up: {
    frames: [2, 8, 2, 14],
  },
  down: {
    frames: [0, 6, 0, 12],
  },
};

const frameInfoNew = {
  left: {
    frames: [6, 7, 8],
  },
  right: {
    frames: [6, 7, 8],
    flipX: true,
  },
  up: {
    frames: [3, 4, 5],
  },
  down: {
    frames: [0, 1, 2],
  },
};
export class ManagePlayer {
  players: Player[] = [];

  spawns?: Phaser.Physics.Arcade.Group;

  constructor(
    private scene: Phaser.Scene,
    private mvMap: MetaverseMap,
    private callback?: ArcadePhysicsCallback
  ) {
    this.dynamicPlayerAll(callback);
  }

  private getSpwans(): Phaser.Physics.Arcade.Group {
    if (this.spawns) {
      return this.spawns;
    }
    // where the enemies will be
    this.spawns = this.scene.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });

    // parameters are x, y, width, height
    

    return this.spawns;
  }

  create(x: number, y: number, width:number, height:number): any{
    const zone = this.spawns?.create(x-(width/2), y-(width/2));
    zone.body.width = width;
    zone.body.height = height;
    return zone;
  }

  async dynamicPlayerAll(callback?: ArcadePhysicsCallback) {
    const wall = this.mvMap?.getWall();
    if (!wall) return;
    const position = { x: 1005, y: 470 };
    const position2 = { x: 1005, y: 200 };
    const s = this.getSpwans();
    const zone =  this.create(position2.x, position2.y, 200, 200);
    const p1 = PalyerFactory.create(
      wall,
      {
        name: "고객",
        scene: this.scene,
        url: "/assets/image/avatar/avatar_m05_26x34.png",
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
        // camera: this.scene.cameras.main,
        depth: 3,
        frameInfo: frameInfoNew,
        camera: this.scene.cameras.main,
        position,
      },
      s,
      callback
    );
    const p2 = PalyerFactory.create(
      wall,
      {
        position: position2,
        // load: this.scene.load,
        name: "상담원",
        scene: this.scene,
        url: "/assets/image/avatar/avatar_w04_26x34.png",
        frameConfig: {
          frameWidth: 26,
          frameHeight: 34,
        },
        moveKeys: {
          LEFT: "A",
          RIGHT: "D",
          UP: "W",
          DOWN: "S",
          SPEED_UP2X: "ALT",
          SPEED_UP4X: "CTRL",
        },

        depth: 2,
        frameInfo: frameInfoNew,
        zone,
      }
    );
    this.players.push(p2);
    this.players.push(p1);
  }

  update(time: number, delta: number) {
    this.players.forEach((player) => {
      player.update(time, delta);
    });
  }
}
