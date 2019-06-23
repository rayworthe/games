export default class Room {
	constructor(scene, cell) {
		this.scene = scene;
		this.cell = cell;

		this.walls = this.cell.walls;
		this.neighbours = this.cell.neighbours;
		this.row = this.cell.r;
		this.col = this.cell.c;

		this.key = this.row + "|" + this.col;

		
		
	}

	generateRoom() {
		// this will probably use one of these methods https://www.dynetisgames.com/2018/10/28/how-save-load-player-progress-localstorage/ to alter the
		// data attribute of the tilemap JSON file and save a new copy with this rooms key as the files name.

	}
}
