import React from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { COLORS, FONT_SIZES, SHARED_STYLES } from 'src/constants';
import { HeaderIcon } from './Icons';
import { RootStackParamList } from '../AppNavigator';
import { StackNavigationProp, StackNavigationOptions } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export interface TextInputParams {
  title?: string;
  value?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onSubmit(value: string): void;
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'TextInput'>;
  route: RouteProp<RootStackParamList, 'TextInput'>;
}

interface State {
  value: string;
}

export class TextInputView extends React.PureComponent<Props, State> {

  public static navigationOptions = (props: Props): StackNavigationOptions => {
    const params = props.route.params;
    const goBack = () => props.navigation.goBack();
    return {
      headerLeft: () => <HeaderIcon name="close" onPress={goBack} />,
      headerTitle: params && params.title || 'Input',
      ///drawerLockMode: 'locked-closed'
    };
  };

  public state: State = {
    value: this.props.route.params.value || ''
  };

  private readonly isDirty = (): boolean => {
    return this.state.value.trim() !== this.props.route.params.value;
  };

  private readonly isValid = (): boolean => {
    return this.state.value.trim().length > 0;
  };

  private readonly onChangeText = (text: string): void => {
    this.setState((s: State) => ({ ...s, value: text }));
  };

  private readonly onSubmitEditing = (): void => {
    if (!this.isValid()) {
      return;
    }
    if (this.isDirty()) {
      this.props.route.params.onSubmit(this.state.value.trim());
    }
    this.props.navigation.goBack();
  };

  public render(): JSX.Element {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          style={[styles.textInput, { borderColor: this.isValid() ? COLORS.lightBorder : COLORS.error }]}
          returnKeyType="done"
          underlineColorAndroid="rgba(0,0,0,0)"
          maxLength={50}
          autoFocus={true}
          autoCapitalize={this.props.route.params.autoCapitalize}
          value={this.state.value}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitEditing}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  ...SHARED_STYLES,
  textInput: {
    height: 48,
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium,
    fontFamily: 'Regular'
  }
});
