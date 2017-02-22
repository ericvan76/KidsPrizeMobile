/* @flow */

import React, { Component } from 'react';
import { Alert } from 'react-native';

import {
  Drawer, Container, Header, Left, Body, Right, Title, Content,
  Footer, FooterTab, List, ListItem, Button, Icon, Spinner, Text,
  StyleProvider
} from 'native-base';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import theme from '../native-base-theme';

import * as authActions from '../actions/auth';
import * as childActions from '../actions/child';
import * as failureActions from '../actions/failure';
import ScoreList from './ScoreList';
import DrawerBar from './DrawerBar';
import { LaunchRoute, ChildEditorRoute, RedeemEditorRoute } from '../routes';
import { alert } from '../utils/alert';

import type { AppState, AuthState, ChildState } from '../types/states.flow';
import type { Child, Redeem } from '../types/api.flow';

type StoreProps = {
  auth: AuthState,
  childList: ?Array<Child>,
  child: ?ChildState,
  errors: Error[]
}

type ActionProps = {
  switchChild: (childId: string) => void,
  listChildrenAsync: () => void,
  logoutAsync: () => void,
  refreshAsync: (childId: string) => void,
  fetchMoreAsync: (childId: string) => void,
  setScoreAsync: (childId: string, date: string, task: string, value: number) => void,
  createRedeemAsync: (childId: string, description: string, value: number) => void,
  getRedeemsAsync: () => void,
  resetFailure: () => void
};

type Props = StoreProps & ActionProps & {
  navigator: Object
}

type TabId = 'main' | 'redeem';

type State = {
  activeTab: TabId
}

class MainView extends Component {

  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      activeTab: 'main'
    };
  }

  changeTab(tabId: TabId) {
    if (this.state.activeTab !== tabId) {
      this.setState({
        activeTab: tabId
      });
    }
  }

  logout() {
    Alert.alert(
      'Confirm',
      'Are you sure you want to sign out?',
      [
        {
          text: 'No'
        }, {
          text: 'Yes', onPress: () => {
            this.props.logoutAsync();
            this.refs.drawer.close();
          }
        }
      ]
    );
  }

  componentDidMount() {
    if (this.props.errors.length > 0) {
      alert(this.props.errors);
    }
    this.props.listChildrenAsync();
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this.props.errors.length > 0 && nextProps.errors.length !== 0) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    if (this.props.errors.length > 0) {
      alert(this.props.errors);
    } else if (!this.props.auth.profile) {
      this.props.navigator.replace(new LaunchRoute());
    } else if (this.props.childList && this.props.childList.length === 0) {
      this.refs._drawer._root.open();
    } else if (this.props.child && Object.keys(this.props.child.weeklyScores).length === 0) {
      this.props.refreshAsync(this.props.child.child.id);
    }
  }

  renderDrawer() {
    if (!this.props.auth.profile) {
      return <Container></Container>;
    }
    return (
      <DrawerBar
        navigator={this.props.navigator}
        drawer={this.refs._drawer}
        profile={this.props.auth.profile}
        childList={this.props.childList}
      ></DrawerBar>
    );
  }

  renderEmpty() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.refs._drawer._root.open()}>
              <Icon name={theme.icons.menu} />
            </Button>
          </Left>
        </Header>
        <Content contentContainerStyle={styles.spinnerContainer}>
          <Spinner size='small' inverse animating={!this.props.childList} />
        </Content>
      </Container>
    );
  }

  renderMain() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() =>
              this.refs._drawer._root.open()}>
              <Icon name={theme.icons.menu} />
            </Button>
          </Left>
          <Body>
            <Title ellipsizeMode='tail' numberOfLines={1}>{this.props.child.child.name}</Title>
            <Text note>Total: {this.props.child.child.totalScore}</Text>
          </Body>
          <Right>
            <Button transparent onPress={() =>
              this.props.navigator.push(new ChildEditorRoute({ child: this.props.child }))}>
              <Icon name={theme.icons.settings} />
            </Button>
          </Right>
        </Header>
        <Content scrollEnabled={false} horizontal={true}>
          <ScoreList
            ref='listView'
            child={this.props.child}
            refreshAsync={this.props.refreshAsync}
            fetchMoreAsync={this.props.fetchMoreAsync}
            setScoreAsync={this.props.setScoreAsync} />
        </Content>
        {this.renderFooter()}
      </Container>
    );
  }

  renderRedeem() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={this.changeTab.bind(this, 'main')}>
              <Icon name={theme.icons.back} />
            </Button>
          </Left>
          <Body>
            <Title ellipsizeMode='tail' numberOfLines={1}>{this.props.child.child.name}</Title>
            <Text note>Available: {this.props.child.child.totalScore}</Text>
          </Body>
          <Right>
            <Button transparent onPress={() =>
              this.props.navigator.push(new RedeemEditorRoute({
                child: this.props.child.child,
                onSubmit: (description: string, value: number) => {
                  this.props.createRedeemAsync(this.props.child.child.id, description, value);
                  this.props.navigator.pop();
                }
              }))}>
              <Text>Add</Text>
            </Button>
          </Right>
        </Header>
        <Content scrollEnabled={false}>
          <List
            dataArray={this.props.child.redeems}
            onEndReached={() => this.props.getRedeemsAsync(this.props.child.child.id)}
            onEndReachedThreshold={0}
            renderRow={(redeem: Redeem) =>
              <ListItem>
                <Body>
                  <Text ellipsizeMode='middle' numberOfLines={1}>{redeem.description}</Text>
                  <Text note>{moment(redeem.timestamp).format('DD-MMM-YYYY HH:mm')}</Text>
                </Body>
                <Right>
                  <Text>{redeem.value}</Text>
                </Right>
              </ListItem>
            } />
        </Content>
        {this.renderFooter()}
      </Container>
    );
  }

  renderFooter() {
    return (
      <Footer>
        <FooterTab>
          <Button active={this.state.activeTab === 'main'} onPress={this.changeTab.bind(this, 'main')}>
            <Icon name={theme.icons.tabMain} active={this.state.activeTab === 'main'} />
            <Text>Main</Text>
          </Button>
          <Button active={this.state.activeTab === 'redeem'} onPress={() => {
            this.changeTab('redeem');
            if (this.props.child.redeems.length === 0) {
              this.props.getRedeemsAsync(this.props.child.child.id);
            }
          }}>
            <Icon name={theme.icons.tabRedeem} active={this.state.activeTab === 'redeem'} />
            <Text>Redeem</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <Drawer
          ref='_drawer'
          type='overlay'
          content={this.renderDrawer()}
          tapToClose
          openDrawerOffset={0.2}
          styles={styles.drawer}
          tweenHandler={(ratio: number) => {
            return {
              drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
              main: { opacity: (2 - ratio) / 2 },
            };
          }}
          negotiatePan>
          {this.props.child ? (
            this.state.activeTab === 'main' ? this.renderMain() : this.renderRedeem()
          ) : this.renderEmpty()}
        </Drawer>
      </StyleProvider>
    );
  }
}

const mapStateToProps = (state: AppState): StoreProps => {
  return {
    auth: state.auth,
    childList: state.children.isNotLoaded ? null : Object.keys(state.children).map(k => state.children[k].child),
    child: state.currentChild ? state.children[state.currentChild] : null,
    errors: state.errors
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
  return bindActionCreators({
    ...authActions,
    ...childActions,
    ...failureActions
  }, dispatch);
};

const styles = {
  drawer: {
    drawer: {
      backgroundColor: theme.variables.defaultBg,
      shadowColor: '#000',
      shadowOpacity: 0.8,
      shadowRadius: 0
    }
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.variables.toolbarHeight
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);