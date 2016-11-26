/* @flow */

import React from 'react';

import LoginView from '../containers/LoginView';
import MainView from '../containers/MainView';
import ChildForm from '../containers/ChildForm';
import TaskEditor from '../components/TaskEditor';
import TextInputView from '../components/TextInputView';
import PickerView from '../components/PickerView';

export type Route = {
  renderScene: (navigator: Object) => any
}

export class LoginRoute {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  renderScene(navigator: Object) {
    return (
      <LoginView navigator={navigator} {...this.props} />
    );
  }
}

export class MainViewRoute {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  renderScene(navigator: Object) {
    return (
      <MainView navigator={navigator} {...this.props} />
    );
  }
}

export class EditChildRoute {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  renderScene(navigator: Object) {
    return (
      <ChildForm navigator={navigator} {...this.props} />
    );
  }
}

export class TaskEditorRoute {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  renderScene(navigator: Object) {
    return (
      <TaskEditor navigator={navigator} {...this.props} />
    );
  }
}

// Resuable Routes
export class TextInputRoute {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  renderScene(navigator: Object) {
    return (
      <TextInputView navigator={navigator} {...this.props} />
    );
  }
}

export class PickerRoute {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  renderScene(navigator: Object) {
    return (
      <PickerView navigator={navigator} {...this.props} />
    );
  }
}