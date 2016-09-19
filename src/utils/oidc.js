const idsvr = 'https://secure.kids-prize.com';

const issuer = {
  'issuer': 'https://secure.kids-prize.com',
  'jwks_uri': 'https://secure.kids-prize.com/.well-known/openid-configuration/jwks',
  'authorization_endpoint': 'https://secure.kids-prize.com/connect/authorize',
  'token_endpoint': 'https://secure.kids-prize.com/connect/token',
  'userinfo_endpoint': 'https://secure.kids-prize.com/connect/userinfo',
  'end_session_endpoint': 'https://secure.kids-prize.com/connect/endsession',
  'check_session_iframe': 'https://secure.kids-prize.com/connect/checksession',
  'introspection_endpoint': 'https://secure.kids-prize.com/connect/introspect',
  'http_logout_supported': true,
  'scopes_supported': ['openid', 'profile', 'api1'],
  'claims_supported': ['sub', 'name', 'family_name', 'given_name', 'middle_name', 'nickname', 'preferred_username', 'profile', 'picture', 'website', 'gender', 'birthdate', 'zoneinfo', 'locale', 'updated_at'],
  'response_types_supported': ['code', 'token', 'id_token', 'id_token token', 'code id_token', 'code token', 'code id_token token'],
  'response_modes_supported': ['form_post', 'query', 'fragment'],
  'grant_types_supported': ['authorization_code', 'client_credentials', 'password', 'refresh_token', 'implicit'],
  'subject_types_supported': ['public'],
  'id_token_signing_alg_values_supported': ['RS256'],
  'token_endpoint_auth_methods_supported': ['client_secret_basic', 'client_secret_post']
};

const client = {
  response_type: 'code',
  client_id: 'mobile',
  client_secret: '5QCyPCZi',
  scope: 'openid profile api1',
  redirect_uri: 'kidsprize://mobile/callback',
  post_logout_redirect_uri: 'https://secure.kids-prize.com/ui/login'
};

let instance = null;

class OidcClient {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  get issuer() {
    return issuer;
    // if (!this._issuer) {
    //   this._issuer = this.discover();
    // }
    // return this._issuer;
  }

  discover() {
    const u = idsvr + '/.well-known/openid-configuration';
    return fetch(u).then(response => {
      return response.json();
    });
  }

  urlEncode(data) {
    return Object.keys(data).map(function(key) {
      return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
  }

  get authoriseUrl() {
    return this.issuer.authorization_endpoint + '?' +
      this.urlEncode({
        response_type: client.response_type,
        client_id: client.client_id,
        scope: client.scope,
        redirect_uri: client.redirect_uri
      });
  }

  logoutUrl(id_token) {
    return this.issuer.end_session_endpoint + '?' +
      this.urlEncode({
        id_token_hint: id_token
          //post_logout_redirect_uri: client.post_logout_redirect_uri
      });
  }

  getToken(code) {
    return fetch(this.issuer.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: this.urlEncode({
        grant_type: 'authorization_code',
        code: code,
        client_id: client.client_id,
        client_secret: client.client_secret,
        scope: client.scope,
        redirect_uri: client.redirect_uri
      })
    }).then(response => {
      return response.json();
    });
  }

  // revokeToken(token) {
  //   return fetch(this.issuer.token, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: this.urlEncode({
  //       grant_type: 'authorization_code',
  //       code: code,
  //       client_id: client.client_id,
  //       client_secret: client.client_secret,
  //       scope: client.scope,
  //       redirect_uri: client.redirect_uri
  //     })
  //   });
  // }
}

export default new OidcClient();