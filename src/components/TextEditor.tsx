import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';

import theme from '../theme';

export interface Props extends RN.TextInputProperties {
  navigator: RN.Navigator;
  title: string;
  onSubmit: (value: string) => void;
}

interface FormState {
  value: string;
}

interface State {
  initial: FormState;
  current: FormState;
}

class TextEditor extends React.PureComponent<Props, State> {

  public constructor(props: Props) {
    super(props);
    const initial: FormState = {
      value: this.props.defaultValue || ''
    };
    this.state = {
      initial,
      current: initial
    };
  }

  private isDirty = (): boolean => {
    return this.state.initial !== this.state.current;
  }
  private isValid = (): boolean => {
    return this.state.current.value.trim().length > 0;
  }
  private onTextChanged = (text: string) => {
    this.setState({ ...this.state, current: { ...this.state.current, value: text } });
  }
  private onClose = () => {
    this.props.navigator.popToTop();
  }
  private onSubmit = () => {
    if (this.isDirty() && this.isValid()) {
      this.props.onSubmit(this.state.current.value.trim());
    }
  }

  public render() {
    return (
      <NB.StyleProvider style={theme}>
        <NB.Container>
          <NB.Header>
            <NB.Left>
              <NB.Button transparent onPress={this.onClose}>
                <NB.Icon name={theme.icons.close} />
              </NB.Button>
            </NB.Left>
            <NB.Body>
              <NB.Title>{this.props.title}</NB.Title>
            </NB.Body>
            <NB.Right>
              {
                this.isDirty() && this.isValid() &&
                <NB.Button transparent onPress={this.onSubmit}>
                  <NB.Text>Done</NB.Text>
                </NB.Button>
              }
            </NB.Right>
          </NB.Header>
          <NB.Content>
            <NB.Form>
              <NB.Item
                error={this.isDirty() && !this.isValid()}
                success={this.isDirty() && this.isValid()}>
                <NB.Input
                  returnKeyType="done"
                  maxLength={50}
                  autoFocus={true}
                  onChangeText={this.onTextChanged}
                  onSubmitEditing={this.onSubmit}
                  {...this.props}
                />
                {this.isDirty() && <NB.Icon name={this.isValid() ? theme.icons.success : theme.icons.error} active />}
              </NB.Item>
            </NB.Form>
          </NB.Content>
        </NB.Container>
      </NB.StyleProvider>
    );
  }
}

export default TextEditor;
