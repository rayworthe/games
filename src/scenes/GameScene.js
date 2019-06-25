import Maze from "../modules/Maze";
import Map from "../modules/Map";
import Room from "../modules/Room";
// var imported = document.createElement('script');
// imported.src = 'cycle.js';
// document.head.appendChild(imported);
//import Room from "../modules/Player";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({key : "GameScene"});
        this.key = null;
        this.room = null;
        this.neighboursRooms = null;
        this.x = null;
        this.y = null;

        // Get an instance of the camera, set in the index.js file - CANNOT BE DONE IN CONSTRUCTOR
        //this.camera = this.cameras.main;

        // Cmaera cant be used, instead below is set to null. More info in Maze.js.
        // this.maze = new Maze(this, camera, 40);

        // Set to string means nothing
        var maze_string = window.localStorage.getItem("maze");
        if(maze_string == null){
            this.maze = new Maze(this,"camera",40);
            this.grid = this.maze.generateGrid();
            this.newMaze = this.maze.generateMaze(this.grid); // in future the maze can also be saved using the same method
            window.localStorage.setItem("maze", JSON.stringify(this.newMaze));
        }
        else{
            var loadedmaze = JSON.parse(maze_string);
            this.newMaze = loadedmaze;
        }

        //this.player = new Player(this);
        this.map = null;
        this.visitedrooms = null;
        //console.log(this.visitedrooms);
        var visitedrooms_string = window.localStorage.getItem("visited"); // load the JSON string that represents visited rooms
        if(visitedrooms_string!=null){                                    // if there isn't one then there is no string to parse
            this.visitedrooms = JSON.parse(visitedrooms_string);          // parse the string to turn it into an object within the program
        }
        //console.log(visitedrooms_string);
        if(this.visitedrooms == null){
            this.visitedrooms = [];
        }
    };

    // Where we preload our images, gifs, sound file and anything else we want to load when the game first opens.
    preload() {
        this.load.image("honk", "assets/honkhonksnippet.png");
        this.load.image("white_square", "assets/white_square.png");

        this.load.image("vertical", "assets/verticalCollision.png");
        this.load.image("horizontal", "assets/horizontalCollision.png");

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

        this.load.image("tilesetimage", "assets/fantasy_tiles.png");//, {frameWidth : 20, frameHeight : 20});
        //this.load.tilemapTiledJSON("map", "assets/0_0.json");
        this.load.tilemapTiledJSON("template", "assets/template.json");
        //var parsed = JSON.parse("map");
        //window.localStorage.setItem("0|0", string);
    };

    // Created things when the game is running.
    create() {
        
        

        this.map = this.make.tilemap({ key: 'template' }); // a completely blank tilemap

        var tiles = this.map.addTilesetImage('tileset', 'tilesetimage');
        this.dynamicmap = this.map.createDynamicLayer(0, tiles, 0, 0);    // a dynamic layer is used to make adding and removing tiles at runtime easier


        this.cursors = this.input.keyboard.createCursorKeys();

        this.doublePresses = [];

        this.playerBaseSpeed = 300;

        var arrowKeys = {
            "up" : this.cursors.up,
            "left" : this.cursors.left,
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

        /*
         Key will be changed, depending on the character movement.
         If the character goes to the right side of the screen (as long as the wall is empty) and wants to travel to the next room,
         then we set the new key to be the new neighbour coordinate of the cell, to the right - (new coordinates depend on which direction the character moves)
         and restart the scene. When the game if first opened, change from null, to the first maze key - always "0|0".
         Will be done in the 'update()'
        */

        if (this.key == null) {
            this.key = "0|0";
        }
        this.screenBounds = this.physics.add.staticGroup();
        this.setRoom(this.key);
        this.x = 400;
        this.y = 400;
        this.honk = this.physics.add.sprite(this.x, this.y, "honk");
        this.honk.setScale(0.1);
        this.honk.setCollideWorldBounds(true);
        //player.createPlayer();
        this.physics.add.collider(this.honk, this.screenBounds);
    };
    
    update() {
        this.honk.setVelocity(0);

        // bottom of screen
        if (this.honk.y > 765) {
            let newRow = this.room.row + 1;
            let col = this.room.col;
            this.key = newRow + "|" + col;
            this.setRoom(this.key)
            this.setHonkPos(this.honk.x,45);
        }

        // top of screen
        if (this.honk.y < 40) {
            let newRow = this.room.row - 1;
            let col = this.room.col;
            this.key = newRow + "|" + col;
            this.setRoom(this.key);
            this.setHonkPos(this.honk.x,760);
        }

        // right of screen
        if (this.honk.x > 750) {
            let row = this.room.row;
            let newCol = this.room.col + 1;
            this.key = row + "|" + newCol;
            this.setRoom(this.key);
            this.setHonkPos(55, this.honk.y);
        }

        // left of screen
        if (this.honk.x < 50) {
            let row = this.room.row;
            let newCol = this.room.col - 1;
            this.key = row + "|" + newCol;
            this.setRoom(this.key);
            this.setHonkPos(745,this.honk.y);
        }
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

    setRoom(incomingkey){
        this.screenBounds.clear(true, true);
        this.room = new Room(this, this.newMaze[incomingkey]);
        this.neighboursRooms = this.neighbours(this.room, this.newMaze);

        var currentRoomWalls = this.room.walls;
        if (currentRoomWalls.bottom == true) {
            this.screenBounds.create(800, 800, "horizontal");
        }

        if (currentRoomWalls.left == true) {
            this.screenBounds.create(0, 800, "vertical");
        }

        if (currentRoomWalls.right == true) {
            this.screenBounds.create(800, 800, "vertical");
        }

        if (currentRoomWalls.top == true) {
            this.screenBounds.create(0, 0, "horizontal");
        }
        
        var bool = true;

        for(var x=0; x<this.visitedrooms.length; x++){ // set "bool" to false if the room you're transitioning to has been visited
            if(this.key == this.visitedrooms[x] ){
                bool = false;                        
                break;
            }

        }
        if(bool){                                                    // if it hasn't been visited then generate a new room and save its key to the "visited" JSON
            this.room.generateRoom(this.key, this.dynamicmap);
            this.visitedrooms.push(this.key);
            window.localStorage.setItem("visited", JSON.stringify(this.visitedrooms));
        }
        else{                                                        // or else load the room from localData

            this.room.loadRoom(this.key, this.dynamicmap);
        }
        
        
    }

    setHonkPos(x,y){
        this.honk.x = x;
        this.honk.y = y;
    }

    neighbours(room, maze) {
        var neighboursRooms = [];
        for (var i in room.neighbours) {
            let neighboursRow = room.neighbours[i].r;
            let neighboursCol = room.neighbours[i].c;

            if (neighboursRow || neighboursCol) {
                var neighboursRoom = new Room(this, maze[neighboursRow + "|" + neighboursCol]);
                neighboursRooms.push(neighboursRoom);
            }
        }
        return neighboursRooms;
    }

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
