import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { Provider } from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';

import store from './reducers/store';
import { LoginRoute, MainViewRoute } from './routes';
import theme from './themes';


StyleSheet.build({
  rem: theme.fontSizeBase
});

class App extends Component {
  constructor(props) {
    super(props);
  }

  renderScene(route, navigator) {
    return route.renderScene(navigator);
  }

  configureScene(route) {
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