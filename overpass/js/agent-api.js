import { agentsDemo } from './spec/data';

export class AgentAPI {
	isRequesting = false;

	getAgentList(){
		this.isRequesting = true;
		return new Promise(resolve => {
			setTimeout(() => {
				let results = agentsDemo;
				resolve(results);
				this.isRequesting = false;
			}, 200);
		});
	}

	getAgentDetails(id){
		this.isRequesting = true;
		return new Promise(resolve => {
			setTimeout(() => {
				let found = agents.filter(x => x.id == id)[0];
				resolve(JSON.parse(JSON.stringify(found)));
				this.isRequesting = false;
			}, 200);
		});
	}

	saveAgent(agent){
		this.isRequesting = true;
		return new Promise(resolve => {
			setTimeout(() => {
				let instance = JSON.parse(JSON.stringify(agent));
				let found = agents.filter(x => x.id == agent.id)[0];

				if(found){
					let index = agents.indexOf(found);
					agents[index] = instance;
				}else{
					instance.id = getId();
					agents.push(instance);
				}

				this.isRequesting = false;
				resolve(instance);
			}, 200);
		});
	}

	areEqual(obj1, obj2) {
		return Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]));
	};

}
