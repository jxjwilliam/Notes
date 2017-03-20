
[{id:1},{id:2},{id:3},{id:4}].findIndex(obj => obj.id == 3)


var elementPos = array.map(function(x) {return x.id; }).indexOf(idYourAreLookingFor);
var objectFound = array[elementPos];

//If you want to remove element at position x, use:
someArray.splice(x,1);


return this.activeAgents
	.filter(f => {
		return f.displayStatus === status;
	})
	.map(m => {
		return m[this.StatesMap[status]];
	})
	.reduce((sum, n) => {
		return sum + n;
	}, 0);


git commit -m"  workforce.server.js update to async writeFile: when the csv/xlsx is written, then send response. so olam no need to use setTimeout."


site-header.js:
-----------------
this.acs.DTMFText = null;
// this will stop kazoo and run endCall
this.acs.cancelCall();
this.userStateClient.update('available').then(res => {
	console.log('after call, userStatus should be set available:', JSON.stringify(res));
});
return false;

------------------

OLAM: BA-435-userStatus-change-call

CHAIM: development

GPS: development


