import path from 'path';
import fs from 'fs';
import uuid from 'node-uuid';
import converter from 'json-2-csv';
import agentsDemo from './agents.json';

class GenerateAgentJSON {

	constructor(file) {
		this.file = file || './agents.csv';
		this.writeFile = 'AgentList_' + Date.now() + '.json';
		this.csv = [];
		this.db = [];
		this.demo = [];
		this.others = [];
		this.agentList = [];
		this.phone = this.getRandomPhone();
		this.rs = this.getRandomStatus();
	}

	readCSVSync() {
		return fs.readFileSync(this.file, 'utf8');
	}

	//https://www.promisejs.org/
	readFile(fileName, enc = 'utf8') {
		return new Promise((resolve, reject) => {
			fs.readFile(fileName, enc, (err, data) => {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}
	readJSON(fileName) {
		return readFile(filename, 'utf8').then(JSON.parse);
	}

	fileExist() {
		fs.exists(this.file, (exists) => {
			if (exists) {
			}
			else {
				console.error('not exist:', this.file);
			}
		});
	}

	readCSV(callback) {
		var readFile = Promise.denodeify(require('fs').readFile);
		readFile(this.file, 'utf8')
			.then(JSON.parse)
			.nodeify(assemblyCSV);
	}

	getRandomPhone() {
		const TelAreaAry = ['212', '347', '646', '718', '732', '917'];
		return () => {
			var telIndex = Math.floor(Math.random() * TelAreaAry.length);
			var tel = Math.random().toString().slice(2, 9);
			return '(' + TelAreaAry[telIndex] + ')' + tel.substr(0, 3) + '-' + tel.substr(3);
		}
	}

	getRandomNumber(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return () => {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	}

	getRandomBoolean() {
		return Math.random() >= 0.5;
	}

	// only when isActive=true;
	getRandomStatus() {
		const StatusAry = ['Online', 'Available', 'In Review', 'On Call', 'Wrap-Up', 'On Break']; //'Offline'
		return () => {
			var ix = Math.floor(Math.random() * StatusAry.length);
			return StatusAry[ix];
		}
	}

	getDefaultOutcomes(num = 20) {
		//r: random range:
		var r = this.getRandomNumber(0, num);
		return {
			"appointment": r(),
			"busy": r(),
			"lost": r(),
			"disconnected": r(),
			"registry": r(),
			"donated": r(),
			"fax": r(),
			"followUp": r()
		}
	}

	// from agents.csv file
	assemblyCSV() {
		let csvData = this.readCSVSync();

		let callback = (err, array) => {

			var timeRange = this.getRandomNumber(100, 2000);
			var optionRange = this.getRandomNumber(0, 60);

			array.forEach(x => {
				let interaction = x.interactions ? x.interactions[0] : {};

				x.userId = x.userId || uuid.v1();
				x.fullName = x.fullName || x.first + ' ' + x.last;
				x.email = x.email || 'Unknown';
				x.phone = x.phone || this.phone();

				x["isActive"] = x.isActive || this.getRandomBoolean();
				if (x['isActive']) {
					x['status'] = x['status'] || this.rs();
				}
				else {
					x["status"] = 'Offline';
				}
				x["calls"] = interaction.calls || optionRange();
				x["options"] = interaction.outcomes || this.getDefaultOutcomes();
				x["inReviewTime"] = x.inReviewTime || timeRange();
				x["onCallTime"] = x.onCallTime || timeRange();
				x["wrapUpTime"] = x.wrapUpTime || timeRange();

				this.csv.push(x);
			});

			console.log('data from csv', this.csv);
		};

		converter.csv2json(csvData, callback);
	}

	// can't assign random to real-data, use 'Unknown', 0.
	assemblyDBData(res) {
		if (Array.isArray(res) && res.length > 0) {
			res.forEach(x => {
				let interaction = x.interactions ? x.interactions[0] : {};

				x["userId"] = x.userId || 'Unknown';
				x["fullName"] = x.fullName || x.first + ' ' + x.last || 'Unknown';
				x["email"] = x.email || 'Unknown';
				x["phone"] = x.phone || 'Unknown';
				x["isActive"] = x.isActive || false;
				x["status"] = x.status || 'Unknown';
				x["calls"] = interaction.calls || 0;
				x["options"] = interaction.outcomes || this.getDefaultOutcomes(0);
				x["inReviewTime"] = x.inReviewTime || 0;
				x["onCallTime"] = x.onCallTime || 0;
				x["wrapUpTime"] = x.wrapUpTime || 0;

				this.db.push(x);
			});
		}

		console.log('data from db', this.db);
	}

	// from agents.json
	assemblyJSON() {

		var timeRange = this.getRandomNumber(100, 3000);
		var optionRange = this.getRandomNumber(0, 100);

		agentsDemo.forEach(x => {
			x["calls"] = optionRange();
			x["options"] = this.getDefaultOutcomes(20);
			x["inReviewTime"] = timeRange();
			x["onCallTime"] = timeRange();
			x["wrapUpTime"] = timeRange();

			this.demo.push(x);
		});

		console.log('data from demo', this.demo);
	}

	assemblyFaker(num = 20) {
		var faker = require('faker');

		// total fake 100 agents.
		for (let i = 0; i < num; i++) {
			let x = {

				"userId": uuid.v1(),
				"isActive": faker.random.boolean(),
				"fullName": faker.name.findName(), // Rowan Nikolaus
				"email": faker.internet.email(), // Kassandra.Haley@erich.biz
				"calls": faker.random.number(),
				"phone": faker.phone.phoneNumber, //this.phone(),
				"options": this.getDefaultOutcomes(),
				"inReviewTime": faker.random.number(),
				"onCallTime": faker.random.number(),
				"wrapUpTime": faker.random.number()
			};

			if (x['isActive']) {
				x['status'] = this.rs();
			}
			else {
				x["status"] = 'Offline';
			}

			// TODO: william
			x.profileImage = faker.image.avatar();

			// this week.
			x.dateRange = faker.date.weekday();
			x.date = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

			this.others.push(x);
		}
		console.log('data from faker', this.others);
	}

	// merge the 2 together
	assemblyAll() {
		//this.assemblyCSV();
		this.assemblyDBData();
		this.assemblyFaker();
		this.assemblyJSON();

		let agentlist = this.csv.concat(this.db, this.demo, this.others);

		// sorting:
		let isActive = agentlist.filter(x => {
			return x.isActive === true;
		});

		let away = agentlist.filter(x => {
			return x.isActive === false && /Away/i.test(x.status);
		});

		let offline = agentlist.filter(x => {
			return x.isActive === false && /Offline/i.test(x.status);
		});

		let rests = agentlist.filter(x => {
			return x.isActive == false && !/(Away|Offline)/i.test(x.status);
		});

		//console.log('william:', JSON.stringify(agentlist));
		this.agentList = JSON.stringify(isActive.concat(away, offline, rests));

		console.log('ALL', (this.agentList));

		fs.writeFile(this.writeFile, this.agentList, 'utf8', (err) => {
			if (err) throw err;
			console.log('It\'s saved to ' + this.writeFile);
		});
	}
}

var agents = new GenerateAgentJSON('./agents.csv');

agents.assemblyAll();

//~: william
// agents.csv, agents.json should exist.
