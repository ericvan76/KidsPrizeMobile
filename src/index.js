/* @flow */

import React, { Component } from 'react';
import { Navigator, View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import store from './store';
import { LaunchRoute } from './routes';

class App extends Component {
  constructor(props: Object) {
    super(props);
  }

  renderScene(route: Object, navigator: Object) {
    return route.renderScene(navigator);
  }

  configureScene() {
    return Navigator.SceneConfigs.PushFromRight;
  }

  render() {
    const route = new LaunchRoute();
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />
          <Navigator
            initialRoute={route}
            renderScene={this.renderScene.bind(this)}
            configureScene={this.configureScene.bind(this)} />
        </View>
      </Provider>
    );
  }
}

export default App;