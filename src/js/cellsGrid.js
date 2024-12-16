import {Render2d} from "./render2d.js"

const DEFAULT_CELL_GRID_WIDTH = 25;
const DEFAULT_CELL_GRID_HIGHT = 25;
const DEFAULT_EDGE_SIZE = 32;
const DEFAULT_STEP_PIX = 1;


export default class Cell {

	constructor (x, y, z) {
		this.x = x 		// om map x-coordinate of this cell
	    this.y = y 		// om map y-coordinate of this cell
	    this.z = z 		// om map z-coordinate of this cell (not used)
		this._edge = [  // [x of the cell, y of the cell, edge index, edge length]
			[x, y, 0, DEFAULT_EDGE_SIZE],
			[x, y, 1, DEFAULT_EDGE_SIZE],
			[x, y, 2, DEFAULT_EDGE_SIZE],
			[x, y, 3, DEFAULT_EDGE_SIZE],
		]
	}

	toString() {
		return `Cell:{${this.x},${this.y},${this.z}}`
	}
}


export class CellsGrid {

	/*
	CellsGrid(width, height, edge_size):
		width  : number
		height : number
		edge_size : number
		cell   : 2d array[x][y] of cells
		edge   : 2d array[x][y] of 4bit edge numbers
	*/

	constructor(width, height, edge_size) {
		this._width = width || DEFAULT_CELL_GRID_WIDTH
		this._height = height || DEFAULT_CELL_GRID_HIGHT
		this._edge_size = edge_size || DEFAULT_EDGE_SIZE

		this._cell = Array(this._width)			// 2d array[x][y] of cells objects
		this._edge = Array(this._width)			// 2d array[x][y] of edges numbers

		// fill arrays with cells & edges
		for (var ix = 0; ix < this._width; ix++) {
			let cc = Array(this._height)
			let ec = Array(this._height)
			for (var iy = 0; iy < this._height; iy++) {
				// build cells objects
				cc[iy] = new Cell(ix, iy, 0)
				// build edges numbers
				let edges_4bit = 0b1111
				if (iy == 0) edges_4bit = edges_4bit & 0b1110
				if (ix == this._width - 1) edges_4bit = edges_4bit & 0b1101
				if (iy == this._height - 1) edges_4bit = edges_4bit & 0b1011
				if (ix == 0) edges_4bit = edges_4bit & 0b0111
				ec[iy] = edges_4bit
			}
			this._cell[ix] = cc			// save cells objects column
			this._edge[ix] = ec			// save edges numbers column
		}
	}

	get width() {
		return this._width
	}

	get height() {
		return this._height
	}

	get edge_size() {
		return this._edge_size
	}

	get cells() {
		return this._cell
	}

	get edges() {
		return this._edge
	}

	forEachElement(array2d, func) {
		for (var ix = 0; ix < this._width; ix++) {
			let column = array2d[ix]
			for (var iy = 0; iy < this._height; iy++) {
				func(column[iy], ix, iy)
			}
		}
	}

	isEdgePassabe(x, y, edge_index) {
		return Boolean(this._edge[x][y] & (1 << edge_index))
	}

	edges_test() {
		this.forEachElement(this._edge, (e, x, y) => {
			let e1 = (e & 1 << 0) >> 0
			let e2 = (e & 1 << 1) >> 1
			let e3 = (e & 1 << 2) >> 2
			let e4 = (e & 1 << 3) >> 3
			console.log(x, y, 'edges pass:', e1, e2, e3, e4,
				'isEdgePassabe:',
				this.isEdgePassabe(x, y, 0),
				this.isEdgePassabe(x, y, 1),
				this.isEdgePassabe(x, y, 2),
				this.isEdgePassabe(x, y, 3))
			return 0
		})
	}

	delEdge(x, y, edge_index) {
		if ((x < 1) || (y < 1) || (x > this.width - 2) || (y > this.hight - 2)) {
			Error('delEdge: (x, y) out of bounds: (' + x + ', ' + y + ')')
		}
		switch (edge_index) {
			case 0: 
				this._edge[x][y] &= 0b1110
				this._edge[x+1][y] &= 0b0111
			case 1: 
				this._edge[x][y] &= 0b1110
				this._edge[x+1][y] &= 0b0111
			case 2: 
				this._edge[x][y] &= 0b1101
				this._edge[x+1][y] &= 0b0111
			case 3: 
				this._edge[x][y] &= 0b1110
				this._edge[x+1][y] &= 0b0111
		}
	}

	random_edges_test(density) {
		let d = density || 100
		for (var i = d; i > 0; i--) {
			let x = Math.floor(Math.random() * this.width)
			let y = Math.floor(Math.random() * this.height)
			if (x != this.width - 1) {
				this._edge[x][y] &= 0b1101
				this._edge[x+1][y] &= 0b0111
			}
		}
		/*
		for (var i = d; i > 0; i--) {
			let x = Math.floor(Math.random() * this.width)
			let y = Math.floor(Math.random() * this.height)
			this._edge[x][y] &= 0b1011
		}
		for (var i = d; i > 0; i--) {
			let x = Math.floor(Math.random() * this.width)
			let y = Math.floor(Math.random() * this.height)
			this._edge[x][y] &= 0b0111
		}
		for (var i = d; i > 0; i--) {
			let x = Math.floor(Math.random() * this.width)
			let y = Math.floor(Math.random() * this.height)
			this._edge[x][y] &= 0b1110
		}
		*/
	}


	drawCells(r2d) {
		// calculate the edge lengths in pixels
		let edge_pix = this._edge_size * DEFAULT_STEP_PIX
		let size_x = edge_pix * this._width
		let size_y = edge_pix * this._height

		// draw vertical edges
		for (var ix = 0; ix < this._width; ix++) {
			let x = edge_pix * ix
			r2d.drawLine(x, 0, x, size_y)
		}
		// draw horizontal edges
		for (var iy = 0; iy < this._height; iy++) {
			let y = edge_pix * iy
			r2d.drawLine(0, y, size_x, y)
		}
	}


	drawEdges(r2d) {
		let edge_pix = this._edge_size * DEFAULT_STEP_PIX
		
		this.forEachElement(this._edge, (e, x, y) => {

				if (this.isEdgePassabe(x, y, 0)) {
					if (this.isEdgePassabe(x, y, 1)) {
						r2d.drawLine((x + 1)*edge_pix, (y+0.5)*edge_pix, (x+0.5)*edge_pix, y*edge_pix)
					}
					if (this.isEdgePassabe(x, y, 3)) {
						r2d.drawLine(x*edge_pix, (y+0.5)*edge_pix, (x+0.5)*edge_pix, y*edge_pix)	
					}
				}
				if (this.isEdgePassabe(x, y, 2)) {
					if (this.isEdgePassabe(x, y, 1)) {
						r2d.drawLine((x + 1)*edge_pix, (y+0.5)*edge_pix, (x+0.5)*edge_pix, (y+1)*edge_pix)
					}
					if (this.isEdgePassabe(x, y, 3)) {
						r2d.drawLine(x*edge_pix, (y+0.5)*edge_pix, (x+0.5)*edge_pix, (y+1)*edge_pix)	
					}
				}
		})
	}

	drawPaths(r2d) {

	}

	draw(r2d) {

		r2d.setStrokeStyle('gray')
		this.drawCells(r2d)

		r2d.setStrokeStyle('green')
		this.drawEdges(r2d)

		r2d.setStrokeStyle('blue')
		this.drawPaths(r2d)
	}

	toString() {
		return `CellGrid(width, height, edge_size): ${this.width}, ${this.height}, ${this.edge_size}`
	}
}




















