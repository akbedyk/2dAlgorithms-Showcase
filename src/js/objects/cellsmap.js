
function normal(v) {
	if (v > 0) return 1
	if (v < 0) return -1
	return v
}

export class CellsMap {

	constructor() {

	}

	pathCost(x, y, gx, gy) {
		const dx = normal(gx - x)
		const dy = normal(gy - y)
		let cost = 0

		if (dy == 0) {
			if (dx == 0) {
				console.error('CellsMpap.pathCost error. Null dx, null dy:', dx, dy)
				return -1
			}
			if (gx > x)	
				for (let cx = x + 1; cx < gx; cx++) cost += this._cell[cx][y].cost(1,3)
			else 
				for (let cx = x - 1; cx > gx; cx--) cost += this._cell[cx][y].cost(3,1)
		} else {
			if (gy > y) 
				for (let cy = y + 1; cy < gy; cy++) cost += this._cell[x][cy].cost(0,2)
			else 
				for (let cy = y - 1; cy > gy; cy--) cost += this._cell[x][cy].cost(2,0)
		}
		return cost
	}

	addToPath(path, x, y) {
		const pl = path.last()
		path.add(x, y, this.pathCost(pl.x, pl.y, x - pl.x, y - pl.y))
	}


}