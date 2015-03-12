var React = require("react/addons");

var TreeBox = require("editor/components/tree/TreeBox");
var EditorsBox = require("editor/components/editors/EditorsBox");
var TerminalsBox = require("editor/components/terminals/TerminalsBox");
var ContextMenu = require("editor/components/common/ContextMenu");
var Loader = require("editor/components/common/Loader");
var RunnerBox = require("editor/components/RunnerBox");
var ActionsBox = require("editor/components/ActionsBox");
var StatusBox = require("editor/components/StatusBox");
var PopupBox = require("editor/components/PopupBox");

var IdeActions = require("editor/actions/IdeActions");
var WatchStoreMixin = require("editor/mixins/WatchStore");
var IdeStore = require("editor/stores/IdeStore");

var Ide = React.createClass({
  mixins: [WatchStoreMixin(IdeStore)],
  getFluxState: function() {
    return IdeStore.getState();
  },

  handleGlobalClick: function() {
    IdeActions.globalClick();
  },

  render: function() {
    if (!this.state.loaded) {
      return <Loader />;
    }

    return (
      <div className="ide-inner">
        <PopupBox />
        <ContextMenu />
        <div className="max-height" onClick={this.handleGlobalClick}>
          <div className="max-height row">
            <div className="col-xs-3 max-height nopadding">
              <div className="row">
                <div className="col-xs-2">
                  <ActionsBox />
                  <StatusBox />
                </div>
                <div className="col-xs-10">
                  <TreeBox />
                </div>
              </div>
            </div>
            <div className="col-xs-9 max-height nopadding nooverflow">
              <EditorsBox />
              <TerminalsBox />
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = Ide;
