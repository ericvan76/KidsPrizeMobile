/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';

import theme from '../themes';

class Seperator extends Component {

  render() {
    return (
      <View
        style={{
          height: theme.borderWidth,
          alignSelf: 'stretch',
          backgroundColor: theme.listDividerBg
        }}
        {...this.props} />
    );
  }
}

export default Seperator;