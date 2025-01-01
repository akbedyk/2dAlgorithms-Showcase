

/**
 * 
 * 
*/
function side(a, b, c) {
  return (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
}

/**
 * 
 * 
*/
export function jarvis(A) {
	const n = A.length
	const P = [...Array(n).keys()]

	for (let i of P) {
		if (A[P[i]][0] < A[P[0]][0]) {
			let sv = P[0]
			P[0] = P[i]
			P[i] = sv
		}
	}
	const H = [P.shift()]
	P.push(H[0])

	while (true) {
	    let right = 0
	    for (let i = 1; i < P.length; i++) {
	      if (side(A[H[-1]], A[P[right]], A[P[i]]) < 0)
	        right = i
			}
	    if (P[right] == H[0]) {
	    	break
	    } else {
	      H.push(P[right])
	      P.splice(right, 1)
	    }
	}
	return H
}