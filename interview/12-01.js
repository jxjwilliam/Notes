var prices = [105, 101, 102, 104, 109, 110, 99, 101];

function maxProfit(prices) {
  let profit = 0;
  if (prices) {
    let minSoFar = prices[0];
        
    for (let i = 1; i < prices.length; ++i) {
      if (prices[i] < minSoFar) {
        minSoFar = prices[i]; 
      }
      
      let currentProfit = prices[i] - minSoFar;
      if (currentProfit > profit) {
        profit = currentProfit
      }
    }
  }  
  return profit;
}

console.log(maxProfit(prices));



//2.
function MyP(cb) {
    var resolve = function(msg) {
        console.log('resolve: ', msg);
    }
    var reject = function(msg) {
        console.log('reject: ', msg);
    }
    cb.call(this, resolve, reject);
}

MyP.prototype.then = function() {
    console.log('then');
    return this;
}

MyP.prototype.catch = function() {
    console.log('catch');
}

var mp = new MyP(function(resolve, reject) {
    if(true) {
        resolve({username: 'william'});
    }
    if(!false) {
        reject({error: 'something wrong'})
    }
});

mp.then().then().catch();



/////// multis(2,3,4,5,6); multis(2,3,4) all work.
function multis() {
    var args = [].slice.call(arguments);
    return args.reduce(function(a,b) {
        return a*b;
    }, 1);
};

// multiply(2)(3)(4)(5)(8)... work.
function multiply() {
    var arg = [].slice.call(arguments)[0];
    var res = arg;

    return function mul() {
        var arg1 = [].slice.call(arguments)[0];
        res = res * arg1;

        mul.toString = function() {
            return res;
        }
        return mul;
    }
}

function multiply(a) {
    var res = a;
    return function mul(b) {
        res = res * b;
        Function.prototype.toString = function() {
            return res;
        }
        return mul;
    }
}

// recursive:
function recursive(n) {
    n = parseInt(n);
    console.log(n);
    if(n <= 1) return 1;
    return n * recursive(n-1);
}