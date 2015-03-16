/* global require module */

var AppDispatcher = require("editor/dispatcher/AppDispatcher");
var ActionTypes = require("editor/constants/IdeConstants").ActionTypes;

module.exports = {
  open(type, options) {
    AppDispatcher.dispatch({
      actionType: ActionTypes.POPUP_OPEN,
      type: type,
      options: options
    });
  },
  close() {
    AppDispatcher.dispatch({ actionType: ActionTypes.POPUP_CLOSE });
  }
};
