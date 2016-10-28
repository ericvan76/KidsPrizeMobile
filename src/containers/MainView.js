import React, { Component } from 'react';
import StyleSheet from 'react-native-extended-stylesheet';
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
import Drawer from 'react-native-drawer';

import * as authActions from '../actions/auth';
import * as childActions from '../actions/child';
import ScoreListView from '../components/ScoreListView';
import ListItemDivider from '../components/ListItemDivider';
import Spinning from '../components/Spinning';
import { EditChildRoute, SettingsRoute, LoginRoute } from '../routes';
import theme from '../themes';

class MainView extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    auth: React.PropTypes.shape({
      initialised: React.PropTypes.bool,
      token: React.PropTypes.object,
      user: React.PropTypes.object
    }).isRequired,
    children: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      gender: React.PropTypes.oneOf(['M', 'F']).isRequired
    })).isRequired,
    child: React.PropTypes.object,
    scores: React.PropTypes.object,
    actions: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    if (!this.props.auth.initialised) {
      this.props.actions.discovery();
      this.props.actions.loadToken();
    }
  }

  renderDrawer() {
    const childrenRows = Object.values(this.props.children).map(c => {
      return (
        <ListItem key={c.id} iconLeft button onPress={() => {
          this.props.actions.switchChild(c.id);
          this.refs.drawer.close();
        } }>
          <Icon name={c.gender === 'M' ? 'ios-man' : 'ios-woman'} />
          <Text>{c.name}</Text>
        </ListItem>
      );
    });
    return (
      <Container theme={theme}>
        <Header>
          <Button transparent>
            <Icon name='ios-person' />
          </Button>
          <Title>{this.props.auth.user.name}</Title>
        </Header>
        <Content>
          <List>
            <ListItemDivider title='CHILDREN' />
            {childrenRows}
            <ListItem iconLeft button onPress={() => {
              this.props.navigator.push(new EditChildRoute());
              this.refs.drawer.close();
            } }>
              <Icon name='ios-add' />
              <Text>Add Child</Text>
            </ListItem>
            <ListItemDivider title='OTHERS' />
            <ListItem iconLeft button onPress={() => {
              this.props.navigator.push(new SettingsRoute());
              this.refs.drawer.close();
            } }>
              <Icon name='ios-settings' />
              <Text>Settings</Text>
            </ListItem>
            <ListItem iconLeft button onPress={() => {
              this.props.actions.logout();
              this.refs.drawer.close();
            } }>
              <Icon name='ios-log-out' />
              <Text>Sign Out</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
  s
  componentDidUpdate() {
    if (this.props.auth.initialised) {
      if (!this.props.auth.token) {
        this.props.navigator.push(new LoginRoute());
      } else if (!this.props.auth.user) {
        this.props.actions.getUserInfo();
      } else if (!this.props.child) {
        this.props.actions.loadChildren();
      }
    }
  }

  render() {
    if (!this.props.auth.user || !this.props.child) {
      return <Spinning />;
    }
    return (
      <Drawer ref='drawer' content={this.renderDrawer()} openDrawerOffset={0.2} tapToClose={true}>
        <Container>
          <Header>
            <Button transparent onPress={() => this.refs.drawer.open()}>
              <Icon name='ios-menu' />
            </Button>
            <Title>{this.props.child.name}</Title>
            <Button transparent onPress={() => this.refs.listView.scrollToTop()}
              >Top</Button>
          </Header>
          <Content horizontal={true} scrollEnabled={false}>
            <ScoreListView ref='listView' style={styles.listView} child={this.props.child} rows={this.props.scores.weeks} actions={this.props.actions} />
          </Content>
        </Container>
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    children: Object.values(state.children).map(c => {
      return { id: c.id, name: c.name, gender: c.gender };
    }),
    child: state.children[state.currentChildId],
    scores: state.scores[state.currentChildId]
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      ...authActions,
      ...childActions
    }, dispatch)};
};

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    width: '100%'
  },
  drawer: {
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 3
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MainView);