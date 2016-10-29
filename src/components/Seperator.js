/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

import theme from '../themes';

class Seperator extends Component {

  static propTypes = {
    ...View.propTypes
  }

  render() {
    return <View {...this.props} style={[styles.container, this.props.style]} />;
  }
}

const styles = StyleSheet.create({
  container: {
    height: theme.borderWidth,
    alignSelf: 'stretch',
    backgroundColor: theme.listDividerBg
  }
});

export default Seperator;