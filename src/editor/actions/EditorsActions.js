import {dispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";

import TreeStore from "editor/stores/TreeStore";
import rpc from "editor/lib/RpcClient";

export function closeEditor(editor) {
  dispatch(ActionTypes.EDITORS_CLOSE, { id: editor.get('id')});
}

export function makeCurrent(editor) {
  dispatch(ActionTypes.EDITORS_MAKE_CURRENT, { id: editor.get('id')});
}

export function save(editor) {
  const id = editor.get("id");
  const path = TreeStore.getPathById(id);
  dispatch(ActionTypes.EDITORS_SAVING_CURRENT, { id: id });

  return rpc.getClient().fs.write(path, editor.content).then(_ => {
    dispatch(ActionTypes.EDITORS_SAVE_CURRENT, { id: id });
  });
}

export function edit(editor, content) {
  dispatch(ActionTypes.EDITORS_EDIT_CURRENT, { id: editor.get('id'), content: content });
}

export function showRunView() {
  dispatch(ActionTypes.EDITORS_SHOW_RUN_VIEW);
};
