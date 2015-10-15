// main.js
var React = require('react');
var ReactDOM = require('react-dom');

var MyComponent = React.createClass({
  render: function(){
    return (
    <h1>Hello, world!</h1>
    );
  }
});
React.render(
<MyComponent/>,
  document.getElementById('myDiv')
);