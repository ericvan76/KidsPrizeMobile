/* @flow */

import React, { Component } from 'react';
import { Alert, Linking } from 'react-native';
import { Container, Content, Button, Icon, Text, Thumbnail } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import url from 'url';

import * as authActions from '../actions/auth';
import * as failureActions from '../actions/failure';
import oidc from '../api/oidc';
import theme from '../themes';

import type { AppState, AuthState } from '../types/states.flow';

type StoreProps = {
  auth: AuthState,
  errors: Error[]
}

type ActionProps = {
  requestTokenAsync: (code: string) => void,
  resetFailure: () => void
};

type Props = StoreProps & ActionProps & {
  navigator: Object
}

class LoginPage extends Component {

  constructor(props: Props) {
    super(props);
  }

  openLoginUrl(provider: 'Facebook' | 'Google') {
    const url = oidc.externalLoginUrl(provider);
    Linking.openURL(url);
  }

  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL.bind(this));
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL.bind(this));
  }

  handleOpenURL(event: Object) {
    if (event.url) {
      const urlObj = url.parse(event.url, true);
      if (!this.props.auth.token && urlObj.query.code) {
        this.props.requestTokenAsync(urlObj.query.code);
      }
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
      Alert.alert(
        'Oops!',
        this.props.errors[0].message,
        [
          { text: 'OK', onPress: () => { this.props.resetFailure(); } }
        ]);
    } else if (this.props.auth.token) {
      this.props.navigator.pop();
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
              marginTop: -80,
              marginBottom: 40
            }} />
          <Button block bordered style={{
            borderColor: theme.facebookColor,
            margin: 5,
            justifyContent: 'flex-start',
            paddingLeft: 20
          }} textStyle={{
            color: theme.facebookColor
          }} onPress={() => this.openLoginUrl('Facebook')}>
            <Icon name='logo-facebook' style={{ color: theme.facebookColor }} />
            <Text>Signin with Facebook</Text>
          </Button>
          <Button block bordered style={{
            borderColor: theme.googleColor,
            margin: 5,
            justifyContent: 'flex-start',
            paddingLeft: 20
          }} textStyle={{
            color: theme.googleColor
          }} onPress={() => this.openLoginUrl('Google')}>
            <Icon name='logo-google' style={{ color: theme.googleColor }} />
            <Text>Signin with Google</Text>
          </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);