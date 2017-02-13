/* @flow */

import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Text, Title, Content, Button, InputGroup, Input, StyleProvider } from 'native-base';

import theme from '../native-base-theme';

type Props = {
  navigator: Object,
  title: string,
  defaultValue: ?string,
  onSubmit: (value: string) => void
};

type State = {
  value: string
}

class TextInputPage extends Component {

  props: Props;
  state: State;

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
      <StyleProvider style={theme}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigator.pop()}>
                <Text>Cancel</Text>
              </Button>
            </Left>
            <Body>
              <Title>{this.props.title}</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => this.props.onSubmit(this.state.value)}>
                <Text>Done</Text>
              </Button>
            </Right>
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
      </StyleProvider>
    );
  }
}

export default TextInputPage;