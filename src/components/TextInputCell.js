import React, { Component } from 'react';
import { Text, TextInput } from 'react-native';
import { CustomCell } from 'react-native-tableview-simple';
import StyleSheet from 'react-native-extended-stylesheet';

export default class TextInputCell extends Component {
  render() {
    return (
      <CustomCell style={styles.cell}>
        <Text style={styles.title}>{this.props.title}</Text>
        <TextInput {...this.props} style={[styles.input, this.props.style]}/>
      </CustomCell>
    );
  }
}

TextInputCell.propTypes = {
  ...TextInput.propTypes,
  title: React.PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center'
  },
  title: {
    fontSize: '1rem',
    color: '$cell.titleColor'
  },
  input: {
    flex: 1,
    fontSize: '1rem',
    height: '1.8rem',
    '@media android': {
      height: '3rem'
    },
    textAlign: 'right',
    color: '$cell.detailColor',
    backgroundColor: '$normal.backgroundColor'
  }
});