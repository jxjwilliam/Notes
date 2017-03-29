function solution(A) {
    var matched = [];
    for(var i=1; i<A.length; i++) {
        var a0 = A.slice(0, i).reduce((a,b) => a+b, 0);
        var a1 = A.slice(i+1).reduce((a,b) => a+b, 0);
        if(a0 === a1) {
            matched.push(i);
        }
    } 
    return matched;
}
var ary = [-1,3,-4,5,1,-6,2,1];
var equilibrium = solution(ary);
console.log('equilibrium:', equilibrium); // [1,3,7]


///// FAILED

function decreasing(ary) {
  for(var i=0; i<ary.length-1; i++) {
    if (ary[i] < ary[i+1]) { return i; }
  }
  return i-1;
}
function increasing(ary) {
  for(var i=0; i<ary.length-1; i++) {
    if (ary[i] > ary[i+1]) { return i; }
  }
  return i-1; 
}
undefined
function solution(A) {
    // write your code in JavaScript (Node.js 6.4.0)
    var deep = [];
    
    for(var i=1;i<A.length-1;i++) {
        if(A[i] < A[i+1]) {
            var p = decreasing(A.slice(i));
            var j = increasing(A.slice(p+1));
        	deep = Math.min(A[i] - A[p], A[j]-A[p]);
        }
    }
    console.log(deep);
    if(deep.length>0) {
        return Math.max(deep);
    }
    else {   
        return -1;
    }
}
