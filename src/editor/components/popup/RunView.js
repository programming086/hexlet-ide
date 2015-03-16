var React = require("react/addons");
var RunViewStore = require("editor/stores/RunViewStore");
var WatchStoreMixin = require("editor/mixins/WatchStore");
var IdeActions = require("editor/actions/IdeActions");

var cx = React.addons.classSet;

export default React.createClass({
  mixins: [WatchStoreMixin(RunViewStore)],

  getFluxState() {
    return {
      content: RunViewStore.getContent(),
      isFinished: RunViewStore.isFinished(),
      isSuccess: RunViewStore.isSuccess(),
      code: RunViewStore.getCode()
    };
  },

  getContent() {
    return this.state.content;
  },

  getStatusText() {
    if (!this.state.isFinished) {
      return "progress";
    }
    return this.state.isSuccess ? "puccess" : "fail";
  },

  getHeaderClasses() {
    return cx({
      "modal-header": true,
      "alert-success": this.state.isFinished && this.state.isSuccess,
      "alert-danger": this.state.isFinished && !this.state.isSuccess,
    });
  },

  handleClose() {
    this.props.onClose();
  },

  handleSubmit() {
    IdeActions.submitResult();
  },

  render() {
    return (
     <div className="modal-dialog width-900">
       <div className="modal-content">
         <div className={this.getHeaderClasses()}>
           <h4 className="modal-title">Run result ({this.getStatusText()})</h4>
         </div>
         <div className="modal-body">
          <pre dangerouslySetInnerHTML={{ __html: this.getContent() }}></pre>
         </div>
         <div className="modal-footer">
            { this.state.isFinished && this.state.isSuccess ?
             <button data-name="Submit" type="button" className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
             : ""}
             <button data-name="Close" type="button" className="btn btn-default" onClick={this.handleClose}>Close</button>
         </div>
       </div>
      </div>
    );
  },
});

