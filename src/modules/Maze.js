export default class Maze {
    constructor(scene, camera, cellsize) {
        this.scene = scene;
        this.camera = camera;
        this.cellsize = cellsize;

        // this.rows = (this.camera.height / this.cellsize);
        // this.cols = (this.camera.width / this.cellsize);

        // CANNOT USE ABOVE AT THE MOMENT
        // In the future, for each room to load when the character is moving around, will need to reset the scene each time.
        // In order to make this workable, I would need to set the maze in the constructor of the GameScene.js file.
        // This uses the camera to grab the width and height of the game canvas - the problem is that the camera is INITIATED in the create section og Phaser,
        // so I cannot use the camera
        this.rows = 20;
        this.cols = 20;
    }

    generateGrid() {
        var grid = {};
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.cols; c++) {
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
                if (topRow < 0 || topCol < 0 || topRow > this.rows - 1 || topCol > this.cols - 1) {
                    topRow = undefined;
                    topCol = undefined;
                }

                if (rightRow < 0 || rightCol < 0 || rightRow > this.rows - 1 || rightCol > this.cols - 1) {
                    rightRow = undefined;
                    rightCol = undefined;
                }

                if (bottomRow < 0 || bottomCol < 0 || bottomRow > this.rows - 1 || bottomCol > this.cols - 1) {
                    bottomRow = undefined;
                    bottomCol = undefined;
                }

                if (leftRow < 0 || leftCol < 0 || leftRow > this.rows - 1 || leftCol > this.cols - 1) {
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

        return grid;
    }

    generateMaze(grid) {
        // Set the first variables of the stack
        var stack = {};
        stack["0|0"] = {
            index : "0|0",
            r : 0,
            c : 0,
            visited : true,
        };

        // Itterate for at LEAST the cell count
        var cellCount = this.rows * this.cols;
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

        return grid;
    }
}
