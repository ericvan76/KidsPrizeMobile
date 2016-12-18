/* @flow */

import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Header, Title, Content, Button, Icon, Text, List, ListItem, Picker, Input, Badge } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as uuid from 'uuid';

import ListItemDivider from './ListItemDivider';
import { TaskEditorRoute } from '../routes';
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
  }
  isNew(): boolean {
    return !this.props.childId;
  }

  markAsDestroyed() {
    this.setState(Object.assign({}, this.state, { destroyed: true }));
  }

  onClose() {
    this.props.navigator.popToTop();
  }

  onSubmit() {
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
            this.props.deleteChildAsync(this.props.childId);
            this.props.navigator.popToTop();
          }
        }
      ]
    );
  }

  componentWillUnmount() {
    this.props.destroy('childForm');
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
          {this.props.valid ? <Button transparent onPress={() => this.onSubmit()}>Save</Button> : null}
        </Header>
        <Content>
          <List>
            <ListItemDivider title='BASIC INFO' />
            <Field name='name' component={(props: Field.Props) => {
              return (
                <ListItem iconLeft>
                  <Icon name='ios-contact-outline' />
                  <Text style={{ alignSelf: 'center' }}>Name</Text>
                  <Input
                    style={{ textAlign: 'right', paddingTop: 0, paddingBottom: 0 }}
                    placeholder='Type child name here'
                    autoCapitalize='words'
                    maxLength={50}
                    defaultValue={props.input.value}
                    onSubmitEditing={(event: any) => { props.input.onChange(event.nativeEvent.text.trim()); } }
                    />
                </ListItem>
              );
            } } />
            <Field name='gender' component={(props: Field.Props) => {
              return (
                <ListItem iconLeft>
                  <Icon name={props.input.value === 'M' ? 'ios-man-outline' : 'ios-woman-outline'} />
                  <Text>Gender</Text>
                  <Picker textStyle={{ color: theme.textColor }}
                    mode='dialog'
                    selectedValue={props.input.value}
                    onValueChange={props.input.onChange.bind(this)} >
                    <Picker.Item label='Boy' value='M' />
                    <Picker.Item label='Girl' value='F' />
                  </Picker>
                </ListItem>
              );
            } } />
            <ListItemDivider title='TASKS' />
            <Field name='tasks' component={(props: Field.Props) => {
              return (
                <ListItem button iconLeft onPress={() => this.props.navigator.push(
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
                  <Badge style={{ marginTop: 3, marginBottom: 3 }} primary={props.input.value.length > 0}>{props.input.value.length}</Badge>
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
    validate: validate,
    onSubmit: onSubmit
  })(ChildForm));