import {dispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

var TreeStore = require("editor/stores/TreeStore");
var rpc = require("editor/lib/RpcClient");

module.exports = {
  closeEditor(editor) {
    dispatch({
      actionType: ActionTypes.EDITORS_CLOSE,
      id: editor.id
    });
  },

  makeCurrent(editor) {
    dispatch({
      actionType: ActionTypes.EDITORS_MAKE_CURRENT,
      id: editor.id
    });
  },

  save(editor) {
    const path = TreeStore.getPathById(editor.id);
    dispatch({
      actionType: ActionTypes.EDITORS_SAVING_CURRENT,
      id: editor.id
    });

    return rpc.getClient().fs.write(path, editor.content).then(_ => {
      dispatch({
        actionType: ActionTypes.EDITORS_SAVE_CURRENT,
        id: editor.id
      });
    });
  },

  edit(editor, content) {
    dispatch({
      actionType: ActionTypes.EDITORS_EDIT_CURRENT,
      id: editor.id,
      content: content
    });
  },

  showRunView() {
    dispatch({
      actionType: ActionTypes.EDITORS_SHOW_RUN_VIEW
    });
  }
};
