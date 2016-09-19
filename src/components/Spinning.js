import React, { Component } from 'react';
import { Container, Content, Spinner } from 'native-base';
import theme from '../themes';

class Spinning extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Spinner color={theme.subtitleColor} />
        </Content>
      </Container>
    );
  }
}

export default Spinning;