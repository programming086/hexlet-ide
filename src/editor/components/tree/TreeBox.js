import React, {Component} from "react/addons";
import {Container} from "flux/utils";

import Tree from "./Tree";
import TreeStore from "editor/stores/TreeStore";

import {openPopup} from "editor/actions/PopupActions";
import {loadTree}  from "editor/actions/TreeActions";
import {
  showContextMenu,
  hideContextMenu
} from "editor/actions/ContextMenuActions";

class TreeBox extends Component<{}, {}, {}> {
  static getStores() {
    return [TreeStore];
  }

  static calculateState() {
    return {
      tree: TreeStore.getRoot()
    };
  }

  componentDidMount() {
    loadTree();
  }

  handleOpenCreateFolderModal(parentId) {
    openPopup("create_folder", { parentId: parentId });
  }

  handleOpenCreateFileModal(parentId) {
    openPopup("create_file", { parentId: parentId });
  }

  handleOpenRenameModal(item) {
    openPopup("rename", { item: item });
  }

  handleOpenRemoveFolderModal(item) {
    openPopup("remove_folder", { item: item });
  }

  handleOpenRemoveFileModal(item) {
    openPopup("remove_file", { item: item });
  }

  handleRefreshTree() {
    loadTree();
    hideContextMenu();
  }

  getContextMenuItems(item) {
    var contextMenuChildren = [];

    contextMenuChildren.push([
      {onClick: this.handleRefreshTree.bind(this), title: "Refresh tree"},
    ]);
    if (item.type === "directory") {
      contextMenuChildren.push([
        {onClick: this.handleOpenCreateFolderModal.bind(this, item.id), title: "New folder"},
        {onClick: this.handleOpenCreateFileModal.bind(this, item.id), title: "New file"}
      ]);

      contextMenuChildren.push([
        {onClick: this.handleOpenRemoveFolderModal.bind(this, item), title: "Remove folder"},
        {onClick: this.handleOpenRenameModal.bind(this, item), title: "Rename"}
      ]);
    }

    if (item.type === "file") {
      contextMenuChildren.push([
        {onClick: this.handleOpenRemoveFileModal.bind(this, item), title: "Remove file"},
        {onClick: this.handleOpenRenameModal.bind(this, item), title: "Rename"}
      ]);
    }

    return contextMenuChildren;
  }

  handleContextMenu(e, item) {
    e.preventDefault();
    e.stopPropagation();
    const coords = {
      x: e.clientX,
      y: e.clientY
    };
    const items = this.getContextMenuItems(item);
    showContextMenu(coords, items);
  }

  render() {
    return (
      <div className="file-tree-box">
        <h3>Folders</h3>
        {this.state.tree ?
          <div className="tree">
            <ul role="tree">
              <Tree key={"tree_" + this.state.tree.id} tree={this.state.tree} handleContextMenu={this.handleContextMenu.bind(this)} />
            </ul>
          </div>
          : null}
        </div>
    );
  }
};

export default Container.create(TreeBox, { pure: false });
