/* @flow */

import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { Provider } from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';

import store from './store';
import { LoginRoute, MainViewRoute } from './routes';
import theme from './themes';


StyleSheet.build({
  rem: theme.fontSizeBase * 1.1
});


class App extends Component {
  constructor(props: Object) {
    super(props);
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
    let route = new MainViewRoute();
    return (
      <Provider store={store}>
        <Navigator
          initialRoute={route}
          renderScene={this.renderScene.bind(this)}
          configureScene={this.configureScene.bind(this)}
          />
      </Provider>
    );
  }
}

export default App;