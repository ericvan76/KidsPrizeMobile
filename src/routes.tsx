import * as React from 'react-native';

import ChildEditor, { Props as ChildEditorProps } from './components/ChildEditor';
import LaunchScreen from './components/LaunchScreen';
import MainView, { OwnProps as MainViewProps } from './components/MainView';
import RedeemEditor, { Props as RedeemEditorProps } from './components/RedeemEditor';
import TaskEditor, { Props as TaskEditorProps } from './components/TaskEditor';
import TextEditor, { Props as TextEditorProps } from './components/TextEditor';

export function launchRoute(): React.Route {
  return { component: LaunchScreen, passProps: {} };
}

export function mainRoute(props: MainViewProps): React.Route {
  return { component: MainView, passProps: props };
}

export function editChildRoute(props: ChildEditorProps): React.Route {
  return { component: ChildEditor, passProps: props };
}

export function editTaskRoute(props: TaskEditorProps): React.Route {
  return { component: TaskEditor, passProps: props };
}

export function editTextRoute(props: TextEditorProps): React.Route {
  return { component: TextEditor, passProps: props };
}

export function addRedeemRoute(props: RedeemEditorProps): React.Route {
  return { component: RedeemEditor, passProps: props };
}
