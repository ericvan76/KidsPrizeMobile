import React, { Component } from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  List,
  ListItem
} from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, propTypes, Field } from 'redux-form';

import ListItemDivider from '../components/ListItemDivider';
import { TextInputRoute, PickerRoute, TaskEditorRoute } from '../routes';
import uuid from '../utils/uuid';
import theme from '../themes';


class ChildForm extends Component {

  static propTypes = {
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
  }

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
            <Field name='name' component={props => {
              return (
                <ListItem iconLeft button
                  onPress={() => this.props.navigator.push(
                    new TextInputRoute({
                      title: 'Child Name',
                      placeholder: 'Type child name here',
                      autoCapitalize: 'words',
                      defaultValue: props.input.value,
                      onSubmit: text => {
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
            <Field name='gender' component={props => {
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
                      onSubmit: v => {
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
            <Field name='tasks' component={props => {
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

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'childForm',
    destroyOnUnmount: false
  })(ChildForm));