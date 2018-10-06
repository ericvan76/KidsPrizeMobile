import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TextStyle } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { HeaderIcon } from 'src/components/common/Icons';
import { COLORS, FONT_SIZES, SHARED_STYLES } from 'src/constants';

export interface TasksEditorParams {
  value: Array<string>;
  onSubmit(value: Array<string>): void;
  onSubmitInternal?(): void;
}

interface Props {
  navigation: NavigationScreenProp<{ params: TasksEditorParams }>;
}

interface State {
  value: string;
}

export class TasksEditorView extends React.PureComponent<Props, State> {

  public static navigationOptions = (props: NavigationScreenProps) => {
    const params = props.navigation.state.params as TasksEditorParams;
    const goBack = () => props.navigation.goBack();
    return {
      headerLeft: <HeaderIcon name="close" onPress={goBack} />,
      headerTitle: 'Edit Tasks',
      headerRight: <HeaderIcon name="check" onPress={params.onSubmitInternal} />,
      drawerLockMode: 'locked-closed'
    };
  }

  public constructor(props: Props) {
    super(props);
    this.state = {
      value: this.props.navigation.state.params.value.join('\n')
    };
    this.props.navigation.setParams(
      {
        ...this.props.navigation.state.params,
        onSubmitInternal: this.onSubmitInternal
      }
    );
  }

  private isDirty = (): boolean => {
    const tasks = this.getTasks();
    const prevTasks = this.props.navigation.state.params.value;
    if (tasks.length === prevTasks.length) {
      return tasks.some((t, i) => t !== prevTasks[i]);
    }
    return true;
  }

  private isValid = (): boolean => {
    return this.state.value.trim().length > 0;
  }

  private onChangeText = (text: string): void => {
    this.setState((s: State) => ({ ...s, value: text }));
  }

  private getTasks(): Array<string> {
    const tasks = this.state.value.trim().split('\n').map(s => s.trim()).filter(s => s !== '');
    return tasks.filter((t, i) => tasks.indexOf(t) === i);
  }

  private onSubmitInternal = (): void => {
    if (!this.isValid()) {
      return;
    }
    if (this.isDirty()) {
      this.props.navigation.state.params.onSubmit(this.getTasks());
    }
    this.props.navigation.goBack();
  }

  public render(): JSX.Element {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          style={[styles.textInput, { borderColor: this.isValid() ? COLORS.lightBorder : COLORS.error }]}
          underlineColorAndroid="rgba(0,0,0,0)"
          multiline={true}
          autoFocus={true}
          autoCapitalize="sentences"
          value={this.state.value}
          onChangeText={this.onChangeText}
        />
        <Text style={styles.hint}>Hint: One task per line.</Text>
      </SafeAreaView>
    );
  }
}

// tslint:disable:no-object-literal-type-assertion
const styles = StyleSheet.create({
  ...SHARED_STYLES,
  textInput: {
    flex: 0.5,
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium
  } as TextStyle,
  hint: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.small,
    marginHorizontal: 5,
    textAlign: 'center'
  } as TextStyle
});
// tslint:enable:no-object-literal-type-assertion
