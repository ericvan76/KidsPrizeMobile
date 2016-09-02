import React, { Component } from 'react';
import { View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, getFormValues, propTypes } from 'redux-form';
import SortableListView from 'react-native-sortable-listview';

import Header from '../components/Header';
import DraggableRow from '../components/DraggableRow';

class ChildFormTasksEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: Object.assign({}, ...props.tasks.map(t => {
        return {
          [t]: t
        };
      })),
      order: props.tasks
    };
  }
  handleLeftPress() {
    this.props.navigator.pop();
  }
  handleMove(e) {
    this.state.order.splice(e.to, 0, this.state.order.splice(e.from, 1)[0]);
    this.forceUpdate();
  }
  renderRow(row) {
    return (<DraggableRow title={row} onRemove={() => {}} {...this.props.sortHandlers}/>);
  }
  render() {
    return (
      <View style={styles.container}>
        <Header title='Tasks' leftButton='#ma:arrow-back' onLeftPress={this.handleLeftPress.bind(this)}/>
        <SortableListView
          style={styles.container}
          sortRowStyle
          ={styles.sortRowStyle}
          data={this.state.data}
          order={this.state.order}
          onRowMoved={e => this.handleMove(e)}
          renderRow={row => this.renderRow(row)}/>
      </View>
    );
  }
}

ChildFormTasksEditor.propTypes = {
  ...propTypes, // react-form propTypes
};

const mapStateToProps = (state) => {
  return {
    tasks: getFormValues('childForm')(state).tasks
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      //todo: add actions here
    }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'childForm',
    destroyOnUnmount: false
  })(ChildFormTasksEditor));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$section.backgroundColor'
  },
  sortRowStyle: {
    opacity: 0.8,
    backgroundColor: 'transparent'
  }
});