import Maze from "../modules/Maze";
import Map from "../modules/Map";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({key : "GameScene"});
    };

    // Where we preload our images, gifs, sound file and anything else we want to load when the game first opens.
    preload() {
        this.load.image("honk", "assets/honkhonksnippet.png");
        this.load.image("white_square", "assets/white_square.png");

        /*
         Images below represent walls, 0 = false, 1 = true.
         In order of naming convention - TOP - RIGHT - BOTTOM - LEFT
         0000 = false, false, false, false - a white sqaure with no walls.
         1111 = true, true, true, true - a white square with all walls.
         1010 = true, false, true, false - a white sqaure with a top wall, and a bottom wall.
        */
        this.load.image("0000", "assets/0000.png");
        this.load.image("0001", "assets/0001.png");
        this.load.image("0010", "assets/0010.png");
        this.load.image("0011", "assets/0011.png");
        this.load.image("0100", "assets/0100.png");
        this.load.image("0101", "assets/0101.png");
        this.load.image("0110", "assets/0110.png");
        this.load.image("0111", "assets/0111.png");
        this.load.image("1000", "assets/1000.png");
        this.load.image("1001", "assets/1001.png");
        this.load.image("1010", "assets/1010.png");
        this.load.image("1011", "assets/1011.png");
        this.load.image("1100", "assets/1100.png");
        this.load.image("1101", "assets/1101.png");
        this.load.image("1110", "assets/1110.png");
        this.load.image("1111", "assets/1111.png");
    };

    // Created things when the game is running.
    create() {
        this.honk = this.physics.add.sprite(50, 50, "honk");

        // Character movement
        this.cursors = this.input.keyboard.createCursorKeys();

        this.doublePresses = [];

        this.playerBaseSpeed = 300;

        var arrowKeys = {
            "left" : this.cursors.left,
            "up" : this.cursors.up,
            "right" : this.cursors.right,
            "down" : this.cursors.down
        };

        // Used for speeding up the game character
        const arrowKeyVals = Object.values(arrowKeys);
        for (const key of arrowKeyVals) {
            this.doublePress(key, 500, () => {
                this.playerBaseSpeed = 600;
            }, () => {
                this.playerBaseSpeed = 300;
            });
        }

        // Get an instance of the camera, set in the index.js file
        let camera = this.cameras.main;

        let maze = new Maze(this, camera, 40);
        let grid = maze.generateGrid();
        let newMaze = maze.generateMaze(grid);

        let map = new Map(this, newMaze);

        map.generateMap();
    };

    update() {
        this.honk.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.honk.setVelocityX(this.playerBaseSpeed * -1);
        } else if (this.cursors.right.isDown) {
            this.honk.setVelocityX(this.playerBaseSpeed);
        }

        if (this.cursors.up.isDown) {
            this.honk.setVelocityY(this.playerBaseSpeed * -1);
        } else if (this.cursors.down.isDown) {
            this.honk.setVelocityY(this.playerBaseSpeed);
        }
    };

    doublePress(cursorKey, delay, pressCallback, resetCallback) {
        cursorKey.on("down", (event) => {
            let now = new Date().getTime();
            if (this.doublePresses[cursorKey.keyCode]) {
                let difference = now - this.doublePresses[cursorKey.keyCode];
                if (difference < delay) {
                    pressCallback();
                }
            }

            this.doublePresses[cursorKey.keyCode] = now;
        });
        cursorKey.on("up", () => {
            resetCallback();
        });
    }
}
