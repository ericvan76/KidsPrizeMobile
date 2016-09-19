import React, { Component } from 'react';
import { WebView } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import url from 'url';

import Spinning from '../components/Spinning';
import { MainViewRoute } from '../routes';
import localStorage from '../utils/localStorage';
import oidc from '../utils/oidc';


class LoginView extends Component {
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    logout: React.PropTypes.bool,
    id_token: React.PropTypes.string
  }
  constructor(props) {
    super(props);
    this.state = {
      codeReceived: false,
      uri: props.logout ? oidc.logoutUrl(props.id_token) : oidc.authoriseUrl,
    };
  }
  onNavigationStateChange(navState) {
    const urlObj = url.parse(navState.url, true);
    if (urlObj.query.code !== undefined) {
      oidc.getToken(urlObj.query.code).then(resp => {
        localStorage.setToken(resp).then(() => {
          this.props.navigator.resetTo(new MainViewRoute());
        });
      });
      this.setState(Object.assign({}, this.state, {
        codeReceived: true
      }));
    }
  }
  render() {
    if (this.state.codeReceived) {
      return <Spinning/>;
    }
    return (
      <WebView
        style={styles.webView}
        source={{ uri: this.state.uri }}
        onNavigationStateChange={this.onNavigationStateChange.bind(this)} />
    );
  }
}

const styles = StyleSheet.create({
  webView: { marginTop: 20 }
});

export default LoginView;