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
		for(var i=0; i<spawn_number; i++){ 
			var randomspot = {Tile_No: Math.floor(Math.random()*639), x : Math.floor(Math.random()*40), y : Math.floor(Math.random()*40)}; 
			tilearray.push(randomspot);
		}

		this.drawTiles(tilearray, map);
		window.localStorage.setItem(key, JSON.stringify(tilearray)); // save the tilearray so that it can be used in the loadroom method if the room is ever visited again
		
	}

	loadRoom(key, map){
		this.clearTileMap(map);  
		var room = window.localStorage.getItem(key)
		room = JSON.parse(room); 
		this.drawTiles(room, map);                      // load and parse the JSON
		                      // clear tilemap 
		
	}
	drawTiles(array, map){
		for(var i = 0; i<array.length; i++){            // and place tiles at the points the room array specifies. In future the information saved will specify different types of tile as well as position
			map.putTileAt(array[i].Tile_No, array[i].x, array[i].y);  
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
