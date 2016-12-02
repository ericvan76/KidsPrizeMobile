/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Header, Title, Content, Button, Icon, Text } from 'native-base';
import SortableListView from 'react-native-sortable-listview';
import update from 'react-addons-update';

import Seperator from '../components/Seperator';
import theme from '../themes';
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
      <View style={{ backgroundColor: theme.backgroundColor }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 5,
            backgroundColor: theme.inverseTextColor
          }}>
          <Button transparent onPress={this.props.onRemove}>
            <Icon name='ios-remove-circle' style={{ color: theme.badgeBg }} />
          </Button>
          <Text
            style={{
              flex: 1,
              textAlign: 'left',
              paddingLeft: 5,
              paddingRight: 5,
              color: theme.textColor,
              fontSize: theme.inputFontSize
            }}
            ellipsizeMode='tail'
            numberOfLines={1}
            >{this.props.title}</Text>
          <Button transparent delayLongPress={0} onLongPress={this.props.onLongPress} onPressOut={this.props.onPressOut}>
            <Icon name='ios-reorder' style={{ color: theme.listNoteColor }} />
          </Button>
        </View>
        <Seperator />
      </View>
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
      <Container theme={theme}>
        <Header>
          <Button transparent onPress={() => this.props.navigator.pop()}>Cancel</Button>
          <Title>Task List</Title>
          <Button transparent onPress={() => this.onAddPress()}>
            <Icon name='ios-add-circle-outline' />
          </Button>
          <Button transparent onPress={() => {
            const value = this.state.order.map(i => this.state.data[i]);
            this.props.onSubmit(value);
          } }>Done</Button>
        </Header>
        <Content horizontal={true} scrollEnabled={false} >
          <SortableListView
            style={{
              flex: 1,
              backgroundColor: theme.inverseTextColor,
              width: theme.screenWidth
            }}
            sortRowStyle={{
              opacity: theme.shadowOpacity,
              backgroundColor: theme.inverseTextColor
            }}
            data={this.state.data}
            order={this.state.order}
            onRowMoved={e => this.onMove(e)}
            renderRow={row => this.renderRow(row)} />
        </Content>
      </Container>
    );
  }
}

export default TaskEditorPage;