/**********************************************************
 * === Pathfinding algorithms on 2d grid showcase ===
 * 
 * -> Jump Point pathfinding on the map with the cells grid
 * -> Dijkstra pathfinding
 * 
 * === 2d shape algorithms showcase === 
 * 
 * -> Random 2d line simplification
 * -> Jarvis alg for a shape 
 * -> Graham alg for a shape 
 * -> Shape simplification alg
 * -> Shape normailze, fill points,  sect
 * -> Intersect of 
 * -> Is point inside shape alg
 * 
 * === Others 2d algorithms ===
 * 
 * A curve decimating (simplification) algorithm
 *
 * Mike Akbedyk 2024 (c)
 * ********************************************************
*/

import {Render2d, Scene} from "./render2d.js"
import {Shape} from "./objects/shape.js"
import {CellsGrid} from "./objects/CellsGrid.js"
import {JPS, buildPath} from "./algorithms/jumpPointSearch.js"

const abs = Math.abs
const random = Math.random
const floor = Math.floor

const r2d = new Render2d(document.querySelector("canvas"))
const scene = new Scene()


let cgrid, grid, shape

function restart() {
    r2d.clear()
    cgrid = new CellsGrid()
    cgrid.addRandomEdges(500)
    scene.add(cgrid)
    cgrid.draw(r2d)
}

restart()


let b1 = document.getElementById("Downward").onclick = function() {
    restart()
}
let b2 = document.getElementById("Pause").onclick = function() {
    console.log('PAUSE')
}
let b3 = document.getElementById("Play").onclick = function() {
    const max = cgrid.height - 1
    grid =   JPS(0, max, 0, 0, max, max,
                (x,y,ie) => { if((x>=0)&&(x<=max)&&(y>=0)&&(y<=max)) return cgrid.isEdgePassabe(x,y,ie); else return false}, 
                (x,y,gx,gy) => 
                //{ return abs(gx - x) + abs(gy - y)},
                { return Math.sqrt((gx-x)*(gx-x) + (gy-y)*(gy-y))},
                (x,y) => { cgrid.drawCellMarker(r2d,x,y)},
                (style) => { r2d.setStrokeStyle(style)},
                )
    console.log('Grid:', grid)
}
let b4 = document.getElementById("Stop").onclick = function() {
    const max = cgrid.height - 1
    const path = buildPath(grid, max, max,)
    console.log('Path:', path)
    if (path) {
        r2d.setStrokeStyle('blue')
        cgrid.addPath(path)
        cgrid.drawPaths(r2d)
    }
}
let b5 = document.getElementById("Forward").onclick = function() {
    restart()
}

let b6 = document.getElementById("Shape").onclick = function() {
    shape = new Shape(cgrid.randomPath(floor(random()*5 + 3)))
    cgrid.addPath(shape.points)
    cgrid.drawPaths(r2d)
}