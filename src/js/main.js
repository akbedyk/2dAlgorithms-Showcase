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
import {EdgesGrid} from "./objects/EdgesGrid.js"
import {JPS, buildPath} from "./algorithms/jumpPointSearch.js"

const abs = Math.abs
const random = Math.random
const floor = Math.floor

const r2d = new Render2d(document.querySelector("canvas"))
const scene = new Scene()

/*
    let startNode = [start_x, start_y, 0, 1]  // [x, y, previous index in reached, graph index in reached]
    let open_list = [startNode,] // list of current opened nodes (points)
    let oplen = open_list.length
    let openmcount = 0

    function openListContain(x,y) {
        //console.log('Check open_list for:', x, y)
        let i = 0
        for (const p of open_list) {
            i++
            //console.log('#', i, 'open_list:', p[0], p[1], p[2])
            if (p[0] == x && p[1] == y) return p
        }
    }
    if (openListContain(x,y)) console.error('JPS error. Open list inclides:', p)
*/

let egrid, grid, shape
const EDGES_NUM = 500

function restart() {
    console.clear()
    r2d.clear()
    egrid = new EdgesGrid()
    egrid.addRandomEdges(EDGES_NUM)
    scene.add(egrid)
    egrid.draw(r2d)
}

restart()


let b1 = document.getElementById("Downward").onclick = function() {
    restart()
}
let b2 = document.getElementById("Pause").onclick = function() {
    console.log('PAUSE')
}
let b3 = document.getElementById("Play").onclick = function() {
    const max = egrid.height - 1
    grid =  JPS(0, max, 0, 0, max, max,
        // isPassable
                (x, y, ie) => {
                    if((x >= 0) && (x <= max) && (y >= 0) && (y <= max)) 
                    return egrid.isEdgePassabe(x,y,ie)
                    else return false
                },
        // getDistance
                (x1, y1, x2, y2) => { 
                    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
                },
        // getCost
                (x1, y1, x2, y2) => { 
                    return abs(x2 - x1) + abs(y2 - y1)
                },
        // drawMarker
                (x,y) => { 
                    egrid.drawCellMarker(r2d,x,y)
                },
        // setColor
                (style) => { 
                    r2d.setStrokeStyle(style)
                })
    console.log('Grid:', grid)
}
let b4 = document.getElementById("Stop").onclick = function() {
    const max = egrid.height - 1
    const path = buildPath(grid, max, max,)
    console.log('Path:', path)
    if (path) {
        r2d.setStrokeStyle('blue')
        egrid.addPath(path)
        egrid.drawPaths(r2d)
    }
}
let b5 = document.getElementById("Forward").onclick = function() {
    restart()
}

let b6 = document.getElementById("Shape").onclick = function() {
    shape = new Shape(egrid.randomPath(floor(random()*5 + 3)))
    egrid.addPath(shape.points)
    egrid.drawPaths(r2d)
}