
//import activeAgentTimeout from 'chaim.overpass.com/dist/utils/timeout';
//import { CampaignMonitorCharts } from '../charts/charts';
import { orderBy, partition } from 'lodash';

Number.prototype.toHHMMSS = function () {
	var seconds = Math.floor(this),
		hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	var minutes = Math.floor(seconds / 60);
	seconds -= hours * 60;
	seconds -= minutes * 60;

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return hours + ':' + minutes + ':' + seconds;
};

String.prototype.toSeconds = function () {
	return this.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0);
};

export class Agents {

	constructor(agentList) {
		this.agents = agentList;

		this.activeAgents = [];

		//this.addAgentAttribute();

		this.activeAgents = this.agents.filter(x => {
			return x.isActive === true;
		});


		//this.runTimeUpdate();
		//const callChartData = Object.keys(this.StatesMap).map(x=> {
		//	return {x: this.sumActiveAgents(x)}
		//});
		//this.charts.drawCallsHighChart(callChartData);
		//this.charts = new CampaignMonitorCharts();

		this.StatesMap = {
			'In Review': 'inReviewTime',
			'On Call': 'onCallTime',
			'Wrap Up': 'wrapUpTime'
		};

		// This is dynamically, should repeat to render.
		this.options = {
			appointment: "Appointment Set",
			busy: "Busy",
			lost: "Connection Lost",
			disconnected: "Disconnected Number",
			registry: "Do Not Call Registry",
			donated: "Donated",
			fax: "Fax / Data / Modem Line",
			followUp: "Follow Up"
		};

		//select dispositions from app where type = 'campaign' and primaryKey = 'campaign::bec4f003-d16d-45b1-bb47-37f7f267a6c9'
		this.dispositions = [
			"Sale Closed",
			"Not Interested",
			"Follow Up",
			"Do Not Call Registry",
			"Appointment Set",
			"Left Voicemail",
			"Busy",
			"No Answer",
			"Requires Supervisor",
			"Fax / Data / Modem Line",
			"Incorrect Number",
			"Disconnected Number",
			"Left Live Message",
			"Qualified",
			"Pledged",
			"Donated"
		];
	}

	getDispositions(interactions) {
		let options = {};
		interactions.options.forEach(x => {
			if (options.hasOwnProperty(x)) {
				options[x]++;
			}
			else {
				options[x] = 1;
			}
		});
		return options;
	}

	runTimeUpdate() {
		if (this.activeAgents.length > 0) {
			this.activeAgents.forEach(x => {
				x[this.StatesMap[x.status]]++;
			});
			setTimeout(() => {
				this.runTimeUpdate();
			}, this.activeAgentTimeout.nextTick());
		}
	}

	/**
	 * this replace 'fullName', 'calls', or more: 'disconnected', 'active', 'status',
	 * @param name - key of agentsDemo.
	 * @param asc_desc
	 * @returns sorted agents.
	 *
	 * - this.sortByKey('fullName', 'desc');
	 * - this.sortByKey('calls', 'asc');
	 * - this.sortByKey('disconnected', 'desc');
	 *
	 * TODO: multiple sorting: ['fullName', 'calls']
	 */
	sortByKey(name, asc_desc) {
		// capital not work, only lowercase allows.
		asc_desc = asc_desc ? asc_desc.toLowerCase() : 'asc';
		this.agents = orderBy(this.agents, [name], [asc_desc]);
		return false;
	}

	sortByDisposition(name, asc_desc) {
		asc_desc = asc_desc ? asc_desc.toLowerCase() : 'asc';
		this.agents = orderBy(this.agents, ['options.' + name], [asc_desc]);
		//this.agents.forEach(x=> {
		//	x.outcome = x.options ? x.options[name] : 0;
		//});
		return false;
	}

	sortHHMMSS(name, asc_desc) {
		asc_desc = asc_desc ? asc_desc.toLowerCase() : 'asc';

		// 0 always in the bottom, no matter how 'asc' or 'desc'.
		let partitions = partition(this.agents, (o) => {
			return /(invited|UNAVAILABLE)/i.test(o.status);
		});
		this.agents = orderBy(partitions[1], [name], [asc_desc]).concat(partitions[0]);
		return this.agents;
	}


	sumStatus() {
		var obj = {};
		if (this.agents && this.agents.length > 0) {
			this.agents.forEach(x => {
				obj[x.status] = obj[x.status] ? obj[x.status] + 1 : 1;
			});
		}
		return obj;
	}

	/**
	 * receive: 'On Call', 'In Review', 'Wrap Up'
	 * return: inReviewTime, onCallTime, wrapUpTime
	 */
	sumActiveAgents(status) {
		if (this.activeAgents && this.activeAgents.length > 0) {
			return this.activeAgents
				.filter(f => {
					return f.status === status;
				})
				.map(m => {
					return m[this.StatesMap[status]];
				})
				.reduce((sum, n) => {
					return sum + n;
				}, 0);
		}
		return 0;
	}

	sumAgents(status) {

		if (this.agents && this.agents.length > 0) {
			return this.agents
				.map(m => m.displayStatus===status)
				.reduce((sum, n) => {
					if (n && !isNaN(n)) {
						return sum + n;
					}
					else {
						return sum;
					}
				}, 0);
		}
		return 0;
	}

	viewAgent(agent) {

		//console.log(JSON.stringify(agent));
		this.charts.drawDetailHighChart(agent);
		return false;
	}

	addAgentAttribute() {
		// what else agent attributes need to be added?
		this.agents.forEach(x => {
			x.profileImage = x.profileImage || '/node_modules/overpass-cdn/assets/icons/avatar.png';
			x.outcome = x.outcome || x.options.disconnected;
		});
	}

	filterByCalendar(date) {

		this.gpsInterface.subscribe(`statuschanged.${this.campaignId.replace('::', '')}`, {
			resolve: (data)=> {
				console.log('william-data:', data);
			},
			reject: (err)=> {
				console.log('statuschanged err', err)
			},
			ttl: -1
		});

		this.eventAggregator.subscribe('campaign.agents', (data) => {
			console.log('AGAIN:william:', JSON.stringify(data[0]));
		});

		return false;
	}
}
