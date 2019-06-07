export default class GameScene extends Phaser.Scene {
    constructor() {
        super({key : "GameScene"});
    };

    // Where we preload our images, gifs, sound file and anything else we want to load when the game first opens.
    preload() {
        this.load.image("honk", "assets/honkhonksnippet.png");
        this.load.image("white_square", "assets/white_square.png");
    };

    // Created things when the game is running.
    create() {
        // Character movement
        this.cursors = this.input.keyboard.createCursorKeys();

        this.honk = this.physics.add.sprite(50, 50, "honk");
        this.honk.setScale(0.1);
        this.honk.setCollideWorldBounds(true);

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

        let camera = this.cameras.main;

        var cellSize = 40;

        let rows = (camera.height / cellSize);
        let cols = (camera.width / cellSize);

        var grid = [];
        // 'r' represents Row, 'c' represents column
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                let topRow;
                let topCol;

                let rightRow;
                let rightCol;

                let bottomRow;
                let bottomCol;

                let leftRow;
                let leftCol;

                topRow = r;
                topCol = c - 1;

                rightRow = r + 1;
                rightCol = c;

                bottomRow = r;
                bottomCol = c + 1;

                leftRow = r - 1;
                leftCol = c;

                if (topRow < 0 || topCol < 0 || topRow > rows - 1 || topCol > cols -1) {
                    topRow = false;
                    topCol = false;
                }

                if (rightRow < 0 || rightCol < 0 || rightRow > rows - 1 || rightCol > cols -1) {
                    rightRow = false;
                    rightCol = false;
                }

                if (bottomRow < 0 || bottomCol < 0 || bottomRow > rows - 1 || bottomCol > cols -1) {
                    bottomRow = false;
                    bottomCol = false;
                }

                if (leftRow < 0 || leftCol < 0 || leftRow > rows - 1 || leftCol > cols -1) {
                    leftRow = false;
                    leftCol = false;
                }

                var cell = {
                    r : r,
                    c : c,
                    visited : false,
                    walls : {
                        top : true,
                        right : true,
                        bottom : true,
                        left : true
                    },
                    neighbours : {
                        top : {
                            r : topRow,
                            c : topCol,
                        },
                        right : {
                            r : rightRow,
                            c : rightCol,
                        },
                        bottom : {
                            r : bottomRow,
                            c : bottomCol,
                        },
                        left : {
                            r : leftRow,
                            c : leftCol,
                        },
                    },
                };



                // console.log(grid[i]);

                // console.log(top)

                // var top = this.index(c, r - 1);
                // var right = this.index(c + 1, r);
                // var bottom = this.index(c, r + 1);
                // var left = this.index(c - 1, r);

                // neighbours.push(top);
                // neighbours.push(right);
                // neighbours.push(bottom);
                // neighbours.push(left);

                grid.push(cell);
            }
        }

        var current = grid[0];
        current.visited = true;

        // for (var i = 0; i < grid.length; i++) {
        //     console.log(grid[i]);

        //     let top = grid[i].c - 1;
        //     // let right =
        //     // let bottom =
        //     // let left =

        //     neighbours.push(top);

        //     // let white_square = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "white_square");
        //     // white_square.setOrigin(0, 0);
        // }

        console.log(grid);
        // console.log(grid)

        // console.log(grid);

        // let mazeWidth = 16;
        // let mazeHeight = 16;

        // let firstTile = {
        //     visited: true,
        //     walls: {
        //         top: true,
        //         down: false,
        //         left: true,
        //         right: false
        //     }
        // };

        // let maze = [];
        // maze.push(firstTile);

        // let numVisisted = 1;

        // let mazeStack = [];
        // mazeStack.push(0, 0, "VISITED");
        // // maze[0] = true;
        // console.log(maze);
        // // console.log(mazeStack);

        // for (let i = 0; i <= (mazeHeight * mazeWidth); i++) {

        //     if (maze[i].visited = true) {
        //         console.log("hello");

        //     }
        // }
        // for (var index in maze) {

        //     for (var index2 in maze[index]) {

        //         let log = maze[index][index2];

        //         console.log(log.x);
        //     }
        // }

        // for (var section = 0; section < maze.length; section++) {
        //     console.log(maze[section].length)

        //     // for (var line = 0; line < maze[section].length; line++) {
        //     //     console.log(section[Object.values(line)]);
        //     // }
        // }
    };

    // show(cell) {
    //     var x = cell.c * this.cellSize;
    //     var y = cell.r * this.cellSize;
    //     rect(x,y,this.cellSize,this.cellSize);
    // }

    index(r, c) {

    }

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
