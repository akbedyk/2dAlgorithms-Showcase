import {Project} from '../objects/project.js'
import {graham} from '../algorithms/graham.js'
import {genRandomPath} from '../objects/gen2d.js'
//import {Shape} from "../objects/shape.js"

const POINTS_NUM = 50
const POINTS_DELTA = 10
const POINT_PIX = 8

/**
 * Graham algorithm showcase project:
 *
 * Find the hull (convex border) for an random points set
 * 
 */
export class Graham extends Project {
	
	constructor(name, render) {
		super(name, render)
	}

	restart() {
	    console.clear()
	    console.log('Graham RESTART')

	    this._render.clear()
	    this._render.width = this.DEFAULT_SCREEN_WIDTH
	    this._render.height = this.DEFAULT_SCREEN_HEIGHT

		this.points = genRandomPath(this._render.width, this._render.hight, POINTS_NUM, POINTS_DELTA)
		this._render.drawPathNodes(this.points, POINT_PIX, POINT_PIX)
	}

	play() {
		graham(this.points)
	}

	pause() {
		console.log('Graham PAUSE')
	}

	stop() {
		console.log('Graham STOP')
	}

	forward() {
		this.restart()
	}

	dawnward() {
		this.restart()
	}

	help() {
		console.log('Graham help')
	}
}