const React = require("react/addons");
const IdeActions = require("editor/actions/IdeActions");
const IdeStore = require("editor/stores/IdeStore");

const WatchStoreMixin = require("editor/mixins/WatchStore");
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


const cx = React.addons.classSet;

module.exports = React.createClass({
  mixins: [WatchStoreMixin(IdeStore)],
  getFluxState() {
    return IdeStore.getState();
  },

  render() {
    if (IdeStore.isConnected()) {
      return null;
    }

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
  },

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
  },

  renderReconnectBtn() {
    return <a className="reconnect-btn" href="#" onClick={this.onReconnectBtnClick}>Reconnect now</a>;
  },

  onReconnectBtnClick(e) {
    e.preventDefault();
    IdeActions.forceConnect();
  }
});
