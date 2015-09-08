import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import dispatcher from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from "editor/constants/IdeConstants";

class Store extends ReduceStore {
  getInitialState() {
    return Immutable.fromJS({
      content: "",
      code: 0,
      signal: null,

      isFinished: false
    });
  }

  getContent() {
    return this.getState().get("content");
  }
  getCode() {
    return this.getState().get("code");
  }

  isFinished() {
    return this.getState().get("isFinished");
  }

  isSuccess() {
    return this.getState().get("code") === 0;
  }

  reduce(state, action) {
    switch(action.actionType) {
      case ActionTypes.IDE_RUN:
        return state.set("content", "")
                    .set("code", "")
                    .set("signal", null)
                    .set("isFinished", false);

      case ActionTypes.IDE_RUN_PROGRESS:
        return state.update("content", c => c += action.chunk);

      case ActionTypes.IDE_RUN_FINISH:
        return state.set("code", action.code)
                    .set("signal", action.signal)
                    .set("isFinished", true);

      default:
        return state;
    }
  }
}

export default new Store(dispatcher);
