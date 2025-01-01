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

import {HMap} from './projects/HMap.js'
import {VProduct} from './projects/vProduct.js'
import {Simpl} from './projects/Simpl.js'
import {Jarvis} from './projects/Jarvis.js'
import {Graham} from './projects/Graham.js'
import {QuickHull} from './projects/QuickHull.js'
import {AStar} from './projects/AStar.js'
import {JPS} from './projects/JPS.js'

import {Render2d, Scene} from './render/render2d.js'

const ren2d = new Render2d(document.querySelector('canvas'))


// creating projects

const project_HMap = new HMap('project_HeightMap', ren2d)
const project_VProd = new VProduct('project_VProd', ren2d)
const project_Simpl = new Simpl('project_Simpl', ren2d)
const project_Jarvis = new Jarvis('project_Jarvis', ren2d)
const project_Graham = new Graham('project_Graham', ren2d)
const project_QH = new QuickHull('project_QuickHull', ren2d)
const project_AStar = new AStar('project_AStar', ren2d)
const project_JPS = new JPS('project_JumpPointSearch', ren2d)


// building projects on the "<select>" html node

let select_project = document.getElementById('select_project')
select_project.addEventListener('change', buildCurrentProject)

function buildCurrentProject() {
    switch (select_project.value) {
        case '1': 
            project_HMap.build()
            break
        case '2': 
            project_VProd.build()
            break
        case '3': 
            project_Simpl.build()
            break
        case '4': 
            project_Jarvis.build()
            break
        case '5': 
            project_Graham.build()
            break
        case '6': 
            project_QH.build()
            break
        case '7': 
            project_AStar.build()
            break
        case '8': 
            project_JPS.build()
            break
    }
}

buildCurrentProject()