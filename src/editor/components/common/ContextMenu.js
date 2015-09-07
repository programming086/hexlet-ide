import _ from "lodash";
import React, {Component} from "react/addons";
import {Container} from 'flux/utils';

import ContextMenuStore from "editor/stores/ContextMenuStore";

class ContextMenu extends Component<{}, {}, {}> {
  static contextTypes = {
    router: React.PropTypes.func
  }

  static getStores(): Array<Store> {
    return [ContextMenuStore];
  }

  static calculateState(prevState) {
    return {
      contextMenuStore: ContextMenuStore.getState()
    };
  }

  render() {
    const isVisible = this.state.contextMenuStore.get('isVisible');

    if (!isVisible) return null;

    const coords = this.state.contextMenuStore.get('coords');
    const options = this.state.contextMenuStore.get('options');

    const menuStyle = {
      position: "fixed",
      zIndex: 100,
      top: coords.get('y'),
      left: coords.get('x')
    };

    const optionsItems = options.reduce(function(acc, group, index, array) {
      const boundedGroup = group.map(function(item) {
        const title = item.get('title');
        const onClick = item.get('onClick');
        return <li key={title}><a href="#" data-name={title} onClick={this.clickHandler(onClick)}>{title}</a></li>;
      }, this);

      const boundedGroup1 = array.count() != index + 1
      ? boundedGroup.push(<li key={"divider_" + index} className="divider"></li>)
      : boundedGroup;

      return acc.concat(boundedGroup);
    }.bind(this), []);


    return (
      <div style={menuStyle} className="open context-menu">
        <ul className="dropdown-menu" role="menu">
          {optionsItems}
        </ul>
      </div>
    );
  }

  clickHandler(onClick) {
    return function(e) {
      e.preventDefault();
      onClick();
    }
  }
};

export default Container.create(ContextMenu);
