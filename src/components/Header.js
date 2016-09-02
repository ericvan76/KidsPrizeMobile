import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

import Icon from './Icon';

export default class Header extends Component {
  renderButton(button) {
    if (button === undefined) {
      return null;
    } else if (button.startsWith('#')) {
      return <Icon style={styles.button} name={button}/>;
    } else {
      return <Text style={styles.button} ellipsizeMode='tail' numberOfLines={1}>{button}</Text>;
    }
  }
  handleLeftPress() {
    this.props.onLeftPress();
  }
  handleRightPress() {
    this.props.onRightPress();
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true}/>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.leftTouchable} onPress={this.handleLeftPress.bind(this)}>
            {this.renderButton(this.props.leftButton)}
          </TouchableOpacity>
        </View>
        <Text style={styles.title} ellipsizeMode='tail' numberOfLines={1}>{this.props.title}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.rightTouchable} onPress={this.handleRightPress.bind(this)}>
            {this.renderButton(this.props.rightButton)}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  leftButton: React.PropTypes.string,
  rightButton: React.PropTypes.string,
  onLeftPress: React.PropTypes.func,
  onRightPress: React.PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '5rem',
    paddingLeft: '1.2rem',
    paddingRight: '1.2rem',
    backgroundColor: '$header.backgroundColor'
  },
  leftTouchable: {
    alignSelf: 'flex-start'
  },
  rightTouchable: {
    alignSelf: 'flex-end'
  },
  title: {
    fontSize: '1.4rem',
    color: '$header.textColor',
    textAlign: 'center'
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  button: {
    fontSize: '1.2rem',
    color: '$header.textColor'
  }
});