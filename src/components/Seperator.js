/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';

import theme from '../theme';

class Seperator extends Component {

  render() {
    return (
      <View style={styles.container} {...this.props} />
    );
  }
}

const styles = {
  container: {
    height: theme.variables.borderWidth,
    alignSelf: 'stretch',
    backgroundColor: theme.variables.listDividerBg
  }
};

export default Seperator;