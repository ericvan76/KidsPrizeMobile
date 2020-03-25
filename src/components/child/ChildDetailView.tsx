import React from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import { connect, MapStateToProps } from 'react-redux';
import { createChild, deleteChild, modifyChild } from 'src/actions/child';
import { clearErrors } from 'src/actions/requestState';
import { Profile } from 'src/api/auth';
import { Child, Gender } from 'src/api/child';
import { TasksEditorParams } from 'src/components/child/TasksEditorView';
import { HeaderIcon } from 'src/components/common/Icons';
import { PickerParams } from 'src/components/common/PickerView';
import { TextInputParams } from 'src/components/common/TextInputView';
import { BADGE_PROPS, COLORS, SHARED_STYLES } from 'src/constants';
import { selectCurrentChild, selectTasks } from 'src/selectors/child';
import { AppState, RequestState } from 'src/store';
import { tryDisplayErrors } from 'src/utils/error';
import * as uuid from 'uuid';
import { StackNavigationProp, StackNavigationOptions } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';
import { RouteProp } from '@react-navigation/native';

export interface ChildDetailParams {
  createNew?: boolean;
}

interface OwnProps {
  navigation: StackNavigationProp<RootStackParamList, 'ChildDetail'>;
  route: RouteProp<RootStackParamList, 'ChildDetail'>;
}

interface StateProps {
  profile: Profile | undefined;
  child: Child | undefined;
  tasks: string[] | undefined;
  requestState: RequestState;
}
interface DispatchProps {
  createChild: typeof createChild;
  modifyChild: typeof modifyChild;
  deleteChild: typeof deleteChild;
  clearErrors: typeof clearErrors;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  id: string;
  name: string;
  gender: Gender;
  tasks: string[];
}

class ChildDetailViewInner extends React.PureComponent<Props, State> {

  public static navigationOptions = (props: Props): StackNavigationOptions => {
    const params = props.route.params;
    const goBack = () => props.navigation.goBack();
    const isUpdate = !(params && params.createNew);
    const headerIcon = isUpdate ? 'arrow-left' : 'close';
    return {
      headerLeft: () => <HeaderIcon name={headerIcon} onPress={goBack} />,
      headerTitle: isUpdate ? 'Edit Child' : 'Add Child'
      //  drawerLockMode: 'locked-closed'
    };
  };

  public state: State = {
    id: uuid.v4(),
    name: 'New Child',
    gender: 'M',
    tasks: ['Task 1', 'Task 2', 'Task 3']
  };

  public componentDidUpdate(): void {
    if (tryDisplayErrors(this.props.requestState.errors)) {
      return;
    }
  }

  private readonly onPressName = () => {
    const { id, name } = this.props.child || this.state;
    const params: TextInputParams = {
      title: 'Input Name',
      value: name,
      autoCapitalize: 'words',
      onSubmit: (value: string) => {
        if (this.props.child) {
          this.props.modifyChild({
            childId: id,
            name: value
          });
        } else {
          this.setState((s: State) => ({
            ...s,
            name: value
          }));
        }
      }
    };
    this.props.navigation.navigate('TextInput', params);
  };

  private readonly onPressGender = () => {
    const { id, gender } = this.props.child || this.state;
    const params: PickerParams<Gender> = {
      title: 'Select Gender',
      items: [
        { name: 'Boy', value: 'M', icon: 'human-male', family: 'material-community' },
        { name: 'Girl', value: 'F', icon: 'human-female', family: 'material-community' }
      ],
      selectedValue: gender,
      onSelect: (value: Gender) => {
        if (this.props.child) {
          this.props.modifyChild({
            childId: id,
            gender: value
          });
        } else {
          this.setState((s: State) => ({
            ...s,
            gender: value
          }));
        }
      }
    };
    this.props.navigation.navigate('Picker', params);
  };

  private readonly onPressTasks = () => {
    const { id } = this.props.child || this.state;
    const tasks = this.props.tasks || this.state.tasks;
    const params: TasksEditorParams = {
      value: tasks,
      onSubmit: (value: string[]) => {
        if (this.props.child) {
          this.props.modifyChild({
            childId: id,
            tasks: value
          });
        } else {
          this.setState((s: State) => ({
            ...s,
            tasks: value
          }));
        }
      }
    };
    this.props.navigation.navigate('TaskEditor', params);
  };

  private readonly onPressDelete = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this child? This cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes', onPress: async () => {
            if (this.props.child) {
              this.props.deleteChild(this.props.child.id);
              this.props.navigation.goBack();
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  private readonly onPressAdd = () => {
    const { id, name, gender, tasks } = this.state;
    if (name.length > 0) {
      this.props.createChild({
        childId: id,
        name,
        gender,
        tasks
      });
      this.props.navigation.goBack();
    }
  };

  public render(): JSX.Element {
    const { name, gender } = this.props.child || this.state;
    const tasks = this.props.tasks || this.state.tasks;
    const genderTitle = gender === 'M' ? 'Boy' : 'Girl';
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>
          <ListItem
            chevron
            title="Name"
            rightTitle={name}
            leftIcon={{ name: 'person', type: 'material', iconStyle: styles.listItemIcon }}
            onPress={this.onPressName}
            containerStyle={styles.listItemContainer}
            titleStyle={styles.listItemTitle}
            rightTitleStyle={styles.listItemRightTitle}
          />
          <ListItem
            chevron
            title="Gender"
            rightTitle={genderTitle}
            leftIcon={{ name: 'human-male-female', type: 'material-community', iconStyle: styles.listItemIcon }}
            onPress={this.onPressGender}
            containerStyle={styles.listItemContainer}
            titleStyle={styles.listItemTitle}
            rightTitleStyle={styles.listItemRightTitle}
          />
          <ListItem
            chevron
            title="Tasks"
            badge={{ value: tasks.length, ...BADGE_PROPS }}
            leftIcon={{ name: 'format-list-bulleted', type: 'material-community', iconStyle: styles.listItemIcon }}
            onPress={this.onPressTasks}
            containerStyle={styles.listItemContainer}
            titleStyle={styles.listItemTitle}
            rightTitleStyle={styles.listItemRightTitle}
          />
        </View>
        {
          this.props.child !== undefined ?
            <Button
              titleStyle={styles.buttonTitle}
              buttonStyle={[styles.button, { backgroundColor: COLORS.error }]}
              title="Delete Child"
              icon={{ name: 'account-remove', type: 'material-community', color: COLORS.white }}
              onPress={this.onPressDelete} />
            :
            <Button
              titleStyle={styles.buttonTitle}
              buttonStyle={[styles.button, { backgroundColor: COLORS.primary }]}
              title="Add Child"
              icon={{ name: 'account-check', type: 'material-community', color: COLORS.white }}
              onPress={this.onPressAdd} />
        }
      </SafeAreaView>
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState, ownProps: OwnProps): StateProps => {
  const profile = state.auth.profile;
  const createNew = ownProps.route.params && ownProps.route.params.createNew;
  const child = createNew === true ? undefined : selectCurrentChild(state);
  const tasks = selectTasks(state, child && child.id);
  const requestState = state.requestState;
  return {
    profile,
    child,
    tasks,
    requestState
  };
};

export const ChildDetailView = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  {
    createChild,
    modifyChild,
    deleteChild,
    clearErrors
  }
)(ChildDetailViewInner);

const styles = StyleSheet.create({
  ...SHARED_STYLES,
  button: {
    ...SHARED_STYLES.button,
    marginTop: 40
  }
});
