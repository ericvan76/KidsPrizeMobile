import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    backgroundColor: '#000000'
  },
  icon: {
    flex: 0.15,
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center'

  },
  title: {
    flex: 0.7,
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center'
  }
});

export default class Header extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Icon style={[styles.icon, this.props.iconStyle]} name={this.props.icon || 'home'} onPress={this.props.onIconPress}/>
        <Text style={[styles.title, this.props.titleStyle]} ellipsizeMode='tail' numberOfLines={1}>{this.props.title}</Text>
        <Text style={[styles.icon, this.props.iconStyle]}/>
      </View>
    );
  }
}

Header.propTypes = {
  title: React.PropTypes.string,
  icon: React.PropTypes.string,
  onIconPress: React.PropTypes.func,
  style: View.propTypes.style,
  iconStyle: Text.propTypes.style,
  titleStyle: Text.propTypes.style
};
