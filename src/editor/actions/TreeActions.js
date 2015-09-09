/* global require module */

import path from "path";

import {dispatch} from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from  "editor/constants/IdeConstants";
import TreeStore from "editor/stores/TreeStore";

import rpc from "editor/lib/RpcClient";

export function loadTree() {
  return rpc.getClient().fs.tree().then(function(result) {
    // FIXME check result
    dispatch(ActionTypes.TREE_LOAD, { item: result });
  });
}

export function loadTreeAndOpenFiles(files) {
  loadTree().then(() => {
    files.map((file) => {
      const fileNode = TreeStore.getFileByPath(file);
      if (fileNode) {
        openFile(fileNode);
      }
    })
  });
}

export function toggleFolderState(tree) {
  if (tree.state === "closed") {
    rpc.getClient().fs.tree(tree.path).then(function(result) {
      dispatch(ActionTypes.TREE_OPEN_FOLDER, { id: tree.id, item: result });
    });
  } else {
    dispatch(ActionTypes.TREE_CLOSE_FOLDER, { id: tree.id });
  }
}

export function openFile(item) {
  rpc.getClient().fs.read(item.path).then(function(result) {
    dispatch(ActionTypes.TREE_OPEN_FILE, { item: item, content: result });
  });
}

export function createFolder(parentId, name) {
  var parentFolder = TreeStore.getPathById(parentId);
  rpc.getClient().fs.mkdir(path.join(parentFolder, name)).then(function(result) {
    if (result) {
      dispatch(ActionTypes.TREE_CREATE_FOLDER, { parentId: parentId, item: result });
    }
  });
}

export function remove(id) {
  var folderPath = TreeStore.getPathById(id);
  var files = TreeStore.getFilesForPath(id);
  rpc.getClient().fs.unlink(folderPath).then(function(result) {
    // FIXME check result
    dispatch(ActionTypes.TREE_REMOVE, { id: id, removedFiles: files });
  });
}

export function createFile(parentId, name) {
  var parentFolder = TreeStore.getPathById(parentId);
  rpc.getClient().fs.touch(path.join(parentFolder, name)).then(function(result) {
    if (result) {
      dispatch(ActionTypes.TREE_CREATE_FILE, { parentId: parentId, item: result });
    }
  });
}

export function rename(parentId, name) {
  var parentPath = TreeStore.getPathById(parentId);
  rpc.getClient().fs.rename(parentPath, name).then(function(result) {
    if (result) {
      dispatch(ActionTypes.TREE_RENAME, { parentId: parentId, item: result });
    }
  });
}
