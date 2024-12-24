/**
 * 
 * 
 * 
 * 
 * 
 */

/**
 * On which side of the line (x1, y1)---(x2, y2) 
 * is the point (x3,y3): left, right, or point is on the line?
 *               *p2
 *              /
 *    *p3      /   *p3
 *   side > 0 /  side < 0
 *   left    /   right
 *          /  
 *         *p1
 * 
 * if side = 0 => p3 is on the line
 * 
 * @parem number
 * @return number
 */ 
function side(x1, y1, x2, y2, x3, y3) {
	return (x2 - x1)*(y3 - y1) - (y2 - y1)*(x3 - x1)
}

/**
 *
*/
function bypass(func, shape, istart) {
	const path = shape.points
	const length = path.length
	let p, pn, pnn    // point, point next, pint next^2
	if (istart - 2 < 0) pnn = path[length + istart - 2]
	else pnn = path[istart - 2]
	if (istart - 1 < 0) pn = path[length + istart - 1]
	else pn = path[istart - 1]
	if (istart < 0) p = path[length + istart]
	else p = path[istart]
	let s = side(pnn[0], pnn[1], pn[0], pn[1], p[0], p[1])

	for (let i = istart; length - 1; i++) {
		p = path[i]
		let sn = side(pnn[0], pnn[1], pn[0], pn[1], p[0], p[1])
		if ((s*sn < 0) || !func(path, i))	
		return i
		s = sn
		p = pn
		pnn = pn
	}
}

/**
 * Copy points from array1 to array2
 * @return number, last index in array2
 */
function pCopy(a1, a2, astart, afinish, indx, d) {
	for (let i = astart; i < afinish; i++) {
		a2[indx] = Array(a1[i])
		indx += d
	}
	return indx
}

/**
 * 
 * 
 */ 
export class Shape {

	constructor(path) {
		const length = path.length
		if (length < 3) {
			console.log(path)
			throw new Error('The shape must be of 3 ponts at least!')
		}
		this._p = Array(length)		// the shape points array
		this._convex = true 		// the shape is convex or not
		this._minx = 10e9			// init minimum x of the shape
		this._maxx = 0 				// init maximum x of the shape
		this._miny = 10e9			// init minimum y of the shape.
		this._maxy = 0 				// init maximum y of the shape. 

		let imaxy, iminy
		let p = path[length - 2]
		let pn = path[length - 1]
		let pnn = path[0]
		let s = side(p, pn, pnn)

		for (let i = 0; i < length; i++) {
			if (!path[i]) {
				console.error('Shape constructor error: bad path[i]:', path[i], 'i:', i)
			}
			let pnn = path[i]
			let x = pnn[0]
			let y = pnn[1]

		// Now save the shape (x,y) mins & maxs
		// The shape width will be = (maxx - minx)
		// The shape height will be = (maxy - miny)
			if (x >= this._maxx) this._maxx = x
			else if (x <= this._minx) this._minx = x
			if (y >= this._maxy) { this._maxy = y;	imaxy = i}
			else if (x <= this._miny) { this._miny = y; iminy = i}

		// define if shape is not convex
			if (this._convex) {
				let sn = side(p[0], p[1], pn[0], pn[1], pnn[0], pnn[1])
				if (s*sn < 0) this._convex = false
				s = sn
			}
			p = pn
			pn = pnn
		}

		let d = 1
		let ifirst = iminy
		let isecond = imaxy
		if (iminy > imaxy) {
			ifirst = imaxy
			isecond = iminy
			d = -1
		}
/*
		let indx = pCopy(path, this._p, ifirst, isecond, 0, 1)
		indx = pCopy(path, this._p, 0, ifirst, indx + 1, 1)
		indx = pCopy(path, this._p, isecond, path.length, indx + 1, 1)
*/

		for (let i = length - 1; i >= 0; i--) {
			this._p[i] = path[i]
		}
		console.log('Shape constructor points:', this._p, 'initial length:', length)
	}

	get points() {
		return this._p
	}

	get length() {
		return this._p.length
	}

	get convex() {
		return this._convex
	}

	forEachNode(func) {
		for (let i = 0; i < this._p.length; i++) func(this._p[i], i)
	}

	normalize() {
		let np = []
		for (let i = 0; i < this._p.length; i++) {

		}
		return true
	}

	simplificate(st) {

	}

	/**
	 *  is the section intersects the shape
	 * @returns the section of intersect
	 */
	intersect(x1, y1, x2, y2) {
		let pn = path[path.length - 1]
		let pnn = path[path.length - 2]
		let s = side(pnn[0], pnn[1], pn[0], pn[1], path[0][0], path[0][1])

		forEachNode((p, i) => {
			let sn = side(p[0], p[1], pn[0], pn[1], pnn[0], pnn[1])
		})
	}

	/**
	 * Is the point inside the shape
	 */ 
	isInside(x, y) {
		let points = this._p
		let px
		let r = 0
		for (let i = points.length - 1; i >= 0; i--) {
			let pnx = points[i][0]
			if ((px - x)*(pnx - x) < 0) r++
			px = pnx
		}
		return r % 2
	}

	bisect() {
		let path = []
/*

		if (this._convex) {
			while () {
				pout[0], pout[1]
				pin
			}
		}
*/
		return path
	}

	sect() {

	}

	forPerimetrPoint(func) {
		func(x, y)
	}

	forAreaPoint(func) {
		func(x, y)
	}
}