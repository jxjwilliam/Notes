import GPSInterfaceBrowser from 'chaim.overpass.com/dist/gps/gpsInterface.browser';
import CampaignClient from 'chaim.overpass.com/dist/campaign/campaign.client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { Base } from '../../../../../base';
import { orderBy, partition } from 'lodash';
import ActiveAgentTimeout from 'chaim.overpass.com/dist/utils/timeout';
import Highcharts from 'highcharts';
import Exporting from "highcharts/modules/exporting";
Exporting(Highcharts);

Number.prototype.toHHMMSS = function () {
	var seconds = Math.floor(this),
		hours = Math.floor(seconds / 3600);
	seconds -= hours*3600;
	var minutes = Math.floor(seconds / 60);
	seconds -= hours*60;
	seconds -= minutes*60;

	if (hours   < 10) { hours   = "0"+hours; }
	if (minutes < 10) { minutes = "0"+minutes; }
	if (seconds < 10) { seconds = "0"+seconds; }
	return hours + ':' + minutes + ':'+seconds;
};

String.prototype.toSeconds = function() {
	return this.split(':').reverse().reduce((prev, curr, i) => prev + curr*Math.pow(60, i), 0);
};

@inject(EventAggregator, Base)
export class Agents{
    constructor(eventAggregator, base){
       this.agents = [];
       this.activeAgents = [];
       this.eventAggregator = eventAggregator;
       this.gpsInterface = new GPSInterfaceBrowser();
       this.base = base;

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

	/**
	 * [{"calls": 3,
     *   "options": [
     *    "busy",
     *    "sale closed",
     *    "sale closed"
     *  ]}]
	 */
	getDispositions(interactions) {
		let options = {};
		interactions.options.forEach(x => {
			if(options.hasOwnProperty(x)) {
				options[x] ++;
			}
			else {
				options[x] = 1;
			}
		});
		return options;
	}

    activate(params, routeconfig){    
        console.log('routeconfig', routeconfig)    
        this.campaignId = params.campaign;
        this.activeAgentTimeout = ActiveAgentTimeout();
        let subscribeNamespace = `statuschanged.${this.campaignId.replace('::', '')}`;
        this.gpsInterface.subscribe(subscribeNamespace, {
            resolve:(data)=>{
                console.log('statuschanged data', data)
                let userPk = data.args[0];
                let agent = this.agents.filter(item => {return item.userPk == userPk})[0].currentStatus = data.args[1];
                },
            reject:(err)=>{console.log('statuschanged err', err)},
            ttl : -1
        });

        this.eventAggregator.subscribe('campaign.agents', (data) => {
            console.log('campaign.agents', JSON.stringify(data[0]));
            this.agents = data[0];

			if(this.agents && this.agents.length>0) {

				//profileImage,
				this.setAgentAttribute();

				this.activeAgents = this.agents.filter(x => {
					return x.isActive === true;
				});

				if(this.activeAgents.length > 0) {
					this.runTimeUpdate();

					const callData = [{
						name: 'In Review',
						y: this.sumActiveAgents('In Review')
					}, {
						name: 'On Call',
						y: this.sumActiveAgents('On Call')
					}, {
						name: 'Wrap Up',
						y:  this.sumActiveAgents('Wrap Up')
					}];

					this.setCallBreaksHighChart(callData);
				}

				this.setAgentStatusHighChart()
			}

			//TODO: william remove this before doing PR
			window.activeAgents = this.activeAgents;
        });

        routeconfig.settings.callback();
    }

    runTimeUpdate() {
		this.activeAgents.forEach(x => {
			x[this.StatesMap[x.status]] ++;
		});

		setTimeout(() => {
			this.runTimeUpdate();
		}, this.activeAgentTimeout.nextTick());
	}

	setSeconds(status) {
		let seconds;
		switch(status) {
			case 'In Review':
				if(this.inReviewTime > 0) {
					seconds = this.inReviewTime.toSeconds();
					this.inReviewTime = (++seconds).toHHMMSS();
				}
				break;
			case 'On Call':
				if(this.onCallTime > 0) {
					seconds = this.onCallTime.toSeconds();
					this.onCallTime = (++seconds).toHHMMSS();
				}
				break;
			case 'Wrap Up':
				if(this.wrapUpTime > 0) {
					seconds = this.wrapUpTime.toSeconds();
					this.wrapUpTime = (++seconds).toHHMMSS();
				}
				break;
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
		this.agents.forEach(x=> {
			x.outcome = x.options? x.options[name] : 0;
		});
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


	getAgentKey(name) {
		return this.agents.map(al => {
			return al[name];
		});
	}

	setCallBreaksHighChart (data) {

		Highcharts.setOptions({
			chart: {
				backgroundColor: '#FAFBFC',
				style: {
					fontFamily: "Roboto"
				},
				width: 400
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			},
		});

		return Highcharts.chart('callBreaks_container', {
			chart: {
				type: 'pie'
			},

			title: {
				text: 'Calls Breakdown',
				margin: 0
			},

			tooltip: {
				enabled: false
			},

			colors: ['#00487C', '#0069B4', '#4FC4D2'],

			plotOptions: {
				pie: {
					allowPointSelect: true,
					dataLabels: {
						enabled: true,
						format: '{point.name}: {percentage:.1f}%',
						distance: -50
					},
				}
			},

			series: [{
				name: 'Agents',
				data: data
			}]
		});
	}

	drawAgentDetailHighChart(data) {
		let options = data.options;

		Highcharts.setOptions({
			chart: {
				backgroundColor: '#FAFBFC',
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			}
		});

		var agentChart = Highcharts.chart('agentDetail_container', {
			chart: {
				type: 'bar'
			},

			title: {
				text: 'Agent Name',
				margin: 10
			},

			tooltip: {
				enabled: false
			},

			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true,
						format: '{y}'
					}
				}
			},

			colors: ['#4FC4D2'],

			xAxis: [{
				type: 'category'
			}],

			yAxis: [{
				title: {
					text: 'Calls'
				}
			}],

			series: [{
				name: 'Calls',
				data: [{
					name: 'Appointment Set',
					y: options.appointment,
					color: '#14D183'
				}, {
					name: 'Donated',
					y: options.donated,
					color: '#14D183'
				}, {
					name: 'Busy',
					y: options.busy,
					color: '#D0021B'
				}, {
					name: 'Connection Lost',
					y: options.lost,
					color: '#D0021B'
				}, {
					name: 'Disconnected Number',
					y: options.disconnected,
					color: '#D0021B'
				}, {
					name: 'Do Not Call Registry',
					y: options.registry,
					color: '#D0021B'
				}, {
					name: 'Fax / Data / Modem Line',
					y: options.fax,
					color: '#D0021B'
				}, {
					name: 'Incorrect Number',
					y: options.wrongNo,
					color: '#D0021B'
				}, {
					name: 'No Answer',
					y: options.noAnswer,
					color: '#D0021B'
				}, {
					name: 'Not Interested',
					y: options.noInterested,
					color: '#D0021B'
				}, {
					name: 'Follow Up',
					y: options.followUp,
					color: '#FEC418'
				}, {
					name: 'Left Live Message',
					y: options.leftMessage,
					color: '#FEC418'
				}, {
					name: 'Requires Supervisor',
					y: options.needHelp,
					color: '#FEC418'
				}], // End data
			}] // End series

		});
	}

	setAgentStatusHighChart(data) {

		var obj = this.sumStatus();
		var inreviews = this.sumActiveAgents('In Review');
		var oncalls = this.sumActiveAgents('On Call');
		var wrapUps = this.sumActiveAgents('Wrap Up');

		Highcharts.setOptions({
			chart: {
				backgroundColor: '#FAFBFC',
				style: {
					fontFamily: "Roboto"
				},
				width: 400
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			},

		});

		return Highcharts.chart('agentStatuses_container', {
			chart: {
				type: 'pie'
			},

			title: {
				text: 'Agent Statuses',
				margin: 0
			},

			tooltip: {
				enabled: false
			},

			plotOptions: {
				pie: {
					allowPointSelect: true,
					dataLabels: {
						enabled: true,
						format: '{point.name}: {y}',
						distance: 5
					},
					innerSize: '60%',
					borderWidth: 2
				}
			},

			series: [{
				name: 'Agents',
				data: [{
					name: 'Available',
					y: obj['Available'] ? obj['Available'] : 0,
					color: '#14D183'
				}, {
					className: 'active',
					name: 'In Review',
					y: inreviews,
					color: '#14D183'
				}, {
					className: 'active',
					name: 'On Call',
					y: oncalls,
					color: '#14D183'
				}, {
					className: 'active',
					name: 'Wrap Up',
					y: wrapUps,
					color: '#14D183'
				}, {
					className: 'away',
					name: 'Away',
					y: obj['Away'] ? obj['Away'] : 0,
					color: '#FEC418'
				}, {
					className: 'inactive',
					name: 'Offline',
					y: obj['Offline'] ? obj['Offline'] : 0,
					color: '#68768C'
				}, {
					className: 'inactive',
					name: 'Invited',
					y: obj['Invited'] ? obj['Invited'] : 0,
					color: '#68768C'
				}]
			}]
		})
	}

	sumStatus() {
		var obj = {};
		if(this.agents && this.agents.length>0) {
			this.agents.forEach(x => {
				obj[x.status] = obj[x.status] ? obj[x.status]+1 : 1;
			});
		}
		return obj;
	}

	/**
	 * receive: 'On Call', 'In Review', 'Wrap Up'
	 * return: inReviewTime, onCallTime, wrapUpTime
	 */
	sumActiveAgents(status) {
		if(this.activeAgents && this.activeAgents.length>0) {
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

	/**
	 * sumAgents('calls'), sumAgents('options.appointment'), sumAgents('options.disconnected')
	 */
	sumAgents(item) {
		let flag = false, opts = [];
		if(/\./.test(item)) {
			flag = true;
			opts = item.split('.');
		}
		if(this.agents && this.agents.length>0) {
			return this.agents
				.map(m => {
					if(flag) {
						if(m[opts[0]] && m[opts[0]][opts[1]]) {
							return m[opts[0]][opts[1]];
						}
					}
					else {
						return m[item];
					}
				})
				.reduce((sum, n) => {
					if(n && !isNaN(n)) {
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

		this.drawAgentDetailHighChart(agent);
		return false;
	}

	setAgentAttribute() {
		// what else agent attributes need to be added?
		this.agents.forEach(x => {
			x.profileImage = x.profileImage ||  '/node_modules/overpass-cdn/assets/icons/avatar.png';
			x.outcome = x.outcome || x.options.disconnected;
		});
	}

	// Not used.
	toggleAgentDetails(i){
		this.agents[i].showDetails = !this.agents[i].showDetails;
	}

	// Not used.
	getStatusText(statusName, typeOnly = false){
		let status = this.base.current.userStatus.statuses.filter(x => {return x.name == statusName})[0];
		if(status)
			return typeOnly ? `${status.statusType}` : `${status.statusType} - ${status.displayName}`;
		return statusName;
	}

	sortByCalendar(date) {

		this.gpsInterface.subscribe(`statuschanged.${this.campaignId.replace('::', '')}`, {
			resolve:(data)=>{
				console.log('william-data:', data);
			},
			reject:(err)=>{console.log('statuschanged err', err)},
			ttl : -1
		});

		this.eventAggregator.subscribe('campaign.agents', (data) => {
			console.log('AGAIN:william:', JSON.stringify(data[0]));
		});

		return false;
	}
}
