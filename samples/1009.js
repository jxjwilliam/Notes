array.filter( function(item){
    return 'data-model_id' in item;
  }).map( function( item ){
    return { 'data-model_id' : item['data-model_id'] }
  });


var k = array.filter(function(obj){
   return Object.keys(obj).indexOf("data-model_id") > -1;
});  