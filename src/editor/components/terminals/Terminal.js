import _ from "lodash";
import React, { Component } from "react/addons";

var TerminalsActions = require('editor/actions/TerminalsActions');

export default class extends Component {
  render() {
    return <div className="terminal" ref="terminal"></div>;
  }

  terminalResize() {
    const {terminal} = this.props;
    terminal.terminal.fit();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.terminal.current) {
      this.terminalResize();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const {terminal} = this.props;

    terminal.terminal.removeAllListeners("data");
    terminal.terminal.removeAllListeners("resize");
    terminal.terminal.removeAllListeners("open");

    terminal.terminal.on("open", this.terminalResize.bind(this));
    terminal.terminal.on("data", (data) => {
      TerminalsActions.startUpdateTerminal({
        id: terminal.id,
        data: data
      });
    });

    terminal.terminal.on("resize", (data) => {
      TerminalsActions.resize({
        id: terminal.id,
        cols: data.cols,
        rows: data.rows
      });
    });

    const node = React.findDOMNode(this.refs.terminal);
    terminal.terminal.open(node);
  }
}
