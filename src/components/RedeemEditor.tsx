import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';

import theme from '../theme';
import { Child } from '../types/api';

export interface Props {
  navigator: RN.Navigator;
  child: Child;
  onSubmit: (description: string, value: number) => void;
}

interface State {
  initial: FormState;
  current: FormState;
}

interface FormState {
  description: string;
  value: string;
}

class RedeemEditor extends React.PureComponent<Props, State> {

  public constructor(props: Props) {
    super(props);
    const initial: FormState = {
      description: '',
      value: ''
    };
    this.state = {
      initial,
      current: initial
    };
  }

  private isDirty(): boolean {
    return this.state.initial !== this.state.current;
  }

  private isValid(): boolean {
    return this.isDescriptionValid() && this.isValueValid();
  }

  private isDescriptionValid(): boolean {
    return this.state.current.description.trim().length > 0;
  }

  private isValueValid(): boolean {
    const n = parseInt(this.state.current.value, 10);
    if (isNaN(n)) {
      return false;
    }
    return n > 0 && n <= this.props.child.totalScore;
  }

  private onDescriptionChange(description: string) {
    this.setState({ ...this.state, current: { ...this.state.current, description } });
  }

  private onValueChange(value: string) {
    this.setState({ ...this.state, current: { ...this.state.current, value } });
  }

  private onSubmit() {
    if (this.isDirty() && this.isValid()) {
      this.props.onSubmit(this.state.current.description.trim(), parseInt(this.state.current.value, 10));
    }
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
              <NB.Title>Redeem</NB.Title>
              <NB.Text note>Available: {this.props.child.totalScore}</NB.Text>
            </NB.Body>
            <NB.Right>
              {
                this.isDirty() && this.isValid() &&
                <NB.Button transparent onPress={this.onSubmit.bind(this)}>
                  <NB.Text>Done</NB.Text>
                </NB.Button>
              }
            </NB.Right>
          </NB.Header>
          <NB.Content>
            <NB.Form>
              <NB.Item error={this.isDirty() && !this.isDescriptionValid()} success={this.isDirty() && this.isDescriptionValid()}>
                <NB.Input
                  placeholder="Lego, Icecream, 30min television..."
                  value={this.state.current.description}
                  returnKeyType="done"
                  maxLength={50}
                  autoFocus={true}
                  onChangeText={this.onDescriptionChange.bind(this)} />
                {this.isDirty() && <NB.Icon name={this.isDescriptionValid() ? theme.icons.success : theme.icons.error} active />}
              </NB.Item>
              <NB.Item error={this.isDirty() && !this.isValueValid()} success={this.isDirty() && this.isValueValid()}>
                <NB.Input placeholder="Amount to redeem"
                  value={this.state.current.value}
                  returnKeyType="done"
                  keyboardType="numeric"
                  maxLength={50}
                  onChangeText={this.onValueChange.bind(this)} />
                {this.isDirty() && <NB.Icon name={this.isValueValid() ? theme.icons.success : theme.icons.error} active />}
              </NB.Item>
            </NB.Form>
          </NB.Content>
        </NB.Container>
      </NB.StyleProvider>
    );
  }
}

export default RedeemEditor;
