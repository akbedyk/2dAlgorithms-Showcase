/**********************************************************
 * === Pathfinding algorithms on 2d grid showcase ===
 * 
 * -> Jump Point pathfinding on the map with the cells grid
 * -> Dijkstra pathfinding
 * 
 * === 2d Figure algorithms showcase === 
 * 
 * -> Random 2d line simplification
 *
 * Mike Akbedyk 2024 (c)
 * ********************************************************
*/

import {Render2d} from "./render2d.js"
import {Scene} from "./render2d.js"
import {CellsGrid} from "./CellsGrid.js"
import {JPS} from "./jumpPointSearch.js"

const r2d = new Render2d(document.querySelector("canvas"))
const scene = new Scene()

const cgrid = new CellsGrid()
cgrid.random_edges_test(70)
scene.add(cgrid)
cgrid.draw(r2d)

let result = JPS(cgrid.edges, 0, cgrid.height, 0, 0, cgrid.height, cgrid.width, 
				(g,x,y) => true, 
                (g,x,y,gx,gy) => 1)

