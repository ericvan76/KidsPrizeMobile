import * as RN from 'react-native';

import ChildEditor, { Props as ChildEditorProps } from './components/ChildEditor';
import Launcher from './components/Launcher';
import RedeemEditor, { Props as RedeemEditorProps } from './components/RedeemEditor';
import RedeemListView, { OwnProps as RedeemListViewProps } from './components/RedeemListView';
import TaskEditor, { Props as TaskEditorProps } from './components/TaskEditor';
import TextEditor, { Props as TextEditorProps } from './components/TextEditor';

export function launcherRoute(): RN.Route {
  return { component: Launcher, passProps: {} };
}

export function editChildRoute(props: ChildEditorProps): RN.Route {
  return { component: ChildEditor, passProps: props };
}

export function editTaskRoute(props: TaskEditorProps): RN.Route {
  return { component: TaskEditor, passProps: props };
}

export function editTextRoute(props: TextEditorProps): RN.Route {
  return { component: TextEditor, passProps: props };
}

export function redeemListRoute(props: RedeemListViewProps): RN.Route {
  return { component: RedeemListView, passProps: props };
}

export function addRedeemRoute(props: RedeemEditorProps): RN.Route {
  return { component: RedeemEditor, passProps: props };
}
