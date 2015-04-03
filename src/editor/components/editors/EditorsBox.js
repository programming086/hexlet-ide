var _ = require("lodash");
var React = require("react/addons");
var key = require("keymaster");

var WatchStoreMixin = require("editor/mixins/WatchStore");

var Editor = require("./Editor");
var RunView = require("editor/components/common/tab/RunView");
var Toolbar = require("editor/components/Toolbar");

var EditorsStore = require("editor/stores/EditorsStore");
var EditorsActions = require("editor/actions/EditorsActions");

var EditorsBox = React.createClass({
  mixins: [ WatchStoreMixin(EditorsStore) ],

  getFluxState: function() {
    return {
      editors: EditorsStore.getAll(),
      current: EditorsStore.getCurrent(),
      isRunViewActive: EditorsStore.isRunViewActive()
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
    var cx = React.addons.classSet;

    var editors = this.state.editors;
    var current = this.state.current;

    var runResultClasses = cx({
      // "active": this.state.isRunViewActive,
      "run-view-tab": true
    });

    var items = editors.map(function(editor) {
      var classes = cx({
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
              <Toolbar />
            </li>
          </ul>
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
      "java": "clike",
      "class": "clike",
      "jar": "clike",
      "clj": "clojure",
      "erl": "erlang",
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
      "c": "clike",
      "c++": "clike",
      "txt": "text",
      "yml": "yaml",
      "yaml": "yaml",
      "hs": "haskell",
      "lhs": "haskell",
      "pl": "perl",
      "php": "php",
      "scala": {name: "clike", mode: "scala"},

      "": "text"
    };

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
