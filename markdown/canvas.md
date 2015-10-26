canvas
======

canvas, svg, fabric, svg-editor, mvc

-----------------------------------
A full list of software components and external services used by [Picxr](http://picxr.com/about/tech) are listed below:

### Server-side
1. Ruby and Ruby on Rails for models, routes, controllers, and other server-side logic
1. PostgreSQL for storing data
1. HAML , SCSS / LESS , and CoffeeScript , which compile into HTML, CSS, and JavaScript
1. Haml Coffee Assets for bringing HAML to client-side templates through Sprockets
1. Paperclip for uploading images to Amazon S3

### Client-side

1. <code>jQuery</code> for DOM manipulation and basic event handling
1. <code>Backbone.js</code> for pushState and providing MVC-like structure for JavaScript
1. <code>Fabric.js</code> for scaling, rotation, and moving on the <canvas> element
1. <code>CamanJS</code> for basic image filters and effects
1. <code>glfx.js</code> for more advanced image filters and effects with WebGL
1. <code>Bootstrap</code> for the CSS grid and some styling
1. <code>jQuery UI</code> for sliders used on the image manipulation page
1. <code>Spectrum</code> for the color picker
1. <code>Chosen</code> for user-friendly select boxes
1. <code>jQuery Hotkeys</code> to enable keyboard shortcuts
1. <code>mousefu</code> for handling mouse coordinates and events on image manipulation canvas

### External services
1. Heroku for Ruby on Rails hosting
1. Amazon S3 for image hosting
1. Facebook API for importing Facebook photos
1. New Relic for performance diagnostics
1. Google Analytics for visitor statistics