import React from 'react';
import MainView from '../containers/MainView';
import ChildListView from '../containers/ChildListView';
import ChildView from '../containers/ChildView';

export class MainViewRoute {
  renderScene(navigator) {
    return (<MainView navigator={navigator}/>);
  }
}

export class ChildListViewRoute {
  renderScene(navigator) {
    return (<ChildListView navigator={navigator}/>);
  }
}

export class ChildViewRoute {
  renderScene(navigator) {
    return (<ChildView navigator={navigator}/>);
  }
}
