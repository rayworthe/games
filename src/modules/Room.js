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
		// let walls = this.cell.walls;
		// let neighbours = this.cell.neighbours;
		// let row = this.cell.row;
		// let col = this.cell.col;
	}
}
