/*
 * Jump Point Search - pathfinding algorithm
 * https://harablog.wordpress.com/2011/09/07/jump-point-search/
 *
 * File: jumpPointSearch.js
 * Mike Akbedyk 2024 (c)
*/

function normal(v) {
	if (v > 0) return 1; else if (v < 0) return -1; else return 0
}

function jumpV(parent, dx, dy, graph, v) {
		let x = parent[0] + dx
		let y = parent[1] + dy
		if (! graph[x][y] == v) { return null }
		if (x == goal_x && y == goal_y) { return [x, y] }
		if (dx == 0) {
			if (dy == 0) {
				console.log('jumpPointPath error: dx, dy = 0, 0, neibour x,y =', x, y)
				return
			}
			else if ( (! graph[x+1][y]) == v && graph[x+1][y+dy] == v) return [x, y]
			else if (! graph[x-1][y] == v && graph[x-1][y+dy] == v) return [x, y]
		}
		else if (dy == 0) {
			if (! graph[x][y+1] == v && graph[x+dx][y+1] == v) return [x, y]
			else if (! graph[x][y-1] == v && graph[x+dx][y-1] == v) return [x, y]
		}	else {
			if (! graph[x-dx][y] == v && graph[x-dx][y+dy] == v) return [x, y]
			else if (! graph[x][y-dy] == v && graph[x+dx][y-dy] == v) return [x, y]
			else {
				let p = [x, y]
				if (jump(p, dx, 0, graph, v)) { return p }
				if (jump(p, 0, dy, graph, v)) { return p }
			}
		}
		return jump([x, y], dx, dy, graph, v)
}

// Jump Point Search algorithm (JPS)
// isPassable(graph, x, y) // is callback function, return true, if node exist && is passable
// getDistance(x1, y1, x2, y2)
export function JPS(graph, minx, maxx, start_x, start_y, goal_x, goal_y, isPassable, getDistance) {
/*
	let explored = []
	for (var i = 0, i < graph.maxx - 1; i++) {
		let ex = []
		for (var j = 1; j < graph.maxy; j++) {
			ex[j] = false
		}
		explored[i] = ex
	}
*/
	// grid node data:
	// grid[node_x][node_y] = [parent node x, parent node y, distance to start node]
	let grid = []

	// initializing grid:
	for (var i = minx; i <= maxx; i++) grid[i] = []
	grid[start_x][start_y] = [start_x, start_y, 0] // start node has no parent

	let neighboursList

	// if node is passable && ! explored, { add it to the list
	function addNewNeighbour(nx, ny) {
		console.log('addNewNeighbour', nx, ny)
		if ((nx >= minx) && (nx <= maxx) && ! grid[nx][ny] && isPassable(graph, nx, ny)) { //explored[nx][ny] {
			neighboursList.push([nx, ny])
		}
	}

	function scanNeighbours(x, y) {
		let dx = normal(goal_x - x)
		let dy = normal(goal_y - y)

		addNewNeighbour(x + dx, y + dy)
		if (dx == 0) {
			if (dy == 0) {
				console.log('jumpPointPath warning: REACHED GOAL NODE, return')
				return
			}
			for (var d = dy; d <= -dy; d += -dy) { 
				addNewNeighbour(x + 1, y + d)
				addNewNeighbour(x - 1, y + d)
			}
		}
		else if (dy == 0) {
			for (var d = dx; d <= -dx; d += -dx) {
				addNewNeighbour(x + d, y + 1)
				addNewNeighbour(x + d, y - 1)
			}
		}	else {
			for (var d = 0; d <= 1; d++) {
				addNewNeighbour(x + dx, y - dy*d)
				addNewNeighbour(x - dx*d, y + dy)	
			}
			addNewNeighbour(x, y - dy)
			addNewNeighbour(x - dx, y)
		}
		addNewNeighbour(x - dx, y - dy)
	}

	function jump(parent, dx, dy) {
		let x = parent[0] + dx
		let y = parent[1] + dy
		if (! isPassable(graph, x, y)) return null
		if (x == goal_x && y == goal_y) return [x, y]
		if (dx == 0) {
			if (dy == 0) {
				console.log('jumpPointPath error: dx, dy = 0, 0, neibour x,y =', x, y)
				return
			}
			else if (! isPassable(graph, x + 1, y) && isPassable(graph, x + 1, y + dy)) return [x, y]
			else if (! isPassable(graph, x - 1, y) && isPassable(graph, x - 1, y + dy)) return [x, y]
		}
		else if (dy == 0) {
			if (! isPassable(graph, x, y + 1) && isPassable(graph, x + dx, y + 1)) return [x, y]
			else if (! isPassable(graph, x, y - 1) && isPassable(graph, x + dx, y - 1)) return [x, y]
			}
		else {
			if (! isPassable(graph, x - dx, y) && isPassable(graph, x - dx, y + dy)) return [x, y]
			else if (! isPassable(graph, x, y - dy) && isPassable(graph, x + dx, y - dy)) return [x, y]
			else {
				let p = [x, y]
				if (jump(p, dx, 0)) { return p }
				if (jump(p, 0, dy)) { return p }
			}
		}
		return jump([x, y], dx, dy)
	}

	function open(list, x, y, d) {
		let mcount = 0
		let len = list.length
		let delm = d + getDistance(graph, x, y, goal_x, goal_y)
		if (len == 0) { list[0] = [x, y, d]; return mcount }
		for (var i = len - 1; i >= 0; i--) {
			let e = list[i]
			let de = e[2] + getDistance(graph, e[0], e[1], goal_x, goal_y)
			if (de >= delm) {
				for (var j = len - 1; j >= i+1; j--) {
					list[j+1] = list[j]
					mcount = mcount + 1
				}
				list[i+1] = [x, y, d]
				return mcount
			}
		}
		for (var i = len - 1; i >= 0; i--) {
			list[i+1] = list[i]
			mcount = mcount + 1
		}
		list[0] = [x, y, d]
		return mcount
	}

	let startNode = [start_x, start_y, 0, 1]  // {x, y, previous index in reached, graph index in reached}
	let openList = [startNode,] // list of current opened nodes (points)
	let openListlen = openList.length
	//explored[start_x][start_y] = true
	let openmcount = 0

	while (openListlen > 0) {
		let open_node = openList.pop()
		let onx = open_node[0]
		let ony = open_node[1]
		console.log('FOR:', onx, ony)
		//graph[onx][ony] = '0'
		if (onx == goal_x && ony == goal_y) {
			console.log('GOAL IS REACHED, return')
			break
		}

		neighboursList = []
		scanNeighbours(onx, ony)
		//console.log(neighboursList)

		for (var i = neighboursList.length - 1; i >= 0; i--) {
			let neighbour = neighboursList[i]
			let jp = jump(open_node, normal(neighbour[0] - onx), normal(neighbour[1] - ony))
			if (jp) { 
				let x = jp[0]
				let y = jp[1]
				if (! grid[x][y]) { // explored[x][y]
					let d = grid[onx][ony][3] + getDistance(graph, onx, ony, x, y)
					//let parent = grid[x][y]
					//if parent {
					//	if parent[0] ~= x or parent[1] ~= y && parent[2] > d {
					//		grid[x][y] = [onx, ony, d] // change parent node
					//		graph[x][y] = 'c'
					//	}
					//else
						grid[x][y] = [onx, ony, d] // set parent node
						openmcount = openmcount + open(openList, x, y, d)
						//explored[x][y] = true
						//graph[x][y] = 'x'
					//}
				}
			}
		}
		openListlen = openList.length
		console.log('openListlen, moveInOpenList', openListlen, openmcount)
/*
		for (var i = 0; openListlen - 1; i++) {
			let p = openList[i]
			console.log(i..': '..p[0]..', '..p[1]..' dist = '..getDistance(graph, p[0], p[1], goal_x, goal_y))
		}
*/
		//if graph.console.log { graph:console.log() }
	}
	return grid
}