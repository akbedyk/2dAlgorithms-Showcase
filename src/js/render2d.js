
export class Scene {
	constructor() {
		this.object = []
	}

	add(obj) {
		this.object.push(obj)
	}

	remove(obj) {
		this.object.remove(obj)
	}

	draw(g) {
		for(const obj of this.object) {
			obj.draw(g)
		}
	}

}

const DEFAULT_CANVAS_WIDTH = 1000
const DEFAULT_CANVAS_HEIGHT = 1000

export class Render2d {
	
	constructor(canvas) {
		this.canvas = canvas
		this.canvas.width = DEFAULT_CANVAS_WIDTH
		this.canvas.height = DEFAULT_CANVAS_HEIGHT

		this.$ = canvas.getContext('2d')
		this.$.strokeRect(0, 0, canvas.width, canvas.height)
	}

	setStrokeStyle(style) {
		this.$.strokeStyle = style
	}

	drawRect(x, y, w, h) {
		this.$.strokeRect(x, y, w, h)
	}


	drawLine(x1, y1, x2, y2) {
		this.$.beginPath()
		this.$.moveTo(x1, y1)
		this.$.lineTo(x2, y2)
		this.$.stroke()
	}

	drawPath(path) {
		// draw path line
		setStrokeStyle('black')
		let point = path[0]
		this.$.beginPath()
		this.$.moveTo(point.x, point.y)
		for (var i = 0; i < path.length; i++) {
			point = path[i]
			this.$.lineTo(point.x, point.y)
		}
		this.$.stroke()
	}

	/**
	 * Save the points where the stright line cross the canvas (screen) bounds
	*/
	drawScreenLine(xc, yc, xn, yn) {
		let dx = xn - xc;
		let dy = yn - yc;
		let width = this.canvas.width
		let height = this.canvas.height
		// Case the stright line is vertical or horizontal

		if (dx == 0) {
			if ((dy != 0) && (xc > 0) && (xc < width)) this.drawLine(xc, 0, xc, height);
			return;
		};
		if (dy == 0) {
			if ((yc > 0) && (yc < height)) this.drawLine(0, yc, width, yc);
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
			if (vertical) if ((y < 0) || (y > height)) return;
			else if ((x < 0) || (x > width)) return;
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
		// x = width   y = a * width + b
		saveBoundary(width, a * width + b);
		// x = 0  y = -b/a
		saveBoundary(0, -b/a, true);
		// x = height   y = (height - b)/a
		saveBoundary(height, (height - b)/a, true);

		this.drawLine(x1, y1, x2, y2);
	}

	draw(obj) {
		switch (obj.type) {

		}
	}

	drawAll() {
		for (obj of this.scene.getObjList()) {
			switch (obj.type) {
				case 'point':

				case 'line':

				case 'ScreenLine':

				case 'path':

				//else:					Error('Can`t draw obj.type:', obj.type)
			}
		}
	}
}

