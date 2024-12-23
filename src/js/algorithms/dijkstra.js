/*
nodes:
 [[x+1, y],[x, y+1]], [[x, y-1],[x+1, y],[x, y+1],[x-1, y]], [...], [...], [[x, y+1],[x-1, y]]]
 [...]
 [...]
 [...]
 [...]
*/

var graph = []


// graph = [[index,len],[index,len],...[n]]
// graph[i][1]    // parent node
// graph[i][2]    // len to parent node
// nodes          // nodes graph
// istart         // start node index
function buildGraph(nodes, istart) {
  let free = []           // free nodes indexes
  let curr = [istart]     // current step nodes indexes
  let p                   // the parent node index
  let pnode               // parent node
  
  for (var p = 1; p < nodes.length; p++) {  // graph preparing on start
    graph[p] = [0, 10e9]                    // max dist (should be replaced below)
    free[p] = true                          // all nodes are free
  }
  if (not graph[istart]) { 
  	console.log('Error istart = %d ', istart) 
  	return {} 
  }

  graph[istart][1] = istart
  graph[istart][2] = 0

  // parent nodes & dist calculation:
  // fill graph with {closest pnode index, closest pnode distance}
  while (curr.length > 0) {
    for i = 1, curr.length {
      p = curr[i]                   // parent node index
      pnode = nodes[p]              // parent node
      if (free[p] && graph[p][1] ~= 0) {          // if pnode is free
        for (var j = 1; j < pnode.length; j++) {
          let c   = pnode[j][1]     // child node index
          let dst = pnode[j][2]     // distance [pnode //> child node]
          if (graph[p][2] + dst < graph[c][2]) {  // if pnode is the closest known one
            graph[c][1] = p                       // save pnode index on graph
            graph[c][2] = graph[p][2] + dst       // save pnode distance on graph
          }
        }
      }
    }

    for (i = 1, curr.length) {
      free[curr[i]] = false         // block top nodes
    }

    let next = []                   // next step nodes indexes array is empty
    let nextsize = 0 
    for (var i = 1, curr.length) {  // fill the step nodes
      pnode = nodes[curr[i]]
      for (var j = 1; j < pnode.length; j ++) {
        let c = pnode[j][1]         // the current node index
        let isnew = true            // new node flag
        for (var k = 1; k < next.length; k++) {      
          if (c == next[k]) {       // check the current node is the new one
         	  isnew = false 
         	  break 
          }
        }
        if (free[c] && isnew) {     // if the node is free and is the new one
          next[next.length] = c     // add current node index for next step
        }
      }
    }
    curr = next
  }
  return graph
}