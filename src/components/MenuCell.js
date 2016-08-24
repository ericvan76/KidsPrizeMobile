import React, {Component} from 'react';
import {Text} from 'react-native';
import {CustomCell} from 'react-native-tableview-simple';
import StyleSheet from 'react-native-extended-stylesheet';

import Icon from '../components/Icon';

export default class MenuCell extends Component {
  render() {
    return (
      <CustomCell style={styles.cell} onPress={() => this.props.onPress()}>
        <Icon {...this.props} style={[styles.icon, this.props.style]} name={this.props.icon}/>
        <Text {...this.props} style={[styles.title, this.props.style]}>{this.props.title}</Text>
      </CustomCell>
    );
  }
}

MenuCell.propTypes = {
  ...Text.propTypes,
  icon: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'flex-start'
  },
  icon: {
    fontSize: '1rem',
    color: '$normal.textColor',
    width: '2rem'
  },
  title: {
    flex: 1,
    fontSize: '1rem',
    color: '$normal.textColor'
  }
});
