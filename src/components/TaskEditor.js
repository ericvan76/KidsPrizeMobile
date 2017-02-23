/* @flow */

import React, { Component } from 'react';

import { Container, Header, Left, Body, ListItem, Right, Title, Content, Button, Icon, Text, StyleProvider } from 'native-base';

import theme from '../theme';

import SortableListView from 'react-native-sortable-listview';
import update from 'react-addons-update';

import { TextEditorRoute } from '../routes';

type RowProps = {
  title: string,
  onRemove: (row: string) => void,
  onLongPress?: (row: any) => void,
  onPressOut?: (row: any) => void
};

class Row extends Component {

  props: RowProps;

  render() {
    return (
      <ListItem icon last>
        <Left>
          <Button transparent danger onPress={this.props.onRemove} >
            <Icon name={theme.icons.remove} active />
          </Button>
        </Left>
        <Body>
          <Text ellipsizeMode='tail' numberOfLines={1}>{this.props.title}</Text>
        </Body>
        <Right style={{ padding: 0 }}>
          <Button transparent delayLongPress={0} onLongPress={this.props.onLongPress} onPressOut={this.props.onPressOut}>
            <Icon name={theme.icons.reorder} />
          </Button>
        </Right>
      </ListItem>
    );
  }
}

type Props = {
  navigator: Object,
  value: string[],
  onSubmit: (values: string[]) => void
};

type FormState = {
  data: { [key: string]: string },
  order: string[]
};

type State = {
  initial: FormState,
  current: FormState
}

class TaskEditor extends Component {

  props: Props;
  state: State;

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    value: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onSubmit: React.PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props);
    const initial: FormState = {
      data: Object.assign({}, ...props.value.map((task: string) => {
        return {
          [task]: task
        };
      })),
      order: props.value
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
    return this.state.current.order.length > 0;
  }
  onSubmit() {
    if (this.isDirty() && this.isValid()) {
      const value = this.state.current.order.map(i => this.state.current.data[i]);
      this.props.onSubmit(value);
    }
  }
  onMove(e: any) {
    let order = this.state.current.order.slice();
    order.splice(e.to, 0, order.splice(e.from, 1)[0]);
    this.setState(
      update(this.state, {
        current: {
          order: { $set: order }
        }
      }));
  }
  onRemove(row: string) {
    this.setState(update(this.state, {
      current: {
        order: {
          $splice: [
            [this.state.current.order.indexOf(row), 1]
          ]
        },
        data: {
          $merge: {
            [row]: null
          }
        }
      }
    }));
  }
  onAddTask(text: string) {
    if (text.length > 0 && !this.state.current.order.find(x => x.toLowerCase() === text.toLowerCase())) {
      this.setState(update(this.state, {
        current: {
          order: {
            $push: [
              text
            ]
          },
          data: {
            $merge: {
              [text]: text
            }
          }
        }
      }));

    }
  }
  onAdd() {
    this.props.navigator.push(
      new TextEditorRoute({
        title: 'New Task',
        placeholder: 'Type new task here',
        autoCapitalize: 'words',
        maxLength: 50,
        onSubmit: (text: string) => {
          this.onAddTask(text.trim());
          this.props.navigator.pop();
        }
      }));
  }
  renderRow(row: string) {
    return (
      <Row title={row} onRemove={() => this.onRemove(row)} />
    );
  }
  render() {
    return (
      <StyleProvider style={theme}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigator.pop()}>
                <Icon name={theme.icons.close} />
              </Button>
            </Left>
            <Body>
              <Title>Tasks</Title>
            </Body>
            <Right>
              <Button transparent onPress={this.onAdd.bind(this)}>
                <Text>Add</Text>
              </Button>
              {
                this.isDirty() && this.isValid() &&
                <Button transparent onPress={this.onSubmit.bind(this)}>
                  <Text>Done</Text>
                </Button>
              }
            </Right>
          </Header>
          <Content scrollEnabled={false} horizontal={true} >
            <SortableListView
              style={styles.list}
              sortRowStyle={styles.row}
              data={this.state.current.data}
              order={this.state.current.order}
              onRowMoved={e => this.onMove(e)}
              renderRow={row => this.renderRow(row)} />
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = {
  list: {
    flex: 1,
    width: theme.variables.deviceWidth
  },
  row: {
    opacity: theme.variables.defaultShadowOpacity
  }
};

export default TaskEditor;