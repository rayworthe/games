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

        var grid = {};
        var stack = {};
        // 'r' represents Row, 'c' represents Column
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                let topRow = r;
                let topCol = c - 1;

                let rightRow = r + 1;
                let rightCol = c;

                let bottomRow = r;
                let bottomCol = c + 1;

                let leftRow = r - 1;
                let leftCol = c;

                if (topRow < 0 || topCol < 0 || topRow > rows - 1 || topCol > cols - 1) {
                    topRow = undefined;
                    topCol = undefined;
                }

                if (rightRow < 0 || rightCol < 0 || rightRow > rows - 1 || rightCol > cols - 1) {
                    rightRow = undefined;
                    rightCol = undefined;
                }

                if (bottomRow < 0 || bottomCol < 0 || bottomRow > rows - 1 || bottomCol > cols - 1) {
                    bottomRow = undefined;
                    bottomCol = undefined;
                }

                if (leftRow < 0 || leftCol < 0 || leftRow > rows - 1 || leftCol > cols - 1) {
                    leftRow = undefined;
                    leftCol = undefined;
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
                    neighbours: {
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
                    }
                };

                grid[r + "|" + c] = cell;
            }
        }

        var stack = {};
        stack["0|0"] = {
            index : "0|0",
            visited : true,
            walls : {
                top : true,
                right : true,
                bottom : true,
                left : true
            }
        };

        var cellCount = rows * cols;
        console.log(cellCount)
        for (var i = 0; i < cellCount;) {
            var stackKeys = Object.keys(stack);
            // get last index form stack, so that we have a current index to use
            var stackLastIndex = stackKeys.slice(-1)[0];

            var neighbours = grid[stackLastIndex]["neighbours"];

            var choices = [];
            for (var type in neighbours) {
                let values = neighbours[type];

                if (values.r === undefined || values.c === undefined) {
                    continue;
                }

                let key = values.r + "|" + values.c;
                if (grid[key].visited) {
                    continue;
                }

                choices.push(values);
            }

            if (!choices.length) {
                let key = Object.keys(stack).pop();
                delete stack[key];
                continue;
            }

            let randomIndex = Math.floor(Math.random() * choices.length);
            let randomChoice = choices[randomIndex];
            let nextChoiceIndex = randomChoice.r + "|" + randomChoice.c;

            grid[nextChoiceIndex].visited = true;

            stack[nextChoiceIndex] = {
                index : nextChoiceIndex,
                visited : true,
                walls : {
                    top : true,
                    right : true,
                    bottom : true,
                    left : true
                }
            };
            i++;
        }

        // FOR TESTING - the grid count for visisted must be the same as the total grid cell count.
        var length = 0;
        for (var i in grid) {
            if (grid[i].visited == true) {
                length ++;
            }
        }
        console.log(length);

        for (var i in grid) {
            if (grid[i].visited) {
                let white_square = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "white_square");
                white_square.setOrigin(0, 0);
            }
        }

    };

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
