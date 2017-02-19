/* @flow */

import React from 'react';

import LaunchScreen from '../components/LaunchScreen';
import MainView from '../components/MainView';
import ChildEditor from '../components/ChildEditor';
import TaskEditor from '../components/TaskEditor';
import TextEditor from '../components/TextEditor';
import RedeemEditor from '../components/RedeemEditor';

export type Route = {
  renderScene: (navigator: Object) => any
}

export class LaunchRoute {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  renderScene(navigator: Object) {
    return (
      <LaunchScreen navigator={navigator} {...this.props} />
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

export class ChildEditorRoute {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  renderScene(navigator: Object) {
    return (
      <ChildEditor navigator={navigator} {...this.props} />
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


export class TextEditorRoute {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  renderScene(navigator: Object) {
    return (
      <TextEditor navigator={navigator} {...this.props} />
    );
  }
}

export class RedeemEditorRoute {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  renderScene(navigator: Object) {
    return (
      <RedeemEditor navigator={navigator} {...this.props} />
    );
  }
}
