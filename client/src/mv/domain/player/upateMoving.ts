import { FrameInfo } from "./plaerType";
import { Sprite, KeyboardKey, SPEED } from "./Player";

export function upateMoving(
  name: string,
  keyboardKey: KeyboardKey,
  frameInfo: { [key: string]: FrameInfo },
  sprite?: Sprite
) {
  if (!sprite) return;
  moveEvent(keyboardKey, sprite);
  const { LEFT, RIGHT, UP, DOWN, SPEED_UP2X, SPEED_UP4X } = keyboardKey;
  // const  LEFT = Phaser.Input.Keyboard.KeyCodes[moveKeys.LEFT] ;
  const m1 = SPEED_UP2X ? (SPEED_UP2X.isDown ? 2 : 1) : 1;
  const m2 = SPEED_UP4X ? (SPEED_UP4X.isDown ? 4 : 1) : 1;
  const speed = SPEED * m1 * m2;
  // Horizontal movement
  const { body, anims } = sprite;
  body.setVelocity(0);
  if (isDown(LEFT)) {
    body.setVelocityX(-speed);
  } else if (isDown(RIGHT)) {
    body.setVelocityX(speed);
  }

  // Vertical movement
  if (isDown(UP)) {
    body.setVelocityY(-speed);
  } else if (isDown(DOWN)) {
    body.setVelocityY(speed);
  }

  // Update the animation last and give left/right animations precedence over up/down animations
  if (isDown(LEFT)) {
    move(name, "left", anims, sprite, frameInfo);
  } else if (isDown(RIGHT)) {
    move(name, "right", anims, sprite, frameInfo);
  } else if (isDown(UP)) {
    move(name, "up", anims, sprite, frameInfo);
  } else if (isDown(DOWN)) {
    move(name, "down", anims, sprite, frameInfo);
  } else {
    anims.stop();
  }
}

function isDown(LEFT: Phaser.Input.Keyboard.Key | Phaser.Input.Keyboard.Key[]) {
  if (LEFT instanceof Array) {
    return LEFT.some((key) => key.isDown);
  }
  return LEFT.isDown;
}

function move(
  name: string,
  direction: string,
  anims: Phaser.Animations.AnimationState,
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  frameInfo: { [key: string]: FrameInfo }
) {
  sprite.flipX = !!frameInfo[direction].flipX;
  anims.play(name+'_'+direction, true);
  // sprite.flipX = true;
}

export function moveEvent(keyboardKey: KeyboardKey, sprite: Sprite) {
  if (sprite.body.velocity.x !== 0 || sprite.body.velocity.y !== 0) {
    //TODO: moveEvent 처리 서버에 동기화 하기, 반대로 서버에서 내려오는 것도 필요 할것 같음
    const event = {
      vX: sprite.body.velocity.x,
      vY: sprite.body.velocity.y,
      x: sprite.x,
      y: sprite.y,
    };
  }
}
