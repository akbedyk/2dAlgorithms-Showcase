/*
 n = node
 . = connection

 n . n . n . n . n
 .   .   .   .   .
 n . n . n . n . n
 .   .   .   .   .
 n . n . n . n . n
 .   .   .   .   .
 n . n . n . n . n
 .   .   .   .   .
 n . n . n . n . n

 CX: [x, y] --- [x + 1, y] connection
 .   .   .   .
 .   .   .   .
 .   .   .   .
 .   .   .   .
 .   .   .   .

 CY: [x, y] --- [x, y + 1] connection
 .   .   .   .
 .   .   .   .
 .   .   .   .
 .   .   .   .
 .   .   .   .

*/

export class nodeList {



	
}

function rebuildCellsGrid() {
    // Узлы - ячейки, свободные грани - связи.
    // Грань свободна, если это не боковая грань и если она не перекрыта фигурой,
    // то есть имеет соединение-переход к смежной ячейке.
    // Цикл вправо и вниз, + по диагонали  
    // Если грань свободна, добавляем к ячейкам связь друг с другом.
    for (let  iy = 0; iy < GRID_Y_MAX; iy++) {
        for (let ix = 0; ix < GRID_X_MAX; ix++) {
            let c = cgrid[ix][iy]
            if (ix + 1 < GRID_X_MAX && c.edge[2].l > 0) {
                c.edge[2] = 1
                let cnext = cgrid[ix + 1][iy]
                cnext.edge[4] = 1
            }
            if (iy + 1 < GRID_Y_MAX && c.edge[3].l > 0) {
                c.edge[3] = 1
                let cnext = cgrid[ix][iy + 1]
                cnext.edge[4] = 1
            }

        }
    }
    // Цены переходов - линейное расстояние

    // Возвращаем получившийся граф. В общем виде - циклический граф.
}

function pathfinding() {
    // Лежит ли точка внутри фигуры
    // Дейкстра - поиск пути на графе


}

function addShape() {

}




// get connection. No indexes bounds checking
function getConnect(x1, y1, x2, y2) {
    if (x1 == x2) {
      if (y1 == y2) return Error
      else if (y1 > y2) return CY[x2][y2]
      else return CY[x1][y1]
    } else {
      if (x1 > x2) return CX[x2][y2]
      else return CX[x1][y1]
    }
}

export class EdgeGrid {

    constructor(cg) {
        this._cellsgrid = cg
        this.e = []
        this._e2 = []
        this._e3 = []

        for (let  ix = 0; ix < cg.width; ix++) {
            for (let  iy = 0; ix < cg.height; iy++) {
                let bit4 = 0
                if (cg.edge[i].l > 0) {
                    bit4 = bit4 | 2 ** i
                }
                this.e[ix][iy] = bit4
            }
        }
    }

    draw(r2d) {
        let w = this._cellsgrid.width
        let h = this._cellsgrid.height
        let edge_pix = this._cellsgrid.edge_size * DEFAULT_STEP_PIX

        for (let  ix = 0; ix < this._e2.length; ix++) {
            let e2column = this._e2[ix]
            for (let  iy = 0; iy < e2column.length; iy++) {
                let y = edge_pix * iy + e2column[iy].l / 2
                r2d.drawRect(edge_pix * (ix + 1) - 5, y - 5, 10, 10)
                console.log('drawRect(x,y,...):', edge_pix * (ix + 1) - 5, y - 5)
            }
        }
        for (let  ix = 0; ix < this._e3.length; ix++) {
            let e3column = this._e3[ix]
            console.log(ix, e3column)
            for (let  iy = 0; iy < e3column.length; iy++) {
                let x = edge_pix * ix + e3column[iy].l / 2
                r2d.drawRect(x - 5, edge_pix * (iy + 1) - 5, 10, 10)
                console.log('drawRect(x,y,...):', x - 5, edge_pix * (iy + 1) - 5)
            }
        }
    }

    addPath() {

    }

    delPath() {

    }

}