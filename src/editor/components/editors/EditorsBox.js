const _ = require("lodash");
const React = require("react/addons");
const key = require("keymaster");
import cx from "classnames";

const WatchStoreMixin = require("editor/mixins/WatchStore");

const Editor = require("./Editor");
const RunView = require("editor/components/common/tab/RunView");
const Toolbar = require("editor/components/common/Toolbar");
const ReconnectionStatusBar = require("editor/components/ReconnectionStatusBar");

const EditorsStore = require("editor/stores/EditorsStore");
const IdeStore = require("editor/stores/IdeStore");
const EditorsActions = require("editor/actions/EditorsActions");

const EditorsBox = React.createClass({
  mixins: [ WatchStoreMixin(EditorsStore) ],

  getFluxState: function() {
    return {
      editors: EditorsStore.getAll(),
      current: EditorsStore.getCurrent(),
      isRunViewActive: EditorsStore.isRunViewActive(),
      ideIsConnected: IdeStore.isConnected()
    }
  },

  handleChangeEditorValue: function(current, content) {
    EditorsActions.edit(current, content);
  },

  handleSaveFile: function(e) {
    EditorsActions.save(this.state.current);
  },

  selectEditor: function(editor, e) {
    e.stopPropagation();
    e.preventDefault();
    EditorsActions.makeCurrent(editor);
  },

  handleCloseTab: function(editor, e) {
    e.stopPropagation();
    e.preventDefault();
    EditorsActions.closeEditor(editor);
  },

  showRunView(e) {
    e.stopPropagation();
    e.preventDefault();
    EditorsActions.showRunView();
  },

  render: function() {
    var editors = this.state.editors;
    var current = this.state.current;

    var runResultClasses = cx({
      // "active": this.state.isRunViewActive,
      "run-view-tab": true
    });

    var items = editors.map(function(editor) {
      const classes = cx({
        "active": editor.current
      });

      return (<li key={"editor_" + editor.id} className={classes} role="presentation">
        <a href="#" onClick={this.selectEditor.bind(this, editor)} className={classes}>
          <span>
            {editor.name} {editor.dirty ? "*" : ""}
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
            {editors.map(function(editor) {
              var mode = this.getEditorMode(editor.name);
              var classes = cx({
                "tab-pane": true,
                "fade active in": editor.current,
                "editor": true
              });

              return (
                  <Editor mode={mode}
                    className={classes}
                    key={editor.id}
                    focus={editor.current}
                    onChangeValue={this.handleChangeEditorValue.bind(this, editor)}
                    initContent={editor.content} />
                );
            }, this)}
          </div>
        </div>
    );
  },

  getEditorMode: function(fileName) {
    var modes = {
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

    var fNameStruct = fileName.split(".");
    var extension = fNameStruct.length > 1 ? _.last(fNameStruct) : "";

    var mode = modes[extension];
    if (!mode) {
      console.warn("Mode for file: ",  fileName, " is not defined");
      return "javascript";
    }

    return mode;
  },

  componentWillUpdate: function(nextProps, nextState) {
    var $this = this;

    if (nextState.current === undefined) {
      key.unbind("ctrl+s");
    } else {
      key("ctrl+s", function(){ $this.handleSaveFile(); return false });
    }
  }
});

module.exports = EditorsBox;
