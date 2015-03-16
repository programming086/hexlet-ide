var React = require("react/addons");


var Panel = React.createClass({

  render: function() {
    var style = {};

    if(this.props.width)
      style.width = this.props.width;

    if(this.props.height)
      style.height = this.props.height;

    var className = (this.props.className || "") + " split-panel";

    return <div className={className} style={style} >{this.props.children}</div>
  }

});

module.exports = Panel;
