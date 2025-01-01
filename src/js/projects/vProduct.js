import {Project} from '../objects/project.js'

const random = Math.random
const floor = Math.floor

/**
 * ********* Functions to test *********
 *
 * fun prod_AB_AC returns AB * AC
 * fun prod_AB_BC returns AC * AB
 * 
 * 
 *              * C
 *          
 *   A *-------------* B
 * 
 *        * D
 * 
 * fun prod_ABC_ABD returns AB * AC  *  AB * AD
 */

function prod_AB_AC(a, b, c) {
	return (b[0] - a[0])*(c[1] - a[1]) - (b[1] - a[1])*(c[0] - a[0])
}

function prod_AB_BC(a, b, c) {
	return (b[0] - a[0])*(c[1] - b[1]) - (b[1] - a[1])*(c[0] - b[0])
}

function prod_ABC_ABD(a, b, c, d) {
	const dx = (b[0] - a[0])
	const dy = (b[0] - a[0])
	const abc = dx*(c[1] - a[1]) - dy*(c[0] - a[0])
	const abd = dx*(d[1] - a[1]) - dy*(d[0] - a[0])

	console.log('prod_ABC_ABD:', abc, abd, abc * abd)
	return abc * abd
}

const SCREEN_WIDTH = 800
const SCREEN_HEIGHT = 600
const OFFSET = 100
const PITCH_X = SCREEN_WIDTH - OFFSET
const PITCH_Y = SCREEN_HEIGHT - OFFSET
const POINTS_NUM = 25

/**
 * class VProduct:
 * project "Product of vectors" showcase
 * 
 */ 
export class VProduct extends Project {
	
	constructor(name, render) {
		super(name, render)
	}

	restart() {
	    console.clear()
	    console.log('VProduct RESTART')

	    this._render.clear()
	    this._render.width = SCREEN_WIDTH
	    this._render.height = SCREEN_HEIGHT

		this.a = [OFFSET, OFFSET]
		this.b = [SCREEN_WIDTH - OFFSET, SCREEN_HEIGHT - OFFSET]
		this._render.drawLine(this.a[0], this.a[1], this.b[0], this.b[1])
		this._render.strokeText('A', this.a[0], this.a[1])
		this._render.strokeText('B', this.b[0], this.b[1])
	}

	play() {
		for (var i = POINTS_NUM - 1; i >= 0; i--) {
			let x = floor(random() * PITCH_X)
			let y = floor(random() * PITCH_Y)
			this.c = [x, y]

			const s = prod_AB_BC(this.a, this.b, this.c)
			console.log(x, y, 'prod_AB_BC:', s)

			const r = 2
			this._render.setStrokeStyle('red')
			this._render.drawRect(x - r, y - r, 2*r, 2*r)
			this._render.setFont('18px Arial', 'top')
			this._render.setStrokeStyle('navy')
			this._render.strokeText(s, x, y)
		}
	}

	pause() {
		let cx = floor(random() * PITCH_X)
		let cy = floor(random() * PITCH_Y)
		let dx = floor(random() * PITCH_X)
		let dy = floor(random() * PITCH_Y)

		this._render.setStrokeStyle('black')
		this._render.drawLine(cx, cy, dx, dy)
/*
		this._render.setFont('14px Arial', 'top')
		this._render.strokeText('C', cx, cy)
		this._render.strokeText('D', dx, dy)
*/
		const s = prod_ABC_ABD(this.a, this.b, [cx, cy], [dx, dy])

		this._render.setStrokeStyle('navy')
		this._render.setFont('18px Arial', 'top')
		this._render.strokeText(s, dx, dy)
	}

	stop() {
		this.restart()
	}

	forward() {
		this.restart()
	}

	dawnward() {
		this.restart()
	}

	help() {
		console.log('VProduct help')
	}
}