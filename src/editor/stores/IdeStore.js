import keyMirror from "keymirror";

import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import dispatcher from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from "editor/constants/IdeConstants";

const IDE_CONNECTION_STATES = keyMirror({
  connected: null,
  disconnected: null,
  reconnectAttempt: null,
  reconnecting: null,
  reconnectError: null
});

class IdeStore extends ReduceStore {
  getInitialState() {
    return Immutable.fromJS({
      loaded: false,
      displayMode: "normal", // "normal" | "terminal"
      readme: "",
      connectionState: IDE_CONNECTION_STATES.disconnected,
      reconnectionAttempt: 0,
      reconnectionError: null
    });
  }

  isLoaded() {
    return this.getState().get('loaded');
  }

  getDisplayMode() {
    return this.getState().get('displayMode');
  }

  getConnectionState() {
    return this.getState().get('connectionState');
  }

  getReconnectionAttempt() {
    return this.getState().get('reconnectionAttempt');
  }

  isConnected() {
    var connectionState = this.getState().get('connectionState');
    return connectionState === IDE_CONNECTION_STATES.connected;
  }

  getReadme() {
    return this.getState().get('readme');
  }

  isTerminalMode() {
    const displayMode = this.getState().get('displayMode');
    return displayMode === "terminal";
  }

  reduce(state, action) {
    switch(action.actionType) {
      case ActionTypes.IDE_LOADED:
        return state.set('loaded', true);

      case ActionTypes.IDE_TOGGLE_FULL_SCREEN:
        return state.set('fullscreen', action.fullscreen);

      case ActionTypes.IDE_DISCONNECTED:
        return state.set('connectionState', IDE_CONNECTION_STATES.disconnected)

      case ActionTypes.IDE_CONNECTED:
        return state.set('connectionState', IDE_CONNECTION_STATES.connected)

      case ActionTypes.IDE_RECONNECT_ATTEMPT:
        return state.set('connectionState', IDE_CONNECTION_STATES.reconnectAttempt)

      case ActionTypes.IDE_RECONNECTING:
        return state.set('connectionState', IDE_CONNECTION_STATES.reconnecting)
                    .set('reconnectionAttempt', action.attempt);

      case ActionTypes.IDE_RECONNECT_ERROR:
        return state.set('connectionState', IDE_CONNECTION_STATES.reconnectError)
                    .set('reconnectionError', action.reconnectionError);

      case ActionTypes.IDE_SWITCH_DISPLAY_MODE:
        return state.set('displayMode', action.displayMode);

      case ActionTypes.IDE_INIT:
        const data = action.data;
        state.set('displayMode', data.displayMode)
             .set('readme', data.readme);

      default:
        return state;
    };
  };
};


export default new IdeStore(dispatcher);
