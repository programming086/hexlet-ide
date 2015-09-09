/* global require module Exception */
import _ from "lodash";
import TreeModel from "tree-model";
import {ReduceStore} from "flux/utils";
import shared from "shared";

import dispatcher from "editor/dispatcher/AppDispatcher";
import {ActionTypes} from "editor/constants/IdeConstants";

const tree = new TreeModel(shared.treeOptions);
var root;

class TreeStore extends ReduceStore {
  getInitialState() {
    return root;
  }

  getState() {
    return root;
  }

  getRoot() {
    return root !== undefined ? root.model : root;
  }

  getFileByName(name) {
    let node = root.first((node) => {
      return node.model.type == "file" && node.model.name == name;
    });
    return node.model;
  }

  getFileByPath(path) {
    let node = root.first((node) => {
      return node.model.type == "file" && _.contains(node.model.path, path);
    });
    return node.model;
  }

  getPathById(id) {
    let node = root.first(function(node) { return node.model.id === id; });
    return node.getPath().map(function(node){ return node.model.name; }).join("/");
  }

  getFilesForPath(id) {
    var parentNode = root.first(function(node) { return node.model.id === id; });
    if (parentNode.model.type === "file") {
      return [parentNode.model.id];
    } else if (parentNode.model.type === "directory") {
      return parentNode.all(function(node) {
        return node.model.type === "file";
      }).map(function(node) {
        return node.model.id;
      });
    }
  }

  reduce(state, action) {
    switch (action.actionType) {
      case ActionTypes.TREE_LOAD:
        var item = action.item;
        root = tree.parse(item);
        break;

      case ActionTypes.TREE_CLOSE_FOLDER:
        var id = action.id;
        var node = root.first((node) => { return node.model.id === id; });
        var model = node.model;
        model.state = "closed"
        break;

      case ActionTypes.TREE_OPEN_FOLDER:
        var id = action.id;
        var node = root.first((node) => { return node.model.id === id });
        var item = action.item;
        if (node.isRoot()) {
          root = tree.parse(item);
        } else {
          var parent = node.parent;
          node.drop();
          var newNode = tree.parse(item);
          parent.addChild(newNode);
        }
        break;

      case ActionTypes.TREE_CREATE_FOLDER:
        var parentId = action.parentId;
        var item = action.item;
        var node = root.first((node) => { return node.model.id === parentId; });
        var newNode = tree.parse(item);
        node.addChild(newNode);
        break;

      case ActionTypes.TREE_REMOVE:
        var id = action.id;
        var node = root.first((node) => { return node.model.id === id; });
        node.drop();
        break;

      case ActionTypes.TREE_CREATE_FILE:
        var parentId = action.parentId;
        var item = action.item;
        var node = root.first((node) => { return node.model.id === parentId; });
        var newNode = tree.parse(item);
        node.addChild(newNode);
        break;

      case ActionTypes.TREE_RENAME:
        var parentId = action.parentId;
        var item = action.item;
        var node = root.first((node) => { return node.model.id === parentId; });
        _.extend(node.model, item);
        break;

      case ActionTypes.TREE_RELOAD:
        throw "Not implemented!";
        break;

      default:
        return root || null;
    }

    return root;
  }

  areEqual(one, two) {
    return false;
  }
};

export default new TreeStore(dispatcher);
