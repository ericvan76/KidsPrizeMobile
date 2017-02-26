import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import * as DeviceInfo from 'react-native-device-info';
import Auth0Lock from 'react-native-lock';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import config from '../__config__';
import { loadTokenAsync, saveTokenAsync } from '../actions/auth';
import { failure, resetFailure } from '../actions/failure';
import * as auth0 from '../api/auth0';
import * as routes from '../routes';
import theme from '../theme';
import { Token } from '../types/auth';
import { AppState, AuthState } from '../types/states';
import { alert } from '../utils/alert';

interface StateProps {
  auth: AuthState;
  errors: Array<Error>;
}

interface DispatchProps {
  loadTokenAsync: () => void;
  saveTokenAsync: (token: Token) => void;
  failure: (err: Error) => void;
  resetFailure: () => void;
}

export interface OwnProps extends RN.ViewProperties {
  navigator: RN.Navigator;
}

type Props = OwnProps & StateProps & DispatchProps;

class LaunchScreen extends React.PureComponent<Props, void> {

  private lock: Auth0Lock;

  private showLogin() {
    this.lock.show(
      {
        authParams: {
          scope: 'openid profile email email_verified offline_access',
          device: DeviceInfo.getDeviceName()
        }
      },
      // tslint:disable-next-line:no-any
      (err: Error | undefined, _: any, token: any) => {
        if (token && token.idToken) {
          const decoded = auth0.decodeJwt(token.idToken);
          if (decoded.email && decoded.email_verified) {
            const toSave: Token = {
              token_type: token.tokenType,
              access_token: token.accessToken,
              id_token: token.idToken,
              refresh_token: token.refreshToken,
              expires_in: token.expiresIn
            };
            this.props.saveTokenAsync(toSave);
          } else {
            this.props.failure(new Error('Email is not verified.'));
          }
        } else {
          this.props.failure(err || new Error('Unable to login.'));
        }
      });
  }

  private showMain() {
    this.props.navigator.replace(routes.mainRoute({ navigator: this.props.navigator }));
  }

  public componentWillMount() {
    this.lock = new Auth0Lock({
      clientId: config.auth.client_id,
      domain: config.auth.auth0_domain
    });
  }

  public componentDidMount() {
    if (!this.props.auth.tokenLoaded && RN.Platform.OS !== 'ios') {
      setTimeout(
        () => {
          this.props.loadTokenAsync();
        },
        1000);
    } else {
      this.props.loadTokenAsync();
    }
  }

  public shouldComponentUpdate(nextProps: Props) {
    if (this.props.errors.length > 0 && nextProps.errors.length !== 0) {
      return false;
    }
    return true;
  }

  public componentDidUpdate() {
    if (this.props.errors.length > 0) {
      alert(this.props.errors);
    } else if (this.props.auth.tokenLoaded) {
      if (this.props.auth.token && this.props.auth.profile) {
        this.showMain();
      } else {
        this.showLogin();
      }
    }
  }

  private renderIOS() {
    return (
      <NB.Content contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <NB.Spinner inverse size="small" />
      </NB.Content>
    );
  }

  private renderAndroid() {
    // tslint:disable-next-line:no-require-imports
    const iconSource = require('../../assets/img/icon.png');
    return (
      <NB.Content contentContainerStyle={{ flex: 1, alignItems: 'center' }}>
        <NB.View style={{ flex: 0.5, justifyContent: 'flex-end' }}>
          // tslint:disable-next-line:no-require-imports
          <NB.Thumbnail circular size={100} source={iconSource} />
        </NB.View>
        <NB.View style={{ flex: 0.4, justifyContent: 'center' }}>
          <NB.Spinner inverse size="small" />
        </NB.View>
        <NB.View style={{ flex: 0.1, justifyContent: 'center' }}>
          <NB.Text>Powered by React Native</NB.Text>
        </NB.View>
      </NB.Content>
    );
  }

  public render() {
    return (
      <NB.StyleProvider style={theme}>
        <NB.Container>
          {RN.Platform.OS === 'ios' ? this.renderIOS() : this.renderAndroid()}
        </NB.Container>
      </NB.StyleProvider>
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState) => {
  return {
    auth: state.auth,
    errors: state.errors
  };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> = (dispatch: Dispatch<AppState>) => {
  return bindActionCreators(
    {
      loadTokenAsync,
      saveTokenAsync,
      failure,
      resetFailure
    },
    dispatch);
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(LaunchScreen);
