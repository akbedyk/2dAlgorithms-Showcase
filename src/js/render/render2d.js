
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

	draw(render) {
		for(const obj of this.object) {
			obj.draw(render)
		}
	}

}

const DEFAULT_CANVAS_WIDTH = 1000
const DEFAULT_CANVAS_HEIGHT = 1000
const DEFAULT_ZOOM = 1
const DEFAULT_NODE_PIX = 10

export class Render2d {
	
	constructor(canvas, zoom = DEFAULT_ZOOM) {
		this.canvas = canvas
		this.canvas.width = DEFAULT_CANVAS_WIDTH
		this.canvas.height = DEFAULT_CANVAS_HEIGHT
		this._zoom = zoom
		//this.$.scale(zoom, zoom)
		this._config = {}

		this.$ = canvas.getContext('2d')
		//this.$.strokeRect(0, 0, canvas.width, canvas.height)
	}

	newScene() {
		return new Scene()
	}

	get zoom() {
		return this._zoom
	}

	set zoom(v) {
		this._zoom = v
		//this.$.scale(v, v)
	}

	get width() {
		return this.canvas.width
	}

	set width(v) {
		this.canvas.width = v
	}

	get height() {
		return this.canvas.height
	}

	set height(v) {
		this.canvas.height = v
	}

	get config() {
		return this._config
	}

	clear() {
		this.$.clearRect(1, 1, this.canvas.width - 1, this.canvas.height - 1)
	}

	setStrokeStyle(style) {
		this.$.strokeStyle = style
	}

	setConfig(config) {
		this._config
	}

	setFont(font, baseLineType = 'top') {
		this.$.font = font
		this.$.textBaseline = baseLineType
	}

	strokeText(text, x, y) {
		this.$.strokeText(text, x, y)
	}

	drawRect(x, y, w, h) {
		const zoom = this._zoom
		this.$.strokeRect(x, y, w * zoom, h * zoom)
	}

	drawLine(x1, y1, x2, y2) {
		const zoom = this._zoom
		this.$.beginPath()
		this.$.moveTo(x1 * zoom, y1 * zoom)
		this.$.lineTo(x2 * zoom, y2 * zoom)
		this.$.stroke()
	}

	// draw path line
	drawPath(path, locked = false) {
		const zoom = this._zoom
		let start = path[0]
		this.$.beginPath()
		this.$.moveTo(start[0] * zoom, start[1] * zoom)
		for (let i = path.length - 1; i >= 0; i--) {
			let point = path[i]
			if (point) {
				this.$.lineTo(point[0] * zoom, point[1] * zoom)
			}
		}
		if (locked) this.$.lineTo(start[0] * zoom, start[1] * zoom)
		this.$.stroke()
	}

	drawPathNodes(path, w = DEFAULT_NODE_PIX, h = DEFAULT_NODE_PIX) {
		const zoom = this._zoom
		w = w * zoom
		h = h * zoom
		for (let i = path.length - 1; i >= 0; i--) {
			let point = path[i]
			if (point) {
				this.$.strokeRect(point[0], point[1], w, h)
			}
		}
	}

	/**
	 * Save the points where the stright line cross the canvas (screen) bounds
	*/
	drawScreenLine(xc, yc, xn, yn) {
		const dx = xn - xc;
		const dy = yn - yc;
		const width = this.canvas.width
		const height = this.canvas.height
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
		const a = dy / dx
		const b = yc - a * xc
		let x1 = 0, y1 = 0
		let x2 = 0, y2 = 0
		let stage = 0
		/**
		 * Save the points where the stright line cross the canvas (screen) bounds
		*/
		function saveBoundary(x, y, vertical) {
			if (vertical) if ((y < 0) || (y > height)) return;
			else if ((x < 0) || (x > width)) return;
			if (stage == 0) {
				x1 = x
				y1 = y
				stage++
			} else if (stage == 1) {
				x2 = x
				y2 = y
				stage++
			};
		}
		// x = 0  y = b
		saveBoundary(0, b)
		// x = width   y = a * width + b
		saveBoundary(width, a * width + b)
		// x = 0  y = -b/a
		saveBoundary(0, -b/a, true)
		// x = height   y = (height - b)/a
		saveBoundary(height, (height - b)/a, true)

		this.drawLine(x1 * zoom, y1 * zoom, x2 * zoom, y2 * zoom)
	}

/*
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

				else: throw new Error('Can`t draw obj.type:', obj.type)
			}
		}
	}
*/
}

