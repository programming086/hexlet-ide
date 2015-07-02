var React = require("react/addons");
var IdeStore = require("editor/stores/IdeStore");
var IdeActions = require("editor/actions/IdeActions");

module.exports = React.createClass({

  render: function() {
    return (
      <div className="toolbar pull-right">
        <div className="btn-group" role="group">
          <div className={this.getStatusClasses()}>
            <span className={this.getStatusInnerClasses()} />
          </div>
        </div>
      </div>
    );
  },

  getStatusClasses: function() {
    var cx = React.addons.classSet;
    var buttonType = IdeStore.getState().connected ?
      "connected" :
      "disconnected";
    var classes = {
      "status-indicator": true
    };
    classes[buttonType] = true;
    return cx(classes);
  },

  getStatusInnerClasses: function() {
    var cx = React.addons.classSet;
    var glyphiconType = IdeStore.getState().connected ?
      "glyphicon-record" :
      "glyphicon-remove-circle";
    var classes = {
      "glyphicon": true
    };
    classes[glyphiconType] = true;
    return cx(classes);
  }
});
