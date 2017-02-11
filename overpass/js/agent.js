import { orderBy, partition } from 'lodash';

export class Agent {

	constructor(agent) {
		this.fullName = agent.fullName;
		this.isActive = agent.isActive;
		this.status = agent.status;
		if (!/invited/i.test(agent.status)) {
			this.calls = agent.calls;
			this.disconnected = agent.options.disconnected;
			this.inReviewTime = agent.inReviewTime;
			this.onCallTime = agent.onCallTime;
			this.wrapUpTime = agent.wrapUpTime;
		}
		this.profileImage = '/node_modules/overpass-cdn/assets/icons/avatar.png';
	}

	// for invited, there is no properties for states...
	getSeconds(status) {
		switch (status) {
			case 'In Review':
				return this.inReviewTime.toSeconds();
			case 'On Call':
				return this.onCallTime.toSeconds();
			case 'Wrap Up':
				return this.wrapUpTime.toSeconds();
		}
	}

	setSeconds(status) {
		let seconds;
		switch (status) {
			case 'In Review':
				if (this.inReviewTime > 0) {
					seconds = this.inReviewTime.toSeconds();
					this.inReviewTime = (++seconds).toHHMMSS();
				}
				break;
			case 'On Call':
				if (this.onCallTime > 0) {
					seconds = this.onCallTime.toSeconds();
					this.onCallTime = (++seconds).toHHMMSS();
				}
				break;
			case 'Wrap Up':
				if (this.wrapUpTime > 0) {
					seconds = this.wrapUpTime.toSeconds();
					this.wrapUpTime = (++seconds).toHHMMSS();
				}
				break;
		}
	}

}

export class Agents {

	constructor(agentList) {
		this.agentList = [];
		if (Array.isArray(agentList)) {
			agentList.forEach(a => {
				this.agentList.push(new Agent(a));
			});
		}

		this.StatesMap = {
			inReviewTime: 'In Review',
			onCallTime: 'On Call',
			wrapUpTime: 'Wrap Up',
		};

		this.CallOptions = {
			appoint: "Appointment Set",
			busy: "Busy",
			lost: "Connection Lost",
			disconnect: "Disconnected Number",
			registry: "Do Not Call Registry",
			donate: "Donated",
			fax: "Fax / Data / Modem Line",
			followUp: "Follow Up"
		}
	}

	/**
	 * this replace 'fullName', 'calls', or more: 'disconnected', 'active', 'status',
	 * @param name - key of agentsDemo.
	 * @param asc_desc
	 * @returns sorted agentList.
	 *
	 * - this.sortByAgentKey('fullName', 'desc');
	 * - this.sortByAgentKey('calls', 'asc');
	 * - this.sortByAgentKey('disconnected', 'desc');
	 *
	 * TODO: multiple sorting: ['fullName', 'calls']
	 */
	sortByAgentKey(name, asc_desc) {
		// capital not work, only lowercase allows.
		asc_desc = asc_desc ? asc_desc.toLowerCase() : 'asc';

		return orderBy(this.agentList, [name], [asc_desc]);
	}

	getAgentKey(name) {
		return this.agents.map(al => {
			return al[name];
		});
	}

	sortHHMMSS(name, asc_desc) {
		asc_desc = asc_desc ? asc_desc.toLowerCase() : 'asc';

		// sort can NOT be '1:05', should convert to seconds first.
		let nameOfSecond = this.StatesMap[name];

		this.agentList.forEach(al => {
			if (al[name] && !al[nameOfSecond]) {
				al[nameOfSecond] = al.getSeconds(nameOfSecond);
			}
		});

		return orderBy(this.agentList, [nameOfSecond], [asc_desc]);
	}
}
