/* global require module */

var AppDispatcher = require("editor/dispatcher/AppDispatcher");
var IdeConstants = require("editor/constants/IdeConstants");
var ActionTypes = IdeConstants.ActionTypes;
var TreeStore = require("editor/stores/TreeStore");
var rpc = require("editor/lib/RpcClient");

module.exports = {
  // flushTabContent: function(id, content) {
  //     "use strict";
  //     AppDispatcher.dispatch({
  //         actionType: ActionTypes.TABS_FLUSH_CONTENT,
  //         id: id,
  //         content: content
  //     });
  // },

  closeEditor(editor) {
    "use strict";
    AppDispatcher.dispatch({
      actionType: ActionTypes.EDITORS_CLOSE,
      id: editor.id
    });
  },

  makeCurrent(editor) {
    "use strict";
    AppDispatcher.dispatch({
      actionType: ActionTypes.EDITORS_MAKE_CURRENT,
      id: editor.id
    });
  },

  save(editor) {
    "use strict";
    var path = TreeStore.getPathById(editor.id);
    AppDispatcher.dispatch({
      actionType: ActionTypes.EDITORS_SAVING_CURRENT,
      id: editor.id
    });

    return rpc.getClient().fs.write(path, editor.content).then(function() {
      AppDispatcher.dispatch({
        actionType: ActionTypes.EDITORS_SAVE_CURRENT,
        id: editor.id
      });
    });
  },

  edit(editor, content) {
    "use strict";
    AppDispatcher.dispatch({
      actionType: ActionTypes.EDITORS_EDIT_CURRENT,
      id: editor.id,
      content: content
    });
  },

  showRunView() {
    "use strict";
    AppDispatcher.dispatch({
      actionType: ActionTypes.EDITORS_SHOW_RUN_VIEW
    });
  }
};
