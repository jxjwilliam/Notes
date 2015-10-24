### What is the difference between compile and link functions in a directive?

Two Phases: Compile and Link

Compile:

Traverse the DOM tree looking for directives (elements / attributes / classes / comments). Each compilation of a directive may modify its template, or modify its contents which has not been compiled yet. Once a directive is matched, it returns a linking function, which is used in a later phase to link elements together. At the end of the compile phase, we have a list of compiled directives and their corresponding linking functions.

Link:

When an element is linked, the DOM tree is broken at its branch point in the DOM tree, and the contents are replaced by the compiled (and linked) instance of the template. The original displaced content is either discarded, or in the case of transclusion, re-linked back into the template. With transclusion, the two pieces are linked back together (kind of like a chain, with the template piece being in the middle). When the link function is called, the template has already been bound to a scope, and added as a child of the element. The link function is your opportunity to manipulate the DOM further and setup change listeners.


### What is an Isolated Scope and why is it useful?

![Isolated Scope ](http://williamjxj.com/wordpress/wp-content/uploads/2015/10/shared-isolated-scope.png)

### What are the different types of services in Angular?

1. Value
1. Factory
  return an object
1. Service
  a Javascript class / a constructor function
1. Provider
  is the parent of all other services, can be configured using `app.config(function(Provider) { ...})
```javascript
app.provider('authentication', function() {
   var username = "John";
   return {
       set: function(newUserName) {
           username = newUserName;
       },
       $get: function() {
           function getUserName() {
               return username;
           }
           return {
               getUserName: getUserName
           };
       }
   };
});
//  then in config to init it:
app.config(["authenticationProvider", function(authenticationProvider) {
   authenticationProvider.set("David");
}]);
```
1. Constant
1. Decorator
  useful for extending 3rd-party services
```javascript
$delegate is the service instance
app.config(function($provide) {
  $provide.decorator('serviceToBeDecorated', function($delegate) {
    // modify $delegate by adding functions etc.
    return $delegate;
  });
});
```

### What is ng-transclude?
Directive that marks the insertion point for the transcluded DOM of the nearest parent directive that uses transclusion.

1. [A live demo in Plunker](http://plnkr.co/edit/BASkdWDH3UvojxD6adSY?p=preview)
1. [A live demo in jsfiddle](http://jsfiddle.net/williamjxj/qs6wqu42/)

### What are the different ways of communicating between angular components?

1. Communicating with inherited scopes
1. Communicating with events
1. Communicating with services

### Explain the scope hierarchy

A great feature of scopes is that they are organized in a hierarchy. The hierarchy helps you keep scopes organized and relevant to the context of the view they represent. There is a root scope at the AngularJS module level and then child scopes can be implemented in sub-components such as controllers or directives. Child scopes can be nested within each other creating a hierarchy structure.

Note
<blockquote>
The $digest() method uses the scope hierarchy to propagate scope changes to the appropriate watchers and the DOM elements.
</blockquote>
Scope hierarchies are created automatically based on the location of ng-controller statements in the AngularJS template.


### Explain the $digest cycle and why it is needed

A good explain:
[https://github.com/angular/angular.js/wiki/Understanding-Scopes](https://github.com/angular/angular.js/wiki/Understanding-Scopes)

There are four types of scopes:

1. normal prototypal scope inheritance -- ng-include, ng-switch, ng-controller, directive with scope: true
1. normal prototypal scope inheritance with a copy/assignment -- ng-repeat. Each iteration of ng-repeat creates a new child scope, and that new child scope always gets a new property.
1. isolate scope -- directive with scope: {...}. This one is not prototypal, but '=', '@', and '&' provide a mechanism to access parent scope properties, via attributes.
1. transcluded scope -- directive with transclude: true. This one is also normal prototypal scope inheritance, but it is also a sibling of any isolate scope.

For all scopes (prototypal or not), Angular always tracks a parent-child relationship (i.e., a hierarchy), via properties $parent and $$childHead and $$childTail.

### Give an example where $scope.$apply() is useful

AngularJS actually calls almost all of your code within an $apply call. Events like ng-click, controller initialization, $http callbacks are all wrapped in $scope.$apply().

In other words, ng-click, http, timeout auto call $apply().
AngularJS provides wrappers for common native JS async behaviors:

1. Events => ng-click
1. Timeouts => $timeout
1. jQuery.ajax() => $http

This is just a traditional async function with a $scope.$apply() called at the end, to tell AngularJS that an asynchronous event just occurred.

1. An example for this is: http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
1. An alternative example is my jsfiddle: http://jsfiddle.net/williamjxj/2p1bepnq/


### Explain the concept of angular modules
An angular module is a container for the different parts of your app – controllers, services, filters, directives, etc.

[A Plunkr demo] (http://embed.plnkr.co/ZneZ7nfyVGAN0fgL5l5Y/script.js)

### What is the different between config and run methods of a module?

A module is a collection of configuration and run blocks which get applied to the application during the bootstrap process. In its simplest form the module consists of a collection of two kinds of blocks:

Configuration blocks - get executed during the provider registrations and configuration phase. Only providers and constants can be injected into configuration blocks. This is to prevent accidental instantiation of services before they have been fully configured.
Run blocks - get executed after the injector is created and are used to kickstart the application. Only instances and constants can be injected into run blocks. This is to prevent further system configuration during application run time.

```javascript
angular.module('myModule', []).
config(function(injectables) { // provider-injector
  // This is an example of config block.
  // You can have as many of these as you want.
  // You can only inject Providers (not instances)
  // into config blocks.
}).
run(function(injectables) { // instance-injector
  // This is an example of a run block.
  // You can have as many of these as you want.
  // You can only inject instances (not Providers)
  // into run blocks
});
```

### What is a service decorator?
Register a service decorator with the $injector. A service decorator intercepts the creation of a service, allowing it to override or modify the behaviour of the service. The object returned by the decorator may be the original service, or a new service object which replaces or wraps and delegates to the original service.