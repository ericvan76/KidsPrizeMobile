/* @flow */

import React, { Component } from 'react';
import { ListItem, Text } from 'native-base';
import theme from '../themes';

type Props = {
  title: string
};

class ListItemDivider extends Component {

  props: Props;

  static propTypes = {
    title: React.PropTypes.string
  }

  render() {
    return (
      <ListItem itemDivider
        style={{
          height: 2 * theme.fontSizeBase
        }}>
        <Text
          style={{
            color: theme.subtitleColor,
            fontSize: theme.subTitleFontSize,
            fontWeight: 'normal'
          }}>{this.props.title}</Text>
      </ListItem >
    );
  }
}

export default ListItemDivider;