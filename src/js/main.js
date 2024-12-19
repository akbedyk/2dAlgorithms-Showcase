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
import {JPS, buildPath} from "./jumpPointSearch.js"

const abs = Math.abs
const r2d = new Render2d(document.querySelector("canvas"))
const scene = new Scene()

const cgrid = new CellsGrid()
cgrid.addRandomEdges(70)
scene.add(cgrid)
cgrid.draw(r2d)



const max = cgrid.height - 1
const grid = JPS(cgrid.edges, 0, max, 0, 0, max, max, 
				(g,x,y,ie) => { if((x>=0)&&(x<=max)&&(y>=0)&&(y<=max)) return cgrid.isEdgePassabe(x,y,ie); else return 0}, 
                (g,x,y,gx,gy) => { return abs(gx - x) + abs(gy - y)},
                (x,y) => { cgrid.drawCellMarker(r2d,x,y)},
                (style) => { r2d.setStrokeStyle(style)},
                )


console.log(grid)
const path = buildPath(grid, max, max,)
console.log('Path:', path)
if (path) {
    r2d.setStrokeStyle('blue')
    cgrid.addPath(path)
    cgrid.drawPaths(r2d)
}