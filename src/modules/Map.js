
export default class Map {
    constructor(scene, maze) {
        this.scene = scene;
        this.maze = maze;
    };

    generateMap() {
        // Below is where we display the maze itself.
        for (var i in this.maze) {
            var walls = this.maze[i].walls;

            let columnX = this.maze[i].c * 40;
            let columnY = this.maze[i].r * 40;

            let image = "";
            for (var type in walls) {
                let value = walls[type];

                let string = "0";
                if (value === true) {
                    string = "1";
                }

                image += string;
            }

            let wallImg = this.scene.physics.add.image(columnX, columnY, image);
            wallImg.setOrigin(0, 0);
        }
    };
}
