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
import {SimplGauss} from './projects/SimplGauss.js'
import {SimplViasvalding} from './projects/SimplViasvalding.js'
import {Jarvis} from './projects/Jarvis.js'
import {Graham} from './projects/Graham.js'
import {QuickHull} from './projects/QuickHull.js'
import {AStar} from './projects/AStar.js'
import {JPS} from './projects/JPS.js'
import {Zpaths} from './projects/Zpaths.js'

import {Render2d, Scene} from './render/render2d.js'

const ren2d = new Render2d(document.querySelector('canvas'))

// creating projects

const prj = [
    new HMap('project_HeightMap', ren2d),
    new VProduct('project_VProd', ren2d),
    new Simpl('project_Simpl', ren2d),
    new SimplGauss('project_SimplGauss', ren2d),
    new SimplViasvalding('project_SimplViasvalding', ren2d),
    new Jarvis('project_Jarvis', ren2d),
    new Graham('project_Graham', ren2d),
    new QuickHull('project_QuickHull', ren2d),
    new AStar('project_AStar', ren2d),
    new JPS('project_JumpPointSearch', ren2d),
    new Zpaths('project_Zpaths', ren2d),
]

const select_projects = document.getElementById('select_project')
select_projects.addEventListener('change', buildCurrentProject)

function buildCurrentProject() {
    prj[select_projects.value].build()
}

buildCurrentProject()