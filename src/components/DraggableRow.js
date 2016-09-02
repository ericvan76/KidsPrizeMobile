import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

import Icon from './Icon';
import Seperator from './Seperator';

export default class DraggableRow extends Component {

  render() {
    let removeIcon = null;
    if (this.props.onRemove) {
      removeIcon = (
        <TouchableOpacity onPress={this.props.onRemove}>
          <Icon style={styles.removeIcon} name='#ma:remove-circle'/>
        </TouchableOpacity>
      );
    }
    return (
      <View>
        <View style={styles.container}>
          {removeIcon}
          <Text style={styles.title} ellipsizeMode='tail' numberOfLines={1}>{this.props.title}</Text>
          <TouchableWithoutFeedback delayLongPress={0} onLongPress={this.props.onLongPress} onPressOut={this.props.onPressOut}>
            <Icon style={styles.draggableIcon} name='#ma:drag-handle'/>
          </TouchableWithoutFeedback>
        </View>
        <Seperator/>
      </View>
    );
  }
}

DraggableRow.propTypes = {
  title: React.PropTypes.string,
  onRemove: React.PropTypes.func,
  onLongPress: React.PropTypes.func,
  onPressOut: React.PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.8rem',
    backgroundColor: '$normal.backgroundColor'
  },
  title: {
    flex: 1,
    fontSize: '1rem',
    color: '$normal.textColor',
    textAlign: 'left',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem'
  },
  removeIcon: {
    fontSize: '1.2rem',
    color: '#ff0000'
  },
  draggableIcon: {
    fontSize: '1.2rem',
    color: '$cell.detailColor'
  }
});