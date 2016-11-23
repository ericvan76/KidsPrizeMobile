/* @flow */

import React, { Component } from 'react';
import { Container, Header, Title, Content, Button, Icon, Text, List, ListItem } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ListItemDivider from '../components/ListItemDivider';
import { EditChildRoute } from '../routes';
import theme from '../themes';

import type { AppState } from '../types/states.flow';

type StoreProps = {
  children: Child[]
};

type ActionProps = {
};

type Props = StoreProps & ActionProps & {
  navigator: Object
};

class Settings extends Component {

  props: Props;

  static propTypes = {
    children: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    navigator: React.PropTypes.object.isRequired
  }

  editChild(childId: string) {
    this.props.navigator.push(new EditChildRoute({ childId: childId }));
  }
  render() {
    const childrenRows = this.props.children.map((c: Child) => {
      return (
        <ListItem iconLeft iconRight onPress={() => this.editChild(c.id)} key={c.id}>
          <Icon name={c.gender === 'M' ? 'ios-man-outline' : 'ios-woman-outline'} />
          <Text>{c.name}</Text>
          <Icon style={theme.iconRight} name='ios-arrow-forward' />
        </ListItem>
      );
    });
    return (
      <Container theme={theme}>
        <Header>
          <Button transparent onPress={() => this.props.navigator.pop()}>
            <Icon name='ios-arrow-back' />
          </Button>
          <Title>Settings</Title>
        </Header>
        <Content>
          <List>
            <ListItemDivider title='CHILDREN' />
            {childrenRows}
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState): StoreProps => {
  return {
    children: Object.keys(state.children).map(id => state.children[id].child)
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);