/* @flow */

import React from 'react';

import SplashPage from '../components/SplashPage';
import MainView from '../components/MainView';
import ChildForm from '../components/ChildForm';
import TaskEditorPage from '../components/TaskEditorPage';
import TextInputPage from '../components/TextInputPage';
import PickerPage from '../components/PickerPage';

export type Route = {
  renderScene: (navigator: Object) => any
}

export class SplashRoute {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  renderScene(navigator: Object) {
    return (
      <SplashPage navigator={navigator} {...this.props} />
    );
  }
}

export class MainRoute {
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
      <TaskEditorPage navigator={navigator} {...this.props} />
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
      <TextInputPage navigator={navigator} {...this.props} />
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
      <PickerPage navigator={navigator} {...this.props} />
    );
  }
}