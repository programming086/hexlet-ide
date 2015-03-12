var React = require("react/addons");
var TerminalsActions = require('editor/actions/TerminalsActions');

export default React.createClass({
  render() {
    return (
        <div className={this.props.className} ref="terminal">
        </div>
    );
  },

  terminalResize() {
    var terminal = this.props.terminal;
    terminal.terminal.fit();
  },

  shouldComponentUpdate() {
    return false;
  },

  componentDidMount() {
    var terminal = this.props.terminal;

    terminal.terminal.on("data", function(data) {
      TerminalsActions.startUpdateTerminal({
        id: terminal.id,
        data: data
      });
    });

    terminal.terminal.on("open", () => {
      this.terminalResize();
    });

    terminal.terminal.on("resize", function(data) {
      TerminalsActions.resize({
        id: terminal.id,
        cols: data.cols,
        rows: data.rows
      });
    });

    terminal.terminal.open(this.refs.terminal.getDOMNode());

    // this.refs.terminalFrame.onresize = function(){
    //   this.terminalResize();
    // }.bind(this);
  }
});
