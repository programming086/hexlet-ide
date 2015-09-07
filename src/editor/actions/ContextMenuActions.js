import {dispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

export function showContextMenu(coords, options) {
  dispatch({
    actionType: ActionTypes.CONTEXT_MENU_SHOW,
    coords: coords,
    options: options
  });
}

export function hideContextMenu() {
  dispatch({ actionType: ActionTypes.CONTEXT_MENU_HIDE });
}
