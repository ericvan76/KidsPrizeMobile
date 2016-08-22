import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import HeadBar from '../components/HeadBar';
import * as icons from '../components/Icon';

export default class ChildListView extends Component {
  render() {
    const leftButton = {
      icon: icons.BACK,
      handler: () => {
        this.props.navigator.pop();
      }
    };
    const title = {
      text: 'Child List'
    };
    return (
      <View style={[styles.container, this.props.style]}>
        <HeadBar leftButton={leftButton} title={title}/>
        <Text>Child List View</Text>
      </View>
    );
  }
}

ChildListView.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  style: View.propTypes.style
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});
