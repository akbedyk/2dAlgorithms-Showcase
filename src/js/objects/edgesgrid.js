/**
 * 
 * 
 * 
 * 
 * 
 * 
*/
const random = Math.random
const floor = Math.floor

const DEFAULT_CELL_GRID_WIDTH = 25
const DEFAULT_CELL_GRID_HEIGHT = 25
const DEFAULT_EDGE_SIZE = 32
const DEFAULT_MARKER_SIZE = 16
const EDGE_4BIT_MASK = 0b1111        // edges mask: everyone of 4 edges is passable

export class EdgesGrid {

	/*
	CellsGrid(width, height, edge_size):
		width  : number
		height : number
		edge_size : number
		cell   : 2d array[x][y] of cells
		edg
		e   : 2d array[x][y] of 4bit edge numbers
	*/

	/*
		The cell edge index:
		0------------> X
		|      0
		|   --------
		| 1 | cell | 3
		|   --------
		|      2
		Y

		iedge:  dx dy
		-------------
		0:      0 -1
		1:     -1  0
		2:      0  1
		3:      1  0

	*/

	constructor(width, height, edge_size) {
		this._width = width || DEFAULT_CELL_GRID_WIDTH
		this._height = height || DEFAULT_CELL_GRID_HEIGHT
		this._edge_size = edge_size || DEFAULT_EDGE_SIZE

		this._cell = Array(this._width)			// 2d array[x][y] of cells objects
		this._edge = Array(this._width)			// 2d array[x][y] of edges numbers
		this._z = Array(this._width)
		this._paths = []

		// fill the cells & edges arrays
		// block bounds edges
		for (let ix = 0; ix < this._width; ix++) {
			let cc = Array(this._height)
			let ec = Array(this._height)
			let zc = Array(this._height)
			for (let iy = 0; iy < this._height; iy++) {
				let edges_4bit = 0b1111         // edge mask - all edges are passable
				// make the grid sides not passable
				if (iy == 0) edges_4bit = edges_4bit & 0b1110
				if (ix == 0) edges_4bit = edges_4bit & 0b1101
				if (iy == this._height - 1) edges_4bit = edges_4bit & 0b1011
				if (ix == this._width - 1) edges_4bit = edges_4bit & 0b0111
				ec[iy] = edges_4bit
				zc[iy] = 0
				// build cells objects	cc[iy] = new Cell(ix, iy, 0)
			}
			this._edge[ix] = ec			// save edges numbers column
			this._z[ix] = zc 			// save z-coordinates column
			this._cell[ix] = cc			// save cells objects column
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

	get z() {
		return this._z
	}	

	forEachElement(array2d, func) {
		for (let ix = 0; ix < this._width; ix++) {
			let column = array2d[ix]
			for (let iy = 0; iy < this._height; iy++) {
				func(column[iy], ix, iy)
			}
		}
	}

	isEdgePassabe(x, y, edge_index) {
		return Boolean(this._edge[x][y] & (1 << edge_index))
	}

	delEdge(x, y, edge_index) {
		if ((x < 1) || (y < 1) || (x > this.width - 2) || (y > this.height - 2)) {
			Error('delEdge: (x, y) out of bounds: (' + x + ', ' + y + ')')
		}
		switch (edge_index) {
			case 0: 
				this._edge[x][y] &= 0b1110
				this._edge[x][y-1] &= 0b1011
			case 1: 
				this._edge[x][y] &= 0b1101
				this._edge[x-1][y] &= 0b0111
			case 2: 
				this._edge[x][y] &= 0b1011
				this._edge[x][y+1] &= 0b1110
			case 3: 
				this._edge[x][y] &= 0b0111
				this._edge[x+1][y] &= 0b1101
		}
	}

	releaseEdges(x, y) {
		if ((x < 1) || (y < 1) || (x > this.width - 2) || (y > this.height - 2)) {
			Error('releaseEdges: (x, y) out of bounds: (' + x + ', ' + y + ')')
		}
		this._edge[x][y] = EDGE_4BIT_MASK
	}

	blockEdges(x, y) {
		if ((x < 1) || (y < 1) || (x > this.width - 2) || (y > this.height - 2)) {
			Error('blockEdges: (x, y) out of bounds: (' + x + ', ' + y + ')')
		}
		this._edge[x][y] = 0
	}

	addRandomEdges(density) {
		const d = floor(density / 2)
		for (let i = d; i > 0; i--) {
			let x = floor(random() * this.width)
			let y = floor(random() * this.height)
			if (x != this.width - 1) {
				this._edge[x][y] &= 0b0111
				this._edge[x+1][y] &= 0b1101
			}
		}
		for (let i = d; i > 0; i--) {
			let x = floor(random() * this.width)
			let y = floor(random() * this.height)
			if (y != this.height - 1) {
				this._edge[x][y] &= 0b1011
				this._edge[x][y+1] &= 0b1110
			}
		}

		/*
		for (let i = d; i > 0; i--) {
			let x = floor(random() * this.width)
			let y = floor(random() * this.height)
			this._edge[x][y] &= 0b1011
		}
		for (let i = d; i > 0; i--) {
			let x = floor(random() * this.width)
			let y = floor(random() * this.height)
			this._edge[x][y] &= 0b0111
		}
		for (let i = d; i > 0; i--) {
			let x = floor(random() * this.width)
			let y = floor(random() * this.height)
			this._edge[x][y] &= 0b1110
		}
		*/
	}

	randomPath(n) {

		const path = Array(n)
		console.log('randomPath: path.length', path.length)
		const w = this.width
		const h = this.height
		
		const grid = Array(w)
		for (let ix = grid.length - 1; ix >= 0; ix--) {
			grid[ix] = Array(h)
		}

		const tmax = 1000
		let x = floor(random() * w)
		let y = floor(random() * h)

		for (let i = path.length - 1; i >= 0; i--) {
			let t = 0
			while (grid[x][y] && t <= tmax) {
				x = floor(random() * w)
				y = floor(random() * h)
				t++
			}
			console.log('randomPath: add the point', [x,y])
			path[i] = [x,y]
			grid[x][y] = true
		}
		console.log('Path:', path)
		return path
	}

	randomShape() {
		x = floor(random() * w)
		y = floor(random() * h)

	}

	addPath(path) {
		this._paths.push(path)
	}

	popPath() {
		return this._paths.pop()	
	}

	drawCells(r2d) {
		// calculate the edge lengths in pixels
		const esize = this._edge_size
		// draw vertical edges
		for (let ix = 0; ix < this._width; ix++) {
			const x = esize * ix
			r2d.drawLine(x, 0, x, esize * this._height)
		}
		// draw horizontal edges
		for (let iy = 0; iy < this._height; iy++) {
			const y = esize * iy
			r2d.drawLine(0, y, esize * this._width, y)
		}
	}

	drawEdges(r2d) {
		const esize = this._edge_size
		this.forEachElement(this._edge, (e, x, y) => {
			if (! this.isEdgePassabe(x, y, 3) && (x <= this._width)) {
				r2d.drawLine((x + 1)*esize, y*esize, (x+1)*esize, (y+1)*esize)
			}
			if (! this.isEdgePassabe(x, y, 2) && (y <= this._height)) {
				r2d.drawLine(x*esize, (y+1)*esize, (x+1)*esize, (y+1)*esize)
			}
		})
	}

	drawPaths(r2d) {
		const esize = this._edge_size
		for (let path of this._paths) {
			let pn = path[path.length - 1]
			for (let i = path.length - 1; i > 0; i--) {
				let p = path[i-1]
				if (p) {
					r2d.drawLine((pn[0]+0.5)*esize, (pn[1]+0.5)*esize, 
						(p[0]+0.5)*esize, (p[1]+0.5)*esize)
					pn = p
				}
			}
		}
	}

	drawCellMarker(r2d, x, y) {
		const esize = this._edge_size
		const hms = floor(DEFAULT_MARKER_SIZE / 2)			// half marker size
		r2d.drawRect((x+0.5)*esize - hms, (y+0.5)*esize - hms, DEFAULT_MARKER_SIZE, DEFAULT_MARKER_SIZE)
	}

	draw(r2d) {
		r2d.setStrokeStyle('gray')
		this.drawCells(r2d)

		r2d.setStrokeStyle('black')
		this.drawEdges(r2d)

		r2d.setStrokeStyle('blue')
		this.drawPaths(r2d)
	}

	toString() {
		return `CellGrid(width, height, edge_size): ${this.width}, ${this.height}, ${this.edge_size}`
	}
}




















