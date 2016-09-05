import React from 'react';

import MainView from './containers/MainView';
import Settings from './containers/Settings';
import ChildForm from './containers/ChildForm';
import TaskEditor from './containers/TaskEditor';
import TextInputView from './containers/TextInputView';
import PickerView from './containers/PickerView';

export class MainViewRoute {
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <MainView navigator={navigator} {...this.props}></MainView>
    );
  }
}

export class SettingsRoute {
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <Settings navigator={navigator} {...this.props}></Settings>
    );
  }
}

export class EditChildRoute {
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <ChildForm navigator={navigator} {...this.props}></ChildForm>
    );
  }
}

export class TaskEditorRoute {
  static propTypes = {
    value: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onChange: React.PropTypes.func.isRequired
  }
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <TaskEditor navigator={navigator} {...this.props}></TaskEditor>
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
      <TextInputView navigator={navigator} {...this.props}/>
    );
  }
}

export class PickerRoute {
  constructor(props) {
    this.props = props;
  }
  renderScene(navigator) {
    return (
      <PickerView navigator={navigator} {...this.props}/>
    );
  }
}