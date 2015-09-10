import React, {Component} from "react/addons";
import {Container} from 'flux/utils';

import IdeActions from "editor/actions/IdeActions";
import IdeStore from "editor/stores/IdeStore";

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import cx from 'classnames';

class ReconnectionStatusBar extends Component<{}, {}, {}> {
  static getStores(): Array<Store> {
    return [IdeStore];
  }

  static calculateState(prevState) {
    return {
      connectionState: IdeStore.getConnectionState(),
      reconnectionAttempt: IdeStore.getReconnectionAttempt(),
      isConnected: IdeStore.isConnected(),
    };
  }

  render() {
    const isConnected = this.state.isConnected;

    if (isConnected) return null;

    const classes = {
      "reconnection-status-bar": true
    };

    classes[this.state.connectionState] = true;

    return (
      <ReactCSSTransitionGroup transitionName="reconnection-status-bar" transitionAppear={true}>
        <div className={cx(classes)}>
          {this.renderText()}
        </div>
      </ReactCSSTransitionGroup>
    );
  }

  renderText() {
    switch(this.state.connectionState) {
      case "disconnected":
        return <span><i className="glyphicon glyphicon-remove-circle"></i> Disconnected. Waiting for reconnection attempt... {this.renderReconnectBtn()}</span>;
      case "reconnectAttempt":
        return <span><i className="glyphicon glyphicon-hourglass"></i> Reconnect attempt... {this.renderReconnectBtn()}</span>;
      case "reconnecting":
        return <span><i className="glyphicon glyphicon-hourglass"></i> Reconnecting... ({this.state.reconnectionAttempt} attempt)</span>;
      case "reconnectError":
        return <span><i className="glyphicon glyphicon-remove-circle"></i> Connection Error. Wait for next attempt... {this.renderReconnectBtn()}</span>;

      default:
        return <span><i className="glyphicon glyphicon-ok-circle"></i> Connected</span>;
    }
  }

  renderReconnectBtn() {
    return <a className="reconnect-btn" href="#" onClick={this.onReconnectBtnClick}>Reconnect now</a>;
  }

  onReconnectBtnClick(e) {
    e.preventDefault();
    IdeActions.forceConnect();
  }
};

export default Container.create(ReconnectionStatusBar);
