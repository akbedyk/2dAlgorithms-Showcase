import {Project} from '../objects/project.js'
import {quickHull} from "../algorithms/quickHull.js"
import {genRandomPath} from '../objects/gen2d.js'
//import {Shape} from "../objects/shape.js"

const POINTS_NUM = 50
const POINTS_DELTA = 10
const POINT_PIX = 8

/**
 * Quick Hull algorithm showcase project:
 *
 * Find the hull (convex border) for an random points set
 * 
 */
export class QuickHull extends Project {
	
	constructor(name, render) {
		super(name, render)
	}

	restart() {
	    console.clear()
	    this._render.clear()
	    this._render.width = this.DEFAULT_SCREEN_WIDTH
	    this._render.height = this.DEFAULT_SCREEN_HEIGHT

		this.points = genRandomPath(this._render.width, this._render.hight, POINTS_NUM, POINTS_DELTA)
		console.log('points:', this.points)
		this._render.drawPathNodes(this.points, POINT_PIX, POINT_PIX)
	}

	play() {
		quickHull(this.points)
	}

	pause() {
		console.log('QH PAUSE')
	}

	stop() {
		console.log('QH STOP')
	}

	forward() {
		this.restart()
	}

	dawnward() {
		this.restart()
	}
	
	help() {
		console.log('QH help')
	}

}