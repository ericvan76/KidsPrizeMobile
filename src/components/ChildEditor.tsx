import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import * as uuid from 'uuid';

import { createChildAsync, deleteChildAsync, updateChildAsync } from '../actions/child';
import * as Constants from '../constants';
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

  private isDirty(): boolean {
    return this.state.initial !== this.state.current;
  }
  private isValid(): boolean {
    return this.isNameValid() && this.isGenderValid() && this.isTasksValid();
  }
  private isNameValid(): boolean {
    return this.state.current.name.trim().length > 0;
  }
  private isGenderValid(): boolean {
    return this.state.current.gender !== undefined;
  }
  private isTasksValid(): boolean {
    return this.state.current.tasks.length > 0;
  }

  private onClose() {
    this.props.navigator.popToTop();
  }

  private onSubmit() {
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
  private onDelete() {
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

  public componentWillMount() {
    let tasks = ['Task 1', 'Task 2', 'Task 3'];
    if (this.props.child) {
      const week1 = Object.keys(this.props.child.weeklyScores)[0];
      tasks = Object.keys(this.props.child.weeklyScores[week1]);
    }
    const initial: FormState = {
      id: this.props.child ? this.props.child.child.id : uuid.v4(),
      name: this.props.child ? this.props.child.child.name : '',
      gender: this.props.child ? this.props.child.child.gender : Constants.GENDER_MALE,
      tasks
    };
    this.state = {
      initial,
      current: initial
    };
  }

  // tslint:disable-next-line:max-func-body-length
  public render() {
    return (
      <NB.StyleProvider style={theme}>
        <NB.Container>
          <NB.Header>
            <NB.Left>
              <NB.Button transparent onPress={this.onClose.bind(this)}>
                <NB.Icon name={theme.icons.close} />
              </NB.Button>
            </NB.Left>
            <NB.Body>
              <NB.Title>{this.props.child ? 'Edit Child' : 'Add Child'}</NB.Title>
            </NB.Body>
            <NB.Right>
              {
                this.isDirty() && this.isValid() &&
                <NB.Button transparent onPress={this.onSubmit.bind(this)}>
                  <NB.Text>Save</NB.Text>
                </NB.Button>
              }
            </NB.Right>
          </NB.Header>
          <NB.Content>
            <NB.Separator bordered>
              <NB.Text note>INFO</NB.Text>
            </NB.Separator>
            <NB.ListItem icon onPress={() => {
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
            }}>
              <NB.Left>
                <NB.Icon name={theme.icons.formName} />
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
                <NB.Icon name={this.state.current.gender === Constants.GENDER_MALE ? theme.icons.male : theme.icons.female} />
              </NB.Left>
              <NB.Body>
                <NB.Text>Gender</NB.Text>
              </NB.Body>
              <NB.Right>
                <NB.Picker note
                  ref="_picker"
                  mode="dialog"
                  selectedValue={this.state.current.gender}
                  onValueChange={(gender: Gender) => {
                    this.setState({ ...this.state, current: { ...this.state.current, gender } });
                  }}>
                  <NB.Picker.Item label="Boy" value={Constants.GENDER_MALE} />
                  <NB.Picker.Item label="Girl" value={Constants.GENDER_FEMALE} />
                </NB.Picker>
              </NB.Right>
            </NB.ListItem>
            <NB.Separator bordered>
              <NB.Text note>TASKS</NB.Text>
            </NB.Separator>
            <NB.ListItem icon last onPress={() => this.props.navigator.push(
              routes.editTaskRoute({
                navigator: this.props.navigator,
                value: this.state.current.tasks,
                onSubmit: (tasks: Array<string>) => {
                  this.setState({ ...this.state, current: { ...this.state.current, tasks } });
                  this.props.navigator.pop();
                }
              }))
            }>
              <NB.Left>
                <NB.Icon name={theme.icons.formTasks} />
              </NB.Left>
              <NB.Body>
                <NB.Text>Tasks</NB.Text>
              </NB.Body>
              <NB.Right>
                <NB.Badge info>
                  <NB.Text>{this.state.current.tasks.length} Tasks</NB.Text>
                </NB.Badge>
              </NB.Right>
            </NB.ListItem>
            {
              this.props.child &&
              <NB.Button block danger style={styles.deleteButton} onPress={this.onDelete.bind(this)}>
                <NB.Text>Delete Child</NB.Text>
              </NB.Button>
            }
          </NB.Content>
        </NB.Container>
      </NB.StyleProvider>
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
