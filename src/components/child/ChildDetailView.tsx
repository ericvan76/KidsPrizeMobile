import React from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { Button, List, ListItem } from 'react-native-elements';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { connect, MapStateToProps } from 'react-redux';
import { createChild, deleteChild, modifyChild } from 'src/actions/child';
import { clearErrors } from 'src/actions/requestState';
import { Profile } from 'src/api/auth';
import { Child, ChildId, Gender } from 'src/api/child';
import { TasksEditorParams } from 'src/components/child/TasksEditorView';
import { HeaderIcon } from 'src/components/common/Icons';
import { PickerParams } from 'src/components/common/PickerView';
import { TextInputParams } from 'src/components/common/TextInputView';
import { COLORS, ICON_SIZE, SHARED_STYLES } from 'src/constants';
import { selectChild, selectTasks } from 'src/selectors/child';
import { AppState, RequestState } from 'src/store';
import { displayErrors } from 'src/utils/error';
import * as uuid from 'uuid';

export interface ChildDetailParams {
  childId: ChildId | undefined;
}

interface OwnProps {
  navigation: NavigationScreenProp<{ params: ChildDetailParams }>;
}

interface StateProps {
  profile: Profile | undefined;
  child: Child | undefined;
  tasks: Array<string> | undefined;
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
  tasks: Array<string>;
}

class ChildDetailViewInner extends React.PureComponent<Props, State> {

  public static navigationOptions = (props: NavigationScreenProps) => {
    const params = props.navigation.state.params as ChildDetailParams;
    const goBack = () => props.navigation.goBack();
    const isUpdate = params && params.childId;
    return {
      headerLeft: <HeaderIcon name={isUpdate ? 'arrow-left' : 'close'} onPress={goBack} />,
      headerTitle: isUpdate ? 'Edit Child' : 'Add Child',
      drawerLockMode: 'locked-closed'
    };
  }

  public state: State = {
    id: uuid.v4(),
    name: 'New Child',
    gender: 'M',
    tasks: ['Task 1', 'Task 2', 'Task 3']
  };

  public componentDidUpdate(): void {
    if (Object.keys(this.props.requestState.errors).length > 0) {
      displayErrors(this.props.requestState.errors, this.props.clearErrors);
    }
  }

  private onPressName = () => {
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
  }

  private onPressGender = () => {
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
  }

  private onPressTasks = () => {
    const { id } = this.props.child || this.state;
    const tasks = this.props.tasks || this.state.tasks;
    const params: TasksEditorParams = {
      value: tasks,
      onSubmit: (value: Array<string>) => {
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
    this.props.navigation.navigate('TasksEditor', params);
  }

  private onPressDelete = () => {
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
  }

  private onPressAdd = () => {
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
  }

  public render(): JSX.Element {
    const { name, gender } = this.props.child || this.state;
    const tasks = this.props.tasks || this.state.tasks;
    return (
      <SafeAreaView style={styles.container}>
        <List containerStyle={styles.listContainer}>
          <ListItem
            title="Name"
            rightTitle={name}
            leftIcon={{ name: 'person', type: 'material', style: styles.listItemIcon }}
            onPress={this.onPressName}
            containerStyle={styles.listItemContainer}
            wrapperStyle={styles.listItemWrapperStyle}
            titleStyle={styles.listItemTitle}
            rightTitleStyle={styles.listItemRightTitle}
            chevronColor={COLORS.secondary}
          />
          <ListItem
            title="Gender"
            rightTitle={gender === 'M' ? 'Boy' : 'Girl'}
            leftIcon={{ name: 'human-male-female', type: 'material-community', style: styles.listItemIcon }}
            onPress={this.onPressGender}
            containerStyle={styles.listItemContainer}
            wrapperStyle={styles.listItemWrapperStyle}
            titleStyle={styles.listItemTitle}
            rightTitleStyle={styles.listItemRightTitle}
            chevronColor={COLORS.secondary}
          />
          <ListItem
            title="Tasks"
            badge={{ value: tasks.length, containerStyle: styles.listItemBadge }}
            leftIcon={{ name: 'format-list-bulleted', type: 'material-community', style: styles.listItemIcon }}
            onPress={this.onPressTasks}
            containerStyle={styles.listItemContainer}
            wrapperStyle={styles.listItemWrapperStyle}
            titleStyle={styles.listItemTitle}
            rightTitleStyle={styles.listItemRightTitle}
            chevronColor={COLORS.secondary}
          />
        </List>
        {
          this.props.child !== undefined ?
            <Button
              buttonStyle={[styles.button, { backgroundColor: COLORS.error }]}
              title="Delete Child"
              icon={{ name: 'account-remove', type: 'material-community', size: ICON_SIZE }}
              onPress={this.onPressDelete} />
            :
            <Button
              buttonStyle={[styles.button, { backgroundColor: COLORS.secondary }]}
              title="Add Child"
              icon={{ name: 'account-check', type: 'material-community', size: ICON_SIZE }}
              onPress={this.onPressAdd} />
        }
      </SafeAreaView>
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState, ownProps: OwnProps): StateProps => {
  const profile = state.auth.profile;
  const childId = ownProps.navigation.state.params.childId;
  const child = selectChild(state, childId);
  const tasks = selectTasks(state, childId);
  const requestState = state.requestState;
  return {
    profile,
    child,
    tasks,
    requestState
  };
};

export const ChildDetailView = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps, {
    createChild,
    modifyChild,
    deleteChild,
    clearErrors
  }
)(ChildDetailViewInner);

const styles = StyleSheet.create({
  ...SHARED_STYLES,
  button: {
    marginTop: 60,
    height: 40,
    borderRadius: 5
  }
});
