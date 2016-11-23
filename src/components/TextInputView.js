/* @flow */

import React, { Component } from 'react';
import { Container, Header, Title, Content, Button, Icon, InputGroup, Input } from 'native-base';
import theme from '../themes';

type Props = {
  navigator: Object,
  title: string,
  defaultValue: ?string,
  onSubmit: (value: string) => void
};

type State = {
  value: string
}

class TextInputView extends Component {

  props: Props;
  state: State;

  static propTypes = {
    ...Input.propTypes,
    navigator: React.PropTypes.object.isRequired,
    title: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string,
    onSubmit: React.PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.defaultValue || ''
    };
  }
  onChangeText(text: string) {
    this.setState({
      value: text
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
          <Button transparent onPress={() => this.props.onSubmit(this.state.value)}
            >Done</Button>
        </Header>
        <Content>
          <InputGroup borderType='regular' >
            <Input
              returnKeyType='done'
              maxLength={50}
              autoFocus={true}
              onChangeText={text => this.onChangeText(text)}
              onSubmitEditing={() => this.props.onSubmit(this.state.value)}
              {...this.props} />
          </InputGroup>
        </Content>
      </Container>
    );
  }
}

export default TextInputView;