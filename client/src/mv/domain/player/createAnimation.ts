import Phaser from "phaser";
import { FrameInfo } from "./plaerType";

export function createAnimation(
  anims: Phaser.Animations.AnimationManager,
  name: string,
  frameInfo:  { [key: string]: FrameInfo }
) {
 
  const keys = Object.keys(frameInfo)
  keys.forEach(key => {
    const { frames } = frameInfo[key];
    anims.create({
      key: name+'_'+key,
      frames: anims.generateFrameNumbers(name, {
        frames,
      }),
      frameRate: 10,
      repeat: -1,
    });
  })
}
