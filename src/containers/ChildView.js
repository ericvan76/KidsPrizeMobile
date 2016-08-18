import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import HeadBar from '../components/HeadBar';
import * as icons from '../components/Icon';

export default class ChildView extends Component {
  render() {
    const leftButton = {
      icon: icons.CLOSE,
      handler: () => {
        this.props.navigator.pop();
      }
    };
    const title = {
      text: 'Add Child'
    };
    const rightButton = {
      text: 'Save',
      handler: () => {
        this.props.navigator.pop();
      }
    };
    return (
      <View style={[styles.container, this.props.style]}>
        <HeadBar leftButton={leftButton} title={title} rightButton={rightButton}/>
        <Text>Child View</Text>
      </View>
    );
  }
}

ChildView.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  style: View.propTypes.style
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});
