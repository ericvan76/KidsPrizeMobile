import React, { Component } from 'react';
import { View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text
} from 'native-base';
import SortableListView from 'react-native-sortable-listview';
import update from 'react-addons-update';

import Seperator from '../components/Seperator';
import theme from '../themes';
import { TextInputRoute } from '../routes';

class Row extends Component {

  static propTypes = {
    title: React.PropTypes.string,
    onRemove: React.PropTypes.func,
    onLongPress: React.PropTypes.func,
    onPressOut: React.PropTypes.func
  }

  render() {
    return (
      <View>
        <View style={styles.row}>
          <Button transparent onPress={this.props.onRemove }>
            <Icon style={styles.removeIcon} name='ios-remove-circle' />
          </Button>
          <Text style={styles.rowText} ellipsizeMode='tail' numberOfLines={1}>{this.props.title}</Text>
          <Button transparent delayLongPress={0} onLongPress={this.props.onLongPress} onPressOut={this.props.onPressOut}>
            <Icon style={styles.draggableIcon} name='ios-reorder'/>
          </Button>
        </View>
        <Seperator />
      </View>
    );
  }
}

class TaskEditor extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    value: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onChange: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      data: Object.assign({}, ...props.value.map(t => {
        return {
          [t]: t
        };
      })),
      order: props.value
    };
  }
  onMove(e) {
    let order = this.state.order.slice();
    order.splice(e.to, 0, order.splice(e.from, 1)[0]);
    const newState = update(this.state, {
      order: {
        $set: order
      }
    });
    this.setState(newState);
    this.onChange(newState);
  }
  onRemove(row) {
    const newState = update(this.state, {
      order: {
        $splice: [
          [this.state.order.indexOf(row), 1]
        ]
      },
      data: {
        $merge: {
          [row]: undefined
        }
      }
    });
    this.setState(newState);
    this.onChange(newState);
  }
  onAdd(text) {
    if (text.length > 0 && this.state.data[text] === undefined) {
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
      this.onChange(newState);
    }
  }
  onChange(state) {
    const value = state.order.map(i => state.data[i]);
    this.props.onChange(value);
  }
  onAddPress() {
    this.props.navigator.push(
      new TextInputRoute({
        title: 'New Task',
        placeholder: 'Type new task here',
        onSubmit: text => {
          this.onAdd(text);
          this.props.navigator.pop();
        }
      }));
  }
  renderRow(row) {
    return (
      <Row title={row} onRemove={()=>this.onRemove(row) }/>
    );
  }
  render() {
    return (
      <Container theme={theme}>
        <Header>
          <Button transparent onPress={() => this.props.navigator.pop() }>
            <Icon name='ios-arrow-back'/>
          </Button>
          <Title>Task List</Title>
          <Button transparent onPress={() => this.onAddPress() }>Add</Button>
        </Header>
        <Content horizontal={true} scrollEnabled={false}>
          <SortableListView
            style={styles.listView}
            sortRowStyle={styles.sortRow}
            data={this.state.data}
            order={this.state.order}
            onRowMoved={e => this.onMove(e) }
            renderRow={row => this.renderRow(row) }/>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    width: '100%'
  },
  sortRow: {
    opacity: 0.8,
    backgroundColor: theme.inverseTextColor
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.3rem',
    backgroundColor: theme.inverseTextColor
  },
  rowText: {
    flex: 1,
    textAlign: 'left',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    color: theme.textColor
  },
  removeIcon: {
    color: theme.badgeBg
  },
  draggableIcon: {
    color: theme.listNoteColor
  }
});

export default TaskEditor;