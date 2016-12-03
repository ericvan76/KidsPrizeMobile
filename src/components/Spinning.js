/* @flow */

import React, { Component } from 'react';
import { Container, Content, Spinner, Thumbnail } from 'native-base';
import theme from '../themes';

class Spinning extends Component {
  render() {
    return (
      <Container theme={theme} style={{ backgroundColor: theme.backgroundColor }}>
        <Content
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Thumbnail round source={theme.icon}
            size={80}
            style={{
              marginTop: -40,
              marginBottom: 20
            }} />
          <Spinner color={theme.inverseSpinnerColor} />
        </Content>
      </Container >
    );
  }
}

export default Spinning;