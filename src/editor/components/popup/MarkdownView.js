import marked from "marked";

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});


import React, {Component} from "react/addons";
import TreeActions from "editor/actions/TreeActions";

class MarkdownView extends Component<{}, {}, {}> {
  constructor() {
    super();
    this.handleClose = this.handleClose.bind(this);
  }

  getContent() {
    return marked( this.props.options.get("content") );
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    return (
     <div className="modal-dialog width-90-pcnt">
       <div className="modal-content">
         <div className="modal-header">
           <button className="close" onClick={this.handleClose} aria-label="Close"><span aria-hidden="true">&times;</span></button>
           <h4 className="modal-title">{this.props.options.get("title")}</h4>
         </div>
         <div className="modal-body scrollable" dangerouslySetInnerHTML={{ __html: this.getContent() }}></div>
         <div className="modal-footer">
           <button data-name="Cancel" type="button" className="btn btn-default" onClick={this.handleClose}>Cancel</button>
         </div>
       </div>
     </div>
    );
  }
};

export default MarkdownView;
