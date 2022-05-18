import Phaser from "phaser";
import { FrameInfo } from "./plaerType";

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
  getSprite(): Phaser.GameObjects.Sprite|undefined;
}

export const SPEED = 130;

interface MoveKeys {
  LEFT: string|string[];
  RIGHT: string|string[];
  UP: string|string[];
  DOWN: string|string[];
  SPEED_UP2X?: string;
  SPEED_UP4X?: string;
}

export interface KeyboardKey {
  LEFT: Phaser.Input.Keyboard.Key|Phaser.Input.Keyboard.Key[];
  RIGHT: Phaser.Input.Keyboard.Key|Phaser.Input.Keyboard.Key[];
  UP: Phaser.Input.Keyboard.Key|Phaser.Input.Keyboard.Key[];
  DOWN: Phaser.Input.Keyboard.Key|Phaser.Input.Keyboard.Key[];
  SPEED_UP2X?: Phaser.Input.Keyboard.Key;
  SPEED_UP4X?: Phaser.Input.Keyboard.Key;
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
  frameInfo: {[key:string]: FrameInfo};
  position: {x: number, y: number};
  zone?: any;
}


export type Sprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
