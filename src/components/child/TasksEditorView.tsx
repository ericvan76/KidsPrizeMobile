import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TextStyle } from 'react-native';
import { HeaderIcon } from 'src/components/common/Icons';
import { COLORS, FONT_SIZES, SHARED_STYLES } from 'src/constants';
import { StackNavigationProp, StackNavigationOptions } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';
import { RouteProp } from '@react-navigation/native';

export interface TasksEditorParams {
  value: string[];
  onSubmit(value: string[]): void;
  onSubmitInternal?(): void;
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'TaskEditor'>;
  route: RouteProp<RootStackParamList, 'TaskEditor'>;
}

interface State {
  value: string;
}

export class TasksEditorView extends React.PureComponent<Props, State> {

  public static navigationOptions = (props: Props): StackNavigationOptions => {
    const params = props.route.params;
    const goBack = () => props.navigation.goBack();
    return {
      headerLeft: () => <HeaderIcon name="close" onPress={goBack} />,
      headerTitle: 'Edit Tasks',
      headerRight: () => <HeaderIcon name="check" onPress={params.onSubmitInternal} />,
      //  drawerLockMode: 'locked-closed'
    };
  };

  public constructor(props: Props) {
    super(props);
    this.state = {
      value: this.props.route.params.value.join('\n')
    };
    this.props.navigation.setParams(
      {
        ...this.props.route.params,
        onSubmitInternal: this.onSubmitInternal
      }
    );
  }

  private readonly isDirty = (): boolean => {
    const tasks = this.getTasks();
    const prevTasks = this.props.route.params.value;
    if (tasks.length === prevTasks.length) {
      return tasks.some((t, i) => t !== prevTasks[i]);
    }
    return true;
  };

  private readonly isValid = (): boolean => {
    return this.state.value.trim().length > 0;
  };

  private readonly onChangeText = (text: string): void => {
    this.setState((s: State) => ({ ...s, value: text }));
  };

  private getTasks(): string[] {
    const tasks = this.state.value
      .trim()
      .split('\n')
      .map(s => s.trim())
      .filter(s => s !== '');
    return tasks.filter((t, i) => tasks.indexOf(t) === i);
  }

  private readonly onSubmitInternal = (): void => {
    if (!this.isValid()) {
      return;
    }
    if (this.isDirty()) {
      this.props.route.params.onSubmit(this.getTasks());
    }
    this.props.navigation.goBack();
  };

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

const styles = StyleSheet.create({
  ...SHARED_STYLES,
  textInput: {
    textAlignVertical: 'top',
    flex: 0.5,
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium,
    fontFamily: 'Regular'
  } as TextStyle,
  hint: {
    color: COLORS.primary,
    marginHorizontal: 5,
    textAlign: 'center',
    fontFamily: 'Regular'
  } as TextStyle
});
