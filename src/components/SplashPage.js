/* @flow */

import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Content, Thumbnail, Spinner } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Auth0Lock from 'react-native-lock';

import * as auth0 from '../api/auth0';
import * as authActions from '../actions/auth';
import * as failureActions from '../actions/failure';
import { MainRoute } from '../routes';
import config from '../__config__';
import theme from '../themes';

import type { AppState, AuthState } from '../types/states.flow';
import type { Token, Profile } from '../types/auth.flow';

type StoreProps = {
  auth: AuthState,
  errors: Error[]
}

type ActionProps = {
  initialiseAsync: () => void,
  saveTokenAsync: (token: Token) => void,
  getUserProfileAsync: () => void,
  failure: (err: Error) => void,
  resetFailure: () => void
};

type Props = StoreProps & ActionProps & {
  navigator: Object
};

type LoginToken = {
  refreshToken?: string
};

class SplashPage extends Component {

  lock: Auth0Lock

  constructor(props: Props) {
    super(props);
    this.lock = new Auth0Lock({
      clientId: config.auth.client_id,
      domain: config.auth.auth0_domain
    });
  }

  showLogin() {
    this.lock.show({
      authParams: {
        scope: 'openid offline_access'
      }
    }, (err: ?Error, profile: ?Profile, token: ?LoginToken) => {
      if (token && token.refreshToken) {
        auth0.obtainDelegationToken(token.refreshToken).then((delegation: Token) => {
          this.props.saveTokenAsync(delegation);
        }, (err: Error) => {
          this.props.failure(err || new Error('Unable to login.'));
        });
      } else {
        this.props.failure(err || new Error('Unable to login.'));
      }
    });
  }

  showMain() {
    this.props.navigator.replace(new MainRoute());
  }

  componentDidMount() {
    this.props.initialiseAsync();
  }

  shouldComponentUpdate(nextProps: Props) {
    // stop update until previous errors been reset.
    if (this.props.errors.length > 0 && nextProps.errors.length !== 0) {
      return false;
    }
    return true;
  }


  componentDidUpdate() {
    if (this.props.errors.length > 0) {
      Alert.alert(
        'Oops!',
        this.props.errors[0].message,
        [
          { text: 'OK', onPress: () => { this.props.resetFailure(); } }
        ]);
    } else if (this.props.auth.initialised) {
      if (!this.props.auth.token) {
        this.showLogin();
      } else if (!this.props.auth.profile) {
        this.props.getUserProfileAsync();
      } else {
        this.showMain();
      }
    }
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: theme.backgroundColor }}>
        <Content contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 40,
          marginRight: 40
        }}>
          <Thumbnail round source={theme.icon}
            size={80}
            style={{
              marginTop: -40,
              marginBottom: 20
            }} />
          <Spinner color={theme.inverseSpinnerColor} />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState): StoreProps => {
  return {
    auth: state.auth,
    errors: state.errors
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
  return bindActionCreators({
    ...authActions,
    ...failureActions
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashPage);