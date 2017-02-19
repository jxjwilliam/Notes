// http://stackoverflow.com/questions/34295908/angular-service-in-aurelia/34296890#34296890
// Aurelia Service:

1) my-data-service.js

import { HttpClient } from 'aurelia-http-client'; // or 'aurelia-fetch-client' if you want to use fetch
import {inject} from 'aurelia-framework';

@inject(HttpClient)
export class MyDataService {
  constructor(http) {
    this.http = http;
  }

  getMyData() {
    return this.http.get(someUrl);
  }
}


//2) funacy-custom-element.js:

import { MyDataService } from './my-data-service';
import { inject } from 'aurelia-framework';

@inject(MyDataService) // aurelia's dependency injection container will inject the same MyDataService instance into each instance of FancyCustomElement
export class FancyCustomElement {
  data = null;

  constructor(dataService) {
    this.dataService = dataService;
  }

  // perhaps a button click is bound to this method:
  loadTheData() {
    this.dataService.getMyData()
      .then(data => this.data = data);
  }
}
