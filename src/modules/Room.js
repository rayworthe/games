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

	generateRoom(key, map){
		this.clearTileMap(map); // delete all tiles from the tilemap
		var tilearray = [];
		var spawn_number =4;
		for(var i=0; i<spawn_number; i++){ // just as a simple example, generate four random coordinates and push to the tilearray
			var randomspot = {x : Math.floor(Math.random()*40), y : Math.floor(Math.random()*40)}; 
			tilearray.push(randomspot);
		}

		for(var i = 0; i<tilearray.length; i++){  // draw a tile to each of the random points generated - in this simple example just one type of tyle, number 516
			map.putTileAt(516, tilearray[i].x, tilearray[i].y);
		}

		window.localStorage.setItem(key, JSON.stringify(tilearray)); // save the tilearray so that it can be used in the loadroom method if the room is ever visited again
		
	}

	loadRoom(key, map){

		var room = window.localStorage.getItem(key)
		room = JSON.parse(room);                       // load and parse the JSON
		this.clearTileMap(map);                        // clear tilemap 
		for(var i = 0; i<room.length; i++){            // and place tiles at the points the room array specifies. In future the information saved will specify different types of tile as well as position
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
