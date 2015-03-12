var markdown = require("markdown").markdown;

var React = require("react/addons");
var TreeActions = require("editor/actions/TreeActions");

export default React.createClass({
  getContent() {
    return markdown.toHTML( this.props.options.content );
  },
  handleClose() {
    this.props.onClose();
  },
  render() {
    return (
     <div className="modal-content">
       <div className="modal-header">
         <button className="close" onClick={this.handleClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
         <h4 className="modal-title">{this.props.options.title}</h4>
       </div>
       <div className="modal-body" dangerouslySetInnerHTML={{ __html: this.getContent() }}></div>
       <div className="modal-footer">
         <button data-name="Cancel" type="button" className="btn btn-default" onClick={this.handleClose}>Cancel</button>
       </div>
     </div>
    );
  },
});

