import React, {Component} from "react/addons";
import {remove} from "editor/actions/TreeActions";

class RemoveFolder extends Component<{}, {}, {}> {
  constructor() {
    super();
    this.handleClose = this.handleClose.bind(this);
    this.handleApply = this.handleApply.bind(this);
  }

  handleClose() {
    this.props.onClose();
  }

  handleApply(e) {
    remove(this.props.options.get("item").get("id"));
  }

  render() {
    var item = this.props.options.get("item");
    return (
     <div className="modal-dialog width-500">
       <div className="modal-content">
         <div className="modal-header">
           <button className="close" onClick={this.handleClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
           <h4 className="modal-title">Remove folder "{item.get("name")}"</h4>
         </div>
         <div className="modal-body">
            <p>A you sure?</p>
         </div>
         <div className="modal-footer">
           <button data-name="Cancel" type="button" className="btn btn-default" onClick={this.handleClose}>Cancel</button>
           <input data-name="Apply" type="submit" onClick={this.handleApply} className="btn btn-danger" value="Apply" />
         </div>
       </div>
      </div>
    );
  }
};

export default RemoveFolder;
