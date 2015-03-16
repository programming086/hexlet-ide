var React = require("react/addons");
var { addEvent, removeEvent, dragEventFor } = require("./Helpers");

var HorizontalSeparator = React.createClass({

  handleDragStart: function(e){
    addEvent(window, dragEventFor['move'], this.handleDrag);
    addEvent(window, dragEventFor['end'], this.handleDragEnd);
  },

  componentWillUnmount: function() {
    removeEvent(window, dragEventFor['move'], this.handleDrag);
    removeEvent(window, dragEventFor['end'], this.handleDragEnd);
  },

  handleDrag: function(e) {
    this.props.onMoveSplit(e.clientY);
  },

  handleDragEnd: function (e) {
    removeEvent(window, dragEventFor['move'], this.handleDrag);
    removeEvent(window, dragEventFor['end'], this.handleDragEnd);
  },

  render: function() {
    return <div
        className="horizontal-separator"
        onMouseDown={this.handleDragStart}
        onMouseUp={this.handleDragEnd}
      >

      {this.props.children}
      </div>
  }

});

module.exports = HorizontalSeparator;
