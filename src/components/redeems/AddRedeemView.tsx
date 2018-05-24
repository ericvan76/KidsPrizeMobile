import React from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { HeaderIcon } from 'src/components/common/Icons';
import { COLORS, FONT_SIZES, SHARED_STYLES } from 'src/constants';

export interface AddRedeemParams {
  onSubmit(description: string, value: number): void;
  onSubmitInternal?(): void;
}

interface Props {
  navigation: NavigationScreenProp<{ params: AddRedeemParams }>;
}

interface State {
  description: string;
  value: string;
}

export class AddRedeemView extends React.PureComponent<Props, State> {

  public static navigationOptions = (props: NavigationScreenProps) => {
    const params = props.navigation.state.params as AddRedeemParams;
    const goBack = () => props.navigation.goBack();
    return {
      headerLeft: <HeaderIcon name="close" onPress={goBack} />,
      headerTitle: 'Add Redeem',
      headerRight: <HeaderIcon name="check" onPress={params.onSubmitInternal} />,
      drawerLockMode: 'locked-closed'
    };
  }

  public constructor(props: Props) {
    super(props);
    this.state = {
      description: '',
      value: ''
    };
    this.props.navigation.setParams(
      {
        ...this.props.navigation.state.params,
        onSubmitInternal: this.onSubmitInternal
      }
    );
  }

  private isValidDescription = (): boolean => {
    const { description } = this.state;
    return description.trim().length > 0;
  }

  private onChangeDescription = (text: string): void => {
    this.setState((s: State) => ({ ...s, description: text }));
  }

  private isValidValue = (): boolean => {
    const { value } = this.state;
    const num = parseInt(value.trim(), 10);
    return !isNaN(num);
  }

  private onChangeValue = (text: string): void => {
    this.setState((s: State) => ({ ...s, value: text }));
  }

  private onSubmitInternal = (): void => {
    const { description, value } = this.state;
    if (this.isValidDescription() && this.isValidValue()) {
      const num = parseInt(value.trim(), 10);
      this.props.navigation.state.params.onSubmit(description.trim(), num);
      this.props.navigation.goBack();
    }
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          style={[styles.textInput, { borderColor: this.isValidDescription() ? COLORS.lightBorder : COLORS.error }]}
          underlineColorAndroid="rgba(0,0,0,0)"
          maxLength={50}
          autoFocus={true}
          autoCapitalize="sentences"
          placeholder="Lego, Ice cream, 30min television..."
          value={this.state.description}
          onChangeText={this.onChangeDescription}
        />
        <TextInput
          style={[styles.textInput, { borderColor: this.isValidValue() ? COLORS.lightBorder : COLORS.error }]}
          underlineColorAndroid="rgba(0,0,0,0)"
          maxLength={50}
          keyboardType="numeric"
          placeholder="Amount to redeem"
          value={this.state.value}
          onChangeText={this.onChangeValue}
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
    fontSize: FONT_SIZES.medium
  }
});
