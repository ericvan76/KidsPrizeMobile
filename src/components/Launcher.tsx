import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import * as DeviceInfo from 'react-native-device-info';
import Auth0Lock from 'react-native-lock';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import config from '../__config__';
import { loadTokenAsync, saveTokenAsync } from '../actions/auth';
import { loadChildrenAsync } from '../actions/children';
import { raiseError } from '../actions/errors';
import * as auth0 from '../api/auth0';
import theme from '../theme';
import { Token } from '../types/auth';
import { AppState, AuthState } from '../types/states';
import { alert } from '../utils/alert';
import MainView from './MainView';
import Spinner from './Spinner';

interface StateProps {
  auth: AuthState;
  initialised: boolean;
  errors: Array<Error>;
}

interface DispatchProps {
  loadTokenAsync: typeof loadTokenAsync;
  saveTokenAsync: typeof saveTokenAsync;
  loadChildrenAsync: typeof loadChildrenAsync;
  raiseError: typeof raiseError;
}

export interface OwnProps extends RN.ViewProperties {
  navigator: RN.Navigator;
}

type Props = OwnProps & StateProps & DispatchProps;

class Launcher extends React.PureComponent<Props, void> {

  private lock: Auth0Lock;

  public constructor(props: Props) {
    super(props);
    this.lock = new Auth0Lock({
      clientId: config.auth.client_id,
      domain: config.auth.auth0_domain,
      useBrowser: true
    });
  }

  private showLogin() {
    this.lock.show(
      {
        authParams: {
          scope: 'openid profile email email_verified offline_access',
          device: DeviceInfo.getDeviceName()
        }
      },
      (err, _, token) => {
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
            this.props.raiseError(new Error('Email is not verified.'));
          }
        } else {
          this.props.raiseError(err || new Error('Unable to login.'));
        }
      });
  }

  public componentWillMount() {
    this.props.loadTokenAsync();
  }

  public componentDidUpdate() {
    if (this.props.errors.length > 0) {
      alert(this.props.errors);
    } else if (this.props.auth.tokenLoadCompleted) {
      if (!this.props.auth.token) {
        this.showLogin();
      } else if (!this.props.initialised) {
        this.props.loadChildrenAsync();
      }
    }
  }

  public render() {
    return (
      <NB.StyleProvider style={theme}>
        {this.props.initialised ? <MainView navigator={this.props.navigator} /> : <Spinner middle />}
      </NB.StyleProvider>
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState) => {
  return {
    auth: state.auth,
    initialised: state.initialised,
    errors: state.errors
  };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> = (dispatch: Dispatch<AppState>) => {
  return bindActionCreators(
    {
      loadTokenAsync,
      saveTokenAsync,
      loadChildrenAsync,
      raiseError
    },
    dispatch);
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(Launcher);
