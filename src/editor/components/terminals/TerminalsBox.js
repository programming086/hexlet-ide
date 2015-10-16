import _ from "lodash";
import React, {Component} from "react/addons";
import {Container} from 'flux/utils';

import Config from "editor/config";

import {
  createDefaultTerminal,
  selectTerminal,
  createTerminal,
  closeTerminal,
  showRunView
} from "editor/actions/TerminalsActions";

import TerminalsStore from "editor/stores/TerminalsStore";
import IdeStore from "editor/stores/IdeStore";

import Terminal from "./Terminal";
import RunView from "editor/components/common/tab/RunView";
import Toolbar from "editor/components/common/Toolbar";

import cx from "classnames";

class TerminalsBox extends Component<{}, {}, {}> {

  static getStores(): Array<Store> {
    return [TerminalsStore, IdeStore];
  }

  static calculateState(prevState) {
    return {
      terminals: TerminalsStore.getTerminals(),
      isRunViewActive: TerminalsStore.isRunViewActive(),
      isIdeConnected: IdeStore.isConnected()
    }
  };

  componentDidMount() {
    setTimeout(() => createDefaultTerminal(Config.terminal), 0);
  }

  renderTabHeaders() {
    return _.map(this.state.terminals, (terminal, id) => {
      const tabClasses = cx({
        "active": terminal.current,
        "nav-item": true
      });

      return (<li key={"tab_" + id} className={tabClasses}>
      <a href="#" onClick={this.selectTerminal.bind(this, terminal)} className={tabClasses}>
      <span>{"Terminal " + id}</span>
      <button type="button" className="close" onClick={this.closeTerminal.bind(this, terminal)}>
      <span aria-hidden="true">&times;</span>
      <span className="sr-only">
      Close
      </span>
      </button>
      </a>
      </li>);
    });
  }

  renderTerminals() {
    return _.map(this.state.terminals, (terminal) => {
      const classes = cx({
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
    const isIdeConnected = this.state.isIdeConnected;
    const showRunView = this.props.showRunView;

    const runResultClasses = cx({
      // "active": this.state.isRunViewActive,
      "run-view-tab": true,
      "nav-item": true
    });

    const runViewPaneClasses = cx({
      "tab-pane": true,
      "fade active in": this.state.isRunViewActive,
      "run-view": true
    });
    return (
      <div className="terminals-box">
      <ul className="nav nav-tabs" role="tablist">
      { showRunView ?
        <li key={"run-result"} className={runResultClasses} role="presentation">
        <a href="#" onClick={this.showRunView} className={runResultClasses}>
        <span>Output</span>
        </a>
        </li>
        : "" }
        {this.renderTabHeaders()}
        <li key="tab_create" className="nav-item">
        <a href="#" className="nav-item" onClick={this.createTerminal}>Create terminal</a>
        </li>
        { showRunView ?
          <li className="pull-right nav-item">
          <Toolbar isConnected={isIdeConnected} />
          </li>
          : "" }
          </ul>
          <div className="tab-content max-height">
          { showRunView ?
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
    selectTerminal(terminal);
  }

  createTerminal(e) {
    e.preventDefault();
    e.stopPropagation();
    createTerminal(Config.terminal);
  }

  closeTerminal(terminal, e) {
    e.preventDefault();
    e.stopPropagation();
    closeTerminal(terminal);
  }

  showRunView(e) {
    e.stopPropagation();
    e.preventDefault();
    showRunView();
  }
};

export default Container.create(TerminalsBox, { pure: false });
