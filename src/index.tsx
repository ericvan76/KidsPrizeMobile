import React from 'react';
import RN from 'react-native';
import { Provider } from 'react-redux';

import * as routes from './routes';
import store from './store';

class App extends React.PureComponent<void, void> {

  private renderScene = (route: RN.Route, navigator: RN.Navigator) => {
    if (route.component) {
      return React.createElement(route.component, { ...route.passProps, navigator });
    }
    throw new Error();
  }

  private configureScene = (_: RN.Route) => {
    return RN.Navigator.SceneConfigs.PushFromRight;
  }

  public render() {
    const initRoute = routes.launcherRoute();
    return (
      <Provider store={store}>
        <RN.View style={styles.container}>
          <RN.Navigator
            initialRoute={initRoute}
            renderScene={this.renderScene}
            configureScene={this.configureScene} />
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
