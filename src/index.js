/* @flow */

import React, { Component } from 'react';
import { Navigator, View } from 'react-native';
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
        <View style={styles.container}>
          <Navigator
            initialRoute={route}
            renderScene={this.renderScene.bind(this)}
            configureScene={this.configureScene.bind(this)} />
        </View>
      </Provider>
    );
  }
}

const styles = {
  container: {
    flex: 1
  }
};

export default App;