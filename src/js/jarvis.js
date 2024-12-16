

/**
 * 
 * 
*/
function rotate(A,B,C) {
  return (B[0]-A[0]) * (C[1]-B[1]) - (B[1]-A[1]) * (C[0]-B[0])
}

/**
 * 
 * 
*/
function jarvis(A) {
	let n = A.length;
	let P = [...Array(n).keys()];

	for (var i of P) {
		if (A[P[i]][0] < A[P[0]][0]) {
			let sv = P[0];
			P[0] = P[i];
			P[i] = sv;
		};
	}
	H = [P.shift()];
	P.push(H[0]);
	while (true) {
	    let right = 0;
	    for (var i = 1; i < P.length; i++) {
	      if (rotate(A[H[-1]], A[P[right]], A[P[i]]) < 0)
	        right = i;
			};
	    if (P[right] == H[0]) {
	    	break;
	    } else {
	      H.push(P[right]);
	      del P[right];
	    };
	}
	return H
}
