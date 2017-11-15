import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import * as uuid from 'uuid';

import { createChildAsync, deleteChildAsync, updateChildAsync } from '../actions/children';
import { GENDER_FEMALE, GENDER_MALE } from '../constants';
import * as routes from '../routes';
import store from '../store';
import theme from '../theme';
import { Gender } from '../types/api';
import { ChildState } from '../types/states';

export interface Props {
  navigator: RN.Navigator;
  child?: ChildState;
}

interface State {
  initial: FormState;
  current: FormState;
}

interface FormState {
  id: string;
  name: string;
  gender: Gender;
  tasks: Array<string>;
}

class ChildEditor extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props);
    let tasks = ['Task 1', 'Task 2', 'Task 3'];
    if (this.props.child) {
      tasks = [...[...this.props.child.scores.values()][0].keys()];
    }
    const initial: FormState = {
      id: this.props.child ? this.props.child.child.id : uuid.v4(),
      name: this.props.child ? this.props.child.child.name : '',
      gender: this.props.child ? this.props.child.child.gender : GENDER_MALE,
      tasks
    };
    this.state = {
      initial,
      current: initial
    };
  }

  private isDirty = (): boolean => {
    return this.state.initial !== this.state.current;
  }
  private isValid = (): boolean => {
    return this.isNameValid() && this.isGenderValid() && this.isTasksValid();
  }
  private isNameValid = (): boolean => {
    return this.state.current.name.trim().length > 0;
  }
  private isGenderValid = (): boolean => {
    return this.state.current.gender !== undefined;
  }
  private isTasksValid = (): boolean => {
    return this.state.current.tasks.length > 0;
  }
  private onClose = () => {
    this.props.navigator.popToTop();
  }
  private onSubmit = () => {
    if (this.isDirty() && this.isValid()) {
      if (!this.props.child) {
        store.dispatch(createChildAsync(
          this.state.current.id, this.state.current.name.trim(), this.state.current.gender, this.state.current.tasks));
      } else {
        store.dispatch(updateChildAsync(
          this.state.current.id, this.state.current.name.trim(), this.state.current.gender, this.state.current.tasks));
      }
      this.props.navigator.popToTop();
    }
  }
  private onEditName = () => {
    this.props.navigator.push(
      routes.editTextRoute({
        navigator: this.props.navigator,
        title: 'Child Name',
        placeholder: 'Type child name here',
        autoCapitalize: 'words',
        maxLength: 50,
        defaultValue: this.state.current.name,
        onSubmit: (text: string) => {
          this.setState({ ...this.state, current: { ...this.state.current, name: text.trim() } });
          this.props.navigator.pop();
        }
      }));
  }
  private onGenderChange = (gender: Gender) => {
    this.setState({ ...this.state, current: { ...this.state.current, gender } });
  }
  private onEditTask = () => {
    this.props.navigator.push(
      routes.editTaskRoute({
        navigator: this.props.navigator,
        value: this.state.current.tasks,
        onSubmit: (tasks: Array<string>) => {
          this.setState({ ...this.state, current: { ...this.state.current, tasks } });
          this.props.navigator.pop();
        }
      })
    );
  }

  private onDelete = () => {
    RN.Alert.alert(
      'Confirm',
      'Are you sure you want to delete this child?',
      [
        {
          text: 'Cancel'
        }, {
          text: 'Delete', onPress: () => {
            if (this.props.child) {
              store.dispatch(deleteChildAsync(this.props.child.child.id));
            }
            this.props.navigator.popToTop();
          }
        }
      ]
    );
  }

  public render() {
    return (
      <NB.StyleProvider style={theme}>
        <NB.Container>
          <NB.Header>
            <NB.Left>
              <NB.Button transparent onPress={this.onClose}>
                <NB.Icon name={theme.icons.close} />
              </NB.Button>
            </NB.Left>
            <NB.Body>
              <NB.Title>{this.props.child ? 'Edit Child' : 'Add Child'}</NB.Title>
            </NB.Body>
            <NB.Right>
              {
                this.isDirty() && this.isValid() &&
                <NB.Button transparent onPress={this.onSubmit}>
                  <NB.Text>Save</NB.Text>
                </NB.Button>
              }
            </NB.Right>
          </NB.Header>
          <NB.Content>
            <NB.ListItem itemDivider>
              <NB.Text note>INFO</NB.Text>
            </NB.ListItem>
            <NB.ListItem icon onPress={this.onEditName}>
              <NB.Left>
                <NB.Icon name={theme.icons.face} />
              </NB.Left>
              <NB.Body>
                <NB.Text>Name</NB.Text>
              </NB.Body>
              <NB.Right>
                <NB.Text>{this.state.current.name}</NB.Text>
              </NB.Right>
            </NB.ListItem>
            <NB.ListItem icon last>
              <NB.Left>
                <NB.Icon name={theme.icons.gender} />
              </NB.Left>
              <NB.Body>
                <NB.Text>Gender</NB.Text>
              </NB.Body>
              <NB.Right>
                <NB.Picker note
                  // hack: shouldn't need to do this
                  textStyle={{ color: theme.variables.listNoteColor, fontSize: theme.variables.DefaultFontSize }}
                  mode="dialog" selectedValue={this.state.current.gender} onValueChange={this.onGenderChange}>
                  <NB.Picker.Item label="Boy" value={GENDER_MALE} />
                  <NB.Picker.Item label="Girl" value={GENDER_FEMALE} />
                </NB.Picker>
              </NB.Right>
            </NB.ListItem>
            <NB.ListItem itemDivider>
              <NB.Text note>TASKS</NB.Text>
            </NB.ListItem>
            <NB.ListItem icon last onPress={this.onEditTask}>
              <NB.Left>
                <NB.Icon name={theme.icons.formTasks} />
              </NB.Left>
              <NB.Body>
                <NB.Text>Tasks</NB.Text>
              </NB.Body>
              <NB.Right>
                <NB.Badge>
                  <NB.Text>{this.state.current.tasks.length} Tasks</NB.Text>
                </NB.Badge>
              </NB.Right>
            </NB.ListItem>
            {
              this.props.child &&
              <NB.Button deleteStyle danger block iconLeft onPress={this.onDelete}>
                <NB.Icon name={theme.icons.trash} />
                <NB.Text>Delete Child</NB.Text>
              </NB.Button>
            }
          </NB.Content>
        </NB.Container>
      </NB.StyleProvider>
    );
  }
}

export default ChildEditor;
