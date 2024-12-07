/**
 * *** A curve decimating algorithm ***
 * 
 * This file is for test & showcase of the algorithm of decimating on a curve Y = F(x).
 * 
 * There are basic steps:
 * 1. Draw a random path function in X|Y Axis on the canvas
 * 2. Find key points
 * 3. Delete some garbage points
 * 4. Show results, calculate %
 *
 * This is close to the Ramer–Douglas–Peucker algorithm on a curve.
 * 
 * 2024 Mintmike (c)
*/

const t = new Date();
console.log('Script start at', t.getSeconds(), 's', t.getMilliseconds(), 'ms');

const C = document.querySelector("canvas");
const $ = C.getContext("2d");
const canvas_width = 1000;
const canvas_hight = 600;

const abs = Math.abs;

let point_halth_size = 3;
let point_size = 2 * point_halth_size;

function setPointSize(size) {
	point_halth_size = size / 2;
	point_size = size;
}

$.strokeRect(0, 0,canvas_width, canvas_hight);

function setStrokeStyle(style) {
	$.strokeStyle = style;
}

function drawLine(x1, y1, x2, y2) {
	$.beginPath();
	$.moveTo(x1, y1);
	$.lineTo(x2, y2);
	$.stroke();
}

function drawPath(path) {
	// draw path line
	setStrokeStyle('black');
	let point = path[0];
	$.beginPath();
	$.moveTo(point.x, point.y);
	for (var i = 0; i < path.length; i++) {
		point = path[i];
		$.lineTo(point.x, point.y);
	}
	$.stroke();
}

/**
 * Save the points where the stright line cross the canvas (screen) bounds
*/
function drawScreenLine(xc, yc, xn, yn) {
	let dx = xn - xc;
	let dy = yn - yc;
	// Case the stright line is vertical or horizontal
	if (dx == 0) {
		if ((dy != 0) && (xc > 0) && (xc < canvas_width)) drawLine(xc, 0, xc, canvas_hight);
		return;
	};
	if (dy == 0) {
		if ((yc > 0) && (yc < canvas_hight)) drawLine(0, yc, canvas_width, yc);
		return;
	};
	// The stright line: Y = F(x) koefficients a, b:   y = a * x + b
	let a = dy / dx;
	let b = yc - a * xc;
	console.log('a, b:', a, b);
	let x1 = 0, y1 = 0;
	let x2 = 0, y2 = 0;
	let stage = 0;
	/**
	 * Save the points where the stright line cross the canvas (screen) bounds
	*/
	function saveBoundary(x, y, vertical) {
		if (vertical) if ((y < 0) || (y > canvas_hight)) return;
		else if ((x < 0) || (x > canvas_width)) return;
		if (stage == 0) {
			x1 = x;
			y1 = y;
			stage++;
		} else if (stage == 1) {
			x2 = x;
			y2 = y;
			stage++;
		};
	}
	// x = 0  y = b
	saveBoundary(0, b);
	// x = canvas_width   y = a * canvas_width + b
	saveBoundary(canvas_width, a * canvas_width + b);
	// x = 0  y = -b/a
	saveBoundary(0, -b/a, true);
	// x = canvas_hight   y = (canvas_hight - b)/a
	saveBoundary(canvas_hight, (canvas_hight - b)/a, true);

	drawLine(x1, y1, x2, y2);
}

/** 
 * Mark the path points with rects
*/
function markPathPoints(path) {
	for (var i = 0; i < path.length; i++) {
		point = path[i];
		$.strokeRect(point.x - point_halth_size, point.y - point_halth_size, point_size, point_size);
	}
}

let path_start_x = 30;
let path_end_x = canvas_width - path_start_x;
let path_start_y = canvas_hight / 2;
let path_end_y = path_start_y;

function genRandomPath(n, delta_y) {
	let x_step = (path_end_x - path_start_x) / n;
	let y_step = (path_end_y - path_start_y) / n;

	var seq = [{x: path_start_x, y: path_start_y}];

	for (var i = 1; i <= n; i++) {
		let x = path_start_x + x_step * i;
		let y = path_start_y + y_step * i + delta_y * (0.5 - Math.random());
		if (Math.random() > 0.9) {
		 	y = y + delta_y * delta_y * (0.5 - Math.random());
		};
		seq[i] = {x: x, y: y};
	}
	return seq
}

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

	// Y = F(x) koefficients a, b:   y = a * x + b
	let a1 = dy / dx;
	let b1 = y1 - a1 * x1;
	let a2 = -1/a1
	let b2 = y3 - a2 * x3;

	// (x; y) = the point on the line: p1 -- p2 -->, closest to the p3 point
	let x = (b2 - b1) / (a1 - a2);
	let y = a2 * x + b2;

	setStrokeStyle('magenta');
	drawLine(x,y,x3,y3);
	return abs(x - x3) + abs(y - y3);
}

var pathseq = [];

function addArrayElm(array, elm) {
	array[array.length] = Object.assign({}, elm);
}

function algorithm(path) {
	let pathlen = path.length;
	let c = 0;
	let pc = path[0];          // current point
	let n = 1;
	let pn = path[1];          // next pont
	addArrayElm(pathseq, pc);

	for(var i = 2; i < pathlen; i++) {
		let pi = path[i];                       // index point
		let d = perpLength(pc.x, pc.y, pn.x, pn.y, pi.x,  pi.y);
		if (d > precision) {
			pc = path[i-1];
			pn = pi;
			addArrayElm(pathseq, pc);
		};
	};
	addArrayElm(pathseq, path[pathlen - 1]);
	return true;
}

const path_1 = genRandomPath(50, 10);
drawPath(path_1);
setPointSize(6);
setStrokeStyle('blue');
markPathPoints(path_1);

var precision = 25;

console.log('Algorithm start', t.getSeconds(), 's', t.getMilliseconds(), 'ms');
algorithm(path_1);
console.log('Algorithm end', t.getSeconds(), 's', t.getMilliseconds(), 'ms');

setPointSize(12);
setStrokeStyle('red');
markPathPoints(pathseq);

console.log('Script end at', t.getSeconds(), 's', t.getMilliseconds(), 'ms');