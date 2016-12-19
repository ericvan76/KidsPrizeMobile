/* @flow */

import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Drawer, Container, Header, Title, Content, Button, Icon, Spinner, Text } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';
import * as childActions from '../actions/child';
import * as failureActions from '../actions/failure';
import ScoreListView from './ScoreListView';
import DrawerBar from './DrawerBar';
import { LaunchRoute, EditChildRoute } from '../routes';
import { alert } from '../utils/alert';
import theme from '../themes';

import type { AppState, AuthState, WeeklyScoresState } from '../types/states.flow';

type StoreProps = {
  auth: AuthState,
  childList: ?Array<Child>,
  child: ?Child,
  weeklyScores: WeeklyScoresState,
  errors: Error[]
}

type ActionProps = {
  switchChild: (childId: string) => void,
  listChildrenAsync: () => void,
  logoutAsync: () => void,
  refreshAsync: (childId: string) => void,
  fetchMoreAsync: (childId: string) => void,
  setScoreAsync: (childId: string, date: string, task: string, value: number) => void,
  resetFailure: () => void
};

type Props = StoreProps & ActionProps & {
  navigator: Object
}

class MainView extends Component {

  props: Props;

  constructor(props: Props) {
    super(props);
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
      this.refs.drawer.open();
    } else if (this.props.child && Object.keys(this.props.weeklyScores).length === 0) {
      this.props.refreshAsync(this.props.child.id);
    }
  }

  renderDrawer() {
    if (!this.props.auth.profile) {
      return <Container theme={theme}></Container>;
    }
    return (
      <DrawerBar
        navigator={this.props.navigator}
        drawer={this.refs.drawer}
        profile={this.props.auth.profile}
        childList={this.props.childList}
        ></DrawerBar>
    );
  }

  render() {
    let mainElem = null;
    if (!this.props.child || Object.keys(this.props.weeklyScores).length === 0) {
      var spinnerOrHint = this.props.childList
        ? <Text style={{ color: theme.subtitleColor, marginTop: -1 * theme.toolbarHeight }}>No Child</Text>
        : <Spinner inverse size='small' style={{ marginTop: -1 * theme.toolbarHeight }} animating={!this.props.childList} />;
      mainElem = (
        <Container theme={theme} style={{ backgroundColor: theme.backgroundColor }}>
          <Header>
            <Button transparent header onPress={() => this.refs.drawer.open()}>
              <Icon name='ios-menu' />
            </Button>
            <Title></Title>
          </Header>
          <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {spinnerOrHint}
          </Content>
        </Container>
      );
    } else {
      mainElem = (
        <Container theme={theme} style={{ backgroundColor: theme.backgroundColor }}>
          <Header onPress={() => this.refs.listView.scrollToTop()} >
            <Button transparent header onPress={() => this.refs.drawer.open()}>
              <Icon name='ios-menu' />
            </Button>
            <Title ellipsizeMode='tail' numberOfLines={1}>{this.props.child.name}</Title>
            <Button transparent header
              onPress={() => this.props.navigator.push(new EditChildRoute({ childId: this.props.child.id }))}>
              <Icon name='ios-settings-outline' />
            </Button>
          </Header>
          <Content horizontal={true} scrollEnabled={false}>
            <ScoreListView
              ref='listView'
              style={{
                flex: 1, width: theme.screenWidth
              }} child={this.props.child}
              rows={this.props.weeklyScores}
              refreshAsync={this.props.refreshAsync}
              fetchMoreAsync={this.props.fetchMoreAsync}
              setScoreAsync={this.props.setScoreAsync} />
          </Content>
        </Container>
      );
    }
    return (
      <Drawer
        ref='drawer'
        type='overlay'
        content={this.renderDrawer()}
        tapToClose
        openDrawerOffset={0.2}
        styles={{
          drawer: {
            backgroundColor: theme.inverseTextColor,
            shadowColor: theme.shadowColor,
            shadowOpacity: theme.shadowOpacity,
            shadowRadius: 0
          }
        }}
        tweenHandler={(ratio: number) => {
          return {
            drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
            main: { opacity: (2 - ratio) / 2 },
          };
        } }
        negotiatePan>
        {mainElem}
      </Drawer>
    );
  }
}

const mapStateToProps = (state: AppState): StoreProps => {
  return {
    auth: state.auth,
    childList: state.children.isNotLoaded ? null : Object.keys(state.children).map(k => state.children[k].child),
    child: state.currentChild ? state.children[state.currentChild].child : null,
    weeklyScores: state.currentChild ? state.children[state.currentChild].weeklyScores : {},
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

export default connect(mapStateToProps, mapDispatchToProps)(MainView);