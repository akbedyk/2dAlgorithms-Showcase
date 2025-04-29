const abs = Math.abs

/** 
 * @param p1, p2 - the line
 * @param p3     - the point near
 * 
 * @return perpendicular length (Manhattan distance from (x3,y3) to (x,y))
 */
function perpLength(x1, y1, x2, y2, x3, y3) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	if (dx == 0) return abs(x1 - x3);
	if (dy == 0) return abs(y1 - y3);

	// Y = F(x):   y = a * x + b
	let a1 = dy / dx;
	let b1 = y1 - a1 * x1;
	let a2 = -1/a1
	let b2 = y3 - a2 * x3;

	// (x; y) = the point on the line: p1 -- p2 -->, closest to the p3 point
	let x = (b2 - b1) / (a1 - a2);
	let y = a2 * x + b2;

	return abs(x - x3) + abs(y - y3);
}

function addArrayElm(array, elm) {
	array[array.length] = Object.assign({}, elm);
}

export function simpl(path, precision) {
	const pathseq = []
	let pathlen = path.length
	let c = 0
	let pc = path[0]           // current point
	let n = 1
	let pn = path[1]           // next pont
	addArrayElm(pathseq, pc)

	for(let i = 2; i < pathlen; i++) {
		let pi = path[i];                       // index point
		let d = perpLength(pc.x, pc.y, pn.x, pn.y, pi.x,  pi.y);
		if (d > precision) {
			pc = path[i-1]
			pn = pi
			addArrayElm(pathseq, pc)
		}
	}
	addArrayElm(pathseq, path[pathlen - 1])
	return pathseq
}