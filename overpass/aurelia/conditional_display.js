 <form>
      <div if.bind="auth.isLoggedIn">
        <!--this DOM element will be bind only if auth.isLoggedIn is true-->
      </div>
 </form>



import {inject} from 'aurelia-framework';
import {Auth} from 'auth';
@inject(Auth)
export class App {
    constructor(auth) {
        this.auth = auth;
    }

    get isLoggedIn() { return this.auth.isLoggedIn; }
}

export class CssdisplayValueConverter {
    toView(value) {
        return value ? 'none' : 'display';
    }
}


<require from="css-display"><\/require>
<form css="display: ${isLoggedIn() | cssdisplay}"><\/form>