import path from 'path';
import fs from 'fs';
import ExportData from './ExportData';

/**
 * usage: $ node generate_report.js
 */

const generateReport = (data) => {
	const report = new ExportData('xlsx');
	report.processStatus(data);
	report.writeFile();
};

const generateXLS = (data) => {
	const report = new ExportData('xls');
	report.processStatus(data);
	report.writeFile();
};

const generateCSV = (data) => {
	const report = new ExportData('csv');
	report.processStatus(data);
	report.writeFile();
};

const data = require(path.join(__dirname, 'spec/', 'stateData.json'));

generateCSV(data);


generateXLS(data);


generateReport(data);
