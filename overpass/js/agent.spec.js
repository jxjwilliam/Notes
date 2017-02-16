import Agent from './agent';
import agentList from 'agents.json';

describe('Agent class test', () => {

	describe('#contructor', () => {
		let agent;
		beforeEach(() => {
			agent = new Agent(agentList);
		});

		it("should an instance of Agent", () => {
			expect(agent).toBeDefined();
			expect(agent).hasOwnProperty('profileImage');
			expect(agent.profileImage).toBeDefined();
		});

		it('getStatusList', () => {
			const ss = agent.getStatusList().map(s => {
				return s.displayName;
			});

			expect(ss).toContain('Online');
			expect(ss).toEqual([ 'Online', 'Available', 'In Review', 'On Call', 'Wrap-Up', 'On Break', 'Offline' ]);
			expect(ss.length).toBe(7);
		});
	});

});

describe('Agent Demo test', () => {
	var agent;

	beforeEach(() => {
		agent = new Agent(agentList);
	});

	it('agent active', () => {
		expect(agent.active).toBeTruthy();
	});

	it('agent status', () => {
		expect(agent.status).toEqual('In Review');
		expect(agent.inReviewTime).toEqual('8:49');
		expect(agent.onCallTime).toEqual('7:20');
		expect(agent.wrapUpTime).toEqual('3:18');
		expect(agent.active).toBeTruthy();
	});

	it('Active - In Review: second to increment', () => {
		agent.setSeconds('In Review');
		expect(agent.inReviewTime).toEqual('00:08:50');
		agent.setSeconds('In Review');
		expect(agent.inReviewTime).toEqual('00:08:51');
		agent.setSeconds('In Review');
		expect(agent.inReviewTime).toEqual('00:08:52');
	});

	it('Active - In Review: seconds to increase', () => {
		let ss = agent.getSeconds('In Review');
		for(let i=0; i<6; i++) {
			agent.setSeconds('In Review');
			expect(agent.getSeconds('In Review')).toEqual(++ss);
		}
	});

	it('Active - In Review: setTimeout to increase seconds', (done) => {
		let seconds = agent.inReviewTime.toSeconds();
		seconds += 1;

		setTimeout(() => {
			agent.setSeconds('In Review');
			expect(agent.getSeconds('In Review')).toEqual(seconds);
			done();
		}, 1000);
	});

	it('Active - In Review: setInterval to increase seconds', (done) => {
		let seconds = agent.inReviewTime.toSeconds();
		seconds += 1;

		let timeHandler = setInterval(() => {
			agent.setSeconds('In Review');
			expect(agent.getSeconds('In Review')).toEqual(seconds );

			if(agent.checkStatus(false)) {
				console.log('called???');
				clearInterval(timeHandler);
			}

			done();
		}, 1000);

	});


	it('change Status to On Call', () => {
		agent.changeStatus('On Call');
		expect(agent.active).toBeTruthy();
		expect(agent.status).toEqual('On Call');
	});

	it('Active - On Call', () => {
		let ss = agent.getSeconds('On Call');
		for(let i=0; i<10; i++) {
			agent.setSeconds('On Call');
			expect(agent.getSeconds('On Call')).toEqual(++ss);
		}
	});

	it('Active - Wrap Up', () => {
		agent.changeStatus('Wrap Up');
		expect(agent.status).toEqual('Wrap Up');
		expect(agent.active).toBeTruthy();

		let ss = agent.getSeconds('Wrap Up');
		for(let i=0; i<8; i++) {
			agent.setSeconds('Wrap Up');
			expect(agent.getSeconds('Wrap Up')).toEqual(++ss);
		}
	});

	it('Away', () => {
		agent.changeActive(false);
		expect(agent.active).toBeFalsy();
	});
	it('Offline', () => {

	});
	it('Invited', () => {

	});


});

describe("Manually ticking the Jasmine Clock", function() {
	var timerCallback;

	beforeEach(function () {
		timerCallback = jasmine.createSpy("timerCallback");
		jasmine.clock().install();
	});

	afterEach(function () {
		jasmine.clock().uninstall();
	});

	it("causes a timeout to be called synchronously", function () {
		setTimeout(function () {
			timerCallback();
		}, 100);

		expect(timerCallback).not.toHaveBeenCalled();

		jasmine.clock().tick(101);

		expect(timerCallback).toHaveBeenCalled();
	});

});

