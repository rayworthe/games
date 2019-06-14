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

        // GRID CREATION STARTS BELOW

        // Get an instance of the camera, set in the index.js file
        let camera = this.cameras.main;

        // Set the size of each cell for the grid
        var cellSize = 40;

        // Get the row / col count, using the dimensions of the canvas
        let rows = (camera.height / cellSize);
        let cols = (camera.width / cellSize);

        /*
         'r' represents Row, 'c' represents Column
         Grid creation below - for the time being, just want to initiate the grid - logic below these loops sets walls etc
        */
        var grid = {};
        var stack = {};
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

                /*
                 This makes sure that we dont allow for any false coordinates
                 (eg - if we are at 0,0, there are only two possible neighbours, we cant have a row / col coordinate of -1 - they doesn't exist)
                */
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

                // Cell in grid
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

                // Set a key for each coordinate - we could just use the c and r in the object, but I find it easier this way ;)
                grid[r + "|" + c] = cell;
            }
        }

        // Set the first variables of the stack
        var stack = {};
        stack["0|0"] = {
            index : "0|0",
            r : 0,
            c : 0,
            visited : true,
        };

        // Itterate for at LEAST the cell count
        var cellCount = rows * cols;
        for (var i = 0; i < cellCount;) {
            var stackKeys = Object.keys(stack);
            // get last index form stack, so that we have an index to use
            var stackLastIndex = stackKeys.slice(-1)[0];

            var neighbours = grid[stackLastIndex]["neighbours"];

            // Get the available neighbours that we can actually move to next.
            var choices = [];
            for (var type in neighbours) {
                let values = neighbours[type];

                // Make sure that the next choice exists, isnt off the grid
                if (values.r === undefined || values.c === undefined) {
                    continue;
                }

                // Make sure new choice hasn't been visited
                let key = values.r + "|" + values.c;
                if (grid[key].visited) {
                    continue;
                }

                // Add valid choices to array
                choices.push(values);
            }

            // If there are available choices, pop the last entry of the stack (backtrack), and then start the loop again, to try and find available choices
            if (!choices.length) {
                let key = Object.keys(stack).pop();
                delete stack[key];
                continue;
            }

            // Get random index of one of the available neighbours
            let randomIndex = Math.floor(Math.random() * choices.length);

            // Grab the random choice from the available neighbours, using the random index
            let randomChoice = choices[randomIndex];

            // Grab the Row and Col coordinates from the random choice
            let nextChoiceIndex = randomChoice.r + "|" + randomChoice.c;

            // Set the grid cell at the coordinates in the itteration as visited
            grid[nextChoiceIndex].visited = true;

            // Get the key of the PREVIOUS stack coordinates, so we can determine which direction the algorithm has chosen to travel
            let key = Object.keys(stack).pop();

            // Set the previous cell the algorithm was at, before it went to the next cell - also set the next cell
            let prevCell = grid[key];
            let nextCell = grid[nextChoiceIndex];

            // Below determines which way the algorithm went - there may be many more ways to do this - this is just one. ( and probably many more better ways )

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

            // Add next choice to stack, to set the next comparison
            stack[nextChoiceIndex] = {
                index : nextChoiceIndex,
                r : randomChoice.r,
                c : randomChoice.c,
                visited : true,
            };

            // We only incriment if the grid cell has been visited, since the algorithm needs to run as long as all cells haven't been visited
            i++;
        }

        // Below is where we display the maze itself.
        for (var i in grid) {
            var walls = grid[i].walls;

            let columnX = grid[i].c * 40;
            let columnY = grid[i].r * 40;

            let image = "";
            for (var type in walls) {
                let value = walls[type];

                let string = "0";
                if (value === true) {
                    string = "1";
                }

                image += string;
            }

            let wallImg = this.physics.add.image(columnX, columnY, image);
            wallImg.setOrigin(0, 0);
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
