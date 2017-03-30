import chai, { expect, assert } from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import fs from 'fs';
import uuid from 'uuid';
import Status from '../../../user/state/status'

import ExportData, { REPORT_TYPES } from '../ExportData';

chai.should();

describe('ExportData class test', () => {
	let type, data, report;

	describe('#constructor', () => {

		it('init with default values', ()=> {
			report = new ExportData();

			report.should.have.property('type');
			expect(report).to.have.property('data');

			expect(report).to.have.property('type', 'xls');
			expect(report.data).to.be.empty;

			expect(report).to.not.have.property('description')
		});

		it('#type', ()=> {
			report = new ExportData(REPORT_TYPES['CSV']);
			report.should.have.property('type');
			report.should.have.property('type', 'csv');
		});

		it('#uuid', ()=> {
			let v1 = uuid.v1();
			v1.should.be.an('string')
		});
	});

	describe('#xls data', () => {
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

	describe('#export file', () => {

		let exportData, reportData;

		beforeEach(() => {
			reportData = require(path.join(__dirname, 'loginData.json'));

			exportData = new ExportData('xls', reportData);
			
			//exportData.processData(reportData);
			//console.log(JSON.stringify(exportData.data));
			//exportData.writeFile();
		});

		// processStatus() interface changed, old loginData.json != new stateData.json.
		it('should return a updated data', () => {
			const data = exportData.processStatus();
			expect(exportData.data).to.empty;
		});
	});
});

describe('User Status tests', () => {
	let ss, ep, statusAry;

	beforeEach(() => {
		ss = new Status;
		ep = new ExportData();

		statusAry = ss.statuses.map(s=> {
			return s.name;
		});
	});

	describe('#User Status', () => {
		it('should return an array of statuses', () => {
			expect(ss.statuses).to.have.length.above(0);
			expect(ss.statuses[0]).to.have.a.property('name').and.to.not.equal('');
		});

		it("statusAry should be an array", () => {
			expect(statusAry).to.have.length.above(0);
		});

		it("statusAry should match the default", () => {
			expect(statusAry).to.deep.equal([ 'online', 'available', 'inreview', 'oncall', 'wrapup', 'onbreak', 'offline' ]);
		});
	});
});

describe('google-spreadsheet test', () => {
	it('should work', () => {
		const GoogleSpreadsheet = require('google-spreadsheet');
		GoogleSpreadsheet.should.exist;
	});
});

describe('#Agents Timeframes test', () => {
	let sortCalendar = [], timeframes =[];

	beforeEach(() => {
		sortCalendar = [
			["today", "Today"],
			["yesterday", "Yesterday"],
			["thisWeek", "This Week"],
			["lastWeek", "Last Week"],
			["thisMonth", "This Month"],
			["lastMonth", "Last Month"],
			["all", "All"]
		];
		timeframes = [
			{ name: 'Today', value: 'today' },
			{ name: 'Yesterday', value: 'yesterday' },
			{ name: 'This Week', value: 'thisweek' },
			{ name: 'Last Week', value: 'lastweek' },
			{ name: 'This Month', value: 'thismonth' },
			{ name: 'Last Month', value: 'lastmonth' },
			{ name: 'All', value: null }
		];

	});

	it('#timeframes should be equal with sortCalendar after convert', () => {
		let t1 = sortCalendar.map(x => {
			return { name: x[1], value: x[0].toLowerCase() }
		});
		t1[6].value = null;

		expect(JSON.stringify(t1)).to.be.equal(JSON.stringify(timeframes));
	});

});
