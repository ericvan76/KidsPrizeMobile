import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, propTypes, Field} from 'redux-form';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import SortableListView from 'react-native-sortable-listview';

import Header from '../components/Header';

class ChildFormTasksEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      order: []
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          title='Edit Tasks'
          leftButton='#ma:arrow-back'
          rightButton='Add'
          onLeftPress={() => this.props.navigator.pop()}
          onRightPress={() => this.props.navigator.pop()}/>
        <SortableListView
          style={styles.container}
          data={this.state.data}
          order={this.state.order}
          onRowMoved={e => {
          order.splice(e.to, 0, order.splice(e.from, 1)[0]);
          this.forceUpdate();
        }}
          renderRow={row => <Text>{row}</Text>}/>
      </View>
    );
  }
}

ChildFormTasksEditor.propTypes = {
  ...propTypes, // react-form propTypes
};

export default reduxForm({form: 'childForm', destroyOnUnmount: false})(ChildFormTasksEditor);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$section.backgroundColor'
  }
});
