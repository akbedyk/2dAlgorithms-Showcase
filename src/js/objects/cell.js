export class Cell {

	constructor (x, y, z) {
		this.x = x 		// the map x-coordinate of this cell
	    this.y = y 		// the map y-coordinate of this cell
	    this.z = z 		// the map z-coordinate of this cell (not used)
		this._edge = [  // [x of the cell, y of the cell, edge index, edge length]
			[x, y, 0, DEFAULT_EDGE_SIZE],
			[x, y, 1, DEFAULT_EDGE_SIZE],
			[x, y, 2, DEFAULT_EDGE_SIZE],
			[x, y, 3, DEFAULT_EDGE_SIZE],
		]

	}

	set grid(g) {
		this._grid = g
	}

	get grid() {
		return this._grid
	}	

	cost

	toString() {
		return `Cell:{${this.x},${this.y},${this.z}}`
	}
}