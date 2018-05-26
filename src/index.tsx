import { AppLoading } from 'expo';
import React from 'react';
import { Provider } from 'react-redux';
import { signIn } from 'src/actions/auth';
import { AppNavigator } from 'src/components/AppNavigator';
import { store } from 'src/store';

interface Props { }
interface State {
  isReady: boolean;
}

export class App extends React.PureComponent<Props, State> {

  public state: State = {
    isReady: false
  };

  public render(): JSX.Element {

    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.cacheResourcesAsync}
          onFinish={this.finishLoading}
          onError={console.warn}
        />
      );
    }

    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }

  private finishLoading = () => {
    this.setState((state: State) => {
      return {
        ...state,
        isReady: true
      };
    });
    store.dispatch(signIn(undefined));
  }

  private cacheResourcesAsync = async () => {
    // tslint:disable:no-require-imports no-floating-promises
    // tslint:enable:no-require-imports no-floating-promises
  }
}
