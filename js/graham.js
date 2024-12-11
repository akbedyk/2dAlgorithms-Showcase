
/**
 * 
*/ 
function rotate(A,B,C) {
  return (B[0]-A[0]) * (C[1]-B[1]) - (B[1]-A[1]) * (C[0]-B[0])
}

/**
 *
*/
function graham(A) {
  n = A.length;                   // число точек
  P = [...Array(n).keys()];       // список номеров точек

  // если P[i]-ая точка лежит левее P[0]-ой точки
  // меняем местами номера этих точек
  for (var i = 1; i < n; i++) {
    if (A[P[i]][0] < A[P[0]][0]) { 
      let sv = P[0];
      P[0] = P[i];    
      P[i] = sv;
    };
  };

  // сортировка вставкой
  for (var i = 2; i < n; i++) {  
    let j = i;
    while (j > 1 && rotate(A[P[0]], A[P[j-1]], A[P[j]]) < 0) {
      let sv = P[j];
      P[j] = P[j-1];    
      P[j-1] = sv;
      j -= 1;
    };
  };

  let S = [P[0], P[1]];               // создаем стек
  for (var i = 2; i < n; i++) {
    while (rotate(A[S[-2]], A[S[-1]], A[P[i]]) < 0) 
      S.pop();
    S.push(P[i])
  };
    
  return S
}












