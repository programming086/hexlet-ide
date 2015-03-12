/** @jsx React.DOM */

var React = require("react/addons");
var { addEvent, removeEvent, dragEventFor } = require("./Helpers");

var VerticalSeparator = React.createClass({
  handleDragStart: function(e){
    addEvent(window, dragEventFor['move'], this.handleDrag);
    addEvent(window, dragEventFor['end'], this.handleDragEnd);
  },

  componentWillUnmount: function() {
    removeEvent(window, dragEventFor['move'], this.handleDrag);
    removeEvent(window, dragEventFor['end'], this.handleDragEnd);
  },

  handleDrag: function(e) {
    this.props.onMoveSplit(e.clientX);
  },

  handleDragEnd: function (e) {
    removeEvent(window, dragEventFor['move'], this.handleDrag);
    removeEvent(window, dragEventFor['end'], this.handleDragEnd);
  },

  render: function() {
    return <div
        className="vertical-separator"
        onMouseDown={this.handleDragStart}
        onMouseUp={this.handleDragEnd}>
      {this.props.children}
      </div>
  }

});

module.exports = VerticalSeparator;
