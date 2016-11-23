/* @flow */

import React, { Component } from 'react';
import { Picker } from 'react-native';
import { Container, Header, Title, Content, Button, Icon } from 'native-base';

import theme from '../themes';

type Props = {
  navigator: Object,
  title: string,
  defaultValue: string,
  items: { [key: string]: string },
  onSubmit: (value: string) => void
};

type State = {
  value: string
};

class PickerView extends Component {

  props: Props;
  state: State;

  static propTypes = {
    ...Picker.propTypes,
    navigator: React.PropTypes.object.isRequired,
    title: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string,
    items: React.PropTypes.object.isRequired,
    onSubmit: React.PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.defaultValue || Object.keys(props.items)[0]
    };
  }
  onValueChange(value: string) {
    this.setState({
      value: value
    });
  }
  render() {
    return (
      <Container theme={theme}>
        <Header>
          <Button transparent onPress={() => this.props.navigator.pop()}>
            <Icon name='ios-arrow-back' />
          </Button>
          <Title>{this.props.title}</Title>
          <Button transparent onPress={() => this.props.onSubmit(this.state.value)}>Done</Button>
        </Header>
        <Content>
          <Picker
            mode='dropdown'
            selectedValue={this.state.value}
            onValueChange={v => this.onValueChange(v)}
            {...this.props}>
            {Object.keys(this.props.items).map((k: string) => {
              return (
                <Picker.Item key={k} label={this.props.items[k]} value={k} />
              );
            })}
          </Picker>
        </Content>
      </Container>
    );
  }
}

export default PickerView;