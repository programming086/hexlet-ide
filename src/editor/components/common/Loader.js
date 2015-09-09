import React, {Component} from "react/addons";

class Loader extends Component {
  state = { frame: 0,
            timer: undefined }

  componentDidMount() {
    this.tick();
  }

  tick() {
    var frame = this.state.frame;
    var newFrame = frame > 7 ? 1 : frame + 1;
    this.setState({ frame: newFrame });
    this.setState({ timer: setTimeout(this.tick.bind(this), 300) });
  }

  render() {
    return <div className="">
      <div className="loader" data-initialize="loader" data-frame={this.state.frame}></div>
    </div>;
  }

  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }
};

export default Loader;
