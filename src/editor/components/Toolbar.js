var React = require("react/addons");
var IdeStore = require("editor/stores/IdeStore");
var IdeActions = require("editor/actions/IdeActions");

module.exports = React.createClass({

  render: function() {
    return (
      <div className="toolbar">
        <div className="btn-group-vertical" role="group">
          <button type="button" className={this.getStatusClasses()}>
            <span className={this.getStatusInnerClasses()} />
          </button>
          <button type="button" className="btn" onClick={IdeActions.run}>
            <span className="glyphicon glyphicon-play-circle" />
          </button>
          <button type="button" className="btn">
            <span className="glyphicon glyphicon-question-sign" />
          </button>
        </div>
      </div>
    );
  },

  getStatusClasses: function() {
    var cx = React.addons.classSet;
    var buttonType = IdeStore.getState().connected ?
      "btn-success" :
      "btn-danger";
    var classes = {
      "btn": true
    };
    classes[buttonType] = true;
    return cx(classes);
  },

  getStatusInnerClasses: function() {
    var cx = React.addons.classSet;
    var glyphiconType = IdeStore.getState().connected ?
      "glyphicon-ok-circle" :
      "glyphicon-remove-circle";
    var classes = {
      "glyphicon": true
    };
    classes[glyphiconType] = true;
    return cx(classes);
  }
});
