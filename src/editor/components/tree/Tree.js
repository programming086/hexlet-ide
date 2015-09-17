import _ from "lodash";

import {toggleFolderState} from "editor/actions/TreeActions";
import Leaf from "./Leaf";

import cx from "classnames";

var handleToggleFolderState = (tree, e) => {
  e.stopPropagation();
  toggleFolderState(tree);
}

var handleContextMenu = (tree, props, e) => {
  props.handleContextMenu(e, tree);
}

var getChildren = (tree) => {
  return _.sortBy(tree.children, ["type", "name"]);
}

const Tree = (props) => {
    const { tree, ...other } = props;

    if (undefined === tree) {
      return null;
    }

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
      <li className={treeBranchClasses} data-template="treebranch" data-name={tree.name}
        onContextMenu={handleContextMenu.bind(this, tree, props)} role="treeitem" aria-expanded="false"
        onClick={handleToggleFolderState.bind(this, tree)}>
        <div className="tree-branch-header">
          <a href="#" className="tree-branch-name" data-name={tree.name}>
            <span className={folderIconClasses} data-name={tree.name}></span>
            <span className="tree-label" data-name={tree.name}>{tree.name}</span>
          </a>
        </div>

        {tree.children !== undefined ?
          <ul className={childrenClasses} role="group">
            {getChildren(tree).map((item) => {
              switch(item.type) {
                case "directory":
                  return <Tree {...other} key={"tree_" + item.id} tree={item} />
                  break;
                case "file":
                  return <Leaf {...other} key={"leaf_" + item.id} leaf={item} />
                  break;
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
