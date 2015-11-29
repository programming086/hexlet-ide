import {dispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

export function openPopup(type, options) {
  dispatch( ActionTypes.POPUP_OPEN, { type: type, options: options });
}

export function closePopup() {
  dispatch(ActionTypes.POPUP_CLOSE);
}
