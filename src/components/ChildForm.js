/* @flow */

import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Button, Icon, Text, Separator, ListItem, Picker, Badge, StyleProvider } from 'native-base';

import theme from '../native-base-theme';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as uuid from 'uuid';

import { TaskEditorRoute, TextInputRoute } from '../routes';
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
    return (
      <StyleProvider style={theme}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => this.onClose()}>
                <Text>Cancel</Text>
              </Button>
            </Left>
            <Body>
              <Title>{this.isNew() ? 'Add Child' : 'Edit Child'}</Title>
            </Body>
            <Right>
              {
                this.props.valid &&
                <Button transparent onPress={() => this.onSubmit()}>
                  <Text>Save</Text>
                </Button>
              }
            </Right>
          </Header>
          <Content>
            <Separator bordered>
              <Text>BASIC INFO</Text>
            </Separator>
            <Field name='name' component={(props: Field.Props) => {
              return (
                <ListItem icon onPress={() => {
                  this.props.navigator.push(
                    new TextInputRoute({
                      title: 'Child Name',
                      placeholder: 'Type child name here',
                      autoCapitalize: 'words',
                      maxLength: 50,
                      defaultValue: props.input.value,
                      onSubmit: (text: string) => {
                        props.input.onChange(text);
                        this.props.navigator.pop();
                      }
                    }));
                }}>
                  <Left>
                    <Icon name={theme.icons.formName} />
                  </Left>
                  <Body>
                    <Text>Name</Text>
                  </Body>
                  <Right>
                    <Text>{props.input.value}</Text>
                  </Right>
                </ListItem>
              );
            }} />
            <Field name='gender' component={(props: Field.Props) => {
              return (
                <ListItem icon last>
                  <Left>
                    <Icon name={props.input.value === 'M' ? theme.icons.male : theme.icons.female} />
                  </Left>
                  <Body>
                    <Text>Gender</Text>
                  </Body>
                  <Right>
                    <Picker note
                      mode='dialog'
                      selectedValue={props.input.value}
                      onValueChange={props.input.onChange.bind(this)} >
                      <Picker.Item label='Boy' value='M' />
                      <Picker.Item label='Girl' value='F' />
                    </Picker>
                  </Right>
                </ListItem>
              );
            }} />
            <Separator bordered>
              <Text>TASKS</Text>
            </Separator>
            <Field name='tasks' component={(props: Field.Props) => {
              return (
                <ListItem icon last onPress={() => this.props.navigator.push(
                  new TaskEditorRoute({
                    value: props.input.value,
                    onSubmit: (v: string[]) => {
                      props.input.onChange(v);
                      this.props.navigator.pop();
                    }
                  }))
                }>
                  <Left>
                    <Icon name={theme.icons.formTasks} />
                  </Left>
                  <Body>
                    <Text>Tasks</Text>
                  </Body>
                  <Right>
                    <Badge info danger={props.input.value.length === 0}>
                      <Text>{props.input.value.length} Tasks</Text>
                    </Badge>
                  </Right>
                </ListItem>
              );
            }} />
            {
              !this.isNew() &&
              <Button block danger style={styles.deleteButton} onPress={() => this.onDelete()}>
                <Text>Delete Child</Text>
              </Button>
            }
          </Content>
        </Container>
      </StyleProvider>
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

const styles = {
  deleteButton: {
    margin: 10,
    marginTop: 50
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'childForm',
    validate: validate,
    onSubmit: onSubmit
  })(ChildForm)
);

