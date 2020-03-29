/* eslint-disable @typescript-eslint/no-require-imports */
import { AppLoading } from 'expo';
import React, { useState } from 'react';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import { AppContainer } from 'src/components/AppNavigator';
import { store } from 'src/store';
import { AppState } from 'react-native';

export const App = () => {

  const [ready, setReady] = useState(false);

  const cacheResourcesAsync = async () => {
    // https://github.com/expo/expo/issues/6679#issuecomment-570963717
    AppState.addEventListener('change', () => { return; });

    await Font.loadAsync({
      'Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
      'Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
    });
  };

  const finishLoading = () => {
    setReady(true);
  };

  return ready ?
    (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    ) :
    (
      <AppLoading
        startAsync={cacheResourcesAsync}
        onFinish={finishLoading}
        onError={console.warn}
      />
    );

};
