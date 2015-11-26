array.filter( function(item){
    return 'data-model_id' in item;
  }).map( function( item ){
    return { 'data-model_id' : item['data-model_id'] }
  });


var k = array.filter(function(obj){
   return Object.keys(obj).indexOf("data-model_id") > -1;
});  


// when person is not available and has MDA that expires on todays board at some point, MDA indicator needs to be cleared.

var activeMdaCodes = person.activeMdaCodes;
var activeMDACodeLength = 0;
var actualActiveMDACode = [];
for (var i = 0; i < activeMdaCodes.length; i++) {
	if (activeMdaCodes[i].status == "A" && activeMdaCodes[i].subType != "1L" && (activeMdaCodes[i].startDate == null ||
    	(moment(activeMdaCodes[i].startDate).diff(now, 'days') <= 0 && moment(activeMdaCodes[i].startDate).diff(now, 'minutes') <= 0))) {
  		
  		if (activeMdaCodes[i].endDate !== null &&
          (moment(activeMdaCodes[i].endDate).diff(now, 'days') <= 0 && moment(activeMdaCodes[i].endDate).diff(now, 'minutes') <= 0)) {
	        // record end date < now
	       activeMDACodeLength ++;
	    }
	  	else {
	       actualActiveMDACode.push(activeMdaCodes[i]);
	  }
	}
}

if (activeMDACodeLength === activeMdaCodes.length){clearMDA = true;}

if (person.state == states.personnel.partiallyAvailable || person.state == states.personnel.available) {
	person.state = states.personnel.unavailable;
	changed = true;
}

if(clearMda){ 
	person.activeMdaCodes = []; 
}
else {
	person.activeMdaCodes = actualActiveMDACode;
}

////////////////////

var person = $($0).data().$scope.person;
var uh = $($0).data().$scope.person.unavailabilityHistory;
var boardDate = person.date;


var all_charts = _.filter(uh, function(u) {
  return u.code === 'CHART';
});

var futures = all_charts.filter(function(chart) {
	var start = chart.start;
	return moment(start).format('YYYYMMDD').valueOf() > boardDate.valueOf();
});
/**
var futures = _.pluck(all_charts, 'start').filter(function(start) {
  return moment(boarddate).diff(start, 'days') <= 0;
});
uh.map(function(u) {
	return futures.indexOf(u.start) !== -1
});
 */


SMARTOB-8690:
{
	pushed: recentlyPushedId === item.task.assignedEquipment.equipmentId, 
	notPushed: recentlyPushedId !== item.task.assignedEquipment.equipmentId, 
	group: item.task.groupId && item.task.assignedEquipment.equipmentId, 
	notHead: item.task.partialTaskSequence !== 1 &&  item.task.assignedEquipment.equipmentId &&  !item.task.catHead, 
	dualbins : item.task.EquipObj.bins.length > 1,
	loadupdate  :item.task.binLoadUpdated =='G',
	snowupdate:item.task.binLoadUpdated=='S', 
	empty: !item.task.assignedEquipment.equipmentId, 
	assigned: item.task.assignedEquipment.equipmentId
}

/// display-board-helper-common.js
if(h.code === 'CHART') {
  if (moment(h.start).format('YYYYMMDD').valueOf() > refData.boardDate.valueOf()) {
    indicator  = '';
  } else  {
    indicator = 'C';
  }
}

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
