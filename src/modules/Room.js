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

	generateRoom(key, map){ // prints out four random tiles
		this.clearTileMap(map);
		var tilearray = [];
		var spawn_number =4;
		for(var i=0; i<spawn_number; i++){
			var randomspot = {x : Math.floor(Math.random()*40), y : Math.floor(Math.random()*40)};
			tilearray.push(randomspot);
		}

		for(var i = 0; i<tilearray.length; i++){
			map.putTileAt(516, tilearray[i].x, tilearray[i].y);
		}

		window.localStorage.setItem(key, JSON.stringify(tilearray));
		
	}

	loadRoom(key, map){

		var room = window.localStorage.getItem(key)
		room = JSON.parse(room);
		this.clearTileMap(map);
		for(var i = 0; i<room.length; i++){
			map.putTileAt(516, room[i].x, room[i].y);
		}
	}
	clearTileMap(map){
		for(var x=0; x<40; x++){
			for(var y=0; y<40; y++){
				if(map.hasTileAt(x,y)){
					map.removeTileAt(x,y);
				}
			} 
		}
	}

}
