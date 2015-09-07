import {dispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

export default {
  esc() {
    dispatch({ actionType: ActionTypes.KEY_ESC });
  },

  ctrl_r() {
    dispatch({ actionType: ActionTypes.KEY_CTRL_R });
  },

  ctrl_open_square_br() {
    dispatch({ actionType: ActionTypes.KEY_CTRL_OPEN_SQUARE_BR });
  },

  ctrl_close_square_br() {
    dispatch({ actionType: ActionTypes.KEY_CTRL_CLOSE_SQUARE_BR });
  },
};
