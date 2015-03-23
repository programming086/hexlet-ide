const AppDispatcher = require("editor/dispatcher/AppDispatcher");
const ActionTypes = require("editor/constants/IdeConstants").ActionTypes;

module.exports = {
  esc() {
    AppDispatcher.dispatch({ actionType: ActionTypes.KEY_ESC });
  },

  ctrl_r() {
    AppDispatcher.dispatch({ actionType: ActionTypes.KEY_CTRL_R });
  },

  ctrl_open_square_br() {
    AppDispatcher.dispatch({ actionType: ActionTypes.KEY_CTRL_OPEN_SQUARE_BR });
  },

  ctrl_close_square_br() {
    AppDispatcher.dispatch({ actionType: ActionTypes.KEY_CTRL_CLOSE_SQUARE_BR });
  },
};
