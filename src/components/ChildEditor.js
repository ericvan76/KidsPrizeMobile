/* @flow */

import React, { Component } from 'react';
import update from 'react-addons-update';
import { Alert } from 'react-native';

import {
  Container, Header, Left, Body, Right, Title, Content,
  Button, Icon, Text, Separator, ListItem, Picker,
  Badge, StyleProvider
} from 'native-base';

import * as uuid from 'uuid';

import store from '../store';
import { TaskEditorRoute, TextEditorRoute } from '../routes';
import { createChildAsync, updateChildAsync, deleteChildAsync } from '../actions/child';

import theme from '../native-base-theme';

import type { ChildState } from '../types/states.flow';
import type { Gender } from '../types/api.flow';

type OwnProps = {
  child?: ChildState
};

type Props = OwnProps & {
  navigator: Object
};

type State = {
  initial: FormState,
  current: FormState
};

type FormState = {
  id: string,
  name: string,
  gender: Gender,
  tasks: string[]
}

class ChildEditor extends Component {

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    let tasks = ['Task 1', 'Task 2', 'Task 3'];
    if (props.child) {
      const week1 = Object.keys(props.child.weeklyScores)[0];
      tasks = Object.keys(props.child.weeklyScores[week1]);
    }
    const initial: FormState = {
      id: props.child ? props.child.child.id : uuid.v4(),
      name: props.child ? props.child.child.name : '',
      gender: props.child ? props.child.child.gender : 'M',
      tasks: tasks
    };
    this.state = {
      initial: initial,
      current: initial
    };
  }

  isDirty(): boolean {
    return this.state.initial !== this.state.current;
  }
  isValid(): boolean {
    return this.isNameValid() && this.isGenderValid() && this.isTasksValid();
  }
  isNameValid(): boolean {
    return this.state.current.name.trim().length > 0;
  }
  isGenderValid(): boolean {
    return this.state.current.gender !== undefined;
  }
  isTasksValid(): boolean {
    return this.state.current.tasks.length > 0;
  }

  onClose() {
    this.props.navigator.popToTop();
  }

  onSubmit() {
    if (this.isDirty() && this.isValid()) {
      if (!this.props.child) {
        store.dispatch(createChildAsync(this.state.current.id, this.state.current.name.trim(), this.state.current.gender, this.state.current.tasks));
      } else {
        store.dispatch(updateChildAsync(this.state.current.id, this.state.current.name.trim(), this.state.current.gender, this.state.current.tasks));
      }
      this.props.navigator.popToTop();
    }
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
            store.dispatch(deleteChildAsync(this.props.child.child.id));
            this.props.navigator.popToTop();
          }
        }
      ]
    );
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.onClose.bind(this)}>
                <Icon name={theme.icons.close} />
              </Button>
            </Left>
            <Body>
              <Title>{this.props.child ? 'Edit Child' : 'Add Child'}</Title>
            </Body>
            <Right>
              {
                this.isDirty() && this.isValid() &&
                <Button transparent onPress={this.onSubmit.bind(this)}>
                  <Text>Save</Text>
                </Button>
              }
            </Right>
          </Header>
          <Content>
            <Separator bordered>
              <Text note>INFO</Text>
            </Separator>
            <ListItem icon onPress={() => {
              this.props.navigator.push(
                new TextEditorRoute({
                  title: 'Child Name',
                  placeholder: 'Type child name here',
                  autoCapitalize: 'words',
                  maxLength: 50,
                  defaultValue: this.state.current.name,
                  onSubmit: (text: string) => {
                    this.setState(update(this.state, { current: { name: { $set: text.trim() } } }));
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
                <Text>{this.state.current.name}</Text>
              </Right>
            </ListItem>
            <ListItem icon last>
              <Left>
                <Icon name={this.state.current.gender === 'M' ? theme.icons.male : theme.icons.female} />
              </Left>
              <Body>
                <Text>Gender</Text>
              </Body>
              <Right>
                <Picker note
                  ref='_picker'
                  mode='dialog'
                  selectedValue={this.state.current.gender}
                  onValueChange={(text: string) => {
                    this.setState(update(this.state, { current: { gender: { $set: text } } }));
                  }}>
                  <Picker.Item label='Boy' value='M' />
                  <Picker.Item label='Girl' value='F' />
                </Picker>
              </Right>
            </ListItem>
            <Separator bordered>
              <Text note>TASKS</Text>
            </Separator>
            <ListItem icon last onPress={() => this.props.navigator.push(
              new TaskEditorRoute({
                value: this.state.current.tasks,
                onSubmit: (tasks: string[]) => {
                  this.setState(update(this.state, { current: { tasks: { $set: tasks } } }));
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
                <Badge info>
                  <Text>{this.state.current.tasks.length} Tasks</Text>
                </Badge>
              </Right>
            </ListItem>
            {
              this.props.child &&
              <Button block danger style={styles.deleteButton} onPress={this.onDelete.bind(this)}>
                <Text>Delete Child</Text>
              </Button>
            }
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = {
  deleteButton: {
    margin: 10,
    marginTop: 80
  }
};

export default ChildEditor;

