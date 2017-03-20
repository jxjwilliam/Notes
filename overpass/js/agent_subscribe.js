// from olam -> campaign-monitor-agents->subscribe():

let statusNameSpace = 'campaign.monitor1.' + params.envPk.replace(/^.*::/, '');
this.gpsInterface.subscribe(statusNameSpace, {
	resolve: (data) => {
		console.log('william8:', JSON.stringify(data));
		try {
			let userId = data.args[0];
			let ss = data.args[1][0];
			let activeStatus = {
				'inreview': 'inReviewTime',
				'oncall': 'onCallTime',
				'wrapup': 'wrapUpTime',
				'inwrapup': 'WrapUpTime',
				'available': 'availableTime' //not exist?
			};
			if(ss.statusTimeInSec !== null || !isNaN(ss.statusTimeInSec)) {
				let theAgent = this.agents.find(x => {
					return x.userId === userId;
				});
				if(Object.keys(theAgent).length>0) {
					theAgent.status = ss.lastStatusName;
					if(Object.keys(activeStatus).indexOf(ss.lastStatusName) === -1) {
						theAgent[ss.lastStatusName] = ss.statusTimeInSec;
					}
					else {
						theAgent[activeStatus[ss.lastStatusName]] = ss.statusTimeInSec;
					}
				}
			}
		}
		catch(e) {}
	},
	reject: (err) => { console.log('campaign.monitor err', err) },
	ttl: -1
});



//timeout.js:
/**
 * this function is used by Campaign->Monitor->Agents
 * @returns closure function: new Timeout().nextTick();
 */
export default function Timeout() {
	let timeoutBase = Date.now();
	let out = {};
	out.nextTick = () => {
		return 1000 - ((Date.now() - timeoutBase) % 1000);
	};
	return out;
};
