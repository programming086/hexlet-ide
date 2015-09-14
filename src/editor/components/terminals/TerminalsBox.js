import _ from "lodash";
import React, {Component} from "react/addons";
import {Container} from 'flux/utils';

import Config from "editor/config";

import TerminalsActions from "editor/actions/TerminalsActions";
import TerminalsStore from "editor/stores/TerminalsStore";

import Terminal from "./Terminal";
import RunView from "editor/components/common/tab/RunView";
import Toolbar from "editor/components/Toolbar";

import cx from "classnames";

class TerminalsBox extends Component<{}, {}, {}> {

  static getStores(): Array<Store> {
    return [TerminalsStore];
  }

  static calculateState(prevState) {
    return {
      terminals: TerminalsStore.getTerminals(),
      isRunViewActive: TerminalsStore.isRunViewActive()
    }
  };

  componentDidMount() {
    // TerminalsActions.createDefaultTerminal(Config.terminal);
  }

  renderTabHeaders() {
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
  }

  renderTerminals() {
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
  }

  render() {
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
  }

  selectTerminal(terminal, e) {
    e.preventDefault();
    e.stopPropagation();
    TerminalsActions.selectTerminal(terminal);
  }

  createTerminal(e) {
    e.preventDefault();
    e.stopPropagation();
    TerminalsActions.createTerminal(Config.terminal);
  }

  closeTerminal(terminal, e) {
    e.preventDefault();
    e.stopPropagation();
    TerminalsActions.closeTerminal(terminal);
  }

  showRunView(e) {
    e.stopPropagation();
    e.preventDefault();
    TerminalsActions.showRunView();
  }
  };

  export default Container.create(TerminalsBox, { pure: false });
