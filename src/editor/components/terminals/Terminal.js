var React = require("react/addons");
var TerminalsActions = require('editor/actions/TerminalsActions');

export default React.createClass({
  render() {
    return (
      <div className="row max-height">
        <div className="col-xs-12 max-height">
          <iframe className="terminal-frame" name="terminalFrame" ref="terminalFrame" />
          <div className="max-height" ref="terminal"></div>
        </div>
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

    this.refs.terminalFrame.onresize = function(){
      this.terminalResize();
    }.bind(this);
  }
});
