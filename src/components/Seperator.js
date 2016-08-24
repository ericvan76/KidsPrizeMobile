import React, {Component} from 'react';
import {View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

export default class Seperator extends Component {
  render() {
    return (<View {...this.props} style={[styles.container, this.props.style]}/>);
  }
}

Seperator.propTypes = {
  ...View.propTypes
};

const styles = StyleSheet.create({
  container: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: '$seperator.color'
  }
});
