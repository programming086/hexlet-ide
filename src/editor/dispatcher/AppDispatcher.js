/* global require module */

import Dispatcher from "flux/lib/Dispatcher";
import objectAssign from "react/lib/Object.assign";

class AppDispatcher extends Dispatcher {
  registerHandler(actionType, callback) {
    if (!actionType) {
      throw "ActionType is undefined!!!";
    }
    this.register(function(payload) {
      if (payload.actionType === actionType) {
        console.log("Call action: " + actionType + " with payload: ", payload);
        callback(payload);
      }
    });
  }
}

const instance = new AppDispatcher();

export default instance;
export const dispatch = function(action) {
  console.log("Dispatch action: ", action);
  instance.dispatch(action);
};
