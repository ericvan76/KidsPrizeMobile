/* @flow */

import React, { Component } from 'react';
import update from 'react-addons-update';

import { Container, Header, Left, Body, Right, Text, Title, Content, Button, Icon, Form, Item, Input, StyleProvider } from 'native-base';

import type { Child } from '../types/api.flow';

import theme from '../native-base-theme';

type Props = {
  navigator: Object,
  child: Child,
  onSubmit: (description: string, value: number) => void
};

type State = {
  initial: FormState,
  current: FormState
}

type FormState = {
  description: string,
  value: string
}

class RedeemEditor extends Component {

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    const initial: FormState = {
      description: '',
      value: ''
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
    return this.isDescriptionValid() && this.isValueValid();
  }

  isDescriptionValid(): boolean {
    return this.state.current.description.trim().length > 0;
  }

  isValueValid(): boolean {
    const n = parseInt(this.state.current.value);
    if (isNaN(n)) {
      return false;
    }
    return n > 0 && n <= this.props.child.totalScore;
  }

  onTextChange(text: string) {
    this.setState(update(this.state, {
      current: {
        description: { $set: text }
      }
    }));
  }

  onValueChange(value: string) {
    this.setState(update(this.state, {
      current: {
        value: { $set: value }
      }
    }));
  }

  onSubmit() {
    if (this.isDirty() && this.isValid()) {
      this.props.onSubmit(this.state.current.description.trim(), parseInt(this.state.current.value));
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
              <Title>Add Redeem</Title>
              <Text note>Available: {this.props.child.totalScore}</Text>
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
              <Item error={this.isDirty() && !this.isDescriptionValid()} success={this.isDirty() && this.isDescriptionValid()}>
                <Input placeholder="Lego, Icecream, 30min television..."
                  value={this.state.current.description}
                  returnKeyType='done'
                  maxLength={50}
                  autoFocus={true}
                  onChangeText={this.onTextChange.bind(this)} />
                {this.isDirty() && <Icon name={this.isDescriptionValid() ? theme.icons.success : theme.icons.error} active />}
              </Item>
              <Item error={this.isDirty() && !this.isValueValid()} success={this.isDirty() && this.isValueValid()}>
                <Input placeholder="Amount to redeem"
                  value={this.state.current.value}
                  returnKeyType='done'
                  keyboardType='numeric'
                  maxLength={50}
                  onChangeText={this.onValueChange.bind(this)} />
                {this.isDirty() && <Icon name={this.isValueValid() ? theme.icons.success : theme.icons.error} active />}
              </Item>
            </Form>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default RedeemEditor;
