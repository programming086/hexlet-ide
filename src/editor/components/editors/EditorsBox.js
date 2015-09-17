import _ from "lodash";
import key from "keymaster";
import cx from "classnames";

import React, {Component} from "react/addons";
import {Container} from 'flux/utils';

import Editor from "./Editor";
import RunView from "editor/components/common/tab/RunView";
import Toolbar from "editor/components/common/Toolbar";
import ReconnectionStatusBar from "editor/components/ReconnectionStatusBar";

import EditorsStore from "editor/stores/EditorsStore";
import IdeStore from "editor/stores/IdeStore";
import {
  edit,
  save,
  makeCurrent,
  closeEditor,
  showRunView
} from "editor/actions/EditorsActions";

class EditorsBox extends Component<{}, {}, {}> {

  static getStores(): Array<Store> {
    return [EditorsStore, IdeStore];
  }

  static calculateState(prevState) {
    return {
      editors: EditorsStore.getAll(),
      current: EditorsStore.getCurrent(),
      isRunViewActive: EditorsStore.isRunViewActive(),
      ideIsConnected: IdeStore.isConnected()
    };
  }

  handleChangeEditorValue(current, content) {
    edit(current, content);
  }

  handleSaveFile(e) {
    save(this.state.current);
  }

  selectEditor(editor, e) {
    e.stopPropagation();
    e.preventDefault();
    makeCurrent(editor);
  }

  handleCloseTab(editor, e) {
    e.stopPropagation();
    e.preventDefault();
    closeEditor(editor);
  }

  showRunView(e) {
    e.stopPropagation();
    e.preventDefault();
    showRunView();
  }

  render() {
    const editors = this.state.editors;
    const current = this.state.current;

    const runResultClasses = cx({
      // "active": this.state.isRunViewActive,
      "run-view-tab": true
    });

    const items = editors.map((editor) => {
      const classes = cx({
        "active": editor.get('current')
      });

      return (<li key={"editor_" + editor.get('id')} className={classes} role="presentation">
        <a href="#" onClick={this.selectEditor.bind(this, editor)} className={classes}>
          <span>
            {editor.get("name")} {editor.get('dirty') ? "*" : ""}
          </span>
          <button type="button" className="close" onClick={this.handleCloseTab.bind(this, editor)}>
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">
              Close
            </span>
          </button>
        </a>
      </li>);
    }, this);


    var runViewPaneClasses = cx({
      "tab-pane": true,
      "fade active in": this.state.isRunViewActive,
      "run-view": true
    });

    return (
      <div className="editors-box">
        <ul className="nav nav-tabs" role="tablist">
          <li key={"run-result"} className={runResultClasses} role="presentation">
            <a href="#" onClick={this.showRunView} className={runResultClasses}>
              <span>Output</span>
            </a>
          </li>
          {items}
          <li className="pull-right">
            <Toolbar isConnected={this.state.ideIsConnected} />
          </li>
        </ul>
        <ReconnectionStatusBar />
        <div className="tab-content file-content">
          <RunView className={runViewPaneClasses} />
          {editors.map((editor) => {
            const mode = this.getEditorMode(editor.get('name'));
            const classes = cx({
              "tab-pane": true,
              "fade active in": editor.get('current'),
              "editor": true
            });

            return (
              <Editor mode={mode}
                className={classes}
                key={editor.get('id')}
                focus={editor.get('current')}
                onChangeValue={this.handleChangeEditorValue.bind(this, editor)}
                initContent={editor.get('content')} />
              );
          }, this)}
        </div>
      </div>
      );
  }

  getEditorMode(fileName) {
    const modes = {
      "js": "javascript",
      "go": "go",
      "rs": "rust",
      "json": {name: "javascript", mode: "json"},
      "java": {name: "text/x-java", indentUnit: 4, indentWithTabs: true },
      "class": "text/x-java",
      "jar": "text/x-java",
      "clj": "clojure",
      "erl": "erlang",
      "make": {name: "text/x-cmake", indentUnit: 4, indentWithTabs: true },
      "html": "htmlmixed",
      "xml": "xml",
      "css": "css",
      "rkt": "scheme",
      "ss": "scheme",
      "scm": "scheme",
      "sch": "scheme",
      "jade": "jade",
      "py": "python",
      "rb": "ruby",
      "c": "text/x-csrc",
      "c++": "text/x-c++src",
      "txt": "text",
      "yml": "yaml",
      "yaml": "yaml",
      "hs": "haskell",
      "lhs": "haskell",
      "pl": "perl",
      "php": {name: "php", indentUnit: 4, indentWithTabs: false },
      "scala": "text/x-scala",
      "sql": "text/x-sql",
      "": "text"
    };

    if (fileName === "Makefile") {
      return modes["make"];
    }

    const fNameStruct = fileName.split(".");
    const extension = fNameStruct.length > 1 ? _.last(fNameStruct) : "";

    const mode = modes[extension];
    if (!mode) {
      console.warn("Mode for file: ",  fileName, " is not defined");
      return "javascript";
    }

    return mode;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.current === undefined) {
      key.unbind("ctrl+s");
    } else {
      key("ctrl+s", () => { this.handleSaveFile(); return false });
    }
  }
  };

  export default Container.create(EditorsBox);
