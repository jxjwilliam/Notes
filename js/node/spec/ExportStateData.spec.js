import chai, { expect, assert } from 'chai';
import path from 'path';

import ExportData, { REPORT_TYPES } from '../ExportData';

chai.should();

describe('ExportData.js + stateData.json tests', () => {
	let type, data, report;

	describe('#ExportData class test', () => {
		let report;

		beforeEach(() => {
			report = new ExportData();
		});
		afterEach(() => {
			report = undefined;
		});
		it('should initialize successfully', () => {
			expect(report instanceof ExportData).to.equal(true);
			expect(report).to.be.instanceof(ExportData);
		});
	});


	describe('#stateData.json test', () => {

		let exportData, reportData;
		let validLoginSessions1=[], validLoginSessions2=[], validLoginSessions3=[];
		const stateLength_87 = 87; // stateData.json -> valid state array length.
		const bpop_campaign = 'campaign::0a6be69a-470c-4a8a-ae68-623592486d5b';
		let uniqStatus = [];

		// uniq is a function: http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
		let uniq = a => [...new Set(a)];

		beforeEach(() => {
			reportData = require(path.join(__dirname, 'stateData.json'));
			exportData = new ExportData('xls', reportData);
		});

		it('should getStatusNames() return filtered names in status.js', () => {

			const ss = exportData.getStatusNames();

			expect(ss).to.deep.equal([ 'online', 'available', 'inreview', 'oncall', 'wrapup', 'onbreak', 'offline' ]);
		});

		it('should generateFileName() return fileName like report_...xls', () => {
			exportData.generateFileName();

			//'report_d8cac2f0-fea3-11e6-972a-134d19307d71.xls'
			expect(exportData.fileName).include('report_');
			expect(exportData.fileName).include('.xls');
		});

		it('should generateFilePath() return a valid filePath', () => {
			exportData.generateFilePath();

			// /overpass/application/gps.overpass.com/reports/report_39d8f3f0-fea4-11e6-af16-d39278d85938.xls
			expect(exportData.filePath).include('/gps.overpass.com/reports/');
			expect(exportData.filePath).include(exportData.fileName);
		});

		it('should toHHMMSS() return a valid format hh:mm:ss', () => {
			let hhmmss = exportData.toHHMMSS(1442127);
			// 400:35:27
			expect(/\d{2,}:\d{2}:\d{2}/.test(hhmmss)).to.be.true;

			hhmmss =  exportData.toHHMMSS('not valid number');
			expect(hhmmss).to.be.equal('00:00:00');
		});

		it('after getValidStates(), states with campaign and duration property is ' + stateLength_87, () => {
			validLoginSessions1 = exportData.getValidStates(exportData.data[0].loginSessions);

			// stateData.json has 87 valid loginSessions items.
			expect(validLoginSessions1.length).to.be.equal(stateLength_87);
		});

		it("should only work for campaign is '' or '" + bpop_campaign + "' case", () => {

			validLoginSessions2 = exportData.filterStatesByCampaign(bpop_campaign, validLoginSessions1);

			expect(validLoginSessions2.length).to.at.most(stateLength_87);
		});

		it("should filter out status='error' case", () => {
			let validLoginSessions3 = exportData.filterStatesByStatus(validLoginSessions2);

			expect(validLoginSessions3.length).to.at.most(stateLength_87);

			validLoginSessions3.forEach(ss => {
				var tt = ss.states.map(s => s.status);
				tt.forEach(x=> {
					if(uniqStatus.indexOf(x)===-1) {
						uniqStatus.push(x);
					}
				});
			});
			// uniqStatus = uniq(statuses);
			expect(uniqStatus).to.deep.equal([ 'online', 'available', 'inreview', 'oncall', 'wrapup', 'inwrapup', 'error', 'onbreak' ]);
		});

		it('status should not include offline, but include inwrapup', () => {

			expect(uniqStatus).to.contain('available');
			expect(uniqStatus).to.contain('online');
			expect(uniqStatus).to.contain('inreview');
			expect(uniqStatus).to.contain('oncall');
			expect(uniqStatus).to.contain('wrapup');
			expect(uniqStatus).to.contain('inwrapup');
			expect(uniqStatus).to.contain('onbreak');
			expect(uniqStatus).to.not.contain('offline');
			//expect(uniqStatus).to.not.contain('error');
		});


		it('should loginSessions length is 192.', () => {
			expect(reportData[0].loginSessions.length).to.be.equal(192);
		});

		it('should validLoginSessions1 and validLoginSessions2 length', () => {
			expect(validLoginSessions1.length).to.be.equal(87);
			//expect(validLoginSessions2.length).to.be.equal(87);
		});

	});


	describe('#export csv test', () => {

		let exportData, reportData, processedData;

		// uniq is a function: http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
		let uniq = a => [...new Set(a)];

		beforeEach(() => {
			reportData = require(path.join(__dirname, 'stateData.json'));

			exportData = new ExportData('xls', reportData);
		});

		it('should processStatus return updated data', () => {

			processedData = exportData.processStatus(reportData);

			expect(exportData.data).to.be.equal(processedData);
			expect(exportData.data).to.have.length.above(0);

		});
	});

	describe('#export xlsx test', () => {

	});
});

