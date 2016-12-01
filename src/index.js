/* @flow */

import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { Provider } from 'react-redux';

import { initialiseAsync } from './actions/auth';
import store from './store';
import { LoginRoute, MainRoute } from './routes';

class App extends Component {
  constructor(props: Object) {
    super(props);
    store.dispatch(initialiseAsync());
  }

  renderScene(route: Object, navigator: Object) {
    return route.renderScene(navigator);
  }

  configureScene(route: Object) {
    if (route instanceof LoginRoute) {
      return Navigator.SceneConfigs.FloatFromBottom;
    }
    return Navigator.SceneConfigs.PushFromRight;
  }

  render() {
    const route = new MainRoute();
    return (
      <Provider store={store}>
        <Navigator
          initialRoute={route}
          renderScene={this.renderScene.bind(this)}
          configureScene={this.configureScene.bind(this)} />
      </Provider>
    );
  }
}

export default App;