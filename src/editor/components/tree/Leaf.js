import _ from "lodash";
import React, {Component} from "react/addons";

import {openFile} from "editor/actions/TreeActions";

class Leaf extends Component<{}, {}, {}> {
  handleOpenFile(leaf, e) {
    e.stopPropagation();
    openFile(leaf);
  }

  handleContextMenu(leaf, e) {
    this.props.handleContextMenu(e, leaf);
  }

  render() {
    var leaf = this.props.leaf;
    if (!leaf) return null;

    return (
      <li className="tree-item" data-template="treeitem" role="treeitem"
          onContextMenu={this.handleContextMenu.bind(this, leaf)}
          onClick={this.handleOpenFile.bind(this, leaf)}>
        <a href="#" className="tree-item-name">
          <span className="glyphicon icon-file glyphicon-file"></span>
          <span className="tree-label">{leaf.name}</span>
        </a>
      </li>
    );
  }
};

export default Leaf;
