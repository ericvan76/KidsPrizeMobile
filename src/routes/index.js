import React from 'react';

import LoginView from '../containers/LoginView';
import MainView from '../containers/MainView';
import Settings from '../containers/Settings';
import ChildForm from '../containers/ChildForm';
import TaskEditor from '../containers/TaskEditor';
import TextInputView from '../containers/TextInputView';
import PickerView from '../containers/PickerView';

export class LoginRoute {
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <LoginView navigator={navigator} {...this.props} />
    );
  }
}

export class MainViewRoute {
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <MainView navigator={navigator} {...this.props} />
    );
  }
}

export class SettingsRoute {
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <Settings navigator={navigator} {...this.props} />
    );
  }
}

export class EditChildRoute {
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <ChildForm navigator={navigator} {...this.props} />
    );
  }
}

export class TaskEditorRoute {
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <TaskEditor navigator={navigator} {...this.props} />
    );
  }
}

// Resuable Routes
export class TextInputRoute {
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <TextInputView navigator={navigator} {...this.props} />
    );
  }
}

export class PickerRoute {
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <PickerView navigator={navigator} {...this.props} />
    );
  }
}