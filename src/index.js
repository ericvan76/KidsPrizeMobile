import React, {Component} from 'react';
import {View, Navigator} from 'react-native';
import {Provider} from 'react-redux';
import createStore from './reducers';
import * as routes from './routes';
import * as Actions from './actions';
import styles from './styles';

const store = createStore();

export default class App extends Component {
  constructor(props) {
    super(props);
    store.dispatch(Actions.initialise());
  }
  _renderScene(route, navigator) {
    return route.renderScene(navigator);
  }
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <Navigator initialRoute={new routes.MainViewRoute()} renderScene={this._renderScene}></Navigator>
        </View>
      </Provider>
    );
  }
}
