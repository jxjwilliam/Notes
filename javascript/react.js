var Child = React.createClass({
  render: function() {
    <a onClick={this.props.onClick.bind(null, this)}>Click me</a>
  }
});

var Parent = React.createClass({
  handleChildClick: function(component, event) {
    component.props // #=> {Object...}
  },
  render: function() {
    <Child onClick={this.handleChildClick} />
  }
});