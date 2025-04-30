import {Project} from '../objects/project.js'
import {EdgesGrid} from '../objects/EdgesGrid.js'
import {jumpPointSearch, buildPath} from '../algorithms/jumpPointSearch.js'

const abs = Math.abs
const random = Math.random
const floor = Math.floor

const SCREEN_WIDTH = 1000
const SCREEN_HEIGHT = 1000
const EDGES_NUM = 50

/**
 * Jump Point Search algorithm
 * 
 * 
 * 
 */ 
export class JPS extends Project {

	constructor(name, render) {
		super(name, render)
	}

	restart() {
	    console.clear()
	    this._render.clear()
	    this._render.width = SCREEN_WIDTH
	    this._render.height = SCREEN_HEIGHT

	    this._grid = null
	    this._egrid = new EdgesGrid()
	    this._egrid.addRandomEdges(EDGES_NUM)
	    this._scene.add(this._egrid)
	    this._egrid.draw(this._render)
	}

	getZcost(x1, y1, x2, y2) {
		const z = this._egrid.z
		let zcost = 0
		let pz = z[x1][y1]
		let nz
		if (x1 != x2) {
			let dx = 1
			if (x1 > x2) dx = -1
			for (let xi = x1; xi != x2; xi += dx) {
				nz = z[xi][y1]
				if (nz > pz) zcost += nz - pz
				pz = nz
			}
		} else {
			let dy = 1
			if (y1 > y2) dy = -1
			for (let yi = y1; yi != y2; yi += dy) {
				nz = z[x1][yi]
				if (nz > pz) zcost += nz - pz
				pz = nz
			}
		}
		return zcost
	}

	play() {
	    const max = this._egrid.height
	    const sx = floor(random()*max)
	    const sy = floor(random()*max)
	    const gx = floor(random()*max)
	    const gy = floor(random()*max)
	    this._grid = jumpPointSearch(0, max, sx, sy, gx, gy,
	        // isPassable
	                (x, y, ie) => {
	                    if((x >= 0) && (x <= max) && (y >= 0) && (y <= max)) 
	                    return this._egrid.isEdgePassabe(x,y,ie)
	                    else return false
	                },
	        // getDistance
	                (x1, y1, x2, y2) => { 
	                    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
	                },
	        // getCost
	                (x1, y1, x2, y2) => { 
	                    return abs(x2 - x1) + abs(y2 - y1) + 5*getZcost(x1, y1, x2, y2)
	                },
	        // drawMarker
	                (x,y) => { 
	                    this._egrid.drawCellMarker(this._render,x,y)
	                },
	        // setColor
	                (style) => { 
	                    this._render.setStrokeStyle(style)
	                })
	    console.log('Grid:', this._grid)
	}

	stop() {
	    if (! this._grid) return

	    const path = buildPath(this._grid, this._gx, this._gy)
	    console.log('Path:', path)

	    if (path) {
	        this._render.setStrokeStyle('blue')
	        this._egrid.addPath(path)
	        this._egrid.drawPaths(this._render)
	    }
	}

	forward() {
		this.restart()
	}

	dawnward() {
		this.restart()
	}

	help() {
		console.log('JPS help')
	}


/*
	shape() {
		document.getElementById('Shape').onclick = function() {
	    	this._shape = new Shape(egrid.randomPath(floor(random()*5 + 3)))
	    	this._egrid.addPath(shape.points)
	    	this._egrid.drawPaths(this._render)
		}
	}
*/
}