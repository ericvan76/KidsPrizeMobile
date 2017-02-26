import React from 'react';
import RN from 'react-native';
import { Provider } from 'react-redux';

import * as routes from './routes';
import store from './store';

class App extends React.PureComponent<void, void> {

  private renderScene(route: RN.Route, navigator: RN.Navigator) {
    if (route.component) {
      return React.createElement(route.component, { ...route.passProps, navigator });
    }
    return undefined;
  }

  private configureScene() {
    return RN.Navigator.SceneConfigs.PushFromRight;
  }

  public render() {
    const initRoute = routes.launchRoute();
    return (
      <Provider store={store}>
        <RN.View style={styles.container}>
          <RN.Navigator
            initialRoute={initRoute}
            renderScene={this.renderScene.bind(this)}
            configureScene={this.configureScene.bind(this)} />
        </RN.View>
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
