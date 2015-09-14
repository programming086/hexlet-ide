import _ from "lodash";
import cx from "classnames";
import React, {Component} from "react/addons";
import {Container} from 'flux/utils';

class Toolbar extends Component<{}, {}, {}> {
  render() {
    return (
      <div className="toolbar">
        <div className="btn-group" role="group">
          <div className={this.getStatusClasses()}>
            <span className={this.getStatusInnerClasses()} />
          </div>
        </div>
      </div>
    );
  }

  getStatusClasses() {
    const buttonType = this.props.isConnected ?
      "connected" :
      "disconnected";
    const classes = {
      "status-indicator": true,
      "pull-right": true
    };
    classes[buttonType] = true;
    return cx(classes);
  }

  getStatusInnerClasses() {
    const glyphiconType = this.props.isConnected ?
      "glyphicon-record" :
      "glyphicon-remove-circle";
    const classes = {
      "glyphicon": true
    };
    classes[glyphiconType] = true;
    return cx(classes);
  }
};

export default Toolbar;
