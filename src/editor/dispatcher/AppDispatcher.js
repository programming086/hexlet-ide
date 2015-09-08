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

const dispatcher = new AppDispatcher();

export default dispatcher;

export const dispatch = function() {
  const args = Array.from(arguments);
  console.log("Dispatch action: ", args);
  if (args.length > 1) {
    args[1].actionType = args[0];
    dispatcher.dispatch(args[1]);

  } else if (_.isObject(args[0])) {
    dispatcher.dispatch(args[0]);
  } else {
    dispatcher.dispatch({
      actionType: args[0]
    });
  }
};

export const promiseDispatch = function(actionType, params = {}) {
  return function(result) {
    params.actionType = actionType;
    params.promiseResult = result;
    console.log("Dispatch action: ", params);
    dispatcher.dispatch(params);
  }
}
