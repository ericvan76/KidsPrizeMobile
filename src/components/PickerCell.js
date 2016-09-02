import React, { Component } from 'react';
import { View, Picker } from 'react-native';
import { Cell } from 'react-native-tableview-simple';
import StyleSheet from 'react-native-extended-stylesheet';

export default class PickerCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPicker: false
    };
  }
  handleToggle() {
    this.setState({
      showPicker: !this.state.showPicker
    });
  }
  render() {

    let picker = null;
    if (this.state.showPicker) {
      const items = Object.keys(this.props.pickerItems).map(k => {
        return <Picker.Item label={this.props.pickerItems[k]} value={k} key={k}/>;
      });
      picker = (
        <View>
          <Picker style={styles.picker} selectedValue={this.props.selectedValue} onValueChange={this.props.onValueChange}>
            {items}
          </Picker>
        </View>
      );
    }
    return (
      <View>
        <Cell
          cellStyle='RightDetail'
          accessory='DisclosureIndicator'
          title={this.props.title}
          detail={this.props.pickerItems[this.props.selectedValue]}
          onPress={this.handleToggle.bind(this)}></Cell>
        {picker}
      </View>
    );
  }
}

PickerCell.propTypes = {
  title: React.PropTypes.string.isRequired,
  pickerItems: React.PropTypes.object.isRequired,
  selectedValue: React.PropTypes.string.isRequired,
  onValueChange: React.PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  picker: {
    flex: 1
  }
});