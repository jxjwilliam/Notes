import { orderBy, partition } from 'lodash';
import { Agents } from './agents';
import agentDemos from './agents.json'


describe('Agent List data-structure test', () => {

	describe('#constructor', () => {
		let obj;

		beforeEach(() => {
			obj = new Agents(agentDemos);
		});

		it('should be an object', () => {
			expect(obj).toBeDefined();
		});

		it('sort by fullName - ASC', () => {

			obj.sortByKey('fullName');

			var ary = obj.agents;
			expect(ary[0].fullName).toEqual('Alfred R');
			expect(ary[ary.length - 1].fullName).toEqual('Terri U');
		});

		it('sort by fullName - DESC', () => {

			obj.sortByKey('fullName', 'desc');
			let ary = obj.agents;

			expect(ary[0].fullName).toEqual('Terri U');
			expect(ary[ary.length - 1].fullName).toEqual('Alfred R');
		});


		it('sort by Calls - ASC', () => {

			obj.sortByKey('calls');
			let ary = obj.agents;

			expect(ary[0].calls).toBe(4);
			expect(ary[1].calls).toBe(15);
			expect(ary[ary.length - 2].calls).toBe(99);
		});

		it('sort by Calls - DESC', () => {

			obj.sortByKey('calls', 'desc');
			var ary = obj.agents;

			expect(ary[0].calls).toBeUndefined();
			expect(ary[1].calls).toBe(99);
			expect(ary[ary.length - 1].calls).toBe(4);
		});

		it('sort by Disconnected Number - ASC', () => {
			obj.sortByDisposition('disconnected');
			var ary = obj.agents;
			expect(ary[0].options.disconnected).toBe(1);
		});

		it('sort by Disconnected Number - DESC', () => {
			obj.sortByDisposition('disconnected', 'desc');
			var ary = obj.agents;

			expect(ary[ary.length-1].options.disconnected).toBe(1);
		});

		it('sort by In Review Time - ASC', () => {

			obj.sortHHMMSS('inReviewTime');
			var ary = obj.agents;

			expect(ary[0].inReviewTime).toEqual(110);
		});

		it('sort by In Review Time - DESC', () => {

			obj.sortHHMMSS('inReviewTime', 'desc');
			var ary = obj.agents;

			expect(ary[0].inReviewTime).toEqual(2115);
		});

		it('sort by On Call Time - ASC', () => {
			obj.sortHHMMSS('onCallTime');
			var ary = obj.agents;

			expect(ary[0].onCallTime).toEqual(405);
		});

		it('sort by On Call Time - DESC', () => {
			obj.sortHHMMSS('onCallTime', 'desc');
			var ary = obj.agents;

			expect(ary[0].onCallTime).toEqual(6612);
		});

		it('sort by Wrap Up Time - ASC', () => {
			obj.sortHHMMSS('wrapUpTime');
			var ary = obj.agents;


			expect(ary[ary.length - 2].wrapUpTime).toEqual(3333);
		});

		it('sort by Wrap Up Time - DESC', () => {
			obj.sortHHMMSS('wrapUpTime', 'DESC');
			var ary = obj.agents;

			expect(ary[0].wrapUpTime).toEqual(3333);
		});
	});
});

