import React from "react";
import ReactDOM from "react-dom";

var Separator = require("./VerticalSeparator");
var Panel = require("./Panel");

var IdeActions = require("editor/actions/IdeActions");

var VerticalSplit = React.createClass({

  getInitialState: function(){
    return {size: {}}
  },

  render: function() {
    var result = []
    var children = this.props.children;

    _.each(children, function(item, num){
      var props = _.extend({}, item.props, {width: this.widthFor(num, item.props.width)});

      result.push(<Panel {...props} key={"panel-" + num} />);

      if(num != children.length - 1)
        result.push(<Separator onMoveSplit={this.onMoveSplit.bind(this, num)} key={"separator-"+num}/>);
    }.bind(this));

    var className = (this.props.className || "") + " vertical-split";

    return (<div className={className}> {result} </div>);
  },

  widthFor: function(num, byDefault) {
    var width = this.state.size[num] || byDefault;

    for(var i = 0; i < num; i++) {
      width = width - (this.state.size[i] || 0)
    }

    return width;
  },

  onMoveSplit: function(num, x) {
    var node = ReactDOM.findDOMNode(this);
    var rect = node.getBoundingClientRect();

    var size = this.state.size;
    size[num] = x - rect.left;

    this.setState({ size: size });

    IdeActions.resizeSplit();
  }

});

module.exports = VerticalSplit;
