const random = Math.random
const floor = Math.floor

function toArray(points) {
	return Array.from(points, (point) => [point.x, point.y])
}

function toObjArray(points) {
	return Array.from(points, (point) => ({x: point[0], y: point[1]}))
}


export function	genRandomPath(w = 100, h = 100, n = 10, delta_y = 10) {
		// set START (x, y) - END (x ,y)
		let start_x = floor(w / 10)
		let end_x = w - start_x
		let step_y = h / 2
		let end_y = step_y

		let step_x = (end_x - start_x) / n
		let y_step = (end_y - step_y) / n

		let path = Array(n)
		path[0] = [start_x, step_y]

		for (let i = 1; i < n; i++) {
			let x = start_x + step_x * i
			let y = step_y + y_step * i + delta_y * (0.5 - random())
			if (random() > 0.9) {
			 	y = y + delta_y * delta_y * (0.5 - random())
			}
			path[i] = [x, y]
		}
		return path
}

