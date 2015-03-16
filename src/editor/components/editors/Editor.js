var React = require("react/addons");
var CodeMirror = require("codemirror");

export default React.createClass({
  componentDidMount() {
    let myCodeMirror = CodeMirror(this.refs.editor.getDOMNode(), {
      lineNumbers: true,
      tabSize: 2,
      extraKeys: {
        Tab: function(cm) {
          let spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces);
        },
        "Shift-Tab": "autocomplete"
      },
      value: this.props.initContent,
      mode: this.props.mode,
      theme: "solarized dark",
      indentWithTabs: false,
      viewportMargin: Infinity
    });

    myCodeMirror.on("change", (CodeMirror, object) => {
      this.props.onChangeValue(myCodeMirror.getValue());
    });

    this.setState({myCodeMirror: myCodeMirror});
  },

  render() {
    return ( <div className={this.props.className} ref="editor"></div>);
  }
});
