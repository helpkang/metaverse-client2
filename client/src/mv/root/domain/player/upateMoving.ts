import { Sprite, KeyboardKey, SPEED } from "./Player";

export function upateMoving(keyboardKey: KeyboardKey, sprite?: Sprite) {
  if (!sprite) return;
  moveEvent(keyboardKey, sprite);
  sprite.body.setVelocity(0);
  const { LEFT, RIGHT, UP, DOWN, SPEED_UP2X, SPEED_UP4X } = keyboardKey;
  // const  LEFT = Phaser.Input.Keyboard.KeyCodes[moveKeys.LEFT] ;
  const m1 = SPEED_UP2X ? (SPEED_UP2X.isDown ? 2 : 1) : 1;
  const m2 = SPEED_UP4X ? (SPEED_UP4X.isDown ? 4 : 1) : 1;
  const speed = SPEED * m1 * m2;
  // Horizontal movement
  if (LEFT.isDown) {
    sprite.body.setVelocityX(-speed);
  } else if (RIGHT.isDown) {
    sprite.body.setVelocityX(speed);
  }

  // Vertical movement
  if (UP.isDown) {
    sprite.body.setVelocityY(-speed);
  } else if (DOWN.isDown) {
    sprite.body.setVelocityY(speed);
  }

  // Update the animation last and give left/right animations precedence over up/down animations
  if (LEFT.isDown) {
    sprite.anims.play("left", true);
    sprite.flipX = true;
  } else if (RIGHT.isDown) {
    sprite.anims.play("right", true);
    sprite.flipX = false;
  } else if (UP.isDown) {
    sprite.anims.play("up", true);
  } else if (DOWN.isDown) {
    sprite.anims.play("down", true);
  } else {
    sprite.anims.stop();
  }
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
