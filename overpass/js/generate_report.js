import path from 'path';
import fs from 'fs';
import ExportData from './ExportData';

/**
 * usage: $ node generate_report.js
 */

const generateReport = (data) => {
	const report = new ExportData('xls', data);
	report.writeFile();
};

const generateXLS = (data) => {
	const report = new ExportData('xls', data);
	report.writeFile();
};

const generateCSV = (data) => {
	const report = new ExportData('csv', data);
	report.writeFile();
};

const data = require(path.join(__dirname, 'spec/', 'loginData.json'));

console.info("1. generating CSV report data...");
generateCSV(data);


console.info("2. generating XLS report data...");
generateXLS(data);


console.info("3. generating default(xls) report data...");
generateReport(data);
