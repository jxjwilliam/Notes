/**
 * URLs/routes/controllers
 * data/models/collections
 * layouts/views/templates
 */
/**
 * modules, extensions, plugins, components
 * routing, pages, data, APIs
 */
define(function (require) {
    var sandbox = require('sandbox');
    return sandbox.mvc.View({
        template: 'template/',
        initialize: function () {
        },
        beforeRender: function () {
        },
        afterRender: function () {
        },
        cleanup: function () {
        }
    });
});

define(function (require) {
    var sandbox = require('sandbox');
    var View = require('my-view');

    return {
        type: 'controller',
        routes: {'/': 'render'},
        deps: {
            'render': {
                donations: 'brand/:brand_id/donations',
                brand: 'bran/:brand_id'
            }
        },
        render: function (params) {
            sandbox.publish('render', 'my-module', new View(params));
        }
    }
});


facade.subscribe = function (channel, subscriber, callback, ccontext) {
    mediator.subscribe(channel, subscriber, callback, context);
    //mediator.subscribe.call(mediator, channel, subscriber, callback, context);
};


define(function (require) {
    var MyModule = sandbox.Module({
        initialize: function () {
        },
        render: function (data) {
        }
    });
    return MyModule;
});


/**
 Decouple Your Routing and Rendering
 . modules register routes with sandbox on load
 . route events passed as messages
 . layouts rendered with render messages


 mediator/Facade:
 . decouple code
 . module lifecycle

 backbone boilerplate: structure.
 templates: handlebar
 dependencies: requirejs
 uglify, grunt, bower, git, jshint, npm,
 */
