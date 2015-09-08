import React, {Component} from "react/addons";
import TreeActions from "editor/actions/TreeActions";

class CreateFile extends Component<{}, {}, {}> {
  constructor() {
    super();
    this.handleApply = this.handleApply.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.onClose();
  }

  handleApply(e) {
    TreeActions.createFile(this.props.options.get("parentId"), this.refs.nameInput.getDOMNode().value);
  }

  render() {
    return (
      <div className="modal-dialog width-500">
        <div className="modal-content">
          <div className="modal-header">
            <button className="close" onClick={this.handleClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title">Create file</h4>
          </div>
          <div className="modal-body">
            <input type="text" className="form-control" name="folderName" ref="nameInput" autoFocus={true} />
          </div>
          <div className="modal-footer">
            <button data-name="Cancel" type="button" className="btn btn-default" onClick={this.handleClose}>Cancel</button>
            <input data-name="Apply" type="submit" onClick={this.handleApply} className="btn btn-primary" value="Apply" />
          </div>
        </div>
      </div>
    );
  }
};
export default  CreateFile;
