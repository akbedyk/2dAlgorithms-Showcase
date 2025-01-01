import {Project} from '../objects/project.js'
import {EdgesGrid} from '../objects/EdgesGrid.js'

const SCREEN_WIDTH = 1000
const SCREEN_HEIGHT = 1000
const EDGES_NUM = 50

/**
 *
 */
export class AStar extends Project {
	
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

	play() {
		console.log('AStar PLAY')
	}

	pause() {
		console.log('AStar PAUSE')
	}

	stop() {
		console.log('AStar STOP')
	}

	forward() {
		this.restart()
	}

	dawnward() {
		this.restart()
	}

	help() {
		console.log('AStar help')
	}
}