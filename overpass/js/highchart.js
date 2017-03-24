// All Highcharts move into charts/chart component.
//import Highcharts from 'highcharts';
//import Exporting from "highcharts/modules/exporting";
//Exporting(Highcharts);
//import {noDataToDisplay} from 'highcharts/no-data-to-display.js';

setCallBreaksHighChart () {

	let inReviewY = this.sumActiveAgents('In Review');
	let onCallY = this.sumActiveAgents('On Call');
	let wrapUpY = this.sumActiveAgents('Wrap Up');
	let callData = [];
	if(inReviewY > 0) {
		callData.push({ name: 'In Review', y:inReviewY });
	}
	if(onCallY > 0) {
		callData.push({ name: 'On Call', y: onCallY });
	}
	if(wrapUpY > 0) {
		callData.push({ name: 'Wrap Up', y: wrapUpY });
	}

	if(inReviewY==0 && onCallY==0 && wrapUpY==0) {
		try {
			let div = document.getElementById('callBreaks_container');
			div.style.display = '';
			div.innerHTML = [
				'<h3>No Data in Pie Chart</h3>',
				'<p style="margin-top:20px;">No data to display</p>'
			].join('\n');
		}
		catch (e) {}
		return;
	}

	Highcharts.setOptions({
		chart: {
			backgroundColor: '#FAFBFC',
			style: {
				fontFamily: "Roboto"
			}
		},
		responsive: {
			rules: [{
				condition: {
					maxWidth: 400
				},
			}],
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
			text: 'callBreaks',
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
			data: callData
		}]
	});
}

getColors () {
	return [
		'#14D183', '#D0021B', '#FEC418', '#BA55D3', '#FEC418', '#68768C',
		'#7CFC00', '#C71585', '#DB7093', '#800080', '#FF69B4', '#663399'
	]
}

setAgentDetailsData(options) {

	const colors = this.getColors();
	const len = colors.length;
	let series_data = [];

	this.originDispositons.forEach((x, i) => {
		let ix = i<len ? i : i-len;
		series_data.push({
			name: x,
			y: options[x] || 0,
			color: colors[ix]
		});
	});

	return series_data;
}

drawAgentDetailHighChart(data) {
	let options = data.options;

	Highcharts.setOptions({
		chart: {
			backgroundColor: '#FAFBFC',
		},
		responsive: {
			rules: [{
				condition: {
					maxWidth: 400
				},
			}],
		},
		credits: {
			enabled: false
		},
		legend: {
			enabled: false
		}
	});

	const agentChart = Highcharts.chart('agentDetail_container', {
		chart: {
			type: 'bar',
			events: { load: e => { e.target.reflow(); } }
		},

		title: {
			text: '',
			margin: 0
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
			data: this.setAgentDetailsData(options)
		}]

	});
}

setAgentStatusHighChart(data) {

	let obj = this.sumStatus();
	let inreviews = this.sumActiveAgents('In Review');
	let oncalls = this.sumActiveAgents('On Call');
	let wrapUps = this.sumActiveAgents('Wrap Up');

	Highcharts.setOptions({
		chart: {
			backgroundColor: '#FAFBFC',
			style: {
				fontFamily: "Roboto"
			},
		},
		responsive: {
			rules: [{
				condition: {
					maxWidth: 400
				},
			}],
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
			text: '',
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
				y: obj['available'] ? obj['available'] : 0,
				color: '#14D183'
			}, {
				className: 'active',
				name: 'In Review',
				y: inreviews,
				color: '#FEC418'
			}, {
				className: 'active',
				name: 'On Call',
				y: oncalls,
				color: '#D0021B'
			}, {
				className: 'active',
				name: 'Wrap Up',
				y: wrapUps,
				color: '#68768C'
			}, {
				className: 'away',
				name: 'Away',
				y: obj['onbreak'] ? obj['onbreak'] : 0,
				color: '#FEC418'
			}, {
				className: 'inactive',
				name: 'Offline',
				y: obj['Offline'] ? obj['Offline'] : 0,
				color: '#FEC418'
			}, {
				className: 'inactive',
				name: 'Invited',
				y: obj['Invited'] ? obj['Invited'] : 0,
				color: '#68768C'
			}]
		}]
	})
}
