import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import SortableListView from 'react-native-sortable-listview';

import * as routes from '../routes';
import theme from '../theme';

interface RowProps {
  title: string;
  onRemove: () => void;
  onLongPress?: () => void;
  onPressOut?: () => void;
}

class Row extends React.PureComponent<RowProps, void> {

  public render() {
    return (
      <NB.ListItem icon last>
        <NB.Left>
          <NB.Button transparent danger onPress={this.props.onRemove} >
            <NB.Icon name={theme.icons.remove} active />
          </NB.Button>
        </NB.Left>
        <NB.Body>
          <NB.Text ellipsizeMode="tail" numberOfLines={1}>{this.props.title}</NB.Text>
        </NB.Body>
        <NB.Right style={{ padding: 0 }}>
          <NB.Button transparent delayLongPress={0} onLongPress={this.props.onLongPress} onPressOut={this.props.onPressOut}>
            <NB.Icon name={theme.icons.reorder} />
          </NB.Button>
        </NB.Right>
      </NB.ListItem>
    );
  }
}

export interface Props {
  navigator: RN.Navigator;
  value: Array<string>;
  onSubmit: (values: Array<string>) => void;
}

interface FormState {
  data: { [key: string]: string };
  order: Array<string>;
}

interface State {
  initial: FormState;
  current: FormState;
}

class TaskEditor extends React.PureComponent<Props, State> {

  private isDirty(): boolean {
    return this.state.initial !== this.state.current;
  }
  private isValid(): boolean {
    return this.state.current.order.length > 0;
  }
  private onSubmit() {
    if (this.isDirty() && this.isValid()) {
      const value = this.state.current.order.map(i => this.state.current.data[i]);
      this.props.onSubmit(value);
    }
  }

  // tslint:disable-next-line:no-any
  private onMove(e: any) {
    const order = this.state.current.order.slice();
    order.splice(e.to, 0, order.splice(e.from, 1)[0]);
    this.setState({
      ...this.state,
      current: { ...this.state.current, order }
    });
  }
  private onRemove(row: string) {
    this.setState({
      ...this.state,
      current: {
        data: Object.keys(this.state.current.data).reduce(
          (acc: { [key: string]: string }, key) => {
            if (key !== row) {
              acc[key] = this.state.current.data[key];
            }
            return acc;
          },
          {}),
        order: this.state.current.order.filter(i => i !== row)
      }
    });
  }
  private onAddTask(text: string) {
    if (text.length > 0 && !this.state.current.order.find(x => x.toLowerCase() === text.toLowerCase())) {
      this.setState({
        ...this.state,
        current: {
          data: {
            ...this.state.current.data,
            [text]: text
          },
          order: [...this.state.current.order, text]
        }
      });
    }
  }
  private onAdd() {
    this.props.navigator.push(
      routes.editTextRoute({
        navigator: this.props.navigator,
        title: 'New Task',
        placeholder: 'Type new task here',
        maxLength: 50,
        onSubmit: (text: string) => {
          this.onAddTask(text.trim());
          this.props.navigator.pop();
        }
      }));
  }
  private renderRow(row: string) {
    return (
      <Row title={row} onRemove={() => this.onRemove(row)} />
    );
  }
  public componentWillMount() {
    const initial: FormState = {
      data: Object.assign({}, ...this.props.value.map((task: string) => {
        return {
          [task]: task
        };
      })),
      order: this.props.value
    };
    this.state = {
      initial,
      current: initial
    };
  }
  public render() {
    return (
      <NB.StyleProvider style={theme}>
        <NB.Container>
          <NB.Header>
            <NB.Left>
              <NB.Button transparent onPress={() => this.props.navigator.pop()}>
                <NB.Icon name={theme.icons.close} />
              </NB.Button>
            </NB.Left>
            <NB.Body>
              <NB.Title>Tasks</NB.Title>
            </NB.Body>
            <NB.Right>
              <NB.Button transparent onPress={this.onAdd.bind(this)}>
                <NB.Text>Add</NB.Text>
              </NB.Button>
              {
                this.isDirty() && this.isValid() &&
                <NB.Button transparent onPress={this.onSubmit.bind(this)}>
                  <NB.Text>Done</NB.Text>
                </NB.Button>
              }
            </NB.Right>
          </NB.Header>
          <SortableListView
            style={styles.list}
            sortRowStyle={styles.row}
            data={this.state.current.data}
            order={this.state.current.order}
            onRowMoved={e => this.onMove(e)}
            renderRow={(row: string) => this.renderRow(row)} />
        </NB.Container>
      </NB.StyleProvider>
    );
  }
}

const styles = {
  list: {
    flex: 1,
    width: theme.variables.deviceWidth
  } as RN.ViewProperties,
  row: {
    opacity: theme.variables.defaultShadowOpacity
  } as RN.ViewProperties
};

export default TaskEditor;
