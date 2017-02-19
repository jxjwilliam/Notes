// https://ilikekillnerds.com/2015/10/observing-objects-and-arrays-in-aurelia/

// 1. Array:
import {BindingEngine, inject} from 'aurelia-framework';

@inject(BindingEngine)
export class MyClass {
    constructor(bindingEngine) {
        this.bindingEngine = bindingEngine;
        this.theList = [];

        let subscription = this.bindingEngine.collectionObserver(this.theList).
        	subscribe(this.listChanged);
        
        // Dispose of observer when you are done via: 
        subscription.dispose();
    }
    listChanged(splices) {}
}


// 2. Object
import {BindingEngine, inject} from 'aurelia-framework';

@inject(BindingEngine)
class MyClass {
  constructor(bindingEngine) {
    this.bindingEngine = bindingEngine;
    this.observeMe = 'myvalue';

    let subscription = this.bindingEngine.propertyObserver(this, 'observeMe')
      .subscribe(this.objectValueChanged);

    // Dispose of observer when you are done via: subscription.dispose();
  }

  objectValueChanged(newValue, oldValue) {
    console.log(`observeMe value changed from: ${oldValue} to:${newValue}`);
  }
}


// monitor.js
//<input class="search" placeholder="Search" type="text" value.bind="search.name & debounce:250"/>
export class CampaignMonitor {
	constructor(bindingEngine) {
		this.search = { name : '' };

		// subscribe
		this.subscription = bindingEngine
			.propertyObserver(this.search, 'name')
			.subscribe((newValue, oldValue) => this.doSearch(newValue));
	}

	doSearch(newValue) {
		var searchText = newValue;
		let re = new RegExp(searchText, 'ig');
		this.agents = this.agentlist.filter(x => {
			return re.test(x.fullName);
		});
		this.eventAggregator.publish('campaign.agents', this.agents);
		return false;
	}
}

// The ObserverLocator is Aurelia's internal "bare metal" API. There's now a public API for the binding engine that could be used:
// http://stackoverflow.com/questions/28419242/property-change-subscription-with-aurelia
import {inject} from 'aurelia-dependency-injection';  // or from 'aurelia-framework'
import {BindingEngine} from 'aurelia-binding';        // or from 'aurelia-framework'

@inject(BindingEngine)
export class ViewModel {
  constructor(bindingEngine) {
    this.obj = { foo: 'bar' };

    // subscribe
    let subscription = bindingEngine.propertyObserver(this.obj, 'foo')
      .subscribe((newValue, oldValue) => console.log(newValue));

    // unsubscribe
    subscription.dispose();
  }
}


// https://ilikekillnerds.com/2016/06/working-aurelia-observable/
//The naming convention is <variableName>Changed with two parameters on the changed callback, 
// the new value and the old value.
import { observable } from 'aurelia-framework';

export class MyViewModel {
    @observable myVariable;

    attached() {
        setTimeout(() => {
            this.myVariable = 'I am a value, hooray!';
        }, 5000);
    }

    myVariableChanged(newValue, oldValue) {
        console.log(newValue, oldValue);
    }
}
