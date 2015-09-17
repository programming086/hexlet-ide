import React from "react/addons";

export default (props) => {
    const leaf = props.leaf;
    const handleContextMenu = props.handleContextMenu;
    const handleOpenFile = props.handleOpenFile;

    if (!leaf) return null;

    return (
      <li className="tree-item"
          onContextMenu={e => handleContextMenu(e, leaf)}
          onClick={e => handleOpenFile(e, leaf)}>
        <a href="#" className="tree-item-name">
          <span className="glyphicon icon-file glyphicon-file"></span>
          <span className="tree-label">{leaf.name}</span>
        </a>
      </li>
    );
};
