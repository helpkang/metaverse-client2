import Phaser from "phaser";

export function createAnimation(
  anims: Phaser.Animations.AnimationManager,
  name: string
) {
  anims.create({
    key: "left",
    frames: anims.generateFrameNumbers(name, {
      frames: [1, 7, 1, 13],
    }),
    frameRate: 10,
    repeat: -1,
  });

  // animation with key 'right'
  anims.create({
    key: "right",
    frames: anims.generateFrameNumbers(name, {
      frames: [1, 7, 1, 13],
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "up",
    frames: anims.generateFrameNumbers(name, {
      frames: [2, 8, 2, 14],
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "down",
    frames: anims.generateFrameNumbers(name, {
      frames: [0, 6, 0, 12],
    }),
    frameRate: 10,
    repeat: -1,
  });
}
