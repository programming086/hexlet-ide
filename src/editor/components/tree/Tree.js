import _ from "lodash";
import React from "react/addons";

import TreeActions from "editor/actions/TreeActions";
import TreeStore from "editor/stores/TreeStore";
import Leaf from "./Leaf";

const cx = React.addons.classSet;

const Tree = React.createClass({
  handleToggleFolderState(tree, e) {
    e.stopPropagation();
    TreeActions.toggleFolderState(tree);
  },

  handleContextMenu(tree, e) {
    this.props.handleContextMenu(e, tree);
  },

  getChildren(tree) {
    return _.sortBy(tree.children, ["type", "name"]);
  },

  render() {
    var { tree, ...other } = this.props;

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
        onContextMenu={this.handleContextMenu.bind(this, tree)} role="treeitem" aria-expanded="false"
        onClick={this.handleToggleFolderState.bind(this, tree)}>
        <div className="tree-branch-header">
          <a href="#" className="tree-branch-name" data-name={tree.name}>
            <span className={folderIconClasses} data-name={tree.name}></span>
            <span className="tree-label" data-name={tree.name}>{tree.name}</span>
          </a>
        </div>

        {tree.children !== undefined ?
          <ul className={childrenClasses} role="group">
            {this.getChildren(tree).map((item) => {
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
  }
});

export default Tree;
