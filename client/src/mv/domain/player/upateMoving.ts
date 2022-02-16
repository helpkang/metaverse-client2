import { FrameInfo } from "./plaerType";
import { Sprite, KeyboardKey, SPEED } from "./Player";

export function upateMoving(keyboardKey: KeyboardKey, frameInfo:{ [key: string]: FrameInfo }, sprite?: Sprite) {
  if (!sprite) return;
  moveEvent(keyboardKey, sprite);
  const { LEFT, RIGHT, UP, DOWN, SPEED_UP2X, SPEED_UP4X } = keyboardKey;
  // const  LEFT = Phaser.Input.Keyboard.KeyCodes[moveKeys.LEFT] ;
  const m1 = SPEED_UP2X ? (SPEED_UP2X.isDown ? 2 : 1) : 1;
  const m2 = SPEED_UP4X ? (SPEED_UP4X.isDown ? 4 : 1) : 1;
  const speed = SPEED * m1 * m2;
  // Horizontal movement
  const {body, anims} = sprite;
  body.setVelocity(0);
  if (LEFT.isDown) {
    body.setVelocityX(-speed);
  } else if (RIGHT.isDown) {
    body.setVelocityX(speed);
  }

  // Vertical movement
  if (UP.isDown) {
    body.setVelocityY(-speed);
  } else if (DOWN.isDown) {
    body.setVelocityY(speed);
  }

  // Update the animation last and give left/right animations precedence over up/down animations
  if (LEFT.isDown) {
    move("left", anims, sprite, frameInfo);
  } else if (RIGHT.isDown) {
    move("right", anims, sprite, frameInfo);
  } else if (UP.isDown) {
    move("up", anims, sprite, frameInfo);
  } else if (DOWN.isDown) {
    move("down", anims, sprite, frameInfo);
  } else {
    anims.stop();
  }
}

function move(direction: string, anims: Phaser.Animations.AnimationState, sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, frameInfo:{ [key: string]: FrameInfo }) {
  sprite.flipX = !!frameInfo[direction].flipX;
  anims.play(direction, true);
  // sprite.flipX = true;
}

export function moveEvent(keyboardKey: KeyboardKey, sprite: Sprite) {
  if (sprite.body.velocity.x !== 0 || sprite.body.velocity.y !== 0) {
    //TODO: moveEvent 처리 서버에 동기화 하기, 반대로 서버에서 내려오는 것도 필요 할것 같음
    const event ={
      vX: sprite.body.velocity.x,
      vY: sprite.body.velocity.y,
      x: sprite.x,
      y: sprite.y,
    }
  }
}
