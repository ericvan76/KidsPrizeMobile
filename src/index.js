import React, {Component} from 'react';
import {View, Navigator, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import createStore from './reducers';
import MainView from './containers/MainView';
import * as Actions from './actions';
import styles from './styles';

let store = createStore();

const routes = [
  {
    title: 'Child List',
    index: 0
  }, {
    title: 'Add Child',
    index: 1
  }, {
    title: 'Main View',
    index: 2
  }, {
    title: 'Edit Takss',
    index: 3
  }
];

export default class App extends Component {
  constructor(props) {
    super(props);
    store.dispatch(Actions.initialise());
  }
  _renderScene(route, navigator) {
    switch (route.index) {
      case 0:
        return (<MainView/>);
      case 1:
      case 2:
      default:
    }
  }
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content"/>
          <Navigator initialRoute={routes[0]} initialRouteStack={routes} renderScene={this._renderScene}></Navigator>
        </View>
      </Provider>
    );
  }
}
