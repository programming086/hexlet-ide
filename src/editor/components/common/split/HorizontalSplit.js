/** @jsx React.DOM */

var React = require("react/addons");
var _ = require("lodash");


var Separator = require("./HorizontalSeparator");
var Panel = require("./Panel");

var IdeActions = require("editor/actions/IdeActions");

var { addEvent, removeEvent, dragEventFor } = require("./Helpers");

var HorizontalSplit = React.createClass({

  getInitialState: function(){
    return {size: {}}
  },

  render: function() {
    var result = []
    var children = this.props.children;

    _.each(children, function(item, num){
      var props = _.extend({}, item.props, {height: this.heightFor(num, item.props.height)});

      result.push(<Panel {...props} key={"panel-" + num} />);

      if(num != children.length - 1)
        result.push(<Separator onMoveSplit={this.onMoveSplit.bind(this, num)} key={"separator-"+num}/>);
    }.bind(this));

    var className = (this.props.className || "") + " horizontal-split";

    return (<div className={className}> {result} </div>);
  },

  heightFor: function(num, byDefault) {
    var height = this.state.size[num] || byDefault;

    for(var i = 0; i < num; i++) {
      height = height - (this.state.size[i] || 0)
    }

    return height;
  },

  onMoveSplit: function(num, y) {
    console.log("DRAG MOVE");
    var node = this.getDOMNode();
    var rect = node.getBoundingClientRect();

    var size = this.state.size;
    size[num] = y - rect.top;

    this.setState({ size: size });

    IdeActions.resizeSplit();
  }

});

module.exports = HorizontalSplit;
