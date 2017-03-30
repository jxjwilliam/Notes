var app = angular.module('myapp', []);

/**
 * <p>{{ myText | regexReplace: '[0-9]':'X' }}</p>
 */
app.filter("regexReplace", function () { // register new filter
    return function (input, searchRegex, replaceRegex) { // filter arguments
        return input.replace(RegExp(searchRegex), replaceRegex); // implementation
    };
});

/**
 * <h1>{{inputString| reverse:true }}</h1>
 */
app.filter('reverse', function() {
    return function(input, uppercase) {
        var out = '';
        for (var i = 0; i < input.length; i++) {
            out = input.charAt(i) + out;
        }
        if (uppercase) {
            out = out.toUpperCase();
        }
        return out;
    }
});

/**
 * <li ng-repeat="n in [] | range:15">{{n}}, {{$index+1}}</li>
 */
app.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
});


angular.module('angular-toArrayFilter', [])

.filter('toArray', function () {
  return function (obj, addKey) {
    if (!angular.isObject(obj)) return obj;
    if ( addKey === false ) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    } else {
      return Object.keys(obj).map(function (key) {
        var value = obj[key];
        return angular.isObject(value) ?
          Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
          { $key: key, $value: value };
      });
    }
  };
});