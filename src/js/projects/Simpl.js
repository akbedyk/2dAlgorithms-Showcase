import {Project} from '../objects/project.js'
import {simpl} from '../algorithms/simplification.js'
import {genRandomPath} from '../objects/gen2d.js'

const abs = Math.abs

const SCREEN_WIDTH = 1000
const SCREEN_HEIGHT = 600
const POINTS_NUM = 50
const POINTS_DELTA = 10
const PRECISION = 25

export class Simpl extends Project {
	
	constructor(name, render) {
		super(name, render)
	}

	restart() {
	    console.clear()
	    console.log('Simpl RESTART')

	    this._render.clear()
	    this._render.width = SCREEN_WIDTH
	    this._render.height = SCREEN_HEIGHT

		this._random_path = genRandomPath(SCREEN_WIDTH, SCREEN_HEIGHT, POINTS_NUM, POINTS_DELTA)
		this._render.drawPath(this._random_path)
		this._render.setStrokeStyle('blue')
		this._render.drawPathNodes(this._random_path)
	}

	play() {
		console.log('Simpl PLAY')
		const path = simpl(this._random_path, PRECISION)
		this._render.setStrokeStyle('red')
		this._render.drawPathNodes(path, 12, 12)
	}

	pause() {
		console.log('Simpl PAUSE')
	}

	stop() {
		console.log('Simpl STOP')
	}

	forward() {
		this.restart()
	}

	dawnward() {
		this.restart()
	}

	help() {
		console.log('Simpl help')
	}
}