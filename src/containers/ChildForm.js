import React, {Component} from 'react';
import {View, ScrollView, Picker} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, propTypes, Field} from 'redux-form';
import {Cell, Section, TableView} from 'react-native-tableview-simple';

import Header from '../components/Header';
import TextInputCell from '../components/TextInputCell';
import * as routes from '../routes';
import uuid from '../common/uuid';

const genders = {
  M: 'Male',
  F: 'Female'
};

class ChildForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGenderPicker: false
    };
  }
  isNew() {
    return this.props.childId === undefined;
  }
  toggleGenderPicker() {
    this.setState({
      showGenderPicker: !this.state.showGenderPicker
    });
  }
  openTasksEditor() {
    this.props.navigator.push(new routes.EditTasksRoute(this.props.initialValues.tasks));
  }
  markAsDestroyed() {
    this.setState(Object.assign({}, this.state, {destroyed: true}));
  }
  handleLeftPress() {
    this.markAsDestroyed();
    this.props.navigator.pop();
  }
  handleRightPress() {
    this.markAsDestroyed();
    this.props.navigator.pop();
  }
  componentWillUnmount() {
    if (this.state.destroyed) {
      this.props.destroy('childForm');
    }
  }
  render() {
    const nameField = (props) => {
      return (
        <TextInputCell
          title='Child Name'
          value={props.input.value}
          placeholder='Input Name'
          onChangeText={props.input.onChange}
          autoCapitalize='words'></TextInputCell>
      );
    };
    const genderField = (props) => {
      let genderPicker = null;
      if (this.state.showGenderPicker) {
        const items = Object.keys(genders).map(i => {
          return <Picker.Item key={i} label={genders[i]} value={i}/>;
        });
        genderPicker = (
          <Picker selectedValue={props.input.value || 'M'} onValueChange={props.input.onChange}>
            {items}
          </Picker>
        );
      }
      return (
        <View>
          <Cell
            cellStyle='RightDetail'
            accessory='DisclosureIndicator'
            title='Gender'
            detail={genders[props.input.value] || '-'}
            onPress={this.toggleGenderPicker.bind(this)}></Cell>
          {genderPicker}
        </View>
      );
    };

    const tasksField = (props) => {
      return (
        <Cell
          cellStyle='RightDetail'
          accessory='DisclosureIndicator'
          title='Tasks'
          detail={props.input.value.length}
          onPress={this.openTasksEditor.bind(this)}></Cell>
      );
    };

    const title = this.props.isNew
      ? 'Add Child'
      : 'Edit Child';

    return (
      <View style={styles.container}>
        <Header
          title={title}
          leftButton='#ma:close'
          rightButton='Save'
          onLeftPress={this.handleLeftPress.bind(this)}
          onRightPress={this.handleRightPress.bind(this)}/>
        <ScrollView style={styles.container}>
          <TableView>
            <Section header='BASIC INFO'>
              <Field name='name' component={nameField}/>
              <Field name='gender' component={genderField}/>
            </Section>
            <Section header='TASKS'>
              <Field name='tasks' component={tasksField}/>
            </Section>
          </TableView>
        </ScrollView>
      </View>
    );
  }
}

ChildForm.propTypes = {
  ...propTypes, // react-form propTypes
  isNew: React.PropTypes.bool.isRequired,
  initialValues: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    gender: React.PropTypes.oneOf(['M', 'F']),
    tasks: React.PropTypes.arrayOf(React.PropTypes.string)
  }).isRequired,
  childId: React.PropTypes.string,
  navigator: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
  if (ownProps.childId !== undefined) {
    return {
      isNew: false,
      initialValues: state.children[ownProps.childId]
    };
  } else {
    return {
      isNew: true,
      initialValues: {
        id: uuid.v4(),
        tasks: ['Task A', 'Task B', 'Task C']
      }
    };
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      //todo: add actions here
    }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({form: 'childForm', destroyOnUnmount: false})(ChildForm));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$section.backgroundColor'
  }
});
