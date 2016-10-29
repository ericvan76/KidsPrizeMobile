/* @flow */

import React, { Component } from 'react';
import { Container, Header, Title, Content, Button, Icon, Text, List, ListItem } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, propTypes, Field } from 'redux-form';
import * as uuid from 'uuid';

import ListItemDivider from '../components/ListItemDivider';
import { TextInputRoute, PickerRoute, TaskEditorRoute } from '../routes';
import theme from '../themes';

import type { AppState } from '../types/states.flow';

type OwnProps = {
  childId: string
};

type StoreProps = {
  isNew: boolean,
  initialValues: Child & {
    tasks: string[]
  }
};

type ActionProps = {
}

type Props = OwnProps & StoreProps & ActionProps & {
  navigator: Object,
  // redux-form
  destroy: (form: string) => void;
};

type State = {
  showGenderPicker: boolean,
  destroyed: boolean
};

class ChildForm extends Component {

  props: Props;
  state: State;

  static propTypes = {
    ...propTypes, // react-form propTypes
    isNew: React.PropTypes.bool.isRequired,
    initialValues: React.PropTypes.object.isRequired,
    childId: React.PropTypes.string,
    navigator: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  }

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
    this.props.navigator.pop();
  }
  onSave() {
    this.markAsDestroyed();
    this.props.navigator.pop();
  }
  componentWillUnmount() {
    if (this.state.destroyed) {
      this.props.destroy('childForm');
    }
  }
  render() {
    return (
      <Container theme={theme}>
        <Header>
          <Button transparent onPress={() => this.onClose()}>
            <Icon name='ios-close' />
          </Button>
          <Title>{this.props.isNew ? 'Add Child' : 'Edit Child'}</Title>
          <Button transparent onPress={() => this.onSave()}>Save</Button>
        </Header>
        <Content>
          <List>
            <ListItemDivider title='BASIC INFO' />
            <Field name='name' component={(props: Field.Props) => {
              return (
                <ListItem iconLeft button
                  onPress={() => this.props.navigator.push(
                    new TextInputRoute({
                      title: 'Child Name',
                      placeholder: 'Type child name here',
                      autoCapitalize: 'words',
                      defaultValue: props.input.value,
                      onSubmit: (text: string) => {
                        props.input.onChange(text.trim());
                        this.props.navigator.pop();
                      }
                    }))
                  }>
                  <Icon name='logo-apple' />
                  <Text>Child Name</Text>
                  <Text note style={theme.listNote}>{props.input.value}</Text>
                </ListItem>
              );
            } } />
            <Field name='gender' component={(props: Field.Props) => {
              const items = {
                M: 'Male',
                F: 'Female'
              };
              return (
                <ListItem iconLeft button
                  onPress={() => this.props.navigator.push(
                    new PickerRoute({
                      title: 'Select Gender',
                      items: items,
                      defaultValue: props.input.value,
                      onSubmit: (v: Gender) => {
                        props.input.onChange(v);
                        this.props.navigator.pop();
                      }
                    }))
                  }>
                  <Icon name='logo-apple' />
                  <Text>Gender</Text>
                  <Text note style={theme.listNote}>{items[props.input.value]}</Text>
                </ListItem>
              );
            } } />
            <ListItemDivider title='TASKS' />
            <Field name='tasks' component={(props: Field.Props) => {
              return (
                <ListItem iconLeft button
                  onPress={() => this.props.navigator.push(
                    new TaskEditorRoute({
                      value: props.input.value,
                      onChange: props.input.onChange
                    }))
                  }>
                  <Icon name='logo-apple' />
                  <Text>Tasks</Text>
                  <Text note style={theme.listNote}>{props.input.value.length}</Text>
                </ListItem>
              );
            } } />
          </List>
        </Content>
      </Container>
    );
  }
}


const mapStateToProps = (state: AppState, ownProps: OwnProps): StoreProps => {
  if (!ownProps.childId) {
    const topWeek = Object.keys(state.children[ownProps.childId].weeklyScores)[0];
    return {
      isNew: false,
      initialValues: Object.assign({}, state.children[ownProps.childId].child, {
        tasks: Object.keys(state.children[ownProps.childId].weeklyScores[topWeek].tasks)
      })
    };
  } else {
    return {
      isNew: true,
      initialValues: {
        id: uuid.v4(),
        name: '',
        gender: 'F',
        totalScore: 0,
        tasks: ['Task A', 'Task B', 'Task C']
      }
    };
  }
};

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'childForm',
    destroyOnUnmount: false
  })(ChildForm));