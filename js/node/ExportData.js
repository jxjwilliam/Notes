import path from 'path';
import fs from 'fs';
import uuid from 'uuid';
import xls from 'tfk-json-to-xlsx';
import converter from 'json-2-csv';
import Status from '../../user/state/status.js';

export const REPORT_TYPES = {
	XLS: 'xls',
	XLSX: 'xlsx',
	CSV: 'csv',
	SPREADSHEET: 'spreadsheet'
};

// The export folder: /gps.overpass.com/reports/ (chmod 1777 -)
export const REPORT_FOLDER = '../../../../gps.overpass.com/reports';

class ExportData {

	constructor(type = REPORT_TYPES.XLS, data = []) {
		this.type = type;
		this.data = data;
	}

	/**
	 * userStateModel may include old schema structure. need to filter out to acquire all data matching latest schema.
	 * e.g.: to include 'duration', 'campaign'
	 * test failed, update:
	 */
	getValidStates(loginSessions) {
		let matchedStates1 = [];
		loginSessions.forEach(ls => {
			let exists = ls.states.some(s => {
				return s.hasOwnProperty('duration') && s.hasOwnProperty('campaign') && !s.hasOwnProperty('timestamp');
			});
			if(exists) {
				matchedStates1.push(ls);
			}
		});
		return matchedStates1;
	}

	// Workforce.js -> Export Reports
	processStatus(data) {
		let ers = [];
		if (data) {
			this.data = data;
		}
		this.data.forEach(d => {
			let er = {
				"User.first": d.first || 'N/A',
				"User.last": d.last || 'N/A',
				"User.email": d.email || 'N/A'
			};

			if (Array.isArray(d.loginSessions) && d.loginSessions.length > 0) {

				let loginsessions = this.getValidStates(d.loginSessions);

				loginsessions.forEach(ls => {

					if (Array.isArray(ls.states) && ls.states.length > 0) {

						let t = {};
						this.getStatusNames().forEach(key =>  t[key]=0);

						t["startTime"] = ls.startTime;
						t["endTime"] = ls.endTime;
						//t["endTime"] = ls.states[ls.states.length-1]['endTime'];

						//[ 'online', 'available', 'inreview', 'oncall', 'wrapup', 'onbreak', 'offline' ]
						ls.states.forEach(ti => {
							switch (ti.status) {
								case 'online':
								case 'available':
									t["available"] += ti.duration;
									break;
								case 'inreview':
									t["inreview"] += ti.duration;
									break;
								case 'oncall':
									t["oncall"] += ti.duration;
									break;
								case 'wrapup':
								case 'inwrapup':
									t["wrapup"] += ti.duration;
								case 'onbreak':
									t["onbreak"] += ti.duration;
									break;
								default: // status: error
									break;
							}
						});

						t["total_online"] = t["endTime"] - t["startTime"];
						t["total_active"] = t["total_online"] - t["onbreak"];

						let sdate = new Date(t["startTime"]);
						let edate = new Date(t["endTime"]);

						t["startTime"] = sdate.toLocaleDateString("en-US") + ' ' + sdate.toLocaleTimeString("en-us");
						t["endTime"] = edate.toLocaleDateString("en-US") + ' ' + edate.toLocaleTimeString("en-us");

						let oneLoginSession = Object.assign({}, er,
							{"Start Time": t["startTime"]},
							{"End Time": t["endTime"]},
							{"Total time Active": this.toHHMMSS(t["total_active"])},
							{"Total Time Online": this.toHHMMSS(t["total_online"])},
							{"Available": this.toHHMMSS(t["available"])},
							{"In Review": this.toHHMMSS(t["inreview"])},
							{"On Call": this.toHHMMSS(t["oncall"])},
							{"Wrap Up": this.toHHMMSS(t["wrapup"])},
							{"On Break": this.toHHMMSS(t["onbreak"])}
						);

						ers.push(oneLoginSession);
					}
				});
			}
		});

		this.data = ers;
		return ers;
	}

	// Campaign-Monitor-Agent Export Reports
	processAgentStatus(data, exportType) {
		if (data && Array.isArray(data)) {

			if(!exportType || exportType !=='csv') {

				this.data = data.map(x=>{
					let er = {
						"Agent": x.fullName,
						"Status": x.status || "N/A",
						"Calls": x.calls || "0",
						"In Review Time": x.inReviewTime ? this.toHHMMSS(x.inReviewTime): "00:00:00",
						"On Call Time": x.onCallTime ? this.toHHMMSS(x.onCallTime): "00:00:00",
						"Wrap Up Time": x.wrapUpTime ? this.toHHMMSS(x.wrapUpTime): "00:00:00"
					};
					if(Object.keys(x.options).length>0) {
						let t = {};
						Object.keys(x.options).forEach(o => {
							t[o] = x.options[o];
						});
						Object.assign(er, t);
					}
					return er;
				});
			}
			else {
				let ary = [];
				// extract: ["Connection Lost", "Disconnected Number", "Busy", "Do Not Call Registry"]
				data.forEach(x=> {
					Object.keys(x.options).forEach(o => {
						if(o && ary.indexOf(o)===-1) {
							ary.push(o);
						}
					});
				});
				this.data = data.map(x=>{
					let er = {
						"Agent": x.fullName,
						"Status": x.status || "N/A",
						"Calls": x.calls || "0",
						"In Review Time": x.inReviewTime ? this.toHHMMSS(x.inReviewTime): "00:00:00",
						"On Call Time": x.onCallTime ? this.toHHMMSS(x.onCallTime): "00:00:00",
						"Wrap Up Time": x.wrapUpTime ? this.toHHMMSS(x.wrapUpTime): "00:00:00"
					};

					let t = {};
					ary.forEach(o => {
						x.options = x.options || {};
						t[o] = x.options[o] || 0;
					});
					Object.assign(er, t);
					return er;
				});
			}
		}
		return this.data;
	}

	/**
	 * generate GUID filename: .csv, .xls, .xlsx.
	 */
	generateFileName() {
		this.fileName = 'report_' + uuid.v1() + '.' + this.type;
		return this.fileName;
	}

	generateFilePath() {
		this.filePath = path.join(__dirname, REPORT_FOLDER, this.generateFileName());
		return this.filePath;
	}

	/**
	 * originally from http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
	 * did a little change.
	 */
	toHHMMSS(num) {
		if (isNaN(num)) {
			return '00:00:00';
		}
		let sec_num = parseInt(num, 10);
		//sec_num = Math.floor(sec_num / 1000);
		let hours = Math.floor(sec_num / 3600);
		let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		let seconds = sec_num - (hours * 3600) - (minutes * 60);

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
	}

	/**
	 * write JSON-documents to a MS-excel file.
	 */
	writeXLS() {
		const documents = this.data;

		return new Promise((resolve, reject) => {
			xls.write(this.filePath, documents, error => {
				if (error) reject(error);
				else resolve(this.fileName);
			});
		});
	}

	/**
	 * write JSON-documents to a CSV file.
	 */
	writeCSV() {
		const documents = this.data;

		return new Promise((resolve, reject) => {
			converter.json2csv(documents, (err, csv) => {
				if (err) reject(err);

				fs.writeFile(this.filePath, csv, error => {
					if (error) reject(error);
					else resolve(this.fileName);
				});
			});
		});
	}

	/**
	 * TODO: write JSON-documents to a Spread Sheet file.
	 */
	writeSpreadSheet() {
		return new Promise((resolve, reject) => {
			; //resolve(200);
		});
	}

	/**
	 * Main: to generate an export report based on file-type and JSON-data.
	 */
	writeFile() {
		this.generateFilePath();
		switch (this.type) {
			case REPORT_TYPES.XLS:
			case REPORT_TYPES.XLSX:
				return this.writeXLS();
			case REPORT_TYPES.CSV:
				return this.writeCSV();
			case REPORT_TYPES.SPREADSHEET:
				return this.writeSpreadSheet();
			default:
				return this.writeXLS();
		}
	}


	// other status: error, connected, disconnected, '', inwrapup, cancel,
	getStatusNames() {
		let ss = new Status;
		//[ 'online', 'available', 'inreview', 'oncall', 'wrapup', 'onbreak', 'offline' ]
		return ss.statuses.map(s => s.name);
	}

	// file: data.json, state.json, for test purpose.
	getReportData(file) {
		if (!(Array.isArray(this.data) && this.data.length > 0)) {
			this.data = require(path.join(__dirname, file));
		}
		return this.data;
	}

	//process multiple-campaigns: only this campaignId is available.
	filterStatesByCampaign(campaignId, loginSessions) {
		let matchedStates2 = [];
		loginSessions.forEach(ls => {
			let tt = ls.states.filter(ss => {
				return ss['campaign'] === '' || ss['campaign'] === campaignId;
			});
			if(tt.length > 0) {
				matchedStates2.push(ls);
			}
		});
		return matchedStates2;
	}

	// filter out status='error'
	filterStatesByStatus(loginSessions) {
		let matchedStates3 = [];
		loginSessions.forEach(ls => {
			let tt = ls.states.filter(ss =>  ss.status !== 'error');
			if(tt.length > 0) {
				matchedStates3.push(ls);
			}
		});
		return matchedStates3;
	}

}

export default ExportData;

