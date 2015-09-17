import React, {Component} from "react/addons";
import {Container} from "flux/utils";

import PopupStore from "editor/stores/PopupStore";
import {closePopup} from "editor/actions/PopupActions";

import CreateFolder from "editor/components/popup/CreateFolder";
import CreateFile from "editor/components/popup/CreateFile";
import RemoveFolder  from "editor/components/popup/RemoveFolder";
import RemoveFile from "editor/components/popup/RemoveFile";
import Rename from "editor/components/popup/Rename";
import MarkdownView from "editor/components/popup/MarkdownView";
import RunView from "editor/components/popup/RunView";
import ReconnectView from "editor/components/popup/ReconnectView";

class PopupBox extends Component<{}, {}, {}> {

  static getStores() {
    return [PopupStore];
  }

  static calculateState(prevState) {
    return {
      isOpened: PopupStore.isOpened(),
      type: PopupStore.type(),
      options: PopupStore.options()
    };
  }

  render() {
    if (!this.state.isOpened)
      return null;

    return (
      <div>
        <div className="modal fade in" style={{ display: "block" }}>
          {this.renderCurrentModal()}
        </div>
      </div>
    );
  }

  renderCurrentModal() {
    switch(this.state.type) {
      case "create_folder": return <CreateFolder options={this.state.options} onClose={this.onClose} />;
      case "create_file": return <CreateFile options={this.state.options} onClose={this.onClose} />;
      case "remove_folder": return <RemoveFolder options={this.state.options} onClose={this.onClose} />;
      case "remove_file": return <RemoveFile options={this.state.options} onClose={this.onClose} />;
      case "rename": return <Rename options={this.state.options} onClose={this.onClose} />;
      case "markdown_view": return <MarkdownView options={this.state.options} onClose={this.onClose} />;
      case "run_view": return <RunView options={this.state.options} onClose={this.onClose} />;
      case "reconnect_view": return <ReconnectView options={this.state.options} onClose={this.onClose} />;
      default: throw "Bad modal type!";
    }
  }

  onClose() {
    closePopup();
  }
};

export default Container.create(PopupBox);
