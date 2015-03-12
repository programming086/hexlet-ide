var React = require("react/addons");
var TreeActions = require("editor/actions/TreeActions");

export default React.createClass({
  handleClose() {
    this.props.onClose();
  },

  handleApply(e) {
    TreeActions.createFolder(this.props.options.parentId, this.refs.nameInput.getDOMNode().value);
  },

  render() {
    return (
     <div className="modal-content">
       <div className="modal-header">
         <button className="close" onClick={this.handleClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
         <h4 className="modal-title">Create folder</h4>
       </div>
       <div className="modal-body">
          <input type="text" className="form-control" name="folderName" ref="nameInput" autoFocus={true} />
       </div>
       <div className="modal-footer">
         <button data-name="Cancel" type="button" className="btn btn-default" onClick={this.handleClose}>Cancel</button>
         <input data-name="Apply" type="submit" onClick={this.handleApply} className="btn btn-primary" value="Apply" />
       </div>
     </div>
    );
  },
});

