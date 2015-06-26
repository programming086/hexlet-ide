/* global require module */

var path = require("path");

var AppDispatcher = require("editor/dispatcher/AppDispatcher");
var IdeConstants = require("editor/constants/IdeConstants");
var TreeStore = require("editor/stores/TreeStore");

var rpc = require("editor/lib/RpcClient");

var ActionTypes = IdeConstants.ActionTypes;


var TreeActions = {
  loadTree() {
    return rpc.getClient().fs.tree().then(function(result) {
      // FIXME check result
      AppDispatcher.dispatch({
        actionType: ActionTypes.TREE_LOAD,
        item: result
      });
    });
  },

  loadTreeAndOpenFiles(files) {
    this.loadTree().then(() => {
      files.map((file) => {
        const fileNode = TreeStore.getFileByPath(file);
        this.openFile(fileNode);
      })
    });
  },

  toggleFolderState(tree) {
    if (tree.state === "closed") {
      rpc.getClient().fs.tree(tree.path).then(function(result) {
        AppDispatcher.dispatch({
          actionType: ActionTypes.TREE_OPEN_FOLDER,
          id: tree.id,
          item: result
        });
      });
    } else {
      AppDispatcher.dispatch({
        actionType: ActionTypes.TREE_CLOSE_FOLDER,
        id: tree.id
      });
    }
  },

  openFile(item) {
    rpc.getClient().fs.read(item.path).then(function(result) {
      AppDispatcher.dispatch({
        actionType: ActionTypes.TREE_OPEN_FILE,
        item: item,
        content: result
      });
    });
  },

  createFolder(parentId, name) {
    var parentFolder = TreeStore.getPathById(parentId);
    rpc.getClient().fs.mkdir(path.join(parentFolder, name)).then(function(result) {
      if (result) {
        AppDispatcher.dispatch({
          actionType: ActionTypes.TREE_CREATE_FOLDER,
          parentId: parentId,
          item: result
        });
      }
    });
  },

  remove(id) {
    var folderPath = TreeStore.getPathById(id);
    var files = TreeStore.getFilesForPath(id);
    rpc.getClient().fs.unlink(folderPath).then(function(result) {
      // FIXME check result
      AppDispatcher.dispatch({
        actionType: ActionTypes.TREE_REMOVE,
        id: id,
        removedFiles: files
      });
    });
  },

  createFile(parentId, name) {
    var parentFolder = TreeStore.getPathById(parentId);
    rpc.getClient().fs.touch(path.join(parentFolder, name)).then(function(result) {
      if (result) {
        AppDispatcher.dispatch({
          actionType: ActionTypes.TREE_CREATE_FILE,
          parentId: parentId,
          item: result
        });
      }
    });
  },

  rename(parentId, name) {
    var parentPath = TreeStore.getPathById(parentId);
    rpc.getClient().fs.rename(parentPath, name).then(function(result) {
      if (result) {
        AppDispatcher.dispatch({
          actionType: ActionTypes.TREE_RENAME,
          parentId: parentId,
          item: result
        });
      }
    });
  }
};

module.exports = TreeActions;
