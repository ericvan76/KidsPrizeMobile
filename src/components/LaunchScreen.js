/* @flow */

import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import { Container, Content, Thumbnail, Spinner, Text } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Auth0Lock from 'react-native-lock';

import * as authActions from '../actions/auth';
import * as failureActions from '../actions/failure';
import { MainRoute } from '../routes';
import config from '../__config__';
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
        scope: 'openid profile email offline_access',
        device: 'my-device' // todo: get device info
      }
    }, (err: ?Error, profile: any, token: any) => {
      if (token) {
        const toSave: Token = {
          token_type: token.tokenType,
          access_token: token.accessToken,
          id_token: token.idToken,
          refresh_token: token.refreshToken,
          expires_in: token.expiresIn
        };
        this.props.saveTokenAsync(toSave);
      } else {
        this.props.failure(err || new Error('Unable to login.'));
      }
    });
  }

  showMain() {
    this.props.navigator.replace(new MainRoute());
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.initialiseAsync();
    }, 1500);
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
      if (!this.props.auth.profile) {
        this.showLogin();
      } else {
        this.showMain();
      }
    }
  }

  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: theme.backgroundColor }}>
        <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 0.1 }}></View>
          <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
            <Thumbnail style={{ margin: 20 }} round size={80} source={theme.icon} />
            <Text style={{ fontSize: theme.titleFontSize }}>KidsPrize</Text>
          </View>
          <Spinner style={{ flex: 0.4, justifyContent: 'flex-start' }} color={theme.inverseSpinnerColor} />
          <Text style={{ flex: 0.1 }}>Powered by React Native</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen);