var webmdAry = Object.keys(window).filter(function(wk) {
   return /^s_/.test(wk) === true
});


var webmdAry = Object.keys(window).forEach(function(wk, index) {
   if(/^s_/.test(wk)) {
      webmdAry.push(wk);
   };
});
