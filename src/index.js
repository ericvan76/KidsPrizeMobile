import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { Provider } from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';

import store from './store';
import { LoginRoute, MainViewRoute } from './routes';
import localStorage from './utils/localStorage';
import Spinning from './components/Spinning';
import theme from './themes';

StyleSheet.build({
  rem: theme.fontSizeBase
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialised: false
    };
  }
  componentDidMount() {
    localStorage.getToken()
      .then(token => {
        this.setState({
          initialised: true,
          token: token
        });
      });
  }
  renderScene(route, navigator) {
    return route.renderScene(navigator);
  }
  render() {
    if (!this.state.initialised) {
      return (
        <Provider store={store}>
          <Spinning/>
        </Provider>
      );
    }
    return (
      <Provider store={store}>
        <Navigator
          initialRoute={!this.state.token ? new LoginRoute() : new MainViewRoute() }
          renderScene={this.renderScene.bind(this) }
          />
      </Provider>
    );
  }
}

export default App;