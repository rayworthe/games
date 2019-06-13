export default class GameScene extends Phaser.Scene {
    constructor() {
        super({key : "GameScene"});
    };

    // Where we preload our images, gifs, sound file and anything else we want to load when the game first opens.
    preload() {
        this.load.image("honk", "assets/honkhonksnippet.png");
        this.load.image("white_square", "assets/white_square.png");
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
            r : 0,
            c : 0,
            visited : true,
            walls : {
                top : true,
                right : true,
                bottom : true,
                left : true
            }
        };

        var cellCount = rows * cols;
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

            let key = Object.keys(stack).pop();

            let prevCell = grid[key];
            let nextCell = grid[nextChoiceIndex];

            // Gone down
            if (nextCell.r - prevCell.r == 1 && nextCell.c - prevCell.c == 0) {
                prevCell.walls.bottom = false;
                nextCell.walls.top = false;
            }

            // Gone right
            if (nextCell.r - prevCell.r == 0 && nextCell.c - prevCell.c == 1) {
                prevCell.walls.right = false;
                nextCell.walls.left = false;
            }

            // Gone left
            if (nextCell.r - prevCell.r == 0 && nextCell.c - prevCell.c == -1) {
                prevCell.walls.left = false;
                nextCell.walls.right = false;
            }

            // Gone up
            if (nextCell.r - prevCell.r == -1 && nextCell.c - prevCell.c == 0) {
                prevCell.walls.top = false;
                nextCell.walls.bottom = false;
            }

            stack[nextChoiceIndex] = {
                index : nextChoiceIndex,
                r : randomChoice.r,
                c : randomChoice.c,
                visited : true,
            };
            i++;
        }

        for (var i in grid) {
            var walls = grid[i].walls;

            if (walls.top == true && walls.right == false && walls.bottom == false && walls.left == false) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "1000");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == false && walls.right == true && walls.bottom == false && walls.left == false) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "0100");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == false && walls.right == false && walls.bottom == true && walls.left == false) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "0010");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == false && walls.right == false && walls.bottom == false && walls.left == true) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "0001");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == true && walls.right == true && walls.bottom == false && walls.left == false) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "1100");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == false && walls.right == true && walls.bottom == true && walls.left == false) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "0110");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == false && walls.right == false && walls.bottom == true && walls.left == true) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "0011");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == true && walls.right == false && walls.bottom == false && walls.left == true) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "1001");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == true && walls.right == true && walls.bottom == true && walls.left == false) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "1110");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == false && walls.right == true && walls.bottom == true && walls.left == true) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "0111");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == false && walls.right == false && walls.bottom == false && walls.left == false) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "0000");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == true && walls.right == true && walls.bottom == true && walls.left == true) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "1111");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == true && walls.right == true && walls.bottom == false && walls.left == true) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "1101");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == false && walls.right == true && walls.bottom == false && walls.left == true) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "0101");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == true && walls.right == false && walls.bottom == true && walls.left == false) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "1010");
                wallImg.setOrigin(0, 0);
            }

            if (walls.top == true && walls.right == false && walls.bottom == true && walls.left == true) {
                let wallImg = this.physics.add.image(grid[i].c * 40, grid[i].r * 40, "1011");
                wallImg.setOrigin(0, 0);
            }
        }
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
