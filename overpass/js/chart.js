export class GraphData {
	agentDetails = () => {
		const options = {
			chart: {
				backgroundColor: '#FAFBFC',
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			}
		};

		/**
		 * "options": {
			"appointment": 12,
			"busy": 2,
			"lost": 3,
			"disconnected": 1,
			"registry": 2,
			"donated": 0,
			"fax": 0,
			"followUp": 9
		}*/
		return (id, option) => {
			var series_data = [];
			var colors = this.getColors();
			var len = colors.length;

			Object.keys(option).forEach((x, i) => {
				var ix = i<len ? i : --i;
				series_data.push({
					name: x,
					y: option[x],
					color: colors[ix]
				});
			});

			Highcharts.chart(id, agentDetails(series_data));
		}
	};

	agentStatus = () => {
		const options = {
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
		};

		return (id, data) => {
			var series_data = [];
			var colors = this.getColors();
			var len = colors.length;

			Object.keys(data).forEach((x, i) => {
				if (x !== 'options') {
					var ix = i < len ? i : --i;
					series_data.push({
						name: x,
						y: option[x],
						color: colors[ix]
					});
				}
			});

			Highcharts.chart(id, agentStatusGraph(series_data));
		}
	};

	callsBreaks = () => {

		const options = {
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
			}
		};

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

		return (id, data) => {
			Highcharts.setOptions(options);
			return Highcharts.chart(id, callData)
		}
	};

	callBreaksGraph =  {
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
	};

	agentDetailsGraph =  {
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

	};

	agentStatusGraph = {
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
	}

	getColors () {
		return [
			'#14D183', '#D0021B', '#D0021B', '#FEC418', '#14D183', '#FEC418', '#68768C'
		]
	}


	lineGraph = {
		title: {
			text: 'Monthly Average Temperature',
			x: -20 //center
		},
		subtitle: {
			text: 'Source: WorldClimate.com',
			x: -20
		},
		xAxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		},
		yAxis: {
			title: {
				text: 'Temperature (°C)'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			valueSuffix: '°C'
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0
		},
		series: [{
			name: 'Tokyo',
			data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
		}, {
			name: 'New York',
			data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
		}, {
			name: 'Berlin',
			data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
		}, {
			name: 'London',
			data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
		}]
	};

	pieChart = {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: 'Browser market shares January, 2015 to May, 2015'
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				},
				showInLegend: true
			}
		},
		series: [{
			name: "Brands",
			colorByPoint: true,
			data: [{
				name: "Microsoft Internet Explorer",
				y: 56.33
			}, {
				name: "Chrome",
				y: 24.03,
				sliced: true,
				selected: true
			}, {
				name: "Firefox",
				y: 10.38
			}, {
				name: "Safari",
				y: 4.77
			}, {
				name: "Opera",
				y: 0.91
			}, {
				name: "Proprietary or Undetectable",
				y: 0.2
			}]
		}]
	};
}
