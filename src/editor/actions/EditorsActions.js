import {dispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

import TreeStore from "editor/stores/TreeStore";
import rpc from "editor/lib/RpcClient";

export function closeEditor(editor) {
  dispatch({
    actionType: ActionTypes.EDITORS_CLOSE,
    id: editor.id
  });
}

export function makeCurrent(editor) {
  dispatch({
    actionType: ActionTypes.EDITORS_MAKE_CURRENT,
    id: editor.id
  });
}

export function save(editor) {
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
}

export function edit(editor, content) {
  dispatch({
    actionType: ActionTypes.EDITORS_EDIT_CURRENT,
    id: editor.id,
    content: content
  });
}

export function showRunView() {
  dispatch({
    actionType: ActionTypes.EDITORS_SHOW_RUN_VIEW
  });
};
