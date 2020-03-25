import { AppLoading } from 'expo';
import React from 'react';
import { Provider } from 'react-redux';
import { signIn } from 'src/actions/auth';
import { AppContainer } from 'src/components/AppNavigator';
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
        <AppContainer />
      </Provider>
    );
  }

  private readonly finishLoading = () => {
    this.setState((state: State) => {
      return {
        ...state,
        isReady: true
      };
    });
    store.dispatch(signIn(undefined));
  };

  private readonly cacheResourcesAsync = async () => {
    // nothing
  };
}
