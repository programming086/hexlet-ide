import React, {Component} from "react/addons";
import {rename} from "editor/actions/TreeActions";

class Rename extends Component<{}, {}, {}> {
  constructor() {
    super();
    this.handleClose = this.handleClose.bind(this);
    this.handleApply = this.handleApply.bind(this);
  }

  handleClose() {
    this.props.onClose();
  }

  handleApply(e) {
    console.log(this);
    rename(this.props.options.get("item").get("id"), this.refs.nameInput.value);
  }

  render() {
    var item = this.props.options.get("item");

    return (
     <div className="modal-dialog width-500">
       <div className="modal-content">
         <div className="modal-header">
           <button className="close" onClick={this.handleClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
           <h4 className="modal-title">Rename "{item.get("name")}"</h4>
         </div>
         <div className="modal-body">
            <input type="text" className="form-control" name="folderName" ref="nameInput" defaultValue={item.get("name")} autoFocus={true} />
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

export default Rename;
