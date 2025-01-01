import {Project} from '../objects/project.js'
import {jarvis} from '../algorithms/jarvis.js'
import {genRandomPath} from '../objects/gen2d.js'
//import {Shape} from "../objects/shape.js"

const POINTS_NUM = 50
const POINTS_DELTA = 10
const POINT_PIX = 8

/**
 * Jarvis algorithm showcase project:
 *
 * Find the hull (convex border) for an random points set
 * 
 */
export class Jarvis extends Project {
	
	constructor(name, render) {
		super(name, render)
	}

	restart() {
	    //console.clear()
	    console.log('Jarvis RESTART')

	    this._render.clear()
	    this._render.width = this.DEFAULT_SCREEN_WIDTH
	    this._render.height = this.DEFAULT_SCREEN_HEIGHT

		this.points = genRandomPath(this._render.width, this._render.hight, POINTS_NUM, POINTS_DELTA)
		this._render.drawPathNodes(this.points, POINT_PIX, POINT_PIX)
	}

	play() {
		jarvis(this.points)
	}

	pause() {
		console.log('Jarvis PAUSE')
	}

	stop() {
		console.log('Jarvis STOP')
	}

	forward() {
		this.restart()
	}

	dawnward() {
		this.restart()
	}

	help() {
		console.log('Jarvis help')
	}
}