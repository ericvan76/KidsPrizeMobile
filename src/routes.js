import React from 'react';
import MainView from './containers/MainView';
import Settings from './containers/Settings';
import ChildForm from './containers/ChildForm';
import ChildFormTasksEditor from './containers/ChildFormTasksEditor';

export class MainViewRoute {
  renderScene(navigator) {
    return (
      <MainView navigator={navigator}></MainView>
    );
  }
}

export class SettingsRoute {
  renderScene(navigator) {
    return (
      <Settings navigator={navigator}></Settings>
    );
  }
}

export class EditChildRoute {
  constructor(id) {
    this.childId = id;
  }
  renderScene(navigator) {
    return (
      <ChildForm navigator={navigator} childId={this.childId}></ChildForm>
    );
  }
}

export class EditTasksRoute {
  constructor(tasks) {
    this.tasks = tasks;
  }
  renderScene(navigator) {
    return (
      <ChildFormTasksEditor navigator={navigator}></ChildFormTasksEditor>
    );
  }
}