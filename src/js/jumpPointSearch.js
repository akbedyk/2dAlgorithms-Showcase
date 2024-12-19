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
				if (jumpV(p, dx, 0, graph, v)) { return p }
				if (jumpV(p, 0, dy, graph, v)) { return p }
			}
		}
		return jumpV([x, y], dx, dy, graph, v)
}


export function buildPath(grid, goal_x, goal_y, inversed) {
	if (! grid) {
		console.log('pathfinder error: bad grid for buildPathByGrid')
		return []
	}
	console.log('buildPath:', grid)
	let inversedPath = [[goal_x, goal_y]]
	let i = 1
	let gx = grid[goal_x]
	if (! gx) {
		console.log('buildPath: NO PATH or goal_x is out of bounds:', goal_x)
		return
	}
	let p = gx[goal_y]
	if (! p) {
		console.log('buildPath: NO PATH or goal_y is out of bounds:', goal_y)
		return
	}
	while (p[0] != 0 && p[1] != 0 && p[2] > 0) {
		console.log('buildPathByGrid:', p[0], p[1], p[2])
		i = i + 1
		inversedPath[i] = [p[0], p[1]]
		if (! grid[p[1]]) 
			console.log('bad grid[x][]', p[0], p[1])
		else if (! grid[p[0]][p[1]]) { 
			console.log('bad grid[x][y]', p[0], p[1])
		}
		p = grid[p[0]][p[1]]
	}
	if (inversed) return inversedPath

	let path = []
	let ip = 0
	for (var j = inversedPath.length - 1; j >= 0; j--) {
		path[ip] = inversedPath[j]
		ip = ip + 1
	}
	return path
}

function getPath(start_x, start_y, goal_x, goal_y) {
	if (! isXYCorrect(self.graph, start_x, start_y) || ! isXYCorrect(self.graph, goal_x, goal_y)) {
		console.log('pathfinder error: ! correct start X,Y =', start_x, start_y ,'goal X,Y =', goal_x, goal_y)
		return
	}
	let obstacle_start = ! isPassable(self.graph, start_x, start_y)
	let obstacle_goal = ! isPassable(self.graph, goal_x, goal_y)
	if (obstacle_start || obstacle_goal) {
		console.log('STOP search warning: obstacle on start =', obstacle_start, ', obstacle on goal =', obstacle_goal)
		return
	}
	let grid = JPS(self.graph, start_x, start_y, goal_x, goal_y, isPassable, getDistance)

	return buildPath(grid, goal_x, goal_y)
}


// Jump Point Search algorithm (JPS)
// isPassable(graph, x, y) // is callback function, return true, if node exist && is passable
// getDistance(x1, y1, x2, y2)
export function JPS(graph, minx, maxx, start_x, start_y, goal_x, goal_y, isPassable, getDistance, drawMarker, setColor) {

	// grid node data:
	// grid[node_x][node_y] = [parent node x, parent node y, distance to start node]
	let grid = []

	// initializing grid:
	for (var i = minx; i <= maxx; i++) grid[i] = []
	grid[start_x][start_y] = [start_x, start_y, 0] // start node has no parent

	setColor("blue")
	drawMarker(start_x, start_y)
	setColor("red")
	drawMarker(goal_x, goal_y)

/*
	function addNewNeighbour(nx, ny, iedge) {
		console.log('addNewNeighbour', nx, ny)
		if ((nx >= minx) && (nx <= maxx) && ! grid[nx][ny] && isPassable(graph, nx, ny, iedge)) {
			neighboursList.push([nx, ny])
		}
	}

	function scanNeighbours(x, y) {
		const dx = normal(goal_x - x)
		const dy = normal(goal_y - y)

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
*/

	/*
		The cell edge index:
		0------------> X
		|      0
		|   --------
		| 1 | cell | 3
		|   --------
		|      2
		Y

		iedge:  dx dy
		-------------
		0:      0 -1
		1:     -1  0
		2:      0  1
		3:      1  0

	*/
	function edgeDXDY(dx,dy) { if (~dx) if (~dy) if (dx > 0) return 3; else return 2; else return 0; else return 1}
	function dxEdge(iedge) { if (iedge == 1) return -1; else return iedge % 2}
	function dyEdge(iedge) { if (iedge == 0) return -1; else return (iedge + 1) % 2}

	let neighboursList

	/**
	 *  if the node is passable and not explored, add it to the list of neighbours
	*/
	function addNeighbours(x, y, iedge) {
		for (var i = 0; i < iedge.length; i++) {
			const edge_index = iedge[i]
			const nx = x + dxEdge(edge_index)
			const ny = y + dyEdge(edge_index)
			if (isPassable(graph, x, y, edge_index) && ! grid[nx][ny]) {
				neighboursList.push([nx, ny])
				console.log('addNewNeighbour', nx, ny)	
			}
		}
	}

	/**
	 * Search for neighbours to add them to the neighboursList in the right order
	*/
	function scanNeighbours(x, y) {
		if (goal_x >= x) {
			if (goal_y >= y) {
				if (goal_x - x >= goal_y - y) addNeighbours(x, y, [3,2,0,1])
				else addNeighbours(x, y, [2,3,1,0])
			} else {
				if (goal_x - x >= y - goal_y) addNeighbours(x, y, [3,0,2,1])
				else addNeighbours(x, y, [0,3,1,2])
			}
		} else {
			if (goal_y >= y) {
				if (x - goal_x >= goal_y - y) addNeighbours(x, y, [1,2,0,3])
				else addNeighbours(x, y, [2,1,3,0])
			} else {
				if (x - goal_x >= y - goal_y) addNeighbours(x, y, [1,0,2,3])
				else addNeighbours(x, y, [0,1,2,3])
			}
		}
	}

	function jump(parent, x, y) {
		let px = parent[0]
		let py = parent[1]
		if (! isPassable(graph, px, py, edgeDXDY(x - px, y - py))) return false
		if (x == goal_x && y == goal_y) return [x, y]
		if (x == px) {
			if (y == py) {
				console.log('jumpPointPath error: child = parent, (x, y) = (px, px)', x, y)
				return
			}
			if (y >= py) {
				if (! isPassable(graph, x + 1, y, 0) && isPassable(graph, x, y, 3)) return [x, y]
				if (! isPassable(graph, x - 1, y, 0) && isPassable(graph, x, y, 1)) return [x, y]
			} else {
				if (! isPassable(graph, x + 1, y, 2) && isPassable(graph, x, y, 3)) return [x, y]
				if (! isPassable(graph, x - 1, y, 2) && isPassable(graph, x, y, 1)) return [x, y]
			}
		} else {
			if (x >= px) {
				if (! isPassable(graph, x, y + 1, 1) && isPassable(graph, x, y, 2)) return [x, y]
				if (! isPassable(graph, x, y - 1, 1) && isPassable(graph, x, y, 0)) return [x, y]
			} else {
				if (! isPassable(graph, x, y + 1, 3) && isPassable(graph, x, y, 2)) return [x, y]
				if (! isPassable(graph, x, y - 1, 3) && isPassable(graph, x, y, 0)) return [x, y]
			}
		}
		return jump([x, y], 2*x - px, 2*y - py)
	}

	function open(list, x, y, d) {
		let mcount = 0
		let len = list.length
		let delm = d + getDistance(graph, x, y, goal_x, goal_y)
		if (len == 0) { list[0] = [x, y, d]; return mcount }
		for (var i = len - 1; i >= 0; i--) {
			let e = list[i]
			let de = e[2] + getDistance(graph, e[0], e[1], goal_x, goal_y)
			if (de >= delm) {			// if elm dist > point dist
				for (var j = len - 1; j >= i+1; j--) {
					list[j+1] = list[j]
					mcount = mcount + 1
				}
				list[i+1] = [x, y, d]	// paste point in open list
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

		setColor("green")
		for (var i = 0; i < neighboursList.length; i++) {
			let neighbour = neighboursList[i]
			console.log('Jump to:', neighbour[0], neighbour[1], 'from:', onx, ony)
			let jp = jump(open_node, neighbour[0], neighbour[1])
			if (jp) {
				let x = jp[0]
				let y = jp[1]
				if (! grid[x][y]) {
					drawMarker(x,y)
					let d = grid[onx][ony][2] + getDistance(graph, onx, ony, x, y)
					//let parent = grid[x][y]
					//if parent {
					//	if parent[0] ~= x or parent[1] ~= y && parent[2] > d {
					//		grid[x][y] = [onx, ony, d] // change parent node
					//		graph[x][y] = 'c'
					//	}
					//else
						grid[x][y] = [onx, ony, d] // set parent node
						openmcount = openmcount + open(openList, x, y, d)
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
	}
	return grid
}