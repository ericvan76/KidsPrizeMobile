/* @flow */

import React, { Component } from 'react';
import { WebView } from 'react-native';
import update from 'react-addons-update';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';
import url from 'url';

import Spinning from '../components/Spinning';
import oidc from '../api/oidc';
import * as authActions from '../actions/auth';

import type { AppState } from '../types/states.flow';

const WEBVIEW_REF = 'webview';

type StoreProps = {
  auth: {
    initialised: boolean,
    token: ?Token
  },
};

type ActionProps = {
  requestTokenAsync: (code: string) => void,
};

type Props = StoreProps & ActionProps & {
  navigator: Object
};

type State = {
  source: { html: string },
  stopLoading: boolean
};

class LoginView extends Component {

  props: Props;
  state: State;

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    auth: React.PropTypes.object.isRequired,
    requestTokenAsync: React.PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      source: { html: oidc.getLoginPage() },
      stopLoading: false
    };
  }

  onLoadStart(e: Object) {
    const urlObj = url.parse(e.nativeEvent.url, true);
    if (urlObj.href.startsWith(oidc.config.redirect_uri) && urlObj.query.code) {
      this.setState(update(this.state, { stopLoading: { $set: true } }));
      this.props.requestTokenAsync(urlObj.query.code);
    }
  }

  componentDidUpdate() {
    if (this.props.auth.token) {
      this.props.navigator.pop();
    }
  }

  render() {
    if (this.state.stopLoading) {
      return <Spinning />;
    }
    return (
      <WebView
        ref={WEBVIEW_REF}
        style={styles.webView}
        source={this.state.source}
        onLoadStart={this.onLoadStart.bind(this)} />
    );
  }
}

const mapStateToProps = (state: AppState): StoreProps => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
  return bindActionCreators(authActions, dispatch);
};

const styles = StyleSheet.create({
  webView: { marginTop: 20 }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);