import Immutable from "immutable";
import {ReduceStore} from "flux/utils";

import dispatcher from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from "editor/constants/IdeConstants";

function open(state, type, options) {
  return state.set("type", type)
              .set("options", options)
              .set("isOpened", true);
}

function close(state) {
  return state.set("type", "")
              .set("options", {})
              .set("isOpened", false);
}
class PopupStore extends ReduceStore {
  getInitialState() {
    return Immutable.fromJS({
      type: "",
      options: {},
      isOpened: false
    });
  }

  isOpened() {
    return this.getState().get("isOpened");
  }

  type() {
    return this.getState().get("type");
  }

  options() {
    return this.getState().get("options");
  }

  reduce(state, action) {
    switch(action.actionType) {
      case ActionTypes.POPUP_OPEN:
        return open(state, Immutable.fromJS(action.type), Immutable.fromJS(action.options));

      case ActionTypes.POPUP_CLOSE:
        return close(state);

      case ActionTypes.TREE_CREATE_FOLDER:
        return close(state);

      case ActionTypes.TREE_CREATE_FILE:
        return close(state);

      case ActionTypes.TREE_REMOVE:
        return close(state);

      case ActionTypes.TREE_RENAME:
        return close(state);

      case ActionTypes.IDE_SHOW_README:
        return open(state, "markdown_view", Immutable.fromJS(action.options));

      case ActionTypes.IDE_SUBMIT_RESULT:
        return close(state);

      case ActionTypes.KEY_ESC:
        return (state.get("isOpened")) ? close(state): state;

      default:
        return state;
    }
  }
};

export default new PopupStore(dispatcher);
