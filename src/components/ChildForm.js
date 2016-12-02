/* @flow */

import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Header, Title, Content, Button, Icon, Text, List, ListItem, Badge } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as uuid from 'uuid';

import ListItemDivider from '../components/ListItemDivider';
import { TextInputRoute, PickerRoute, TaskEditorRoute } from '../routes';
import theme from '../themes';
import { createChildAsync, updateChildAsync, deleteChildAsync } from '../actions/child';

import type { AppState } from '../types/states.flow';

type OwnProps = {
  childId: string
};

type StoreProps = {
};

type ActionProps = {
  deleteChildAsync: (childId: string) => void
};

type Props = OwnProps & StoreProps & ActionProps & {
  navigator: Object,
  // redux-form
  initialValues: FormValues,
  destroy: (form: string) => void;
  submit: () => void;
};

type State = {
  showGenderPicker: boolean,
  destroyed: boolean
};

type FormValues = {
  id: string,
  name: string,
  gender: Gender,
  tasks: string[]
}

class ChildForm extends Component {

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      showGenderPicker: false,
      destroyed: false
    };
  }
  isNew(): boolean {
    return !this.props.childId;
  }
  toggleGenderPicker() {
    this.setState({
      showGenderPicker: !this.state.showGenderPicker
    });
  }
  markAsDestroyed() {
    this.setState(Object.assign({}, this.state, { destroyed: true }));
  }
  onClose() {
    this.markAsDestroyed();
    this.props.navigator.popToTop();
  }

  onSubmit() {

    this.markAsDestroyed();
    if (this.props.dirty) {
      this.props.submit();
    }
    this.props.navigator.popToTop();
  }

  onDelete() {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this child?',
      [
        {
          text: 'Cancel'
        }, {
          text: 'Delete', onPress: () => {
            this.markAsDestroyed();
            this.props.deleteChildAsync(this.props.childId);
            this.props.navigator.popToTop();
          }
        }
      ]);
  }
  componentWillUnmount() {
    if (this.state.destroyed) {
      this.props.destroy('childForm');
    }
  }
  render() {
    let deleteButton = null;
    if (this.props.childId) {
      deleteButton = (
        <Button block danger
          style={{ margin: 10, marginTop: 50 }}
          onPress={() => this.onDelete()}>Delete Child</Button>
      );
    }
    return (
      <Container theme={theme} style={{ backgroundColor: theme.backgroundColor }}>
        <Header>
          <Button transparent onPress={() => this.onClose()}>Cancel</Button>
          <Title>{this.isNew() ? 'Add Child' : 'Edit Child'}</Title>
          <Button transparent disabled={!this.props.valid} onPress={() => this.onSubmit()}>Save</Button>
        </Header>
        <Content>
          <List>
            <ListItemDivider title='BASIC INFO' />
            <Field name='name' component={(props: Field.Props) => {
              return (
                <ListItem iconLeft onPress={() => this.props.navigator.push(
                  new TextInputRoute({
                    title: 'Name',
                    placeholder: 'Type child name here',
                    autoCapitalize: 'words',
                    defaultValue: props.input.value,
                    onSubmit: (text: string) => {
                      props.input.onChange(text.trim());
                      this.props.navigator.pop();
                    }
                  }))
                }>
                  <Icon name='ios-contact-outline' />
                  <Text>Name</Text>
                  <Text note style={theme.listNote} numberOfLines={1}>{props.input.value}</Text>
                </ListItem>
              );
            } } />
            <Field name='gender' component={(props: Field.Props) => {
              const items = { M: 'Boy', F: 'Girl' };
              return (
                <ListItem iconLeft onPress={() => this.props.navigator.push(
                  new PickerRoute({
                    title: 'Gender',
                    items: items,
                    defaultValue: props.input.value,
                    onSubmit: (v: Gender) => {
                      props.input.onChange(v);
                      this.props.navigator.pop();
                    }
                  }))
                }>
                  <Icon name={props.input.value === 'M' ? 'ios-male' : 'ios-female'} />
                  <Text>Gender</Text>
                  <Text note style={theme.listNote}>{items[props.input.value]}</Text>
                </ListItem>
              );
            } } />
            <ListItemDivider title='TASKS' />
            <Field name='tasks' component={(props: Field.Props) => {
              return (
                <ListItem iconLeft onPress={() => this.props.navigator.push(
                  new TaskEditorRoute({
                    value: props.input.value,
                    onSubmit: (v: string[]) => {
                      props.input.onChange(v);
                      this.props.navigator.pop();
                    }
                  }))
                }>
                  <Icon name='ios-copy-outline' />
                  <Text>Tasks</Text>
                  <Badge info={props.meta.valid}>{props.input.value.length}</Badge>
                </ListItem>
              );
            } } />
          </List>
          {deleteButton}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StoreProps => {
  let initialValues = {
    id: uuid.v4(),
    name: '',
    gender: 'M',
    tasks: ['Task 1', 'Task 2', 'Task 3']
  };
  if (ownProps.childId && state.children[ownProps.childId]) {
    const topWeek = Object.keys(state.children[ownProps.childId].weeklyScores)[0];
    initialValues = Object.assign({}, state.children[ownProps.childId].child, {
      tasks: Object.keys(state.children[ownProps.childId].weeklyScores[topWeek])
    });
  }
  return {
    initialValues: initialValues
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
  return bindActionCreators({
    deleteChildAsync
  }, dispatch);
};

const validate = (values: FormValues) => {
  const errors = {};
  if (!values.id || values.id.length === 0) {
    errors.id = 'Required';
  }
  if (!values.name || values.name.length === 0) {
    errors.name = 'Required';
  }
  if (!values.gender || (values.gender !== 'M' && values.gender !== 'F')) {
    errors.gender = 'Must be M or F';
  }
  if (!values.tasks || values.tasks.length === 0) {
    errors.tasks = 'At least one task is required.';
  }
  return errors;
};

const onSubmit = (values: FormValues, dispatch: Dispatch, props: Props) => {

  if (!props.childId) {
    dispatch(createChildAsync(values.id, values.name, values.gender, values.tasks));
  } else {
    dispatch(updateChildAsync(values.id, values.name, values.gender, values.tasks));
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'childForm',
    destroyOnUnmount: false,
    validate: validate,
    onSubmit: onSubmit
  })(ChildForm));