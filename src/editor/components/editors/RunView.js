// var Escaper = require("escaper.js");
var React = require("react/addons");
var RunViewStore = require("editor/stores/RunViewStore");
var WatchStoreMixin = require("editor/mixins/WatchStore");
var IdeActions = require("editor/actions/IdeActions");

var cx = React.addons.classSet;

// var escaper = new Escaper();

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
    // return escaper.escape(this.state.content);
  },

  getStatusText() {
    if (!this.state.isFinished) {
      return "progress";
    }
    return this.state.isSuccess ? "success" : "fail";
  },

  getResultClasses() {
    return cx({
      "alert": true,
      "alert-success": this.state.isFinished && this.state.isSuccess,
      "alert-danger": this.state.isFinished && !this.state.isSuccess,
    });
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.content !== this.state.content ||
        prevState.isFinished !== this.state.isFinished) {
      this.scrollBottom(this.refs.content.getDOMNode());
    }
  },

  scrollBottom(el) {
    el.scrollTop = el.scrollHeight;
  },

  render() {
    return (
      <div {...this.props}>
       <div className="scrollable" ref="content">
        <pre className="run-result-content" dangerouslySetInnerHTML={{ __html: this.getContent() }}></pre>
        { this.state.isFinished ?
           <div className={this.getResultClasses()}>
             <h4>Run result ({this.getStatusText()})</h4>
           </div>
           : "" }
       </div>
     </div>
    );
  },
});

