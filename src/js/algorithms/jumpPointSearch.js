/*
 * Jump Point Search - pathfinding algorithm
 * https://harablog.wordpress.com/2011/09/07/jump-point-search/
 *
 * File: jumpPointSearch.js
 * Mike Akbedyk 2024 (c)
*/

const abs = Math.abs

function normal(v) {
	if (v > 0) return 1; else if (v < 0) return -1; else return 0
}

function jumpV(parent, dx, dy, v) {
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
				if (jumpV(p, dx, 0, v)) { return p }
				if (jumpV(p, 0, dy, v)) { return p }
			}
		}
		return jumpV([x, y], dx, dy, v)
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
	for (let j = inversedPath.length - 1; j >= 0; j--) {
		path[ip] = inversedPath[j]
		ip = ip + 1
	}
	return path
}

function getPath(start_x, start_y, goal_x, goal_y) {
	if (! isXYCorrect(start_x, start_y) || ! isXYCorrect(goal_x, goal_y)) {
		console.log('pathfinder error: ! correct start X,Y =', start_x, start_y ,'goal X,Y =', goal_x, goal_y)
		return
	}
	let obstacle_start = ! isPassable(start_x, start_y)
	let obstacle_goal = ! isPassable(goal_x, goal_y)
	if (obstacle_start || obstacle_goal) {
		console.log('STOP search warning: obstacle on start =', obstacle_start, ', obstacle on goal =', obstacle_goal)
		return
	}
	let grid = JPS(start_x, start_y, goal_x, goal_y, isPassable, getDistance)

	return buildPath(grid, goal_x, goal_y)
}


// Jump Point Search algorithm (JPS)
// isPassable(x, y) // is callback function, return true, if node exist && is passable
// getDistance(x1, y1, x2, y2)
export function JPS(minx, maxx, start_x, start_y, goal_x, goal_y, isPassable, getDistance, drawMarker, setColor) {

	// grid node data:
	// grid[node_x][node_y] = [parent node x, parent node y, distance to start node]
	const grid = []
	const explored = []

	// initializing grid:
	for (let i = minx; i <= maxx; i++) {
		grid[i] = []
		explored[i] = []
	}
	grid[start_x][start_y] = [start_x, start_y, 0] // start node has no parent
	explored[start_x][start_y] = true

	setColor("blue")
	drawMarker(start_x, start_y)
	setColor("red")
	drawMarker(goal_x, goal_y)

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
		for (let i = 0; i < iedge.length; i++) {
			const edge_index = iedge[i]
			const nx = x + dxEdge(edge_index)
			const ny = y + dyEdge(edge_index)
			if (isPassable(x, y, edge_index) && ! explored[nx][ny]) {
				neighboursList.push([nx, ny])
				//setColor("yellow")
				//drawMarker(nx, ny)
				explored[nx][ny] = true
				console.log('addNewNeighbour', nx, ny)	
			}
		}
	}

	/**
	 * Search for neighbours to add them to the neighboursList in the right order
	*/
	function scanNeighbours(x, y) {
		if (goal_x == x && goal_y == y) {
			neighboursList.push([nx, ny])
			console.log('!_Neighbour goal_!', nx, ny)	
		}
		if (goal_x > x) {
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
		if (! isPassable(px, py, edgeDXDY(x - px, y - py))) return false
		if (x == goal_x && y == goal_y) return [x, y]

		//setColor("yellow")
		//drawMarker(x, y)
		explored[x][y] = true

		if (x == px) {
			if (y == py) {
				console.log('jumpPointPath error: child = parent, (x, y) = (px, px)', x, y)
				return
			}
			if (y > py) {  // jump down
				if (isPassable(x, y, 3) && (! isPassable(x + 1, y, 0) || ! isPassable(px, py, 3))) return [x, y]
				if (isPassable(x, y, 1) && (! isPassable(x - 1, y, 0) || ! isPassable(px, py, 1))) return [x, y]
			} else {  // jump up
				if (isPassable(x, y, 3) && (! isPassable(x + 1, y, 2) || ! isPassable(px, py, 3))) return [x, y]
				if (isPassable(x, y, 1) && (! isPassable(x - 1, y, 2) || ! isPassable(px, py, 1))) return [x, y]
			}
		} else {
			if (x > px) {  // jump right
				if (isPassable(x, y, 2) && (! isPassable(x, y + 1, 1) || ! isPassable(px, py, 2))) return [x, y]
				if (isPassable(x, y, 0) && (! isPassable(x, y - 1, 1) || ! isPassable(px, py, 0))) return [x, y]
			} else {  // jump left
				if (isPassable(x, y, 2) && (! isPassable(x, y + 1, 3) || ! isPassable(px, py, 2))) return [x, y]
				if (isPassable(x, y, 0) && (! isPassable(x, y - 1, 3) || ! isPassable(px, py, 0))) return [x, y]
			}
		}
		return jump([x, y], 2*x - px, 2*y - py)  // x + dx = x + (x - px) = 2*x - px
	}

	function perp(x, y) {
		const dx = start_x - goal_x
		const dy = start_y - goal_y
		if (dx == 0) return abs(start_x - x)
		if (dy == 0) return abs(start_y - y)
		// Y = F(x) koefficients a, b:   y = a * x + b
		let a1 = dy / dx
		let b1 = start_y - a1 * start_x
		let a2 = -1/a1
		let b2 = y - a2 * x
		// (x; y) = the point on the line: p1 -- p2 -->, closest to the p3 point
		let px = (b2 - b1) / (a1 - a2)
		let py = a2 * x + b2
		return (px - x)*(px - x) + (py - y)*(py - y)
	}

	let startNode = [start_x, start_y, 0, 1]  // [x, y, previous index in reached, graph index in reached]
	let open_list = [startNode,] // list of current opened nodes (points)
	let oplen = open_list.length
	let openmcount = 0

	/**
	 *  Open list is sorted from larger to smaller path distance (start point -> point (x, y)):
	 *  open_list = [[x1, y1, larger distance], ..., [xn, yn, smaller distance]]
	 */
	function open(x, y, d) {
		const len = open_list.length
		const p = [x, y, d]
		// distance p: start -> (x,y) -> goal
		let dp = d + getDistance(x, y, goal_x, goal_y)
		if (len == 0) {
			open_list[0] = p
			return 0
		}
		for (let i = len - 1; i >= 0; i--) {
			let e = open_list[i]
			// distance e: start -> (e[0],e[1]) -> goal
			let de = e[2] + getDistance(e[0], e[1], goal_x, goal_y)
			if (de >= dp) { //(perp(x, y) > perp(e[0], e[1])) {
				open_list.splice(i + 1, 0, p)
				return 1
			}
		}
		open_list.splice(0, 0, p)
		return 1
	}

	while (oplen > 0) {

		const open_node = open_list.pop()
		const onx = open_node[0]
		const ony = open_node[1]
		console.log('For point:', onx, ony)
		//graph[onx][ony] = '0'
		if (onx == goal_x && ony == goal_y) {
			console.log('GOAL IS REACHED, return')
			break
		}

		neighboursList = []
		scanNeighbours(onx, ony)
		//console.log(neighboursList)

		for (let i = 0; i < neighboursList.length; i++) {
			const neighbour = neighboursList[i]
			const nx = neighbour[0]
			const ny = neighbour[1]

			setColor("green")
			drawMarker(nx,ny)
			//console.log('Neibour point -> open_list:', nx, ny)
			const d = grid[onx][ony][2] + getDistance(onx, ony, nx, ny)
			grid[nx][ny] = [onx, ony, d] // set parent node
			openmcount = openmcount + open(nx, ny, d)

			console.log('Jump to:', nx, ny, 'from:', onx, ony)
			const jp = jump(open_node, nx, ny)
			if (jp) {
				const x = jp[0]
				const y = jp[1]
				if ((x != nx || y != ny) && (! grid[x][y])) {
					const d = grid[onx][ony][2] + getDistance(onx, ony, x, y)
					//const parent = grid[x][y]
					//if parent {
					//	if parent[0] ~= x or parent[1] ~= y && parent[2] > d {
					//		grid[x][y] = [onx, ony, d] // change parent node
					//		graph[x][y] = 'c'
					//	}
					//else
						setColor("magenta")
						drawMarker(x,y)
						//console.log('Jump point -> open_list:', x, y)
						grid[x][y] = [onx, ony, d] // set parent node
						openmcount = openmcount + open(x, y, d)
						//graph[x][y] = 'x'
					//}
				}
			}
		}
		oplen = open_list.length
		console.log('Open list:', open_list)
		console.log('open list len:', oplen, 'move count:', openmcount)
/*
		for (let i = 0; i < oplen; i++) {
			const p = open_list[i]
			console.log('#', i, ': ', p[0], p[1], p[2], ' dist = ', getDistance(p[0], p[1], goal_x, goal_y))
		}
*/
	}
	return grid
}