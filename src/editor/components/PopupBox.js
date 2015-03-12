var React = require("react/addons");
var PopupStore = require("editor/stores/PopupStore");
var PopupActions = require("editor/actions/PopupActions");

var WatchStoreMixin = require("editor/mixins/WatchStore");

var CreateFolder = require("editor/components/popup/CreateFolder");
var CreateFile = require("editor/components/popup/CreateFile");
var RemoveFolder  = require("editor/components/popup/RemoveFolder");
var RemoveFile = require("editor/components/popup/RemoveFile");
var Rename = require("editor/components/popup/Rename");
var MarkdownView = require("editor/components/popup/MarkdownView");

export default React.createClass({
  mixins: [WatchStoreMixin(PopupStore)],

  getFluxState() {
    return {
      isOpened: PopupStore.isOpened(),
      type: PopupStore.getType(),
      options: PopupStore.getOptions()
    };
  },

  render() {
    if (!this.state.isOpened)
      return null;

    return (
      <div>
        <div className="modal-backdrop fade in"></div>
        <div className="modal fade in" style={{ display: "block" }}>
          <div className="modal-dialog">
            {this.renderCurrentModal()}
          </div>
        </div>
      </div>
    );
  },

  renderCurrentModal() {
    switch(this.state.type) {
      case "create_folder": return <CreateFolder options={this.state.options} onClose={this.onClose} />;
      case "create_file": return <CreateFile options={this.state.options} onClose={this.onClose} />;
      case "remove_folder": return <RemoveFolder options={this.state.options} onClose={this.onClose} />;
      case "remove_file": return <RemoveFile options={this.state.options} onClose={this.onClose} />;
      case "rename": return <Rename options={this.state.options} onClose={this.onClose} />;
      case "markdown_view": return <MarkdownView options={this.state.options} onClose={this.onClose} />;
      default: throw "Bad modal type!";
    }
  },

  onClose() {
    PopupActions.close();
  }
});
