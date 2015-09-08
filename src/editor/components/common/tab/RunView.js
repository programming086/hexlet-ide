import cx from "classnames";
import React, {Component} from "react/addons";
import {Container} from 'flux/utils';

import RunViewStore from "editor/stores/RunViewStore";


class RunView extends Component {
  static getStores(): Array<Store> {
    return [RunViewStore];
  }

  static calculateState(prevState) {
    return {
      content: RunViewStore.getContent(),
      isFinished: RunViewStore.isFinished(),
      isSuccess: RunViewStore.isSuccess(),
      code: RunViewStore.getCode()
    };
  }

  getContent() {
    return this.state.content;
  }

  getStatusText() {
    if (!this.state.isFinished) {
      return "progress";
    }
    return this.state.isSuccess ? "success" : "fail";
  }

  getResultClasses() {
    return cx({
      "alert": true,
      "alert-success": this.state.isFinished && this.state.isSuccess,
      "alert-danger": this.state.isFinished && !this.state.isSuccess,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.content !== this.state.content ||
        prevState.isFinished !== this.state.isFinished) {
      const contentBox = React.findDOMNode(this.refs.content);
      this.scrollBottom(contentBox);
    }
  }

  scrollBottom(el) {
    el.scrollTop = el.scrollHeight;
  }

  render() {
    return (
      <div {...this.props}>
       <div className="scrollable" ref="content">
        <pre className="run-result-content" dangerouslySetInnerHTML={{ __html: this.getContent() }}></pre>
        { this.state.isFinished && !this.state.isSuccess ?
          <h5 className="run-failed-text">Run failed! Check and fix errors above!</h5>
         : "" }
       </div>
     </div>
    );
  }
};

export default Container.create(RunView);
