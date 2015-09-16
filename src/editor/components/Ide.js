import React, {Component} from "react/addons";
import {Container} from 'flux/utils';

import TreeBox from "editor/components/tree/TreeBox";
import EditorsBox from "editor/components/editors/EditorsBox";
import TerminalsBox from "editor/components/terminals/TerminalsBox";
import ContextMenu from "editor/components/common/ContextMenu";
import Loader from "editor/components/common/Loader";
import PopupBox from "editor/components/PopupBox";

import IdeActions from "editor/actions/IdeActions";
import IdeStore from "editor/stores/IdeStore";


import {globalClick} from "editor/actions/IdeActions"

class Ide extends Component<{}, {}, {}> {

  static getStores(): Array<Store> {
    return [IdeStore];
  }

  static calculateState(prevState) {
    return {
      isLoaded: IdeStore.isLoaded(),
      displayMode: IdeStore.getDisplayMode()
    };
  }

  renderDisplayMode(mode) {
    switch(mode) {
      case "normal":
        return this.renderNormalMode();
      case "terminal":
        return this.renderTerminalMode();
    }
  }

  renderNormalMode() {
    return <div className="container-flow" onMouseDown={globalClick}>
      <TreeBox />
      <div className="right-container">
        <EditorsBox />
        <TerminalsBox />
      </div>
    </div>
  }

  renderTerminalMode() {
    return <div onClick={this.handleGlobalClick}>
      <TerminalsBox showRunView={true} />
    </div>
  }

  render() {
    const isLoaded = this.state.isLoaded;

    if (!isLoaded) {
      return <Loader />;
    }

    const displayMode = this.state.displayMode;

    return (
      <div className="ide-inner">
        <PopupBox />
        <ContextMenu />
        {this.renderDisplayMode(displayMode)}
      </div>
    );
  }
};

export default Container.create(Ide);
