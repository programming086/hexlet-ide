import _ from "lodash";
import React, { Component } from "react/addons";

import KeyboardActions from "editor/actions/KeyboardActions";

class Editor extends Component<{}, {}, {}> {
  componentDidMount() {
    const { initContent, mode, onChangeValue } = this.props;
    const editorEl = this.refs.editor;

    const editor = CodeMirror(editorEl, {
      lineNumbers: true,
      extraKeys: {
        "Ctrl-[": KeyboardActions.ctrl_open_square_br,
        "Ctrl-]": KeyboardActions.ctrl_close_square_br,
        "Shift-Tab": "autocomplete"
      },
      value: initContent,
      mode: mode,
      indentUnit: mode.indentUnit || 2,
      theme: "solarized dark",
      indentWithTabs: mode.indentWithTabs || false,
      viewportMargin: Infinity
    });

    editor.on("change", _.throttle((CodeMirror, object) => {
      onChangeValue(editor.getValue());
      editor.scrollIntoView();
    }, 2000));

    this.setState({ editor: editor });
  }

  componentDidUpdate(oldProps) {
    if (this.props.focus) {
      this.state.editor.refresh();

      if (!oldProps.focus) {
        this.state.editor.focus();
      }
    }

  }

  render() {
    return ( <div className={this.props.className} ref="editor"></div>);
  }
}

export default Editor;
