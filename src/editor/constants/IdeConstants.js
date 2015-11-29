/* global require module */

import keyMirror from "keymirror";

const CONSTANTS = {
  ActionTypes: keyMirror({
    IDE_INIT: null,
    IDE_GLOBAL_CLICK: null,
    IDE_TOGGLE_FULL_SCREEN: null,
    IDE_LOADED: null,
    IDE_CONNECTED: null,
    IDE_DISCONNECTED: null,
    IDE_RECONNECT_ATTEMPT: null,
    IDE_RECONNECTING: null,
    IDE_RECONNECT_ERROR: null,
    IDE_SHOW_README: null,
    IDE_RUN: null,
    IDE_RUN_PROGRESS: null,
    IDE_RUN_FINISH: null,
    IDE_RESIZE_SPLIT: null,
    IDE_SWITCH_DISPLAY_MODE: null,
    IDE_SUBMIT_RESULT: null,

    TREE_LOAD: null,
    TREE_RELOAD: null,
    TREE_OPEN_FOLDER: null,
    TREE_CLOSE_FOLDER: null,
    TREE_OPEN_FILE: null,
    TREE_OPEN_CONTEXT_MENU: null,
    TREE_CREATE_FILE: null,
    TREE_CREATE_FOLDER: null,
    TREE_REMOVE: null,
    TREE_RENAME: null,

    POPUP_CLOSE: null,
    POPUP_OPEN: null,

    EDITORS_CLOSE: null,
    EDITORS_MAKE_CURRENT: null,
    EDITORS_SAVING_CURRENT: null,
    EDITORS_SAVE_CURRENT: null,
    EDITORS_EDIT_CURRENT: null,
    EDITORS_SHOW_RUN_VIEW: null,
    // EDITORS_FLUSH_CONTENT: null

    TERMINALS_CREATE_TERMINAL: null,
    TERMINALS_UPDATE_TERMINAL: null,
    TERMINALS_SELECT_TERMINAL: null,
    TERMINALS_CLOSE_TERMINAL: null,
    TERMINALS_SHOW_RUN_VIEW: null,

    CONTEXT_MENU_SHOW: null,
    CONTEXT_MENU_HIDE: null,


    KEY_ESC: null,
    KEY_CTRL_R: null,
    KEY_CTRL_OPEN_SQUARE_BR: null,
    KEY_CTRL_CLOSE_SQUARE_BR: null

  })
};

export default CONSTANTS;
export const ActionTypes = CONSTANTS.ActionTypes;
