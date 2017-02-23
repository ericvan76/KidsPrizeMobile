/* @flow */

import React, { Component } from 'react';
import update from 'react-addons-update';

import {
  Container, Header, Left, Body, Right, Text, Title,
  Content, Button, Icon, Form, Item, Input, StyleProvider
} from 'native-base';

import theme from '../theme';

type Props = {
  navigator: Object,
  title: string,
  defaultValue: ?string,
  onSubmit: (value: string) => void
};

type FormState = {
  value: string
};

type State = {
  initial: FormState,
  current: FormState
}

class TextEditor extends Component {

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    const initial: FormState = {
      value: props.defaultValue || ''
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
    return this.state.current.value.trim().length > 0;
  }
  onChangeText(text: string) {
    this.setState(update(this.state, {
      current: {
        value: { $set: text }
      }
    }));
  }
  onSubmit() {
    if (this.isDirty() && this.isValid()) {
      this.props.onSubmit(this.state.current.value.trim());
    }
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
              <Title>{this.props.title}</Title>
            </Body>
            <Right>
              {
                this.isDirty() && this.isValid() &&
                <Button transparent onPress={this.onSubmit.bind(this)}>
                  <Text>Done</Text>
                </Button>
              }
            </Right>
          </Header>
          <Content>
            <Form>
              <Item error={this.isDirty() && !this.isValid()} success={this.isDirty() && this.isValid()}>
                <Input
                  returnKeyType='done'
                  maxLength={50}
                  autoFocus={true}
                  onChangeText={this.onChangeText.bind(this)}
                  onSubmitEditing={this.onSubmit.bind(this)}
                  {...this.props} />
                {this.isDirty() && <Icon name={this.isValid() ? theme.icons.success : theme.icons.error} active />}
              </Item>
            </Form>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default TextEditor;