import React, { Component } from "react/addons";

import {
  startUpdateTerminal,
  resize
} from "editor/actions/TerminalsActions";

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
      startUpdateTerminal({
        id: terminal.id,
        data: data
      });
    });

    terminal.terminal.on("resize", (data) => {
      resize({
        id: terminal.id,
        cols: data.cols,
        rows: data.rows
      });
    });

    const node = this.refs.terminal;
    terminal.terminal.open(node);
  }
}
