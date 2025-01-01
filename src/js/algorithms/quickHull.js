/*
Quick Hull Algorithm
*/

const random = Math.random
const floor = Math.floor

/**
 * On which side of vector(x1,y1)->(x2,y2) is the point(x3,y3):
 * result > 0	lefthand
 * result < 0	lefthand
 * result = 0	is on the line
 
function side(x1, y1, x2, y2, x3, y3) {
	return (x2 - x1)*(y3 - y1) - (y2 - y1)*(x3 - x1)
}
*/

function side(i1, i2, i3) {
	const p1 = path[i1]
	const p2 = path[i2]
	const p3 = path[i3]
	return (p2[0] - p1[0])*(p3[1] - p1[1]) - (p2[1] - p1[1])*(p3[0] - p1[0])
}


/** 
 * Copy index of points located only to the lefthand from line p1---p2
 */
function copyLeft(pindx, p1, p2) {
	let l = pindx.length
	let left = Array(2)
	left[0] = p1
	left[1] = p2
	//let l = 2
	
	for (let ip = 0; ip < l; ip++) {
		let p3 = pindx[ip]
		if ((p3[0] !== p1[0] || p3[1] !== p1[1]) && 
			(p3[0] !== p2[0] || p3[1] !== p2[1]))	// p3 != p1 && p3 != p2
			if (side(p1, p2, p3) < 0) 
				//left[l++] = p3
				left[left.l] = p3
	}
	return left
}

function initHull(pindx, hull) {
	let l = pindx.length
	
	// determine index of points p1, p2 with minimal and maximal x coordinate:
	let ip1 = 0	
	let ip2 = 0
	for (let i = 1; i < l; i++) {
		if (path[pindx[i]][0] < pindx[ip1][0]) ip1 = i // minimum x
		if (pindx[i][0] > pindx[ip2][0]) ip2 = i // maximum x
	}
	hull[ip1] = true
	hull[ip2] = true
	return [ip1, ip2]
}


function pivotize(pindx, hull) {
	/* length >=3 is assumed
	 * as pivot, select the point in points[]-{p1,p2} with maximal
	 * cross_prod( pivot-p1, p2-p1 )
	 */
	const l = pindx.length
	const p1 = pindx[0] 
	const p2 = pindx[1]
	let pivotpos = 2
	let maxcross = cross(pindx[2], p1, p2)

	// sequential maximization
	for (let i = 3; i < l; i++) {
		let newcross = cross(pindx[i], p1, p2);
		if (newcross > maxcross) {
			maxcross = newcross
			pivotpos = i
		}
	}
	return pindx[pivotpos]
}

function qh(pindx, hull) {
	/* DC step: select pivot point from points */
	const l = pindx.length
	const p1 = pindx[0]
	const p2 = pindx[1]

	/* DC step: select any pivot point from points.
		 We have p1 == points[0], p2 == points[1] */
	if (l == 2) return;

	if (l == 3) { 
		// one point (beyond old p1,p2) must belong to hull
		hull[2] = true  // saves a recursive call
		return
	}

	const pivot = pivotize(pindx)

	hull[pivot] = true

	const left1 = copyLeft(pindx, p1, pivot)
	console.log('Left1:', left1)
	qh(left1)

	const left2 = copyLeft(pindx, pivot, p2)
	console.log('Left2:', left2)
	qh(left2)
}

export function quickHull(path) {
	const l = path.length
	const hull = Array(l)
	const pindx = Array(l)

	for (let ip = 0; ip < l; ip++) {
		pindx[ip] = ip
		hull[ip] = false
	}

	const ret = initHull(pindx)
	const minx = ret[0]
	const maxx = ret[1]

	/*	Split original set of points indexes into:
	 *	- upper[] (all nodes left of (p1 - p2), including p1, p2
	 *	- lower[] (all points right of (p1 - p2), including p1, p2
	*/

	const upper = copyLeft(pindx, minx, maxx)
	const lower = copyLeft(pindx, maxx, minx)

	console.log('Upper:')
	qh(upper)
	console.log('Lower:')
	qh(lower)

	return 1
}

const path = [
	[1,10],[5,5],[6,4],[3,14],[6,9],[6,3],[4,2],[2,5]
]

/*
quickHull(path)
print(path)
*/




/**
 * Check if the path itersects himself:
 * - no: return 0
 * - yes: return 1
 *  
 * @return number
 */ 
function checkSelfIntersection(path) {
	const l = path.length
	if (l < 4) return 0
	let flag = 0

	for (let i = 0; i < l; i++) {
		if (side(path[i], path[j], path[k]) < 0) return 1
	}
	if (flag != 0) return 1
	else return 0
}


/**
 * Check if the path shape is:
 * - line: return 0
 * - convex: return 1
 * - concave: return 2
 *  
 * @return number
 */ 
function checkConvex(path) {
	const l = path.length
	if (l < 3) return 0
	let flag = 0

	for (let i = 0; i < l; i++) {
		let j = i + 1
		let k = i + 2
		if (k >= l) {
			k -= l
			if (j >= l) j -= l
		}
		let s = side(path[i], path[j], path[k])
		if (s < 0) flag |= 1
		else if (s > 0)	flag |= 2
		if (flag == 3) return 2
	}
	if (flag != 0) return 1
	else return 0
}

//print('isConvex path:', checkConvex(path))