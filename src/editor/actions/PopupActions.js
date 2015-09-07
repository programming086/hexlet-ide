import {dispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

export default {
  open(type, options) {
    dispatch({
      actionType: ActionTypes.POPUP_OPEN,
      type: type,
      options: options
    });
  },
  close() {
    dispatch({ actionType: ActionTypes.POPUP_CLOSE });
  }
};
