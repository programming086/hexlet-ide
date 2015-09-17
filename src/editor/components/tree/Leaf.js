import _ from "lodash";

import {openFile} from "editor/actions/TreeActions";

var handleOpenFile = (leaf, e) => {
  e.stopPropagation();
  openFile(leaf);
}

var handleContextMenu = (leaf, props, e) => {
  props.handleContextMenu(e, leaf);
}

const Leaf = (props) => {
    var leaf = props.leaf;
    if (!leaf) return null;

    return (
      <li className="tree-item" data-template="treeitem" role="treeitem"
          onContextMenu={handleContextMenu.bind(this, leaf, props)}
          onClick={handleOpenFile.bind(this, leaf)}>
        <a href="#" className="tree-item-name">
          <span className="glyphicon icon-file glyphicon-file"></span>
          <span className="tree-label">{leaf.name}</span>
        </a>
      </li>
    );
};

export default Leaf;
