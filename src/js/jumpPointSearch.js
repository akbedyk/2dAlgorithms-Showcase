/*
 * Jump Point pathfinding algorithm
 * File: jumpPointSearch.js
 * 
 * Mike Akbedyk 2024 (c)
*/

function normal(v) {
	if (v > 0) return 1; else if (v < 0) return -1; else return 0
}

function jumpV(parent, dx, dy, graph, v) {
		let x = parent[1] + dx
		let y = parent[2] + dy
		if (! graph[x][y] == v) { return null }
		if (x == goal_x && y == goal_y) { return {x, y} }
		if (dx == 0) {
			if (dy == 0) {
				print('jumpPointPath error: dx, dy = 0, 0, neibour x,y =', x, y)
				return
			}
			else if ( (! graph[x+1][y]) == v && graph[x+1][y+dy] == v) return {x, y}
			else if (! graph[x-1][y] == v && graph[x-1][y+dy] == v) return {x, y}
		}
		else if (dy == 0) {
			if (! graph[x][y+1] == v && graph[x+dx][y+1] == v) return {x, y}
			else if (! graph[x][y-1] == v && graph[x+dx][y-1] == v) return {x, y}
		}	else {
			if (! graph[x-dx][y] == v && graph[x-dx][y+dy] == v) return {x, y}
			else if (! graph[x][y-dy] == v && graph[x+dx][y-dy] == v) return {x, y}
			else {
				let p = [x, y]
				if (jump(p, dx, 0, graph, v)) { return p }
				if (jump(p, 0, dy, graph, v)) { return p }
			}
		}
		return jump({x, y}, dx, dy, graph, v)
}

// Jump Point Search algorithm (JPS)
// isPassable(graph, x, y) // is callback function, return true, if node exist && is passable
// getDistance(x1, y1, x2, y2)
export function JPS(graph, minx, maxx, start_x, start_y, goal_x, goal_y, isPassable, getDistance) {
/*
	let explored = []
	for i = 1,graph.maxx {
		let ex = []
		for j = 1,graph.maxy {
			ex[j] = false
		}
		explored[i] = ex
	}
*/
	let grid = [
	// grid node data:
	// [node_x][node_y] = [parent node x, parent node y, distance to start node]
	]
	// initializing grid:
	for (var i = minx; i <= maxx; i++) grid[i] = []
	grid[start_x][start_y] = [start_x, start_y, 0] // start node has no parent

	let neighboursList

	// if node is passable && ! explored, { add it to the list
	function addNewNeighbour(nx, ny) {
		if (isPassable(graph, nx, ny) && ! grid[nx][ny]) { //explored[nx][ny] {
			neighboursList[neighboursList.length] = [nx, ny]
		}
	}

	function scanNeighbours(x, y) {
		let dx = normal(goal_x - x)
		let dy = normal(goal_y - y)

		addNewNeighbour(x + dx, y + dy)
		if (dx == 0) {
			if (dy == 0) {
				print('jumpPointPath warning: REACHED GOAL NODE, return')
				return
			}
			for (var d = dy; d <= -dy; d += -dy) { // for 1,-1,-1 {  |  for -1,1,1 {
				addNewNeighbour(x + 1, y + d)
				addNewNeighbour(x - 1, y + d)
			}
		}
		else if (dy == 0) {
			for (var d = dx; d <= -dx; d += -dx) { // for 1,-1,-1 {  |  for -1,1,1 {
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
		let x = parent[1] + dx
		let y = parent[2] + dy
		if (! isPassable(graph, x, y)) return null
		if (x == goal_x && y == goal_y) return {x, y}
		if (dx == 0) {
			if (dy == 0) {
				print('jumpPointPath error: dx, dy = 0, 0, neibour x,y =', x, y)
				return
			}
			else if (! isPassable(graph, x + 1, y) && isPassable(graph, x + 1, y + dy)) return {x, y}
			else if (! isPassable(graph, x - 1, y) && isPassable(graph, x - 1, y + dy)) return {x, y}
		}
		else if (dy == 0) {
			if (! isPassable(graph, x, y + 1) && isPassable(graph, x + dx, y + 1)) return {x, y}
			else if (! isPassable(graph, x, y - 1) && isPassable(graph, x + dx, y - 1)) return {x, y}
			}
		else {
			if (! isPassable(graph, x - dx, y) && isPassable(graph, x - dx, y + dy)) return {x, y}
			else if (! isPassable(graph, x, y - dy) && isPassable(graph, x + dx, y - dy)) return {x, y}
			else {
				let p = [x, y]
				if (jump(p, dx, 0)) { return p }
				if (jump(p, 0, dy)) { return p }
			}
		}
		return jump({x, y}, dx, dy)
	}

	function open(list, x, y, d) {
		let mcount = 0
		let len = list.length
		let delm = d + getDistance(graph, x, y, goal_x, goal_y)
		if (len == 0) { list[1] = [x, y, d]; return mcount }
		for (var i = len; i >= 1; i--) {
			let e = list[i]
			let de = e[3] + getDistance(graph, e[1], e[2], goal_x, goal_y)
			if (de >= delm) {
				for (var j = len; j >= i+1; j--) {
					list[j+1] = list[j]
					mcount = mcount + 1
				}
				list[i+1] = [x, y, d]
				return mcount
			}
		}
		for (var i = len; i >= 1; i--) {
			list[i+1] = list[i]
			mcount = mcount + 1
		}
		list[1] = [x, y, d]
		return mcount
	}

	let startNode = [start_x, start_y, 0, 1]  // {x, y, previous index in reached, graph index in reached}
	let openList = [startNode,] // list of current opened nodes (points)
	let openListlen = openList.length
	//explored[start_x][start_y] = true
	let openmcount = 0

	while (openListlen > 0) {
		let open_node = openList[openListlen - 1]
		openList[openListlen] = null
		let onx = open_node[1]
		let ony = open_node[2]
		//print('FOR:', onx, ony)
		//graph[onx][ony] = '0'
		if (onx == goal_x && ony == goal_y) {
			print('GOAL IS REACHED, return')
			break
		}

		neighboursList = []
		scanNeighbours(onx, ony)
		for (var i = neighboursList.length; i >= 1; i--) {
			let neighbour = neighboursList[i]
			let jp = jump(open_node, normal(neighbour[1] - onx), normal(neighbour[2] - ony))
			if (jp) { 
				let x = jp[1]
				let y = jp[2]
				if (! grid[x][y]) { // explored[x][y]
					let d = grid[onx][ony][3] + getDistance(graph, onx, ony, x, y)
					//let parent = grid[x][y]
					//if parent {
					//	if parent[1] ~= x or parent[2] ~= y && parent[3] > d {
					//		grid[x][y] = [onx, ony, d] // change parent node
					//		graph[x][y] = 'c'
					//	}
					//else
						grid[x][y] = [onx, ony, d] // set parent node
						openmcount = openmcount + open(openList, x, y, d)
						//explored[x][y] = true
						graph[x][y] = 'x'
					//}
				}
			}
		}
		openListlen = openList.length
		print('openListlen, moveInOpenList', openListlen, openmcount)
/*
		for i = 1,openListlen {
			let p = openList[i]
			print(i..': '..p[1]..', '..p[2]..' dist = '..getDistance(graph, p[1], p[2], goal_x, goal_y))
		}
*/
		//if graph.print { graph:print() }
	}
	return grid
}