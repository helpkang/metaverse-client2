import Phaser from "phaser";

export class TileMapScene extends Phaser.Scene {
    
  private character: Phaser.Physics.Matter.Image | null = null;
  // 방향키를 감지할 키를 추가하기!
  private upKey: Phaser.Input.Keyboard.Key | null = null;
  private downKey: Phaser.Input.Keyboard.Key | null = null;
  private leftKey: Phaser.Input.Keyboard.Key | null = null;
  private rightKey: Phaser.Input.Keyboard.Key | null = null;

  private KeyCodes = Phaser.Input.Keyboard.KeyCodes;
  map?: Phaser.Tilemaps.Tilemap;
  sprite?: Phaser.GameObjects.Sprite;


  

  constructor() {
    super({ key: "main", active: true });
  }

  preload(): void {

    this.load.tilemapTiledJSON('desert', '/assets/tilemaps/maps/desert.json');
    this.load.image('tiles', '/assets/tilemaps/tiles/tmw_desert_spacing.png');
    this.load.image('car', '/assets/sprites/car90.png');
  }

  create(): void {
    // this.character = this.matter.add.image(100, 150, "character");
    // this.character.setStatic(true)
    // 사용할 키를 추가해줍니다.
    this.upKey = this.input.keyboard.addKey(this.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(this.KeyCodes.DOWN);
    this.leftKey = this.input.keyboard.addKey(this.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(this.KeyCodes.RIGHT);


    
    const platforms = this.physics.add.staticGroup();
    const desert = this.make.tilemap({key:'desert'})
  
    
    // this.map.addTilesetImage('Desert', 'tiles');
    // layer = map.createLayer('Ground');

    // layer.resizeWorld();
    this.sprite = this.add.sprite(450, 80, 'car');
  
    this.sprite.setPosition(0.5, 0.5)
    

    this.physics.enableUpdate()

    // this.cameras.getCamera().startFollow()

    // game.camera.follow(sprite);

    // cursors = game.input.keyboard.createCursorKeys();

    // game.input.onDown.add(fillTiles, this);
    



  }

  update(time: number, delta: number): void {
    if (this.character) {
      if (this.upKey?.isDown) this.character.y -= 10;
      if (this.downKey?.isDown) this.character.y += 10;
      if (this.leftKey?.isDown) this.character.x -= 10;
      if (this.rightKey?.isDown) this.character.x += 10;
    }

    // this.physics.collide(this.sprite, this.);

    // sprite.body.velocity.x = 0;
    // sprite.body.velocity.y = 0;
    // sprite.body.angularVelocity = 0;

    // if (cursors.left.isDown)
    // {
    //     sprite.body.angularVelocity = -200;
    // }
    // else if (cursors.right.isDown)
    // {
    //     sprite.body.angularVelocity = 200;
    // }

    // if (cursors.up.isDown)
    // {
    //     sprite.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(sprite.angle, 300));
    // }

  }

  destroy(): void {}
}