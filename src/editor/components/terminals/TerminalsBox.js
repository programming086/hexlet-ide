import cx from "classnames";
var _ = require("lodash");
var React = require("react/addons");

var Config = require("editor/config");

var TerminalsActions = require("editor/actions/TerminalsActions");
var TerminalsStore = require("editor/stores/TerminalsStore");

var Terminal = require("./Terminal");
var RunView = require("editor/components/common/tab/RunView");
var Toolbar = require("editor/components/Toolbar");

var WatchStoreMixin = require("editor/mixins/WatchStore");


var TerminalsBox = React.createClass({
  mixins: [WatchStoreMixin(TerminalsStore)],

  getFluxState: function() {
    return {
      terminals: TerminalsStore.getAll(),
      isRunViewActive: TerminalsStore.isRunViewActive()
    };
  },

  componentDidMount() {
    TerminalsActions.createDefaultTerminal(Config.terminal);
  },

  renderTabHeaders: function() {
    return _.map(this.state.terminals, function(terminal, id) {
      var tabClasses = cx({
        "active": terminal.current
      });

      return <li key={"tab_" + id} className={tabClasses}>
        <a href="#" onClick={this.selectTerminal.bind(this, terminal)} className={tabClasses}>
          <span>{"Terminal " + id}</span>
          <button type="button" className="close" onClick={this.closeTerminal.bind(this, terminal)}>
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">
              Close
            </span>
          </button>
        </a>
      </li>;
    }, this);
  },

  renderTerminals: function() {
    return _.map(this.state.terminals, function(terminal) {
      var classes = cx({
        "tab-pane": true,
        "fade active in": terminal.current,
        "terminal-box": true
      });

      return (
          <div className={classes} key={terminal.id}>
            <Terminal terminal={terminal} />
          </div>
      );
    });
  },

  render: function() {
    var runResultClasses = cx({
      // "active": this.state.isRunViewActive,
      "run-view-tab": true
    });

    var runViewPaneClasses = cx({
      "tab-pane": true,
      "fade active in": this.state.isRunViewActive,
      "run-view": true
    });
    return (
      <div className="terminals-box">
        <ul className="nav nav-tabs" role="tablist">
          { this.props.showRunView ?
          <li key={"run-result"} className={runResultClasses} role="presentation">
            <a href="#" onClick={this.showRunView} className={runResultClasses}>
              <span>Output</span>
            </a>
          </li>
          : "" }
          {this.renderTabHeaders()}
          <li key="tab_create">
            <a href="#" onClick={this.createTerminal}>Create terminal</a>
          </li>
          { this.props.showRunView ?
          <li className="pull-right">
            <Toolbar />
          </li>
          : "" }
        </ul>
        <div className="tab-content max-height">
          { this.props.showRunView ?
          <RunView className={runViewPaneClasses} />
          : "" }
          {this.renderTerminals()}
        </div>
      </div>
    );
  },

  selectTerminal: function(terminal, e) {
    e.preventDefault();
    e.stopPropagation();
    TerminalsActions.selectTerminal(terminal);
  },

  createTerminal: function(e) {
    e.preventDefault();
    e.stopPropagation();
    TerminalsActions.createTerminal(Config.terminal);
  },

  closeTerminal: function(terminal, e) {
    e.preventDefault();
    e.stopPropagation();
    TerminalsActions.closeTerminal(terminal);
  },

  showRunView(e) {
    e.stopPropagation();
    e.preventDefault();
    TerminalsActions.showRunView();
  },

});

module.exports = TerminalsBox;
