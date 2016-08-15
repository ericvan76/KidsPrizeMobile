import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: '#CCCCCC'
  }
});

export default class Seperator extends Component {
  render() {
    return (<View style={[styles.container, this.props.style]}/>);
  }
}

Seperator.propTypes = {
  style: View.propTypes.style
};
