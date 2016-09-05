import React, { Component } from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  List,
  ListItem
} from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ListItemDivider from '../components/ListItemDivider';
import { EditChildRoute } from '../routes';
import theme from '../themes';

class Settings extends Component {

  static propTypes = {
    children: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      gender: React.PropTypes.oneOf(['M', 'F']).isRequired
    })).isRequired,
    navigator: React.PropTypes.object.isRequired
  }

  editChild(childId) {
    this.props.navigator.push(new EditChildRoute({ childId: childId }));
  }
  render() {
    const childrenRows = Object.values(this.props.children).map(c => {
      return (
        <ListItem iconRight button onPress={() => this.editChild(c.id) } key={c.id}>
          <Text>{c.name}</Text>
          <Icon style={theme.iconRight} name='ios-arrow-forward'/>
        </ListItem>
      );
    });
    return (
      <Container theme={theme}>
        <Header>
          <Button transparent onPress={() => this.props.navigator.pop() }>
            <Icon name='ios-arrow-back'/>
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

const mapStateToProps = (state) => {
  return {
    children: Object.values(state.children).map(c => {
      return { id: c.id, name: c.name, gender: c.gender };
    })
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      //todo: add actions here
    }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);