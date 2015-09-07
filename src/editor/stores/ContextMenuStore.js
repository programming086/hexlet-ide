import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import dispatcher from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from "editor/constants/IdeConstants";

class ContextMenuStore extends ReduceStore {
  getInitialState() {
    return Immutable.fromJS({
      isVisible: false,
      coords: { x: 0, y: 0 },
      options: {}
    });
  }

  reduce(state, action) {
    switch(action.actionType) {
      case ActionTypes.CONTEXT_MENU_SHOW:
        return state.set('isVisible', true)
                    .set('coords', Immutable.fromJS(action.coords))
                    .set('options', Immutable.fromJS(action.options));

      case ActionTypes.CONTEXT_MENU_HIDE:
        return state.set('isVisible', false);

      case ActionTypes.IDE_GLOBAL_CLICK:
        return state.set('isVisible', false);

      case ActionTypes.POPUP_OPEN:
        return state.set('isVisible', false);

      default:
        return state;
    }
  }
}

export default new ContextMenuStore(dispatcher);
