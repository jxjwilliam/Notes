array.filter( function(item){
    return 'data-model_id' in item;
  }).map( function( item ){
    return { 'data-model_id' : item['data-model_id'] }
  });


var k = array.filter(function(obj){
   return Object.keys(obj).indexOf("data-model_id") > -1;
});  



//william added for timepicker css effects.
        angular.element('body').on('click', 'form a.btn.btn-link', function (evt) {
            var aNumber = $(this).attr('ng-click');
            if (/incrementHours/.test(aNumber)) {
                $(this).closest('tr').next().find('td:first>input').trigger('focus');
            }
            else if (/incrementMinutes/.test(aNumber)) {
                $(this).closest('tr').next().find('td:nth-child(3)>input').trigger('focus');
            }
            else if (/decrementHours/.test(aNumber)) {
                $(this).closest('tr').next().find('td:first').find('input').trigger('focus');
            }
            else if (/decrementMinutes/.test(aNumber)) {
                $(this).closest('tr').next().find('td:nth-child(3)').find('input').trigger('focus');
            }
            else {
                console.log('can not parse.');
            }
        });