/* @flow */

import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { Container, Content, Thumbnail, Spinner, Text } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Auth0Lock from 'react-native-lock';
import DeviceInfo from 'react-native-device-info';

import * as authActions from '../actions/auth';
import * as failureActions from '../actions/failure';
import * as auth0 from '../api/auth0';
import { MainRoute } from '../routes';
import { alert } from '../utils/alert';
import config from '../../__config__';
import theme from '../themes';

import type { AppState, AuthState } from '../types/states.flow';
import type { Token } from '../types/auth.flow';

type StoreProps = {
  auth: AuthState,
  errors: Error[]
}

type ActionProps = {
  initialiseAsync: () => void,
  saveTokenAsync: (token: Token) => void,
  failure: (err: Error) => void,
  resetFailure: () => void
};

type Props = StoreProps & ActionProps & {
  navigator: Object
};

class LaunchScreen extends Component {

  props: Props;
  lock: Auth0Lock;

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
        scope: 'openid profile email email_verified offline_access',
        device: DeviceInfo.getDeviceName()
      }
    }, (err: ?Error, profile: any, token: any) => {
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

  showMain() {
    this.props.navigator.replace(new MainRoute());
  }

  componentDidMount() {
    if (!this.props.auth.initialised && Platform.OS !== 'ios') {
      setTimeout(() => {
        this.props.initialiseAsync();
      }, 1000);
    } else {
      this.props.initialiseAsync();
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this.props.errors.length > 0 && nextProps.errors.length !== 0) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    if (this.props.errors.length > 0) {
      alert(this.props.errors);
    } else if (this.props.auth.initialised) {
      if (this.props.auth.token && this.props.auth.profile) {
        this.showMain();
      } else {
        this.showLogin();
      }
    }
  }

  render() {
    let content = null;
    if (Platform.OS === 'ios') {
      content = (
        <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner inverse size='small' />
        </Content>
      );
    } else {
      content = (
        <Content contentContainerStyle={{ flex: 1, alignItems: 'center' }}>
          <View style={{ flex: 0.5, justifyContent: 'flex-end' }}>
            <Thumbnail round size={100} source={theme.icon} />
          </View>
          <View style={{ flex: 0.4, justifyContent: 'center' }}>
            <Spinner inverse size='small' />
          </View>
          <View style={{ flex: 0.1, justifyContent: 'center' }}>
            <Text style={{ fontSize: theme.fontSizeBase * 1.2 }}>Powered by React Native</Text>
          </View>
        </Content>
      );
    }
    return (
      <Container theme={theme} style={{ backgroundColor: theme.backgroundColor }}>
        {content}
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

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen);