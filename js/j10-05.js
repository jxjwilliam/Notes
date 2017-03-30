
function level(args) {
  var args = Array.prototype.slice.apply(arguments);
  console.log(args);
  return args.reduce(function(a,b) {
      return a+b;
  }, 0);
}


function total(arg1) {
	var sum1 = level(arguments);
  console.log('sum1:' + sum1);

  return function(arg2) {
  	var sum2 = level(arguments);
    console.log('sum2:' + sum2);

    
    return function(arg3) {
      var sum3 = level(arguments;
      console.log('sum3:' + sum3);
      
      var sum = 0;
      try {
        sum = sum1 + sum2 + sum3;
      } catch(e) {}

      console.log(sum);
      
      return sum;
    }
  }
}

