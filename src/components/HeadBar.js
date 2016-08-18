import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import Icon from './Icon';

export default class HeadBar extends Component {
  _renderButton(button, style) {
    if (button === undefined) {
      return null;
    } else if (button.icon !== undefined) {
      return (<Icon style={[style, button.style]} name={button.icon}/>);
    } else {
      return (
        <Text style={[style, button.style]} ellipsizeMode='tail' numberOfLines={1}>{button.text}</Text>
      );
    }
  }
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <StatusBar hidden={true}></StatusBar>
        <View style={styles.sideView}>
          <TouchableOpacity style={styles.leftTouchable} onPress={() => this.props.leftButton.handler()}>
            {this._renderButton(this.props.leftButton, styles.leftButton)}
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, this.props.title.style]} ellipsizeMode='tail' numberOfLines={1}>{this.props.title.text}</Text>
        <View style={styles.sideView}>
          <TouchableOpacity style={styles.rightTouchable} onPress={() => this.props.rightButton.handler()}>
            {this._renderButton(this.props.rightButton, styles.rightButton)}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

HeadBar.propTypes = {
  leftButton: React.PropTypes.shape({icon: React.PropTypes.string, text: React.PropTypes.string, handler: React.PropTypes.func, style: Text.propTypes.style}),
  rightButton: React.PropTypes.shape({icon: React.PropTypes.string, text: React.PropTypes.string, handler: React.PropTypes.func, style: Text.propTypes.style}),
  title: React.PropTypes.shape({text: React.PropTypes.string.isRequired, style: Text.propTypes.style}).isRequired,
  style: View.propTypes.style
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#333333'
  },
  sideView: {
    flex: 1,
    justifyContent: 'center'
  },
  leftTouchable: {
    alignSelf: 'flex-start'
  },
  rightTouchable: {
    alignSelf: 'flex-end'
  },
  title: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center'
  },
  leftButton: {
    fontSize: 18,
    color: '#ffffff'
  },
  rightButton: {
    fontSize: 18,
    color: '#ffffff'
  }
});
