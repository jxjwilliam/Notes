<body ng-app>
  <label><input type="checkbox" ng-model="checked" />Disable Button<\/label>
  <button ng-disabled="checked">Select me<\/button>
<\/body>


function MyCtrl($scope) {
	$scope.email = "";

	$scope.$watch("email", function(newValue, oldValue) {
		if ($scope.email.length > 0) {
			console.log("User has started writing into email");
		}
	});
}

<div ng-controller="MyCtrl">
  <button ng-click="hide()">Hide element<\/button>
  <p ng-hide="isHide">Hide or Show<\/p>
<\/div>

function MyCtrl($scope) {
	$scope.isHide = false;
	$scope.hide = function() {
		$scope.isHide = true;
	}
}


myApp.factory('$exceptionHandler', function($log, ErrorService) {
    return function(exception, cause) {
        
        if (console) {
            $log.error(exception);
            $log.error(cause);
        }

        ErrorService.send(exception, cause);
    };
});


var directiveDefinitionObject = {
    priority: 0,
    template: '<div></div>', // or // function(tElement, tAttrs) { ... },
    // or
    // templateUrl: 'directive.html', // or // function(tElement, tAttrs) { ... },
    transclude: false,
    restrict: 'A',
    templateNamespace: 'html',
    scope: false,
    controller: function($scope, $element, $attrs, $transclude, otherInjectables) { ... },
    controllerAs: 'stringIdentifier',
    bindToController: false,
    require: 'siblingDirectiveName', // or // ['^parentDirectiveName', '?optionalDirectiveName', '?^optionalParent'],
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink(scope, iElement, iAttrs, controller) { ... },
        post: function postLink(scope, iElement, iAttrs, controller) { ... }
      }
      // or
      // return function postLink( ... ) { ... }
    },
    // or
    // link: {
    //  pre: function preLink(scope, iElement, iAttrs, controller) { ... },
    //  post: function postLink(scope, iElement, iAttrs, controller) { ... }
    // }
    // or
    // link: function postLink( ... ) { ... }
  };


  angular.factory('testService', function($q) {
  	return {
  		getName: function() {
  			var deferred = $q.defer();

  			testApi.getName().then(function(name) {
  				deferred.resolve(name);
  			});

  			return deferred.promise;
  		}
  	}
  });




///////////////
var prices = [105, 101, 102, 104, 109, 110, 99, 101];

function maxProfit(prices) {
  let profit = 0;
  if (prices) {
    let minSoFar = prices[0];
        
    for (let i = 1; i < prices.length; ++i) {
      if (prices[i] < minSoFar) {
        minSoFar = prices[i]; 
      }
      
      let currentProfit = prices[i] - minSoFar;
      if (currentProfit > profit) {
        profit = currentProfit
      }
    }
  }  
  return profit;
}

console.log(maxProfit(prices));



//2.
function MyP(cb) {
    var resolve = function(msg) {
        console.log('resolve: ', msg);
    }
    var reject = function(msg) {
        console.log('reject: ', msg);
    }
    cb.call(this, resolve, reject);
}

MyP.prototype.then = function() {
    console.log('then');
    return this;
}

MyP.prototype.catch = function() {
    console.log('catch');
}

var mp = new MyP(function(resolve, reject) {
    if(true) {
        resolve({username: 'william'});
    }
    if(!false) {
        reject({error: 'something wrong'})
    }
});

mp.then().then().catch();



var App = React.createClass({
  getInitialState: function () {
    return {count: this.props.maxCounters};
  },

  onIncrement: function () {
    this.setState({'count': this.state.count+1})
  },

  onDecrement: function () {
    this.setState({'count': this.state.count-1});
  },

  render: function () {
    return (
      <div>
        <div>{this.state.count}</div>
        <button onClick={this.onIncrement}> + </button>
        <button onClick={this.onDecrement}> - </button>
      </div>
    );
  }
});



class App extends React.Component {
  getInitialState() {
    return {count: this.props.maxCounters};
  }
 onIncrement() {
   this.setState({'count': this.state.count-1});
   },
  onDecrement() {
   this.setState({'count': this.state.count-1});
  }
  
  render() {
    return (
      <div>
        <button onClick={this.onIncrement}> + </button>
        <button onClick={this.onDecrement}> - </button>
      </div>
    );
  }
}

ReactDOM.render(<App maxCounters={3} />, document.getElementById('app'));


