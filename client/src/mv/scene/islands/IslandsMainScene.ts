import perlin from "../../lib/perlin";

const noise = perlin();

const speed = 1;

const tilesize = 16;
let offsetX = 0;
let offsetY = 0;

export class IslandsMainScene extends Phaser.Scene {
    
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    
    preload() {
        const base = 'assets/image/kaleidawave.github.io/islands/'
        this.load.image('Grass', base+'Grass.png');
        this.load.image('Tree1', base+'Tree1.png');
        this.load.image('Tree2', base+'Tree2.png');
        this.load.image('Tree3', base+'Tree3.png');
        this.load.image('Sea', base+'Sea.png');
        this.load.image('Boat1', base+'Boat1.png');
        this.load.image('Boat2', base+'Boat2.png');
        this.load.image('Sand', base+'Sand.png');
        noise.seed(0.12345);
        // noise.seed(Math.random());
        this.cursors = this.input.keyboard.createCursorKeys();
    }
     create() {
        this.draw(this);
    }
    
     update() {
         if(!this.cursors) return;
        if (this.cursors.left.isDown) {
            offsetX -= speed;
        } else if (this.cursors.right.isDown) {
            offsetX += speed;
        } else if (this.cursors.up.isDown) {
            offsetY -= speed;
        } else if (this.cursors.down.isDown) {
            offsetY += speed;
        } else {
            return;
        }
        this.draw(this);
    }
    
     draw(scene: Phaser.Scene) {
    
        const add: Phaser.GameObjects.GameObjectFactory = scene.add;
        const displayList: Phaser.GameObjects.DisplayList = (add as any).displayList
        displayList.removeAll();
        const {width, height} = this.cameras.default;
        for (let y = 0; y < (height / tilesize); y++) {
            const posY = (y * tilesize) + 8;
            const offsetY_Y = (y + offsetY) / 20
            for (let x = 0; x < (width / tilesize); x++) {
                const posX = (x * tilesize) + 8;
    
                let value = noise.simplex2((x + offsetX) / 20, offsetY_Y);
                if (between(value, -1, 1)) {
                    add.image(posX, posY, 'Grass') //.setAlpha(Math.abs(value + 1.5));
                } else if (between(value, 1, 1.3)) {
                    add.image(posX, posY, 'Sand');
                } else {
                    add.image(posX, posY, 'Sea') //.setAlpha(Math.abs(1 - (value / 2)));
                }
    
                if (between(value, 0.2, 0.201)) {
                    add.image(posX, posY, 'Boat1');
                } else if (between(value, 0.201, 0.2015)) {
                    add.image(posX, posY, 'Boat2');
                } else if (between(value, -1, -0.65)) {
                    const value2 = parseInt(value.toString().slice(-1));
                    if (value2 > 6) {
                        add.image(posX, posY, 'Tree1');
                    } else if (value2 > 3) {
                        add.image(posX, posY, 'Tree2');
                    } else {
                        add.image(posX, posY, 'Tree3');
                    }
    
                }
            }
        }
    }
    
}

function between(value1: number, value2: number, value3: number) {
   return (value2 < value1 && value1 < value3)
}
