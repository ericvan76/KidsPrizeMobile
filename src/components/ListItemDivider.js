/* @flow */

import React, { Component } from 'react';
import { ListItem, Text } from 'native-base';
import StyleSheet from 'react-native-extended-stylesheet';
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
      <ListItem itemDivider style={styles.listItem}>
        <Text style={styles.text}>{this.props.title}</Text>
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    height: '2rem'
  },
  text: {
    color: theme.subtitleColor,
    fontSize: theme.subTitleFontSize,
    fontWeight: 'normal'
  }
});

export default ListItemDivider;