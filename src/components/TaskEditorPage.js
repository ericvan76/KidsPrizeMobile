/* @flow */

import React, { Component } from 'react';

import { Container, Header, Left, Body, ListItem, Right, Title, Content, Button, Icon, Text, StyleProvider } from 'native-base';

import theme from '../native-base-theme';

import SortableListView from 'react-native-sortable-listview';
import update from 'react-addons-update';

import { TextInputRoute } from '../routes';

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
        <Left >
          <Button style={{ padding: 0 }} transparent danger onPress={this.props.onRemove} >
            <Icon name={theme.icons.remove} active />
          </Button>
        </Left>
        <Body>
          <Text ellipsizeMode='tail' numberOfLines={1}>{this.props.title}</Text>
        </Body>
        <Right>
          <Button style={{ padding: 0 }} transparent info delayLongPress={0} onLongPress={this.props.onLongPress} onPressOut={this.props.onPressOut}>
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

type State = {
  data: { [key: string]: string },
  order: string[]
};

class TaskEditorPage extends Component {

  props: Props;
  state: State;

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    value: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onSubmit: React.PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      data: Object.assign({}, ...props.value.map((task: string) => {
        return {
          [task]: task
        };
      })),
      order: props.value
    };
  }
  onMove(e: any) {
    let order = this.state.order.slice();
    order.splice(e.to, 0, order.splice(e.from, 1)[0]);
    const newState = update(this.state, {
      order: {
        $set: order
      }
    });
    this.setState(newState);
  }
  onRemove(row: string) {
    const newState = update(this.state, {
      order: {
        $splice: [
          [this.state.order.indexOf(row), 1]
        ]
      },
      data: {
        $merge: {
          [row]: null
        }
      }
    });
    this.setState(newState);
  }
  onAdd(text: string) {
    text = text.trim();
    if (text.length > 0 && !this.state.order.find(x => x.toLowerCase() === text.toLowerCase())) {
      const newState = update(this.state, {
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
      });
      this.setState(newState);
    }
  }
  onAddPress() {
    this.props.navigator.push(
      new TextInputRoute({
        title: 'New Task',
        placeholder: 'Type new task here',
        autoCapitalize: 'words',
        maxLength: 50,
        onSubmit: (text: string) => {
          this.onAdd(text);
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
                <Text>Cancel</Text>
              </Button>
            </Left>
            <Body>
              <Title>Tasks</Title>
            </Body>
            <Right>
              <Button transparent onPress={this.onAddPress.bind(this)}>
                <Icon name={theme.icons.addTask} />
              </Button>
              <Button transparent onPress={() => {
                const value = this.state.order.map(i => this.state.data[i]);
                this.props.onSubmit(value);
              }}>
                <Text>Done</Text>
              </Button>
            </Right>
          </Header>
          <Content horizontal={true} scrollEnabled={false} >
            <SortableListView
              style={styles.list}
              sortRowStyle={styles.row}
              data={this.state.data}
              order={this.state.order}
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
    opacity: 0.8
  }
};

export default TaskEditorPage;