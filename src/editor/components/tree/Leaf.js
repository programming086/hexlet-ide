var _ = require("lodash");
var React = require("react/addons");

var TreeActions = require("editor/actions/TreeActions");

var Leaf = React.createClass({
  handleOpenFile: function(leaf, e) {
    e.stopPropagation();
    TreeActions.openFile(leaf);
  },

  handleContextMenu: function(leaf, e) {
    this.props.handleContextMenu(e, leaf);
  },

  render: function() {
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
});

module.exports = Leaf;
