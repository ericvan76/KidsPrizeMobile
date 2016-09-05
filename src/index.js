import React, { Component } from 'react';
import { View, Navigator } from 'react-native';
import { Provider } from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';

import store from './store';
import { MainViewRoute } from './routes';
import { initialise } from './actions';
import theme from './themes';

StyleSheet.build({
  rem: theme.fontSizeBase
});

export default class App extends Component {
  constructor(props) {
    super(props);
    store.dispatch(initialise());
  }
  renderScene(route, navigator) {
    return route.renderScene(navigator);
  }
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <Navigator initialRoute={new MainViewRoute()} renderScene={this.renderScene}></Navigator>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});