import React from "react/addons";
import _ from "lodash";
import cx from "classnames";

import Leaf from "./Leaf";

const Tree = (props) => {
    const { tree, ...other } = props;
    const handleContextMenu = props.handleContextMenu;
    const handleToggleFolderState = props.handleToggleFolderState;

    if (undefined === tree) {
      return null;
    }

    const children = _.sortBy(tree.children, ["type", "name"]);
    const isOpened = "opened" == tree.state;

    const treeBranchClasses = cx({
      "tree-branch": true,
      "tree-open": isOpened
    });

    const folderIconClasses = cx({
      "glyphicon": true,
      "glyphicon-folder-open": isOpened,
      "glyphicon-folder-close": !isOpened
    });

    const childrenClasses = cx({
      "tree-branch-children": true,
      "hide": !isOpened
    });

    return (
      <li className={treeBranchClasses} data-name={tree.name}
        onContextMenu={e => handleContextMenu(e, tree)}
        onClick={e => handleToggleFolderState(e, tree)}>
        <div className="tree-branch-header">
          <a href="#" className="tree-branch-name" data-name={tree.name}>
            <span className={folderIconClasses} data-name={tree.name}></span>
            <span className="tree-label" data-name={tree.name}>{tree.name}</span>
          </a>
        </div>

        {children !== undefined ?
          <ul className={childrenClasses} role="group">
            {children.map((item) => {
              switch(item.type) {
                case "directory":
                  return <Tree {...other} key={"tree_" + item.id} tree={item} />
                case "file":
                  return <Leaf {...other} key={"leaf_" + item.id} leaf={item} />
                default:
                  throw "xxx"
              }
            })}
          </ul>
          : null}
        </li>
    );
};

export default Tree;
