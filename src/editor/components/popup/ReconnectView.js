var React = require("react/addons");

export default React.createClass({
  handleClose() {
    this.props.onClose();
  },

  render() {
    return (
     <div className="modal-dialog width-900">
       <div className="modal-content">
         <div className="modal-header">
           <h4 className="modal-title">Connect error</h4>
         </div>
         <div className="modal-body">
          <p>Sorry, IDE was disconnected. Please, try to reload page.</p>
         </div>
       </div>
      </div>
    );
  },
});

