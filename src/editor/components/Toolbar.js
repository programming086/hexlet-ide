import _ from "lodash";
import React, {Component} from "react/addons";
import {Container} from 'flux/utils';

import IdeStore from "editor/stores/IdeStore";
import IdeActions from "editor/actions/IdeActions";

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
    var cx = React.addons.classSet;
    const buttonType = IdeStore.isConnected() ?
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
    var cx = React.addons.classSet;
    const glyphiconType = IdeStore.isConnected() ?
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
